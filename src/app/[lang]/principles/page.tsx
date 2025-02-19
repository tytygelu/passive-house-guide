import { getDictionary } from '@/dictionaries/dictionaries'
import { PageProps } from '@/types/page'
import { getAllPosts } from '@/lib/api'
import Link from 'next/link'
import { CoverImage } from '@/components/CoverImage'
import { i18n } from '@/lib/i18n-config'

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({
    lang: locale
  }))
}

export default async function PrinciplesPage({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const posts = getAllPosts('principles', lang, ['slug', 'title', 'excerpt', 'coverImage', 'date'])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">{dict.home.sections.principles.title}</h1>
      <p className="text-xl text-gray-600 mb-12">{dict.home.sections.principles.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <Link 
            key={post.slug}
            href={`/${lang}/principles/${post.slug}`}
            className="group"
            prefetch={false}
          >
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
              <CoverImage
                title={post.title}
                src={post.coverImage}
                className="mb-4"
                sizes="(min-width: 1024px) 384px, (min-width: 768px) 288px, 100vw"
                priority={post.slug === 'ventilation'}
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-3 group-hover:text-gray-700 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600">
                  {post.excerpt}
                </p>
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
        ))}
      </div>
    </div>
  )
}