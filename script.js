// ===== Configuration =====
const SEARCH_API_URL = '/api/search';
const STRIPE_LINKS = {
    50: 'https://buy.stripe.com/test_fZu3cw2m4aBG8Di9vy2VG00',
    100: 'https://buy.stripe.com/test_dRm9AU2m4aBG2eU2362VG01',
    200: 'https://buy.stripe.com/test_8x2eVe3q8dNS7zegY02VG02',
    500: 'https://buy.stripe.com/test_eVq6oIe4Mh04g5K4be2VG03',
    1000: 'https://buy.stripe.com/test_00wdRa6Ckh04aLq5fi2VG04'
};

// ===== i18n - Language Detection & Translations =====
const translations = {
    en: {
        page_title: 'BeatPush - Beatport Promotion | Boost Your Sales',
        page_desc: 'Boost your tracks on Beatport with BeatPush. Buy copies to propel your music into the charts.',
        nav_how: 'HOW IT WORKS',
        nav_pricing: 'PRICING',
        nav_cta: 'BOOST MY TRACK',
        hero_badge: 'Industry-Level Promotion. Real Results.',
        hero_title: 'Professional Beatport promotion for <span class="text-gradient">DJs</span>, <span class="text-gradient">producers</span> and <span class="text-gradient">labels.</span>',
        hero_subtitle: 'For over 10 years, Beatpush has helped artists generate visibility and momentum on Beatport charts.<br>No shortcuts. No automation. Just real strategy.',
        stat_tracks: 'Tracks boosted',
        stat_artists: 'Satisfied artists',
        stat_delivery: 'Fast delivery',
        trust_payment: 'Secure payment',
        trust_delivery: 'Delivery within 24-72h',
        trust_confidential: '100% confidential',
        trust_support: 'Support 7 days a week',
        search_badge: 'STEP 1',
        search_title: 'Find your track',
        search_desc: 'Search for your track on Beatport and select it to start the promotion.',
        search_placeholder: 'Track name, artist or Beatport URL...',
        search_btn: 'SEARCH',
        search_empty: 'No tracks found on Beatport. Try another search term.',
        pricing_badge: 'STEP 2',
        pricing_title: 'Choose your pack',
        pricing_desc: 'Select the number of copies to boost your track in the charts.',
        change_track: 'Change',
        select_btn: 'SELECT',
        popular_badge: 'POPULAR',
        pack_starter_f1: 'Delivery within 72h',
        pack_starter_f2: 'Boost into Top 100 genre',
        pack_starter_f3: 'Email support',
        pack_pro_f1: 'Delivery within 48h',
        pack_pro_f2: 'Boost into Top 50 genre',
        pack_pro_f3: 'Priority support',
        pack_pro_f4: 'Progress report',
        pack_elite_f1: 'Delivery within 24h',
        pack_elite_f2: 'Boost into Top 10 genre',
        pack_elite_f3: 'VIP support 24/7',
        pack_elite_f4: 'Detailed report',
        pack_label_f1: 'Express delivery',
        pack_label_f2: 'Boost into Top 10 overall',
        pack_label_f3: 'Dedicated manager',
        pack_label_f4: 'Results guarantee',
        how_badge: 'SIMPLE & EFFECTIVE',
        how_title: 'How does it work?',
        how_desc: 'In 3 simple steps, boost your track in the Beatport charts.',
        step1_title: 'Search for your track',
        step1_desc: 'Enter your track name or artist and select your track from our Beatport database.',
        step2_title: 'Choose your pack',
        step2_desc: 'Select the number of copies you want to purchase based on your ranking goals.',
        step3_title: 'Watch your track rise',
        step3_desc: 'After payment, your promotion starts immediately. Track your results in real time.',
        testimonials_badge: 'TESTIMONIALS',
        testimonials_title: 'They trust us',
        testimonial1_text: '"My track went from nowhere to Top 30 Techno in 3 days. Incredible and fast service."',
        testimonial1_role: 'Techno Producer',
        testimonial2_text: '"We use BeatPush for all our releases. The value for money is unbeatable. Our artists love it."',
        testimonial2_role: 'Label Manager - Deep House',
        testimonial3_text: '"First EP and straight into the Top 100. BeatPush was a game changer for my career."',
        testimonial3_role: 'Melodic Techno Producer',
        faq_title: 'Frequently asked questions',
        faq1_q: 'How long does a campaign take?',
        faq1_a: 'Most promotions are delivered within 2–10 days, depending on genre competition and chart activity.',
        faq2_q: 'Do you use bots?',
        faq2_a: 'No. Beatpush campaigns rely on real promotion strategies and industry experience.',
        faq3_q: 'Can new artists use the service?',
        faq3_a: 'Yes. We work with independent artists, labels and distributors.',
        faq4_q: 'Do exclusive releases perform better?',
        faq4_a: 'In most cases yes, because all activity is concentrated on a single platform, increasing chart visibility.',
        cta_title: 'Ready to dominate the charts?',
        cta_desc: 'Join hundreds of artists using BeatPush to boost their career.',
        cta_btn: 'GET STARTED NOW',
        footer_desc: 'The #1 music promotion platform on Beatport.',
        footer_nav: 'Navigation',
        footer_boost: 'Boost my track',
        footer_how: 'How it works',
        footer_copy: '&copy; 2026 BeatPush. All rights reserved.',
    },
    pt: {
        page_title: 'BeatPush - Promocao Beatport | Impulsione suas vendas',
        page_desc: 'Impulsione suas tracks no Beatport com o BeatPush. Compre copias para levar sua musica aos charts.',
        nav_how: 'COMO FUNCIONA',
        nav_pricing: 'PRECOS',
        nav_cta: 'IMPULSIONAR MINHA TRACK',
        hero_badge: 'Industry-Level Promotion. Real Results.',
        hero_title: 'Promocao profissional no Beatport para <span class="text-gradient">DJs</span>, <span class="text-gradient">produtores</span> e <span class="text-gradient">labels.</span>',
        hero_subtitle: 'Ha mais de 10 anos, a Beatpush ajuda artistas a gerar visibilidade e impulso nos charts do Beatport.<br>Sem atalhos. Sem automacao. Apenas estrategia real.',
        stat_tracks: 'Tracks impulsionadas',
        stat_artists: 'Artistas satisfeitos',
        stat_delivery: 'Entrega rapida',
        trust_payment: 'Pagamento seguro',
        trust_delivery: 'Entrega em 24-72h',
        trust_confidential: '100% confidencial',
        trust_support: 'Suporte 7 dias por semana',
        search_badge: 'PASSO 1',
        search_title: 'Encontre sua track',
        search_desc: 'Pesquise sua musica no Beatport e selecione para iniciar a promocao.',
        search_placeholder: 'Nome da track, artista ou URL do Beatport...',
        search_btn: 'PESQUISAR',
        search_empty: 'Nenhuma track encontrada no Beatport. Tente outro termo.',
        pricing_badge: 'PASSO 2',
        pricing_title: 'Escolha seu pacote',
        pricing_desc: 'Selecione o numero de copias para impulsionar sua track nos charts.',
        change_track: 'Alterar',
        select_btn: 'SELECIONAR',
        popular_badge: 'POPULAR',
        pack_starter_f1: 'Entrega em 72h',
        pack_starter_f2: 'Boost no Top 100 do genero',
        pack_starter_f3: 'Suporte por email',
        pack_pro_f1: 'Entrega em 48h',
        pack_pro_f2: 'Boost no Top 50 do genero',
        pack_pro_f3: 'Suporte prioritario',
        pack_pro_f4: 'Relatorio de progresso',
        pack_elite_f1: 'Entrega em 24h',
        pack_elite_f2: 'Boost no Top 10 do genero',
        pack_elite_f3: 'Suporte VIP 24/7',
        pack_elite_f4: 'Relatorio detalhado',
        pack_label_f1: 'Entrega expressa',
        pack_label_f2: 'Boost no Top 10 geral',
        pack_label_f3: 'Gerente dedicado',
        pack_label_f4: 'Garantia de resultados',
        how_badge: 'SIMPLES & EFICAZ',
        how_title: 'Como funciona?',
        how_desc: 'Em 3 passos simples, impulsione sua track nos charts do Beatport.',
        step1_title: 'Pesquise sua track',
        step1_desc: 'Digite o nome da sua musica ou artista e selecione sua track no nosso banco de dados do Beatport.',
        step2_title: 'Escolha seu pacote',
        step2_desc: 'Selecione o numero de copias que deseja comprar de acordo com seus objetivos de ranking.',
        step3_title: 'Veja sua track subir',
        step3_desc: 'Apos o pagamento, sua promocao comeca imediatamente. Acompanhe seus resultados em tempo real.',
        testimonials_badge: 'DEPOIMENTOS',
        testimonials_title: 'Eles confiam em nos',
        testimonial1_text: '"Minha track saiu do nada para o Top 30 Techno em 3 dias. Servico incrivel e rapido."',
        testimonial1_role: 'Produtor Techno',
        testimonial2_text: '"Usamos o BeatPush para todos os nossos lancamentos. O custo-beneficio e imbativel. Nossos artistas adoram."',
        testimonial2_role: 'Label Manager - Deep House',
        testimonial3_text: '"Primeiro EP e direto para o Top 100. O BeatPush mudou minha carreira."',
        testimonial3_role: 'Produtor Melodic Techno',
        faq_title: 'Perguntas frequentes',
        faq1_q: 'Quanto tempo dura uma campanha?',
        faq1_a: 'A maioria das promocoes e entregue em 2 a 10 dias, dependendo da competicao de genero e atividade nos charts.',
        faq2_q: 'Voces usam bots?',
        faq2_a: 'Nao. As campanhas Beatpush dependem de estrategias reais de promocao e experiencia na industria.',
        faq3_q: 'Novos artistas podem usar o servico?',
        faq3_a: 'Sim. Trabalhamos com artistas independentes, labels e distribuidores.',
        faq4_q: 'Lancamentos exclusivos tem melhor desempenho?',
        faq4_a: 'Na maioria dos casos sim, porque toda a atividade e concentrada em uma unica plataforma, aumentando a visibilidade nos charts.',
        cta_title: 'Pronto para dominar os charts?',
        cta_desc: 'Junte-se a centenas de artistas que usam o BeatPush para impulsionar sua carreira.',
        cta_btn: 'COMECAR AGORA',
        footer_desc: 'A plataforma #1 de promocao musical no Beatport.',
        footer_nav: 'Navegacao',
        footer_boost: 'Impulsionar minha track',
        footer_how: 'Como funciona',
        footer_copy: '&copy; 2026 BeatPush. Todos os direitos reservados.',
    },
    es: {
        page_title: 'BeatPush - Promocion Beatport | Impulsa tus ventas',
        page_desc: 'Impulsa tus tracks en Beatport con BeatPush. Compra copias para llevar tu musica a los charts.',
        nav_how: 'COMO FUNCIONA',
        nav_pricing: 'PRECIOS',
        nav_cta: 'IMPULSAR MI TRACK',
        hero_badge: 'Industry-Level Promotion. Real Results.',
        hero_title: 'Promocion profesional en Beatport para <span class="text-gradient">DJs</span>, <span class="text-gradient">productores</span> y <span class="text-gradient">sellos.</span>',
        hero_subtitle: 'Desde hace mas de 10 anos, Beatpush ayuda a los artistas a generar visibilidad e impulso en los charts de Beatport.<br>Sin atajos. Sin automatizacion. Solo estrategia real.',
        stat_tracks: 'Tracks impulsadas',
        stat_artists: 'Artistas satisfechos',
        stat_delivery: 'Entrega rapida',
        trust_payment: 'Pago seguro',
        trust_delivery: 'Entrega en 24-72h',
        trust_confidential: '100% confidencial',
        trust_support: 'Soporte 7 dias a la semana',
        search_badge: 'PASO 1',
        search_title: 'Encuentra tu track',
        search_desc: 'Busca tu track en Beatport y seleccionala para iniciar la promocion.',
        search_placeholder: 'Nombre de track, artista o URL de Beatport...',
        search_btn: 'BUSCAR',
        search_empty: 'No se encontraron tracks en Beatport. Prueba con otro termino.',
        pricing_badge: 'PASO 2',
        pricing_title: 'Elige tu pack',
        pricing_desc: 'Selecciona el numero de copias para impulsar tu track en los charts.',
        change_track: 'Cambiar',
        select_btn: 'SELECCIONAR',
        popular_badge: 'POPULAR',
        pack_starter_f1: 'Entrega en 72h',
        pack_starter_f2: 'Boost en el Top 100 del genero',
        pack_starter_f3: 'Soporte por email',
        pack_pro_f1: 'Entrega en 48h',
        pack_pro_f2: 'Boost en el Top 50 del genero',
        pack_pro_f3: 'Soporte prioritario',
        pack_pro_f4: 'Informe de progreso',
        pack_elite_f1: 'Entrega en 24h',
        pack_elite_f2: 'Boost en el Top 10 del genero',
        pack_elite_f3: 'Soporte VIP 24/7',
        pack_elite_f4: 'Informe detallado',
        pack_label_f1: 'Entrega express',
        pack_label_f2: 'Boost en el Top 10 general',
        pack_label_f3: 'Manager dedicado',
        pack_label_f4: 'Garantia de resultados',
        how_badge: 'SIMPLE & EFICAZ',
        how_title: 'Como funciona?',
        how_desc: 'En 3 simples pasos, impulsa tu track en los charts de Beatport.',
        step1_title: 'Busca tu track',
        step1_desc: 'Ingresa el nombre de tu track o artista y selecciona tu track desde nuestra base de datos de Beatport.',
        step2_title: 'Elige tu pack',
        step2_desc: 'Selecciona el numero de copias que deseas comprar segun tus objetivos de ranking.',
        step3_title: 'Mira tu track subir',
        step3_desc: 'Despues del pago, tu promocion comienza de inmediato. Sigue tus resultados en tiempo real.',
        testimonials_badge: 'TESTIMONIOS',
        testimonials_title: 'Confian en nosotros',
        testimonial1_text: '"Mi track paso de la nada al Top 30 Techno en 3 dias. Servicio increible y rapido."',
        testimonial1_role: 'Productor Techno',
        testimonial2_text: '"Usamos BeatPush para todos nuestros lanzamientos. La relacion calidad-precio es inmejorable. A nuestros artistas les encanta."',
        testimonial2_role: 'Label Manager - Deep House',
        testimonial3_text: '"Primer EP y directo al Top 100. BeatPush cambio mi carrera."',
        testimonial3_role: 'Productor Melodic Techno',
        faq_title: 'Preguntas frecuentes',
        faq1_q: 'Cuanto dura una campana?',
        faq1_a: 'La mayoria de las promociones se entregan en 2 a 10 dias, dependiendo de la competencia del genero y la actividad en los charts.',
        faq2_q: 'Usan bots?',
        faq2_a: 'No. Las campanas de Beatpush se basan en estrategias reales de promocion y experiencia en la industria.',
        faq3_q: 'Pueden los nuevos artistas usar el servicio?',
        faq3_a: 'Si. Trabajamos con artistas independientes, sellos y distribuidores.',
        faq4_q: 'Los lanzamientos exclusivos tienen mejor rendimiento?',
        faq4_a: 'En la mayoria de los casos si, porque toda la actividad se concentra en una sola plataforma, aumentando la visibilidad en los charts.',
        cta_title: 'Listo para dominar los charts?',
        cta_desc: 'Unete a cientos de artistas que usan BeatPush para impulsar su carrera.',
        cta_btn: 'EMPEZAR AHORA',
        footer_desc: 'La plataforma #1 de promocion musical en Beatport.',
        footer_nav: 'Navegacion',
        footer_boost: 'Impulsar mi track',
        footer_how: 'Como funciona',
        footer_copy: '&copy; 2026 BeatPush. Todos los derechos reservados.',
    },
    de: {
        page_title: 'BeatPush - Beatport Promotion | Steigere deine Verkaufe',
        page_desc: 'Booste deine Tracks auf Beatport mit BeatPush. Kaufe Kopien um deine Musik in die Charts zu bringen.',
        nav_how: 'WIE ES FUNKTIONIERT',
        nav_pricing: 'PREISE',
        nav_cta: 'MEINEN TRACK BOOSTEN',
        hero_badge: 'Industry-Level Promotion. Real Results.',
        hero_title: 'Professionelle Beatport-Promotion fur <span class="text-gradient">DJs</span>, <span class="text-gradient">Produzenten</span> und <span class="text-gradient">Labels.</span>',
        hero_subtitle: 'Seit uber 10 Jahren hilft Beatpush Kunstlern, Sichtbarkeit und Dynamik in den Beatport-Charts zu erzeugen.<br>Keine Abkurzungen. Keine Automatisierung. Nur echte Strategie.',
        stat_tracks: 'Tracks geboostet',
        stat_artists: 'Zufriedene Kunstler',
        stat_delivery: 'Schnelle Lieferung',
        trust_payment: 'Sichere Zahlung',
        trust_delivery: 'Lieferung in 24-72h',
        trust_confidential: '100% vertraulich',
        trust_support: 'Support 7 Tage die Woche',
        search_badge: 'SCHRITT 1',
        search_title: 'Finde deinen Track',
        search_desc: 'Suche deinen Track auf Beatport und wahle ihn aus, um die Promotion zu starten.',
        search_placeholder: 'Trackname, Kunstler oder Beatport-URL...',
        search_btn: 'SUCHEN',
        search_empty: 'Keine Tracks auf Beatport gefunden. Versuche einen anderen Suchbegriff.',
        pricing_badge: 'SCHRITT 2',
        pricing_title: 'Wahle dein Paket',
        pricing_desc: 'Wahle die Anzahl der Kopien, um deinen Track in den Charts zu boosten.',
        change_track: 'Andern',
        select_btn: 'AUSWAHLEN',
        popular_badge: 'BELIEBT',
        pack_starter_f1: 'Lieferung in 72h',
        pack_starter_f2: 'Boost in die Top 100 des Genres',
        pack_starter_f3: 'E-Mail-Support',
        pack_pro_f1: 'Lieferung in 48h',
        pack_pro_f2: 'Boost in die Top 50 des Genres',
        pack_pro_f3: 'Prioritats-Support',
        pack_pro_f4: 'Fortschrittsbericht',
        pack_elite_f1: 'Lieferung in 24h',
        pack_elite_f2: 'Boost in die Top 10 des Genres',
        pack_elite_f3: 'VIP-Support 24/7',
        pack_elite_f4: 'Detaillierter Bericht',
        pack_label_f1: 'Express-Lieferung',
        pack_label_f2: 'Boost in die Top 10 gesamt',
        pack_label_f3: 'Dedizierter Manager',
        pack_label_f4: 'Ergebnis-Garantie',
        how_badge: 'EINFACH & EFFEKTIV',
        how_title: 'Wie funktioniert es?',
        how_desc: 'In 3 einfachen Schritten boostest du deinen Track in den Beatport Charts.',
        step1_title: 'Suche deinen Track',
        step1_desc: 'Gib den Namen deines Tracks oder Kunstlers ein und wahle deinen Track aus unserer Beatport-Datenbank.',
        step2_title: 'Wahle dein Paket',
        step2_desc: 'Wahle die Anzahl der Kopien, die du kaufen mochtest, basierend auf deinen Ranking-Zielen.',
        step3_title: 'Sieh deinen Track steigen',
        step3_desc: 'Nach der Zahlung startet deine Promotion sofort. Verfolge deine Ergebnisse in Echtzeit.',
        testimonials_badge: 'BEWERTUNGEN',
        testimonials_title: 'Sie vertrauen uns',
        testimonial1_text: '"Mein Track ging in 3 Tagen von nichts in die Top 30 Techno. Unglaublicher und schneller Service."',
        testimonial1_role: 'Techno-Produzent',
        testimonial2_text: '"Wir nutzen BeatPush fur alle unsere Releases. Das Preis-Leistungs-Verhaltnis ist unschlagbar. Unsere Kunstler lieben es."',
        testimonial2_role: 'Label Manager - Deep House',
        testimonial3_text: '"Erste EP und direkt in die Top 100. BeatPush hat meine Karriere verandert."',
        testimonial3_role: 'Melodic Techno Produzent',
        faq_title: 'Haufig gestellte Fragen',
        faq1_q: 'Wie lange dauert eine Kampagne?',
        faq1_a: 'Die meisten Promotionen werden innerhalb von 2 bis 10 Tagen geliefert, je nach Genre-Wettbewerb und Chart-Aktivitat.',
        faq2_q: 'Verwenden Sie Bots?',
        faq2_a: 'Nein. Beatpush-Kampagnen basieren auf echten Promotionsstrategien und Branchenerfahrung.',
        faq3_q: 'Konnen neue Kunstler den Service nutzen?',
        faq3_a: 'Ja. Wir arbeiten mit unabhangigen Kunstlern, Labels und Distributoren.',
        faq4_q: 'Haben exklusive Veroffentlichungen bessere Ergebnisse?',
        faq4_a: 'In den meisten Fallen ja, da sich alle Aktivitaten auf eine einzige Plattform konzentrieren, was die Chart-Sichtbarkeit erhoht.',
        cta_title: 'Bereit, die Charts zu dominieren?',
        cta_desc: 'Schliesse dich Hunderten von Kunstlern an, die BeatPush nutzen, um ihre Karriere zu boosten.',
        cta_btn: 'JETZT STARTEN',
        footer_desc: 'Die #1 Musik-Promotion-Plattform auf Beatport.',
        footer_nav: 'Navigation',
        footer_boost: 'Meinen Track boosten',
        footer_how: 'Wie es funktioniert',
        footer_copy: '&copy; 2026 BeatPush. Alle Rechte vorbehalten.',
    }
};

