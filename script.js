// ===== Configuration =====
const SEARCH_API_BASE = '/api/search';
const STRIPE_LINKS = {
    50: 'https://buy.stripe.com/test_fZu3cw2m4aBG8Di9vy2VG00',
    100: 'https://buy.stripe.com/test_dRm9AU2m4aBG2eU2362VG01',
    200: 'https://buy.stripe.com/test_8x2eVe3q8dNS7zegY02VG02',
    500: 'https://buy.stripe.com/test_eVq6oIe4Mh04g5K4be2VG03',
    1000: 'https://buy.stripe.com/test_00wdRa6Ckh04aLq5fi2VG04'
};

// ===== i18n - Full Translations =====
const translations = {
    en: {
        page_title: 'BeatPush - Beatport Promotion | Boost Your Sales',
        page_desc: 'Boost your tracks on Beatport with BeatPush. Professional promotion for DJs, producers and labels.',
        nav_how: 'HOW IT WORKS',
        nav_pricing: 'PRICING',
        nav_cta: 'BOOST MY TRACK',
        hero_badge: 'Industry-Level Promotion. Real Results.',
        hero_title: 'Professional Beatport promotion for <span class="text-gradient">DJs</span>, <span class="text-gradient">producers</span> and <span class="text-gradient">labels.</span>',
        hero_subtitle: 'For over 10 years, Beatpush has helped artists generate visibility and momentum on Beatport charts.',
        hero_cta_btn: 'GET STARTED',
        feature_no_bots: 'No Bots. No Artificial Traffic.',
        feature_scheduling: 'Custom Campaign Scheduling',
        feature_strategy: 'Chart Strategy & Insider Guidance',
        feature_guarantee: 'Money-back guarantee',
        search_badge: 'CHOOSE YOUR TRACK',
        search_title: 'Start Your Beatport Campaign <span class="text-green">Today!</span>',
        search_desc: 'Search for your track on Beatport and select it to begin.',
        search_tagline: 'No shortcuts. No automation. Just real strategy.',
        search_placeholder: 'Artist name, Beatport track url',
        search_btn: 'SEARCH',
        search_empty: 'No tracks found on Beatport. Try another search term.',
        pricing_badge: 'PRICING',
        pricing_title: 'Choose your campaign',
        pricing_desc: 'Select the number of copies to boost your track in the Beatport charts.',
        choose_btn: 'Choose',
        popular_badge: 'POPULAR',
        change_track: 'Change',
        campaign_badge: 'LET\'S GET INTO DETAILS',
        campaign_title: 'Campaign Setup',
        campaign_desc: 'Configure your campaign before launching.',
        campaign_genre_label: 'Genre',
        campaign_genre_hint: 'Confirm the genre detected for your track.',
        campaign_confirm: 'Confirm',
        campaign_confirmed: 'Confirmed',
        campaign_artists_label: 'Similar Artists',
        campaign_artists_hint: 'Enter 3 artists with a similar style to your track.',
        campaign_artists_placeholder: 'Example: Adam Port, Black Coffee, Keinemusik',
        campaign_release_label: 'Release Status',
        campaign_release_hint: 'Is your track already released or in pre-order?',
        campaign_released: 'Already Released',
        campaign_preorder: 'Pre-Order',
        campaign_launch_btn: 'Run my campaign',
        campaign_tips_title: 'Tips / Requirements',
        campaign_tip_1: 'Tracks must be new.',
        campaign_tip_2: 'The artist/label should have a store presence.',
        campaign_tip_3: 'The track should not have fallen off the official chart or genre hype.',
        campaign_tip_4: 'It must not be trending downward and should be no older than 10 days.',
        campaign_tip_5: 'Beatport Hype: We suggest subscribing to Beatport Hype and completing your Beatport Artist profile with a picture and bio.',
        campaign_tip_6: 'Chart Climbing: Climbing charts is not just about numbers; it\'s also about the quality of the music.',
        campaign_tip_7: 'Variable Promotion Periods: Every period is different, depending on the skill of the artist/label.',
        campaign_tip_8: 'Challenges at the Top: The closer you get to the top, the more challenging it becomes to move up.',
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
        how_step3_detail: 'Our team monitors the campaign daily and tracks the chart activity and visibility of the release.',
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
        why_card1_text: 'Get your track strategically pushed inside the Beatport ecosystem by experienced industry insiders. Our campaigns are designed to generate real purchases that influence the charts, helping your track gain visibility where it matters most.',
        why_card2_title: 'Transparent & Measurable Impact',
        why_card2_text: 'Every promotion is structured to create tangible chart movement. Our team understands how Beatport charts behave and deploys campaigns in a precise and strategic way to maximize impact.',
        why_card3_title: '100% Organic & Bot-Free',
        why_card3_text: 'We strictly operate without bots or artificial traffic. All campaigns rely on real buyers and organic activity, ensuring safe and credible promotion that protects your artist profile and your label reputation.',
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
    },
    fr: {
        page_title: 'BeatPush - Promotion Beatport | Boostez vos ventes',
        page_desc: 'Boostez vos tracks sur Beatport avec BeatPush. Promotion professionnelle pour DJs, producteurs et labels.',
        nav_how: 'COMMENT CA MARCHE',
        nav_pricing: 'TARIFS',
        nav_cta: 'BOOSTER MA TRACK',
        hero_badge: 'Promotion de niveau professionnel. Des résultats concrets.',
        hero_title: 'Promotion Beatport professionnelle pour <span class="text-gradient">DJs</span>, <span class="text-gradient">producteurs</span> et <span class="text-gradient">labels.</span>',
        hero_subtitle: 'Depuis plus de 10 ans, Beatpush aide les artistes \u00e0 g\u00e9n\u00e9rer de la visibilit\u00e9 et de l\'\u00e9lan sur les charts Beatport.',
        hero_cta_btn: 'COMMENCER',
        feature_no_bots: 'Pas de bots. Pas de trafic artificiel.',
        feature_scheduling: 'Planification de campagne personnalis\u00e9e',
        feature_strategy: 'Strat\u00e9gie de charts & conseils d\'initi\u00e9s',
        feature_guarantee: 'Garantie satisfait ou rembours\u00e9',
        search_badge: 'CHOISISSEZ VOTRE TRACK',
        search_title: 'Lancez votre campagne Beatport <span class="text-green">aujourd\'hui</span>',
        search_desc: 'Recherchez votre morceau sur Beatport et s\u00e9lectionnez-le pour commencer.',
        search_tagline: 'Pas de raccourcis. Pas d\'automatisation. Juste de la vraie strat\u00e9gie.',
        search_placeholder: 'Nom d\'artiste, URL de track Beatport',
        search_btn: 'RECHERCHER',
        search_empty: 'Aucun titre trouv\u00e9 sur Beatport. Essayez un autre terme.',
        pricing_badge: 'TARIFS',
        pricing_title: 'Choisissez votre pack',
        pricing_desc: 'S\u00e9lectionnez le nombre de copies pour booster votre track dans les charts.',
        choose_btn: 'Choisir',
        popular_badge: 'POPULAIRE',
        change_track: 'Changer',
        campaign_badge: 'ENTRONS DANS LES D\u00c9TAILS',
        campaign_title: 'Param\u00e9trage de la campagne',
        campaign_desc: 'Configurez votre campagne avant de la lancer.',
        campaign_genre_label: 'Genre',
        campaign_genre_hint: 'Confirmez le genre d\u00e9tect\u00e9 pour votre track.',
        campaign_confirm: 'Confirmer',
        campaign_confirmed: 'Confirm\u00e9',
        campaign_artists_label: 'Artistes similaires',
        campaign_artists_hint: 'Entrez 3 artistes au style similaire \u00e0 votre track.',
        campaign_artists_placeholder: 'Exemple : Adam Port, Black Coffee, Keinemusik',
        campaign_release_label: 'Statut de la sortie',
        campaign_release_hint: 'Votre track est-elle d\u00e9j\u00e0 sortie ou en pr\u00e9-commande ?',
        campaign_released: 'D\u00e9j\u00e0 sortie',
        campaign_preorder: 'Pr\u00e9-commande',
        campaign_launch_btn: 'Lancer ma campagne',
        campaign_tips_title: 'Conseils / Pr\u00e9requis',
        campaign_tip_1: 'Les tracks doivent \u00eatre r\u00e9centes.',
        campaign_tip_2: 'L\'artiste/label doit avoir une pr\u00e9sence en store.',
        campaign_tip_3: 'La track ne doit pas avoir quitt\u00e9 le classement officiel ou le genre hype.',
        campaign_tip_4: 'Elle ne doit pas \u00eatre en tendance baissi\u00e8re et ne doit pas avoir plus de 10 jours.',
        campaign_tip_5: 'Beatport Hype : Nous sugg\u00e9rons de s\'abonner \u00e0 Beatport Hype et de compl\u00e9ter votre profil artiste Beatport avec une photo et une bio.',
        campaign_tip_6: 'Progression dans les charts : Grimper dans les charts n\'est pas seulement une question de chiffres, c\'est aussi la qualit\u00e9 de la musique.',
        campaign_tip_7: 'P\u00e9riodes de promotion variables : Chaque p\u00e9riode est diff\u00e9rente, selon le niveau de l\'artiste/label.',
        campaign_tip_8: 'D\u00e9fis au sommet : Plus vous vous approchez du top, plus il est difficile de progresser.',
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
        how_step3_detail: 'Notre \u00e9quipe surveille la campagne quotidiennement et suit l\'activit\u00e9 des charts et la visibilit\u00e9 de la sortie.',
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
        why_card1_text: 'Votre track est strat\u00e9giquement pouss\u00e9e dans l\'\u00e9cosyst\u00e8me Beatport par des initi\u00e9s exp\u00e9riment\u00e9s. Nos campagnes g\u00e9n\u00e8rent de vrais achats qui influencent les charts, aidant votre track \u00e0 gagner en visibilit\u00e9 l\u00e0 o\u00f9 \u00e7a compte.',
        why_card2_title: 'Impact transparent et mesurable',
        why_card2_text: 'Chaque promotion est structur\u00e9e pour cr\u00e9er un mouvement tangible dans les charts. Notre \u00e9quipe comprend le fonctionnement des charts Beatport et d\u00e9ploie les campagnes de mani\u00e8re pr\u00e9cise et strat\u00e9gique.',
        why_card3_title: '100% organique et sans bots',
        why_card3_text: 'Nous op\u00e9rons strictement sans bots ni trafic artificiel. Toutes nos campagnes reposent sur de vrais acheteurs et une activit\u00e9 organique, assurant une promotion s\u00fbre et cr\u00e9dible qui prot\u00e8ge votre profil d\'artiste et la r\u00e9putation de votre label.',
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
    },
    pt: {
        page_title: 'BeatPush - Promo\u00e7\u00e3o Beatport | Impulsione suas vendas',
        page_desc: 'Impulsione suas tracks no Beatport com o BeatPush. Promo\u00e7\u00e3o profissional para DJs, produtores e labels.',
        nav_how: 'COMO FUNCIONA',
        nav_pricing: 'PRE\u00c7OS',
        nav_cta: 'IMPULSIONAR MINHA TRACK',
        hero_badge: 'Promo\u00e7\u00e3o de n\u00edvel profissional. Resultados reais.',
        hero_title: 'Promo\u00e7\u00e3o profissional no Beatport para <span class="text-gradient">DJs</span>, <span class="text-gradient">produtores</span> e <span class="text-gradient">labels.</span>',
        hero_subtitle: 'H\u00e1 mais de 10 anos, a Beatpush ajuda artistas a gerar visibilidade e impulso nos charts do Beatport.',
        hero_cta_btn: 'COME\u00c7AR',
        feature_no_bots: 'Sem bots. Sem tr\u00e1fego artificial.',
        feature_scheduling: 'Agendamento de campanha personalizado',
        feature_strategy: 'Estrat\u00e9gia de charts e orienta\u00e7\u00e3o privilegiada',
        feature_guarantee: 'Garantia de devolu\u00e7\u00e3o',
        search_badge: 'ESCOLHA SUA TRACK',
        search_title: 'Inicie sua campanha Beatport <span class="text-green">hoje</span>',
        search_desc: 'Pesquise sua m\u00fasica no Beatport e selecione para come\u00e7ar.',
        search_tagline: 'Sem atalhos. Sem automa\u00e7\u00e3o. Apenas estrat\u00e9gia real.',
        search_placeholder: 'Nome do artista, URL da track no Beatport',
        search_btn: 'PESQUISAR',
        search_empty: 'Nenhuma track encontrada no Beatport. Tente outro termo.',
        pricing_badge: 'PRE\u00c7OS',
        pricing_title: 'Escolha seu pacote',
        pricing_desc: 'Selecione o n\u00famero de c\u00f3pias para impulsionar sua track nos charts.',
        choose_btn: 'Escolher',
        popular_badge: 'POPULAR',
        change_track: 'Alterar',
        campaign_badge: 'VAMOS AOS DETALHES',
        campaign_title: 'Configura\u00e7\u00e3o da campanha',
        campaign_desc: 'Configure sua campanha antes de lan\u00e7ar.',
        campaign_genre_label: 'G\u00eanero',
        campaign_genre_hint: 'Confirme o g\u00eanero detectado para sua track.',
        campaign_confirm: 'Confirmar',
        campaign_confirmed: 'Confirmado',
        campaign_artists_label: 'Artistas similares',
        campaign_artists_hint: 'Insira 3 artistas com estilo similar ao da sua track.',
        campaign_artists_placeholder: 'Exemplo: Adam Port, Black Coffee, Keinemusik',
        campaign_release_label: 'Status do lan\u00e7amento',
        campaign_release_hint: 'Sua track j\u00e1 foi lan\u00e7ada ou est\u00e1 em pr\u00e9-venda?',
        campaign_released: 'J\u00e1 lan\u00e7ada',
        campaign_preorder: 'Pr\u00e9-venda',
        campaign_launch_btn: 'Lan\u00e7ar minha campanha',
        campaign_tips_title: 'Dicas / Requisitos',
        campaign_tip_1: 'As tracks devem ser novas.',
        campaign_tip_2: 'O artista/label deve ter presen\u00e7a na loja.',
        campaign_tip_3: 'A track n\u00e3o deve ter sa\u00eddo do chart oficial ou do g\u00eanero hype.',
        campaign_tip_4: 'N\u00e3o deve estar em tend\u00eancia de queda e n\u00e3o deve ter mais de 10 dias.',
        campaign_tip_5: 'Beatport Hype: Sugerimos assinar o Beatport Hype e completar seu perfil de artista com foto e bio.',
        campaign_tip_6: 'Subida nos Charts: Subir nos charts n\u00e3o \u00e9 apenas sobre n\u00fameros; \u00e9 tamb\u00e9m sobre a qualidade da m\u00fasica.',
        campaign_tip_7: 'Per\u00edodos de Promo\u00e7\u00e3o Vari\u00e1veis: Cada per\u00edodo \u00e9 diferente, dependendo da habilidade do artista/label.',
        campaign_tip_8: 'Desafios no Topo: Quanto mais perto do topo, mais dif\u00edcil se torna subir.',
        campaign_validate_genre: 'Por favor, confirme o g\u00eanero da sua track antes de lan\u00e7ar.',
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
        how_step3_detail: 'Nossa equipe monitora a campanha diariamente e acompanha a atividade dos charts.',
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
        why_card1_text: 'Sua track \u00e9 estrategicamente impulsionada dentro do ecossistema Beatport por insiders experientes. Nossas campanhas geram compras reais que influenciam os charts.',
        why_card2_title: 'Impacto transparente e mensur\u00e1vel',
        why_card2_text: 'Cada promo\u00e7\u00e3o \u00e9 estruturada para criar movimento tang\u00edvel nos charts. Nossa equipe entende como os charts Beatport funcionam e implanta campanhas de forma precisa e estrat\u00e9gica.',
        why_card3_title: '100% org\u00e2nico e sem bots',
        why_card3_text: 'Operamos estritamente sem bots ou tr\u00e1fego artificial. Todas as campanhas dependem de compradores reais e atividade org\u00e2nica, garantindo uma promo\u00e7\u00e3o segura e cred\u00edvel.',
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
    },
    es: {
        page_title: 'BeatPush - Promoci\u00f3n Beatport | Impulsa tus ventas',
        page_desc: 'Impulsa tus tracks en Beatport con BeatPush. Promoci\u00f3n profesional para DJs, productores y sellos.',
        nav_how: 'C\u00d3MO FUNCIONA',
        nav_pricing: 'PRECIOS',
        nav_cta: 'IMPULSAR MI TRACK',
        hero_badge: 'Promoci\u00f3n de nivel profesional. Resultados reales.',
        hero_title: 'Promoci\u00f3n profesional en Beatport para <span class="text-gradient">DJs</span>, <span class="text-gradient">productores</span> y <span class="text-gradient">sellos.</span>',
        hero_subtitle: 'Desde hace m\u00e1s de 10 a\u00f1os, Beatpush ayuda a los artistas a generar visibilidad e impulso en los charts de Beatport.',
        hero_cta_btn: 'EMPEZAR',
        feature_no_bots: 'Sin bots. Sin tr\u00e1fico artificial.',
        feature_scheduling: 'Programaci\u00f3n de campa\u00f1a personalizada',
        feature_strategy: 'Estrategia de charts y gu\u00eda privilegiada',
        feature_guarantee: 'Garant\u00eda de devoluci\u00f3n',
        search_badge: 'ELIGE TU TRACK',
        search_title: 'Inicia tu campa\u00f1a Beatport <span class="text-green">hoy</span>',
        search_desc: 'Busca tu track en Beatport y selecci\u00f3nala para comenzar.',
        search_tagline: 'Sin atajos. Sin automatizaci\u00f3n. Solo estrategia real.',
        search_placeholder: 'Nombre del artista, URL de track en Beatport',
        search_btn: 'BUSCAR',
        search_empty: 'No se encontraron tracks en Beatport. Prueba con otro t\u00e9rmino.',
        pricing_badge: 'PRECIOS',
        pricing_title: 'Elige tu pack',
        pricing_desc: 'Selecciona el n\u00famero de copias para impulsar tu track en los charts.',
        choose_btn: 'Elegir',
        popular_badge: 'POPULAR',
        change_track: 'Cambiar',
        campaign_badge: 'ENTREMOS EN DETALLES',
        campaign_title: 'Configuraci\u00f3n de la campa\u00f1a',
        campaign_desc: 'Configura tu campa\u00f1a antes de lanzarla.',
        campaign_genre_label: 'G\u00e9nero',
        campaign_genre_hint: 'Confirma el g\u00e9nero detectado para tu track.',
        campaign_confirm: 'Confirmar',
        campaign_confirmed: 'Confirmado',
        campaign_artists_label: 'Artistas similares',
        campaign_artists_hint: 'Ingresa 3 artistas con estilo similar al de tu track.',
        campaign_artists_placeholder: 'Ejemplo: Adam Port, Black Coffee, Keinemusik',
        campaign_release_label: 'Estado del lanzamiento',
        campaign_release_hint: '\u00bfTu track ya fue lanzada o est\u00e1 en preventa?',
        campaign_released: 'Ya lanzada',
        campaign_preorder: 'Preventa',
        campaign_launch_btn: 'Lanzar mi campa\u00f1a',
        campaign_tips_title: 'Consejos / Requisitos',
        campaign_tip_1: 'Las tracks deben ser nuevas.',
        campaign_tip_2: 'El artista/sello debe tener presencia en la tienda.',
        campaign_tip_3: 'La track no debe haber ca\u00eddo del chart oficial o del g\u00e9nero hype.',
        campaign_tip_4: 'No debe estar en tendencia a la baja y no debe tener m\u00e1s de 10 d\u00edas.',
        campaign_tip_5: 'Beatport Hype: Sugerimos suscribirse a Beatport Hype y completar tu perfil de artista con foto y bio.',
        campaign_tip_6: 'Subida en Charts: Subir en los charts no es solo cuesti\u00f3n de n\u00fameros; tambi\u00e9n se trata de la calidad de la m\u00fasica.',
        campaign_tip_7: 'Per\u00edodos de Promoci\u00f3n Variables: Cada per\u00edodo es diferente, dependiendo de la habilidad del artista/sello.',
        campaign_tip_8: 'Desaf\u00edos en la Cima: Cuanto m\u00e1s te acercas al top, m\u00e1s dif\u00edcil es subir.',
        campaign_validate_genre: 'Por favor, confirma el g\u00e9nero de tu track antes de lanzar.',
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
        how_step3_detail: 'Nuestro equipo monitorea la campa\u00f1a diariamente y rastrea la actividad de los charts.',
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
        why_card1_text: 'Tu track es estrat\u00e9gicamente impulsada dentro del ecosistema Beatport por insiders experimentados. Nuestras campa\u00f1as generan compras reales que influyen en los charts.',
        why_card2_title: 'Impacto transparente y medible',
        why_card2_text: 'Cada promoci\u00f3n est\u00e1 estructurada para crear movimiento tangible en los charts. Nuestro equipo despliega campa\u00f1as de manera precisa y estrat\u00e9gica.',
        why_card3_title: '100% org\u00e1nico y sin bots',
        why_card3_text: 'Operamos estrictamente sin bots ni tr\u00e1fico artificial. Todas las campa\u00f1as dependen de compradores reales y actividad org\u00e1nica, asegurando una promoci\u00f3n segura y cre\u00edble.',
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
    },
    de: {
        page_title: 'BeatPush - Beatport Promotion | Steigere deine Verk\u00e4ufe',
        page_desc: 'Booste deine Tracks auf Beatport mit BeatPush. Professionelle Promotion f\u00fcr DJs, Produzenten und Labels.',
        nav_how: 'WIE ES FUNKTIONIERT',
        nav_pricing: 'PREISE',
        nav_cta: 'MEINEN TRACK BOOSTEN',
        hero_badge: 'Promotion auf Branchenniveau. Echte Ergebnisse.',
        hero_title: 'Professionelle Beatport-Promotion f\u00fcr <span class="text-gradient">DJs</span>, <span class="text-gradient">Produzenten</span> und <span class="text-gradient">Labels.</span>',
        hero_subtitle: 'Seit \u00fcber 10 Jahren hilft Beatpush K\u00fcnstlern, Sichtbarkeit und Dynamik in den Beatport-Charts zu erzeugen.',
        hero_cta_btn: 'JETZT STARTEN',
        feature_no_bots: 'Keine Bots. Kein k\u00fcnstlicher Traffic.',
        feature_scheduling: 'Individuelle Kampagnenplanung',
        feature_strategy: 'Chart-Strategie & Insider-Beratung',
        feature_guarantee: 'Geld-zur\u00fcck-Garantie',
        search_badge: 'W\u00c4HLE DEINEN TRACK',
        search_title: 'Starte deine Beatport-Kampagne <span class="text-green">heute</span>',
        search_desc: 'Suche deinen Track auf Beatport und w\u00e4hle ihn aus, um zu starten.',
        search_tagline: 'Keine Abk\u00fcrzungen. Keine Automatisierung. Nur echte Strategie.',
        search_placeholder: 'K\u00fcnstlername, Beatport-Track-URL',
        search_btn: 'SUCHEN',
        search_empty: 'Keine Tracks auf Beatport gefunden. Versuche einen anderen Suchbegriff.',
        pricing_badge: 'PREISE',
        pricing_title: 'W\u00e4hle dein Paket',
        pricing_desc: 'W\u00e4hle die Anzahl der Kopien, um deinen Track in den Charts zu boosten.',
        choose_btn: 'W\u00e4hlen',
        popular_badge: 'BELIEBT',
        change_track: '\u00c4ndern',
        campaign_badge: 'AB IN DIE DETAILS',
        campaign_title: 'Kampagnen-Einrichtung',
        campaign_desc: 'Konfiguriere deine Kampagne vor dem Start.',
        campaign_genre_label: 'Genre',
        campaign_genre_hint: 'Best\u00e4tige das erkannte Genre deines Tracks.',
        campaign_confirm: 'Best\u00e4tigen',
        campaign_confirmed: 'Best\u00e4tigt',
        campaign_artists_label: '\u00c4hnliche K\u00fcnstler',
        campaign_artists_hint: 'Gib 3 K\u00fcnstler mit \u00e4hnlichem Stil wie dein Track ein.',
        campaign_artists_placeholder: 'Beispiel: Adam Port, Black Coffee, Keinemusik',
        campaign_release_label: 'Ver\u00f6ffentlichungsstatus',
        campaign_release_hint: 'Ist dein Track bereits ver\u00f6ffentlicht oder in Vorbestellung?',
        campaign_released: 'Bereits ver\u00f6ffentlicht',
        campaign_preorder: 'Vorbestellung',
        campaign_launch_btn: 'Meine Kampagne starten',
        campaign_tips_title: 'Tipps / Anforderungen',
        campaign_tip_1: 'Tracks m\u00fcssen neu sein.',
        campaign_tip_2: 'Der K\u00fcnstler/das Label sollte eine Store-Pr\u00e4senz haben.',
        campaign_tip_3: 'Der Track darf nicht aus dem offiziellen Chart oder Genre-Hype gefallen sein.',
        campaign_tip_4: 'Er darf keinen Abw\u00e4rtstrend zeigen und nicht \u00e4lter als 10 Tage sein.',
        campaign_tip_5: 'Beatport Hype: Wir empfehlen, Beatport Hype zu abonnieren und dein Beatport-K\u00fcnstlerprofil mit Bild und Bio zu vervollst\u00e4ndigen.',
        campaign_tip_6: 'Chart-Aufstieg: Charts zu erklimmen ist nicht nur eine Frage der Zahlen, sondern auch der Qualit\u00e4t der Musik.',
        campaign_tip_7: 'Variable Promotionszeitr\u00e4ume: Jeder Zeitraum ist anders, abh\u00e4ngig vom K\u00f6nnen des K\u00fcnstlers/Labels.',
        campaign_tip_8: 'Herausforderungen an der Spitze: Je n\u00e4her du dem Top kommst, desto schwieriger wird es aufzusteigen.',
        campaign_validate_genre: 'Bitte best\u00e4tige das Genre deines Tracks vor dem Start.',
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
        how_step3_detail: 'Unser Team \u00fcberwacht die Kampagne t\u00e4glich und verfolgt die Chart-Aktivit\u00e4t.',
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
        why_card1_text: 'Dein Track wird strategisch im Beatport-\u00d6kosystem von erfahrenen Brancheninsidern gepusht. Unsere Kampagnen generieren echte K\u00e4ufe, die die Charts beeinflussen.',
        why_card2_title: 'Transparenter & messbarer Impact',
        why_card2_text: 'Jede Promotion ist strukturiert, um greifbare Chart-Bewegung zu erzeugen. Unser Team versteht, wie Beatport-Charts funktionieren und setzt Kampagnen pr\u00e4zise und strategisch ein.',
        why_card3_title: '100% organisch & botfrei',
        why_card3_text: 'Wir arbeiten strikt ohne Bots oder k\u00fcnstlichen Traffic. Alle Kampagnen basieren auf echten K\u00e4ufern und organischer Aktivit\u00e4t, was sichere und glaubw\u00fcrdige Promotion gew\u00e4hrleistet.',
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
            try {
                const response = await fetch(`${SEARCH_API_BASE}?q=${encodeURIComponent(query)}&type=artist`);
                if (!response.ok) throw new Error('API error');
                const data = await response.json();
                renderArtistResults(data);
            } catch (err) {
                console.error('Artist search error:', err);
                artistResults.classList.remove('visible');
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
        const img = artist.image || artist.artwork || artist.thumb || '';
        const id = artist.id || name;
        return `<div class="artist-result-item" data-name="${typeof name === 'string' ? name.replace(/"/g, '&quot;') : name}" data-id="${id}">
            ${img ? `<img src="${img}" alt="" onerror="this.remove()">` : ''}
            <span>${typeof name === 'string' ? name : name}</span>
        </div>`;
    }).join('');
    artistResults.classList.add('visible');

    artistResults.querySelectorAll('.artist-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const name = item.dataset.name;
            if (!selectedArtists.includes(name)) {
                selectedArtists.push(name);
                renderArtistTags();
            }
            artistInput.value = '';
            artistResults.classList.remove('visible');
        });
    });
}

