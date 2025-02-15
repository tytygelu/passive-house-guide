import Link from 'next/link'
import Image from 'next/image'
import { Post } from '@/types/post'

interface RelatedPostsProps {
  posts: Post[]
  lang: string
  category?: 'materials' | 'principles'
}

export default function RelatedPosts({ posts, lang, category = 'materials' }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <div className="mt-16">
      <div className="h-px w-full bg-gradient-to-r from-[#A5B9B9] via-gray-300 to-[#A5B9B9] mb-8" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/${lang}/${category}/${post.slug}`}
            className="group"
          >
            <article className="relative h-full border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="relative aspect-[16/9]">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  )
}
