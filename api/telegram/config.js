// Ads Optimizer Configuration for BeatPush
// Adapt thresholds and campaign IDs to your business

export const CONFIG = {
  // Business context for AI analysis
  business: {
    name: 'BeatPush',
    description: 'Music promotion SaaS — Beatport chart placements, playlist pitching, DJ network promo',
    currency: 'USD',
    markets: ['Global'],
    averageOrderValue: 480, // ~$480 average across all packs
  },

  // Pack definitions for reporting
  packs: {
    '50': { label: '50 Copies', price: 240 },
    '100': { label: '100 Copies', price: 480 },
    '200': { label: '200 Copies', price: 960 },
    '500': { label: '500 Copies', price: 1900 },
    '1000': { label: '1000 Copies', price: 3850 },
    'daily-push': { label: 'Daily Push', price: 55 },
    'exclusive-800': { label: 'Top 10 Campaign', price: 920 },
    'promo-430': { label: 'Top 100 Campaign', price: 430 },
  },

  // Meta Ads configuration
  meta: {
    pixelId: '1297686318926626',
    // Campaign IDs to track (fill in when you have API access)
    campaigns: {},
  },

  // Google Ads configuration
  google: {
    conversionTag: 'AW-18044938875',
    // Campaign IDs to track (fill in when you have API access)
    campaigns: {},
  },

  // Telegram
  telegram: {
    reportTime: '20:00', // Paris time
    timezone: 'Europe/Paris',
  },

  // ROAS thresholds
  thresholds: {
    roasTarget: 3.0,
    roasGood: 5.0,
    roasBad: 1.0,
    minSpendBeforeJudging: 50, // $ minimum spent before judging a campaign
    alertBudgetPct: 120, // Alert if spend > 120% of daily budget
  },

  // Reporting periods
  periods: {
    daily: 1,
    weekly: 7,
    monthly: 30,
  },
};
