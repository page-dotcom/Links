import { supabase } from '../../lib/supabase';
import { redirect, notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const dynamic = 'force-dynamic';

export default async function RedirectPage({ params, searchParams }) {
  const { code } = params;
  const isConfirmAction = searchParams.a === 'confirm';
  
  // Cek cookie di sisi server
  const cookieStore = cookies();
  const hasConfirmed = cookieStore.get(`skip_${code}`);

  // 1. Ambil data dari Supabase
  const { data } = await supabase.from('links').select('*').eq('slug', code).single();
  if (!data) notFound();

  // 2. Logic: Jika sudah konfirmasi (klik tombol) atau punya cookie aktif, LANGSUNG REDIRECT
  if (isConfirmAction || hasConfirmed) {
    // Jalankan update klik secara background
    await supabase.rpc('increment_clicks', { row_id: data.id }); // Pake RPC biar gak tabrakan kliknya
    redirect(data.original_url);
  }

  // 3. Jika belum, tampilkan halaman jembatan yang bersih (Clean UI)
  return (
    <>
      <Header />
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '500px', 
          textAlign: 'center',
          background: '#fff',
          padding: '40px 30px',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.05)' 
        }}>
          <span className="material-symbols-rounded" style={{ fontSize: '48px', color: 'var(--accent)', marginBottom: '20px' }}>
            info
          </span>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '12px', color: '#0f172a' }}>
            You are being redirected
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '30px' }}>
            You are about to visit an external link created by a user. Please ensure the destination is safe.
          </p>

          <div style={{ 
            background: '#f8fafc', 
            padding: '16px', 
            borderRadius: '12px', 
            fontSize: '0.9rem', 
            color: '#1e293b',
            wordBreak: 'break-all',
            marginBottom: '30px',
            fontFamily: 'monospace'
          }}>
            {data.original_url}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Tombol Lanjutkan: Pasang Cookie & Redirect via Client */}
            <a 
              href={`/${code}?a=confirm`}
              id="confirmBtn"
              style={{ 
                background: 'var(--primary)', 
                color: '#fff', 
                padding: '16px', 
                borderRadius: '12px', 
                textDecoration: 'none', 
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              Continue to Destination
              <span className="material-symbols-rounded">arrow_forward</span>
            </a>
            
            <a href="/" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
              Cancel and go home
            </a>
          </div>
        </div>

        {/* Client Script: Pasang cookie saat tombol diklik */}
        <script dangerouslySetInnerHTML={{ __html: `
          document.getElementById('confirmBtn').addEventListener('click', function() {
            // Pasang cookie berlaku 10 menit (600 detik)
            document.cookie = "skip_${code}=true; max-age=600; path=/";
          });
        `}} />
      </main>
      <Footer />
    </>
  );
}
