"use client";
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [url, setUrl] = useState('');
  const [hasil, setHasil] = useState('');

  const gaskeun = async (e) => {
    e.preventDefault();
    const slugAcak = Math.random().toString(36).substring(2, 7);
    const { error } = await supabase.from('links').insert([{ original_url: url, slug: slugAcak, clicks: 0 }]);
    if (!error) setHasil(`${window.location.origin}/${slugAcak}`);
    else alert("Gagal: " + error.message);
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>{"Shorten URL & QR"}</h1>
      <form onSubmit={gaskeun}>
        <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} required style={{ padding: '10px', width: '300px' }} />
        <button type="submit" style={{ padding: '10px 20px', marginLeft: '10px' }}>{"Shorten"}</button>
      </form>
      {hasil && (
        <div style={{ marginTop: '20px', border: '1px solid #ddd', padding: '20px', display: 'inline-block' }}>
          <p>{"Link Anda: "}<a href={hasil}>{hasil}</a></p>
          <img src={`https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(hasil)}&chs=200x200`} alt="qr" />
        </div>
      )}
    </div>
  );
}
