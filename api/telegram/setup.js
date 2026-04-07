// Telegram Bot Setup — Register webhook and commands
// Call this endpoint once after deployment to configure the bot
//
// GET /api/telegram/setup?secret=YOUR_CRON_SECRET
//   - Registers the webhook URL
//   - Sets up bot commands menu

import { CONFIG } from './config.js';

const TELEGRAM_API = 'https://api.telegram.org/bot';

export default async function handler(req, res) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && req.query?.secret !== cronSecret) {
    return res.status(401).json({ error: 'Unauthorized — pass ?secret=YOUR_CRON_SECRET' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return res.status(500).json({ error: 'TELEGRAM_BOT_TOKEN not set' });
  }

  const results = {};

  // 1. Set webhook
  const host = req.headers.host || req.headers['x-forwarded-host'];
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const webhookUrl = `${protocol}://${host}/api/telegram/webhook`;

  try {
    const webhookRes = await fetch(`${TELEGRAM_API}${botToken}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ['message'],
        drop_pending_updates: true,
      }),
    });
    results.webhook = await webhookRes.json();
  } catch (e) {
    results.webhook = { error: e.message };
  }

  // 2. Register commands menu
  try {
    const commandsRes = await fetch(`${TELEGRAM_API}${botToken}/setMyCommands`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        commands: CONFIG.telegram.commands,
      }),
    });
    results.commands = await commandsRes.json();
  } catch (e) {
    results.commands = { error: e.message };
  }

  // 3. Get bot info
  try {
    const meRes = await fetch(`${TELEGRAM_API}${botToken}/getMe`);
    results.botInfo = await meRes.json();
  } catch (e) {
    results.botInfo = { error: e.message };
  }

  return res.status(200).json({
    success: true,
    webhookUrl,
    ...results,
  });
}
