"use client";

import Image from "next/image";
import { useState } from "react";

const adSizes = {
  feed: { width: 1200, height: 628, label: "Feed (1200×628)" },
  square: { width: 1080, height: 1080, label: "Square (1080×1080)" },
  story: { width: 1080, height: 1920, label: "Story (1080×1920)" },
};

type AdSize = keyof typeof adSizes;

const adVariations = [
  {
    id: "starter-kit",
    headline: "Launch Your Brand The Right Way",
    subheadline: "Everything you need to look professional from day one",
    price: "$497",
    cta: "Get Started Today",
    pillars: [
      { icon: "/images/icons/brand/sparkle-stars.png", title: "Your Look", items: ["Logo & brand colors", "Icons & graphics", "Ready-to-use files"] },
      { icon: "/images/icons/brand/document.png", title: "Your Website", items: ["Custom design", "Mobile-friendly", "Ready to launch"] },
      { icon: "/images/icons/brand/speech-bubble.png", title: "Your Content", items: ["Social media posts", "Scripts & captions", "30 days of content"] },
      { icon: "/images/icons/brand/megaphone-icon.png", title: "Your Automation", items: ["Telegram & Discord bots", "Auto-responses", "Save hours weekly"] },
    ],
  },
  {
    id: "video-content",
    headline: "30 AI Videos in 7 Days",
    subheadline: "Professional spokesperson videos for your business",
    price: "$1,497",
    cta: "Start Creating",
    pillars: [
      { icon: "/images/icons/brand/user-avatar.png", title: "Custom Avatar", items: ["Your own AI spokesperson", "Natural-looking videos"] },
      { icon: "/images/icons/brand/video-camera.png", title: "30 Videos", items: ["Short-form content", "Ad-ready formats"] },
      { icon: "/images/icons/brand/speech-bubble.png", title: "Captions", items: ["Viral-style hooks", "Posting instructions"] },
      { icon: "/images/icons/brand/checkmark.png", title: "Delivered Fast", items: ["7-day turnaround", "Unlimited revisions"] },
    ],
  },
  {
    id: "authority",
    headline: "Become The Authority",
    subheadline: "60+ videos per month to dominate your market",
    price: "$3,997/mo",
    cta: "Scale Your Brand",
    pillars: [
      { icon: "/images/icons/brand/megaphone-sparkles.png", title: "60+ Videos", items: ["Monthly content engine", "Multiple formats"] },
      { icon: "/images/icons/brand/user-avatar.png", title: "3 Avatars", items: ["Different personas", "Multi-language"] },
      { icon: "/images/icons/brand/microphone.png", title: "3 Voices", items: ["Custom brand voices", "Full funnel scripts"] },
      { icon: "/images/icons/brand/waveform.png", title: "Full Support", items: ["Posting & scheduling", "Campaign-ready"] },
    ],
  },
];

export default function AdGeneratorPage() {
  const [selectedSize, setSelectedSize] = useState<AdSize>("feed");
  const [selectedVariation, setSelectedVariation] = useState(0);

  const size = adSizes[selectedSize];
  const variation = adVariations[selectedVariation];

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Ad Creative Generator</h1>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Size</p>
            <div className="flex gap-2">
              {Object.entries(adSizes).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setSelectedSize(key as AdSize)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedSize === key
                      ? "bg-purple-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {val.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Variation</p>
            <div className="flex gap-2">
              {adVariations.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariation(i)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedVariation === i
                      ? "bg-purple-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {v.id.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-gray-400 mb-4">Right-click → Save Image or Screenshot to export</p>

        {/* Ad Preview */}
        <div className="overflow-auto bg-gray-800 rounded-xl p-8">
          <div
            id="ad-canvas"
            className="relative mx-auto bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden"
            style={{
              width: size.width / 2,
              height: size.height / 2,
              transform: "scale(1)",
            }}
          >
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-purple-100/50 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-indigo-100/50 to-transparent rounded-tr-full" />

            {/* Content */}
            <div className={`relative h-full flex flex-col ${selectedSize === "story" ? "p-6" : "p-8"}`}>
              {/* Header */}
              <div className={`flex items-center gap-3 ${selectedSize === "story" ? "mb-6" : "mb-4"}`}>
                <Image
                  src="/images/icons/brand/megaphone-geometric.png"
                  alt="BrandVoice"
                  width={selectedSize === "story" ? 40 : 32}
                  height={selectedSize === "story" ? 40 : 32}
                  className="object-contain"
                />
                <span className="text-purple-600 font-bold text-lg">BrandVoice</span>
              </div>

              {/* Headline */}
              <h2 className={`font-bold text-gray-900 leading-tight ${
                selectedSize === "story" ? "text-2xl mb-2" : selectedSize === "square" ? "text-2xl mb-2" : "text-xl mb-1"
              }`}>
                {variation.headline}
              </h2>
              <p className={`text-gray-500 ${selectedSize === "story" ? "text-base mb-6" : "text-sm mb-4"}`}>
                {variation.subheadline}
              </p>

              {/* Pillars Grid */}
              <div className={`flex-1 grid gap-3 ${
                selectedSize === "story"
                  ? "grid-cols-1"
                  : selectedSize === "square"
                    ? "grid-cols-2"
                    : "grid-cols-4"
              }`}>
                {variation.pillars.slice(0, selectedSize === "feed" ? 4 : selectedSize === "square" ? 4 : 4).map((pillar, i) => (
                  <div
                    key={i}
                    className={`bg-white rounded-xl shadow-sm ${
                      selectedSize === "story" ? "p-4 flex items-center gap-4" : "p-3 text-center"
                    }`}
                  >
                    <div className={selectedSize === "story" ? "w-12 h-12 flex-shrink-0" : "w-10 h-10 mx-auto mb-2"}>
                      <Image
                        src={pillar.icon}
                        alt={pillar.title}
                        width={48}
                        height={48}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className={selectedSize === "story" ? "flex-1" : ""}>
                      <h3 className={`font-bold text-gray-900 ${selectedSize === "story" ? "text-base" : "text-xs"}`}>
                        {pillar.title}
                      </h3>
                      {selectedSize !== "feed" && (
                        <ul className={`text-gray-500 mt-1 ${selectedSize === "story" ? "text-sm" : "text-xs"}`}>
                          {pillar.items.slice(0, 2).map((item, j) => (
                            <li key={j}>• {item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className={`flex items-center justify-between ${selectedSize === "story" ? "mt-6" : "mt-4"}`}>
                <div>
                  <span className={`font-bold text-purple-600 ${selectedSize === "story" ? "text-2xl" : "text-xl"}`}>
                    {variation.price}
                  </span>
                  <span className="text-gray-400 text-sm ml-2">one-time</span>
                </div>
                <div className={`bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg ${
                  selectedSize === "story" ? "px-6 py-3 text-base" : "px-4 py-2 text-sm"
                }`}>
                  {variation.cta}
                </div>
              </div>

              {/* URL */}
              <p className={`text-center text-purple-600 font-medium ${selectedSize === "story" ? "mt-4 text-lg" : "mt-2 text-sm"}`}>
                www.BrandVoice.studio
              </p>
            </div>
          </div>
        </div>

        {/* Full Size Preview Link */}
        <div className="mt-8 bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-2">Export Instructions:</p>
          <ol className="text-gray-300 text-sm list-decimal list-inside space-y-1">
            <li>Select the size and variation above</li>
            <li>Use browser DevTools to set zoom to 200% for full resolution</li>
            <li>Right-click the preview and &quot;Save as Image&quot; or use screenshot tool</li>
            <li>Repeat for each size/variation combination</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
