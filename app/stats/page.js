"use client";
import { useState, useEffect, Suspense } from 'react';
import { supabase } from '../../lib/supabase';
import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

function StatsContent() {
  const searchParams = useSearchParams();
  const autoSlug = searchParams.get('slug'); 
  const [inputUrl, setInputUrl] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (code) => {
    if (!code) return;
    setLoading(true);
    const cleanCode = code.split('/').pop();
    const { data: res, error } = await supabase
      .from('links')
      .select('*')
      .eq('slug', cleanCode)
      .single();
    
    if (res) setData(res);
    setLoading(false);
  };

  useEffect(() => {
    if (autoSlug) {
      setInputUrl(autoSlug);
      fetchData(autoSlug);
    }
  }, [autoSlug]);

  return (
    <main style={{ minHeight: '80vh', background: 'radial-gradient(circle, #f8fafc 0%, #f1f5f9 100%)' }}>
      <div className="container" style={{ padding: '80px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* HEADER SECTION */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px' }}>Link Analytics</h1>
          <p style={{ color: '#64748b' }}>Track your link performance and visitor engagement.</p>
        </div>

        {/* SEARCH BOX */}
        <div style={{ 
          background: '#fff', 
          padding: '10px', 
          borderRadius: '20px', 
          boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
          display: 'flex',
          width: '100%',
          maxWidth: '500px',
          marginBottom: '40px',
          border: '1px solid #e2e8f0'
        }}>
          <input 
            type="text" 
            value={inputUrl} 
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Enter your short code or link..." 
            style={{ flex: 1, border: 'none', padding: '12px 20px', outline: 'none', fontSize: '1rem', background: 'transparent' }}
          />
          <button 
            onClick={() => fetchData(inputUrl)} 
            className="btn-black" 
            style={{ borderRadius: '14px', padding: '0 25px' }}
          >
            {loading ? '...' : 'Track'}
          </button>
        </div>

        {/* DATA RESULT */}
        {data ? (
          <div style={{ width: '100%', maxWidth: '600px', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ 
              background: '#fff', 
              padding: '30px', 
              borderRadius: '24px', 
              border: '1px solid #e2e8f0',
              boxShadow: '0 20px 40px rgba(0,0,0,0.04)'
            }}>
              <div style={{ marginBottom: '25px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Engagement</span>
                <h2 style={{ fontSize: '4rem', fontWeight: '900', margin: '5px 0' }}>{data.clicks || 0}</h2>
                <p style={{ color: '#64748b' }}>Total Clicks</p>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <span style={{ color: '#64748b' }}>Original URL</span>
                  <span style={{ fontWeight: '600', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {data.original_url}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <span style={{ color: '#64748b' }}>Short Alias</span>
                  <span style={{ fontWeight: '600', color: 'var(--accent)' }}>{data.slug}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Created Date</span>
                  <span style={{ fontWeight: '600' }}>{new Date(data.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
        ) : !loading && autoSlug && (
          <div style={{ color: '#ef4444' }}>Link not found. Please check your code.</div>
        )}

        {/* SIMPLE ARTICLE AREA */}
        <div style={{ marginTop: '80px', width: '100%', maxWidth: '800px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Real-time Tracking</h3>
            <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: '0.9rem' }}>
              We provide accurate, real-time data for every click your link receives. Monitor your traffic as it happens.
            </p>
          </div>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Data Privacy</h3>
            <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: '0.9rem' }}>
              Your analytics are secure. We only track essential engagement metrics to help you understand your reach.
            </p>
          </div>
        </div>

      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}

export default function StatsPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <div className="container" style={{ padding: '100px', textAlign: 'center' }}>
          <div className="loading-spinner"></div>
          <p>Analyzing link data...</p>
        </div>
      }>
        <StatsContent />
      </Suspense>
      <Footer />
    </>
  );
}
