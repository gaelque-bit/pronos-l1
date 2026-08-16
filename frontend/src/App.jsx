import { useState, useEffect } from "react";
import AdminScreen from './AdminScreen';

const TEAM_NAMES_FR = {
  "Paris Saint-Germain":"PSG","PSG":"PSG",
  "Olympique de Marseille":"Marseille","Marseille":"Marseille",
  "Olympique Lyonnais":"Lyon","Lyon":"Lyon","Olympique Lyon":"Lyon",
  "AS Monaco":"Monaco","Monaco":"Monaco",
  "Lille OSC":"Lille","Lille":"Lille",
  "Stade Rennais":"Rennes","Rennes":"Rennes","Stade Rennais FC 1901":"Rennes",
  "OGC Nice":"Nice","Nice":"Nice",
  "Racing Club de Lens":"RC Lens","RC Lens":"RC Lens",
  "Stade de Reims":"Reims","Reims":"Reims",
  "Montpellier HSC":"Montpellier","Montpellier":"Montpellier",
  "FC Nantes":"Nantes","Nantes":"Nantes",
  "Toulouse FC":"Toulouse","Toulouse":"Toulouse",
  "RC Strasbourg Alsace":"Strasbourg","Strasbourg":"Strasbourg",
  "Stade Brestois 29":"Brest","Brest":"Brest",
  "Le Havre AC":"Le Havre","Le Havre":"Le Havre",
  "FC Lorient":"Lorient","Lorient":"Lorient",
  "Clermont Foot":"Clermont","Clermont":"Clermont",
  "FC Metz":"Metz","Metz":"Metz",
  "Angers SCO":"Angers","Angers":"Angers",
  "AJ Auxerre":"Auxerre","Auxerre":"Auxerre",
  "ES Troyes AC":"Troyes","Troyes":"Troyes",
  "Paris FC":"Paris FC",
  "Le Mans FC":"Le Mans","Le Mans":"Le Mans",
  "AS Saint-Etienne":"Saint-Étienne","Saint-Etienne":"Saint-Étienne",
};

const teamName = (name) => TEAM_NAMES_FR[name] || name;

const CHART_COLORS = [
  "#e30613","#ff4d4d","#a00000","#ff8080","#6b6358",
  "#a78bfa","#60a5fa","#34d399","#f87171","#fb923c",
];

const SRFC_LOGO = "https://crests.football-data.org/529.png";
const CLUB_LOGOS = {
  "Marseille":"https://crests.football-data.org/516.png",
  "PSG":"https://crests.football-data.org/524.png",
  "Lyon":"https://crests.football-data.org/523.png",
  "Monaco":"https://crests.football-data.org/548.png",
  "Lille":"https://crests.football-data.org/521.png",
  "Rennes":"https://crests.football-data.org/529.png",
  "Nice":"https://crests.football-data.org/522.png",
  "RC Lens":"https://crests.football-data.org/546.png",
  "Strasbourg":"https://crests.football-data.org/576.png",
  "Brest":"https://crests.football-data.org/512.png",
  "Le Havre":"https://crests.football-data.org/533.png",
  "Lorient":"https://crests.football-data.org/525.png",
  "Angers":"https://crests.football-data.org/532.png",
  "Auxerre":"https://crests.football-data.org/519.png",
  "Troyes":"https://crests.football-data.org/531.png",
  "Paris FC":"https://crests.football-data.org/1045.png",
  "Le Mans":"https://upload.wikimedia.org/wikipedia/en/5/57/Le_Mans_FC_logo.svg",
  "Toulouse":"https://crests.football-data.org/511.png",
  "Reims":"https://crests.football-data.org/547.png",
  "Montpellier":"https://crests.football-data.org/514.png",
};

const clubLogo = (name) => CLUB_LOGOS[teamName(name)] || null;

