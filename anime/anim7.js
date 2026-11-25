// Scene 7 "Quem chega primeiro": render(t), pure in t.
window.ANIM = true; window.NO_RAIN = true; window.NO_CAP = true;
await import('./shots.js');
await document.fonts.load('40px PS2P');
const { W, H, off, rng, glow, grade, bloom, caption_, thick, shots, pixelate, post, rimSil } = window.SH;
const TL = await (await fetch('timeline7.json')).json();
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

// ================= Scene 7 "Quem chega primeiro" =================
const layer = (fn, w = W, h = H) => { const [c, g] = off(w, h); fn(g); return c; };
const DOG = dogSit(0), DOGB = dogSit(1);
window.SHOT4_DAY = true; const [SNOUT, ng] = off(); shots[4](ng, 0); post.length = 0;
const STREET = sideStreet(31);
const BUS_X = 3400, GATE_X = 5000, PAD_X = 6600, BENCH_X = 8200, OBJ = [BUS_X + 200, GATE_X, PAD_X, BENCH_X];
function gate(g, x) {
  for (const px of [x - 170, x + 130]) { g.fillStyle = '#f1e6cf'; g.fillRect(px, GROUND - 400, 60, 400); g.fillStyle = '#d8c8a8'; g.fillRect(px - 8, GROUND - 420, 76, 26); E(g, px + 30, GROUND - 432, 22, 14, 0, '#c0472f'); }
  g.fillStyle = '#1e1c24'; g.fillRect(x - 110, GROUND - 330, 240, 10); g.fillRect(x - 110, GROUND - 60, 240, 10);
  for (let k = 0; k < 11; k++) { const bx = x - 104 + k * 22; g.fillRect(bx, GROUND - 350, 7, 300); g.beginPath(); g.moveTo(bx - 5, GROUND - 350); g.lineTo(bx + 3.5, GROUND - 372); g.lineTo(bx + 12, GROUND - 350); g.fill(); }
  g.strokeStyle = '#1e1c24'; g.lineWidth = 6; g.beginPath(); g.arc(x + 10, GROUND - 200, 50, 0, 7); g.stroke();
  g.fillStyle = '#3f8a4a'; for (let k = 0; k < 18; k++) { g.beginPath(); g.ellipse(x - 200 + (k % 6) * 14, GROUND - 400 + Math.floor(k / 6) * 30, 16, 9, k, 0, 7); g.fill(); }
}
function awning(g, x) {
  g.fillStyle = '#7a4a2a'; g.fillRect(x - 260, GROUND - 330, 520, 290); g.fillStyle = '#ffe2a8'; g.fillRect(x - 230, GROUND - 300, 460, 230);
  for (let k = 0; k < 6; k++) { const bx = x - 210 + k * 76; g.fillStyle = '#c47a30'; g.beginPath(); g.ellipse(bx + 30, GROUND - 150, 26, 14, 0, Math.PI, 0); g.fill(); }
  for (let k = 0; k < 13; k++) { g.fillStyle = k % 2 ? '#ffffff' : '#c0392b'; g.beginPath(); g.moveTo(x - 300 + k * 46, GROUND - 400); g.lineTo(x - 254 + k * 46, GROUND - 400); g.lineTo(x - 254 + k * 46, GROUND - 340); g.arc(x - 277 + k * 46, GROUND - 340, 23, 0, Math.PI); g.closePath(); g.fill(); }
  g.fillStyle = '#f4ead6'; g.fillRect(x - 160, GROUND - 470, 320, 60); g.font = '48px Bangers'; g.fillStyle = '#c0392b'; g.textAlign = 'center'; g.fillText('PADARIA', x, GROUND - 422);
}
function tree(g, x, y, s) { g.fillStyle = '#6a4228'; g.fillRect(x - 22 * s, y - 380 * s, 44 * s, 380 * s); for (const [dx, dy, r, c] of [[0, -470, 190, '#3f8a4a'], [-110, -420, 130, '#357a40'], [110, -430, 140, '#4a9a52'], [30, -560, 120, '#5aaa5e']]) E(g, x + dx * s, y + dy * s, r * s, r * 0.85 * s, 0, c); }
function bench(g, x, y, s) { // x,y = ground under the bench centre
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = '#2a2830'; for (const lx of [-190, 170]) { g.fillRect(lx, -150, 20, 150); g.fillRect(lx, -300, 14, 150); }
  g.fillStyle = '#9a5a30'; for (let k = 0; k < 3; k++) g.fillRect(-230, -300 + k * 40, 460, 26);
  g.fillStyle = '#b8743e'; g.fillRect(-240, -160, 480, 30); g.fillStyle = '#7a4424'; g.fillRect(-240, -132, 480, 10);
  g.restore();
}
function world(g, camX, z, groundY) { g.save(); g.fillStyle = '#7fb2e8'; g.fillRect(0, 0, W, H); g.translate(W / 2, groundY); g.scale(z, z); g.translate(-camX, -GROUND); g.drawImage(STREET, 0, -H / 2); busStop(g, BUS_X); gate(g, GATE_X); awning(g, PAD_X); tree(g, BENCH_X + 60, GROUND - 30, 1); bench(g, BENCH_X, GROUND + 40, 0.9); return () => g.restore(); }

