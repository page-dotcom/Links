import { supabase } from '../../lib/supabase';
import { redirect, notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const dynamic = 'force-dynamic';

export default async function RedirectPage({ params, searchParams }) {
  const { code } = params;
  const isConfirmAction = searchParams.a === 'confirm';
  
  // Ambil cookie server untuk cek skip
  const cookieStore = cookies();
  const hasConfirmed = cookieStore.get(`skip_${code}`);

  // 1. Ambil data dari database
  const { data } = await supabase.from('links').select('*').eq('slug', code).single();
  if (!data) notFound();

  // 2. Jika sudah konfirmasi atau ada cookie, langsung alihkan
  if (isConfirmAction || hasConfirmed) {
    await supabase.rpc('increment_clicks', { row_id: data.id });
    redirect(data.original_url);
  }

  return (
    <>
      <Header />
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '500px', 
          background: '#fff',
          padding: '40px',
          borderRadius: '8px', // Box profesional (tidak terlalu bulat)
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          
          <div style={{ marginBottom: '20px' }}>
            <span className="material-symbols-rounded" style={{ fontSize: '48px', color: '#3b82f6' }}>
              security
            </span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '12px', color: '#0f172a' }}>
            External Link Warning
          </h1>
          
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '32px' }}>
            You are leaving this site to an external URL. Please verify the destination before proceeding.
          </p>

          <div style={{ 
            background: '#f8fafc', 
            padding: '16px', 
            borderRadius: '4px', 
            fontSize: '0.9rem', 
            color: '#334155',
            wordBreak: 'break-all',
            marginBottom: '32px',
            fontFamily: 'monospace',
            textAlign: 'left',
            borderLeft: '4px solid #3b82f6'
          }}>
            <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}>DESTINATION:</span>
            {data.original_url}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <a 
              href={`/${code}?a=confirm`}
              id="confirmLink"
              style={{ 
                background: '#0f172a', 
                color: '#fff', 
                padding: '16px', 
                borderRadius: '6px', 
                textDecoration: 'none', 
                fontWeight: '700'
              }}
            >
              Continue to Link
            </a>
            <a href="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem' }}>Cancel</a>
          </div>
        </div>

        {/* Script untuk Otomatisasi URL & Cookies */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            // A. OTOMATIS TAMBAH ?a=confirm DI URL
            const url = new URL(window.location);
            if (!url.searchParams.has('a')) {
              url.searchParams.set('a', 'confirm');
              window.history.replaceState({}, '', url.toString());
            }

            // B. PASANG COOKIE SAAT KLIK
            document.getElementById('confirmLink').addEventListener('click', function() {
              document.cookie = "skip_${code}=true; max-age=600; path=/";
            });
          })();
        `}} />
      </main>
      <Footer />
    </>
  );
}
