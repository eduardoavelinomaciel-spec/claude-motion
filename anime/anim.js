// Scene 1 animation: every frame is render(t), a pure function of time.
window.ANIM = true; window.NO_RAIN = true; window.NO_CAP = true;
await import('./shots.js');
const { W, H, off, rng, glow, grade, bloom, rain, caption_, drawCar, rimSil, thick, poly, shots, shot3Car, pixelate, post } = window.SH;
const TL = await (await fetch('timeline.json')).json();
const B = TL.beats;
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(x));
const easeOut = (x) => 1 - (1 - clamp(x)) ** 3;
const easeIn = (x) => clamp(x) ** 2.2;

// ---------- animated rain: positions advance with t ----------
function rainAt(g, seed, t, { n = 900, len = [30, 70], a = [0.12, 0.4], w = [1, 2], slant = 0.12, speed = 1900, col = '200,220,255', clip = null, frozen = false } = {}) {
  const r = rng(seed); g.save(); if (clip) clip(g); g.lineCap = 'round';
  for (let k = 0; k < n; k++) {
    const x0 = r() * (W + 300) - 100, y0 = r() * (H + 200), L = len[0] + r() * (len[1] - len[0]), sp = speed * (0.8 + r() * 0.4);
    const al = a[0] + r() * (a[1] - a[0]), lw = w[0] + r() * (w[1] - w[0]);
    const y = frozen ? y0 - 100 : ((y0 + t * sp) % (H + 200)) - 100, x = x0 - (y + 100) * slant;
    g.strokeStyle = `rgba(${col},${al})`; g.lineWidth = lw; g.beginPath(); g.moveTo(x, y); g.lineTo(x - L * slant, y + L); g.stroke();
  }
  g.restore();
}
function ripples(g, seed, t, region, { n = 40, life = 0.9, col = 'rgba(220,230,255,0.45)' } = {}) {
  const r = rng(seed); const [x0, y0, x1, y1] = region; g.save(); g.strokeStyle = col; g.lineWidth = 1.5;
  for (let k = 0; k < n; k++) {
    const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0), ph = r() * life, depth = (y - y0) / (y1 - y0);
    const age = ((t + ph) % life) / life, rad = (6 + 40 * depth) * age;
    g.globalAlpha = (1 - age) * 0.8; g.beginPath(); g.ellipse(x, y, rad * 2, rad * 0.5, 0, 0, 7); g.stroke();
  }
  g.restore();
}
function cam(g, img, s, cx, cy, dx = 0, dy = 0) { g.save(); g.translate(cx + dx, cy + dy); g.scale(s, s); g.translate(-cx, -cy); g.drawImage(img, 0, 0); g.restore(); }
function cache(id) { const [c, g] = off(); shots[id](g, 0); post.length = 0; return c; }

