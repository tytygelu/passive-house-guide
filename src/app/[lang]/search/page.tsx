import { getAllPosts } from '@/lib/api';
import { i18n } from '@/lib/i18n-config';
import { getDictionary } from '@/dictionaries/dictionaries';
import SearchComponent from '@/components/SearchComponent';

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
  return i18n.locales.map((locale) => ({
    lang: locale
  }));
}

export default async function SearchPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
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
      <h1 className="text-4xl font-bold mb-6">{ dict?.search?.title || 'Search' }</h1>
      <SearchComponent posts={posts} lang={lang} />
    </div>
  );
}
