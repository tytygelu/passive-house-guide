import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { Post } from '@/types/post'

const postsDirectory = join(process.cwd(), 'src/content')

export function getPostSlugs(category: string, lang: string) {
  const language = lang === 'ua' ? 'uk' : lang;
  const categoryPath = join(postsDirectory, category, language)
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
  if (language !== 'en' && fs.existsSync(enPath)) {
    const enPosts = fs.readdirSync(enPath)
    console.log('Found English posts:', enPosts)
    const langPostsSet = new Set(langPosts)
    const additionalPosts = enPosts.filter(post => !langPostsSet.has(post))
    console.log('Additional posts from English:', additionalPosts)
    return [...langPosts, ...additionalPosts]
  }

  return langPosts
}

export function getPostBySlug(category: string, lang: string, slug: string, fields: string[] = []): Post {
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
    if (!filePath) {
      throw new Error(`Could not find post for slug: ${slug} in language: ${lang}`);
    }
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  const items = {
    slug: realSlug,
  } as Post;

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items.slug = realSlug;
    }
    if (field === 'content') {
      items.content = content;
    }

    if (typeof data[field] !== 'undefined') {
      // Type assertion to allow dynamic property assignment
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (items as any)[field] = data[field];
    }
  });

  return items;
}

export function findPostAcrossCategories(lang: string, slug: string, fields: string[] = []): { post: Post, category: string } {
  const categories = ['materials', 'principles'];
  
  for (const category of categories) {
    try {
      const post = getPostBySlug(category, lang, slug, fields);
      return { post, category };
    } catch {
      // Continue to the next category
    }
  }
  
  throw new Error(`Could not find post for slug: ${slug} in any category for language: ${lang}`);
}

export function getAllPosts(category: string, lang: string, fields: string[] = []): Post[] {
  const slugs = getPostSlugs(category, lang)
  console.log('Found slugs:', slugs)
  // Always include date in the fields array if not already present
  const fieldsWithDate = fields.includes('date') ? fields : [...fields, 'date']
  const posts = slugs
    .map((slug) => {
      try {
        const post = getPostBySlug(category, lang, slug, fieldsWithDate)
        console.log('Processing post:', { slug, date: post.date })
        return post
      } catch (error) {
        console.error('Error processing post:', slug, error)
        return null
      }
    })
    .filter((post): post is NonNullable<typeof post> => post !== null)
    // sort posts by date in descending order, handling undefined dates
    .sort((post1, post2) => {
      if (!post1.date) return 1
      if (!post2.date) return -1
      return post1.date > post2.date ? -1 : 1
    })
  console.log('Final sorted posts:', posts.map(p => ({ slug: p.slug, date: p.date })))
  return posts
}

export function getSimilarPosts(category: string, lang: string, currentSlug: string): Post[] {
  const fields = ['slug', 'title', 'excerpt', 'coverImage']
  // Get posts from current category
  const sameCategoryPosts = getAllPosts(category, lang, fields)
    .filter(post => post.slug !== currentSlug)
    .slice(0, 3)

  // If we have enough posts from the same category, return them
  if (sameCategoryPosts.length >= 3) {
    return sameCategoryPosts
  }

  // Otherwise, get posts from the other category
  const otherCategory = category === 'materials' ? 'principles' : 'materials'
  const otherCategoryPosts = getAllPosts(otherCategory, lang, fields)
    .slice(0, 3 - sameCategoryPosts.length)

  // Combine posts from both categories
  return [...sameCategoryPosts, ...otherCategoryPosts]
}
