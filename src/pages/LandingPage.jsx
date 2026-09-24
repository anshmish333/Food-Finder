import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView, useMotionValue } from "framer-motion";
import Navbar from "../components/Navbar"

// ─── Global Styles ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Satoshi:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: #080604; }
    ::-webkit-scrollbar-thumb { background: linear-gradient(#FF5722, #FF9800); border-radius: 99px; }
    .clip-text {
      background: linear-gradient(135deg, #FF8C42 0%, #FFD166 45%, #FF5722 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    input[type=range] {
      -webkit-appearance: none;
      width: 100%; height: 3px; border-radius: 99px;
      background: linear-gradient(to right, #FF5722 0%, #FF8C42 var(--v, 30%), rgba(255,255,255,0.1) var(--v, 30%));
      outline: none; cursor: pointer;
    }
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 20px; height: 20px; border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #FF8C42, #FF5722);
      border: 2.5px solid rgba(255,255,255,0.9);
      box-shadow: 0 0 12px rgba(255,87,34,0.6), 0 2px 6px rgba(0,0,0,0.4);
      cursor: pointer;
    }
    @keyframes float-a { 0%,100%{transform:translateY(0px) rotate(5deg)} 50%{transform:translateY(-18px) rotate(8deg)} }
    @keyframes float-b { 0%,100%{transform:translateY(0px) rotate(-4deg)} 50%{transform:translateY(-12px) rotate(-7deg)} }
    @keyframes float-c { 0%,100%{transform:translateY(0px) rotate(3deg)} 50%{transform:translateY(-20px) rotate(6deg)} }
    @keyframes float-d { 0%,100%{transform:translateY(0px) rotate(-5deg)} 50%{transform:translateY(-10px) rotate(-2deg)} }
    @keyframes float-e { 0%,100%{transform:translateY(0px) rotate(4deg)} 50%{transform:translateY(-14px) rotate(7deg)} }
    @keyframes pulse-dot { 0%,100%{transform:scale(1);opacity:0.7} 50%{transform:scale(1.4);opacity:0} }
    @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
    @keyframes shimmer-line { 0%{left:-100%} 100%{left:200%} }
    .marquee-inner { animation: marquee 30s linear infinite; display: flex; width: max-content; }
    .marquee-inner:hover { animation-play-state: paused; }
    .btn-shine { position: relative; overflow: hidden; }
    .btn-shine::after {
      content: '';
      position: absolute;
      top: -50%; left: -60%;
      width: 40%; height: 200%;
      background: rgba(255,255,255,0.15);
      transform: skewX(-20deg);
      transition: left 0.6s ease;
    }
    .btn-shine:hover::after { left: 140%; }
  `}</style>
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const SHOPS = [
  { id:1, name:"Sharma Ji Ka Dhaba", type:"North Indian", price:"₹80–150", dist:"0.3 km", crowd:68, rating:4.8, reviews:312, tag:"🔥 Trending", emoji:"🍛", accent:"#FF6B35", bg:"from-[#1E0F05] to-[#0f0c09]" },
  { id:2, name:"Chaat Corner", type:"Street Food", price:"₹30–80", dist:"0.5 km", crowd:42, rating:4.5, reviews:198, tag:"💰 Best Value", emoji:"🥙", accent:"#F7B731", bg:"from-[#1A1200] to-[#0f0c09]" },
  { id:3, name:"Green Bowl Café", type:"Café & Salads", price:"₹120–250", dist:"1.1 km", crowd:28, rating:4.9, reviews:445, tag:"✨ Premium", emoji:"🥗", accent:"#20BF6B", bg:"from-[#041A0A] to-[#0f0c09]" },
  { id:4, name:"Biryani Bros", type:"Biryani House", price:"₹100–200", dist:"0.8 km", crowd:85, rating:4.6, reviews:627, tag:"⚡ Popular", emoji:"🍚", accent:"#FC5C65", bg:"from-[#1A0205] to-[#0f0c09]" },
  { id:5, name:"The Pav Studio", type:"Mumbai Street", price:"₹40–90", dist:"0.4 km", crowd:55, rating:4.4, reviews:284, tag:"🌟 Local Fav", emoji:"🌮", accent:"#A55EEA", bg:"from-[#0E0518] to-[#0f0c09]" },
  { id:6, name:"Noodle Nook", type:"Asian Fusion", price:"₹90–180", dist:"1.4 km", crowd:33, rating:4.7, reviews:371, tag:"🎯 Hidden Gem", emoji:"🍜", accent:"#0FB9B1", bg:"from-[#011A18] to-[#0f0c09]" },
];

const BUDGET_CARDS = [
  { budget:"Under ₹50", desc:"Chai & Street Snacks", shops:14, emoji:"🍵", color:"#FF6B35" },
  { budget:"Under ₹100", desc:"Thali & Quick Meals", shops:28, emoji:"🍱", color:"#F7B731" },
  { budget:"Under ₹200", desc:"Biryani & Café Plates", shops:41, emoji:"🍛", color:"#20BF6B" },
  { budget:"Under ₹500", desc:"Fine Casual Dining", shops:19, emoji:"🍽️", color:"#A55EEA" },
];

const CATS = [
  {l:"Street Food",e:"🌯",c:34},{l:"Fast Food",e:"🍔",c:22},{l:"Café",e:"☕",c:18},
  {l:"Vegetarian",e:"🥦",c:29},{l:"Non-Veg",e:"🍗",c:25},{l:"Sweets",e:"🍮",c:16},
  {l:"Rolls",e:"🌮",c:13},{l:"South Indian",e:"🥞",c:20},
];

const TICKER = ["🍛 Sharma Ji Ka Dhaba","☕ Green Bowl Café","🍜 Noodle Nook","🍔 Burger Station","🥙 Chaat Corner","🍚 Biryani Bros","🌮 The Pav Studio","🍮 Raju Sweets","🥗 FreshLeaf Kitchen","🍕 Slice Society"];

// ─── Sub-components ───────────────────────────────────────────────────────────
function MagBtn({ children, style, onClick, className }) {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });
  return (
    <motion.button ref={ref} style={{ ...style, x: sx, y: sy }} className={className} onClick={onClick}
      onMouseMove={e => {
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width/2) * 0.3);
        y.set((e.clientY - r.top - r.height/2) * 0.3);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileTap={{ scale: 0.96 }}
    >{children}</motion.button>
  );
}

function Chip({ emoji, label, style }) {
  return (
    <div style={{ position:"absolute", pointerEvents:"none", userSelect:"none", ...style }}>
      <div style={{
        background:"linear-gradient(135deg, rgba(28,18,10,0.96), rgba(40,26,12,0.92))",
        border:"1px solid rgba(255,160,80,0.18)",
        borderRadius:16, padding:"10px 16px",
        display:"flex", alignItems:"center", gap:8,
        boxShadow:"0 12px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)",
        backdropFilter:"blur(20px)",
      }}>
        <span style={{ fontSize:20, lineHeight:1 }}>{emoji}</span>
        <div>
          <div style={{ fontSize:11, fontWeight:600, color:"rgba(255,200,130,0.9)", fontFamily:"Satoshi,sans-serif", whiteSpace:"nowrap" }}>{label}</div>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", fontFamily:"Satoshi,sans-serif" }}>Nearby · Open</div>
        </div>
        <div style={{ width:6, height:6, borderRadius:"50%", background:"#20BF6B", boxShadow:"0 0 8px #20BF6B55", marginLeft:2 }} />
      </div>
    </div>
  );
}

function CrowdBar({ value, accent }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const color = value > 70 ? "#FC5C65" : value > 45 ? "#F7B731" : "#20BF6B";
  const label = value > 70 ? "Packed" : value > 45 ? "Moderate" : "Calm";
  return (
    <div ref={ref}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
        <span style={{ fontSize:10, color:"rgba(255,255,255,0.3)", fontFamily:"Satoshi,sans-serif", letterSpacing:"0.08em", textTransform:"uppercase", fontWeight:600 }}>Crowd</span>
        <span style={{ fontSize:10, fontWeight:700, color, fontFamily:"Satoshi,sans-serif" }}>{label} · {value}%</span>
      </div>
      <div style={{ height:3, borderRadius:99, background:"rgba(255,255,255,0.06)", overflow:"hidden" }}>
        <motion.div
          initial={{ width:0 }}
          animate={inView ? { width:`${value}%` } : {}}
          transition={{ duration:1, delay:0.2, ease:[0.16,1,0.3,1] }}
          style={{ height:"100%", borderRadius:99, background:`linear-gradient(90deg, ${color}66, ${color})` }}
        />
      </div>
    </div>
  );
}

function ShopCard({ s, i }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [hov, setHov] = useState(false);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-100,100], [6,-6]), { stiffness:300, damping:30 });
  const ry = useSpring(useTransform(mx, [-100,100], [-6,6]), { stiffness:300, damping:30 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity:0, y:50 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ delay:i*0.08, duration:0.65, ease:[0.16,1,0.3,1] }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => { setHov(false); mx.set(0); my.set(0); }}
      onMouseMove={e => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set(e.clientX - r.left - r.width/2);
        my.set(e.clientY - r.top - r.height/2);
      }}
      style={{
        rotateX:rx, rotateY:ry,
        transformStyle:"preserve-3d", perspective:1000,
        borderRadius:24, overflow:"hidden", cursor:"pointer", position:"relative",
        background:`linear-gradient(145deg, #181210, #0f0c09)`,
        boxShadow: hov
          ? `0 32px 64px rgba(0,0,0,0.55), 0 0 0 1px ${s.accent}44, 0 0 60px ${s.accent}18`
          : "0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.05)",
        transition:"box-shadow 0.3s ease",
      }}
    >
      {/* top line */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg, transparent, ${s.accent}88, transparent)` }} />
      {/* ambient glow */}
      <div style={{ position:"absolute", top:-50, right:-50, width:200, height:200, borderRadius:"50%", background:`radial-gradient(circle, ${s.accent}14, transparent 70%)`, pointerEvents:"none" }} />

      <div style={{ padding:"24px 22px" }}>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
          <div style={{ display:"flex", gap:12, alignItems:"center" }}>
            <motion.div
              animate={hov ? { scale:1.1, rotate:[0,-6,6,-3,0] } : { scale:1 }}
              transition={{ duration:0.4 }}
              style={{
                width:52, height:52, borderRadius:16, fontSize:26,
                background:`linear-gradient(135deg, ${s.accent}22, ${s.accent}08)`,
                border:`1px solid ${s.accent}30`,
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:`inset 0 1px 0 ${s.accent}20`,
              }}
            >{s.emoji}</motion.div>
            <div>
              <div style={{ fontFamily:"Clash Display,sans-serif", fontSize:14, fontWeight:600, color:"rgba(255,255,255,0.95)", lineHeight:1.3 }}>{s.name}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.38)", marginTop:2, fontFamily:"Satoshi,sans-serif" }}>{s.type}</div>
            </div>
          </div>
          <div style={{ fontSize:10, fontWeight:700, padding:"5px 10px", borderRadius:99, background:`${s.accent}18`, color:s.accent, border:`1px solid ${s.accent}28`, fontFamily:"Satoshi,sans-serif", whiteSpace:"nowrap" }}>{s.tag}</div>
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:18 }}>
          {[{icon:"💸",label:"Price",val:s.price},{icon:"📍",label:"Dist.",val:s.dist},{icon:"⭐",label:"Rating",val:`${s.rating}`}].map(st => (
            <div key={st.label} style={{ background:"rgba(255,255,255,0.03)", borderRadius:12, padding:"10px 6px", textAlign:"center", border:"1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ fontSize:16, marginBottom:4 }}>{st.icon}</div>
              <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.85)", fontFamily:"Satoshi,sans-serif" }}>{st.val}</div>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.28)", fontFamily:"Satoshi,sans-serif", marginTop:2 }}>{st.label}</div>
            </div>
          ))}
        </div>

        <CrowdBar value={s.crowd} accent={s.accent} />

        <motion.button
          whileHover={{ opacity:0.88 }}
          whileTap={{ scale:0.97 }}
          className="btn-shine"
          style={{
            width:"100%", marginTop:18, padding:"12px 0", borderRadius:14, border:"none",
            background:`linear-gradient(135deg, ${s.accent}, ${s.accent}88)`,
            color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer",
            fontFamily:"Satoshi,sans-serif", letterSpacing:"0.02em",
            boxShadow:`0 4px 24px ${s.accent}44`, position:"relative", overflow:"hidden",
          }}
        >View Shop & Reserve →</motion.button>
      </div>
    </motion.div>
  );
}

function SecHead({ eyebrow, html, sub }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} style={{ marginBottom:52 }}>
      <motion.div initial={{ opacity:0, x:-16 }} animate={inView ? { opacity:1, x:0 } : {}} transition={{ duration:0.5 }}
        style={{ display:"inline-flex", alignItems:"center", gap:8, fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:"#FF8C42", marginBottom:14, fontFamily:"Satoshi,sans-serif" }}>
        <div style={{ width:24, height:1, background:"linear-gradient(90deg, #FF8C42, transparent)" }} />
        {eyebrow}
      </motion.div>
      <motion.h2 initial={{ opacity:0, y:24 }} animate={inView ? { opacity:1, y:0 } : {}} transition={{ delay:0.1, duration:0.6, ease:[0.16,1,0.3,1] }}
        style={{ fontFamily:"Clash Display,sans-serif", fontSize:"clamp(28px,3.5vw,42px)", fontWeight:700, lineHeight:1.1, color:"rgba(255,255,255,0.95)", marginBottom:14 }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {sub && (
        <motion.p initial={{ opacity:0 }} animate={inView ? { opacity:1 } : {}} transition={{ delay:0.2 }}
          style={{ fontSize:15, color:"rgba(255,255,255,0.4)", lineHeight:1.7, fontFamily:"Satoshi,sans-serif", maxWidth:480 }}>
          {sub}
        </motion.p>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function FoodFinder() {
  const [budget, setBudget] = useState(150);
  const [loc, setLoc] = useState("");
  const [activeCat, setActiveCat] = useState(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset:["start start","end start"] });
  const heroY = useTransform(scrollYProgress, [0,1], [0,100]);
  const heroOp = useTransform(scrollYProgress, [0,0.65], [1,0]);
  const pct = Math.round(((budget - 20) / 480) * 100);

  return (
    <div style={{ minHeight:"100vh", background:"#080604", color:"#fff", overflowX:"hidden", fontFamily:"Satoshi,sans-serif" }}>
      <GlobalStyles />

      {/* NAV */}
      <motion.nav initial={{ y:-72, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}
        style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 clamp(20px,5vw,60px)", height:68, background:"rgba(8,6,4,0.75)", backdropFilter:"blur(24px)", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:12, background:"linear-gradient(135deg, #FF5722, #FF8C42)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:"0 4px 18px rgba(255,87,34,0.45)" }}>🍴</div>
          <span style={{ fontFamily:"Clash Display,sans-serif", fontSize:18, fontWeight:700 }}>Food<span style={{ color:"#FF8C42" }}>Finder</span></span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:32 }}>
          {["Discover","How It Works","Categories","About"].map(l => (
            <a key={l} href="#" style={{ fontSize:13, color:"rgba(255,255,255,0.42)", textDecoration:"none", fontWeight:500, transition:"color 0.2s" }}
              onMouseEnter={e=>e.target.style.color="rgba(255,255,255,0.9)"}
              onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.42)"}>{l}</a>
          ))}
        </div>
        <MagBtn className="btn-shine"
          style={{ padding:"10px 22px", borderRadius:12, border:"none", cursor:"pointer", background:"linear-gradient(135deg, #FF5722, #FF8C42)", color:"#fff", fontSize:13, fontWeight:700, fontFamily:"Satoshi,sans-serif", boxShadow:"0 4px 20px rgba(255,87,34,0.4)" }}>
          Get Started →
        </MagBtn>
      </motion.nav>

      {/* HERO */}
      <section ref={heroRef} style={{ position:"relative", minHeight:"100vh", display:"flex", alignItems:"center", overflow:"hidden", paddingTop:68 }}>
        {/* BG layers */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 100% 80% at 50% -10%, rgba(255,87,34,0.14) 0%, transparent 65%)" }} />
          <div style={{ position:"absolute", top:"25%", left:"55%", width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle, rgba(255,140,66,0.07), transparent 70%)", filter:"blur(50px)" }} />
          <div style={{ position:"absolute", top:"60%", left:"70%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, rgba(255,209,102,0.06), transparent 70%)", filter:"blur(40px)" }} />
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:280, background:"linear-gradient(to top, #080604, transparent)" }} />
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.035 }}>
            <defs><pattern id="grid" width="70" height="70" patternUnits="userSpaceOnUse"><path d="M 70 0 L 0 0 0 70" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>
          </svg>
        </div>

        {/* Floating chips */}
        <Chip emoji="🍛" label="Sharma Ji Ka Dhaba" style={{ right:"17%", top:"17%", animation:"float-a 4.2s ease-in-out infinite 0s" }} />
        <Chip emoji="☕" label="Green Bowl Café" style={{ right:"12%", top:"50%", animation:"float-b 5s ease-in-out infinite 0.5s" }} />
        <Chip emoji="🌮" label="Chaat Corner" style={{ right:"22%", top:"34%", animation:"float-c 3.8s ease-in-out infinite 1s" }} />
        <Chip emoji="🍜" label="Noodle Nook" style={{ left:"3%", top:"26%", animation:"float-d 4.6s ease-in-out infinite 0.3s" }} />
        <Chip emoji="🍕" label="Slice Society" style={{ left:"2%", top:"63%", animation:"float-e 5.2s ease-in-out infinite 0.8s" }} />

        <motion.div style={{ y:heroY, opacity:heroOp, position:"relative", zIndex:2, width:"100%", maxWidth:680, padding:"0 clamp(20px,5vw,60px)", paddingBottom:80 }}>

          {/* Live pill */}
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
            style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"8px 16px", borderRadius:99, marginBottom:28, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", backdropFilter:"blur(12px)" }}>
            <div style={{ position:"relative", width:8, height:8 }}>
              <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"#20BF6B", animation:"pulse-dot 1.8s ease-out infinite" }} />
              <div style={{ width:8, height:8, borderRadius:"50%", background:"#20BF6B", position:"relative" }} />
            </div>
            <span style={{ fontSize:12, color:"rgba(255,255,255,0.55)", fontWeight:500 }}>1,200+ food shops live across 50+ cities</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity:0, y:36 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3, duration:0.8, ease:[0.16,1,0.3,1] }}
            style={{ fontFamily:"Clash Display,sans-serif", fontSize:"clamp(44px,7vw,82px)", fontWeight:700, lineHeight:0.97, letterSpacing:"-0.025em", marginBottom:22 }}>
            Find the Best
            <br/>
            <span className="clip-text">Food Near You</span>
          </motion.h1>

          <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.44, duration:0.6 }}
            style={{ fontSize:17, color:"rgba(255,255,255,0.42)", lineHeight:1.7, maxWidth:470, marginBottom:40 }}>
            Discover local food shops matched to your exact budget — with live crowd levels, seating status, and real-time prices. No guesswork, just great food.
          </motion.p>

          {/* Search card */}
          <motion.div initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.56, duration:0.7, ease:[0.16,1,0.3,1] }}
            style={{
              borderRadius:28, padding:"28px 28px 24px",
              background:"linear-gradient(145deg, rgba(255,255,255,0.055), rgba(255,255,255,0.02))",
              border:"1px solid rgba(255,255,255,0.09)",
              backdropFilter:"blur(28px)",
              boxShadow:"0 28px 72px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)",
            }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:24 }}>
              {/* Location */}
              <div>
                <label style={{ display:"block", fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.38)", marginBottom:10 }}>📍 Your Location</label>
                <input type="text" placeholder="Hazratganj, Lucknow…" value={loc} onChange={e=>setLoc(e.target.value)}
                  style={{ width:"100%", padding:"13px 16px", borderRadius:14, border:"1px solid rgba(255,255,255,0.07)", background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.88)", fontSize:14, outline:"none", fontFamily:"Satoshi,sans-serif", transition:"border-color 0.2s" }}
                  onFocus={e=>e.target.style.borderColor="rgba(255,140,66,0.5)"}
                  onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.07)"}
                />
              </div>
              {/* Budget slider */}
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                  <label style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.38)" }}>💸 Max Budget</label>
                  <span style={{ fontSize:15, fontWeight:700, color:"#FF8C42" }}>₹{budget}</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:14 }}>
                  <span style={{ fontSize:11, color:"rgba(255,255,255,0.28)" }}>₹20</span>
                  <input type="range" min={20} max={500} step={10} value={budget} style={{ flex:1, "--v":`${pct}%` }} onChange={e=>setBudget(Number(e.target.value))} />
                  <span style={{ fontSize:11, color:"rgba(255,255,255,0.28)" }}>₹500</span>
                </div>
              </div>
            </div>

            <MagBtn className="btn-shine"
              style={{ width:"100%", padding:"15px 0", borderRadius:16, border:"none", cursor:"pointer", background:"linear-gradient(135deg, #FF5722, #FF8C42)", color:"#fff", fontSize:15, fontWeight:700, fontFamily:"Satoshi,sans-serif", letterSpacing:"0.02em", boxShadow:"0 8px 36px rgba(255,87,34,0.5), inset 0 1px 0 rgba(255,255,255,0.18)" }}>
              🍽️ &nbsp;Discover Food Near Me
            </MagBtn>

            {/* Quick filters */}
            <div style={{ display:"flex", gap:8, marginTop:16, flexWrap:"wrap" }}>
              {["Under ₹100","Open Now","Seating Available","Veg Only"].map(f => (
                <div key={f}
                  style={{ fontSize:11, padding:"6px 13px", borderRadius:99, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.42)", cursor:"pointer", fontWeight:500, transition:"all 0.2s" }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor="rgba(255,140,66,0.4)"; e.currentTarget.style.color="rgba(255,200,100,0.9)"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.color="rgba(255,255,255,0.42)"; }}
                >{f}</div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* TICKER */}
      <div style={{ borderTop:"1px solid rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.05)", padding:"13px 0", overflow:"hidden", background:"rgba(255,255,255,0.015)", position:"relative" }}>
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:80, background:"linear-gradient(90deg, #080604, transparent)", zIndex:2, pointerEvents:"none" }} />
        <div style={{ position:"absolute", right:0, top:0, bottom:0, width:80, background:"linear-gradient(-90deg, #080604, transparent)", zIndex:2, pointerEvents:"none" }} />
        <div className="marquee-inner">
          {[...TICKER,...TICKER].map((t,i) => (
            <span key={i} style={{ marginRight:48, fontSize:12, color:"rgba(255,255,255,0.38)", fontWeight:500, whiteSpace:"nowrap" }}>
              {t}&nbsp;<span style={{ color:"rgba(255,140,66,0.4)" }}>•</span>
            </span>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section style={{ padding:"100px clamp(20px,5vw,60px)", maxWidth:1120, margin:"0 auto" }}>
        <SecHead eyebrow="The Process" html='Three Steps to Your<br/><span class="clip-text">Perfect Meal</span>' sub="From budget to table in under a minute." />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, position:"relative" }}>
          <div style={{ position:"absolute", top:44, left:"17%", right:"17%", height:1, background:"linear-gradient(90deg, transparent, rgba(255,140,66,0.5) 30%, rgba(255,209,102,0.7) 50%, rgba(255,140,66,0.5) 70%, transparent)", pointerEvents:"none" }} />
          {[
            { n:"01", t:"Set Your Budget", d:"Drag the slider to your comfort zone — from ₹30 street snacks to ₹500 full spreads. No hidden fees.", e:"💰", c:"#FF5722" },
            { n:"02", t:"Discover Nearby", d:"We instantly surface local joints sorted by value, rating, and open status within your chosen radius.", e:"🗺️", c:"#FF8C42" },
            { n:"03", t:"Check Live Status", d:"See real-time crowd %, available seating, and estimated wait times before you even leave home.", e:"🪑", c:"#FFD166" },
          ].map((step, i) => (
            <motion.div key={step.n}
              initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ delay:i*0.12, duration:0.6, ease:[0.16,1,0.3,1] }}
              whileHover={{ y:-8 }}
              style={{ borderRadius:24, padding:"32px 26px 28px", position:"relative", background:"linear-gradient(145deg, #131009, #0f0c09)", border:"1px solid rgba(255,255,255,0.06)", boxShadow:"0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)", overflow:"hidden" }}
            >
              <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, transparent, ${step.c}88, transparent)` }} />
              <div style={{ position:"absolute", top:-40, right:-40, width:130, height:130, borderRadius:"50%", background:`radial-gradient(circle, ${step.c}15, transparent 70%)`, pointerEvents:"none" }} />
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
                <div style={{ fontSize:11, fontWeight:800, letterSpacing:"0.08em", padding:"5px 10px", borderRadius:8, background:`${step.c}18`, color:step.c, border:`1px solid ${step.c}2e`, fontFamily:"Satoshi,sans-serif" }}>{step.n}</div>
                <span style={{ fontSize:34 }}>{step.e}</span>
              </div>
              <h3 style={{ fontFamily:"Clash Display,sans-serif", fontSize:18, fontWeight:600, color:"rgba(255,255,255,0.92)", marginBottom:10 }}>{step.t}</h3>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.38)", lineHeight:1.75, fontFamily:"Satoshi,sans-serif" }}>{step.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SHOP CARDS */}
      <section style={{ padding:"0 clamp(20px,5vw,60px) 100px", maxWidth:1120, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:0 }}>
          <SecHead eyebrow="Live Near You" html='Popular Nearby<br/><span class="clip-text">Food Shops</span>' />
          <motion.a href="#" whileHover={{ x:4 }} style={{ fontSize:13, fontWeight:600, color:"#FF8C42", textDecoration:"none", display:"flex", alignItems:"center", gap:4, marginBottom:52 }}>
            View all 120+ shops →
          </motion.a>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 }}>
          {SHOPS.map((s,i) => <ShopCard key={s.id} s={s} i={i} />)}
        </div>
      </section>

      {/* BUDGET SUGGESTIONS */}
      <section style={{ padding:"0 clamp(20px,5vw,60px) 100px", maxWidth:1120, margin:"0 auto" }}>
        <SecHead eyebrow="Smart Picks" html='Budget-Smart<br/><span class="clip-text">Suggestions</span>' sub="The best food for your budget, curated daily by our local food scouts." />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
          {BUDGET_CARDS.map((b,i) => (
            <motion.div key={b.budget}
              initial={{ opacity:0, scale:0.9 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
              transition={{ delay:i*0.08, duration:0.5, ease:[0.16,1,0.3,1] }}
              whileHover={{ y:-10, scale:1.04 }}
              style={{ borderRadius:24, padding:"28px 22px 24px", cursor:"pointer", position:"relative", overflow:"hidden", background:"linear-gradient(145deg, #131009, #0f0c09)", border:"1px solid rgba(255,255,255,0.06)", boxShadow:"0 8px 32px rgba(0,0,0,0.3)" }}
            >
              <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, background:`radial-gradient(ellipse at top left, ${b.color}12, transparent 70%)`, pointerEvents:"none" }} />
              <div style={{ fontSize:40, marginBottom:18 }}>{b.emoji}</div>
              <div style={{ fontFamily:"Clash Display,sans-serif", fontSize:22, fontWeight:700, color:"rgba(255,255,255,0.95)", marginBottom:7 }}>{b.budget}</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.38)", marginBottom:20, lineHeight:1.6 }}>{b.desc}</div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ fontSize:10, fontWeight:700, padding:"4px 10px", borderRadius:99, background:`${b.color}1e`, color:b.color, border:`1px solid ${b.color}2c`, fontFamily:"Satoshi,sans-serif" }}>{b.shops} shops</div>
                <motion.span whileHover={{ x:4 }} style={{ fontSize:18, color:b.color, cursor:"pointer" }}>→</motion.span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding:"0 clamp(20px,5vw,60px) 100px", maxWidth:1120, margin:"0 auto" }}>
        <SecHead eyebrow="Browse" html='Explore by<br/><span class="clip-text">Food Category</span>' />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(8,1fr)", gap:12 }}>
          {CATS.map((c,i) => (
            <motion.button key={c.l}
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ delay:i*0.05, duration:0.45 }}
              whileHover={{ y:-7, scale:1.07 }} whileTap={{ scale:0.94 }}
              onClick={() => setActiveCat(activeCat===c.l ? null : c.l)}
              style={{
                borderRadius:20, padding:"18px 8px 16px", textAlign:"center", cursor:"pointer", border:"none",
                background: activeCat===c.l ? "linear-gradient(135deg, rgba(255,140,66,0.18), rgba(255,87,34,0.09))" : "linear-gradient(145deg, #131009, #0f0c09)",
                boxShadow: activeCat===c.l ? "0 0 26px rgba(255,140,66,0.22), 0 0 0 1px rgba(255,140,66,0.42)" : "0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.05)",
                transition:"all 0.25s ease",
              }}>
              <div style={{ fontSize:28, marginBottom:8 }}>{c.e}</div>
              <div style={{ fontSize:10, fontWeight:600, color:activeCat===c.l ? "#FF8C42" : "rgba(255,255,255,0.55)", lineHeight:1.3, fontFamily:"Satoshi,sans-serif" }}>{c.l}</div>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.22)", marginTop:4, fontFamily:"Satoshi,sans-serif" }}>{c.c}</div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ padding:"0 clamp(20px,5vw,60px) 100px", maxWidth:1120, margin:"0 auto" }}>
        <motion.div initial={{ opacity:0, y:32 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}
          style={{ borderRadius:32, padding:"60px clamp(28px,5vw,64px)", position:"relative", overflow:"hidden", background:"linear-gradient(135deg, #1a0800, #2e1300 40%, #1a0800)", border:"1px solid rgba(255,140,66,0.18)", boxShadow:"0 28px 80px rgba(255,87,34,0.14)" }}>
          <div style={{ position:"absolute", top:-80, left:"25%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(255,87,34,0.16), transparent 70%)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", bottom:-60, right:"5%", width:350, height:350, borderRadius:"50%", background:"radial-gradient(circle, rgba(255,209,102,0.1), transparent 70%)", pointerEvents:"none" }} />
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.06, pointerEvents:"none" }}>
            <defs><pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="white"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#dots)"/>
          </svg>
          <div style={{ position:"relative", zIndex:2, display:"flex", alignItems:"center", justifyContent:"space-between", gap:32, flexWrap:"wrap" }}>
            <div>
              <div style={{ fontFamily:"Clash Display,sans-serif", fontSize:"clamp(26px,3.5vw,40px)", fontWeight:700, lineHeight:1.1, marginBottom:14 }}>
                Hungry right now? 🍽️<br/>
                <span className="clip-text">Your next meal is 15 min away.</span>
              </div>
              <p style={{ fontSize:15, color:"rgba(255,255,255,0.42)", lineHeight:1.7, maxWidth:420 }}>Real food, real prices, real crowds — no guesswork. Open the app and start eating.</p>
            </div>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <MagBtn className="btn-shine"
                style={{ padding:"14px 28px", borderRadius:16, border:"none", background:"linear-gradient(135deg, #FF5722, #FF8C42)", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"Satoshi,sans-serif", boxShadow:"0 8px 32px rgba(255,87,34,0.5)" }}>
                📱 Download App
              </MagBtn>
              <MagBtn
                style={{ padding:"14px 28px", borderRadius:16, border:"1px solid rgba(255,140,66,0.28)", background:"rgba(255,140,66,0.06)", color:"rgba(255,200,130,0.88)", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"Satoshi,sans-serif" }}>
                Open Web App
              </MagBtn>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:"1px solid rgba(255,255,255,0.05)", padding:"64px clamp(20px,5vw,60px) 40px", background:"#050403" }}>
        <div style={{ maxWidth:1120, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:40, marginBottom:56 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                <div style={{ width:38, height:38, borderRadius:12, background:"linear-gradient(135deg, #FF5722, #FF8C42)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, boxShadow:"0 4px 18px rgba(255,87,34,0.42)" }}>🍴</div>
                <span style={{ fontFamily:"Clash Display,sans-serif", fontSize:18, fontWeight:700 }}>Food<span style={{ color:"#FF8C42" }}>Finder</span></span>
              </div>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.32)", lineHeight:1.8, maxWidth:240 }}>Connecting food lovers with the best local eateries, matched to your budget and real-time conditions.</p>
              <div style={{ display:"flex", gap:10, marginTop:20 }}>
                {["𝕏","f","in","▶"].map(icon => (
                  <motion.a key={icon} href="#" whileHover={{ y:-3, scale:1.1 }}
                    style={{ width:36, height:36, borderRadius:10, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(255,255,255,0.38)", fontSize:12, textDecoration:"none", transition:"color 0.2s" }}
                    onMouseEnter={e=>e.currentTarget.style.color="rgba(255,140,66,0.9)"}
                    onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.38)"}
                  >{icon}</motion.a>
                ))}
              </div>
            </div>
            {[
              { title:"Explore", links:["Nearby Shops","Budget Picks","Top Rated","New Arrivals","Trending Today"] },
              { title:"Company", links:["About Us","Blog","Careers","Press Kit","Partners"] },
              { title:"Support", links:["Help Center","Contact Us","Privacy Policy","Terms","Refund Policy"] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontFamily:"Clash Display,sans-serif", fontSize:14, fontWeight:600, color:"rgba(255,255,255,0.75)", marginBottom:18 }}>{col.title}</h4>
                {col.links.map(l => (
                  <div key={l} style={{ marginBottom:12 }}>
                    <a href="#" style={{ fontSize:13, color:"rgba(255,255,255,0.32)", textDecoration:"none", transition:"color 0.2s" }}
                      onMouseEnter={e=>e.target.style.color="rgba(255,140,66,0.82)"}
                      onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.32)"}
                    >{l}</a>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ paddingTop:24, borderTop:"1px solid rgba(255,255,255,0.05)", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
            <span style={{ fontSize:12, color:"rgba(255,255,255,0.2)" }}>© 2025 FoodFinder Technologies Pvt. Ltd. All rights reserved.</span>
            <span style={{ fontSize:12, color:"rgba(255,255,255,0.2)" }}>Made with ❤️ for food lovers across India</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