// French default texts (for switching back to FR)
const frDefaults = {
    page_title: 'BeatPush - Promotion Beatport | Boostez vos ventes',
    page_desc: 'Boostez vos tracks sur Beatport avec BeatPush. Achetez des copies pour propulser votre musique dans les charts.',
    nav_how: 'COMMENT CA MARCHE', nav_pricing: 'TARIFS', nav_cta: 'BOOSTER MA TRACK',
    hero_badge: 'Industry-Level Promotion. Real Results.',
    hero_title: 'Promotion Beatport professionnelle pour <span class="text-gradient">DJs</span>, <span class="text-gradient">producteurs</span> et <span class="text-gradient">labels.</span>',
    hero_subtitle: 'Depuis plus de 10 ans, Beatpush aide les artistes a generer de la visibilite et de l\'elan sur les charts Beatport.<br>Pas de raccourcis. Pas d\'automatisation. Juste de la vraie strategie.',
    stat_tracks: 'Tracks boostees', stat_artists: 'Artistes satisfaits', stat_delivery: 'Livraison rapide',
    trust_payment: 'Paiement securise', trust_delivery: 'Livraison sous 24-72h', trust_confidential: '100% confidentiel', trust_support: 'Support 7j/7',
    search_badge: 'ETAPE 1', search_title: 'Trouvez votre track',
    search_desc: 'Recherchez votre morceau sur Beatport et selectionnez-le pour commencer la promotion.',
    search_placeholder: 'Nom de track, artiste ou URL Beatport...', search_btn: 'RECHERCHER',
    search_empty: 'Aucun titre trouve sur Beatport. Essayez un autre terme.',
    pricing_badge: 'ETAPE 2', pricing_title: 'Choisissez votre pack',
    pricing_desc: 'Selectionnez le nombre de copies pour booster votre track dans les charts.',
    change_track: 'Changer', select_btn: 'SELECTIONNER', popular_badge: 'POPULAIRE',
    pack_starter_f1: 'Livraison sous 72h', pack_starter_f2: 'Boost dans le Top 100 genre', pack_starter_f3: 'Support par email',
    pack_pro_f1: 'Livraison sous 48h', pack_pro_f2: 'Boost dans le Top 50 genre', pack_pro_f3: 'Support prioritaire', pack_pro_f4: 'Rapport de progression',
    pack_elite_f1: 'Livraison sous 24h', pack_elite_f2: 'Boost dans le Top 10 genre', pack_elite_f3: 'Support VIP 24/7', pack_elite_f4: 'Rapport detaille',
    pack_label_f1: 'Livraison express', pack_label_f2: 'Boost dans le Top 10 overall', pack_label_f3: 'Manager dedie', pack_label_f4: 'Garantie de resultats',
    how_badge: 'SIMPLE & EFFICACE', how_title: 'Comment ca marche ?',
    how_desc: 'En 3 etapes simples, boostez votre track dans les charts Beatport.',
    step1_title: 'Recherchez votre track', step1_desc: 'Entrez le nom de votre morceau ou artiste et selectionnez votre track depuis notre base de donnees Beatport.',
    step2_title: 'Choisissez votre pack', step2_desc: 'Selectionnez le nombre de copies que vous souhaitez acheter selon vos objectifs de classement.',
    step3_title: 'Regardez votre track monter', step3_desc: 'Apres paiement, votre promotion demarre immediatement. Suivez vos resultats en temps reel.',
    testimonials_badge: 'TEMOIGNAGES', testimonials_title: 'Ils nous font confiance',
    testimonial1_text: '"Ma track est passee de nulle part au Top 30 Techno en 3 jours. Service incroyable et rapide."', testimonial1_role: 'Producteur Techno',
    testimonial2_text: '"On utilise BeatPush pour toutes nos sorties. Le rapport qualite-prix est imbattable. Nos artistes adorent."', testimonial2_role: 'Label Manager - Deep House',
    testimonial3_text: '"Premier EP et directement dans le Top 100. BeatPush a change la donne pour ma carriere."', testimonial3_role: 'Producteur Melodic Techno',
    faq_title: 'Questions frequentes',
    faq1_q: 'Combien de temps dure une campagne ?', faq1_a: 'La plupart des promotions sont livrees en 2 a 10 jours, selon la competition du genre et l\'activite dans les charts.',
    faq2_q: 'Utilisez-vous des bots ?', faq2_a: 'Non. Les campagnes Beatpush reposent sur de vraies strategies de promotion et une experience dans l\'industrie.',
    faq3_q: 'Les nouveaux artistes peuvent-ils utiliser le service ?', faq3_a: 'Oui. Nous travaillons avec des artistes independants, des labels et des distributeurs.',
    faq4_q: 'Les sorties exclusives ont-elles de meilleurs resultats ?', faq4_a: 'Dans la plupart des cas oui, car toute l\'activite est concentree sur une seule plateforme, augmentant la visibilite dans les charts.',
    cta_title: 'Pret a dominer les charts ?', cta_desc: 'Rejoignez des centaines d\'artistes qui utilisent BeatPush pour booster leur carriere.', cta_btn: 'COMMENCER MAINTENANT',
    footer_desc: 'La plateforme #1 de promotion musicale sur Beatport.', footer_nav: 'Navigation', footer_boost: 'Booster ma track', footer_how: 'Comment ca marche',
    footer_copy: '&copy; 2026 BeatPush. Tous droits reserves.',
};

