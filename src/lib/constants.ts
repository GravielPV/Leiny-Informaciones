export const SITE_CONFIG = {
  name: 'Las Informaciones con Leyni',
  template: '%s | Las Informaciones con Leyni',
  description: 'Portal líder de noticias en República Dominicana. Mantente informado con las últimas noticias de política, economía, deportes, sociedad y más. Información confiable y actualizada las 24 horas.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://lasinformacionesconleyni.com',
  ogImage: '/logo2.jpg',
  locale: 'es_DO',
  keywords: [
    'noticias República Dominicana',
    'noticias RD',
    'última hora',
    'política dominicana',
    'economía',
    'deportes',
    'Santo Domingo',
    'noticias actualizadas',
    'periodismo',
    'Las Informaciones con Leyni',
    'actualidad',
    'entretenimiento'
  ],
  authors: {
    name: 'Las Informaciones con Leyni',
    url: 'https://lasinformacionesconleyni.com',
  },
  social: {
    twitter: '@lasinformacionesconleyni',
  }
}

export const PAGINATION = {
  ARTICLES_PER_PAGE: 12
}
