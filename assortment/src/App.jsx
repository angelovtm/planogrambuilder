import { useState, useRef, useEffect, useCallback } from "react";

// ── Auth constants ─────────────────────────────────────────────────────────────
const VALID_USERNAME = "Stoyan.also";
const VALID_PASSWORD = "Admin";
const SESSION_KEY    = "auth:session";
const CREDS_KEY      = "auth:credentials";

// ── LoginPage ──────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(false);

  // Pre-fill saved credentials on mount
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(CREDS_KEY);
        if (r) { const c = JSON.parse(r.value); setUsername(c.username || ""); setPassword(c.password || ""); }
      } catch {}
    })();
  }, []);

  const handleSubmit = async () => {
    setError("");
    if (!username.trim() || !password) { setError("Please enter username and password."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 520)); // slight auth feel
    if (username.trim() === VALID_USERNAME && password === VALID_PASSWORD) {
      // Fire storage saves in background — don't block onLogin on them
      try { window.storage.set(CREDS_KEY, JSON.stringify({ username: username.trim(), password })); } catch {}
      try { window.storage.set(SESSION_KEY, JSON.stringify({ username: username.trim(), loggedIn: true, at: Date.now() })); } catch {}
      onLogin(username.trim());
    } else {
      setError("Invalid username or password.");
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <div style={LS.root}>
      {/* Background decorations */}
      <div style={LS.bgCircle1}/>
      <div style={LS.bgCircle2}/>
      <div style={LS.bgCircle3}/>

      <div style={LS.card}>
        {/* Logo / Brand */}
        <div style={LS.brand}>
          <div style={LS.logoRing}>
            <span style={{fontSize:28}}>🛒</span>
          </div>
          <div style={LS.brandText}>Retail Management Platform</div>
          <div style={LS.brandSub}>Retail Layout Designer</div>
        </div>

        <div style={LS.divider}/>

        {/* Fields */}
        <div style={LS.fields}>
          <div style={LS.fieldGroup}>
            <label style={LS.label}>Username</label>
            <div style={LS.inputWrap}>
              <span style={LS.inputIcon}>👤</span>
              <input
                style={LS.input}
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={e => { setUsername(e.target.value); setError(""); }}
                onKeyDown={handleKey}
                autoFocus
              />
            </div>
          </div>

          <div style={LS.fieldGroup}>
            <label style={LS.label}>Password</label>
            <div style={LS.inputWrap}>
              <span style={LS.inputIcon}>🔒</span>
              <input
                style={LS.input}
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                onKeyDown={handleKey}
              />
              <button style={LS.eyeBtn} onClick={() => setShowPass(p => !p)} tabIndex={-1}>
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {error && (
            <div style={LS.errorBox}>
              <span style={{fontSize:14}}>⚠️</span> {error}
            </div>
          )}

          <button style={{ ...LS.submitBtn, opacity: loading ? 0.8 : 1 }}
            onClick={handleSubmit} disabled={loading}>
            {loading
              ? <span style={LS.spinner}/>
              : <span>Sign In →</span>
            }
          </button>

          <button style={LS.forgotBtn}>Forgot password?</button>
        </div>
      </div>

      <div style={LS.footer}>© 2025 Retail Management Platform · Retail Layout Designer</div>
    </div>
  );
}