function detectLanguage() {
    const saved = localStorage.getItem('beatpush_lang');
    if (saved && (saved === 'fr' || translations[saved])) return saved;
    return 'en';
}

function applyTranslations(lang) {
    if (!lang) lang = detectLanguage();

    document.documentElement.lang = lang;
    const t = lang === 'fr' ? frDefaults : (translations[lang] || translations.en);

    // data-i18n: textContent
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
    });

    // data-i18n-html: innerHTML
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (t[key]) el.innerHTML = t[key];
    });

    // data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) el.placeholder = t[key];
    });

    // data-i18n-content: meta tags
    document.querySelectorAll('[data-i18n-content]').forEach(el => {
        const key = el.getAttribute('data-i18n-content');
        if (t[key]) el.setAttribute('content', t[key]);
    });

    if (t.page_title) document.title = t.page_title;

    // Update lang selector UI
    const currentLangEl = document.getElementById('currentLang');
    if (currentLangEl) currentLangEl.textContent = lang.toUpperCase();
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.lang === lang);
    });
}

// Apply on load
applyTranslations();

// Language selector logic
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('langDropdown');
    const langBtn = document.getElementById('langBtn');

    // Toggle dropdown
    if (langBtn && langBtn.contains(e.target)) {
        e.stopPropagation();
        dropdown.classList.toggle('open');
        return;
    }

    // Select language
    const option = e.target.closest('.lang-option');
    if (option) {
        const lang = option.dataset.lang;
        localStorage.setItem('beatpush_lang', lang);
        applyTranslations(lang);
        dropdown.classList.remove('open');
        return;
    }

    // Close dropdown on outside click
    if (dropdown) dropdown.classList.remove('open');
});

