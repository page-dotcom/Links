import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { siteConfig } from '../../lib/config';

export const metadata = {
  title: `Privacy Policy - ${siteConfig.name}`,
  description: `Read the privacy policy for ${siteConfig.name} (${siteConfig.domain}). Learn how we protect your data and privacy.`,
};

export default function PrivacyPolicy() {
  // Gunakan tanggal statis agar tidak berubah setiap kali di-render (bagus untuk SEO)
  const lastUpdated = "February 5, 2026";

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh' }}>
        <div style={{ 
          padding: '60px 20px', 
          maxWidth: '750px', 
          margin: '0 auto',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' 
        }}>
          
          {/* Header Section */}
          <div style={{ textAlign: 'left', marginBottom: '48px', borderBottom: '1px solid #f1f5f9', paddingBottom: '32px' }}>
            <h1 style={{ 
              fontSize: 'clamp(2rem, 8vw, 3rem)', 
              fontWeight: '850', 
              marginBottom: '12px', 
              color: '#0f172a',
              letterSpacing: '-0.04em'
            }}>
              Privacy Policy
            </h1>
            <p style={{ color: '#64748b', fontSize: '1rem', fontWeight: '500' }}>
              Last Updated: {lastUpdated}
            </p>
          </div>

          {/* Content Section */}
          <div style={{ 
            lineHeight: '1.75', 
            color: '#334155', 
            fontSize: '1.1rem',
            textAlign: 'justify' 
          }}>
            
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '16px', color: '#0f172a' }}>
                1. Overview and Commitment
              </h2>
              <p style={{ marginBottom: '20px' }}>
                At <strong>{siteConfig.name}</strong>, accessible via <strong>{siteConfig.domain}</strong>, the privacy of our visitors is our top priority. This document outlines the types of information collected and how we use it to provide a secure URL shortening service.
              </p>
              <p>
                By using our website, you hereby consent to our Privacy Policy. If you have additional questions, do not hesitate to contact our team through the official support channels.
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '16px', color: '#0f172a' }}>
                2. Data Collection and Usage
              </h2>
              <p>
                We collect limited data essential for operation. This primarily includes the original long URLs you provide and generated short links. We may also log standard info like your IP address and browser type to monitor for abuse.
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '16px', color: '#0f172a' }}>
                3. Cookie Policy and Storage
              </h2>
              <p>
                <strong>{siteConfig.name}</strong> uses cookies to enhance your experience. Specifically, we store your recent link history locally in your browser. This allows you to manage links without an account.
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '16px', color: '#0f172a' }}>
                4. Advertising and Partners
              </h2>
              <p>
                Third-party vendors, including Google, use cookies to serve ads based on prior visits to <strong>{siteConfig.domain}</strong>. Google's use of advertising cookies enables it to serve ads to our users based on their visits across the Internet.
              </p>
            </section>

            <section style={{ marginBottom: '40px', padding: '24px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '16px', color: '#0f172a' }}>
                5. Legal Obligations
              </h2>
              <p style={{ fontSize: '0.95rem', fontStyle: 'italic' }}>
                We will disclose information if required by law to protect our rights, your safety, investigate fraud, or respond to a government request.
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '16px', color: '#0f172a' }}>
                6. Contact Information
              </h2>
              <p>
                Questions? Reach out via email at: <br />
                <strong style={{ color: '#3b82f6', fontSize: '1.2rem' }}>support@{siteConfig.domain}</strong>
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
