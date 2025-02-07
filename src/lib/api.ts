import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

const postsDirectory = join(process.cwd(), 'src/content')

export function getPostSlugs(category: string, lang: string) {
  const categoryPath = join(postsDirectory, category, lang)
  const enPath = join(postsDirectory, category, 'en')

  console.log('Looking for posts in:', { categoryPath, enPath })

  // If the language directory doesn't exist, use English
  if (!fs.existsSync(categoryPath)) {
    console.log('Category path does not exist:', categoryPath)
    if (!fs.existsSync(enPath)) {
      console.log('English path does not exist:', enPath)
      return []
    }
    console.log('Using English posts')
    return fs.readdirSync(enPath)
  }

  // Get posts in the requested language
  const langPosts = fs.readdirSync(categoryPath)
  console.log('Found posts in language directory:', langPosts)

  // If English is not the requested language, also get English posts that don't exist in the requested language
  if (lang !== 'en' && fs.existsSync(enPath)) {
    const enPosts = fs.readdirSync(enPath)
    console.log('Found English posts:', enPosts)
    const langPostsSet = new Set(langPosts)
    const additionalPosts = enPosts.filter(post => !langPostsSet.has(post))
    console.log('Additional posts from English:', additionalPosts)
    return [...langPosts, ...additionalPosts]
  }

  return langPosts
}

export function getPostBySlug(category: string, lang: string, slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.mdx$/, '').replace(/\.md$/, '');
  const possibleLangPaths = [
    join(postsDirectory, category, lang, `${realSlug}.mdx`),
    join(postsDirectory, category, lang, `${realSlug}.md`)
  ];
  let filePath = possibleLangPaths.find(p => fs.existsSync(p));
  if (!filePath) {
    const fallbackPaths = [
      join(postsDirectory, category, 'en', `${realSlug}.mdx`),
      join(postsDirectory, category, 'en', `${realSlug}.md`)
    ];
    filePath = fallbackPaths.find(p => fs.existsSync(p));
  }
  if (!filePath) {
    throw new Error(`Post not found for slug: ${slug}`);
  }

  const fileContents = fs.readFileSync(filePath, 'utf8')
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
  console.log('Found slugs:', slugs)
  const posts = slugs
    .map((slug) => {
      try {
        const post = getPostBySlug(category, lang, slug, fields)
        console.log('Processing post:', { slug, date: post.date })
        return post
      } catch (error) {
        console.error('Error processing post:', slug, error)
        return null
      }
    })
    .filter((post): post is NonNullable<typeof post> => post !== null)
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  console.log('Final sorted posts:', posts.map(p => ({ slug: p.slug, date: p.date })))
  return posts
}
