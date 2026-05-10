require('dotenv').config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bcrypt = require("bcrypt");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();

// 🔥 STRIPE WEBHOOK - MUST BE BEFORE JSON PARSING MIDDLEWARE
app.post('/api/stripe-webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error('❌ STRIPE_WEBHOOK_SECRET is not set in environment variables');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }
    
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.log(`⚠️ Webhook signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`📨 Webhook received: ${event.type}`);

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('✅ Payment completed!');
      console.log('Session ID:', session.id);
      console.log('Client Reference ID (userId):', session.client_reference_id);
      
      if (session.client_reference_id && session.metadata) {
        const userId = session.client_reference_id;
        const planId = session.metadata.planId;
        
        try {
          let endDate = null;
          const now = new Date();
          
          if (planId === 'monthly') {
            endDate = new Date(now.setMonth(now.getMonth() + 1));
          } else if (planId === 'semi') {
            endDate = new Date(now.setMonth(now.getMonth() + 6));
          } else if (planId === 'lifetime') {
            endDate = new Date(now.setFullYear(now.getFullYear() + 100));
          }
          
          console.log(`Updating user ${userId} to ${planId} plan...`);
          
          const updateResult = await query(
            `UPDATE users 
             SET subscription_status = 'pro', 
                 subscription_end_date = $1, 
                 plan_type = $2,
                 stripe_customer_id = $3
             WHERE id = $4
             RETURNING id, name, email, subscription_status, plan_type`,
            [endDate, planId, session.customer, userId]
          );
          
          if (updateResult.rows.length > 0) {
            console.log(`✅ User ${userId} (${updateResult.rows[0].name}) upgraded to ${planId}`);
          } else {
            console.log(`❌ User ${userId} not found`);
          }
        } catch (dbError) {
          console.error('❌ Database update error:', dbError);
        }
      }
      break;
      
    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      console.log('Subscription cancelled:', subscription.id);
      
      try {
        await query(
          `UPDATE users 
           SET subscription_status = 'free', 
               subscription_end_date = NULL, 
               plan_type = 'free'
           WHERE stripe_customer_id = $1`,
          [subscription.customer]
        );
        console.log('✅ User downgraded to free plan');
      } catch (dbError) {
        console.error('❌ Database update error:', dbError);
      }
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// 🔥 MIDDLEWARE (after webhook so it doesn't interfere)
app.use(express.json());

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET || "habitracer-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// 🔗 POSTGRESQL CONNECTION (for Render)
let db;

if (process.env.DATABASE_URL) {
  db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  console.log("Connected to PostgreSQL on Render ✅");
} else {
  console.log("No DATABASE_URL found, using local config");
  db = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "habit_racer",
  });
}

const query = (text, params) => db.query(text, params);

// Create tables on startup
const initTables = async () => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255),
        google_id VARCHAR(255),
        avatar VARCHAR(10) DEFAULT '🧙',
        bio TEXT,
        subscription_status VARCHAR(50) DEFAULT 'free',
        subscription_end_date TIMESTAMP,
        plan_type VARCHAR(50) DEFAULT 'free',
        stripe_customer_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    try {
      await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'free'`);
      await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP`);
      await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_type VARCHAR(50) DEFAULT 'free'`);
      await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255)`);
    } catch (err) {
      console.log("Column addition error (may already exist):", err.message);
    }
    
    console.log("Users table ready ✅");

    await query(`
      CREATE TABLE IF NOT EXISTS user_data (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE NOT NULL,
        quests_data TEXT,
        stats_data TEXT,
        character_data TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log("User_data table ready ✅");
  } catch (err) {
    console.log("Table creation error:", err);
  }
};

initTables();

// 🔥 Passport Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const checkSql = "SELECT * FROM users WHERE google_id = $1 OR email = $2";
      const results = await query(checkSql, [profile.id, profile.emails[0].value]);
      
      if (results.rows.length > 0) {
        const user = results.rows[0];
        if (!user.google_id) {
          await query("UPDATE users SET google_id = $1 WHERE id = $2", [profile.id, user.id]);
        }
        return done(null, user);
      } else {
        const insertSql = "INSERT INTO users (name, email, google_id, avatar) VALUES ($1, $2, $3, $4) RETURNING *";
        const displayName = profile.displayName || profile.emails[0].value.split('@')[0];
        const result = await query(insertSql, [displayName, profile.emails[0].value, profile.id, '🧙']);
        return done(null, result.rows[0]);
      }
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await query("SELECT id, name, email, google_id, avatar, bio FROM users WHERE id = $1", [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
});

// 🔥 GOOGLE AUTH ROUTES
app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:3000"}/login` }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard`);
  }
);

// 🔥 GET CURRENT USER - FIXED
app.get("/api/auth/user", (req, res) => {
  console.log("GET /api/auth/user - req.user:", req.user ? `id=${req.user.id}` : 'null');
  if (req.user) {
    res.json({ 
      success: true, 
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        bio: req.user.bio
      }
    });
  } else {
    res.json({ success: false });
  }
});