// ── UserMenu ───────────────────────────────────────────────────────────────────
function UserMenu({ username, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initial = username ? username[0].toUpperCase() : "?";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        title={username}
        style={{
          width: 36, height: 36, borderRadius: "50%",
          background: open ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.22)",
          border: "2px solid rgba(255,255,255,0.6)",
          color: open ? "#e65c00" : "#fff",
          fontWeight: 800, fontSize: 14, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.15s",
          boxShadow: open ? "0 2px 12px rgba(0,0,0,0.22)" : "none",
        }}>
        {initial}
      </button>

      {open && (
        <div style={{
          position: "absolute", top: 44, right: 0,
          background: "#fff", borderRadius: 12, width: 210,
          boxShadow: "0 12px 40px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.12)",
          border: "1px solid #f0e8dc", overflow: "hidden", zIndex: 500,
        }}>
          {/* User header */}
          <div style={{
            padding: "14px 16px", background: "linear-gradient(135deg,#fff3e0,#ffe0b2)",
            borderBottom: "1px solid #f0ddd0",
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "linear-gradient(135deg,#e65c00,#f9a825)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 800, fontSize: 16, marginBottom: 8,
              boxShadow: "0 2px 8px rgba(230,92,0,0.35)",
            }}>{initial}</div>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#3d2010" }}>{username}</div>
            <div style={{ fontSize: 11, color: "#a07050", marginTop: 1 }}>Retail Management Platform</div>
          </div>

          {/* Menu items */}
          <div style={{ padding: "6px 0" }}>
            <div style={UM.item}>
              <span style={UM.itemIcon}>👤</span>
              <span style={{ fontSize: 13, color: "#3d2010", fontWeight: 500 }}>{username}</span>
            </div>
            <div style={{ height: 1, background: "#f5ede5", margin: "4px 12px" }}/>
            <button style={UM.btn}>
              <span style={UM.itemIcon}>🔑</span>
              <span>Change Password</span>
            </button>
            <div style={{ height: 1, background: "#f5ede5", margin: "4px 12px" }}/>
            <button onClick={onLogout} style={{ ...UM.btn, color: "#c0392b" }}>
              <span style={UM.itemIcon}>🚪</span>
              <span style={{ fontWeight: 700 }}>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── App — auth gate ────────────────────────────────────────────────────────────
// ── 150 dummy products for Pricing & Campaigns ────────────────────────────────
// ── Assortment data ────────────────────────────────────────────────────────────
const ASS_ORGS      = ["EXERO","RETAIL CO","METRO GROUP","FRESH MART","GLOBAL TRADE","ALPHA DIST"];
const ASS_DISPLAYS  = ["Primary Shelf","End Cap","Promo Stand","Floor Display","Wall Unit","Chiller","Freezer"];
const ASS_BRANDS    = ["NaturePlus","GreenLeaf","OceanFresh","SunHarvest","PureFarm","AlphaFood","BetaBrand","ZenOrganic"];
const ASS_POS_TYPES = ["Physical","Digital","Hybrid","Kiosk"];
const ASS_STATUSES  = ["Active","Pending","Discontinued"];
const ASS_PROD_TYPES= ["Grains","Dairy","Dairy Alt","Oils","Sweeteners","Seeds","Snacks","Beverages","Frozen","Bakery","Produce","Meat","Seafood","Condiments","Pasta"];
const ASS_CAT_LEVELS= [["Food","Non-Food","Beverages","Health"],["Organic","Conventional","Premium","Value"],["Fresh","Ambient","Chilled","Frozen"],["Local","Imported","Private Label","National Brand"],["Standard","Specialty"]];

const ASS_POS_LIST = [
  {id:"pos-a1", name:"Downtown Flagship",    city:"New York, NY"},
  {id:"pos-a2", name:"Westfield Shopping",   city:"London, UK"},
  {id:"pos-a3", name:"Marina Bay Outlet",    city:"Singapore"},
  {id:"pos-a4", name:"Midtown Hypermarket",  city:"Chicago, IL"},
  {id:"pos-a5", name:"South Loop Store",     city:"Los Angeles, CA"},
  {id:"pos-a6", name:"Harbour City Branch",  city:"Hong Kong"},
  {id:"pos-a7", name:"Central Park Deli",    city:"New York, NY"},
  {id:"pos-a8", name:"Oxford Street",        city:"London, UK"},
  {id:"pos-a9", name:"Shibuya Crossing",     city:"Tokyo, JP"},
  {id:"pos-a10",name:"Rue de Rivoli Store",  city:"Paris, FR"},
];

const ORDER_STATUSES = ["AUTO","OUT","MANUAL"];
const PROD_EMOJIS = ["🌾","🥛","🍚","🌿","🫒","🍯","🫘","🥣","🍫","🥥","🧀","🥩","🐟","🫙","🍞","🥦","🥕","🍎","🍋","🧃","🫐","🥑","🌽","🫚","🧁","🥐","🧆","🫕","🥜","🌰"];

const ASS_SEASONS = ["ALL","ALL","ALL","Winter","Summer","Autumn","Spring","Winter","Summer","ALL"];
const ASS_REGIONS = [
  "South Italy","Sicily","North Italy","Central Italy","Sardinia",
  "Balkans","Scandinavia","Iberian Peninsula","British Isles","Benelux",
  "Central Europe","Eastern Europe","Western France","South France","Alpine Region",
  "Aegean","Adriatic Coast","Baltic States","Caucasus","Levant",
];

const ASS_PRODUCTS = Array.from({length:1000},(_,i)=>{
  const type    = ASS_PROD_TYPES[i % ASS_PROD_TYPES.length];
  const brand   = ASS_BRANDS[i % ASS_BRANDS.length];
  const ean     = String(1000000000000 + i * 7 + 13).slice(0,13);
  const sku     = `SKU-${String(i+1).padStart(5,"0")}`;
  const emoji   = PROD_EMOJIS[i % PROD_EMOJIS.length];
  const colors  = ["#d4a26a","#7bbfcc","#c8a84b","#3baa96","#6ab8c8","#e5a900","#9b6bd4","#d4614a","#5cb87a","#3aaed8"];
  const color   = colors[i % colors.length];
  const name    = `${brand} ${type} ${i < 10 ? "Premium" : i < 50 ? "Select" : i < 200 ? "Classic" : "Value"} #${i+1}`;
  const region  = ASS_REGIONS[(i * 7 + 3) % ASS_REGIONS.length];
  const season  = ASS_SEASONS[(i * 3 + 5) % ASS_SEASONS.length];
  const price   = "$" + (1.5 + (i * 0.43 + (i % 7) * 1.1) % 18).toFixed(2);
  const dims    = { w: 6  + (i * 3  + 7)  % 16, h: 8  + (i * 5  + 11) % 24, d: 4  + (i * 2  + 3)  % 12 };
  const minFacing = 1 + (i * 3 + 2) % 5;
  const maxFacing = minFacing + 1 + (i * 7 + 4) % 5;
  const packing   = (i * 11 + 3) % 10 < 6 ? "Single" : "Pack"; // ~60% Single, ~40% Pack
  // Each product belongs to a random subset of POSes (3–8 out of 10), deterministic
  const posIds = ASS_POS_LIST.map(pos => pos.id).filter((_, pi) => ((i * 7 + pi * 13 + 5) % 10) < 7);
  // Ensure at least 3 POSes per product
  const allPosIds = ASS_POS_LIST.map(p => p.id);
  if (posIds.length < 3) { for (const id of allPosIds) { if (!posIds.includes(id)) { posIds.push(id); if (posIds.length >= 3) break; } } }
  const posStatuses = {};
  ASS_POS_LIST.forEach((pos,pi) => {
    posStatuses[pos.id] = ORDER_STATUSES[(i + pi * 3) % ORDER_STATUSES.length];
  });
  return {id:`ap-${i+1}`, name, type, brand, ean, sku, emoji, color, region, season, price, dims, minFacing, maxFacing, packing, posIds, posStatuses};
});

// ── MultiSelect (standalone, outside Assortment) ──────────────────────────────
function AssortmentMultiSelect({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const toggle = (v) => onChange(value.includes(v) ? value.filter(x => x !== v) : [...value, v]);
  return (
    <div ref={ref} style={{ position:"relative" }}>
      <div onClick={() => setOpen(o => !o)} style={AS.msControl}>
        {value.length === 0
          ? <span style={{ color:"#aaa", fontSize:13 }}>Select...</span>
          : <span style={{ display:"flex", flexWrap:"wrap", gap:3 }}>
              {value.map(v => (
                <span key={v} style={{ background:"#1a3a5c", color:"#fff", borderRadius:4, padding:"1px 6px", fontSize:11, display:"flex", alignItems:"center", gap:3 }}>
                  {v}
                  <span onClick={e => { e.stopPropagation(); toggle(v); }} style={{ cursor:"pointer", opacity:0.7, fontSize:10 }}>✕</span>
                </span>
              ))}
            </span>
        }
        <span style={{ marginLeft:"auto", fontSize:10, opacity:0.5, flexShrink:0 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{ position:"absolute", top:"100%", left:0, right:0, background:"#fff", border:"1px solid #c8e0d4", borderRadius:"0 0 6px 6px", zIndex:200, maxHeight:180, overflowY:"auto", boxShadow:"0 8px 24px rgba(0,0,0,0.12)" }}>
          {options.map(o => (
            <div key={o} onClick={() => toggle(o)} style={{ padding:"7px 12px", cursor:"pointer", fontSize:13, display:"flex", alignItems:"center", gap:8, background: value.includes(o) ? "#f0fff8" : "transparent", color: value.includes(o) ? "#0d5c46" : "#333", fontWeight: value.includes(o) ? 700 : 400 }}>
              <span style={{ width:14, height:14, border:`2px solid ${value.includes(o) ? "#0d5c46" : "#ccc"}`, borderRadius:3, background: value.includes(o) ? "#0d5c46" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:"#fff", flexShrink:0 }}>{value.includes(o) ? "✓" : ""}</span>
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const ASS_PAGE_SIZE = 15;

// Inject SheetJS once
(function injectSheetJS() {
  if (typeof window === "undefined" || window.XLSX) return;
  const s = document.createElement("script");
  s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
  document.head.appendChild(s);
})();

function Assortment({ username, onLogout, onGoHome }) {
  const [submitted,    setSubmitted]    = useState(false);
  const [page,         setPage]         = useState(1);
  const [posFilter,    setPosFilter]    = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [products,     setProducts]     = useState(ASS_PRODUCTS);
  const [selectedProd, setSelectedProd] = useState(null);
  const [editMode,     setEditMode]     = useState(false);
  const [editDraft,    setEditDraft]    = useState(null);
  const [detailTab,    setDetailTab]    = useState("details");
  const [salesPeriod,  setSalesPeriod]  = useState("Quarterly");
  const menuRef = useRef(null);

  // Form state
  const [form, setForm] = useState({
    org:"", display:"", brand:"", typePos:[], orderStatus:"",
    supplierMgmt:"No", productType:"", cat1:"", cat2:"", cat3:"", cat4:"", cat5:"",
  });

  useEffect(()=>{
    const h=(e)=>{ if(menuRef.current&&!menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown",h);
    return ()=>document.removeEventListener("mousedown",h);
  },[]);

  const initial = username?username[0].toUpperCase():"?";

  // Filter products
  const filtered = !submitted ? [] : products.filter(p => {
    if (posFilter && !p.posIds.includes(posFilter)) return false;
    if (posFilter && statusFilter) return p.posStatuses[posFilter] === statusFilter;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ASS_PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageItems  = filtered.slice((safePage-1)*ASS_PAGE_SIZE, safePage*ASS_PAGE_SIZE);

  useEffect(()=>{ setPage(1); },[posFilter, statusFilter]);

  const exportToExcel = () => {
    if (!window.XLSX) { alert("Export library is still loading, please try again in a moment."); return; }
    const posName = posFilter
      ? (ASS_POS_LIST.find(p => p.id === posFilter)?.name || "AllPOS").replace(/\s+/g,"_")
      : "AllPOS";
    const rows = filtered.map(p => ({
      "Product Name":  p.name,
      "EAN":           p.ean,
      "SKU":           p.sku,
      "Type":          p.type,
      "Region":        p.region,
      "Season":        p.season,
      "Order Status":  posFilter ? p.posStatuses[posFilter] : "N/A",
    }));
    const ws = window.XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [{wch:36},{wch:16},{wch:14},{wch:14},{wch:22},{wch:12},{wch:14}];
    const range = window.XLSX.utils.decode_range(ws["!ref"]);
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cell = ws[window.XLSX.utils.encode_cell({r:0, c:C})];
      if (cell) cell.s = { font:{ bold:true } };
    }
    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, "Assortment");
    window.XLSX.writeFile(wb, `AssortmentState_${posName}.xlsx`);
  };

  const saveEdit = () => {
    setProducts(prev => prev.map(p => p.id === editDraft.id ? {...editDraft} : p));
    setSelectedProd({...editDraft});
    setEditMode(false);
  };

  const statusStyle = {
    AUTO:   { bg:"linear-gradient(135deg,#1a7a5e,#27ae60)", color:"#fff", icon:"⚡" },
    OUT:    { bg:"linear-gradient(135deg,#922b21,#c0392b)", color:"#fff", icon:"⛔" },
    MANUAL: { bg:"linear-gradient(135deg,#7a5c1e,#d4a017)", color:"#fff", icon:"✋" },
  };

  return (
    <div style={AS.root}>
      {/* Header */}
      <header style={AS.header}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button style={AS.backBtn} onClick={onGoHome}>⌂ Home</button>
          <span style={{fontSize:20}}>🗂️</span>
          <div style={{display:"flex",flexDirection:"column",gap:1}}>
            <span style={AS.title}>Retail Management Platform</span>
            <span style={AS.featureName}>Assortment</span>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {submitted && <span style={AS.statBadge}>📦 {filtered.length} products</span>}
          <div ref={menuRef} style={{position:"relative"}}>
            <button onClick={()=>setMenuOpen(o=>!o)} style={{width:36,height:36,borderRadius:"50%",background:menuOpen?"#fff":"rgba(255,255,255,0.22)",border:"2px solid rgba(255,255,255,0.6)",color:menuOpen?"#1a7a5e":"#fff",fontWeight:800,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              {initial}
            </button>
            {menuOpen&&(
              <div style={{position:"absolute",top:44,right:0,background:"#fff",borderRadius:12,width:210,boxShadow:"0 12px 40px rgba(0,0,0,0.22)",border:"1px solid #f0e8dc",overflow:"hidden",zIndex:500}}>
                <div style={{padding:"14px 16px",background:"linear-gradient(135deg,#d8f5ec,#f0fff8)",borderBottom:"1px solid #c8ead8"}}>
                  <div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,#0d5c46,#1a7a5e)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:16,marginBottom:8}}>{initial}</div>
                  <div style={{fontWeight:700,fontSize:13,color:"#0d3020"}}>{username}</div>
                  <div style={{fontSize:11,color:"#4a9070",marginTop:1}}>Retail Management Platform</div>
                </div>
                <div style={{padding:"6px 0"}}>
                  <button style={{display:"flex",alignItems:"center",gap:10,padding:"8px 16px",width:"100%",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,color:"#1a3a1a",fontWeight:600}}>
                    <span>🔑</span><span>Change Password</span>
                  </button>
                  <div style={{height:1,background:"#e5f5ec",margin:"4px 12px"}}/>
                  <button onClick={onLogout} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 16px",width:"100%",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,color:"#c0392b",fontWeight:700}}>
                    <span>🚪</span><span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column"}}>
        {/* Search form */}
        <div style={AS.formCard}>
          <div style={AS.formTitle}>Search Assortment</div>

          {/* Row 1 */}
          <div style={AS.formRow}>
            <div style={AS.fieldWrap}>
              <label style={AS.label}>Select Organization <span style={{color:"#c0392b"}}>*</span></label>
              <select style={AS.input} value={form.org} onChange={e=>setForm(f=>({...f,org:e.target.value}))}>
                <option value="">Select an Organization</option>
                {ASS_ORGS.map(o=><option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div style={AS.fieldWrap}>
              <label style={AS.label}>Display <span style={{color:"#c0392b"}}>*</span></label>
              <select style={AS.input} value={form.display} onChange={e=>setForm(f=>({...f,display:e.target.value}))}>
                <option value="">Select a Display</option>
                {ASS_DISPLAYS.map(d=><option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div style={AS.fieldWrap}>
              <label style={AS.label}>Brand</label>
              <select style={AS.input} value={form.brand} onChange={e=>setForm(f=>({...f,brand:e.target.value}))}>
                <option value="">Select a Brand</option>
                {ASS_BRANDS.map(b=><option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div style={AS.fieldWrap}>
              <label style={AS.label}>Type POS</label>
              <AssortmentMultiSelect options={ASS_POS_TYPES} value={form.typePos} onChange={v=>setForm(f=>({...f,typePos:v}))}/>
            </div>
            <div style={AS.fieldWrap}>
              <label style={AS.label}>Order Status Products</label>
              <select style={AS.input} value={form.orderStatus} onChange={e=>setForm(f=>({...f,orderStatus:e.target.value}))}>
                <option value="">Select a Status</option>
                {ASS_STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div style={AS.formRow}>
            <div style={AS.fieldWrap}>
              <label style={AS.label}>Enable Supplier Management</label>
              <select style={AS.input} value={form.supplierMgmt} onChange={e=>setForm(f=>({...f,supplierMgmt:e.target.value}))}>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            <div style={AS.fieldWrap}>
              <label style={AS.label}>Product Type</label>
              <select style={AS.input} value={form.productType} onChange={e=>setForm(f=>({...f,productType:e.target.value}))}>
                <option value="">Select a Product Type</option>
                {ASS_PROD_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {[1,2,3,4,5].map(lvl=>(
              <div key={lvl} style={AS.fieldWrap}>
                <label style={AS.label}>Category Tree Level {lvl}</label>
                <select style={AS.input} value={form[`cat${lvl}`]} onChange={e=>setForm(f=>({...f,[`cat${lvl}`]:e.target.value}))}>
                  <option value="">Select a TreeLevel</option>
                  {ASS_CAT_LEVELS[lvl-1].map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{display:"flex",gap:12,alignItems:"center",marginTop:4}}>
            <button
              onClick={()=>{ if(!form.org){alert("Organization is required");return;} setSubmitted(true); setPage(1); setPosFilter(""); setStatusFilter(""); }}
              style={AS.btnSearch}>
              🔍 Search
            </button>
            <button
              onClick={()=>{ setForm({org:"",display:"",brand:"",typePos:[],orderStatus:"",supplierMgmt:"No",productType:"",cat1:"",cat2:"",cat3:"",cat4:"",cat5:""}); setSubmitted(false); }}
              style={AS.btnExport}>
              ✕ Reset
            </button>
            {submitted && (
              <button style={{...AS.btnExport, background:"linear-gradient(135deg,#0d5c46,#1a7a5e)", color:"#fff", borderColor:"#0d5c46"}}>
                📁 Export Files Folder
              </button>
            )}
            <span style={{fontSize:11,color:"#999",fontStyle:"italic"}}>* The asterisk (*) indicates required fields</span>
          </div>
        </div>

        {/* Results */}
        {submitted && (
          <div style={{flex:1,display:"flex",flexDirection:"column",padding:"0 24px 20px"}}>
            {/* POS filter bar */}
            <div style={AS.filterBar}>
              <span style={{fontSize:13,fontWeight:700,color:"#0d5c46",whiteSpace:"nowrap"}}>📍 Filter by Point of Sale</span>
              <select style={{...AS.input,maxWidth:280,margin:0}} value={posFilter} onChange={e=>{ setPosFilter(e.target.value); setStatusFilter(""); }}>
                <option value="">All Points of Sale</option>
                {ASS_POS_LIST.map(p=><option key={p.id} value={p.id}>{p.name} — {p.city}</option>)}
              </select>
              {posFilter && (
                <>
                  <span style={{fontSize:13,fontWeight:700,color:"#0d5c46",whiteSpace:"nowrap"}}>⚡ Order Status</span>
                  <div style={{display:"flex",gap:6}}>
                    {["","AUTO","OUT","MANUAL"].map(s=>(
                      <button key={s||"all"} onClick={()=>setStatusFilter(s)}
                        style={{padding:"5px 12px",borderRadius:7,border:"1.5px solid",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",
                          background:statusFilter===s?(s==="AUTO"?"#27ae60":s==="OUT"?"#c0392b":s==="MANUAL"?"#d4a017":"#0d5c46"):"#fff",
                          color:statusFilter===s?"#fff":(s==="AUTO"?"#27ae60":s==="OUT"?"#c0392b":s==="MANUAL"?"#d4a017":"#555"),
                          borderColor:statusFilter===s?"transparent":(s==="AUTO"?"#27ae60":s==="OUT"?"#c0392b":s==="MANUAL"?"#d4a017":"#ddd"),
                        }}>
                        {s||"All"}{s===""?` (${products.filter(p=>p.posIds.includes(posFilter)).length})`:s==="AUTO"?` (${products.filter(p=>p.posIds.includes(posFilter)&&p.posStatuses[posFilter]==="AUTO").length})`:s==="OUT"?` (${products.filter(p=>p.posIds.includes(posFilter)&&p.posStatuses[posFilter]==="OUT").length})`:` (${products.filter(p=>p.posIds.includes(posFilter)&&p.posStatuses[posFilter]==="MANUAL").length})`}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <span style={{marginLeft:"auto",fontSize:12,color:"#777"}}>Showing {pageItems.length} of {filtered.length}</span>
              <button onClick={exportToExcel} style={AS.exportBtn}>
                📥 Export Excel
              </button>
            </div>

            {/* Product list — one compact table row per product */}
            <div style={AS.tableWrap}>
              <div style={AS.productTable} role="table" aria-label="Product catalogue">
                <div style={AS.tableHead} role="row">
                  <span>Product</span><span>EAN</span><span>SKU</span><span>Type</span>
                  <span>Region</span><span>Season</span><span>Price</span><span>Dimensions</span>{posFilter && <span>Status</span>}
                </div>
                {pageItems.map(p=>{
                  const orderSt = posFilter ? p.posStatuses[posFilter] : null;
                  const st = orderSt ? statusStyle[orderSt] : null;
                  return <button key={p.id} type="button" role="row" style={AS.tableRow}
                    onClick={() => { setSelectedProd(p); setEditMode(false); setEditDraft(null); setDetailTab("details"); }}>
                    <span style={AS.productName} role="cell"><span style={{fontSize:18}}>{p.emoji}</span><span>{p.name}</span></span>
                    <span style={AS.monoCell} role="cell">{p.ean}</span>
                    <span style={AS.monoCell} role="cell">{p.sku}</span>
                    <span style={AS.typeCell} role="cell">{p.type} · {p.packing}</span>
                    <span style={AS.regionCell} role="cell">{p.region}</span>
                    <span style={AS.seasonCell} role="cell">{p.season}</span>
                    <span style={AS.priceCell} role="cell">{p.price}</span>
                    <span style={AS.monoCell} role="cell">{p.dims.w}×{p.dims.h}×{p.dims.d}</span>
                    {posFilter && <span role="cell" style={{...AS.statusCell,background:st.bg,color:st.color}}>{st.icon} {orderSt}</span>}
                  </button>;
                })}
              </div>
            </div>

            {/* Pagination */}
            <div style={AS.pagination}>
              <button style={{...AS.pageBtn,opacity:safePage===1?0.4:1}} disabled={safePage===1} onClick={()=>setPage(1)}>«</button>
              <button style={{...AS.pageBtn,opacity:safePage===1?0.4:1}} disabled={safePage===1} onClick={()=>setPage(p=>Math.max(1,p-1))}>‹</button>
              {Array.from({length:totalPages},(_,i)=>i+1)
                .filter(n=>n===1||n===totalPages||Math.abs(n-safePage)<=2)
                .reduce((acc,n,idx,arr)=>{ if(idx>0&&n-arr[idx-1]>1)acc.push("…"); acc.push(n); return acc; },[])
                .map((item,i)=> item==="…"
                  ? <span key={`e${i}`} style={{padding:"0 4px",color:"#999",fontSize:13}}>…</span>
                  : <button key={item} style={{...AS.pageBtn,background:item===safePage?"linear-gradient(135deg,#0d5c46,#1a7a5e)":"#fff",color:item===safePage?"#fff":"#333",border:item===safePage?"none":"1.5px solid #e0e0e0",fontWeight:item===safePage?800:500}} onClick={()=>setPage(item)}>{item}</button>
                )
              }
              <button style={{...AS.pageBtn,opacity:safePage===totalPages?0.4:1}} disabled={safePage===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>›</button>
              <button style={{...AS.pageBtn,opacity:safePage===totalPages?0.4:1}} disabled={safePage===totalPages} onClick={()=>setPage(totalPages)}>»</button>
              <span style={{fontSize:12,color:"#888",marginLeft:8}}>Page {safePage} of {totalPages}</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Product detail / edit popup ── */}
      {selectedProd && (() => {
        const d = editMode ? editDraft : selectedProd;
        const orderSt = posFilter ? selectedProd.posStatuses[posFilter] : null;
        const stStyle = { AUTO:{bg:"#e6fff2",color:"#1a7a3a",border:"#a8e8cc"}, OUT:{bg:"#fff0f0",color:"#c0392b",border:"#f5c0c0"}, MANUAL:{bg:"#fffbe6",color:"#a84800",border:"#ffd87a"} };
        const seasonEmoji = {Winter:"❄️",Summer:"☀️",Autumn:"🍂",Spring:"🌸",ALL:"🌐"};

        const Field = ({label, value, field, type="text", options=null, locked=false}) => (
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            <label style={{fontSize:11,fontWeight:700,color:"#5a7a6a",textTransform:"uppercase",letterSpacing:"0.4px"}}>{label}{locked&&<span style={{marginLeft:6,fontSize:9,background:"#e8e8e8",color:"#999",borderRadius:3,padding:"1px 4px"}}>locked</span>}</label>
            {editMode && !locked
              ? options
                ? <select value={value} onChange={e=>setEditDraft(prev=>({...prev,[field]:e.target.value}))}
                    style={{padding:"7px 10px",border:"1.5px solid #a8d8c0",borderRadius:7,fontSize:13,fontFamily:"inherit",background:"#f8fffc",color:"#0d3020",outline:"none"}}>
                    {options.map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                : <input type={type} value={value}
                    onChange={e=>setEditDraft(prev=>({...prev,[field]:e.target.value}))}
                    style={{padding:"7px 10px",border:"1.5px solid #a8d8c0",borderRadius:7,fontSize:13,fontFamily:"inherit",background:"#f8fffc",color:"#0d3020",outline:"none"}}/>
              : <div style={{padding:"7px 10px",background:locked?"#f5f5f5":"#f8fffc",border:`1.5px solid ${locked?"#e8e8e8":"#d8ede5"}`,borderRadius:7,fontSize:13,color:locked?"#999":"#0d3020",fontFamily:locked?"monospace":"inherit"}}>{value}</div>
            }
          </div>
        );

        return (
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:900,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}
            onClick={e=>{ if(e.target===e.currentTarget){ setSelectedProd(null); setEditMode(false); setEditDraft(null); } }}>
            <div style={{background:"#fff",borderRadius:20,width:"100%",maxWidth:820,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 80px rgba(0,0,0,0.3)",display:"flex",flexDirection:"column"}}>

              {/* Popup header */}
              <div style={{background:`linear-gradient(135deg,${selectedProd.color}22,${selectedProd.color}44)`,padding:"20px 24px 16px",borderRadius:"20px 20px 0 0",borderBottom:"1px solid #e8ede8",display:"flex",alignItems:"center",gap:14,flexShrink:0}}>
                <div style={{width:64,height:64,borderRadius:14,background:`linear-gradient(135deg,${selectedProd.color}33,${selectedProd.color}66)`,border:`2px solid ${selectedProd.color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,flexShrink:0}}>{selectedProd.emoji}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:800,fontSize:16,color:"#0d3020",lineHeight:1.3}}>{editMode ? editDraft.name : selectedProd.name}</div>
                  <div style={{fontSize:12,color:"#5a7a6a",marginTop:3}}>{selectedProd.brand} · {selectedProd.sku}</div>
                </div>
                <div style={{display:"flex",gap:8,flexShrink:0}}>
                  {!editMode
                    ? <button onClick={()=>{ setEditMode(true); setEditDraft({...selectedProd}); }}
                        style={{background:"linear-gradient(135deg,#0d5c46,#1a7a5e)",color:"#fff",border:"none",borderRadius:8,padding:"7px 16px",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
                        ✏️ Edit
                      </button>
                    : <>
                        <button onClick={saveEdit}
                          style={{background:"linear-gradient(135deg,#0d5c46,#1a7a5e)",color:"#fff",border:"none",borderRadius:8,padding:"7px 16px",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
                          💾 Save
                        </button>
                        <button onClick={()=>{ setEditMode(false); setEditDraft(null); }}
                          style={{background:"#fff",color:"#666",border:"1.5px solid #ddd",borderRadius:8,padding:"7px 14px",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
                          Cancel
                        </button>
                      </>
                  }
                  <button onClick={()=>{ setSelectedProd(null); setEditMode(false); setEditDraft(null); }}
                    style={{background:"rgba(0,0,0,0.06)",color:"#666",border:"none",borderRadius:8,padding:"7px 12px",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>
                    ✕
                  </button>
                </div>
              </div>

              <div style={{display:"flex",gap:4,padding:"0 24px",borderBottom:"1px solid #e4eee9",flexShrink:0}}>
                {[{id:"details",label:"▦ Product details"},{id:"sales",label:"▥ Sales data"},{id:"planograms",label:"▤ Planograms"}].map(tab=>(
                  <button key={tab.id} type="button" onClick={()=>{setDetailTab(tab.id);setEditMode(false);}}
                    style={{background:"none",border:"none",borderBottom:detailTab===tab.id?"3px solid #39b5d3":"3px solid transparent",padding:"14px 16px 12px",color:detailTab===tab.id?"#0d5c46":"#789388",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Product details */}
              {detailTab === "details" && <div style={{padding:"20px 24px",display:"flex",flexDirection:"column",gap:14}}>
                <Field label="Product Name" value={d.name}   field="name" />
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                  <Field label="EAN"  value={d.ean}  field="ean"  locked />
                  <Field label="SKU"  value={d.sku}  field="sku"  locked />
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
                  <Field label="Type"    value={d.type}    field="type"    options={ASS_PROD_TYPES} />
                  <Field label="Packing" value={d.packing} field="packing" options={["Single","Pack"]} />
                  <Field label="Brand"   value={d.brand}   field="brand"   options={ASS_BRANDS} />
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                  <Field label="Region" value={d.region} field="region" options={ASS_REGIONS} />
                  <Field label="Season" value={d.season} field="season" options={["ALL","Winter","Summer","Autumn","Spring"]} />
                </div>
                <Field label="Price" value={d.price} field="price" />

                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  <label style={{fontSize:11,fontWeight:700,color:"#5a7a6a",textTransform:"uppercase",letterSpacing:"0.4px"}}>Dimensions (W × H × D cm)</label>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                    {["w","h","d"].map(axis=>(
                      <div key={axis} style={{display:"flex",flexDirection:"column",gap:3}}>
                        <span style={{fontSize:10,color:"#8aaa9a",fontWeight:700,textTransform:"uppercase"}}>{axis==="w"?"Width":axis==="h"?"Height":"Depth"}</span>
                        {editMode
                          ? <input type="number" min="1" max="99" value={d.dims[axis]}
                              onChange={e=>setEditDraft(prev=>({...prev,dims:{...prev.dims,[axis]:+e.target.value}}))}
                              style={{padding:"6px 8px",border:"1.5px solid #a8d8c0",borderRadius:7,fontSize:13,fontFamily:"inherit",background:"#f8fffc",color:"#0d3020",outline:"none",width:"100%",boxSizing:"border-box"}}/>
                          : <div style={{padding:"6px 8px",background:"#f5f5f5",border:"1.5px solid #e0e0e0",borderRadius:7,fontSize:13,color:"#333",fontFamily:"monospace"}}>{d.dims[axis]}</div>
                        }
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                  {[{label:"Min Facing Qty",field:"minFacing"},{label:"Max Facing Qty",field:"maxFacing"}].map(({label,field})=>(
                    <div key={field} style={{display:"flex",flexDirection:"column",gap:4}}>
                      <label style={{fontSize:11,fontWeight:700,color:"#5a7a6a",textTransform:"uppercase",letterSpacing:"0.4px"}}>{label}</label>
                      {editMode
                        ? <input type="number" min="1" max="10" value={d[field]}
                            onChange={e=>{
                              const val = Math.max(1, Math.min(10, +e.target.value));
                              setEditDraft(prev=>{
                                const next = {...prev, [field]: val};
                                // keep min <= max invariant
                                if (field==="minFacing" && val > next.maxFacing) next.maxFacing = val;
                                if (field==="maxFacing" && val < next.minFacing) next.minFacing = val;
                                return next;
                              });
                            }}
                            style={{padding:"7px 10px",border:"1.5px solid #a8d8c0",borderRadius:7,fontSize:13,fontFamily:"inherit",background:"#f8fffc",color:"#0d3020",outline:"none",width:"100%",boxSizing:"border-box"}}/>
                        : <div style={{padding:"7px 10px",background:"#f8fffc",border:"1.5px solid #d8ede5",borderRadius:7,fontSize:13,color:"#0d3020",fontWeight:700}}>{d[field]}</div>
                      }
                    </div>
                  ))}
                </div>

                {/* Order status per POS */}
                {orderSt && (
                  <div style={{display:"flex",flexDirection:"column",gap:4}}>
                    <label style={{fontSize:11,fontWeight:700,color:"#5a7a6a",textTransform:"uppercase",letterSpacing:"0.4px"}}>Order Status ({ASS_POS_LIST.find(p=>p.id===posFilter)?.name})</label>
                    <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"7px 12px",borderRadius:7,background:stStyle[orderSt]?.bg,border:`1.5px solid ${stStyle[orderSt]?.border}`,color:stStyle[orderSt]?.color,fontWeight:800,fontSize:13,alignSelf:"flex-start"}}>
                      {orderSt==="AUTO"?"⚡":orderSt==="OUT"?"⛔":"✋"} {orderSt}
                    </div>
                  </div>
                )}
              </div>}

              {detailTab === "sales" && (() => {
                const seed = Number((selectedProd.id.match(/\d+$/) || ["1"])[0]);
                const labels = salesPeriod === "Weekly" ? ["W1","W2","W3","W4","W5","W6"] : salesPeriod === "Monthly" ? ["Jan","Feb","Mar","Apr","May","Jun"] : ["Q1 '24","Q2 '24","Q3 '24","Q4 '24","Q1 '25","Q2 '25"];
                const stock = labels.map((_, i) => 65 + ((seed * 11 + i * 17) % 30));
                const sellout = labels.map((_, i) => 22 + ((seed * 7 + i * 13) % 42));
                const total = sellout.reduce((sum, value) => sum + value * 13, 0);
                return <div style={{padding:"26px 36px 30px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",gap:18,alignItems:"start",marginBottom:22}}>
                    <div><div style={{fontSize:20,fontWeight:800,color:"#0d3020"}}>Stock vs. sellout</div><div style={{color:"#789388",marginTop:4}}>Units across the selected reporting period</div></div>
                    <div style={{display:"flex",padding:4,border:"1px solid #d8ede5",borderRadius:12,background:"#f2faf6"}}>{["Weekly","Monthly","Quarterly"].map(period=><button key={period} type="button" onClick={()=>setSalesPeriod(period)} style={{border:"none",borderRadius:8,padding:"8px 12px",background:salesPeriod===period?"#0d6a52":"transparent",color:salesPeriod===period?"#fff":"#53766a",fontWeight:800,fontFamily:"inherit",cursor:"pointer"}}>{period}</button>)}</div>
                  </div>
                  <div style={{background:"#fff8e8",border:"1px solid #f2dc9c",borderRadius:14,padding:"18px 20px",marginBottom:28}}><div style={{fontSize:11,fontWeight:800,color:"#93660f"}}>SELLOUT · SELECTED PERIOD</div><div style={{fontSize:30,fontWeight:800,color:"#a66b05",marginTop:6}}>{total.toLocaleString()} <span style={{fontSize:15}}>units</span></div></div>
                  <div style={{height:310,display:"flex",alignItems:"end",gap:18,padding:"24px 20px 18px",border:"1px solid #dcebe4",borderRadius:16,background:"linear-gradient(#fff,#f7fcf9)"}}>
                    {labels.map((label,i)=><div key={label} style={{height:"100%",flex:1,display:"flex",alignItems:"end",justifyContent:"center",gap:6,position:"relative",paddingBottom:28,borderBottom:"1px solid #b9d8ca"}}><div title={`Stock: ${stock[i]} units`} style={{width:"34%",height:`${stock[i]}%`,minHeight:20,borderRadius:"6px 6px 0 0",background:"linear-gradient(#1fa77c,#087056)"}}/><div title={`Sellout: ${sellout[i]} units`} style={{width:"34%",height:`${sellout[i]}%`,minHeight:14,borderRadius:"6px 6px 0 0",background:"linear-gradient(#ffcb45,#df8b04)"}}/><span style={{position:"absolute",bottom:0,fontSize:10,fontWeight:800,color:"#68877a",whiteSpace:"nowrap"}}>{label}</span></div>)}
                  </div>
                  <div style={{display:"flex",justifyContent:"center",gap:22,marginTop:12,fontSize:11,fontWeight:700,color:"#59766a"}}><span>🟩 Stock</span><span>🟨 Sellout</span></div>
                </div>;
              })()}

              {detailTab === "planograms" && (() => {
                const plans = [
                  ["Fresh Range · Main Aisle","Downtown Flagship — New York",2], ["Core Selection · Shelf 02","Westfield Shopping — London",3], ["Seasonal Feature · End Cap","Marina Bay Outlet — Singapore",5], ["Promo Review · Front Display","Midtown Hypermarket — Chicago",3],
                ];
                const total = plans.reduce((sum, plan) => sum + plan[2], 0);
                return <div style={{padding:"26px 36px 30px"}}>
                  <div style={{fontSize:20,fontWeight:800,color:"#0d3020"}}>Planogram presence</div><div style={{color:"#789388",marginTop:6}}>This product appears in {plans.length} active planograms.</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,margin:"24px 0 20px"}}><div style={{padding:"18px",border:"1px solid #cfe7dc",borderRadius:14,background:"#f3fbf7"}}><div style={{fontSize:11,fontWeight:800,color:"#508171"}}>PLANOGRAMS</div><div style={{fontSize:30,fontWeight:800,color:"#087056",marginTop:7}}>{plans.length}</div></div><div style={{padding:"18px",border:"1px solid #e0d3f2",borderRadius:14,background:"#f8f4ff"}}><div style={{fontSize:11,fontWeight:800,color:"#75549b"}}>TOTAL PLACEMENTS</div><div style={{fontSize:30,fontWeight:800,color:"#674197",marginTop:7}}>{total}</div></div></div>
                  <div style={{display:"flex",flexDirection:"column",gap:12}}>{plans.map(([name, location, count])=><div key={name} style={{display:"flex",alignItems:"center",gap:16,padding:"16px 18px",border:"1px solid #dcebe4",borderRadius:14}}><div style={{width:42,height:42,borderRadius:10,display:"grid",placeItems:"center",background:"#dff4eb",fontSize:19}}>▤</div><div style={{flex:1,minWidth:0}}><div style={{fontSize:15,fontWeight:800,color:"#163d2d"}}>{name}</div><div style={{fontSize:13,color:"#759287",marginTop:4}}>📍 {location}</div></div><div style={{textAlign:"right",color:"#087056",fontWeight:800,fontSize:22}}>{count}×<div style={{fontSize:10,color:"#648a7b",marginTop:2}}>IN PLANOGRAM</div></div></div>)}</div>
                </div>;
              })()}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ── Assortment styles ──────────────────────────────────────────────────────────
const AS = {
  root:       {fontFamily:"'DM Sans','Segoe UI',sans-serif",height:"100vh",display:"flex",flexDirection:"column",background:"#f4faf7",overflow:"hidden"},
  header:     {background:"linear-gradient(135deg,#0d5c46 0%,#1a7a5e 100%)",padding:"0 24px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 3px 14px rgba(13,92,70,0.38)",flexShrink:0},
  backBtn:    {background:"rgba(255,255,255,0.18)",color:"#fff",border:"1.5px solid rgba(255,255,255,0.45)",borderRadius:8,padding:"6px 14px",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"},
  title:      {color:"#fff",fontWeight:800,fontSize:18,letterSpacing:"-0.5px",lineHeight:1.1},
  featureName:{color:"rgba(255,255,255,0.75)",fontWeight:600,fontSize:11,letterSpacing:"0.2px"},
  statBadge:  {background:"rgba(255,255,255,0.18)",color:"#fff",borderRadius:8,padding:"5px 12px",fontSize:12,fontWeight:600,border:"1px solid rgba(255,255,255,0.25)"},
  formCard:   {background:"#fff",borderBottom:"1px solid #d8ede5",padding:"20px 24px 16px",flexShrink:0},
  formTitle:  {fontWeight:800,fontSize:15,color:"#0d5c46",marginBottom:14,letterSpacing:"-0.3px"},
  formRow:    {display:"flex",flexWrap:"wrap",gap:12,marginBottom:12},
  fieldWrap:  {display:"flex",flexDirection:"column",gap:4,minWidth:140,flex:"1 1 140px"},
  label:      {fontSize:11,fontWeight:700,color:"#fff",background:"#1a3a2a",padding:"4px 8px",borderRadius:"5px 5px 0 0",letterSpacing:"0.2px"},
  input:      {padding:"7px 10px",border:"1.5px solid #c8e0d4",borderRadius:"0 0 6px 6px",fontSize:13,fontFamily:"inherit",background:"#fff",color:"#1a3a2a",outline:"none",cursor:"pointer",minHeight:34,boxSizing:"border-box",width:"100%"},
  msControl:  {padding:"7px 10px",border:"1.5px solid #c8e0d4",borderRadius:"0 0 6px 6px",fontSize:13,fontFamily:"inherit",background:"#fff",color:"#1a3a2a",cursor:"pointer",minHeight:34,boxSizing:"border-box",width:"100%",display:"flex",alignItems:"center",flexWrap:"wrap",gap:4},
  btnSearch:  {background:"linear-gradient(135deg,#1a3a2a,#0d5c46)",color:"#fff",border:"none",borderRadius:8,padding:"9px 22px",fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:6,boxShadow:"0 3px 12px rgba(13,92,70,0.35)"},
  btnExport:  {background:"#fff",color:"#333",border:"1.5px solid #ccc",borderRadius:8,padding:"9px 18px",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"},
  filterBar:  {display:"flex",alignItems:"center",gap:12,padding:"12px 0",flexWrap:"wrap"},
  exportBtn:  {background:"linear-gradient(135deg,#0d5c46,#1a7a5e)",color:"#fff",border:"none",borderRadius:8,padding:"7px 16px",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:6,boxShadow:"0 2px 10px rgba(13,92,70,0.3)",whiteSpace:"nowrap",flexShrink:0},
  tableWrap:   {flex:1,overflow:"auto",border:"1px solid #d8ede5",borderRadius:10,background:"#fff"},
  productTable:{minWidth:1050},
  tableHead:   {display:"grid",gridTemplateColumns:"minmax(210px,1.7fr) 125px 95px 120px minmax(115px,1fr) 72px 65px 90px 85px",gap:10,alignItems:"center",padding:"10px 14px",background:"#eaf7f1",borderBottom:"1px solid #c8e0d4",color:"#4a8069",fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.4px",position:"sticky",top:0,zIndex:2},
  tableRow:    {display:"grid",gridTemplateColumns:"minmax(210px,1.7fr) 125px 95px 120px minmax(115px,1fr) 72px 65px 90px 85px",gap:10,alignItems:"center",width:"100%",minHeight:52,padding:"8px 14px",background:"#fff",border:"none",borderBottom:"1px solid #edf5f1",color:"#173b2c",fontFamily:"inherit",textAlign:"left",cursor:"pointer",transition:"background 0.12s"},
  productName: {display:"flex",alignItems:"center",gap:9,minWidth:0,fontSize:12,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},
  monoCell:    {fontFamily:"monospace",fontSize:10,color:"#53675f",whiteSpace:"nowrap"},
  typeCell:    {fontSize:11,color:"#187055",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},
  regionCell:  {fontSize:11,color:"#68449a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},
  seasonCell:  {fontSize:11,fontWeight:700,color:"#8a6225",whiteSpace:"nowrap"},
  priceCell:   {fontSize:12,fontWeight:800,color:"#16713d",whiteSpace:"nowrap",textAlign:"right"},
  statusCell:  {justifySelf:"start",borderRadius:5,padding:"3px 6px",fontSize:10,fontWeight:800,whiteSpace:"nowrap"},
  pagination: {display:"flex",alignItems:"center",justifyContent:"center",gap:4,padding:"12px 0 4px",flexWrap:"wrap"},
  pageBtn:    {minWidth:32,height:32,borderRadius:7,border:"1.5px solid #d8ede5",background:"#fff",color:"#333",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",padding:"0 8px",transition:"all 0.1s"},
};


const PC_TYPES = ["Grains","Dairy","Dairy Alt","Oils","Sweeteners","Seeds","Snacks","Beverages","Frozen","Bakery","Produce","Meat","Seafood","Condiments","Pasta"];
const PC_SEASONS = ["ALL","ALL","ALL","Winter","Summer"];
const PC_NAMES = [
  "Organic Oats","Almond Milk","Brown Rice","Quinoa","Olive Oil","Raw Honey","Chia Seeds",
  "Greek Yogurt","Granola Bar","Coconut Water","Whole Wheat Bread","Cheddar Cheese","Butter",
  "Sunflower Oil","Maple Syrup","Flax Seeds","Protein Bar","Green Tea","Sourdough Loaf",
  "Mozzarella","Avocado Oil","Agave Nectar","Hemp Seeds","Dark Chocolate","Sparkling Water",
  "Rye Bread","Feta Cheese","Ghee","Sesame Oil","Stevia Drops","Pumpkin Seeds","Rice Cake",
  "Herbal Tea","Ciabatta","Gouda Cheese","Coconut Oil","Date Syrup","Sunflower Seeds","Oat Bar",
  "Kombucha","Multigrain Bread","Brie Cheese","Walnut Oil","Molasses","Poppy Seeds","Nut Mix",
  "Chai Latte","Focaccia","Cream Cheese","Grapeseed Oil","Coconut Sugar","Sesame Seeds","Trail Mix",
  "Ginger Beer","Spelt Bread","Camembert","Truffle Oil","Cane Sugar","Peanuts","Veggie Chips",
  "Oat Milk","Raisin Bread","Swiss Cheese","Hazelnut Oil","Erythritol","Pistachios","Popcorn",
  "Cold Brew","Brioche","Ricotta","Flaxseed Oil","Xylitol","Walnuts","Seaweed Snack",
  "Soy Milk","Bagel","Provolone","MCT Oil","Coconut Flakes","Almonds","Kale Chips",
  "Rice Milk","English Muffin","Cottage Cheese","Peanut Butter Oil","Brown Sugar","Cashews","Beetroot Chips",
  "Hemp Milk","Pretzel","Quark","Argan Oil","Palm Sugar","Macadamia Nuts","Lentil Crisps",
  "Cashew Milk","Croissant","Skyr","Pecan Oil","Muscovado Sugar","Brazil Nuts","Sweet Potato Chips",
  "Pea Milk","Pain au Chocolat","Labneh","Avocado Spread","Treacle","Hazelnuts","Plantain Chips",
  "Oat Yogurt","Cinnamon Roll","Halloumi","Tahini","Barley Sugar","Pine Nuts","Puffed Quinoa",
  "Soy Yogurt","Muffin","Paneer","Almond Butter","Coconut Nectar","Sunflower Kernels","Buckwheat Puffs",
  "Coconut Yogurt","Scone","Tofu","Cashew Butter","Honey Powder","Pecan Pieces","Millet Puffs",
  "Almond Yogurt","Waffle","Tempeh","Hazelnut Butter","Dextrose","Mixed Nuts","Spelt Puffs",
  "Sheep Yogurt","Doughnut","Seitan","Pumpkin Butter","Inulin Powder","Pistachio Kernels","Corn Puffs",
];
const PRICING_PRODUCTS = Array.from({length:150},(_,i)=>{
  const name    = PC_NAMES[i % PC_NAMES.length] + (i >= PC_NAMES.length ? ` ${Math.floor(i/PC_NAMES.length)+1}` : "");
  const type    = PC_TYPES[i % PC_TYPES.length];
  const base    = 1.5 + (i * 0.37) % 14;
  const price   = "$" + base.toFixed(2);
  const season  = PC_SEASONS[i % PC_SEASONS.length];
  const campaign= i % 3 === 0;
  const dims    = { w: 6  + (i * 4  + 5)  % 16, h: 8  + (i * 7  + 9)  % 24, d: 4  + (i * 3  + 2)  % 12 };
  return {id:`pc-${i+1}`, name, type, price, season, campaign, dims};
});

const PC_PAGE_SIZE = 15;

function PricingCampaigns({ username, onLogout, onGoHome }) {
  const [page,    setPage]    = useState(1);
  const [search,  setSearch]  = useState("");
  const [filterSeason,  setFilterSeason]  = useState("ALL");
  const [filterCampaign,setFilterCampaign]= useState("ALL");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(()=>{
    const h=(e)=>{if(menuRef.current&&!menuRef.current.contains(e.target))setMenuOpen(false);};
    document.addEventListener("mousedown",h);
    return ()=>document.removeEventListener("mousedown",h);
  },[]);

  const initial = username?username[0].toUpperCase():"?";

  // Filter
  const filtered = PRICING_PRODUCTS.filter(p => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.type.toLowerCase().includes(q);
    const matchSeason = filterSeason === "ALL" || p.season === filterSeason;
    const matchCampaign = filterCampaign === "ALL"
      || (filterCampaign === "YES" && p.campaign)
      || (filterCampaign === "NO"  && !p.campaign);
    return matchSearch && matchSeason && matchCampaign;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PC_PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageItems  = filtered.slice((safePage-1)*PC_PAGE_SIZE, safePage*PC_PAGE_SIZE);

  // Reset to page 1 on filter change
  useEffect(()=>{ setPage(1); },[search, filterSeason, filterCampaign]);

  const seasonColor = { ALL:"#2d6a9f", Winter:"#4a90d9", Summer:"#e6950a" };
  const seasonBg    = { ALL:"#e8f0ff", Winter:"#e8f4ff", Summer:"#fff8e8" };

  return (
    <div style={PC.root}>
      {/* Header */}
      <header style={PC.header}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button style={PC.backBtn} onClick={onGoHome}>⌂ Home</button>
          <span style={{fontSize:20}}>🏷️</span>
          <div style={{display:"flex",flexDirection:"column",gap:1}}>
            <span style={PC.title}>Retail Management Platform</span>
            <span style={PC.featureName}>Pricing &amp; Campaigns</span>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={PC.statBadge}>📦 {filtered.length} products</span>
          {/* User menu */}
          <div ref={menuRef} style={{position:"relative"}}>
            <button onClick={()=>setMenuOpen(o=>!o)} style={{width:36,height:36,borderRadius:"50%",background:menuOpen?"#fff":"rgba(255,255,255,0.22)",border:"2px solid rgba(255,255,255,0.6)",color:menuOpen?"#c0392b":"#fff",fontWeight:800,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
              {initial}
            </button>
            {menuOpen&&(
              <div style={{position:"absolute",top:44,right:0,background:"#fff",borderRadius:12,width:210,boxShadow:"0 12px 40px rgba(0,0,0,0.22)",border:"1px solid #f0e8dc",overflow:"hidden",zIndex:500}}>
                <div style={{padding:"14px 16px",background:"linear-gradient(135deg,#fff3e0,#ffe0b2)",borderBottom:"1px solid #f0ddd0"}}>
                  <div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,#e65c00,#f9a825)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:16,marginBottom:8}}>{initial}</div>
                  <div style={{fontWeight:700,fontSize:13,color:"#3d2010"}}>{username}</div>
                  <div style={{fontSize:11,color:"#a07050",marginTop:1}}>Retail Management Platform</div>
                </div>
                <div style={{padding:"6px 0"}}>
                  <button style={{display:"flex",alignItems:"center",gap:10,padding:"8px 16px",width:"100%",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,color:"#3d2010",fontWeight:600}}>
                    <span>🔑</span><span>Change Password</span>
                  </button>
                  <div style={{height:1,background:"#f5ede5",margin:"4px 12px"}}/>
                  <button onClick={onLogout} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 16px",width:"100%",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,color:"#c0392b",fontWeight:700}}>
                    <span>🚪</span><span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div style={PC.body}>
        {/* Filters bar */}
        <div style={PC.filtersBar}>
          <div style={PC.searchWrap}>
            <span style={PC.searchIcon}>🔍</span>
            <input style={PC.searchInput} type="text" placeholder="Search by name or type…"
              value={search} onChange={e=>setSearch(e.target.value)}/>
            {search&&<button style={PC.searchClear} onClick={()=>setSearch("")}>✕</button>}
          </div>
          <div style={PC.filterGroup}>
            <label style={PC.filterLabel}>Season</label>
            <select style={PC.filterSelect} value={filterSeason} onChange={e=>setFilterSeason(e.target.value)}>
              <option value="ALL">All Seasons</option>
              <option value="Summer">Summer</option>
              <option value="Winter">Winter</option>
            </select>
          </div>
          <div style={PC.filterGroup}>
            <label style={PC.filterLabel}>Campaign</label>
            <select style={PC.filterSelect} value={filterCampaign} onChange={e=>setFilterCampaign(e.target.value)}>
              <option value="ALL">All</option>
              <option value="YES">Active</option>
              <option value="NO">Inactive</option>
            </select>
          </div>
          <span style={{fontSize:12,color:"#a08878",marginLeft:"auto",alignSelf:"center"}}>
            Showing {pageItems.length} of {filtered.length}
          </span>
        </div>

        {/* Grid */}
        <div style={PC.grid}>
          {pageItems.map(p=>(
            <div key={p.id} style={PC.card}>
              {/* Campaign badge */}
              <div style={{
                ...PC.campaignBadge,
                background: p.campaign ? "linear-gradient(135deg,#27ae60,#2ecc71)" : "#f0ede8",
                color:      p.campaign ? "#fff" : "#b09a86",
              }}>
                {p.campaign ? "🎯 Campaign Active" : "No Campaign"}
              </div>

              <div style={PC.cardName}>{p.name}</div>

              <div style={PC.cardMeta}>
                <div style={PC.metaRow}>
                  <span style={PC.metaKey}>Type</span>
                  <span style={{...PC.metaVal, background:"#fdf4ec", color:"#c0620a", border:"1px solid #f5dcc0"}}>{p.type}</span>
                </div>
                <div style={PC.metaRow}>
                  <span style={PC.metaKey}>Price</span>
                  <span style={{...PC.metaVal, background:"#f0fff4", color:"#1a7a40", border:"1px solid #b8f0d0", fontWeight:800}}>{p.price}</span>
                </div>
                <div style={PC.metaRow}>
                  <span style={PC.metaKey}>Season</span>
                  <span style={{...PC.metaVal, background:seasonBg[p.season]||"#eee", color:seasonColor[p.season]||"#666", border:`1px solid ${seasonColor[p.season]}33`}}>
                    {p.season === "Winter" ? "❄️ " : p.season === "Summer" ? "☀️ " : "🌐 "}{p.season}
                  </span>
                </div>
                <div style={PC.metaRow}>
                  <span style={PC.metaKey}>Dims</span>
                  <span style={{...PC.metaVal, background:"#f5f5f5", color:"#555", border:"1px solid #ddd", fontFamily:"monospace", fontSize:10}}>{p.dims.w}×{p.dims.h}×{p.dims.d} cm</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div style={PC.pagination}>
          <button style={{...PC.pageBtn, opacity: safePage===1?0.4:1}} disabled={safePage===1} onClick={()=>setPage(1)}>«</button>
          <button style={{...PC.pageBtn, opacity: safePage===1?0.4:1}} disabled={safePage===1} onClick={()=>setPage(p=>Math.max(1,p-1))}>‹</button>

          {Array.from({length:totalPages},(_,i)=>i+1)
            .filter(n => n===1 || n===totalPages || Math.abs(n-safePage)<=2)
            .reduce((acc,n,idx,arr)=>{
              if(idx>0 && n-arr[idx-1]>1) acc.push("…");
              acc.push(n);
              return acc;
            },[])
            .map((item,i)=>
              item==="…"
                ? <span key={`e${i}`} style={{padding:"0 4px",color:"#b09a86",fontSize:13}}>…</span>
                : <button key={item} style={{...PC.pageBtn, background:item===safePage?"linear-gradient(135deg,#e65c00,#f9a825)":"#fff", color:item===safePage?"#fff":"#5a3e2b", border:item===safePage?"none":"1.5px solid #e8ddd0", fontWeight:item===safePage?800:500}} onClick={()=>setPage(item)}>{item}</button>
            )
          }

          <button style={{...PC.pageBtn, opacity: safePage===totalPages?0.4:1}} disabled={safePage===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>›</button>
          <button style={{...PC.pageBtn, opacity: safePage===totalPages?0.4:1}} disabled={safePage===totalPages} onClick={()=>setPage(totalPages)}>»</button>
        </div>
      </div>
    </div>
  );
}

// ── Pricing & Campaigns styles ─────────────────────────────────────────────────
const PC = {
  root:        {fontFamily:"'DM Sans','Segoe UI',sans-serif",height:"100vh",display:"flex",flexDirection:"column",background:"#fdf8f5",overflow:"hidden"},
  header:      {background:"linear-gradient(135deg,#922b21 0%,#c0392b 100%)",padding:"0 24px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 3px 14px rgba(146,43,33,0.38)",flexShrink:0},
  backBtn:     {background:"rgba(255,255,255,0.18)",color:"#fff",border:"1.5px solid rgba(255,255,255,0.45)",borderRadius:8,padding:"6px 14px",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"},
  title:       {color:"#fff",fontWeight:800,fontSize:18,letterSpacing:"-0.5px",lineHeight:1.1},
  featureName: {color:"rgba(255,255,255,0.75)",fontWeight:600,fontSize:11,letterSpacing:"0.2px"},
  statBadge:   {background:"rgba(255,255,255,0.18)",color:"#fff",borderRadius:8,padding:"5px 12px",fontSize:12,fontWeight:600,border:"1px solid rgba(255,255,255,0.25)"},
  body:        {flex:1,display:"flex",flexDirection:"column",overflow:"hidden",padding:"0"},
  filtersBar:  {background:"#fff",borderBottom:"1px solid #f0e8dc",padding:"10px 20px",display:"flex",gap:12,alignItems:"center",flexShrink:0,flexWrap:"wrap"},
  searchWrap:  {position:"relative",display:"flex",alignItems:"center",minWidth:220},
  searchIcon:  {position:"absolute",left:10,fontSize:13,pointerEvents:"none",opacity:0.5},
  searchInput: {padding:"7px 28px 7px 30px",border:"1.5px solid #e8ddd0",borderRadius:8,fontSize:13,fontFamily:"inherit",background:"#fdf9f5",outline:"none",color:"#3d2b1a",width:"100%"},
  searchClear: {position:"absolute",right:8,background:"none",border:"none",cursor:"pointer",fontSize:11,color:"#b09a86",padding:2},
  filterGroup: {display:"flex",alignItems:"center",gap:6},
  filterLabel: {fontSize:11,fontWeight:700,color:"#8a6a50",whiteSpace:"nowrap"},
  filterSelect:{padding:"6px 10px",border:"1.5px solid #e8ddd0",borderRadius:8,fontSize:12,fontFamily:"inherit",background:"#fdf9f5",color:"#3d2b1a",cursor:"pointer",outline:"none"},
  grid:        {flex:1,overflowY:"auto",padding:"16px 20px",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(195px,1fr))",gap:14,alignContent:"start"},
  card:        {background:"#fff",border:"1.5px solid #f0e8dc",borderRadius:14,padding:"14px 14px 12px",display:"flex",flexDirection:"column",gap:10,boxShadow:"0 2px 10px rgba(180,80,0,0.07)",transition:"box-shadow 0.15s, transform 0.15s"},
  campaignBadge:{borderRadius:6,padding:"4px 9px",fontSize:10,fontWeight:700,letterSpacing:"0.3px",alignSelf:"flex-start"},
  cardName:    {fontWeight:700,fontSize:13,color:"#2d1a08",lineHeight:1.3},
  cardMeta:    {display:"flex",flexDirection:"column",gap:6},
  metaRow:     {display:"flex",alignItems:"center",justifyContent:"space-between",gap:6},
  metaKey:     {fontSize:10,color:"#b09a86",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.4px"},
  metaVal:     {fontSize:11,fontWeight:600,borderRadius:5,padding:"2px 7px"},
  pagination:  {background:"#fff",borderTop:"1px solid #f0e8dc",padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"center",gap:4,flexShrink:0},
  pageBtn:     {minWidth:32,height:32,borderRadius:7,border:"1.5px solid #e8ddd0",background:"#fff",color:"#5a3e2b",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",padding:"0 8px",transition:"all 0.1s"},
};

// ── Dashboard ──────────────────────────────────────────────────────────────────
function Dashboard({ username, onLogout, onNavigate }) {
  const initial = username ? username[0].toUpperCase() : "?";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const features = [
    {
      id: "shelves",
      icon: "🏪",
      title: "Shelves Builder",
      desc: "Design your store floor layout by placing and arranging shelf units",
      active: true,
      color: "#e65c00",
      grad: "linear-gradient(135deg,#e65c00,#f9a825)",
      bg: "linear-gradient(145deg,#fff8f2,#ffe8d0)",
      border: "rgba(230,92,0,0.18)",
    },
    {
      id: "planogram",
      icon: "📋",
      title: "Planogram Builder",
      desc: "Fill your shelves with products and create visual planograms",
      active: true,
      color: "#2d6a9f",
      grad: "linear-gradient(135deg,#1a3a5c,#2d6a9f)",
      bg: "linear-gradient(145deg,#f0f6ff,#ddeeff)",
      border: "rgba(45,106,159,0.18)",
    },
    {
      id: "pricing",
      icon: "🏷️",
      title: "Pricing & Campaigns",
      desc: "Manage product pricing, seasons and promotional campaigns",
      active: true,
      color: "#c0392b",
      grad: "linear-gradient(135deg,#922b21,#c0392b)",
      bg: "linear-gradient(145deg,#fff5f5,#fde8e8)",
      border: "rgba(192,57,43,0.18)",
    },
    {
      id: "orders",
      icon: "📦",
      title: "Orders",
      desc: "Manage purchase orders and supplier deliveries",
      active: false,
      color: "#7a8a6a",
      grad: "linear-gradient(135deg,#7a8a6a,#a0b090)",
      bg: "linear-gradient(145deg,#f5f7f3,#eaeeea)",
      border: "rgba(120,140,106,0.15)",
    },
    {
      id: "visits",
      icon: "🗺️",
      title: "Visits",
      desc: "Track and plan field visits across your point of sales",
      active: false,
      color: "#8a6a9a",
      grad: "linear-gradient(135deg,#6a4a8a,#9a6ab0)",
      bg: "linear-gradient(145deg,#f8f4ff,#ede4f7)",
      border: "rgba(138,106,154,0.15)",
    },
    {
      id: "assortment",
      icon: "🗂️",
      title: "Assortment",
      desc: "Manage product assortments across organizations and point of sales",
      active: true,
      color: "#1a7a5e",
      grad: "linear-gradient(135deg,#0d5c46,#1a7a5e)",
      bg: "linear-gradient(145deg,#f0fff8,#d8f5ec)",
      border: "rgba(26,122,94,0.18)",
    },
  ];

  return (
    <div style={DS.root}>
      {/* Background decorations */}
      <div style={DS.bgBlob1}/>
      <div style={DS.bgBlob2}/>

      {/* Top bar */}
      <header style={DS.topbar}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={DS.logoRing}><span style={{fontSize:18}}>🛒</span></div>
          <div>
            <div style={DS.topTitle}>Retail Management Platform</div>
            <div style={DS.topSub}>Welcome back, {username}</div>
          </div>
        </div>
        {/* User avatar */}
        <div ref={menuRef} style={{position:"relative"}}>
          <button onClick={()=>setMenuOpen(o=>!o)} style={{
            width:38,height:38,borderRadius:"50%",
            background:menuOpen?"#fff":"rgba(255,255,255,0.22)",
            border:"2px solid rgba(255,255,255,0.6)",
            color:menuOpen?"#e65c00":"#fff",
            fontWeight:800,fontSize:14,cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center",
            transition:"all 0.15s",
          }}>{initial}</button>
          {menuOpen && (
            <div style={{position:"absolute",top:46,right:0,background:"#fff",borderRadius:12,width:210,boxShadow:"0 12px 40px rgba(0,0,0,0.22)",border:"1px solid #f0e8dc",overflow:"hidden",zIndex:500}}>
              <div style={{padding:"14px 16px",background:"linear-gradient(135deg,#fff3e0,#ffe0b2)",borderBottom:"1px solid #f0ddd0"}}>
                <div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,#e65c00,#f9a825)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:16,marginBottom:8,boxShadow:"0 2px 8px rgba(230,92,0,0.35)"}}>{initial}</div>
                <div style={{fontWeight:700,fontSize:13,color:"#3d2010"}}>{username}</div>
                <div style={{fontSize:11,color:"#a07050",marginTop:1}}>Retail Management Platform</div>
              </div>
              <div style={{padding:"6px 0"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 16px"}}>
                  <span style={{fontSize:15,width:20,textAlign:"center"}}>👤</span>
                  <span style={{fontSize:13,color:"#3d2010",fontWeight:500}}>{username}</span>
                </div>
                <div style={{height:1,background:"#f5ede5",margin:"4px 12px"}}/>
                <button style={{display:"flex",alignItems:"center",gap:10,padding:"8px 16px",width:"100%",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,color:"#3d2010",fontWeight:600}}>
                  <span style={{fontSize:15,width:20,textAlign:"center"}}>🔑</span><span>Change Password</span>
                </button>
                <div style={{height:1,background:"#f5ede5",margin:"4px 12px"}}/>
                <button onClick={onLogout} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 16px",width:"100%",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:13,color:"#c0392b",fontWeight:700}}>
                  <span style={{fontSize:15,width:20,textAlign:"center"}}>🚪</span><span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main style={DS.main}>
        <div style={DS.hello}>Hello, <span style={DS.helloName}>{username}</span></div>
        <div style={DS.heroText}>What would you like to do today?</div>

        <div style={DS.grid}>
          {features.map(f => (
            <div key={f.id}
              onClick={() => f.active && onNavigate(f.id)}
              style={{
                ...DS.card,
                background: f.bg,
                border: `1.5px solid ${f.border}`,
                cursor: f.active ? "pointer" : "not-allowed",
                opacity: f.active ? 1 : 0.72,
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={e => { if (f.active) { e.currentTarget.style.transform="translateY(-6px)"; e.currentTarget.style.boxShadow=`0 20px 50px ${f.color}28`; }}}
              onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow=DS.card.boxShadow; }}
            >
              {/* Coming soon ribbon */}
              {!f.active && (
                <div style={{
                  position:"absolute",top:16,right:-26,
                  background:"linear-gradient(135deg,#bbb,#999)",
                  color:"#fff",fontSize:9,fontWeight:800,letterSpacing:"0.8px",
                  padding:"4px 32px",transform:"rotate(35deg)",
                  textTransform:"uppercase",boxShadow:"0 2px 8px rgba(0,0,0,0.15)",
                  zIndex:2,
                }}>Coming Soon</div>
              )}

              {/* Icon circle */}
              <div style={{
                width:72,height:72,borderRadius:"50%",
                background: f.active ? f.grad : "linear-gradient(135deg,#ccc,#aaa)",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:32,marginBottom:20,
                boxShadow: f.active ? `0 8px 24px ${f.color}40` : "0 4px 12px rgba(0,0,0,0.12)",
                flexShrink:0,
              }}>{f.icon}</div>

              <div style={{fontWeight:800,fontSize:18,color: f.active ? "#2d1a08" : "#888",marginBottom:8,letterSpacing:"-0.3px"}}>
                {f.title}
              </div>
              <div style={{fontSize:13,color: f.active ? "#7a5030" : "#aaa",lineHeight:1.6,textAlign:"center"}}>
                {f.desc}
              </div>

              {f.active && (
                <div style={{
                  marginTop:22,
                  background: f.grad,
                  color:"#fff",borderRadius:8,
                  padding:"8px 22px",fontSize:13,fontWeight:700,
                  boxShadow:`0 4px 14px ${f.color}44`,
                  letterSpacing:"0.2px",
                }}>
                  Open →
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// ── Dashboard styles ───────────────────────────────────────────────────────────
const DS = {
  root:     {minHeight:"100vh",display:"flex",flexDirection:"column",background:"linear-gradient(160deg,#fff8f2 0%,#ffe8d0 55%,#ffd4a8 100%)",fontFamily:"'DM Sans','Segoe UI',sans-serif",position:"relative",overflow:"hidden"},
  bgBlob1:  {position:"absolute",top:-160,right:-120,width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,109,0,0.1) 0%,transparent 70%)",pointerEvents:"none"},
  bgBlob2:  {position:"absolute",bottom:-100,left:-80,width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(249,168,37,0.12) 0%,transparent 70%)",pointerEvents:"none"},
  topbar:   {height:60,padding:"0 32px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"linear-gradient(135deg,#e65c00,#f9a825)",boxShadow:"0 3px 16px rgba(230,92,0,0.35)",flexShrink:0,position:"relative",zIndex:10},
  logoRing: {width:38,height:38,borderRadius:"50%",background:"rgba(255,255,255,0.22)",border:"2px solid rgba(255,255,255,0.5)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},
  topTitle: {color:"#fff",fontWeight:800,fontSize:16,letterSpacing:"-0.3px",lineHeight:1.1},
  topSub:   {color:"rgba(255,255,255,0.72)",fontSize:11,fontWeight:500},
  main:     {flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px",position:"relative",zIndex:1},
  hello:    {fontSize:36,fontWeight:800,color:"#2d1a08",letterSpacing:"-0.8px",marginBottom:6,textAlign:"center"},
  helloName:{background:"linear-gradient(135deg,#e65c00,#f9a825)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},
  heroText: {fontSize:16,fontWeight:500,color:"#b08060",marginBottom:48,textAlign:"center"},
  heroSub:  {fontSize:14,color:"#b08060",marginBottom:48,fontWeight:500,textAlign:"center"},
  grid:     {display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:20,width:"100%",maxWidth:940},
  card:     {borderRadius:20,padding:"32px 24px",display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",transition:"transform 0.18s, box-shadow 0.18s",boxShadow:"0 4px 20px rgba(180,80,0,0.1)",userSelect:"none"},
};

export default function App() {
  const [authed,   setAuthed]   = useState(false);
  const [username, setUsername] = useState("");
  const [checking, setChecking] = useState(true);
  const [appPage,  setAppPage]  = useState("home"); // "home" | "shelves" | "planogram"

  useEffect(() => {
    let done = false;
    const finish = () => { if (!done) { done = true; setChecking(false); } };
    // Never block login screen for more than 800ms regardless of storage
    const timer = setTimeout(finish, 800);
    (async () => {
      try {
        const r = await window.storage.get(SESSION_KEY);
        if (r) {
          const s = JSON.parse(r.value);
          if (s?.loggedIn && s?.username) { setAuthed(true); setUsername(s.username); }
        }
      } catch {}
      clearTimeout(timer);
      finish();
    })();
  }, []);

  const handleLogin = (uname) => { setUsername(uname); setAuthed(true); setAppPage("home"); };
  const handleLogout = async () => {
    try { await window.storage.delete(SESSION_KEY); } catch {}
    setAuthed(false); setUsername(""); setAppPage("home");
  };

  if (checking) {
    return (
      <div style={{ height:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f7f3ee" }}>
        <div style={{ fontSize:14, color:"#c4a98c", fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>⏳ Loading…</div>
      </div>
    );
  }

  if (!authed) return <LoginPage onLogin={handleLogin}/>;

  if (appPage === "home") return <Dashboard username={username} onLogout={handleLogout} onNavigate={setAppPage}/>;
  if (appPage === "pricing") return <PricingCampaigns username={username} onLogout={handleLogout} onGoHome={() => setAppPage("home")}/>;
  if (appPage === "assortment") return <Assortment username={username} onLogout={handleLogout} onGoHome={() => setAppPage("home")}/>;

  return <ShelvesBuilder
    username={username}
    onLogout={handleLogout}
    initialPage={appPage === "planogram" ? "planogram" : "builder"}
    onGoHome={() => setAppPage("home")}
  />;
}

// ── Login page styles ──────────────────────────────────────────────────────────
const LS = {
  root: {
    minHeight:"100vh", display:"flex", flexDirection:"column",
    alignItems:"center", justifyContent:"center",
    background:"linear-gradient(145deg,#fff8f2 0%,#ffe8d0 50%,#ffd4a8 100%)",
    fontFamily:"'DM Sans','Segoe UI',sans-serif", position:"relative", overflow:"hidden",
    padding: "20px",
  },
  bgCircle1: { position:"absolute", top:-120, right:-80, width:420, height:420, borderRadius:"50%", background:"radial-gradient(circle,rgba(255,109,0,0.13) 0%,transparent 70%)", pointerEvents:"none" },
  bgCircle2: { position:"absolute", bottom:-100, left:-60, width:360, height:360, borderRadius:"50%", background:"radial-gradient(circle,rgba(249,168,37,0.15) 0%,transparent 70%)", pointerEvents:"none" },
  bgCircle3: { position:"absolute", top:"40%", left:"15%", width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle,rgba(230,92,0,0.07) 0%,transparent 70%)", pointerEvents:"none" },
  card: {
    background:"rgba(255,255,255,0.92)",
    backdropFilter:"blur(20px)",
    borderRadius:24, padding:"40px 44px",
    width:"100%", maxWidth:420,
    boxShadow:"0 24px 80px rgba(180,80,0,0.18), 0 4px 20px rgba(0,0,0,0.08)",
    border:"1px solid rgba(255,200,150,0.5)",
    position:"relative", zIndex:1,
  },
  brand: { display:"flex", flexDirection:"column", alignItems:"center", marginBottom:6 },
  logoRing: {
    width:68, height:68, borderRadius:"50%",
    background:"linear-gradient(135deg,#e65c00,#f9a825)",
    display:"flex", alignItems:"center", justifyContent:"center",
    boxShadow:"0 6px 24px rgba(230,92,0,0.4)", marginBottom:14,
  },
  brandText: { fontWeight:800, fontSize:22, color:"#2d1a0a", letterSpacing:"-0.5px" },
  brandSub:  { fontSize:12, color:"#b08060", marginTop:4, fontWeight:500 },
  divider:   { height:1, background:"linear-gradient(90deg,transparent,#f0d8c0,transparent)", margin:"22px 0" },
  fields:    { display:"flex", flexDirection:"column", gap:16 },
  fieldGroup:{ display:"flex", flexDirection:"column", gap:6 },
  label:     { fontSize:12, fontWeight:700, color:"#5a3020", letterSpacing:"0.3px" },
  inputWrap: { position:"relative", display:"flex", alignItems:"center" },
  inputIcon: { position:"absolute", left:13, fontSize:15, pointerEvents:"none", zIndex:1 },
  input: {
    width:"100%", padding:"11px 14px 11px 40px",
    border:"1.5px solid #f0d8c0", borderRadius:10,
    fontSize:14, fontFamily:"inherit",
    background:"#fffaf6", color:"#3d1a08",
    outline:"none", boxSizing:"border-box",
    transition:"border 0.15s, box-shadow 0.15s",
  },
  eyeBtn: { position:"absolute", right:10, background:"none", border:"none", cursor:"pointer", fontSize:15, padding:4 },
  errorBox: {
    background:"#fff0ee", border:"1.5px solid #ffcdd2",
    color:"#c62828", borderRadius:8, padding:"9px 14px",
    fontSize:13, fontWeight:500, display:"flex", alignItems:"center", gap:8,
  },
  submitBtn: {
    background:"linear-gradient(135deg,#e65c00,#f9a825)",
    border:"none", color:"#fff", borderRadius:11,
    padding:"13px", fontWeight:800, fontSize:15,
    cursor:"pointer", fontFamily:"inherit",
    boxShadow:"0 4px 18px rgba(230,92,0,0.45)",
    display:"flex", alignItems:"center", justifyContent:"center",
    transition:"opacity 0.15s, transform 0.12s",
    marginTop:4,
  },
  spinner: {
    width:18, height:18, border:"3px solid rgba(255,255,255,0.35)",
    borderTop:"3px solid #fff", borderRadius:"50%",
    animation:"spin 0.7s linear infinite", display:"inline-block",
  },
  forgotBtn: {
    background:"none", border:"none", color:"#e08040",
    fontSize:13, fontWeight:600, cursor:"pointer",
    textAlign:"center", fontFamily:"inherit",
    textDecoration:"underline", textDecorationColor:"rgba(224,128,64,0.4)",
    padding:"2px 0",
  },
  footer: { marginTop:28, fontSize:11, color:"#c4a080", textAlign:"center", position:"relative", zIndex:1 },
};

// ── User menu item styles ──────────────────────────────────────────────────────
const UM = {
  item: { display:"flex", alignItems:"center", gap:10, padding:"8px 16px" },
  btn:  { display:"flex", alignItems:"center", gap:10, padding:"8px 16px", width:"100%", background:"none", border:"none", cursor:"pointer", fontFamily:"inherit", fontSize:13, color:"#3d2010", fontWeight:600, textAlign:"left" },
  itemIcon: { fontSize:15, width:20, textAlign:"center" },
};

// ── Constants ──────────────────────────────────────────────────────────────────
const SHELF_SCALE  = 0.9;
const PANEL_SCALE  = 0.27;
const WORLD_W      = 4000;
const WORLD_H      = 3000;
const ZOOM_MIN     = 0.2;
const ZOOM_MAX     = 3.5;
const ZOOM_DEFAULT = 0.85;
const ZOOM_STEP    = 0.2;

const POINT_OF_SALES = [
  { id:"pos-1", name:"Downtown Flagship Store",   city:"New York, NY"    },
  { id:"pos-2", name:"Westfield Shopping Centre", city:"London, UK"      },
  { id:"pos-3", name:"Marina Bay Outlet",         city:"Singapore"       },
  { id:"pos-4", name:"Midtown Hypermarket",       city:"Chicago, IL"     },
  { id:"pos-5", name:"South Loop Convenience",    city:"Los Angeles, CA" },
];

const PRESETS = [
  { id:"preset-1", label:"Standard",      width:200, height:300, sections:4 },
  { id:"preset-2", label:"Tall Display",  width:180, height:380, sections:6 },
  { id:"preset-3", label:"Low Gondola",   width:220, height:180, sections:3 },
  { id:"preset-4", label:"End Cap",       width:150, height:320, sections:5 },
  { id:"preset-5", label:"Wide Rack",     width:280, height:260, sections:4 },
  { id:"preset-h1", label:"Hook Board S", width:180, height:280, sections:0, kind:"hook", hookRows:6, hookCols:8,  hookSpacing:4 },
  { id:"preset-h2", label:"Hook Board M", width:240, height:320, sections:0, kind:"hook", hookRows:8, hookCols:10, hookSpacing:4 },
  { id:"preset-h3", label:"Hook Tower",   width:160, height:400, sections:0, kind:"hook", hookRows:10,hookCols:6,  hookSpacing:3 },
];

// ── Furnishings (structural pieces + brand sign plates) ────────────────────────
const FURNISHINGS = [
  // Structural pieces
  { id:"furn-1",  label:"Side Panel",      kind:"piece",  orient:"vertical",   w:12,  h:180, color:"#8a7a6a", desc:"Vertical side divider" },
  { id:"furn-2",  label:"Top Rail",         kind:"piece",  orient:"horizontal", w:200, h:12,  color:"#8a7a6a", desc:"Horizontal top beam" },
  { id:"furn-3",  label:"Base Panel",       kind:"piece",  orient:"horizontal", w:200, h:14,  color:"#8a7a6a", desc:"Horizontal base bar" },
  { id:"furn-4",  label:"Mid Shelf",        kind:"piece",  orient:"horizontal", w:180, h:10,  color:"#a09080", desc:"Horizontal shelf plank" },
  { id:"furn-5",  label:"Corner Post",      kind:"piece",  orient:"vertical",   w:14,  h:280, color:"#706050", desc:"Tall vertical corner post" },
  { id:"furn-6",  label:"Divider Slim",     kind:"piece",  orient:"vertical",   w:8,   h:120, color:"#a09080", desc:"Thin vertical divider" },
  { id:"furn-7",  label:"Wide Shelf",       kind:"piece",  orient:"horizontal", w:260, h:12,  color:"#a09080", desc:"Wide horizontal plank" },
  { id:"furn-8",  label:"Short Post",       kind:"piece",  orient:"vertical",   w:12,  h:80,  color:"#706050", desc:"Short vertical post" },
  // Brand sign plates
  { id:"furn-9",  label:"EPSON Sign",       kind:"sign",   brand:"EPSON",  color:"#003087", textColor:"#fff" },
  { id:"furn-10", label:"HP Sign",          kind:"sign",   brand:"HP",     color:"#0096D6", textColor:"#fff" },
  { id:"furn-11", label:"CANON Sign",       kind:"sign",   brand:"CANON",  color:"#CC0000", textColor:"#fff" },
  { id:"furn-12", label:"SAMSUNG Sign",     kind:"sign",   brand:"SAMSUNG",color:"#1428A0", textColor:"#fff" },
  { id:"furn-13", label:"SONY Sign",        kind:"sign",   brand:"SONY",   color:"#000000", textColor:"#fff" },
  { id:"furn-14", label:"BROTHER Sign",     kind:"sign",   brand:"BROTHER",color:"#006A86", textColor:"#fff" },
  { id:"furn-15", label:"XEROX Sign",       kind:"sign",   brand:"XEROX",  color:"#CC0000", textColor:"#fff" },
  { id:"furn-16", label:"LENOVO Sign",      kind:"sign",   brand:"LENOVO", color:"#E2231A", textColor:"#fff" },
];

const PRODUCTS = [
  { id:"prod-1",  name:"Organic Oats",       price:"$3.99",  color:"#d4a26a", bg:"#fff8f0", emoji:"🌾", category:"Grains",      season:"ALL",    campaign:false, dims:{w:12,h:18,d:8}  },
  { id:"prod-2",  name:"Almond Milk",         price:"$4.49",  color:"#7bbfcc", bg:"#f0faff", emoji:"🥛", category:"Dairy Alt",   season:"ALL",    campaign:true,  dims:{w:8, h:24,d:8}  },
  { id:"prod-3",  name:"Brown Rice",          price:"$2.99",  color:"#c8a84b", bg:"#fffcf0", emoji:"🍚", category:"Grains",      season:"ALL",    campaign:false, dims:{w:14,h:20,d:10} },
  { id:"prod-4",  name:"Quinoa",              price:"$6.99",  color:"#3baa96", bg:"#f0fffc", emoji:"🌿", category:"Grains",      season:"Summer", campaign:true,  dims:{w:10,h:16,d:10} },
  { id:"prod-5",  name:"Olive Oil",           price:"$8.99",  color:"#6ab8c8", bg:"#f0fbff", emoji:"🫒", category:"Oils",        season:"ALL",    campaign:false, dims:{w:9, h:28,d:9}  },
  { id:"prod-6",  name:"Raw Honey",           price:"$7.49",  color:"#e5a900", bg:"#fffbf0", emoji:"🍯", category:"Sweeteners",  season:"Winter", campaign:true,  dims:{w:11,h:14,d:11} },
  { id:"prod-7",  name:"Chia Seeds",          price:"$5.99",  color:"#9b6bd4", bg:"#fbf5ff", emoji:"🫘", category:"Seeds",       season:"ALL",    campaign:false, dims:{w:8, h:13,d:6}  },
  { id:"prod-8",  name:"Greek Yogurt",        price:"$3.49",  color:"#d4614a", bg:"#fff5f3", emoji:"🥣", category:"Dairy",       season:"Summer", campaign:true,  dims:{w:10,h:12,d:10} },
  { id:"prod-9",  name:"Granola Bar",         price:"$1.99",  color:"#5cb87a", bg:"#f3fff7", emoji:"🍫", category:"Snacks",      season:"ALL",    campaign:false, dims:{w:7, h:10,d:4}  },
  { id:"prod-10", name:"Coconut Water",       price:"$2.99",  color:"#3aaed8", bg:"#f0fbff", emoji:"🥥", category:"Beverages",   season:"Summer", campaign:true,  dims:{w:9, h:22,d:9}  },
  // Print cartridges — small dims for hook shelves
  { id:"prod-11", name:"Canon PG-545 Black",  price:"$12.99", color:"#1a1a2e", bg:"#f0f0f8", emoji:"🖨️", category:"Cartridges",  season:"ALL",    campaign:false, dims:{w:5, h:8, d:3}  },
  { id:"prod-12", name:"Canon CL-546 Colour", price:"$14.99", color:"#e63946", bg:"#fff0f0", emoji:"🎨", category:"Cartridges",  season:"ALL",    campaign:true,  dims:{w:5, h:8, d:3}  },
  { id:"prod-13", name:"HP 304 Black",        price:"$11.49", color:"#005f9e", bg:"#eef5ff", emoji:"🖨️", category:"Cartridges",  season:"ALL",    campaign:false, dims:{w:4, h:7, d:3}  },
  { id:"prod-14", name:"HP 304 Tri-colour",   price:"$13.49", color:"#0096D6", bg:"#e8f4ff", emoji:"🎨", category:"Cartridges",  season:"ALL",    campaign:true,  dims:{w:4, h:7, d:3}  },
  { id:"prod-15", name:"Epson 603 Black",     price:"$10.99", color:"#333366", bg:"#f0f0ff", emoji:"🖨️", category:"Cartridges",  season:"ALL",    campaign:false, dims:{w:4, h:8, d:3}  },
  { id:"prod-16", name:"Epson 603 Cyan",      price:"$9.99",  color:"#00aacc", bg:"#e8fdff", emoji:"💧", category:"Cartridges",  season:"ALL",    campaign:false, dims:{w:4, h:8, d:3}  },
  { id:"prod-17", name:"Brother LC3213 Black",price:"$13.99", color:"#006A86", bg:"#eafaff", emoji:"🖨️", category:"Cartridges",  season:"ALL",    campaign:true,  dims:{w:5, h:9, d:3}  },
  { id:"prod-18", name:"Lexmark 105 Black",   price:"$16.99", color:"#2d6a2d", bg:"#f0fff0", emoji:"🖨️", category:"Cartridges",  season:"ALL",    campaign:false, dims:{w:5, h:8, d:4}  },
];

let _id = 100;
const uid  = () => `shelf-${++_id}`;
let _pid = 1;
const puid = () => `pp-${++_pid}`;
let _sid = 1;
const suid = () => `save-${++_sid}`;

// Distribute 100% evenly across n sections; last section gets the remainder
const equalPcts = (n) => {
  const base = Math.floor(100 / n);
  const rem  = 100 - base * n;
  return Array.from({length: n}, (_, i) => i === n - 1 ? base + rem : base);
};

// ── ToolToggle ─────────────────────────────────────────────────────────────────
function ToolToggle({ tool, setTool, accent="#ff6d00" }) {
  return (
    <div style={{display:"flex",background:"#f0ebe3",borderRadius:9,padding:3,gap:2}}>
      {[{id:"pointer",label:"Pointer",icon:"↖"},{id:"hand",label:"Hand",icon:"✋"}].map(t=>(
        <button key={t.id} title={t.label} onClick={()=>setTool(t.id)} style={{
          display:"flex",alignItems:"center",gap:5,padding:"5px 11px",
          borderRadius:7,border:"none",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit",
          background:tool===t.id?accent:"transparent",
          color:tool===t.id?"#fff":"#7a5c44",
          boxShadow:tool===t.id?"0 2px 6px rgba(0,0,0,0.18)":"none",
          transition:"all 0.13s",
        }}>
          <span style={{fontSize:15,lineHeight:1}}>{t.icon}</span>
          <span style={{fontSize:11}}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ── SaveModal ──────────────────────────────────────────────────────────────────
function SaveModal({ type, accentGrad, onSave, onClose }) {
  const [name,setName] = useState("");
  const [pos, setPos]  = useState(POINT_OF_SALES[0].id);
  const [err, setErr]  = useState("");
  const inp = {width:"100%",padding:"9px 12px",border:"1.5px solid #e0d4c4",borderRadius:8,fontSize:14,fontFamily:"inherit",background:"#fdf9f5",outline:"none",color:"#3d2b1a",boxSizing:"border-box"};
  const submit = () => { if(!name.trim()){setErr("Please enter a name.");return;} onSave({name:name.trim(),posId:pos}); };
  return (
    <div style={M.overlay} onClick={onClose}>
      <div style={M.box} onClick={e=>e.stopPropagation()}>
        <div style={{...M.head,background:accentGrad}}>
          <span>💾 Save {type==="shelves"?"Shelf Layout":"Planogram"}</span>
          <button style={M.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={M.body}>
          <div><label style={M.label}>Name</label>
            <input style={inp} placeholder={type==="shelves"?"e.g. Cereal Aisle Layout":"e.g. Q4 Promo Planogram"}
              value={name} onChange={e=>{setName(e.target.value);setErr("");}} autoFocus/></div>
          <div><label style={M.label}>Point of Sale</label>
            <select value={pos} onChange={e=>setPos(e.target.value)} style={{...inp,cursor:"pointer"}}>
              {POINT_OF_SALES.map(p=><option key={p.id} value={p.id}>{p.name} — {p.city}</option>)}
            </select></div>
          {err&&<div style={M.err}>{err}</div>}
        </div>
        <div style={M.foot}>
          <button style={M.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={{...M.saveBtn,background:accentGrad}} onClick={submit}>✓ Save</button>
        </div>
      </div>
    </div>
  );
}

// ── OpenModal ──────────────────────────────────────────────────────────────────
function OpenModal({ savedItems, onOpen, onDelete, onClose }) {
  const [filter,setFilter] = useState("all");
  const filtered = savedItems.filter(s=>filter==="all"||s.type===filter);
  const getPOS   = id => { const p=POINT_OF_SALES.find(x=>x.id===id); return p?p.name:"—"; };
  const TC = {shelves:"#e65c00",planogram:"#2d6a9f"};
  const TL = {shelves:"Shelf Layout",planogram:"Planogram"};
  return (
    <div style={M.overlay} onClick={onClose}>
      <div style={{...M.box,width:680,maxWidth:"96vw"}} onClick={e=>e.stopPropagation()}>
        <div style={{...M.head,background:"linear-gradient(135deg,#2c3e50,#4a6fa5)"}}>
          <span>📂 Open Saved Layout</span>
          <button style={M.closeBtn} onClick={onClose}>✕</button>
        </div>
        {/* Filter tabs */}
        <div style={{display:"flex",gap:0,padding:"12px 20px 0",borderBottom:"1px solid #f0e8dc"}}>
          {["all","shelves","planogram"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{
              padding:"6px 18px",border:"none",borderRadius:"8px 8px 0 0",
              fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit",
              background:filter===f?"#fff":"transparent",
              color:filter===f?"#333":"#999",
              borderBottom:filter===f?"2px solid #ff6d00":"2px solid transparent",
            }}>
              {f==="all"?"All":TL[f]}
              <span style={{marginLeft:5,background:f==="all"?"#bbb":TC[f],color:"#fff",borderRadius:10,padding:"1px 6px",fontSize:9}}>
                {f==="all"?savedItems.length:savedItems.filter(s=>s.type===f).length}
              </span>
            </button>
          ))}
        </div>
        <div style={{padding:"16px 20px",maxHeight:400,overflowY:"auto"}}>
          {filtered.length===0?(
            <div style={{textAlign:"center",padding:"40px 0",color:"#bbb"}}>
              <div style={{fontSize:40,marginBottom:10}}>📭</div>
              <div style={{fontWeight:600}}>No saved layouts yet</div>
            </div>
          ):(
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:12}}>
              {filtered.map(item=>(
                <div key={item.id} style={{background:"#faf8f5",border:"1.5px solid #e8ddd0",borderRadius:12,overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
                  <div style={{height:85,background:item.type==="shelves"?"linear-gradient(135deg,#fff3e0,#ffe0b2)":"linear-gradient(135deg,#e3f2fd,#bbdefb)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:34}}>
                    {item.type==="shelves"?"🏪":"📋"}
                  </div>
                  <div style={{padding:"10px 12px",flex:1,display:"flex",flexDirection:"column",gap:3}}>
                    <div style={{display:"inline-flex",alignSelf:"flex-start",background:TC[item.type]+"18",color:TC[item.type],borderRadius:5,padding:"1px 7px",fontSize:9,fontWeight:800,letterSpacing:"0.5px",textTransform:"uppercase"}}>
                      {TL[item.type]}
                    </div>
                    <div style={{fontWeight:700,fontSize:13,color:"#2d2010",lineHeight:1.3}}>{item.name}</div>
                    <div style={{fontSize:10,color:"#9a8070"}}>📍 {getPOS(item.posId)}</div>
                    <div style={{fontSize:10,color:"#b0a090"}}>🕐 {item.savedAt}</div>
                  </div>
                  <div style={{display:"flex",borderTop:"1px solid #f0e8dc"}}>
                    <button onClick={()=>onOpen(item)} style={{flex:1,padding:"8px",border:"none",cursor:"pointer",background:"transparent",fontWeight:700,fontSize:12,color:TC[item.type],fontFamily:"inherit"}}>
                      ↗ Open
                    </button>
                    <button onClick={()=>onDelete(item.id)} style={{width:34,border:"none",borderLeft:"1px solid #f0e8dc",cursor:"pointer",background:"transparent",color:"#c0a090",fontSize:13}}>
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{...M.foot,justifyContent:"flex-start"}}>
          <button style={M.cancelBtn} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ── ShelfSVG ──────────────────────────────────────────────────────────────────
function ShelfSVG({ width, height, sections, sectionPcts, scale=1, selected=false }) {
  const W=width*scale, H=height*scale;
  const plk=Math.max(4,7*scale), sw=Math.max(5,10*scale);
  const COLORS=["#f4a261","#e76f51","#2a9d8f","#264653","#e9c46a","#a8dadc","#c77dff","#90e0ef"];
  // Build per-section heights in px from pcts (fall back to equal)
  const pcts = (sectionPcts && sectionPcts.length===sections) ? sectionPcts : equalPcts(sections);
  let cumY = 0;
  const secTops = pcts.map(p => { const t=cumY; cumY+=(p/100)*H; return t; });
  const secHeights = pcts.map(p => (p/100)*H);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{display:"block",flexShrink:0}}>
      <rect x={sw} y={plk} width={W-sw} height={H-plk} fill="rgba(0,0,0,0.13)" rx="3"/>
      <rect x={sw/2} y={0} width={W-sw} height={H} fill={selected?"#fff3e0":"#f5f0e8"} rx="3"/>
      <rect x={0} y={0} width={sw} height={H} fill={selected?"#cc4400":"#8b5e3c"} rx="3"/>
      <rect x={W-sw} y={0} width={sw} height={H} fill={selected?"#cc4400":"#7a5234"} rx="3"/>
      {secTops.map((t,i)=>(
        <rect key={i} x={sw/2} y={t} width={W-sw} height={plk} fill={selected?"#e65c00":"#7a4f2a"} rx="1"/>
      ))}
      {/* Bottom board */}
      <rect x={sw/2} y={H-plk} width={W-sw} height={plk} fill={selected?"#e65c00":"#7a4f2a"} rx="1"/>
      {secTops.map((t,si)=>{
        const sH=secHeights[si], y0=t+plk, aH=sH-plk;
        const cols=Math.max(2,Math.floor((W-sw*2)/(18*scale)));
        const colW=(W-sw*2)/cols;
        return Array.from({length:cols}).map((_,ci)=>{
          const iw=colW*0.70, ih=aH*(0.50+Math.sin(si*4+ci*2.3)*0.18);
          const ix=sw+ci*colW+(colW-iw)/2, iy=y0+aH-ih;
          const c=COLORS[(si*cols+ci)%COLORS.length];
          return (
            <g key={ci}>
              <rect x={ix} y={iy} width={iw} height={ih} fill={c} opacity={0.88} rx="2"/>
              {ih>12*scale&&<rect x={ix+iw*0.15} y={iy+ih*0.15} width={iw*0.7} height={Math.max(1,2*scale)} fill="rgba(255,255,255,0.5)" rx="1"/>}
            </g>
          );
        });
      })}
      {selected&&<rect x={1} y={1} width={W-2} height={H-2} fill="none" stroke="#ff6d00" strokeWidth={3} strokeDasharray="8,4" rx="4"/>}
    </svg>
  );
}

// ── HookSVG: pegboard with hook rows ─────────────────────────────────────────
function HookSVG({ width, height, hookRows=6, hookCols=8, hookSpacing=4, scale=1, selected=false }) {
  const W=width*scale, H=height*scale;
  const border=Math.max(4,8*scale);
  const innerW=W-border*2, innerH=H-border*2;
  const cellW=innerW/hookCols, cellH=innerH/hookRows;
  const pegR=Math.max(1.5,Math.min(4,cellW*0.12));
  const hookLen=Math.max(5,cellW*0.42);
  const hookTip=Math.max(3,cellH*0.22);
  const itemColors=["#e63946","#457b9d","#2a9d8f","#e9c46a","#6a4c93","#1d3557","#f4a261","#06d6a0"];
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{display:"block",flexShrink:0}}>
      <rect x={0} y={0} width={W} height={H} fill={selected?"#fff3e0":"#d6cfc4"} rx="4"/>
      <rect x={border} y={border} width={innerW} height={innerH} fill={selected?"#fce8d0":"#c8c0b4"} rx="2"/>
      {Array.from({length:hookRows},(_,ri)=>Array.from({length:hookCols},(_,ci)=>{
        const cx=border+ci*cellW+cellW/2, cy=border+ri*cellH+cellH*0.3;
        const hasItem=(ri*hookCols+ci)%3!==2;
        const iW=Math.max(5,cellW*0.58), iH=Math.max(7,cellH*0.52);
        const color=itemColors[(ri*hookCols+ci)%itemColors.length];
        return (
          <g key={`${ri}-${ci}`}>
            <circle cx={cx} cy={cy} r={pegR} fill={selected?"#e65c00aa":"#7a6050"} opacity={0.75}/>
            <line x1={cx} y1={cy} x2={cx+hookLen} y2={cy} stroke={selected?"#e65c00":"#4a3020"} strokeWidth={Math.max(1.2,scale*1.5)}/>
            <path d={`M${cx+hookLen},${cy} q${hookTip*0.5},0 ${hookTip*0.5},${hookTip}`} fill="none" stroke={selected?"#e65c00":"#4a3020"} strokeWidth={Math.max(1.2,scale*1.5)}/>
            {hasItem&&<rect x={cx+hookLen*0.08} y={cy+pegR} width={iW} height={iH} fill={color} opacity={0.82} rx="2"/>}
          </g>
        );
      }))}
      <rect x={0} y={0} width={W} height={H} fill="none" stroke={selected?"#ff6d00":"#9a8878"} strokeWidth={Math.max(1.5,2.5*scale)} rx="4"/>
      {selected&&<rect x={1} y={1} width={W-2} height={H-2} fill="none" stroke="#ff6d00" strokeWidth={3} strokeDasharray="8,4" rx="4"/>}
    </svg>
  );
}

// ── ShelfOrHook: renders the correct SVG based on item.kind ──────────────────
function ShelfOrHook({ item, scale, selected=false }) {
  if (item.kind==="hook") return <HookSVG width={item.width} height={item.height} hookRows={item.hookRows} hookCols={item.hookCols} hookSpacing={item.hookSpacing} scale={scale} selected={selected}/>;
  return <ShelfSVG width={item.width} height={item.height} sections={item.sections} sectionPcts={item.sectionPcts} scale={scale} selected={selected}/>;
}

// ── ProductImageBlock ──────────────────────────────────────────────────────────
function ProductImageBlock({ product, size=56 }) {
  return (
    <div style={{width:size,height:size*1.3,background:`linear-gradient(145deg,${product.bg},${product.color}22)`,border:`2px solid ${product.color}55`,borderRadius:8,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,flexShrink:0,boxShadow:`0 2px 8px ${product.color}33`}}>
      <span style={{fontSize:size*0.42}}>{product.emoji}</span>
      <div style={{width:"80%",height:3,background:product.color,borderRadius:2,opacity:0.7}}/>
    </div>
  );
}

// ── PlanogramShelfUnit ────────────────────────────────────────────────────────
function PlanogramShelfUnit({ shelf, scale, placedProducts, draggingProduct, onDropProduct, onRemoveProduct }) {
  const [hoveredSec,setHoveredSec] = useState(null);
  const W=shelf.width*scale, H=shelf.height*scale;

  // ── Hook shelf render ────────────────────────────────────────────────────────
  if (shelf.kind === "hook") {
    const border=Math.max(4,8*scale);
    const innerW=W-border*2, innerH=H-border*2;
    const rows=shelf.hookRows||6, cols=shelf.hookCols||8;
    const rowPcts=(shelf.hookRowPcts&&shelf.hookRowPcts.length===rows)?shelf.hookRowPcts:equalPcts(rows);
    let cumY=border;
    const rowTops=rowPcts.map(p=>{const t=cumY;cumY+=(p/100)*innerH;return t;});
    const rowHeights=rowPcts.map(p=>(p/100)*innerH);
    const secWcm=sectionWidthCm(shelf);

    return (
      <div style={{position:"absolute",left:shelf.x,top:shelf.y,width:W,height:H+28,userSelect:"none"}}>
        {/* Pegboard background */}
        <div style={{position:"absolute",inset:0,background:"#c8c0b4",borderRadius:6,border:"2px solid #9a8878"}}/>
        <div style={{position:"absolute",top:border,left:border,right:border,bottom:border,background:"#bfb8ae",borderRadius:3}}/>

        {/* Rows — each is a drop zone */}
        {Array.from({length:rows}).map((_,ri)=>{
          const key=`${shelf.instanceId}_sec_${ri}`;
          const prods=placedProducts[key]||[];
          const isHov=hoveredSec===key;
          const rH=rowHeights[ri], rTop=rowTops[ri];
          const usedW=sectionUsedCm(prods);
          const fillPct=Math.min(100,Math.round((usedW/secWcm)*100));
          const isFull=usedW>=secWcm;
          const cellW=innerW/cols;
          const pegY=rTop+Math.max(3,rH*0.22);
          const pegR=Math.max(1.5,Math.min(3.5,cellW*0.10));

          return (
            <div key={ri} style={{position:"absolute",left:border,top:rTop,width:innerW,height:rH,
              background:isHov?(isFull?"rgba(220,50,50,0.22)":"rgba(255,109,0,0.18)"):"transparent",
              outline:isHov?`2px dashed ${isFull?"#e53935":"#ff6d00"}`:"none",outlineOffset:-2,
              zIndex:3,cursor:draggingProduct?(isFull?"not-allowed":"copy"):"default",borderRadius:2,transition:"background 0.1s"}}
              onDragOver={e=>{e.preventDefault();e.dataTransfer.dropEffect=isFull?"none":"copy";setHoveredSec(key);}}
              onDragLeave={e=>{if(!e.currentTarget.contains(e.relatedTarget))setHoveredSec(null);}}
              onDrop={e=>{e.preventDefault();onDropProduct(key,shelf);setHoveredSec(null);}}>

              {/* Peg holes */}
              {Array.from({length:cols}).map((_,ci)=>{
                const cx=ci*cellW+cellW/2;
                const hasProd=ci<prods.length;
                const prod=prods[ci];
                const hookLen=Math.max(5,cellW*0.38);
                const hookTip=Math.max(3,rH*0.18);
                const iW=Math.max(8,cellW*0.60), iH=Math.max(10,rH*0.62);

                return (
                  <div key={ci} style={{position:"absolute",left:ci*cellW,top:0,width:cellW,height:rH,display:"flex",flexDirection:"column",alignItems:"center"}}>
                    {/* SVG: hole + hook arm + product */}
                    <svg width={cellW} height={rH} style={{overflow:"visible",position:"absolute",top:0,left:0}}>
                      {/* Peg hole */}
                      <circle cx={cellW/2} cy={pegY-rTop} r={pegR} fill="#7a6050" opacity={0.8}/>
                      {/* Hook arm */}
                      <line x1={cellW/2} y1={pegY-rTop} x2={cellW/2+hookLen} y2={pegY-rTop} stroke="#4a3020" strokeWidth={Math.max(1.2,scale*1.4)}/>
                      <path d={`M${cellW/2+hookLen},${pegY-rTop} q${hookTip*0.5},0 ${hookTip*0.5},${hookTip}`} fill="none" stroke="#4a3020" strokeWidth={Math.max(1.2,scale*1.4)}/>
                    </svg>
                    {/* Hanging product */}
                    {hasProd && (
                      <div title={`${prod.name}\n${prod.dims?`${prod.dims.w}×${prod.dims.h}×${prod.dims.d} cm`:""}\nClick to remove`}
                        onClick={()=>onRemoveProduct(key,prod.placedId)}
                        style={{position:"absolute",top:pegY-rTop+pegR,left:(cellW-iW)/2,width:iW,height:iH,
                          background:`linear-gradient(160deg,${prod.bg},${prod.color}44)`,
                          border:`1.5px solid ${prod.color}88`,borderRadius:3,
                          display:"flex",alignItems:"center",justifyContent:"center",
                          fontSize:Math.max(8,iW*0.45),cursor:"pointer",
                          boxShadow:"1px 2px 4px rgba(0,0,0,0.22)",transition:"transform 0.1s",zIndex:2}}
                        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.12)"}
                        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                        <span>{prod.emoji}</span>
                      </div>
                    )}
                  </div>
                );
              })}
              {/* Empty row hint */}
              {prods.length===0&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:Math.max(7,rH*0.18),color:"rgba(0,0,0,0.18)",pointerEvents:"none"}}>drop here</div>}
              {/* Fill % */}
              <div style={{position:"absolute",bottom:2,right:4,fontSize:8,fontWeight:700,
                color:fillPct>=90?"#e53935":fillPct>=60?"#e65c00":"#666",
                background:"rgba(255,255,255,0.7)",borderRadius:3,padding:"1px 4px",pointerEvents:"none",lineHeight:1.4,zIndex:5}}>
                {fillPct}%
              </div>
            </div>
          );
        })}

        {/* Outer frame */}
        <div style={{position:"absolute",inset:0,border:"2px solid #9a8878",borderRadius:6,pointerEvents:"none",zIndex:6}}/>
        {/* Label */}
        <div style={{position:"absolute",bottom:-22,left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,0.55)",color:"#fff",fontSize:10,fontWeight:700,borderRadius:4,padding:"2px 8px",whiteSpace:"nowrap",zIndex:7}}>{shelf.label}</div>
      </div>
    );
  }

  // ── Standard shelf render ────────────────────────────────────────────────────
  const sideW=Math.max(5,10*scale), boardH=Math.max(4,7*scale);
  const secWcm = sectionWidthCm(shelf);
  const pcts = (shelf.sectionPcts && shelf.sectionPcts.length===shelf.sections)
    ? shelf.sectionPcts : equalPcts(shelf.sections);
  let cumY=0;
  const secTops    = pcts.map(p=>{ const t=cumY; cumY+=(p/100)*H; return t; });
  const secHeights = pcts.map(p=>(p/100)*H);
  return (
    <div style={{position:"absolute",left:shelf.x,top:shelf.y,width:W,height:H+28,userSelect:"none"}}>
      <div style={{position:"absolute",left:sideW,top:boardH,width:W-sideW,height:H-boardH,background:"rgba(0,0,0,0.13)",borderRadius:3}}/>
      <div style={{position:"absolute",left:sideW/2,top:0,width:W-sideW,height:H,background:"#f5f0e8",borderRadius:3}}>
        {secTops.map((t,i)=>(
          <div key={i} style={{position:"absolute",left:0,right:0,top:t,height:boardH,background:"#7a4f2a",zIndex:2,borderRadius:1}}/>
        ))}
        <div style={{position:"absolute",left:0,right:0,top:H-boardH,height:boardH,background:"#7a4f2a",zIndex:2,borderRadius:1}}/>
        {Array.from({length:shelf.sections}).map((_,si)=>{
          const key=`${shelf.instanceId}_sec_${si}`;
          const prods=placedProducts[key]||[];
          const isHov=hoveredSec===key, itemH=secHeights[si]-boardH;
          const usedW  = sectionUsedCm(prods);
          const fillPct= Math.min(100, Math.round((usedW / secWcm) * 100));
          const isFull = usedW >= secWcm;
          return (
            <div key={si} style={{position:"absolute",left:0,right:0,top:secTops[si]+boardH,height:itemH,
              background:isHov?(isFull?"rgba(220,50,50,0.18)":"rgba(255,109,0,0.15)"):prods.length===0?"rgba(0,0,0,0.015)":"transparent",
              zIndex:3,display:"flex",alignItems:"flex-end",padding:"2px 4px",gap:3,overflowX:"hidden",
              outline:isHov?`2px dashed ${isFull?"#e53935":"#ff6d00"}`:"none",outlineOffset:-2,
              transition:"background 0.12s",cursor:draggingProduct?(isFull?"not-allowed":"copy"):"default"}}
              onDragOver={e=>{e.preventDefault();e.dataTransfer.dropEffect=isFull?"none":"copy";setHoveredSec(key);}}
              onDragLeave={e=>{if(!e.currentTarget.contains(e.relatedTarget))setHoveredSec(null);}}
              onDrop={e=>{e.preventDefault();onDropProduct(key,shelf);setHoveredSec(null);}}>
              {prods.map(p=>{
                const pW=Math.max(16,Math.min(itemH*0.55,44)), pH=Math.max(20,Math.min(itemH*0.90,68));
                return (
                  <div key={p.placedId}
                    title={`${p.name}\n${p.dims?`${p.dims.w}×${p.dims.h}×${p.dims.d} cm`:""}\nClick to remove`}
                    onClick={()=>onRemoveProduct(key,p.placedId)}
                    style={{flexShrink:0,width:pW,height:pH,background:`linear-gradient(160deg,${p.bg},${p.color}44)`,border:`1.5px solid ${p.color}88`,borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:Math.max(9,pW*0.5),cursor:"pointer",boxShadow:"1px 2px 5px rgba(0,0,0,0.18)",transition:"transform 0.1s"}}
                    onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"}
                    onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
                  ><span>{p.emoji}</span></div>
                );
              })}
              {prods.length===0&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:Math.max(8,itemH*0.2),color:"rgba(0,0,0,0.14)",pointerEvents:"none"}}>drop here</div>}
              <div style={{position:"absolute",bottom:2,right:4,fontSize:8,fontWeight:700,
                color:fillPct>=90?"#e53935":fillPct>=60?"#e65c00":"#888",
                background:"rgba(255,255,255,0.75)",borderRadius:3,padding:"1px 4px",pointerEvents:"none",lineHeight:1.4}}>
                {fillPct}%
              </div>
            </div>
          );
        })}
      </div>
      <div style={{position:"absolute",left:0,top:0,width:sideW,height:H,background:"#8b5e3c",borderRadius:3,zIndex:4}}/>
      <div style={{position:"absolute",right:0,top:0,width:sideW,height:H,background:"#7a5234",borderRadius:3,zIndex:4}}/>
      <div style={{position:"absolute",bottom:-22,left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,0.55)",color:"#fff",fontSize:10,fontWeight:700,borderRadius:4,padding:"2px 8px",whiteSpace:"nowrap",zIndex:5}}>{shelf.label}</div>
    </div>
  );
}

// ── useHandPan ────────────────────────────────────────────────────────────────
function useHandPan(viewportRef, active) {
  const panStart = useRef(null);
  const onMouseDown = useCallback((e) => {
    if (!active||e.button!==0) return;
    e.preventDefault();
    const el=viewportRef.current;
    panStart.current={x:e.clientX,y:e.clientY,sl:el.scrollLeft,st:el.scrollTop};
  },[active,viewportRef]);
  useEffect(()=>{
    const mv=(e)=>{if(!panStart.current)return;const dx=e.clientX-panStart.current.x,dy=e.clientY-panStart.current.y;viewportRef.current.scrollLeft=panStart.current.sl-dx;viewportRef.current.scrollTop=panStart.current.st-dy;};
    const up=()=>{panStart.current=null;};
    window.addEventListener("mousemove",mv);window.addEventListener("mouseup",up);
    return()=>{window.removeEventListener("mousemove",mv);window.removeEventListener("mouseup",up);};
  },[viewportRef]);
  return {onMouseDown};
}

// ── Planogram capacity helpers ────────────────────────────────────────────────
// Returns the usable width of a section in real cm (shelf.width / sections,
// minus the two side panels which together consume ~10% of shelf width).
// For hook shelves: number of "sections" is hookRows, width per section = hookCols slots
function shelfSectionCount(shelf) {
  return shelf.kind === "hook" ? (shelf.hookRows || 1) : shelf.sections;
}
// Width capacity per section in cm
function sectionWidthCm(shelf) {
  if (shelf.kind === "hook") {
    // Each row holds hookCols items; treat capacity as hookCols × avg product width (use 5cm for cartridges)
    return (shelf.hookCols || 8) * 5;
  }
  const usableW = shelf.width * 0.88;
  return usableW / shelf.sections;
}

// How many units of a product (by its dims.w in cm) fit in one section.
// Falls back to a pixel-based estimate when product has no dims.
function sectionCapacity(shelf, product) {
  const secW = sectionWidthCm(shelf);
  if (product && product.dims && product.dims.w > 0) {
    return Math.max(1, Math.floor(secW / product.dims.w));
  }
  // Legacy pixel fallback (no product supplied)
  const scale  = SHELF_SCALE;
  const W      = shelf.width  * scale;
  const H      = shelf.height * scale;
  const sH     = H / shelf.sections;
  const sideW  = Math.max(5, 10 * scale);
  const boardH = Math.max(4,  7 * scale);
  const itemH  = sH - boardH;
  const pW     = Math.max(16, Math.min(itemH * 0.55, 44));
  const availW = (W - sideW) - 8;
  return Math.max(1, Math.floor((availW + 3) / (pW + 3)));
}

// Total width already occupied in a section by its placed products (cm)
function sectionUsedCm(placedList) {
  return (placedList || []).reduce((sum, p) => sum + (p.dims?.w || 8), 0);
}

// ── PlanogramPage ─────────────────────────────────────────────────────────────
function PlanogramPage({ shelves, onBack, onSave, savedItems, onOpenSaved, onDeleteSaved, username, onLogout, onGoHome }) {
  const [placedProducts,setPlacedProducts] = useState({});
  const placedRef = useRef({});
  useEffect(() => { placedRef.current = placedProducts; }, [placedProducts]);
  const [draggingProduct,setDraggingProduct] = useState(null);
  const [productQuery, setProductQuery] = useState("");
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [filterSeasons,   setFilterSeasons]   = useState([]);   // [] = all
  const [filterCampaign,  setFilterCampaign]  = useState([]);   // [] = all, "yes"/"no"
  const [filterTypes,     setFilterTypes]     = useState([]);   // [] = all
  const filterRef = useRef(null);

  // Close filter popup on outside click
  useEffect(() => {
    const h = (e) => { if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilterPopup(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const [zoom,setZoom]     = useState(ZOOM_DEFAULT);
  const [tool,setTool]     = useState("pointer");
  const [showSave,setShowSave] = useState(false);
  const [showOpen,setShowOpen] = useState(false);
  const [toast,setToast]   = useState(null);
  const viewportRef = useRef(null);
  const zoomRef     = useRef(ZOOM_DEFAULT);
  const toastTimer  = useRef(null);
  useEffect(()=>{zoomRef.current=zoom;},[zoom]);

  const isHand = tool==="hand";
  const fireToast=(msg,ok=false)=>{setToast({msg,ok});clearTimeout(toastTimer.current);toastTimer.current=setTimeout(()=>setToast(null),3000);};
  const {onMouseDown:onHandDown} = useHandPan(viewportRef,isHand);

  const applyZoom=useCallback((newRaw)=>{
    const el=viewportRef.current;if(!el)return;
    const oldZ=zoomRef.current,newZ=Math.min(ZOOM_MAX,Math.max(ZOOM_MIN,+newRaw.toFixed(3)));
    if(newZ===oldZ)return;
    const cx=el.scrollLeft+el.clientWidth/2,cy=el.scrollTop+el.clientHeight/2;
    setZoom(newZ);
    requestAnimationFrame(()=>{if(!viewportRef.current)return;viewportRef.current.scrollLeft=(cx/oldZ)*newZ-viewportRef.current.clientWidth/2;viewportRef.current.scrollTop=(cy/oldZ)*newZ-viewportRef.current.clientHeight/2;});
  },[]);

  const handleDropProduct=useCallback((key, shelf)=>{
    if(!draggingProduct) return;
    const prod = draggingProduct;
    const secW = sectionWidthCm(shelf);
    const prodW = prod.dims?.w || 8;

    setPlacedProducts(prev => {
      const current = prev[key] || [];
      const usedW = sectionUsedCm(current);

      // If product fits in dropped section, place it there
      if (usedW + prodW <= secW) {
        return {...prev, [key]: [...current, {...prod, placedId:puid()}]};
      }

      // Section is full — find the next section on the same shelf that has room
      const [instId] = key.split("_sec_");
      const secIdx   = parseInt(key.split("_sec_")[1], 10);
      for (let si = secIdx + 1; si < shelfSectionCount(shelf); si++) {
        const nextKey  = `${instId}_sec_${si}`;
        const nextList = prev[nextKey] || [];
        const nextUsed = sectionUsedCm(nextList);
        if (nextUsed + prodW <= secW) {
          return {...prev, [nextKey]: [...nextList, {...prod, placedId:puid()}]};
        }
      }

      // No room anywhere on this shelf
      fireToast(`No room for ${prod.name} (${prodW}cm wide) — shelf is full`);
      return prev;
    });
    setDraggingProduct(null);
  },[draggingProduct]);
  const handleRemoveProduct=useCallback((key,placedId)=>{setPlacedProducts(prev=>({...prev,[key]:(prev[key]||[]).filter(p=>p.placedId!==placedId)}));},[]);

  // ── Product double-click: fill next available slot (top-left, capacity-aware) ─
  // Reads from placedRef (always current) so rapid repeated clicks all see
  // the latest state without stale-closure problems.
  const onProductDblClick = useCallback((prod) => {
    if (shelves.length === 0) { fireToast("No shelves in the planogram yet"); return; }

    const prodW  = prod.dims?.w || 8;
    const sorted = [...shelves].sort((a, b) => a.y !== b.y ? a.y - b.y : a.x - b.x);

    let targetKey = null;
    outer:
    for (const shelf of sorted) {
      const secW = sectionWidthCm(shelf);
      for (let si = 0; si < shelfSectionCount(shelf); si++) {
        const key   = `${shelf.instanceId}_sec_${si}`;
        const usedW = sectionUsedCm(placedRef.current[key]);
        if (usedW + prodW <= secW) { targetKey = key; break outer; }
      }
    }

    if (!targetKey) { fireToast(`No room for ${prod.name} (${prodW}cm wide) — all sections full!`); return; }

    const newEntry = { ...prod, placedId: puid() };
    placedRef.current = {
      ...placedRef.current,
      [targetKey]: [...(placedRef.current[targetKey] || []), newEntry],
    };
    setPlacedProducts({ ...placedRef.current });
  }, [shelves]);
  const handleSave=({name,posId})=>{onSave({type:"planogram",name,posId,shelves,placedProducts});setShowSave(false);fireToast(`"${name}" saved!`,true);};

  const totalPlaced=Object.values(placedProducts).reduce((s,a)=>s+a.length,0);
  const pct=Math.round(zoom*100);

  return (
    <div style={SP.root}>
      {showSave&&<SaveModal type="planogram" accentGrad="linear-gradient(135deg,#1a3a5c,#2d6a9f)" onSave={handleSave} onClose={()=>setShowSave(false)}/>}
      {showOpen&&<OpenModal savedItems={savedItems} onOpen={(item)=>{onOpenSaved(item);setShowOpen(false);}} onDelete={onDeleteSaved} onClose={()=>setShowOpen(false)}/>}
      {toast&&<div style={{...M.toast,background:toast.ok?"#1b5e20":"#212121"}}>{toast.ok?"✓":"⚠️"} {toast.msg}</div>}

      <header style={SP.header}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button style={SP.backBtn} onClick={onBack}>← Back</button>
          {onGoHome && <button style={SP.backBtn} onClick={onGoHome}>⌂ Home</button>}
          <span style={{fontSize:20}}>📋</span>
          <div style={{display:"flex",flexDirection:"column",gap:1}}>
            <span style={SP.title}>Retail Management Platform</span>
            <span style={SP.featureName}>Planogram Builder</span>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={SP.statBadge}>🛒 {shelves.length} shelves</span>
          <span style={SP.statBadge}>📦 {totalPlaced} placed</span>
          <button style={SP.actionBtn} onClick={()=>setShowOpen(true)}>📂 Open</button>
          <button style={SP.actionBtn} onClick={()=>setShowSave(true)}>💾 Save</button>
          <button style={SP.clearBtn} onClick={()=>setPlacedProducts({})}>✕ Clear</button>
          <UserMenu username={username} onLogout={onLogout}/>
        </div>
      </header>

      <div style={SP.body}>
        <aside style={SP.panel}>
          <div style={SP.panelHead}><span>🥗</span> Products<span style={SP.badge}>{PRODUCTS.length}</span></div>

          {/* Search input */}
          <div style={SP.searchWrap}>
            <span style={SP.searchIcon}>🔍</span>
            <input
              style={SP.searchInput}
              type="text"
              placeholder="Search name or category…"
              value={productQuery}
              onChange={e => setProductQuery(e.target.value)}
            />
            {productQuery && (
              <button style={SP.searchClear} onClick={() => setProductQuery("")}>✕</button>
            )}
          </div>

          {/* Filter button */}
          <div ref={filterRef} style={{ position:"relative" }}>
            <button
              onClick={() => setShowFilterPopup(o => !o)}
              style={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                width:"100%", padding:"7px 12px",
                background: (filterSeasons.length||filterCampaign.length||filterTypes.length)
                  ? "linear-gradient(135deg,#1a3a5c,#2d6a9f)" : "#f5f9ff",
                color: (filterSeasons.length||filterCampaign.length||filterTypes.length)
                  ? "#fff" : "#2d6a9f",
                border:"1.5px solid #c8d8ee", borderRadius:0,
                cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:700,
                borderTop:"none", borderLeft:"none", borderRight:"none",
                borderBottom:"1px solid #dde5ee",
                transition:"all 0.15s",
              }}>
              <span>⚙ Filters</span>
              <span style={{ display:"flex", alignItems:"center", gap:5 }}>
                {(filterSeasons.length + filterCampaign.length + filterTypes.length) > 0 && (
                  <span style={{
                    background:"rgba(255,255,255,0.3)", borderRadius:10,
                    padding:"1px 6px", fontSize:10, fontWeight:800,
                  }}>
                    {filterSeasons.length + filterCampaign.length + filterTypes.length}
                  </span>
                )}
                <span style={{ fontSize:10, opacity:0.7 }}>{showFilterPopup ? "▲" : "▼"}</span>
              </span>
            </button>

            {/* Filter popup */}
            {showFilterPopup && (() => {
              const allTypes = [...new Set(PRODUCTS.map(p => p.category))].sort();
              const toggle = (arr, setArr, val) =>
                setArr(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
              const clearAll = () => { setFilterSeasons([]); setFilterCampaign([]); setFilterTypes([]); };
              const activeCount = filterSeasons.length + filterCampaign.length + filterTypes.length;

              return (
                <div style={{
                  position:"absolute", top:"100%", left:0, right:0,
                  background:"#fff", zIndex:200,
                  boxShadow:"0 8px 32px rgba(26,58,92,0.18)",
                  border:"1px solid #c8d8ee", borderTop:"none",
                }}>
                  {/* Popup header */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 12px 6px", borderBottom:"1px solid #edf2f8" }}>
                    <span style={{ fontSize:11, fontWeight:800, color:"#1a3a5c", textTransform:"uppercase", letterSpacing:"0.5px" }}>Filter Products</span>
                    {activeCount > 0 && (
                      <button onClick={clearAll} style={{ background:"none", border:"none", color:"#c0392b", fontSize:10, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                        Clear all ({activeCount})
                      </button>
                    )}
                  </div>

                  {/* Season */}
                  <div style={FP.section}>
                    <div style={FP.sectionLabel}>🌡 Season</div>
                    <div style={FP.chips}>
                      {["ALL","Summer","Winter"].map(s => (
                        <button key={s} onClick={() => toggle(filterSeasons, setFilterSeasons, s)}
                          style={{...FP.chip, background: filterSeasons.includes(s) ? "#1a3a5c" : "#f0f6ff", color: filterSeasons.includes(s) ? "#fff" : "#2d6a9f", border:`1.5px solid ${filterSeasons.includes(s) ? "#1a3a5c" : "#c8d8ee"}`}}>
                          {s === "Summer" ? "☀️ " : s === "Winter" ? "❄️ " : "🌐 "}{s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Campaign */}
                  <div style={FP.section}>
                    <div style={FP.sectionLabel}>🎯 Active Campaign</div>
                    <div style={FP.chips}>
                      {["yes","no"].map(v => (
                        <button key={v} onClick={() => toggle(filterCampaign, setFilterCampaign, v)}
                          style={{...FP.chip, background: filterCampaign.includes(v) ? (v==="yes"?"#1a6e3a":"#8b2020") : "#f0f6ff", color: filterCampaign.includes(v) ? "#fff" : "#2d6a9f", border:`1.5px solid ${filterCampaign.includes(v) ? "transparent" : "#c8d8ee"}`}}>
                          {v === "yes" ? "✅ Yes" : "❌ No"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Product type */}
                  <div style={{...FP.section, borderBottom:"none"}}>
                    <div style={FP.sectionLabel}>📦 Product Type</div>
                    <div style={{...FP.chips, flexDirection:"column", gap:2}}>
                      {allTypes.map(t => (
                        <button key={t} onClick={() => toggle(filterTypes, setFilterTypes, t)}
                          style={{...FP.chip, justifyContent:"space-between", width:"100%", background: filterTypes.includes(t) ? "#1a3a5c" : "#f0f6ff", color: filterTypes.includes(t) ? "#fff" : "#2d6a9f", border:`1.5px solid ${filterTypes.includes(t) ? "#1a3a5c" : "#c8d8ee"}`}}>
                          <span>{t}</span>
                          {filterTypes.includes(t) && <span style={{fontSize:10}}>✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Active filter chips strip */}
          {(filterSeasons.length + filterCampaign.length + filterTypes.length) > 0 && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:4, padding:"6px 8px", borderBottom:"1px solid #dde5ee", background:"#f8fbff" }}>
              {[...filterSeasons.map(s=>({label:s,onRemove:()=>setFilterSeasons(p=>p.filter(x=>x!==s))})),
                ...filterCampaign.map(v=>({label:`Campaign: ${v}`,onRemove:()=>setFilterCampaign(p=>p.filter(x=>x!==v))})),
                ...filterTypes.map(t=>({label:t,onRemove:()=>setFilterTypes(p=>p.filter(x=>x!==t))})),
              ].map((chip,i)=>(
                <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:3, background:"#1a3a5c", color:"#fff", borderRadius:10, padding:"2px 7px", fontSize:10, fontWeight:600 }}>
                  {chip.label}
                  <button onClick={chip.onRemove} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.7)", cursor:"pointer", fontSize:10, padding:0, lineHeight:1 }}>✕</button>
                </span>
              ))}
            </div>
          )}

          <div style={SP.panelList}>
            {(() => {
              const q = productQuery.trim().toLowerCase();
              let filtered = PRODUCTS;
              if (q) filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
              if (filterSeasons.length)  filtered = filtered.filter(p => filterSeasons.includes(p.season ?? "ALL"));
              if (filterCampaign.length) filtered = filtered.filter(p => filterCampaign.includes(p.campaign ? "yes" : "no"));
              if (filterTypes.length)    filtered = filtered.filter(p => filterTypes.includes(p.category));
              return filtered.length === 0
                ? <div style={SP.noResults}>No products match the current filters</div>
                : <div style={SP.productTable} role="table" aria-label="Products">
                    <div style={SP.productTableHead} role="row">
                      <span>Product</span><span>Category</span><span>Price</span><span>Size</span>
                    </div>
                    {filtered.map(prod=>(
                      <div key={prod.id} draggable role="row"
                        title="Drag to a shelf, or double-click to add to the next available space"
                        onDragStart={e=>{setDraggingProduct(prod);e.dataTransfer.effectAllowed="copy";}}
                        onDragEnd={()=>setDraggingProduct(null)}
                        onDoubleClick={()=>onProductDblClick(prod)}
                        style={{...SP.productTableRow,
                          background:draggingProduct?.id===prod.id?`${prod.color}18`:"#fff",
                          borderLeftColor:draggingProduct?.id===prod.id?prod.color:"transparent"}}>
                        <span style={SP.productTableName} role="cell"><span>{prod.emoji}</span>{prod.name}</span>
                        <span style={SP.productTableCategory} role="cell">{prod.category}</span>
                        <span style={SP.productTablePrice} role="cell">{prod.price}</span>
                        <span style={SP.productTableDims} role="cell">{prod.dims ? `${prod.dims.w}×${prod.dims.h}×${prod.dims.d}` : "—"}</span>
                      </div>
                    ))}
                  </div>;
            })()}
          </div>
        </aside>

        <main style={SP.workspace}>
          <div style={SP.toolbar}>
            <ToolToggle tool={tool} setTool={setTool} accent="#2d6a9f"/>
            <div style={{width:1,height:22,background:"#dde5ee",margin:"0 4px"}}/>
            <span style={SP.tbBadge}>{isHand?"✋ Hold & drag to pan":"💡 Click product to remove"}</span>
            {draggingProduct&&<span style={{...SP.tbBadge,background:"#fff3e0",border:"1px solid #ffcc80",color:"#bf360c"}}>✋ {draggingProduct.emoji} {draggingProduct.name}</span>}
          </div>
          <div style={{flex:1,position:"relative",overflow:"hidden"}}>
            <div ref={viewportRef} style={{...SP.viewport,cursor:isHand?"grab":"default"}}
              onMouseDown={onHandDown} onDragOver={e=>e.preventDefault()}>
              <div style={{width:WORLD_W*zoom,height:WORLD_H*zoom,position:"relative",flexShrink:0}}>
                <div style={{position:"absolute",top:0,left:0,width:WORLD_W,height:WORLD_H,transform:`scale(${zoom})`,transformOrigin:"0 0",backgroundImage:`linear-gradient(rgba(160,140,120,0.14) 1px,transparent 1px),linear-gradient(90deg,rgba(160,140,120,0.14) 1px,transparent 1px)`,backgroundSize:"40px 40px"}}>
                  {shelves.map(shelf=>(
                    <PlanogramShelfUnit key={shelf.instanceId} shelf={shelf} scale={SHELF_SCALE}
                      placedProducts={placedProducts} draggingProduct={draggingProduct}
                      onDropProduct={handleDropProduct} onRemoveProduct={handleRemoveProduct}/>
                  ))}
                </div>
              </div>
            </div>
            <div style={SP.floatZoom}>
              <button style={SP.zBtnLg} onClick={()=>applyZoom(zoomRef.current+ZOOM_STEP)}>＋</button>
              <button style={SP.zPct}   onClick={()=>applyZoom(ZOOM_DEFAULT)}>{pct}%</button>
              <button style={SP.zBtnLg} onClick={()=>applyZoom(zoomRef.current-ZOOM_STEP)}>−</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ── Main ShelvesBuilder ───────────────────────────────────────────────────────
function ShelvesBuilder({ username, onLogout, initialPage = "builder", onGoHome }) {
  const [catalog,setCatalog]   = useState(PRESETS);
  const [items,setItems]       = useState([]);
  const [selected,setSelected] = useState(null);
  const [draggingPanel,setDraggingPanel] = useState(null);
  const [draggingId,setDraggingId]       = useState(null);
  const [zoom,setZoom]         = useState(ZOOM_DEFAULT);
  const [tool,setTool]         = useState("pointer");
  const [showAddModal,setShowAddModal] = useState(false);
  const [catalogTab,   setCatalogTab]   = useState("shelves"); // "shelves" | "fixtures"
  const [shelfSubTab,  setShelfSubTab]  = useState("standard"); // "standard" | "hooks"
  const [catalogQuery, setCatalogQuery] = useState("");
  const [form,setForm]         = useState({label:"",width:200,height:300,sections:4,sectionPcts:equalPcts(4)});
  const [hookForm,setHookForm] = useState({label:"",width:200,height:300,hookRows:6,hookCols:8,hookSpacing:4,hookRowPcts:equalPcts(6)});
  const [addTab,setAddTab]     = useState("shelf"); // "shelf" | "hook"
  const [formError,setFormError] = useState("");
  const [showSave,setShowSave] = useState(false);
  const [showOpen,setShowOpen] = useState(false);
  const [savedItems,setSavedItems] = useState([]);
  const [dbReady,setDbReady]       = useState(false);

  // ── DB: load all saved items on mount ────────────────────────────────────────
  useEffect(()=>{
    (async()=>{
      try {
        const result = await window.storage.list("layout:");
        const keys   = result?.keys || [];
        const loaded = await Promise.all(
          keys.map(async k => {
            try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : null; }
            catch { return null; }
          })
        );
        setSavedItems(loaded.filter(Boolean).sort((a,b)=>b.savedAt?.localeCompare?.(a.savedAt)||0));
      } catch(e) { console.warn("DB load failed", e); }
      setDbReady(true);
    })();
  },[]);
  const [page,setPage]         = useState(initialPage);
  const [planogramShelves,setPlanogramShelves] = useState([]);
  const [toast,setToast]       = useState(null);

  const viewportRef = useRef(null);
  const zoomRef     = useRef(ZOOM_DEFAULT);
  const dragOffset  = useRef({x:0,y:0});
  const toastTimer  = useRef(null);
  useEffect(()=>{zoomRef.current=zoom;},[zoom]);

  const isHand = tool==="hand";
  const fireToast=(msg,ok=false)=>{setToast({msg,ok});clearTimeout(toastTimer.current);toastTimer.current=setTimeout(()=>setToast(null),3000);};
  const {onMouseDown:onHandDown} = useHandPan(viewportRef,isHand);

  const applyZoom=useCallback((newRaw)=>{
    const el=viewportRef.current;if(!el)return;
    const oldZ=zoomRef.current,newZ=Math.min(ZOOM_MAX,Math.max(ZOOM_MIN,+newRaw.toFixed(3)));
    if(newZ===oldZ)return;
    const cx=el.scrollLeft+el.clientWidth/2,cy=el.scrollTop+el.clientHeight/2;
    setZoom(newZ);
    requestAnimationFrame(()=>{if(!viewportRef.current)return;viewportRef.current.scrollLeft=(cx/oldZ)*newZ-viewportRef.current.clientWidth/2;viewportRef.current.scrollTop=(cy/oldZ)*newZ-viewportRef.current.clientHeight/2;});
  },[]);

  const s2w=useCallback((cx,cy)=>{const el=viewportRef.current,rect=el.getBoundingClientRect();return{x:(el.scrollLeft+cx-rect.left)/zoomRef.current,y:(el.scrollTop+cy-rect.top)/zoomRef.current};},[]);

  // ── Collision detection ───────────────────────────────────────────────────────
  const SNAP_DIST = 18; // px — how close before edge-snap kicks in
  const OVERLAP_TOL = 4; // px — pieces may overlap this much (pixel rounding), but not more

  const getItemRect = (it) => {
    const w = it.isFurnishing ? it.fw : it.width  * SHELF_SCALE;
    const h = it.isFurnishing ? it.fh : it.height * SHELF_SCALE;
    return { x:it.x, y:it.y, w, h };
  };

  // True overlap: only block if one rect actually penetrates the other beyond tolerance
  const rectsOverlap = (a, b) => !(
    a.x + a.w - OVERLAP_TOL <= b.x ||
    b.x + b.w - OVERLAP_TOL <= a.x ||
    a.y + a.h - OVERLAP_TOL <= b.y ||
    b.y + b.h - OVERLAP_TOL <= a.y
  );

  // On new-item placement: only push away if truly overlapping (not touching)
  const findFreePosition = useCallback((newW, newH, preferX, preferY, existingItems) => {
    const fits = (x, y) => {
      const candidate = {x, y, w:newW, h:newH};
      return !existingItems.some(it => rectsOverlap(candidate, getItemRect(it)));
    };
    if (fits(preferX, preferY)) return {x: preferX, y: preferY};
    for (let step = 20; step <= 1200; step += 20) {
      const cands = [];
      for (let dx = -step; dx <= step; dx += 20) cands.push({x:preferX+dx,y:preferY-step},{x:preferX+dx,y:preferY+step});
      for (let dy = -step+20; dy < step; dy += 20) cands.push({x:preferX-step,y:preferY+dy},{x:preferX+step,y:preferY+dy});
      for (const c of cands) {
        if (c.x >= 0 && c.y >= 0 && fits(c.x, c.y)) return {x:Math.round(c.x), y:Math.round(c.y)};
      }
    }
    return {x: preferX, y: preferY};
  }, []);

  // Edge-snap: given a dragged rect (x,y,w,h), check all other items and snap to nearest edge
  const applyEdgeSnap = useCallback((x, y, w, h, others) => {
    let bestX = x, bestY = y, dxBest = SNAP_DIST + 1, dyBest = SNAP_DIST + 1;
    for (const it of others) {
      const r = getItemRect(it);
      // Only snap edges that are "close" on the perpendicular axis too (they must roughly align)
      const xOverlap = x < r.x + r.w + SNAP_DIST && x + w > r.x - SNAP_DIST;
      const yOverlap = y < r.y + r.h + SNAP_DIST && y + h > r.y - SNAP_DIST;

      if (yOverlap) {
        // Snap right edge of dragged → left edge of target
        const d1 = Math.abs((x + w) - r.x);
        if (d1 < SNAP_DIST && d1 < dxBest) { dxBest = d1; bestX = r.x - w; }
        // Snap left edge of dragged → right edge of target
        const d2 = Math.abs(x - (r.x + r.w));
        if (d2 < SNAP_DIST && d2 < dxBest) { dxBest = d2; bestX = r.x + r.w; }
        // Snap left edges aligned
        const d3 = Math.abs(x - r.x);
        if (d3 < SNAP_DIST && d3 < dxBest) { dxBest = d3; bestX = r.x; }
        // Snap right edges aligned
        const d4 = Math.abs((x + w) - (r.x + r.w));
        if (d4 < SNAP_DIST && d4 < dxBest) { dxBest = d4; bestX = r.x + r.w - w; }
      }
      if (xOverlap) {
        // Snap bottom edge of dragged → top edge of target
        const d1 = Math.abs((y + h) - r.y);
        if (d1 < SNAP_DIST && d1 < dyBest) { dyBest = d1; bestY = r.y - h; }
        // Snap top edge of dragged → bottom edge of target
        const d2 = Math.abs(y - (r.y + r.h));
        if (d2 < SNAP_DIST && d2 < dyBest) { dyBest = d2; bestY = r.y + r.h; }
        // Snap top edges aligned
        const d3 = Math.abs(y - r.y);
        if (d3 < SNAP_DIST && d3 < dyBest) { dyBest = d3; bestY = r.y; }
        // Snap bottom edges aligned
        const d4 = Math.abs((y + h) - (r.y + r.h));
        if (d4 < SNAP_DIST && d4 < dyBest) { dyBest = d4; bestY = r.y + r.h - h; }
      }
    }
    return { x: bestX, y: bestY };
  }, []);

  const addItem = useCallback((item, px, py) => {
    const w = item.width  * SHELF_SCALE;
    const h = item.height * SHELF_SCALE;
    setItems(prev => {
      const {x,y} = findFreePosition(w, h, px, py, prev);
      return [...prev, {...item, instanceId:uid(), x, y}];
    });
  }, [findFreePosition]);

  const addFurnishing = useCallback((furn, px, py) => {
    const fw = furn.kind==="sign" ? 90 : (furn.orient==="horizontal" ? Math.min(furn.w * 0.8, 220) : furn.w * 1.8);
    const fh = furn.kind==="sign" ? 36 : (furn.orient==="vertical"   ? Math.min(furn.h * 0.8, 220) : furn.h * 1.8);
    setItems(prev => {
      const {x,y} = findFreePosition(fw, fh, px, py, prev);
      return [...prev, {...furn, instanceId:uid(), isFurnishing:true, fw, fh, x, y}];
    });
  }, [findFreePosition]);

  // Wrap setItems used in drag-move to also enforce collision on drop
  const onPanelDragStart=(e,item)=>{setDraggingPanel({...item, _type:"shelf"});e.dataTransfer.effectAllowed="copy";};
  const onFurnDragStart=(e,furn)=>{setDraggingPanel({...furn, _type:"furn"});e.dataTransfer.effectAllowed="copy";};
  const onViewportDragOver=(e)=>{e.preventDefault();e.dataTransfer.dropEffect="copy";};
  const onViewportDrop=(e)=>{
    e.preventDefault();
    if(!draggingPanel) return;
    const wp=s2w(e.clientX,e.clientY);
    if(draggingPanel._type==="furn"){
      addFurnishing(draggingPanel, wp.x, wp.y);
    } else {
      addItem(draggingPanel, wp.x-(draggingPanel.width*SHELF_SCALE)/2, wp.y-(draggingPanel.height*SHELF_SCALE)/2);
    }
    setDraggingPanel(null);
  };
  const onPanelDblClick=(item)=>{
    if(items.length===0){ addItem(item,80,80); return; }
    let maxRight=-Infinity, alignY=80;
    items.forEach(it=>{ const right=it.x+(it.isFurnishing?it.fw:it.width*SHELF_SCALE); if(right>maxRight){maxRight=right;alignY=it.y;} });
    addItem(item, maxRight+20, alignY);
  };
  const onFurnDblClick=(furn)=>{
    const fw = furn.kind==="sign" ? 90 : (furn.orient==="horizontal" ? Math.min(furn.w*0.8,220) : furn.w*1.8);
    const fh = furn.kind==="sign" ? 36  : (furn.orient==="vertical"  ? Math.min(furn.h*0.8,220) : furn.h*1.8);
    if(items.length===0){ addFurnishing(furn,80,80); return; }
    let maxRight=-Infinity, alignY=80;
    items.forEach(it=>{ const right=it.x+(it.isFurnishing?it.fw:it.width*SHELF_SCALE); if(right>maxRight){maxRight=right;alignY=it.y;} });
    addFurnishing(furn, maxRight+20, alignY);
  };

  const onItemMouseDown=(e,inst)=>{if(isHand)return;e.stopPropagation();if(e.button!==0)return;setSelected(inst.instanceId);const wp=s2w(e.clientX,e.clientY);dragOffset.current={x:wp.x-inst.x,y:wp.y-inst.y};setDraggingId(inst.instanceId);};
  useEffect(()=>{
    const mv=(e)=>{
      if(!draggingId)return;
      const wp=s2w(e.clientX,e.clientY);
      setItems(prev=>{
        const idx=prev.findIndex(it=>it.instanceId===draggingId);
        if(idx===-1)return prev;
        const it=prev[idx];
        const rawX=wp.x-dragOffset.current.x, rawY=wp.y-dragOffset.current.y;
        const w=it.isFurnishing?it.fw:it.width*SHELF_SCALE;
        const h=it.isFurnishing?it.fh:it.height*SHELF_SCALE;
        const others=prev.filter((_,i)=>i!==idx);
        const {x,y}=applyEdgeSnap(rawX,rawY,w,h,others);
        const next=[...prev];next[idx]={...it,x,y};return next;
      });
    };
    const up=()=>{
      if(draggingId){
        // On release: if still overlapping (shouldn't happen with snap but just in case), push free
        setItems(prev=>{
          const idx=prev.findIndex(it=>it.instanceId===draggingId);
          if(idx===-1)return prev;
          const it=prev[idx];
          const others=prev.filter((_,i)=>i!==idx);
          const w=it.isFurnishing?it.fw:it.width*SHELF_SCALE;
          const h=it.isFurnishing?it.fh:it.height*SHELF_SCALE;
          if(!others.some(o=>rectsOverlap({x:it.x,y:it.y,w,h},getItemRect(o))))return prev;
          const {x,y}=findFreePosition(w,h,it.x,it.y,others);
          const next=[...prev];next[idx]={...it,x,y};return next;
        });
      }
      setDraggingId(null);
    };
    window.addEventListener("mousemove",mv);window.addEventListener("mouseup",up);
    return()=>{window.removeEventListener("mousemove",mv);window.removeEventListener("mouseup",up);};
  },[draggingId,s2w,applyEdgeSnap,findFreePosition]);

  useEffect(()=>{const k=(e)=>{if((e.key==="Delete"||e.key==="Backspace")&&selected){setItems(p=>p.filter(i=>i.instanceId!==selected));setSelected(null);}};window.addEventListener("keydown",k);return()=>window.removeEventListener("keydown",k);},[selected]);

  const handleCreatePlanogram=()=>{if(items.length===0){fireToast("You need to put furnishings first");return;}setPlanogramShelves([...items]);setPage("planogram");};

  const nowStr=()=>{const n=new Date();return n.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})+" "+n.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});};

  const persistSave = async (record) => {
    const key = `layout:${record.id}`;
    try { await window.storage.set(key, JSON.stringify(record)); } catch(e) { console.warn("DB write failed",e); }
    setSavedItems(prev=>[record,...prev.filter(s=>s.id!==record.id)]);
  };

  const handleSaveShelves=({name,posId})=>{
    const record={id:suid(),type:"shelves",name,posId,items,savedAt:nowStr()};
    persistSave(record);
    setShowSave(false);
    fireToast(`"${name}" saved!`,true);
  };
  const handleSavePlanogram=({type,name,posId,shelves,placedProducts})=>{
    const record={id:suid(),type:"planogram",name,posId,shelves,placedProducts,savedAt:nowStr()};
    persistSave(record);
  };
  const handleOpenSaved=(item)=>{if(item.type==="shelves"){setItems(item.items||[]);setPage("builder");}else{setPlanogramShelves(item.shelves||[]);setPage("planogram");}setShowOpen(false);};
  const handleDeleteSaved=async(id)=>{
    try { await window.storage.delete(`layout:${id}`); } catch(e) { console.warn("DB delete failed",e); }
    setSavedItems(prev=>prev.filter(s=>s.id!==id));
  };

  const handleSubmit=()=>{
    if(addTab==="hook"){
      if(!hookForm.label.trim()){setFormError("Please enter a name.");return;}
      if(hookForm.width<50||hookForm.width>600){setFormError("Width must be 50–600 cm.");return;}
      if(hookForm.height<50||hookForm.height>500){setFormError("Height must be 50–500 cm.");return;}
      if(hookForm.hookRows<1||hookForm.hookRows>20){setFormError("Hook rows must be 1–20.");return;}
      if(hookForm.hookCols<1||hookForm.hookCols>20){setFormError("Hook columns must be 1–20.");return;}
      if(hookForm.hookSpacing<1||hookForm.hookSpacing>20){setFormError("Hook spacing must be 1–20 cm.");return;}
      const pctSum=hookForm.hookRowPcts.reduce((a,b)=>a+b,0);
      if(pctSum!==100){setFormError(`Row percentages must sum to 100% (currently ${pctSum}%).`);return;}
      const n={id:uid(),label:hookForm.label.trim(),width:+hookForm.width,height:+hookForm.height,sections:0,kind:"hook",hookRows:+hookForm.hookRows,hookCols:+hookForm.hookCols,hookSpacing:+hookForm.hookSpacing,hookRowPcts:hookForm.hookRowPcts};
      setCatalog(p=>[...p,n]);addItem(n,120,100);setShowAddModal(false);
      setHookForm({label:"",width:200,height:300,hookRows:6,hookCols:8,hookSpacing:4,hookRowPcts:equalPcts(6)});setFormError("");
    } else {
      if(!form.label.trim()){setFormError("Please enter a shelf name.");return;}
      if(form.width<50||form.width>600){setFormError("Width must be 50–600 cm.");return;}
      if(form.height<50||form.height>500){setFormError("Height must be 50–500 cm.");return;}
      if(form.sections<1||form.sections>12){setFormError("Sections must be 1–12.");return;}
      const pctSum=form.sectionPcts.reduce((a,b)=>a+b,0);
      if(pctSum!==100){setFormError(`Section percentages must sum to 100% (currently ${pctSum}%).`);return;}
      const n={id:uid(),label:form.label.trim(),width:+form.width,height:+form.height,sections:+form.sections,sectionPcts:form.sectionPcts};
      setCatalog(p=>[...p,n]);addItem(n,120,100);setShowAddModal(false);
      setForm({label:"",width:200,height:300,sections:4,sectionPcts:equalPcts(4)});setFormError("");
    }
  };

  if(page==="planogram"){
    return <PlanogramPage shelves={planogramShelves} onBack={()=>setPage("builder")} onSave={handleSavePlanogram} savedItems={savedItems} onOpenSaved={handleOpenSaved} onDeleteSaved={handleDeleteSaved} username={username} onLogout={onLogout} onGoHome={onGoHome}/>;
  }

  const pct=Math.round(zoom*100);
  const inp={width:"100%",padding:"8px 12px",border:"1.5px solid #e0d4c4",borderRadius:8,fontSize:14,fontFamily:"inherit",background:"#fdf9f5",outline:"none",color:"#3d2b1a",boxSizing:"border-box"};

  return (
    <div style={S.root}>
      {showSave&&<SaveModal type="shelves" accentGrad="linear-gradient(135deg,#e65c00,#f9a825)" onSave={handleSaveShelves} onClose={()=>setShowSave(false)}/>}
      {showOpen&&<OpenModal savedItems={savedItems} onOpen={handleOpenSaved} onDelete={handleDeleteSaved} onClose={()=>setShowOpen(false)}/>}
      {showAddModal&&(
        <div style={M.overlay} onClick={()=>setShowAddModal(false)}>
          <div style={{...M.box,width:520}} onClick={e=>e.stopPropagation()}>
            <div style={{...M.head,background:"linear-gradient(135deg,#e65c00,#f9a825)"}}>
              <span>🆕 Create Custom Shelf</span>
              <button style={M.closeBtn} onClick={()=>setShowAddModal(false)}>✕</button>
            </div>

            {/* Tab bar */}
            <div style={{display:"flex",borderBottom:"2px solid #f0e8dc",background:"#fdf9f5"}}>
              {[{id:"shelf",label:"📦 Shelf"},{id:"hook",label:"🪝 Hooks"}].map(t=>(
                <button key={t.id} onClick={()=>{setAddTab(t.id);setFormError("");}}
                  style={{flex:1,padding:"10px 0",fontWeight:700,fontSize:13,border:"none",cursor:"pointer",
                    fontFamily:"inherit",background:addTab===t.id?"#fff":"#fdf9f5",
                    color:addTab===t.id?"#e65c00":"#a09080",
                    borderBottom:addTab===t.id?"2px solid #e65c00":"2px solid transparent",marginBottom:-2}}>
                  {t.label}
                </button>
              ))}
            </div>

            {addTab==="shelf" && (
              <div style={{...M.body,flexDirection:"row",gap:20,maxHeight:"65vh",overflowY:"auto"}}>
                <div style={{width:130,flexShrink:0,background:"#faf7f2",borderRadius:10,border:"1.5px solid #e8ddd0",display:"flex",alignItems:"center",justifyContent:"center",minHeight:140}}>
                  <ShelfSVG width={form.width||200} height={form.height||300} sections={form.sections||4} scale={Math.min(0.55,160/Math.max(form.height||300,form.width||200))}/>
                </div>
                <div style={{flex:1,display:"flex",flexDirection:"column",gap:10}}>
                  <div><label style={M.label}>Shelf Name</label><input style={inp} placeholder="e.g. Cereal Gondola" value={form.label} onChange={e=>setForm(f=>({...f,label:e.target.value}))}/></div>
                  <div style={{display:"flex",gap:12}}>
                    <div style={{flex:1}}><label style={M.label}>Width (cm)</label><input style={inp} type="number" min={50} max={600} value={form.width} onChange={e=>setForm(f=>({...f,width:+e.target.value}))}/></div>
                    <div style={{flex:1}}><label style={M.label}>Height (cm)</label><input style={inp} type="number" min={50} max={500} value={form.height} onChange={e=>setForm(f=>({...f,height:+e.target.value}))}/></div>
                  </div>
                  <div><label style={M.label}>Sections</label>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {[1,2,3,4,5,6,8,10,12].map(n=>(
                        <button key={n} onClick={()=>setForm(f=>({...f,sections:n,sectionPcts:equalPcts(n)}))} style={{width:36,height:32,border:"1.5px solid",borderRadius:6,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit",background:form.sections===n?"#ff6d00":"#f0ebe3",color:form.sections===n?"#fff":"#5a3e2b",borderColor:form.sections===n?"#e65c00":"#d4c4b0"}}>{n}</button>
                      ))}
                    </div>
                  </div>
                  {/* Section height % editor */}
                  {form.sections > 0 && (()=>{
                    const total = form.sectionPcts.reduce((a,b)=>a+b,0);
                    const remaining = 100 - total;
                    return (
                      <div>
                        <label style={M.label}>Section Heights (%)</label>
                        <div style={{display:"flex",flexDirection:"column",gap:5}}>
                          {form.sectionPcts.map((pct,si)=>(
                            <div key={si} style={{display:"flex",alignItems:"center",gap:8}}>
                              <span style={{fontSize:11,fontWeight:700,color:"#8a6a50",width:20,flexShrink:0,textAlign:"right"}}>S{si+1}</span>
                              <div style={{flex:1,height:6,background:"#f0e8dc",borderRadius:3,overflow:"hidden"}}>
                                <div style={{width:`${pct}%`,height:"100%",background:remaining===0?"#2a9d8f":"#e65c00",borderRadius:3,transition:"width 0.15s"}}/>
                              </div>
                              <input type="number" min={1} max={98} value={pct}
                                onChange={e=>{
                                  const val=Math.max(1,Math.min(98,+e.target.value));
                                  setForm(f=>{
                                    const p=[...f.sectionPcts]; p[si]=val; return {...f,sectionPcts:p};
                                  });
                                }}
                                style={{width:48,padding:"3px 6px",border:"1.5px solid #e0d4c4",borderRadius:6,fontSize:12,fontFamily:"inherit",background:"#fdf9f5",color:"#3d2b1a",outline:"none",textAlign:"center"}}/>
                              <span style={{fontSize:11,color:"#a09080",width:14,flexShrink:0}}>%</span>
                            </div>
                          ))}
                          <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",gap:6,marginTop:2}}>
                            <span style={{fontSize:11,fontWeight:700,color:remaining===0?"#2a9d8f":remaining<0?"#e53935":"#e65c00"}}>
                              Total: {total}% {remaining===0?"✓":remaining>0?`(${remaining}% remaining)`:`(${Math.abs(remaining)}% over!)`}
                            </span>
                            <button onClick={()=>setForm(f=>({...f,sectionPcts:equalPcts(f.sections)}))}
                              style={{fontSize:10,padding:"2px 8px",border:"1px solid #d4c4b0",borderRadius:5,cursor:"pointer",background:"#f0ebe3",color:"#5a3e2b",fontFamily:"inherit",fontWeight:600}}>
                              Reset equal
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                  {formError&&<div style={M.err}>{formError}</div>}
                </div>
              </div>
            )}

            {addTab==="hook" && (
              <div style={{...M.body,flexDirection:"row",gap:20,maxHeight:"65vh",overflowY:"auto"}}>
                <div style={{width:130,flexShrink:0,background:"#faf7f2",borderRadius:10,border:"1.5px solid #e8ddd0",display:"flex",alignItems:"center",justifyContent:"center",minHeight:140}}>
                  <HookSVG width={hookForm.width||200} height={hookForm.height||300} hookRows={hookForm.hookRows||6} hookCols={hookForm.hookCols||8} hookSpacing={hookForm.hookSpacing||4} scale={Math.min(0.55,160/Math.max(hookForm.height||300,hookForm.width||200))}/>
                </div>
                <div style={{flex:1,display:"flex",flexDirection:"column",gap:10}}>
                  <div><label style={M.label}>Name</label><input style={inp} placeholder="e.g. Cartridge Hook Board" value={hookForm.label} onChange={e=>setHookForm(f=>({...f,label:e.target.value}))}/></div>
                  <div style={{display:"flex",gap:12}}>
                    <div style={{flex:1}}><label style={M.label}>Width (cm)</label><input style={inp} type="number" min={50} max={600} value={hookForm.width} onChange={e=>setHookForm(f=>({...f,width:+e.target.value}))}/></div>
                    <div style={{flex:1}}><label style={M.label}>Height (cm)</label><input style={inp} type="number" min={50} max={500} value={hookForm.height} onChange={e=>setHookForm(f=>({...f,height:+e.target.value}))}/></div>
                  </div>
                  <div style={{display:"flex",gap:12}}>
                    <div style={{flex:1}}>
                      <label style={M.label}>Hook Rows</label>
                      <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                        {[2,4,6,8,10,12].map(n=>(
                          <button key={n} onClick={()=>setHookForm(f=>({...f,hookRows:n,hookRowPcts:equalPcts(n)}))} style={{width:36,height:30,border:"1.5px solid",borderRadius:6,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit",background:hookForm.hookRows===n?"#ff6d00":"#f0ebe3",color:hookForm.hookRows===n?"#fff":"#5a3e2b",borderColor:hookForm.hookRows===n?"#e65c00":"#d4c4b0"}}>{n}</button>
                        ))}
                      </div>
                    </div>
                    <div style={{flex:1}}>
                      <label style={M.label}>Hook Columns</label>
                      <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                        {[4,6,8,10,12].map(n=>(
                          <button key={n} onClick={()=>setHookForm(f=>({...f,hookCols:n}))} style={{width:36,height:30,border:"1.5px solid",borderRadius:6,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit",background:hookForm.hookCols===n?"#ff6d00":"#f0ebe3",color:hookForm.hookCols===n?"#fff":"#5a3e2b",borderColor:hookForm.hookCols===n?"#e65c00":"#d4c4b0"}}>{n}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label style={M.label}>Space Between Hooks (cm)</label>
                    <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                      {[2,3,4,5,6,8].map(n=>(
                        <button key={n} onClick={()=>setHookForm(f=>({...f,hookSpacing:n}))} style={{width:40,height:30,border:"1.5px solid",borderRadius:6,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit",background:hookForm.hookSpacing===n?"#ff6d00":"#f0ebe3",color:hookForm.hookSpacing===n?"#fff":"#5a3e2b",borderColor:hookForm.hookSpacing===n?"#e65c00":"#d4c4b0"}}>{n}</button>
                      ))}
                    </div>
                  </div>
                  {/* Hook row height % editor */}
                  {hookForm.hookRows > 0 && (()=>{
                    const total = hookForm.hookRowPcts.reduce((a,b)=>a+b,0);
                    const remaining = 100 - total;
                    return (
                      <div>
                        <label style={M.label}>Row Heights (%)</label>
                        <div style={{display:"flex",flexDirection:"column",gap:5}}>
                          {hookForm.hookRowPcts.map((pct,ri)=>(
                            <div key={ri} style={{display:"flex",alignItems:"center",gap:8}}>
                              <span style={{fontSize:11,fontWeight:700,color:"#8a6a50",width:20,flexShrink:0,textAlign:"right"}}>R{ri+1}</span>
                              <div style={{flex:1,height:6,background:"#f0e8dc",borderRadius:3,overflow:"hidden"}}>
                                <div style={{width:`${pct}%`,height:"100%",background:remaining===0?"#2a9d8f":"#e65c00",borderRadius:3,transition:"width 0.15s"}}/>
                              </div>
                              <input type="number" min={1} max={98} value={pct}
                                onChange={e=>{
                                  const val=Math.max(1,Math.min(98,+e.target.value));
                                  setHookForm(f=>{const p=[...f.hookRowPcts];p[ri]=val;return{...f,hookRowPcts:p};});
                                }}
                                style={{width:48,padding:"3px 6px",border:"1.5px solid #e0d4c4",borderRadius:6,fontSize:12,fontFamily:"inherit",background:"#fdf9f5",color:"#3d2b1a",outline:"none",textAlign:"center"}}/>
                              <span style={{fontSize:11,color:"#a09080",width:14,flexShrink:0}}>%</span>
                            </div>
                          ))}
                          <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",gap:6,marginTop:2}}>
                            <span style={{fontSize:11,fontWeight:700,color:remaining===0?"#2a9d8f":remaining<0?"#e53935":"#e65c00"}}>
                              Total: {total}% {remaining===0?"✓":remaining>0?`(${remaining}% remaining)`:`(${Math.abs(remaining)}% over!)`}
                            </span>
                            <button onClick={()=>setHookForm(f=>({...f,hookRowPcts:equalPcts(f.hookRows)}))}
                              style={{fontSize:10,padding:"2px 8px",border:"1px solid #d4c4b0",borderRadius:5,cursor:"pointer",background:"#f0ebe3",color:"#5a3e2b",fontFamily:"inherit",fontWeight:600}}>
                              Reset equal
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                  {formError&&<div style={M.err}>{formError}</div>}
                </div>
              </div>
            )}

            <div style={M.foot}>
              <button style={M.cancelBtn} onClick={()=>{setShowAddModal(false);setFormError("");}}>Cancel</button>
              <button style={{...M.saveBtn,background:"linear-gradient(135deg,#e65c00,#f9a825)"}} onClick={handleSubmit}>
                {addTab==="hook"?"🪝 Add Hook Board":"✓ Add to Canvas"}
              </button>
            </div>
          </div>
        </div>
      )}
      {toast&&<div style={{...M.toast,background:toast.ok?"#1b5e20":"#212121"}}>{toast.ok?"✓":"⚠️"} {toast.msg}</div>}

      <header style={S.header}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:22}}>🛒</span>
          <div style={{display:"flex",flexDirection:"column",gap:1}}>
            <span style={S.title}>Retail Management Platform</span>
            <span style={S.featureName}>Shelves Builder</span>
          </div>
          <span style={{...S.subtitle, borderLeft:"none", paddingLeft:8, fontSize:10, color: dbReady ? "rgba(255,255,255,0.6)" : "rgba(255,255,220,0.7)"}}>
            {dbReady ? `🗄 DB · ${savedItems.length} saved` : "⏳ Loading DB…"}
          </span>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {onGoHome && <button style={S.btnHome} onClick={onGoHome} title="Back to Home">⌂ Home</button>}
          <button style={S.btnAdd} onClick={()=>setShowAddModal(true)}><span style={{fontSize:16,marginRight:4}}>＋</span>Add Shelf</button>
          <button style={S.btnPlanogram} onClick={handleCreatePlanogram}><span style={{fontSize:14,marginRight:5}}>📋</span>Create Planogram</button>
          <button style={S.btnGhost} onClick={()=>setShowOpen(true)}>📂 Open</button>
          <button style={S.btnGhost} onClick={()=>setShowSave(true)}>💾 Save</button>
          <button style={S.btnGhost} onClick={()=>{setItems([]);setSelected(null);}}>✕ Clear</button>
          <UserMenu username={username} onLogout={onLogout}/>
        </div>
      </header>

      <div style={S.body}>
        <aside style={S.panel}>
          {/* Tab bar */}
          <div style={{display:"flex",borderBottom:"2px solid #f0e8dc",flexShrink:0}}>
            {[{id:"shelves",label:"Shelves"},{id:"fixtures",label:"Fixtures"}].map(t=>(
              <button key={t.id} onClick={()=>{ setCatalogTab(t.id); setCatalogQuery(""); }}
                style={{flex:1,padding:"9px 0",fontWeight:700,fontSize:12,border:"none",cursor:"pointer",
                  fontFamily:"inherit",letterSpacing:"0.3px",transition:"all 0.15s",
                  background: catalogTab===t.id ? "#fff" : "#fdf8f3",
                  color:      catalogTab===t.id ? "#e65c00" : "#a09080",
                  borderBottom: catalogTab===t.id ? "2px solid #e65c00" : "2px solid transparent",
                  marginBottom: -2,
                }}>
                {t.label}
              </button>
            ))}
          </div>

          {catalogTab === "shelves" && (<>
            {/* Sub-tab bar */}
            <div style={{display:"flex",borderBottom:"1px solid #f0e8dc",background:"#faf7f2",flexShrink:0}}>
              {[{id:"standard",label:"📦 Standard"},{id:"hooks",label:"🪝 Hooks"}].map(t=>(
                <button key={t.id} onClick={()=>{setShelfSubTab(t.id);setCatalogQuery("");}}
                  style={{flex:1,padding:"7px 0",fontWeight:700,fontSize:11,border:"none",cursor:"pointer",
                    fontFamily:"inherit",background:shelfSubTab===t.id?"#fff":"#faf7f2",
                    color:shelfSubTab===t.id?"#e65c00":"#b09a86",
                    borderBottom:shelfSubTab===t.id?"2px solid #e65c00":"2px solid transparent",marginBottom:-1}}>
                  {t.label}
                </button>
              ))}
            </div>
            <div style={S.searchWrap}>
              <span style={S.searchIcon}>🔍</span>
              <input style={S.searchInput} type="text"
                placeholder={shelfSubTab==="hooks" ? "Search hooks…" : "Search shelves…"}
                value={catalogQuery} onChange={e=>setCatalogQuery(e.target.value)}/>
              {catalogQuery && <button style={S.searchClear} onClick={()=>setCatalogQuery("")}>✕</button>}
            </div>
            <div style={S.panelList}>
              {(()=>{
                const q = catalogQuery.trim().toLowerCase();
                const pool = catalog.filter(item => shelfSubTab==="hooks" ? item.kind==="hook" : item.kind!=="hook");
                const filtered = q ? pool.filter(item=>item.label.toLowerCase().includes(q)) : pool;
                const emptyMsg = shelfSubTab==="hooks" ? "No hook boards yet — create one with Add Shelf" : "No shelves match";
                return filtered.length === 0
                  ? <div style={S.noResults}>{emptyMsg}{q ? ` "${catalogQuery}"` : ""}</div>
                  : filtered.map(item=>(
                      <div key={item.id} style={S.card} draggable
                        onDragStart={e=>onPanelDragStart(e,item)}
                        onDoubleClick={()=>onPanelDblClick(item)}>
                        <div style={{display:"flex",justifyContent:"center",marginBottom:6}}>
                          <ShelfOrHook item={item} scale={PANEL_SCALE}/>
                        </div>
                        <div style={S.cardLabel}>{item.label}</div>
                        <div style={S.cardMeta}>
                          {item.kind==="hook"
                            ? `${item.width}×${item.height}cm · ${item.hookRows}×${item.hookCols} hooks`
                            : `${item.width}×${item.height}cm · ${item.sections}sec`}
                        </div>
                      </div>
                    ));
              })()}
            </div>
          </>)}

          {catalogTab === "fixtures" && (<>
            <div style={S.panelHead}><span>🔩</span> Fixtures<span style={S.badge}>{FURNISHINGS.length}</span></div>
            <div style={S.searchWrap}>
              <span style={S.searchIcon}>🔍</span>
              <input style={S.searchInput} type="text" placeholder="Search fixtures…"
                value={catalogQuery} onChange={e => setCatalogQuery(e.target.value)}/>
              {catalogQuery && <button style={S.searchClear} onClick={() => setCatalogQuery("")}>✕</button>}
            </div>
            <div style={S.panelList}>
              {(()=>{
                const q = catalogQuery.trim().toLowerCase();
                const items = q ? FURNISHINGS.filter(f=>f.label.toLowerCase().includes(q)||f.kind.toLowerCase().includes(q)) : FURNISHINGS;
                if (items.length === 0) return <div style={S.noResults}>No fixtures match "{catalogQuery}"</div>;
                // Group by kind
                const pieces = items.filter(f=>f.kind==="piece");
                const signs  = items.filter(f=>f.kind==="sign");
                return (<>
                  {pieces.length > 0 && <>
                    <div style={S.fixtureGroup}>Structural Pieces</div>
                    {pieces.map(f=>(
                      <div key={f.id} style={S.card} draggable
                        onDragStart={e=>onFurnDragStart(e,f)}
                        onDoubleClick={()=>onFurnDblClick(f)}>
                        <div style={{display:"flex",justifyContent:"center",alignItems:"center",marginBottom:6,height:40}}>
                          <div style={{
                            width:  Math.round((f.orient==="horizontal" ? Math.min(f.w,160) : f.w) * 0.55),
                            height: Math.round((f.orient==="vertical"   ? Math.min(f.h,80)  : f.h) * 0.55),
                            background: `linear-gradient(135deg,${f.color}cc,${f.color})`,
                            borderRadius: 3,
                            boxShadow:`0 2px 6px ${f.color}66`,
                            minWidth:4, minHeight:4,
                          }}/>
                        </div>
                        <div style={S.cardLabel}>{f.label}</div>
                        <div style={S.cardMeta}>{f.orient === "horizontal" ? "↔" : "↕"} {f.desc}</div>
                      </div>
                    ))}
                  </>}
                  {signs.length > 0 && <>
                    <div style={{...S.fixtureGroup,marginTop:pieces.length>0?10:0}}>Brand Signs</div>
                    {signs.map(f=>(
                      <div key={f.id} style={S.card} draggable
                        onDragStart={e=>onFurnDragStart(e,f)}
                        onDoubleClick={()=>onFurnDblClick(f)}>
                        <div style={{display:"flex",justifyContent:"center",alignItems:"center",marginBottom:6,height:40}}>
                          <div style={{
                            background: f.color,
                            color: f.textColor,
                            borderRadius: 5,
                            padding: "4px 12px",
                            fontWeight: 900,
                            fontSize: 13,
                            letterSpacing: "1px",
                            boxShadow:`0 2px 8px ${f.color}55`,
                            fontFamily:"'Arial Black','Arial',sans-serif",
                          }}>{f.brand}</div>
                        </div>
                        <div style={S.cardLabel}>{f.label}</div>
                        <div style={S.cardMeta}>ICT Brand Sign</div>
                      </div>
                    ))}
                  </>}
                </>);
              })()}
            </div>
          </>)}
        </aside>

        <main style={S.workspace}>
          <div style={S.toolbar}>
            <ToolToggle tool={tool} setTool={setTool} accent="#ff6d00"/>
            <div style={{width:1,height:22,background:"#e8ddd0",margin:"0 6px"}}/>
            <span style={S.tbBadge}>🗂 {items.length} item{items.length!==1?"s":""}</span>
            {selected&&!isHand&&<span style={S.tbBadge}>✏️ Selected — <kbd style={S.kbd}>Del</kbd> to remove</span>}
            {isHand&&<span style={S.tbBadge}>✋ Hold & drag to pan</span>}
          </div>
          <div style={{flex:1,position:"relative",overflow:"hidden"}}>
            <div ref={viewportRef} style={{...S.viewport,cursor:isHand?"grab":"default"}}
              onMouseDown={onHandDown}
              onDragOver={onViewportDragOver}
              onDrop={onViewportDrop}
              onClick={()=>{if(!isHand)setSelected(null);}}>
              <div style={{width:WORLD_W*zoom,height:WORLD_H*zoom,position:"relative",flexShrink:0}}>
                <div style={{position:"absolute",top:0,left:0,width:WORLD_W,height:WORLD_H,transform:`scale(${zoom})`,transformOrigin:"0 0",backgroundImage:`linear-gradient(rgba(160,140,120,0.14) 1px,transparent 1px),linear-gradient(90deg,rgba(160,140,120,0.14) 1px,transparent 1px)`,backgroundSize:"40px 40px"}}>
                  {items.length===0&&(
                    <div style={S.emptyState}>
                      <div style={{fontSize:64,marginBottom:14,opacity:0.28}}>🏪</div>
                      <div style={S.emptyTitle}>Your store floor is empty</div>
                      <div style={S.emptyText}>Drag shelves from the panel or double-click to place.</div>
                    </div>
                  )}
                  {items.map(inst=>{
                    const isSel=selected===inst.instanceId;
                    const selFilter=isSel?"drop-shadow(0 0 12px rgba(255,109,0,0.8))":"drop-shadow(3px 5px 8px rgba(0,0,0,0.28))";
                    const baseStyle={position:"absolute",left:inst.x,top:inst.y,cursor:isHand?"inherit":draggingId===inst.instanceId?"grabbing":"grab",zIndex:isSel?10:1,filter:selFilter,transition:"filter 0.15s",userSelect:"none"};
                    if(inst.isFurnishing){
                      const isSign=inst.kind==="sign";
                      return(
                        <div key={inst.instanceId} style={baseStyle} onMouseDown={e=>onItemMouseDown(e,inst)}>
                          {isSign
                            ? <div style={{width:inst.fw,height:inst.fh,background:inst.color,color:inst.textColor,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:14,letterSpacing:"1.5px",fontFamily:"'Arial Black','Arial',sans-serif",boxShadow:`0 3px 12px ${inst.color}88`,border:isSel?"2px solid #ff6d00":"2px solid transparent"}}>
                                {inst.brand}
                              </div>
                            : <div style={{width:inst.fw,height:inst.fh,background:`linear-gradient(135deg,${inst.color}bb,${inst.color})`,borderRadius:4,boxShadow:`0 3px 10px ${inst.color}66`,border:isSel?"2px solid #ff6d00":`1.5px solid ${inst.color}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                                <span style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.85)",textTransform:"uppercase",letterSpacing:"0.5px",writingMode:inst.orient==="vertical"?"vertical-rl":"horizontal-tb",transform:inst.orient==="vertical"?"rotate(180deg)":"none"}}>
                                  {inst.label}
                                </span>
                              </div>
                          }
                        </div>
                      );
                    }
                    return (
                      <div key={inst.instanceId} style={baseStyle} onMouseDown={e=>onItemMouseDown(e,inst)}>
                        <ShelfOrHook item={inst} scale={SHELF_SCALE} selected={isSel}/>
                        <div style={{...S.itemLabel,background:isSel?"#ff6d00":"rgba(0,0,0,0.55)"}}>{inst.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div style={S.floatZoom}>
              <button style={S.zBtnLg} onClick={()=>applyZoom(zoomRef.current+ZOOM_STEP)}>＋</button>
              <button style={S.zPct}   onClick={()=>applyZoom(ZOOM_DEFAULT)}>{pct}%</button>
              <button style={S.zBtnLg} onClick={()=>applyZoom(zoomRef.current-ZOOM_STEP)}>−</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ── Shared Modal styles ────────────────────────────────────────────────────────
const M = {
  overlay:   {position:"fixed",inset:0,background:"rgba(15,10,0,0.58)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,backdropFilter:"blur(5px)"},
  box:       {background:"#fff",borderRadius:16,width:480,maxWidth:"94vw",boxShadow:"0 32px 80px rgba(0,0,0,0.36)",overflow:"hidden"},
  head:      {color:"#fff",padding:"15px 20px",fontWeight:700,fontSize:15,display:"flex",justifyContent:"space-between",alignItems:"center"},
  closeBtn:  {background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",borderRadius:6,width:28,height:28,cursor:"pointer",fontWeight:700,fontSize:13},
  body:      {padding:"22px 20px",display:"flex",flexDirection:"column",gap:14},
  foot:      {padding:"13px 20px",display:"flex",justifyContent:"flex-end",gap:10,borderTop:"1px solid #f0e8dc",background:"#faf7f4"},
  label:     {fontSize:12,fontWeight:700,color:"#5a3e2b",marginBottom:4,display:"block"},
  err:       {background:"#fff0f0",border:"1px solid #ffcdd2",color:"#c62828",borderRadius:6,padding:"8px 12px",fontSize:12,fontWeight:500},
  cancelBtn: {background:"transparent",border:"1.5px solid #d4c4b0",color:"#7a5c44",borderRadius:8,padding:"8px 20px",fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"inherit"},
  saveBtn:   {border:"none",color:"#fff",borderRadius:8,padding:"8px 22px",fontWeight:700,fontSize:14,cursor:"pointer",boxShadow:"0 3px 12px rgba(0,0,0,0.2)",fontFamily:"inherit"},
  toast:     {position:"fixed",top:68,left:"50%",transform:"translateX(-50%)",color:"#fff",borderRadius:10,padding:"11px 22px",fontWeight:600,fontSize:14,display:"flex",alignItems:"center",gap:10,zIndex:400,boxShadow:"0 8px 32px rgba(0,0,0,0.35)",whiteSpace:"nowrap"},
};

// ── Builder styles ─────────────────────────────────────────────────────────────
const S = {
  root:      {fontFamily:"'DM Sans','Segoe UI',sans-serif",height:"100vh",display:"flex",flexDirection:"column",background:"#f7f3ee",overflow:"hidden"},
  header:    {background:"linear-gradient(135deg,#e65c00 0%,#f9a825 100%)",padding:"0 20px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 3px 14px rgba(230,92,0,0.38)",flexShrink:0},
  title:     {color:"#fff",fontWeight:800,fontSize:18,letterSpacing:"-0.5px",lineHeight:1.1},
  featureName:{color:"rgba(255,255,255,0.75)",fontWeight:600,fontSize:11,letterSpacing:"0.2px"},
  subtitle:  {color:"rgba(255,255,255,0.72)",fontSize:12,fontWeight:500,paddingLeft:10,borderLeft:"1px solid rgba(255,255,255,0.3)"},
  btnHome:   {background:"rgba(255,255,255,0.28)",color:"#fff",border:"1.5px solid rgba(255,255,255,0.55)",borderRadius:8,padding:"7px 13px",fontWeight:700,fontSize:12,cursor:"pointer"},
  btnAdd:    {background:"#fff",color:"#e65c00",border:"none",borderRadius:8,padding:"7px 15px",fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.15)"},
  btnPlanogram:{background:"rgba(255,255,255,0.22)",color:"#fff",border:"1.5px solid rgba(255,255,255,0.65)",borderRadius:8,padding:"7px 13px",fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center"},
  btnGhost:  {background:"rgba(255,255,255,0.16)",color:"#fff",border:"1px solid rgba(255,255,255,0.35)",borderRadius:8,padding:"7px 12px",fontWeight:600,fontSize:12,cursor:"pointer"},
  body:      {flex:1,display:"flex",overflow:"hidden"},
  panel:     {width:195,background:"#fff",borderRight:"1px solid #e8ddd0",display:"flex",flexDirection:"column",flexShrink:0,boxShadow:"2px 0 12px rgba(0,0,0,0.06)"},
  panelHead: {padding:"13px 14px 6px",fontWeight:700,fontSize:12,color:"#5a3e2b",letterSpacing:"0.6px",textTransform:"uppercase",display:"flex",alignItems:"center",gap:6,borderBottom:"1px solid #f0e8dc"},
  badge:     {marginLeft:"auto",background:"#ff6d00",color:"#fff",borderRadius:20,padding:"1px 7px",fontSize:10,fontWeight:700},
  hint:      {fontSize:10,color:"#b09a86",padding:"5px 14px 8px",margin:0,borderBottom:"1px solid #f0e8dc"},
  searchWrap:{position:"relative",display:"flex",alignItems:"center",padding:"8px 8px 6px",borderBottom:"1px solid #f0e8dc"},
  searchIcon:{position:"absolute",left:16,fontSize:12,pointerEvents:"none",opacity:0.5},
  searchInput:{width:"100%",padding:"6px 28px 6px 26px",border:"1.5px solid #e8ddd0",borderRadius:7,fontSize:11,fontFamily:"inherit",background:"#fdf9f5",outline:"none",color:"#3d2b1a"},
  searchClear:{position:"absolute",right:14,background:"none",border:"none",cursor:"pointer",fontSize:10,color:"#b09a86",padding:2,lineHeight:1},
  noResults: {fontSize:11,color:"#b09a86",textAlign:"center",padding:"20px 8px",fontStyle:"italic"},
  fixtureGroup:{fontSize:10,fontWeight:800,color:"#b09a86",textTransform:"uppercase",letterSpacing:"0.8px",padding:"4px 4px 2px",borderBottom:"1px solid #f0e8dc",marginBottom:4},
  panelList: {flex:1,overflowY:"auto",padding:"10px 8px",display:"flex",flexDirection:"column",gap:8},
  card:      {background:"#faf7f4",border:"1.5px solid #e8ddd0",borderRadius:10,padding:"10px 8px 8px",cursor:"grab",textAlign:"center",userSelect:"none"},
  cardLabel: {fontWeight:700,fontSize:11,color:"#3d2b1a",marginBottom:2},
  cardMeta:  {fontSize:9,color:"#a08878",fontFamily:"monospace"},
  workspace: {flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:"#ede8e0"},
  toolbar:   {background:"#fff",borderBottom:"1px solid #e8ddd0",padding:"6px 14px",display:"flex",gap:8,alignItems:"center",flexShrink:0,minHeight:44},
  tbBadge:   {fontSize:12,color:"#7a5c44",background:"#fdf4ec",border:"1px solid #f0dcc8",borderRadius:6,padding:"3px 10px",fontWeight:500},
  kbd:       {background:"#e8ddd0",borderRadius:3,padding:"1px 5px",fontFamily:"monospace",fontSize:11,border:"1px solid #cbb89e"},
  viewport:  {position:"absolute",inset:0,overflow:"auto"},
  emptyState:{position:"absolute",top:"28%",left:"50%",transform:"translateX(-50%)",textAlign:"center",pointerEvents:"none",userSelect:"none",whiteSpace:"nowrap"},
  emptyTitle:{fontWeight:700,fontSize:18,color:"#b0977e",marginBottom:10},
  emptyText: {fontSize:13,color:"#c4a98c",lineHeight:1.8},
  itemLabel: {position:"absolute",bottom:-20,left:"50%",transform:"translateX(-50%)",color:"#fff",fontSize:10,fontWeight:700,borderRadius:4,padding:"2px 8px",whiteSpace:"nowrap",pointerEvents:"none"},
  floatZoom: {position:"absolute",bottom:24,right:24,zIndex:50,display:"flex",flexDirection:"column",alignItems:"center",gap:5},
  zBtnLg:    {width:44,height:44,borderRadius:12,border:"none",background:"#ff6d00",color:"#fff",fontSize:22,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 10px rgba(230,92,0,0.45)",lineHeight:1},
  zPct:      {width:44,height:32,borderRadius:8,background:"rgba(255,255,255,0.95)",border:"1.5px solid #e8ddd0",fontSize:11,fontWeight:800,color:"#5a3e2b",cursor:"pointer",textAlign:"center",boxShadow:"0 2px 6px rgba(0,0,0,0.12)"},
};

// ── Filter popup styles ────────────────────────────────────────────────────────
const FP = {
  section:      {padding:"10px 12px",borderBottom:"1px solid #edf2f8"},
  sectionLabel: {fontSize:10,fontWeight:800,color:"#4a6fa5",textTransform:"uppercase",letterSpacing:"0.6px",marginBottom:7},
  chips:        {display:"flex",flexWrap:"wrap",gap:5},
  chip:         {padding:"4px 10px",borderRadius:7,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all 0.12s",display:"flex",alignItems:"center",gap:4},
};

// ── Planogram page styles ──────────────────────────────────────────────────────
const SP = {
  root:        {fontFamily:"'DM Sans','Segoe UI',sans-serif",height:"100vh",display:"flex",flexDirection:"column",background:"#f0f4f8",overflow:"hidden"},
  header:      {background:"linear-gradient(135deg,#1a3a5c 0%,#2d6a9f 100%)",padding:"0 20px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 3px 14px rgba(26,58,92,0.38)",flexShrink:0},
  backBtn:     {background:"rgba(255,255,255,0.18)",color:"#fff",border:"1.5px solid rgba(255,255,255,0.45)",borderRadius:8,padding:"6px 14px",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"},
  title:       {color:"#fff",fontWeight:800,fontSize:18,letterSpacing:"-0.5px",lineHeight:1.1},
  featureName: {color:"rgba(255,255,255,0.72)",fontWeight:600,fontSize:11,letterSpacing:"0.2px"},
  subtitle:    {color:"rgba(255,255,255,0.65)",fontSize:12,fontWeight:500,paddingLeft:10,borderLeft:"1px solid rgba(255,255,255,0.3)"},
  statBadge:   {background:"rgba(255,255,255,0.18)",color:"#fff",borderRadius:8,padding:"5px 12px",fontSize:12,fontWeight:600,border:"1px solid rgba(255,255,255,0.25)"},
  actionBtn:   {background:"rgba(255,255,255,0.22)",color:"#fff",border:"1.5px solid rgba(255,255,255,0.5)",borderRadius:8,padding:"6px 13px",fontWeight:700,fontSize:13,cursor:"pointer"},
  clearBtn:    {background:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.8)",border:"1px solid rgba(255,255,255,0.28)",borderRadius:8,padding:"6px 12px",fontWeight:600,fontSize:12,cursor:"pointer"},
  body:        {flex:1,display:"flex",overflow:"hidden"},
  panel:       {width:400,background:"#fff",borderRight:"1px solid #dde5ee",display:"flex",flexDirection:"column",flexShrink:0,boxShadow:"2px 0 12px rgba(0,0,0,0.06)"},
  panelHead:   {padding:"13px 14px 6px",fontWeight:700,fontSize:12,color:"#1a3a5c",letterSpacing:"0.6px",textTransform:"uppercase",display:"flex",alignItems:"center",gap:6,borderBottom:"1px solid #dde5ee"},
  badge:       {marginLeft:"auto",background:"#2d6a9f",color:"#fff",borderRadius:20,padding:"1px 7px",fontSize:10,fontWeight:700},
  hint:        {fontSize:10,color:"#7a95b0",padding:"5px 14px 8px",margin:0,borderBottom:"1px solid #dde5ee"},
  searchWrap:  {position:"relative",display:"flex",alignItems:"center",padding:"8px 8px 6px",borderBottom:"1px solid #dde5ee"},
  searchIcon:  {position:"absolute",left:16,fontSize:12,pointerEvents:"none",opacity:0.5},
  searchInput: {width:"100%",padding:"6px 28px 6px 26px",border:"1.5px solid #dde5ee",borderRadius:7,fontSize:11,fontFamily:"inherit",background:"#f8fbff",outline:"none",color:"#1a3a5c"},
  searchClear: {position:"absolute",right:14,background:"none",border:"none",cursor:"pointer",fontSize:10,color:"#7a95b0",padding:2,lineHeight:1},
  noResults:   {fontSize:11,color:"#7a95b0",textAlign:"center",padding:"20px 8px",fontStyle:"italic"},
  panelList:   {flex:1,overflowY:"auto",padding:"8px"},
  productTable: {border:"1px solid #dde5ee",borderRadius:8,overflow:"hidden",background:"#fff"},
  productTableHead: {display:"grid",gridTemplateColumns:"minmax(130px,1.6fr) minmax(70px,1fr) 52px 70px",gap:6,alignItems:"center",padding:"8px 9px",background:"#f0f6ff",borderBottom:"1px solid #c8d8ee",color:"#52708e",fontSize:9,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.45px",position:"sticky",top:0,zIndex:1},
  productTableRow: {display:"grid",gridTemplateColumns:"minmax(130px,1.6fr) minmax(70px,1fr) 52px 70px",gap:6,alignItems:"center",minHeight:40,padding:"7px 9px",borderBottom:"1px solid #edf2f8",borderLeft:"3px solid transparent",cursor:"grab",userSelect:"none",transition:"background 0.12s,border-color 0.12s"},
  productTableName: {display:"flex",alignItems:"center",gap:6,minWidth:0,fontWeight:700,fontSize:11,color:"#1a3a5c",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},
  productTableCategory: {minWidth:0,fontSize:10,color:"#607f9d",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},
  productTablePrice: {fontSize:11,fontWeight:800,color:"#2d6a9f",whiteSpace:"nowrap",textAlign:"right"},
  productTableDims: {fontSize:9,color:"#728ba5",fontFamily:"monospace",whiteSpace:"nowrap",textAlign:"right"},
  workspace:   {flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:"#e8edf3"},
  toolbar:     {background:"#fff",borderBottom:"1px solid #dde5ee",padding:"6px 14px",display:"flex",gap:8,alignItems:"center",flexShrink:0,minHeight:44},
  tbBadge:     {fontSize:12,color:"#3a5a7a",background:"#f0f6ff",border:"1px solid #c8d8ee",borderRadius:6,padding:"3px 10px",fontWeight:500},
  viewport:    {position:"absolute",inset:0,overflow:"auto"},
  floatZoom:   {position:"absolute",bottom:24,right:24,zIndex:50,display:"flex",flexDirection:"column",alignItems:"center",gap:5},
  zBtnLg:      {width:44,height:44,borderRadius:12,border:"none",background:"#2d6a9f",color:"#fff",fontSize:22,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 10px rgba(45,106,159,0.45)",lineHeight:1},
  zPct:        {width:44,height:32,borderRadius:8,background:"rgba(255,255,255,0.95)",border:"1.5px solid #dde5ee",fontSize:11,fontWeight:800,color:"#1a3a5c",cursor:"pointer",textAlign:"center",boxShadow:"0 2px 6px rgba(0,0,0,0.12)"},
};

// ── Inject keyframe for spinner ────────────────────────────────────────────────
(function injectStyles() {
  if (document.getElementById("sb-global-styles")) return;
  const s = document.createElement("style");
  s.id = "sb-global-styles";
  s.textContent = `
    @keyframes spin { to { transform: rotate(360deg); } }
    input:focus { border-color: #f4a261 !important; box-shadow: 0 0 0 3px rgba(244,162,97,0.2) !important; }
  `;
  document.head.appendChild(s);
})();
