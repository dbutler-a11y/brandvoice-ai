import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';

interface BlogCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    featuredImage?: string | null;
    featuredImageAlt?: string | null;
    publishedAt?: Date | null;
    readingTime?: number | null;
    category?: {
      name: string;
      slug: string;
      color?: string | null;
    } | null;
    author?: {
      name: string;
      avatar?: string | null;
    } | null;
  };
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const formattedDate = post.publishedAt
    ? new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(post.publishedAt))
    : null;

  if (featured) {
    return (
      <article className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800">
        <Link href={`/blog/${post.slug}`} className="block">
          {/* Featured Image */}
          <div className="relative aspect-[16/9] md:aspect-[21/9]">
            {post.featuredImage ? (
              <Image
                src={post.featuredImage}
                alt={post.featuredImageAlt || post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600" />
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            {post.category && (
              <span
                className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full mb-4"
                style={{
                  backgroundColor: post.category.color || '#3B82F6',
                  color: '#fff',
                }}
              >
                {post.category.name}
              </span>
            )}

            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
              {post.title}
            </h2>

            <p className="text-gray-300 text-lg mb-4 line-clamp-2 max-w-3xl">
              {post.excerpt}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-400">
              {post.author && (
                <div className="flex items-center gap-2">
                  {post.author.avatar && (
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  )}
                  <span>{post.author.name}</span>
                </div>
              )}
              {formattedDate && <span>{formattedDate}</span>}
              {post.readingTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readingTime} min read
                </span>
              )}
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.featuredImageAlt || post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600" />
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {post.category && (
            <span
              className="inline-block px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full mb-3"
              style={{
                backgroundColor: `${post.category.color || '#3B82F6'}20`,
                color: post.category.color || '#3B82F6',
              }}
            >
              {post.category.name}
            </span>
          )}

          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
            {post.title}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3 text-gray-500">
              {formattedDate && <span>{formattedDate}</span>}
              {post.readingTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readingTime} min
                </span>
              )}
            </div>

            <span className="text-purple-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              Read <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
