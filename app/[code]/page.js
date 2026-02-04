import { supabase } from '../../lib/supabase';
import { redirect, notFound } from 'next/navigation';
import { cookies } from 'next/headers'; // Ambil sistem cookie server
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const dynamic = 'force-dynamic';

export default async function RedirectPage({ params, searchParams }) {
  const { code } = params;
  const isConfirmAction = searchParams.a === 'confirm';
  const cookieStore = cookies();
  const hasConfirmed = cookieStore.get(`conf_${code}`);

  // 1. Cari data slug
  const { data } = await supabase.from('links').select('*').eq('slug', code).single();
  if (!data) notFound();

  // 2. Logic: Langsung Alihkan jika sudah konfirmasi (via URL atau Cookie)
  if (isConfirmAction || hasConfirmed) {
    // Update klik tetap jalan
    const newClicks = (data.clicks || 0) + 1;
    await supabase.from('links').update({ clicks: newClicks }).eq('id', data.id);
    
    redirect(data.original_url);
  }

  // 3. Tampilkan Halaman Konfirmasi (Jika belum konfirmasi)
  return (
    <>
      <Header />
      <main style={{ padding: '60px 20px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: '500px', width: '100%', background: '#000', color: '#fff', padding: '30px', borderRadius: '16px' }}>
          <h2 style={{ marginBottom: '20px' }}>You are about to be redirected to:</h2>
          
          <div style={{ background: '#222', padding: '15px', borderRadius: '8px', wordBreak: 'break-all', marginBottom: '20px', border: '1px solid #444' }}>
            <code style={{ color: '#aaa' }}>{data.original_url}</code>
          </div>

          <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '30px' }}>
            This link was created by a public user. Please check the URL above before proceeding. 
            We never ask for your sensitive information.
          </p>

          <div style={{ display: 'flex', gap: '15px' }}>
            <a href="/" style={{ flex: 1, textAlign: 'center', padding: '15px', background: '#333', color: '#fff', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold' }}>
              Go Back
            </a>
            {/* Tombol Lanjutkan - Menuju URL yang sama + parameter & pasang cookie via client script */}
            <a 
              href={`/${code}?a=confirm`} 
              onClick={`document.cookie = "conf_${code}=true; max-age=600; path=/";`}
              style={{ flex: 1, textAlign: 'center', padding: '15px', background: '#fff', color: '#000', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold' }}
            >
              Continue →
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
