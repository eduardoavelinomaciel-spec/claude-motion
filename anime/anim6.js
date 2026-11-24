// Scene 6 "A risada": render(t), pure in t.
window.ANIM = true; window.NO_RAIN = true; window.NO_CAP = true;
await import('./shots.js');
await document.fonts.load('40px PS2P');
const { W, H, off, rng, glow, grade, bloom, caption_, thick, shots, pixelate, post, rimSil } = window.SH;
const TL = await (await fetch('timeline6.json')).json();
const B = TL.beats;
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(x));
const easeOut = (x) => 1 - (1 - clamp(x)) ** 3;
const back = (x) => { x = clamp(x); const c = 1.7; return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2; };
function cam(g, img, s, cx, cy, dx = 0, dy = 0) { g.save(); g.translate(cx + dx, cy + dy); g.scale(s, s); g.translate(-cx, -cy); g.drawImage(img, 0, 0); g.restore(); }
const E = (g, x, y, rx, ry, rot, col) => { g.fillStyle = col; g.beginPath(); g.ellipse(x, y, rx, ry, rot || 0, 0, 7); g.fill(); };
function capsule(g, x0, y0, x1, y1, w, col, edge) { g.lineCap = 'round'; if (edge) { g.strokeStyle = edge; g.lineWidth = w + 4; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); } g.strokeStyle = col; g.lineWidth = w; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); }

