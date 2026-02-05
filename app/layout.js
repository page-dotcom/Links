import './globals.css';
import Script from 'next/script';
import { siteConfig } from '../lib/config';

export const metadata = {
  metadataBase: new URL(`https://${siteConfig.domain}`),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: `Professional URL shortener to shorten, share, and track your links with advanced analytics.`,
  
  // INI CANONICAL TAG NYA (WAJIB BUAT SEO)
  alternates: {
    canonical: '/', 
  },

  keywords: ['URL shortener', 'link analytics', 'branded links', 'short links', 'click tracker'],
  authors: [{ name: siteConfig.name }],
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `https://${siteConfig.domain}`,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: 'Track real-time analytics for your shortened links.',
    images: [{
      url: 'https://i.ibb.co.com/bj8MRG2B/blog2-F63f7bfe24890332fa0e7bc492-Fimgac144d-e0eb-bdf4-4810-38bbad0b28d.png',
      width: 1200,
      height: 630,
    }],
  },

  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: 'Professional link shortener with real-time tracking.',
    images: ['https://i.ibb.co.com/bj8MRG2B/blog2-F63f7bfe24890332fa0e7bc492-Fimgac144d-e0eb-bdf4-4810-38bbad0b28d.png'],
  },

  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" />
        
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"
          strategy="lazyOnload" 
        />



         <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-REWSLF6H28"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-REWSLF6H28');
          `}
        </Script>   
      </head>
      <body style={{ margin: 0, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  );
}