// ---------- shot 1: 2x2 page ----------
const PANELS = [[20, 20], [980, 20], [20, 560], [980, 560]], PW = 920, PH = 500;
function panelScene(g, i, t, k) { // k = seconds since the panel appeared
  const o = OBJ[i], camX = o - 170, gy = 980, z = 0.9;
  const done = world(g, camX, z, gy);
  drawDog(g, (t % 3) < 0.12 ? DOGB : DOG, o + 150, GROUND + 70, 0.46, true, Math.sin(t * 9) * 0.35);
  const ox = o - 1150 + Math.min(k, 2.0) * 330; otavio(g, ox, GROUND + 30, 1.0, Math.min(k, 2.0) * 6, 0.35 - 0.25 * clamp((k - 2) / 0.4), { smile: clamp((k - 2.2) / 0.5) * 0.6 });
  done();
}
function shot1(t) {
  ctx.fillStyle = '#f6f0e2'; ctx.fillRect(0, 0, W, H);
  const zk = ease((t - B.zoom) / 0.7);
  PANELS.forEach(([x, y], i) => { const k = t - TL.panels[i]; if (k <= 0) return; const a = easeOut(k / 0.35);
    let rx = x, ry = y, rw = PW, rh = PH; if (i === 3 && zk > 0) { rx = x * (1 - zk); ry = y * (1 - zk); rw = PW + (W - PW) * zk; rh = PH + (H - PH) * zk; }
    ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.rect(rx, ry, rw, rh); ctx.clip(); ctx.translate(rx, ry + (1 - a) * 30); ctx.scale(rw / W, rh / H * (W / rw) * (rw / W)); 
    const [pc, pg] = off(); panelScene(pg, i, t, k); ctx.restore();
    ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.rect(rx, ry, rw, rh); ctx.clip(); const sc = Math.max(rw / W, rh / H); ctx.drawImage(pc, rx + (rw - W * sc) / 2, ry + (rh - H * sc) / 2 + (1 - a) * 30, W * sc, H * sc); ctx.restore(); });
  grade(ctx, { vig: 0.3, seed: 71 });
}

