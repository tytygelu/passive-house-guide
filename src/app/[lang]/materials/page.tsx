import Link from 'next/link'
import Image from 'next/image'
import { getDictionary } from '@/dictionaries/dictionaries'
import { getAllPosts } from '@/lib/api'
import { PageProps } from '@/types/page'
import { i18n } from '@/lib/i18n-config'

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({
    lang: locale
  }))
}

export default async function Materials({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const posts = getAllPosts('materials', lang, ['slug', 'title', 'excerpt', 'coverImage', 'date'])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold mb-6">{dict.home.sections.materials.title}</h1>
        <p className="text-xl text-gray-600 mb-12">{dict.home.sections.materials.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post, index) => (
          <Link key={post.slug} href={`/${lang}/materials/${post.slug}`} className="group" prefetch={false}>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
              <div className="relative h-48 w-full">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-3 group-hover:text-gray-700 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600">{post.excerpt}</p>
                <div className="mt-4 text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString(lang, {
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