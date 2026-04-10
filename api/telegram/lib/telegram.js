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

  // Compute Stripe-based conversions & revenue (single source of truth)
  const todayStripeRev = calcStripeRevenue(supabase.today.orders || [], stripe);
  const monthStripeRev = calcStripeRevenue(supabase.allOrders || [], stripe);
  const stripeConvsToday = supabase.today.count || 0;
  const stripeRevenueToday = (todayStripeRev?.total || 0) / 100;
  const stripeConvsMonth = supabase.month.count || 0;
  const stripeRevenueMonth = (monthStripeRev?.total || 0) / 100;

  // Header
  report += `📊 <b>BEATPUSH</b> — ${dateStr}\n`;
  report += `🏥 Santé : <b>${analysis.health_score}/100</b> ${trendEmoji(analysis.health_trend)}\n`;
  report += `\n💬 <i>${analysis.summary}</i>\n`;

  // Funnel + new user stats block (reused in all branches)
  const funnel = supabase.funnel;
  const funnelBlock = () => {
    let f = '';
    f += `🔍 Recherches : ${funnel.searches}\n`;
    f += `🎯 Sélections : ${funnel.selections}\n`;
    f += `🛒 Conversions (Stripe) : ${stripeConvsToday}\n`;
    if (funnel.newUsers > 0) {
      f += `🆕 ${funnel.newUsers} nouveau${funnel.newUsers > 1 ? 'x' : ''} utilisateur${funnel.newUsers > 1 ? 's' : ''} | 📱 ${funnel.newDevices.mobile} mobile | 💻 ${funnel.newDevices.desktop} desktop\n`;
    } else {
      f += `🆕 Aucun nouvel utilisateur\n`;
    }
    return f;
  };

  // ━━ META ADS + FUNNEL ━━━━━━━━━━━━━━━━
  report += `\n━━ 📘 META ADS + FUNNEL ━━━━━━━━━━\n`;
  if (meta?.available) {
    // 1. Campaign status (only active campaigns)
    const activeCampaigns = (meta.activeCampaigns || []).filter(c => c.status === 'ACTIVE');
    if (activeCampaigns.length > 0) {
      for (const c of activeCampaigns) {
        const budget = c.daily_budget ? `${formatCurrency(c.daily_budget / 100)}/j` : (c.lifetime_budget ? `${formatCurrency(c.lifetime_budget / 100)} total` : 'N/A');
        report += `   🟢 <b>${c.name}</b>\n`;
        report += `   ID: ${c.id} | Budget: ${budget} | ${c.objective || ''}\n`;
      }
    }

    if (meta.today?.campaigns?.length > 0) {
      const mt = meta.today.totals;
      const metaRoas = mt.totalSpend > 0 ? (stripeRevenueToday / mt.totalSpend).toFixed(1) : '0';

      // 2. Ad performance metrics
      report += `\n💰 Dépensé aujourd'hui : ${formatCurrency(mt.totalSpend)}\n`;
      report += `👁️ Impressions : ${mt.totalImpressions.toLocaleString()}\n`;
      report += `🖱️ Clics : ${mt.totalClicks} | CPC moy : ${formatCurrency(mt.avgCpc)}\n`;

      // 3. Funnel inline + user stats
      report += funnelBlock();
      report += `📊 ROAS : ${metaRoas}x ${roasStars(metaRoas)}\n`;

      // 4. Month totals
      if (meta.month?.totals) {
        const mm = meta.month.totals;
        const monthMetaRoas = mm.totalSpend > 0 ? (stripeRevenueMonth / mm.totalSpend).toFixed(1) : '0';
        report += `\n📅 Mois : ${formatCurrency(mm.totalSpend)} dépensé | ${formatCurrency(stripeRevenueMonth)} CA (Stripe) | ${stripeConvsMonth} conv | ROAS ${monthMetaRoas}x\n`;
      }

    } else {
      report += `\n✅ Connecté | Aucune campagne active aujourd'hui\n`;
      report += funnelBlock();
    }
  } else {
    report += `⚠️ ${escapeHtml(meta?.message || meta?.error || 'Non connecté')}\n`;
    report += funnelBlock();
  }

  // ━━ GOOGLE ADS ━━━━━━━━━━━━━━
  // Only show Google Ads section if available (skip entirely if in error)
  if (google?.available && google.today?.campaigns?.length > 0) {
    report += `\n━━ 🔍 GOOGLE ADS ━━━━━━━━━━━━━━\n`;
    const gt = google.today.totals;
    const gRoas = gt.totalSpend > 0 ? (stripeRevenueToday / gt.totalSpend).toFixed(1) : '0';
    report += `💰 Dépensé aujourd'hui : ${formatCurrency(gt.totalSpend)}\n`;
    report += `👁️ Impressions : ${gt.totalImpressions.toLocaleString()}\n`;
    report += `🖱️ Clics : ${gt.totalClicks}\n`;
    report += `🛒 Conversions (Stripe) : ${stripeConvsToday} | CA : ${formatCurrency(stripeRevenueToday)}\n`;
    report += `📊 ROAS : ${gRoas}x ${roasStars(gRoas)}\n`;

    for (const c of google.today.campaigns) {
      if (c.spend > 0) {
        report += `\n   📌 <b>${c.campaignName}</b>\n`;
        report += `   ${formatCurrency(c.spend)} | ${c.clicks} clics\n`;
      }
    }

    // Top search terms (keep clicks + spend, remove platform conversions)
    if (google.searchTerms?.length > 0) {
      report += `\n   🔎 Top termes recherche :\n`;
      for (const t of google.searchTerms.slice(0, 5)) {
        report += `   • "${t.term}" — ${t.clicks} clics, ${formatCurrency(t.spend)}\n`;
      }
    }

    if (google.month?.totals) {
      const gm = google.month.totals;
      const monthGRoas = gm.totalSpend > 0 ? (stripeRevenueMonth / gm.totalSpend).toFixed(1) : '0';
      report += `\n   📅 Mois : ${formatCurrency(gm.totalSpend)} dépensé | ${formatCurrency(stripeRevenueMonth)} CA (Stripe) | ${stripeConvsMonth} conv | ROAS ${monthGRoas}x\n`;
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

  // Show in_progress orders count — use real statuses (Stripe for subs, DB for one-time)
  const allMonthOrders = s.month.orders || [];
  let inProgressCount = 0;
  let inProgressToday = 0;
  const todayStart = s.today.orders?.length > 0 ? new Date(s.today.orders[s.today.orders.length - 1].created_at) : null;

  for (const order of allMonthOrders) {
    // For daily-push, check Stripe subscription status
    if (order.pack === 'daily-push') {
      const subData = stripe?.subscriptions?.[order.id];
      const stripeStatus = subData?.status;
      // Only count as in_progress if truly active in Stripe
      if (stripeStatus === 'active' || stripeStatus === 'trialing') {
        if (order.order_status === 'active_missing_receipt' || order.order_status === 'complete_for_day') {
          // Active sub, not "in_progress" in the one-time sense
          continue;
        }
      }
      // Cancelled/unpaid subs are not in_progress
      continue;
    }

    // For one-time orders: in_progress if status says so
    const status = order.order_status || 'in_progress';
    if (status === 'in_progress') {
      inProgressCount++;
      if (todayStart && new Date(order.created_at) >= todayStart) {
        inProgressToday++;
      }
    }
  }

  if (inProgressCount > 0) {
    report += `🔄 Commandes en cours : <b>${inProgressCount}</b> (dont ${inProgressToday} aujourd'hui)\n`;
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

  // ━━ SUGGESTIONS & OPTIMISATION ━━━━━━
  const hasRecs = analysis.recommendations?.length > 0;
  const hasTips = analysis.meta_creative_tips?.length > 0;
  const hasDiagnostics = meta?.diagnostics?.length > 0;
  const hasMetaRecs = meta?.campaignRecommendations?.length > 0;

  if (hasRecs || hasTips || hasDiagnostics || hasMetaRecs) {
    report += `\n━━ 💡 SUGGESTIONS ━━━━━━━━━━━━━\n`;

    if (hasRecs) {
      for (const r of analysis.recommendations) {
        report += `💡 ${r}\n`;
      }
    }

    if (hasTips) {
      for (const tip of analysis.meta_creative_tips) {
        report += `🎯 ${tip}\n`;
      }
    }

    // Meta campaign recommendations
    if (hasMetaRecs) {
      report += `\n📘 <b>Meta recommande :</b>\n`;
      for (const rec of meta.campaignRecommendations.slice(0, 3)) {
        report += `   • ${escapeHtml(rec.message)}\n`;
      }
    }

    // Ad diagnostics — simplified text
    if (hasDiagnostics) {
      const rankText = (r) => {
        if (r === 'ABOVE_AVERAGE_35' || r === 'ABOVE_AVERAGE') return 'bon';
        if (r === 'AVERAGE') return 'correct';
        if (r?.startsWith('BELOW')) return 'à améliorer';
        return null;
      };
      const rankExplain = (field, rank) => {
        if (!rank?.startsWith('BELOW')) return null;
        if (field === 'quality') return 'visuels/créatifs à retravailler';
        if (field === 'engagement') return 'texte ou CTA à améliorer';
        if (field === 'conversion') return 'ciblage ou landing page à revoir';
        return null;
      };

      report += `\n🔬 <b>Diagnostics Meta par pub :</b>\n`;
      for (const ad of meta.diagnostics.slice(0, 5)) {
        const q = rankText(ad.qualityRanking);
        const e = rankText(ad.engagementRanking);
        const cv = rankText(ad.conversionRanking);

        // Skip if all unknown
        if (!q && !e && !cv) continue;

        report += `   • <b>${escapeHtml(ad.adName)}</b> — `;
        const parts = [];
        if (q) parts.push(`qualité ${q}`);
        if (e) parts.push(`engagement ${e}`);
        if (cv) parts.push(`conversion ${cv}`);
        report += parts.join(', ') + '\n';

        // Actionable tip for below-average rankings
        const tips = [
          rankExplain('quality', ad.qualityRanking),
          rankExplain('engagement', ad.engagementRanking),
          rankExplain('conversion', ad.conversionRanking),
        ].filter(Boolean);
        if (tips.length > 0) {
          report += `     → ${tips.join(' + ')}\n`;
        }
      }

      // If all diagnostics were unknown (< 500 impressions)
      const allUnknown = meta.diagnostics.every(ad =>
        !rankText(ad.qualityRanking) && !rankText(ad.engagementRanking) && !rankText(ad.conversionRanking)
      );
      if (allUnknown) {
        report += `   ℹ️ Pas assez de données (il faut 500+ impressions par pub pour que Meta évalue la qualité)\n`;
      }
    }
  }

  report += `\n🤖 BeatPush Ads Analyzer v1`;

  return report;
}

// Build response for /ads command — conversions always from Stripe
export function buildAdsResponse(data) {
  const { meta, google, supabase, stripe } = data;
  let msg = `📊 <b>ADS — Temps réel</b>\n\n`;

  // Stripe-based conversions
  const todayConvs = supabase?.today?.count || 0;
  const todayRev = supabase && stripe ? (calcStripeRevenue(supabase.today.orders || [], stripe)?.total || 0) / 100 : 0;

  if (meta?.available) {
    const mt = meta.today?.totals;
    const spend = mt?.totalSpend || 0;
    const roas = spend > 0 ? (todayRev / spend).toFixed(1) : '0';
    msg += `📘 <b>Meta Ads (aujourd'hui)</b>\n`;
    msg += `   Dépensé: ${formatCurrency(spend)} | Conv (Stripe): ${todayConvs} | ROAS: ${roas}x\n\n`;
  } else {
    msg += `📘 Meta Ads: ${meta?.error ? escapeHtml(meta.error) : 'Non connecté'}\n\n`;
  }

  if (google?.available) {
    const gt = google.today?.totals;
    const spend = gt?.totalSpend || 0;
    const roas = spend > 0 ? (todayRev / spend).toFixed(1) : '0';
    msg += `🔍 <b>Google Ads (aujourd'hui)</b>\n`;
    msg += `   Dépensé: ${formatCurrency(spend)} | Conv (Stripe): ${todayConvs} | ROAS: ${roas}x\n`;
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