function renderArtistTags() {
    artistTagsContainer.innerHTML = selectedArtists.map((name, i) => `
        <span class="artist-tag">
            ${name}
            <button class="artist-tag-remove" data-index="${i}" type="button">&times;</button>
        </span>
    `).join('');

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

        const response = await fetch(`${SEARCH_API_BASE}?q=${encodeURIComponent(searchQuery)}&type=track`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
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

    let tracks = Array.isArray(data) ? data : [];
    tracks = tracks.filter(item => item.title);

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
        const title = track.title;
        const artist = Array.isArray(track.artists) ? track.artists.join(', ') : 'Unknown artist';
        const artwork = track.image_url || '';
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
                        <span class="campaign-summary-value">${pack} ${t.campaign_summary_copies || 'copies'}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Set genre from selected track
    const genreTag = document.getElementById('campaignGenreTag');
    if (genreTag) {
        genreTag.textContent = selectedTrack && selectedTrack.genre ? selectedTrack.genre : '--';
    }

    // Reset confirm button
    const confirmBtn = document.getElementById('genreConfirmBtn');
    if (confirmBtn) {
        confirmBtn.textContent = t.campaign_confirm || 'Confirm';
        confirmBtn.classList.remove('confirmed');
        confirmBtn.disabled = false;
    }

    // Scroll to campaign setup
    setTimeout(() => {
        campaignSetup.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// Genre confirm button
document.getElementById('genreConfirmBtn').addEventListener('click', function() {
    genreConfirmed = true;
    this.classList.add('confirmed');
    const lang = detectLanguage();
    const t = translations[lang] || translations.en;
    this.textContent = t.campaign_confirmed || 'Confirmed';
    this.disabled = true;
});

// Tips toggle
document.getElementById('tipsToggle').addEventListener('click', function() {
    this.closest('.campaign-tips').classList.toggle('open');
});

// Launch campaign button
document.getElementById('launchCampaignBtn').addEventListener('click', function() {
    if (!selectedPack || !STRIPE_LINKS[selectedPack]) return;

    const lang = detectLanguage();
    const t = translations[lang] || translations.en;

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

    // Redirect to Stripe
    window.open(STRIPE_LINKS[selectedPack], '_blank');
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

// ===== FAQ Toggle =====
function toggleFaq(btn) {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

    if (!isOpen) {
        item.classList.add('open');
    }
}
