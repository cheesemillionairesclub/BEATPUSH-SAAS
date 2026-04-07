// Google Ads Campaign Manager — Create, pause, resume, update campaigns
// Uses Google Ads API v17 to manage campaigns
//
// Required env vars (same as google-ads.js):
//   GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET,
//   GOOGLE_ADS_REFRESH_TOKEN, GOOGLE_ADS_CUSTOMER_ID, GOOGLE_ADS_MCC_ID (optional)

const GOOGLE_ADS_API_VERSION = 'v23';

async function getAccessToken() {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_ADS_CLIENT_ID,
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });
  if (!res.ok) throw new Error(`Google OAuth error: ${res.status} ${await res.text()}`);
  return (await res.json()).access_token;
}

function getHeaders(accessToken) {
  const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID.replace(/-/g, '');
  const mccId = process.env.GOOGLE_ADS_MCC_ID?.replace(/-/g, '');
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
    'Content-Type': 'application/json',
  };
  if (mccId) headers['login-customer-id'] = mccId;
  return { headers, customerId };
}

async function gaqlQuery(query, accessToken) {
  const { headers, customerId } = getHeaders(accessToken);
  const res = await fetch(
    `https://googleads.googleapis.com/${GOOGLE_ADS_API_VERSION}/customers/${customerId}/googleAds:searchStream`,
    { method: 'POST', headers, body: JSON.stringify({ query }) }
  );
  if (!res.ok) throw new Error(`Google Ads API error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  const rows = [];
  if (Array.isArray(data)) {
    for (const batch of data) {
      if (batch.results) rows.push(...batch.results);
    }
  }
  return rows;
}

async function mutateCampaign(operations, accessToken) {
  const { headers, customerId } = getHeaders(accessToken);
  const res = await fetch(
    `https://googleads.googleapis.com/${GOOGLE_ADS_API_VERSION}/customers/${customerId}/campaigns:mutate`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({ operations }),
    }
  );
  if (!res.ok) throw new Error(`Google Ads mutate error: ${res.status} ${await res.text()}`);
  return res.json();
}

async function mutateCampaignBudget(operations, accessToken) {
  const { headers, customerId } = getHeaders(accessToken);
  const res = await fetch(
    `https://googleads.googleapis.com/${GOOGLE_ADS_API_VERSION}/customers/${customerId}/campaignBudgets:mutate`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({ operations }),
    }
  );
  if (!res.ok) throw new Error(`Google Ads budget mutate error: ${res.status} ${await res.text()}`);
  return res.json();
}

// List all active/paused campaigns
export async function listCampaigns() {
  const requiredVars = ['GOOGLE_ADS_DEVELOPER_TOKEN', 'GOOGLE_ADS_CLIENT_ID', 'GOOGLE_ADS_CLIENT_SECRET', 'GOOGLE_ADS_REFRESH_TOKEN', 'GOOGLE_ADS_CUSTOMER_ID'];
  const missing = requiredVars.filter(v => !process.env[v]);
  if (missing.length > 0) return { error: `Google Ads non configuré. Manque: ${missing.join(', ')}` };

  const accessToken = await getAccessToken();

  const rows = await gaqlQuery(`
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      campaign.advertising_channel_type,
      campaign_budget.amount_micros,
      campaign_budget.resource_name,
      campaign.start_date,
      campaign.end_date
    FROM campaign
    WHERE campaign.status IN ('ENABLED', 'PAUSED')
    ORDER BY campaign.name
  `, accessToken);

  return rows.map(row => ({
    id: row.campaign.id,
    resourceName: row.campaign.resourceName,
    name: row.campaign.name,
    status: row.campaign.status,
    channelType: row.campaign.advertisingChannelType,
    dailyBudget: row.campaignBudget?.amountMicros
      ? (parseInt(row.campaignBudget.amountMicros) / 1_000_000).toFixed(2)
      : null,
    budgetResourceName: row.campaignBudget?.resourceName,
    startDate: row.campaign.startDate,
    endDate: row.campaign.endDate,
  }));
}

