import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { siteConfig } from '../../lib/config';

export const metadata = {
  title: `Terms of Service - ${siteConfig.name}`,
  description: `Please read these terms of service carefully before using ${siteConfig.name} (${siteConfig.domain}).`,
};

export default function TermsOfService() {
  const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <>
      <Header />
      <main>
        <div className="container" style={{ padding: '80px 24px', maxWidth: '800px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '16px', letterSpacing: '-1px' }}>
              Terms of Service
            </h1>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
              Effective Date: {lastUpdated}
            </p>
          </div>

          <div style={{ lineHeight: '1.8', color: '#334155', fontSize: '1.05rem' }}>
            
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '40px', marginBottom: '20px', color: '#0f172a' }}>
              1. Acceptance of Terms
            </h2>
            <p style={{ marginBottom: '24px' }}>
              By accessing and using the services provided by <strong>{siteConfig.name}</strong> at <strong>{siteConfig.domain}</strong>, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our website or services. These terms apply to all visitors, users, and others who access or use the Service.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '40px', marginBottom: '20px', color: '#0f172a' }}>
              2. Description of Service
            </h2>
            <p style={{ marginBottom: '24px' }}>
              <strong>{siteConfig.name}</strong> is a URL shortening service that allows users to create shorter aliases of long URLs. We provide tools to track click analytics and manage these links. We reserve the right to modify or discontinue, temporarily or permanently, the service with or without notice at any time.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '40px', marginBottom: '20px', color: '#0f172a' }}>
              3. Prohibited Conduct and Content
            </h2>
            <p style={{ marginBottom: '24px' }}>
              You agree not to use <strong>{siteConfig.domain}</strong> for any unlawful purposes or to conduct any unlawful activity. Prohibited activities include, but are not limited to, the creation of links that point to: malware, phishing sites, hate speech, explicit adult content, or any material that violates intellectual property rights.
            </p>
            <p style={{ marginBottom: '24px' }}>
              We reserve the right to remove any shortened link that we determine, in our sole discretion, violates these terms or is otherwise harmful to our service or users. Links that remain inactive for an extended period may also be subject to deletion.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '40px', marginBottom: '20px', color: '#0f172a' }}>
              4. User History and Cookies
            </h2>
            <p style={{ marginBottom: '24px' }}>
              For your convenience, <strong>{siteConfig.name}</strong> may store your recent link history in your browser using cookies. This history is stored for a period of seven days. You are responsible for maintaining the privacy of your own browser and session. Clearing your browser cookies will result in the loss of your local link history on our platform.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '40px', marginBottom: '20px', color: '#0f172a' }}>
              5. Intellectual Property
            </h2>
            <p style={{ marginBottom: '24px' }}>
              The Service and its original content, features, and functionality are and will remain the exclusive property of <strong>{siteConfig.name}</strong> and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of the owners of <strong>{siteConfig.domain}</strong>.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '40px', marginBottom: '20px', color: '#0f172a' }}>
              6. Limitation of Liability
            </h2>
            <p style={{ marginBottom: '24px' }}>
              In no event shall <strong>{siteConfig.name}</strong>, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '40px', marginBottom: '20px', color: '#0f172a' }}>
              7. Termination
            </h2>
            <p style={{ marginBottom: '24px' }}>
              We may terminate or suspend your access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination, including ownership provisions and limitations of liability.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '40px', marginBottom: '20px', color: '#0f172a' }}>
              8. Contact Us
            </h2>
            <p style={{ marginBottom: '24px' }}>
              If you have any questions about these Terms, please contact us at <strong>legal@{siteConfig.domain}</strong>.
            </p>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
