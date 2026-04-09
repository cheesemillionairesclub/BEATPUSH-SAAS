# BeatPush — Google Ads API Integration Design Document

## 1. Company Overview

**Company:** Beatpush, Inc.  
**Website:** https://www.beatpush.app  
**Industry:** Music Promotion SaaS (Software as a Service)  
**Address:** 888 Prospect Street, Suite 200, La Jolla, CA 92037  
**Contact Email:** contact@beatpush.app  
**Phone:** +1 (304) 660-3890  

BeatPush is a SaaS platform that provides professional promotional services for electronic music releases on Beatport, the world's leading digital music store for DJs and electronic music. Our platform connects independent music producers, DJs, and record labels with a curated network of industry professionals — including DJs, playlist curators, and music bloggers — to increase track visibility, audience engagement, and chart positioning.

### 1.1 Business Model

BeatPush operates on a **one-time purchase + subscription revenue model**:

- **Campaign Packages (One-time purchases):** Clients purchase promotion packages ranging from 50 to 1,000 copies. Each package targets a specific promotional objective (e.g., Top 100 or Top 10 chart positioning in a Beatport genre). Pricing varies by genre competitiveness, ranging from approximately $240 to $3,850 per campaign.
- **Daily Push Subscription ($55/month):** A recurring subscription service that provides ongoing daily promotional activity for a client's track, including daily campaign receipts.
- **Performance Guarantee:** Campaigns include a refund policy — if the agreed promotional objective is not met, clients are eligible for a full or partial refund.

### 1.2 How It Works

1. A client visits beatpush.app, searches for their track on Beatport via our integrated search
2. The client selects a promotional package based on their genre and goals
3. Payment is processed securely via Stripe (checkout, invoicing, and subscriptions)
4. Our team activates the campaign through our professional network of DJs and curators
5. The client monitors campaign progress through their personalized dashboard
6. Upon completion, the client receives a detailed campaign receipt

### 1.3 Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript with multi-language support (EN, FR, PT, ES, DE)
- **Backend:** Node.js on Vercel (serverless functions)
- **Payments:** Stripe (one-time and subscription billing)
- **Database & Auth:** Supabase (PostgreSQL + authentication)
- **Analytics:** Google Analytics 4 (GA4), Meta Pixel
- **Internal Reporting:** Telegram Bot integrated with Claude AI for daily performance summaries
- **Transactional Email:** Resend API

---

## 2. Purpose of Google Ads API Integration

We integrate with the Google Ads API **exclusively for internal marketing campaign management and performance reporting**. The API is **not** used in any customer-facing feature. No Google Ads data is exposed to or accessible by our clients.

Our marketing team uses the Google Ads API to manage and monitor **BeatPush's own advertising campaigns** — the campaigns we run on Google Ads to acquire new customers for our platform. This is separate from the promotional services we sell to our clients (which are music promotion campaigns on Beatport, not Google Ads campaigns).

### 2.1 Specific Use Cases

| Use Case | Description | API Operations |
|----------|-------------|----------------|
| **Daily Performance Monitoring** | Automated daily report at 20:00 CET fetches yesterday's and month-to-date campaign metrics (spend, impressions, clicks, conversions, ROAS) and sends a summary to our marketing team via Telegram | `campaigns:searchStream` (GAQL queries) |
| **Real-time Spend Tracking** | On-demand query to check today's advertising spend across all active campaigns | `campaigns:searchStream` |
| **Campaign Listing & Status** | View all ENABLED and PAUSED campaigns with their current status and budgets | `campaigns:searchStream` |
| **Search Term Analysis** | Daily review of top 20 performing search terms to optimize keyword targeting and negative keyword lists | `search_term_view` via GAQL |
| **Campaign Management** | Create, pause, and resume advertising campaigns without logging into the Google Ads UI | `campaigns:mutate` |
| **Budget Adjustment** | Update daily campaign budgets in response to performance data | `campaignBudgets:mutate` |

### 2.2 What We Do NOT Use the API For

- We do **not** provide Google Ads management services to third parties
- We do **not** resell or redistribute any Google Ads data
- We do **not** use the API for automated bidding without human oversight
- We do **not** expose any Google Ads data to our customers
- We do **not** use the API to manage anyone else's Google Ads account — only our own

---

## 3. Architecture Overview

