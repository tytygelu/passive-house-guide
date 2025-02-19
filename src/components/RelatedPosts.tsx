import Link from 'next/link'
import { getSimilarPosts } from '@/lib/api'
import { CoverImage } from '@/components/CoverImage'

interface RelatedPostsProps {
  currentSlug: string
  lang: string
  category: 'materials' | 'principles'
  className?: string
}

const RelatedPosts = ({ currentSlug, lang, category, className = '' }: RelatedPostsProps) => {
  const posts = getSimilarPosts(category, lang, currentSlug)
  
  if (!posts || posts.length === 0) return null

  return (
    <div className={`mt-16 ${className}`}>
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
              <CoverImage
                title={post.title}
                src={post.coverImage}
                className="mb-4 overflow-hidden rounded-lg"
                sizes="(min-width: 1280px) 384px, (min-width: 768px) 50vw, 100vw"
              />
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
