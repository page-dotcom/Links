import { supabase } from '../../lib/supabase';
import { redirect } from 'next/navigation';

// WAJIB: Biar gak kena cache Vercel, jadi setiap klik beneran kehitung
export const dynamic = 'force-dynamic';

export default async function RedirectPage({ params }) {
  const { code } = params;

  // 1. Cari datanya dulu
  const { data } = await supabase
    .from('links')
    .select('*')
    .eq('slug', code)
    .single();

  if (data) {
    // 2. Update jumlah klik pake cara yang lebih aman (increment)
    // Kita ambil klik yang sekarang, tambah 1
    const jumlahKlikBaru = (data.clicks || 0) + 1;

    await supabase
      .from('links')
      .update({ clicks: jumlahKlikBaru })
      .eq('id', data.id);

    // 3. Lempar ke URL asli
    redirect(data.original_url);
  }

  // Kalau slug gak ada
  return (
    <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}>
      <h1>{"404"}</h1>
      <p>{"Link gak ada atau sudah dihapus!"}</p>
      <a href="/">{"Balik ke Home"}</a>
    </div>
  );
}
