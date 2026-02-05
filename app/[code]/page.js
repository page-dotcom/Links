import { supabase } from '../../lib/supabase';
import { redirect, notFound } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const dynamic = 'force-dynamic';

export default async function RedirectPage({ params, searchParams }) {
  const { code } = params;
  const isConfirmAction = searchParams.a === 'confirm';
  const cookieStore = cookies();
  const userHeaders = headers();
  const hasConfirmed = cookieStore.get(`skip_${code}`);
  
  // Deteksi Bot/Crawler (WA, FB, Googlebot, etc)
  const userAgent = userHeaders.get('user-agent') || '';
  const isBot = /bot|facebookexternalhit|whatsapp|telegram|twitterbot|bingbot/i.test(userAgent);

  // 1. Ambil data dari Supabase
  const { data } = await supabase.from('links').select('*').eq('slug', code).single();
  if (!data) notFound();

  // 2. KONSEP: Jika Bot, LANGSUNG REDIRECT agar Meta Preview dari URL Tujuan Muncul
  if (isBot) {
    redirect(data.original_url);
  }

  // 3. KONSEP: Jika Klik Pertama (Bukan confirm & Belum ada cookie), Lempar ke ?a=confirm
  if (!isConfirmAction && !hasConfirmed) {
    redirect(`/${code}?a=confirm`);
  }

  // 4. KONSEP: Jika sudah di ?a=confirm ATAU ada Cookie, Baru Eksekusi Redirect Final
  if (isConfirmAction && hasConfirmed) {
    await supabase.rpc('increment_clicks', { row_id: data.id });
    redirect(data.original_url);
  }

  return (
    <>
      <Header />
      <main style={{ background: '#ffffff', minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '480px', width: '100%', textAlign: 'left' }}>
          
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '16px', color: '#000' }}>
            You are being redirected to:
          </h2>

          {/* Box URL Minimalis */}
          <div style={{ 
            background: '#111', padding: '16px', borderRadius: '8px', 
            fontFamily: 'monospace', fontSize: '0.85rem', color: '#fff',
            wordBreak: 'break-all', marginBottom: '20px', border: '1px solid #333'
          }}>
            {data.original_url}
          </div>

          <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: '#333', marginBottom: '24px' }}>
            This link was created by a <strong>public user</strong>. Please check the destination link above before proceeding. <strong>We never ask for your sensitive details.</strong>
          </p>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
            <a href="/" style={{ flex: 1, textAlign: 'center', padding: '14px', background: '#f1f5f9', color: '#000', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '700' }}>
              Back
            </a>
            <a 
              href={`/${code}?a=confirm`}
              id="finalAction"
              style={{ 
                flex: 1, textAlign: 'center', padding: '14px', background: '#000', color: '#fff', 
                borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '700' 
              }}
            >
              Continue →
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
          document.getElementById('finalAction').addEventListener('click', function() {
            document.cookie = "skip_${code}=true; max-age=600; path=/";
          });
        `}} />
      </main>
      <Footer />
    </>
  );
}
