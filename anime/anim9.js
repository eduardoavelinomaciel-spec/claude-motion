// Scene 9 "O salto": render(t), pure in t.
window.ANIM = true; window.NO_RAIN = true; window.NO_CAP = true;
await import('./shots.js');
await document.fonts.load('40px PS2P');
const { W, H, off, rng, glow, grade, bloom, caption_, thick, shots, pixelate, post, rimSil } = window.SH;
const TL = await (await fetch('timeline9.json')).json();
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




// bus stop shelter drawn at world x
function busStop(g, x) {
  g.fillStyle = '#5a6270'; g.fillRect(x, GROUND - 330, 14, 330); g.fillRect(x + 360, GROUND - 330, 14, 330);
  g.fillStyle = 'rgba(190,225,255,0.35)'; g.fillRect(x + 14, GROUND - 320, 346, 240); g.strokeStyle = 'rgba(255,255,255,0.6)'; g.lineWidth = 4; g.beginPath(); g.moveTo(x + 40, GROUND - 300); g.lineTo(x + 120, GROUND - 120); g.stroke();
  g.fillStyle = '#3a4250'; g.beginPath(); g.moveTo(x - 40, GROUND - 330); g.lineTo(x + 414, GROUND - 330); g.lineTo(x + 400, GROUND - 360); g.lineTo(x - 26, GROUND - 360); g.closePath(); g.fill();
  g.fillStyle = '#8a5a34'; g.fillRect(x + 40, GROUND - 120, 300, 18); g.fillStyle = '#5a3a22'; g.fillRect(x + 60, GROUND - 102, 10, 62); g.fillRect(x + 310, GROUND - 102, 10, 62);
  // bus sign
  g.fillStyle = '#5a6270'; g.fillRect(x + 470, GROUND - 420, 10, 420); g.fillStyle = '#1e6ad8'; g.beginPath(); g.roundRect(x + 430, GROUND - 470, 90, 90, 12); g.fill();
  g.fillStyle = '#ffffff'; g.beginPath(); g.roundRect(x + 448, GROUND - 452, 54, 40, 8); g.fill(); g.fillStyle = '#1e6ad8'; g.fillRect(x + 454, GROUND - 446, 18, 14); g.fillRect(x + 478, GROUND - 446, 18, 14); g.fillStyle = '#ffffff'; g.beginPath(); g.arc(x + 458, GROUND - 408, 6, 0, 7); g.arc(x + 492, GROUND - 408, 6, 0, 7); g.fill();
}



