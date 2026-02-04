import { supabase } from '../../lib/supabase';
import { redirect, notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { siteConfig } from '../../lib/config';

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
      <main style={{ background: '#ffffff', minHeight: '100vh', color: '#1a1a1a', padding: '40px 20px' }}>
        <div style={{ maxWidth: '650px', margin: '0 auto' }}>
          
          {/* 1. Header Artikel - Font Adaptif agar tidak tumpang tindih */}
          <div style={{ marginBottom: '32px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
            <h1 style={{ 
              fontSize: 'clamp(1.5rem, 6vw, 2.2rem)', // Mengecil otomatis di layar kecil
              fontWeight: '850', 
              lineHeight: '1.2', 
              marginBottom: '12px', 
              color: '#0f172a',
              letterSpacing: '-0.03em' 
            }}>
              Security Brief: Review Your Destination Before Proceeding
            </h1>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>
              <span>Security Check</span>
              <span>•</span>
              <span>Redirect Verified</span>
            </div>
          </div>

          {/* 2. Box URL - Simpel & Bersih */}
          <section style={{ marginBottom: '48px' }}>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.6', color: '#475569', marginBottom: '24px' }}>
              You are about to be redirected to an external website. For your protection, please verify that the destination URL below is intended and safe.
            </p>

            <div style={{ 
              background: '#f8fafc', 
              padding: '20px', 
              borderRadius: '8px', 
              fontFamily: 'monospace', 
              fontSize: '0.9rem', 
              border: '1px solid #e2e8f0',
              wordBreak: 'break-all',
              color: '#1e293b',
              marginBottom: '32px',
              lineHeight: '1.5'
            }}>
              <span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8', marginBottom: '8px', fontWeight: '800' }}>DESTINATION URL</span>
              {data.original_url}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <a 
                href={`/${code}?a=confirm`}
                id="actionBtn"
                style={{ 
                  background: '#0f172a', 
                  color: '#fff', 
                  width: '100%',
                  textAlign: 'center',
                  padding: '16px', 
                  borderRadius: '12px', 
                  textDecoration: 'none', 
                  fontWeight: '700',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                Continue to Website
                <span className="material-symbols-rounded" style={{ fontSize: '20px' }}>arrow_forward</span>
              </a>
              <a href="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
                Cancel and return home
              </a>
            </div>
          </section>

          {/* 3. Artikel Edukasi - Rapi & SEO Friendly */}
          <article style={{ lineHeight: '1.8', color: '#334155', fontSize: '1rem', borderTop: '2px solid #f1f5f9', paddingTop: '40px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '16px', color: '#0f172a' }}>
              Why We Use Redirect Confirmation
            </h2>
            <p style={{ marginBottom: '20px' }}>
              Transparency is the core of <strong>{siteConfig.name}</strong>. Shortened links are convenient but can hide the final destination. This intermediate step ensures that you, the user, have full control over where you are going before any external code is executed in your browser.
            </p>
            
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px', color: '#0f172a' }}>
              Session Memory
            </h3>
            <p style={{ marginBottom: '20px' }}>
              Once you click "Continue", our system will securely remember your confirmation for the next 10 minutes. This allows you to access this specific link directly without seeing this security brief again during your current session.
            </p>

            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px', color: '#0f172a' }}>
              Your Privacy Matters
            </h3>
            <p>
              We prioritize your digital safety. We do not collect personal data on this page. Our only goal is to provide a clear, secure path to your destination while preventing automated phishing attempts on <strong>{siteConfig.domain}</strong>.
            </p>
          </article>
        </div>

        {/* Script Otomatisasi URL & Cookies */}
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
