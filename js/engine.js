/* Motor de personalización: interpreta el objetivo, calcula metas y adapta rutina, menú y mercado a cada persona. */
(function () {
  'use strict';

  /* ---------- objetivos ---------- */
  const GOALS = {
    perder: { n: 'Perder grasa', d: 'Bajar de peso cuidando el músculo', kcal: 0.8, prot: 1.8, rate: [-0.01, -0.004] },
    ganar: { n: 'Ganar músculo', d: 'Subir de peso despacio, sobre todo músculo', kcal: 1.1, prot: 1.8, rate: [0.0025, 0.005] },
    tonificar: { n: 'Tonificar', d: 'Bajar un poco de grasa y marcar músculo (recomposición)', kcal: 0.92, prot: 1.8, rate: [-0.005, 0] },
    mantener: { n: 'Salud y mantenimiento', d: 'Mantener el peso, más fuerza y energía', kcal: 1, prot: 1.6, rate: [-0.0025, 0.0025] }
  };
  const FOCUS = {
    gluteo: 'Glúteo', pierna: 'Pierna', abdomen: 'Abdomen', brazos: 'Brazos', espalda: 'Espalda', pecho: 'Pecho', hombros: 'Hombros'
  };
  const LEVELS = { nuevo: 'Principiante (menos de 6 meses)', medio: 'Intermedio (6 meses a 2 años)', alto: 'Avanzado (más de 2 años)' };

  const fold = t => String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const num = s => parseFloat(String(s).replace(',', '.'));

  // Lee lo que la persona escribió y saca tipo de objetivo, zonas a enfatizar, peso meta y plazo
  function interpret(text, weight) {
    const t = fold(text);
    const out = { tipo: null, enfasis: [], pesoMeta: null, semanas: null, notas: [] };
    if (!t.trim()) return out;
    const score = { perder: 0, ganar: 0, tonificar: 0, mantener: 0 };
    [[/(bajar|perder|quemar|adelgaz|rebaj|secar|grasa|gordit|barriga|panza|llantas|rollitos|deshinch)/g, 'perder', 2],
     [/(definir|marcar|marcad)/g, 'tonificar', 2],
     [/(tonific|firme|reafirm|moldear|flacidez|durit)/g, 'tonificar', 2],
     [/(un poco|algo|poquito|un poquito) de (grasa|peso|barriga)/g, 'tonificar', 5],
     [/(ganar|aumentar|masa|volumen|crecer|musculo|hipertrofia|engordar|mas grande|agrandar)/g, 'ganar', 2],
     [/subir (de )?peso|subir \d/g, 'ganar', 3],
     [/bajar (de )?peso|bajar \d|perder \d/g, 'perder', 3],
     [/(salud|mantener|energia|sentirme bien|condicion|resistencia|activ|estres|dormir mejor)/g, 'mantener', 1]
    ].forEach(([re, k, w]) => { const m = t.match(re); if (m) score[k] += m.length * w; });
    const best = Object.entries(score).sort((a, b) => b[1] - a[1])[0];
    if (best[1] > 0) out.tipo = best[0];

    [[/(glute|cola|nalga|pompis|pompa|trasero|cadera|culo)/, 'gluteo'],
     [/(pierna|muslo|cuadricep|femoral|pantorrilla|gemelo)/, 'pierna'],
     [/(abdom|barriga|panza|cintura|core|six|cuadritos|vientre|abdomen plano)/, 'abdomen'],
     [/(brazo|bicep|tricep|flacidez)/, 'brazos'],
     [/(espalda|dorsal|postura)/, 'espalda'],
     [/(pecho|pectoral|busto)/, 'pecho'],
     [/(hombro|deltoid)/, 'hombros']
    ].forEach(([re, k]) => { if (re.test(t)) out.enfasis.push(k); });

    let m;
    if ((m = t.match(/(bajar|perder|rebajar|quitarme)\s*(unos\s*|como\s*)?(\d+(?:[.,]\d+)?)\s*(kg|kilo)/))) { if (weight) out.pesoMeta = Math.round((weight - num(m[3])) * 10) / 10; out.tipo = out.tipo || 'perder'; }
    else if ((m = t.match(/(subir|ganar|aumentar)\s*(unos\s*|como\s*)?(\d+(?:[.,]\d+)?)\s*(kg|kilo)/))) { if (weight) out.pesoMeta = Math.round((weight + num(m[3])) * 10) / 10; out.tipo = out.tipo || 'ganar'; }
    else if ((m = t.match(/(llegar a|pesar|quedar en|estar en)\s*(\d{2,3}(?:[.,]\d+)?)\s*(kg|kilo)?/))) out.pesoMeta = num(m[2]);
    if ((m = t.match(/(\d+)\s*(semana|mes)/))) out.semanas = Math.round(+m[1] * (m[2] === 'mes' ? 4.3 : 1));
    else if (/fin de ano|diciembre|navidad/.test(t)) { const d = new Date(), end = new Date(d.getFullYear(), 11, 15); out.semanas = Math.max(4, Math.round((end - d) / 6048e5)); }
    if (/(boda|matrimonio|vacaciones|playa|viaje|grado|cumpleanos|evento|quince)/.test(t)) out.notas.push('Tienes una fecha especial: el plan va con un ritmo que se sostenga hasta ese día.');
    if (/(rodilla|espalda baja|lumbar|lesion|hernia|dolor|operad)/.test(t)) out.notas.push('Mencionaste una molestia o lesión: si algún ejercicio duele, cámbialo por una variación en la ficha y consulta con un profesional de salud.');
    if (/(embaraz|lactan|postparto|posparto)/.test(t)) out.notas.push('Durante embarazo, lactancia o posparto consulta primero con tu médico: las calorías aquí no están pensadas para esa etapa.');
    if (out.pesoMeta && weight && !out.tipo) out.tipo = out.pesoMeta < weight ? 'perder' : out.pesoMeta > weight ? 'ganar' : 'mantener';
    return out;
  }

  /* ---------- metas de calorías y macros ---------- */
  function energy(p, w) {
    const man = p.sex !== 'm';
    const bmr = 10 * w + 6.25 * (+p.height || 165) - 5 * (+p.age || 28) + (man ? 5 : -161);
    return { bmr, tdee: bmr * (+p.act || 1.55), man };
  }
  // Ritmo semanal pedido (kg) según peso meta y plazo, limitado a lo sano
  function weeklyRate(goal, w) {
    const G = GOALS[goal.tipo] || GOALS.mantener;
    let r = w * (G.rate[0] + G.rate[1]) / 2;
    if (goal.pesoMeta && goal.semanas) {
      r = (goal.pesoMeta - w) / goal.semanas;
      const lo = w * -0.01, hi = w * 0.005;
      r = Math.max(lo, Math.min(hi, r));
    }
    return r;
  }
  function targets(p, w, goal) {
    const G = GOALS[goal.tipo] || GOALS.mantener;
    const { bmr, tdee, man } = energy(p, w);
    let k = tdee * G.kcal;
    if (goal.pesoMeta && goal.semanas) k = tdee + weeklyRate(goal, w) * 7700 / 7;
    if (goal.tipo === 'ganar' && !man) k = Math.min(k, tdee * 1.08);
    k = Math.max(k, tdee * 0.75, bmr * 1.05, man ? 1500 : 1200);
    k = Math.round(k / 50) * 50;
    const hm = (+p.height || 165) / 100;
    const wRef = w / (hm * hm) > 30 ? 27 * hm * hm : w; // con obesidad la proteína va por un peso de referencia
    const pr = Math.round(wRef * G.prot / 5) * 5;
    const f = Math.round(Math.max(0.6 * w, k * (man ? 0.22 : 0.25) / 9) / 5) * 5;
    const c = Math.max(60, Math.round((k - pr * 4 - f * 9) / 4 / 5) * 5);
    return { k, p: pr, c, f, tdee: Math.round(tdee), bmr: Math.round(bmr) };
  }
  // Semanas estimadas para llegar al peso meta
  function eta(goal, w) {
    if (!goal.pesoMeta || !w) return null;
    const r = weeklyRate(Object.assign({}, goal, { semanas: goal.semanas || null }), w);
    const diff = goal.pesoMeta - w;
    if (!r || Math.sign(r) !== Math.sign(diff)) return null;
    return Math.ceil(diff / r);
  }

  /* ---------- rutina ---------- */
  const EMPH = { gluteo: ['peso_muerto', 'bisagra', 'gluteo_med', 'gluteo_ais'], pierna: ['sentadilla', 'prensa', 'unilateral', 'cuadriceps_ais', 'femoral'], abdomen: ['core_flex', 'core_cadera', 'core_est'], brazos: ['biceps', 'biceps_b', 'triceps', 'triceps_oh'], espalda: ['espalda_v', 'espalda_h'], pecho: ['pecho_h', 'pecho_inc', 'pecho_ais'], hombros: ['hombro_v', 'hombro_lat', 'hombro_post'] };
  function pickTemplate(goal, p) {
    const days = +goal.dias || 4;
    const glute = (goal.enfasis || []).some(x => x === 'gluteo' || x === 'pierna') || (p.sex === 'm' && goal.tipo === 'tonificar');
    if (glute) return 'gluteo';
    if (days <= 3) return 'full';
    return 'hipertrofia';
  }
  // Copia las rutinas de la plantilla y las ajusta a nivel y énfasis
  function buildRoutines(D, goal, p, tplId) {
    const { E, R, TPL } = D;
    const tpl = TPL[tplId || pickTemplate(goal, p)];
    const days = Math.max(2, Math.min(6, +goal.dias || 4));
    let schedule = tpl.days[days] || tpl.days[Object.keys(tpl.days).map(Number).reduce((a, b) => Math.abs(b - days) < Math.abs(a - days) ? b : a)];
    const out = {};
    const used = [...new Set(schedule.filter(Boolean))];
    const lvl = goal.nivel || 'medio';
    used.forEach(rid => {
      const r = JSON.parse(JSON.stringify(R[rid]));
      if (tpl.fija) { out[rid] = r; return; } // rutina fija: tal cual la escribió el entrenador
      r.slots.forEach(s => {
        const g = E[s.ex].g;
        if (lvl === 'nuevo') {
          if (s.ex === 'dominadas') s.ex = 'jalon_pecho';
          if (s.ex === 'peso_muerto') s.ex = 'peso_muerto_rumano';
          if (s.ex === 'press_banca') s.ex = 'press_banca_manc';
          if (s.ex === 'sentadilla') { s.ex = 'sentadilla_goblet'; s.reps = [8, 12]; }
          if (!s.b && s.sets > 2) s.sets -= 1;
          if (s.b && s.sets > 3) s.sets = 3;
        }
        if (lvl === 'alto' && !s.b && s.sets < 4) s.sets += (goal.tipo === 'ganar' ? 1 : 0);
        (goal.enfasis || []).forEach(z => { if ((EMPH[z] || []).includes(g) && s.sets < 5) s.sets += 1; });
      });
      // Abdomen como énfasis: asegura trabajo de core en las rutinas que no lo tienen
      if ((goal.enfasis || []).includes('abdomen') && !r.slots.some(s => /^core/.test(E[s.ex].g))) {
        r.slots.push({ id: rid + '_abs', ex: r.slots.length % 2 ? 'crunch_polea' : 'plancha', sets: 2, reps: r.slots.length % 2 ? [12, 15] : [30, 45] });
      }
      out[rid] = r;
    });
    return { tpl: tplId || pickTemplate(goal, p), schedule: schedule.slice(), routines: out, days: schedule.filter(Boolean).length };
  }

  /* ---------- menú y mercado a la medida ---------- */
  const FR = { '½': 0.5, '¼': 0.25, '¾': 0.75 };
  const parseQ = s => { let v = 0; const m = s.match(/^(\d+(?:[.,]\d+)?)?([½¼¾])?$/); if (!m) return NaN; if (m[1]) v += num(m[1]); if (m[2]) v += FR[m[2]]; return v; };
  const fmtQ = v => {
    const w = Math.floor(v + 1e-9), r = Math.round((v - w) * 4) / 4;
    const fr = { 0.25: '¼', 0.5: '½', 0.75: '¾' }[r] || '';
    if (r === 1) return String(w + 1);
    return (w ? String(w) : '') + fr || '0';
  };
  const fmtDec = v => String(Math.round(v * 10) / 10).replace('.', ',');
  const INT_WORDS = /^(huevos?|tostadas?|tajadas?|tortillas?|panales?|latas?|unidades?|bolsas?|paquetes?|potes?|frascos?|atados?|bloques?|claras?)$/;
  const plural = w => /[aeiouáéíóú]$/i.test(w) ? w + 's' : /s$/i.test(w) ? w : w + 'es';
  const singular = w => /(d|l|n|r)es$/i.test(w) ? w.slice(0, -2) : /[aeiou]s$/i.test(w) ? w.slice(0, -1) : w;
  // Escala todas las cantidades de un texto: "3 huevos", "150 g", "1½ taza", "(250 ml)"
  function scaleText(text, f) {
    if (Math.abs(f - 1) < 0.04) return text;
    return text.replace(/(^|[\s(])(\d+(?:[.,]\d+)?[½¼¾]?|[½¼¾])(\s+)(de\s+)?([a-záéíóúñA-ZÁÉÍÓÚÑ]+)?/g, (all, pre, q, sp, de, word) => {
      const v = parseQ(q);
      if (isNaN(v)) return all;
      const w = (word || '').toLowerCase();
      let nv = v * f, out;
      if (w === 'g' || w === 'gr') out = String(nv >= 50 ? Math.round(nv / 10) * 10 : Math.max(5, Math.round(nv / 5) * 5));
      else if (w === 'ml') out = String(nv >= 100 ? Math.round(nv / 50) * 50 : Math.max(10, Math.round(nv / 10) * 10));
      else if (w === 'kg' || w === 'l') out = fmtDec(Math.max(0.1, nv));
      else if (INT_WORDS.test(w)) { nv = Math.max(1, Math.round(nv)); out = String(nv); }
      else { nv = Math.max(w === 'taza' || w === 'tazas' || de ? 0.25 : 0.5, Math.round(nv * (w.startsWith('taza') || de ? 4 : 2)) / (w.startsWith('taza') || de ? 4 : 2)); out = fmtQ(nv); }
      let word2 = word || '';
      if (word2 && !de && !/^(g|gr|ml|kg|l)$/i.test(word2)) word2 = nv <= 1 ? singular(word2) : (v <= 1 ? plural(word2) : word2);
      return pre + out + sp + (de || '') + word2;
    });
  }
  const PROT = /(pechuga|pollo|carne|molida|bistec|res|tilapia|atun|huevo|muslo|yogurt|queso|claras)/;
  const CARB = /(arroz|arepa|papa|pasta|pan|tajadas|tostada|avena|platano|yuca|banano|tortilla|granola|maiz|bocadillo|miel|mermelada|garbanzo|lenteja|frijol)/;
  // boost > 1 sube las porciones de proteína y baja carbohidratos para mantener las calorías
  function scaleMeal(m, f, boost) {
    boost = boost || 1;
    const fP = f * boost, dP = m.m.p * 0.8 * (fP - f), cC = m.m.c * 0.7;
    const fC = cC > 0 ? Math.max(f * 0.6, f - dP * 4 / (cC * 4) * f) : f;
    const dC = cC * (f - fC);
    const items = m.items.map(i => { const t = fold(i); return scaleText(i, PROT.test(t) ? fP : CARB.test(t) ? fC : f); });
    return Object.assign({}, m, { items, m: { k: Math.round(m.m.k * f + dP * 4 - dC * 4), p: Math.round(m.m.p * f + dP), c: Math.round(m.m.c * f - dC), f: Math.round(m.m.f * f) }, factor: f });
  }
  // Mercado: la primera cantidad se escala; empaques se redondean hacia arriba
  function scaleMarketItem(i, f) {
    if (i.mes || Math.abs(f - 1) < 0.04) return i;
    const m = i.q.match(/^(\d+(?:[.,]\d+)?)\s*([a-zA-ZáéíóúñÑ]+)?/);
    if (!m) return i;
    const v = num(m[1]), w = (m[2] || '').toLowerCase();
    let nv, q;
    if (i.id === 'huevos') { nv = Math.max(15, Math.round(v * f / 15) * 15); q = `${nv} (${nv % 30 ? fmtDec(nv / 30) : nv / 30} ${nv > 30 ? 'panales' : 'panal'})`; }
    else if (w === 'g') { nv = Math.max(100, Math.round(v * f / 50) * 50); q = i.q.replace(m[0], nv + ' g'); }
    else if (w === 'kg') { nv = Math.max(0.3, Math.round(v * f * 10) / 10); q = i.q.replace(m[0], fmtDec(nv) + ' kg'); }
    else if (w === 'l') { nv = v * f; q = nv < 1 ? i.q.replace(m[0], Math.max(250, Math.round(nv * 1000 / 250) * 250) + ' ml') : i.q.replace(m[0], fmtDec(nv) + ' L'); nv = nv < 1 ? Math.max(250, Math.round(nv * 1000 / 250) * 250) / 1000 : nv; }
    else { nv = Math.max(1, Math.ceil(v * f - 0.15)); q = i.q.replace(m[0], nv + (m[2] ? ' ' + (nv === 1 ? singular(m[2]) : m[2]) : '')); }
    if (i.id !== 'huevos' && nv !== v) q = q.replace(/\s*\([^)]*\)/, '');
    return Object.assign({}, i, { q, price: i.price ? Math.round(i.price * nv / v / 10) * 10 : i.price, base: i.q });
  }

  // Elige cuántas comidas al día y el factor de porción para llegar a las calorías de la persona
  const DROP = [[], ['pre'], ['pre', 'mediamanana'], ['pre', 'mediamanana', 'onces']];
  function personalize(plan, T) {
    if (!plan || !T) return plan;
    const avg = {};
    plan.menu.forEach(d => { for (const s in d) avg[s] = (avg[s] || 0) + plan.meals[d[s]].m.k / plan.menu.length; });
    let pick = null;
    for (const drop of DROP) {
      const tot = plan.slots.filter(s => !drop.includes(s.id)).reduce((a, s) => a + (avg[s.id] || 0), 0);
      const f = T.k / tot;
      pick = { drop, f };
      if (f >= 0.62) break;
    }
    const slots = plan.slots.filter(s => !pick.drop.includes(s.id));
    const MAIN = ['desayuno', 'almuerzo', 'cena'];
    const dayAvg = meals => { const a = { k: 0, p: 0, c: 0, f: 0 }; plan.menu.forEach(d => { for (const s in d) { const m = meals[d[s]]; if (m) ['k', 'p', 'c', 'f'].forEach(z => { a[z] += m.m[z] / plan.menu.length; }); } }); return a; };
    // Escala el menú: proteína primero; si falta grasa, suma aceite de oliva en las comidas principales
    const build = (f, boost, cdta) => {
      const out = {};
      Object.keys(plan.meals).forEach(id => {
        const src = plan.meals[id];
        if (pick.drop.includes(src.slot)) return;
        const m = scaleMeal(src, f, boost);
        if (cdta && MAIN.includes(src.slot)) {
          m.items = m.items.concat(`${fmtQ(cdta)} cdta de aceite de oliva (en la ensalada o al servir)`);
          m.m = Object.assign({}, m.m, { k: Math.round(m.m.k + cdta * 40), f: Math.round(m.m.f + cdta * 4.5) });
        }
        out[id] = m;
      });
      return out;
    };
    let f = Math.max(0.5, Math.min(1.45, pick.f)), boost = 1, cdta = 0, meals = build(f, 1, 0);
    for (let i = 0; i < 5; i++) {
      const a = dayAvg(meals);
      const pBase = a.p / boost;
      boost = Math.max(1, Math.min(1.6, pBase ? (T.p / pBase - 1) / 0.8 + 1 : 1));
      const fatGap = T.f - (a.f - cdta * 4.5 * MAIN.filter(x => !pick.drop.includes(x)).length);
      cdta = fatGap > 6 ? Math.min(2, Math.round(fatGap / 3 / 4.5 * 2) / 2) : 0;
      meals = build(f, boost, cdta);
      const r = T.k / dayAvg(meals).k;
      if (Math.abs(r - 1) < 0.025) break;
      f = Math.max(0.45, Math.min(1.5, f * r));
      meals = build(f, boost, cdta);
    }
    const base = plan.slots.reduce((a, s) => a + (avg[s.id] || 0), 0);
    const fm = Math.max(0.35, Math.min(1.5, T.k / base));
    const market = Object.assign({}, plan.market, {
      // Proteínas suben con el refuerzo de proteína; granos y pan bajan un poco para compensar
      items: plan.market.items.map(i => scaleMarketItem(i, i.cat === 'Proteínas' ? fm * boost : /Granos|Panader/.test(i.cat) ? fm * 0.9 : fm)),
      subs: (plan.market.subs || []).map(s => Object.assign({}, s, { ahorro: Math.round(s.ahorro * fm / 10) * 10 })),
      note: (plan.market.note || '') + ' Cantidades ajustadas a tu plan de ' + T.k.toLocaleString('es-CO') + ' kcal.'
    });
    const recipes = (plan.recipes || []).filter(r => !r.meal || meals[r.meal]).map(r => Object.assign({}, r, { ing: r.ing.map(x => scaleText(x, fm)) }));
    market.total = market.items.reduce((a, i) => a + (i.price > 0 ? (i.mes ? i.price / 2 : i.price) : 0), 0);
    return Object.assign({}, plan, { slots, meals, market, recipes, targets: { k: T.k, p: T.p, c: T.c, f: T.f }, factor: f, dropped: pick.drop, marketFactor: fm, personal: true });
  }

  window.PF_ENGINE = { GOALS, FOCUS, LEVELS, interpret, targets, energy, weeklyRate, eta, pickTemplate, buildRoutines, personalize, scaleText };
})();