const CLUBS_L1 = [
  "Marseille","PSG","Lyon","Monaco","Lille","Rennes","Nice","RC Lens",
  "Strasbourg","Brest","Le Havre","Lorient","Angers","Auxerre","Troyes",
  "Paris FC","Le Mans","Toulouse"
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Josefin+Sans:wght@300;400;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --obsidian:#0d0d0d; --charcoal:#1a0000; --coal:#1a1a1a; --muted:#2a0000;
    --gold:#e30613; --gold-light:#ff4d4d; --gold-dim:#a00000;
    --cream:#f2ead8; --gray:#b5a99e; --red:#c0392b;
    --font-display:'Cormorant Garamond',Georgia,serif;
    --font-body:'Josefin Sans',sans-serif;
    --radius:4px; --transition:0.22s ease;
  }
  body { background:var(--obsidian); color:var(--cream); font-family:var(--font-body); font-weight:300; letter-spacing:0.03em; min-height:100vh; background-image:radial-gradient(ellipse 80% 50% at 50% -10%,rgba(227,6,19,0.08) 0%,transparent 70%); }
  .app { max-width:900px; margin:0 auto; padding:0 20px 80px; }
  .header { padding:32px 0 20px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid rgba(227,6,19,0.3); margin-bottom:32px; }
  .logo { font-family:var(--font-display); font-size:1.7rem; font-weight:600; letter-spacing:0.18em; color:var(--gold); text-transform:uppercase; display:flex; align-items:center; gap:12px; cursor:pointer; }
  .logo img { width:40px; height:40px; object-fit:contain; }
  .logo span { color:var(--cream); font-weight:400; font-style:italic; }
  .user-pill { display:flex; align-items:center; gap:10px; background:var(--coal); border:1px solid rgba(227,6,19,0.25); border-radius:50px; padding:6px 16px 6px 8px; font-size:0.78rem; letter-spacing:0.08em; }
  .avatar { width:28px; height:28px; background:var(--gold-dim); border:1px solid var(--gold); border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-size:1rem; color:var(--gold-light); }
  .btn-logout { background:none; border:none; cursor:pointer; color:var(--gray); font-size:0.72rem; letter-spacing:0.06em; padding:0; transition:color var(--transition); font-family:var(--font-body); }
  .btn-logout:hover { color:var(--red); }
  .tabs-main { display:flex; border-bottom:1px solid rgba(227,6,19,0.2); margin-bottom:28px; overflow-x:auto; -webkit-overflow-scrolling:touch; }
  .tab-main { flex:1; min-width:60px; padding:14px 8px; background:none; border:none; cursor:pointer; border-bottom:2px solid transparent; margin-bottom:-1px; font-family:var(--font-body); font-size:0.7rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:var(--gray); transition:all var(--transition); white-space:nowrap; }
  .tab-main.active { color:var(--gold); border-bottom-color:var(--gold); }
  .tab-main:hover:not(.active) { color:var(--cream); }
  .tabs-sub { display:flex; gap:6px; margin-bottom:24px; flex-wrap:wrap; }
  .tab-sub { padding:7px 16px; background:var(--coal); border:1px solid rgba(227,6,19,0.15); border-radius:2px; cursor:pointer; font-family:var(--font-body); font-size:0.7rem; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:var(--gray); transition:all var(--transition); }
  .tab-sub.active { background:rgba(227,6,19,0.1); border-color:rgba(227,6,19,0.4); color:var(--gold); }
  .tab-sub:hover:not(.active) { color:var(--cream); }
  .section-title { font-family:var(--font-display); font-size:1.2rem; font-weight:400; font-style:italic; color:var(--gold); margin-bottom:14px; display:flex; align-items:center; gap:12px; }
  .section-title::after { content:''; flex:1; height:1px; background:linear-gradient(to right,rgba(227,6,19,0.3),transparent); }
  .matchday-tabs { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:20px; }
  .matchday-tab { padding:6px 14px; background:var(--coal); border:1px solid rgba(227,6,19,0.15); border-radius:2px; cursor:pointer; font-family:var(--font-body); font-size:0.68rem; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:var(--gray); transition:all var(--transition); }
  .matchday-tab.active { background:rgba(227,6,19,0.1); border-color:rgba(227,6,19,0.4); color:var(--gold); }
  .matchday-tab.done { color:var(--gold-dim); border-color:rgba(227,6,19,0.2); }
  .matchday-tab:hover:not(.active) { color:var(--cream); }
  .bareme-rappel { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px; padding:10px 14px; background:var(--coal); border:1px solid rgba(227,6,19,0.15); border-radius:var(--radius); align-items:center; }
  .bareme-rappel-title { font-size:0.62rem; color:var(--gray); text-transform:uppercase; letter-spacing:0.1em; font-weight:600; margin-right:4px; }
  .bareme-rappel-item { display:flex; align-items:center; gap:5px; font-size:0.68rem; color:var(--gray); }
  .bareme-rappel-pts { font-family:var(--font-display); font-size:0.9rem; font-weight:600; }
  .bareme-sep { color:rgba(227,6,19,0.3); }
  .match-card { background:var(--coal); border:1px solid rgba(227,6,19,0.1); border-radius:var(--radius); padding:16px 18px; margin-bottom:10px; position:relative; overflow:hidden; transition:border-color var(--transition); }
  .match-card::before { content:''; position:absolute; left:0; top:0; bottom:0; width:2px; background:transparent; transition:background var(--transition); }
  .match-card:hover { border-color:rgba(227,6,19,0.25); }
  .match-card:hover::before { background:var(--gold); }
  .match-card.locked { opacity:0.65; }
  .match-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; flex-wrap:wrap; gap:6px; }
  .match-meta { font-size:0.68rem; color:var(--gray); letter-spacing:0.06em; text-transform:uppercase; }
  .match-badges { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
  .status-pill { font-size:0.62rem; font-weight:600; padding:3px 9px; border-radius:2px; text-transform:uppercase; letter-spacing:0.08em; }
  .status-scheduled { background:rgba(255,255,255,0.05); color:var(--gray); }
  .status-live { background:rgba(227,6,19,0.15); color:#ff4d4d; }
  .status-finished { background:rgba(227,6,19,0.1); color:var(--gold); }
  .match-teams { display:grid; grid-template-columns:1fr auto 1fr; align-items:center; gap:10px; margin-bottom:12px; }
  .match-team { font-family:var(--font-display); font-size:1.15rem; font-weight:600; letter-spacing:0.05em; display:flex; align-items:center; gap:8px; }
  .match-team.home { justify-content:flex-end; text-align:right; }
  .match-team.away { justify-content:flex-start; }
  .club-logo { object-fit:contain; }
  .match-score-display { font-family:var(--font-display); font-size:1.5rem; font-weight:600; color:var(--gold); text-align:center; min-width:56px; }
  .match-score-display.pending { color:var(--gray); font-family:var(--font-body); font-size:0.82rem; letter-spacing:0.08em; }
  .prono-input-row { display:flex; align-items:center; gap:10px; background:var(--charcoal); border-radius:var(--radius); padding:9px 12px; border:1px solid rgba(227,6,19,0.08); }
  .prono-label { font-size:0.65rem; color:var(--gray); margin-right:auto; text-transform:uppercase; letter-spacing:0.1em; font-weight:600; }
  .score-input { width:42px; height:34px; background:var(--muted); border:1px solid rgba(227,6,19,0.2); border-radius:var(--radius); color:var(--cream); font-family:var(--font-display); font-size:1.15rem; text-align:center; outline:none; transition:border-color var(--transition); }
  .score-input:focus { border-color:var(--gold); }
  .score-sep { font-family:var(--font-display); color:var(--gold-dim); font-size:1rem; }
  .btn-predict { padding:7px 16px; background:transparent; color:var(--gold); border:1px solid rgba(227,6,19,0.4); border-radius:var(--radius); font-family:var(--font-body); font-size:0.68rem; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; cursor:pointer; transition:all var(--transition); white-space:nowrap; }
  .btn-predict:hover { background:var(--gold); color:var(--obsidian); }
  .btn-predict:disabled { opacity:0.3; cursor:not-allowed; }
  .bareme-inline { font-size:0.58rem; color:var(--gray); letter-spacing:0.06em; cursor:help; flex-shrink:0; }
  .points-badge { font-family:var(--font-body); font-size:0.7rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; padding:3px 10px; border-radius:2px; }
  .pts-6 { background:rgba(227,6,19,0.2); color:var(--gold-light); border:1px solid rgba(227,6,19,0.4); }
  .pts-4 { background:rgba(227,6,19,0.12); color:var(--gold); border:1px solid rgba(227,6,19,0.25); }
  .pts-2 { background:rgba(227,6,19,0.06); color:var(--gold-dim); border:1px solid rgba(227,6,19,0.15); }
  .pts-0 { background:rgba(255,255,255,0.04); color:var(--gray); border:1px solid rgba(255,255,255,0.07); }
  .auth-wrap { min-height:72vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:36px; }
  .auth-hero { text-align:center; }
  .auth-hero img { width:80px; height:80px; object-fit:contain; margin-bottom:16px; }
  .auth-hero h1 { font-family:var(--font-display); font-size:clamp(2.5rem,8vw,4.5rem); font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:var(--cream); line-height:1; }
  .auth-hero h1 em { font-style:italic; font-weight:400; color:var(--gold); display:block; font-size:0.6em; letter-spacing:0.2em; margin-top:6px; }
  .auth-hero p { color:var(--gray); margin-top:12px; font-size:0.78rem; letter-spacing:0.12em; text-transform:uppercase; }
  .card { background:var(--coal); border:1px solid rgba(227,6,19,0.2); border-radius:var(--radius); padding:32px 28px; width:100%; max-width:380px; position:relative; }
  .card::before { content:''; position:absolute; top:0; left:28px; right:28px; height:1px; background:linear-gradient(to right,transparent,var(--gold),transparent); }
  .card h2 { font-family:var(--font-display); font-size:1.4rem; font-weight:400; font-style:italic; margin-bottom:22px; }
  .field { margin-bottom:14px; }
  .field label { display:block; font-size:0.68rem; color:var(--gray); margin-bottom:7px; text-transform:uppercase; letter-spacing:0.12em; font-weight:600; }
  .field input { width:100%; padding:11px 14px; background:var(--charcoal); border:1px solid rgba(227,6,19,0.15); border-radius:var(--radius); color:var(--cream); font-family:var(--font-body); font-size:0.9rem; font-weight:300; letter-spacing:0.04em; outline:none; transition:border-color var(--transition); }
  .field input:focus { border-color:var(--gold); }
  .field input::placeholder { color:var(--gray); opacity:0.5; }
  .reglement-check { display:flex; align-items:flex-start; gap:10px; margin-bottom:14px; padding:12px; background:var(--charcoal); border:1px solid rgba(227,6,19,0.1); border-radius:var(--radius); cursor:pointer; }
  .reglement-check input[type=checkbox] { margin-top:2px; accent-color:var(--gold); width:16px; height:16px; flex-shrink:0; cursor:pointer; }
  .reglement-check label { font-size:0.72rem; color:var(--gray); line-height:1.5; cursor:pointer; }
  .reglement-check label strong { color:var(--cream); }
  .btn { width:100%; padding:13px; background:var(--gold); color:var(--obsidian); border:none; border-radius:var(--radius); font-family:var(--font-body); font-size:0.75rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase; cursor:pointer; transition:all var(--transition); margin-top:6px; }
  .btn:hover { background:var(--gold-light); transform:translateY(-1px); }
  .btn:disabled { opacity:0.4; cursor:not-allowed; transform:none; }
  .btn-ghost { background:none; border:1px solid rgba(227,6,19,0.2); color:var(--gray); font-size:0.72rem; letter-spacing:0.1em; padding:12px; margin-top:10px; }
  .btn-ghost:hover { background:rgba(227,6,19,0.05); color:var(--cream); transform:none; }
  .error-msg { background:rgba(192,57,43,0.1); border:1px solid rgba(192,57,43,0.25); border-radius:var(--radius); padding:10px 14px; font-size:0.78rem; color:#d07060; margin-bottom:14px; }
  .podium { display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-bottom:24px; align-items:end; }
  .podium-card { background:var(--coal); border-radius:var(--radius); padding:16px 12px; text-align:center; border:1px solid rgba(227,6,19,0.1); position:relative; overflow:hidden; cursor:pointer; }
  .podium-card::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:rgba(227,6,19,0.15); }
  .podium-card.rank-1 { border-color:rgba(227,6,19,0.45); background:rgba(227,6,19,0.06); padding-top:22px; margin-top:-12px; }
  .podium-card.rank-1::after { background:var(--gold); }
  .podium-card:hover { border-color:rgba(227,6,19,0.3); background:rgba(227,6,19,0.08); }
  .podium-rank { font-family:var(--font-display); font-size:2rem; font-weight:400; font-style:italic; color:var(--gray); }
  .podium-card.rank-1 .podium-rank { color:var(--gold); font-size:2.6rem; }
  .podium-name { font-size:0.75rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; margin:6px 0 4px; }
  .podium-pts { font-family:var(--font-display); font-size:1.4rem; font-weight:600; color:var(--gold); }
  .podium-card.rank-1 .podium-pts { font-size:1.8rem; }
  .crown { font-size:1.1rem; margin-bottom:4px; }
  .rank-list { display:flex; flex-direction:column; gap:6px; }
  .rank-row { display:grid; grid-template-columns:44px 1fr auto; align-items:center; gap:14px; background:var(--coal); border:1px solid rgba(227,6,19,0.08); border-radius:var(--radius); padding:12px 16px; transition:border-color var(--transition); cursor:pointer; }
  .rank-row:hover { border-color:rgba(227,6,19,0.3); background:rgba(227,6,19,0.04); }
  .rank-row.me { border-color:rgba(227,6,19,0.3); background:rgba(227,6,19,0.05); }
  .rank-num { font-family:var(--font-display); font-size:1.2rem; font-weight:400; font-style:italic; color:var(--gold-dim); text-align:center; }
  .rank-username { font-size:0.82rem; font-weight:600; letter-spacing:0.05em; text-transform:uppercase; }
  .rank-detail { font-size:0.7rem; color:var(--gray); margin-top:2px; }
  .rank-total { font-family:var(--font-display); font-size:1.4rem; font-weight:600; color:var(--gold); text-align:right; }
  .rank-total span { font-family:var(--font-body); font-size:0.65rem; color:var(--gray); margin-left:2px; }
  .rank-hint { font-size:0.62rem; color:var(--gray); text-align:center; margin-bottom:12px; letter-spacing:0.06em; }
  .streak-badge { display:inline-flex; align-items:center; gap:3px; font-size:0.68rem; color:#ff4d4d; margin-left:8px; font-weight:600; }
  .distinctions-grid { display:flex; flex-direction:column; gap:8px; }
  .distinction-card { background:var(--coal); border:1px solid rgba(227,6,19,0.1); border-radius:var(--radius); padding:14px 18px; display:grid; grid-template-columns:auto 1fr auto; align-items:center; gap:14px; }
  .distinction-emoji { font-size:1.4rem; }
  .distinction-label { font-size:0.68rem; color:var(--gray); text-transform:uppercase; letter-spacing:0.1em; font-weight:600; margin-bottom:3px; }
  .distinction-winner { font-family:var(--font-display); font-size:1.1rem; font-weight:600; color:var(--cream); }
  .distinction-winner.empty { color:var(--gray); font-style:italic; font-size:0.82rem; font-family:var(--font-body); }
  .distinction-detail { font-size:0.72rem; color:var(--gold); font-weight:600; text-align:right; }
  .empty { text-align:center; padding:48px 0; color:var(--gray); font-size:0.78rem; letter-spacing:0.1em; text-transform:uppercase; }
  .empty-icon { font-size:2rem; margin-bottom:10px; opacity:0.5; }
  .spinner { width:22px; height:22px; border:1px solid rgba(227,6,19,0.2); border-top-color:var(--gold); border-radius:50%; animation:spin 1s linear infinite; margin:40px auto; }
  @keyframes spin { to { transform:rotate(360deg); } }
  @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.3} }
  .live-dot { display:inline-block; width:5px; height:5px; background:#ff4d4d; border-radius:50%; margin-right:3px; animation:pulse 1.2s infinite; }
  .footer { text-align:center; padding:32px 0 16px; border-top:1px solid rgba(227,6,19,0.1); margin-top:48px; }
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.82); z-index:9990; display:flex; align-items:flex-start; justify-content:center; padding:40px 20px; overflow-y:auto; }
  .modal-box { background:var(--coal); border:1px solid rgba(227,6,19,0.25); border-radius:var(--radius); width:100%; max-width:620px; position:relative; }
  .modal-box::before { content:''; position:absolute; top:0; left:28px; right:28px; height:1px; background:linear-gradient(to right,transparent,var(--gold),transparent); }
  .modal-header { display:flex; align-items:center; justify-content:space-between; padding:24px 28px 0; }
  .modal-title { font-family:var(--font-display); font-size:1.6rem; font-weight:600; color:var(--gold); letter-spacing:0.1em; }
  .modal-close { background:none; border:none; cursor:pointer; color:var(--gray); font-size:1.4rem; line-height:1; transition:color var(--transition); }
  .modal-close:hover { color:var(--cream); }
  .modal-body { padding:24px 28px 32px; }
  .histo-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-bottom:20px; }
  .histo-stat { background:var(--charcoal); border:1px solid rgba(227,6,19,0.1); border-radius:var(--radius); padding:10px 12px; text-align:center; }
  .histo-stat-val { font-family:var(--font-display); font-size:1.4rem; font-weight:600; color:var(--gold); }
  .histo-stat-label { font-size:0.58rem; color:var(--gray); text-transform:uppercase; letter-spacing:0.08em; margin-top:2px; }
  .histo-list { display:flex; flex-direction:column; gap:6px; }
  .histo-row { display:grid; grid-template-columns:1fr auto; align-items:center; gap:10px; background:var(--charcoal); border:1px solid rgba(227,6,19,0.06); border-radius:var(--radius); padding:10px 14px; }
  .histo-match { font-size:0.78rem; font-weight:600; color:var(--cream); }
  .histo-score { font-size:0.7rem; color:var(--gray); margin-top:2px; }
  .histo-pts { font-family:var(--font-display); font-size:1.1rem; font-weight:600; }
  .histo-pts.p6 { color:var(--gold-light); }
  .histo-pts.p4 { color:var(--gold); }
  .histo-pts.p2 { color:var(--gold-dim); }
  .histo-pts.p0 { color:var(--gray); }
  .histo-pts.pending { color:var(--gray); font-family:var(--font-body); font-size:0.65rem; }
  .evolution-wrap { background:var(--coal); border:1px solid rgba(227,6,19,0.1); border-radius:var(--radius); padding:20px; margin-bottom:24px; }
  .evolution-canvas-wrap { width:100%; overflow-x:auto; }
  .evolution-legend { display:flex; flex-wrap:wrap; gap:10px; margin-top:14px; }
  .evolution-legend-item { display:flex; align-items:center; gap:6px; font-size:0.68rem; letter-spacing:0.06em; text-transform:uppercase; color:var(--gray); }
  .evolution-legend-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
  .reactions-row { display:flex; gap:6px; flex-wrap:wrap; margin-top:8px; }
  .reaction-btn { display:flex; align-items:center; gap:4px; padding:4px 10px; background:var(--charcoal); border:1px solid rgba(255,255,255,0.06); border-radius:20px; cursor:pointer; font-size:0.78rem; color:var(--gray); transition:all var(--transition); font-family:var(--font-body); }
  .reaction-btn:hover { border-color:rgba(227,6,19,0.3); background:rgba(227,6,19,0.06); }
  .reaction-btn.reacted { border-color:rgba(227,6,19,0.4); background:rgba(227,6,19,0.1); color:var(--gold); }
  .reaction-count { font-size:0.7rem; font-weight:600; }
  .bonus-intro { background:var(--coal); border:1px solid rgba(227,6,19,0.15); border-radius:var(--radius); padding:20px 24px; margin-bottom:24px; position:relative; }
  .bonus-intro::before { content:''; position:absolute; top:0; left:24px; right:24px; height:1px; background:linear-gradient(to right,transparent,var(--gold),transparent); }
  .bonus-intro p { font-size:0.8rem; color:var(--gray); line-height:1.7; }
  .bonus-intro strong { color:var(--cream); }
  .home-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:24px; }
  .home-stat { background:var(--coal); border:1px solid rgba(227,6,19,0.15); border-radius:var(--radius); padding:16px; text-align:center; position:relative; overflow:hidden; }
  .home-stat::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:var(--gold); }
  .home-stat-val { font-family:var(--font-display); font-size:2.2rem; font-weight:600; color:var(--gold); line-height:1; }
  .home-stat-label { font-size:0.6rem; color:var(--gray); text-transform:uppercase; letter-spacing:0.12em; margin-top:6px; }
  .home-match-row { background:var(--coal); border:1px solid rgba(227,6,19,0.1); border-radius:var(--radius); padding:12px 16px; margin-bottom:8px; display:grid; grid-template-columns:1fr auto 1fr; align-items:center; gap:10px; cursor:pointer; }
  .home-team { display:flex; align-items:center; gap:8px; font-family:var(--font-display); font-size:1rem; font-weight:600; }
  .home-team.home { justify-content:flex-end; }
  .home-team.away { justify-content:flex-start; }
  .home-match-center { text-align:center; }
  .home-match-time { font-size:0.68rem; color:var(--gray); letter-spacing:0.06em; }
  .home-match-prono { font-size:0.62rem; color:#7dcc8a; margin-top:3px; }
  .home-match-todo { font-size:0.62rem; color:var(--gold); margin-top:3px; }
  .l1-table { width:100%; border-collapse:collapse; }
  .l1-table th { font-size:0.6rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:var(--gray); padding:8px 12px; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); }
  .l1-table td { padding:8px 12px; font-size:0.78rem; border-bottom:1px solid rgba(255,255,255,0.03); vertical-align:middle; }
  .l1-table tr:last-child td { border-bottom:none; }
  .l1-table tr.rennes td { background:rgba(227,6,19,0.06); }
  @media (max-width: 600px) {
    .app { padding:0 12px 60px; }
    .header { padding:16px 0 14px; flex-wrap:wrap; gap:10px; margin-bottom:20px; }
    .logo { font-size:1.2rem; }
    .logo img { width:30px; height:30px; }
    .tab-main { font-size:0.6rem; padding:10px 5px; min-width:52px; }
    .match-team { font-size:0.95rem; }
    .match-score-display { font-size:1.2rem; min-width:40px; }
    .prono-input-row { flex-wrap:wrap; gap:7px; }
    .score-input { width:38px; height:30px; font-size:1rem; }
    .btn-predict { padding:6px 12px; font-size:0.62rem; }
    .bareme-inline { display:none; }
    .podium { gap:6px; }
    .podium-card { padding:12px 8px; }
    .home-stats { gap:8px; }
    .home-stat-val { font-size:1.6rem; }
    .rank-row { grid-template-columns:36px 1fr auto; gap:10px; padding:10px 12px; }
    .histo-stats { grid-template-columns:repeat(2,1fr); }
    .modal-overlay { padding:16px 12px; }
    .modal-body { padding:16px 16px 24px; }
    .modal-header { padding:18px 16px 0; }
    .modal-title { font-size:1.2rem; }
  }
