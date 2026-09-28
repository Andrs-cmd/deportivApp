(function () {
  'use strict';
  const { E, G, R } = window.PF_DATA;
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
  const ic = (n, sw) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw || 2}" stroke-linecap="round" stroke-linejoin="round">${I[n]}</svg>`;

  /* ---------- estado ---------- */
  const KEY = 'pf.v1';
  const defaults = () => ({
    v: 1,
    start: dk(monday(now())),
    schedule: ['empuje', 'tiron', 'piernas', null, 'torso', 'pierna_core', null],
    weekMoves: {}, swaps: {}, logs: {}, body: [], meals: {}, mealSwaps: {}, water: {}, market: {},
    settings: { theme: 'auto', name: '', budget: 0, waterGoal: 10, rotWeeks: 5, weighDay: 0 }
  });
  function load() {
    let s = null;
    try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { s = null; }
    const d = defaults();
    if (!s || typeof s !== 'object') return d;
    const out = Object.assign(d, s);
    out.settings = Object.assign(defaults().settings, s.settings || {});
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

  function slotsFor(rid, d) {
    const r = R[rid];
    if (!r) return [];
    const { block } = blockInfo(d);
    const used = new Set(r.slots.filter(s => s.b).map(s => s.ex));
    return r.slots.map(s => {
      let ex = s.ex;
      const sw = S.swaps[s.id];
      if (sw && sw.block === block && E[sw.ex]) ex = sw.ex;
      else if (!s.b) {
        const grp = G[E[s.ex].g].filter(id => !BASICS.has(id) || id === s.ex);
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
  function macroBars(done, plan) {
    const T = PLAN.targets;
    const row = (l, key, u) => {
      const pct = Math.min(100, Math.round(done[key] / T[key] * 100));
      return `<div class="mbar"><div class="top"><span>${l}</span><span class="num"><b>${Math.round(done[key])}</b> / ${T[key]} ${u} <span class="muted">· plan ${Math.round(plan[key])}</span></span></div><div class="track"><div class="fill" style="width:${pct}%"></div></div></div>`;
    };
    return `<div class="macro-bars">${row('Calorías', 'k', 'kcal')}${row('Proteína', 'p', 'g')}${row('Carbos', 'c', 'g')}${row('Grasas', 'f', 'g')}</div>`;
  }

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
      const doneM = sumMacros(meals.filter(x => chk[x.slot.id]));
      h += `<div class="sec-title">Comidas de hoy <a class="small link-btn" href="#/comida">Ver menú</a></div><div class="card">
        <div class="mbar" style="margin-bottom:6px"><div class="top"><span>Calorías</span><span class="num"><b>${doneM.k}</b> / ${PLAN.targets.k} kcal · <b>${doneM.p}</b> g proteína</span></div>
        <div class="track"><div class="fill" style="width:${Math.min(100, doneM.k / PLAN.targets.k * 100)}%"></div></div></div>`;
      meals.forEach(x => {
        const on = !!chk[x.slot.id];
        h += `<div class="list-item ${on ? 'done' : ''}"><div class="grow"><div class="d">${x.slot.time} · ${x.slot.label}</div><div class="t">${esc(PLAN.meals[x.id].n)}</div></div>
          <button class="check ${on ? 'on' : ''}" data-a="meal-check" data-k="${k}" data-slot="${x.slot.id}" aria-label="Marcar comida">${ic('check', 3)}</button></div>`;
      });
      h += `</div>`;
    }

    // Agua
    const w = S.water[k] || 0, goal = +S.settings.waterGoal || 10;
    h += `<div class="sec-title">Agua</div><div class="card water">
      <button class="round" data-a="water" data-v="-1" aria-label="Quitar vaso">−</button>
      <div class="grow"><div class="count num">${w}<span class="muted" style="font-size:16px;font-weight:600"> / ${goal} vasos</span></div>
      <div class="small muted">${fmt(w * 0.25)} L de ${fmt(goal * 0.25)} L</div>
      <div class="glasses">${Array.from({ length: goal }, (_, i) => `<span class="g ${i < w ? 'on' : ''}"></span>`).join('')}</div></div>
      <button class="round pri" data-a="water" data-v="1" aria-label="Sumar vaso">+</button></div>`;

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
        <div class="small muted">${rid ? R[rid].d : 'Recuperación'}</div>${st}</div>
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
    let h = head('Comida', PLAN ? `Meta: ${PLAN.targets.k} kcal · ${PLAN.targets.p} P · ${PLAN.targets.c} C · ${PLAN.targets.f} G` : '', gearBtn);
    if (!PLAN) { app.innerHTML = h + '<div class="card empty">Cargando el plan…</div>'; return; }
    const d0 = monday(now());
    const sel = comidaDay == null ? wIdx(now()) : comidaDay;
    const d = addDays(d0, sel);
    const k = dk(d);
    h += `<div class="day-chips">${DAYS.map((n, i) => `<button class="${i === sel ? 'on' : ''} ${i === wIdx(now()) ? 'today' : ''}" data-a="day" data-i="${i}">${n}<b>${addDays(d0, i).getDate()}</b></button>`).join('')}</div>`;
    const meals = dayMeals(d);
    const chk = S.meals[k] || {};
    h += `<div class="card">${macroBars(sumMacros(meals.filter(x => chk[x.slot.id])), sumMacros(meals))}
      <p class="small muted" style="margin:10px 0 0">Las barras se llenan con lo que vas marcando. Macros aproximadas.</p></div>`;
    meals.forEach(x => {
      const m = PLAN.meals[x.id];
      const on = !!chk[x.slot.id];
      h += `<div class="card meal-card ${on ? 'done' : ''}"><div class="meal"><div class="grow">
        <div class="time">${x.slot.time} · ${x.slot.label.toUpperCase()}</div>
        <div class="name">${esc(m.n)}</div>
        <ul>${m.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
        <div class="mac num">${m.m.k} kcal · ${m.m.p} g P · ${m.m.c} g C · ${m.m.f} g G</div>
        <div class="acts">${m.lleva ? '<span class="chip line">Para llevar</span>' : ''}<button class="link-btn" data-a="meal-swap" data-k="${k}" data-slot="${x.slot.id}">${'Cambiar por otra'}</button></div>
        </div><button class="check ${on ? 'on' : ''}" data-a="meal-check" data-k="${k}" data-slot="${x.slot.id}" aria-label="Marcar comida">${ic('check', 3)}</button></div></div>`;
    });
    h += `<div class="sec-title">Equivalencias</div><div class="card">
      <p class="small muted" style="margin:0 0 6px">Cambia un alimento por otro del mismo grupo y mantienes las macros.</p>
      ${PLAN.equivalencias.map(g => `<details class="eq"><summary>${esc(g.grupo)} <span class="small muted" style="margin-left:auto;margin-right:10px">${esc(g.base)}</span></summary><ul>${g.opciones.map(o => `<li>${esc(o)}</li>`).join('')}</ul></details>`).join('')}</div>`;
    h += `<div class="sec-title">Recetas de la semana</div>`;
    h += PLAN.recipes && PLAN.recipes.length
      ? PLAN.recipes.map(r => `<div class="card"><h2>${esc(r.n)}</h2><div class="chips" style="margin-bottom:8px">${r.min ? `<span class="chip">${r.min} min</span>` : ''}${r.lleva ? '<span class="chip">Para llevar</span>' : ''}</div><ol class="small" style="padding-left:18px;margin:0">${(r.pasos || []).map(p => `<li>${esc(p)}</li>`).join('')}</ol></div>`).join('')
      : `<div class="card empty small">Las recetas nuevas llegan con la actualización del lunes.</div>`;
    app.innerHTML = h;
  }

  function viewMercado() {
    let h = head('Mercado', PLAN ? `Para ${PLAN.market.days} días` : '', gearBtn);
    if (!PLAN) { app.innerHTML = h + '<div class="card empty">Cargando el plan…</div>'; return; }
    const M = PLAN.market;
    const chk = S.market[M.updated] || {};
    const items = M.items;
    const priced = items.filter(i => i.price > 0);
    const total = priced.reduce((a, i) => a + i.price, 0);
    const bud = (+S.settings.budget || 0) * M.days / 7;
    const doneN = items.filter(i => chk[i.id]).length;
    h += `<div class="card"><div class="budget"><div><div class="small muted">Total estimado</div><div class="v num">${priced.length ? cop(total) : 'Sin precios aún'}</div></div>
      <div style="text-align:right"><div class="small muted">Presupuesto ${M.days} días</div><div style="font-weight:800" class="num">${bud ? cop(bud) : '<a href="#/ajustes">Ponlo en ajustes</a>'}</div></div></div>
      ${priced.length && bud ? `<div class="progress-line"><div style="width:${Math.min(100, total / bud * 100)}%;${total > bud ? 'background:var(--danger)' : ''}"></div></div>` : ''}
      <p class="small muted" style="margin:10px 0 0">${esc(M.note || '')}</p>
      <div class="row" style="margin-top:10px"><div class="grow small"><b>${doneN}</b> de ${items.length} comprados</div><button class="link-btn" data-a="mk-reset">Desmarcar todo</button></div></div>`;
    const cats = [];
    items.forEach(i => { if (!cats.includes(i.cat)) cats.push(i.cat); });
    cats.forEach(c => {
      h += `<div class="cat-title">${esc(c)}</div><div class="card" style="padding-top:6px;padding-bottom:6px">`;
      items.filter(i => i.cat === c).forEach(i => {
        const on = !!chk[i.id];
        h += `<div class="list-item ${on ? 'done' : ''}"><button class="check ${on ? 'on' : ''}" data-a="mk-check" data-id="${i.id}" aria-label="Comprado">${ic('check', 3)}</button>
          <div class="grow"><div class="t">${esc(i.n)}</div><div class="d">${esc(i.q)}${i.alt ? ' · más barato: ' + esc(i.alt) : ''}</div></div>
          ${i.price > 0 ? `<div class="price num">${cop(i.price)}<small>${esc(i.store || '')}${i.date ? ' · ' + shortDate(i.date) : ''}</small></div>` : ''}</div>`;
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
    const alts = G[ex.g].filter(x => x !== id);
    const qEs = encodeURIComponent(ex.n + ' técnica correcta');
    const qEn = encodeURIComponent(ex.en + ' proper form');
    let h = `<div class="page-head">${backBtn}<div class="ttl">Ficha del ejercicio</div></div>
      <h1 class="ex-title">${ex.n}</h1>
      <div class="chips"><span class="chip acc">${isBasic ? 'Básico · progresa carga' : 'Accesorio · rota por bloques'}</span><span class="chip">${PROP[ex.prop]}</span></div>
      ${animFig(id, 'figure-main')}
      <div class="figs"><div class="f">${fig(id, 0)}Inicio</div><div class="f">${fig(id, 1)}Final</div></div>
      <div class="yt"><a class="btn block" href="https://www.youtube.com/results?search_query=${qEs}" target="_blank" rel="noopener">${ic('yt')} Ver técnica en YouTube</a>
      <a class="btn block alt" href="https://www.youtube.com/results?search_query=${qEn}+jeff+nippard" target="_blank" rel="noopener">Versión en inglés (Jeff Nippard y otros)</a></div>
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
      h += `<div class="list-item"><div style="width:52px;height:52px;flex:none;background:var(--surface-2);border-radius:12px">${fig(a, 1)}</div>
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
      <div class="ttl"><b>${R[rid].n}</b><span class="num" id="elapsed">${mmss((Date.now() - L.started) / 1000)}</span></div>
      <button class="btn pri" style="min-height:44px;padding:0 16px" data-a="finish">Terminar</button></div>
      <div class="dots">${slots.map((o, i) => `<button class="${L.ex[o.id] && L.ex[o.id].done ? 'done' : ''} ${i === LV.idx ? 'cur' : ''}" data-a="go-ex" data-i="${i}" aria-label="Ejercicio ${i + 1}"></button>`).join('')}</div>
      <div class="ex-card fade-in">
        <div class="top"><div class="mini" data-anim="${ex.pose}" data-prop="${ex.prop}">${fig(x.ex, 0)}</div>
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

  /* ---------- ajustes ---------- */
  function viewAjustes() {
    const st = S.settings;
    const opts = (v) => `<option value="">Descanso</option>` + Object.keys(R).map(r => `<option value="${r}" ${v === r ? 'selected' : ''}>${R[r].n}</option>`).join('');
    let h = `<div class="page-head">${backBtn}<div class="ttl">Ajustes</div></div>
      <div class="card"><h2>Apariencia</h2><div class="seg">${[['auto', 'Auto'], ['light', 'Claro'], ['dark', 'Oscuro']].map(([v, l]) => `<button class="${st.theme === v ? 'on' : ''}" data-a="theme" data-v="${v}">${l}</button>`).join('')}</div></div>
      <div class="card"><h2>Tus datos</h2>
        <label class="lbl" for="sName">Nombre (para el saludo)</label><input class="field" id="sName" data-set="name" value="${esc(st.name)}" autocomplete="off">
        <label class="lbl" for="sBud">Presupuesto semanal de mercado (COP)</label><input class="field num" id="sBud" data-set="budget" type="number" inputmode="numeric" value="${st.budget || ''}" placeholder="Ej: 180000">
        <label class="lbl" for="sWat">Meta de agua (vasos de 250 ml)</label><input class="field num" id="sWat" data-set="waterGoal" type="number" inputmode="numeric" value="${st.waterGoal}">
        <label class="lbl" for="sWd">Día de pesaje</label><select class="field" id="sWd" data-set="weighDay">${DAYS_L.map((d, i) => `<option value="${i}" ${+st.weighDay === i ? 'selected' : ''}>${d}</option>`).join('')}</select></div>
      <div class="card"><h2>Entreno</h2>
        <label class="lbl">Rotar accesorios cada</label><div class="seg">${[4, 5, 6].map(n => `<button class="${+st.rotWeeks === n ? 'on' : ''}" data-a="rot" data-v="${n}">${n} semanas</button>`).join('')}</div>
        <label class="lbl" for="sStart">Inicio del programa</label><input class="field" id="sStart" type="date" data-set="start" value="${S.start}">
        <label class="lbl">Semana tipo</label>${DAYS.map((d, i) => `<div class="sched-row"><b>${d}</b><select class="field" data-sched="${i}">${opts(S.schedule[i])}</select></div>`).join('')}</div>
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
    const full = ['entreno', 'ej', 'ajustes', 'resumen'].includes(name);
    app.className = 'app' + (full ? ' full' : '');
    nav.classList.toggle('hidden', full);
    if (name !== 'entreno') keepAwake(false);
    const views = { hoy: viewHoy, semana: viewSemana, progreso: viewProgreso, comida: viewComida, mercado: viewMercado, entreno: viewEntreno, ej: viewEj, ajustes: viewAjustes, resumen: viewResumen };
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

  const A = {
    back() { if (navCount > 0) history.back(); else location.hash = '#/hoy'; },
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
    'week-reset'() { delete S.weekMoves[dk(monday(now()))]; save(); rerender(); },
    'open-ex'(b) { location.hash = `#/ej/${b.dataset.id}${b.dataset.slot ? '/' + b.dataset.slot : ''}`; },
    'use-alt'(b) {
      const slotId = b.dataset.slot, id = b.dataset.id;
      S.swaps[slotId] = { ex: id, block: blockInfo().block };
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
      const alts = G[E[x.ex].g].filter(id => id !== x.ex);
      openSheet(`<h3>Cambiar ${esc(E[x.ex].n)}</h3><p class="small muted" style="margin:0 0 6px">Por equipo ocupado, molestia o aburrimiento. Se mantiene hasta el próximo bloque.</p>
        ${alts.map(id => `<button class="opt" data-a="swap-to" data-slot="${b.dataset.slot}" data-id="${id}"><div style="width:48px;height:48px;flex:none">${fig(id, 1)}</div><div class="grow"><div class="t">${E[id].n}</div><div class="d">${E[id].m.join(', ')} · ${PROP[E[id].prop]}</div></div></button>`).join('')}`);
    },
    'swap-to'(b) {
      const slotId = b.dataset.slot, id = b.dataset.id;
      S.swaps[slotId] = { ex: id, block: blockInfo().block };
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

  document.addEventListener('change', e => {
    const t = e.target;
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
    if (t.dataset.set) {
      const f = t.dataset.set;
      if (f === 'start') { if (t.value) S.start = t.value; }
      else if (['budget', 'waterGoal', 'weighDay'].includes(f)) S.settings[f] = Math.max(0, parseInt(t.value, 10) || 0);
      else S.settings[f] = t.value.trim();
      if (f === 'waterGoal' && !S.settings.waterGoal) S.settings.waterGoal = 10;
      save(); toast('Guardado');
    }
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