// ===== DOM Elements =====
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const searchInput = document.getElementById('trackSearch');
const searchBtn = document.getElementById('searchBtn');
const searchResults = document.getElementById('searchResults');
// ===== State =====
let selectedTrack = null;
let searchTimeout = null;
let currentSearchQuery = '';

// ===== Mobile Menu =====
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ===== Navbar scroll effect =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.9)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.6)';
    }
});

// ===== Search Bar Glow Animation =====
const searchWrap = document.getElementById('searchWrap');
if (searchWrap) {
    searchWrap.addEventListener('click', function(e) {
        // Create a pulse ripple on click
        this.style.animation = 'none';
        void this.offsetWidth; // trigger reflow
        this.style.animation = '';
        this.classList.add('search-pulse');
        setTimeout(() => this.classList.remove('search-pulse'), 600);
    });
}

// ===== Scroll Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.step-card, .testimonial-card, .product-card, .section-header, .search-box, .cta-box, .faq-item').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ===== Beatport URL Detection =====
function parseBeatportUrl(input) {
    // Match patterns like:
    // https://www.beatport.com/track/track-name/12345
    // https://beatport.com/track/track-name/12345
    // beatport.com/track/track-name/12345
    const urlPattern = /(?:https?:\/\/)?(?:www\.)?beatport\.com\/track\/([^/]+)\/(\d+)/i;
    const match = input.match(urlPattern);
    if (match) {
        return {
            slug: match[1],
            id: match[2],
            // Extract readable name from slug
            name: match[1].replace(/-/g, ' ')
        };
    }
    return null;
}

