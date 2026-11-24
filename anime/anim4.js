// Scene 4 "A espera na padaria": render(t), pure in t.
window.ANIM = true; window.NO_RAIN = true; window.NO_CAP = true;
await import('./shots.js');
await document.fonts.load('40px PS2P');
const { W, H, off, rng, glow, grade, bloom, caption_, thick, shots, pixelate, post } = window.SH;
const TL = await (await fetch('timeline4.json')).json();
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
function otavio(g, x, y, s, ph, headDown = 0.35, { lean = 0, armUp = 0, smile = 0, hop = 0, spikes = 1 } = {}) {
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
  g.fillStyle = OT.skinS; g.beginPath(); g.ellipse(EX, EY - 12, 20, 11, 0, Math.PI, 0); g.fill(); // heavy lid
  g.strokeStyle = '#1a0e0a'; g.lineWidth = 5; g.beginPath(); g.moveTo(EX - 18, EY - 6); g.quadraticCurveTo(EX, EY - 14, EX + 20, EY - 4); g.stroke();
  g.strokeStyle = 'rgba(120,70,60,0.5)'; g.lineWidth = 2; g.beginPath(); g.moveTo(EX - 12, EY + 14); g.quadraticCurveTo(EX, EY + 18, EX + 12, EY + 13); g.stroke(); // eye bag
  g.strokeStyle = OT.hair; g.lineWidth = 6; g.beginPath(); g.moveTo(EX - 20, EY - 26); g.quadraticCurveTo(EX, EY - 30, EX + 22, EY - 22); g.stroke();
  g.strokeStyle = OT.skinS; g.lineWidth = 4; g.beginPath(); g.moveTo(66, 4); g.lineTo(74, 26); g.lineTo(62, 30); g.stroke(); // nose
  g.strokeStyle = '#8a4a40'; g.lineWidth = 4; g.beginPath(); g.moveTo(44, 50); g.quadraticCurveTo(54, 50 + smile * 8, 62, 46 - smile * 4); g.stroke(); // mouth
  g.restore();
  arm(ph, false);
  g.restore();
}
window.otSheet = () => { const [c, gg] = off(); gg.fillStyle = '#e8b888'; gg.fillRect(0, 0, W, H); for (let i = 0; i < 6; i++) otavio(gg, 180 + i * 310, 980, 1.05, i * Math.PI / 3); ctx.drawImage(c, 0, 0); };

