// Telegram Webhook — Handles interactive commands from Telegram
// Set webhook URL via: https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://yoursite.com/api/telegram/webhook

import { collectSupabaseData } from './lib/supabase-data.js';
import { collectMetaAdsData } from './lib/meta-ads.js';
import { collectGoogleAdsData } from './lib/google-ads.js';
import { collectGA4Data } from './lib/google-analytics.js';
import { collectStripeData } from './lib/stripe-data.js';
import { analyzeWithClaude } from './lib/brain.js';
import {
  buildDailyReport,
  buildAdsResponse,
  buildRevenueResponse,
  buildSiteResponse,
  buildHelpResponse,
  sendReport,
} from './lib/telegram.js';
import * as metaManager from './lib/meta-campaign-manager.js';
import * as googleManager from './lib/google-campaign-manager.js';
import { buildEnvCheckMessage } from './lib/env-check.js';

function formatCurrency(amount) {
  return `$${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

// Escape HTML entities to prevent Telegram parse errors
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .substring(0, 200); // Truncate long error messages
}

// Build /status response — all campaigns from both platforms
async function buildStatusResponse() {
  const [metaCampaigns, googleCampaigns] = await Promise.all([
    metaManager.listCampaigns().catch(e => ({ error: e.message })),
    googleManager.listCampaigns().catch(e => ({ error: e.message })),
  ]);

  let msg = `📋 <b>STATUT DES CAMPAGNES</b>\n\n`;

  // Meta
  msg += `📘 <b>Meta Ads</b>\n`;
  if (metaCampaigns.error) {
    msg += `   ⚠️ ${escapeHtml(metaCampaigns.error)}\n`;
  } else if (Array.isArray(metaCampaigns) && metaCampaigns.length > 0) {
    for (const c of metaCampaigns) {
      const statusIcon = c.status === 'ACTIVE' ? '🟢' : c.status === 'PAUSED' ? '🟡' : '⚪';
      const budget = c.dailyBudget ? `${formatCurrency(c.dailyBudget)}/j` : 'N/A';
      msg += `   ${statusIcon} <b>${c.name}</b>\n`;
      msg += `   ID: ${c.id} | Budget: ${budget} | ${c.objective || ''}\n\n`;
    }
  } else {
    msg += `   Aucune campagne trouvée\n`;
  }

  // Google
  msg += `\n🔍 <b>Google Ads</b>\n`;
  if (googleCampaigns.error) {
    msg += `   ⚠️ ${escapeHtml(googleCampaigns.error)}\n`;
  } else if (Array.isArray(googleCampaigns) && googleCampaigns.length > 0) {
    for (const c of googleCampaigns) {
      const statusIcon = c.status === 'ENABLED' ? '🟢' : c.status === 'PAUSED' ? '🟡' : '⚪';
      const budget = c.dailyBudget ? `${formatCurrency(c.dailyBudget)}/j` : 'N/A';
      msg += `   ${statusIcon} <b>${c.name}</b>\n`;
      msg += `   ID: ${c.id} | Budget: ${budget} | ${c.channelType || ''}\n\n`;
    }
  } else {
    msg += `   Aucune campagne trouvée\n`;
  }

  return msg;
}

// Build /spend response — real-time spend today, conversions from Stripe
async function buildSpendResponse(serviceKey) {
  const [metaSpend, googleSpend, spendSupabase] = await Promise.all([
    metaManager.getTodaySpend().catch(e => ({ error: e.message })),
    googleManager.getTodaySpend().catch(e => ({ error: e.message })),
    collectSupabaseData(serviceKey),
  ]);
  const spendStripe = await collectStripeData(spendSupabase.allOrders || []);

  // Stripe-based conversions for today
  const stripeConvs = spendSupabase.today.count || 0;
  let stripeRevenue = 0;
  if (spendStripe?.available) {
    for (const order of spendSupabase.today.orders || []) {
      if (order.pack === 'daily-push') {
        const subData = spendStripe.subscriptions?.[order.id];
        if (subData) stripeRevenue += subData.totalPaid;
      } else {
        const amountData = spendStripe.oneTimeAmounts?.[order.id];
        stripeRevenue += amountData ? amountData.amountReceived : (order.amount || 0);
      }
    }
  }
  stripeRevenue = stripeRevenue / 100;

  let msg = `💸 <b>DÉPENSES AUJOURD'HUI</b>\n\n`;

  let grandTotalSpend = 0;

  // Meta
  msg += `📘 <b>Meta Ads</b>\n`;
  if (metaSpend.error) {
    msg += `   ⚠️ ${escapeHtml(metaSpend.error)}\n`;
  } else {
    grandTotalSpend += metaSpend.totalSpend || 0;

    msg += `   💰 Total: ${formatCurrency(metaSpend.totalSpend)}\n`;
    if (metaSpend.campaigns?.length > 0) {
      for (const c of metaSpend.campaigns) {
        if (c.spend > 0) {
          msg += `   • ${c.name}: ${formatCurrency(c.spend)} (${c.clicks} clics)\n`;
        }
      }
    }
  }

  // Google
  msg += `\n🔍 <b>Google Ads</b>\n`;
  if (googleSpend.error) {
    msg += `   ⚠️ ${escapeHtml(googleSpend.error)}\n`;
  } else {
    grandTotalSpend += googleSpend.totalSpend || 0;

    msg += `   💰 Total: ${formatCurrency(googleSpend.totalSpend)}\n`;
    if (googleSpend.campaigns?.length > 0) {
      for (const c of googleSpend.campaigns) {
        if (c.spend > 0) {
          msg += `   • ${c.name}: ${formatCurrency(c.spend)} (${c.clicks} clics)\n`;
        }
      }
    }
  }

  // Grand total with Stripe conversions
  const roas = grandTotalSpend > 0 ? (stripeRevenue / grandTotalSpend).toFixed(1) : '0';
  msg += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💰 <b>TOTAL</b>: ${formatCurrency(grandTotalSpend)} dépensé\n`;
  msg += `🛒 ${stripeConvs} conversions (Stripe) | CA: ${formatCurrency(stripeRevenue)}\n`;
  msg += `📊 ROAS: ${roas}x\n`;

  return msg;
}

// Build /clients response — new clients and activity
async function buildClientsResponse(serviceKey) {
  const supabase = await collectSupabaseData(serviceKey);

  let msg = `👥 <b>CLIENTS & ACTIVITÉ</b>\n\n`;

  // New users
  msg += `🆕 <b>Nouveaux utilisateurs</b>\n`;
  msg += `   Aujourd'hui: ${supabase.users.newToday}\n`;
  msg += `   Total: ${supabase.users.total}\n\n`;

  // Today's orders = new clients who bought
  msg += `🛒 <b>Commandes aujourd'hui</b>\n`;
  if (supabase.today.orders.length > 0) {
    for (const order of supabase.today.orders.slice(0, 10)) {
      const pack = order.pack || '?';
      const amount = order.amount ? formatCurrency(order.amount / 100) : '?';
      const genre = order.genre || '';
      const time = new Date(order.created_at).toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit' });
      msg += `   • ${time} — Pack ${pack} (${amount}) ${genre ? `| ${genre}` : ''}\n`;
    }
    if (supabase.today.orders.length > 10) {
      msg += `   ... et ${supabase.today.orders.length - 10} autres\n`;
    }
  } else {
    msg += `   Aucune commande aujourd'hui\n`;
  }

  // Yesterday comparison
  msg += `\n📊 <b>Comparaison</b>\n`;
  msg += `   Hier: ${supabase.yesterday.count} commandes (${formatCurrency(supabase.yesterday.revenue)})\n`;
  msg += `   Ce mois: ${supabase.month.count} commandes (${formatCurrency(supabase.month.revenue)})\n`;

  // Funnel
  msg += `\n🔄 <b>Funnel (24h)</b>\n`;
  msg += `   Recherches: ${supabase.funnel.searches}\n`;
  msg += `   Sélections: ${supabase.funnel.selections}\n`;
  msg += `   Conversions: ${supabase.funnel.conversionsToday}\n`;
  msg += `   Taux: ${supabase.funnel.conversionRate}%\n`;

  // Top countries
  if (Object.keys(supabase.users.byCountry).length > 0) {
    msg += `\n🌍 <b>Top pays</b>\n`;
    const sorted = Object.entries(supabase.users.byCountry).sort((a, b) => b[1] - a[1]).slice(0, 5);
    for (const [country, count] of sorted) {
      msg += `   • ${country}: ${count}\n`;
    }
  }

  return msg;
}

