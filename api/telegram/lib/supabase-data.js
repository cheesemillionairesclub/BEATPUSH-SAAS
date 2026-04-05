// Supabase data collection for daily reports
// Fetches orders, revenue, user stats from Supabase

const SUPABASE_URL = 'https://wrdbhyypbpppzrtyacvw.supabase.co';

async function supabaseFetch(path, serviceKey) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
    },
  });
  if (!res.ok) throw new Error(`Supabase error: ${res.status} ${await res.text()}`);
  return res.json();
}

// Get start/end of a day in UTC (adjusted from Paris timezone)
function getDayRange(daysAgo = 0) {
  const now = new Date();
  const paris = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
  paris.setDate(paris.getDate() - daysAgo);
  paris.setHours(0, 0, 0, 0);
  const start = new Date(paris.toISOString());
  paris.setHours(23, 59, 59, 999);
  const end = new Date(paris.toISOString());
  return { start: start.toISOString(), end: end.toISOString() };
}

// Get start of month in Paris timezone
function getMonthStart() {
  const now = new Date();
  const paris = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
  paris.setDate(1);
  paris.setHours(0, 0, 0, 0);
  return new Date(paris.toISOString()).toISOString();
}

export async function collectSupabaseData(serviceKey) {
  const today = getDayRange(0);
  const yesterday = getDayRange(1);
  const monthStart = getMonthStart();

  // Fetch all data in parallel
  const [todayOrders, yesterdayOrders, monthOrders, allProfiles, recentActivity] = await Promise.all([
    // Today's orders
    supabaseFetch(
      `orders?created_at=gte.${today.start}&created_at=lte.${today.end}&select=*&order=created_at.desc`,
      serviceKey
    ),
    // Yesterday's orders
    supabaseFetch(
      `orders?created_at=gte.${yesterday.start}&created_at=lte.${yesterday.end}&select=*&order=created_at.desc`,
      serviceKey
    ),
    // Month orders
    supabaseFetch(
      `orders?created_at=gte.${monthStart}&select=*&order=created_at.desc`,
      serviceKey
    ),
    // User profiles (for stats)
    supabaseFetch(
      `profiles?select=id,country,device_type,created_at&order=created_at.desc`,
      serviceKey
    ),
    // Recent track activity (last 24h for funnel)
    supabaseFetch(
      `track_activity?created_at=gte.${yesterday.start}&select=*&order=created_at.desc`,
      serviceKey
    ),
  ]);

  // Process orders into stats
  const processOrders = (orders) => {
    const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0) / 100;
    const byPack = {};
    const byGenre = {};
    const byStatus = { in_progress: 0, completed: 0 };

    for (const order of orders) {
      const pack = order.pack || 'unknown';
      byPack[pack] = (byPack[pack] || 0) + 1;

      const genre = order.genre || 'unknown';
      byGenre[genre] = (byGenre[genre] || 0) + 1;

      const status = order.order_status || 'in_progress';
      byStatus[status] = (byStatus[status] || 0) + 1;
    }

    return {
      count: orders.length,
      revenue: totalRevenue,
      byPack,
      byGenre,
      byStatus,
      orders,
    };
  };

  // Process activity funnel
  const searches = recentActivity.filter(a => a.activity_type === 'search').length;
  const selections = recentActivity.filter(a => a.activity_type === 'select').length;

  // New users today
  const newUsersToday = allProfiles.filter(p => {
    const created = new Date(p.created_at);
    return created >= new Date(today.start) && created <= new Date(today.end);
  });

  // Country distribution (month)
  const countryStats = {};
  for (const profile of allProfiles) {
    const country = profile.country || 'Unknown';
    countryStats[country] = (countryStats[country] || 0) + 1;
  }

  // Device distribution
  const deviceStats = { mobile: 0, desktop: 0 };
  for (const profile of allProfiles) {
    const device = profile.device_type || 'desktop';
    deviceStats[device] = (deviceStats[device] || 0) + 1;
  }

  return {
    today: processOrders(todayOrders),
    yesterday: processOrders(yesterdayOrders),
    month: processOrders(monthOrders),
    funnel: {
      searches,
      selections,
      conversionsToday: todayOrders.length,
      conversionRate: searches > 0 ? ((todayOrders.length / searches) * 100).toFixed(1) : '0',
    },
    users: {
      total: allProfiles.length,
      newToday: newUsersToday.length,
      byCountry: countryStats,
      byDevice: deviceStats,
    },
  };
}
