import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/contact.css";

export default function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  const contactMethods = [
    {
      icon: "📧",
      title: "Email Us",
      description: "Get a response within 24 hours",
      contact: "support@habitracer.com",
      link: "mailto:support@habitracer.com"
    },
    {
      icon: "💬",
      title: "Discord Community",
      description: "Join our growing community",
      contact: "/discord",
      link: "#"
    },
    {
      icon: "🐦",
      title: "Twitter",
      description: "Follow for updates",
      contact: "@habitracer",
      link: "#"
    },
    {
      icon: "📱",
      title: "Instagram",
      description: "Daily inspiration",
      contact: "@habitracer",
      link: "#"
    }
  ];

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "Click on 'Login' then 'Forgot Password' to receive a password reset link via email."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time from your profile settings. No questions asked."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely! We use industry-standard encryption and security measures to protect your data."
    },
    {
      question: "How do I delete my account?",
      answer: "Contact our support team and they will assist you with account deletion."
    }
  ];

  return (
    <div className="contact-page">
      <Navbar />

      <div className="contact-container">
        {/* Header Section */}
        <div className="contact-header">
          <div className="contact-badge">📬 GET IN TOUCH</div>
          <h1>Contact Us</h1>
          <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        {/* Contact Methods Grid */}
        <div className="contact-methods-grid">
          {contactMethods.map((method, index) => (
            <div key={index} className="contact-method-card">
              <div className="method-icon">{method.icon}</div>
              <h3>{method.title}</h3>
              <p>{method.description}</p>
              <a href={method.link} className="method-link">
                {method.contact} →
              </a>
            </div>
          ))}
        </div>

        {/* Contact Form & Info Section */}
        <div className="contact-main">
          {/* Contact Form */}
          <div className="contact-form-card">
            <h2>Send us a Message</h2>
            <p>Fill out the form below and we'll get back to you within 24 hours.</p>
            
            {submitted && (
              <div className="success-message">
                🎉 Thank you for reaching out! We'll get back to you soon.
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this regarding?"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Tell us how we can help..."
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Sending..." : "Send Message →"}
              </button>
            </form>
          </div>

          {/* FAQ Section */}
          <div className="faq-card">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                  <div className="faq-question">
                    <span className="faq-icon">❓</span>
                    <h4>{faq.question}</h4>
                  </div>
                  <p className="faq-answer">{faq.answer}</p>
                </div>
              ))}
            </div>
            <div className="faq-footer">
              <p>Still have questions?</p>
              <button onClick={() => navigate("/privacy")} className="faq-btn">
                Read our Privacy Policy →
              </button>
            </div>
          </div>
        </div>

        {/* Office Hours */}
        <div className="office-hours">
          <div className="hours-card">
            <div className="hours-icon">🕒</div>
            <div className="hours-content">
              <h3>Support Hours</h3>
              <p>Monday - Friday: 9:00 AM - 6:00 PM (IST)</p>
              <p>Saturday: 10:00 AM - 4:00 PM (IST)</p>
              <p>Sunday: Closed (but we'll respond on Monday!)</p>
            </div>
          </div>
          <div className="response-card">
            <div className="response-icon">⚡</div>
            <div className="response-content">
              <h3>Average Response Time</h3>
              <p>Email: <strong>Within 24 hours</strong></p>
              <p>Discord: <strong>Within 12 hours</strong></p>
              <p>Emergency: <strong>Priority support for Pro users</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}