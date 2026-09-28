// Genera los PNG del ícono (sin dependencias): mancuerna lima sobre fondo oscuro.
const fs = require('fs'), zlib = require('zlib');
function crc32(buf) { let c, t = []; for (let n = 0; n < 256; n++) { c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } let crc = 0xffffffff; for (const b of buf) crc = t[(crc ^ b) & 255] ^ (crc >>> 8); return (crc ^ 0xffffffff) >>> 0; }
function chunk(type, data) { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc32(td)); return Buffer.concat([len, td, c]); }
function png(size, maskable) {
  const px = Buffer.alloc(size * size * 4);
  const s = size / 64, pad = maskable ? 0.18 : 0;
  const rr = (x, y, w, h, r) => (px_x, px_y) => { const cx = Math.max(x + r, Math.min(px_x, x + w - r)), cy = Math.max(y + r, Math.min(px_y, y + h - r)); return (px_x - cx) ** 2 + (px_y - cy) ** 2 <= r * r; };
  const k = 1 - pad * 2, o = 32 * (1 - k);
  const shapes = [[10, 22, 7, 20, 2], [47, 22, 7, 20, 2], [18, 26, 5, 12, 1.5], [41, 26, 5, 12, 1.5], [23, 30, 18, 4, 1]].map(([x, y, w, h, r]) => rr(o + x * k, o + y * k, w * k, h * k, r * k));
  const bg = maskable ? () => true : rr(0, 0, 64, 64, 14);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    let a = 0, g = 0; const N = 3;
    for (let sy = 0; sy < N; sy++) for (let sx = 0; sx < N; sx++) { const u = (x + (sx + .5) / N) / s, v = (y + (sy + .5) / N) / s; if (bg(u, v)) { a++; if (shapes.some(f => f(u, v))) g++; } }
    const i = (y * size + x) * 4, A = a / (N * N), Gf = a ? g / a : 0;
    px[i] = Math.round(13 + (198 - 13) * Gf); px[i + 1] = Math.round(15 + (244 - 15) * Gf); px[i + 2] = Math.round(13 + (50 - 13) * Gf); px[i + 3] = Math.round(A * 255);
  }
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) { raw[y * (size * 4 + 1)] = 0; px.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4); }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
fs.writeFileSync('icons/icon-192.png', png(192));
fs.writeFileSync('icons/icon-512.png', png(512));
fs.writeFileSync('icons/icon-maskable-512.png', png(512, true));
console.log('ok');
