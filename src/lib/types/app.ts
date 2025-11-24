import { Database } from './database'

export type CategoryRow = Database['public']['Tables']['categories']['Row']
export type ArticleRow = Database['public']['Tables']['articles']['Row']

export type Category = Pick<CategoryRow, 'id' | 'name' | 'color'>

export interface Article extends Pick<ArticleRow, 'id' | 'title' | 'content' | 'excerpt' | 'image_url' | 'created_at' | 'published_at' | 'author_id' | 'slug'> {
  categories: Category | Category[] | null
}

export interface ArticleSummary extends Omit<Article, 'content'> {}
