import { useState, useEffect } from "react";

const API_BASE = "/api";

const TEAM_NAMES_FR = {
  "Algeria":"Algérie","Argentina":"Argentine","Australia":"Australie",
  "Austria":"Autriche","Belgium":"Belgique","Bosnia-H.":"Bosnie-Herzégovine",
  "Bosnia-Herzegovina":"Bosnie-Herzégovine","Brazil":"Brésil","Brésil":"Brésil",
  "Canada":"Canada","Cape Verde":"Cap-Vert","Chile":"Chili","Colombia":"Colombie",
  "Congo DR":"RD Congo","Costa Rica":"Costa Rica","Croatia":"Croatie",
  "Curaçao":"Curaçao","Czechia":"Tchéquie","Ecuador":"Équateur","Egypt":"Égypte",
  "England":"Angleterre","France":"France","Germany":"Allemagne","Ghana":"Ghana",
  "Guatemala":"Guatemala","Haiti":"Haïti","Honduras":"Honduras","Iran":"Iran",
  "Iraq":"Irak","Ivory Coast":"Côte d'Ivoire","Japan":"Japon","Jordan":"Jordanie",
  "Korea Republic":"Corée du Sud","Mexico":"Mexique","Morocco":"Maroc",
  "Netherlands":"Pays-Bas","New Zealand":"Nouvelle-Zélande","Nigeria":"Nigéria",
  "Norway":"Norvège","Panama":"Panama","Paraguay":"Paraguay","Peru":"Pérou",
  "Poland":"Pologne","Portugal":"Portugal","Qatar":"Qatar",
  "Saudi Arabia":"Arabie Saoudite","Scotland":"Écosse","Senegal":"Sénégal",
  "Serbia":"Serbie","South Africa":"Afrique du Sud","Spain":"Espagne",
  "Sweden":"Suède","Switzerland":"Suisse","Tunisia":"Tunisie","Turkey":"Turquie",
  "USA":"États-Unis","Uruguay":"Uruguay","Uzbekistan":"Ouzbékistan",
  "Venezuela":"Venezuela","Wales":"Pays de Galles","Cameroon":"Cameroun",
  "Bolivia":"Bolivie",
};
const teamName = (name) => TEAM_NAMES_FR[name] || name;

async function apiCall(endpoint, options = {}, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res  = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur serveur");
  return data;
}

