'use client'

import { useState } from 'react'
import { Copy, Check, Plus, Trash2, Edit2, Save, X, Film, Video, Sparkles, Megaphone, Gift, Lightbulb, Zap } from 'lucide-react'

interface Prompt {
  id: string
  avatar: string
  scriptName: string
  voiceover: string
  wan26Prompt: string
  veo31Prompt: string
  veo3HookPrompt: string      // 8-second hook segment
  veo3EduPrompt: string       // Educational piece segment
  veo3AdPrompt: string
  veo3AdPrompt10s: string
  veo3ValuePrompt: string
  veo3ValuePrompt10s: string
  brollPrompts: string[]
  duration: string
  status: 'draft' | 'tested' | 'approved'
  notes: string
}

// Initial prompts data
const initialPrompts: Prompt[] = [
  // ====== FITNESS STUDIO OWNER (Zenith Fitness) ======
  {
    id: '1',
    avatar: 'Fitness Studio Owner',
    scriptName: '30 Minute Truth',
    voiceover: "Everyone says they don't have time for fitness. Here's the truth - 30 minutes, three times a week, changes everything. That's less time than you spend scrolling. Ready to feel different? Link in bio.",
    wan26Prompt: "Athletic European woman speaking to camera in modern fitness studio. Opens with tight close-up on face, direct eye contact, serious tone. Camera slowly pulls back revealing gym environment. Mid-video: cut to medium shot from different angle, she gestures expressively with hands. Final moments: wider shot showing full upper body, confident smile, slight forward lean toward camera. Natural movement throughout, professional gym lighting, energetic but grounded delivery. Continuous speech synced to audio. 15 seconds.",
    veo31Prompt: "Athletic woman in modern gym speaking directly to camera. Close-up face shot, intense eye contact, subtle head movements. Professional lighting, shallow depth of field on gym equipment background. Confident, motivating energy. 8 seconds.",
    veo3HookPrompt: `8-SECOND HOOK: "Stop scrolling. This is your sign."

Female fitness trainer stops mid-workout, drops her weights, turns and walks directly toward camera with intense eye contact. She's sweating, breathing heavy, completely real.

She speaks with urgency: "You've saved this video before. You told yourself 'tomorrow.' But tomorrow became last year."

9:16 vertical, modern gym, golden hour light through windows, raw authenticity, immediate attention grab. 8 seconds exactly.`,
    veo3EduPrompt: `EDUCATIONAL PIECE: "The 30-Minute Fitness Truth"

Same fitness trainer, now positioned center frame, educational tone but still energetic.

"Here's what nobody talks about. You don't need two hours. You don't need fancy equipment. You need consistency."

She counts on her fingers: "Thirty minutes. Three days a week. Compound movements only—squats, deadlifts, presses."

She demonstrates a quick squat: "This alone hits 80% of your muscles."

"Start with bodyweight. Add weight when it feels easy. Track your progress."

She looks directly at camera: "That's it. That's the whole secret. Everyone overcomplicates this."

9:16 vertical, clear educational delivery, demonstration moments, helpful expert energy. 20-25 seconds.`,
    veo3AdPrompt: `HOOK: "Stop scrolling. This is your sign."

A confident female fitness trainer stops mid-workout, drops her weights, and walks directly toward camera with intense eye contact. She's sweating slightly, breathing heavy, real. Modern boutique gym with golden hour light streaming through floor-to-ceiling windows.

She speaks directly to camera with raw authenticity: "You've saved this video before. You've told yourself 'tomorrow.' But tomorrow became last month. Became last year."

Camera slowly pushes in on her face as her expression shifts from challenging to understanding.

"Thirty minutes. Three days a week. That's it. Not asking you to change your life—just asking you to start."

She extends her hand toward camera in an invitation gesture. Slight smile. Vulnerable but strong.

"First class is free. No catch. Just show up. Link in bio."

She turns back to her workout. Camera holds on her as she picks up the weights again with renewed purpose.

9:16 vertical, cinematic quality, natural audio environment with subtle gym ambiance, hyperrealistic skin texture, authentic sweat, genuine emotion. 15-20 seconds.`,
    veo3AdPrompt10s: `HOOK: "Stop scrolling. This is your sign."

Female fitness trainer mid-workout, drops weights, walks directly to camera. Sweating, real, intense eye contact.

"You've saved this video before. Tomorrow became last year."

She extends her hand: "First class free. Just show up."

9:16 vertical, gym setting, golden hour light, raw authenticity, urgent energy. 10 seconds.`,
    veo3ValuePrompt: `HOOK: "Here's the 5-minute warm-up that changed everything for my clients"

Confident female fitness trainer stands in a modern gym, morning light streaming through windows. She's in workout clothes, approachable energy.

"Okay, free game. No sign-up, no DM required. Just watch."

She demonstrates as she speaks: "Hip circles—10 each direction. Most people skip these and wonder why their lower back hurts."

Quick cut: Her doing hip circles with perfect form. Camera catches the movement in detail.

"Dead hangs—30 seconds. Decompresses your spine, opens your shoulders." She hangs from a pull-up bar, breathing calmly.

"Cat-cows—1 minute. Wake up your entire posterior chain."

She flows through the movement, camera at her level.

Final shot, she looks directly at camera: "Do this before every workout. Your body will thank you in 10 years."

She smiles genuinely: "Save this. Come back to it. And when you're ready for the full program—" She gestures casually. "You know where to find me."

9:16 vertical, educational fitness content, warm natural lighting, clear movement demonstrations, helpful authentic energy. 25-30 seconds.`,
    veo3ValuePrompt10s: `HOOK: "5-minute warm-up. Free game."

Female trainer in gym, morning light. Quick demonstration energy.

"Hip circles, 10 each. Dead hangs, 30 seconds. Cat-cows, 1 minute."

She demonstrates each briefly in rapid succession.

"Do this before every workout. Your body thanks you later."

9:16 vertical, educational fitness, clear demos, helpful energy. 10 seconds.`,
    brollPrompts: [
      "Quick cuts of fitness studio action. Dumbbells being racked. Hands gripping barbell. Feet on treadmill. Water bottle being grabbed. Kettlebell swing in motion. Timer counting down. High five between trainer and client. Modern gym aesthetic, warm lighting, energetic pace. No people's faces. 5-8 seconds.",
      "Cinematic slow pan across empty modern fitness studio at golden hour. Sunlight streaming through windows onto equipment. Pristine dumbbells in rack. Clean yoga mats stacked. Motivational wall art slightly out of focus. Premium boutique gym aesthetic. Calm before the workout energy. 5-8 seconds."
    ],
    duration: '15 sec',
    status: 'draft',
    notes: 'Multi-scene with camera pulls and angle changes'
  },
  {
    id: '2',
    avatar: 'Fitness Studio Owner',
    scriptName: 'The Excuse Everyone Uses',
    voiceover: "I'll start Monday. I'm too out of shape. I don't know what I'm doing. Sound familiar? Every successful client started with those exact excuses. The difference? They showed up anyway. Your turn.",
    wan26Prompt: "Confident female fitness trainer in bright modern gym, speaking directly to camera. Begins with medium shot, knowing smirk, listing excuses. Quick transition to close-up as tone shifts to empathetic. Camera movement creates energy - slight push in during 'showed up anyway.' Final beat: pulls to wider angle, she crosses arms confidently, warm encouraging expression. Dynamic scene changes maintain attention. Lip-synced to voiceover, 15 seconds.",
    veo31Prompt: "Female fitness trainer in gym, medium shot transitioning to close-up. Knowing expression shifts to empathetic then confident. Subtle camera push in. Warm professional lighting. Motivational delivery. 8 seconds.",
    veo3HookPrompt: `8-SECOND HOOK: "POV: You just said 'I'll start Monday' for the 47th time"

Close-up of woman's face, she's on her couch, phone in hand, scrolling. Flat, unflattering lighting—intentionally real.

She looks up at camera, breaking the fourth wall: "I was you. Every Monday was 'the Monday.' Until it wasn't."

HARD CUT to: Same woman in a gym, post-workout glow, golden lighting. She looks ALIVE.

9:16 vertical, documentary authenticity, before/after contrast, immediate hook. 8 seconds exactly.`,
    veo3EduPrompt: `EDUCATIONAL PIECE: "Why Your Excuses Feel Unique (But Aren't)"

Same fitness trainer in gym, educational tone, relatable energy.

"Every excuse you've told yourself? I've heard it a thousand times. Let's break them down."

She counts on fingers: "One: 'I don't have time.' Reality? You have 30 minutes. You spend more time deciding what to watch on Netflix."

"Two: 'I'm too out of shape to start.' That's literally why you start. Nobody walks in ready."

"Three: 'I don't know what I'm doing.' Neither did anyone else. That's what trainers are for."

She leans in: "The secret? Everyone who transformed felt exactly like you do right now. They just showed up anyway—scared, confused, uncomfortable."

Final shot: "Your excuses aren't protecting you. They're keeping you stuck."

9:16 vertical, myth-busting format, relatable delivery, actionable truth. 20-25 seconds.`,
    veo3AdPrompt: `HOOK: "POV: You just said 'I'll start Monday' for the 47th time"

Close-up of woman's face, she's clearly having an internal moment of frustration with herself. She's in workout clothes but sitting on her couch, phone in hand, scrolling. The lighting is flat, almost unflattering—intentionally real.

She looks up at camera, breaking the fourth wall: "I was you. Every Monday was 'the Monday.' Until it wasn't."

HARD CUT to: Same woman, different energy. She's in a gym, slightly out of breath, post-workout glow. The lighting is warm, golden. She looks ALIVE.

"The gym didn't change. The workout didn't change. I just... stopped negotiating with myself."

She walks toward camera with intensity: "Your excuses aren't unique. They're the same ones everyone uses. 'Too busy.' 'Too tired.' 'Don't know where to start.'"

Close-up, softer now: "But here's what nobody tells you—the people who actually transform? They felt the exact same way. They just showed up scared."

She gestures to the gym around her: "This isn't a gym for fitness influencers. It's for people who are done lying to themselves."

Final shot: She extends hand toward camera. "Monday's over. Come fail with us. Link in bio."

9:16 vertical, documentary-style authenticity, natural imperfections, genuine emotion, raw audio. 20-25 seconds.`,
    veo3AdPrompt10s: `HOOK: "POV: 'I'll start Monday' for the 47th time"

Woman on couch scrolling, looks up. Hard cut to: Same woman in gym, glowing, post-workout.

"The gym didn't change. I stopped negotiating with myself."

She extends hand: "Come fail with us."

9:16 vertical, before/after energy, raw authenticity. 10 seconds.`,
    veo3ValuePrompt: `HOOK: "The 3 exercises I give every new client—regardless of their goal"

Female fitness trainer sits on a workout bench, speaking casually like she's talking to a friend. Gym setting, natural lighting.

"Whether you want to lose weight, build muscle, or just feel better—these three moves are non-negotiable."

She stands, demonstrating: "Goblet squat. Fixes your squat pattern AND builds your legs. Here's the cue that changes everything—" She shows the movement. "Spread the floor with your feet."

Cut to: "Romanian deadlift. Protects your back for LIFE." She demonstrates with controlled form. "Slow down. Feel the stretch."

Final movement: "Farmer carries. Full-body strength, core stability, grip strength, better posture. Just walk." She walks with dumbbells, perfect posture.

Back to her sitting: "Do these three, twice a week. Even with no other exercise—you'll feel different in 30 days."

She shrugs with a warm smile: "That's it. That's the secret. No gatekeeping here."

9:16 vertical, educational workout content, clear demonstrations, friendly expert energy, actionable value. 25-30 seconds.`,
    veo3ValuePrompt10s: `HOOK: "3 exercises. Every goal. No exceptions."

Trainer sitting on bench, friendly energy.

"Goblet squat. Romanian deadlift. Farmer carries."

Quick cuts of each movement demonstrated.

"Twice a week. Feel different in 30 days. That's the secret."

9:16 vertical, rapid educational format, clear demos. 10 seconds.`,
    brollPrompts: [
      "Montage of workout preparation. Lacing up sneakers. Putting in earbuds. Filling water bottle. Hand pressing start on treadmill. Clock showing early morning. Gym bag being packed. Determination energy. 5-8 seconds."
    ],
    duration: '15 sec',
    status: 'draft',
    notes: 'Emotional tone shift mid-video'
  },
  {
    id: '3',
    avatar: 'Fitness Studio Owner',
    scriptName: 'Do I Really Need a Trainer?',
    voiceover: "I get this question all the time—do I really need a trainer if I already work out? Here's the thing: most people hit a plateau because they're doing the same routine. A good trainer doesn't just push you—they see what you can't. That's when real change happens.",
    wan26Prompt: "A confident fitness studio owner stands in her modern gym space, speaking directly to camera with warm energy. She's wearing a mauve athletic set with a black zip-up jacket, her honey-blonde waves falling naturally. Behind her, the FITNESS logo is visible on a clean reception desk. Natural morning light fills the space. She gestures naturally as she addresses a common question, her expression shifting from understanding to enthusiastic as she explains. Cinematic quality, 9:16 vertical format, 15 seconds. Subtle camera movement, shallow depth of field on her face.",
    veo31Prompt: "Fitness studio owner in modern gym, medium shot. Understanding expression shifting to enthusiastic as she explains. Natural morning light, reception desk background. Professional but warm energy. 8 seconds.",
    veo3HookPrompt: `8-SECOND HOOK: "You don't need a trainer. Watch this anyway."

Woman walks into frame mid-workout, wiping sweat with a towel. Pauses, looks directly at camera with a knowing half-smile.

"You already work out. You've got your routine. So why haven't you seen real change in... how long?"

She sets down the towel, steps closer to camera, more intimate.

9:16 vertical, modern gym, confident challenge energy, immediate engagement. 8 seconds exactly.`,
    veo3EduPrompt: `EDUCATIONAL PIECE: "The Hidden Plateau Problem"

Same fitness trainer, educational mode, whiteboard or gym background.

"Here's something that took me five years to learn. Your body adapts to your workout in about 4-6 weeks. After that? You're just maintaining."

She draws a simple graph: "This is the adaptation curve. Your body gets efficient. It stops being challenged."

She points to the plateau line: "Most people live here. They work out consistently but never actually transform."

"The fix? Periodization. Change one variable every 3-4 weeks." She counts: "Tempo. Rest periods. Volume. Exercise selection."

She demonstrates: "Same squat, different tempo—3 seconds down, pause at bottom, explosive up. Completely different stimulus."

Final shot: "Your workout isn't broken. It just needs to evolve. That's literally what trainers are trained to see."

9:16 vertical, educational breakdown, visual demonstration, expert authority. 20-25 seconds.`,
    veo3AdPrompt: `HOOK: "You don't need a trainer. Watch this anyway."

Woman walks into frame mid-workout, wiping sweat with a towel. She pauses, looks directly at camera with a knowing half-smile.

"You already work out. You've got your routine. You know what you're doing." She tilts her head slightly. "So why haven't you seen real change in... how long?"

She sets down the towel and walks closer to camera, more intimate now.

"Here's what took me five years to learn: Your body adapted to your workout months ago. It's not challenged anymore. You're maintaining, not transforming."

Cut to: She's correcting someone's form on a deadlift—subtle adjustment to hip position. The person's face shows a moment of revelation.

Back to her, direct to camera: "A trainer doesn't just count your reps. They see the compensation patterns. The muscle imbalances. The form breakdown you can't feel."

She crosses her arms, confident but not arrogant: "You don't NEED a trainer. But if you want to stop plateauing and actually see what you're capable of..."

She gestures behind her to the gym: "Free assessment. Let me show you what you're missing. Link in bio."

9:16 vertical, premium fitness brand aesthetic, motivated lighting, authentic gym sounds, cinematic depth. 20-25 seconds.`,
    veo3AdPrompt10s: `HOOK: "You don't need a trainer. Watch this anyway."

Woman mid-workout, pauses, direct to camera with knowing smile.

"Your body adapted months ago. You're maintaining, not transforming."

She gestures to gym: "Free assessment. Let me show you what you're missing."

9:16 vertical, premium gym setting, confident energy. 10 seconds.`,
    veo3ValuePrompt10s: `HOOK: "3 signs you've plateaued. Free fix."

Trainer leaning against squat rack, direct to camera.

"No strength gains in a month. Never sore. Bored."

Quick cut: "Change ONE variable every 3 weeks. Tempo. Rest. Volume."

"Same exercises, new stimulus. That's the secret."

9:16 vertical, rapid educational format, expert energy. 10 seconds.`,
    veo3ValuePrompt: `HOOK: "3 signs your workout isn't working anymore (and what to do about it)"

Female fitness trainer leans against a squat rack, speaking directly to camera like she's revealing insider info.

"Your workout stopped working. You can feel it. Here's how to know for sure—"

She holds up one finger: "One: You haven't increased weight OR reps in over a month. Your body adapted. It's cruising."

Two fingers: "Two: You're not sore anymore. Ever. Some soreness means stimulus. None means... maintenance mode."

Three fingers: "Three: You're bored. And here's the thing—" She steps closer to camera. "Your body knows when you're bored. It checks out too."

She walks toward a whiteboard with a simple chart: "The fix? Simple. Change ONE variable every 3-4 weeks. Tempo. Rest time. Exercise order. Volume."

She draws a quick diagram: "Same exercises, different stimulus. That's the secret the fitness industry doesn't want you to know because it's free."

Final shot, she caps the marker: "Screenshot this. Apply it. Come back and tell me I'm wrong."

9:16 vertical, educational fitness breakdown, whiteboard visual element, expert authority, immediate value. 25-30 seconds.`,
    brollPrompts: [
      "Close-up of hands adjusting weight plates on a barbell, gym setting, warm lighting, 9:16 vertical, 3 seconds",
      "Person doing a perfect squat form from side angle, modern gym background, slow motion, 9:16 vertical, 3 seconds",
      "Trainer pointing at a workout chart on clipboard, shallow depth of field, 9:16 vertical, 2 seconds"
    ],
    duration: '15 sec',
    status: 'draft',
    notes: 'FAQ format - addresses common objection'
  },

  // ====== BOUTIQUE OWNER (Maison Noir) ======
  {
    id: '4',
    avatar: 'Boutique Owner',
    scriptName: 'Personal Styling Truth',
    voiceover: "Personal styling isn't about telling you what to wear. It's about understanding your life—your meetings, your weekends, what makes you feel powerful. I build wardrobes that actually work. Book a session, and let's find your look.",
    wan26Prompt: "A stylish Latina boutique owner in a dark teal blazer over a tan fitted dress stands among clothing racks in a light-filled boutique. She's mid-motion, thoughtfully touching a garment on the rack as she speaks to camera with the confidence of someone who truly knows style. Potted plants and natural wood floors create a warm, curated atmosphere. She makes eye contact, gestures to the clothes around her, then back to camera with a welcoming smile. 9:16 vertical, 15 seconds, soft natural lighting, cinematic shallow focus.",
    veo31Prompt: "Stylish Latina boutique owner among clothing racks, touching garments while speaking. Dark teal blazer, tan dress. Soft natural lighting, plants in background. Confident, welcoming energy. 8 seconds.",
    veo3HookPrompt: `8-SECOND HOOK: "I styled a CEO who wore the same 3 outfits for 2 years."

Elegant Latina woman in a beautifully curated boutique, soft morning light. She's holding a silk blouse, speaking directly to camera.

"She came to me exhausted. Decision fatigue. 'I just want to look good without thinking about it.'"

She moves through the boutique, fingers trailing across fabrics with intention.

9:16 vertical, luxury boutique, soft focus, intimate reveal energy. 8 seconds exactly.`,
    veo3EduPrompt: `EDUCATIONAL PIECE: "The Personal Styling Truth"

Same boutique owner, educational tone, surrounded by curated pieces.

"People think styling is about trends. It's not. It's about understanding YOUR life."

She pulls out three distinct outfits: "Your 7am call look. Your client dinner look. Your Sunday brunch energy."

She arranges pieces on a rack: "Here's what most people get wrong—they buy clothes for the life they WANT, not the life they HAVE."

She picks up a blazer: "This blazer? It needs to go from office to dinner without you changing. That's the test."

She demonstrates mixing pieces: "Same blazer, different base layers. Three occasions. One piece doing three jobs."

Final shot: "Your wardrobe should be a system, not a collection. That's the difference between 'dressed' and 'put-together.'"

9:16 vertical, fashion education, clear demonstration, expert authority. 20-25 seconds.`,
    veo3AdPrompt: `HOOK: "I styled a CEO who wore the same 3 outfits for 2 years. Here's what happened."

Elegant Latina woman in a beautifully curated boutique, soft morning light streaming through windows. She's holding a silk blouse, speaking directly to camera with quiet authority.

"She came to me exhausted. Decision fatigue. 'I just want to look good without thinking about it.'"

She moves through the boutique, fingers trailing across fabrics with intention.

"People think personal styling is about trends. About 'what's in.'" She shakes her head slightly, knowing smile. "It's not."

She turns to camera, more intimate: "It's about understanding your actual life. Your 7am calls. Your client dinners. Your Sunday brunch energy."

Cut to: Her hands selecting pieces from a rack with precision. Each choice deliberate.

"I don't dress you for Instagram. I dress you for the moments that matter."

She holds up a structured blazer, examining it: "When you walk into that room and you don't have to think about what you're wearing? That's power."

Final shot: She extends the blazer toward camera like an invitation.

"Your wardrobe should feel like armor, not anxiety. Free consultation—link in bio. Let's build your uniform."

9:16 vertical, luxury editorial aesthetic, soft focus background, intimate natural audio, high-end boutique atmosphere. 20-25 seconds.`,
    veo3ValuePrompt: `HOOK: "The 3 pieces every woman needs—regardless of style, size, or budget"

Elegant Latina boutique owner stands in a beautifully lit dressing room, speaking with warm authority.

"I've dressed hundreds of women. Every body type. Every budget. And these three pieces?" She pulls them from a rack. "Universal."

She holds up a structured blazer: "One. A blazer that fits your SHOULDERS. Not your waist—your shoulders. Tailor the rest. This silhouette changes everything."

Second piece—a silk cami or quality tee: "Two. A quality base layer in YOUR best neutral. Not everyone's neutral is white. Some of you are cream. Some are black. Know yours."

Third—tailored trousers: "Three. Mid-rise, straight leg trouser. Not wide. Not skinny. The in-between that works with everything."

She arranges all three together: "These three pieces? Fifteen different outfits minimum. Add a scarf, a statement earring, switch the shoes—endless."

She looks at camera with genuine care: "Stop buying trends. Build a foundation. This is your foundation."

Final shot: "Screenshot this. Take it shopping. Thank me later."

9:16 vertical, fashion education content, clear product showcasing, warm expert energy, immediately actionable. 25-30 seconds.`,
    veo3AdPrompt10s: `HOOK: "She wore 3 outfits for 2 years. Here's what happened."

Elegant woman in boutique, holding silk blouse.

"Decision fatigue. 'I just want to look good without thinking.'"

She extends blazer toward camera: "Your wardrobe should feel like armor, not anxiety."

9:16 vertical, luxury boutique, invitation energy. 10 seconds.`,
    veo3ValuePrompt10s: `HOOK: "3 pieces. Every woman. Every budget."

Stylist in dressing room, warm energy.

"Blazer that fits your shoulders. Base layer in YOUR neutral. Mid-rise straight trousers."

Quick cuts of each piece.

"That's the foundation. Everything else is optional."

9:16 vertical, fashion education, clear showcasing. 10 seconds.`,
    brollPrompts: [
      "Elegant hands sliding hangers across a clothing rack, soft fabrics visible, boutique lighting, 9:16 vertical, 3 seconds",
      "Close-up of designer fabric texture being touched, shallow depth of field, warm tones, 9:16 vertical, 2 seconds",
      "Woman confidently checking herself in mirror wearing new outfit, back view, natural light, 9:16 vertical, 3 seconds",
      "Neatly organized closet with color-coordinated clothes, satisfying aesthetic, 9:16 vertical, 2 seconds"
    ],
    duration: '15 sec',
    status: 'draft',
    notes: 'Explainer format - service explanation'
  },
  {
    id: '5',
    avatar: 'Boutique Owner',
    scriptName: 'The Capsule Wardrobe Secret',
    voiceover: "Want to know the secret to looking put-together every single day? It's not about having MORE clothes. It's about having the RIGHT pieces that work together. Twenty items. Endless outfits. Let me show you how.",
    wan26Prompt: "Elegant Latina woman in upscale boutique, speaking directly to camera. Opens medium shot showing stylish outfit. Gestures to clothing around her as she speaks. Mid-video: camera moves to show organized rack of coordinated pieces. Final shot: close-up warm smile, slight head tilt, inviting energy. Natural boutique lighting, sophisticated atmosphere. 15 seconds.",
    veo31Prompt: "Boutique owner surrounded by curated clothing, medium shot. Gestures to coordinated pieces while explaining concept. Natural lighting, sophisticated setting. Confident, educational tone. 8 seconds.",
    veo3HookPrompt: `8-SECOND HOOK: "I own 23 pieces of clothing. I look better than people with full closets."

Stylish Latina woman stands in front of a minimalist, perfectly organized closet. Camera slowly reveals the sparse but impeccable selection.

"Everyone thinks they need more clothes." She slides a few hangers. "They don't. They need better ones."

9:16 vertical, minimalist closet, soft natural light, confident revelation. 8 seconds exactly.`,
    veo3EduPrompt: `EDUCATIONAL PIECE: "The Capsule Wardrobe Formula"

Same stylist, now teaching mode, with organized closet visible.

"Here's the math nobody teaches you. Twenty pieces. Fifteen different outfits. Minimum."

She pulls out pieces: "Three bottoms. Four tops. Two layering pieces. Two jackets. Three shoes. That's it."

She demonstrates combinations: "These trousers with this blouse and blazer—office. Same trousers, different top, leather jacket—dinner."

She holds up a neutral blazer: "The trick? Colors that TALK to each other. Not matching—coordinating. Everything should work with everything."

She walks to a color-organized section: "Build around THREE neutrals maximum. Mine are black, cream, and camel. Everything else is accent."

She arranges an outfit: "When every piece works with every other piece? Getting dressed takes 30 seconds."

Final shot: "This isn't minimalism for the sake of minimalism. It's strategy. Stop collecting. Start curating."

9:16 vertical, fashion education, clear visual demonstration, expert formula. 20-25 seconds.`,
    veo3AdPrompt: `HOOK: "I own 23 pieces of clothing. I look better than people with full closets."

Stylish Latina woman stands in front of a minimalist, perfectly organized closet. Camera slowly reveals the sparse but impeccable selection. She's wearing one of those pieces—effortlessly put together.

"Everyone thinks they need more clothes." She slides a few hangers, showing the clean organization. "They don't. They need better ones."

She pulls out a structured blazer, a perfect white tee, tailored trousers—laying them on a bed in frame.

"These three pieces?" She gestures. "Eleven different outfits. Board meeting to date night."

She mixes the pieces with quick, confident movements: "Add a silk scarf—different mood. Switch the shoes—different energy."

She turns back to camera, leaning against the closet frame: "The women who look effortlessly put-together? They're not shopping every weekend. They invested once. In pieces that actually work."

She holds up her phone, showing a capsule wardrobe chart: "I built a free guide. Twenty pieces, endless combinations. No more 'I have nothing to wear.'"

Final shot—intimate close-up: "Luxury isn't about having more. It's about needing less. Link in bio."

9:16 vertical, lifestyle editorial, ASMR-adjacent audio quality, aspirational minimalism, warm natural light. 25-30 seconds.`,
    veo3ValuePrompt: `HOOK: "How to look expensive on any budget—a stylist's honest breakdown"

Stylish Latina woman sits in a clean, bright space. No fancy boutique backdrop—just real, accessible energy.

"Okay. Let's talk about looking expensive without the price tag." She holds up a basic white tee. "This is from Target. But watch what happens."

She tucks it just right: "The French tuck. Instantly elevated."

She adds a thin gold chain: "One delicate necklace. Not three. Not a statement piece. Delicate."

She shows the shoes: "Clean, minimal shoes. Doesn't matter the brand. CLEAN is the keyword."

Quick demonstration of steaming a garment: "Steam your clothes. Takes 2 minutes. Wrinkles make everything look cheap."

She steps back, showing the full look: "Basic tee, well-fitted jeans, minimal accessories, clean shoes. Under $100. Looks like $500."

She leans toward camera: "Expensive isn't about the price tag. It's about intention. How things fit. How they're maintained. How you carry yourself."

Final shot: "Save this. Try it. Come back and show me."

9:16 vertical, accessible fashion tips, demonstration format, relatable not aspirational, immediately actionable value. 25-30 seconds.`,
    veo3AdPrompt10s: `HOOK: "I own 23 pieces. I look better than people with full closets."

Woman in front of minimal closet, effortlessly styled.

"Everyone thinks they need more clothes. They need better ones."

Holds up blazer, tee, trousers: "Three pieces. Eleven outfits."

"Luxury isn't about having more. Link in bio."

9:16 vertical, aspirational minimalism, warm light. 10 seconds.`,
    veo3ValuePrompt10s: `HOOK: "How to look expensive. Any budget."

Woman holding basic white tee.

"This is from Target. Watch." French tuck. Delicate gold chain. Clean shoes.

"Under $100. Looks like $500."

"Expensive isn't the price tag. It's intention."

9:16 vertical, accessible fashion, demonstration format. 10 seconds.`,
    brollPrompts: [
      "Overhead shot of capsule wardrobe laid out on bed. Neutral tones, quality fabrics visible. Satisfying organized aesthetic. 5 seconds.",
      "Hands mixing and matching outfit combinations. Blazer paired with different bottoms. Quick cuts showing versatility. 5 seconds."
    ],
    duration: '15 sec',
    status: 'draft',
    notes: 'Educational hook - capsule wardrobe concept'
  },

  // ====== CAFÉ OWNER - WOMAN (Goldenroot Coffee) ======
  {
    id: '6',
    avatar: 'Café Owner (Woman)',
    scriptName: 'Five Years Ago',
    voiceover: "Five years ago, this was just a dream and a lot of doubt. Now? This place is where people come to breathe. To talk. To just... be. Every cup we pour carries that intention. Welcome to Goldenroot.",
    wan26Prompt: "A joyful Black woman café owner stands at the entrance of her warm, plant-filled coffee shop during golden hour. She wears a brown apron over a black long-sleeve shirt, holding a perfectly crafted latte with heart art. Keys jingle softly in her other hand as she opens for the day. Her natural hair frames her beaming smile. The sunset light streams through the doorway, creating a magical glow. She speaks with genuine warmth about her journey, occasionally glancing at her café with pride. 9:16 vertical format, 15 seconds, cinematic warmth, intimate handheld feel.",
    veo31Prompt: "Black woman café owner at coffee shop entrance, golden hour. Brown apron, holding latte. Warm genuine smile, looking around space with pride. Magical sunset lighting. Intimate, emotional delivery. 8 seconds.",
    veo3HookPrompt: `8-SECOND HOOK: "I almost didn't open this door today."

Pre-dawn. Beautiful Black woman stands outside a closed coffee shop, keys in hand. Breath visible in cold morning air.

"Everyone romanticizes owning a coffee shop." She unlocks the door. "They don't tell you about the 3am anxiety. The months you don't pay yourself."

She pushes open the door, darkness inside waiting.

9:16 vertical, documentary intimacy, raw honesty, pre-dawn cinematography. 8 seconds exactly.`,
    veo3EduPrompt: `EDUCATIONAL PIECE: "The Truth About Starting a Coffee Shop"

Same café owner, now inside her space, warm lighting, educational tone.

"Five years in, here's what I wish someone told me."

She leans on her counter: "One: Your first year, you're not making money. You're buying experience. Budget for that reality."

She walks to the espresso machine: "Two: Location matters less than you think. Community matters more. People will find you if you give them a reason to."

She gestures around: "Three: Your vibe is your brand. Every detail speaks—the music, the lighting, the cup you choose. It all tells a story."

She pulls a shot: "Four: Learn to make coffee BEFORE you open. Sounds obvious, but you'd be surprised."

She pours: "Five: The customers who come back? They're not coming for the coffee. They're coming for how you make them feel."

Final shot: "The business plan is 20%. The other 80% is showing up when you don't feel like it."

9:16 vertical, founder wisdom, educational storytelling, warm café backdrop. 20-25 seconds.`,
    veo3AdPrompt: `HOOK: "I almost didn't open this door today. Five years ago, I almost didn't open it at all."

Pre-dawn. Beautiful Black woman stands outside a closed coffee shop, keys in hand. She's looking at the door with a mix of emotions—gratitude, exhaustion, pride. Breath visible in the cold morning air.

"Everyone romanticizes owning a coffee shop." She unlocks the door, we follow her inside. The space is dark, quiet, full of potential. "They don't tell you about the 3am anxiety. The months you don't pay yourself."

She flips on the lights. The café transforms—warm, inviting, alive with plants and carefully chosen details.

"But then someone tells you this is their safe place." Her voice catches slightly. She runs her hand along the counter. "That they met their best friend here. That they wrote their novel in that corner."

She starts the espresso machine. Steam rises. The café is waking up.

"Every cup I pour carries five years of 'almost didn't.'" She smiles at camera, genuine warmth. "Almost didn't quit my job. Almost didn't sign that lease. Almost didn't believe I could."

Golden hour light begins streaming through the windows as she holds up a perfect latte.

"This isn't just coffee. It's proof that the scary thing was worth it."

She turns to camera, extending the cup: "Come be part of our story. First one's on the house."

9:16 vertical, documentary intimacy, emotional authenticity, golden hour cinematography, natural audio with café ambiance. 25-30 seconds.`,
    veo3ValuePrompt: `HOOK: "How to make café-quality coffee at home—from someone who owns a café"

Beautiful Black woman stands in a home kitchen, not her café. Morning light. Real, relatable setting.

"I'm going to save you $5 a day. And honestly?" She smiles. "I probably shouldn't share this."

She shows a basic setup: "You don't need a $500 machine. You need three things."

She holds up a French press: "First: A French press. $20. Forget the drip machine."

Bag of beans: "Second: Whole beans. Grind them right before brewing. Pre-ground coffee starts dying the moment it's ground."

She shows a kettle: "Third: Water that's NOT boiling. 200 degrees. Boiling water burns the beans. That bitter taste? That's the burn."

She demonstrates the process, ASMR quality audio: "Coarse grind. 200 degree water. Four minutes steep. Press slow."

She pours into a mug: "That's it. That's the secret the coffee industry doesn't want you to know."

She takes a sip, satisfied: "Now. When you want something special? A latte art moment? A place to work that isn't your couch?" She smiles warmly. "That's when you come see me."

Final shot: "Save this. Try it tomorrow. Your wallet will thank you."

9:16 vertical, home kitchen setting, tutorial format, genuine helpful energy, ASMR coffee sounds, value-first approach. 25-30 seconds.`,
    veo3AdPrompt10s: `HOOK: "I almost didn't open this door. Five years ago, I almost didn't open it at all."

Woman outside café at pre-dawn, keys in hand. Breath visible.

"Everyone romanticizes it. They don't tell you about the 3am anxiety."

She flips on lights, café transforms warmly.

"This isn't just coffee. It's proof the scary thing was worth it."

9:16 vertical, documentary intimacy, golden hour. 10 seconds.`,
    veo3ValuePrompt10s: `HOOK: "Café-quality coffee at home. From someone who owns a café."

Woman in home kitchen, morning light.

"French press, $20. Whole beans, grind fresh. Water 200 degrees—not boiling."

Quick demo of the process.

"That's it. Save $5 a day. You're welcome."

9:16 vertical, tutorial format, ASMR coffee sounds. 10 seconds.`,
    brollPrompts: [
      "Steaming coffee being poured into ceramic cup, close-up, warm café lighting, slow motion, 9:16 vertical, 3 seconds",
      "Cozy café interior with people chatting, soft focus, plants visible, golden hour light, 9:16 vertical, 3 seconds",
      "Barista hands creating latte art, top-down view, satisfying pour, 9:16 vertical, 3 seconds",
      "Keys unlocking a door at sunrise, hopeful mood, café entrance visible, 9:16 vertical, 2 seconds"
    ],
    duration: '15 sec',
    status: 'draft',
    notes: 'Brand story - emotional founder journey'
  },
  {
    id: '7',
    avatar: 'Café Owner (Woman)',
    scriptName: 'Morning Ritual',
    voiceover: "The best part of my day? 5:47 AM. Before the first customer. When it's just me and the espresso machine. That quiet moment before the magic starts. That's what I want you to feel when you walk in here.",
    wan26Prompt: "Black woman café owner in early morning quiet café. Soft pre-dawn light through windows. Close-up of her hands on espresso machine. Medium shot of peaceful expression, slight smile. Steam rising. Camera slowly reveals empty café behind her. Intimate, meditative energy. Natural movements, no rush. 15 seconds.",
    veo31Prompt: "Café owner alone in quiet coffee shop, early morning. Soft lighting, steam rising. Peaceful contemplative expression. Intimate close-up moments. Meditative energy. 8 seconds.",
    veo3HookPrompt: `8-SECOND HOOK: "5:47 AM. This is my therapy."

ASMR-style opening: Close-up of hands unlocking café door in pre-dawn darkness. The click. The creak.

Beautiful Black woman enters her empty café. Only light is blue pre-dawn glow. She doesn't turn on lights yet.

She whispers to camera: "Everyone asks what I love about owning a café. It's not what you think."

Her hands touch the espresso machine. Steam begins rising.

9:16 vertical, ASMR audio quality, intimate whisper, meditative stillness. 8 seconds exactly.`,
    veo3EduPrompt: `EDUCATIONAL PIECE: "How to Actually Enjoy Your Morning Coffee"

Same café owner, now in educational mode, warm café lighting.

"Most people drink coffee wrong. I'm about to change that."

She sits at a café table: "First: Stop drinking it first thing. Wait 90 minutes after waking. Your cortisol is already high—you don't need caffeine competing with it."

She holds a cup properly: "Second: Temperature matters. Too hot burns your taste buds and your throat. Wait until you can comfortably hold the cup."

She demonstrates smelling the coffee: "Third: Smell before you sip. Your sense of smell is 80% of taste. Take a moment."

She takes a slow sip: "Fourth: No phones. No scrolling. Just... this." She closes her eyes briefly.

She opens her eyes, genuine warmth: "Coffee isn't just fuel. It's a ritual. Treat it like one."

Final shot: "Try this tomorrow morning. One mindful cup. Then tell me how you feel."

9:16 vertical, morning ritual education, ASMR coffee sounds, mindfulness approach. 20-25 seconds.`,
    veo3AdPrompt: `HOOK: "5:47 AM. This is my therapy."

ASMR-style opening: Close-up of hands unlocking a café door in pre-dawn darkness. The click of the lock. The door creaking open. Silence.

Beautiful Black woman enters her empty café. The only light is blue pre-dawn glow through windows. She doesn't turn on the main lights yet. This moment is hers.

She speaks barely above a whisper, directly to camera: "Everyone asks me what I love about owning a café." She smiles softly, moving toward the espresso machine. "It's not what you think."

Close-up: Her hands on the espresso machine. The gentle hiss as it warms. Steam rising in the quiet air.

"It's this. The twenty minutes before anyone else exists." She looks around her space with reverence. "When the world is still sleeping and this place is just... mine."

She pulls her first shot of the day. The sound is almost musical in the silence.

"I want you to feel this when you walk in." She turns to camera, holding the espresso. "Not the chaos outside. Not your to-do list. Just... this."

The lights slowly come on as sunrise begins streaming through windows.

"We open at 7. But this? This is the real magic hour. Come find your quiet."

Final shot: Her taking a sip, eyes closed, complete peace.

9:16 vertical, ASMR audio quality, pre-dawn blue hour cinematography, intimate whisper delivery, meditative pacing. 25-30 seconds.`,
    veo3ValuePrompt: `HOOK: "The one thing that makes or breaks your morning—and it's not coffee"

Calm, peaceful café setting. Beautiful Black woman sits at a corner table, morning light, speaking softly like a friend.

"I've watched thousands of people start their mornings in this café. And I noticed something."

She gestures around her: "The ones who seem happy? Genuinely at peace? It's not about the coffee. It's about the five minutes."

She leans in: "Five minutes where you're not scrolling. Not checking email. Not planning your day. Just... being."

She wraps her hands around a warm mug: "Most people grab their coffee and run. They drink it while driving. While working. While doing three other things."

She shakes her head gently: "That's not a ritual. That's just consumption."

She demonstrates: "Try this tomorrow. Five minutes. Phone face down. Just you and your cup. Notice the warmth. The aroma. Your breathing."

She smiles: "It sounds simple because it is. But most people won't do it. That's what makes it powerful."

Final shot, she raises her cup slightly: "Your morning sets your day. Make the first five minutes intentional."

9:16 vertical, peaceful morning aesthetic, wellness-focused messaging, intimate friend-to-friend energy, immediately applicable. 25-30 seconds.`,
    veo3AdPrompt10s: `HOOK: "5:47 AM. This is my therapy."

ASMR: Hands unlocking café door, pre-dawn darkness. Woman enters empty space.

"The twenty minutes before anyone else exists. When this place is just mine."

She pulls her first shot. Steam rises.

"We open at 7. But this is the magic hour. Come find your quiet."

9:16 vertical, ASMR audio, blue hour cinematography. 10 seconds.`,
    veo3ValuePrompt10s: `HOOK: "What makes or breaks your morning—it's not coffee."

Woman at café table, morning light, speaking softly.

"The ones who seem at peace? It's not the coffee. It's five minutes."

She wraps hands around mug.

"Phone face down. Just you and your cup. That's the ritual."

9:16 vertical, peaceful aesthetic, wellness messaging. 10 seconds.`,
    brollPrompts: [
      "Espresso machine warming up, steam rising, close-up details. Empty café in background. Pre-dawn blue light. 4 seconds.",
      "Hands wiping down counter in meditative motion. Morning preparation ritual. Calm energy. 4 seconds."
    ],
    duration: '15 sec',
    status: 'draft',
    notes: 'Emotional brand story - behind the scenes'
  },

  // ====== CAFÉ OWNER - MAN (Verso Espresso) ======
  {
    id: '8',
    avatar: 'Café Owner (Man)',
    scriptName: 'No Gimmicks',
    voiceover: "We don't do complicated here. Single origin. Perfectly pulled. No syrups, no gimmicks. Just real coffee, made by someone who actually cares. First one's on us—come see what you've been missing.",
    wan26Prompt: "A handsome Mediterranean man with dark stubble stands confidently behind an espresso machine in a warm, amber-lit café. He wears a cream linen shirt over a black tee, arms relaxed on the wooden counter. Steam rises from the machine beside him. Bottles and warm lighting create a sophisticated backdrop. He speaks with quiet intensity about his craft, occasionally gesturing to the machine. His eyes are warm but focused—a man who takes his coffee seriously. 9:16 vertical, 15 seconds, rich warm tones, shallow depth of field, slight slow-motion on the steam.",
    veo31Prompt: "Mediterranean man behind espresso machine, amber lighting. Cream linen shirt, confident stance. Speaks with quiet intensity. Steam rising, sophisticated café backdrop. Warm but focused energy. 8 seconds.",
    veo3HookPrompt: `8-SECOND HOOK: "I'm going to ruin Starbucks for you."

Handsome Mediterranean man behind espresso machine, amber lighting. He looks at camera with a slight confident smirk.

"Here's what they don't want you to know." He pulls a bag of beans. "Single origin. Ethiopian. Roasted four days ago."

He smells them with genuine appreciation. "Not sitting in a warehouse for six months."

9:16 vertical, craft coffee aesthetic, confident reveal, ASMR audio. 8 seconds exactly.`,
    veo3EduPrompt: `EDUCATIONAL PIECE: "How to Pull the Perfect Espresso Shot"

Same barista, now full teaching mode at his machine.

"Most baristas can't do this. I'm about to show you exactly how."

He shows the portafilter: "Eighteen grams. Level tamp. Not too hard—you're compressing, not crushing."

He demonstrates: "The grind matters more than the machine. If it looks like sand, too coarse. If it clumps, too fine."

He locks in the portafilter: "Twenty-five seconds. That's the target. First drops at 8 seconds. Honey-colored stream by 12."

The shot pulls. He narrates: "See that? Dark at first, then lightens to blonde. Stop it right before it goes watery."

He catches it at 25 seconds: "That's the window. Too short—sour. Too long—bitter."

He holds up the perfect shot: "Thirty-six grams out. Two to one ratio. That's the formula."

Final shot: "Now you know what you're tasting. And why most espresso doesn't taste like this."

9:16 vertical, barista education, precise demonstration, craft expertise. 20-25 seconds.`,
    veo3AdPrompt: `HOOK: "I'm going to ruin Starbucks for you. Don't say I didn't warn you."

Handsome Mediterranean man behind a beautiful espresso machine, amber lighting, sophisticated café. He looks at camera with a slight smirk—not arrogant, just confident.

"Alright. Here's what they don't want you to know." He pulls a bag of beans, shows them to camera. "Single origin. Ethiopian. Roasted four days ago." He smells them, genuine appreciation. "Not sitting in a warehouse for six months."

Cut to: His hands grinding the beans. Close-up of the grind. ASMR quality audio.

"You're about to watch something most baristas can't do." He tamps the grounds with precision. "Twenty-five seconds. Eighteen grams in. Thirty-six out. That's the shot."

The espresso pulls. Rich, golden crema forming. Slow-motion beauty shot.

He picks up the cup, holds it toward camera: "No vanilla. No caramel. No fifty-ingredient frappuccino disguised as coffee."

He takes a sip, closes eyes for a moment. Opens them with intensity:

"Just... this." He sets down the cup. "You've been drinking burnt beans and sugar water. And I'm sorry. But now you know."

He gestures to the cup: "First one's free. I need you to understand what you've been missing."

Final shot: He slides the espresso across the counter toward camera.

9:16 vertical, warm amber cinematography, craft coffee aesthetic, confident male energy, ASMR audio on coffee preparation. 25-30 seconds.`,
    veo3ValuePrompt: `HOOK: "Stop making these 3 mistakes with your coffee—a barista's honest guide"

Mediterranean man leans against his espresso bar, speaking directly to camera with friendly authority.

"Look. I don't care where you buy your coffee. But you're probably ruining it at home. Here's how to fix it."

He holds up a coffee bag: "Mistake one: Buying pre-ground. Coffee goes stale in 20 minutes after grinding. Not days. Minutes." He shows a simple hand grinder. "This was $30. Best investment in your kitchen."

He fills a kettle: "Mistake two: Boiling water." He shows a thermometer. "200 degrees. Not 212. You're burning the beans and wondering why it tastes bitter."

He shows a coffee maker: "Mistake three: That thing hasn't been cleaned in months." He shows the inside. "See that buildup? That's in your coffee. Clean it weekly. Vinegar and water. Takes five minutes."

He makes a pour-over as he speaks, the process beautiful: "Fresh ground. Right temperature. Clean equipment. That's 90% of great coffee."

He takes a sip, nods: "The other 10% is good beans. And for that—" He winks. "You know where to find me."

9:16 vertical, educational format, demonstration-style, coffee expertise, accessible home tips. 25-30 seconds.`,
    veo3AdPrompt10s: `HOOK: "I'm going to ruin Starbucks for you."

Man behind espresso machine, confident smirk.

"Single origin. Ethiopian. Roasted four days ago." ASMR: grinding, tamping.

Espresso pulls, golden crema forming.

"You've been drinking burnt beans and sugar water. First one's free."

He slides espresso toward camera.

9:16 vertical, craft coffee aesthetic, ASMR audio. 10 seconds.`,
    veo3ValuePrompt10s: `HOOK: "3 mistakes ruining your coffee."

Barista leaning on espresso bar.

"Pre-ground—stale in 20 minutes. Boiling water—burns the beans. Dirty machine—taste that buildup."

Quick demos of each fix.

"Fresh ground. 200 degrees. Clean weekly. That's 90% of it."

9:16 vertical, educational format, coffee expertise. 10 seconds.`,
    brollPrompts: [
      "Espresso shot pulling from machine, rich crema forming, extreme close-up, warm lighting, slow motion, 9:16 vertical, 3 seconds",
      "Coffee beans falling into grinder hopper, cascading motion, shallow depth of field, 9:16 vertical, 2 seconds",
      "Steam wand frothing milk, satisfying swirl, professional technique, 9:16 vertical, 3 seconds",
      "Hand sliding finished espresso across wooden counter toward camera, inviting gesture, 9:16 vertical, 2 seconds"
    ],
    duration: '15 sec',
    status: 'draft',
    notes: 'Promotional - free offer CTA'
  },
  {
    id: '9',
    avatar: 'Café Owner (Man)',
    scriptName: 'The Perfect Shot',
    voiceover: "Everyone wants the perfect shot. But here's what they don't tell you—it's not about the machine. It's not about the beans. It's about the 15 seconds of patience while it extracts. That's where the magic happens. Most people rush it.",
    wan26Prompt: "Mediterranean café owner at espresso machine, teaching moment. Opens close on his hands working the machine. Pull back to medium shot, he looks at camera with knowing expression. Speaks with passionate intensity. Close-up of espresso extracting. Returns to his face, slight satisfied nod. Warm amber lighting throughout. 15 seconds.",
    veo31Prompt: "Café owner at espresso machine, educational delivery. Hands working equipment, passionate expression. Close-up of extraction. Warm lighting, sophisticated setting. Expert energy. 8 seconds.",
    veo3HookPrompt: `8-SECOND HOOK: "Watch this for 15 seconds. Then tell me I'm wrong."

Close-up: Mediterranean man's hands prepping portafilter with precision. ASMR sounds—grinding, tamping, the click of locking in.

He looks at camera, quiet intensity: "Everyone wants the perfect shot. Most people don't have the patience for it."

He hits the button. Extraction begins.

9:16 vertical, ASMR audio, anticipation build, craft reveal. 8 seconds exactly.`,
    veo3EduPrompt: `EDUCATIONAL PIECE: "The Science of Espresso Extraction"

Same barista at his machine, scientific teaching mode.

"You're about to understand espresso better than most baristas."

He shows the timer: "25 seconds. That's not arbitrary. Here's why."

He pulls a shot as he explains: "First 8 seconds—the acids extract. Bright, fruity notes."

The stream builds: "Seconds 8 to 18—the sugars. This is where the sweetness comes from."

He watches carefully: "Seconds 18 to 25—the balance. Caramel. Chocolate. Complexity."

He stops it precisely: "After 25? The bitter compounds. The burnt taste. The thing that ruins coffee."

He holds up the shot: "Every second matters. That's why temperature matters. Why grind size matters. Why pressure matters."

He takes a sip: "When all the variables align? You get this. And now you know why most espresso falls short."

Final shot: "The difference between good and great? Fifteen seconds of patience and understanding what's actually happening."

9:16 vertical, science-based education, precise timing visual, expert breakdown. 20-25 seconds.`,
    veo3AdPrompt: `HOOK: "Watch this for 15 seconds. That's all I ask. Then tell me I'm wrong."

Close-up: Espresso machine. Mediterranean man's hands prepping the portafilter with surgical precision. No talking yet. Just ASMR sounds—grinding, tamping, the click of the portafilter locking in.

He looks at camera, quiet intensity: "Everyone wants the perfect shot." He hits the button. "Most people don't have the patience for it."

Camera focuses on the extraction. The first drops. The stream building. Golden crema forming. Timer visible in corner: counting toward 25 seconds.

"Right now you want to click away." He's watching the extraction with reverence. "That urge? That's why most espresso is garbage."

At 18 seconds: "This is where amateurs stop." The stream continues. "They see enough liquid and they panic."

At 25 seconds: He stops it. Perfect. The shot sits there, beautiful crema swirling.

He picks up the cup, holds it to camera: "Fifteen seconds of patience. That's the difference between coffee and... this."

He tastes it. Closes eyes. Nods slightly.

Opens eyes to camera: "You either understand or you don't. If you do—" He gestures to the café. "You know where to find me."

Final shot: He slides the espresso toward camera with a knowing look.

9:16 vertical, educational mastery energy, ASMR audio quality, espresso extraction p*rn, warm craft aesthetic. 25-30 seconds.`,
    veo3ValuePrompt: `HOOK: "The coffee order that tells me you actually know what you're doing"

Mediterranean café owner behind his bar, leaning in like he's sharing a secret.

"When someone walks in and orders THIS—" He taps the espresso machine. "I know they know coffee."

He starts making the drink: "Cortado. Not a latte. Not a cappuccino. A cortado."

He pulls a shot, the extraction perfect: "Equal parts espresso and steamed milk. That's it. No foam art. No flavoring. Just coffee."

He pours the milk with precision: "It's the drink that hides nothing. If the espresso isn't good, you'll taste it. If the milk isn't right, you'll taste it."

He slides the small cup across the counter: "Most cafés can't make a proper cortado because their espresso can't stand alone."

He takes a sip of one himself: "Next time you're testing a new café? Order a cortado. If it's good, everything else will be good."

He sets down the cup: "Now you know. You're welcome."

Final shot—warm smile: "Come test ours. I dare you."

9:16 vertical, insider knowledge sharing, coffee education, ASMR preparation sounds, expert flex with value. 25-30 seconds.`,
    veo3AdPrompt10s: `HOOK: "Watch this for 15 seconds. Tell me I'm wrong."

ASMR: Hands prepping portafilter. Grinding, tamping.

Espresso extraction. Timer counting. Golden crema forming.

"That urge to click away? That's why most espresso is garbage."

He holds cup to camera: "Fifteen seconds of patience. That's the difference."

9:16 vertical, ASMR audio, espresso extraction beauty. 10 seconds.`,
    veo3ValuePrompt10s: `HOOK: "The order that tells me you know coffee."

Man behind bar, sharing a secret.

"Cortado. Equal parts espresso and milk. No foam art. No flavoring."

He pours with precision.

"It hides nothing. Order one. If it's good, everything else will be good."

9:16 vertical, insider knowledge, coffee education. 10 seconds.`,
    brollPrompts: [
      "Extreme close-up espresso extraction, timer visible, crema forming. Perfect technique showcase. 5 seconds.",
      "Hands tamping coffee grounds with precision. Professional technique. Shallow depth of field. 3 seconds."
    ],
    duration: '15 sec',
    status: 'draft',
    notes: 'Educational - expertise showcase'
  },

  // ====== FOOD TRUCK OWNER ======
  {
    id: '10',
    avatar: 'Food Truck Owner',
    scriptName: 'Secret Menu Hook',
    voiceover: "POV: You just discovered our secret menu item. Most people walk right past. But YOU? You know. The spicy mango fusion bowl. Only for those who ask. Now you're one of us. Come find us.",
    wan26Prompt: "Latina woman in food truck window, warm golden hour lighting. Opens with excited close-up, eyebrows raised conspiratorially. Leans in closer to camera like sharing a secret. Mid-video: pulls back showing colorful food truck interior, she gestures toward menu. Final shot: knowing smile, slight head tilt, beckoning gesture. Street food festival atmosphere, authentic energy. Lip-synced, 15 seconds.",
    veo31Prompt: "Friendly Latina food truck owner at service window, conspiratorial excited expression. Golden hour lighting, colorful truck background. Leans toward camera sharing secret. Warm authentic energy. 8 seconds.",
    veo3HookPrompt: `8-SECOND HOOK: "POV: You asked what's NOT on the menu."

Camera approaches vibrant food truck at golden hour. String lights twinkling.

Friendly Latina woman leans out, sees camera, face lights up conspiratorially.

"Oh. You know." She leans closer, almost whispering. "You're asking about THAT one."

Quick sizzle sound. Steam rising in background.

9:16 vertical, street food energy, golden hour warmth, insider secret vibe. 8 seconds exactly.`,
    veo3EduPrompt: `EDUCATIONAL PIECE: "How to Order at a Food Truck Like a Local"

Same food truck owner, teaching mode, leaning from window.

"I'm about to save you from looking like a tourist. Here's the playbook."

She counts on fingers: "One: Check what people are CARRYING away. Not what they're ordering. What's actually in their hands."

She gestures to her truck: "Two: Ask 'What's fresh TODAY?' Not 'What's good?' We'll tell you everything's good. Ask what just came out of the kitchen."

She leans closer: "Three: The real secret—" She lowers voice. "Ask what WE eat. The staff meal. That's the move."

She demonstrates building a bowl: "Four: Skip the combo. Build your own. Pick your protein, pick your sauce, say 'extra' on the toppings. We want you to come back."

She holds up a gorgeous bowl: "Five: Time matters. Come between 11 and 12, or after 2. That's when the fresh stuff is being made and it's not crazy busy."

Final shot: "Now you know. Don't just order—ENGAGE. Food trucks love regulars. Be one."

9:16 vertical, street food education, insider tips, friendly expert energy. 20-25 seconds.`,
    veo3AdPrompt: `HOOK: "POV: You asked what's NOT on the menu. Now you're one of us."

Camera approaches a vibrant food truck at golden hour. String lights twinkling. A line of customers waiting. But we bypass the line, walking straight to the window.

Friendly Latina woman leans out, sees camera, her face lights up with conspiratorial excitement.

"Oh. You know." She leans in closer, almost whispering. "You're asking about THAT one."

Quick cuts: Her hands working magic in the kitchen. Sizzling sounds. Steam rising. Colorful ingredients dancing in a pan. Sauce drizzling in slow motion.

Back to her, mischievous energy: "We don't put it on the menu because—" She laughs. "We'd run out every single day. Only for the ones who know to ask."

She plates the dish. It's gorgeous—spicy mango fusion bowl. Vibrant colors. Fresh cilantro. A masterpiece.

She slides it toward camera: "The Spicy Mango. The one that changed everything."

She leans in one more time, conspiratorial: "Tell no one." She winks. "Or tell everyone. I don't care anymore." She laughs, genuine joy.

Final shot: The dish in beautiful glory. Her voice over: "Come find us. Ask for 'the one that's not on the menu.' You're official now."

9:16 vertical, street food festival energy, golden hour warmth, authentic food sounds, joyful conspiracy vibe. 25-30 seconds.`,
    veo3ValuePrompt: `HOOK: "How to order at a food truck like a local—not a tourist"

Friendly Latina food truck owner leans out of her window, speaking directly to camera like she's helping a friend.

"You're about to save time, money, and embarrassment. Here's how to order at ANY food truck like you've been doing it for years."

She counts on her fingers: "One: Check the line. If it's long, they're doing something right. But also—" She gestures. "Check what people are walking away with. That's the move."

"Two: Ask what's fresh TODAY. Not what's popular. What did they just make? That's the good stuff."

She leans out further: "Three: Skip the combo. Build your own. Pick a protein, pick a sauce, ask for 'extra' on whatever looks good. We'll hook you up."

She demonstrates, pointing at ingredients: "Four: The real hack—" She lowers her voice. "Ask what THEY eat. Seriously. We don't eat the tourist stuff."

She holds up a bowl she made herself: "This? Not on the menu. It's what I eat after a long day. You want this."

Final shot, warm smile: "Now you know. Stop being shy. We love when people ask questions. That's how you get the good stuff."

9:16 vertical, street food education, friendly insider tips, vibrant food truck atmosphere, immediately applicable advice. 25-30 seconds.`,
    veo3AdPrompt10s: `HOOK: "POV: You asked what's NOT on the menu."

Woman at food truck window, face lights up conspiratorially.

"Oh. You know." Quick cuts: sizzling pan, sauce drizzling, steam rising.

She slides gorgeous bowl toward camera: "The Spicy Mango. Only for the ones who ask."

Winks: "You're official now."

9:16 vertical, golden hour, food sounds. 10 seconds.`,
    veo3ValuePrompt10s: `HOOK: "Order at any food truck like a local."

Woman leaning from truck window.

"Check what people walk away with. Ask what's fresh TODAY. Ask what THEY eat."

She holds up her personal bowl: "This? Not on the menu. It's what I eat."

"Stop being shy. That's how you get the good stuff."

9:16 vertical, street food tips, friendly energy. 10 seconds.`,
    brollPrompts: [
      "Close-up food preparation shots. Colorful ingredients being tossed in pan. Sauce drizzling. Steam rising. Hands assembling bowl. Fresh cilantro garnish. Vibrant colors, appetizing angles. 5-8 seconds.",
      "Food truck exterior establishing shot. String lights, customers waiting, urban setting. Pan across menu board. Evening street food market atmosphere. 5-8 seconds."
    ],
    duration: '15 sec',
    status: 'draft',
    notes: 'POV style, conspiratorial energy'
  }
]

