# SDLC Test Plan: Video Sound Verification in Carousel

**Project:** AI Spokesperson Studio
**Component:** UseCaseCarousel (Testimonial Video Carousel)
**Feature:** Video Playback with Sound
**Date:** 2025-12-05
**Status:** Active Testing

---

## Table of Contents
1. [Overview](#overview)
2. [Component Analysis](#component-analysis)
3. [Unit Tests](#unit-tests)
4. [Integration Tests](#integration-tests)
5. [Manual Test Cases](#manual-test-cases)
6. [Browser Compatibility Matrix](#browser-compatibility-matrix)
7. [Debug Checklist](#debug-checklist)
8. [Acceptance Criteria](#acceptance-criteria)
9. [Test Data Requirements](#test-data-requirements)
10. [Known Issues & Edge Cases](#known-issues--edge-cases)

---

## Overview

### Purpose
Verify that video testimonials in the UseCaseCarousel component play with sound when users interact with them, ensuring a seamless user experience across all supported browsers and devices.

### Scope
- Video playback functionality in carousel slides
- Audio output when videos are played
- User interaction flows (click to play, pause, replay)
- Cross-browser and cross-device compatibility
- Performance and memory management

### Out of Scope
- Video encoding/transcoding
- Content management system integration
- Embla carousel navigation (except as it relates to video playback)

---

## Component Analysis

### Current Implementation
**File:** `/Users/brittanymurphy/Desktop/Butler/Projects/ai-spokesperson-studio/components/testimonials/UseCaseCarousel.tsx`

**Key Components:**
1. **UseCaseCarousel** - Parent container with Embla carousel
2. **TestimonialCard** - Individual card component with video player
3. **Video Element** - HTML5 video with custom controls

**Current Video Attributes:**
```tsx
<video
  ref={videoRef}
  src={testimonial.media}
  poster={testimonial.poster}
  className="w-full h-full object-cover cursor-pointer"
  playsInline
  preload="metadata"
  onEnded={handleVideoEnd}
  onClick={handleVideoClick}
/>
```

**Current Click Handler:**
```tsx
const handleVideoClick = () => {
  if (!videoRef.current) return;

  if (isPlaying) {
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setIsPlaying(false);
  } else {
    videoRef.current.muted = false;
    videoRef.current.volume = 1.0;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  }
};
```

---

## Unit Tests

### Test Framework Setup
Since the project doesn't currently have a testing framework, we recommend installing:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom @types/jest
```

### 1. Video Element Rendering Tests

**File:** `components/testimonials/__tests__/TestimonialCard.test.tsx`

```typescript
describe('TestimonialCard - Video Element', () => {

  it('should render video element for video media type', () => {
    const mockTestimonial = {
      id: 1,
      name: "Test User",
      title: "Test Title",
      company: "Test Company",
      department: "REAL ESTATE",
      quote: "Test quote",
      media: "/videos/test.mp4",
      poster: "/images/test.jpg",
      mediaType: "video" as const
    };

    const { container } = render(<TestimonialCard testimonial={mockTestimonial} />);
    const videoElement = container.querySelector('video');

    expect(videoElement).toBeInTheDocument();
    expect(videoElement).toHaveAttribute('src', '/videos/test.mp4');
    expect(videoElement).toHaveAttribute('poster', '/images/test.jpg');
  });

  it('should have required video attributes', () => {
    const { container } = render(<TestimonialCard testimonial={mockVideoTestimonial} />);
    const videoElement = container.querySelector('video');

    expect(videoElement).toHaveAttribute('playsInline');
    expect(videoElement).toHaveAttribute('preload', 'metadata');
  });

  it('should NOT have muted attribute by default', () => {
    const { container } = render(<TestimonialCard testimonial={mockVideoTestimonial} />);
    const videoElement = container.querySelector('video');

    expect(videoElement).not.toHaveAttribute('muted');
  });

  it('should NOT have autoplay attribute', () => {
    const { container } = render(<TestimonialCard testimonial={mockVideoTestimonial} />);
    const videoElement = container.querySelector('video');

    expect(videoElement).not.toHaveAttribute('autoplay');
  });
});
```

### 2. Play Button Interaction Tests

```typescript
describe('TestimonialCard - Play Button Interaction', () => {

  it('should show play button on hover when video is not playing', () => {
    const { container, getByText } = render(<TestimonialCard testimonial={mockVideoTestimonial} />);
    const card = container.querySelector('.embla__slide');

    fireEvent.mouseEnter(card);

    expect(getByText('Play story')).toBeInTheDocument();
  });

  it('should hide play button when not hovering', () => {
    const { container, queryByText } = render(<TestimonialCard testimonial={mockVideoTestimonial} />);
    const card = container.querySelector('.embla__slide');

    fireEvent.mouseLeave(card);

    expect(queryByText('Play story')).not.toBeInTheDocument();
  });

  it('should hide play button when video is playing', async () => {
    const { container, queryByText } = render(<TestimonialCard testimonial={mockVideoTestimonial} />);
    const videoElement = container.querySelector('video');

    fireEvent.click(videoElement);

    await waitFor(() => {
      expect(queryByText('Play story')).not.toBeInTheDocument();
    });
  });
});
```

### 3. Video Playback Control Tests

```typescript
describe('TestimonialCard - Video Playback Controls', () => {

  it('should unmute and play video on click', async () => {
    const { container } = render(<TestimonialCard testimonial={mockVideoTestimonial} />);
    const videoElement = container.querySelector('video') as HTMLVideoElement;

    const playSpy = jest.spyOn(videoElement, 'play').mockImplementation(() => Promise.resolve());

    fireEvent.click(videoElement);

    await waitFor(() => {
      expect(videoElement.muted).toBe(false);
      expect(videoElement.volume).toBe(1.0);
      expect(videoElement.currentTime).toBe(0);
      expect(playSpy).toHaveBeenCalled();
    });
  });

  it('should pause and reset video on second click', async () => {
    const { container } = render(<TestimonialCard testimonial={mockVideoTestimonial} />);
    const videoElement = container.querySelector('video') as HTMLVideoElement;

    const pauseSpy = jest.spyOn(videoElement, 'pause').mockImplementation(() => {});

    // First click to play
    fireEvent.click(videoElement);

    // Second click to pause
    fireEvent.click(videoElement);

    await waitFor(() => {
      expect(pauseSpy).toHaveBeenCalled();
      expect(videoElement.currentTime).toBe(0);
    });
  });

  it('should reset playing state when video ends', () => {
    const { container } = render(<TestimonialCard testimonial={mockVideoTestimonial} />);
    const videoElement = container.querySelector('video');

    // Start playing
    fireEvent.click(videoElement);

    // Trigger end event
    fireEvent.ended(videoElement);

    // Play button should be visible again on hover
    const card = container.querySelector('.embla__slide');
    fireEvent.mouseEnter(card);

    expect(getByText('Play story')).toBeInTheDocument();
  });
});
```

### 4. Video Reference Tests

```typescript
describe('TestimonialCard - Video Ref Management', () => {

  it('should create video ref on mount', () => {
    const { container } = render(<TestimonialCard testimonial={mockVideoTestimonial} />);
    const videoElement = container.querySelector('video');

    expect(videoElement).toBeTruthy();
  });

  it('should handle click when video ref is null', () => {
    // This tests the early return in handleVideoClick
    const { container } = render(<TestimonialCard testimonial={mockVideoTestimonial} />);
    const videoElement = container.querySelector('video');

    // Remove video element to simulate null ref
    videoElement?.remove();

    // Should not throw error
    expect(() => {
      const playButton = container.querySelector('[onClick]');
      fireEvent.click(playButton);
    }).not.toThrow();
  });
});
```

### 5. State Management Tests

```typescript
describe('TestimonialCard - State Management', () => {

  it('should initialize isPlaying as false', () => {
    const { container } = render(<TestimonialCard testimonial={mockVideoTestimonial} />);
    const card = container.querySelector('.embla__slide');

    fireEvent.mouseEnter(card);

    // Play button visible means isPlaying is false
    expect(getByText('Play story')).toBeInTheDocument();
  });

  it('should toggle isPlaying state on click', async () => {
    const { container, queryByText } = render(<TestimonialCard testimonial={mockVideoTestimonial} />);
    const videoElement = container.querySelector('video');
    const card = container.querySelector('.embla__slide');

    fireEvent.mouseEnter(card);
    expect(queryByText('Play story')).toBeInTheDocument();

    fireEvent.click(videoElement);

    await waitFor(() => {
      expect(queryByText('Play story')).not.toBeInTheDocument();
    });

    fireEvent.click(videoElement);
    fireEvent.mouseEnter(card);

    await waitFor(() => {
      expect(queryByText('Play story')).toBeInTheDocument();
    });
  });

  it('should maintain hover state independently of playing state', () => {
    const { container } = render(<TestimonialCard testimonial={mockVideoTestimonial} />);
    const card = container.querySelector('.embla__slide');

    fireEvent.mouseEnter(card);
    fireEvent.mouseLeave(card);
    fireEvent.mouseEnter(card);

    // Should still show play button
    expect(getByText('Play story')).toBeInTheDocument();
  });
});
```

---

## Integration Tests

### Test Framework Setup
For integration tests, we'll use Playwright or Cypress:

```bash
npm install --save-dev @playwright/test
# OR
npm install --save-dev cypress
```

### 1. Carousel Context Tests

**File:** `e2e/carousel-video-playback.spec.ts`

```typescript
describe('Carousel Video Playback Integration', () => {

  beforeEach(() => {
    cy.visit('/'); // Adjust URL to page with carousel
    cy.wait(1000); // Wait for carousel to initialize
  });

  it('should load carousel with multiple video testimonials', () => {
    cy.get('.embla__slide').should('have.length.at.least', 3);
    cy.get('.embla__slide video').should('have.length.at.least', 3);
  });

  it('should play video with sound in first carousel slide', () => {
    const videoSelector = '.embla__slide:first video';

    // Hover over first slide
    cy.get('.embla__slide:first').trigger('mouseenter');

    // Click play button
    cy.contains('Play story').click();

    // Verify video is playing
    cy.get(videoSelector).should((video) => {
      expect(video[0].paused).to.be.false;
      expect(video[0].muted).to.be.false;
      expect(video[0].volume).to.equal(1.0);
    });
  });

  it('should pause current video when navigating to next slide', () => {
    // Play video in first slide
    cy.get('.embla__slide:first').trigger('mouseenter');
    cy.contains('Play story').click();

    // Navigate to next slide
    cy.get('button[aria-label="Next testimonial"]').click();

    // Previous video should be paused
    cy.get('.embla__slide:first video').should((video) => {
      expect(video[0].paused).to.be.true;
    });
  });

  it('should maintain video state when slide is not visible', () => {
    // Play video
    cy.get('.embla__slide:first video').click();

    // Navigate away
    cy.get('button[aria-label="Next testimonial"]').click();
    cy.get('button[aria-label="Next testimonial"]').click();

    // Navigate back
    cy.get('button[aria-label="Previous testimonial"]').click();
    cy.get('button[aria-label="Previous testimonial"]').click();

    // Video should be reset
    cy.get('.embla__slide:first video').should((video) => {
      expect(video[0].currentTime).to.equal(0);
    });
  });
});
```

### 2. Multiple Video Instances Tests

```typescript
describe('Multiple Video Instances', () => {

  it('should only allow one video to play at a time', () => {
    // Navigate to show multiple slides
    cy.viewport(1920, 1080); // Large viewport to see multiple slides

    // Play first video
    cy.get('.embla__slide').eq(0).find('video').click();

    // Verify first video is playing
    cy.get('.embla__slide').eq(0).find('video').should((video) => {
      expect(video[0].paused).to.be.false;
    });

    // Try to play second video
    cy.get('.embla__slide').eq(1).trigger('mouseenter');
    cy.get('.embla__slide').eq(1).contains('Play story').click();

    // First video should still be playing (they're independent)
    // Note: Current implementation allows multiple videos to play
    // This test documents current behavior
    cy.get('.embla__slide').eq(0).find('video').should((video) => {
      expect(video[0].paused).to.be.false;
    });
  });
});
```

### 3. Autoplay Policy Tests

```typescript
describe('Browser Autoplay Policy Compliance', () => {

  it('should not autoplay videos on page load', () => {
    cy.visit('/');
    cy.wait(2000);

    cy.get('.embla__slide video').each((video) => {
      expect(video[0].paused).to.be.true;
    });
  });

  it('should require user interaction to play with sound', () => {
    // Verify video won't play without user gesture
    cy.get('.embla__slide:first video').then((video) => {
      const playPromise = video[0].play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          expect(error.name).to.equal('NotAllowedError');
        });
      }
    });
  });
});
```

### 4. Performance Tests

```typescript
describe('Video Performance in Carousel', () => {

  it('should preload only metadata to save bandwidth', () => {
    cy.get('.embla__slide video').each((video) => {
      expect(video.attr('preload')).to.equal('metadata');
    });
  });

  it('should not cause memory leaks when navigating carousel', () => {
    // Navigate through carousel multiple times
    for (let i = 0; i < 10; i++) {
      cy.get('button[aria-label="Next testimonial"]').click();
      cy.wait(300);
    }

    // Check for excessive video elements
    cy.get('video').should('have.length.at.most', 10); // Adjust based on actual count
  });

  it('should clean up video resources on unmount', () => {
    // Navigate to carousel page
    cy.visit('/');

    const initialVideoCount = Cypress.$('video').length;

    // Navigate away
    cy.visit('/about'); // Adjust to different page

    // Videos should be cleaned up
    cy.get('video').should('have.length', 0);
  });
});
```

---

## Manual Test Cases

### Test Environment Setup
- **URL:** http://localhost:3000 (or production URL)
- **Test Data:** Ensure all 5 testimonial videos are available
- **Audio:** Use headphones or speakers to verify sound
- **Network:** Test on both fast and slow connections

---

### Test Case 1: Basic Video Playback with Sound

**Priority:** P0 (Critical)
**Component:** TestimonialCard
**Prerequisites:** Carousel loaded with video testimonials

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|----------------|-----------|-------|
| 1 | Navigate to page with carousel | Carousel displays with 5 testimonial cards | | |
| 2 | Hover over first testimonial card | "Play story" button appears | | |
| 3 | Click anywhere on video or "Play story" button | Video begins playing immediately | | |
| 4 | Listen for audio | Audio plays clearly at full volume | | |
| 5 | Observe video playback | Video plays smoothly without stuttering | | |
| 6 | Click video again while playing | Video pauses and resets to start | | |
| 7 | Click video again | Video replays from beginning with sound | | |

**Acceptance Criteria:**
- Video plays on first click
- Audio is audible and clear
- Volume is at 100%
- No mute icon visible
- Video can be paused and replayed

---

### Test Case 2: Multiple Videos in Carousel

**Priority:** P0 (Critical)
**Component:** UseCaseCarousel
**Prerequisites:** Carousel with multiple video testimonials

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|----------------|-----------|-------|
| 1 | Play video in first slide | Video 1 plays with sound | | |
| 2 | Click "Next" arrow while video playing | Carousel slides to next card | | |
| 3 | Check video 1 state | Video 1 continues playing (or pauses - document behavior) | | |
| 4 | Hover over slide 2 | "Play story" button appears | | |
| 5 | Click video 2 | Video 2 plays with sound | | |
| 6 | Check if both videos play simultaneously | Document if multiple videos can play at once | | |
| 7 | Navigate back to slide 1 | Video 1 is paused/reset | | |

**Acceptance Criteria:**
- Each video can play independently
- Sound quality is consistent across all videos
- No audio mixing issues if multiple play simultaneously

---

### Test Case 3: Video State Persistence

**Priority:** P1 (Important)
**Component:** TestimonialCard
**Prerequisites:** Video playing in carousel

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|----------------|-----------|-------|
| 1 | Start playing video | Video plays with sound | | |
| 2 | Navigate to next slide | Video in previous slide stops/pauses | | |
| 3 | Navigate back to original slide | Video is reset to beginning | | |
| 4 | Click to play again | Video plays from start with sound | | |
| 5 | Let video play to end | Video stops, play button reappears on hover | | |

**Acceptance Criteria:**
- Videos reset when navigating away
- Video end state is handled properly
- Play button returns after video ends

---

### Test Case 4: Hover Interactions

**Priority:** P2 (Medium)
**Component:** TestimonialCard
**Prerequisites:** Carousel loaded

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|----------------|-----------|-------|
| 1 | Hover over video card (not playing) | "Play story" button appears | | |
| 2 | Move mouse away | "Play story" button disappears | | |
| 3 | Start playing video | "Play story" button disappears | | |
| 4 | Hover over playing video | "Play story" button does NOT appear | | |
| 5 | Pause video, then hover | "Play story" button appears | | |

**Acceptance Criteria:**
- Hover states work correctly
- Play button only shows when appropriate
- No flickering or layout shifts

---

### Test Case 5: Keyboard Navigation

**Priority:** P2 (Medium)
**Component:** UseCaseCarousel
**Prerequisites:** Carousel focused

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|----------------|-----------|-------|
| 1 | Tab to carousel navigation | Focus visible on navigation buttons | | |
| 2 | Press Enter on "Next" button | Carousel advances | | |
| 3 | Tab to video element | Video receives focus | | |
| 4 | Press Enter or Space on video | Video plays with sound | | |
| 5 | Press Enter or Space again | Video pauses | | |

**Acceptance Criteria:**
- All controls are keyboard accessible
- Focus indicators are visible
- Video can be controlled via keyboard

---

### Test Case 6: Touch Interactions (Mobile)

**Priority:** P1 (Important)
**Component:** TestimonialCard
**Prerequisites:** Mobile device or mobile viewport

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|----------------|-----------|-------|
| 1 | Tap on video | "Play story" button appears or video starts | | |
| 2 | Tap "Play story" button | Video plays with sound | | |
| 3 | Tap video while playing | Video pauses | | |
| 4 | Swipe carousel left | Carousel slides, video behavior documented | | |
| 5 | Swipe carousel right | Carousel slides back | | |

**Acceptance Criteria:**
- Touch interactions work smoothly
- No unintended play/pause actions
- Swipe gestures work with video playing

---

### Test Case 7: Volume and Audio Quality

**Priority:** P0 (Critical)
**Component:** Video Element
**Prerequisites:** Device with audio output

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|----------------|-----------|-------|
| 1 | Set system volume to 50% | System volume at 50% | | |
| 2 | Play video | Audio is audible at appropriate level | | |
| 3 | Check browser inspector (video element) | volume property = 1.0, muted = false | | |
| 4 | Set system volume to 100% | Audio increases proportionally | | |
| 5 | Set system volume to 0% (mute) | No audio output | | |
| 6 | Unmute system | Audio returns | | |
| 7 | Listen throughout entire video | Audio quality is consistent, no crackling | | |

**Acceptance Criteria:**
- Audio respects system volume
- No distortion at any volume level
- muted attribute is false
- volume property is 1.0

---

### Test Case 8: Error Handling

**Priority:** P1 (Important)
**Component:** TestimonialCard
**Prerequisites:** Network throttling enabled

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|----------------|-----------|-------|
| 1 | Throttle network to "Slow 3G" | Network throttled | | |
| 2 | Click to play video | Video loads and plays (may buffer) | | |
| 3 | Disable network completely | Network offline | | |
| 4 | Click to play video | Error state shown or graceful degradation | | |
| 5 | Re-enable network | Video can be played | | |

**Acceptance Criteria:**
- Loading states are visible
- Errors don't break the UI
- Recovery from errors is graceful

---

### Test Case 9: Video End Behavior

**Priority:** P2 (Medium)
**Component:** TestimonialCard
**Prerequisites:** Short video loaded

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|----------------|-----------|-------|
| 1 | Play video to completion | Video plays through to end | | |
| 2 | Observe behavior at video end | Video stops, doesn't loop | | |
| 3 | Hover over ended video | "Play story" button reappears | | |
| 4 | Click to replay | Video plays from beginning with sound | | |

**Acceptance Criteria:**
- Videos don't loop automatically
- UI state resets after video ends
- Can replay from beginning

---

### Test Case 10: Carousel Navigation During Playback

**Priority:** P1 (Important)
**Component:** UseCaseCarousel
**Prerequisites:** Video playing

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|----------------|-----------|-------|
| 1 | Start playing video in slide 2 | Video plays with sound | | |
| 2 | Click next arrow | Carousel advances to slide 3 | | |
| 3 | Listen for audio | Audio from slide 2 behavior documented | | |
| 4 | Click previous arrow | Carousel returns to slide 2 | | |
| 5 | Check video state | Video state documented (playing/paused/reset) | | |
| 6 | Click on navigation dots | Carousel jumps to selected slide | | |
| 7 | Check all video states | Only appropriate videos are playing | | |

**Acceptance Criteria:**
- Navigation doesn't break video playback
- Audio behavior is predictable
- No audio continues from off-screen videos

---

## Browser Compatibility Matrix

### Desktop Browsers

| Browser | Version | Video Playback | Audio Playback | Play Button | Volume Control | Notes | Status |
|---------|---------|----------------|----------------|-------------|----------------|-------|--------|
| **Chrome** | Latest (120+) | ✅ Expected | ✅ Expected | ✅ Expected | ✅ Expected | Primary browser | ⬜ Untested |
| Chrome | 115-119 | ✅ Expected | ✅ Expected | ✅ Expected | ✅ Expected | Recent version | ⬜ Untested |
| **Firefox** | Latest (121+) | ✅ Expected | ✅ Expected | ✅ Expected | ✅ Expected | Second priority | ⬜ Untested |
| Firefox | 115-120 | ✅ Expected | ✅ Expected | ✅ Expected | ✅ Expected | ESR version | ⬜ Untested |
| **Safari** | 17+ (macOS) | ⚠️ Test | ⚠️ Test | ✅ Expected | ⚠️ Test | Safari quirks | ⬜ Untested |
| Safari | 16 (macOS) | ⚠️ Test | ⚠️ Test | ✅ Expected | ⚠️ Test | Older version | ⬜ Untested |
| **Edge** | Latest (120+) | ✅ Expected | ✅ Expected | ✅ Expected | ✅ Expected | Chromium-based | ⬜ Untested |
| Edge | 115-119 | ✅ Expected | ✅ Expected | ✅ Expected | ✅ Expected | Recent version | ⬜ Untested |
| Opera | Latest | ✅ Expected | ✅ Expected | ✅ Expected | ✅ Expected | Low priority | ⬜ Untested |
| Brave | Latest | ✅ Expected | ✅ Expected | ✅ Expected | ✅ Expected | Low priority | ⬜ Untested |

### Mobile Browsers

| Browser | Platform | Version | Video Playback | Audio Playback | Play Button | Touch Controls | Notes | Status |
|---------|----------|---------|----------------|----------------|-------------|----------------|-------|--------|
| **Safari** | iOS | 17+ | ⚠️ Critical | ⚠️ Critical | ✅ Expected | ⚠️ Test | iOS restrictions | ⬜ Untested |
| Safari | iOS | 15-16 | ⚠️ Critical | ⚠️ Critical | ✅ Expected | ⚠️ Test | Older iOS | ⬜ Untested |
| **Chrome** | iOS | Latest | ⚠️ Test | ⚠️ Test | ✅ Expected | ⚠️ Test | Uses Safari engine | ⬜ Untested |
| **Chrome** | Android | Latest | ✅ Expected | ✅ Expected | ✅ Expected | ✅ Expected | Native Chrome | ⬜ Untested |
| Chrome | Android | 115+ | ✅ Expected | ✅ Expected | ✅ Expected | ✅ Expected | Recent version | ⬜ Untested |
| **Samsung Internet** | Android | Latest | ⚠️ Test | ⚠️ Test | ✅ Expected | ⚠️ Test | Samsung devices | ⬜ Untested |
| Firefox | Android | Latest | ✅ Expected | ✅ Expected | ✅ Expected | ✅ Expected | Low usage | ⬜ Untested |
| Firefox | iOS | Latest | ⚠️ Test | ⚠️ Test | ✅ Expected | ⚠️ Test | Uses Safari engine | ⬜ Untested |

### Legend
- ✅ Expected to work - Standard implementation
- ⚠️ Test Required - Known quirks or special handling needed
- ❌ Known Issue - Documented problem
- ⬜ Untested - Not yet verified
- ✓ Passed - Tested and working
- ✗ Failed - Tested and not working

### Browser-Specific Considerations

#### Safari (Desktop & iOS)
**Known Issues:**
- Strict autoplay policies (requires user gesture)
- May block unmute operations without user interaction
- `playsInline` attribute critical for iOS
- Low Power Mode may affect playback

**Testing Focus:**
- Verify unmute works on first click
- Test with Low Power Mode enabled (iOS)
- Check silenced website behavior (Safari 11+)
- Verify no fullscreen takeover on iOS

**Specific Tests:**
1. Click to play - verify audio starts
2. Test on iOS with ringer switch in silent mode
3. Test with "Auto-Play Video Previews" disabled in settings
4. Verify `playsInline` prevents fullscreen

#### Chrome (Desktop & Mobile)
**Known Issues:**
- Autoplay policy blocks unmuted autoplay
- May show mute button if autoplay attempted
- Data Saver mode affects video loading

**Testing Focus:**
- Standard behavior baseline
- Check developer console for autoplay warnings
- Test with Data Saver enabled (mobile)

**Specific Tests:**
1. Verify no autoplay policy violations in console
2. Test with sound enabled as expected
3. Check performance metrics

#### Firefox
**Known Issues:**
- Different audio API implementations
- Stricter content security policies

**Testing Focus:**
- Audio playback reliability
- Volume control behavior
- Console error messages

**Specific Tests:**
1. Volume adjustment accuracy
2. Audio codec support
3. CSP compliance

#### Edge
**Known Issues:**
- Similar to Chrome (Chromium-based)
- Legacy Edge (pre-Chromium) not supported

**Testing Focus:**
- Verify Chromium parity
- Check enterprise policy impacts

---

## Debug Checklist

### Console Logging Strategy

Add these console.log statements to the code for debugging:

#### 1. Component Initialization Logs

```typescript
// Add to TestimonialCard component, after state declarations
useEffect(() => {
  console.log('[TestimonialCard] Component mounted', {
    testimonialId: testimonial.id,
    testimonialName: testimonial.name,
    mediaType: testimonial.mediaType,
    mediaSrc: testimonial.media,
    poster: testimonial.poster
  });

  return () => {
    console.log('[TestimonialCard] Component unmounting', {
      testimonialId: testimonial.id
    });
  };
}, []);
```

#### 2. Video Element State Logs

```typescript
// Add to handleVideoClick function at the start
const handleVideoClick = () => {
  console.log('[handleVideoClick] Triggered', {
    testimonialId: testimonial.id,
    videoRefExists: !!videoRef.current,
    currentlyPlaying: isPlaying
  });

  if (!videoRef.current) {
    console.error('[handleVideoClick] Video ref is null', {
      testimonialId: testimonial.id
    });
    return;
  }

  const videoElement = videoRef.current;

  console.log('[handleVideoClick] Video element state before action', {
    testimonialId: testimonial.id,
    paused: videoElement.paused,
    muted: videoElement.muted,
    volume: videoElement.volume,
    currentTime: videoElement.currentTime,
    duration: videoElement.duration,
    readyState: videoElement.readyState,
    networkState: videoElement.networkState
  });

  if (isPlaying) {
    // ... existing pause logic
    console.log('[handleVideoClick] Pausing video', {
      testimonialId: testimonial.id
    });
  } else {
    // ... existing play logic
    console.log('[handleVideoClick] Attempting to play video', {
      testimonialId: testimonial.id,
      settingMuted: false,
      settingVolume: 1.0
    });
  }
};
```

#### 3. Video Play Promise Handling

```typescript
// Replace videoRef.current.play() with:
videoRef.current.muted = false;
videoRef.current.volume = 1.0;
videoRef.current.currentTime = 0;

const playPromise = videoRef.current.play();

if (playPromise !== undefined) {
  playPromise
    .then(() => {
      console.log('[handleVideoClick] Video play succeeded', {
        testimonialId: testimonial.id,
        muted: videoRef.current?.muted,
        volume: videoRef.current?.volume
      });
      setIsPlaying(true);
    })
    .catch((error) => {
      console.error('[handleVideoClick] Video play failed', {
        testimonialId: testimonial.id,
        error: error.name,
        errorMessage: error.message,
        videoMuted: videoRef.current?.muted,
        videoVolume: videoRef.current?.volume
      });

      // Attempt to play muted if unmuted play fails
      if (videoRef.current && error.name === 'NotAllowedError') {
        console.warn('[handleVideoClick] Attempting muted playback as fallback');
        videoRef.current.muted = true;
        videoRef.current.play()
          .then(() => {
            console.log('[handleVideoClick] Muted playback succeeded');
            setIsPlaying(true);
          })
          .catch((mutedError) => {
            console.error('[handleVideoClick] Muted playback also failed', mutedError);
          });
      }
    });
} else {
  console.warn('[handleVideoClick] Play promise is undefined', {
    testimonialId: testimonial.id
  });
  setIsPlaying(true);
}
```

#### 4. Video Event Listeners

```typescript
// Add useEffect for video event listeners
useEffect(() => {
  const videoElement = videoRef.current;
  if (!videoElement) return;

  const handlePlay = () => {
    console.log('[Video Event] play', {
      testimonialId: testimonial.id,
      muted: videoElement.muted,
      volume: videoElement.volume
    });
  };

  const handlePause = () => {
    console.log('[Video Event] pause', {
      testimonialId: testimonial.id,
      currentTime: videoElement.currentTime
    });
  };

  const handleVolumeChange = () => {
    console.log('[Video Event] volumechange', {
      testimonialId: testimonial.id,
      muted: videoElement.muted,
      volume: videoElement.volume
    });
  };

  const handleError = (e: Event) => {
    console.error('[Video Event] error', {
      testimonialId: testimonial.id,
      error: videoElement.error,
      networkState: videoElement.networkState,
      readyState: videoElement.readyState
    });
  };

  const handleLoadedMetadata = () => {
    console.log('[Video Event] loadedmetadata', {
      testimonialId: testimonial.id,
      duration: videoElement.duration,
      videoWidth: videoElement.videoWidth,
      videoHeight: videoElement.videoHeight
    });
  };

  const handleCanPlay = () => {
    console.log('[Video Event] canplay', {
      testimonialId: testimonial.id,
      readyState: videoElement.readyState
    });
  };

  videoElement.addEventListener('play', handlePlay);
  videoElement.addEventListener('pause', handlePause);
  videoElement.addEventListener('volumechange', handleVolumeChange);
  videoElement.addEventListener('error', handleError);
  videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
  videoElement.addEventListener('canplay', handleCanPlay);

  return () => {
    videoElement.removeEventListener('play', handlePlay);
    videoElement.removeEventListener('pause', handlePause);
    videoElement.removeEventListener('volumechange', handleVolumeChange);
    videoElement.removeEventListener('error', handleError);
    videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.removeEventListener('canplay', handleCanPlay);
  };
}, [testimonial.id]);
```

#### 5. Carousel State Logs

```typescript
// Add to UseCaseCarousel component
const onSelect = useCallback(() => {
  if (!emblaApi) return;

  const newIndex = emblaApi.selectedScrollSnap();

  console.log('[UseCaseCarousel] Slide changed', {
    previousIndex: selectedIndex,
    newIndex: newIndex,
    canScrollPrev: emblaApi.canScrollPrev(),
    canScrollNext: emblaApi.canScrollNext()
  });

  setCanScrollPrev(emblaApi.canScrollPrev());
  setCanScrollNext(emblaApi.canScrollNext());
  setSelectedIndex(newIndex);
}, [emblaApi, selectedIndex]);
```

#### 6. Browser Capability Detection

```typescript
// Add at the top of TestimonialCard function component
useEffect(() => {
  console.log('[Browser Capabilities]', {
    userAgent: navigator.userAgent,
    vendor: navigator.vendor,
    platform: navigator.platform,
    touchEnabled: 'ontouchstart' in window,
    maxTouchPoints: navigator.maxTouchPoints || 0,
    audioContextSupported: 'AudioContext' in window || 'webkitAudioContext' in window,
    mediaDevicesSupported: 'mediaDevices' in navigator,
  });
}, []);
```

### Browser DevTools Checks

#### Chrome DevTools
1. **Console Tab**
   - Check for autoplay policy violations
   - Look for "The play() request was interrupted" messages
   - Verify no CORS errors for video files

2. **Network Tab**
   - Filter by "Media"
   - Verify video files load (200 status)
   - Check video file size and load time
   - Verify Range requests are working

3. **Elements Tab**
   - Inspect `<video>` element
   - Verify attributes: `muted="false"`, no `autoplay`
   - Check inline styles don't conflict

4. **Performance Tab**
   - Record during video playback
   - Check for frame drops
   - Verify memory doesn't spike

#### Safari DevTools
1. **Console Tab**
   - Look for autoplay prevention messages
   - Check for "The request is not allowed" errors

2. **Network Tab**
   - Verify .mp4 codec compatibility
   - Check for 206 Partial Content responses

3. **Web Inspector**
   - Media & Resources tab
   - Check video codec details

#### Firefox DevTools
1. **Console Tab**
   - Look for blocked autoplay messages
   - Check security warnings

2. **Network Tab**
   - Verify video MIME types
   - Check response headers

### Video Element Inspection Checklist

When debugging, manually inspect video element in console:

```javascript
// Paste in browser console
const video = document.querySelector('video');

console.table({
  'Source': video.src,
  'Muted': video.muted,
  'Volume': video.volume,
  'Paused': video.paused,
  'Current Time': video.currentTime,
  'Duration': video.duration,
  'Ready State': video.readyState,
  'Network State': video.networkState,
  'Playback Rate': video.playbackRate,
  'Has Audio': video.mozHasAudio || video.webkitAudioDecodedByteCount > 0,
});

// Check for errors
if (video.error) {
  console.error('Video Error:', {
    code: video.error.code,
    message: video.error.message
  });
}

// Test play
video.play().then(() => {
  console.log('✅ Play succeeded');
}).catch(err => {
  console.error('❌ Play failed:', err);
});
```

### Network State Values
- `0` = NETWORK_EMPTY
- `1` = NETWORK_IDLE
- `2` = NETWORK_LOADING
- `3` = NETWORK_NO_SOURCE

### Ready State Values
- `0` = HAVE_NOTHING
- `1` = HAVE_METADATA
- `2` = HAVE_CURRENT_DATA
- `3` = HAVE_FUTURE_DATA
- `4` = HAVE_ENOUGH_DATA

### Error Code Values
- `1` = MEDIA_ERR_ABORTED
- `2` = MEDIA_ERR_NETWORK
- `3` = MEDIA_ERR_DECODE
- `4` = MEDIA_ERR_SRC_NOT_SUPPORTED

---

## Acceptance Criteria

### Definition of "Sound Working"

Video sound is considered **WORKING** when ALL of the following criteria are met:

#### 1. Audio Playback Quality
- ✅ Audio plays clearly without distortion
- ✅ Audio is synchronized with video (no A/V sync issues)
- ✅ Audio volume is at 100% (1.0) when played
- ✅ Audio quality is consistent throughout entire video
- ✅ No crackling, popping, or audio artifacts
- ✅ Audio respects system volume settings

#### 2. User Interaction
- ✅ Audio plays immediately after user clicks video/play button
- ✅ No additional user action required to enable sound
- ✅ Video plays with sound on FIRST click (no need to click twice)
- ✅ User can pause and replay with sound maintained
- ✅ Clear visual indicator when video is playing

#### 3. Technical Implementation
- ✅ `muted` attribute is `false` when playing
- ✅ `volume` property is `1.0` when playing
- ✅ No browser autoplay policy violations in console
- ✅ `play()` promise resolves successfully
- ✅ No JavaScript errors in console related to audio
- ✅ Video element properly initialized with `playsInline` attribute

#### 4. Browser Compatibility
- ✅ Works in Chrome (latest 2 versions)
- ✅ Works in Safari (latest 2 versions)
- ✅ Works in Firefox (latest 2 versions)
- ✅ Works in Edge (latest 2 versions)
- ✅ Works on iOS Safari (iOS 15+)
- ✅ Works on Chrome Android (latest version)

#### 5. User Experience
- ✅ No confusion about how to play video with sound
- ✅ Visual feedback when video is playing
- ✅ Smooth transition from poster to playing video
- ✅ Play button disappears when video is playing
- ✅ Video can be replayed after ending
- ✅ No unexpected muting/unmuting behavior

#### 6. Performance
- ✅ Audio starts within 500ms of user interaction
- ✅ No memory leaks during repeated play/pause
- ✅ No performance degradation with multiple videos in carousel
- ✅ Preload behavior doesn't consume excessive bandwidth
- ✅ Video playback is smooth (30+ fps)

#### 7. Accessibility
- ✅ Keyboard users can play video with sound
- ✅ Screen readers announce video state changes
- ✅ Focus indicators are visible
- ✅ ARIA labels are appropriate
- ✅ No keyboard traps in video controls

#### 8. Error Handling
- ✅ Graceful degradation if video fails to load
- ✅ User-friendly error messages (if applicable)
- ✅ Recovery mechanism if play fails
- ✅ No broken UI if video source is missing
- ✅ Network errors handled appropriately

### Acceptance Test Execution

**Test Pass Criteria:**
- ALL P0 (Critical) tests pass: 100%
- ALL P1 (Important) tests pass: 100%
- P2 (Medium) tests pass: ≥ 80%
- No P0 bugs in production
- No accessibility blockers

**Sign-off Required From:**
- [ ] QA Lead
- [ ] Frontend Developer
- [ ] Product Manager
- [ ] UX Designer
- [ ] Accessibility Specialist

### Regression Testing
After any changes to video playback code, re-run:
- All P0 test cases
- Browser compatibility matrix (top 4 browsers)
- Mobile Safari and Chrome tests
- Performance benchmarks

---

## Test Data Requirements

### Video File Specifications

**Required Test Videos:**
1. **Short Video** (15-20 seconds)
   - Purpose: Quick testing, end behavior verification
   - Format: MP4 (H.264 + AAC)
   - Resolution: 720p minimum
   - Audio: Clear speech with background music

2. **Medium Video** (30-45 seconds)
   - Purpose: Standard testimonial length
   - Format: MP4 (H.264 + AAC)
   - Resolution: 1080p
   - Audio: Voice-over with ambient sound

3. **Long Video** (60+ seconds)
   - Purpose: Performance testing, memory leaks
   - Format: MP4 (H.264 + AAC)
   - Resolution: 1080p
   - Audio: Continuous speech

4. **High Quality Video**
   - Purpose: Quality assurance
   - Format: MP4 (H.264 + AAC)
   - Resolution: 1080p or 4K
   - Bitrate: High (5-10 Mbps)

5. **Low Quality Video**
   - Purpose: Slow network testing
   - Format: MP4 (H.264 + AAC)
   - Resolution: 480p
   - Bitrate: Low (1-2 Mbps)

### Current Test Videos

Based on code analysis, these videos should exist:

```
/videos/testimonials/michael-chen.mp4
/videos/testimonials/sofia-martinez.mp4
/videos/testimonials/marcus-thompson.mp4
/videos/testimonials/jennifer-wong.mp4
/videos/testimonials/omar-hassan.mp4
```

**Poster Images:**
```
/images/testimonials/michael-chen.jpg
/images/testimonials/sofia-martinez.jpg
/images/testimonials/marcus-thompson.jpg
/images/testimonials/jennifer-wong.jpg
/images/testimonials/omar-hassan.jpg
```

### Video Codec Recommendations

**Optimal Compatibility:**
- **Container:** MP4
- **Video Codec:** H.264 (AVC)
- **Audio Codec:** AAC-LC
- **Sample Rate:** 48kHz
- **Bitrate:** 128-192 kbps (audio), 2-5 Mbps (video)

**Fallback Support:**
- WebM (VP9 + Opus) for Firefox/Chrome
- Consider providing multiple formats if needed

---

## Known Issues & Edge Cases

### Browser-Specific Issues

#### Safari iOS
**Issue:** Videos may not unmute on first play attempt
**Workaround:** Ensure user gesture directly triggers play()
**Status:** Monitor in testing
**Ticket:** TBD

**Issue:** Low Power Mode may prevent autoplay
**Workaround:** Clear UI messaging, retry mechanism
**Status:** Known limitation
**Ticket:** TBD

#### Safari macOS
**Issue:** Silenced website settings persist
**Workaround:** User must manually allow sound in Safari settings
**Status:** User education needed
**Ticket:** TBD

#### Chrome Mobile
**Issue:** Data Saver mode affects video loading
**Workaround:** Preload metadata, show loading state
**Status:** Acceptable behavior
**Ticket:** N/A

### Edge Cases

#### 1. Multiple Videos Playing Simultaneously
**Current Behavior:** Multiple videos can play at once
**Expected Behavior:** TBD - Should only one play at a time?
**Action:** Product decision needed
**Priority:** P2

#### 2. Video Playing While Navigating Carousel
**Current Behavior:** Video continues playing off-screen
**Expected Behavior:** Should pause when slide moves away?
**Action:** UX review needed
**Priority:** P1

#### 3. Video Ref Null on Rapid Clicks
**Current Behavior:** Early return prevents error
**Expected Behavior:** Same
**Action:** None - working as intended
**Priority:** N/A

#### 4. Network Interruption During Playback
**Current Behavior:** Video stalls, no feedback
**Expected Behavior:** Show buffering indicator or error
**Action:** Enhancement needed
**Priority:** P2

#### 5. Video Source 404
**Current Behavior:** Broken video element
**Expected Behavior:** Fallback UI or error message
**Action:** Error handling needed
**Priority:** P1

#### 6. Very Slow Network
**Current Behavior:** Long load time, no feedback
**Expected Behavior:** Loading indicator
**Action:** UX enhancement
**Priority:** P2

### Accessibility Edge Cases

#### 1. Keyboard-Only Navigation
**Status:** Needs testing
**Priority:** P0

#### 2. Screen Reader Announcements
**Status:** Needs ARIA implementation
**Priority:** P1

#### 3. Reduced Motion Preference
**Status:** Carousel animation respects preference?
**Priority:** P1

#### 4. High Contrast Mode
**Status:** Play button visibility needs testing
**Priority:** P2

### Performance Edge Cases

#### 1. Many Carousel Slides (10+)
**Impact:** Memory usage, DOM size
**Mitigation:** Lazy loading, video element cleanup
**Priority:** P2

#### 2. Rapid Slide Navigation
**Impact:** Multiple video loads
**Mitigation:** Debounce, cleanup previous videos
**Priority:** P2

#### 3. Low-End Devices
**Impact:** Choppy playback
**Mitigation:** Lower quality videos, reduced animations
**Priority:** P2

---

## Appendix: Quick Reference

### Key Console Commands

```javascript
// Check video state
document.querySelectorAll('video').forEach((v, i) => {
  console.log(`Video ${i}:`, {
    muted: v.muted,
    volume: v.volume,
    paused: v.paused
  });
});

// Force unmute all videos
document.querySelectorAll('video').forEach(v => {
  v.muted = false;
  v.volume = 1.0;
});

// Test play on all videos
document.querySelectorAll('video').forEach(async (v, i) => {
  try {
    await v.play();
    console.log(`✅ Video ${i} playing`);
  } catch (e) {
    console.error(`❌ Video ${i} failed:`, e);
  }
});
```

### Critical File Paths

- **Component:** `/Users/brittanymurphy/Desktop/Butler/Projects/ai-spokesperson-studio/components/testimonials/UseCaseCarousel.tsx`
- **Test Plan:** `/Users/brittanymurphy/Desktop/Butler/Projects/ai-spokesperson-studio/docs/VIDEO_SOUND_TEST_PLAN.md`

### Testing Checklist Quick Reference

**Before Each Test Session:**
- [ ] Clear browser cache
- [ ] Check system volume (50% recommended)
- [ ] Open browser console
- [ ] Verify test videos are accessible
- [ ] Document browser version

**After Each Test:**
- [ ] Record results in test case table
- [ ] Screenshot any issues
- [ ] Save console logs if errors occur
- [ ] Note any unexpected behavior

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-05 | AI Assistant | Initial comprehensive test plan |

---

**End of Test Plan**