// ===== Track Search =====
// Auto-search on every input (debounced)
searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    const query = searchInput.value.trim();

    if (query.length < 2) {
        searchResults.innerHTML = '';
        hideSearchLoading();
        return;
    }

    // Show loading immediately
    showSearchLoading();

    // Shorter debounce for responsive feel
    searchTimeout = setTimeout(() => performSearch(), 400);
});

// Also search on Enter
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        clearTimeout(searchTimeout);
        performSearch();
    }
});

// Search button click
searchBtn.addEventListener('click', () => {
    clearTimeout(searchTimeout);
    performSearch();
});

function showSearchLoading() {
    const btnText = searchBtn.querySelector('.search-btn-text');
    const spinner = searchBtn.querySelector('.search-spinner');
    btnText.style.display = 'none';
    spinner.style.display = 'block';
    searchBtn.disabled = true;
}

function hideSearchLoading() {
    const btnText = searchBtn.querySelector('.search-btn-text');
    const spinner = searchBtn.querySelector('.search-spinner');
    btnText.style.display = 'inline';
    spinner.style.display = 'none';
    searchBtn.disabled = false;
}

async function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    // Avoid duplicate searches
    if (query === currentSearchQuery) {
        hideSearchLoading();
        return;
    }
    currentSearchQuery = query;

    showSearchLoading();

    try {
        // Check if user pasted a Beatport URL
        const beatportUrl = parseBeatportUrl(query);
        let searchQuery = beatportUrl ? beatportUrl.name : query;

        const response = await fetch(`${SEARCH_API_URL}?q=${encodeURIComponent(searchQuery)}`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Blaron API response:', data);

        // If searching by URL and we have an ID, try to highlight matching track
        displayResults(data, beatportUrl ? beatportUrl.id : null);
    } catch (error) {
        console.error('Search error:', error);
        currentSearchQuery = ''; // Allow retry on same query
        displayDemoResults(query);
    } finally {
        hideSearchLoading();
    }
}

