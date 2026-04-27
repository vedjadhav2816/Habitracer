import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import "../styles/analytics.css";

export default function Analytics() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [quests, setQuests] = useState([]);
  const [stats, setStats] = useState({});
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState([]);
  const [habitBreakdown, setHabitBreakdown] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [hasRealData, setHasRealData] = useState(false);

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
        
        const subRes = await fetch(`${process.env.REACT_APP_API_URL}/api/check-subscription/${userId}`);
        const subData = await subRes.json();
        
        const proStatus = subData.isPro === true;
        setIsPro(proStatus);
        
        if (proStatus) {
          localStorage.setItem("userPlan", subData.planType || "pro");
        } else {
          localStorage.setItem("userPlan", "free");
        }

        const questsRes = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${userId}/quests`);
        const questsData = await questsRes.json();
        if (questsData.success) {
          const userQuests = questsData.quests || [];
          setQuests(userQuests);
          setStats(questsData.stats || {});
          
          const hasData = userQuests.length > 0;
          setHasRealData(hasData);
          
          if (hasData) {
            generateRealAnalyticsData(userQuests);
          }
        }
      } catch (err) {
        console.error("Error fetching analytics data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // ==================== YOUR ORIGINAL LOGIC (UNCHANGED) ====================
  const generateRealAnalyticsData = (userQuests) => {
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const today = new Date();
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      
      let completedCount = 0;
      userQuests.forEach(quest => {
        if (quest.logs?.includes(dateStr)) completedCount++;
      });
      
      const total = userQuests.length || 1;
      const percentage = Math.round((completedCount / total) * 100);
      
      weekData.push({ day: weekDays[6 - i], percentage });
    }
    setWeeklyData(weekData);

    // Monthly Data
    const monthData = [];
    for (let w = 0; w < 4; w++) {
      let weekCompleted = 0;
      for (let d = 0; d < 7; d++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (w * 7 + d));
        const dateStr = date.toISOString().split("T")[0];
        userQuests.forEach(quest => {
         if (quest.logs?.includes(dateStr)) weekCompleted++;
        });
      }
      monthData.push({
        week: `Week ${4 - w}`,
        completed: weekCompleted
      });
    }
    setMonthlyData(monthData.reverse());

    // Habit Breakdown
    const colors = ["#a855f7", "#00e5ff", "#64748b", "#22c55e", "#ffd84d"];
    const breakdown = userQuests.slice(0, 3).map((quest, idx) => ({
      name: quest.name.length > 12 ? quest.name.slice(0, 12) + "..." : quest.name,
      value: Math.min(100, Math.round((quest.logs?.length || 0) / 30 * 100)),
      color: colors[idx]
    }));
    if (breakdown.length === 0) {
      breakdown.push({ name: "Gym", value: 45, color: "#a855f7" });
      breakdown.push({ name: "Run", value: 35, color: "#00e5ff" });
      breakdown.push({ name: "Other", value: 20, color: "#64748b" });
    }
    setHabitBreakdown(breakdown);
  };

  // Pro Lock
  if (!isPro && !loading) {
    return (
      <div className="analytics-lock">
        <div className="lock-container">
          <div className="lock-icon">🔒</div>
          <h2>Analytics Dashboard</h2>
          <p>Unlock detailed insights about your habits,<br />streaks, and character progression.</p>
          <button className="upgrade-btn-analytics" onClick={() => navigate("/upgrade")}>
            ⚡ Upgrade to Pro — ₹299/month
          </button>
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

  if (quests.length === 0) {
    return (
      <div className="analytics-page">
        <div className="analytics-container">
          <div className="analytics-header">
            <h1>📊 Analytics Dashboard</h1>
            <p>Complete some quests to see your analytics!</p>
          </div>
          <div className="empty-state-analytics">
            <div className="empty-icon">🗺️</div>
            <h3>No Data Yet</h3>
            <p>Start creating and completing quests to see your progress charts here.</p>
            <button className="create-quest-btn" onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <div className="analytics-container">
        {/* Header - Exact match */}
        <div className="analytics-header">
          <h1>📊 Analytics Dashboard</h1>
          <p>Track your progress, analyze patterns, and level up your habits</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid-analytics">
          <div className="stat-card-analytics">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <h3>{quests.length}</h3>
              <p>Active Quests</p>
            </div>
          </div>
          <div className="stat-card-analytics">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{stats.xp ? Math.floor(stats.xp / 10) : 9}</h3>
              <p>Total Completions</p>
            </div>
          </div>
          <div className="stat-card-analytics">
            <div className="stat-icon">🔥</div>
            <div className="stat-info">
              <h3>{stats.streak || 1}</h3>
              <p>Current Streak</p>
            </div>
          </div>
          <div className="stat-card-analytics">
            <div className="stat-icon">🏆</div>
            <div className="stat-info">
              <h3>{stats.streak || 1}</h3>
              <p>Best Streak</p>
            </div>
          </div>
        </div>

        {/* Weekly Progress - Matches Image */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>📈 Weekly Progress</h3>
            <span>Completion Rate</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis domain={[0, 100]} stroke="#94a3b8" />
              <Tooltip />
              <Line type="natural" dataKey="percentage" stroke="#00e5ff" strokeWidth={4} 
                    dot={{ fill: "#00e5ff", r: 6, stroke: "#111827", strokeWidth: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly + Habit Breakdown */}
        <div className="two-columns">
          <div className="chart-card">
            <div className="chart-header">
              <h3>📅 Monthly Overview</h3>
              <span>Last 4 weeks</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="week" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="completed" fill="#22d3ee" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3>🥧 Habit Breakdown</h3>
              <span>Completion rates</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={habitBreakdown} cx="50%" cy="50%" innerRadius={65} outerRadius={95} dataKey="value">
                  {habitBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend - Exact match to image */}
            <div className="habit-legend">
              {habitBreakdown.map((item, i) => (
                <div key={i} className="legend-item">
                  <span className="legend-dot" style={{ background: item.color }}></span>
                  <span>{item.name}</span>
                  <strong>{item.value}%</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}