import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/main.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  // Check if user is already logged in via Google
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
          credentials: "include"
        });
        const data = await res.json();
        if (data.success && data.user) {
          localStorage.setItem("userId", data.user.id.toString());
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/dashboard");
        }
      } catch (err) {
        console.log("Auth check error:", err);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
     const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.userId) {
          localStorage.setItem("userId", data.userId.toString());
        }
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Make sure backend is running.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        
        <div className="auth-header">
          <h1 className="logo-title">
            HABIT<span>RACER</span>
          </h1>
          <p className="tagline">HABIT RPG • LEVEL UP YOUR LIFE</p>
        </div>

        <div className="icon-bar">
          <div className="icon-circle wizard">🧙</div>
          <div className="icon-circle swords">⚔️</div>
          <div className="icon-circle bow">🏹</div>
          <div className="icon-circle shield">🛡️</div>
          <div className="icon-circle rogue">🥷</div>
        </div>

        <div className="auth-card">
          
          <div className="auth-tabs">
            <button className="tab active">LOGIN</button>
            <Link to="/register" className="tab">REGISTER</Link>
          </div>

          <form onSubmit={handleSubmit}>
            
            <div className="input-group">
              <label>EMAIL</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </div>

            <div className="input-group">
              <label>PASSWORD</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="quest-btn">
              ⚔️ ENTER THE QUEST
            </button>

          </form>

          <div className="divider">- or -</div>

          {/* Google Login Button */}
          <button
            className="google-btn"
            onClick={handleGoogleLogin}
          >
            <span className="google-icon">G</span>
            Continue with Google
          </button>

          <div className="divider">- or -</div>

          <button
            className="demo-btn"
            onClick={() => navigate("/dashboard")}
          >
            👁️ TRY DEMO
          </button>

          <p className="switch-text">
            Don't have an account?{" "}
            <Link to="/register" className="highlight">
              Register here
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}