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
  const [heatmapWeekLabels, setHeatmapWeekLabels] = useState([]);
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

  const generateRealAnalyticsData = (userQuests) => {
    // Weekly data - last 7 days
    const today = new Date();
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayName = dayNames[date.getDay()];
      
      let completedCount = 0;
      userQuests.forEach(quest => {
        if (quest.logs?.includes(dateStr)) {
          completedCount++;
        }
      });
      
      const total = userQuests.length || 1;
      const percentage = Math.round((completedCount / total) * 100);
      
      weekData.push({
        day: dayName,
        fullDate: `${date.getMonth() + 1}/${date.getDate()}`,
        completed: completedCount,
        total: total,
        percentage: percentage,
        isToday: i === 0
      });
    }
    setWeeklyData(weekData);
    
    // Monthly data
    const monthData = [];
    const weeks = getLast4WeeksRangeWithDates();
    
    for (let w = 0; w < weeks.length; w++) {
      const weekRange = weeks[w];
      let weekCompleted = 0;
      let weekTotal = 0;
      
      for (const dateStr of weekRange.dates) {
        let dayCompleted = 0;
        userQuests.forEach(quest => {
          if (quest.logs?.includes(dateStr)) {
            dayCompleted++;
          }
        });
        weekCompleted += dayCompleted;
        weekTotal += userQuests.length;
      }
      
      monthData.push({
        week: weekRange.label,
        dateRange: weekRange.dateRange,
        completed: weekCompleted,
        total: weekTotal,
        percentage: weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0
      });
    }
    setMonthlyData(monthData);
    
    // Habit breakdown
    const breakdown = [];
    const colors = ["#00e5ff", "#a855f7", "#22c55e", "#ffd84d", "#f97316", "#ef4444", "#06b6d4", "#ec4899"];
    userQuests.forEach((quest, idx) => {
      const completionCount = quest.logs?.length || 0;
      const maxDays = quest.days || 30;
      const percentage = Math.min(100, Math.round((completionCount / maxDays) * 100));
      
      breakdown.push({
        name: quest.name.length > 15 ? quest.name.slice(0, 12) + "..." : quest.name,
        value: percentage,
        color: colors[idx % colors.length],
        completions: completionCount,
        totalDays: maxDays
      });
    });
    setHabitBreakdown(breakdown);
    
    // Heatmap data - IMPROVED WITH BETTER VISUALIZATION
    const todayDate = new Date();
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weekLabels = [];
    const heatmapRows = [];
    
    // Create week labels with date ranges
    for (let week = 0; week < 4; week++) {
      const weekEnd = new Date(todayDate);
      weekEnd.setDate(todayDate.getDate() - (week * 7));
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekEnd.getDate() - 6);
      
      const startStr = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
      const endStr = `${weekEnd.getMonth() + 1}/${weekEnd.getDate()}`;
      
      weekLabels.push({
        id: week,
        label: `Week ${week + 1}`,
        range: `${startStr} - ${endStr}`,
        startDate: weekStart,
        endDate: weekEnd
      });
    }
    setHeatmapWeekLabels(weekLabels);
    
    // Get today's date info for highlighting
    const todayStr = todayDate.toISOString().split("T")[0];
    const todayMonthDay = `${todayDate.getMonth() + 1}/${todayDate.getDate()}`;
    
    // Collect all dates for the last 4 weeks with additional metadata
    const allDates = [];
    for (let week = 0; week < 4; week++) {
      const weekLabel = weekLabels[week];
      for (let day = 0; day < 7; day++) {
        const date = new Date(weekLabel.startDate);
        date.setDate(weekLabel.startDate.getDate() + day);
        const dateStr = date.toISOString().split("T")[0];
        const displayDate = `${date.getMonth() + 1}/${date.getDate()}`;
        let dayName = dayNames[date.getDay() === 0 ? 6 : date.getDay() - 1];
        
        // Fix Sunday mapping
        if (date.getDay() === 0) dayName = "Sun";
        
        let completedCount = 0;
        userQuests.forEach(quest => {
          if (quest.logs?.includes(dateStr)) {
            completedCount++;
          }
        });
        
        allDates.push({
          week: week,
          dayName: dayName,
          displayDate: displayDate,
          fullDate: dateStr,
          count: completedCount,
          isToday: dateStr === todayStr
        });
      }
    }
    
    // Group by day name
    for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
      const dayName = dayNames[dayIdx];
      const rowData = {
        day: dayName,
        week1: { count: 0, date: "", isToday: false },
        week2: { count: 0, date: "", isToday: false },
        week3: { count: 0, date: "", isToday: false },
        week4: { count: 0, date: "", isToday: false }
      };
      
      for (let week = 0; week < 4; week++) {
        const dateData = allDates.find(d => d.week === week && d.dayName === dayName);
        if (dateData) {
          rowData[`week${week + 1}`] = {
            count: dateData.count,
            date: dateData.displayDate,
            isToday: dateData.isToday
          };
        }
      }
      heatmapRows.push(rowData);
    }
    setHeatmapData(heatmapRows);
  };

  const getLast4WeeksRangeWithDates = () => {
    const today = new Date();
    const weeks = [];
    
    for (let w = 0; w < 4; w++) {
      const endDate = new Date(today);
      endDate.setDate(today.getDate() - (w * 7));
      const startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 6);
      
      const startStr = `${startDate.getMonth() + 1}/${startDate.getDate()}`;
      const endStr = `${endDate.getMonth() + 1}/${endDate.getDate()}`;
      
      const dates = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + d);
        dates.push(date.toISOString().split("T")[0]);
      }
      
      weeks.push({
        label: `Week ${w + 1}`,
        dateRange: `${startStr} - ${endStr}`,
        dates: dates
      });
    }
    return weeks;
  };

  const totalQuests = quests.length;
  const totalCompletions = stats.xp ? Math.floor(stats.xp / 10) : 0;
  const currentStreak = stats.streak || 0;
  const bestStreak = stats.streak || 0;
  const level = Math.floor((stats.xp || 0) / 100) + 1;

  const WeeklyTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-date">{data.fullDate}</p>
          <p className="tooltip-completed">✅ Completed: {data.completed}/{data.total}</p>
          <p className="tooltip-percentage">📊 Rate: {data.percentage}%</p>
          {data.isToday && <p className="tooltip-today">📅 Today</p>}
        </div>
      );
    }
    return null;
  };

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
        <div className="analytics-header">
          <h1>📊 Analytics Dashboard</h1>
          <p>Track your progress, analyze patterns, and level up your habits</p>
        </div>

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

        <div className="chart-card">
          <div className="chart-header">
            <h3>📈 Weekly Progress</h3>
            <span>Last 7 days</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2a4a" />
              <XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <Tooltip content={<WeeklyTooltip />} />
              <Bar dataKey="completed" fill="#00e5ff" radius={[4, 4, 0, 0]} barSize={30} />
              <Line type="monotone" dataKey="percentage" stroke="#a855f7" strokeWidth={2} dot={{ fill: "#a855f7", r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

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
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0] && payload[0].payload) {
                      const data = payload[0].payload;
                      return `${label} (${data.dateRange})`;
                    }
                    return label;
                  }}
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
                    formatter={(value, name, props) => {
                      const data = props.payload;
                      return [`${value}%`, `${data.name} (${data.completions}/${data.totalDays} days)`];
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart">✨ Complete more quests to see breakdown!</div>
            )}
          </div>
        </div>

        {/* Enhanced Activity Heatmap */}
        <div className="chart-card full-width">
          <div className="chart-header">
            <h3>🔥 Activity Heatmap</h3>
            <span>Daily completions over 4 weeks</span>
          </div>
          <div className="heatmap-container">
            {/* Week labels header */}
            <div className="heatmap-week-header">
              <div className="week-header-spacer"></div>
              {heatmapWeekLabels.map((week) => (
                <div key={week.id} className="week-header-cell">
                  <div className="week-title">{week.label}</div>
                  <div className="week-date-range">{week.range}</div>
                </div>
              ))}
            </div>
            
            {/* Heatmap body */}
            <div className="heatmap-body">
              {heatmapData.map((row, idx) => (
                <div key={idx} className="heatmap-row">
                  <div className="heatmap-day-name">{row.day}</div>
                  <div className="heatmap-cells">
                    <div 
                      className={`heatmap-cell ${row.week1.isToday ? 'today-cell' : ''} level-${Math.min(5, row.week1.count)}`} 
                      title={`Week 1 - ${row.day} ${row.week1.date}: ${row.week1.count} completion${row.week1.count !== 1 ? 's' : ''}`}
                    >
                      {row.week1.count > 0 && <span className="heatmap-value">{row.week1.count}</span>}
                      {row.week1.isToday && <span className="today-indicator">●</span>}
                    </div>
                    <div 
                      className={`heatmap-cell ${row.week2.isToday ? 'today-cell' : ''} level-${Math.min(5, row.week2.count)}`} 
                      title={`Week 2 - ${row.day} ${row.week2.date}: ${row.week2.count} completion${row.week2.count !== 1 ? 's' : ''}`}
                    >
                      {row.week2.count > 0 && <span className="heatmap-value">{row.week2.count}</span>}
                    </div>
                    <div 
                      className={`heatmap-cell ${row.week3.isToday ? 'today-cell' : ''} level-${Math.min(5, row.week3.count)}`} 
                      title={`Week 3 - ${row.day} ${row.week3.date}: ${row.week3.count} completion${row.week3.count !== 1 ? 's' : ''}`}
                    >
                      {row.week3.count > 0 && <span className="heatmap-value">{row.week3.count}</span>}
                    </div>
                    <div 
                      className={`heatmap-cell ${row.week4.isToday ? 'today-cell' : ''} level-${Math.min(5, row.week4.count)}`} 
                      title={`Week 4 - ${row.day} ${row.week4.date}: ${row.week4.count} completion${row.week4.count !== 1 ? 's' : ''}`}
                    >
                      {row.week4.count > 0 && <span className="heatmap-value">{row.week4.count}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Today indicator legend */}
            <div className="heatmap-today-legend">
              <span className="today-dot">●</span>
              <span>Today's date</span>
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

        <div className="pro-badge-analytics">
          <span>⭐ PRO MEMBER</span>
          <p>You have access to all premium features</p>
        </div>
      </div>
    </div>
  );
}