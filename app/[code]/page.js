import { supabase } from '../../lib/supabase';
import { siteConfig } from '../../lib/config';
import { redirect, notFound } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const dynamic = 'force-dynamic';

export default async function ConfirmPage({ params, searchParams }) {
  const { code } = params;
  const isConfirmAction = searchParams.a === 'confirm';
  const userHeaders = headers();
  const cookieStore = cookies();
  
  const { data } = await supabase.from('links').select('*').eq('slug', code).single();
  if (!data) notFound();

  // Deteksi Bot Sosmed buat Preview
  const userAgent = userHeaders.get('user-agent') || '';
  const isBot = /facebookexternalhit|whatsapp|telegram|twitterbot|bingbot|googlebot/i.test(userAgent);
  if (isBot) return redirect(data.original_url);

  // Jika sudah ada cookie tapi entah kenapa nyasar kesini, lempar ke direct
  if (cookieStore.has(`skip_${code}`) && !isConfirmAction) {
    return redirect(`/${code}/direct`);
  }

  // Jika akses link bersih, paksa ke ?a=confirm
  if (!isConfirmAction) {
    return redirect(`/${code}?a=confirm`);
  }

  return (
    <>
      <Header />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,fill,GRAD@20..48,100..700,0..1,-50..200" />
      <main style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '480px', width: '100%' }}>
          <h2 style={{ fontWeight: '800', marginBottom: '16px' }}>Redirecting to:</h2>
          <div style={{ background: '#111', padding: '18px', borderRadius: '8px', color: '#fff', wordBreak: 'break-all', marginBottom: '24px' }}>
            {data.original_url}
          </div>
          <p style={{ fontSize: '0.95rem', marginBottom: '32px' }}>
            Verify the link above. We <strong>{siteConfig.domain}</strong> never ask for personal info.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="/" style={{ flex: 1, textAlign: 'center', padding: '16px', background: '#f1f5f9', borderRadius: '8px', textDecoration: 'none', color: '#000' }}>Back</a>
            <a 
              href={data.original_url}
              id="btnContinue"
              style={{ flex: 1, textAlign: 'center', padding: '16px', background: '#000', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}
            >
              Continue
            </a>
          </div>
          {/* Area Report tetap ada di sini */}
        </div>
        <script dangerouslySetInnerHTML={{ __html: `
          document.getElementById('btnContinue').addEventListener('click', function(e) {
            e.preventDefault();
            document.cookie = "skip_${code}=true; max-age=3600; path=/";
            window.location.replace("${data.original_url}");
          });
        `}} />
      </main>
      <Footer />
    </>
  );
}