// ---------- Caramelo standing / trotting (side view, facing right) ----------
const DF = { c: '#d68a3a', l: '#f0b265', s: '#a8601f', w: '#f6efe4', ws: '#d8cec2' };
function dogTrot(g, x, y, s, ph, moving = 1) {
  g.save(); g.translate(x, y - Math.abs(Math.sin(ph)) * 6 * moving); g.scale(s, s);
  E(g, 0, 6, 150, 14, 0, 'rgba(60,30,10,0.25)');
  const leg = (hx, hy, p, far, back) => { const a = 0.45 * Math.sin(p) * moving, kb = (back ? -1 : 1) * (0.1 + 0.55 * Math.max(0, Math.cos(p)) * moving); const kx = hx + Math.sin(a) * 70, ky = hy + Math.cos(a) * 70, px = kx + Math.sin(a + kb) * 66, py = ky + Math.cos(a + kb) * 66;
    limb(g, hx, hy, kx, ky, 34, 26, far ? DF.s : DF.c, far ? null : DF.s); limb(g, kx, ky, px, py, 26, 22, far ? DF.s : DF.c); limb(g, kx + (px - kx) * 0.5, ky + (py - ky) * 0.5, px, py, 24, 22, far ? DF.ws : DF.w); E(g, px + 8, py + 4, 18, 10, 0, far ? DF.ws : DF.w); };
  leg(80, -150, ph + 0.6, true, false); leg(-90, -150, ph + Math.PI + 0.6, true, true);
  const wag = Math.sin(ph * 2) * 0.4; g.lineCap = 'round'; g.strokeStyle = DF.c; g.lineWidth = 24; g.beginPath(); g.moveTo(-130, -180); g.quadraticCurveTo(-180, -230 + wag * 40, -170, -280 + wag * 30); g.stroke(); E(g, -170, -284 + wag * 30, 14, 14, 0, DF.w);
  const bg = g.createLinearGradient(0, -240, 0, -120); bg.addColorStop(0, DF.l); bg.addColorStop(1, DF.s); E(g, -10, -180, 140, 56, -0.03, bg); E(g, 80, -186, 66, 64, 0, bg);
  E(g, 100, -160, 40, 44, 0, DF.w);
  leg(80, -150, ph, false, false); leg(-90, -150, ph + Math.PI, false, true);
  // head
  g.save(); g.translate(150, -250); g.rotate(-0.1 + 0.04 * Math.sin(ph * 2));
  g.fillStyle = DF.s; g.beginPath(); g.moveTo(-30, -24); g.quadraticCurveTo(-60, -6, -50, 30); g.quadraticCurveTo(-36, 6, -16, -6); g.closePath(); g.fill();
  const hg = g.createRadialGradient(-10, -20, 6, 0, 0, 60); hg.addColorStop(0, DF.l); hg.addColorStop(1, DF.c); E(g, 0, 0, 52, 46, 0, hg);
  g.fillStyle = DF.c; g.beginPath(); g.moveTo(-6, -36); g.lineTo(8, -92); g.lineTo(28, -32); g.closePath(); g.fill(); g.fillStyle = '#f2a0a8'; g.beginPath(); g.moveTo(2, -38); g.lineTo(9, -74); g.lineTo(21, -36); g.closePath(); g.fill();
  E(g, 44, 14, 38, 22, 0.1, DF.w); E(g, 78, 6, 9, 7, 0, '#1a0e0a');
  E(g, 16, -6, 11, 14, 0, '#1a0a04'); E(g, 17, -4, 8, 10, 0, '#8a4a1a'); E(g, 18, -3, 4, 5, 0, '#050202'); E(g, 13, -10, 4, 4, 0, '#ffffff');
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

// ================= Scene 4 "A espera na padaria" =================
const C = TL.cuts;
const DOG = dogSit(0), DOGB = dogSit(1);
const STREETX = sideStreet(47);
window.S8 = { dog: 'none', shutter: 1 }; const [FACADE, fg8] = off(); shots[8](fg8, 0); post.length = 0;
window.SHOT4_DAY = true; const [SNOUT, ng] = off(); shots[4](ng, 0); post.length = 0;
const warm = (g, a = 0.25) => { g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = `rgba(255,150,70,${a})`; g.fillRect(0, 0, W, H); g.restore(); };
function layer(fn) { const [c, g] = off(); fn(g); return c; }
function blurred(g, img, px, alpha = 1) { g.save(); g.globalAlpha = alpha; if (px > 0.3) g.filter = `blur(${px}px)`; g.drawImage(img, 0, 0); g.restore(); }
const SKIN = '#e8b48c', SKINS = '#c88e68';

// pão francês, centred at 0,0, length ~2*rx; half = cut on the right
function bread(g, x, y, rx, ry, rot = 0, half = false) {
  g.save(); g.translate(x, y); g.rotate(rot);
  if (half) { g.beginPath(); g.rect(-rx - 4, -ry - 4, rx + 4, ry * 2 + 8); g.clip(); }
  E(g, 3, ry * 0.5, rx, ry * 0.55, 0, 'rgba(60,30,10,0.3)');
  const gr = g.createLinearGradient(0, -ry, 0, ry); gr.addColorStop(0, '#f6c372'); gr.addColorStop(0.55, '#d88a35'); gr.addColorStop(1, '#9a5520'); E(g, 0, 0, rx, ry, 0, gr);
  g.strokeStyle = '#fff0c8'; g.lineWidth = ry * 0.22; g.lineCap = 'round'; g.beginPath(); g.moveTo(-rx * 0.7, -ry * 0.05); g.quadraticCurveTo(0, -ry * 0.55, rx * 0.7, -ry * 0.05); g.stroke();
  g.strokeStyle = 'rgba(255,250,230,0.5)'; g.lineWidth = ry * 0.1; g.beginPath(); g.moveTo(-rx * 0.5, -ry * 0.55); g.quadraticCurveTo(0, -ry * 0.85, rx * 0.4, -ry * 0.6); g.stroke();
  g.restore();
  if (half) { g.save(); g.translate(x, y); g.rotate(rot); E(g, 0, 0, ry * 0.22, ry * 0.92, 0, '#f8ecd0'); g.fillStyle = 'rgba(200,170,120,0.6)'; for (let k = 0; k < 9; k++) { g.beginPath(); g.arc(Math.sin(k * 3.1) * ry * 0.1, (k / 8 - 0.5) * ry * 1.4, ry * 0.05, 0, 7); g.fill(); } g.restore(); }
}
function star4(g, x, y, r, rot, col = '#ffffff') { g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = col; g.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? r * 0.22 : r; g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } g.closePath(); g.fill(); g.restore(); }
function wallClock(g, x, y, R, mins) { // mins since 9:00
  g.save(); g.translate(x, y);
  E(g, 8, 10, R * 1.08, R * 1.08, 0, 'rgba(60,25,10,0.35)'); E(g, 0, 0, R * 1.08, R * 1.08, 0, '#7a3a22'); E(g, 0, 0, R, R, 0, '#fbf3e0');
  g.fillStyle = '#3a2418'; for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6, l = k % 3 ? 0.08 : 0.16; g.save(); g.rotate(a); g.fillRect(-R * 0.025, -R * 0.9, R * 0.05, R * l); g.restore(); }
  const ma = (mins / 60) * Math.PI * 2, ha = ((9 + mins / 60) / 12) * Math.PI * 2;
  g.lineCap = 'round'; g.strokeStyle = '#2a1a12'; g.lineWidth = R * 0.07; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.sin(ha) * R * 0.5, -Math.cos(ha) * R * 0.5); g.stroke();
  g.lineWidth = R * 0.045; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.sin(ma) * R * 0.78, -Math.cos(ma) * R * 0.78); g.stroke();
  E(g, 0, 0, R * 0.07, R * 0.07, 0, '#c0392b');
  g.fillStyle = 'rgba(255,255,255,0.35)'; g.beginPath(); g.ellipse(-R * 0.3, -R * 0.45, R * 0.45, R * 0.2, -0.6, 0, 7); g.fill();
  g.restore();
}
function tiles(g, x0, y0, w, h, sz, a = '#f1e2c4', b = '#e4cfa8') { for (let y = y0; y < y0 + h; y += sz) for (let x = x0; x < x0 + w; x += sz) { g.fillStyle = ((x / sz + y / sz) & 1) ? a : b; g.fillRect(x, y, sz - 3, sz - 3); } }

