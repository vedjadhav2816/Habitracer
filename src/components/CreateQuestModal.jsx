import { useState } from "react";
import "../styles/quest.css";

const icons = ["🏃", "📚", "💪", "🧘", "💧", "🥗", "😴", "✍️"];

export default function CreateQuestModal({ onClose, onSave }) {

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    icon: icons[0],
    name: "",
    days: 90,
    goalType: "once",
    goalValue: "",
    selectedDays: [],
    reminderTime: "",
    reminderEnabled: false,
  });

  const [goalType, setGoalType] = useState("once");
  const [goalValue, setGoalValue] = useState("");

  const goalIcons = {
    once: "✅",
    time: "⏱️",
    count: "🔢",
    custom: "📝",
  };

  // STEP 1
  const handleStep1 = () => {
    if (!form.name) return alert("Enter quest name");
    setStep(2);
  };

  // GRID
  const Grid = ({ days }) => {
    return (
      <div className="grid">
        {Array.from({ length: Math.min(days, 120) }).map((_, i) => (
          <div
            key={i}
            className={`box ${i < Math.min(days, 10) ? "active" : ""}`}
          ></div>
        ))}
      </div>
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        {/* HEADER */}
        <div className="modal-header">
          <span>STEP {step} OF 4</span>
          <button onClick={onClose}>✖</button>
        </div>

        {/* STEP INDICATOR */}
        <div className="steps">
          {[1,2,3,4].map(s => (
            <div key={s} className={`step ${step >= s ? "active" : ""}`}></div>
          ))}
        </div>

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <>
            <h2>⚔️ Name Your Quest</h2>
            <p>Pick an icon and name your habit.</p>

            <div className="icon-grid">
              {icons.map((icon, i) => (
                <div
                  key={i}
                  className={`icon-box ${form.icon === icon ? "active" : ""}`}
                  onClick={() => setForm({ ...form, icon })}
                >
                  {icon}
                </div>
              ))}
            </div>

            <input
              className="quest-input"
              placeholder="e.g. Morning Run..."
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <button className="next-btn" onClick={handleStep1}>
              Continue →
            </button>
          </>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <>
            <h2>📅 Quest Length</h2>
            <p>How long will you commit?</p>

            <Grid days={form.days} />

            <div className="days-label">{form.days} DAYS</div>

            <div className="options">

              <div
                className={`option ${form.days === 30 ? "active" : ""}`}
                onClick={() => setForm({ ...form, days: 30 })}
              >
                🌙 <h4>30 Days</h4><span>Monthly</span>
              </div>

              <div
                className={`option ${form.days === 90 ? "active" : ""}`}
                onClick={() => setForm({ ...form, days: 90 })}
              >
                🔄 <h4>90 Days</h4><span>Seasonal</span>
              </div>

              <div
                className={`option ${form.days === 365 ? "active" : ""}`}
                onClick={() => setForm({ ...form, days: 365 })}
              >
                🏆 <h4>1 Year</h4><span>Epic</span>
              </div>

            </div>

            <input
              type="number"
              placeholder="Custom days..."
              className="quest-input"
              onChange={(e) =>
                setForm({ ...form, days: Number(e.target.value) })
              }
            />

            <div className="actions">
              <button onClick={() => setStep(1)}>← Back</button>
              <button className="next-btn" onClick={() => setStep(3)}>
                Continue →
              </button>
            </div>
          </>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <>
            <h2>🎯 Daily Target</h2>
            <p>What does success look like each day?</p>

            <div className="center-icon">
              {goalIcons[goalType]}
            </div>

            <div className="bars-preview">
              <div className="bar c1"></div>
              <div className="bar c2"></div>
              <div className="bar c3"></div>
            </div>

            <div className="goal-options">

              <div
                className={`goal-box ${goalType === "once" ? "active" : ""}`}
                onClick={() => setGoalType("once")}
              >
                ✅ <div>
                  <h4>Do It Once</h4>
                  <span>Show up daily</span>
                </div>
              </div>

              <div
                className={`goal-box ${goalType === "time" ? "active" : ""}`}
                onClick={() => setGoalType("time")}
              >
                ⏱️ <div>
                  <h4>Time-Based</h4>
                  <span>e.g. 30 min</span>
                </div>
              </div>

              <div
                className={`goal-box ${goalType === "count" ? "active" : ""}`}
                onClick={() => setGoalType("count")}
              >
                🔢 <div>
                  <h4>Count-Based</h4>
                  <span>e.g. 10 reps</span>
                </div>
              </div>

              <div
                className={`goal-box ${goalType === "custom" ? "active" : ""}`}
                onClick={() => setGoalType("custom")}
              >
                📝 <div>
                  <h4>Custom Goal</h4>
                  <span>Your own</span>
                </div>
              </div>

            </div>

            <input
              className="quest-input"
              placeholder="Describe goal..."
              value={goalValue}
              onChange={(e) => setGoalValue(e.target.value)}
            />

            <div className="actions">
              <button onClick={() => setStep(2)}>← Back</button>

              <button
                className="next-btn"
                onClick={() => {
                  setForm({
                    ...form,
                    goalType,
                    goalValue,
                  });
                  setStep(4);
                }}
              >
                Continue →
              </button>
            </div>
          </>
        )}

        {/* ================= STEP 4 ================= */}
        {step === 4 && (
          <>
            <h2>⏰ Set Reminder</h2>
            <p>Choose when you want to be reminded.</p>

            {/* DAYS */}
            <div className="days-select">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day) => (
                <div
                  key={day}
                  className={`day-box ${
                    form.selectedDays.includes(day) ? "active" : ""
                  }`}
                  onClick={() => {
                    const updated = form.selectedDays.includes(day)
                      ? form.selectedDays.filter(d => d !== day)
                      : [...form.selectedDays, day];

                    setForm({ ...form, selectedDays: updated });
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* TIME */}
            <input
              type="time"
              className="quest-input"
              onChange={(e) =>
                setForm({ ...form, reminderTime: e.target.value })
              }
            />

            {/* TOGGLE */}
            <div className="reminder-toggle">
              <span>Email Reminder</span>
              <input
                type="checkbox"
                checked={form.reminderEnabled}
                onChange={(e) =>
                  setForm({ ...form, reminderEnabled: e.target.checked })
                }
              />
            </div>

            {/* PREVIEW */}
            <div className="preview-box">
              <p>📩 Reminder Preview</p>
              <span>
                {form.reminderTime || "Select time"} •{" "}
                {form.selectedDays.join(", ") || "No days selected"}
              </span>
            </div>

            {/* ACTIONS */}
            <div className="actions">
              <button onClick={() => setStep(3)}>← Back</button>

              <button
                className="next-btn"
                onClick={() => {
                  onSave(form);
                  onClose();
                }}
              >
                🚀 Create Quest
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}