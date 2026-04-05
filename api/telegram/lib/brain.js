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
1. Compare toujours hier vs moyenne du mois pour détecter les anomalies
2. Un CPA (coût par acquisition) acceptable est < $100 pour ce business
3. Un ROAS > 3x est bon, > 5x est excellent
4. Priorise les insights actionnables, pas les évidences
5. Si les données Ads ne sont pas disponibles, analyse les données Supabase (commandes, tendances)
6. Sois direct et concret — pas de blabla

RÉPONSE FORMAT JSON :
{
  "health_score": 0-100,
  "health_trend": "up|down|stable",
  "summary": "1-2 phrases résumé performance",
  "highlights": ["Point positif 1", "Point positif 2"],
  "warnings": ["Alerte 1", "Alerte 2"],
  "recommendations": ["Action recommandée 1", "Action recommandée 2"],
  "meta_analysis": "Analyse spécifique Meta Ads (ou 'Non disponible')",
  "google_analysis": "Analyse spécifique Google Ads (ou 'Non disponible')",
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

// Fallback when Claude API is not available
function generateFallbackAnalysis(data) {
  const { supabase, meta, google } = data;
  const todayRevenue = supabase?.today?.revenue || 0;
  const yesterdayRevenue = supabase?.yesterday?.revenue || 0;
  const monthRevenue = supabase?.month?.revenue || 0;
  const todayOrders = supabase?.today?.count || 0;
  const monthOrders = supabase?.month?.count || 0;

  const trend = todayRevenue > yesterdayRevenue ? 'up' : todayRevenue < yesterdayRevenue ? 'down' : 'stable';

  // Simple health score based on available data
  let score = 50;
  if (todayOrders > 0) score += 15;
  if (todayRevenue > 500) score += 15;
  if (monthOrders > 10) score += 10;
  if (meta?.available && meta.yesterday?.totals?.totalConversions > 0) score += 10;
  if (google?.available && google.yesterday?.totals?.totalConversions > 0) score += 10;
  score = Math.min(score, 100);

  const highlights = [];
  const warnings = [];

  if (todayOrders > 0) highlights.push(`${todayOrders} commande(s) aujourd'hui ($${todayRevenue})`);
  if (monthRevenue > 0) highlights.push(`$${monthRevenue} CA ce mois (${monthOrders} commandes)`);
  if (todayOrders === 0) warnings.push('Aucune commande aujourd\'hui');
  if (!meta?.available) warnings.push('Meta Ads non connecté');
  if (!google?.available) warnings.push('Google Ads non connecté');

  return {
    health_score: score,
    health_trend: trend,
    summary: `${todayOrders} commande(s) aujourd'hui pour $${todayRevenue}. ${monthOrders} commandes ce mois ($${monthRevenue} CA).`,
    highlights,
    warnings,
    recommendations: [
      !meta?.available ? 'Connecter Meta Ads API pour le suivi des campagnes' : null,
      !google?.available ? 'Connecter Google Ads API pour le suivi des campagnes' : null,
      todayOrders === 0 ? 'Vérifier les campagnes actives et le budget' : null,
    ].filter(Boolean),
    meta_analysis: meta?.available ? 'Données disponibles' : 'Non connecté — configurer META_ADS_ACCESS_TOKEN et META_ADS_ACCOUNT_ID',
    google_analysis: google?.available ? 'Données disponibles' : 'Non connecté — configurer les credentials Google Ads',
    revenue_analysis: `CA jour: $${todayRevenue} | CA mois: $${monthRevenue}`,
  };
}
