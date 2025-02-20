import { getPostBySlug } from '@/lib/api'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { PageProps } from '@/types/page'
import { CoverImage } from '@/components/CoverImage'
import { notFound } from 'next/navigation'
import RelatedPosts from '@/components/RelatedPosts'
import AdUnit from '@/components/AdUnit'

export default async function Post({ params }: PageProps) {
  const { lang, slug } = await params;
  
  try {
    const post = getPostBySlug('principles', lang, slug, [
      'title',
      'date',
      'slug',
      'author',
      'content',
      'coverImage',
      'excerpt',
    ]);

    if (!post) {
      notFound();
    }

    return (
      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="text-gray-600 mb-8">
            {post.date && new Date(post.date).toLocaleDateString(lang, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          <div className="mb-8 text-lg">
            {post.excerpt}
          </div>
          <CoverImage 
            title={post.title}
            src={post.coverImage}
            className="mb-8"
          />
        </div>
        
        <div className="prose prose-lg max-w-none">
          {post.content && <MDXRemote source={post.content} />}
          <AdUnit slot="1379423050" />
        </div>
        <RelatedPosts 
          currentSlug={post.slug}
          lang={lang}
          category="principles"
          className="mt-12"
        />
      </article>
    )
  } catch {
    notFound()
  }
}
