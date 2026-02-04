import './globals.css';
import Script from 'next/script';
import { siteConfig } from '../lib/config';

// 1. Metadata API - Ini cara Next.js 14 handle SEO paling maksimal
export const metadata = {
  metadataBase: new URL(`https://${siteConfig.domain}`),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: `The professional URL shortener to shorten, share, and track your links with advanced analytics.`,
  keywords: ['URL shortener', 'link analytics', 'branded links', 'short links', 'click tracker'],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  
  // Open Graph (Facebook, WhatsApp, LinkedIn)
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `https://${siteConfig.domain}`,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: 'Shorten URLs and track real-time analytics with ease.',
    images: [
      {
        url: '/og-image.jpg', // Pastikan lo taruh file og-image.jpg di folder public
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} Analytics`,
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: 'Professional link shortener with real-time tracking.',
    images: ['/og-image.jpg'],
  },

  // Icon & Favicon
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png', // Opsional: taruh di folder public
  },

  // Robots
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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts & Icons dengan display=swap biar skor PageSpeed Ijo */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&display=swap" 
          rel="stylesheet" 
        />
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" 
        />
        
        {/* Library QR Code Lokal */}
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body style={{ margin: 0, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  );
}
