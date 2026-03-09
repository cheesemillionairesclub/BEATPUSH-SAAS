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
    }
};

function detectLanguage() {
    const lang = navigator.language || navigator.userLanguage || 'fr';
    return lang.startsWith('fr') ? 'fr' : 'en';
}

function applyTranslations() {
    const lang = detectLanguage();
    if (lang === 'fr') return; // French is the default in HTML

    document.documentElement.lang = 'en';
    const t = translations.en;

    // data-i18n: textContent
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
    });

    // data-i18n-html: innerHTML (for <br>, <span>, &copy; etc.)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (t[key]) el.innerHTML = t[key];
    });

    // data-i18n-placeholder: placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) el.placeholder = t[key];
    });

    // data-i18n-content: content attribute (meta tags)
    document.querySelectorAll('[data-i18n-content]').forEach(el => {
        const key = el.getAttribute('data-i18n-content');
        if (t[key]) el.setAttribute('content', t[key]);
    });

    // Update page title
    if (t.page_title) document.title = t.page_title;
}

// Apply translations as soon as possible
applyTranslations();

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
        const emptyMsg = (detectLanguage() === 'en' && translations.en.search_empty) || 'Aucun titre trouve sur Beatport. Essayez un autre terme.';
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
