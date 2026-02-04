"use client";
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main style={{ 
        minHeight: '80vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center',
        background: 'radial-gradient(circle, #f8fafc 0%, #f1f5f9 100%)',
        padding: '20px'
      }}>
        
        {/* ANIMASI ANGKA 404 */}
        <div className="error-animation">
          <h1 style={{ 
            fontSize: 'clamp(8rem, 20vw, 12rem)', 
            fontWeight: '900', 
            margin: '0',
            lineHeight: '1',
            background: 'linear-gradient(135deg, var(--dark) 0%, var(--accent) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-10px'
          }}>
            404
          </h1>
        </div>

        <div style={{ maxWidth: '500px', marginTop: '-20px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '15px' }}>
            Oops! Page Not Found
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '40px', lineHeight: '1.6' }}>
            The link you followed might be broken, or the page may have been removed. 
            Double check the URL or head back to the dashboard.
          </p>

          <Link href="/" className="btn-black" style={{ 
            padding: '15px 40px', 
            borderRadius: '16px', 
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '700',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <span className="material-symbols-rounded">home</span>
            Back to Home
          </Link>
        </div>

        <style jsx>{`
          .error-animation {
            animation: floating 3s ease-in-out infinite;
          }

          @keyframes floating {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }

          .btn-black:hover {
            transform: translateY(-3px);
            background: var(--accent) !important;
            transition: 0.3s;
          }
        `}</style>
      </main>
      <Footer />
    </>
  );
}
