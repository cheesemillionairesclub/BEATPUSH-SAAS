// ===== Configuration =====
const SEARCH_API_BASE = 'http://185.209.228.153:8080/search';
const SEARCH_API_PROXY = '/api/search';
const STRIPE_LINKS = {
    50: 'https://buy.stripe.com/dRm9AU2m4aBG2eU2362VG01',
    100: 'https://buy.stripe.com/8x2eVe3q8dNS7zegY02VG02',
    200: 'https://buy.stripe.com/eVq6oIe4Mh04g5K4be2VG03',
    500: 'https://buy.stripe.com/00wdRa6Ckh04aLq5fi2VG04',
    1000: 'https://buy.stripe.com/7sY00k0dWh041aQdLO2VG05',
    'daily-push': 'https://buy.stripe.com/9B66oIbWEcJOdXC9vy2VG07'
};

// ===== Top 100 Genre-based Pricing (No Exclusive status, in €) =====
const TOP100_GENRE_PRICES = {
    '140 / deep dubstep / grime': 580,
    'afro house': 980,
    'amapiano': 580,
    'ambient / experimental': 480,
    'bass / club': 580,
    'bass house': 770,
    'brazilian funk': 580,
    'breaks / breakbeat / uk bass': 580,
    'dance / electro pop': 780,
    'deep house': 770,
    'dj tools': 580,
    'downtempo': 544,
    'drum & bass': 770,
    'dubstep': 780,
    'electro (classic / detroit / modern)': 430,
    'electronica': 580,
    'funky house': 444,
    'hard dance / hardcore': 477,
    'hard techno': 387,
    'house': 1700,
    'indie dance': 990,
    'jackin house': 570,
    'mainstage': 1070,
    'melodic house & techno': 1310,
    'minimal / deep tech': 830,
    'nu disco / disco': 780,
    'organic house / downtempo': 680,
    'progressive house': 632,
    'psy-trance': 780,
    'tech house': 1870,
    'techno (peak time / driving)': 1870,
    'techno (raw / deep / hypnotic)': 2370,
    'trance (main floor)': 1870,
    'trance (raw / deep / hypnotic)': 1870,
    'trap / wave': 880,
    'uk garage / bassline': 880,
    'new african': 430,
    'new caribbean': 430,
    'new hip-hop': 430,
    'new latin': 430,
    'new pop': 430,
    'new r&b': 430,
};

function getTop100Price(genre) {
    if (!genre) return null;
    const g = genre.toLowerCase().trim();
    // Exact match first
    if (TOP100_GENRE_PRICES[g] !== undefined) return TOP100_GENRE_PRICES[g];
    // Partial match: check if genre contains or is contained in a key
    for (const key in TOP100_GENRE_PRICES) {
        if (g.includes(key) || key.includes(g)) return TOP100_GENRE_PRICES[key];
    }
    return null;
}

function updateTop10Price(genre) {
    const el = document.getElementById('top10-price');
    const genreTag = document.getElementById('top10-genre');
    if (!el) return;
    if (genre) {
        el.textContent = '€920';
        el.classList.remove('genre-pending');
        if (genreTag) {
            genreTag.textContent = genre;
            genreTag.style.display = '';
        }
    } else {
        el.textContent = 'Depends on genre';
        el.classList.add('genre-pending');
        if (genreTag) {
            genreTag.textContent = '';
            genreTag.style.display = 'none';
        }
    }
}

function updateTop100Price(genre) {
    const el = document.getElementById('top100-price');
    const genreTag = document.getElementById('top100-genre');
    if (!el) return;
    const price = getTop100Price(genre);
    if (price !== null) {
        el.textContent = '€' + price.toLocaleString();
        el.classList.remove('genre-pending');
        if (genreTag) {
            genreTag.textContent = genre;
            genreTag.style.display = '';
        }
    } else {
        el.textContent = 'Depends on genre';
        el.classList.add('genre-pending');
        if (genreTag) {
            genreTag.textContent = '';
            genreTag.style.display = 'none';
        }
    }
}