// Handle /pause <platform> <campaign_id>
async function handlePause(args) {
  const [platform, campaignId] = args.split(' ').filter(Boolean);

  if (!platform || !campaignId) {
    return `⚠️ Usage: /pause meta|google <campaign_id>`;
  }

  if (platform === 'meta') {
    await metaManager.pauseCampaign(campaignId);
    return `⏸️ Campagne Meta <b>${campaignId}</b> mise en pause.`;
  } else if (platform === 'google') {
    const campaigns = await googleManager.listCampaigns();
    const campaign = Array.isArray(campaigns) ? campaigns.find(c => c.id === campaignId) : null;
    if (!campaign) return `❌ Campagne Google ${campaignId} non trouvée.`;
    await googleManager.pauseCampaign(campaign.resourceName);
    return `⏸️ Campagne Google <b>${campaign.name}</b> mise en pause.`;
  }

  return `⚠️ Plateforme invalide. Utilise: meta ou google`;
}

// Handle /resume <platform> <campaign_id>
async function handleResume(args) {
  const [platform, campaignId] = args.split(' ').filter(Boolean);

  if (!platform || !campaignId) {
    return `⚠️ Usage: /resume meta|google <campaign_id>`;
  }

  if (platform === 'meta') {
    await metaManager.resumeCampaign(campaignId);
    return `▶️ Campagne Meta <b>${campaignId}</b> relancée.`;
  } else if (platform === 'google') {
    const campaigns = await googleManager.listCampaigns();
    const campaign = Array.isArray(campaigns) ? campaigns.find(c => c.id === campaignId) : null;
    if (!campaign) return `❌ Campagne Google ${campaignId} non trouvée.`;
    await googleManager.resumeCampaign(campaign.resourceName);
    return `▶️ Campagne Google <b>${campaign.name}</b> relancée.`;
  }

  return `⚠️ Plateforme invalide. Utilise: meta ou google`;
}

