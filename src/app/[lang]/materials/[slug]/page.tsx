import { PageProps } from '@/types/page'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '@/lib/api'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'
import RelatedPosts from '@/components/RelatedPosts'

interface GenerateParams {
  params: {
    lang: string;
  };
}

export async function generateStaticParams({ params }: GenerateParams) {
  const { lang } = params;
  const posts = getAllPosts('materials', lang, ['slug']);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = getPostBySlug('materials', lang, slug, ['title', 'excerpt']);

  return {
    title: post?.title,
    description: post?.excerpt,
  };
}

export default async function MaterialPostPage({ params }: PageProps) {
  const { lang, slug } = await params;

  try {
    const post = getPostBySlug('materials', lang, slug, [
      'title',
      'date',
      'slug',
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
          <div className="relative aspect-video mb-8">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-cover rounded-lg"
              priority
            />
          </div>
        </div>
        <div className="prose prose-lg max-w-none">
          {post.content && <MDXRemote source={post.content} />}
        </div>
        <RelatedPosts 
          currentSlug={post.slug}
          lang={lang}
          category="materials"
          className="mt-12"
        />
      </article>
    );
  } catch {
    notFound();
  }
}
