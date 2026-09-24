import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

/* ═══════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════ */
const GS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Cabinet+Grotesk:wght@300;400;500;600;700;800&display=swap');

    :root {
      --bg:      #09080C;
      --bg2:     #100E16;
      --orange:  #F4631E;
      --orange2: #FF8A3D;
      --amber:   #F5A623;
      --gold:    #FFD060;
      --cream:   #FFF4E6;
      --t1:      rgba(255,244,230,0.96);
      --t2:      rgba(255,210,150,0.62);
      --t3:      rgba(255,200,130,0.30);
      --border:  rgba(255,160,80,0.10);
      --card:    rgba(20,16,28,0.88);
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      background: var(--bg);
      font-family: 'Cabinet Grotesk', sans-serif;
      color: var(--t1);
      min-height: 100vh;
      overflow-x: hidden;
    }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: rgba(244,99,30,0.35); border-radius: 99px; }

    /* noise grain */
    body::before {
      content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.030;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
    }

    /* ── Field base ── */
    .ff-field {
      width: 100%;
      padding: 13px 16px 13px 44px;
      border-radius: 14px;
      border: 1.5px solid rgba(255,160,80,0.12);
      background: rgba(255,255,255,0.04);
      color: var(--t1);
      font-size: 14px;
      font-family: 'Cabinet Grotesk', sans-serif;
      outline: none;
      transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
      caret-color: var(--orange);
    }
    .ff-field::placeholder { color: var(--t3); }
    .ff-field:focus {
      border-color: rgba(244,99,30,0.55);
      background: rgba(255,255,255,0.06);
      box-shadow: 0 0 0 4px rgba(244,99,30,0.10), 0 2px 12px rgba(0,0,0,0.3);
    }
    .ff-field.err { border-color: rgba(239,68,68,0.55); box-shadow: 0 0 0 4px rgba(239,68,68,0.09); }
    .ff-field.ok  { border-color: rgba(34,197,94,0.45); }
    select.ff-field { appearance: none; cursor: pointer; }
    textarea.ff-field { resize: none; padding-top: 13px; line-height: 1.6; }

    /* ── No-icon variant ── */
    .ff-bare {
      padding-left: 16px !important;
    }

    /* ── Range ── */
    input[type=range].ff-range {
      -webkit-appearance: none; width: 100%; height: 4px; border-radius: 99px; outline: none; cursor: pointer;
      background: linear-gradient(to right, var(--orange) 0%, var(--orange) var(--v,30%), rgba(255,160,80,0.18) var(--v,30%));
    }
    input[type=range].ff-range::-webkit-slider-thumb {
      -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, var(--orange2), var(--orange));
      border: 2.5px solid rgba(255,255,255,0.85);
      box-shadow: 0 0 10px rgba(244,99,30,0.55); cursor: pointer;
    }

    /* ── Buttons ── */
    .btn-primary {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      padding: 14px 28px; border-radius: 16px; border: none; cursor: pointer;
      background: linear-gradient(135deg, var(--orange), var(--orange2));
      color: white; font-size: 14px; font-weight: 700;
      font-family: 'Cabinet Grotesk', sans-serif;
      box-shadow: 0 8px 28px rgba(244,99,30,0.42), inset 0 1px 0 rgba(255,255,255,0.18);
      transition: all 0.2s; position: relative; overflow: hidden;
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(244,99,30,0.52); }
    .btn-primary:active { transform: scale(0.97); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .btn-primary::after {
      content: ''; position: absolute; top: -50%; left: -100%; width: 50%; height: 200%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
      transform: skewX(-20deg); animation: shimmer 3s ease-in-out infinite 1.2s;
    }

    .btn-cancel {
      display: inline-flex; align-items: center; justify-content: center; gap: 7px;
      padding: 13px 24px; border-radius: 15px;
      border: 1.5px solid rgba(255,160,80,0.16);
      background: rgba(255,255,255,0.04);
      color: var(--t2); font-size: 14px; font-weight:600;
      font-family: 'Cabinet Grotesk', sans-serif; cursor: pointer;
      backdrop-filter: blur(8px); transition: all 0.2s;
    }
    .btn-cancel:hover {
      border-color: rgba(244,99,30,0.45); color: var(--orange2);
      background: rgba(244,99,30,0.07); transform: translateY(-1px);
    }
    .btn-cancel:active { transform: scale(0.97); }

    /* ── Toggle pill group ── */
    .toggle-group {
      display: flex; gap: 8px; flex-wrap: wrap;
    }
    .tgl-btn {
      padding: 8px 16px; border-radius: 99px; font-size: 12px; font-weight: 700;
      cursor: pointer; transition: all 0.22s; border: 1.5px solid transparent;
      font-family: 'Cabinet Grotesk', sans-serif; user-select: none; white-space: nowrap;
    }
    .tgl-on  { background: rgba(244,99,30,0.18); border-color: rgba(244,99,30,0.55); color: var(--orange2); box-shadow: 0 0 0 3px rgba(244,99,30,0.10); }
    .tgl-off { background: rgba(255,255,255,0.04); border-color: rgba(255,160,80,0.13); color: var(--t3); }
    .tgl-off:hover { border-color: rgba(244,99,30,0.38); color: var(--orange2); }

    /* ── Drop zone ── */
    .drop-zone {
      border: 2px dashed rgba(255,160,80,0.22);
      border-radius: 18px; cursor: pointer;
      transition: all 0.25s;
      background: rgba(255,255,255,0.025);
    }
    .drop-zone:hover, .drop-zone.drag-over {
      border-color: rgba(244,99,30,0.55);
      background: rgba(244,99,30,0.06);
      box-shadow: 0 0 0 4px rgba(244,99,30,0.08);
    }

    /* ── Step progress ── */
    .step-dot {
      width: 8px; height: 8px; border-radius: 50%; transition: all 0.3s ease;
    }
    .step-active { background: var(--orange); box-shadow: 0 0 0 3px rgba(244,99,30,0.25); width: 24px; border-radius: 4px; }
    .step-done   { background: rgba(34,197,94,0.8); }
    .step-idle   { background: rgba(255,160,80,0.2); }

    /* ── Animations ── */
    @keyframes shimmer    { 0%{left:-100%} 100%{left:200%} }
    @keyframes pulse-glow { 0%,100%{box-shadow:0 0 24px rgba(244,99,30,0.18)} 50%{box-shadow:0 0 48px rgba(244,99,30,0.38)} }
    @keyframes float-orb  { 0%,100%{transform:translate(0,0)} 33%{transform:translate(30px,-25px)} 66%{transform:translate(-20px,15px)} }
    @keyframes float-orb2 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(-40px,20px)} 66%{transform:translate(25px,-35px)} }
    @keyframes spin-ring  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes spin-rev   { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
    @keyframes success-pop{ 0%{transform:scale(0.6) rotate(-10deg);opacity:0} 60%{transform:scale(1.1) rotate(3deg)} 100%{transform:scale(1) rotate(0deg);opacity:1} }
    @keyframes confetti-fall { 0%{transform:translateY(-20px) rotate(0deg);opacity:1} 100%{transform:translateY(100vh) rotate(720deg);opacity:0} }
    @keyframes check-draw { from{stroke-dashoffset:100} to{stroke-dashoffset:0} }

    .err-msg { font-size:11px; color:#F87171; margin-top:5px; display:flex; align-items:center; gap:4px; animation:fade-up 0.3s ease; }
    @keyframes fade-up { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }

    .field-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); font-size:15px; pointer-events:none; transition:opacity 0.2s; }
    .field-wrap { position:relative; }
  `}</style>
);

/* ═══════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════ */
const FOOD_TYPES   = ["Street Food","Fast Food","Café","South Indian","North Indian","Desserts","Healthy","Chinese","Biryani","Pizza"];
const CROWD_OPTS   = ["Low — Usually calm","Medium — Some wait","High — Busy spot"];
const STEPS        = ["Shop Info","Menu & Crowd","Media & Confirm"];

/* ═══════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════ */
function FieldWrap({ label, icon, error, ok, children }) {
  return (
    <div>
      {label && (
        <label style={{ display:"block", fontSize:11, fontWeight:700, letterSpacing:"0.09em", textTransform:"uppercase", color:"rgba(255,200,130,0.5)", marginBottom:8 }}>
          {label}
        </label>
      )}
      <div className="field-wrap">
        {icon && <span className="field-icon" style={{ opacity: ok ? 1 : 0.45 }}>{icon}</span>}
        {children}
      </div>
      <AnimatePresence>
        {error && (
          <motion.div className="err-msg" initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
            ⚠️ {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Divider({ label }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, margin:"4px 0" }}>
      <div style={{ flex:1, height:1, background:"rgba(255,160,80,0.1)" }} />
      {label && <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,200,130,0.3)" }}>{label}</span>}
      <div style={{ flex:1, height:1, background:"rgba(255,160,80,0.1)" }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CONFETTI PARTICLE
═══════════════════════════════════════════════════════════ */
function Confetti() {
  const colors = ["#F4631E","#FFB830","#FF8A3D","#FFD060","#F97316","#FCD34D"];
  const pieces = Array.from({ length: 38 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 5 + Math.random() * 7,
    delay: Math.random() * 1.5,
    dur: 2 + Math.random() * 2,
    shape: Math.random() > 0.5 ? "circle" : "rect",
  }));

  return (
    <div style={{ position:"fixed", inset:0, zIndex:100, pointerEvents:"none", overflow:"hidden" }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position:"absolute",
          left:`${p.x}%`, top:"-20px",
          width: p.size, height: p.shape==="circle" ? p.size : p.size*0.6,
          borderRadius: p.shape==="circle" ? "50%" : "2px",
          background: p.color,
          animation: `confetti-fall ${p.dur}s ease-in ${p.delay}s forwards`,
          opacity: 0,
        }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SUCCESS SCREEN
═══════════════════════════════════════════════════════════ */
function SuccessScreen({ shopName, onReset }) {
  return (
    <>
      <Confetti />
      <motion.div
        initial={{ opacity:0, scale:0.92 }}
        animate={{ opacity:1, scale:1 }}
        transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
        style={{ textAlign:"center", padding:"20px 0 8px" }}
      >
        {/* Animated check */}
        <motion.div
          style={{ width:96, height:96, borderRadius:"50%", margin:"0 auto 24px", background:"linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.08))", border:"2px solid rgba(34,197,94,0.4)", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}
          animate={{ scale:[1,1.05,1], boxShadow:["0 0 0px rgba(34,197,94,0.3)","0 0 32px rgba(34,197,94,0.5)","0 0 16px rgba(34,197,94,0.3)"] }}
          transition={{ duration:2, repeat:Infinity, ease:"easeInOut" }}
        >
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <motion.path d="M8 22 L18 32 L36 12" stroke="#22C55E" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="100" initial={{ strokeDashoffset:100 }} animate={{ strokeDashoffset:0 }} transition={{ delay:0.3, duration:0.6, ease:"easeOut" }} />
          </svg>
          {/* Ring decorations */}
          <div style={{ position:"absolute", inset:-12, borderRadius:"50%", border:"1px solid rgba(34,197,94,0.2)", animation:"spin-ring 8s linear infinite" }} />
          <div style={{ position:"absolute", inset:-22, borderRadius:"50%", border:"1px dashed rgba(244,99,30,0.15)", animation:"spin-rev 12s linear infinite" }} />
        </motion.div>

        <motion.div
          initial={{ opacity:0, y:16 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.4, duration:0.55 }}
        >
          <h2 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:28, fontWeight:700, color:"rgba(255,244,230,0.97)", marginBottom:8 }}>
            Shop Listed! 🎉
          </h2>
          <p style={{ fontSize:15, color:"rgba(255,200,130,0.6)", lineHeight:1.65, maxWidth:360, margin:"0 auto 6px" }}>
            <strong style={{ color:"rgba(255,244,230,0.85)" }}>{shopName || "Your shop"}</strong> has been successfully added to FoodFinder.
          </p>
          <p style={{ fontSize:13, color:"rgba(255,200,130,0.4)", marginBottom:32 }}>
            It will go live on the platform within 24 hours after review.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity:0, y:16 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.6, duration:0.5 }}
          style={{ display:"flex", gap:16, justifyContent:"center", marginBottom:32, flexWrap:"wrap" }}
        >
          {[["🍽️","Listed","Active now"],["🔍","Searchable","In 24 hrs"],["📍","On Map","Auto-pinned"]].map(([e,v,s]) => (
            <div key={v} style={{ padding:"14px 20px", borderRadius:16, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,160,80,0.1)", minWidth:100, textAlign:"center" }}>
              <div style={{ fontSize:22, marginBottom:6 }}>{e}</div>
              <div style={{ fontSize:13, fontWeight:700, color:"rgba(255,244,230,0.9)", marginBottom:2 }}>{v}</div>
              <div style={{ fontSize:10, color:"rgba(255,200,130,0.4)" }}>{s}</div>
            </div>
          ))}
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity:0, y:10 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.75, duration:0.5 }}
          style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}
        >
          <button className="btn-primary" style={{ fontSize:14 }}>🏪 View My Shop</button>
          <button className="btn-cancel" onClick={onReset} style={{ fontSize:13 }}>+ Add Another Shop</button>
        </motion.div>
      </motion.div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   FORM STEPS
═══════════════════════════════════════════════════════════ */
function Step1({ data, setData, errors }) {
  return (
    <motion.div key="step1" initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }} transition={{ duration:0.38, ease:[0.16,1,0.3,1] }}>
      <div style={{ display:"flex", flexDirection:"column", gap:18 }}>

        {/* Shop Name */}
        <FieldWrap label="Shop Name" icon="🏪" error={errors.name} ok={data.name.length>2}>
          <input className={`ff-field${errors.name?" err":data.name.length>2?" ok":""}`}
            placeholder="e.g. Sharma Ji Ka Dhaba"
            value={data.name}
            onChange={e=>setData(d=>({...d,name:e.target.value}))}
          />
        </FieldWrap>

        {/* Owner Name */}
        <FieldWrap label="Owner / Contact Name" icon="👤" error={errors.owner} ok={data.owner.length>2}>
          <input className={`ff-field${errors.owner?" err":data.owner.length>2?" ok":""}`}
            placeholder="Your full name"
            value={data.owner}
            onChange={e=>setData(d=>({...d,owner:e.target.value}))}
          />
        </FieldWrap>

        {/* Location */}
        <FieldWrap label="Address / Location" icon="📍" error={errors.address} ok={data.address.length>5}>
          <input className={`ff-field${errors.address?" err":data.address.length>5?" ok":""}`}
            placeholder="Full address with landmark, city…"
            value={data.address}
            onChange={e=>setData(d=>({...d,address:e.target.value}))}
          />
        </FieldWrap>

        {/* Phone */}
        <FieldWrap label="Phone Number" icon="📞" error={errors.phone} ok={/^\d{10}$/.test(data.phone)}>
          <input className={`ff-field${errors.phone?" err":/^\d{10}$/.test(data.phone)?" ok":""}`}
            placeholder="10-digit mobile number"
            type="tel" maxLength={10}
            value={data.phone}
            onChange={e=>setData(d=>({...d,phone:e.target.value.replace(/\D/,"")})) }
          />
        </FieldWrap>

        {/* Opening hours */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <FieldWrap label="Opening Time" icon="🌅">
            <input className="ff-field" type="time" value={data.openTime}
              onChange={e=>setData(d=>({...d,openTime:e.target.value}))}
              style={{ colorScheme:"dark" }}
            />
          </FieldWrap>
          <FieldWrap label="Closing Time" icon="🌙">
            <input className="ff-field" type="time" value={data.closeTime}
              onChange={e=>setData(d=>({...d,closeTime:e.target.value}))}
              style={{ colorScheme:"dark" }}
            />
          </FieldWrap>
        </div>

      </div>
    </motion.div>
  );
}

function Step2({ data, setData, errors }) {
  const pricePct = Math.round(((data.maxPrice-50)/450)*100);

  return (
    <motion.div key="step2" initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }} transition={{ duration:0.38, ease:[0.16,1,0.3,1] }}>
      <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

        {/* Price range */}
        <div>
          <label style={{ display:"block", fontSize:11, fontWeight:700, letterSpacing:"0.09em", textTransform:"uppercase", color:"rgba(255,200,130,0.5)", marginBottom:10 }}>Price Range</label>
          <div style={{ padding:"16px 18px", borderRadius:16, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,160,80,0.1)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
              <div>
                <span style={{ fontSize:10, color:"rgba(255,200,130,0.4)" }}>Min</span>
                <div style={{ fontSize:18, fontFamily:"'Clash Display',sans-serif", fontWeight:700, color:"rgba(255,244,230,0.9)" }}>₹{data.minPrice}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <span style={{ fontSize:10, color:"rgba(255,200,130,0.4)" }}>Max per person</span>
                <div style={{ fontSize:24, fontFamily:"'Clash Display',sans-serif", fontWeight:700, color:"#F4631E" }}>₹{data.maxPrice}</div>
              </div>
            </div>
            <input type="range" className="ff-range" min={50} max={500} step={10}
              value={data.maxPrice} style={{ "--v":`${pricePct}%` }}
              onChange={e=>setData(d=>({...d,maxPrice:Number(e.target.value)}))} />
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
              <span style={{ fontSize:10, color:"rgba(255,200,130,0.3)" }}>₹50</span>
              <div style={{ display:"flex", gap:6 }}>
                {[100,200,300,400,500].map(v=>(
                  <button key={v} type="button" onClick={()=>setData(d=>({...d,maxPrice:v}))}
                    style={{ fontSize:10, padding:"3px 8px", borderRadius:99, cursor:"pointer", fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:700, transition:"all 0.18s",
                      border:`1px solid ${data.maxPrice===v?"rgba(244,99,30,0.55)":"rgba(255,160,80,0.15)"}`,
                      background:data.maxPrice===v?"rgba(244,99,30,0.15)":"rgba(255,255,255,0.04)",
                      color:data.maxPrice===v?"#FF8A3D":"rgba(255,200,130,0.4)",
                    }}>₹{v}</button>
                ))}
              </div>
              <span style={{ fontSize:10, color:"rgba(255,200,130,0.3)" }}>₹500</span>
            </div>
          </div>
        </div>

        {/* Seating */}
        <FieldWrap label="Seating Capacity" icon="🪑" error={errors.seats}>
          <input className={`ff-field${errors.seats?" err":""}`} type="number" min={0} max={500}
            placeholder="Number of seats (0 if takeaway only)"
            value={data.seats}
            onChange={e=>setData(d=>({...d,seats:e.target.value}))}
          />
        </FieldWrap>

        {/* Crowd level */}
        <div>
          <label style={{ display:"block", fontSize:11, fontWeight:700, letterSpacing:"0.09em", textTransform:"uppercase", color:"rgba(255,200,130,0.5)", marginBottom:8 }}>Typical Crowd Level</label>
          <div style={{ display:"flex", gap:10 }}>
            {[
              { v:"Low",    e:"🟢", desc:"Usually quiet",    color:"#22C55E" },
              { v:"Medium", e:"🟡", desc:"Some wait times",  color:"#F59E0B" },
              { v:"High",   e:"🔴", desc:"Always busy",      color:"#EF4444" },
            ].map(opt => {
              const on = data.crowd === opt.v;
              return (
                <motion.div key={opt.v} whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                  onClick={()=>setData(d=>({...d,crowd:opt.v}))}
                  style={{ flex:1, padding:"13px 10px", borderRadius:14, cursor:"pointer", textAlign:"center", transition:"all 0.2s",
                    background:on?`${opt.color}18`:"rgba(255,255,255,0.03)",
                    border:`1.5px solid ${on?`${opt.color}55`:"rgba(255,160,80,0.12)"}`,
                    boxShadow:on?`0 0 0 3px ${opt.color}18`:"none",
                  }}>
                  <div style={{ fontSize:20, marginBottom:6 }}>{opt.e}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:on?opt.color:"rgba(255,200,130,0.6)" }}>{opt.v}</div>
                  <div style={{ fontSize:10, color:"rgba(255,200,130,0.35)", marginTop:2 }}>{opt.desc}</div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Food types */}
        <div>
          <label style={{ display:"block", fontSize:11, fontWeight:700, letterSpacing:"0.09em", textTransform:"uppercase", color:"rgba(255,200,130,0.5)", marginBottom:10 }}>
            Food Types <span style={{ color:"rgba(255,200,130,0.3)", textTransform:"none", letterSpacing:0, fontWeight:400 }}>(select all that apply)</span>
          </label>
          <div className="toggle-group">
            {FOOD_TYPES.map(t=>{
              const on = data.foodTypes.includes(t);
              return (
                <button key={t} type="button" className={`tgl-btn ${on?"tgl-on":"tgl-off"}`}
                  onClick={()=>setData(d=>({...d,foodTypes:on?d.foodTypes.filter(x=>x!==t):[...d.foodTypes,t]}))}>
                  {t}
                </button>
              );
            })}
          </div>
          {errors.foodTypes && <div className="err-msg" style={{ marginTop:6 }}>⚠️ {errors.foodTypes}</div>}
        </div>

        {/* Veg / Non-veg */}
        <div>
          <label style={{ display:"block", fontSize:11, fontWeight:700, letterSpacing:"0.09em", textTransform:"uppercase", color:"rgba(255,200,130,0.5)", marginBottom:8 }}>Menu Type</label>
          <div style={{ display:"flex", gap:10 }}>
            {[
              { v:"Pure Veg",    e:"🟢", color:"#22C55E" },
              { v:"Non-Veg",    e:"🔴", color:"#EF4444" },
              { v:"Both",       e:"🔵", color:"#3B82F6" },
            ].map(opt=>{
              const on = data.menuType === opt.v;
              return (
                <motion.div key={opt.v} whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                  onClick={()=>setData(d=>({...d,menuType:opt.v}))}
                  style={{ flex:1, padding:"11px 8px", borderRadius:13, cursor:"pointer", textAlign:"center", transition:"all 0.2s",
                    background:on?`${opt.color}18`:"rgba(255,255,255,0.03)",
                    border:`1.5px solid ${on?`${opt.color}55`:"rgba(255,160,80,0.12)"}`,
                    boxShadow:on?`0 0 0 3px ${opt.color}14`:"none",
                  }}>
                  <div style={{ fontSize:16, marginBottom:4 }}>{opt.e}</div>
                  <div style={{ fontSize:11, fontWeight:700, color:on?opt.color:"rgba(255,200,130,0.6)" }}>{opt.v}</div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <FieldWrap label="Short Description" icon="📝">
          <textarea className="ff-field" rows={3}
            placeholder="Tell customers what makes your shop special…"
            value={data.desc}
            onChange={e=>setData(d=>({...d,desc:e.target.value}))}
            style={{ paddingLeft:44 }}
          />
        </FieldWrap>

      </div>
    </motion.div>
  );
}

function Step3({ data, setData }) {
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = e => setData(d=>({...d,image:e.target.result,imageName:file.name}));
    reader.readAsDataURL(file);
  };

  const handleDrop = e => {
    e.preventDefault(); setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <motion.div key="step3" initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }} transition={{ duration:0.38, ease:[0.16,1,0.3,1] }}>
      <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

        {/* Image upload */}
        <div>
          <label style={{ display:"block", fontSize:11, fontWeight:700, letterSpacing:"0.09em", textTransform:"uppercase", color:"rgba(255,200,130,0.5)", marginBottom:10 }}>
            Shop Photo <span style={{ color:"rgba(255,200,130,0.3)", textTransform:"none", letterSpacing:0, fontWeight:400 }}>(optional)</span>
          </label>
          <div
            className={`drop-zone${dragOver?" drag-over":""}`}
            style={{ padding:"28px 20px", textAlign:"center", position:"relative" }}
            onClick={() => fileRef.current?.click()}
            onDragOver={e=>{ e.preventDefault(); setDragOver(true); }}
            onDragLeave={()=>setDragOver(false)}
            onDrop={handleDrop}
          >
            <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }}
              onChange={e=>handleFile(e.target.files[0])} />

            <AnimatePresence mode="wait">
              {data.image ? (
                <motion.div key="preview" initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}>
                  <div style={{ position:"relative", display:"inline-block" }}>
                    <img src={data.image} alt="preview" style={{ width:"100%", maxHeight:180, objectFit:"cover", borderRadius:12 }} />
                    <motion.button whileTap={{ scale:0.9 }}
                      onClick={e=>{ e.stopPropagation(); setData(d=>({...d,image:null,imageName:""})); }}
                      style={{ position:"absolute", top:8, right:8, width:28, height:28, borderRadius:8, background:"rgba(0,0,0,0.7)", border:"none", color:"white", fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</motion.button>
                  </div>
                  <div style={{ fontSize:11, color:"rgba(255,200,130,0.5)", marginTop:10 }}>📎 {data.imageName}</div>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity:0 }} animate={{ opacity:1 }}>
                  <div style={{ fontSize:40, marginBottom:12, filter:"grayscale(0.3)" }}>🖼️</div>
                  <div style={{ fontSize:14, fontWeight:600, color:"rgba(255,200,130,0.55)", marginBottom:4 }}>Drag & drop or click to upload</div>
                  <div style={{ fontSize:11, color:"rgba(255,200,130,0.3)" }}>JPG, PNG, WebP — Max 5MB</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Website */}
        <FieldWrap label="Website / Social Link" icon="🔗">
          <input className="ff-field" placeholder="https://instagram.com/yourshop (optional)"
            value={data.website}
            onChange={e=>setData(d=>({...d,website:e.target.value}))}
          />
        </FieldWrap>

        {/* Review summary card */}
        <div style={{ borderRadius:18, overflow:"hidden", border:"1px solid rgba(255,160,80,0.12)", background:"rgba(255,255,255,0.025)" }}>
          <div style={{ padding:"12px 16px", borderBottom:"1px solid rgba(255,160,80,0.09)", background:"rgba(244,99,30,0.07)" }}>
            <span style={{ fontSize:12, fontWeight:700, color:"rgba(255,200,130,0.7)", letterSpacing:"0.07em", textTransform:"uppercase" }}>📋 Shop Summary</span>
          </div>
          <div style={{ padding:"16px", display:"flex", flexDirection:"column", gap:8 }}>
            {[
              { k:"Shop Name",   v:data.name||"—" },
              { k:"Address",     v:data.address||"—" },
              { k:"Hours",       v:data.openTime&&data.closeTime?`${data.openTime} – ${data.closeTime}`:"—" },
              { k:"Price Range", v:`₹50 – ₹${data.maxPrice}` },
              { k:"Seating",     v:data.seats?`${data.seats} seats`:"Takeaway only" },
              { k:"Crowd",       v:data.crowd },
              { k:"Food Types",  v:data.foodTypes.length?data.foodTypes.join(", "):"—" },
              { k:"Menu",        v:data.menuType },
            ].map(r=>(
              <div key={r.k} style={{ display:"flex", gap:12, fontSize:12 }}>
                <span style={{ color:"rgba(255,200,130,0.42)", minWidth:90, flexShrink:0 }}>{r.k}</span>
                <span style={{ color:"rgba(255,244,230,0.82)", fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Terms */}
        <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
          <div onClick={()=>setData(d=>({...d,agreed:!d.agreed}))}
            style={{ width:18, height:18, borderRadius:6, border:`1.5px solid ${data.agreed?"rgba(244,99,30,0.55)":"rgba(255,160,80,0.2)"}`, background:data.agreed?"rgba(244,99,30,0.15)":"rgba(255,255,255,0.04)", cursor:"pointer", flexShrink:0, marginTop:1, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s", position:"relative" }}>
            {data.agreed && <span style={{ fontSize:10, color:"#FF8A3D", fontWeight:800 }}>✓</span>}
          </div>
          <label style={{ fontSize:12, color:"rgba(255,200,130,0.55)", lineHeight:1.6, cursor:"pointer" }}
            onClick={()=>setData(d=>({...d,agreed:!d.agreed}))}>
            I confirm that this information is accurate and I agree to FoodFinder's{" "}
            <a href="#" style={{ color:"#F4631E", textDecoration:"none", fontWeight:700 }}>Terms of Service</a> and{" "}
            <a href="#" style={{ color:"#F4631E", textDecoration:"none", fontWeight:700 }}>Listing Guidelines</a>.
          </label>
        </div>

      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   NAV BAR
═══════════════════════════════════════════════════════════ */
function NavBar() {
  return (
    <motion.header
      initial={{ y:-58, opacity:0 }}
      animate={{ y:0, opacity:1 }}
      transition={{ duration:0.6, ease:[0.16,1,0.3,1] }}
      style={{ position:"sticky", top:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", height:60, background:"rgba(9,8,12,0.82)", backdropFilter:"blur(22px)", borderBottom:"1px solid rgba(255,160,80,0.08)" }}
    >
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ width:34, height:34, borderRadius:11, background:"linear-gradient(135deg,#F4631E,#FF8A3D)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, boxShadow:"0 4px 14px rgba(244,99,30,0.42)" }}>🍴</div>
        <span style={{ fontFamily:"'Clash Display',sans-serif", fontSize:18, fontWeight:700, color:"rgba(255,244,230,0.97)" }}>
          Food<span style={{ color:"#F4631E" }}>Finder</span>
        </span>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:10, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,160,80,0.1)" }}>
        <span style={{ fontSize:13 }}>🏪</span>
        <span style={{ fontSize:12, fontWeight:600, color:"rgba(255,200,130,0.6)" }}>Add Your Shop</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ fontSize:12, color:"rgba(255,200,130,0.4)", display:"flex", alignItems:"center", gap:5 }}>
          <span>💬</span><span>Need help?</span>
        </div>
        <div style={{ width:34, height:34, borderRadius:10, background:"linear-gradient(135deg,#F4631E,#F5A623)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:800, color:"white", boxShadow:"0 3px 10px rgba(244,99,30,0.32)" }}>A</div>
      </div>
    </motion.header>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT PAGE
═══════════════════════════════════════════════════════════ */
const DEFAULT_DATA = {
  name:"", owner:"", address:"", phone:"", openTime:"08:00", closeTime:"22:00",
  minPrice:50, maxPrice:200, seats:"", crowd:"Medium", foodTypes:[], menuType:"Both",
  desc:"", image:null, imageName:"", website:"", agreed:false,
};

export default function AddShopPage() {
  const [step, setStep]     = useState(0);
  const [data, setData]     = useState(DEFAULT_DATA);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone]     = useState(false);

  const validStep = (s) => {
    const e = {};
    if (s === 0) {
      if (!data.name.trim())    e.name    = "Shop name is required";
      if (!data.owner.trim())   e.owner   = "Owner name is required";
      if (!data.address.trim()) e.address = "Address is required";
      if (!/^\d{10}$/.test(data.phone)) e.phone = "Enter a valid 10-digit number";
    }
    if (s === 1) {
      if (!data.seats && data.seats !== "0") e.seats = "Enter seating capacity (0 for takeaway)";
      if (!data.foodTypes.length) e.foodTypes = "Select at least one food type";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validStep(step)) setStep(s => Math.min(s+1, 2)); };
  const back = () => { setErrors({}); setStep(s => Math.max(s-1, 0)); };

  const submit = async () => {
    if (!data.agreed) { setErrors({ agreed:"Please accept the terms to continue." }); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    setDone(true);
  };

  const reset = () => { setDone(false); setStep(0); setData(DEFAULT_DATA); setErrors({}); };

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg,#09080C)", position:"relative", zIndex:1 }}>
      <GS />

      {/* Ambient glows */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:"5%", left:"10%", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,rgba(244,99,30,0.07),transparent 70%)", filter:"blur(80px)", animation:"float-orb 18s ease-in-out infinite" }} />
        <div style={{ position:"absolute", bottom:"10%", right:"8%", width:450, height:450, borderRadius:"50%", background:"radial-gradient(circle,rgba(245,166,35,0.07),transparent 70%)", filter:"blur(65px)", animation:"float-orb2 22s ease-in-out infinite" }} />
        <div style={{ position:"absolute", top:"40%", left:"55%", width:350, height:350, borderRadius:"50%", background:"radial-gradient(circle,rgba(244,99,30,0.04),transparent 70%)", filter:"blur(60px)" }} />
      </div>

      <div style={{ position:"relative", zIndex:2 }}><NavBar /></div>

      {/* Page body */}
      <main style={{ position:"relative", zIndex:2, padding:"32px 20px 60px", display:"flex", flexDirection:"column", alignItems:"center" }}>

        {/* Page title */}
        {!done && (
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1, duration:0.6, ease:[0.16,1,0.3,1] }}
            style={{ textAlign:"center", marginBottom:28, maxWidth:520 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"6px 14px", borderRadius:99, background:"rgba(244,99,30,0.1)", border:"1px solid rgba(244,99,30,0.25)", marginBottom:14 }}>
              <span style={{ fontSize:14 }}>🏪</span>
              <span style={{ fontSize:12, fontWeight:700, color:"rgba(255,180,100,0.85)", letterSpacing:"0.07em" }}>For Shop Owners</span>
            </div>
            <h1 style={{ fontFamily:"'Clash Display',sans-serif", fontSize:"clamp(26px,4vw,38px)", fontWeight:700, color:"rgba(255,244,230,0.97)", lineHeight:1.15, marginBottom:10 }}>
              List Your Shop on
              <span style={{ background:"linear-gradient(135deg,#F4631E,#FFB830)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}> FoodFinder</span>
            </h1>
            <p style={{ fontSize:14, color:"rgba(255,200,130,0.5)", lineHeight:1.65 }}>
              Reach 50,000+ hungry customers nearby. It's free to list and takes less than 3 minutes.
            </p>
          </motion.div>
        )}

        {/* Main card */}
        <motion.div
          initial={{ opacity:0, y:36 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:0.22, duration:0.65, ease:[0.16,1,0.3,1] }}
          style={{
            width:"100%", maxWidth:600,
            borderRadius:28,
            background:"rgba(20,16,28,0.85)",
            border:"1px solid rgba(255,160,80,0.1)",
            backdropFilter:"blur(28px)",
            WebkitBackdropFilter:"blur(28px)",
            boxShadow:"0 32px 80px rgba(0,0,0,0.65), 0 1px 0 rgba(255,255,255,0.05) inset",
            overflow:"hidden",
            animation: done ? "none" : "pulse-glow 4s ease-in-out infinite",
          }}
        >
          {/* Card top line */}
          <div style={{ height:2.5, background:"linear-gradient(90deg, transparent, #F4631E 30%, #FFB830 70%, transparent)" }} />

          <div style={{ padding:"28px 32px 26px" }}>
            {done ? (
              <SuccessScreen shopName={data.name} onReset={reset} />
            ) : (
              <>
                {/* Step indicator */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:26 }}>
                  <div>
                    <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:11, fontWeight:600, color:"rgba(255,200,130,0.45)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>
                      Step {step+1} of {STEPS.length}
                    </div>
                    <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:20, fontWeight:700, color:"rgba(255,244,230,0.97)" }}>
                      {STEPS[step]}
                    </div>
                  </div>
                  {/* Step dots */}
                  <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                    {STEPS.map((_,i) => (
                      <div key={i} className={`step-dot ${i===step?"step-active":i<step?"step-done":"step-idle"}`} />
                    ))}
                  </div>
                </div>

                <Divider />

                {/* Form step content */}
                <div style={{ marginTop:22 }}>
                  <AnimatePresence mode="wait">
                    {step===0 && <Step1 data={data} setData={setData} errors={errors} />}
                    {step===1 && <Step2 data={data} setData={setData} errors={errors} />}
                    {step===2 && <Step3 data={data} setData={setData} />}
                  </AnimatePresence>
                </div>

                {/* Terms error */}
                {errors.agreed && (
                  <div className="err-msg" style={{ marginTop:12 }}>⚠️ {errors.agreed}</div>
                )}

                {/* Navigation buttons */}
                <div style={{ display:"flex", gap:12, marginTop:26, justifyContent:"flex-end", alignItems:"center" }}>
                  {step > 0 && (
                    <button className="btn-cancel" onClick={back}>← Back</button>
                  )}
                  <div style={{ flex:1 }} />
                  {step === 0 && (
                    <button className="btn-cancel" onClick={reset}>Cancel</button>
                  )}
                  {step < 2 ? (
                    <motion.button
                      whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                      className="btn-primary" onClick={next} style={{ minWidth:140 }}>
                      Continue → <span style={{ fontSize:16 }}>✦</span>
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                      className="btn-primary" onClick={submit} disabled={loading || !data.agreed}
                      style={{ minWidth:160 }}>
                      {loading ? (
                        <span style={{ display:"inline-flex", alignItems:"center", gap:8 }}>
                          <motion.span
                            animate={{ rotate:360 }}
                            transition={{ duration:0.8, repeat:Infinity, ease:"linear" }}
                            style={{ display:"inline-block", width:16, height:16, borderRadius:"50%", border:"2.5px solid rgba(255,255,255,0.3)", borderTopColor:"#fff" }}
                          />
                          Submitting…
                        </span>
                      ) : "🚀 Add My Shop"}
                    </motion.button>
                  )}
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Trust badges */}
        {!done && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.8 }}
            style={{ display:"flex", gap:22, marginTop:24, alignItems:"center", flexWrap:"wrap", justifyContent:"center" }}>
            {["🔒 Secure & private","✅ Free to list","⚡ Live in 24 hrs","🌟 50K+ customers"].map(b => (
              <span key={b} style={{ fontSize:12, color:"rgba(255,200,130,0.35)", fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>{b}</span>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
