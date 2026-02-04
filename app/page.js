"use client";
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function Home() {
  const [url, setUrl] = useState('');
  const [hasil, setHasil] = useState('');
  const [recentLinks, setRecentLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const qrRef = useRef(null);

  // Ambil history link dari localStorage pas pertama kali buka
  useEffect(() => {
    const savedLinks = JSON.parse(localStorage.getItem('recentLinks') || '[]');
    setRecentLinks(savedLinks);
  }, []);

  // Fungsi generate QR Lokal (Tanpa API)
  useEffect(() => {
    if (hasil && typeof window.QRCode !== 'undefined') {
      qrRef.current.innerHTML = "";
      new window.QRCode(qrRef.current, {
        text: hasil,
        width: 150,
        height: 150,
      });
    }
  }, [hasil]);

  const gaskeun = async (e) => {
    e.preventDefault();
    setLoading(true);
    const slugAcak = Math.random().toString(36).substring(2, 7);
    const fullLink = `${window.location.origin}/${slugAcak}`;
    
    const { error } = await supabase
      .from('links')
      .insert([{ original_url: url, slug: slugAcak, clicks: 0 }]);

    if (error) {
      alert("Gagal: " + error.message);
    } else {
      setHasil(fullLink);
      
      // Update Recent Links (Maksimal 5, yang baru di atas)
      const newRecent = [{ url: url, shorten: fullLink, slug: slugAcak }, ...recentLinks].slice(0, 5);
      setRecentLinks(newRecent);
      localStorage.setItem('recentLinks', JSON.stringify(newRecent));
      
      setUrl(''); // Reset input
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#0070f3' }}>{"URL Shortener & QR"}</h1>
      
      <form onSubmit={gaskeun} style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
        <input 
          type="url" 
          value={url} 
          onChange={(e) => setUrl(e.target.value)} 
          placeholder="Tempel URL asli..." 
          required 
          style={{ flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }} 
        />
        <button type="submit" disabled={loading} style={{ padding: '12px 20px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {loading ? '...' : 'Shorten'}
        </button>
      </form>

      {hasil && (
        <div style={{ marginBottom: '40px', padding: '20px', border: '2px solid #0070f3', borderRadius: '10px', background: '#f0f7ff' }}>
          <p style={{ fontWeight: 'bold' }}>{"Link Baru Dibuat:"}</p>
          <a href={hasil} target="_blank" style={{ fontSize: '1.2rem', color: '#0070f3' }}>{hasil}</a>
          <div style={{ marginTop: '20px' }}>
            <div ref={qrRef} style={{ display: 'inline-block', padding: '10px', background: '#fff', border: '1px solid #ddd' }}></div>
          </div>
        </div>
      )}

      {/* SECTION RECENT LINKS */}
      <div style={{ textAlign: 'left', marginTop: '40px' }}>
        <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>{"Recent Links (5 Terakhir)"}</h3>
        {recentLinks.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center' }}>{"Belum ada link yang dibuat."}</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {recentLinks.map((item, index) => (
              <div key={index} style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px', background: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ overflow: 'hidden', marginRight: '10px' }}>
                  <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.url}
                  </p>
                  <a href={item.shorten} target="_blank" style={{ fontWeight: 'bold', color: '#0070f3', textDecoration: 'none' }}>
                    {item.shorten}
                  </a>
                </div>
                {/* Tombol Cek Pengunjung ke halaman stats */}
                <Link href={`/stats?slug=${item.slug}`}>
                  <button style={{ padding: '8px 12px', fontSize: '0.8rem', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    {"Cek Pengunjung"}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
