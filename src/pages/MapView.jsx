import { useState, useRef, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  useInView,
} from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════════ */
const GS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap');

    :root {
      --bg:     #080B12;
      --bg2:    #0D1220;
      --panel:  rgba(13,18,32,0.92);
      --orange: #FF6B1A;
      --amber:  #FFB830;
      --gold:   #FFD166;
      --t1:     rgba(255,248,235,0.95);
      --t2:     rgba(255,220,160,0.6);
      --t3:     rgba(255,200,130,0.32);
      --green:  #22D67E;
      --red:    #FF4F4F;
      --yellow: #FFBA2E;
      --blue:   #5B9CF6;
      --border: rgba(255,220,130,0.09);
    }

    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    html, body { height:100%; overflow:hidden; }
    body { background:var(--bg); font-family:'Outfit',sans-serif; color:var(--t1); }

    ::-webkit-scrollbar { width:4px; }
    ::-webkit-scrollbar-track { background:transparent; }
    ::-webkit-scrollbar-thumb { background:rgba(255,107,26,0.35); border-radius:99px; }

    body::before {
      content:''; position:fixed; inset:0; z-index:0; pointer-events:none; opacity:0.03;
      background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    }

    .ff-search {
      width:100%; height:40px; padding:0 14px 0 40px;
      border-radius:12px; border:1px solid var(--border);
      background:rgba(255,255,255,0.05); color:var(--t1);
      font-size:13px; font-family:'Outfit',sans-serif; outline:none; transition:all 0.22s;
    }
    .ff-search::placeholder { color:var(--t3); }
    .ff-search:focus { border-color:rgba(255,107,26,0.5); background:rgba(255,255,255,0.07); box-shadow:0 0 0 3px rgba(255,107,26,0.12); }

    .btn-cta {
      display:inline-flex; align-items:center; justify-content:center; gap:6px;
      padding:11px 20px; border-radius:13px; border:none; cursor:pointer;
      background:linear-gradient(135deg,#FF6B1A,#FF9A4D);
      color:white; font-size:13px; font-weight:700; font-family:'Outfit',sans-serif;
      box-shadow:0 6px 22px rgba(255,107,26,0.4), inset 0 1px 0 rgba(255,255,255,0.15);
      transition:all 0.2s; position:relative; overflow:hidden; white-space:nowrap;
    }
    .btn-cta:hover { transform:translateY(-2px); box-shadow:0 10px 30px rgba(255,107,26,0.5); }
    .btn-cta:active { transform:scale(0.97); }
    .btn-cta::after {
      content:''; position:absolute; top:-50%; left:-100%; width:50%; height:200%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);
      transform:skewX(-20deg); animation:shimmer 3s ease-in-out infinite 1s;
    }

    @keyframes shimmer    { 0%{left:-100%} 100%{left:200%} }
    @keyframes pulse-ring { 0%{transform:translate(-50%,-50%) scale(1);opacity:0.55} 100%{transform:translate(-50%,-50%) scale(2.8);opacity:0} }
    @keyframes pulse-dot  { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:0.7} }
    @keyframes float-pin  { 0%,100%{transform:translate(-50%,-100%) translateY(0px)} 50%{transform:translate(-50%,-100%) translateY(-7px)} }
    @keyframes spin-cw    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes glow-p     { 0%,100%{opacity:0.5} 50%{opacity:0.9} }
    @keyframes ripple-out { 0%{transform:translate(-50%,-50%) scale(1);opacity:0.4} 100%{transform:translate(-50%,-50%) scale(2.5);opacity:0} }
  `}</style>
);

/* ═══════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════ */
const SHOPS = [
  { id:1,  name:"Sharma Ji Ka Dhaba",   type:"North Indian",   price:95,  dist:0.3, rating:4.8, crowd:72, seats:8,  open:true,  emoji:"🍛", accent:"#FF6B1A", px:48, py:43,  tags:["Trending"] },
  { id:2,  name:"Chaat Corner",          type:"Street Food",    price:55,  dist:0.5, rating:4.5, crowd:38, seats:0,  open:true,  emoji:"🥙", accent:"#FFB830", px:27, py:59,  tags:["Budget"] },
  { id:3,  name:"Green Bowl Café",       type:"Café & Salads",  price:185, dist:1.1, rating:4.9, crowd:25, seats:14, open:true,  emoji:"🥗", accent:"#22D67E", px:68, py:24,  tags:["Top Rated"] },
  { id:4,  name:"Biryani Bros",          type:"Biryani House",  price:145, dist:0.8, rating:4.6, crowd:88, seats:3,  open:true,  emoji:"🍚", accent:"#FF4F4F", px:34, py:29,  tags:["Popular"] },
  { id:5,  name:"The Pav Studio",        type:"Mumbai Street",  price:75,  dist:0.4, rating:4.4, crowd:52, seats:6,  open:false, emoji:"🌮", accent:"#A78BFA", px:62, py:68,  tags:["Street Fav"] },
  { id:6,  name:"Noodle Nook",           type:"Asian Fusion",   price:130, dist:1.4, rating:4.7, crowd:33, seats:10, open:true,  emoji:"🍜", accent:"#5B9CF6", px:79, py:47,  tags:["Hidden Gem"] },
  { id:7,  name:"Chai & Samosa Co.",     type:"Snacks & Tea",   price:45,  dist:0.2, rating:4.2, crowd:30, seats:4,  open:true,  emoji:"🍵", accent:"#FFB830", px:19, py:46,  tags:["Cheapest!"] },
  { id:8,  name:"Burger Station",        type:"Fast Food",      price:165, dist:1.2, rating:4.5, crowd:61, seats:5,  open:true,  emoji:"🍔", accent:"#FF6B1A", px:54, py:81,  tags:["Fast Pick"] },
];

const cc  = v => v>=65?"#FF4F4F":v>=40?"#FFBA2E":"#22D67E";
const ccl = v => v>=65?"Packed":v>=40?"Moderate":"Calm";

/* ─── tiny helpers ─── */
function Stars({ r, sz=11 }) {
  return <span style={{ display:"inline-flex", gap:1 }}>{[1,2,3,4,5].map(i=><span key={i} style={{ fontSize:sz, color:i<=Math.round(r)?"#FFD166":"rgba(255,200,130,0.18)" }}>★</span>)}</span>;
}

function CrowdBar({ v }) {
  const ref=useRef(null), iv=useInView(ref,{once:true});
  return (
    <div ref={ref}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
        <span style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:"rgba(255,200,130,0.38)" }}>Crowd</span>
        <span style={{ fontSize:9, fontWeight:800, color:cc(v) }}>{ccl(v)} {v}%</span>
      </div>
      <div style={{ height:3, borderRadius:99, background:"rgba(255,255,255,0.07)", overflow:"hidden" }}>
        <motion.div initial={{width:0}} animate={iv?{width:`${v}%`}:{}} transition={{duration:0.85,ease:[0.16,1,0.3,1],delay:0.1}}
          style={{ height:"100%", borderRadius:99, background:`linear-gradient(90deg,${cc(v)}88,${cc(v)})` }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SVG MAP CANVAS
═══════════════════════════════════════════════════════════════ */
function MapCanvas({ shops, selectedId, hoveredId, onSelect, onHover }) {
  const [zoom,   setZoom]   = useState(1);
  const [offset, setOffset] = useState({ x:0, y:0 });
  const [drag,   setDrag]   = useState(false);
  const dragRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const handler = e => { e.preventDefault(); setZoom(z=>Math.max(0.5,Math.min(3,z-e.deltaY*0.001))); };
    el.addEventListener("wheel", handler, { passive:false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  const onMD = e => { setDrag(true); dragRef.current = { x:e.clientX-offset.x, y:e.clientY-offset.y }; };
  const onMM = e => { if(drag && dragRef.current) setOffset({ x:e.clientX-dragRef.current.x, y:e.clientY-dragRef.current.y }); };
  const onMU = () => setDrag(false);

  return (
    <div ref={rootRef} onMouseDown={onMD} onMouseMove={onMM} onMouseUp={onMU} onMouseLeave={onMU}
      style={{ width:"100%", height:"100%", position:"relative", overflow:"hidden", cursor:drag?"grabbing":"grab", userSelect:"none" }}>

      {/* Base background */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(150deg,#05080F 0%,#090E1C 45%,#0C1524 100%)" }} />

      {/* Atmospheric glows */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:"15%", left:"25%", width:460, height:460, borderRadius:"50%", background:"radial-gradient(circle,rgba(255,107,26,0.055),transparent 70%)", filter:"blur(70px)" }} />
        <div style={{ position:"absolute", bottom:"20%", right:"18%", width:380, height:380, borderRadius:"50%", background:"radial-gradient(circle,rgba(91,156,246,0.05),transparent 70%)", filter:"blur(60px)" }} />
        <div style={{ position:"absolute", top:"55%", left:"55%", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,rgba(34,214,126,0.04),transparent 70%)", filter:"blur(50px)" }} />
      </div>

      {/* SVG: roads + blocks */}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {/* Building blocks */}
        {[[5,5,11,8],[20,3,9,10],[33,6,10,7],[46,4,12,9],[61,5,10,8],[75,3,12,10],
          [5,18,10,9],[18,16,10,10],[31,18,12,8],[47,16,10,11],[62,17,9,9],[74,16,11,10],[86,18,8,9],
          [5,66,11,9],[20,67,10,8],[33,64,9,11],[46,66,12,9],[61,65,10,10],[75,64,9,8],[87,65,8,9],
          [5,80,13,10],[22,82,9,8],[34,80,10,10],[47,81,12,9],[62,80,10,10],[76,81,8,9],[87,80,9,10]
        ].map(([x,y,w,h],i)=>(
          <rect key={i} x={x} y={y} width={w} height={h} rx="0.4"
            fill={`rgba(${12+i%6},${18+i%5},${30+i%7},0.85)`}
            stroke="rgba(255,200,100,0.05)" strokeWidth="0.2" />
        ))}
        {/* Major roads */}
        <path d="M 0 30 L 100 31.5" fill="none" stroke="rgba(255,200,100,0.18)" strokeWidth="2"/>
        <path d="M 0 56 L 100 57.5" fill="none" stroke="rgba(255,200,100,0.18)" strokeWidth="2"/>
        <path d="M 29 0 L 30.5 100" fill="none" stroke="rgba(255,200,100,0.18)" strokeWidth="2"/>
        <path d="M 59 0 L 60.5 100" fill="none" stroke="rgba(255,200,100,0.18)" strokeWidth="2"/>
        {/* Minor roads */}
        <path d="M 0 42 L 100 43" fill="none" stroke="rgba(255,200,100,0.1)" strokeWidth="1"/>
        <path d="M 0 70 L 100 71" fill="none" stroke="rgba(255,200,100,0.1)" strokeWidth="1"/>
        <path d="M 44 0 L 44.5 100" fill="none" stroke="rgba(255,200,100,0.1)" strokeWidth="1"/>
        <path d="M 74 0 L 74.5 100" fill="none" stroke="rgba(255,200,100,0.1)" strokeWidth="1"/>
        <path d="M 15 0 L 15.5 100" fill="none" stroke="rgba(255,200,100,0.1)" strokeWidth="1"/>
        {/* Alleys */}
        <path d="M 0 20 L 100 20.5" fill="none" stroke="rgba(255,200,100,0.05)" strokeWidth="0.5" strokeDasharray="4 6"/>
        <path d="M 0 79 L 100 79" fill="none" stroke="rgba(255,200,100,0.05)" strokeWidth="0.5" strokeDasharray="4 6"/>
        <path d="M 86 0 L 86.5 100" fill="none" stroke="rgba(255,200,100,0.05)" strokeWidth="0.5" strokeDasharray="4 6"/>
        {/* Green zones */}
        <rect x="14" y="31" width="13" height="10" rx="1.2" fill="rgba(34,214,126,0.07)" stroke="rgba(34,214,126,0.14)" strokeWidth="0.3"/>
        <rect x="63" y="57" width="9" height="8" rx="1.2" fill="rgba(34,214,126,0.06)" stroke="rgba(34,214,126,0.1)" strokeWidth="0.3"/>
        {/* Grid */}
        <defs>
          <pattern id="mg" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(255,220,130,0.035)" strokeWidth="0.18"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#mg)"/>
      </svg>

      {/* Transformed layer (user + pins) */}
      <div style={{ position:"absolute", inset:0, transform:`translate(${offset.x}px,${offset.y}px) scale(${zoom})`, transformOrigin:"center center", transition:drag?"none":"transform 0.08s ease" }}>

        {/* User location */}
        <div style={{ position:"absolute", left:"50%", top:"50%", transform:"translate(-50%,-50%)", zIndex:20 }}>
          {/* Radar */}
          <div style={{ position:"absolute", left:"50%", top:"50%", width:90, height:90, borderRadius:"50%", background:"radial-gradient(circle,rgba(91,156,246,0.14),transparent 70%)", transform:"translate(-50%,-50%)", animation:"glow-p 2s ease-in-out infinite", pointerEvents:"none" }} />
          <div style={{ position:"absolute", left:"50%", top:"50%", width:64, height:64, transform:"translate(-50%,-50%)", pointerEvents:"none" }}>
            <div style={{ width:64, height:64, borderRadius:"50%", border:"1px solid rgba(91,156,246,0.2)", overflow:"hidden", animation:"spin-cw 4.5s linear infinite" }}>
              <div style={{ position:"absolute", top:0, left:"50%", width:"50%", height:"50%", background:"linear-gradient(135deg,rgba(91,156,246,0.3),transparent)", transformOrigin:"0% 100%", borderRadius:"0 100% 0 0" }} />
            </div>
          </div>
          {[1,2,3].map(r=>(
            <div key={r} style={{ position:"absolute", left:"50%", top:"50%", width:r*24, height:r*24, borderRadius:"50%", border:`1px solid rgba(91,156,246,${0.45/r})`, animation:`pulse-ring 2.5s ease-out infinite ${r*0.5}s`, pointerEvents:"none" }} />
          ))}
          <div style={{ width:14, height:14, borderRadius:"50%", background:"#5B9CF6", border:"3px solid white", boxShadow:"0 0 0 4px rgba(91,156,246,0.25),0 4px 14px rgba(91,156,246,0.55)", position:"relative", zIndex:2 }} />
        </div>

        {/* Shop pins */}
        {shops.map(s=>{
          const sel=s.id===selectedId, hov=s.id===hoveredId;
          return (
            <div key={s.id}
              onClick={()=>onSelect(s.id===selectedId?null:s.id)}
              onMouseEnter={()=>onHover(s.id)}
              onMouseLeave={()=>onHover(null)}
              style={{ position:"absolute", left:`${s.px}%`, top:`${s.py}%`, transform:"translate(-50%,-100%)", animation:sel?"none":`float-pin ${3.2+s.id*0.28}s ease-in-out infinite`, animationDelay:`${s.id*0.32}s`, zIndex:sel?30:hov?20:10, cursor:"pointer" }}
            >
              {/* Pulse rings */}
              {(sel||hov)&&[1,2].map(r=>(
                <div key={r} style={{ position:"absolute", left:"50%", bottom:0, width:r*36, height:r*36, borderRadius:"50%", border:`1px solid ${s.accent}${r===1?"77":"44"}`, animation:`pulse-ring 1.9s ease-out infinite ${r*0.45}s`, pointerEvents:"none" }} />
              ))}

              {/* Pin body */}
              <motion.div
                animate={sel?{scale:1.3}:hov?{scale:1.12}:{scale:1}}
                transition={{ type:"spring", stiffness:400, damping:22 }}
                style={{ width:sel?46:38, height:sel?46:38, borderRadius:"50% 50% 50% 0", transform:"rotate(-45deg)", background:sel?`linear-gradient(135deg,${s.accent},${s.accent}cc)`:`linear-gradient(135deg,${s.accent}99,${s.accent}55)`, border:`2px solid ${sel?"white":s.accent+"aa"}`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 6px 20px ${s.accent}66,0 0 0 ${sel?4:2}px ${s.accent}${sel?"44":"22"}`, backdropFilter:"blur(4px)", transition:"width 0.2s,height 0.2s" }}>
                <span style={{ transform:"rotate(45deg)", fontSize:sel?19:15, display:"block" }}>{s.emoji}</span>
              </motion.div>

              {/* Tooltip */}
              <AnimatePresence>
                {(sel||hov)&&(
                  <motion.div initial={{opacity:0,y:6,scale:0.88}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:6,scale:0.88}} transition={{duration:0.17}}
                    style={{ position:"absolute", bottom:"112%", left:"50%", transform:"translateX(-50%)", background:"rgba(10,15,26,0.97)", border:`1px solid ${s.accent}55`, borderRadius:11, padding:"6px 12px", fontSize:11, fontWeight:700, color:"white", whiteSpace:"nowrap", boxShadow:`0 4px 18px rgba(0,0,0,0.6),0 0 0 1px ${s.accent}28`, backdropFilter:"blur(12px)", zIndex:50, marginBottom:8 }}>
                    {s.emoji} {s.name.split(" ").slice(0,2).join(" ")} · ₹{s.price}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div style={{ position:"absolute", right:14, bottom:86, display:"flex", flexDirection:"column", gap:5, zIndex:30 }}>
        {[{i:"＋",a:()=>setZoom(z=>Math.min(3,z+0.22))},{i:"－",a:()=>setZoom(z=>Math.max(0.5,z-0.22))},{i:"⌖",a:()=>{setZoom(1);setOffset({x:0,y:0});}}].map(b=>(
          <motion.button key={b.i} whileHover={{scale:1.08}} whileTap={{scale:0.93}} onClick={b.a}
            style={{ width:36,height:36,borderRadius:10,background:"rgba(10,15,26,0.92)",border:"1px solid rgba(255,220,130,0.12)",backdropFilter:"blur(12px)",color:"rgba(255,220,160,0.65)",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"monospace",boxShadow:"0 4px 14px rgba(0,0,0,0.45)" }}>
            {b.i}
          </motion.button>
        ))}
      </div>
      <div style={{ position:"absolute", right:14, top:14, zIndex:30, padding:"4px 10px", borderRadius:8, background:"rgba(10,15,26,0.88)", border:"1px solid rgba(255,220,130,0.1)", backdropFilter:"blur(8px)", fontSize:10, fontWeight:700, color:"rgba(255,220,160,0.45)" }}>{Math.round(zoom*100)}%</div>
      <div style={{ position:"absolute", left:14, bottom:86, zIndex:30, width:42,height:42,borderRadius:"50%",background:"rgba(10,15,26,0.9)",border:"1px solid rgba(255,220,130,0.12)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 14px rgba(0,0,0,0.4)",flexDirection:"column",gap:1 }}>
        <span style={{ fontSize:8,fontWeight:800,color:"#FF6B1A",lineHeight:1 }}>N</span>
        <span style={{ fontSize:12 }}>🧭</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SHOP LIST CARD (sidebar)
═══════════════════════════════════════════════════════════════ */
function ShopListCard({ s, idx, sel, onSel }) {
  const ref=useRef(null), iv=useInView(ref,{once:true});
  const [hov,setHov]=useState(false);

  return (
    <motion.div ref={ref}
      initial={{opacity:0,x:20}} animate={iv?{opacity:1,x:0}:{}}
      transition={{delay:idx*0.07,duration:0.5,ease:[0.16,1,0.3,1]}}
      onHoverStart={()=>setHov(true)} onHoverEnd={()=>setHov(false)}
      onClick={()=>onSel(s.id===sel?null:s.id)}
      style={{ borderRadius:18, background:sel?`linear-gradient(135deg,${s.accent}18,${s.accent}06)`:hov?"rgba(255,255,255,0.055)":"rgba(255,255,255,0.03)", border:`1.5px solid ${sel?s.accent+"55":hov?"rgba(255,220,130,0.12)":"rgba(255,255,255,0.06)"}`, backdropFilter:"blur(16px)", cursor:"pointer", transition:"all 0.25s ease", boxShadow:sel?`0 14px 40px rgba(0,0,0,0.45),0 0 24px ${s.accent}22`:hov?"0 8px 24px rgba(0,0,0,0.3)":"0 4px 12px rgba(0,0,0,0.2)", overflow:"hidden", position:"relative" }}
    >
      {sel&&<div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${s.accent},transparent)` }} />}
      <div style={{ padding:"14px 15px" }}>
        <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:10 }}>
          <motion.div animate={hov||sel?{scale:1.08,rotate:[-3,3,-1,0]}:{scale:1}} transition={{duration:0.3}}
            style={{ width:42,height:42,borderRadius:13,background:`${s.accent}1a`,border:`1px solid ${s.accent}2e`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{s.emoji}</motion.div>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ fontSize:13,fontWeight:700,color:"rgba(255,248,235,0.95)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2 }}>{s.name}</div>
            <div style={{ fontSize:10,color:"rgba(255,200,130,0.45)" }}>{s.type}</div>
          </div>
          <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4 }}>
            <div style={{ fontSize:8,fontWeight:800,padding:"2px 7px",borderRadius:99,background:s.open?"rgba(34,214,126,0.12)":"rgba(255,79,79,0.1)",color:s.open?"#22D67E":"#FF4F4F",border:`1px solid ${s.open?"rgba(34,214,126,0.25)":"rgba(255,79,79,0.2)"}`,letterSpacing:"0.04em" }}>{s.open?"● Open":"● Closed"}</div>
            <div style={{ fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:800,color:s.accent }}>₹{s.price}</div>
          </div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:9 }}>
          {[{e:"📍",v:`${s.dist}km`},{e:"⭐",v:s.rating},{e:"🪑",v:s.seats>0?`${s.seats} free`:"Full"}].map(st=>(
            <div key={st.e} style={{ background:"rgba(255,255,255,0.04)",borderRadius:9,padding:"7px 4px",textAlign:"center",border:"1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize:12,marginBottom:2 }}>{st.e}</div>
              <div style={{ fontSize:11,fontWeight:700,color:"rgba(255,248,235,0.85)" }}>{st.v}</div>
            </div>
          ))}
        </div>
        <CrowdBar v={s.crowd} />
        <div style={{ display:"flex",gap:5,flexWrap:"wrap",marginTop:9 }}>
          {s.tags.map(t=><span key={t} style={{ fontSize:9,fontWeight:800,padding:"2px 8px",borderRadius:99,background:`${s.accent}18`,color:s.accent,border:`1px solid ${s.accent}28`,letterSpacing:"0.04em",textTransform:"uppercase" }}>{t}</span>)}
          {sel&&<span style={{ marginLeft:"auto",fontSize:10,color:s.accent,fontWeight:700,cursor:"pointer" }}>Details →</span>}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FLOATING SELECTED CARD
═══════════════════════════════════════════════════════════════ */
function FloatingCard({ shop, onClose }) {
  return (
    <AnimatePresence>
      {shop&&(
        <motion.div
          initial={{opacity:0,y:90,scale:0.93}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:90,scale:0.93}}
          transition={{type:"spring",stiffness:280,damping:26}}
          style={{ position:"absolute",bottom:18,left:"50%",transform:"translateX(-50%)",width:"min(500px,calc(100% - 32px))",zIndex:50,borderRadius:24,overflow:"hidden",backdropFilter:"blur(32px)",background:"linear-gradient(145deg,rgba(10,15,26,0.98),rgba(7,10,17,0.99))",border:`1.5px solid ${shop.accent}44`,boxShadow:`0 28px 70px rgba(0,0,0,0.75),0 0 0 1px ${shop.accent}1a,0 0 60px ${shop.accent}14` }}>
          <div style={{ height:2.5,background:`linear-gradient(90deg,transparent,${shop.accent},transparent)` }} />
          <div style={{ padding:"18px 20px" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14 }}>
              <div style={{ display:"flex",gap:12,alignItems:"center" }}>
                <motion.div animate={{rotate:[0,-5,5,-3,0]}} transition={{duration:0.45,delay:0.1}}
                  style={{ width:52,height:52,borderRadius:16,background:`linear-gradient(135deg,${shop.accent}22,${shop.accent}08)`,border:`1px solid ${shop.accent}35`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0 }}>{shop.emoji}</motion.div>
                <div>
                  <div style={{ fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,color:"rgba(255,248,235,0.97)",marginBottom:3 }}>{shop.name}</div>
                  <div style={{ fontSize:11,color:"rgba(255,200,130,0.5)",marginBottom:4 }}>{shop.type}</div>
                  <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                    <Stars r={shop.rating} />
                    <span style={{ fontSize:11,fontWeight:700,color:"rgba(255,248,235,0.8)" }}>{shop.rating}</span>
                    <span style={{ fontSize:11,color:"rgba(255,200,130,0.4)" }}>· {shop.dist}km away</span>
                  </div>
                </div>
              </div>
              <div style={{ display:"flex",gap:8,alignItems:"flex-start" }}>
                <div style={{ fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:shop.accent }}>₹{shop.price}</div>
                <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={onClose}
                  style={{ width:28,height:28,borderRadius:8,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"rgba(255,200,130,0.55)" }}>✕</motion.button>
              </div>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:13 }}>
              {[
                {e:"🪑",l:"Seats",v:shop.seats>0?`${shop.seats} free`:"Full",c:shop.seats>5?"#22D67E":shop.seats>0?"#FFBA2E":"#FF4F4F"},
                {e:"⏱️",l:"Wait",v:"~12 min",c:"rgba(255,248,235,0.8)"},
                {e:"📍",l:"Dist.",v:`${shop.dist}km`,c:"rgba(255,248,235,0.8)"},
                {e:"💸",l:"Price",v:`₹${shop.price}`,c:shop.accent},
              ].map(s=>(
                <div key={s.l} style={{ background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"10px 6px",textAlign:"center",border:"1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ fontSize:16,marginBottom:4 }}>{s.e}</div>
                  <div style={{ fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:800,color:s.c,marginBottom:2 }}>{s.v}</div>
                  <div style={{ fontSize:9,color:"rgba(255,200,130,0.4)",textTransform:"uppercase",letterSpacing:"0.07em",fontWeight:700 }}>{s.l}</div>
                </div>
              ))}
            </div>
            <CrowdBar v={shop.crowd} />
            <div style={{ display:"flex",gap:10,marginTop:14 }}>
              <button className="btn-cta" style={{ flex:1,padding:"12px 0" }}>📍 Get Directions</button>
              <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}}
                style={{ flex:1,padding:"12px 16px",borderRadius:13,border:`1.5px solid rgba(255,220,130,0.14)`,background:"rgba(255,255,255,0.05)",color:"rgba(255,220,160,0.78)",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",backdropFilter:"blur(8px)",transition:"all 0.2s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=`${shop.accent}55`;e.currentTarget.style.color=shop.accent;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,220,130,0.14)";e.currentTarget.style.color="rgba(255,220,160,0.78)";}}>
                🍽️ View Full Menu
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FILTER CHIPS
═══════════════════════════════════════════════════════════════ */
function Filters({ active, setActive }) {
  return (
    <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
      {["All","Open Now","< ₹100","< 1km","Calm"].map(f=>(
        <motion.button key={f} whileHover={{scale:1.05}} whileTap={{scale:0.94}}
          onClick={()=>setActive(v=>v===f?null:f)}
          style={{ padding:"5px 12px",borderRadius:99,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"'Outfit',sans-serif",background:active===f?"linear-gradient(135deg,#FF6B1A,#FF9A4D)":"rgba(255,255,255,0.06)",color:active===f?"white":"rgba(255,200,130,0.6)",boxShadow:active===f?"0 4px 14px rgba(255,107,26,0.38)":"none",border:`1px solid ${active===f?"transparent":"rgba(255,220,130,0.1)"}`,transition:"all 0.2s" }}>
          {f}
        </motion.button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LIST VIEW CARD (full grid)
═══════════════════════════════════════════════════════════════ */
function ListViewCard({ s, i, sel, onSel, saved, onSave }) {
  const ref=useRef(null), iv=useInView(ref,{once:true});
  const [hov,setHov]=useState(false);
  const mx=useMotionValue(0),my=useMotionValue(0);
  const rx=useSpring(useTransform(my,[-70,70],[5,-5]),{stiffness:260,damping:28});
  const ry=useSpring(useTransform(mx,[-70,70],[-5,5]),{stiffness:260,damping:28});

  return (
    <motion.div ref={ref}
      initial={{opacity:0,y:28}} animate={iv?{opacity:1,y:0}:{}}
      transition={{delay:i*0.08,duration:0.5,ease:[0.16,1,0.3,1]}}
      onHoverStart={()=>setHov(true)} onHoverEnd={()=>{setHov(false);mx.set(0);my.set(0);}}
      onMouseMove={e=>{if(!ref.current)return;const r=ref.current.getBoundingClientRect();mx.set(e.clientX-r.left-r.width/2);my.set(e.clientY-r.top-r.height/2);}}
      onClick={()=>onSel(s.id===sel?null:s.id)}
      style={{ rotateX:rx,rotateY:ry,transformStyle:"preserve-3d",perspective:800,borderRadius:22,overflow:"hidden",cursor:"pointer",position:"relative",background:sel?`linear-gradient(145deg,${s.accent}18,rgba(12,17,28,0.96))`:"rgba(12,17,28,0.7)",border:`1.5px solid ${sel?s.accent+"55":"rgba(255,220,130,0.09)"}`,backdropFilter:"blur(16px)",boxShadow:sel?`0 22px 52px rgba(0,0,0,0.55),0 0 32px ${s.accent}20`:hov?"0 14px 32px rgba(0,0,0,0.4)":"0 6px 22px rgba(0,0,0,0.3)",transition:"box-shadow 0.3s" }}>
      <div style={{ height:2.5,background:`linear-gradient(90deg,transparent,${s.accent},transparent)` }} />
      {/* Emoji hero */}
      <div style={{ height:90,background:`linear-gradient(135deg,${s.accent}14,${s.accent}05)`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative" }}>
        <motion.div animate={{y:[0,-5,0]}} transition={{duration:3+s.id*0.3,repeat:Infinity,ease:"easeInOut"}} style={{ fontSize:46 }}>{s.emoji}</motion.div>
        <div style={{ position:"absolute",top:10,right:10,fontSize:8,fontWeight:800,padding:"3px 9px",borderRadius:99,background:s.open?"rgba(34,214,126,0.12)":"rgba(255,79,79,0.1)",color:s.open?"#22D67E":"#FF4F4F",border:`1px solid ${s.open?"rgba(34,214,126,0.25)":"rgba(255,79,79,0.2)"}` }}>{s.open?"● Open":"● Closed"}</div>
        <div style={{ position:"absolute",top:10,left:10,fontSize:9,fontWeight:800,padding:"3px 8px",borderRadius:99,background:`${s.accent}18`,color:s.accent,border:`1px solid ${s.accent}28` }}>{s.tags[0]}</div>
      </div>
      <div style={{ padding:"13px 15px 15px" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8 }}>
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:800,color:"rgba(255,248,235,0.95)",marginBottom:2 }}>{s.name}</div>
            <div style={{ fontSize:10,color:"rgba(255,200,130,0.45)" }}>{s.type}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:s.accent }}>₹{s.price}</div>
            <div style={{ display:"flex",alignItems:"center",gap:3,justifyContent:"flex-end",marginTop:2 }}><Stars r={s.rating} sz={10}/><span style={{ fontSize:10,fontWeight:700,color:"rgba(255,248,235,0.8)" }}>{s.rating}</span></div>
          </div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:10 }}>
          {[{e:"📍",v:`${s.dist}km`,l:"Dist"},{e:"🪑",v:s.seats>0?`${s.seats} free`:"Full",l:"Seats"},{e:"⏱️",v:"~12m",l:"Wait"}].map(st=>(
            <div key={st.l} style={{ background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"9px 5px",textAlign:"center",border:"1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize:13,marginBottom:2 }}>{st.e}</div>
              <div style={{ fontSize:11,fontWeight:700,color:"rgba(255,248,235,0.88)" }}>{st.v}</div>
              <div style={{ fontSize:9,color:"rgba(255,200,130,0.32)",marginTop:1 }}>{st.l}</div>
            </div>
          ))}
        </div>
        <CrowdBar v={s.crowd} />
        <div style={{ display:"flex",gap:8,marginTop:13 }}>
          <button className="btn-cta" style={{ flex:1,fontSize:12,padding:"10px 0" }} onClick={e=>e.stopPropagation()}>📍 Directions</button>
          <motion.button whileTap={{scale:0.88}} onClick={e=>{e.stopPropagation();onSave(s.id);}}
            style={{ width:40,height:40,borderRadius:11,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,220,130,0.12)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15 }}>
            {saved?"❤️":"🤍"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════════ */
export default function FoodFinderMapView() {
  const [view,       setView]       = useState("map");
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId,  setHoveredId]  = useState(null);
  const [filter,     setFilter]     = useState(null);
  const [search,     setSearch]     = useState("");
  const [saved,      setSaved]      = useState(new Set());

  const selShop = SHOPS.find(s=>s.id===selectedId)||null;
  const toggleSave = id => setSaved(s=>{const n=new Set(s);n.has(id)?n.delete(id):n.add(id);return n;});

  const filtered = SHOPS.filter(s=>{
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter==="Open Now" && !s.open) return false;
    if (filter==="< ₹100" && s.price>=100) return false;
    if (filter==="< 1km" && s.dist>=1) return false;
    if (filter==="Calm" && s.crowd>=40) return false;
    return true;
  });

  return (
    <div style={{ height:"100vh",background:"#080B12",display:"flex",flexDirection:"column",overflow:"hidden",position:"relative" }}>
      <GS />

      {/* Ambient glows */}
      <div style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none" }}>
        <div style={{ position:"absolute",top:"8%",left:"18%",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,107,26,0.04),transparent 70%)",filter:"blur(80px)" }} />
        <div style={{ position:"absolute",bottom:"12%",right:"8%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(91,156,246,0.04),transparent 70%)",filter:"blur(70px)" }} />
      </div>

      {/* NAV */}
      <motion.header initial={{y:-56,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.6,ease:[0.16,1,0.3,1]}}
        style={{ position:"relative",zIndex:20,display:"flex",alignItems:"center",gap:13,padding:"0 20px",height:58,background:"rgba(8,11,18,0.94)",backdropFilter:"blur(24px)",borderBottom:"1px solid rgba(255,220,130,0.07)",flexShrink:0 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8,flexShrink:0 }}>
          <div style={{ width:32,height:32,borderRadius:10,background:"linear-gradient(135deg,#FF6B1A,#FF9A4D)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,boxShadow:"0 4px 14px rgba(255,107,26,0.42)" }}>🍴</div>
          <span style={{ fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:800,color:"rgba(255,248,235,0.95)" }}>Food<span style={{ color:"#FF6B1A" }}>Finder</span></span>
        </div>
        <div style={{ position:"relative",width:250 }}>
          <span style={{ position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",fontSize:13,opacity:0.35 }}>🔍</span>
          <input className="ff-search" placeholder="Search food or shops…" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <div style={{ flex:1 }} />
        <div style={{ display:"flex",alignItems:"center",gap:7,padding:"5px 12px",borderRadius:99,background:"rgba(34,214,126,0.08)",border:"1px solid rgba(34,214,126,0.2)" }}>
          <div style={{ position:"relative",width:7,height:7 }}>
            <div style={{ position:"absolute",inset:0,borderRadius:"50%",background:"#22D67E",animation:"pulse-dot 1.8s ease-out infinite" }} />
            <div style={{ width:7,height:7,borderRadius:"50%",background:"#22D67E" }} />
          </div>
          <span style={{ fontSize:11,fontWeight:700,color:"#22D67E" }}>{filtered.filter(s=>s.open).length} open nearby</span>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:10,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,220,130,0.1)",cursor:"pointer",flexShrink:0 }}>
          <span style={{ fontSize:13 }}>📍</span>
          <span style={{ fontSize:12,fontWeight:600,color:"rgba(255,220,160,0.65)" }}>Hazratganj, LKO</span>
          <span style={{ fontSize:10,color:"rgba(255,200,130,0.35)" }}>▾</span>
        </div>
        {/* View toggle */}
        <div style={{ display:"flex",background:"rgba(255,255,255,0.05)",borderRadius:11,padding:"3px",border:"1px solid rgba(255,220,130,0.1)",gap:3 }}>
          {[{l:"🗺️ Map",v:"map"},{l:"☰ List",v:"list"}].map(t=>(
            <motion.button key={t.v} whileTap={{scale:0.94}} onClick={()=>setView(t.v)}
              style={{ padding:"6px 14px",borderRadius:9,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'Outfit',sans-serif",background:view===t.v?"linear-gradient(135deg,#FF6B1A,#FF9A4D)":"transparent",color:view===t.v?"white":"rgba(255,200,130,0.55)",boxShadow:view===t.v?"0 3px 12px rgba(255,107,26,0.4)":"none",transition:"all 0.2s" }}>
              {t.l}
            </motion.button>
          ))}
        </div>
        <div style={{ position:"relative" }}>
          <div style={{ width:34,height:34,borderRadius:10,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,220,130,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,cursor:"pointer" }}>🔔</div>
          <div style={{ position:"absolute",top:5,right:5,width:7,height:7,borderRadius:"50%",background:"#FF6B1A",border:"2px solid #080B12" }} />
        </div>
        <div style={{ width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#FF6B1A,#FFB830)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"#fff",cursor:"pointer",boxShadow:"0 3px 12px rgba(255,107,26,0.35)",flexShrink:0 }}>A</div>
      </motion.header>

      {/* CONTENT */}
      <div style={{ flex:1,display:"flex",overflow:"hidden",position:"relative",zIndex:2 }}>
        <AnimatePresence mode="wait">

          {/* MAP VIEW */}
          {view==="map"&&(
            <motion.div key="map" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}} style={{ flex:1,display:"flex",overflow:"hidden" }}>

              {/* Map area */}
              <div style={{ flex:1,position:"relative",overflow:"hidden" }}>
                <MapCanvas shops={filtered} selectedId={selectedId} hoveredId={hoveredId} onSelect={setSelectedId} onHover={setHoveredId} />

                {/* Filter overlay */}
                <motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} transition={{delay:0.35}}
                  style={{ position:"absolute",top:14,left:14,right:88,zIndex:20,display:"flex",flexDirection:"column",gap:8 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <div style={{ padding:"7px 14px",borderRadius:12,background:"rgba(10,15,26,0.92)",border:"1px solid rgba(255,220,130,0.12)",backdropFilter:"blur(16px)",fontSize:12,fontWeight:700,color:"rgba(255,220,160,0.7)",display:"flex",alignItems:"center",gap:6 }}>
                      <span style={{ fontSize:14 }}>🗺️</span>Hazratganj · {filtered.length} shops
                    </div>
                  </div>
                  <div style={{ background:"rgba(10,15,26,0.9)",border:"1px solid rgba(255,220,130,0.1)",backdropFilter:"blur(16px)",borderRadius:14,padding:"10px 14px" }}>
                    <Filters active={filter} setActive={setFilter} />
                  </div>
                </motion.div>

                <FloatingCard shop={selShop} onClose={()=>setSelectedId(null)} />
              </div>

              {/* Sidebar */}
              <motion.div initial={{x:330,opacity:0}} animate={{x:0,opacity:1}} transition={{duration:0.5,ease:[0.16,1,0.3,1]}}
                style={{ width:330,display:"flex",flexDirection:"column",background:"rgba(8,11,18,0.96)",borderLeft:"1px solid rgba(255,220,130,0.07)",backdropFilter:"blur(24px)",overflow:"hidden" }}>
                <div style={{ padding:"14px 14px 11px",borderBottom:"1px solid rgba(255,220,130,0.07)",flexShrink:0 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
                    <div>
                      <div style={{ fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:800,color:"rgba(255,248,235,0.95)",marginBottom:2 }}>Nearby Shops</div>
                      <div style={{ fontSize:10,color:"rgba(255,200,130,0.45)" }}>{filtered.length} results · by distance</div>
                    </div>
                    <div style={{ fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:99,background:"rgba(255,107,26,0.14)",color:"#FF6B1A",border:"1px solid rgba(255,107,26,0.28)" }}>Live 🔴</div>
                  </div>
                  <Filters active={filter} setActive={setFilter} />
                </div>
                <div style={{ flex:1,overflowY:"auto",padding:"10px",display:"flex",flexDirection:"column",gap:9 }}>
                  {filtered.length===0?(
                    <div style={{ textAlign:"center",padding:"40px 16px" }}>
                      <div style={{ fontSize:34,marginBottom:10 }}>🍽️</div>
                      <div style={{ fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,color:"rgba(255,248,235,0.7)",marginBottom:5 }}>No shops match</div>
                      <div style={{ fontSize:11,color:"rgba(255,200,130,0.4)" }}>Try clearing filters</div>
                    </div>
                  ):(
                    filtered.map((s,i)=><ShopListCard key={s.id} s={s} idx={i} sel={selectedId} onSel={setSelectedId} />)
                  )}
                </div>
                <div style={{ padding:"11px 14px",borderTop:"1px solid rgba(255,220,130,0.07)",flexShrink:0 }}>
                  <button className="btn-cta" style={{ width:"100%",padding:"11px 0",fontSize:13 }}>🍽️ Browse All Restaurants →</button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* LIST VIEW */}
          {view==="list"&&(
            <motion.div key="list" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:20}} transition={{duration:0.4,ease:[0.16,1,0.3,1]}}
              style={{ flex:1,overflowY:"auto",padding:"22px 24px" }}>
              <div style={{ marginBottom:18,display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:12 }}>
                <div>
                  <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:4 }}>
                    <div style={{ width:16,height:2,borderRadius:99,background:"#FF6B1A" }} />
                    <span style={{ fontSize:10,fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",color:"#FF6B1A" }}>List View</span>
                  </div>
                  <div style={{ fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:"rgba(255,248,235,0.95)" }}>{filtered.length} Shops Near You</div>
                  <p style={{ fontSize:11,color:"rgba(255,200,130,0.5)",marginTop:3 }}>Hazratganj · sorted by distance</p>
                </div>
                <Filters active={filter} setActive={setFilter} />
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16 }}>
                {filtered.map((s,i)=><ListViewCard key={s.id} s={s} i={i} sel={selectedId} onSel={setSelectedId} saved={saved.has(s.id)} onSave={toggleSave} />)}
              </div>
              {filtered.length===0&&(
                <div style={{ textAlign:"center",padding:"60px 24px" }}>
                  <div style={{ fontSize:48,marginBottom:14 }}>🍽️</div>
                  <div style={{ fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:"rgba(255,248,235,0.8)",marginBottom:8 }}>No shops match your filters</div>
                  <button className="btn-cta" onClick={()=>setFilter(null)}>Clear Filters</button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* STATUS BAR */}
      <div style={{ position:"relative",zIndex:20,height:26,background:"rgba(8,11,18,0.94)",borderTop:"1px solid rgba(255,220,130,0.06)",display:"flex",alignItems:"center",padding:"0 20px",gap:20,flexShrink:0 }}>
        {[{e:"🟢",t:`${SHOPS.filter(s=>s.open).length} open`},{e:"📍",t:"Hazratganj"},{e:"⏱️",t:"Updated now"},{e:"🎯",t:`${filtered.length} shown`}].map(i=>(
          <span key={i.t} style={{ fontSize:10,color:"rgba(255,200,130,0.32)",fontWeight:600,display:"flex",alignItems:"center",gap:4 }}><span>{i.e}</span>{i.t}</span>
        ))}
        <div style={{ flex:1 }} />
        <span style={{ fontSize:10,color:"rgba(255,200,130,0.22)",fontWeight:600 }}>FoodFinder v2.1 · Live data</span>
      </div>
    </div>
  );
}
