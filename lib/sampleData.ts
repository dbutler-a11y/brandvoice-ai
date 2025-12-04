// Sample data for the public portfolio/showcase page
// This file contains example deliverables to show potential clients what they'll receive

export interface Script {
  id: number
  type: 'FAQ' | 'Service' | 'Promo' | 'Testimonial' | 'Tip' | 'Brand'
  title: string
  content: string
  wordCount: number
  duration: string
  color: string
}

export interface Email {
  day: number
  subject: string
  preview: string
  body: string
}

export interface FacebookAd {
  id: number
  type: string
  headline: string
  primaryText: string
  description: string
  cta: string
  headlineCount: number
  primaryCount: number
  descriptionCount: number
}

export const SAMPLE_SCRIPTS: Script[] = [
  {
    id: 1,
    type: 'FAQ',
    title: 'What Makes Our Med Spa Different?',
    content: `Hey there! If you're wondering what makes our med spa stand out from the rest, let me tell you.

First, we only use FDA-approved treatments and the latest technology. No cutting corners here.

Second, our team isn't just certified – they're passionate about helping you look and feel amazing. We spend time understanding YOUR goals, not just pushing products.

And third? We actually care about results. That's why we offer free consultations and create custom treatment plans just for you.

Ready to see the difference for yourself? Book your free consultation today. Link in bio!`,
    wordCount: 98,
    duration: '35-40 seconds',
    color: 'blue'
  },
  {
    id: 2,
    type: 'Service',
    title: 'Discover Our Signature Hydrafacial',
    content: `Want glowing, radiant skin in just 30 minutes? Let me introduce you to our signature HydraFacial treatment.

This isn't your average facial. The HydraFacial uses patented technology to cleanse, extract, and hydrate your skin all at once. It's like a power wash for your face – but way more relaxing!

The best part? Zero downtime. You can literally get a HydraFacial on your lunch break and go back to work glowing.

Perfect for all skin types, whether you're dealing with fine lines, uneven texture, or just want that red-carpet glow.

First-time clients get 20% off this month. Don't miss out – book now!`,
    wordCount: 112,
    duration: '40-45 seconds',
    color: 'blue'
  },
  {
    id: 3,
    type: 'Promo',
    title: 'Holiday Special: Buy 2 Get 1 Free',
    content: `Okay, this is HUGE. For the next 48 hours only, we're running our biggest sale of the year!

Buy any 2 treatments and get a third one completely FREE. Yes, you heard that right.

Want Botox, filler, AND a HydraFacial? Done. Laser hair removal sessions? Stack 'em up. The choice is yours.

This is the perfect time to stock up on your favorite treatments or finally try something new you've been curious about.

But remember – this ends in 48 hours. Once it's gone, it's gone.

Click the link in bio to book your appointment now. Trust me, you don't want to miss this!`,
    wordCount: 108,
    duration: '40 seconds',
    color: 'purple'
  },
  {
    id: 4,
    type: 'Testimonial',
    title: 'Real Results: Sarah\'s Transformation',
    content: `I want to share something special with you today. This is Sarah – and she came to us six months ago feeling self-conscious about her skin.

After trying everything over the counter with no luck, she was ready to give up. But then she tried our custom skincare program.

Fast forward to today – her skin is glowing, her confidence is through the roof, and she literally can't stop smiling.

Here's what Sarah said: "I finally feel like myself again. The team didn't just treat my skin – they changed my life."

And that's exactly why we do what we do.

If you're ready for your own transformation, book a free consultation. Your glow-up is waiting!`,
    wordCount: 121,
    duration: '45 seconds',
    color: 'green'
  },
  {
    id: 5,
    type: 'Tip',
    title: 'Skincare Mistake You\'re Probably Making',
    content: `Quick question: Are you washing your face with hot water?

If yes, STOP. I know it feels amazing, but hot water is actually stripping your skin of its natural oils. This leads to dryness, irritation, and even more oil production.

Here's what to do instead: Use lukewarm water to cleanse, then finish with a splash of cold water to close your pores.

It's a small change that makes a massive difference.

Want more skincare tips like this? Follow for weekly advice from our expert estheticians.

And if you're dealing with stubborn skin issues, book a free consultation. We'll create a custom plan just for you!`,
    wordCount: 110,
    duration: '40 seconds',
    color: 'yellow'
  },
  {
    id: 6,
    type: 'Brand',
    title: 'Why We Started This Med Spa',
    content: `Let me tell you why we do what we do.

Five years ago, I was sitting in a consultation room at another med spa, and the person across from me didn't ask a single question about MY goals. They just wanted to sell me packages.

I walked out feeling like a number, not a person. And I promised myself that if I ever opened my own practice, it would be different.

Today, every single client who walks through our doors gets heard, understood, and treated like family.

Because you deserve more than cookie-cutter treatments. You deserve results that are as unique as you are.

That's our promise. That's our mission.

Ready to experience the difference? Book your free consultation today.`,
    wordCount: 127,
    duration: '45-50 seconds',
    color: 'indigo'
  }
]

