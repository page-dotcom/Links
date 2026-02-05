import { supabase } from '../lib/supabase';
import { siteConfig } from '../lib/config';

// PENTING: Baris ini buat maksa Vercel update data sitemap tiap 10 detik
export const revalidate = 10;

export default async function sitemap() {
  const baseUrl = `https://www.${siteConfig.domain}`;

  try {
    // Ambil data terbaru dari Supabase, urutkan dari yang paling baru dibuat
    const { data: links } = await supabase
      .from('links')
      .select('slug, created_at')
      .order('created_at', { ascending: false });

    // 1. Daftar Halaman Statis
    const staticPages = [
      { 
        url: baseUrl, 
        lastModified: new Date(), 
        priority: 1 
      },
      { 
        url: `${baseUrl}/privacy`, 
        lastModified: new Date(), 
        priority: 0.8 
      },
      { 
        url: `${baseUrl}/terms`, 
        lastModified: new Date(), 
        priority: 0.8 
      },
    ];

    // 2. Daftar Shorten URL (Otomatis nambah kalo ada link baru di DB)
    const dynamicLinks = links?.map((link) => ({
      url: `${baseUrl}/${link.slug}`,
      lastModified: new Date(link.created_at || Date.now()),
      priority: 0.5,
    })) || [];

    // Gabungkan halaman statis dan link dinamis
    return [...staticPages, ...dynamicLinks];
  } catch (error) {
    console.error('Sitemap error:', error);
    return [];
  }
}