export default function UGCPromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filterAvatar, setFilterAvatar] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPrompt, setNewPrompt] = useState<Partial<Prompt>>({
    avatar: '',
    scriptName: '',
    voiceover: '',
    wan26Prompt: '',
    veo31Prompt: '',
    veo3HookPrompt: '',
    veo3EduPrompt: '',
    veo3AdPrompt: '',
    veo3AdPrompt10s: '',
    veo3ValuePrompt: '',
    veo3ValuePrompt10s: '',
    brollPrompts: [''],
    duration: '15 sec',
    status: 'draft',
    notes: ''
  })

  const avatars = Array.from(new Set(prompts.map(p => p.avatar)))

  const filteredPrompts = prompts.filter(p => {
    if (filterAvatar !== 'all' && p.avatar !== filterAvatar) return false
    if (filterStatus !== 'all' && p.status !== filterStatus) return false
    return true
  })

  const copyToClipboard = async (text: string, id: string, type: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(`${id}-${type}`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const updatePromptStatus = (id: string, status: Prompt['status']) => {
    setPrompts(prompts.map(p => p.id === id ? { ...p, status } : p))
  }

  const deletePrompt = (id: string) => {
    if (confirm('Delete this prompt?')) {
      setPrompts(prompts.filter(p => p.id !== id))
    }
  }

  const addNewPrompt = () => {
    if (!newPrompt.avatar || !newPrompt.scriptName) return
    const prompt: Prompt = {
      id: Date.now().toString(),
      avatar: newPrompt.avatar || '',
      scriptName: newPrompt.scriptName || '',
      voiceover: newPrompt.voiceover || '',
      wan26Prompt: newPrompt.wan26Prompt || '',
      veo31Prompt: newPrompt.veo31Prompt || '',
      veo3HookPrompt: newPrompt.veo3HookPrompt || '',
      veo3EduPrompt: newPrompt.veo3EduPrompt || '',
      veo3AdPrompt: newPrompt.veo3AdPrompt || '',
      veo3AdPrompt10s: newPrompt.veo3AdPrompt10s || '',
      veo3ValuePrompt: newPrompt.veo3ValuePrompt || '',
      veo3ValuePrompt10s: newPrompt.veo3ValuePrompt10s || '',
      brollPrompts: newPrompt.brollPrompts?.filter(b => b.trim()) || [],
      duration: newPrompt.duration || '15 sec',
      status: 'draft',
      notes: newPrompt.notes || ''
    }
    setPrompts([...prompts, prompt])
    setNewPrompt({
      avatar: '',
      scriptName: '',
      voiceover: '',
      wan26Prompt: '',
      veo31Prompt: '',
      veo3HookPrompt: '',
      veo3EduPrompt: '',
      veo3AdPrompt: '',
      veo3AdPrompt10s: '',
      veo3ValuePrompt: '',
      veo3ValuePrompt10s: '',
      brollPrompts: [''],
      duration: '15 sec',
      status: 'draft',
      notes: ''
    })
    setShowAddForm(false)
  }

  const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    tested: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">UGC Prompt Manager</h1>
          <p className="text-gray-600 mt-1">Manage Wan 2.6 & Veo 3.1 prompts for UGC viral clips</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Prompt
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
          <select
            value={filterAvatar}
            onChange={(e) => setFilterAvatar(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Avatars</option>
            {avatars.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="tested">Tested</option>
            <option value="approved">Approved</option>
          </select>
        </div>
        <div className="flex items-end">
          <span className="text-sm text-gray-500">{filteredPrompts.length} prompts</span>
        </div>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Add New Prompt</h2>
              <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
                  <input
                    type="text"
                    value={newPrompt.avatar}
                    onChange={(e) => setNewPrompt({ ...newPrompt, avatar: e.target.value })}
                    placeholder="e.g., Fitness Studio Owner"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Script Name</label>
                  <input
                    type="text"
                    value={newPrompt.scriptName}
                    onChange={(e) => setNewPrompt({ ...newPrompt, scriptName: e.target.value })}
                    placeholder="e.g., 30 Minute Truth"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Voiceover Script</label>
                <textarea
                  value={newPrompt.voiceover}
                  onChange={(e) => setNewPrompt({ ...newPrompt, voiceover: e.target.value })}
                  rows={3}
                  placeholder="The voiceover script..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-purple-600" />
                    Wan 2.6 I2V Prompt (15 sec multi-scene)
                  </span>
                </label>
                <textarea
                  value={newPrompt.wan26Prompt}
                  onChange={(e) => setNewPrompt({ ...newPrompt, wan26Prompt: e.target.value })}
                  rows={4}
                  placeholder="Detailed multi-scene prompt for Wan 2.6..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Veo 3.1 Prompt (8 sec)
                  </span>
                </label>
                <textarea
                  value={newPrompt.veo31Prompt}
                  onChange={(e) => setNewPrompt({ ...newPrompt, veo31Prompt: e.target.value })}
                  rows={3}
                  placeholder="Shorter prompt optimized for Veo 3.1..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-orange-600" />
                    B-Roll Prompts (T2V)
                  </span>
                </label>
                {newPrompt.brollPrompts?.map((broll, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <textarea
                      value={broll}
                      onChange={(e) => {
                        const updated = [...(newPrompt.brollPrompts || [])]
                        updated[idx] = e.target.value
                        setNewPrompt({ ...newPrompt, brollPrompts: updated })
                      }}
                      rows={2}
                      placeholder={`B-roll prompt ${idx + 1}...`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => {
                        const updated = newPrompt.brollPrompts?.filter((_, i) => i !== idx)
                        setNewPrompt({ ...newPrompt, brollPrompts: updated })
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setNewPrompt({ ...newPrompt, brollPrompts: [...(newPrompt.brollPrompts || []), ''] })}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add B-Roll Prompt
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <input
                  type="text"
                  value={newPrompt.notes}
                  onChange={(e) => setNewPrompt({ ...newPrompt, notes: e.target.value })}
                  placeholder="Any notes about this prompt..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addNewPrompt}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Prompt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prompts List */}
      <div className="space-y-6">
        {filteredPrompts.map((prompt) => (
          <div key={prompt.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-purple-200 text-sm">{prompt.avatar}</span>
                  <h3 className="text-xl font-bold">{prompt.scriptName}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[prompt.status]}`}>
                    {prompt.status.toUpperCase()}
                  </span>
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full">{prompt.duration}</span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* SECTION 1: Script & Voiceover */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <span className="text-lg">📝</span>
                  <h3 className="text-lg font-bold text-gray-800">Script & Voiceover</h3>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      🎙️ Voiceover Script
                    </h4>
                    <button
                      onClick={() => copyToClipboard(prompt.voiceover, prompt.id, 'voiceover')}
                      className="text-gray-500 hover:text-blue-600 p-1"
                    >
                      {copiedId === `${prompt.id}-voiceover` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm">{prompt.voiceover}</p>
                </div>
              </div>

              {/* SECTION 2: Quick Generation Prompts */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <span className="text-lg">⚡</span>
                  <h3 className="text-lg font-bold text-gray-800">Quick Generation Prompts</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Short clips for testing</span>
                </div>

                {/* Wan 2.6 Prompt */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Film className="w-4 h-4 text-purple-600" />
                      Wan 2.6 I2V Prompt
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">15 sec</span>
                    </h4>
                    <button
                      onClick={() => copyToClipboard(prompt.wan26Prompt, prompt.id, 'wan26')}
                      className="text-gray-500 hover:text-blue-600 p-1"
                    >
                      {copiedId === `${prompt.id}-wan26` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-gray-700 bg-purple-50 p-3 rounded-lg text-sm border border-purple-100">
                    {prompt.wan26Prompt}
                  </p>
                </div>

                {/* Veo 3.1 Prompt */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      Veo 3.1 Prompt
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">8 sec</span>
                    </h4>
                    <button
                      onClick={() => copyToClipboard(prompt.veo31Prompt, prompt.id, 'veo31')}
                      className="text-gray-500 hover:text-blue-600 p-1"
                    >
                      {copiedId === `${prompt.id}-veo31` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-gray-700 bg-blue-50 p-3 rounded-lg text-sm border border-blue-100">
                    {prompt.veo31Prompt}
                  </p>
                </div>

                {/* B-Roll Prompts */}
                {prompt.brollPrompts.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                      <Video className="w-4 h-4 text-orange-600" />
                      B-Roll Prompts (T2V)
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">5-8 sec each</span>
                    </h4>
                    <div className="space-y-2">
                      {prompt.brollPrompts.map((broll, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <p className="flex-1 text-gray-700 bg-orange-50 p-3 rounded-lg text-sm border border-orange-100">
                            {broll}
                          </p>
                          <button
                            onClick={() => copyToClipboard(broll, prompt.id, `broll-${idx}`)}
                            className="text-gray-500 hover:text-blue-600 p-1 mt-2"
                          >
                            {copiedId === `${prompt.id}-broll-${idx}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 3: Full Production Prompts */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <span className="text-lg">🎬</span>
                  <h3 className="text-lg font-bold text-gray-800">Full Production Prompts</h3>
                  <span className="text-xs bg-gradient-to-r from-pink-500 to-orange-500 text-white px-2 py-0.5 rounded-full">Veo 3 Ready</span>
                </div>

                {/* 8-Second Hook */}
                {prompt.veo3HookPrompt && (
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-xl opacity-20"></div>
                    <div className="relative bg-white rounded-lg border-2 border-amber-200">
                      <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-lg">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-amber-600" />
                          <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                            8-Second Hook
                          </span>
                          <span className="text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-full font-medium">
                            8 sec
                          </span>
                        </h4>
                        <button
                          onClick={() => copyToClipboard(prompt.veo3HookPrompt, prompt.id, 'veo3hook')}
                          className="text-gray-500 hover:text-amber-600 p-1 transition-colors"
                        >
                          {copiedId === `${prompt.id}-veo3hook` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="p-4">
                        <pre className="text-gray-700 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                          {prompt.veo3HookPrompt}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {/* Educational Piece */}
                {prompt.veo3EduPrompt && (
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-xl opacity-20"></div>
                    <div className="relative bg-white rounded-lg border-2 border-indigo-200">
                      <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                          <Lightbulb className="w-5 h-5 text-indigo-600" />
                          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Educational Piece
                          </span>
                          <span className="text-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2 py-0.5 rounded-full font-medium">
                            20-25 sec
                          </span>
                        </h4>
                        <button
                          onClick={() => copyToClipboard(prompt.veo3EduPrompt, prompt.id, 'veo3edu')}
                          className="text-gray-500 hover:text-indigo-600 p-1 transition-colors"
                        >
                          {copiedId === `${prompt.id}-veo3edu` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="p-4">
                        <pre className="text-gray-700 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                          {prompt.veo3EduPrompt}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {/* Veo 3 Ad Prompt - Engagement Hook */}
                {prompt.veo3AdPrompt && (
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 rounded-xl opacity-20"></div>
                    <div className="relative bg-white rounded-lg border-2 border-pink-200">
                      <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gradient-to-r from-pink-50 to-orange-50 rounded-t-lg">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                          <Megaphone className="w-5 h-5 text-pink-600" />
                          <span className="bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                            Engagement Hook Ad
                          </span>
                          <span className="text-xs bg-gradient-to-r from-pink-500 to-orange-500 text-white px-2 py-0.5 rounded-full font-medium">
                            25-30 sec
                          </span>
                        </h4>
                        <button
                          onClick={() => copyToClipboard(prompt.veo3AdPrompt, prompt.id, 'veo3ad')}
                          className="text-gray-500 hover:text-pink-600 p-1 transition-colors"
                        >
                          {copiedId === `${prompt.id}-veo3ad` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="p-4">
                        <pre className="text-gray-700 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                          {prompt.veo3AdPrompt}
                        </pre>
                      </div>
                      {/* 10s Version */}
                      {prompt.veo3AdPrompt10s && (
                        <div className="border-t border-pink-100 bg-pink-50/50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
                              <Zap className="w-4 h-4 text-pink-500" />
                              <span>10s Quick Ad Version</span>
                              <span className="text-xs bg-pink-200 text-pink-700 px-2 py-0.5 rounded-full">10 sec</span>
                            </h5>
                            <button
                              onClick={() => copyToClipboard(prompt.veo3AdPrompt10s, prompt.id, 'veo3ad10s')}
                              className="text-gray-500 hover:text-pink-600 p-1 transition-colors"
                            >
                              {copiedId === `${prompt.id}-veo3ad10s` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                          <pre className="text-gray-600 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                            {prompt.veo3AdPrompt10s}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Veo 3 Value Prompt - Free Value Hook */}
                {prompt.veo3ValuePrompt && (
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-xl opacity-20"></div>
                    <div className="relative bg-white rounded-lg border-2 border-emerald-200">
                      <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-t-lg">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                          <Gift className="w-5 h-5 text-emerald-600" />
                          <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                            Free Value Hook
                          </span>
                          <span className="text-xs bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-2 py-0.5 rounded-full font-medium">
                            25-30 sec
                          </span>
                        </h4>
                        <button
                          onClick={() => copyToClipboard(prompt.veo3ValuePrompt, prompt.id, 'veo3value')}
                          className="text-gray-500 hover:text-emerald-600 p-1 transition-colors"
                        >
                          {copiedId === `${prompt.id}-veo3value` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="p-4">
                        <pre className="text-gray-700 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                          {prompt.veo3ValuePrompt}
                        </pre>
                      </div>
                      {/* 10s Version */}
                      {prompt.veo3ValuePrompt10s && (
                        <div className="border-t border-emerald-100 bg-emerald-50/50 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
                              <Zap className="w-4 h-4 text-emerald-500" />
                              <span>10s Quick Ad Version</span>
                              <span className="text-xs bg-emerald-200 text-emerald-700 px-2 py-0.5 rounded-full">10 sec</span>
                            </h5>
                            <button
                              onClick={() => copyToClipboard(prompt.veo3ValuePrompt10s, prompt.id, 'veo3value10s')}
                              className="text-gray-500 hover:text-emerald-600 p-1 transition-colors"
                            >
                              {copiedId === `${prompt.id}-veo3value10s` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                          <pre className="text-gray-600 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                            {prompt.veo3ValuePrompt10s}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              {prompt.notes && (
                <div className="text-sm text-gray-500 italic">
                  📝 {prompt.notes}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => updatePromptStatus(prompt.id, 'draft')}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      prompt.status === 'draft' ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    Draft
                  </button>
                  <button
                    onClick={() => updatePromptStatus(prompt.id, 'tested')}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      prompt.status === 'tested' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-100 text-gray-500 hover:bg-yellow-100'
                    }`}
                  >
                    Tested
                  </button>
                  <button
                    onClick={() => updatePromptStatus(prompt.id, 'approved')}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      prompt.status === 'approved' ? 'bg-green-200 text-green-800' : 'bg-gray-100 text-gray-500 hover:bg-green-100'
                    }`}
                  >
                    Approved
                  </button>
                </div>
                <button
                  onClick={() => deletePrompt(prompt.id)}
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Film className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No prompts found. Add your first prompt to get started!</p>
        </div>
      )}
    </div>
  )
}
