// Channel identity (avatar 800x800, banner 2560x1440) in the series style: anime light + pixelate() + crisp HQ layer.
// Not tied to one story: each banner panel is a different world.
window.ANIM = true; window.NO_CAP = true;
await import('./shots.js');
const { W, H, off, rng, glow, grade, bloom, pixelate, rain } = window.SH;
const Q = new URLSearchParams(location.search), MODE = Q.get('m') || 'banner';
const NAME = (Q.get('name') || 'HISTÓRIAS QUE|AQUECEM').split('|'), TAG = Q.get('tag') || 'HISTÓRIAS SEM PALAVRAS';
const INK = '#111018';
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const out = document.getElementById('out'), o = out.getContext('2d');
await document.fonts.load('100px Bangers'); await document.fonts.load('20px PS2P');
const lin = (g, y0, y1, stops) => { const gr = g.createLinearGradient(0, y0, 0, y1); stops.forEach(([k, c]) => gr.addColorStop(k, c)); return gr; };
const E = (g, x, y, rx, ry, col) => { g.fillStyle = col; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7); g.fill(); };

// ---------------- worlds (each 1920x1080, pure) ----------------
const worlds = {
  street(g) { // golden-hour Brazilian street: sobrados, fiação, sun
    const r = rng(11);
    g.fillStyle = lin(g, 0, 820, [[0, '#4b5fa8'], [0.45, '#f08a6a'], [0.8, '#ffc07a'], [1, '#ffe2a6']]); g.fillRect(0, 0, W, H);
    glow(g, 1380, 600, 520, 'rgba(255,214,140,0.9)'); E(g, 1380, 600, 110, 110, '#fff3c8');
    for (let k = 0; k < 12; k++) { g.fillStyle = 'rgba(255,236,210,0.35)'; g.beginPath(); g.ellipse(r() * W, 120 + r() * 260, 160 + r() * 200, 22 + r() * 18, 0, 0, 7); g.fill(); }
    for (let x = 0; x < W;) { const w = 70 + r() * 120, h = 140 + r() * 260; g.fillStyle = '#7c6a9a'; g.fillRect(x, 760 - h, w, h + 40); x += w + 6; }
    const cols = ['#f28c9a', '#f5cf5b', '#5fc4b8', '#b79ce0', '#f3a65a', '#86c97e'];
    for (let x = -30, i = 0; x < W; i++) {
      const w = 240 + r() * 120, h = 260 + Math.floor(r() * 2) * 120, top = 860 - h, col = cols[(i * 5) % cols.length];
      g.fillStyle = col; g.fillRect(x, top, w, h); g.fillStyle = 'rgba(40,20,60,0.28)'; g.fillRect(x + w * 0.72, top, w * 0.28, h);
      g.fillStyle = '#f4ead6'; g.fillRect(x - 6, top - 12, w + 12, 16);
      for (let fy = top + 30; fy < 760; fy += 120) for (let k = 0; k < Math.floor(w / 90); k++) { const wx = x + 24 + k * 90; g.fillStyle = '#f4ead6'; g.fillRect(wx - 6, fy - 6, 56, 78); g.fillStyle = r() < 0.4 ? '#ffd27a' : '#3d6fa8'; g.fillRect(wx, fy, 44, 66); }
      x += w;
    }
    g.strokeStyle = 'rgba(30,20,40,0.85)'; g.lineWidth = 3;
    for (const p of [260, 1100, 1800]) { g.fillStyle = '#4a3a48'; g.fillRect(p, 300, 14, 600); }
    for (const dy of [0, 18, 36]) { g.beginPath(); for (let x = 0; x <= W; x += 20) { const y = 320 + dy + Math.sin(((x % 840) / 840) * Math.PI) * 50; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
    g.fillStyle = '#efe4cc'; g.fillRect(0, 860, W, 90);
    g.strokeStyle = '#2a2630'; g.lineWidth = 8; g.beginPath(); for (let x = 0; x <= W; x += 6) { const y = 900 + Math.sin(x / 60) * 14; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
    g.fillStyle = '#4a4c57'; g.fillRect(0, 950, W, 130);
    g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(255,170,90,0.7)'; g.fillRect(0, 0, W, H); g.restore();
    bloom(g, 0.4); grade(g, { vig: 0.35 });
  },
  sea(g) { // underwater, light rays, bubbles, fish school
    const r = rng(5);
    g.fillStyle = lin(g, 0, H, [[0, '#7fe0f0'], [0.35, '#1f8fc0'], [1, '#062a52']]); g.fillRect(0, 0, W, H);
    g.save(); g.globalCompositeOperation = 'lighter';
    for (let k = 0; k < 9; k++) { const x = 200 + k * 200 + r() * 80; g.fillStyle = 'rgba(200,250,255,0.08)'; g.beginPath(); g.moveTo(x - 40, 0); g.lineTo(x + 40, 0); g.lineTo(x + 260, H); g.lineTo(x + 60, H); g.closePath(); g.fill(); }
    g.restore();
    for (let k = 0; k < 40; k++) { const x = r() * W, y = 500 + r() * 400, s = 14 + r() * 10, a = r() * 0.4; g.fillStyle = '#0d3a66'; g.beginPath(); g.ellipse(x, y, s, s * 0.45, a - 0.2, 0, 7); g.fill(); g.beginPath(); g.moveTo(x - s * 0.8, y); g.lineTo(x - s * 1.5, y - s * 0.5); g.lineTo(x - s * 1.5, y + s * 0.5); g.fill(); }
    E(g, 980, 520, 46, 24, '#ffb43c'); g.fillStyle = '#ffb43c'; g.beginPath(); g.moveTo(940, 520); g.lineTo(890, 490); g.lineTo(890, 550); g.fill(); E(g, 1000, 514, 8, 8, '#fff'); E(g, 1002, 514, 4, 4, '#111'); g.fillStyle = '#fff'; g.fillRect(968, 498, 8, 44);
    glow(g, 980, 520, 160, 'rgba(255,190,90,0.5)');
    for (let x = 0; x < W; x += 60) { const h = 80 + r() * 200; g.fillStyle = ['#ff6f91', '#c45ab3', '#2a9d8f', '#f4a261'][Math.floor(r() * 4)]; g.beginPath(); g.ellipse(x, H, 40 + r() * 30, h, 0, Math.PI, 0); g.fill(); }
    for (let k = 0; k < 60; k++) { const x = r() * W, y = r() * H, s = 3 + r() * 10; g.strokeStyle = 'rgba(230,255,255,0.7)'; g.lineWidth = 2; g.beginPath(); g.arc(x, y, s, 0, 7); g.stroke(); }
    bloom(g, 0.35); grade(g, { vig: 0.5 });
  },
  lighthouse(g) { // night, lighthouse beam over the sea
    const r = rng(8);
    g.fillStyle = lin(g, 0, 700, [[0, '#070a24'], [0.7, '#1c2a64'], [1, '#3a3f86']]); g.fillRect(0, 0, W, H);
    for (let k = 0; k < 260; k++) { g.fillStyle = `rgba(255,255,255,${0.3 + r() * 0.7})`; g.fillRect(r() * W, r() * 640, 2 + (r() < 0.1 ? 2 : 0), 2); }
    E(g, 1560, 200, 60, 60, '#fff6dc'); glow(g, 1560, 200, 260, 'rgba(200,210,255,0.35)');
    g.fillStyle = lin(g, 700, H, [[0, '#1b2a5a'], [1, '#050a1c']]); g.fillRect(0, 700, W, 380);
    for (let k = 0; k < 120; k++) { g.fillStyle = 'rgba(160,190,255,0.35)'; g.fillRect(r() * W, 710 + r() * 360, 20 + r() * 60, 3); }
    g.fillStyle = '#0a0d1c'; g.beginPath(); g.moveTo(300, 760); g.lineTo(980, 760); g.lineTo(1080, 820); g.lineTo(200, 820); g.fill();
    g.fillStyle = '#e9e2d6'; g.beginPath(); g.moveTo(540, 760); g.lineTo(700, 760); g.lineTo(675, 380); g.lineTo(565, 380); g.fill();
    g.fillStyle = '#c83a3a'; for (const y of [470, 600]) { g.beginPath(); g.moveTo(560 - (y - 380) * 0.04, y); g.lineTo(680 + (y - 380) * 0.04, y); g.lineTo(683 + (y - 340) * 0.04, y + 50); g.lineTo(557 - (y - 340) * 0.04, y + 50); g.fill(); }
    g.fillStyle = '#20243a'; g.fillRect(550, 360, 140, 22); g.fillStyle = '#ffe7a0'; g.fillRect(575, 300, 90, 60); g.fillStyle = '#20243a'; g.beginPath(); g.moveTo(560, 300); g.lineTo(680, 300); g.lineTo(620, 250); g.fill();
    g.save(); g.globalCompositeOperation = 'lighter'; const bm = g.createLinearGradient(620, 0, 1920, 0); bm.addColorStop(0, 'rgba(255,236,170,0.75)'); bm.addColorStop(1, 'rgba(255,236,170,0)');
    g.fillStyle = bm; g.beginPath(); g.moveTo(620, 330); g.lineTo(1920, 150); g.lineTo(1920, 560); g.closePath(); g.fill(); g.restore();
    glow(g, 620, 330, 200, 'rgba(255,230,160,0.9)');
    bloom(g, 0.5); grade(g, { vig: 0.6 });
  },
  neon(g) { // rainy city night, neon bokeh, puddle reflections
    const r = rng(21);
    g.fillStyle = lin(g, 0, H, [[0, '#120a2a'], [0.6, '#2a1248'], [1, '#0a0614']]); g.fillRect(0, 0, W, H);
    for (let x = 0; x < W;) { const w = 120 + r() * 200, h = 300 + r() * 500; g.fillStyle = '#1a1030'; g.fillRect(x, 760 - h, w, h + 300); for (let k = 0; k < 30; k++) { g.fillStyle = r() < 0.5 ? 'rgba(255,214,120,0.8)' : 'rgba(120,220,255,0.6)'; g.fillRect(x + 10 + r() * (w - 30), 780 - h + r() * h, 10, 14); } x += w + 10; }
    for (let k = 0; k < 40; k++) glow(g, r() * W, 200 + r() * 600, 40 + r() * 90, ['rgba(255,60,172,0.7)', 'rgba(60,242,255,0.6)', 'rgba(255,200,80,0.6)'][k % 3], 0.8);
    g.fillStyle = '#0c0818'; g.fillRect(0, 780, W, 300);
    g.save(); g.translate(0, 1560); g.scale(1, -1); g.globalAlpha = 0.35; g.drawImage(g.canvas, 0, 0, W, 780, 0, 0, W, 780); g.restore();
    rain(g, rng(4), { n: 900 });
    bloom(g, 0.55); grade(g, { vig: 0.5 });
  },
  sunflowers(g) { // field at sunset
    const r = rng(14);
    g.fillStyle = lin(g, 0, 640, [[0, '#6a5bb0'], [0.5, '#ff8a6a'], [1, '#ffd07a']]); g.fillRect(0, 0, W, H);
    glow(g, 600, 620, 500, 'rgba(255,220,150,0.9)'); E(g, 600, 620, 90, 90, '#fff2c0');
    g.fillStyle = '#5a6f3a'; g.beginPath(); g.moveTo(0, 640); for (let x = 0; x <= W; x += 40) g.lineTo(x, 620 + Math.sin(x / 260) * 30); g.lineTo(W, H); g.lineTo(0, H); g.fill();
    for (let k = 0; k < 160; k++) { const d = r(), x = r() * W, y = 640 + d * 460, s = 10 + d * 60; g.strokeStyle = '#3f6a2a'; g.lineWidth = 2 + d * 6; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 4, y + s * 3); g.stroke();
      for (let p = 0; p < 12; p++) { const a = p / 12 * Math.PI * 2; E(g, x + Math.cos(a) * s * 0.75, y + Math.sin(a) * s * 0.75, s * 0.42, s * 0.42, p % 2 ? '#ffc52e' : '#ffb000'); } E(g, x, y, s * 0.55, s * 0.55, '#6a3a12'); }
    g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(255,150,80,0.6)'; g.fillRect(0, 0, W, H); g.restore();
    bloom(g, 0.45); grade(g, { vig: 0.4 });
  },
  forest(g) { // dusk forest with fireflies
    const r = rng(33);
    g.fillStyle = lin(g, 0, H, [[0, '#2a3a6a'], [0.5, '#3a5a5a'], [1, '#0c1a14']]); g.fillRect(0, 0, W, H);
    glow(g, 960, 400, 600, 'rgba(255,200,140,0.4)');
    for (const [n, col, sc] of [[14, '#2c4a4a', 0.6], [12, '#1a332e', 0.85], [9, '#0c1c18', 1.2]]) for (let k = 0; k < n; k++) { const x = r() * W, h = 500 * sc + r() * 200; g.fillStyle = col; g.beginPath(); g.moveTo(x, 1000 - h); g.lineTo(x + 110 * sc, 1000); g.lineTo(x - 110 * sc, 1000); g.fill(); g.fillRect(x - 10 * sc, 990, 20 * sc, 90); }
    g.fillStyle = '#0a1410'; g.fillRect(0, 990, W, 90);
    for (let k = 0; k < 70; k++) { const x = r() * W, y = 300 + r() * 700; glow(g, x, y, 22, 'rgba(220,255,120,0.9)'); g.fillStyle = '#f4ffb0'; g.fillRect(x - 2, y - 2, 4, 4); }
    bloom(g, 0.5); grade(g, { vig: 0.55 });
  },
  avatarBg(g) { // pure style: warm sun, bokeh, rays
    const r = rng(2);
    g.fillStyle = lin(g, 0, H, [[0, '#ff6b5a'], [0.5, '#ffa24a'], [1, '#ffd27a']]); g.fillRect(0, 0, W, H);
    g.save(); g.globalCompositeOperation = 'lighter'; g.translate(960, 600);
    for (let k = 0; k < 16; k++) { g.rotate(Math.PI / 8); g.fillStyle = 'rgba(255,240,200,0.16)'; g.beginPath(); g.moveTo(0, 0); g.lineTo(-60, -1400); g.lineTo(60, -1400); g.fill(); }
    g.restore();
    for (let k = 0; k < 30; k++) glow(g, r() * W, r() * H, 30 + r() * 80, 'rgba(255,250,220,0.6)', 0.7);
    glow(g, 960, 600, 420, 'rgba(255,250,220,0.95)');
    bloom(g, 0.4); grade(g, { vig: 0.45, grain: 0.05 });
  },
};
function renderWorld(name) { ctx.save(); ctx.clearRect(0, 0, W, H); worlds[name](ctx); ctx.restore(); pixelate(ctx, 4, 12); const [c, g] = off(); g.drawImage(cv, 0, 0); return c; }

// ---------------- HQ layer (crisp, never pixelated) ----------------
function lettering(g, text, x, y, size, rot = -0.03) {
  g.save(); g.translate(x, y); g.rotate(rot); g.font = `${size}px Bangers`; g.lineJoin = 'round';
  g.fillStyle = '#d8343c'; g.fillText(text, size * 0.05, size * 0.06);
  g.lineWidth = size * 0.16; g.strokeStyle = INK; g.strokeText(text, 0, 0);
  const gr = g.createLinearGradient(0, -size * 0.75, 0, 0); gr.addColorStop(0, '#fff35a'); gr.addColorStop(1, '#ff8a1e'); g.fillStyle = gr; g.fillText(text, 0, 0); g.restore();
}
function capBox(g, text, x, y, size) { // yellow recordatório
  g.font = `${size}px Bangers`; const w = g.measureText(text).width, p = size * 0.32;
  g.fillStyle = INK; g.fillRect(x - 6, y - 6, w + p * 2 + 12, size * 1.25 + 12); g.fillStyle = '#ffd93b'; g.fillRect(x, y, w + p * 2, size * 1.25); g.fillStyle = INK; g.fillText(text, x + p, y + size * 1.02);
}
function heartBalloon(g, cx, cy, r, ink = 8) { // one path (ellipse + tail) so the outline is continuous
  const p = new Path2D(); p.ellipse(cx, cy, r * 1.25, r, 0, 0, Math.PI * 2);
  const t = new Path2D(); t.moveTo(cx - r * 0.55, cy + r * 0.72); t.lineTo(cx - r * 1.1, cy + r * 1.55); t.lineTo(cx - r * 0.05, cy + r * 0.95); t.closePath();
  g.lineJoin = 'round'; g.lineWidth = ink * 2; g.strokeStyle = INK; g.stroke(p); g.stroke(t);
  g.fillStyle = '#fff'; g.fill(p); g.fill(t);
  const HT = ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...'], s = Math.round(r / 4.4);
  HT.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === 'X') { g.fillStyle = (i === 1 && j === 1) ? '#ff9aa0' : '#e8434f'; g.fillRect(Math.round(cx - 3.5 * s) + i * s, Math.round(cy - 3.3 * s) + j * s, s, s); } }));
}
function panel(img, x, y, w, h, fx, fy, z = 4 / 3) { // crop world at (fx,fy) focus, keep the 4px pixel grid scaled by z
  o.save(); o.beginPath(); o.rect(x, y, w, h); o.clip(); o.imageSmoothingEnabled = false;
  const sw = w / z, sh = h / z, sx = Math.max(0, Math.min(W - sw, fx - sw / 2)), sy = Math.max(0, Math.min(H - sh, fy - sh / 2));
  o.drawImage(img, sx, sy, sw, sh, x, y, w, h); o.restore();
  o.lineWidth = 10; o.strokeStyle = INK; o.strokeRect(x + 5, y + 5, w - 10, h - 10);
}

