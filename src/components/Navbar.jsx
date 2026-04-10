import { Link } from "react-router-dom";
import "../styles/main.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        HABIT<span>RACER</span>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/help">Help</Link>
        <Link to="/login" className="login-btn">Login</Link>
        <Link to="/register" className="get-started-btn">Get Started Free</Link>
      </div>
    </nav>
  );
}