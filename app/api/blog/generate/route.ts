import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Helper to calculate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Helper to count words
function countWords(content: string): number {
  return content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length;
}

// Get existing posts for internal linking
async function getExistingPosts() {
  const posts = await prisma.blogPost.findMany({
    where: { status: 'PUBLISHED' },
    select: {
      slug: true,
      title: true,
      category: { select: { slug: true } },
    },
    orderBy: { publishedAt: 'desc' },
    take: 20,
  });
  return posts;
}

// Generate blog post content with AI
async function generateBlogContent(topic: {
  title: string;
  pillar: string;
  primaryKeyword: string;
  secondaryKeywords: string | null;
  targetAudience: string | null;
  contentAngle: string | null;
}, existingPosts: { slug: string; title: string }[]) {

  const internalLinksContext = existingPosts.length > 0
    ? `\n\nExisting blog posts you can link to internally (use format [text](/blog/slug)):\n${existingPosts.map(p => `- "${p.title}" -> /blog/${p.slug}`).join('\n')}`
    : '';

  const prompt = `You are an expert SEO content writer for BrandVoice Studio, a company that creates AI-powered video spokespersons for businesses.

Write a comprehensive, SEO-optimized blog post about: "${topic.title}"

REQUIREMENTS:
- Primary keyword: "${topic.primaryKeyword}" (use naturally 3-5 times, including in first paragraph)
${topic.secondaryKeywords ? `- Secondary keywords to include: ${topic.secondaryKeywords}` : ''}
${topic.targetAudience ? `- Target audience: ${topic.targetAudience}` : ''}
${topic.contentAngle ? `- Unique angle: ${topic.contentAngle}` : ''}
- Content pillar: ${topic.pillar === 'ai-video' ? 'AI Video Marketing' : topic.pillar === 'business-growth' ? 'Business Growth' : 'Platform Strategy'}
${internalLinksContext}

OUTPUT FORMAT (return valid HTML):
1. Opening hook paragraph (compelling, mentions primary keyword)
2. 4-6 main sections with H2 headings
3. Sub-sections with H3 headings where appropriate
4. Bullet points and numbered lists for scanability
5. Bold key terms and statistics
6. Natural internal links to related posts where relevant
7. Conclusion with call-to-action mentioning BrandVoice Studio

STYLE GUIDELINES:
- Professional but conversational tone
- Active voice
- Short paragraphs (2-3 sentences)
- Data and statistics where relevant
- Practical, actionable advice
- No fluff or filler content
- 1500-2000 words

Return ONLY the HTML content (starting with <h2>, no <html> or <body> tags).`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 4000,
  });

  return completion.choices[0].message.content || '';
}

// Generate meta description
async function generateMetaDescription(title: string, primaryKeyword: string) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{
      role: 'user',
      content: `Write a compelling SEO meta description (max 155 characters) for a blog post titled "${title}". Include the keyword "${primaryKeyword}" naturally. Return only the description, no quotes.`
    }],
    temperature: 0.7,
    max_tokens: 100,
  });

  return completion.choices[0].message.content?.trim() || '';
}

// Generate excerpt
async function generateExcerpt(title: string, content: string) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{
      role: 'user',
      content: `Write a 2-sentence excerpt/preview for this blog post titled "${title}". Make it engaging and hint at the value. Content preview: ${content.substring(0, 500)}... Return only the excerpt.`
    }],
    temperature: 0.7,
    max_tokens: 100,
  });

  return completion.choices[0].message.content?.trim() || '';
}