if (MODE === 'avatar') {
  out.width = out.height = 800; const bg = renderWorld('avatarBg');
  o.imageSmoothingEnabled = false; o.drawImage(bg, 420, 0, 1080, 1080, 0, 0, 800, 800);
  heartBalloon(o, 430, 360, 210, 12);
} else {
  out.width = 2560; out.height = 1440; o.fillStyle = '#fbf7ee'; o.fillRect(0, 0, 2560, 1440);
  const Wd = Object.fromEntries(['street', 'sea', 'lighthouse', 'neon', 'sunflowers', 'forest'].map((n) => [n, renderWorld(n)]));
  const G = 22; // gutter
  // top row
  panel(Wd.sea, G, G, 860, 470, 980, 690, 1); panel(Wd.lighthouse, 860 + G * 2, G, 820, 470, 780, 500, 1); panel(Wd.neon, 1680 + G * 3, G, 2560 - 1680 - G * 4, 470, 960, 620, 1);
  // middle band = mobile safe area (507..2053 x 508..931)
  panel(Wd.street, G, 470 + G * 2, 2560 - G * 2, 470, 1100, 560);
  // bottom row
  panel(Wd.sunflowers, G, 940 + G * 3, 1260, 1440 - 940 - G * 4, 700, 680); panel(Wd.forest, 1260 + G * 2, 940 + G * 3, 2560 - 1260 - G * 3, 1440 - 940 - G * 4, 960, 760, 1);
  capBox(o, TAG, 560, 530, 54);
  if (NAME.length > 1) { lettering(o, NAME[0], 560, 790, 140); lettering(o, NAME[1], 600, 915, 140); } else lettering(o, NAME[0], 560, 830, 200);
  heartBalloon(o, 1900, 650, 70);
}
window.__done = true;
