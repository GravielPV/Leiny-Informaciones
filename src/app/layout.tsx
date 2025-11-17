import { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ConditionalLayout from '@/components/ConditionalLayout'
import GlobalErrorHandler from '@/components/GlobalErrorHandler'
import ScrollToTop from '@/components/ScrollToTop'
import PageTransition from '@/components/PageTransition'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://lasinformacionesconleyni.com'),
  title: {
    default: 'Las Informaciones con Leyni - Noticias Actualizadas',
    template: '%s | Las Informaciones con Leyni'
  },
  description: 'Mantente informado con las últimas noticias de República Dominicana y el mundo. Periodismo independiente, veraz y responsable las 24 horas.',
  keywords: [
    'noticias',
    'República Dominicana',
    'periodismo',
    'actualidad',
    'política',
    'deportes',
    'entretenimiento',
    'economía',
    'última hora'
  ],
  authors: [{ name: 'Las Informaciones con Leyni' }],
  creator: 'Las Informaciones con Leyni',
  publisher: 'Las Informaciones con Leyni',
  icons: {
    icon: '/logo2.jpg',
    shortcut: '/logo2.jpg',
    apple: '/logo2.jpg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_DO',
    url: 'https://lasinformacionesconleyni.com',
    siteName: 'Las Informaciones con Leyni',
    title: 'Las Informaciones con Leyni - Noticias Actualizadas',
    description: 'Portal de noticias líder en República Dominicana. Información actualizada las 24 horas.',
    images: [
      {
        url: '/logo2.jpg',
        width: 1200,
        height: 630,
        alt: 'Las Informaciones con Leyni',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Las Informaciones con Leyni',
    description: 'Portal de noticias líder en República Dominicana',
    creator: '@lasinformacionesconleyni',
    images: ['/logo2.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'news',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`} suppressHydrationWarning={true}>
        <GlobalErrorHandler />
        <PageTransition />
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        <ScrollToTop />
      </body>
    </html>
  );
}
