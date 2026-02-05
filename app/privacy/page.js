import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { siteConfig } from '../../lib/config';

export const metadata = {
  title: `Privacy Policy - ${siteConfig.name}`,
  description: `Detailed Privacy Policy for ${siteConfig.name}. Compliance with global data protection standards.`,
};

export default function PrivacyPolicy() {
  const lastUpdated = "February 5, 2026";

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', color: '#1f2937' }}>
          
          {/* Judul Utama - Ukuran Normal & Rapi */}
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>
              Privacy Policy
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
              Last Updated: {lastUpdated} | Version 2.0.4
            </p>
          </div>

          <div style={{ lineHeight: '1.7', fontSize: '1rem', textAlign: 'left' }}>
            
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '16px', color: '#111827' }}>
                1. Introduction and Scope
              </h2>
              <p style={{ marginBottom: '16px' }}>
                At <strong>{siteConfig.name}</strong>, available at {siteConfig.domain}, your privacy is our most significant priority. This Privacy Policy is designed to help you understand how we collect, use, and safeguard the information you provide to us and to assist you in making informed decisions when using our Service.
              </p>
              <p style={{ marginBottom: '16px' }}>
                This policy applies to our URL shortening service, our website, and any other services we provide. By accessing or using our Service, you signify that you have read, understood, and agree to our collection, storage, use, and disclosure of your personal information as described in this Privacy Policy.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '16px', color: '#111827' }}>
                2. Information We Collect
              </h2>
              <p style={{ marginBottom: '16px' }}>
                We collect "Non-Personal Information" and "Personal Information." Non-Personal Information includes information that cannot be used to personally identify you, such as anonymous usage data, general demographic information we may collect, referring/exit pages and URLs, platform types, preferences you submit and preferences that are generated based on the data you submit and number of clicks.
              </p>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px' }}>2.1 Technical Redirect Data</h3>
              <p style={{ marginBottom: '16px' }}>
                When you use our tool to shorten a URL, we store the destination URL and a unique identifier. For every click on a shortened link, we log the visitor's IP address, browser type, and operating system solely for the purpose of preventing fraud and providing analytics to the link creator.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '16px', color: '#111827' }}>
                3. Cookies and Local Storage
              </h2>
              <p style={{ marginBottom: '16px' }}>
                To enhance your experience, we use "Cookies." A cookie is a small text file that is stored on a user's computer for record-keeping purposes. We use cookies to store your recent link history locally in your browser so you can access them later without an account.
              </p>
              <p style={{ marginBottom: '16px' }}>
                We do not use cookies to collect personal information or for cross-site tracking. You may refuse the use of cookies by selecting the appropriate settings on your browser, but please note that if you do this you may not be able to use the full functionality of this website.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '16px', color: '#111827' }}>
                4. Advertising and Third-Party Services
              </h2>
              <p style={{ marginBottom: '16px' }}>
                We may use third-party advertising companies to serve ads when you visit our website. These companies may use information about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
              </p>
              <p style={{ marginBottom: '16px' }}>
                Specifically, Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '16px', color: '#111827' }}>
                5. Data Security and Encryption
              </h2>
              <p style={{ marginBottom: '16px' }}>
                We implement security measures designed to protect your information from unauthorized access. Your data is protected by encryption, firewalls and Secure Socket Layer (SSL) technology. However, these measures do not guarantee that your information will not be accessed, disclosed, altered or destroyed by breach of such firewalls and secure server software.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '16px', color: '#111827' }}>
                6. Contact Information
              </h2>
              <p style={{ marginBottom: '16px' }}>
                If you have any questions regarding this Privacy Policy or the practices of this site, please contact us by sending an email to:
              </p>
              <p style={{ fontWeight: '700', color: '#2563eb' }}>
                support@{siteConfig.domain}
              </p>
            </section>

            {/* Tambahkan seksi tambahan di sini untuk mencapai 1500 kata sesuai kebutuhan AdSense lo */}

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
