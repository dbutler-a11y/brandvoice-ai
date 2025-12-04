# AI Spokesperson Studio - Roadmap & Goals

> Last Updated: 2025-11-30

---

## Current Status

### Phase 1: Core Platform (COMPLETE)
- [x] Next.js 14 App Router setup
- [x] Prisma ORM with SQLite database
- [x] Client intake system (public + admin)
- [x] 30-Day Script Generation Engine (OpenAI integrated)
- [x] Admin dashboard with client management
- [x] Script editing and status tracking

### Database Status
- **Current**: SQLite (file-based at `prisma/dev.db`)
- **Recommended Upgrade**: Supabase PostgreSQL for production
- **Migration Path**: Change `DATABASE_URL` in `.env` to Supabase connection string

---

## 🚀 GO-LIVE CHECKLIST (First Paying Customer)

> **TRIGGER**: When you're ready to onboard your first real paying customer, complete this checklist BEFORE accepting payment.

### Pre-Launch Requirements
- [ ] **Migrate to Supabase** (see migration steps below)
- [ ] **Deploy to Vercel** (free tier is fine)
- [ ] **Set up payment system** (PayPal.me + Wave)
- [ ] **Test full flow end-to-end** with a test client
- [ ] **Create client contract/agreement template**
- [ ] **Set up professional email** (you@yourdomain.com)

### Supabase Migration Steps
1. [ ] Create free account at supabase.com
2. [ ] Create new project (choose closest region)
3. [ ] Copy connection string from Settings → Database
4. [ ] Update `.env`: `DATABASE_URL="postgresql://..."`
5. [ ] Run: `npx prisma migrate deploy`
6. [ ] Test all features work
7. [ ] Delete local `dev.db` file

### Deployment Steps
1. [ ] Push code to GitHub
2. [ ] Connect repo to Vercel
3. [ ] Add environment variables in Vercel dashboard
4. [ ] Deploy and test live URL
5. [ ] Set up custom domain (optional)

---

## 💳 Payment & Invoicing Strategy

### Recommended: PayPal.me + Wave (Simple & Free)

**Why This Combo Works**:
- **PayPal.me** - Instant payment links, no setup complexity
- **Wave** - 100% free invoicing and accounting software
- No monthly fees, no complicated integration
- Get paid same day

### PayPal.me Setup (5 minutes)

1. Go to paypal.me and create your link
2. Your link: `paypal.me/YourName/997` (amount pre-filled)
3. Send link to client via email or text
4. Money arrives instantly in your PayPal

| Package | PayPal.me Link |
|---------|---------------|
| Starter | `paypal.me/YourName/997` |
| Pro | `paypal.me/YourName/1497` |
| Premium | `paypal.me/YourName/2497` |

**PayPal Fees**: 2.89% + $0.49 per transaction

### Wave Invoicing (Free)

1. Create free account at waveapps.com
2. Add your business info and logo
3. Create professional invoices
4. Clients can pay via credit card or bank transfer

| Feature | Cost |
|---------|------|
| Invoicing | FREE |
| Accounting | FREE |
| Receipt scanning | FREE |
| Credit card payments | 2.9% + $0.60 |
| Bank payments (ACH) | 1% ($1 min) |

### Quick Start Payment Flow (No Code)

**Phase 1 - Manual (Start here)**:
1. Client fills intake form
2. You review and approve
3. Send PayPal.me link via email/text
4. Client pays → You deliver

**Phase 2 - Professional Invoices**:
1. Intake form submitted
2. Create Wave invoice with deliverables listed
3. Client pays via invoice
4. Wave tracks payment automatically

**Phase 3 - Retainer Clients**:
1. Set up recurring Wave invoice (monthly)
2. Client pays automatically
3. You deliver monthly content refresh
4. Wave handles accounting

### Pricing Structure Recommendation

| Package | One-Time | Monthly Retainer |
|---------|----------|------------------|
| **Starter** | $997 | $297/mo (8 scripts) |
| **Pro** | $1,497 | $497/mo (15 scripts) |
| **Premium** | $2,497 | $997/mo (30 scripts + extras) |

### Invoice Template Fields
- [ ] Client business name
- [ ] Package selected
- [ ] One-time vs recurring
- [ ] Payment terms (Due on receipt / Net 15)
- [ ] Deliverables list
- [ ] Timeline commitment

---

## Phase 2: Automation & Sequences (NEXT)

### Cold Email Sequence Generator
- [ ] Add `EmailSequence` model to database
- [ ] Create email template builder in admin
- [ ] Generate 5-7 email cold outreach sequence per client niche
- [ ] Export to CSV for email tools (Instantly, Smartlead, etc.)
- [ ] Variables: {firstName}, {businessName}, {painPoint}, {offer}

### Facebook Ad Creative Pack
- [ ] Add `AdCreative` model to database
- [ ] Generate ad copy variations (3 hooks x 3 bodies x 3 CTAs)
- [ ] Primary text, headline, description formats
- [ ] Audience targeting suggestions based on niche
- [ ] Export pack as PDF or JSON

### Follow-Up Text/Email Sequence
- [ ] Post-purchase nurture sequence (7 emails)
- [ ] Re-engagement sequence for cold leads
- [ ] SMS-friendly short versions
- [ ] Timing recommendations

### Automated Onboarding Message
- [ ] Welcome email template with next steps
- [ ] Intake confirmation auto-response
- [ ] Timeline/expectation setting message
- [ ] Integration with email service (Resend, SendGrid)

---

## Phase 3: Retention & Scaling

### Monthly Retainer Framework
- [ ] Add `Subscription` model to track client retainers
- [ ] Monthly content refresh packages:
  - **Basic**: 8 new scripts/month ($297/mo)
  - **Growth**: 15 new scripts + 1 promo video ($497/mo)
  - **Scale**: 30 scripts + ad creatives + email sequence ($997/mo)
