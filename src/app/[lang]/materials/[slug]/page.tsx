import { PageProps } from '@/types/page'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '@/lib/api'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { CoverImage } from '@/components/CoverImage'
import RelatedPosts from '@/components/RelatedPosts'
import Tags from '@/components/Tags'
import AdUnit from '@/components/AdUnit'

const languages = [
  'af', 'am', 'ar', 'az', 'be', 'bg', 'bn', 'bs', 'ca', 'cs', 'cy', 'da', 'de', 'el', 'en',
  'es', 'et', 'eu', 'fa', 'fi', 'fr', 'ga', 'gd', 'gl', 'gu', 'ha', 'he', 'hi', 'hr', 'hu',
  'hy', 'id', 'ig', 'is', 'it', 'ja', 'ka', 'kk', 'km', 'kn', 'ko', 'ku', 'ky', 'lb', 'lo',
  'lt', 'lv', 'mg', 'mi', 'mk', 'ml', 'mn', 'mr', 'ms', 'mt', 'my', 'nb', 'ne', 'nl', 'nn',
  'no', 'om', 'or', 'pa', 'pl', 'ps', 'pt', 'ro', 'ru', 'sd', 'si', 'sk', 'sl', 'sm', 'sn',
  'so', 'sq', 'sr', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'tk', 'tr', 'tt', 'ug', 'uk', 'ur',
  'uz', 'vi', 'yi', 'yo', 'zh', 'zu'
];

export async function generateStaticParams() {
  const params = [];
  // Get all posts in English first
  const enPosts = getAllPosts('materials', 'en', ['slug']);
  
  // Generate params for all languages using English posts as base
  for (const lang of languages) {
    for (const post of enPosts) {
      params.push({
        lang,
        slug: post.slug,
      });
    }
  }
  return params;
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
      'tags',
    ]);

    console.log('Post data:', { title: post?.title, tags: post?.tags });

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
        {post.tags && <Tags tags={post.tags} className="mt-8 mb-8" lang={lang} />}
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
