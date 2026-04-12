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
            onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
            className="see-features"
          >
            See Features ↓
          </button>
        </div>

        {/* Dashboard Preview */}
        <div className="dashboard-preview">
          <div className="dashboard">
            {/* Header */}
            <div className="dashboard-header">
              <div className="app-title">HABITRACER</div>
              <div className="tabs">
                <div className="tab cyan"></div>
                <div className="tab gold"></div>
                <div className="tab purple"></div>
                <div className="tab green"></div>
              </div>
              <button className="logout">LOGOUT</button>
            </div>

            <div className="dashboard-body">
              {/* Left Side - Stats and Habits */}
              <div className="dashboard-left">
                <div className="stats">
                  <div className="stat-item">
                    <div className="label">TODAY</div>
                    <div className="value cyan">2/3</div>
                  </div>
                  <div className="stat-item">
                    <div className="label">STREAK</div>
                    <div className="value gold">5</div>
                  </div>
                  <div className="stat-item">
                    <div className="label">TOTAL XP</div>
                    <div className="value purple">140</div>
                  </div>
                </div>

                <div className="progress-section">
                  <div className="progress-circle cyan">
                    <span>75%</span>
                    <small>DAILY</small>
                  </div>
                  <div className="progress-circle purple">
                    <span>45%</span>
                    <small>WEEKLY</small>
                  </div>
                  <div className="progress-circle green">
                    <span>63%</span>
                    <small>OVERALL</small>
                  </div>
                </div>

                <div className="habits">
                  <div className="habit completed">
                    <span className="habit-text">🌅 Morning Run</span>
                    <span className="status">✓</span>
                  </div>
                  <div className="habit">
                    <span className="habit-text">📖 Read 20 Pages</span>
                    <span className="status">○</span>
                  </div>
                  <div className="habit completed">
                    <span className="habit-text">💧 Drink Water</span>
                    <span className="status">✓</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Character Panel */}
              <div className="character-panel">
                <div className="character">
                  <div className="avatar">🧙</div>
                  <div className="name">WARRIOR</div>
                </div>

                <div className="xp-bars">
                  <div className="bar-container">
                    <span>STR</span>
                    <div className="bar red">
                      <div className="fill" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className="bar-container">
                    <span>INT</span>
                    <div className="bar cyan">
                      <div className="fill" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div className="bar-container">
                    <span>DEX</span>
                    <div className="bar green">
                      <div className="fill" style={{ width: '75%' }}></div>
                    </div>
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