- [ ] Renewal reminder system
- [ ] Usage tracking dashboard
- [ ] Client portal for self-service requests

### Sub-Agent Architecture (Future Automation)
- [ ] **Agent 1**: Script Writer (DONE)
- [ ] **Agent 2**: Voice Generator (ElevenLabs/HeyGen integration)
- [ ] **Agent 3**: Scene Designer (background/asset management)
- [ ] **Agent 4**: Video Creator (VidBuzz API integration)
- [ ] **Agent 5**: Caption Engine (auto-captioning)
- [ ] **Agent 6**: Delivery Packager (client deliverable bundling)

---

## Supabase Migration Benefits

### Low-Cost Leverage Strategies

1. **Free Tier Power** (up to 500MB, 2 projects)
   - Store all client data, scripts, and metadata
   - Real-time subscriptions for live dashboard updates
   - Built-in auth for client portal access

2. **Edge Functions** ($0 for 500K invocations/month)
   - Webhook handlers for intake form submissions
   - Scheduled script generation jobs
   - Email/SMS trigger automation

3. **Storage** (1GB free)
   - Client logo uploads
   - Generated video thumbnails
   - Asset management for video backgrounds

4. **Row Level Security (RLS)**
   - Multi-tenant client portal (each client sees only their data)
   - No extra auth infrastructure needed

5. **Realtime Subscriptions**
   - Live script generation progress
   - Client notification when content is ready
   - Admin dashboard auto-refresh

6. **Database Webhooks**
   - Trigger Zapier/Make when new client signs up
   - Auto-notify Slack when scripts are generated
   - Send welcome email on intake submission

7. **Postgres Full-Text Search**
   - Search across all scripts by keyword
   - Find clients by niche, status, or date
   - No external search service needed

### Supabase Setup Cost Estimate
| Feature | Free Tier | Pro ($25/mo) |
|---------|-----------|--------------|
| Database | 500MB | 8GB |
| Storage | 1GB | 100GB |
| Edge Functions | 500K/mo | 2M/mo |
| Realtime | 200 connections | Unlimited |
| Auth | 50K MAU | 100K MAU |

**Recommendation**: Start on Free Tier, upgrade to Pro only when you hit 20+ active clients.

---

## Quick Wins Checklist

### This Week
- [ ] Test script generation with real OpenAI key
- [ ] Add first real client through intake form
- [ ] Generate and review 30-day script pack
- [ ] Export scripts to document for delivery

### This Month
- [ ] Complete GO-LIVE checklist (when ready for first customer)
- [ ] Set up PayPal.me link and Wave account
- [ ] Migrate to Supabase for production database
- [ ] Deploy to Vercel

### This Quarter
- [ ] Launch monthly retainer packages
- [ ] Integrate video generation (VidBuzz/HeyGen)
- [ ] Build automated onboarding flow
- [ ] Add 5 paying clients on retainer

---

## Business Goals

### Revenue Targets
- **Month 1**: 3 clients @ $1,500 = $4,500
- **Month 3**: 10 clients @ $1,500 + 3 retainers @ $500 = $16,500
- **Month 6**: 15 clients @ $1,500 + 10 retainers @ $500 = $27,500

### Key Metrics to Track
- [ ] Intake form conversion rate
- [ ] Script generation success rate
- [ ] Client satisfaction score
- [ ] Retainer renewal rate
- [ ] Time from intake to delivery

---

## 💰 Monthly Operating Costs (Projected)

### Bootstrapped Setup (Start Here)
| Service | Cost | Notes |
|---------|------|-------|
| Vercel | $0 | Free tier (100GB bandwidth) |
| Supabase | $0 | Free tier (500MB) |
| OpenAI | ~$5-20 | Pay per use (~$0.50 per 30 scripts) |
| PayPal | 2.89% + $0.49 | Per transaction only |
| Domain | ~$12/year | Optional |
| **TOTAL** | **~$5-25/mo** | Until you scale |

### Scaled Setup (20+ clients)
| Service | Cost | Notes |
|---------|------|-------|
| Vercel Pro | $20/mo | More bandwidth |
| Supabase Pro | $25/mo | More storage |
| OpenAI | ~$50-100 | Higher volume |
| PayPal/Wave | 2.89% + $0.49 | Per transaction |
| Resend | $0-20 | Email service |
| **TOTAL** | **~$100-175/mo** | Scales with revenue |

### Break-Even Analysis
- Monthly costs (scaled): ~$150
- One client payment: $1,500
- **Break-even: 1 client pays for 10 months of operations**

---

## Notes & Ideas

### Payment Link Strategy
Create PayPal.me links for each package:
- `paypal.me/YourName/997` → Starter
- `paypal.me/YourName/1497` → Pro
- `paypal.me/YourName/2497` → Premium

Send appropriate link after intake review. No code needed!

### Upsell Opportunities
- Script refresh packs
- Additional video batches
- Ad creative add-ons
- Rush delivery fee (+$500)

---

## Tech Stack Reference

| Component | Current | Future |
|-----------|---------|--------|
| Framework | Next.js 14 | Next.js 14 |
| Database | SQLite | Supabase PostgreSQL |
| ORM | Prisma | Prisma |
| Auth | None | Supabase Auth |
| Storage | Local | Supabase Storage |
| AI | OpenAI GPT-4 | OpenAI + Claude |
| Video | Manual | VidBuzz/HeyGen API |
| Email | Manual | Resend/SendGrid |
| Hosting | Local | Vercel |
| Payments | None | PayPal.me + Wave |

---

*This document is editable from the admin dashboard at `/admin/roadmap`*
