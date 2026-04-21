import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

const DIFFICULTY_COLORS = {
  Easy: { color: "var(--green)", bg: "var(--green-dim)", border: "rgba(34,211,160,0.25)" },
  Medium: { color: "var(--yellow)", bg: "var(--yellow-dim)", border: "rgba(251,191,36,0.25)" },
  Hard: { color: "var(--red)", bg: "var(--red-dim)", border: "rgba(248,114,114,0.25)" },
};

const STATUS_COLORS = {
  Solved: { color: "var(--green)", bg: "var(--green-dim)" },
  Pending: { color: "var(--yellow)", bg: "var(--yellow-dim)" },
};

const RECOMMENDED = [
  { title: "Two Sum", topic: "Arrays", difficulty: "Easy" },
  { title: "Binary Search", topic: "Searching", difficulty: "Easy" },
  { title: "Merge Intervals", topic: "Arrays", difficulty: "Medium" },
  { title: "Climbing Stairs", topic: "DP", difficulty: "Easy" },
  { title: "LRU Cache", topic: "Design", difficulty: "Hard" },
];

const inputStyle = {
  width: "100%",
  background: "var(--surface-2)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  padding: "10px 14px",
  color: "var(--text)",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};

function Badge({ label, style: styleOverride }) {
  return (
    <span style={{ fontSize: "11px", fontWeight: "600", padding: "2px 8px", borderRadius: "99px", letterSpacing: "0.3px", textTransform: "uppercase", ...styleOverride }}>
      {label}
    </span>
  );
}

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({ title: "", topic: "", difficulty: "Easy", status: "Pending", notes: "" });
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState("All");
  const token = localStorage.getItem("token");

  useEffect(() => { fetchQuestions(); }, []);

  const fetchQuestions = async () => {
    const res = await API.get("/questions", { headers: { authorization: token } });
    setQuestions(res.data);
  };

  const addQuestion = async (e) => {
    e.preventDefault();
    setAdding(true);
    await API.post("/questions", form, { headers: { authorization: token } });
    setForm({ title: "", topic: "", difficulty: "Easy", status: "Pending", notes: "" });
    await fetchQuestions();
    setAdding(false);
  };

  const addRecommended = async (item) => {
    await API.post("/questions", { ...item, status: "Pending", notes: "Recommended for interview prep" }, { headers: { authorization: token } });
    fetchQuestions();
  };

  const deleteQuestion = async (id) => {
    await API.delete(`/questions/${id}`, { headers: { authorization: token } });
    fetchQuestions();
  };

  const filtered = filter === "All" ? questions : questions.filter(q => q.status === filter);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)", padding: "0 24px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "30px", height: "30px", background: "linear-gradient(135deg, var(--accent), #a78bfa)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px" }}>⚡</div>
            <span style={{ fontWeight: "700", fontSize: "17px", letterSpacing: "-0.3px" }}>PrepTrack</span>
          </div>
          <Link to="/dashboard" style={{ padding: "7px 14px", background: "var(--accent-dim)", border: "1px solid var(--accent-border)", borderRadius: "8px", color: "var(--accent)", textDecoration: "none", fontSize: "13px", fontWeight: "500" }}>
            ← Dashboard
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: "36px" }} className="animate-fadeUp">
          <h1 style={{ fontSize: "30px", fontWeight: "700", letterSpacing: "-0.6px", marginBottom: "4px" }}>Interview Questions</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>{questions.length} questions tracked</p>
        </div>

        {/* Recommended */}
        <section className="animate-fadeUp-d1" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", padding: "24px", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
            <span style={{ fontSize: "16px" }}>⭐</span>
            <h2 style={{ fontWeight: "600", fontSize: "16px" }}>Recommended Questions</h2>
            <span style={{ marginLeft: "auto", fontSize: "11px", color: "var(--text-muted)", background: "var(--surface-2)", padding: "2px 8px", borderRadius: "99px" }}>Quick add</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "10px" }}>
            {RECOMMENDED.map((item, i) => {
              const dc = DIFFICULTY_COLORS[item.difficulty];
              const alreadyAdded = questions.some(q => q.title === item.title);
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "12px 14px", gap: "12px" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: "600", fontSize: "13px", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{item.topic}</span>
                      <span style={{ fontSize: "10px", color: "var(--border-light)" }}>•</span>
                      <Badge label={item.difficulty} style={{ color: dc.color, background: dc.bg, border: `1px solid ${dc.border}` }} />
                    </div>
                  </div>
                  <button
                    onClick={() => !alreadyAdded && addRecommended(item)}
                    disabled={alreadyAdded}
                    style={{ padding: "5px 12px", background: alreadyAdded ? "var(--surface)" : "var(--green-dim)", border: `1px solid ${alreadyAdded ? "var(--border)" : "rgba(34,211,160,0.3)"}`, borderRadius: "6px", color: alreadyAdded ? "var(--text-muted)" : "var(--green)", fontSize: "12px", fontWeight: "600", cursor: alreadyAdded ? "default" : "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
                  >
                    {alreadyAdded ? "Added ✓" : "+ Add"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Add Custom */}
        <section className="animate-fadeUp-d2" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", padding: "24px", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
            <span style={{ fontSize: "16px" }}>✏️</span>
            <h2 style={{ fontWeight: "600", fontSize: "16px" }}>Add Custom Question</h2>
          </div>
          <form onSubmit={addQuestion}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <input style={inputStyle} placeholder="Question Title" value={form.title} required
                onChange={e => setForm({ ...form, title: e.target.value })}
                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
              <input style={inputStyle} placeholder="Topic (e.g. Arrays)" value={form.topic} required
                onChange={e => setForm({ ...form, topic: e.target.value })}
                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
              <select style={{ ...inputStyle, cursor: "pointer" }} value={form.difficulty}
                onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                <option>Easy</option><option>Medium</option><option>Hard</option>
              </select>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}>
                <option>Pending</option><option>Solved</option>
              </select>
              <input style={{ ...inputStyle, gridColumn: "1 / -1" }} placeholder="Notes (optional)" value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
            </div>
            <button type="submit" disabled={adding}
              style={{ padding: "10px 20px", background: adding ? "var(--surface-2)" : "var(--accent)", color: adding ? "var(--text-muted)" : "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: adding ? "not-allowed" : "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { if (!adding) e.target.style.background = "var(--accent-hover)"; }}
              onMouseLeave={e => { if (!adding) e.target.style.background = "var(--accent)"; }}
            >
              {adding ? "Adding…" : "Add Question"}
            </button>
          </form>
        </section>

        {/* My Questions */}
        <section className="animate-fadeUp-d3" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "16px" }}>📋</span>
              <h2 style={{ fontWeight: "600", fontSize: "16px" }}>My Practice List</h2>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", background: "var(--surface-2)", padding: "2px 8px", borderRadius: "99px" }}>{filtered.length}</span>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              {["All", "Pending", "Solved"].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ padding: "5px 12px", background: filter === f ? "var(--accent-dim)" : "transparent", border: `1px solid ${filter === f ? "var(--accent-border)" : "var(--border)"}`, borderRadius: "6px", color: filter === f ? "var(--accent)" : "var(--text-muted)", fontSize: "12px", fontWeight: "500", cursor: "pointer", transition: "all 0.15s" }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 24px", color: "var(--text-muted)", fontSize: "14px" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>🎯</div>
              {filter === "All" ? "No questions yet — add some above!" : `No ${filter.toLowerCase()} questions`}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {filtered.map((q) => {
                const dc = DIFFICULTY_COLORS[q.difficulty] || DIFFICULTY_COLORS.Easy;
                const sc = STATUS_COLORS[q.status] || STATUS_COLORS.Pending;
                return (
                  <div key={q._id}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 16px", gap: "14px", transition: "border-color 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-light)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: "600", fontSize: "14px", marginBottom: "6px" }}>{q.title}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        {q.topic && <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{q.topic}</span>}
                        <Badge label={q.difficulty} style={{ color: dc.color, background: dc.bg, border: `1px solid ${dc.border}` }} />
                        <Badge label={q.status} style={{ color: sc.color, background: sc.bg }} />
                        {q.notes && <span style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>"{q.notes}"</span>}
                      </div>
                    </div>
                    <button onClick={() => deleteQuestion(q._id)}
                      style={{ padding: "6px 12px", background: "transparent", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--text-muted)", fontSize: "12px", cursor: "pointer", transition: "all 0.15s", flexShrink: 0 }}
                      onMouseEnter={e => { e.target.style.borderColor = "var(--red)"; e.target.style.color = "var(--red)"; e.target.style.background = "var(--red-dim)"; }}
                      onMouseLeave={e => { e.target.style.borderColor = "var(--border)"; e.target.style.color = "var(--text-muted)"; e.target.style.background = "transparent"; }}
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Questions;