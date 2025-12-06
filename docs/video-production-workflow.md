# Video Production Workflow for Testimonial Videos

## UI Pattern: Horizontal Scroll Carousel
Also known as:
- Testimonial Slider
- Edge fade/gradient mask carousel
- Peek preview carousel
- Netflix-style carousel

### Key Features:
- Edge fade/gradient masks (fade-out effect on left/right edges)
- Peek preview (showing partial cards on edges to hint at more content)
- Navigation arrows for manual scrolling
- Video support with play on hover/click

---

## Video Production Options

### Option A: NanoBanana/Pro → Veo 3 (Text-First Approach)
1. **NanoBanana/Pro**: Generate static image with text overlays
   - Quote text (bottom of screen)
   - Person's name (bottom)
   - Person's position/title (bottom)
   - Company logo (top-right)
   - Department badge (top-left)
2. **Veo 3**: Animate the character speaking with voice prompt

**Pros**: Clean text placement, professional typography
**Cons**: Text might get distorted during animation, Veo 3 may not preserve text fidelity

### Option B: Veo 3 → Post-Production Text Overlay (Recommended for Commercial)
1. **Veo 3**: Generate talking head video with clean background (no text)
2. **CapCut/DaVinci/After Effects**: Add text overlays in post

**Pros**: Text stays crisp, easier to update/localize, more control over animation
**Cons**: Extra step in workflow

### Option C: Hybrid Approach
1. **Veo 3 with reference image**: Upload headshot as reference, generate talking video
2. **Motion graphics template**: Create reusable template with text zones
3. **Composite**: Overlay talking head onto template

---

## Text Overlay Specification

### Layout:
```
┌─────────────────────────────────────────────────────────┐
│ [DEPARTMENT]                           [COMPANY LOGO]   │
│  (top-left badge)                      (top-right)      │
│                                                         │
│                                                         │
│                    [CHARACTER]                          │
│                   (center, talking)                     │
│                                                         │
│                                                         │
│  "Quote text goes here, usually 1-2 lines              │
│   that captures the key testimonial."                   │
│                                                         │
│  Name  Title/Position                                   │
│  (bottom-left)                                          │
└─────────────────────────────────────────────────────────┘
```

### Typography:
- Quote: Large, white text with subtle shadow, 24-32px
- Name: Bold, white, 18-20px
- Title: Regular, white/gray, 14-16px
- Department badge: Uppercase, small, colored background (blue/green)
- Company logo: White or light version, top-right corner

---

## Characters for Testimonial Videos

### 1. Michael Chen - Real Estate
- **Department**: REAL ESTATE
- **Company**: Chen Premier Realty
- **Quote**: "BrandVoice Studio transformed how I market my listings."
- **Title**: Broker/Owner

### 2. Sofia Martinez - Med Spa
- **Department**: HEALTHCARE
- **Company**: Glow Aesthetics Med Spa
- **Quote**: "Now I have a consistent presence on social media without lifting a finger."
- **Title**: Founder & Medical Director

### 3. Marcus Thompson - Fitness
- **Department**: FITNESS
- **Company**: Elite Performance Fitness
- **Quote**: "My gym membership inquiries shot up within the first month."
- **Title**: Owner & Head Coach

### 4. Jennifer Wong - Legal
- **Department**: LEGAL
- **Company**: Wong & Associates Law
- **Quote**: "I've received more quality leads in 2 months than the previous year."
- **Title**: Managing Partner

### 5. Omar Hassan - E-commerce
- **Department**: E-COMMERCE
- **Company**: Luxe Home Goods
- **Quote**: "The AI spokesperson videos have become our top-performing ads."
- **Title**: Founder & CEO

---

## Workflow Status

- [ ] Option A Testing (NanoBanana → Veo 3)
- [ ] Option B Testing (Veo 3 → Post-Production)
- [ ] Final approach selected
- [ ] All 5 testimonial videos produced
- [ ] Carousel component built
- [ ] Videos uploaded and integrated