const ADMIN_CSS = `
  .admin-login-wrap { min-height:72vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:28px; }
  .admin-badge { display:inline-flex; align-items:center; gap:8px; background:rgba(201,168,76,0.08); border:1px solid rgba(201,168,76,0.25); border-radius:2px; padding:5px 14px; font-size:0.65rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase; color:var(--gold); margin-bottom:4px; }
  .admin-wrap { padding-bottom:80px; }
  .admin-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:28px; padding-bottom:16px; border-bottom:1px solid rgba(201,168,76,0.15); flex-wrap:wrap; gap:12px; }
  .admin-title { font-family:var(--font-display); font-size:1.5rem; font-weight:400; font-style:italic; color:var(--gold); }
  .admin-subtitle { font-size:0.7rem; color:var(--gray); letter-spacing:0.1em; text-transform:uppercase; margin-top:2px; }
  .btn-admin-logout { background:none; border:1px solid rgba(255,255,255,0.08); border-radius:var(--radius); cursor:pointer; color:var(--gray); font-size:0.68rem; font-family:var(--font-body); letter-spacing:0.08em; padding:6px 14px; transition:all var(--transition); }
  .btn-admin-logout:hover { border-color:var(--red); color:var(--red); }
  .admin-tabs { display:flex; gap:6px; margin-bottom:28px; flex-wrap:wrap; }
  .admin-tab { padding:9px 20px; background:var(--coal); border:1px solid rgba(201,168,76,0.1); border-radius:2px; cursor:pointer; font-family:var(--font-body); font-size:0.72rem; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:var(--gray); transition:all var(--transition); }
  .admin-tab.active { background:rgba(201,168,76,0.1); border-color:rgba(201,168,76,0.35); color:var(--gold); }
  .admin-tab:hover:not(.active) { color:var(--cream); }
  .admin-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:10px; margin-bottom:16px; }
  .admin-stat { background:var(--coal); border:1px solid rgba(201,168,76,0.1); border-radius:var(--radius); padding:14px 18px; }
  .admin-stat-val { font-family:var(--font-display); font-size:2rem; font-weight:600; color:var(--gold); line-height:1; }
  .admin-stat-label { font-size:0.62rem; color:var(--gray); text-transform:uppercase; letter-spacing:0.1em; margin-top:4px; }
  .admin-table-wrap { background:var(--coal); border:1px solid rgba(201,168,76,0.1); border-radius:var(--radius); overflow:hidden; }
  .admin-table { width:100%; border-collapse:collapse; }
  .admin-table th { font-size:0.6rem; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:var(--gray); padding:11px 16px; text-align:left; border-bottom:1px solid rgba(255,255,255,0.06); background:rgba(201,168,76,0.04); }
  .admin-table td { padding:11px 16px; font-size:0.8rem; border-bottom:1px solid rgba(255,255,255,0.04); vertical-align:middle; }
  .admin-table tr:last-child td { border-bottom:none; }
  .admin-table tr:hover td { background:rgba(255,255,255,0.02); }
  .role-pill { display:inline-block; font-size:0.58rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; padding:2px 8px; border-radius:2px; }
  .role-admin { background:rgba(201,168,76,0.15); color:var(--gold); border:1px solid rgba(201,168,76,0.25); }
  .role-user { background:rgba(255,255,255,0.05); color:var(--gray); border:1px solid rgba(255,255,255,0.08); }
  .btn-delete { background:none; border:1px solid rgba(192,57,43,0.25); border-radius:var(--radius); color:#c07060; font-size:0.65rem; font-family:var(--font-body); letter-spacing:0.08em; padding:4px 10px; cursor:pointer; transition:all var(--transition); }
  .btn-delete:hover { background:rgba(192,57,43,0.1); border-color:rgba(192,57,43,0.5); }
  .btn-delete:disabled { opacity:0.3; cursor:not-allowed; }
  .bonus-edit-cell { display:flex; align-items:center; gap:6px; }
  .bonus-edit-input { width:52px; height:28px; background:var(--muted); border:1px solid rgba(201,168,76,0.15); border-radius:var(--radius); color:var(--cream); font-family:var(--font-display); font-size:1rem; text-align:center; outline:none; transition:border-color var(--transition); }
  .bonus-edit-input:focus { border-color:var(--gold); }
  .btn-bonus-save { background:none; border:1px solid rgba(201,168,76,0.3); border-radius:var(--radius); color:var(--gold); font-size:0.62rem; font-family:var(--font-body); letter-spacing:0.08em; padding:4px 10px; cursor:pointer; transition:all var(--transition); white-space:nowrap; }
  .btn-bonus-save:hover { background:var(--gold); color:var(--obsidian); }
  .btn-bonus-save:disabled { opacity:0.3; cursor:not-allowed; }
  .match-filter-row { display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap; }
  .filter-btn { padding:6px 14px; background:var(--coal); border:1px solid rgba(201,168,76,0.1); border-radius:2px; cursor:pointer; font-family:var(--font-body); font-size:0.68rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:var(--gray); transition:all var(--transition); }
  .filter-btn.active { background:rgba(201,168,76,0.1); border-color:rgba(201,168,76,0.3); color:var(--gold); }
  .match-edit-row { background:var(--coal); border:1px solid rgba(201,168,76,0.08); border-radius:var(--radius); padding:13px 16px; margin-bottom:8px; display:grid; grid-template-columns:1fr auto; align-items:center; gap:16px; transition:border-color var(--transition); }
  .match-edit-row:hover { border-color:rgba(201,168,76,0.18); }
  .match-edit-teams { font-family:var(--font-display); font-size:1rem; font-weight:600; letter-spacing:0.04em; }
  .match-edit-meta { font-size:0.65rem; color:var(--gray); margin-top:3px; letter-spacing:0.05em; }
  .match-edit-controls { display:flex; align-items:center; gap:8px; flex-shrink:0; }
  .score-edit-input { width:40px; height:32px; background:var(--muted); border:1px solid rgba(201,168,76,0.15); border-radius:var(--radius); color:var(--cream); font-family:var(--font-display); font-size:1.1rem; text-align:center; outline:none; transition:border-color var(--transition); }
  .score-edit-input:focus { border-color:var(--gold); }
  .score-edit-sep { font-family:var(--font-display); color:var(--gold-dim); font-size:1rem; }
  .btn-save-score { padding:6px 14px; background:transparent; color:var(--gold); border:1px solid rgba(201,168,76,0.35); border-radius:var(--radius); font-family:var(--font-body); font-size:0.65rem; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; cursor:pointer; transition:all var(--transition); white-space:nowrap; }
  .btn-save-score:hover { background:var(--gold); color:var(--obsidian); }
  .btn-save-score:disabled { opacity:0.3; cursor:not-allowed; }
  .current-score { font-family:var(--font-display); font-size:1.1rem; color:var(--gold-dim); min-width:50px; text-align:center; }
  .sync-panel { background:var(--coal); border:1px solid rgba(201,168,76,0.12); border-radius:var(--radius); padding:28px; margin-bottom:16px; }
  .sync-panel h3 { font-family:var(--font-display); font-size:1.2rem; font-weight:400; font-style:italic; color:var(--cream); margin-bottom:10px; }
  .sync-panel p { font-size:0.78rem; color:var(--gray); line-height:1.7; margin-bottom:20px; }
  .btn-sync { padding:13px 28px; background:var(--gold); color:var(--obsidian); border:none; border-radius:var(--radius); font-family:var(--font-body); font-size:0.75rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase; cursor:pointer; transition:all var(--transition); }
  .btn-sync:hover { background:var(--gold-light); transform:translateY(-1px); }
  .btn-sync:disabled { opacity:0.4; cursor:not-allowed; transform:none; }
  .sync-result { margin-top:16px; padding:12px 16px; border-radius:var(--radius); font-size:0.78rem; }
  .sync-ok { background:rgba(45,106,63,0.1); border:1px solid rgba(45,106,63,0.25); color:#7dcc8a; }
  .sync-err { background:rgba(192,57,43,0.1); border:1px solid rgba(192,57,43,0.25); color:#d07060; }
  .admin-toast { position:fixed; bottom:28px; right:28px; background:var(--coal); border:1px solid rgba(201,168,76,0.3); border-radius:var(--radius); padding:12px 20px; font-size:0.78rem; color:var(--cream); z-index:9999; animation:toastIn 0.22s ease; box-shadow:0 8px 32px rgba(0,0,0,0.4); }
  .admin-toast.ok { border-color:rgba(45,106,63,0.4); color:#7dcc8a; }
  .admin-toast.err { border-color:rgba(192,57,43,0.35); color:#d07060; }
  @keyframes toastIn { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none} }
  .confirm-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.7); z-index:9998; display:flex; align-items:center; justify-content:center; }
  .confirm-box { background:var(--coal); border:1px solid rgba(201,168,76,0.2); border-radius:var(--radius); padding:28px; max-width:340px; width:90%; }
  .confirm-box h4 { font-family:var(--font-display); font-size:1.2rem; font-weight:400; font-style:italic; color:var(--cream); margin-bottom:10px; }
  .confirm-box p { font-size:0.78rem; color:var(--gray); margin-bottom:20px; line-height:1.6; }
  .confirm-actions { display:flex; gap:10px; }
  .btn-confirm-yes { flex:1; padding:10px; background:rgba(192,57,43,0.15); border:1px solid rgba(192,57,43,0.35); border-radius:var(--radius); color:#c07060; font-family:var(--font-body); font-size:0.7rem; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; cursor:pointer; transition:all var(--transition); }
  .btn-confirm-yes:hover { background:rgba(192,57,43,0.25); }
  .btn-confirm-no { flex:1; padding:10px; background:var(--muted); border:1px solid rgba(255,255,255,0.08); border-radius:var(--radius); color:var(--gray); font-family:var(--font-body); font-size:0.7rem; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; cursor:pointer; transition:all var(--transition); }
  .btn-confirm-no:hover { color:var(--cream); }
  .dashboard-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:12px; margin-bottom:28px; }
  .dashboard-stat { background:var(--coal); border:1px solid rgba(201,168,76,0.1); border-radius:var(--radius); padding:18px 20px; }
  .dashboard-stat-val { font-family:var(--font-display); font-size:2.2rem; font-weight:600; color:var(--gold); line-height:1; }
  .dashboard-stat-label { font-size:0.62rem; color:var(--gray); text-transform:uppercase; letter-spacing:0.1em; margin-top:6px; }
  .dashboard-stat-sub { font-size:0.72rem; color:var(--gold-dim); margin-top:4px; }
  .dashboard-section-title { font-family:var(--font-display); font-size:1.1rem; font-weight:400; font-style:italic; color:var(--gold); margin-bottom:14px; display:flex; align-items:center; gap:12px; }
  .dashboard-section-title::after { content:''; flex:1; height:1px; background:linear-gradient(to right,rgba(201,168,76,0.25),transparent); }
  .dashboard-info { display:flex; flex-direction:column; gap:10px; }
  .dashboard-info-row { background:var(--coal); border:1px solid rgba(201,168,76,0.08); border-radius:var(--radius); padding:14px 18px; }
  .dashboard-info-label { font-size:0.65rem; color:var(--gray); text-transform:uppercase; letter-spacing:0.1em; font-weight:600; margin-bottom:4px; }
  .dashboard-info-val { font-size:0.85rem; color:var(--cream); font-weight:600; }
  .dashboard-progress { width:100%; height:6px; background:rgba(255,255,255,0.06); border-radius:3px; margin-top:8px; overflow:hidden; }
  .dashboard-progress-bar { height:100%; background:var(--gold); border-radius:3px; transition:width 0.6s ease; }
  .csv-row { display:flex; justify-content:flex-end; gap:10px; margin-bottom:16px; }
  .btn-export { padding:7px 16px; background:transparent; color:var(--gold); border:1px solid rgba(201,168,76,0.35); border-radius:var(--radius); font-family:var(--font-body); font-size:0.65rem; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; cursor:pointer; transition:all var(--transition); white-space:nowrap; }
  .btn-export:hover { background:var(--gold); color:var(--obsidian); }
`;

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", { day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit", timeZone:"Europe/Paris" });
}
function stageLabel(s) {
  return { GROUP_STAGE:"Groupes", ROUND_OF_16:"8èmes", QUARTER_FINALS:"Quarts", SEMI_FINALS:"Demis", THIRD_PLACE:"3e place", FINAL:"Finale" }[s] || s;
}
function translateMatchStr(str) {
  if (!str || str === '—') return str;
  return str.replace(/^(.+) — (.+) \(/, (_, h, a) => `${teamName(h)} — ${teamName(a)} (`);
}

function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, []);
  return <div className={`admin-toast ${type}`}>{msg}</div>;
}

