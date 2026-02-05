import { supabase } from '../../lib/supabase';
import { redirect, notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const dynamic = 'force-dynamic';

// FUNGSI UNTUK AMBIL DATA DARI URL TUJUAN (SCRAPING)
export async function generateMetadata({ params }) {
  const { code } = params;
  const { data } = await supabase.from('links').select('original_url').eq('slug', code).single();
  
  if (!data) return { title: "Link Not Found" };

  try {
    const response = await fetch(data.original_url, { next: { revalidate: 3600 } });
    const html = await response.text();

    // Ambil Title, Description, dan Image asli pakai Regex yang lebih akurat
    const title = html.match(/<title>(.*?)<\/title>/i)?.[1] || "Redirecting...";
    const desc = html.match(/<meta property="og:description" content="(.*?)"/i)?.[1] || 
                 html.match(/<meta name="description" content="(.*?)"/i)?.[1] || data.original_url;
    let img = html.match(/<meta property="og:image" content="(.*?)"/i)?.[1];

    // Pastikan URL gambar lengkap (absolute)
    if (img && !img.startsWith('http')) {
      const urlObj = new URL(data.original_url);
      img = urlObj.origin + (img.startsWith('/') ? '' : '/') + img;
    }

    return {
      title: title,
      description: desc,
      openGraph: {
        title: title,
        description: desc,
        images: img ? [img] : [],
        url: data.original_url,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: desc,
        images: img ? [img] : [],
      },
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
        <div style={{ maxWidth: '480px', width: '100%', textAlign: 'left' }}>
          
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px', color: '#000', letterSpacing: '-0.02em' }}>
            You are being redirected to:
          </h2>

          {/* Box URL - Style Dark Minimalist */}
          <div style={{ 
            background: '#111', 
            padding: '18px', 
            borderRadius: '8px', 
            fontFamily: 'monospace', 
            fontSize: '0.85rem', 
            color: '#fff',
            wordBreak: 'break-all',
            marginBottom: '24px',
            lineHeight: '1.5',
            border: '1px solid #333'
          }}>
            {data.original_url}
          </div>

          <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#333', marginBottom: '32px' }}>
            This link was created by a <strong>public user</strong>. Please check the destination link above before proceeding. <strong>We never ask for your sensitive details.</strong>
          </p>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
            <a href="/" style={{ flex: 1, textAlign: 'center', padding: '16px', background: '#f1f5f9', color: '#000', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '700' }}>
              Back
            </a>
            <a 
              href={`/${code}?a=confirm`}
              id="actionBtn"
              style={{ 
                flex: 1, 
                textAlign: 'center', 
                padding: '16px', 
                background: '#000', 
                color: '#fff', 
                borderRadius: '8px', 
                textDecoration: 'none', 
                fontSize: '0.9rem', 
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              Continue <span className="material-symbols-rounded" style={{fontSize: '20px'}}>arrow_forward</span>
            </a>
          </div>

          <div style={{ borderTop: '1px solid #eee', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', color: '#666', fontSize: '0.85rem' }}>
              <span className="material-symbols-rounded" style={{ fontSize: '20px', color: '#000' }}>lightbulb</span>
              <p style={{ margin: 0 }}>If you received this link via a suspicious message, please double check before continuing.</p>
            </div>
            
            <a href={`https://www.google.com/safebrowsing/report_phish/?url=${encodeURIComponent(data.original_url)}`} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000', textDecoration: 'none', fontWeight: '700', fontSize: '0.85rem' }}>
              <span className="material-symbols-rounded" style={{ fontSize: '20px' }}>flag</span>
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