// ---------- Caramelo sitting, awake (profile facing right), cached ----------
function dogSit(blink = 0) {
  const [c, g] = off(700, 760); const r = rng(902);
  const X = 330, Y = 720; // ground under the front paws
  const FUR = ['#7a400f', '#a8601f', '#cf8436', '#eaa555', '#ffd08a'];
  const body = new Path2D();
  body.ellipse(X - 70, Y - 150, 170, 120, -0.5, 0, 7); // haunch + back
  body.ellipse(X + 40, Y - 260, 95, 150, 0.25, 0, 7); // chest/torso upright
  body.ellipse(X - 150, Y - 70, 110, 70, 0, 0, 7); // hind leg folded
  const fg = g.createLinearGradient(X - 250, Y - 400, X + 150, Y); fg.addColorStop(0, '#f6c07a'); fg.addColorStop(0.55, '#d68a3a'); fg.addColorStop(1, '#8f4f1a');
  g.fillStyle = fg; g.fill(body);
  // front legs
  for (const [x, col] of [[X + 10, '#b8722e'], [X + 70, '#d68a3a']]) { capsule(g, x, Y - 260, x + 8, Y - 30, 56, col); E(g, x + 22, Y - 14, 40, 20, 0, '#f6efe4'); capsule(g, x + 4, Y - 90, x + 10, Y - 30, 52, '#f6efe4'); }
  // hind paw
  E(g, X - 70, Y - 12, 52, 20, 0, '#f6efe4');
  // fur strokes
  g.save(); g.clip(body); g.lineCap = 'round';
  for (let k = 0; k < 3500; k++) { const x = X - 300 + r() * 520, y = Y - 430 + r() * 430, lit = (1 - (x - X + 300) / 520) * 0.5 + (1 - (y - Y + 430) / 430) * 0.5 + (r() - 0.5) * 0.3;
    g.strokeStyle = FUR[Math.max(0, Math.min(4, Math.floor(lit * 5)))]; g.globalAlpha = 0.65; g.lineWidth = 1.5 + r() * 2; const a = 1.9 + (r() - 0.5) * 0.6, L = 10 + r() * 16; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke(); }
  g.globalAlpha = 1; g.restore();
  // white chest
  g.fillStyle = '#f6efe4'; g.beginPath(); g.moveTo(X + 60, Y - 380); g.bezierCurveTo(X + 150, Y - 330, X + 140, Y - 200, X + 90, Y - 150); g.bezierCurveTo(X + 50, Y - 200, X + 30, Y - 300, X + 60, Y - 380); g.fill();
  g.strokeStyle = 'rgba(200,190,180,0.8)'; g.lineWidth = 2; for (let k = 0; k < 10; k++) { const y = Y - 340 + k * 18; g.beginPath(); g.moveTo(X + 80 + (k % 2) * 10, y); g.lineTo(X + 72 + (k % 2) * 10, y + 14); g.stroke(); }
  // head
  const HX = X + 80, HY = Y - 440;
  g.fillStyle = '#a8601f'; g.beginPath(); g.moveTo(HX - 70, HY - 40); g.quadraticCurveTo(HX - 130, HY - 10, HX - 110, HY + 60); g.quadraticCurveTo(HX - 80, HY + 20, HX - 40, HY - 10); g.closePath(); g.fill(); // folded ear
  const hg = g.createRadialGradient(HX - 20, HY - 40, 10, HX, HY, 120); hg.addColorStop(0, '#f6c07a'); hg.addColorStop(1, '#c47a30'); E(g, HX, HY, 100, 88, 0, hg);
  g.fillStyle = '#cf8436'; g.beginPath(); g.moveTo(HX - 10, HY - 70); g.lineTo(HX + 18, HY - 170); g.lineTo(HX + 55, HY - 62); g.closePath(); g.fill(); // ear up
  g.fillStyle = '#f2a0a8'; g.beginPath(); g.moveTo(HX + 6, HY - 74); g.lineTo(HX + 20, HY - 140); g.lineTo(HX + 42, HY - 70); g.closePath(); g.fill();
  E(g, HX + 85, HY + 25, 70, 42, 0.1, '#f6efe4'); E(g, HX + 60, HY + 50, 60, 30, 0, '#f6efe4');
  E(g, HX + 150, HY + 10, 18, 14, 0, '#1a0e0a'); E(g, HX + 145, HY + 4, 5, 4, 0, 'rgba(255,255,255,0.8)');
  g.strokeStyle = '#3a1c0c'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(HX + 120, HY + 50); g.quadraticCurveTo(HX + 100, HY + 62, HX + 80, HY + 54); g.stroke();
  // anime eye
  const EX = HX + 30, EY = HY - 8;
  if (blink > 0.5) { g.strokeStyle = '#2a140a'; g.lineWidth = 6; g.beginPath(); g.arc(EX, EY + 4, 20, 0.2, Math.PI - 0.2); g.stroke(); }
  else { E(g, EX, EY, 22, 27, 0, '#1a0a04'); const ir = g.createLinearGradient(0, EY - 20, 0, EY + 25); ir.addColorStop(0, '#2a1006'); ir.addColorStop(1, '#b8702e'); E(g, EX + 2, EY + 4, 17, 20, 0, ir); E(g, EX + 3, EY + 2, 9, 11, 0, '#080302');
    E(g, EX - 6, EY - 9, 7, 7, 0, '#ffffff'); E(g, EX + 8, EY + 10, 3, 3, 0, '#ffffff'); g.strokeStyle = '#140804'; g.lineWidth = 5; g.beginPath(); g.arc(EX, EY + 2, 25, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
  E(g, EX + 20, EY + 34, 18, 7, 0, 'rgba(255,120,140,0.4)');
  // head fur strokes
  { const hr = rng(903); g.save(); g.beginPath(); g.ellipse(HX, HY, 100, 88, 0, 0, 7); g.clip(); for (let k = 0; k < 700; k++) { const x = HX - 100 + hr() * 200, y = HY - 90 + hr() * 180; if (Math.hypot(x - EX, y - EY) < 34) continue; g.strokeStyle = ['#cf8436', '#eaa555', '#ffd08a'][Math.floor(hr() * 3)]; g.globalAlpha = 0.5; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 10, y + 4); g.stroke(); } g.restore(); g.globalAlpha = 1; }
  // rim light (sun from the left)
  g.save(); g.globalCompositeOperation = 'source-atop'; const rl = g.createLinearGradient(X - 260, 0, X - 120, 0); rl.addColorStop(0, 'rgba(255,240,190,0.55)'); rl.addColorStop(1, 'rgba(255,240,190,0)'); g.fillStyle = rl; g.fillRect(0, 0, 700, 760); g.restore();
  c.anchor = [X, Y]; c.tail = [X - 220, Y - 170];
  return c;
}
function drawDog(g, img, x, y, s, flip, tailAng) {
  g.save(); g.translate(x, y); g.scale(flip ? -s : s, s);
  // tail behind, wagging
  const [tx, ty] = [img.tail[0] - img.anchor[0], img.tail[1] - img.anchor[1]];
  const L1 = 90, a = -2.4 + tailAng; const mx = tx + Math.cos(a) * L1, my = ty + Math.sin(a) * L1, ex = mx + Math.cos(a + 0.6) * 70, ey = my + Math.sin(a + 0.6) * 70;
  g.lineCap = 'round'; g.strokeStyle = '#b8722e'; g.lineWidth = 40; g.beginPath(); g.moveTo(tx, ty); g.quadraticCurveTo(mx, my, ex, ey); g.stroke(); g.strokeStyle = '#eaa555'; g.lineWidth = 14; g.beginPath(); g.moveTo(tx, ty - 6); g.quadraticCurveTo(mx, my - 6, ex, ey - 6); g.stroke(); E(g, ex, ey, 22, 18, a, '#f6efe4');
  g.drawImage(img, -img.anchor[0], -img.anchor[1]); g.restore();
}

function limb(g, x0, y0, x1, y1, w0, w1, col, shade) {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  g.fillStyle = col; g.beginPath(); g.moveTo(x0 + nx * w0 / 2, y0 + ny * w0 / 2); g.lineTo(x1 + nx * w1 / 2, y1 + ny * w1 / 2); g.lineTo(x1 - nx * w1 / 2, y1 - ny * w1 / 2); g.lineTo(x0 - nx * w0 / 2, y0 - ny * w0 / 2); g.closePath(); g.fill();
  E(g, x0, y0, w0 / 2, w0 / 2, 0, col); E(g, x1, y1, w1 / 2, w1 / 2, 0, col);
  if (shade) { g.strokeStyle = shade; g.lineWidth = Math.max(3, w1 * 0.28); g.lineCap = 'round'; g.beginPath(); g.moveTo(x0 + nx * w0 * 0.32, y0 + ny * w0 * 0.32); g.lineTo(x1 + nx * w1 * 0.32, y1 + ny * w1 * 0.32); g.stroke(); }
}

// ---------- HQ text (crisp, after pixelation) ----------
function sfx(g, text, x, y, size, rot, k = 1, fill = ['#fff35a', '#ff8a1e'], shadow = '#d8343c') {
  if (k <= 0) return; g.save(); g.translate(x, y); g.rotate(rot); const sc = 0.4 + 0.6 * back(k); g.scale(sc, sc); g.globalAlpha = clamp(k * 3);
  g.font = `${size}px PS2P`; g.textBaseline = 'middle'; g.textAlign = 'center'; g.lineJoin = 'miter';
  const chars = [...text], cw = size * 0.92, x0 = -chars.length * cw / 2 + cw / 2;
  chars.forEach((ch, i) => { const jy = Math.sin(i * 1.7) * size * 0.12, jr = Math.sin(i * 2.3) * 0.08; g.save(); g.translate(x0 + i * cw, jy); g.rotate(jr);
    g.fillStyle = '#111'; g.fillText(ch, size * 0.12, size * 0.12); g.fillStyle = shadow; g.fillText(ch, size * 0.07, size * 0.07);
    g.lineWidth = size * 0.2; g.strokeStyle = '#111'; g.strokeText(ch, 0, 0); const gr = g.createLinearGradient(0, -size / 2, 0, size / 2); gr.addColorStop(0, fill[0]); gr.addColorStop(1, fill[1]); g.fillStyle = gr; g.fillText(ch, 0, 0); g.restore(); });
  g.restore();
}
function balloon(g, k, cx, cy, w, h, tx, ty, draw, thought = false) {
  if (k <= 0) return; const s = 0.3 + 0.7 * back(k); g.save(); g.globalAlpha = clamp(k * 3); g.translate(cx, cy); g.scale(s, s); g.translate(-cx, -cy);
  g.lineWidth = 7; g.strokeStyle = '#111'; g.fillStyle = '#fff';
  if (thought) { const d = [[tx, ty, 10], [(tx * 2 + cx) / 3, (ty * 2 + cy) / 3 + h * 0.1, 17], [(tx + cx * 2) / 3, (ty + cy * 2) / 3 + h * 0.15, 26]]; for (const [x, y, r] of d) { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.stroke(); }
    const bumps = 12; g.beginPath(); for (let i = 0; i < bumps; i++) { const a = i / bumps * Math.PI * 2; g.moveTo(cx + Math.cos(a) * w / 2 + 34, cy + Math.sin(a) * h / 2); g.arc(cx + Math.cos(a) * w / 2, cy + Math.sin(a) * h / 2, 34, 0, 7); } g.stroke(); g.beginPath(); for (let i = 0; i < bumps; i++) { const a = i / bumps * Math.PI * 2; g.moveTo(cx + Math.cos(a) * w / 2 + 32, cy + Math.sin(a) * h / 2); g.arc(cx + Math.cos(a) * w / 2, cy + Math.sin(a) * h / 2, 32, 0, 7); } g.fill(); g.beginPath(); g.ellipse(cx, cy, w / 2, h / 2, 0, 0, 7); g.fill(); }
  else { const tail = () => { g.beginPath(); g.moveTo(cx - w * 0.12, cy + h * 0.3); g.lineTo(tx, ty); g.lineTo(cx + w * 0.08, cy + h * 0.36); g.closePath(); }; tail(); g.stroke(); g.beginPath(); g.ellipse(cx, cy, w / 2, h / 2, 0, 0, 7); g.stroke(); tail(); g.fill(); g.beginPath(); g.ellipse(cx, cy, w / 2, h / 2, 0, 0, 7); g.fill(); }
  draw(); g.restore();
}
function speech(g, k, cx, cy, tx, ty, lines, size = 54, thought = false) {
  g.save(); g.font = `${size}px Bangers`; const w = Math.max(...lines.map((l) => g.measureText(l).width)) + 120, h = lines.length * size * 1.1 + 80; g.restore();
  balloon(g, k, cx, cy, w, h, tx, ty, () => { g.fillStyle = '#111'; g.font = `${size}px Bangers`; g.textAlign = 'center'; g.textBaseline = 'middle'; lines.forEach((l, i) => g.fillText(l, cx, cy + (i - (lines.length - 1) / 2) * size * 1.1 + 3)); }, thought);
}
const ICONS = { bread: ['..XXXX..', '.XXXXXX.', 'XXOXXOXX', 'XXXXXXXX', 'XOXXOXXX', '.XXXXXX.'], q: ['.XXXX.', 'XX..XX', '....XX', '..XXX.', '..XX..', '......', '..XX..'] };
function icon(g, k, cx, cy, tx, ty, name) {
  balloon(g, k, cx, cy, 190, 150, tx, ty, () => { const rows = ICONS[name], sz = 13, w = rows[0].length, h = rows.length; rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch === '.') return; g.fillStyle = name === 'bread' ? (ch === 'O' ? '#ffe0a8' : '#c47a30') : '#d8343c'; g.fillRect(cx + (i - w / 2) * sz, cy + (j - h / 2) * sz, sz, sz); })); });
}
function captionAt(g, t, t0, x, y, text) { const k = easeOut((t - t0) / 0.35); if (k <= 0) return; g.save(); g.globalAlpha = k; g.translate(0, (1 - k) * 16); caption_(g, x, y, text, 46); g.restore(); }
function shade(hex, k) { const n = parseInt(hex.slice(1), 16); const r = Math.round(((n >> 16) & 255) * k), g = Math.round(((n >> 8) & 255) * k), b = Math.round((n & 255) * k); return `rgb(${r},${g},${b})`; }