// ---------- shot 2: over the shoulder, pointing ----------
const PLAZA = layer((g) => {
  const sk = g.createLinearGradient(0, 0, 0, 600); sk.addColorStop(0, '#7fb2e8'); sk.addColorStop(1, '#f6d3a8'); g.fillStyle = sk; g.fillRect(0, 0, W, H);
  g.save(); g.translate(W / 2, 560); g.scale(0.45, 0.45); g.translate(-BENCH_X - 400, -GROUND); g.filter = 'blur(4px)'; g.drawImage(STREET, 0, -H / 2); g.restore();
  const gr = g.createLinearGradient(0, 520, 0, H); gr.addColorStop(0, '#e8dcc4'); gr.addColorStop(1, '#cbb894'); g.fillStyle = gr; g.fillRect(0, 520, W, H - 520);
  g.fillStyle = 'rgba(40,36,44,0.75)'; for (let b = 0; b < 7; b++) { const y0 = 560 + b * b * 14 + b * 30, th = 6 + b * 4; g.beginPath(); for (let x = 0; x <= W; x += 20) g.lineTo(x, y0 + Math.sin(x / (90 + b * 30)) * (8 + b * 5)); for (let x = W; x >= 0; x -= 20) g.lineTo(x, y0 + th + Math.sin(x / (90 + b * 30)) * (8 + b * 5)); g.closePath(); g.fill(); }
  tree(g, 1600, 660, 0.9); tree(g, 520, 600, 0.6); tree(g, 1880, 700, 1.1);
  E(g, 1330, 712, 260, 24, 0, 'rgba(60,40,30,0.25)'); bench(g, 1330, 712, 0.9);
  glow(g, 0, 0, 900, 'rgba(255,235,190,0.8)', 0.5);
});
const BX2 = 1330, BY2 = 712;
function arm(g, k) { // Otávio's right arm in the foreground, raised by k
  const sx = 420, sy = 1010, hx = 760 + 300 * k, hy = 1180 - 640 * k, a = Math.atan2(hy - sy, hx - sx);
  limb(g, sx, sy, hx, hy, 190, 120, OT.coat, OT.coatS);
  g.save(); g.translate(hx, hy); g.rotate(a);
  g.fillStyle = OT.coatD; g.beginPath(); g.roundRect(-30, -64, 40, 128, 14); g.fill();
  E(g, 40, 0, 52, 44, 0, OT.skin); E(g, 40, 22, 40, 20, 0, OT.skinS);
  limb(g, 60, -26, 150, -30, 30, 24, OT.skin, OT.skinS); // index finger
  for (let i = 0; i < 3; i++) E(g, 78 - i * 8, -2 + i * 18, 20, 13, 0, i % 2 ? OT.skin : '#e8b894');
  E(g, 46, -36, 22, 14, -0.4, OT.skin);
  g.restore();
}
function shot2(t) {
  ctx.drawImage(PLAZA, 0, 0);
  const go = t - B.go, land = B.land - B.go;
  if (go < 0) drawDog(ctx, (t % 2.7) < 0.12 ? DOGB : DOG, 820, 900, 0.62, true, Math.sin(t * 9) * 0.3);
  else if (go < land) { const u = go / land, x = 820 + (BX2 - 40 - 820) * u, y = 900 + (BY2 - 900) * u - Math.max(0, (u - 0.75) / 0.25) ** 0.5 * Math.sin(Math.max(0, (u - 0.75) / 0.25) * Math.PI) * 120, s = (0.62 + (0.46 - 0.62) * u) * 1.85; dogTrot(ctx, x, y, s, go * 16); }
  else drawDog(ctx, DOG, BX2 - 20, BY2 - 130 + (go < land + 0.15 ? -20 * Math.sin((go - land) / 0.15 * Math.PI) : 0), 0.46, true, Math.sin(t * 10) * 0.4);
  // back of his head + shoulder, out of focus
  const [fc, fg] = off();
  fg.fillStyle = OT.coat; fg.beginPath(); fg.ellipse(220, 1180, 340, 260, -0.2, 0, 7); fg.fill(); fg.fillStyle = OT.scarf; fg.beginPath(); fg.ellipse(150, 930, 190, 70, -0.25, 0, 7); fg.fill();
  E(fg, 120, 720, 190, 220, 0, OT.hair); E(fg, 250, 760, 40, 60, 0, OT.skinS);
  for (const [x, y, a] of [[40, 540, -0.6], [130, 505, -0.2], [230, 520, 0.3], [300, 580, 0.8]]) { fg.save(); fg.translate(x, y); fg.rotate(a); fg.fillStyle = OT.hair; fg.beginPath(); fg.moveTo(-40, 30); fg.lineTo(0, -60); fg.lineTo(40, 30); fg.closePath(); fg.fill(); fg.restore(); }
  arm(fg, ease((t - B.raise) / 0.6) * (1 - ease((t - B.land - 1.2) / 0.8) * 0.9));
  ctx.save(); ctx.filter = 'blur(3px)'; ctx.drawImage(fc, 0, 0); ctx.restore();
  bloom(ctx, 0.2, 22); grade(ctx, { vig: 0.45, seed: 72 });
}

