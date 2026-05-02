import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/privacy.css";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="privacy-page">
      <Navbar />

      <div className="privacy-container">
        {/* Header Section */}
        <div className="privacy-header">
          <div className="privacy-badge">🔒 PRIVACY & TERMS</div>
          <h1>Privacy Policy</h1>
          <p>Last updated: May 2, 2025</p>
          <div className="privacy-effective">
            <span>✅ Effective Date: May 2, 2025</span>
          </div>
        </div>

        {/* Content Sections */}
        <div className="privacy-content">
          {/* Introduction */}
          <section className="privacy-section">
            <h2>1. Introduction</h2>
            <p>
              Welcome to HabitRacer ("we," "our," or "us"). We are committed to protecting your 
              personal information and your right to privacy. This Privacy Policy explains how we 
              collect, use, disclose, and safeguard your information when you use our application 
              and services.
            </p>
            <p>
              By using HabitRacer, you agree to the collection and use of information in accordance 
              with this policy. If you do not agree with any part of this policy, please do not use 
              our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="privacy-section">
            <h2>2. Information We Collect</h2>
            <div className="info-grid">
              <div className="info-card">
                <div className="info-icon">👤</div>
                <h3>Personal Information</h3>
                <p>Name, email address, profile information, and avatar preferences you provide during registration.</p>
              </div>
              <div className="info-card">
                <div className="info-icon">📊</div>
                <h3>Usage Data</h3>
                <p>Quest completions, streak information, XP earned, character progression, and interaction metrics.</p>
              </div>
              <div className="info-card">
                <div className="info-icon">💳</div>
                <h3>Payment Information</h3>
                <p>Subscription details and payment history (processed securely through Stripe).</p>
              </div>
              <div className="info-card">
                <div className="info-icon">🔐</div>
                <h3>Authentication Data</h3>
                <p>Secure authentication via email/password or Google OAuth (no passwords stored in plain text).</p>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="privacy-section">
            <h2>3. How We Use Your Information</h2>
            <ul className="privacy-list">
              <li>✓ Provide, operate, and maintain our services</li>
              <li>✓ Track your habits, quests, and character progression</li>
              <li>✓ Process your subscription payments securely</li>
              <li>✓ Send you important notifications about your account</li>
              <li>✓ Improve and personalize your HabitRacer experience</li>
              <li>✓ Analyze usage patterns to enhance our features</li>
              <li>✓ Prevent fraudulent activities and ensure security</li>
            </ul>
          </section>

          {/* Data Storage & Security */}
          <section className="privacy-section">
            <h2>4. Data Storage & Security</h2>
            <p>
              Your data is stored securely on cloud-based servers (Render, PostgreSQL) with industry-standard 
              encryption. We implement appropriate technical and organizational measures to protect your 
              personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <div className="security-badges">
              <div className="security-badge">
                <span>🔒</span> SSL/TLS Encryption
              </div>
              <div className="security-badge">
                <span>🛡️</span> Secure Database
              </div>
              <div className="security-badge">
                <span>🔐</span> Password Hashing (bcrypt)
              </div>
              <div className="security-badge">
                <span>📋</span> GDPR Compliant
              </div>
            </div>
          </section>

          {/* Cookies & Tracking */}
          <section className="privacy-section">
            <h2>5. Cookies & Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our service and store 
              certain information. Cookies are files with small amount of data which may include an anonymous 
              unique identifier. You can instruct your browser to refuse all cookies or to indicate when a 
              cookie is being sent.
            </p>
          </section>

          {/* Third-Party Services */}
          <section className="privacy-section">
            <h2>6. Third-Party Services</h2>
            <p>We use trusted third-party services to enhance our platform:</p>
            <div className="third-party-grid">
              <div className="third-party-item">
                <strong>Stripe</strong> - Secure payment processing
              </div>
              <div className="third-party-item">
                <strong>Google OAuth</strong> - Authentication services
              </div>
              <div className="third-party-item">
                <strong>Render</strong> - Cloud hosting & database
              </div>
              <div className="third-party-item">
                <strong>PostgreSQL</strong> - Data storage
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section className="privacy-section">
            <h2>7. Data Retention</h2>
            <p>
              We will retain your personal information only for as long as necessary to fulfill the purposes 
              outlined in this Privacy Policy. You may request deletion of your account and associated data 
              at any time by contacting our support team.
            </p>
          </section>

          {/* Your Rights */}
          <section className="privacy-section">
            <h2>8. Your Privacy Rights</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul className="privacy-list">
              <li>✓ Access the personal information we hold about you</li>
              <li>✓ Request correction of inaccurate or incomplete information</li>
              <li>✓ Request deletion of your personal information</li>
              <li>✓ Object to or restrict processing of your data</li>
              <li>✓ Data portability (receive your data in a structured format)</li>
              <li>✓ Withdraw consent at any time</li>
            </ul>
          </section>

          {/* Children's Privacy */}
          <section className="privacy-section">
            <h2>9. Children's Privacy</h2>
            <p>
              Our services are not intended for children under 13 years of age. We do not knowingly collect 
              personally identifiable information from children under 13. If you are a parent or guardian 
              and believe your child has provided us with personal information, please contact us.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="privacy-section">
            <h2>10. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
              the new Privacy Policy on this page and updating the "Last updated" date. You are advised to 
              review this Privacy Policy periodically for any changes.
            </p>
          </section>

          {/* Contact Information */}
          <section className="privacy-section contact-section">
            <h2>11. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <div className="contact-info">
              <div className="contact-item">
                <span>📧</span>
                <a href="mailto:privacy@habitracer.com">privacy@habitracer.com</a>
              </div>
              <div className="contact-item">
                <span>🐦</span>
                <a href="#">@habitracer</a>
              </div>
              <div className="contact-item">
                <span>💬</span>
                <a href="#">Discord Community</a>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Note */}
        <div className="privacy-footer">
          <p>By using HabitRacer, you acknowledge that you have read and understood this Privacy Policy.</p>
          <div className="privacy-buttons">
            <button onClick={() => navigate("/")} className="home-btn">
              ← Back to Home
            </button>
            <button onClick={() => window.print()} className="print-btn">
              🖨️ Print Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}