// Handle /budget <platform> <campaign_id> <amount>
async function handleBudget(args) {
  const parts = args.split(' ').filter(Boolean);
  const [platform, campaignId, amountStr] = parts;

  if (!platform || !campaignId || !amountStr) {
    return `⚠️ Usage: /budget meta|google <campaign_id> <montant_jour_$>`;
  }

  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    return `⚠️ Montant invalide: ${amountStr}`;
  }

  if (platform === 'meta') {
    await metaManager.updateCampaignBudget(campaignId, amount);
    return `💰 Budget Meta <b>${campaignId}</b> mis à jour: ${formatCurrency(amount)}/jour`;
  } else if (platform === 'google') {
    const campaigns = await googleManager.listCampaigns();
    const campaign = Array.isArray(campaigns) ? campaigns.find(c => c.id === campaignId) : null;
    if (!campaign) return `❌ Campagne Google ${campaignId} non trouvée.`;
    if (!campaign.budgetResourceName) return `❌ Impossible de trouver le budget pour cette campagne.`;
    await googleManager.updateCampaignBudget(campaign.budgetResourceName, amount);
    return `💰 Budget Google <b>${campaign.name}</b> mis à jour: ${formatCurrency(amount)}/jour`;
  }

  return `⚠️ Plateforme invalide. Utilise: meta ou google`;
}

// Handle /create <platform> <name> <daily_budget>
async function handleCreate(args) {
  const parts = args.split(' ').filter(Boolean);
  if (parts.length < 3) {
    return `⚠️ Usage: /create meta|google <nom_campagne> <budget_jour_$>\nExemple: /create meta BeatPush-Techno-Q2 50`;
  }

  const platform = parts[0];
  const budgetStr = parts[parts.length - 1];
  const name = parts.slice(1, -1).join(' ');
  const dailyBudget = parseFloat(budgetStr);

  if (isNaN(dailyBudget) || dailyBudget <= 0) {
    return `⚠️ Budget invalide: ${budgetStr}`;
  }

  if (platform === 'meta') {
    const result = await metaManager.createCampaign({ name, dailyBudget });
    return `✅ Campagne Meta créée !\n\n📌 <b>${name}</b>\nID: ${result.id}\n💰 Budget: ${formatCurrency(dailyBudget)}/jour\n⏸️ Statut: PAUSED (active manuellement quand prêt)\n\n💡 Utilise /resume meta ${result.id} pour lancer.`;
  } else if (platform === 'google') {
    const result = await googleManager.createCampaign({ name, dailyBudget });
    return `✅ Campagne Google créée !\n\n📌 <b>${name}</b>\n🔗 ${result.campaign.resourceName}\n💰 Budget: ${formatCurrency(dailyBudget)}/jour\n⏸️ Statut: PAUSED\n\n💡 Ajoute des ad groups et keywords dans Google Ads.`;
  }

  return `⚠️ Plateforme invalide. Utilise: meta ou google`;
}

