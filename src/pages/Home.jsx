import { useNavigate } from "react-router-dom";
import "../styles/main.css";
import Footer from "../components/Footer";
export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      id: 1,
      icon: "⚔️",
      title: "RPG Habit System",
      description: "Turn boring routines into exciting quests. Every habit is a mission with real stakes, streaks, and rewards.",
      color: "#00e5ff",
      gradient: "linear-gradient(135deg, #00e5ff20, #00e5ff05)",
      graphic: (
        <div className="feature-graphic quest-graphic">
          <div className="quest-stack">
            <div className="mini-quest">🌅 Morning Run ✓</div>
            <div className="mini-quest">📖 Read 20 Pages ○</div>
            <div className="mini-quest">💧 Drink Water ✓</div>
            <div className="quest-streak">🔥 7 Day Streak!</div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      icon: "🌟",
      title: "Evolving Character",
      description: "Your warrior visually transforms as you grow—from Novice stick figure to Mythic cosmic being across 6 tiers.",
      color: "#a855f7",
      gradient: "linear-gradient(135deg, #a855f720, #a855f705)",
      graphic: (
        <div className="feature-graphic character-graphic">
          <div className="evo-chain">
            <div className="evo-tier">🧙 → ⚔️ → 🛡️ → 👑 → 🌟</div>
            <div className="evo-progress">
              <div className="evo-bar">
                <div className="evo-fill" style={{ width: '64%' }}></div>
              </div>
              <span>Level 3 Warrior</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      icon: "📊",
      title: "Analytics Dashboard",
      description: "Deep insights on daily, weekly, and monthly performance. Heatmaps, completion rates, and habit breakdowns.",
      color: "#22c55e",
      gradient: "linear-gradient(135deg, #22c55e20, #22c55e05)",
      graphic: (
        <div className="feature-graphic analytics-graphic">
          <div className="analytics-preview">
            <div className="mini-stats">
              <span>Daily: 75%</span>
              <span>Weekly: 45%</span>
              <span>Overall: 63%</span>
            </div>
            <div className="mini-heatmap">
              {[...Array(14)].map((_, i) => (
                <div key={i} className={`heat-cell ${Math.random() > 0.6 ? 'active' : ''}`}></div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      icon: "📋",
      title: "3 Habits Free",
      description: "Free Forever Tier: 3 habits, full tracking, and character progression completely free. No credit card required to start.",
      color: "#ffd84d",
      gradient: "linear-gradient(135deg, #ffd84d20, #ffd84d05)",
      graphic: (
        <div className="feature-graphic free-graphic">
          <div className="free-badge">✨ FREE FOREVER ✨</div>
          <div className="habit-limit">
            <div className="habit-slot active">🏃 Morning Run</div>
            <div className="habit-slot active">📖 Read 20 Pages</div>
            <div className="habit-slot active">💧 Drink Water</div>
            <div className="habit-slot locked">🔒 + Unlimited (Pro)</div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      icon: "🔔",
      title: "Smart Reminders",
      description: "Set custom daily reminders with specific days and times. Never let a streak break because you forgot.",
      color: "#f97316",
      gradient: "linear-gradient(135deg, #f9731620, #f9731605)",
      graphic: (
        <div className="feature-graphic reminder-graphic">
          <div className="reminder-preview">
            <div className="reminder-item">
              <span className="reminder-icon">🔔</span>
              <span>Morning Run • 8:00 AM</span>
              <span className="reminder-days">M,T,W,Th,F</span>
            </div>
            <div className="reminder-item">
              <span className="reminder-icon">🔔</span>
              <span>Read • 9:00 PM</span>
              <span className="reminder-days">Daily</span>
            </div>
            <div className="reminder-toggle">
              <span>📱 Push Notifications</span>
              <div className="toggle-switch on"></div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      icon: "🏆",
      title: "XP & Leveling",
      description: "Earn experience points at the end of each successful day. Level up and unlock new character abilities.",
      color: "#ef4444",
      gradient: "linear-gradient(135deg, #ef444420, #ef444405)",
      graphic: (
        <div className="feature-graphic xp-graphic">
          <div className="xp-preview">
            <div className="xp-level">LVL 3</div>
            <div className="xp-bar-container">
              <div className="xp-bar-bg">
                <div className="xp-bar-progress" style={{ width: '64%' }}></div>
              </div>
              <span>64 / 100 XP</span>
            </div>
            <div className="xp-rewards">
              <span>🏆 +10 XP per quest</span>
              <span>⭐ Streak bonuses</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="home">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">HABIT<span>RACER</span></div>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#contact">Contact</a>
          <a href="#help">Help</a>
          <button onClick={() => navigate("/login")} className="login-btn">
            Login
          </button>
          <button onClick={() => navigate("/register")} className="get-started-btn">
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        {/* Badge */}
        <div className="badge">
          🔥 HABIT TRACKING • GAMIFIED
        </div>

        {/* Main Heading */}
        <h1>
          Turn Your Habits Into <br />
          <span className="epic-quests">Epic Quests</span>
        </h1>

        {/* Subtitle */}
        <p className="subtitle">
          Habitracer transforms daily routines into an RPG adventure.<br />
          Build streaks, evolve your character, and level up your life — one habit at a time.
        </p>

        {/* Buttons */}
        <div className="hero-buttons">
          <button 
            onClick={() => navigate("/register")} 
            className="start-quest"
          >
            ⚔️ Start Your Quest — Free
          </button>
          <button 
            onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
            className="see-features"
          >
            See Features ↓
          </button>
        </div>

        {/* Dashboard Preview */}
        <div className="dashboard-preview">
          <div className="dashboard-container">
            {/* Dashboard Header */}
            <div className="dash-header">
              <div className="dash-logo">HABIT<span>RACER</span></div>
              <div className="dash-nav">
                <span className="dash-nav-item active">⚔️ QUESTS</span>
                <span className="dash-nav-item">📊 ANALYTICS</span>
                <span className="dash-nav-item">👤 PROFILE</span>
                <span className="dash-nav-item">⚡ UPGRADE</span>
              </div>
              <div className="dash-user">
                <div className="dash-xp">
                  <span className="xp-label">XP</span>
                  <div className="xp-bar-track">
                    <div className="xp-bar-fill" style={{ width: '64%' }}></div>
                  </div>
                </div>
                <div className="dash-level">LVL 3</div>
                <div className="dash-plan">FREE</div>
                <div className="dash-avatar">🧙</div>
              </div>
            </div>

            {/* Dashboard Main Content */}
            <div className="dash-main">
              <div className="dash-left">
                <div className="stats-grid">
                  <div className="stat-card cyan"><h4>Today</h4><h2>2/3</h2></div>
                  <div className="stat-card gold"><h4>Streak</h4><h2>5</h2></div>
                  <div className="stat-card purple"><h4>XP</h4><h2>140</h2></div>
                  <div className="stat-card green"><h4>Week</h4><h2>67%</h2></div>
                </div>

                <div className="circles-grid">
                  <div className="circle-card">
                    <svg width="90" height="90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#1a2035" strokeWidth="8"/>
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#00e5ff" strokeWidth="8" 
                        strokeDasharray="314" strokeDashoffset="78" strokeLinecap="round"
                        transform="rotate(-90 60 60)"/>
                    </svg>
                    <div className="circle-text">75%<span>DAILY</span></div>
                  </div>
                  <div className="circle-card">
                    <svg width="90" height="90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#1a2035" strokeWidth="8"/>
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#a855f7" strokeWidth="8" 
                        strokeDasharray="314" strokeDashoffset="172" strokeLinecap="round"
                        transform="rotate(-90 60 60)"/>
                    </svg>
                    <div className="circle-text">45%<span>WEEKLY</span></div>
                  </div>
                  <div className="circle-card">
                    <svg width="90" height="90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#1a2035" strokeWidth="8"/>
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#22c55e" strokeWidth="8" 
                        strokeDasharray="314" strokeDashoffset="116" strokeLinecap="round"
                        transform="rotate(-90 60 60)"/>
                    </svg>
                    <div className="circle-text">63%<span>OVERALL</span></div>
                  </div>
                </div>

                <div className="activity-graph">
                  <div className="graph-line"></div>
                </div>

                <div className="quests-list">
                  <div className="quests-header">
                    <span>ACTIVE QUESTS</span>
                    <button className="new-quest-btn">＋ NEW QUEST</button>
                  </div>
                  <div className="quest-item">
                    <div className="quest-info">
                      <span className="quest-icon">🏃</span>
                      <span className="quest-name">Morning Run</span>
                    </div>
                    <div className="complete-btn done"><div className="check-circle">✓</div></div>
                  </div>
                  <div className="quest-item">
                    <div className="quest-info">
                      <span className="quest-icon">📖</span>
                      <span className="quest-name">Read 20 Pages</span>
                    </div>
                    <div className="complete-btn"><div className="check-circle"></div></div>
                  </div>
                  <div className="quest-item">
                    <div className="quest-info">
                      <span className="quest-icon">💧</span>
                      <span className="quest-name">Drink Water</span>
                    </div>
                    <div className="complete-btn done"><div className="check-circle">✓</div></div>
                  </div>
                </div>
              </div>

              <div className="dash-right">
                <div className="character-card">
                  <h4>YOUR CHARACTER</h4>
                  <div className="character-avatar">🧙</div>
                  <h3>Warrior</h3>
                  <div className="character-class">WARRIOR</div>
                  <div className="char-xp-bar"><div className="char-xp-fill" style={{ width: '64%' }}></div></div>
                  <p className="char-xp-text">64 / 100 XP</p>
                  <div className="char-stats">
                    <div className="char-stat"><span>STRENGTH</span><div className="stat-bar-bg"><div className="stat-bar-fill red" style={{ width: '85%' }}></div></div></div>
                    <div className="char-stat"><span>WISDOM</span><div className="stat-bar-bg"><div className="stat-bar-fill cyan" style={{ width: '60%' }}></div></div></div>
                    <div className="char-stat"><span>ENDURANCE</span><div className="stat-bar-bg"><div className="stat-bar-fill green" style={{ width: '75%' }}></div></div></div>
                    <div className="char-stat"><span>FOCUS</span><div className="stat-bar-bg"><div className="stat-bar-fill purple" style={{ width: '70%' }}></div></div></div>
                  </div>
                  <div className="evolution-section">
                    <div className="evolution-label">NEXT EVOLUTION</div>
                    <div className="evolution-bar"><div className="evolution-fill" style={{ width: '28%' }}></div></div>
                    <div className="evolution-text">14 / 50 completions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="features-container">
          <div className="features-header">
            <div className="features-badge">✨ FEATURES</div>
            <h2>Everything You Need to Win</h2>
            <p className="features-subtitle">
              Built for people who want more than a checklist—this is a full habit RPG.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature) => (
              <div 
                key={feature.id} 
                className="feature-card"
                style={{ 
                  '--feature-color': feature.color,
                  '--feature-gradient': feature.gradient 
                }}
              >
                <div className="feature-icon" style={{ background: feature.gradient }}>
                  <span>{feature.icon}</span>
                </div>
                {feature.graphic}
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
            {/* Character Evolution Section */}
      <section className="evolution-section-home" id="evolution">
        <div className="evolution-container">
          <div className="evolution-header">
            <div className="evolution-badge">🌟 CHARACTER EVOLUTION</div>
            <h2>Evolve As You Grow</h2>
            <p className="evolution-subtitle">
              Your character visually upgrades as you complete habits. From Novice to Mythic—every milestone changes your warrior.
            </p>
          </div>

          <div className="evolution-timeline">
            <div className="evolution-stages">
              <div className="stage-card">
                <div className="stage-icon">🧙</div>
                <h4>NOVICE</h4>
                <div className="stage-milestone">Start</div>
                <div className="stage-progress-bar">
                  <div className="stage-progress-fill" style={{ width: '0%' }}></div>
                </div>
              </div>

              <div className="stage-arrow">→</div>

              <div className="stage-card">
                <div className="stage-icon">⚔️</div>
                <h4>APPRENTICE</h4>
                <div className="stage-milestone">10 done</div>
                <div className="stage-progress-bar">
                  <div className="stage-progress-fill" style={{ width: '20%' }}></div>
                </div>
              </div>

              <div className="stage-arrow">→</div>

              <div className="stage-card">
                <div className="stage-icon">🛡️</div>
                <h4>WARRIOR</h4>
                <div className="stage-milestone">25 done</div>
                <div className="stage-progress-bar">
                  <div className="stage-progress-fill" style={{ width: '50%' }}></div>
                </div>
              </div>

              <div className="stage-arrow">→</div>

              <div className="stage-card">
                <div className="stage-icon">👑</div>
                <h4>CHAMPION</h4>
                <div className="stage-milestone">50 done</div>
                <div className="stage-progress-bar">
                  <div className="stage-progress-fill" style={{ width: '100%' }}></div>
                </div>
              </div>

              <div className="stage-arrow">→</div>

              <div className="stage-card">
                <div className="stage-icon">🌟</div>
                <h4>LEGEND</h4>
                <div className="stage-milestone">100 done</div>
                <div className="stage-progress-bar">
                  <div className="stage-progress-fill" style={{ width: '100%' }}></div>
                </div>
              </div>

              <div className="stage-arrow">→</div>

              <div className="stage-card">
                <div className="stage-icon">✨</div>
                <h4>MYTHIC</h4>
                <div className="stage-milestone">200 done</div>
                <div className="stage-progress-bar">
                  <div className="stage-progress-fill" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
            {/* How It Works Section */}
      <section className="howitworks-section" id="howitworks">
        <div className="howitworks-container">
          <div className="howitworks-header">
            <div className="howitworks-badge">📋 HOW IT WORKS</div>
            <h2>Start in 4 Simple Steps</h2>
            <p className="howitworks-subtitle">
              No complicated setup. Just sign up, build your quest, and start earning XP from day one.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon">🎮</div>
              <h3>Create Your Hero</h3>
              <p>Sign up in seconds. Pick your avatar, name your hero, and enter the Habitracer universe.</p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon">⚔️</div>
              <h3>Build Your Quests</h3>
              <p>Use our 4-step wizard to create habits—set your duration, daily target, and reminders.</p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon">✅</div>
              <h3>Complete Daily</h3>
              <p>Check off habits each day. Build streaks, earn XP at the end of every day you finish strong.</p>
            </div>

            <div className="step-card">
              <div className="step-number">04</div>
              <div className="step-icon">🌟</div>
              <h3>Level Up & Evolve</h3>
              <p>Watch your character evolve through 6 stunning tiers as your habit count grows.</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="howitworks-cta">
            <button onClick={() => navigate("/register")} className="start-journey-btn">
              ⚔️ Start Your Journey Now
            </button>
          </div>
        </div>
      </section>
            {/* Reviews Section */}
      <section className="reviews-section" id="reviews">
        <div className="reviews-container">
          <div className="reviews-header">
            <div className="reviews-badge">⭐ REVIEWS</div>
            <h2>Loved by 12,400+ Heroes</h2>
            <p className="reviews-subtitle">
              Real people, real results. Here's what our community is saying.
            </p>
          </div>

          <div className="reviews-grid">
            {/* Review 1 */}
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">
                "I've tried 6 different habit apps. Nothing stuck. Then I found Habitracer and I've been on a 47-day streak. The character evolution makes it addictive in the best way possible."
              </p>
              <div className="reviewer-info">
                <div className="reviewer-avatar">🧙</div>
                <div className="reviewer-details">
                  <h4>Arjun Sharma</h4>
                  <span>Pro User · VERIFIED</span>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">
                "As someone with ADHD, traditional habit trackers never worked for me. The gamification aspect of Habitracer keeps my brain engaged, I've read 24 books this year!"
              </p>
              <div className="reviewer-info">
                <div className="reviewer-avatar">⚔️</div>
                <div className="reviewer-details">
                  <h4>Priya Nair</h4>
                  <span>Pro User · VERIFIED</span>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">
                "The analytics dashboard (Pro) is incredible. I can see exactly which habits are driving my streak vs which ones I'm failing. Genuinely changed how I approach my mornings."
              </p>
              <div className="reviewer-info">
                <div className="reviewer-avatar">🛡️</div>
                <div className="reviewer-details">
                  <h4>Rahul Koppar</h4>
                  <span>Pro User · VERIFIED</span>
                </div>
              </div>
            </div>

            {/* Review 4 */}
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">
                "The 4-step wizard to create habits is so smart. I used to set vague goals but now I define duration, daily target, and reminders in one flow. Such a difference!"
              </p>
              <div className="reviewer-info">
                <div className="reviewer-avatar">👑</div>
                <div className="reviewer-details">
                  <h4>Vidhi Jadhav</h4>
                  <span>Pro User · VERIFIED</span>
                </div>
              </div>
            </div>

            {/* Review 5 */}
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">
                "I paid for Lifetime ($30) and it's the best productivity purchase I've made. The character at Mythic level is jaw-dropping. Thank you for building this!"
              </p>
              <div className="reviewer-info">
                <div className="reviewer-avatar">🌟</div>
                <div className="reviewer-details">
                  <h4>Ananya Singh</h4>
                  <span>Lifetime Member · VERIFIED</span>
                </div>
              </div>
            </div>

            {/* Review 6 */}
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">
                "Moving the RPG character—I'm currently a Warrior and gunning for Champion. Never thought habit tracking could feel like playing an actual game. Highly recommend!"
              </p>
              <div className="reviewer-info">
                <div className="reviewer-avatar">🔥</div>
                <div className="reviewer-details">
                  <h4>Sneha Reddy</h4>
                  <span>Pro User · VERIFIED</span>
                </div>
              </div>
            </div>

            {/* Review 7 */}
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">
                "This app completely transformed my daily routine. From a couch potato to now running 5km daily. The streak system keeps me accountable!"
              </p>
              <div className="reviewer-info">
                <div className="reviewer-avatar">🏃</div>
                <div className="reviewer-details">
                  <h4>Ramesh Jadhav</h4>
                  <span>Pro User · VERIFIED</span>
                </div>
              </div>
            </div>

            {/* Review 8 */}
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">
                "My daughter introduced me to this app and now we compete on streaks together! Such a wonderful way to bond while staying healthy."
              </p>
              <div className="reviewer-info">
                <div className="reviewer-avatar">💝</div>
                <div className="reviewer-details">
                  <h4>Shobha Jadhav</h4>
                  <span>Verified User · VERIFIED</span>
                </div>
              </div>
            </div>

            {/* Review 9 */}
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">
                "As a busy entrepreneur, I needed something that makes habit tracking fun. Habitracer delivered. The XP system is genius!"
              </p>
              <div className="reviewer-info">
                <div className="reviewer-avatar">💼</div>
                <div className="reviewer-details">
                  <h4>Michael Chen</h4>
                  <span>Pro User · VERIFIED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
            {/* Call to Action Section */}
      <section className="cta-section" id="cta">
        <div className="cta-container">
          <div className="cta-content">
            <div className="cta-badge">⚡ READY TO BEGIN YOUR QUEST? ⚡</div>
            <h2 className="cta-title">
              Join <span className="cta-highlight">1000+ Heroes</span> Who Have Already Started<br />
              Leveling Up Their Habits
            </h2>
            <p className="cta-subtitle">
              Free to start. No credit card needed. No excuses. Just results.
            </p>
            <div className="cta-buttons">
              <button onClick={() => navigate("/register")} className="cta-primary-btn">
                🎮 Create Free Account →
              </button>
              <button onClick={() => navigate("/login")} className="cta-secondary-btn">
                Already a Hero? Login →
              </button>
            </div>
            <div className="cta-stats">
              <div className="cta-stat">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Active Heroes</span>
              </div>
              <div className="cta-stat">
                <span className="stat-number">47d</span>
                <span className="stat-label">Average Streak</span>
              </div>
              <div className="cta-stat">
                <span className="stat-number">4.9⭐</span>
                <span className="stat-label">User Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>
            {/* Footer */}
      <Footer />
    </div>
  );
}