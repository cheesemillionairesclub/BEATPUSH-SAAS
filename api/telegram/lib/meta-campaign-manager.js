// Meta Ads Campaign Manager — Create, pause, resume, update campaigns
// Uses the Meta Marketing API to manage campaigns, ad sets, and ads
//
// Required env vars (same as meta-ads.js):
//   META_ADS_ACCESS_TOKEN - Long-lived access token with ads_management permission
//   META_ADS_ACCOUNT_ID  - Ad account ID (act_XXXXX)
//   META_ADS_PAGE_ID     - Facebook Page ID (for ad creatives)

import { CONFIG } from './config.js';

const META_API_VERSION = 'v21.0';
const META_API_BASE = `https://graph.facebook.com/${META_API_VERSION}`;

const isBeatpushCampaign = (name) => CONFIG.campaignNameFilter.test(name || '');

async function metaPost(endpoint, accessToken, body = {}) {
  const res = await fetch(`${META_API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token: accessToken, ...body }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Meta API error: ${res.status} ${error}`);
  }
  return res.json();
}

async function metaGet(endpoint, accessToken, params = {}) {
  const url = new URL(`${META_API_BASE}${endpoint}`);
  url.searchParams.set('access_token', accessToken);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, typeof value === 'object' ? JSON.stringify(value) : value);
  }
  const res = await fetch(url.toString());
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Meta API error: ${res.status} ${error}`);
  }
  return res.json();
}

// List all campaigns with status
export async function listCampaigns() {
  const accessToken = process.env.META_ADS_ACCESS_TOKEN;
  const accountId = process.env.META_ADS_ACCOUNT_ID;

  if (!accessToken || !accountId) {
    return { error: 'META_ADS_ACCESS_TOKEN et META_ADS_ACCOUNT_ID requis' };
  }

  const data = await metaGet(`/${accountId}/campaigns`, accessToken, {
    fields: 'name,status,effective_status,daily_budget,lifetime_budget,objective,bid_strategy,start_time,stop_time,budget_remaining',
    filtering: JSON.stringify([{ field: 'effective_status', operator: 'IN', value: ['ACTIVE', 'PAUSED', 'CAMPAIGN_PAUSED'] }]),
    limit: 50,
  });

  return (data.data || []).map(c => ({
    id: c.id,
    name: c.name,
    status: c.effective_status,
    dailyBudget: c.daily_budget ? (parseInt(c.daily_budget) / 100).toFixed(2) : null,
    lifetimeBudget: c.lifetime_budget ? (parseInt(c.lifetime_budget) / 100).toFixed(2) : null,
    budgetRemaining: c.budget_remaining ? (parseInt(c.budget_remaining) / 100).toFixed(2) : null,
    objective: c.objective,
    bidStrategy: c.bid_strategy,
    startTime: c.start_time,
    stopTime: c.stop_time,
  }));
}

// Pause a campaign
export async function pauseCampaign(campaignId) {
  const accessToken = process.env.META_ADS_ACCESS_TOKEN;
  if (!accessToken) throw new Error('META_ADS_ACCESS_TOKEN requis');

  return metaPost(`/${campaignId}`, accessToken, { status: 'PAUSED' });
}

// Resume (activate) a campaign
export async function resumeCampaign(campaignId) {
  const accessToken = process.env.META_ADS_ACCESS_TOKEN;
  if (!accessToken) throw new Error('META_ADS_ACCESS_TOKEN requis');

  return metaPost(`/${campaignId}`, accessToken, { status: 'ACTIVE' });
}

// Update campaign daily budget (amount in dollars)
export async function updateCampaignBudget(campaignId, dailyBudgetDollars) {
  const accessToken = process.env.META_ADS_ACCESS_TOKEN;
  if (!accessToken) throw new Error('META_ADS_ACCESS_TOKEN requis');

  // Meta API expects budget in cents
  const budgetCents = Math.round(dailyBudgetDollars * 100);
  return metaPost(`/${campaignId}`, accessToken, { daily_budget: budgetCents });
}

// Create a new campaign
export async function createCampaign({ name, objective = 'OUTCOME_SALES', dailyBudget, bidStrategy = 'LOWEST_COST_WITHOUT_CAP' }) {
  const accessToken = process.env.META_ADS_ACCESS_TOKEN;
  const accountId = process.env.META_ADS_ACCOUNT_ID;

  if (!accessToken || !accountId) {
    throw new Error('META_ADS_ACCESS_TOKEN et META_ADS_ACCOUNT_ID requis');
  }

  const budgetCents = Math.round(dailyBudget * 100);

  const campaign = await metaPost(`/${accountId}/campaigns`, accessToken, {
    name,
    objective,
    status: 'PAUSED', // Start paused for safety
    special_ad_categories: [],
    daily_budget: budgetCents,
    bid_strategy: bidStrategy,
  });

  return campaign;
}

// Create ad set for a campaign
export async function createAdSet({
  campaignId,
  name,
  dailyBudget,
  targetCountries = ['US', 'GB', 'DE', 'FR', 'NL', 'ES', 'BR', 'MX', 'CO'],
  ageMin = 18,
  ageMax = 55,
  interests = [],
  optimizationGoal = 'OFFSITE_CONVERSIONS',
  billingEvent = 'IMPRESSIONS',
  pixelId,
}) {
  const accessToken = process.env.META_ADS_ACCESS_TOKEN;
  const accountId = process.env.META_ADS_ACCOUNT_ID;
  const pixel = pixelId || process.env.META_ADS_PIXEL_ID;

  if (!accessToken || !accountId) {
    throw new Error('META_ADS_ACCESS_TOKEN et META_ADS_ACCOUNT_ID requis');
  }

  const targeting = {
    geo_locations: { countries: targetCountries },
    age_min: ageMin,
    age_max: ageMax,
  };

  if (interests.length > 0) {
    targeting.flexible_spec = [{ interests }];
  }

  const body = {
    campaign_id: campaignId,
    name,
    status: 'PAUSED',
    daily_budget: Math.round(dailyBudget * 100),
    billing_event: billingEvent,
    optimization_goal: optimizationGoal,
    targeting,
    promoted_object: pixel ? { pixel_id: pixel, custom_event_type: 'PURCHASE' } : undefined,
  };

  return metaPost(`/${accountId}/adsets`, accessToken, body);
}

// Get real-time spend for today (account level)
export async function getTodaySpend() {
  const accessToken = process.env.META_ADS_ACCESS_TOKEN;
  const accountId = process.env.META_ADS_ACCOUNT_ID;

  if (!accessToken || !accountId) {
    return { error: 'Meta Ads non configuré' };
  }

  const today = new Date().toISOString().split('T')[0];

  const data = await metaGet(`/${accountId}/insights`, accessToken, {
    time_range: JSON.stringify({ since: today, until: today }),
    fields: 'campaign_name,campaign_id,spend,impressions,clicks,actions,action_values',
    level: 'campaign',
    limit: 100,
  });

  const campaigns = (data.data || [])
    .filter(c => isBeatpushCampaign(c.campaign_name))
    .map(c => {
      const purchases = c.actions?.find(a =>
        a.action_type === 'purchase' || a.action_type === 'offsite_conversion.fb_pixel_purchase'
      );
      const revenue = c.action_values?.find(a =>
        a.action_type === 'purchase' || a.action_type === 'offsite_conversion.fb_pixel_purchase'
      );

      return {
        name: c.campaign_name,
        id: c.campaign_id,
        spend: parseFloat(c.spend || 0),
        impressions: parseInt(c.impressions || 0),
        clicks: parseInt(c.clicks || 0),
        conversions: parseInt(purchases?.value || 0),
        revenue: parseFloat(revenue?.value || 0),
      };
    });

  const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
  const totalRevenue = campaigns.reduce((s, c) => s + c.revenue, 0);
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);

  return { campaigns, totalSpend, totalRevenue, totalConversions };
}