function displayResults(data, targetTrackId) {
    searchResults.innerHTML = '';

    // Blaron API returns a direct array of tracks
    let tracks = Array.isArray(data) ? data : [];

    tracks = tracks.filter(item => item.title);

    if (!tracks.length) {
        const lang = detectLanguage();
        const emptyMsg = (lang !== 'fr' && translations[lang] && translations[lang].search_empty) || 'Aucun titre trouve sur Beatport. Essayez un autre terme.';
        searchResults.innerHTML = `<div class="search-empty">${emptyMsg}</div>`;
        return;
    }

    // If we have a target track ID from URL, match by link
    if (targetTrackId) {
        tracks.sort((a, b) => {
            const aMatch = a.link && a.link.includes(targetTrackId);
            const bMatch = b.link && b.link.includes(targetTrackId);
            return bMatch - aMatch;
        });
    }

    tracks.slice(0, 10).forEach(track => {
        const title = track.title;
        const artist = Array.isArray(track.artists) ? track.artists.join(', ') : 'Artiste inconnu';
        const artwork = track.image_url || '';
        const genre = Array.isArray(track.genre) ? track.genre.join(', ') : '';
        const link = track.link || '';

        const el = createTrackElement(title, artist, artwork, link, genre);
        searchResults.appendChild(el);
    });
}

