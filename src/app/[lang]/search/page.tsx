import { getAllPosts } from '@/lib/api';
import SearchComponent from '@/components/SearchComponent';
import AdUnit from '@/components/AdUnit';

interface MinimalPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category?: string;
  tags?: string[];
}

interface RawPost {
  slug?: string;
  title?: string;
  excerpt?: string;
  date?: string;
  tags?: string[];
}

export async function generateStaticParams() {
  // Folosim doar limbile pentru care avem conținut real
  return ['en', 'ro', 'am'].map((locale) => ({
    lang: locale
  }));
}

export default async function SearchPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  
  // Get posts from both materials and principles and add a category field
  const materialsRaw: RawPost[] = getAllPosts('materials', lang, ['slug', 'title', 'excerpt', 'date', 'tags']) || [];
  const principlesRaw: RawPost[] = getAllPosts('principles', lang, ['slug', 'title', 'excerpt', 'date', 'tags']) || [];
  
  const materialsPosts: MinimalPost[] = materialsRaw
    .filter((post): post is RawPost & Required<Pick<RawPost, 'slug' | 'title' | 'excerpt' | 'date'>> => 
      post?.slug !== undefined && 
      post?.title !== undefined && 
      post?.excerpt !== undefined && 
      post?.date !== undefined
    )
    .map(post => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      date: post.date,
      category: 'materials',
      tags: post.tags
    }));
    
  const principlesPosts: MinimalPost[] = principlesRaw
    .filter((post): post is RawPost & Required<Pick<RawPost, 'slug' | 'title' | 'excerpt' | 'date'>> => 
      post?.slug !== undefined && 
      post?.title !== undefined && 
      post?.excerpt !== undefined && 
      post?.date !== undefined
    )
    .map(post => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      date: post.date,
      category: 'principles',
      tags: post.tags
    }));

  const posts = [...materialsPosts, ...principlesPosts];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold mb-6">Search</h1>
        <p className="text-xl text-gray-600 mb-12">Search our content</p>
        <AdUnit slot="1379423050" />
      </div>
      <div className="max-w-4xl mx-auto px-4">
        <SearchComponent posts={posts} lang={lang} />
        <AdUnit slot="1379423050" />
      </div>
    </div>
  );
}
