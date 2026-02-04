import { supabase } from '../../lib/supabase';
import { redirect, notFound } from 'next/navigation';

// WAJIB: Biar setiap klik beneran kehitung & gak kena cache
export const dynamic = 'force-dynamic';

export default async function RedirectPage({ params }) {
  const { code } = params;

  // 1. Cari data slug di database
  const { data } = await supabase
    .from('links')
    .select('*')
    .eq('slug', code)
    .single();

  if (data) {
    // 2. Update jumlah klik (Increment)
    const newClicks = (data.clicks || 0) + 1;

    await supabase
      .from('links')
      .update({ clicks: newClicks })
      .eq('id', data.id);

    // 3. Redirect ke URL asli
    redirect(data.original_url);
  }

  // 4. Kalau slug GAK ADA, panggil fungsi notFound()
  // Ini bakal otomatis nampilin halaman mewah yang kita bikin di app/not-found.js
  notFound();
}
