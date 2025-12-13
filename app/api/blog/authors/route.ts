import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

// GET /api/blog/authors - List all authors
export async function GET() {
  try {
    const authors = await prisma.blogAuthor.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(authors);
  } catch (error) {
    console.error('Error fetching blog authors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch authors' },
      { status: 500 }
    );
  }
}

// POST /api/blog/authors - Create a new author
export async function POST(request: NextRequest) {
  try {
    // Check for n8n API key or admin auth
    const apiKey = request.headers.get('x-api-key');
    const expectedApiKey = process.env.N8N_API_KEY;

    let isAuthorized = false;

    if (apiKey && expectedApiKey && apiKey === expectedApiKey) {
      isAuthorized = true;
    }

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

    // Generate slug from name if not provided
    const slug = body.slug || body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const author = await prisma.blogAuthor.create({
      data: {
        name: body.name,
        slug,
        email: body.email,
        bio: body.bio,
        avatar: body.avatar,
        title: body.title,
        company: body.company,
        website: body.website,
        twitter: body.twitter,
        linkedin: body.linkedin,
      },
    });

    return NextResponse.json(author, { status: 201 });
  } catch (error) {
    console.error('Error creating blog author:', error);
    return NextResponse.json(
      { error: 'Failed to create author' },
      { status: 500 }
    );
  }
}
