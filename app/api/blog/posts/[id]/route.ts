import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

async function isAuthorized(request: NextRequest): Promise<boolean> {
  // Check for n8n API key
  const apiKey = request.headers.get('x-api-key');
  const expectedApiKey = process.env.N8N_API_KEY;

  if (apiKey && expectedApiKey && apiKey === expectedApiKey) {
    return true;
  }

  // Check for admin session
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const userData = await prisma.user.findUnique({
      where: { email: user.email! },
      select: { role: true },
    });

    if (userData?.role === 'ADMIN') {
      return true;
    }
  }

  return false;
}

// GET /api/blog/posts/[id] - Get a single post
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Try to find by ID first, then by slug
    let post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        category: true,
        author: true,
        tags: {
          include: { tag: true },
        },
      },
    });

    if (!post) {
      post = await prisma.blogPost.findUnique({
        where: { slug: id },
        include: {
          category: true,
          author: true,
          tags: {
            include: { tag: true },
          },
        },
      });
    }

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

// PATCH /api/blog/posts/[id] - Update a post
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    if (!(await isAuthorized(request))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Find existing post
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Calculate reading time and word count if content changed
    let readingTime: number | null = existingPost.readingTime;
    let wordCount: number | null = existingPost.wordCount;

    if (body.content) {
      wordCount = body.content.split(/\s+/).filter(Boolean).length;
      readingTime = Math.ceil((wordCount ?? 0) / 200);
    }

    // Update publishedAt if status changed to PUBLISHED
    let publishedAt = existingPost.publishedAt;
    if (body.status === 'PUBLISHED' && existingPost.status !== 'PUBLISHED') {
      publishedAt = new Date();
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(body.slug && { slug: body.slug }),
        ...(body.title && { title: body.title }),
        ...(body.metaTitle !== undefined && { metaTitle: body.metaTitle }),
        ...(body.metaDescription !== undefined && { metaDescription: body.metaDescription }),
        ...(body.metaKeywords !== undefined && { metaKeywords: body.metaKeywords }),
        ...(body.excerpt && { excerpt: body.excerpt }),
        ...(body.content && { content: body.content, readingTime, wordCount }),
        ...(body.contentFormat && { contentFormat: body.contentFormat }),
        ...(body.featuredImage !== undefined && { featuredImage: body.featuredImage }),
        ...(body.featuredImageAlt !== undefined && { featuredImageAlt: body.featuredImageAlt }),
        ...(body.ogImage !== undefined && { ogImage: body.ogImage }),
        ...(body.categoryId !== undefined && { categoryId: body.categoryId }),
        ...(body.authorId !== undefined && { authorId: body.authorId }),
        ...(body.status && { status: body.status, publishedAt }),
        ...(body.featured !== undefined && { featured: body.featured }),
        ...(body.schemaType && { schemaType: body.schemaType }),
      },
      include: {
        category: true,
        author: true,
        tags: {
          include: { tag: true },
        },
      },
    });

    // Handle tags update if provided
    if (body.tags && Array.isArray(body.tags)) {
      // Remove existing tags
      await prisma.blogPostTag.deleteMany({
        where: { postId: id },
      });

      // Add new tags
      for (const tagName of body.tags) {
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
            postId: id,
            tagId: tag.id,
          },
        });
      }
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/posts/[id] - Delete a post
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    if (!(await isAuthorized(request))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Delete post tags first
    await prisma.blogPostTag.deleteMany({
      where: { postId: id },
    });

    // Delete the post
    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