// ===== i18n - Full Translations =====
const translations = {
    en: {
        page_title: 'Beatpush - Beatport promotion for DJs, producers and labels',
        page_desc: 'Boost your tracks on Beatport with BeatPush. Professional promotion for DJs, producers and labels.',
        nav_how: 'HOW IT WORKS',
        nav_pricing: 'PRICING',
        nav_cta: 'BOOST MY TRACK',
        hero_badge: 'Industry-Level Promotion. Real Results.',
        hero_title: 'Professional Beatport promotion for <span class="text-gradient">DJs</span>, <span class="text-gradient">producers</span> and <span class="text-gradient">labels.</span>',
        hero_subtitle: '10+ years of pushing artists up the Beatport charts.',
        hero_cta_btn: 'GET STARTED',
        feature_no_bots: '100% Organic. Real Buyers',
        feature_scheduling: 'Custom Campaign Scheduling',
        feature_strategy: 'Chart Strategy & Insider Guidance',
        feature_guarantee: 'Money-back guarantee',
        search_badge: 'CHOOSE YOUR TRACK',
        search_title: '<span class="text-green">Push</span> your track into Beatport Charts!',
        search_desc: 'Search for your track on Beatport and select it to begin.',
        search_tagline: 'No shortcuts. No automation. Just real strategy.',
        search_placeholder: 'Artist name, Beatport track url',
        search_btn: 'SEARCH',
        search_empty: 'No tracks found on Beatport. Try another search term.',
        pricing_badge: 'PRICING',
        pricing_title: 'Choose Your <span class="text-green">Campaign</span>',
        pricing_desc: 'Our campaigns rely on a large, established global buyer network, trusted by artists and industry professionals worldwide.',
        choose_btn: 'Choose',
        popular_badge: 'POPULAR',
        change_track: 'Change',
        campaign_badge: 'LET\'S GET INTO DETAILS',
        campaign_title: 'Campaign Setup',
        campaign_desc: 'Configure your campaign before launching.',
        campaign_genre_label: 'Genre',
        campaign_genre_hint: 'Confirm the genre detected for your track.',
        campaign_genre_hint_manual: 'Please type your genre below.',
        campaign_genre_input_placeholder: 'Type your genre (e.g. Afro House, Melodic Techno...)',
        campaign_confirm: 'Confirm',
        campaign_confirmed: 'Confirmed',
        campaign_artists_label: 'Similar Artists',
        campaign_artists_hint: 'Enter 3 artists with a similar style to your track \u2014 this helps us target the right DJs, playlists, and audiences already engaging with this sound.',
        campaign_artists_placeholder: 'Example: Adam Port, Black Coffee, Keinemusik',
        campaign_release_label: 'Release Status',
        campaign_release_hint: 'Is your track already released or in pre-order?',
        campaign_released: 'Already Released',
        campaign_preorder: 'Pre-Order',
        campaign_launch_btn: 'Run my campaign',
        payment_success: 'Payment confirmed!',
        payment_success_sub: 'Your campaign is being set up. You will receive a confirmation email shortly.\nYou will also receive a detailed receipt of all purchases made within 24/48 Hours.',
        payment_success_whatsapp_text: "If you'd like to discuss your track, ask a question, or simply stay updated about your campaign, feel free to reach out.",
        payment_success_whatsapp_btn: 'Chat with us',
        campaign_tips_title: 'Tips / Requirements',
        card_tooltip_title: 'Tips & Requirements',
        campaign_tip_1: 'Tracks must be new, to perform well.',
        campaign_tip_2: 'The artist/label should have a store presence, to perform well.',
        campaign_tip_5: 'Beatport Hype: We suggest subscribing to Beatport Hype and completing your Beatport Artist profile with a picture and bio.',
        campaign_tip_6: 'Chart Climbing: Climbing charts is not just about numbers; it\'s also about the quality of the music.',
        campaign_tip_7: 'Variable Promotion Periods: Every period is different, depending on the skill of the artist/label.',
        campaign_tip_8: 'Challenges at the Top: The closer you get to the top, the more challenging it becomes to move up.',
        dailypush_tip_1: 'Once you get in the chart, to keep the position, to continue and climb, you can purchase a discounted DAILY PUSH.',
        dailypush_tip_2: 'This consists in 10 daily purchases of your track, from DJ\'s all around the world and fitting with your genre.',
        dailypush_tip_3: 'Challenges at the Top: The closer you get to the top, the more challenging it becomes to move up.',
        top100_tooltip_title: 'To ensure an effective promotion, the track(s) must meet the following criteria:',
        top100_tip_1: 'The track must be brand new (ideally in pre-order stage).',
        top100_tip_2: 'The release must be no older than 24 hours at the time the campaign begins.',
        top100_tip_3: 'The track must never have been charted before.',
        top100_tip_4: 'The artist or label should have at least 7 previous releases on Beatport.',
        top100_tip_5: 'The artist or label must have reached the Top 100 of the selected genre at least twice within the last 6 months.',
        top100_tip_6: 'The track must appear in Beatport Hype Picks for the genre.',
        top100_tip_7: 'Campaigns cannot start on Sundays or Mondays.',
        top10_tooltip_title: 'To qualify for this promotion, tracks must meet the following criteria:',
        top10_tip_1: 'Released within the last six days.',
        top10_tip_2: 'Not currently in a downward trend.',
        top10_tip_3: 'Current minimum position number 20.',
        top10_tip_4: 'Must be the track\'s first time appearing on the chart.',
        top10_tip_footer_1: 'If your track does not yet meet these requirements, you can begin with our',
        top10_tip_footer_daily_push: 'Daily Push Promotion',
        top10_tip_footer_2: 'designed to help tracks gain momentum and climb the charts.',
        top10_tip_footer_3: 'After reaching approximately position #20, you will be able to access and benefit from this exclusive promotion package.',
        campaign_validate_genre: 'Please confirm the genre of your track before launching.',
        campaign_validate_artists: 'Please enter at least 1 similar artist.',
        choose_validate_track: 'Please select a track first before choosing a campaign.',
        campaign_summary_track: 'Track',
        campaign_summary_pack: 'Package',
        campaign_summary_copies: 'copies',
        how_badge: 'OUR PROCESS',
        how_title: 'How Beatpush Promotion <span class="text-gradient">Works</span>',
        how_step1_title: 'Submit Your Beatport Track',
        how_step1_desc: 'Find & select your Beatport track using our search bar.',
        how_step1_detail: 'Our algorithm analyzes the track and confirms the campaign feasibility.',
        how_step2_title: 'Campaign Strategy Setup',
        how_step2_desc: 'We plan the promotion based on:',
        how_step2_li1: 'Genre competition',
        how_step2_li2: 'Release timing',
        how_step2_li3: 'Beatport chart dynamics',
        how_step2_li4: 'Release visibility potential',
        how_step2_detail: 'Each campaign is structured to maximize momentum during the key release window.',
        how_step3_title: 'Campaign Launch',
        how_step3_desc: 'Your promotion campaign begins.',
        how_step3_bullet1: 'Beatpush connects your music with a private network of DJs, producers, and passionate electronic music collectors built over 10+ years in the industry.',
        how_step3_bullet2: 'Our team monitors the campaign daily and tracks the chart activity and visibility of the release.',
        how_step4_title: 'Chart Monitoring',
        how_step4_desc: 'During the promotion, we monitor:',
        how_step4_li1: 'Chart movements',
        how_step4_li2: 'Visibility growth',
        how_step4_li3: 'Campaign performance',
        how_step4_detail: 'Clients receive updates on the campaign progress.',
        how_step5_title: 'Receipts Provided',
        how_step5_desc: 'You will receive receipts for all your downloaded tracks.',
        why_badge: 'WHY BEATPUSH',
        why_title: 'Why Choose BeatPush to Promote Your Music',
        why_subtitle: 'Build consistent growth',
        why_card1_title: 'Real Beatport Promotion',
        why_card1_text: 'All purchases comply with Beatport\'s platform mechanics and are made through legitimate customer accounts.',
        why_card2_title: 'True & Measurable Impact',
        why_card2_text: 'Every promotion is structured to create tangible chart movement. Our team understands how Beatport charts behave and deploys campaigns in a precise and strategic way to maximize impact.',
        why_card3_title: '100% Organic. Real Buyers',
        why_card3_text: 'Every purchase is 100% organic, made through real Beatport accounts, with full traceability and verified receipts.\n\nAll purchases comply with Beatport\'s platform mechanics and are made through legitimate customer accounts.',
        faq_title: 'Frequently asked questions',
        faq0a_q: 'What happens after I order?',
        faq0a_a: 'Once your order is placed, you will immediately receive an order confirmation email with the final steps to validate your campaign.<br>The process is fast, simple and fully handled by our team.<br><br><strong>Here\'s what happens next:</strong><br><br>1. <strong>Track verification</strong> — Our team reviews your track and confirms the Beatport release link to ensure everything is ready for the campaign.<br>2. <strong>Campaign scheduling</strong> — We schedule your promotion according to the selected package to maximize chart impact.<br>3. <strong>Real Beatport purchases</strong> — Our network begins purchasing your track on Beatport following our strategic campaign process.<br>4. <strong>Chart positioning</strong> — As purchases accumulate, your track can start climbing the Beatport charts depending on the package and category.<br>5. <strong>Completion notification</strong> — Once the campaign is completed, you will receive a confirmation email.<br><br>That\'s it. Sit back and watch your track gain visibility and chart momentum on Beatport.',
        faq0b_q: 'What\'s the refund policy?',
        faq0b_a: 'We work hard to ensure every campaign runs smoothly and delivers the expected promotion.<br><br>If your campaign cannot be executed or the purchases cannot be delivered within the announced timeframe, you may request:<br>• A full refund, or<br>• A replacement campaign<br><br>Simply contact our support team at any time if you have questions or concerns.<br><br>Our goal is always to provide a transparent, reliable and professional promotion service.',
        faq1_q: 'How long does a campaign take?',
        faq1_a: 'Most promotions are delivered within 2\u201310 days, depending on genre competition and chart activity.',
        faq2_q: 'Do you use bots?',
        faq2_a: 'No. Beatpush campaigns rely on real promotion strategies and industry experience.',
        faq3_q: 'Can new artists use the service?',
        faq3_a: 'Yes. We work with independent artists, labels and distributors.',
        faq4_q: 'Do exclusive releases perform better?',
        faq4_a: 'In most cases yes, because all activity is concentrated on a single platform, increasing chart visibility.',
        faq5_q: 'Any tips/requirement?',
        cta_title: 'Ready to dominate the charts?',
        cta_desc: 'Join hundreds of artists using BeatPush to boost their career.',
        cta_btn: 'GET STARTED NOW',
        footer_desc: 'The #1 music promotion platform on Beatport.',
        footer_nav: 'Navigation',
        footer_boost: 'Boost my track',
        footer_how: 'How it works',
        footer_copy: '&copy; 2026 BeatPush. All rights reserved.',
        footer_disclaimer: 'Beatpush is an independent promotional service. Beatpush is not affiliated with Beatport.',
        footer_terms: 'Terms of Use',
    },
    fr: {
        page_title: 'Beatpush - Promotion Beatport pour DJs, producteurs et labels',
        page_desc: 'Boostez vos tracks sur Beatport avec BeatPush. Promotion professionnelle pour DJs, producteurs et labels.',
        nav_how: 'COMMENT CA MARCHE',
        nav_pricing: 'TARIFS',
        nav_cta: 'BOOSTER MA TRACK',
        hero_badge: 'Promotion de niveau professionnel. Des résultats concrets.',
        hero_title: 'Promotion Beatport professionnelle pour <span class="text-gradient">DJs</span>, <span class="text-gradient">producteurs</span> et <span class="text-gradient">labels.</span>',
        hero_subtitle: '10+ ans \u00e0 propulser les artistes dans les charts Beatport.',
        hero_cta_btn: 'COMMENCER',
        feature_no_bots: '100% Organique & Sans Bots',
        feature_scheduling: 'Planification de campagne personnalis\u00e9e',
        feature_strategy: 'Strat\u00e9gie de charts & conseils d\'initi\u00e9s',
        feature_guarantee: 'Garantie satisfait ou rembours\u00e9',
        search_badge: 'CHOISISSEZ VOTRE TRACK',
        search_title: '<span class="text-green">Propulsez</span> votre track dans les Charts Beatport !',
        search_desc: 'Recherchez votre morceau sur Beatport et s\u00e9lectionnez-le pour commencer.',
        search_tagline: 'Pas de raccourcis. Pas d\'automatisation. Juste de la vraie strat\u00e9gie.',
        search_placeholder: 'Nom d\'artiste, URL de track Beatport',
        search_btn: 'RECHERCHER',
        search_empty: 'Aucun titre trouv\u00e9 sur Beatport. Essayez un autre terme.',
        pricing_badge: 'TARIFS',
        pricing_title: 'Choisissez Votre <span class="text-green">Campagne</span>',
        pricing_desc: 'Nos campagnes s\'appuient sur un large réseau mondial d\'acheteurs établi, reconnu par les artistes et les professionnels de l\'industrie.',
        choose_btn: 'Choisir',
        popular_badge: 'POPULAIRE',
        change_track: 'Changer',
        campaign_badge: 'ENTRONS DANS LES D\u00c9TAILS',
        campaign_title: 'Param\u00e9trage de la campagne',
        campaign_desc: 'Configurez votre campagne avant de la lancer.',
        campaign_genre_label: 'Genre',
        campaign_genre_hint: 'Confirmez le genre d\u00e9tect\u00e9 pour votre track.',
        campaign_genre_hint_manual: 'Veuillez taper votre genre ci-dessous.',
        campaign_genre_input_placeholder: 'Tapez votre genre (ex: Afro House, Melodic Techno...)',
        campaign_confirm: 'Confirmer',
        campaign_confirmed: 'Confirm\u00e9',
        campaign_artists_label: 'Artistes similaires',
        campaign_artists_hint: 'Entrez 3 artistes au style similaire \u00e0 votre track \u2014 cela nous aide \u00e0 cibler les bons DJs, playlists et audiences qui s\u2019int\u00e9ressent d\u00e9j\u00e0 \u00e0 ce son.',
        campaign_artists_placeholder: 'Exemple : Adam Port, Black Coffee, Keinemusik',
        campaign_release_label: 'Statut de la sortie',
        campaign_release_hint: 'Votre track est-elle d\u00e9j\u00e0 sortie ou en pr\u00e9-commande ?',
        campaign_released: 'D\u00e9j\u00e0 sortie',
        campaign_preorder: 'Pr\u00e9-commande',
        campaign_launch_btn: 'Lancer ma campagne',
        payment_success: 'Paiement confirm\u00e9 !',
        payment_success_sub: 'Votre campagne est en cours de mise en place. Vous recevrez un email de confirmation sous peu.\nVous recevrez \u00e9galement un re\u00e7u d\u00e9taill\u00e9 de tous les achats effectu\u00e9s sous 24/48H.',
        payment_success_whatsapp_text: "Si vous souhaitez discuter de votre track, poser une question ou simplement rester informé de votre campagne, n'hésitez pas à nous contacter.",
        payment_success_whatsapp_btn: 'Discuter avec nous',
        campaign_tips_title: 'Conseils / Pr\u00e9requis',
        card_tooltip_title: 'Conseils & Pr\u00e9requis',
        campaign_tip_1: 'Les tracks doivent \u00eatre r\u00e9centes.',
        campaign_tip_2: 'L\'artiste/label doit avoir une pr\u00e9sence en store.',
        campaign_tip_5: 'Beatport Hype : Nous sugg\u00e9rons de s\'abonner \u00e0 Beatport Hype et de compl\u00e9ter votre profil artiste Beatport avec une photo et une bio.',
        campaign_tip_6: 'Progression dans les charts : Grimper dans les charts n\'est pas seulement une question de chiffres, c\'est aussi la qualit\u00e9 de la musique.',
        campaign_tip_7: 'P\u00e9riodes de promotion variables : Chaque p\u00e9riode est diff\u00e9rente, selon le niveau de l\'artiste/label.',
        campaign_tip_8: 'D\u00e9fis au sommet : Plus vous vous approchez du top, plus il est difficile de progresser.',
        dailypush_tip_1: 'Une fois dans le chart, pour maintenir votre position, continuer et grimper, vous pouvez acheter un DAILY PUSH \u00e0 prix r\u00e9duit.',
        dailypush_tip_2: 'Cela consiste en 10 achats quotidiens de votre track, par des DJ\'s du monde entier et correspondant \u00e0 votre genre.',
        dailypush_tip_3: 'D\u00e9fis au sommet : Plus vous vous approchez du top, plus il est difficile de progresser.',
        top100_tooltip_title: 'Pour garantir une promotion efficace, le(s) track(s) doivent répondre aux critères suivants :',
        top100_tip_1: 'Le track doit être tout nouveau (idéalement en phase de pré-commande).',
        top100_tip_2: 'La sortie ne doit pas dater de plus de 24 heures au moment du lancement de la campagne.',
        top100_tip_3: 'Le track ne doit jamais avoir été classé auparavant.',
        top100_tip_4: 'L\'artiste ou le label doit avoir au moins 7 sorties précédentes sur Beatport.',
        top100_tip_5: 'L\'artiste ou le label doit avoir atteint le Top 100 du genre sélectionné au moins deux fois au cours des 6 derniers mois.',
        top100_tip_6: 'Le track doit apparaître dans les Beatport Hype Picks du genre.',
        top100_tip_7: 'Les campagnes ne peuvent pas commencer le dimanche ou le lundi.',
        top10_tooltip_title: 'Pour être éligible à cette promotion, les tracks doivent répondre aux critères suivants :',
        top10_tip_1: 'Sortie depuis moins de six jours.',
        top10_tip_2: 'Pas actuellement en tendance baissière.',
        top10_tip_3: 'Position minimum actuelle numéro 20.',
        top10_tip_4: 'Doit être la première apparition du track dans le chart.',
        top10_tip_footer_1: 'Si votre track ne remplit pas encore ces conditions, vous pouvez commencer avec notre',
        top10_tip_footer_daily_push: 'Promotion Daily Push',
        top10_tip_footer_2: 'conçue pour aider les tracks à gagner en visibilité et à grimper dans les charts.',
        top10_tip_footer_3: 'Après avoir atteint environ la position #20, vous pourrez accéder à ce pack de promotion exclusif et en bénéficier.',
        campaign_validate_genre: 'Veuillez confirmer le genre de votre track avant de lancer.',
        campaign_validate_artists: 'Veuillez entrer au moins 1 artiste similaire.',
        choose_validate_track: 'Veuillez d\'abord s\u00e9lectionner une track avant de choisir un pack.',
        campaign_summary_track: 'Track',
        campaign_summary_pack: 'Pack',
        campaign_summary_copies: 'copies',
        how_badge: 'NOTRE PROCESSUS',
        how_title: 'Comment la promotion Beatpush <span class="text-gradient">fonctionne</span>',
        how_step1_title: 'Soumettez votre track Beatport',
        how_step1_desc: 'Trouvez et s\u00e9lectionnez votre track Beatport via notre barre de recherche.',
        how_step1_detail: 'Notre algorithme analyse la track et confirme la faisabilit\u00e9 de la campagne.',
        how_step2_title: 'Configuration de la strat\u00e9gie',
        how_step2_desc: 'Nous planifions la promotion en fonction de :',
        how_step2_li1: 'La comp\u00e9tition du genre',
        how_step2_li2: 'Le timing de la sortie',
        how_step2_li3: 'La dynamique des charts Beatport',
        how_step2_li4: 'Le potentiel de visibilit\u00e9',
        how_step2_detail: 'Chaque campagne est structur\u00e9e pour maximiser l\'\u00e9lan pendant la fen\u00eatre cl\u00e9 de sortie.',
        how_step3_title: 'Lancement de la campagne',
        how_step3_desc: 'Votre campagne de promotion commence.',
        how_step3_bullet1: 'Beatpush connecte votre musique à un réseau privé de DJs, producteurs et collectionneurs passionnés de musique électronique, construit en plus de 10 ans dans l\'industrie.',
        how_step3_bullet2: 'Notre équipe surveille la campagne quotidiennement et suit l\'activité des charts et la visibilité de la sortie.',
        how_step4_title: 'Suivi des charts',
        how_step4_desc: 'Pendant la promotion, nous surveillons :',
        how_step4_li1: 'Les mouvements des charts',
        how_step4_li2: 'La croissance de la visibilit\u00e9',
        how_step4_li3: 'Les performances de la campagne',
        how_step4_detail: 'Les clients re\u00e7oivent des mises \u00e0 jour sur la progression de la campagne.',
        how_step5_title: 'Re\u00e7us fournis',
        how_step5_desc: 'Vous recevrez des re\u00e7us pour tous vos morceaux t\u00e9l\u00e9charg\u00e9s.',
        why_badge: 'POURQUOI BEATPUSH',
        why_title: 'Pourquoi choisir BeatPush pour promouvoir votre musique',
        why_subtitle: 'Construisez une croissance constante',
        why_card1_title: 'V\u00e9ritable promotion Beatport',
        why_card1_text: 'Tous les achats respectent les mécanismes de la plateforme Beatport et sont effectués via des comptes clients légitimes.',
        why_card2_title: 'Impact r\u00e9el et mesurable',
        why_card2_text: 'Chaque promotion est structur\u00e9e pour cr\u00e9er un mouvement tangible dans les charts. Notre \u00e9quipe comprend le fonctionnement des charts Beatport et d\u00e9ploie les campagnes de mani\u00e8re pr\u00e9cise et strat\u00e9gique.',
        why_card3_title: '100% organique et sans bots',
        why_card3_text: 'Chaque achat est 100% organique, effectué via de vrais comptes Beatport, avec une traçabilité complète et des reçus vérifiés.\n\nTous les achats respectent les mécaniques de la plateforme Beatport et sont effectués via des comptes clients légitimes.',
        faq_title: 'Questions fr\u00e9quentes',
        faq0a_q: 'Que se passe-t-il apr\u00e8s ma commande ?',
        faq0a_a: 'D\u00e8s que votre commande est pass\u00e9e, vous recevrez imm\u00e9diatement un email de confirmation avec les derni\u00e8res \u00e9tapes pour valider votre campagne.<br>Le processus est rapide, simple et enti\u00e8rement g\u00e9r\u00e9 par notre \u00e9quipe.<br><br><strong>Voici ce qui se passe ensuite :</strong><br><br>1. <strong>V\u00e9rification du track</strong> — Notre \u00e9quipe examine votre track et confirme le lien de sortie Beatport pour s\'assurer que tout est pr\u00eat pour la campagne.<br>2. <strong>Planification de la campagne</strong> — Nous planifions votre promotion selon le package s\u00e9lectionn\u00e9 pour maximiser l\'impact dans les charts.<br>3. <strong>Vrais achats Beatport</strong> — Notre r\u00e9seau commence \u00e0 acheter votre track sur Beatport selon notre processus strat\u00e9gique de campagne.<br>4. <strong>Positionnement dans les charts</strong> — Au fur et \u00e0 mesure que les achats s\'accumulent, votre track peut commencer \u00e0 monter dans les charts Beatport selon le package et la cat\u00e9gorie.<br>5. <strong>Notification de fin</strong> — Une fois la campagne termin\u00e9e, vous recevrez un email de confirmation.<br><br>C\'est tout. Installez-vous et regardez votre track gagner en visibilit\u00e9 et en dynamique dans les charts Beatport.',
        faq0b_q: 'Quelle est la politique de remboursement ?',
        faq0b_a: 'Nous travaillons dur pour garantir que chaque campagne se d\u00e9roule sans probl\u00e8me et offre la promotion attendue.<br><br>Si votre campagne ne peut pas \u00eatre ex\u00e9cut\u00e9e ou si les achats ne peuvent pas \u00eatre livr\u00e9s dans le d\u00e9lai annonc\u00e9, vous pouvez demander :<br>\u2022 Un remboursement complet, ou<br>\u2022 Une campagne de remplacement<br><br>Contactez simplement notre \u00e9quipe support \u00e0 tout moment si vous avez des questions ou des pr\u00e9occupations.<br><br>Notre objectif est toujours de fournir un service de promotion transparent, fiable et professionnel.',
        faq1_q: 'Combien de temps dure une campagne ?',
        faq1_a: 'La plupart des promotions sont livr\u00e9es en 2 \u00e0 10 jours, selon la comp\u00e9tition du genre et l\'activit\u00e9 dans les charts.',
        faq2_q: 'Utilisez-vous des bots ?',
        faq2_a: 'Non. Les campagnes Beatpush reposent sur de vraies strat\u00e9gies de promotion et une exp\u00e9rience dans l\'industrie.',
        faq3_q: 'Les nouveaux artistes peuvent-ils utiliser le service ?',
        faq3_a: 'Oui. Nous travaillons avec des artistes ind\u00e9pendants, des labels et des distributeurs.',
        faq4_q: 'Les sorties exclusives ont-elles de meilleurs r\u00e9sultats ?',
        faq4_a: 'Dans la plupart des cas oui, car toute l\'activit\u00e9 est concentr\u00e9e sur une seule plateforme, augmentant la visibilit\u00e9 dans les charts.',
        faq5_q: 'Des conseils / pr\u00e9requis ?',
        cta_title: 'Pr\u00eat \u00e0 dominer les charts ?',
        cta_desc: 'Rejoignez des centaines d\'artistes qui utilisent BeatPush pour booster leur carri\u00e8re.',
        cta_btn: 'COMMENCER MAINTENANT',
        footer_desc: 'La plateforme #1 de promotion musicale sur Beatport.',
        footer_nav: 'Navigation',
        footer_boost: 'Booster ma track',
        footer_how: 'Comment \u00e7a marche',
        footer_copy: '&copy; 2026 BeatPush. Tous droits r\u00e9serv\u00e9s.',
        footer_disclaimer: 'Beatpush est un service promotionnel indépendant. Beatpush n\'est pas affilié à Beatport.',
        footer_terms: 'Conditions d\'utilisation',
    },
    pt: {
        page_title: 'Beatpush - Promoção Beatport para DJs, produtores e gravadoras',
        page_desc: 'Impulsione suas tracks no Beatport com o BeatPush. Promo\u00e7\u00e3o profissional para DJs, produtores e labels.',
        nav_how: 'COMO FUNCIONA',
        nav_pricing: 'PRE\u00c7OS',
        nav_cta: 'IMPULSIONAR MINHA TRACK',
        hero_badge: 'Promo\u00e7\u00e3o de n\u00edvel profissional. Resultados reais.',
        hero_title: 'Promo\u00e7\u00e3o profissional no Beatport para <span class="text-gradient">DJs</span>, <span class="text-gradient">produtores</span> e <span class="text-gradient">labels.</span>',
        hero_subtitle: '10+ anos impulsionando artistas nos charts do Beatport.',
        hero_cta_btn: 'COME\u00c7AR',
        feature_no_bots: '100% Orgânico & Sem Bots',
        feature_scheduling: 'Agendamento de campanha personalizado',
        feature_strategy: 'Estrat\u00e9gia de charts e orienta\u00e7\u00e3o privilegiada',
        feature_guarantee: 'Garantia de devolu\u00e7\u00e3o',
        search_badge: 'ESCOLHA SUA TRACK',
        search_title: '<span class="text-green">Impulsione</span> sua track nos Charts da Beatport!',
        search_desc: 'Pesquise sua m\u00fasica no Beatport e selecione para come\u00e7ar.',
        search_tagline: 'Sem atalhos. Sem automa\u00e7\u00e3o. Apenas estrat\u00e9gia real.',
        search_placeholder: 'Nome do artista, URL da track no Beatport',
        search_btn: 'PESQUISAR',
        search_empty: 'Nenhuma track encontrada no Beatport. Tente outro termo.',
        pricing_badge: 'PRE\u00c7OS',
        pricing_title: 'Escolha Sua <span class="text-green">Campanha</span>',
        pricing_desc: 'Nossas campanhas contam com uma grande rede global de compradores estabelecida, confiada por artistas e profissionais da indústria em todo o mundo.',
        choose_btn: 'Escolher',
        popular_badge: 'POPULAR',
        change_track: 'Alterar',
        campaign_badge: 'VAMOS AOS DETALHES',
        campaign_title: 'Configura\u00e7\u00e3o da campanha',
        campaign_desc: 'Configure sua campanha antes de lan\u00e7ar.',
        campaign_genre_label: 'G\u00eanero',
        campaign_genre_hint: 'Confirme o g\u00eanero detectado para sua track.',
        campaign_genre_hint_manual: 'Por favor, digite seu g\u00eanero abaixo.',
        campaign_genre_input_placeholder: 'Digite seu gu00eanero (ex: Afro House, Melodic Techno...)',
        campaign_confirm: 'Confirmar',
        campaign_confirmed: 'Confirmado',
        campaign_artists_label: 'Artistas similares',
        campaign_artists_hint: 'Insira 3 artistas com estilo similar ao da sua track \u2014 isso nos ajuda a direcionar os DJs, playlists e p\u00fablicos certos que j\u00e1 se envolvem com esse som.',
        campaign_artists_placeholder: 'Exemplo: Adam Port, Black Coffee, Keinemusik',
        campaign_release_label: 'Status do lan\u00e7amento',
        campaign_release_hint: 'Sua track j\u00e1 foi lan\u00e7ada ou est\u00e1 em pr\u00e9-venda?',
        campaign_released: 'J\u00e1 lan\u00e7ada',
        campaign_preorder: 'Pr\u00e9-venda',
        campaign_launch_btn: 'Lan\u00e7ar minha campanha',
        payment_success: 'Pagamento confirmado!',
        payment_success_sub: 'Sua campanha est\u00e1 sendo configurada. Voc\u00ea receber\u00e1 um email de confirma\u00e7\u00e3o em breve.\nVoc\u00ea tamb\u00e9m receber\u00e1 um recibo detalhado de todas as compras realizadas em 24/48H.',
        payment_success_whatsapp_text: 'Se você quiser discutir sua track, fazer uma pergunta ou simplesmente acompanhar sua campanha, fique à vontade para entrar em contato.',
        payment_success_whatsapp_btn: 'Fale conosco',
        campaign_tips_title: 'Dicas / Requisitos',
        card_tooltip_title: 'Dicas & Requisitos',
        campaign_tip_1: 'As tracks devem ser novas.',
        campaign_tip_2: 'O artista/label deve ter presen\u00e7a na loja.',
        campaign_tip_5: 'Beatport Hype: Sugerimos assinar o Beatport Hype e completar seu perfil de artista com foto e bio.',
        campaign_tip_6: 'Subida nos Charts: Subir nos charts n\u00e3o \u00e9 apenas sobre n\u00fameros; \u00e9 tamb\u00e9m sobre a qualidade da m\u00fasica.',
        campaign_tip_7: 'Per\u00edodos de Promo\u00e7\u00e3o Vari\u00e1veis: Cada per\u00edodo \u00e9 diferente, dependendo da habilidade do artista/label.',
        campaign_tip_8: 'Desafios no Topo: Quanto mais perto do topo, mais dif\u00edcil se torna subir.',
        dailypush_tip_1: 'Uma vez no chart, para manter a posi\u00e7\u00e3o, continuar e subir, voc\u00ea pode comprar um DAILY PUSH com desconto.',
        dailypush_tip_2: 'Isso consiste em 10 compras di\u00e1rias da sua track, por DJ\'s de todo o mundo e que correspondem ao seu g\u00eanero.',
        dailypush_tip_3: 'Desafios no Topo: Quanto mais perto do topo, mais dif\u00edcil se torna subir.',
        top100_tooltip_title: 'Para garantir uma promoção eficaz, a(s) track(s) devem atender aos seguintes critérios:',
        top100_tip_1: 'A track deve ser totalmente nova (idealmente em fase de pré-venda).',
        top100_tip_2: 'O lançamento não deve ter mais de 24 horas no momento do início da campanha.',
        top100_tip_3: 'A track nunca deve ter sido classificada anteriormente.',
        top100_tip_4: 'O artista ou label deve ter pelo menos 7 lançamentos anteriores no Beatport.',
        top100_tip_5: 'O artista ou label deve ter alcançado o Top 100 do gênero selecionado pelo menos duas vezes nos últimos 6 meses.',
        top100_tip_6: 'A track deve aparecer nos Beatport Hype Picks do gênero.',
        top100_tip_7: 'As campanhas não podem começar aos domingos ou segundas-feiras.',
        top10_tooltip_title: 'Para se qualificar para esta promoção, as tracks devem atender aos seguintes critérios:',
        top10_tip_1: 'Lançado nos últimos seis dias.',
        top10_tip_2: 'Não estar em tendência de queda.',
        top10_tip_3: 'Posição mínima atual número 20.',
        top10_tip_4: 'Deve ser a primeira vez que a track aparece no chart.',
        top10_tip_footer_1: 'Se a sua track ainda não atende a esses requisitos, você pode começar com a nossa',
        top10_tip_footer_daily_push: 'Promoção Daily Push',
        top10_tip_footer_2: 'projetada para ajudar as tracks a ganhar impulso e subir nos charts.',
        top10_tip_footer_3: 'Após atingir aproximadamente a posição #20, você poderá acessar e se beneficiar deste pacote de promoção exclusivo.',
        campaign_validate_genre: 'Por favor, confirme o gênero da sua track antes de lançar.',
        campaign_validate_artists: 'Por favor, insira pelo menos 1 artista similar.',
        choose_validate_track: 'Por favor, selecione uma track antes de escolher um pacote.',
        campaign_summary_track: 'Track',
        campaign_summary_pack: 'Pacote',
        campaign_summary_copies: 'c\u00f3pias',
        how_badge: 'NOSSO PROCESSO',
        how_title: 'Como a promo\u00e7\u00e3o Beatpush <span class="text-gradient">funciona</span>',
        how_step1_title: 'Envie sua track do Beatport',
        how_step1_desc: 'Encontre e selecione sua track do Beatport usando nossa barra de pesquisa.',
        how_step1_detail: 'Nosso algoritmo analisa a track e confirma a viabilidade da campanha.',
        how_step2_title: 'Configura\u00e7\u00e3o da estrat\u00e9gia',
        how_step2_desc: 'Planejamos a promo\u00e7\u00e3o com base em:',
        how_step2_li1: 'Competi\u00e7\u00e3o do g\u00eanero',
        how_step2_li2: 'Timing do lan\u00e7amento',
        how_step2_li3: 'Din\u00e2mica dos charts Beatport',
        how_step2_li4: 'Potencial de visibilidade',
        how_step2_detail: 'Cada campanha \u00e9 estruturada para maximizar o impulso durante a janela chave de lan\u00e7amento.',
        how_step3_title: 'Lan\u00e7amento da campanha',
        how_step3_desc: 'Sua campanha de promo\u00e7\u00e3o come\u00e7a.',
        how_step3_bullet1: 'Beatpush conecta sua música a uma rede privada de DJs, produtores e colecionadores apaixonados por música eletrônica, construída ao longo de mais de 10 anos na indústria.',
        how_step3_bullet2: 'Nossa equipe monitora a campanha diariamente e acompanha a atividade dos charts.',
        how_step4_title: 'Monitoramento dos charts',
        how_step4_desc: 'Durante a promo\u00e7\u00e3o, monitoramos:',
        how_step4_li1: 'Movimentos dos charts',
        how_step4_li2: 'Crescimento da visibilidade',
        how_step4_li3: 'Desempenho da campanha',
        how_step4_detail: 'Os clientes recebem atualiza\u00e7\u00f5es sobre o progresso da campanha.',
        how_step5_title: 'Recibos fornecidos',
        how_step5_desc: 'Voc\u00ea receber\u00e1 recibos de todas as suas faixas baixadas.',
        why_badge: 'POR QUE BEATPUSH',
        why_title: 'Por que escolher o BeatPush para promover sua m\u00fasica',
        why_subtitle: 'Construa um crescimento consistente',
        why_card1_title: 'Promo\u00e7\u00e3o real no Beatport',
        why_card1_text: 'Todas as compras estão em conformidade com os mecanismos da plataforma Beatport e são feitas através de contas legítimas de clientes.',
        why_card2_title: 'Impacto real e mensur\u00e1vel',
        why_card2_text: 'Cada promo\u00e7\u00e3o \u00e9 estruturada para criar movimento tang\u00edvel nos charts. Nossa equipe entende como os charts Beatport funcionam e implanta campanhas de forma precisa e estrat\u00e9gica.',
        why_card3_title: '100% org\u00e2nico e sem bots',
        why_card3_text: 'Cada compra é 100% orgânica, feita através de contas reais do Beatport, com total rastreabilidade e recibos verificados.\n\nTodas as compras estão em conformidade com as mecânicas da plataforma Beatport e são feitas através de contas legítimas de clientes.',
        faq_title: 'Perguntas frequentes',
        faq0a_q: 'O que acontece depois que eu fa\u00e7o o pedido?',
        faq0a_a: 'Assim que seu pedido for feito, voc\u00ea receber\u00e1 imediatamente um email de confirma\u00e7\u00e3o com os \u00faltimos passos para validar sua campanha.<br>O processo \u00e9 r\u00e1pido, simples e totalmente gerenciado pela nossa equipe.<br><br><strong>Veja o que acontece a seguir:</strong><br><br>1. <strong>Verifica\u00e7\u00e3o do track</strong> — Nossa equipe analisa seu track e confirma o link de lan\u00e7amento no Beatport.<br>2. <strong>Agendamento da campanha</strong> — Agendamos sua promo\u00e7\u00e3o de acordo com o pacote selecionado.<br>3. <strong>Compras reais no Beatport</strong> — Nossa rede come\u00e7a a comprar seu track no Beatport seguindo nosso processo estrat\u00e9gico.<br>4. <strong>Posicionamento nos charts</strong> — Conforme as compras se acumulam, seu track pode come\u00e7ar a subir nos charts do Beatport.<br>5. <strong>Notifica\u00e7\u00e3o de conclus\u00e3o</strong> — Quando a campanha for conclu\u00edda, voc\u00ea receber\u00e1 um email de confirma\u00e7\u00e3o.<br><br>S\u00f3 isso. Relaxe e veja seu track ganhar visibilidade e impulso nos charts do Beatport.',
        faq0b_q: 'Qual \u00e9 a pol\u00edtica de reembolso?',
        faq0b_a: 'Trabalhamos duro para garantir que cada campanha funcione sem problemas.<br><br>Se sua campanha n\u00e3o puder ser executada ou as compras n\u00e3o puderem ser entregues no prazo anunciado, voc\u00ea pode solicitar:<br>\u2022 Um reembolso total, ou<br>\u2022 Uma campanha substituta<br><br>Entre em contato com nossa equipe de suporte a qualquer momento.<br><br>Nosso objetivo \u00e9 sempre fornecer um servi\u00e7o de promo\u00e7\u00e3o transparente, confi\u00e1vel e profissional.',
        faq1_q: 'Quanto tempo dura uma campanha?',
        faq1_a: 'A maioria das promo\u00e7\u00f5es \u00e9 entregue em 2 a 10 dias, dependendo da competi\u00e7\u00e3o do g\u00eanero.',
        faq2_q: 'Voc\u00eas usam bots?',
        faq2_a: 'N\u00e3o. As campanhas Beatpush dependem de estrat\u00e9gias reais de promo\u00e7\u00e3o.',
        faq3_q: 'Novos artistas podem usar o servi\u00e7o?',
        faq3_a: 'Sim. Trabalhamos com artistas independentes, labels e distribuidores.',
        faq4_q: 'Lan\u00e7amentos exclusivos t\u00eam melhor desempenho?',
        faq4_a: 'Na maioria dos casos sim, porque toda a atividade \u00e9 concentrada em uma \u00fanica plataforma.',
        faq5_q: 'Alguma dica / requisito?',
        cta_title: 'Pronto para dominar os charts?',
        cta_desc: 'Junte-se a centenas de artistas que usam o BeatPush para impulsionar sua carreira.',
        cta_btn: 'COME\u00c7AR AGORA',
        footer_desc: 'A plataforma #1 de promo\u00e7\u00e3o musical no Beatport.',
        footer_nav: 'Navega\u00e7\u00e3o',
        footer_boost: 'Impulsionar minha track',
        footer_how: 'Como funciona',
        footer_copy: '&copy; 2026 BeatPush. Todos os direitos reservados.',
        footer_disclaimer: 'Beatpush é um serviço promocional independente. Beatpush não é afiliado ao Beatport.',
        footer_terms: 'Termos de Uso',
    },
    es: {
        page_title: 'Beatpush - Promoción Beatport para DJs, productores y sellos',
        page_desc: 'Impulsa tus tracks en Beatport con BeatPush. Promoci\u00f3n profesional para DJs, productores y sellos.',
        nav_how: 'C\u00d3MO FUNCIONA',
        nav_pricing: 'PRECIOS',
        nav_cta: 'IMPULSAR MI TRACK',
        hero_badge: 'Promoci\u00f3n de nivel profesional. Resultados reales.',
        hero_title: 'Promoci\u00f3n profesional en Beatport para <span class="text-gradient">DJs</span>, <span class="text-gradient">productores</span> y <span class="text-gradient">sellos.</span>',
        hero_subtitle: '10+ a\u00f1os impulsando artistas en los charts de Beatport.',
        hero_cta_btn: 'EMPEZAR',
        feature_no_bots: '100% Orgánico & Sin Bots',
        feature_scheduling: 'Programaci\u00f3n de campa\u00f1a personalizada',
        feature_strategy: 'Estrategia de charts y gu\u00eda privilegiada',
        feature_guarantee: 'Garant\u00eda de devoluci\u00f3n',
        search_badge: 'ELIGE TU TRACK',
        search_title: '¡<span class="text-green">Impulsa</span> tu track en los Charts de Beatport!',
        search_desc: 'Busca tu track en Beatport y selecci\u00f3nala para comenzar.',
        search_tagline: 'Sin atajos. Sin automatizaci\u00f3n. Solo estrategia real.',
        search_placeholder: 'Nombre del artista, URL de track en Beatport',
        search_btn: 'BUSCAR',
        search_empty: 'No se encontraron tracks en Beatport. Prueba con otro t\u00e9rmino.',
        pricing_badge: 'PRECIOS',
        pricing_title: 'Elige Tu <span class="text-green">Campaña</span>',
        pricing_desc: 'Nuestras campañas se basan en una amplia red global de compradores establecida, confiada por artistas y profesionales de la industria en todo el mundo.',
        choose_btn: 'Elegir',
        popular_badge: 'POPULAR',
        change_track: 'Cambiar',
        campaign_badge: 'ENTREMOS EN DETALLES',
        campaign_title: 'Configuraci\u00f3n de la campa\u00f1a',
        campaign_desc: 'Configura tu campa\u00f1a antes de lanzarla.',
        campaign_genre_label: 'G\u00e9nero',
        campaign_genre_hint: 'Confirma el g\u00e9nero detectado para tu track.',
        campaign_genre_hint_manual: 'Por favor, escribe tu g\u00e9nero a continuaci\u00f3n.',
        campaign_genre_input_placeholder: 'Escribe tu gu00e9nero (ej: Afro House, Melodic Techno...)',
        campaign_confirm: 'Confirmar',
        campaign_confirmed: 'Confirmado',
        campaign_artists_label: 'Artistas similares',
        campaign_artists_hint: 'Ingresa 3 artistas con estilo similar al de tu track \u2014 esto nos ayuda a dirigirnos a los DJs, playlists y audiencias que ya interact\u00faan con este sonido.',
        campaign_artists_placeholder: 'Ejemplo: Adam Port, Black Coffee, Keinemusik',
        campaign_release_label: 'Estado del lanzamiento',
        campaign_release_hint: '\u00bfTu track ya fue lanzada o est\u00e1 en preventa?',
        campaign_released: 'Ya lanzada',
        campaign_preorder: 'Preventa',
        campaign_launch_btn: 'Lanzar mi campa\u00f1a',
        payment_success: '\u00a1Pago confirmado!',
        payment_success_sub: 'Tu campa\u00f1a se est\u00e1 configurando. Recibir\u00e1s un email de confirmaci\u00f3n en breve.\nTambi\u00e9n recibir\u00e1s un recibo detallado de todas las compras realizadas en 24/48H.',
        payment_success_whatsapp_text: 'Si deseas hablar sobre tu track, hacer una pregunta o simplemente mantenerte informado sobre tu campaña, no dudes en contactarnos.',
        payment_success_whatsapp_btn: 'Chatea con nosotros',
        campaign_tips_title: 'Consejos / Requisitos',
        card_tooltip_title: 'Consejos & Requisitos',
        campaign_tip_1: 'Las tracks deben ser nuevas.',
        campaign_tip_2: 'El artista/sello debe tener presencia en la tienda.',
        campaign_tip_5: 'Beatport Hype: Sugerimos suscribirse a Beatport Hype y completar tu perfil de artista con foto y bio.',
        campaign_tip_6: 'Subida en Charts: Subir en los charts no es solo cuesti\u00f3n de n\u00fameros; tambi\u00e9n se trata de la calidad de la m\u00fasica.',
        campaign_tip_7: 'Per\u00edodos de Promoci\u00f3n Variables: Cada per\u00edodo es diferente, dependiendo de la habilidad del artista/sello.',
        campaign_tip_8: 'Desaf\u00edos en la Cima: Cuanto m\u00e1s te acercas al top, m\u00e1s dif\u00edcil es subir.',
        dailypush_tip_1: 'Una vez en el chart, para mantener la posici\u00f3n, continuar y subir, puedes comprar un DAILY PUSH con descuento.',
        dailypush_tip_2: 'Esto consiste en 10 compras diarias de tu track, por DJ\'s de todo el mundo y que encajan con tu g\u00e9nero.',
        dailypush_tip_3: 'Desaf\u00edos en la Cima: Cuanto m\u00e1s te acercas al top, m\u00e1s dif\u00edcil es subir.',
        top100_tooltip_title: 'Para garantizar una promoción eficaz, la(s) track(s) deben cumplir los siguientes criterios:',
        top100_tip_1: 'La track debe ser completamente nueva (idealmente en fase de pre-orden).',
        top100_tip_2: 'El lanzamiento no debe tener más de 24 horas al momento de iniciar la campaña.',
        top100_tip_3: 'La track nunca debe haber estado en un chart anteriormente.',
        top100_tip_4: 'El artista o sello debe tener al menos 7 lanzamientos previos en Beatport.',
        top100_tip_5: 'El artista o sello debe haber alcanzado el Top 100 del género seleccionado al menos dos veces en los últimos 6 meses.',
        top100_tip_6: 'La track debe aparecer en los Beatport Hype Picks del género.',
        top100_tip_7: 'Las campañas no pueden comenzar los domingos ni los lunes.',
        top10_tooltip_title: 'Para calificar para esta promoción, las tracks deben cumplir los siguientes criterios:',
        top10_tip_1: 'Lanzado en los últimos seis días.',
        top10_tip_2: 'No estar actualmente en tendencia bajista.',
        top10_tip_3: 'Posición mínima actual número 20.',
        top10_tip_4: 'Debe ser la primera vez que la track aparece en el chart.',
        top10_tip_footer_1: 'Si tu track aún no cumple con estos requisitos, puedes comenzar con nuestra',
        top10_tip_footer_daily_push: 'Promoción Daily Push',
        top10_tip_footer_2: 'diseñada para ayudar a las tracks a ganar impulso y subir en los charts.',
        top10_tip_footer_3: 'Después de alcanzar aproximadamente la posición #20, podrás acceder y beneficiarte de este paquete de promoción exclusivo.',
        campaign_validate_genre: 'Por favor, confirma el género de tu track antes de lanzar.',
        campaign_validate_artists: 'Por favor, ingresa al menos 1 artista similar.',
        choose_validate_track: 'Por favor, selecciona una track antes de elegir un paquete.',
        campaign_summary_track: 'Track',
        campaign_summary_pack: 'Paquete',
        campaign_summary_copies: 'copias',
        how_badge: 'NUESTRO PROCESO',
        how_title: 'C\u00f3mo funciona la promoci\u00f3n Beatpush <span class="text-gradient">Works</span>',
        how_step1_title: 'Env\u00eda tu track de Beatport',
        how_step1_desc: 'Encuentra y selecciona tu track de Beatport usando nuestra barra de b\u00fasqueda.',
        how_step1_detail: 'Nuestro algoritmo analiza la track y confirma la viabilidad de la campa\u00f1a.',
        how_step2_title: 'Configuraci\u00f3n de la estrategia',
        how_step2_desc: 'Planificamos la promoci\u00f3n bas\u00e1ndonos en:',
        how_step2_li1: 'Competencia del g\u00e9nero',
        how_step2_li2: 'Timing del lanzamiento',
        how_step2_li3: 'Din\u00e1mica de charts Beatport',
        how_step2_li4: 'Potencial de visibilidad',
        how_step2_detail: 'Cada campa\u00f1a se estructura para maximizar el impulso durante la ventana clave de lanzamiento.',
        how_step3_title: 'Lanzamiento de la campa\u00f1a',
        how_step3_desc: 'Tu campa\u00f1a de promoci\u00f3n comienza.',
        how_step3_bullet1: 'Beatpush conecta tu música con una red privada de DJs, productores y coleccionistas apasionados de música electrónica, construida durante más de 10 años en la industria.',
        how_step3_bullet2: 'Nuestro equipo monitorea la campaña diariamente y rastrea la actividad de los charts.',
        how_step4_title: 'Monitoreo de charts',
        how_step4_desc: 'Durante la promoci\u00f3n, monitoreamos:',
        how_step4_li1: 'Movimientos de charts',
        how_step4_li2: 'Crecimiento de visibilidad',
        how_step4_li3: 'Rendimiento de la campa\u00f1a',
        how_step4_detail: 'Los clientes reciben actualizaciones sobre el progreso de la campa\u00f1a.',
        how_step5_title: 'Recibos proporcionados',
        how_step5_desc: 'Recibir\u00e1s recibos de todas tus pistas descargadas.',
        why_badge: 'POR QU\u00c9 BEATPUSH',
        why_title: 'Por qu\u00e9 elegir BeatPush para promover tu m\u00fasica',
        why_subtitle: 'Construye un crecimiento constante',
        why_card1_title: 'Promoci\u00f3n real en Beatport',
        why_card1_text: 'Todas las compras cumplen con los mecanismos de la plataforma Beatport y se realizan a través de cuentas legítimas de clientes.',
        why_card2_title: 'Impacto real y medible',
        why_card2_text: 'Cada promoci\u00f3n est\u00e1 estructurada para crear movimiento tangible en los charts. Nuestro equipo despliega campa\u00f1as de manera precisa y estrat\u00e9gica.',
        why_card3_title: '100% org\u00e1nico y sin bots',
        why_card3_text: 'Cada compra es 100% orgánica, realizada a través de cuentas reales de Beatport, con total trazabilidad y recibos verificados.\n\nTodas las compras cumplen con las mecánicas de la plataforma Beatport y se realizan a través de cuentas legítimas de clientes.',
        faq_title: 'Preguntas frecuentes',
        faq0a_q: '\u00bfQu\u00e9 pasa despu\u00e9s de hacer mi pedido?',
        faq0a_a: 'Una vez realizado tu pedido, recibir\u00e1s inmediatamente un email de confirmaci\u00f3n con los \u00faltimos pasos para validar tu campa\u00f1a.<br>El proceso es r\u00e1pido, sencillo y totalmente gestionado por nuestro equipo.<br><br><strong>Esto es lo que sucede despu\u00e9s:</strong><br><br>1. <strong>Verificaci\u00f3n del track</strong> — Nuestro equipo revisa tu track y confirma el enlace de lanzamiento en Beatport.<br>2. <strong>Programaci\u00f3n de la campa\u00f1a</strong> — Programamos tu promoci\u00f3n seg\u00fan el paquete seleccionado.<br>3. <strong>Compras reales en Beatport</strong> — Nuestra red comienza a comprar tu track en Beatport siguiendo nuestro proceso estrat\u00e9gico.<br>4. <strong>Posicionamiento en charts</strong> — A medida que se acumulan las compras, tu track puede empezar a subir en los charts de Beatport.<br>5. <strong>Notificaci\u00f3n de finalizaci\u00f3n</strong> — Una vez completada la campa\u00f1a, recibir\u00e1s un email de confirmaci\u00f3n.<br><br>Eso es todo. Rel\u00e1jate y observa c\u00f3mo tu track gana visibilidad en los charts de Beatport.',
        faq0b_q: '\u00bfCu\u00e1l es la pol\u00edtica de reembolso?',
        faq0b_a: 'Trabajamos duro para garantizar que cada campa\u00f1a funcione sin problemas.<br><br>Si tu campa\u00f1a no puede ejecutarse o las compras no pueden entregarse en el plazo anunciado, puedes solicitar:<br>\u2022 Un reembolso completo, o<br>\u2022 Una campa\u00f1a de reemplazo<br><br>Contacta con nuestro equipo de soporte en cualquier momento.<br><br>Nuestro objetivo es siempre ofrecer un servicio de promoci\u00f3n transparente, fiable y profesional.',
        faq1_q: '\u00bfCu\u00e1nto dura una campa\u00f1a?',
        faq1_a: 'La mayor\u00eda de las promociones se entregan en 2 a 10 d\u00edas, dependiendo de la competencia del g\u00e9nero.',
        faq2_q: '\u00bfUsan bots?',
        faq2_a: 'No. Las campa\u00f1as de Beatpush se basan en estrategias reales de promoci\u00f3n.',
        faq3_q: '\u00bfPueden los nuevos artistas usar el servicio?',
        faq3_a: 'S\u00ed. Trabajamos con artistas independientes, sellos y distribuidores.',
        faq4_q: '\u00bfLos lanzamientos exclusivos tienen mejor rendimiento?',
        faq4_a: 'En la mayor\u00eda de los casos s\u00ed, porque toda la actividad se concentra en una sola plataforma.',
        faq5_q: '\u00bfAlg\u00fan consejo / requisito?',
        cta_title: '\u00bfListo para dominar los charts?',
        cta_desc: '\u00danete a cientos de artistas que usan BeatPush para impulsar su carrera.',
        cta_btn: 'EMPEZAR AHORA',
        footer_desc: 'La plataforma #1 de promoci\u00f3n musical en Beatport.',
        footer_nav: 'Navegaci\u00f3n',
        footer_boost: 'Impulsar mi track',
        footer_how: 'C\u00f3mo funciona',
        footer_copy: '&copy; 2026 BeatPush. Todos los derechos reservados.',
        footer_disclaimer: 'Beatpush es un servicio promocional independiente. Beatpush no está afiliado a Beatport.',
        footer_terms: 'Términos de Uso',
    },
    de: {
        page_title: 'Beatpush - Beatport Promotion für DJs, Produzenten und Labels',
        page_desc: 'Booste deine Tracks auf Beatport mit BeatPush. Professionelle Promotion f\u00fcr DJs, Produzenten und Labels.',
        nav_how: 'WIE ES FUNKTIONIERT',
        nav_pricing: 'PREISE',
        nav_cta: 'MEINEN TRACK BOOSTEN',
        hero_badge: 'Promotion auf Branchenniveau. Echte Ergebnisse.',
        hero_title: 'Professionelle Beatport-Promotion f\u00fcr <span class="text-gradient">DJs</span>, <span class="text-gradient">Produzenten</span> und <span class="text-gradient">Labels.</span>',
        hero_subtitle: '10+ Jahre, K\u00fcnstler in den Beatport-Charts nach oben zu bringen.',
        hero_cta_btn: 'JETZT STARTEN',
        feature_no_bots: '100% Organisch & Bot-Frei',
        feature_scheduling: 'Individuelle Kampagnenplanung',
        feature_strategy: 'Chart-Strategie & Insider-Beratung',
        feature_guarantee: 'Geld-zur\u00fcck-Garantie',
        search_badge: 'W\u00c4HLE DEINEN TRACK',
        search_title: '<span class="text-green">Pushe</span> deinen Track in die Beatport Charts!',
        search_desc: 'Suche deinen Track auf Beatport und w\u00e4hle ihn aus, um zu starten.',
        search_tagline: 'Keine Abk\u00fcrzungen. Keine Automatisierung. Nur echte Strategie.',
        search_placeholder: 'K\u00fcnstlername, Beatport-Track-URL',
        search_btn: 'SUCHEN',
        search_empty: 'Keine Tracks auf Beatport gefunden. Versuche einen anderen Suchbegriff.',
        pricing_badge: 'PREISE',
        pricing_title: 'Wähle Deine <span class="text-green">Kampagne</span>',
        pricing_desc: 'Unsere Kampagnen stützen sich auf ein großes, etabliertes globales Käufernetzwerk, dem Künstler und Branchenprofis weltweit vertrauen.',
        choose_btn: 'W\u00e4hlen',
        popular_badge: 'BELIEBT',
        change_track: '\u00c4ndern',
        campaign_badge: 'AB IN DIE DETAILS',
        campaign_title: 'Kampagnen-Einrichtung',
        campaign_desc: 'Konfiguriere deine Kampagne vor dem Start.',
        campaign_genre_label: 'Genre',
        campaign_genre_hint: 'Best\u00e4tige das erkannte Genre deines Tracks.',
        campaign_genre_hint_manual: 'Bitte gib dein Genre unten ein.',
        campaign_genre_input_placeholder: 'Genre eingeben (z.B. Afro House, Melodic Techno...)',
        campaign_confirm: 'Best\u00e4tigen',
        campaign_confirmed: 'Best\u00e4tigt',
        campaign_artists_label: '\u00c4hnliche K\u00fcnstler',
        campaign_artists_hint: 'Gib 3 K\u00fcnstler mit \u00e4hnlichem Stil wie dein Track ein \u2014 so k\u00f6nnen wir die richtigen DJs, Playlists und Zielgruppen ansprechen, die sich bereits mit diesem Sound besch\u00e4ftigen.',
        campaign_artists_placeholder: 'Beispiel: Adam Port, Black Coffee, Keinemusik',
        campaign_release_label: 'Ver\u00f6ffentlichungsstatus',
        campaign_release_hint: 'Ist dein Track bereits ver\u00f6ffentlicht oder in Vorbestellung?',
        campaign_released: 'Bereits ver\u00f6ffentlicht',
        campaign_preorder: 'Vorbestellung',
        campaign_launch_btn: 'Meine Kampagne starten',
        payment_success: 'Zahlung best\u00e4tigt!',
        payment_success_sub: 'Ihre Kampagne wird eingerichtet. Sie erhalten in K\u00fcrze eine Best\u00e4tigungs-E-Mail.\nSie erhalten au\u00dferdem eine detaillierte Quittung aller K\u00e4ufe innerhalb von 24/48 Stunden.',
        payment_success_whatsapp_text: 'Wenn Sie über Ihren Track sprechen, eine Frage stellen oder einfach über Ihre Kampagne auf dem Laufenden bleiben möchten, zögern Sie nicht, uns zu kontaktieren.',
        payment_success_whatsapp_btn: 'Chatten Sie mit uns',
        campaign_tips_title: 'Tipps / Anforderungen',
        card_tooltip_title: 'Tipps & Anforderungen',
        campaign_tip_1: 'Tracks m\u00fcssen neu sein.',
        campaign_tip_2: 'Der K\u00fcnstler/das Label sollte eine Store-Pr\u00e4senz haben.',
        campaign_tip_5: 'Beatport Hype: Wir empfehlen, Beatport Hype zu abonnieren und dein Beatport-K\u00fcnstlerprofil mit Bild und Bio zu vervollst\u00e4ndigen.',
        campaign_tip_6: 'Chart-Aufstieg: Charts zu erklimmen ist nicht nur eine Frage der Zahlen, sondern auch der Qualit\u00e4t der Musik.',
        campaign_tip_7: 'Variable Promotionszeitr\u00e4ume: Jeder Zeitraum ist anders, abh\u00e4ngig vom K\u00f6nnen des K\u00fcnstlers/Labels.',
        campaign_tip_8: 'Herausforderungen an der Spitze: Je n\u00e4her du dem Top kommst, desto schwieriger wird es aufzusteigen.',
        dailypush_tip_1: 'Sobald du im Chart bist, kannst du einen verg\u00fcnstigten DAILY PUSH kaufen, um deine Position zu halten, weiterzumachen und aufzusteigen.',
        dailypush_tip_2: 'Dies besteht aus 10 t\u00e4glichen K\u00e4ufen deines Tracks von DJ\'s auf der ganzen Welt, die zu deinem Genre passen.',
        dailypush_tip_3: 'Herausforderungen an der Spitze: Je n\u00e4her du dem Top kommst, desto schwieriger wird es aufzusteigen.',
        top100_tooltip_title: 'Um eine effektive Promotion zu gewährleisten, müssen die Track(s) folgende Kriterien erfüllen:',
        top100_tip_1: 'Der Track muss brandneu sein (idealerweise in der Vorbestellungsphase).',
        top100_tip_2: 'Die Veröffentlichung darf zum Zeitpunkt des Kampagnenstarts nicht älter als 24 Stunden sein.',
        top100_tip_3: 'Der Track darf noch nie in einem Chart gewesen sein.',
        top100_tip_4: 'Der Künstler oder das Label sollte mindestens 7 frühere Veröffentlichungen auf Beatport haben.',
        top100_tip_5: 'Der Künstler oder das Label muss den Top 100 des ausgewählten Genres in den letzten 6 Monaten mindestens zweimal erreicht haben.',
        top100_tip_6: 'Der Track muss in den Beatport Hype Picks des Genres erscheinen.',
        top100_tip_7: 'Kampagnen können nicht an Sonntagen oder Montagen gestartet werden.',
        top10_tooltip_title: 'Um für diese Promotion in Frage zu kommen, müssen die Tracks folgende Kriterien erfüllen:',
        top10_tip_1: 'Innerhalb der letzten sechs Tage veröffentlicht.',
        top10_tip_2: 'Derzeit nicht im Abwärtstrend.',
        top10_tip_3: 'Aktuelle Mindestposition Nummer 20.',
        top10_tip_4: 'Muss das erste Mal sein, dass der Track im Chart erscheint.',
        top10_tip_footer_1: 'Wenn dein Track diese Anforderungen noch nicht erfüllt, kannst du mit unserer',
        top10_tip_footer_daily_push: 'Daily Push Promotion',
        top10_tip_footer_2: 'beginnen, die entwickelt wurde, um Tracks an Dynamik gewinnen und in den Charts aufsteigen zu lassen.',
        top10_tip_footer_3: 'Nach Erreichen von ungefähr Position #20 kannst du auf dieses exklusive Promotionspaket zugreifen und davon profitieren.',
        campaign_validate_genre: 'Bitte bestätige das Genre deines Tracks vor dem Start.',
        campaign_validate_artists: 'Bitte gib mindestens 1 \u00e4hnlichen K\u00fcnstler ein.',
        choose_validate_track: 'Bitte w\u00e4hle zuerst einen Track aus, bevor du ein Paket w\u00e4hlst.',
        campaign_summary_track: 'Track',
        campaign_summary_pack: 'Paket',
        campaign_summary_copies: 'Kopien',
        how_badge: 'UNSER PROZESS',
        how_title: 'Wie die Beatpush Promotion <span class="text-gradient">funktioniert</span>',
        how_step1_title: 'Reiche deinen Beatport-Track ein',
        how_step1_desc: 'Finde und w\u00e4hle deinen Beatport-Track \u00fcber unsere Suchleiste.',
        how_step1_detail: 'Unser Algorithmus analysiert den Track und best\u00e4tigt die Machbarkeit der Kampagne.',
        how_step2_title: 'Strategie-Einrichtung',
        how_step2_desc: 'Wir planen die Promotion basierend auf:',
        how_step2_li1: 'Genre-Wettbewerb',
        how_step2_li2: 'Release-Timing',
        how_step2_li3: 'Beatport-Chart-Dynamik',
        how_step2_li4: 'Sichtbarkeitspotenzial',
        how_step2_detail: 'Jede Kampagne ist strukturiert, um den Schwung w\u00e4hrend des Schl\u00fcssel-Release-Fensters zu maximieren.',
        how_step3_title: 'Kampagnenstart',
        how_step3_desc: 'Deine Promotionskampagne beginnt.',
        how_step3_bullet1: 'Beatpush verbindet deine Musik mit einem privaten Netzwerk aus DJs, Produzenten und leidenschaftlichen Sammlern elektronischer Musik, aufgebaut über mehr als 10 Jahre in der Branche.',
        how_step3_bullet2: 'Unser Team überwacht die Kampagne täglich und verfolgt die Chart-Aktivität.',
        how_step4_title: 'Chart-\u00dcberwachung',
        how_step4_desc: 'W\u00e4hrend der Promotion \u00fcberwachen wir:',
        how_step4_li1: 'Chart-Bewegungen',
        how_step4_li2: 'Sichtbarkeitswachstum',
        how_step4_li3: 'Kampagnenleistung',
        how_step4_detail: 'Kunden erhalten Updates zum Kampagnenfortschritt.',
        how_step5_title: 'Belege bereitgestellt',
        how_step5_desc: 'Sie erhalten Belege f\u00fcr alle Ihre heruntergeladenen Tracks.',
        why_badge: 'WARUM BEATPUSH',
        why_title: 'Warum BeatPush f\u00fcr deine Musikpromotion w\u00e4hlen',
        why_subtitle: 'Baue beständiges Wachstum auf',
        why_card1_title: 'Echte Beatport-Promotion',
        why_card1_text: 'Alle Käufe entsprechen den Plattformmechanismen von Beatport und werden über legitime Kundenkonten getätigt.',
        why_card2_title: 'Echter & messbarer Impact',
        why_card2_text: 'Jede Promotion ist strukturiert, um greifbare Chart-Bewegung zu erzeugen. Unser Team versteht, wie Beatport-Charts funktionieren und setzt Kampagnen pr\u00e4zise und strategisch ein.',
        why_card3_title: '100% organisch & botfrei',
        why_card3_text: 'Jeder Kauf ist 100% organisch, über echte Beatport-Konten getätigt, mit vollständiger Rückverfolgbarkeit und verifizierten Belegen.\n\nAlle Käufe entsprechen den Plattform-Mechaniken von Beatport und werden über legitime Kundenkonten getätigt.',
        faq_title: 'H\u00e4ufig gestellte Fragen',
        faq0a_q: 'Was passiert nach meiner Bestellung?',
        faq0a_a: 'Sobald Ihre Bestellung aufgegeben wurde, erhalten Sie sofort eine Best\u00e4tigungs-E-Mail mit den letzten Schritten zur Validierung Ihrer Kampagne.<br>Der Prozess ist schnell, einfach und wird vollst\u00e4ndig von unserem Team abgewickelt.<br><br><strong>Das passiert als N\u00e4chstes:</strong><br><br>1. <strong>Track-Verifizierung</strong> — Unser Team \u00fcberpr\u00fcft Ihren Track und best\u00e4tigt den Beatport-Release-Link.<br>2. <strong>Kampagnenplanung</strong> — Wir planen Ihre Promotion gem\u00e4\u00df dem gew\u00e4hlten Paket.<br>3. <strong>Echte Beatport-K\u00e4ufe</strong> — Unser Netzwerk beginnt, Ihren Track auf Beatport zu kaufen.<br>4. <strong>Chart-Positionierung</strong> — W\u00e4hrend sich die K\u00e4ufe ansammeln, kann Ihr Track in den Beatport-Charts aufsteigen.<br>5. <strong>Abschlussbenachrichtigung</strong> — Nach Abschluss der Kampagne erhalten Sie eine Best\u00e4tigungs-E-Mail.<br><br>Das war\'s. Lehnen Sie sich zur\u00fcck und beobachten Sie, wie Ihr Track Sichtbarkeit in den Beatport-Charts gewinnt.',
        faq0b_q: 'Wie lautet die R\u00fcckerstattungsrichtlinie?',
        faq0b_a: 'Wir arbeiten hart daran, dass jede Kampagne reibungslos verl\u00e4uft.<br><br>Wenn Ihre Kampagne nicht ausgef\u00fchrt werden kann oder die K\u00e4ufe nicht im angek\u00fcndigten Zeitrahmen geliefert werden k\u00f6nnen, k\u00f6nnen Sie Folgendes anfordern:<br>\u2022 Eine vollst\u00e4ndige R\u00fcckerstattung, oder<br>\u2022 Eine Ersatzkampagne<br><br>Kontaktieren Sie jederzeit unser Support-Team bei Fragen.<br><br>Unser Ziel ist es immer, einen transparenten, zuverl\u00e4ssigen und professionellen Promotionservice zu bieten.',
        faq1_q: 'Wie lange dauert eine Kampagne?',
        faq1_a: 'Die meisten Promotionen werden innerhalb von 2 bis 10 Tagen geliefert, je nach Genre-Wettbewerb.',
        faq2_q: 'Verwenden Sie Bots?',
        faq2_a: 'Nein. Beatpush-Kampagnen basieren auf echten Promotionsstrategien.',
        faq3_q: 'K\u00f6nnen neue K\u00fcnstler den Service nutzen?',
        faq3_a: 'Ja. Wir arbeiten mit unabh\u00e4ngigen K\u00fcnstlern, Labels und Distributoren.',
        faq4_q: 'Haben exklusive Ver\u00f6ffentlichungen bessere Ergebnisse?',
        faq4_a: 'In den meisten F\u00e4llen ja, da sich alle Aktivit\u00e4ten auf eine einzige Plattform konzentrieren.',
        faq5_q: 'Tipps / Anforderungen?',
        cta_title: 'Bereit, die Charts zu dominieren?',
        cta_desc: 'Schlie\u00dfe dich Hunderten von K\u00fcnstlern an, die BeatPush nutzen, um ihre Karriere zu boosten.',
        cta_btn: 'JETZT STARTEN',
        footer_desc: 'Die #1 Musik-Promotion-Plattform auf Beatport.',
        footer_nav: 'Navigation',
        footer_boost: 'Meinen Track boosten',
        footer_how: 'Wie es funktioniert',
        footer_copy: '&copy; 2026 BeatPush. Alle Rechte vorbehalten.',
        footer_disclaimer: 'Beatpush ist ein unabhängiger Promotionservice. Beatpush ist nicht mit Beatport verbunden.',
        footer_terms: 'Nutzungsbedingungen',
    }
};

