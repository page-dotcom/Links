import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { siteConfig } from '../../lib/config';

export const metadata = {
  title: `Privacy Policy - ${siteConfig.name}`,
  description: `Detailed Privacy Policy for ${siteConfig.name}. Learn how we handle your data, security protocols, and compliance with global privacy standards.`,
};

export default function PrivacyPolicy() {
  const lastUpdated = "February 5, 2026";

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh', paddingTop: '40px' }}>
        <div style={{ 
          padding: '40px 24px', 
          maxWidth: '850px', 
          margin: '0 auto',
          fontFamily: 'Inter, -apple-system, sans-serif'
        }}>
          
          {/* Section 1: Title & Introduction */}
          <div style={{ marginBottom: '60px', borderBottom: '2px solid #f1f5f9', paddingBottom: '30px' }}>
            <h1 style={{ 
              fontSize: 'clamp(2.5rem, 7vw, 3.5rem)', 
              fontWeight: '900', 
              color: '#0f172a', 
              marginBottom: '15px',
              letterSpacing: '-0.05em' 
            }}>
              Privacy Policy
            </h1>
            <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
              Effective Date: {lastUpdated} | Version 2.0.4
            </p>
          </div>

          <div style={{ 
            lineHeight: '1.8', 
            color: '#334155', 
            fontSize: '1.1rem',
            textAlign: 'left'
          }}>
            
            <section style={{ marginBottom: '50px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '20px', color: '#0f172a' }}>
                1. Comprehensive Commitment to Privacy
              </h2>
              <p style={{ marginBottom: '20px' }}>
                Welcome to <strong>{siteConfig.name}</strong> (accessible at {siteConfig.domain}). We recognize that your privacy is critically important. This Privacy Policy outlines the types of personal and technical information we collect when you use our URL shortening services and how we use, maintain, and protect that information.
              </p>
              <p style={{ marginBottom: '20px' }}>
                In an era of digital transparency, we are committed to ensuring that your data is handled with the highest standards of security. By utilizing our platform to shorten, manage, or track URLs, you consent to the data practices described in this statement. This policy applies to all visitors, users, and others who access the Service.
              </p>
            </section>

            <section style={{ marginBottom: '50px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '20px', color: '#0f172a' }}>
                2. Data Collection and Information Harvesting
              </h2>
              <p style={{ marginBottom: '20px' }}>
                We collect information in several ways to provide a functional and safe environment. When you use our "Shorten" feature, we store the original "Long URL" and associate it with a unique "Slug" in our secure database.
              </p>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '15px' }}>2.1 Log Data and Technical Information</h3>
              <p style={{ marginBottom: '20px' }}>
                Every time a shortened link is accessed, our servers automatically record certain information. This log data may include your IP address (anonymized in many cases), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, and the time spent on those pages.
              </p>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '15px' }}>2.2 Analytical Data</h3>
              <p style={{ marginBottom: '20px' }}>
                We use internal analytics tools to track the number of clicks on each link. This information is used solely to provide link owners with performance metrics and to monitor the Service for fraudulent activity or violations of our Terms of Service.
              </p>
            </section>

            <section style={{ marginBottom: '50px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '20px', color: '#0f172a' }}>
                3. Advanced Cookie Policy and Tracking
              </h2>
              <p style={{ marginBottom: '20px' }}>
                Cookies are files with a small amount of data which may include an anonymous unique identifier. <strong>{siteConfig.name}</strong> uses cookies to track your "Recent Links" history locally. This feature is designed for user convenience, allowing you to manage your links without creating a formal account.
              </p>
              <p style={{ marginBottom: '20px' }}>
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use the "Recent Links" history feature of our Service. We do not use these cookies for cross-site behavioral tracking or profiling for marketing purposes.
              </p>
            </section>

            <section style={{ marginBottom: '50px', background: '#f8fafc', padding: '30px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '20px', color: '#0f172a' }}>
                4. Third-Party Advertising and Google AdSense Compliance
              </h2>
              <p style={{ marginBottom: '20px' }}>
                We may use third-party advertising companies to serve ads when you visit our website. These companies may use information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
              </p>
              <p style={{ marginBottom: '20px' }}>
                Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of the DART cookie enables it to serve ads to our users based on their visit to our site and other sites on the Internet. Users may opt out of the use of the DART cookie by visiting the Google Ad and Content Network privacy policy.
              </p>
            </section>

            <section style={{ marginBottom: '50px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '20px', color: '#0f172a' }}>
                5. Security Protocols and Infrastructure
              </h2>
              <p style={{ marginBottom: '20px' }}>
                The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.
              </p>
              <p>
                We implement SSL (Secure Sockets Layer) encryption for all data transfers and use encrypted database storage to protect the integrity of the shortened URLs and your associated IP logs.
              </p>
            </section>

            <section style={{ marginBottom: '50px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '20px', color: '#0f172a' }}>
                6. Link Content and User Responsibility
              </h2>
              <p style={{ marginBottom: '20px' }}>
                Our Service allows users to shorten any URL. We do not own or control the content of the destination websites. We are not responsible for the privacy practices of such other sites. We encourage our users to be aware when they leave our site and to read the privacy statements of each and every website that collects personally identifiable information.
              </p>
            </section>

            <section style={{ marginBottom: '50px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '20px', color: '#0f172a' }}>
                7. Contact Us for Privacy Concerns
              </h2>
              <p style={{ marginBottom: '20px' }}>
                If you have any questions about this Privacy Policy or wish to report a privacy violation, please contact us at:
              </p>
              <p style={{ fontSize: '1.3rem', fontWeight: '700', color: '#3b82f6' }}>
                support@{siteConfig.domain}
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
