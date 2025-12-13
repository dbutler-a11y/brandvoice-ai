import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

// GET /api/blog/posts - List all posts (public, with filtering)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'PUBLISHED';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const featured = searchParams.get('featured');

    const skip = (page - 1) * limit;

    const where = {
      ...(status && { status: status as 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED' }),
      ...(category && { category: { slug: category } }),
      ...(featured === 'true' && { featured: true }),
    };

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          category: true,
          author: true,
          tags: {
            include: { tag: true },
          },
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// POST /api/blog/posts - Create a new post (requires auth + n8n API key)
export async function POST(request: NextRequest) {
  try {
    // Check for n8n API key or admin auth
    const apiKey = request.headers.get('x-api-key');
    const expectedApiKey = process.env.N8N_API_KEY;

    let isAuthorized = false;

    // Check API key first (for n8n)
    if (apiKey && expectedApiKey && apiKey === expectedApiKey) {
      isAuthorized = true;
    }

    // If no API key, check for admin session
    if (!isAuthorized) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const userData = await prisma.user.findUnique({
          where: { email: user.email! },
          select: { role: true },
        });

        if (userData?.role === 'ADMIN') {
          isAuthorized = true;
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Calculate reading time and word count
    const wordCount = body.content?.split(/\s+/).filter(Boolean).length || 0;
    const readingTime = Math.ceil(wordCount / 200); // ~200 words per minute

    // Generate slug from title if not provided
    const slug = body.slug || body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const post = await prisma.blogPost.create({
      data: {
        slug,
        title: body.title,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        metaKeywords: body.metaKeywords,
        excerpt: body.excerpt,
        content: body.content,
        contentFormat: body.contentFormat || 'html',
        featuredImage: body.featuredImage,
        featuredImageAlt: body.featuredImageAlt,
        ogImage: body.ogImage,
        categoryId: body.categoryId,
        authorId: body.authorId,
        status: body.status || 'DRAFT',
        featured: body.featured || false,
        readingTime,
        wordCount,
        publishedAt: body.status === 'PUBLISHED' ? new Date() : null,
        schemaType: body.schemaType || 'Article',
      },
      include: {
        category: true,
        author: true,
      },
    });

    // Handle tags if provided
    if (body.tags && Array.isArray(body.tags)) {
      for (const tagName of body.tags) {
        // Find or create tag
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

        // Create post-tag relation
        await prisma.blogPostTag.create({
          data: {
            postId: post.id,
            tagId: tag.id,
          },
        });
      }
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
