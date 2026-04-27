import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, ComposedChart
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
        
        // Check subscription from backend
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
          
          // Check if user has real data
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

  // Generate real analytics data from user's quests (NO DUMMY DATA)
  const generateRealAnalyticsData = (userQuests) => {
    // Weekly data - last 7 days
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const today = new Date();
    const weekData = [];
    
    let hasAnyCompletions = false;
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      
      let completedCount = 0;
      userQuests.forEach(quest => {
        if (quest.logs?.includes(dateStr)) {
          completedCount++;
          hasAnyCompletions = true;
        }
      });
      
      const total = userQuests.length || 1;
      const percentage = Math.round((completedCount / total) * 100);
      
      weekData.push({
        day: weekDays[6 - i],
        completed: completedCount,
        total: total,
        percentage: percentage
      });
    }
    setWeeklyData(weekData);
    
    // Monthly data - last 4 weeks
    const monthData = [];
    for (let w = 0; w < 4; w++) {
      let weekCompleted = 0;
      let weekTotal = 0;
      for (let d = 0; d < 7; d++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (w * 7 + d));
        const dateStr = date.toISOString().split("T")[0];
        userQuests.forEach(quest => {
          if (quest.logs?.includes(dateStr)) {
            weekCompleted++;
          }
        });
        weekTotal += userQuests.length;
      }
      monthData.push({
        week: `Week ${4 - w}`,
        completed: weekCompleted,
        total: weekTotal,
        percentage: weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0
      });
    }
    setMonthlyData(monthData.reverse());
    
    // Habit breakdown - completion rates per quest
    const breakdown = [];
    const colors = ["#00e5ff", "#a855f7", "#22c55e", "#ffd84d", "#f97316", "#ef4444", "#06b6d4", "#ec4899"];
    userQuests.forEach((quest, idx) => {
      const completionCount = quest.logs?.length || 0;
      const maxDays = quest.days || 30;
      const percentage = Math.min(100, Math.round((completionCount / maxDays) * 100));
      
      breakdown.push({
        name: quest.name.length > 15 ? quest.name.slice(0, 12) + "..." : quest.name,
        value: percentage,
        color: colors[idx % colors.length]
      });
    });
    setHabitBreakdown(breakdown);
    
    // Heatmap data - last 4 weeks
    const heatmap = [];
    const weekNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    for (let week = 0; week < 4; week++) {
      for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (week * 7 + (6 - day)));
        const dateStr = date.toISOString().split("T")[0];
        
        let completedCount = 0;
        userQuests.forEach(quest => {
          if (quest.logs?.includes(dateStr)) {
            completedCount++;
          }
        });
        
        if (week === 0) {
          heatmap.push({
            day: weekNames[day],
            week1: completedCount,
            week2: 0,
            week3: 0,
            week4: 0
          });
        } else if (week === 1) {
          heatmap[day].week2 = completedCount;
        } else if (week === 2) {
          heatmap[day].week3 = completedCount;
        } else if (week === 3) {
          heatmap[day].week4 = completedCount;
        }
      }
    }
    setHeatmapData(heatmap);
  };

  // Calculate stats from real data
  const totalQuests = quests.length;
  const totalCompletions = stats.xp ? Math.floor(stats.xp / 10) : 0;
  const currentStreak = stats.streak || 0;
  const bestStreak = stats.streak || 0;
  const level = Math.floor((stats.xp || 0) / 100) + 1;

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

  // If no quests, show empty state
  if (totalQuests === 0) {
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
        {/* Header */}
        <div className="analytics-header">
          <h1>📊 Analytics Dashboard</h1>
          <p>Track your progress, analyze patterns, and level up your habits</p>
        </div>

        {/* Stats Cards - REAL DATA */}
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

        {/* Weekly Progress Chart - REAL DATA */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>📈 Weekly Progress</h3>
            <span>Last 7 days</span>
          </div>
          <div className="github-chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2a4a" />
                <XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#161e30", border: "1px solid #00e5ff", borderRadius: "8px" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="completed" fill="#00e5ff" radius={[4, 4, 0, 0]} barSize={30} />
                <Line type="monotone" dataKey="percentage" stroke="#a855f7" strokeWidth={2} dot={{ fill: "#a855f7", r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Progress & Habit Breakdown - REAL DATA */}
        <div className="two-columns">
          <div className="chart-card">
            <div className="chart-header">
              <h3>📅 Monthly Overview</h3>
              <span>Last 4 weeks</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2a4a" />
                <XAxis dataKey="week" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#161e30", border: "1px solid #a855f7", borderRadius: "8px" }}
                />
                <Bar dataKey="completed" fill="#a855f7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3>🥧 Habit Breakdown</h3>
              <span>Completion rates</span>
            </div>
            {habitBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={habitBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
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
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart">✨ Complete more quests to see breakdown!</div>
            )}
          </div>
        </div>

        {/* Activity Heatmap - REAL DATA */}
        <div className="chart-card full-width">
          <div className="chart-header">
            <h3>🔥 Activity Heatmap</h3>
            <span>Daily completions over 4 weeks</span>
          </div>
          <div className="heatmap-container">
            <div className="heatmap-grid">
              {heatmapData.map((row, idx) => (
                <div key={idx} className="heatmap-row">
                  <span className="heatmap-day-label">{row.day}</span>
                  <div className="heatmap-cells">
                    <div className={`heatmap-cell level-${Math.min(5, row.week1)}`} title={`Week 1: ${row.week1} completions`}>
                      {row.week1 > 0 && <span className="heatmap-value">{row.week1}</span>}
                    </div>
                    <div className={`heatmap-cell level-${Math.min(5, row.week2)}`} title={`Week 2: ${row.week2} completions`}>
                      {row.week2 > 0 && <span className="heatmap-value">{row.week2}</span>}
                    </div>
                    <div className={`heatmap-cell level-${Math.min(5, row.week3)}`} title={`Week 3: ${row.week3} completions`}>
                      {row.week3 > 0 && <span className="heatmap-value">{row.week3}</span>}
                    </div>
                    <div className={`heatmap-cell level-${Math.min(5, row.week4)}`} title={`Week 4: ${row.week4} completions`}>
                      {row.week4 > 0 && <span className="heatmap-value">{row.week4}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="week-labels">
              <span></span>
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </div>
          <div className="heatmap-legend">
            <span>Less</span>
            <div className="legend-colors">
              <div className="legend-color level-0"></div>
              <div className="legend-color level-1"></div>
              <div className="legend-color level-2"></div>
              <div className="legend-color level-3"></div>
              <div className="legend-color level-4"></div>
              <div className="legend-color level-5"></div>
            </div>
            <span>More</span>
          </div>
        </div>

        {/* XP Progression */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>⭐ XP Progression</h3>
            <span>Level {level}</span>
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