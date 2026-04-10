// Google Ads API client
// Collects campaign performance data from Google Ads API
//
// Required env vars:
//   GOOGLE_ADS_DEVELOPER_TOKEN  - Developer token from MCC
//   GOOGLE_ADS_CLIENT_ID        - OAuth2 client ID
//   GOOGLE_ADS_CLIENT_SECRET    - OAuth2 client secret
//   GOOGLE_ADS_REFRESH_TOKEN    - OAuth2 refresh token
//   GOOGLE_ADS_CUSTOMER_ID      - Customer ID (no dashes)
//   GOOGLE_ADS_MCC_ID           - Manager account ID (optional, no dashes)

const GOOGLE_ADS_API_VERSION = 'v23';

// Get fresh access token from refresh token
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
  const data = await res.json();
  return data.access_token;
}

// Execute a GAQL query against Google Ads API
async function gaqlQuery(query, accessToken) {
  const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID.replace(/-/g, '');
  const mccId = process.env.GOOGLE_ADS_MCC_ID?.replace(/-/g, '');

  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
    'Content-Type': 'application/json',
  };
  if (mccId) headers['login-customer-id'] = mccId;

  const res = await fetch(
    `https://googleads.googleapis.com/${GOOGLE_ADS_API_VERSION}/customers/${customerId}/googleAds:searchStream`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({ query }),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Google Ads API error: ${res.status} ${error}`);
  }

  const data = await res.json();
  // searchStream returns array of batches
  const rows = [];
  if (Array.isArray(data)) {
    for (const batch of data) {
      if (batch.results) rows.push(...batch.results);
    }
  }
  return rows;
}

// Get current date in Paris timezone as YYYY-MM-DD
function getParisDate(daysAgo = 0) {
  const now = new Date();
  const paris = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
  paris.setDate(paris.getDate() - daysAgo);
  const y = paris.getFullYear();
  const m = String(paris.getMonth() + 1).padStart(2, '0');
  const d = String(paris.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getParisMonthStart() {
  const now = new Date();
  const paris = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
  const y = paris.getFullYear();
  const m = String(paris.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}-01`;
}

export async function collectGoogleAdsData() {
  const requiredVars = [
    'GOOGLE_ADS_DEVELOPER_TOKEN',
    'GOOGLE_ADS_CLIENT_ID',
    'GOOGLE_ADS_CLIENT_SECRET',
    'GOOGLE_ADS_REFRESH_TOKEN',
    'GOOGLE_ADS_CUSTOMER_ID',
  ];

  const missing = requiredVars.filter(v => !process.env[v]);
  if (missing.length > 0) {
    return {
      available: false,
      message: `Google Ads API not configured. Missing: ${missing.join(', ')}`,
    };
  }

  try {
    const accessToken = await getAccessToken();

    const todayStr = getParisDate(0);
    const monthStartStr = getParisMonthStart();

    // Fetch campaign performance for today and month
    const [todayRows, monthRows, searchTermRows] = await Promise.all([
      // Today campaign metrics
      gaqlQuery(`
        SELECT
          campaign.id,
          campaign.name,
          campaign.status,
          campaign.advertising_channel_type,
          metrics.cost_micros,
          metrics.impressions,
          metrics.clicks,
          metrics.conversions,
          metrics.conversions_value,
          metrics.average_cpc,
          metrics.ctr,
          metrics.average_cost
        FROM campaign
        WHERE segments.date = '${todayStr}'
          AND campaign.status != 'REMOVED'
        ORDER BY metrics.cost_micros DESC
      `, accessToken),

      // Month-to-date campaign metrics
      gaqlQuery(`
        SELECT
          campaign.id,
          campaign.name,
          metrics.cost_micros,
          metrics.impressions,
          metrics.clicks,
          metrics.conversions,
          metrics.conversions_value
        FROM campaign
        WHERE segments.date BETWEEN '${monthStartStr}' AND '${todayStr}'
          AND campaign.status != 'REMOVED'
        ORDER BY metrics.cost_micros DESC
      `, accessToken),

      // Top search terms today
      gaqlQuery(`
        SELECT
          search_term_view.search_term,
          metrics.cost_micros,
          metrics.impressions,
          metrics.clicks,
          metrics.conversions,
          campaign.name
        FROM search_term_view
        WHERE segments.date = '${todayStr}'
        ORDER BY metrics.cost_micros DESC
        LIMIT 20
      `, accessToken),
    ]);

    // Process campaign rows
    const processCampaignRows = (rows) => {
      return rows.map(row => {
        const spend = (parseInt(row.campaign?.id ? row.metrics?.costMicros || 0 : 0)) / 1_000_000;
        return {
          campaignId: row.campaign?.id,
          campaignName: row.campaign?.name || 'Unknown',
          status: row.campaign?.status,
          channelType: row.campaign?.advertisingChannelType,
          spend,
          impressions: parseInt(row.metrics?.impressions || 0),
          clicks: parseInt(row.metrics?.clicks || 0),
          conversions: parseFloat(row.metrics?.conversions || 0),
          revenue: parseFloat(row.metrics?.conversionsValue || 0),
          cpc: (parseInt(row.metrics?.averageCpc || 0)) / 1_000_000,
          ctr: parseFloat(row.metrics?.ctr || 0),
          roas: spend > 0 ? (parseFloat(row.metrics?.conversionsValue || 0) / spend).toFixed(2) : '0',
        };
      });
    };

    const todayCampaigns = processCampaignRows(todayRows);
    const monthCampaigns = processCampaignRows(monthRows);

    // Process search terms
    const searchTerms = searchTermRows.map(row => ({
      term: row.searchTermView?.searchTerm,
      campaign: row.campaign?.name,
      spend: (parseInt(row.metrics?.costMicros || 0)) / 1_000_000,
      impressions: parseInt(row.metrics?.impressions || 0),
      clicks: parseInt(row.metrics?.clicks || 0),
      conversions: parseFloat(row.metrics?.conversions || 0),
    }));

    const sumCampaigns = (campaigns) => ({
      totalSpend: campaigns.reduce((s, c) => s + c.spend, 0),
      totalImpressions: campaigns.reduce((s, c) => s + c.impressions, 0),
      totalClicks: campaigns.reduce((s, c) => s + c.clicks, 0),
      totalConversions: campaigns.reduce((s, c) => s + c.conversions, 0),
      totalRevenue: campaigns.reduce((s, c) => s + c.revenue, 0),
    });

    return {
      available: true,
      today: {
        campaigns: todayCampaigns,
        totals: sumCampaigns(todayCampaigns),
      },
      month: {
        campaigns: monthCampaigns,
        totals: sumCampaigns(monthCampaigns),
      },
      searchTerms,
    };
  } catch (error) {
    return {
      available: false,
      error: error.message,
    };
  }
}
