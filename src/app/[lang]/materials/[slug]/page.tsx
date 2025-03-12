import { PageProps } from '@/types/page'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '@/lib/api'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { CoverImage } from '@/components/CoverImage'
import RelatedPosts from '@/components/RelatedPosts'
import Tags from '@/components/Tags'
import AdUnit from '@/components/AdUnit'

export async function generateStaticParams() {
  // Folosim doar limbile pentru care avem conținut real
  const languages = ['en']; // Adaugă alte limbi doar dacă există conținut pentru ele
  
  const paths = [];
  
  for (const lang of languages) {
    // Get all posts from materials category
    const posts = getAllPosts('materials', lang, ['slug']);
    
    // Create paths for each post
    for (const post of posts) {
      paths.push({
        lang,
        slug: post.slug,
      });
    }
  }

  return paths;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  
  try {
    const post = getPostBySlug('materials', lang, slug, ['title', 'excerpt', 'coverImage']);
    
    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: [post.coverImage],
      },
    };
  } catch {
    return {
      title: 'Post not found',
    };
  }
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
            priority={true} // Main article image should have priority
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
