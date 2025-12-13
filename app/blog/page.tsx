import { Metadata } from 'next';
import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { BlogCard } from '@/components/blog/BlogCard';
import { CategoryFilter } from '@/components/blog/CategoryFilter';
import { NewsletterSignup } from '@/components/blog/NewsletterSignup';
import { Search } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog | BrandVoice Studio - AI Business Insights & Updates',
  description: 'Expert insights on leveraging AI for business growth, marketing automation, and brand building. Stay updated with the latest AI trends and strategies.',
  keywords: ['AI business', 'AI marketing', 'business automation', 'AI spokesperson', 'brand building', 'AI trends'],
  openGraph: {
    title: 'Blog | BrandVoice Studio',
    description: 'Expert insights on leveraging AI for business growth and brand building.',
    type: 'website',
    url: 'https://brandvoice.studio/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | BrandVoice Studio',
    description: 'Expert insights on leveraging AI for business growth and brand building.',
  },
  alternates: {
    canonical: 'https://brandvoice.studio/blog',
  },
};

interface BlogPageProps {
  searchParams: Promise<{
    category?: string;
    page?: string;
    search?: string;
  }>;
}

async function getCategories() {
  return prisma.blogCategory.findMany({
    include: {
      _count: {
        select: { posts: true },
      },
    },
    orderBy: { name: 'asc' },
  });
}

async function getPosts(categorySlug?: string, page = 1, search?: string) {
  const perPage = 9;
  const skip = (page - 1) * perPage;

  const where = {
    status: 'PUBLISHED' as const,
    ...(categorySlug && {
      category: { slug: categorySlug },
    }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { excerpt: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
  };

  const [posts, totalCount, featuredPost] = await Promise.all([
    prisma.blogPost.findMany({
      where: {
        ...where,
        featured: false,
      },
      include: {
        category: true,
        author: true,
      },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: perPage,
    }),
    prisma.blogPost.count({ where }),
    page === 1 && !search
      ? prisma.blogPost.findFirst({
          where: {
            ...where,
            featured: true,
          },
          include: {
            category: true,
            author: true,
          },
          orderBy: { publishedAt: 'desc' },
        })
      : null,
  ]);

  return {
    posts,
    featuredPost,
    totalCount,
    totalPages: Math.ceil(totalCount / perPage),
    currentPage: page,
  };
}

function BlogSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
          <div className="aspect-[16/10] bg-gray-200" />
          <div className="p-5 space-y-3">
            <div className="h-4 w-20 bg-gray-200 rounded-full" />
            <div className="h-6 w-full bg-gray-200 rounded" />
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="flex justify-between">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-16 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const categorySlug = params.category;
  const currentPage = parseInt(params.page || '1', 10);
  const searchQuery = params.search;

  const [categories, { posts, featuredPost, totalPages }] = await Promise.all([
    getCategories(),
    getPosts(categorySlug, currentPage, searchQuery),
  ]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              AI Insights for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                Business Leaders
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Discover strategies to leverage AI in your business model, create maximum value,
              and drive customer impact for your brand.
            </p>

            {/* Search Bar */}
            <form action="/blog" method="GET" className="relative max-w-xl">
              <input
                type="text"
                name="search"
                defaultValue={searchQuery}
                placeholder="Search articles..."
                className="w-full px-5 py-4 pl-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Category Filter */}
          <div className="mb-10">
            <Suspense fallback={<div className="h-10 bg-gray-200 rounded animate-pulse w-96" />}>
              <CategoryFilter categories={categories} selectedSlug={categorySlug} />
            </Suspense>
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <div className="mb-12">
              <BlogCard post={featuredPost} featured />
            </div>
          )}

          {/* Posts Grid */}
          <Suspense fallback={<BlogSkeleton />}>
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts found</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery
                    ? `No articles match "${searchQuery}"`
                    : 'Check back soon for new content!'}
                </p>
                {(searchQuery || categorySlug) && (
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    View all posts
                  </Link>
                )}
              </div>
            )}
          </Suspense>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mb-12">
              {currentPage > 1 && (
                <Link
                  href={`/blog?page=${currentPage - 1}${categorySlug ? `&category=${categorySlug}` : ''}`}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Previous
                </Link>
              )}

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                const isActive = page === currentPage;

                // Show first, last, current, and adjacent pages
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <Link
                      key={page}
                      href={`/blog?page=${page}${categorySlug ? `&category=${categorySlug}` : ''}`}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-purple-600 text-white'
                          : 'bg-white border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </Link>
                  );
                }

                // Show ellipsis
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span key={page} className="px-2 py-2 text-gray-400">
                      ...
                    </span>
                  );
                }

                return null;
              })}

              {currentPage < totalPages && (
                <Link
                  href={`/blog?page=${currentPage + 1}${categorySlug ? `&category=${categorySlug}` : ''}`}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Next
                </Link>
              )}
            </div>
          )}

          {/* Newsletter Signup */}
          <div className="max-w-2xl mx-auto">
            <NewsletterSignup />
          </div>
        </div>
      </section>
    </main>
  );
}