// ---------- Otávio (~30), side view walking right, anime style ----------
const OT = { skin: '#f0c4a0', skinS: '#d39a78', hair: '#2a2024', hairL: '#4e3e44', coat: '#d8bf94', coatS: '#b69c70', coatD: '#8c7450', pants: '#2a3150', pantsS: '#1c2238', shoe: '#5a3a22', scarf: '#b8343a', scarfS: '#86242c', pack: '#6d727c', packS: '#4d515a', iris: '#3a2a20' };
function otHead(g, hx, hy, headDown, { smile = 0, spikes = 1, wide = 0, laugh = 0 } = {}) {
  g.save(); g.translate(hx, hy); g.rotate(headDown);
  E(g, 2, 40, 26, 30, 0, OT.skinS); // neck
  E(g, 0, -10, 70, 80, 0, OT.skin); E(g, -30, 0, 40, 60, 0, OT.skinS); E(g, -22, -6, 40, 60, 0, OT.skin);
  g.fillStyle = OT.skin; g.beginPath(); g.moveTo(40, 10); g.quadraticCurveTo(70, 40, 40, 72); g.lineTo(0, 74); g.closePath(); g.fill(); // jaw
  E(g, -44, -6, 14, 20, 0, OT.skinS); // ear
  // stubble
  g.fillStyle = 'rgba(60,50,60,0.25)'; g.beginPath(); g.moveTo(-10, 30); g.quadraticCurveTo(30, 82, 62, 40); g.quadraticCurveTo(40, 70, -6, 56); g.closePath(); g.fill();
  // hair: messy dark
  g.fillStyle = OT.hair; g.beginPath(); g.moveTo(-74, 0); g.quadraticCurveTo(-90, -90, 0, -100); g.quadraticCurveTo(70, -104, 82, -30);
  for (let k = 0; k < 6; k++) { const bx = 80 - k * 24; g.lineTo(bx - 8, -10 + (k % 2) * 20); g.lineTo(bx - 20, -36); } g.lineTo(-40, -30); g.lineTo(-54, 8); g.closePath(); g.fill();
  for (const [ax, ay, bx, by] of [[-30, -96, -50, -118], [10, -100, 6, -122], [40, -96, 56, -114]]) { g.beginPath(); g.moveTo(ax - 14, ay + 6); g.lineTo(ax + (bx - ax) * spikes, ay + (by - ay) * spikes); g.lineTo(ax + 14, ay + 4); g.closePath(); g.fill(); }
  g.strokeStyle = OT.hairL; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.arc(-4, -30, 60, Math.PI * 1.2, Math.PI * 1.5); g.stroke();
  // tired eye (adult anime): half-lidded
  const EX = 36, EY = 2;
  if (laugh > 0.5) { g.strokeStyle = '#1a0e0a'; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.moveTo(EX - 18, EY + 6); g.quadraticCurveTo(EX, EY - 14, EX + 20, EY + 4); g.stroke(); g.strokeStyle = 'rgba(120,70,60,0.5)'; g.lineWidth = 3; g.beginPath(); g.moveTo(EX + 14, EY + 14); g.lineTo(EX + 24, EY + 8); g.stroke(); E(g, EX + 6, EY + 26, 16, 7, 0, 'rgba(255,110,110,0.35)'); } else {
  E(g, EX, EY, 16, 14, 0, '#ffffff'); const ir = g.createLinearGradient(0, EY - 12, 0, EY + 12); ir.addColorStop(0, '#120806'); ir.addColorStop(1, OT.iris); E(g, EX + 3, EY + 2, 10, 12, 0, ir); E(g, EX + 3, EY + 3, 5, 6, 0, '#050202'); E(g, EX - 1, EY - 3, 3, 3, 0, '#ffffff');
  if (!wide) { g.fillStyle = OT.skinS; g.beginPath(); g.ellipse(EX, EY - 12, 20, 11, 0, Math.PI, 0); g.fill(); } // heavy lid
  g.strokeStyle = '#1a0e0a'; g.lineWidth = 5; g.beginPath(); g.moveTo(EX - 18, EY - 6); g.quadraticCurveTo(EX, EY - 14, EX + 20, EY - 4); g.stroke();
  g.strokeStyle = 'rgba(120,70,60,0.5)'; g.lineWidth = 2; g.beginPath(); g.moveTo(EX - 12, EY + 14); g.quadraticCurveTo(EX, EY + 18, EX + 12, EY + 13); g.stroke(); // eye bag
  }
  g.strokeStyle = OT.hair; g.lineWidth = 6; g.beginPath(); const bw = Math.max(wide, laugh * 0.8); g.moveTo(EX - 20, EY - 26 - bw * 10); g.quadraticCurveTo(EX, EY - 30 - bw * 14, EX + 22, EY - 22 - bw * 10); g.stroke();
  g.strokeStyle = OT.skinS; g.lineWidth = 4; g.beginPath(); g.moveTo(66, 4); g.lineTo(74, 26); g.lineTo(62, 30); g.stroke(); // nose
  if (laugh > 0) { const o = laugh; g.fillStyle = '#5a1a1a'; g.beginPath(); g.moveTo(36, 42); g.quadraticCurveTo(54, 40, 70, 36); g.quadraticCurveTo(66, 42 + 36 * o, 44, 44 + 30 * o); g.closePath(); g.fill(); g.fillStyle = '#ffffff'; g.beginPath(); g.moveTo(38, 42); g.quadraticCurveTo(54, 40, 68, 37); g.lineTo(66, 43); g.quadraticCurveTo(52, 46, 40, 47); g.closePath(); g.fill(); E(g, 52, 44 + 26 * o, 10, 6 * o, 0, '#e86a7a'); } else { g.strokeStyle = '#8a4a40'; g.lineWidth = 4; g.beginPath(); g.moveTo(44, 50); g.quadraticCurveTo(54, 50 + smile * 8, 62, 46 - smile * 4); g.stroke(); } // mouth
  g.restore();
}
function otavio(g, x, y, s, ph, headDown = 0.35, { lean = 0, armUp = 0, smile = 0, hop = 0, spikes = 1, wide = 0, laugh = 0, belly = 0 } = {}) {
  const F = 1, bob = -Math.abs(Math.cos(ph)) * 7;
  g.save(); g.translate(x, y + bob); g.scale(s, s);
  E(g, 0, 8 - bob / s, 120, 14, 0, 'rgba(60,30,10,0.25)');
  g.translate(0, -hop); g.rotate(-lean);
  const HIP = [0, -400], SHO = [4, -650];
  const leg = (p, far) => { const th = 0.38 * Math.sin(p), knee = 0.08 + 0.75 * Math.max(0, Math.cos(p)) ** 1.6, sh = th - knee, T = 205, S = 195;
    const kx = HIP[0] + F * Math.sin(th) * T, ky = HIP[1] + Math.cos(th) * T, ax = kx + F * Math.sin(sh) * S, ay = ky + Math.cos(sh) * S;
    limb(g, HIP[0], HIP[1], kx, ky, 58, 50, far ? OT.pantsS : OT.pants, far ? null : OT.pantsS); limb(g, kx, ky, ax, ay, 50, 42, far ? OT.pantsS : OT.pants, far ? null : OT.pantsS);
    g.save(); g.translate(ax, ay + 6); g.rotate(-sh * 0.4 + (Math.cos(p) > 0.3 ? -0.2 : 0)); g.fillStyle = far ? '#3e2816' : OT.shoe; g.beginPath(); g.roundRect(-26, -16, 86, 30, 14); g.fill(); g.fillStyle = '#2a1a10'; g.fillRect(-26, 8, 86, 7); g.restore(); };
  const arm = (p, far) => { const ua = -0.32 * Math.sin(p) * (1 - armUp) + armUp * (far ? 0.9 : 1.35) + belly * (far ? 0.05 : 0.08), fa = ua + (0.25 + 0.15 * Math.cos(p)) * (1 - armUp) + armUp * 0.5 + belly * 0.6, U = 150, Fa = 140;
    const ex = SHO[0] + F * Math.sin(ua) * U, ey = SHO[1] + Math.cos(ua) * U, hx = ex + F * Math.sin(fa) * Fa, hy = ey + Math.cos(fa) * Fa;
    limb(g, SHO[0], SHO[1], ex, ey, 56, 50, far ? OT.coatS : OT.coat, far ? null : OT.coatS); limb(g, ex, ey, hx, hy, 50, 44, far ? OT.coatS : OT.coat, far ? null : OT.coatS); E(g, hx + 4, hy + 18, 20, 26, 0, far ? OT.skinS : OT.skin); };
  arm(ph + Math.PI, true); leg(ph + Math.PI, true);
  // backpack on the back (left)
  g.fillStyle = OT.pack; g.beginPath(); g.roundRect(-120, -690, 92, 210, 24); g.fill(); g.fillStyle = OT.packS; g.beginPath(); g.roundRect(-120, -560, 92, 70, 18); g.fill(); g.fillStyle = 'rgba(255,255,255,0.2)'; g.fillRect(-112, -680, 10, 180);
  leg(ph, false);
  // long coat: body + swaying hem
  const sway = Math.sin(ph) * 14;
  g.fillStyle = OT.coat; g.beginPath(); g.moveTo(-62, -690); g.quadraticCurveTo(4, -706, 66, -690); g.lineTo(82 + sway, -300); g.quadraticCurveTo(0, -284, -86 + sway, -300); g.closePath(); g.fill();
  g.fillStyle = OT.coatS; g.beginPath(); g.moveTo(-62, -690); g.lineTo(-30, -690); g.lineTo(-48 + sway, -296); g.lineTo(-86 + sway, -300); g.closePath(); g.fill();
  g.strokeStyle = OT.coatD; g.lineWidth = 4; g.beginPath(); g.moveTo(40, -640); g.lineTo(56 + sway, -300); g.stroke();
  g.fillStyle = OT.coatD; g.fillRect(-80, -470, 160, 14); g.fillStyle = '#c8b080'; g.fillRect(30, -472, 18, 18);
  g.fillStyle = OT.coatS; g.fillRect(-10, -420, 50, 6); for (const yy of [-620, -560, -510]) E(g, 46, yy, 6, 6, 0, OT.coatD);
  // collar + scarf (tail flutters)
  g.fillStyle = OT.coat; g.beginPath(); g.moveTo(-40, -700); g.lineTo(46, -700); g.lineTo(60, -660); g.lineTo(-52, -660); g.closePath(); g.fill();
  g.fillStyle = OT.scarf; g.beginPath(); g.roundRect(-46, -722, 96, 40, 18); g.fill(); g.fillStyle = OT.scarfS; g.fillRect(-46, -694, 96, 10);
  const fl = Math.sin(ph * 2) * 10; g.fillStyle = OT.scarf; g.beginPath(); g.moveTo(-40, -700); g.quadraticCurveTo(-110, -690 + fl, -150, -660 + fl); g.lineTo(-136, -640 + fl); g.quadraticCurveTo(-100, -672, -34, -680); g.closePath(); g.fill();
  otHead(g, 14, -790, headDown, { smile, spikes, wide, laugh });
  arm(ph, false);
  g.restore();
}
window.otSheet = () => { const [c, gg] = off(); gg.fillStyle = '#e8b888'; gg.fillRect(0, 0, W, H); for (let i = 0; i < 6; i++) otavio(gg, 180 + i * 310, 980, 1.05, i * Math.PI / 3); ctx.drawImage(c, 0, 0); };

