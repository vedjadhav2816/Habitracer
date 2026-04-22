import { useState, useEffect, useCallback, useRef, memo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

import CreateQuestModal from "../components/CreateQuestModal";
import Analytics from "./Analytics"; // Import the Analytics component
import Upgrade from "./Upgrade";
const [isPro, setIsPro] = useState(false);

// Move ProfilePage outside Dashboard component to prevent re-renders
const ProfilePage = memo(({ 
  user, 
  userProfile, 
  editForm, 
  onDisplayNameChange, 
  onBioChange, 
  onAvatarChange, 
  onSaveProfile, 
  showSaveSuccess,
  quests,
  stats,
  character,
  characterTier,
  evolutionProgress,
  activeDays,
  achievements
}) => {
  const avatarOptions = ["🧙", "⚔️", "🛡️", "🏹", "🧝", "🦸", "🥷", "🧑‍🚀", "🐉", "🦅"];

  return (
    <div className="profile-layout">
      {/* LEFT COLUMN - User Info & Stats */}
      <div className="profile-left">
        <div className="profile-card">
          <div className="profile-avatar">
            {userProfile.avatar || "🧙"}
          </div>
          <div className="profile-name">{userProfile.displayName || user?.name || "Hero"}</div>
          <div className="profile-handle">@{user?.name?.toLowerCase().replace(/\s/g, "") || "hero"}</div>
          <div className="profile-plan free">FREE TIER</div>
          
          <div className="profile-stats-grid">
            <div className="profile-stat">
              <div className="profile-stat-value">{quests.length}</div>
              <div className="profile-stat-label">Habits</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">{stats.streak}</div>
              <div className="profile-stat-label">Best Streak</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">{stats.xp}</div>
              <div className="profile-stat-label">Total XP</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">{activeDays}</div>
              <div className="profile-stat-label">Active Days</div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="profile-card achievements-card">
          <h4>ACHIEVEMENTS</h4>
          <div className="achievements-grid">
            {achievements.map(ach => {
              const isUnlocked = ach.condition();
              return (
                <div key={ach.id} className={`achievement-item ${isUnlocked ? "unlocked" : "locked"}`}>
                  <div className="achievement-icon">{ach.icon}</div>
                  <div className="achievement-name">{ach.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN - Edit Profile & Character Evolution */}
      <div className="profile-right">
        {/* Edit Profile Card */}
        <div className="edit-profile-card">
          <h4>EDIT PROFILE</h4>
          
          <div className="form-group">
            <label>DISPLAY NAME</label>
            <input
              type="text"
              className="form-input"
              value={editForm.displayName}
              onChange={onDisplayNameChange}
              placeholder="Your hero name"
              maxLength="30"
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label>BIO</label>
            <input
              type="text"
              className="form-input"
              value={editForm.bio}
              onChange={onBioChange}
              placeholder="Your quest motto..."
              maxLength="80"
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label>CHANGE AVATAR</label>
            <div className="avatar-picker">
              {avatarOptions.map(av => (
                <button
                  key={av}
                  type="button"
                  className={`avatar-option ${editForm.avatar === av ? "selected" : ""}`}
                  onClick={() => onAvatarChange(av)}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <button className="save-profile-btn" onClick={onSaveProfile}>
            SAVE PROFILE
          </button>
          {showSaveSuccess && <div className="save-success">✓ Profile saved successfully!</div>}
        </div>

        {/* Character Evolution Card */}
        <div className="evolution-card">
          <h4>CHARACTER EVOLUTION</h4>
          
          <div className="evolution-avatar">
            {characterTier.icon}
          </div>
          
          <div className="evolution-name">{characterTier.name}</div>
          <div className="evolution-class">{characterTier.class}</div>
          
          <div className="evolution-bar-container">
            <div className="evolution-label">NEXT EVOLUTION</div>
            <div className="evolution-bar-bg">
              <div className="evolution-bar-fill" style={{ width: `${evolutionProgress}%` }}></div>
            </div>
            <div className="evolution-sub">{stats.xp % 500} / 500 XP to next tier</div>
          </div>

          <div className="character-stats-mini">
            <div className="mini-stat">
              <span>STR</span>
              <div className="mini-bar-bg"><div className="mini-bar-fill" style={{ width: `${character.strength}%`, background: "#ef4444" }}></div></div>
            </div>
            <div className="mini-stat">
              <span>WIS</span>
              <div className="mini-bar-bg"><div className="mini-bar-fill" style={{ width: `${character.wisdom}%`, background: "#00e5ff" }}></div></div>
            </div>
            <div className="mini-stat">
              <span>END</span>
              <div className="mini-bar-bg"><div className="mini-bar-fill" style={{ width: `${character.endurance}%`, background: "#22c55e" }}></div></div>
            </div>
            <div className="mini-stat">
              <span>FOC</span>
              <div className="mini-bar-bg"><div className="mini-bar-fill" style={{ width: `${character.focus}%`, background: "#a855f7" }}></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default function Dashboard() {
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split("T")[0];

  const [quests, setQuests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("quests");
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState({
    displayName: "",
    bio: "",
    avatar: "🧙",
  });
  const [loadingUser, setLoadingUser] = useState(true);

  const [stats, setStats] = useState({
    today: 0,
    streak: 0,
    xp: 0,
    week: 0,
  });

  const [character, setCharacter] = useState({
    strength: 0,
    wisdom: 0,
    endurance: 0,
    focus: 0,
  });

  const [editForm, setEditForm] = useState({
    displayName: "",
    bio: "",
    avatar: "🧙",
  });
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  
  // Refs to prevent unnecessary re-renders
  const isFirstRender = useRef(true);
  const isProfileLoaded = useRef(false);

  // Achievement definitions
  const achievements = [
    { id: "first_quest", name: "FIRST QUEST", icon: "⚔️", condition: () => quests.length >= 1 },
    { id: "7_day_streak", name: "7-DAY STREAK", icon: "🔥", condition: () => stats.streak >= 7 },
    { id: "100_xp", name: "100 XP", icon: "⭐", condition: () => stats.xp >= 100 },
    { id: "3_quests", name: "3 QUESTS", icon: "🏆", condition: () => quests.length >= 3 },
    { id: "perfected_day", name: "PERFECTED DAY", icon: "✅", condition: () => stats.today > 0 && quests.length > 0 && stats.today === quests.length },
    { id: "warrior", name: "WARRIOR", icon: "⚔️", condition: () => stats.xp >= 500 },
    { id: "champion", name: "CHAMPION", icon: "👑", condition: () => stats.xp >= 1000 },
    { id: "legend", name: "LEGEND", icon: "🌟", condition: () => stats.xp >= 2000 },
  ];

  // 🔥 SAVE ALL DATA TO DATABASE
  const saveAllDataToDB = useCallback(async (userId, questsData, statsData, characterData) => {
    try {
    await fetch(`${process.env.REACT_APP_API_URL}/api/user/${userId}/quests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          quests: questsData,
          stats: statsData,
          character: characterData
        }),
      });
    } catch (err) {
      console.error("Save to DB error:", err);
    }
  }, []);

  // 🔥 LOAD ALL DATA FROM DATABASE
  const loadAllDataFromDB = useCallback(async (userId) => {
    try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${userId}/quests`, {
        credentials: "include"
      });
      const data = await res.json();
      
      if (data.success) {
        if (data.quests && data.quests.length > 0) {
          setQuests(data.quests);
        }
        if (data.stats && Object.keys(data.stats).length > 0) {
          setStats(data.stats);
        }
        if (data.character && Object.keys(data.character).length > 0) {
          setCharacter(data.character);
        }
      }
    } catch (err) {
      console.error("Load from DB error:", err);
    }
  }, []);

  // 🔥 Save data whenever quests, stats, or character changes (but skip first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const userId = localStorage.getItem("userId");
    if (userId && !isLoading) {
      saveAllDataToDB(userId, quests, stats, character);
    }
  }, [quests, stats, character, isLoading, saveAllDataToDB]);

  // Load profile from localStorage on mount (only once)
  useEffect(() => {
    if (!isProfileLoaded.current) {
      const savedProfile = localStorage.getItem("userProfile");
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setUserProfile(profile);
        setEditForm({
          displayName: profile.displayName || "",
          bio: profile.bio || "",
          avatar: profile.avatar || "🧙",
        });
      }
      isProfileLoaded.current = true;
    }
  }, []);

  // 🔥 FETCH USER AND LOAD SAVED DATA (only once on mount)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          setUser(null);
          setLoadingUser(false);
          setIsLoading(false);
          return;
        }

        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${userId}`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();

        if (data && data.name) {
          setUser(data);
          
          // Load saved quests data from database
          await loadAllDataFromDB(userId);
        } else {
          setUser(null);
        }

      } catch (err) {
        console.log("User fetch error:", err);
        setUser(null);
      } finally {
        setLoadingUser(false);
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [loadAllDataFromDB]);

  // Update edit form when user loads (but don't cause re-renders that break typing)
  useEffect(() => {
    if (user && !editForm.displayName && !userProfile.displayName) {
      setEditForm(prev => ({
        ...prev,
        displayName: user.name,
      }));
    }
  }, [user, editForm.displayName, userProfile.displayName]);

  // Save profile function with database sync
  const saveProfile = useCallback(async () => {
    const userId = localStorage.getItem("userId");
    const updatedProfile = {
      displayName: editForm.displayName || user?.name || "Hero",
      bio: editForm.bio || "",
      avatar: editForm.avatar,
    };
    setUserProfile(updatedProfile);
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
    
    // Save to database
    if (userId) {
      try {
       await fetch(`${process.env.REACT_APP_API_URL}/api/user/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            displayName: updatedProfile.displayName,
            bio: updatedProfile.bio,
            avatar: updatedProfile.avatar
          }),
        });
      } catch (err) {
        console.error("Save profile error:", err);
      }
    }
    
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 2000);
  }, [editForm.displayName, editForm.bio, editForm.avatar, user?.name]);

  // Handle input changes without focus loss - using useCallback
  const handleDisplayNameChange = useCallback((e) => {
    const newValue = e.target.value;
    setEditForm(prev => ({ ...prev, displayName: newValue }));
  }, []);

  const handleBioChange = useCallback((e) => {
    const newValue = e.target.value;
    setEditForm(prev => ({ ...prev, bio: newValue }));
  }, []);

  const handleAvatarChange = useCallback((avatar) => {
    setEditForm(prev => ({ ...prev, avatar: avatar }));
  }, []);

  // 🔥 LOGOUT FUNCTION
  const handleLogout = useCallback(async () => {
    try {
      // Save data before logout
      const userId = localStorage.getItem("userId");
      if (userId) {
        await saveAllDataToDB(userId, quests, stats, character);
      }
      
      await fetch(`${process.env.REACT_APP_API_URL}/api/logout`, {
        method: "GET",
        credentials: "include",
      });
      localStorage.removeItem("userId");
      localStorage.removeItem("user");
      localStorage.removeItem("userProfile");
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      navigate("/login");
    }
  }, [quests, stats, character, saveAllDataToDB, navigate]);

  // 🔥 ICON → STAT
  const iconStatsMap = {
    "🏃": "strength",
    "💪": "strength",
    "📚": "wisdom",
    "✍️": "wisdom",
    "🧘": "focus",
    "😴": "focus",
    "💧": "endurance",
    "🥗": "endurance",
  };

  const level = Math.floor(stats.xp / 100) + 1;
  const xpCurrent = stats.xp % 100;
  const xpNeeded = 100;
  const xpPercent = (xpCurrent / xpNeeded) * 100;

  // Character evolution tier based on level
  const getCharacterTier = useCallback(() => {
    if (level < 3) return { name: "NOVICE", class: "NOVICE", icon: "🧙" };
    if (level < 6) return { name: "APPRENTICE", class: "APPRENTICE", icon: "⚔️" };
    if (level < 10) return { name: "WARRIOR", class: "WARRIOR", icon: "🛡️" };
    if (level < 15) return { name: "CHAMPION", class: "CHAMPION", icon: "👑" };
    return { name: "LEGEND", class: "LEGEND", icon: "🌟" };
  }, [level]);

  const characterTier = getCharacterTier();
  const evolutionProgress = Math.min(100, (stats.xp % 500) / 5);

  // GRAPH
  const generateActivity = useCallback(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      const key = d.toISOString().split("T")[0];

      const completed = quests.filter(q => q.logs?.includes(key)).length;
      const total = quests.length || 1;

      return {
        day: i,
        value: Math.floor((completed / total) * 100),
      };
    });
  }, [quests]);

  const activityData = generateActivity();

  const handleSaveQuest = useCallback((data) => {
    const newQuests = [...quests, { ...data, logs: [] }];
    setQuests(newQuests);
  }, [quests]);

  const handleComplete = useCallback((index) => {
    const updated = [...quests];
    const quest = updated[index];

    const alreadyDone = quest.logs.includes(todayStr);

    if (alreadyDone) {
      quest.logs = quest.logs.filter(d => d !== todayStr);
    } else {
      quest.logs.push(todayStr);
    }

    setQuests(updated);

    const total = updated.length || 1;

    const completedToday = updated.filter(q =>
      q.logs.includes(todayStr)
    ).length;

    // WEEK
    const weekDates = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    });

    let weekCompleted = 0;
    updated.forEach(q => {
      weekDates.forEach(d => {
        if (q.logs.includes(d)) weekCompleted++;
      });
    });

    const weekPercent = Math.min(
      Math.floor((weekCompleted / (total * 7)) * 100),
      100
    );

    // XP (10 XP per completed day)
    let totalXP = 0;
    updated.forEach(q => {
      totalXP += q.logs.length * 10;
    });

    // CHARACTER
    let newCharacter = {
      strength: 0,
      wisdom: 0,
      endurance: 0,
      focus: 0,
    };

    updated.forEach(q => {
      const statType = iconStatsMap[q.icon] || "focus";
      q.logs.forEach(() => {
        newCharacter[statType] = Math.min(100, newCharacter[statType] + 2);
      });
    });

    // STREAK
    let streak = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];

      const allDone =
        updated.length > 0 &&
        updated.every(q => q.logs.includes(key));

      if (allDone) streak++;
      else break;
    }

    setCharacter(newCharacter);

    setStats({
      today: completedToday,
      xp: totalXP,
      week: weekPercent,
      streak: streak,
    });
  }, [quests, todayStr, iconStatsMap]);

  // UI CIRCLE
  const Circle = ({ percent, label, color }) => {
    const radius = 45;
    const normalized = 2 * Math.PI * radius;
    const offset = normalized - (percent / 100) * normalized;

    return (
      <div className="circle-box glow">
        <svg height="120" width="120">
          <circle cx="60" cy="60" r={radius} stroke="#1a2035" strokeWidth="6" fill="transparent"/>
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke={color}
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={normalized}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="circle-anim"
          />
        </svg>
        <div className="circle-text">
          {percent}%
          <span>{label}</span>
        </div>
      </div>
    );
  };

  // Active days calculation
  const activeDays = Object.keys(quests.reduce((acc, q) => {
    q.logs?.forEach(log => acc[log] = true);
    return acc;
  }, {})).length;

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">⚔️</div>
        <p>Loading your quest data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">

      {/* 🔥 NAVBAR MATCHING PNG DESIGN */}
      <div className="topbar">
        <div className="logo">HABIT<span>RACER</span></div>

        <div className="nav-tabs">
          <button 
            className={`nav-tab ${activeTab === "quests" ? "active" : ""}`}
            onClick={() => setActiveTab("quests")}
          >
            ⚔️ QUESTS
          </button>
          <button 
            className={`nav-tab ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            📊 ANALYTICS
          </button>
          <button 
            className={`nav-tab ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            👤 PROFILE
          </button>
          <button 
            className={`nav-tab ${activeTab === "upgrade" ? "active" : ""}`}
            onClick={() => setActiveTab("upgrade")}
          >
            ⚡ UPGRADE
          </button>
        </div>

        <div className="hdr-r">
          <div className="xp-wrap">
            <span className="xp-lbl">XP</span>
            <div className="xp-track">
              <div className="xp-fill-bar" style={{ width: `${xpPercent}%` }}></div>
            </div>
          </div>
          <div className="lvl-badge">LVL {level}</div>
          <div className="plan-pill free">FREE</div>
          
          {loadingUser ? (
            <div className="av-hdr pulse-avatar">⚡</div>
          ) : user ? (
            <div className="av-hdr" onClick={() => setActiveTab("profile")}>
              {userProfile.avatar || user.name?.charAt(0).toUpperCase() || "U"}
            </div>
          ) : (
            <div className="av-hdr" onClick={() => setActiveTab("profile")}>👤</div>
          )}
          
          <button className="btn-logout" onClick={handleLogout}>LOGOUT</button>
        </div>
      </div>

      <div className="main">
        {/* Conditional rendering based on active tab */}
        {activeTab === "quests" && (
          <>
            {/* LEFT - QUESTS SECTION */}
            <div className="left">
              <div className="stats">
                <div className="card cyan"><h4>Today</h4><h2>{stats.today}</h2></div>
                <div className="card gold"><h4>Streak</h4><h2>{stats.streak}</h2></div>
                <div className="card purple"><h4>XP</h4><h2>{stats.xp}</h2></div>
                <div className="card green"><h4>Week</h4><h2>{stats.week}%</h2></div>
              </div>

              <div className="circles">
                <Circle percent={stats.today * 20} label="Daily" color="#00e5ff" />
                <Circle percent={stats.week} label="Weekly" color="#a855f7" />
                <Circle percent={Math.min(stats.xp, 100)} label="Overall" color="#22c55e" />
              </div>

              <div className="activity">
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={activityData}>
                    <Line type="monotone" dataKey="value" stroke="#00e5ff" strokeWidth={3} dot={false}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>

             <button onClick={() => setShowModal(true)}>
    + New Quest ({quests.length}/{isPro ? "∞" : "3"})
  </button>

                {quests.length === 0 ? (
                  <div className="empty">
                    <div className="empty-ico">🗺️</div>
                    <div className="empty-ttl">No Active Quests</div>
                    <div className="empty-s">Press NEW QUEST to begin</div>
                  </div>
                ) : (
                  quests.map((q, i) => {
                    const completed = q.logs.includes(todayStr);

                    return (
                      <div key={i} className="quest-item glow-card">
                        <div className="quest-info">
                          <span className="quest-icon">{q.icon}</span>
                          <span className="quest-name">{q.name}</span>
                        </div>

                        <div
                          className={`complete-btn ${completed ? "done" : ""}`}
                          onClick={() => handleComplete(i)}
                        >
                          <div className="circle">
                            <div className="circle-fill"></div>
                            {completed && <span className="tick">✔</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* RIGHT - CHARACTER PANEL */}
            <div className="right">
              <div className="character">
                <h4>YOUR CHARACTER</h4>

                <div className="avatar glow-avatar">
                  {userProfile.avatar || (level < 3 ? "🧙" : level < 6 ? "⚔️" : "🔥")}
                </div>

                <h3>{userProfile.displayName || user?.name || "Hero"}</h3>
                <div className="character-class">{characterTier.class}</div>

                <div className="xp-bar-container">
                  <div className="xp-fill" style={{ width: `${xpPercent}%` }}></div>
                </div>

                <p>{xpCurrent} / {xpNeeded} XP</p>

                <div className="stat-bars">
                  {Object.keys(character).map(stat => (
                    <div key={stat}>
                      <span>{stat.toUpperCase()}</span>
                      <div className="bar-bg">
                        <div
                          className="bar-fill glow-bar"
                          style={{ width: `${character[stat]}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="user-info-section">
                  <div className="info-divider"></div>
                  <div className="info-row">
                    <span className="info-label">📝 BIO</span>
                    <span className="info-value">{userProfile.bio || "No bio yet..."}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "profile" && (
          <ProfilePage
            user={user}
            userProfile={userProfile}
            editForm={editForm}
            onDisplayNameChange={handleDisplayNameChange}
            onBioChange={handleBioChange}
            onAvatarChange={handleAvatarChange}
            onSaveProfile={saveProfile}
            showSaveSuccess={showSaveSuccess}
            quests={quests}
            stats={stats}
            character={character}
            characterTier={characterTier}
            evolutionProgress={evolutionProgress}
            activeDays={activeDays}
            achievements={achievements}
          />
        )}
        
        {/* REPLACED THE PLACEHOLDER WITH ACTUAL ANALYTICS COMPONENT */}
        {activeTab === "analytics" && <Analytics />}
        
        {activeTab === "upgrade" && <Upgrade />}
      </div>

      {showModal && (
        <CreateQuestModal
          onClose={() => setShowModal(false)}
          onSave={handleSaveQuest}
        />
      )}
    </div>
  );
}