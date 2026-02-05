import { supabase } from '../../lib/supabase';
import { redirect, notFound } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RedirectPage({ params, searchParams }) {
  const { code } = params;
  const isConfirmAction = searchParams.a === 'confirm';
  const cookieStore = cookies();
  const userHeaders = headers();
  const hasConfirmed = cookieStore.get(`skip_${code}`);
  
  const { data } = await supabase.from('links').select('*').eq('slug', code).single();
  if (!data) notFound();

  // Fungsi untuk mencatat klik ke database
  const trackClick = async () => {
    await supabase.rpc('increment_clicks', { row_id: data.id });
  };

  // 1. CEK BOT: Langsung lempar tanpa konfirmasi
  const userAgent = userHeaders.get('user-agent') || '';
  const isBot = /facebookexternalhit|whatsapp|telegram|twitterbot|bingbot|googlebot/i.test(userAgent);
  if (isBot) return redirect(data.original_url);

  // 2. CEK COOKIE: Jika sudah ada, catat klik dan LANGSUNG redirect (Ini solusi biar gak balik ke confirm)
  if (hasConfirmed) {
    await trackClick(); 
    return redirect(data.original_url);
  }

  // 3. PAKSA MODE CONFIRM JIKA BELUM ADA COOKIE
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
            wordBreak: 'break-all', marginBottom: '24px', border: '1px solid #333', lineHeight: '1.5'
          }}>
            {data.original_url}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
            <a href="/" style={{ flex: 1, textAlign: 'center', padding: '16px', background: '#f1f5f9', color: '#000', borderRadius: '8px', textDecoration: 'none', fontWeight: '700' }}>
              Back
            </a>
            
            <a 
              href={data.original_url}
              onClick={`(function(e){ 
                e.preventDefault(); 
                // Pasang cookie agar kunjungan berikutnya langsung redirect
                document.cookie = "skip_${code}=true; max-age=86400; path=/; SameSite=Lax";
                // Langsung pindah halaman
                window.location.replace("${data.original_url}"); 
              })(event)`}
              style={{ 
                flex: 1, textAlign: 'center', padding: '16px', background: '#000', color: '#fff', 
                borderRadius: '8px', textDecoration: 'none', fontWeight: '700',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              Continue <span className="material-symbols-rounded notranslate" translate="no" style={{ fontSize: '20px' }}>arrow_forward</span>
            </a>
          </div>

          <div style={{ borderTop: '1px solid #eee', paddingTop: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: '#64748b', fontSize: '0.85rem' }}>
              <span className="material-symbols-rounded notranslate" translate="no" style={{ color: '#000', fontSize: '22px' }}>lightbulb</span>
              <p style={{ margin: 0 }}>Double-check the destination before proceeding.</p>
            </div>
            <a href={`https://www.google.com/safebrowsing/report_phish/?url=${encodeURIComponent(data.original_url)}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#000', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem' }}>
              <span className="material-symbols-rounded notranslate" translate="no" style={{ fontSize: '22px' }}>flag</span>
              Report suspicious link
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