function Confirm({ text, onYes, onNo }) {
  return (
    <div className="confirm-overlay" onClick={onNo}>
      <div className="confirm-box" onClick={e=>e.stopPropagation()}>
        <h4>Confirmation</h4>
        <p>{text}</p>
        <div className="confirm-actions">
          <button className="btn-confirm-no" onClick={onNo}>Annuler</button>
          <button className="btn-confirm-yes" onClick={onYes}>Confirmer</button>
        </div>
      </div>
    </div>
  );
}

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit() {
    setError(""); setLoading(true);
    try {
      const data = await apiCall("/admin/login", { method:"POST", body:JSON.stringify({ username, password }) });
      onLogin(data.token, data.user);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="admin-login-wrap">
      <div style={{textAlign:"center"}}>
        <div className="admin-badge">⚙ Administration</div>
        <div style={{fontFamily:"var(--font-display)",fontSize:"1.6rem",fontWeight:600,color:"var(--cream)",marginTop:10}}>Accès restreint</div>
      </div>
      <div className="card" style={{maxWidth:360}}>
        <h2>Connexion admin</h2>
        {error && <div className="error-msg">{error}</div>}
        <div className="field"><label>Nom d'utilisateur</label><input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Admin" onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/></div>
        <div className="field"><label>Mot de passe</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/></div>
        <button className="btn" onClick={handleSubmit} disabled={loading}>{loading ? "Vérification…" : "Accéder au panneau"}</button>
      </div>
    </div>
  );
}

