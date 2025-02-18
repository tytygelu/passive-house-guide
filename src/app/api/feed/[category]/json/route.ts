import { generateFeed } from '../feed'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params
    const feed = await generateFeed(category)
    return new NextResponse(feed.json1(), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error generating JSON feed:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
