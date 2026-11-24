// Scene 5 "A bagunça da cidade": render(t), pure in t.
window.ANIM = true; window.NO_RAIN = true; window.NO_CAP = true;
await import('./shots.js');
await document.fonts.load('40px PS2P');
const { W, H, off, rng, glow, grade, bloom, caption_, thick, shots, pixelate, post } = window.SH;
const TL = await (await fetch('timeline5.json')).json();
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
function otavio(g, x, y, s, ph, headDown = 0.35, { lean = 0, armUp = 0, smile = 0, hop = 0, spikes = 1, wide = 0 } = {}) {
  const F = 1, bob = -Math.abs(Math.cos(ph)) * 7;
  g.save(); g.translate(x, y + bob); g.scale(s, s);
  E(g, 0, 8 - bob / s, 120, 14, 0, 'rgba(60,30,10,0.25)');
  g.translate(0, -hop); g.rotate(-lean);
  const HIP = [0, -400], SHO = [4, -650];
  const leg = (p, far) => { const th = 0.38 * Math.sin(p), knee = 0.08 + 0.75 * Math.max(0, Math.cos(p)) ** 1.6, sh = th - knee, T = 205, S = 195;
    const kx = HIP[0] + F * Math.sin(th) * T, ky = HIP[1] + Math.cos(th) * T, ax = kx + F * Math.sin(sh) * S, ay = ky + Math.cos(sh) * S;
    limb(g, HIP[0], HIP[1], kx, ky, 58, 50, far ? OT.pantsS : OT.pants, far ? null : OT.pantsS); limb(g, kx, ky, ax, ay, 50, 42, far ? OT.pantsS : OT.pants, far ? null : OT.pantsS);
    g.save(); g.translate(ax, ay + 6); g.rotate(-sh * 0.4 + (Math.cos(p) > 0.3 ? -0.2 : 0)); g.fillStyle = far ? '#3e2816' : OT.shoe; g.beginPath(); g.roundRect(-26, -16, 86, 30, 14); g.fill(); g.fillStyle = '#2a1a10'; g.fillRect(-26, 8, 86, 7); g.restore(); };
  const arm = (p, far) => { const ua = -0.32 * Math.sin(p) * (1 - armUp) + armUp * (far ? 0.9 : 1.35), fa = ua + (0.25 + 0.15 * Math.cos(p)) * (1 - armUp) + armUp * 0.5, U = 150, Fa = 140;
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
  // head (3/4 facing right, tilted down)
  g.save(); g.translate(14, -790); g.rotate(headDown);
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
  E(g, EX, EY, 16, 14, 0, '#ffffff'); const ir = g.createLinearGradient(0, EY - 12, 0, EY + 12); ir.addColorStop(0, '#120806'); ir.addColorStop(1, OT.iris); E(g, EX + 3, EY + 2, 10, 12, 0, ir); E(g, EX + 3, EY + 3, 5, 6, 0, '#050202'); E(g, EX - 1, EY - 3, 3, 3, 0, '#ffffff');
  if (!wide) { g.fillStyle = OT.skinS; g.beginPath(); g.ellipse(EX, EY - 12, 20, 11, 0, Math.PI, 0); g.fill(); } // heavy lid
  g.strokeStyle = '#1a0e0a'; g.lineWidth = 5; g.beginPath(); g.moveTo(EX - 18, EY - 6); g.quadraticCurveTo(EX, EY - 14, EX + 20, EY - 4); g.stroke();
  g.strokeStyle = 'rgba(120,70,60,0.5)'; g.lineWidth = 2; g.beginPath(); g.moveTo(EX - 12, EY + 14); g.quadraticCurveTo(EX, EY + 18, EX + 12, EY + 13); g.stroke(); // eye bag
  g.strokeStyle = OT.hair; g.lineWidth = 6; g.beginPath(); g.moveTo(EX - 20, EY - 26 - wide * 10); g.quadraticCurveTo(EX, EY - 30 - wide * 14, EX + 22, EY - 22 - wide * 10); g.stroke();
  g.strokeStyle = OT.skinS; g.lineWidth = 4; g.beginPath(); g.moveTo(66, 4); g.lineTo(74, 26); g.lineTo(62, 30); g.stroke(); // nose
  g.strokeStyle = '#8a4a40'; g.lineWidth = 4; g.beginPath(); g.moveTo(44, 50); g.quadraticCurveTo(54, 50 + smile * 8, 62, 46 - smile * 4); g.stroke(); // mouth
  g.restore();
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


// ================= Scene 5 "A bagunça da cidade" =================
const layer = (fn, w = W, h = H) => { const [c, g] = off(w, h); fn(g); return c; };
const MUD = { c: '#6e4a28', l: '#8e6a40', s: '#4a3018', w: '#9a8262', ws: '#7a6448' };
const PUDX = 7000, CANX = 4300, WALLX = 5600, PY = GROUND + 50;
// wet street at sunset, cached
const STREET5 = layer((g) => {
  const src = sideStreet(53); g.drawImage(src, 0, 0); const oy = H / 2;
  g.save(); g.beginPath(); g.rect(0, GROUND + 96 + oy, SW, H); g.clip(); g.globalAlpha = 0.28; g.filter = 'blur(3px)'; g.translate(0, GROUND + 96 + oy); g.scale(1, -1); g.drawImage(src, 0, GROUND - 460 + oy, SW, 420, 0, -420, SW, 420); g.restore();
  g.fillStyle = 'rgba(70,50,90,0.16)'; g.fillRect(0, GROUND - 40 + oy, SW, 136);
  const r = rng(5501); g.strokeStyle = 'rgba(255,210,190,0.35)'; g.lineWidth = 3; for (let k = 0; k < 300; k++) { const x = r() * SW, y = GROUND - 30 + r() * 100 + oy; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 20 + r() * 50, y); g.stroke(); }
  g.save(); g.globalCompositeOperation = 'soft-light'; const sl = g.createLinearGradient(0, 0, 0, H * 2); sl.addColorStop(0, 'rgba(255,90,150,0.8)'); sl.addColorStop(0.5, 'rgba(255,140,80,0.7)'); sl.addColorStop(1, 'rgba(120,60,140,0.6)'); g.fillStyle = sl; g.fillRect(0, 0, SW, H * 2); g.globalCompositeOperation = 'multiply'; g.fillStyle = '#ffd8c4'; g.fillRect(0, 0, SW, H * 2); g.restore();
  for (const [x, rx] of [[PUDX, 300], [1900, 140], [3700, 110], [6200, 170], [8600, 150]]) puddle(g, x, PY + oy, rx);
}, SW, H * 2);
function puddle(g, x, y, rx) { const ry = rx * 0.12; g.save(); g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7); g.clip(); const pg = g.createLinearGradient(0, y - ry, 0, y + ry); pg.addColorStop(0, '#ffb070'); pg.addColorStop(0.5, '#ff8aa8'); pg.addColorStop(1, '#8a6ad0'); g.fillStyle = pg; g.fillRect(x - rx, y - ry, rx * 2, ry * 2); g.fillStyle = 'rgba(255,250,230,0.7)'; g.fillRect(x - rx * 0.6, y - ry * 0.3, rx * 0.5, 3); g.fillRect(x + rx * 0.1, y + ry * 0.2, rx * 0.3, 2); g.restore(); g.strokeStyle = 'rgba(60,40,60,0.35)'; g.lineWidth = 3; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7); g.stroke(); }
function world(g, camX, z, groundY) { g.save(); g.fillStyle = '#ff9a8a'; g.fillRect(0, 0, W, H); g.translate(W / 2, groundY); g.scale(z, z); g.translate(-camX, -GROUND); g.drawImage(STREET5, 0, -H / 2); return () => g.restore(); }
const sunset = (g, a = 0.25) => { g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = `rgba(255,120,90,${a})`; g.fillRect(0, 0, W, H); g.restore(); };
const toScreen = (camX, z, groundY, x, y) => [W / 2 + (x - camX) * z, groundY + (y - GROUND) * z];

