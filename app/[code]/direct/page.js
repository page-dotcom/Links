import { supabase } from '../../../lib/supabase';
import { redirect, notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DirectRedirect({ params }) {
  const { code } = params;

  const { data } = await supabase.from('links').select('original_url, id').eq('slug', code).single();
  if (!data) notFound();

  // Catat klik dan lempar
  await supabase.rpc('increment_clicks', { row_id: data.id });
  return redirect(data.original_url);
}
