import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

function MockInterview() {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per question
  const nav = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (questions.length > 0 && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [questions, timeLeft]);

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        nav("/");
        return;
      }
      const res = await API.get("/interview", {
        headers: { Authorization: token },
      });
      setQuestions(res.data);
    } catch (err) {
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setTimeLeft(120); // Reset timer for next question
    } else {
      alert("Interview Completed! Your answers have been recorded locally for now.");
      nav("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      setTimeLeft(120);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (loading) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "var(--bg)", color: "var(--text)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", border: "3px solid var(--accent-dim)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ fontSize: "14px", fontWeight: "500", color: "var(--text-muted)" }}>Loading interview session...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "var(--bg)", color: "var(--text)", padding: "24px" }}>
        <div style={{ maxWidth: "400px", textAlign: "center", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "40px" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>🔍</div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "12px" }}>No Questions Found</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "24px", lineHeight: "1.5" }}>
            We couldn't find any generated questions for you. Please upload your resume and generate questions from the dashboard first.
          </p>
          <Link to="/dashboard" style={{ display: "block", padding: "12px", background: "var(--accent)", color: "white", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "14px" }}>
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)", padding: "0 24px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "28px", height: "28px", background: "linear-gradient(135deg, var(--accent), #a78bfa)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>⚡</div>
            <span style={{ fontWeight: "700", fontSize: "16px" }}>PrepTrack <span style={{ fontWeight: "400", color: "var(--text-muted)", marginLeft: "8px", fontSize: "14px" }}>/ Mock Interview</span></span>
          </div>
          <button onClick={() => nav("/dashboard")} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "6px 12px", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}>Exit Session</button>
        </div>
      </header>

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px" }}>
        {/* Progress Bar */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600", marginBottom: "8px", color: "var(--text-muted)" }}>
            <span>Question {currentIdx + 1} of {questions.length}</span>
            <span style={{ color: timeLeft < 30 ? "var(--red)" : "var(--text-muted)" }}>Time Left: {formatTime(timeLeft)}</span>
          </div>
          <div style={{ height: "6px", background: "var(--surface-2)", borderRadius: "10px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "var(--accent)", transition: "width 0.3s ease" }} />
          </div>
        </div>

        {/* Question Card */}
        <div className="animate-fadeUp" key={currentIdx} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "32px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
          <div style={{ display: "inline-block", padding: "4px 12px", background: "var(--accent-dim)", border: "1px solid var(--accent-border)", color: "var(--accent)", borderRadius: "6px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", marginBottom: "16px", letterSpacing: "0.5px" }}>
            {q.skill}
          </div>
          <h2 style={{ fontSize: "22px", fontWeight: "600", lineHeight: "1.4", marginBottom: "24px" }}>
            {q.question}
          </h2>

          <div style={{ position: "relative" }}>
            <textarea
              placeholder="Type your answer here..."
              value={answers[currentIdx] || ""}
              onChange={(e) => setAnswers({ ...answers, [currentIdx]: e.target.value })}
              style={{
                width: "100%",
                minHeight: "180px",
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "16px",
                color: "var(--text)",
                fontSize: "15px",
                lineHeight: "1.6",
                resize: "vertical",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
              onBlur={(e) => e.target.style.borderColor = "var(--border)"}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px" }}>
            <button
              onClick={handleBack}
              disabled={currentIdx === 0}
              style={{
                padding: "12px 24px",
                background: "transparent",
                border: "1px solid var(--border)",
                color: currentIdx === 0 ? "var(--text-muted)" : "var(--text)",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: currentIdx === 0 ? "default" : "pointer",
                transition: "all 0.2s"
              }}
            >
              ← Previous
            </button>
            <button
              onClick={handleNext}
              style={{
                padding: "12px 32px",
                background: "var(--accent)",
                border: "none",
                color: "white",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.background = "var(--accent-hover)"}
              onMouseLeave={(e) => e.target.style.background = "var(--accent)"}
            >
              {currentIdx === questions.length - 1 ? "Finish Interview" : "Next Question →"}
            </button>
          </div>
        </div>

        {/* Tip */}
        <div style={{ marginTop: "24px", padding: "16px", background: "var(--accent-dim)", borderRadius: "10px", display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ fontSize: "18px" }}>💡</span>
          <p style={{ fontSize: "13px", color: "var(--accent)", fontWeight: "500" }}>
            Tip: Be concise but thorough. Mention specific keywords like <b>{q.expectedKeywords?.slice(0, 2).join(", ")}</b> if relevant.
          </p>
        </div>
      </main>
    </div>
  );
}

export default MockInterview;
