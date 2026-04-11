// Telegram Bot — Send reports and handle commands
// Uses Telegram Bot API to send formatted messages to a channel

const TELEGRAM_API = 'https://api.telegram.org/bot';

const COUNTRY_CODES = {
  'United States': 'US', 'United Kingdom': 'GB', 'Germany': 'DE', 'France': 'FR',
  'Spain': 'ES', 'Italy': 'IT', 'Netherlands': 'NL', 'Belgium': 'BE', 'Switzerland': 'CH',
  'Portugal': 'PT', 'Austria': 'AT', 'Sweden': 'SE', 'Norway': 'NO', 'Denmark': 'DK',
  'Finland': 'FI', 'Poland': 'PL', 'Ireland': 'IE', 'Greece': 'GR', 'Romania': 'RO',
  'Czechia': 'CZ', 'Hungary': 'HU', 'Croatia': 'HR', 'Bulgaria': 'BG', 'Ukraine': 'UA',
  'Russia': 'RU', 'Türkiye': 'TR', 'Turkey': 'TR', 'Morocco': 'MA', 'Tunisia': 'TN',
  'Algeria': 'DZ', 'Egypt': 'EG', 'South Africa': 'ZA', 'Nigeria': 'NG', 'Kenya': 'KE',
  'Canada': 'CA', 'Mexico': 'MX', 'Brazil': 'BR', 'Argentina': 'AR', 'Colombia': 'CO',
  'Chile': 'CL', 'Peru': 'PE', 'Japan': 'JP', 'South Korea': 'KR', 'China': 'CN',
  'India': 'IN', 'Indonesia': 'ID', 'Thailand': 'TH', 'Vietnam': 'VN', 'Philippines': 'PH',
  'Australia': 'AU', 'New Zealand': 'NZ', 'Israel': 'IL', 'Saudi Arabia': 'SA',
  'United Arab Emirates': 'AE', 'Singapore': 'SG', 'Malaysia': 'MY', 'Taiwan': 'TW',
};

function countryFlag(name) {
  const code = COUNTRY_CODES[name];
  if (!code) return name.substring(0, 2).toUpperCase();
  return [...code].map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)).join('');
}

// Visual width of a string in monospace, accounting for emojis (2 cols),
// flag pairs (2 regional indicators = 1 glyph = 2 cols), and variation selectors (0 cols)
function visualWidth(str) {
  const chars = [...str];
  let w = 0;
  let i = 0;
  while (i < chars.length) {
    const cp = chars[i].codePointAt(0);
    // Variation selectors (text/emoji presentation) — zero width
    if (cp === 0xFE0F || cp === 0xFE0E) { i++; continue; }
    // Zero-width joiner — zero width
    if (cp === 0x200D) { i++; continue; }
    // Regional indicator pair (flag emoji: 2 codepoints → 1 glyph, width 2)
    if (cp >= 0x1F1E6 && cp <= 0x1F1FF) {
      if (i + 1 < chars.length) {
        const next = chars[i + 1].codePointAt(0);
        if (next >= 0x1F1E6 && next <= 0x1F1FF) { w += 2; i += 2; continue; }
      }
      w += 2; i++; continue;
    }
    // Emoji & special symbols — width 2
    if (cp > 0x1F00) { w += 2; i++; continue; }
    // Regular character — width 1
    w += 1; i++;
  }
  return w;
}

function vPadEnd(str, len) {
  const diff = len - visualWidth(str);
  return diff > 0 ? str + ' '.repeat(diff) : str;
}

