import { supabase } from '../lib/supabase';
import { siteConfig } from '../lib/config';

export default async function sitemap() {
  // Mengambil domain dari config lo biar gak hardcode
  const baseUrl = `https://${siteConfig.domain}`;

  try {
    // 1. Ambil semua link dari database Supabase
    const { data: links } = await supabase
      .from('links')
      .select('slug, created_at')
      .order('created_at', { ascending: false });

    // 2. Daftar Halaman Statis (Halaman Utama, Privacy, Terms)
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/privacy`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/terms`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
    ];

    // 3. Daftar Shorten URL (Hanya URL Bersih)
    // Kita gak masukin yang pake ?a=confirm biar gak dianggap duplikat oleh Google
    const dynamicLinks = links?.map((link) => ({
      url: `${baseUrl}/${link.slug}`,
      lastModified: new Date(link.created_at || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.5,
    })) || [];

    return [...staticPages, ...dynamicLinks];
  } catch (error) {
    console.error('Sitemap error:', error);
    return [];
  }
}
