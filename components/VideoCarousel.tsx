'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'

type VideoItem = {
  id: string
  title: string
  niche: string
  duration: string
  thumbnail: string
  videoUrl?: string
  featured?: boolean
  aspectRatio?: 'vertical' | 'square'
}

type VideoCarouselProps = {
  videos: VideoItem[]
  onVideoClick?: (video: VideoItem) => void
  speed?: number
  direction?: 'forward' | 'backward'
  className?: string
}

export default function VideoCarousel({
  videos,
  onVideoClick,
  speed = 0.5,
  direction = 'forward',
  className = ''
}: VideoCarouselProps) {
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null)
  const [tappedVideo, setTappedVideo] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [hasDragged, setHasDragged] = useState(false)

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      dragFree: true,
      containScroll: false,
      align: 'start',
    },
    [
      AutoScroll({
        speed,
        direction,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        playOnInit: true,
      }),
    ]
  )

  const onPointerDown = useCallback(() => {
    setHasDragged(false)
    const autoScroll = emblaApi?.plugins()?.autoScroll
    if (autoScroll) {
      setIsPlaying(false)
    }
  }, [emblaApi])

  const onPointerUp = useCallback(() => {
    const autoScroll = emblaApi?.plugins()?.autoScroll
    if (autoScroll) {
      setTimeout(() => {
        autoScroll.play()
        setIsPlaying(true)
      }, 1000)
    }
  }, [emblaApi])

  // Track if user is dragging (moved more than 5px)
  const onScroll = useCallback(() => {
    setHasDragged(true)
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    emblaApi.on('pointerDown', onPointerDown)
    emblaApi.on('pointerUp', onPointerUp)
    emblaApi.on('scroll', onScroll)

    return () => {
      emblaApi.off('pointerDown', onPointerDown)
      emblaApi.off('pointerUp', onPointerUp)
      emblaApi.off('scroll', onScroll)
    }
  }, [emblaApi, onPointerDown, onPointerUp, onScroll])

  // Handle video click - only trigger if not dragging
  const handleVideoClick = useCallback((video: VideoItem) => {
    if (!hasDragged && onVideoClick) {
      onVideoClick(video)
    }
  }, [hasDragged, onVideoClick])

  // Filter to only show videos with actual video URLs
  const videosWithContent = videos.filter(v => v.videoUrl)

  return (
    <div className={`relative ${className}`}>
      {/* Gradient Fades */}
      <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none" />

      {/* Carousel */}
      <div
        className="overflow-hidden cursor-grab active:cursor-grabbing"
        ref={emblaRef}
      >
        <div className="flex gap-4 sm:gap-6">
          {videosWithContent.map((video) => (
            <div
              key={video.id}
              className="flex-none"
              onMouseEnter={() => setHoveredVideo(video.id)}
              onMouseLeave={() => setHoveredVideo(null)}
              onTouchStart={() => setTappedVideo(video.id)}
              onTouchEnd={() => setTimeout(() => setTappedVideo(null), 150)}
              onClick={() => handleVideoClick(video)}
            >
              {/* Phone/Device Frame - adapts to aspect ratio */}
              <div className={`relative bg-black shadow-2xl transition-all duration-300 ${
                hoveredVideo === video.id || tappedVideo === video.id ? 'scale-105' : ''
              } ${
                video.aspectRatio === 'square'
                  ? 'rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 w-40 sm:w-52'
                  : 'rounded-[2rem] sm:rounded-[2.5rem] p-1.5 sm:p-2 w-40 sm:w-52'
              }`}>
                {/* Phone Notch - only for vertical */}
                {video.aspectRatio !== 'square' && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-4 sm:h-5 bg-black rounded-b-xl z-10" />
                )}

                {/* Screen */}
                <div className={`relative overflow-hidden bg-gray-900 ${
                  video.aspectRatio === 'square'
                    ? 'rounded-xl sm:rounded-2xl aspect-square'
                    : 'rounded-[1.5rem] sm:rounded-[2rem] aspect-[9/19.5]'
                }`}>
                  <video
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    <source src={video.videoUrl} type="video/mp4" />
                  </video>

                  {/* Play Button Overlay - Always visible on mobile, hover on desktop */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                      hoveredVideo === video.id || tappedVideo === video.id
                        ? 'bg-black/40 opacity-100'
                        : 'bg-black/20 opacity-100 sm:opacity-0'
                    }`}
                  >
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-white/90 sm:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
                      hoveredVideo === video.id || tappedVideo === video.id ? 'scale-110' : 'scale-100'
                    }`}>
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 ml-0.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Niche Tag */}
                  <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold text-purple-600 whitespace-nowrap shadow-lg">
                    {video.niche}
                  </div>
                </div>

                {/* Glow Effect */}
                <div
                  className={`absolute -inset-3 sm:-inset-4 blur-xl transition-opacity duration-300 -z-10 ${
                    video.aspectRatio === 'square'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl sm:rounded-3xl'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 rounded-[2.5rem] sm:rounded-[3rem]'
                  } ${hoveredVideo === video.id || tappedVideo === video.id ? 'opacity-40' : 'opacity-0'}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drag Hint */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center gap-2 text-white/50 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          <span>Drag to explore</span>
        </div>
      </div>
    </div>
  )
}
