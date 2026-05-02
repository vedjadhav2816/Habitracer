import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/terms.css";

export default function TermsOfService() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="terms-page">
      <Navbar />

      <div className="terms-container">
        {/* Header Section */}
        <div className="terms-header">
          <div className="terms-badge">📜 TERMS OF SERVICE</div>
          <h1>Terms of Service</h1>
          <p>Last updated: May 2, 2025</p>
          <div className="terms-effective">
            <span>✅ Effective Date: May 2, 2025</span>
          </div>
        </div>

        {/* Content Sections */}
        <div className="terms-content">
          {/* Agreement to Terms */}
          <section className="terms-section">
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using HabitRacer ("we," "our," or "us"), you agree to be bound by these Terms 
              of Service and our Privacy Policy. If you disagree with any part of these terms, you may not 
              access or use our services.
            </p>
          </section>

          {/* Description of Service */}
          <section className="terms-section">
            <h2>2. Description of Service</h2>
            <p>
              HabitRacer is a gamified habit-tracking platform that helps users build productive routines 
              through quests, XP, character evolution, and analytics. We offer both free and paid subscription 
              plans with varying features.
            </p>
            <div className="features-list">
              <div className="feature-item">
                <span>⚔️</span> Create and track daily habits/quests
              </div>
              <div className="feature-item">
                <span>🌟</span> Earn XP and level up your character
              </div>
              <div className="feature-item">
                <span>📊</span> Access analytics dashboard (Pro users)
              </div>
              <div className="feature-item">
                <span>🚀</span> Unlimited quests (Pro users)
              </div>
            </div>
          </section>

          {/* User Accounts */}
          <section className="terms-section">
            <h2>3. User Accounts</h2>
            <p>
              To use our services, you must create an account. You are responsible for maintaining the 
              confidentiality of your login credentials and for all activities that occur under your account. 
              You agree to provide accurate, current, and complete information during registration.
            </p>
            <ul className="terms-list">
              <li>You must be at least 13 years old to use our services</li>
              <li>You are responsible for all activity under your account</li>
              <li>You must notify us immediately of any unauthorized use</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
            </ul>
          </section>

          {/* Subscriptions & Payments */}
          <section className="terms-section">
            <h2>4. Subscriptions & Payments</h2>
            <div className="payment-info">
              <div className="payment-card">
                <h3>Free Plan</h3>
                <p>✓ 3 habits max</p>
                <p>✓ Basic character progression</p>
                <p>✓ Streak tracking</p>
              </div>
              <div className="payment-card pro-card">
                <h3>Pro Plan</h3>
                <p>✓ Unlimited quests</p>
                <p>✓ Full analytics dashboard</p>
                <p>✓ All 6 character tiers</p>
                <p>✓ Priority support</p>
                <p className="price">$3/month, $18/6 months, or $30 lifetime</p>
              </div>
            </div>
            <p>
              Subscriptions are billed in advance on a monthly, 6-month, or one-time basis depending on your 
              selected plan. Payments are processed securely through Stripe. You can cancel your subscription 
              at any time from your account settings.
            </p>
          </section>

          {/* Refund Policy */}
          <section className="terms-section">
            <h2>5. Refund Policy</h2>
            <p>
              We offer a 7-day money-back guarantee on all paid plans. If you're not satisfied with our service, 
              contact us within 7 days of your purchase for a full refund. After 7 days, no refunds will be issued 
              for subscription payments.
            </p>
          </section>

          {/* User Responsibilities */}
          <section className="terms-section">
            <h2>6. User Responsibilities</h2>
            <p>You agree not to:</p>
            <ul className="terms-list">
              <li>❌ Use the service for any illegal purpose</li>
              <li>❌ Attempt to gain unauthorized access to our systems</li>
              <li>❌ Interfere with or disrupt the service or servers</li>
              <li>❌ Upload malicious code or content</li>
              <li>❌ Impersonate another person or entity</li>
              <li>❌ Share your account credentials with others</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="terms-section">
            <h2>7. Intellectual Property</h2>
            <p>
              The service and its original content, features, and functionality are owned by HabitRacer and 
              are protected by international copyright, trademark, patent, trade secret, and other intellectual 
              property laws. You may not copy, modify, distribute, or create derivative works without our 
              explicit permission.
            </p>
          </section>

          {/* Data Privacy */}
          <section className="terms-section">
            <h2>8. Data Privacy</h2>
            <p>
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect 
              your personal information. By using our service, you agree to the collection and use of information 
              in accordance with our Privacy Policy.
            </p>
            <button onClick={() => navigate("/privacy")} className="privacy-link-btn">
              Read our Privacy Policy →
            </button>
          </section>

          {/* Termination */}
          <section className="terms-section">
            <h2>9. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any 
              reason whatsoever, including without limitation if you breach these Terms. Upon termination, your 
              right to use the service will cease immediately.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="terms-section">
            <h2>10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, HabitRacer shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages, including without limitation loss of profits, data, 
              use, goodwill, or other intangible losses resulting from your use of or inability to use the service.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="terms-section">
            <h2>11. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will 
              try to provide at least 30 days' notice prior to any new terms taking effect. By continuing to access 
              or use our service after those revisions become effective, you agree to be bound by the revised terms.
            </p>
          </section>

          {/* Governing Law */}
          <section className="terms-section">
            <h2>12. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of India, without regard to 
              its conflict of law provisions. Any disputes arising under these Terms shall be resolved exclusively 
              in the courts located in Mumbai, India.
            </p>
          </section>

          {/* Contact Information */}
          <section className="terms-section contact-section">
            <h2>13. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us:</p>
            <div className="contact-info">
              <div className="contact-item">
                <span>📧</span>
                <a href="mailto:legal@habitracer.com">legal@habitracer.com</a>
              </div>
              <div className="contact-item">
                <span>📍</span>
                <span>Mumbai, India</span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Note */}
        <div className="terms-footer">
          <p>By using HabitRacer, you acknowledge that you have read and understood these Terms of Service.</p>
          <div className="terms-buttons">
            <button onClick={() => navigate("/")} className="home-btn">
              ← Back to Home
            </button>
            <button onClick={() => window.print()} className="print-btn">
              🖨️ Print Terms
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}