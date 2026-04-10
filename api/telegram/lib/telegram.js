// Telegram Bot — Send reports and handle commands
// Uses Telegram Bot API to send formatted messages to a channel

const TELEGRAM_API = 'https://api.telegram.org/bot';

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .substring(0, 200);
}

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

// Calculate Stripe-based revenue for a set of orders
function calcStripeRevenue(orders, stripeData) {
  if (!stripeData?.available) return null;

  let oneTimeTotal = 0;
  let subsTotal = 0;

  for (const order of orders) {
    if (order.pack === 'daily-push') {
      const subData = stripeData.subscriptions?.[order.id];
      if (subData) {
        subsTotal += subData.totalPaid;
      }
    } else {
      const amountData = stripeData.oneTimeAmounts?.[order.id];
      if (amountData) {
        oneTimeTotal += amountData.amountReceived;
      } else {
        oneTimeTotal += order.amount || 0;
      }
    }
  }

  return { oneTimeTotal, subsTotal, total: oneTimeTotal + subsTotal };
}

// Check if a subscription is truly active (using Stripe data when available)
function isSubActive(order, stripeData) {
  if (stripeData?.available) {
    const subData = stripeData.subscriptions?.[order.id];
    if (subData) {
      return subData.status === 'active' || subData.status === 'trialing';
    }
  }
  // Fallback to DB status
  return order.order_status !== 'cancelled' && order.order_status !== 'completed';
}

// Get subscription status label for Telegram
function getSubStatusLabel(order, stripeData) {
  if (stripeData?.available) {
    const subData = stripeData.subscriptions?.[order.id];
    if (subData) {
      if (subData.status === 'canceled' || subData.status === 'unpaid') return '❌ Cancelled';
      if (subData.status === 'active' || subData.status === 'trialing') {
        if (order.order_status === 'complete_for_day') return '✅ Complete for the day';
        if (order.order_status === 'active_missing_receipt') return '⚠️ Missing receipt';
        return '✅ Active';
      }
      if (subData.status === 'past_due') return '⚠️ Past due';
      return `❓ ${subData.status}`;
    }
  }
  // Fallback to Supabase status
  if (order.order_status === 'cancelled') return '❌ Cancelled';
  if (order.order_status === 'complete_for_day') return '✅ Complete for the day';
  if (order.order_status === 'active_missing_receipt') return '⚠️ Missing receipt';
  return '✅ Active';
}

