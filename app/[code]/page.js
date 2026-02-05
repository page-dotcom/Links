import { supabase } from '../../lib/supabase';
import { redirect, notFound } from 'next/navigation';
import { headers } from 'next/headers';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// PENTING: Paksa server render ulang tiap akses biar tracking jalan
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RedirectPage({ params }) {
  const { code } = params;
  const userHeaders = headers();
  
  // 1. AMBIL DATA DARI SUPABASE
  const { data } = await supabase.from('links').select('*').eq('slug', code).single();
  if (!data) notFound();

  // 2. DETEKSI BOT SOSMED (WA, FB, IG, Twitter, dll)
  // Ini SOLUSI PREVIEW: Kalo bot, lempar langsung ke tujuan biar dia ambil gambar dari sana
  const userAgent = userHeaders.get('user-agent') || '';
  const isBot = /facebookexternalhit|whatsapp|telegram|twitterbot|bingbot|googlebot|linkedinbot|embedly|slackbot|discordbot/i.test(userAgent);

  if (isBot) {
    return redirect(data.original_url);
  }

  // 3. TRACKING KLIK (MANUSIA)
  // Langsung hitung klik begitu halaman dibuka manusia. Gak perlu nunggu tombol diklik.
  await supabase.rpc('increment_clicks', { row_id: data.id });

  // 4. TAMPILKAN HALAMAN KONFIRMASI (LANGSUNG, TANPA REDIRECT URL)
  return (
    <>
      <Header />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,fill,GRAD@20..48,100..700,0..1,-50..200" />
      
      <main style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '480px', width: '100%', textAlign: 'left' }}>
          
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px', color: '#000', letterSpacing: '-0.02em' }}>
            You are being redirected to:
          </h2>

          <div style={{ 
            background: '#111', padding: '18px', borderRadius: '8px', 
            fontFamily: 'monospace', fontSize: '0.9rem', color: '#fff',
            wordBreak: 'break-all', marginBottom: '24px', border: '1px solid #333',
            lineHeight: '1.5'
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
            
            {/* TOMBOL CONTINUE: Pake JavaScript Inline biar pasti jalan */}
            <a 
              href={data.original_url}
              onClick={`(function(e){ 
                e.preventDefault(); 
                // Langsung ganti halaman ke tujuan
                window.location.replace("${data.original_url}"); 
              })(event)`}
              style={{ 
                flex: 1, textAlign: 'center', padding: '16px', background: '#000', color: '#fff', 
                borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '700',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer'
              }}
            >
              Continue <span className="material-symbols-rounded notranslate" translate="no" style={{ fontSize: '20px' }}>arrow_forward</span>
            </a>
          </div>

          <div style={{ borderTop: '1px solid #eee', paddingTop: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: '#64748b', fontSize: '0.85rem', lineHeight: '1.5' }}>
              <span className="material-symbols-rounded notranslate" translate="no" style={{ color: '#000', fontSize: '22px' }}>lightbulb</span>
              <p style={{ margin: 0 }}>
                If you receive this link in an email, phone call, or other suspicious message, please double-check before proceeding. Report the link if you think it's suspicious.
              </p>
            </div>
            <a href={`https://www.google.com/safebrowsing/report_phish/?url=${encodeURIComponent(data.original_url)}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#000', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem' }}>
              <span className="material-symbols-rounded notranslate" translate="no" style={{ fontSize: '22px' }}>flag</span>
              Report suspicious link
            </a>
          </div>
        </div>
        
        {/* Hapus script addEventListener yang bikin error */}
      </main>
      <Footer />
    </>
  );
}
