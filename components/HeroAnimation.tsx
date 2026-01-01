"use client";

import { useState, useEffect } from "react";

// Different service categories to cycle through
const serviceScripts = [
  {
    id: "video",
    lines: [
      "Creating your AI spokesperson...",
      "Generating 30 viral-ready videos...",
      "Adding captions & hooks...",
    ],
    output: "video",
    badge: "Video Content",
    color: "from-purple-500 to-indigo-600",
  },
  {
    id: "voice",
    lines: [
      "Cloning your brand voice...",
      "Training on your tone & style...",
      "Voice ready for any content...",
    ],
    output: "voice",
    badge: "Voice Clone",
    color: "from-pink-500 to-rose-600",
  },
  {
    id: "ads",
    lines: [
      "Analyzing your target audience...",
      "Crafting high-converting ad copy...",
      "A/B variants ready to test...",
    ],
    output: "ads",
    badge: "Ad Creatives",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "social",
    lines: [
      "Building your content calendar...",
      "Scheduling 30 days of posts...",
      "Engagement hooks optimized...",
    ],
    output: "social",
    badge: "Social Content",
    color: "from-cyan-500 to-blue-600",
  },
];

type Phase = "typing" | "transforming" | "output" | "holding" | "fading";

export function HeroAnimation() {
  const [phase, setPhase] = useState<Phase>("typing");
  const [serviceIndex, setServiceIndex] = useState(0);
  const [displayServiceIndex, setDisplayServiceIndex] = useState(0); // Tracks which output to show (stays on previous during transition)
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  const currentService = serviceScripts[serviceIndex];
  const displayService = serviceScripts[displayServiceIndex]; // The service whose output we're showing
  const scriptLines = currentService.lines;

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (phase !== "typing") return;

    const currentLine = scriptLines[currentLineIndex];
    if (!currentLine) {
      setTimeout(() => setPhase("transforming"), 600);
      return;
    }

    if (displayedText.length < currentLine.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(currentLine.slice(0, displayedText.length + 1));
      }, 35 + Math.random() * 25);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentLineIndex((prev) => prev + 1);
        setDisplayedText("");
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [phase, currentLineIndex, displayedText, scriptLines]);

  // Transformation phase - sync display service index
  useEffect(() => {
    if (phase === "transforming") {
      setDisplayServiceIndex(serviceIndex); // Lock in which output to display
      const timeout = setTimeout(() => setPhase("output"), 800);
      return () => clearTimeout(timeout);
    }
  }, [phase, serviceIndex]);

  // Output appears, then quickly transition to holding phase
  useEffect(() => {
    if (phase === "output") {
      const timeout = setTimeout(() => setPhase("holding"), 500);
      return () => clearTimeout(timeout);
    }
  }, [phase]);

  // Holding phase - output frame stays visible while progress bar counts down
  useEffect(() => {
    if (phase === "holding") {
      const timeout = setTimeout(() => {
        // Go to fading phase (output still visible, starts fading)
        setPhase("fading");
      }, 6000); // Progress bar countdown duration
      return () => clearTimeout(timeout);
    }
  }, [phase]);

  // Fading phase - output stays visible while fading out, THEN switch to next service
  useEffect(() => {
    if (phase === "fading") {
      const timeout = setTimeout(() => {
        // NOW change to next service and start typing
        setServiceIndex((prev) => (prev + 1) % serviceScripts.length);
        setCurrentLineIndex(0);
        setDisplayedText("");
        setPhase("typing");
      }, 800); // Wait for fade-out animation to complete
      return () => clearTimeout(timeout);
    }
  }, [phase]);

  // Output component based on service type - uses displayService to keep previous output visible during transition
  const renderOutput = () => {
    switch (displayService.output) {
      case "video":
        return (
          <div className="relative w-44 sm:w-52 aspect-[9/16] bg-black rounded-3xl p-1.5 shadow-2xl">
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-black rounded-full z-10"></div>
            <div className={`w-full h-full bg-gradient-to-br ${displayService.color} rounded-2xl overflow-hidden relative`}>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl animate-pulse-slow">
                  <svg className="w-7 h-7 text-purple-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-white font-semibold mt-3 text-center text-sm">Your AI Video</p>
                <p className="text-white/70 text-xs mt-1">Ready to post</p>
              </div>
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-end gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-white/60 rounded-full animate-wave"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        );

      case "voice":
        return (
          <div className="relative w-64 sm:w-80 bg-white rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${displayService.color} flex items-center justify-center`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900">Your Brand Voice</p>
                <p className="text-sm text-gray-500">Ready to use</p>
              </div>
            </div>
            <div className="flex items-center gap-1 h-16 px-2">
              {[...Array(32)].map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 bg-gradient-to-t ${displayService.color} rounded-full animate-voice-wave`}
                  style={{
                    animationDelay: `${i * 0.05}s`,
                    height: `${20 + Math.sin(i * 0.5) * 15 + Math.random() * 20}%`,
                  }}
                ></div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
              <span>0:00</span>
              <div className="flex gap-4">
                <button className="hover:text-gray-900">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4l12 8-12 8V4z" />
                  </svg>
                </button>
              </div>
              <span>2:34</span>
            </div>
          </div>
        );

      case "ads":
        return (
          <div className="relative w-72 sm:w-80">
            <div className="bg-white rounded-xl shadow-2xl p-4 transform rotate-[-2deg] absolute -left-4 top-4 w-full opacity-60">
              <div className="h-24 bg-gray-100 rounded-lg"></div>
            </div>
            <div className="bg-white rounded-xl shadow-2xl p-4 relative">
              <div className={`h-32 bg-gradient-to-br ${displayService.color} rounded-lg mb-3 flex items-center justify-center`}>
                <svg className="w-12 h-12 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="font-bold text-gray-900 text-sm mb-1">High-Converting Ad</p>
              <p className="text-xs text-gray-500 mb-3">Stop scrolling! Here&apos;s why 10,000+ brands trust us...</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">CTR: 4.2%</span>
                <span className="text-xs text-gray-400">Variant A</span>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-xl p-4 transform rotate-[2deg] absolute -right-4 top-8 w-full opacity-40 -z-10">
              <div className="h-24 bg-gray-100 rounded-lg"></div>
            </div>
          </div>
        );

      case "social":
        return (
          <div className="relative w-72 sm:w-80 space-y-3">
            {["Mon", "Wed", "Fri"].map((day, i) => (
              <div
                key={day}
                className={`bg-white rounded-xl shadow-lg p-3 flex items-center gap-3 transform transition-all duration-300 ${
                  i === 1 ? "scale-105 shadow-xl" : "opacity-80"
                }`}
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${displayService.color} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white text-xs font-bold">{day}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {i === 0 && "5 Tips to Boost Your..."}
                    {i === 1 && "Behind the Scenes..."}
                    {i === 2 && "Customer Success Story"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {i === 0 && "Instagram, TikTok"}
                    {i === 1 && "All Platforms"}
                    {i === 2 && "LinkedIn, Twitter"}
                  </p>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
              </div>
            ))}
            <p className="text-center text-xs text-white/80 mt-2">+27 more scheduled</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative">
        {/* Subtle shadow/glow underneath */}
        <div className="absolute inset-x-8 -bottom-8 h-32 bg-gradient-to-t from-purple-500/10 to-transparent blur-2xl rounded-full"></div>

        {/* Main container */}
        <div
          className={`
            relative overflow-hidden shadow-2xl ring-1 ring-white/10
            transition-all duration-700 ease-out
            ${phase === "typing" ? "rounded-2xl" : "rounded-[2rem]"}
          `}
        >
          {/* Script Editor Phase */}
          <div
            className={`
              transition-all duration-700 ease-out
              ${phase === "output" ? "opacity-0 scale-95" : "opacity-100 scale-100"}
            `}
          >
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 aspect-video">
              {/* Editor Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 border-b border-gray-700/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-gray-400 text-sm font-mono">brandvoice.studio</span>
                </div>
                {/* Service indicator dots */}
                <div className="flex gap-1.5">
                  {serviceScripts.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i === serviceIndex ? "bg-purple-400 scale-125" : "bg-gray-600"
                      }`}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Editor Content - LARGE dramatic text */}
              <div className="p-6 sm:p-8 font-mono text-xl sm:text-2xl lg:text-3xl min-h-[300px] sm:min-h-[380px] flex flex-col justify-center">
                {/* Service label */}
                <div className="mb-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${currentService.color} text-white`}>
                    {currentService.badge}
                  </span>
                </div>

                {/* Completed lines */}
                {scriptLines.slice(0, currentLineIndex).map((line, index) => (
                  <div key={index} className="flex items-start mb-4">
                    <span className="text-green-400 mr-3 select-none">✓</span>
                    <span className="text-green-400">{line}</span>
                  </div>
                ))}

                {/* Current typing line */}
                {phase === "typing" && currentLineIndex < scriptLines.length && (
                  <div className="flex items-start mb-4">
                    <span className="text-purple-400 mr-3 select-none animate-spin-slow">◌</span>
                    <span className="text-purple-300">
                      {displayedText}
                      <span
                        className={`inline-block w-2 h-5 ml-0.5 -mb-0.5 bg-purple-400 ${
                          showCursor ? "opacity-100" : "opacity-0"
                        }`}
                      ></span>
                    </span>
                  </div>
                )}

                {/* Pending lines */}
                {scriptLines.slice(currentLineIndex + 1).map((line, index) => (
                  <div key={`pending-${index}`} className="flex items-start mb-4 opacity-30">
                    <span className="text-gray-600 mr-3 select-none">○</span>
                    <span className="text-gray-600">{line}</span>
                  </div>
                ))}
              </div>

              {/* Transformation overlay - uses displayService to keep previous output's color during transition */}
              <div
                className={`
                  absolute inset-0 bg-gradient-to-br ${displayService.color}
                  flex items-center justify-center
                  transition-all duration-700 ease-out
                  ${phase === "transforming" || phase === "output" || phase === "holding" || phase === "fading" ? "opacity-100" : "opacity-0 pointer-events-none"}
                `}
              >
                {/* Output display - stays visible during holding & fading phases */}
                <div
                  className={`
                    relative transition-all duration-700 ease-out
                    ${phase === "output" || phase === "holding" ? "scale-100 opacity-100" : ""}
                    ${phase === "fading" ? "scale-95 opacity-0" : ""}
                    ${phase === "typing" || phase === "transforming" ? "scale-90 opacity-0" : ""}
                  `}
                >
                  {renderOutput()}

                  {/* Floating service badges */}
                  <div className="absolute -top-6 -right-6 bg-white text-gray-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-bounce-slow">
                    {displayService.badge}
                  </div>
                  <div className="absolute -bottom-4 -left-6 bg-white/90 backdrop-blur text-gray-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-bounce-slow animation-delay-300">
                    Done in 7 days
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service selector pills with progress indicator */}
        <div className="flex justify-center gap-3 mt-8">
          {serviceScripts.map((service, i) => (
            <button
              key={service.id}
              onClick={() => {
                setServiceIndex(i);
                setPhase("typing");
                setCurrentLineIndex(0);
                setDisplayedText("");
              }}
              className={`
                relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-500
                ${i === serviceIndex
                  ? "bg-white text-gray-900 shadow-xl scale-105"
                  : "bg-white/10 text-gray-500 hover:bg-white/20 hover:text-gray-700"
                }
              `}
            >
              {service.badge}
              {/* Progress bar under active pill - shows during holding phase */}
              {i === serviceIndex && phase === "holding" && (
                <div className="absolute bottom-0 left-2 right-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${service.color} animate-progress`}
                    style={{ animationDuration: "6s" }}
                  ></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Inline styles for custom animations */}
      <style jsx>{`
        @keyframes wave {
          0%, 100% { height: 8px; }
          50% { height: 24px; }
        }
        .animate-wave {
          animation: wave 0.6s ease-in-out infinite;
        }
        @keyframes voice-wave {
          0%, 100% { opacity: 0.4; transform: scaleY(0.5); }
          50% { opacity: 1; transform: scaleY(1); }
        }
        .animate-voice-wave {
          animation: voice-wave 0.8s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-progress {
          animation: progress linear forwards;
        }
      `}</style>
    </div>
  );
}
