"use client";
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [url, setUrl] = useState('');
  const [hasil, setHasil] = useState('');
  const qrRef = useRef(null);

  const gaskeun = async (e) => {
    e.preventDefault();
    const slugAcak = Math.random().toString(36).substring(2, 7);
    
    // Simpan ke database sesuai kolom 'slug' lo
    const { error } = await supabase
      .from('links')
      .insert([{ original_url: url, slug: slugAcak, clicks: 0 }]);

    if (!error) {
      setHasil(`${window.location.origin}/${slugAcak}`);
    } else {
      alert("Error: " + error.message);
    }
  };

  // Fungsi generate QR otomatis tanpa API luar
  useEffect(() => {
    if (hasil && typeof window.QRCode !== 'undefined') {
      qrRef.current.innerHTML = ""; // Bersihin QR lama
      new window.QRCode(qrRef.current, {
        text: hasil,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
      });
    }
  }, [hasil]);

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>{"URL Shortener & QR Lokal"}</h1>
      <form onSubmit={gaskeun}>
        <input 
          type="url" 
          value={url} 
          onChange={(e) => setUrl(e.target.value)} 
          placeholder="Tempel link..." 
          required 
          style={{ padding: '10px', width: '250px' }} 
        />
        <button type="submit" style={{ padding: '10px', marginLeft: '10px' }}>{"Shorten"}</button>
      </form>

      {hasil && (
        <div style={{ marginTop: '20px', border: '1px solid #ddd', padding: '20px', display: 'inline-block' }}>
          <p>{"Link: "}<a href={hasil}>{hasil}</a></p>
          <div style={{ marginTop: '15px' }}>
            <p>{"Scan di bawah (Tanpa API):"}</p>
            {/* Wadah QR Code */}
            <div ref={qrRef} style={{ display: 'inline-block', padding: '10px', background: '#fff' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}
