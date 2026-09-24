import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom"

/* ═══════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════ */
const GS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@300;400;500;600;700;800;900&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,400&display=swap');

    :root {
      --bg:       #0C0A07;
      --bg2:      #131008;
      --bg3:      #1A1510;
      --panel:    rgba(26,21,16,0.85);
      --border:   rgba(255,200,100,0.08);
      --orange:   #F4631E;
      --amber:    #F59E0B;
      --gold:     #FFD166;
      --cream:    #FFF8EE;
      --green:    #22C55E;
      --red:      #EF4444;
      --blue:     #3B82F6;
      --t1:       rgba(255,248,238,0.95);
      --t2:       rgba(255,200,140,0.6);
      --t3:       rgba(255,180,100,0.35);
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { font-size: 16px; }
    body { background: var(--bg); font-family: 'Cabinet Grotesk', sans-serif; color: var(--t1); overflow-x: hidden; }

    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: rgba(244,99,30,0.4); border-radius: 99px; }

    /* noise overlay */
    body::before {
      content: '';
      position: fixed; inset: 0; z-index: 0; pointer-events: none;
      opacity: 0.028;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    }

    /* glass panel */
    .glass {
      background: var(--panel);
      border: 1px solid var(--border);
      backdrop-filter: blur(20px) saturate(160%);
      -webkit-backdrop-filter: blur(20px) saturate(160%);
    }

    /* range input */
    input[type=range].ff-range {
      -webkit-appearance: none;
      width: 100%; height: 3px; border-radius: 99px; outline: none; cursor: pointer;
      background: linear-gradient(to right, var(--orange) 0%, var(--orange) var(--v,30%), rgba(255,200,100,0.15) var(--v,30%));
    }
    input[type=range].ff-range::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 18px; height: 18px; border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #FF8C42, var(--orange));
      border: 2.5px solid #fff;
      box-shadow: 0 0 10px rgba(244,99,30,0.55);
      cursor: pointer;
    }

    /* search input */
    .ff-search {
      width: 100%; padding: 0 16px 0 40px; height: 40px;
      border-radius: 12px; border: 1px solid rgba(255,200,100,0.1);
      background: rgba(255,255,255,0.04);
      color: var(--t1); font-size: 13px; font-family: 'Cabinet Grotesk', sans-serif;
      outline: none; transition: all 0.25s;
    }
    .ff-search::placeholder { color: var(--t3); }
    .ff-search:focus { border-color: rgba(244,99,30,0.4); background: rgba(255,255,255,0.06); box-shadow: 0 0 0 3px rgba(244,99,30,0.1); }

    /* shimmer button */
    .btn-find {
      position: relative; overflow: hidden;
      padding: 13px 28px; border-radius: 14px; border: none; cursor: pointer;
      background: linear-gradient(135deg, var(--orange), #FF8C42);
      color: #fff; font-size: 14px; font-weight: 700; font-family: 'Cabinet Grotesk', sans-serif;
      box-shadow: 0 8px 28px rgba(244,99,30,0.4), inset 0 1px 0 rgba(255,255,255,0.2);
      transition: transform 0.2s, box-shadow 0.2s;
      white-space: nowrap;
    }
    .btn-find:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(244,99,30,0.5); }
    .btn-find:active { transform: scale(0.97); }
    .btn-find::after {
      content: ''; position: absolute;
      top: -50%; left: -100%; width: 50%; height: 200%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transform: skewX(-20deg);
      animation: shimmer 3s ease-in-out infinite 1s;
    }

    @keyframes shimmer { 0%{left:-100%} 100%{left:200%} }
    @keyframes pulse-dot { 0%,100%{transform:scale(1);opacity:0.8} 50%{transform:scale(1.6);opacity:0} }
    @keyframes float-card { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes bar-grow { from{width:0} to{width:var(--w,60%)} }

    /* crowd level colors */
    .crowd-calm   { background: #22C55E; }
    .crowd-mod    { background: #F59E0B; }
    .crowd-busy   { background: #EF4444; }

    /* card hover glow */
    .card-glow:hover { box-shadow: 0 20px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(244,99,30,0.25) !important; }

    /* tooltip */
    .tooltip { position: relative; }
    .tooltip-text {
      display: none; position: absolute; bottom: 120%; left: 50%;
      transform: translateX(-50%);
      background: rgba(26,21,16,0.95); border: 1px solid rgba(255,200,100,0.15);
      padding: 5px 10px; border-radius: 8px; font-size: 11px; white-space: nowrap; z-index: 99;
    }
    .tooltip:hover .tooltip-text { display: block; }
  `}</style>
);

/* ═══════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════ */
const SHOPS = [
  { id:1, name:"Sharma Ji Ka Dhaba",  type:"North Indian", price:"₹80–150", dist:"0.3 km", crowd:72, rating:4.8, reviews:312, seats:8,  emoji:"🍛", accent:"#F4631E", open:true  },
  { id:2, name:"Chaat Corner",         type:"Street Food",  price:"₹30–80",  dist:"0.5 km", crowd:38, rating:4.5, reviews:198, seats:0,  emoji:"🥙", accent:"#F59E0B", open:true  },
  { id:3, name:"Green Bowl Café",      type:"Café & Salads", price:"₹120–250",dist:"1.1 km", crowd:25, rating:4.9, reviews:445, seats:14, emoji:"🥗", accent:"#22C55E", open:true  },
  { id:4, name:"Biryani Bros",         type:"Biryani House", price:"₹100–200",dist:"0.8 km", crowd:88, rating:4.6, reviews:627, seats:3,  emoji:"🍚", accent:"#EF4444", open:true  },
  { id:5, name:"The Pav Studio",       type:"Mumbai Street", price:"₹40–90",  dist:"0.4 km", crowd:52, rating:4.4, reviews:284, seats:6,  emoji:"🌮", accent:"#A78BFA", open:false },
  { id:6, name:"Noodle Nook",          type:"Asian Fusion",  price:"₹90–180", dist:"1.4 km", crowd:30, rating:4.7, reviews:371, seats:10, emoji:"🍜", accent:"#06B6D4", open:true  },
];

const BUDGET_CARDS = [
  { label:"Under ₹100", desc:"Street snacks & quick bites",   shops:18, topPick:"Chaat Corner",  rating:4.5, dist:"0.5 km", emoji:"🥙", color:"#F59E0B" },
  { label:"Under ₹200", desc:"Filling meals & local favourites", shops:34, topPick:"Biryani Bros", rating:4.6, dist:"0.8 km", emoji:"🍚", color:"#F4631E" },
  { label:"Under ₹500", desc:"Café plates & dining experiences", shops:21, topPick:"Green Bowl Café",rating:4.9, dist:"1.1 km", emoji:"🥗", color:"#22C55E" },
];

const CATEGORIES = [
  { l:"Street Food", e:"🌯", c:34, color:"#F59E0B" },
  { l:"Fast Food",   e:"🍔", c:22, color:"#F4631E" },
  { l:"Café",        e:"☕", c:18, color:"#06B6D4" },
  { l:"Vegetarian",  e:"🥦", c:29, color:"#22C55E" },
  { l:"Non-Veg",     e:"🍗", c:25, color:"#EF4444" },
  { l:"Desserts",    e:"🍮", c:16, color:"#A78BFA" },
];

const SPENDING = [
  { label:"Mon", val:120 },
  { label:"Tue", val:85  },
  { label:"Wed", val:210 },
  { label:"Thu", val:160 },
  { label:"Fri", val:340 },
  { label:"Sat", val:290 },
  { label:"Sun", val:175 },
];

const MAP_PINS = [
  { x:22,  y:35,  name:"Sharma Ji Ka Dhaba", emoji:"🍛", crowd:72  },
  { x:48,  y:55,  name:"Chaat Corner",         emoji:"🥙", crowd:38  },
  { x:68,  y:28,  name:"Green Bowl Café",       emoji:"🥗", crowd:25  },
  { x:35,  y:70,  name:"Biryani Bros",          emoji:"🍚", crowd:88  },
  { x:72,  y:65,  name:"Noodle Nook",           emoji:"🍜", crowd:30  },
  { x:55,  y:42,  name:"The Pav Studio",        emoji:"🌮", crowd:52  },
];

/* ═══════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════ */
function crowdColor(v) { return v >= 70 ? "#EF4444" : v >= 45 ? "#F59E0B" : "#22C55E"; }
function crowdLabel(v) { return v >= 70 ? "Packed" : v >= 45 ? "Moderate" : "Calm"; }

function CrowdBar({ val }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const color = crowdColor(val);
  return (
    <div ref={ref}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
        <span style={{ fontSize:10, color:"rgba(255,200,130,0.45)", textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:600 }}>Crowd</span>
        <span style={{ fontSize:10, fontWeight:700, color }}>{crowdLabel(val)}</span>
      </div>
      <div style={{ height:3, borderRadius:99, background:"rgba(255,255,255,0.07)", overflow:"hidden" }}>
        <motion.div
          initial={{ width:0 }}
          animate={inView ? { width:`${val}%` } : {}}
          transition={{ duration:0.9, ease:[0.16,1,0.3,1], delay:0.15 }}
          style={{ height:"100%", borderRadius:99, background:`linear-gradient(90deg, ${color}80, ${color})` }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   NAV BAR
═══════════════════════════════════════════════════════════ */
function NavBar({ budget, setBudget, activeTab, setActiveTab }) {
  const [search, setSearch] = useState("");
  const [loc, setLoc] = useState("Hazratganj, Lucknow");

  return (
    <motion.header
      initial={{ y:-64, opacity:0 }}
      animate={{ y:0, opacity:1 }}
      transition={{ duration:0.6, ease:[0.16,1,0.3,1] }}
      style={{
        position:"sticky", top:0, zIndex:50,
        display:"flex", alignItems:"center", gap:16,
        padding:"0 24px", height:64,
        background:"rgba(12,10,7,0.8)",
        backdropFilter:"blur(24px)",
        borderBottom:"1px solid rgba(255,200,100,0.07)",
        boxShadow:"0 1px 0 rgba(255,200,100,0.05)",
      }}
    >
      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
        <div style={{ width:34, height:34, borderRadius:10, background:"linear-gradient(135deg,#F4631E,#FF8C42)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, boxShadow:"0 4px 14px rgba(244,99,30,0.4)" }}>🍴</div>
        <span style={{ fontFamily:"'Fraunces', serif", fontSize:18, fontWeight:700, color:"rgba(255,248,238,0.95)" }}>
          Food<span style={{ color:"#F4631E" }}>Finder</span>
        </span>
      </div>

      {/* Nav tabs */}
      <div style={{ display:"flex", alignItems:"center", gap:4, marginLeft:8 }}>
        {["Dashboard","Explore","Saved","Orders"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{
              padding:"6px 14px", borderRadius:10, border:"none", cursor:"pointer",
              fontFamily:"'Cabinet Grotesk', sans-serif", fontSize:13, fontWeight:600,
              background: activeTab===t ? "rgba(244,99,30,0.15)" : "transparent",
              color: activeTab===t ? "#F4631E" : "rgba(255,200,140,0.45)",
              transition:"all 0.2s",
              boxShadow: activeTab===t ? "0 0 0 1px rgba(244,99,30,0.3)" : "none",
            }}
            onMouseEnter={e => { if(activeTab!==t) e.currentTarget.style.color="rgba(255,200,140,0.75)"; }}
            onMouseLeave={e => { if(activeTab!==t) e.currentTarget.style.color="rgba(255,200,140,0.45)"; }}
          >{t}</button>
        ))}
      </div>

      {/* Search */}
      <div style={{ flex:1, maxWidth:340, position:"relative" }}>
        <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:14, opacity:0.4 }}>🔍</span>
        <input className="ff-search" placeholder="Search food or shops…" value={search} onChange={e=>setSearch(e.target.value)} />
      </div>

      <div style={{ flex:1 }} />

      {/* Location */}
      <div style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:10, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,200,100,0.08)", cursor:"pointer", flexShrink:0 }}>
        <span style={{ fontSize:13 }}>📍</span>
        <span style={{ fontSize:12, fontWeight:600, color:"rgba(255,200,140,0.7)", maxWidth:120, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{loc}</span>
        <span style={{ fontSize:10, color:"rgba(255,200,140,0.35)" }}>▾</span>
      </div>

      {/* Notifications */}
      <div style={{ position:"relative", cursor:"pointer" }}>
        <div style={{ width:36, height:36, borderRadius:10, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,200,100,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🔔</div>
        <div style={{ position:"absolute", top:6, right:6, width:7, height:7, borderRadius:"50%", background:"#F4631E", boxShadow:"0 0 0 2px #0C0A07" }} />
      </div>

      {/* Avatar */}
      <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#F4631E,#F59E0B)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:700, color:"#fff", cursor:"pointer", boxShadow:"0 3px 12px rgba(244,99,30,0.35)", flexShrink:0 }}>A</div>
    </motion.header>
  );
}

/* ═══════════════════════════════════════════════════════════
   WELCOME SECTION
═══════════════════════════════════════════════════════════ */
function WelcomeSection({ budget, setBudget }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const pct = Math.round(((budget - 20) / 480) * 100);

  return (
    <motion.div
      initial={{ opacity:0, y:24 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay:0.1, duration:0.6, ease:[0.16,1,0.3,1] }}
      style={{
        borderRadius:24, padding:"28px 32px",
        background:"linear-gradient(135deg, rgba(30,22,12,0.9) 0%, rgba(40,28,16,0.85) 100%)",
        border:"1px solid rgba(255,200,100,0.1)",
        boxShadow:"0 16px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
        position:"relative", overflow:"hidden",
      }}
    >
      {/* background decoration */}
      <div style={{ position:"absolute", top:-60, right:-60, width:260, height:260, borderRadius:"50%", background:"radial-gradient(circle, rgba(244,99,30,0.1), transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:-40, left:"40%", width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle, rgba(245,158,11,0.07), transparent 70%)", pointerEvents:"none" }} />
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.04, pointerEvents:"none" }}>
        <defs><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
      </svg>

      <div style={{ position:"relative", zIndex:2, display:"flex", alignItems:"center", justifyContent:"space-between", gap:24, flexWrap:"wrap" }}>
        <div>
          {/* live indicator */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"5px 12px", borderRadius:99, background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.2)", marginBottom:14 }}>
            <div style={{ position:"relative", width:7, height:7 }}>
              <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"#22C55E", animation:"pulse-dot 1.8s ease-out infinite" }} />
              <div style={{ width:7, height:7, borderRadius:"50%", background:"#22C55E" }} />
            </div>
            <span style={{ fontSize:11, color:"#22C55E", fontWeight:600 }}>342 shops open nearby</span>
          </div>

          <h1 style={{ fontFamily:"'Fraunces', serif", fontSize:"clamp(22px,3vw,32px)", fontWeight:700, color:"rgba(255,248,238,0.96)", lineHeight:1.15, marginBottom:8 }}>
            {greeting}, Aryan! 👋
          </h1>
          <p style={{ fontSize:15, color:"rgba(255,200,140,0.55)", marginBottom:24 }}>
            Ready to find delicious food near you?
          </p>

          {/* Budget slider */}
          <div style={{ maxWidth:380 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
              <span style={{ fontSize:12, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"rgba(255,200,140,0.45)" }}>Your Budget</span>
              <span style={{ fontSize:16, fontWeight:800, color:"#F4631E", fontFamily:"'Fraunces', serif" }}>₹{budget}</span>
            </div>
            <input type="range" className="ff-range" min={20} max={500} step={5}
              value={budget} style={{ "--v":`${pct}%` }}
              onChange={e=>setBudget(Number(e.target.value))} />
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
              <span style={{ fontSize:10, color:"rgba(255,200,140,0.3)" }}>₹20</span>
              <span style={{ fontSize:10, color:"rgba(255,200,140,0.3)" }}>₹500</span>
            </div>
          </div>
        </div>

        {/* CTA + quick stats */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:16 }}>
          <button className="btn-find" style={{ fontSize:15, padding:"14px 32px", display:"flex", alignItems:"center", gap:8 }}>
            <span>🍽️</span> Find Food Near Me
          </button>
          <div style={{ display:"flex", gap:20 }}>
            {[
              { icon:"⚡", label:"Avg wait", val:"8 min" },
              { icon:"🏠", label:"Nearest", val:"0.3 km" },
              { icon:"🌟", label:"Top rated", val:"4.9 ★" },
            ].map(s => (
              <div key={s.label} style={{ textAlign:"center" }}>
                <div style={{ fontSize:16, marginBottom:2 }}>{s.icon}</div>
                <div style={{ fontSize:14, fontWeight:700, color:"rgba(255,248,238,0.9)" }}>{s.val}</div>
                <div style={{ fontSize:10, color:"rgba(255,200,140,0.4)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BUDGET SUGGESTION CARDS
═══════════════════════════════════════════════════════════ */
function BudgetCards() {
  return (
    <div>
      <SectionHeader icon="💡" title="Budget-Smart Suggestions" sub="Best picks matched to your wallet" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        {BUDGET_CARDS.map((b, i) => (
          <motion.div key={b.label}
            initial={{ opacity:0, y:30 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ delay:i*0.1, duration:0.55, ease:[0.16,1,0.3,1] }}
            whileHover={{ y:-8, scale:1.02 }}
            className="card-glow"
            style={{
              borderRadius:20, padding:"22px 20px 20px", cursor:"pointer", position:"relative", overflow:"hidden",
              background:"linear-gradient(145deg, rgba(26,21,16,0.95), rgba(20,16,10,0.9))",
              border:"1px solid rgba(255,200,100,0.08)",
              boxShadow:"0 8px 28px rgba(0,0,0,0.35)",
              transition:"box-shadow 0.3s ease",
            }}
          >
            {/* top accent */}
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, transparent, ${b.color}, transparent)` }} />
            {/* glow */}
            <div style={{ position:"absolute", top:-40, right:-40, width:140, height:140, borderRadius:"50%", background:`radial-gradient(circle, ${b.color}18, transparent 70%)`, pointerEvents:"none" }} />

            <div style={{ position:"relative", zIndex:2 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                <div style={{ fontSize:32 }}>{b.emoji}</div>
                <div style={{ fontSize:10, fontWeight:700, padding:"4px 9px", borderRadius:99, background:`${b.color}20`, color:b.color, border:`1px solid ${b.color}30` }}>{b.shops} shops</div>
              </div>
              <div style={{ fontFamily:"'Fraunces', serif", fontSize:20, fontWeight:700, color:"rgba(255,248,238,0.95)", marginBottom:4 }}>{b.label}</div>
              <div style={{ fontSize:12, color:"rgba(255,200,140,0.45)", marginBottom:16, lineHeight:1.5 }}>{b.desc}</div>

              {/* top pick */}
              <div style={{ padding:"10px 12px", borderRadius:12, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,200,100,0.07)" }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.07em", color:"rgba(255,200,140,0.4)", textTransform:"uppercase", marginBottom:5 }}>Top pick</div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:13, fontWeight:700, color:"rgba(255,248,238,0.9)" }}>{b.topPick}</span>
                  <span style={{ fontSize:11, color:"rgba(255,200,140,0.5)" }}>{b.dist}</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:3 }}>
                  <span style={{ fontSize:11 }}>⭐</span>
                  <span style={{ fontSize:11, fontWeight:700, color:"#F59E0B" }}>{b.rating}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOOD CATEGORIES
