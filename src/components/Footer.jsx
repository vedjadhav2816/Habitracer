import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faDiscord, faGithub, faInstagram } from '@fortawesome/free-brands-svg-icons';
import "../styles/footer.css";

export default function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-brand">
          <div className="footer-logo">HABIT<span>RACER</span></div>
          <p className="footer-description">
            Transform your daily routines into an epic RPG adventure. 
            Build streaks, evolve your character, and level up your life — one habit at a time.
          </p>
          <div className="footer-social">
            <a href="https://twitter.com/habitracer" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Twitter">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="https://discord.gg/habitracer" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Discord">
              <FontAwesomeIcon icon={faDiscord} />
            </a>
            <a href="https://github.com/vedjadhav2816/Habitracer" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub">
              <FontAwesomeIcon icon={faGithub} />
            </a>
            <a href="https://instagram.com/habitracer" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </div>
        </div>

        {/* Rest of your footer code remains the same */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><button onClick={() => navigate("/")} className="footer-link-btn">Home</button></li>
            <li><button onClick={() => navigate("/login")} className="footer-link-btn">Login</button></li>
            <li><button onClick={() => navigate("/register")} className="footer-link-btn">Register</button></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#reviews">Reviews</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Features</h4>
          <ul>
            <li><a href="#">RPG Habit System</a></li>
            <li><a href="#">Evolving Character</a></li>
            <li><a href="#">Analytics Dashboard</a></li>
            <li><a href="#">Smart Reminders</a></li>
            <li><a href="#">XP & Leveling</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Resources</h4>
          <ul>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Community</a></li>
            <li><a href="#">Roadmap</a></li>
            <li><a href="#">Changelog</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Legal</h4>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Cookie Policy</a></li>
            <li><a href="#">GDPR</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {currentYear} HabitRacer. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
            <a href="#">Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
}