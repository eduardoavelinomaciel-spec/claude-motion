import * as SP from './sprites.js';
import { makeStreet } from './bg.js';
await document.fonts.load('8px PS2P'); await document.fonts.load('60px PS2P'); await document.fonts.load('40px Bangers');
const W = 480, H = 270, S = 4;
const MODE = new URLSearchParams(location.search).get('f') || 'A';
const NIGHT = MODE !== 'B';
let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647); const R = (a, b) => a + (b - a) * rnd();
const ctx = document.getElementById('ov').getContext('2d');
const px = document.getElementById('px').getContext('2d'); px.imageSmoothingEnabled = false;
const panels = [], items = [], extras = [], ov = {};
const NFX = (rimColor, dx) => (NIGHT ? { tint: [0.8, 0.76, 0.98], rim: { color: rimColor, dx, dy: 0, k: 0.55 } } : undefined);
// ---------- comic overlay ----------

function toScreen(v, p) {
  const n = v.clone().project(p.cam); const [x, y, w, h] = p.rect;
  return [x + (n.x + 1) / 2 * w, y + (1 - n.y) / 2 * h];
}
function panelFrames() {
  if (panels.length < 2) { ctx.lineWidth = 16; ctx.strokeStyle = '#111'; ctx.strokeRect(8, 8, 1904, 1064); }
  for (const p of panels) {
    const [x, y, w, h] = p.rect;
    if (panels.indexOf(p) > 0 && MODE === 'C') { ctx.lineWidth = 28; ctx.strokeStyle = '#fff'; ctx.strokeRect(x - 9, y - 9, w + 18, h + 18); }
    ctx.lineWidth = 10; ctx.strokeStyle = '#111'; ctx.strokeRect(x + 5, y + 5, w - 10, h - 10);
  }
}
function halftone(x, y, w, h, color = 'rgba(10,10,30,0.55)', step = 14, from = 'tl') {
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.fillStyle = color;
  for (let yy = y; yy < y + h; yy += step) for (let xx = x; xx < x + w; xx += step) {
    const ox = (Math.floor((yy - y) / step) % 2) * step / 2;
    let t = from === 'tl' ? 1 - Math.hypot(xx - x, yy - y) / Math.hypot(w, h) : 1 - Math.hypot(x + w - xx, y + h - yy) / Math.hypot(w, h);
    const r = Math.max(0, t * t * step * 0.55);
    if (r > 0.5) { ctx.beginPath(); ctx.arc(xx + ox, yy, r, 0, 7); ctx.fill(); }
  }
  ctx.restore();
}
function speedLines(cx, cy, rect, n = 70, inner = 260, color = 'rgba(255,255,255,0.85)') {
  const [x, y, w, h] = rect; ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.fillStyle = color;
  for (let k = 0; k < n; k++) {
    const a = (k / n) * Math.PI * 2 + R(-0.03, 0.03), r0 = inner + R(0, 120), r1 = 2400, wd = R(0.004, 0.012);
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
    ctx.lineTo(cx + Math.cos(a - wd) * r1, cy + Math.sin(a - wd) * r1); ctx.lineTo(cx + Math.cos(a + wd) * r1, cy + Math.sin(a + wd) * r1); ctx.fill();
  }
  ctx.restore();
}
function caption(x, y, text, size = 52, rot = -0.02) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `${size}px Bangers`;
  const w = ctx.measureText(text).width + 52, h = size + 36;
  ctx.fillStyle = '#111'; ctx.fillRect(10, 10, w, h);
  ctx.fillStyle = '#ffd84a'; ctx.fillRect(0, 0, w, h); ctx.lineWidth = 6; ctx.strokeStyle = '#111'; ctx.strokeRect(0, 0, w, h);
  ctx.fillStyle = '#111'; ctx.textBaseline = 'middle'; ctx.fillText(text, 26, h / 2 + 3); ctx.restore();
}
function balloon(cx, cy, w, h, tx, ty, draw) {
  ctx.save(); ctx.lineWidth = 7; ctx.strokeStyle = '#111'; ctx.fillStyle = '#fff';
  const tail = () => { ctx.beginPath(); ctx.moveTo(cx - w * 0.12, cy + h * 0.3); ctx.lineTo(tx, ty); ctx.lineTo(cx + w * 0.08, cy + h * 0.36); ctx.closePath(); };
  tail(); ctx.stroke(); ctx.beginPath(); ctx.ellipse(cx, cy, w / 2, h / 2, 0, 0, 7); ctx.stroke();
  tail(); ctx.fill(); ctx.beginPath(); ctx.ellipse(cx, cy, w / 2, h / 2, 0, 0, 7); ctx.fill();
  draw && draw(); ctx.restore();
}
const ICONS = {
  heart: ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...'],
  star: ['...X...', '..XXX..', 'XXXXXXX', '.XXXXX.', '.XX.XX.', 'X.....X'],
  anger: ['.X...X.', 'XX...XX', '.......', '.......', 'XX...XX', '.X...X.'],
  bang: ['XX.XX', 'XX.XX', 'XX.XX', 'XX.XX', '.....', 'XX.XX'],
  sweat: ['..X..', '.XXX.', 'XXXXX', 'XXXXX', '.XXX.'],
};
function icon(name, cx, cy, sz, color) {
  const rows = ICONS[name]; const w = rows[0].length, h = rows.length;
  ctx.fillStyle = color;
  rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch === 'X') ctx.fillRect(cx + (i - w / 2) * sz, cy + (j - h / 2) * sz, sz, sz); }));
}
function iconBalloon(cx, cy, tx, ty, name, color) { balloon(cx, cy, 170, 130, tx, ty, () => icon(name, cx, cy, 14, color)); }
function speech(cx, cy, tx, ty, lines, size = 46) {
  ctx.font = `${size}px Bangers`; const w = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 110, h = lines.length * size * 1.1 + 70;
  balloon(cx, cy, w, h, tx, ty, () => { ctx.fillStyle = '#111'; ctx.font = `${size}px Bangers`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    lines.forEach((l, i) => ctx.fillText(l, cx, cy + (i - (lines.length - 1) / 2) * size * 1.1 + 3)); });
}
function sfx(text, x, y, size, rot, fill = ['#fff35a', '#ff8a1e'], shadow = '#d8343c', stretch = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(stretch, 1); ctx.font = `${size}px PS2P`; ctx.textBaseline = 'middle';
  let cx = 0; const chars = [...text]; const total = chars.reduce((a, c) => a + ctx.measureText(c).width * 0.92, 0); cx = -total / 2;
  chars.forEach((ch, i) => {
    const cw = ctx.measureText(ch).width * 0.92, jy = Math.sin(i * 1.7) * size * 0.12, jr = Math.sin(i * 2.3) * 0.08, sc = 1 + Math.sin(i * 1.1) * 0.08;
    ctx.save(); ctx.translate(cx + cw / 2, jy); ctx.rotate(jr); ctx.scale(sc, sc);
    ctx.lineJoin = 'miter'; ctx.textAlign = 'center';
    ctx.fillStyle = '#111'; ctx.fillText(ch, size * 0.12, size * 0.12);
    ctx.fillStyle = shadow; ctx.fillText(ch, size * 0.07, size * 0.07);
    ctx.lineWidth = size * 0.2; ctx.strokeStyle = '#111'; ctx.strokeText(ch, 0, 0);
    const g = ctx.createLinearGradient(0, -size / 2, 0, size / 2); g.addColorStop(0, fill[0]); g.addColorStop(1, fill[1]);
    ctx.fillStyle = g; ctx.fillText(ch, 0, 0); ctx.restore();
    cx += cw;
  });
  ctx.restore();
}