// ================= Scene 9 "O salto" =================
const { rain: rainFx, drawCar } = window.SH;
const layer = (fn, w = W, h = H) => { const [c, g] = off(w, h); fn(g); return c; };
const NEON = ['#ff3cac', '#3cf2ff', '#ffd23c', '#5dff7a', '#b06bff'];
// the morning street, re-lit as the rainy neon night of scenes 1 and 8
const NIGHT = layer((g) => {
  const src = sideStreet(31); g.filter = 'brightness(0.5) saturate(1.3)'; g.drawImage(src, 0, 0); g.filter = 'none'; g.globalCompositeOperation = 'multiply'; g.fillStyle = '#3a2e78'; g.fillRect(0, 0, SW, H * 2); g.globalCompositeOperation = 'source-over'; { const sk = g.createLinearGradient(0, 0, 0, H / 2 + GROUND - 500); sk.addColorStop(0, 'rgba(7,6,26,1)'); sk.addColorStop(0.75, 'rgba(20,10,50,0.85)'); sk.addColorStop(1, 'rgba(60,20,80,0)'); g.fillStyle = sk; g.fillRect(0, 0, SW, H / 2 + GROUND - 500); }
  const oy = H / 2, r = rng(9901); g.save(); g.globalCompositeOperation = 'lighter';
  for (let k = 0; k < 900; k++) { const x = r() * SW, y = oy + GROUND - 120 - r() * 560; if (r() < 0.5) continue; const c = ['#ffc46a', '#ffe3a0', '#ff8ad0', '#7af0ff'][Math.floor(r() * 4)]; g.globalAlpha = 0.45; g.fillStyle = c; g.fillRect(x, y, 14, 18); }
  for (let x = 300; x < SW; x += 700 + r() * 500) { const c = NEON[Math.floor(r() * 5)]; g.globalAlpha = 0.5; const gr = g.createRadialGradient(x, oy + GROUND - 320, 0, x, oy + GROUND - 320, 260); gr.addColorStop(0, c); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - 260, oy + GROUND - 580, 520, 520); g.globalAlpha = 0.9; g.fillStyle = c; g.fillRect(x - 70, oy + GROUND - 360, 140, 40); }
  // wet road reflections
  for (let x = 0; x < SW; x += 40) { if (r() < 0.6) continue; const c = NEON[Math.floor(r() * 5)]; g.globalAlpha = 0.25; g.fillStyle = c; g.fillRect(x, oy + GROUND + 100, 26, 200 + r() * 300); }
  g.restore();
}, SW, H * 2);
function world(g, camX, z, groundY) { g.save(); g.fillStyle = '#07061a'; g.fillRect(0, 0, W, H); g.translate(W / 2, groundY); g.scale(z, z); g.translate(-camX, -GROUND); g.drawImage(NIGHT, 0, -H / 2); return () => g.restore(); }
function splash(g, x, y, k, s = 1, seed = 1) { if (k <= 0 || k > 1) return; const r = rng(seed); for (let i = 0; i < 18; i++) { const a = -Math.PI * (0.15 + r() * 0.7), v = (200 + r() * 400) * s, px = x + Math.cos(a) * v * k, py = y + Math.sin(a) * v * k + 900 * s * k * k; E(g, px, py, (4 + r() * 6) * s, (5 + r() * 7) * s, 0, `rgba(210,230,255,${0.9 * (1 - k)})`); } g.strokeStyle = `rgba(220,235,255,${0.7 * (1 - k)})`; g.lineWidth = 3 * s; g.beginPath(); g.ellipse(x, y, (20 + 160 * k) * s, (6 + 30 * k) * s, 0, 0, 7); g.stroke(); }

// ---------- shot 1: three vertical panels of the run ----------
const COLS = [[20, 20], [660, 20], [1300, 20]], CW = 600, CH = 1040;
function runPanel(g, i, t) {
  const sp = 900, x = 2000 + t * sp, ph = t * 15;
  const z = [2.6, 1.0, 2.2][i], gy = [600, 930, 840][i], camX = x + [-20, 0, 150][i];
  const done = world(g, camX, z, gy);
  // puddles on the sidewalk
  for (let px = 2000; px < 2000 + 7000; px += 520) { g.fillStyle = 'rgba(120,150,255,0.25)'; g.beginPath(); g.ellipse(px, GROUND + 60, 120, 14, 0, 0, 7); g.fill(); }
  dogTrot(g, x, GROUND + 70, 1.0, ph, 1, { headUp: -0.08 });
  for (let n = 0; n < 4; n++) { const ts = (Math.floor(ph / Math.PI) - n) * Math.PI / 15, k = (t - ts) / 0.5; splash(g, x - 60 + (ts - t) * sp + (n % 2) * 140, GROUND + 70, k, 1, 99 + Math.floor(ts * 50)); }
  // speed lines
  g.strokeStyle = 'rgba(255,255,255,0.35)'; g.lineWidth = 3; const r = rng(Math.floor(t * 12)); for (let k = 0; k < 20; k++) { const ly = GROUND - 400 + r() * 500, lx = camX - 1200 + r() * 2400; g.beginPath(); g.moveTo(lx, ly); g.lineTo(lx - 300 - r() * 400, ly); g.stroke(); }
  done();
  rainFx(g, rng(Math.floor(t * 24) + i), { n: 500, len: [30, 60], a: [0.15, 0.35], w: [1, 1.6], slant: 0.35 });
}
function shot1(t) {
  ctx.fillStyle = '#f6f0e2'; ctx.fillRect(0, 0, W, H);
  COLS.forEach(([x, y], i) => { const k = t - TL.panels[i]; if (k <= 0) return; const a = easeOut(k / 0.3);
    const [pc, pg] = off(); runPanel(pg, i, t); bloom(pg, 0.35, 20);
    ctx.save(); ctx.beginPath(); ctx.rect(x, y + (1 - a) * 60, CW, CH); ctx.clip(); ctx.globalAlpha = a; ctx.drawImage(pc, (W - CW) / 2, 0, CW, H, x, y + (1 - a) * 60, CW, CH * (H / CH)); ctx.restore(); });
  grade(ctx, { vig: 0.35, seed: 91 });
}

