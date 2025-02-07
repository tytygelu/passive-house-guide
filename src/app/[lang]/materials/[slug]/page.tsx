/* eslint-disable @typescript-eslint/no-explicit-any */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '@/lib/api'
import PageTransition from '@/components/PageTransition'
import Image from 'next/image'
import PreloadCoverImage from '@/components/PreloadCoverImage'
// If you are using MDX, you might import a MDX component; adjust based on your setup
import { MDXRemote } from 'next-mdx-remote/rsc'

export async function generateStaticParams({ params }: any) {
  // Generate params for each material post in the given language
  const posts = getAllPosts('materials', params.lang, ['slug']);
  return posts.map((post: any) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = getPostBySlug('materials', lang, slug, ['title', 'excerpt']);
  if (!post) {
    return { title: 'Not Found' };
  }
  return {
    title: post.title,
    description: post.excerpt || ''
  };
}

export default async function MaterialPostPage({ params }: any) {
  const { lang, slug } = await params;
  const post = getPostBySlug('materials', lang, slug, ['title', 'date', 'coverImage', 'content']);
  if (!post) {
    notFound();
  }

  return (
    <>
      <PreloadCoverImage coverImage={post.coverImage} />
      <PageTransition>
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
            {post.coverImage && (
              <div className="relative aspect-video mb-8">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="100vw"
                  className="object-cover rounded-lg"
                />
              </div>
            )}
          </div>
          <div className="prose prose-lg max-w-none">
            <MDXRemote source={post.content} />
          </div>
        </article>
      </PageTransition>
    </>
  );
}
