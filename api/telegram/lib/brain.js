// AI Brain — Claude analysis of all collected data
// Sends aggregated data to Claude for simplified performance insights

export async function analyzeWithClaude(data) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return generateFallbackAnalysis(data);
  }

  const systemPrompt = `Tu es un expert en marketing digital et acquisition payante (Meta Ads, Google Ads).
Tu analyses les performances publicitaires pour BeatPush, un SaaS de promotion musicale sur Beatport.

CONTEXTE BUSINESS :
- BeatPush vend des campagnes de promotion pour artistes musicaux (EDM, techno, house, etc.)
- Les packs vont de $240 (50 copies) à $3850 (1000 copies)
- Le panier moyen est ~$480
- Les clients sont des producteurs de musique électronique et des labels
- Marchés : monde entier (principalement Europe, US, Amérique latine)

RÈGLES D'ANALYSE :
1. Compare toujours aujourd'hui vs moyenne du mois pour détecter les anomalies
2. Un CPA (coût par acquisition) acceptable est < $100 pour ce business
3. Un ROAS > 3x est bon, > 5x est excellent
4. Priorise les insights actionnables, pas les évidences
5. Si les données Ads ne sont pas disponibles, analyse les données Supabase (commandes, tendances)
6. Sois direct et concret — pas de blabla
7. Si les données GA4 sont disponibles, analyse le trafic site (visiteurs, pays, rebond, sources) et corrèle avec les campagnes Ads
8. Un taux de rebond > 70% est préoccupant, < 40% est excellent
9. Identifie les pays à fort trafic mais faible conversion (opportunité ou gaspillage)

RÈGLE ANTI-DOUBLONS (CRITIQUE) :
- JAMAIS de redondance entre highlights, warnings et recommendations
- Chaque fait ou donnée ne doit apparaître qu'UNE SEULE FOIS dans tout le JSON
- highlights = points positifs factuels (chiffres bruts)
- warnings = alertes factuelles (constats négatifs, chiffres bruts)
- recommendations = actions concrètes à faire (pas de restatement du problème, juste la solution)
- Exemple INTERDIT : warning "Rebond 100%" + recommendation "analyser pourquoi 100% rebondissent" → la recommendation doit dire "Retravailler la landing page (CTA, vitesse, proposition de valeur)" sans répéter le chiffre du warning
- Exemple INTERDIT : warning "0 conversion" + warning "aucune commande" + warning "disconnect trafic/conversions" → garder UN SEUL warning, le plus complet
- meta_creative_tips = conseils créatifs/ciblage UNIQUEMENT, pas de diagnostic déjà mentionné ailleurs

SOURCE DE VÉRITÉ POUR LE CA :
- IMPORTANT : utilise TOUJOURS les données "stripe" (si disponibles) pour les montants de CA, PAS les montants de supabase
- stripe.oneTimeAmounts contient les montants réels reçus par commande (en cents)
- stripe.subscriptions contient le totalPaid réel par abonnement (en cents)
- Les montants supabase sont des estimations, Stripe = montants réellement encaissés
- Divise les montants Stripe par 100 pour avoir les dollars

DIAGNOSTICS META ADS (si disponibles) :
- quality_ranking : qualité perçue de la pub vs concurrents (ABOVE_AVERAGE_35, AVERAGE, BELOW_AVERAGE_10, etc.)
- engagement_rate_ranking : taux d'engagement attendu vs concurrents
- conversion_rate_ranking : taux de conversion attendu vs concurrents
- Si un ranking est BELOW_AVERAGE, propose des actions concrètes :
  * quality_ranking bas → améliorer le visuel/créatif (images, vidéos, format)
  * engagement_rate_ranking bas → améliorer le texte/hook/CTA de la pub
  * conversion_rate_ranking bas → améliorer le ciblage, la landing page, ou l'offre
- meta.campaignRecommendations contient les suggestions directes de Meta

RÉPONSE FORMAT JSON :
{
  "health_score": 0-100,
  "health_trend": "up|down|stable",
  "summary": "1-2 phrases résumé performance",
  "highlights": ["Point positif 1", "Point positif 2"],
  "warnings": ["Alerte 1", "Alerte 2"],
  "recommendations": ["Action recommandée 1", "Action recommandée 2"],
  "meta_analysis": "Analyse spécifique Meta Ads (ou 'Non disponible')",
  "meta_creative_tips": ["Conseil créatif/ciblage 1 basé sur les diagnostics", "Conseil 2"],
  "google_analysis": "Analyse spécifique Google Ads (ou 'Non disponible')",
  "site_analysis": "Analyse trafic site — visiteurs, pays, rebond, sources (ou 'Non disponible')",
  "revenue_analysis": "Analyse CA et tendances commandes"
}`;

  const userPrompt = `Voici les données de performance pour BeatPush.
Analyse et donne un rapport simplifié.

DONNÉES :
${JSON.stringify(data, null, 2)}

Réponds UNIQUEMENT en JSON valide.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('Claude API error:', error);
      return generateFallbackAnalysis(data);
    }

    const result = await res.json();
    const text = result.content[0].text;

    // Parse JSON from response
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}') + 1;
    if (start === -1 || end === 0) return generateFallbackAnalysis(data);

    return JSON.parse(text.substring(start, end));
  } catch (error) {
    console.error('Claude analysis error:', error);
    return generateFallbackAnalysis(data);
  }
}

// Calculate Stripe-based revenue for fallback analysis
function calcStripeTotal(orders, stripeData) {
  if (!stripeData?.available) return null;
  let total = 0;
  for (const order of (orders || [])) {
    if (order.pack === 'daily-push') {
      const sub = stripeData.subscriptions?.[order.id];
      if (sub) total += sub.totalPaid;
    } else {
      const amt = stripeData.oneTimeAmounts?.[order.id];
      total += amt ? amt.amountReceived : (order.amount || 0);
    }
  }
  return total / 100;
}

// Fallback when Claude API is not available
function generateFallbackAnalysis(data) {
  const { supabase, meta, google, ga4, stripe } = data;
  const todayOrders = supabase?.today?.count || 0;
  const monthOrders = supabase?.month?.count || 0;

  // Use Stripe revenue if available, otherwise fallback to Supabase
  const todayRevenue = calcStripeTotal(supabase?.today?.orders, stripe) ?? supabase?.today?.revenue ?? 0;
  const yesterdayRevenue = calcStripeTotal(supabase?.yesterday?.orders, stripe) ?? supabase?.yesterday?.revenue ?? 0;
  const monthRevenue = calcStripeTotal(supabase?.allOrders, stripe) ?? supabase?.month?.revenue ?? 0;

  const trend = todayRevenue > yesterdayRevenue ? 'up' : todayRevenue < yesterdayRevenue ? 'down' : 'stable';

  // Simple health score based on available data
  let score = 50;
  if (todayOrders > 0) score += 15;
  if (todayRevenue > 500) score += 15;
  if (monthOrders > 10) score += 10;
  if (meta?.available && meta.today?.campaigns?.length > 0) score += 10;
  if (google?.available && google.today?.campaigns?.length > 0) score += 10;
  if (ga4?.available && ga4.today?.users > 0) score += 5;
  score = Math.min(score, 100);

  const revenueLabel = stripe?.available ? '(Stripe)' : '(estimé)';
  const highlights = [];
  const warnings = [];

  if (todayOrders > 0) highlights.push(`${todayOrders} commande(s) aujourd'hui — $${todayRevenue} ${revenueLabel}`);
  if (monthRevenue > 0) highlights.push(`$${monthRevenue} CA ce mois ${revenueLabel} (${monthOrders} commandes)`);
  if (ga4?.available && ga4.today) highlights.push(`${ga4.today.users} visiteurs aujourd'hui sur le site`);
  if (todayOrders === 0) warnings.push('Aucune commande aujourd\'hui');
  if (!meta?.available) warnings.push('Meta Ads non connecté');
  if (!google?.available) warnings.push('Google Ads non connecté');
  if (ga4?.available && ga4.today?.bounceRate > 0.7) warnings.push(`Taux de rebond élevé : ${(ga4.today.bounceRate * 100).toFixed(0)}%`);

  return {
    health_score: score,
    health_trend: trend,
    summary: `${todayOrders} commande(s) aujourd'hui pour $${todayRevenue} ${revenueLabel}. ${monthOrders} commandes ce mois ($${monthRevenue} CA).`,
    highlights,
    warnings,
    recommendations: [
      !meta?.available ? 'Connecter Meta Ads API pour le suivi des campagnes' : null,
      !google?.available ? 'Connecter Google Ads API pour le suivi des campagnes' : null,
      !ga4?.available ? 'Connecter GA4 pour le suivi du trafic site' : null,
      todayOrders === 0 ? 'Vérifier les campagnes actives et le budget' : null,
    ].filter(Boolean),
    meta_analysis: meta?.available ? 'Données disponibles' : 'Non connecté — configurer META_ADS_ACCESS_TOKEN et META_ADS_ACCOUNT_ID',
    google_analysis: google?.available ? 'Données disponibles' : 'Non connecté — configurer les credentials Google Ads',
    site_analysis: ga4?.available ? `${ga4.today?.users || 0} visiteurs aujourd'hui, ${(ga4.today?.bounceRate * 100 || 0).toFixed(0)}% rebond` : 'Non connecté — configurer GA4_PROPERTY_ID, GA4_CLIENT_EMAIL, GA4_PRIVATE_KEY',
    revenue_analysis: `CA jour: $${todayRevenue} ${revenueLabel} | CA mois: $${monthRevenue} ${revenueLabel}`,
  };
}
