# BeatPush — Google Ads API Integration Design Document

## 1. Company Overview

**Company:** BeatPush  
**Website:** https://www.beatpush.app  
**Industry:** Music Promotion SaaS  

BeatPush is a SaaS platform that helps electronic music producers and record labels promote their tracks on Beatport. Our platform connects artists with DJs and curators to increase track visibility and chart positioning.

## 2. Purpose of Google Ads API Integration

We integrate with the Google Ads API for **internal campaign management and reporting**. The API is used exclusively by our internal team to:

- **Monitor campaign performance** in real-time (spend, conversions, ROAS)
- **Generate automated daily reports** sent via Telegram to our marketing team
- **Manage campaigns** (create, pause, resume, adjust budgets) without logging into the Google Ads UI
- **Analyze search terms** to optimize keyword targeting

## 3. Architecture Overview

```
┌─────────────────────┐
│   BeatPush SaaS     │
│  (Vercel Serverless) │
├─────────────────────┤
│                     │
│  Telegram Bot ──────┼──► Google Ads API (v23)
│  (Webhook)          │        - Read campaign data
│                     │        - Manage campaigns
│  Cron Job ──────────┼──► Daily automated reports
│  (Daily at 20:00)   │
│                     │
│  Internal Dashboard ┼──► Campaign analytics
│                     │
└─────────────────────┘
```

## 4. API Usage Details

### 4.1 Authentication
- OAuth 2.0 with refresh token
- System user with restricted access
- Tokens stored securely in environment variables (Vercel)

### 4.2 API Operations Used

| Operation | Endpoint | Frequency | Purpose |
|-----------|----------|-----------|---------|
| Read Campaigns | `campaigns:searchStream` | On-demand + daily | List campaigns, status, budgets |
| Read Metrics | `campaigns:searchStream` | On-demand + daily | Spend, impressions, clicks, conversions |
| Read Search Terms | `search_term_view` | Daily | Keyword optimization |
| Mutate Campaigns | `campaigns:mutate` | Rare | Pause/resume campaigns |
| Mutate Budgets | `campaignBudgets:mutate` | Rare | Adjust daily budgets |
| Create Campaigns | `campaigns:mutate` | Rare | New campaign creation |
| Create Budgets | `campaignBudgets:mutate` | Rare | Budget for new campaigns |

### 4.3 Rate & Volume
- **Daily report:** 3 API calls (campaigns, metrics, search terms) — once per day at 20:00 CET
- **On-demand commands:** ~5-10 calls per day via Telegram bot
- **Campaign management:** ~1-2 mutations per week
- **Total estimated:** < 50 API calls per day

## 5. Data Handling

- No Google Ads data is stored permanently
- Data is fetched in real-time and displayed via Telegram messages
- No data is shared with third parties
- No PII is collected or processed through the API

## 6. Access Control

- Only authorized team members can interact with the Telegram bot
- Campaign mutations (create, pause, budget changes) require explicit commands
- All new campaigns are created in PAUSED state for safety
- Environment variables are encrypted and managed via Vercel

## 7. Compliance

- We comply with Google Ads API Terms of Service
- We comply with Google Ads policies
- We do not use the API for automated bidding or ad creation without human oversight
- We do not scrape or redistribute Google Ads data

## 8. Contact

**Email:** contact@beatpush.app  
**Website:** https://www.beatpush.app