export const SAMPLE_EMAILS: Email[] = [
  {
    day: 1,
    subject: 'Quick question about your skincare goals...',
    preview: 'Hey {{FirstName}}, I noticed you downloaded our free skincare guide...',
    body: `Hey {{FirstName}},

I noticed you downloaded our free skincare guide last week – awesome!

I'm reaching out because I'm curious: what's your #1 skincare goal right now?

Is it:
- Reducing fine lines and wrinkles?
- Getting rid of stubborn acne or scarring?
- Achieving that healthy, natural glow?
- Something else entirely?

Hit reply and let me know. I'd love to point you in the right direction.

And if you're ready to take the next step, we're offering FREE consultations this week (normally $150). Just book using the link below.

[Book Free Consultation]

Talk soon,
[Your Name]
[Med Spa Name]

P.S. No pressure – but these free consultation spots fill up fast. Grab yours while you can!`
  },
  {
    day: 3,
    subject: 'The #1 treatment our clients rave about',
    preview: 'It\'s not what you think...',
    body: `Hey {{FirstName}},

Quick question: If you could fix ONE thing about your skin in the next 30 days, what would it be?

Here's why I'm asking...

The #1 treatment our clients rave about isn't some expensive laser procedure or injectable. It's our Custom HydraFacial.

Why? Because it works for EVERYONE. Acne, aging, dryness, dullness – you name it.

Plus, there's zero downtime. You literally walk out glowing.

Right now, we're running a first-timer special: Get your first HydraFacial for just $99 (normally $199).

Want in?

[Claim Your $99 HydraFacial]

Only 8 spots left this month!

Cheers,
[Your Name]

P.S. Still not sure? Check out these before & after photos: [link]`
  },
  {
    day: 5,
    subject: 'This might be why your skin isn\'t improving...',
    preview: 'Most people make this mistake',
    body: `Hey {{FirstName}},

Can I be honest with you for a second?

Most people who struggle with their skin aren't using the wrong products.

They're using the wrong APPROACH.

Here's what I mean:

Everyone's skin is different. What works for your friend might not work for you. That's why drugstore "one size fits all" solutions rarely deliver results.

At [Med Spa Name], we don't believe in cookie-cutter treatments.

We analyze YOUR skin, understand YOUR goals, and create a custom plan that actually works for YOU.

That's the difference between wasting money on products that don't work... and finally seeing real results.

Want to see what a custom approach could do for your skin?

Book your free skin analysis today (no obligation, no pressure):

[Book Free Analysis]

You deserve better than guesswork.

[Your Name]`
  },
  {
    day: 7,
    subject: 'Last chance: Free consultation ends tonight',
    preview: 'Don\'t miss out on this, {{FirstName}}',
    body: `Hey {{FirstName}},

Just a quick heads up – our free consultation offer ends TONIGHT at midnight.

After that, we're going back to our regular $150 fee.

If you've been thinking about:
- Finally getting clear, glowing skin
- Reducing fine lines or wrinkles
- Treating stubborn acne or scarring
- Or just feeling more confident in your own skin

Now's the time to act.

[Book Your Free Consultation - Today Only]

During your consultation, we'll:
- Analyze your skin and identify what's holding you back
- Answer all your questions (no judgment, ever)
- Create a custom treatment plan designed just for you
- Show you real before & after results from clients like you

Zero pressure. Just honest advice and a clear path forward.

Sound good?

Grab your spot before midnight:

[Yes, I Want My Free Consultation]

Talk soon,
[Your Name]

P.S. Seriously, these spots are going fast. Don't miss out!`
  },
  {
    day: 10,
    subject: 'Should I keep sending you these emails?',
    preview: 'I want to make sure I\'m not bothering you...',
    body: `Hey {{FirstName}},

I've sent you a few emails about our med spa treatments, and I haven't heard back.

That's totally okay – but I want to make sure I'm not clogging up your inbox if you're not interested.

So here's the deal:

If you want to keep hearing from me (skincare tips, special offers, treatment info), you don't have to do anything. You'll stay on the list.

If you're not interested right now, just hit unsubscribe below. No hard feelings!

But before you go, I want to leave you with this:

If you're struggling with your skin, you're not alone. And you don't have to figure it out by yourself.

We're here whenever you're ready.

[Book a Free Consultation]

Or, if you just want to learn more first, check out our free resources:
- [Free Skincare Guide]
- [Before & After Gallery]
- [Treatment FAQ]

Either way, I wish you the best on your skincare journey.

Take care,
[Your Name]
[Med Spa Name]`
  }
]