function detectLanguage() {
    const saved = localStorage.getItem('beatpush_lang');
    if (saved && translations[saved]) return saved;
    return 'fr';
}

function applyTranslations(lang) {
    if (!lang) lang = detectLanguage();

    document.documentElement.lang = lang;
    const t = translations[lang] || translations.en;

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
let selectedPack = null;
let searchTimeout = null;
let currentSearchQuery = '';
let genreConfirmed = false;

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

// ===== Artist Autocomplete Search =====
const artistInput = document.getElementById('similarArtists');
const artistResults = document.getElementById('artistSearchResults');
const artistTagsContainer = document.getElementById('artistTags');
let selectedArtists = [];
let artistSearchTimeout = null;

if (artistInput && artistResults) {
    artistInput.addEventListener('input', () => {
        clearTimeout(artistSearchTimeout);
        const query = artistInput.value.trim();
        if (query.length < 2) {
            artistResults.classList.remove('visible');
            return;
        }
        artistSearchTimeout = setTimeout(async () => {
            artistInput.classList.add('loading');
            try {
                let response;
                try {
                    response = await fetch(`${SEARCH_API_PROXY}?q=${encodeURIComponent(query)}&type=artist`);
                } catch (e) {
                    response = null;
                }
                if (!response || !response.ok) {
                    response = await fetch(`${SEARCH_API_BASE}?q=${encodeURIComponent(query)}&type=artist`);
                }
                if (!response.ok) throw new Error('API error');
                const data = await response.json();
                console.log('Artist search response:', data);
                renderArtistResults(data);
            } catch (err) {
                console.error('Artist search error:', err);
                artistResults.classList.remove('visible');
            } finally {
                artistInput.classList.remove('loading');
            }
        }, 300);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.artist-search-wrapper')) {
            artistResults.classList.remove('visible');
        }
    });
}

