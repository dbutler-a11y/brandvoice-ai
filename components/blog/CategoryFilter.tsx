'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
  _count?: {
    posts: number;
  };
}

interface CategoryFilterProps {
  categories: Category[];
  selectedSlug?: string | null;
}

export function CategoryFilter({ categories, selectedSlug }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }

    // Reset to page 1 when changing category
    params.delete('page');

    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleCategoryChange(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          !selectedSlug
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All Posts
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryChange(category.slug)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedSlug === category.slug
              ? 'text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          style={
            selectedSlug === category.slug
              ? { backgroundColor: category.color || '#3B82F6' }
              : undefined
          }
        >
          {category.name}
          {category._count && (
            <span className="ml-1.5 opacity-70">({category._count.posts})</span>
          )}
        </button>
      ))}
    </div>
  );
}
