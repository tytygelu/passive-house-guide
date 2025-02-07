"use client";

import { useState } from 'react';
import Link from 'next/link';

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category?: string;
}

interface SearchComponentProps {
  posts: Post[];
  lang: string;
}

export default function SearchComponent({ posts, lang }: SearchComponentProps) {
  const [query, setQuery] = useState<string>('');

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(query.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(query.toLowerCase())
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
                href={`/${lang}/${post.category}/${post.slug}`}
                prefetch={false}
                className="text-blue-500 hover:underline"
              >
                {post.title}
              </Link>
              <p className="text-gray-600 text-sm">{post.excerpt}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
}