// Pause a campaign
export async function pauseCampaign(campaignResourceName) {
  const accessToken = await getAccessToken();
  return mutateCampaign([{
    update: {
      resourceName: campaignResourceName,
      status: 'PAUSED',
    },
    updateMask: 'status',
  }], accessToken);
}

// Resume (enable) a campaign
export async function resumeCampaign(campaignResourceName) {
  const accessToken = await getAccessToken();
  return mutateCampaign([{
    update: {
      resourceName: campaignResourceName,
      status: 'ENABLED',
    },
    updateMask: 'status',
  }], accessToken);
}

// Update campaign budget (amount in dollars)
export async function updateCampaignBudget(budgetResourceName, dailyBudgetDollars) {
  const accessToken = await getAccessToken();
  const amountMicros = Math.round(dailyBudgetDollars * 1_000_000);
  return mutateCampaignBudget([{
    update: {
      resourceName: budgetResourceName,
      amountMicros: String(amountMicros),
    },
    updateMask: 'amount_micros',
  }], accessToken);
}

// Create a new Search campaign
export async function createCampaign({ name, dailyBudget, channelType = 'SEARCH' }) {
  const accessToken = await getAccessToken();
  const { customerId } = getHeaders(accessToken);
  const amountMicros = Math.round(dailyBudget * 1_000_000);

  // First create the budget
  const budgetResult = await mutateCampaignBudget([{
    create: {
      name: `${name} Budget`,
      amountMicros: String(amountMicros),
      deliveryMethod: 'STANDARD',
    },
  }], accessToken);

  const budgetResourceName = budgetResult.results[0].resourceName;

  // Then create the campaign (PAUSED for safety)
  const campaignResult = await mutateCampaign([{
    create: {
      name,
      status: 'PAUSED',
      advertisingChannelType: channelType,
      campaignBudget: budgetResourceName,
      manualCpc: {},
      networkSettings: {
        targetGoogleSearch: true,
        targetSearchNetwork: true,
        targetContentNetwork: false,
      },
    },
  }], accessToken);

  return {
    campaign: campaignResult.results[0],
    budget: budgetResult.results[0],
  };
}

// Get real-time spend for today
export async function getTodaySpend() {
  const requiredVars = ['GOOGLE_ADS_DEVELOPER_TOKEN', 'GOOGLE_ADS_CLIENT_ID', 'GOOGLE_ADS_CLIENT_SECRET', 'GOOGLE_ADS_REFRESH_TOKEN', 'GOOGLE_ADS_CUSTOMER_ID'];
  const missing = requiredVars.filter(v => !process.env[v]);
  if (missing.length > 0) return { error: 'Google Ads non configuré' };

  const accessToken = await getAccessToken();
  const today = new Date().toISOString().split('T')[0];

  const rows = await gaqlQuery(`
    SELECT
      campaign.id,
      campaign.name,
      metrics.cost_micros,
      metrics.impressions,
      metrics.clicks,
      metrics.conversions,
      metrics.conversions_value
    FROM campaign
    WHERE segments.date = '${today}'
      AND campaign.status != 'REMOVED'
    ORDER BY metrics.cost_micros DESC
  `, accessToken);

  const campaigns = rows.map(row => ({
    name: row.campaign?.name || 'Unknown',
    id: row.campaign?.id,
    spend: (parseInt(row.metrics?.costMicros || 0)) / 1_000_000,
    impressions: parseInt(row.metrics?.impressions || 0),
    clicks: parseInt(row.metrics?.clicks || 0),
    conversions: parseFloat(row.metrics?.conversions || 0),
    revenue: parseFloat(row.metrics?.conversionsValue || 0),
  }));

  const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
  const totalRevenue = campaigns.reduce((s, c) => s + c.revenue, 0);
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);

  return { campaigns, totalSpend, totalRevenue, totalConversions };
}
