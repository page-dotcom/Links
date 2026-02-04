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
    const slugAcak = Math.random().toString(36).substring(2, 7);
    
    // Pake 'slug' bukan 'short_code' biar gak meledak lagi
    const { error } = await supabase
      .from('links')
      .insert([{ original_url: url, slug: slugAcak, clicks: 0 }]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      setHasil(`${window.location.origin}/${slugAcak}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>{"URL Shortener & QR"}</h1>
      <form onSubmit={gaskeun}>
        <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} required 
          style={{ padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #ccc' }} />
        <button type="submit" disabled={loading} style={{ padding: '10px 20px', marginLeft: '10px' }}>
          {loading ? '...' : 'Shorten'}
        </button>
      </form>
      {hasil && (
        <div style={{ marginTop: '20px', border: '1px solid #ddd', padding: '20px', display: 'inline-block' }}>
          <p>{"Link: "}<a href={hasil}>{hasil}</a></p>
          <img src={`https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(hasil)}&chs=200x200`} alt="qr" />
        </div>
      )}
    </div>
  );
}
