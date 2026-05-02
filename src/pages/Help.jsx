import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/help.css";

export default function Help() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const categories = [
    { id: "all", name: "All", icon: "📚" },
    { id: "getting-started", name: "Getting Started", icon: "🚀" },
    { id: "account", name: "Account & Billing", icon: "👤" },
    { id: "quests", name: "Quests & Habits", icon: "⚔️" },
    { id: "pro", name: "Pro Features", icon: "⭐" },
    { id: "technical", name: "Technical", icon: "🔧" }
  ];

  const faqs = [
    {
      id: 1,
      question: "How do I create my first quest?",
      answer: "Click on the '+ New Quest' button on your dashboard. Follow the 4-step wizard to name your quest, set duration, choose daily target, and set reminders.",
      category: "getting-started"
    },
    {
      id: 2,
      question: "What's the difference between Free and Pro plans?",
      answer: "Free plan: 3 habits max, basic character, streak tracking. Pro plan: Unlimited quests, full analytics dashboard, all 6 character tiers, priority reminders, custom themes, and exclusive skins.",
      category: "pro"
    },
    {
      id: 3,
      question: "How do I upgrade to Pro?",
      answer: "Go to the Upgrade page from the navigation menu. Choose your preferred plan (Monthly $3, 6 Months $18, or Lifetime $30) and complete the secure payment via Stripe.",
      category: "account"
    },
    {
      id: 4,
      question: "How do I reset my password?",
      answer: "On the login page, click 'Forgot Password'. Enter your email address and we'll send you a password reset link. Follow the instructions to create a new password.",
      category: "account"
    },
    {
      id: 5,
      question: "How does the XP system work?",
      answer: "You earn 10 XP for each day you complete a quest. Streaks and consistency help you level up faster. Each level requires 100 XP. Higher levels unlock new character tiers!",
      category: "quests"
    },
    {
      id: 6,
      question: "Can I cancel my subscription anytime?",
      answer: "Yes! You can cancel your subscription at any time from your Profile settings. No questions asked. Your Pro access will continue until the end of your billing period.",
      category: "account"
    },
    {
      id: 7,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express) and UPI through our secure payment partner Stripe.",
      category: "account"
    },
    {
      id: 8,
      question: "How do I delete my account?",
      answer: "Please contact our support team at support@habitracer.com with your account email. We'll process the deletion within 48 hours.",
      category: "account"
    },
    {
      id: 9,
      question: "Is my data secure?",
      answer: "Absolutely! We use industry-standard encryption (SSL/TLS) for all data transmission. Passwords are hashed using bcrypt, and we follow strict security protocols.",
      category: "technical"
    },
    {
      id: 10,
      question: "How do I set reminders for my quests?",
      answer: "During quest creation, you can enable reminders and set specific days and times. You can also edit reminders from your quest list.",
      category: "quests"
    },
    {
      id: 11,
      question: "What are the character evolution tiers?",
      answer: "There are 6 tiers: Novice (0 XP) → Apprentice (100 XP) → Warrior (250 XP) → Champion (500 XP) → Legend (1000 XP) → Mythic (2000 XP). Each tier unlocks new visual upgrades!",
      category: "pro"
    },
    {
      id: 12,
      question: "How do I contact support?",
      answer: "You can reach us at support@habitracer.com or join our Discord community. Pro users get priority support with 24-hour response time.",
      category: "technical"
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch = searchTerm === "" || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const quickLinks = [
    { title: "Getting Started Guide", icon: "🚀", link: "#getting-started" },
    { title: "Pro Features", icon: "⭐", link: "#pro" },
    { title: "Account Settings", icon: "⚙️", link: "#account" },
    { title: "Billing & Payments", icon: "💳", link: "#billing" },
    { title: "Quest Tutorial", icon: "📖", link: "#quests" },
    { title: "API Documentation", icon: "🔌", link: "#api" }
  ];

  return (
    <div className="help-page">
      <Navbar />

      <div className="help-container">
        {/* Header Section */}
        <div className="help-header">
          <div className="help-badge">❓ HELP CENTER</div>
          <h1>How can we help you?</h1>
          <p>Find answers to common questions, guides, and support resources</p>
          
          {/* Search Bar */}
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="quick-links">
          <h3>Quick Links</h3>
          <div className="quick-links-grid">
            {quickLinks.map((link, index) => (
              <a key={index} href={link.link} className="quick-link-card">
                <span className="quick-link-icon">{link.icon}</span>
                <span>{link.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="categories-section">
          <div className="categories-scroll">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? "active" : ""}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <p className="faq-count">{filteredFaqs.length} answers found</p>
          
          <div className="faq-list">
            {filteredFaqs.map((faq, index) => (
              <div key={faq.id} className={`faq-item ${openFaq === index ? "open" : ""}`}>
                <div className="faq-question" onClick={() => toggleFaq(index)}>
                  <div className="faq-question-content">
                    <span className="faq-question-icon">❓</span>
                    <h4>{faq.question}</h4>
                  </div>
                  <span className="faq-toggle-icon">{openFaq === index ? "−" : "+"}</span>
                </div>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
          
          {filteredFaqs.length === 0 && (
            <div className="no-results">
              <span className="no-results-icon">🔍</span>
              <h3>No results found</h3>
              <p>Try different keywords or contact our support team</p>
              <button onClick={() => navigate("/contact")} className="contact-support-btn">
                Contact Support →
              </button>
            </div>
          )}
        </div>

        {/* Still Need Help Section */}
        <div className="still-need-help">
          <div className="help-card">
            <div className="help-card-icon">💬</div>
            <h3>Still need help?</h3>
            <p>Can't find what you're looking for? Our support team is here to help.</p>
            <div className="help-actions">
              <button onClick={() => navigate("/contact")} className="contact-btn">
                Contact Support →
              </button>
              <button onClick={() => window.open("mailto:support@habitracer.com")} className="email-btn">
                📧 Email Us
              </button>
            </div>
          </div>
          
          <div className="help-card">
            <div className="help-card-icon">💎</div>
            <h3>Pro Priority Support</h3>
            <p>Pro members get priority support with faster response times.</p>
            <button onClick={() => navigate("/upgrade")} className="upgrade-btn">
              Upgrade to Pro →
            </button>
          </div>
        </div>

        {/* Popular Articles */}
        <div className="popular-articles">
          <h3>Popular Articles</h3>
          <div className="articles-grid">
            <a href="#" className="article-link">📖 How to build consistent habits</a>
            <a href="#" className="article-link">🎮 Understanding the RPG system</a>
            <a href="#" className="article-link">📊 Making the most of analytics</a>
            <a href="#" className="article-link">⭐ Pro feature guide</a>
            <a href="#" className="article-link">🔔 Setting up reminders</a>
            <a href="#" className="article-link">🔄 Syncing across devices</a>
          </div>
        </div>
      </div>
    </div>
  );
}