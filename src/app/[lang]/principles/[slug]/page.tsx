import { getPostBySlug } from '@/lib/api'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { PageProps } from '@/types/page'
import Image from 'next/image'

interface PostParams {
  lang: string
  slug: string
}

interface PostProps {
  params: PostParams
}

export default async function Post({ params }: PostProps) {
  const { lang, slug } = params
  const post = getPostBySlug('principles', lang, slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'coverImage',
    'excerpt',
  ])

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="text-gray-600 mb-8">
          {new Date(post.date).toLocaleDateString(lang, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
        <div className="relative aspect-video mb-8">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
      </div>
      
      <div className="prose prose-lg max-w-none">
        <MDXRemote source={post.content} />
      </div>
    </article>
  )
}
