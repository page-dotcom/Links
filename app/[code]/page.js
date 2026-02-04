import { supabase } from '../../lib/supabase'; // WAJIB ../../ karena naik 2 folder
import { redirect } from 'next/navigation';

export default async function RedirectPage({ params }) {
  const { code } = params;
  
  // Ambil data pake kolom 'slug' sesuai database baru lo
  const { data } = await supabase
    .from('links')
    .select('*')
    .eq('slug', code)
    .single();

  if (data) {
    // Update jumlah klik di database
    await supabase.from('links').update({ clicks: (data.clicks || 0) + 1 }).eq('id', data.id);
    redirect(data.original_url);
  }

  return <div style={{ textAlign: 'center', marginTop: '100px' }}>{"404 - Link Gak Ada!"}</div>;
}
