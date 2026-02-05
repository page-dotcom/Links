"use client"; // WAJIB! Biar cookie langsung terbaca
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function RedirectPage({ params }) {
  const { code } = params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initRedirect() {
      // 1. Ambil data link dari Supabase
      const { data: linkData } = await supabase.from('links').select('*').eq('slug', code).single();
      
      if (!linkData) {
        window.location.href = '/404';
        return;
      }
      setData(linkData);

      // 2. Cek Cookie - Jika sudah pernah konfirmasi, langsung track & lempar
      const hasConfirmed = document.cookie.split('; ').find(row => row.startsWith(`skip_${code}=`));
      
      if (hasConfirmed) {
        await supabase.rpc('increment_clicks', { row_id: linkData.id });
        window.location.replace(linkData.original_url);
        return;
      }
      setLoading(false);
    }
    initRedirect();
  }, [code]);

  const handleContinue = async () => {
    if (!data) return;

    // Pasang Cookie (Berlaku 1 jam)
    document.cookie = `skip_${code}=true; max-age=3600; path=/`;

    // Track klik ke database sebelum pindah (Biar Histats/DB gak 0)
    await supabase.rpc('increment_clicks', { row_id: data.id });

    // Lempar ke tujuan
    window.location.replace(data.original_url);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', fontWeight: 'bold' }}>Verifying link...</div>;

  return (
    <>
      <Header />
      {/* Import Google Icon Font */}
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
            {data?.original_url}
          </div>

          <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#333', marginBottom: '32px' }}>
            This link was created by a <strong>public user</strong>. Please check the destination link above before proceeding. <strong>We never ask for your sensitive details.</strong>
          </p>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
            <a href="/" style={{ flex: 1, textAlign: 'center', padding: '16px', background: '#f1f5f9', color: '#000', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '700' }}>
              Back
            </a>
            <button 
              onClick={handleContinue}
              style={{ 
                flex: 1, padding: '16px', background: '#000', color: '#fff', 
                borderRadius: '8px', border: 'none', fontSize: '0.9rem', fontWeight: '700',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer'
              }}
            >
              Continue <span className="material-symbols-rounded notranslate" translate="no" style={{ fontSize: '20px' }}>arrow_forward</span>
            </button>
          </div>

          {/* AREA REPORT & INFO - SUDAH BALIK LAGI DISINI */}
          <div style={{ borderTop: '1px solid #eee', paddingTop: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: '#64748b', fontSize: '0.85rem', lineHeight: '1.5' }}>
              <span className="material-symbols-rounded notranslate" translate="no" style={{ color: '#000', fontSize: '22px' }}>lightbulb</span>
              <p style={{ margin: 0 }}>
                If you receive this link in an email, phone call, or other suspicious message, please double-check before proceeding. Report the link if you think it's suspicious.
              </p>
            </div>

            <a 
              href={`https://www.google.com/safebrowsing/report_phish/?url=${encodeURIComponent(data?.original_url)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                color: '#000', 
                textDecoration: 'none', 
                fontWeight: '700', 
                fontSize: '0.9rem' 
              }}
            >
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
