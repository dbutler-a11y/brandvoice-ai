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
  const [isPlaying, setIsPlaying] = useState(true)

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

  useEffect(() => {
    if (!emblaApi) return

    emblaApi.on('pointerDown', onPointerDown)
    emblaApi.on('pointerUp', onPointerUp)

    return () => {
      emblaApi.off('pointerDown', onPointerDown)
      emblaApi.off('pointerUp', onPointerUp)
    }
  }, [emblaApi, onPointerDown, onPointerUp])

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
              onClick={() => onVideoClick?.(video)}
            >
              {/* Phone Frame */}
              <div className="relative bg-black rounded-[2rem] sm:rounded-[2.5rem] p-1.5 sm:p-2 shadow-2xl w-40 sm:w-52 transition-transform duration-300 hover:scale-105">
                {/* Phone Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-4 sm:h-5 bg-black rounded-b-xl z-10" />

                {/* Screen */}
                <div className="relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden bg-gray-900 aspect-[9/19.5]">
                  <video
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    <source src={video.videoUrl} type="video/mp4" />
                  </video>

                  {/* Hover Overlay */}
                  <div
                    className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
                      hoveredVideo === video.id ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center shadow-xl transform transition-transform hover:scale-110">
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
                  className={`absolute -inset-3 sm:-inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-[2.5rem] sm:rounded-[3rem] blur-xl transition-opacity duration-300 -z-10 ${
                    hoveredVideo === video.id ? 'opacity-40' : 'opacity-0'
                  }`}
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
