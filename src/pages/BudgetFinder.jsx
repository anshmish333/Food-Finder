import { useState, useRef, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

/* ═══════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════ */
const GS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@300;400;500;600;700;800&display=swap');

    :root {
      --bg:      #06080E;
      --bg2:     #0A0D16;
      --bg3:     #0E1120;
      --orange:  #F26419;
      --ora2:    #FF7B35;
      --amber:   #F5A623;
      --gold:    #FFD060;
      --green:   #22C55E;
      --red:     #EF4444;
      --blue:    #38BDF8;
      --t1:      rgba(255,245,228,0.96);
      --t2:      rgba(255,210,155,0.62);
      --t3:      rgba(255,200,140,0.30);
      --bdr:     rgba(255,160,70,0.11);
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      background: var(--bg);
      font-family: 'Manrope', sans-serif;
      color: var(--t1);
      min-height: 100vh;
      overflow-x: hidden;
    }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: rgba(242,100,25,0.35); border-radius: 99px; }

    /* noise grain */
    body::before {
      content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.028;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
    }

    /* Budget slider */
    input[type=range].budget-range {
      -webkit-appearance: none; width: 100%; height: 5px; border-radius: 99px; outline: none; cursor: pointer;
      background: linear-gradient(to right, var(--orange) 0%, var(--orange) var(--v,30%), rgba(255,160,70,0.15) var(--v,30%));
    }
    input[type=range].budget-range::-webkit-slider-thumb {
      -webkit-appearance: none; width: 26px; height: 26px; border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, var(--ora2), var(--orange));
      border: 3px solid rgba(255,255,255,0.9);
      box-shadow: 0 0 0 5px rgba(242,100,25,0.18), 0 4px 14px rgba(242,100,25,0.55);
      cursor: pointer; transition: box-shadow 0.2s;
    }
    input[type=range].budget-range::-webkit-slider-thumb:hover {
      box-shadow: 0 0 0 8px rgba(242,100,25,0.22), 0 4px 18px rgba(242,100,25,0.6);
    }

    /* Budget input */
    .budget-input {
      background: rgba(255,255,255,0.06); border: 2px solid rgba(255,160,70,0.18);
      border-radius: 18px; color: var(--t1); outline: none;
      font-family: 'Instrument Serif', serif; font-size: 42px;
      text-align: center; width: 100%; padding: 18px 0;
      transition: all 0.25s; caret-color: var(--orange);
    }
    .budget-input:focus {
      border-color: rgba(242,100,25,0.65);
      background: rgba(255,255,255,0.08);
      box-shadow: 0 0 0 5px rgba(242,100,25,0.12), 0 8px 32px rgba(0,0,0,0.3);
    }

    /* CTA button */
    .btn-find {
      display: inline-flex; align-items: center; justify-content: center; gap: 9px;
      padding: 16px 36px; border-radius: 18px; border: none; cursor: pointer;
      background: linear-gradient(135deg, var(--orange), var(--ora2));
      color: white; font-size: 16px; font-weight: 800;
      font-family: 'Manrope', sans-serif; letter-spacing: 0.02em;
      box-shadow: 0 10px 36px rgba(242,100,25,0.45), inset 0 1px 0 rgba(255,255,255,0.2);
      transition: all 0.2s; position: relative; overflow: hidden; width: 100%;
    }
    .btn-find:hover {
      transform: translateY(-3px);
      box-shadow: 0 16px 48px rgba(242,100,25,0.55), inset 0 1px 0 rgba(255,255,255,0.2);
    }
    .btn-find:active { transform: scale(0.97); }
    .btn-find:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .btn-find::after {
      content: ''; position: absolute; top: -50%; left: -100%; width: 50%; height: 200%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
      transform: skewX(-20deg); animation: shimmer 3s ease-in-out infinite 1.5s;
    }

    /* Ghost button */
    .btn-ghost {
      display: inline-flex; align-items: center; justify-content: center; gap: 7px;
      padding: 10px 20px; border-radius: 13px;
      border: 1.5px solid rgba(255,160,70,0.2);
      background: rgba(255,255,255,0.04); color: var(--t2);
      font-size: 13px; font-weight: 600; font-family: 'Manrope', sans-serif;
      cursor: pointer; transition: all 0.2s;
    }
    .btn-ghost:hover {
      border-color: rgba(242,100,25,0.5); color: var(--ora2);
      background: rgba(242,100,25,0.08); transform: translateY(-1px);
    }

    /* Quick pick chip */
    .qchip {
      padding: 7px 16px; border-radius: 99px; font-size: 12px; font-weight: 700;
      cursor: pointer; transition: all 0.2s; border: 1.5px solid transparent;
      font-family: 'Manrope', sans-serif; white-space: nowrap; user-select: none;
    }
    .qchip-on  { background: rgba(242,100,25,0.2); border-color: rgba(242,100,25,0.55); color: var(--ora2); box-shadow: 0 0 0 3px rgba(242,100,25,0.12); }
    .qchip-off { background: rgba(255,255,255,0.04); border-color: rgba(255,160,70,0.15); color: var(--t3); }
    .qchip-off:hover { border-color: rgba(242,100,25,0.4); color: var(--ora2); background: rgba(242,100,25,0.08); }

    /* Sort/filter pill */
    .spill {
      padding: 6px 14px; border-radius: 99px; font-size: 11px; font-weight: 700;
      cursor: pointer; transition: all 0.2s; border: 1px solid transparent;
      font-family: 'Manrope', sans-serif; white-space: nowrap;
    }
    .spill-on  { background: rgba(242,100,25,0.15); border-color: rgba(242,100,25,0.45); color: var(--ora2); }
    .spill-off { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.07); color: var(--t3); }
    .spill-off:hover { border-color: rgba(242,100,25,0.35); color: var(--ora2); }

    @keyframes shimmer    { 0%{left:-100%} 100%{left:200%} }
    @keyframes pulse-dot  { 0%,100%{transform:scale(1);opacity:.8} 50%{transform:scale(1.8);opacity:0} }
    @keyframes float-a    { 0%,100%{transform:translateY(0) rotate(-5deg)} 50%{transform:translateY(-18px) rotate(-2deg)} }
    @keyframes float-b    { 0%,100%{transform:translateY(0) rotate(4deg)} 50%{transform:translateY(-14px) rotate(7deg)} }
    @keyframes float-c    { 0%,100%{transform:translateY(0) rotate(-8deg)} 50%{transform:translateY(-22px) rotate(-5deg)} }
    @keyframes count-up   { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
    @keyframes spin-ring  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes bounce-in  { 0%{transform:scale(0.8);opacity:0} 60%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }
    @keyframes scan-line  { 0%{opacity:0;transform:translateY(-100%)} 10%{opacity:1} 90%{opacity:1} 100%{opacity:0;transform:translateY(200%)} }
  `}</style>
);

/* ═══════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════ */
const ALL_SHOPS = [
  { id:1,  name:"Chai & Samosa Co.",      type:"Street Snacks",  price:45,  rating:4.2, votes:203, dist:0.2, crowd:30, seats:4,  emoji:"🍵", accent:"#92400E", popular:"Masala Chai",   open:true,  tags:["Cheapest","Quickest"]         },
  { id:2,  name:"Chaat Corner",            type:"Street Food",    price:55,  rating:4.5, votes:198, dist:0.5, crowd:38, seats:0,  emoji:"🥙", accent:"#F5A800", popular:"Pani Puri",     open:true,  tags:["Budget Pick","No Seating"]     },
  { id:3,  name:"Dosa Delight",            type:"South Indian",   price:80,  rating:4.6, votes:267, dist:0.9, crowd:58, seats:7,  emoji:"🥞", accent:"#F5A800", popular:"Masala Dosa",   open:true,  tags:["Value Pick"]                  },
  { id:4,  name:"The Pav Studio",          type:"Mumbai Street",  price:75,  rating:4.4, votes:284, dist:0.4, crowd:52, seats:6,  emoji:"🌮", accent:"#A78BFA", popular:"Vada Pav",      open:false, tags:["Closed Now"]                  },
  { id:5,  name:"Sharma Ji Ka Dhaba",      type:"North Indian",   price:95,  rating:4.8, votes:312, dist:0.3, crowd:72, seats:8,  emoji:"🍛", accent:"#F26419", popular:"Aloo Paratha",  open:true,  tags:["Top Rated","Trending"]         },
  { id:6,  name:"Raju Sweets & Snacks",    type:"Desserts",       price:65,  rating:4.3, votes:156, dist:0.6, crowd:44, seats:0,  emoji:"🍮", accent:"#D97706", popular:"Jalebi",        open:true,  tags:["Sweet Spot"]                  },
  { id:7,  name:"Biryani Bros",            type:"Biryani",        price:145, rating:4.6, votes:627, dist:0.8, crowd:88, seats:3,  emoji:"🍚", accent:"#EF4444", popular:"Dum Biryani",   open:true,  tags:["Popular","Packed"]             },
  { id:8,  name:"Burger Station",          type:"Fast Food",      price:165, rating:4.5, votes:402, dist:1.2, crowd:61, seats:5,  emoji:"🍔", accent:"#FB923C", popular:"Smash Burger",  open:true,  tags:["Fast Pick"]                   },
  { id:9,  name:"Noodle Nook",             type:"Asian Fusion",   price:130, rating:4.7, votes:371, dist:1.4, crowd:33, seats:10, emoji:"🍜", accent:"#06B6D4", popular:"Hakka Noodles", open:true,  tags:["Hidden Gem","Calm"]            },
  { id:10, name:"Green Bowl Café",         type:"Café & Salads",  price:185, rating:4.9, votes:445, dist:1.1, crowd:25, seats:14, emoji:"🥗", accent:"#22C55E", popular:"Acai Bowl",     open:true,  tags:["Top Rated","Peaceful"]         },
  { id:11, name:"Slice Society",           type:"Pizza",          price:195, rating:4.6, votes:318, dist:1.6, crowd:47, seats:8,  emoji:"🍕", accent:"#F26419", popular:"Margherita",    open:true,  tags:["Crowd Fav"]                   },
  { id:12, name:"FreshLeaf Kitchen",       type:"Healthy Bowls",  price:210, rating:4.8, votes:289, dist:1.8, crowd:20, seats:18, emoji:"🥑", accent:"#4ADE80", popular:"Buddha Bowl",   open:true,  tags:["Healthy","Peaceful"]          },
];

const QUICK_PICKS = [
  { label:"₹50",  val:50  },
  { label:"₹100", val:100 },
  { label:"₹150", val:150 },
  { label:"₹200", val:200 },
  { label:"₹300", val:300 },
  { label:"₹500", val:500 },
];

const SORT_OPTS = ["Best Match","Rating","Price ↑","Price ↓","Distance","Crowd ↓"];

/* ═══════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════ */
const cc  = v => v >= 65 ? "#EF4444" : v >= 40 ? "#F5A800" : "#22C55E";
const ccl = v => v >= 65 ? "Packed"  : v >= 40 ? "Moderate" : "Calm";

function Stars({ r }) {
  return (
    <span style={{ display:"inline-flex", gap:1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize:11, color: i <= Math.round(r) ? "#F5A800" : "rgba(255,200,100,0.18)" }}>★</span>
      ))}
    </span>
  );
}

function CrowdBar({ v }) {
  const ref = useRef(null);
  const iv = useInView(ref, { once:true });
  return (
    <div ref={ref}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
        <span style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", color:"rgba(255,200,130,0.38)" }}>Crowd</span>
        <span style={{ fontSize:9, fontWeight:800, color:cc(v) }}>{ccl(v)} · {v}%</span>
      </div>
      <div style={{ height:3, borderRadius:99, background:"rgba(255,255,255,0.07)", overflow:"hidden" }}>
        <motion.div
          initial={{ width:0 }}
          animate={iv ? { width:`${v}%` } : {}}
          transition={{ duration:0.85, ease:[0.16,1,0.3,1], delay:0.1 }}
          style={{ height:"100%", borderRadius:99, background:`linear-gradient(90deg,${cc(v)}80,${cc(v)})` }}
        />
      </div>
    </div>
  );
}

function ValueScore({ shop, budget }) {
  // Score: lower price relative to budget = better value; add bonus for rating and calm crowd
  const priceScore  = ((budget - shop.price) / budget) * 40;
  const ratingScore = (shop.rating / 5) * 35;
  const crowdScore  = ((100 - shop.crowd) / 100) * 15;
  const openBonus   = shop.open ? 10 : 0;
  return Math.round(priceScore + ratingScore + crowdScore + openBonus);
}

/* ═══════════════════════════════════════════════════════════
   SHOP CARD (3D tilt)
═══════════════════════════════════════════════════════════ */
function ShopCard({ shop, idx, budget, isBestValue, isTopRated }) {
  const ref = useRef(null);
  const iv  = useInView(ref, { once:true });
  const [hov, setHov] = useState(false);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-80,80], [6,-6]), { stiffness:280, damping:28 });
  const ry = useSpring(useTransform(mx, [-80,80], [-6,6]), { stiffness:280, damping:28 });

  const savings  = budget - shop.price;
  const savingsPct = Math.round((savings / budget) * 100);
  const score = ValueScore({ ...shop }, budget);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity:0, y:40 }}
      animate={iv ? { opacity:1, y:0 } : {}}
      transition={{ delay:idx * 0.08, duration:0.55, ease:[0.16,1,0.3,1] }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => { setHov(false); mx.set(0); my.set(0); }}
      onMouseMove={e => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set(e.clientX - r.left - r.width / 2);
        my.set(e.clientY - r.top - r.height / 2);
      }}
      style={{
        rotateX: rx, rotateY: ry,
        transformStyle: "preserve-3d", perspective: 900,
        borderRadius: 22, overflow: "hidden", cursor: "pointer", position: "relative",
        background: isBestValue
          ? "linear-gradient(145deg, rgba(30,22,10,0.95), rgba(20,15,8,0.92))"
          : "linear-gradient(145deg, rgba(16,18,28,0.9), rgba(12,14,22,0.88))",
        border: isBestValue
          ? `1.5px solid rgba(245,168,0,0.45)`
          : isTopRated
          ? `1.5px solid rgba(34,197,94,0.3)`
          : "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(18px)",
        boxShadow: hov
          ? `0 28px 56px rgba(0,0,0,0.55), 0 0 0 1px ${shop.accent}55, 0 0 40px ${shop.accent}16`
          : isBestValue
          ? "0 12px 40px rgba(245,168,0,0.12), 0 4px 16px rgba(0,0,0,0.4)"
          : "0 8px 28px rgba(0,0,0,0.38)",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* Top line */}
      <div style={{ height:2.5, background:`linear-gradient(90deg, transparent, ${isBestValue?"#F5A800":shop.accent}, transparent)` }} />

      {/* Ambient glow */}
      <div style={{ position:"absolute", top:-40, right:-40, width:160, height:160, borderRadius:"50%", background:`radial-gradient(circle, ${shop.accent}18, transparent 70%)`, pointerEvents:"none" }} />

      {/* Best Value / Top Rated ribbon */}
      {isBestValue && (
        <div style={{ position:"absolute", top:14, right:-18, background:"linear-gradient(135deg, #F5A800, #FFD060)", color:"#1A0A00", fontSize:9, fontWeight:900, padding:"5px 28px", transform:"rotate(45deg) translateX(10px)", letterSpacing:"0.06em", boxShadow:"0 2px 8px rgba(245,168,0,0.4)", zIndex:5 }}>
          BEST VALUE
        </div>
      )}
      {isTopRated && !isBestValue && (
        <div style={{ position:"absolute", top:14, right:-18, background:"linear-gradient(135deg, #22C55E, #4ADE80)", color:"#001A08", fontSize:9, fontWeight:900, padding:"5px 28px", transform:"rotate(45deg) translateX(10px)", letterSpacing:"0.06em", boxShadow:"0 2px 8px rgba(34,197,94,0.4)", zIndex:5 }}>
          TOP RATED
        </div>
      )}

      <div style={{ padding:"16px 18px 18px", position:"relative", zIndex:2 }}>
        {/* Header */}
        <div style={{ display:"flex", gap:11, alignItems:"flex-start", marginBottom:13 }}>
          <motion.div
            animate={hov ? { scale:1.1, rotate:[-5,5,-2,0] } : {}}
            transition={{ duration:0.35 }}
            style={{ width:50, height:50, borderRadius:15, flexShrink:0, background:`linear-gradient(135deg,${shop.accent}28,${shop.accent}0a)`, border:`1px solid ${shop.accent}35`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, boxShadow:hov?`0 4px 14px ${shop.accent}44`:"none" }}
          >{shop.emoji}</motion.div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div style={{ fontSize:14, fontWeight:800, color:"rgba(255,245,228,0.97)", lineHeight:1.25, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"72%" }}>{shop.name}</div>
              <div style={{ fontSize:8, fontWeight:800, padding:"2px 8px", borderRadius:99, flexShrink:0, background:shop.open?"rgba(34,197,94,0.12)":"rgba(239,68,68,0.1)", color:shop.open?"#22C55E":"#EF4444", border:`1px solid ${shop.open?"rgba(34,197,94,0.28)":"rgba(239,68,68,0.25)"}`, letterSpacing:"0.04em" }}>
                {shop.open ? "● OPEN" : "● CLOSED"}
              </div>
            </div>
            <div style={{ fontSize:11, color:"rgba(255,200,130,0.48)", marginTop:1 }}>{shop.type}</div>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:12 }}>
          {[
            { icon:"💸", label:"Price",   val:`₹${shop.price}` },
            { icon:"📍", label:"Dist.",   val:`${shop.dist}km`  },
            { icon:"⭐", label:"Rating",  val:shop.rating       },
          ].map(s => (
            <div key={s.label} style={{ background:"rgba(255,255,255,0.03)", borderRadius:11, padding:"9px 6px", textAlign:"center", border:"1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize:14, marginBottom:2 }}>{s.icon}</div>
              <div style={{ fontSize:11, fontWeight:800, color:"rgba(255,245,228,0.92)" }}>{s.val}</div>
              <div style={{ fontSize:9, color:"rgba(255,200,130,0.35)", marginTop:1 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <CrowdBar v={shop.crowd} />

        {/* Value insight */}
        <div style={{ margin:"11px 0 12px", padding:"9px 12px", borderRadius:12, background:isBestValue?"rgba(245,168,0,0.08)":"rgba(255,255,255,0.03)", border:`1px solid ${isBestValue?"rgba(245,168,0,0.25)":"rgba(255,255,255,0.06)"}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:12 }}>🪑</span>
            <span style={{ fontSize:11, fontWeight:700, color: shop.seats>5?"#22C55E":shop.seats>0?"#F5A800":"#EF4444" }}>
              {shop.seats>0?`${shop.seats} seats`:"Full"}
            </span>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:11, fontWeight:800, color:isBestValue?"#F5A800":savings>0?"#22C55E":"rgba(255,200,130,0.55)" }}>
              {savings > 0 ? `💰 Saves ₹${savings}` : `= Budget`}
            </div>
            <div style={{ fontSize:9, color:"rgba(255,200,130,0.38)", marginTop:1 }}>
              {savings > 0 ? `${savingsPct}% under budget` : "Exact match"}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:13 }}>
          {shop.tags.slice(0,3).map(t => (
            <span key={t} style={{ fontSize:9, fontWeight:800, padding:"2px 8px", borderRadius:99, background:`${shop.accent}14`, color:shop.accent, border:`1px solid ${shop.accent}2a`, letterSpacing:"0.04em" }}>{t}</span>
          ))}
          {/* Value score badge */}
          <span style={{ fontSize:9, fontWeight:800, padding:"2px 8px", borderRadius:99, background:"rgba(255,208,96,0.1)", color:"#FFD060", border:"1px solid rgba(255,208,96,0.2)", marginLeft:"auto" }}>
            ✦ {score}/100
          </span>
        </div>

        <motion.button
          whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
          style={{
            width:"100%", padding:"11px 0", borderRadius:13, border:"none", cursor:"pointer",
            background:`linear-gradient(135deg, ${shop.accent}, ${shop.accent}bb)`,
            color:"#fff", fontWeight:800, fontSize:13, fontFamily:"'Manrope',sans-serif",
            boxShadow:`0 4px 20px ${shop.accent}44`, position:"relative", overflow:"hidden",
          }}
          className="btn-ghost"
        >
          View Shop →
        </motion.button>
      </div>
    </motion.article>
  );
}

