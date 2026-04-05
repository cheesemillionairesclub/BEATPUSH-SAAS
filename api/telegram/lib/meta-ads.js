// Meta (Facebook) Ads API client
// Collects campaign performance data from Meta Marketing API
//
// Required env vars:
//   META_ADS_ACCESS_TOKEN - Long-lived access token
//   META_ADS_ACCOUNT_ID  - Ad account ID (act_XXXXX)
//
// To get these:
// 1. Go to developers.facebook.com → Create App → Business type
// 2. Add "Marketing API" product
// 3. Tools → Get Token → select ads_read permission
// 4. Exchange for long-lived token (60 days) via:
//    GET /oauth/access_token?grant_type=fb_exchange_token&client_id={app_id}&client_secret={app_secret}&fb_exchange_token={short_token}
// 5. Ad Account ID is in Ads Manager URL or via /me/adaccounts

const META_API_VERSION = 'v21.0';
const META_API_BASE = `https://graph.facebook.com/${META_API_VERSION}`;

async function metaFetch(endpoint, accessToken, params = {}) {
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

// Format date as YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d;
}

function getMonthStart() {
  const d = new Date();
  d.setDate(1);
  return d;
}

export async function collectMetaAdsData() {
  const accessToken = process.env.META_ADS_ACCESS_TOKEN;
  const accountId = process.env.META_ADS_ACCOUNT_ID;

  if (!accessToken || !accountId) {
    return {
      available: false,
      message: 'Meta Ads API not configured. Set META_ADS_ACCESS_TOKEN and META_ADS_ACCOUNT_ID.',
    };
  }

  try {
    const yesterday = formatDate(getYesterday());
    const today = formatDate(new Date());
    const monthStart = formatDate(getMonthStart());

    // Fetch campaign-level insights for yesterday and month-to-date in parallel
    const [yesterdayInsights, monthInsights, campaignDetails] = await Promise.all([
      // Yesterday's performance
      metaFetch(`/${accountId}/insights`, accessToken, {
        time_range: { since: yesterday, until: yesterday },
        fields: 'campaign_name,campaign_id,spend,impressions,clicks,cpc,cpm,ctr,actions,action_values,cost_per_action_type,frequency',
        level: 'campaign',
        limit: 100,
      }),
      // Month-to-date
      metaFetch(`/${accountId}/insights`, accessToken, {
        time_range: { since: monthStart, until: today },
        fields: 'campaign_name,campaign_id,spend,impressions,clicks,cpc,cpm,ctr,actions,action_values,cost_per_action_type,frequency',
        level: 'campaign',
        limit: 100,
      }),
      // Active campaigns
      metaFetch(`/${accountId}/campaigns`, accessToken, {
        fields: 'name,status,daily_budget,lifetime_budget,objective,bid_strategy',
        filtering: [{ field: 'effective_status', operator: 'IN', value: ['ACTIVE', 'PAUSED'] }],
        limit: 100,
      }),
    ]);

    // Process insights
    const processInsights = (data) => {
      if (!data.data || data.data.length === 0) return [];

      return data.data.map(campaign => {
        const purchases = campaign.actions?.find(a =>
          a.action_type === 'purchase' || a.action_type === 'offsite_conversion.fb_pixel_purchase'
        );
        const purchaseValue = campaign.action_values?.find(a =>
          a.action_type === 'purchase' || a.action_type === 'offsite_conversion.fb_pixel_purchase'
        );
        const leads = campaign.actions?.find(a =>
          a.action_type === 'lead' || a.action_type === 'offsite_conversion.fb_pixel_lead'
        );
        const linkClicks = campaign.actions?.find(a => a.action_type === 'link_click');
        const pageViews = campaign.actions?.find(a =>
          a.action_type === 'landing_page_view'
        );

        const spend = parseFloat(campaign.spend || 0);
        const revenue = parseFloat(purchaseValue?.value || 0);

        return {
          campaignName: campaign.campaign_name,
          campaignId: campaign.campaign_id,
          spend,
          impressions: parseInt(campaign.impressions || 0),
          clicks: parseInt(campaign.clicks || 0),
          cpc: parseFloat(campaign.cpc || 0),
          cpm: parseFloat(campaign.cpm || 0),
          ctr: parseFloat(campaign.ctr || 0),
          frequency: parseFloat(campaign.frequency || 0),
          conversions: parseInt(purchases?.value || 0),
          revenue,
          roas: spend > 0 ? (revenue / spend).toFixed(2) : '0',
          leads: parseInt(leads?.value || 0),
          linkClicks: parseInt(linkClicks?.value || 0),
          landingPageViews: parseInt(pageViews?.value || 0),
        };
      });
    };

    const yesterdayCampaigns = processInsights(yesterdayInsights);
    const monthCampaigns = processInsights(monthInsights);

    // Totals
    const sumCampaigns = (campaigns) => ({
      totalSpend: campaigns.reduce((s, c) => s + c.spend, 0),
      totalImpressions: campaigns.reduce((s, c) => s + c.impressions, 0),
      totalClicks: campaigns.reduce((s, c) => s + c.clicks, 0),
      totalConversions: campaigns.reduce((s, c) => s + c.conversions, 0),
      totalRevenue: campaigns.reduce((s, c) => s + c.revenue, 0),
      avgCpc: campaigns.length > 0
        ? (campaigns.reduce((s, c) => s + c.spend, 0) / Math.max(campaigns.reduce((s, c) => s + c.clicks, 0), 1)).toFixed(2)
        : '0',
    });

    return {
      available: true,
      yesterday: {
        campaigns: yesterdayCampaigns,
        totals: sumCampaigns(yesterdayCampaigns),
      },
      month: {
        campaigns: monthCampaigns,
        totals: sumCampaigns(monthCampaigns),
      },
      activeCampaigns: campaignDetails.data || [],
    };
  } catch (error) {
    return {
      available: false,
      error: error.message,
    };
  }
}
