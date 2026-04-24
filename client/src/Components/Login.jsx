import { KeyRound, Mail, User, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import { auth, provider } from "../utils/firebase";
// import { signInWithPopup } from "firebase/auth";
import api from "../utils/api";

const roles = ["User", "Driver", "Manager", "Admin"];

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "User" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const { data } = await api.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        if (data.role === "ADMIN")              navigate("/admin/dashboard");
        else if (data.role === "FLEET_MANAGER") navigate("/admin/fleet");
        else if (data.role === "DRIVER")        navigate("/driver/dashboard");
        else                                    navigate("/user/dashboard");
      } else {
        let role = formData.role.toUpperCase();
        if (role === "MANAGER") role = "FLEET_MANAGER";
        await api.post("/auth/signup", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role,
        });
        toast.success("Account created! Please sign in.");
        setMode("login");
        setFormData((p) => ({ ...p, password: "" }));
      }
    } catch (err) {
      toast.error(
        mode === "login"
          ? "Invalid credentials."
          : err.response?.data?.message || "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const { data } = await api.post("/auth/google", { idToken });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      if (data.role === "ADMIN")              navigate("/admin/dashboard");
      else if (data.role === "FLEET_MANAGER") navigate("/admin/fleet");
      else if (data.role === "DRIVER")        navigate("/driver/dashboard");
      else                                    navigate("/user/dashboard");
    } catch (err) {
      toast.error("Google sign-in failed.");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: #0A0B0E;
          color: #F5F4F0;
          font-family: 'DM Sans', sans-serif;
        }

        .grid-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 72px 72px;
        }

        .field {
          width: 100%; height: 48px;
          display: flex; align-items: center; gap: 10px; padding: 0 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid #1E2028;
          border-radius: 8px; transition: border-color .2s;
        }
        .field:focus-within { border-color: rgba(129,140,248,.6); }
        .field input, .field select {
          flex: 1; background: none; border: none; outline: none;
          color: #F5F4F0; font-family: 'DM Sans'; font-size: 14px;
        }
        .field input::placeholder { color: #3A3D48; }
        .field select option { background: #111318; color: #F5F4F0; }

        .btn-primary {
          width: 100%; height: 48px;
          background: #6366F1; color: #fff;
          border: none; border-radius: 8px;
          font-family: 'Space Mono'; font-weight: 700;
          font-size: 12px; letter-spacing: .06em; cursor: pointer;
          transition: all .2s; box-shadow: 0 2px 12px rgba(99,102,241,.25);
        }
        .btn-primary:hover:not(:disabled) {
          background: #818CF8; transform: translateY(-1px);
        }
        .btn-primary:disabled { opacity: .45; cursor: not-allowed; }

        .btn-google {
          width: 100%; height: 48px;
          background: rgba(255,255,255,0.03);
          border: 1px solid #1E2028; border-radius: 8px;
          color: #F5F4F0; font-family: 'DM Sans'; font-size: 14px; font-weight: 500;
          cursor: pointer; transition: all .2s;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .btn-google:hover { background: rgba(255,255,255,0.06); border-color: #2A2D38; }

        .divider {
          display: flex; align-items: center; gap: 12px;
          color: #3A3D48; font-size: 11px; letter-spacing: .1em;
          font-family: 'Space Mono';
        }
        .divider::before, .divider::after {
          content: ''; flex: 1; height: 1px; background: #1E2028;
        }

        .tab {
          flex: 1; height: 36px; background: none; border: none;
          font-family: 'Space Mono'; font-size: 11px; letter-spacing: .08em;
          color: #3A3D48; cursor: pointer; border-radius: 6px; transition: all .2s;
        }
        .tab.active { background: rgba(99,102,241,.12); color: #818CF8; }

        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
      `}</style>

      <div className="grid-bg" />

      {/* Subtle ambient — no neon bleed */}
      <div style={{
        position: "fixed", top: "-15%", right: "-5%",
        width: 480, height: 480,
        background: "radial-gradient(circle, rgba(99,102,241,.06) 0%, transparent 70%)",
        zIndex: 0, pointerEvents: "none"
      }} />
      <div style={{
        position: "fixed", bottom: "0%", left: "-8%",
        width: 400, height: 400,
        background: "radial-gradient(circle, rgba(129,140,248,.04) 0%, transparent 70%)",
        zIndex: 0, pointerEvents: "none"
      }} />

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex" }}>

        {/* ── LEFT PANEL — branding only ── */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "40px 56px",
          borderRight: "1px solid #1E2028",
        }}>
          {/* Logo */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <div style={{
              width: 28, height: 28, background: "#6366F1",
              borderRadius: 6, display: "flex", alignItems: "center",
              justifyContent: "center", color: "#fff", fontSize: 13
            }}>◉</div>
            <span style={{ fontFamily: "Space Mono", fontWeight: 700, letterSpacing: "1.5px", fontSize: 15 }}>
              NEURO<span style={{ color: "#818CF8" }}>FLEET</span>
              <span style={{ color: "#2A2D38", fontSize: 10, marginLeft: 2 }}>X</span>
            </span>
          </div>

          {/* Centre — heading only, no description */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "5px 14px", borderRadius: 999,
              border: "1px solid #1E2028", background: "rgba(255,255,255,0.025)",
              marginBottom: 28
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: "50%",
                background: "#818CF8", display: "inline-block", animation: "pulse 2s infinite"
              }} />
              <span style={{ fontFamily: "Space Mono", fontSize: 10, color: "#818CF8", letterSpacing: ".12em" }}>
                LIVE FLEET INTELLIGENCE
              </span>
            </div>

            <h1 style={{
              fontSize: "clamp(28px,3.5vw,46px)", fontWeight: 700,
              lineHeight: 1.1, letterSpacing: "-1.5px", color: "#F5F4F0"
            }}>
              Command your<br />
              <span style={{ color: "#818CF8" }}>fleet from anywhere.</span>
            </h1>
          </div>

          <p style={{ fontFamily: "Space Mono", fontSize: 11, color: "#1E2028", letterSpacing: ".06em" }}>
            © 2026 NEUROFLEETX
          </p>
        </div>

        {/* ── RIGHT PANEL — form, fully centered ── */}
        <div style={{
          width: "100%",
          maxWidth: 480,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "48px 40px",
        }}>
          <div style={{ width: "100%", maxWidth: 380 }}>

            {/* Tab switcher */}
            <div style={{
              display: "flex", gap: 4, padding: 4,
              background: "rgba(255,255,255,.025)",
              border: "1px solid #1E2028",
              borderRadius: 10, marginBottom: 36
            }}>
              <button className={`tab ${mode === "login"  ? "active" : ""}`} onClick={() => setMode("login")}>SIGN IN</button>
              <button className={`tab ${mode === "signup" ? "active" : ""}`} onClick={() => setMode("signup")}>CREATE ACCOUNT</button>
            </div>

            {/* Heading */}
            <h2 style={{
              fontFamily: "Space Mono", fontSize: 20, fontWeight: 700,
              marginBottom: 28, color: "#F5F4F0"
            }}>
              {mode === "login" ? "Welcome back" : "Get started"}
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>

              {mode === "signup" && (
                <div className="field" style={{ position: "relative" }}>
                  <ChevronDown size={14} color="#3A3D48" style={{ flexShrink: 0 }} />
                  <select name="role" value={formData.role} onChange={handleChange}
                    style={{ appearance: "none", cursor: "pointer" }}>
                    {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <ChevronDown size={13} color="#1E2028" style={{ flexShrink: 0 }} />
                </div>
              )}

              {mode === "signup" && (
                <div className="field">
                  <User size={14} color="#3A3D48" style={{ flexShrink: 0 }} />
                  <input type="text" name="name" placeholder="Full name"
                    value={formData.name} onChange={handleChange} required />
                </div>
              )}

              <div className="field">
                <Mail size={14} color="#3A3D48" style={{ flexShrink: 0 }} />
                <input type="email" name="email" placeholder="Email address"
                  value={formData.email} onChange={handleChange} required />
              </div>

              <div className="field">
                <KeyRound size={14} color="#3A3D48" style={{ flexShrink: 0 }} />
                <input type="password" name="password" placeholder="Password"
                  value={formData.password} onChange={handleChange} required />
              </div>

              {mode === "login" && (
                <div style={{ textAlign: "right" }}>
                  <button type="button" style={{
                    background: "none", border: "none", color: "#818CF8",
                    fontSize: 12, cursor: "pointer", fontFamily: "DM Sans"
                  }}>
                    Forgot password?
                  </button>
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 4 }}>
                {loading ? "PLEASE WAIT..." : mode === "login" ? "SIGN IN →" : "CREATE ACCOUNT →"}
              </button>

            </form>

            {/* Divider */}
            <div className="divider" style={{ margin: "22px 0" }}>OR CONTINUE WITH</div>

            {/* Google */}
<button className="btn-google" onClick={handleGoogle}>
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
  Continue with Google
</button>

            {/* Switch mode */}
            <p style={{ textAlign: "center", marginTop: 28, fontSize: 13, color: "#3A3D48" }}>
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                style={{
                  background: "none", border: "none", color: "#818CF8",
                  cursor: "pointer", fontSize: 13, fontFamily: "DM Sans"
                }}
              >
                {mode === "login" ? "Create one" : "Sign in"}
              </button>
            </p>

          </div>
        </div>

      </div>
    </>
  );
}