// ---------- RPG cards ----------
function card(g, k, { title, lines, bars, foot, icon }) {
  if (k <= 0) return; const [c, cg] = off(480, 270); cg.imageSmoothingEnabled = false;
  const h = Math.round(176 * easeOut(k)), x = 56, y = 135 - h / 2, w = 368;
  cg.fillStyle = '#0a1240'; cg.fillRect(x, y, w, h); cg.fillStyle = '#ffffff'; cg.fillRect(x, y, w, 2); cg.fillRect(x, y + h - 2, w, 2); cg.fillRect(x, y, 2, h); cg.fillRect(x + w - 2, y, 2, h);
  cg.fillStyle = '#5a6ad8'; cg.fillRect(x + 4, y + 4, w - 8, 1); cg.fillRect(x + 4, y + h - 5, w - 8, 1);
  if (k > 0.6) { const a = clamp((k - 0.6) / 0.4); cg.globalAlpha = a; cg.font = '8px PS2P'; cg.textBaseline = 'top';
    cg.fillStyle = '#ffe066'; cg.fillText(title, x + 12, y + 14);
    icon(cg, x + w - 40, y + 8);
    cg.fillStyle = '#ffffff'; lines.forEach((l, i) => cg.fillText(l, x + 12, y + 34 + i * 12));
    const by = y + 34 + lines.length * 12 + 10;
    bars.forEach(([label, frac, col], i) => { const yy = by + i * 20, f = Math.max(2, Math.round(180 * frac * clamp((k - 0.6) / 0.4 * 1.2))); cg.fillStyle = '#cfd6ff'; cg.fillText(label, x + 12, yy + 3); cg.fillStyle = '#1a2470'; cg.fillRect(x + 150, yy, 190, 12); cg.fillStyle = col; cg.fillRect(x + 150, yy, f, 12); cg.fillStyle = 'rgba(255,255,255,0.4)'; cg.fillRect(x + 150, yy, f, 2); });
    cg.fillStyle = '#8a94d8'; cg.fillText(foot, x + 12, y + h - 20); }
  g.save(); g.imageSmoothingEnabled = false; g.drawImage(c, 0, 0, W, H); g.restore();
}
const pix = (cg, rows, x, y, cols) => rows.forEach((r, j) => [...r].forEach((ch, i) => { if (cols[ch]) { cg.fillStyle = cols[ch]; cg.fillRect(x + i * 3, y + j * 3, 3, 3); } }));
const CARD1 = { title: 'HABILIDADE: SEGUIR O DEDO', lines: ['ENTENDE PARA ONDE', 'ALGUEM ESTA APONTANDO'], bars: [['CAO', 0.95, '#ffb030'], ['CHIMPANZE', 0.3, '#5ad8ff']], foot: 'ATE PRIMATAS TEM DIFICULDADE!',
  icon: (cg, x, y) => pix(cg, ['..X......', '..X......', '..XXXXX..', 'XXXXXXXX.', 'XXXXXXXX.', '.XXXXXX..', '..XXXX...'], x, y, { X: '#f0c4a0' }) };
