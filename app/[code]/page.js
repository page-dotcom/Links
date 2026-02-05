import { supabase } from '../../lib/supabase';
import { redirect, notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const dynamic = 'force-dynamic';

// FUNGSI CLONE METADATA DARI SUMBER (URL TUJUAN)
export async function generateMetadata({ params }) {
  const { code } = params;
  const { data } = await supabase.from('links').select('original_url').eq('slug', code).single();
  
  if (!data) return { title: "Link Not Found" };

  try {
    // Ambil HTML dari URL tujuan untuk scraping metatag asli
    const response = await fetch(data.original_url, { next: { revalidate: 3600 } });
    const html = await response.text();

    // Regex sederhana untuk ambil Title, Description, dan Image asli
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const descMatch = html.match(/<meta name="description" content="(.*?)"/i) || html.match(/<meta property="og:description" content="(.*?)"/i);
    const imageMatch = html.match(/<meta property="og:image" content="(.*?)"/i);

    const remoteTitle = titleMatch ? titleMatch[1] : "Safe Redirect";
    const remoteDesc = descMatch ? descMatch[1] : data.original_url;
    const remoteImg = imageMatch ? imageMatch[1] : "/og-image.jpg";

    return {
      title: remoteTitle,
      description: remoteDesc,
      openGraph: {
        title: remoteTitle,
        description: remoteDesc,
        images: [remoteImg],
        url: data.original_url,
      },
      twitter: {
        card: "summary_large_image",
        title: remoteTitle,
        description: remoteDesc,
        images: [remoteImg],
      }
    };
  } catch (e) {
    return { title: "Secure Redirect", description: data.original_url };
  }
}

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
      <main style={{ background: '#ffffff', minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '500px', width: '100%', textAlign: 'left' }}>
          
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '16px', color: '#000' }}>
            You are being redirected to:
          </h2>

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

          <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: '#333', marginBottom: '24px' }}>
            This link was created by a <strong>public user</strong>. Please check the destination link above before proceeding. <strong>We never ask for your sensitive details.</strong>
          </p>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
            <a href="/" style={{ flex: 1, textAlign: 'center', padding: '14px', background: '#222', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '700' }}>
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
              Continue <span className="material-symbols-rounded" style={{fontSize: '18px'}}>arrow_forward</span>
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#888', fontSize: '0.8rem', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>lightbulb</span>
              <p style={{ margin: 0 }}>If you received this link via a suspicious message, please double check before continuing.</p>
            </div>
            
            <a href={`https://www.google.com/safebrowsing/report_phish/?url=${data.original_url}`} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#888', textDecoration: 'none', fontWeight: '700' }}>
              <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>flag</span>
              Report suspicious link
            </a>
          </div>

        </div>

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
