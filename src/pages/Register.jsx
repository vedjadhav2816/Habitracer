import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/main.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

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

  // 🔥 UPDATED SUBMIT (SESSION + MYSQL CONNECTED + USER ID STORAGE)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     const res = await fetch(`${process.env.REACT_APP_API_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🔥 VERY IMPORTANT (SESSION COOKIE)
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        // ✅ STORE USER ID AND USER DATA IN LOCALSTORAGE
        if (data.user && data.user.id) {
          localStorage.setItem("userId", data.user.id.toString());
        }
        localStorage.setItem("user", JSON.stringify(data.user));

        // 🔥 REDIRECT TO DASHBOARD
        navigate("/dashboard");
      } else {
        alert(data.error || "Registration failed");
      }

    } catch (err) {
      console.error(err);
      alert("Server error. Make sure backend is running.");
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* Header */}
        <div className="auth-header">
          <h1 className="logo-title">
            HABIT<span>RACER</span>
          </h1>
          <p className="tagline">START YOUR QUEST TODAY</p>
        </div>

        {/* Register Card */}
        <div className="auth-card">

          {/* Tabs */}
          <div className="auth-tabs">
            <Link to="/login" className="tab">LOGIN</Link>
            <button className="tab active">REGISTER</button>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <label>NAME</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />
            </div>

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
                placeholder="Enter your password (min 6 characters)"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
                minLength="6"
              />
            </div>

            {/* Main Button */}
            <button type="submit" className="quest-btn">
              🚀 START YOUR JOURNEY
            </button>

          </form>

          <div className="divider">- or -</div>

          {/* Google Register Button */}
          <button
            className="google-btn"
            onClick={handleGoogleRegister}
          >
            <span className="google-icon">G</span>
            Sign up with Google
          </button>

          <p className="switch-text">
            Already have an account?{" "}
            <Link to="/login" className="highlight">
              Login here
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}