const st = makeStreet({ night: NIGHT, seed: MODE === 'B' ? 5 : 11, crosswalkX: MODE === 'B' ? 330 : 300 });
const GY = st.GROUND, ROAD = 256;
const P = (rect, sx) => { const p = { rect, sx }; panels.push(p); return p; };
const rp = (p) => p.rect.map((v) => v / S);
const portrait = (spr, p, flip) => { const [x, y, w, h] = rp(p); items.push({ spr, at: [Math.round(x + w / 2), Math.round(y + h - 4)], flip, z: -1, clip: [x, y, w, h], center: true }); };

if (MODE === 'A') {
  const m = P([0, 0, 1240, 1080], Math.round(st.padX - 175));
  P([1256, 0, 664, 532], Math.round(st.padX - 80)); P([1256, 548, 664, 532], Math.round(st.padX + 120));
  const ox = 205;
  items.push({ spr: SP.carSide({ lit: true, fx: NFX('#ff3cac', 0) }), at: [32, ROAD + 6], z: 1 });
  items.push({ spr: SP.otavioSide({ head: 0.35, arm: -0.7, farArm: 0.15, stride: 0.22, fx: NFX('#ffb070', -1) }), at: [ox, ROAD], flip: true, z: 2 });
  items.push({ spr: SP.dogSide({ pose: 'leap', fx: NFX('#ffb070', -1) }), at: [ox + 34, ROAD - 24], flip: true, z: 3 });
  portrait(SP.dogPortrait({ fx: NFX('#ff3cac', -1) }), panels[1], true);
  portrait(SP.handPhone({ fx: NFX('#3cf2ff', 1) }), panels[2], true);
  extras.push((g) => beam(g, 96, ROAD - 18, 1, 220));
  ov.dogHead = () => [(ox + 34 - 22) * S, (ROAD - 24 - 34) * S];
  ov.car = () => [70 * S, (ROAD - 40) * S];
  ov.eye = () => [1560, 180];
}
if (MODE === 'B') {
  P([0, 0, 1920, 1080], Math.round(st.padX - 250));
  const ox = 120, dg = [250, 258];
  items.push({ spr: SP.otavioFront({ smile: true }), at: [ox, GY + 8], z: 5 });
  items.push({ spr: SP.lowWall(70), at: [400, GY + 8], z: 5 });
  items.push({ spr: SP.cat(), at: [395, GY - 13], flip: true, z: 4 });
  items.push({ spr: SP.trashCan(), at: [335, GY + 12], z: 4 });
  items.push({ spr: SP.lid(), at: [318, GY - 12], z: 4 });
  items.push({ spr: SP.dogSide({ pose: 'splash', muddy: true }), at: dg, z: 1 });
  for (let k = 0; k < 7; k++) items.push({ spr: SP.pigeon(k % 2 === 0), at: [Math.round(R(170, 300)), Math.round(R(30, 95))], flip: k % 3 === 0, z: 6 });
  extras.unshift((g) => { g.fillStyle = SP.OUT; g.beginPath(); g.ellipse(dg[0], dg[1] + 2, 46, 8, 0, 0, 7); g.fill(); g.fillStyle = '#7a5a3c'; g.beginPath(); g.ellipse(dg[0], dg[1] + 2, 45, 7, 0, 0, 7); g.fill(); g.fillStyle = '#9a7a58'; g.fillRect(dg[0] - 22, dg[1], 16, 1); });
  extras.push((g) => blobs(g, dg[0], dg[1] - 6, 44, 30, ['#6b4a2b', '#8a6a48'], 0.9));
  extras.push((g) => blobs(g, dg[0], dg[1] - 4, 34, 14, ['#bfe4ff', '#ffffff'], 0.7));
  extras.push((g) => blobs(g, 345, GY + 8, 16, 8, ['#ffffff', '#e7d38a', '#d8343c'], 0.4));
  ov.dogHead = () => [(dg[0] + 8) * S, (dg[1] - 50) * S];
  ov.cat = () => [395 * S, (GY - 40) * S];
  ov.can = () => [335 * S, (GY + 6) * S];
  ov.pigeons = () => [200 * S, 30 * S];
  ov.otavio = () => [ox * S, (GY - 82) * S];
}
if (MODE === 'C') {
  P([0, 0, 1920, 1080], Math.round(st.padX - 230)); P([1330, 60, 540, 420], Math.round(st.padX - 40));
  const ox = 150;
  items.push({ spr: SP.carSide({ lit: true, fx: NFX('#3cf2ff', 1) }), at: [318, ROAD + 8], flip: true, z: 1 });
  items.push({ spr: SP.otavioSide({ lean: -0.38, arm: -2.5, farArm: -1.6, head: -0.3, stride: 0.35, phone: false, shock: true, fx: NFX('#ffb070', 1) }), at: [ox, ROAD], z: 2 });
  items.push({ spr: SP.dogSide({ pose: 'pull', fx: NFX('#ff3cac', -1) }), at: [ox - 46, ROAD + 2], z: 3 });
  portrait(SP.dogPortrait({ bite: true, fx: NFX('#ff3cac', -1) }), panels[1]);
  extras.push((g) => beam(g, 252, ROAD - 14, -1, 150));
  extras.push((g) => blobs(g, 318, ROAD + 6, 46, 40, ['#cfe0ff', '#ffffff', '#8fb0ff'], 0.8));
  extras.push((g) => { for (let k = 0; k < 9; k++) { g.fillStyle = 'rgba(255,255,255,0.7)'; g.fillRect(390 + R(0, 40), ROAD - 34 + k * 4, R(20, 50), 1); } });
  extras.push((g) => { const x = ox - 2, y = ROAD - 122; g.fillStyle = SP.OUT; g.fillRect(x - 1, y - 1, 6, 10); g.fillStyle = '#15161c'; g.fillRect(x, y, 4, 8); g.fillStyle = '#8fe0ff'; g.fillRect(x + 1, y + 1, 2, 6); });
  ov.car = () => [300 * S, (ROAD - 30) * S];
  ov.dogHead = () => [(ox - 30) * S, (ROAD - 40) * S];
}

