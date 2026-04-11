// Google Analytics 4 Data API client
// Collects website analytics: sessions, users, countries, bounce rate, traffic sources
// Uses REST API directly (no npm dependency needed) — same pattern as google-ads.js
//
// Required env vars:
//   GA4_PROPERTY_ID          - GA4 property ID (e.g. 123456789)
//   GA4_CLIENT_EMAIL         - Service account email
//   GA4_PRIVATE_KEY          - Service account private key (PEM format)

import crypto from 'crypto';

// Build a JWT and exchange it for an access token (service account flow)
async function getAccessToken() {
  const clientEmail = process.env.GA4_CLIENT_EMAIL;
  const privateKey = process.env.GA4_PRIVATE_KEY.replace(/\\n/g, '\n');
  const scope = 'https://www.googleapis.com/auth/analytics.readonly';

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: clientEmail,
    scope,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };

  const encode = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const unsigned = `${encode(header)}.${encode(payload)}`;

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(unsigned);
  const signature = sign.sign(privateKey, 'base64url');

  const jwt = `${unsigned}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!res.ok) throw new Error(`GA4 OAuth error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.access_token;
}

// Run a GA4 Data API report
async function runReport(propertyId, accessToken, body) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`GA4 API error: ${res.status} ${error}`);
  }

  return res.json();
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

// Parse GA4 rows into a simpler format
function parseRows(report, dimNames, metricNames) {
  if (!report.rows) return [];
  return report.rows.map(row => {
    const obj = {};
    (row.dimensionValues || []).forEach((v, i) => {
      obj[dimNames[i]] = v.value;
    });
    (row.metricValues || []).forEach((v, i) => {
      obj[metricNames[i]] = parseFloat(v.value) || 0;
    });
    return obj;
  });
}

