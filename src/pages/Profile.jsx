import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useNavigate } from "react-router-dom";


/* ═══════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════ */
const GS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;0,9..144,800;1,9..144,400&family=Geist:wght@300;400;500;600;700&display=swap');

    :root {
      --bg:     #07090F;
      --bg2:    #0C0F18;
      --bg3:    #111520;
      --orange: #F05A1A;
      --ora2:   #FF7C3A;
      --amber:  #F5A800;
      --gold:   #FFD060;
      --green:  #22C55E;
      --red:    #EF4444;
      --blue:   #3B82F6;
      --t1:     rgba(255,246,232,0.96);
      --t2:     rgba(255,210,150,0.60);
      --t3:     rgba(255,200,130,0.28);
      --bdr:    rgba(255,150,70,0.10);
      --bdr2:   rgba(255,255,255,0.06);
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      background: var(--bg);
      font-family: 'Geist', sans-serif;
      color: var(--t1);
      min-height: 100vh;
      overflow-x: hidden;
    }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: rgba(240,90,26,0.35); border-radius: 99px; }

    body::before {
      content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.028;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
    }

    .glass {
      background: rgba(16,18,28,0.82);
      backdrop-filter: blur(22px) saturate(160%);
      -webkit-backdrop-filter: blur(22px) saturate(160%);
      border: 1px solid var(--bdr);
    }

    .ff-input {
      width: 100%; padding: 12px 16px;
      border-radius: 13px; border: 1.5px solid rgba(255,150,70,0.14);
      background: rgba(255,255,255,0.04); color: var(--t1);
      font-size: 14px; font-family: 'Geist', sans-serif;
      outline: none; transition: all 0.25s; caret-color: var(--orange);
    }
    .ff-input::placeholder { color: var(--t3); }
    .ff-input:focus {
      border-color: rgba(240,90,26,0.55);
      background: rgba(255,255,255,0.06);
      box-shadow: 0 0 0 4px rgba(240,90,26,0.10);
    }

    .btn-primary {
      display: inline-flex; align-items: center; justify-content: center; gap: 7px;
      padding: 11px 20px; border-radius: 13px; border: none; cursor: pointer;
      background: linear-gradient(135deg, var(--orange), var(--ora2));
      color: white; font-size: 13px; font-weight: 700;
      font-family: 'Geist', sans-serif;
      box-shadow: 0 6px 22px rgba(240,90,26,0.38), inset 0 1px 0 rgba(255,255,255,0.18);
      transition: all 0.2s; position: relative; overflow: hidden;
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(240,90,26,0.48); }
    .btn-primary:active { transform: scale(0.97); }
    .btn-primary::after {
      content: ''; position: absolute; top: -50%; left: -100%; width: 50%; height: 200%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transform: skewX(-20deg); animation: shimmer 3.5s ease-in-out infinite 1s;
    }

    .btn-outline {
      display: inline-flex; align-items: center; justify-content: center; gap: 7px;
      padding: 10px 18px; border-radius: 12px;
      border: 1.5px solid rgba(255,150,70,0.18);
      background: rgba(255,255,255,0.04); color: var(--t2);
      font-size: 13px; font-weight: 600; font-family: 'Geist', sans-serif;
      cursor: pointer; backdrop-filter: blur(8px); transition: all 0.2s;
    }
    .btn-outline:hover {
      border-color: rgba(240,90,26,0.48); color: var(--ora2);
      background: rgba(240,90,26,0.08); transform: translateY(-1px);
    }
    .btn-danger {
      display: inline-flex; align-items: center; justify-content: center; gap: 7px;
      padding: 10px 18px; border-radius: 12px;
      border: 1.5px solid rgba(239,68,68,0.25);
      background: rgba(239,68,68,0.08); color: rgba(239,68,68,0.85);
      font-size: 13px; font-weight: 600; font-family: 'Geist', sans-serif;
      cursor: pointer; transition: all 0.2s;
    }
    .btn-danger:hover {
      border-color: rgba(239,68,68,0.5); background: rgba(239,68,68,0.15);
      color: #EF4444; transform: translateY(-1px);
    }

    .nav-tab {
      padding: 8px 18px; border-radius: 10px; border: none;
      font-size: 13px; font-weight: 600; cursor: pointer;
      font-family: 'Geist', sans-serif; transition: all 0.2s;
    }
    .nav-active { background: rgba(240,90,26,0.18); color: var(--ora2); box-shadow: 0 0 0 1px rgba(240,90,26,0.35); }
    .nav-idle   { background: transparent; color: var(--t3); }
    .nav-idle:hover { background: rgba(255,255,255,0.04); color: var(--t2); }

    @keyframes shimmer   { 0%{left:-100%} 100%{left:200%} }
    @keyframes pulse-dot { 0%,100%{transform:scale(1);opacity:.8} 50%{transform:scale(1.7);opacity:0} }
    @keyframes halo-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes halo-rev  { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
    @keyframes float-orb { 0%,100%{transform:translate(0,0)} 33%{transform:translate(30px,-22px)} 66%{transform:translate(-18px,15px)} }
    @keyframes float-ob2 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(-38px,20px)} 66%{transform:translate(22px,-32px)} }
    @keyframes bar-grow  { from{width:0} to{width:var(--w,60%)} }

    .stat-bar { animation: bar-grow 1s cubic-bezier(0.16,1,0.3,1) forwards; }
  `}</style>
);

/* ═══════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════ */
const USER = {
  name:      "Aryan Sharma",
  handle:    "@aryan_foodie",
  email:     "aryan.sharma@gmail.com",
  phone:     "+91 98765 43210",
  location:  "Hazratganj, Lucknow",
  joined:    "March 2023",
  bio:       "Passionate foodie exploring the best local eats in Lucknow. Always hunting for hidden gems and budget-friendly bites! 🍛",
  avatar:    "AS",
  level:     "Gold Foodie",
  xp:        3420,
  xpNext:    4000,
  stats: { reviews:47, saved:23, visited:128, orders:31 },
};

const SAVED_SHOPS_INIT = [
  { id:1, name:"Sharma Ji Ka Dhaba",  type:"North Indian",  price:95,  rating:4.8, dist:"0.3 km", emoji:"🍛", accent:"#F05A1A", saved:"2 days ago"  },
  { id:2, name:"Green Bowl Café",      type:"Café & Salads", price:185, rating:4.9, dist:"1.1 km", emoji:"🥗", accent:"#22C55E", saved:"1 week ago"  },
  { id:3, name:"Biryani Bros",         type:"Biryani House", price:145, rating:4.6, dist:"0.8 km", emoji:"🍚", accent:"#EF4444", saved:"2 weeks ago" },
  { id:4, name:"Chaat Corner",         type:"Street Food",   price:55,  rating:4.5, dist:"0.5 km", emoji:"🥙", accent:"#F5A800", saved:"3 weeks ago" },
  { id:5, name:"Noodle Nook",          type:"Asian Fusion",  price:130, rating:4.7, dist:"1.4 km", emoji:"🍜", accent:"#06B6D4", saved:"1 month ago" },
];

const ACTIVITY = [
  { id:1, type:"visited",  shop:"Sharma Ji Ka Dhaba",  action:"Visited",      time:"Today, 8:45 AM",        emoji:"🍛", accent:"#F05A1A" },
  { id:2, type:"reviewed", shop:"Biryani Bros",         action:"Left a review", time:"Yesterday, 1:20 PM",   emoji:"🍚", accent:"#EF4444" },
  { id:3, type:"saved",    shop:"FreshLeaf Kitchen",    action:"Saved shop",    time:"2 days ago",            emoji:"🥑", accent:"#22C55E" },
  { id:4, type:"visited",  shop:"Chaat Corner",         action:"Visited",      time:"3 days ago, 6:15 PM",   emoji:"🥙", accent:"#F5A800" },
  { id:5, type:"ordered",  shop:"Noodle Nook",          action:"Ordered online", time:"5 days ago",          emoji:"🍜", accent:"#06B6D4" },
  { id:6, type:"reviewed", shop:"Green Bowl Café",       action:"Left a review", time:"1 week ago",           emoji:"🥗", accent:"#22C55E" },
  { id:7, type:"visited",  shop:"Burger Station",        action:"Visited",      time:"10 days ago, 7:30 PM", emoji:"🍔", accent:"#FB923C" },
];

const BADGES = [
  { icon:"🔥", label:"Streak 7",   desc:"7 days active",    color:"#F05A1A" },
  { icon:"⭐", label:"Top Reviewer", desc:"47 reviews",     color:"#F5A800" },
  { icon:"🎯", label:"Explorer",    desc:"128 shops visited",color:"#3B82F6" },
  { icon:"💰", label:"Budget King", desc:"Smart spender",   color:"#22C55E" },
];

/* ═══════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════ */
function Stars({ r }) {
  return (
    <span style={{ display:"inline-flex", gap:1 }}>
      {[1,2,3,4,5].map(i => <span key={i} style={{ fontSize:11, color:i<=Math.round(r)?"#F5A800":"rgba(255,200,100,0.18)" }}>★</span>)}
    </span>
  );
}

function SectionLabel({ icon, title, count }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
      <span style={{ fontSize:16 }}>{icon}</span>
      <div style={{ width:20, height:2, borderRadius:99, background:"#F05A1A" }} />
      <span style={{ fontSize:11, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", color:"#F05A1A" }}>{title}</span>
      {count !== undefined && (
        <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:99, background:"rgba(240,90,26,0.15)", color:"var(--ora2)", border:"1px solid rgba(240,90,26,0.3)", marginLeft:2 }}>{count}</span>
      )}
    </div>
  );
}

function Divider() {
  return <div style={{ height:1, background:"rgba(255,150,70,0.08)", margin:"6px 0" }} />;
}

/* ═══════════════════════════════════════════════════════════
   NAV BAR
═══════════════════════════════════════════════════════════ */
function NavBar() {
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ y:-56, opacity:0 }}
      animate={{ y:0, opacity:1 }}
      transition={{ duration:0.6, ease:[0.16,1,0.3,1] }}
      style={{ position:"sticky", top:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", height:60, background:"rgba(7,9,15,0.82)", backdropFilter:"blur(22px)", borderBottom:"1px solid rgba(255,150,70,0.08)" }}
    >
      
      {/* LOGO */}
      <div style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }} onClick={() => navigate("/")}>
        <div style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg,#F05A1A,#FF7C3A)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, boxShadow:"0 4px 14px rgba(240,90,26,0.42)" }}>🍴</div>
        <span style={{ fontFamily:"'Fraunces',serif", fontSize:17, fontWeight:700, color:"rgba(255,246,232,0.97)" }}>
          Food<span style={{ color:"#F05A1A" }}>Finder</span>
        </span>
      </div>

      {/* NAV LINKS */}
      <nav style={{ display:"flex", gap:4 }}>
        <button className="nav-tab nav-idle" onClick={() => navigate("/")}>Explore</button>
        <button className="nav-tab nav-idle" onClick={() => navigate("/map")}>Near Me</button>
        <button className="nav-tab nav-idle" onClick={() => navigate("/shops")}>Saved</button>
        <button className="nav-tab nav-active" onClick={() => navigate("/profile")}>Profile</button>
      </nav>

      {/* RIGHT SIDE */}
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        
        <div style={{ position:"relative" }}>
          <div style={{ width:32, height:32, borderRadius:10, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,150,70,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, cursor:"pointer" }}>🔔</div>
          <div style={{ position:"absolute", top:5, right:5, width:6, height:6, borderRadius:"50%", background:"#F05A1A", border:"1.5px solid #07090F" }} />
        </div>

        {/* PROFILE CLICKABLE */}
        <div 
          onClick={() => navigate("/profile")}
          style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg,#F05A1A,#F5A800)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:"white", boxShadow:"0 3px 10px rgba(240,90,26,0.32)", cursor:"pointer" }}
        >
          A
        </div>

      </div>
    </motion.header>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROFILE HERO
═══════════════════════════════════════════════════════════ */
function ProfileHero({ editing, setEditing, form, setForm }) {
  const xpPct = Math.round((USER.xp / USER.xpNext) * 100);
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity:0, y:28 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay:0.12, duration:0.65, ease:[0.16,1,0.3,1] }}
      style={{
        borderRadius:26, overflow:"hidden", position:"relative",
        background:"rgba(14,16,24,0.88)",
        border:"1px solid rgba(255,150,70,0.1)",
        backdropFilter:"blur(22px)",
        boxShadow:"0 20px 56px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Cover */}
      <div style={{ height:140, background:"linear-gradient(135deg, #1A0A04 0%, #2E1206 30%, #4A1E0A 60%, #6A2E10 100%)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 80% at 60% 50%, rgba(240,90,26,0.18), transparent)" }} />
        {/* Decorative hex grid */}
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.06 }}>
          <defs>
            <pattern id="hex" width="40" height="46" patternUnits="userSpaceOnUse">
              <polygon points="20,0 40,11.5 40,34.5 20,46 0,34.5 0,11.5" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex)"/>
        </svg>
        {/* Floating food emojis */}
        <div style={{ position:"absolute", right:"8%", top:"15%", fontSize:48, opacity:0.12, transform:"rotate(12deg)" }}>🍛</div>
        <div style={{ position:"absolute", right:"22%", bottom:"10%", fontSize:32, opacity:0.1, transform:"rotate(-8deg)" }}>☕</div>
        {/* Level badge */}
        <div style={{ position:"absolute", top:16, right:16, display:"flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:99, background:"rgba(245,168,0,0.18)", border:"1px solid rgba(245,168,0,0.35)", backdropFilter:"blur(12px)" }}>
          <span style={{ fontSize:14 }}>🏆</span>
          <span style={{ fontSize:11, fontWeight:800, color:"#F5A800", letterSpacing:"0.05em" }}>{USER.level}</span>
        </div>
      </div>

      {/* Avatar + info */}
      <div style={{ padding:"0 28px 24px", position:"relative" }}>
        {/* Avatar */}
        <div style={{ position:"relative", display:"inline-block", marginTop:-44 }}>
          <div style={{ width:88, height:88, borderRadius:"50%", background:"linear-gradient(135deg, #F05A1A, #F5A800)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Fraunces',serif", fontSize:32, fontWeight:800, color:"white", border:"4px solid #07090F", boxShadow:"0 8px 28px rgba(240,90,26,0.45)", position:"relative", zIndex:2 }}>{USER.avatar}</div>
          {/* Online indicator */}
          <div style={{ position:"absolute", bottom:6, right:4, width:16, height:16, borderRadius:"50%", background:"#22C55E", border:"3px solid #07090F", zIndex:3, boxShadow:"0 0 0 3px rgba(34,197,94,0.25)" }}>
            <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"#22C55E", animation:"pulse-dot 1.8s ease-out infinite" }} />
          </div>
          {/* Halo ring */}
          <div style={{ position:"absolute", inset:-6, borderRadius:"50%", border:"1.5px solid rgba(240,90,26,0.3)", animation:"halo-spin 12s linear infinite", zIndex:1 }} />
          <div style={{ position:"absolute", inset:-12, borderRadius:"50%", border:"1px dashed rgba(245,168,0,0.18)", animation:"halo-rev 18s linear infinite", zIndex:0 }} />
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginTop:12, flexWrap:"wrap", gap:12 }}>
          <div>
            <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:800, color:"rgba(255,246,232,0.97)", lineHeight:1.2 }}>{USER.name}</h1>
            <div style={{ fontSize:13, color:"rgba(255,200,130,0.5)", marginTop:2 }}>{USER.handle}</div>
            <div style={{ fontSize:12, color:"rgba(255,200,130,0.4)", marginTop:4, display:"flex", alignItems:"center", gap:8 }}>
              <span>📍 {USER.location}</span>
              <span style={{ opacity:0.4 }}>·</span>
              <span>📅 Since {USER.joined}</span>
            </div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
              className="btn-primary" onClick={()=>setEditing(v=>!v)}
              style={{ fontSize:13, padding:"10px 18px" }}>
              {editing ? "✓ Save Profile" : "✏️ Edit Profile"}
            </motion.button>
            <button className="btn-outline" style={{ fontSize:13 }}>📤 Share</button>
          </div>
        </div>

        {/* Bio */}
        <p style={{ fontSize:13, color:"rgba(255,200,130,0.55)", lineHeight:1.7, marginTop:14, maxWidth:560 }}>{USER.bio}</p>

        {/* XP bar */}
        <div style={{ marginTop:18 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"rgba(255,200,130,0.45)" }}>Foodie XP</span>
            <span style={{ fontSize:11, fontWeight:700, color:"#F5A800" }}>{USER.xp.toLocaleString()} / {USER.xpNext.toLocaleString()} XP</span>
          </div>
          <div style={{ height:6, borderRadius:99, background:"rgba(255,255,255,0.07)", overflow:"hidden" }}>
            <motion.div
              initial={{ width:0 }}
              animate={{ width:`${xpPct}%` }}
              transition={{ delay:0.6, duration:1, ease:[0.16,1,0.3,1] }}
              style={{ height:"100%", borderRadius:99, background:"linear-gradient(90deg, #F05A1A, #F5A800, #FFD060)" }}
            />
          </div>
          <div style={{ fontSize:10, color:"rgba(255,200,130,0.35)", marginTop:5 }}>
            {USER.xpNext - USER.xp} XP to <strong style={{ color:"rgba(255,200,130,0.55)" }}>Platinum Foodie</strong>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginTop:20, paddingTop:18, borderTop:"1px solid rgba(255,150,70,0.08)" }}>
          {[
            { label:"Reviews",   val:USER.stats.reviews,  e:"⭐", color:"#F5A800" },
            { label:"Saved",     val:USER.stats.saved,    e:"❤️", color:"#F05A1A" },
            { label:"Visited",   val:USER.stats.visited,  e:"📍", color:"#3B82F6" },
            { label:"Orders",    val:USER.stats.orders,   e:"🛒", color:"#22C55E" },
          ].map((s,i) => (
            <motion.div key={s.label}
              initial={{ opacity:0, y:12 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:0.4+i*0.08, duration:0.5 }}
              style={{ textAlign:"center", padding:"12px 8px", borderRadius:14, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize:18, marginBottom:5 }}>{s.e}</div>
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:700, color:s.color }}>{s.val}</div>
              <div style={{ fontSize:10, color:"rgba(255,200,130,0.42)", marginTop:2, textTransform:"uppercase", letterSpacing:"0.06em" }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   EDIT PROFILE MODAL
═══════════════════════════════════════════════════════════ */
function EditModal({ onClose }) {
  const [form, setForm] = useState({ name:USER.name, email:USER.email, phone:USER.phone, location:USER.location, bio:USER.bio });
  return (
    <motion.div
      initial={{ opacity:0 }}
      animate={{ opacity:1 }}
      exit={{ opacity:0 }}
      style={{ position:"fixed", inset:0, zIndex:100, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale:0.92, y:24, opacity:0 }}
        animate={{ scale:1, y:0, opacity:1 }}
        exit={{ scale:0.92, y:24, opacity:0 }}
        transition={{ duration:0.38, ease:[0.16,1,0.3,1] }}
        onClick={e=>e.stopPropagation()}
        style={{ width:"100%", maxWidth:480, borderRadius:24, background:"rgba(14,16,24,0.97)", border:"1px solid rgba(255,150,70,0.14)", backdropFilter:"blur(28px)", boxShadow:"0 28px 70px rgba(0,0,0,0.7)", overflow:"hidden" }}
      >
        <div style={{ height:2.5, background:"linear-gradient(90deg,transparent,#F05A1A 30%,#F5A800 70%,transparent)" }} />
        <div style={{ padding:"24px 26px 22px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:700, color:"rgba(255,246,232,0.97)" }}>✏️ Edit Profile</div>
            <button onClick={onClose} style={{ width:28, height:28, borderRadius:8, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,200,130,0.55)", fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {[
              { k:"name",     label:"Full Name",  icon:"👤", type:"text"  },
              { k:"email",    label:"Email",       icon:"📧", type:"email" },
              { k:"phone",    label:"Phone",       icon:"📞", type:"tel"   },
              { k:"location", label:"Location",    icon:"📍", type:"text"  },
            ].map(f => (
              <div key={f.k}>
                <label style={{ display:"block", fontSize:10, fontWeight:700, letterSpacing:"0.09em", textTransform:"uppercase", color:"rgba(255,200,130,0.42)", marginBottom:7 }}>{f.label}</label>
                <div style={{ position:"relative" }}>
                  <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:14, opacity:0.45 }}>{f.icon}</span>
                  <input className="ff-input" type={f.type} style={{ paddingLeft:38 }}
                    value={form[f.k]} onChange={e=>setForm(v=>({...v,[f.k]:e.target.value}))} />
                </div>
              </div>
            ))}
            <div>
              <label style={{ display:"block", fontSize:10, fontWeight:700, letterSpacing:"0.09em", textTransform:"uppercase", color:"rgba(255,200,130,0.42)", marginBottom:7 }}>Bio</label>
              <textarea className="ff-input" rows={3} style={{ resize:"none", lineHeight:1.6 }}
                value={form.bio} onChange={e=>setForm(v=>({...v,bio:e.target.value}))} />
            </div>
          </div>
          <div style={{ display:"flex", gap:10, marginTop:20, justifyContent:"flex-end" }}>
            <button className="btn-outline" onClick={onClose}>Cancel</button>
            <button className="btn-primary" onClick={onClose}>Save Changes</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   USER INFO CARD
═══════════════════════════════════════════════════════════ */
function UserInfoCard({ onEdit }) {
  const ref = useRef(null);
  const iv = useInView(ref, { once:true });
  const rows = [
    { icon:"👤", label:"Full Name",  val:USER.name     },
    { icon:"📧", label:"Email",      val:USER.email    },
    { icon:"📞", label:"Phone",      val:USER.phone    },
    { icon:"📍", label:"Location",   val:USER.location },
    { icon:"📅", label:"Member Since", val:USER.joined  },
    { icon:"🏆", label:"Level",      val:USER.level    },
  ];
  return (
    <motion.div ref={ref}
      initial={{ opacity:0, y:24 }} animate={iv?{opacity:1,y:0}:{}}
      transition={{ duration:0.55, ease:[0.16,1,0.3,1] }}
      style={{ borderRadius:22, background:"rgba(14,16,24,0.85)", border:"1px solid rgba(255,150,70,0.1)", backdropFilter:"blur(18px)", boxShadow:"0 10px 34px rgba(0,0,0,0.38)", overflow:"hidden" }}
    >
      <div style={{ padding:"20px 22px 18px" }}>
        <SectionLabel icon="🪪" title="User Info" />
        <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
          {rows.map((r,i) => (
            <div key={r.label}>
              {i>0 && <Divider />}
              <div style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0" }}>
                <div style={{ width:34, height:34, borderRadius:10, background:"rgba(240,90,26,0.08)", border:"1px solid rgba(255,150,70,0.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>{r.icon}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"rgba(255,200,130,0.4)", marginBottom:2 }}>{r.label}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:"rgba(255,246,232,0.88)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.val}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:14 }}>
          <button className="btn-outline" style={{ width:"100%", fontSize:13 }} onClick={onEdit}>✏️ Edit Profile Details</button>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BADGES CARD
═══════════════════════════════════════════════════════════ */
function BadgesCard() {
  const ref = useRef(null);
  const iv = useInView(ref, { once:true });
  return (
    <motion.div ref={ref}
      initial={{ opacity:0, y:24 }} animate={iv?{opacity:1,y:0}:{}}
      transition={{ delay:0.1, duration:0.55, ease:[0.16,1,0.3,1] }}
      style={{ borderRadius:22, background:"rgba(14,16,24,0.85)", border:"1px solid rgba(255,150,70,0.1)", backdropFilter:"blur(18px)", boxShadow:"0 10px 34px rgba(0,0,0,0.38)", overflow:"hidden" }}
    >
      <div style={{ padding:"20px 22px 18px" }}>
        <SectionLabel icon="🎖️" title="Badges Earned" count={BADGES.length} />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {BADGES.map((b,i) => (
            <motion.div key={b.label}
              initial={{ opacity:0, scale:0.88 }} animate={iv?{opacity:1,scale:1}:{}}
              transition={{ delay:0.15+i*0.08, duration:0.45 }}
              whileHover={{ scale:1.04, y:-3 }}
              style={{ padding:"14px 12px", borderRadius:16, textAlign:"center", background:`${b.color}10`, border:`1px solid ${b.color}28`, cursor:"default" }}
            >
              <div style={{ fontSize:26, marginBottom:7 }}>{b.icon}</div>
              <div style={{ fontSize:12, fontWeight:700, color:"rgba(255,246,232,0.9)", marginBottom:2 }}>{b.label}</div>
              <div style={{ fontSize:10, color:"rgba(255,200,130,0.45)" }}>{b.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SAVED SHOPS
═══════════════════════════════════════════════════════════ */
function SavedShops() {
  const [shops, setShops] = useState(SAVED_SHOPS_INIT);
  const [removing, setRemoving] = useState(null);
  const ref = useRef(null);
  const iv = useInView(ref, { once:true });

  const remove = (id) => {
    setRemoving(id);
    setTimeout(()=>{ setShops(s=>s.filter(x=>x.id!==id)); setRemoving(null); }, 400);
  };

  return (
    <motion.div ref={ref}
      initial={{ opacity:0, y:24 }} animate={iv?{opacity:1,y:0}:{}}
      transition={{ delay:0.08, duration:0.6, ease:[0.16,1,0.3,1] }}
      style={{ borderRadius:22, background:"rgba(14,16,24,0.85)", border:"1px solid rgba(255,150,70,0.1)", backdropFilter:"blur(18px)", boxShadow:"0 10px 34px rgba(0,0,0,0.38)", overflow:"hidden" }}
    >
      <div style={{ padding:"20px 22px 18px" }}>
        <SectionLabel icon="❤️" title="Saved Shops" count={shops.length} />
        <AnimatePresence>
          {shops.length === 0 ? (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
              style={{ textAlign:"center", padding:"40px 20px", color:"rgba(255,200,130,0.35)" }}>
              <div style={{ fontSize:36, marginBottom:10 }}>🍽️</div>
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:700, marginBottom:5 }}>No saved shops yet</div>
              <div style={{ fontSize:12 }}>Start exploring to save your favourites!</div>
            </motion.div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {shops.map((shop, i) => (
                <motion.div key={shop.id}
                  layout
                  initial={{ opacity:0, x:20 }}
                  animate={removing===shop.id ? { opacity:0, x:-30, height:0 } : iv ? { opacity:1, x:0 } : {}}
                  exit={{ opacity:0, x:-30 }}
                  transition={{ delay:i*0.06, duration:0.4, ease:[0.16,1,0.3,1] }}
                  whileHover={{ y:-3, boxShadow:`0 14px 32px rgba(0,0,0,0.4), 0 0 0 1px ${shop.accent}44` }}
                  style={{
                    borderRadius:16, padding:"13px 14px",
                    background:"rgba(255,255,255,0.028)",
                    border:`1px solid rgba(255,255,255,0.07)`,
                    display:"flex", alignItems:"center", gap:12, cursor:"pointer",
                    boxShadow:"0 4px 14px rgba(0,0,0,0.25)",
                    transition:"box-shadow 0.3s",
                    position:"relative", overflow:"hidden",
                  }}
                >
                  {/* left accent */}
                  <div style={{ position:"absolute", left:0, top:"20%", bottom:"20%", width:2.5, borderRadius:99, background:shop.accent }} />
                  {/* emoji */}
                  <div style={{ width:44, height:44, borderRadius:13, flexShrink:0, background:`${shop.accent}18`, border:`1px solid ${shop.accent}2e`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{shop.emoji}</div>
                  {/* info */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,246,232,0.95)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{shop.name}</div>
                    <div style={{ fontSize:11, color:"rgba(255,200,130,0.48)", marginTop:1 }}>{shop.type}</div>
                    <div style={{ display:"flex", gap:10, alignItems:"center", marginTop:5 }}>
                      <Stars r={shop.rating} />
                      <span style={{ fontSize:10, fontWeight:700, color:"rgba(255,246,232,0.8)" }}>{shop.rating}</span>
                      <span style={{ fontSize:10, fontWeight:700, color:shop.accent }}>₹{shop.price}</span>
                      <span style={{ fontSize:10, color:"rgba(255,200,130,0.4)" }}>📍{shop.dist}</span>
                    </div>
                  </div>
                  {/* actions */}
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6, flexShrink:0 }}>
                    <div style={{ fontSize:9, color:"rgba(255,200,130,0.3)", whiteSpace:"nowrap" }}>{shop.saved}</div>
                    <motion.button whileTap={{ scale:0.88 }}
                      onClick={e=>{ e.stopPropagation(); remove(shop.id); }}
                      style={{ padding:"4px 10px", borderRadius:8, border:"1px solid rgba(239,68,68,0.28)", background:"rgba(239,68,68,0.09)", color:"rgba(239,68,68,0.75)", fontSize:10, fontWeight:700, cursor:"pointer", transition:"all 0.2s", fontFamily:"'Geist',sans-serif" }}
                      onMouseEnter={e=>{ e.currentTarget.style.background="rgba(239,68,68,0.18)"; e.currentTarget.style.color="#EF4444"; }}
                      onMouseLeave={e=>{ e.currentTarget.style.background="rgba(239,68,68,0.09)"; e.currentTarget.style.color="rgba(239,68,68,0.75)"; }}
                    >✕ Remove</motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
        {shops.length > 0 && (
          <div style={{ textAlign:"center", marginTop:14 }}>
            <button className="btn-outline" style={{ fontSize:12 }}>View All Saved Shops →</button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   RECENT ACTIVITY
═══════════════════════════════════════════════════════════ */
function activityIcon(type) {
  return type==="visited"?"📍":type==="reviewed"?"⭐":type==="saved"?"❤️":type==="ordered"?"🛒":"✓";
}
function activityColor(type) {
  return type==="visited"?"#3B82F6":type==="reviewed"?"#F5A800":type==="saved"?"#F05A1A":type==="ordered"?"#22C55E":"rgba(255,200,130,0.5)";
}

function RecentActivity() {
  const ref = useRef(null);
  const iv = useInView(ref, { once:true });
  return (
    <motion.div ref={ref}
      initial={{ opacity:0, y:24 }} animate={iv?{opacity:1,y:0}:{}}
      transition={{ delay:0.12, duration:0.6, ease:[0.16,1,0.3,1] }}
      style={{ borderRadius:22, background:"rgba(14,16,24,0.85)", border:"1px solid rgba(255,150,70,0.1)", backdropFilter:"blur(18px)", boxShadow:"0 10px 34px rgba(0,0,0,0.38)", overflow:"hidden" }}
    >
      <div style={{ padding:"20px 22px 18px" }}>
        <SectionLabel icon="⚡" title="Recent Activity" count={ACTIVITY.length} />
        <div style={{ position:"relative" }}>
          {/* Timeline line */}
          <div style={{ position:"absolute", left:17, top:0, bottom:0, width:1.5, background:"rgba(255,150,70,0.1)", borderRadius:99 }} />
          <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
            {ACTIVITY.map((a, i) => (
              <motion.div key={a.id}
                initial={{ opacity:0, x:-16 }}
                animate={iv ? { opacity:1, x:0 } : {}}
                transition={{ delay:0.1+i*0.07, duration:0.45, ease:[0.16,1,0.3,1] }}
                whileHover={{ x:4 }}
                style={{ display:"flex", gap:14, alignItems:"flex-start", padding:"10px 0", cursor:"default" }}
              >
                {/* Dot */}
                <div style={{ flexShrink:0, width:35, display:"flex", justifyContent:"center", paddingTop:2 }}>
                  <div style={{ width:18, height:18, borderRadius:"50%", background:`${activityColor(a.type)}22`, border:`1.5px solid ${activityColor(a.type)}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, zIndex:1, position:"relative" }}>
                    {activityIcon(a.type)}
                  </div>
                </div>
                {/* Content */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
                    <div>
                      <span style={{ fontSize:11, fontWeight:700, color:activityColor(a.type) }}>{a.action}</span>
                      <span style={{ fontSize:11, color:"rgba(255,200,130,0.55)", marginLeft:4 }}>at</span>
                      <span style={{ fontSize:12, fontWeight:700, color:"rgba(255,246,232,0.88)", marginLeft:4 }}>{a.emoji} {a.shop}</span>
                    </div>
                    <span style={{ fontSize:10, color:"rgba(255,200,130,0.3)", flexShrink:0, whiteSpace:"nowrap" }}>{a.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div style={{ textAlign:"center", marginTop:10 }}>
          <button className="btn-outline" style={{ fontSize:12 }}>View Full History →</button>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOOD PREFERENCES
═══════════════════════════════════════════════════════════ */
function FoodPreferences() {
  const ref = useRef(null);
  const iv = useInView(ref, { once:true });
  const prefs = [
    { label:"North Indian", pct:85, color:"#F05A1A" },
    { label:"Street Food",  pct:72, color:"#F5A800" },
    { label:"Café & Coffee",pct:58, color:"#06B6D4" },
    { label:"South Indian", pct:45, color:"#22C55E" },
    { label:"Biryani",      pct:92, color:"#EF4444" },
  ];
  return (
    <motion.div ref={ref}
      initial={{ opacity:0, y:24 }} animate={iv?{opacity:1,y:0}:{}}
      transition={{ delay:0.1, duration:0.55 }}
      style={{ borderRadius:22, background:"rgba(14,16,24,0.85)", border:"1px solid rgba(255,150,70,0.1)", backdropFilter:"blur(18px)", boxShadow:"0 10px 34px rgba(0,0,0,0.38)" }}
    >
      <div style={{ padding:"20px 22px 18px" }}>
        <SectionLabel icon="🍽️" title="Food Preferences" />
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {prefs.map((p,i) => (
            <div key={p.label}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontSize:12, fontWeight:600, color:"rgba(255,246,232,0.78)" }}>{p.label}</span>
                <span style={{ fontSize:11, fontWeight:700, color:p.color }}>{p.pct}%</span>
              </div>
              <div style={{ height:4, borderRadius:99, background:"rgba(255,255,255,0.07)", overflow:"hidden" }}>
                <motion.div
                  initial={{ width:0 }}
                  animate={iv ? { width:`${p.pct}%` } : {}}
                  transition={{ delay:0.2+i*0.08, duration:0.8, ease:[0.16,1,0.3,1] }}
                  style={{ height:"100%", borderRadius:99, background:`linear-gradient(90deg,${p.color}88,${p.color})` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ACCOUNT SETTINGS
═══════════════════════════════════════════════════════════ */
function AccountSettings() {
  const ref = useRef(null);
  const iv = useInView(ref, { once:true });
  const [pwDialog, setPwDialog] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation]    = useState(true);
  const [darkMode, setDarkMode]    = useState(true);

  const Toggle = ({ on, onToggle }) => (
    <div onClick={onToggle} style={{ width:40, height:22, borderRadius:99, cursor:"pointer", transition:"all 0.25s", background:on?"linear-gradient(135deg,#F05A1A,#FF7C3A)":"rgba(255,255,255,0.12)", display:"flex", alignItems:"center", padding:"3px 4px", boxShadow:on?"0 2px 8px rgba(240,90,26,0.4)":"none" }}>
      <motion.div animate={{ x: on ? 18 : 0 }} transition={{ type:"spring", stiffness:400, damping:28 }}
        style={{ width:16, height:16, borderRadius:"50%", background:"white", boxShadow:"0 1px 4px rgba(0,0,0,0.3)" }} />
    </div>
  );

  return (
    <motion.div ref={ref}
      initial={{ opacity:0, y:24 }} animate={iv?{opacity:1,y:0}:{}}
      transition={{ delay:0.15, duration:0.6 }}
      style={{ borderRadius:22, background:"rgba(14,16,24,0.85)", border:"1px solid rgba(255,150,70,0.1)", backdropFilter:"blur(18px)", boxShadow:"0 10px 34px rgba(0,0,0,0.38)", overflow:"hidden" }}
    >
      <div style={{ padding:"20px 22px 18px" }}>
        <SectionLabel icon="⚙️" title="Account Settings" />

        {/* Toggles */}
        <div style={{ display:"flex", flexDirection:"column", gap:0, marginBottom:18 }}>
          {[
            { label:"Push Notifications", sub:"Get alerts for crowd & deals", on:notifications, toggle:()=>setNotifications(v=>!v) },
            { label:"Location Services",  sub:"For accurate nearby results",  on:location,      toggle:()=>setLocation(v=>!v)      },
            { label:"Dark Mode",          sub:"Always on for night owls",     on:darkMode,       toggle:()=>setDarkMode(v=>!v)       },
          ].map((s,i) => (
            <div key={s.label}>
              {i>0 && <Divider />}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0" }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:"rgba(255,246,232,0.88)" }}>{s.label}</div>
                  <div style={{ fontSize:11, color:"rgba(255,200,130,0.4)", marginTop:1 }}>{s.sub}</div>
                </div>
                <Toggle on={s.on} onToggle={s.toggle} />
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <motion.button whileHover={{ scale:1.015 }} whileTap={{ scale:0.97 }}
            className="btn-outline" style={{ width:"100%", fontSize:13 }}
            onClick={()=>setPwDialog(true)}>
            🔐 Change Password
          </motion.button>
          <button className="btn-outline" style={{ width:"100%", fontSize:13 }}>📋 Download My Data</button>
          <button className="btn-outline" style={{ width:"100%", fontSize:13 }}>🔗 Connected Accounts</button>
          <Divider />
          <motion.button whileHover={{ scale:1.015 }} whileTap={{ scale:0.97 }}
            className="btn-danger" style={{ width:"100%", fontSize:13 }}
            onClick={()=>setLogoutConfirm(true)}>
            🚪 Log Out
          </motion.button>
          <button style={{ padding:"10px 18px", borderRadius:12, border:"1px solid rgba(239,68,68,0.18)", background:"rgba(239,68,68,0.05)", color:"rgba(239,68,68,0.5)", fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.2s", fontFamily:"'Geist',sans-serif" }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor="rgba(239,68,68,0.4)"; e.currentTarget.style.color="#EF4444"; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor="rgba(239,68,68,0.18)"; e.currentTarget.style.color="rgba(239,68,68,0.5)"; }}
          >⚠️ Delete Account</button>
        </div>
      </div>

      {/* Password dialog */}
      <AnimatePresence>
        {pwDialog && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:"fixed", inset:0, zIndex:100, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
            onClick={()=>setPwDialog(false)}>
            <motion.div initial={{ scale:0.9, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.9, y:20 }}
              onClick={e=>e.stopPropagation()}
              style={{ width:380, borderRadius:22, background:"rgba(14,16,24,0.97)", border:"1px solid rgba(255,150,70,0.14)", padding:"24px", boxShadow:"0 28px 70px rgba(0,0,0,0.7)" }}>
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:19, fontWeight:700, marginBottom:18, color:"rgba(255,246,232,0.97)" }}>🔐 Change Password</div>
              {["Current Password","New Password","Confirm New Password"].map(ph => (
                <div key={ph} style={{ marginBottom:12 }}>
                  <label style={{ display:"block", fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"rgba(255,200,130,0.42)", marginBottom:7 }}>{ph}</label>
                  <input className="ff-input" type="password" placeholder="••••••••" />
                </div>
              ))}
              <div style={{ display:"flex", gap:10, marginTop:16, justifyContent:"flex-end" }}>
                <button className="btn-outline" onClick={()=>setPwDialog(false)}>Cancel</button>
                <button className="btn-primary" onClick={()=>setPwDialog(false)}>Update Password</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout confirm */}
      <AnimatePresence>
        {logoutConfirm && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:"fixed", inset:0, zIndex:100, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
            onClick={()=>setLogoutConfirm(false)}>
            <motion.div initial={{ scale:0.9 }} animate={{ scale:1 }} exit={{ scale:0.9 }}
              onClick={e=>e.stopPropagation()}
              style={{ width:340, borderRadius:22, background:"rgba(14,16,24,0.97)", border:"1px solid rgba(239,68,68,0.2)", padding:"28px 26px", textAlign:"center", boxShadow:"0 28px 70px rgba(0,0,0,0.7)" }}>
              <div style={{ fontSize:44, marginBottom:14 }}>👋</div>
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:700, color:"rgba(255,246,232,0.97)", marginBottom:8 }}>Log out of FoodFinder?</div>
              <p style={{ fontSize:13, color:"rgba(255,200,130,0.5)", lineHeight:1.65, marginBottom:22 }}>You'll need to sign in again to access your saved shops and history.</p>
              <div style={{ display:"flex", gap:10 }}>
                <button className="btn-outline" style={{ flex:1, fontSize:13 }} onClick={()=>setLogoutConfirm(false)}>Stay</button>
                <button className="btn-danger"  style={{ flex:1, fontSize:13 }} onClick={()=>setLogoutConfirm(false)}>Yes, Log Out</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT PAGE
═══════════════════════════════════════════════════════════ */
export default function ProfilePage() {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [form, setForm] = useState({ name:USER.name, email:USER.email });
  const TABS = ["overview","saved","activity","settings"];

  return (
    <div style={{ minHeight:"100vh", background:"#07090F", position:"relative", zIndex:1 }}>
      <GS />

      {/* Ambient glows */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:"5%", left:"15%", width:550, height:550, borderRadius:"50%", background:"radial-gradient(circle,rgba(240,90,26,0.06),transparent 70%)", filter:"blur(80px)", animation:"float-orb 20s ease-in-out infinite" }} />
        <div style={{ position:"absolute", bottom:"10%", right:"8%", width:420, height:420, borderRadius:"50%", background:"radial-gradient(circle,rgba(245,168,0,0.06),transparent 70%)", filter:"blur(65px)", animation:"float-ob2 24s ease-in-out infinite" }} />
        <div style={{ position:"absolute", top:"50%", left:"55%", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,rgba(240,90,26,0.03),transparent 70%)", filter:"blur(55px)" }} />
      </div>

      {/* Nav */}
      <div style={{ position:"relative", zIndex:10 }}><NavBar /></div>

      {/* Content */}
      <main style={{ position:"relative", zIndex:2, maxWidth:1060, margin:"0 auto", padding:"28px 20px 60px" }}>
<div style={{ marginBottom: 20 }}>
  <button 
    onClick={() => navigate("/add-shop")}
    style={{
      padding: "10px 20px",
      background: "#F05A1A",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer"
    }}
  >
    ➕ Add Shop
  </button>
</div>
        {/* Hero */}
        <ProfileHero editing={editing} setEditing={setEditing} form={form} setForm={setForm} />

        {/* Tab bar */}
        <motion.div
          initial={{ opacity:0, y:16 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.3, duration:0.5 }}
          style={{ display:"flex", gap:4, margin:"20px 0 22px", background:"rgba(255,255,255,0.03)", borderRadius:14, padding:"5px", border:"1px solid rgba(255,150,70,0.08)", width:"fit-content" }}
        >
          {[
            { id:"overview",  label:"Overview",  icon:"📊" },
            { id:"saved",     label:"Saved",      icon:"❤️" },
            { id:"activity",  label:"Activity",   icon:"⚡" },
            { id:"settings",  label:"Settings",   icon:"⚙️" },
          ].map(t => (
            <button key={t.id} className={`nav-tab ${activeTab===t.id?"nav-active":"nav-idle"}`}
              onClick={()=>setActiveTab(t.id)}
              style={{ display:"flex", alignItems:"center", gap:6, fontSize:13 }}>
              <span style={{ fontSize:14 }}>{t.icon}</span>{t.label}
            </button>
          ))}
        </motion.div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-16 }} transition={{ duration:0.35 }}>
              <div style={{ display:"grid", gridTemplateColumns:"340px 1fr", gap:20, alignItems:"flex-start" }}>
                <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
                  <UserInfoCard onEdit={()=>setEditing(true)} />
                  <BadgesCard />
                
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
                  <FoodPreferences />
                  <SavedShops />
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === "saved" && (
            <motion.div key="saved" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-16 }} transition={{ duration:0.35 }}>
              <SavedShops />
            </motion.div>
          )}
          {activeTab === "activity" && (
            <motion.div key="activity" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-16 }} transition={{ duration:0.35 }}>
              <RecentActivity />
            </motion.div>
          )}
          {activeTab === "settings" && (
            <motion.div key="settings" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-16 }} transition={{ duration:0.35 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, alignItems:"flex-start" }}>
                <AccountSettings />
                <UserInfoCard onEdit={()=>setEditing(true)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Edit modal */}
      <AnimatePresence>
        {editing && <EditModal onClose={()=>setEditing(false)} />}
      </AnimatePresence>
    </div>
  );
}
