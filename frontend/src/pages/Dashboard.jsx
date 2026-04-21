import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

function StatCard({ label, value, color, icon, delay }) {
  return (
    <div
      className={`animate-fadeUp-d${delay}`}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.2s, transform 0.2s",
        cursor: "default",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: color, opacity: 0.6 }} />
      <div style={{ fontSize: "28px", marginBottom: "8px" }}>{icon}</div>
      <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>{label}</div>
      <div style={{ fontSize: "42px", fontWeight: "700", color, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{value}</div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({ total: 0, solved: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/questions/stats/all", { headers: { authorization: token } });
      setStats(res.data);
    } catch {
      nav("/");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => { localStorage.removeItem("token"); nav("/"); };

  const pct = stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)", padding: "0 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "30px", height: "30px", background: "linear-gradient(135deg, var(--accent), #a78bfa)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px" }}>⚡</div>
            <span style={{ fontWeight: "700", fontSize: "17px", letterSpacing: "-0.3px" }}>PrepTrack</span>
          </div>
          <nav style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link to="/questions" style={{ padding: "7px 14px", background: "var(--accent-dim)", border: "1px solid var(--accent-border)", borderRadius: "8px", color: "var(--accent)", textDecoration: "none", fontSize: "13px", fontWeight: "500", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(124,106,247,0.2)"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--accent-dim)"}
            >
              Questions
            </Link>
            <button onClick={logout} style={{ padding: "7px 14px", background: "transparent", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text-muted)", cursor: "pointer", fontSize: "13px", fontWeight: "500", transition: "all 0.2s" }}
              onMouseEnter={e => { e.target.style.borderColor = "var(--red)"; e.target.style.color = "var(--red)"; }}
              onMouseLeave={e => { e.target.style.borderColor = "var(--border)"; e.target.style.color = "var(--text-muted)"; }}
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>
        {/* Hero */}
        <div className="animate-fadeUp" style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "700", letterSpacing: "-0.8px", marginBottom: "6px" }}>
            Your Progress
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
            {loading ? "Loading your stats…" : `${pct}% solved — keep pushing!`}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
          <StatCard label="Total" value={stats.total} color="#7c6af7" icon="📋" delay={1} />
          <StatCard label="Solved" value={stats.solved} color="var(--green)" icon="✅" delay={2} />
          <StatCard label="Pending" value={stats.pending} color="var(--yellow)" icon="⏳" delay={3} />
        </div>

        {/* Progress bar */}
        {stats.total > 0 && (
          <div className="animate-fadeUp-d3" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "14px", fontWeight: "600" }}>Completion Rate</span>
              <span style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>{stats.solved}/{stats.total}</span>
            </div>
            <div style={{ height: "8px", background: "var(--surface-2)", borderRadius: "99px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, var(--accent), var(--green))", borderRadius: "99px", transition: "width 1s ease" }} />
            </div>
            <div style={{ marginTop: "8px", fontSize: "12px", color: "var(--text-muted)" }}>{pct}% complete</div>
          </div>
        )}

        {stats.total === 0 && !loading && (
          <div className="animate-fadeUp-d3" style={{ background: "var(--surface)", border: "1px dashed var(--border)", borderRadius: "14px", padding: "48px", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>🚀</div>
            <p style={{ fontWeight: "600", marginBottom: "8px" }}>No questions yet</p>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "20px" }}>Add your first question to start tracking your prep</p>
            <Link to="/questions" style={{ display: "inline-block", padding: "10px 20px", background: "var(--accent)", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
              Add Questions →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;