// ---------- Caramelo standing / trotting (side view, facing right) ----------
const DF = { c: '#d68a3a', l: '#f0b265', s: '#a8601f', w: '#f6efe4', ws: '#d8cec2' };
function dogTrot(g, x, y, s, ph, moving = 1, { pal = DF, happy = 0, headUp = 0, legsOut = 0, tuck = 0 } = {}) {
  const DF = pal;
  g.save(); g.translate(x, y - Math.abs(Math.sin(ph)) * 6 * moving); g.scale(s, s);
  E(g, 0, 6, 150, 14, 0, 'rgba(60,30,10,0.25)');
  const leg = (hx, hy, p, far, back) => { const a = 0.45 * Math.sin(p) * moving + legsOut * (back ? -1.0 : 1.0) * (1 - tuck) + tuck * (back ? 0.6 : -0.6), kb = (back ? -1 : 1) * (0.1 + 0.55 * Math.max(0, Math.cos(p)) * moving); const kx = hx + Math.sin(a) * 70, ky = hy + Math.cos(a) * 70, px = kx + Math.sin(a + kb) * 66, py = ky + Math.cos(a + kb) * 66;
    limb(g, hx, hy, kx, ky, 34, 26, far ? DF.s : DF.c, far ? null : DF.s); limb(g, kx, ky, px, py, 26, 22, far ? DF.s : DF.c); limb(g, kx + (px - kx) * 0.5, ky + (py - ky) * 0.5, px, py, 24, 22, far ? DF.ws : DF.w); E(g, px + 8, py + 4, 18, 10, 0, far ? DF.ws : DF.w); };
  leg(80, -150, ph + 0.6, true, false); leg(-90, -150, ph + Math.PI + 0.6, true, true);
  const wag = Math.sin(ph * 2) * 0.4; g.lineCap = 'round'; g.strokeStyle = DF.c; g.lineWidth = 24; g.beginPath(); g.moveTo(-130, -180); g.quadraticCurveTo(-180, -230 + wag * 40, -170, -280 + wag * 30); g.stroke(); E(g, -170, -284 + wag * 30, 14, 14, 0, DF.w);
  const bg = g.createLinearGradient(0, -240, 0, -120); bg.addColorStop(0, DF.l); bg.addColorStop(1, DF.s); E(g, -10, -180, 140, 56, -0.03, bg); E(g, 80, -186, 66, 64, 0, bg);
  E(g, 100, -160, 40, 44, 0, DF.w);
  leg(80, -150, ph, false, false); leg(-90, -150, ph + Math.PI, false, true);
  // head
  g.save(); g.translate(150, -250); g.rotate(-0.1 - headUp + 0.04 * Math.sin(ph * 2));
  g.fillStyle = DF.s; g.beginPath(); g.moveTo(-30, -24); g.quadraticCurveTo(-60, -6, -50, 30); g.quadraticCurveTo(-36, 6, -16, -6); g.closePath(); g.fill();
  const hg = g.createRadialGradient(-10, -20, 6, 0, 0, 60); hg.addColorStop(0, DF.l); hg.addColorStop(1, DF.c); E(g, 0, 0, 52, 46, 0, hg);
  g.fillStyle = DF.c; g.beginPath(); g.moveTo(-6, -36); g.lineTo(8, -92); g.lineTo(28, -32); g.closePath(); g.fill(); g.fillStyle = '#f2a0a8'; g.beginPath(); g.moveTo(2, -38); g.lineTo(9, -74); g.lineTo(21, -36); g.closePath(); g.fill();
  E(g, 44, 14, 38, 22, 0.1, DF.w); E(g, 78, 6, 9, 7, 0, '#1a0e0a');
  if (happy) { g.strokeStyle = '#1a0a04'; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.arc(16, 0, 11, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); E(g, 54, 34, 20, 13, 0.1, '#3a1010'); E(g, 52, 44, 11, 11, 0, '#ff7a8a'); } else { E(g, 16, -6, 11, 14, 0, '#1a0a04'); E(g, 17, -4, 8, 10, 0, '#8a4a1a'); E(g, 18, -3, 4, 5, 0, '#050202'); E(g, 13, -10, 4, 4, 0, '#ffffff'); }
  E(g, 26, 16, 9, 4, 0, 'rgba(255,120,140,0.4)');
  g.restore();
  // fur texture
  g.save(); g.globalAlpha = 0.35; const fr = rng(41); g.strokeStyle = DF.l; g.lineWidth = 2; for (let k = 0; k < 120; k++) { const fx = -140 + fr() * 260, fy = -230 + fr() * 90; g.beginPath(); g.moveTo(fx, fy); g.lineTo(fx - 12, fy + 4); g.stroke(); } g.restore();
  g.restore();
}

