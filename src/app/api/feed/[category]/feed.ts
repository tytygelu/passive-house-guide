import { Feed } from 'feed'
import { getAllPosts } from '@/lib/api'
import { languages } from '@/config/languages'

function normalizeDate(dateString: string): string {
  // Convert Bengali numerals to Arabic numerals
  const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
  let normalized = dateString
  bengaliNumerals.forEach((numeral, index) => {
    normalized = normalized.replace(new RegExp(numeral, 'g'), index.toString())
  })
  return normalized
}

function parseDate(dateString: string | undefined): Date {
  try {
    if (!dateString) {
      console.warn('No date provided')
      return new Date()
    }

    // Normalize date string
    const normalizedDate = normalizeDate(dateString)
    
    // Parse normalized date
    const date = new Date(normalizedDate)
    
    // Ensure the date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateString, 'normalized:', normalizedDate)
      return new Date() // Fallback to current date
    }

    // Test that the date can be converted to ISO string
    date.toISOString()
    
    return date
  } catch (error) {
    console.error('Error parsing date:', dateString, error)
    return new Date() // Fallback to current date
  }
}

export async function generateFeed(category: string) {
  if (!category || (category !== 'materials' && category !== 'principles')) {
    throw new Error('Invalid category')
  }

  const baseUrl = 'https://www.zeroenergy.casa'

  // Create the feed with your blog's info
  const feed = new Feed({
    title: `Zero Energy Casa - ${category.charAt(0).toUpperCase() + category.slice(1)}`,
    description: category === 'materials'
      ? 'Latest sustainable building materials and technologies'
      : 'Core principles of passive house construction',
    id: baseUrl,
    link: baseUrl,
    language: 'en',
    image: `${baseUrl}/og-image.png`,
    favicon: `${baseUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Zero Energy Casa`,
    updated: new Date(),
    generator: 'Zero Energy Casa RSS Feed',
    feedLinks: {
      rss2: `${baseUrl}/api/feed/${category}/rss`,
      json: `${baseUrl}/api/feed/${category}/json`,
      atom: `${baseUrl}/api/feed/${category}/atom`,
    },
  })

  // Get all posts for this category from all languages
  const allPosts = languages.flatMap(lang => {
    try {
      const posts = getAllPosts(category, lang, [
        'title',
        'excerpt',
        'content',
        'slug',
        'date',
        'coverImage',
      ])
      
      console.log('Posts from', lang, ':', posts.map(p => ({ slug: p.slug, date: p.date })))
      
      return posts.map(post => ({ ...post, lang }))
    } catch (error) {
      console.warn(`Could not get posts for language ${lang}:`, error)
      return []
    }
  })

  // Sort all posts by date
  const sortedPosts = allPosts.sort((a, b) => {
    const dateA = parseDate(a.date)
    const dateB = parseDate(b.date)
    return dateB.getTime() - dateA.getTime()
  })

  console.log('Found posts:', sortedPosts.length)
  console.log('Sample post dates:', sortedPosts.slice(0, 3).map(p => ({ 
    slug: p.slug, 
    originalDate: p.date,
    parsedDate: parseDate(p.date).toISOString() 
  })))

  // Add each post to the feed
  sortedPosts.forEach((post) => {
    // Skip posts that don't have required fields
    if (!post.title || !post.excerpt || !post.content || !post.slug || !post.lang) {
      console.warn('Skipping post due to missing required fields:', post.slug)
      return
    }

    const slug = post.slug.replace(/\.mdx?$/, '')
    const url = `${baseUrl}/${post.lang}/${category}/${slug}`
    const imageUrl = post.coverImage 
      ? (post.coverImage.startsWith('http') ? post.coverImage : `${baseUrl}${post.coverImage}`)
      : `${baseUrl}/og-image.png`

    const postDate = parseDate(post.date)
    console.log('Processing post:', { 
      slug: post.slug, 
      originalDate: post.date,
      parsedDate: postDate.toISOString() 
    })

    feed.addItem({
      title: `[${post.lang.toUpperCase()}] ${post.title}`,
      id: url,
      link: url,
      description: post.excerpt,
      content: post.content,
      author: [{
        name: 'Zero Energy Casa',
        link: baseUrl,
      }],
      date: postDate,
      image: imageUrl,
    })
  })

  return feed
}
