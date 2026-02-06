"use client";
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

// --- TOAST COMPONENT (Notifikasi Cantik) ---
const Toast = ({ message, type, onClose }) => {
  if (!message) return null;
  const isError = type === 'error';
  return (
    <div className="spf_toast" style={{ borderLeftColor: isError ? '#ef4444' : '#10b981' }}>
      <span className="material-symbols-rounded" style={{ color: isError ? '#ef4444' : '#10b981', fontSize: '24px' }}>
        {isError ? 'error' : 'check_circle'}
      </span>
      <div>
        <h4 style={{ margin: '0 0 2px 0', fontSize: '0.9rem', fontWeight: '700', color: '#1e293b' }}>
          {isError ? 'Access Denied' : 'Welcome Back'}
        </h4>
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{message}</p>
      </div>
    </div>
  );
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });
  const router = useRouter();

  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      showToast("Email atau password salah.", "error");
      setLoading(false);
    } else {
      showToast("Login sukses! Mengalihkan...", "success");
      // Jeda dikit biar user liat notif sukses
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 1000);
    }
  };

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,fill,GRAD@20..48,100..700,0..1,-50..200" />
      
      {/* Container Full Screen Tanpa Header/Footer */}
      <div className="spf_login_container">
        
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />

        {/* Kartu Login */}
        <div className="spf_login_card">
          
          <div className="spf_card_header">
            <div className="spf_logo_icon">
              <span className="material-symbols-rounded">admin_panel_settings</span>
            </div>
            <h1 className="spf_title">Admin Access</h1>
            <p className="spf_subtitle">Please enter your credentials to continue.</p>
          </div>

          <form onSubmit={handleLogin} className="spf_form">
            
            {/* Input Email */}
            <div className="spf_input_group">
              <label>Email Address</label>
              <div className="spf_input_wrapper">
                <span className="material-symbols-rounded spf_input_icon">mail</span>
                <input 
                  type="email" 
                  placeholder="admin@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="spf_input_group">
              <label>Password</label>
              <div className="spf_input_wrapper">
                <span className="material-symbols-rounded spf_input_icon">lock</span>
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
              {loading ? (
                <span className="spf_loading_dots">Verifying...</span>
              ) : (
                <>
                  Sign In <span className="material-symbols-rounded">arrow_forward</span>
                </>
              )}
            </button>

          </form>

        </div>
        
        <p className="spf_footer_text">Secure System • Authorized Personnel Only</p>

      </div>

      <style jsx>{`
        /* --- SCOPED STYLES (Anti Bentrok) --- */
        .spf_login_container {
          min-height: 100vh;
          width: 100%;
          background: #f1f5f9; /* Background Abu Elegan */
          background-image: radial-gradient(#e2e8f0 1px, transparent 1px);
          background-size: 20px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .spf_login_card {
          background: #ffffff;
          width: 100%;
          max-width: 400px;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border: 1px solid #fff;
        }

        .spf_card_header {
          text-align: center;
          margin-bottom: 30px;
        }

        .spf_logo_icon {
          width: 50px; height: 50px;
          background: #0f172a;
          color: #fff;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 15px auto;
        }
        .spf_logo_icon span { font-size: 28px; }

        .spf_title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 5px 0;
          letter-spacing: -0.5px;
        }

        .spf_subtitle {
          font-size: 0.9rem;
          color: #64748b;
          margin: 0;
        }

        .spf_form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .spf_input_group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: #334155;
          margin-bottom: 8px;
        }

        .spf_input_wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .spf_input_icon {
          position: absolute;
          left: 12px;
          color: #94a3b8;
          font-size: 20px;
        }

        .spf_input_wrapper input {
          width: 100%;
          padding: 12px 12px 12px 40px; /* Space buat icon */
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.2s;
          background: #f8fafc;
        }

        .spf_input_wrapper input:focus {
          border-color: #0f172a;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.1);
        }

        .spf_btn_submit {
          width: 100%;
          padding: 14px;
          background: #0f172a;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s;
          margin-top: 10px;
        }

        .spf_btn_submit:hover {
          background: #1e293b;
        }
        .spf_btn_submit:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }

        .spf_footer_text {
          margin-top: 30px;
          font-size: 0.75rem;
          color: #94a3b8;
          text-align: center;
        }

        /* Toast Styles */
        .spf_toast {
          position: fixed; bottom: 30px; right: 30px; z-index: 9999;
          background: #fff; padding: 16px 20px; border-left: 5px solid #000;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          border-radius: 12px;
          display: flex; gap: 12px; align-items: center;
          animation: slideUp 0.3s ease;
          max-width: 90%;
        }

        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        /* Mobile Adjustments */
        @media (max-width: 480px) {
          .spf_login_card { padding: 30px 20px; }
          .spf_toast { left: 20px; right: 20px; bottom: 20px; }
        }
      `}</style>
    </>
  );
}
