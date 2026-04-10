require('dotenv').config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();
require('dotenv').config();

// 🔥 MIDDLEWARE
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET || "habitracer-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// 🔗 MYSQL CONNECTION
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "habit_racer",
});

db.connect(err => {
  if (err) {
    console.log("DB ERROR:", err);
  } else {
    console.log("MySQL Connected ✅");
    // Create users table if not exists
    const createTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255),
        google_id VARCHAR(255),
        avatar VARCHAR(10) DEFAULT '🧙',
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    db.query(createTable, (err) => {
      if (err) console.log("Table creation error:", err);
      else console.log("Users table ready ✅");
    });
  }
});

// 🔥 Passport Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, // Replace with your Google Client ID
    clientSecret:process.env.GOOGLE_CLIENT_SECRET, // Replace with your Google Client Secret
    callbackURL: "http://localhost:5000/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists with this google_id or email
      const checkSql = "SELECT * FROM users WHERE google_id = ? OR email = ?";
      db.query(checkSql, [profile.id, profile.emails[0].value], async (err, results) => {
        if (err) return done(err);
        
        if (results.length > 0) {
          // User exists, update google_id if not set
          const user = results[0];
          if (!user.google_id) {
            const updateSql = "UPDATE users SET google_id = ? WHERE id = ?";
            db.query(updateSql, [profile.id, user.id]);
          }
          return done(null, user);
        } else {
          // Create new user
          const insertSql = "INSERT INTO users (name, email, google_id, avatar) VALUES (?, ?, ?, ?)";
          const displayName = profile.displayName || profile.emails[0].value.split('@')[0];
          db.query(insertSql, [displayName, profile.emails[0].value, profile.id, '🧙'], (err, result) => {
            if (err) return done(err);
            const newUser = {
              id: result.insertId,
              name: displayName,
              email: profile.emails[0].value,
              google_id: profile.id,
              avatar: '🧙'
            };
            return done(null, newUser);
          });
        }
      });
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.query("SELECT id, name, email, google_id, avatar, bio FROM users WHERE id = ?", [id], (err, results) => {
    if (err) return done(err);
    done(null, results[0]);
  });
});

// 🔥 GOOGLE AUTH ROUTES
app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:3000/login" }),
  (req, res) => {
    // Successful authentication, redirect to dashboard
    res.redirect("http://localhost:3000/dashboard");
  }
);

// 🔥 GET CURRENT USER (for Google Auth)
app.get("/api/auth/user", (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      user: req.user
    });
  } else {
    res.json({ success: false });
  }
});

// 🔥 REGISTER API (WITH SESSION & RETURNING USER ID)
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, hashed], (err, result) => {
      if (err) {
        return res.status(400).json({ success: false, error: "User already exists" });
      }

      req.session.user = {
        id: result.insertId,
        name,
        email
      };

      res.json({
        success: true,
        user: {
          id: result.insertId,
          name: name,
          email: email
        }
      });
    });

  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// 🔥 GET CURRENT LOGGED-IN USER
app.get("/api/user", (req, res) => {
  if (req.session.user) {
    res.json({
      success: true,
      user: req.session.user
    });
  } else {
    res.json({ success: false });
  }
});

// 🔥 GET USER BY ID (with profile data)
app.get("/api/user/:id", (req, res) => {
  const userId = req.params.id;

  db.query(
    "SELECT id, name, email, avatar, bio, created_at FROM users WHERE id = ?",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result[0]);
    }
  );
});

// 🔥 UPDATE USER PROFILE
app.put("/api/user/:id", (req, res) => {
  const userId = req.params.id;
  const { avatar, bio, displayName } = req.body;

  const sql = "UPDATE users SET avatar = ?, bio = ?, name = ? WHERE id = ?";
  db.query(sql, [avatar || '🧙', bio || '', displayName, userId], (err, result) => {
    if (err) {
      console.error("Update error:", err);
      return res.status(500).json({ success: false, error: "Update failed" });
    }
    res.json({ success: true });
  });
});

// 🔥 SAVE USER QUESTS DATA
app.post("/api/user/:id/quests", (req, res) => {
  const userId = req.params.id;
  const { quests, stats, character } = req.body;

  const sql = `INSERT INTO user_data (user_id, quests_data, stats_data, character_data, updated_at) 
               VALUES (?, ?, ?, ?, NOW()) 
               ON DUPLICATE KEY UPDATE 
               quests_data = VALUES(quests_data), 
               stats_data = VALUES(stats_data), 
               character_data = VALUES(character_data), 
               updated_at = NOW()`;

  db.query(sql, [userId, JSON.stringify(quests), JSON.stringify(stats), JSON.stringify(character)], (err) => {
    if (err) {
      console.error("Save quests error:", err);
      return res.status(500).json({ success: false });
    }
    res.json({ success: true });
  });
});

// 🔥 GET USER QUESTS DATA
app.get("/api/user/:id/quests", (req, res) => {
  const userId = req.params.id;

  db.query(
    "SELECT quests_data, stats_data, character_data FROM user_data WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ success: false });
      if (results.length > 0) {
        res.json({
          success: true,
          quests: results[0].quests_data ? JSON.parse(results[0].quests_data) : [],
          stats: results[0].stats_data ? JSON.parse(results[0].stats_data) : {},
          character: results[0].character_data ? JSON.parse(results[0].character_data) : {}
        });
      } else {
        res.json({ success: true, quests: [], stats: {}, character: {} });
      }
    }
  );
});

// 🔥 LOGOUT
app.get("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

// 🔐 LOGIN API
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json({ error: "Server error" });

    if (result.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result[0];

    // Check if user has password (not Google-only account)
    if (!user.password) {
      return res.status(400).json({ error: "Please login with Google" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    res.json({
      message: "Login successful",
      userId: user.id,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  });
});

// Create user_data table
const createUserDataTable = `
  CREATE TABLE IF NOT EXISTS user_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    quests_data TEXT,
    stats_data TEXT,
    character_data TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`;
db.query(createUserDataTable);

// 🚀 START SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});