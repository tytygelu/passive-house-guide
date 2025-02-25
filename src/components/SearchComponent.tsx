"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category?: string;
  tags?: string[];
}

interface SearchComponentProps {
  posts: Post[];
  lang: string;
}

function SearchContent({ posts, lang }: SearchComponentProps) {
  const [query, setQuery] = useState<string>('');
  const searchParams = useSearchParams();
  const tagParam = searchParams?.get('tag') || '';

  useEffect(() => {
    if (tagParam) {
      setQuery(tagParam);
    }
  }, [tagParam]);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(query.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
    post.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      {filteredPosts.length > 0 ? (
        <ul>
          {filteredPosts.map((post) => (
            <li key={post.slug} className="mb-4">
              <Link
                href={`/${lang}/${post.slug}`}
                prefetch={false}
                className="text-blue-500 hover:underline"
              >
                {post.title}
              </Link>
              <p className="text-gray-600 text-sm">{post.excerpt}</p>
              {post.tags && (
                <div className="mt-2">
                  {post.tags.map(tag => (
                    <Link
                      key={tag}
                      href={`/${lang}/search?tag=${encodeURIComponent(tag)}`}
                      className="inline-block px-3 py-1 mr-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
}

export default function SearchComponent({ posts, lang }: SearchComponentProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent posts={posts} lang={lang} />
    </Suspense>
  );
}
