import { supabase } from '../../lib/supabase';
import { redirect, notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Header from '../../components/Header';
import Footer from '../../components/Footer';


export const metadata = {
  title: 'Confirm to Proceed',
  description: 'Safety check before redirecting to the destination URL.',
  robots: 'noindex, follow', // Halaman jembatan jangan di-index Google biar gak nyampah, tapi link-nya tetep diikuti
};

export const dynamic = 'force-dynamic';export default async function RedirectPage({ params, searchParams }) {
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
      <main style={{ background: '#ffffff', minHeight: '100vh', color: '#1a1a1a', padding: '60px 20px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          
          {/* Bagian Atas: Heading Ala Artikel */}
          <header style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '20px', letterSpacing: '-0.02em' }}>
              Final Step: Review the Destination Link Before Proceeding
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#666', fontSize: '0.9rem' }}>
              <span>Security Check</span>
              <span>•</span>
              <span>Verified Redirect</span>
            </div>
          </header>

          {/* Bagian Utama: Info Link & Tombol */}
          <section style={{ marginBottom: '60px' }}>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', color: '#444', marginBottom: '30px' }}>
              You are currently being redirected to an external website. For your safety and to ensure transparency, 
              please confirm that you intend to visit the following address:
            </p>

            <div style={{ 
              background: '#f4f7f6', 
              padding: '24px', 
              borderRadius: '4px', 
              fontFamily: 'monospace', 
              fontSize: '1rem', 
              borderLeft: '4px solid #000',
              wordBreak: 'break-all',
              marginBottom: '40px'
            }}>
              {data.original_url}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
              <a 
                href={`/${code}?a=confirm`}
                id="actionBtn"
                style={{ 
                  background: '#000', 
                  color: '#fff', 
                  padding: '18px 40px', 
                  borderRadius: '30px', 
                  textDecoration: 'none', 
                  fontWeight: '700',
                  fontSize: '1.1rem',
                  transition: 'opacity 0.2s'
                }}
              >
                Continue to Website
              </a>
              <a href="/" style={{ color: '#666', textDecoration: 'underline', fontSize: '0.9rem' }}>
                Cancel and return home
              </a>
            </div>
          </section>

          {/* Bagian Artikel: Edukasi User */}
          <hr style={{ border: '0', borderTop: '1px solid #eee', marginBottom: '50px' }} />
          
          <article style={{ lineHeight: '1.8', color: '#333', fontSize: '1.1rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '20px' }}>Why am I seeing this confirmation page?</h2>
            <p style={{ marginBottom: '20px' }}>
              In the modern digital landscape, security is our top priority. Shortened URLs are powerful tools for sharing content, but they can sometimes mask the final destination. This confirmation page acts as a <strong>security bridge</strong>, giving you a moment to verify the link before your browser executes the redirect.
            </p>
            
            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '15px' }}>Protecting Your Digital Journey</h3>
            <p style={{ marginBottom: '20px' }}>
              By showing you the full URL, we empower you to identify potential phishing attempts or unwanted redirects. Once you click "Continue", we will remember your preference for 10 minutes, allowing you to access this specific link directly without seeing this page again during your current session.
            </p>

            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '15px' }}>Our Commitment to Privacy</h3>
            <p>
              We do not track your personal data on this page. Our system only records an anonymous "click" to provide analytics to the link creator, ensuring your privacy remains intact while giving creators the insights they need.
            </p>
          </article>
        </div>

        {/* Script Otomatisasi URL & Cookies */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            // 1. Ganti URL jadi ?a=confirm tanpa reload
            const url = new URL(window.location);
            if (!url.searchParams.has('a')) {
              url.searchParams.set('a', 'confirm');
              window.history.replaceState({}, '', url);
            }

            // 2. Pasang cookie saat tombol diklik
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
