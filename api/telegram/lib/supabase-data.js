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

const DAILY_PUSH_RATE_CENTS = 5500; // $55 per day in cents

// Calculate revenue for a Daily Push subscription
// Active subs: $55 × days from created_at to now
// Cancelled/completed subs: $55 × days from created_at to updated_at
function getDailyPushRevenueCents(order) {
  const start = new Date(order.created_at);
  const end = (order.order_status === 'cancelled' || order.order_status === 'completed')
    ? new Date(order.updated_at || order.created_at)
    : new Date();
  const diffMs = end - start;
  const days = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  return days * DAILY_PUSH_RATE_CENTS;
}

// Calculate how many days a Daily Push subscription has been active today
// Returns 1 if subscription was active during today, 0 otherwise
function isDailyPushActiveOnDate(order, dateStart, dateEnd) {
  const orderStart = new Date(order.created_at);
  const orderEnd = (order.order_status === 'cancelled' || order.order_status === 'completed')
    ? new Date(order.updated_at || order.created_at)
    : new Date();
  // Check if subscription period overlaps with the given date range
  return orderStart <= new Date(dateEnd) && orderEnd >= new Date(dateStart);
}

export async function collectSupabaseData(serviceKey) {
  const today = getDayRange(0);
  const yesterday = getDayRange(1);
  const monthStart = getMonthStart();

  // Fetch all data in parallel — include active Daily Push subs that started before today
  const [todayOrders, yesterdayOrders, monthOrders, activeDailyPushSubs, allProfiles, recentActivity] = await Promise.all([
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
    // All Daily Push subscriptions (active or recently cancelled) — needed for recurring revenue
    supabaseFetch(
      `orders?pack=eq.daily-push&select=*&order=created_at.desc`,
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

  // Process orders into stats — with proper Daily Push revenue calculation
  const processOrders = (orders, periodStart, periodEnd) => {
    // One-time orders: use stored amount
    const oneTimeRevenue = orders
      .filter(o => o.pack !== 'daily-push')
      .reduce((sum, o) => sum + (o.amount || 0), 0) / 100;

    // Daily Push revenue for this period: count $55 for each active sub day within the period
    let dailyPushRevenue = 0;
    for (const sub of activeDailyPushSubs) {
      if (isDailyPushActiveOnDate(sub, periodStart, periodEnd)) {
        // Count days within this period
        const subStart = new Date(sub.created_at);
        const subEnd = (sub.order_status === 'cancelled' || sub.order_status === 'completed')
          ? new Date(sub.updated_at || sub.created_at)
          : new Date();
        const effectiveStart = new Date(Math.max(subStart, new Date(periodStart)));
        const effectiveEnd = new Date(Math.min(subEnd, new Date(periodEnd)));
        const days = Math.max(1, Math.ceil((effectiveEnd - effectiveStart) / (1000 * 60 * 60 * 24)));
        dailyPushRevenue += (days * DAILY_PUSH_RATE_CENTS) / 100;
      }
    }

    const totalRevenue = oneTimeRevenue + dailyPushRevenue;

    const byPack = {};
    const byGenre = {};
    const byStatus = { in_progress: 0, completed: 0, cancelled: 0, active_missing_receipt: 0, complete_for_day: 0 };

    for (const order of orders) {
      const pack = order.pack || 'unknown';
      byPack[pack] = (byPack[pack] || 0) + 1;

      const genre = order.genre || 'unknown';
      byGenre[genre] = (byGenre[genre] || 0) + 1;

      const status = order.order_status || 'in_progress';
      byStatus[status] = (byStatus[status] || 0) + 1;
    }

    // Add active Daily Push subs that started before this period to the count
    const activeDPInPeriod = activeDailyPushSubs.filter(s =>
      isDailyPushActiveOnDate(s, periodStart, periodEnd) &&
      !orders.some(o => o.id === s.id)
    );
    for (const sub of activeDPInPeriod) {
      byPack['daily-push'] = (byPack['daily-push'] || 0) + 1;
    }

    return {
      count: orders.length,
      revenue: totalRevenue,
      oneTimeRevenue,
      dailyPushRevenue,
      byPack,
      byGenre,
      byStatus,
      orders,
      activeDailyPushSubs: activeDailyPushSubs.filter(s => s.order_status === 'active_missing_receipt' || s.order_status === 'complete_for_day').length,
    };
  };

  // Process activity funnel
  const searches = recentActivity.filter(a => a.activity_type === 'search').length;
  const selections = recentActivity.filter(a => a.activity_type === 'select').length;

  // Unique users active in funnel (24h)
  const funnelUserIds = new Set(
    recentActivity.map(a => a.user_id).filter(Boolean)
  );

  // Build a profile lookup map
  const profileMap = new Map();
  for (const p of allProfiles) {
    profileMap.set(p.id, p);
  }

  // Count new users in funnel (profile created today = first visit today) and their devices
  let funnelNewUsers = 0;
  const funnelNewDevices = { mobile: 0, desktop: 0 };
  for (const uid of funnelUserIds) {
    const profile = profileMap.get(uid);
    if (profile) {
      const created = new Date(profile.created_at);
      if (created >= new Date(today.start) && created <= new Date(today.end)) {
        funnelNewUsers++;
        const device = profile.device_type || 'desktop';
        funnelNewDevices[device] = (funnelNewDevices[device] || 0) + 1;
      }
    }
  }

  // New users today (global)
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

  // Collect all unique orders for Stripe enrichment
  const allOrdersMap = new Map();
  for (const o of [...todayOrders, ...yesterdayOrders, ...monthOrders, ...activeDailyPushSubs]) {
    allOrdersMap.set(o.id, o);
  }

  return {
    today: processOrders(todayOrders, today.start, today.end),
    yesterday: processOrders(yesterdayOrders, yesterday.start, yesterday.end),
    month: processOrders(monthOrders, monthStart, new Date().toISOString()),
    allOrders: Array.from(allOrdersMap.values()),
    allDailyPushSubs: activeDailyPushSubs,
    funnel: {
      searches,
      selections,
      conversionsToday: todayOrders.length,
      conversionRate: searches > 0 ? ((todayOrders.length / searches) * 100).toFixed(1) : '0',
      newUsers: funnelNewUsers,
      newDevices: funnelNewDevices,
    },
    users: {
      total: allProfiles.length,
      newToday: newUsersToday.length,
      byCountry: countryStats,
      byDevice: deviceStats,
    },
  };
}