// ---------- pigeons ----------
const PIGS = (() => { const r = rng(5502); return Array.from({ length: 11 }, (_, i) => ({ x: 2900 + i * 34 + r() * 30, y: GROUND + 45 + r() * 30, d: r() * 0.35, vx: -120 + r() * 520, vy: 520 + r() * 380, ph: r() * 6, s: 1.15 + r() * 0.4, f: r() < 0.5 })); })();
function pigeon(g, x, y, s, flip, fly, ph) {
  g.save(); g.translate(x, y); g.scale(flip ? -s : s, s);
  if (!fly) { E(g, 0, 4, 34, 6, 0, 'rgba(40,20,30,0.25)'); g.strokeStyle = '#e0607a'; g.lineWidth = 4; g.beginPath(); g.moveTo(-4, -16); g.lineTo(-6, 0); g.moveTo(6, -16); g.lineTo(8, 0); g.stroke(); }
  const peck = fly ? 0 : Math.max(0, Math.sin(ph)) * 14;
  const wing = (a, col) => { g.save(); g.translate(-4, -38); g.rotate(a); g.fillStyle = col; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(-30, -60, -10, -96); g.quadraticCurveTo(20, -50, 22, 0); g.closePath(); g.fill(); g.fillStyle = '#3a3a48'; g.beginPath(); g.moveTo(-10, -96); g.lineTo(-2, -70); g.lineTo(-22, -76); g.closePath(); g.fill(); g.restore(); };
  if (fly) wing(-0.4 + Math.sin(ph) * 1.1, '#7a7e92');
  E(g, -6, -32, 36, 22, -0.15, '#8e92a6'); E(g, -30, -28, 18, 8, 0.3, '#5a5e72'); // body, tail
  g.save(); g.translate(22, -50 + peck); E(g, 0, 0, 15, 14, 0, '#7a7e92'); E(g, -6, 12, 13, 10, 0, '#5aa88a'); E(g, -2, 16, 10, 7, 0, '#a06ac0'); E(g, 5, -3, 4, 4, 0, '#ff8a2a'); E(g, 5, -3, 2, 2, 0, '#111'); g.fillStyle = '#f2e6d0'; g.beginPath(); g.moveTo(13, -2); g.lineTo(24, 2); g.lineTo(13, 4); g.fill(); g.restore();
  if (!fly) wing(0.9, '#9a9eb2'); else wing(0.2 + Math.sin(ph + 0.4) * 1.2, '#a6aabe');
  g.restore();
}
// ---------- trash can ----------
function can(g, x, y, rot, lidOn) { // x,y = bottom-right pivot
  g.save(); g.translate(x, y); g.rotate(rot); g.translate(-150, 0);
  const cg = g.createLinearGradient(0, 0, 150, 0); cg.addColorStop(0, '#6a7280'); cg.addColorStop(0.4, '#c8d0d8'); cg.addColorStop(1, '#58606c'); g.fillStyle = cg; g.beginPath(); g.moveTo(6, 0); g.lineTo(0, -230); g.lineTo(150, -230); g.lineTo(144, 0); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(40,44,54,0.6)'; g.lineWidth = 6; for (const yy of [-50, -115, -180]) { g.beginPath(); g.moveTo(2, yy); g.lineTo(148, yy); g.stroke(); }
  if (lidOn) { g.fillStyle = '#7a8290'; g.fillRect(-8, -246, 166, 18); E(g, 75, -252, 20, 8, 0, '#5a606c'); }
  g.restore();
}
function lid(g, x, y, spin, tilt) { g.save(); g.translate(x, y); g.rotate(tilt); const w = 84 * Math.max(0.08, Math.abs(Math.cos(spin))); E(g, 0, 0, w, 84, 0, Math.cos(spin) > 0 ? '#9aa2b0' : '#6a7280'); g.strokeStyle = '#3a404c'; g.lineWidth = 5; g.beginPath(); g.ellipse(0, 0, w, 84, 0, 0, 7); g.stroke(); g.restore(); }
// ---------- wall + fat black cat ----------
const WALL = layer((g) => { const r = rng(5503); const x0 = 0, w = 900, h = 340; g.fillStyle = '#c8b8a4'; g.fillRect(x0, 40, w, h); g.fillStyle = '#e0d2bc'; g.fillRect(x0 - 10, 20, w + 20, 26);
  for (let k = 0; k < 9000; k++) { g.fillStyle = r() > 0.5 ? 'rgba(90,70,60,0.35)' : 'rgba(255,245,230,0.4)'; g.fillRect(x0 + r() * w, 46 + r() * h, 2 + r() * 3, 2 + r() * 3); }
  g.fillStyle = 'rgba(60,40,60,0.25)'; g.fillRect(x0, 46, w, 18); g.strokeStyle = 'rgba(80,60,60,0.5)'; g.lineWidth = 3; g.beginPath(); g.moveTo(620, 60); g.lineTo(600, 180); g.lineTo(630, 260); g.stroke();
  g.fillStyle = '#3f8a4a'; for (let k = 0; k < 30; k++) { g.beginPath(); g.ellipse(820 + r() * 80, 30 + r() * 200, 16, 9, r() * 3, 0, 7); g.fill(); } }, 1000, 420);
