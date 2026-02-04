import { supabase } from '../lib/supabase';
import { redirect } from 'next/navigation';

export default async function RedirectPage({ params }) {
  const { code } = params;
  const { data } = await supabase.from('links').select('*').eq('slug', code).single();
  if (data) {
    await supabase.from('links').update({ clicks: (data.clicks || 0) + 1 }).eq('id', data.id);
    redirect(data.original_url);
  }
  return <div style={{ textAlign: 'center', marginTop: '100px' }}>{"404 - Link Gak Ada!"}</div>;
}
