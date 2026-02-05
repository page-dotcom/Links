"use client";
import { useState, useEffect, Suspense } from 'react';
import { supabase } from '../../lib/supabase';
import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { siteConfig } from '../../lib/config';

function StatsContent() {
  const searchParams = useSearchParams();
  const autoSlug = searchParams.get('slug'); 
  const [inputUrl, setInputUrl] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (code) => {
    if (!code) return;
    setLoading(true);
    // Bersihin input kalau user paste full URL
    const cleanCode = code.replace(/^(?:https?:\/\/)?(?:www\.)?[^\/]+\//, "").split('/').pop();
    
    const { data: res } = await supabase
      .from('links')
      .select('*')
      .eq('slug', cleanCode)
      .single();
    
    if (res) setData(res);
    else setData(null); // Reset kalau gak ketemu
    setLoading(false);
  };

  useEffect(() => {
    if (autoSlug) {
      setInputUrl(autoSlug);
      fetchData(autoSlug);
    }
  }, [autoSlug]);

  return (
    <>
      {/* Import Icon Font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,fill,GRAD@20..48,100..700,0..1,-50..200" />
      
      <title>{`Link Analytics - ${siteConfig.name}`}</title>
      <meta name="description" content={`Track your shortened link performance.`} />

      <main style={{ minHeight: '85vh', background: '#f8fafc' }}>
        <div className="container" style={{ padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* Header Title */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', background: '#000', borderRadius: '12px', marginBottom: '20px', color: '#fff' }}>
               <span className="material-symbols-rounded notranslate" style={{ fontSize: '28px' }}>analytics</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '10px', color: '#0f172a' }}>Link Analytics</h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Monitor your traffic performance in real-time.</p>
          </div>

          {/* Search Box - Border Lebih Tajam */}
          <div style={{ 
            background: '#fff', 
            padding: '8px', 
            borderRadius: '12px', // Radius dikurangi (sebelumnya 20px)
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            width: '100%',
            maxWidth: '500px',
            marginBottom: '40px',
            border: '1px solid #e2e8f0',
            alignItems: 'center'
          }}>
            <span className="material-symbols-rounded notranslate" style={{ color: '#94a3b8', marginLeft: '12px', fontSize: '20px' }}>search</span>
            <input 
              type="text" 
              value={inputUrl} 
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Paste short code (e.g., Nmc7jS)" 
              style={{ flex: 1, border: 'none', padding: '12px', outline: 'none', fontSize: '0.95rem', background: 'transparent', color: '#334155' }}
            />
            <button 
              onClick={() => fetchData(inputUrl)} 
              style={{ 
                background: '#000', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '8px', // Radius tajam
                padding: '10px 24px', 
                cursor: 'pointer', 
                fontWeight: '600',
                fontSize: '0.9rem',
                transition: 'all 0.2s'
              }}
            >
              {loading ? '...' : 'Track'}
            </button>
          </div>

          {/* Result Card */}
          {data ? (
            <div style={{ width: '100%', maxWidth: '500px', animation: 'fadeIn 0.5s ease' }}>
              <div style={{ 
                background: '#fff', 
                borderRadius: '16px', // Radius tajam
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                overflow: 'hidden'
              }}>
                
                {/* Big Number Stats */}
                <div style={{ padding: '40px 20px', textAlign: 'center', borderBottom: '1px solid #f1f5f9', background: 'linear-gradient(to bottom, #ffffff, #f8fafc)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <span className="material-symbols-rounded notranslate" style={{ fontSize: '18px' }}>bar_chart</span> Total Clicks
                  </span>
                  <h2 className="notranslate" style={{ fontSize: '4.5rem', fontWeight: '900', margin: '10px 0', color: '#0f172a', lineHeight: '1' }}>
                    {data.clicks || 0}
                  </h2>
                </div>

                {/* Details List */}
                <div style={{ padding: '24px' }}>
                  
                  {/* Item 1: Original URL */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px', gap: '15px' }}>
                    <div style={{ padding: '8px', background: '#eff6ff', borderRadius: '8px', color: '#2563eb' }}>
                      <span className="material-symbols-rounded notranslate" style={{ fontSize: '20px', display: 'block' }}>link</span>
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>Destination URL</span>
                      <a href={data.original_url} target="_blank" rel="noopener noreferrer" className="notranslate" style={{ display: 'block', color: '#0f172a', fontWeight: '600', textDecoration: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.95rem' }}>
                        {data.original_url}
                      </a>
                    </div>
                  </div>

                  {/* Item 2: Short Code */}
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '15px' }}>
                    <div style={{ padding: '8px', background: '#f0fdf4', borderRadius: '8px', color: '#16a34a' }}>
                      <span className="material-symbols-rounded notranslate" style={{ fontSize: '20px', display: 'block' }}>tag</span>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>Short Alias</span>
                      <span className="notranslate" style={{ color: '#0f172a', fontWeight: '600', fontSize: '0.95rem' }}>{data.slug}</span>
                    </div>
                  </div>

                  {/* Item 3: Date */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ padding: '8px', background: '#f1f5f9', borderRadius: '8px', color: '#475569' }}>
                      <span className="material-symbols-rounded notranslate" style={{ fontSize: '20px', display: 'block' }}>calendar_today</span>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>Created</span>
                      <span className="notranslate" style={{ color: '#0f172a', fontWeight: '600', fontSize: '0.95rem' }}>
                        {new Date(data.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ) : !loading && autoSlug && (
            <div style={{ padding: '20px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="material-symbols-rounded notranslate">error</span>
              Link not found in our database.
            </div>
          )}

          {/* Info Grid */}
          <div style={{ marginTop: '60px', width: '100%', maxWidth: '800px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
             <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                 <span className="material-symbols-rounded notranslate" style={{ color: '#2563eb' }}>bolt</span>
                 <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Real-time Data</h3>
               </div>
               <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>Clicks are updated instantly. Monitor traffic spikes as they happen.</p>
             </div>
             
             <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                 <span className="material-symbols-rounded notranslate" style={{ color: '#16a34a' }}>shield</span>
                 <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Privacy First</h3>
               </div>
               <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>We only count hits. No personal user data is stored or shared.</p>
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
    </>
  );
}

export default function StatsPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#94a3b8' }}>Loading analytics...</span>
        </div>
      }>
        <StatsContent />
      </Suspense>
      <Footer />
    </>
  );
}
