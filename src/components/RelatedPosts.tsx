import Link from 'next/link'
import Image from 'next/image'
import { Post } from '@/types/post'

interface RelatedPostsProps {
  posts: Post[]
  lang: string
  category: 'materials' | 'principles'
}

const RelatedPosts = ({ posts, lang, category }: RelatedPostsProps) => {
  if (posts.length === 0) return null

  return (
    <div className="mt-16">
      <div className="h-px w-full bg-gradient-to-r from-[#A5B9B9] via-gray-300 to-[#A5B9B9] mb-8" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => {
          // Determine the category for this post based on the number of posts from the same category
          const postCategory = index < posts.length - (3 - posts.length) ? category : (category === 'materials' ? 'principles' : 'materials')
          
          return (
            <Link
              key={post.slug}
              href={`/${lang}/${postCategory}/${post.slug}`}
              className="group"
            >
              <div className="relative aspect-video mb-4 overflow-hidden rounded-lg">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-[#A5B9B9] transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-600">{post.excerpt}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default RelatedPosts
