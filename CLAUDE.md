# BrandVoice Studio - Project Guidelines

This documentation is automatically loaded when working on the BrandVoice project.

---

## Project Overview

**BrandVoice Studio** is a done-for-you AI video spokesperson production platform. We help businesses create professional AI-generated spokesperson videos for marketing, training, and communication.

- **Live Site**: https://brandvoice.studio
- **GitHub**: dbutler-a11y/brandvoice-ai
- **Vercel Project**: ai-spokesperson-studio

---

## Brand Guidelines

### Primary Colors
```
Primary Gradient: from-purple-600 to-indigo-600
Hover Gradient:   from-purple-700 to-indigo-700
```

### Color Palette
| Usage | Tailwind Class |
|-------|----------------|
| Primary buttons | `bg-gradient-to-r from-purple-600 to-indigo-600` |
| Primary text | `text-purple-600` |
| Hover states | `hover:from-purple-700 hover:to-indigo-700` |
| Backgrounds | `bg-white`, `bg-gray-50`, `bg-gray-900` |
| Body text | `text-gray-600` |
| Headings | `text-gray-900` |
| Muted text | `text-gray-500` |

### Typography
- **Headlines**: `text-5xl sm:text-6xl lg:text-7xl font-bold`
- **Subheads**: `text-xl sm:text-2xl text-gray-500`
- **Body**: `text-base text-gray-600`
- **Font**: System fonts (no custom fonts loaded)

### Logo Assets
| File | Size | Usage |
|------|------|-------|
| `/images/brandvoice-logo.png` | 50KB | Header, navigation |
| `/images/brandvoice-logo-cropped.png` | 2.3MB | High-res marketing |
| `/images/brandvoice-logo-full.png` | 3.7MB | Original source |

### Logo Usage
- Header logo: `h-10 w-auto` with `priority` loading
- Mobile logo: `h-8 w-auto`
- Always use the purple/indigo gradient version
- Maintain aspect ratio, never stretch

### Button Styles
```tsx
// Primary CTA
className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"

// Secondary/Outline
className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
```

### Card Styles
```tsx
// Standard card
className="bg-white rounded-xl shadow-lg p-6"

// Premium card
className="bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 p-8"

// Glass effect
className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6"
```

---

## Tech Stack

- **Framework**: Next.js 14.2.33 (App Router)
- **Styling**: Tailwind CSS 3.4
- **Database**: Prisma + Supabase
- **Auth**: Supabase Auth
- **Payments**: PayPal
- **Email**: Resend + Nodemailer
- **AI**: Anthropic Claude, OpenAI
- **Monitoring**: Sentry
- **Deployment**: Vercel

---

## Project Structure

```
app/
  (public)/           # Public marketing pages
    page.tsx          # Homepage
    how-it-works/     # Process explanation
    pricing/          # Pricing plans
    portfolio/        # Video examples
    contact/          # Contact form
    checkout/         # Payment flow

  admin/              # Admin dashboard (protected)
    clients/          # Client management
    studio/           # Video production
    crm/              # Lead management
    spokespersons/    # Avatar management

  portal/             # Client portal (protected)
    scripts/          # Script management
    videos/           # Video delivery

  blog/               # Blog system
  dev-portal/         # Internal dev tools
  api/                # API routes

components/
  PublicHeader.tsx    # Public site navigation
  PublicFooter.tsx    # Public site footer
  ui/                 # Reusable UI components

public/
  images/             # Static images
  videos/             # Video assets
```

---

## Key Routes

### Public Pages
| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, testimonials, CTA |
| `/how-it-works` | 3-step process explanation |
| `/pricing` | Pricing tiers and comparison |
| `/portfolio` | Video showcase gallery |
| `/contact` | Contact form |
| `/blog` | Blog listing |
| `/blog/[slug]` | Individual blog posts |

### Protected Routes
| Route | Access | Description |
|-------|--------|-------------|
| `/admin` | Admin | Dashboard overview |
| `/admin/clients` | Admin | Client management |
| `/admin/studio` | Admin | Video production |
| `/admin/crm` | Admin | Lead/CRM management |
| `/portal` | Client | Client dashboard |
| `/portal/scripts` | Client | Script approval |
| `/portal/videos` | Client | Video downloads |

### Auth Routes
| Route | Description |
|-------|-------------|
| `/portal/login` | Client login |
| `/auth/callback` | OAuth callback |

---

## Development

### Commands
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Run ESLint
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database
npm run test         # Run Playwright tests
npm run launch-check # Pre-launch verification
```

### Environment Variables
Required in `.env`:
- `DATABASE_URL` - Prisma database connection
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service key
- `RESEND_API_KEY` - Email sending
- `PAYPAL_CLIENT_ID` - PayPal integration
- `SENTRY_DSN` - Error tracking

---

## Deployment

### Vercel Configuration
- **Project**: ai-spokesperson-studio
- **Domain**: brandvoice.studio
- **Branch**: main (auto-deploy)

### Deploy Commands
```bash
# Push to GitHub (triggers auto-deploy)
git add -A && git commit -m "message" && git push origin main

# Manual deploy if needed
vercel --prod

# Update domain alias (busts CDN cache)
vercel alias [deployment-url] brandvoice.studio
```

---

## Video Assets

### Promo Video
- **Location**: `/public/videos/brandvoice-promo.mp4`
- **Format**: MP4 (H.264)
- **Size**: ~1MB (web-optimized)
- **Usage**: Homepage showcase with phone-frame display

### Video Display Pattern
```tsx
<video
  ref={videoRef}
  className="w-full h-full object-cover"
  autoPlay
  loop
  muted
  playsInline
  poster="/images/brandvoice-logo.png"
>
  <source src="/videos/brandvoice-promo.mp4" type="video/mp4" />
</video>
```

---

## Content Guidelines

### Voice & Tone
- **Professional** but approachable
- **Confident** without being pushy
- **Clear** and jargon-free
- Focus on **benefits** over features
- Use **social proof** (testimonials, case studies)

### Key Messaging
- "Done-for-you AI spokesperson videos"
- "Professional quality without the production hassle"
- "Turn your scripts into engaging videos"
- "AI-powered, human-quality results"

### CTAs
- Primary: "Book a Call" (links to `/#book-call`)
- Secondary: "See Examples" (links to `/portfolio`)
- Tertiary: "Learn More" (links to `/how-it-works`)

---

## AI Image Generation Prompts

When generating brand assets for BrandVoice, use these guidelines:

### Logo/Icon Style
```
Modern tech logo, purple and indigo gradient, geometric megaphone or speaker symbol, clean minimalist design, professional SaaS aesthetic, transparent background
```

### Brand Asset Colors
- Primary: `#9333EA` (purple-600)
- Secondary: `#4F46E5` (indigo-600)
- Accent: `#7C3AED` (violet-600)

### Avoid
- Realistic human faces in logos
- Overly complex gradients
- Text in icons (keep separate)
- Generic AI/robot imagery

---

*This file is read automatically by Claude Code when working on this project.*