function renderArtistResults(data) {
    const artists = data.results || data.artists || data || [];
    if (!artists.length) {
        artistResults.classList.remove('visible');
        return;
    }
    artistResults.innerHTML = artists.slice(0, 8).map(artist => {
        const name = artist.name || artist.title || artist;
        const img = artist.image || artist.image_url || artist.artwork || artist.thumb || '';
        const id = artist.id || name;
        const safeImg = typeof img === 'string' ? img.replace(/"/g, '&quot;') : '';
        return `<div class="artist-result-item" data-name="${typeof name === 'string' ? name.replace(/"/g, '&quot;') : name}" data-id="${id}" data-img="${safeImg}">
            ${img
                ? `<img src="${safeImg}" alt="" onerror="this.outerHTML='<div class=\\'artist-avatar-placeholder\\'><svg width=\\'16\\' height=\\'16\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'1.5\\'><path d=\\'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\\'/><circle cx=\\'12\\' cy=\\'7\\' r=\\'4\\'/></svg></div>'">`
                : `<div class="artist-avatar-placeholder"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>`
            }
            <span>${typeof name === 'string' ? name : name}</span>
        </div>`;
    }).join('');
    artistResults.classList.add('visible');

    artistResults.querySelectorAll('.artist-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const name = item.dataset.name;
            const img = item.dataset.img || '';
            if (!selectedArtists.find(a => a.name === name)) {
                selectedArtists.push({ name, img });
                renderArtistTags();
            }
            artistInput.value = '';
            artistResults.classList.remove('visible');
        });
    });
}

