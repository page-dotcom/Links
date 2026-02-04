"use client";
import { useState, useEffect, Suspense } from 'react';
import { supabase } from '../../lib/supabase';
import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Bagian 1: Konten Utama yang nangkep slug otomatis
function StatsContent() {
  const searchParams = useSearchParams();
  const slugOtomatis = searchParams.get('slug'); // Ambil ?slug=xxx
  const [inputUrl, setInputUrl] = useState('');
  const [data, setData] = useState(null);

  const fetchData = async (code) => {
    if (!code) return;
    const { data: res } = await supabase.from('links').select('*').eq('slug', code).single();
    if (res) setData(res);
  };

  useEffect(() => {
    if (slugOtomatis) {
      setInputUrl(slugOtomatis);
      fetchData(slugOtomatis);
    }
  }, [slugOtomatis]);

  return (
    <main className="container" style={{padding: '100px 20px', textAlign: 'center'}}>
      <h1>Statistik Link</h1>
      <div className="input-box">
        <input 
          type="text" 
          value={inputUrl} 
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="Masukkan link atau kode..." 
          style={{padding: '12px', width: '300px', borderRadius: '5px', border: '1px solid #ccc'}}
        />
        <button onClick={() => fetchData(inputUrl.split('/').pop())} className="btn-black" style={{marginLeft: '10px'}}>Cek</button>
      </div>
      {data && (
        <div className="result-box" style={{marginTop: '30px', display: 'block', textAlign: 'left', background: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #eee'}}>
          <p><strong>Total Klik:</strong> {data.clicks || 0}</p>
          <p><strong>URL Asli:</strong> {data.original_url}</p>
        </div>
      )}
    </main>
  );
}

// Bagian 2: Fungsi Utama (Wajib pake Suspense)
export default function StatsPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="container">Memuat data...</div>}>
        <StatsContent />
      </Suspense>
      <Footer />
    </>
  );
}
