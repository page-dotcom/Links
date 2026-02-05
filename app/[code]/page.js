import { supabase } from '../../lib/supabase';
import { redirect, notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const dynamic = 'force-dynamic';

// FUNGSI UNTUK CLONE METADATA DARI URL TUJUAN
export async function generateMetadata({ params }) {
  const { code } = params;
  const { data } = await supabase.from('links').select('original_url').eq('slug', code).single();
  
  if (!data) return { title: "Link Not Found" };

  try {
    // Kita kasih instruksi ke bot biar "seolah-olah" ini adalah web aslinya
    return {
      title: "Redirecting...", 
      description: "You are being redirected to an external link.",
      openGraph: {
        title: "Link Redirecting...",
        description: data.original_url,
        url: data.original_url,
      },
      // Trick: Kadang bot butuh metadata manual kalau scraping berat
      other: {
        "og:url": data.original_url,
      }
    };
  } catch (e) {
    return { title: "Secure Redirect" };
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

  const reportUrl = `https://www.google.com/safebrowsing/report_phish/?url=${encodeURIComponent(data.original_url)}`;

  return (
    <>
      <Header />
      <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ maxWidth: '500px', width: '100%' }}>
          
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '16px', color: '#000' }}>
            Anda akan dialihkan ke:
          </h2>

          <div style={{ 
            background: '#111', 
            padding: '20px', 
            borderRadius: '8px', 
            fontFamily: 'monospace', 
            fontSize: '0.9rem', 
            color: '#fff',
            wordBreak: 'break-all',
            marginBottom: '24px',
            lineHeight: '1.5',
            border: '1px solid #333'
          }}>
            {data.original_url}
          </div>

          <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#333', marginBottom: '32px' }}>
            Tautan ini dibuat oleh <strong>pengguna publik</strong>. Silakan periksa tautan di atas sebelum melanjutkan. <strong>Kami tidak pernah menanyakan informasi detail anda.</strong>
          </p>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
            <a href="/" style={{ flex: 1, textAlign: 'center', padding: '16px', background: '#f1f5f9', color: '#000', borderRadius: '8px', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '700' }}>
              Kembali
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
                fontSize: '0.95rem', 
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              Lanjutkan <span className="material-symbols-rounded" style={{fontSize: '20px'}}>arrow_forward</span>
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#64748b', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span className="material-symbols-rounded" style={{ color: '#000', fontSize: '20px' }}>lightbulb</span>
              <p style={{ margin: 0 }}>
                Jika Anda menerima tautan ini dalam bentuk email atau pesan mencurigakan, mohon tidak melanjutkan.
              </p>
            </div>
            
            <a href={reportUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000', textDecoration: 'none', fontWeight: '700' }}>
              <span className="material-symbols-rounded" style={{ fontSize: '20px' }}>flag</span>
              Laporkan Tautan
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