function renderArtistTags() {
    artistTagsContainer.innerHTML = selectedArtists.map((artist, i) => {
        const name = typeof artist === 'string' ? artist : artist.name;
        const img = typeof artist === 'string' ? '' : (artist.img || '');
        return `<span class="artist-tag">
            ${img
                ? `<img src="${img}" alt="" class="artist-tag-img" onerror="this.remove()">`
                : `<span class="artist-tag-avatar"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>`
            }
            ${name}
            <button class="artist-tag-remove" data-index="${i}" type="button">&times;</button>
        </span>`;
    }).join('');

    artistTagsContainer.querySelectorAll('.artist-tag-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedArtists.splice(parseInt(btn.dataset.index), 1);
            renderArtistTags();
        });
    });
}

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
        this.style.animation = 'none';
        void this.offsetWidth;
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

document.querySelectorAll('.step-card, .product-card, .section-header, .search-box, .cta-box, .faq-item, .why-choose-card, .campaign-setup-card').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ===== Step Timeline Scroll Highlight =====
const stepCards = document.querySelectorAll('.step-card-v2');
const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('step-active');
        }
    });
}, {
    threshold: 0.3,
    rootMargin: '0px 0px -20% 0px'
});

stepCards.forEach(card => {
    stepObserver.observe(card);
});