// Build the daily report message
export function buildDailyReport(data) {
  const { supabase, meta, google, ga4, analysis, stripe } = data;
  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' });

  let report = '';

  // Header
  report += `📊 <b>BEATPUSH</b> — ${dateStr}\n`;
  report += `🏥 Santé : <b>${analysis.health_score}/100</b> ${trendEmoji(analysis.health_trend)}\n`;
  report += `\n💬 <i>${analysis.summary}</i>\n`;

  // ━━ META ADS + FUNNEL ━━━━━━━━━━━━━━━━
  report += `\n━━ 📘 META ADS + FUNNEL ━━━━━━━━━━\n`;
  if (meta?.available && meta.today?.campaigns?.length > 0) {
    const mt = meta.today.totals;
    report += `💰 Dépensé aujourd'hui : ${formatCurrency(mt.totalSpend)}\n`;
    report += `👁️ Impressions : ${mt.totalImpressions.toLocaleString()}\n`;
    report += `🖱️ Clics : ${mt.totalClicks} | CPC moy : ${formatCurrency(mt.avgCpc)}\n`;
    report += `🛒 Conversions : ${mt.totalConversions} | CA : ${formatCurrency(mt.totalRevenue)}\n`;
    const metaRoas = mt.totalSpend > 0 ? (mt.totalRevenue / mt.totalSpend).toFixed(1) : '0';
    report += `📊 ROAS : ${metaRoas}x ${roasStars(metaRoas)}\n`;

    // Funnel (merged with Meta Ads)
    report += `\n   🔄 <b>Funnel (24h)</b>\n`;
    report += `   🔍 Recherches : ${supabase.funnel.searches}\n`;
    report += `   🎯 Sélections : ${supabase.funnel.selections}\n`;
    report += `   🛒 Conversions : ${supabase.funnel.conversionsToday}\n`;
    report += `   📊 Taux conversion : ${supabase.funnel.conversionRate}%\n`;

    // Campaign details
    for (const c of meta.today.campaigns) {
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
  } else if (meta?.available) {
    report += `✅ Connecté | Aucune campagne active aujourd'hui\n`;
    if (meta.activeCampaigns?.length > 0) {
      const paused = meta.activeCampaigns.filter(c => c.status === 'PAUSED').length;
      const active = meta.activeCampaigns.filter(c => c.status === 'ACTIVE').length;
      report += `   📋 ${active} active${active > 1 ? 's' : ''}, ${paused} en pause\n`;
    }
    // Funnel even without active campaigns
    report += `\n   🔄 <b>Funnel (24h)</b>\n`;
    report += `   🔍 Recherches : ${supabase.funnel.searches}\n`;
    report += `   🎯 Sélections : ${supabase.funnel.selections}\n`;
    report += `   🛒 Conversions : ${supabase.funnel.conversionsToday}\n`;
    report += `   📊 Taux conversion : ${supabase.funnel.conversionRate}%\n`;
  } else {
    report += `⚠️ ${escapeHtml(meta?.message || meta?.error || 'Non connecté')}\n`;
    // Funnel even without Meta Ads
    report += `\n   🔄 <b>Funnel (24h)</b>\n`;
    report += `   🔍 Recherches : ${supabase.funnel.searches}\n`;
    report += `   🎯 Sélections : ${supabase.funnel.selections}\n`;
    report += `   🛒 Conversions : ${supabase.funnel.conversionsToday}\n`;
    report += `   📊 Taux conversion : ${supabase.funnel.conversionRate}%\n`;
  }

  // ━━ GOOGLE ADS ━━━━━━━━━━━━━━
  // Only show Google Ads section if available (skip entirely if in error)
  if (google?.available && google.today?.campaigns?.length > 0) {
    report += `\n━━ 🔍 GOOGLE ADS ━━━━━━━━━━━━━━\n`;
    const gt = google.today.totals;
    report += `💰 Dépensé aujourd'hui : ${formatCurrency(gt.totalSpend)}\n`;
    report += `👁️ Impressions : ${gt.totalImpressions.toLocaleString()}\n`;
    report += `🖱️ Clics : ${gt.totalClicks}\n`;
    report += `🛒 Conversions : ${gt.totalConversions} | CA : ${formatCurrency(gt.totalRevenue)}\n`;
    const gRoas = gt.totalSpend > 0 ? (gt.totalRevenue / gt.totalSpend).toFixed(1) : '0';
    report += `📊 ROAS : ${gRoas}x ${roasStars(gRoas)}\n`;

    for (const c of google.today.campaigns) {
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
  } else if (google?.available) {
    report += `\n━━ 🔍 GOOGLE ADS ━━━━━━━━━━━━━━\n`;
    report += `✅ Connecté | Aucune campagne active aujourd'hui\n`;
  }
  // If google is not available (error), we simply skip the entire section

  // ━━ SITE / GA4 ━━━━━━━━━━━━━━━━
  report += `\n━━ 🌐 SITE (GA4) ━━━━━━━━━━━━━━━━\n`;
  if (ga4?.available && ga4.today) {
    const y = ga4.today;
    const bounceStr = ((y.bounceRate || 0) * 100).toFixed(1);
    const avgDuration = Math.round(y.avgSessionDuration || 0);
    report += `👥 Visiteurs aujourd'hui : <b>${y.users}</b> (${y.newUsers} nouveaux)\n`;
    report += `📄 Sessions : ${y.sessions} | Pages vues : ${y.pageViews}\n`;
    report += `📊 Rebond : ${bounceStr}% | Durée moy : ${avgDuration}s\n`;

    // Top countries
    if (ga4.countries?.length > 0) {
      report += `\n   🌍 <b>Top pays :</b>\n`;
      for (const c of ga4.countries.slice(0, 5)) {
        report += `   • ${c.country} — ${c.users} visiteurs, ${c.sessions} sessions\n`;
      }
    }

    // Traffic sources
    if (ga4.sources?.length > 0) {
      report += `\n   📡 <b>Sources trafic :</b>\n`;
      for (const s of ga4.sources.slice(0, 5)) {
        const bounce = ((s.bounceRate || 0) * 100).toFixed(0);
        report += `   • ${s.channel} — ${s.sessions} sessions (${bounce}% rebond)\n`;
      }
    }

    // Month summary
    if (ga4.month) {
      const m = ga4.month;
      report += `\n   📅 Mois : ${m.users} visiteurs | ${m.sessions} sessions | ${m.pageViews} pages vues\n`;
    }
  } else if (ga4?.available) {
    report += `📊 Connecté — données sous 24-48h\n`;
  } else {
    report += `⚠️ ${escapeHtml(ga4?.message || ga4?.error || 'Non connecté')}\n`;
  }

  // ━━ COMMANDES / CA ━━━━━━━━━━━━
  report += `\n━━ 💰 COMMANDES / CA ━━━━━━━━━━━\n`;
  const s = supabase;

  // Always use Stripe as unique source of conversions
  const monthStripeRevenue = calcStripeRevenue(s.allOrders || [], stripe);

  if (monthStripeRevenue && stripe?.available) {
    report += `💳 <b>Revenue Stripe</b>\n`;
    report += `📦 Commandes : ${formatCurrency(monthStripeRevenue.oneTimeTotal / 100)}\n`;
    report += `🔄 Abonnements : ${formatCurrency(monthStripeRevenue.subsTotal / 100)}\n`;
    report += `💰 Total reçu : <b>${formatCurrency(monthStripeRevenue.total / 100)}</b>\n`;
  } else {
    report += `⚠️ Stripe non disponible — données indisponibles\n`;
  }

  // Show in_progress orders count
  const todayInProgress = s.today.byStatus?.in_progress || 0;
  const monthInProgress = s.month.byStatus?.in_progress || 0;
  if (monthInProgress > 0) {
    report += `🔄 Commandes en cours : <b>${monthInProgress}</b> (dont ${todayInProgress} aujourd'hui)\n`;
  }

  // Daily Push subscriptions detail
  const dailyPushSubs = (s.allDailyPushSubs || []);
  if (dailyPushSubs.length > 0) {
    const activeSubs = dailyPushSubs.filter(o => isSubActive(o, stripe));
    const missingSubs = dailyPushSubs.filter(o => o.order_status === 'active_missing_receipt');

    report += `\n   🔄 <b>Abonnements Daily Push ($55/j)</b>\n`;
    report += `   ✅ Actifs : ${activeSubs.length}\n`;
    if (missingSubs.length > 0) {
      report += `   ⚠️ Receipts manquants : ${missingSubs.length}\n`;
    }

    // Per-subscription detail with Stripe data (exclude cancelled)
    const visibleSubs = dailyPushSubs.filter(sub => {
      // Skip cancelled subscriptions (from Stripe or Supabase status)
      const subStripeData = stripe?.subscriptions?.[sub.id];
      if (subStripeData && (subStripeData.status === 'canceled' || subStripeData.status === 'unpaid')) return false;
      if (sub.order_status === 'cancelled') return false;
      return true;
    });
    for (const sub of visibleSubs) {
      const statusLabel = getSubStatusLabel(sub, stripe);
      const subStripe = stripe?.subscriptions?.[sub.id];
      const daysPaid = subStripe?.daysPaid || '-';
      const totalPaid = subStripe ? formatCurrency(subStripe.totalPaid / 100) : '-';
      const trackName = sub.track_title ? `${sub.track_title}` : 'N/A';
      report += `\n   🎵 <b>${escapeHtml(trackName)}</b>\n`;
      report += `   ${statusLabel} | ${daysPaid} jours payés | ${totalPaid} reçu\n`;
    }
  }

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
    const mt = meta.today?.totals;
    msg += `📘 <b>Meta Ads (aujourd'hui)</b>\n`;
    msg += `   Dépensé: ${formatCurrency(mt?.totalSpend || 0)} | Conv: ${mt?.totalConversions || 0} | ROAS: ${mt?.totalSpend > 0 ? ((mt?.totalRevenue || 0) / mt.totalSpend).toFixed(1) : '0'}x\n\n`;
  } else {
    msg += `📘 Meta Ads: ${meta?.error ? escapeHtml(meta.error) : 'Non connecté'}\n\n`;
  }

  if (google?.available) {
    const gt = google.today?.totals;
    msg += `🔍 <b>Google Ads (aujourd'hui)</b>\n`;
    msg += `   Dépensé: ${formatCurrency(gt?.totalSpend || 0)} | Conv: ${gt?.totalConversions || 0} | ROAS: ${gt?.totalSpend > 0 ? ((gt?.totalRevenue || 0) / gt.totalSpend).toFixed(1) : '0'}x\n`;
  } else {
    msg += `🔍 Google Ads: ${google?.error ? escapeHtml(google.error) : 'Non connecté'}\n`;
  }

  return msg;
}

// Build response for /site command — Google Analytics 4 data
export function buildSiteResponse(ga4) {
  let msg = `🌐 <b>SITE — Analytics (GA4)</b>\n\n`;

  if (!ga4?.available) {
    msg += `⚠️ ${escapeHtml(ga4?.message || ga4?.error || 'GA4 non connecté')}\n`;
    msg += `\n💡 Configure GA4_PROPERTY_ID, GA4_CLIENT_EMAIL et GA4_PRIVATE_KEY dans Vercel.`;
    return msg;
  }

  // Check if there's any data at all
  if (!ga4.today && !ga4.month) {
    msg += `📊 GA4 connecté mais aucune donnée disponible.\n`;
    msg += `\n💡 GA4 vient d'être activé — les premières données apparaîtront sous 24-48h.`;
    return msg;
  }

  // Today overview
  if (ga4.today) {
    const y = ga4.today;
    const bounceStr = ((y.bounceRate || 0) * 100).toFixed(1);
    const avgDuration = Math.round(y.avgSessionDuration || 0);
    msg += `📅 <b>Aujourd'hui</b>\n`;
    msg += `👥 Visiteurs : <b>${y.users}</b> (${y.newUsers} nouveaux)\n`;
    msg += `📄 Sessions : ${y.sessions} | Pages vues : ${y.pageViews}\n`;
    msg += `📊 Taux de rebond : ${bounceStr}%\n`;
    msg += `⏱️ Durée moyenne : ${avgDuration}s\n`;
    msg += `🎯 Sessions engagées : ${y.engagedSessions}\n`;
  }

  // Top countries
  if (ga4.countries?.length > 0) {
    msg += `\n🌍 <b>Top pays (aujourd'hui)</b>\n`;
    for (const c of ga4.countries.slice(0, 8)) {
      msg += `   • ${c.country} — ${c.users} visiteurs, ${c.sessions} sessions\n`;
    }
  }

  // Traffic sources
  if (ga4.sources?.length > 0) {
    msg += `\n📡 <b>Sources de trafic (aujourd'hui)</b>\n`;
    for (const s of ga4.sources) {
      const bounce = ((s.bounceRate || 0) * 100).toFixed(0);
      msg += `   • ${s.channel} — ${s.sessions} sessions (${bounce}% rebond)\n`;
    }
  }

  // Top pages
  if (ga4.pages?.length > 0) {
    msg += `\n📄 <b>Top pages (aujourd'hui)</b>\n`;
    for (const p of ga4.pages.slice(0, 8)) {
      const bounce = ((p.bounceRate || 0) * 100).toFixed(0);
      msg += `   • ${escapeHtml(p.pagePath)} — ${p.pageViews} vues (${bounce}% rebond)\n`;
    }
  }

  // Month summary
  if (ga4.month) {
    const m = ga4.month;
    const monthBounce = ((m.bounceRate || 0) * 100).toFixed(1);
    msg += `\n📅 <b>Ce mois</b>\n`;
    msg += `👥 ${m.users} visiteurs (${m.newUsers} nouveaux) | ${m.sessions} sessions\n`;
    msg += `📄 ${m.pageViews} pages vues | ${monthBounce}% rebond\n`;
  }

  return msg;
}

// Build response for /ca command — now with Stripe data
export function buildRevenueResponse(supabase, stripeData) {
  let msg = `💰 <b>CHIFFRE D'AFFAIRES</b>\n\n`;

  // Stripe-based revenue
  const stripeRevenue = calcStripeRevenue(supabase.allOrders || [], stripeData);
  if (stripeRevenue && stripeData?.available) {
    msg += `💳 <b>Montants Stripe (réels)</b>\n`;
    msg += `📦 Commandes : ${formatCurrency(stripeRevenue.oneTimeTotal / 100)}\n`;
    msg += `🔄 Abonnements : ${formatCurrency(stripeRevenue.subsTotal / 100)}\n`;
    msg += `💰 Total reçu : <b>${formatCurrency(stripeRevenue.total / 100)}</b>\n`;
  } else {
    msg += `📦 Aujourd'hui : ${supabase.today.count} commandes — ${formatCurrency(supabase.today.revenue)}\n`;
    msg += `📦 Hier : ${supabase.yesterday.count} commandes — ${formatCurrency(supabase.yesterday.revenue)}\n`;
    msg += `📅 Ce mois : ${supabase.month.count} commandes — ${formatCurrency(supabase.month.revenue)}\n`;
  }

  // Daily Push detail
  const dailyPushSubs = supabase.allDailyPushSubs || [];
  if (dailyPushSubs.length > 0) {
    const activeSubs = dailyPushSubs.filter(o => isSubActive(o, stripeData));
    const missingSubs = dailyPushSubs.filter(o => o.order_status === 'active_missing_receipt');

    msg += `\n🔄 <b>Abonnements Daily Push ($55/j)</b>\n`;
    msg += `   ✅ Actifs : ${activeSubs.length}\n`;
    if (missingSubs.length > 0) {
      msg += `   ⚠️ Receipts manquants : ${missingSubs.length}\n`;
    }

    for (const sub of dailyPushSubs) {
      const statusLabel = getSubStatusLabel(sub, stripeData);
      const subStripe = stripeData?.subscriptions?.[sub.id];
      const daysPaid = subStripe?.daysPaid || '-';
      const totalPaid = subStripe ? formatCurrency(subStripe.totalPaid / 100) : '-';
      const trackName = sub.track_title || 'N/A';
      msg += `\n   🎵 <b>${escapeHtml(trackName)}</b>\n`;
      msg += `   ${statusLabel} | ${daysPaid} jours | ${totalPaid} reçu\n`;
    }
  }

  if (Object.keys(supabase.month.byPack).length > 0) {
    msg += `\n📋 <b>Par pack (mois) :</b>\n`;
    const packLabels = {
      '50': '50 Copies',
      '100': '100 Copies',
      '200': '200 Copies',
      '500': '500 Copies',
      '1000': '1000 Copies',
      'daily-push': 'Daily Push ($55/j)',
      'exclusive-800': 'Top 10',
      'promo-430': 'Top 100',
    };
    for (const [pack, count] of Object.entries(supabase.month.byPack).sort((a, b) => b[1] - a[1])) {
      msg += `   • ${packLabels[pack] || pack}: ${count}x\n`;
    }
  }

  return msg;
}

// Build help response
export function buildHelpResponse() {
  return `🤖 <b>BeatPush Ads Analyzer</b>

Commandes disponibles :

/ads — Vue globale des campagnes (Meta + Google)
/site — Analytics site (visiteurs, pays, rebond)
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