// ---------- shot 1 layers: interior looking out through a fogged window ----------
const WX = 150, WY = 110, WW = 1380, WH = 640;
const EXT = layer((g) => { g.save(); g.translate(WX + WW / 2, WY + WH - 60); g.scale(0.62, 0.62); g.translate(-2600, -GROUND); g.drawImage(STREETX, 0, -H / 2); g.restore(); });
const FOG = layer((g) => {
  const r = rng(4401); const fgg = g.createLinearGradient(0, WY, 0, WY + WH); fgg.addColorStop(0, 'rgba(236,240,244,0.26)'); fgg.addColorStop(1, 'rgba(244,240,232,0.55)'); g.fillStyle = fgg; g.fillRect(WX, WY, WW, WH);
  g.globalCompositeOperation = 'destination-out';
  for (let k = 0; k < 46; k++) { const x = WX + 20 + r() * (WW - 40), y0 = WY + r() * WH * 0.6, L = 80 + r() * 300, w = 3 + r() * 5; g.strokeStyle = 'rgba(0,0,0,0.8)'; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, y0); for (let u = 0; u <= 1; u += 0.1) g.lineTo(x + Math.sin(u * 7 + k) * 4, y0 + u * L); g.stroke(); }
  g.filter = 'blur(26px)'; g.fillStyle = 'rgba(0,0,0,0.55)'; g.beginPath(); g.ellipse(WX + 660, WY + 360, 380, 280, -0.1, 0, 7); g.fill(); // a hand-wiped patch where the dog is
});
const DROPS = (() => { const r = rng(4402); return Array.from({ length: 140 }, () => ({ x: WX + r() * WW, y: WY + r() * WH, s: 2 + r() * 6, v: r() < 0.12 ? 30 + r() * 60 : 0 })); })();
const ROOM = layer((g) => {
  const wall = g.createLinearGradient(0, 0, 0, H); wall.addColorStop(0, '#8a5236'); wall.addColorStop(1, '#5a3020'); g.fillStyle = wall; g.fillRect(0, 0, W, H);
  tiles(g, 0, 560, W, 300, 46, '#f3e6cc', '#e2cba2');
  g.clearRect(WX, WY, WW, WH);
  g.fillStyle = '#f4ead6'; for (const [x, y, w, h] of [[WX - 26, WY - 26, WW + 52, 26], [WX - 26, WY + WH, WW + 52, 30], [WX - 26, WY, 26, WH], [WX + WW, WY, 26, WH], [WX + WW / 2 - 10, WY, 20, WH]]) g.fillRect(x, y, w, h);
  g.fillStyle = 'rgba(0,0,0,0.18)'; g.fillRect(WX - 26, WY + WH + 22, WW + 52, 8);
  // shelf with jars on the right wall
  g.fillStyle = '#6a3a22'; g.fillRect(1580, 560, 340, 18); for (let k = 0; k < 4; k++) { const x = 1600 + k * 78; g.fillStyle = 'rgba(220,235,240,0.7)'; g.fillRect(x, 470, 56, 90); g.fillStyle = ['#e8b860', '#c0392b', '#8a5a2a', '#f2d8a0'][k]; g.fillRect(x + 4, 500, 48, 56); g.fillStyle = '#c0392b'; g.fillRect(x - 2, 462, 60, 12); }
});
const COUNTER = layer((g) => {
  const r = rng(4403);
  g.fillStyle = '#6a3a22'; g.fillRect(0, 800, W, 280); g.fillStyle = '#8a5236'; g.fillRect(0, 800, W, 16);
  // glass display case with bread trays
  g.fillStyle = 'rgba(200,225,235,0.28)'; g.fillRect(60, 700, 1800, 110); g.strokeStyle = 'rgba(255,255,255,0.6)'; g.lineWidth = 4; g.strokeRect(60, 700, 1800, 110);
  for (let x = 90; x < 1840; x += 300) { g.fillStyle = '#a8724a'; g.fillRect(x, 790, 270, 14); for (let k = 0; k < 9; k++) bread(g, x + 30 + (k % 5) * 52 + (k > 4 ? 26 : 0), 778 - (k > 4 ? 18 : 0), 30, 15, (r() - 0.5) * 0.3); }
  g.fillStyle = 'rgba(255,255,255,0.22)'; g.beginPath(); g.moveTo(200, 700); g.lineTo(320, 700); g.lineTo(240, 810); g.lineTo(120, 810); g.closePath(); g.fill();
  g.fillStyle = '#e8dcc8'; g.fillRect(0, 812, W, 268); g.fillStyle = '#d0c0a4'; for (let x = 0; x < W; x += 160) g.fillRect(x, 812, 6, 268);
  // coffee cup on the counter (left)
  E(g, 300, 848, 70, 16, 0, '#d8ccb4'); g.fillStyle = '#ffffff'; g.beginPath(); g.moveTo(250, 760); g.lineTo(350, 760); g.lineTo(340, 842); g.lineTo(260, 842); g.closePath(); g.fill(); E(g, 300, 762, 50, 12, 0, '#5a2e14'); g.strokeStyle = '#ffffff'; g.lineWidth = 12; g.beginPath(); g.arc(358, 795, 22, -1.2, 1.2); g.stroke();
});
function shot1(t, lt) {
  ctx.drawImage(EXT, 0, 0);
  // the dog outside, sitting by the door; wiped patch shows him a little clearer
  const [dc, dg] = off(); drawDog(dg, (t % 3.4) < 0.12 ? DOGB : DOG, WX + 560, WY + WH + 60, 0.78, false, Math.sin(t * 2.2) * 0.12);
  blurred(ctx, dc, 2.5);
  ctx.drawImage(FOG, 0, 0);
  ctx.save(); ctx.beginPath(); ctx.rect(WX, WY, WW, WH); ctx.clip();
  for (const d of DROPS) { const y = d.y + d.v * lt; E(ctx, d.x + 1, y + 2, d.s, d.s * 1.1, 0, 'rgba(60,50,40,0.25)'); E(ctx, d.x, y, d.s, d.s * 1.15, 0, 'rgba(250,252,255,0.7)'); E(ctx, d.x - d.s * 0.3, y - d.s * 0.35, d.s * 0.3, d.s * 0.3, 0, '#ffffff'); }
  // lettering painted on the outside of the glass, read backwards from in here
  ctx.save(); ctx.translate(WX + WW / 2, WY + 92); ctx.scale(-1, 1); ctx.font = '96px Bangers'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 10; ctx.strokeStyle = 'rgba(255,224,120,0.85)'; ctx.strokeText('PADARIA', 0, 0); ctx.fillStyle = 'rgba(192,57,43,0.9)'; ctx.fillText('PADARIA', 0, 0); ctx.restore();
  ctx.restore();
  ctx.drawImage(ROOM, 0, 0);
  wallClock(ctx, 1750, 280, 120, 30 * clamp(lt / 6.5));
  glow(ctx, 1750, 0, 500, 'rgba(255,220,150,0.6)', 0.5);
  ctx.drawImage(COUNTER, 0, 0);
  // steam from the coffee
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let k = 0; k < 7; k++) { const p = (lt * 0.35 + k / 7) % 1; ctx.globalAlpha = 0.18 * Math.sin(p * Math.PI); ctx.fillStyle = '#fff6e8'; ctx.filter = 'blur(12px)'; ctx.beginPath(); ctx.ellipse(300 + Math.sin(p * 6 + k) * 26, 740 - p * 300, 24 + p * 30, 40, 0, 0, 7); ctx.fill(); } ctx.restore();
  bloom(ctx, 0.3, 26); warm(ctx, 0.3); grade(ctx, { vig: 0.55, seed: 41 });
}

