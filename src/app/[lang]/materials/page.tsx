import Link from 'next/link'
import { getDictionary } from '@/dictionaries/dictionaries'
import { getAllPosts } from '@/lib/api'
import { PageProps } from '@/types/page'
import { CoverImage } from '@/components/CoverImage'
import AdUnit from '@/components/AdUnit'
import Tags from '@/components/Tags'

export async function generateStaticParams() {
  // Folosim doar limbile pentru care avem conținut real
  return ['en', 'ro'].map((locale) => ({
    lang: locale
  }))
}

export default async function Materials({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const posts = getAllPosts('materials', lang, ['slug', 'title', 'excerpt', 'coverImage', 'date', 'tags'])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold mb-6">{dict.home.sections.materials.title}</h1>
        <AdUnit slot="1379423050" />
        <p className="text-xl text-gray-600 mb-12">{dict.home.sections.materials.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <div key={post.slug} className="mb-8">
            <Link
              href={`/${lang}/${post.slug}`}
              className="group"
              prefetch={false}
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
                <CoverImage
                  title={post.title}
                  src={post.coverImage}
                  className="mb-4"
                  sizes="(min-width: 1024px) 384px, (min-width: 768px) 288px, 100vw"
                  priority={false} // List images don't need priority
                />
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-3 group-hover:text-gray-700 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600">{post.excerpt}</p>
                  <div className="mt-4 text-sm text-gray-500">
                    {post.date && new Date(post.date).toLocaleDateString(lang, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </Link>
            {post.tags && <Tags tags={post.tags} lang={lang} className="mt-3" />}
          </div>
        ))}
      </div>
    </div>
  )
}