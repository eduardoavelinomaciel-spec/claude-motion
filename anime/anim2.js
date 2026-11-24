// Scene 2 "A rua é a casa dele": render(t), pure in t.
window.ANIM = true; window.NO_RAIN = true; window.NO_CAP = true;
await import('./shots.js');
await document.fonts.load('40px PS2P');
const { W, H, off, rng, glow, grade, bloom, caption_, thick, shots, pixelate, post } = window.SH;
const TL = await (await fetch('timeline2.json')).json();
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

// ---------- kids (anime style, running left) ----------
const KIDS = [
  { skin: '#f1c39a', skinS: '#d49a72', hair: '#2a1a14', hairL: '#5a3a2a', shirt: '#ffffff', bottom: '#2a4a9a', pack: '#e0403e', iris: '#5a3a1a', girl: false },
  { skin: '#a8704a', skinS: '#8a5434', hair: '#1a0e0a', hairL: '#4a2a1a', shirt: '#ffffff', bottom: '#2a4a9a', pack: '#3aa860', iris: '#3a2210', girl: true },
];
function kid(g, x, y, s, ph, k) {
  const K = KIDS[k], sw = Math.sin(ph), bob = -Math.abs(Math.cos(ph)) * 14;
  g.save(); g.translate(x, y + bob); g.scale(s, s);
  const leg = (a, col) => { const kx = Math.sin(a) * 120, ky = 230 + Math.cos(a) * 120 - 0; const fx = kx + Math.sin(a - 0.6 * Math.max(0, -a)) * 110, fy = ky + 110; capsule(g, 0, 230, kx, ky, 46, K.skin, K.skinS); capsule(g, kx, ky, fx, fy, 40, K.skin, K.skinS); capsule(g, fx, fy - 30, fx, fy, 42, '#ffffff', '#c8c8d0'); E(g, fx - 14, fy + 10, 38, 18, 0, '#2a2a3a'); E(g, fx - 20, fy + 4, 20, 6, 0, '#5a5a6a'); };
  leg(0.6 * sw, '#000');
  const arm = (a, front) => { const ex = Math.sin(a) * 80, ey = 40 + Math.cos(a) * 80; capsule(g, 20, 40, ex + 20, ey, 34, front ? K.shirt : '#e4e4ec', '#b8b8c8'); capsule(g, ex + 20, ey, ex + 20 + Math.sin(a + 0.8) * 70, ey + Math.cos(a + 0.8) * 70, 30, K.skin, K.skinS); E(g, ex + 20 + Math.sin(a + 0.8) * 76, ey + Math.cos(a + 0.8) * 76, 18, 18, 0, K.skin); };
  arm(0.8 * sw, false);
  // backpack (behind, right side since running left)
  g.fillStyle = K.pack; g.beginPath(); g.roundRect(30, -10, 110, 160, 26); g.fill(); g.fillStyle = 'rgba(0,0,0,0.18)'; g.beginPath(); g.roundRect(40, 80, 90, 60, 16); g.fill(); g.fillStyle = 'rgba(255,255,255,0.3)'; g.fillRect(40, 0, 10, 140);
  // torso
  g.fillStyle = K.shirt; g.beginPath(); g.roundRect(-55, -10, 110, 170, 30); g.fill(); g.strokeStyle = '#c8c8d8'; g.lineWidth = 4; g.stroke();
  g.fillStyle = K.bottom; if (K.girl) { g.beginPath(); g.moveTo(-60, 140); g.lineTo(60, 140); g.lineTo(80, 250); g.lineTo(-80, 250); g.closePath(); g.fill(); } else { g.beginPath(); g.roundRect(-58, 140, 116, 100, 14); g.fill(); }
  g.fillStyle = K.pack; g.fillRect(25, -5, 14, 120);
  leg(-0.6 * sw);
  // head (3/4 facing left)
  g.save(); g.translate(-8, -90); g.rotate(-0.05 + 0.03 * sw);
  // hair back + pigtails
  if (K.girl) for (const [px, py] of [[78, -10], [60, 40]]) { const bounce = Math.sin(ph * 2 + px) * 10; E(g, px + 30, py + bounce, 34, 50, 0.6, K.hair); E(g, px + 22, py - 10 + bounce, 12, 22, 0.6, K.hairL); g.fillStyle = '#ff6a9a'; g.beginPath(); g.arc(px, py - 26, 10, 0, 7); g.fill(); }
  E(g, 10, -10, 108, 104, 0, K.hair);
  E(g, 0, 10, 92, 96, 0, K.skin); E(g, 30, 40, 52, 60, 0, K.skinS); E(g, 22, 30, 52, 60, 0, K.skin);
  E(g, 82, 20, 18, 24, 0, K.skinS); // ear
  // bangs
  g.fillStyle = K.hair; g.beginPath(); g.moveTo(-100, -10); g.quadraticCurveTo(-60, -120, 40, -110); g.quadraticCurveTo(110, -100, 104, 10);
  for (let k = 0; k < 6; k++) { const bx = 90 - k * 36; g.lineTo(bx, -10 + (k % 2) * 30); g.lineTo(bx - 18, -40); } g.closePath(); g.fill();
  g.strokeStyle = K.hairL; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.arc(-10, -40, 70, Math.PI * 1.15, Math.PI * 1.45); g.stroke();
  // eyes (anime): left eye bigger (closer)
  const eye = (ex, ey, sx) => { E(g, ex, ey, 24 * sx, 30, 0, '#ffffff'); const ir = g.createLinearGradient(0, ey - 26, 0, ey + 26); ir.addColorStop(0, '#120806'); ir.addColorStop(1, K.iris); E(g, ex - 4 * sx, ey + 3, 18 * sx, 25, 0, ir); E(g, ex - 4 * sx, ey + 4, 9 * sx, 12, 0, '#050202'); E(g, ex - 10 * sx, ey - 9, 7 * sx, 8, 0, '#ffffff'); E(g, ex + 3 * sx, ey + 14, 3, 3, 0, '#ffffff');
    g.strokeStyle = '#1a0e0a'; g.lineWidth = 7; g.beginPath(); g.ellipse(ex, ey - 2, 26 * sx, 30, 0, Math.PI * 1.08, Math.PI * 1.92); g.stroke(); };
  eye(-42, 18, 1); eye(28, 18, 0.8);
  g.strokeStyle = K.hair; g.lineWidth = 5; g.beginPath(); g.moveTo(-64, -22); g.quadraticCurveTo(-44, -32, -22, -26); g.moveTo(12, -26); g.quadraticCurveTo(30, -32, 46, -24); g.stroke();
  E(g, -56, 60, 18, 9, 0, 'rgba(255,110,120,0.45)'); E(g, 40, 60, 14, 8, 0, 'rgba(255,110,120,0.45)');
  g.fillStyle = K.skinS; g.beginPath(); g.moveTo(-14, 42); g.lineTo(-20, 52); g.lineTo(-10, 52); g.closePath(); g.fill();
  // open happy mouth (shouting)
  g.fillStyle = '#5a1a1a'; g.beginPath(); g.moveTo(-40, 70); g.quadraticCurveTo(-10, 66, 14, 70); g.quadraticCurveTo(-8, 112, -40, 70); g.closePath(); g.fill();
  E(g, -14, 92, 14, 7, 0, '#ff7a8a'); g.fillStyle = '#ffffff'; g.fillRect(-34, 70, 40, 6);
  g.restore();
  arm(-0.8 * sw, true);
  g.restore();
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

// ---------- RPG item card (drawn at pixel resolution) ----------
function rpgCard(g, k) {
  if (k <= 0) return; const [c, cg] = off(480, 270); cg.imageSmoothingEnabled = false;
  const h = Math.round(150 * easeOut(k)), x = 80, y = 135 - h / 2, w = 320;
  cg.fillStyle = '#0a1240'; cg.fillRect(x, y, w, h); cg.fillStyle = '#ffffff'; cg.fillRect(x, y, w, 2); cg.fillRect(x, y + h - 2, w, 2); cg.fillRect(x, y, 2, h); cg.fillRect(x + w - 2, y, 2, h);
  cg.fillStyle = '#5a6ad8'; cg.fillRect(x + 4, y + 4, w - 8, 1); cg.fillRect(x + 4, y + h - 5, w - 8, 1);
  if (k > 0.6) {
    const a = clamp((k - 0.6) / 0.4); cg.globalAlpha = a;
    cg.font = '8px PS2P'; cg.textBaseline = 'top'; cg.fillStyle = '#ffe066'; cg.fillText('ITEM: FARO DE CACHORRO', x + 12, y + 14);
    // nose icon
    const nose = ['.XXXX.', 'XXXXXX', 'X.XX.X', '.XXXX.']; nose.forEach((r, j) => [...r].forEach((ch, i) => { if (ch === 'X') { cg.fillStyle = '#1a1010'; cg.fillRect(x + 272 + i * 4, y + 10 + j * 4, 4, 4); } })); cg.fillStyle = '#ffffff'; cg.fillRect(x + 276, y + 12, 3, 2);
    cg.fillStyle = '#ffffff'; cg.fillText('RECEPTORES DE CHEIRO', x + 12, y + 34);
    const bar = (yy, label, val, frac, col) => { cg.fillStyle = '#cfd6ff'; cg.fillText(label, x + 12, yy); cg.fillText(val, x + 12, yy + 12); cg.fillStyle = '#1a2470'; cg.fillRect(x + 130, yy + 4, 170, 10); cg.fillStyle = col; cg.fillRect(x + 130, yy + 4, Math.max(2, Math.round(170 * frac * clamp((k - 0.6) / 0.4 * 1.2))), 10); cg.fillStyle = 'rgba(255,255,255,0.4)'; cg.fillRect(x + 130, yy + 4, Math.max(2, Math.round(170 * frac * clamp((k - 0.6) / 0.4 * 1.2))), 2); };
    bar(y + 56, 'CÃO', '300.000.000', 1, '#ffb030'); bar(y + 90, 'HUMANO', '6.000.000', 0.02, '#5ad8ff');
    cg.fillStyle = '#8a94d8'; cg.fillText('50X MAIS FARO!', x + 12, y + 124);
  }
  g.save(); g.imageSmoothingEnabled = false; g.drawImage(c, 0, 0, W, H); g.restore();
}

// ---------- caches ----------
window.S8 = { dog: 'none', shutter: 1 }; const [STREET, sg] = off(); shots[8](sg, 0); post.length = 0;
window.SHOT4_DAY = true; const [SNOUT, ng] = off(); shots[4](ng, 0); post.length = 0;
const DOG = dogSit(0), DOGB = dogSit(1);
const P1 = {}; // shot 8 per shutter step, cached lazily (sleep dog, shutter k)
function street1(k) { const key = Math.round(k * 24); if (!P1[key]) { window.S8 = { dog: 'sleep', shutter: key / 24 }; const [c, g] = off(); shots[8](g, 0); post.length = 0; P1[key] = c; } return P1[key]; }
const DOGX = 900, DOGY = 960, DOGS = 0.62;

function ribbon(g, lt, t0, dur) {
  const k = clamp((lt - t0) / dur); if (k <= 0) return; const r = rng(1201);
  const pts = []; const x0 = DOGX + 140, y0 = DOGY - 270, x1 = 1380, y1 = 560;
  for (let i = 0; i <= 80; i++) { const u = i / 80; const x = x0 + (x1 - x0) * u, y = y0 + (y1 - y0) * u - Math.sin(u * Math.PI) * 220 + Math.sin(u * 9 + lt * 2.5) * 30; pts.push([x, y]); }
  const n = Math.floor(pts.length * easeOut(k));
  g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) { const [x, y] = pts[i]; for (let j = 0; j < 3; j++) { const ox = (r() - 0.5) * 26, oy = (r() - 0.5) * 26, s = 6 + Math.round(r() * 6); g.fillStyle = `rgba(255,${200 + r() * 40},${90 + r() * 60},${0.55 + 0.4 * Math.sin(lt * 6 + i)})`; g.fillRect(Math.round(x + ox), Math.round(y + oy), s, s); } }
  glow(g, pts[Math.max(0, n - 1)][0], pts[Math.max(0, n - 1)][1], 90, 'rgba(255,220,140,0.9)', 0.7);
  g.restore();
}

