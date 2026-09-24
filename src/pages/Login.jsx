import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext";
/* ─── Global CSS ─────────────────────────────────────────────────────────── */
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Satoshi:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; }

    .page-bg {
      background: #0a0704;
      min-height: 100vh;
      position: relative;
      overflow: hidden;
    }

    /* Noise grain overlay */
    .page-bg::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 0;
    }

    .clip-title {
      background: linear-gradient(135deg, #FF8C42 0%, #FFD166 50%, #FF5722 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* ── Input styling ── */
    .ff-input {
      width: 100%;
      padding: 14px 18px;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.09);
      background: rgba(255,255,255,0.04);
      color: rgba(255,255,255,0.9);
      font-size: 14px;
      font-family: 'Satoshi', sans-serif;
      outline: none;
      transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
      caret-color: #FF8C42;
    }
    .ff-input::placeholder { color: rgba(255,255,255,0.25); }
    .ff-input:focus {
      border-color: rgba(255,140,66,0.55);
      background: rgba(255,255,255,0.06);
      box-shadow: 0 0 0 4px rgba(255,87,34,0.1), inset 0 1px 0 rgba(255,255,255,0.05);
    }

    /* ── Floating food cards animations ── */
    @keyframes levitate-a { 0%,100%{transform:translateY(0px) rotate(-6deg) rotateX(12deg)} 50%{transform:translateY(-22px) rotate(-4deg) rotateX(14deg)} }
    @keyframes levitate-b { 0%,100%{transform:translateY(0px) rotate(5deg) rotateX(10deg)} 50%{transform:translateY(-18px) rotate(7deg) rotateX(12deg)} }
    @keyframes levitate-c { 0%,100%{transform:translateY(0px) rotate(-3deg) rotateX(8deg)} 50%{transform:translateY(-26px) rotate(-5deg) rotateX(10deg)} }
    @keyframes levitate-d { 0%,100%{transform:translateY(0px) rotate(8deg) rotateX(15deg)} 50%{transform:translateY(-14px) rotate(6deg) rotateX(13deg)} }
    @keyframes levitate-e { 0%,100%{transform:translateY(0px) rotate(-10deg) rotateX(9deg)} 50%{transform:translateY(-20px) rotate(-8deg) rotateX(11deg)} }
    @keyframes orb-drift-a { 0%,100%{transform:translate(0,0)} 33%{transform:translate(40px,-30px)} 66%{transform:translate(-20px,20px)} }
    @keyframes orb-drift-b { 0%,100%{transform:translate(0,0)} 33%{transform:translate(-50px,25px)} 66%{transform:translate(30px,-40px)} }
    @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.7} 100%{transform:scale(1.5);opacity:0} }
    @keyframes shimmer-btn { 0%{left:-100%} 100%{left:200%} }

    .card-float-a { animation: levitate-a 5.5s ease-in-out infinite; }
    .card-float-b { animation: levitate-b 6.2s ease-in-out infinite 0.8s; }
    .card-float-c { animation: levitate-c 4.8s ease-in-out infinite 1.5s; }
    .card-float-d { animation: levitate-d 7s ease-in-out infinite 0.3s; }
    .card-float-e { animation: levitate-e 5.8s ease-in-out infinite 2s; }

    /* ── Shimmer CTA button ── */
    .btn-primary {
      position: relative;
      overflow: hidden;
      width: 100%;
      padding: 15px 0;
      border-radius: 16px;
      border: none;
      background: linear-gradient(135deg, #FF5722 0%, #FF8C42 50%, #e84d18 100%);
      color: #fff;
      font-size: 15px;
      font-weight: 700;
      font-family: 'Satoshi', sans-serif;
      letter-spacing: 0.02em;
      cursor: pointer;
      box-shadow: 0 8px 32px rgba(255,87,34,0.45), inset 0 1px 0 rgba(255,255,255,0.2);
      transition: opacity 0.2s, transform 0.15s;
    }
    .btn-primary:hover { opacity: 0.92; transform: translateY(-1px); }
    .btn-primary:active { transform: scale(0.98); }
    .btn-primary::after {
      content: '';
      position: absolute;
      top: -50%; left: -100%;
      width: 50%; height: 200%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
      transform: skewX(-20deg);
      animation: shimmer-btn 3s ease-in-out infinite 1s;
    }

    .btn-google {
      width: 100%;
      padding: 14px 0;
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,0.1);
      background: rgba(255,255,255,0.05);
      color: rgba(255,255,255,0.8);
      font-size: 14px;
      font-weight: 600;
      font-family: 'Satoshi', sans-serif;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: background 0.2s, border-color 0.2s, transform 0.15s;
    }
    .btn-google:hover {
      background: rgba(255,255,255,0.08);
      border-color: rgba(255,255,255,0.18);
      transform: translateY(-1px);
    }
    .btn-google:active { transform: scale(0.98); }

    /* ── Glass divider ── */
    .divider {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 4px 0;
    }
    .divider-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    }
    .divider-text {
      font-size: 11px;
      color: rgba(255,255,255,0.3);
      font-family: 'Satoshi', sans-serif;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    /* ── Password toggle ── */
    .input-wrap { position: relative; }
    .eye-btn {
      position: absolute;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: rgba(255,255,255,0.3);
      font-size: 16px;
      padding: 4px;
      line-height: 1;
      transition: color 0.2s;
    }
    .eye-btn:hover { color: rgba(255,140,66,0.8); }

    /* ── Checkbox ── */
    .ff-check {
      width: 16px; height: 16px;
      border-radius: 5px;
      border: 1.5px solid rgba(255,255,255,0.2);
      background: transparent;
      appearance: none;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
      flex-shrink: 0;
    }
    .ff-check:checked {
      background: linear-gradient(135deg, #FF5722, #FF8C42);
      border-color: #FF8C42;
    }
    .ff-check:checked::after {
      content: '✓';
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: white;
      font-weight: 700;
    }
  `}</style>
);

/* ─── 3D Food Card ───────────────────────────────────────────────────────── */
function FoodCard3D({ emoji, name, price, rating, tag, accentColor, className, style }) {
  return (
    <div
      className={className}
      style={{
        position: "absolute",
        width: 200,
        borderRadius: 20,
        overflow: "hidden",
        background: `linear-gradient(145deg, rgba(30,20,10,0.96), rgba(22,15,7,0.94))`,
        border: `1px solid ${accentColor}30`,
        boxShadow: `
          0 24px 48px rgba(0,0,0,0.7),
          0 1px 0 rgba(255,255,255,0.06) inset,
          0 0 40px ${accentColor}20
        `,
        backdropFilter: "blur(20px)",
        transformStyle: "preserve-3d",
        cursor: "default",
        userSelect: "none",
        ...style,
      }}
    >
      {/* Top color accent line */}
      <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />

      {/* Card body */}
      <div style={{ padding: "14px 16px 16px" }}>
        {/* Emoji + tag */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 13,
            background: `${accentColor}18`,
            border: `1px solid ${accentColor}30`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22,
          }}>{emoji}</div>
          <div style={{
            fontSize: 10, fontWeight: 700,
            padding: "4px 9px", borderRadius: 99,
            background: `${accentColor}18`,
            color: accentColor,
            border: `1px solid ${accentColor}30`,
            fontFamily: "Satoshi, sans-serif",
            whiteSpace: "nowrap",
          }}>{tag}</div>
        </div>

        <div style={{ fontFamily: "Clash Display, sans-serif", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)", marginBottom: 3 }}>{name}</div>
        <div style={{ fontFamily: "Satoshi, sans-serif", fontSize: 11, color: "rgba(255,255,255,0.38)", marginBottom: 10 }}>Local favourite · 0.4 km</div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "Satoshi, sans-serif", fontSize: 13, fontWeight: 700, color: accentColor }}>{price}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 11 }}>⭐</span>
            <span style={{ fontFamily: "Satoshi, sans-serif", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Floating Orb ───────────────────────────────────────────────────────── */
function Orb({ size, color, style, animClass }) {
  return (
    <div
      className={animClass}
      style={{
        position: "absolute",
        width: size, height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 35%, ${color}40, ${color}10, transparent 70%)`,
        filter: `blur(${size * 0.3}px)`,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}

/* ─── Left Panel – 3D Scene ──────────────────────────────────────────────── */
function LeftPanel() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-300, 300], [8, -8]), { stiffness: 60, damping: 20 });
  const rotY = useSpring(useTransform(mx, [-300, 300], [-8, 8]), { stiffness: 60, damping: 20 });

  const handleMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left - r.width / 2);
    my.set(e.clientY - r.top - r.height / 2);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      style={{
        flex: 1,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
        overflow: "hidden",
        perspective: 1200,
      }}
    >
      {/* Background orbs */}
      <Orb size={400} color="#FF5722" style={{ top: "10%", left: "5%" }} animClass="" />
      <Orb size={300} color="#FF8C42" style={{ bottom: "15%", right: "5%" }} animClass="" />
      <Orb size={200} color="#FFD166" style={{ top: "50%", left: "40%" }} animClass="" />

      {/* Radial vignette grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `radial-gradient(circle at center, transparent 30%, rgba(10,7,4,0.9) 100%),
          repeating-linear-gradient(0deg, transparent, transparent 69px, rgba(255,255,255,0.025) 70px),
          repeating-linear-gradient(90deg, transparent, transparent 69px, rgba(255,255,255,0.025) 70px)`,
        pointerEvents: "none",
      }} />

      {/* Brand mark top-left */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{ position: "absolute", top: 36, left: 40, display: "flex", alignItems: "center", gap: 10, zIndex: 10 }}
      >
        <div style={{
          width: 38, height: 38, borderRadius: 12,
          background: "linear-gradient(135deg, #FF5722, #FF8C42)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, boxShadow: "0 4px 20px rgba(255,87,34,0.5)",
        }}>🍴</div>
        <span style={{ fontFamily: "Clash Display, sans-serif", fontSize: 18, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>
          Food<span style={{ color: "#FF8C42" }}>Finder</span>
        </span>
      </motion.div>

      {/* 3D tilt scene */}
      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d", position: "relative", width: 440, height: 440 }}
      >
        {/* Central glow disc */}
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%) rotateX(75deg)",
          width: 320, height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,140,66,0.18), rgba(255,87,34,0.08), transparent 70%)",
          boxShadow: "0 0 80px rgba(255,87,34,0.2)",
          pointerEvents: "none",
        }} />

        {/* Ring decoration */}
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%) rotateX(70deg)",
          width: 370, height: 370,
          borderRadius: "50%",
          border: "1px solid rgba(255,140,66,0.12)",
          animation: "spin-slow 30s linear infinite",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%) rotateX(70deg)",
          width: 280, height: 280,
          borderRadius: "50%",
          border: "1px dashed rgba(255,209,102,0.1)",
          animation: "spin-slow 20s linear infinite reverse",
          pointerEvents: "none",
        }} />

        {/* Central plate / hero food */}
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 130, height: 130,
          borderRadius: "50%",
          background: "linear-gradient(145deg, #1e1208, #140e06)",
          border: "1.5px solid rgba(255,140,66,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 56,
          boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(255,87,34,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
          zIndex: 5,
        }}>
          🍛
          {/* Pulse rings */}
          <div style={{ position: "absolute", inset: -12, borderRadius: "50%", border: "1px solid rgba(255,140,66,0.3)", animation: "pulse-ring 2.5s ease-out infinite" }} />
          <div style={{ position: "absolute", inset: -12, borderRadius: "50%", border: "1px solid rgba(255,140,66,0.2)", animation: "pulse-ring 2.5s ease-out infinite 0.8s" }} />
        </div>

        {/* Floating food cards */}
        <FoodCard3D
          emoji="🍚" name="Biryani Bros" price="₹120" rating="4.8" tag="🔥 Hot"
          accentColor="#FF6B35"
          className="card-float-a"
          style={{ top: 30, left: -20, zIndex: 4 }}
        />
        <FoodCard3D
          emoji="☕" name="Green Bowl Café" price="₹90" rating="4.9" tag="✨ Top"
          accentColor="#20BF6B"
          className="card-float-b"
          style={{ top: 20, right: -10, zIndex: 4 }}
        />
        <FoodCard3D
          emoji="🥙" name="Chaat Corner" price="₹45" rating="4.6" tag="💰 Value"
          accentColor="#F7B731"
          className="card-float-c"
          style={{ bottom: 40, left: 0, zIndex: 4 }}
        />
        <FoodCard3D
          emoji="🍜" name="Noodle Nook" price="₹110" rating="4.7" tag="🎯 Gem"
          accentColor="#0FB9B1"
          className="card-float-d"
          style={{ bottom: 50, right: -10, zIndex: 4 }}
        />
      </motion.div>

      {/* Bottom tagline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.7 }}
        style={{ position: "absolute", bottom: 40, left: 0, right: 0, textAlign: "center", padding: "0 40px", zIndex: 10 }}
      >
        <div style={{ fontFamily: "Clash Display, sans-serif", fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.88)", lineHeight: 1.2, marginBottom: 8 }}>
          Your city's best food,
          <br />
          <span style={{
            background: "linear-gradient(135deg, #FF8C42, #FFD166)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>matched to your budget.</span>
        </div>
        <p style={{ fontFamily: "Satoshi, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
          1,200+ local food shops · Live crowd levels · Real-time prices
        </p>
      </motion.div>
    </div>
  );
}

/* ─── Right Panel – Login Form ───────────────────────────────────────────── */
function RightPanel() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focused, setFocused] = useState(null); // "email" | "password"

  const handleLogin = async () => {
  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  setLoading(true);

  await new Promise(r => setTimeout(r, 800));

  // FAKE DATABASE USER
  const validUser = {
    email: "test@gmail.com",
    password: "123456"
  };

  // WRONG LOGIN
  if (email !== validUser.email || password !== validUser.password) {
    setLoading(false);
    alert("Invalid email or password ❌");
    return;
  }

  // CORRECT LOGIN
  const userData = {
    name: "Test User",
    email: email,
  };

  login(userData);

  setLoading(false);
  setSuccess(true);

  setTimeout(() => {
    navigate("/profile");
  }, 1000);
};

  return (
    <div style={{
      width: 480,
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 32px",
      position: "relative",
      flexShrink: 0,
    }}>

      {/* Background glow for right panel */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, rgba(255,87,34,0.04) 0%, rgba(255,140,66,0.02) 100%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: -100, right: -100,
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,87,34,0.07), transparent 70%)",
        filter: "blur(60px)", pointerEvents: "none",
      }} />

      {/* Glass card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 28,
          background: "linear-gradient(145deg, rgba(255,255,255,0.055), rgba(255,255,255,0.02))",
          border: "1px solid rgba(255,255,255,0.09)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.07) inset",
          padding: "36px 36px 32px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Card inner top accent */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,140,66,0.5) 50%, transparent)" }} />
        {/* Corner glow */}
        <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,87,34,0.1), transparent 70%)", pointerEvents: "none" }} />

        <AnimatePresence mode="wait">
          {success ? (
            /* ── Success state ── */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ textAlign: "center", padding: "20px 0 10px" }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 14 }}
                style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: "linear-gradient(135deg, #FF5722, #FF8C42)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 38, margin: "0 auto 24px",
                  boxShadow: "0 8px 32px rgba(255,87,34,0.5)",
                }}
              >🍴</motion.div>
              <div style={{ fontFamily: "Clash Display, sans-serif", fontSize: 24, fontWeight: 700, color: "rgba(255,255,255,0.95)", marginBottom: 10 }}>
                Welcome back! 🎉
              </div>
              <p style={{ fontFamily: "Satoshi, sans-serif", fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                You're logged in. Redirecting to your food feed…
              </p>
            </motion.div>
          ) : (
            /* ── Form state ── */
            <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>

              {/* Header */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: "linear-gradient(135deg, #FF5722, #FF8C42)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, boxShadow: "0 4px 16px rgba(255,87,34,0.45)",
                    flexShrink: 0,
                  }}>🍴</div>
                  <div>
                    <div style={{ fontFamily: "Clash Display, sans-serif", fontSize: 11, fontWeight: 600, color: "#FF8C42", letterSpacing: "0.1em", textTransform: "uppercase" }}>FoodFinder</div>
                  </div>
                </div>

                <h1 style={{ fontFamily: "Clash Display, sans-serif", fontSize: 26, fontWeight: 700, color: "rgba(255,255,255,0.95)", lineHeight: 1.15, marginBottom: 8 }}>
                  Welcome back 👋
                </h1>
                <p style={{ fontFamily: "Satoshi, sans-serif", fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: 28 }}>
                  Sign in to discover food near you, tailored to your budget.
                </p>
              </motion.div>

              {/* Google button */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
                <button className="btn-google">
                  {/* Google SVG icon */}
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                    <path d="M3.964 10.706c-.18-.54-.282-1.117-.282-1.706s.102-1.166.282-1.706V4.962H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.038l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 6.294C4.672 4.167 6.656 3.58 9 3.58z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
              </motion.div>

              {/* Divider */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }} className="divider" style={{ margin: "20px 0" }}>
                <div className="divider-line" />
                <span className="divider-text">or sign in with email</span>
                <div className="divider-line" />
              </motion.div>

              {/* Fields */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
                style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                {/* Email */}
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 8, fontFamily: "Satoshi, sans-serif" }}>
                    Email Address
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      className="ff-input"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)}
                      style={{ paddingLeft: 44 }}
                    />
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, opacity: focused === "email" ? 1 : 0.45, transition: "opacity 0.2s" }}>📧</span>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontFamily: "Satoshi, sans-serif" }}>
                      Password
                    </label>
                    <a href="#" style={{ fontSize: 12, color: "#FF8C42", textDecoration: "none", fontFamily: "Satoshi, sans-serif", fontWeight: 600, transition: "opacity 0.2s" }}
                      onMouseEnter={e => e.target.style.opacity = "0.75"}
                      onMouseLeave={e => e.target.style.opacity = "1"}
                    >Forgot password?</a>
                  </div>
                  <div className="input-wrap">
                    <input
                      className="ff-input"
                      type={showPass ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onFocus={() => setFocused("password")}
                      onBlur={() => setFocused(null)}
                      style={{ paddingLeft: 44, paddingRight: 46 }}
                    />
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, opacity: focused === "password" ? 1 : 0.45, transition: "opacity 0.2s" }}>🔒</span>
                    <button className="eye-btn" onClick={() => setShowPass(!showPass)} type="button">
                      {showPass ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 2 }}>
                  <input className="ff-check" type="checkbox" id="remember" checked={remember} onChange={e => setRemember(e.target.checked)} />
                  <label htmlFor="remember" style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontFamily: "Satoshi, sans-serif", cursor: "pointer", userSelect: "none" }}>
                    Keep me signed in
                  </label>
                </div>
              </motion.div>

              {/* Login button */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ marginTop: 24 }}>
                <button className="btn-primary" onClick={handleLogin} disabled={loading}>
                  {loading ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        style={{ display: "inline-block", width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff" }}
                      />
                      Signing you in…
                    </span>
                  ) : (
                    "🍽️  Sign In to FoodFinder"
                  )}
                </button>
              </motion.div>

              {/* Sign up link */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.48 }}
                style={{ textAlign: "center", marginTop: 22 }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", fontFamily: "Satoshi, sans-serif" }}>
                  Don't have an account?{" "}
                  <a href="#" style={{ color: "#FF8C42", fontWeight: 700, textDecoration: "none", transition: "opacity 0.2s" }}
                    onMouseEnter={e => e.target.style.opacity = "0.75"}
                    onMouseLeave={e => e.target.style.opacity = "1"}
                  >Create one free →</a>
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bottom trust row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        style={{ display: "flex", gap: 20, marginTop: 28, alignItems: "center" }}
      >
        {["🔒 Secure login", "🛡️ Privacy first", "⚡ Instant access"].map(item => (
          <span key={item} style={{ fontSize: 11, color: "rgba(255,255,255,0.22)", fontFamily: "Satoshi, sans-serif", fontWeight: 500 }}>{item}</span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Root ───────────────────────────────────────────────────────────────── */
export default function FoodFinderLogin() {
  return (
    <div className="page-bg" style={{ display: "flex", minHeight: "100vh", position: "relative" }}>
      <G />

      {/* Full background gradient */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 100% 80% at 25% 50%, rgba(255,87,34,0.1) 0%, transparent 55%),
          radial-gradient(ellipse 60% 60% at 80% 20%, rgba(255,140,66,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 80% 80% at 80% 80%, rgba(255,87,34,0.05) 0%, transparent 60%),
          #0a0704
        `,
      }} />

      {/* Vertical separator */}
      <div style={{
        position: "absolute",
        top: "10%", bottom: "10%",
        left: "55%",
        width: 1,
        background: "linear-gradient(180deg, transparent, rgba(255,140,66,0.12) 30%, rgba(255,140,66,0.18) 50%, rgba(255,140,66,0.12) 70%, transparent)",
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
        background: "rgba(6,4,3,0.45)",
        backdropFilter: "blur(2px)",
        borderLeft: "1px solid rgba(255,255,255,0.04)",
      }}>
        <RightPanel />
      </div>
    </div>
  );
}
