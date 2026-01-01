'use client'

import { useState } from 'react'
import {
  Copy,
  Check,
  Download,
  Calendar,
  Video,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  Target,
  Users,
  Zap
} from 'lucide-react'

interface ContentPiece {
  day: number
  avatar: string
  title: string
  category: 'faq' | 'tips' | 'promo' | 'testimonial' | 'brand-story' | 'explainer'
  voiceover: string
  wan26Prompt: string
  veo31Prompt: string
  brollPrompts: string[]
  onScreenText: string[]
}

const categoryColors = {
  'faq': 'bg-blue-500',
  'tips': 'bg-green-500',
  'promo': 'bg-orange-500',
  'testimonial': 'bg-purple-500',
  'brand-story': 'bg-pink-500',
  'explainer': 'bg-cyan-500',
}

const categoryLabels = {
  'faq': 'FAQ',
  'tips': 'Tips',
  'promo': 'Promo',
  'testimonial': 'Testimonial',
  'brand-story': 'Brand Story',
  'explainer': 'Explainer',
}

// 30-Day Content Calendar
const thirtyDayContent: ContentPiece[] = [
  // Week 1 - Fitness Studio Owner
  {
    day: 1,
    avatar: 'Fitness Studio Owner',
    title: '30 Minute Truth',
    category: 'tips',
    voiceover: "Everyone says they don't have time for fitness. Here's the truth - 30 minutes, three times a week, changes everything. That's less time than you spend scrolling. Ready to feel different? Link in bio.",
    wan26Prompt: "Athletic European woman speaking to camera in modern fitness studio. Opens with tight close-up on face, direct eye contact, serious tone. Camera slowly pulls back revealing gym environment. Mid-video: cut to medium shot from different angle, she gestures expressively with hands. Final moments: wider shot showing full upper body, confident smile, slight forward lean toward camera. 15 seconds.",
    veo31Prompt: "Athletic woman in modern gym speaking directly to camera. Close-up face shot, intense eye contact. Professional lighting, shallow depth of field. 8 seconds.",
    brollPrompts: ["Dumbbells being racked, hands gripping barbell, kettlebell swing. Modern gym aesthetic, energetic pace. 5 seconds."],
    onScreenText: ["30 minutes. 3x a week.", "Less time than scrolling.", "Ready to feel different?", "Link in bio"]
  },
  {
    day: 2,
    avatar: 'Fitness Studio Owner',
    title: 'The Excuse Everyone Uses',
    category: 'faq',
    voiceover: "I'll start Monday. I'm too out of shape. I don't know what I'm doing. Sound familiar? Every successful client started with those exact excuses. The difference? They showed up anyway. Your turn.",
    wan26Prompt: "Confident female fitness trainer in bright modern gym, speaking directly to camera. Begins with medium shot, knowing smirk. Quick transition to close-up as tone shifts to empathetic. Camera push in during 'showed up anyway.' Final beat: wider angle, crosses arms confidently. 15 seconds.",
    veo31Prompt: "Female fitness trainer in gym, medium shot transitioning to close-up. Knowing expression shifts to empathetic then confident. 8 seconds.",
    brollPrompts: ["Montage of workout preparation. Lacing up sneakers, filling water bottle, hand pressing start on treadmill. 5 seconds."],
    onScreenText: ["\"I'll start Monday\"", "Sound familiar?", "They showed up anyway.", "Your turn."]
  },
  {
    day: 3,
    avatar: 'Fitness Studio Owner',
    title: 'Do I Really Need a Trainer?',
    category: 'faq',
    voiceover: "I get this question all the time—do I really need a trainer if I already work out? Here's the thing: most people hit a plateau because they're doing the same routine. A good trainer doesn't just push you—they see what you can't. That's when real change happens.",
    wan26Prompt: "A confident fitness studio owner stands in her modern gym space, speaking directly to camera with warm energy. Mauve athletic set with black zip-up jacket. Behind her, FITNESS logo visible. Natural morning light. She gestures naturally, expression shifting from understanding to enthusiastic. 15 seconds.",
    veo31Prompt: "Fitness studio owner in modern gym, medium shot. Understanding expression shifting to enthusiastic. Natural morning light, reception desk background. 8 seconds.",
    brollPrompts: ["Close-up hands adjusting weight plates. Person doing perfect squat form. Trainer pointing at workout chart. 6 seconds."],
    onScreenText: ["\"Do I need a trainer?\"", "Most people plateau.", "A trainer sees what you can't.", "Real change happens."]
  },
  {
    day: 4,
    avatar: 'Boutique Owner',
    title: 'Personal Styling Truth',
    category: 'explainer',
    voiceover: "Personal styling isn't about telling you what to wear. It's about understanding your life—your meetings, your weekends, what makes you feel powerful. I build wardrobes that actually work. Book a session, and let's find your look.",
    wan26Prompt: "A stylish Latina boutique owner in a dark teal blazer over a tan fitted dress stands among clothing racks. Thoughtfully touching a garment as she speaks to camera. Potted plants and natural wood floors. She makes eye contact, gestures to clothes, then back to camera with welcoming smile. 15 seconds.",
    veo31Prompt: "Stylish Latina boutique owner among clothing racks, touching garments while speaking. Dark teal blazer, tan dress. Soft natural lighting. 8 seconds.",
    brollPrompts: ["Hands sliding hangers across clothing rack. Close-up fabric texture. Woman checking herself in mirror. 6 seconds."],
    onScreenText: ["Not about rules.", "It's about YOUR life.", "Wardrobes that work.", "Book your session"]
  },
  {
    day: 5,
    avatar: 'Boutique Owner',
    title: 'Capsule Wardrobe Secret',
    category: 'tips',
    voiceover: "Want to know the secret to looking put-together every single day? It's not about having MORE clothes. It's about having the RIGHT pieces that work together. Twenty items. Endless outfits. Let me show you how.",
    wan26Prompt: "Elegant Latina woman in upscale boutique, speaking directly to camera. Opens medium shot showing stylish outfit. Gestures to clothing around her. Camera moves to show organized rack of coordinated pieces. Final shot: close-up warm smile, inviting energy. 15 seconds.",
    veo31Prompt: "Boutique owner surrounded by curated clothing, medium shot. Gestures to coordinated pieces while explaining. Natural lighting, sophisticated setting. 8 seconds.",
    brollPrompts: ["Overhead shot capsule wardrobe laid out. Hands mixing and matching outfits. 5 seconds."],
    onScreenText: ["The secret?", "Not MORE clothes.", "20 items. Endless outfits.", "Let me show you."]
  },
  {
    day: 6,
    avatar: 'Café Owner (Woman)',
    title: 'Five Years Ago',
    category: 'brand-story',
    voiceover: "Five years ago, this was just a dream and a lot of doubt. Now? This place is where people come to breathe. To talk. To just... be. Every cup we pour carries that intention. Welcome to Goldenroot.",
    wan26Prompt: "A joyful Black woman café owner stands at the entrance of her warm, plant-filled coffee shop during golden hour. Brown apron over black long-sleeve shirt, holding latte with heart art. Keys in other hand. Beaming smile. Sunset light streams through doorway. Speaks with genuine warmth about her journey. 15 seconds.",
    veo31Prompt: "Black woman café owner at coffee shop entrance, golden hour. Brown apron, holding latte. Warm genuine smile, looking around space with pride. 8 seconds.",
    brollPrompts: ["Coffee being poured, slow motion. Cozy café interior with people chatting. Latte art being created. Keys unlocking door at sunrise. 8 seconds."],
    onScreenText: ["5 years ago: just a dream", "Now: a place to breathe", "Every cup carries intention", "Welcome to Goldenroot"]
  },
  {
    day: 7,
    avatar: 'Café Owner (Woman)',
    title: 'Morning Ritual',
    category: 'brand-story',
    voiceover: "The best part of my day? 5:47 AM. Before the first customer. When it's just me and the espresso machine. That quiet moment before the magic starts. That's what I want you to feel when you walk in here.",
    wan26Prompt: "Black woman café owner in early morning quiet café. Soft pre-dawn light through windows. Close-up hands on espresso machine. Medium shot peaceful expression. Steam rising. Camera slowly reveals empty café behind her. Intimate, meditative energy. 15 seconds.",
    veo31Prompt: "Café owner alone in quiet coffee shop, early morning. Soft lighting, steam rising. Peaceful contemplative expression. Intimate close-up moments. 8 seconds.",
    brollPrompts: ["Espresso machine warming up, steam rising. Hands wiping down counter. Pre-dawn blue light. 5 seconds."],
    onScreenText: ["5:47 AM", "Just me and the espresso machine", "That quiet moment", "Feel it when you walk in"]
  },
  // Week 2 - Café Owner (Man)
  {
    day: 8,
    avatar: 'Café Owner (Man)',
    title: 'No Gimmicks',
    category: 'promo',
    voiceover: "We don't do complicated here. Single origin. Perfectly pulled. No syrups, no gimmicks. Just real coffee, made by someone who actually cares. First one's on us—come see what you've been missing.",
    wan26Prompt: "A handsome Mediterranean man with dark stubble stands confidently behind an espresso machine in a warm, amber-lit café. Cream linen shirt over black tee, arms relaxed on wooden counter. Steam rises. Speaks with quiet intensity about his craft, gesturing to machine. 15 seconds.",
    veo31Prompt: "Mediterranean man behind espresso machine, amber lighting. Cream linen shirt, confident stance. Speaks with quiet intensity. Steam rising. 8 seconds.",
    brollPrompts: ["Espresso shot pulling, rich crema forming. Coffee beans falling into grinder. Steam wand frothing milk. Hand sliding espresso across counter. 8 seconds."],
    onScreenText: ["No syrups. No gimmicks.", "Single origin. Perfectly pulled.", "Made by someone who cares.", "First one's FREE"]
  },
  {
    day: 9,
    avatar: 'Café Owner (Man)',
    title: 'The Perfect Shot',
    category: 'tips',
    voiceover: "Everyone wants the perfect shot. But here's what they don't tell you—it's not about the machine. It's not about the beans. It's about the 15 seconds of patience while it extracts. That's where the magic happens. Most people rush it.",
    wan26Prompt: "Mediterranean café owner at espresso machine, teaching moment. Opens close on hands working machine. Pull back to medium shot, he looks at camera with knowing expression. Passionate intensity. Close-up of espresso extracting. Returns to his face, slight satisfied nod. 15 seconds.",
    veo31Prompt: "Café owner at espresso machine, educational delivery. Hands working equipment, passionate expression. Close-up of extraction. Warm lighting. 8 seconds.",
    brollPrompts: ["Extreme close-up espresso extraction, timer visible. Hands tamping coffee grounds with precision. 5 seconds."],
    onScreenText: ["The perfect shot?", "Not the machine. Not the beans.", "15 seconds of patience.", "Most people rush it."]
  },
  {
    day: 10,
    avatar: 'Fitness Studio Owner',
    title: 'The Real Results',
    category: 'testimonial',
    voiceover: "You know what I love most about my job? Watching someone discover what they're actually capable of. Last month, Sarah did her first pull-up. She cried. I cried. THAT'S why I do this.",
    wan26Prompt: "Fitness studio owner in gym, emotionally sharing a story. Opens medium shot, genuine smile. Voice becomes softer recounting the story. Close-up showing authentic emotion. Final shot: warm eye contact with camera. 15 seconds.",
    veo31Prompt: "Fitness trainer sharing emotional story, medium to close-up. Genuine expression, eyes getting slightly misty. Warm gym lighting. 8 seconds.",
    brollPrompts: ["Woman doing pull-up in gym, triumphant moment. High five celebration. Proud smile. 5 seconds."],
    onScreenText: ["What I love most?", "Watching transformation", "Sarah's first pull-up", "THAT'S why I do this"]
  },
  // Continue pattern for remaining days...
  {
    day: 11,
    avatar: 'Boutique Owner',
    title: 'Investment Pieces',
    category: 'tips',
    voiceover: "Stop buying trends. Start buying investment pieces. A quality blazer. The perfect pair of jeans. A structured bag. These three items will outlast everything else in your closet. Trust me.",
    wan26Prompt: "Boutique owner holding quality blazer, speaking to camera with authority. Shows the fabric quality. Camera moves to display each item as she mentions them. Final shot: confident, knowing look. Natural boutique lighting. 15 seconds.",
    veo31Prompt: "Boutique owner showcasing quality clothing, expert energy. Holding blazer, touching fabric. Natural lighting, sophisticated setting. 8 seconds.",
    brollPrompts: ["Close-up quality fabric texture. Structured bag on display. Perfect jeans folded. 5 seconds."],
    onScreenText: ["Stop buying trends.", "Investment pieces:", "Blazer. Jeans. Bag.", "Trust me."]
  },
  {
    day: 12,
    avatar: 'Café Owner (Woman)',
    title: 'Community Space',
    category: 'explainer',
    voiceover: "This isn't just a coffee shop. It's where book clubs meet. Where first dates happen. Where freelancers find their second office. I didn't build a business—I built a community space. The coffee just happens to be incredible.",
    wan26Prompt: "Café owner gesturing around her space as she speaks. Warm lighting, plants visible. Shows different corners of the café. People in soft focus background. Warm, proud energy. Final shot: holding coffee cup, inviting smile. 15 seconds.",
    veo31Prompt: "Café owner showing off her space, proud energy. Gestures to different areas. Warm golden hour lighting, community atmosphere. 8 seconds.",
    brollPrompts: ["Book club gathered at table. Couple on date. Freelancer working on laptop. Coffee being made. 6 seconds."],
    onScreenText: ["Not just a coffee shop", "Book clubs. First dates.", "Freelancer haven.", "Community space"]
  },
  {
    day: 13,
    avatar: 'Café Owner (Man)',
    title: 'Bean Selection',
    category: 'tips',
    voiceover: "People ask me: what makes great coffee? It starts before the roast. I travel to farms. I meet the growers. I taste 50 samples before choosing one. That's the difference between good coffee and THIS coffee.",
    wan26Prompt: "Café owner holding coffee beans, speaking passionately. Opens with beans in hand, smelling them. Speaks with expertise and passion. Camera close on beans, then back to his face. Pride in craft energy. 15 seconds.",
    veo31Prompt: "Café owner with coffee beans, passionate explanation. Smelling beans, examining quality. Expert energy, warm lighting. 8 seconds.",
    brollPrompts: ["Coffee beans being poured. Cupping session. Coffee farm footage style shots. 5 seconds."],
    onScreenText: ["What makes great coffee?", "I travel to farms.", "50 samples. One choice.", "THAT'S the difference."]
  },
  {
    day: 14,
    avatar: 'Fitness Studio Owner',
    title: 'Sunday Reset',
    category: 'tips',
    voiceover: "Sunday reset routine for your fitness week: Meal prep for 3 days. Set out your workout clothes. Schedule your gym times like appointments. Done in 30 minutes. You just set yourself up to win.",
    wan26Prompt: "Fitness owner at home setting, casual but put-together. Speaking directly to camera, listing tips. Shows enthusiasm for organization. Final shot: confident nod, 'you've got this' energy. 15 seconds.",
    veo31Prompt: "Fitness trainer sharing tips, casual setting. Friendly energy, listing items. Organized, motivating delivery. 8 seconds.",
    brollPrompts: ["Meal prep containers. Workout clothes laid out. Phone calendar being updated. 5 seconds."],
    onScreenText: ["Sunday Reset:", "Meal prep. Clothes out.", "Schedule like appointments.", "Set yourself up to WIN"]
  },
  // Week 3
  {
    day: 15,
    avatar: 'Boutique Owner',
    title: 'Color Analysis',
    category: 'tips',
    voiceover: "Here's a styling secret that changes everything: know your colors. When you wear colors that match your undertone, you literally glow. Wrong colors wash you out. Book a color analysis—it's the best $100 you'll spend on your wardrobe.",
    wan26Prompt: "Boutique owner holding fabric swatches near her face, demonstrating colors. Speaks with expert enthusiasm. Shows difference between flattering and unflattering colors. Final shot: warm smile, 'trust me' energy. 15 seconds.",
    veo31Prompt: "Stylist with color swatches, educational energy. Demonstrating colors near face. Natural lighting, expert delivery. 8 seconds.",
    brollPrompts: ["Color swatches being sorted. Fabric held against skin. Before/after color comparison. 5 seconds."],
    onScreenText: ["Styling secret:", "Know your colors.", "You literally GLOW.", "Best $100 spent"]
  },
  {
    day: 16,
    avatar: 'Café Owner (Woman)',
    title: 'Regulars',
    category: 'testimonial',
    voiceover: "James comes in every morning at 7:15. Americano, extra hot. He's been coming here for 3 years. Last week he told me this is the only place that feels like home since his wife passed. We're not just selling coffee here.",
    wan26Prompt: "Café owner speaking softly, emotional story. Opens medium shot, reflective expression. Voice gentle as she shares. Close-up showing authentic emotion. Final shot: warm, grateful smile. 15 seconds.",
    veo31Prompt: "Café owner sharing emotional customer story. Soft expression, genuine emotion. Warm café lighting, intimate delivery. 8 seconds.",
    brollPrompts: ["Coffee being handed to customer. Warm interaction at counter. Empty chair by window, morning light. 5 seconds."],
    onScreenText: ["James. 7:15 AM. Every day.", "3 years.", "\"Feels like home\"", "Not just selling coffee"]
  },
  {
    day: 17,
    avatar: 'Café Owner (Man)',
    title: 'Why Espresso',
    category: 'explainer',
    voiceover: "Why espresso? Because it's honest. 25 seconds. You can't hide behind milk and sugar. The bean tells its whole story in one shot. If it's good, you know. If it's bad, you know. That's real craftsmanship.",
    wan26Prompt: "Café owner at espresso machine, philosophical mood. Speaks with passion about his craft. Close-up of espresso being made. Returns to medium shot, satisfied expression. 15 seconds.",
    veo31Prompt: "Café owner discussing espresso philosophy. At machine, passionate explanation. Warm amber lighting, expert energy. 8 seconds.",
    brollPrompts: ["Espresso pulling in extreme close-up. Steam rising. Perfect crema forming. 4 seconds."],
    onScreenText: ["Why espresso?", "It's honest. 25 seconds.", "The bean's whole story.", "Real craftsmanship."]
  },
  {
    day: 18,
    avatar: 'Fitness Studio Owner',
    title: 'Rest Days',
    category: 'tips',
    voiceover: "Unpopular opinion: rest days are just as important as workout days. Your muscles don't grow in the gym—they grow when you recover. So yes, take that rest day. Your body is working even when you're not.",
    wan26Prompt: "Fitness owner in relaxed setting, casual energy. Speaking directly about rest importance. Knowing smile, nodding. Final shot: relaxed pose, 'trust the process' energy. 15 seconds.",
    veo31Prompt: "Fitness trainer discussing rest days, casual setting. Relaxed energy, knowing expression. Warm natural lighting. 8 seconds.",
    brollPrompts: ["Person stretching. Foam rolling. Someone relaxing with tea. 4 seconds."],
    onScreenText: ["Unpopular opinion:", "Rest days = growth days", "Muscles grow recovering.", "Trust the process."]
  },
  {
    day: 19,
    avatar: 'Boutique Owner',
    title: 'The Perfect Blazer',
    category: 'explainer',
    voiceover: "The perfect blazer does three things: shoulders hit exactly at your shoulders, you can button it without pulling, and the sleeves show a hint of your shirt cuff. That's it. Now you know how to shop.",
    wan26Prompt: "Boutique owner demonstrating blazer fit on herself. Points to shoulders, buttons it, shows sleeve length. Expert, confident delivery. Final shot: satisfied with the look, confident smile. 15 seconds.",
    veo31Prompt: "Stylist showing blazer fit points. Demonstrating on herself, expert energy. Natural lighting, educational delivery. 8 seconds.",
    brollPrompts: ["Close-up shoulder seam. Button closure. Sleeve cuff detail. 4 seconds."],
    onScreenText: ["Perfect blazer test:", "Shoulders. Button. Sleeves.", "That's it.", "Now you know."]
  },
  {
    day: 20,
    avatar: 'Café Owner (Woman)',
    title: 'Small Business Love',
    category: 'brand-story',
    voiceover: "Every time you buy from a small business, a real person does a happy dance. I'm not kidding—I literally celebrate every order. You're not just a customer here. You're family. Thank you for choosing us.",
    wan26Prompt: "Café owner speaking warmly, grateful energy. Shows genuine appreciation. Maybe a little playful dance. Final shot: heartfelt thank you, warm smile. 15 seconds.",
    veo31Prompt: "Café owner expressing gratitude, warm genuine energy. Playful moment, then heartfelt thank you. Golden hour lighting. 8 seconds.",
    brollPrompts: ["Order being prepared with care. Happy customer interaction. Small celebration behind counter. 4 seconds."],
    onScreenText: ["Every order = happy dance", "I literally celebrate.", "You're family.", "Thank you"]
  },
  {
    day: 21,
    avatar: 'Café Owner (Man)',
    title: 'Morning Routine',
    category: 'tips',
    voiceover: "My morning routine in 60 seconds: Espresso shot before anything. 5-minute stretch. Cold water on face. Then I'm ready. Simple systems beat complicated ones. What's your non-negotiable?",
    wan26Prompt: "Café owner sharing personal routine, casual morning energy. Speaks while holding espresso. Quick, engaging delivery. Final shot: asks the question, invites engagement. 15 seconds.",
    veo31Prompt: "Café owner sharing morning routine, casual energy. Holding espresso, friendly delivery. Early morning lighting. 8 seconds.",
    brollPrompts: ["Espresso being sipped. Quick stretch. Cold water splash. 4 seconds."],
    onScreenText: ["60-second routine:", "Espresso. Stretch. Cold water.", "Simple beats complicated.", "What's yours?"]
  },
  // Week 4
  {
    day: 22,
    avatar: 'Fitness Studio Owner',
    title: 'Transformation Stories',
    category: 'testimonial',
    voiceover: "In 6 months, Maria lost 30 pounds. But here's what really changed: she stopped apologizing for taking time for herself. That confidence? You can't measure it on a scale. That's the transformation I'm here for.",
    wan26Prompt: "Fitness owner sharing transformation story, emotional delivery. Opens medium shot, proud expression. Speaks about real change. Close-up showing genuine emotion. Final shot: inspired, motivating energy. 15 seconds.",
    veo31Prompt: "Fitness trainer sharing client success story. Proud, emotional expression. Professional gym lighting, genuine delivery. 8 seconds.",
    brollPrompts: ["Woman confidently working out. Progress photo style shots. Triumphant moment. 4 seconds."],
    onScreenText: ["6 months. 30 pounds.", "But the real change?", "She stopped apologizing.", "THAT'S transformation."]
  },
  {
    day: 23,
    avatar: 'Boutique Owner',
    title: 'Style vs Fashion',
    category: 'tips',
    voiceover: "Fashion is what's on the runway. Style is knowing who you are. I've seen women in $50 outfits outshine women in $5000 designer pieces. The difference? Confidence. Own what you wear.",
    wan26Prompt: "Boutique owner speaking with conviction about style philosophy. Opens medium shot, knowing expression. Gestures as she makes her points. Final shot: confident, empowering energy. 15 seconds.",
    veo31Prompt: "Stylist discussing fashion vs style, authoritative energy. Confident expression, passionate delivery. Natural boutique lighting. 8 seconds.",
    brollPrompts: ["Simple outfit styled well. Confident woman walking. Mirror reflection. 4 seconds."],
    onScreenText: ["Fashion = runway", "Style = knowing yourself", "Confidence > price tag", "Own what you wear."]
  },
  {
    day: 24,
    avatar: 'Café Owner (Woman)',
    title: 'Behind the Scenes',
    category: 'explainer',
    voiceover: "Want to know what 5 AM looks like at a coffee shop? Ovens warming. Beans grinding. Chairs being unstacked. It's quiet magic before the chaos. This is my favorite hour.",
    wan26Prompt: "Café owner in early morning café, behind the scenes tour. Shows different activities as she speaks. Peaceful pre-opening energy. Final shot: content smile, love for her work. 15 seconds.",
    veo31Prompt: "Café owner giving early morning tour. Peaceful energy, showing morning prep. Soft pre-dawn lighting. 8 seconds.",
    brollPrompts: ["Oven light turning on. Coffee grinder starting. Chairs being arranged. 5 seconds."],
    onScreenText: ["5 AM:", "Ovens. Beans. Chairs.", "Quiet magic.", "My favorite hour."]
  },
  {
    day: 25,
    avatar: 'Café Owner (Man)',
    title: 'Coffee Education',
    category: 'tips',
    voiceover: "Quick coffee lesson: Light roast has MORE caffeine than dark roast. I know, it sounds backwards. The longer you roast, the more caffeine burns off. You're welcome for the knowledge.",
    wan26Prompt: "Café owner in educational mode, holding two different roasts. Comparing them as he explains. Slight smugness at the knowledge drop. Final shot: satisfied expression, 'now you know' energy. 15 seconds.",
    veo31Prompt: "Café owner teaching coffee fact, holding roast samples. Expert energy, friendly delivery. Warm café lighting. 8 seconds.",
    brollPrompts: ["Light and dark roast comparison. Beans being examined. Pour over brewing. 4 seconds."],
    onScreenText: ["Coffee lesson:", "Light roast = MORE caffeine", "Sounds backwards, right?", "You're welcome."]
  },
  {
    day: 26,
    avatar: 'Fitness Studio Owner',
    title: 'Gym Anxiety',
    category: 'faq',
    voiceover: "Gym anxiety is real. And here's a secret: everyone feels it sometimes. Even trainers. The gym isn't for fit people—it's for people who want to BECOME fit. Everyone started somewhere. Including me.",
    wan26Prompt: "Fitness owner speaking empathetically about gym anxiety. Opens medium shot, understanding expression. Shares vulnerability. Final shot: warm, welcoming energy. 15 seconds.",
    veo31Prompt: "Fitness trainer addressing gym anxiety, empathetic energy. Understanding expression, warm delivery. Professional but approachable. 8 seconds.",
    brollPrompts: ["Empty gym equipment. Person tentatively entering gym. Encouraging trainer interaction. 4 seconds."],
    onScreenText: ["Gym anxiety is real.", "Even trainers feel it.", "The gym is for BECOMING fit.", "Everyone started somewhere."]
  },
  {
    day: 27,
    avatar: 'Boutique Owner',
    title: 'Closet Clean-Out',
    category: 'tips',
    voiceover: "Closet clean-out rule: If you haven't worn it in a year, it goes. If it doesn't fit, it goes. If you have to convince yourself you like it, it goes. Clear space, clear mind. You'll thank me.",
    wan26Prompt: "Boutique owner with authoritative energy about closet organization. Direct to camera, listing rules. Firm but friendly delivery. Final shot: confident, 'trust me' expression. 15 seconds.",
    veo31Prompt: "Stylist giving closet clean-out advice, authoritative energy. Direct delivery, confident expression. Natural lighting. 8 seconds.",
    brollPrompts: ["Clothes being sorted. Donation pile growing. Organized closet reveal. 5 seconds."],
    onScreenText: ["Clean-out rules:", "1 year? Gone.", "Doesn't fit? Gone.", "Clear space, clear mind."]
  },
  {
    day: 28,
    avatar: 'Café Owner (Woman)',
    title: 'Weekend Special',
    category: 'promo',
    voiceover: "This weekend only: bring a friend who's never been here. Their first drink is on us. Seriously. We want to meet your people. Because your people become our people. See you Saturday.",
    wan26Prompt: "Café owner excited about promotion, welcoming energy. Opens with enthusiastic announcement. Warm, inviting delivery. Final shot: excited, 'see you there' energy. 15 seconds.",
    veo31Prompt: "Café owner announcing promotion, excited energy. Warm, welcoming expression. Golden hour café lighting. 8 seconds.",
    brollPrompts: ["Friends ordering together. Drinks being made. Happy customer interactions. 4 seconds."],
    onScreenText: ["This weekend only:", "Bring a friend. Free drink.", "Your people = our people.", "See you Saturday!"]
  },
  {
    day: 29,
    avatar: 'Café Owner (Man)',
    title: 'Closing Time',
    category: 'brand-story',
    voiceover: "My favorite moment isn't opening—it's closing. When the last customer leaves and I can look around at what we built today. Every conversation, every connection. That's what this place is about.",
    wan26Prompt: "Café owner in quiet closing time café. Reflective mood, looking around space. Soft evening lighting. Speaks thoughtfully about the day. Final shot: content, proud expression. 15 seconds.",
    veo31Prompt: "Café owner at closing time, reflective energy. Looking around empty café, content expression. Soft evening lighting. 8 seconds.",
    brollPrompts: ["Chair being flipped up. Lights dimming. Final wipe of counter. 4 seconds."],
    onScreenText: ["Favorite moment?", "Not opening. Closing.", "Looking at what we built.", "Every connection matters."]
  },
  {
    day: 30,
    avatar: 'Fitness Studio Owner',
    title: 'Your Journey Starts',
    category: 'promo',
    voiceover: "If you've made it to day 30 of watching these videos, you're ready. You don't need more motivation. You need action. DM me 'START' and let's talk about your goals. No pressure. Just conversation. Your journey begins now.",
    wan26Prompt: "Fitness owner with motivating call-to-action energy. Direct to camera, confident and encouraging. Leans in slightly for emphasis. Final shot: warm but challenging expression, 'let's do this' energy. 15 seconds.",
    veo31Prompt: "Fitness trainer with final motivating message. Direct, encouraging expression. Professional lighting, inspiring delivery. 8 seconds.",
    brollPrompts: ["Gym doors opening. New member signing up. First workout beginning. 4 seconds."],
    onScreenText: ["Day 30.", "You don't need more motivation.", "You need ACTION.", "DM 'START' - Let's talk."]
  },
]