// POST /api/blog/generate - Generate and publish a blog post from topic
export async function POST(request: NextRequest) {
  try {
    // Verify API key for cron/external calls
    const apiKey = request.headers.get('x-api-key');
    const expectedApiKey = process.env.N8N_API_KEY || process.env.CRON_SECRET;

    if (!apiKey || apiKey !== expectedApiKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { topicId } = body;

    // Either use specific topic ID or get next scheduled topic
    let topic;
    if (topicId) {
      topic = await prisma.blogTopic.findUnique({ where: { id: topicId } });
    } else {
      // Get next topic scheduled for today or earlier
      topic = await prisma.blogTopic.findFirst({
        where: {
          status: 'queued',
          scheduledFor: { lte: new Date() },
        },
        orderBy: [
          { priority: 'desc' },
          { scheduledFor: 'asc' },
        ],
      });
    }

    if (!topic) {
      return NextResponse.json(
        { message: 'No topics ready for generation', generated: false },
        { status: 200 }
      );
    }

    // Mark topic as generating
    await prisma.blogTopic.update({
      where: { id: topic.id },
      data: { status: 'generating' },
    });

    try {
      // Get existing posts for internal linking
      const existingPosts = await getExistingPosts();

      // Generate content
      console.log(`Generating content for: ${topic.title}`);
      const content = await generateBlogContent(topic, existingPosts);

      // Generate meta description
      const metaDescription = await generateMetaDescription(topic.title, topic.primaryKeyword);

      // Generate excerpt
      const excerpt = await generateExcerpt(topic.title, content);

      // Generate slug
      const baseSlug = generateSlug(topic.title);

      // Ensure unique slug
      let slug = baseSlug;
      let counter = 1;
      while (await prisma.blogPost.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Get or create category based on pillar
      const categoryMap: Record<string, { name: string; color: string }> = {
        'ai-video': { name: 'AI Video Marketing', color: '#8B5CF6' },
        'business-growth': { name: 'Business Growth', color: '#10B981' },
        'platform-strategy': { name: 'Platform Strategy', color: '#F59E0B' },
      };

      const categoryData = categoryMap[topic.pillar] || categoryMap['ai-video'];
      const categorySlug = topic.pillar;

      let category = await prisma.blogCategory.findFirst({
        where: {
          OR: [
            { slug: categorySlug },
            { name: categoryData.name }
          ]
        }
      });
      if (!category) {
        category = await prisma.blogCategory.create({
          data: {
            name: categoryData.name,
            slug: categorySlug,
            color: categoryData.color,
          },
        });
      }

      // Get default author
      let author = await prisma.blogAuthor.findFirst({ orderBy: { createdAt: 'asc' } });
      if (!author) {
        author = await prisma.blogAuthor.create({
          data: {
            name: 'BrandVoice Team',
            slug: 'brandvoice-team',
            title: 'Content Team',
            bio: 'The BrandVoice Studio content team shares insights on AI video marketing, business growth, and social media strategy.',
          },
        });
      }

      // Create the blog post
      const post = await prisma.blogPost.create({
        data: {
          slug,
          title: topic.title,
          metaTitle: `${topic.title} | BrandVoice Studio`,
          metaDescription,
          metaKeywords: [topic.primaryKeyword, ...(topic.secondaryKeywords?.split(',').map(k => k.trim()) || [])].join(', '),
          excerpt,
          content,
          contentFormat: 'html',
          status: 'PUBLISHED',
          publishedAt: new Date(),
          readingTime: calculateReadingTime(content),
          wordCount: countWords(content),
          categoryId: category.id,
          authorId: author.id,
          schemaType: 'Article',
        },
      });

      // Create tags from keywords
      const keywords = [topic.primaryKeyword, ...(topic.secondaryKeywords?.split(',').map(k => k.trim()) || [])];
      for (const keyword of keywords.slice(0, 5)) {
        const tagSlug = generateSlug(keyword);
        let tag = await prisma.blogTag.findUnique({ where: { slug: tagSlug } });
        if (!tag) {
          tag = await prisma.blogTag.create({
            data: { name: keyword, slug: tagSlug },
          });
        }
        await prisma.blogPostTag.create({
          data: { postId: post.id, tagId: tag.id },
        }).catch(() => {}); // Ignore duplicate tag errors
      }

      // Update topic as published
      await prisma.blogTopic.update({
        where: { id: topic.id },
        data: {
          status: 'published',
          generatedPostId: post.id,
          generatedAt: new Date(),
        },
      });

      console.log(`Published: ${post.title} -> /blog/${post.slug}`);

      return NextResponse.json({
        success: true,
        generated: true,
        post: {
          id: post.id,
          title: post.title,
          slug: post.slug,
          url: `/blog/${post.slug}`,
          wordCount: post.wordCount,
          readingTime: post.readingTime,
        },
        topic: {
          id: topic.id,
          title: topic.title,
          pillar: topic.pillar,
        },
      });

    } catch (generationError) {
      // Mark topic as failed
      await prisma.blogTopic.update({
        where: { id: topic.id },
        data: {
          status: 'failed',
          errorMessage: generationError instanceof Error ? generationError.message : 'Unknown error',
        },
      });

      throw generationError;
    }

  } catch (error) {
    console.error('Error generating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to generate blog post', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET /api/blog/generate - Get generation status and queue info
export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key');
    const expectedApiKey = process.env.N8N_API_KEY || process.env.CRON_SECRET;

    if (!apiKey || apiKey !== expectedApiKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const [queued, generating, published, failed] = await Promise.all([
      prisma.blogTopic.count({ where: { status: 'queued' } }),
      prisma.blogTopic.count({ where: { status: 'generating' } }),
      prisma.blogTopic.count({ where: { status: 'published' } }),
      prisma.blogTopic.count({ where: { status: 'failed' } }),
    ]);

    const nextTopic = await prisma.blogTopic.findFirst({
      where: {
        status: 'queued',
        scheduledFor: { lte: new Date() },
      },
      orderBy: [
        { priority: 'desc' },
        { scheduledFor: 'asc' },
      ],
      select: {
        id: true,
        title: true,
        pillar: true,
        scheduledFor: true,
        priority: true,
      },
    });

    const recentlyPublished = await prisma.blogTopic.findMany({
      where: { status: 'published' },
      orderBy: { generatedAt: 'desc' },
      take: 5,
      select: {
        title: true,
        generatedAt: true,
        generatedPostId: true,
      },
    });

    return NextResponse.json({
      queue: {
        queued,
        generating,
        published,
        failed,
        total: queued + generating + published + failed,
      },
      nextTopic,
      recentlyPublished,
    });

  } catch (error) {
    console.error('Error fetching generation status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch status' },
      { status: 500 }
    );
  }
}
