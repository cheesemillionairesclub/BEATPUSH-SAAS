// ===== Configuration =====
const SEARCH_API_URL = 'https://demo.blaron.com/search';
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
        displayDemoResults(query);
    } finally {
        hideSearchLoading();
    }
}

function displayResults(data, targetTrackId) {
    searchResults.innerHTML = '';

    // Handle blaron API response - try multiple possible structures
    let tracks = [];
    if (Array.isArray(data)) {
        tracks = data;
    } else if (data?.results) {
        tracks = Array.isArray(data.results) ? data.results : [];
    } else if (data?.tracks) {
        tracks = Array.isArray(data.tracks) ? data.tracks : [];
    } else if (data?.data) {
        tracks = Array.isArray(data.data) ? data.data : [];
    } else if (data?.items) {
        tracks = Array.isArray(data.items) ? data.items : [];
    }

    // Ensure we only show items that look like tracks
    tracks = tracks.filter(item => {
        return item.title || item.name || item.track_name;
    });

    if (!tracks.length) {
        searchResults.innerHTML = '<div class="search-empty">Aucun titre trouve sur Beatport. Essayez un autre terme.</div>';
        return;
    }

    // If we have a target track ID from URL, put it first
    if (targetTrackId) {
        tracks.sort((a, b) => {
            const aMatch = String(a.id || a.track_id || a.beatport_id) === targetTrackId;
            const bMatch = String(b.id || b.track_id || b.beatport_id) === targetTrackId;
            return bMatch - aMatch;
        });
    }

    tracks.slice(0, 10).forEach(track => {
        const title = track.title || track.name || track.track_name || 'Titre inconnu';
        const artist = track.artist || track.artist_name || track.artists?.join?.(', ') || (Array.isArray(track.artists) ? track.artists.map(a => a.name || a).join(', ') : '') || 'Artiste inconnu';
        const artwork = track.artwork_url || track.image || track.image_url || track.cover || track.artwork || track.thumbnail || track.cover_url || '';
        const id = track.id || track.track_id || track.beatport_id || '';

        const el = createTrackElement(title, artist, artwork, id);
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
        const el = createTrackElement(track.title, track.artist, track.artwork, `demo-${i}`);
        searchResults.appendChild(el);
    });
}

function createTrackElement(title, artist, artwork, id) {
    const el = document.createElement('div');
    el.className = 'track-result';

    const safeTitle = escapeHtml(title);
    const safeArtist = escapeHtml(artist);

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
        </div>
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
