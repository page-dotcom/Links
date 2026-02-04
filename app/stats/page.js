"use client";
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function StatsPage() {
  const [inputUrl, setInputUrl] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const cekStatistik = async (e) => {
    e.preventDefault();
    setLoading(true);
    setData(null);

    // LOGIKA DETEKSI: Ambil kode setelah garis miring terakhir (/)
    // Jadi mau diinput "https://.../wg14r" atau cuma "wg14r", hasilnya tetep "wg14r"
    const slug = inputUrl.split('/').pop().trim();

    if (!slug) {
      alert("Masukkan link atau kode yang bener, Bos!");
      setLoading(false);
      return;
    }

    const { data: linkData, error } = await supabase
      .from('links')
      .select('original_url, clicks, created_at, slug')
      .eq('slug', slug)
      .single();

    if (error || !linkData) {
      alert("Link atau Kode gak ketemu di database!");
    } else {
      setData(linkData);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#0070f3' }}>{"Cek Statistik Link"}</h1>
      <p>{"Tempel Link Shorten lo di sini:"}</p>
      
      <form onSubmit={cekStatistik} style={{ marginBottom: '30px' }}>
        <input 
          type="text" 
          value={inputUrl} 
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="https://links-omega-blush.vercel.app/wg14r" 
          required 
          style={{ 
            padding: '12px', 
            width: '350px', 
            borderRadius: '5px', 
            border: '1px solid #ccc',
            fontSize: '14px' 
          }}
        />
        <button 
          type="submit" 
          disabled={loading} 
          style={{ 
            padding: '12px 20px', 
            marginLeft: '10px', 
            cursor: 'pointer',
            background: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Ngecek...' : 'Cek Pengunjung'}
        </button>
      </form>

      {data && (
        <div style={{ 
          border: '1px solid #eaeaea', 
          padding: '25px', 
          display: 'inline-block', 
          borderRadius: '15px', 
          textAlign: 'left',
          background: '#fff',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ marginTop: 0, color: '#333', borderBottom: '2px solid #0070f3', display: 'inline-block' }}>
            {"Detail Link:"}
          </h3>
          <p style={{ marginTop: '15px' }}><strong>{"Kode Unik:"}</strong> <code style={{ background: '#f4f4f4', padding: '2px 5px' }}>{data.slug}</code></p>
          <p><strong>{"URL Asli:"}</strong> <br/>
            <a href={data.original_url} target="_blank" style={{ color: '#0070f3', wordBreak: 'break-all' }}>{data.original_url}</a>
          </p>
          <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '15px 0' }} />
          <p style={{ fontSize: '1.1rem' }}>
            <strong>{"Total Pengunjung:"}</strong> <br/>
            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0070f3' }}>{data.clicks || 0}</span>
            <span style={{ color: '#666', marginLeft: '10px' }}>{"Klik"}</span>
          </p>
          <p style={{ fontSize: '0.8rem', color: '#999' }}>
            {"Dibuat: "} {new Date(data.created_at).toLocaleString('id-ID')}
          </p>
        </div>
      )}
    </div>
  );
}