// ---------- shot 2: hand + phone (new) ----------
function shot2Static() {
  const [c, g] = off(); const r = rng(202);
  const bg = g.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#0b0820'); bg.addColorStop(1, '#2a0f3e'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
  { const [b2, bg2] = off(); bg2.filter = 'blur(22px)'; for (let k = 0; k < 46; k++) { bg2.globalAlpha = 0.3 + r() * 0.45; bg2.fillStyle = ['#ff3cac', '#3cf2ff', '#ffd23c', '#ffb070', '#b06bff', '#5dff7a'][Math.floor(r() * 6)]; bg2.beginPath(); bg2.arc(r() * W, r() * H * 0.8, 20 + r() * 80, 0, 7); bg2.fill(); } g.drawImage(b2, 0, 0); }
  return c;
}
const SKIN = ['#7a3e2e', '#b9785a', '#e3a982', '#f3c9a3'];
function capsule(g, x0, y0, x1, y1, rr, cols) {
  g.lineCap = 'round'; g.strokeStyle = cols[0]; g.lineWidth = rr * 2 + 4; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
  g.strokeStyle = cols[2]; g.lineWidth = rr * 2; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
  g.strokeStyle = cols[3]; g.lineWidth = rr * 0.6; g.beginPath(); g.moveTo(x0 - rr * 0.3, y0 - rr * 0.4); g.lineTo(x1 - rr * 0.3, y1 - rr * 0.4); g.stroke();
}
function shot2(g, lt, u, st) {
  const buzz = B.phoneBuzz - 4.5, sh = lt > buzz && lt < buzz + 0.35 ? Math.sin(lt * 120) * 5 * (1 - (lt - buzz) / 0.35) : 0;
  cam(g, st, 1 + 0.03 * u, W / 2, H / 2, -20 * u, 0);
  rainAt(g, 21, lt, { n: 500, len: [30, 60], a: [0.1, 0.25] });
  g.save(); g.translate(1000 + sh, 560 + 10 * u); g.rotate(-0.12 + 0.01 * Math.sin(lt * 1.3));
  // palm behind phone
  g.fillStyle = SKIN[2]; g.beginPath(); g.ellipse(150, 330, 230, 170, -0.3, 0, 7); g.fill(); g.fillStyle = SKIN[1]; g.beginPath(); g.ellipse(230, 420, 160, 90, -0.3, 0, 7); g.fill();
  // sleeve
  g.fillStyle = '#c8ad80'; g.beginPath(); g.moveTo(120, 380); g.quadraticCurveTo(320, 330, 520, 430); g.lineTo(700, 900); g.lineTo(0, 900); g.closePath(); g.fill();
  g.strokeStyle = '#9a7f58'; g.lineWidth = 6; for (const k of [0, 1, 2]) { g.beginPath(); g.moveTo(170 + k * 90, 390 + k * 18); g.quadraticCurveTo(220 + k * 90, 520, 200 + k * 100, 700); g.stroke(); }
  g.fillStyle = '#e8d6b4'; g.beginPath(); g.moveTo(120, 380); g.quadraticCurveTo(320, 330, 520, 430); g.lineTo(510, 455); g.quadraticCurveTo(320, 360, 125, 405); g.closePath(); g.fill();
  // phone
  const PW = 330, PH = 660;
  g.fillStyle = '#0a0a10'; g.beginPath(); g.roundRect(-PW / 2, -PH / 2, PW, PH, 42); g.fill();
  g.strokeStyle = '#3a3c48'; g.lineWidth = 4; g.stroke();
  const sx = -PW / 2 + 16, sy = -PH / 2 + 16, sw = PW - 32, shh = PH - 32;
  const scr = g.createLinearGradient(0, sy, 0, sy + shh); scr.addColorStop(0, '#16233e'); scr.addColorStop(1, '#0c1428'); g.fillStyle = scr; g.beginPath(); g.roundRect(sx, sy, sw, shh, 30); g.fill();
  g.save(); g.beginPath(); g.roundRect(sx, sy, sw, shh, 30); g.clip();
  g.fillStyle = '#e8f4ff'; g.fillRect(sx + 120, sy + 18, 58, 8); // notch bar
  g.fillStyle = '#9fd8ff'; g.font = '34px Bangers'; g.textAlign = 'left'; g.fillText('18:47', sx + 24, sy + 70);
  // notification cards slide in (bill, clock, plate): his thoughts, no words
  const cards = [[0.15, '#ff6a6a', 'bill'], [buzz, '#ffd23c', 'clock'], [buzz + 1.0, '#7af0a0', 'plate']];
  cards.forEach(([t0, col, ic], i) => {
    const k = easeOut((lt - t0) / 0.35); if (k <= 0) return;
    const y = sy + 110 + i * 150, x = sx + 18 + (1 - k) * 260;
    g.globalAlpha = k; g.fillStyle = 'rgba(255,255,255,0.12)'; g.beginPath(); g.roundRect(x, y, sw - 36, 126, 20); g.fill();
    g.fillStyle = col; g.beginPath(); g.arc(x + 58, y + 63, 38, 0, 7); g.fill();
    g.fillStyle = '#0c1428'; g.strokeStyle = '#0c1428'; g.lineWidth = 6;
    if (ic === 'bill') { g.fillRect(x + 42, y + 40, 32, 46); g.fillStyle = col; for (const yy of [52, 62, 72]) g.fillRect(x + 48, y + yy, 20, 4); }
    if (ic === 'clock') { g.beginPath(); g.arc(x + 58, y + 63, 22, 0, 7); g.stroke(); g.beginPath(); g.moveTo(x + 58, y + 63); g.lineTo(x + 58, y + 48); g.moveTo(x + 58, y + 63); g.lineTo(x + 70, y + 68); g.stroke(); }
    if (ic === 'plate') { g.beginPath(); g.arc(x + 58, y + 63, 20, 0, 7); g.stroke(); g.fillRect(x + 28, y + 45, 4, 36); g.fillRect(x + 84, y + 45, 4, 36); }
    g.fillStyle = 'rgba(255,255,255,0.55)'; g.fillRect(x + 112, y + 40, 120 + (i % 2) * 30, 12); g.fillStyle = 'rgba(255,255,255,0.3)'; g.fillRect(x + 112, y + 66, 90 + i * 20, 10); g.fillRect(x + 112, y + 86, 60, 10);
    g.globalAlpha = 1;
  });
  // approaching headlights reflected on the glass
  const hk = clamp((u - 0.55) / 0.45);
  if (hk > 0) { g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createLinearGradient(sx, sy + shh, sx + sw, sy); gr.addColorStop(0, 'rgba(255,245,210,0)'); gr.addColorStop(0.5, `rgba(255,245,210,${0.55 * hk})`); gr.addColorStop(1, 'rgba(255,245,210,0)'); g.fillStyle = gr; g.fillRect(sx, sy, sw, shh); g.restore(); }
  // raindrops sliding on the glass
  const rr = rng(77);
  for (let k = 0; k < 22; k++) { const x = sx + rr() * sw, y0 = sy + rr() * shh, sp = 20 + rr() * 60, s = 5 + rr() * 9, y = sy + ((y0 - sy + lt * sp) % shh);
    g.fillStyle = 'rgba(20,30,60,0.35)'; g.beginPath(); g.ellipse(x + 1, y + 2, s, s * 1.2, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(200,230,255,0.45)'; g.beginPath(); g.ellipse(x, y, s, s * 1.2, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,0.85)'; g.beginPath(); g.arc(x - s * 0.35, y - s * 0.4, s * 0.3, 0, 7); g.fill(); }
  g.restore();
  // fingers wrapping the right edge, thumb on the left
  for (const [y, l] of [[-150, 34], [-70, 40], [10, 38], [88, 30]]) capsule(g, PW / 2 - 14, y, PW / 2 + l, y + 10, 25, SKIN);
  g.fillStyle = SKIN[1]; for (const y of [-150, -70, 10, 88]) { g.fillRect(PW / 2 - 18, y - 26, 6, 52); }
  capsule(g, 60, 420, -PW / 2 + 90, 170, 34, SKIN);
  g.fillStyle = '#f6dccb'; g.beginPath(); g.ellipse(-PW / 2 + 84, 180, 18, 13, -1.0, 0, 7); g.fill();
  g.restore();
  // screen light spilling on everything
  glow(g, 1000, 560, 520, 'rgba(120,190,255,0.5)', 0.45);
  bloom(g, 0.35, 20); grade(g, { vig: 0.55, seed: 5 });
}

// ---------- shot 3: car rounds the corner ----------
function shot3(g, lt, u, st) {
  const k = easeIn(clamp((lt - 0.3) / 3.5));
  const skid = B.skid - 7.5, shake = lt > skid ? Math.sin(lt * 70) * 6 * Math.max(0, 1 - (lt - skid) / 0.6) : 0;
  cam(g, st, 1.02 + 0.03 * u, W / 2, H / 2, shake, shake * 0.4);
  g.save(); g.translate(shake, shake * 0.4);
  const p = shot3Car(g, k, rng(Math.floor(lt * 24)));
  g.restore();
  rainAt(g, 33, lt, { n: 1000, len: [30, 60], a: [0.12, 0.3], w: [1, 1.6] });
  for (const a of [0.2, 1.52]) { const [x, y] = p(a, 0, 0.6); rainAt(g, 300 + a * 10, lt, { n: 300, len: [40, 80], a: [0.4, 0.85], w: [1.2, 2.2], col: '255,245,225', clip: (gg) => { gg.beginPath(); gg.moveTo(x, y); gg.lineTo(x + 1100, y - 300); gg.lineTo(x + 900, y + 520); gg.closePath(); gg.clip(); } }); }
  ripples(g, 34, lt, [0, 900, W, H], { n: 50 });
  rainAt(g, 35, lt, { n: 60, len: [120, 200], a: [0.12, 0.3], w: [2, 4], speed: 2600 });
}

// ---------- shot 5: paws in the puddles, slow motion (new) ----------
function shot5Static() {
  const [c, g] = off(); const r = rng(505);
  const sk = g.createLinearGradient(0, 0, 0, 820); sk.addColorStop(0, '#120a2a'); sk.addColorStop(1, '#4a1c5a'); g.fillStyle = sk; g.fillRect(0, 0, W, 820);
  const wt = g.createLinearGradient(0, 820, 0, H); wt.addColorStop(0, '#5a2a6a'); wt.addColorStop(1, '#100818'); g.fillStyle = wt; g.fillRect(0, 820, W, H - 820);
  return c;
}
const FUR = ['#5e2e0e', '#a8601f', '#d68a3a', '#f0b265'], WF = ['#8a7c78', '#d8cec2', '#f6f0e6', '#ffffff'];
function leg(g, x, y, ang, lift, L1, L2, rr) {
  const kx = x + Math.sin(ang) * L1, ky = y + Math.cos(ang) * L1 - lift * 0.5;
  const ang2 = ang * 0.4 - lift * 0.004; const px = kx + Math.sin(ang2) * L2, py = ky + Math.cos(ang2) * L2 - lift * 0.5;
  capsule(g, x, y, kx, ky, rr, FUR); capsule(g, kx, ky, px, py, rr * 0.8, [FUR[0], FUR[1], FUR[2], FUR[3]]);
  capsule(g, kx + (px - kx) * 0.55, ky + (py - ky) * 0.55, px, py, rr * 0.82, WF);
  g.fillStyle = WF[2]; g.beginPath(); g.ellipse(px - 18, py + 8, rr * 1.3, rr * 0.7, 0, 0, 7); g.fill(); g.strokeStyle = 'rgba(120,100,90,0.6)'; g.lineWidth = 3; for (const d of [-14, 0, 14]) { g.beginPath(); g.moveTo(px - 18 + d - 10, py + 14); g.lineTo(px - 18 + d - 10, py + 4); g.stroke(); }
  return [px - 18, py + 12];
}
function splash(g, x, y, age, seed) {
  if (age < 0 || age > 2.2) return; const r = rng(seed), a = age / 2.2;
  g.save(); g.strokeStyle = `rgba(230,240,255,${0.7 * (1 - a)})`; g.lineWidth = 3; g.beginPath(); g.ellipse(x, y, 60 + 260 * a, 14 + 50 * a, 0, 0, 7); g.stroke(); g.restore();
  for (let k = 0; k < 46; k++) {
    const ang = -Math.PI * (0.1 + 0.8 * r()), sp = 260 + r() * 420, tt = age * 0.55; // slow motion
    const dx = Math.cos(ang) * sp * tt, dy = Math.sin(ang) * sp * tt + 0.5 * 900 * tt * tt, s = 3 + r() * 9;
    if (dy > 40) continue;
    g.fillStyle = `rgba(225,238,255,${0.85 * (1 - a * 0.6)})`; g.beginPath(); g.ellipse(x + dx, y + dy, s * 0.8, s, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,0.95)'; g.beginPath(); g.arc(x + dx - s * 0.3, y + dy - s * 0.3, s * 0.3, 0, 7); g.fill();
  }
  // crown
  g.save(); g.fillStyle = `rgba(210,228,255,${0.55 * (1 - a)})`; const cr = Math.sin(clamp(a * 2) * Math.PI) * 90;
  for (let k = 0; k < 14; k++) { const xx = x - 120 + k * 18; g.beginPath(); g.moveTo(xx - 8, y); g.lineTo(xx, y - cr * (0.6 + 0.4 * Math.sin(k * 2.1))); g.lineTo(xx + 8, y); g.closePath(); g.fill(); }
  g.restore();
}
function dogRun(mg, X, Y, ph, sc) {
  mg.save(); mg.translate(X, Y - 10 * Math.abs(Math.sin(ph))); mg.scale(sc, sc); mg.rotate(0.06 * Math.sin(ph));
  const E2 = (x, y, rx, ry, rt = 0) => { mg.beginPath(); mg.ellipse(x, y, rx, ry, rt, 0, 7); mg.fill(); };
  const limb = (x, y, a1, l1, l2, w0, w1, back) => { const kx = x + Math.sin(a1) * l1, ky = y + Math.cos(a1) * l1; const a2 = a1 + (back ? -0.7 : 0.7) * (0.4 + 0.6 * Math.max(0, Math.cos(ph))); const px = kx + Math.sin(a2) * l2, py = ky + Math.cos(a2) * l2; thick(mg, w0, [[x, y], [kx, ky]]); thick(mg, (w0 + w1) / 2, [[kx, ky], [px, py]]); E2(px + (back ? -4 : 6), py + 3, w1 * 0.9, w1 * 0.55); };
  const s1 = Math.sin(ph), s2 = Math.sin(ph + 0.5);
  limb(60, -10, 0.95 * s2, 62, 58, 20, 12, false); limb(-70, -14, -0.95 * s2, 66, 58, 22, 12, true);
  E2(-10, -20, 92, 36, -0.04); E2(55, -18, 46, 42); E2(-72, -22, 40, 36);
  mg.lineWidth = 40; mg.lineCap = 'round'; mg.beginPath(); mg.moveTo(70, -34); mg.lineTo(108, -62); mg.stroke();
  E2(122, -70, 34, 29); mg.save(); mg.translate(160, -58); mg.rotate(0.28); E2(0, 0, 38, 15); mg.restore();
  mg.beginPath(); mg.moveTo(108, -92); mg.lineTo(116, -126); mg.lineTo(134, -94); mg.closePath(); mg.fill();
  mg.beginPath(); mg.moveTo(100, -88); mg.quadraticCurveTo(74, -84, 80, -56); mg.lineTo(98, -68); mg.closePath(); mg.fill();
  { const tw = 0.3 * Math.sin(ph * 2); thick(mg, 16, [[-104, -32], [-140, -46 + tw * 20]]); thick(mg, 10, [[-140, -46 + tw * 20], [-176, -54 + tw * 40]]); }
  limb(66, -8, 0.95 * s1, 64, 60, 22, 13, false); limb(-64, -12, -0.95 * s1, 68, 60, 24, 13, true);
  mg.restore();
}
function shot5(g, lt, u, st) {
  g.drawImage(st, 0, 0);
  const scroll = lt * 260, r = rng(510), GY = 820;
  { const [b2, bg2] = off(); bg2.filter = 'blur(22px)';
    for (let k = 0; k < 34; k++) { const col = ['#ff3cac', '#3cf2ff', '#ffd23c', '#ffb070', '#b06bff'][k % 5], x = ((r() * 2600 - scroll) % 2600 + 2600) % 2600 - 340, y = 120 + r() * 560, s = 30 + r() * 80;
      bg2.globalAlpha = 0.6; bg2.fillStyle = col; bg2.beginPath(); bg2.arc(x, y, s, 0, 7); bg2.fill();
      bg2.globalAlpha = 0.35; bg2.fillRect(x - s * 0.4, GY + 10 + (GY - y) * 0.2, s * 0.8, 240); }
    g.drawImage(b2, 0, 0); }
  // headlight glow rising from the right: the car is coming
  glow(g, 2000, 640, 900 * (0.6 + 0.4 * u), 'rgba(255,245,215,0.9)', 0.55 + 0.35 * u);
  const P = 1.25, ph = 2 * Math.PI * lt / P, X = 860, sc = 1.9, DY = GY - 228;
  // reflection
  { const [rc, rg] = off(); rg.fillStyle = '#000'; rg.strokeStyle = '#000'; rg.translate(0, 2 * GY); rg.scale(1, -1); dogRun(rg, X, DY, ph, sc);
    g.save(); g.globalAlpha = 0.45; g.filter = 'blur(3px)'; const [tc, tg] = off(); tg.drawImage(rc, 0, 0); tg.globalCompositeOperation = 'source-in'; tg.fillStyle = '#140a20'; tg.fillRect(0, 0, W, H); g.drawImage(tc, 0, 0); g.restore(); }
  rimSil(g, (mg) => dogRun(mg, X, DY, ph, sc), { col: '#ffe8c8', dx: 7, dy: -3, blur: 9 });
  // splashes at each footfall (front paws)
  for (let k = 0; k < 4; k++) { const tc = k * P + 0.15; splash(g, X + 120 - (lt - tc) * 260, GY + 6, (lt - tc) * 1.6, 10 + k); const tb = k * P + 0.75; splash(g, X - 150 - (lt - tb) * 260, GY + 6, (lt - tb) * 1.6, 20 + k); }
  ripples(g, 52, lt, [0, GY + 10, W, H], { n: 70, life: 1.4 });
  rainAt(g, 55, lt, { n: 700, len: [20, 40], a: [0.12, 0.3], speed: 520 });
  grade(g, { vig: 0.6, seed: 8 });
}

// ---------- shot 7: the freeze shatters into pixels, then white ----------
function shot7(g, lt, freeze) {
  g.fillStyle = '#fff'; g.fillRect(0, 0, W, H);
  const T = 40, nx = W / T, ny = H / T, r = rng(707), cx = 420, cy = 700;
  const k = easeIn(lt / 1.1);
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const x = i * T, y = j * T, dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy) + 1;
    const delay = d / 2600, kk = clamp((k - delay) / (1 - delay + 1e-6));
    const sp = 900 + r() * 1400, rot = (r() - 0.5) * 6;
    if (kk >= 1) continue;
    g.save(); g.globalAlpha = 1 - kk; g.translate(x + T / 2 + (dx / d) * sp * kk, y + T / 2 + (dy / d) * sp * kk + 500 * kk * kk); g.rotate(rot * kk); const s = 1 - kk * 0.6; g.scale(s, s);
    g.drawImage(freeze, x, y, T, T, -T / 2, -T / 2, T, T); g.restore();
  }
}

