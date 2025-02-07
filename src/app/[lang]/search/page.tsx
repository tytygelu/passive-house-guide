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
  const materialsRaw = getAllPosts('materials', lang, ['slug', 'title', 'excerpt', 'date']);
  const principlesRaw = getAllPosts('principles', lang, ['slug', 'title', 'excerpt', 'date']);
  const materialsPosts: MinimalPost[] = Array.isArray(materialsRaw) ? (materialsRaw.map((post) => ({ ...post, category: 'materials' })) as MinimalPost[]) : [];
  const principlesPosts: MinimalPost[] = Array.isArray(principlesRaw) ? (principlesRaw.map((post) => ({ ...post, category: 'principles' })) as MinimalPost[]) : [];

  const posts = [...materialsPosts, ...principlesPosts];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">{dict?.search?.title || 'Search'}</h1>
      <SearchComponent posts={posts} lang={lang} />
    </div>
  );
}
