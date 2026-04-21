import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await API.post("/auth/register", form);
      nav("/");
    } catch {
      setError("Registration failed. Email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "400px", background: "radial-gradient(ellipse, rgba(34,211,160,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="animate-fadeUp" style={{ width: "100%", maxWidth: "400px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, var(--accent), #a78bfa)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>⚡</div>
            <span style={{ fontSize: "22px", fontWeight: "700", color: "var(--text)", letterSpacing: "-0.5px" }}>PrepTrack</span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Start your interview prep journey</p>
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "32px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "24px", color: "var(--text)" }}>Create account</h2>

          {error && (
            <div style={{ background: "var(--red-dim)", border: "1px solid rgba(248,114,114,0.3)", borderRadius: "8px", padding: "10px 14px", marginBottom: "20px", fontSize: "13px", color: "var(--red)" }}>
              {error}
            </div>
          )}

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { key: "name", label: "Full Name", type: "text", placeholder: "Jane Smith" },
              { key: "email", label: "Email", type: "email", placeholder: "jane@example.com" },
              { key: "password", label: "Password", type: "password", placeholder: "••••••••" },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required
                  style={{ width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", color: "var(--text)", fontSize: "14px", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = "var(--accent)"}
                  onBlur={e => e.target.style.borderColor = "var(--border)"}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: "11px", background: loading ? "var(--surface-2)" : "var(--green)", color: loading ? "var(--text-muted)" : "#0a0a0f", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", transition: "all 0.2s", marginTop: "4px" }}
            >
              {loading ? "Creating account…" : "Create account →"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <Link to="/" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: "500" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;