// ---------- shot 2: the leap, the bite, the pull ----------
const OX = 1150, OY = 960, OS = 1.0, CARGLOW = [2050, 760];
const hemAt = (L, x) => { const c = Math.cos(L), s = Math.sin(L), hx = -86 * OS, hy = -300 * OS; return [x + hx * c + hy * s, OY - hx * s + hy * c]; };
function scene2(t) { // characters at time t (t may be frozen)
  const pk = ease((t - B.pull) / (B.land - B.pull)), L = 0.95 * pk, mx = OX - 200 * pk;
  const near = clamp((t - 6) / 7);
  const done = world(ctx, OX - 260, 0.95, 990);
  // car headlights approaching from the right
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (const dy of [0, 40]) { const bm = ctx.createLinearGradient(CARGLOW[0], 0, 400, 0); bm.addColorStop(0, `rgba(255,245,210,${0.35 + 0.4 * near})`); bm.addColorStop(1, 'rgba(255,245,210,0)'); ctx.fillStyle = bm; ctx.beginPath(); ctx.moveTo(CARGLOW[0], CARGLOW[1] + dy); ctx.lineTo(300, CARGLOW[1] - 380 + dy); ctx.lineTo(300, CARGLOW[1] + 300 + dy); ctx.closePath(); ctx.fill(); } ctx.restore();
  // Otávio: on the phone, then pulled back off his feet
  otavio(ctx, mx, OY, OS, Math.PI, 0.4 - 0.5 * pk, { lean: L, armUp: 0.9 * pk, wide: pk > 0.05 ? 1 : 0 });
  // the dog
  const [hx, hy] = hemAt(L, mx);
  if (t < B.bite) { const u = ease((t - B.leap) / (B.bite - B.leap)), x0 = 120, y0 = 1030, x1 = hx - 246, y1 = hy + 260; const lift = Math.sin(clamp((t - B.leap) / (B.bite - B.leap)) * Math.PI * 0.9) * 170;
    const run = t < B.leap; dogTrot(ctx, run ? x0 - (B.leap - t) * 400 : x0 + (x1 - x0) * u, run ? y0 : y0 + (y1 - y0) * u - lift, 1.1, t * (run ? 14 : 3), run ? 1 : 0, run ? {} : { legsOut: 1, headUp: 0.1 }); }
  else { const dx = Math.min(hx - 246, hx - 246), dy = Math.min(hy + 260, 1030); const bx = pk > 0 ? hx - 246 - 330 * pk : hx - 246, by = pk > 0 ? Math.min(1030, hy + 260 + 160 * pk) : hy + 260;
    dogTrot(ctx, bx, by, 1.1, 0, 0, { legsOut: pk > 0.2 ? -0.5 : 1, headUp: 0.15 - 0.3 * pk });
    const mxp = bx + 246, myp = by - 260; ctx.fillStyle = OT.coatS; ctx.beginPath(); ctx.moveTo(hx + 30, hy - 30); ctx.lineTo(hx + 40, hy + 10); ctx.lineTo(mxp + 6, myp + 12); ctx.lineTo(mxp - 4, myp - 10); ctx.closePath(); ctx.fill(); }
  // the phone flies out of his hand
  const pf = (t - B.phone) / 1.6; if (pf > 0) { const px = OX + 120 - 520 * pf, py = OY - 560 - Math.sin(clamp(pf) * Math.PI) * 300 + (pf > 1 ? 0 : 0); ctx.save(); ctx.translate(px, Math.min(py + pf * pf * 300, OY - 10)); ctx.rotate(pf * 9); ctx.fillStyle = '#111'; ctx.fillRect(-22, -38, 44, 76); ctx.fillStyle = '#bfefff'; ctx.fillRect(-18, -32, 36, 62); ctx.restore(); glow(ctx, px, Math.min(py + pf * pf * 300, OY - 10), 90, 'rgba(160,230,255,0.9)', 0.7); }
  done();
  glow(ctx, W + 60, CARGLOW[1], 300 + 500 * near, 'rgba(255,250,230,1)', 0.6 + 0.4 * near);
}
function speedLines(g, cx, cy, k, seed) { const r = rng(seed); g.save(); g.globalAlpha = 0.6 * k; g.fillStyle = '#ffffff'; for (let i = 0; i < 60; i++) { const a = r() * Math.PI * 2, r0 = 260 + r() * 200, r1 = 1400, w = 0.004 + r() * 0.01; g.beginPath(); g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); g.lineTo(cx + Math.cos(a - w) * r1, cy + Math.sin(a - w) * r1); g.lineTo(cx + Math.cos(a + w) * r1, cy + Math.sin(a + w) * r1); g.closePath(); g.fill(); } g.restore(); }
function shot2(t) {
  const frozen = t >= B.bite && t < B.pull, tt = frozen ? B.bite : t;
  scene2(tt);
  const [hx, hy] = hemAt(0, OX);
  if (t > B.leap && t < B.land) speedLines(ctx, hx - 60, hy, t < B.bite ? clamp((t - B.leap) / 0.6) : 1, frozen ? 9902 : 9902 + Math.floor(t * 12));
  const rt = frozen ? B.bite : t; rainFx(ctx, rng(frozen ? 9903 : Math.floor(rt * 24)), { n: 900, len: [30, 60], a: [0.15, 0.4], w: [1, 1.8], slant: 0.25 });
  bloom(ctx, 0.4, 24); grade(ctx, { vig: 0.6, seed: 92 });
  if (frozen) { ctx.save(); ctx.globalCompositeOperation = 'color'; ctx.fillStyle = 'rgba(120,60,160,0.25)'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
}
function freezeFrame(g, lt) { // same comic freeze as scene 1
  const f = easeOut(lt / 0.12);
  const bw = 34 * f; g.fillStyle = '#fff'; g.fillRect(0, 0, W, bw); g.fillRect(0, H - bw, W, bw); g.fillRect(0, 0, bw, H); g.fillRect(W - bw, 0, bw, H);
  g.lineWidth = 10; g.strokeStyle = `rgba(17,17,17,${f})`; g.strokeRect(bw, bw, W - 2 * bw, H - 2 * bw);
  const nk = (lt - 0.15) / 0.22; if (nk <= 0) return;
  const s = nk < 1 ? 0.3 + 0.95 * easeOut(nk) : 1.25 - 0.25 * easeOut((nk - 1) * 0.22 / 0.3);
  g.save(); g.translate(560, 330); g.rotate(-0.1); g.scale(s, s); g.font = '170px Bangers'; g.textAlign = 'center'; g.lineJoin = 'round';
  g.lineWidth = 26; g.strokeStyle = '#111'; g.strokeText('NHAC!!', 8, 8); g.strokeText('NHAC!!', 0, 0);
  const tg = g.createLinearGradient(0, -90, 0, 70); tg.addColorStop(0, '#fff36a'); tg.addColorStop(1, '#ff8a1e'); g.fillStyle = tg; g.fillText('NHAC!!', 0, 0); g.restore();
}

// ---------- shot 3: the car passes, the wave ----------
function shot3(t, lt) {
  const done = world(ctx, OX - 160, 1.25, 1020);
  // his phone on the wet ground, still lit
  ctx.save(); ctx.translate(OX - 380, GROUND + 52); ctx.rotate(0.3); ctx.fillStyle = '#111'; ctx.fillRect(-30, -10, 60, 20); ctx.fillStyle = '#bfefff'; ctx.fillRect(-26, -7, 52, 14); ctx.restore(); glow(ctx, OX - 380, GROUND + 52, 80, 'rgba(160,230,255,0.9)', 0.6);
  done();
  // the car as a smear of pixel blocks, right to left
  const ck = (t - B.car) / 0.8; if (ck > -0.4 && ck < 1.4) { const cx = W + 1400 - ck * (W + 2800), cy = 560; const r = rng(9904);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; glow(ctx, cx - 600, cy + 120, 700, 'rgba(255,245,220,0.9)', 0.8); ctx.restore();
    for (let i = 0; i < 260; i++) { const bx = cx + r() * 1400 - 200, by = cy - 80 + r() * 300, len = 80 + r() * 400, col = by < cy + 40 ? (r() < 0.2 ? '#ffe9b0' : '#b8202a') : by < cy + 160 ? '#e8303c' : '#4a0a10'; ctx.globalAlpha = 0.5 + r() * 0.5; ctx.fillStyle = col; ctx.fillRect(Math.round(bx / 16) * 16, Math.round(by / 16) * 16, len, 16); }
    ctx.globalAlpha = 1; for (const y of [cy + 120, cy + 150]) { ctx.fillStyle = '#fff8e0'; ctx.fillRect(cx - 900, y, 1100, 10); } ctx.fillStyle = 'rgba(255,60,172,0.7)'; ctx.fillRect(cx - 200, cy + 230, 1500, 8); }
  // the wave rising over the frame
  const wk = clamp((t - B.wave) / (B.white - B.wave)); if (wk > 0) { const top = H + 100 - wk * (H + 700), r = rng(9905);
    const wg = ctx.createLinearGradient(0, top, 0, H); wg.addColorStop(0, 'rgba(200,225,255,0.95)'); wg.addColorStop(0.2, 'rgba(90,130,220,0.92)'); wg.addColorStop(1, 'rgba(30,40,110,0.95)'); ctx.fillStyle = wg;
    ctx.beginPath(); ctx.moveTo(-50, H + 50); for (let x = -50; x <= W + 50; x += 24) ctx.lineTo(x, top + Math.sin(x / 140 + t * 6) * 60 + Math.sin(x / 47) * 18 - (x / W) * 160); ctx.lineTo(W + 50, H + 50); ctx.closePath(); ctx.fill();
    for (let i = 0; i < 160; i++) { const x = r() * W, y = top - 40 - r() * 260 * (0.5 + wk) + Math.sin(x / 140 + t * 6) * 60 - (x / W) * 160, s2 = 8 + r() * 18; ctx.fillStyle = `rgba(240,248,255,${0.6 + r() * 0.4})`; ctx.fillRect(Math.round(x / 8) * 8, Math.round(y / 8) * 8, s2, s2); }
    if (wk > 0.85) { ctx.fillStyle = `rgba(255,255,255,${(wk - 0.85) / 0.15})`; ctx.fillRect(0, 0, W, H); } }
  rainFx(ctx, rng(Math.floor(t * 24)), { n: 700, len: [40, 80], a: [0.15, 0.4], w: [1, 2], slant: 0.3 });
  bloom(ctx, 0.45, 24); grade(ctx, { vig: 0.55, seed: 93 });
}

function render(t) {
  const s = TL.shots.find((x) => t >= x.start && t < x.end) || TL.shots[TL.shots.length - 1];
  const lt = t - s.start;
  ctx.save(); ctx.clearRect(0, 0, W, H);
  const white = (s.id === 3 && t >= B.white) || s.id === 4;
  if (white) { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H); }
  else if (s.id === 1) shot1(t);
  else if (s.id === 2) shot2(t);
  else if (s.id === 3) shot3(t, lt);
  ctx.restore();
  if (!white) pixelate(ctx, 4, 12);
  if (s.id === 1) [...'TAP TAP TAP TAP'.split(' ')].forEach((w, i) => sfx(ctx, w, 330 + i * 420, 860 - (i % 2) * 90, 70, (i % 2 ? 0.08 : -0.1), (t - B.tap - i * 0.45) / 0.15, ['#e8f0ff', '#8aa0d8'], '#2a3a6a'));
  if (s.id === 2 && t >= B.bite && t < B.pull) freezeFrame(ctx, t - B.bite);
  if (s.id === 3 && t < B.white) { const k = (t - B.shwoosh) / 0.25; if (k > 0) [...'SHHHHWOOOSH!'].forEach((ch, i) => sfx(ctx, ch, 220 + i * 140, 420 + Math.sin(i * 0.9) * 50, 70 + i * 7, Math.sin(i * 2.3) * 0.1, k - i * 0.15, ['#ffffff', '#9ad4ff'], '#1a3a8a')); }
}
window.render = render;
window.__ready = true;
