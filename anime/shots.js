// Cinematic-anime shots for Story 1, scene 1. Each shot is render(ctx, t) — pure in t.
const W = 1920, H = 1080;
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const Q = new URLSearchParams(location.search);
const SHOT = Q.get('shot') || '1', T = parseFloat(Q.get('t') || '0');
await document.fonts.load('60px Bangers');

const rng = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);
const off = (w = W, h = H) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; };
function glow(g, x, y, r, col, a = 1) {
  const gr = g.createRadialGradient(x, y, 0, x, y, r);
  gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = a; g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.restore();
}
const poly = (g, pts, fill) => { g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); if (fill) { g.fillStyle = fill; g.fill(); } };
function grade(g, { vig = 0.55, grain = 0.06, seed = 3 } = {}) {
  const v = g.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.95);
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(5,2,15,${vig})`); g.fillStyle = v; g.fillRect(0, 0, W, H);
  const [nc, ng] = off(480, 270); const id = ng.createImageData(480, 270); const r = rng(seed);
  for (let i = 0; i < id.data.length; i += 4) { const n = r() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = n; id.data[i + 3] = 255; }
  ng.putImageData(id, 0, 0); g.save(); g.globalAlpha = grain; g.globalCompositeOperation = 'overlay'; g.drawImage(nc, 0, 0, W, H); g.restore();
}
function bloom(g, amount = 0.45, blur = 22) {
  const [c2, g2] = off(); g2.filter = `blur(${blur}px) brightness(1.2)`; g2.drawImage(g.canvas, 0, 0);
  g.save(); g.globalCompositeOperation = 'screen'; g.globalAlpha = amount; g.drawImage(c2, 0, 0); g.restore();
}
function rain(g, r, { n = 900, len = [30, 70], a = [0.15, 0.45], w = [1, 2], slant = 0.12, col = '200,220,255', clip = null } = {}) {
  g.save(); if (clip) clip(g); g.lineCap = 'round';
  for (let k = 0; k < n; k++) {
    const x = r() * (W + 200) - 100, y = r() * H, L = len[0] + r() * (len[1] - len[0]);
    g.strokeStyle = `rgba(${col},${a[0] + r() * (a[1] - a[0])})`; g.lineWidth = w[0] + r() * (w[1] - w[0]);
    g.beginPath(); g.moveTo(x, y); g.lineTo(x - L * slant, y + L); g.stroke();
  }
  g.restore();
}
function caption(g, x, y, text, size = 46) {
  g.save(); g.textAlign = 'left'; g.font = `${size}px Bangers`; const w = g.measureText(text).width + 44, h = size + 26;
  g.fillStyle = 'rgba(0,0,0,0.85)'; g.fillRect(x + 7, y + 7, w, h);
  g.fillStyle = '#ffe066'; g.fillRect(x, y, w, h); g.lineWidth = 4; g.strokeStyle = '#111'; g.strokeRect(x, y, w, h);
  g.fillStyle = '#111'; g.textBaseline = 'middle'; g.fillText(text, x + 22, y + h / 2 + 2); g.restore();
}

function rimSil(g, draw, { col = '#fff1d0', dx = 6, dy = -2, blur = 8, fill = '#05030a' } = {}) {
  const [m, mg] = off(); mg.fillStyle = '#000'; mg.strokeStyle = '#000'; draw(mg);
  const [rc, rg] = off(); rg.drawImage(m, 0, 0); rg.globalCompositeOperation = 'source-in'; rg.fillStyle = col; rg.fillRect(0, 0, W, H);
  g.save(); g.globalCompositeOperation = 'lighter'; g.filter = `blur(${blur}px)`; g.drawImage(rc, dx, dy); g.filter = 'none'; g.drawImage(rc, dx * 0.6, dy * 0.6); g.restore();
  const [fc, fg] = off(); fg.drawImage(m, 0, 0); fg.globalCompositeOperation = 'source-in'; fg.fillStyle = fill; fg.fillRect(0, 0, W, H); g.drawImage(fc, 0, 0);
  return m;
}
const thick = (g, w, pts) => { g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); };

// ---------------- SHOT 1: rainy street, low angle ----------------
function shot1(g, t) {
  const r = rng(21);
  const F = 980, CX = 900, CY = 640, CAMY = 1.0;
  const P = (x, y, z) => [CX + (F * x) / z, CY - (F * (y - CAMY)) / z];
  // sky
  const sk = g.createLinearGradient(0, 0, 0, CY);
  sk.addColorStop(0, '#07061a'); sk.addColorStop(0.45, '#1d1146'); sk.addColorStop(0.8, '#5a1f6e'); sk.addColorStop(1, '#e0607a');
  g.fillStyle = sk; g.fillRect(0, 0, W, CY + 40);
  { const [c2, g2] = off(); g2.filter = 'blur(26px)';
    for (let k = 0; k < 26; k++) { const x = r() * W, y = 40 + r() * 380, rx = 120 + r() * 260, ry = 30 + r() * 60;
      g2.fillStyle = `rgba(${40 + r() * 30},${20 + r() * 20},${70 + r() * 40},0.75)`; g2.beginPath(); g2.ellipse(x, y, rx, ry, 0, 0, 7); g2.fill();
      g2.fillStyle = 'rgba(255,110,170,0.18)'; g2.beginPath(); g2.ellipse(x, y + ry * 0.6, rx * 0.8, ry * 0.35, 0, 0, 7); g2.fill(); }
    g.drawImage(c2, 0, 0); }
  glow(g, CX + 120, CY - 40, 700, 'rgba(255,90,140,0.55)', 0.8);
  // far skyline
  for (let x = -40; x < W + 40;) { const w = 30 + r() * 70, h = 40 + r() * 150; g.fillStyle = '#1a1033'; g.fillRect(x, CY - h, w, h + 10);
    for (let yy = CY - h + 6; yy < CY - 4; yy += 7) for (let xx = x + 4; xx < x + w - 4; xx += 6) if (r() > 0.78) { g.fillStyle = ['#ffcf6a', '#7af0ff', '#ff8ad0'][Math.floor(r() * 3)]; g.globalAlpha = 0.7; g.fillRect(xx, yy, 2, 3); g.globalAlpha = 1; }
    x += w + 2; }
  const fogB = g.createLinearGradient(0, CY - 220, 0, CY + 10); fogB.addColorStop(0, 'rgba(120,40,110,0)'); fogB.addColorStop(1, 'rgba(160,60,130,0.55)'); g.fillStyle = fogB; g.fillRect(0, CY - 220, W, 230);

  const lights = []; // [x,y,z,color,size]
  const neon = ['#ff3cac', '#3cf2ff', '#ffd23c', '#5dff7a', '#ff6a3c', '#b06bff'];
  // buildings (far → near)
  const blds = [];
  for (const side of [-1, 1]) { let z = 7; while (z < 150) { const d = 5 + r() * 9, h = 6 + r() * 10; blds.push({ side, z1: z, z2: z + d, h, hue: r() }); z += d; } }
  blds.sort((a, b) => b.z1 - a.z1);
  const FX = 7.2;
  for (const b of blds) {
    const x = b.side * FX, x2 = b.side * (FX + 12);
    const fog = Math.min(1, (b.z1 - 7) / 110);
    const base = `hsl(${250 + b.hue * 50},${30 + b.hue * 20}%,${10 + (1 - fog) * 6}%)`;
    poly(g, [P(x, 0, b.z1), P(x, b.h, b.z1), P(x2, b.h, b.z1), P(x2, 0, b.z1)], `hsl(${250 + b.hue * 50},30%,${7 + (1 - fog) * 4}%)`);
    poly(g, [P(x, 0, b.z1), P(x, b.h, b.z1), P(x, b.h, b.z2), P(x, 0, b.z2)], base);
    // roof edge highlight
    g.strokeStyle = 'rgba(255,140,200,0.25)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(...P(x, b.h, b.z1)); g.lineTo(...P(x, b.h, b.z2)); g.stroke();
    // windows
    for (let fy = 3.2; fy < b.h - 1; fy += 3) for (let fz = b.z1 + 1; fz < b.z2 - 1.2; fz += 2.2) {
      if (r() > 0.55) continue;
      const col = r() > 0.25 ? (r() > 0.5 ? '#ffc46a' : '#ffe3a0') : neon[Math.floor(r() * neon.length)];
      const q = [P(x, fy, fz), P(x, fy + 1.4, fz), P(x, fy + 1.4, fz + 1.1), P(x, fy, fz + 1.1)];
      g.globalAlpha = 0.95 - fog * 0.5; poly(g, q, col); g.globalAlpha = 1;
      if (r() > 0.6) lights.push([x, fy + 0.7, fz + 0.5, col, 0.9]);
    }
    // ground-floor shop glow
    if (b.z1 < 80 && r() > 0.35) { const col = neon[Math.floor(r() * neon.length)];
      g.globalAlpha = 0.85; poly(g, [P(x, 0.2, b.z1 + 0.6), P(x, 2.4, b.z1 + 0.6), P(x, 2.4, b.z2 - 0.6), P(x, 0.2, b.z2 - 0.6)], r() > 0.5 ? '#ffd9a0' : '#ffb070'); g.globalAlpha = 1;
      lights.push([x, 1.2, (b.z1 + b.z2) / 2, '#ffb070', 2.5]);
      // blade sign
      const sz = b.z1 + 1.5, sx0 = b.side * (FX - 0.1), sx1 = b.side * (FX - 1.4);
      const q = [P(sx0, 3, sz), P(sx0, 6.5, sz), P(sx1, 6.5, sz), P(sx1, 3, sz)];
      g.save(); g.shadowColor = col; g.shadowBlur = 30; poly(g, q, '#14101f'); g.lineWidth = 3; g.strokeStyle = col; g.stroke(); g.restore();
      const [cx, cy] = P((sx0 + sx1) / 2, 4.75, sz), sc = F / sz;
      g.save(); g.fillStyle = col; g.shadowColor = col; g.shadowBlur = 18; g.font = `${Math.max(6, sc * 0.42)}px Bangers`; g.textAlign = 'center';
      const word = ['BAR', 'HOTEL', 'PÃO', 'CAFÉ', 'LANCHE', 'FARMÁCIA'][Math.floor(r() * 6)];
      [...word].slice(0, 6).forEach((ch, i, arr) => g.fillText(ch, cx, cy - (arr.length / 2 - i - 0.8) * sc * 0.48)); g.restore();
      lights.push([(sx0 + sx1) / 2, 4.75, sz, col, 3]);
    }
  }
  // ground: sidewalks + road
  poly(g, [P(-4.6, 0, 5), P(4.6, 0, 5), P(4.6, 0, 400), P(-4.6, 0, 400)], '#120d22');
  const rd = g.createLinearGradient(0, CY, 0, H); rd.addColorStop(0, 'rgba(90,40,90,0.9)'); rd.addColorStop(0.25, 'rgba(30,18,46,0.6)'); rd.addColorStop(1, 'rgba(6,4,14,0.2)');
  g.fillStyle = rd; g.fillRect(0, CY, W, H - CY);
  for (const s of [-1, 1]) { poly(g, [P(s * 4.6, 0, 3), P(s * FX, 0, 3), P(s * FX, 0, 400), P(s * 4.6, 0, 400)], '#1c1530');
    g.strokeStyle = 'rgba(255,180,220,0.35)'; g.lineWidth = 2; g.beginPath(); g.moveTo(...P(s * 4.6, 0.15, 3)); g.lineTo(...P(s * 4.6, 0.15, 300)); g.stroke(); }
  // crosswalk
  for (let k = -4; k <= 4; k++) { g.globalAlpha = 0.5; poly(g, [P(k - 0.3, 0, 9), P(k + 0.3, 0, 9), P(k + 0.3, 0, 13), P(k - 0.3, 0, 13)], '#d9d2e6'); g.globalAlpha = 1; }
  // lane dashes
  for (let z = 16; z < 200; z += 8) { g.globalAlpha = 0.45; poly(g, [P(-0.08, 0, z), P(0.08, 0, z), P(0.08, 0, z + 3), P(-0.08, 0, z + 3)], '#ffd27a'); g.globalAlpha = 1; }
  // poles, lamps, wires, traffic light
  const tops = { '-1': [], '1': [] };
  for (const s of [-1, 1]) for (let z = 10; z < 160; z += 22) {
    const x = s * 5.2; const [bx, by] = P(x, 0, z), [tx, ty] = P(x, 9, z);
    g.strokeStyle = '#06040c'; g.lineWidth = Math.max(1, 0.25 * F / z); g.beginPath(); g.moveTo(bx, by); g.lineTo(tx, ty); g.stroke();
    const [ax, ay] = P(x - s * 1.6, 7.4, z); g.lineWidth = Math.max(1, 0.12 * F / z); g.beginPath(); g.moveTo(...P(x, 7.4, z)); g.lineTo(ax, ay); g.stroke();
    lights.push([x - s * 1.6, 7.3, z, '#ffd9a0', 6]); tops[s].push([x, 8.6, z]);
  }
  g.strokeStyle = 'rgba(5,3,12,0.9)';
  for (const s of [-1, 1]) for (let k = 0; k < tops[s].length - 1; k++) for (const dy of [0, -0.4, -0.8]) {
    const [x, y, z] = tops[s][k], [, , z2] = tops[s][k + 1]; g.lineWidth = 1.2; g.beginPath();
    for (let u = 0; u <= 20; u++) { const zz = z + (z2 - z) * (u / 20), yy = y + dy - Math.sin((u / 20) * Math.PI) * 0.8; const [px, py] = P(x, yy, zz); u ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke();
  }
  for (const [z, dy] of [[10, 0], [32, -0.3], [54, 0]]) { g.lineWidth = 1.4; g.beginPath(); for (let u = 0; u <= 30; u++) { const x = -5.2 + 10.4 * (u / 30), yy = 8.6 + dy - Math.sin((u / 30) * Math.PI) * 1.2; const [px, py] = P(x, yy, z); u ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke(); }
  { const z = 32, [x0, y0] = P(-0.6, 6.4, z), sc = F / z; g.fillStyle = '#05030a'; g.fillRect(x0, y0, sc * 1.2, sc * 0.5);
    lights.push([-0.35, 6.15, z, '#ff2b3a', 4]); lights.push([0, 6.15, z, '#3a1414', 0.5]); }
  // light sources: glows + wet reflections
  const [rc, rg] = off();
  for (const [x, y, z, col, s] of lights) {
    const [sx, sy] = P(x, y, z), sc = F / z;
    glow(g, sx, sy, Math.min(260, sc * s * 0.9), col, 0.55);
    const [gx, gy] = P(x, 0, z), [mx, my] = P(x, -y * 1.1, z);
    const len = Math.max(10, my - gy), wd = Math.max(2, sc * Math.min(s, 2.5) * 0.35);
    for (let yy = gy; yy < Math.min(H, gy + len * 1.4); yy += 2) {
      const u = (yy - gy) / (len * 1.4); const jit = (r() - 0.5) * wd * 1.6;
      rg.globalAlpha = (1 - u) * 0.7; rg.fillStyle = col; rg.fillRect(sx - wd / 2 + jit, yy, wd * (0.6 + r() * 0.8), 2);
    }
  }
  g.save(); g.globalCompositeOperation = 'lighter'; g.filter = 'blur(2px)'; g.globalAlpha = 0.6; g.drawImage(rc, 0, 0); g.restore();
  // Otávio, small silhouette on the crosswalk with phone glow
  { const z = 11.5, x = 0.9, sc = F / z; const [fx, fy] = P(x, 0, z);
    g.save(); g.translate(fx, fy); g.scale(sc / 100, sc / 100); g.fillStyle = '#07050d';
    g.beginPath(); g.moveTo(-22, -150); g.quadraticCurveTo(-30, -100, -28, -40); g.lineTo(-14, -40); g.lineTo(-12, 0); g.lineTo(-2, 0); g.lineTo(0, -38); g.lineTo(4, 0); g.lineTo(14, 0); g.lineTo(16, -40); g.lineTo(28, -40); g.quadraticCurveTo(30, -100, 22, -150); g.closePath(); g.fill();
    g.beginPath(); g.ellipse(0, -168, 14, 17, 0, 0, 7); g.fill(); g.fillRect(-9, -154, 18, 8);
    g.fillRect(14, -130, 10, 40); g.restore();
    glow(g, fx + sc * 0.12, fy - sc * 1.1, sc * 0.25, 'rgba(140,230,255,0.9)', 0.9);
    g.fillStyle = '#bff4ff'; g.fillRect(fx + sc * 0.1, fy - sc * 1.06, sc * 0.05, sc * 0.08);
    g.strokeStyle = 'rgba(255,90,180,0.6)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(fx - sc * 0.28, fy - sc * 1.45); g.quadraticCurveTo(fx - sc * 0.31, fy - sc * 0.9, fx - sc * 0.3, fy - sc * 0.4); g.stroke();
    const [rx, ry] = P(x, 0, z); g.save(); g.globalAlpha = 0.25; g.fillStyle = '#7af0ff'; g.fillRect(rx + sc * 0.08, ry + 4, sc * 0.08, sc * 0.6); g.restore();
  }
  // rain + splashes
  rain(g, rng(5), { n: 1400, len: [14, 30], a: [0.08, 0.25], w: [0.8, 1.2] });
  for (const [x, y, z, col, s] of lights) { const [sx, sy] = P(x, y, z), rad = Math.min(240, (F / z) * s * 0.8); if (rad < 40) continue;
    rain(g, rng(Math.floor(sx + sy)), { n: Math.floor(rad / 3), len: [20, 40], a: [0.3, 0.7], w: [1, 1.6], col: '255,235,220', clip: (gg) => { gg.beginPath(); gg.arc(sx, sy, rad, 0, 7); gg.clip(); } }); }
  { const r2 = rng(9); g.strokeStyle = 'rgba(220,230,255,0.35)'; g.lineWidth = 1; for (let k = 0; k < 260; k++) { const z = 4 + r2() * 40, x = (r2() - 0.5) * 9; const [sx, sy] = P(x, 0, z), sc = F / z; g.beginPath(); g.ellipse(sx, sy, sc * 0.12, sc * 0.03, 0, 0, 7); g.stroke(); } }
  rain(g, rng(77), { n: 90, len: [90, 160], a: [0.15, 0.35], w: [2, 3.5] });
  bloom(g, 0.5, 24);
  grade(g, { vig: 0.6 });
  caption(g, 70, 900, 'UM SEGUNDO.');
}

// ---------------- SHOT 4: Caramelo's eye, headlights reflected ----------------
function shot4(g, t) {
  const r = rng(44);
  const bg = g.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#0a0718'); bg.addColorStop(1, '#2a0f36'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
  { const [c2, g2] = off(); g2.filter = 'blur(14px)';
    for (let k = 0; k < 40; k++) { const x = 1200 + r() * 800, y = r() * 700, rad = 20 + r() * 70; g2.globalAlpha = 0.35 + r() * 0.4; g2.fillStyle = ['#ff3cac', '#3cf2ff', '#ffd23c', '#5dff7a', '#ffb070', '#b06bff'][Math.floor(r() * 6)]; g2.beginPath(); g2.arc(x, y, rad, 0, 7); g2.fill(); }
    g.drawImage(c2, 0, 0); }
  glow(g, 1820, 380, 900, 'rgba(255,245,215,0.95)', 0.9); glow(g, 1820, 380, 260, 'rgba(255,255,255,1)', 1);
  g.save(); g.globalCompositeOperation = 'lighter'; const st = g.createLinearGradient(900, 380, 1920, 380); st.addColorStop(0, 'rgba(120,180,255,0)'); st.addColorStop(1, 'rgba(160,210,255,0.6)'); g.fillStyle = st; g.fillRect(900, 372, 1020, 16); g.restore();
  g.save(); g.translate(40, 190); g.scale(0.9, 0.9);
  const head = new Path2D(); head.moveTo(-60, 1140); head.bezierCurveTo(-80, 600, -40, 260, 220, 120); head.bezierCurveTo(520, -20, 1050, 20, 1290, 210);
  head.bezierCurveTo(1380, 290, 1420, 380, 1470, 450); head.bezierCurveTo(1580, 470, 1690, 520, 1730, 640); head.bezierCurveTo(1760, 760, 1720, 880, 1600, 930);
  head.bezierCurveTo(1450, 1000, 1250, 1060, 1100, 1140); head.closePath();
  const muz = new Path2D(); muz.moveTo(1180, 560); muz.bezierCurveTo(1350, 470, 1600, 500, 1700, 600); muz.bezierCurveTo(1760, 720, 1720, 900, 1560, 950); muz.bezierCurveTo(1380, 1010, 1220, 1100, 1120, 1140); muz.bezierCurveTo(1060, 950, 1080, 700, 1180, 560); muz.closePath();
  // ear (lifting) behind/top-left
  const ear = (dx, dy, a) => { g.save(); g.globalAlpha = a; g.translate(dx, dy); g.beginPath(); g.moveTo(80, 260); g.bezierCurveTo(60, 60, 160, -120, 300, -150); g.bezierCurveTo(380, 0, 470, 120, 520, 210); g.closePath(); g.fillStyle = '#b8742e'; g.fill();
    g.beginPath(); g.moveTo(150, 230); g.bezierCurveTo(150, 90, 220, -40, 295, -80); g.bezierCurveTo(350, 40, 410, 130, 440, 210); g.closePath(); g.fillStyle = '#e88f9a'; g.fill(); g.restore(); };
  g.save(); g.translate(260, 60); g.scale(1.25, 1.25); ear(-30, 26, 0.22); ear(-15, 13, 0.4); ear(0, 0, 1); g.restore();
  const base = g.createLinearGradient(0, 0, 1700, 900); base.addColorStop(0, '#6e3a12'); base.addColorStop(0.5, '#b9702a'); base.addColorStop(1, '#eba557');
  g.fillStyle = base; g.fill(head); g.fillStyle = '#f1e6d6'; g.fill(muz);
  // fur strokes
  g.save(); g.clip(head); g.lineCap = 'round';
  const EX = 900, EY = 540;
  for (let k = 0; k < 14000; k++) {
    const x = -60 + r() * 1820, y = r() * 1140; if (!g.isPointInPath(head, x * 0.9 + 40, y * 0.9 + 190)) continue;
    const inMuz = g.isPointInPath(muz, x * 0.9 + 40, y * 0.9 + 190);
    let ang = Math.atan2(0.35, -1) + (r() - 0.5) * 0.5;
    const dx = x - EX, dy = y - EY, d = Math.hypot(dx, dy);
    if (d < 420) { const tang = Math.atan2(dy, dx) + Math.PI / 2; const w = Math.max(0, 1 - d / 420) * 0.8; ang = ang * (1 - w) + tang * w; }
    if (inMuz) ang = Math.atan2(0.6, -1) + (r() - 0.5) * 0.6;
    const L = 12 + r() * 26, lit = (x / 1700) * 0.6 + (1 - y / 1100) * 0.4 + (r() - 0.5) * 0.35;
    const pal = inMuz ? ['#c9bba8', '#e6dccd', '#f6efe4', '#ffffff'] : ['#5e2e0e', '#8f4f1a', '#b9702a', '#d68a3a', '#f0b265'];
    g.strokeStyle = pal[Math.max(0, Math.min(pal.length - 1, Math.floor(lit * pal.length)))]; g.globalAlpha = 0.55 + r() * 0.4; g.lineWidth = 1.5 + r() * 2.2;
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(ang) * L * 0.5 + (r() - 0.5) * 6, y + Math.sin(ang) * L * 0.5, x + Math.cos(ang) * L, y + Math.sin(ang) * L); g.stroke();
  }
  g.globalAlpha = 1;
  g.restore();
  { const bez = (p0, p1, p2, p3, u) => { const a = 1 - u; return [a * a * a * p0[0] + 3 * a * a * u * p1[0] + 3 * a * u * u * p2[0] + u * u * u * p3[0], a * a * a * p0[1] + 3 * a * a * u * p1[1] + 3 * a * u * u * p2[1] + u * u * u * p3[1]]; };
    const segs = [[[-60, 1140], [-80, 600], [-40, 260], [220, 120]], [[220, 120], [520, -20], [1050, 20], [1290, 210]], [[1290, 210], [1380, 290], [1420, 380], [1470, 450]]];
    g.lineCap = 'round';
    for (const sg of segs) for (let u = 0; u < 1; u += 0.004) { const [x, y] = bez(...sg, u), [x2, y2] = bez(...sg, u + 0.004); const nx = (y2 - y), ny = -(x2 - x), nl = Math.hypot(nx, ny) || 1;
      const L = 10 + r() * 22, a = Math.atan2(ny / nl, nx / nl) - 0.9 + (r() - 0.5) * 0.4;
      g.strokeStyle = ['#b9702a', '#d68a3a', '#f0b265', '#ffd79a'][Math.floor(r() * 4)]; g.lineWidth = 2 + r() * 2.5;
      g.beginPath(); g.moveTo(x - (nx / nl) * 6, y - (ny / nl) * 6); g.quadraticCurveTo(x + Math.cos(a) * L * 0.5, y + Math.sin(a) * L * 0.5, x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke(); } }
  g.save(); g.clip(head);
  // rim light from headlights
  g.globalCompositeOperation = 'lighter'; g.lineWidth = 60; g.filter = 'blur(18px)'; g.strokeStyle = 'rgba(255,230,190,0.55)'; g.stroke(head); g.filter = 'none';
  g.lineWidth = 6; g.strokeStyle = 'rgba(255,250,235,0.6)'; g.stroke(head); g.globalCompositeOperation = 'source-over';
  // cheek blush (anime)
  g.fillStyle = 'rgba(255,120,140,0.28)'; g.filter = 'blur(16px)'; g.beginPath(); g.ellipse(1050, 830, 110, 40, -0.2, 0, 7); g.fill(); g.filter = 'none';
  // eye socket + eye
  g.save(); g.translate(EX, EY); g.scale(1.22, 1.22); g.translate(-EX, -EY);
  g.filter = 'blur(10px)'; g.fillStyle = 'rgba(60,25,8,0.85)'; g.beginPath(); g.ellipse(EX, EY, 230, 190, -0.12, 0, 7); g.fill(); g.filter = 'none';
  const eye = new Path2D(); eye.moveTo(EX - 205, EY + 20); eye.bezierCurveTo(EX - 150, EY - 170, EX + 140, EY - 190, EX + 215, EY - 40); eye.bezierCurveTo(EX + 190, EY + 120, EX - 60, EY + 190, EX - 205, EY + 20); eye.closePath();
  g.fillStyle = '#1a0a04'; g.fill(eye);
  g.save(); g.clip(eye);
  const ir = g.createRadialGradient(EX + 10, EY - 10, 20, EX, EY + 20, 220); ir.addColorStop(0, '#120604'); ir.addColorStop(0.45, '#3a1a0a'); ir.addColorStop(0.75, '#7a3e16'); ir.addColorStop(1, '#2a1006');
  g.fillStyle = ir; g.beginPath(); g.ellipse(EX, EY + 10, 175, 165, 0, 0, 7); g.fill();
  const low = g.createLinearGradient(0, EY + 40, 0, EY + 180); low.addColorStop(0, 'rgba(220,140,60,0)'); low.addColorStop(1, 'rgba(240,160,70,0.75)'); g.fillStyle = low; g.beginPath(); g.ellipse(EX, EY + 60, 150, 120, 0, 0, Math.PI); g.fill();
  for (let k = 0; k < 70; k++) { const a = r() * Math.PI * 2, r0 = 70 + r() * 30, r1 = r0 + 40 + r() * 50; g.strokeStyle = `rgba(${200 + r() * 55},${110 + r() * 60},50,${0.15 + r() * 0.2})`; g.lineWidth = 2; g.beginPath(); g.moveTo(EX + Math.cos(a) * r0, EY + 10 + Math.sin(a) * r0); g.lineTo(EX + Math.cos(a) * r1, EY + 10 + Math.sin(a) * r1); g.stroke(); }
  g.fillStyle = '#050203'; g.beginPath(); g.ellipse(EX + 5, EY + 5, 80, 86, 0, 0, 7); g.fill();
  g.fillStyle = 'rgba(0,0,0,0.55)'; g.beginPath(); g.ellipse(EX, EY - 150, 260, 90, 0, 0, 7); g.fill(); // lid shadow
  // reflections: two headlights + neon dots + window arc
  for (const [x, y, rr] of [[EX + 70, EY - 70, 46], [EX + 140, EY - 40, 30]]) { glow(g, x, y, rr * 2.6, 'rgba(255,250,230,0.9)', 0.9); g.fillStyle = '#ffffff'; g.beginPath(); g.arc(x, y, rr, 0, 7); g.fill(); }
  for (const [x, y, c] of [[EX - 90, EY - 50, '#ff3cac'], [EX - 60, EY - 80, '#3cf2ff'], [EX - 120, EY - 10, '#ffd23c']]) { glow(g, x, y, 26, c, 0.9); g.fillStyle = c; g.beginPath(); g.arc(x, y, 6, 0, 7); g.fill(); }
  g.strokeStyle = 'rgba(255,255,255,0.55)'; g.lineWidth = 5; g.beginPath(); g.arc(EX, EY + 40, 150, 0.35, 1.25); g.stroke();
  g.restore();
  g.lineWidth = 14; g.lineCap = 'round'; g.strokeStyle = '#140804'; g.beginPath(); g.moveTo(EX - 215, EY + 25); g.bezierCurveTo(EX - 150, EY - 172, EX + 140, EY - 194, EX + 222, EY - 42); g.stroke();
  g.lineWidth = 5; g.strokeStyle = '#3a1a0a'; g.beginPath(); g.moveTo(EX + 215, EY - 30); g.bezierCurveTo(EX + 190, EY + 125, EX - 60, EY + 195, EX - 205, EY + 25); g.stroke();
  g.lineWidth = 3; g.strokeStyle = 'rgba(255,230,200,0.6)'; g.beginPath(); g.moveTo(EX + 150, EY + 105); g.quadraticCurveTo(EX + 40, EY + 170, EX - 120, EY + 120); g.stroke();
  g.restore();
  // raised brow tuft
  g.save(); g.lineCap = 'round'; for (let k = 0; k < 120; k++) { const x = EX - 160 + r() * 300, y = EY - 260 + r() * 60; g.strokeStyle = ['#f2c27a', '#e0a55a', '#ffe0a8'][Math.floor(r() * 3)]; g.lineWidth = 2 + r() * 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 20 - r() * 15, y - 10 - r() * 18); g.stroke(); } g.restore();
  // nose edge
  g.fillStyle = '#120a0a'; g.beginPath(); g.ellipse(1745, 650, 70, 95, 0.2, 0, 7); g.fill(); glow(g, 1720, 600, 40, 'rgba(255,255,255,0.7)', 0.8);
  // whisker dots
  g.fillStyle = 'rgba(120,90,70,0.6)'; for (const [x, y] of [[1450, 720], [1490, 760], [1430, 790], [1520, 700], [1480, 820]]) { g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill(); }
  g.restore();
  // rain drops on fur + streaks
  for (let k = 0; k < 160; k++) { const x = r() * 1700, y = r() * 1100; if (!g.isPointInPath(head, x * 0.9 + 40, y * 0.9 + 190)) continue; const s = 3 + r() * 6;
    g.fillStyle = 'rgba(20,10,8,0.35)'; g.beginPath(); g.arc(x + 1, y + 2, s, 0, 7); g.fill(); g.fillStyle = 'rgba(230,240,255,0.65)'; g.beginPath(); g.arc(x, y, s, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(x - s * 0.3, y - s * 0.3, s * 0.35, 0, 7); g.fill(); }
  g.restore();
  rain(g, rng(8), { n: 260, len: [40, 90], a: [0.1, 0.35], w: [1, 2.5] });
  bloom(g, 0.45, 26); grade(g, { vig: 0.5, seed: 9 });
}

// ---------------- SHOT 6: silhouette leap against headlights, comic freeze ----------------
function shot6(g, t) {
  const r = rng(66); const GY = 900;
  const sk = g.createLinearGradient(0, 0, 0, GY); sk.addColorStop(0, '#0a0620'); sk.addColorStop(0.6, '#2a1250'); sk.addColorStop(1, '#6a2a70'); g.fillStyle = sk; g.fillRect(0, 0, W, GY);
  { const [c2, g2] = off(); g2.filter = 'blur(18px)'; for (let k = 0; k < 50; k++) { g2.globalAlpha = 0.25 + r() * 0.4; g2.fillStyle = ['#ff3cac', '#3cf2ff', '#ffd23c', '#5dff7a', '#ffb070', '#b06bff'][Math.floor(r() * 6)]; g2.beginPath(); g2.arc(r() * W, 150 + r() * 600, 15 + r() * 55, 0, 7); g2.fill(); } g.drawImage(c2, 0, 0); }
  // distant buildings silhouettes
  for (let x = -20; x < W;) { const w = 80 + r() * 160, h = 200 + r() * 380; g.fillStyle = '#120a26'; g.fillRect(x, GY - h, w, h); for (let k = 0; k < 14; k++) if (r() > 0.4) { g.fillStyle = ['#ffc46a', '#ff8ad0', '#7af0ff'][Math.floor(r() * 3)]; g.globalAlpha = 0.6; g.fillRect(x + 10 + r() * (w - 30), GY - h + 20 + r() * (h - 60), 10, 14); g.globalAlpha = 1; } x += w + 10; }
  // ground
  const gr = g.createLinearGradient(0, GY, 0, H); gr.addColorStop(0, '#2a1440'); gr.addColorStop(1, '#07040e'); g.fillStyle = gr; g.fillRect(0, GY, W, H - GY);
  // car front (dark) + headlights
  const car = new Path2D(); car.moveTo(1240, GY + 20); car.lineTo(1250, 690); car.quadraticCurveTo(1270, 600, 1400, 590); car.lineTo(1960, 560); car.lineTo(1960, GY + 30); car.closePath();
  g.fillStyle = '#0a0612'; g.fill(car);
  const HL = [[1330, 700], [1560, 690]];
  // beams
  g.save(); g.globalCompositeOperation = 'lighter';
  for (const [hx, hy] of HL) { const bm = g.createLinearGradient(hx, hy, 0, hy); bm.addColorStop(0, 'rgba(255,245,210,0.55)'); bm.addColorStop(1, 'rgba(255,245,210,0)'); g.fillStyle = bm; g.beginPath(); g.moveTo(hx, hy - 10); g.lineTo(-100, hy - 420); g.lineTo(-100, hy + 380); g.closePath(); g.fill(); }
  g.restore();
  rain(g, rng(4), { n: 700, len: [30, 60], a: [0.1, 0.25], w: [1, 1.6] });
  rain(g, rng(14), { n: 1200, len: [40, 80], a: [0.35, 0.8], w: [1.2, 2.4], col: '255,245,225', clip: (gg) => { gg.beginPath(); for (const [hx, hy] of HL) { gg.moveTo(hx, hy); gg.lineTo(-100, hy - 420); gg.lineTo(-100, hy + 380); gg.closePath(); } gg.clip(); } });
  // wet reflections of headlights
  for (const [hx, hy] of HL) for (let y = GY; y < H; y += 3) { const u = (y - GY) / (H - GY); g.globalAlpha = (1 - u) * 0.6; g.fillStyle = '#fff3c8'; g.fillRect(hx - 30 + (r() - 0.5) * 50, y, 60 * (0.6 + r() * 0.6), 3); } g.globalAlpha = 1;
  for (const [hx, hy] of HL) { glow(g, hx, hy, 520, 'rgba(255,240,200,0.9)', 0.9); glow(g, hx, hy, 140, 'rgba(255,255,255,1)', 1); g.fillStyle = '#fff'; g.beginPath(); g.arc(hx, hy, 46, 0, 7); g.fill(); }
  g.save(); g.globalCompositeOperation = 'lighter'; const an = g.createLinearGradient(0, 0, W, 0); an.addColorStop(0, 'rgba(90,150,255,0)'); an.addColorStop(0.65, 'rgba(140,190,255,0.7)'); an.addColorStop(1, 'rgba(90,150,255,0)'); g.fillStyle = an; g.fillRect(0, 690, W, 10); g.restore();
  for (const [k, c] of [[0.55, '#ff6ad0'], [0.35, '#6ad8ff'], [0.2, '#ffd26a']]) { const x = 1440 - (1440 - 960) * k * 2.2, y = 695 + (540 - 695) * k * 2.2; g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.35; g.strokeStyle = c; g.lineWidth = 3; g.beginPath(); g.arc(x, y, 30 + k * 60, 0, 7); g.stroke(); g.restore(); }
  // silhouettes (Otávio + Caramelo), rim lit from the right
  const man = new Path2D();
  man.moveTo(640, 905); man.lineTo(652, 770); man.lineTo(600, 778); man.bezierCurveTo(612, 700, 620, 600, 640, 520); // pulled coat hem back
  man.lineTo(615, 515); man.bezierCurveTo(600, 470, 620, 455, 650, 462); // backpack
  man.bezierCurveTo(665, 446, 700, 440, 720, 450); man.lineTo(722, 432); // neck
  man.bezierCurveTo(690, 430, 680, 380, 705, 362); man.bezierCurveTo(735, 345, 770, 370, 760, 405); man.lineTo(772, 420); man.lineTo(758, 428); man.lineTo(750, 448); // head bowed
  man.bezierCurveTo(780, 460, 790, 480, 790, 500); man.lineTo(800, 540); man.lineTo(790, 548); // arm to phone
  man.bezierCurveTo(780, 600, 790, 700, 800, 770); man.lineTo(745, 775); man.lineTo(752, 905); man.lineTo(728, 905); man.lineTo(705, 790); man.lineTo(670, 905); man.closePath();
  const dog = new Path2D();
  dog.moveTo(602, 770); dog.bezierCurveTo(590, 745, 575, 735, 555, 730); // mouth on hem
  dog.lineTo(548, 708); dog.lineTo(560, 690); dog.lineTo(540, 700); dog.lineTo(525, 676); dog.lineTo(522, 702); // ears
  dog.bezierCurveTo(480, 690, 430, 668, 390, 660); // back
  dog.bezierCurveTo(360, 640, 340, 600, 345, 575); dog.bezierCurveTo(352, 600, 360, 630, 380, 646); // tail
  dog.lineTo(330, 690); dog.lineTo(300, 700); dog.lineTo(304, 708); dog.lineTo(345, 702); // hind legs back
  dog.bezierCurveTo(400, 720, 450, 740, 500, 752); dog.lineTo(548, 800); dog.lineTo(560, 796); dog.lineTo(538, 760); dog.lineTo(575, 772); dog.lineTo(590, 772); dog.closePath();
  rimSil(g, (mg) => { mg.fill(man);
    // Caramelo mid-leap, biting the coat hem
    mg.save(); mg.translate(470, 705); mg.rotate(-0.18); mg.beginPath(); mg.ellipse(0, 0, 100, 44, 0, 0, 7); mg.fill(); mg.beginPath(); mg.ellipse(-60, 6, 46, 40, 0, 0, 7); mg.fill(); mg.restore();
    mg.beginPath(); mg.ellipse(565, 705, 44, 40, 0, 0, 7); mg.fill();
    mg.save(); mg.translate(603, 728); mg.rotate(0.4); mg.beginPath(); mg.ellipse(0, 0, 40, 21, 0, 0, 7); mg.fill(); mg.restore();
    mg.beginPath(); mg.moveTo(540, 678); mg.lineTo(548, 618); mg.lineTo(580, 672); mg.closePath(); mg.fill();
    mg.beginPath(); mg.moveTo(527, 690); mg.quadraticCurveTo(505, 700, 512, 735); mg.lineTo(540, 712); mg.closePath(); mg.fill();
    thick(mg, 24, [[530, 728], [575, 770], [592, 805]]); thick(mg, 22, [[505, 735], [545, 780], [555, 818]]);
    thick(mg, 26, [[405, 712], [350, 720], [300, 712]]); thick(mg, 24, [[400, 730], [345, 748], [305, 752]]);
    thick(mg, 26, [[385, 690], [345, 650], [352, 600], [378, 590]]);
    for (let k = 0; k < 40; k++) { const a = rng(k + 3)() * 6.28; mg.beginPath(); mg.arc(470 + Math.cos(a) * 100, 705 + Math.sin(a) * 40, 7, 0, 7); mg.fill(); }
    // coat hem pulled into the mouth
    mg.beginPath(); mg.moveTo(640, 770); mg.quadraticCurveTo(625, 760, 612, 740); mg.lineTo(630, 730); mg.lineTo(660, 760); mg.closePath(); mg.fill();
  });
  // phone glow
  glow(g, 798, 540, 40, 'rgba(140,230,255,0.9)', 0.9);
  // water spray from paws/feet
  for (let k = 0; k < 140; k++) { const x = 520 + r() * 350, y = 820 + r() * 90; g.fillStyle = `rgba(240,245,255,${0.3 + r() * 0.5})`; g.beginPath(); g.arc(x, y, 1 + r() * 3, 0, 7); g.fill(); }
  rain(g, rng(23), { n: 70, len: [120, 200], a: [0.12, 0.3], w: [2, 4] });
  bloom(g, 0.5, 28); grade(g, { vig: 0.55, seed: 6 });
  // comic freeze: subtle duotone + frame + single SFX
  g.save(); g.globalCompositeOperation = 'color'; g.fillStyle = 'rgba(120,60,160,0.25)'; g.fillRect(0, 0, W, H); g.restore();
  g.fillStyle = '#fff'; g.fillRect(0, 0, W, 34); g.fillRect(0, H - 34, W, 34); g.fillRect(0, 0, 34, H); g.fillRect(W - 34, 0, 34, H);
  g.lineWidth = 10; g.strokeStyle = '#111'; g.strokeRect(34, 34, W - 68, H - 68);
  g.save(); g.translate(430, 560); g.rotate(-0.1); g.font = '170px Bangers'; g.textAlign = 'center'; g.lineJoin = 'round';
  g.lineWidth = 26; g.strokeStyle = '#111'; g.strokeText('NHAC!', 8, 8); g.strokeText('NHAC!', 0, 0);
  const tg = g.createLinearGradient(0, -80, 0, 60); tg.addColorStop(0, '#fff36a'); tg.addColorStop(1, '#ff8a1e'); g.fillStyle = tg; g.fillText('NHAC!', 0, 0); g.restore();
}

// ---------------- SHOT 8: dawn, Caramelo asleep on cardboard ----------------
function shot8(g, t) {
  const r = rng(88);
  const sk = g.createLinearGradient(0, 0, 0, H); sk.addColorStop(0, '#6f8fd8'); sk.addColorStop(0.45, '#f6b78a'); sk.addColorStop(0.7, '#ffd9a0'); sk.addColorStop(1, '#f0a070'); g.fillStyle = sk; g.fillRect(0, 0, W, H);
  glow(g, 260, 520, 900, 'rgba(255,230,170,0.9)', 0.9); glow(g, 260, 520, 180, 'rgba(255,255,240,1)', 1);
  // wall of the bakery (right) with shutter
  const wall = g.createLinearGradient(700, 0, W, 0); wall.addColorStop(0, '#d88a5a'); wall.addColorStop(1, '#8a4a3a'); g.fillStyle = wall; g.fillRect(760, 0, W - 760, 860);
  g.fillStyle = '#b8b2a8'; g.fillRect(1000, 300, 760, 560); for (let y = 300; y < 860; y += 14) { g.fillStyle = '#9a948c'; g.fillRect(1000, y, 760, 3); }
  g.fillStyle = '#f4ead6'; g.fillRect(980, 220, 800, 70); g.font = '58px Bangers'; g.fillStyle = '#c0392b'; g.textAlign = 'center'; g.fillText('PADARIA', 1380, 275);
  // god rays
  g.save(); g.globalCompositeOperation = 'lighter'; for (let k = 0; k < 7; k++) { const a = -0.25 + k * 0.09; g.fillStyle = `rgba(255,230,170,${0.05 + r() * 0.06})`; g.beginPath(); g.moveTo(260, 520); g.lineTo(260 + Math.cos(a) * 2200, 520 + Math.sin(a) * 2200); g.lineTo(260 + Math.cos(a + 0.035) * 2200, 520 + Math.sin(a + 0.035) * 2200); g.closePath(); g.fill(); } g.restore();
  // sidewalk + puddle reflecting sky
  const sw = g.createLinearGradient(0, 860, 0, H); sw.addColorStop(0, '#c99a7a'); sw.addColorStop(1, '#7a5040'); g.fillStyle = sw; g.fillRect(0, 860, W, H - 860);
  g.fillStyle = 'rgba(190,210,255,0.55)'; g.beginPath(); g.ellipse(520, 990, 300, 40, 0, 0, 7); g.fill(); glow(g, 300, 985, 160, 'rgba(255,240,200,0.8)', 0.7);
  // cardboard
  g.fillStyle = '#a8784a'; g.beginPath(); g.moveTo(780, 900); g.lineTo(1500, 880); g.lineTo(1560, 960); g.lineTo(740, 985); g.closePath(); g.fill();
  g.fillStyle = '#c99a64'; g.beginPath(); g.moveTo(780, 900); g.lineTo(1500, 880); g.lineTo(1505, 892); g.lineTo(785, 912); g.closePath(); g.fill();
  // sleeping dog (curled), built from shapes, fur-textured, sun rim from the left
  const D = new Path2D();
  D.ellipse(1165, 860, 235, 88, 0, 0, 7); D.ellipse(1330, 855, 90, 80, 0, 0, 7); D.ellipse(935, 868, 88, 64, -0.1, 0, 7);
  const dgr = g.createLinearGradient(850, 760, 1400, 950); dgr.addColorStop(0, '#f6c07a'); dgr.addColorStop(0.5, '#d68a3a'); dgr.addColorStop(1, '#8f4f1a');
  g.fillStyle = dgr; g.fill(D, 'nonzero');
  g.save(); g.clip(D); g.lineCap = 'round';
  for (let k = 0; k < 5000; k++) { const x = 840 + r() * 600, y = 770 + r() * 190; const lit = (1 - (x - 840) / 600) * 0.55 + (1 - (y - 770) / 190) * 0.45 + (r() - 0.5) * 0.3; const pal = ['#7a400f', '#a8601f', '#cf8436', '#eaa555', '#ffd08a'];
    g.strokeStyle = pal[Math.max(0, Math.min(4, Math.floor(lit * 5)))]; g.lineWidth = 1.5 + r() * 2.2; g.globalAlpha = 0.7; const a = Math.atan2(0.25, 1) + (r() - 0.5) * 0.6, L = 10 + r() * 16; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke(); }
  g.globalAlpha = 1;
  const sh = g.createLinearGradient(0, 800, 0, 950); sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(90,40,20,0.45)'); g.fillStyle = sh; g.fillRect(800, 760, 700, 200);
  g.restore();
  // up ear + folded ear
  g.fillStyle = '#d68a3a'; g.beginPath(); g.moveTo(912, 812); g.lineTo(934, 742); g.lineTo(968, 812); g.closePath(); g.fill(); g.fillStyle = '#f2a0a8'; g.beginPath(); g.moveTo(924, 806); g.lineTo(936, 762); g.lineTo(956, 806); g.closePath(); g.fill();
  g.fillStyle = '#a8601f'; g.beginPath(); g.moveTo(975, 820); g.quadraticCurveTo(1030, 815, 1022, 885); g.quadraticCurveTo(995, 860, 972, 850); g.closePath(); g.fill();
  // muzzle, nose, closed eye, blush
  g.fillStyle = '#f6ecdc'; g.beginPath(); g.ellipse(868, 888, 58, 32, -0.08, 0, 7); g.fill(); g.fillStyle = '#e8dccb'; g.beginPath(); g.ellipse(875, 904, 46, 14, 0, 0, 7); g.fill();
  g.fillStyle = '#1a0e0a'; g.beginPath(); g.ellipse(816, 878, 15, 12, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,0.7)'; g.beginPath(); g.arc(811, 873, 4, 0, 7); g.fill();
  g.strokeStyle = '#3a1c0c'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.arc(912, 852, 16, 0.2, Math.PI - 0.2); g.stroke();
  g.fillStyle = 'rgba(255,120,140,0.38)'; g.beginPath(); g.ellipse(918, 884, 20, 8, 0, 0, 7); g.fill();
  // front paws + wrapped tail
  g.fillStyle = '#f6ecdc'; g.beginPath(); g.ellipse(880, 930, 52, 17, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(965, 936, 46, 15, 0, 0, 7); g.fill();
  g.strokeStyle = 'rgba(120,90,70,0.5)'; g.lineWidth = 2; for (const x of [858, 872, 948, 962]) { g.beginPath(); g.moveTo(x, 925); g.lineTo(x - 4, 942); g.stroke(); }
  g.lineCap = 'round'; g.strokeStyle = '#c47a30'; g.lineWidth = 50; g.beginPath(); g.moveTo(1400, 895); g.quadraticCurveTo(1300, 965, 1050, 945); g.stroke();
  g.strokeStyle = '#eaa555'; g.lineWidth = 16; g.beginPath(); g.moveTo(1380, 885); g.quadraticCurveTo(1290, 945, 1060, 932); g.stroke();
  g.strokeStyle = '#f6ecdc'; g.lineWidth = 44; g.beginPath(); g.moveTo(1075, 946); g.lineTo(1030, 942); g.stroke();
  // zzz + mist + steam
  g.font = '44px Bangers'; g.fillStyle = 'rgba(255,255,255,0.85)'; g.fillText('z', 990, 720); g.font = '34px Bangers'; g.fillText('z', 1025, 685);
  { const [c2, g2] = off(); g2.filter = 'blur(30px)'; for (let k = 0; k < 10; k++) { g2.fillStyle = 'rgba(255,240,225,0.2)'; g2.beginPath(); g2.ellipse(r() * W, 760 + r() * 200, 200 + r() * 200, 40, 0, 0, 7); g2.fill(); } g.drawImage(c2, 0, 0); }
  for (let k = 0; k < 6; k++) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = 'rgba(255,250,240,0.04)'; g.filter = 'blur(10px)'; g.beginPath(); g.ellipse(1700 + Math.sin(k) * 30, 200 - k * 40, 40 + k * 8, 60, 0, 0, 7); g.fill(); g.restore(); }
  for (const [x, y] of [[420, 260], [470, 230], [520, 280]]) { g.strokeStyle = '#3a2a40'; g.lineWidth = 4; g.beginPath(); g.moveTo(x - 16, y); g.quadraticCurveTo(x - 8, y - 10, x, y); g.quadraticCurveTo(x + 8, y - 10, x + 16, y); g.stroke(); }
  bloom(g, 0.25, 30); g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(255,140,60,0.35)'; g.fillRect(0, 0, W, H); g.restore(); grade(g, { vig: 0.5, seed: 12 });
  caption(g, 70, 70, 'TRÊS SEMANAS ANTES...');
}

const shots = { 1: shot1, 4: shot4, 6: shot6, 8: shot8 };
shots[SHOT](ctx, T);
window.__done = true;
