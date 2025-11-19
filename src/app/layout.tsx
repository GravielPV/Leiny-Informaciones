import { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import ConditionalLayout from '@/components/ConditionalLayout'
import GlobalErrorHandler from '@/components/GlobalErrorHandler'
import ScrollToTop from '@/components/ScrollToTop'
import PageTransition from '@/components/PageTransition'
import { SITE_CONFIG, ADSENSE_CONFIG } from '@/lib/constants'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} - Noticias Actualizadas`,
    template: SITE_CONFIG.template
  },
  description: 'Mantente informado con las últimas noticias de República Dominicana y el mundo. Periodismo independiente, veraz y responsable las 24 horas.',
  keywords: SITE_CONFIG.keywords,
  authors: [SITE_CONFIG.authors],
  creator: SITE_CONFIG.authors.name,
  publisher: SITE_CONFIG.authors.name,
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
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} - Noticias Actualizadas`,
    description: SITE_CONFIG.description,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: 'Portal de noticias líder en República Dominicana',
    creator: SITE_CONFIG.social.twitter,
    images: [SITE_CONFIG.ogImage],
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
      <head>
      </head>
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`} suppressHydrationWarning={true}>
        {process.env.NODE_ENV === 'production' && (
          <Script 
            async 
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
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
