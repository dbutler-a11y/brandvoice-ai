"use client";

import {
  HelpCircle,
  Lightbulb,
  Users,
  Sparkles,
  TrendingUp,
  Gift,
  Clock,
  Star,
  MessageSquare,
  Target,
  Zap,
  Heart,
  Award,
  Calendar,
  Megaphone,
  Eye,
  ThumbsUp,
  BookOpen,
  ShieldCheck,
  Repeat,
  Play,
  Mic,
  Camera,
  Film,
  Rocket,
  CheckCircle,
  AlertCircle,
  Info,
  Globe,
  Share2
} from "lucide-react";
import { useState } from "react";

const contentCategories = [
  {
    name: "Educational",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    items: [
      { icon: HelpCircle, label: "FAQ Videos", desc: "Answer common questions" },
      { icon: Lightbulb, label: "Tips & Tutorials", desc: "Share expertise" },
      { icon: BookOpen, label: "How-To Guides", desc: "Step-by-step walkthroughs" },
      { icon: AlertCircle, label: "Myth Busters", desc: "Debunk misconceptions" },
      { icon: Info, label: "Did You Know?", desc: "Interesting facts" },
      { icon: ShieldCheck, label: "Industry Insights", desc: "Expert knowledge" },
    ],
  },
  {
    name: "Social Proof",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
    items: [
      { icon: Users, label: "Customer Stories", desc: "Real testimonials" },
      { icon: Star, label: "Reviews Spotlight", desc: "Highlight ratings" },
      { icon: Award, label: "Case Studies", desc: "Success stories" },
      { icon: TrendingUp, label: "Before & After", desc: "Transformation results" },
      { icon: ThumbsUp, label: "Social Proof", desc: "Numbers that matter" },
      { icon: Heart, label: "Client Wins", desc: "Celebrate success" },
    ],
  },
  {
    name: "Promotional",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
    items: [
      { icon: Gift, label: "Special Offers", desc: "Limited-time deals" },
      { icon: Clock, label: "Flash Sales", desc: "Urgency-driven promos" },
      { icon: Megaphone, label: "Announcements", desc: "New launches" },
      { icon: Target, label: "CTAs", desc: "Direct response videos" },
      { icon: Calendar, label: "Seasonal Promos", desc: "Holiday campaigns" },
      { icon: Rocket, label: "Launch Videos", desc: "Product releases" },
    ],
  },
  {
    name: "Engagement",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    items: [
      { icon: Eye, label: "Behind the Scenes", desc: "Build connection" },
      { icon: MessageSquare, label: "Q&A Sessions", desc: "Interactive content" },
      { icon: Mic, label: "Personal Intros", desc: "Meet the team" },
      { icon: Play, label: "Day in the Life", desc: "Authentic moments" },
      { icon: Share2, label: "Story Time", desc: "Relatable narratives" },
      { icon: Globe, label: "Community Updates", desc: "Stay connected" },
    ],
  },
  {
    name: "Conversion",
    color: "from-indigo-500 to-violet-500",
    bgColor: "bg-indigo-50",
    items: [
      { icon: Sparkles, label: "Product Demos", desc: "Showcase features" },
      { icon: CheckCircle, label: "Benefit Breakdowns", desc: "Why choose you" },
      { icon: Zap, label: "Quick Wins", desc: "Instant value" },
      { icon: Film, label: "Explainer Videos", desc: "Simplify complexity" },
      { icon: Camera, label: "Service Spotlights", desc: "What you offer" },
      { icon: Repeat, label: "Objection Handlers", desc: "Address concerns" },
    ],
  },
];

export function ContentPackageGrid() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
            30 VIDEOS INCLUDED
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your Complete Content Arsenal
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Every package includes a strategic mix of content types designed to educate, engage, and convert your audience.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentCategories.map((category, catIndex) => (
            <div
              key={category.name}
              className={`relative rounded-2xl p-6 ${category.bgColor} border border-gray-100 hover:shadow-xl transition-all duration-300 ${
                catIndex === 0 ? "lg:col-span-2 lg:row-span-1" : ""
              }`}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                  <span className="text-white text-lg font-bold">{category.items.length}</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{category.name}</h3>
                  <p className="text-sm text-gray-500">Content Types</p>
                </div>
              </div>

              {/* Items Grid */}
              <div className={`grid ${catIndex === 0 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2"} gap-3`}>
                {category.items.map((item) => {
                  const Icon = item.icon;
                  const itemKey = `${category.name}-${item.label}`;
                  const isHovered = hoveredItem === itemKey;

                  return (
                    <div
                      key={item.label}
                      className={`relative p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-100 cursor-pointer transition-all duration-200 ${
                        isHovered ? "shadow-md scale-[1.02] bg-white" : "hover:bg-white hover:shadow-sm"
                      }`}
                      onMouseEnter={() => setHoveredItem(itemKey)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`p-1.5 rounded-lg bg-gradient-to-br ${category.color} bg-opacity-10`}>
                          <Icon className={`w-4 h-4 ${isHovered ? "text-white" : "text-gray-600"}`}
                            style={{
                              color: isHovered ? "white" : undefined,
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{item.label}</p>
                          {isHovered && (
                            <p className="text-xs text-gray-500 mt-0.5 animate-fadeIn">{item.desc}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "30+", label: "Video Types" },
            { value: "7", label: "Day Delivery" },
            { value: "5", label: "Categories" },
            { value: "100%", label: "Ad-Ready" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
