import { useState, useRef, useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useInView } from "framer-motion";

/* ═══════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════ */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&display=swap');

    :root {
      --bg:       #FEFBF6;
      --bg2:      #FDF6EC;
      --orange:   #E8521A;
      --orange2:  #F97316;
      --amber:    #F59E0B;
      --brown:    #78350F;
      --brown2:   #92400E;
      --muted:    #B45309;
      --border:   rgba(180,100,30,0.13);
      --shadow:   rgba(120,53,15,0.1);
    }
    *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }
    html { scroll-behavior: smooth; }
    body { background: var(--bg); font-family: 'Bricolage Grotesque', sans-serif; color: var(--brown); overflow-x: hidden; }
    ::-webkit-scrollbar { width:4px; height:4px; }
    ::-webkit-scrollbar-track { background: var(--bg2); }
    ::-webkit-scrollbar-thumb { background: rgba(232,82,26,0.3); border-radius:99px; }

    body::before {
      content:''; position:fixed; inset:0; z-index:0; pointer-events:none; opacity:0.022;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    }

    input[type=range].ff-slider {
      -webkit-appearance: none; width:100%; height:4px; border-radius:99px; outline:none; cursor:pointer;
      background: linear-gradient(to right, var(--orange) 0%, var(--orange) var(--v,0%), rgba(180,100,30,0.18) var(--v,0%));
    }
    input[type=range].ff-slider::-webkit-slider-thumb {
      -webkit-appearance: none; width:20px; height:20px; border-radius:50%;
      background: radial-gradient(circle at 35% 35%, #FF8040, var(--orange));
      border: 2.5px solid white; box-shadow: 0 2px 10px rgba(232,82,26,0.45); cursor:pointer;
    }

    .ff-search {
      width:100%; height:42px; padding: 0 16px 0 44px;
      border-radius:14px; border:1.5px solid rgba(180,100,30,0.14);
      background: rgba(255,255,255,0.8); color: var(--brown);
      font-size:13px; font-family: 'Bricolage Grotesque', sans-serif;
      outline:none; transition:all 0.25s; backdrop-filter:blur(8px);
    }
    .ff-search::placeholder { color: rgba(120,53,15,0.4); }
    .ff-search:focus {
      border-color: rgba(232,82,26,0.45); background: rgba(255,255,255,0.99);
      box-shadow: 0 0 0 4px rgba(232,82,26,0.09);
    }

    .btn-cta {
      display:inline-flex; align-items:center; justify-content:center; gap:7px;
      padding: 12px 22px; border-radius:14px; border:none; cursor:pointer;
      background: linear-gradient(135deg, var(--orange), var(--orange2));
      color:white; font-size:13px; font-weight:700;
      font-family: 'Bricolage Grotesque', sans-serif;
      box-shadow: 0 6px 22px rgba(232,82,26,0.35), inset 0 1px 0 rgba(255,255,255,0.18);
      transition:all 0.2s; position:relative; overflow:hidden;
    }
    .btn-cta:hover { transform:translateY(-2px); box-shadow:0 10px 32px rgba(232,82,26,0.45); }
    .btn-cta:active { transform:scale(0.97); }
    .btn-cta::after {
      content:''; position:absolute; top:-50%; left:-100%; width:50%; height:200%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
      transform:skewX(-20deg); animation: shimmer 3.2s ease-in-out infinite 1.2s;
    }

    .btn-outline {
      display:inline-flex; align-items:center; justify-content:center; gap:6px;
      padding: 10px 18px; border-radius:12px; border:1.5px solid var(--border);
      background: rgba(255,255,255,0.75); color: var(--brown2);
      font-size:12px; font-weight:600; cursor:pointer;
      font-family: 'Bricolage Grotesque', sans-serif;
      transition:all 0.2s; backdrop-filter:blur(8px);
    }
    .btn-outline:hover { border-color: var(--orange); color:var(--orange); background: rgba(232,82,26,0.05); transform:translateY(-1px); }

    .pill {
      padding: 6px 13px; border-radius:99px; font-size:12px; font-weight:600;
      cursor:pointer; transition:all 0.2s; border:1.5px solid transparent;
      font-family: 'Bricolage Grotesque', sans-serif; white-space:nowrap; user-select:none;
    }
    .pill-off { background:rgba(255,255,255,0.65); border-color:rgba(120,53,15,0.14); color:rgba(120,53,15,0.55); }
    .pill-off:hover { border-color:rgba(232,82,26,0.35); color:var(--orange); }
    .pill-on  { background:rgba(232,82,26,0.1); border-color:rgba(232,82,26,0.42); color:var(--orange); box-shadow:0 0 0 3px rgba(232,82,26,0.08); }

    .sort-btn {
      padding: 7px 15px; border-radius:10px; font-size:12px; font-weight:600;
      cursor:pointer; border:none; transition:all 0.2s; font-family:'Bricolage Grotesque',sans-serif;
    }
    .sort-off { background:transparent; color:rgba(120,53,15,0.55); }
    .sort-off:hover { background:rgba(232,82,26,0.07); color:var(--orange); }
    .sort-on  { background:var(--orange); color:white; box-shadow:0 4px 14px rgba(232,82,26,0.3); }

    .card-tag {
      font-size:9px; font-weight:800; padding:3px 8px; border-radius:99px;
      text-transform:uppercase; letter-spacing:0.06em; white-space:nowrap;
    }

    @keyframes shimmer { 0%{left:-100%} 100%{left:200%} }
    @keyframes pulse-live { 0%,100%{transform:scale(1);opacity:0.8} 50%{transform:scale(1.7);opacity:0} }
    @keyframes float-pin  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
    @keyframes spin-ring  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes badge-pop  { 0%{transform:scale(0.7)} 100%{transform:scale(1)} }
  `}</style>
);

/* ═══════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════ */
const ALL_SHOPS = [
  { id:1,  name:"Sharma Ji Ka Dhaba",   type:"Street Food", price:95,  dist:0.3, rating:4.8, votes:312, crowd:72, seats:8,  popular:"Aloo Paratha",  emoji:"🍛", accent:"#E8521A", open:true,  tags:["Trending","Veg Option"] },
  { id:2,  name:"Chaat Corner",          type:"Street Food", price:55,  dist:0.5, rating:4.5, votes:198, crowd:38, seats:0,  popular:"Pani Puri",     emoji:"🥙", accent:"#F59E0B", open:true,  tags:["Budget Pick"] },
  { id:3,  name:"Green Bowl Café",       type:"Café",        price:185, dist:1.1, rating:4.9, votes:445, crowd:25, seats:14, popular:"Acai Bowl",     emoji:"🥗", accent:"#16A34A", open:true,  tags:["Top Rated","Veg"] },
  { id:4,  name:"Biryani Bros",          type:"Fast Food",   price:145, dist:0.8, rating:4.6, votes:627, crowd:88, seats:3,  popular:"Dum Biryani",   emoji:"🍚", accent:"#DC2626", open:true,  tags:["Popular"] },
  { id:5,  name:"The Pav Studio",        type:"Street Food", price:75,  dist:0.4, rating:4.4, votes:284, crowd:52, seats:6,  popular:"Vada Pav",      emoji:"🌮", accent:"#7C3AED", open:false, tags:["Street Fav"] },
  { id:6,  name:"Noodle Nook",           type:"Fast Food",   price:130, dist:1.4, rating:4.7, votes:371, crowd:33, seats:10, popular:"Hakka Noodles", emoji:"🍜", accent:"#0891B2", open:true,  tags:["Hidden Gem"] },
  { id:7,  name:"Raju Sweets & Snacks",  type:"Desserts",    price:65,  dist:0.6, rating:4.3, votes:156, crowd:44, seats:0,  popular:"Jalebi",        emoji:"🍮", accent:"#D97706", open:true,  tags:["Sweet Spot"] },
  { id:8,  name:"FreshLeaf Kitchen",     type:"Café",        price:210, dist:1.8, rating:4.8, votes:289, crowd:20, seats:18, popular:"Buddha Bowl",   emoji:"🥑", accent:"#059669", open:true,  tags:["Healthy","Veg"] },
  { id:9,  name:"Burger Station",        type:"Fast Food",   price:165, dist:1.2, rating:4.5, votes:402, crowd:61, seats:5,  popular:"Smash Burger",  emoji:"🍔", accent:"#B45309", open:true,  tags:["Fast Pick"] },
  { id:10, name:"Slice Society",         type:"Fast Food",   price:195, dist:1.6, rating:4.6, votes:318, crowd:47, seats:8,  popular:"Margherita",    emoji:"🍕", accent:"#E8521A", open:true,  tags:["Crowd Fav"] },
  { id:11, name:"Chai & Samosa Co.",     type:"Street Food", price:45,  dist:0.2, rating:4.2, votes:203, crowd:30, seats:4,  popular:"Masala Chai",   emoji:"🍵", accent:"#92400E", open:true,  tags:["Cheapest!"] },
  { id:12, name:"Dosa Delight",          type:"Street Food", price:80,  dist:0.9, rating:4.6, votes:267, crowd:58, seats:7,  popular:"Masala Dosa",   emoji:"🥞", accent:"#F59E0B", open:true,  tags:["South Indian"] },
];

const FOOD_TYPES   = ["Street Food","Fast Food","Café","Veg","Non-Veg","Desserts"];
const CROWD_OPTS   = ["Low","Medium","High"];
const DIST_OPTS    = ["< 500m","< 1 km","< 2 km"];
const SORT_OPTS    = ["Relevance","Rating","Distance","Price ↑","Price ↓","Crowd ↓"];
const BUDGET_PICKS = [
  { max:100, label:"Under ₹100", desc:"Quick bites & street snacks", topPick:"Chai & Samosa Co.",emoji:"🥙", color:"#F59E0B" },
  { max:200, label:"Under ₹200", desc:"Filling meals & café plates", topPick:"Biryani Bros",     emoji:"🍚", color:"#E8521A" },
  { max:300, label:"Under ₹300", desc:"Premium picks & dine-in",     topPick:"FreshLeaf Kitchen",emoji:"🥑", color:"#16A34A" },
];
const MAP_PINS = [
  { x:16, y:26, s:ALL_SHOPS[10] },
  { x:42, y:54, s:ALL_SHOPS[1]  },
  { x:68, y:20, s:ALL_SHOPS[2]  },
  { x:28, y:72, s:ALL_SHOPS[3]  },
  { x:60, y:62, s:ALL_SHOPS[5]  },
  { x:50, y:40, s:ALL_SHOPS[0]  },
];

/* ═══════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════ */
const cc  = v => v >= 65 ? "#DC2626" : v >= 40 ? "#D97706" : "#16A34A";
const ccl = v => v >= 65 ? "Packed"  : v >= 40 ? "Moderate" : "Calm";

function Stars({ r }) {
  return (
    <span style={{ display:"inline-flex", gap:1 }}>
      {[1,2,3,4,5].map(i => <span key={i} style={{ fontSize:11, color: i<=Math.round(r) ? "#F59E0B":"rgba(120,53,15,0.2)" }}>★</span>)}
    </span>
  );
}

function CrowdBar({ v }) {
  const ref = useRef(null);
  const iv  = useInView(ref, { once:true });
  return (
    <div ref={ref}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
        <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em", color:"rgba(120,53,15,0.4)" }}>Crowd</span>
        <span style={{ fontSize:10, fontWeight:800, color:cc(v) }}>{ccl(v)} {v}%</span>
      </div>
      <div style={{ height:3, borderRadius:99, background:"rgba(120,53,15,0.1)", overflow:"hidden" }}>
        <motion.div
          initial={{ width:0 }}
          animate={iv ? { width:`${v}%` } : {}}
          transition={{ duration:0.85, ease:[0.16,1,0.3,1], delay:0.1 }}
          style={{ height:"100%", borderRadius:99, background:`linear-gradient(90deg,${cc(v)}88,${cc(v)})` }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SHOP CARD (3-D tilt)
═══════════════════════════════════════════════════════════ */
function ShopCard({ shop:s, idx, saved, onSave }) {
  const ref = useRef(null);
  const iv  = useInView(ref, { once:true });
  const [hov, setHov] = useState(false);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rx = useSpring(useTransform(my,[-80,80],[6,-6]),{ stiffness:280, damping:30 });
  const ry = useSpring(useTransform(mx,[-80,80],[-6,6]),{ stiffness:280, damping:30 });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity:0, y:36 }}
      animate={iv ? { opacity:1, y:0 } : {}}
      transition={{ delay:idx*0.07, duration:0.55, ease:[0.16,1,0.3,1] }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => { setHov(false); mx.set(0); my.set(0); }}
      onMouseMove={e => {
        if(!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set(e.clientX - r.left - r.width/2);
        my.set(e.clientY - r.top - r.height/2);
      }}
      style={{
        rotateX:rx, rotateY:ry,
        transformStyle:"preserve-3d", perspective:900,
        borderRadius:22, overflow:"hidden", cursor:"pointer", position:"relative",
        background:"rgba(255,252,246,0.9)",
        border:"1px solid rgba(120,53,15,0.1)",
        backdropFilter:"blur(16px)",
        boxShadow: hov
          ? `0 28px 56px rgba(120,53,15,0.18),0 0 0 1.5px ${s.accent}55,0 0 40px ${s.accent}14`
          : "0 6px 24px rgba(120,53,15,0.1), 0 1px 0 rgba(255,255,255,0.95)",
        transition:"box-shadow 0.3s ease",
      }}
    >
      {/* accent top line */}
      <div style={{ height:2.5, background:`linear-gradient(90deg, transparent, ${s.accent}, transparent)` }} />
      {/* ambient glow */}
      <div style={{ position:"absolute", top:-35, right:-35, width:160, height:160, borderRadius:"50%", background:`radial-gradient(circle,${s.accent}16,transparent 70%)`, pointerEvents:"none" }} />

      <div style={{ padding:"18px 18px 16px", position:"relative", zIndex:2 }}>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
          <div style={{ display:"flex", gap:10, alignItems:"center", flex:1, minWidth:0 }}>
            <motion.div
              animate={hov ? { scale:1.1, rotate:[-4,4,-2,0] } : {}}
              transition={{ duration:0.35 }}
              style={{ width:48, height:48, borderRadius:15, flexShrink:0, background:`linear-gradient(135deg,${s.accent}22,${s.accent}08)`, border:`1px solid ${s.accent}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}
            >{s.emoji}</motion.div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#3D1A00", lineHeight:1.25, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.name}</div>
              <div style={{ fontSize:11, color:"rgba(120,53,15,0.5)", marginTop:2 }}>{s.type}</div>
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5, flexShrink:0, marginLeft:8 }}>
            <div style={{ fontSize:9, fontWeight:800, padding:"3px 9px", borderRadius:99, background:s.open?"rgba(22,163,74,0.12)":"rgba(220,38,38,0.1)", color:s.open?"#16A34A":"#DC2626", border:`1px solid ${s.open?"rgba(22,163,74,0.25)":"rgba(220,38,38,0.2)"}`, letterSpacing:"0.04em" }}>
              {s.open ? "● Open" : "● Closed"}
            </div>
            <motion.button whileTap={{ scale:0.8 }} onClick={e=>{ e.stopPropagation(); onSave(s.id); }}
              style={{ background:"none", border:"none", cursor:"pointer", fontSize:16, lineHeight:1 }}>
              {saved ? "❤️" : "🤍"}
            </motion.button>
          </div>
        </div>

        {/* Tags */}
        <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:11 }}>
          {s.tags.map(t => <span key={t} className="card-tag" style={{ background:`${s.accent}14`, color:s.accent, border:`1px solid ${s.accent}28` }}>{t}</span>)}
        </div>

        {/* 3-stat grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:7, marginBottom:11 }}>
          {[{i:"💸",l:"Price",v:`₹${s.price}`},{i:"📍",l:"Dist.",v:`${s.dist}km`},{i:"⭐",l:"Rating",v:s.rating}].map(st => (
            <div key={st.l} style={{ background:"rgba(255,255,255,0.65)", borderRadius:10, padding:"8px 5px", textAlign:"center", border:"1px solid rgba(120,53,15,0.08)" }}>
              <div style={{ fontSize:13, marginBottom:2 }}>{st.i}</div>
              <div style={{ fontSize:11, fontWeight:800, color:"#3D1A00" }}>{st.v}</div>
              <div style={{ fontSize:9, color:"rgba(120,53,15,0.38)", marginTop:1 }}>{st.l}</div>
            </div>
          ))}
        </div>

        <CrowdBar v={s.crowd} />

        {/* Seating + popular */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", margin:"10px 0 11px" }}>
          <span style={{ fontSize:11, fontWeight:700, color:s.seats>6?"#16A34A":s.seats>0?"#D97706":"#DC2626" }}>
            🪑 {s.seats>0?`${s.seats} seats free`:"No seats"}
          </span>
          <span style={{ fontSize:11, color:"rgba(120,53,15,0.55)", fontWeight:500 }}>🏆 {s.popular}</span>
        </div>

        {/* Rating row */}
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:13 }}>
          <Stars r={s.rating} />
          <span style={{ fontSize:11, fontWeight:800, color:"#3D1A00" }}>{s.rating}</span>
          <span style={{ fontSize:10, color:"rgba(120,53,15,0.4)" }}>({s.votes})</span>
        </div>

        <motion.button
          whileHover={{ scale:1.015 }} whileTap={{ scale:0.97 }}
          className="btn-cta" style={{ width:"100%", fontSize:13 }}>
          View Details →
        </motion.button>
      </div>
    </motion.article>
  );
}

