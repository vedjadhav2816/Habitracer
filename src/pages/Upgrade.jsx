import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/upgrade.css";

export default function Upgrade() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentPlan, setCurrentPlan] = useState("free");
  const [loading, setLoading] = useState(true);
  const [hoveredPlan, setHoveredPlan] = useState(null);

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

  // Common Pro Features (same for all paid plans)
  const proFeatures = [
    { name: "Unlimited Quests", included: true, icon: "⚡" },
    { name: "Full Analytics Dashboard", included: true, icon: "📊" },
    { name: "All 6 Character Tiers", included: true, icon: "🌟" },
    { name: "Exclusive Pro Skins", included: true, icon: "✨" },
    { name: "Priority Reminders", included: true, icon: "🔔" },
    { name: "Custom Themes", included: true, icon: "🎨" },
    { name: "Legend Badge", included: true, icon: "🏆" },
    { name: "VIP Support", included: true, icon: "💎" },
  ];

  const plans = [
    {
      id: "free",
      name: "FREE",
      price: "$0",
      period: "Forever",
      description: "Start your journey",
      popular: false,
      mostSold: false,
      tag: "",
      features: [
        { name: "3 Habits", included: true, icon: "✓" },
        { name: "Basic Character", included: true, icon: "✓" },
        { name: "Streak Tracking", included: true, icon: "✓" },
        { name: "Analytics", included: false, icon: "✗" },
        { name: "Pro Characters", included: false, icon: "✗" },
        { name: "Unlimited Quests", included: false, icon: "✗" },
        { name: "Priority Support", included: false, icon: "✗" },
      ],
      buttonText: "Current Plan",
      buttonAction: () => navigate("/dashboard"),
      color: "#00e5ff",
      savings: ""
    },
    {
      id: "monthly",
      name: "PRO MONTHLY",
      price: "$3",
      period: "/month",
      description: "Best for trying out",
      popular: false,
      mostSold: false,
      tag: "",
      features: proFeatures,
      buttonText: "Start Pro",
      buttonAction: () => handleUpgrade("monthly", 3, "month"),
      color: "#00e5ff",
      savings: ""
    },
    {
      id: "semi",
      name: "PRO 6 MONTHS",
      price: "$18",
      period: "/6 months",
      description: "Most Popular Choice",
      popular: true,
      mostSold: true,
      tag: "🔥 MOST POPULAR",
      features: proFeatures,
      buttonText: "Save 40% →",
      buttonAction: () => handleUpgrade("semi", 18, "6 months"),
      color: "#a855f7",
      savings: "Save $18 vs monthly"
    },
    {
      id: "lifetime",
      name: "LIFETIME",
      price: "$30",
      period: "One-time",
      description: "Best value ever",
      popular: false,
      mostSold: false,
      tag: "⭐ BEST DEAL",
      features: proFeatures,
      buttonText: "Go Legend →",
      buttonAction: () => handleUpgrade("lifetime", 30, "lifetime"),
      color: "#ffd84d",
      savings: "Pay once, use forever"
    }
  ];

  const handleUpgrade = (planType, amount, period) => {
    localStorage.setItem("selectedPlan", planType);
    localStorage.setItem("selectedAmount", amount);
    alert(`✨ Upgrade to ${planType} plan - $${amount}\n\nPayment integration coming soon!\nYou'll get unlimited quests, full analytics, and all pro features!`);
  };

  // Calculate savings percentage
  const getSavingsBadge = (plan) => {
    if (plan.id === "semi") {
      return (
        <div className="savings-badge">
          <span>🔥</span> Save 40%
        </div>
      );
    }
    if (plan.id === "lifetime") {
      return (
        <div className="savings-badge lifetime">
          <span>⭐</span> Best Value
        </div>
      );
    }
    return null;
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
        {/* Header - Compact */}
        <div className="upgrade-header">
          <div className="upgrade-badge">💰 UNLOCK FULL POWER</div>
          <h1>Choose Your <span className="gradient-text">Hero Path</span></h1>
          <p className="upgrade-subtitle">
            Start free. Upgrade for unlimited quests, analytics, and exclusive character skins.
          </p>
        </div>

        {/* Pricing Cards - Centered Layout */}
        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div 
              key={plan.id} 
              className={`pricing-card ${plan.popular ? "popular" : ""} ${currentPlan === plan.id ? "current" : ""} ${hoveredPlan === plan.id ? "hovered" : ""}`}
              style={{ '--plan-color': plan.color }}
              onMouseEnter={() => setHoveredPlan(plan.id)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              {/* Tags and Badges */}
              {plan.mostSold && <div className="most-sold-badge">{plan.tag}</div>}
              {plan.popular && !plan.mostSold && <div className="popular-badge">BEST VALUE</div>}
              {getSavingsBadge(plan)}
              
              {/* Plan Header */}
              <div className="plan-header">
                <h3 style={{ color: plan.color }}>{plan.name}</h3>
                <div className="plan-price">
                  <span className="price">{plan.price}</span>
                  <span className="period">{plan.period}</span>
                </div>
                {plan.savings && <div className="plan-savings">{plan.savings}</div>}
                <p className="plan-description">{plan.description}</p>
              </div>

              {/* Features List - Compact */}
              <div className="plan-features">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className={`feature-item ${feature.included ? "included" : "excluded"}`}>
                    <span className="feature-icon">{feature.icon}</span>
                    <span className="feature-name">{feature.name}</span>
                  </div>
                ))}
              </div>

              {/* Social Proof / Urgency */}
              {plan.id === "semi" && (
                <div className="social-proof">
                  <div className="proof-stars">★★★★★ (2,847+)</div>
                  <div className="proof-text">Most chosen plan this month</div>
                </div>
              )}
              {plan.id === "lifetime" && (
                <div className="social-proof">
                  <div className="proof-text">🎯 3,200+ legends already</div>
                </div>
              )}
              {plan.id === "monthly" && (
                <div className="social-proof">
                  <div className="proof-text">📈 No commitment, cancel anytime</div>
                </div>
              )}

              {/* CTA Button */}
              <button 
                className={`plan-button ${plan.popular ? "popular-btn" : ""} ${currentPlan === plan.id ? "current-btn" : ""}`}
                onClick={plan.buttonAction}
                disabled={currentPlan === plan.id}
              >
                {currentPlan === plan.id ? "✓ CURRENT PLAN" : plan.buttonText}
              </button>

              {/* Risk Reversal */}
              {plan.id !== "free" && (
                <div className="risk-reversal">
                  🔒 7-day money-back guarantee
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Trust Badges - Compact */}
        <div className="trust-badges">
          <div className="trust-item">
            <span>🔒</span>
            <p>256-bit SSL Secure</p>
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

        {/* FAQ - Minimal */}
        <div className="faq-mini">
          <p>✨ <strong>14,000+ heroes</strong> upgraded this month • <strong>4.9/5</strong> from 8,342 reviews</p>
        </div>
      </div>
    </div>
  );
}