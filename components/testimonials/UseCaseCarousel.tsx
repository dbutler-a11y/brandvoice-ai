"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

// Department badge color mapping - soft pastel tones
const departmentColors: Record<string, { bg: string; text: string }> = {
  "REAL ESTATE": { bg: "bg-sky-300/90", text: "text-sky-900" },
  HEALTHCARE: { bg: "bg-violet-300/90", text: "text-violet-900" },
  FITNESS: { bg: "bg-amber-200/90", text: "text-amber-900" },
  LEGAL: { bg: "bg-emerald-300/90", text: "text-emerald-900" },
  "E-COMMERCE": { bg: "bg-rose-300/90", text: "text-rose-900" },
  COACHING: { bg: "bg-orange-200/90", text: "text-orange-900" },
  RESTAURANT: { bg: "bg-red-300/90", text: "text-red-900" },
  FINANCE: { bg: "bg-teal-300/90", text: "text-teal-900" },
};

interface Testimonial {
  id: number;
  name: string;
  title: string;
  company: string;
  department: string;
  quote: string;
  media: string;
  poster?: string;
  mediaType: "image" | "video";
}

// Extended testimonials with duplicates for testing carousel
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Michael Chen",
    title: "Broker/Owner",
    company: "Chen Premier Realty",
    department: "REAL ESTATE",
    quote: "BrandVoice Studio transformed how I market my listings.",
    media: "/videos/testimonials/michael-chen.mp4",
    poster: "/images/testimonials/michael-chen.jpg",
    mediaType: "video",
  },
  {
    id: 2,
    name: "Sofia Martinez",
    title: "Founder & Medical Director",
    company: "Glow Aesthetics Med Spa",
    department: "HEALTHCARE",
    quote: "Now I have a consistent presence on social media without lifting a finger.",
    media: "/videos/testimonials/sofia-martinez.mp4",
    poster: "/images/testimonials/sofia-martinez.jpg",
    mediaType: "video",
  },
  {
    id: 3,
    name: "Marcus Thompson",
    title: "Owner & Head Coach",
    company: "Elite Performance Fitness",
    department: "FITNESS",
    quote: "My gym membership inquiries shot up within the first month.",
    media: "/videos/testimonials/marcus-thompson.mp4",
    poster: "/images/testimonials/marcus-thompson.jpg",
    mediaType: "video",
  },
  {
    id: 4,
    name: "Jennifer Wong",
    title: "Managing Partner",
    company: "Wong & Associates Law",
    department: "LEGAL",
    quote: "I've received more quality leads in 2 months than the previous year.",
    media: "/videos/testimonials/jennifer-wong.mp4",
    poster: "/images/testimonials/jennifer-wong.jpg",
    mediaType: "video",
  },
  {
    id: 5,
    name: "Omar Hassan",
    title: "Founder & CEO",
    company: "Luxe Home Goods",
    department: "E-COMMERCE",
    quote: "The AI spokesperson videos have become our top-performing ads.",
    media: "/videos/testimonials/omar-hassan.mp4",
    poster: "/images/testimonials/omar-hassan.jpg",
    mediaType: "video",
  },
];

