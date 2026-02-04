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

  // 1. Ambil data link
  const { data } = await supabase.from('links').select('*').eq('slug', code).single();
  if (!data) notFound();

  // 2. Logic: Jika sudah lewat proses konfirmasi atau ada cookie, LANGSUNG GAS
  if (isConfirmAction || hasConfirmed) {
    await supabase.rpc('increment_clicks', { row_id: data.id });
    redirect(data.original_url);
  }

  return (
    <>
      <Header />
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '550px', 
          textAlign: 'center',
          background: '#fff',
          padding: '50px 40px',
          borderRadius: '8px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          border: '1px solid #edf2f7'
        }}>
          <div style={{ marginBottom: '24px' }}>
            <span className="material-symbols-rounded" style={{ fontSize: '40px', color: 'var(--accent)' }}>
              verified_user
            </span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '16px', color: '#1a202c' }}>
            Security Verification
          </h1>
          
          <p style={{ color: '#718096', fontSize: '1rem', lineHeight: '1.6', marginBottom: '32px' }}>
            You are about to be redirected. Please confirm that you want to proceed to the destination below.
          </p>

          <div style={{ 
            background: '#f7fafc', 
            padding: '20px', 
            borderRadius: '6px', 
            fontSize: '0.9rem', 
            color: '#2d3748',
            wordBreak: 'break-all',
            marginBottom: '40px',
            fontFamily: 'monospace',
            border: '1px solid #e2e8f0',
            textAlign: 'left'
          }}>
            <span style={{ color: '#a0aec0', display: 'block', fontSize: '0.75rem', marginBottom: '4px', fontWeight: '700', textTransform: 'uppercase' }}>Redirecting to:</span>
            {data.original_url}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <a 
              href={`/${code}?a=confirm`}
              onClick={() => {
                document.cookie = `skip_${code}=true; max-age=600; path=/`;
              }}
              style={{ 
                background: '#0f172a', 
                color: '#fff', 
                padding: '18px', 
                borderRadius: '6px', 
                textDecoration: 'none', 
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              Continue to Link
              <span className="material-symbols-rounded">arrow_right_alt</span>
            </a>
            <a href="/" style={{ color: '#a0aec0', textDecoration: 'none', fontSize: '0.9rem' }}>Cancel</a>
          </div>
        </div>

        {/* SCRIPT OTOMATIS GANTI URL DI BROWSER */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            const url = new URL(window.location);
            if (!url.searchParams.has('a')) {
              url.searchParams.set('a', 'confirm');
              window.history.replaceState({}, '', url);
            }
          })();
        `}} />
      </main>
      <Footer />
    </>
  );
}
