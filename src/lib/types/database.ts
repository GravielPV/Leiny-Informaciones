export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          color?: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          color?: string | null
          created_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          title: string
          content: string
          excerpt: string | null
          slug: string
          image_url: string | null
          category_id: string
          author_id: string
          published: boolean
          status: string
          featured: boolean
          views: number
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          title: string
          content: string
          excerpt?: string | null
          slug: string
          image_url?: string | null
          category_id: string
          author_id: string
          published?: boolean
          status?: string
          featured?: boolean
          views?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          content?: string
          excerpt?: string | null
          slug?: string
          image_url?: string | null
          category_id?: string
          author_id?: string
          published?: boolean
          status?: string
          featured?: boolean
          views?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'publicista'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'publicista'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'publicista'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'publicista'
    }
  }
}

// Types for easier use
export type Article = Database['public']['Tables']['articles']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type User = Database['public']['Tables']['profiles']['Row']