export default function DeliverablesPage() {
  const [expandedDay, setExpandedDay] = useState<number | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [filterAvatar, setFilterAvatar] = useState<string>('all')

  const avatars = Array.from(new Set(thirtyDayContent.map(c => c.avatar)))

  const filteredContent = filterAvatar === 'all'
    ? thirtyDayContent
    : thirtyDayContent.filter(c => c.avatar === filterAvatar)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(id)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const exportAllContent = () => {
    let exportText = "# BrandVoice 30-Day Content Calendar\n\n"
    thirtyDayContent.forEach(item => {
      exportText += `## Day ${item.day}: ${item.title}\n`
      exportText += `**Avatar:** ${item.avatar}\n`
      exportText += `**Category:** ${categoryLabels[item.category]}\n\n`
      exportText += `### Voiceover Script\n${item.voiceover}\n\n`
      exportText += `### Wan 2.6 Prompt\n${item.wan26Prompt}\n\n`
      exportText += `### Veo 3.1 Prompt\n${item.veo31Prompt}\n\n`
      exportText += `### B-Roll Prompts\n${item.brollPrompts.join('\n')}\n\n`
      exportText += `### On-Screen Text\n${item.onScreenText.join('\n')}\n\n`
      exportText += `---\n\n`
    })

    const blob = new Blob([exportText], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'brandvoice-30-day-calendar.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-7 h-7 text-purple-600" />
            30-Day Content Deliverable
          </h1>
          <p className="text-gray-600 mt-1">Complete 30-day UGC content calendar with all prompts and scripts</p>
        </div>
        <button
          onClick={exportAllContent}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Export All
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-purple-600">30</div>
          <div className="text-sm text-gray-500">Total Videos</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-blue-600">4</div>
          <div className="text-sm text-gray-500">Avatars</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-green-600">15s</div>
          <div className="text-sm text-gray-500">Video Length</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-orange-600">9:16</div>
          <div className="text-sm text-gray-500">Aspect Ratio</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-pink-600">6</div>
          <div className="text-sm text-gray-500">Categories</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by Avatar:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterAvatar('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filterAvatar === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({thirtyDayContent.length})
            </button>
            {avatars.map(avatar => (
              <button
                key={avatar}
                onClick={() => setFilterAvatar(avatar)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filterAvatar === avatar ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {avatar} ({thirtyDayContent.filter(c => c.avatar === avatar).length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="space-y-3">
        {filteredContent.map((item) => (
          <div key={item.day} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <button
              onClick={() => setExpandedDay(expandedDay === item.day ? null : item.day)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">{item.day}</span>
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${categoryColors[item.category]}`}>
                      {categoryLabels[item.category]}
                    </span>
                    <span className="font-medium text-gray-900">{item.title}</span>
                  </div>
                  <span className="text-sm text-gray-500">{item.avatar}</span>
                </div>
              </div>
              {expandedDay === item.day ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {expandedDay === item.day && (
              <div className="p-4 pt-0 space-y-4 border-t border-gray-100">
                {/* Voiceover */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Voiceover Script
                    </h4>
                    <button
                      onClick={() => copyToClipboard(item.voiceover, `vo-${item.day}`)}
                      className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded flex items-center gap-1"
                    >
                      {copiedField === `vo-${item.day}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedField === `vo-${item.day}` ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-sm text-gray-800 italic">&quot;{item.voiceover}&quot;</p>
                </div>

                {/* Wan 2.6 Prompt */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Wan 2.6 Prompt (15s)
                    </h4>
                    <button
                      onClick={() => copyToClipboard(item.wan26Prompt, `wan-${item.day}`)}
                      className="text-xs bg-blue-200 hover:bg-blue-300 text-blue-800 px-2 py-1 rounded flex items-center gap-1"
                    >
                      {copiedField === `wan-${item.day}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedField === `wan-${item.day}` ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-sm text-blue-800">{item.wan26Prompt}</p>
                </div>

                {/* Veo 3.1 Prompt */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-purple-700 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Veo 3.1 Prompt (8s)
                    </h4>
                    <button
                      onClick={() => copyToClipboard(item.veo31Prompt, `veo-${item.day}`)}
                      className="text-xs bg-purple-200 hover:bg-purple-300 text-purple-800 px-2 py-1 rounded flex items-center gap-1"
                    >
                      {copiedField === `veo-${item.day}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedField === `veo-${item.day}` ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-sm text-purple-800">{item.veo31Prompt}</p>
                </div>

                {/* B-Roll */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-yellow-700 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      B-Roll Prompts
                    </h4>
                    <button
                      onClick={() => copyToClipboard(item.brollPrompts.join('\n\n'), `broll-${item.day}`)}
                      className="text-xs bg-yellow-200 hover:bg-yellow-300 text-yellow-800 px-2 py-1 rounded flex items-center gap-1"
                    >
                      {copiedField === `broll-${item.day}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedField === `broll-${item.day}` ? 'Copied!' : 'Copy All'}
                    </button>
                  </div>
                  {item.brollPrompts.map((prompt, idx) => (
                    <p key={idx} className="text-sm text-yellow-800 mb-2">{prompt}</p>
                  ))}
                </div>

                {/* On-Screen Text */}
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-green-700 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      On-Screen Text
                    </h4>
                    <button
                      onClick={() => copyToClipboard(item.onScreenText.join('\n'), `text-${item.day}`)}
                      className="text-xs bg-green-200 hover:bg-green-300 text-green-800 px-2 py-1 rounded flex items-center gap-1"
                    >
                      {copiedField === `text-${item.day}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedField === `text-${item.day}` ? 'Copied!' : 'Copy All'}
                    </button>
                  </div>
                  <div className="space-y-1">
                    {item.onScreenText.map((text, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-xs text-green-600 font-mono">{idx + 1}.</span>
                        <span className="text-sm text-green-800 font-medium">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
