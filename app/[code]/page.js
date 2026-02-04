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

  return (
    <>
      <Header />
      <main style={{ background: '#ffffff', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ maxWidth: '500px', width: '100%', textAlign: 'left' }}>
          
          {/* Judul Kecil & Rapi */}
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '16px', color: '#000' }}>
            You are being redirected to:
          </h2>

          {/* Box URL Minimalis - Tidak Terlalu Bulat */}
          <div style={{ 
            background: '#111', 
            padding: '16px', 
            borderRadius: '8px', 
            fontFamily: 'monospace', 
            fontSize: '0.85rem', 
            color: '#fff',
            wordBreak: 'break-all',
            marginBottom: '20px',
            lineHeight: '1.4',
            border: '1px solid #333'
          }}>
            {data.original_url}
          </div>

          {/* Teks Deskripsi - Ukuran Font Standar agar tidak tumpang tindih */}
          <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: '#333', marginBottom: '24px' }}>
            This link was created by a <strong>public user</strong>. Please check the destination link above before proceeding. We never ask for your sensitive details.
          </p>

          {/* Tombol Aksi - Rapi & Sejajar */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="/" style={{ 
              flex: 1, 
              textAlign: 'center', 
              padding: '14px', 
              background: '#222', 
              color: '#fff', 
              borderRadius: '8px', 
              textDecoration: 'none', 
              fontSize: '0.9rem', 
              fontWeight: '700' 
            }}>
              Back
            </a>
            <a 
              href={`/${code}?a=confirm`}
              id="actionBtn"
              style={{ 
                flex: 1, 
                textAlign: 'center', 
                padding: '14px', 
                background: '#fff', 
                color: '#000', 
                borderRadius: '8px', 
                textDecoration: 'none', 
                fontSize: '0.9rem', 
                fontWeight: '700',
                border: '1px solid #ddd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              Continue <span style={{fontSize: '18px'}}>→</span>
            </a>
          </div>

          {/* Footer Info Kecil */}
          <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
            <p style={{ fontSize: '0.75rem', color: '#888', lineHeight: '1.4' }}>
              💡 If you received this link via suspicious email or message, please double check before continuing. Report this link if you find it suspicious.
            </p>
          </div>

        </div>

        {/* Script Otomatis URL & Cookie 10 Menit */}
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
