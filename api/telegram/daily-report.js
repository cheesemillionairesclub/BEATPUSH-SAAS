// Daily Report — Vercel Cron Job endpoint
// Triggered daily at 20:00 Paris time (18:00 UTC)
// Collects all data, analyzes with Claude, sends Telegram report

import { collectSupabaseData } from './lib/supabase-data.js';
import { collectMetaAdsData } from './lib/meta-ads.js';
import { collectGoogleAdsData } from './lib/google-ads.js';
import { collectStripeData } from './lib/stripe-data.js';
import { analyzeWithClaude } from './lib/brain.js';
import { buildDailyReport, sendReport } from './lib/telegram.js';

export default async function handler(req, res) {
  // Verify this is a cron call or authorized request
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;

  // Allow Vercel cron (sends Authorization: Bearer <CRON_SECRET>)
  // Also allow manual trigger with same secret as query param
  const isAuthorized =
    authHeader === `Bearer ${cronSecret}` ||
    req.query?.secret === cronSecret ||
    req.headers['x-vercel-cron'] === '1';

  if (cronSecret && !isAuthorized) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
      return res.status(500).json({ error: 'SUPABASE_SERVICE_ROLE_KEY not configured' });
    }

    // Collect all data in parallel
    const [supabase, meta, google] = await Promise.all([
      collectSupabaseData(serviceKey),
      collectMetaAdsData(),
      collectGoogleAdsData(),
    ]);

    // Enrich with Stripe data (real amounts and subscription statuses)
    const stripeData = await collectStripeData(supabase.allOrders || []);

    // Analyze with Claude AI
    const analysis = await analyzeWithClaude({ supabase, meta, google });

    // Build the report
    const report = buildDailyReport({ supabase, meta, google, analysis, stripe: stripeData });

    // Send to Telegram
    await sendReport(report);

    return res.status(200).json({
      success: true,
      message: 'Daily report sent to Telegram',
      health_score: analysis.health_score,
      orders_today: supabase.today.count,
      revenue_today: supabase.today.revenue,
      meta_available: meta.available || false,
      google_available: google.available || false,
    });
  } catch (error) {
    console.error('Daily report error:', error);

    // Try to send error notification to Telegram
    try {
      await sendReport(`🚨 <b>ERREUR rapport quotidien</b>\n\n${error.message}`);
    } catch (telegramError) {
      console.error('Failed to send error to Telegram:', telegramError);
    }

    return res.status(500).json({ error: error.message });
  }
}
