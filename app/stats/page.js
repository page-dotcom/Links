"use client";
import { useState, useEffect, Suspense } from 'react';
import { supabase } from '../../lib/supabase';
import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

function StatsContent() {
  const searchParams = useSearchParams();
  const slugOtomatis = searchParams.get('slug');
  const [inputUrl, setInputUrl] = useState('');
  const [data, setData] = useState(null);

  useEffect(() => {
    if (slugOtomatis) {
      setInputUrl(slugOtomatis);
      fetchData(slugOtomatis);
    }
  }, [slugOtomatis]);

  const fetchData = async (code) => {
    const { data: res } = await supabase.from('links').select('*').eq('slug', code).single();
    if (res) setData(res);
  };

  return (
    <main className="container" style={{padding: '100px 20px', textAlign: 'center'}}>
      <h1>Statistik Link</h1>
      <input 
        type="text" 
        value={inputUrl} 
        onChange={(e) => setInputUrl(e.target.value)}
        style={{padding: '12px', width: '300px', borderRadius: '5px', border: '1px solid #ccc'}}
      />
      <button onClick={() => fetchData(inputUrl.split('/').pop())} className="btn-black" style={{marginLeft: '10px'}}>Cek</button>
      
      {data && (
        <div className="result-box" style={{marginTop: '30px', display: 'block', textAlign: 'left'}}>
          <p><strong>Klik:</strong> {data.clicks}</p>
          <p><strong>URL:</strong> {data.original_url}</p>
        </div>
      )}
    </main>
  );
}

export default function StatsPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="container">Loading...</div>}>
        <StatsContent />
      </Suspense>
      <Footer />
    </>
  );
}
