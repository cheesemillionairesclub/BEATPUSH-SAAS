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
    // Default targeting for new campaigns
    defaultTargeting: {
      countries: ['US', 'GB', 'DE', 'FR', 'NL', 'ES', 'BR', 'MX', 'CO', 'AR', 'CL'],
      ageMin: 18,
      ageMax: 55,
      // Music producer interests (Meta audience IDs)
      interests: [
        { id: '6003246649498', name: 'Electronic dance music' },
        { id: '6003013067741', name: 'Beatport' },
        { id: '6003347032806', name: 'Music production' },
        { id: '6003107902433', name: 'DJ' },
        { id: '6003017809555', name: 'Ableton Live' },
        { id: '6003389062498', name: 'FL Studio' },
      ],
    },
    // Campaign naming convention
    namingTemplate: 'BP-{objective}-{genre}-{date}',
  },

  // Google Ads configuration
  google: {
    conversionTag: 'AW-18044938875',
    // Default keywords for music promo campaigns
    defaultKeywords: [
      'beatport promotion',
      'music promotion service',
      'beatport chart promotion',
      'edm promotion',
      'techno promotion',
      'house music promotion',
      'beatport top 100',
      'music marketing service',
      'dj promo pool',
      'electronic music promotion',
    ],
    // Negative keywords to exclude
    negativeKeywords: [
      'free',
      'download',
      'torrent',
      'pirate',
      'crack',
    ],
  },

  // Telegram
  telegram: {
    reportTime: '20:00', // Paris time
    timezone: 'Europe/Paris',
    commands: [
      { command: 'ads', description: 'Vue globale des campagnes' },
      { command: 'site', description: 'Analytics site (visiteurs, pays, rebond)' },
      { command: 'spend', description: 'Dépenses temps réel' },
      { command: 'ca', description: 'Chiffre d\'affaires' },
      { command: 'clients', description: 'Nouveaux clients et funnel' },
      { command: 'status', description: 'Statut des campagnes' },
      { command: 'report', description: 'Rapport complet + IA' },
      { command: 'create', description: 'Créer une campagne' },
      { command: 'pause', description: 'Pauser une campagne' },
      { command: 'resume', description: 'Relancer une campagne' },
      { command: 'budget', description: 'Modifier un budget' },
      { command: 'check', description: 'Diagnostic connexions' },
      { command: 'help', description: 'Aide' },
    ],
  },

  // ROAS thresholds
  thresholds: {
    roasTarget: 3.0,
    roasGood: 5.0,
    roasBad: 1.0,
    minSpendBeforeJudging: 50, // $ minimum spent before judging a campaign
    alertBudgetPct: 120, // Alert if spend > 120% of daily budget
    maxDailyBudget: 500, // Safety: max daily budget allowed via Telegram
  },

  // Reporting periods
  periods: {
    daily: 1,
    weekly: 7,
    monthly: 30,
  },
};
