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
  const [showResult, setShowResult] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });
  const [origin, setOrigin] = useState('');

  // 1. Ambil data browser (Origin & LocalStorage) setelah mount
  useEffect(() => {
    setOrigin(window.location.origin);
    const saved = JSON.parse(localStorage.getItem('recentLinks') || '[]');
    setRecentLinks(saved);
  }, []);

  const showToast = (message, type) => {
    setToast({ show: true, msg: message, type });
    setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 3000);
  };

  const processLink = async () => {
    const input = url.trim().toLowerCase();
    if (!input) return showToast("Mohon isi URL!", "error");
    
    // Blacklist check
    const blacklist = ["localhost", "127.0.0.1", "tes.vercel.app", window.location.hostname.toLowerCase()];
    if (blacklist.some(kata => input.includes(kata))) {
      return showToast("Link ini dilarang!", "error");
    }

    setLoading(true);
    const slug = Math.random().toString(36).substring(2, 7);
    const fullLink = `${origin}/${slug}`;

    const { error } = await supabase
      .from('links')
      .insert([{ original_url: url, slug: slug, clicks: 0 }]);

    if (error) {
      showToast("Gagal simpan ke database!", "error");
    } else {
      setHasil(fullLink);
      setShowResult(true);
      const newRecent = [{ original: url, short: fullLink, slug: slug }, ...recentLinks].slice(0, 5);
      setRecentLinks(newRecent);
      localStorage.setItem('recentLinks', JSON.stringify(newRecent));
      showToast("Link berhasil dibuat!", "success");
      setUrl('');
    }
    setLoading(false);
  };

  const downloadQR = (link, slug) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}`;
    fetch(qrUrl)
      .then(res => res.blob())
      .then(blob => {
        const urlBlob = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = urlBlob;
        a.download = `QR-ShortPro-${slug}.png`;
        a.click();
        showToast("QR Berhasil diunduh!", "success");
      });
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Berhasil disalin!", "success");
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
            {!showResult ? (
              <div id="state-input" className="input-box">
                <input 
                  type="url" 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)} 
                  placeholder="Tempel URL panjang di sini..." 
                />
                <button className="btn-black" onClick={processLink} disabled={loading}>
                  {loading ? '...' : 'Shorten'}
                  <span className="material-symbols-rounded">arrow_forward</span>
                </button>
              </div>
            ) : (
              <div id="state-result" className="result-box" style={{ display: 'flex' }}>
                <span className="material-symbols-rounded" style={{ color: 'var(--accent)' }}>check_circle</span>
                <span className="result-text">{hasil}</span>
                <button className="btn-black copy" style={{ background: 'var(--accent)' }} onClick={() => copyText(hasil)}>
                  Copy Link
                </button>
                <button className="btn-icon" onClick={() => setShowResult(false)}>
                  <span className="material-symbols-rounded">refresh</span>
                </button>
              </div>
            )}
          </div>

          <div className="recent-section">
            <span className="section-label">Your Recent Links:</span>
            {recentLinks.map((item, index) => (
              <div key={index} className="link-row">
                <div className="link-info">
                  <a href={item.short} target="_blank" className="short">{item.short.replace(/^https?:\/\//, '')}</a>
                  <span className="long">{item.original}</span>
                </div>
                <div className="actions">
                  <button className="btn-icon" title="Copy" onClick={() => copyText(item.short)}>
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
            ))}
          </div>
        </div>

        {/* TEMPLATE KONTEN LO JANGAN DIHAPUS */}
        <div className="premium-box">
          <div className="premium-content">
            <div className="premium-header">
              <span className="material-symbols-rounded icon-star">verified</span>
              <h3>Want More? Try Premium Features!</h3>
            </div>
            <p className="premium-desc">Custom short links, powerful dashboard, detailed analytics, API, UTM builder, QR codes, browser extension, app integrations and support.</p>
          </div>
          <button className="btn-black btn-cta">Start Free</button>
        </div>

        {/* FEATURE GRID & ARTICLE TETAP TARUH DI SINI SESUAI TEMPLATE LO */}
      </main>
      <Footer />

      <div id="toast" className={`toast ${toast.show ? 'show' : ''} ${toast.type}`}>
        <span className="material-symbols-rounded">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
        <span id="toast-msg">{toast.msg}</span>
      </div>
    </>
  );
}