function cat(g, x, y, s, t, eye, paw, tailSw) { // sitting loaf on the wall, facing left
  g.save(); g.translate(x, y); g.scale(s, s);
  const BK = '#1c1822', BL = '#2e2836';
  // tail hanging down the wall front
  g.lineCap = 'round'; g.strokeStyle = BK; g.lineWidth = 26; g.beginPath(); g.moveTo(90, -10); g.quadraticCurveTo(130 + tailSw * 30, 90, 100 + tailSw * 50, 170); g.quadraticCurveTo(90 + tailSw * 60, 200, 116 + tailSw * 40, 210); g.stroke();
  const bg = g.createLinearGradient(-120, 0, 140, 0); bg.addColorStop(0, BL); bg.addColorStop(0.7, BK); bg.addColorStop(1, '#4a3040'); E(g, 20, -70, 130, 82, 0, bg);
  // rim light from sunset (right)
  g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = 'rgba(255,150,90,0.55)'; g.lineWidth = 8; g.beginPath(); g.ellipse(20, -70, 126, 78, 0, -1.2, 0.8); g.stroke(); g.restore();
  // swiping paw
  if (paw > 0) { const px = -110 - paw * 120, py = -30 + paw * 70; limb(g, -60, -40, px, py, 34, 30, BK); E(g, px, py, 22, 18, 0, BK); g.strokeStyle = '#f0f0f0'; g.lineWidth = 3; for (let k = -1; k <= 1; k++) { g.beginPath(); g.moveTo(px - 18, py + k * 8); g.lineTo(px - 32, py + k * 10 + 6); g.stroke(); } }
  else E(g, -70, -8, 34, 16, 0, BL);
  // head
  g.save(); g.translate(-80, -130); E(g, 0, 0, 72, 64, 0, BK);
  for (const [ex, a] of [[-44, -0.3], [34, 0.3]]) { g.fillStyle = BK; g.beginPath(); g.moveTo(ex - 26, -40); g.lineTo(ex + Math.sin(a) * 30, -96); g.lineTo(ex + 26, -40); g.closePath(); g.fill(); g.fillStyle = '#5a3a4a'; g.beginPath(); g.moveTo(ex - 12, -46); g.lineTo(ex + Math.sin(a) * 26, -82); g.lineTo(ex + 12, -46); g.closePath(); g.fill(); }
  for (const ex of [-28, 22]) { E(g, ex, -4, 16, 15 * (0.25 + 0.75 * eye), 0, '#f2d02a'); E(g, ex, -4, 3, 13 * (0.25 + 0.75 * eye), 0, '#111'); g.fillStyle = BK; g.fillRect(ex - 18, -22, 36, 14 * (1 - eye)); E(g, ex - 5, -9, 3, 3 * eye, 0, '#fff'); }
  E(g, -4, 18, 8, 6, 0, '#d86a7a'); g.strokeStyle = '#d0d0d8'; g.lineWidth = 2; for (const d of [-1, 1]) for (const k of [0, 8]) { g.beginPath(); g.moveTo(-4 + d * 14, 20 + k); g.lineTo(-4 + d * 70, 12 + k * 2); g.stroke(); }
  g.strokeStyle = '#6a5a6a'; g.lineWidth = 3; g.beginPath(); g.moveTo(-16, 30); g.quadraticCurveTo(-4, 24, 8, 30); g.stroke();
  g.restore(); g.restore();
}
function spray(g, x, y, k, n, seed, cols, spd = 1) { if (k <= 0 || k > 1.6) return; const r = rng(seed); for (let i = 0; i < n; i++) { const a = -Math.PI * (0.1 + r() * 0.8), v = (300 + r() * 600) * spd, px = x + Math.cos(a) * v * k, py = y + Math.sin(a) * v * k + 900 * k * k, sz = 6 + r() * 12; if (py > y + 30) continue; g.fillStyle = cols[i % cols.length]; g.beginPath(); g.ellipse(px, py, sz, sz * 1.2, 0, 0, 7); g.fill(); } }