// 🔥 REGISTER API - FIXED: Use req.login() for proper Passport session
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashed]
    );
    
    const user = result.rows[0];
    
    // Use req.login() to create proper Passport session
    req.login(user, (err) => {
      if (err) {
        console.error("Login after register error:", err);
        return res.status(500).json({ success: false, error: "Session creation failed" });
      }
      console.log("User registered and logged in:", user.id);
      return res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio
        }
      });
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ success: false, error: "User already exists" });
    }
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// 🔥 GET CURRENT LOGGED-IN USER
app.get("/api/user", (req, res) => {
  if (req.user) {
    res.json({ success: true, user: req.user });
  } else {
    res.json({ success: false });
  }
});

// 🔥 GET USER BY ID
app.get("/api/user/:id", async (req, res) => {
  try {
    const result = await query(
      "SELECT id, name, email, avatar, bio, created_at FROM users WHERE id = $1",
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 🔥 UPDATE USER PROFILE
app.put("/api/user/:id", async (req, res) => {
  const { avatar, bio, displayName } = req.body;
  try {
    await query(
      "UPDATE users SET avatar = $1, bio = $2, name = $3 WHERE id = $4",
      [avatar || '🧙', bio || '', displayName, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: "Update failed" });
  }
});

// 🔥 SAVE USER QUESTS
app.post("/api/user/:id/quests", async (req, res) => {
  const { quests, stats, character } = req.body;
  console.log(`SAVE quests for user ${req.params.id}:`, quests?.length, "quests");
  try {
    await query(
      `INSERT INTO user_data (user_id, quests_data, stats_data, character_data, updated_at) 
       VALUES ($1, $2, $3, $4, NOW()) 
       ON CONFLICT (user_id) DO UPDATE SET 
       quests_data = EXCLUDED.quests_data, 
       stats_data = EXCLUDED.stats_data, 
       character_data = EXCLUDED.character_data, 
       updated_at = NOW()`,
      [req.params.id, JSON.stringify(quests), JSON.stringify(stats), JSON.stringify(character)]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Save quests error:", err);
    res.status(500).json({ success: false });
  }
});

// 🔥 GET USER QUESTS
app.get("/api/user/:id/quests", async (req, res) => {
  try {
    const result = await query(
      "SELECT quests_data, stats_data, character_data FROM user_data WHERE user_id = $1",
      [req.params.id]
    );
    console.log(`LOAD quests for user ${req.params.id}:`, result.rows.length > 0 ? "found" : "not found");
    if (result.rows.length > 0) {
      res.json({
        success: true,
        quests: result.rows[0].quests_data ? JSON.parse(result.rows[0].quests_data) : [],
        stats: result.rows[0].stats_data ? JSON.parse(result.rows[0].stats_data) : {},
        character: result.rows[0].character_data ? JSON.parse(result.rows[0].character_data) : {}
      });
    } else {
      res.json({ success: true, quests: [], stats: {}, character: {} });
    }
  } catch (err) {
    console.error("Load quests error:", err);
    res.status(500).json({ success: false });
  }
});

// 🔥 LOGOUT
app.get("/api/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });
});

// 🔐 LOGIN API - FIXED: Use req.login() for proper Passport session
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }
    const user = result.rows[0];
    if (!user.password) {
      return res.status(400).json({ error: "Please login with Google" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }
    
    // Use req.login() to create proper Passport session (same as Google auth)
    req.login(user, (err) => {
      if (err) {
        console.error("Login session error:", err);
        return res.status(500).json({ error: "Login failed" });
      }
      console.log("User logged in:", user.id);
      return res.json({
        message: "Login successful",
        userId: user.id,
        user: { 
          id: user.id,
          name: user.name, 
          email: user.email,
          avatar: user.avatar,
          bio: user.bio
        }
      });
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ====================== STRIPE PAYMENT INTEGRATION ======================

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { planId, userId, userEmail, planName } = req.body;
    
    const priceIds = {
      monthly: process.env.STRIPE_MONTHLY_PRICE_ID,
      semi: process.env.STRIPE_SEMI_PRICE_ID,
      lifetime: process.env.STRIPE_LIFETIME_PRICE_ID
    };
    
    const priceId = priceIds[planId];
    if (!priceId) {
      return res.status(400).json({ error: "Invalid plan selected" });
    }
    
    const sessionConfig = {
      payment_method_types: ['card'],
      customer_email: userEmail,
      client_reference_id: userId,
      mode: planId === 'lifetime' ? 'payment' : 'subscription',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/upgrade?canceled=true`,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId,
        planId: planId
      }
    };
    
    const session = await stripe.checkout.sessions.create(sessionConfig);
    res.json({ sessionId: session.id, url: session.url });
    
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/check-subscription/:userId", async (req, res) => {
  try {
    const result = await query(
      "SELECT subscription_status, subscription_end_date, plan_type FROM users WHERE id = $1",
      [req.params.userId]
    );
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const isActive = (user.subscription_status && user.subscription_status !== 'free') || 
                       (user.plan_type && user.plan_type !== 'free');
      
      res.json({
        isPro: isActive,
        plan: user.subscription_status || 'free',
        planType: user.plan_type || 'free',
        expiresAt: user.subscription_end_date
      });
    } else {
      res.json({ isPro: false, plan: 'free', planType: 'free' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});