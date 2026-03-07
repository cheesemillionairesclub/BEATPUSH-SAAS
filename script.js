// ===== Configuration =====
const SONGSTATS_API_URL = 'https://songstats.p.rapidapi.com/tracks/info';
const SONGSTATS_SEARCH_URL = 'https://songstats.p.rapidapi.com/tracks/search';
const RAPIDAPI_HOST = 'songstats.p.rapidapi.com';
const RAPIDAPI_KEY = '4f41195243msh1e5dfd2b32f0e06p1926d0jsn02b5ab26286c';
const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/test_eVq28tdkwgOre3xbwS0RG00';

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

// ===== Track Search =====
searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

// Debounced auto-search
searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    const query = searchInput.value.trim();
    if (query.length >= 3) {
        searchTimeout = setTimeout(performSearch, 600);
    } else {
        searchResults.innerHTML = '';
    }
});

async function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    const btnText = searchBtn.querySelector('.search-btn-text');
    const spinner = searchBtn.querySelector('.search-spinner');

    btnText.style.display = 'none';
    spinner.style.display = 'block';
    searchBtn.disabled = true;

    try {
        const response = await fetch(`${SONGSTATS_SEARCH_URL}?q=${encodeURIComponent(query)}&source=beatport`, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': RAPIDAPI_HOST,
                'x-rapidapi-key': RAPIDAPI_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        displayResults(data);
    } catch (error) {
        console.error('Search error:', error);
        // Show demo results as fallback
        displayDemoResults(query);
    } finally {
        btnText.style.display = 'inline';
        spinner.style.display = 'none';
        searchBtn.disabled = false;
    }
}

function displayResults(data) {
    searchResults.innerHTML = '';

    const tracks = data?.results || data?.tracks || data?.data || [];

    if (!tracks.length) {
        searchResults.innerHTML = '<div class="search-empty">Aucun resultat trouve. Essayez un autre terme de recherche.</div>';
        return;
    }

    tracks.slice(0, 10).forEach(track => {
        const title = track.title || track.name || 'Titre inconnu';
        const artist = track.artist || track.artists?.join(', ') || 'Artiste inconnu';
        const artwork = track.artwork_url || track.image || track.cover || '';
        const id = track.id || track.track_id || '';

        const el = createTrackElement(title, artist, artwork, id);
        searchResults.appendChild(el);
    });
}

function displayDemoResults(query) {
    searchResults.innerHTML = '';

    const demoTracks = [
        { title: `${query} (Original Mix)`, artist: 'Various Artists', artwork: '' },
        { title: `${query} - Extended Mix`, artist: 'DJ Producer', artwork: '' },
        { title: `${query} (Remix)`, artist: 'Top Artist', artwork: '' },
    ];

    demoTracks.forEach((track, i) => {
        const el = createTrackElement(track.title, track.artist, track.artwork, `demo-${i}`);
        searchResults.appendChild(el);
    });
}

function createTrackElement(title, artist, artwork, id) {
    const el = document.createElement('div');
    el.className = 'track-result';
    el.innerHTML = `
        <div class="track-art">
            ${artwork ? `<img src="${artwork}" alt="${title}" onerror="this.parentElement.innerHTML='<div style=\\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.3);font-size:20px\\'>♪</div>'">` : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.3);font-size:20px">♪</div>'}
        </div>
        <div class="track-info">
            <div class="track-title">${escapeHtml(title)}</div>
            <div class="track-artist">${escapeHtml(artist)}</div>
        </div>
        <button class="track-select-btn">Selectionner</button>
    `;

    el.addEventListener('click', () => {
        selectTrack(title, artist, artwork, id);
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
        ? `<img src="${artwork}" alt="${escapeHtml(title)}" style="width:100%;height:100%;object-fit:cover;">`
        : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.3);font-size:24px">♪</div>';
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