function render(t) {
  const s = TL.shots.find((x) => t >= x.start && t < x.end) || TL.shots[TL.shots.length - 1];
  const lt = t - s.start, u = lt / (s.end - s.start);
  ctx.save(); ctx.clearRect(0, 0, W, H);
  const wag = (a) => Math.sin(t * 9) * a;
  if (s.id === 1) { // continuous from scene 1's last frame, pull back while the shutter rolls up
    const k = ease((t - B.shutter) / 2.2), sc = 1.06 - 0.06 * ease(u), dx = -40 * (1 - ease(u));
    cam(ctx, street1(k), sc, W / 2, H / 2, dx, 0);
  }
  if (s.id === 2) { // snout close-up sniffing (bursts of small bobs)
    const sn = (t > B.sniff1 && t < B.sniff1 + 0.7) || (t > B.sniff2 && t < B.sniff2 + 0.7) ? Math.sin(t * 40) * 5 : 0;
    cam(ctx, SNOUT, 1.04 + 0.04 * u, 960, 600, 0, sn);
  }
  if (s.id === 3 || s.id === 4 || s.id === 5 || s.id === 6) {
    const z = s.id === 5 ? 1.25 + 0.05 * u : s.id === 6 ? 1.25 : 1.0 + 0.04 * u, cx = s.id >= 5 ? DOGX : W / 2, cy = s.id >= 5 ? DOGY - 260 : H / 2;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(z, z); ctx.translate(-cx, -cy);
    ctx.drawImage(STREET, 0, 0);
    let flip = false; if (s.id === 5) { const a = t - B.look1, b = t - B.look2; flip = (a > 0 && b < 0) || b > 1.3; }
    const blink = (t % 3.7) < 0.12;
    drawDog(ctx, blink ? DOGB : DOG, DOGX, DOGY, DOGS, flip, wag(s.id === 4 ? 0.5 : 0.18));
    if (s.id === 3) ribbon(ctx, lt, 0.6, 2.6);
    ctx.restore();
    if (s.id === 4) { const k = (t - B.kidsIn) / 3.6; if (k > 0 && k < 1) { const x = 2300 - 2900 * k; kid(ctx, x, 560, 1.15, t * 9, 0); kid(ctx, x + 380, 590, 1.05, t * 9 + 1.3, 1); } }
    if (s.id === 6) { ctx.filter = 'blur(6px) brightness(0.7)'; ctx.drawImage(cv, 0, 0); ctx.filter = 'none'; }
  }
  ctx.restore();
  pixelate(ctx, 4, 12);
  // crisp HQ layer
  if (s.id === 1) sfx(ctx, 'KRRRRRR', 1380, 240, 64, -0.05, (t - B.shutter) / 0.3, ['#e8e8f0', '#9a9aa8'], '#4a4a5a');
  if (s.id === 2) { sfx(ctx, 'SNIFF', 1500, 330, 70, -0.1, (t - B.sniff1) / 0.25); sfx(ctx, 'SNIFF!', 1560, 470, 80, 0.06, (t - B.sniff2) / 0.25); }
  if (s.id === 3) icon(ctx, (t - B.bread) / 0.3, 700, 330, 930, 520, 'bread');
  if (s.id === 4) { speech(ctx, (t - B.bomdia) / 0.3, 760, 170, 980, 380, ['BOM DIA,', 'CARAMELO!'], 64); icon(ctx, (t - B.huh) / 0.3, 700, 380, 930, 540, 'q'); }
  if (s.id === 5) speech(ctx, (t - B.think) / 0.4, 1380, 220, 1120, 420, ['HOJE ALGUÉM VEM.'], 60, true);
  if (s.id === 6) rpgCard(ctx, (t - B.card) / 0.8);
}
window.render = render;
window.__ready = true;
