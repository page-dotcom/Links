"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function Home() {
  const [url, setUrl] = useState('');
  const [hasil, setHasil] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentLinks, setRecentLinks] = useState([]);
  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });
  const [showResult, setShowResult] = useState(false);

  // Load History dari LocalStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('recentLinks') || '[]');
    setRecentLinks(saved);
  }, []);

  // Fungsi Toast Notifikasi
  const showToast = (message, type) => {
    setToast({ show: true, msg: message, type });
    setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 3000);
  };

  // Logic Shorten Link
  const processLink = async () => {
    const input = url.trim().toLowerCase();
    
    // Validasi
    if (!input) return showToast("Mohon isi URL terlebih dahulu!", "error");
    
    const blacklist = ["localhost", "127.0.0.1", "tes.vercel.app", window.location.hostname.toLowerCase()];
    if (blacklist.some(kata => input.includes(kata))) {
      return showToast("Link ini dilarang untuk dipendekkan!", "error");
    }

    setLoading(true);
    const slug = Math.random().toString(36).substring(2, 7);
    const fullLink = `${window.location.origin}/${slug}`;

    const { error } = await supabase
      .from('links')
      .insert([{ original_url: url, slug: slug, clicks: 0 }]);

    if (error) {
      showToast("Gagal menyimpan ke database!", "error");
    } else {
      setHasil(fullLink);
      setShowResult(true);
      
      // Update Recent Links (Maks 5)
      const newRecent = [{ original: url, short: fullLink, slug: slug }, ...recentLinks].slice(0, 5);
      setRecentLinks(newRecent);
      localStorage.setItem('recentLinks', JSON.stringify(newRecent));
      
      showToast("Link berhasil dibuat!", "success");
    }
    setLoading(false);
  };

  const resetForm = () => {
    setUrl('');
    setShowResult(false);
    setHasil('');
  };

  const copyResult = (text) => {
    navigator.clipboard.writeText(text || hasil);
    showToast("Link berhasil disalin!", "success");
  };

  // Fungsi Download QR Code Langsung (Tanpa Tampil Gambar)
  const downloadQR = (link, slug) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}`;
    fetch(qrUrl)
      .then(res => res.blob())
      .then(blob => {
        const urlBlob = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = urlBlob;
        a.download = `QR-ShortPro-${slug}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        showToast("QR Code berhasil diunduh!", "success");
      });
  };

  return (
    <>
      <Header />
      <main>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <div className="hero-text">
            <h1>Shorten URLs,<br />Expand Reach.</h1>
            <p className="subtitle">Aplikasi pemendek tautan profesional. Masukkan link panjang di bawah.</p>
          </div>

          <div className="input-wrapper">
            {/* Input State */}
            {!showResult ? (
              <div id="state-input" className="input-box">
                <input 
                  type="url" 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)} 
                  placeholder="Tempel URL panjang di sini..." 
                  required 
                />
                <button className="btn-black" onClick={processLink} disabled={loading}>
                  {loading ? '...' : 'Shorten'}
                  <span className="material-symbols-rounded">arrow_forward</span>
                </button>
              </div>
            ) : (
              /* Result State */
              <div id="state-result" className="result-box" style={{ display: 'flex' }}>
                <span className="material-symbols-rounded" style={{ color: 'var(--accent)' }}>check_circle</span>
                <span id="finalLink" className="result-text">{hasil}</span>
                <button className="btn-black copy" style={{ background: 'var(--accent)' }} onClick={() => copyResult()}>
                  Copy Link
                </button>
                <button className="btn-icon" onClick={resetForm} title="Reset">
                  <span className="material-symbols-rounded">refresh</span>
                </button>
              </div>
            )}
          </div>

          {/* Recent Links Section */}
          <div className="recent-section">
            <span className="section-label">Your Recent Links:</span>

            {recentLinks.length === 0 ? (
              <p style={{ color: '#999', fontSize: '14px', marginTop: '10px' }}>Belum ada link terbaru.</p>
            ) : (
              recentLinks.map((item, index) => (
                <div key={index} className="link-row">
                  <div className="link-info">
                    <a href={item.short} target="_blank" className="short">{item.short.replace('https://', '')}</a>
                    <span className="long">{item.original}</span>
                  </div>
                  <div className="actions">
                    <button className="btn-icon" title="Copy" onClick={() => copyResult(item.short)}>
                      <span className="material-symbols-rounded">content_copy</span>
                    </button>
                    <button className="btn-icon" title="QR Code" onClick={() => downloadQR(item.short, item.slug)}>
                      <span className="material-symbols-rounded">qr_code_2</span>
                    </button>
                    <Link href={`/stats?slug=${item.slug}`} className="btn-icon" title="Analytics">
                      <span className="material-symbols-rounded">bar_chart</span>
                    </Link>
                    <button className="btn-icon" title="View URL" onClick={() => window.open(item.original, '_blank')}>
                      <span className="material-symbols-rounded">open_in_new</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

        {/* PREMIUM BOX */}
        <div className="premium-box">
          <div className="premium-content">
            <div className="premium-header">
              <span className="material-symbols-rounded icon-star">verified</span>
              <h3>Want More? Try Premium Features!</h3>
            </div>
            <p className="premium-desc">
              Custom short links, powerful dashboard, detailed analytics, API, UTM builder, QR codes, browser extension, app integrations and support.
            </p>
          </div>
          <button className="btn-black btn-cta" onClick={() => window.location.href = '/register'}>
            Start Free
          </button>
        </div>

        {/* CONTENT BOTTOM */}
        <div className="content-wrapper-bottom">
          <div className="article-white-box">
            <div className="article-inner">
              <div className="article-item">
                <h3>How URL Shorteners Work</h3>
                <p>Our system works as a smart middleman: we securely store your long links and exchange them for short aliases. When the short link is clicked, our servers will redirect the visitor directly to the original destination without any delay.</p>
              </div>
              <div className="article-item">
                <h3>Simple and fast URL shortener!</h3>
                <p>ShortPro allows to shorten long links from Instagram, Facebook, YouTube, Twitter, Linked In, WhatsApp, TikTok, blogs and any domain name. Just paste the long URL and click the Shorten URL button. On the next page, copy the shortened URL and share it on sites, chat and emails.</p>
              </div>
              <div className="article-item">
                <h3>Shorten, share and track</h3>
                <p>Your shortened URLs can be used in publications, documents, advertisements, blogs, forums, instant messages, and other locations. Track statistics for your business and projects by monitoring the number of hits from your URL with our click counter.</p>
              </div>
            </div>
          </div>

          {/* FEATURE GRID */}
          <div className="feature-grid-fixed">
            <div className="feat-col">
              <div className="icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
              </div>
              <h4>Easy</h4>
              <p>ShortURL is easy and fast, enter long link to get short link</p>
            </div>
            <div className="feat-col">
              <div className="icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
              </div>
              <h4>Shortened</h4>
              <p>Use any link, no matter what size, ShortURL always shortens</p>
            </div>
            <div className="feat-col">
              <div className="icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <h4>Secure</h4>
              <p>Fast and secure, HTTPS protocol and data encryption</p>
            </div>
            <div className="feat-col">
              <div className="icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              </div>
              <h4>Statistics</h4>
              <p>Check the number of clicks that your URL received</p>
            </div>
            <div className="feat-col">
              <div className="icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
              </div>
              <h4>Reliable</h4>
              <p>Spam, viruses and malware links are deleted</p>
            </div>
            <div className="feat-col">
              <div className="icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="12" rx="2" ry="2"></rect><rect x="4" y="14" width="8" height="6" rx="2" ry="2"></rect><line x1="12" y1="20" x2="12" y2="20"></line><line x1="2" y1="20" x2="2" y2="20"></line><line x1="22" y1="20" x2="22" y2="20"></line></svg>
              </div>
              <h4>Devices</h4>
              <p>Compatible with smartphone, tablet and desktop</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Toast Notification Custom */}
      <div id="toast" className={`toast ${toast.show ? 'show' : ''} ${toast.type}`}>
        <span className="material-symbols-rounded">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
        <span>{toast.msg}</span>
      </div>
    </>
  );
}
