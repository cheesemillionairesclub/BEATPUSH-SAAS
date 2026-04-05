// Telegram Webhook — Handles interactive commands from Telegram
// Set webhook URL via: https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://yoursite.com/api/telegram/webhook

import { collectSupabaseData } from './lib/supabase-data.js';
import { collectMetaAdsData } from './lib/meta-ads.js';
import { collectGoogleAdsData } from './lib/google-ads.js';
import { analyzeWithClaude } from './lib/brain.js';
import {
  buildDailyReport,
  buildAdsResponse,
  buildRevenueResponse,
  buildHelpResponse,
  sendReport,
} from './lib/telegram.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const update = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const message = update?.message;

    if (!message?.text) {
      return res.status(200).json({ ok: true });
    }

    const chatId = message.chat.id;
    const allowedChatId = process.env.TELEGRAM_CHAT_ID;

    // Only respond to the configured chat/channel
    if (allowedChatId && String(chatId) !== String(allowedChatId)) {
      return res.status(200).json({ ok: true });
    }

    const command = message.text.trim().toLowerCase().split(' ')[0];
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    let responseText = '';

    switch (command) {
      case '/ads': {
        const [meta, google] = await Promise.all([
          collectMetaAdsData(),
          collectGoogleAdsData(),
        ]);
        responseText = buildAdsResponse({ meta, google });
        break;
      }

      case '/ca': {
        const supabase = await collectSupabaseData(serviceKey);
        responseText = buildRevenueResponse(supabase);
        break;
      }

      case '/report': {
        const [supabase, meta, google] = await Promise.all([
          collectSupabaseData(serviceKey),
          collectMetaAdsData(),
          collectGoogleAdsData(),
        ]);
        const analysis = await analyzeWithClaude({ supabase, meta, google });
        responseText = buildDailyReport({ supabase, meta, google, analysis });
        break;
      }

      case '/help':
      case '/start': {
        responseText = buildHelpResponse();
        break;
      }

      default: {
        // Ignore non-command messages
        return res.status(200).json({ ok: true });
      }
    }

    if (responseText) {
      await sendReport(responseText);
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    try {
      await sendReport(`🚨 <b>Erreur commande</b>\n\n${error.message}`);
    } catch (e) {
      console.error('Failed to send error:', e);
    }
    return res.status(200).json({ ok: true }); // Always 200 for Telegram
  }
}
