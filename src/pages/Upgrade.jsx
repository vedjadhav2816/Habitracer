import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/upgrade.css";

export default function Upgrade() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentPlan, setCurrentPlan] = useState("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          navigate("/login");
          return;
        }

        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${userId}`);
        const data = await res.json();
        setUser(data);
        
        // Get current plan from localStorage or backend
        const plan = localStorage.getItem("userPlan") || "free";
        setCurrentPlan(plan);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const plans = [
    {
      id: "free",
      name: "FREE",
      price: "$0",
      period: "Forever free",
      description: "Start your journey",
      popular: false,
      features: [
        { name: "3 habits max", included: true },
        { name: "Basic character", included: true },
        { name: "Streak tracking", included: true },
        { name: "Analytics", included: false },
        { name: "Pro characters", included: false },
        { name: "Unlimited quests", included: false },
      ],
      buttonText: "GET STARTED",
      buttonAction: () => navigate("/dashboard"),
      color: "#00e5ff"
    },
    {
      id: "semi",
      name: "6 MONTHS",
      price: "$18",
      period: "/6mo",
      description: "Best value",
      popular: true,
      features: [
        { name: "Unlimited quests", included: true },
        { name: "Full analytics", included: true },
        { name: "All 6 characters", included: true },
        { name: "Priority reminders", included: true },
        { name: "Custom themes", included: true },
        { name: "Everything in Pro", included: true },
      ],
      buttonText: "START PRO",
      buttonAction: () => handleUpgrade("semi", 18),
      color: "#a855f7"
    },
    {
      id: "lifetime",
      name: "LIFETIME",
      price: "$30",
      period: "One-time payment",
      description: "Best long-term value",
      popular: false,
      features: [
        { name: "Everything in Pro", included: true },
        { name: "Lifetime updates", included: true },
        { name: "Legend badge", included: true },
        { name: "All future features", included: true },
        { name: "VIP support", included: true },
        { name: "Priority access", included: true },
      ],
      buttonText: "GO LEGEND",
      buttonAction: () => handleUpgrade("lifetime", 30),
      color: "#ffd84d"
    }
  ];

  const handleUpgrade = (planType, amount) => {
    // Store selected plan for payment
    localStorage.setItem("selectedPlan", planType);
    localStorage.setItem("selectedAmount", amount);
    // Navigate to payment page (to be implemented)
    alert(`Upgrade to ${planType} plan - $${amount}\nPayment integration coming soon!`);
    // navigate("/payment");
  };

  if (loading) {
    return (
      <div className="upgrade-loading">
        <div className="loading-spinner">⚡</div>
        <p>Loading plans...</p>
      </div>
    );
  }

  return (
    <div className="upgrade-page">
      <div className="upgrade-container">
        {/* Header */}
        <div className="upgrade-header">
          <div className="upgrade-badge">💰 PRICING</div>
          <h1>Start Free, Scale When Ready</h1>
          <p className="upgrade-subtitle">
            3 habits free forever. Upgrade for unlimited quests, full analytics, and exclusive character skins.
          </p>
        </div>

        {/* Current Plan Indicator */}
        {currentPlan !== "free" && (
          <div className="current-plan-banner">
            <span>⭐ You are currently on the <strong>{currentPlan.toUpperCase()}</strong> plan</span>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="pricing-grid">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`pricing-card ${plan.popular ? "popular" : ""} ${currentPlan === plan.id ? "current" : ""}`}
              style={{ '--plan-color': plan.color }}
            >
              {plan.popular && <div className="popular-badge">BEST VALUE</div>}
              
              <div className="plan-header">
                <h3>{plan.name}</h3>
                <div className="plan-price">
                  <span className="price">{plan.price}</span>
                  <span className="period">{plan.period}</span>
                </div>
                <p className="plan-description">{plan.description}</p>
              </div>

              <div className="plan-features">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className={`feature-item ${feature.included ? "included" : "excluded"}`}>
                    <span className="feature-icon">{feature.included ? "✓" : "✗"}</span>
                    <span className="feature-name">{feature.name}</span>
                  </div>
                ))}
              </div>

              <button 
                className={`plan-button ${plan.popular ? "popular-btn" : ""} ${currentPlan === plan.id ? "current-btn" : ""}`}
                onClick={plan.buttonAction}
                disabled={currentPlan === plan.id}
              >
                {currentPlan === plan.id ? "CURRENT PLAN" : plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="trust-badges">
          <div className="trust-item">
            <span>🔒</span>
            <p>Secure Payment</p>
          </div>
          <div className="trust-item">
            <span>💳</span>
            <p>Credit Card / UPI</p>
          </div>
          <div className="trust-item">
            <span>🔄</span>
            <p>Cancel Anytime</p>
          </div>
          <div className="trust-item">
            <span>⭐</span>
            <p>12,400+ Heroes</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h3>Frequently Asked Questions</h3>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>Can I cancel anytime?</h4>
              <p>Yes, you can cancel your subscription at any time. No questions asked.</p>
            </div>
            <div className="faq-item">
              <h4>What payment methods do you accept?</h4>
              <p>We accept all major credit cards, UPI, and net banking.</p>
            </div>
            <div className="faq-item">
              <h4>Is there a refund policy?</h4>
              <p>Yes, we offer a 7-day money-back guarantee on all paid plans.</p>
            </div>
            <div className="faq-item">
              <h4>Can I switch between plans?</h4>
              <p>Absolutely! You can upgrade or downgrade anytime.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}