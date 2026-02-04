"use client";
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [url, setUrl] = useState('');
  const [hasil, setHasil] = useState('');
  const [loading, setLoading] = useState(false);

  const gaskeun = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Bikin slug 5 digit
    const slugAcak = Math.random().toString(36).substring(2, 7);
    
    // Simpan ke kolom 'slug' sesuai database lo
    const { error } = await supabase
      .from('links')
      .insert([{ original_url: url, slug: slugAcak, clicks: 0 }]);

    if (error) {
      alert("Gagal: " + error.message);
    } else {
      setHasil(`${window.location.origin}/${slugAcak}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
      <h1>{"URL Shortener & QR"}</h1>
      
      <form onSubmit={gaskeun} style={{ marginBottom: '30px' }}>
        <input 
          type="url" 
          value={url} 
          onChange={(e) => setUrl(e.target.value)} 
          placeholder="Tempel URL asli..." 
          required 
          style={{ padding: '12px', width: '300px', borderRadius: '5px', border: '1px solid #ccc' }} 
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '12px 20px', marginLeft: '10px', cursor: 'pointer', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px' }}
        >
          {loading ? '...' : 'Shorten'}
        </button>
      </form>

      {hasil && (
        <div style={{ marginTop: '20px', border: '1px solid #ddd', padding: '30px', display: 'inline-block', borderRadius: '10px' }}>
          <p style={{ marginBottom: '10px' }}>{"Link Berhasil Dibuat:"}</p>
          <a href={hasil} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', color: '#0070f3' }}>
            {hasil}
          </a>
          
          <div style={{ marginTop: '20px' }}>
            <p>{"Scan QR Code:"}</p>
            {/* Pake encodeURIComponent biar URL link-nya kebaca bener ama Google */}
            <img 
              src={`https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(hasil)}`} 
              alt="QR Code" 
              style={{ border: '1px solid #eee', padding: '10px', marginTop: '10px' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