```
┌──────────────────────────────────────────────┐
│            BeatPush SaaS Platform             │
│           (Vercel Serverless / Node.js)       │
├──────────────────────────────────────────────┤
│                                              │
│  ┌─────────────────┐    ┌──────────────────┐ │
│  │  Telegram Bot    │    │  Cron Job        │ │
│  │  (Webhook-based) │    │  (Daily 20:00)   │ │
│  └────────┬────────┘    └────────┬─────────┘ │
│           │                      │           │
│           ▼                      ▼           │
│  ┌──────────────────────────────────────┐    │
│  │  Google Ads API Client (v23)         │    │
│  │  - OAuth 2.0 + Refresh Token         │    │
│  │  - Single account (our own)          │    │
│  │  - Read: campaign data, metrics      │    │
│  │  - Write: pause/resume, budgets      │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  Telegram Commands:                          │
│  /ads    → Campaign performance overview     │
│  /spend  → Today's real-time spend           │
│  /status → List campaigns by platform        │
│  /create google <name> <budget>              │
│  /pause  google <campaign_id>                │
│  /resume google <campaign_id>                │
│  /budget google <campaign_id> <amount>       │
│  /report → Full daily analysis (with AI)     │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 4. API Usage Details

### 4.1 Authentication

- **Method:** OAuth 2.0 with offline refresh token
- **Account:** Single Google Ads account (our own marketing account)
- **Access Level:** System user with restricted access
- **Token Storage:** Encrypted environment variables on Vercel (GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET, GOOGLE_ADS_REFRESH_TOKEN, GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_CUSTOMER_ID)
- **No MCC:** We do not manage multiple accounts — only our single business account

### 4.2 API Operations Used

| Operation | Endpoint | Frequency | Purpose |
|-----------|----------|-----------|---------|
| Read Campaigns | `campaigns:searchStream` | 1x daily + on-demand | List campaigns, status, budgets |
| Read Metrics | `campaigns:searchStream` | 1x daily + on-demand | Spend, impressions, clicks, conversions, ROAS |
| Read Search Terms | `search_term_view` | 1x daily | Top 20 search terms for keyword optimization |
| Mutate Campaigns | `campaigns:mutate` | ~1-2x per week | Pause/resume campaigns |
| Mutate Budgets | `campaignBudgets:mutate` | ~1-2x per week | Adjust daily budgets |
| Create Campaigns | `campaigns:mutate` | ~1-2x per month | New campaign creation (always PAUSED) |
| Create Budgets | `campaignBudgets:mutate` | ~1-2x per month | Budget for new campaigns |

### 4.3 GAQL Queries Used

**Yesterday's campaign metrics:**
```sql
SELECT campaign.name, campaign.status, metrics.cost_micros, metrics.impressions,
       metrics.clicks, metrics.conversions, metrics.conversions_value
FROM campaign
WHERE segments.date = 'YYYY-MM-DD'
  AND campaign.status != 'REMOVED'
```

**Month-to-date metrics:**
```sql
SELECT campaign.name, metrics.cost_micros, metrics.impressions, metrics.clicks,
       metrics.conversions, metrics.conversions_value
FROM campaign
WHERE segments.date BETWEEN 'YYYY-MM-01' AND 'YYYY-MM-DD'
  AND campaign.status != 'REMOVED'
```

**Top search terms:**
```sql
SELECT search_term_view.search_term, metrics.impressions, metrics.clicks,
       metrics.cost_micros, metrics.conversions
FROM search_term_view
WHERE segments.date = 'YYYY-MM-DD'
ORDER BY metrics.impressions DESC
LIMIT 20
```

### 4.4 Rate & Volume

| Metric | Value |
|--------|-------|
| Daily automated report | 3 API calls (once at 20:00 CET) |
| On-demand Telegram commands | ~5-10 calls per day |
| Campaign mutations | ~1-2 per week |
| Campaign creation | ~1-2 per month |
| **Total estimated daily usage** | **< 50 API calls per day** |

---

## 5. Data Handling

- **No permanent storage:** Google Ads data is fetched in real-time and displayed transiently via Telegram messages. No Google Ads data is persisted in our database.
- **No data sharing:** Google Ads data is never shared with third parties, customers, or any external system.
- **No PII processing:** No personally identifiable information is collected or processed through the Google Ads API.
- **Transient display only:** Campaign metrics are formatted as text messages sent to our private Telegram group and are not logged or stored.

---

## 6. Access Control & Security

- **Telegram bot access:** Only authorized team members (verified by Telegram chat ID) can interact with the bot and access Google Ads data
- **Campaign safety:** All new campaigns are created in PAUSED state to prevent accidental activation
- **Mutation controls:** Campaign management commands (create, pause, resume, budget) require explicit Telegram commands with confirmation
- **Environment security:** All API credentials are encrypted and managed via Vercel's environment variable system
- **No public endpoints:** The Google Ads integration is not accessible via any public URL — it is only triggered by the Telegram webhook and the daily cron job

---

## 7. Compliance

- We fully comply with the Google Ads API Terms of Service
- We fully comply with Google Ads advertising policies
- We do not use the API for automated bidding or ad creation without human oversight
- We do not scrape, cache, or redistribute Google Ads data
- We do not use the API to manage accounts belonging to third parties
- Our website (beatpush.app) includes a complete Terms of Use, Privacy Policy, and About Us page

---

## 8. Website Compliance

Our website at https://www.beatpush.app includes:

- **About Us page** (`/aboutus`) — Company description, mission, team, physical address
- **Privacy Policy** (`/privacypolicy`) — Data collection, third-party services, cookies, user rights
- **Terms of Use** (`/termsofuse`) — Service terms, refund policy, client responsibilities
- **Contact information** — Email (contact@beatpush.app), phone (+1 304 660-3890), physical address (888 Prospect Street, Suite 200, La Jolla, CA 92037)
- **Multi-language support** — All pages available in English, French, Portuguese, Spanish, and German

---

## 9. Contact

**Company:** Beatpush, Inc.  
**Email:** contact@beatpush.app  
**Phone:** +1 (304) 660-3890  
**Address:** 888 Prospect Street, Suite 200, La Jolla, CA 92037  
**Website:** https://www.beatpush.app
