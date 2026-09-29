/* Figuras animadas por patrón de movimiento. Vista lateral mirando a la derecha salvo "front". */
(function () {
  const STAND = { h: [50, 20], s: [50, 30], e: [52, 43], w: [53, 56], p: [50, 56], k: [51, 74], f: [50, 92] };
  const FRONT = { h: [50, 19], n: [50, 29], sl: [42, 30], sr: [58, 30], p: [50, 56], pl: [45, 56], pr: [55, 56], kl: [44, 74], kr: [56, 74], fl: [43, 92], fr: [57, 92] };
  const st = o => Object.assign({}, STAND, o);
  const fr = o => Object.assign({}, FRONT, o);
  const BAR = [['thick', 28, 8, 72, 8]];

  const P = {
    bench: { props: [['rect', 14, 59, 52, 4], ['line', 18, 63, 18, 92], ['line', 62, 63, 62, 92]],
      a: { h: [21, 53], s: [31, 55], e: [31, 43], w: [31, 31], p: [58, 55], k: [72, 58], f: [76, 92] },
      b: { e: [22, 63], w: [30, 52] } },
    skull: { props: [['rect', 14, 59, 52, 4], ['line', 18, 63, 18, 92], ['line', 62, 63, 62, 92]],
      a: { h: [21, 53], s: [31, 55], e: [29, 43], w: [30, 31], p: [58, 55], k: [72, 58], f: [76, 92] },
      b: { w: [19, 44] } },
    incline: { props: [['thick', 60, 68, 34, 34], ['thick', 52, 70, 66, 70], ['line', 58, 70, 58, 92]],
      a: { h: [33, 30], s: [38, 39], e: [40, 27], w: [40, 15], p: [57, 64], k: [72, 66], f: [74, 92] },
      b: { e: [30, 48], w: [38, 40] } },
    chestpress: { props: [['thick', 32, 62, 30, 28], ['thick', 30, 62, 52, 62], ['line', 42, 62, 42, 92]],
      a: { h: [37, 25], s: [36, 34], e: [26, 40], w: [38, 38], p: [36, 60], k: [54, 62], f: [56, 86] },
      b: { e: [48, 36], w: [60, 36] } },
    ohp: { a: st({ e: [57, 40], w: [56, 29] }), b: { e: [52, 18], w: [51, 6] } },
    lateral: { front: 1, a: fr({ el: [40, 43], wl: [39, 55], er: [60, 43], wr: [61, 55] }),
      b: { el: [30, 29], wl: [18, 30], er: [70, 29], wr: [82, 30] } },
    fly: { front: 1, anchors: [[4, 8], [96, 8]], a: fr({ el: [31, 26], wl: [20, 22], er: [69, 26], wr: [80, 22] }),
      b: { el: [40, 40], wl: [48, 46], er: [60, 40], wr: [52, 46] } },
    reversefly: { a: { h: [74, 38], s: [66, 42], e: [67, 55], w: [67, 67], p: [42, 54], k: [48, 72], f: [46, 92] },
      b: { e: [64, 30], w: [63, 18] } },
    pushdown: { anchor: [66, 2], a: st({ h: [53, 20], s: [51, 30], e: [53, 43], w: [62, 35], p: [49, 56] }), b: { w: [56, 55] } },
    ohext: { anchor: [8, 30], a: st({ h: [55, 21], s: [52, 30], e: [57, 18], w: [48, 26], p: [48, 56], k: [50, 74], f: [52, 92] }), b: { w: [64, 8] } },
    dip: { props: [['thick', 38, 51, 64, 51], ['line', 44, 51, 44, 92]],
      a: { h: [51, 17], s: [50, 27], e: [50, 39], w: [50, 51], p: [50, 53], k: [45, 70], f: [38, 76] },
      b: { h: [52, 29], s: [50, 39], e: [40, 45], p: [51, 65], k: [46, 82], f: [39, 88] } },
    pushup: { a: { h: [78, 63], s: [70, 67], e: [70, 79], w: [70, 91], p: [44, 75], k: [30, 83], f: [16, 91] },
      b: { h: [79, 78], s: [70, 81], e: [60, 84], p: [44, 84], k: [30, 88] } },
    pullup: { props: BAR, a: { h: [54, 22], s: [50, 30], e: [50, 19], w: [50, 8], p: [49, 56], k: [50, 73], f: [44, 86] },
      b: { h: [55, 6], s: [50, 20], e: [40, 16], p: [49, 46], k: [50, 63], f: [44, 76] } },
    pulldown: { anchor: [48, 0], props: [['thick', 36, 64, 58, 64], ['thick', 56, 57, 66, 57], ['line', 40, 64, 40, 92]],
      a: { h: [46, 27], s: [44, 36], e: [46, 24], w: [48, 12], p: [42, 62], k: [60, 62], f: [61, 86] },
      b: { e: [40, 46], w: [50, 38] } },
    row: { a: { h: [73, 36], s: [65, 40], e: [65, 53], w: [65, 65], p: [42, 52], k: [48, 72], f: [46, 92] },
      b: { e: [54, 34], w: [58, 46] } },
    rowseat: { anchor: [96, 66], props: [['thick', 30, 68, 56, 68], ['thick', 74, 60, 74, 76]],
      a: { h: [48, 31], s: [46, 40], e: [57, 46], w: [68, 50], p: [40, 66], k: [58, 56], f: [72, 68] },
      b: { e: [34, 46], w: [46, 50] } },
    facepull: { anchor: [98, 18], a: st({ e: [62, 29], w: [74, 27] }), b: { e: [40, 24], w: [51, 18] } },
    curl: { a: st({ e: [51, 43], w: [53, 55] }), b: { w: [57, 32] } },
    squat: { a: st({ h: [50, 20], s: [49, 30], e: [41, 33], w: [46, 28], k: [52, 74] }),
      b: { h: [60, 37], s: [56, 46], e: [46, 52], w: [54, 44], p: [44, 70], k: [62, 78] } },
    hinge: { a: st({}), b: { h: [72, 40], s: [64, 44], e: [64, 57], w: [64, 69], p: [40, 54], k: [48, 74] } },
    goodmorning: { a: st({ e: [42, 36], w: [47, 29] }), b: { h: [72, 40], s: [64, 44], e: [58, 50], w: [64, 46], p: [40, 54], k: [48, 74] } },
    hyper: { props: [['thick', 40, 66, 50, 58], ['thick', 16, 90, 26, 90], ['line', 46, 64, 46, 92]],
      a: { h: [62, 90], s: [58, 82], e: [54, 78], w: [56, 72], p: [44, 62], k: [32, 74], f: [20, 86] },
      b: { h: [70, 36], s: [64, 44], e: [62, 52], w: [60, 48] } },
    deadlift: { a: { h: [70, 48], s: [62, 52], e: [61, 65], w: [60, 78], p: [38, 62], k: [55, 72], f: [50, 92] },
      b: STAND },
    hipthrust: { props: [['rect', 8, 54, 22, 6]],
      a: { h: [19, 48], s: [26, 52], e: [36, 64], w: [44, 72], p: [44, 74], k: [62, 62], f: [66, 92] },
      b: { e: [38, 50], w: [46, 54], p: [46, 54], k: [64, 58] } },
    lunge: { props: [['rect', 12, 64, 20, 5]],
      a: { h: [48, 19], s: [47, 28], e: [48, 42], w: [48, 54], p: [46, 54], k: [58, 72], f: [60, 92], k2: [36, 70], f2: [22, 62] },
      b: { h: [46, 33], s: [45, 42], e: [46, 56], w: [46, 68], p: [44, 68], k: [62, 72], k2: [30, 82] } },
    legpress: { props: [['thick', 10, 40, 26, 66], ['thick', 26, 66, 40, 66]],
      a: { h: [14, 35], s: [18, 44], e: [26, 56], w: [34, 62], p: [30, 64], k: [48, 50], f: [64, 36] },
      b: { k: [38, 44], f: [52, 48] } },
    legext: { props: [['thick', 30, 60, 54, 60], ['thick', 30, 60, 28, 30]],
      a: { h: [37, 23], s: [36, 32], e: [36, 46], w: [44, 58], p: [38, 58], k: [57, 60], f: [58, 80] },
      b: { f: [76, 54] } },
    legcurl: { props: [['rect', 12, 60, 62, 4], ['line', 16, 64, 16, 92], ['line', 70, 64, 70, 92]],
      a: { h: [16, 54], s: [24, 56], e: [22, 64], w: [14, 66], p: [50, 56], k: [70, 57], f: [88, 57] },
      b: { f: [74, 40] } },
    nordic: { props: [['thick', 18, 86, 26, 86]],
      a: { h: [41, 29], s: [40, 38], e: [47, 48], w: [46, 40], p: [40, 64], k: [40, 91], f: [22, 91] },
      b: { h: [88, 72], s: [80, 74], e: [84, 82], w: [90, 88], p: [58, 80] } },
    calf: { props: [['rect', 42, 94, 18, 4]],
      a: { h: [50, 22], s: [50, 32], e: [52, 45], w: [53, 58], p: [50, 58], k: [51, 76], f: [50, 94] },
      b: { h: [50, 16], s: [50, 26], e: [52, 39], w: [53, 52], p: [50, 52], k: [51, 70], f: [50, 88] } },
    plank: { a: { h: [82, 62], s: [73, 66], e: [73, 79], w: [82, 80], p: [47, 70], k: [32, 76], f: [16, 83] },
      b: { p: [47, 68] } },
    crunch: { anchor: [60, 0], a: { h: [58, 31], s: [56, 40], e: [63, 38], w: [59, 31], p: [54, 66], k: [54, 91], f: [36, 91] },
      b: { h: [76, 60], s: [70, 54], e: [74, 62], w: [72, 55] } },
    crunchfloor: { a: { h: [30, 80], s: [38, 84], e: [40, 76], w: [32, 78], p: [60, 86], k: [72, 72], f: [84, 88] },
      b: { h: [44, 66], s: [50, 74], e: [54, 68], w: [46, 66] } },
    wheel: { a: { h: [66, 56], s: [58, 62], e: [60, 74], w: [62, 86], p: [40, 70], k: [38, 91], f: [22, 91] },
      b: { h: [82, 78], s: [74, 82], e: [85, 84], w: [96, 86], p: [52, 80] } },
    legraise: { props: BAR, a: { h: [54, 22], s: [50, 30], e: [50, 19], w: [50, 8], p: [50, 56], k: [50, 74], f: [50, 91] },
      b: { p: [48, 56], k: [68, 50], f: [70, 68] } },
    legraisefloor: { a: { h: [16, 84], s: [26, 86], e: [30, 88], w: [40, 88], p: [52, 86], k: [70, 86], f: [88, 86] },
      b: { k: [60, 69], f: [66, 51] } },
    pallof: { anchor: [4, 38], a: st({ e: [56, 40], w: [58, 34] }), b: { e: [62, 36], w: [74, 36] } },
    // Glúteo: patada en polea (de pie), patada en cuadrupedia y abducción sentada (de frente)
    kickback: { props: [['thick', 74, 26, 74, 92]],
      a: { h: [60, 22], s: [57, 31], e: [65, 38], w: [73, 40], p: [50, 56], k: [51, 74], f: [50, 92], k2: [49, 74], f2: [48, 91] },
      b: { k2: [36, 68], f2: [22, 76] } },
    kickbackfloor: { a: { h: [76, 56], s: [67, 61], e: [67, 75], w: [67, 90], p: [40, 63], k: [38, 90], f: [18, 91], k2: [37, 88], f2: [20, 89] },
      b: { k2: [26, 58], f2: [12, 46] } },
    abduction: { front: 1, props: [['rect', 32, 61, 36, 4], ['line', 36, 65, 36, 92], ['line', 64, 65, 64, 92]],
      a: { h: [50, 24], n: [50, 34], sl: [42, 35], sr: [58, 35], el: [38, 47], wl: [40, 58], er: [62, 47], wr: [60, 58], p: [50, 60], pl: [45, 60], pr: [55, 60], kl: [45, 69], kr: [55, 69], fl: [45, 90], fr: [55, 90] },
      b: { kl: [31, 67], kr: [69, 67], fl: [35, 90], fr: [65, 90] } },
    adduction: { front: 1, props: [['rect', 32, 61, 36, 4], ['line', 36, 65, 36, 92], ['line', 64, 65, 64, 92]],
      a: { h: [50, 24], n: [50, 34], sl: [42, 35], sr: [58, 35], el: [38, 47], wl: [40, 58], er: [62, 47], wr: [60, 58], p: [50, 60], pl: [45, 60], pr: [55, 60], kl: [31, 67], kr: [69, 67], fl: [35, 90], fr: [65, 90] },
      b: { kl: [45, 69], kr: [55, 69], fl: [45, 90], fr: [55, 90] } },
    // De pie, de frente: la pierna de la polea se abre hacia el lado
    cableabd: { front: 1, props: [['thick', 94, 20, 94, 92]],
      a: fr({ el: [40, 43], wl: [40, 55], er: [70, 36], wr: [92, 38] }),
      b: { kr: [62, 73], fr: [72, 90] } },
    straightarm: { anchor: [78, 0], a: st({ h: [52, 21], s: [50, 30], e: [60, 20], w: [70, 12], p: [46, 56], k: [48, 74], f: [48, 92] }),
      b: { e: [58, 42], w: [58, 55] } },
    atw: { props: [['rect', 14, 59, 52, 4], ['line', 18, 63, 18, 92], ['line', 62, 63, 62, 92]],
      a: { h: [21, 53], s: [31, 55], e: [40, 53], w: [50, 52], p: [58, 55], k: [72, 58], f: [76, 92] },
      b: { e: [22, 50], w: [10, 50] } }
  };
  // Figura femenina (cabello largo) para usuarias
  let FEM = false;

  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  function poseAt(key, t) {
    const d = P[key] || P.curl;
    const b = Object.assign({}, d.a, d.b);
    const o = {};
    for (const k in d.a) o[k] = lerp(d.a[k], b[k], t);
    return o;
  }
  const pt = p => p[0].toFixed(1) + ',' + p[1].toFixed(1);

  function segments(key, q) {
    const d = P[key] || P.curl;
    if (d.front) return [[q.n, q.p], [q.sl, q.sr], [q.sl, q.el, q.wl], [q.sr, q.er, q.wr], [q.pl, q.pr], [q.pl, q.kl, q.fl], [q.pr, q.kr, q.fr]];
    const s = [[q.s, q.p], [q.s, q.e, q.w], [q.p, q.k, q.f]];
    if (q.k2) s.push([q.p, q.k2, q.f2]);
    return s;
  }

  function propMarkup(d) {
    return (d.props || []).map(p => {
      if (p[0] === 'rect') return `<rect x="${p[1]}" y="${p[2]}" width="${p[3]}" height="${p[4]}" rx="1.5" class="fg-prop-fill"/>`;
      if (p[0] === 'thick') return `<line x1="${p[1]}" y1="${p[2]}" x2="${p[3]}" y2="${p[4]}" class="fg-prop" stroke-width="4"/>`;
      return `<line x1="${p[1]}" y1="${p[2]}" x2="${p[3]}" y2="${p[4]}" class="fg-prop" stroke-width="1.6"/>`;
    }).join('');
  }

  // Implemento dinámico (sigue las manos)
  function toolMarkup(key, q, prop) {
    const d = P[key] || P.curl;
    const hands = d.front ? [q.wl, q.wr] : [q.w];
    let out = '';
    if (prop === 'cable' && key === 'cableabd') out += `<line x1="94" y1="88" x2="${q.fr[0].toFixed(1)}" y2="${q.fr[1].toFixed(1)}" class="fg-cable"/>`;
    else if (prop === 'cable') {
      const anchors = d.anchors || [d.anchor || [q.w[0], 0]];
      hands.forEach((h, i) => { const a = anchors[i] || anchors[0]; out += `<line x1="${a[0]}" y1="${a[1]}" x2="${h[0]}" y2="${h[1]}" class="fg-cable"/>`; });
    }
    if (prop === 'bar') {
      if (d.front) out += `<line x1="${q.wl[0] - 4}" y1="${q.wl[1]}" x2="${q.wr[0] + 4}" y2="${q.wr[1]}" class="fg-tool" stroke-width="2.4"/>`;
      else out += `<circle cx="${q.w[0]}" cy="${q.w[1]}" r="6.5" class="fg-plate"/><circle cx="${q.w[0]}" cy="${q.w[1]}" r="1.4" class="fg-tool-fill"/>`;
    }
    if (prop === 'db') hands.forEach(h => { out += `<rect x="${h[0] - 4}" y="${h[1] - 2.2}" width="8" height="4.4" rx="1.6" class="fg-tool-fill"/>`; });
    if (key === 'wheel') out += `<circle cx="${q.w[0]}" cy="${q.w[1]}" r="4.5" class="fg-plate"/>`;
    if (key === 'legpress') out += `<line x1="${q.f[0] - 7}" y1="${q.f[1] - 7}" x2="${q.f[0] + 7}" y2="${q.f[1] + 7}" class="fg-tool" stroke-width="3"/>`;
    if (key === 'legext' || key === 'legcurl') out += `<circle cx="${q.f[0]}" cy="${q.f[1]}" r="3" class="fg-tool-fill"/>`;
    if (key === 'kickback') out += `<line x1="74" y1="88" x2="${q.f2[0].toFixed(1)}" y2="${q.f2[1].toFixed(1)}" class="fg-cable"/>`;
    return out;
  }

  // Cabello: cola de caballo de lado, melena de frente (cuelga hacia abajo)
  function hair(key, q) {
    const [x, y] = q.h, d = P[key] || P.curl;
    const f = n => n.toFixed(1);
    if (d.front) return `<path d="M${f(x - 5)} ${f(y - 2)} Q${f(x - 7.5)} ${f(y + 4)} ${f(x - 6)} ${f(y + 9)} M${f(x + 5)} ${f(y - 2)} Q${f(x + 7.5)} ${f(y + 4)} ${f(x + 6)} ${f(y + 9)}" class="fg-hair"/>`;
    // Cuerpo horizontal (banco, plancha): el pelo cuelga hacia abajo por fuera de la cabeza
    if (Math.abs(y - q.s[1]) < 7) {
      const dx = x >= q.s[0] ? 1 : -1;
      return `<path d="M${f(x + dx * 2)} ${f(y + 3)} Q${f(x + dx * 7)} ${f(y + 5)} ${f(x + dx * 6)} ${f(y + 12)}" class="fg-hair"/>`;
    }
    const dir = q.s[0] >= q.p[0] - 2 ? -1 : 1; // la cola va hacia la espalda
    return `<path d="M${f(x + dir * 3)} ${f(y - 4)} Q${f(x + dir * 10)} ${f(y - 3)} ${f(x + dir * 9)} ${f(y + 7)}" class="fg-hair"/>`;
  }

  function inner(key, t, prop) {
    const q = poseAt(key, t);
    const lines = segments(key, q).map(s => `<polyline points="${s.map(pt).join(' ')}" class="fg-body"/>`).join('');
    return toolMarkup(key, q, prop) + lines + (FEM ? hair(key, q) : '') + `<circle cx="${q.h[0].toFixed(1)}" cy="${q.h[1].toFixed(1)}" r="5.5" class="fg-head"/>`;
  }

  function svg(key, t, prop, cls) {
    const d = P[key] || P.curl;
    return `<svg viewBox="-2 -4 104 104" class="${cls || ''}" role="img" aria-hidden="true">
      <line x1="0" y1="93.5" x2="100" y2="93.5" class="fg-ground"/>${propMarkup(d)}<g class="fg-live">${inner(key, t, prop)}</g></svg>`;
  }

  // Anima un <svg> generado con svg(): vaivén con pausas en cada extremo
  function animate(el, key, prop) {
    const g = el.querySelector('.fg-live');
    if (!g) return;
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const T = 3200;
    const t0 = performance.now();
    function frame(now) {
      if (!el.isConnected) return;
      const x = ((now - t0) % T) / T; // 0..1
      // 0-.15 pausa inicio, .15-.5 va, .5-.65 pausa final, .65-1 vuelve
      let t = x < .15 ? 0 : x < .5 ? (x - .15) / .35 : x < .65 ? 1 : 1 - (x - .65) / .35;
      t = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      g.innerHTML = inner(key, t, prop);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  window.PF_POSES = { svg, animate, setFem: v => { FEM = !!v; } };
})();