function render(t) {
  const s = TL.shots.find((x) => t >= x.start && t < x.end) || TL.shots[TL.shots.length - 1];
  const lt = t - s.start, u = lt / (s.end - s.start);
  ctx.save(); ctx.clearRect(0, 0, W, H);
  const hud = {};
  if (s.id === 1) { // wide: he walks ahead, the dog trots behind
    const ox = 1900 + t * 230, dx = ox - 760, done = world(ctx, ox - 260, 0.7, 940);
    dogTrot(ctx, dx, GROUND + 70, 0.85, t * 8);
    otavio(ctx, ox, GROUND + 30, 1.0, t * 4.2, 0.4); done();
  }
  if (s.id === 2) { // pigeons
    const dx = 2150 + lt * 260, camX = dx + 380, z = 0.8, gy = 930, done = world(ctx, camX, z, gy);
    otavio(ctx, dx + 1350, GROUND + 30, 1.0, t * 4.2, 0.4);
    const k0 = t - B.flap;
    for (const p of PIGS) { const k = k0 - p.d; if (k <= 0) pigeon(ctx, p.x, p.y, p.s, p.f, false, t * 6 + p.ph); else pigeon(ctx, p.x + p.vx * k, p.y - p.vy * k + 60 * k * k, p.s, p.vx < 0, true, k * 34 + p.ph); }
    const fr = rng(5504); for (let i = 0; i < 14; i++) { const k = k0 - 0.2; if (k <= 0) break; const fx = 2950 + fr() * 360 + Math.sin(k * 3 + i) * 30, fy = GROUND - 200 - fr() * 300 + k * 90; ctx.save(); ctx.translate(fx, fy); ctx.rotate(Math.sin(k * 4 + i)); E(ctx, 0, 0, 12, 4, 0, '#d8dae6'); ctx.restore(); }
    const stop = k0 > 0 && k0 < 0.6; dogTrot(ctx, stop ? 2150 + (B.flap - 3) * 260 : dx, GROUND + 70 - (stop ? Math.sin(k0 / 0.6 * Math.PI) * 50 : 0), 0.85, t * 9, stop ? 0 : 1, { headUp: stop ? 0.3 : 0 });
    done(); hud.flap = toScreen(camX, z, gy, 3080, GROUND - 260);
  }
  if (s.id === 3) { // trash can
    const camX = CANX + 160, z = 1.0, gy = 900, done = world(ctx, camX, z, gy);
    const stopX = CANX - 300, kTip = clamp((t - B.klang) / 0.38), tipped = t > B.klang;
    let dx = Math.min(CANX - 900 + lt * 560, stopX), hop = 0;
    if (tipped) { const k = t - B.klang; dx = stopX - 170 * easeOut(k / 0.4); hop = Math.sin(clamp(k / 0.4) * Math.PI) * 70; }
    // lid
    const lt0 = t - B.klang;
    // garbage
    if (t > B.klang + 0.38) { const k = clamp((t - B.klang - 0.38) / 0.5), r = rng(5505); for (let i = 0; i < 9; i++) { const gx = CANX + 230 + r() * 260 * k, gy2 = GROUND + 30 + r() * 30; if (i % 3 === 0) { ctx.fillStyle = '#f2d84a'; ctx.beginPath(); ctx.ellipse(gx, gy2, 26, 10, r(), 0, 7); ctx.fill(); } else { E(ctx, gx, gy2, 16, 14, 0, ['#f4f0e6', '#c8d8f0'][i % 2]); } } }
    const roll = t > B.klang + 0.38 ? 380 * (1 - Math.exp(-(t - B.klang - 0.38) * 1.2)) : 0;
    can(ctx, CANX + 75 + roll + (tipped ? 0 : 0), GROUND + 40, (Math.PI / 2) * kTip * kTip, !tipped);
    if (tipped) { const k = lt0, land = B.klong - B.klang; let lx, ly, spin, tilt;
      if (k < land) { const u2 = k / land; lx = CANX + 80 + u2 * 520; ly = GROUND - 210 - Math.sin(u2 * Math.PI) * 260 + u2 * 230; spin = k * 14; tilt = k * 3; }
      else { const k2 = k - land, decay = Math.exp(-k2 * 1.4); lx = CANX + 600; ly = GROUND + 40 - 84 * Math.max(0.12, decay); spin = k2 * (12 + 18 * (1 - decay)); tilt = (1 - decay) * 1.45 * Math.sign(Math.sin(k2 * 0.1) + 1); if (decay < 0.14) { spin = Math.PI / 2; tilt = 0; ly = GROUND + 40 - 8; } }
      if (ly >= GROUND + 32 && k > land + 1.3) { ctx.save(); ctx.translate(lx, GROUND + 38); ctx.scale(1, 0.12); E(ctx, 0, 0, 84, 84, 0, '#7a8290'); ctx.restore(); } else lid(ctx, lx, ly, spin, tilt);
      hud.klong = toScreen(camX, z, gy, CANX + 600, GROUND - 260); }
    const sniffing = t > B.sniff && !tipped;
    dogTrot(ctx, dx, GROUND + 70 - hop, 0.85, t * 10, dx < stopX && !tipped ? 1 : 0, { headUp: sniffing ? -0.25 + Math.sin(t * 30) * 0.04 : tipped ? 0.25 : 0, tuck: tipped ? clamp((t - B.klang) / 0.15) * (1 - clamp((t - B.klang - 0.3) / 0.15)) : 0 });
    done(); hud.klang = toScreen(camX, z, gy, CANX + 100, GROUND - 330);
  }
  if (s.id === 4) { // black cat on the wall
    const camX = WALLX - 300, z = 1.2, gy = 940, done = world(ctx, camX, z, gy);
    ctx.drawImage(WALL, WALLX - 450, GROUND + 40 - 380);
    const stopX = WALLX - 640, k = t - B.paf; let dx = Math.min(WALLX - 1500 + lt * 600, stopX), hop = 0;
    if (k > 0) { dx = stopX - 150 * easeOut(k / 0.35); hop = Math.sin(clamp(k / 0.35) * Math.PI) * 40; if (t > B.sweat + 0.6) dx -= (t - B.sweat - 0.6) * 140; }
    const up = t > B.sniffUp && k < 0 ? ease((t - B.sniffUp) / 0.4) : 0;
    ctx.save(); ctx.translate(dx - 100 * 0.85, GROUND + 70); ctx.rotate(-0.18 * up); ctx.translate(-(dx - 100 * 0.85), -(GROUND + 70));
    dogTrot(ctx, dx, GROUND + 70 - hop, 0.85, t * 9, dx < stopX && k < 0 ? 1 : t > B.sweat + 0.6 ? 0.6 : 0, { headUp: up * 0.5 + (k > 0 && k < 0.4 ? -0.3 : 0), tuck: k > 0 && k < 0.3 ? 1 : 0 });
    ctx.restore();
    const eye = t < B.catEye ? 0.15 : t < B.sweat + 0.8 ? 1 : 0.2, paw = k > 0 && k < 0.45 ? Math.sin(clamp(k / 0.45) * Math.PI) : 0;
    cat(ctx, WALLX - 230, GROUND - 330, 1.0, t, eye, paw, Math.sin(t * 2.4));
    done(); hud.cat = toScreen(camX, z, gy, WALLX - 300, GROUND - 600); hud.dog = toScreen(camX, z, gy, dx + 140, GROUND - 260); hud.paf = toScreen(camX, z, gy, WALLX - 470, GROUND - 330);
  }
  if (s.id === 5) { // puddle
    const camX0 = PUDX - 150, z0 = 0.95, gy = 900; let z = z0, camX = camX0, gyy = gy;
    const dive = clamp((t - B.splash - 0.05) / (B.mudIn - B.splash - 0.05)), back2 = clamp((t - B.mudOut) / 0.6);
    if (t < B.mudIn) { const e = dive * dive; z = z0 + e * 4; camX = camX0 + (PUDX - camX0) * e; gyy = gy + ((H / 2) - (PY - GROUND) * z - gy) * e; }
    else if (t >= B.mudOut) { const e = 1 - easeOut(back2); z = z0 + e * 4; camX = camX0 + (PUDX - camX0) * e; gyy = gy + ((H / 2) - (PY - GROUND) * z - gy) * e; }
    if (t >= B.mudIn && t < B.mudOut) { // inside the mud
      const k = (t - B.mudIn) / (B.mudOut - B.mudIn); ctx.fillStyle = '#5a3a1e'; ctx.fillRect(0, 0, W, H); const r = rng(5506);
      for (let i = 0; i < 26; i++) { const a = r() * 7 + k * 5 * (i % 2 ? 1 : -1), rr = 100 + r() * 700; E(ctx, W / 2 + Math.cos(a) * rr, H / 2 + Math.sin(a) * rr * 0.6, 60 + r() * 120, 30 + r() * 50, a, ['#7a5230', '#4a2e16', '#8e6a40'][i % 3]); }
      for (let i = 0; i < 30; i++) { const bx = r() * W, by = (r() * H - k * 600 * (0.5 + r())) % H; E(ctx, bx, by < 0 ? by + H : by, 10 + r() * 20, 10 + r() * 20, 0, 'rgba(255,230,190,0.3)'); }
    } else {
      const done = world(ctx, camX, z, gyy);
      const jx0 = PUDX - 460, lx = PUDX - 20; let dx, dy = GROUND + 70, mv = 1, opt = {};
      if (t < B.jump) dx = PUDX - 1300 + lt * 650;
      else if (t < B.splash) { const u2 = (t - B.jump) / (B.splash - B.jump); dx = jx0 + (lx - jx0) * u2; dy -= Math.sin(u2 * Math.PI) * 260; mv = 0; opt = { legsOut: 1, headUp: 0.2 - u2 * 0.4 }; }
      else { dx = lx; mv = 0; }
      const muddy = t >= B.mudOut;
      // ripples
      if (t > B.splash) for (let i = 0; i < 3; i++) { const k = (t - B.splash - i * 0.35) * 0.9; if (k > 0 && k < 1) { ctx.strokeStyle = `rgba(255,240,230,${0.6 * (1 - k)})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(PUDX, PY, 60 + k * 260, (60 + k * 260) * 0.12, 0, 0, 7); ctx.stroke(); } }
      if (t < B.splash || muddy) dogTrot(ctx, dx, dy + (muddy ? 16 : 0), 0.85, t * 11, mv, muddy ? { pal: MUD, happy: 1, headUp: 0.15 } : opt);
      if (muddy) { const r = rng(5507); for (let i = 0; i < 10; i++) { const p = ((t * 0.9 + r()) % 1), x = dx - 120 + r() * 300; E(ctx, x, GROUND - 120 + p * 200, 6, 10, 0, `rgba(90,60,30,${1 - p})`); } }
      spray(ctx, PUDX, PY, (t - B.splash) * 1.3, 40, 5508, ['#8a6a44', '#ffb0a0', '#5a3a1e', '#ffd8b0']);
      done(); hud.splash = toScreen(camX0, z0, gy, PUDX + 60, GROUND - 330); hud.star = toScreen(camX0, z0, gy, lx + 190, GROUND - 280);
    }
  }
  if (s.id === 6) { // he finally turns around
    if (t < B.close) {
      const ox = 7900 + Math.min(lt, B.stop - s.start) * 230, camX = ox - 200, z = 0.85, done = world(ctx, camX, z, 960);
      const turned = t > B.turn, ph = Math.min(t, B.stop) * 4.2;
      if (!turned) otavio(ctx, ox, GROUND + 30, 1.0, ph, 0.4 - 0.25 * clamp((t - B.stop) / 0.3));
      else { ctx.save(); ctx.translate(ox, 0); ctx.scale(-1, 1); otavio(ctx, 0, GROUND + 30, 1.0, Math.PI, 0.15, { wide: 1 }); ctx.restore(); }
      done();
    } else {
      const done = world(ctx, 8300, 2.4, 1500); done();
      ctx.save(); ctx.filter = 'blur(8px)'; ctx.drawImage(cv, 0, 0); ctx.restore();
      const k = t - B.twitch, tw = k > 0 ? 0.35 + 0.3 * Math.sin(k * 22) * Math.exp(-k * 0.4) + 0.2 * clamp(k / 1.5) : -0.1;
      ctx.save(); ctx.translate(1500, 0); ctx.scale(-1, 1); otavio(ctx, 0, 2237 + 40 * (1 - easeOut((t - B.close) / 0.5)), 2.3, Math.PI, 0.12, { wide: 1, smile: tw, spikes: 0.35 }); ctx.restore();
    }
  }
  sunset(ctx, 0.2); grade(ctx, { vig: 0.5, seed: 50 + s.id });
  ctx.restore();
  pixelate(ctx, 4, 12);
  // HQ layer
  if (hud.flap) { const [x, y] = hud.flap; sfx(ctx, 'FLAP', x - 260, y + 40, 62, -0.15, (t - B.flap) / 0.2); sfx(ctx, 'FLAP', x + 40, y - 70, 70, 0.08, (t - B.flap - 0.3) / 0.2); sfx(ctx, 'FLAP!', x + 340, y - 160, 80, -0.06, (t - B.flap - 0.6) / 0.2); }
  if (hud.klang) { sfx(ctx, 'KLANG!', hud.klang[0], hud.klang[1], 88, -0.12, (t - B.klang - 0.38) / 0.2, ['#e8f0ff', '#8a9ab8'], '#3a4a6a'); }
  if (hud.klong) { sfx(ctx, 'KLONG!', hud.klong[0] + 60, hud.klong[1], 74, 0.1, (t - B.klong) / 0.2, ['#e8f0ff', '#8a9ab8'], '#3a4a6a'); }
  if (hud.cat) { sfx(ctx, 'PAF!', hud.paf[0] - 120, hud.paf[1], 84, -0.15, (t - B.paf) / 0.15); iconBalloon(ctx, (t - B.angry) / 0.3, hud.cat[0] + 120, hud.cat[1] - 20, hud.cat[0] + 10, hud.cat[1] + 150, 'anger'); iconBalloon(ctx, (t - B.sweat) / 0.3, hud.dog[0] - 240, hud.dog[1] - 140, hud.dog[0] - 60, hud.dog[1] + 20, 'sweat'); }
  if (hud.splash && t >= B.mudOut) { pixStar(ctx, hud.star[0] + 40, hud.star[1] - 40, 12, (t - B.star) / 0.3, t); }
  if (hud.splash && t < B.mudIn + 0.6) { const k = (t - B.splash) / 0.2; sfx(ctx, 'SPLOOSH!', W / 2, 250, 110, -0.08, k, ['#fff7c8', '#c89060'], '#5a3a1e'); }
  if (s.id === 5 && t >= B.mudIn && t < B.mudOut) sfx(ctx, 'SPLOOSH!', W / 2, 250, 110, -0.08, 1, ['#fff7c8', '#c89060'], '#5a3a1e');
}
const PIX = { anger: ['X.X.X', '.....', 'X...X', '.....', 'X.X.X'], drop: ['..X..', '..X..', '.XXX.', 'XXXXX', 'XXOXX', 'XXXXX', '.XXX.'] };
function iconBalloon(g, k, cx, cy, tx, ty, kind) {
  balloon(g, k, cx, cy, 190, 150, tx, ty, () => {
    if (kind === 'anger') { g.save(); g.translate(cx, cy); g.strokeStyle = '#e0283a'; g.lineWidth = 12; g.lineCap = 'butt'; for (let i = 0; i < 4; i++) { g.save(); g.rotate(i * Math.PI / 2); g.beginPath(); g.moveTo(10, -44); g.quadraticCurveTo(14, -14, 44, -10); g.stroke(); g.restore(); } g.restore(); }
    else { const rows = PIX.drop, sz = 12; rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch === '.') return; g.fillStyle = ch === 'O' ? '#e8f6ff' : '#4aa8f0'; g.fillRect(cx + (i - 2.5) * sz, cy + (j - 3.5) * sz, sz, sz); })); }
  });
}
function pixStar(g, x, y, sz, k, t) { if (k <= 0) return; const rows = ['....X....', '....X....', '...XXX...', 'XXXXXXXXX', '.XXXXXXX.', '..XXXXX..', '.XXX.XXX.', 'XX.....XX']; const s = sz * (0.4 + 0.6 * back(k)); g.save(); g.translate(x, y); g.rotate(Math.sin(t * 3) * 0.15); g.globalAlpha = clamp(k * 3);
  rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== 'X') return; g.fillStyle = '#111'; g.fillRect((i - 4.5) * s - 3, (j - 4) * s - 3, s + 6, s + 6); })); rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== 'X') return; g.fillStyle = j < 3 ? '#fff6a0' : '#ffd23c'; g.fillRect((i - 4.5) * s, (j - 4) * s, s, s); })); g.restore(); }
window.render = render;
window.__ready = true;
