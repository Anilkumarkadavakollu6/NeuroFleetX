import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const features = [
  { icon: "◎", t: "Real-Time Telemetry",     d: "Live vehicle position, battery, and engine data streamed directly to your dashboard with zero-latency state sync." },
  { icon: "⬡", t: "AI Route Optimisation",   d: "Our AI recommends optimal fleet assignments based on battery health, CO₂ impact, and zone demand in real time." },
  { icon: "⊕", t: "Mission Control",          d: "Drivers receive incoming ride popups and route progress tracking. One-click accept locks the interface instantly." },
  { icon: "◈", t: "Smart EV Discovery",       d: "Users get AI-curated vehicle recommendations ranked by engine health, charge level, and estimated arrival time." },
  { icon: "⬢", t: "Secure JWT Auth",          d: "End-to-end protected routes with stateless JWT tokens. Every session is isolated and cryptographically verified." },
  { icon: "◉", t: "Sustainability KPIs",      d: "Track CO₂ saved, EV fleet share, and renewable charge ratios — all updated live across every zone." },
];

export default function Hero() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [isDark, setIsDark] = useState(true);

  const C = {
    bg:          isDark ? "#0A0B0E"                        : "#F8F8F6",
    surface:     isDark ? "#111318"                        : "#FFFFFF",
    text:        isDark ? "#F5F4F0"                        : "#111318",
    muted:       isDark ? "#7A7D8A"                        : "#6B6E7A",
    border:      isDark ? "#1E2028"                        : "#E4E3DE",
    cardBg:      isDark ? "rgba(255,255,255,0.025)"        : "rgba(0,0,0,0.018)",
    cardBorder:  isDark ? "#1E2028"                        : "#E4E3DE",
    btnGhost:    isDark ? "rgba(255,255,255,0.04)"         : "rgba(0,0,0,0.04)",
    gridRgb:     isDark ? "255,255,255"                    : "0,0,0",
    gridOp:      isDark ? "0.018"                          : "0.05",
    accent:      "#6366F1",
    accentLight: "#818CF8",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: ${C.bg}; color: ${C.text};
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden; transition: background .3s;
        }

        .grid-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(${C.gridRgb},${C.gridOp}) 1px, transparent 1px),
            linear-gradient(90deg,rgba(${C.gridRgb},${C.gridOp}) 1px, transparent 1px);
          background-size: 72px 72px;
        }

        .nav-link {
          background: none; border: none; cursor: pointer;
          font-family: 'Space Mono'; font-size: 12px; letter-spacing: .07em;
          color: ${C.muted}; transition: color .2s;
        }
        .nav-link:hover { color: ${C.text}; }

        .btn-primary {
          background: ${C.accent}; color: #fff;
          padding: 11px 26px; border-radius: 8px; border: none;
          font-family: 'Space Mono'; font-weight: 700; font-size: 12px;
          letter-spacing: .05em; cursor: pointer;
          box-shadow: 0 2px 12px rgba(99,102,241,.25);
          transition: all .2s; display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-primary:hover { background: ${C.accentLight}; transform: translateY(-1px); }

        .btn-ghost {
          background: ${C.btnGhost}; color: ${C.text};
          padding: 11px 26px; border-radius: 8px;
          border: 1px solid ${C.border};
          font-family: 'Space Mono'; font-size: 12px;
          letter-spacing: .05em; cursor: pointer; transition: all .2s;
        }
        .btn-ghost:hover { border-color: ${C.accent}; color: ${C.accentLight}; }

        .btn-outline {
          background: transparent; color: ${C.text};
          padding: 11px 26px; border-radius: 8px;
          border: 1px solid ${C.border};
          font-family: 'Space Mono'; font-size: 12px;
          letter-spacing: .05em; cursor: pointer; transition: all .2s;
        }
        .btn-outline:hover { border-color: ${C.accentLight}; color: ${C.accentLight}; }

        .glass-card {
          background: ${C.cardBg};
          border: 1px solid ${C.cardBorder};
          border-radius: 16px;
          padding: 32px;
          transition: border-color .25s, transform .25s;
        }
        .glass-card:hover { transform: translateY(-3px); }

        .theme-btn {
          background: ${C.btnGhost}; border: 1px solid ${C.border};
          color: ${C.text}; width: 34px; height: 34px; border-radius: 50%;
          cursor: pointer; font-size: 13px; display: flex; align-items: center;
          justify-content: center; transition: .2s;
        }

        footer a { color: ${C.muted}; text-decoration: none; font-size: 13px; transition: color .2s; }
        footer a:hover { color: ${C.text}; }

        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
      `}</style>

      <div className="grid-bg" />

      <div style={{ position:"relative", zIndex:1 }}>

        {/* NAV */}
        <nav style={{ maxWidth:1200, margin:"0 auto", padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:28, height:28, background:C.accent, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:13 }}>◉</div>
            <span style={{ fontFamily:"Space Mono", fontWeight:700, letterSpacing:"1.5px", fontSize:15, color:C.text }}>
              NEURO<span style={{ color:C.accentLight }}>FLEET</span><span style={{ color:C.muted, fontSize:10, marginLeft:2 }}>X</span>
            </span>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:20 }}>
            <button className="nav-link">FEATURES</button>
            <button className="nav-link">SOLUTIONS</button>
            <button className="nav-link">CONTACT</button>
            <button className="theme-btn" onClick={() => setIsDark(!isDark)}>{isDark ? "☀️" : "🌙"}</button>
            <button className="btn-ghost" onClick={() => navigate("/login")}>SIGN IN</button>
            <button className="btn-primary" onClick={() => navigate("/login")}>GET STARTED →</button>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ maxWidth:1100, margin:"0 auto", padding:"120px 24px 80px", textAlign:"center" }}>
          <motion.div initial="hidden" animate="visible" variants={stagger}>

            <motion.div variants={itemVariants} style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:32, padding:"5px 14px", borderRadius:999, border:`1px solid ${C.border}`, background:C.cardBg }}>
              <span style={{ width:5, height:5, borderRadius:"50%", background:C.accentLight, display:"inline-block", animation:"pulse 2s infinite" }} />
              <span style={{ fontFamily:"Space Mono", fontSize:10, color:C.accentLight, letterSpacing:".12em" }}>LIVE FLEET INTELLIGENCE</span>
            </motion.div>

            <motion.h1 variants={itemVariants} style={{ fontSize:"clamp(36px,7vw,82px)", fontWeight:700, lineHeight:.95, letterSpacing:"-2.5px", marginBottom:28, color:C.text }}>
              Autonomous Mobility<br />
              <span style={{ color:C.accentLight }}>Command Centre.</span>
            </motion.h1>

            <motion.p variants={itemVariants} style={{ maxWidth:540, margin:"0 auto 48px", color:C.muted, fontSize:18, lineHeight:1.65 }}>
              AI-powered platform to orchestrate urban fleets, optimise logistics routes,
              and build smarter city ecosystems — in real time.
            </motion.p>

            <motion.div variants={itemVariants} style={{ display:"flex", justifyContent:"center", gap:14, flexWrap:"wrap" }}>
              <button className="btn-primary" onClick={() => navigate("/login")}>LAUNCH DASHBOARD →</button>
              <button className="btn-outline" onClick={() => document.getElementById('features').scrollIntoView({ behavior:'smooth' })}>EXPLORE FEATURES</button>
            </motion.div>

          </motion.div>
        </section>

        {/* FEATURES */}
        <section id="features" style={{ maxWidth:1200, margin:"100px auto", padding:"0 24px" }}>
          <div style={{ marginBottom:56, borderBottom:`1px solid ${C.border}`, paddingBottom:32 }}>
            <p style={{ fontFamily:"Space Mono", color:C.accentLight, fontSize:11, letterSpacing:"4px", marginBottom:14 }}>SYSTEM FEATURES</p>
            <h3 style={{ fontSize:36, fontWeight:700, lineHeight:1.1, color:C.text }}>Everything you need to<br />run a smarter fleet.</h3>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:16 }}>
            {features.map((f, i) => (
              <div
                key={i}
                className="glass-card"
                style={{ borderColor: hovered === i ? C.accent : C.cardBorder, cursor:"default" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div style={{ fontSize:22, marginBottom:18, color: hovered === i ? C.accentLight : C.muted, transition:"color .25s", fontFamily:"Space Mono" }}>{f.icon}</div>
                <h4 style={{ fontSize:17, fontWeight:700, marginBottom:10, color: hovered === i ? C.text : C.text, letterSpacing:"-.3px" }}>{f.t}</h4>
                <p style={{ color:C.muted, fontSize:14, lineHeight:1.7 }}>{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA BANNER */}
        <section style={{ maxWidth:1200, margin:"120px auto", padding:"0 24px" }}>
          <div style={{ background:C.cardBg, border:`1px solid ${C.border}`, borderRadius:20, padding:"72px 40px", textAlign:"center" }}>
            <p style={{ fontFamily:"Space Mono", fontSize:11, color:C.muted, letterSpacing:"4px", marginBottom:16 }}>JOIN THE PLATFORM</p>
            <h2 style={{ fontSize:42, fontWeight:700, marginBottom:18, color:C.text }}>Ready to take control?</h2>
            <p style={{ color:C.muted, maxWidth:440, margin:"0 auto 36px", fontSize:15, lineHeight:1.65 }}>
              Join city operators and logistics teams using NeuroFleetX to run leaner, greener, smarter fleets.
            </p>
            <button className="btn-primary" onClick={() => navigate("/login")}>CREATE FREE ACCOUNT</button>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop:`1px solid ${C.border}`, padding:"56px 24px 32px" }}>
          <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:40 }}>
            <div style={{ gridColumn:"span 2" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
                <div style={{ width:20, height:20, background:C.accent, borderRadius:5 }} />
                <span style={{ fontFamily:"Space Mono", fontWeight:700, letterSpacing:"1px", fontSize:13, color:C.text }}>NEUROFLEETX</span>
              </div>
              <p style={{ color:C.muted, maxWidth:260, fontSize:13, lineHeight:1.7 }}>
                AI-driven mobility optimisation for urban transport, logistics, and smart city ecosystems.
              </p>
            </div>
            <div>
              <h5 style={{ fontFamily:"Space Mono", fontSize:10, letterSpacing:"2px", color:C.muted, marginBottom:18 }}>PLATFORM</h5>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                <a href="#">Dashboard</a>
                <a href="#">Mission Control</a>
                <a href="#">Analytics</a>
              </div>
            </div>
            <div>
              <h5 style={{ fontFamily:"Space Mono", fontSize:10, letterSpacing:"2px", color:C.muted, marginBottom:18 }}>LEGAL</h5>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Use</a>
              </div>
            </div>
          </div>
          <div style={{ maxWidth:1200, margin:"40px auto 0", paddingTop:20, borderTop:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ color:C.muted, fontSize:12, fontFamily:"Space Mono" }}>© 2026 NeuroFleetX. All rights reserved.</span>
            <span style={{ color:C.muted, fontSize:11, fontFamily:"Space Mono" }}>v1.0.0</span>
          </div>
        </footer>
      </div>
    </>
  );
}