"use client";
import { useState, useEffect, Suspense } from 'react';
import { supabase } from '../../lib/supabase';
import { useSearchParams } from 'next/navigation';

// Kita bungkus pake Suspense karena pake useSearchParams (Aturan Next.js)
function StatsContent() {
  const searchParams = useSearchParams();
  const slugOtomatis = searchParams.get('slug'); // Nangkep ?slug=...
  
  const [inputUrl, setInputUrl] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fungsi buat nyari data ke Supabase
  const fetchData = async (kode) => {
    setLoading(true);
    setData(null);
    
    const { data: linkData, error } = await supabase
      .from('links')
      .select('original_url, clicks, created_at, slug')
      .eq('slug', kode)
      .single();

    if (error || !linkData) {
      alert("Link atau Kode gak ketemu!");
    } else {
      setData(linkData);
    }
    setLoading(false);
  };

  // Efek biar otomatis jalan kalau ada slug di URL
  useEffect(() => {
    if (slugOtomatis) {
      setInputUrl(slugOtomatis);
      fetchData(slugOtomatis);
    }
  }, [slugOtomatis]);

  const handleManualCheck = (e) => {
    e.preventDefault();
    const slug = inputUrl.split('/').pop().trim();
    fetchData(slug);
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#0070f3' }}>{"Statistik Pengunjung"}</h1>
      
      <form onSubmit={handleManualCheck} style={{ marginBottom: '30px' }}>
        <input 
          type="text" 
          value={inputUrl} 
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="Tempel link atau masukkan kode..." 
          required 
          style={{ padding: '12px', width: '300px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '12px 20px', marginLeft: '10px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
          {loading ? '...' : 'Cek'}
        </button>
      </form>

      {data && (
        <div style={{ border: '1px solid #ddd', padding: '25px', display: 'inline-block', borderRadius: '15px', textAlign: 'left', background: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, borderBottom: '2px solid #0070f3', paddingBottom: '5px' }}>{"Hasil Analisa:"}</h3>
          <p><strong>{"Kode Slug:"}</strong> {data.slug}</p>
          <p><strong>{"URL Asli:"}</strong> <br/><a href={data.original_url} target="_blank" style={{ color: '#0070f3', wordBreak: 'break-all' }}>{data.original_url}</a></p>
          <hr/>
          <p style={{ fontSize: '1.2rem' }}>
            <strong>{"Total Klik:"}</strong> <br/>
            <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#0070f3' }}>{data.clicks || 0}</span>
          </p>
          <p style={{ fontSize: '0.8rem', color: '#999' }}>{"Dibuat pada: "} {new Date(data.created_at).toLocaleString('id-ID')}</p>
        </div>
      )}
    </div>
  );
}

// Komponen Utama
export default function StatsPage() {
  return (
    <Suspense fallback={<div>{"Memuat..."}</div>}>
      <StatsContent />
    </Suspense>
  );
}
