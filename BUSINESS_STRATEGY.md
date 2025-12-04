# AI Spokesperson Studio - Business Strategy Notes

> Last Updated: 2024-11-30
> Access this from: `/admin/strategy`

---

## Pricing Strategy: Spokesperson Tiers

### Tier 1: Pre-Made Spokesperson ($997-$1,497)
**"Hire One of Our AI Spokespersons"**

- Client chooses from library of 6-10 pre-made AI characters
- Limited customization: background, clothing color
- Shared character (others may use same base)
- Fastest turnaround (3-5 days)

### Tier 2: Modified Spokesperson ($1,497-$2,497)
**"Customize Your Spokesperson"**

- Start with pre-made character
- Custom modifications: hair, clothing, accessories, background
- Semi-exclusive (base model shared, customizations unique)
- Medium turnaround (5-7 days)

### Tier 3: Exclusive Spokesperson ($2,997-$4,997)
**"Create Your Own Exclusive Actor"**

- Fully custom AI character from scratch
- 100% exclusive to their brand
- Full control: appearance, voice, mannerisms
- Longest turnaround (7-14 days)
- Ongoing exclusivity guarantee

---

## Value Demonstration Strategy

### The "Show 10%, Charge for 90%" Rule

**What to Give FREE (on intake/landing page):**
- AI helps brainstorm 3-5 FAQ ideas
- AI suggests brand tone options
- ONE watermarked sample script preview
- Video previews from various industries (without full scripts visible)

**What to Keep PAID:**
- Full 30 scripts
- Actual AI spokesperson video production
- Complete content pack
- Customization options

### Why This Works (Research-Backed)

| Principle | Effect | Close Rate Impact |
|-----------|--------|-------------------|
| Free Samples (Costco Model) | Builds desire through quality taste | +25-30% |
| Sunk Cost (Partial Completion) | Started = 68% more likely to finish | +40% completion |
| IKEA Effect | Effort invested = higher value perception | +2x perceived value |

### Probability Analysis

| Approach | Close Rate | Avg Deal Size | Revenue Impact |
|----------|------------|---------------|----------------|
| No AI assistance | 12-18% | $1,500 | Baseline |
| Light AI assistance | 22-28% | $1,500 | +50-80% leads |
| Too much free value | 8-12% | $997 | -30% overall |

---

## Watermarking Strategy

### How to Watermark Preview Scripts

**Option 1: Visual Watermark**
- Overlay semi-transparent "PREVIEW" text
- Add your logo in corner
- Blur or fade the last 50% of script

**Option 2: Truncation**
- Show first 30% of script
- "...Continue with full service" CTA
- Tease the hook, hide the close

**Option 3: Video Watermark**
- Lower resolution preview
- Watermark logo throughout
- "Sample Only" text overlay
- No download option

### Recommendation
Skip watermarking on scripts - instead, show INDUSTRY EXAMPLES that demonstrate quality without giving away client-specific content.

---

## AI Spokesperson Library Plan

### Pre-Made Characters to Create

| Character | Industry Focus | Tone | Gender | Age Range |
|-----------|---------------|------|--------|-----------|
| **Sarah** | Med Spa / Beauty | Luxury, Sophisticated | F | 30-40 |
| **Marcus** | Real Estate | Professional, Trustworthy | M | 35-45 |
| **Elena** | Fitness / Wellness | Energetic, Motivating | F | 25-35 |
| **David** | Legal / Finance | Authoritative, Calm | M | 40-50 |
| **Priya** | Tech / SaaS | Modern, Approachable | F | 28-38 |
| **James** | Restaurant / Hospitality | Warm, Friendly | M | 35-45 |

### Character Customization Options

**Modifiable Elements:**
- [ ] Hair color/style
- [ ] Eye color
- [ ] Skin tone
- [ ] Clothing style
- [ ] Background scene
- [ ] Accessories
- [ ] Voice tone/accent

**Fixed Elements (per character):**
- Base facial structure
- Core mannerisms
- Animation style

---

## VidBuzz.io Integration

### API Integration Points

```
AI Spokesperson Studio → VidBuzz.io API
                      ↓
              Character Selection
                      ↓
              Script + Settings
                      ↓
              Video Generation
                      ↓
              Delivery to Client
```

### Backend Generator Concept

**Flow:**
1. Admin selects client + spokesperson
2. Scripts auto-feed to VidBuzz
3. VidBuzz generates videos
4. Videos return to client dashboard
5. Client downloads/reviews

### Database Integration Needed
- Spokesperson model in Prisma
- Link spokespersons to clients
- Track video generation status
- Store video URLs/assets

---

## Industry Demo Priority

### Phase 1 (Now)
1. ✅ Med Spa (Sarah) - DONE
2. 🔄 Real Estate (Marcus) - IN PROGRESS

### Phase 2 (Next Week)
3. Fitness/Wellness (Elena)
4. Legal/Financial (David)

### Phase 3 (Following Week)
5. Tech/SaaS (Priya)
6. Restaurant/Hospitality (James)

---

## Intake Form Enhancement Ideas

### AI-Assisted Intake (Light Touch)

**Step 1: Business Discovery**
- "What's your business name?"
- AI: "Great! Based on [business name], here are common FAQs in your industry..."
- Shows 5 suggested FAQs they can select/modify

**Step 2: Tone Selection**
- AI analyzes their website (if provided)
- Suggests brand tone based on industry
- Shows tone examples with sample clips

**Step 3: Preview Hook**
- "Here's a taste of what your AI spokesperson could say..."
- Shows ONE sample script based on their inputs
- Watermarked or truncated

**Step 4: Spokesperson Selection**
- "Choose your spokesperson"
- Grid of available characters
- "Or upgrade to custom exclusive"

---

## Key Metrics to Track

### Conversion Funnel
- Landing page visits
- Intake form starts
- Intake form completions
- Payment conversions
- Upsells to higher tiers

### Product Metrics
- Scripts generated per client
- Videos produced per client
- Client satisfaction scores
- Referral rate

### Revenue Metrics
- Average deal size
- Monthly recurring (retainers)
- Tier distribution (1/2/3)
- Lifetime client value

---

## Notes & Ideas

### Future Features
- [ ] Client portal for viewing their content
- [ ] Automated video delivery
- [ ] Subscription/retainer management
- [ ] Referral program tracking
- [ ] A/B testing intake variations

### Competitive Positioning
- NOT a DIY tool (like Synthesia)
- DONE-FOR-YOU service with AI efficiency
- Premium positioning, premium pricing
- Personal touch + AI scale

---

*This document is editable from the admin dashboard at `/admin/strategy`*