function vPadStart(str, len) {
  const diff = len - visualWidth(str);
  return diff > 0 ? ' '.repeat(diff) + str : str;
}

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
  const yesterdayStripeRev = calcStripeRevenue(supabase.yesterday.orders || [], stripe);
  const monthStripeRev = calcStripeRevenue(supabase.allOrders || [], stripe);
  const stripeConvsToday = supabase.today.count || 0;
  const stripeRevenueToday = (todayStripeRev?.total || 0) / 100;
  const stripeConvsYesterday = supabase.yesterday.count || 0;
  const stripeRevenueYesterday = (yesterdayStripeRev?.total || 0) / 100;
  const stripeConvsMonth = supabase.month.count || 0;
  const stripeRevenueMonth = (monthStripeRev?.total || 0) / 100;

  // Header
  report += `📊 <b>BEATPUSH</b> — ${dateStr}\n`;

  // Funnel + new user stats block (reused in all branches)
  const funnel = supabase.funnel;
  const mf = supabase.monthFunnel || {};
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

  // ━━ RAPPORT DE PERFORMANCE ━━━━━━━━━━━━
  report += `\n━━ 📊 RAPPORT DE PERFORMANCE ━━━━━━\n`;
  if (meta?.available) {
    // 1. Campaign status (only active campaigns)
    const activeCampaigns = (meta.activeCampaigns || []).filter(c => c.status === 'ACTIVE');

    if (meta.today?.campaigns?.length > 0) {
      const mt = meta.today.totals;
      const my = meta.yesterday?.totals;
      const mm = meta.month?.totals;
      const metaRoas = mt.totalSpend > 0 ? (stripeRevenueToday / mt.totalSpend).toFixed(1) : '0';
      const yesterdayMetaRoas = my && my.totalSpend > 0 ? (stripeRevenueYesterday / my.totalSpend).toFixed(1) : '0';
      const monthMetaRoas = mm && mm.totalSpend > 0 ? (stripeRevenueMonth / mm.totalSpend).toFixed(1) : '0';

      const yf = supabase.yesterdayFunnel || {};

      // Tableau Aujourd'hui vs Hier vs Avril (cumul)
      const tr = (label, today, yesterday, month) =>
        `${vPadEnd(label, 14)} ${vPadStart(String(today), 8)} ${vPadStart(String(yesterday), 8)} ${vPadStart(String(month), 8)}`;

      report += `\n<pre>`;
      report += tr('', 'Auj.', 'Hier', 'Avril') + '\n';
      report += '─'.repeat(41) + '\n';
      report += tr('Dépenses', formatCurrency(mt.totalSpend), my ? formatCurrency(my.totalSpend) : '—', mm ? formatCurrency(mm.totalSpend) : '—') + '\n';
      report += tr('Impressions', mt.totalImpressions.toLocaleString(), my ? my.totalImpressions.toLocaleString() : '—', mm ? mm.totalImpressions.toLocaleString() : '—') + '\n';
      report += tr('Clics', String(mt.totalClicks), my ? String(my.totalClicks) : '—', mm ? String(mm.totalClicks) : '—') + '\n';
      const formatCpc = (v) => `$${Number(v).toFixed(2)}`;
      report += tr('CPC moyen', formatCpc(mt.avgCpc), my ? formatCpc(my.avgCpc || 0) : '—', mm ? formatCpc(mm.avgCpc || 0) : '—') + '\n';
      report += '\n';
      const todayUsers = ga4?.today?.users ?? '—';
      const yesterdayUsers = ga4?.yesterday?.users ?? '—';
      const monthUsers = ga4?.month?.users ?? '—';
      report += tr('Visiteurs', String(todayUsers), String(yesterdayUsers), String(monthUsers)) + '\n';
      if (ga4.sources?.length > 0 || ga4.sourcesYesterday?.length > 0 || ga4.sourcesMonth?.length > 0) {
        const googleAdsActive = google?.available && google.today?.campaigns?.length > 0;
        const calcSources = (srcList) => {
          if (!srcList?.length) return null;
          const meta = srcList.filter(s => s.channel === 'Paid Social').reduce((sum, s) => sum + (s.users || 0), 0);
          const gAds = srcList.filter(s => s.channel === 'Paid Search').reduce((sum, s) => sum + (s.users || 0), 0);
          const total = srcList.reduce((sum, s) => sum + (s.users || 0), 0);
          const autres = total - meta - (googleAdsActive ? gAds : 0);
          return { meta, gAds, autres };
        };
        const st = calcSources(ga4.sources);
        const sy = calcSources(ga4.sourcesYesterday);
        const sm = calcSources(ga4.sourcesMonth);
        report += tr('  📘 Meta', st ? String(st.meta) : '—', sy ? String(sy.meta) : '—', sm ? String(sm.meta) : '—') + '\n';
        if (googleAdsActive) {
          report += tr('  🔍 Google Ads', st ? String(st.gAds) : '—', sy ? String(sy.gAds) : '—', sm ? String(sm.gAds) : '—') + '\n';
        }
        report += tr('  🌐 Autres', st ? String(st.autres) : '—', sy ? String(sy.autres) : '—', sm ? String(sm.autres) : '—') + '\n';
      }
      const bestCountries = ga4.countries?.length > 0 ? ga4.countries : (ga4.countriesYesterday?.length > 0 ? ga4.countriesYesterday : ga4.countriesMonth || []);
      if (bestCountries.length > 0) {
        const tc = ga4.countries?.slice(0, 3) || [];
        const yc = ga4.countriesYesterday || [];
        const mc = ga4.countriesMonth || [];
        const refCountries = (tc.length > 0 ? tc : (yc.length > 0 ? yc.slice(0, 3) : mc.slice(0, 3)));
        // Use overview totals for consistent percentages across all periods
        const tTotal = ga4.today?.users || (ga4.countries || []).reduce((s, c) => s + (c.users || 0), 0) || 1;
        const yTotal = ga4.yesterday?.users || yc.reduce((s, c) => s + (c.users || 0), 0) || 1;
        const mTotal = ga4.month?.users || mc.reduce((s, c) => s + (c.users || 0), 0) || 1;
        const tMap = new Map(tc.map(c => [c.country, c]));
        const yMap = new Map(yc.map(c => [c.country, c]));
        const mMap = new Map(mc.map(c => [c.country, c]));
        for (const c of refCountries) {
          const tC = tMap.get(c.country);
          const tPct = tC ? `${Math.round((tC.users / tTotal) * 100)}%` : '—';
          const yC = yMap.get(c.country);
          const yPct = yC ? `${Math.round((yC.users / yTotal) * 100)}%` : '—';
          const mC = mMap.get(c.country);
          const mPct = mC ? `${Math.round((mC.users / mTotal) * 100)}%` : '—';
          report += tr(`  ${countryFlag(c.country)}`, tPct, yPct, mPct) + '\n';
        }
      }
      const todayBounce = ga4?.today ? `${((ga4.today.bounceRate || 0) * 100).toFixed(0)}%` : '—';
      const yesterdayBounce = ga4?.yesterday ? `${((ga4.yesterday.bounceRate || 0) * 100).toFixed(0)}%` : '—';
      const monthBounce = ga4?.month ? `${((ga4.month.bounceRate || 0) * 100).toFixed(0)}%` : '—';
      report += tr('Rebond', todayBounce, yesterdayBounce, monthBounce) + '\n';
      report += '\n';
      report += tr('Nv. util.', String(funnel.newUsers), String(yf.newUsers ?? 0), String(mf.newUsers ?? funnel.newUsers)) + '\n';
      report += tr('Recherches', String(funnel.searches), String(yf.searches ?? 0), String(mf.searches ?? funnel.searches)) + '\n';
      report += tr('Sélections', String(funnel.selections), String(yf.selections ?? 0), String(mf.selections ?? funnel.selections)) + '\n';
      report += '\n';
      report += tr('Conv.', String(stripeConvsToday), String(stripeConvsYesterday), String(stripeConvsMonth)) + '\n';
      report += tr('CA Stripe', formatCurrency(stripeRevenueToday), formatCurrency(stripeRevenueYesterday), formatCurrency(stripeRevenueMonth)) + '\n';
      report += tr('ROAS', `${metaRoas}x`, `${yesterdayMetaRoas}x`, `${monthMetaRoas}x`) + '\n';
      report += `</pre>`;
      if (funnel.newUsers > 0) {
        report += `🆕 ${funnel.newUsers} nouveau${funnel.newUsers > 1 ? 'x' : ''} utilisateur${funnel.newUsers > 1 ? 's' : ''} | 📱 ${funnel.newDevices.mobile} mobile | 💻 ${funnel.newDevices.desktop} desktop\n`;
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

  } else if (google?.available) {
    report += `\n━━ 🔍 GOOGLE ADS ━━━━━━━━━━━━━━\n`;
    report += `✅ Connecté | Aucune campagne active aujourd'hui\n`;
  }
  // If google is not available (error), we simply skip the entire section


  // ━━ COMMANDES / CA ━━━━━━━━━━━━
  report += `\n━━ 💰 COMMANDES / CA ━━━━━━━━━━━\n`;
  const s = supabase;

  // Always use Stripe as unique source of conversions
  const monthStripeRevenue = calcStripeRevenue(s.allOrders || [], stripe);

  // Revenue table
  const tr2 = (label, value) =>
    `${vPadEnd(label, 26)} ${vPadStart(String(value), 8)}`;

  if (monthStripeRevenue && stripe?.available) {
    // Show in_progress orders count — use real statuses (Stripe for subs, DB for one-time)
    const allMonthOrders = s.month.orders || [];
    let inProgressCount = 0;
    let inProgressToday = 0;
    const todayStart = s.today.orders?.length > 0 ? new Date(s.today.orders[s.today.orders.length - 1].created_at) : null;

    for (const order of allMonthOrders) {
      if (order.pack === 'daily-push') {
        const subData = stripe?.subscriptions?.[order.id];
        const stripeStatus = subData?.status;
        if (stripeStatus === 'active' || stripeStatus === 'trialing') {
          if (order.order_status === 'active_missing_receipt' || order.order_status === 'complete_for_day') {
            continue;
          }
        }
        continue;
      }
      const status = order.order_status || 'in_progress';
      if (status === 'in_progress') {
        inProgressCount++;
        if (todayStart && new Date(order.created_at) >= todayStart) {
          inProgressToday++;
        }
      }
    }

    report += `<pre>`;
    // 1. Commandes + En cours
    report += tr2('📦 Commandes', formatCurrency(monthStripeRevenue.oneTimeTotal / 100)) + '\n';
    if (inProgressCount > 0) {
      report += tr2('🔄 En cours', `${inProgressCount} (${inProgressToday} auj.)`) + '\n';
    }

    // 2. Abonnements + Daily Push
    const dailyPushSubs = (s.allDailyPushSubs || []);
    const activeSubs = dailyPushSubs.filter(o => isSubActive(o, stripe));
    const missingSubs = dailyPushSubs.filter(o => o.order_status === 'active_missing_receipt');

    report += '\n';
    report += tr2('🔄 Abonnements', formatCurrency(monthStripeRevenue.subsTotal / 100)) + '\n';
    report += tr2('🔄 Daily Push', `${activeSubs.length} actifs`) + '\n';
    if (missingSubs.length > 0) {
      report += tr2('  ⚠️ Receipts', `${missingSubs.length} manquants`) + '\n';
    }

    if (dailyPushSubs.length > 0) {
      const visibleSubs = dailyPushSubs.filter(sub => {
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
        const trackName = sub.track_title ? escapeHtml(sub.track_title) : 'N/A';
        report += `  🎵 ${trackName}\n`;
        report += `     ${statusLabel} | ${daysPaid}j | ${totalPaid}\n`;
      }
    }

    // 3. Packs ce mois
    if (Object.keys(s.today.byPack).length > 0 || Object.keys(s.month.byPack).length > 0) {
      report += '\n';
      report += '📋 Packs ce mois\n';
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
        report += tr2(`  • ${packLabels[pack] || pack}`, `${count}x`) + '\n';
      }
    }

    // 4. Top genres
    if (Object.keys(s.month.byGenre).length > 0) {
      report += '\n';
      report += '🎵 Top genres ce mois\n';
      const sortedGenres = Object.entries(s.month.byGenre).sort((a, b) => b[1] - a[1]).slice(0, 5);
      for (const [genre, count] of sortedGenres) {
        report += tr2(`  • ${genre}`, `${count}x`) + '\n';
      }
    }

    report += `</pre>`;
  } else {
    report += `⚠️ Stripe non disponible — données indisponibles\n`;
  }

  // Dedup helper: extract key terms from a line to detect semantic duplicates
  const usedInsights = [];
  const extractKeys = (text) => {
    const lower = text.toLowerCase();
    const keys = new Set();
    // Extract percentages and numbers with context
    for (const m of lower.matchAll(/(\d+[\d.,]*\s*%?)/g)) keys.add(m[1].trim());
    // Extract key topic words
    for (const word of ['rebond', 'bounce', 'conversion', 'commande', 'trafic', 'session', 'visiteur', 'cpa', 'roas', 'budget', 'landing', 'clic']) {
      if (lower.includes(word)) keys.add(word);
    }
    return keys;
  };
  const isDuplicate = (text) => {
    const keys = extractKeys(text);
    if (keys.size === 0) return false;
    for (const prev of usedInsights) {
      const overlap = [...keys].filter(k => prev.has(k));
      if (overlap.length >= 2) return true;
    }
    usedInsights.push(keys);
    return false;
  };

  // ━━ ANALYSE IA ━━━━━━━━━━━━━━
  if (analysis.highlights?.length > 0 || analysis.warnings?.length > 0) {
    report += `\n━━ 🧠 ANALYSE IA ━━━━━━━━━━━━━━\n`;

    if (analysis.highlights?.length > 0) {
      for (const h of analysis.highlights) {
        if (!isDuplicate(h)) report += `✅ ${h}\n`;
      }
    }
    if (analysis.warnings?.length > 0) {
      for (const w of analysis.warnings) {
        if (!isDuplicate(w)) report += `🚨 ${w}\n`;
      }
    }
  }

  // ━━ DIAGNOSTICS META PAR PUB ━━━━━━
  if (meta?.diagnostics?.length > 0) {
    const rankLabel = (r) => {
      if (r === 'ABOVE_AVERAGE_35' || r === 'ABOVE_AVERAGE') return '✅ bon';
      if (r === 'AVERAGE') return '➡️ correct';
      if (r?.startsWith('BELOW')) return '⚠️ faible';
      if (r === 'UNKNOWN' || !r) return '— en attente';
      return '— en attente';
    };
    const tip = (field, rank) => {
      if (!rank?.startsWith('BELOW')) return null;
      if (field === 'quality') return 'Changer les visuels/créatifs (images, vidéos)';
      if (field === 'engagement') return 'Retravailler le texte, le hook ou le CTA';
      if (field === 'conversion') return 'Revoir le ciblage ou la landing page';
      return null;
    };

    report += `\n━━ 🔬 DIAGNOSTICS META ━━━━━━━━━\n`;
    for (const ad of meta.diagnostics.slice(0, 5)) {
      report += `\n📌 <b>${escapeHtml(ad.adName)}</b>\n`;
      report += `   Qualité : ${rankLabel(ad.qualityRanking)}\n`;
      report += `   Engagement : ${rankLabel(ad.engagementRanking)}\n`;

      const tips = [
        tip('quality', ad.qualityRanking),
        tip('engagement', ad.engagementRanking),
      ].filter(Boolean);
      if (tips.length > 0) {
        report += `   💡 <b>Actions :</b>\n`;
        for (const t of tips) {
          report += `   → ${t}\n`;
        }
      }
    }
  }

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

📊 Rapport automatique quotidien à 23h59 (Paris).`;
}

export async function sendReport(text, overrideChatId) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = overrideChatId || process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    throw new Error('TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are required');
  }

  await sendTelegramMessage(text, chatId, botToken);
}
