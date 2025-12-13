import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedBlog() {
  console.log('Seeding blog data...');

  // Create categories
  const categories = await Promise.all([
    prisma.blogCategory.upsert({
      where: { slug: 'ai-video-marketing' },
      update: {},
      create: {
        name: 'AI Video Marketing',
        slug: 'ai-video-marketing',
        description: 'Tips and strategies for using AI in video marketing',
        color: '#8B5CF6',
      },
    }),
    prisma.blogCategory.upsert({
      where: { slug: 'content-strategy' },
      update: {},
      create: {
        name: 'Content Strategy',
        slug: 'content-strategy',
        description: 'Content planning and strategy for businesses',
        color: '#3B82F6',
      },
    }),
    prisma.blogCategory.upsert({
      where: { slug: 'social-media' },
      update: {},
      create: {
        name: 'Social Media',
        slug: 'social-media',
        description: 'Social media marketing tips and trends',
        color: '#EC4899',
      },
    }),
  ]);

  console.log('Created categories:', categories.map(c => c.name));

  // Create author
  const author = await prisma.blogAuthor.upsert({
    where: { slug: 'brandvoice-team' },
    update: {},
    create: {
      name: 'BrandVoice Team',
      slug: 'brandvoice-team',
      email: 'team@brandvoice.studio',
      bio: 'The BrandVoice.AI team specializes in AI-powered video content creation, helping businesses create engaging spokesperson videos without appearing on camera.',
      title: 'Content Team',
      company: 'BrandVoice.AI',
    },
  });

  console.log('Created author:', author.name);

  // Create 3 blog posts
  const posts = [
    {
      slug: 'why-ai-spokespersons-are-the-future-of-video-marketing',
      title: 'Why AI Spokespersons Are the Future of Video Marketing',
      metaTitle: 'AI Spokespersons: The Future of Video Marketing | BrandVoice.AI',
      metaDescription: 'Discover how AI spokespersons are revolutionizing video marketing. Learn why businesses are switching to AI-powered video content for consistent, scalable marketing.',
      excerpt: 'Video marketing is essential, but creating consistent content is hard. AI spokespersons solve this by delivering professional videos without the hassle of filming.',
      content: `
<h2>The Video Marketing Challenge</h2>
<p>Every business owner knows the importance of video content. Short-form videos dominate social media, with platforms like TikTok, Instagram Reels, and YouTube Shorts driving massive engagement. But here's the problem: creating consistent video content is exhausting, time-consuming, and often expensive.</p>

<p>Most business owners face these challenges:</p>
<ul>
  <li><strong>Camera shyness:</strong> Not everyone is comfortable on camera</li>
  <li><strong>Time constraints:</strong> Filming takes hours of preparation and execution</li>
  <li><strong>Consistency issues:</strong> Maintaining a regular posting schedule is nearly impossible</li>
  <li><strong>Production costs:</strong> Professional video production can cost thousands per video</li>
</ul>

<h2>Enter AI Spokespersons</h2>
<p>AI spokesperson technology has matured dramatically. Today's AI avatars are hyper-realistic, with natural facial movements, expressions, and lip-sync that most viewers can't distinguish from real humans. This technology is transforming how businesses approach video marketing.</p>

<h3>Key Benefits of AI Spokespersons</h3>
<p><strong>1. Consistency Without Effort</strong></p>
<p>An AI spokesperson delivers the same quality and energy in video #100 as in video #1. No bad hair days, no forgetting lines, no scheduling conflicts.</p>

<p><strong>2. Scale Your Content Production</strong></p>
<p>Need 30 videos for the month? An AI spokesperson can produce them in days, not months. This scalability is impossible with traditional video production.</p>

<p><strong>3. Never Appear on Camera Again</strong></p>
<p>For camera-shy business owners, AI spokespersons are a game-changer. Your brand gets a professional face without you having to be that face.</p>

<p><strong>4. Cost-Effective at Scale</strong></p>
<p>While the initial investment covers spokesperson creation, the per-video cost drops dramatically when producing content at scale. Compare this to hiring actors, renting studios, and paying editors for each video.</p>

<h2>Real Results from Real Businesses</h2>
<p>Businesses using AI spokespersons report:</p>
<ul>
  <li>3-5x increase in content output</li>
  <li>40% reduction in content creation costs</li>
  <li>Consistent posting schedules maintained for months</li>
  <li>Higher engagement rates due to professional, polished content</li>
</ul>

<h2>Is AI Video Right for Your Business?</h2>
<p>AI spokesperson videos work exceptionally well for:</p>
<ul>
  <li>Service-based businesses (med spas, real estate, coaching)</li>
  <li>Educational content and FAQs</li>
  <li>Product explanations and demonstrations</li>
  <li>Social media marketing and advertising</li>
</ul>

<p>The technology isn't meant to replace human connection entirely—it's meant to handle the heavy lifting of consistent content creation so you can focus on running your business.</p>

<h2>Getting Started</h2>
<p>The best way to understand AI spokesperson videos is to see them in action. At BrandVoice.AI, we create custom AI spokespersons and produce 30 days of content in just 7 days. Book a call to see examples and discuss how AI video can transform your marketing.</p>
`,
      categoryId: categories[0].id,
      authorId: author.id,
      tags: ['AI Video', 'Marketing', 'Content Creation', 'Business Growth'],
      featuredImage: '/images/blog/ai-spokesperson-future.jpg',
      featuredImageAlt: 'AI spokesperson representing the future of video marketing',
    },
    {
      slug: '30-video-content-ideas-for-service-businesses',
      title: '30 Video Content Ideas for Service-Based Businesses',
      metaTitle: '30 Video Content Ideas for Service Businesses | BrandVoice.AI',
      metaDescription: 'Struggling with video content ideas? Here are 30 proven video topics for med spas, real estate agents, coaches, and other service-based businesses.',
      excerpt: 'Running out of video content ideas? Here are 30 proven topics that work for med spas, real estate agents, coaches, and other service-based businesses.',
      content: `
<h2>Your Content Calendar, Solved</h2>
<p>One of the biggest challenges in video marketing isn't the production—it's knowing what to talk about. After helping hundreds of businesses create video content, we've identified the topics that consistently drive engagement and conversions.</p>

<p>Here are 30 video ideas organized by category, ready for you to adapt to your business:</p>

<h2>Educational Content (Videos 1-10)</h2>
<ol>
  <li><strong>FAQ Answers:</strong> "How long does [your service] take?"</li>
  <li><strong>Myth Busting:</strong> "3 myths about [your industry] debunked"</li>
  <li><strong>Process Explained:</strong> "What to expect during your first [appointment/session]"</li>
  <li><strong>Tips & Tricks:</strong> "5 tips to get the most out of [your service]"</li>
  <li><strong>Common Mistakes:</strong> "Avoid these 3 mistakes when [relevant action]"</li>
  <li><strong>Before & After Prep:</strong> "How to prepare for [your service]"</li>
  <li><strong>Industry Trends:</strong> "What's new in [your industry] for 2024"</li>
  <li><strong>Comparison Videos:</strong> "[Service A] vs [Service B]: Which is right for you?"</li>
  <li><strong>Cost Breakdown:</strong> "What does [your service] really cost?"</li>
  <li><strong>Timeline Videos:</strong> "Results timeline: What to expect week by week"</li>
</ol>

<h2>Trust-Building Content (Videos 11-18)</h2>
<ol start="11">
  <li><strong>Behind the Scenes:</strong> "A day in the life at [your business]"</li>
  <li><strong>Team Introduction:</strong> "Meet [team member] and their specialty"</li>
  <li><strong>Your Story:</strong> "Why I started [your business]"</li>
  <li><strong>Client Success:</strong> "How we helped [client type] achieve [result]"</li>
  <li><strong>Credentials:</strong> "My training and certifications explained"</li>
  <li><strong>Tools/Products:</strong> "Why we use [specific tool/product]"</li>
  <li><strong>Quality Standards:</strong> "How we ensure quality in every [service]"</li>
  <li><strong>Values Video:</strong> "What [your business] stands for"</li>
</ol>

<h2>Engagement Content (Videos 19-25)</h2>
<ol start="19">
  <li><strong>Quick Tips:</strong> "One thing you can do today to [benefit]"</li>
  <li><strong>Industry News:</strong> "Breaking: [relevant news] and what it means for you"</li>
  <li><strong>Seasonal Content:</strong> "[Season] tips for [your industry]"</li>
  <li><strong>Trending Topics:</strong> Your take on industry trends</li>
  <li><strong>Poll Results:</strong> "You asked, we answered: [topic]"</li>
  <li><strong>Controversial Takes:</strong> "Unpopular opinion: [your take]"</li>
  <li><strong>Q&A Responses:</strong> "Answering your top questions"</li>
</ol>

<h2>Sales-Focused Content (Videos 26-30)</h2>
<ol start="26">
  <li><strong>Special Offers:</strong> "Limited time: [your promotion]"</li>
  <li><strong>New Service:</strong> "Introducing [new service/product]"</li>
  <li><strong>Why Choose Us:</strong> "3 reasons to choose [your business]"</li>
  <li><strong>Booking CTA:</strong> "Ready to [achieve result]? Here's how to start"</li>
  <li><strong>Urgency Creator:</strong> "Why now is the perfect time for [your service]"</li>
</ol>

<h2>Pro Tips for Using These Ideas</h2>
<ul>
  <li><strong>Batch your content:</strong> Script 5-10 videos at once for efficiency</li>
  <li><strong>Repurpose:</strong> Turn one long video into multiple short clips</li>
  <li><strong>Track performance:</strong> Double down on topics that resonate</li>
  <li><strong>Stay authentic:</strong> Adapt these ideas to your unique voice and expertise</li>
</ul>

<h2>Want These Videos Done For You?</h2>
<p>At BrandVoice.AI, we don't just give you ideas—we create all 30 videos for you. Custom AI spokesperson, professional scripts, and polished editing. All delivered in 7 days. Book a call to learn more.</p>
`,
      categoryId: categories[1].id,
      authorId: author.id,
      tags: ['Content Ideas', 'Video Marketing', 'Social Media', 'Content Calendar'],
      featuredImage: '/images/blog/content-ideas.jpg',
      featuredImageAlt: '30 video content ideas illustration',
    },
    {
      slug: 'instagram-reels-vs-tiktok-where-should-you-post',
      title: 'Instagram Reels vs TikTok: Where Should Your Business Post?',
      metaTitle: 'Instagram Reels vs TikTok for Business | BrandVoice.AI',
      metaDescription: 'Instagram Reels or TikTok? Learn which platform is better for your business, the key differences, and how to create content that works on both.',
      excerpt: 'Should your business focus on Instagram Reels or TikTok? We break down the differences, audience demographics, and how to maximize both platforms.',
      content: `
<h2>The Short-Form Video Showdown</h2>
<p>Short-form vertical video dominates social media in 2024. Both Instagram Reels and TikTok offer massive reach potential, but they're not identical. Understanding the differences helps you allocate your content strategy effectively.</p>

<h2>Platform Demographics</h2>
<h3>TikTok</h3>
<ul>
  <li><strong>Primary audience:</strong> 16-34 year olds (60% of users)</li>
  <li><strong>Fastest growing segment:</strong> 35-44 year olds</li>
  <li><strong>User behavior:</strong> Discovery-focused, entertainment-first</li>
  <li><strong>Average session:</strong> 52 minutes per day</li>
</ul>

<h3>Instagram Reels</h3>
<ul>
  <li><strong>Primary audience:</strong> 25-44 year olds (most active)</li>
  <li><strong>User behavior:</strong> Lifestyle, aspirational content</li>
  <li><strong>Integration:</strong> Part of broader Instagram ecosystem</li>
  <li><strong>Average session:</strong> 30 minutes per day</li>
</ul>

<h2>Content Style Differences</h2>
<h3>What Works on TikTok</h3>
<ul>
  <li>Raw, authentic, "unpolished" content</li>
  <li>Trending sounds and challenges</li>
  <li>Educational content that feels casual</li>
  <li>Storytelling and personality-driven posts</li>
  <li>Humor and entertainment value</li>
</ul>

<h3>What Works on Instagram Reels</h3>
<ul>
  <li>More polished, aesthetically pleasing content</li>
  <li>Brand-consistent visuals</li>
  <li>Lifestyle and aspirational content</li>
  <li>Product showcases and tutorials</li>
  <li>Behind-the-scenes with professional touch</li>
</ul>

<h2>Algorithm Differences</h2>
<p><strong>TikTok's algorithm</strong> is famous for its discovery potential. Even accounts with zero followers can go viral if the content resonates. The For You Page (FYP) heavily favors engagement metrics like watch time and completion rate.</p>

<p><strong>Instagram's algorithm</strong> for Reels prioritizes:</p>
<ul>
  <li>Existing follower engagement</li>
  <li>Content similar to what users already engage with</li>
  <li>Original content (penalizes watermarked TikTok reposts)</li>
  <li>High-quality video production</li>
</ul>

<h2>Which Platform Should You Choose?</h2>
<h3>Choose TikTok If:</h3>
<ul>
  <li>Your target audience is under 35</li>
  <li>You're comfortable with casual, authentic content</li>
  <li>You want maximum discovery potential</li>
  <li>You can keep up with trends quickly</li>
</ul>

<h3>Choose Instagram Reels If:</h3>
<ul>
  <li>Your audience is 25-55</li>
  <li>You already have an Instagram presence</li>
  <li>Your brand values polished aesthetics</li>
  <li>You want integration with Stories, Posts, and DMs</li>
</ul>

<h3>Choose Both If:</h3>
<ul>
  <li>You have capacity for consistent content</li>
  <li>Your audience spans multiple age groups</li>
  <li>You can adapt content for each platform</li>
</ul>

<h2>Cross-Posting Strategy</h2>
<p>While you can post the same video on both platforms, optimization matters:</p>
<ul>
  <li><strong>Remove watermarks:</strong> Instagram deprioritizes TikTok-watermarked videos</li>
  <li><strong>Adjust captions:</strong> TikTok favors on-screen text; Instagram allows longer descriptions</li>
  <li><strong>Timing:</strong> Post natively to each platform rather than using cross-posting tools</li>
  <li><strong>Sounds:</strong> Some trending sounds are platform-specific</li>
</ul>

<h2>The Best of Both Worlds</h2>
<p>At BrandVoice.AI, we create AI spokesperson videos optimized for both platforms. Our 9:16 vertical format works perfectly on TikTok, Instagram Reels, and YouTube Shorts. You get 30 videos ready to post across all platforms—maximizing your reach without multiplying your workload.</p>

<p>Ready to dominate short-form video on every platform? Book a call to see how we can help.</p>
`,
      categoryId: categories[2].id,
      authorId: author.id,
      tags: ['Instagram', 'TikTok', 'Social Media Strategy', 'Short-Form Video'],
      featuredImage: '/images/blog/reels-vs-tiktok.jpg',
      featuredImageAlt: 'Instagram Reels vs TikTok comparison',
    },
  ];

  for (const postData of posts) {
    const { tags, ...postFields } = postData;

    // Check if post already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: postFields.slug },
    });

    if (existingPost) {
      console.log(`Post already exists: ${postFields.title}`);
      continue;
    }

    // Calculate reading time and word count
    const wordCount = postFields.content.split(/\s+/).filter(Boolean).length;
    const readingTime = Math.ceil(wordCount / 200);

    const post = await prisma.blogPost.create({
      data: {
        ...postFields,
        contentFormat: 'html',
        status: 'PUBLISHED',
        featured: false,
        readingTime,
        wordCount,
        publishedAt: new Date(),
        schemaType: 'BlogPosting',
      },
    });

    // Create tags and link to post
    for (const tagName of tags) {
      let tag = await prisma.blogTag.findFirst({
        where: { name: { equals: tagName, mode: 'insensitive' } },
      });

      if (!tag) {
        tag = await prisma.blogTag.create({
          data: {
            name: tagName,
            slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          },
        });
      }

      await prisma.blogPostTag.create({
        data: {
          postId: post.id,
          tagId: tag.id,
        },
      });
    }

    console.log(`Created post: ${post.title}`);
  }

  console.log('Blog seeding complete!');
}

seedBlog()
  .catch((e) => {
    console.error('Error seeding blog:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