// ===== Beatport URL Detection =====
function parseBeatportUrl(input) {
    const urlPattern = /(?:https?:\/\/)?(?:www\.)?beatport\.com\/track\/([^/]+)\/(\d+)/i;
    const match = input.match(urlPattern);
    if (match) {
        return {
            slug: match[1],
            id: match[2],
            name: match[1].replace(/-/g, ' ')
        };
    }
    return null;
}

// ===== Track Search =====
searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    const query = searchInput.value.trim();

    if (query.length < 2) {
        searchResults.innerHTML = '';
        hideSearchLoading();
        return;
    }

    showSearchLoading();
    searchTimeout = setTimeout(() => performSearch(), 400);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        clearTimeout(searchTimeout);
        performSearch();
    }
});

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

    if (query === currentSearchQuery) {
        hideSearchLoading();
        return;
    }
    currentSearchQuery = query;

    showSearchLoading();

    try {
        const beatportUrl = parseBeatportUrl(query);
        let searchQuery = beatportUrl ? beatportUrl.name : query;

        let response;
        try {
            response = await fetch(`${SEARCH_API_PROXY}?q=${encodeURIComponent(searchQuery)}&type=track`);
        } catch (e) {
            response = null;
        }
        if (!response || !response.ok) {
            response = await fetch(`${SEARCH_API_BASE}?q=${encodeURIComponent(searchQuery)}&type=track`);
        }

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Track search response:', data);
        displayResults(data, beatportUrl ? beatportUrl.id : null);
    } catch (error) {
        console.error('Search error:', error);
        currentSearchQuery = '';
        displayDemoResults(query);
    } finally {
        hideSearchLoading();
    }
}

