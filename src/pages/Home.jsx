import { useNavigate } from "react-router-dom";
import "../styles/main.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">HABIT<span>RACER</span></div>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
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
      <section className="hero">
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
            onClick={() => document.getElementById("dashboard-preview")?.scrollIntoView({ behavior: "smooth" })}
            className="see-features"
          >
            See Features ↓
          </button>
        </div>

        {/* Dashboard Preview - Matches actual dashboard design */}
        <div className="dashboard-preview" id="dashboard-preview">
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
              {/* Left Column - Quests Section */}
              <div className="dash-left">
                {/* Stats Cards */}
                <div className="stats-grid">
                  <div className="stat-card cyan">
                    <h4>Today</h4>
                    <h2>2/3</h2>
                  </div>
                  <div className="stat-card gold">
                    <h4>Streak</h4>
                    <h2>5</h2>
                  </div>
                  <div className="stat-card purple">
                    <h4>XP</h4>
                    <h2>140</h2>
                  </div>
                  <div className="stat-card green">
                    <h4>Week</h4>
                    <h2>67%</h2>
                  </div>
                </div>

                {/* Progress Circles */}
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

                {/* Activity Graph Placeholder */}
                <div className="activity-graph">
                  <div className="graph-line"></div>
                </div>

                {/* Quests List */}
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
                    <div className="complete-btn done">
                      <div className="check-circle">✓</div>
                    </div>
                  </div>
                  <div className="quest-item">
                    <div className="quest-info">
                      <span className="quest-icon">📖</span>
                      <span className="quest-name">Read 20 Pages</span>
                    </div>
                    <div className="complete-btn">
                      <div className="check-circle"></div>
                    </div>
                  </div>
                  <div className="quest-item">
                    <div className="quest-info">
                      <span className="quest-icon">💧</span>
                      <span className="quest-name">Drink Water</span>
                    </div>
                    <div className="complete-btn done">
                      <div className="check-circle">✓</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Character Panel */}
              <div className="dash-right">
                <div className="character-card">
                  <h4>YOUR CHARACTER</h4>
                  <div className="character-avatar">🧙</div>
                  <h3>Warrior</h3>
                  <div className="character-class">WARRIOR</div>
                  
                  {/* XP Bar */}
                  <div className="char-xp-bar">
                    <div className="char-xp-fill" style={{ width: '64%' }}></div>
                  </div>
                  <p className="char-xp-text">64 / 100 XP</p>

                  {/* Stats Bars */}
                  <div className="char-stats">
                    <div className="char-stat">
                      <span>STRENGTH</span>
                      <div className="stat-bar-bg">
                        <div className="stat-bar-fill red" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div className="char-stat">
                      <span>WISDOM</span>
                      <div className="stat-bar-bg">
                        <div className="stat-bar-fill cyan" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    <div className="char-stat">
                      <span>ENDURANCE</span>
                      <div className="stat-bar-bg">
                        <div className="stat-bar-fill green" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div className="char-stat">
                      <span>FOCUS</span>
                      <div className="stat-bar-bg">
                        <div className="stat-bar-fill purple" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Evolution Progress */}
                  <div className="evolution-section">
                    <div className="evolution-label">NEXT EVOLUTION</div>
                    <div className="evolution-bar">
                      <div className="evolution-fill" style={{ width: '28%' }}></div>
                    </div>
                    <div className="evolution-text">14 / 50 completions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}