function beam(g, x, y, dir, len) {
  if (!NIGHT) return; g.save(); g.globalCompositeOperation = 'lighter';
  const gr = g.createLinearGradient(x, y, x + dir * len, y); gr.addColorStop(0, 'rgba(255,246,200,0.32)'); gr.addColorStop(1, 'rgba(255,246,200,0)');
  g.fillStyle = gr; g.beginPath(); g.moveTo(x, y - 3); g.lineTo(x + dir * len, y - 36); g.lineTo(x + dir * len, y + 30); g.closePath(); g.fill(); g.restore();
}
function blobs(g, cx, cy, spread, n, cols, up) {
  for (let k = 0; k < n; k++) {
    const a = R(Math.PI * 1.05, Math.PI * 1.95), r = R(4, spread);
    const x = Math.round(cx + Math.cos(a) * r * 1.3), y = Math.round(cy + Math.sin(a) * r * up), s = Math.round(R(1, 3.5));
    g.fillStyle = SP.OUT; g.fillRect(x - 1, y - 1, s + 2, s + 2); g.fillStyle = cols[k % cols.length]; g.fillRect(x, y, s, s);
  }
}

// --- compose pixel layer
for (const p of panels) { const [x, y, w, h] = rp(p); px.drawImage(st.canvas, p.sx, 0, w, h, x, y, w, h); }
if (MODE === 'B') extras.shift()(px);
items.sort((a, b) => a.z - b.z);
for (const it of items) {
  px.save(); if (it.clip) { px.beginPath(); px.rect(...it.clip); px.clip(); }
  let [ax, ay] = it.spr.anchor; if (it.center) ax = it.spr.width / 2;
  if (it.flip) { px.translate(it.at[0], 0); px.scale(-1, 1); px.drawImage(it.spr, -ax, it.at[1] - ay); } else px.drawImage(it.spr, it.at[0] - ax, it.at[1] - ay);
  px.restore();
}
extras.forEach((f) => f(px));
if (NIGHT) { px.fillStyle = 'rgba(170,200,255,0.5)'; for (let k = 0; k < 320; k++) px.fillRect(Math.round(R(0, W)), Math.round(R(0, H)), 1, 5); }
function overlay() {
  
  if (MODE === 'A') {
    const [mx, my] = ov.dogHead();
    speedLines(mx, my, panels[0].rect, 80, 230, 'rgba(255,255,255,0.35)');
    halftone(1256, 0, 664, 532, 'rgba(255,60,172,0.45)', 16, 'br');
    halftone(1256, 548, 664, 532, 'rgba(60,240,255,0.35)', 16, 'tl');
    panelFrames();
    const [cx, cy] = ov.car();
    sfx('SKRIIIII!', 300, cy - 260, 74, -0.12, ['#ffffff', '#9fd8ff'], '#3c6cff');
    sfx('NHAC!', mx + 120, my - 200, 96, 0.1);
    caption(40, 40, 'UM SEGUNDO.', 62);
    { const [ex, ey] = ov.eye(); iconBalloon(1780, 110, ex + 40, ey - 10, 'bang', '#d8343c'); }
  }
  if (MODE === 'B') {
    const p = panels[0];
    halftone(1420, 0, 500, 360, 'rgba(255,255,255,0.55)', 18, 'tl');
    panelFrames();
    const [dx, dy] = ov.dogHead(), [kx, ky] = ov.cat(), [nx, ny] = ov.can(), [px, py] = ov.pigeons(), [ox, oy] = ov.otavio();
    sfx('SPLOOSH!', dx + 300, dy + 140, 78, -0.08, ['#ffe08a', '#c07a2a'], '#5a3a1a');
    sfx('FLAP FLAP!', 760, 330, 54, -0.15, ['#ffffff', '#c9d4ff'], '#5a6a8a');
    sfx('KLANG!', nx - 40, ny - 120, 60, 0.16, ['#fff35a', '#ff8a1e']);
    iconBalloon(kx + 170, ky - 150, kx + 30, ky - 30, 'anger', '#d8343c');
    iconBalloon(dx - 190, dy - 210, dx - 40, dy - 40, 'star', '#f5b400');
    caption(1080, 40, 'A CIDADE RESOLVEU TESTAR A AMIZADE.', 48, 0.015);
    speech(ox + 250, oy - 60, ox + 50, oy + 10, ['...HEH.'], 44);
  }
  if (MODE === 'C') {
    const p = panels[0]; const [cx, cy] = ov.car();
    speedLines(cx, cy, [0, 0, 1920, 1080], 80, 340, 'rgba(255,255,255,0.22)');
    halftone(0, 0, 900, 500, 'rgba(10,10,40,0.55)', 16, 'tl');
    panelFrames();
    { const [bx, by] = ov.car(); sfx('BIIIIIII!', bx + 40, by - 230, 96, -0.06, ['#ffffff', '#ffe14a'], '#d8343c'); }
    const [dx, dy] = ov.dogHead();
    sfx('NHAC!!', dx - 40, dy - 260, 80, -0.12);
    const [ix, iy] = ov.dogHead();
    sfx('GRRR', 1720, 150, 50, 0.1, ['#ffffff', '#ffd0a0'], '#8a3a2e');
    caption(40, 40, 'ELE NÃO PENSOU. SÓ PUXOU.', 54, 0.01);
  }
}


overlay();
window.__done = true;
