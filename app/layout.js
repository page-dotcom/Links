import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        {/* Script QR Lokal: Biar gak ketergantungan API luar yang sering error */}
        <script 
          src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js" 
          strategy="beforeInteractive"
        ></script>
      </head>
      <body style={{ margin: 0, display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <Header />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
