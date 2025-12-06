# UseCaseCarousel Component

A high-quality horizontal scroll testimonial carousel built with Embla Carousel for Next.js.

## Features

- **Video Support**: Designed to support video content with autoplay on hover (currently using images as placeholders)
- **Synthesia-style Design**:
  - Edge fade/gradient masks on left and right sides
  - Peek preview showing partial cards on edges
  - Left/right navigation arrows with smooth animations
- **Rich Card Design**:
  - Video/image as full background
  - Department badge (top-left, color-coded by industry)
  - Company name/logo area (top-right)
  - Large quote text (bottom, with shadow for readability)
  - Person name and title (bottom section)
- **Accessibility**:
  - Keyboard navigation support
  - ARIA labels on navigation buttons
  - Focus states on interactive elements
- **Mobile Responsive**: Optimized layouts for mobile, tablet, and desktop

## Usage

```tsx
import { UseCaseCarousel } from "@/components/testimonials/UseCaseCarousel";

export default function Page() {
  return (
    <div>
      <UseCaseCarousel />
    </div>
  );
}
```

## Switching to Video Content

To swap images for videos, simply update the `media` and `mediaType` fields in the testimonials array:

```typescript
{
  id: 1,
  name: "Michael Chen",
  title: "Broker/Owner",
  company: "Chen Premier Realty",
  department: "REAL ESTATE",
  quote: "BrandVoice Studio transformed how I market my listings.",
  media: "/videos/testimonials/michael-chen.mp4", // Video path
  mediaType: "video", // Change from "image" to "video"
}
```

Videos will autoplay (muted) when users hover over the card.

## Customization

### Department Colors

Edit the `departmentColors` object to add or modify industry badge colors:

```typescript
const departmentColors: Record<string, { bg: string; text: string }> = {
  "REAL ESTATE": { bg: "bg-blue-500/90", text: "text-white" },
  HEALTHCARE: { bg: "bg-purple-500/90", text: "text-white" },
  // Add more industries...
};
```

### Carousel Settings

Modify the Embla configuration in the component:

```typescript
const [emblaRef, emblaApi] = useEmblaCarousel({
  loop: true,          // Enable infinite loop
  align: "start",      // Alignment of slides
  skipSnaps: false,    // Don't skip snap points
  dragFree: false,     // Enable snap-to-slide behavior
});
```

## Dependencies

- `embla-carousel-react` - Core carousel functionality
- `lucide-react` - Icons for navigation arrows
- `next/image` - Optimized image loading

## Accessibility

The component includes:
- Semantic HTML structure
- ARIA labels for navigation buttons
- Keyboard navigation support (arrow keys work with Embla)
- Focus indicators on interactive elements
- Disabled states for navigation when at carousel boundaries
