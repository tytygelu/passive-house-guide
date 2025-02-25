import { PageProps } from '@/types/page'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllPosts, findPostAcrossCategories } from '@/lib/api'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { CoverImage } from '@/components/CoverImage'
import RelatedPosts from '@/components/RelatedPosts'
import AdUnit from '@/components/AdUnit'
import Tags from '@/components/Tags'

export async function generateStaticParams() {
  // Folosim doar limbile pentru care avem conținut real
  const languages = ['en', 'ro', 'am']; // Adaugă alte limbi doar dacă există conținut pentru ele
  
  const paths = [];
  
  for (const lang of languages) {
    // Get all posts from both categories
    const materialsPosts = getAllPosts('materials', lang, ['slug']);
    const principlesPosts = getAllPosts('principles', lang, ['slug']);
    
    // Combine posts from both categories
    const allPosts = [...materialsPosts, ...principlesPosts];
    
    // Create paths for each post
    for (const post of allPosts) {
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
    const { post } = findPostAcrossCategories(lang, slug, ['title', 'excerpt', 'coverImage']);
    
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

export default async function Post({ params }: PageProps) {
  const { lang, slug } = await params;
  
  try {
    const { post, category } = findPostAcrossCategories(lang, slug, [
      'title',
      'date',
      'slug',
      'author',
      'content',
      'coverImage',
      'excerpt',
      'tags',
    ]);

    return (
      <article className="mb-32">
        <div className="relative mb-8 md:mb-16 sm:mx-0">
          <CoverImage 
            title={post.title}
            src={post.coverImage}
            className="mb-8"
            priority={true} // Main article image should have priority
          />
        </div>
        
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 text-lg">
            <div className="mb-4 text-gray-500">
              {post.date && new Date(post.date).toLocaleDateString()}
            </div>
            {post.tags && <Tags tags={post.tags} lang={lang} className="mb-4" />}
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="prose prose-lg max-w-none">
            {post.content && <MDXRemote source={post.content} />}
            <AdUnit slot="1379423050" />
          </div>
          <RelatedPosts 
            currentSlug={post.slug}
            lang={lang}
            category={category}
          />
        </div>
      </article>
    );
  } catch {
    notFound();
  }
}
