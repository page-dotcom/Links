import { supabase } from '../../lib/supabase';
import { redirect, notFound } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// PAKSA TOTAL: Jangan simpan apapun di cache Vercel
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RedirectPage({ params, searchParams }) {
  const { code } = params;
  const isConfirmAction = searchParams.a === 'confirm';
  const cookieStore = cookies();
  const userHeaders = headers();
  
  // Ambil data link dari Supabase
  const { data } = await supabase.from('links').select('*').eq('slug', code).single();
  if (!data) notFound();

  // Cek Cookie secara presisi
  const hasConfirmed = cookieStore.get(`skip_${code}`);

  // Fungsi Track Klik
  const track = async () => {
    await supabase.rpc('increment_clicks', { row_id: data.id });
  };

  // 1. CEK BOT: Langsung lempar tanpa tanya
  const userAgent = userHeaders.get('user-agent') || '';
  const isBot = /facebookexternalhit|whatsapp|telegram|twitterbot|bingbot|googlebot/i.test(userAgent);
  if (isBot) return redirect(data.original_url);

  // 2. CEK COOKIE: Jika sudah konfirmasi, LANGSUNG lempar ke tujuan asli
  if (hasConfirmed) {
    await track(); 
    return redirect(data.original_url);
  }

  // 3. PROTEKSI: Jika user di URL bersih, paksa masuk ke mode confirm
  if (!isConfirmAction) {
    return redirect(`/${code}?a=confirm`);
  }

  return (
    <>
      <Header />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,fill,GRAD@20..48,100..700,0..1,-50..200" />
      
      <main style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '480px', width: '100%', textAlign: 'left' }}>
          
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px', color: '#000' }}>
            You are being redirected to:
          </h2>

          <div style={{ 
            background: '#111', padding: '18px', borderRadius: '8px', 
            fontFamily: 'monospace', fontSize: '0.9rem', color: '#fff',
            wordBreak: 'break-all', marginBottom: '24px', border: '1px solid #333'
          }}>
            {data.original_url}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
            <a href="/" style={{ flex: 1, textAlign: 'center', padding: '16px', background: '#f1f5f9', color: '#000', borderRadius: '8px', textDecoration: 'none', fontWeight: '700' }}>
              Back
            </a>
            <button 
              id="finalAction"
              style={{ 
                flex: 1, padding: '16px', background: '#000', color: '#fff', 
                borderRadius: '8px', border: 'none', fontSize: '0.9rem', fontWeight: '700',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                cursor: 'pointer'
              }}
            >
              Continue <span className="material-symbols-rounded notranslate" translate="no" style={{ fontSize: '20px' }}>arrow_forward</span>
            </button>
          </div>

          <div style={{ borderTop: '1px solid #eee', paddingTop: '30px' }}>
             <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
               Safe browsing enabled. We protect you from malicious links.
             </p>
          </div>
        </div>

        {/* JAVASCRIPT PALING AGRESIF */}
        <script dangerouslySetInnerHTML={{ __html: `
          document.getElementById('finalAction').addEventListener('click', function() {
            // Pasang cookie di level root agar terbaca semua path
            document.cookie = "skip_${code}=true; max-age=3600; path=/";
            
            // Gunakan location.assign untuk memaksa browser pindah tanpa ampun
            window.location.assign("${data.original_url}");
          });
        `}} />
      </main>
      <Footer />
    </>
  );
}
