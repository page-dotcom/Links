"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { siteConfig } from '../../lib/config';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function RedirectPage({ params }) {
  const { code } = params;
  const [data, setData] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false); // Default sembunyi dulu
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      // 1. Ambil data link
      const { data: linkData } = await supabase.from('links').select('*').eq('slug', code).single();
      
      if (!linkData) {
        window.location.href = '/404';
        return;
      }
      setData(linkData);

      // 2. CEK COOKIE (Apakah user ini barusan akses dalam 10 menit terakhir?)
      const cookieName = `seen_${code}`;
      const hasSeen = document.cookie.split('; ').find(row => row.startsWith(`${cookieName}=`));

      // LOGIKA DIBALIK SESUAI PERMINTAAN LO:
      
      if (!hasSeen) {
        // --- SKENARIO 1: AKSES PERTAMA (Belum ada cookie) ---
        // Tindakan: Redirect Langsung + Pasang Cookie 10 Menit
        
        // a. Track Klik di Supabase
        await supabase.rpc('increment_clicks', { row_id: linkData.id });

        // b. Pasang Cookie "seen" (Expired 10 menit / 600 detik)
        document.cookie = `${cookieName}=true; max-age=600; path=/`;

        // c. Redirect Langsung (Pake timeout dikit biar Histats sempet loading)
        setTimeout(() => {
          window.location.replace(linkData.original_url);
        }, 800); // Delay 0.8 detik buat loading tracker
      } 
      else {
        // --- SKENARIO 2: AKSES KEDUA (Cookie masih ada) ---
        // Tindakan: Munculin Halaman Konfirmasi
        setLoading(false);
        setShowConfirm(true);
      }
    }

    init();
  }, [code]);

  // Fungsi buat tombol Continue di halaman konfirmasi
  const handleManualContinue = async () => {
    if (!data) return;
    await supabase.rpc('increment_clicks', { row_id: data.id });
    window.location.replace(data.original_url);
  };

  // TAMPILAN LOADING (Pas akses pertama, user liat ini bentar sebelum mental)
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* Masukin Script Histats di sini biar kebaca pas loading */}
        {/* Contoh: <script ... histats ... ></script> */}
        <p style={{ fontFamily: 'monospace', color: '#666' }}>Redirecting...</p>
      </div>
    );
  }

  // TAMPILAN HALAMAN KONFIRMASI (Muncul cuma di akses kedua)
  if (showConfirm && data) {
    return (
      <>
        <Header />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,fill,GRAD@20..48,100..700,0..1,-50..200" />
        
        <main style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ maxWidth: '480px', width: '100%', textAlign: 'left' }}>
            
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px', color: '#000' }}>
              Security Check
            </h2>

            <div style={{ 
              background: '#fff', border: '1px solid #eee', padding: '18px', borderRadius: '8px', 
              marginBottom: '24px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}>
              <p style={{ fontSize: '0.9rem', color: '#444', marginBottom: '10px' }}>
                You are visiting this link frequently. Please confirm to proceed to:
              </p>
              <div style={{ fontFamily: 'monospace', color: '#0070f3', wordBreak: 'break-all' }}>
                {data.original_url}
              </div>
            </div>
            
            <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#333', marginBottom: '32px' }}>
           This link was created by a <strong>public user.</strong> Please verify the link above before proceeding. <strong><u>We {siteConfig.domain} never ask for your personal information.</u></strong>
           </p>



            <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
              <button 
                onClick={handleManualContinue}
                style={{ 
                  flex: 1, padding: '16px', background: '#000', color: '#fff', 
                  borderRadius: '8px', border: 'none', fontSize: '0.9rem', fontWeight: '700',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                Continue <span className="material-symbols-rounded notranslate" style={{ fontSize: '20px' }}>arrow_forward</span>
              </button>
            </div>

            {/* Area Report */}
            <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
               {/* AREA REPORT */}
          <div style={{ borderTop: '1px solid #eee', paddingTop: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: '#64748b', fontSize: '0.85rem' }}>
              <span className="material-symbols-rounded notranslate" translate="no" style={{ color: '#000', fontSize: '22px' }}>lightbulb</span>
              <p style={{ margin: 0 }}>If you receive this link in an email, phone call, or other suspicious message, please double-check before proceeding. Report the link if you think it's suspicious.</p>
            </div>
            <a href={`https://www.google.com/safebrowsing/report_phish/?url=${encodeURIComponent(data.original_url)}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#000', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem' }}>
              <span className="material-symbols-rounded notranslate" translate="no" style={{ fontSize: '22px' }}>flag</span>
              Report suspicious link
            </a>
          </div>
        </div>

          </div>
        </main>
        <Footer />
      </>
    );
  }

  return null;
}
