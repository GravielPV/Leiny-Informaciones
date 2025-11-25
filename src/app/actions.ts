'use server'

import { createClient } from '@/lib/supabase/server'

export async function incrementArticleView(articleId: string) {
  const supabase = await createClient()
  
  try {
    // Intentamos usar una función RPC si existe (es lo ideal para contadores atómicos)
    const { error: rpcError } = await supabase.rpc('increment_article_views', { article_id: articleId })
    
    if (!rpcError) return

    // Si falla (no existe la función), hacemos el método manual (menos preciso con concurrencia alta pero funcional)
    const { data: article } = await supabase
      .from('articles')
      .select('views')
      .eq('id', articleId)
      .single()

    if (article) {
      const currentViews = article.views || 0
      await supabase
        .from('articles')
        .update({ views: currentViews + 1 })
        .eq('id', articleId)
    }
  } catch (error) {
    console.error('Error incrementing views:', error)
  }
}