function displayResults(data, targetTrackId) {
    searchResults.innerHTML = '';

    let tracks = Array.isArray(data) ? data : (data.results || data.tracks || data.data || []);
    tracks = tracks.filter(item => item.title || item.name);

    if (!tracks.length) {
        const lang = detectLanguage();
        const t = translations[lang] || translations.en;
        const emptyMsg = t.search_empty || 'No tracks found.';
        searchResults.innerHTML = `<div class="search-empty">${emptyMsg}</div>`;
        return;
    }

    if (targetTrackId) {
        tracks.sort((a, b) => {
            const aMatch = a.link && a.link.includes(targetTrackId);
            const bMatch = b.link && b.link.includes(targetTrackId);
            return bMatch - aMatch;
        });
    }

    tracks.slice(0, 10).forEach(track => {
        const title = track.title || track.name;
        const artist = Array.isArray(track.artists) ? track.artists.join(', ') : (track.artist || 'Unknown artist');
        const artwork = track.image_url || track.image || track.artwork || '';
        const genre = Array.isArray(track.genre) ? track.genre.join(', ') : '';
        const link = track.link || '';

        const el = createTrackElement(title, artist, artwork, link, genre);
        searchResults.appendChild(el);
    });
}

function displayDemoResults(query) {
    searchResults.innerHTML = '';

    const beatportUrl = parseBeatportUrl(query);
    const displayName = beatportUrl ? beatportUrl.name : query;

    const demoTracks = [
        { title: `${displayName} (Original Mix)`, artist: 'Various Artists', artwork: '' },
        { title: `${displayName} - Extended Mix`, artist: 'DJ Producer', artwork: '' },
        { title: `${displayName} (Remix)`, artist: 'Top Artist', artwork: '' },
    ];

    demoTracks.forEach((track) => {
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
        selectTrack(title, artist, largeArtwork, link, genre);
    });

    return el;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function selectTrack(title, artist, artwork, id, genre) {
    selectedTrack = { title, artist, artwork, id, genre: genre || '' };

    // Update Top 10 / Top 100 card price based on genre
    updateTop10Price(genre);
    updateTop100Price(genre);

    // Show pricing section
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
        pricingSection.style.display = '';

        // Show selected track banner
        let banner = document.getElementById('selectedTrackBanner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'selectedTrackBanner';
            banner.className = 'selected-track-banner';
            const sectionHeader = pricingSection.querySelector('.section-header');
            sectionHeader.parentNode.insertBefore(banner, sectionHeader.nextSibling);
        }

        const safeTitle = escapeHtml(title);
        const safeArtist = escapeHtml(artist);
        const largeArtwork = artwork ? artwork.replace('200x200', '500x500') : '';
        const lang = detectLanguage();
        const t = translations[lang] || translations.en;

        banner.innerHTML = `
            <div class="selected-track">
                ${largeArtwork ? `<img src="${escapeHtml(largeArtwork)}" alt="${safeTitle}" class="selected-track-art">` : ''}
                <div class="selected-track-info">
                    <div class="selected-track-title">${safeTitle}</div>
                    <div class="selected-track-artist">${safeArtist}</div>
                </div>
                <button class="selected-track-change" onclick="changeTrack()">${t.change_track || 'Change'}</button>
            </div>
        `;

        setTimeout(() => {
            pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    // Clear search results
    searchResults.innerHTML = '';
}

function changeTrack() {
    selectedTrack = null;
    selectedPack = null;
    // Reset Top 10 / Top 100 price
    updateTop10Price(null);
    updateTop100Price(null);
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
        pricingSection.style.display = 'none';
    }
    const banner = document.getElementById('selectedTrackBanner');
    if (banner) banner.remove();

    // Hide campaign setup
    const campaignSetup = document.getElementById('campaignSetup');
    if (campaignSetup) campaignSetup.style.display = 'none';

    // Scroll back to search
    const searchSection = document.getElementById('search');
    if (searchSection) {
        searchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    searchInput.focus();
}

// ===== Package Selection =====
document.querySelectorAll('.pack-select-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();

        // Require a track to be selected first
        if (!selectedTrack) {
            const lang = detectLanguage();
            const t = translations[lang] || translations.en;
            showToast(t.choose_validate_track || 'Please select a track first before choosing a campaign.', true);
            return;
        }

        const pack = btn.dataset.pack;
        selectedPack = pack;
        showCampaignSetup(pack);
    });
});

function showCampaignSetup(pack) {
    const campaignSetup = document.getElementById('campaignSetup');
    if (!campaignSetup) return;

    campaignSetup.style.display = '';
    genreConfirmed = false;

    const lang = detectLanguage();
    const t = translations[lang] || translations.en;

    // Update summary
    const summary = document.getElementById('campaignSummary');
    if (summary && selectedTrack) {
        const safeTitle = escapeHtml(selectedTrack.title);
        const safeArtist = escapeHtml(selectedTrack.artist);
        const artworkUrl = selectedTrack.artwork ? escapeHtml(selectedTrack.artwork.replace('200x200', '500x500')) : '';
        summary.innerHTML = `
            <div class="campaign-summary-track">
                ${artworkUrl ? `<img src="${artworkUrl}" alt="${safeTitle}" class="campaign-summary-art">` : ''}
                <div class="campaign-summary-details">
                    <div class="campaign-summary-row">
                        <span class="campaign-summary-label">${t.campaign_summary_track || 'Track'}:</span>
                        <span class="campaign-summary-value">${safeTitle} - ${safeArtist}</span>
                    </div>
                    <div class="campaign-summary-row">
                        <span class="campaign-summary-label">${t.campaign_summary_pack || 'Package'}:</span>
                        <span class="campaign-summary-value">${pack === 'exclusive-800' ? 'Top 10 by genre' : pack === 'promo-430' ? 'Top 100 by genre' : pack === 'daily-push' ? 'Daily push - 10 copies / day' : pack}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Set genre from selected track
    const genreTag = document.getElementById('campaignGenreTag');
    const genreInput = document.getElementById('campaignGenreInput');
    const hasGenre = selectedTrack && selectedTrack.genre;
    if (genreTag) {
        genreTag.textContent = hasGenre ? selectedTrack.genre : '';
        genreTag.style.display = hasGenre ? '' : 'none';
    }
    if (genreInput) {
        genreInput.style.display = hasGenre ? 'none' : '';
        genreInput.value = '';
    }

    // Update hint text based on genre detection
    const genreHint = document.querySelector('[data-i18n="campaign_genre_hint"]');
    if (genreHint) {
        genreHint.textContent = hasGenre
            ? (t.campaign_genre_hint || 'Confirm the genre detected for your track.')
            : (t.campaign_genre_hint_manual || 'Please type your genre below.');
    }

    // Reset confirm button
    const confirmBtn = document.getElementById('genreConfirmBtn');
    if (confirmBtn) {
        confirmBtn.textContent = t.campaign_confirm || 'Confirm';
        confirmBtn.classList.remove('confirmed');
        confirmBtn.disabled = false;
    }

    // Update tips based on pack
    const tipsContent = document.getElementById('tipsContent');
    if (tipsContent) {
        if (pack === 'exclusive-800') {
            tipsContent.innerHTML = `
                <p style="margin: 0 0 8px 0; color: #ccc;">${t.top10_tooltip_title || 'To qualify for this promotion, tracks must meet the following criteria:'}</p>
                <ul>
                    <li data-i18n="top10_tip_1">${t.top10_tip_1 || 'Released within the last six days.'}</li>
                    <li data-i18n="top10_tip_2">${t.top10_tip_2 || 'Not currently in a downward trend.'}</li>
                    <li data-i18n="top10_tip_3">${t.top10_tip_3 || 'Current minimum position number 20.'}</li>
                    <li data-i18n="top10_tip_4">${t.top10_tip_4 || 'Must be the track\'s first time appearing on the chart.'}</li>
                </ul>
                <p style="margin: 8px 0 0 0; color: #999; font-size: 0.75rem; line-height: 1.4;">${t.top10_tip_footer_1 || 'If your track does not yet meet these requirements, you can begin with our'} <span style="color: #4CAF50;">${t.top10_tip_footer_daily_push || 'Daily Push Promotion'}</span>, ${t.top10_tip_footer_2 || 'designed to help tracks gain momentum and climb the charts.'}<br>${t.top10_tip_footer_3 || 'After reaching approximately position #20, you will be able to access and benefit from this exclusive promotion package.'}</p>
            `;
        } else if (pack === 'daily-push') {
            tipsContent.innerHTML = `
                <ul>
                    <li data-i18n="dailypush_tip_1">${t.dailypush_tip_1 || 'Once you get in the chart, to keep the position, to continue and climb, you can purchase a discounted DAILY PUSH.'}</li>
                    <li data-i18n="dailypush_tip_2">${t.dailypush_tip_2 || 'This consists in 10 daily purchases of your track, from DJ\'s all around the world and fitting with your genre.'}</li>
                    <li data-i18n="dailypush_tip_3">${t.dailypush_tip_3 || 'Challenges at the Top: The closer you get to the top, the more challenging it becomes to move up.'}</li>
                </ul>
            `;
        } else {
            tipsContent.innerHTML = `
                <p style="margin: 0 0 8px 0; color: #ccc;">${t.top100_tooltip_title || 'To ensure an effective promotion, the track(s) must meet the following criteria:'}</p>
                <ul>
                    <li data-i18n="top100_tip_1">${t.top100_tip_1 || 'The track must be brand new (ideally in pre-order stage).'}</li>
                    <li data-i18n="top100_tip_2">${t.top100_tip_2 || 'The release must be no older than 24 hours at the time the campaign begins.'}</li>
                    <li data-i18n="top100_tip_3">${t.top100_tip_3 || 'The track must never have been charted before.'}</li>
                    <li data-i18n="top100_tip_4">${t.top100_tip_4 || 'The artist or label should have at least 7 previous releases on Beatport.'}</li>
                    <li data-i18n="top100_tip_5">${t.top100_tip_5 || 'The artist or label must have reached the Top 100 of the selected genre at least twice within the last 6 months.'}</li>
                    <li data-i18n="top100_tip_6">${t.top100_tip_6 || 'The track must appear in Beatport Hype Picks for the genre.'}</li>
                    <li data-i18n="top100_tip_7">${t.top100_tip_7 || 'Campaigns cannot start on Sundays or Mondays.'}</li>
                </ul>
            `;
        }
    }

    // Display price summary above launch button
    const priceSummary = document.getElementById('campaignPriceSummary');
    if (priceSummary) {
        const PACK_PRICES = {
            50: '$240',
            100: '$480',
            200: '$960',
            500: '$1,900',
            1000: '$3,850',
            'exclusive-800': '€920',
            'daily-push': '$55'
        };
        const priceLabel = t.campaign_total || 'Total';
        if (pack === 'promo-430') {
            const genre = selectedTrack && selectedTrack.genre ? selectedTrack.genre : null;
            const genrePrice = genre ? getTop100Price(genre) : null;
            if (genrePrice) {
                priceSummary.textContent = `${priceLabel}: $${genrePrice.toLocaleString('en-US')}`;
            } else {
                priceSummary.textContent = `${priceLabel}: ${t.campaign_price_genre || 'Depends on genre'}`;
            }
        } else {
            priceSummary.textContent = `${priceLabel}: ${PACK_PRICES[pack] || ''}`;
        }
    }

    // Update launch button text and store pack on the button itself
    const launchBtn = document.getElementById('launchCampaignBtn');
    if (launchBtn) {
        launchBtn.dataset.selectedPack = pack;
        if (pack === 'exclusive-800' || pack === 'promo-430') {
            launchBtn.textContent = t.campaign_whatsapp_btn || 'Contact us on Whatsapp to finalize';
        } else {
            launchBtn.textContent = t.campaign_launch_btn || 'Run my campaign';
        }
    }

    // Scroll to campaign setup
    setTimeout(() => {
        campaignSetup.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// Genre confirm button
document.getElementById('genreConfirmBtn').addEventListener('click', function() {
    const genreInput = document.getElementById('campaignGenreInput');
    const genreTag = document.getElementById('campaignGenreTag');

    // If manual input is visible, validate and use its value
    if (genreInput && genreInput.style.display !== 'none') {
        const manualGenre = genreInput.value.trim();
        if (!manualGenre) {
            genreInput.classList.add('field-highlight');
            setTimeout(() => genreInput.classList.remove('field-highlight'), 2000);
            return;
        }
        // Set the genre tag with manual value
        if (genreTag) {
            genreTag.textContent = manualGenre;
            genreTag.style.display = '';
        }
        genreInput.style.display = 'none';
    }

    genreConfirmed = true;
    this.classList.add('confirmed');
    const lang = detectLanguage();
    const t = translations[lang] || translations.en;
    this.textContent = t.campaign_confirmed || 'Confirmed';
    this.disabled = true;

    // Update price summary for Top 100 based on confirmed genre
    if (selectedPack === 'promo-430') {
        const confirmedGenre = genreTag ? genreTag.textContent.trim() : null;
        const genrePrice = confirmedGenre ? getTop100Price(confirmedGenre) : null;
        const priceSummary = document.getElementById('campaignPriceSummary');
        if (priceSummary && genrePrice) {
            const priceLabel = t.campaign_total || 'Total';
            priceSummary.textContent = `${priceLabel}: $${genrePrice.toLocaleString('en-US')}`;
        }
    }
});

// Tips toggle
document.getElementById('tipsToggle').addEventListener('click', function() {
    this.closest('.campaign-tips').classList.toggle('open');
});

// Launch campaign button
document.getElementById('launchCampaignBtn').addEventListener('click', function() {
    // Require login before any payment action
    if (typeof requireAuth === 'function' && !requireAuth('payment')) return;

    const lang = detectLanguage();
    const t = translations[lang] || translations.en;

    // Use pack stored on button as source of truth (set in showCampaignSetup)
    const activePack = this.dataset.selectedPack || selectedPack;
    if (activePack && activePack !== selectedPack) {
        console.warn('Pack mismatch! button:', activePack, 'variable:', selectedPack);
        selectedPack = activePack;
    }

    // Validate genre confirmed
    if (!genreConfirmed) {
        showToast(t.campaign_validate_genre || 'Please confirm the genre of your track before launching.');
        highlightField(document.getElementById('genreConfirmBtn'));
        return;
    }

    // Validate at least 1 similar artist
    const artistsField = document.getElementById('similarArtists');
    if (!selectedArtists.length) {
        showToast(t.campaign_validate_artists || 'Please enter at least 1 similar artist.');
        highlightField(artistsField);
        return;
    }

    // Top 10 & Top 100: redirect to WhatsApp
    if (selectedPack === 'exclusive-800') {
        const track = selectedTrack || {};
        const genre = document.getElementById('campaignGenreTag')?.textContent?.trim() || track.genre || '';
        const artists = selectedArtists.map(a => a.name).join(', ');
        const beatportUrl = track.id || '';
        let msg = `Hello, I'd like to finalize my Beatport Top 10 Campaign!\n\n`;
        msg += `Track: ${track.title || ''} - ${track.artist || ''}\n`;
        msg += `Beatport URL: ${beatportUrl}\n`;
        msg += `Genre: ${genre}\n`;
        msg += `Price: €920\n`;
        msg += `Similar Artists: ${artists}`;
        const encoded = encodeURIComponent(msg);
        window.open(`https://api.whatsapp.com/send/?phone=13046603890&text=${encoded}&type=phone_number&app_absent=0`, '_blank');
        return;
    }
    if (selectedPack === 'promo-430') {
        const track = selectedTrack || {};
        const genre = document.getElementById('campaignGenreTag')?.textContent?.trim() || track.genre || '';
        const artists = selectedArtists.map(a => a.name).join(', ');
        const beatportUrl = track.id || '';
        const genrePrice = getTop100Price(genre);
        let msg = `Hello, I'd like to finalize my Beatport Top 100 Campaign!\n\n`;
        msg += `Track: ${track.title || ''} - ${track.artist || ''}\n`;
        msg += `Beatport URL: ${beatportUrl}\n`;
        msg += `Genre: ${genre}\n`;
        if (genrePrice) msg += `Price: $${genrePrice.toLocaleString('en-US')}\n`;
        msg += `Similar Artists: ${artists}`;
        const encoded = encodeURIComponent(msg);
        window.open(`https://api.whatsapp.com/send/?phone=13046603890&text=${encoded}&type=phone_number&app_absent=0`, '_blank');
        return;
    }

    // Other packs: create Stripe Checkout Session with metadata
    // Use pack from button data attribute as primary source of truth
    const packToSend = this.dataset.selectedPack || selectedPack;
    if (!packToSend) return;

    console.log('[BeatPush] selectedPack variable:', selectedPack);
    console.log('[BeatPush] button data-selected-pack:', this.dataset.selectedPack);
    console.log('[BeatPush] pack being sent to API:', packToSend);

    const track = selectedTrack || {};
    const genre = document.getElementById('campaignGenreTag')?.textContent?.trim() || track.genre || '';
    const artists = selectedArtists.map(a => a.name).join(', ');
    const releaseStatus = document.querySelector('input[name="releaseStatus"]:checked')?.value || '';

    const requestBody = {
        pack: packToSend,
        track_title: track.title || '',
        track_artist: track.artist || '',
        track_url: track.id || '',
        genre: genre,
        similar_artists: artists,
        release_status: releaseStatus,
    };
    console.log('[BeatPush] Request body:', JSON.stringify(requestBody));

    // Save rich campaign data for confirmation popup on return
    localStorage.setItem('beatpush_pending_campaign', JSON.stringify({
        pack: packToSend,
        track_title: track.title || '',
        track_artist: track.artist || '',
        track_artwork: track.artwork ? track.artwork.replace('200x200', '500x500') : '',
        genre: genre,
        similar_artists: selectedArtists.map(a => ({ name: a.name, img: a.img || '' })),
        release_status: releaseStatus,
    }));

    const launchBtn = document.getElementById('launchCampaignBtn');
    if (launchBtn) {
        launchBtn.disabled = true;
        launchBtn.style.opacity = '0.6';
    }

    fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
    })
    .then(r => {
        console.log('[BeatPush] API response status:', r.status);
        return r.json();
    })
    .then(data => {
        console.log('[BeatPush] API response:', JSON.stringify(data));
        if (data.url) {
            window.location.href = data.url;
        } else {
            console.warn('[BeatPush] No URL in response, using fallback Payment Link');
            window.open(STRIPE_LINKS[packToSend], '_blank');
        }
    })
    .catch((err) => {
        console.error('[BeatPush] Fetch error:', err);
        window.open(STRIPE_LINKS[packToSend], '_blank');
    })
    .finally(() => {
        if (launchBtn) {
            launchBtn.disabled = false;
            launchBtn.style.opacity = '';
        }
    });
});

