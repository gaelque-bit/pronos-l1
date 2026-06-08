import { useState, useEffect } from "react";
import AdminScreen from './AdminScreen';

const FLAGS = {
  "Algeria":"🇩🇿","Argentina":"🇦🇷","Australia":"🇦🇺","Austria":"🇦🇹",
  "Belgium":"🇧🇪","Bosnia-H.":"🇧🇦","Bosnia-Herzegovina":"🇧🇦",
  "Brazil":"🇧🇷","Brésil":"🇧🇷","Canada":"🇨🇦","Cape Verde":"🇨🇻",
  "Chile":"🇨🇱","Colombia":"🇨🇴","Congo DR":"🇨🇩","Costa Rica":"🇨🇷",
  "Croatia":"🇭🇷","Curaçao":"🇨🇼","Czechia":"🇨🇿","Ecuador":"🇪🇨",
  "Egypt":"🇪🇬","England":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","France":"🇫🇷","Germany":"🇩🇪",
  "Ghana":"🇬🇭","Guatemala":"🇬🇹","Haiti":"🇭🇹","Honduras":"🇭🇳",
  "Iran":"🇮🇷","Iraq":"🇮🇶","Ivory Coast":"🇨🇮","Japan":"🇯🇵",
  "Jordan":"🇯🇴","Korea Republic":"🇰🇷","Mexico":"🇲🇽","Morocco":"🇲🇦",
  "Netherlands":"🇳🇱","New Zealand":"🇳🇿","Nigeria":"🇳🇬","Norway":"🇳🇴",
  "Panama":"🇵🇦","Paraguay":"🇵🇾","Peru":"🇵🇪","Poland":"🇵🇱",
  "Portugal":"🇵🇹","Qatar":"🇶🇦","Saudi Arabia":"🇸🇦","Scotland":"🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "Senegal":"🇸🇳","Serbia":"🇷🇸","South Africa":"🇿🇦","Spain":"🇪🇸",
  "Sweden":"🇸🇪","Switzerland":"🇨🇭","Tunisia":"🇹🇳","Turkey":"🇹🇷",
  "USA":"🇺🇸","Uruguay":"🇺🇾","Uzbekistan":"🇺🇿","Venezuela":"🇻🇪",
  "Wales":"🏴󠁧󠁢󠁷󠁬󠁳󠁿","Cameroon":"🇨🇲","Bolivia":"🇧🇴",
};

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

