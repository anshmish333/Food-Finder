import { useState, useRef, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  useInView,
  useScroll,
} from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════════════ */
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

    :root {
      --bg:       #FEFAF4;
      --bg2:      #FDF5E8;
      --bg3:      #FFF8EE;
      --card:     rgba(255,252,244,0.9);
      --border:   rgba(180,100,25,0.13);
      --orange:   #E05A1A;
      --orange2:  #F08030;
      --amber:    #D4860A;
      --gold:     #F5C842;
      --brown:    #6B3A0F;
      --muted:    rgba(107,58,15,0.55);
      --soft:     rgba(107,58,15,0.28);
      --green:    #1A9A55;
      --red:      #C93535;
      --yellow:   #C87A10;
      --shadow:   rgba(107,58,15,0.12);
    }

    *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }
    html { scroll-behavior: smooth; }
    body {
      background: var(--bg);
      font-family: 'DM Sans', sans-serif;
      color: var(--brown);
      overflow-x: hidden;
    }
    ::-webkit-scrollbar { width:5px; height:5px; }
    ::-webkit-scrollbar-track { background: var(--bg2); }
    ::-webkit-scrollbar-thumb { background: rgba(224,90,26,0.35); border-radius:99px; }

    body::before {
      content:''; position:fixed; inset:0; z-index:0; pointer-events:none; opacity:0.022;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    }

    .ff-search {
      width:100%; height:40px; padding:0 14px 0 40px;
      border-radius:12px; border:1.5px solid var(--border);
      background:rgba(255,255,255,0.75); color:var(--brown);
      font-size:13px; font-family:'DM Sans',sans-serif; outline:none;
      transition:all 0.22s; backdrop-filter:blur(8px);
    }
    .ff-search::placeholder { color:rgba(107,58,15,0.4); }
    .ff-search:focus { border-color:rgba(224,90,26,0.45); background:rgba(255,255,255,0.98); box-shadow:0 0 0 4px rgba(224,90,26,0.09); }

    .btn-primary {
      display:inline-flex; align-items:center; justify-content:center; gap:7px;
      padding:12px 22px; border-radius:14px; border:none; cursor:pointer;
      background:linear-gradient(135deg, var(--orange), var(--orange2));
      color:white; font-size:13px; font-weight:700; font-family:'DM Sans',sans-serif;
      box-shadow:0 6px 22px rgba(224,90,26,0.38), inset 0 1px 0 rgba(255,255,255,0.2);
      transition:all 0.2s; position:relative; overflow:hidden;
    }
    .btn-primary:hover { transform:translateY(-2px); box-shadow:0 10px 32px rgba(224,90,26,0.48); }
    .btn-primary:active { transform:scale(0.97); }
    .btn-primary::after {
      content:''; position:absolute; top:-50%; left:-100%; width:50%; height:200%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent);
      transform:skewX(-20deg); animation:shimmer 3.2s ease-in-out infinite 1s;
    }

    .btn-ghost {
      display:inline-flex; align-items:center; justify-content:center; gap:7px;
      padding:11px 20px; border-radius:13px; border:1.5px solid var(--border);
      background:rgba(255,255,255,0.75); color:var(--brown);
      font-size:13px; font-weight:600; font-family:'DM Sans',sans-serif;
      cursor:pointer; transition:all 0.2s; backdrop-filter:blur(8px);
    }
    .btn-ghost:hover { border-color:var(--orange); color:var(--orange); background:rgba(224,90,26,0.06); transform:translateY(-1px); }

    .tab-btn {
      padding:8px 18px; border-radius:10px; border:none;
      font-size:13px; font-weight:600; cursor:pointer;
      font-family:'DM Sans',sans-serif; transition:all 0.2s;
    }
    .tab-active { background:var(--orange); color:white; box-shadow:0 4px 16px rgba(224,90,26,0.35); }
    .tab-idle   { background:transparent; color:var(--muted); }
    .tab-idle:hover { background:rgba(224,90,26,0.07); color:var(--orange); }

    .menu-cat-btn {
      padding:7px 16px; border-radius:99px; border:1.5px solid transparent;
      font-size:12px; font-weight:600; cursor:pointer;
      font-family:'DM Sans',sans-serif; transition:all 0.2s; white-space:nowrap;
    }
    .mcat-on  { background:rgba(224,90,26,0.1); border-color:rgba(224,90,26,0.42); color:var(--orange); box-shadow:0 0 0 3px rgba(224,90,26,0.08); }
    .mcat-off { background:rgba(255,255,255,0.65); border-color:var(--border); color:var(--muted); }
    .mcat-off:hover { border-color:rgba(224,90,26,0.35); color:var(--orange); }

    @keyframes shimmer    { 0%{left:-100%} 100%{left:200%} }
    @keyframes pulse-live { 0%,100%{transform:scale(1);opacity:0.8} 50%{transform:scale(1.7);opacity:0} }
    @keyframes float-img  { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-8px) scale(1.01)} }
    @keyframes count-up   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes spin-slow  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  `}</style>
);

/* ═══════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════ */
const SHOP = {
  name:        "Sharma Ji Ka Dhaba",
  tagline:     "Authentic home-style North Indian cooking since 1989",
  type:        "North Indian · Street Food · Veg Options",
  location:    "Near GPO, Hazratganj, Lucknow",
  dist:        "0.3 km away",
  rating:      4.8,
  totalVotes:  1240,
  avgPrice:    "₹95",
  crowd:       62,
  seats:       8,
  totalSeats:  22,
  waitTime:    "~12 min",
  open:        true,
  openHours:   "7:00 AM – 10:30 PM",
  bestTime:    "7–9 AM & 12–2 PM",
  phone:       "+91 98765 43210",
  emoji:       "🍛",
  accentColor: "#E05A1A",
  coverGradient: "linear-gradient(135deg, #3D1A00 0%, #7C3A0A 40%, #B85A18 70%, #E07830 100%)",
  tags:        ["Trending 🔥", "Veg Options", "Open Now", "Budget Pick"],
  ratingBreakdown: { 5:68, 4:18, 3:8, 2:4, 1:2 },
};

const POPULAR_DISHES = [
  { id:1, name:"Aloo Paratha",    price:65,  emoji:"🫓", badge:"🔥 #1 Bestseller", desc:"Crispy whole-wheat paratha stuffed with spiced potato, served with butter & dahi", cal:380 },
  { id:2, name:"Dal Makhani",     price:80,  emoji:"🫕", badge:"⭐ Chef's Special",  desc:"Slow-cooked black lentils in tomato-cream gravy, best paired with naan",          cal:420 },
  { id:3, name:"Chole Bhature",   price:75,  emoji:"🥘", badge:"💪 Fan Favourite",  desc:"Fluffy deep-fried bhatura with thick spiced chickpea curry",                      cal:550 },
  { id:4, name:"Masala Chai",     price:15,  emoji:"☕", badge:"🌅 Must Try",        desc:"Freshly brewed ginger-cardamom chai, made the traditional way",                   cal:90  },
  { id:5, name:"Paneer Bhurji",   price:90,  emoji:"🧀", badge:"👨‍🍳 House Special", desc:"Scrambled cottage cheese sautéed with onions, tomatoes & spices",                 cal:310 },
  { id:6, name:"Lassi",           price:40,  emoji:"🥛", badge:"❄️ Refreshing",     desc:"Thick sweet or salted yogurt drink, a Lucknow staple",                            cal:180 },
];

const MENU = [
  { id:1,  name:"Aloo Paratha",      cat:"Street Food", price:65,  veg:true,  rating:4.9, emoji:"🫓" },
  { id:2,  name:"Gobhi Paratha",     cat:"Street Food", price:70,  veg:true,  rating:4.7, emoji:"🥦" },
  { id:3,  name:"Mooli Paratha",     cat:"Street Food", price:65,  veg:true,  rating:4.5, emoji:"🌿" },
  { id:4,  name:"Dal Makhani",       cat:"Fast Food",   price:80,  veg:true,  rating:4.8, emoji:"🫕" },
  { id:5,  name:"Chole Bhature",     cat:"Fast Food",   price:75,  veg:true,  rating:4.9, emoji:"🥘" },
  { id:6,  name:"Paneer Bhurji",     cat:"Fast Food",   price:90,  veg:true,  rating:4.8, emoji:"🧀" },
  { id:7,  name:"Samosa (2 pcs)",    cat:"Snacks",      price:25,  veg:true,  rating:4.6, emoji:"🥟" },
  { id:8,  name:"Bread Pakoda",      cat:"Snacks",      price:30,  veg:true,  rating:4.4, emoji:"🍞" },
  { id:9,  name:"Aloo Tikki",        cat:"Snacks",      price:30,  veg:true,  rating:4.7, emoji:"🥔" },
  { id:10, name:"Masala Chai",       cat:"Drinks",      price:15,  veg:true,  rating:4.9, emoji:"☕" },
  { id:11, name:"Lassi (Sweet)",     cat:"Drinks",      price:40,  veg:true,  rating:4.8, emoji:"🥛" },
  { id:12, name:"Nimbu Pani",        cat:"Drinks",      price:20,  veg:true,  rating:4.6, emoji:"🍋" },
  { id:13, name:"Gulab Jamun",       cat:"Desserts",    price:30,  veg:true,  rating:4.7, emoji:"🍮" },
  { id:14, name:"Kheer",             cat:"Desserts",    price:45,  veg:true,  rating:4.8, emoji:"🍚" },
  { id:15, name:"Jalebi (100g)",     cat:"Desserts",    price:35,  veg:true,  rating:4.6, emoji:"🍯" },
];

const REVIEWS = [
  { id:1, name:"Priya Sharma",   avatar:"PS", rating:5, time:"2 days ago",   text:"Absolutely love this place! The Aloo Paratha here is unmatched in all of Lucknow. The butter is so fresh and the stuffing is perfectly spiced. Been coming here for 10 years!", liked:42, helpful:true },
  { id:2, name:"Aryan Gupta",    avatar:"AG", rating:5, time:"1 week ago",   text:"Dal Makhani is absolutely divine — slow cooked just right. Ambiance is simple but the food quality is top notch. Definitely a must-visit for authentic North Indian food.", liked:28, helpful:false },
  { id:3, name:"Meera Singh",    avatar:"MS", rating:4, time:"3 weeks ago",  text:"Great taste and very reasonable prices. Can get crowded during lunch hour so arrive early. Staff is super friendly and the chai is a must after the meal!", liked:19, helpful:false },
  { id:4, name:"Rahul Verma",    avatar:"RV", rating:5, time:"1 month ago",  text:"Sharma Ji himself is there every morning. The paratha with white butter and pickle is the best breakfast you'll have in this city. No frills, pure flavour.", liked:55, helpful:true },
  { id:5, name:"Anjali Mishra",  avatar:"AM", rating:4, time:"1 month ago",  text:"Love the chole bhature — generous portions at very honest prices. The lassi is thick and creamy. Only wish there were more seating options.", liked:14, helpful:false },
];

const MENU_CATS = ["All", "Street Food", "Fast Food", "Snacks", "Drinks", "Desserts"];

/* ═══════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════ */
function crowdColor(v) { return v >= 65 ? "#C93535" : v >= 40 ? "#C87A10" : "#1A9A55"; }
function crowdLabel(v) { return v >= 65 ? "Packed"   : v >= 40 ? "Moderate" : "Calm";   }

function Stars({ r, sm }) {
  return (
    <span style={{ display:"inline-flex", gap: sm?1:2 }}>
      {[1,2,3,4,5].map(i => <span key={i} style={{ fontSize:sm?11:13, color:i<=Math.round(r)?"#F5C842":"rgba(107,58,15,0.2)" }}>★</span>)}
    </span>
  );
}

function Chip({ children, color="#E05A1A" }) {
  return (
    <span style={{ fontSize:10, fontWeight:800, padding:"3px 9px", borderRadius:99, background:`${color}16`, color, border:`1px solid ${color}30`, letterSpacing:"0.04em", textTransform:"uppercase", whiteSpace:"nowrap" }}>
      {children}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   NAV BAR
═══════════════════════════════════════════════════════════════════ */
function NavBar() {
  const [s, setS] = useState("");
  return (
    <motion.header
      initial={{ y:-56, opacity:0 }}
      animate={{ y:0, opacity:1 }}
      transition={{ duration:0.6, ease:[0.16,1,0.3,1] }}
      style={{ position:"sticky", top:0, zIndex:60, display:"flex", alignItems:"center", gap:14, padding:"0 24px", height:62, background:"rgba(254,250,244,0.85)", backdropFilter:"blur(24px)", borderBottom:"1px solid rgba(107,58,15,0.1)", boxShadow:"0 1px 0 rgba(255,255,255,0.85)" }}
    >
      <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
        <div style={{ width:34, height:34, borderRadius:11, background:"linear-gradient(135deg,#E05A1A,#F08030)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, boxShadow:"0 4px 14px rgba(224,90,26,0.4)" }}>🍴</div>
        <span style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:"#3D1A00" }}>
          Food<span style={{ color:"#E05A1A" }}>Finder</span>
        </span>
      </div>

      {/* Breadcrumb */}
      <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"rgba(107,58,15,0.5)" }}>
        <span style={{ cursor:"pointer", transition:"color 0.2s" }} onMouseEnter={e=>e.target.style.color="#E05A1A"} onMouseLeave={e=>e.target.style.color="rgba(107,58,15,0.5)"}>Explore</span>
        <span>›</span>
        <span style={{ cursor:"pointer", transition:"color 0.2s" }} onMouseEnter={e=>e.target.style.color="#E05A1A"} onMouseLeave={e=>e.target.style.color="rgba(107,58,15,0.5)"}>Hazratganj</span>
        <span>›</span>
        <span style={{ fontWeight:600, color:"#3D1A00" }}>Sharma Ji Ka Dhaba</span>
      </div>

      <div style={{ position:"relative", flex:1, maxWidth:300 }}>
        <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:14, opacity:0.4 }}>🔍</span>
        <input className="ff-search" placeholder="Search food or shops…" value={s} onChange={e=>setS(e.target.value)} />
      </div>

      <div style={{ flex:1 }} />

      <div style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:11, background:"rgba(255,255,255,0.75)", border:"1px solid rgba(107,58,15,0.12)", cursor:"pointer", flexShrink:0 }}>
        <span style={{ fontSize:13 }}>📍</span>
        <span style={{ fontSize:12, fontWeight:600, color:"rgba(107,58,15,0.65)", maxWidth:120, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>Hazratganj, Lucknow</span>
        <span style={{ fontSize:10, color:"rgba(107,58,15,0.38)" }}>▾</span>
      </div>

      <div style={{ position:"relative" }}>
        <div style={{ width:36, height:36, borderRadius:11, background:"rgba(255,255,255,0.75)", border:"1px solid rgba(107,58,15,0.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, cursor:"pointer" }}>🔔</div>
        <div style={{ position:"absolute", top:6, right:6, width:7, height:7, borderRadius:"50%", background:"#E05A1A", border:"2px solid #FEFAF4" }} />
      </div>
      <div style={{ width:36, height:36, borderRadius:11, background:"linear-gradient(135deg,#E05A1A,#F5C842)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:800, color:"#fff", cursor:"pointer", boxShadow:"0 3px 12px rgba(224,90,26,0.32)", flexShrink:0 }}>A</div>
    </motion.header>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HERO SECTION
═══════════════════════════════════════════════════════════════════ */
function HeroSection({ saved, setSaved }) {
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 400], [0, 60]);
  const [copied, setCopied] = useState(false);

  const copyLink = () => { setCopied(true); setTimeout(()=>setCopied(false), 2000); };

  return (
    <div style={{ position:"relative", overflow:"hidden" }}>
      {/* Cover image area */}
      <motion.div
        style={{ y: heroParallax }}
        initial={{ opacity:0, scale:1.05 }}
        animate={{ opacity:1, scale:1 }}
        transition={{ duration:0.9, ease:[0.16,1,0.3,1] }}
      >
        <div style={{ height:380, background:SHOP.coverGradient, position:"relative", overflow:"hidden" }}>
          {/* Decorative food pattern */}
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.06 }}>
            <defs><pattern id="fp" width="80" height="80" patternUnits="userSpaceOnUse"><text x="20" y="50" fontSize="40" fill="white">🍛</text></pattern></defs>
          </svg>
          {/* Big emoji hero */}
          <div style={{ position:"absolute", right:"8%", top:"50%", transform:"translateY(-50%)", fontSize:180, opacity:0.25, animation:"float-img 6s ease-in-out infinite", filter:"blur(1px)" }}>🍛</div>
          <div style={{ position:"absolute", left:"5%", bottom:"10%", fontSize:80, opacity:0.15, animation:"float-img 7s ease-in-out infinite 1s" }}>🫓</div>
          <div style={{ position:"absolute", right:"25%", top:"15%", fontSize:60, opacity:0.12, animation:"float-img 5s ease-in-out infinite 2s" }}>☕</div>

          {/* Gradient overlay */}
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%)" }} />

          {/* Photo grid overlay */}
          <div style={{ position:"absolute", right:24, bottom:24, display:"flex", gap:8 }}>
            {["🥘","🫕","☕"].map((e,i) => (
              <div key={i} style={{ width:72, height:60, borderRadius:12, background:`rgba(255,255,255,0.12)`, border:"1px solid rgba(255,255,255,0.2)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, cursor:"pointer", transition:"all 0.2s" }}
                onMouseEnter={ev=>ev.currentTarget.style.transform="scale(1.08)"}
                onMouseLeave={ev=>ev.currentTarget.style.transform="scale(1)"}
              >{e}</div>
            ))}
            <div style={{ width:72, height:60, borderRadius:12, background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.2)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"white", cursor:"pointer" }}>+14 photos</div>
          </div>

          {/* Back button */}
          <motion.button
            whileHover={{ scale:1.05, x:-2 }} whileTap={{ scale:0.96 }}
            style={{ position:"absolute", top:20, left:20, display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:11, background:"rgba(255,255,255,0.18)", border:"1px solid rgba(255,255,255,0.25)", backdropFilter:"blur(12px)", color:"white", fontSize:13, fontWeight:600, cursor:"pointer", border:"none" }}
          >← Back to listings</motion.button>
        </div>
      </motion.div>

      {/* Info panel overlapping the cover */}
      <motion.div
        initial={{ opacity:0, y:32 }}
        animate={{ opacity:1, y:0 }}
        transition={{ delay:0.25, duration:0.65, ease:[0.16,1,0.3,1] }}
        style={{ margin:"-60px 24px 0", position:"relative", zIndex:10, borderRadius:24, background:"rgba(255,252,244,0.95)", border:"1px solid rgba(107,58,15,0.12)", backdropFilter:"blur(20px)", boxShadow:"0 16px 56px rgba(107,58,15,0.16), 0 2px 0 rgba(255,255,255,0.9) inset", padding:"24px 28px 22px" }}
      >
        {/* Top accent line */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2.5, borderRadius:"24px 24px 0 0", background:"linear-gradient(90deg, transparent, #E05A1A 30%, #F5C842 70%, transparent)" }} />

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16 }}>
          {/* Left: shop info */}
          <div style={{ flex:1, minWidth:280 }}>
            {/* Tags row */}
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
              {SHOP.tags.map(t => <Chip key={t} color="#E05A1A">{t}</Chip>)}
            </div>

            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(22px,3vw,32px)", fontWeight:800, color:"#3D1A00", lineHeight:1.15, marginBottom:5 }}>
              {SHOP.name}
            </h1>
            <p style={{ fontSize:14, color:"rgba(107,58,15,0.6)", marginBottom:12, fontStyle:"italic" }}>{SHOP.tagline}</p>
            <p style={{ fontSize:12, color:"rgba(107,58,15,0.55)", marginBottom:12 }}>{SHOP.type}</p>

            {/* Meta row */}
            <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
              {[
                { e:"📍", v:SHOP.location },
                { e:"🚶", v:SHOP.dist },
                { e:"🕒", v:SHOP.openHours },
                { e:"📞", v:SHOP.phone },
              ].map(m => (
                <div key={m.v} style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <span style={{ fontSize:13 }}>{m.e}</span>
                  <span style={{ fontSize:12, fontWeight:600, color:"rgba(107,58,15,0.65)" }}>{m.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: rating + status + buttons */}
          <div style={{ display:"flex", flexDirection:"column", gap:14, alignItems:"flex-end" }}>
            {/* Rating box */}
            <div style={{ textAlign:"center", padding:"14px 20px", borderRadius:18, background:"linear-gradient(135deg, rgba(245,200,66,0.12), rgba(224,90,26,0.08))", border:"1px solid rgba(224,90,26,0.18)" }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:38, fontWeight:700, color:"#3D1A00", lineHeight:1 }}>{SHOP.rating}</div>
              <Stars r={SHOP.rating} />
              <div style={{ fontSize:11, color:"rgba(107,58,15,0.5)", marginTop:4 }}>{SHOP.totalVotes.toLocaleString()} reviews</div>
            </div>

            {/* Status badges */}
            <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:12, background: SHOP.open ? "rgba(26,154,85,0.1)" : "rgba(201,53,53,0.1)", border:`1px solid ${SHOP.open?"rgba(26,154,85,0.28)":"rgba(201,53,53,0.25)"}` }}>
                <div style={{ position:"relative", width:7, height:7 }}>
                  {SHOP.open && <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"#1A9A55", animation:"pulse-live 1.8s ease-out infinite" }} />}
                  <div style={{ width:7, height:7, borderRadius:"50%", background:SHOP.open?"#1A9A55":"#C93535" }} />
                </div>
                <span style={{ fontSize:12, fontWeight:700, color:SHOP.open?"#1A9A55":"#C93535" }}>{SHOP.open?"Open Now":"Closed"}</span>
              </div>
              <div style={{ padding:"8px 14px", borderRadius:12, background:`${crowdColor(SHOP.crowd)}14`, border:`1px solid ${crowdColor(SHOP.crowd)}30` }}>
                <span style={{ fontSize:12, fontWeight:700, color:crowdColor(SHOP.crowd) }}>{crowdLabel(SHOP.crowd)} crowd</span>
              </div>
              <div style={{ padding:"8px 14px", borderRadius:12, background:SHOP.seats>5?"rgba(26,154,85,0.1)":"rgba(201,53,53,0.1)", border:`1px solid ${SHOP.seats>5?"rgba(26,154,85,0.28)":"rgba(201,53,53,0.25)"}` }}>
                <span style={{ fontSize:12, fontWeight:700, color:SHOP.seats>5?"#1A9A55":"#C93535" }}>🪑 {SHOP.seats}/{SHOP.totalSeats} seats</span>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display:"flex", gap:10 }}>
              <button className="btn-primary" style={{ gap:8 }}>📍 Get Directions</button>
              <motion.button
                whileTap={{ scale:0.93 }}
                onClick={() => setSaved(v=>!v)}
                className="btn-ghost"
                style={{ gap:7 }}
              >{saved ? "❤️ Saved" : "🤍 Save Shop"}</motion.button>
              <motion.button whileTap={{ scale:0.93 }} className="btn-ghost" style={{ gap:7 }} onClick={copyLink}>
                {copied ? "✅ Copied!" : "🔗 Share"}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Quick stats strip */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginTop:20, paddingTop:18, borderTop:"1px solid rgba(107,58,15,0.09)" }}>
          {[
            { e:"💸", label:"Avg per person", val:SHOP.avgPrice, color:"#E05A1A" },
            { e:"⏱️", label:"Wait time",       val:SHOP.waitTime, color:"#C87A10" },
            { e:"🕒", label:"Best time",       val:SHOP.bestTime, color:"#1A9A55" },
            { e:"🪑", label:"Seating",         val:`${SHOP.seats} of ${SHOP.totalSeats} free`, color: SHOP.seats>5?"#1A9A55":"#C87A10" },
          ].map(s => (
            <div key={s.label} style={{ textAlign:"center", padding:"12px 8px", borderRadius:14, background:"rgba(255,255,255,0.7)", border:"1px solid rgba(107,58,15,0.09)" }}>
              <div style={{ fontSize:20, marginBottom:5 }}>{s.e}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, color:s.color, marginBottom:3 }}>{s.val}</div>
              <div style={{ fontSize:10, color:"rgba(107,58,15,0.45)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   POPULAR DISHES
═══════════════════════════════════════════════════════════════════ */
function DishCard({ d, i }) {
  const ref = useRef(null);
  const iv = useInView(ref, { once:true });
  const [hov, setHov] = useState(false);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rx = useSpring(useTransform(my,[-70,70],[6,-6]),{ stiffness:260, damping:28 });
  const ry = useSpring(useTransform(mx,[-70,70],[-6,6]),{ stiffness:260, damping:28 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity:0, y:30 }}
      animate={iv ? { opacity:1, y:0 } : {}}
      transition={{ delay:i*0.08, duration:0.55, ease:[0.16,1,0.3,1] }}
      onHoverStart={()=>setHov(true)}
      onHoverEnd={()=>{ setHov(false); mx.set(0); my.set(0); }}
      onMouseMove={e=>{
        if(!ref.current) return;
        const r=ref.current.getBoundingClientRect();
        mx.set(e.clientX-r.left-r.width/2);
        my.set(e.clientY-r.top-r.height/2);
      }}
      style={{
        rotateX:rx, rotateY:ry,
        transformStyle:"preserve-3d", perspective:800,
        borderRadius:20, overflow:"hidden", cursor:"pointer", position:"relative",
        background:"rgba(255,252,244,0.92)",
        border:"1px solid rgba(107,58,15,0.1)",
        backdropFilter:"blur(14px)",
        boxShadow: hov
          ? "0 24px 50px rgba(107,58,15,0.18), 0 0 0 1.5px rgba(224,90,26,0.45)"
          : "0 6px 22px rgba(107,58,15,0.1), 0 1px 0 rgba(255,255,255,0.95)",
        transition:"box-shadow 0.3s",
      }}
    >
      {/* emoji area */}
      <div style={{ height:110, display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg, rgba(224,90,26,0.07), rgba(245,200,66,0.08))", position:"relative", overflow:"hidden" }}>
        <motion.div animate={hov ? { scale:1.18, rotate:[-5,5,-3,0] } : { scale:1 }} transition={{ duration:0.4 }} style={{ fontSize:58, filter:"drop-shadow(0 6px 14px rgba(0,0,0,0.15))" }}>{d.emoji}</motion.div>
        {/* badge */}
        <div style={{ position:"absolute", top:10, left:10 }}>
          <span style={{ fontSize:9, fontWeight:800, padding:"3px 8px", borderRadius:99, background:"rgba(224,90,26,0.15)", color:"#E05A1A", border:"1px solid rgba(224,90,26,0.28)", letterSpacing:"0.04em" }}>{d.badge}</span>
        </div>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:20, background:"linear-gradient(to top, rgba(255,252,244,0.92), transparent)" }} />
      </div>

      <div style={{ padding:"14px 16px 16px" }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:700, color:"#3D1A00", marginBottom:4 }}>{d.name}</div>
        <p style={{ fontSize:11, color:"rgba(107,58,15,0.55)", lineHeight:1.5, marginBottom:12, height:34, overflow:"hidden" }}>{d.desc}</p>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:"#E05A1A" }}>₹{d.price}</span>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ fontSize:10, color:"rgba(107,58,15,0.45)", fontWeight:600 }}>{d.cal} cal</span>
            <motion.button
              whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
              style={{ width:30, height:30, borderRadius:9, background:"linear-gradient(135deg,#E05A1A,#F08030)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:"white", boxShadow:"0 3px 10px rgba(224,90,26,0.38)" }}>+</motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PopularDishes() {
  return (
    <Section title="Popular Dishes" emoji="🔥" sub="Must-try items loved by our regulars">
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))", gap:16 }}>
        {POPULAR_DISHES.map((d,i) => <DishCard key={d.id} d={d} i={i} />)}
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FULL MENU
═══════════════════════════════════════════════════════════════════ */
function FullMenu() {
  const [activeCat, setActiveCat] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState({});

  const addToCart = id => setCart(c => ({...c, [id]:(c[id]||0)+1}));
  const remFromCart = id => setCart(c => { const n={...c}; if(n[id]>1) n[id]--; else delete n[id]; return n; });
  const totalItems = Object.values(cart).reduce((a,b)=>a+b,0);

  const filtered = MENU.filter(m =>
    (activeCat==="All" || m.cat===activeCat) &&
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Section title="Full Menu" emoji="📋" sub="Everything we serve — pick your favourites">
      {/* Category tabs */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
        {MENU_CATS.map(c => (
          <button key={c} className={`menu-cat-btn ${activeCat===c?"mcat-on":"mcat-off"}`}
            onClick={()=>setActiveCat(c)}>{c}
            <span style={{ marginLeft:5, fontSize:10, opacity:0.7 }}>({c==="All"?MENU.length:MENU.filter(m=>m.cat===c).length})</span>
          </button>
        ))}
        {/* Menu search */}
        <div style={{ marginLeft:"auto", position:"relative", width:200 }}>
          <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:12, opacity:0.4 }}>🔍</span>
          <input className="ff-search" style={{ height:34, paddingLeft:32, fontSize:12 }} placeholder="Search dish…" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
      </div>

      {/* Cart bar */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div initial={{ opacity:0, height:0, marginBottom:0 }} animate={{ opacity:1, height:"auto", marginBottom:14 }} exit={{ opacity:0, height:0, marginBottom:0 }}
            style={{ borderRadius:14, padding:"12px 18px", background:"linear-gradient(135deg,rgba(224,90,26,0.1),rgba(240,128,48,0.08))", border:"1.5px solid rgba(224,90,26,0.3)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:13, fontWeight:700, color:"#3D1A00" }}>🛒 {totalItems} item{totalItems>1?"s":""} in your order</span>
            <button className="btn-primary" style={{ fontSize:12, padding:"8px 16px" }}>Review Order →</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:12 }}>
        <AnimatePresence mode="wait">
          {filtered.map((item, i) => (
            <motion.div key={item.id}
              initial={{ opacity:0, scale:0.96 }}
              animate={{ opacity:1, scale:1 }}
              exit={{ opacity:0, scale:0.96 }}
              transition={{ delay:i*0.04, duration:0.3 }}
              whileHover={{ y:-4 }}
              style={{ borderRadius:16, padding:"14px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, background:"rgba(255,252,244,0.88)", border:"1px solid rgba(107,58,15,0.1)", boxShadow:"0 4px 14px rgba(107,58,15,0.08)", cursor:"default", transition:"box-shadow 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.boxShadow="0 8px 24px rgba(107,58,15,0.14)"}
              onMouseLeave={e=>e.currentTarget.style.boxShadow="0 4px 14px rgba(107,58,15,0.08)"}
            >
              <div style={{ display:"flex", gap:12, alignItems:"center", flex:1, minWidth:0 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:"rgba(224,90,26,0.08)", border:"1px solid rgba(107,58,15,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{item.emoji}</div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#3D1A00", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {item.name}
                    <span style={{ marginLeft:6, fontSize:9, fontWeight:800, padding:"2px 6px", borderRadius:99, background:item.veg?"rgba(26,154,85,0.12)":"rgba(201,53,53,0.1)", color:item.veg?"#1A9A55":"#C93535", border:`1px solid ${item.veg?"rgba(26,154,85,0.25)":"rgba(201,53,53,0.2)"}` }}>{item.veg?"🟢 VEG":"🔴 NON-VEG"}</span>
                  </div>
                  <div style={{ fontSize:11, color:"rgba(107,58,15,0.5)", marginTop:2, display:"flex", alignItems:"center", gap:6 }}>
                    <Stars r={item.rating} sm />
                    <span style={{ fontWeight:700 }}>{item.rating}</span>
                    <span style={{ fontSize:9, padding:"1px 6px", borderRadius:99, background:"rgba(107,58,15,0.07)", color:"rgba(107,58,15,0.55)" }}>{item.cat}</span>
                  </div>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:700, color:"#E05A1A" }}>₹{item.price}</span>
                {cart[item.id] ? (
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <motion.button whileTap={{ scale:0.88 }} onClick={()=>remFromCart(item.id)}
                      style={{ width:26, height:26, borderRadius:8, background:"rgba(224,90,26,0.12)", border:"1px solid rgba(224,90,26,0.3)", color:"#E05A1A", fontSize:16, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>−</motion.button>
                    <span style={{ fontSize:13, fontWeight:800, color:"#3D1A00", minWidth:16, textAlign:"center" }}>{cart[item.id]}</span>
                    <motion.button whileTap={{ scale:0.88 }} onClick={()=>addToCart(item.id)}
                      style={{ width:26, height:26, borderRadius:8, background:"linear-gradient(135deg,#E05A1A,#F08030)", border:"none", color:"white", fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(224,90,26,0.38)" }}>+</motion.button>
                  </div>
                ) : (
                  <motion.button whileTap={{ scale:0.9 }} onClick={()=>addToCart(item.id)}
                    style={{ width:30, height:30, borderRadius:9, background:"linear-gradient(135deg,#E05A1A,#F08030)", border:"none", color:"white", fontSize:16, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 3px 10px rgba(224,90,26,0.38)" }}>+</motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign:"center", padding:"40px 0", color:"rgba(107,58,15,0.45)" }}>
          <div style={{ fontSize:36, marginBottom:10 }}>🍽️</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16 }}>No items found for "{search}"</div>
        </div>
      )}
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   REVIEWS
═══════════════════════════════════════════════════════════════════ */
function ReviewCard({ rv, i }) {
  const ref = useRef(null);
  const iv = useInView(ref, { once:true });
  const [liked, setLiked] = useState(rv.helpful);

  return (
    <motion.div ref={ref}
      initial={{ opacity:0, x:-20 }}
      animate={iv ? { opacity:1, x:0 } : {}}
      transition={{ delay:i*0.1, duration:0.5, ease:[0.16,1,0.3,1] }}
      whileHover={{ y:-4 }}
      style={{ borderRadius:18, padding:"18px 20px", background:"rgba(255,252,244,0.9)", border:"1px solid rgba(107,58,15,0.1)", boxShadow:"0 6px 20px rgba(107,58,15,0.09)", transition:"box-shadow 0.2s" }}
      onMouseEnter={e=>e.currentTarget.style.boxShadow="0 12px 32px rgba(107,58,15,0.15)"}
      onMouseLeave={e=>e.currentTarget.style.boxShadow="0 6px 20px rgba(107,58,15,0.09)"}
    >
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <div style={{ width:40, height:40, borderRadius:12, background:`linear-gradient(135deg, #E05A1A, #F5C842)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, color:"white", flexShrink:0 }}>{rv.avatar}</div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:"#3D1A00" }}>{rv.name}</div>
            <div style={{ fontSize:11, color:"rgba(107,58,15,0.45)", marginTop:2 }}>{rv.time}</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:3, alignItems:"center" }}>
          <Stars r={rv.rating} />
          <span style={{ fontSize:11, fontWeight:800, color:"#3D1A00", marginLeft:4 }}>{rv.rating}.0</span>
        </div>
      </div>
      <p style={{ fontSize:13, color:"rgba(107,58,15,0.7)", lineHeight:1.7, marginBottom:12 }}>{rv.text}</p>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <motion.button whileTap={{ scale:0.88 }} onClick={()=>setLiked(v=>!v)}
          style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:99, border:`1px solid ${liked?"rgba(224,90,26,0.4)":"rgba(107,58,15,0.13)"}`, background:liked?"rgba(224,90,26,0.1)":"rgba(255,255,255,0.65)", color:liked?"#E05A1A":"rgba(107,58,15,0.55)", fontSize:11, fontWeight:700, cursor:"pointer", transition:"all 0.2s" }}>
          {liked?"❤️":"🤍"} Helpful ({rv.liked + (liked && !rv.helpful ? 1 : (!liked && rv.helpful ? -1 : 0))})
        </motion.button>
        <span style={{ fontSize:11, color:"rgba(107,58,15,0.4)" }}>Report</span>
      </div>
    </motion.div>
  );
}

