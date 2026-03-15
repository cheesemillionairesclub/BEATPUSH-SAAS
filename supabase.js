// ===== Supabase Client (Browser) =====
const SUPABASE_URL = 'https://wrdbhyypbpppzrtyacvw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyZGJoeXlwYnBwcHpydHlhY3Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NjE4NzMsImV4cCI6MjA4OTEzNzg3M30.jO-JGKecLjYM71Z--5FVNz-m_iNgMMYP4AdrmD7Xg9o';

// Lightweight Supabase auth client (no SDK needed for browser)
const BeatpushAuth = {
    _session: null,
    _user: null,
    _listeners: [],
    _readyResolve: null,
    _readyPromise: null,

    get supabaseUrl() { return SUPABASE_URL; },
    get supabaseKey() { return SUPABASE_ANON_KEY; },

    // Wait until init() has completed
    whenReady() {
        if (!this._readyPromise) {
            this._readyPromise = new Promise(resolve => { this._readyResolve = resolve; });
        }
        return this._readyPromise;
    },

    // Initialize: check for existing session
    async init() {
        if (!this._readyPromise) {
            this._readyPromise = new Promise(resolve => { this._readyResolve = resolve; });
        }
        // Check if returning from OAuth redirect
        const hash = window.location.hash;
        if (hash && hash.includes('access_token')) {
            const params = new URLSearchParams(hash.substring(1));
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');
            if (accessToken) {
                localStorage.setItem('beatpush_access_token', accessToken);
                if (refreshToken) localStorage.setItem('beatpush_refresh_token', refreshToken);
                // Clean URL
                window.history.replaceState({}, '', window.location.pathname + window.location.search);
                // Redirect to admin if coming from admin login
                if (localStorage.getItem('beatpush_admin_redirect')) {
                    localStorage.removeItem('beatpush_admin_redirect');
                    window.location.href = '/admin';
                    this._readyResolve(null);
                    return null;
                }
            }
        }

        const token = localStorage.getItem('beatpush_access_token');
        if (token) {
            try {
                const user = await this._getUser(token);
                if (user) {
                    this._session = { access_token: token };
                    this._user = user;
                    this._notify();
                    this._readyResolve(user);
                    return user;
                } else {
                    // Token expired, try refresh
                    const refreshed = await this._refreshSession();
                    if (refreshed) { this._readyResolve(this._user); return this._user; }
                    this._clearSession();
                }
            } catch (e) {
                this._clearSession();
            }
        }
        this._readyResolve(null);
        return null;
    },

    // Get current user
    getUser() {
        return this._user;
    },

    // Get access token
    getToken() {
        return localStorage.getItem('beatpush_access_token');
    },

    // Sign in with Google OAuth
    async signInWithGoogle(redirectTo) {
        // Save current page state before redirect
        if (redirectTo) {
            localStorage.setItem('beatpush_auth_redirect', redirectTo);
        }
        const url = `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(window.location.origin + '/')}`;
        window.location.href = url;
    },

    // Sign out
    async signOut() {
        const token = this.getToken();
        if (token) {
            try {
                await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'apikey': SUPABASE_ANON_KEY,
                    },
                });
            } catch (e) { /* ignore */ }
        }
        this._clearSession();
        this._notify();
    },

    // Listen for auth changes
    onAuthChange(callback) {
        this._listeners.push(callback);
        // Call immediately with current state
        callback(this._user);
    },

    // Fetch user from Supabase
    async _getUser(token) {
        const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'apikey': SUPABASE_ANON_KEY,
            },
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data;
    },

    // Refresh session
    async _refreshSession() {
        const refreshToken = localStorage.getItem('beatpush_refresh_token');
        if (!refreshToken) return false;
        try {
            const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                },
                body: JSON.stringify({ refresh_token: refreshToken }),
            });
            if (!res.ok) return false;
            const data = await res.json();
            localStorage.setItem('beatpush_access_token', data.access_token);
            if (data.refresh_token) localStorage.setItem('beatpush_refresh_token', data.refresh_token);
            this._session = { access_token: data.access_token };
            this._user = data.user;
            this._notify();
            return true;
        } catch (e) {
            return false;
        }
    },

    _clearSession() {
        this._session = null;
        this._user = null;
        localStorage.removeItem('beatpush_access_token');
        localStorage.removeItem('beatpush_refresh_token');
    },

    _notify() {
        this._listeners.forEach(cb => cb(this._user));
    },

    // ===== Database helpers (using REST API) =====

    // Fetch user's orders
    async getMyOrders() {
        const token = this.getToken();
        if (!token) return [];
        const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?user_id=eq.${this._user.id}&order=created_at.desc`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'apikey': SUPABASE_ANON_KEY,
            },
        });
        if (!res.ok) return [];
        return await res.json();
    },

    // Fetch user profile
    async getProfile() {
        const token = this.getToken();
        if (!token) return null;
        const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${this._user.id}&select=*`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'apikey': SUPABASE_ANON_KEY,
            },
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data[0] || null;
    },
};