function DashboardTab({ token }) {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiCall("/admin/stats", {}, token).then(d => setStats(d)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner"/>;
  if (!stats)  return <div className="empty">Erreur de chargement.</div>;

  return (
    <div>
      <div className="dashboard-grid">
        <div className="dashboard-stat"><div className="dashboard-stat-val">{stats.totalUsers}</div><div className="dashboard-stat-label">Participants</div><div className="dashboard-stat-sub">{stats.usersActifs} actifs</div></div>
        <div className="dashboard-stat"><div className="dashboard-stat-val">{stats.totalPredictions}</div><div className="dashboard-stat-label">Pronostics</div><div className="dashboard-stat-sub">sur {stats.totalMatches} matchs</div></div>
        <div className="dashboard-stat">
          <div className="dashboard-stat-val">{stats.tauxParticipation}%</div>
          <div className="dashboard-stat-label">Participation</div>
          <div className="dashboard-progress"><div className="dashboard-progress-bar" style={{width:`${stats.tauxParticipation}%`}}/></div>
        </div>
        <div className="dashboard-stat"><div className="dashboard-stat-val">{stats.scoresExacts}</div><div className="dashboard-stat-label">Scores exacts</div><div className="dashboard-stat-sub">6 pts chacun</div></div>
        <div className="dashboard-stat"><div className="dashboard-stat-val">{stats.pointsBonus}</div><div className="dashboard-stat-label">Points bonus</div><div className="dashboard-stat-sub">attribués</div></div>
      </div>
      <div className="dashboard-section-title">Détails</div>
      <div className="dashboard-info">
        <div className="dashboard-info-row"><div className="dashboard-info-label">🥇 Meilleur score</div><div className="dashboard-info-val">{stats.meilleurScore}</div></div>
        <div className="dashboard-info-row"><div className="dashboard-info-label">🔥 Match le plus pronostiqué</div><div className="dashboard-info-val">{translateMatchStr(stats.matchPlus)}</div></div>
        <div className="dashboard-info-row"><div className="dashboard-info-label">❄️ Match le moins pronostiqué</div><div className="dashboard-info-val">{translateMatchStr(stats.matchMoins)}</div></div>
      </div>
    </div>
  );
}

function UsersTab({ token }) {
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [confirm, setConfirm]       = useState(null);
  const [deleting, setDeleting]     = useState(null);
  const [bonusEdits, setBonusEdits] = useState({});
  const [savingBonus, setSavingBonus] = useState(null);
  const [toast, setToast]           = useState(null);

  async function load() {
    setLoading(true);
    try { const d = await apiCall("/admin/users", {}, token); setUsers(d.users || []); }
    catch(e) { setToast({ msg:e.message, type:"err" }); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function handleDelete() {
    const { id, username } = confirm;
    setConfirm(null); setDeleting(id);
    try {
      await apiCall(`/admin/users/${id}`, { method:"DELETE" }, token);
      setToast({ msg:`${username} supprimé.`, type:"ok" });
      setUsers(u => u.filter(x => x.id !== id));
    } catch(e) { setToast({ msg:e.message, type:"err" }); }
    finally { setDeleting(null); }
  }

  async function handleSaveBonus(user) {
    const pts = bonusEdits[user.id] ?? user.points_bonus;
    setSavingBonus(user.id);
    try {
      const d = await apiCall(`/admin/users/${user.id}/bonus`, { method:"PATCH", body:JSON.stringify({ points_bonus: +pts }) }, token);
      setToast({ msg:d.message, type:"ok" });
      setUsers(us => us.map(u => u.id===user.id ? {...u, points_bonus:+pts} : u));
    } catch(e) { setToast({ msg:e.message, type:"err" }); }
    finally { setSavingBonus(null); }
  }

  function exportCSV() {
    const header = ["ID","Utilisateur","Rôle","Pronos","Points matchs","Points bonus","Inscrit le"];
    const rows = users.map(u => [
      u.id, u.username, u.role, u.pronos_count, u.total_points, u.points_bonus,
      u.created_at ? new Date(u.created_at).toLocaleDateString("fr-FR") : "—"
    ]);
    const csv = [header, ...rows].map(r => r.join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type:"text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `pronos-participants-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  async function exportPredictions() {
    const url = `${API_BASE}/admin/export-predictions`;
    const res = await fetch(url, { headers: { "Authorization": `Bearer ${token}` } });
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `pronos-pronostics-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  }

  const totalPronos = users.reduce((s,u) => s + u.pronos_count, 0);

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
      {confirm && <Confirm text={`Supprimer ${confirm.username} et tous ses pronostics ? Cette action est irréversible.`} onYes={handleDelete} onNo={()=>setConfirm(null)}/>}
      <div className="admin-stats">
        <div className="admin-stat"><div className="admin-stat-val">{users.length}</div><div className="admin-stat-label">Participants</div></div>
        <div className="admin-stat"><div className="admin-stat-val">{users.filter(u=>u.pronos_count>0).length}</div><div className="admin-stat-label">Actifs</div></div>
        <div className="admin-stat"><div className="admin-stat-val">{totalPronos}</div><div className="admin-stat-label">Pronostics total</div></div>
      </div>
      <div className="csv-row">
        <button className="btn-export" onClick={exportPredictions}>⬇ Export pronostics</button>
        <button className="btn-save-score" onClick={exportCSV}>⬇ Export participants</button>
      </div>
      {loading ? <div className="spinner"/> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>#</th><th>Utilisateur</th><th>Rôle</th><th>Pronos</th><th>Pts matchs</th><th>Pts bonus</th><th>Inscrit le</th><th></th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{color:"var(--gray)",fontFamily:"var(--font-display)",fontSize:"0.9rem"}}>{u.id}</td>
                  <td style={{fontWeight:600,letterSpacing:"0.04em"}}>{u.username}</td>
                  <td><span className={`role-pill ${u.role==="admin"?"role-admin":"role-user"}`}>{u.role}</span></td>
                  <td style={{color:"var(--gray)"}}>{u.pronos_count}</td>
                  <td style={{fontFamily:"var(--font-display)",fontSize:"1rem",color:"var(--gold)"}}>{u.total_points}</td>
                  <td>
                    {u.role !== "admin" ? (
                      <div className="bonus-edit-cell">
                        <input className="bonus-edit-input" type="number" min="0" max="100"
                          value={bonusEdits[u.id] ?? u.points_bonus}
                          onChange={e => setBonusEdits(b => ({...b, [u.id]: e.target.value}))}/>
                        <button className="btn-bonus-save" disabled={savingBonus===u.id} onClick={()=>handleSaveBonus(u)}>
                          {savingBonus===u.id ? "…" : "✓"}
                        </button>
                      </div>
                    ) : <span style={{color:"var(--gray)"}}>—</span>}
                  </td>
                  <td style={{color:"var(--gray)",fontSize:"0.72rem"}}>{u.created_at ? new Date(u.created_at).toLocaleDateString("fr-FR") : "—"}</td>
                  <td>
                    {u.role !== "admin" && (
                      <button className="btn-delete" disabled={deleting===u.id} onClick={()=>setConfirm({id:u.id,username:u.username})}>
                        {deleting===u.id ? "…" : "Supprimer"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ScoresTab({ token }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");
  const [edits, setEdits]     = useState({});
  const [saving, setSaving]   = useState(null);
  const [toast, setToast]     = useState(null);

  useEffect(() => {
    apiCall("/admin/matches", {}, token).then(d => setMatches(d.matches || [])).catch(e => setToast({ msg:e.message, type:"err" })).finally(() => setLoading(false));
  }, []);

  function getEdit(m) { return edits[m.id] ?? { home: m.score_home ?? "", away: m.score_away ?? "" }; }
  function setEdit(id, field, val) { setEdits(e => ({ ...e, [id]: { ...getEdit(matches.find(m=>m.id===id)), [field]: val } })); }

  async function handleSave(match) {
    const e = getEdit(match);
    if (e.home===""||e.away==="") { setToast({ msg:"Saisis les deux scores.", type:"err" }); return; }
    setSaving(match.id);
    try {
      const d = await apiCall(`/admin/matches/${match.id}`, { method:"PATCH", body:JSON.stringify({ score_home:+e.home, score_away:+e.away }) }, token);
      setToast({ msg:d.message, type:"ok" });
      setMatches(ms => ms.map(m => m.id===match.id ? {...m, score_home:+e.home, score_away:+e.away, status:"finished"} : m));
    } catch(err) { setToast({ msg:err.message, type:"err" }); }
    finally { setSaving(null); }
  }

  const filtered = matches.filter(m => {
    if (filter==="scheduled") return m.status==="scheduled";
    if (filter==="finished")  return m.status==="finished";
    return true;
  });

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
      <div className="match-filter-row">
        {[["all","Tous"],["scheduled","À venir"],["finished","Terminés"]].map(([v,l])=>(
          <button key={v} className={`filter-btn ${filter===v?"active":""}`} onClick={()=>setFilter(v)}>{l}</button>
        ))}
      </div>
      {loading ? <div className="spinner"/> : filtered.length===0 ? (
        <div className="empty">Aucun match.</div>
      ) : filtered.map(m => {
        const e = getEdit(m);
        return (
          <div className="match-edit-row" key={m.id}>
            <div>
              <div className="match-edit-teams">{teamName(m.home_team)} — {teamName(m.away_team)}</div>
              <div className="match-edit-meta">{stageLabel(m.stage)} · {formatDate(m.kickoff)} · <span style={{color:m.status==="finished"?"var(--gold)":m.status==="live"?"#d07060":"var(--gray)"}}>{m.status}</span></div>
            </div>
            <div className="match-edit-controls">
              {m.status==="finished" && <span className="current-score">{m.score_home}–{m.score_away}</span>}
              <input className="score-edit-input" type="number" min="0" max="30" value={e.home} onChange={ev=>setEdit(m.id,"home",ev.target.value)} placeholder="0"/>
              <span className="score-edit-sep">–</span>
              <input className="score-edit-input" type="number" min="0" max="30" value={e.away} onChange={ev=>setEdit(m.id,"away",ev.target.value)} placeholder="0"/>
              <button className="btn-save-score" disabled={saving===m.id} onClick={()=>handleSave(m)}>
                {saving===m.id ? "…" : m.status==="finished" ? "Corriger" : "Valider"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SyncTab({ token }) {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult]   = useState(null);

  async function handleSync() {
    setSyncing(true); setResult(null);
    try {
      const d = await apiCall("/admin/sync", { method:"POST" }, token);
      setResult({ ok:true, msg:d.message });
    } catch(e) { setResult({ ok:false, msg:e.message }); }
    finally { setSyncing(false); }
  }

  return (
    <div>
      <div className="sync-panel">
        <h3>Synchronisation des matchs</h3>
        <p>Déclenche manuellement la synchronisation avec <strong style={{color:"var(--cream)"}}>football-data.org</strong>. Le cron job tourne automatiquement toutes les 15 minutes pendant les matchs.</p>
        <button className="btn-sync" onClick={handleSync} disabled={syncing}>
          {syncing ? "Synchronisation en cours…" : "⟳ Lancer la synchronisation"}
        </button>
        {result && <div className={`sync-result ${result.ok?"sync-ok":"sync-err"}`}>{result.ok ? "✓ " : "✗ "}{result.msg}</div>}
      </div>
    </div>
  );
}

export default function AdminScreen({ onBack }) {
  const [adminToken, setAdminToken] = useState(null);
  const [adminUser, setAdminUser]   = useState(null);
  const [tab, setTab]               = useState("dashboard");

  function handleLogin(token, user) { setAdminToken(token); setAdminUser(user); }
  function handleLogout() { setAdminToken(null); setAdminUser(null); }

  return (
    <>
      <style>{ADMIN_CSS}</style>
      {!adminToken ? (
        <AdminLogin onLogin={handleLogin}/>
      ) : (
        <div className="admin-wrap">
          <div className="admin-header">
            <div>
              <div className="admin-title">Panneau d'administration</div>
              <div className="admin-subtitle">Connecté en tant que {adminUser?.username}</div>
            </div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <button className="btn-admin-logout" onClick={onBack}>← Retour</button>
              <button className="btn-admin-logout" onClick={handleLogout}>Déconnexion admin</button>
            </div>
          </div>
          <div className="admin-tabs">
            <button className={`admin-tab ${tab==="dashboard"?"active":""}`} onClick={()=>setTab("dashboard")}>📊 Dashboard</button>
            <button className={`admin-tab ${tab==="users"?"active":""}`} onClick={()=>setTab("users")}>👥 Participants</button>
            <button className={`admin-tab ${tab==="scores"?"active":""}`} onClick={()=>setTab("scores")}>⚽ Scores</button>
            <button className={`admin-tab ${tab==="sync"?"active":""}`} onClick={()=>setTab("sync")}>⟳ Sync</button>
          </div>
          {tab==="dashboard" && <DashboardTab token={adminToken}/>}
          {tab==="users"     && <UsersTab token={adminToken}/>}
          {tab==="scores"    && <ScoresTab token={adminToken}/>}
          {tab==="sync"      && <SyncTab token={adminToken}/>}
        </div>
      )}
    </>
  );
}