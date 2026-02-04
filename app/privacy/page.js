"use client";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { siteConfig } from '../lib/config';

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <main>
        <div className="container" style={{ padding: '80px 20px', maxWidth: '900px', margin: '0 auto' }}>
          
          <div className="article-item" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '20px' }}>Privacy Policy</h1>
            <p style={{ color: '#64748b' }}>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>

          <div className="article-item" style={{ textAlign: 'justify', lineHeight: '1.8', color: '#334155' }}>
            <section style={{ marginBottom: '40px' }}>
              <h2>1. Introduction</h2>
              <p>
                Welcome to <strong>{siteConfig.name}</strong>. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at support@{siteConfig.domain}.
              </p>
              <p>
                When you visit our website <strong>{siteConfig.domain}</strong> (the "Website"), and more generally, use any of our services (the "Services", which include the Website), we appreciate that you are trusting us with your personal information. We take your privacy very seriously. In this privacy notice, we seek to explain to you in the clearest way possible what information we collect, how we use it and what rights you have in relation to it.
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2>2. Information We Collect</h2>
              <p>
                As a URL shortening service, <strong>{siteConfig.name}</strong> collects limited information to provide and improve our services. This includes:
              </p>
              <ul>
                <li><strong>Personal Information:</strong> If you create an account, we collect your email address and name.</li>
                <li><strong>URL Data:</strong> We collect and store the original long URLs you submit and the generated short URLs.</li>
                <li><strong>Log and Usage Data:</strong> Our servers automatically collect information when you access or use our Website, such as your IP address, browser type, and the pages you view.</li>
                <li><strong>Device Data:</strong> We collect information about the device you use to access the Services, such as device model and operating system.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2>3. How We Use Your Information</h2>
              <p>
                We use personal information collected via our Website for a variety of business purposes described below:
              </p>
              <ul>
                <li><strong>To facilitate account creation and logon process.</strong></li>
                <li><strong>To redirect users</strong> who click on a shortened link to the original destination URL.</li>
                <li><strong>To generate analytics</strong> regarding the usage of short links (e.g., number of clicks, geographic location of visitors).</li>
                <li><strong>To protect our Services</strong> and prevent spam, abuse, or illegal activities on <strong>{siteConfig.domain}</strong>.</li>
                <li><strong>To respond to legal requests</strong> and prevent harm.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2>4. Cookies and Tracking Technologies</h2>
              <p>
                We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy. 
              </p>
              <p>
                At <strong>{siteConfig.name}</strong>, we use cookies to store your recent link history for your convenience. These cookies are stored locally in your browser and are not used for targeted advertising purposes without your explicit consent.
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2>5. Google AdSense and Third-Party Advertising</h2>
              <p>
                We may use third-party advertising companies to serve ads when you visit the Website. These companies may use information about your visits to this and other websites that are contained in web cookies in order to provide advertisements about goods and services of interest to you.
              </p>
              <p>
                Google, as a third-party vendor, uses cookies to serve ads on <strong>{siteConfig.domain}</strong>. Google's use of the DART cookie enables it to serve ads to our users based on their visit to our sites and other sites on the Internet. Users may opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy.
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2>6. Data Security</h2>
              <p>
                We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2>7. Your Privacy Rights</h2>
              <p>
                In some regions (like the European Economic Area), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability.
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2>8. Changes to This Policy</h2>
              <p>
                We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.
              </p>
            </section>

            <section style={{ marginBottom: '40px' }}>
              <h2>9. Contact Us</h2>
              <p>
                If you have questions or comments about this notice, you may email us at <strong>privacy@{siteConfig.domain}</strong> or by post to the address provided in our contact information.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