const CARD2 = { title: 'STATUS: OCITOCINA', lines: ['OLHAR NOS OLHOS LIBERA', 'OCITOCINA NOS DOIS'], bars: [['HUMANO', 0.8, '#ff7a9a'], ['CAO', 0.8, '#ffb030']], foot: 'O HORMONIO DO VINCULO.',
  icon: (cg, x, y) => pix(cg, ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...'], x, y, { X: '#e8344a' }) };

// ---------- shot 4: split screen, eyes, threads of light ----------
function shot4(t) {
  const blink = Math.abs(t - B.blink) < 0.08;
  // left: Otávio's eye (facing right)
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W / 2 - 6, H); ctx.clip();
  const lg = ctx.createLinearGradient(0, 0, W / 2, H); lg.addColorStop(0, '#f6c890'); lg.addColorStop(1, '#c8784a'); ctx.fillStyle = lg; ctx.fillRect(0, 0, W / 2, H);
  ctx.save(); ctx.translate(480 - 36 * 6.5, 520 - 2 * 6.5); ctx.scale(6.5, 6.5); otHead(ctx, 0, 0, 0, { wide: 1, smile: 0.4 }); ctx.restore();
  ctx.restore();
  // right: Caramelo's eye (approved close-up)
  ctx.save(); ctx.beginPath(); ctx.rect(W / 2 + 6, 0, W / 2, H); ctx.clip(); ctx.drawImage(SNOUT, 1440 - 850 * 1.15, 540 - 676 * 1.15, W * 1.15, H * 1.15); ctx.restore();
  ctx.fillStyle = '#111'; ctx.fillRect(W / 2 - 6, 0, 12, H);
  if (blink) E(ctx, 1440, 540, 300, 240, -0.1, '#b9702a');
  // threads of pixel light, eye to eye
  const k = t - B.threads; if (k > 0) { const r = rng(7701); ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let j = 0; j < 4; j++) { const amp = 60 + j * 40, ph = j * 1.7; const n = Math.floor(70 * clamp(k / 1.4));
      for (let i = 0; i < n; i++) { const u = i / 70, x = 520 + (1380 - 520) * u, y = 520 + Math.sin(u * Math.PI) * -amp * (j % 2 ? 1 : -1) + Math.sin(u * 8 + t * 3 + ph) * 12, s = 8 + Math.round(r() * 6); ctx.fillStyle = `rgba(255,${200 + r() * 50},${100 + r() * 80},${0.5 + 0.4 * Math.sin(t * 6 + i * 0.5 + j)})`; ctx.fillRect(Math.round(x / 8) * 8, Math.round(y / 8) * 8, s, s); } }
    glow(ctx, 520, 520, 120, 'rgba(255,220,140,0.9)', 0.6 * clamp(k)); glow(ctx, 1380, 520, 120, 'rgba(255,220,140,0.9)', 0.6 * clamp(k)); ctx.restore(); }
  bloom(ctx, 0.25, 22); grade(ctx, { vig: 0.5, seed: 74 });
}

