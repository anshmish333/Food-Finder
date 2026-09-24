import { useState, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";

/* ─── Global Styles ────────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { min-height: 100%; font-family: 'DM Sans', sans-serif; }

    :root {
      --orange: #F4631E;
      --orange-light: #FF8C42;
      --orange-pale: #FFF0E6;
      --cream: #FDFAF5;
      --brown: #7C4A1E;
      --brown-light: #A0663A;
      --text-dark: #1A0F05;
      --text-mid: #6B3D1A;
      --text-soft: #B07D5A;
      --border: rgba(180,100,40,0.15);
      --shadow-warm: rgba(244,99,30,0.18);
    }

    /* Grain texture */
    .grain::after {
      content: '';
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 100;
      opacity: 0.025;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    }

    /* Input base */
    .ff-field {
      width: 100%;
      padding: 13px 18px 13px 46px;
      border-radius: 14px;
      border: 1.5px solid var(--border);
      background: rgba(255,255,255,0.7);
      color: var(--text-dark);
      font-size: 14px;
      font-family: 'DM Sans', sans-serif;
      outline: none;
      transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
      backdrop-filter: blur(8px);
    }
    .ff-field::placeholder { color: var(--text-soft); opacity: 0.7; }
    .ff-field:focus {
      border-color: var(--orange);
      background: rgba(255,255,255,0.95);
      box-shadow: 0 0 0 4px rgba(244,99,30,0.12), 0 4px 20px rgba(244,99,30,0.1);
    }
    .ff-field.has-error {
      border-color: #E8503A;
      box-shadow: 0 0 0 4px rgba(232,80,58,0.1);
    }

    /* Range input */
    input[type=range].ff-range {
      -webkit-appearance: none;
      width: 100%; height: 4px; border-radius: 99px;
      background: linear-gradient(to right, var(--orange) 0%, var(--orange) var(--v, 0%), rgba(180,100,40,0.2) var(--v, 0%));
      outline: none; cursor: pointer;
    }
    input[type=range].ff-range::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 20px; height: 20px; border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, var(--orange-light), var(--orange));
      border: 3px solid white;
      box-shadow: 0 2px 12px var(--shadow-warm);
      cursor: pointer;
    }

    /* Checkbox */
    .ff-check {
      width: 18px; height: 18px; border-radius: 6px;
      border: 1.5px solid var(--border);
      background: rgba(255,255,255,0.8);
      appearance: none; cursor: pointer;
      transition: all 0.2s; position: relative; flex-shrink: 0;
    }
    .ff-check:checked {
      background: linear-gradient(135deg, var(--orange), var(--orange-light));
      border-color: var(--orange);
    }
    .ff-check:checked::after {
      content: '✓';
      position: absolute; inset: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; color: white; font-weight: 700;
    }

    /* Password strength bar */
    .strength-track { height: 3px; border-radius: 99px; background: rgba(180,100,40,0.15); overflow: hidden; }
    .strength-fill { height: 100%; border-radius: 99px; transition: width 0.4s ease, background 0.4s ease; }

    /* Floating animations */
    @keyframes bob-a { 0%,100%{transform:translateY(0) rotate(-8deg) rotateY(15deg)} 50%{transform:translateY(-20px) rotate(-5deg) rotateY(18deg)} }
    @keyframes bob-b { 0%,100%{transform:translateY(0) rotate(6deg) rotateY(-12deg)} 50%{transform:translateY(-16px) rotate(9deg) rotateY(-15deg)} }
    @keyframes bob-c { 0%,100%{transform:translateY(0) rotate(-4deg) rotateY(10deg)} 50%{transform:translateY(-24px) rotate(-7deg) rotateY(13deg)} }
    @keyframes bob-d { 0%,100%{transform:translateY(0) rotate(10deg) rotateY(-18deg)} 50%{transform:translateY(-14px) rotate(7deg) rotateY(-15deg)} }
    @keyframes bob-e { 0%,100%{transform:translateY(0) rotate(-12deg) rotateY(8deg)} 50%{transform:translateY(-18px) rotate(-9deg) rotateY(11deg)} }
    @keyframes spin-ring { from{transform:rotateX(72deg) rotate(0deg)} to{transform:rotateX(72deg) rotate(360deg)} }
    @keyframes spin-ring-rev { from{transform:rotateX(72deg) rotate(0deg)} to{transform:rotateX(72deg) rotate(-360deg)} }
    @keyframes pulse-halo { 0%{transform:scale(1);opacity:0.5} 100%{transform:scale(1.6);opacity:0} }
    @keyframes shimmer { 0%{left:-100%} 100%{left:200%} }
    @keyframes fade-up { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
    @keyframes counter-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

    .bob-a { animation: bob-a 5.2s ease-in-out infinite; }
    .bob-b { animation: bob-b 6.5s ease-in-out infinite 0.7s; }
    .bob-c { animation: bob-c 4.8s ease-in-out infinite 1.4s; }
    .bob-d { animation: bob-d 7.1s ease-in-out infinite 0.3s; }
    .bob-e { animation: bob-e 5.8s ease-in-out infinite 2.1s; }

    /* Primary button */
    .btn-create {
      width: 100%;
      padding: 15px 0;
      border-radius: 16px;
      border: none;
      background: linear-gradient(135deg, #F4631E 0%, #FF8C42 60%, #e8530e 100%);
      color: white;
      font-size: 15px;
      font-weight: 700;
      font-family: 'DM Sans', sans-serif;
      letter-spacing: 0.02em;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      box-shadow: 0 8px 28px rgba(244,99,30,0.4), inset 0 1px 0 rgba(255,255,255,0.25);
      transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
    }
    .btn-create:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 40px rgba(244,99,30,0.48), inset 0 1px 0 rgba(255,255,255,0.25);
    }
    .btn-create:active { transform: scale(0.98); }
    .btn-create::after {
      content: '';
      position: absolute;
      top: -50%; left: -100%;
      width: 50%; height: 200%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
      transform: skewX(-20deg);
      animation: shimmer 3.5s ease-in-out infinite 1.2s;
    }

    /* Google button */
    .btn-google {
      width: 100%; padding: 13px 0;
      border-radius: 14px;
      border: 1.5px solid rgba(180,100,40,0.18);
      background: rgba(255,255,255,0.75);
      color: var(--text-dark);
      font-size: 14px; font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 10px;
      backdrop-filter: blur(8px);
      transition: all 0.2s;
      box-shadow: 0 2px 10px rgba(0,0,0,0.06);
    }
    .btn-google:hover {
      background: rgba(255,255,255,0.95);
      border-color: var(--orange);
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(244,99,30,0.12);
    }
    .btn-google:active { transform: scale(0.98); }

    /* Step indicator dots */
    .step-dot {
      width: 7px; height: 7px; border-radius: 50%;
      transition: all 0.3s ease;
    }
    .step-dot.active {
      width: 22px; border-radius: 4px;
      background: var(--orange) !important;
    }

    /* Field icon wrapper */
    .field-icon {
      position: absolute;
      left: 14px; top: 50%;
      transform: translateY(-50%);
      font-size: 15px;
      pointer-events: none;
      transition: opacity 0.2s;
    }

    /* Eye button */
    .eye-btn {
      position: absolute; right: 14px; top: 50%;
      transform: translateY(-50%);
      background: none; border: none; cursor: pointer;
      font-size: 15px; color: var(--text-soft);
      padding: 4px; line-height: 1; transition: color 0.2s;
    }
    .eye-btn:hover { color: var(--orange); }

    /* Error msg */
    .err-msg {
      font-size: 11px; color: #C0392B; margin-top: 5px;
      font-family: 'DM Sans', sans-serif; font-weight: 500;
      animation: fade-up 0.3s ease;
      display: flex; align-items: center; gap: 4px;
    }
  `}</style>
);

/* ─── Data ──────────────────────────────────────────────────────────────────── */
const FOOD_CARDS = [
  { emoji: "🍛", name: "Biryani Bros", tag: "⚡ Popular", price: "₹120", rating: "4.8", accent: "#F4631E", pos: { top: "8%", left: "4%" }, anim: "bob-a" },
  { emoji: "☕", name: "Green Bowl Café", tag: "✨ Trending", price: "₹90", rating: "4.9", accent: "#20BF6B", pos: { top: "6%", right: "2%" }, anim: "bob-b" },
  { emoji: "🥙", name: "Chaat Corner", tag: "💰 Value", price: "₹45", rating: "4.6", accent: "#F7B731", pos: { bottom: "18%", left: "0%" }, anim: "bob-c" },
  { emoji: "🍜", name: "Noodle Nook", tag: "🎯 Gem", price: "₹110", rating: "4.7", accent: "#0FB9B1", pos: { bottom: "16%", right: "0%" }, anim: "bob-d" },
  { emoji: "🍕", name: "Slice Society", tag: "🔥 Hot", price: "₹150", rating: "4.5", accent: "#A55EEA", pos: { top: "42%", left: "2%" }, anim: "bob-e" },
];

const CITIES = [
  "Lucknow", "Mumbai", "Delhi", "Bangalore", "Hyderabad",
  "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Chandigarh", "Kochi",
];

const STEPS = ["Account", "Location", "Preferences"];

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function getStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const map = [
    { label: "Too short", color: "#E8503A" },
    { label: "Weak", color: "#E8503A" },
    { label: "Fair", color: "#F7B731" },
    { label: "Good", color: "#20BF6B" },
    { label: "Strong 💪", color: "#20BF6B" },
  ];
  return { score: s, ...map[s] };
}

/* ─── Mini Food Card for Left Panel ──────────────────────────────────────── */
function FloatCard({ emoji, name, tag, price, rating, accent, pos, anim }) {
  return (
    <div
      className={anim}
      style={{
        position: "absolute",
        width: 188,
        borderRadius: 18,
        background: "rgba(255,252,247,0.88)",
        border: `1px solid ${accent}28`,
        boxShadow: `0 20px 48px rgba(0,0,0,0.12), 0 2px 0 rgba(255,255,255,0.9) inset, 0 0 32px ${accent}14`,
        backdropFilter: "blur(16px)",
        overflow: "hidden",
        userSelect: "none",
        transformStyle: "preserve-3d",
        ...pos,
      }}
    >
      <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: `${accent}16`,
            border: `1px solid ${accent}28`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20,
          }}>{emoji}</div>
          <div style={{
            fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 99,
            background: `${accent}18`, color: accent,
            border: `1px solid ${accent}28`,
            fontFamily: "'DM Sans', sans-serif",
            whiteSpace: "nowrap",
          }}>{tag}</div>
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 12, fontWeight: 600, color: "#1A0F05", marginBottom: 2 }}>{name}</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "#B07D5A", marginBottom: 10 }}>Local favourite · 0.4 km</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: accent }}>{price}</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, color: "#7C4A1E" }}>⭐ {rating}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Left Panel ──────────────────────────────────────────────────────────── */
function LeftPanel() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-300, 300], [7, -7]), { stiffness: 55, damping: 18 });
  const ry = useSpring(useTransform(mx, [-300, 300], [-7, 7]), { stiffness: 55, damping: 18 });

  return (
    <div
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left - r.width / 2);
        my.set(e.clientY - r.top - r.height / 2);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      style={{
        flex: 1, position: "relative", display: "flex",
        flexDirection: "column", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", overflow: "hidden", perspective: 1100,
      }}
    >
      {/* Background mesh */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 110% 90% at 40% 50%, rgba(244,99,30,0.12) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", top: "20%", right: "10%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(247,183,49,0.12), transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "15%", left: "5%", width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(32,191,107,0.09), transparent 70%)", filter: "blur(35px)" }} />
        {/* Dot grid */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04 }}>
          <defs><pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="#7C4A1E"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#dots)"/>
        </svg>
      </div>

      {/* Brand */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.25, duration: 0.6 }}
        style={{ position: "absolute", top: 36, left: 40, display: "flex", alignItems: "center", gap: 10, zIndex: 20 }}
      >
        <div style={{
          width: 38, height: 38, borderRadius: 12,
          background: "linear-gradient(135deg, #F4631E, #FF8C42)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, boxShadow: "0 4px 18px rgba(244,99,30,0.4)",
        }}>🍴</div>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#1A0F05" }}>
          Food<span style={{ color: "#F4631E" }}>Finder</span>
        </span>
      </motion.div>

      {/* 3D scene */}
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", position: "relative", width: 420, height: 460, zIndex: 10 }}
      >
        {/* Outer ring */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%) rotateX(72deg)",
          width: 380, height: 380, borderRadius: "50%",
          border: "1px solid rgba(244,99,30,0.18)",
          animation: "spin-ring 35s linear infinite",
          pointerEvents: "none",
        }}/>
        {/* Inner ring */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%) rotateX(72deg)",
          width: 260, height: 260, borderRadius: "50%",
          border: "1px dashed rgba(247,183,49,0.2)",
          animation: "spin-ring-rev 22s linear infinite",
          pointerEvents: "none",
        }}/>
        {/* Central dish */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 120, height: 120, borderRadius: "50%",
          background: "radial-gradient(circle at 38% 35%, #fff8f2, #fef0e2)",
          border: "1.5px solid rgba(244,99,30,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 52,
          boxShadow: "0 20px 56px rgba(244,99,30,0.2), 0 4px 16px rgba(0,0,0,0.08), inset 0 2px 0 rgba(255,255,255,0.9)",
          zIndex: 5,
        }}>
          🍽️
          <div style={{ position: "absolute", inset: -14, borderRadius: "50%", border: "1.5px solid rgba(244,99,30,0.25)", animation: "pulse-halo 2.8s ease-out infinite" }} />
          <div style={{ position: "absolute", inset: -14, borderRadius: "50%", border: "1.5px solid rgba(244,99,30,0.15)", animation: "pulse-halo 2.8s ease-out infinite 1s" }} />
        </div>

        {/* Floating food cards */}
        {FOOD_CARDS.map((c) => (
          <FloatCard key={c.name} {...c} />
        ))}
      </motion.div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.7 }}
        style={{ position: "absolute", bottom: 44, left: 0, right: 0, textAlign: "center", padding: "0 44px", zIndex: 20 }}
      >
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(18px, 2.2vw, 24px)",
          fontWeight: 700,
          color: "#1A0F05",
          lineHeight: 1.3,
          marginBottom: 10,
        }}>
          Join FoodFinder and Discover
          <br />
          <span style={{ color: "#F4631E" }}>the Best Local Food</span>
        </h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#B07D5A", lineHeight: 1.65 }}>
          1,200+ local eateries · Live crowd data · Budget-smart picks
        </p>
        {/* Social proof row */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginTop: 18 }}>
          {[
            { icon: "⭐", val: "4.8", sub: "App rating" },
            { icon: "🍽️", val: "1.2K+", sub: "Restaurants" },
            { icon: "👥", val: "85K+", sub: "Food lovers" },
          ].map(s => (
            <div key={s.sub} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#1A0F05" }}>{s.icon} {s.val}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "#B07D5A", marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Form Field ──────────────────────────────────────────────────────────── */
function Field({ label, icon, type = "text", placeholder, value, onChange, onFocus, onBlur, focused, error, children }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7C4A1E", marginBottom: 7, fontFamily: "'DM Sans', sans-serif" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <span className="field-icon" style={{ opacity: focused ? 0.9 : 0.5 }}>{icon}</span>
        {children || (
          <input
            className={`ff-field${error ? " has-error" : ""}`}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.div className="err-msg" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            ⚠️ {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Step 1 – Account Info ──────────────────────────────────────────────── */
function Step1({ data, setData }) {
  const [focused, setFocused] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [errors, setErrors] = useState({});

  const strength = getStrength(data.password);
  const pct = (strength.score / 4) * 100;

  const validate = () => {
    const e = {};
    if (!data.name.trim()) e.name = "Full name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Enter a valid email address";
    if (data.password.length < 8) e.password = "Password must be at least 8 characters";
    if (data.password !== data.confirm) e.confirm = "Passwords do not match";
    return e;
  };

  const handleNext = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) setData(d => ({ ...d, step: 2 }));
  };

  return (
    <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Full Name */}
        <Field label="Full Name" icon="👤" placeholder="Aryan Sharma" value={data.name} error={errors.name}
          focused={focused === "name"}
          onChange={e => setData(d => ({ ...d, name: e.target.value }))}
          onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} />

        {/* Email */}
        <Field label="Email Address" icon="📧" type="email" placeholder="aryan@example.com" value={data.email} error={errors.email}
          focused={focused === "email"}
          onChange={e => setData(d => ({ ...d, email: e.target.value }))}
          onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} />

        {/* Password */}
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7C4A1E", marginBottom: 7, fontFamily: "'DM Sans', sans-serif" }}>Password</label>
          <div style={{ position: "relative" }}>
            <span className="field-icon" style={{ opacity: focused === "pw" ? 0.9 : 0.5 }}>🔒</span>
            <input
              className={`ff-field${errors.password ? " has-error" : ""}`}
              type={showPw ? "text" : "password"}
              placeholder="Min. 8 characters"
              value={data.password}
              onChange={e => setData(d => ({ ...d, password: e.target.value }))}
              onFocus={() => setFocused("pw")}
              onBlur={() => setFocused(null)}
              style={{ paddingRight: 46 }}
            />
            <button className="eye-btn" type="button" onClick={() => setShowPw(v => !v)}>{showPw ? "🙈" : "👁️"}</button>
          </div>
          {data.password && (
            <div style={{ marginTop: 8 }}>
              <div className="strength-track">
                <div className="strength-fill" style={{ width: `${pct}%`, background: strength.color }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: 10, color: "#B07D5A", fontFamily: "'DM Sans', sans-serif" }}>Password strength</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: strength.color, fontFamily: "'DM Sans', sans-serif" }}>{strength.label}</span>
              </div>
            </div>
          )}
          <AnimatePresence>
            {errors.password && (
              <motion.div className="err-msg" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>⚠️ {errors.password}</motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Confirm Password */}
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7C4A1E", marginBottom: 7, fontFamily: "'DM Sans', sans-serif" }}>Confirm Password</label>
          <div style={{ position: "relative" }}>
            <span className="field-icon" style={{ opacity: focused === "cpw" ? 0.9 : 0.5 }}>✅</span>
            <input
              className={`ff-field${errors.confirm ? " has-error" : ""}`}
              type={showCpw ? "text" : "password"}
              placeholder="Re-enter your password"
              value={data.confirm}
              onChange={e => setData(d => ({ ...d, confirm: e.target.value }))}
              onFocus={() => setFocused("cpw")}
              onBlur={() => setFocused(null)}
              style={{ paddingRight: 46 }}
            />
            <button className="eye-btn" type="button" onClick={() => setShowCpw(v => !v)}>{showCpw ? "🙈" : "👁️"}</button>
          </div>
          {data.password && data.confirm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
              <span style={{ fontSize: 11, color: data.password === data.confirm ? "#20BF6B" : "#E8503A", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                {data.password === data.confirm ? "✓ Passwords match" : "✗ Passwords don't match"}
              </span>
            </motion.div>
          )}
          <AnimatePresence>
            {errors.confirm && (
              <motion.div className="err-msg" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>⚠️ {errors.confirm}</motion.div>
            )}
          </AnimatePresence>
        </div>

        <button className="btn-create" onClick={handleNext} style={{ marginTop: 4 }}>
          Continue — Set Your Location →
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Step 2 – Location & Budget ─────────────────────────────────────────── */
function Step2({ data, setData }) {
  const [focused, setFocused] = useState(null);
  const [errors, setErrors] = useState({});

  const pct = Math.round(((data.budget - 50) / 950) * 100);

  const validate = () => {
    const e = {};
    if (!data.city) e.city = "Please select your city";
    return e;
  };

  const handleNext = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) setData(d => ({ ...d, step: 3 }));
  };

  return (
    <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

        {/* City selector */}
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7C4A1E", marginBottom: 7, fontFamily: "'DM Sans', sans-serif" }}>Your City</label>
          <div style={{ position: "relative" }}>
            <span className="field-icon" style={{ opacity: 0.6 }}>📍</span>
            <select
              className={`ff-field${errors.city ? " has-error" : ""}`}
              value={data.city}
              onChange={e => setData(d => ({ ...d, city: e.target.value }))}
              onFocus={() => setFocused("city")}
              onBlur={() => setFocused(null)}
              style={{ appearance: "none", cursor: "pointer", color: data.city ? "#1A0F05" : "#B07D5A" }}
            >
              <option value="">Select your city…</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "#B07D5A", pointerEvents: "none" }}>▾</span>
          </div>
          <AnimatePresence>
            {errors.city && (
              <motion.div className="err-msg" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>⚠️ {errors.city}</motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Neighbourhood */}
        <Field label="Neighbourhood (optional)" icon="🏘️" placeholder="e.g. Hazratganj, Gomtinagar…" value={data.area} focused={focused === "area"}
          onChange={e => setData(d => ({ ...d, area: e.target.value }))}
          onFocus={() => setFocused("area")} onBlur={() => setFocused(null)} />

        {/* Budget slider */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7C4A1E", fontFamily: "'DM Sans', sans-serif" }}>Typical Meal Budget</label>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#F4631E", fontFamily: "'Playfair Display', serif" }}>₹{data.budget}</span>
          </div>
          <div style={{ padding: "10px 4px 6px", background: "rgba(244,99,30,0.05)", borderRadius: 12, border: "1px solid rgba(244,99,30,0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 12px" }}>
              <span style={{ fontSize: 11, color: "#B07D5A", fontFamily: "'DM Sans', sans-serif" }}>₹50</span>
              <input
                type="range" min={50} max={1000} step={10}
                className="ff-range"
                value={data.budget}
                style={{ flex: 1, "--v": `${pct}%` }}
                onChange={e => setData(d => ({ ...d, budget: Number(e.target.value) }))}
              />
              <span style={{ fontSize: 11, color: "#B07D5A", fontFamily: "'DM Sans', sans-serif" }}>₹1000</span>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 10, flexWrap: "wrap", padding: "0 8px" }}>
              {[80, 150, 300, 500].map(v => (
                <button key={v} type="button"
                  onClick={() => setData(d => ({ ...d, budget: v }))}
                  style={{
                    fontSize: 11, padding: "4px 10px", borderRadius: 99,
                    border: `1px solid ${data.budget === v ? "#F4631E" : "rgba(180,100,40,0.2)"}`,
                    background: data.budget === v ? "rgba(244,99,30,0.1)" : "rgba(255,255,255,0.7)",
                    color: data.budget === v ? "#F4631E" : "#7C4A1E",
                    fontWeight: data.budget === v ? 700 : 500,
                    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.2s",
                  }}>₹{v}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Distance preference */}
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7C4A1E", marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>Max Distance</label>
          <div style={{ display: "flex", gap: 8 }}>
            {["0.5 km", "1 km", "2 km", "5 km+"].map(d => (
              <button key={d} type="button"
                onClick={() => setData(prev => ({ ...prev, distance: d }))}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 12, textAlign: "center",
                  border: `1.5px solid ${data.distance === d ? "#F4631E" : "rgba(180,100,40,0.18)"}`,
                  background: data.distance === d ? "rgba(244,99,30,0.1)" : "rgba(255,255,255,0.65)",
                  color: data.distance === d ? "#F4631E" : "#7C4A1E",
                  fontWeight: data.distance === d ? 700 : 500,
                  fontSize: 12, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: data.distance === d ? "0 0 0 3px rgba(244,99,30,0.12)" : "none",
                  transition: "all 0.2s",
                }}>{d}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button type="button"
            onClick={() => setData(d => ({ ...d, step: 1 }))}
            style={{ flex: "0 0 auto", padding: "15px 20px", borderRadius: 16, border: "1.5px solid rgba(180,100,40,0.2)", background: "rgba(255,255,255,0.7)", color: "#7C4A1E", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#F4631E"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(180,100,40,0.2)"}
          >← Back</button>
          <button className="btn-create" style={{ flex: 1 }} onClick={handleNext}>
            Continue — Food Preferences →
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Step 3 – Preferences & Submit ─────────────────────────────────────── */
function Step3({ data, setData }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [err, setErr] = useState("");

  const PREFS = [
    { e: "🍛", l: "Indian" }, { e: "🌮", l: "Street" }, { e: "☕", l: "Café" },
    { e: "🍕", l: "Pizza" }, { e: "🍜", l: "Asian" }, { e: "🥗", l: "Healthy" },
    { e: "🍔", l: "Burgers" }, { e: "🍮", l: "Sweets" },
  ];

  const toggle = (l) => setData(d => ({
    ...d,
    prefs: d.prefs.includes(l) ? d.prefs.filter(x => x !== l) : [...d.prefs, l],
  }));

  const handleSubmit = async () => {
    if (!agreed) { setErr("Please accept the terms to continue."); return; }
    setErr("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    setLoading(false);
    setDone(true);
  };

  if (done) {
    return (
      <motion.div key="done" initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: "center", padding: "16px 0 8px" }}>
        <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.1, type: "spring", stiffness: 220, damping: 14 }}
          style={{ width: 88, height: 88, borderRadius: "50%", background: "linear-gradient(135deg, #F4631E, #FF8C42)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42, margin: "0 auto 22px", boxShadow: "0 10px 36px rgba(244,99,30,0.4)" }}>
          🎉
        </motion.div>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#1A0F05", marginBottom: 10 }}>Welcome to FoodFinder!</h3>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#7C4A1E", lineHeight: 1.65, marginBottom: 22 }}>
          Your account is ready, <strong>{data.name.split(" ")[0]}</strong>! 🍽️<br/>
          Discover the best food in <strong>{data.city || "your city"}</strong> right now.
        </p>
        <button className="btn-create">Go to My Food Feed →</button>
      </motion.div>
    );
  }

  return (
    <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

        {/* Food preferences */}
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7C4A1E", marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>
            What do you love eating? <span style={{ color: "#B07D5A", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(pick any)</span>
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {PREFS.map(p => {
              const active = data.prefs.includes(p.l);
              return (
                <motion.button key={p.l} type="button" onClick={() => toggle(p.l)}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  style={{
                    padding: "10px 6px", borderRadius: 14, textAlign: "center", cursor: "pointer",
                    border: `1.5px solid ${active ? "#F4631E" : "rgba(180,100,40,0.18)"}`,
                    background: active ? "rgba(244,99,30,0.1)" : "rgba(255,255,255,0.65)",
                    boxShadow: active ? "0 0 0 3px rgba(244,99,30,0.12)" : "none",
                    transition: "all 0.2s",
                  }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{p.e}</div>
                  <div style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? "#F4631E" : "#7C4A1E", fontFamily: "'DM Sans', sans-serif" }}>{p.l}</div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Dining preferences */}
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7C4A1E", marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>Dining Style</label>
          <div style={{ display: "flex", gap: 8 }}>
            {["Dine-In", "Takeaway", "Both"].map(s => (
              <button key={s} type="button" onClick={() => setData(d => ({ ...d, dining: s }))}
                style={{
                  flex: 1, padding: "11px 0", borderRadius: 12, textAlign: "center",
                  border: `1.5px solid ${data.dining === s ? "#F4631E" : "rgba(180,100,40,0.18)"}`,
                  background: data.dining === s ? "rgba(244,99,30,0.1)" : "rgba(255,255,255,0.65)",
                  color: data.dining === s ? "#F4631E" : "#7C4A1E",
                  fontWeight: data.dining === s ? 700 : 500,
                  fontSize: 12, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: data.dining === s ? "0 0 0 3px rgba(244,99,30,0.12)" : "none",
                  transition: "all 0.2s",
                }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Terms */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <input type="checkbox" className="ff-check" id="terms" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2 }} />
          <label htmlFor="terms" style={{ fontSize: 12, color: "#7C4A1E", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, cursor: "pointer", userSelect: "none" }}>
            I agree to FoodFinder's{" "}
            <a href="#" style={{ color: "#F4631E", textDecoration: "none", fontWeight: 600 }}>Terms of Service</a> and{" "}
            <a href="#" style={{ color: "#F4631E", textDecoration: "none", fontWeight: 600 }}>Privacy Policy</a>
          </label>
        </div>

        {err && (
          <div style={{ fontSize: 12, color: "#C0392B", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>⚠️ {err}</div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 2 }}>
          <button type="button"
            onClick={() => setData(d => ({ ...d, step: 2 }))}
            style={{ flex: "0 0 auto", padding: "15px 20px", borderRadius: 16, border: "1.5px solid rgba(180,100,40,0.2)", background: "rgba(255,255,255,0.7)", color: "#7C4A1E", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#F4631E"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(180,100,40,0.2)"}
          >← Back</button>
          <button className="btn-create" style={{ flex: 1 }} onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  style={{ display: "inline-block", width: 16, height: 16, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,0.35)", borderTopColor: "#fff" }} />
                Creating your account…
              </span>
            ) : "🎉 Create My FoodFinder Account"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Right Panel – Signup Card ───────────────────────────────────────────── */
function RightPanel() {
  const [data, setData] = useState({
    step: 1,
    name: "", email: "", password: "", confirm: "",
    city: "", area: "", budget: 150, distance: "1 km",
    prefs: [], dining: "Both",
  });

  return (
    <div style={{
      width: 500,
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 28px",
      position: "relative",
      flexShrink: 0,
    }}>
      {/* Ambient glow */}
      <div style={{ position: "absolute", top: -80, right: -80, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,99,30,0.08), transparent 70%)", filter: "blur(50px)", pointerEvents: "none" }} />

      {/* Glass card */}
      <motion.div
        initial={{ opacity: 0, y: 36, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: "100%", maxWidth: 440,
          borderRadius: 28,
          background: "rgba(255,252,247,0.72)",
          border: "1.5px solid rgba(244,99,30,0.15)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          boxShadow: "0 28px 72px rgba(100,50,10,0.13), 0 2px 0 rgba(255,255,255,0.85) inset, 0 0 0 1px rgba(255,255,255,0.6) inset",
          padding: "32px 32px 28px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Card top accent */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #F4631E 30%, #FFD166 70%, transparent)" }} />
        {/* Corner light */}
        <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(247,183,49,0.12), transparent 70%)", pointerEvents: "none" }} />

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #F4631E, #FF8C42)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 4px 16px rgba(244,99,30,0.35)", flexShrink: 0 }}>🍴</div>
            <div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, color: "#F4631E", letterSpacing: "0.1em", textTransform: "uppercase" }}>FoodFinder</div>
            </div>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#1A0F05", lineHeight: 1.2, marginBottom: 6 }}>
            Create Your Account ✨
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#7C4A1E", lineHeight: 1.6, marginBottom: 22 }}>
            Join 85,000+ food lovers discovering great local eats.
          </p>

          {/* Step indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            {STEPS.map((s, i) => {
              const idx = i + 1;
              const active = data.step === idx;
              const done = data.step > idx;
              return (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: active ? 28 : 22, height: 22, borderRadius: active ? 7 : 11,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: done ? "#F4631E" : active ? "linear-gradient(135deg, #F4631E, #FF8C42)" : "rgba(180,100,40,0.12)",
                    color: (active || done) ? "white" : "#B07D5A",
                    fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.3s",
                    boxShadow: active ? "0 2px 10px rgba(244,99,30,0.35)" : "none",
                  }}>{done ? "✓" : idx}</div>
                  <span style={{ fontSize: 11, fontWeight: active ? 700 : 500, color: active ? "#F4631E" : "#B07D5A", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>{s}</span>
                  {i < STEPS.length - 1 && (
                    <div style={{ width: 20, height: 1, background: done ? "#F4631E" : "rgba(180,100,40,0.2)", marginLeft: 2, transition: "background 0.3s" }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Google button — only on step 1 */}
          {data.step === 1 && (
            <>
              <button className="btn-google">
                <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                  <path d="M3.964 10.706c-.18-.54-.282-1.117-.282-1.706s.102-1.166.282-1.706V4.962H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.038l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 6.294C4.672 4.167 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}>
                <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(180,100,40,0.2), transparent)" }} />
                <span style={{ fontSize: 11, color: "#B07D5A", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>or with email</span>
                <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(180,100,40,0.2), transparent)" }} />
              </div>
            </>
          )}
        </motion.div>

        {/* Form steps */}
        <AnimatePresence mode="wait">
          {data.step === 1 && <Step1 data={data} setData={setData} />}
          {data.step === 2 && <Step2 data={data} setData={setData} />}
          {data.step === 3 && <Step3 data={data} setData={setData} />}
        </AnimatePresence>

        {/* Login link */}
        {data.step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            style={{ textAlign: "center", marginTop: 22 }}>
            <span style={{ fontSize: 13, color: "#7C4A1E", fontFamily: "'DM Sans', sans-serif" }}>
              Already have an account?{" "}
              <a href="#" style={{ color: "#F4631E", fontWeight: 700, textDecoration: "none" }}
                onMouseEnter={e => e.target.style.opacity = "0.7"}
                onMouseLeave={e => e.target.style.opacity = "1"}
              >Sign in →</a>
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Trust badges */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
        style={{ display: "flex", gap: 18, marginTop: 22, alignItems: "center" }}>
        {["🔒 Secure", "🛡️ No spam", "⚡ Free forever"].map(b => (
          <span key={b} style={{ fontSize: 11, color: "#B07D5A", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{b}</span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Root ─────────────────────────────────────────────────────────────────── */
export default function FoodFinderSignup() {
  return (
    <div
      className="grain"
      style={{
        minHeight: "100vh",
        display: "flex",
        background: `
          radial-gradient(ellipse 110% 90% at 25% 50%, rgba(244,99,30,0.09) 0%, transparent 60%),
          radial-gradient(ellipse 70% 60% at 80% 20%, rgba(247,183,49,0.08) 0%, transparent 55%),
          radial-gradient(ellipse 80% 70% at 75% 85%, rgba(244,99,30,0.06) 0%, transparent 55%),
          #FDFAF5
        `,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <GlobalStyles />

      {/* Decorative background blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "5%", left: "30%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,99,30,0.06), transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "20%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(247,183,49,0.08), transparent 70%)", filter: "blur(50px)" }} />
      </div>

      {/* Vertical separator */}
      <div style={{
        position: "fixed",
        top: "8%", bottom: "8%",
        left: "calc(100% - 500px - 1px)",
        width: 1,
        background: "linear-gradient(180deg, transparent, rgba(180,100,40,0.12) 25%, rgba(244,99,30,0.2) 50%, rgba(180,100,40,0.12) 75%, transparent)",
        zIndex: 5,
        pointerEvents: "none",
      }} />

      {/* Left */}
      <div style={{ flex: 1, position: "relative", zIndex: 2 }}>
        <LeftPanel />
      </div>

      {/* Right */}
      <div style={{
        position: "relative", zIndex: 2,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(253,250,245,0.5)",
        backdropFilter: "blur(4px)",
        borderLeft: "1px solid rgba(244,99,30,0.08)",
      }}>
        <RightPanel />
      </div>
    </div>
  );
}