// ---------- side-view street (reused from scene 3) ----------
const SW = W * 5, GROUND = 860;
function sideStreet(seed = 31) {
  const [c, g] = off(SW, H * 2); const r = rng(seed); g.translate(0, H / 2);
  const sk = g.createLinearGradient(0, -H / 2, 0, GROUND); sk.addColorStop(0, '#7fb2e8'); sk.addColorStop(0.6, '#f6d3a8'); sk.addColorStop(1, '#ffc48a'); g.fillStyle = sk; g.fillRect(0, -H / 2, SW, H * 2);
  { const [cc, cg] = off(SW, H); cg.filter = 'blur(18px)'; for (let k = 0; k < 30; k++) { const x = r() * SW, y = 60 + r() * 260; cg.fillStyle = 'rgba(255,250,240,0.7)'; for (let j = 0; j < 4; j++) { cg.beginPath(); cg.ellipse(x + j * 70, y + (j % 2) * 14, 110, 34, 0, 0, 7); cg.fill(); } } g.drawImage(cc, 0, 0); }
  for (let x = 0; x < SW;) { const w = 90 + r() * 160, h = 200 + r() * 260; g.fillStyle = '#a7b4cf'; g.fillRect(x, GROUND - 300 - h, w, h + 300); for (let y = GROUND - 280 - h; y < GROUND - 300; y += 26) for (let xx = x + 12; xx < x + w - 16; xx += 24) { g.fillStyle = r() > 0.5 ? '#c3cde0' : '#93a1c0'; g.fillRect(xx, y, 12, 14); } x += w + 6; }
  const fog = g.createLinearGradient(0, GROUND - 560, 0, GROUND - 200); fog.addColorStop(0, 'rgba(255,220,180,0)'); fog.addColorStop(1, 'rgba(255,214,170,0.6)'); g.fillStyle = fog; g.fillRect(0, GROUND - 560, SW, 360);
  const cols = ['#f28c9a', '#f5cf5b', '#5fc4b8', '#b79ce0', '#f3a65a', '#86c97e', '#7fb2e8', '#e9dcc0'];
  for (let x = -20, i = 0; x < SW; i++) {
    const w = 300 + r() * 160, h = 380 + Math.floor(r() * 2) * 150, top = GROUND - 40 - h, col = cols[(i * 3) % cols.length];
    const fg = g.createLinearGradient(x, 0, x + w, 0); fg.addColorStop(0, col); fg.addColorStop(1, shade(col, 0.82)); g.fillStyle = fg; g.fillRect(x, top, w, h + 40);
    g.fillStyle = '#f4ead6'; g.fillRect(x - 6, top - 14, w + 12, 18); g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(x - 6, top + 4, w + 12, 6);
    if (r() < 0.5) { g.fillStyle = '#c0472f'; for (let k = 0; k < w; k += 16) { g.fillRect(x + k, top - 34, 14, 22); } }
    for (let fy = top + 40; fy < GROUND - 200; fy += 150) for (let k = 0; k < Math.floor(w / 110); k++) {
      const wx = x + 30 + k * 110; g.fillStyle = '#f4ead6'; g.fillRect(wx - 8, fy - 8, 76, 104); g.fillStyle = '#3d6fa8'; g.fillRect(wx, fy, 60, 88);
      g.fillStyle = '#a8d4f6'; g.fillRect(wx + 6, fy + 6, 12, 4); g.fillStyle = '#f4ead6'; g.fillRect(wx + 28, fy, 4, 88); g.fillRect(wx, fy + 42, 60, 4);
      if (r() < 0.5) { g.fillStyle = '#2f7d4f'; g.fillRect(wx - 26, fy - 6, 18, 100); g.fillRect(wx + 68, fy - 6, 18, 100); }
      if (r() < 0.5) { g.fillStyle = '#6b3f22'; g.fillRect(wx - 6, fy + 92, 72, 12); for (let p = 0; p < 7; p++) { g.fillStyle = r() > 0.4 ? '#3f9a48' : '#e8404a'; g.beginPath(); g.arc(wx + p * 10, fy + 90, 7, 0, 7); g.fill(); } }
    }
    const dx = x + 40 + r() * (w - 160); g.fillStyle = '#7a4a2a'; g.fillRect(dx, GROUND - 200, 70, 160); g.fillStyle = '#9a6238'; g.fillRect(dx + 8, GROUND - 190, 54, 60); g.fillRect(dx + 8, GROUND - 122, 54, 72); g.fillStyle = '#e8c35a'; g.fillRect(dx + 56, GROUND - 120, 5, 8);
    x += w; }
  // poles + wires
  const poles = []; for (let x = 200; x < SW; x += 820) { g.fillStyle = '#8d8a84'; g.fillRect(x, GROUND - 700, 16, 700); g.fillRect(x - 50, GROUND - 690, 116, 10); poles.push(x + 8); }
  g.strokeStyle = 'rgba(40,30,40,0.8)'; g.lineWidth = 2; for (let k = 0; k < poles.length - 1; k++) for (const dy of [0, 16, 32]) { g.beginPath(); for (let u = 0; u <= 30; u++) { const x = poles[k] + (poles[k + 1] - poles[k]) * u / 30, y = GROUND - 686 + dy + Math.sin(u / 30 * Math.PI) * 60; u ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
  // sidewalk (pedra portuguesa) + curb + road
  g.fillStyle = '#ece4d2'; g.fillRect(0, GROUND - 40, SW, 120); g.strokeStyle = '#2a2630'; g.lineWidth = 10; g.beginPath(); for (let x = 0; x <= SW; x += 6) { const y = GROUND + 12 + Math.sin(x / 70) * 18; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
  g.fillStyle = '#b8b2a4'; g.fillRect(0, GROUND + 80, SW, 16); g.fillStyle = '#4a4c57'; g.fillRect(0, GROUND + 96, SW, H * 2);
  for (let x = 40; x < SW; x += 200) { g.fillStyle = '#e8d98a'; g.fillRect(x, GROUND + 170, 110, 10); }
  // sun from the left
  g.save(); g.globalCompositeOperation = 'soft-light'; const sl = g.createLinearGradient(0, 0, SW, 0); sl.addColorStop(0, 'rgba(255,200,120,0.6)'); sl.addColorStop(1, 'rgba(255,170,120,0.2)'); g.fillStyle = sl; g.fillRect(0, -H / 2, SW, H * 2); g.restore();
  return c;
}



// ================= Scene 6 "A risada" =================
const layer = (fn, w = W, h = H) => { const [c, g] = off(w, h); fn(g); return c; };
const sunset = (g, a = 0.25) => { g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = `rgba(255,120,90,${a})`; g.fillRect(0, 0, W, H); g.restore(); };
const MUDMAP = { '#7a400f': '#3e2a14', '#a8601f': '#4a3018', '#cf8436': '#6e4a28', '#eaa555': '#806040', '#ffd08a': '#8e6a40', '#f6c07a': '#8e6a40', '#d68a3a': '#6e4a28', '#8f4f1a': '#3e2a14', '#b8722e': '#5a3c20', '#c47a30': '#5e4020', '#f6efe4': '#9a8262', '#f2a0a8': '#a07868', 'rgba(255,240,190,0.55)': 'rgba(255,170,130,0.5)' };
const dogSitMud = eval('(' + Object.entries(MUDMAP).reduce((src, [a, b]) => src.split(a).join(b), dogSit.toString()) + ')');
const DOG = dogSit(0), DOGB = dogSit(1), DOGM = dogSitMud(0), DOGMB = dogSitMud(1);
// sunset street, blurred, as a backdrop
const STREETS = sideStreet(53);
function backdrop(camX, z, gy, blur) { return layer((g) => { g.fillStyle = '#ff9a8a'; g.fillRect(0, 0, W, H); g.save(); g.translate(W / 2, gy); g.scale(z, z); g.translate(-camX, -GROUND); g.filter = `blur(${blur}px)`; g.drawImage(STREETS, 0, -H / 2); g.restore(); g.save(); g.globalCompositeOperation = 'soft-light'; const sl = g.createLinearGradient(0, 0, 0, H); sl.addColorStop(0, 'rgba(255,90,150,0.9)'); sl.addColorStop(0.6, 'rgba(255,150,80,0.8)'); sl.addColorStop(1, 'rgba(120,60,140,0.6)'); g.fillStyle = sl; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'multiply'; g.fillStyle = '#ffd0bc'; g.fillRect(0, 0, W, H); g.restore(); glow(g, 1700, 200, 700, 'rgba(255,200,140,0.8)', 0.6); }); }
const BG1 = backdrop(5200, 2.2, 1500, 14);
const BG2 = backdrop(6400, 1.6, 1240, 10);

// ---------- shot 1: the laugh ----------
const HA = [...'HAHAHAHA!'];
function shot1(t) {
  ctx.drawImage(BG1, 0, 0);
  const k = t - B.burst, burst = k > 0;
  const shake = burst ? Math.sin(t * 34) * 7 * Math.exp(-Math.max(0, k - 2.5) * 0.6) : 0, back2 = burst ? easeOut(k / 0.3) : 0;
  const twitch = !burst ? (t > B.hold ? 0.3 + 0.35 * Math.abs(Math.sin(t * 19)) : 0.2) : 0;
  ctx.save(); ctx.translate(0, shake);
  otavio(ctx, 600, 1880 + back2 * 30, 1.9, Math.PI, 0.12 - back2 * 0.42 + (burst ? Math.sin(t * 17) * 0.04 : 0), { wide: burst ? 0 : 1, smile: twitch, laugh: burst ? 1 : 0, spikes: 0.5, belly: back2 });
  ctx.restore();
  // a tear of laughter
  if (k > 1.2) { const tk = clamp((k - 1.2) / 2), x = 600 + 14 * 1.9 + 60, y = 1880 - 790 * 1.9 + 10 + tk * 60; E(ctx, x, y, 10, 14, 0, 'rgba(190,230,255,0.85)'); E(ctx, x - 3, y - 4, 3, 4, 0, '#fff'); }
  sunset(ctx, 0.2); bloom(ctx, 0.2, 24); grade(ctx, { vig: 0.5, seed: 61 });
}
function haLayer(t) {
  HA.forEach((ch, i) => { const k = (t - B.ha - i * 0.11) / 0.18; if (k <= 0) return; const row = i < 4 ? 0 : 1, j = row ? i - 4 : i, sz = 130 + (i % 3) * 22 + row * 20, x = 1000 + row * -60 + j * 175, y = 250 + row * 300 + Math.sin(i * 1.9) * 40 + Math.sin(t * 20 + i) * 6, rot = Math.sin(i * 2.7) * 0.3 + Math.sin(t * 14 + i) * 0.04;
    sfx(ctx, ch, x, y, sz, rot, k, ['#fff35a', '#ff8a1e'], '#d8343c'); });
}

// ---------- shots 2–3: kneeling, drying the snout with the scarf ----------
const GY = 1000, MS = 1.15, MX = 860, DXS = 1360, DSS = 1.0;
function ik(sx, sy, tx, ty, U, F, up = 1) { const dx = tx - sx, dy = ty - sy, d = Math.min(Math.hypot(dx, dy), U + F - 1), a = Math.atan2(dy, dx), c = Math.acos(clamp((U * U + d * d - F * F) / (2 * U * d), -1, 1)); const ea = a + c * up; const ex = sx + Math.cos(ea) * U, ey = sy + Math.sin(ea) * U, ha = Math.atan2(ty - ey, tx - ex); return [ex, ey, ex + Math.cos(ha) * F, ey + Math.sin(ha) * F]; }
function kneel(g, x, y, s, { lean = 0.32, headDown = 0.35, smile = 0.8, laugh = 0, hands = [[300, -260], [320, -230]], mud = 0, t = 0 } = {}) {
  g.save(); g.translate(x, y); g.scale(s, s);
  E(g, 30, 6, 260, 16, 0, 'rgba(60,20,30,0.3)');
  const HIP = [-20, -225];
  // far (front) leg: foot flat forward, shin vertical, thigh to hip
  const legF = (far) => { const ky = -195, kx = 150, col = far ? OT.pantsS : OT.pants; limb(g, HIP[0], HIP[1], kx, ky, 60, 52, col, far ? null : OT.pantsS); limb(g, kx, ky, kx + 10, -14, 52, 44, col, far ? null : OT.pantsS); g.fillStyle = far ? '#3e2816' : OT.shoe; g.beginPath(); g.roundRect(kx - 20, -30, 96, 32, 14); g.fill(); g.fillStyle = '#2a1a10'; g.fillRect(kx - 20, -6, 96, 7); };
  // rear leg: knee on the ground, shin back along the ground, toes tucked
  const legR = (far) => { const col = far ? OT.pantsS : OT.pants; limb(g, HIP[0], HIP[1], -50, -26, 60, 52, col, far ? null : OT.pantsS); limb(g, -50, -26, -250, -24, 50, 44, col, far ? null : OT.pantsS); g.save(); g.translate(-262, -30); g.rotate(-1.2); g.fillStyle = far ? '#3e2816' : OT.shoe; g.beginPath(); g.roundRect(-20, -16, 86, 30, 14); g.fill(); g.restore(); };
  legF(true); legR(false);
  // torso frame
  g.save(); g.translate(HIP[0], HIP[1]); g.rotate(lean);
  const toLocal = ([px, py]) => { const dx = px - HIP[0], dy = py - HIP[1], c = Math.cos(-lean), sn = Math.sin(-lean); return [dx * c - dy * sn, dx * sn + dy * c]; };
  const SHO = [4, -250];
  const armDraw = (tgt, far) => { const [tx, ty] = toLocal(tgt); const [ex, ey, hx, hy] = ik(SHO[0], SHO[1], tx, ty, 150, 140, -1); const c1 = far ? OT.coatS : OT.coat; limb(g, SHO[0], SHO[1], ex, ey, 56, 50, c1, far ? null : OT.coatS); limb(g, ex, ey, hx, hy, 50, 44, c1, far ? null : OT.coatS); E(g, hx, hy, 24, 22, 0, far ? OT.skinS : OT.skin); return [hx, hy]; };
  const hFar = armDraw(hands[1], true);
  // backpack
  g.fillStyle = OT.pack; g.beginPath(); g.roundRect(-120, -290, 92, 210, 24); g.fill(); g.fillStyle = OT.packS; g.beginPath(); g.roundRect(-120, -160, 92, 70, 18); g.fill();
  // coat: torso + skirt pooling over the thighs
  g.fillStyle = OT.coat; g.beginPath(); g.moveTo(-62, -290); g.quadraticCurveTo(4, -306, 66, -290); g.lineTo(90, 30); g.quadraticCurveTo(0, 50, -90, 20); g.closePath(); g.fill();
  g.fillStyle = OT.coatS; g.beginPath(); g.moveTo(-62, -290); g.lineTo(-30, -290); g.lineTo(-50, 26); g.lineTo(-90, 20); g.closePath(); g.fill();
  g.strokeStyle = OT.coatD; g.lineWidth = 4; g.beginPath(); g.moveTo(40, -240); g.lineTo(60, 30); g.stroke();
  g.fillStyle = OT.coatD; g.fillRect(-80, -70, 160, 14); for (const yy of [-220, -160, -110]) E(g, 46, yy, 6, 6, 0, OT.coatD);
  g.fillStyle = OT.coat; g.beginPath(); g.moveTo(-40, -300); g.lineTo(46, -300); g.lineTo(60, -260); g.lineTo(-52, -260); g.closePath(); g.fill();
  g.fillStyle = OT.scarf; g.beginPath(); g.roundRect(-46, -322, 96, 40, 18); g.fill(); g.fillStyle = OT.scarfS; g.fillRect(-46, -294, 96, 10);
  otHead(g, 14, -390, headDown - lean * 0.6, { smile, laugh, spikes: 0.6 });
  g.restore();
  legF(false);
  // scarf tail from the collar down to the hands (in kneel coords)
  const c = Math.cos(lean), sn = Math.sin(lean), fromT = ([px, py]) => [HIP[0] + px * c - py * sn, HIP[1] + px * sn + py * c];
  const col = fromT([30, -300]);
  g.save(); g.translate(HIP[0], HIP[1]); g.rotate(lean); const hN = (() => { const [tx, ty] = toLocal(hands[0]); return ik(SHO[0], SHO[1], tx, ty, 150, 140, -1).slice(2); })(); g.restore();
  const hW = fromT(hN), hF = fromT(hFar), mid = [(hW[0] + hF[0]) / 2, (hW[1] + hF[1]) / 2];
  g.lineCap = 'round'; g.strokeStyle = OT.scarfS; g.lineWidth = 46; g.beginPath(); g.moveTo(col[0], col[1]); g.quadraticCurveTo(col[0] + 40, mid[1] + 60, mid[0], mid[1]); g.stroke(); g.strokeStyle = OT.scarf; g.lineWidth = 34; g.stroke();
  // bunched cloth in the hands, with mud smudges
  g.save(); g.translate(mid[0], mid[1]); g.rotate(Math.sin(t * 9) * 0.15); E(g, 0, 0, 56, 40, 0.2, OT.scarf); g.strokeStyle = OT.scarfS; g.lineWidth = 6; for (const [a, b2] of [[-40, -14], [-14, 8], [6, -20]]) { g.beginPath(); g.moveTo(a, b2); g.quadraticCurveTo(a + 20, b2 + 14, a + 40, b2 - 4); g.stroke(); }
  const mr = rng(6601); for (let k = 0; k < Math.floor(mud * 14); k++) E(g, -50 + mr() * 100, -30 + mr() * 60, 10 + mr() * 12, 7 + mr() * 8, mr() * 3, 'rgba(90,60,30,0.8)');
  g.restore();
  // near arm on top of the cloth
  g.save(); g.translate(HIP[0], HIP[1]); g.rotate(lean); armDraw(hands[0], false); g.restore();
  g.restore();
}
const SIDEWALK = layer((g) => { const r = rng(6602); const sw = g.createLinearGradient(0, 900, 0, H); sw.addColorStop(0, '#e8b8a8'); sw.addColorStop(1, '#a87080'); g.fillStyle = sw; g.fillRect(0, 900, W, H - 900);
  g.fillStyle = 'rgba(40,20,40,0.6)'; for (let b = 0; b < 3; b++) { g.beginPath(); for (let x = 0; x <= W; x += 20) g.lineTo(x, 930 + b * 60 + Math.sin(x / 120 + b) * 12); for (let x = W; x >= 0; x -= 20) g.lineTo(x, 948 + b * 60 + Math.sin(x / 120 + b) * 12); g.closePath(); g.fill(); }
  g.strokeStyle = 'rgba(255,230,210,0.35)'; g.lineWidth = 3; for (let k = 0; k < 120; k++) { const x = r() * W, y = 910 + r() * 170; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 30 + r() * 60, y); g.stroke(); } });
function snout() { return [DXS - 165 * DSS, GY - 415 * DSS]; }
function shotKneel(t, zoom, zc, sh = [0, 0]) {
  ctx.drawImage(BG2, 0, 0);
  ctx.save(); ctx.translate(zc[0] + sh[0], zc[1] + sh[1]); ctx.scale(zoom, zoom); ctx.translate(-zc[0], -zc[1]);
  ctx.drawImage(SIDEWALK, 0, 0);
  const eyes = t > B.eyes, base = eyes ? DOGMB : DOGM, clean = eyes ? DOGB : DOG;
  const p = clamp((t - B.rub) / (B.rubEnd - B.rub)), wag = Math.sin(t * (t > B.rub ? 10 : 4)) * (t > B.rub ? 0.4 : 0.15);
  drawDog(ctx, base, DXS, GY, DSS, true, wag);
  // the wiped part comes back caramel
  const [sx, sy] = snout();
  if (p > 0) { const [cc, cg] = off(); drawDog(cg, clean, DXS, GY, DSS, true, wag); cg.globalCompositeOperation = 'destination-in'; cg.filter = 'blur(10px)'; cg.beginPath(); cg.ellipse(sx + 50 - 40 * p, sy - 40 * p, 40 + 150 * p, 30 + 130 * p, -0.3, 0, 7); cg.fill(); ctx.drawImage(cc, 0, 0); }
  // tongue out, eyes shut, content
  const tk = clamp((t - B.tongue) / 0.3); if (tk > 0) { ctx.save(); ctx.translate(DXS - 175 * DSS, GY - 380 * DSS); ctx.rotate(0.15 + Math.sin(t * 6) * 0.05); E(ctx, 0, 22 * tk, 16, 30 * tk, 0, '#ff7a8a'); E(ctx, 0, 22 * tk, 2, 22 * tk, 0, '#e8546a'); ctx.restore(); }
  if (eyes) { const [ex, ey] = [DXS - 110 * DSS, GY - 448 * DSS]; E(ctx, ex - 4, ey + 30, 22, 9, 0, 'rgba(255,110,130,0.45)'); }
  const rubbing = t > B.rub && t < B.rubEnd + 1.5 ? 1 : 0.35;
  const rx = Math.sin(t * 11) * 34 * rubbing, ry = Math.cos(t * 11) * 16 * rubbing;
  const reach = easeOut((t - B.hands) / 0.7);
  const lx = (sx - MX) / MS, ly = (sy - GY) / MS;
  const away = ease((t - B.eyes + 0.5) / 0.8), nx = lx - 40 / MS + 270 / MS * away, ny = ly + 10 / MS - 150 / MS * away;
  const H0 = [[200, -330], [210, -300]], H1 = [[nx + rx, ny + ry], [nx + 40 - rx * 0.6, ny + 40 - ry]];
  const hands = H0.map((h, i) => [h[0] + (H1[i][0] - h[0]) * reach, h[1] + (H1[i][1] - h[1]) * reach]);
  kneel(ctx, MX, GY, MS, { hands, mud: p, t, smile: 0.9, laugh: t < B.olha - 0.4 ? 0.4 : 0 });
  ctx.restore();
  sunset(ctx, 0.2); bloom(ctx, 0.2, 24); grade(ctx, { vig: 0.5, seed: 62 });
}

// ---------- shot 4: silhouettes on the curb, crane up ----------
function silhouettes(g, t, dy, sc) {
  g.save(); g.translate(880, 960 + dy); g.scale(sc, sc); g.translate(-880, -960);
  g.fillStyle = '#000'; g.strokeStyle = '#000'; g.lineCap = 'round';
  // Otávio standing, seen from behind: legs, long coat, backpack, head
  for (const [x, dx] of [[728, -6], [792, 6]]) { g.lineWidth = 40; g.beginPath(); g.moveTo(x, 740); g.lineTo(x + dx, 945); g.stroke(); g.beginPath(); g.ellipse(x + dx, 952, 30, 12, 0, 0, 7); g.fill(); }
  g.beginPath(); g.moveTo(668, 420); g.quadraticCurveTo(760, 392, 852, 420); g.lineTo(880, 780); g.quadraticCurveTo(760, 796, 640, 780); g.closePath(); g.fill();
  g.lineWidth = 44; g.beginPath(); g.moveTo(672, 440); g.quadraticCurveTo(640, 560, 646, 690); g.stroke(); E(g, 646, 706, 22, 26, 0, '#000');
  g.beginPath(); g.moveTo(848, 440); g.quadraticCurveTo(890, 600, 930 + Math.sin(t * 1.4) * 4, 748); g.stroke(); E(g, 936 + Math.sin(t * 1.4) * 4, 760, 24, 22, 0, '#000');
  g.beginPath(); g.roundRect(702, 432, 116, 200, 26); g.fill();
  g.beginPath(); g.ellipse(760, 392, 28, 26, 0, 0, 7); g.fill();
  g.beginPath(); g.ellipse(762, 330, 62, 68, 0.05, 0, 7); g.fill();
  for (const [x, y, a] of [[722, 278, -0.5], [758, 266, 0], [796, 276, 0.5], [814, 298, 0.9]]) { g.save(); g.translate(x, y); g.rotate(a); g.beginPath(); g.moveTo(-14, 10); g.lineTo(0, -30); g.lineTo(14, 10); g.closePath(); g.fill(); g.restore(); }
  E(g, 698, 334, 12, 20, 0, '#000'); E(g, 826, 336, 12, 20, 0, '#000');
  // Caramelo standing beside him, from behind, head under his hand
  g.save(); g.translate(1000, 960);
  for (const x of [-34, 34]) { g.lineWidth = 30; g.beginPath(); g.moveTo(x, -130); g.lineTo(x * 0.9, -10); g.stroke(); g.beginPath(); g.ellipse(x * 0.9, -6, 20, 10, 0, 0, 7); g.fill(); }
  g.beginPath(); g.ellipse(0, -160, 76, 72, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(-14, -236, 50, 56, -0.2, 0, 7); g.fill();
  g.save(); g.translate(-30, -318); g.rotate(-0.25 + Math.sin(t * 1.4) * 0.03);
  g.beginPath(); g.ellipse(0, 0, 52, 48, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(14, 44, 30, 26, 0, 0, 7); g.fill();
  g.beginPath(); g.moveTo(-38, -24); g.lineTo(-30, -96); g.lineTo(-6, -32); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(18, -36); g.quadraticCurveTo(66, -44, 64, 14); g.quadraticCurveTo(48, -4, 28, -10); g.closePath(); g.fill();
  g.restore();
  const w = Math.sin(t * 6) * 0.35; g.lineWidth = 22; g.beginPath(); g.moveTo(40, -190); g.quadraticCurveTo(110 + w * 30, -210, 120 + w * 50, -270); g.stroke();
  g.restore();
  g.restore();
}
const SUN = [960, 560];
function street4(g, dy) {
  const sk = g.createLinearGradient(0, 0, 0, H); sk.addColorStop(0, '#5a3a8a'); sk.addColorStop(0.4, '#ff6a8a'); sk.addColorStop(0.62, '#ffb060'); sk.addColorStop(1, '#ffd8a0'); g.fillStyle = sk; g.fillRect(0, 0, W, H);
  glow(g, SUN[0], SUN[1] + dy * 0.2, 900, 'rgba(255,200,120,0.9)', 0.9); E(g, SUN[0], SUN[1] + dy * 0.2, 190, 190, 0, '#fff2c0'); glow(g, SUN[0], SUN[1] + dy * 0.2, 260, 'rgba(255,255,230,1)', 0.8);
  g.save(); g.translate(0, dy * 0.45);
  const vp = [SUN[0], SUN[1] + 40], r = rng(6603);
  // houses on both sides receding (dark, rim-lit tops)
  for (const side of [-1, 1]) for (let i = 0; i < 9; i++) { const d0 = 1 - i / 9, d1 = 1 - (i + 1) / 9, h = 0.55 + r() * 0.3; const xa = vp[0] + side * 1500 * d0, xb = vp[0] + side * 1500 * d1, ya = vp[1] + 520 * d0, yb = vp[1] + 520 * d1;
    g.fillStyle = `rgb(${40 + i * 12},${18 + i * 6},${40 + i * 8})`; g.beginPath(); g.moveTo(xa, ya); g.lineTo(xa, ya - 900 * h * d0); g.lineTo(xb, yb - 900 * h * d1); g.lineTo(xb, yb); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(255,170,110,0.7)'; g.lineWidth = 3; g.beginPath(); g.moveTo(xa, ya - 900 * h * d0); g.lineTo(xb, yb - 900 * h * d1); g.stroke();
    for (let w = 0; w < 3; w++) if (r() < 0.45) { const u = 0.2 + w * 0.25, wx = xa + (xb - xa) * u, wy = ya + (yb - ya) * u - 900 * h * (d0 + (d1 - d0) * u) * 0.5; g.fillStyle = 'rgba(255,200,120,0.8)'; g.fillRect(wx - 10 * d0, wy, 20 * d0, 26 * d0); } }
  // poles + wires to the vanishing point
  for (const side of [-1, 1]) { for (let i = 0; i < 5; i++) { const d = 1 - i / 5, x = vp[0] + side * 1150 * d, y = vp[1] + 480 * d; g.fillStyle = '#20101e'; g.fillRect(x - 8 * d, y - 860 * d, 16 * d, 860 * d); }
    g.strokeStyle = 'rgba(30,14,30,0.8)'; g.lineWidth = 2; for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(vp[0] + side * 1150, vp[1] + 480 - 860 + k * 20); g.quadraticCurveTo(vp[0] + side * 400, vp[1] - 200 + k * 10, vp[0], vp[1] - 30); g.stroke(); } }
  // wet road with the sun's reflection
  g.fillStyle = '#5a2a4a'; g.beginPath(); g.moveTo(vp[0] - 30, vp[1]); g.lineTo(vp[0] + 30, vp[1]); g.lineTo(W + 600, H + 400); g.lineTo(-600, H + 400); g.closePath(); g.fill();
  const rf = g.createLinearGradient(0, vp[1], 0, H); rf.addColorStop(0, 'rgba(255,230,170,0.9)'); rf.addColorStop(1, 'rgba(255,170,120,0.2)'); g.fillStyle = rf; g.beginPath(); g.moveTo(vp[0] - 20, vp[1]); g.lineTo(vp[0] + 20, vp[1]); g.lineTo(vp[0] + 220, H + 400); g.lineTo(vp[0] - 220, H + 400); g.closePath(); g.fill();
  g.restore();
  // curb + sidewalk in the foreground
  { const sw = g.createLinearGradient(0, 860, 0, H); sw.addColorStop(0, 'rgba(58,26,48,0)'); sw.addColorStop(0.35, '#3a1a30'); sw.addColorStop(1, '#24101e'); g.fillStyle = sw; g.fillRect(0, 860, W, H - 860); const rf2 = g.createLinearGradient(0, 900, 0, H); rf2.addColorStop(0, 'rgba(255,210,150,0.35)'); rf2.addColorStop(1, 'rgba(255,170,120,0)'); g.fillStyle = rf2; g.beginPath(); g.moveTo(SUN[0] - 120, 900); g.lineTo(SUN[0] + 120, 900); g.lineTo(SUN[0] + 260, H); g.lineTo(SUN[0] - 260, H); g.closePath(); g.fill(); }
}
function shot4(t, lt) {
  const up = ease(lt / 6), dy = up * 220, sc = 1 - up * 0.25, cdy = up * 20;
  street4(ctx, dy);
  rimSil(ctx, (m) => silhouettes(m, t, cdy, sc), { col: '#ffcf8a', dx: 0, dy: -5, blur: 10, fill: '#1a0c18' });
  // scarf, the one colour in the silhouette
  ctx.save(); ctx.translate(880, 960 + cdy); ctx.scale(sc, sc); ctx.translate(-880, -960); ctx.fillStyle = "#6a1820"; ctx.beginPath(); ctx.roundRect(712, 380, 100, 28, 12); ctx.fill(); ctx.beginPath(); ctx.moveTo(780, 396); ctx.quadraticCurveTo(792 + Math.sin(t * 2) * 6, 470, 780, 540); ctx.lineTo(804, 540); ctx.quadraticCurveTo(812, 466, 806, 396); ctx.closePath(); ctx.fill(); ctx.restore();
  bloom(ctx, 0.35, 30); grade(ctx, { vig: 0.55, seed: 64 });
}

function render(t) {
  const s = TL.shots.find((x) => t >= x.start && t < x.end) || TL.shots[TL.shots.length - 1];
  const lt = t - s.start;
  ctx.save(); ctx.clearRect(0, 0, W, H);
  const zc = [DXS - 80 * DSS, GY - 440 * DSS];
  if (s.id === 1) shot1(t);
  if (s.id === 2) shotKneel(t, 1, zc);
  if (s.id === 3) { const e = ease(lt / 2.5); shotKneel(t, 1 + 0.6 * e, zc, [-160 * e, 60 * e]); }
  if (s.id === 4) shot4(t, lt);
  ctx.restore();
  pixelate(ctx, 4, 12);
  if (s.id === 1) haLayer(t);
  if (s.id === 2) { const hx = MX + 40 * MS; speech(ctx, (t - B.olha) / 0.3, hx + 120, 140, hx + 120, 330, ['OLHA O ESTADO', 'DE VOCÊ...'], 58); }
  if (s.id === 3) speech(ctx, (t - B.think) / 0.4, 1520, 190, 1260, 330, ['NINGUÉM ME', 'TOCAVA ASSIM.'], 58, true);
  if (s.id === 4) captionAt(ctx, t, B.nem, 70, 70, 'NEM A ELE.');
}
window.render = render;
window.__ready = true;
