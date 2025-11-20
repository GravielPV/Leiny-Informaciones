import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] })
    }

    const supabase = await createClient()

    const { data: articles, error } = await supabase
      .from('articles')
      .select(`
        id, 
        title, 
        slug, 
        image_url, 
        published_at, 
        categories (
          name, 
          slug
        )
      `)
      .eq('status', 'published')
      .ilike('title', `%${query}%`)
      .order('published_at', { ascending: false })
      .limit(5)

    if (error) {
      console.error('Supabase search error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform the data to match the expected frontend format
    const formattedArticles = articles?.map(article => ({
      ...article,
      category: Array.isArray(article.categories) ? article.categories[0] : article.categories
    }))

    return NextResponse.json({ results: formattedArticles || [] })
  } catch (error) {
    console.error('Server search error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 })
  }
}
