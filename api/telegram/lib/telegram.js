// Telegram Bot — Send reports and handle commands
// Uses Telegram Bot API to send formatted messages to a channel

const TELEGRAM_API = 'https://api.telegram.org/bot';

async function sendTelegramMessage(text, chatId, botToken, parseMode = 'HTML') {
  // Telegram max message length is 4096
  const chunks = splitMessage(text, 4096);

  for (const chunk of chunks) {
    // Keep chat_id as string to preserve large negative IDs (e.g. -100xxx for channels)
    const res = await fetch(`${TELEGRAM_API}${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: String(chatId),
        text: chunk,
        parse_mode: parseMode,
        disable_web_page_preview: true,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Telegram error: ${res.status} ${error} (chat_id: ${String(chatId)})`);
    }
  }
}

function splitMessage(text, maxLength) {
  if (text.length <= maxLength) return [text];

  const chunks = [];
  const lines = text.split('\n');
  let current = '';

  for (const line of lines) {
    if (current.length + line.length + 1 > maxLength) {
      chunks.push(current);
      current = line;
    } else {
      current += (current ? '\n' : '') + line;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

// Star rating based on ROAS
function roasStars(roas) {
  const r = parseFloat(roas);
  if (r > 5) return '⭐⭐⭐⭐⭐';
  if (r > 3) return '⭐⭐⭐⭐';
  if (r > 2) return '⭐⭐⭐';
  if (r > 1) return '⭐⭐';
  return '⭐';
}

function trendEmoji(trend) {
  if (trend === 'up') return '📈';
  if (trend === 'down') return '📉';
  return '➡️';
}

function formatCurrency(amount, currency = '$') {
  return `${currency}${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

// Build the daily report message
export function buildDailyReport(data) {
  const { supabase, meta, google, analysis } = data;
  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' });

  let report = '';

  // Header
  report += `📊 <b>BEATPUSH</b> — ${dateStr}\n`;
  report += `🏥 Santé : <b>${analysis.health_score}/100</b> ${trendEmoji(analysis.health_trend)}\n`;
  report += `\n💬 <i>${analysis.summary}</i>\n`;

  // ━━ META ADS ━━━━━━━━━━━━━━━━
  report += `\n━━ 📘 META ADS ━━━━━━━━━━━━━━━━\n`;
  if (meta?.available && meta.yesterday?.campaigns?.length > 0) {
    const mt = meta.yesterday.totals;
    report += `💰 Dépensé hier : ${formatCurrency(mt.totalSpend)}\n`;
    report += `👁️ Impressions : ${mt.totalImpressions.toLocaleString()}\n`;
    report += `🖱️ Clics : ${mt.totalClicks} | CPC moy : ${formatCurrency(mt.avgCpc)}\n`;
    report += `🛒 Conversions : ${mt.totalConversions} | CA : ${formatCurrency(mt.totalRevenue)}\n`;
    const metaRoas = mt.totalSpend > 0 ? (mt.totalRevenue / mt.totalSpend).toFixed(1) : '0';
    report += `📊 ROAS : ${metaRoas}x ${roasStars(metaRoas)}\n`;

    // Campaign details
    for (const c of meta.yesterday.campaigns) {
      if (c.spend > 0) {
        report += `\n   📌 <b>${c.campaignName}</b>\n`;
        report += `   ${formatCurrency(c.spend)} | ${c.clicks} clics | ${c.conversions} conv | ROAS ${c.roas}x\n`;
      }
    }

    // Month totals
    if (meta.month?.totals) {
      const mm = meta.month.totals;
      report += `\n   📅 Mois : ${formatCurrency(mm.totalSpend)} dépensé | ${formatCurrency(mm.totalRevenue)} CA | ${mm.totalConversions} conv\n`;
    }
  } else {
    report += `⚠️ ${meta?.message || meta?.error || 'Non connecté'}\n`;
  }

  // ━━ GOOGLE ADS ━━━━━━━━━━━━━━
  report += `\n━━ 🔍 GOOGLE ADS ━━━━━━━━━━━━━━\n`;
  if (google?.available && google.yesterday?.campaigns?.length > 0) {
    const gt = google.yesterday.totals;
    report += `💰 Dépensé hier : ${formatCurrency(gt.totalSpend)}\n`;
    report += `👁️ Impressions : ${gt.totalImpressions.toLocaleString()}\n`;
    report += `🖱️ Clics : ${gt.totalClicks}\n`;
    report += `🛒 Conversions : ${gt.totalConversions} | CA : ${formatCurrency(gt.totalRevenue)}\n`;
    const gRoas = gt.totalSpend > 0 ? (gt.totalRevenue / gt.totalSpend).toFixed(1) : '0';
    report += `📊 ROAS : ${gRoas}x ${roasStars(gRoas)}\n`;

    for (const c of google.yesterday.campaigns) {
      if (c.spend > 0) {
        report += `\n   📌 <b>${c.campaignName}</b>\n`;
        report += `   ${formatCurrency(c.spend)} | ${c.clicks} clics | ${c.conversions} conv | ROAS ${c.roas}x\n`;
      }
    }

    // Top search terms
    if (google.searchTerms?.length > 0) {
      report += `\n   🔎 Top termes recherche :\n`;
      for (const t of google.searchTerms.slice(0, 5)) {
        report += `   • "${t.term}" — ${t.clicks} clics, ${formatCurrency(t.spend)}, ${t.conversions} conv\n`;
      }
    }

    if (google.month?.totals) {
      const gm = google.month.totals;
      report += `\n   📅 Mois : ${formatCurrency(gm.totalSpend)} dépensé | ${formatCurrency(gm.totalRevenue)} CA | ${gm.totalConversions} conv\n`;
    }
  } else {
    report += `⚠️ ${google?.message || google?.error || 'Non connecté'}\n`;
  }

  // ━━ COMMANDES / CA ━━━━━━━━━━━━
  report += `\n━━ 💰 COMMANDES / CA ━━━━━━━━━━━\n`;
  const s = supabase;
  report += `📦 Aujourd'hui : ${s.today.count} commande(s) — ${formatCurrency(s.today.revenue)}\n`;
  report += `📦 Hier : ${s.yesterday.count} commande(s) — ${formatCurrency(s.yesterday.revenue)}\n`;
  report += `📅 Ce mois : ${s.month.count} commande(s) — ${formatCurrency(s.month.revenue)}\n`;

  // Breakdown by pack
  if (Object.keys(s.today.byPack).length > 0 || Object.keys(s.month.byPack).length > 0) {
    report += `\n   📋 Répartition mois par pack :\n`;
    const packLabels = {
      '50': '50 Copies ($240)',
      '100': '100 Copies ($480)',
      '200': '200 Copies ($960)',
      '500': '500 Copies ($1900)',
      '1000': '1000 Copies ($3850)',
      'daily-push': 'Daily Push ($55/j)',
      'exclusive-800': 'Top 10 ($920)',
      'promo-430': 'Top 100 ($430+)',
    };
    for (const [pack, count] of Object.entries(s.month.byPack).sort((a, b) => b[1] - a[1])) {
      report += `   • ${packLabels[pack] || pack} : ${count}x\n`;
    }
  }

  // Top genres
  if (Object.keys(s.month.byGenre).length > 0) {
    report += `\n   🎵 Top genres ce mois :\n`;
    const sortedGenres = Object.entries(s.month.byGenre).sort((a, b) => b[1] - a[1]).slice(0, 5);
    for (const [genre, count] of sortedGenres) {
      report += `   • ${genre} : ${count}x\n`;
    }
  }

  // ━━ FUNNEL ━━━━━━━━━━━━━━━━━
  report += `\n━━ 🔄 FUNNEL (24h) ━━━━━━━━━━━━\n`;
  report += `🔍 Recherches : ${s.funnel.searches}\n`;
  report += `🎯 Sélections : ${s.funnel.selections}\n`;
  report += `🛒 Conversions : ${s.funnel.conversionsToday}\n`;
  report += `📊 Taux conversion : ${s.funnel.conversionRate}%\n`;

  // ━━ UTILISATEURS ━━━━━━━━━━━━
  report += `\n━━ 👥 UTILISATEURS ━━━━━━━━━━━━━\n`;
  report += `👤 Total : ${s.users.total}\n`;
  report += `🆕 Nouveaux aujourd'hui : ${s.users.newToday}\n`;
  report += `📱 Mobile : ${s.users.byDevice.mobile} | 💻 Desktop : ${s.users.byDevice.desktop}\n`;

  // Top countries
  if (Object.keys(s.users.byCountry).length > 0) {
    report += `\n   🌍 Top pays :\n`;
    const sortedCountries = Object.entries(s.users.byCountry).sort((a, b) => b[1] - a[1]).slice(0, 5);
    for (const [country, count] of sortedCountries) {
      report += `   • ${country} : ${count}\n`;
    }
  }

  // ━━ ANALYSE IA ━━━━━━━━━━━━━━
  if (analysis.highlights?.length > 0 || analysis.warnings?.length > 0) {
    report += `\n━━ 🧠 ANALYSE IA ━━━━━━━━━━━━━━\n`;

    if (analysis.highlights?.length > 0) {
      for (const h of analysis.highlights) {
        report += `✅ ${h}\n`;
      }
    }
    if (analysis.warnings?.length > 0) {
      for (const w of analysis.warnings) {
        report += `🚨 ${w}\n`;
      }
    }
  }

  // ━━ SUGGESTIONS ━━━━━━━━━━━━━
  if (analysis.recommendations?.length > 0) {
    report += `\n━━ 💡 SUGGESTIONS ━━━━━━━━━━━━━\n`;
    for (const r of analysis.recommendations) {
      report += `💡 ${r}\n`;
    }
  }

  report += `\n🤖 BeatPush Ads Analyzer v1`;

  return report;
}

// Build response for /ads command
export function buildAdsResponse(data) {
  const { meta, google } = data;
  let msg = `📊 <b>ADS — Temps réel</b>\n\n`;

  if (meta?.available) {
    const mt = meta.yesterday?.totals;
    msg += `📘 <b>Meta Ads (hier)</b>\n`;
    msg += `   Dépensé: ${formatCurrency(mt?.totalSpend || 0)} | Conv: ${mt?.totalConversions || 0} | ROAS: ${mt?.totalSpend > 0 ? ((mt?.totalRevenue || 0) / mt.totalSpend).toFixed(1) : '0'}x\n\n`;
  } else {
    msg += `📘 Meta Ads: Non connecté\n\n`;
  }

  if (google?.available) {
    const gt = google.yesterday?.totals;
    msg += `🔍 <b>Google Ads (hier)</b>\n`;
    msg += `   Dépensé: ${formatCurrency(gt?.totalSpend || 0)} | Conv: ${gt?.totalConversions || 0} | ROAS: ${gt?.totalSpend > 0 ? ((gt?.totalRevenue || 0) / gt.totalSpend).toFixed(1) : '0'}x\n`;
  } else {
    msg += `🔍 Google Ads: Non connecté\n`;
  }

  return msg;
}

// Build response for /ca command
export function buildRevenueResponse(supabase) {
  let msg = `💰 <b>CHIFFRE D'AFFAIRES</b>\n\n`;
  msg += `📦 Aujourd'hui : ${supabase.today.count} commandes — ${formatCurrency(supabase.today.revenue)}\n`;
  msg += `📦 Hier : ${supabase.yesterday.count} commandes — ${formatCurrency(supabase.yesterday.revenue)}\n`;
  msg += `📅 Ce mois : ${supabase.month.count} commandes — ${formatCurrency(supabase.month.revenue)}\n`;

  if (Object.keys(supabase.month.byPack).length > 0) {
    msg += `\n📋 <b>Par pack (mois) :</b>\n`;
    for (const [pack, count] of Object.entries(supabase.month.byPack).sort((a, b) => b[1] - a[1])) {
      msg += `   • ${pack}: ${count}x\n`;
    }
  }

  return msg;
}

// Build help response
export function buildHelpResponse() {
  return `🤖 <b>BeatPush Ads Analyzer</b>

Commandes disponibles :

/ads — Vue globale des campagnes (Meta + Google)
/ca — Chiffre d'affaires et commandes
/report — Forcer un rapport quotidien complet
/help — Cette aide

📊 Rapport automatique quotidien à 20h00 (Paris).`;
}

export async function sendReport(text, overrideChatId) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = overrideChatId || process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    throw new Error('TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are required');
  }

  await sendTelegramMessage(text, chatId, botToken);
}
