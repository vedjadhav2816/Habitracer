import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import "../styles/analytics.css";

export default function Analytics() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [quests, setQuests] = useState([]);
  const [stats, setStats] = useState({});
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sample data for charts (replace with real data from your backend)
  const weeklyData = [
    { day: "Mon", completed: 3, total: 5, percentage: 60 },
    { day: "Tue", completed: 4, total: 5, percentage: 80 },
    { day: "Wed", completed: 5, total: 5, percentage: 100 },
    { day: "Thu", completed: 2, total: 5, percentage: 40 },
    { day: "Fri", completed: 4, total: 5, percentage: 80 },
    { day: "Sat", completed: 5, total: 5, percentage: 100 },
    { day: "Sun", completed: 3, total: 5, percentage: 60 },
  ];

  const monthlyData = [
    { week: "Week 1", completed: 18, total: 35, percentage: 51 },
    { week: "Week 2", completed: 24, total: 35, percentage: 68 },
    { week: "Week 3", completed: 28, total: 35, percentage: 80 },
    { week: "Week 4", completed: 22, total: 35, percentage: 63 },
  ];

  const habitBreakdown = [
    { name: "Morning Run", value: 85, color: "#00e5ff" },
    { name: "Read Books", value: 60, color: "#a855f7" },
    { name: "Drink Water", value: 95, color: "#22c55e" },
    { name: "Meditation", value: 45, color: "#ffd84d" },
    { name: "Exercise", value: 70, color: "#f97316" },
  ];

  const heatmapData = [
    { day: "Mon", week1: 3, week2: 4, week3: 5, week4: 2 },
    { day: "Tue", week1: 2, week2: 5, week3: 4, week4: 3 },
    { day: "Wed", week1: 4, week2: 3, week3: 5, week4: 4 },
    { day: "Thu", week1: 1, week2: 2, week3: 3, week4: 5 },
    { day: "Fri", week1: 3, week2: 4, week3: 2, week4: 4 },
    { day: "Sat", week1: 5, week2: 5, week3: 4, week4: 5 },
    { day: "Sun", week1: 2, week2: 3, week3: 4, week4: 3 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          navigate("/login");
          return;
        }

        const userRes = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${userId}`);
        const userData = await userRes.json();
        setUser(userData);
        
        // Check if user is PRO (from your database)
        // For now, using localStorage or you can fetch from backend
        const userPlan = localStorage.getItem("userPlan") || "free";
        setIsPro(userPlan === "pro");

        const questsRes = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${userId}/quests`);
        const questsData = await questsRes.json();
        if (questsData.success) {
          setQuests(questsData.quests || []);
          setStats(questsData.stats || {});
        }
      } catch (err) {
        console.error("Error fetching analytics data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Calculate stats
  const totalQuests = quests.length;
  const totalCompletions = stats.xp ? Math.floor(stats.xp / 10) : 0;
  const averageCompletion = weeklyData.reduce((sum, d) => sum + d.percentage, 0) / 7;
  const currentStreak = stats.streak || 0;
  const bestStreak = Math.max(stats.streak || 0, 5);

  // Pro feature lock overlay
  if (!isPro && !loading) {
    return (
      <div className="analytics-lock">
        <div className="lock-container">
          <div className="lock-icon">🔒</div>
          <h2>Analytics Dashboard</h2>
          <p>Unlock detailed insights about your habits,<br />streaks, and character progression.</p>
          <div className="pro-features-list">
            <h3>✨ Pro Features Include:</h3>
            <ul>
              <li>📊 Advanced Analytics & Charts</li>
              <li>🔥 Heatmap of your activity</li>
              <li>📈 Weekly & Monthly Reports</li>
              <li>🏆 Habit Breakdown Analysis</li>
              <li>⚡ Unlimited Quests</li>
              <li>🌟 Exclusive Character Skins</li>
            </ul>
          </div>
          <button className="upgrade-btn-analytics" onClick={() => navigate("/upgrade")}>
            ⚡ Upgrade to Pro — ₹299/month
          </button>
          <p className="lock-subtitle">Join 12,400+ heroes who already upgraded!</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner">📊</div>
        <p>Loading your analytics...</p>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <div className="analytics-container">
        {/* Header */}
        <div className="analytics-header">
          <h1>📊 Analytics Dashboard</h1>
          <p>Track your progress, analyze patterns, and level up your habits</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid-analytics">
          <div className="stat-card-analytics cyan">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <h3>{totalQuests}</h3>
              <p>Active Quests</p>
            </div>
          </div>
          <div className="stat-card-analytics gold">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{totalCompletions}</h3>
              <p>Total Completions</p>
            </div>
          </div>
          <div className="stat-card-analytics purple">
            <div className="stat-icon">🔥</div>
            <div className="stat-info">
              <h3>{currentStreak}</h3>
              <p>Current Streak</p>
            </div>
          </div>
          <div className="stat-card-analytics green">
            <div className="stat-icon">🏆</div>
            <div className="stat-info">
              <h3>{bestStreak}</h3>
              <p>Best Streak</p>
            </div>
          </div>
        </div>

        {/* Weekly Progress Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>📈 Weekly Progress</h3>
            <span>Last 7 days</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2a4a" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: "#161e30", border: "1px solid #00e5ff", borderRadius: "8px" }}
                labelStyle={{ color: "#fff" }}
              />
              <Area type="monotone" dataKey="percentage" stroke="#00e5ff" fill="#00e5ff20" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Progress & Habit Breakdown */}
        <div className="two-columns">
          <div className="chart-card">
            <div className="chart-header">
              <h3>📅 Monthly Overview</h3>
              <span>Last 4 weeks</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2a4a" />
                <XAxis dataKey="week" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#161e30", border: "1px solid #a855f7", borderRadius: "8px" }}
                />
                <Bar dataKey="percentage" fill="#a855f7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3>🥧 Habit Breakdown</h3>
              <span>Completion rates</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={habitBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: "#94a3b8", strokeWidth: 1 }}
                >
                  {habitBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#161e30", border: "1px solid #22c55e", borderRadius: "8px" }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Heatmap */}
        <div className="chart-card full-width">
          <div className="chart-header">
            <h3>🗓️ Activity Heatmap</h3>
            <span>Daily completions over 4 weeks</span>
          </div>
          <div className="heatmap-container">
            <table className="heatmap-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Week 1</th>
                  <th>Week 2</th>
                  <th>Week 3</th>
                  <th>Week 4</th>
                </tr>
              </thead>
              <tbody>
                {heatmapData.map((row) => (
                  <tr key={row.day}>
                    <td className="heatmap-day">{row.day}</td>
                    <td className={`heatmap-cell level-${row.week1}`}>{row.week1}</td>
                    <td className={`heatmap-cell level-${row.week2}`}>{row.week2}</td>
                    <td className={`heatmap-cell level-${row.week3}`}>{row.week3}</td>
                    <td className={`heatmap-cell level-${row.week4}`}>{row.week4}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="heatmap-legend">
            <span>Low</span>
            <div className="legend-colors">
              <div className="legend-color level-1"></div>
              <div className="legend-color level-2"></div>
              <div className="legend-color level-3"></div>
              <div className="legend-color level-4"></div>
              <div className="legend-color level-5"></div>
            </div>
            <span>High</span>
          </div>
        </div>

        {/* XP Progression */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>⭐ XP Progression</h3>
            <span>Level {Math.floor((stats.xp || 0) / 100) + 1}</span>
          </div>
          <div className="xp-progress-container">
            <div className="xp-progress-bar">
              <div className="xp-progress-fill" style={{ width: `${(stats.xp || 0) % 100}%` }}></div>
            </div>
            <p className="xp-text">{stats.xp || 0} XP earned</p>
          </div>
          <div className="xp-milestones">
            <div className="milestone">Novice</div>
            <div className="milestone">Apprentice</div>
            <div className="milestone">Warrior</div>
            <div className="milestone">Champion</div>
            <div className="milestone">Legend</div>
            <div className="milestone">Mythic</div>
          </div>
        </div>

        {/* Pro Badge */}
        <div className="pro-badge-analytics">
          <span>⭐ PRO MEMBER</span>
          <p>You have access to all premium features</p>
        </div>
      </div>
    </div>
  );
}