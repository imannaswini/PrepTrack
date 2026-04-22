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
  const [resume, setResume] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const nav = useNavigate();

  useEffect(() => { 
    fetchStats();
    fetchResume();
    fetchInterviewQuestions();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/questions/stats/all", { headers: { Authorization: token } });
      setStats(res.data);
    } catch {
      nav("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchResume = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/resume", { headers: { Authorization: token } });
      setResume(res.data);
    } catch (err) {
      console.log("No resume found");
    }
  };

  const fetchInterviewQuestions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/interview", { headers: { Authorization: token } });
      setQuestions(res.data);
    } catch (err) {
      console.log("No questions found");
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await API.post("/resume/upload", formData, {
        headers: { Authorization: token }
      });
      setResume(res.data);
      alert("Resume uploaded and skills extracted!");
    } catch (err) {
      alert(err.response?.data?.msg || "Error uploading resume");
    } finally {
      setUploading(false);
    }
  };

  const generateQuestions = async () => {
    setGenerating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await API.post("/interview/generate", {}, { headers: { Authorization: token } });
      setQuestions(res.data);
      alert("Questions generated successfully!");
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to generate questions");
    } finally {
      setGenerating(false);
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

        {/* Resume Section */}
        <div className="animate-fadeUp-d1" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", padding: "24px", marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
             <div>
               <h3 style={{ fontSize: "18px", fontWeight: "700" }}>Resume Analysis</h3>
               <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Upload your resume to extract skills and generate questions</p>
             </div>
             <label style={{ padding: "8px 16px", background: "var(--accent)", color: "white", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--accent-hover)"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--accent)"}
             >
               {uploading ? "Processing..." : "Upload PDF"}
               <input type="file" accept=".pdf" onChange={handleUpload} style={{ display: "none" }} disabled={uploading} />
             </label>
          </div>

          {resume && resume.skills.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
              {resume.skills.map(skill => (
                <span key={skill} style={{ padding: "4px 12px", background: "var(--accent-dim)", border: "1px solid var(--accent-border)", color: "var(--accent)", borderRadius: "6px", fontSize: "12px", fontWeight: "600" }}>
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            !uploading && <p style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center", padding: "20px", border: "1px dashed var(--border)", borderRadius: "12px", marginBottom: "24px" }}>No skills detected yet. Upload your resume to begin.</p>
          )}

          {resume && (
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "24px", marginTop: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h4 style={{ fontSize: "16px", fontWeight: "600" }}>Generated Questions</h4>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button 
                    onClick={generateQuestions}
                    disabled={generating}
                    style={{ padding: "8px 16px", background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "500", transition: "all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                  >
                    {generating ? "Generating..." : "Generate Questions"}
                  </button>
                  {questions.length > 0 && (
                    <button 
                      onClick={() => nav("/mock-interview")}
                      style={{ padding: "8px 16px", background: "linear-gradient(135deg, var(--accent), #a78bfa)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600", transition: "all 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    >
                      Start Mock Interview →
                    </button>
                  )}
                </div>
              </div>

              {questions.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
                  {questions.map((q, idx) => (
                    <div key={idx} style={{ padding: "16px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "10px" }}>
                      <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                        <span style={{ background: "var(--accent-dim)", color: "var(--accent)", padding: "2px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", marginTop: "2px" }}>{q.skill}</span>
                        <p style={{ fontSize: "14px", fontWeight: "500", color: "var(--text)" }}>{q.question}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center", padding: "20px" }}>Click generate to create questions based on your skills.</p>
              )}
            </div>
          )}
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