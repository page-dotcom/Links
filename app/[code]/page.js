import { supabase } from '../../lib/supabase';
import { redirect, notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const dynamic = 'force-dynamic';

export default async function RedirectPage({ params, searchParams }) {
  const { code } = params;
  const isConfirmAction = searchParams.a === 'confirm';
  const cookieStore = cookies();
  const hasConfirmed = cookieStore.get(`skip_${code}`);

  const { data } = await supabase.from('links').select('*').eq('slug', code).single();
  if (!data) notFound();

  if (isConfirmAction || hasConfirmed) {
    await supabase.rpc('increment_clicks', { row_id: data.id });
    redirect(data.original_url);
  }

  const reportUrl = `https://www.google.com/safebrowsing/report_phish/?url=${encodeURIComponent(data.original_url)}`;

  return (
    <>
      <Header />
      <main style={{ background: '#000', minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '550px', width: '100%', color: '#fff' }}>
          
          {/* Judul Utama */}
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '16px' }}>
            Anda akan dialihkan ke:
          </h2>

          {/* Box URL - Gelap & Tajam */}
          <div style={{ 
            background: '#1a1a1a', 
            padding: '20px', 
            borderRadius: '8px', 
            fontFamily: 'monospace', 
            fontSize: '1rem', 
            color: '#fff',
            wordBreak: 'break-all',
            marginBottom: '24px',
            border: '1px solid #333'
          }}>
            {data.original_url}
          </div>

          {/* Teks Deskripsi Sesuai Contoh */}
          <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#fff', marginBottom: '32px' }}>
            Tautan ini dibuat oleh <strong>pengguna publik</strong>. Silakan periksa tautan di atas sebelum melanjutkan. <strong>Kami tidak pernah menanyakan informasi detail anda.</strong>
          </p>

          {/* Tombol Aksi */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
            <a href="/" style={{ 
              flex: 1, 
              textAlign: 'center', 
              padding: '18px', 
              background: '#222', 
              color: '#fff', 
              borderRadius: '8px', 
              textDecoration: 'none', 
              fontSize: '1rem', 
              fontWeight: '700' 
            }}>
              Kembali
            </a>
            <a 
              href={`/${code}?a=confirm`}
              id="actionBtn"
              style={{ 
                flex: 1, 
                textAlign: 'center', 
                padding: '18px', 
                background: '#fff', 
                color: '#000', 
                borderRadius: '8px', 
                textDecoration: 'none', 
                fontSize: '1rem', 
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              Lanjutkan <span className="material-symbols-rounded">arrow_forward</span>
            </a>
          </div>

          {/* Footer Info & Report */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#999', fontSize: '0.95rem', lineHeight: '1.5' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span className="material-symbols-rounded" style={{ fontSize: '20px' }}>lightbulb</span>
              <p>Jika Anda menerima tautan ini dalam bentuk email, panggilan telepon, atau pesan mencurigakan lainnya. Mohon memeriksa kembali atau tidak untuk melanjutkan. Laporkan tautan jika menurut Anda tautan ini mencurigakan.</p>
            </div>
            
            <a href={reportUrl} target="_blank" rel="noopener noreferrer" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              color: '#999', 
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              <span className="material-symbols-rounded">flag</span>
              Laporkan Tautan jika mencurigakan
            </a>
          </div>

        </div>

        {/* Script Logic URL & Cookie */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            const url = new URL(window.location);
            if (!url.searchParams.has('a')) {
              url.searchParams.set('a', 'confirm');
              window.history.replaceState({}, '', url);
            }
            document.getElementById('actionBtn').addEventListener('click', function() {
              document.cookie = "skip_${code}=true; max-age=600; path=/";
            });
          })();
        `}} />
      </main>
      <Footer />
    </>
  );
}
