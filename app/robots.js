import { siteConfig } from '../lib/config';

export default function robots() {
  const baseUrl = `https://${siteConfig.domain}`;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Kita larang bot buat index URL yang ada parameternya biar gak duplikat
        disallow: [
          '/*?*',        // Larang semua URL yang ada tanda tanya (query parameter)
          '/api/',       // Larang akses ke folder API
          '/_next/',     // Larang akses ke folder internal Next.js
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