// ---------- shot 2: big clock close-up ----------
const CLOCKWALL = layer((g) => { tiles(g, 0, 0, W, H, 92, '#f3e6cc', '#e2cba2'); const v = g.createRadialGradient(W / 2, H / 2, 200, W / 2, H / 2, 1100); v.addColorStop(0, 'rgba(255,220,160,0.15)'); v.addColorStop(1, 'rgba(90,40,20,0.5)'); g.fillStyle = v; g.fillRect(0, 0, W, H); });
function shotClock(lt) {
  ctx.drawImage(CLOCKWALL, 0, 0);
  const k = clamp((lt - 0.2) / 0.9), m = 30 + 30 * (k < 1 ? Math.floor(k * 30) / 30 : 1); // ticks in steps
  wallClock(ctx, W / 2, H / 2, 400, m);
  bloom(ctx, 0.2, 20); warm(ctx, 0.2); grade(ctx, { vig: 0.6, seed: 42 });
}

// ---------- shot 3: the baker's hands leave a bread on the pavement ----------
const PAVE = layer((g) => {
  const r = rng(4404); g.fillStyle = '#efe6d4'; g.fillRect(0, 0, W, H);
  // pedra portuguesa: black waves over cream, little stones
  g.fillStyle = '#26232a'; for (let b = -2; b < 6; b++) { g.beginPath(); for (let x = -40; x <= W + 40; x += 20) g.lineTo(x, b * 260 + 120 + Math.sin(x / 150) * 70); for (let x = W + 40; x >= -40; x -= 20) g.lineTo(x, b * 260 + 210 + Math.sin(x / 150) * 70); g.closePath(); g.fill(); }
  for (let k = 0; k < 9000; k++) { const x = r() * W, y = r() * H; g.strokeStyle = 'rgba(120,110,100,0.35)'; g.lineWidth = 1.5; g.strokeRect(x, y, 14 + r() * 8, 12 + r() * 8); }
  const sun = g.createLinearGradient(0, 0, W, H); sun.addColorStop(0, 'rgba(255,220,150,0.35)'); sun.addColorStop(1, 'rgba(60,30,40,0.25)'); g.fillStyle = sun; g.fillRect(0, 0, W, H);
});
function paws(g, lift) { // Caramelo's white front paws at the left edge, legs going up out of frame
  for (const [i, x] of [[0, 230], [1, 470]]) { const up = lift[i];
    const lg = g.createLinearGradient(x - 90, 0, x + 90, 0); lg.addColorStop(0, '#b8722e'); lg.addColorStop(1, '#e8a04a'); g.fillStyle = lg; g.beginPath(); g.roundRect(x - 90, -60, 180, 560 - up, 80); g.fill();
    g.fillStyle = '#f6efe4'; g.beginPath(); g.roundRect(x - 92, 300 - up, 184, 260, 80); g.fill();
    E(g, x + 10, 560 - up, 120, 70, 0, '#f6efe4'); g.strokeStyle = '#d8cec2'; g.lineWidth = 5; for (const dx of [-40, 10, 60]) { g.beginPath(); g.moveTo(x + dx, 520 - up); g.lineTo(x + dx + 4, 600 - up); g.stroke(); }
    E(g, x + 20, 640, 150 - up * 0.3, 26, 0, 'rgba(40,20,10,0.25)'); }
}
function shot3(t, lt) {
  ctx.drawImage(PAVE, 0, 0);
  const pl = (k) => Math.max(0, Math.sin(clamp(k) * Math.PI)) * 60;
  const a = t - B.paws; paws(ctx, [pl(a / 0.3) + pl((a - 0.6) / 0.3), pl((a - 0.3) / 0.3) + pl((a - 0.9) / 0.3)]);
  const down = easeOut((t - B.handDown) / 1.2), up = ease((t - B.release - 0.3) / 1.1), dy = -620 * (1 - down) - 700 * up;
  const BX = 1060, BY = 640; // bread rests here
  const by = t < B.release ? BY + dy : BY;
  bread(ctx, BX, by, 190, 86, -0.12);
  // apron + sleeve + hand
  ctx.save(); ctx.translate(0, dy);
  const open = clamp((t - B.release) / 0.25);
  ctx.save(); ctx.translate(0, -dy * 0.4);
  ctx.fillStyle = '#fbf6ee'; ctx.beginPath(); ctx.moveTo(1380, -100); ctx.lineTo(1960, -100); ctx.lineTo(1960, 330); for (let x = 1960; x >= 1380; x -= 40) ctx.arc(x - 20, 330, 20, 0, Math.PI); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(190,170,150,0.35)'; ctx.fillRect(1380, -100, 90, 430);
  const fr = rng(4405); for (let k = 0; k < 40; k++) { const x = 1400 + fr() * 540, y = -80 + fr() * 390; for (let p = 0; p < 5; p++) E(ctx, x + Math.cos(p * 1.26) * 9, y + Math.sin(p * 1.26) * 9, 6, 6, 0, ['#e85a6a', '#f2b84a', '#6a9ae8'][k % 3]); E(ctx, x, y, 4, 4, 0, '#fff4a0'); }
  ctx.restore();
  limb(ctx, 1760, -260, 1250, 470, 150, 116, '#4a6ab0', '#3a5490'); // sleeve
  limb(ctx, 1330, 380, 1170, 560, 110, 96, SKIN, SKINS); // forearm
  ctx.fillStyle = '#fbf6ee'; ctx.save(); ctx.translate(1300, 420); ctx.rotate(-0.65); ctx.fillRect(-70, -20, 140, 40); ctx.restore(); // cuff
  E(ctx, 1110, 580, 108, 70, -0.25, SKIN); E(ctx, 1120, 560, 80, 40, -0.25, 'rgba(255,230,210,0.4)');
  for (let i = 0; i < 4; i++) { const fx = 1010 + i * 52, fy = 590 + i * 4, cur = 1 - open * 0.8; limb(ctx, fx, fy, fx - 26 - 10 * cur, fy + 40 + 50 * cur, 40, 32, i % 2 ? SKIN : '#e2aa82', SKINS); }
  limb(ctx, 1180, 620, 1210 + open * 40, 700 - open * 40, 48, 38, SKINS); // thumb
  ctx.restore();
  bloom(ctx, 0.2, 20); warm(ctx, 0.25); grade(ctx, { vig: 0.5, seed: 43 });
}

