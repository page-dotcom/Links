"use client";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { siteConfig } from '../../lib/config';

// Metadata untuk SEO (Penting buat Google)
export const metadata = {
  title: `Privacy Policy - ${siteConfig.name}`,
  description: `Read the privacy policy for ${siteConfig.name} (${siteConfig.domain}). Learn how we protect your data and privacy.`,
};

export default function PrivacyPolicy() {
  const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <>
      <Header />
      <main>
        <div className="container" style={{ padding: '80px 24px', maxWidth: '800px', margin: '0 auto' }}>
          
          {/* Judul Utama */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '16px', letterSpacing: '-1px' }}>
              Privacy Policy
            </h1>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
              Last Updated on {lastUpdated}
            </p>
          </div>

          <div style={{ lineHeight: '1.8', color: '#334155', fontSize: '1.05rem' }}>
            
            {/* Section 1 */}
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '40px', marginBottom: '20px', color: '#0f172a' }}>
              1. Overview and Commitment
            </h2>
            <p style={{ marginBottom: '24px' }}>
              At <strong>{siteConfig.name}</strong>, accessible via <strong>{siteConfig.domain}</strong>, the privacy of our visitors is one of our main priorities. This Privacy Policy document contains types of information that is collected and recorded by our platform and how we use it to provide a secure URL shortening service.
            </p>
            <p style={{ marginBottom: '24px' }}>
              By using our website, you hereby consent to our Privacy Policy and agree to its terms. If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact our team through the official support channels provided on our domain.
            </p>

            {/* Section 2 */}
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '40px', marginBottom: '20px', color: '#0f172a' }}>
              2. Data Collection and Usage
            </h2>
            <p style={{ marginBottom: '24px' }}>
              We collect limited data essential for the operation of <strong>{siteConfig.name}</strong>. This primarily includes the original long URLs you provide and the generated short links. When you interact with our services, we may also log standard information such as your IP address, browser type, and the time of access to monitor for abuse and ensure service stability.
            </p>
            <p style={{ marginBottom: '24px' }}>
              The information we collect is utilized to facilitate the redirection process, maintain the security of our infrastructure, and generate anonymous analytics for users. We do not sell or rent your personal data to third parties for marketing purposes.
            </p>

            {/* Section 3 */}
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '40px', marginBottom: '20px', color: '#0f172a' }}>
              3. Cookie Policy and Storage
            </h2>
            <p style={{ marginBottom: '24px' }}>
              <strong>{siteConfig.name}</strong> uses cookies to enhance your experience. Specifically, we store your recent link history in a local cookie within your browser for a period of seven days. This allows you to manage your links without needing a registered account. These cookies are not used for cross-site tracking or targeted profiling.
            </p>
            <p style={{ marginBottom: '24px' }}>
              You can choose to disable cookies through your individual browser options. However, please note that disabling cookies may affect your ability to view your recent link history on our platform.
            </p>

            {/* Section 4 */}
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '40px', marginBottom: '20px', color: '#0f172a' }}>
              4. Advertising and Google AdSense
            </h2>
            <p style={{ marginBottom: '24px' }}>
              We may partner with third-party vendors, including Google, which use cookies to serve ads based on a user's prior visits to <strong>{siteConfig.domain}</strong> or other websites. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and other sites on the Internet.
            </p>
            <p style={{ marginBottom: '24px' }}>
              Users may opt out of personalized advertising by visiting Google's Ads Settings. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting the Network Advertising Initiative opt-out page.
            </p>

            {/* Section 5 */}
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '40px', marginBottom: '20px', color: '#0f172a' }}>
              5. Legal Obligations and Security
            </h2>
            <p style={{ marginBottom: '24px' }}>
              We will disclose any information we collect, use or receive if required or permitted by law, such as to comply with a subpoena or similar legal process, and when we believe in good faith that disclosure is necessary to protect our rights, protect your safety or the safety of others, investigate fraud, or respond to a government request.
            </p>
            <p style={{ marginBottom: '24px' }}>
              We employ industry-standard security measures to safeguard your data. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security, as no method of transmission over the Internet is 100% secure.
            </p>

            {/* Section 6 */}
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '40px', marginBottom: '20px', color: '#0f172a' }}>
              6. Contact Information
            </h2>
            <p style={{ marginBottom: '24px' }}>
              If you have any questions about this Privacy Policy, please contact us via email at <strong>support@{siteConfig.domain}</strong>. We aim to respond to all inquiries regarding data privacy and security within a reasonable timeframe.
            </p>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