// ---------- shot 8: dawn ----------
function shot8(g, lt, u, st) {
  cam(g, st, 1.06 - 0.04 * u, W / 2, H / 2, -40 * u, 0);
  const r = rng(808);
  for (let k = 0; k < 60; k++) { const x0 = r() * W, y0 = r() * H, sp = 15 + r() * 30, s = 1 + r() * 3; const y = ((y0 - lt * sp) % H + H) % H, x = x0 + Math.sin(lt * 0.8 + k) * 20; g.fillStyle = `rgba(255,240,200,${0.25 + r() * 0.4})`; g.beginPath(); g.arc(x, y, s, 0, 7); g.fill(); }
  // breathing zzz
  g.save(); g.font = '46px Bangers'; g.fillStyle = 'rgba(255,255,255,0.9)';
  for (let k = 0; k < 3; k++) { const a = ((lt + k * 0.9) % 2.7) / 2.7; g.globalAlpha = Math.sin(a * Math.PI); g.fillText('z', 990 + a * 60 - 40 * u, 760 - a * 140); }
  g.restore();
}

// ---------- overlays drawn after pixelation (crisp) ----------
function captionAt(g, t, t0, x, y, text) { const k = easeOut((t - t0) / 0.35); if (k <= 0) return; g.save(); g.globalAlpha = k; g.translate(0, (1 - k) * 16); caption_(g, x, y, text, 46); g.restore(); }
function freezeOverlay(g, lt) {
  const f = easeOut(lt / 0.12);
  g.save(); g.globalCompositeOperation = 'color'; g.fillStyle = `rgba(120,60,160,${0.25 * f})`; g.fillRect(0, 0, W, H); g.restore();
  const bw = 34 * f; g.fillStyle = '#fff'; g.fillRect(0, 0, W, bw); g.fillRect(0, H - bw, W, bw); g.fillRect(0, 0, bw, H); g.fillRect(W - bw, 0, bw, H);
  g.lineWidth = 10; g.strokeStyle = `rgba(17,17,17,${f})`; g.strokeRect(bw, bw, W - 2 * bw, H - 2 * bw);
  const nk = (lt - (B.nhac - B.freeze)) / 0.22; if (nk <= 0) return;
  const s = nk < 1 ? 0.3 + 0.95 * easeOut(nk) : 1.25 - 0.25 * easeOut((nk - 1) * 0.22 / 0.3);
  g.save(); g.translate(400, 470); g.rotate(-0.1); g.scale(s, s); g.font = '150px Bangers'; g.textAlign = 'center'; g.lineJoin = 'round';
  g.lineWidth = 26; g.strokeStyle = '#111'; g.strokeText('NHAC!', 8, 8); g.strokeText('NHAC!', 0, 0);
  const tg = g.createLinearGradient(0, -80, 0, 60); tg.addColorStop(0, '#fff36a'); tg.addColorStop(1, '#ff8a1e'); g.fillStyle = tg; g.fillText('NHAC!', 0, 0); g.restore();
}

