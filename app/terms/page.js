import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { siteConfig } from '../../lib/config';

export const metadata = {
  title: `Terms of Service - ${siteConfig.name}`,
  description: `Please read these terms of service carefully before using ${siteConfig.name} (${siteConfig.domain}). compliance with terms and conditions.`,
};

export default function TermsOfService() {
  const lastUpdated = "February 5, 2026";

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', color: '#1f2937' }}>
          
          {/* Header Section */}
          <div style={{ marginBottom: '40px', borderBottom: '1px solid #f1f5f9', paddingBottom: '24px' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#111827', marginBottom: '8px', letterSpacing: '-0.03em' }}>
              Terms of Service
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
              Effective Date: {lastUpdated}
            </p>
          </div>

          <div style={{ lineHeight: '1.7', fontSize: '1rem', textAlign: 'left' }}>
            
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '16px', color: '#111827' }}>
                1. Agreement and Acceptance of Terms
              </h2>
              <p style={{ marginBottom: '16px' }}>
                By accessing and using the URL shortening services provided by <strong>{siteConfig.name}</strong> at <strong>{siteConfig.domain}</strong>, you acknowledge that you have read, understood, and agreed to be legally bound by these Terms of Service. These terms constitute a legally binding agreement between you and the platform operators.
              </p>
              <p style={{ marginBottom: '16px' }}>
                If you do not agree with any part of these terms, you must immediately cease all access to the website and the use of its features. We reserve the right, at our sole discretion, to modify or replace these Terms at any time without prior notice. Continued use of the Service after such modifications signifies your acceptance of the updated terms.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '16px', color: '#111827' }}>
                2. Detailed Service Description
              </h2>
              <p style={{ marginBottom: '16px' }}>
                <strong>{siteConfig.name}</strong> provides a digital toolset designed to transform long, complex Uniform Resource Locators (URLs) into shorter, manageable aliases. Our Service includes, but is not limited to, link redirection, basic click-through analytics, and a local storage-based history feature.
              </p>
              <p style={{ marginBottom: '16px' }}>
                While we strive for 100% uptime, we do not guarantee that the Service will be uninterrupted, timely, secure, or error-free. We reserve the right to modify or discontinue any aspect of the Service, temporarily or permanently, for maintenance, security updates, or policy changes.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '16px', color: '#111827' }}>
                3. Prohibited Uses and Content Standards
              </h2>
              <p style={{ marginBottom: '16px' }}>
                Maintaining a safe ecosystem is paramount. You are strictly prohibited from using our platform to facilitate, encourage, or conduct any illegal activity. This includes, but is not limited to, the creation of links that redirect to:
              </p>
              <ul style={{ marginBottom: '16px', paddingLeft: '20px' }}>
                <li style={{ marginBottom: '8px' }}>Malware, ransomware, or any form of malicious software designed to harm user devices.</li>
                <li style={{ marginBottom: '8px' }}>Phishing, spoofing, or deceptive content intended to steal sensitive user information.</li>
                <li style={{ marginBottom: '8px' }}>Hate speech, harassment, or content that promotes violence and discrimination.</li>
                <li style={{ marginBottom: '8px' }}>Explicit adult material or non-consensual imagery.</li>
                <li style={{ marginBottom: '8px' }}>Any material that infringes upon the intellectual property rights of others.</li>
              </ul>
              <p style={{ marginBottom: '16px' }}>
                We employ automated and manual systems to detect violations. Any link found in breach of these standards will be terminated immediately, and the associated IP address may be blacklisted from further use of our Service.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '16px', color: '#111827' }}>
                4. Cookies, Privacy, and User History
              </h2>
              <p style={{ marginBottom: '16px' }}>
                To facilitate a seamless user experience without requiring account registration, we utilize browser cookies to store your recent link history for up to seven days. You understand that this data is stored locally on your device and is not synchronized across different browsers or machines.
              </p>
              <p style={{ marginBottom: '16px' }}>
                For detailed information on how we handle your technical data, please refer to our Privacy Policy. By agreeing to these Terms, you also acknowledge the data practices outlined in our Privacy Policy.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '16px', color: '#111827' }}>
                5. Intellectual Property and Ownership
              </h2>
              <p style={{ marginBottom: '16px' }}>
                The Service, including its logo, design, source code, and original content, is the exclusive property of <strong>{siteConfig.name}</strong>. You may not reproduce, duplicate, copy, sell, or exploit any portion of the Service without our express written permission.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '16px', color: '#111827' }}>
                6. Limitation of Liability and Indemnification
              </h2>
              <p style={{ marginBottom: '16px' }}>
                To the maximum extent permitted by applicable law, <strong>{siteConfig.name}</strong> shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the Service. You agree to indemnify and hold us harmless from any claims or demands made by any third party due to or arising out of your violation of these Terms.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '16px', color: '#111827' }}>
                7. Contact for Legal Matters
              </h2>
              <p style={{ marginBottom: '16px' }}>
                For formal inquiries, legal notices, or reporting abuse, please contact our legal team at:
              </p>
              <p style={{ fontWeight: '700', color: '#2563eb', fontSize: '1.1rem' }}>
                legal@{siteConfig.domain}
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