═══════════════════════════════════════════════════════════ */
function FoodCategories() {
  const [active, setActive] = useState(null);

  return (
    <div>
      <SectionHeader icon="🗂️" title="Food Categories" sub="Browse by what you're craving" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:12 }}>
        {CATEGORIES.map((c, i) => (
          <motion.button key={c.l}
            initial={{ opacity:0, scale:0.85 }}
            whileInView={{ opacity:1, scale:1 }}
            viewport={{ once:true }}
            transition={{ delay:i*0.07, duration:0.4, ease:[0.16,1,0.3,1] }}
            whileHover={{ y:-7, scale:1.07 }}
            whileTap={{ scale:0.94 }}
            onClick={() => setActive(active===c.l ? null : c.l)}
            style={{
              borderRadius:18, padding:"18px 8px 16px", cursor:"pointer", border:"none",
              background: active===c.l
                ? `linear-gradient(145deg, ${c.color}30, ${c.color}10)`
                : "linear-gradient(145deg, rgba(26,21,16,0.95), rgba(20,16,10,0.9))",
              boxShadow: active===c.l
                ? `0 0 0 1.5px ${c.color}60, 0 0 28px ${c.color}20`
                : "0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,200,100,0.06)",
              transition:"all 0.25s ease", textAlign:"center",
            }}
          >
            <motion.div
              animate={active===c.l ? { rotate:[0,-8,8,-5,0], scale:1.12 } : {}}
              transition={{ duration:0.4 }}
              style={{ fontSize:28, marginBottom:8 }}
            >{c.e}</motion.div>
            <div style={{ fontSize:11, fontWeight:700, color:active===c.l ? c.color : "rgba(255,200,140,0.65)", lineHeight:1.3 }}>{c.l}</div>
            <div style={{ fontSize:9, color:"rgba(255,200,140,0.3)", marginTop:3 }}>{c.c} shops</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SHOP CARD (3D tilt)
═══════════════════════════════════════════════════════════ */
function ShopCard({ s, i }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [hov, setHov] = useState(false);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rx = useSpring(useTransform(my,[-80,80],[6,-6]), { stiffness:260, damping:28 });
  const ry = useSpring(useTransform(mx,[-80,80],[-6,6]), { stiffness:260, damping:28 });

  return (
    <motion.div ref={ref}
      initial={{ opacity:0, y:40 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ delay:i*0.09, duration:0.6, ease:[0.16,1,0.3,1] }}
      onHoverStart={()=>setHov(true)}
      onHoverEnd={()=>{ setHov(false); mx.set(0); my.set(0); }}
      onMouseMove={e => {
        if(!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set(e.clientX - r.left - r.width/2);
        my.set(e.clientY - r.top - r.height/2);
      }}
      style={{
        rotateX:rx, rotateY:ry,
        transformStyle:"preserve-3d", perspective:900,
        borderRadius:20, overflow:"hidden", cursor:"pointer", position:"relative",
        background:"linear-gradient(145deg, #1A1510, #131008)",
        boxShadow: hov
          ? `0 28px 56px rgba(0,0,0,0.55), 0 0 0 1px ${s.accent}44, 0 0 48px ${s.accent}18`
          : "0 8px 28px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,200,100,0.06)",
        transition:"box-shadow 0.3s ease",
      }}
    >
      {/* top line */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:1.5, background:`linear-gradient(90deg, transparent, ${s.accent}99, transparent)` }} />
      {/* ambient glow */}
      <div style={{ position:"absolute", top:-50, right:-50, width:180, height:180, borderRadius:"50%", background:`radial-gradient(circle, ${s.accent}16, transparent 70%)`, pointerEvents:"none" }} />

      <div style={{ padding:"20px 18px" }}>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <motion.div
              animate={hov ? { scale:1.1, rotate:[-5,5,-3,0] } : {}}
              transition={{ duration:0.35 }}
              style={{ width:46, height:46, borderRadius:14, background:`${s.accent}1a`, border:`1px solid ${s.accent}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}
            >{s.emoji}</motion.div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,248,238,0.95)", lineHeight:1.3 }}>{s.name}</div>
              <div style={{ fontSize:11, color:"rgba(255,200,140,0.4)", marginTop:1 }}>{s.type}</div>
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
            <div style={{ fontSize:9, fontWeight:700, padding:"3px 9px", borderRadius:99, background: s.open ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.12)", color: s.open ? "#22C55E" : "#EF4444", border:`1px solid ${s.open ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.25)"}` }}>
              {s.open ? "● Open" : "● Closed"}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:7, marginBottom:14 }}>
          {[
            { icon:"💸", label:"Price",  val:s.price },
            { icon:"📍", label:"Dist.",  val:s.dist  },
            { icon:"⭐", label:"Rating", val:s.rating },
          ].map(st => (
            <div key={st.label} style={{ background:"rgba(255,255,255,0.03)", borderRadius:10, padding:"9px 6px", textAlign:"center", border:"1px solid rgba(255,200,100,0.05)" }}>
              <div style={{ fontSize:15, marginBottom:3 }}>{st.icon}</div>
              <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,248,238,0.88)" }}>{st.val}</div>
              <div style={{ fontSize:9, color:"rgba(255,200,140,0.3)", marginTop:1 }}>{st.label}</div>
            </div>
          ))}
        </div>

        <CrowdBar val={s.crowd} />

        {/* Seating */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:10, marginBottom:14 }}>
          <span style={{ fontSize:10, color:"rgba(255,200,140,0.4)", textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:600 }}>Seating</span>
          <span style={{ fontSize:11, fontWeight:700, color: s.seats > 5 ? "#22C55E" : s.seats > 0 ? "#F59E0B" : "#EF4444" }}>
            {s.seats > 0 ? `${s.seats} seats free` : "No seats"}
          </span>
        </div>

        <motion.button
          whileHover={{ opacity:0.9 }}
          whileTap={{ scale:0.97 }}
          style={{
            width:"100%", padding:"10px 0", borderRadius:12, border:"none",
            background:`linear-gradient(135deg, ${s.accent}, ${s.accent}99)`,
            color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer",
            fontFamily:"'Cabinet Grotesk', sans-serif",
            boxShadow:`0 4px 18px ${s.accent}44`,
            position:"relative", overflow:"hidden",
          }}
          className="btn-find"
        >View Shop →</motion.button>
      </div>
    </motion.div>
  );
}

function NearbyShops() {
  return (
    <div>
      <SectionHeader icon="📍" title="Nearby Popular Shops" sub="Live crowd & seating data" action="View all 120+" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        {SHOPS.map((s,i) => <ShopCard key={s.id} s={s} i={i} />)}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SPENDING INSIGHT PANEL
═══════════════════════════════════════════════════════════ */
function SpendingPanel() {
  const maxVal = Math.max(...SPENDING.map(d => d.val));
  const totalWeekly = SPENDING.reduce((a,b) => a + b.val, 0);
  const avgMeal = Math.round(totalWeekly / 7);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity:0, y:24 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true }}
      transition={{ duration:0.55, ease:[0.16,1,0.3,1] }}
      style={{
        borderRadius:20, padding:"22px 20px", height:"100%",
        background:"linear-gradient(145deg, rgba(26,21,16,0.95), rgba(20,16,10,0.9))",
        border:"1px solid rgba(255,200,100,0.08)",
        boxShadow:"0 8px 28px rgba(0,0,0,0.35)",
        position:"relative", overflow:"hidden",
      }}
    >
      <div style={{ position:"absolute", top:-30, right:-30, width:120, height:120, borderRadius:"50%", background:"radial-gradient(circle, rgba(244,99,30,0.1), transparent 70%)", pointerEvents:"none" }} />

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <div>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,200,140,0.4)", marginBottom:4 }}>💰 Weekly Spend</div>
          <div style={{ fontFamily:"'Fraunces', serif", fontSize:28, fontWeight:700, color:"rgba(255,248,238,0.95)" }}>₹{totalWeekly}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:10, color:"rgba(255,200,140,0.4)", marginBottom:3 }}>vs last week</div>
          <div style={{ fontSize:14, fontWeight:700, color:"#22C55E" }}>↓ 12%</div>
        </div>
      </div>

      {/* Bar chart */}
      <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:72, marginBottom:16 }}>
        {SPENDING.map((d, i) => {
          const pct = (d.val / maxVal) * 100;
          const isMax = d.val === maxVal;
          return (
            <div key={d.label} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5, height:"100%" }}>
              <div style={{ flex:1, width:"100%", display:"flex", alignItems:"flex-end" }}>
                <motion.div
                  initial={{ height:0 }}
                  animate={inView ? { height:`${pct}%` } : {}}
                  transition={{ delay:0.1 + i*0.07, duration:0.6, ease:[0.16,1,0.3,1] }}
                  style={{
                    width:"100%", borderRadius:"5px 5px 3px 3px",
                    background: isMax
                      ? "linear-gradient(180deg, #F4631E, #FF8C42)"
                      : "rgba(255,200,100,0.15)",
                    boxShadow: isMax ? "0 4px 12px rgba(244,99,30,0.35)" : "none",
                  }}
                />
              </div>
              <span style={{ fontSize:9, color:"rgba(255,200,140,0.4)", fontWeight:600 }}>{d.label}</span>
            </div>
          );
        })}
      </div>

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {[
          { label:"Avg meal", val:`₹${avgMeal}`, icon:"🍽️", color:"#F59E0B" },
          { label:"Suggested", val:"₹180", icon:"💡", color:"#22C55E" },
        ].map(s => (
          <div key={s.label} style={{ padding:"10px 12px", borderRadius:12, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,200,100,0.07)" }}>
            <div style={{ fontSize:16, marginBottom:5 }}>{s.icon}</div>
            <div style={{ fontFamily:"'Fraunces', serif", fontSize:16, fontWeight:700, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:10, color:"rgba(255,200,140,0.4)", marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   QUICK MAP PREVIEW
═══════════════════════════════════════════════════════════ */
function MapPanel() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1, duration: 0.55, ease: [0.16,1,0.3,1] }}
      style={{
        borderRadius: 20,
        padding: "20px 20px 16px",
        height: "100%",
        background: "linear-gradient(145deg, rgba(26,21,16,0.95), rgba(20,16,10,0.9))",
        border: "1px solid rgba(255,200,100,0.08)",
        boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
        position: "relative",
        overflow: "hidden",
      }}
    >

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        
        <div>
          <div style={{ fontSize:11, fontWeight:700 }}>QUICK MAP PREVIEW</div>
          <div style={{ fontSize:14, fontWeight:700, color:"rgba(255,248,238,0.9)" }}>
            6 shops nearby
          </div>
        </div>

        <button
          onClick={() => navigate("/map")}
          style={{
            fontSize:11,
            color:"#F4631E",
            fontWeight:700,
            background:"none",
            border:"none",
            cursor:"pointer",
            fontFamily:"Cabinet Grotesk, sans-serif"
          }}
        >
          Open Map →
        </button>

      </div>

    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════
   SECTION HEADER
═══════════════════════════════════════════════════════════ */
function SectionHeader({ icon, title, sub, action }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:18 }}>
      <div>
        <div style={{ display:"inline-flex", alignItems:"center", gap:7, marginBottom:5 }}>
          <span style={{ fontSize:16 }}>{icon}</span>
          <div style={{ width:20, height:1, background:"linear-gradient(90deg, #F4631E, transparent)" }} />
          <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#F4631E" }}>{title}</span>
        </div>
        {sub && <p style={{ fontSize:12, color:"rgba(255,200,140,0.4)" }}>{sub}</p>}
      </div>
      {action && (
        <motion.a href="#" whileHover={{ x:3 }} style={{ fontSize:12, color:"#F4631E", fontWeight:700, textDecoration:"none", display:"flex", alignItems:"center", gap:4 }}>
          {action} →
        </motion.a>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   QUICK STATS ROW
═══════════════════════════════════════════════════════════ */
function QuickStats() {
  const stats = [
    { icon:"🍽️", label:"Total Orders",   val:"147",    change:"+12%",  up:true,  color:"#F4631E" },
    { icon:"💰", label:"Saved This Week", val:"₹240",   change:"-8%",   up:false, color:"#22C55E" },
    { icon:"🏆", label:"Fav Shop Visits", val:"34",     change:"+5",    up:true,  color:"#F59E0B" },
    { icon:"⭐", label:"Avg Rating Given", val:"4.6",   change:"stable",up:true,  color:"#A78BFA" },
  ];

  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
      {stats.map((s, i) => (
        <motion.div key={s.label}
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.05 + i*0.08, duration:0.5 }}
          whileHover={{ y:-5 }}
          style={{
            borderRadius:18, padding:"18px 18px 16px",
            background:"linear-gradient(145deg, rgba(26,21,16,0.95), rgba(20,16,10,0.9))",
            border:"1px solid rgba(255,200,100,0.07)",
            boxShadow:"0 6px 20px rgba(0,0,0,0.28)",
            position:"relative", overflow:"hidden", cursor:"default",
          }}
        >
          <div style={{ position:"absolute", top:-20, right:-20, width:80, height:80, borderRadius:"50%", background:`radial-gradient(circle, ${s.color}15, transparent 70%)`, pointerEvents:"none" }} />
          <div style={{ fontSize:22, marginBottom:12 }}>{s.icon}</div>
          <div style={{ fontFamily:"'Fraunces', serif", fontSize:24, fontWeight:700, color:"rgba(255,248,238,0.95)", marginBottom:3 }}>{s.val}</div>
          <div style={{ fontSize:11, color:"rgba(255,200,140,0.45)", marginBottom:6 }}>{s.label}</div>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ fontSize:10, fontWeight:700, color: s.change==="stable" ? "rgba(255,200,140,0.4)" : s.up ? "#22C55E" : "#EF4444" }}>
              {s.change==="stable" ? "—" : s.up ? `▲ ${s.change}` : `▼ ${s.change}`}
            </span>
            <span style={{ fontSize:10, color:"rgba(255,200,140,0.3)" }}>vs last week</span>
          </div>
          {/* bottom accent */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:`linear-gradient(90deg, transparent, ${s.color}60, transparent)` }} />
        </motion.div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════════════════ */
function Sidebar() {
  const navItems = [
    { icon:"🏠", label:"Home",      active:true  },
    { icon:"🔍", label:"Explore",   active:false },
    { icon:"❤️", label:"Saved",     active:false },
    { icon:"📦", label:"Orders",    active:false },
    { icon:"💬", label:"Reviews",   active:false },
    { icon:"⚙️", label:"Settings",  active:false },
  ];

  return (
    <motion.aside
      initial={{ x:-64, opacity:0 }}
      animate={{ x:0, opacity:1 }}
      transition={{ duration:0.6, ease:[0.16,1,0.3,1] }}
      style={{
        width:72, position:"sticky", top:64, height:"calc(100vh - 64px)",
        display:"flex", flexDirection:"column", alignItems:"center",
        padding:"20px 0", gap:6,
        borderRight:"1px solid rgba(255,200,100,0.07)",
        background:"rgba(12,10,7,0.6)",
        backdropFilter:"blur(16px)",
        flexShrink:0,
      }}
    >
      {navItems.map(n => (
        <div key={n.label} className="tooltip" style={{ width:"100%", display:"flex", justifyContent:"center" }}>
          <motion.button
            whileHover={{ scale:1.1 }}
            whileTap={{ scale:0.9 }}
            style={{
              width:44, height:44, borderRadius:14, border:"none", cursor:"pointer",
              background: n.active ? "rgba(244,99,30,0.2)" : "transparent",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:20,
              boxShadow: n.active ? "0 0 0 1px rgba(244,99,30,0.4), 0 0 16px rgba(244,99,30,0.2)" : "none",
              transition:"all 0.2s",
            }}
          >{n.icon}</motion.button>
          <span className="tooltip-text">{n.label}</span>
        </div>
      ))}

      <div style={{ flex:1 }} />

      {/* Avatar bottom */}
      <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg, #F4631E, #F59E0B)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:700, color:"#fff", cursor:"pointer", boxShadow:"0 3px 12px rgba(244,99,30,0.35)" }}>A</div>
    </motion.aside>
  );
}

/* ═══════════════════════════════════════════════════════════
   TRENDING STRIP
═══════════════════════════════════════════════════════════ */
function TrendingStrip() {
  const items = ["🍛 Biryani Bros","☕ Green Bowl Café","🌮 Chaat Corner","🍜 Noodle Nook","🍔 Burger Station","🥗 FreshLeaf","🍮 Raju Sweets","🥙 Pav Studio"];

  return (
    <div style={{
      borderRadius:16, padding:"12px 0", overflow:"hidden",
      background:"linear-gradient(145deg, rgba(26,21,16,0.8), rgba(20,16,10,0.75))",
      border:"1px solid rgba(255,200,100,0.07)",
      position:"relative",
    }}>
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:60, background:"linear-gradient(90deg, rgba(12,10,7,0.95), transparent)", zIndex:2, pointerEvents:"none" }} />
      <div style={{ position:"absolute", right:0, top:0, bottom:0, width:60, background:"linear-gradient(-90deg, rgba(12,10,7,0.95), transparent)", zIndex:2, pointerEvents:"none" }} />
      <div style={{ display:"flex", animation:"marquee 25s linear infinite", width:"max-content" }}>
        {[...items,...items].map((t,i) => (
          <span key={i} style={{ marginRight:40, fontSize:12, color:"rgba(255,200,140,0.5)", fontWeight:600, whiteSpace:"nowrap" }}>
            {t} &nbsp;<span style={{ color:"rgba(244,99,30,0.4)" }}>·</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT DASHBOARD
═══════════════════════════════════════════════════════════ */
export default function FoodFinderDashboard() {
  const [budget, setBudget] = useState(150);
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", position:"relative", zIndex:1 }}>
      <GS />

      {/* Full-page ambient glows */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:"5%",  left:"15%", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle, rgba(244,99,30,0.06), transparent 70%)", filter:"blur(80px)" }} />
        <div style={{ position:"absolute", bottom:"10%", right:"10%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, rgba(245,158,11,0.05), transparent 70%)", filter:"blur(60px)" }} />
        <div style={{ position:"absolute", top:"50%", left:"50%", width:700, height:700, transform:"translate(-50%,-50%)", borderRadius:"50%", background:"radial-gradient(circle, rgba(244,99,30,0.03), transparent 70%)", filter:"blur(100px)" }} />
      </div>

      {/* Nav */}
      <div style={{ position:"relative", zIndex:10 }}>
        <NavBar budget={budget} setBudget={setBudget} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Body: sidebar + main */}
      <div style={{ display:"flex", position:"relative", zIndex:2 }}>
        <Sidebar />

        {/* Main content */}
        <main style={{ flex:1, padding:"24px 28px 40px", minWidth:0, maxWidth:"calc(100vw - 72px)", overflowX:"hidden" }}>

          {/* Quick stats */}
          <QuickStats />

          <div style={{ marginTop:28 }}>
            <WelcomeSection budget={budget} setBudget={setBudget} />
          </div>

          {/* Trending strip */}
          <div style={{ marginTop:24 }}>
            <TrendingStrip />
          </div>

          {/* Budget cards */}
          <div style={{ marginTop:32 }}>
            <BudgetCards />
          </div>

          {/* Categories */}
          <div style={{ marginTop:32 }}>
            <FoodCategories />
          </div>

          {/* Nearby shops */}
          <div style={{ marginTop:32 }}>
            <NearbyShops />
          </div>

          {/* Insights row: spending + map */}
          <div style={{ marginTop:32, display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            <div>
              <SectionHeader icon="📊" title="Spending Insights" sub="Your food budget this week" />
              <SpendingPanel />
            </div>
            <div>
              <SectionHeader icon="🗺️" title="Quick Map Preview" sub="Real-time crowd at nearby shops" />
              <MapPanel />
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop:40, paddingTop:20, borderTop:"1px solid rgba(255,200,100,0.07)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:26, height:26, borderRadius:8, background:"linear-gradient(135deg,#F4631E,#FF8C42)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>🍴</div>
              <span style={{ fontFamily:"'Fraunces', serif", fontSize:15, fontWeight:700, color:"rgba(255,248,238,0.7)" }}>Food<span style={{ color:"#F4631E" }}>Finder</span></span>
            </div>
            <span style={{ fontSize:11, color:"rgba(255,200,140,0.25)" }}>© 2025 FoodFinder Technologies · All rights reserved</span>
            <div style={{ display:"flex", gap:16 }}>
              {["Privacy","Terms","Support"].map(l => (
                <a key={l} href="#" style={{ fontSize:11, color:"rgba(255,200,140,0.3)", textDecoration:"none", transition:"color 0.2s" }}
                  onMouseEnter={e=>e.target.style.color="#F4631E"}
                  onMouseLeave={e=>e.target.style.color="rgba(255,200,140,0.3)"}>{l}</a>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
