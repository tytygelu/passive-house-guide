import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

const postsDirectory = join(process.cwd(), 'src/content')

export function getPostSlugs(category: string, lang: string) {
  const categoryPath = join(postsDirectory, category, lang)
  const enPath = join(postsDirectory, category, 'en')

  // If the language directory doesn't exist, use English
  if (!fs.existsSync(categoryPath)) {
    if (!fs.existsSync(enPath)) {
      return []
    }
    return fs.readdirSync(enPath)
  }

  // Get posts in the requested language
  const langPosts = fs.readdirSync(categoryPath)

  // If English is not the requested language, also get English posts that don't exist in the requested language
  if (lang !== 'en' && fs.existsSync(enPath)) {
    const enPosts = fs.readdirSync(enPath)
    const langPostsSet = new Set(langPosts)
    const additionalPosts = enPosts.filter(post => !langPostsSet.has(post))
    return [...langPosts, ...additionalPosts]
  }

  return langPosts
}

export function getPostBySlug(category: string, lang: string, slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.mdx$/, '')
  const fullPath = join(postsDirectory, category, lang, `${realSlug}.mdx`)
  
  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    // If file doesn't exist in requested language, try English
    const enPath = join(postsDirectory, category, 'en', `${realSlug}.mdx`)
    if (!fs.existsSync(enPath)) {
      throw new Error(`Post not found: ${fullPath}`)
    }
    return getPostBySlug(category, 'en', slug, fields)
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  type Items = {
    [key: string]: string
  }

  const items: Items = {}

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug
    }
    if (field === 'content') {
      items[field] = content
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field]
    }
  })

  return items
}

export function getAllPosts(category: string, lang: string, fields: string[] = []) {
  const slugs = getPostSlugs(category, lang)
  const posts = slugs
    .map((slug) => {
      try {
        return getPostBySlug(category, lang, slug, fields)
      } catch {
        return null
      }
    })
    .filter((post): post is NonNullable<typeof post> => post !== null)
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return posts
}