export async function collectGA4Data() {
  const requiredVars = ['GA4_PROPERTY_ID', 'GA4_CLIENT_EMAIL', 'GA4_PRIVATE_KEY'];
  const missing = requiredVars.filter(v => !process.env[v]);
  if (missing.length > 0) {
    return {
      available: false,
      message: `GA4 not configured. Missing: ${missing.join(', ')}`,
    };
  }

  try {
    const accessToken = await getAccessToken();
    const propertyId = process.env.GA4_PROPERTY_ID;

    const todayStr = getParisDate(0);
    const yesterdayStr = getParisDate(1);
    const monthStartStr = getParisMonthStart();

    // Run all reports in parallel
    const [overviewToday, overviewYesterday, overviewMonth, countriesToday, countriesYesterday, countriesMonth, sourcesToday, sourcesYesterday, sourcesMonth, pagesToday] = await Promise.all([
      // 1. Today overview: sessions, users, bounce rate, engagement
      runReport(propertyId, accessToken, {
        dateRanges: [{ startDate: todayStr, endDate: todayStr }],
        metrics: [
          { name: 'sessions' },
          { name: 'totalUsers' },
          { name: 'newUsers' },
          { name: 'bounceRate' },
          { name: 'averageSessionDuration' },
          { name: 'screenPageViews' },
          { name: 'engagedSessions' },
          { name: 'conversions' },
        ],
      }),

      // 1b. Yesterday overview
      runReport(propertyId, accessToken, {
        dateRanges: [{ startDate: yesterdayStr, endDate: yesterdayStr }],
        metrics: [
          { name: 'sessions' },
          { name: 'totalUsers' },
          { name: 'newUsers' },
          { name: 'bounceRate' },
          { name: 'averageSessionDuration' },
          { name: 'screenPageViews' },
          { name: 'engagedSessions' },
          { name: 'conversions' },
        ],
      }),

      // 2. Month-to-date overview
      runReport(propertyId, accessToken, {
        dateRanges: [{ startDate: monthStartStr, endDate: todayStr }],
        metrics: [
          { name: 'sessions' },
          { name: 'totalUsers' },
          { name: 'newUsers' },
          { name: 'bounceRate' },
          { name: 'screenPageViews' },
          { name: 'conversions' },
        ],
      }),

      // 3. Top countries today (ordered by activeUsers to match GA4 dashboard)
      runReport(propertyId, accessToken, {
        dateRanges: [{ startDate: todayStr, endDate: todayStr }],
        dimensions: [{ name: 'country' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'conversions' },
        ],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 10,
      }),

      // 3b. Top countries yesterday
      runReport(propertyId, accessToken, {
        dateRanges: [{ startDate: yesterdayStr, endDate: yesterdayStr }],
        dimensions: [{ name: 'country' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'conversions' },
        ],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 10,
      }),

      // 3c. Top countries month
      runReport(propertyId, accessToken, {
        dateRanges: [{ startDate: monthStartStr, endDate: todayStr }],
        dimensions: [{ name: 'country' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'conversions' },
        ],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 10,
      }),

      // 4. Traffic sources today
      runReport(propertyId, accessToken, {
        dateRanges: [{ startDate: todayStr, endDate: todayStr }],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [
          { name: 'sessions' },
          { name: 'totalUsers' },
          { name: 'bounceRate' },
          { name: 'conversions' },
        ],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 10,
      }),

      // 4b. Traffic sources yesterday
      runReport(propertyId, accessToken, {
        dateRanges: [{ startDate: yesterdayStr, endDate: yesterdayStr }],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [
          { name: 'sessions' },
          { name: 'totalUsers' },
          { name: 'bounceRate' },
          { name: 'conversions' },
        ],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 10,
      }),

      // 4c. Traffic sources month
      runReport(propertyId, accessToken, {
        dateRanges: [{ startDate: monthStartStr, endDate: todayStr }],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [
          { name: 'sessions' },
          { name: 'totalUsers' },
          { name: 'bounceRate' },
          { name: 'conversions' },
        ],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 10,
      }),

      // 5. Top pages today
      runReport(propertyId, accessToken, {
        dateRanges: [{ startDate: todayStr, endDate: todayStr }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'sessions' },
          { name: 'bounceRate' },
        ],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10,
      }),
    ]);

    // Parse overview metrics (single row, no dimensions)
    const parseOverview = (report) => {
      const row = report.rows?.[0];
      if (!row) return null;
      const m = row.metricValues.map(v => parseFloat(v.value) || 0);
      return {
        sessions: m[0],
        users: m[1],
        newUsers: m[2],
        bounceRate: m[3],
        avgSessionDuration: m[4] || 0,
        pageViews: m[5] || 0,
        engagedSessions: m[6] || 0,
        conversions: m[7] || 0,
      };
    };

    const parseMonthOverview = (report) => {
      const row = report.rows?.[0];
      if (!row) return null;
      const m = row.metricValues.map(v => parseFloat(v.value) || 0);
      return {
        sessions: m[0],
        users: m[1],
        newUsers: m[2],
        bounceRate: m[3],
        pageViews: m[4],
        conversions: m[5],
      };
    };

    const countries = parseRows(
      countriesToday,
      ['country'],
      ['users', 'sessions', 'conversions']
    );

    const countriesYesterdayData = parseRows(
      countriesYesterday,
      ['country'],
      ['users', 'sessions', 'conversions']
    );

    const countriesMonthData = parseRows(
      countriesMonth,
      ['country'],
      ['users', 'sessions', 'conversions']
    );

    const sources = parseRows(
      sourcesToday,
      ['channel'],
      ['sessions', 'users', 'bounceRate', 'conversions']
    );

    const sourcesYesterdayData = parseRows(
      sourcesYesterday,
      ['channel'],
      ['sessions', 'users', 'bounceRate', 'conversions']
    );

    const sourcesMonthData = parseRows(
      sourcesMonth,
      ['channel'],
      ['sessions', 'users', 'bounceRate', 'conversions']
    );

    const pages = parseRows(
      pagesToday,
      ['pagePath'],
      ['pageViews', 'sessions', 'bounceRate']
    );

    return {
      available: true,
      today: parseOverview(overviewToday),
      yesterday: parseOverview(overviewYesterday),
      month: parseMonthOverview(overviewMonth),
      countries,
      countriesYesterday: countriesYesterdayData,
      countriesMonth: countriesMonthData,
      sources,
      sourcesYesterday: sourcesYesterdayData,
      sourcesMonth: sourcesMonthData,
      pages,
    };
  } catch (error) {
    return {
      available: false,
      error: error.message,
    };
  }
}
