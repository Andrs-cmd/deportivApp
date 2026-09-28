(function () {
  'use strict';
  const { E, G, R, LOC } = window.PF_DATA;
  const FIG = window.PF_POSES;

  /* ---------- utilidades ---------- */
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  const dk = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (d, n) => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() + n); return x; };
  const wIdx = d => (d.getDay() + 6) % 7;
  const monday = d => addDays(d, -wIdx(d));
  const now = () => new Date();
  const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const DAYS_L = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const MONTHS_L = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const fmt = n => { const r = Math.round(n * 100) / 100; return String(r).replace('.', ','); };
  const cop = n => '$' + Math.round(n).toLocaleString('es-CO');
  const shortDate = k => { const d = parse(k); return `${d.getDate()} ${MONTHS[d.getMonth()]}`; };
  const longDate = d => `${DAYS_L[wIdx(d)]} ${d.getDate()} de ${MONTHS_L[d.getMonth()]}`;
  const mmss = s => { s = Math.max(0, Math.round(s)); return `${Math.floor(s / 60)}:${pad(s % 60)}`; };
  const roundTo = (x, inc) => Math.round(x / inc) * inc;
  const PROP = { bar: 'Barra', db: 'Mancuernas', cable: 'Polea', machine: 'Máquina', bw: 'Peso corporal' };

  const I = {
    home: '<path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    chart: '<path d="M4 19V5M4 19h16M8 15l3.5-4 3 2.5L20 7"/>',
    food: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 21V3c-2.5 1.5-3.5 4-3.5 7.5V13H17"/>',
    cart: '<path d="M3 4h2.2l2.3 11h10.8l2-8H6.5"/><circle cx="9" cy="19.5" r="1.4"/><circle cx="17" cy="19.5" r="1.4"/>',
    gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v2.4M12 18.8v2.4M4.2 7.5l2.1 1.2M17.7 15.3l2.1 1.2M4.2 16.5l2.1-1.2M17.7 8.7l2.1-1.2"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    swap: '<path d="M7 4 3.5 7.5 7 11M3.5 7.5H17M17 13l3.5 3.5L17 20M20.5 16.5H7"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    play: '<path d="M8 5.5v13l11-6.5z"/>',
    right: '<path d="M9 5l7 7-7 7"/>',
    yt: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9v6l5-3z" fill="currentColor"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    dl: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    ul: '<path d="M12 16V5M7 10l5-5 5 5M5 20h14"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>'
  };
  const ic = (n, sw) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw || 2}" stroke-linecap="round" stroke-linejoin="round">${I[n]}</svg>`;

  /* ---------- estado ---------- */
  const KEY = 'pf.v1';
  const defaults = () => ({
    v: 1,
    start: dk(monday(now())),
    schedule: ['empuje', 'tiron', 'piernas', null, 'torso', 'pierna_core', null],
    weekMoves: {}, swaps: {}, logs: {}, body: [], meals: {}, mealSwaps: {}, water: {}, market: {}, myPrices: {}, eaten: {}, adjLog: [], adjSkip: null, locs: {}, photoWeeks: {}, measures: [], profile: { sex: 'h', age: 26, height: 171, act: 1.55 },
    settings: { theme: 'auto', name: '', budget: 250000, waterGoal: 10, rotWeeks: 5, weighDay: 0 }
  });
  function load() {
    let s = null;
    try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { s = null; }
    const d = defaults();
    if (!s || typeof s !== 'object') return d;
    const out = Object.assign(d, s);
    out.myPrices = out.myPrices || {};
    out.eaten = out.eaten || {};
    out.adjLog = out.adjLog || [];
    out.measures = out.measures || [];
    out.locs = out.locs || {};
    out.photoWeeks = out.photoWeeks || {};
    out.profile = Object.assign({ sex: 'h', age: 26, height: 171, act: 1.55 }, out.profile || {});
    out.settings = Object.assign(defaults().settings, s.settings || {});
    if (!out.settings.budget) out.settings.budget = 250000;
    return out;
  }
  let S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('No se pudo guardar en este navegador'); } }

  /* ---------- plan semanal (JSON remoto) ---------- */
  let PLAN = null;
  try { PLAN = JSON.parse(localStorage.getItem('pf.plan')); } catch (e) { PLAN = null; }
  async function loadPlan(force) {
    try {
      const r = await fetch('plan/plan.json' + (force ? '?t=' + Date.now() : ''), { cache: 'no-cache' });
      if (!r.ok) throw new Error(r.status);
      const p = await r.json();
      const changed = !PLAN || PLAN.generated !== p.generated;
      PLAN = p;
      try { localStorage.setItem('pf.plan', JSON.stringify(p)); } catch (e) { /* sin espacio */ }
      if (force) toast(changed ? 'Plan actualizado' : 'Ya tienes el plan más reciente');
      if (changed || force) render(true);
    } catch (e) {
      if (force) toast('Sin conexión: sigues con el plan guardado');
      if (!PLAN) render(true);
    }
  }

  /* ---------- lógica de entreno ---------- */
  const BASICS = new Set();
  Object.values(R).forEach(r => r.slots.forEach(s => { if (s.b) BASICS.add(s.ex); }));

  function blockInfo(d) {
    d = d || now();
    const w = Math.max(0, Math.round((monday(d) - monday(parse(S.start))) / (7 * 864e5)));
    const len = S.settings.rotWeeks || 5;
    const block = Math.floor(w / len);
    return { block, week: (w % len) + 1, len, next: addDays(monday(parse(S.start)), (block + 1) * len * 7) };
  }

  const PLACES = { gym: 'Gimnasio', casa: 'Casa', parque: 'Parque' };
  const locOn = d => S.locs[dk(d || now())] || S.settings.defLoc || 'gym';
  const swapKey = (slotId, d) => { const l = locOn(d); return l === 'gym' ? slotId : l + ':' + slotId; };
  // Alternativas de un ejercicio según el lugar
  function altsFor(exId, loc) {
    const g = E[exId].g;
    if (loc === 'gym') return G[g].filter(x => x !== exId && !E[x].cal);
    return ((LOC[loc] || {})[g] || []).filter(x => x !== exId);
  }

  function slotsFor(rid, d) {
    const r = R[rid];
    if (!r) return [];
    const { block } = blockInfo(d);
    const loc = locOn(d);
    if (loc !== 'gym') {
      const used = new Set();
      return r.slots.map(s => {
        const list = (LOC[loc] || {})[E[s.ex].g] || [s.ex];
        let ex = list[0];
        const sw = S.swaps[loc + ':' + s.id];
        if (sw && sw.block === block && E[sw.ex]) ex = sw.ex;
        else for (let k = 0; k < list.length; k++) { const c = list[(block + k) % list.length]; if (!used.has(c)) { ex = c; break; } }
        used.add(ex);
        return Object.assign({}, s, { ex, reps: E[ex].reps || s.reps });
      });
    }
    const used = new Set(r.slots.filter(s => s.b).map(s => s.ex));
    return r.slots.map(s => {
      let ex = s.ex;
      const sw = S.swaps[s.id];
      if (sw && sw.block === block && E[sw.ex]) ex = sw.ex;
      else if (!s.b) {
        const grp = G[E[s.ex].g].filter(id => !E[id].cal && (!BASICS.has(id) || id === s.ex));
        const i0 = grp.indexOf(s.ex);
        for (let k = 0; k < grp.length; k++) {
          const c = grp[(i0 + block + k) % grp.length];
          if (!used.has(c)) { ex = c; break; }
        }
      }
      if (!s.b) used.add(ex);
      return Object.assign({}, s, { ex, reps: E[ex].reps || s.reps });
    });
  }

  function weekPlan(d) { d = d || now(); return (S.weekMoves[dk(monday(d))] || S.schedule).slice(); }
  function setWeekPlan(d, arr) { S.weekMoves[dk(monday(d))] = arr; save(); }

  function routineOn(d) {
    const L = S.logs[dk(d)];
    if (L && (L.started || hasDone(L))) return L.routine;
    return weekPlan(d)[wIdx(d)];
  }
  const hasDone = L => Object.values(L.ex || {}).some(x => x.done || (x.sets || []).some(s => s.done));

  function ensureLog(key, rid) {
    let L = S.logs[key];
    if (!L || (L.routine !== rid && !hasDone(L))) L = S.logs[key] = { routine: rid, ex: {}, started: null, done: false };
    slotsFor(L.routine, parse(key)).forEach(s => { if (!L.ex[s.id]) L.ex[s.id] = { ex: s.ex, sets: [], done: false }; });
    return L;
  }
  function logSlots(key) {
    const L = S.logs[key];
    const slots = slotsFor(L.routine, parse(key));
    return slots.map(s => { const x = L.ex[s.id]; return x && x.ex !== s.ex ? Object.assign({}, s, { ex: x.ex, reps: E[x.ex].reps || R[L.routine].slots.find(o => o.id === s.id).reps }) : s; });
  }

  function history(exId, beforeKey) {
    const out = [];
    Object.keys(S.logs).sort().forEach(k => {
      if (beforeKey && k >= beforeKey) return;
      Object.values(S.logs[k].ex || {}).forEach(x => {
        if (x.ex !== exId) return;
        const sets = (x.sets || []).filter(s => s.done && +s.reps > 0);
        if (sets.length) out.push({ d: k, sets });
      });
    });
    return out;
  }
  const e1rm = s => (+s.kg || 0) * (1 + Math.min(+s.reps, 12) / 30);

  function suggest(exId, slot, beforeKey) {
    const ex = E[exId];
    const [lo, hi] = slot.reps;
    const h = history(exId, beforeKey);
    if (ex.unit === 'seg') {
      if (!h.length) return { kg: null, text: `Arranca aguantando ${lo}-${hi} s con buena técnica.` };
      const l = h[h.length - 1];
      return l.sets.every(s => +s.reps >= hi)
        ? { kg: null, text: `Ya aguantas ${hi} s en todas. Sube a ${hi + 10} s o agrégale un disco.`, up: true }
        : { kg: null, text: `Busca sumar 5 s por serie hasta llegar a ${hi} s.` };
    }
    if (!h.length) return { kg: null, text: `Primera vez: elige un peso con el que llegues a ${lo}-${hi} reps dejando 2-3 en reserva.` };
    const last = h[h.length - 1];
    const top = Math.max(...last.sets.map(s => +s.kg || 0));
    const allTop = last.sets.length >= slot.sets && last.sets.every(s => +s.reps >= hi);
    const below = x => x.sets.some(s => +s.reps < lo);
    if (allTop) {
      const nk = top + ex.inc;
      return { kg: nk, up: true, text: ex.bw && top <= 0 && nk > 0
        ? `Llegaste a ${hi} reps en todas las series. Agrega ${fmt(ex.inc)} kg de lastre.`
        : `Llegaste a ${hi} reps en todas las series. Toca subir: ${fmt(nk)} kg.` };
    }
    if (below(last) && h.length >= 2 && below(h[h.length - 2])) {
      const prevTop = Math.max(...h[h.length - 2].sets.map(s => +s.kg || 0));
      if (prevTop === top && top > 0) {
        const dl = roundTo(top * 0.9, ex.inc);
        return { kg: dl, text: `Dos sesiones por debajo de ${lo} reps. Baja a ${fmt(dl)} kg y vuelve a construir.` };
      }
    }
    return { kg: top, text: `Quédate en ${fmt(top)} kg y busca sumar 1 rep por serie hasta llegar a ${hi}.` };
  }

  function slotForEx(exId) {
    for (const rid in R) for (const s of slotsFor(rid)) if (s.ex === exId) return s;
    return { sets: 3, reps: E[exId].reps || [8, 12] };
  }

  /* ---------- UI común ---------- */
  const app = $('#app');
  const nav = $('#nav');
  let lastRoute = '';
  let navCount = 0;
  window.addEventListener('hashchange', () => { navCount++; render(); });

  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('in');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove('in'), 2200);
  }

  function openSheet(html) {
    closeSheet(true);
    const bg = document.createElement('div');
    bg.className = 'sheet-bg';
    bg.dataset.a = 'sheet-close';
    const sh = document.createElement('div');
    sh.className = 'sheet';
    sh.setAttribute('role', 'dialog');
    sh.innerHTML = '<div class="grab"></div>' + html;
    document.body.append(bg, sh);
    requestAnimationFrame(() => { bg.classList.add('in'); sh.classList.add('in'); });
    animateFigures(sh);
  }
  function closeSheet(instant) {
    document.querySelectorAll('.sheet, .sheet-bg').forEach(el => {
      if (instant) return el.remove();
      el.classList.remove('in');
      setTimeout(() => el.remove(), 280);
    });
  }

  function animateFigures(root) {
    (root || document).querySelectorAll('[data-anim]').forEach(el => {
      if (el._anim) return;
      el._anim = true;
      FIG.animate(el.querySelector('svg'), el.dataset.anim, el.dataset.prop);
    });
  }
  const fig = (exId, t, cls) => FIG.svg(E[exId].pose, t, E[exId].prop, cls);
  const photo = (id, n) => `img/ex/${id}_${n}.jpg`;
  const media = (id, cls) => E[id].img ? `<div class="ph ${cls || ''}"><img src="${photo(id, 0)}" alt="${esc(E[id].n)}: inicio"><img class="b" src="${photo(id, 1)}" alt="${esc(E[id].n)}: final"></div>` : animFig(id, cls);
  const still = (id, n) => E[id].img ? `<img class="still" src="${photo(id, n)}" alt="" loading="lazy">` : fig(id, n);
  const animFig = (exId, cls) => `<div class="${cls || ''}" data-anim="${E[exId].pose}" data-prop="${E[exId].prop}">${fig(exId, 0)}</div>`;

  function head(title, sub, right) {
    return `<header class="topbar"><div><h1>${title}</h1>${sub ? `<div class="sub">${sub}</div>` : ''}</div>${right || ''}</header>`;
  }
  const gearBtn = `<a class="icon-btn" href="#/ajustes" aria-label="Ajustes">${ic('gear')}</a>`;
  const backBtn = `<button class="icon-btn" data-a="back" aria-label="Volver">${ic('back', 2.4)}</button>`;

  function lineChart(pts, unit) {
    if (pts.length < 2) return '<div class="empty small">Con 2 registros o más aparece la gráfica.</div>';
    const W = 340, H = 170, pl = 34, pr = 44, pt = 12, pb = 24;
    const xs = pts.map(p => parse(p.x).getTime());
    const ys = pts.map(p => p.y);
    let x0 = Math.min(...xs), x1 = Math.max(...xs);
    if (x1 === x0) x1 = x0 + 864e5;
    let y0 = Math.min(...ys), y1 = Math.max(...ys);
    const py = (y1 - y0) * 0.18 || 1;
    y0 -= py; y1 += py;
    const X = t => pl + (t - x0) / (x1 - x0) * (W - pl - pr);
    const Y = v => pt + (1 - (v - y0) / (y1 - y0)) * (H - pt - pb);
    let g = '';
    for (let i = 0; i <= 2; i++) {
      const v = y0 + (y1 - y0) * i / 2;
      g += `<line x1="${pl}" x2="${W - pr}" y1="${Y(v).toFixed(1)}" y2="${Y(v).toFixed(1)}" class="grid"/><text x="${pl - 6}" y="${(Y(v) + 4).toFixed(1)}" text-anchor="end" class="ax">${fmt(Math.round(v * 10) / 10)}</text>`;
    }
    const P = pts.map((p, i) => [X(xs[i]), Y(p.y)]);
    const d = P.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    const area = `${d} L${P[P.length - 1][0].toFixed(1)} ${H - pb} L${P[0][0].toFixed(1)} ${H - pb} Z`;
    const dots = pts.length <= 24 ? P.map(p => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3.5" class="dt"/>`).join('') : '';
    const L = P[P.length - 1];
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Gráfica de evolución">${g}
      <path d="${area}" class="ar"/><path d="${d}" class="ln"/>${dots}
      <text x="${(L[0] + 8).toFixed(1)}" y="${(L[1] + 4).toFixed(1)}" class="lastv">${fmt(ys[ys.length - 1])}${unit || ''}</text>
      <text x="${pl}" y="${H - 6}" class="ax">${shortDate(pts[0].x)}</text>
      <text x="${W - pr}" y="${H - 6}" text-anchor="end" class="ax">${shortDate(pts[pts.length - 1].x)}</text></svg>`;
  }

  /* ---------- volumen semanal por músculo ---------- */
  const MUSCLES = ['Pecho', 'Espalda', 'Hombro frontal', 'Hombro lateral', 'Hombro posterior', 'Bíceps', 'Tríceps', 'Cuádriceps', 'Isquiotibiales', 'Glúteos', 'Gemelos', 'Abdomen'];
  function muscleOf(name) {
    const n = name.toLowerCase();
    if (n.includes('pectoral')) return 'Pecho';
    if (n.includes('dorsal') || n.includes('romboides') || n.includes('trapecio medio') || n.includes('trapecio inferior') || n.includes('espalda alta')) return 'Espalda';
    if (n.includes('deltoides anterior') || n === 'hombros') return 'Hombro frontal';
    if (n.includes('deltoides lateral')) return 'Hombro lateral';
    if (n.includes('deltoides posterior')) return 'Hombro posterior';
    if (n.includes('bíceps') || n.includes('braquial') || n.includes('braquiorradial')) return 'Bíceps';
    if (n.includes('tríceps')) return 'Tríceps';
    if (n.includes('cuádriceps')) return 'Cuádriceps';
    if (n.includes('isquiotibiales')) return 'Isquiotibiales';
    if (n.includes('glúteo')) return 'Glúteos';
    if (n.includes('gastrocnemio') || n.includes('sóleo') || n.includes('gemelos')) return 'Gemelos';
    if (n.includes('abdominal') || n.includes('oblicuos') || n.includes('transverso') || n === 'core' || n.includes('flexores de cadera')) return 'Abdomen';
    return null;
  }
  // Peso por músculo de un ejercicio: principal 1, secundario 0,5 (sin contar dos veces el mismo músculo)
  const exWeights = {};
  function weightsOf(exId) {
    if (exWeights[exId]) return exWeights[exId];
    const w = {};
    E[exId].s.forEach(m => { const g = muscleOf(m); if (g) w[g] = Math.max(w[g] || 0, 0.5); });
    E[exId].m.forEach(m => { const g = muscleOf(m); if (g) w[g] = 1; });
    return (exWeights[exId] = w);
  }
  function weekVolume(d0) {
    const done = {}, plan = {};
    const add = (o, exId, n) => { const w = weightsOf(exId); for (const g in w) o[g] = (o[g] || 0) + w[g] * n; };
    for (let i = 0; i < 7; i++) {
      const d = addDays(d0, i), k = dk(d), L = S.logs[k];
      const rid = L && (L.started || hasDone(L)) ? L.routine : weekPlan(d)[i];
      if (rid) (L && L.routine === rid ? logSlots(k) : slotsFor(rid, d)).forEach(sl => add(plan, sl.ex, sl.sets));
      if (L) Object.values(L.ex || {}).forEach(x => { const n = (x.sets || []).filter(st => st.done).length || (x.done ? (R[L.routine].slots.find(o => L.ex[o.id] === x) || { sets: 0 }).sets : 0); if (n) add(done, x.ex, n); });
    }
    return { done, plan };
  }
  let volWeekOffset = 0;
  function volumeCard() {
    const d0 = addDays(monday(now()), -7 * volWeekOffset);
    const { done, plan } = weekVolume(d0);
    const MAX = 26;
    const pct = v => Math.min(100, v / MAX * 100);
    const zone = v => v < 10 ? ['Bajo', 'var(--warn)'] : v <= 20 ? ['En zona', 'var(--accent-text)'] : ['Alto', 'var(--danger)'];
    const low = MUSCLES.filter(m => (plan[m] || 0) < 10);
    let h = `<div class="card"><div class="row" style="align-items:flex-start"><div class="grow"><h2 style="margin-bottom:2px">Volumen semanal por músculo</h2>
      <div class="small muted">Series efectivas · semana del ${d0.getDate()} ${MONTHS[d0.getMonth()]}</div></div>
      <div class="seg" style="grid-template-columns:1fr 1fr;width:150px;flex:none">${['Esta', 'Pasada'].map((l, i) => `<button class="${volWeekOffset === i ? 'on' : ''}" data-a="vol-week" data-v="${i}" style="min-height:36px;font-size:13px">${l}</button>`).join('')}</div></div>
      <div style="margin-top:12px">${MUSCLES.map(m => {
        const dn = Math.round((done[m] || 0) * 2) / 2, pl = Math.round((plan[m] || 0) * 2) / 2, [zl, zc] = zone(volWeekOffset ? dn : pl);
        return `<div style="margin-bottom:10px"><div class="row small" style="justify-content:space-between;gap:8px"><b>${m}</b><span class="num"><b>${fmt(dn)}</b> de ${fmt(pl)} <span style="color:${zc};font-weight:700">· ${zl}</span></span></div>
          <div style="position:relative;height:10px;border-radius:99px;background:var(--ring-bg);margin-top:4px;overflow:hidden">
            <div style="position:absolute;left:${pct(10)}%;width:${pct(20) - pct(10)}%;top:0;bottom:0;background:var(--accent-text);opacity:.14"></div>
            <div style="position:absolute;left:0;width:${pct(pl)}%;top:0;bottom:0;border-radius:99px;background:var(--text);opacity:.14"></div>
            <div style="position:absolute;left:0;width:${pct(dn)}%;top:0;bottom:0;border-radius:99px;background:var(--accent-text)"></div></div></div>`;
      }).join('')}</div>
      <div class="small muted" style="display:flex;gap:12px;flex-wrap:wrap"><span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:var(--accent-text);vertical-align:-1px"></span> hecho</span><span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:var(--text);opacity:.25;vertical-align:-1px"></span> planeado</span><span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:var(--accent-text);opacity:.2;vertical-align:-1px"></span> zona 10-20</span></div>
      ${!volWeekOffset && low.length ? `<div class="tip">Con el plan de esta semana quedan cortos: <b>${low.join(', ')}</b>. Si te sobra energía, suma 2-3 series de un ejercicio de ese músculo o no te saltes su día.</div>` : ''}
      <p class="small muted" style="margin:10px 0 0">Una serie cuenta 1 para el músculo principal y 0,5 para los que ayudan. Solo cuentan series cerca del fallo (0-3 reps en reserva). <a href="https://doi.org/10.1007/s40279-025-02344-w" target="_blank" rel="noopener">Pelland et al., 2025</a></p></div>`;
    return h;
  }

  /* ---------- fotos de progreso (solo en este celular, IndexedDB) ---------- */
  const POSES = [['frente', 'Frente'], ['lado', 'Lado'], ['espalda', 'Espalda']];
  const IDB = (() => {
    let dbp = null;
    const open = () => dbp || (dbp = new Promise((res, rej) => {
      const r = indexedDB.open('pf-fotos', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('fotos', { keyPath: 'id' });
      r.onsuccess = () => res(r.result);
      r.onerror = () => { dbp = null; rej(r.error); };
    }));
    const run = (mode, fn) => open().then(db => new Promise((res, rej) => {
      const t = db.transaction('fotos', mode), req = fn(t.objectStore('fotos'));
      t.oncomplete = () => res(req && req.result);
      t.onerror = () => rej(t.error);
    }));
    return { put: o => run('readwrite', st => st.put(o)), del: id => run('readwrite', st => st.delete(id)), all: () => run('readonly', st => st.getAll()) };
  })();
  async function compressPhoto(file) {
    let img;
    try { img = await createImageBitmap(file, { imageOrientation: 'from-image' }); }
    catch (e) { img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(file); }); }
    const sc = Math.min(1, 1280 / Math.max(img.width, img.height));
    const c = document.createElement('canvas');
    c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    return new Promise(r => c.toBlob(r, 'image/jpeg', 0.82));
  }
  const thisWeek = () => dk(monday(now()));
  const photosPending = () => (S.photoWeeks[thisWeek()] || []).length < POSES.length;
  let photoURLs = [];
  let cmp = { a: null, b: null, pose: 'frente' };

  function viewFotos() {
    let h = `<div class="page-head">${backBtn}<div class="ttl">Fotos de progreso</div></div>
      <p class="small muted" style="margin:4px 2px 12px">Se guardan solo en este celular: no se suben a internet ni van en el respaldo. Mismo lugar, misma luz y a la misma hora (mejor en ayunas, el día del pesaje).</p>
      <div id="fotosBody"><div class="card empty">Cargando fotos…</div></div>
      <input type="file" id="phIn" accept="image/*" class="hidden">`;
    app.innerHTML = h;
    renderFotos();
  }
  async function renderFotos() {
    const box = $('#fotosBody');
    if (!box) return;
    let all = [];
    try { all = await IDB.all(); } catch (e) { box.innerHTML = '<div class="card empty">Este navegador no deja guardar fotos. Prueba en Chrome sin modo incógnito.</div>'; return; }
    photoURLs.forEach(u => URL.revokeObjectURL(u)); photoURLs = [];
    const url = b => { const u = URL.createObjectURL(b); photoURLs.push(u); return u; };
    const byWeek = {};
    all.forEach(p => { (byWeek[p.week] = byWeek[p.week] || {})[p.pose] = p; });
    const weeks = Object.keys(byWeek).sort();
    // sincroniza el índice liviano del estado
    S.photoWeeks = {}; weeks.forEach(w => { S.photoWeeks[w] = Object.keys(byWeek[w]); }); save();
    const wk = thisWeek(), cur = byWeek[wk] || {};
    const kgOf = w => { const b = S.body.filter(x => x.d >= w && x.d <= dk(addDays(parse(w), 6))).pop(); return b ? b.kg : null; };
    let h = `<div class="sec-title" style="margin-top:4px">Esta semana <span class="small muted">desde el ${shortDate(wk)}</span></div>
      <div class="figs" style="grid-template-columns:repeat(3,minmax(0,1fr))">${POSES.map(([p, l]) => cur[p]
        ? `<div class="f"><img src="${url(cur[p].blob)}" alt="${l}" style="width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:10px;display:block;margin-bottom:6px">${l}<div style="display:flex;justify-content:center;flex-wrap:wrap;gap:0 6px;margin-top:2px"><button class="link-btn" style="padding:4px;font-size:12px" data-a="ph-add" data-pose="${p}">Cambiar</button><button class="link-btn" style="padding:4px;font-size:12px;color:var(--danger)" data-a="ph-del" data-id="${cur[p].id}">Borrar</button></div></div>`
        : `<button class="f" data-a="ph-add" data-pose="${p}" style="aspect-ratio:3/4;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;border:2px dashed var(--line);box-shadow:none">${ic('plus')}<span>${l}</span></button>`).join('')}</div>`;
    if (weeks.length >= 2) {
      if (!byWeek[cmp.a]) cmp.a = weeks[0];
      if (!byWeek[cmp.b]) cmp.b = weeks[weeks.length - 1];
      const opt = sel => weeks.map(w => `<option value="${w}" ${w === sel ? 'selected' : ''}>Semana del ${shortDate(w)}</option>`).join('');
      const A = byWeek[cmp.a][cmp.pose], B = byWeek[cmp.b][cmp.pose];
      const ka = kgOf(cmp.a), kb = kgOf(cmp.b);
      const side = (P, w, kg) => P ? `<div><img src="${url(P.blob)}" alt="" style="width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:12px;display:block"><div class="small" style="text-align:center;margin-top:4px"><b>${shortDate(w)}</b>${kg ? ' · ' + fmt(kg) + ' kg' : ''}</div></div>` : `<div class="empty small" style="aspect-ratio:3/4;display:grid;place-items:center;background:var(--surface-2);border-radius:12px">Sin foto de ${cmp.pose}</div>`;
      h += `<div class="sec-title">Comparar</div><div class="card">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><select class="field" data-cmp="a" style="font-size:14px">${opt(cmp.a)}</select><select class="field" data-cmp="b" style="font-size:14px">${opt(cmp.b)}</select></div>
        <div class="seg" style="margin:10px 0">${POSES.map(([p, l]) => `<button class="${cmp.pose === p ? 'on' : ''}" data-a="ph-pose" data-v="${p}">${l}</button>`).join('')}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">${side(A, cmp.a, ka)}${side(B, cmp.b, kb)}</div>
        ${ka && kb ? `<p class="small" style="margin:10px 0 0;text-align:center">Diferencia: <b class="num">${kb - ka >= 0 ? '+' : ''}${fmt(Math.round((kb - ka) * 10) / 10)} kg</b> en ${Math.round((parse(cmp.b) - parse(cmp.a)) / 6048e5)} semanas</p>` : ''}</div>`;
    } else h += `<p class="small muted" style="margin:10px 2px 0">Con fotos de 2 semanas distintas aparece la comparación lado a lado.</p>`;
    const past = weeks.filter(w => w !== wk).reverse();
    if (past.length) h += `<div class="sec-title">Semanas anteriores</div>${past.map(w => `<div class="card" style="padding:12px"><div class="small" style="margin-bottom:8px"><b>Semana del ${shortDate(w)}</b>${kgOf(w) ? ' · ' + fmt(kgOf(w)) + ' kg' : ''}</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px">${POSES.map(([p]) => byWeek[w][p] ? `<a href="${url(byWeek[w][p].blob)}" download="progreso-${w}-${p}.jpg"><img src="${photoURLs[photoURLs.length - 1]}" alt="" style="width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:8px;display:block"></a>` : '<div style="aspect-ratio:3/4;background:var(--surface-2);border-radius:8px"></div>').join('')}</div></div>`).join('')}<p class="small muted" style="margin:6px 2px 0">Toca una foto para guardarla en tu galería.</p>`;
    box.innerHTML = h;
  }

  /* ---------- composición corporal ---------- */
  const log10 = Math.log10;
  const lastBody = () => S.body.slice().sort((a, b) => a.d < b.d ? -1 : 1).pop();
  const lastMeasure = () => S.measures.slice().sort((a, b) => a.d < b.d ? -1 : 1).pop();
  function bodyCalc() {
    const P = S.profile, man = P.sex !== 'm';
    const w = (lastBody() || {}).kg || 65, h = +P.height || 171, age = +P.age || 26, hm = h / 100;
    const M = lastMeasure() || {};
    const r = { w, h, age, man, M };
    r.bmi = w / (hm * hm);
    // % grasa: pliegues (Jackson-Pollock 3) > Marina EE. UU. > Deurenberg (IMC)
    const sf = M.sf || {};
    const S3 = man ? (+sf.a || 0) + (+sf.b || 0) + (+sf.c || 0) : (+sf.a || 0) + (+sf.b || 0) + (+sf.c || 0);
    if (sf.a && sf.b && sf.c) {
      const bd = man ? 1.10938 - 0.0008267 * S3 + 0.0000016 * S3 * S3 - 0.0002574 * age
        : 1.0994921 - 0.0009929 * S3 + 0.0000023 * S3 * S3 - 0.0001392 * age;
      r.bfJP = 495 / bd - 450;
    }
    if (M.waist && M.neck && (man || M.hip)) {
      r.bfNavy = man ? 495 / (1.0324 - 0.19077 * log10(M.waist - M.neck) + 0.15456 * log10(h)) - 450
        : 495 / (1.29579 - 0.35004 * log10(+M.waist + +M.hip - M.neck) + 0.221 * log10(h)) - 450;
    }
    r.bfBMI = 1.2 * r.bmi + 0.23 * age - (man ? 16.2 : 5.4);
    r.bf = r.bfJP != null ? r.bfJP : r.bfNavy != null ? r.bfNavy : r.bfBMI;
    r.bfMethod = r.bfJP != null ? 'pliegues (Jackson-Pollock 3)' : r.bfNavy != null ? 'medidas (método de la Marina de EE. UU.)' : 'IMC y edad (Deurenberg, muy aproximado)';
    r.fat = w * r.bf / 100; r.lbm = w - r.fat;
    r.ffmi = r.lbm / (hm * hm); r.nffmi = r.ffmi + 6.1 * (1.8 - hm);
    r.bmrM = 10 * w + 6.25 * h - 5 * age + (man ? 5 : -161);
    r.bmrK = 370 + 21.6 * r.lbm;
    r.bmr = r.bfBMI === r.bf ? r.bmrM : (r.bmrM + r.bmrK) / 2;
    r.tdee = r.bmr * (+S.profile.act || 1.55);
    r.whtr = M.waist ? M.waist / h : null;
    r.hrMax = 208 - 0.7 * age;
    r.water = w * 0.035 + 0.75;
    r.protKg = PLAN ? targets().p / w : null;
    r.bmiLo = 18.5 * hm * hm; r.bmiHi = 24.9 * hm * hm;
    return r;
  }
  const band = (v, list) => { for (const [max, label, tone] of list) if (v < max) return { label, tone }; return list[list.length - 1]; };
  const BMI_B = [[18.5, 'Bajo peso', 'warn'], [25, 'Normal', 'ok'], [30, 'Sobrepeso', 'warn'], [Infinity, 'Obesidad', 'bad']];
  const BF_H = [[6, 'Esencial', 'warn'], [14, 'Atlético', 'ok'], [18, 'Fitness', 'ok'], [25, 'Promedio', 'mid'], [Infinity, 'Alto', 'bad']];
  const BF_M = [[14, 'Esencial', 'warn'], [21, 'Atlético', 'ok'], [25, 'Fitness', 'ok'], [32, 'Promedio', 'mid'], [Infinity, 'Alto', 'bad']];
  const FFMI_B = [[18, 'Bajo', 'mid'], [20, 'Promedio', 'mid'], [22, 'Bueno', 'ok'], [23, 'Muy bueno', 'ok'], [25, 'Excelente', 'ok'], [Infinity, 'Muy raro sin fármacos', 'warn']];
  const toneColor = t => t === 'ok' ? 'var(--accent-text)' : t === 'bad' ? 'var(--danger)' : t === 'warn' ? 'var(--warn)' : 'var(--muted)';
  const statB = (l, v, b, hint) => `<div class="stat"><div class="l">${l}</div><div class="v num">${v}</div>${b ? `<div class="h" style="color:${toneColor(b.tone)};font-weight:700">${b.label}</div>` : ''}${hint ? `<div class="h">${hint}</div>` : ''}</div>`;

  function bodySummary() {
    const r = bodyCalc();
    return `<a class="card" style="display:block;text-decoration:none;color:inherit" href="#/cuerpo"><div class="row"><h2 class="grow" style="margin:0">Composición corporal</h2>${ic('right')}</div>
      <div class="stat-grid" style="margin-top:10px">
        ${statB('IMC', fmt(Math.round(r.bmi * 10) / 10), band(r.bmi, BMI_B))}
        ${statB('% grasa', fmt(Math.round(r.bf * 10) / 10) + ' %', band(r.bf, r.man ? BF_H : BF_M), r.bfNavy == null && r.bfJP == null ? 'estimado por IMC' : '')}
        ${statB('Masa magra', fmt(Math.round(r.lbm * 10) / 10) + ' kg')}
        ${statB('FFMI', fmt(Math.round(r.nffmi * 10) / 10), band(r.nffmi, FFMI_B))}
      </div><p class="small muted" style="margin:10px 0 0">Toca para anotar medidas y ver todos los cálculos.</p></a>`;
  }

  function viewCuerpo() {
    const r = bodyCalc(), M = r.M, P = S.profile;
    const r1 = v => fmt(Math.round(v * 10) / 10);
    const T = PLAN ? targets() : null;
    let h = `<div class="page-head">${backBtn}<div class="ttl">Composición corporal</div></div>
      <p class="small muted" style="margin:4px 2px 12px">Con ${r1(r.w)} kg (último pesaje), ${r.h} cm y ${r.age} años. Cambia tus datos en Ajustes.</p>
      <div class="sec-title" style="margin-top:6px">Peso y estatura</div>
      <div class="stat-grid">
        ${statB('IMC', r1(r.bmi), band(r.bmi, BMI_B), 'peso ÷ estatura²')}
        ${statB('Peso "normal" por IMC', r1(r.bmiLo) + '-' + r1(r.bmiHi) + ' kg')}
        ${statB('Cintura / estatura', r.whtr ? fmt(Math.round(r.whtr * 100) / 100) : '—', r.whtr ? (r.whtr < 0.5 ? { label: 'Saludable', tone: 'ok' } : { label: 'Riesgo aumentado', tone: 'warn' }) : null, r.whtr ? 'ideal < 0,5' : 'anota tu cintura')}
        ${statB('Proteína actual', r.protKg ? fmt(Math.round(r.protKg * 10) / 10) + ' g/kg' : '—', r.protKg ? (r.protKg >= 1.6 ? { label: 'Suficiente', tone: 'ok' } : { label: 'Baja', tone: 'warn' }) : null, 'meta 1,6-2,2')}
      </div>
      <p class="small muted" style="margin:8px 2px 0">El IMC no distingue músculo de grasa: en gente que entrena puede marcar "sobrepeso" sin serlo. Úsalo junto al % de grasa.</p>

      <div class="sec-title">Grasa y músculo</div>
      <div class="stat-grid">
        ${statB('% grasa', r1(r.bf) + ' %', band(r.bf, r.man ? BF_H : BF_M), r.bfMethod)}
        ${statB('Masa grasa', r1(r.fat) + ' kg')}
        ${statB('Masa magra', r1(r.lbm) + ' kg', null, 'todo menos grasa')}
        ${statB('FFMI', r1(r.nffmi), band(r.nffmi, FFMI_B), 'índice de masa libre de grasa (ajustado a 1,80 m)')}
      </div>
      ${r.bfNavy != null && r.bfJP != null ? `<p class="small muted" style="margin:8px 2px 0">Por medidas (Marina): ${r1(r.bfNavy)} %. Por pliegues: ${r1(r.bfJP)} %. Se usa el de pliegues, que es más preciso.</p>` : ''}
      <p class="small muted" style="margin:8px 2px 0">Todos los métodos caseros tienen un error de ±3-4 %. Lo útil es la tendencia: mídete igual, mismo día y hora, cada 2-4 semanas.</p>

      <div class="sec-title">Energía</div>
      <div class="stat-grid">
        ${statB('Metabolismo basal', Math.round(r.bmr).toLocaleString('es-CO') + ' kcal', null, r.bf === r.bfBMI ? 'Mifflin-St Jeor' : 'promedio Mifflin y Katch-McArdle')}
        ${statB('Gasto diario (TDEE)', Math.round(r.tdee).toLocaleString('es-CO') + ' kcal', null, 'basal × actividad ' + fmt(+P.act))}
        ${T ? statB('Tu meta', T.k.toLocaleString('es-CO') + ' kcal', null, (T.k - r.tdee >= 0 ? '+' : '') + Math.round(T.k - r.tdee) + ' kcal (' + (T.k - r.tdee >= 0 ? '+' : '') + Math.round((T.k / r.tdee - 1) * 100) + ' %) sobre el gasto') : ''}
        ${statB('Agua sugerida', fmt(Math.round(r.water * 10) / 10) + ' L', null, '35 ml/kg + entreno')}
      </div>
      <p class="small muted" style="margin:8px 2px 0">El gasto calculado es un punto de partida. El ajuste por pesaje en Progreso corrige con tu peso real, que manda sobre cualquier fórmula.</p>

      <div class="sec-title">Frecuencia cardíaca</div>
      <div class="card"><div class="small muted" style="margin-bottom:6px">Máxima estimada: <b class="num">${Math.round(r.hrMax)} ppm</b> (fórmula de Tanaka)</div>
        ${[['Zona 1 · recuperación', .5, .6], ['Zona 2 · cardio suave', .6, .7], ['Zona 3 · aeróbico', .7, .8], ['Zona 4 · umbral', .8, .9], ['Zona 5 · máximo', .9, 1]].map(([n, a, b]) => `<div class="list-item"><div class="grow t">${n}</div><div class="num" style="font-weight:700">${Math.round(r.hrMax * a)}-${Math.round(r.hrMax * b)}</div></div>`).join('')}</div>

      <div class="sec-title">Anotar medidas <span class="small muted">en cm, con cinta métrica</span></div>
      <div class="card">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          ${[['waist', 'Cintura (al ombligo)'], ['neck', 'Cuello (bajo la manzana)'], ['hip', 'Cadera'], ['chest', 'Pecho'], ['arm', 'Brazo (flexionado)'], ['thigh', 'Muslo']].map(([k, l]) => `<label><span class="small muted" style="font-weight:600">${l}</span><input class="field num" id="m_${k}" type="number" inputmode="decimal" step="0.1" value="${M[k] || ''}"></label>`).join('')}
        </div>
        <details class="eq" style="margin-top:10px"><summary>Pliegues con plicómetro (opcional, mm)</summary>
          <p class="small muted" style="margin:4px 0 8px">${r.man ? 'Hombre: pecho, abdomen y muslo.' : 'Mujer: tríceps, suprailíaco y muslo.'} Lado derecho, 2 tomas y promedias.</p>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">${(r.man ? ['Pecho', 'Abdomen', 'Muslo'] : ['Tríceps', 'Suprailíaco', 'Muslo']).map((l, i) => `<label><span class="small muted" style="font-weight:600">${l}</span><input class="field num" id="sf_${'abc'[i]}" type="number" inputmode="decimal" step="0.5" value="${(M.sf || {})['abc'[i]] || ''}"></label>`).join('')}</div></details>
        <button class="btn pri block" style="margin-top:12px" data-a="measure-save">Guardar medidas de hoy</button>
      </div>`;
    const ms = S.measures.slice().sort((a, b) => a.d < b.d ? -1 : 1);
    if (ms.length) {
      h += `<div class="sec-title">Evolución de la cintura</div><div class="card">${lineChart(ms.filter(m => m.waist).map(m => ({ x: m.d, y: +m.waist })), ' cm')}
        <table class="hist" style="margin-top:10px">${ms.slice(-6).reverse().map(m => `<tr><td class="muted">${shortDate(m.d)}</td><td class="num">${['waist', 'chest', 'arm', 'thigh'].filter(k => m[k]).map(k => ({ waist: 'cin', chest: 'pec', arm: 'bra', thigh: 'mus' }[k]) + ' ' + fmt(m[k])).join(' · ')}</td></tr>`).join('')}</table></div>`;
    }
    h += `<p class="small muted" style="margin:14px 2px 0">Fórmulas: IMC (OMS); % grasa: Hodgdon y Beckett (Marina de EE. UU.), Jackson y Pollock (3 pliegues, ecuación de Siri) y Deurenberg; FFMI: Kouri et al.; basal: Mifflin-St Jeor y Katch-McArdle; frecuencia máxima: Tanaka et al. Son estimaciones, no diagnóstico médico.</p>`;
    app.innerHTML = h;
  }

  /* ---------- ajuste de calorías por pesaje ---------- */
  const ADJ_STEP = 150, ADJ_MIN = -450, ADJ_MAX = 600;
  const kcalAdj = () => S.adjLog.reduce((a, x) => a + x.delta, 0);
  function targets() {
    const T = PLAN.targets, a = kcalAdj();
    return { k: T.k + a, p: T.p, c: Math.round(T.c + a / 4), f: T.f };
  }
  // Tendencia de peso (regresión lineal) desde el último ajuste, máximo 28 días atrás
  function weightTrend() {
    const last = S.adjLog[S.adjLog.length - 1];
    let from = dk(addDays(now(), -28));
    if (last && last.d > from) from = last.d;
    const pts = S.body.filter(b => b.d >= from).sort((a, b) => a.d < b.d ? -1 : 1);
    if (pts.length < 2) return { need: true, n: pts.length };
    const t0 = parse(pts[0].d).getTime();
    const xs = pts.map(p => (parse(p.d).getTime() - t0) / 864e5), ys = pts.map(p => p.kg);
    const span = xs[xs.length - 1];
    if (span < 13) return { wait: Math.ceil(14 - span), n: pts.length };
    const mx = xs.reduce((a, b) => a + b, 0) / xs.length, my = ys.reduce((a, b) => a + b, 0) / ys.length;
    const slope = xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0) / xs.reduce((a, x) => a + (x - mx) ** 2, 0);
    const rate = slope * 7;
    return { rate, pct: rate / my * 100, kg: my, n: pts.length, span };
  }
  function adjSuggestion() {
    const t = weightTrend();
    if (t.need || t.wait) return t;
    const lo = t.kg * 0.0025, hi = t.kg * 0.005;
    const ritmo = `${t.rate >= 0 ? '+' : ''}${fmt(Math.round(t.rate * 100) / 100)} kg por semana`;
    const meta = `${fmt(Math.round(lo * 100) / 100)} a ${fmt(Math.round(hi * 100) / 100)} kg`;
    const cur = kcalAdj();
    if (t.rate < lo && cur + ADJ_STEP <= ADJ_MAX) return Object.assign(t, { delta: ADJ_STEP, text: `Vas ${ritmo} y la meta es subir ${meta}. Sube ${ADJ_STEP} kcal al día (unos 38 g de carbos).` });
    if (t.rate > hi && cur - ADJ_STEP >= ADJ_MIN) return Object.assign(t, { delta: -ADJ_STEP, text: `Vas ${ritmo}: más rápido de lo ideal (${meta}), así que parte es grasa. Baja ${ADJ_STEP} kcal al día (unos 38 g de carbos).` });
    return Object.assign(t, { ok: true, text: `Vas ${ritmo}, dentro de la meta (${meta}). No cambies nada.` });
  }
  const adjFoodHint = a => a > 0
    ? `Suma unas ${a} kcal al día: ${a >= 300 ? Math.round(a / 150) + ' arepas medianas' : '1 arepa mediana'} o ${fmt(Math.round(a / 205 * 4) / 4)} taza de arroz extra.`
    : `Quita unas ${-a} kcal al día: ${-a >= 300 ? Math.round(-a / 150) + ' arepas medianas' : '1 arepa mediana'} o ${fmt(Math.round(-a / 205 * 4) / 4)} taza de arroz menos.`;
  const adjPending = () => { const sg = adjSuggestion(); return sg.delta && S.adjSkip !== (S.body.slice().sort((a, b) => a.d < b.d ? -1 : 1).pop() || {}).d ? sg : null; };
  function adjCard() {
    const sg = adjSuggestion(), a = kcalAdj(), T = targets();
    let h = `<div class="card"><h2>Ajuste de calorías</h2>
      <div class="small" style="margin:-4px 0 10px">Meta actual: <b class="num">${T.k.toLocaleString('es-CO')} kcal</b> · ${T.c} g carbos${a ? ` <span class="muted">(${a > 0 ? '+' : ''}${a} sobre el plan)</span>` : ''}</div>`;
    if (sg.need && S.adjLog.length) h += `<p class="small muted" style="margin:0">Ajuste aplicado. Sigue pesándote (mejor 2-3 veces por semana, en ayunas); en 2 semanas te digo si funcionó.</p>`;
    else if (sg.need) h += `<p class="small muted" style="margin:0">Pésate al menos 2 veces con 2 semanas de diferencia (mejor 2-3 veces por semana, en ayunas) y aquí te digo si subir o bajar calorías.</p>`;
    else if (sg.wait) h += `<p class="small muted" style="margin:0">Faltan ${sg.wait} días de pesajes${S.adjLog.length ? ' desde el último ajuste' : ''} para ver una tendencia confiable.</p>`;
    else if (sg.ok) h += `<div class="tip">${esc(sg.text)}</div>`;
    else {
      const skipped = !adjPending();
      h += `<div class="tip">${esc(sg.text)}<br><span class="small">${esc(adjFoodHint(sg.delta))}</span></div>`;
      h += skipped ? '<p class="small muted" style="margin:8px 0 0">Lo dejaste para después. Te lo vuelvo a proponer con el próximo pesaje.</p>'
        : `<div class="row" style="margin-top:10px"><button class="btn pri grow" data-a="adj-apply" data-v="${sg.delta}">Aplicar ${sg.delta > 0 ? '+' : ''}${sg.delta} kcal</button><button class="btn ghost" data-a="adj-skip">Ahora no</button></div>`;
    }
    if (a) h += `<p class="small muted" style="margin:10px 0 0">${esc(adjFoodHint(a))}</p>`;
    if (S.adjLog.length) h += `<details class="eq" style="margin-top:6px"><summary>Historial</summary><ul>${S.adjLog.slice().reverse().map(x => `<li>${shortDate(x.d)}: ${x.delta > 0 ? '+' : ''}${x.delta} kcal (ibas ${x.rate >= 0 ? '+' : ''}${fmt(Math.round(x.rate * 100) / 100)} kg/sem)</li>`).join('')}</ul><button class="link-btn" data-a="adj-reset">Volver a la meta del plan</button></details>`;
    return h + '</div>';
  }

  /* ---------- comida: helpers ---------- */
  function dayMeals(d) {
    if (!PLAN) return [];
    const k = dk(d);
    const base = PLAN.menu[wIdx(d)] || {};
    const sw = S.mealSwaps[k] || {};
    return PLAN.slots.map(sl => ({ slot: sl, id: sw[sl.id] || base[sl.id] })).filter(x => PLAN.meals[x.id]);
  }
  function sumMacros(list) {
    return list.reduce((a, x) => { const m = PLAN.meals[x.id].m; a.k += m.k; a.p += m.p; a.c += m.c; a.f += m.f; return a; }, { k: 0, p: 0, c: 0, f: 0 });
  }
  const eatenOf = (k, sl) => ((S.eaten[k] || {})[sl] || []);
  const sumEaten = arr => arr.reduce((a, x) => { a.k += x.k * x.q; a.p += x.p * x.q; a.c += x.c * x.q; a.f += x.f * x.q; return a; }, { k: 0, p: 0, c: 0, f: 0 });
  function dayDone(d, meals) {
    const k = dk(d), chk = S.meals[k] || {}, t = { k: 0, p: 0, c: 0, f: 0 };
    const add = m => { t.k += m.k; t.p += m.p; t.c += m.c; t.f += m.f; };
    meals.forEach(x => { const e = eatenOf(k, x.slot.id); if (e.length) add(sumEaten(e)); else if (chk[x.slot.id]) add(PLAN.meals[x.id].m); });
    add(sumEaten(eatenOf(k, 'extra')));
    ['k', 'p', 'c', 'f'].forEach(z => { t[z] = Math.round(t[z]); });
    return t;
  }
  const eatNames = arr => arr.map(x => (x.q !== 1 ? fmt(x.q) + ' × ' : '') + x.n).join(', ');
  function eatListHtml(k, sl) {
    const arr = eatenOf(k, sl);
    if (!arr.length) return '<p class="small muted" style="margin:0 0 6px">Aún no has agregado nada.</p>';
    const t = sumEaten(arr);
    const qb = (i, v, l) => `<button class="round" style="width:40px;height:40px;font-size:20px" data-a="eat-q" data-k="${k}" data-slot="${sl}" data-i="${i}" data-v="${v}" aria-label="${v > 0 ? 'Más' : 'Menos'}">${l}</button>`;
    return arr.map((x, i) => `<div class="list-item"><div class="grow"><div class="t">${esc(x.n)}</div><div class="d num">${esc(x.u || '')} · ${Math.round(x.k * x.q)} kcal</div></div>${qb(i, -1, '−')}<b class="num" style="min-width:30px;text-align:center">${fmt(x.q)}</b>${qb(i, 1, '+')}</div>`).join('')
      + `<div class="small num" style="margin:8px 0 4px"><b>Total: ${Math.round(t.k)} kcal</b> · ${Math.round(t.p)} g P · ${Math.round(t.c)} g C · ${Math.round(t.f)} g G</div>`;
  }

  function macroBars(done, plan) {
    const T = targets();
    const row = (l, key, u) => {
      const pct = Math.min(100, Math.round(done[key] / T[key] * 100));
      return `<div class="mbar"><div class="top"><span>${l}</span><span class="num"><b>${Math.round(done[key])}</b> / ${T[key]} ${u} <span class="muted">· plan ${Math.round(plan[key])}</span></span></div><div class="track"><div class="fill" style="width:${pct}%"></div></div></div>`;
    };
    return `<div class="macro-bars">${row('Calorías', 'k', 'kcal')}${row('Proteína', 'p', 'g')}${row('Carbos', 'c', 'g')}${row('Grasas', 'f', 'g')}</div>`;
  }

  const recipeFor = mealId => PLAN && (PLAN.recipes || []).find(r => r.meal === mealId);

  /* =========================================================
     VISTAS
     ========================================================= */

  function viewHoy() {
    const d = now();
    const k = dk(d);
    const rid = routineOn(d);
    const L = S.logs[k];
    const name = S.settings.name ? `, ${esc(S.settings.name)}` : '';
    let h = head(`¡Qué más${name}!`, longDate(d), gearBtn);

    if (rid) {
      const slots = L ? logSlots(k) : slotsFor(rid, d);
      const doneN = L ? slots.filter(s => L.ex[s.id] && L.ex[s.id].done).length : 0;
      const mins = Math.round((600 + slots.reduce((a, s) => a + s.sets * (45 + E[s.ex].r), 0)) / 60 / 5) * 5;
      const finished = L && L.done;
      h += `<section class="hero fade-in">
        <div class="hero-art">${fig(slots[0].ex, 1)}</div>
        <div class="k">Hoy toca</div><h2>${R[rid].n}</h2><p>${R[rid].d}</p>
        <div class="seg loc-seg" role="group" aria-label="Dónde entrenas hoy">${Object.entries(PLACES).map(([v, l]) => `<button class="${locOn(d) === v ? 'on' : ''}" data-a="loc-set" data-v="${v}">${l}</button>`).join('')}</div>
        <div class="meta"><span>${slots.length} ejercicios</span><span>≈ ${mins} min</span><span>${doneN}/${slots.length} hechos</span></div>
        ${finished
          ? `<a class="btn block big" href="#/resumen/${k}">${ic('check', 2.6)} Entreno terminado · ver resumen</a>`
          : `<button class="btn block big" data-a="start">${ic('play')} ${L && L.started ? 'Seguir entreno' : 'Arrancar entreno'}</button>`}
      </section>`;
    } else {
      h += `<section class="hero rest fade-in"><div class="k">Hoy</div><h2>Descanso</h2>
        <p>El músculo crece cuando descansas. Come bien, toma agua y duerme 7-9 horas.</p>
        <button class="btn block" data-a="rest-pick">${ic('swap')} ¿Te faltó una rutina? Hazla hoy</button></section>`;
    }

    // Pesaje
    const weighed = S.body.some(b => b.d === k);
    if (wIdx(d) === +S.settings.weighDay && !weighed) {
      h += `<div class="card fade-in"><h2>Pesaje de la semana</h2>
        <p class="small muted" style="margin:-4px 0 10px">En ayunas, después del baño y sin ropa pesada.</p>
        <div class="weigh"><input class="field num" id="wIn" type="number" inputmode="decimal" step="0.1" placeholder="kg"><button class="btn pri" data-a="weigh-save">Guardar</button></div></div>`;
    }

    if (PLAN && adjPending()) h += `<a class="card" style="display:block;text-decoration:none;color:inherit;outline:2px solid var(--accent-text);outline-offset:-2px" href="#/progreso"><div class="row"><div class="grow"><b>Ajuste de calorías sugerido</b><div class="small muted">${esc(adjPending().text)}</div></div>${ic('right')}</div></a>`;

    if (wIdx(d) === +S.settings.weighDay && photosPending()) h += `<a class="card" style="display:block;text-decoration:none;color:inherit" href="#/fotos"><div class="row"><div class="grow"><b>Fotos de progreso de la semana</b><div class="small muted">Frente, lado y espalda, con la misma luz de siempre.</div></div>${ic('right')}</div></a>`;

    // Ejercicios de hoy
    if (rid) {
      const slots = L ? logSlots(k) : slotsFor(rid, d);
      h += `<div class="sec-title">Ejercicios <span class="small muted">toca para ver la ficha</span></div><div class="card">`;
      slots.forEach(s => {
        const done = L && L.ex[s.id] && L.ex[s.id].done;
        const unit = E[s.ex].unit === 'seg' ? 's' : 'reps';
        h += `<div class="list-item ${done ? 'done' : ''}">
          <button class="tap" data-a="open-ex" data-id="${s.ex}" data-slot="${s.id}"><div class="t">${E[s.ex].n}</div><div class="d">${s.sets} × ${s.reps[0]}-${s.reps[1]} ${unit}${s.b ? ' · básico' : ''}</div></button>
          <button class="check ${done ? 'on' : ''}" data-a="ex-check" data-slot="${s.id}" aria-label="Marcar hecho">${ic('check', 3)}</button></div>`;
      });
      h += `</div>`;
    }

    // Comidas
    if (PLAN) {
      const meals = dayMeals(d);
      const chk = S.meals[k] || {};
      const doneM = dayDone(d, meals);
      h += `<div class="sec-title">Comidas de hoy <a class="small link-btn" href="#/comida">Ver menú</a></div><div class="card">
        <div class="mbar" style="margin-bottom:6px"><div class="top"><span>Calorías</span><span class="num"><b>${doneM.k}</b> / ${targets().k} kcal · <b>${doneM.p}</b> g proteína</span></div>
        <div class="track"><div class="fill" style="width:${Math.min(100, doneM.k / targets().k * 100)}%"></div></div></div>`;
      meals.forEach(x => {
        const ea = eatenOf(k, x.slot.id);
        const on = !!chk[x.slot.id] || ea.length > 0;
        h += `<div class="list-item ${on && !ea.length ? 'done' : ''}"><button class="tap" data-a="eat-open" data-k="${k}" data-slot="${x.slot.id}"><div class="d">${x.slot.time} · ${x.slot.label}${ea.length ? ' · lo que comiste' : ''}</div><div class="t">${esc(ea.length ? eatNames(ea) : PLAN.meals[x.id].n)}</div></button>
          <button class="check ${on ? 'on' : ''}" data-a="meal-check" data-k="${k}" data-slot="${x.slot.id}" aria-label="Marcar comida">${ic('check', 3)}</button></div>`;
      });
      h += `<button class="link-btn" data-a="eat-open" data-k="${k}" data-slot="extra">+ Registrar algo más (antojos, extras)</button><p class="small muted" style="margin:2px 0 0">Toca una comida para anotar lo que comiste si no seguiste el menú.</p></div>`;
    }

    // Agua
    const w = S.water[k] || 0, goal = +S.settings.waterGoal || 10;
    h += `<div class="sec-title">Agua</div><div class="card water">
      <button class="round" data-a="water" data-v="-1" aria-label="Quitar vaso">−</button>
      <div class="grow"><div class="count num">${w}<span class="muted" style="font-size:16px;font-weight:600"> / ${goal} vasos</span></div>
      <div class="small muted">${fmt(w * 0.25)} L de ${fmt(goal * 0.25)} L</div>
      <div class="glasses">${Array.from({ length: goal }, (_, i) => `<span class="g ${i < w ? 'on' : ''}"></span>`).join('')}</div></div>
      <button class="round pri" data-a="water" data-v="1" aria-label="Sumar vaso">+</button></div>`;

    if (PLAN && PLAN.news && PLAN.news.length) {
      h += `<div class="sec-title">Ciencia de la semana <a class="small link-btn" href="#/noticias">Ver todas</a></div><div class="card" style="padding-top:6px;padding-bottom:6px">${PLAN.news.slice(0, 2).map(n => `<a class="list-item" style="text-decoration:none;color:inherit" href="#/noticias"><div class="grow"><div class="d">${esc(n.tema)} · ${esc(n.tipo)}</div><div class="t">${esc(n.titulo)}</div></div>${ic('right')}</a>`).join('')}</div>`;
    }

    app.innerHTML = h;
  }

  function viewSemana() {
    const d0 = monday(now());
    const plan = weekPlan();
    const bi = blockInfo();
    const moved = !!S.weekMoves[dk(d0)];
    let h = head('Semana', `Del ${d0.getDate()} ${MONTHS[d0.getMonth()]} al ${addDays(d0, 6).getDate()} ${MONTHS[addDays(d0, 6).getMonth()]}`, gearBtn);
    h += `<div class="card block-info"><div class="row"><div class="grow"><b>Bloque ${bi.block + 1} de accesorios</b> · semana ${bi.week} de ${bi.len}
      <div class="small muted">Los básicos se quedan y suben de carga. Los accesorios cambian el ${bi.next.getDate()} de ${MONTHS_L[bi.next.getMonth()]}.</div></div></div>
      <div class="progress-line"><div style="width:${bi.week / bi.len * 100}%"></div></div></div>`;
    for (let i = 0; i < 7; i++) {
      const d = addDays(d0, i);
      const k = dk(d);
      const L = S.logs[k];
      const rid = L && (L.started || hasDone(L)) ? L.routine : plan[i];
      const isToday = k === dk(now());
      const past = d < monday(now()) || (k < dk(now()));
      let st = '';
      if (rid) {
        if (L && L.done) st = '<span class="st ok">Hecho</span>';
        else if (L && hasDone(L)) st = '<span class="st ok">A medias</span>';
        else if (past) st = '<span class="st" style="color:var(--warn)">Pendiente</span>';
      }
      h += `<div class="card day-card ${isToday ? 'today' : ''}"><div class="day ${isToday ? 'today' : ''}">
        <div class="dn"><span>${DAYS[i]}</span><b>${d.getDate()}</b></div>
        <div class="grow"><div style="font-weight:700;font-size:17px">${rid ? R[rid].n : 'Descanso'}</div>
        <div class="small muted">${rid ? R[rid].d : 'Recuperación'}</div>${st}${rid && !(L && L.done) ? `<button class="chip line" style="margin-top:6px" data-a="loc-cycle" data-k="${k}">${PLACES[locOn(d)]} · cambiar</button>` : ''}</div>
        ${rid && !(L && L.done) ? `<button class="btn ghost" style="min-height:44px;padding:0 14px" data-a="move" data-i="${i}">${ic('swap')} Mover</button>` : ''}
      </div></div>`;
    }
    if (moved) h += `<button class="btn ghost block" data-a="week-reset">Volver al orden normal</button>`;
    app.innerHTML = h;
  }

  function viewProgreso(sel) {
    let h = head('Progreso', 'Peso corporal y fuerza', gearBtn);
    const body = S.body.slice().sort((a, b) => a.d < b.d ? -1 : 1);
    const last = body[body.length - 1];
    const avg = (from, to) => { const xs = body.filter(b => b.d >= dk(from) && b.d <= dk(to)).map(b => b.kg); return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null; };
    const t = now();
    const a1 = avg(addDays(t, -6), t), a0 = avg(addDays(t, -13), addDays(t, -7));
    const delta = a1 != null && a0 != null ? a1 - a0 : null;
    const ref = last ? last.kg : 65;
    h += `<div class="card"><h2>Peso corporal</h2>
      <div class="weigh" style="margin-bottom:12px"><input class="field num" id="wIn" type="number" inputmode="decimal" step="0.1" placeholder="Tu peso hoy (kg)"><button class="btn pri" data-a="weigh-save">Guardar</button></div>
      ${lineChart(body.map(b => ({ x: b.d, y: b.kg })), ' kg')}
      <div class="stat-grid" style="margin-top:12px">
        <div class="stat"><div class="l">Último</div><div class="v num">${last ? fmt(last.kg) + ' kg' : '—'}</div><div class="h">${last ? shortDate(last.d) : 'Sin registros'}</div></div>
        <div class="stat"><div class="l">Cambio semanal</div><div class="v num">${delta == null ? '—' : (delta > 0 ? '+' : '') + fmt(Math.round(delta * 100) / 100) + ' kg'}</div><div class="h">promedio 7 días vs anteriores</div></div>
      </div>
      <p class="small muted" style="margin:12px 0 0">Meta para ganar músculo sin mucha grasa: subir <b>${fmt(Math.round(ref * 0.0025 * 100) / 100)}-${fmt(Math.round(ref * 0.005 * 100) / 100)} kg por semana</b> (0,25-0,5 % del peso). Si subes más rápido, baja un poco los carbos; si no subes en 2 semanas, súbelos. <a href="https://doi.org/10.3390/sports7070154" target="_blank" rel="noopener">Iraki et al., 2019</a></p></div>`;
    h += adjCard();
    h += volumeCard();
    h += bodySummary();
    const nW = Object.keys(S.photoWeeks).length;
    h += `<a class="card" style="display:block;text-decoration:none;color:inherit" href="#/fotos"><div class="row"><div class="grow"><h2 style="margin:0">Fotos de progreso</h2><div class="small muted" style="margin-top:4px">${nW ? nW + (nW === 1 ? ' semana guardada' : ' semanas guardadas') + (photosPending() ? ' · faltan las de esta semana' : ' · esta semana lista') : 'Frente, lado y espalda cada semana para ver el cambio que la báscula no muestra'}</div></div>${ic('right')}</div></a>`;

    const ids = [];
    Object.keys(S.logs).sort().reverse().forEach(k => Object.values(S.logs[k].ex || {}).forEach(x => {
      if (!ids.includes(x.ex) && (x.sets || []).some(s => s.done)) ids.push(x.ex);
    }));
    h += `<div class="sec-title">Fuerza por ejercicio</div>`;
    if (!ids.length) {
      h += `<div class="card empty">Cuando registres series en el entreno en vivo, aquí ves tu evolución y cuándo subir peso.</div>`;
    } else {
      const cur = ids.includes(sel) ? sel : ids[0];
      h += `<div class="scroll-x">${ids.map(id => `<button class="pick ${id === cur ? 'on' : ''}" data-a="pick-ex" data-id="${id}">${E[id].n}</button>`).join('')}</div>`;
      const ex = E[cur];
      const hist = history(cur);
      const seg = ex.unit === 'seg' || hist.every(x => x.sets.every(s => !(+s.kg)));
      const pts = hist.map(x => ({ x: x.d, y: seg ? Math.max(...x.sets.map(s => +s.reps)) : Math.round(Math.max(...x.sets.map(e1rm)) * 10) / 10 }));
      const best = Math.max(...pts.map(p => p.y));
      const lastS = hist[hist.length - 1];
      const topSet = lastS.sets.reduce((a, s) => (+s.kg > +a.kg || (+s.kg === +a.kg && +s.reps > +a.reps)) ? s : a, lastS.sets[0]);
      const sg = suggest(cur, slotForEx(cur));
      h += `<div class="card"><div class="row" style="align-items:flex-start"><div class="grow"><h2 style="margin-bottom:2px">${ex.n}</h2>
        <div class="small muted">${seg ? 'Mejor marca por sesión' : 'Fuerza estimada (1RM, fórmula de Epley)'}</div></div>
        <button class="icon-btn" data-a="open-ex" data-id="${cur}" aria-label="Ficha">${ic('info')}</button></div>
        ${lineChart(pts, seg ? (ex.unit === 'seg' ? ' s' : '') : ' kg')}
        <div class="stat-grid" style="margin-top:12px">
          <div class="stat"><div class="l">${seg ? 'Mejor' : 'Mejor 1RM est.'}</div><div class="v num">${fmt(best)}${seg ? (ex.unit === 'seg' ? ' s' : ' reps') : ' kg'}</div></div>
          <div class="stat"><div class="l">Última mejor serie</div><div class="v num">${seg ? topSet.reps + (ex.unit === 'seg' ? ' s' : ' reps') : fmt(+topSet.kg) + ' × ' + topSet.reps}</div><div class="h">${shortDate(lastS.d)}</div></div>
        </div>
        <div class="tip">${esc(sg.text)}</div>
        <table class="hist" style="margin-top:12px">${hist.slice(-8).reverse().map(x => `<tr><td class="muted">${shortDate(x.d)}</td><td class="num">${x.sets.map(s => ex.unit === 'seg' ? s.reps + ' s' : fmt(+s.kg) + '×' + s.reps).join(' · ')}</td></tr>`).join('')}</table></div>`;
    }
    app.innerHTML = h;
  }

  let comidaDay = null;
  function viewComida() {
    let h = head('Comida', PLAN ? `Meta: ${targets().k} kcal · ${targets().p} P · ${targets().c} C · ${targets().f} G` : '', gearBtn);
    if (!PLAN) { app.innerHTML = h + '<div class="card empty">Cargando el plan…</div>'; return; }
    const d0 = monday(now());
    const sel = comidaDay == null ? wIdx(now()) : comidaDay;
    const d = addDays(d0, sel);
    const k = dk(d);
    h += `<div class="day-chips">${DAYS.map((n, i) => `<button class="${i === sel ? 'on' : ''} ${i === wIdx(now()) ? 'today' : ''}" data-a="day" data-i="${i}">${n}<b>${addDays(d0, i).getDate()}</b></button>`).join('')}</div>`;
    const meals = dayMeals(d);
    const chk = S.meals[k] || {};
    h += `<div class="card">${macroBars(dayDone(d, meals), sumMacros(meals))}
      <p class="small muted" style="margin:10px 0 0">Las barras suman lo que marcas y lo que registras. Macros aproximadas.</p>${kcalAdj() ? `<div class="tip">${esc(adjFoodHint(kcalAdj()))} El menú sigue en ${PLAN.targets.k} kcal.</div>` : ''}</div>`;
    meals.forEach(x => {
      const m = PLAN.meals[x.id];
      const ea = eatenOf(k, x.slot.id), et = sumEaten(ea);
      const on = !!chk[x.slot.id] || ea.length > 0;
      h += `<div class="card meal-card ${on && !ea.length ? 'done' : ''}"><div class="meal"><div class="grow">
        <div class="time">${x.slot.time} · ${x.slot.label.toUpperCase()}</div>
        <div class="name">${esc(m.n)}</div>
        <ul>${m.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
        <div class="mac num">${m.m.k} kcal · ${m.m.p} g P · ${m.m.c} g C · ${m.m.f} g G</div>
        ${ea.length ? `<div class="tip"><b>Lo que comiste:</b> ${esc(eatNames(ea))}<br><span class="num">${Math.round(et.k)} kcal · ${Math.round(et.p)} g P</span></div>` : ''}
        <div class="acts">${m.lleva ? '<span class="chip line">Para llevar</span>' : ''}<button class="link-btn" data-a="meal-swap" data-k="${k}" data-slot="${x.slot.id}">Cambiar por otra</button><button class="link-btn" data-a="eat-open" data-k="${k}" data-slot="${x.slot.id}">${ea.length ? 'Editar lo que comí' : 'Comí otra cosa'}</button>${recipeFor(x.id) ? `<button class="link-btn" data-a="recipe" data-id="${recipeFor(x.id).id}">Ver receta</button>` : ''}</div>
        </div><button class="check ${on ? 'on' : ''}" data-a="meal-check" data-k="${k}" data-slot="${x.slot.id}" aria-label="Marcar comida">${ic('check', 3)}</button></div></div>`;
    });
    const ex = eatenOf(k, 'extra');
    h += `<div class="card"><div class="small muted" style="font-weight:700">EXTRAS Y ANTOJOS</div>${ex.length ? `<div style="font-weight:700;margin:4px 0">${esc(eatNames(ex))}</div><div class="small num">${Math.round(sumEaten(ex).k)} kcal</div>` : '<p class="small muted" style="margin:4px 0">Lo que comiste fuera de las comidas del plan.</p>'}<button class="link-btn" data-a="eat-open" data-k="${k}" data-slot="extra">${ex.length ? 'Editar' : '+ Agregar'}</button></div>`;
    h += `<div class="sec-title">Equivalencias</div><div class="card">
      <p class="small muted" style="margin:0 0 6px">Cambia un alimento por otro del mismo grupo y mantienes las macros.</p>
      ${PLAN.equivalencias.map(g => `<details class="eq"><summary>${esc(g.grupo)} <span class="small muted" style="margin-left:auto;margin-right:10px">${esc(g.base)}</span></summary><ul>${g.opciones.map(o => `<li>${esc(o)}</li>`).join('')}</ul></details>`).join('')}</div>`;
    h += `<div class="sec-title">Recetas de la semana</div>`;
    h += PLAN.recipes && PLAN.recipes.length
      ? `<div class="card" style="padding-top:6px;padding-bottom:6px">${PLAN.recipes.map(r => `<div class="list-item"><button class="tap" data-a="recipe" data-id="${r.id}"><div class="t">${esc(r.n)}</div><div class="d">${r.min} min · ${esc(r.rinde || '')}${r.lleva ? ' · para llevar' : ''}</div></button>${ic('right')}</div>`).join('')}</div>`
      : `<div class="card empty small">Las recetas nuevas llegan con la actualización del lunes.</div>`;
    app.innerHTML = h;
  }

  function viewMercado() {
    let h = head('Mercado', PLAN ? `Para ${PLAN.market.days} días` : '', gearBtn);
    if (!PLAN) { app.innerHTML = h + '<div class="card empty">Cargando el plan…</div>'; return; }
    const M = PLAN.market;
    const chk = S.market[M.updated] || {};
    const items = M.items.map(i => S.myPrices[i.id] ? Object.assign({}, i, { price: S.myPrices[i.id].price, store: 'Tu precio', date: S.myPrices[i.id].date, mine: true }) : i);
    const priced = items.filter(i => i.price > 0);
    const full = priced.reduce((a, i) => a + i.price, 0);
    const total = Math.round(priced.reduce((a, i) => a + (i.mes ? i.price / 2 : i.price), 0));
    const bud = Math.round((+S.settings.budget || 0) * M.days / 15);
    const doneN = items.filter(i => chk[i.id]).length;
    h += `<div class="card"><div class="budget"><div><div class="small muted">Promedio por quincena</div><div class="v num">${priced.length ? cop(total) : 'Sin precios aún'}</div>${full !== total ? `<div class="small muted num">Esta compra: ${cop(full)}</div>` : ''}</div>
      <div style="text-align:right"><div class="small muted">Presupuesto ${M.days} días</div><div style="font-weight:800" class="num">${bud ? cop(bud) : '<a href="#/ajustes">Ponlo en ajustes</a>'}</div></div></div>
      ${priced.length && bud ? `<div class="progress-line"><div style="width:${Math.min(100, total / bud * 100)}%;${total > bud ? 'background:var(--danger)' : ''}"></div></div>` : ''}
      <p class="small muted" style="margin:10px 0 0">${esc(M.note || '')}</p>
      <div class="row" style="margin-top:10px"><div class="grow small"><b>${doneN}</b> de ${items.length} comprados</div><button class="link-btn" data-a="mk-reset">Desmarcar todo</button></div></div>`;
    if (priced.length && bud) {
      const diff = bud - total;
      const subs = M.subs || [];
      const save = subs.reduce((a, x) => a + x.ahorro, 0);
      h += `<div class="card"><h2>${diff >= 0 ? 'Vas bien' : 'Te pasas por ' + cop(-diff)}</h2>
        <p class="small muted" style="margin:-4px 0 8px">${diff >= 0 ? 'Te sobran ' + cop(diff) + '. Si el presupuesto baja, estos cambios ayudan:' : 'Estos cambios mantienen macros parecidas y cuestan menos:'}</p>
        ${subs.map(x => `<div class="list-item"><div class="grow"><div class="t">${esc(x.de)} → ${esc(x.por)}</div><div class="d">${esc(x.nota || '')}</div></div><div class="price num" style="color:var(--accent-text)">−${cop(x.ahorro)}</div></div>`).join('')}
        ${subs.length ? `<p class="small" style="margin:10px 0 0">Con todos los cambios: <b class="num">${cop(total - save)}</b></p>` : ''}</div>`;
    }
    if (M.sources) h += `<p class="small muted" style="margin:4px 4px 0">Fuentes: ${esc(M.sources)}</p>`;
    const cats = [];
    items.forEach(i => { if (!cats.includes(i.cat)) cats.push(i.cat); });
    cats.forEach(c => {
      h += `<div class="cat-title">${esc(c)}</div><div class="card" style="padding-top:6px;padding-bottom:6px">`;
      items.filter(i => i.cat === c).forEach(i => {
        const on = !!chk[i.id];
        h += `<div class="list-item ${on ? 'done' : ''}"><button class="check ${on ? 'on' : ''}" data-a="mk-check" data-id="${i.id}" aria-label="Comprado">${ic('check', 3)}</button>
          <button class="tap" data-a="mk-info" data-id="${i.id}"><div class="t">${esc(i.n)}</div><div class="d">${esc(i.q)}${i.mes ? ' · dura ~1 mes' : ''}</div></button>
          ${i.price > 0 ? `<button class="price num" ${i.mine ? 'style="color:var(--accent-text)"' : ''} data-a="mk-info" data-id="${i.id}">${cop(i.price)}<small>${esc(i.store || '')}${i.date ? ' · ' + shortDate(i.date) : ''}</small></button>` : '<div class="price small muted">Sin dato</div>'}</div>`;
      });
      h += `</div>`;
    });
    app.innerHTML = h;
  }

  /* ---------- ficha de ejercicio ---------- */
  function viewEj(id, slotId) {
    const ex = E[id];
    if (!ex) { location.hash = '#/hoy'; return; }
    const slot = slotId ? findSlot(slotId) : null;
    const isBasic = slot ? !!slot.b : BASICS.has(id);
    const alts = slotId ? altsFor(id, locOn()) : G[ex.g].filter(x => x !== id);
    let h = `<div class="page-head">${backBtn}<div class="ttl">Ficha del ejercicio</div></div>
      <h1 class="ex-title">${ex.n}</h1>
      <div class="chips"><span class="chip acc">${isBasic ? 'Básico · progresa carga' : 'Accesorio · rota por bloques'}</span><span class="chip">${PROP[ex.prop]}</span></div>
      ${media(id, 'figure-main')}
      <div class="figs"><div class="f">${still(id, 0)}Inicio</div><div class="f">${still(id, 1)}Final</div></div>
      <div class="card muscles"><h2>Músculos</h2><div class="small muted" style="margin-bottom:6px">Principal</div><div class="chips">${ex.m.map(m => `<span class="chip acc">${m}</span>`).join('')}</div>
      ${ex.s.length ? `<div class="small muted" style="margin:10px 0 6px">Secundarios</div><div class="chips">${ex.s.map(m => `<span class="chip line">${m}</span>`).join('')}</div>` : ''}</div>
      <div class="card"><h2>Técnica</h2><ol class="cues">${ex.c.map(c => `<li>${esc(c)}</li>`).join('')}</ol></div>
      <div class="card"><h2>Errores comunes</h2><ul class="errs">${ex.e.map(c => `<li>${esc(c)}</li>`).join('')}</ul></div>
      <div class="stat-grid">
        <div class="stat"><div class="l">Tempo</div><div class="v">${ex.t}</div><div class="h">${ex.t === 'Isométrico' ? 'aguanta la posición' : 'bajada · pausa · subida (X = explosiva)'}</div></div>
        <div class="stat"><div class="l">Descanso</div><div class="v num">${mmss(ex.r)}</div><div class="h">entre series</div></div>
        ${slot ? `<div class="stat" style="grid-column:1/-1"><div class="l">Hoy</div><div class="v num">${slot.sets} × ${slot.reps[0]}-${slot.reps[1]} ${ex.unit === 'seg' ? 's' : 'reps'}</div><div class="h">${esc(suggest(id, slot).text)}</div></div>` : ''}
      </div>
      <div class="sec-title">Variaciones</div>
      <p class="small muted" style="margin:-4px 2px 10px">Equivalentes para cuando no hay equipo, algo molesta o te aburriste.</p><div class="card">`;
    alts.forEach(a => {
      h += `<div class="list-item"><div style="width:52px;height:52px;flex:none;background:var(--surface-2);border-radius:12px;overflow:hidden">${still(a, 0)}</div>
        <button class="tap" data-a="open-ex" data-id="${a}"${slotId ? ` data-slot="${slotId}"` : ''}><div class="t">${E[a].n}</div><div class="d">${E[a].m.join(', ')} · ${PROP[E[a].prop]}</div></button>
        ${slotId ? `<button class="btn" style="min-height:44px;padding:0 14px" data-a="use-alt" data-slot="${slotId}" data-id="${a}">Usar</button>` : ''}</div>`;
    });
    h += `</div>`;
    const hist = history(id);
    if (hist.length) h += `<div class="sec-title">Tu evolución <a class="small link-btn" href="#/progreso/${id}">Ver todo</a></div><div class="card">${lineChart(hist.map(x => ({ x: x.d, y: ex.unit === 'seg' ? Math.max(...x.sets.map(s => +s.reps)) : Math.round(Math.max(...x.sets.map(e1rm)) * 10) / 10 })), ex.unit === 'seg' ? ' s' : ' kg')}</div>`;
    app.innerHTML = h;
  }
  function findSlot(slotId) {
    for (const rid in R) { const s = slotsFor(rid).find(x => x.id === slotId); if (s) return s; }
    return null;
  }

  /* ---------- entreno en vivo ---------- */
  const LV = { idx: 0, set: {} };
  let wakeLock = null;
  async function keepAwake(on) {
    try {
      if (on && 'wakeLock' in navigator && !wakeLock) { wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release', () => { wakeLock = null; }); }
      if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
    } catch (e) { /* no soportado */ }
  }

  function initSets(k, s) {
    const L = S.logs[k];
    const x = L.ex[s.id];
    if (x.sets.length) return;
    const sg = suggest(x.ex, s, k);
    const prev = history(x.ex, k).pop();
    for (let i = 0; i < s.sets; i++) {
      const pr = prev && prev.sets[i];
      const reps = E[x.ex].unit === 'seg' ? s.reps[0] : sg.up ? s.reps[0] : (pr ? +pr.reps : s.reps[1]);
      x.sets.push({ kg: sg.kg != null ? sg.kg : (pr ? +pr.kg : ''), reps, done: false });
    }
  }
  function curSetIdx(x, sid) {
    if (LV.set[sid] != null && LV.set[sid] < x.sets.length) return LV.set[sid];
    const i = x.sets.findIndex(s => !s.done);
    return i < 0 ? x.sets.length - 1 : i;
  }

  function viewEntreno() {
    const k = dk(now());
    const rid = routineOn(now());
    if (!rid) { location.hash = '#/hoy'; return; }
    const L = ensureLog(k, rid);
    if (!L.started) { L.started = Date.now(); save(); }
    const slots = logSlots(k);
    if (LV.idx >= slots.length) LV.idx = 0;
    const s = slots[LV.idx];
    initSets(k, s);
    save();
    const x = L.ex[s.id];
    const ex = E[x.ex];
    const si = curSetIdx(x, s.id);
    const cs = x.sets[si];
    const sg = suggest(x.ex, s, k);
    const prev = history(x.ex, k).pop();
    const seg = ex.unit === 'seg';
    const last = prev ? prev.sets.map(p => seg ? p.reps + ' s' : `${fmt(+p.kg)}×${p.reps}`).join(' · ') : null;

    let h = `<div class="live-head"><button class="icon-btn" data-a="live-exit" aria-label="Salir">${ic('close', 2.4)}</button>
      <div class="ttl"><b>${R[rid].n} · ${PLACES[locOn()]}</b><span class="num" id="elapsed">${mmss((Date.now() - L.started) / 1000)}</span></div>
      <button class="btn pri" style="min-height:44px;padding:0 16px" data-a="finish">Terminar</button></div>
      <div class="dots">${slots.map((o, i) => `<button class="${L.ex[o.id] && L.ex[o.id].done ? 'done' : ''} ${i === LV.idx ? 'cur' : ''}" data-a="go-ex" data-i="${i}" aria-label="Ejercicio ${i + 1}"></button>`).join('')}</div>
      <div class="ex-card fade-in">
        <div class="top">${ex.img ? `<div class="mini">${media(x.ex)}</div>` : `<div class="mini" data-anim="${ex.pose}" data-prop="${ex.prop}">${fig(x.ex, 0)}</div>`}
        <div class="grow"><div class="small muted">Ejercicio ${LV.idx + 1} de ${slots.length}${s.b ? ' · básico' : ''}</div>
        <h2>${ex.n}</h2>
        <div class="chips"><span class="chip">${s.sets} × ${s.reps[0]}-${s.reps[1]} ${seg ? 's' : 'reps'}</span><span class="chip">Descanso ${mmss(ex.r)}</span><span class="chip">Tempo ${ex.t}</span></div></div></div>
        <div class="row" style="margin-top:10px;gap:8px"><button class="btn ghost" style="min-height:44px;flex:1" data-a="open-ex" data-id="${x.ex}" data-slot="${s.id}">${ic('info')} Ficha</button>
        <button class="btn ghost" style="min-height:44px;flex:1" data-a="swap" data-slot="${s.id}">${ic('swap')} Cambiar</button></div>
        <div class="tip">${esc(sg.text)}</div>
        ${last ? `<div class="last">La vez pasada (${shortDate(prev.d)}): ${last}</div>` : ''}
        <div class="sets">${x.sets.map((o, i) => `<button class="set-row ${o.done ? 'done' : ''} ${i === si ? 'cur' : ''}" data-a="set-sel" data-slot="${s.id}" data-i="${i}">
          <span class="n">${i + 1}</span><span class="v num">${seg ? '' : `${o.kg === '' ? '—' : fmt(+o.kg)} <small>kg</small> × `}${o.reps || '—'} <small>${seg ? 's' : 'reps'}</small></span>${o.done ? '<span class="ok">Hecha</span>' : ''}</button>`).join('')}</div>
        <div class="panel" style="${seg ? 'grid-template-columns:1fr' : ''}">
          ${seg ? '' : `<div class="stepper"><div class="l">${ex.bw ? 'kg extra' : 'kg'}</div><input id="kgIn" class="num" type="number" inputmode="decimal" step="0.5" value="${cs.kg}" data-slot="${s.id}" data-i="${si}" data-f="kg" placeholder="0">
            <div class="b"><button data-a="step" data-f="kg" data-v="-${ex.inc}" aria-label="Menos peso">−</button><button data-a="step" data-f="kg" data-v="${ex.inc}" aria-label="Más peso">+</button></div></div>`}
          <div class="stepper"><div class="l">${seg ? 'segundos' : 'reps'}</div><input id="repsIn" class="num" type="number" inputmode="numeric" step="1" value="${cs.reps}" data-slot="${s.id}" data-i="${si}" data-f="reps" placeholder="0">
            <div class="b"><button data-a="step" data-f="reps" data-v="${seg ? -5 : -1}" aria-label="Menos">−</button><button data-a="step" data-f="reps" data-v="${seg ? 5 : 1}" aria-label="Más">+</button></div></div>
        </div>
        <button class="btn pri block big" style="margin-top:12px" data-a="set-done" data-slot="${s.id}" data-i="${si}">${ic('check', 2.6)} ${cs.done ? 'Actualizar serie' : `Serie ${si + 1} hecha`}</button>
        <div class="set-actions"><button class="link-btn" data-a="set-add" data-slot="${s.id}">+ Agregar serie</button>${x.sets.length > 1 ? `<button class="link-btn" style="color:var(--muted)" data-a="set-del" data-slot="${s.id}">Quitar la última</button>` : ''}</div>
      </div>
      <div class="bottom-bar"><div class="in">
        <button class="btn big" data-a="prev" ${LV.idx === 0 ? 'disabled style="opacity:.4"' : ''}>${ic('back', 2.4)} Anterior</button>
        ${LV.idx < slots.length - 1 ? `<button class="btn big ${x.done ? 'pri' : ''}" data-a="next">Siguiente ${ic('right', 2.4)}</button>` : `<button class="btn big pri" data-a="finish">${ic('flag')} Terminar</button>`}
      </div></div>`;
    app.innerHTML = h;
    keepAwake(true);
  }

  function viewResumen(k) {
    k = k || dk(now());
    const L = S.logs[k];
    if (!L) { location.hash = '#/hoy'; return; }
    let sets = 0, vol = 0;
    const prs = [];
    Object.values(L.ex).forEach(x => {
      const done = x.sets.filter(s => s.done && +s.reps > 0);
      sets += done.length;
      done.forEach(s => { if (E[x.ex].unit !== 'seg') vol += (+s.kg || 0) * +s.reps; });
      if (!done.length || E[x.ex].unit === 'seg') return;
      const best = Math.max(...done.map(e1rm));
      const before = history(x.ex, k);
      const prevBest = before.length ? Math.max(...before.map(hh => Math.max(...hh.sets.map(e1rm)))) : 0;
      if (before.length && best > prevBest) prs.push(`${E[x.ex].n}: ${fmt(Math.round(best * 10) / 10)} kg (1RM est.)`);
    });
    const mins = L.finished ? Math.round((L.finished - L.started) / 60000) : null;
    let h = `<div class="page-head">${backBtn}<div class="ttl">Resumen</div></div>
      <section class="hero fade-in"><div class="k">${shortDate(k)}</div><h2>${R[L.routine].n} listo</h2><p>Buen trabajo. Ahora a comer y a descansar.</p></section>
      <div class="stat-grid">
        <div class="stat"><div class="l">Duración</div><div class="v num">${mins != null ? mins + ' min' : '—'}</div></div>
        <div class="stat"><div class="l">Series</div><div class="v num">${sets}</div></div>
        <div class="stat" style="grid-column:1/-1"><div class="l">Volumen total</div><div class="v num">${Math.round(vol).toLocaleString('es-CO')} kg</div><div class="h">kilos × repeticiones</div></div>
      </div>
      <div class="sec-title">Récords</div><div class="card">${prs.length ? prs.map(p => `<div class="list-item"><span class="chip acc">Récord</span><div class="t grow">${esc(p)}</div></div>`).join('') : '<div class="empty small">Sin récords esta vez. Lo importante es la constancia.</div>'}</div>
      <a class="btn pri block big" href="#/hoy">Listo</a>`;
    app.innerHTML = h;
  }

  function viewNoticias() {
    const N = (PLAN && PLAN.news) || [];
    let h = `<div class="page-head">${backBtn}<div class="ttl">Ciencia y noticias</div></div>
      <p class="small muted" style="margin:4px 2px 14px">Resúmenes de estudios con revisión por pares. Cada lunes llegan nuevos. Toca "Ver estudio" para leer la fuente.</p>`;
    if (!N.length) h += '<div class="card empty">Las noticias llegan con la actualización del lunes.</div>';
    N.forEach(n => {
      h += `<article class="card"><div class="chips" style="margin-bottom:8px"><span class="chip acc">${esc(n.tema)}</span><span class="chip">${esc(n.tipo)}</span></div>
        <h2 style="font-size:19px;line-height:1.25">${esc(n.titulo)}</h2><p style="margin:0 0 10px">${esc(n.resumen)}</p>
        <div class="tip"><b>En la práctica:</b> ${esc(n.aplica)}</div>
        <div class="row" style="margin-top:10px"><div class="grow small muted">${esc(n.cita)}</div><a class="btn ghost" style="min-height:44px;padding:0 14px" href="${esc(n.url)}" target="_blank" rel="noopener">Ver estudio</a></div></article>`;
    });
    app.innerHTML = h;
  }

  /* ---------- recordatorios ---------- */
  const DAYCODE = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
  function reminders() {
    const T = S.settings.remT || {}, off = S.settings.remOff || {};
    const L = [];
    (PLAN ? PLAN.slots : []).forEach(sl => L.push({ id: sl.id, label: sl.label, times: [T[sl.id] || sl.time], days: null, text: `Toca ${sl.label.toLowerCase()}. Mira qué hay en Plan Fitness.` }));
    L.push({ id: 'entreno', label: 'Entreno', times: [T.entreno || '18:30'], days: S.schedule.map((r, i) => r ? i : -1).filter(i => i >= 0), text: 'En 30 minutos arranca el entreno. Si no has comido el pre-entreno, es ahora.' });
    L.push({ id: 'agua', label: 'Agua', times: ['09:00', '11:00', '13:00', '15:00', '17:00'], days: null, text: 'Tómate 2 vasos de agua.' });
    L.push({ id: 'pesaje', label: 'Pesaje', times: [T.pesaje || '06:15'], days: [+S.settings.weighDay], text: 'Pésate en ayunas y anótalo en la app.' });
    return L.map(r => Object.assign(r, { on: !off[r.id] }));
  }
  function firstDate(days) {
    let d = addDays(now(), 1);
    if (days) while (!days.includes(wIdx(d))) d = addDays(d, 1);
    return d;
  }
  const icsDate = (d, t) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${t.replace(':', '')}00`;
  const rrule = r => r.days ? `FREQ=WEEKLY;BYDAY=${r.days.map(i => DAYCODE[i]).join(',')}` : 'FREQ=DAILY';
  const plus15 = t => { const [h, m] = t.split(':').map(Number); const x = h * 60 + m + 15; return `${pad(Math.floor(x / 60) % 24)}:${pad(x % 60)}`; };
  function buildIcs() {
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    const out = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Plan Fitness//ES', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
      'BEGIN:VTIMEZONE', 'TZID:America/Bogota', 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:-0500', 'TZOFFSETTO:-0500', 'TZNAME:-05', 'END:STANDARD', 'END:VTIMEZONE'];
    reminders().filter(r => r.on).forEach(r => r.times.forEach((t, j) => {
      const d = firstDate(r.days);
      out.push('BEGIN:VEVENT', `UID:pf-${r.id}-${j}@plan-fitness`, `DTSTAMP:${stamp}`, `DTSTART;TZID=America/Bogota:${icsDate(d, t)}`, 'DURATION:PT15M',
        `RRULE:${rrule(r)}`, `SUMMARY:${r.label} · Plan Fitness`, `DESCRIPTION:${r.text}`, 'TRANSP:TRANSPARENT',
        'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${r.label}`, 'TRIGGER:PT0M', 'END:VALARM', 'END:VEVENT');
    }));
    out.push('END:VCALENDAR');
    return out.join('\r\n');
  }
  function gcalLink(r, t) {
    const d = firstDate(r.days);
    const p = new URLSearchParams({ action: 'TEMPLATE', text: r.label + ' · Plan Fitness', details: r.text, dates: icsDate(d, t) + '/' + icsDate(d, plus15(t)), ctz: 'America/Bogota', recur: 'RRULE:' + rrule(r) });
    return 'https://calendar.google.com/calendar/render?' + p.toString();
  }

  /* ---------- ajustes ---------- */
  function viewAjustes() {
    const st = S.settings;
    const opts = (v) => `<option value="">Descanso</option>` + Object.keys(R).map(r => `<option value="${r}" ${v === r ? 'selected' : ''}>${R[r].n}</option>`).join('');
    let h = `<div class="page-head">${backBtn}<div class="ttl">Ajustes</div></div>
      <div class="card"><h2>Apariencia</h2><div class="seg">${[['auto', 'Auto'], ['light', 'Claro'], ['dark', 'Oscuro']].map(([v, l]) => `<button class="${st.theme === v ? 'on' : ''}" data-a="theme" data-v="${v}">${l}</button>`).join('')}</div></div>
      <div class="card"><h2>Tus datos</h2>
        <label class="lbl" for="sName">Nombre (para el saludo)</label><input class="field" id="sName" data-set="name" value="${esc(st.name)}" autocomplete="off">
        <label class="lbl" for="sBud">Presupuesto de mercado para 15 días (COP)</label><input class="field num" id="sBud" data-set="budget" type="number" inputmode="numeric" value="${st.budget || ''}" placeholder="Ej: 250000">
        <label class="lbl" for="sWat">Meta de agua (vasos de 250 ml)</label><input class="field num" id="sWat" data-set="waterGoal" type="number" inputmode="numeric" value="${st.waterGoal}">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><label><span class="lbl" style="margin-top:14px">Edad</span><input class="field num" data-prof="age" type="number" inputmode="numeric" value="${S.profile.age}"></label><label><span class="lbl" style="margin-top:14px">Estatura (cm)</span><input class="field num" data-prof="height" type="number" inputmode="numeric" value="${S.profile.height}"></label></div>
        <label class="lbl">Sexo (para las fórmulas)</label><div class="seg" style="grid-template-columns:1fr 1fr">${[['h', 'Hombre'], ['m', 'Mujer']].map(([v, l]) => `<button class="${S.profile.sex === v ? 'on' : ''}" data-a="prof-sex" data-v="${v}">${l}</button>`).join('')}</div>
        <label class="lbl" for="sAct">Nivel de actividad</label><select class="field" id="sAct" data-prof="act">${[[1.375, 'Ligero: entreno 1-3 días'], [1.55, 'Moderado: entreno 4-5 días, trabajo sentado'], [1.725, 'Alto: entreno diario o trabajo de pie'], [1.9, 'Muy alto: trabajo físico + entreno']].map(([v, l]) => `<option value="${v}" ${+S.profile.act === v ? 'selected' : ''}>${l}</option>`).join('')}</select>
        <label class="lbl" for="sWd">Día de pesaje</label><select class="field" id="sWd" data-set="weighDay">${DAYS_L.map((d, i) => `<option value="${i}" ${+st.weighDay === i ? 'selected' : ''}>${d}</option>`).join('')}</select></div>
      <div class="card"><h2>Entreno</h2>
        <label class="lbl">Dónde entrenas normalmente</label><div class="seg">${Object.entries(PLACES).map(([v, l]) => `<button class="${(st.defLoc || 'gym') === v ? 'on' : ''}" data-a="loc-def" data-v="${v}">${l}</button>`).join('')}</div>
        <p class="small muted" style="margin:6px 0 0">Cada día lo puedes cambiar en Hoy o en Semana.</p>
        <label class="lbl">Rotar accesorios cada</label><div class="seg">${[4, 5, 6].map(n => `<button class="${+st.rotWeeks === n ? 'on' : ''}" data-a="rot" data-v="${n}">${n} semanas</button>`).join('')}</div>
        <label class="lbl" for="sStart">Inicio del programa</label><input class="field" id="sStart" type="date" data-set="start" value="${S.start}">
        <label class="lbl">Semana tipo</label>${DAYS.map((d, i) => `<div class="sched-row"><b>${d}</b><select class="field" data-sched="${i}">${opts(S.schedule[i])}</select></div>`).join('')}</div>
      <div class="card"><h2>Recordatorios</h2>
        <p class="small muted" style="margin-top:0">El navegador no puede avisarte con la app cerrada, así que los recordatorios van a tu calendario, que sí suena.</p>
        ${reminders().map(r => `<div class="list-item" style="flex-wrap:wrap">
          <label class="row grow" style="gap:10px;min-height:44px"><input type="checkbox" data-rem-on="${r.id}" ${r.on ? 'checked' : ''} style="width:22px;height:22px;accent-color:var(--accent-text)"><span><b>${r.label}</b><br><span class="small muted">${r.days ? r.days.map(i => DAYS[i]).join(', ') : 'todos los días'}</span></span></label>
          ${r.id === 'agua' ? '<span class="small muted">9, 11, 1, 3 y 5</span>' : `<input class="field num" type="time" data-rem-t="${r.id}" value="${r.times[0]}" style="width:140px;min-height:44px;font-size:16px;padding:0 8px">`}
          ${r.on ? `<div style="width:100%;display:flex;gap:6px;flex-wrap:wrap;padding-left:32px">${r.times.map(t => `<a class="chip line" style="text-decoration:none" href="${gcalLink(r, t)}" target="_blank" rel="noopener">+ Google Calendar${r.times.length > 1 ? ' ' + t : ''}</a>`).join('')}</div>` : ''}</div>`).join('')}
        <button class="btn pri block" style="margin-top:12px" data-a="ics">${ic('dl')} Descargar todos (.ics)</button>
        <details class="eq" style="margin-top:8px"><summary>¿Cómo los activo?</summary><ul>
          <li><b>Google Calendar:</b> toca "+ Google Calendar" en cada uno y dale Guardar. Se repite solo.</li>
          <li><b>Samsung u otro calendario:</b> descarga el .ics y ábrelo; importa todos de una vez.</li>
          <li>También puedes importar el .ics en calendar.google.com desde un computador (Configuración → Importar).</li>
          <li>Si cambias horarios, vuelve a agregarlos y borra los viejos del calendario.</li></ul></details></div>
      <div class="card"><h2>Plan semanal</h2><p class="small muted" style="margin-top:0">Plan del ${PLAN ? shortDate(PLAN.generated) : '—'}. Cada lunes llega uno nuevo con menú, recetas, precios y noticias.</p>
        <button class="btn block" data-a="plan-refresh">${ic('refresh')} Buscar actualización</button></div>
      <div class="card"><h2>Respaldo</h2><p class="small muted" style="margin-top:0">Tus registros viven en este celular. Descarga un respaldo de vez en cuando.</p>
        <div class="row"><button class="btn grow" data-a="export">${ic('dl')} Descargar</button><button class="btn grow" data-a="import">${ic('ul')} Restaurar</button></div>
        <input type="file" id="impFile" accept="application/json,.json" class="hidden"></div>
      <button class="btn ghost block danger" data-a="wipe">Borrar todos mis datos</button>
      <p class="small muted" style="text-align:center;margin:18px 0 0">Plan Fitness · v1</p>`;
    app.innerHTML = h;
  }

  /* ---------- tema ---------- */
  function applyTheme() {
    const t = S.settings.theme;
    if (t === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.dataset.theme = t;
    const dark = t === 'dark' || (t === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.querySelector('meta[name=theme-color]').content = dark ? '#0d0f0d' : '#f3f4ef';
  }
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

  /* ---------- router ---------- */
  function render(keepScroll) {
    const raw = location.hash.replace(/^#\/?/, '') || 'hoy';
    const [name, ...args] = raw.split('/').map(decodeURIComponent);
    const full = ['entreno', 'ej', 'ajustes', 'resumen', 'noticias', 'cuerpo', 'fotos'].includes(name);
    app.className = 'app' + (full ? ' full' : '');
    nav.classList.toggle('hidden', full);
    if (name !== 'entreno') keepAwake(false);
    const views = { hoy: viewHoy, semana: viewSemana, progreso: viewProgreso, comida: viewComida, mercado: viewMercado, entreno: viewEntreno, ej: viewEj, ajustes: viewAjustes, resumen: viewResumen, noticias: viewNoticias, cuerpo: viewCuerpo, fotos: viewFotos };
    (views[name] || viewHoy)(...args);
    nav.querySelectorAll('a').forEach(a => a.classList.toggle('on', a.dataset.r === name));
    if (raw !== lastRoute && !keepScroll) window.scrollTo(0, 0);
    lastRoute = raw;
    animateFigures(app);
  }
  const rerender = () => render(true);

  /* ---------- temporizador de descanso ---------- */
  const RT = { end: 0, total: 0, timer: null, audio: null, doneAt: 0 };
  function beep() {
    try {
      const ctx = RT.audio;
      if (!ctx) return;
      [0, 0.25, 0.5].forEach((t, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.frequency.value = i === 2 ? 1175 : 880;
        g.gain.setValueAtTime(0.0001, ctx.currentTime + t);
        g.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.2);
        o.connect(g); g.connect(ctx.destination);
        o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.22);
      });
    } catch (e) { /* sin audio */ }
  }
  function startRest(sec, nextLabel) {
    try { RT.audio = RT.audio || new (window.AudioContext || window.webkitAudioContext)(); RT.audio.resume(); } catch (e) { RT.audio = null; }
    RT.total = sec; RT.end = Date.now() + sec * 1000; RT.doneAt = 0;
    const t = $('#timer');
    t.classList.remove('done');
    $('#tNext').textContent = nextLabel;
    t.classList.add('in');
    tick();
  }
  function stopRest() { RT.end = 0; $('#timer').classList.remove('in', 'done'); }
  function tick() {
    const el = $('#elapsed');
    if (el) { const L = S.logs[dk(now())]; if (L && L.started) el.textContent = mmss((Date.now() - L.started) / 1000); }
    if (!RT.end) return;
    const left = (RT.end - Date.now()) / 1000;
    const C = 2 * Math.PI * 46;
    $('#tRing').style.strokeDasharray = C;
    $('#tRing').style.strokeDashoffset = C * (1 - Math.max(0, left) / RT.total);
    if (left > 0) { $('#tTime').textContent = mmss(left); return; }
    if (!RT.doneAt) {
      RT.doneAt = Date.now();
      $('#tTime').textContent = '¡Dale!';
      $('#timer').classList.add('done');
      if (navigator.vibrate) navigator.vibrate([250, 120, 250, 120, 400]);
      beep();
    } else if (Date.now() - RT.doneAt > 5000) stopRest();
  }
  setInterval(tick, 250);

  /* ---------- acciones ---------- */
  function liveCtx(slotId) {
    const k = dk(now());
    const L = S.logs[k];
    return { k, L, x: L && L.ex[slotId] };
  }
  function readInputs() {
    ['kgIn', 'repsIn'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const { x } = liveCtx(el.dataset.slot);
      if (x && x.sets[+el.dataset.i]) x.sets[+el.dataset.i][el.dataset.f] = el.value === '' ? '' : +el.value;
    });
  }

  // Cambia el lugar de un día y rehace los ejercicios que aún no tienen series hechas
  function setLoc(k, v) {
    S.locs[k] = v;
    const L = S.logs[k];
    if (L) {
      Object.keys(L.ex).forEach(id => { if (!L.ex[id].sets.some(x => x.done)) delete L.ex[id]; });
      ensureLog(k, L.routine);
    }
    LV.set = {};
    save();
  }

  function eatPush(k, sl, item) {
    const day = S.eaten[k] = S.eaten[k] || {};
    const arr = day[sl] = day[sl] || [];
    const same = arr.find(x => x.n === item.n && x.u === item.u);
    if (same) same.q += 1; else arr.push(item);
    save(); refreshEat(k, sl);
  }
  function refreshEat(k, sl) { const el = $('#eatList'); if (el) el.innerHTML = eatListHtml(k, sl); rerender(); }

  const A = {
    back() { if (navCount > 0) window.history.back(); else location.hash = '#/hoy'; },
    'sheet-close'() { closeSheet(); },
    start() {
      const k = dk(now());
      const L = ensureLog(k, routineOn(now()));
      if (!L.started) L.started = Date.now();
      save();
      LV.idx = Math.max(0, logSlots(k).findIndex(s => !L.ex[s.id].done));
      LV.set = {};
      location.hash = '#/entreno';
    },
    'ex-check'(b) {
      const k = dk(now());
      const L = ensureLog(k, routineOn(now()));
      const x = L.ex[b.dataset.slot];
      x.done = !x.done;
      const slots = logSlots(k);
      L.done = slots.every(s => L.ex[s.id].done);
      if (L.done && !L.finished) L.finished = Date.now();
      save(); rerender();
    },
    'meal-check'(b) {
      const m = S.meals[b.dataset.k] = S.meals[b.dataset.k] || {};
      m[b.dataset.slot] = !m[b.dataset.slot];
      save(); rerender();
    },
    water(b) {
      const k = dk(now());
      S.water[k] = Math.max(0, (S.water[k] || 0) + +b.dataset.v);
      save(); rerender();
    },
    'weigh-save'() {
      const v = parseFloat(($('#wIn').value || '').replace(',', '.'));
      if (!(v > 30 && v < 250)) return toast('Escribe un peso válido en kg');
      const k = dk(now());
      S.body = S.body.filter(x => x.d !== k).concat({ d: k, kg: Math.round(v * 10) / 10 });
      save(); toast('Peso guardado'); rerender();
    },
    'ph-add'(b) { A._pose = b.dataset.pose; const i = $('#phIn'); i.value = ''; i.click(); },
    async 'ph-del'(b) {
      if (!confirm('¿Borrar esta foto? No se puede recuperar.')) return;
      try { await IDB.del(b.dataset.id); toast('Foto borrada'); } catch (e) { toast('No se pudo borrar'); }
      renderFotos();
    },
    'ph-pose'(b) { cmp.pose = b.dataset.v; renderFotos(); },
    'vol-week'(b) { volWeekOffset = +b.dataset.v; rerender(); },
    'measure-save'() {
      const m = { d: dk(now()) };
      ['waist', 'neck', 'hip', 'chest', 'arm', 'thigh'].forEach(k => { const v = parseFloat(($('#m_' + k).value || '').replace(',', '.')); if (v > 0) m[k] = v; });
      const sf = {};
      'abc'.split('').forEach(k => { const el = $('#sf_' + k); const v = el && parseFloat((el.value || '').replace(',', '.')); if (v > 0) sf[k] = v; });
      if (Object.keys(sf).length) m.sf = sf;
      if (Object.keys(m).length < 2) return toast('Anota al menos una medida');
      if (m.waist && m.neck && m.waist <= m.neck) return toast('La cintura debe ser mayor que el cuello');
      S.measures = S.measures.filter(x => x.d !== m.d).concat(m);
      save(); toast('Medidas guardadas'); rerender();
    },
    'prof-sex'(b) { S.profile.sex = b.dataset.v; save(); rerender(); },
    'adj-apply'(b) {
      const t = weightTrend();
      S.adjLog.push({ d: dk(now()), delta: +b.dataset.v, rate: t.rate || 0 });
      S.adjSkip = null;
      save(); toast(`Meta ajustada: ${targets().k} kcal`); rerender();
    },
    'adj-skip'() { S.adjSkip = (S.body.slice().sort((a, b) => a.d < b.d ? -1 : 1).pop() || {}).d || null; save(); rerender(); },
    'adj-reset'() { if (!confirm('¿Volver a la meta del plan (' + PLAN.targets.k + ' kcal)?')) return; S.adjLog = []; S.adjSkip = null; save(); rerender(); },
    'rest-pick'() {
      const d0 = monday(now());
      const plan = weekPlan();
      const ti = wIdx(now());
      const items = plan.map((r, i) => ({ r, i })).filter(o => o.r && o.i !== ti && !(S.logs[dk(addDays(d0, o.i))] || {}).done);
      openSheet(`<h3>¿Cuál quieres hacer hoy?</h3><p class="small muted" style="margin:0 0 6px">Se intercambia con el descanso de hoy.</p>
        ${items.length ? items.map(o => `<button class="opt" data-a="move-to" data-from="${o.i}" data-to="${ti}"><div class="grow"><div class="t">${R[o.r].n}</div><div class="d">Estaba para el ${DAYS_L[o.i]}</div></div>${ic('right')}</button>`).join('') : '<div class="empty">Ya hiciste todo lo de esta semana. A descansar.</div>'}`);
    },
    move(b) {
      const i = +b.dataset.i;
      const plan = weekPlan();
      openSheet(`<h3>Mover ${R[plan[i]].n}</h3><p class="small muted" style="margin:0 0 6px">Elige el día. Si ya tiene rutina, se intercambian.</p>
        ${plan.map((r, j) => j === i ? '' : `<button class="opt" data-a="move-to" data-from="${i}" data-to="${j}"><div class="grow"><div class="t">${DAYS_L[j][0].toUpperCase() + DAYS_L[j].slice(1)} ${addDays(monday(now()), j).getDate()}</div><div class="d">${r ? R[r].n + ' (se intercambian)' : 'Descanso'}</div></div>${ic('right')}</button>`).join('')}`);
    },
    'move-to'(b) {
      const plan = weekPlan();
      const f = +b.dataset.from, t = +b.dataset.to;
      [plan[f], plan[t]] = [plan[t], plan[f]];
      setWeekPlan(now(), plan);
      closeSheet(); toast('Listo, rutina movida'); rerender();
    },
    'loc-set'(b) { setLoc(dk(now()), b.dataset.v); toast(`Hoy entrenas en: ${PLACES[b.dataset.v].toLowerCase()}`); rerender(); },
    'loc-cycle'(b) {
      const order = Object.keys(PLACES), k = b.dataset.k;
      const next = order[(order.indexOf(locOn(parse(k))) + 1) % order.length];
      setLoc(k, next); rerender();
    },
    'loc-def'(b) { S.settings.defLoc = b.dataset.v; save(); rerender(); toast('Guardado'); },
    'week-reset'() { delete S.weekMoves[dk(monday(now()))]; save(); rerender(); },
    'open-ex'(b) { location.hash = `#/ej/${b.dataset.id}${b.dataset.slot ? '/' + b.dataset.slot : ''}`; },
    'use-alt'(b) {
      const slotId = b.dataset.slot, id = b.dataset.id;
      S.swaps[swapKey(slotId)] = { ex: id, block: blockInfo().block };
      const { L } = liveCtx(slotId);
      if (L && L.ex[slotId] && !L.ex[slotId].sets.some(s => s.done)) { L.ex[slotId].ex = id; L.ex[slotId].sets = []; }
      save(); toast(`Cambiado por ${E[id].n}`);
      A.back();
    },
    'pick-ex'(b) { location.hash = '#/progreso/' + b.dataset.id; },
    day(b) { comidaDay = +b.dataset.i; rerender(); },
    'meal-swap'(b) {
      const k = b.dataset.k, sl = b.dataset.slot;
      const d = parse(k);
      const cur = dayMeals(d).find(x => x.slot.id === sl).id;
      const cm = PLAN.meals[cur].m;
      const d0 = monday(d);
      const count = {};
      for (let i = 0; i < 7; i++) { const dd = addDays(d0, i); if (dk(dd) === k) continue; dayMeals(dd).forEach(x => { count[x.id] = (count[x.id] || 0) + 1; }); }
      const opts = Object.keys(PLAN.meals).filter(id => PLAN.meals[id].slot === sl);
      openSheet(`<h3>Cambiar ${esc(PLAN.slots.find(s => s.id === sl).label.toLowerCase())}</h3><p class="small muted" style="margin:0 0 6px">Máximo 2 veces la misma comida por semana.</p>
        ${opts.map(id => {
          const m = PLAN.meals[id], full = (count[id] || 0) >= 2 && id !== cur;
          const dk2 = m.m.k - cm.k, dp = m.m.p - cm.p;
          return `<button class="opt ${id === cur ? 'on' : ''}" data-a="meal-to" data-k="${k}" data-slot="${sl}" data-id="${id}" ${full ? 'disabled style="opacity:.45"' : ''}>
            <div class="grow"><div class="t">${esc(m.n)}</div><div class="d num">${m.m.k} kcal · ${m.m.p} g P${id !== cur ? ` · ${dk2 >= 0 ? '+' : ''}${dk2} kcal, ${dp >= 0 ? '+' : ''}${dp} g P` : ' · actual'}${full ? ' · ya va 2 veces' : ''}</div></div></button>`;
        }).join('')}`);
    },
    'meal-to'(b) {
      const k = b.dataset.k;
      const base = PLAN.menu[wIdx(parse(k))][b.dataset.slot];
      const sw = S.mealSwaps[k] = S.mealSwaps[k] || {};
      if (b.dataset.id === base) delete sw[b.dataset.slot]; else sw[b.dataset.slot] = b.dataset.id;
      save(); closeSheet(); rerender();
    },
    'mk-check'(b) {
      const u = PLAN.market.updated;
      const m = S.market[u] = S.market[u] || {};
      m[b.dataset.id] = !m[b.dataset.id];
      S.market = { [u]: m };
      save(); rerender();
    },
    recipe(b) {
      const r = PLAN.recipes.find(x => x.id === b.dataset.id);
      const m = r.meal && PLAN.meals[r.meal];
      openSheet(`<h3>${esc(r.n)}</h3><div class="chips" style="margin:6px 0 10px"><span class="chip acc">${r.min} min</span>${r.rinde ? `<span class="chip">${esc(r.rinde)}</span>` : ''}${r.lleva ? '<span class="chip">Para llevar</span>' : ''}</div>
        ${m ? `<div class="small num muted" style="margin-bottom:10px">Por porción: ${m.m.k} kcal · ${m.m.p} g P · ${m.m.c} g C · ${m.m.f} g G</div>` : ''}
        <div class="card" style="box-shadow:none;background:var(--surface-2)"><h2>Ingredientes</h2><ul style="margin:0;padding-left:18px">${r.ing.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>
        <h2 style="font-size:18px;margin:4px 0 8px">Preparación</h2><ol class="cues">${r.pasos.map(p => `<li>${esc(p)}</li>`).join('')}</ol>
        ${r.tip ? `<div class="tip">${esc(r.tip)}</div>` : ''}`);
    },
    'mk-info'(b) {
      const i = PLAN.market.items.find(x => x.id === b.dataset.id);
      const mine = S.myPrices[i.id];
      openSheet(`<h3>${esc(i.n)}</h3><p class="small muted" style="margin:0 0 10px">Necesitas ${esc(i.q)} para ${PLAN.market.days} días</p>
        ${i.price > 0 ? `<div class="stat-grid"><div class="stat"><div class="l">Costo estimado</div><div class="v num">${cop(i.price)}</div></div><div class="stat"><div class="l">Dónde</div><div class="v" style="font-size:17px">${esc(i.store)}</div><div class="h">${i.date ? 'precio del ' + shortDate(i.date) : ''}</div></div></div>
        ${i.prod ? `<p class="small" style="margin:12px 0 0">Producto de referencia: <b>${esc(i.prod)}</b></p>` : ''}
        ${i.nota ? `<p class="small muted" style="margin:6px 0 0">${esc(i.nota)}</p>` : ''}
        ${i.src ? `<a class="btn block" style="margin-top:12px" href="${esc(i.src)}" target="_blank" rel="noopener">Ver la fuente del precio</a>` : ''}`
        : '<div class="empty">No encontramos un precio confiable esta semana.</div>'}
        <div class="card" style="box-shadow:none;background:var(--surface-2);margin-top:14px"><h2>¿Lo conseguiste más barato?</h2>
        <p class="small muted" style="margin:-4px 0 10px">Anota lo que pagaste por ${esc(i.q)} (plaza, mercado de barrio, tienda). El total usa tu precio.</p>
        <div class="weigh"><input class="field num" id="myPrice" type="number" inputmode="numeric" placeholder="$" value="${mine ? mine.price : ''}"><button class="btn pri" data-a="my-price" data-id="${i.id}">Guardar</button></div>
        ${mine ? `<button class="link-btn" style="margin-top:8px" data-a="my-price-del" data-id="${i.id}">Quitar mi precio (${cop(mine.price)} del ${shortDate(mine.date)})</button>` : ''}</div>`);
    },
    'my-price'(b) {
      const v = parseInt(($('#myPrice').value || '').replace(/D/g, ''), 10);
      if (!(v > 0)) return toast('Escribe el precio en pesos');
      S.myPrices[b.dataset.id] = { price: v, date: dk(now()) };
      save(); closeSheet(); toast('Precio guardado'); rerender();
    },
    'my-price-del'(b) {
      delete S.myPrices[b.dataset.id];
      save(); closeSheet(); rerender();
    },
    'eat-open'(b) {
      const k = b.dataset.k, sl = b.dataset.slot;
      const label = sl === 'extra' ? 'Extras y antojos' : PLAN.slots.find(x => x.id === sl).label;
      const F = window.PF_FOODS;
      openSheet(`<h3>¿Qué comiste? · ${esc(label)}</h3><p class="small muted" style="margin:0 0 10px">${sl === 'extra' ? 'Suma a las calorías del día.' : 'Si lo anotas, reemplaza la comida del plan en el conteo del día.'}</p>
        <div id="eatList">${eatListHtml(k, sl)}</div>
        <input class="field" id="eatSearch" placeholder="Buscar: arroz, arepa, pollo…" autocomplete="off" style="margin-top:8px">
        <div id="eatFoods">${F.map((f, i) => `<button class="opt" style="min-height:52px;padding:10px 14px" data-a="eat-add" data-k="${k}" data-slot="${sl}" data-i="${i}" data-name="${esc(f[0].toLowerCase())}"><div class="grow"><div class="t">${esc(f[0])}</div><div class="d num">${esc(f[1])} · ${f[2]} kcal · ${f[3]} g P</div></div>${ic('plus')}</button>`).join('')}</div>
        <details class="eq" style="margin-top:12px"><summary>Otro alimento (escribirlo)</summary>
          <input class="field" id="cN" placeholder="Qué comiste" style="margin:6px 0">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><input class="field num" id="cK" type="number" inputmode="numeric" placeholder="kcal"><input class="field num" id="cP" type="number" inputmode="numeric" placeholder="Proteína g"><input class="field num" id="cC" type="number" inputmode="numeric" placeholder="Carbos g"><input class="field num" id="cF" type="number" inputmode="numeric" placeholder="Grasa g"></div>
          <button class="btn block" style="margin-top:8px" data-a="eat-custom" data-k="${k}" data-slot="${sl}">Agregar</button></details>
        <button class="btn pri block big" style="margin-top:14px" data-a="sheet-close">Listo</button>`);
    },
    'eat-add'(b) {
      const f = window.PF_FOODS[+b.dataset.i];
      eatPush(b.dataset.k, b.dataset.slot, { n: f[0], u: f[1], k: f[2], p: f[3], c: f[4], f: f[5], q: 1 });
      toast(f[0] + ' agregado');
    },
    'eat-custom'(b) {
      const n = ($('#cN').value || '').trim(), kc = +$('#cK').value;
      if (!n || !(kc > 0)) return toast('Escribe qué fue y cuántas kcal');
      eatPush(b.dataset.k, b.dataset.slot, { n, u: 'a mano', k: kc, p: +$('#cP').value || 0, c: +$('#cC').value || 0, f: +$('#cF').value || 0, q: 1 });
      ['cN', 'cK', 'cP', 'cC', 'cF'].forEach(id => { $('#' + id).value = ''; });
    },
    'eat-q'(b) {
      const arr = ((S.eaten[b.dataset.k] || {})[b.dataset.slot]) || [];
      const x = arr[+b.dataset.i];
      if (!x) return;
      x.q = Math.round((x.q + 0.5 * +b.dataset.v) * 10) / 10;
      if (x.q <= 0) arr.splice(+b.dataset.i, 1);
      save(); refreshEat(b.dataset.k, b.dataset.slot);
    },
    'mk-reset'() { S.market = {}; save(); rerender(); },

    // entreno en vivo
    'live-exit'() { readInputs(); save(); location.hash = '#/hoy'; },
    'go-ex'(b) { readInputs(); LV.idx = +b.dataset.i; save(); rerender(); },
    prev() { readInputs(); LV.idx = Math.max(0, LV.idx - 1); save(); rerender(); },
    next() { readInputs(); LV.idx++; save(); rerender(); },
    'set-sel'(b) { readInputs(); LV.set[b.dataset.slot] = +b.dataset.i; save(); rerender(); },
    step(b) {
      const el = document.getElementById(b.dataset.f === 'kg' ? 'kgIn' : 'repsIn');
      const v = (parseFloat(el.value) || 0) + parseFloat(b.dataset.v);
      el.value = b.dataset.f === 'kg' ? Math.round(v * 100) / 100 : Math.max(0, Math.round(v));
      readInputs(); save();
      if (navigator.vibrate) navigator.vibrate(8);
    },
    'set-done'(b) {
      readInputs();
      const k = dk(now());
      const { L, x } = liveCtx(b.dataset.slot);
      const i = +b.dataset.i;
      const st = x.sets[i];
      if (!(+st.reps > 0)) return toast('Anota cuántas hiciste');
      const wasDone = st.done;
      st.done = true;
      // propaga el peso a las series siguientes que no se han hecho
      x.sets.forEach((o, j) => { if (j > i && !o.done && st.kg !== '') o.kg = st.kg; });
      delete LV.set[b.dataset.slot];
      const slots = logSlots(k);
      x.done = x.sets.every(o => o.done);
      save();
      if (!wasDone) {
        const s = slots[LV.idx];
        const nextSet = x.sets.findIndex(o => !o.done);
        const nextLabel = nextSet >= 0 ? `Serie ${nextSet + 1} de ${E[x.ex].n}` : (slots[LV.idx + 1] ? `Sigue: ${E[L.ex[slots[LV.idx + 1].id].ex].n}` : 'Último ejercicio listo');
        if (nextSet >= 0 || slots[LV.idx + 1]) startRest(E[x.ex].r, nextLabel);
        if (x.done && LV.idx < slots.length - 1) { LV.idx++; toast(`${E[s.ex].n} listo`); }
      }
      rerender();
    },
    'set-add'(b) {
      readInputs();
      const { x } = liveCtx(b.dataset.slot);
      const l = x.sets[x.sets.length - 1];
      x.sets.push({ kg: l ? l.kg : '', reps: l ? l.reps : '', done: false });
      x.done = false;
      LV.set[b.dataset.slot] = x.sets.length - 1;
      save(); rerender();
    },
    'set-del'(b) {
      readInputs();
      const { x } = liveCtx(b.dataset.slot);
      if (x.sets.length > 1) x.sets.pop();
      x.done = x.sets.every(o => o.done);
      delete LV.set[b.dataset.slot];
      save(); rerender();
    },
    swap(b) {
      readInputs(); save();
      const { x } = liveCtx(b.dataset.slot);
      const alts = altsFor(x.ex, locOn());
      openSheet(`<h3>Cambiar ${esc(E[x.ex].n)}</h3><p class="small muted" style="margin:0 0 6px">Por equipo ocupado, molestia o aburrimiento. Se mantiene hasta el próximo bloque.</p>
        ${alts.map(id => `<button class="opt" data-a="swap-to" data-slot="${b.dataset.slot}" data-id="${id}"><div style="width:48px;height:48px;flex:none;border-radius:10px;overflow:hidden">${still(id, 0)}</div><div class="grow"><div class="t">${E[id].n}</div><div class="d">${E[id].m.join(', ')} · ${PROP[E[id].prop]}</div></div></button>`).join('')}`);
    },
    'swap-to'(b) {
      const slotId = b.dataset.slot, id = b.dataset.id;
      S.swaps[swapKey(slotId)] = { ex: id, block: blockInfo().block };
      const { x } = liveCtx(slotId);
      x.ex = id;
      x.sets = x.sets.filter(s => s.done).length ? x.sets : [];
      save(); closeSheet(); toast(`Ahora: ${E[id].n}`); rerender();
    },
    finish() {
      readInputs();
      const k = dk(now());
      const L = S.logs[k];
      const pending = logSlots(k).filter(s => !L.ex[s.id].done).length;
      if (pending && !confirm(`Te faltan ${pending} ejercicio(s). ¿Terminar igual?`)) return;
      L.done = true; L.finished = Date.now();
      save(); stopRest(); keepAwake(false);
      location.hash = '#/resumen/' + k;
    },
    'timer-add'(b) { if (RT.end) { RT.end += +b.dataset.v * 1000; RT.total = Math.max(RT.total + +b.dataset.v, 1); RT.doneAt = 0; $('#timer').classList.remove('done'); tick(); } },
    'timer-skip'() { stopRest(); },

    // ajustes
    ics() {
      const blob = new Blob([buildIcs()], { type: 'text/calendar' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'plan-fitness-recordatorios.ics';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      toast('Calendario descargado: ábrelo para importarlo');
    },
    theme(b) { S.settings.theme = b.dataset.v; save(); applyTheme(); rerender(); },
    rot(b) { S.settings.rotWeeks = +b.dataset.v; save(); rerender(); toast('Rotación actualizada'); },
    'plan-refresh'() { loadPlan(true); },
    export() {
      const blob = new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `plan-fitness-respaldo-${dk(now())}.json`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    },
    import() { $('#impFile').click(); },
    wipe() {
      if (!confirm('Esto borra todos tus registros de este celular. ¿Seguro?')) return;
      S = defaults(); save(); applyTheme(); toast('Datos borrados'); location.hash = '#/hoy';
    }
  };

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-a]');
    if (!b || b.disabled) return;
    const fn = A[b.dataset.a];
    if (fn) { e.preventDefault(); fn(b, e); }
  });

  const fold = t => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  document.addEventListener('input', e => {
    if (e.target.id !== 'eatSearch') return;
    const q = fold(e.target.value.trim().toLowerCase());
    document.querySelectorAll('#eatFoods .opt').forEach(o => { o.style.display = !q || fold(o.dataset.name).includes(q) ? '' : 'none'; });
  });

  document.addEventListener('change', e => {
    const t = e.target;
    if (t.id === 'phIn' && t.files[0]) {
      const pose = A._pose || 'frente', wk = thisWeek();
      toast('Guardando foto…');
      compressPhoto(t.files[0])
        .then(blob => IDB.put({ id: wk + '_' + pose, week: wk, pose, d: dk(now()), blob }))
        .then(() => { toast('Foto guardada'); renderFotos(); })
        .catch(() => toast('No se pudo guardar la foto'));
      return;
    }
    if (t.dataset.cmp) { cmp[t.dataset.cmp] = t.value; renderFotos(); return; }
    if (t.id === 'impFile' && t.files[0]) {
      const r = new FileReader();
      r.onload = () => {
        try {
          const data = JSON.parse(r.result);
          if (!data || !data.settings || !data.logs) throw new Error('formato');
          localStorage.setItem(KEY, JSON.stringify(data));
          S = load(); applyTheme(); toast('Respaldo restaurado'); rerender();
        } catch (err) { toast('Ese archivo no es un respaldo válido'); }
      };
      r.readAsText(t.files[0]);
      return;
    }
    if (t.dataset.prof) { const v = parseFloat(t.value); if (v > 0) { S.profile[t.dataset.prof] = v; save(); toast('Guardado'); } return; }
    if (t.dataset.set) {
      const f = t.dataset.set;
      if (f === 'start') { if (t.value) S.start = t.value; }
      else if (['budget', 'waterGoal', 'weighDay'].includes(f)) S.settings[f] = Math.max(0, parseInt(t.value, 10) || 0);
      else S.settings[f] = t.value.trim();
      if (f === 'waterGoal' && !S.settings.waterGoal) S.settings.waterGoal = 10;
      save(); toast('Guardado');
    }
    if (t.dataset.remOn) { S.settings.remOff = S.settings.remOff || {}; if (t.checked) delete S.settings.remOff[t.dataset.remOn]; else S.settings.remOff[t.dataset.remOn] = true; save(); rerender(); return; }
    if (t.dataset.remT) { S.settings.remT = S.settings.remT || {}; if (t.value) S.settings.remT[t.dataset.remT] = t.value; save(); toast('Hora guardada'); rerender(); return; }
    if (t.dataset.sched != null) { S.schedule[+t.dataset.sched] = t.value || null; save(); toast('Semana tipo guardada'); }
    if (t.id === 'kgIn' || t.id === 'repsIn') { readInputs(); save(); }
  });

  /* ---------- arranque ---------- */
  applyTheme();
  render();
  loadPlan(false);
  if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { if (location.hash.startsWith('#/entreno')) keepAwake(true); loadPlan(false); } });
})();
