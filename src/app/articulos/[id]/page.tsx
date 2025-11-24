import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import ShareButtons from '@/components/ShareButtons'
import OptimizedImage from '@/components/OptimizedImage'
import Breadcrumbs from '@/components/Breadcrumbs'
import AdSenseAd from '@/components/AdSenseAd'
import DynamicAd from '@/components/DynamicAd'
import { getCategorySlug } from '@/utils/categoryUtils'
import { ADSENSE_CONFIG } from '@/lib/constants'
// import DOMPurify from 'isomorphic-dompurify'
import { Article, ArticleSummary, Category } from '@/lib/types/app'

interface ArticlePageProps {
  params: Promise<{ id: string }>
}

// Función para generar metadatos dinámicos
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const resolvedParams = await params
  const { id } = resolvedParams
  const supabase = await createClient()

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

  let query = supabase
    .from('articles')
    .select(`
      id,
      title,
      excerpt,
      content,
      image_url,
      created_at,
      published_at,
      categories (
        name
      )
    `)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())

  if (isUuid) {
    query = query.eq('id', id)
  } else {
    query = query.eq('slug', id)
  }

  const { data: article } = await query.single()

  if (!article) {
    return {
      title: 'Artículo no encontrado | Las Informaciones con Leyni',
      description: 'El artículo que buscas no existe o ha sido eliminado.'
    }
  }

  const categoryName = Array.isArray(article.categories) 
    ? article.categories[0]?.name 
    : (article.categories as Category)?.name || 'Noticias'

  const cleanExcerpt = article.excerpt?.replace(/<[^>]*>/g, '') || article.title
  const publishDate = new Date(article.published_at || article.created_at).toISOString()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lasinformacionesconleyni.com'

  return {
    title: `${article.title} | Las Informaciones con Leyni`,
    description: cleanExcerpt.substring(0, 155) + (cleanExcerpt.length > 155 ? '...' : ''),
    keywords: [
      article.title.split(' ').slice(0, 5).join(', '),
      categoryName,
      'noticias',
      'República Dominicana',
      'Las Informaciones con Leyni'
    ].join(', '),
    authors: [{ name: 'Redacción Las Informaciones con Leyni' }],
    category: categoryName,
    openGraph: {
      title: article.title,
      description: cleanExcerpt.substring(0, 155),
      type: 'article',
      publishedTime: publishDate,
      authors: ['Redacción Las Informaciones con Leyni'],
      section: categoryName,
      tags: [categoryName, 'noticias', 'República Dominicana'],
      url: `${siteUrl}/articulos/${id}`,
      siteName: 'Las Informaciones con Leyni',
      locale: 'es_ES',
      images: article.image_url ? [
        {
          url: article.image_url,
          width: 1200,
          height: 630,
          alt: article.title,
          type: 'image/jpeg'
        }
      ] : [
        {
          url: `${siteUrl}/og-default.jpg`,
          width: 1200,
          height: 630,
          alt: 'Las Informaciones con Leyni',
          type: 'image/jpeg'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: cleanExcerpt.substring(0, 155),
      creator: '@LasinformacionesLD',
      site: '@LasinformacionesLD',
      images: article.image_url ? [article.image_url] : [`${siteUrl}/og-default.jpg`]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    alternates: {
      canonical: `${siteUrl}/articulos/${id}`
    },
    other: {
      'article:published_time': publishDate,
      'article:modified_time': publishDate,
      'article:section': categoryName,
      'article:author': 'Redacción Las Informaciones con Leyni',
      'news_keywords': [categoryName, 'noticias', 'República Dominicana'].join(',')
    }
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const resolvedParams = await params
  const { id } = resolvedParams
  const supabase = await createClient()

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

  let query = supabase
    .from('articles')
    .select(`
      id,
      title,
      excerpt,
      content,
      slug,
      image_url,
      created_at,
      published_at,
      author_id,
      categories (
        id,
        name,
        color
      )
    `)
    .eq('status', 'published')
    .or(`published_at.lte.${new Date().toISOString()},published_at.is.null`)

  if (isUuid) {
    query = query.eq('id', id)
  } else {
    query = query.eq('slug', id)
  }

  // Obtener el artículo específico
  const { data: article, error } = await query.single() as { data: Article | null, error: unknown }

  if (error || !article) {
    notFound()
  }

  // Obtener artículos relacionados
  const { data: relatedArticles } = await supabase
    .from('articles')
    .select(`
      id,
      title,
      excerpt,
      slug,
      image_url,
      created_at,
      published_at,
      categories (
        id,
        name,
        color
      )
    `)
    .eq('status', 'published')
    .neq('id', article.id) // Use article.id here instead of param id which might be slug
    .or(`published_at.lte.${new Date().toISOString()},published_at.is.null`)
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(4) as { data: ArticleSummary[] | null }

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const dateFormatted = date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    const timeFormatted = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
    return `${dateFormatted}, ${timeFormatted}`
  }

  const getCategoryName = (categories: Category | Category[] | null | undefined) => {
    if (!categories) return 'General'
    if (Array.isArray(categories)) {
      return categories[0]?.name || 'General'
    }
    return categories?.name || 'General'
  }

  const sanitizeContent = (content: string) => {
    if (!content) return ''
    // Temporalmente deshabilitado para depuración
    return content
    /*
    try {
      return DOMPurify.sanitize(content)
    } catch (error) {
      console.error('Error sanitizing content:', error)
      return content
    }
    */
  }

  // Structured Data (JSON-LD) para SEO
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lasinformacionesconleyni.com'
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt?.replace(/<[^>]*>/g, '') || article.title,
    image: article.image_url ? [article.image_url] : [],
    datePublished: article.published_at || article.created_at,
    dateModified: article.published_at || article.created_at,
    author: {
      '@type': 'Organization',
      name: 'Las Informaciones con Leyni',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Las Informaciones con Leyni',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo2.jpg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/articulos/${id}`,
    },
    articleSection: getCategoryName(article.categories),
    inLanguage: 'es-ES',
  }

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* Breadcrumb Navigation */}
        <Breadcrumbs 
          items={[
            {
              label: getCategoryName(article.categories),
              href: `/categoria/${getCategorySlug(getCategoryName(article.categories))}`
            },
            {
              label: article.title
            }
          ]}
        />

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center space-x-4 mb-6 text-sm flex-wrap gap-2">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-sm font-medium uppercase tracking-wide">
                {getCategoryName(article.categories)}
              </span>
              <span className="text-gray-600">
                {formatDate(article.published_at || article.created_at)}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              {article.title}
            </h1>
            
            <p className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">
              {article.excerpt}
            </p>

            {/* Social Share Buttons */}
            <ShareButtons title={article.title} articleId={article.id} />
          </header>

          {/* Featured Image */}
          <div className="mb-8 relative">
            <div className="aspect-video relative image-container">
              <OptimizedImage 
                src={article.image_url || ''}
                alt={article.title}
                fill
                className="article-image"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                priority
              />
            </div>
          </div>

          {/* In-Article Ad */}
          <div className="my-8">
            <DynamicAd 
              slotKey="ARTICLE_TOP"
              adFormat="horizontal"
              className="bg-gray-100 border border-gray-200 p-2 rounded-sm"
            />
          </div>

          {/* Article Body */}
          <div className="bg-white rounded-sm shadow-sm border border-gray-200 p-8">
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-gray-800 leading-relaxed"
                style={{ 
                  fontSize: '18px', 
                  lineHeight: '1.7',
                  fontFamily: '"Georgia", "Times New Roman", serif'
                }}
                dangerouslySetInnerHTML={{ 
                  __html: sanitizeContent(article.content)
                }}
              />
            </div>
          </div>

          {/* Article Footer */}
          <footer className="mt-8 pt-8 border-t border-gray-200">
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Sobre esta publicación
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                Esta noticia fue publicada el {formatDate(article.created_at)} y forma parte de nuestra cobertura en la sección de {getCategoryName(article.categories)}.
              </p>
              <p className="text-xs text-gray-600">
                Para mantenerte informado sobre las últimas noticias, visita nuestra{' '}
                <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">página principal</Link> o suscríbete a nuestro boletín informativo.
              </p>
            </div>
          </footer>

          {/* Ad after article */}
          <div className="mt-8">
            <DynamicAd 
              slotKey="ARTICLE_BOTTOM"
              adFormat="horizontal"
              className="bg-gray-100 border border-gray-200 p-2 rounded-sm"
            />
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles && relatedArticles.length > 0 && (
          <section className="mt-12">
            <div className="bg-white rounded-sm shadow-sm border border-gray-200 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-600">
                Artículos Relacionados
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.slice(0, 3).map((relatedArticle) => (
                  <article key={relatedArticle.id} className="group border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 rounded-sm overflow-hidden">
                    <a href={`/articulos/${relatedArticle.id}`} className="block">
                      <div className="aspect-video bg-gray-200 relative overflow-hidden">
                        <OptimizedImage 
                          src={relatedArticle.image_url || ''} 
                          alt={relatedArticle.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3 text-xs">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-sm font-medium uppercase tracking-wide">
                            {getCategoryName(relatedArticle.categories)}
                          </span>
                          <span className="text-gray-500">{new Date(relatedArticle.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                          {relatedArticle.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
                          {relatedArticle.excerpt}
                        </p>
                        <span className="text-xs text-blue-600 font-medium flex items-center group-hover:translate-x-1 transition-transform">
                          Leer artículo
                          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
    </div>
  )
}