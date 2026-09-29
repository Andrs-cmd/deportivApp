/* Cuentas y sincronización con Supabase: cada persona tiene una fila con todo su estado. */
(function () {
  'use strict';
  const C = window.PF_CONFIG || {};
  const on = !!(C.supabaseUrl && C.supabaseKey && window.supabase);
  const base = location.origin + location.pathname;
  const sb = on ? window.supabase.createClient(C.supabaseUrl, C.supabaseKey, {
    auth: { flowType: 'pkce', persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: 'pf.auth' }
  }) : null;

  let user = null, recovery = false;
  // El enlace de "olvidé mi contraseña" llega con una sesión de recuperación: hay que pedir la clave nueva
  if (sb) sb.auth.onAuthStateChange(ev => { if (ev === 'PASSWORD_RECOVERY') recovery = true; });
  let queued = null, timer = null, busy = false;
  let status = 'ok';
  const subs = [];
  const setStatus = s => { status = s; subs.forEach(f => f(s)); };

  const ERR = [
    [/invalid login credentials/i, 'Correo o contraseña incorrectos.'],
    [/already registered|already been registered|user already exists/i, 'Ese correo ya tiene cuenta. Inicia sesión.'],
    [/password should be at least|weak password|password is too/i, 'La contraseña debe tener al menos 8 caracteres.'],
    [/email not confirmed/i, 'Primero confirma tu correo: revisa tu bandeja de entrada (y spam).'],
    [/rate limit|too many|security purposes/i, 'Demasiados intentos. Espera unos minutos y vuelve a intentar.'],
    [/invalid email|unable to validate email|email address .* is invalid/i, 'Ese correo no parece válido.'],
    [/failed to fetch|network|load failed/i, 'Sin conexión. Revisa tu internet.'],
    [/same password|should be different/i, 'La nueva contraseña debe ser distinta a la anterior.']
  ];
  const msg = e => { const t = (e && (e.message || e.error_description || e)) + ''; for (const [re, m] of ERR) if (re.test(t)) return m; return 'Algo falló: ' + t; };
  const wrap = async p => { const { data, error } = await p; if (error) throw new Error(msg(error)); return data; };

  async function init() {
    if (!on) return null;
    const { data } = await sb.auth.getSession();
    user = data.session ? data.session.user : null;
    // Limpia ?code= del enlace de recuperación para no dejarlo en el historial
    if (location.search && /[?&](code|error)=/.test(location.search)) history.replaceState(null, '', base + location.hash);
    return user;
  }
  function onAuth(cb) {
    if (!on) return;
    sb.auth.onAuthStateChange((ev, session) => { user = session ? session.user : null; setTimeout(() => cb(ev, user), 0); });
  }
  const keep = d => { if (d && d.session) user = d.session.user; return d; };
  const signUp = (email, password, name) => wrap(sb.auth.signUp({ email, password, options: { data: { name }, emailRedirectTo: base } })).then(keep);
  const signIn = (email, password) => wrap(sb.auth.signInWithPassword({ email, password })).then(keep);
  const reset = email => wrap(sb.auth.resetPasswordForEmail(email, { redirectTo: base }));
  const setPassword = password => wrap(sb.auth.updateUser({ password }));
  async function signOut() { await flush(); await sb.auth.signOut(); user = null; }

  async function load() {
    const { data, error } = await sb.from('perfiles').select('estado, actualizado').eq('id', user.id).maybeSingle();
    if (error) throw new Error(msg(error));
    return data ? { state: data.estado, ts: Date.parse(data.actualizado) } : null;
  }
  // Guarda con un pequeño retraso para agrupar cambios seguidos (series, vasos de agua…)
  function push(state) {
    if (!on || !user) return;
    queued = state;
    setStatus('pending');
    clearTimeout(timer);
    timer = setTimeout(flush, 1500);
  }
  async function flush() {
    clearTimeout(timer);
    if (!queued || !user || busy) return;
    busy = true;
    const state = queued; queued = null;
    try {
      const { error } = await sb.from('perfiles').upsert({ id: user.id, estado: state, actualizado: new Date(state._ts || Date.now()).toISOString() });
      if (error) throw error;
      setStatus(queued ? 'pending' : 'ok');
    } catch (e) {
      queued = queued || state;
      setStatus(navigator.onLine === false ? 'offline' : 'error');
    } finally { busy = false; }
    if (queued) { clearTimeout(timer); timer = setTimeout(flush, 4000); }
  }
  window.addEventListener('online', () => { if (queued) flush(); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });

  window.PF_CLOUD = {
    on, init, onAuth, signUp, signIn, signOut, reset, setPassword, load, push, flush,
    get user() { return user; },
    get status() { return status; },
    get recovery() { return recovery; },
    doneRecovery: () => { recovery = false; },
    onStatus: f => subs.push(f)
  };
})();
