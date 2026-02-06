"use client";
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

// --- TOAST/POPUP COMPONENT (Model Pil Hitam) ---
const Toast = ({ message, type }) => {
  if (!message) return null;
  return (
    <div className={`spf_snackbar ${type === 'error' ? 'error' : 'success'}`}>
      <span className="material-symbols-rounded icon">
        {type === 'error' ? 'error' : 'check_circle'}
      </span>
      <span>{message}</span>
    </div>
  );
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  // Fungsi Notifikasi
  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      showToast("Email atau password salah", "error");
      setLoading(false);
    } else {
      showToast("Login berhasil! Masuk...", "success");
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 1000);
    }
  };

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,fill,GRAD@20..48,100..700,0..1,-50..200" />
      
      {/* WRAPPER UTAMA */}
      <div className="spf_login_wrap">
        
        <Toast message={toast.message} type={toast.type} />

        {/* KARTU LOGIN */}
        <div className="spf_login_card">
          
          <div className="spf_header">
            <div className="spf_icon_box">
              <span className="material-symbols-rounded">lock</span>
            </div>
            <h1 className="spf_title">Admin Access</h1>
            <p className="spf_subtitle">Masuk untuk mengelola link.</p>
          </div>

          <form onSubmit={handleLogin} className="spf_form">
            
            <div className="spf_input_group">
              <label>Email</label>
              <div className="spf_input_container">
                <span className="material-symbols-rounded input-icon">mail</span>
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="spf_input_group">
              <label>Password</label>
              <div className="spf_input_container">
                <span className="material-symbols-rounded input-icon">key</span>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="spf_btn_submit">
              {loading ? 'Verifying...' : 'Sign In'}
            </button>

          </form>

        </div>

        <div className="spf_footer">
          &copy; {new Date().getFullYear()} Secure System
        </div>

      </div>

      {/* GLOBAL RESET */}
      <style jsx global>{`
        body { margin: 0; padding: 0; background: #f8fafc; font-family: sans-serif; }
      `}</style>

      {/* CSS KHUSUS LOGIN (Tajam & Rapi) */}
      <style jsx>{`
        .spf_login_wrap {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: #fff; /* Background Putih Bersih */
        }

        .spf_login_card {
          width: 100%;
          max-width: 380px;
          background: #fff;
          /* Shadow halus banget biar elegan */
          /* Gak ada border, clean */
        }

        .spf_header { text-align: center; margin-bottom: 30px; }
        
        .spf_icon_box {
          width: 48px; height: 48px;
          background: #000; color: #fff;
          border-radius: 8px; /* Tajam dikit */
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 15px auto;
        }
        .spf_icon_box span { font-size: 24px; }

        .spf_title { font-size: 1.5rem; font-weight: 800; color: #111; margin: 0 0 5px 0; letter-spacing: -0.5px; }
        .spf_subtitle { font-size: 0.9rem; color: #666; margin: 0; }

        .spf_form { display: flex; flex-direction: column; gap: 20px; }

        .spf_input_group label {
          display: block; font-size: 0.85rem; font-weight: 700; color: #333; margin-bottom: 8px;
        }

        .spf_input_container {
          position: relative; width: 100%;
        }
        .spf_input_container input {
          width: 100%;
          padding: 12px 12px 12px 40px; /* Space buat icon */
          font-size: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 6px; /* TAJAM (Sesuai request) */
          background: #f9fafb;
          outline: none;
          transition: all 0.2s;
        }
        .spf_input_container input:focus {
          background: #fff;
          border-color: #000; /* Hitam saat aktif */
        }
        .input-icon {
          position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
          color: #9ca3af; font-size: 20px; pointer-events: none;
        }

        .spf_btn_submit {
          width: 100%;
          padding: 14px;
          background: #000;
          color: #fff;
          border: none;
          border-radius: 6px; /* TAJAM */
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          margin-top: 10px;
          transition: opacity 0.2s;
        }
        .spf_btn_submit:hover { opacity: 0.9; }
        .spf_btn_submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .spf_footer {
          margin-top: 40px;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        /* POPUP NOTIFIKASI (SNACKBAR) */
        .spf_snackbar {
          position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
          background: #1f2937; color: #fff;
          padding: 12px 24px;
          border-radius: 50px; /* Pil Shape */
          display: flex; align-items: center; gap: 10px;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
          z-index: 9999;
          animation: slideUp 0.3s ease-out;
          min-width: 300px; justify-content: center;
        }
        .spf_snackbar.error { background: #1f2937; border: 1px solid #ef4444; } /* Ada border merah dikit kalo error */
        .spf_snackbar .icon { color: #4ade80; }
        .spf_snackbar.error .icon { color: #ef4444; }

        @keyframes slideUp { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
      `}</style>
    </>
  );
}
