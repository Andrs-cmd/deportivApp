/* Conexión a Supabase. La clave "anon/publishable" es pública por diseño: los datos se protegen con las reglas (RLS) de supabase/schema.sql.
   Si se deja vacío, la app funciona como antes: sin cuentas, todo en este celular. */
window.PF_CONFIG = {
  supabaseUrl: 'https://lsmatftizmhkbpikenoz.supabase.co',
  supabaseKey: 'sb_publishable_DzeBp8yRcJfxJfp9jr-n5g_kSTo1gDN'
};
