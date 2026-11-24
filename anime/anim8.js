// Scene 8 "A chuva e a esquina": render(t), pure in t.
window.ANIM = true; window.NO_RAIN = true; window.NO_CAP = true;
await import('./shots.js');
await document.fonts.load('40px PS2P');
const { W, H, off, rng, glow, grade, bloom, caption_, thick, shots, pixelate, post, rimSil } = window.SH;
const TL = await (await fetch('timeline8.json')).json();
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


// ================= Scene 8 "A chuva e a esquina" =================
const { rain: rainFx, drawCar, poly } = window.SH;
const layer = (fn, w = W, h = H) => { const [c, g] = off(w, h); fn(g); return c; };
const DOG = dogSit(0), DOGB = dogSit(1);
const noEars = (src) => src.split('\n').filter((l) => !l.includes('// folded ear') && !l.includes('// ear up') && !l.includes("g.moveTo(HX + 6, HY - 74)")).join('\n');
const dogSitNE = eval('(' + noEars(dogSit.toString()) + ')'); const DOGNE = dogSitNE(0);
const NEON = ['#ff3cac', '#3cf2ff', '#ffd23c', '#5dff7a', '#b06bff'];
const night = (g, a = 0.35) => { g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = `rgba(70,60,140,${a})`; g.fillRect(0, 0, W, H); g.restore(); };