function ReviewsSection() {
  const ref = useRef(null);
  const iv = useInView(ref, { once:true });
  const bd = SHOP.ratingBreakdown;
  const total = Object.values(bd).reduce((a,b)=>a+b,0);

  return (
    <Section title="Reviews & Ratings" emoji="⭐" sub="What our customers are saying">
      <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:24, alignItems:"flex-start" }}>
        {/* Rating summary */}
        <motion.div ref={ref}
          initial={{ opacity:0, y:20 }}
          animate={iv ? { opacity:1, y:0 } : {}}
          style={{ borderRadius:20, padding:"22px 20px", background:"rgba(255,252,244,0.9)", border:"1px solid rgba(107,58,15,0.1)", boxShadow:"0 8px 28px rgba(107,58,15,0.1)", position:"sticky", top:80 }}
        >
          {/* Big rating */}
          <div style={{ textAlign:"center", marginBottom:18 }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:56, fontWeight:800, color:"#3D1A00", lineHeight:1 }}>{SHOP.rating}</div>
            <div style={{ marginTop:6, marginBottom:6 }}><Stars r={SHOP.rating} /></div>
            <div style={{ fontSize:12, color:"rgba(107,58,15,0.5)" }}>Based on {SHOP.totalVotes.toLocaleString()} reviews</div>
          </div>

          {/* Breakdown bars */}
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {[5,4,3,2,1].map(star => {
              const pct = Math.round((bd[star]/total)*100);
              return (
                <div key={star} style={{ display:"flex", alignItems:"center", gap:9 }}>
                  <span style={{ fontSize:11, fontWeight:700, color:"rgba(107,58,15,0.65)", width:14, textAlign:"right" }}>{star}</span>
                  <span style={{ fontSize:11 }}>★</span>
                  <div style={{ flex:1, height:6, borderRadius:99, background:"rgba(107,58,15,0.1)", overflow:"hidden" }}>
                    <motion.div
                      initial={{ width:0 }}
                      animate={iv ? { width:`${pct}%` } : {}}
                      transition={{ delay:0.3+(5-star)*0.07, duration:0.7, ease:[0.16,1,0.3,1] }}
                      style={{ height:"100%", borderRadius:99, background:star>=4?"linear-gradient(90deg,#E05A1A,#F5C842)":star===3?"#C87A10":"#C93535" }}
                    />
                  </div>
                  <span style={{ fontSize:10, color:"rgba(107,58,15,0.45)", width:28 }}>{pct}%</span>
                </div>
              );
            })}
          </div>

          {/* Write review */}
          <button className="btn-primary" style={{ width:"100%", marginTop:20, fontSize:13 }}>✏️ Write a Review</button>
        </motion.div>

        {/* Reviews list */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {REVIEWS.map((rv,i) => <ReviewCard key={rv.id} rv={rv} i={i} />)}
          <div style={{ textAlign:"center", paddingTop:8 }}>
            <button className="btn-ghost" style={{ fontSize:13 }}>Load more reviews →</button>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SHOP INFO PANEL
═══════════════════════════════════════════════════════════════════ */
function ShopInfoPanel() {
  const infoCards = [
    { e:"🕒", title:"Opening Hours",      val:SHOP.openHours,   sub:"Mon–Sun", color:"#E05A1A" },
    { e:"🪑", title:"Seating Capacity",   val:`${SHOP.totalSeats} seats`, sub:`${SHOP.seats} free now`, color:"#1A9A55" },
    { e:"🌅", title:"Best Time to Visit", val:SHOP.bestTime,    sub:"Least crowded", color:"#C87A10" },
    { e:"⏱️", title:"Avg Wait Time",      val:SHOP.waitTime,    sub:"During peak", color:"#7C3AED" },
    { e:"💸", title:"Avg Meal Cost",      val:SHOP.avgPrice,    sub:"Per person", color:"#E05A1A" },
    { e:"📞", title:"Contact",            val:SHOP.phone,       sub:"Call ahead", color:"#0891B2" },
  ];

  return (
    <Section title="Shop Information" emoji="ℹ️" sub="Everything you need before you visit">
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
        {infoCards.map((c,i) => (
          <motion.div key={c.title}
            initial={{ opacity:0, y:20 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ delay:i*0.08, duration:0.5, ease:[0.16,1,0.3,1] }}
            whileHover={{ y:-6 }}
            style={{ borderRadius:18, padding:"18px 18px 16px", background:"rgba(255,252,244,0.9)", border:"1px solid rgba(107,58,15,0.1)", boxShadow:"0 6px 20px rgba(107,58,15,0.1)", position:"relative", overflow:"hidden", cursor:"default" }}
          >
            <div style={{ position:"absolute", top:-20, right:-20, width:90, height:90, borderRadius:"50%", background:`radial-gradient(circle,${c.color}18,transparent 70%)`, pointerEvents:"none" }} />
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2.5, background:`linear-gradient(90deg,transparent,${c.color}88,transparent)` }} />
            <div style={{ fontSize:26, marginBottom:12 }}>{c.e}</div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase", color:"rgba(107,58,15,0.45)", marginBottom:5 }}>{c.title}</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:c.color, marginBottom:3 }}>{c.val}</div>
            <div style={{ fontSize:11, color:"rgba(107,58,15,0.5)" }}>{c.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Mini map */}
      <motion.div
        initial={{ opacity:0, y:20 }}
        whileInView={{ opacity:1, y:0 }}
        viewport={{ once:true }}
        transition={{ delay:0.5, duration:0.55 }}
        style={{ marginTop:16, borderRadius:18, overflow:"hidden", border:"1px solid rgba(107,58,15,0.1)", boxShadow:"0 6px 20px rgba(107,58,15,0.1)" }}
      >
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 18px", background:"rgba(255,252,244,0.95)", borderBottom:"1px solid rgba(107,58,15,0.09)" }}>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:700, color:"#3D1A00" }}>📍 Location</div>
            <div style={{ fontSize:12, color:"rgba(107,58,15,0.55)", marginTop:2 }}>{SHOP.location}</div>
          </div>
          <button className="btn-primary" style={{ fontSize:12, padding:"8px 16px" }}>Open in Maps →</button>
        </div>
        <div style={{ height:160, background:"linear-gradient(135deg,#E8F5E9 0%,#F1F8E9 50%,#E3F2FD 100%)", position:"relative" }}>
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.35 }}>
            <line x1="0" y1="50%" x2="100%" y2="52%" stroke="#B0BEC5" strokeWidth="3"/>
            <line x1="38%" y1="0" x2="42%" y2="100%" stroke="#B0BEC5" strokeWidth="3"/>
          </svg>
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.07 }}>
            <defs><pattern id="mg2" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M 28 0 L 0 0 0 28" fill="none" stroke="#37474F" strokeWidth="0.5"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#mg2)"/>
          </svg>
          {/* Shop pin */}
          <div style={{ position:"absolute", left:"50%", top:"50%", transform:"translate(-50%,-50%)" }}>
            <motion.div animate={{ y:[0,-5,0] }} transition={{ duration:2, repeat:Infinity, ease:"easeInOut" }}
              style={{ width:36, height:36, borderRadius:"50% 50% 50% 0", transform:"rotate(-45deg)", background:"linear-gradient(135deg,#E05A1A,#F08030)", border:"3px solid white", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 16px rgba(224,90,26,0.55)" }}>
              <span style={{ transform:"rotate(45deg)", display:"block", fontSize:16 }}>🍛</span>
            </motion.div>
          </div>
          {/* Ripple rings */}
          {[1,2,3].map(r => (
            <div key={r} style={{ position:"absolute", left:"50%", top:"50%", transform:"translate(-50%,-50%)", width:r*40, height:r*40, borderRadius:"50%", border:"1px solid rgba(224,90,26,0.3)", animation:`ripple 2s ease-out infinite ${r*0.4}s`, pointerEvents:"none" }} />
          ))}
        </div>
        <style>{`@keyframes ripple { 0%{transform:translate(-50%,-50%) scale(1);opacity:0.4} 100%{transform:translate(-50%,-50%) scale(2.2);opacity:0} }`}</style>
      </motion.div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   STICKY SECTION TABS
═══════════════════════════════════════════════════════════════════ */
function SectionTabs({ active, setActive }) {
  const tabs = ["Overview","Popular","Menu","Reviews","Info"];
  return (
    <motion.div
      initial={{ opacity:0, y:-10 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay:0.4, duration:0.5 }}
      style={{ position:"sticky", top:62, zIndex:40, background:"rgba(254,250,244,0.9)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(107,58,15,0.09)", padding:"10px 24px", display:"flex", gap:6, alignItems:"center" }}
    >
      {tabs.map(t => (
        <button key={t} className={`tab-btn ${active===t?"tab-active":"tab-idle"}`} onClick={()=>setActive(t)}>{t}</button>
      ))}
      <div style={{ flex:1 }} />
      <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"rgba(107,58,15,0.6)", fontWeight:600 }}>
        <span style={{ fontSize:13 }}>⏱️</span>
        <span>~{SHOP.waitTime} wait today</span>
        <div style={{ width:1, height:14, background:"rgba(107,58,15,0.15)", margin:"0 4px" }} />
        <span style={{ fontSize:13 }}>🪑</span>
        <span style={{ color:SHOP.seats>5?"#1A9A55":"#C87A10", fontWeight:700 }}>{SHOP.seats} seats free</span>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SECTION WRAPPER
═══════════════════════════════════════════════════════════════════ */
function Section({ title, emoji, sub, children }) {
  const ref = useRef(null);
  const iv = useInView(ref, { once:true, margin:"-80px" });
  return (
    <motion.section ref={ref}
      initial={{ opacity:0, y:24 }}
      animate={iv ? { opacity:1, y:0 } : {}}
      transition={{ duration:0.6, ease:[0.16,1,0.3,1] }}
      style={{ padding:"32px 24px" }}
    >
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:22 }}>
        <div>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:5 }}>
            <span style={{ fontSize:18 }}>{emoji}</span>
            <div style={{ width:18, height:2, borderRadius:99, background:"#E05A1A" }} />
            <span style={{ fontSize:11, fontWeight:800, letterSpacing:"0.1em", textTransform:"uppercase", color:"#E05A1A" }}>{title}</span>
          </div>
          {sub && <p style={{ fontSize:13, color:"rgba(107,58,15,0.5)" }}>{sub}</p>}
        </div>
      </div>
      {children}
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ROOT PAGE
═══════════════════════════════════════════════════════════════════ */
export default function ShopDetailsPage() {
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div style={{ minHeight:"100vh", background:"#FEFAF4", position:"relative", zIndex:1 }}>
      <G />

      {/* Ambient bg glows */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:"8%", right:"5%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(224,90,26,0.05),transparent 70%)", filter:"blur(70px)" }} />
        <div style={{ position:"absolute", bottom:"20%", left:"5%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(245,200,66,0.06),transparent 70%)", filter:"blur(60px)" }} />
        <div style={{ position:"absolute", top:"50%", left:"40%", width:350, height:350, borderRadius:"50%", background:"radial-gradient(circle,rgba(26,154,85,0.04),transparent 70%)", filter:"blur(55px)" }} />
      </div>

      {/* Nav */}
      <div style={{ position:"relative", zIndex:10 }}><NavBar /></div>

      {/* Section tabs */}
      <SectionTabs active={activeTab} setActive={setActiveTab} />

      {/* Main content */}
      <main style={{ position:"relative", zIndex:2, maxWidth:1200, margin:"0 auto" }}>
        {/* Hero */}
        <HeroSection saved={saved} setSaved={setSaved} />

        {/* All sections */}
        <PopularDishes />
        <FullMenu />
        <ReviewsSection />
        <ShopInfoPanel />
      </main>

      {/* Footer */}
      <footer style={{ borderTop:"1px solid rgba(107,58,15,0.1)", padding:"20px 24px", background:"rgba(254,250,244,0.95)", backdropFilter:"blur(12px)", position:"relative", zIndex:2 }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:9, background:"linear-gradient(135deg,#E05A1A,#F08030)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🍴</div>
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:700, color:"#3D1A00" }}>Food<span style={{ color:"#E05A1A" }}>Finder</span></span>
          </div>
          <span style={{ fontSize:11, color:"rgba(107,58,15,0.35)" }}>© 2025 FoodFinder Technologies · Made with ❤️ for food lovers</span>
          <div style={{ display:"flex", gap:14 }}>
            {["Privacy","Terms","Support"].map(l => (
              <a key={l} href="#" style={{ fontSize:11, color:"rgba(107,58,15,0.38)", textDecoration:"none", fontWeight:600, transition:"color 0.2s" }}
                onMouseEnter={e=>e.target.style.color="#E05A1A"}
                onMouseLeave={e=>e.target.style.color="rgba(107,58,15,0.38)"}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