/* ═══════════════════════════════════════════════════════════
   EMPTY STATE
═══════════════════════════════════════════════════════════ */
function EmptyState({ budget }) {
  return (
    <motion.div
      initial={{ opacity:0, scale:0.95 }}
      animate={{ opacity:1, scale:1 }}
      transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
      style={{ textAlign:"center", padding:"64px 24px", borderRadius:24, background:"rgba(14,16,24,0.7)", border:"1px solid rgba(255,255,255,0.07)" }}
    >
      <motion.div
        animate={{ y:[0,-10,0] }}
        transition={{ duration:2.5, repeat:Infinity, ease:"easeInOut" }}
        style={{ fontSize:64, marginBottom:18 }}
      >🍽️</motion.div>
      <h3 style={{ fontFamily:"'Instrument Serif',serif", fontSize:24, fontWeight:700, color:"rgba(255,245,228,0.9)", marginBottom:10 }}>
        No shops found for ₹{budget}
      </h3>
      <p style={{ fontSize:14, color:"rgba(255,200,130,0.5)", lineHeight:1.7, maxWidth:380, margin:"0 auto 24px" }}>
        Your budget is below our minimum meal price. Try increasing your budget to ₹50 or more to discover food shops near you.
      </p>
      <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
        {[50,100,150].map(v => (
          <span key={v} style={{ padding:"8px 16px", borderRadius:99, background:"rgba(242,100,25,0.1)", border:"1px solid rgba(242,100,25,0.35)", color:"#FF7B35", fontSize:12, fontWeight:700, cursor:"pointer" }}>Try ₹{v}</span>
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   RESULTS SUMMARY BAR
═══════════════════════════════════════════════════════════ */
function SummaryBar({ shops, budget, sort, setSort }) {
  if (!shops.length) return null;
  const cheapest = Math.min(...shops.map(s=>s.price));
  const avgPrice = Math.round(shops.reduce((a,s)=>a+s.price,0)/shops.length);
  const openCount = shops.filter(s=>s.open).length;

  return (
    <motion.div
      initial={{ opacity:0, y:16 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
      style={{ borderRadius:20, padding:"16px 20px", marginBottom:20, background:"rgba(14,16,24,0.8)", border:"1px solid rgba(255,160,70,0.1)", backdropFilter:"blur(16px)", display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}
    >
      {/* Stats */}
      <div style={{ display:"flex", gap:24, alignItems:"center", flexWrap:"wrap" }}>
        <div>
          <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:20, fontWeight:700, color:"rgba(255,245,228,0.97)" }}>
            {shops.length} <span style={{ color:"#F26419" }}>shops found</span>
          </div>
          <div style={{ fontSize:11, color:"rgba(255,200,130,0.45)", marginTop:2 }}>within ₹{budget} budget</div>
        </div>
        {[
          { e:"💸", label:"From", val:`₹${cheapest}` },
          { e:"📊", label:"Avg price", val:`₹${avgPrice}` },
          { e:"🟢", label:"Open now", val:openCount },
        ].map(s => (
          <div key={s.label} style={{ textAlign:"center" }}>
            <div style={{ fontSize:11, color:"rgba(255,200,130,0.4)", marginBottom:2 }}>{s.e} {s.label}</div>
            <div style={{ fontSize:14, fontWeight:800, color:"rgba(255,245,228,0.9)" }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Sort */}
      <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
        {SORT_OPTS.map(o => (
          <button key={o} className={`spill ${sort===o?"spill-on":"spill-off"}`} onClick={()=>setSort(o)}>{o}</button>
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BUDGET AI INSIGHT
═══════════════════════════════════════════════════════════ */
function BudgetInsight({ budget, count }) {
  const tier = budget < 80 ? "snack" : budget < 150 ? "meal" : budget < 250 ? "dining" : "premium";
  const msgs = {
    snack:   { e:"🍵", tip:"Great for quick bites, chai & street snacks", color:"#F5A800" },
    meal:    { e:"🍛", tip:"Perfect for filling meals at local dhabas",    color:"#F26419" },
    dining:  { e:"🥘", tip:"Unlocks cafés, biryani joints & more options", color:"#06B6D4" },
    premium: { e:"🥗", tip:"Full range — healthy bowls, cafés & dining",   color:"#22C55E" },
  };
  const m = msgs[tier];
  return (
    <motion.div
      key={budget}
      initial={{ opacity:0, x:12 }}
      animate={{ opacity:1, x:0 }}
      transition={{ duration:0.35 }}
      style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"8px 16px", borderRadius:99, background:`${m.color}14`, border:`1px solid ${m.color}30`, marginTop:10 }}
    >
      <span style={{ fontSize:16 }}>{m.e}</span>
      <span style={{ fontSize:12, fontWeight:600, color:m.color }}>{m.tip}</span>
      {count > 0 && <span style={{ fontSize:12, fontWeight:800, color:"rgba(255,245,228,0.7)", marginLeft:4 }}>→ {count} shops</span>}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   NAV BAR
═══════════════════════════════════════════════════════════ */
function NavBar() {
  const [s, setS] = useState("");
  return (
    <motion.header
      initial={{ y:-60, opacity:0 }}
      animate={{ y:0, opacity:1 }}
      transition={{ duration:0.6, ease:[0.16,1,0.3,1] }}
      style={{ position:"sticky", top:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", height:62, background:"rgba(6,8,14,0.85)", backdropFilter:"blur(24px)", borderBottom:"1px solid rgba(255,160,70,0.08)", boxShadow:"0 1px 0 rgba(255,255,255,0.04)" }}
    >
      <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
        <div style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg,#F26419,#FF7B35)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, boxShadow:"0 4px 14px rgba(242,100,25,0.42)" }}>🍴</div>
        <span style={{ fontFamily:"'Instrument Serif',serif", fontSize:18, fontWeight:700, color:"rgba(255,245,228,0.97)" }}>
          Food<span style={{ color:"#F26419" }}>Finder</span>
        </span>
      </div>
      <div style={{ flex:1, maxWidth:300, position:"relative", margin:"0 24px" }}>
        <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:13, opacity:0.38 }}>🔍</span>
        <input style={{ width:"100%", height:38, padding:"0 14px 0 36px", borderRadius:12, border:"1px solid rgba(255,160,70,0.12)", background:"rgba(255,255,255,0.04)", color:"rgba(255,245,228,0.9)", fontSize:13, fontFamily:"'Manrope',sans-serif", outline:"none" }}
          placeholder="Search food or shops…" value={s} onChange={e=>setS(e.target.value)} />
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:10, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,160,70,0.1)", cursor:"pointer" }}>
          <span style={{ fontSize:13 }}>📍</span>
          <span style={{ fontSize:12, fontWeight:600, color:"rgba(255,200,130,0.65)" }}>Hazratganj</span>
          <span style={{ fontSize:10, color:"rgba(255,200,130,0.35)" }}>▾</span>
        </div>
        <div style={{ width:34, height:34, borderRadius:10, background:"linear-gradient(135deg,#F26419,#F5A623)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, color:"white", boxShadow:"0 3px 10px rgba(242,100,25,0.32)", cursor:"pointer" }}>A</div>
      </div>
    </motion.header>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT PAGE
═══════════════════════════════════════════════════════════ */
export default function BudgetSmartFinder() {
  const [budget, setBudget]   = useState(150);
  const [input,  setInput]    = useState("150");
  const [results, setResults] = useState([]);
  const [sort, setSort]       = useState("Best Match");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [activeChip, setActiveChip] = useState(150);

  const pct = Math.round(((budget - 50) / 450) * 100);

  const handleInputChange = (val) => {
    setInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 10 && num <= 500) {
      setBudget(num);
      setActiveChip(null);
    }
  };

  const handleSlider = (val) => {
    const num = Number(val);
    setBudget(num);
    setInput(String(num));
    setActiveChip(null);
  };

  const pickChip = (val) => {
    setBudget(val);
    setInput(String(val));
    setActiveChip(val);
  };

  const search = useCallback(async () => {
    setLoading(true);
    setSearched(false);
    await new Promise(r => setTimeout(r, 1100));

    let found = ALL_SHOPS.filter(s => s.price <= budget);

    if (sort === "Rating")   found.sort((a,b) => b.rating - a.rating);
    if (sort === "Price ↑")  found.sort((a,b) => a.price - b.price);
    if (sort === "Price ↓")  found.sort((a,b) => b.price - a.price);
    if (sort === "Distance") found.sort((a,b) => a.dist - b.dist);
    if (sort === "Crowd ↓")  found.sort((a,b) => a.crowd - b.crowd);
    if (sort === "Best Match") {
      found.sort((a,b) => ValueScore(b, budget) - ValueScore(a, budget));
    }

    setResults(found);
    setSearched(true);
    setLoading(false);
  }, [budget, sort]);

  // Derived highlights
  const bestValueShop = results.length
    ? results.reduce((best, s) => ValueScore(s, budget) > ValueScore(best, budget) ? s : best, results[0])
    : null;
  const topRatedShop = results.length
    ? results.reduce((best, s) => s.rating > best.rating ? s : best, results[0])
    : null;

  // Re-sort when sort changes after initial search
  useEffect(() => {
    if (searched && results.length > 0) {
      let sorted = [...results];
      if (sort === "Rating")   sorted.sort((a,b) => b.rating - a.rating);
      if (sort === "Price ↑")  sorted.sort((a,b) => a.price - b.price);
      if (sort === "Price ↓")  sorted.sort((a,b) => b.price - a.price);
      if (sort === "Distance") sorted.sort((a,b) => a.dist - b.dist);
      if (sort === "Crowd ↓")  sorted.sort((a,b) => a.crowd - b.crowd);
      if (sort === "Best Match") sorted.sort((a,b) => ValueScore(b, budget) - ValueScore(a, budget));
      setResults(sorted);
    }
  }, [sort]);

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg,#06080E)", position:"relative", zIndex:1 }}>
      <GS />

      {/* Ambient glows */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:"5%", left:"15%", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,rgba(242,100,25,0.07),transparent 70%)", filter:"blur(80px)", animation:"float-a 22s ease-in-out infinite" }} />
        <div style={{ position:"absolute", bottom:"10%", right:"8%", width:450, height:450, borderRadius:"50%", background:"radial-gradient(circle,rgba(245,168,0,0.07),transparent 70%)", filter:"blur(65px)", animation:"float-b 26s ease-in-out infinite" }} />
        <div style={{ position:"absolute", top:"45%", left:"50%", width:350, height:350, borderRadius:"50%", background:"radial-gradient(circle,rgba(242,100,25,0.04),transparent 70%)", filter:"blur(55px)" }} />
      </div>

      <div style={{ position:"relative", zIndex:10 }}><NavBar /></div>

      <main style={{ position:"relative", zIndex:2, maxWidth:1080, margin:"0 auto", padding:"36px 20px 64px" }}>

        {/* Page header */}
        <motion.div
          initial={{ opacity:0, y:24 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.1, duration:0.65, ease:[0.16,1,0.3,1] }}
          style={{ textAlign:"center", marginBottom:40 }}
        >
          {/* Icon */}
          <motion.div
            animate={{ scale:[1,1.06,1] }}
            transition={{ duration:3, repeat:Infinity, ease:"easeInOut" }}
            style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:72, height:72, borderRadius:22, background:"linear-gradient(135deg,rgba(242,100,25,0.15),rgba(245,168,0,0.1))", border:"1px solid rgba(242,100,25,0.3)", fontSize:32, marginBottom:20, boxShadow:"0 8px 28px rgba(242,100,25,0.2)" }}
          >💰</motion.div>

          <h1 style={{ fontFamily:"'Instrument Serif',serif", fontSize:"clamp(30px,5vw,52px)", fontWeight:700, color:"rgba(255,245,228,0.97)", lineHeight:1.1, marginBottom:12 }}>
            Find Food Within
            <span style={{ background:"linear-gradient(135deg,#F26419,#FFD060)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginLeft:12 }}>Your Budget</span>
          </h1>
          <p style={{ fontSize:16, color:"rgba(255,200,130,0.55)", lineHeight:1.65, maxWidth:500, margin:"0 auto" }}>
            Smart AI recommendations — enter your budget and we'll surface the best local food shops matched perfectly to what you can spend.
          </p>
        </motion.div>

        {/* Budget input card */}
        <motion.div
          initial={{ opacity:0, y:32 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.22, duration:0.65, ease:[0.16,1,0.3,1] }}
          style={{
            borderRadius:28, padding:"32px 36px 28px", marginBottom:32,
            background:"linear-gradient(145deg, rgba(20,22,32,0.92), rgba(14,16,24,0.88))",
            border:"1px solid rgba(255,160,70,0.12)",
            backdropFilter:"blur(24px)",
            boxShadow:"0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
            position:"relative", overflow:"hidden",
          }}
        >
          {/* Card top accent */}
          <div style={{ position:"absolute", top:0, left:0, right:0, height:2.5, background:"linear-gradient(90deg, transparent, #F26419 30%, #FFD060 70%, transparent)" }} />
          {/* Corner glow */}
          <div style={{ position:"absolute", top:-40, right:-40, width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle,rgba(242,100,25,0.1),transparent 70%)", pointerEvents:"none" }} />

          {/* Currency + input */}
          <div style={{ textAlign:"center", marginBottom:8 }}>
            <label style={{ display:"block", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,200,130,0.45)", marginBottom:18 }}>Enter Your Budget</label>
            <div style={{ position:"relative", display:"inline-block", width:"100%", maxWidth:320 }}>
              <span style={{ position:"absolute", left:20, top:"50%", transform:"translateY(-50%)", fontFamily:"'Instrument Serif',serif", fontSize:36, fontWeight:700, color:"rgba(242,100,25,0.8)", pointerEvents:"none" }}>₹</span>
              <input
                className="budget-input"
                type="number" min={10} max={500}
                value={input}
                onChange={e => handleInputChange(e.target.value)}
                style={{ paddingLeft:52, paddingRight:20 }}
                onKeyDown={e => e.key === "Enter" && search()}
              />
            </div>
          </div>

          {/* AI insight */}
          <div style={{ textAlign:"center", marginBottom:24 }}>
            <BudgetInsight budget={budget} count={ALL_SHOPS.filter(s=>s.price<=budget).length} />
          </div>

          {/* Slider */}
          <div style={{ marginBottom:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
              <span style={{ fontSize:11, color:"rgba(255,200,130,0.35)", fontWeight:600 }}>₹50</span>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:"#F26419", boxShadow:"0 0 8px #F26419" }} />
                <span style={{ fontSize:13, fontWeight:800, color:"rgba(255,200,130,0.85)" }}>₹{budget} selected</span>
              </div>
              <span style={{ fontSize:11, color:"rgba(255,200,130,0.35)", fontWeight:600 }}>₹500</span>
            </div>
            <input
              type="range" className="budget-range"
              min={50} max={500} step={5}
              value={budget}
              style={{ "--v":`${pct}%` }}
              onChange={e => handleSlider(e.target.value)}
            />
            {/* Tick marks */}
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
              {[50,100,150,200,250,300,350,400,450,500].map(v => (
                <div key={v} style={{ textAlign:"center" }}>
                  <div style={{ width:1, height:v%100===0?8:4, background:v<=budget?"rgba(242,100,25,0.6)":"rgba(255,255,255,0.12)", margin:"0 auto" }} />
                  {v%100===0 && <div style={{ fontSize:9, color:"rgba(255,200,130,0.3)", marginTop:2, fontWeight:600 }}>{v}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Quick picks */}
          <div style={{ display:"flex", gap:7, justifyContent:"center", marginBottom:24, flexWrap:"wrap" }}>
            {QUICK_PICKS.map(q => (
              <button key={q.val} className={`qchip ${activeChip===q.val?"qchip-on":"qchip-off"}`}
                onClick={() => pickChip(q.val)}>
                {q.label}
              </button>
            ))}
          </div>

          {/* Find button */}
          <motion.button
            whileHover={{ scale:1.01 }}
            whileTap={{ scale:0.98 }}
            className="btn-find"
            onClick={search}
            disabled={loading}
          >
            {loading ? (
              <span style={{ display:"inline-flex", alignItems:"center", gap:10 }}>
                <motion.span animate={{ rotate:360 }} transition={{ duration:0.8, repeat:Infinity, ease:"linear" }}
                  style={{ display:"inline-block", width:18, height:18, borderRadius:"50%", border:"2.5px solid rgba(255,255,255,0.3)", borderTopColor:"white" }} />
                Scanning nearby shops…
              </span>
            ) : (
              <>🔍 Find Best Food for ₹{budget}</>
            )}
          </motion.button>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div key="loading" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              style={{ textAlign:"center", padding:"48px 0" }}>
              <div style={{ position:"relative", width:80, height:80, margin:"0 auto 20px" }}>
                <motion.div animate={{ rotate:360 }} transition={{ duration:2, repeat:Infinity, ease:"linear" }}
                  style={{ position:"absolute", inset:0, borderRadius:"50%", border:"2px solid transparent", borderTopColor:"#F26419", borderRightColor:"rgba(242,100,25,0.3)" }} />
                <motion.div animate={{ rotate:-360 }} transition={{ duration:3, repeat:Infinity, ease:"linear" }}
                  style={{ position:"absolute", inset:10, borderRadius:"50%", border:"2px solid transparent", borderTopColor:"#F5A800", borderLeftColor:"rgba(245,168,0,0.3)" }} />
                <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>💰</div>
              </div>
              <div style={{ fontFamily:"'Instrument Serif',serif", fontSize:20, color:"rgba(255,245,228,0.9)", marginBottom:6 }}>Finding the best food for ₹{budget}…</div>
              <div style={{ fontSize:13, color:"rgba(255,200,130,0.45)" }}>Analyzing value scores, crowd levels & availability</div>
            </motion.div>
          )}

          {!loading && searched && (
            <motion.div key="results" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}>
              {results.length > 0 ? (
                <>
                  <SummaryBar shops={results} budget={budget} sort={sort} setSort={setSort} />
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))", gap:18 }}>
                    {results.map((shop, idx) => (
                      <ShopCard
                        key={shop.id}
                        shop={shop}
                        idx={idx}
                        budget={budget}
                        isBestValue={bestValueShop?.id === shop.id}
                        isTopRated={topRatedShop?.id === shop.id && bestValueShop?.id !== shop.id}
                      />
                    ))}
                  </div>
                  <div style={{ textAlign:"center", marginTop:32 }}>
                    <button className="btn-ghost" style={{ fontSize:13 }}>Load More Shops →</button>
                  </div>
                </>
              ) : (
                <EmptyState budget={budget} />
              )}
            </motion.div>
          )}

          {!loading && !searched && (
            <motion.div key="idle" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              style={{ textAlign:"center", padding:"40px 0" }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, maxWidth:560, margin:"0 auto 28px" }}>
                {[
                  { e:"🍵", label:"Street Snacks", sub:"From ₹45", anim:"float-a" },
                  { e:"🍛", label:"Local Meals",   sub:"From ₹80", anim:"float-b" },
                  { e:"🥗", label:"Café & Health", sub:"From ₹130", anim:"float-c" },
                ].map(t => (
                  <div key={t.label} style={{ textAlign:"center", padding:"20px 12px", borderRadius:18, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize:36, marginBottom:10, animation:`${t.anim} 4s ease-in-out infinite` }}>{t.e}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,245,228,0.8)", marginBottom:3 }}>{t.label}</div>
                    <div style={{ fontSize:11, color:"rgba(255,200,130,0.4)" }}>{t.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:14, color:"rgba(255,200,130,0.4)", lineHeight:1.7 }}>
                Set your budget above and click <strong style={{ color:"rgba(255,200,130,0.65)" }}>Find Best Food</strong> to discover<br/>
                the smartest recommendations near you.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