// ---------- shot 1: straight down on the crossing ----------
const DROPS = (() => { const r = rng(8802); return Array.from({ length: 900 }, () => ({ x: r() * W, y: r() * H, t0: 7 * Math.sqrt(r()), s: 0.6 + r() * 0.8 })); })();
// low camera at a puddle; his shoes step in and break the reflection
const PGY = 770, PUD = [980, 830, 760, 150], TW0 = 3.4, WX0 = -520, WV = 506, WS = 2.2, PH0 = 0;
const manX = (t) => WX0 + (t - TW0) * WV, manPh = (t) => (t - TW0) * 4.2 + PH0;
const STRIKES = (() => { const out = []; for (let n = 0; n < 12; n++) { const ph = Math.PI / 2 + n * Math.PI, t = TW0 + (ph - PH0) / 4.2, x = manX(t) + 326; if (Math.abs(x - PUD[0]) / PUD[2] < 0.85) out.push([t, x]); } return out; })();
let BG8A = null, GR8A = null;
const PUDP = (() => { const p2 = new Path2D(); p2.ellipse(PUD[0], PUD[1], PUD[2], PUD[3], 0, 0, 7); p2.ellipse(PUD[0] - 520, PUD[1] + 60, 300, 90, 0.1, 0, 7); p2.ellipse(PUD[0] + 560, PUD[1] - 20, 260, 70, -0.08, 0, 7); return p2; })();
function shot1(t, lt) {
  if (!BG8A) { BG8A = layer((g) => { g.fillStyle = '#07061a'; g.fillRect(0, 0, W, H); g.save(); g.filter = 'blur(7px)'; g.translate(0, 60); g.drawImage(ACROSS, -96, -60, W * 1.1, H * 1.1); g.restore(); });
    GR8A = layer((g) => { const r = rng(8811); const gr = g.createLinearGradient(0, 640, 0, H); gr.addColorStop(0, 'rgba(30,18,50,0)'); gr.addColorStop(0.15, '#24163a'); gr.addColorStop(1, '#0c0716'); g.fillStyle = gr; g.fillRect(0, 640, W, H - 640);
      for (let k = 0; k < 14000; k++) { const y = 680 + r() * 400; g.fillStyle = r() > 0.5 ? 'rgba(90,70,130,0.35)' : 'rgba(0,0,0,0.4)'; const sz = 1 + (y - 680) / 120 + r() * 2; g.fillRect(r() * W, y, sz, sz * 0.7); }
      const [rc, rg] = off(); rg.filter = 'blur(18px)'; for (const [x, c] of [[380, '#5dff7a'], [900, '#ff3cac'], [1440, '#ffc46a'], [1700, '#3cf2ff']]) { rg.fillStyle = c; rg.globalAlpha = 0.35; rg.fillRect(x - 60, 700, 120, 380); } g.save(); g.globalCompositeOperation = 'lighter'; g.drawImage(rc, 0, 0); g.restore(); }); }
  ctx.drawImage(BG8A, 0, 0); ctx.drawImage(GR8A, 0, 0);
  const x = manX(t), ph = manPh(t), walking = t > TW0 - 0.2;
  // reflection: neon sky squeezed + his legs mirrored at the contact line
  const hits = STRIKES.filter(([ts]) => t > ts);
  const amp = 4 + 2 * lt + hits.reduce((a, [ts]) => a + 60 * Math.exp(-(t - ts) * 2.2), 0);
  const [rc, rg] = off();
  rg.save(); rg.translate(0, PGY - 100 + 620 * 0.62); rg.scale(1, -0.62); rg.drawImage(BG8A, 0, 0, W, 620, 0, 0, W, 620); rg.restore();
  if (walking) { rg.save(); rg.translate(0, 2 * PGY); rg.scale(1, -1); otavio(rg, x, PGY, WS, ph, 0.35); rg.restore(); }
  ctx.save(); ctx.clip(PUDP);
  ctx.fillStyle = '#0a0618'; ctx.fillRect(0, 0, W, H);
  for (let y = PUD[1] - PUD[3]; y < PUD[1] + PUD[3]; y += 6) { const off2 = Math.sin(y * 0.09 + t * 7) * amp * 0.5 + Math.sin(y * 0.031 - t * 3) * amp * 0.5; ctx.drawImage(rc, 0, y, W, 6, off2, y, W, 6); }
  ctx.fillStyle = 'rgba(40,60,140,0.18)'; ctx.fillRect(0, 0, W, H);
  for (const [ts, sx] of hits) for (let i = 0; i < 3; i++) { const k = (t - ts - i * 0.12) / 1.2; if (k > 0 && k < 1) { ctx.strokeStyle = `rgba(230,240,255,${0.8 * (1 - k)})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(sx, PGY + 6, 30 + k * 420, (30 + k * 420) * 0.2, 0, 0, 7); ctx.stroke(); } }
  ctx.restore();
  ctx.save(); ctx.filter = 'blur(6px)'; ctx.strokeStyle = 'rgba(20,12,36,0.9)'; ctx.lineWidth = 16; ctx.stroke(PUDP); ctx.restore();
  // drops ringing on the wet ground, more and more
  for (const d of DROPS) { const k = (t - d.t0) / 0.6; if (k < 0 || k > 1) continue; const y = 690 + (d.y / H) * 390, sc2 = 0.4 + (y - 690) / 390; ctx.strokeStyle = `rgba(200,220,255,${0.55 * (1 - k)})`; ctx.lineWidth = 1.5 + sc2; ctx.beginPath(); ctx.ellipse(d.x, y, (4 + 30 * k * d.s) * sc2, (4 + 30 * k * d.s) * sc2 * 0.25, 0, 0, 7); ctx.stroke(); }
  if (walking) otavio(ctx, x, PGY, WS, ph, 0.35);
  // splash drops thrown up by each step
  for (const [ts, sx] of hits) { const k = t - ts; if (k > 0.9) continue; const r = rng(Math.floor(ts * 100)); for (let i = 0; i < 26; i++) { const a = -Math.PI * (0.1 + r() * 0.8), v = 300 + r() * 500, px = sx + Math.cos(a) * v * k, py = PGY + Math.sin(a) * v * k + 1400 * k * k; if (py > PGY + 20) continue; E(ctx, px, py, 4 + r() * 5, 6 + r() * 6, 0, 'rgba(220,235,255,0.85)'); } }
  rainFx(ctx, rng(Math.floor(t * 24)), { n: 500 + Math.floor(lt * 120), len: [30, 60], a: [0.15, 0.35], w: [1, 1.8] });
  bloom(ctx, 0.4, 24); grade(ctx, { vig: 0.6, seed: 81 });
}

// ---------- shot 2: from behind at the crossing ----------
const AWX = 1440, AWY = 560; // padaria awning across the street
const ACROSS = layer((g) => {
  const r = rng(8803);
  const sk = g.createLinearGradient(0, 0, 0, 560); sk.addColorStop(0, '#07061a'); sk.addColorStop(0.7, '#2a1250'); sk.addColorStop(1, '#7a2a6a'); g.fillStyle = sk; g.fillRect(0, 0, W, 600);
  for (let x = -40; x < W;) { const w = 160 + r() * 220, h = 260 + r() * 300; g.fillStyle = ['#1a1030', '#160d2c', '#20143a'][Math.floor(r() * 3)]; g.fillRect(x, 620 - h, w, h + 20);
    for (let y = 620 - h + 30; y < 560; y += 70) for (let xx = x + 20; xx < x + w - 40; xx += 60) if (r() > 0.45) { const c = ['#ffc46a', '#ffe3a0', '#ff8ad0', '#7af0ff'][Math.floor(r() * 4)]; g.fillStyle = c; g.fillRect(xx, y, 30, 36); glow(g, xx + 15, y + 18, 50, c, 0.25); }
    x += w + 4; }
  // neon signs
  g.save(); g.font = '64px Bangers'; g.textAlign = 'center'; for (const [x, y, txt, c] of [[380, 300, 'FARMÁCIA', '#5dff7a'], [900, 250, 'BAR', '#ff3cac']]) { g.shadowColor = c; g.shadowBlur = 36; g.fillStyle = c; g.fillText(txt, x, y); g.fillStyle = '#ffffff'; g.globalAlpha = 0.6; g.fillText(txt, x, y); g.globalAlpha = 1; } g.restore();
  // padaria front with awning, warm light
  g.fillStyle = '#ffd890'; g.fillRect(AWX - 200, AWY - 120, 400, 140); glow(g, AWX, AWY - 40, 300, 'rgba(255,200,120,0.8)', 0.6);
  for (let k = 0; k < 9; k++) { g.fillStyle = k % 2 ? '#e8e0f0' : '#c0392b'; g.beginPath(); g.moveTo(AWX - 230 + k * 51, AWY - 170); g.lineTo(AWX - 179 + k * 51, AWY - 170); g.lineTo(AWX - 179 + k * 51, AWY - 130); g.arc(AWX - 204 + k * 51, AWY - 130, 25.5, 0, Math.PI); g.closePath(); g.fill(); }
  g.save(); g.font = '40px Bangers'; g.textAlign = 'center'; g.shadowColor = '#ffd23c'; g.shadowBlur = 24; g.fillStyle = '#ffe9a0'; g.fillText('PADARIA', AWX, AWY - 186); g.restore();
  // far sidewalk + road with crosswalk in perspective
  g.fillStyle = '#2a2038'; g.fillRect(0, 590, W, 40);
  const rd = g.createLinearGradient(0, 630, 0, H); rd.addColorStop(0, '#3a1a4a'); rd.addColorStop(1, '#0a0614'); g.fillStyle = rd; g.fillRect(0, 630, W, H - 630);
  for (let k = -6; k <= 6; k++) { const x0 = 960 + k * 70, x1 = 960 + k * 230; g.fillStyle = 'rgba(220,215,235,0.75)'; g.beginPath(); g.moveTo(x0 - 22, 640); g.lineTo(x0 + 22, 640); g.lineTo(x1 + 72, H); g.lineTo(x1 - 72, H); g.closePath(); g.fill(); }
  // reflections
  const [rc, rg] = off(); rg.filter = 'blur(16px)'; for (const [x, c, w] of [[380, '#5dff7a', 220], [900, '#ff3cac', 140], [AWX, '#ffc46a', 300]]) { rg.fillStyle = c; rg.globalAlpha = 0.45; rg.fillRect(x - w / 2, 660, w, 420); } g.save(); g.globalCompositeOperation = 'lighter'; g.drawImage(rc, 0, 0); g.restore();
});
function backMan(g, x, y, s, t) { // Otávio from behind, head down at the phone
  g.save(); g.translate(x, y); g.scale(s, s);
  const C = '#a08a62', CS = '#7e6a48';
  for (const dx of [-60, 60]) { g.fillStyle = '#1c2238'; g.fillRect(dx - 34, 260, 68, 300); }
  g.fillStyle = C; g.beginPath(); g.moveTo(-170, -120); g.quadraticCurveTo(0, -170, 170, -120); g.lineTo(200, 330); g.quadraticCurveTo(0, 350, -200, 330); g.closePath(); g.fill();
  g.fillStyle = CS; g.beginPath(); g.moveTo(0, -150); g.lineTo(10, 340); g.lineTo(-200, 330); g.lineTo(-170, -120); g.closePath(); g.globalAlpha = 0.5; g.fill(); g.globalAlpha = 1;
  g.strokeStyle = 'rgba(60,50,70,0.5)'; g.lineWidth = 4; for (let k = 0; k < 7; k++) { g.beginPath(); g.moveTo(-150 + k * 50, -110); g.lineTo(-160 + k * 55, 320); g.stroke(); } // wet streaks
  g.fillStyle = '#4d515a'; g.beginPath(); g.roundRect(-110, -90, 220, 300, 40); g.fill(); g.fillStyle = '#3a3e46'; g.beginPath(); g.roundRect(-90, 90, 180, 100, 26); g.fill(); g.fillStyle = 'rgba(150,200,255,0.3)'; g.fillRect(-96, -80, 12, 270);
  for (const sx of [-1, 1]) { g.fillStyle = CS; g.beginPath(); g.ellipse(sx * 185, 0, 50, 140, sx * 0.18, 0, 7); g.fill(); }
  g.fillStyle = '#b8343a'; g.beginPath(); g.roundRect(-90, -190, 180, 70, 30); g.fill(); g.fillStyle = '#86242c'; g.fillRect(-90, -140, 180, 14);
  g.fillStyle = '#b8343a'; g.beginPath(); g.moveTo(40, -150); g.quadraticCurveTo(70 + Math.sin(t * 3) * 6, -40, 50, 60); g.lineTo(90, 60); g.quadraticCurveTo(100, -40, 80, -150); g.closePath(); g.fill();
  // head bowed: we see mostly hair
  E(g, -96, -250, 22, 34, 0, '#d39a78'); E(g, 96, -250, 22, 34, 0, '#d39a78');
  E(g, 0, -270, 100, 96, 0, '#2a2024');
  for (let k = 0; k < 9; k++) { const a = Math.PI + k * Math.PI / 8; g.save(); g.translate(Math.cos(a) * 88, -280 + Math.sin(a) * 84); g.rotate(a + Math.PI / 2); g.fillStyle = '#2a2024'; g.beginPath(); g.moveTo(-18, 6); g.lineTo(0, -34); g.lineTo(18, 6); g.closePath(); g.fill(); g.restore(); }
  g.strokeStyle = '#4e3e44'; g.lineWidth = 6; g.beginPath(); g.arc(-10, -290, 60, Math.PI * 1.15, Math.PI * 1.5); g.stroke();
  for (let k = 0; k < 14; k++) { const r = rng(8804 + k); E(g, -80 + r() * 160, -340 + r() * 140, 4, 6, 0, 'rgba(200,230,255,0.7)'); } // raindrops on hair
  g.restore();
  // phone glow spilling around the head
  glow(g, x, y + s * -330, 260 * s, 'rgba(140,220,255,0.9)', 0.55);
}
function shot2(t, lt, zoom = 1, zc = [AWX, AWY]) {
  ctx.save(); ctx.translate(zc[0], zc[1]); ctx.scale(zoom, zoom); ctx.translate(-zc[0], -zc[1]);
  ctx.drawImage(ACROSS, 0, 0);
  drawDog(ctx, (t % 3.2) < 0.12 ? DOGB : DOG, AWX + 30, AWY + 20, 0.16, true, Math.sin(t * 3) * 0.2);
  ctx.restore();
  if (zoom < 1.6) { backMan(ctx, 700 - (zoom - 1) * 900, 860 + 20 * Math.sin(lt * 0.5), 1.25 * (1 + (zoom - 1) * 0.8), t); }
  rainFx(ctx, rng(Math.floor(t * 24)), { n: 1000, len: [30, 60], a: [0.15, 0.35], w: [1, 1.6] });
  rainFx(ctx, rng(Math.floor(t * 24) + 7), { n: 60, len: [120, 200], a: [0.12, 0.3], w: [2, 4] });
  bloom(ctx, 0.4, 24); grade(ctx, { vig: 0.6, seed: 82 });
}

// ---------- shot 3: close on Caramelo, ears go up ----------
const BOKEH = layer((g) => { const r = rng(8805); g.fillStyle = '#120a24'; g.fillRect(0, 0, W, H); g.filter = 'blur(26px)'; for (let k = 0; k < 40; k++) { g.globalAlpha = 0.35 + r() * 0.4; g.fillStyle = NEON[k % 5]; g.beginPath(); g.arc(r() * W, r() * H, 30 + r() * 90, 0, 7); g.fill(); } g.filter = 'none'; g.globalAlpha = 1; glow(g, 1500, 200, 900, 'rgba(255,190,110,0.8)', 0.5); });
function ears(g, k) { // in dog-canvas coords; k: 0 = relaxed, 1 = up
  const HX = 410, HY = 280, a = (1 - k) * -0.9;
  g.save(); g.translate(HX + 20, HY - 66); g.rotate(a);
  g.fillStyle = '#cf8436'; g.beginPath(); g.moveTo(-30, -4); g.lineTo(-2, -104); g.lineTo(35, 4); g.closePath(); g.fill();
  g.fillStyle = '#f2a0a8'; g.beginPath(); g.moveTo(-14, -8); g.lineTo(0, -74); g.lineTo(22, -4); g.closePath(); g.fill(); g.restore();
  g.save(); g.translate(HX - 55, HY - 25); g.rotate((1 - k) * 0.35 - k * 0.25); g.fillStyle = '#a8601f'; g.beginPath(); g.moveTo(-15, -15); g.quadraticCurveTo(-75, 15, -55, 85); g.quadraticCurveTo(-25, 45, 15, 15); g.closePath(); g.fill(); g.restore();
}
function shot3close(t) {
  ctx.drawImage(BOKEH, 0, 0);
  const ek = t < B.ears ? 0 : back((t - B.ears) / 0.25);
  const [dc, dg] = off(700, 760); dg.drawImage(DOGNE, 0, 0); ears(dg, ek);
  if (ek > 0.5) { E(dg, 440, 272, 8, 8, 0, '#ffffff'); }
  const s = 2.4, zoomIn = 1 + 0.06 * ease((t - B.closeIn) / 3);
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(zoomIn, zoomIn); ctx.translate(-W / 2, -H / 2);
  const ax = 900 + 80 * s, ay = 600 + 440 * s; ctx.save(); ctx.translate(ax, ay); ctx.scale(-s, s); ctx.drawImage(dc, -330, -720); ctx.restore();
  // neon spill: pink from the left, cyan rim
  ctx.save(); ctx.globalCompositeOperation = 'soft-light'; const ng2 = ctx.createLinearGradient(0, 0, W, 0); ng2.addColorStop(0, 'rgba(255,60,172,0.8)'); ng2.addColorStop(1, 'rgba(60,242,255,0.5)'); ctx.fillStyle = ng2; ctx.fillRect(0, 0, W, H); ctx.restore();
  ctx.restore();
  // awning edge dripping at the top
  ctx.fillStyle = '#7a1a1a'; ctx.fillRect(0, 0, W, 70); for (let k = 0; k < 24; k++) { ctx.fillStyle = k % 2 ? '#c8c0d0' : '#a02a2a'; ctx.beginPath(); ctx.arc(k * 84 + 42, 70, 42, 0, Math.PI); ctx.fill(); const dk = ((t * 1.3 + k * 0.37) % 1); E(ctx, k * 84 + 42, 112 + dk * 900, 4, 9, 0, `rgba(200,230,255,${0.8 * (1 - dk)})`); }
  rainFx(ctx, rng(Math.floor(t * 24)), { n: 500, len: [40, 80], a: [0.1, 0.3], w: [1, 2] });
  bloom(ctx, 0.35, 22); grade(ctx, { vig: 0.55, seed: 83 });
}

// ---------- shot 4: the corner, headlights ----------
const CORNER = layer((g) => {
  const r = rng(8806);
  const sk = g.createLinearGradient(0, 0, 0, 620); sk.addColorStop(0, '#07061a'); sk.addColorStop(1, '#3a1650'); g.fillStyle = sk; g.fillRect(0, 0, W, 640);
  // street going away to the left behind a corner building
  for (let x = 0; x < 900;) { const w = 60 + r() * 120, h = 120 + r() * 220; g.fillStyle = '#140a28'; g.fillRect(x, 600 - h, w, h); for (let k = 0; k < 6; k++) if (r() > 0.5) { g.fillStyle = NEON[Math.floor(r() * 5)]; g.globalAlpha = 0.6; g.fillRect(x + r() * (w - 10), 600 - h + 10 + r() * (h - 30), 7, 9); g.globalAlpha = 1; } x += w + 4; }
  poly(g, [[880, 0], [1920, 0], [1920, 760], [880, 640]], '#1a1030'); poly(g, [[860, 30], [880, 0], [880, 640], [860, 620]], '#0c0618');
  for (let y = 60; y < 600; y += 95) for (let x = 940; x < 1880; x += 140) { const lit = r() > 0.45; g.fillStyle = lit ? ['#ffc46a', '#ffe3a0', '#ff8ad0'][Math.floor(r() * 3)] : '#0c0818'; g.fillRect(x, y + (x - 880) * 0.1, 70, 56); }
  g.save(); g.shadowColor = '#3cf2ff'; g.shadowBlur = 40; g.strokeStyle = '#3cf2ff'; g.lineWidth = 6; g.strokeRect(1100, 380, 420, 100); g.font = '64px Bangers'; g.fillStyle = '#bff8ff'; g.textAlign = 'center'; g.fillText('LANCHONETE', 1310, 452); g.restore();
  const rd = g.createLinearGradient(0, 600, 0, H); rd.addColorStop(0, '#3a1a4a'); rd.addColorStop(1, '#07040e'); g.fillStyle = rd; g.beginPath(); g.moveTo(0, 600); g.lineTo(880, 640); g.lineTo(1920, 1080); g.lineTo(0, 1080); g.closePath(); g.fill();
  g.fillStyle = '#2a1a3a'; g.beginPath(); g.moveTo(880, 640); g.lineTo(1920, 760); g.lineTo(1920, 1080); g.closePath(); g.fill();
  for (let k = 0; k < 7; k++) { const a = 600 + k * 70; g.fillStyle = 'rgba(220,215,235,0.6)'; g.beginPath(); g.moveTo(600 + k * 40, 700 + k * 52); g.lineTo(1100 + k * 120, 760 + k * 62); g.lineTo(1100 + k * 120, 782 + k * 66); g.lineTo(600 + k * 40, 718 + k * 56); g.closePath(); g.fill(); }
});
function car4(g, t) { // turns the corner from the left street, ends facing the camera
  const k = clamp((t - B.car) / (B.flare + 0.6 - B.car)), turn = ease(clamp(k / 0.55)), th = (1 - turn) * (Math.PI / 2) * 0.95;
  const sc = 40 + 260 * k * k, O = [380 + 520 * k, 640 + 260 * k * k];
  const u = [Math.cos(th) * sc, Math.sin(th) * sc * 0.35], v = [-Math.sin(th) * sc, Math.cos(th) * sc * -0.35 * 0.8], up = [0, -sc * 1.1];
  const p = drawCar(g, O, u, v, up, { neon: ['#ff3cac', '#3cf2ff'] });
  g.save(); g.globalCompositeOperation = 'lighter'; for (const a of [0.2, 1.52]) { const [x, y] = p(a, 0, 0.6); glow(g, x, y, 120 + sc * 1.6, 'rgba(255,245,210,0.95)', 0.9); } g.restore();
  return p;
}
function shot4(t, lt) {
  ctx.drawImage(CORNER, 0, 0);
  // beams sweep across the corner building before the car shows
  const bk = clamp((t - B.beams) / (B.car - B.beams)); if (bk > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const x = 880 + bk * 700; const bg = ctx.createRadialGradient(x, 520, 20, x, 520, 420 + bk * 200); bg.addColorStop(0, `rgba(255,245,210,${0.5 * bk})`); bg.addColorStop(1, 'rgba(255,245,210,0)'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    const fl = ctx.createLinearGradient(0, 600, 0, 700); fl.addColorStop(0, `rgba(255,240,200,${0.6 * bk})`); fl.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = fl; ctx.beginPath(); ctx.moveTo(500, 610); ctx.lineTo(880, 640); ctx.lineTo(880, 720); ctx.lineTo(300, 700); ctx.closePath(); ctx.fill(); ctx.restore(); }
  if (t > B.car) car4(ctx, t);
  // Otávio, small, from behind at the right, still on the phone
  ctx.save(); backMan(ctx, 1500, 900, 0.42, t); ctx.restore();
  rainFx(ctx, rng(Math.floor(t * 24)), { n: 1100, len: [30, 60], a: [0.15, 0.35], w: [1, 1.6] });
  // flare: the lights take the frame
  const fk = clamp((t - B.flare) / (B.black - B.flare)); if (fk > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; glow(ctx, 900, 800, 400 + fk * 2200, 'rgba(255,250,235,1)', fk); ctx.restore(); ctx.fillStyle = `rgba(255,252,240,${fk ** 2})`; ctx.fillRect(0, 0, W, H); }
  bloom(ctx, 0.45, 24); grade(ctx, { vig: 0.6, seed: 84 });
}

// ---------- HQ helpers ----------
const PIXI = { bang1: ['XX', 'XX', 'XX', 'XX', '..', 'XX'], bill: ['XXXXXX', 'X....X', 'X.XX.X', 'X....X', 'X.XX.X', 'X....X', 'XXXXXX'], clock: ['.XXXX.', 'X..X.X', 'X..X.X', 'X..XXX', 'X....X', '.XXXX.'], plate: ['X.XXXX.X', 'X.X..X.X', 'XXX..XXX', '.X.XX.X.', '.X....X.', '.X.XX.X.'], bang: ['XX.XX', 'XX.XX', 'XX.XX', 'XX.XX', '.....', 'XX.XX'] };
function pixIcon(g, name, cx, cy, sz, col) { const rows = PIXI[name], w = rows[0].length, h = rows.length; rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch === 'X') { g.fillStyle = col; g.fillRect(cx + (i - w / 2) * sz, cy + (j - h / 2) * sz, sz, sz); } })); }
function thoughtWorries(g, k, cx, cy, tx, ty) {
  balloon(g, k, cx, cy, 760, 300, tx, ty, () => {
    pixIcon(g, 'bill', cx - 200, cy - 50, 12, '#3a8a4a'); pixIcon(g, 'clock', cx, cy - 50, 12, '#d8343c'); pixIcon(g, 'plate', cx + 200, cy - 50, 11, '#5a5e72');
    g.fillStyle = '#111'; g.font = '50px Bangers'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('CONTAS... PRAZO... JANTAR...', cx, cy + 70);
  }, true);
}
function tsss(g, t) { const r = rng(8807); for (let i = 0; i < 6; i++) { const t0 = B.tsss + i * 0.9, x = 160 + r() * 1600, y = 120 + r() * 840, sz = 26 + r() * 14; const k = (t - t0) / 0.3; if (k > 0) sfx(g, 'TSSSSHHH', x, y, sz, (r() - 0.5) * 0.3, Math.min(k, 1), ['#e8f0ff', '#8aa0d8'], '#2a3a6a'); } }

function render(t) {
  const s = TL.shots.find((x) => t >= x.start && t < x.end) || TL.shots[TL.shots.length - 1];
  const lt = t - s.start;
  ctx.save(); ctx.clearRect(0, 0, W, H);
  if (s.id === 1) shot1(t, lt);
  if (s.id === 2) shot2(t, lt);
  if (s.id === 3) { if (t < B.closeIn) { const zk = easeOut((t - B.crash) / 0.5); shot2(t, lt + 8, 1 + 3.2 * zk, [AWX + 30, AWY - 20]); } else shot3close(t); }
  if (s.id === 4) { if (t < B.black) shot4(t, lt); else { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); } }
  ctx.restore();
  if (!(s.id === 4 && t >= B.black)) pixelate(ctx, 4, 12);
  if (s.id === 1) tsss(ctx, t);
  if (s.id === 2) thoughtWorries(ctx, (t - B.think) / 0.4, 1180, 220, 760, 470);
  if (s.id === 3 && t >= B.closeIn) balloon(ctx, (t - B.bang) / 0.25, 1460, 260, 210, 170, 1180, 420, () => { pixIcon(ctx, 'bang1', 1460 - 30, 260, 14, '#d8343c'); pixIcon(ctx, 'bang1', 1460 + 30, 260, 14, '#d8343c'); });
  if (s.id === 4 && t < B.black) [...'VRRRRRMMM'].forEach((ch, i) => { const k = (t - B.vrrm - i * 0.22) / 0.2; if (k > 0) sfx(ctx, ch, 180 + i * 175 * (0.7 + i * 0.06), 200 + Math.sin(i * 1.3) * 30, 40 + i * 15, Math.sin(i * 2.1) * 0.12, k, ['#fff3c8', '#ff8a1e'], '#8a1a2a'); });
}
window.render = render;
window.__ready = true;