// ---------- caches ----------
const ST = {};
ST[1] = cache(1); ST[3] = (window.SHOT3_NOCAR = true, cache(3)); window.SHOT3_NOCAR = false;
ST[4] = cache(4); ST[6] = cache(6); ST[8] = cache(8); ST[2] = shot2Static(); ST[5] = shot5Static();
// the frozen frame (pixelated, with overlay) feeds the shatter
const [FZ, fzg] = off(); fzg.drawImage(ST[6], 0, 0); rainAt(fzg, 66, 0, { n: 700, len: [40, 80], a: [0.2, 0.5], frozen: true }); pixelate(fzg, 4, 12); freezeOverlay(fzg, 2);

function render(t) {
  const s = TL.shots.find((x) => t >= x.start && t < x.end) || TL.shots[TL.shots.length - 1];
  const lt = t - s.start, u = lt / (s.end - s.start);
  ctx.save(); ctx.clearRect(0, 0, W, H);
  if (s.id === 1) { cam(ctx, ST[1], 1 + 0.06 * ease(u), 900, 640); rainAt(ctx, 11, lt, { n: 1100, len: [14, 32], a: [0.08, 0.25], w: [0.8, 1.2], slant: 0.05 }); ripples(ctx, 12, lt, [0, 720, W, H], { n: 90 }); rainAt(ctx, 13, lt, { n: 80, len: [90, 160], a: [0.15, 0.35], w: [2, 3.5], speed: 2600 }); }
  if (s.id === 2) shot2(ctx, lt, u, ST[2]);
  if (s.id === 3) shot3(ctx, lt, u, ST[3]);
  if (s.id === 4) {
    const ear = easeOut((t - B.earUp) / 0.25), nud = ear > 0 && ear < 1 ? Math.sin(ear * Math.PI) * 10 : 0;
    cam(ctx, ST[4], 1 + 0.07 * ease(u), 960, 600, 0, -nud);
    const fl = easeIn((t - B.eyeFlare + 1.2) / 1.6);
    for (const [x, y, rr] of [[927, 599, 120], [1004, 632, 80]]) glow(ctx, x, y, rr * (0.6 + 1.6 * fl), 'rgba(255,250,230,0.95)', 0.4 + 0.6 * fl);
    rainAt(ctx, 41, lt, { n: 220, len: [40, 90], a: [0.1, 0.3], w: [1, 2.5] });
  }
  if (s.id === 5) shot5(ctx, lt, u, ST[5]);
  if (s.id === 6) { const pk = easeOut(lt / 0.25); cam(ctx, ST[6], 1.12 - 0.12 * pk, 420, 700); rainAt(ctx, 66, 0, { n: 700, len: [40, 80], a: [0.2, 0.5], frozen: true }); }
  if (s.id === 7) { shot7(ctx, lt, FZ); }
  if (s.id === 8) shot8(ctx, lt, u, ST[8]);
  ctx.restore();
  if (s.id !== 7) pixelate(ctx, 4, 12);
  // crisp overlays
  if (s.id === 1) captionAt(ctx, t, B.caption1, 70, 900, 'UM SEGUNDO.');
  if (s.id === 6) { const fl = 1 - clamp(lt / 0.18); if (fl > 0) { ctx.fillStyle = `rgba(255,255,255,${fl})`; ctx.fillRect(0, 0, W, H); } freezeOverlay(ctx, lt); }
  if (s.id === 8) { const wf = 1 - clamp(lt / 0.9); if (wf > 0) { ctx.fillStyle = `rgba(255,255,255,${wf})`; ctx.fillRect(0, 0, W, H); } captionAt(ctx, t, B.caption8, 70, 70, 'TRÊS SEMANAS ANTES...'); }
}
window.render = render;
window.__ready = true;
