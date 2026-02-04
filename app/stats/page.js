"use client";
import { useState } from 'react';
import { supabase } from '../../lib/supabase'; // Naik 2 folder

export default function StatsPage() {
  const [slug, setSlug] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const cekStatistik = async (e) => {
    e.preventDefault();
    setLoading(true);
    setData(null);

    // Ambil data berdasarkan slug dari kolom 'slug' di database lo
    const { data: linkData, error } = await supabase
      .from('links')
      .select('original_url, clicks, created_at')
      .eq('slug', slug)
      .single();

    if (error) {
      alert("Slug gak ketemu, Bos!");
    } else {
      setData(linkData);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>{"Cek Pengunjung Link"}</h1>
      <p>{"Masukkan kode unik (slug) link lo di bawah:"}</p>
      
      <form onSubmit={cekStatistik} style={{ marginBottom: '30px' }}>
        <input 
          type="text" 
          value={slug} 
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Contoh: 0u0x0" 
          required 
          style={{ padding: '10px', width: '200px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '10px 20px', marginLeft: '10px', cursor: 'pointer' }}>
          {loading ? 'Ngecek...' : 'Cek Sekarang'}
        </button>
      </form>

      {data && (
        <div style={{ border: '1px solid #ddd', padding: '20px', display: 'inline-block', borderRadius: '10px', textAlign: 'left' }}>
          <h3 style={{ marginTop: 0 }}>{"Hasil Statistik:"}</h3>
          <p><strong>{"URL Asli:"}</strong> {data.original_url}</p>
          <p><strong>{"Total Klik:"}</strong> <span style={{ fontSize: '1.5rem', color: '#0070f3' }}>{data.clicks || 0}</span> {" orang"}</p>
          <p><strong>{"Dibuat pada:"}</strong> {new Date(data.created_at).toLocaleString('id-ID')}</p>
        </div>
      )}
    </div>
  );
}
