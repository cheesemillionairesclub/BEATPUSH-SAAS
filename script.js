// ===== Configuration =====
const SEARCH_API_URL = '/api/search';
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/test_eVq28tdkwgOre3xbwS0RG00';

// ===== i18n - Language Detection & Translations =====
const translations = {
    en: {
        page_title: 'BeatPush - Beatport Promotion | Boost Your Sales',
        page_desc: 'Boost your tracks on Beatport with BeatPush. Buy copies to propel your music into the charts.',
        nav_how: 'HOW IT WORKS',
        nav_pricing: 'PRICING',
        nav_cta: 'BOOST MY TRACK',
        hero_badge: 'BEATPORT PROMOTION #1',
        hero_title: 'Propel your music<br>into the <span class="text-gradient">Beatport Charts</span>',
        hero_subtitle: 'Boost your sales on Beatport and climb the rankings. Reliable, fast, and discreet service used by professional artists and labels.',
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
        faq1_q: 'How does Beatport promotion work?',
        faq1_a: 'We use a network of DJs and electronic music enthusiasts to generate real purchases of your track on Beatport. This helps increase your chart ranking organically.',
        faq2_q: 'How quickly will I see results?',
        faq2_a: 'Results are visible within 24 to 72 hours after your order, depending on the pack chosen. Elite and Label packs benefit from priority processing.',
        faq3_q: 'Is it risk-free for my account?',
        faq3_a: 'Yes, our method is 100% safe. We generate real purchases from real users, which is fully compliant with Beatport\'s terms of service.',
        faq4_q: 'Which music genres are supported?',
        faq4_a: 'All genres available on Beatport are supported: Techno, House, Trance, Drum & Bass, Melodic House & Techno, Deep House, and many more.',
        faq5_q: 'What payment methods do you accept?',
        faq5_a: 'We accept all major credit cards (Visa, Mastercard, Amex) via our secure Stripe payment platform. Apple Pay and Google Pay are also available.',
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
        hero_badge: 'PROMOCAO BEATPORT #1',
        hero_title: 'Leve sua musica<br>para os <span class="text-gradient">Charts do Beatport</span>',
        hero_subtitle: 'Impulsione suas vendas no Beatport e suba nos rankings. Servico confiavel, rapido e discreto usado por artistas e selos profissionais.',
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
        faq1_q: 'Como funciona a promocao no Beatport?',
        faq1_a: 'Usamos uma rede de DJs e entusiastas de musica eletronica para gerar compras reais da sua track no Beatport. Isso ajuda a aumentar seu ranking nos charts de forma organica.',
        faq2_q: 'Em quanto tempo vou ver os resultados?',
        faq2_a: 'Os resultados sao visiveis em 24 a 72 horas apos o pedido, dependendo do pacote escolhido. Os pacotes Elite e Label tem processamento prioritario.',
        faq3_q: 'E seguro para minha conta?',
        faq3_a: 'Sim, nosso metodo e 100% seguro. Geramos compras reais de usuarios reais, totalmente em conformidade com os termos do Beatport.',
        faq4_q: 'Quais generos musicais sao suportados?',
        faq4_a: 'Todos os generos disponiveis no Beatport sao suportados: Techno, House, Trance, Drum & Bass, Melodic House & Techno, Deep House e muitos outros.',
        faq5_q: 'Quais formas de pagamento voces aceitam?',
        faq5_a: 'Aceitamos todos os principais cartoes de credito (Visa, Mastercard, Amex) via nossa plataforma segura Stripe. Apple Pay e Google Pay tambem estao disponiveis.',
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
        hero_badge: 'PROMOCION BEATPORT #1',
        hero_title: 'Lleva tu musica<br>a los <span class="text-gradient">Charts de Beatport</span>',
        hero_subtitle: 'Impulsa tus ventas en Beatport y sube en los rankings. Servicio fiable, rapido y discreto usado por artistas y sellos profesionales.',
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
        faq1_q: 'Como funciona la promocion en Beatport?',
        faq1_a: 'Usamos una red de DJs y entusiastas de la musica electronica para generar compras reales de tu track en Beatport. Esto ayuda a aumentar tu ranking en los charts de forma organica.',
        faq2_q: 'En cuanto tiempo vere los resultados?',
        faq2_a: 'Los resultados son visibles en 24 a 72 horas despues de tu pedido, segun el pack elegido. Los packs Elite y Label tienen procesamiento prioritario.',
        faq3_q: 'Es seguro para mi cuenta?',
        faq3_a: 'Si, nuestro metodo es 100% seguro. Generamos compras reales de usuarios reales, completamente conforme con los terminos de servicio de Beatport.',
        faq4_q: 'Que generos musicales estan soportados?',
        faq4_a: 'Todos los generos disponibles en Beatport estan soportados: Techno, House, Trance, Drum & Bass, Melodic House & Techno, Deep House y muchos mas.',
        faq5_q: 'Que metodos de pago aceptan?',
        faq5_a: 'Aceptamos todas las tarjetas de credito principales (Visa, Mastercard, Amex) via nuestra plataforma segura Stripe. Apple Pay y Google Pay tambien estan disponibles.',
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
        hero_badge: 'BEATPORT PROMOTION #1',
        hero_title: 'Bringe deine Musik<br>in die <span class="text-gradient">Beatport Charts</span>',
        hero_subtitle: 'Steigere deine Verkaufe auf Beatport und klettere in den Rankings. Zuverlassiger, schneller und diskreter Service, genutzt von professionellen Kunstlern und Labels.',
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
        faq1_q: 'Wie funktioniert die Beatport-Promotion?',
        faq1_a: 'Wir nutzen ein Netzwerk von DJs und Fans elektronischer Musik, um echte Kaufe deines Tracks auf Beatport zu generieren. Das hilft, dein Chart-Ranking organisch zu steigern.',
        faq2_q: 'Wie schnell sehe ich Ergebnisse?',
        faq2_a: 'Ergebnisse sind innerhalb von 24 bis 72 Stunden nach der Bestellung sichtbar, je nach gewahltem Paket. Elite- und Label-Pakete profitieren von bevorzugter Bearbeitung.',
        faq3_q: 'Ist es risikofrei fur mein Konto?',
        faq3_a: 'Ja, unsere Methode ist 100% sicher. Wir generieren echte Kaufe von echten Nutzern, was vollstandig mit den Nutzungsbedingungen von Beatport konform ist.',
        faq4_q: 'Welche Musikgenres werden unterstutzt?',
        faq4_a: 'Alle auf Beatport verfugbaren Genres werden unterstutzt: Techno, House, Trance, Drum & Bass, Melodic House & Techno, Deep House und viele mehr.',
        faq5_q: 'Welche Zahlungsmethoden akzeptieren Sie?',
        faq5_a: 'Wir akzeptieren alle gangigen Kreditkarten (Visa, Mastercard, Amex) uber unsere sichere Stripe-Zahlungsplattform. Apple Pay und Google Pay sind ebenfalls verfugbar.',
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
    hero_badge: 'PROMOTION BEATPORT #1',
    hero_title: 'Propulsez votre musique<br>dans les <span class="text-gradient">Charts Beatport</span>',
    hero_subtitle: 'Boostez vos ventes sur Beatport et grimpez dans les classements. Service fiable, rapide et discret utilise par des artistes et labels professionnels.',
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
    faq1_q: 'Comment fonctionne la promotion Beatport ?', faq1_a: 'Nous utilisons un reseau de DJs et de passionnes de musique electronique pour generer des achats reels de votre track sur Beatport. Cela permet d\'augmenter votre classement dans les charts de maniere organique.',
    faq2_q: 'En combien de temps vais-je voir les resultats ?', faq2_a: 'Les resultats sont visibles dans les 24 a 72 heures suivant votre commande, selon le pack choisi. Le pack Elite et Label beneficient d\'un traitement prioritaire.',
    faq3_q: 'Est-ce que c\'est sans risque pour mon compte ?', faq3_a: 'Oui, notre methode est 100% sure. Nous generons de vrais achats par de vrais utilisateurs, ce qui est completement conforme aux conditions d\'utilisation de Beatport.',
    faq4_q: 'Quels genres musicaux sont supportes ?', faq4_a: 'Tous les genres disponibles sur Beatport sont supportes : Techno, House, Trance, Drum & Bass, Melodic House & Techno, Deep House, et bien d\'autres.',
    faq5_q: 'Quels moyens de paiement acceptez-vous ?', faq5_a: 'Nous acceptons toutes les cartes bancaires (Visa, Mastercard, Amex) via notre plateforme de paiement securisee Stripe. Apple Pay et Google Pay sont egalement disponibles.',
    cta_title: 'Pret a dominer les charts ?', cta_desc: 'Rejoignez des centaines d\'artistes qui utilisent BeatPush pour booster leur carriere.', cta_btn: 'COMMENCER MAINTENANT',
    footer_desc: 'La plateforme #1 de promotion musicale sur Beatport.', footer_nav: 'Navigation', footer_boost: 'Booster ma track', footer_how: 'Comment ca marche',
    footer_copy: '&copy; 2026 BeatPush. Tous droits reserves.',
};

function detectLanguage() {
    const saved = localStorage.getItem('beatpush_lang');
    if (saved && (saved === 'fr' || translations[saved])) return saved;
    const lang = (navigator.language || navigator.userLanguage || 'fr').toLowerCase();
    if (lang.startsWith('fr')) return 'fr';
    if (lang.startsWith('pt')) return 'pt';
    if (lang.startsWith('es')) return 'es';
    if (lang.startsWith('de')) return 'de';
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
const pricingSection = document.getElementById('pricing');

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

document.querySelectorAll('.step-card, .testimonial-card, .pricing-card, .section-header, .search-box, .cta-box, .faq-item').forEach(el => {
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

    // Update selected track display
    const artEl = document.getElementById('selectedTrackArt');
    const titleEl = document.getElementById('selectedTrackTitle');
    const artistEl = document.getElementById('selectedTrackArtist');

    artEl.innerHTML = artwork
        ? `<img src="${escapeHtml(artwork)}" alt="${escapeHtml(title)}" style="width:100%;height:100%;object-fit:cover;">`
        : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.3);font-size:24px"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></div>';
    titleEl.textContent = title;
    artistEl.textContent = artist;

    // Show pricing section
    pricingSection.style.display = 'block';

    // Scroll to pricing
    setTimeout(() => {
        pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    // Clear search results
    searchResults.innerHTML = '';
}

function changeTrack() {
    selectedTrack = null;
    currentSearchQuery = '';
    pricingSection.style.display = 'none';
    document.getElementById('search').scrollIntoView({ behavior: 'smooth' });
    searchInput.focus();
}

// ===== Pack Selection =====
function selectPack(cardEl, copies) {
    if (!selectedTrack) {
        document.getElementById('search').scrollIntoView({ behavior: 'smooth' });
        searchInput.focus();
        return;
    }

    // Visual feedback
    document.querySelectorAll('.pricing-card').forEach(c => c.classList.remove('selected'));
    cardEl.classList.add('selected');

    // Redirect to Stripe after short delay
    setTimeout(() => {
        window.open(STRIPE_PAYMENT_LINK, '_blank');
    }, 300);
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