export const SAMPLE_ADS: FacebookAd[] = [
  {
    id: 1,
    type: 'Lead Gen',
    headline: 'Get Glowing Skin in 30 Minutes',
    primaryText: 'Struggling with dull, tired skin? Our signature HydraFacial treatment cleanses, extracts, and hydrates – all in one relaxing 30-minute session. Perfect for all skin types, zero downtime. First-time clients get 20% off this month! Book your appointment now and see the difference.',
    description: 'FDA-approved treatments. Expert estheticians. Real results.',
    cta: 'Book Now',
    headlineCount: 32,
    primaryCount: 278,
    descriptionCount: 61
  },
  {
    id: 2,
    type: 'Awareness',
    headline: 'Your Skin Deserves Better Than Drugstore Solutions',
    primaryText: 'Ever wonder why your skincare routine isn\'t working? One-size-fits-all products can\'t address YOUR unique skin concerns. At [Med Spa Name], we analyze your skin and create custom treatment plans that actually deliver results. No guesswork. No wasted money. Just clear, healthy, glowing skin.',
    description: 'Custom skincare solutions for every skin type and concern.',
    cta: 'Learn More',
    headlineCount: 54,
    primaryCount: 307,
    descriptionCount: 60
  },
  {
    id: 3,
    type: 'Offer',
    headline: '48-Hour Flash Sale: Buy 2 Treatments, Get 1 FREE',
    primaryText: 'Our biggest sale of the year is HERE! For the next 48 hours only, buy any 2 treatments and get a 3rd completely free. Botox, fillers, HydraFacials, laser treatments – your choice! This is your chance to stock up on favorites or try something new. Don\'t wait – sale ends in 48 hours!',
    description: 'Limited time only. Premium treatments at unbeatable prices.',
    cta: 'Claim Offer',
    headlineCount: 54,
    primaryCount: 301,
    descriptionCount: 63
  },
  {
    id: 4,
    type: 'Retargeting',
    headline: 'Still Thinking About That Free Consultation?',
    primaryText: 'We noticed you checked out our website – welcome! We\'re still holding your spot for a FREE consultation (normally $150). During your visit, we\'ll analyze your skin, answer your questions, and create a custom treatment plan just for you. Zero pressure, just expert advice. Ready to take the next step?',
    description: 'Free consultation. Custom solutions. Real results you can see.',
    cta: 'Book Free Consultation',
    headlineCount: 49,
    primaryCount: 310,
    descriptionCount: 62
  },
  {
    id: 5,
    type: 'Social Proof',
    headline: 'See Why 500+ Clients Trust Us With Their Skin',
    primaryText: '"I finally feel confident without makeup!" - Sarah M. "My skin has never looked better!" - Jennifer L. "The team actually listened to my concerns." - Amanda K. Real clients. Real results. Real confidence. Join hundreds of happy clients who transformed their skin with our custom treatment plans.',
    description: '5-star rated med spa. Expert care. Proven results.',
    cta: 'See Before & After',
    headlineCount: 52,
    primaryCount: 296,
    descriptionCount: 50
  }
]