// ---------- shot 5: the bowl at his door ----------
const DOOR = layer((g) => {
  const wall = g.createLinearGradient(0, 0, W, 0); wall.addColorStop(0, '#f5cf5b'); wall.addColorStop(1, '#d8a83a'); g.fillStyle = wall; g.fillRect(0, 0, W, H);
  g.fillStyle = '#f4ead6'; g.fillRect(560, 0, 760, 800); g.fillStyle = '#7a4a2a'; g.fillRect(600, 0, 680, 780);
  for (const [x, y, w, h] of [[640, 40, 280, 320], [960, 40, 280, 320], [640, 400, 280, 340], [960, 400, 280, 340]]) { g.fillStyle = '#6a3e22'; g.fillRect(x, y, w, h); g.fillStyle = '#8a5a34'; g.fillRect(x + 14, y + 14, w - 28, h - 28); }
  E(g, 1190, 420, 18, 18, 0, '#e8c35a'); g.fillStyle = '#c0b8a8'; g.fillRect(1120, 120, 110, 60); g.font = '44px Bangers'; g.fillStyle = '#3a2418'; g.textAlign = 'center'; g.fillText('22', 1175, 168);
  const fl = g.createLinearGradient(0, 780, 0, H); fl.addColorStop(0, '#c9b28e'); fl.addColorStop(1, '#a8906c'); g.fillStyle = fl; g.fillRect(0, 780, W, 300);
  g.fillStyle = '#8a3a2a'; g.beginPath(); g.roundRect(640, 800, 600, 110, 16); g.fill(); g.strokeStyle = '#c0573a'; g.lineWidth = 6; g.strokeRect(660, 815, 560, 80);
  // plant pot
  g.fillStyle = '#c0573a'; g.beginPath(); g.moveTo(1420, 760); g.lineTo(1580, 760); g.lineTo(1556, 900); g.lineTo(1444, 900); g.closePath(); g.fill(); for (let k = 0; k < 14; k++) { g.fillStyle = k % 2 ? '#3f8a4a' : '#5aaa5e'; g.beginPath(); g.ellipse(1500 + Math.sin(k * 2.3) * 70, 700 - (k % 5) * 40, 22, 48, Math.sin(k) * 0.8, 0, 7); g.fill(); }
  glow(g, 300, 200, 1100, 'rgba(255,240,200,0.8)', 0.5);
});
function shot5(t, lt) {
  const z = 1 + 0.15 * ease(lt / 4); ctx.save(); ctx.translate(560, 900); ctx.scale(z, z); ctx.translate(-560, -900);
  ctx.drawImage(DOOR, 0, 0);
  const bx = 440, by = 930;
  E(ctx, bx + 10, by + 50, 230, 34, 0, 'rgba(60,40,20,0.3)');
  ctx.fillStyle = '#2a6ad8'; ctx.beginPath(); ctx.moveTo(bx - 220, by - 30); ctx.lineTo(bx + 220, by - 30); ctx.lineTo(bx + 180, by + 60); ctx.lineTo(bx - 180, by + 60); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#1a4aa8'; ctx.fillRect(bx - 182, by + 40, 364, 20);
  E(ctx, bx, by - 30, 220, 44, 0, '#5a9af0'); E(ctx, bx, by - 26, 192, 34, 0, '#9ad4ff');
  const rk = t - B.ripple; if (rk > 0) for (let i = 0; i < 3; i++) { const k = ((rk * 0.6 + i / 3) % 1); ctx.strokeStyle = `rgba(255,255,255,${0.7 * (1 - k)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(bx + 20, by - 24, 30 + k * 150, (30 + k * 150) * 0.18, 0, 0, 7); ctx.stroke(); }
  E(ctx, bx - 80, by - 34, 60, 6, 0, 'rgba(255,255,255,0.8)');
  ctx.save(); ctx.translate(bx, by + 16); E(ctx, 0, 6, 26, 20, 0, '#ffffff'); for (const [dx, dy] of [[-28, -20], [-10, -32], [10, -32], [28, -20]]) E(ctx, dx, dy, 9, 10, 0, '#ffffff'); ctx.restore();
  ctx.restore();
  bloom(ctx, 0.25, 24); grade(ctx, { vig: 0.45, seed: 75 });
}

function render(t) {
  const s = TL.shots.find((x) => t >= x.start && t < x.end) || TL.shots[TL.shots.length - 1];
  const lt = t - s.start;
  ctx.save(); ctx.clearRect(0, 0, W, H);
  if (s.id === 1) shot1(t);
  if (s.id === 2) shot2(t);
  if (s.id === 3) { shot2(s.start - 0.01); ctx.filter = 'blur(6px) brightness(0.65)'; ctx.drawImage(cv, 0, 0); ctx.filter = 'none'; }
  if (s.id === 4) shot4(t);
  if (s.id === 5) shot5(t, lt);
  if (s.id === 6) { shot5(s.start - 0.01, 3.99); ctx.filter = 'blur(6px) brightness(0.65)'; ctx.drawImage(cv, 0, 0); ctx.filter = 'none'; }
  ctx.restore();
  pixelate(ctx, 4, 12);
  if (s.id === 1) { const lab = ['SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA']; const zk = ease((t - B.zoom) / 0.7);
    if (zk < 1) { ctx.save(); ctx.globalAlpha = 1 - zk; ctx.lineWidth = 8; ctx.strokeStyle = '#111'; PANELS.forEach(([x, y], i) => { if (t > TL.panels[i]) ctx.strokeRect(x, y, PW, PH); }); ctx.restore(); }
    PANELS.forEach(([x, y], i) => { if (zk > 0) return; captionAt(ctx, t, TL.panels[i] + 0.2, x + 20, y + 20, lab[i]); }); }
  if (s.id === 2) { speech(ctx, (t - B.ali) / 0.25, 560, 200, 380, 420, ['ALI.'], 80);
    const tr = (k) => sfx(ctx, 'TEC', 0, 0, 0, 0, 0); const go = t - B.go;
    sfx(ctx, 'TEC', 980, 720, 52, -0.1, (go - 0.3) / 0.15); sfx(ctx, 'TEC!', 1120, 640, 56, 0.08, (go - 0.7) / 0.15);
    sfx(ctx, 'PLOFT', BX2 + 140, BY2 - 330, 76, -0.08, (t - B.land) / 0.2, ['#ffffff', '#c8c8d8'], '#5a5a7a'); }
  if (s.id === 3) card(ctx, (t - B.card1) / 0.8, CARD1);
  if (s.id === 6) card(ctx, (t - B.card2) / 0.8, CARD2);
}
window.render = render;
window.__ready = true;