// ===== Field Highlight =====
function highlightField(el) {
    if (!el) return;
    el.classList.add('field-highlight');
    setTimeout(() => el.classList.remove('field-highlight'), 2000);
}

// ===== Toast Popup =====
function showToast(message, scrollToSearch) {
    // Remove existing toast
    const existing = document.querySelector('.toast-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'toast-overlay';
    overlay.innerHTML = `
        <div class="toast-box">
            <div class="toast-icon">
                <img src="https://i.ibb.co/nMjbdTkQ/White-and-Black-Modern-Initial-B-Logo-5000-x-5000-px-1.png" alt="BeatPush" class="toast-logo">
            </div>
            <p class="toast-msg">${message}</p>
            <button class="toast-close">OK</button>
        </div>
    `;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('visible'));

    const close = () => {
        overlay.classList.remove('visible');
        setTimeout(() => {
            overlay.remove();
            if (scrollToSearch) {
                const searchSection = document.getElementById('search');
                if (searchSection) {
                    searchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }, 300);
    };

    overlay.querySelector('.toast-close').addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
    });
}

// ===== Checkout Success Detection =====
function showPaymentConfirmation(campaign, paymentData) {
    const lang = detectLanguage();
    const t = translations[lang] || translations.en;
    const packLabel = campaign.pack === 'daily-push' ? 'Daily Push - 10 copies/day' : `${campaign.pack} copies`;

    // Build artist chips HTML
    const artistsHtml = (campaign.similar_artists || []).map(a => {
        const name = typeof a === 'string' ? a : a.name;
        const img = typeof a === 'string' ? '' : (a.img || '');
        return `<div class="confirm-artist">
            ${img ? `<img src="${escapeHtml(img)}" alt="" class="confirm-artist-img" onerror="this.outerHTML='<div class=\\'confirm-artist-placeholder\\'><svg width=\\'14\\' height=\\'14\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'1.5\\'><path d=\\'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\\'/><circle cx=\\'12\\' cy=\\'7\\' r=\\'4\\'/></svg></div>'">` : `<div class="confirm-artist-placeholder"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>`}
            <span class="confirm-artist-name">${escapeHtml(name)}</span>
        </div>`;
    }).join('');

    // Fallback if similar_artists is a string
    let artistsFallback = '';
    if (!Array.isArray(campaign.similar_artists) && paymentData?.metadata?.similar_artists) {
        artistsFallback = paymentData.metadata.similar_artists.split(',').map(name =>
            `<div class="confirm-artist"><div class="confirm-artist-placeholder"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div><span class="confirm-artist-name">${escapeHtml(name.trim())}</span></div>`
        ).join('');
    }

    const overlay = document.createElement('div');
    overlay.className = 'toast-overlay';
    overlay.innerHTML = `
        <div class="confirm-box">
            <img src="https://i.ibb.co/FLyL2c8K/icon.png" alt="BeatPush" class="confirm-logo">
            <h2 class="confirm-title">Payment Successful 🎉</h2>
            <p class="confirm-subtitle">Your order has been confirmed. Our team will begin processing your campaign shortly. The average delivery time is 24–48 hours. You can track your order status anytime from your dashboard, where you will also receive the receipt and proof of delivery once the campaign is completed. Thank you for your trust. 🚀</p>

            <div class="confirm-divider"></div>

            ${campaign.track_artwork ? `
            <div class="confirm-track">
                <img src="${escapeHtml(campaign.track_artwork)}" alt="" class="confirm-track-art" onerror="this.style.display='none'">
                <div class="confirm-track-info">
                    <div class="confirm-track-title">${escapeHtml(campaign.track_title)}</div>
                    <div class="confirm-track-artist">${escapeHtml(campaign.track_artist)}</div>
                </div>
            </div>
            ` : campaign.track_title ? `
            <div class="confirm-track">
                <div class="confirm-track-info">
                    <div class="confirm-track-title">${escapeHtml(campaign.track_title)}</div>
                    <div class="confirm-track-artist">${escapeHtml(campaign.track_artist)}</div>
                </div>
            </div>
            ` : ''}

            <div class="confirm-details">
                <div class="confirm-row">
                    <span class="confirm-label">${t.campaign_summary_pack || 'Package'}</span>
                    <span class="confirm-value">${escapeHtml(packLabel)}</span>
                </div>
                ${campaign.genre ? `
                <div class="confirm-row">
                    <span class="confirm-label">Genre</span>
                    <span class="confirm-value">${escapeHtml(campaign.genre)}</span>
                </div>` : ''}
            </div>

            ${(artistsHtml || artistsFallback) ? `
            <div class="confirm-artists-section">
                <span class="confirm-label">${t.campaign_artists_label || 'Similar Artists'}</span>
                <div class="confirm-artists">${artistsHtml || artistsFallback}</div>
            </div>` : ''}

            <button class="confirm-btn">Go to Dashboard</button>
        </div>
    `;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('visible'));

    const close = () => {
        overlay.classList.remove('visible');
        setTimeout(() => {
            overlay.remove();
            window.location.href = '/dashboard';
        }, 300);
    };
    overlay.querySelector('.confirm-btn').addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
}

(function() {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    if (!sessionId) return;

    // Clean URL
    window.history.replaceState({}, '', window.location.pathname);

    // Retrieve saved campaign data
    let campaign = {};
    try {
        campaign = JSON.parse(localStorage.getItem('beatpush_pending_campaign') || '{}');
        localStorage.removeItem('beatpush_pending_campaign');
    } catch (e) {}

    fetch(`/api/checkout-success?session_id=${encodeURIComponent(sessionId)}`)
        .then(r => r.json())
        .then(data => {
            if (data.status === 'paid') {
                // Merge API metadata with local campaign data
                if (!campaign.track_title && data.metadata) {
                    campaign.track_title = data.metadata.track_title || '';
                    campaign.track_artist = data.metadata.track_artist || '';
                    campaign.pack = data.metadata.pack || '';
                    campaign.genre = data.metadata.genre || '';
                }
                // Save order to Supabase
                if (typeof saveOrderToSupabase === 'function') {
                    saveOrderToSupabase(campaign, {
                        session_id: sessionId,
                        customer_email: data.customer_email,
                        amount_total: data.amount_total,
                        currency: data.currency,
                    });
                }
                showPaymentConfirmation(campaign, data);
            } else {
                showPaymentConfirmation(campaign, data);
            }
        })
        .catch(() => {
            showPaymentConfirmation(campaign, null);
        });
})();

// ===== FAQ Toggle =====
function toggleFaq(btn) {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

    if (!isOpen) {
        item.classList.add('open');
    }
}

/* Product card info tooltip — hover on desktop, tap on mobile */
(function() {
    const isTouch = 'ontouchstart' in window;

    document.querySelectorAll('.product-card-info').forEach(btn => {
        const card = btn.closest('.product-card');

        if (!isTouch) {
            /* Desktop: hover to show, leave card to hide */
            btn.addEventListener('mouseenter', () => {
                card.classList.add('tooltip-active');
            });
            card.addEventListener('mouseleave', () => {
                card.classList.remove('tooltip-active');
            });
        }

        /* Touch & click: single tap to toggle */
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            card.classList.toggle('tooltip-active');
        });
    });
})();