/* ═══════════════════════════════════════════════════════════
   FILTER SIDEBAR
═══════════════════════════════════════════════════════════ */
function FilterSidebar({ filters, setFilters, onReset }) {
  const { budget, types, crowd, dist } = filters;

  const toggle = (key, val) =>
    setFilters(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(x=>x!==val) : [...f[key], val],
    }));

  const pct = Math.round(((budget - 50) / 450) * 100);

  return (
    <motion.aside
      initial={{ x:-32, opacity:0 }}
      animate={{ x:0, opacity:1 }}
      transition={{ duration:0.6, ease:[0.16,1,0.3,1] }}
      style={{
        width:260, flexShrink:0,
        borderRadius:22, padding:"22px 20px",
        background:"rgba(255,252,246,0.88)",
        border:"1px solid rgba(120,53,15,0.1)",
        backdropFilter:"blur(20px)",
        boxShadow:"0 8px 32px rgba(120,53,15,0.1), 0 1px 0 rgba(255,255,255,0.9)",
        alignSelf:"flex-start",
        position:"sticky", top:76,
      }}
    >
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
        <span style={{ fontFamily:"'Fraunces', serif", fontSize:17, fontWeight:700, color:"#3D1A00" }}>🎛 Filters</span>
        <button onClick={onReset} style={{ fontSize:11, color:"rgba(232,82,26,0.8)", fontWeight:700, background:"none", border:"none", cursor:"pointer", fontFamily:"'Bricolage Grotesque',sans-serif" }}>Reset all</button>
      </div>

      {/* Budget */}
      <div style={{ marginBottom:22 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
          <span style={{ fontSize:12, fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase", color:"rgba(120,53,15,0.5)" }}>Max Budget</span>
          <span style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:700, color:"#E8521A" }}>₹{budget}</span>
        </div>
        <input type="range" className="ff-slider" min={50} max={500} step={5}
          value={budget} style={{ "--v":`${pct}%` }}
          onChange={e => setFilters(f=>({...f, budget:Number(e.target.value)}))} />
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
          <span style={{ fontSize:10, color:"rgba(120,53,15,0.35)" }}>₹50</span>
          <span style={{ fontSize:10, color:"rgba(120,53,15,0.35)" }}>₹500</span>
        </div>
        {/* Quick picks */}
        <div style={{ display:"flex", gap:6, marginTop:10, flexWrap:"wrap" }}>
          {[100,200,300,500].map(v => (
            <button key={v} onClick={()=>setFilters(f=>({...f,budget:v}))}
              style={{ fontSize:11, padding:"4px 10px", borderRadius:99, cursor:"pointer", fontFamily:"'Bricolage Grotesque',sans-serif", fontWeight:700, transition:"all 0.18s",
                border:`1.5px solid ${budget===v?"rgba(232,82,26,0.45)":"rgba(120,53,15,0.14)"}`,
                background: budget===v?"rgba(232,82,26,0.1)":"rgba(255,255,255,0.65)",
                color: budget===v?"#E8521A":"rgba(120,53,15,0.55)",
              }}>₹{v}</button>
          ))}
        </div>
      </div>

      <Divider />

      {/* Food Type */}
      <FilterGroup label="Food Type">
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {FOOD_TYPES.map(t => (
            <button key={t} className={`pill ${types.includes(t)?"pill-on":"pill-off"}`}
              onClick={()=>toggle("types",t)}>{t}</button>
          ))}
        </div>
      </FilterGroup>

      <Divider />

      {/* Crowd Level */}
      <FilterGroup label="Crowd Level">
        <div style={{ display:"flex", gap:6 }}>
          {CROWD_OPTS.map((c,i) => {
            const colors = ["#16A34A","#D97706","#DC2626"];
            const on = crowd.includes(c);
            return (
              <button key={c} onClick={()=>toggle("crowd",c)}
                style={{ flex:1, padding:"8px 4px", borderRadius:12, border:`1.5px solid ${on?colors[i]+"55":"rgba(120,53,15,0.13)"}`, background:on?`${colors[i]}14`:"rgba(255,255,255,0.65)", color:on?colors[i]:"rgba(120,53,15,0.55)", fontSize:11, fontWeight:700, cursor:"pointer", transition:"all 0.2s", fontFamily:"'Bricolage Grotesque',sans-serif", boxShadow:on?`0 0 0 3px ${colors[i]}18`:"none" }}>
                {["🟢","🟡","🔴"][i]} {c}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <Divider />

      {/* Distance */}
      <FilterGroup label="Distance">
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {DIST_OPTS.map(d => {
            const on = dist===d;
            return (
              <button key={d} onClick={()=>setFilters(f=>({...f,dist:on?null:d}))}
                style={{ width:"100%", padding:"9px 14px", borderRadius:12, border:`1.5px solid ${on?"rgba(232,82,26,0.45)":"rgba(120,53,15,0.13)"}`, background:on?"rgba(232,82,26,0.1)":"rgba(255,255,255,0.65)", color:on?"#E8521A":"rgba(120,53,15,0.6)", fontSize:12, fontWeight:700, cursor:"pointer", transition:"all 0.2s", fontFamily:"'Bricolage Grotesque',sans-serif", textAlign:"left", boxShadow:on?"0 0 0 3px rgba(232,82,26,0.1)":"none", display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:13 }}>{["🚶","🏃","🚲"][DIST_OPTS.indexOf(d)]}</span>
                {d} <span style={{ marginLeft:"auto", fontSize:10, color:"rgba(120,53,15,0.4)", fontWeight:400 }}>{["~5min","~12min","~25min"][DIST_OPTS.indexOf(d)]}</span>
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <Divider />

      {/* Open now toggle */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize:13, fontWeight:600, color:"rgba(120,53,15,0.7)" }}>Open Now Only</span>
        <div
          onClick={()=>setFilters(f=>({...f,openOnly:!f.openOnly}))}
          style={{ width:42, height:24, borderRadius:99, cursor:"pointer", transition:"all 0.25s", background:filters.openOnly?"linear-gradient(135deg,#E8521A,#F97316)":"rgba(120,53,15,0.15)", display:"flex", alignItems:"center", padding:"3px 4px", boxShadow:filters.openOnly?"0 3px 10px rgba(232,82,26,0.35)":"none" }}
        >
          <motion.div
            animate={{ x: filters.openOnly ? 18 : 0 }}
            transition={{ type:"spring", stiffness:400, damping:28 }}
            style={{ width:18, height:18, borderRadius:"50%", background:"white", boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }}
          />
        </div>
      </div>
    </motion.aside>
  );
}

function Divider() {
  return <div style={{ height:1, background:"rgba(120,53,15,0.08)", margin:"16px 0" }} />;
}
function FilterGroup({ label, children }) {
  return (
    <div style={{ marginBottom:4 }}>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase", color:"rgba(120,53,15,0.45)", marginBottom:10 }}>{label}</div>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BUDGET SUGGESTION STRIP
═══════════════════════════════════════════════════════════ */
function BudgetStrip({ onBudgetPick }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
      {BUDGET_PICKS.map((b,i) => (
        <motion.div key={b.label}
          initial={{ opacity:0, y:20 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          transition={{ delay:i*0.1, duration:0.5, ease:[0.16,1,0.3,1] }}
          whileHover={{ y:-7, scale:1.025 }}
          onClick={() => onBudgetPick(b.max)}
          style={{ borderRadius:18, padding:"18px 18px 16px", cursor:"pointer", position:"relative", overflow:"hidden",
            background:"rgba(255,252,246,0.9)", border:"1px solid rgba(120,53,15,0.1)",
            boxShadow:"0 6px 22px rgba(120,53,15,0.1)", transition:"box-shadow 0.3s" }}
        >
          <div style={{ position:"absolute", top:0, left:0, right:0, height:2.5, background:`linear-gradient(90deg,transparent,${b.color},transparent)` }} />
          <div style={{ position:"absolute", top:-25, right:-25, width:110, height:110, borderRadius:"50%", background:`radial-gradient(circle,${b.color}18,transparent 70%)`, pointerEvents:"none" }} />
          <div style={{ position:"relative", zIndex:2 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <span style={{ fontSize:28 }}>{b.emoji}</span>
              <span style={{ fontSize:10, fontWeight:800, padding:"3px 9px", borderRadius:99, background:`${b.color}18`, color:b.color, border:`1px solid ${b.color}30` }}>Quick Pick</span>
            </div>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:19, fontWeight:700, color:"#3D1A00", marginBottom:4 }}>{b.label}</div>
            <div style={{ fontSize:11, color:"rgba(120,53,15,0.5)", marginBottom:12, lineHeight:1.5 }}>{b.desc}</div>
            <div style={{ padding:"9px 11px", borderRadius:11, background:"rgba(255,255,255,0.65)", border:"1px solid rgba(120,53,15,0.08)" }}>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase", color:"rgba(120,53,15,0.4)", marginBottom:4 }}>Top Pick</div>
              <div style={{ fontSize:13, fontWeight:700, color:"#3D1A00" }}>{b.topPick}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAP PREVIEW CARD
═══════════════════════════════════════════════════════════ */
function MapPreview() {
  const [hovered, setHovered] = useState(null);

  return (
    <motion.div
      initial={{ opacity:0, y:20 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true }}
      style={{ borderRadius:22, padding:"20px 20px 18px", background:"rgba(255,252,246,0.9)", border:"1px solid rgba(120,53,15,0.1)", boxShadow:"0 8px 28px rgba(120,53,15,0.1)", overflow:"hidden" }}
    >
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <div>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:700, color:"#3D1A00", marginBottom:2 }}>🗺️ Nearby Map</div>
          <div style={{ fontSize:11, color:"rgba(120,53,15,0.5)" }}>6 shops within 1.5 km of you</div>
        </div>
        <button className="btn-outline" style={{ fontSize:11, padding:"7px 14px" }}>Open Full Map →</button>
      </div>

      {/* map canvas */}
      <div style={{ borderRadius:16, overflow:"hidden", height:200, position:"relative", background:"linear-gradient(135deg,#E8F5E9 0%,#F1F8E9 50%,#E3F2FD 100%)", border:"1px solid rgba(120,53,15,0.08)" }}>
        {/* road lines */}
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.35 }}>
          <line x1="0" y1="52%" x2="100%" y2="50%" stroke="#B0BEC5" strokeWidth="3" />
          <line x1="37%" y1="0" x2="42%" y2="100%" stroke="#B0BEC5" strokeWidth="3" />
          <line x1="0" y1="75%" x2="100%" y2="78%" stroke="#CFD8DC" strokeWidth="1.5" strokeDasharray="5 8" />
          <line x1="65%" y1="0" x2="68%" y2="100%" stroke="#CFD8DC" strokeWidth="1.5" strokeDasharray="5 8" />
        </svg>
        {/* grid */}
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.07 }}>
          <defs><pattern id="mg" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 L 0 0 0 30" fill="none" stroke="#37474F" strokeWidth="0.5"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#mg)"/>
        </svg>

        {/* User pin */}
        <div style={{ position:"absolute", left:"49%", top:"49%", transform:"translate(-50%,-50%)", zIndex:10 }}>
          <div style={{ width:16, height:16, borderRadius:"50%", background:"#1565C0", border:"3px solid white", boxShadow:"0 0 0 5px rgba(21,101,192,0.2)" }} />
        </div>

        {/* Shop pins */}
        {MAP_PINS.map((p,i) => (
          <div key={i} onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)}
            style={{ position:"absolute", left:`${p.x}%`, top:`${p.y}%`, transform:"translate(-50%,-50%)", cursor:"pointer", zIndex:5 }}>
            <motion.div
              animate={{ y:[0,-5,0] }}
              transition={{ duration:2.5+i*0.4, repeat:Infinity, ease:"easeInOut", delay:i*0.35 }}
              style={{ width:30, height:30, borderRadius:"50% 50% 50% 0", transform:"rotate(-45deg)", background:`linear-gradient(135deg,${cc(p.s.crowd)},${cc(p.s.crowd)}cc)`, border:"2.5px solid white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, boxShadow:`0 4px 12px ${cc(p.s.crowd)}55` }}>
              <span style={{ transform:"rotate(45deg)", display:"block" }}>{p.s.emoji}</span>
            </motion.div>
            <AnimatePresence>
              {hovered===i && (
                <motion.div initial={{ opacity:0, y:5, scale:0.9 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:5, scale:0.9 }} transition={{ duration:0.15 }}
                  style={{ position:"absolute", bottom:"115%", left:"50%", transform:"translateX(-50%)", background:"rgba(255,252,246,0.97)", border:"1px solid rgba(120,53,15,0.15)", borderRadius:10, padding:"6px 10px", fontSize:10, fontWeight:700, whiteSpace:"nowrap", color:"#3D1A00", zIndex:99, boxShadow:"0 4px 14px rgba(120,53,15,0.15)" }}>
                  {p.s.emoji} {p.s.name}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display:"flex", gap:16, marginTop:12 }}>
        {[["#16A34A","Calm"],["#D97706","Moderate"],["#DC2626","Packed"],["#1565C0","You"]].map(([c,l]) => (
          <div key={l} style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:c }} />
            <span style={{ fontSize:10, color:"rgba(120,53,15,0.5)", fontWeight:600 }}>{l}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   NAV BAR
═══════════════════════════════════════════════════════════ */
function NavBar() {
  const [search, setSearch] = useState("");
  return (
    <motion.header
      initial={{ y:-56, opacity:0 }}
      animate={{ y:0, opacity:1 }}
      transition={{ duration:0.6, ease:[0.16,1,0.3,1] }}
      style={{ position:"sticky", top:0, zIndex:50, display:"flex", alignItems:"center", gap:14, padding:"0 24px", height:62, background:"rgba(254,251,246,0.82)", backdropFilter:"blur(24px)", borderBottom:"1px solid rgba(120,53,15,0.1)", boxShadow:"0 1px 0 rgba(255,255,255,0.8)" }}
    >
      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
        <div style={{ width:34, height:34, borderRadius:11, background:"linear-gradient(135deg,#E8521A,#F97316)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, boxShadow:"0 4px 14px rgba(232,82,26,0.38)" }}>🍴</div>
        <span style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:700, color:"#3D1A00" }}>
          Food<span style={{ color:"#E8521A" }}>Finder</span>
        </span>
      </div>

      {/* Nav links */}
      <div style={{ display:"flex", alignItems:"center", gap:4, marginLeft:4 }}>
        {["Explore","Nearby","Saved","Orders"].map((t,i) => (
          <a key={t} href="#" style={{ padding:"6px 13px", borderRadius:10, fontSize:13, fontWeight:600, color:i===0?"#E8521A":"rgba(120,53,15,0.5)", background:i===0?"rgba(232,82,26,0.1)":"transparent", textDecoration:"none", transition:"all 0.2s", boxShadow:i===0?"0 0 0 1px rgba(232,82,26,0.28)":"none" }}
            onMouseEnter={e=>{ if(i!==0) e.target.style.color="rgba(120,53,15,0.75)"; }}
            onMouseLeave={e=>{ if(i!==0) e.target.style.color="rgba(120,53,15,0.5)"; }}
          >{t}</a>
        ))}
      </div>

      {/* Search */}
      <div style={{ flex:1, maxWidth:340, position:"relative" }}>
        <span style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", fontSize:14, opacity:0.45 }}>🔍</span>
        <input className="ff-search" placeholder="Search food or shop name…" value={search} onChange={e=>setSearch(e.target.value)} />
      </div>

      <div style={{ flex:1 }} />

      {/* Location */}
      <div style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 12px", borderRadius:11, background:"rgba(255,255,255,0.75)", border:"1px solid rgba(120,53,15,0.12)", cursor:"pointer", flexShrink:0, boxShadow:"0 2px 8px rgba(120,53,15,0.07)" }}>
        <span style={{ fontSize:13 }}>📍</span>
        <span style={{ fontSize:12, fontWeight:600, color:"rgba(120,53,15,0.7)", maxWidth:130, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>Hazratganj, Lucknow</span>
        <span style={{ fontSize:10, color:"rgba(120,53,15,0.4)" }}>▾</span>
      </div>

      {/* Notification + Avatar */}
      <div style={{ position:"relative" }}>
        <div style={{ width:36, height:36, borderRadius:11, background:"rgba(255,255,255,0.75)", border:"1px solid rgba(120,53,15,0.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, cursor:"pointer" }}>🔔</div>
        <div style={{ position:"absolute", top:5, right:5, width:7, height:7, borderRadius:"50%", background:"#E8521A", border:"2px solid #FEFBF6" }} />
      </div>
      <div style={{ width:36, height:36, borderRadius:11, background:"linear-gradient(135deg,#E8521A,#F59E0B)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:800, color:"#fff", cursor:"pointer", boxShadow:"0 3px 12px rgba(232,82,26,0.3)", flexShrink:0 }}>A</div>
    </motion.header>
  );
}

/* ═══════════════════════════════════════════════════════════
   RESULTS BAR
═══════════════════════════════════════════════════════════ */
function ResultsBar({ count, sort, setSort, view, setView }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 0 2px", flexWrap:"wrap", gap:10 }}>
      <div>
        <span style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:700, color:"#3D1A00" }}>{count} Shops Found</span>
        <span style={{ fontSize:12, color:"rgba(120,53,15,0.45)", marginLeft:10 }}>near Hazratganj, Lucknow</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        {/* Sort */}
        <div style={{ display:"flex", background:"rgba(255,255,255,0.7)", borderRadius:12, padding:3, border:"1px solid rgba(120,53,15,0.1)", gap:2 }}>
          {SORT_OPTS.map(s => (
            <button key={s} className={`sort-btn ${sort===s?"sort-on":"sort-off"}`}
              onClick={()=>setSort(s)}>{s}</button>
          ))}
        </div>
        {/* View toggle */}
        <div style={{ display:"flex", gap:4, background:"rgba(255,255,255,0.7)", borderRadius:10, padding:"4px", border:"1px solid rgba(120,53,15,0.1)" }}>
          {[["⊞","grid"],["☰","list"]].map(([icon,v]) => (
            <button key={v} onClick={()=>setView(v)}
              style={{ width:32, height:32, borderRadius:7, border:"none", cursor:"pointer", fontSize:14, background:view===v?"linear-gradient(135deg,#E8521A,#F97316)":"transparent", color:view===v?"white":"rgba(120,53,15,0.55)", transition:"all 0.2s", boxShadow:view===v?"0 2px 8px rgba(232,82,26,0.3)":"none" }}>
              {icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE HERO STRIP
═══════════════════════════════════════════════════════════ */
function HeroStrip({ totalFiltered }) {
  return (
    <motion.div
      initial={{ opacity:0, y:16 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay:0.1, duration:0.6, ease:[0.16,1,0.3,1] }}
      style={{ borderRadius:22, padding:"24px 32px", background:"linear-gradient(135deg,rgba(232,82,26,0.06),rgba(249,115,22,0.04))", border:"1px solid rgba(232,82,26,0.14)", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16, position:"relative", overflow:"hidden" }}
    >
      <div style={{ position:"absolute", top:-40, right:-40, width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle,rgba(232,82,26,0.08),transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"relative", zIndex:2 }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"5px 12px", borderRadius:99, background:"rgba(22,163,74,0.1)", border:"1px solid rgba(22,163,74,0.22)", marginBottom:10 }}>
          <div style={{ position:"relative", width:7, height:7 }}>
            <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"#16A34A", animation:"pulse-live 1.8s ease-out infinite" }} />
            <div style={{ width:7, height:7, borderRadius:"50%", background:"#16A34A" }} />
          </div>
          <span style={{ fontSize:11, fontWeight:700, color:"#16A34A" }}>Live — {totalFiltered} shops active near you</span>
        </div>
        <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:"clamp(22px,3vw,28px)", fontWeight:700, color:"#3D1A00", lineHeight:1.2 }}>
          Best Food Near <span style={{ color:"#E8521A" }}>Hazratganj</span>
        </h1>
        <p style={{ fontSize:13, color:"rgba(120,53,15,0.55)", marginTop:5 }}>Explore local favourites — matched to your budget, live crowd & seating data.</p>
      </div>
      <div style={{ display:"flex", gap:20, position:"relative", zIndex:2 }}>
        {[{e:"⚡",v:"8 min",l:"Avg wait"},{e:"📍",v:"0.2 km",l:"Nearest"},{e:"🌟",v:"4.9★",l:"Top rated"}].map(s => (
          <div key={s.l} style={{ textAlign:"center" }}>
            <div style={{ fontSize:18, marginBottom:4 }}>{s.e}</div>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:15, fontWeight:700, color:"#3D1A00" }}>{s.v}</div>
            <div style={{ fontSize:10, color:"rgba(120,53,15,0.45)" }}>{s.l}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT PAGE
═══════════════════════════════════════════════════════════ */
const DEFAULT_FILTERS = { budget:300, types:[], crowd:[], dist:null, openOnly:false };

export default function FoodFinderListings() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort]       = useState("Relevance");
  const [view, setView]       = useState("grid");
  const [saved, setSaved]     = useState(new Set());

  const toggleSave = id => setSaved(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  // Filtering
  const filtered = useMemo(() => {
    let shops = [...ALL_SHOPS];

    shops = shops.filter(s => s.price <= filters.budget);

    if (filters.types.length) {
      shops = shops.filter(s =>
        filters.types.some(t => {
          if (t === "Café") return s.type === "Café";
          if (t === "Street Food") return s.type === "Street Food";
          if (t === "Fast Food") return s.type === "Fast Food";
          if (t === "Desserts") return s.type === "Desserts";
          if (t === "Veg") return s.tags.some(tg => tg.toLowerCase().includes("veg"));
          if (t === "Non-Veg") return !s.tags.some(tg => tg.toLowerCase() === "veg");
          return true;
        })
      );
    }

    if (filters.crowd.length) {
      shops = shops.filter(s => {
        const lv = s.crowd < 40 ? "Low" : s.crowd < 65 ? "Medium" : "High";
        return filters.crowd.includes(lv);
      });
    }

    if (filters.dist) {
      const maxDist = filters.dist === "< 500m" ? 0.5 : filters.dist === "< 1 km" ? 1.0 : 2.0;
      shops = shops.filter(s => s.dist <= maxDist);
    }

    if (filters.openOnly) shops = shops.filter(s => s.open);

    // Sort
    if (sort === "Rating")   shops.sort((a,b) => b.rating - a.rating);
    if (sort === "Distance") shops.sort((a,b) => a.dist - b.dist);
    if (sort === "Price ↑")  shops.sort((a,b) => a.price - b.price);
    if (sort === "Price ↓")  shops.sort((a,b) => b.price - a.price);
    if (sort === "Crowd ↓")  shops.sort((a,b) => a.crowd - b.crowd);

    return shops;
  }, [filters, sort]);

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg,#FEFBF6)", position:"relative", zIndex:1 }}>
      <GlobalStyles />

      {/* Ambient background glows */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:"5%", left:"20%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(232,82,26,0.05),transparent 70%)", filter:"blur(70px)" }} />
        <div style={{ position:"absolute", bottom:"15%", right:"10%", width:380, height:380, borderRadius:"50%", background:"radial-gradient(circle,rgba(245,158,11,0.06),transparent 70%)", filter:"blur(55px)" }} />
        <div style={{ position:"absolute", top:"45%", left:"55%", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,rgba(22,163,74,0.04),transparent 70%)", filter:"blur(50px)" }} />
      </div>

      {/* Nav */}
      <div style={{ position:"relative", zIndex:10 }}><NavBar /></div>

      {/* Main */}
      <main style={{ position:"relative", zIndex:2, padding:"22px 24px 48px", maxWidth:1380, margin:"0 auto" }}>

        {/* Hero strip */}
        <div style={{ marginBottom:22 }}><HeroStrip totalFiltered={filtered.length} /></div>

        {/* Budget quick suggestions */}
        <section style={{ marginBottom:26 }}>
          <SectionLabel title="💡 Budget-Smart Picks" sub="Click to filter by budget" />
          <BudgetStrip onBudgetPick={v => setFilters(f=>({...f, budget:v}))} />
        </section>

        {/* Main 2-col layout */}
        <div style={{ display:"flex", gap:22, alignItems:"flex-start" }}>

          {/* Filter sidebar */}
          <FilterSidebar filters={filters} setFilters={setFilters} onReset={resetFilters} />

          {/* Content area */}
          <div style={{ flex:1, minWidth:0 }}>

            {/* Results bar */}
            <div style={{ marginBottom:18 }}>
              <ResultsBar count={filtered.length} sort={sort} setSort={setSort} view={view} setView={setView} />
            </div>

            {/* Active filter chips */}
            <ActiveFilterChips filters={filters} setFilters={setFilters} />

            {/* Shop grid / list */}
            <AnimatePresence mode="wait">
              {filtered.length === 0 ? (
                <motion.div key="empty" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  style={{ textAlign:"center", padding:"64px 24px", borderRadius:22, background:"rgba(255,252,246,0.8)", border:"1px solid rgba(120,53,15,0.1)" }}>
                  <div style={{ fontSize:48, marginBottom:14 }}>🍽️</div>
                  <div style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:700, color:"#3D1A00", marginBottom:8 }}>No shops match your filters</div>
                  <p style={{ fontSize:13, color:"rgba(120,53,15,0.5)", marginBottom:18 }}>Try adjusting your budget, distance, or food type filters.</p>
                  <button className="btn-cta" onClick={resetFilters}>Clear All Filters</button>
                </motion.div>
              ) : (
                <motion.div key="grid"
                  style={{
                    display:"grid",
                    gridTemplateColumns: view==="grid" ? "repeat(auto-fill, minmax(280px,1fr))" : "1fr",
                    gap:16,
                  }}
                >
                  {filtered.map((s,i) => (
                    <ShopCard key={s.id} shop={s} idx={i} saved={saved.has(s.id)} onSave={toggleSave} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Map preview below cards */}
            {filtered.length > 0 && (
              <div style={{ marginTop:28 }}>
                <SectionLabel title="🗺️ Map Preview" sub="See shops plotted by crowd level" />
                <MapPreview />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop:"1px solid rgba(120,53,15,0.1)", padding:"22px 24px", background:"rgba(254,251,246,0.9)", backdropFilter:"blur(12px)", position:"relative", zIndex:2 }}>
        <div style={{ maxWidth:1380, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:9, background:"linear-gradient(135deg,#E8521A,#F97316)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🍴</div>
            <span style={{ fontFamily:"'Fraunces',serif", fontSize:15, fontWeight:700, color:"#3D1A00" }}>Food<span style={{ color:"#E8521A" }}>Finder</span></span>
          </div>
          <span style={{ fontSize:11, color:"rgba(120,53,15,0.35)" }}>© 2025 FoodFinder Technologies · Made with ❤️ for food lovers across India</span>
          <div style={{ display:"flex", gap:14 }}>
            {["Privacy","Terms","Support"].map(l => (
              <a key={l} href="#" style={{ fontSize:11, color:"rgba(120,53,15,0.4)", textDecoration:"none", fontWeight:600, transition:"color 0.2s" }}
                onMouseEnter={e=>e.target.style.color="#E8521A"}
                onMouseLeave={e=>e.target.style.color="rgba(120,53,15,0.4)"}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SMALL HELPERS
═══════════════════════════════════════════════════════════ */
function SectionLabel({ title, sub }) {
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:3 }}>
        <div style={{ width:18, height:2, borderRadius:99, background:"#E8521A" }} />
        <span style={{ fontSize:13, fontWeight:800, color:"#E8521A", letterSpacing:"0.02em" }}>{title}</span>
      </div>
      {sub && <p style={{ fontSize:12, color:"rgba(120,53,15,0.45)" }}>{sub}</p>}
    </div>
  );
}

function ActiveFilterChips({ filters, setFilters }) {
  const chips = [];
  if (filters.budget < 300) chips.push({ label:`≤ ₹${filters.budget}`, key:"budget", clear:()=>setFilters(f=>({...f,budget:300})) });
  filters.types.forEach(t => chips.push({ label:t, key:`type-${t}`, clear:()=>setFilters(f=>({...f,types:f.types.filter(x=>x!==t)})) }));
  filters.crowd.forEach(c => chips.push({ label:`${c} crowd`, key:`crowd-${c}`, clear:()=>setFilters(f=>({...f,crowd:f.crowd.filter(x=>x!==c)})) }));
  if (filters.dist) chips.push({ label:filters.dist, key:"dist", clear:()=>setFilters(f=>({...f,dist:null})) });
  if (filters.openOnly) chips.push({ label:"Open Now", key:"open", clear:()=>setFilters(f=>({...f,openOnly:false})) });

  if (!chips.length) return null;
  return (
    <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:16 }}>
      {chips.map(c => (
        <motion.div key={c.key} initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.8, opacity:0 }}
          style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 12px 5px 10px", borderRadius:99, background:"rgba(232,82,26,0.1)", border:"1.5px solid rgba(232,82,26,0.3)", fontSize:11, fontWeight:700, color:"#E8521A" }}>
          {c.label}
          <button onClick={c.clear} style={{ background:"none", border:"none", cursor:"pointer", fontSize:12, color:"rgba(232,82,26,0.7)", lineHeight:1, padding:0 }}>✕</button>
        </motion.div>
      ))}
    </div>
  );
}