// ---------- shots 4–6: the bakery front (scene 2 set) ----------
const DX = 900, DY = 960, DS = 0.62;
function shot4(t, lt, u) {
  const z = 1.0 + 0.12 * ease(u), cx = 1150, cy = 760;
  ctx.save(); ctx.translate(cx, cy); ctx.scale(z, z); ctx.translate(-cx, -cy);
  ctx.drawImage(FACADE, 0, 0);
  // crumbs, and the saved half on the cardboard corner
  const cr = rng(4406); for (let k = 0; k < 22; k++) E(ctx, 1030 + cr() * 160, 975 + cr() * 30, 3 + cr() * 4, 2 + cr() * 3, 0, ['#d88a35', '#f6c372', '#f8ecd0'][k % 3]);
  bread(ctx, 1440, 918, 64, 30, -0.1, true);
  const chew = t > B.chew && t < B.chew + 0.9 ? Math.sin((t - B.chew) * 28) * 0.012 : 0;
  ctx.save(); ctx.translate(DX, DY); ctx.rotate(chew); ctx.translate(-DX, -DY); drawDog(ctx, (t % 3.1) < 0.12 ? DOGB : DOG, DX, DY, DS, false, Math.sin(t * 8) * 0.3); ctx.restore();
  const gk = t - B.glint; if (gk > 0 && gk < 1.2) { const s = Math.sin(clamp(gk / 1.2) * Math.PI); star4(ctx, 1468, 898, 40 * s, gk * 2); glow(ctx, 1468, 898, 90 * s, 'rgba(255,240,190,0.9)', 0.7); }
  ctx.restore();
}
const OT_V = 380, OT_X0 = 2080, OT_S = 0.9, OT_Y = 1010;
function otX(t) { return OT_X0 - OT_V * (Math.min(t, B.opa) - TL.shots[4].start); }
function shot5(t, lt) {
  ctx.drawImage(FACADE, 0, 0);
  bread(ctx, 1440, 918, 64, 30, -0.1, true);
  const k = t - B.opa, flinch = k > 0 && k < 0.35;
  drawDog(ctx, flinch ? DOGB : DOG, DX, DY - (flinch ? Math.sin(k / 0.35 * Math.PI) * 22 : 0), DS, false, Math.sin(t * (k > 1.5 ? 9 : 3)) * 0.25);
  const x = otX(t), rate = 4.2 * OT_V / 230 / OT_S, ph = (Math.min(t, B.opa) - TL.shots[4].start) * rate + 1.0;
  const st = k <= 0 ? 0 : k < 0.25 ? easeOut(k / 0.25) : 1 - 0.65 * ease((k - 0.9) / 0.8);
  const hop = 26 * Math.sin(Math.PI * clamp(k / 0.4));
  ctx.save(); ctx.translate(x, 0); ctx.scale(-1, 1);
  otavio(ctx, 0, OT_Y, OT_S, ph, 0.38 + 0.22 * clamp(k / 0.4), { lean: 0.16 * st, armUp: 0.85 * st, hop: k > 0 ? hop : 0, smile: t > B.sai + 0.6 ? 0.25 : 0 });
  ctx.restore();
  bloom(ctx, 0.15, 20);
}
const BG6 = layer((g) => { g.save(); g.translate(1100, 700); g.scale(1.5, 1.5); g.translate(-1100, -700); g.filter = 'blur(9px)'; g.drawImage(FACADE, 0, 0); g.restore(); });
const D6 = { x: 1376, y: 945, s: 1.15 }; const EYE6 = [D6.x - 110 * D6.s, D6.y - 448 * D6.s];
function shot6(t, lt) {
  const f = ease((t - B.focus) / 1.0);
  ctx.drawImage(BG6, 0, 0);
  const wagF = t > B.abana - 0.3 ? 0.55 : 0.15, wagS = t > B.abana - 0.3 ? 20 : 4;
  const dogL = layer((g) => drawDog(g, (t % 3.3) < 0.12 && t < B.focus ? DOGB : DOG, D6.x, D6.y, D6.s, true, Math.sin(t * wagS) * wagF));
  blurred(ctx, dogL, 12 * (1 - f));
  if (f > 0.75) { const a = (f - 0.75) / 0.25, tw = 0.8 + 0.2 * Math.sin(t * 9); ctx.save(); ctx.globalAlpha = a; glow(ctx, EYE6[0] - 6, EYE6[1] - 10, 60, 'rgba(255,250,220,0.9)', 0.8); star4(ctx, EYE6[0] - 8, EYE6[1] - 12, 34 * tw, t * 0.8); star4(ctx, EYE6[0] + 30, EYE6[1] + 18, 14 * tw, -t); star4(ctx, EYE6[0] - 60, EYE6[1] - 70, 18 * (1.8 - tw), t * 1.3, '#fff4b0'); ctx.restore(); }
  const manL = layer((g) => { otavio(g, 398, 2237, 2.3, 1.0, 0.3, { smile: 0.55, spikes: 0.35 }); g.save(); g.globalCompositeOperation = 'source-atop'; const rl = g.createLinearGradient(0, 0, 900, 0); rl.addColorStop(0, 'rgba(40,20,30,0.35)'); rl.addColorStop(0.7, 'rgba(40,20,30,0.1)'); rl.addColorStop(1, 'rgba(255,220,160,0.35)'); g.fillStyle = rl; g.fillRect(0, 0, W, H); g.restore(); });
  blurred(ctx, manL, 16 * f);
  warm(ctx, 0.25); grade(ctx, { vig: 0.5, seed: 46 });
}

