import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Clock, Calendar, ArrowLeft, Share2, Linkedin, Twitter } from 'lucide-react';
import { NewsletterSignup } from '@/components/blog/NewsletterSignup';
import { BlogCard } from '@/components/blog/BlogCard';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      category: true,
      author: true,
      tags: {
        include: { tag: true },
      },
    },
  });

  if (!post || post.status !== 'PUBLISHED') {
    return null;
  }

  // Increment view count
  await prisma.blogPost.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  });

  return post;
}

async function getRelatedPosts(postId: string, categoryId?: string | null) {
  return prisma.blogPost.findMany({
    where: {
      id: { not: postId },
      status: 'PUBLISHED',
      ...(categoryId && { categoryId }),
    },
    include: {
      category: true,
      author: true,
    },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  });
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { author: true },
  });

  if (!post) {
    return {
      title: 'Post Not Found | BrandVoice Studio Blog',
    };
  }

  const ogImage = post.ogImage || post.featuredImage;

  return {
    title: post.metaTitle || `${post.title} | BrandVoice Studio Blog`,
    description: post.metaDescription || post.excerpt,
    keywords: post.metaKeywords || undefined,
    authors: post.author ? [{ name: post.author.name }] : undefined,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      type: 'article',
      url: `https://brandvoice.studio/blog/${post.slug}`,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: post.author?.name ? [post.author.name] : undefined,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: ogImage ? [ogImage] : undefined,
    },
    alternates: {
      canonical: `https://brandvoice.studio/blog/${post.slug}`,
    },
  };
}

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true },
  });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

function ShareButtons({ url, title }: { url: string; title: string }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-500 flex items-center gap-1">
        <Share2 className="w-4 h-4" /> Share
      </span>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-gray-100 hover:bg-purple-100 hover:text-purple-600 transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter className="w-4 h-4" />
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-gray-100 hover:bg-purple-100 hover:text-purple-600 transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </a>
    </div>
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.id, post.categoryId);
  const postUrl = `https://brandvoice.studio/blog/${post.slug}`;

  const formattedDate = post.publishedAt
    ? new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(post.publishedAt))
    : null;

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': post.schemaType || 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: post.author
      ? {
          '@type': 'Person',
          name: post.author.name,
          url: post.author.website,
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'BrandVoice Studio',
      logo: {
        '@type': 'ImageObject',
        url: 'https://brandvoice.studio/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    wordCount: post.wordCount,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white py-12 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            {/* Back Link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-purple-300 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            {/* Category */}
            {post.category && (
              <Link
                href={`/blog?category=${post.category.slug}`}
                className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full mb-4"
                style={{
                  backgroundColor: post.category.color || '#3B82F6',
                  color: '#fff',
                }}
              >
                {post.category.name}
              </Link>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-300 mb-8">{post.excerpt}</p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
              {/* Author */}
              {post.author && (
                <div className="flex items-center gap-3">
                  {post.author.avatar && (
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <span className="block text-white font-medium">{post.author.name}</span>
                    {post.author.title && (
                      <span className="text-gray-400">{post.author.title}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Date */}
              {formattedDate && (
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formattedDate}
                </span>
              )}

              {/* Reading Time */}
              {post.readingTime && (
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {post.readingTime} min read
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl -mt-8 md:-mt-12 mb-12 relative z-10">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={post.featuredImage}
                alt={post.featuredImageAlt || post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Article Content */}
        <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl py-12">
          {/* Share Buttons */}
          <div className="flex justify-end mb-8">
            <ShareButtons url={postUrl} title={post.title} />
          </div>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-li:text-gray-700 prose-strong:text-gray-900 prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-ul:my-4 prose-ol:my-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {post.tags.map(({ tag }) => (
                  <Link
                    key={tag.id}
                    href={`/blog?tag=${tag.slug}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio */}
          {post.author && post.author.bio && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">
                {post.author.avatar && (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={64}
                    height={64}
                    className="rounded-full flex-shrink-0"
                  />
                )}
                <div>
                  <h4 className="font-bold text-gray-900">{post.author.name}</h4>
                  {post.author.title && (
                    <p className="text-sm text-gray-500 mb-2">{post.author.title}</p>
                  )}
                  <p className="text-gray-600">{post.author.bio}</p>
                </div>
              </div>
            </div>
          )}

          {/* Share Buttons Bottom */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
            <ShareButtons url={postUrl} title={post.title} />
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Newsletter */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
            <NewsletterSignup />
          </div>
        </section>
      </main>
    </>
  );
}