const flag     = (name) => FLAGS[name] || "🏳️";
const teamName = (name) => TEAM_NAMES_FR[name] || name;

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Josefin+Sans:wght@300;400;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --obsidian:#0c0b0a; --charcoal:#161411; --coal:#1e1b17; --muted:#2c2820;
    --gold:#c9a84c; --gold-light:#e8c97a; --gold-dim:#7a6130;
    --cream:#f2ead8; --gray:#6b6358; --red:#c0392b;
    --green-q:#2d6a3f;
    --font-display:'Cormorant Garamond',Georgia,serif;
    --font-body:'Josefin Sans',sans-serif;
    --radius:4px; --transition:0.22s ease;
  }
  body { background:var(--obsidian); color:var(--cream); font-family:var(--font-body); font-weight:300; letter-spacing:0.03em; min-height:100vh; background-image:radial-gradient(ellipse 80% 50% at 50% -10%,rgba(201,168,76,0.07) 0%,transparent 70%); }
  .app { max-width:900px; margin:0 auto; padding:0 20px 80px; }
  .header { padding:32px 0 20px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid rgba(201,168,76,0.18); margin-bottom:32px; }
  .logo { font-family:var(--font-display); font-size:1.7rem; font-weight:600; letter-spacing:0.18em; color:var(--gold); text-transform:uppercase; }
  .logo span { color:var(--cream); font-weight:400; font-style:italic; }
  .user-pill { display:flex; align-items:center; gap:10px; background:var(--coal); border:1px solid rgba(201,168,76,0.2); border-radius:50px; padding:6px 16px 6px 8px; font-size:0.78rem; letter-spacing:0.08em; }
  .avatar { width:28px; height:28px; background:var(--gold-dim); border:1px solid var(--gold); border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-size:1rem; color:var(--gold-light); }
  .btn-logout { background:none; border:none; cursor:pointer; color:var(--gray); font-size:0.72rem; letter-spacing:0.06em; padding:0; transition:color var(--transition); font-family:var(--font-body); }
  .btn-logout:hover { color:var(--red); }
  .tabs-main { display:flex; border-bottom:1px solid rgba(201,168,76,0.15); margin-bottom:28px; }
  .tab-main { flex:1; padding:14px 10px; background:none; border:none; cursor:pointer; border-bottom:2px solid transparent; margin-bottom:-1px; font-family:var(--font-body); font-size:0.75rem; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:var(--gray); transition:all var(--transition); }
  .tab-main.active { color:var(--gold); border-bottom-color:var(--gold); }
  .tab-main:hover:not(.active) { color:var(--cream); }
  .tabs-sub { display:flex; gap:6px; margin-bottom:24px; }
  .tab-sub { padding:7px 16px; background:var(--coal); border:1px solid rgba(201,168,76,0.1); border-radius:2px; cursor:pointer; font-family:var(--font-body); font-size:0.7rem; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:var(--gray); transition:all var(--transition); }
  .tab-sub.active { background:rgba(201,168,76,0.1); border-color:rgba(201,168,76,0.3); color:var(--gold); }
  .tab-sub:hover:not(.active) { color:var(--cream); }
  .section-title { font-family:var(--font-display); font-size:1.2rem; font-weight:400; font-style:italic; color:var(--gold); margin-bottom:14px; display:flex; align-items:center; gap:12px; }
  .section-title::after { content:''; flex:1; height:1px; background:linear-gradient(to right,rgba(201,168,76,0.25),transparent); }
  .groups-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(380px,1fr)); gap:16px; }
  .group-card { background:var(--coal); border:1px solid rgba(201,168,76,0.1); border-radius:var(--radius); overflow:hidden; }
  .group-header { background:rgba(201,168,76,0.07); border-bottom:1px solid rgba(201,168,76,0.12); padding:10px 16px; display:flex; align-items:center; justify-content:space-between; }
  .group-name { font-family:var(--font-display); font-size:1.05rem; font-weight:600; letter-spacing:0.12em; color:var(--gold); text-transform:uppercase; }
  .standings-table { width:100%; border-collapse:collapse; }
  .standings-table th { font-size:0.58rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:var(--gray); padding:7px 8px; text-align:center; border-bottom:1px solid rgba(255,255,255,0.05); }
  .standings-table th.th-team { text-align:left; padding-left:14px; }
  .standings-table td { padding:8px 8px; font-size:0.78rem; text-align:center; border-bottom:1px solid rgba(255,255,255,0.04); }
  .standings-table td.td-team { text-align:left; padding-left:14px; }
  .standings-table tr:last-child td { border-bottom:none; }
  .standings-table tr.qualified td { background:rgba(45,106,63,0.08); }
  .standings-table tr.qualified td.td-team { border-left:2px solid var(--green-q); }
  .rank-badge { display:inline-flex; align-items:center; justify-content:center; width:18px; height:18px; border-radius:50%; font-family:var(--font-display); font-style:italic; font-size:0.85rem; color:var(--gray); margin-right:8px; }
  .rank-badge.q { color:var(--gold); }
  .team-flag { font-size:1rem; margin-right:6px; }
  .team-name-cell { font-weight:600; letter-spacing:0.03em; font-size:0.78rem; }
  .pts-cell { font-family:var(--font-display); font-size:1rem; font-weight:600; color:var(--gold); }
  .group-matches { border-top:1px solid rgba(255,255,255,0.05); }
  .group-match-row { display:grid; grid-template-columns:1fr auto 1fr auto; align-items:center; gap:8px; padding:9px 14px; border-bottom:1px solid rgba(255,255,255,0.03); font-size:0.8rem; }
  .group-match-row:last-child { border-bottom:none; }
  .gm-home { text-align:right; font-weight:500; display:flex; align-items:center; justify-content:flex-end; gap:6px; }
  .gm-away { text-align:left; font-weight:500; display:flex; align-items:center; gap:6px; }
  .gm-score { font-family:var(--font-display); font-size:1rem; color:var(--gold); text-align:center; min-width:44px; font-weight:600; }
  .gm-score.pending { color:var(--gray); font-family:var(--font-body); font-size:0.65rem; letter-spacing:0.06em; text-transform:uppercase; }
  .gm-date { font-size:0.62rem; color:var(--gray); white-space:nowrap; text-align:right; }
  .live-dot { display:inline-block; width:5px; height:5px; background:#e07060; border-radius:50%; margin-right:3px; animation:pulse 1.2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.3} }
  .knockout-stage { margin-bottom:28px; }
  .knockout-match { background:var(--coal); border:1px solid rgba(201,168,76,0.1); border-radius:var(--radius); padding:14px 18px; margin-bottom:8px; display:grid; grid-template-columns:1fr auto 1fr; align-items:center; gap:14px; transition:border-color var(--transition); }
  .knockout-match:hover { border-color:rgba(201,168,76,0.22); }
  .ko-team { font-family:var(--font-display); font-size:1.1rem; font-weight:600; letter-spacing:0.05em; display:flex; align-items:center; gap:8px; }
  .ko-team.home { justify-content:flex-end; }
  .ko-team.away { justify-content:flex-start; }
  .ko-score { font-family:var(--font-display); font-size:1.5rem; font-weight:600; color:var(--gold); text-align:center; }
  .ko-score.pending { color:var(--gray); font-family:var(--font-body); font-size:0.72rem; letter-spacing:0.08em; text-transform:uppercase; }
  .matchday-tabs { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:20px; }
  .matchday-tab { padding:6px 14px; background:var(--coal); border:1px solid rgba(201,168,76,0.1); border-radius:2px; cursor:pointer; font-family:var(--font-body); font-size:0.68rem; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:var(--gray); transition:all var(--transition); }
  .matchday-tab.active { background:rgba(201,168,76,0.1); border-color:rgba(201,168,76,0.3); color:var(--gold); }
  .matchday-tab.done { color:var(--gold-dim); border-color:rgba(201,168,76,0.15); }
  .matchday-tab:hover:not(.active) { color:var(--cream); }
  .prono-card { background:var(--coal); border:1px solid rgba(201,168,76,0.1); border-radius:var(--radius); padding:16px 18px; margin-bottom:10px; position:relative; overflow:hidden; transition:border-color var(--transition); }
  .prono-card::before { content:''; position:absolute; left:0; top:0; bottom:0; width:2px; background:transparent; transition:background var(--transition); }
  .prono-card:hover { border-color:rgba(201,168,76,0.2); }
  .prono-card:hover::before { background:var(--gold); }
  .prono-card.locked { opacity:0.65; }
  .prono-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; flex-wrap:wrap; gap:6px; }
  .prono-meta { font-size:0.68rem; color:var(--gray); letter-spacing:0.06em; text-transform:uppercase; }
  .prono-badges { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
  .status-pill { font-size:0.62rem; font-weight:600; padding:3px 9px; border-radius:2px; text-transform:uppercase; letter-spacing:0.08em; }
  .status-scheduled { background:rgba(255,255,255,0.05); color:var(--gray); }
  .status-live { background:rgba(192,57,43,0.15); color:#d07060; }
  .status-finished { background:rgba(201,168,76,0.1); color:var(--gold); }
  .prono-teams { display:grid; grid-template-columns:1fr auto 1fr; align-items:center; gap:10px; margin-bottom:12px; }
  .prono-team { font-family:var(--font-display); font-size:1.15rem; font-weight:600; letter-spacing:0.05em; display:flex; align-items:center; gap:8px; }
  .prono-team.home { justify-content:flex-end; text-align:right; }
  .prono-team.away { justify-content:flex-start; }
  .prono-flag { font-size:1.3rem; }
  .prono-score-display { font-family:var(--font-display); font-size:1.5rem; font-weight:600; color:var(--gold); text-align:center; min-width:56px; }
  .prono-score-display.pending { color:var(--gray); font-family:var(--font-body); font-size:0.82rem; letter-spacing:0.08em; }
  .prono-input-row { display:flex; align-items:center; gap:10px; background:var(--charcoal); border-radius:var(--radius); padding:9px 12px; border:1px solid rgba(201,168,76,0.08); }
  .prono-label { font-size:0.65rem; color:var(--gray); margin-right:auto; text-transform:uppercase; letter-spacing:0.1em; font-weight:600; }
  .score-input { width:42px; height:34px; background:var(--muted); border:1px solid rgba(201,168,76,0.15); border-radius:var(--radius); color:var(--cream); font-family:var(--font-display); font-size:1.15rem; text-align:center; outline:none; transition:border-color var(--transition); }
  .score-input:focus { border-color:var(--gold); }
  .score-sep { font-family:var(--font-display); color:var(--gold-dim); font-size:1rem; }
  .btn-predict { padding:7px 16px; background:transparent; color:var(--gold); border:1px solid rgba(201,168,76,0.4); border-radius:var(--radius); font-family:var(--font-body); font-size:0.68rem; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; cursor:pointer; transition:all var(--transition); white-space:nowrap; }
  .btn-predict:hover { background:var(--gold); color:var(--obsidian); }
  .btn-predict:disabled { opacity:0.3; cursor:not-allowed; }
  .points-badge { font-family:var(--font-body); font-size:0.7rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; padding:3px 10px; border-radius:2px; }
  .pts-3 { background:rgba(201,168,76,0.15); color:var(--gold-light); border:1px solid rgba(201,168,76,0.3); }
  .pts-1 { background:rgba(201,168,76,0.06); color:var(--gold); border:1px solid rgba(201,168,76,0.15); }
  .pts-0 { background:rgba(255,255,255,0.04); color:var(--gray); border:1px solid rgba(255,255,255,0.07); }
  .auth-wrap { min-height:72vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:36px; }
  .auth-hero { text-align:center; }
  .auth-hero h1 { font-family:var(--font-display); font-size:clamp(3rem,10vw,5.5rem); font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:var(--cream); line-height:1; }
  .auth-hero h1 em { font-style:italic; font-weight:400; color:var(--gold); display:block; font-size:0.6em; letter-spacing:0.2em; margin-top:6px; }
  .auth-hero p { color:var(--gray); margin-top:12px; font-size:0.78rem; letter-spacing:0.12em; text-transform:uppercase; }
  .card { background:var(--coal); border:1px solid rgba(201,168,76,0.14); border-radius:var(--radius); padding:32px 28px; width:100%; max-width:380px; position:relative; }
  .card::before { content:''; position:absolute; top:0; left:28px; right:28px; height:1px; background:linear-gradient(to right,transparent,var(--gold),transparent); }
  .card h2 { font-family:var(--font-display); font-size:1.4rem; font-weight:400; font-style:italic; margin-bottom:22px; }
  .field { margin-bottom:14px; }
  .field label { display:block; font-size:0.68rem; color:var(--gray); margin-bottom:7px; text-transform:uppercase; letter-spacing:0.12em; font-weight:600; }
  .field input { width:100%; padding:11px 14px; background:var(--charcoal); border:1px solid rgba(201,168,76,0.1); border-radius:var(--radius); color:var(--cream); font-family:var(--font-body); font-size:0.9rem; font-weight:300; letter-spacing:0.04em; outline:none; transition:border-color var(--transition); }
  .field input:focus { border-color:var(--gold); }
  .field input::placeholder { color:var(--gray); opacity:0.5; }
  .btn { width:100%; padding:13px; background:var(--gold); color:var(--obsidian); border:none; border-radius:var(--radius); font-family:var(--font-body); font-size:0.75rem; font-weight:600; letter-spacing:0.18em; text-transform:uppercase; cursor:pointer; transition:all var(--transition); margin-top:6px; }
  .btn:hover { background:var(--gold-light); transform:translateY(-1px); }
  .btn:disabled { opacity:0.4; cursor:not-allowed; transform:none; }
  .btn-ghost { background:none; border:1px solid rgba(201,168,76,0.15); color:var(--gray); font-size:0.72rem; letter-spacing:0.1em; padding:12px; margin-top:10px; }
  .btn-ghost:hover { background:rgba(201,168,76,0.05); color:var(--cream); transform:none; }
  .error-msg { background:rgba(192,57,43,0.1); border:1px solid rgba(192,57,43,0.25); border-radius:var(--radius); padding:10px 14px; font-size:0.78rem; color:#d07060; margin-bottom:14px; }
  .podium { display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-bottom:24px; align-items:end; }
  .podium-card { background:var(--coal); border-radius:var(--radius); padding:16px 12px; text-align:center; border:1px solid rgba(201,168,76,0.1); position:relative; overflow:hidden; }
  .podium-card::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:rgba(201,168,76,0.12); }
  .podium-card.rank-1 { border-color:rgba(201,168,76,0.35); background:rgba(201,168,76,0.06); padding-top:22px; margin-top:-12px; }
  .podium-card.rank-1::after { background:var(--gold); }
  .podium-rank { font-family:var(--font-display); font-size:2rem; font-weight:400; font-style:italic; color:var(--gray); }
  .podium-card.rank-1 .podium-rank { color:var(--gold); font-size:2.6rem; }
  .podium-name { font-size:0.75rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; margin:6px 0 4px; }
  .podium-pts { font-family:var(--font-display); font-size:1.4rem; font-weight:600; color:var(--gold); }
  .podium-card.rank-1 .podium-pts { font-size:1.8rem; }
  .crown { font-size:1.1rem; margin-bottom:4px; }
  .rank-list { display:flex; flex-direction:column; gap:6px; }
  .rank-row { display:grid; grid-template-columns:44px 1fr auto; align-items:center; gap:14px; background:var(--coal); border:1px solid rgba(201,168,76,0.08); border-radius:var(--radius); padding:12px 16px; transition:border-color var(--transition); }
  .rank-row:hover { border-color:rgba(201,168,76,0.2); }
  .rank-row.me { border-color:rgba(201,168,76,0.3); background:rgba(201,168,76,0.05); }
  .rank-num { font-family:var(--font-display); font-size:1.2rem; font-weight:400; font-style:italic; color:var(--gold-dim); text-align:center; }
  .rank-username { font-size:0.82rem; font-weight:600; letter-spacing:0.05em; text-transform:uppercase; }
  .rank-detail { font-size:0.7rem; color:var(--gray); margin-top:2px; }
  .rank-total { font-family:var(--font-display); font-size:1.4rem; font-weight:600; color:var(--gold); text-align:right; }
  .rank-total span { font-family:var(--font-body); font-size:0.65rem; color:var(--gray); margin-left:2px; }
  .bonus-intro { background:var(--coal); border:1px solid rgba(201,168,76,0.15); border-radius:var(--radius); padding:20px 24px; margin-bottom:24px; position:relative; }
  .bonus-intro::before { content:''; position:absolute; top:0; left:24px; right:24px; height:1px; background:linear-gradient(to right,transparent,var(--gold),transparent); }
  .bonus-intro p { font-size:0.8rem; color:var(--gray); line-height:1.7; }
  .bonus-intro strong { color:var(--cream); }
  .bonus-pts-legend { display:flex; gap:16px; flex-wrap:wrap; margin-top:12px; padding-top:12px; border-top:1px solid rgba(255,255,255,0.05); }
  .bonus-pt-item { display:flex; align-items:center; gap:8px; font-size:0.7rem; letter-spacing:0.06em; text-transform:uppercase; color:var(--gray); }
  .bonus-pt-chip { font-family:var(--font-display); font-size:1rem; color:var(--gold); background:rgba(201,168,76,0.1); border:1px solid rgba(201,168,76,0.22); border-radius:2px; padding:1px 8px; }
  .bonus-question { background:var(--coal); border:1px solid rgba(201,168,76,0.1); border-radius:var(--radius); margin-bottom:12px; overflow:hidden; position:relative; }
  .bonus-question::before { content:''; position:absolute; left:0; top:0; bottom:0; width:2px; background:transparent; transition:background var(--transition); }
  .bonus-question.answered::before { background:var(--gold); }
  .bonus-q-header { padding:16px 20px 0; display:flex; align-items:flex-start; justify-content:space-between; gap:12px; }
  .bonus-q-label { font-size:0.62rem; font-weight:600; letter-spacing:0.15em; text-transform:uppercase; color:var(--gold); margin-bottom:4px; }
  .bonus-q-title { font-family:var(--font-display); font-size:1.2rem; font-weight:600; color:var(--cream); }
  .bonus-q-pts { font-family:var(--font-display); font-size:1.4rem; font-weight:600; color:var(--gold); text-align:right; }
  .bonus-q-pts small { font-family:var(--font-body); font-size:0.62rem; color:var(--gray); display:block; text-transform:uppercase; }
  .bonus-choices { padding:14px 20px 18px; display:flex; flex-direction:column; gap:6px; }
  .bonus-choice { display:flex; align-items:center; gap:10px; padding:10px 12px; background:var(--charcoal); border:1px solid rgba(201,168,76,0.08); border-radius:var(--radius); cursor:pointer; transition:all var(--transition); text-align:left; width:100%; font-family:var(--font-body); }
  .bonus-choice:hover:not(:disabled) { border-color:rgba(201,168,76,0.25); background:rgba(201,168,76,0.04); }
  .bonus-choice.selected { border-color:rgba(201,168,76,0.45); background:rgba(201,168,76,0.08); }
  .bonus-choice:disabled { cursor:default; }
  .choice-radio { width:14px; height:14px; flex-shrink:0; border-radius:50%; border:1px solid rgba(201,168,76,0.3); display:flex; align-items:center; justify-content:center; transition:all var(--transition); }
  .bonus-choice.selected .choice-radio { border-color:var(--gold); background:var(--gold); }
  .choice-radio-dot { width:5px; height:5px; border-radius:50%; background:var(--obsidian); opacity:0; transition:opacity var(--transition); }
  .bonus-choice.selected .choice-radio-dot { opacity:1; }
  .choice-flag { font-size:1.1rem; }
  .choice-label { font-size:0.82rem; color:var(--cream); flex:1; letter-spacing:0.04em; }
  .bonus-choice.selected .choice-label { color:var(--gold-light); font-weight:600; }
  .bonus-confirm-row { padding:0 20px 16px; display:flex; align-items:center; justify-content:space-between; gap:12px; }
  .bonus-confirm-hint { font-size:0.7rem; color:var(--gray); }
  .btn-bonus-confirm { padding:9px 20px; background:transparent; color:var(--gold); border:1px solid rgba(201,168,76,0.4); border-radius:var(--radius); font-family:var(--font-body); font-size:0.7rem; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; cursor:pointer; transition:all var(--transition); }
  .btn-bonus-confirm:hover { background:var(--gold); color:var(--obsidian); }
  .btn-bonus-confirm:disabled { opacity:0.3; cursor:not-allowed; }
  .bonus-confirmed-badge { display:flex; align-items:center; gap:8px; padding:0 20px 16px; font-size:0.7rem; letter-spacing:0.08em; text-transform:uppercase; color:var(--gold); }
  .bonus-confirmed-badge::before { content:'✦'; font-size:0.6rem; }
  .bonus-locked-msg { padding:0 20px 14px; font-size:0.7rem; color:var(--gray); text-transform:uppercase; font-style:italic; }
  .empty { text-align:center; padding:48px 0; color:var(--gray); font-size:0.78rem; letter-spacing:0.1em; text-transform:uppercase; }
  .empty-icon { font-size:2rem; margin-bottom:10px; opacity:0.5; }
  .spinner { width:22px; height:22px; border:1px solid rgba(201,168,76,0.15); border-top-color:var(--gold); border-radius:50%; animation:spin 1s linear infinite; margin:40px auto; }
  @keyframes spin { to { transform:rotate(360deg); } }
  .qualified-legend { font-size:0.62rem; color:var(--gray); padding:6px 14px 8px; letter-spacing:0.06em; display:flex; align-items:center; gap:6px; }
  .q-dot { width:8px; height:8px; border-radius:50%; background:var(--green-q); flex-shrink:0; }
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
function groupLabel(g) { return g ? "Groupe " + g.replace("GROUP_","") : ""; }
function stageLabel(s) {
  return { GROUP_STAGE:"Phase de groupes", ROUND_OF_16:"Huitièmes de finale", QUARTER_FINALS:"Quarts de finale", SEMI_FINALS:"Demi-finales", THIRD_PLACE:"3e place", FINAL:"Finale" }[s] || s;
}
function ptsClass(pts) {
  if (pts===3) return "points-badge pts-3";
  if (pts===1) return "points-badge pts-1";
  return "points-badge pts-0";
}

const BONUS_QUESTIONS = [
  { id:"winner", label:"Question Bonus I", title:"Quel pays remportera la Coupe du Monde 2026 ?", points:15, lockDate:"2026-06-11T18:00:00Z",
    choices:[{id:"FRA",flag:"🇫🇷",label:"France"},{id:"BRA",flag:"🇧🇷",label:"Brésil"},{id:"ARG",flag:"🇦🇷",label:"Argentine"},{id:"ENG",flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",label:"Angleterre"},{id:"ESP",flag:"🇪🇸",label:"Espagne"},{id:"GER",flag:"🇩🇪",label:"Allemagne"},{id:"POR",flag:"🇵🇹",label:"Portugal"},{id:"MAR",flag:"🇲🇦",label:"Maroc"},{id:"USA",flag:"🇺🇸",label:"États-Unis"},{id:"NED",flag:"🇳🇱",label:"Pays-Bas"}]
  },
  { id:"topscorer", label:"Question Bonus II", title:"Qui sera le meilleur buteur du tournoi ?", points:10, lockDate:"2026-06-11T18:00:00Z",
    choices:[{id:"MBP",flag:"🇫🇷",label:"Kylian Mbappé"},{id:"VIN",flag:"🇧🇷",label:"Vinícius Jr."},{id:"LAU",flag:"🇦🇷",label:"Lautaro Martínez"},{id:"KAN",flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",label:"Harry Kane"},{id:"YAM",flag:"🇪🇸",label:"Lamine Yamal"},{id:"KAI",flag:"🇩🇪",label:"Kai Havertz"},{id:"LEW",flag:"🇵🇱",label:"Robert Lewandowski"},{id:"OSI",flag:"🇳🇬",label:"Victor Osimhen"},{id:"PUL",flag:"🇺🇸",label:"Christian Pulisic"},{id:"ARD",flag:"🇹🇷",label:"Arda Güler"}]
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANTS
// ═══════════════════════════════════════════════════════════════════════════════

function AuthScreen({ onLogin }) {
  const [mode,setMode]=useState("login");
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);

  async function handleSubmit() {
    setError(""); setLoading(true);
    try {
      const data = await apiCall(`/auth/${mode}`,{method:"POST",body:JSON.stringify({username,password})});
      onLogin(data.user, data.token);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-hero">
        <h1>PRONOS <em>Coupe du Monde 2026</em></h1>
        <p>Prédisez les matchs · Gravissez le classement</p>
      </div>
      <div className="card">
        <h2>{mode==="login"?"Connexion":"Inscription"}</h2>
        {error && <div className="error-msg">{error}</div>}
        <div className="field"><label>Nom d'utilisateur</label><input value={username} onChange={e=>setUsername(e.target.value)} placeholder="ex: Thomas" onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/></div>
        <div className="field"><label>Mot de passe</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/></div>
        <button className="btn" onClick={handleSubmit} disabled={loading}>{loading?"...":mode==="login"?"Se connecter":"Créer le compte"}</button>
        <button className="btn btn-ghost" onClick={()=>{setMode(m=>m==="login"?"register":"login");setError("");}}>
          {mode==="login"?"Pas encore de compte ? S'inscrire":"Déjà inscrit ? Se connecter"}
        </button>
      </div>
    </div>
  );
}

function calcStandings(groupName, allMatches) {
  const gms = allMatches.filter(m => m.group_name===groupName && m.stage==="GROUP_STAGE");
  const teams = {};
  gms.forEach(m => {
    if (!teams[m.home_team]) teams[m.home_team]={name:m.home_team,pts:0,j:0,g:0,n:0,p:0,gf:0,ga:0};
    if (!teams[m.away_team]) teams[m.away_team]={name:m.away_team,pts:0,j:0,g:0,n:0,p:0,gf:0,ga:0};
  });
  gms.filter(m=>m.status==="finished").forEach(m => {
    const h=teams[m.home_team], a=teams[m.away_team];
    if (!h||!a) return;
    h.j++; a.j++;
    h.gf+=m.score_home; h.ga+=m.score_away;
    a.gf+=m.score_away; a.ga+=m.score_home;
    if (m.score_home>m.score_away) { h.pts+=3;h.g++;a.p++; }
    else if (m.score_home<m.score_away) { a.pts+=3;a.g++;h.p++; }
    else { h.pts+=1;a.pts+=1;h.n++;a.n++; }
  });
  return Object.values(teams).sort((a,b)=>b.pts-a.pts||(b.gf-b.ga)-(a.gf-a.ga)||b.gf-a.gf);
}

function GroupsView({ matches }) {
  const groupMatches = matches.filter(m=>m.stage==="GROUP_STAGE"&&m.group_name);
  const groups = [...new Set(groupMatches.map(m=>m.group_name))].sort();
  if (groups.length===0) return (
    <div className="empty"><div className="empty-icon">⚽</div>Les groupes seront disponibles dès le début du tournoi.</div>
  );
  return (
    <div className="groups-grid">
      {groups.map(g => {
        const gMs = groupMatches.filter(m=>m.group_name===g).sort((a,b)=>new Date(a.kickoff)-new Date(b.kickoff));
        const standings = calcStandings(g, matches);
        const hasResults = standings.some(s=>s.j>0);
        return (
          <div className="group-card" key={g}>
            <div className="group-header"><div className="group-name">{groupLabel(g)}</div></div>
            <table className="standings-table">
              <thead>
                <tr><th className="th-team">Équipe</th><th>J</th><th>G</th><th>N</th><th>P</th><th>Diff</th><th>Pts</th></tr>
              </thead>
              <tbody>
                {standings.map((s,i) => (
                  <tr key={s.name} className={i<2?"qualified":""}>
                    <td className="td-team">
                      <span className={`rank-badge ${i<2?"q":""}`}>{i+1}</span>
                      <span className="team-flag">{flag(s.name)}</span>
                      <span className="team-name-cell">{teamName(s.name)}</span>
                    </td>
                    <td>{s.j}</td><td>{s.g}</td><td>{s.n}</td><td>{s.p}</td>
                    <td style={{color:s.gf-s.ga>0?"var(--gold-light)":s.gf-s.ga<0?"#d07060":"var(--gray)"}}>
                      {s.j>0?(s.gf-s.ga>0?"+":"")+(s.gf-s.ga):"—"}
                    </td>
                    <td className="pts-cell">{s.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {hasResults && <div className="qualified-legend"><div className="q-dot"/><span>Qualifié pour les huitièmes</span></div>}
            <div className="group-matches">
              {gMs.map(m => (
                <div className="group-match-row" key={m.id}>
                  <div className="gm-home"><span>{teamName(m.home_team)}</span><span>{flag(m.home_team)}</span></div>
                  {m.status==="finished" ? <div className="gm-score">{m.score_home}–{m.score_away}</div>
                    : m.status==="live" ? <div className="gm-score"><span className="live-dot"/>Live</div>
                    : <div className="gm-score pending">vs</div>}
                  <div className="gm-away"><span>{flag(m.away_team)}</span><span>{teamName(m.away_team)}</span></div>
                  <div className="gm-date">{formatDateShort(m.kickoff)}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function KnockoutView({ matches }) {
  const stageOrder = ["ROUND_OF_16","QUARTER_FINALS","SEMI_FINALS","THIRD_PLACE","FINAL"];
  const knockoutMatches = matches.filter(m=>m.stage!=="GROUP_STAGE");
  const byStage = stageOrder.filter(s=>knockoutMatches.some(m=>m.stage===s));
  if (byStage.length===0) return (
    <div className="empty"><div className="empty-icon">🏆</div>La phase finale débutera après les matchs de groupes.</div>
  );
  return (
    <div>
      {byStage.map(stage => (
        <div className="knockout-stage" key={stage}>
          <div className="section-title">{stageLabel(stage)}</div>
          {knockoutMatches.filter(m=>m.stage===stage).sort((a,b)=>new Date(a.kickoff)-new Date(b.kickoff)).map(m => (
            <div className="knockout-match" key={m.id}>
              <div className="ko-team home">
                <span>{teamName(m.home_team)||"À déterminer"}</span>
                <span style={{fontSize:"1.3rem"}}>{flag(m.home_team)}</span>
              </div>
              {m.status==="finished" ? <div className="ko-score">{m.score_home}–{m.score_away}</div>
                : m.status==="live" ? <div className="ko-score" style={{color:"#d07060"}}><span className="live-dot"/>Live</div>
                : <div className="ko-score pending">{formatDateShort(m.kickoff)}</div>}
              <div className="ko-team away">
                <span style={{fontSize:"1.3rem"}}>{flag(m.away_team)}</span>
                <span>{teamName(m.away_team)||"À déterminer"}</span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function ResultsScreen({ matches, loading }) {
  const [subTab,setSubTab]=useState("groupes");
  if (loading) return <div className="spinner"/>;
  return (
    <div>
      <div className="tabs-sub">
        <button className={`tab-sub ${subTab==="groupes"?"active":""}`} onClick={()=>setSubTab("groupes")}>Phase de groupes</button>
        <button className={`tab-sub ${subTab==="finale"?"active":""}`} onClick={()=>setSubTab("finale")}>Phase finale</button>
      </div>
      {subTab==="groupes" && <GroupsView matches={matches}/>}
      {subTab==="finale"  && <KnockoutView matches={matches}/>}
    </div>
  );
}

function PronoCard({ match, prediction, token, onPredicted }) {
  const [home,setHome]=useState(prediction?.pred_home??"");
  const [away,setAway]=useState(prediction?.pred_away??"");
  const [saving,setSaving]=useState(false);
  const [msg,setMsg]=useState("");

  useEffect(()=>{
    setHome(prediction?.pred_home??"");
    setAway(prediction?.pred_away??"");
  },[prediction]);

  const locked = match.status!=="scheduled"||new Date(match.kickoff)<new Date();
  const now = new Date();
  const kickoff = new Date(match.kickoff);
  const hoursLeft = (kickoff - now) / (1000 * 60 * 60);

  function getPronoStatus() {
    if (locked) return null;
    if (prediction) return { label:"✓ Saisi", color:"#7dcc8a", bg:"rgba(45,106,63,0.15)", border:"rgba(45,106,63,0.35)" };
    if (hoursLeft <= 24 && hoursLeft > 0) return { label:"⚠ Moins de 24h", color:"#e07060", bg:"rgba(192,57,43,0.15)", border:"rgba(192,57,43,0.35)" };
    return { label:"À pronostiquer", color:"var(--gold)", bg:"rgba(201,168,76,0.08)", border:"rgba(201,168,76,0.25)" };
  }
  const pronoStatus = getPronoStatus();

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
    <div className={`prono-card ${locked?"locked":""}`}>
      <div className="prono-header">
        <div className="prono-meta">{match.group_name?groupLabel(match.group_name)+" · ":""}{formatDate(match.kickoff)}</div>
        <div className="prono-badges">
          {pronoStatus && (
            <span style={{
              fontSize:"0.62rem", fontWeight:600, padding:"3px 9px", borderRadius:"2px",
              textTransform:"uppercase", letterSpacing:"0.08em",
              color:pronoStatus.color, background:pronoStatus.bg, border:`1px solid ${pronoStatus.border}`
            }}>
              {pronoStatus.label}
            </span>
          )}
          <span className={`status-pill status-${match.status}`}>
            {match.status==="live"?"En direct":match.status==="finished"?"Terminé":"À venir"}
          </span>
        </div>
      </div>
      <div className="prono-teams">
        <div className="prono-team home">
          <span>{teamName(match.home_team)}</span>
          <span className="prono-flag">{flag(match.home_team)}</span>
        </div>
        {match.status==="finished"
          ? <div className="prono-score-display">{match.score_home}–{match.score_away}</div>
          : <div className="prono-score-display pending">vs</div>}
        <div className="prono-team away">
          <span className="prono-flag">{flag(match.away_team)}</span>
          <span>{teamName(match.away_team)}</span>
        </div>
      </div>
      {!locked ? (
        <div className="prono-input-row">
          <span className="prono-label">Ton pronostic</span>
          <input className="score-input" type="number" min="0" max="20" value={home} onChange={e=>setHome(e.target.value)} placeholder="0"/>
          <span className="score-sep">–</span>
          <input className="score-input" type="number" min="0" max="20" value={away} onChange={e=>setAway(e.target.value)} placeholder="0"/>
          <button className="btn-predict" onClick={handlePredict} disabled={saving}>{saving?"...":prediction?"Modifier":"Valider"}</button>
        </div>
      ) : prediction ? (
        <div className="prono-input-row">
          <span className="prono-label">Ton pronostic</span>
          <span style={{fontFamily:"var(--font-display)",fontSize:"1.05rem",color:"var(--gray)"}}>{prediction.pred_home}–{prediction.pred_away}</span>
          {match.status==="finished" && (
            <span className={ptsClass(prediction.points_earned)} style={{marginLeft:"auto"}}>
              {prediction.points_earned} pt{prediction.points_earned>1?"s":""}
            </span>
          )}
        </div>
      ) : (
        <div className="prono-input-row"><span className="prono-label" style={{color:"var(--gray)"}}>Pronostics fermés</span></div>
      )}
      {msg && <div style={{marginTop:8,fontSize:"0.78rem",color:msg.startsWith("✓")?"#7dcc8a":"#f08080"}}>{msg}</div>}
    </div>
  );
}

function PredictionsScreen({ matches, loading, token }) {
  const [predictions,setPredictions]=useState({});
  const [activeDay,setActiveDay]=useState(null);
  const [loadingPredictions,setLoadingPredictions]=useState(true);

  const groupMatches = matches.filter(m=>m.stage==="GROUP_STAGE"&&m.matchday);
  const days = [...new Set(groupMatches.map(m=>m.matchday))].sort((a,b)=>a-b);
  const knockoutMatches = matches.filter(m=>m.stage!=="GROUP_STAGE");

  useEffect(()=>{
    if (!token||matches.length===0) return;
    apiCall("/predictions",{},token)
      .then(d=>{
        const map={};
        (d.predictions||[]).forEach(p=>{ map[p.match_id]=p; });
        setPredictions(map);
      })
      .catch(console.error)
      .finally(()=>setLoadingPredictions(false));
  },[matches,token]);

  useEffect(()=>{
    if (days.length>0&&activeDay===null) {
      const firstOpen = days.find(d=>groupMatches.filter(m=>m.matchday===d).some(m=>m.status==="scheduled"&&new Date(m.kickoff)>new Date()));
      setActiveDay(firstOpen||days[0]);
    }
  },[matches]);

  function handlePredicted(matchId,home,away) {
    setPredictions(p=>({...p,[matchId]:{pred_home:home,pred_away:away,points_earned:0}}));
  }
  function dayStatus(d) {
    const ms=groupMatches.filter(m=>m.matchday===d);
    if (ms.every(m=>m.status==="finished")) return "done";
    if (ms.some(m=>m.status==="live")) return "live";
    return "open";
  }

  if (loading||loadingPredictions) return <div className="spinner"/>;
  const currentMatches = activeDay?groupMatches.filter(m=>m.matchday===activeDay):[];

  return (
    <div>
      {days.length>0 && (
        <>
          <div className="section-title">Phase de groupes</div>
          <div className="matchday-tabs">
            {days.map(d=>(
              <button key={d} className={`matchday-tab ${activeDay===d?"active":""} ${dayStatus(d)==="done"?"done":""}`} onClick={()=>setActiveDay(d)}>
                {dayStatus(d)==="live"?"⚡ ":""}J{d}
              </button>
            ))}
          </div>
          {currentMatches.sort((a,b)=>new Date(a.kickoff)-new Date(b.kickoff)).map(m=>(
            <PronoCard key={m.id} match={m} prediction={predictions[m.id]||null} token={token} onPredicted={handlePredicted}/>
          ))}
        </>
      )}
      {knockoutMatches.length>0 && (
        <>
          <div className="section-title" style={{marginTop:28}}>Phase finale</div>
          {knockoutMatches.sort((a,b)=>new Date(a.kickoff)-new Date(b.kickoff)).map(m=>(
            <PronoCard key={m.id} match={m} prediction={predictions[m.id]||null} token={token} onPredicted={handlePredicted}/>
          ))}
        </>
      )}
      {matches.length===0&&<div className="empty"><div className="empty-icon">⚽</div>Aucun match disponible.</div>}
    </div>
  );
}

function RankingScreen({ currentUser }) {
  const [ranking,setRanking]=useState([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    apiCall("/ranking").then(d=>setRanking(d.classement||[])).catch(console.error).finally(()=>setLoading(false));
  },[]);
  const top3=ranking.filter(r=>r.rang<=3).slice(0,3);
  const podium=[top3[1],top3[0],top3[2]].filter(Boolean);
  if (loading) return <div className="spinner"/>;
  return (
    <div>
      {top3.length>=2&&(<>
        <div className="section-title">Podium</div>
        <div className="podium">
          {podium.map(p=>p&&(
            <div key={p.id} className={`podium-card rank-${p.rang}`}>
              {p.rang===1&&<div className="crown">🏆</div>}
              <div className="podium-rank">#{p.rang}</div>
              <div className="podium-name">{p.username}</div>
              <div className="podium-pts">{p.total}<span style={{fontSize:"0.72rem",fontFamily:"var(--font-body)",color:"var(--gray)",marginLeft:4}}>pts</span></div>
              {p.scores_exacts>0&&<div style={{fontSize:"0.7rem",color:"var(--gray)",marginTop:4}}>{p.scores_exacts} exact{p.scores_exacts>1?"s":""}</div>}
            </div>
          ))}
        </div>
      </>)}
      <div className="section-title">Classement complet</div>
      <div className="rank-list">
        {ranking.map(row=>(
          <div key={row.id} className={`rank-row ${row.id===currentUser?.id?"me":""}`}>
            <div className="rank-num">{row.rang}</div>
            <div>
              <div className="rank-username">{row.username}{row.id===currentUser?.id&&<span style={{fontSize:"0.68rem",color:"var(--gold)",marginLeft:8}}>← toi</span>}</div>
              <div className="rank-detail">{row.pronos_joues} matchs · {row.scores_exacts} exacts{row.points_bonus>0?` · +${row.points_bonus} bonus`:""}</div>
            </div>
            <div className="rank-total">{row.total}<span>pts</span></div>
          </div>
        ))}
      </div>
      {ranking.length===0&&<div className="empty"><div className="empty-icon">📊</div>Aucun point pour l'instant.</div>}
    </div>
  );
}

function BonusScreen({ token }) {
  const [answers,setAnswers]=useState({});
  const [confirmed,setConfirmed]=useState({});
  const [saving,setSaving]=useState({});

  function isLocked(q){return new Date()>=new Date(q.lockDate);}

  function handleSelect(qId,cId){
    if (confirmed[qId]||isLocked(BONUS_QUESTIONS.find(q=>q.id===qId))) return;
    setAnswers(a=>({...a,[qId]:cId}));
  }

  async function handleConfirm(question){
    const cId=answers[question.id]; if (!cId) return;
    setSaving(s=>({...s,[question.id]:true}));
    try {
      await apiCall("/bonus",{method:"POST",body:JSON.stringify({questionId:question.id,answerId:cId})},token);
      setConfirmed(c=>({...c,[question.id]:cId}));
    } catch(e){ console.error(e); }
    finally{setSaving(s=>({...s,[question.id]:false}));}
  }

  useEffect(()=>{
    apiCall("/bonus",{},token).then(d=>{
      if (d.bonus) {
        const c={};
        if (d.bonus.winner_id) c["winner"]=d.bonus.winner_id;
        if (d.bonus.top_scorer_id) c["topscorer"]=d.bonus.top_scorer_id;
        setConfirmed(c);
        setAnswers(c);
      }
    }).catch(()=>{});
  },[]);

  const totalPts=BONUS_QUESTIONS.reduce((s,q)=>s+q.points,0);
  return (
    <div>
      <div className="bonus-intro">
        <p>Ces questions doivent être soumises <strong>avant le coup d'envoi du tournoi</strong>. Aucune modification possible après.</p>
        <div className="bonus-pts-legend">
          {BONUS_QUESTIONS.map(q=><div className="bonus-pt-item" key={q.id}><span className="bonus-pt-chip">{q.points}</span>{q.label}</div>)}
          <div className="bonus-pt-item"><span className="bonus-pt-chip" style={{color:"var(--cream)"}}>{totalPts}</span>pts max</div>
        </div>
      </div>
      {BONUS_QUESTIONS.map(question=>{
        const locked=isLocked(question);
        const answered=!!confirmed[question.id];
        const selected=answers[question.id];
        const cc=question.choices.find(c=>c.id===confirmed[question.id]);
        return (
          <div key={question.id} className={`bonus-question ${answered?"answered":""}`}>
            <div className="bonus-q-header">
              <div><div className="bonus-q-label">{question.label}</div><div className="bonus-q-title">{question.title}</div></div>
              <div className="bonus-q-pts">{question.points}<small>points</small></div>
            </div>
            <div className="bonus-choices">
              {question.choices.map(choice=>(
                <button key={choice.id} className={`bonus-choice ${selected===choice.id?"selected":""}`} onClick={()=>handleSelect(question.id,choice.id)} disabled={locked||answered}>
                  <div className="choice-radio"><div className="choice-radio-dot"/></div>
                  <span className="choice-flag">{choice.flag}</span>
                  <span className="choice-label">{choice.label}</span>
                  {confirmed[question.id]===choice.id&&<span style={{fontSize:"0.65rem",color:"var(--gold)",textTransform:"uppercase",letterSpacing:"0.08em"}}>Votre choix</span>}
                </button>
              ))}
            </div>
            {!locked&&!answered&&(
              <div className="bonus-confirm-row">
                <span className="bonus-confirm-hint">{selected?`Sélectionné : ${question.choices.find(c=>c.id===selected)?.label}`:"Sélectionnez une réponse"}</span>
                <button className="btn-bonus-confirm" onClick={()=>handleConfirm(question)} disabled={!selected||saving[question.id]}>{saving[question.id]?"Envoi…":"Confirmer"}</button>
              </div>
            )}
            {answered&&<div className="bonus-confirmed-badge">Réponse enregistrée — {cc?.flag} {cc?.label}</div>}
            {locked&&!answered&&<div className="bonus-locked-msg">Pronostics bonus fermés</div>}
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const [user,setUser]           = useState(null);
  const [token,setToken]         = useState(null);
  const [tab,setTab]             = useState("resultats");
  const [matches,setMatches]     = useState([]);
  const [loading,setLoading]     = useState(true);
  const [showAdmin,setShowAdmin] = useState(false);

  useEffect(()=>{
    if (!user) return;
    apiCall("/matches").then(d=>setMatches(d.matches||[])).catch(console.error).finally(()=>setLoading(false));
  },[user]);

  function handleLogin(u,t){ setUser(u); setToken(t); }
  function handleLogout(){ setUser(null); setToken(null); setMatches([]); setLoading(true); setShowAdmin(false); }

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <header className="header">
          <div className="logo">Pronos <span>2026</span></div>
          {user ? (
            <div className="user-pill">
              <div className="avatar">{user.username[0].toUpperCase()}</div>
              <span>{user.username}</span>
              {user.role==='admin' && (
                <button className="btn-logout" onClick={()=>setShowAdmin(true)} style={{color:'var(--gold-dim)'}}>Admin</button>
              )}
              <button className="btn-logout" onClick={handleLogout}>Déconnexion</button>
            </div>
          ) : (
            <div style={{fontSize:"0.75rem",color:"var(--gray)",letterSpacing:"0.1em",textTransform:"uppercase"}}>Coupe du Monde 2026</div>
          )}
        </header>
        {!user ? <AuthScreen onLogin={handleLogin}/> : (
          <>
            {showAdmin ? <AdminScreen onBack={()=>setShowAdmin(false)}/> : (
              <>
                <div className="tabs-main">
                  <button className={`tab-main ${tab==="resultats"?"active":""}`} onClick={()=>setTab("resultats")}>Résultats</button>
                  <button className={`tab-main ${tab==="pronostics"?"active":""}`} onClick={()=>setTab("pronostics")}>Pronostics</button>
                  <button className={`tab-main ${tab==="bonus"?"active":""}`} onClick={()=>setTab("bonus")}>Bonus</button>
                  <button className={`tab-main ${tab==="classement"?"active":""}`} onClick={()=>setTab("classement")}>Classement</button>
                </div>
                {tab==="resultats"  && <ResultsScreen matches={matches} loading={loading}/>}
                {tab==="pronostics" && <PredictionsScreen matches={matches} loading={loading} token={token}/>}
                {tab==="bonus"      && <BonusScreen token={token}/>}
                {tab==="classement" && <RankingScreen currentUser={user}/>}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}