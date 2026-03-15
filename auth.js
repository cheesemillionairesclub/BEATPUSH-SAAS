// ===== BeatPush Auth UI & Dashboard =====

(function () {
    'use strict';

    // ===== Auth UI =====
    function updateAuthUI(user) {
        const loginBtn = document.getElementById('authLoginBtn');
        const userMenu = document.getElementById('authUserMenu');
        const avatarImg = document.getElementById('authAvatarImg');
        const dropdownAvatar = document.getElementById('authDropdownAvatar');
        const dropdownName = document.getElementById('authDropdownName');
        const dropdownEmail = document.getElementById('authDropdownEmail');
        const adminBtn = document.getElementById('authAdminBtn');

        if (!loginBtn || !userMenu) return;

        if (user) {
            const meta = user.user_metadata || {};
            const avatarUrl = meta.avatar_url || meta.picture || '';
            const fullName = meta.full_name || meta.name || user.email || '';

            loginBtn.style.display = 'none';
            userMenu.style.display = 'block';
            if (avatarImg) avatarImg.src = avatarUrl;
            if (dropdownAvatar) dropdownAvatar.src = avatarUrl;
            if (dropdownName) dropdownName.textContent = fullName;
            if (dropdownEmail) dropdownEmail.textContent = user.email || '';

            // Show dashboard nav link for logged-in users
            const dashNavItem = document.querySelector('.nav-dashboard-item');
            if (dashNavItem) dashNavItem.style.display = '';

            // Check admin status
            checkAdminStatus(user, adminBtn);
        } else {
            loginBtn.style.display = '';
            userMenu.style.display = 'none';

            // Hide dashboard nav link
            const dashNavItem = document.querySelector('.nav-dashboard-item');
            if (dashNavItem) dashNavItem.style.display = 'none';
        }
    }

    async function checkAdminStatus(user, adminBtn) {
        if (!adminBtn) return;
        try {
            const profile = await BeatpushAuth.getProfile();
            if (profile && profile.is_admin) {
                adminBtn.style.display = '';
            }
        } catch (e) { /* not admin */ }
    }

    // ===== Avatar dropdown toggle =====
    function setupAuthDropdown() {
        const avatarBtn = document.getElementById('authAvatarBtn');
        const dropdown = document.getElementById('authDropdown');
        if (!avatarBtn || !dropdown) return;

        avatarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && e.target !== avatarBtn) {
                dropdown.classList.remove('open');
            }
        });
    }

    // ===== Auth event handlers =====
    function setupAuthEvents() {
        const loginBtn = document.getElementById('authLoginBtn');
        const logoutBtn = document.getElementById('authLogoutBtn');
        const dashboardBtn = document.getElementById('authDashboardBtn');
        const adminBtn = document.getElementById('authAdminBtn');

        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                BeatpushAuth.signInWithGoogle(window.location.href);
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                await BeatpushAuth.signOut();
                document.getElementById('authDropdown')?.classList.remove('open');
                window.location.href = '/';
            });
        }

        if (dashboardBtn) {
            dashboardBtn.addEventListener('click', () => {
                document.getElementById('authDropdown')?.classList.remove('open');
                window.location.href = '/dashboard';
            });
        }

        if (adminBtn) {
            adminBtn.addEventListener('click', () => {
                document.getElementById('authDropdown')?.classList.remove('open');
                window.open('/admin.html', '_blank');
            });
        }
    }

    // ===== Payment Gate =====
    // This function is called before payment actions
    // Returns true if user is logged in, otherwise triggers login
    window.requireAuth = function (returnAction) {
        const user = BeatpushAuth.getUser();
        if (user) return true;

        // Save the action to perform after login
        if (returnAction) {
            localStorage.setItem('beatpush_auth_redirect', returnAction);
        }
        // Save campaign state so it can be restored after OAuth redirect
        localStorage.setItem('beatpush_auth_pending_action', 'payment');
        try {
            if (typeof selectedTrack !== 'undefined' && selectedTrack) {
                localStorage.setItem('beatpush_pending_track', JSON.stringify(selectedTrack));
            }
            if (typeof selectedPack !== 'undefined' && selectedPack) {
                localStorage.setItem('beatpush_pending_pack', selectedPack);
            }
            if (typeof selectedArtists !== 'undefined' && selectedArtists.length) {
                localStorage.setItem('beatpush_pending_artists', JSON.stringify(selectedArtists));
            }
        } catch (e) {}

        // Show login prompt
        showLoginPrompt();
        return false;
    };

    function showLoginPrompt() {
        const existing = document.querySelector('.toast-overlay.auth-prompt');
        if (existing) existing.remove();

        const lang = typeof detectLanguage === 'function' ? detectLanguage() : 'en';
        const t = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang] : {};

        const overlay = document.createElement('div');
        overlay.className = 'toast-overlay auth-prompt';
        overlay.innerHTML = `
            <div class="toast-box auth-prompt-box">
                <div class="toast-icon">
                    <img src="https://i.ibb.co/nMjbdTkQ/White-and-Black-Modern-Initial-B-Logo-5000-x-5000-px-1.png" alt="BeatPush" class="toast-logo">
                </div>
                <h3 class="auth-prompt-title">${t.auth_prompt_title || 'Sign in to continue'}</h3>
                <p class="auth-prompt-text">${t.auth_prompt_text || 'Please sign in with your Google account to proceed with your campaign.'}</p>
                <button class="btn-primary auth-google-btn" id="authPromptGoogleBtn">
                    <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    ${t.auth_google_btn || 'Sign in with Google'}
                </button>
                <button class="toast-close auth-prompt-cancel">${t.auth_cancel || 'Cancel'}</button>
            </div>
        `;

        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('visible'));

        overlay.querySelector('#authPromptGoogleBtn').addEventListener('click', () => {
            BeatpushAuth.signInWithGoogle(window.location.href);
        });

        const close = () => {
            overlay.classList.remove('visible');
            setTimeout(() => overlay.remove(), 300);
            localStorage.removeItem('beatpush_auth_pending_action');
        };

        overlay.querySelector('.auth-prompt-cancel').addEventListener('click', close);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    }

    // ===== Save order after payment =====
    window.saveOrderToSupabase = async function (campaign, paymentData) {
        const user = BeatpushAuth.getUser();
        if (!user) return;

        try {
            await fetch('/api/save-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.id,
                    stripe_session_id: paymentData?.session_id || '',
                    customer_email: paymentData?.customer_email || user.email,
                    pack: campaign.pack || '',
                    amount: paymentData?.amount_total || 0,
                    currency: paymentData?.currency || 'usd',
                    track_title: campaign.track_title || '',
                    track_artist: campaign.track_artist || '',
                    track_artwork: campaign.track_artwork || '',
                    track_url: campaign.track_url || '',
                    genre: campaign.genre || '',
                    similar_artists: campaign.similar_artists || [],
                    release_status: campaign.release_status || '',
                }),
            });
        } catch (e) {
            console.error('[BeatPush] Failed to save order:', e);
        }
    };

    // ===== Detect and send user meta (country via IP + device type) =====
    async function sendUserMeta() {
        const token = BeatpushAuth.getToken();
        if (!token) return;

        // Detect device type
        const ua = navigator.userAgent || '';
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
        const device_type = isMobile ? 'mobile' : 'desktop';

        try {
            await fetch('/api/update-user-meta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ device_type }),
            });
        } catch (e) {
            console.error('[BeatPush] Failed to update user meta:', e);
        }
    }

    // ===== Initialization =====
    async function initAuth() {
        setupAuthDropdown();
        setupAuthEvents();

        const user = await BeatpushAuth.init();
        updateAuthUI(user);

        BeatpushAuth.onAuthChange(updateAuthUI);

        // After login: send user meta (country + device)
        if (user) {
            sendUserMeta();

            const pendingAction = localStorage.getItem('beatpush_auth_pending_action');
            if (pendingAction === 'payment') {
                localStorage.removeItem('beatpush_auth_pending_action');

                // Restore campaign state saved before OAuth redirect
                try {
                    const savedTrack = localStorage.getItem('beatpush_pending_track');
                    const savedPack = localStorage.getItem('beatpush_pending_pack');
                    const savedArtists = localStorage.getItem('beatpush_pending_artists');

                    if (savedTrack) {
                        const track = JSON.parse(savedTrack);
                        localStorage.removeItem('beatpush_pending_track');
                        // Re-select the track (rebuilds pricing section + banner)
                        if (typeof selectTrack === 'function') {
                            selectTrack(track.title, track.artist, track.artwork, track.id, track.genre);
                        }
                    }

                    if (savedPack) {
                        localStorage.removeItem('beatpush_pending_pack');
                        if (typeof selectedPack !== 'undefined') {
                            selectedPack = savedPack;
                        }
                        // Re-show campaign setup with the saved pack
                        if (typeof showCampaignSetup === 'function') {
                            showCampaignSetup(savedPack);
                        }
                    }

                    if (savedArtists) {
                        const artists = JSON.parse(savedArtists);
                        localStorage.removeItem('beatpush_pending_artists');
                        if (typeof selectedArtists !== 'undefined' && Array.isArray(artists)) {
                            selectedArtists.length = 0;
                            artists.forEach(a => selectedArtists.push(a));
                            if (typeof renderArtistTags === 'function') renderArtistTags();
                        }
                    }

                    // Scroll to the launch button so user sees "Run my campaign"
                    setTimeout(() => {
                        const launchBtn = document.getElementById('launchCampaignBtn');
                        if (launchBtn) {
                            launchBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        } else {
                            const campaignSetup = document.getElementById('campaignSetup');
                            if (campaignSetup && campaignSetup.style.display !== 'none') {
                                campaignSetup.scrollIntoView({ behavior: 'smooth', block: 'end' });
                            }
                        }
                    }, 600);
                } catch (e) {
                    console.error('[BeatPush] Failed to restore campaign state:', e);
                }
            }
        }
    }

    // Run init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAuth);
    } else {
        initAuth();
    }
})();
