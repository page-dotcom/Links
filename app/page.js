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

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('recentLinks') || '[]');
    setRecentLinks(saved);
  }, []);

  const showToast = (message, type) => {
    setToast({ show: true, msg: message, type });
    setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 3000);
  };

  // FUNGSI DOWNLOAD QR LOKAL (Pake library dari layout)
  const downloadQRLokal = (linkShort, slug) => {
    // Cari wadah sementara
    const div = document.createElement("div");
    new window.QRCode(div, {
      text: linkShort,
      width: 500,
      height: 500
    });

    // Tunggu sebentar sampe library beres gambar
    setTimeout(() => {
      const img = div.querySelector("img");
      if (img) {
        const a = document.createElement("a");
        a.href = img.src;
        a.download = `QR-${slug}.png`;
        a.click();
        showToast("QR Berhasil Diunduh!", "success");
      } else {
        showToast("Gagal generate QR!", "error");
      }
    }, 100);
  };

  const processLink = async () => {
    if (!url) return showToast("Isi URL-nya, Bos!", "error");
    setLoading(true);
    const slug = Math.random().toString(36).substring(2, 7);
    const fullLink = `${window.location.origin}/${slug}`;

    const { error } = await supabase.from('links').insert([{ original_url: url, slug: slug, clicks: 0 }]);

    if (!error) {
      setHasil(fullLink);
      setShowResult(true);
      const newRecent = [{ original: url, short: fullLink, slug: slug }, ...recentLinks].slice(0, 5);
      setRecentLinks(newRecent);
      localStorage.setItem('recentLinks', JSON.stringify(newRecent));
      showToast("Link Jadi!", "success");
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <main className="container">
        {/* Template Input lo di sini */}
        <div className="input-wrapper">
          {!showResult ? (
            <div className="input-box">
              <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste URL..." />
              <button onClick={processLink} className="btn-black">{loading ? '...' : 'Shorten'}</button>
            </div>
          ) : (
            <div className="result-box" style={{display:'flex'}}>
              <span className="result-text">{hasil}</span>
              <button onClick={() => {navigator.clipboard.writeText(hasil); showToast("Copied!", "success")}}>Copy</button>
              <button onClick={() => setShowResult(false)}>Reset</button>
            </div>
          )}
        </div>

        {/* Recent Links Sesuai Template lo */}
        <div className="recent-section">
          {recentLinks.map((item, i) => (
            <div key={i} className="link-row">
              <div className="link-info">
                <span className="short">{item.short}</span>
              </div>
              <div className="actions">
                <button onClick={() => downloadQRLokal(item.short, item.slug)} className="btn-icon" title="Download QR">
                  <span className="material-symbols-rounded">qr_code_2</span>
                </button>
                <Link href={`/stats?slug=${item.slug}`} className="btn-icon">
                  <span className="material-symbols-rounded">bar_chart</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
      
      {/* Toast Notification */}
      <div className={`toast ${toast.show ? 'show' : ''} ${toast.type}`}>
        <span>{toast.msg}</span>
      </div>
    </>
  );
}
