import { useNavigate } from "react-router-dom";
import "../styles/main.css";

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
    </div>
  );
}