interface TestimonialCardProps {
  testimonial: Testimonial;
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const departmentColor =
    departmentColors[testimonial.department] || departmentColors["REAL ESTATE"];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };
  }, []);

  const handleVideoClick = async () => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    if (isPlaying) {
      // Stop if playing
      video.pause();
      video.currentTime = 0;
      setIsPlaying(false);
    } else {
      // Play with sound - unmute and play in direct response to click
      video.muted = false;
      video.volume = 1.0;
      video.currentTime = 0;

      try {
        await video.play();
        setIsPlaying(true);
      } catch (error) {
        console.warn('Unmuted playback failed, trying muted:', error);
        // Fallback to muted if browser blocks sound
        video.muted = true;
        try {
          await video.play();
          setIsPlaying(true);
        } catch (mutedError) {
          console.error('Playback failed:', mutedError);
        }
      }
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="embla__slide relative rounded-2xl sm:rounded-3xl overflow-hidden group flex-[0_0_300px] sm:flex-[0_0_360px] md:flex-[0_0_420px] lg:flex-[0_0_480px] mx-3 sm:mx-4 md:mx-5 lg:mx-6 aspect-[3/4] shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {testimonial.mediaType === "video" ? (
          <>
            {/* Video - no native controls */}
            <video
              ref={videoRef}
              src={testimonial.media}
              poster={testimonial.poster}
              className="w-full h-full object-cover cursor-pointer"
              muted
              playsInline
              preload="metadata"
              onEnded={handleVideoEnd}
              onClick={handleVideoClick}
            />
            {/* Play story button - shows on hover when not playing */}
            {!isPlaying && isHovered && (
              <div
                onClick={handleVideoClick}
                className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white text-gray-900 rounded-full pl-3 pr-5 py-2.5 shadow-lg hover:shadow-xl transition-all hover:scale-105 z-20 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-gray-900" />
                <span className="font-semibold text-sm">Play story</span>
              </div>
            )}
          </>
        ) : (
          <Image
            src={testimonial.media}
            alt={testimonial.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 360px, 400px"
            priority
          />
        )}
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 pointer-events-none" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-between p-4 sm:p-5 md:p-6">
        {/* Top Section: Department Badge & Company */}
        <div className="flex items-start justify-between gap-2">
          {/* Department Badge */}
          <span
            className={`${departmentColor.bg} ${departmentColor.text} px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[8px] sm:text-[10px] font-bold uppercase tracking-wider shrink-0`}
          >
            {testimonial.department}
          </span>

          {/* Company Name - Top Right */}
          <p className="text-white/90 text-[10px] sm:text-xs font-semibold text-right leading-tight drop-shadow-lg truncate max-w-[100px] sm:max-w-[130px]">
            {testimonial.company}
          </p>
        </div>

        {/* Bottom Section: Quote & Person Info */}
        <div className="space-y-2 sm:space-y-3">
          {/* Quote */}
          <blockquote className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold leading-snug drop-shadow-2xl">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>

          {/* Person Info */}
          <div className="flex items-center gap-1.5">
            <p className="text-white text-xs sm:text-sm font-semibold drop-shadow-lg">
              {testimonial.name}
            </p>
            <span className="text-white/50 text-xs">·</span>
            <p className="text-white/70 text-[10px] sm:text-xs drop-shadow-lg truncate">
              {testimonial.title}
            </p>
          </div>
        </div>
      </div>

      {/* Subtle border on hover */}
      <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/20 rounded-xl sm:rounded-2xl transition-all duration-300 pointer-events-none z-20" />
    </div>
  );
}

export function UseCaseCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const [canScrollPrev, setCanScrollPrev] = useState(true);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full">
      {/* Left Fade Gradient - wider for more dramatic fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-40 lg:w-56 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent z-10 pointer-events-none" />

      {/* Right Fade Gradient - wider for more dramatic fade */}
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-40 lg:w-56 bg-gradient-to-l from-gray-900 via-gray-900/80 to-transparent z-10 pointer-events-none" />

      {/* Embla Carousel */}
      <div className="embla overflow-hidden py-8" ref={emblaRef}>
        <div className="embla__container flex px-4 sm:px-8 md:px-12">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-gray-100 text-gray-800 rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </button>

      <button
        onClick={scrollNext}
        disabled={!canScrollNext}
        className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-gray-100 text-gray-800 rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Next testimonial"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </button>

      {/* Scroll Indicator Dots - Hidden on mobile for cleaner look */}
      <div className="hidden sm:flex justify-center gap-1.5 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              selectedIndex === index
                ? "bg-white w-6"
                : "bg-white/30 hover:bg-white/50 w-1.5"
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