function displayDemoResults(query) {
    searchResults.innerHTML = '';

    // Check if it's a Beatport URL for better demo results
    const beatportUrl = parseBeatportUrl(query);
    const displayName = beatportUrl ? beatportUrl.name : query;

    const demoTracks = [
        { title: `${displayName} (Original Mix)`, artist: 'Various Artists', artwork: '' },
        { title: `${displayName} - Extended Mix`, artist: 'DJ Producer', artwork: '' },
        { title: `${displayName} (Remix)`, artist: 'Top Artist', artwork: '' },
    ];

    demoTracks.forEach((track, i) => {
        const el = createTrackElement(track.title, track.artist, track.artwork, '', '');
        searchResults.appendChild(el);
    });
}

function createTrackElement(title, artist, artwork, link, genre) {
    const el = document.createElement('div');
    el.className = 'track-result';

    const safeTitle = escapeHtml(title);
    const safeArtist = escapeHtml(artist);
    const safeGenre = genre ? escapeHtml(genre) : '';
    // Use larger image (500x500 instead of 200x200)
    const largeArtwork = artwork ? artwork.replace('200x200', '500x500') : '';

    el.innerHTML = `
        <div class="track-art">
            ${artwork
                ? `<img src="${escapeHtml(artwork)}" alt="${safeTitle}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                   <div class="track-art-placeholder" style="display:none;">
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                   </div>`
                : `<div class="track-art-placeholder">
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                   </div>`
            }
        </div>
        <div class="track-info">
            <div class="track-title">${safeTitle}</div>
            <div class="track-artist">${safeArtist}</div>
            ${safeGenre ? `<div class="track-genre">${safeGenre}</div>` : ''}
        </div>
    `;

    el.addEventListener('click', () => {
        selectTrack(title, artist, largeArtwork, link);
    });

    return el;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function selectTrack(title, artist, artwork, id) {
    selectedTrack = { title, artist, artwork, id };

    // Scroll to pricing
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
        setTimeout(() => {
            pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    // Clear search results
    searchResults.innerHTML = '';
}

// ===== FAQ Toggle =====
function toggleFaq(btn) {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

    // Toggle current
    if (!isOpen) {
        item.classList.add('open');
    }
}