function buildExtendedHelpResponse() {
  return `🤖 <b>BeatPush Ads Manager</b>

━━ 📊 RAPPORTS ━━━━━━━━━━━━━━
/ads — Vue globale campagnes (Meta + Google)
/site — Analytics site (visiteurs, pays, rebond)
/spend — Dépenses en temps réel aujourd'hui
/ca — Chiffre d'affaires et commandes
/clients — Nouveaux clients, funnel, activité
/report — Rapport quotidien complet + analyse IA

━━ 🎯 GESTION CAMPAGNES ━━━━━━
/status — Liste de toutes les campagnes
/create meta|google &lt;nom&gt; &lt;budget&gt; — Créer une campagne
/pause meta|google &lt;id&gt; — Mettre en pause
/resume meta|google &lt;id&gt; — Relancer
/budget meta|google &lt;id&gt; &lt;montant&gt; — Modifier le budget

━━ 🔧 SYSTÈME ━━━━━━━━━━━━━━
/check — Diagnostic des connexions API
/help — Cette aide

📊 Rapport automatique quotidien à 20h00 (Paris).
💡 Les campagnes sont créées en PAUSE par sécurité.`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const update = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    // Support both private/group messages AND channel posts
    const message = update?.message || update?.channel_post;

    if (!message?.text) {
      return res.status(200).json({ ok: true });
    }

    const chatId = message.chat.id;
    const allowedChatId = process.env.TELEGRAM_CHAT_ID;

    // Log incoming update for debugging
    console.log(`Telegram webhook: type=${update?.message ? 'message' : 'channel_post'}, chat_id=${chatId}, text="${message.text}", allowed=${allowedChatId}`);

    const text = message.text.trim();
    // Strip @botname suffix from commands (e.g. /help@BeatPushBot → /help)
    const rawCommand = text.toLowerCase().split(' ')[0];
    const command = rawCommand.split('@')[0];
    const args = text.substring(rawCommand.length).trim();
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    let responseText = '';

    switch (command) {
      case '/ads': {
        const [meta, google, adsSupabase] = await Promise.all([
          collectMetaAdsData(),
          collectGoogleAdsData(),
          collectSupabaseData(serviceKey),
        ]);
        const adsStripe = await collectStripeData(adsSupabase.allOrders || []);
        responseText = buildAdsResponse({ meta, google, supabase: adsSupabase, stripe: adsStripe });
        break;
      }

      case '/ca': {
        const supabase = await collectSupabaseData(serviceKey);
        const stripeData = await collectStripeData(supabase.allOrders || []);
        responseText = buildRevenueResponse(supabase, stripeData);
        break;
      }

      case '/site': {
        const ga4 = await collectGA4Data();
        console.log('GA4 result:', JSON.stringify(ga4).substring(0, 500));
        responseText = buildSiteResponse(ga4);
        console.log('Site response length:', responseText.length);
        break;
      }

      case '/report': {
        const [supabase, meta, google, ga4] = await Promise.all([
          collectSupabaseData(serviceKey),
          collectMetaAdsData(),
          collectGoogleAdsData(),
          collectGA4Data(),
        ]);
        const stripeData = await collectStripeData(supabase.allOrders || []);
        const analysis = await analyzeWithClaude({ supabase, meta, google, ga4, stripe: stripeData });
        responseText = buildDailyReport({ supabase, meta, google, ga4, analysis, stripe: stripeData });
        break;
      }

      case '/status': {
        responseText = await buildStatusResponse();
        break;
      }

      case '/spend': {
        responseText = await buildSpendResponse(serviceKey);
        break;
      }

      case '/clients': {
        responseText = await buildClientsResponse(serviceKey);
        break;
      }

      case '/pause': {
        responseText = await handlePause(args);
        break;
      }

      case '/resume': {
        responseText = await handleResume(args);
        break;
      }

      case '/budget': {
        responseText = await handleBudget(args);
        break;
      }

      case '/create': {
        responseText = await handleCreate(args);
        break;
      }

      case '/check': {
        responseText = buildEnvCheckMessage();
        break;
      }

      case '/help':
      case '/start': {
        responseText = buildExtendedHelpResponse();
        break;
      }

      default: {
        // If it looks like a command but wasn't matched, reply with help
        if (text.startsWith('/')) {
          responseText = `❓ Commande inconnue: <b>${command}</b>\n\nTape /help pour voir les commandes disponibles.`;
          break;
        }
        // Ignore non-command messages
        return res.status(200).json({ ok: true });
      }
    }

    if (responseText) {
      // Always send to the configured channel
      await sendReport(responseText);
      // Also reply in the sender's chat if it's different from the configured channel
      if (allowedChatId && String(chatId) !== String(allowedChatId)) {
        await sendReport(responseText, chatId);
      }
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    try {
      await sendReport(`🚨 <b>Erreur commande</b>\n\n${escapeHtml(error.message)}`);
    } catch (e) {
      console.error('Failed to send error:', e);
    }
    return res.status(200).json({ ok: true }); // Always 200 for Telegram
  }
}