function heart(g, x, y, s, k) { if (k <= 0) return; const rows = ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...']; const sc = s * (0.4 + 0.6 * back(k)); g.save(); g.globalAlpha = clamp(k * 3); rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== 'X') return; g.fillStyle = '#111'; g.fillRect(x + (i - 3.5) * sc - 3, y + (j - 3) * sc - 3, sc + 6, sc + 6); })); rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== 'X') return; g.fillStyle = (j === 1 && i === 1) ? '#ffd0d8' : '#e8344a'; g.fillRect(x + (i - 3.5) * sc, y + (j - 3) * sc, sc, sc); })); g.restore(); }
function breadHeart(g, k, cx, cy, tx, ty) { // balloon: bread ➜ heart
  balloon(g, k, cx, cy, 380, 170, tx, ty, () => {
    const bread8 = ICONS.bread, sz = 12; bread8.forEach((r, j) => [...r].forEach((ch, i) => { if (ch === '.') return; g.fillStyle = ch === 'O' ? '#ffe0a8' : '#c47a30'; g.fillRect(cx - 150 + i * sz, cy - 36 + j * sz, sz, sz); }));
    g.fillStyle = '#111'; g.fillRect(cx - 34, cy - 4, 56, 12); g.beginPath(); g.moveTo(cx + 22, cy - 22); g.lineTo(cx + 46, cy + 2); g.lineTo(cx + 22, cy + 26); g.closePath(); g.fill();
    heart(g, cx + 112, cy + 2, 12, 1);
  });
}

function render(t) {
  const s = TL.shots.find((x) => t >= x.start && t < x.end) || TL.shots[TL.shots.length - 1];
  const lt = t - s.start, u = lt / (s.end - s.start);
  ctx.save(); ctx.clearRect(0, 0, W, H);
  const clockCut = s.id === 2 && t >= C.clockIn && t < C.clockOut;
  if (s.id === 1) shot1(t, lt);
  if (s.id === 2) {
    if (clockCut) shotClock(t - C.clockIn);
    else { const late = t >= C.clockOut, k = late ? (t - C.clockOut) / (s.end - C.clockOut) : lt / (C.clockIn - s.start); const z = late ? 1.12 + 0.08 * k : 1.04 + 0.04 * k, rot = late ? 0.05 * ease(k) : 0;
      ctx.save(); ctx.translate(1000, 900); ctx.rotate(rot); ctx.translate(-1000, -900); cam(ctx, SNOUT, z, 960, 600, 0, late ? 24 * ease(k) : 0); ctx.restore(); }
  }
  if (s.id === 3) shot3(t, lt);
  if (s.id === 4) shot4(t, lt, u);
  if (s.id === 5) shot5(t, lt);
  if (s.id === 6) shot6(t, lt);
  ctx.restore();
  pixelate(ctx, 4, 12);
  // HQ layer
  if (s.id === 1) captionAt(ctx, t, B.cap1, 70, 70, 'MEIA HORA.');
  if (s.id === 2 && t >= C.clockIn) captionAt(ctx, t, B.cap2, 70, 70, 'UMA HORA.');
  if (s.id === 4) { const z = 1.0 + 0.12 * ease(u); breadHeart(ctx, (t - B.icon) / 0.3, 760, 250, 860 + (DX - 1150) * 0 , 430); }
  if (s.id === 5) { const x = otX(t); sfx(ctx, 'OPA!', x - 330, 330, 92, -0.12, (t - B.opa) / 0.2); speech(ctx, (t - B.sai) / 0.3, x + 260, 150, x + 40, 300, ['SAI DAÍ, AMIGO.'], 60); }
  if (s.id === 6) { for (let i = 0; i < 3; i++) { const k = (t - B.hearts - i * 0.25) / 0.3, fl = Math.max(0, t - B.hearts - i * 0.25) * 14; heart(ctx, EYE6[0] - 40 + (i - 1) * 120, 150 - (i === 1 ? 40 : 0) - fl + Math.sin(t * 3 + i) * 6, 13, k); }
    sfx(ctx, 'ABANA', 1700, 600, 46, 0.12, (t - B.abana) / 0.2); sfx(ctx, 'ABANA', 1740, 700, 40, -0.06, (t - B.abana - 0.45) / 0.2); }
}
window.render = render;
window.__ready = true;