`;

const API_BASE = "/api";
async function apiCall(endpoint, options = {}, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res  = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur serveur");
  return data;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", { day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit", timeZone:"Europe/Paris" });
}
function formatDateShort(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", { day:"2-digit", month:"short", timeZone:"Europe/Paris" });
}
function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour:"2-digit", minute:"2-digit", timeZone:"Europe/Paris" });
}
function ptsClass(pts) {
  if (pts===6) return "points-badge pts-6";
  if (pts===4) return "points-badge pts-4";
  if (pts===2) return "points-badge pts-2";
  return "points-badge pts-0";
}

const REACTIONS = ["👍","🔥","😂","😮","👏","💪"];

function ClubLogo({ name, size=28 }) {
  const logo = clubLogo(name);
  if (!logo) return <span style={{fontSize:size*0.7+"px"}}>⚽</span>;
  return <img src={logo} alt={teamName(name)} className="club-logo" style={{width:size,height:size}} onError={e=>e.target.style.display='none'}/>;
}

// ── Modal Historique ──────────────────────────────────────────────────────────
function HistoriqueModal({ userId, token, onClose }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiCall(`/predictions/user/${userId}`, {}, token)
      .then(d => setData(d)).catch(console.error).finally(() => setLoading(false));
  }, [userId]);

  const finished = data?.predictions?.filter(p => p.status === "finished") || [];
  const totalPts = finished.reduce((s,p) => s + (p.points_earned||0), 0);
  const exacts   = finished.filter(p => p.points_earned === 6).length;
  const bonusPts = data?.bonus?.points_bonus || 0;

  function ptsCls(pts) {
    if (pts===6) return "histo-pts p6";
    if (pts===4) return "histo-pts p4";
    if (pts===2) return "histo-pts p2";
    return "histo-pts p0";
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{data?.user?.username || "…"}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {loading ? <div className="spinner"/> : (
            <>
              <div className="histo-stats">
                <div className="histo-stat"><div className="histo-stat-val">{totalPts+bonusPts}</div><div className="histo-stat-label">Total pts</div></div>
                <div className="histo-stat"><div className="histo-stat-val">{finished.length}</div><div className="histo-stat-label">Matchs</div></div>
                <div className="histo-stat"><div className="histo-stat-val">{exacts}</div><div className="histo-stat-label">Exacts</div></div>
                <div className="histo-stat"><div className="histo-stat-val">{bonusPts}</div><div className="histo-stat-label">Bonus</div></div>
              </div>
              {data?.predictions?.length === 0 ? (
                <div className="empty"><div className="empty-icon">📋</div>Aucun pronostic.</div>
              ) : (
                <div className="histo-list">
                  {data.predictions.map(p => {
                    const masked = p.pred_home === null;
                    return (
                      <div className="histo-row" key={p.id}>
                        <div>
                          <div className="histo-match">{teamName(p.home_team)} — {teamName(p.away_team)}</div>
                          <div className="histo-score">
                            {masked ? <span style={{color:"var(--gray)",fontStyle:"italic"}}>Masqué avant le coup d'envoi</span>
                              : p.status==="finished" ? `Score : ${p.score_home}–${p.score_away} · Prono : ${p.pred_home}–${p.pred_away}`
                              : `Prono : ${p.pred_home}–${p.pred_away} · ${formatDateShort(p.kickoff)}`}
                          </div>
                        </div>
                        <div>
                          {masked ? <span style={{fontSize:"0.65rem",color:"var(--gray)"}}>🔒</span>
                            : p.status==="finished" ? <span className={ptsCls(p.points_earned)}>{p.points_earned} pt{p.points_earned>1?"s":""}</span>
                            : <span className="histo-pts pending">À venir</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Modal Pronos par match ────────────────────────────────────────────────────
function MatchPronosModal({ matchId, token, onClose }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiCall(`/predictions/match/${matchId}`, {}, token)
      .then(d => setData(d)).catch(console.error).finally(() => setLoading(false));
  }, [matchId]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{data ? `${teamName(data.match.home_team)} — ${teamName(data.match.away_team)}` : "…"}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {loading ? <div className="spinner"/> : (
            <>
              {data?.match?.status === "finished" && (
                <div style={{textAlign:"center",marginBottom:16,fontFamily:"var(--font-display)",fontSize:"1.8rem",fontWeight:600,color:"var(--gold)"}}>
                  {data.match.score_home} — {data.match.score_away}
                </div>
              )}
              {data?.predictions?.length === 0 ? (
                <div className="empty"><div className="empty-icon">📋</div>Aucun pronostic.</div>
              ) : (
                <div className="histo-list">
                  {data.predictions.map((p,i) => (
                    <div className="histo-row" key={i}>
                      <div>
                        <div className="histo-match">{p.username}</div>
                        <div className="histo-score">Prono : {p.pred_home}–{p.pred_away}</div>
                      </div>
                      <div>
                        {data.match.status === "finished"
                          ? <span className={`histo-pts ${p.points_earned===6?"p6":p.points_earned===4?"p4":p.points_earned===2?"p2":"p0"}`}>{p.points_earned} pt{p.points_earned>1?"s":""}</span>
                          : <span className="histo-pts pending">En cours</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Modal Forme & Historique ──────────────────────────────────────────────────
function TeamFormModal({ match, onClose }) {
  const [homeForm, setHomeForm] = useState(null);
  const [awayForm, setAwayForm] = useState(null);
  const [h2h, setH2h]           = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!match.home_team_api_id || !match.away_team_api_id) { setLoading(false); return; }
    Promise.all([
      apiCall(`/team-form/${match.home_team_api_id}`),
      apiCall(`/team-form/${match.away_team_api_id}`),
      apiCall(`/head-to-head/${match.home_team_api_id}/${match.away_team_api_id}`),
    ]).then(([h, a, h2]) => {
      setHomeForm(h.matches || []);
      setAwayForm(a.matches || []);
      setH2h(h2.matches || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, [match.id]);

  function resultIcon(m, tn) {
    const isHome = m.homeTeam === tn;
    const scored = isHome ? m.homeScore : m.awayScore;
    const conceded = isHome ? m.awayScore : m.homeScore;
    if (scored > conceded) return <span style={{color:"#7dcc8a",fontWeight:700}}>V</span>;
    if (scored < conceded) return <span style={{color:"#e07060",fontWeight:700}}>D</span>;
    return <span style={{color:"var(--gray)",fontWeight:700}}>N</span>;
  }

  function MatchRow({ m, highlightTeam }) {
    const date = new Date(m.date).toLocaleDateString("fr-FR", { day:"2-digit", month:"short" });
    return (
      <div style={{display:"grid",gridTemplateColumns:"40px 1fr auto auto",alignItems:"center",gap:8,padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
        <div style={{fontSize:"0.6rem",color:"var(--gray)"}}>{date}</div>
        <div style={{fontSize:"0.75rem"}}>
          <span style={{fontWeight:m.homeTeam===highlightTeam?600:400}}>{teamName(m.homeTeam)}</span>
          <span style={{color:"var(--gray)",margin:"0 5px"}}>–</span>
          <span style={{fontWeight:m.awayTeam===highlightTeam?600:400}}>{teamName(m.awayTeam)}</span>
        </div>
        <div style={{fontFamily:"var(--font-display)",fontSize:"0.95rem",color:"var(--gold)",minWidth:36,textAlign:"center"}}>{m.homeScore}–{m.awayScore}</div>
        <div style={{width:20,textAlign:"center"}}>{resultIcon(m, highlightTeam)}</div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{fontSize:"1.1rem"}}>{teamName(match.home_team)} — {teamName(match.away_team)}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {loading ? <div className="spinner"/> : (
            <>
              <div style={{marginBottom:20}}>
                <div style={{fontSize:"0.68rem",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--gold)",marginBottom:8}}>🏠 {teamName(match.home_team)} — 5 derniers matchs</div>
                {homeForm?.length===0 ? <div style={{color:"var(--gray)",fontSize:"0.75rem"}}>Aucun match disponible</div>
                  : homeForm?.map((m,i)=><MatchRow key={i} m={m} highlightTeam={match.home_team}/>)}
              </div>
              <div style={{marginBottom:20}}>
                <div style={{fontSize:"0.68rem",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--gold)",marginBottom:8}}>✈️ {teamName(match.away_team)} — 5 derniers matchs</div>
                {awayForm?.length===0 ? <div style={{color:"var(--gray)",fontSize:"0.75rem"}}>Aucun match disponible</div>
                  : awayForm?.map((m,i)=><MatchRow key={i} m={m} highlightTeam={match.away_team}/>)}
              </div>
              <div>
                <div style={{fontSize:"0.68rem",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--gold)",marginBottom:8}}>⚔️ Dernières confrontations</div>
                {h2h?.length===0 ? <div style={{color:"var(--gray)",fontSize:"0.75rem"}}>Aucune confrontation récente</div>
                  : h2h?.map((m,i)=><MatchRow key={i} m={m} highlightTeam={match.home_team}/>)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Auth ──────────────────────────────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [mode,setMode]           = useState("login");
  const [username,setUsername]   = useState("");
  const [password,setPassword]   = useState("");
  const [email,setEmail]         = useState("");
  const [reglement,setReglement] = useState(false);
  const [error,setError]         = useState("");
  const [loading,setLoading]     = useState(false);

  async function handleSubmit() {
    if (mode==="register"&&!reglement) { setError("Tu dois accepter le règlement."); return; }
    setError(""); setLoading(true);
    try {
      const data = await apiCall(`/auth/${mode}`,{method:"POST",body:JSON.stringify({username,password,email,reglementAccepted:reglement})});
      onLogin(data.user, data.token);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-hero">
        <img src={SRFC_LOGO} alt="SRFC"/>
        <h1>PRONOS <em>Socios SRFC · Ligue 1</em></h1>
        <p>Saison 2026 – 2027 · Tout Donner</p>
      </div>
      <div className="card">
        <h2>{mode==="login"?"Connexion":"Inscription"}</h2>
        {error && <div className="error-msg">{error}</div>}
        <div className="field"><label>Pseudonyme</label><input value={username} onChange={e=>setUsername(e.target.value)} placeholder="ex: LeViking!" onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/></div>
        {mode==="register" && <div className="field"><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="ton@email.fr"/></div>}
        <div className="field"><label>Mot de passe</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/></div>
        {mode==="register" && (
          <div className="reglement-check" onClick={()=>setReglement(r=>!r)}>
            <input type="checkbox" checked={reglement} onChange={()=>setReglement(r=>!r)}/>
            <label><strong>J'ai lu et j'accepte le règlement des Pronos des socios du SRFC.</strong> La mauvaise foi est tolérée. Les excuses bidon sont interdites.</label>
          </div>
        )}
        <button className="btn" onClick={handleSubmit} disabled={loading||(mode==="register"&&!reglement)}>
          {loading?"...":mode==="login"?"Se connecter":"Créer le compte"}
        </button>
        <button className="btn btn-ghost" onClick={()=>{setMode(m=>m==="login"?"register":"login");setError("");}}>
          {mode==="login"?"Pas encore inscrit ? S'inscrire":"Déjà inscrit ? Se connecter"}
        </button>
      </div>
    </div>
  );
}

// ── Home Screen ───────────────────────────────────────────────────────────────
function HomeScreen({ matches, token, currentUser, onNavigate }) {
  const [ranking, setRanking]         = useState([]);
  const [predictions, setPredictions] = useState({});
  const [l1Standing, setL1Standing]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(()=>{
    Promise.all([
      apiCall("/ranking"),
      apiCall("/predictions", {}, token),
      apiCall("/l1standings").catch(()=>({ standings:[] })),
    ]).then(([r, p, s])=>{
      setRanking(r.classement||[]);
      const map={};
      (p.predictions||[]).forEach(pr=>{ map[pr.match_id]=pr; });
      setPredictions(map);
      setL1Standing(s.standings||[]);
    }).catch(console.error).finally(()=>setLoading(false));
  },[]);

  const days = [...new Set(matches.filter(m=>m.matchday).map(m=>m.matchday))].sort((a,b)=>a-b);
  const currentDay = days.find(d=>matches.filter(m=>m.matchday===d).some(m=>m.status==="scheduled"||m.status==="live")) || days[days.length-1];
  const dayMatches = matches.filter(m=>m.matchday===currentDay).sort((a,b)=>new Date(a.kickoff)-new Date(b.kickoff));
  const myRank = ranking.find(r=>r.id===currentUser?.id);
  const aPronostiquer = dayMatches.filter(m=>m.status==="scheduled"&&new Date(m.kickoff)>new Date()&&!predictions[m.id]).length;

  if (loading) return <div className="spinner"/>;

  return (
    <div>
      {selectedMatch && <TeamFormModal match={selectedMatch} onClose={()=>setSelectedMatch(null)}/>}
      {myRank && (
        <div className="home-stats">
          <div className="home-stat"><div className="home-stat-val">#{myRank.rang}</div><div className="home-stat-label">Mon rang</div></div>
          <div className="home-stat"><div className="home-stat-val">{myRank.total}</div><div className="home-stat-label">Mes points</div></div>
          <div className="home-stat"><div className="home-stat-val" style={{color:aPronostiquer>0?"#ff4d4d":"#7dcc8a"}}>{aPronostiquer}</div><div className="home-stat-label">À pronostiquer</div></div>
        </div>
      )}
      {currentDay && (
        <>
          <div className="section-title" style={{cursor:"pointer"}} onClick={()=>onNavigate("pronostics")}>
            Journée {currentDay}
            <span style={{fontSize:"0.7rem",color:"var(--gray)",fontStyle:"normal",fontFamily:"var(--font-body)"}}>→ Pronostiquer</span>
          </div>
          {dayMatches.map(m=>{
            const pred = predictions[m.id];
            const locked = m.status!=="scheduled"||new Date(m.kickoff)<new Date();
            return (
              <div key={m.id} className="home-match-row" onClick={()=>setSelectedMatch(m)}>
                <div className="home-team home"><span>{teamName(m.home_team)}</span><ClubLogo name={m.home_team} size={22}/></div>
                <div className="home-match-center">
                  {m.status==="finished" ? <div style={{fontFamily:"var(--font-display)",fontSize:"1.1rem",fontWeight:600,color:"var(--gold)"}}>{m.score_home}–{m.score_away}</div>
                    : m.status==="live" ? <div style={{color:"#ff4d4d",fontSize:"0.72rem",fontWeight:600}}><span className="live-dot"/>Live</div>
                    : <div className="home-match-time">{formatTime(m.kickoff)}</div>}
                  {pred && !locked && <div className="home-match-prono">✓ {pred.pred_home}-{pred.pred_away}</div>}
                  {pred && locked && m.status==="finished" && <div className="home-match-prono">{pred.pred_home}-{pred.pred_away} · {pred.points_earned}pts</div>}
                  {!pred && !locked && <div className="home-match-todo">À pronostiquer</div>}
                </div>
                <div className="home-team away"><ClubLogo name={m.away_team} size={22}/><span>{teamName(m.away_team)}</span></div>
              </div>
            );
          })}
        </>
      )}
      {ranking.length>0 && (
        <>
          <div className="section-title" style={{marginTop:24,cursor:"pointer"}} onClick={()=>onNavigate("classement")}>
            Classement Pronos
            <span style={{fontSize:"0.7rem",color:"var(--gray)",fontStyle:"normal",fontFamily:"var(--font-body)"}}>→ Voir tout</span>
          </div>
          <div className="rank-list">
            {ranking.slice(0,5).map(row=>(
              <div key={row.id} className={`rank-row ${row.id===currentUser?.id?"me":""}`}>
                <div className="rank-num">{row.rang}</div>
                <div>
                  <div className="rank-username">{row.username}{row.id===currentUser?.id&&<span style={{fontSize:"0.68rem",color:"var(--gold)",marginLeft:6}}>← toi</span>}</div>
                  <div className="rank-detail">{row.pronos_joues} matchs · {row.scores_exacts} exacts</div>
                </div>
                <div className="rank-total">{row.total}<span>pts</span></div>
              </div>
            ))}
          </div>
        </>
      )}
      {l1Standing.length>0 && (
        <>
          <div className="section-title" style={{marginTop:24}}>Classement Ligue 1</div>
          <div style={{background:"var(--coal)",border:"1px solid rgba(227,6,19,0.1)",borderRadius:"var(--radius)",overflow:"hidden"}}>
            <table className="l1-table">
              <thead><tr><th style={{width:36}}>#</th><th>Club</th><th style={{textAlign:"center",width:36}}>J</th><th style={{textAlign:"center",width:48}}>Pts</th></tr></thead>
              <tbody>
                {l1Standing.map(t=>{
                  const isRennes = t.team.shortName==="Rennes"||t.team.shortName==="Stade Rennais";
                  return (
                    <tr key={t.team.id} className={isRennes?"rennes":""}>
                      <td style={{fontFamily:"var(--font-display)",fontSize:"0.9rem",color:"var(--gold-dim)"}}>{t.position}</td>
                      <td><div style={{display:"flex",alignItems:"center",gap:8}}><ClubLogo name={t.team.shortName} size={20}/><span style={{fontWeight:isRennes?600:400,color:isRennes?"var(--gold)":"var(--cream)"}}>{teamName(t.team.shortName)}</span></div></td>
                      <td style={{textAlign:"center",color:"var(--gray)"}}>{t.playedGames}</td>
                      <td style={{textAlign:"center",fontFamily:"var(--font-display)",fontSize:"1rem",fontWeight:600,color:"var(--gold)"}}>{t.points}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ── Résultats ─────────────────────────────────────────────────────────────────
function ResultsScreen({ matches, loading }) {
  const [activeDay,setActiveDay] = useState(null);
  const days = [...new Set(matches.filter(m=>m.matchday).map(m=>m.matchday))].sort((a,b)=>a-b);

  useEffect(()=>{
    if (days.length>0&&activeDay===null) {
      const lastFinished = [...days].reverse().find(d=>matches.filter(m=>m.matchday===d).some(m=>m.status==="finished"));
      setActiveDay(lastFinished||days[0]);
    }
  },[matches]);

  if (loading) return <div className="spinner"/>;
  const currentMatches = activeDay ? matches.filter(m=>m.matchday===activeDay).sort((a,b)=>new Date(a.kickoff)-new Date(b.kickoff)) : [];

  return (
    <div>
      <div className="matchday-tabs">
        {days.map(d=>(
          <button key={d} className={`matchday-tab ${activeDay===d?"active":""}`} onClick={()=>setActiveDay(d)}>J{d}</button>
        ))}
      </div>
      {currentMatches.map(m=>(
        <div className="match-card" key={m.id}>
          <div className="match-header">
            <div className="match-meta">J{m.matchday} · {formatDate(m.kickoff)}</div>
            <span className={`status-pill status-${m.status}`}>
              {m.status==="live"?<><span className="live-dot"/>En direct</>:m.status==="finished"?"Terminé":"À venir"}
            </span>
          </div>
          <div className="match-teams">
            <div className="match-team home"><span>{teamName(m.home_team)}</span><ClubLogo name={m.home_team}/></div>
            {m.status==="finished" ? <div className="match-score-display">{m.score_home}–{m.score_away}</div>
              : m.status==="live" ? <div className="match-score-display" style={{color:"#ff4d4d"}}>{m.score_home??0}–{m.score_away??0}</div>
              : <div className="match-score-display pending">vs</div>}
            <div className="match-team away"><ClubLogo name={m.away_team}/><span>{teamName(m.away_team)}</span></div>
          </div>
        </div>
      ))}
      {days.length===0 && <div className="empty"><div className="empty-icon">⚽</div>Les matchs apparaîtront dès le début de la saison.</div>}
    </div>
  );
}

// ── Carte pronostic ───────────────────────────────────────────────────────────
function PronoCard({ match, prediction, token, onPredicted }) {
  const [home,setHome]     = useState(prediction?.pred_home??"");
  const [away,setAway]     = useState(prediction?.pred_away??"");
  const [saving,setSaving] = useState(false);
  const [msg,setMsg]       = useState("");
  const [reactions,setReactions]             = useState({});
  const [showMatchPronos,setShowMatchPronos] = useState(false);
  const [showForm,setShowForm]               = useState(false);

  useEffect(()=>{ setHome(prediction?.pred_home??""); setAway(prediction?.pred_away??""); },[prediction]);

  const locked   = match.status!=="scheduled"||new Date(match.kickoff)<new Date();
  const hoursLeft = (new Date(match.kickoff)-new Date())/(1000*60*60);

  function getPronoStatus() {
    if (locked) return null;
    if (prediction) return { label:"✓ Saisi", color:"#7dcc8a", bg:"rgba(45,106,63,0.15)", border:"rgba(45,106,63,0.35)" };
    if (hoursLeft<=24&&hoursLeft>0) return { label:"⚠ Moins de 24h", color:"#e07060", bg:"rgba(192,57,43,0.15)", border:"rgba(192,57,43,0.35)" };
    return { label:"À pronostiquer", color:"var(--gold)", bg:"rgba(227,6,19,0.08)", border:"rgba(227,6,19,0.25)" };
  }
  const pronoStatus = getPronoStatus();

  function toggleReaction(emoji) {
    setReactions(r=>{
      const prev=r[emoji]||{count:0,reacted:false};
      return {...r,[emoji]:{count:prev.reacted?prev.count-1:prev.count+1,reacted:!prev.reacted}};
    });
  }

  async function handlePredict() {
    if (home===""||away==="") { setMsg("Saisis les deux scores."); return; }
    setSaving(true); setMsg("");
    try {
      await apiCall("/predict",{method:"POST",body:JSON.stringify({matchId:match.id,predHome:+home,predAway:+away})},token);
      setMsg("✓ Pronostic enregistré !");
      onPredicted(match.id,+home,+away);
      setTimeout(()=>setMsg(""),2500);
    } catch(e) { setMsg(e.message); }
    finally { setSaving(false); }
  }

  return (
    <div className={`match-card ${locked?"locked":""}`}>
      {showMatchPronos && <MatchPronosModal matchId={match.id} token={token} onClose={()=>setShowMatchPronos(false)}/>}
      {showForm && <TeamFormModal match={match} onClose={()=>setShowForm(false)}/>}
      <div className="match-header">
        <div className="match-meta">J{match.matchday} · {formatDate(match.kickoff)}</div>
        <div className="match-badges">
          {pronoStatus && (
            <span style={{fontSize:"0.62rem",fontWeight:600,padding:"3px 9px",borderRadius:"2px",textTransform:"uppercase",letterSpacing:"0.08em",color:pronoStatus.color,background:pronoStatus.bg,border:`1px solid ${pronoStatus.border}`}}>
              {pronoStatus.label}
            </span>
          )}
          <span className={`status-pill status-${match.status}`}>
            {match.status==="live"?<><span className="live-dot"/>En direct</>:match.status==="finished"?"Terminé":"À venir"}
          </span>
        </div>
      </div>
      <div className="match-teams">
        <div className="match-team home"><span>{teamName(match.home_team)}</span><ClubLogo name={match.home_team}/></div>
        {match.status==="finished" ? <div className="match-score-display">{match.score_home}–{match.score_away}</div>
          : <div className="match-score-display pending">vs</div>}
        <div className="match-team away"><ClubLogo name={match.away_team}/><span>{teamName(match.away_team)}</span></div>
      </div>
      {!locked ? (
        <div className="prono-input-row">
          <span className="prono-label">Ton prono</span>
          <input className="score-input" type="number" min="0" max="20" value={home} onChange={e=>setHome(e.target.value)} placeholder="0"/>
          <span className="score-sep">–</span>
          <input className="score-input" type="number" min="0" max="20" value={away} onChange={e=>setAway(e.target.value)} placeholder="0"/>
          <button className="btn-predict" onClick={handlePredict} disabled={saving}>{saving?"...":prediction?"Modifier":"Valider"}</button>
          <span className="bareme-inline" title="Score exact: 6pts · Bonne diff: 4pts · Bon résultat: 2pts">6·4·2·0</span>
        </div>
      ) : prediction ? (
        <div className="prono-input-row">
          <span className="prono-label">Ton prono</span>
          <span style={{fontFamily:"var(--font-display)",fontSize:"1.05rem",color:"var(--gray)"}}>{prediction.pred_home}–{prediction.pred_away}</span>
          {match.status==="finished" && (
            <span className={ptsClass(prediction.points_earned)} style={{marginLeft:"auto"}}>{prediction.points_earned} pt{prediction.points_earned>1?"s":""}</span>
          )}
        </div>
      ) : (
        <div className="prono-input-row"><span className="prono-label" style={{color:"var(--gray)"}}>Pronostics fermés</span></div>
      )}
      {msg && <div style={{marginTop:8,fontSize:"0.78rem",color:msg.startsWith("✓")?"#7dcc8a":"#f08080"}}>{msg}</div>}
      {match.status==="finished" && (
        <div className="reactions-row">
          {REACTIONS.map(emoji=>{
            const r=reactions[emoji]||{count:0,reacted:false};
            return (
              <button key={emoji} className={`reaction-btn ${r.reacted?"reacted":""}`} onClick={()=>toggleReaction(emoji)}>
                <span>{emoji}</span>{r.count>0&&<span className="reaction-count">{r.count}</span>}
              </button>
            );
          })}
        </div>
      )}
      {(match.status==="finished"||match.status==="live") && (
        <button onClick={()=>setShowMatchPronos(true)} style={{marginTop:8,background:"none",border:"1px solid rgba(227,6,19,0.2)",borderRadius:"var(--radius)",padding:"5px 14px",color:"var(--gray)",fontSize:"0.65rem",fontFamily:"var(--font-body)",letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",width:"100%",transition:"all var(--transition)"}}>
          👁 Voir les pronostics
        </button>
      )}
      <button onClick={()=>setShowForm(true)} style={{marginTop:6,background:"none",border:"1px solid rgba(227,6,19,0.15)",borderRadius:"var(--radius)",padding:"5px 14px",color:"var(--gray)",fontSize:"0.65rem",fontFamily:"var(--font-body)",letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",width:"100%",transition:"all var(--transition)"}}>
        📊 Historique & Forme
      </button>
    </div>
  );
}

// ── Pronostics ────────────────────────────────────────────────────────────────
function PredictionsScreen({ matches, loading, token }) {
  const [predictions,setPredictions]           = useState({});
  const [activeDay,setActiveDay]               = useState(null);
  const [loadingPredictions,setLoadingPredictions] = useState(true);

  const days = [...new Set(matches.filter(m=>m.matchday).map(m=>m.matchday))].sort((a,b)=>a-b);

  useEffect(()=>{
    if (!token||matches.length===0) return;
    apiCall("/predictions",{},token)
      .then(d=>{ const map={}; (d.predictions||[]).forEach(p=>{map[p.match_id]=p;}); setPredictions(map); })
      .catch(console.error).finally(()=>setLoadingPredictions(false));
  },[matches,token]);

  useEffect(()=>{
    if (days.length>0&&activeDay===null) {
      const firstOpen = days.find(d=>matches.filter(m=>m.matchday===d).some(m=>m.status==="scheduled"&&new Date(m.kickoff)>new Date()));
      setActiveDay(firstOpen||days[days.length-1]);
    }
  },[matches]);

  function handlePredicted(matchId,home,away) { setPredictions(p=>({...p,[matchId]:{pred_home:home,pred_away:away,points_earned:0}})); }
  function dayStatus(d) {
    const ms=matches.filter(m=>m.matchday===d);
    if (ms.every(m=>m.status==="finished")) return "done";
    if (ms.some(m=>m.status==="live")) return "live";
    return "open";
  }

  if (loading||loadingPredictions) return <div className="spinner"/>;
  const currentMatches = activeDay ? matches.filter(m=>m.matchday===activeDay).sort((a,b)=>new Date(a.kickoff)-new Date(b.kickoff)) : [];

  return (
    <div>
      <div className="bareme-rappel">
        <span className="bareme-rappel-title">Barème ·</span>
        {[{pts:6,label:"Score exact",color:"var(--gold-light)"},{pts:4,label:"Bonne diff.",color:"var(--gold)"},{pts:2,label:"Bon résultat",color:"var(--gold-dim)"},{pts:0,label:"Raté",color:"var(--gray)"}].map((b,i,arr)=>(
          <span key={b.pts} className="bareme-rappel-item">
            <span className="bareme-rappel-pts" style={{color:b.color}}>{b.pts}pts</span>
            <span>{b.label}</span>
            {i<arr.length-1&&<span className="bareme-sep">·</span>}
          </span>
        ))}
      </div>
      <div className="matchday-tabs">
        {days.map(d=>(
          <button key={d} className={`matchday-tab ${activeDay===d?"active":""} ${dayStatus(d)==="done"?"done":""}`} onClick={()=>setActiveDay(d)}>
            {dayStatus(d)==="live"?"⚡ ":""}J{d}
          </button>
        ))}
      </div>
      {currentMatches.map(m=>(
        <PronoCard key={m.id} match={m} prediction={predictions[m.id]||null} token={token} onPredicted={handlePredicted}/>
      ))}
      {matches.length===0&&<div className="empty"><div className="empty-icon">⚽</div>Les matchs apparaîtront dès le début de la saison.</div>}
    </div>
  );
}

// ── Évolution ─────────────────────────────────────────────────────────────────
function EvolutionChart({ data }) {
  if (!data||data.days.length===0) return (
    <div className="empty" style={{padding:"24px 0"}}>
      <div className="empty-icon">📈</div>Le graphique apparaîtra dès la fin de la première journée.
    </div>
  );

  const W=600,H=220,PAD={top:16,right:16,bottom:28,left:36};
  const chartW=W-PAD.left-PAD.right, chartH=H-PAD.top-PAD.bottom;
  const allPts=data.series.flatMap(s=>s.points);
  const maxPts=Math.max(...allPts,1);
  const days=data.days;

  function xPos(i){return PAD.left+(i/(days.length-1||1))*chartW;}
  function yPos(v){return PAD.top+chartH-(v/maxPts)*chartH;}

  return (
    <div className="evolution-wrap">
      <div className="evolution-canvas-wrap">
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:"block"}}>
          {[0,0.25,0.5,0.75,1].map(t=>{
            const y=PAD.top+chartH*(1-t);
            return <g key={t}><line x1={PAD.left} y1={y} x2={W-PAD.right} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/><text x={PAD.left-6} y={y+4} textAnchor="end" fontSize="9" fill="#6b6358">{Math.round(maxPts*t)}</text></g>;
          })}
          {days.map((d,i)=><text key={d} x={xPos(i)} y={H-6} textAnchor="middle" fontSize="9" fill="#6b6358">J{d}</text>)}
          {data.series.map((s,si)=>{
            const color=CHART_COLORS[si%CHART_COLORS.length];
            const points=s.points;
            if (points.length===0) return null;
            const d=points.map((v,i)=>`${i===0?'M':'L'}${xPos(i)} ${yPos(v)}`).join(' ');
            return <g key={s.id}><path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>{points.map((v,i)=><circle key={i} cx={xPos(i)} cy={yPos(v)} r="3" fill={color}/>)}</g>;
          })}
        </svg>
      </div>
      <div className="evolution-legend">
        {data.series.map((s,si)=>(
          <div className="evolution-legend-item" key={s.id}>
            <div className="evolution-legend-dot" style={{background:CHART_COLORS[si%CHART_COLORS.length]}}/>
            <span>{s.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Distinctions ──────────────────────────────────────────────────────────────
const DEFAULT_DISTINCTIONS = [
  { emoji:"😵", label:"Canari d'Or", username:null, detail:"—" },
  { emoji:"❤️", label:"Meilleur pronostic SRFC", username:null, detail:"—" },
  { emoji:"🏆", label:"Roi du Score Exact", username:null, detail:"—" },
  { emoji:"⚽", label:"Meilleur · Phase aller", username:null, detail:"—" },
  { emoji:"⚽", label:"Meilleur · Phase retour", username:null, detail:"—" },
  { emoji:"🔥", label:"Meilleure série", username:null, detail:"—" },
];

function DistinctionsScreen({ token }) {
  const [distinctions,setDistinctions]=useState([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{ apiCall("/distinctions",{},token).then(d=>setDistinctions(d.distinctions||[])).catch(console.error).finally(()=>setLoading(false)); },[]);
  if (loading) return <div className="spinner"/>;
  const display=distinctions.length>0?distinctions:DEFAULT_DISTINCTIONS;
  return (
    <div>
      <div className="section-title" style={{marginTop:8}}>Distinctions</div>
      <div className="distinctions-grid">
        {display.map((d,i)=>(
          <div className="distinction-card" key={i}>
            <div className="distinction-emoji">
              {d.label.includes("Canari")
                ? <img src="https://crests.football-data.org/543.png" alt="FC Nantes" style={{width:32,height:32,objectFit:"contain"}}/>
                : d.emoji}
            </div>
            <div><div className="distinction-label">{d.label}</div><div className={`distinction-winner ${!d.username?"empty":""}`}>{d.username||"À déterminer"}</div></div>
            <div className="distinction-detail">{d.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Classement ────────────────────────────────────────────────────────────────
function RankingScreen({ currentUser, token }) {
  const [ranking,setRanking]     = useState([]);
  const [evolution,setEvolution] = useState(null);
  const [series,setSeries]       = useState([]);
  const [loading,setLoading]     = useState(true);
  const [subTab,setSubTab]       = useState("classement");
  const [histoUser,setHistoUser] = useState(null);

  useEffect(()=>{
    Promise.all([
      apiCall("/ranking"),
      apiCall("/evolution"),
      apiCall("/series"),
    ]).then(([r,e,s])=>{ setRanking(r.classement||[]); setEvolution(e); setSeries(s.series||[]); })
      .catch(console.error).finally(()=>setLoading(false));
  },[]);

  const top3=ranking.filter(r=>r.rang<=3).slice(0,3);
  const podium=[top3[1],top3[0],top3[2]].filter(Boolean);
  if (loading) return <div className="spinner"/>;

  function getStreak(userId) { const s=series.find(s=>s.id===userId); return s?.streak||0; }

  return (
    <div>
      {histoUser && <HistoriqueModal userId={histoUser.id} token={token} onClose={()=>setHistoUser(null)}/>}
      <div className="tabs-sub">
        <button className={`tab-sub ${subTab==="classement"?"active":""}`} onClick={()=>setSubTab("classement")}>Classement</button>
        <button className={`tab-sub ${subTab==="evolution"?"active":""}`} onClick={()=>setSubTab("evolution")}>Évolution</button>
        <button className={`tab-sub ${subTab==="distinctions"?"active":""}`} onClick={()=>setSubTab("distinctions")}>Distinctions</button>
      </div>
      {subTab==="classement" && (
        <>
          <div className="section-title">Podium</div>
          {top3.length>=2 ? (
            <div className="podium">
              {podium.map(p=>p&&(
                <div key={p.id} className={`podium-card rank-${p.rang}`} onClick={()=>setHistoUser(p)}>
                  {p.rang===1&&<div className="crown">🏆</div>}
                  <div className="podium-rank">#{p.rang}</div>
                  <div className="podium-name">{p.username}{getStreak(p.id)>=2&&<span style={{fontSize:"0.7rem",marginLeft:4}}>🔥{getStreak(p.id)}</span>}</div>
                  <div className="podium-pts">{p.total}<span style={{fontSize:"0.72rem",fontFamily:"var(--font-body)",color:"var(--gray)",marginLeft:4}}>pts</span></div>
                  {p.scores_exacts>0&&<div style={{fontSize:"0.7rem",color:"var(--gray)",marginTop:4}}>{p.scores_exacts} exact{p.scores_exacts>1?"s":""}</div>}
                </div>
              ))}
            </div>
          ) : (
            <div className="podium" style={{marginBottom:24}}>
              {[2,1,3].map(rank=>(
                <div key={rank} className={`podium-card rank-${rank}`} style={{opacity:0.3}}>
                  {rank===1&&<div className="crown">🏆</div>}
                  <div className="podium-rank">#{rank}</div>
                  <div className="podium-name" style={{color:"var(--gray)"}}>—</div>
                  <div className="podium-pts" style={{color:"var(--gray)"}}>—</div>
                </div>
              ))}
            </div>
          )}
          <div className="section-title">Classement complet</div>
          {ranking.length===0 ? (
            <div style={{background:"var(--coal)",border:"1px solid rgba(227,6,19,0.08)",borderRadius:"var(--radius)",padding:"20px 16px",color:"var(--gray)",fontSize:"0.78rem",textAlign:"center",letterSpacing:"0.08em",textTransform:"uppercase"}}>
              Les points seront attribués dès le premier match terminé
            </div>
          ) : (
            <>
              <div className="rank-hint">Clique sur un joueur pour voir ses pronostics</div>
              <div className="rank-list">
                {ranking.map(row=>{
                  const streak=getStreak(row.id);
                  return (
                    <div key={row.id} className={`rank-row ${row.id===currentUser?.id?"me":""}`} onClick={()=>setHistoUser(row)}>
                      <div className="rank-num">{row.rang}</div>
                      <div>
                        <div className="rank-username">
                          {row.username}
                          {row.id===currentUser?.id&&<span style={{fontSize:"0.68rem",color:"var(--gold)",marginLeft:8}}>← toi</span>}
                          {streak>=2&&<span className="streak-badge">🔥{streak}</span>}
                        </div>
                        <div className="rank-detail">{row.pronos_joues} matchs · {row.scores_exacts} exacts{row.points_bonus>0?` · +${row.points_bonus} bonus`:""}</div>
                      </div>
                      <div className="rank-total">{row.total}<span>pts</span></div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
      {subTab==="evolution" && (
        <>
          <div className="section-title">Évolution du classement</div>
          <EvolutionChart data={evolution}/>
        </>
      )}
      {subTab==="distinctions" && <DistinctionsScreen token={token}/>}
    </div>
  );
}

// ── Bonus saison ──────────────────────────────────────────────────────────────
function ClubSelect({ value, onChange, disabled }) {
  return (
    <select value={value||""} onChange={e=>onChange(e.target.value)} disabled={disabled}
      style={{width:"100%",padding:"10px 12px",background:"#1a0000",border:"1px solid rgba(227,6,19,0.2)",borderRadius:"4px",color:value?"#f2ead8":"#9a8f85",fontFamily:"'Josefin Sans',sans-serif",fontSize:"0.85rem",outline:"none",cursor:disabled?"default":"pointer"}}>
      <option value="">— Choisir un club —</option>
      {CLUBS_L1.map(c=><option key={c} value={c}>{c}</option>)}
    </select>
  );
}

function AllBonusModal({ token }) {
  const [show, setShow]       = useState(false);
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const LOCK_DATE = new Date('2026-09-02T21:00:00Z');
  const isOpen = new Date() >= LOCK_DATE;

  async function handleShow() {
    setShow(true); setLoading(true);
    try {
      const d = await apiCall("/bonus-saison/all", {}, token);
      setData(d.bonus || []);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }

  if (!isOpen) return (
    <div style={{marginTop:16,textAlign:"center",fontSize:"0.72rem",color:"var(--gray)"}}>
      🔒 Les pronostics de tous les participants seront visibles après le 2 septembre 2026.
    </div>
  );

  return (
    <>
      <button onClick={handleShow} style={{marginTop:16,width:"100%",padding:"11px",background:"none",border:"1px solid rgba(227,6,19,0.3)",borderRadius:"var(--radius)",color:"var(--gold)",fontFamily:"var(--font-body)",fontSize:"0.75rem",fontWeight:600,letterSpacing:"0.14em",textTransform:"uppercase",cursor:"pointer"}}>
        👁 Voir les pronostics de tous
      </button>
      {show && (
        <div className="modal-overlay" onClick={()=>setShow(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Pronostics Bonus Saison</div>
              <button className="modal-close" onClick={()=>setShow(false)}>✕</button>
            </div>
            <div className="modal-body">
              {loading ? <div className="spinner"/> : error ? <div style={{color:"#f08080"}}>{error}</div> : (
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {data?.map((b,i)=>(
                    <div key={i} style={{background:"var(--charcoal)",border:"1px solid rgba(227,6,19,0.1)",borderRadius:"var(--radius)",padding:"12px 16px"}}>
                      <div style={{fontWeight:600,color:"var(--gold)",marginBottom:8,fontSize:"0.85rem",letterSpacing:"0.08em",textTransform:"uppercase"}}>{b.username}</div>
                      {[
                        {l:"🏆 Champion", v:b.champion},
                        {l:"🇪🇺 Euro 1", v:b.euro1},
                        {l:"🇪🇺 Euro 2", v:b.euro2},
                        {l:"🇪🇺 Euro 3", v:b.euro3},
                        {l:"🇪🇺 Euro 4", v:b.euro4},
                        {l:"⚠️ Barragiste", v:b.barragiste},
                        {l:"⬇️ 18e", v:b.relegate1},
                        {l:"⬇️ 17e", v:b.relegate2},
                        {l:"⚽ Meilleur buteur", v:b.meilleur_buteur},
                        {l:"❤️ Classement Rennes", v:b.classement_rennes},
                      ].map((row,j)=>(
                        <div key={j} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid rgba(255,255,255,0.03)",fontSize:"0.75rem"}}>
                          <span style={{color:"var(--gray)"}}>{row.l}</span>
                          <span style={{color:"var(--cream)",fontWeight:600}}>{row.v || "—"}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function BonusScreen({ token }) {
  const [locked, setLocked] = useState(false);
  const [form, setForm]     = useState({
    champion:"", euro1:"", euro2:"", euro3:"", euro4:"",
    barragiste:"", relegate1:"", relegate2:"",
    meilleur_buteur:"", classement_rennes:""
  });
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState("");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(()=>{
    apiCall("/bonus-saison",{},token).then(d=>{
      setLocked(d.locked);
      if (d.bonus) {
        setForm({
          champion: d.bonus.champion||"",
          euro1: d.bonus.euro1||"", euro2: d.bonus.euro2||"",
          euro3: d.bonus.euro3||"", euro4: d.bonus.euro4||"",
          barragiste: d.bonus.barragiste||"",
          relegate1: d.bonus.relegate1||"", relegate2: d.bonus.relegate2||"",
          meilleur_buteur: d.bonus.meilleur_buteur||"",
          classement_rennes: d.bonus.classement_rennes||""
        });
        setConfirmed(true);
      }
    }).catch(console.error);
  },[]);

  async function handleSave() {
    setSaving(true); setMsg("");
    try {
      await apiCall("/bonus-saison",{method:"POST",body:JSON.stringify(form)},token);
      setMsg("✅ Bonus saison enregistré !");
      setConfirmed(true);
      setTimeout(()=>setMsg(""),3000);
    } catch(e) { setMsg("❌ "+e.message); }
    finally { setSaving(false); }
  }

  const questions = [
    { key:"champion",          label:"🏆 Champion de Ligue 1",                         pts:15, type:"club" },
    { key:"euro1",             label:"🇪🇺 1er qualifié européen",                       pts:10, type:"club" },
    { key:"euro2",             label:"🇪🇺 2e qualifié européen",                        pts:10, type:"club" },
    { key:"euro3",             label:"🇪🇺 3e qualifié européen",                        pts:10, type:"club" },
    { key:"euro4",             label:"🇪🇺 4e qualifié européen",                        pts:10, type:"club" },
    { key:"barragiste",        label:"⚠️ Barragiste",                                   pts:10, type:"club" },
    { key:"relegate1",         label:"⬇️ 18e — Relégué direct",                        pts:10, type:"club" },
    { key:"relegate2",         label:"⬇️ 17e — Relégué direct",                        pts:10, type:"club" },
    { key:"meilleur_buteur",   label:"⚽ Meilleur buteur",                              pts:10, type:"text",   placeholder:"Nom du joueur..." },
    { key:"classement_rennes", label:"❤️ Classement final Rennes (position exacte)",   pts:15, type:"number", placeholder:"ex: 7" },
  ];

  return (
    <div>
      <div className="bonus-intro">
        <p>Pronostics de début de saison à soumettre <strong>avant le 2 septembre 2026 à 23h00</strong>. Modifiables jusqu'à la clôture du mercato.</p>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:12,paddingTop:12,borderTop:"1px solid rgba(255,255,255,0.05)"}}>
          {[{l:"Champion",p:15},{l:"4 qualifiés européens",p:"4×10"},{l:"Barragiste",p:10},{l:"2 relégués",p:"2×10"},{l:"Meilleur buteur",p:10},{l:"Classement Rennes",p:15}].map(b=>(
            <span key={b.l} style={{display:"flex",alignItems:"center",gap:6,fontSize:"0.68rem",color:"var(--gray)"}}>
              <span style={{fontFamily:"var(--font-display)",fontSize:"1rem",color:"var(--gold)"}}>{b.p}</span>{b.l}
            </span>
          ))}
        </div>
      </div>

      {locked && <div style={{background:"rgba(192,57,43,0.1)",border:"1px solid rgba(192,57,43,0.25)",borderRadius:"4px",padding:"10px 16px",fontSize:"0.78rem",color:"#d07060",marginBottom:16}}>🔒 Les bonus de début de saison sont fermés.</div>}

      {questions.map(q=>(
        <div key={q.key} style={{background:"var(--coal)",border:`1px solid ${form[q.key]?"rgba(45,106,63,0.35)":"rgba(227,6,19,0.1)"}`,borderRadius:"4px",padding:"14px 18px",marginBottom:8}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{fontSize:"0.78rem",fontWeight:600,color:"var(--cream)"}}>{q.label}</div>
            <div style={{fontFamily:"var(--font-display)",fontSize:"1.2rem",fontWeight:600,color:"var(--gold)"}}>{q.pts}<span style={{fontFamily:"var(--font-body)",fontSize:"0.6rem",color:"var(--gray)",marginLeft:2}}>pts</span></div>
          </div>
          {q.type==="club" && <ClubSelect value={form[q.key]} onChange={v=>setForm(f=>({...f,[q.key]:v}))} disabled={locked}/>}
          {q.type==="text" && <input value={form[q.key]} onChange={e=>setForm(f=>({...f,[q.key]:e.target.value}))} disabled={locked} placeholder={q.placeholder}
            style={{width:"100%",padding:"10px 12px",background:"#1a0000",border:"1px solid rgba(227,6,19,0.2)",borderRadius:"4px",color:"var(--cream)",fontFamily:"var(--font-body)",fontSize:"0.85rem",outline:"none"}}/>}
          {q.type==="number" && <input type="number" min="1" max="18" value={form[q.key]} onChange={e=>setForm(f=>({...f,[q.key]:e.target.value}))} disabled={locked} placeholder={q.placeholder}
            style={{width:"100%",padding:"10px 12px",background:"#1a0000",border:"1px solid rgba(227,6,19,0.2)",borderRadius:"4px",color:"var(--cream)",fontFamily:"var(--font-body)",fontSize:"0.85rem",outline:"none"}}/>}
        </div>
      ))}

      {!locked && (
        <div style={{marginTop:16}}>
          {msg && <div style={{marginBottom:10,fontSize:"0.78rem",color:msg.startsWith("✅")?"#7dcc8a":"#f08080"}}>{msg}</div>}
          <button onClick={handleSave} disabled={saving}
            style={{width:"100%",padding:"13px",background:"var(--gold)",color:"var(--obsidian)",border:"none",borderRadius:"4px",fontFamily:"var(--font-body)",fontSize:"0.75rem",fontWeight:600,letterSpacing:"0.18em",textTransform:"uppercase",cursor:"pointer"}}>
            {saving?"Enregistrement…":confirmed?"Mettre à jour mes pronostics":"Valider mes pronostics bonus"}
          </button>
        </div>
      )}
      <AllBonusModal token={token}/>
    </div>
  );
}

// ── Historique ────────────────────────────────────────────────────────────────
const CDM_2026 = [
  { rang:1, username:"JeanClaudeVanDamme", total:214, points_matchs:214, points_bonus:0, scores_exacts:10 },
  { rang:2, username:"Xavier le terrassier", total:211, points_matchs:196, points_bonus:15, scores_exacts:13 },
  { rang:3, username:"La Queen", total:210, points_matchs:200, points_bonus:10, scores_exacts:12 },
  { rang:4, username:"JeffleCannibale", total:200, points_matchs:200, points_bonus:0, scores_exacts:9 },
  { rang:5, username:"Donald Trump POTUS", total:186, points_matchs:186, points_bonus:0, scores_exacts:12 },
  { rang:6, username:"Laguerta", total:170, points_matchs:160, points_bonus:10, scores_exacts:10 },
  { rang:6, username:"LeViking!", total:170, points_matchs:160, points_bonus:10, scores_exacts:9 },
  { rang:8, username:"NicoLaFaucheuse", total:48, points_matchs:48, points_bonus:0, scores_exacts:3 },
];

function HistoriqueScreen() {
  return (
    <div>
      <div className="section-title">🏆 Coupe du Monde 2026</div>
      <div style={{background:"var(--coal)",border:"1px solid rgba(227,6,19,0.15)",borderRadius:"var(--radius)",padding:"14px 18px",marginBottom:20,fontSize:"0.78rem",color:"var(--gray)",lineHeight:1.7}}>
        <strong style={{color:"var(--cream)"}}>Vainqueur :</strong> 🇪🇸 Espagne · <strong style={{color:"var(--cream)"}}>Meilleur buteur :</strong> Kylian Mbappé 🇫🇷
      </div>
      <div className="podium" style={{marginBottom:24}}>
        {[CDM_2026[1], CDM_2026[0], CDM_2026[2]].map(p=>(
          <div key={p.username} className={`podium-card rank-${p.rang}`}>
            {p.rang===1&&<div className="crown">🏆</div>}
            <div className="podium-rank">#{p.rang}</div>
            <div className="podium-name">{p.username}</div>
            <div className="podium-pts">{p.total}<span style={{fontSize:"0.72rem",fontFamily:"var(--font-body)",color:"var(--gray)",marginLeft:4}}>pts</span></div>
            <div style={{fontSize:"0.7rem",color:"var(--gray)",marginTop:4}}>{p.scores_exacts} exacts</div>
          </div>
        ))}
      </div>
      <div className="section-title">Classement complet</div>
      <div className="rank-list">
        {CDM_2026.map((row,i)=>(
          <div key={i} className="rank-row" style={{cursor:"default"}}>
            <div className="rank-num">{row.rang}</div>
            <div>
              <div className="rank-username">{row.username}</div>
              <div className="rank-detail">{row.scores_exacts} exacts · +{row.points_bonus} bonus</div>
            </div>
            <div className="rank-total">{row.total}<span>pts</span></div>
          </div>
        ))}
      </div>
      <div className="section-title" style={{marginTop:24}}>Distinctions CDM 2026</div>
      <div className="distinctions-grid">
        {[
          { emoji:"🥇", label:"Champion des Pronos", username:"JeanClaudeVanDamme", detail:"214 pts" },
          { emoji:"🏆", label:"Roi du Score Exact", username:"Xavier le terrassier", detail:"13 exacts" },
          { emoji:"🎯", label:"Roi des Bonus", username:"Xavier le terrassier", detail:"15 pts bonus" },
          { emoji:"🥴", label:"Lanterne Rouge", username:"NicoLaFaucheuse", detail:"48 pts" },
        ].map((d,i)=>(
          <div className="distinction-card" key={i}>
            <div className="distinction-emoji">{d.emoji}</div>
            <div><div className="distinction-label">{d.label}</div><div className="distinction-winner">{d.username}</div></div>
            <div className="distinction-detail">{d.detail}</div>
          </div>
        ))}
      </div>
      <div className="section-title" style={{marginTop:24}}>Palmarès Pronos Socios SRFC</div>
      <div style={{background:"var(--coal)",border:"1px solid rgba(227,6,19,0.1)",borderRadius:"var(--radius)",overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead>
            <tr style={{borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
              <th style={{padding:"8px 14px",fontSize:"0.6rem",color:"var(--gray)",textTransform:"uppercase",letterSpacing:"0.1em",textAlign:"left"}}>Saison</th>
              <th style={{padding:"8px 14px",fontSize:"0.6rem",color:"var(--gray)",textTransform:"uppercase",letterSpacing:"0.1em",textAlign:"left"}}>🥇 1er</th>
              <th style={{padding:"8px 14px",fontSize:"0.6rem",color:"var(--gray)",textTransform:"uppercase",letterSpacing:"0.1em",textAlign:"left"}}>🥈 2e</th>
              <th style={{padding:"8px 14px",fontSize:"0.6rem",color:"var(--gray)",textTransform:"uppercase",letterSpacing:"0.1em",textAlign:"left"}}>🥉 3e</th>
            </tr>
          </thead>
          <tbody>
            {[
              { saison:"2022-2023", p1:"Alexandre & Gaël", p2:"—", p3:"Théo" },
              { saison:"2023-2024", p1:"Alexandre", p2:"Gaël", p3:"Nicolas" },
              { saison:"2024-2025", p1:"Margot", p2:"Gaël", p3:"Alexandre" },
              { saison:"2025-2026", p1:"Pierre", p2:"Gaël", p3:"Johann" },
              { saison:"CDM 2026", p1:"Alexandre (JCVD)", p2:"Gaël (Xavier)", p3:"Margot (La Queen)" },
            ].map((s,i)=>(
              <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
                <td style={{padding:"9px 14px",fontSize:"0.78rem",fontWeight:600,color:"var(--gold)"}}>{s.saison}</td>
                <td style={{padding:"9px 14px",fontSize:"0.78rem",color:"var(--cream)"}}>{s.p1}</td>
                <td style={{padding:"9px 14px",fontSize:"0.78rem",color:"var(--gray)"}}>{s.p2}</td>
                <td style={{padding:"9px 14px",fontSize:"0.78rem",color:"var(--gray)"}}>{s.p3}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Actu ──────────────────────────────────────────────────────────────────────
function ActuScreen() {
  const [l1, setL1]               = useState([]);
  const [srfc, setSrfc]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState("srfc");

  useEffect(()=>{
    apiCall("/actu").then(d=>{
      setL1(d.l1||[]);
      setSrfc(d.srfc||[]);
    }).catch(console.error).finally(()=>setLoading(false));
  },[]);

  const articles = activeTab==="srfc" ? srfc : l1;

  return (
    <div>
      <div className="tabs-sub">
        <button className={`tab-sub ${activeTab==="srfc"?"active":""}`} onClick={()=>setActiveTab("srfc")}>❤️ Stade Rennais</button>
        <button className={`tab-sub ${activeTab==="l1"?"active":""}`} onClick={()=>setActiveTab("l1")}>⚽ Ligue 1</button>
      </div>
      {loading ? <div className="spinner"/> : articles.length===0 ? (
        <div className="empty"><div className="empty-icon">📰</div>Aucune actualité disponible.</div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {articles.map((a,i)=>(
            <a key={i} href={a.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
              <div style={{background:"var(--coal)",border:"1px solid rgba(227,6,19,0.1)",borderRadius:"var(--radius)",padding:"14px 16px",display:"grid",gridTemplateColumns:"1fr auto",gap:12,alignItems:"center"}}>
                <div>
                  <div style={{fontSize:"0.6rem",color:"var(--gray)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>
                    {a.source?.name} · {new Date(a.publishedAt).toLocaleDateString("fr-FR",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})}
                  </div>
                  <div style={{fontSize:"0.85rem",fontWeight:600,color:"var(--cream)",lineHeight:1.4,marginBottom:4}}>{a.title}</div>
                  {a.description && <div style={{fontSize:"0.72rem",color:"var(--gray)",lineHeight:1.5}}>{a.description?.slice(0,120)}…</div>}
                </div>
                {a.urlToImage && <img src={a.urlToImage} alt="" style={{width:72,height:72,objectFit:"cover",borderRadius:"var(--radius)",flexShrink:0}} onError={e=>e.target.style.display='none'}/>}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [user,setUser]           = useState(()=>{ try{return JSON.parse(localStorage.getItem('pronos_user'));}catch(e){return null;} });
  const [token,setToken]         = useState(()=>localStorage.getItem('pronos_token')||null);
  const [tab,setTab]             = useState("accueil");
  const [matches,setMatches]     = useState([]);
  const [loading,setLoading]     = useState(true);
  const [showAdmin,setShowAdmin] = useState(false);

  useEffect(()=>{ if (!user) return; apiCall("/matches").then(d=>setMatches(d.matches||[])).catch(console.error).finally(()=>setLoading(false)); },[user]);

  function handleLogin(u,t){
    localStorage.removeItem('pronos_user'); localStorage.removeItem('pronos_token');
    setUser(u); setToken(t);
    localStorage.setItem('pronos_user',JSON.stringify(u));
    localStorage.setItem('pronos_token',t);
  }
  function handleLogout(){
    setUser(null); setToken(null); setMatches([]); setLoading(true); setShowAdmin(false);
    localStorage.removeItem('pronos_user'); localStorage.removeItem('pronos_token');
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <header className="header">
          <div className="logo" onClick={()=>setTab("accueil")}>
            <img src={SRFC_LOGO} alt="SRFC"/>
            SRFC <span>Pronos L1</span>
          </div>
          {user ? (
            <div className="user-pill">
              <div className="avatar">{user.username[0].toUpperCase()}</div>
              <span>{user.username}</span>
              {user.role==='admin'&&<button className="btn-logout" onClick={()=>setShowAdmin(true)} style={{color:'var(--gold-dim)'}}>Admin</button>}
              <button className="btn-logout" onClick={handleLogout}>Déconnexion</button>
            </div>
          ) : (
            <div style={{fontSize:"0.75rem",color:"var(--gray)",letterSpacing:"0.1em",textTransform:"uppercase"}}>Socios SRFC · 2026-2027</div>
          )}
        </header>

        {!user ? <AuthScreen onLogin={handleLogin}/> : (
          <>
            {showAdmin ? <AdminScreen onBack={()=>setShowAdmin(false)}/> : (
              <>
                <div className="tabs-main">
                  <button className={`tab-main ${tab==="accueil"?"active":""}`} onClick={()=>setTab("accueil")}>🏠 Accueil</button>
                  <button className={`tab-main ${tab==="resultats"?"active":""}`} onClick={()=>setTab("resultats")}>Résultats</button>
                  <button className={`tab-main ${tab==="pronostics"?"active":""}`} onClick={()=>setTab("pronostics")}>Pronostics</button>
                  <button className={`tab-main ${tab==="bonus"?"active":""}`} onClick={()=>setTab("bonus")}>Bonus</button>
                  <button className={`tab-main ${tab==="classement"?"active":""}`} onClick={()=>setTab("classement")}>Classement</button><button className={`tab-main ${tab==="actu"?"active":""}`} onClick={()=>setTab("actu")}>Actu</button>
                </div>
                {tab==="accueil"    && <HomeScreen matches={matches} token={token} currentUser={user} onNavigate={setTab}/>}
                {tab==="resultats"  && <ResultsScreen matches={matches} loading={loading}/>}
                {tab==="pronostics" && <PredictionsScreen matches={matches} loading={loading} token={token}/>}
                {tab==="bonus"      && <BonusScreen token={token}/>}
                {tab==="classement" && <RankingScreen currentUser={user} token={token}/>}
                {tab==="historique" && <HistoriqueScreen/>}{tab==="actu" && <ActuScreen/>}
              </>
            )}
          </>
        )}

        <footer className="footer">
          <span style={{color:"var(--gray)",fontSize:"0.68rem",letterSpacing:"0.1em",textTransform:"uppercase"}}>🔴⚫ Socios SRFC · Saison 2026-2027</span>
          <button onClick={()=>setTab("historique")} style={{background:"none",border:"none",cursor:"pointer",color:"var(--gray)",fontSize:"0.65rem",fontFamily:"var(--font-body)",letterSpacing:"0.1em",textTransform:"uppercase",marginTop:8,display:"block",margin:"8px auto 0",textDecoration:"underline"}}>
            📜 Historique & Palmarès
          </button>
        </footer>
      </div>
    </>
  );
}