// Side-view pixel-art street (platformer style), drawn pixel by pixel.
const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const toHex = (r, g, b) => '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
export const mul = (h, k) => { const [r, g, b] = hex(h); return toHex(r * k[0], g * k[1], b * k[2]); };
const shade = (h, k) => mul(h, [k, k, k]);

export function pixelText(text, color, size = 8) {
  const c = document.createElement('canvas'); const g = c.getContext('2d');
  g.font = `${size}px PS2P`; c.width = Math.ceil(g.measureText(text).width) + 2; c.height = size + 2;
  g.font = `${size}px PS2P`; g.textBaseline = 'top'; g.fillStyle = color; g.fillText(text, 1, 1);
  const im = g.getImageData(0, 0, c.width, c.height), d = im.data, [r, gg, b] = hex(color);
  for (let i = 0; i < d.length; i += 4) { const on = d[i + 3] > 110; d[i] = r; d[i + 1] = gg; d[i + 2] = b; d[i + 3] = on ? 255 : 0; }
  g.putImageData(im, 0, 0); return c;
}

export function makeStreet({ night = false, W = 960, seed = 11, padIndex = 3, crosswalkX = 300 } = {}) {
  let s = seed; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const R = (a, b) => a + (b - a) * rnd(), RI = (a, b) => Math.floor(R(a, b + 1));
  const N = night ? [0.42, 0.44, 0.66] : [1, 1, 1];
  const nc = (h) => (night ? mul(h, N) : h);
  const c = document.createElement('canvas'); c.width = W; c.height = 270;
  const g = c.getContext('2d');
  const F = (col, x, y, w, h) => { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const circ = (cx, cy, r, col) => { for (let dy = -r; dy <= r; dy++) { const h = Math.floor(Math.sqrt(r * r - dy * dy)); F(col, cx - h, cy + dy, 2 * h + 1, 1); } };
  const GROUND = 206;
  const lights = [];

  // sky bands with dithered seams
  const bands = night ? ['#070a1c', '#0c1130', '#141a44', '#1f1d52', '#33245e'] : ['#4f9fe0', '#64afe9', '#80c3f1', '#a2d5f7', '#c8e9fb'];
  const bh = 34;
  bands.forEach((col, i) => F(col, 0, i * bh, W, i === bands.length - 1 ? 270 : bh));
  for (let i = 1; i < bands.length; i++) for (let y = i * bh - 3; y < i * bh; y++) for (let x = (y % 2); x < W; x += 2) F(bands[i], x, y, 1, 1);
  if (night) {
    for (let k = 0; k < 90; k++) F(rnd() > 0.8 ? '#ffe9b0' : '#cfd6ff', R(0, W), R(0, 110), 1, 1);
    circ(W * 0.72, 34, 11, '#fff2c4'); circ(W * 0.72 + 4, 31, 3, '#e8d79c'); circ(W * 0.72 - 4, 38, 2, '#e8d79c');
  } else {
    for (let k = 0; k < 9; k++) {
      const cx = R(0, W), cy = R(14, 70), n = RI(3, 5);
      for (let j = 0; j < n; j++) circ(cx + j * 9, cy + 3, RI(6, 9), '#d2ebfb');
      for (let j = 0; j < n; j++) circ(cx + j * 9, cy, RI(6, 9), '#ffffff');
    }
  }
  // skyline
  for (let x = -10; x < W;) {
    const w = RI(26, 54), h = RI(80, 150), top = GROUND - 40 - h;
    const col = night ? (rnd() > 0.5 ? '#141a3a' : '#1a2046') : (rnd() > 0.5 ? '#9fb6cf' : '#b2c6da');
    F(col, x, top, w, h + 40); F(night ? '#0f1430' : shade(col, 0.88), x + w - 3, top, 3, h + 40);
    if (rnd() > 0.7) F(col, x + w / 2 - 1, top - 8, 2, 8);
    for (let yy = top + 5; yy < GROUND - 30; yy += 5) {
      if (night) { for (let xx = x + 3; xx < x + w - 4; xx += 4) if (rnd() > 0.72) F('#ffd27a', xx, yy, 2, 2); }
      else F(shade(col, 1.1), x + 3, yy, w - 7, 1);
    }
    x += w + RI(-4, 6);
  }
  // background tree line
  for (let x = 0; x < W; x += RI(18, 30)) { const y = GROUND - RI(52, 70); circ(x, y + 4, RI(10, 14), nc('#2f6f3a')); circ(x - 2, y, RI(8, 11), nc('#3f8a46')); }

  // houses
  const facades = ['#f28c9a', '#f5cf5b', '#5fc4b8', '#b79ce0', '#f3a65a', '#86c97e', '#7fb2e8', '#e9dcc0'];
  const houses = [];
  let x = -8, i = 0;
  while (x < W) {
    const w = i === padIndex ? 104 : RI(66, 98), floors = i === padIndex ? 2 : RI(2, 3), h = floors * 36 + 16, top = GROUND - h;
    const brick = i !== padIndex && rnd() < 0.3;
    const base = nc(brick ? '#b5523b' : facades[(i * 3 + RI(0, 2)) % facades.length]);
    const dark = shade(base, 0.78), light = shade(base, 1.12);
    F(base, x, top, w, h);
    if (brick) {
      const mort = nc('#8b3a2a'), hi = nc('#c9674c');
      for (let y = top; y < GROUND; y += 4) {
        F(mort, x, y + 3, w, 1);
        const off = ((y - top) / 4) % 2 ? 6 : 0;
        for (let xx = off; xx < w; xx += 12) { F(mort, x + xx, y, 1, 3); if (rnd() > 0.8) F(hi, x + xx + 1, y, 5, 3); }
      }
    } else {
      for (let f = 1; f < floors; f++) F(dark, x, top + 16 + f * 36 - 2, w, 2);
      for (let k = 0; k < w * h / 60; k++) F(rnd() > 0.5 ? light : dark, x + R(0, w), top + R(4, h), 1, 1);
    }
    F(light, x, top, 1, h); F(dark, x + w - 2, top, 2, h);
    F(dark, x, GROUND - 6, w, 6); // skirting
    // cornice / roof
    const cream = nc('#f1eadb');
    F(cream, x - 2, top, w + 4, 4); F(shade(cream, 0.8), x - 2, top + 4, w + 4, 1);
    if (rnd() < 0.45) { for (let k = 0; k < w - 4; k += 3) { F(nc('#c0472f'), x + 2 + k, top - 6, 3, 6); F(nc('#8e2f20'), x + 2 + k, top - 6, 1, 6); } }
    if (rnd() < 0.45) { const tx = x + RI(8, w - 22); F(nc('#2f6fb6'), tx, top - 11, 14, 11); F(nc('#5a94d6'), tx, top - 11, 14, 2); F(nc('#1f4f86'), tx + 12, top - 9, 2, 9); }
    // upper windows
    for (let f = 0; f < floors - 1; f++) {
      const wy = top + 10 + f * 36, n = Math.max(2, Math.floor((w - 8) / 22));
      for (let k = 0; k < n; k++) {
        const wx = x + 6 + k * ((w - 12) / n) + ((w - 12) / n - 12) / 2;
        F(cream, wx - 2, wy - 2, 16, 20);
        const lit = night && rnd() > 0.35;
        F(night ? (lit ? '#ffcf72' : '#1b2246') : '#3d6fa8', wx, wy, 12, 16);
        if (lit) { F('#ffb347', wx, wy + 9, 12, 7); F('#c9864a', wx, wy, 3, 16); lights.push([wx + 6, '#ffb347', 6]); }
        else if (!night) { F('#8fc1ef', wx + 2, wy + 2, 2, 1); F('#8fc1ef', wx + 3, wy + 3, 2, 1); F('#2d5482', wx, wy + 12, 12, 4); }
        F(cream, wx + 5, wy, 2, 16); F(cream, wx, wy + 7, 12, 1);
        if (rnd() < 0.35) { const sh = nc('#2f7d4f'); F(sh, wx - 6, wy - 1, 5, 18); F(sh, wx + 13, wy - 1, 5, 18); for (let yy = wy; yy < wy + 16; yy += 3) { F(shade(sh, 0.75), wx - 6, yy, 5, 1); F(shade(sh, 0.75), wx + 13, yy, 5, 1); } }
        F(shade(cream, 0.85), wx - 3, wy + 17, 18, 2);
        if (rnd() < 0.35) { F(nc('#6b3f22'), wx - 1, wy + 19, 14, 3); for (let p = 0; p < 6; p++) { F(nc('#3f9a48'), wx + p * 2, wy + 16, 2, 3); if (rnd() > 0.5) F(nc('#e8404a'), wx + p * 2, wy + 16, 1, 1); } }
        if (rnd() < 0.15) { F(nc('#d8dbe2'), wx + 14, wy + 6, 8, 6); F(nc('#9a9ea8'), wx + 15, wy + 8, 6, 1); }
      }
    }
    // ground floor
    const gy = GROUND - 30;
    if (i === padIndex) {
      F(night ? '#ffd38a' : '#6c90b8', x + 8, gy + 2, w - 34, 22); F(night ? '#ffb347' : '#9cc0e4', x + 10, gy + 4, 10, 2);
      F(cream, x + 8, gy + 12, w - 34, 1);
      F(nc('#7a4a2a'), x + w - 22, gy, 14, 24); F(nc('#5a3420'), x + w - 22, gy, 2, 24); F('#e8c35a', x + w - 11, gy + 12, 1, 2);
      for (let k = 0; k < w - 4; k += 4) { const red = (k / 4) % 2 === 0; F(nc(red ? '#d8343c' : '#ffffff'), x + 2 + k, gy - 10, 4, 8); F(nc(red ? '#d8343c' : '#ffffff'), x + 2 + k, gy - 2, 4, red ? 2 : 1); }
      F(nc('#a52a30'), x + 2, gy - 11, w - 4, 1);
      const sy = gy - 26;
      F(night ? '#1a0b20' : '#fff4d6', x + 10, sy, w - 20, 13); F(night ? '#ff3cac' : '#d8343c', x + 10, sy, w - 20, 1); F(night ? '#ff3cac' : '#d8343c', x + 10, sy + 12, w - 20, 1);
      const t = pixelText('PADARIA', night ? '#ffb0e0' : '#d8343c');
      if (night) { g.globalAlpha = 0.5; const t2 = pixelText('PADARIA', '#ff3cac'); for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) g.drawImage(t2, Math.round(x + w / 2 - t.width / 2) + dx, sy + 2 + dy); g.globalAlpha = 1; lights.push([x + w / 2, '#ff3cac', 40]); }
      g.drawImage(t, Math.round(x + w / 2 - t.width / 2), sy + 2);
    } else {
      const dx = x + RI(6, w - 22);
      F(nc('#7a4a2a'), dx, gy, 13, 24); F(nc('#9a6238'), dx + 2, gy + 2, 9, 9); F(nc('#9a6238'), dx + 2, gy + 13, 9, 9); F('#e8c35a', dx + 10, gy + 12, 1, 2);
      F(cream, dx - 2, gy - 2, 17, 2);
      const sx = dx > x + w / 2 ? x + 6 : dx + 20, sw = Math.min(30, w - 40);
      if (sw > 12) { F(cream, sx - 1, gy + 3, sw + 2, 16); F(night ? (rnd() > 0.4 ? '#ffcf72' : '#1b2246') : '#3d6fa8', sx, gy + 4, sw, 14); F(cream, sx + sw / 2, gy + 4, 1, 14); }
      if (night && (i === padIndex + 2 || i === padIndex - 2)) {
        const name = i > padIndex ? 'BAR' : 'HOTEL', col = i > padIndex ? '#3cf2ff' : '#ffe44a';
        const t = pixelText(name, '#ffffff'), t2 = pixelText(name, col);
        const tx = Math.round(x + w / 2 - t.width / 2), ty = top + 20;
        F('#0a0a18', tx - 3, ty - 2, t.width + 6, 12);
        g.globalAlpha = 0.6; for (const [ox, oy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) g.drawImage(t2, tx + ox, ty + oy); g.globalAlpha = 1; g.drawImage(t2, tx, ty);
        lights.push([x + w / 2, col, 26]);
      }
    }
    houses.push({ x, w, top, i });
    x += w; i++;
  }

  // sidewalk (pedra portuguesa) + curb
  const stone = nc('#e9e2d2'), stoneD = nc('#2a2630');
  F(stone, 0, GROUND, W, 12);
  for (let xx = 0; xx < W; xx++) { const y = GROUND + 6 + Math.round(2.6 * Math.sin(xx / 6)); F(stoneD, xx, y, 1, 2); }
  F(nc('#c4beb2'), 0, GROUND + 12, W, 2); F(nc('#7a766e'), 0, GROUND + 14, W, 1);
  // road
  const asph = night ? '#1b1d2c' : '#4a4c57';
  F(asph, 0, GROUND + 15, W, 270);
  for (let k = 0; k < W * 4; k++) F(rnd() > 0.5 ? shade(asph, 0.88) : shade(asph, 1.12), R(0, W), R(GROUND + 15, 270), 1, 1);
  for (let xx = 8; xx < W; xx += 34) F(nc('#e8d98a'), xx, 245, 16, 2);
  for (let b = 0; b < 8; b++) for (let y = GROUND + 17; y < 268; y++) F(nc('#e6e6e0'), crosswalkX + b * 11 + (y - GROUND) * 0.22, y, 6, 1);
  // wet reflections at night
  if (night) {
    g.globalAlpha = 0.45;
    for (const [lx, col, lw] of lights) for (let y = GROUND + 16; y < 268; y++) for (let xx = -lw / 2; xx < lw / 2; xx++) if (((xx + y) & 1) === 0 && rnd() < 0.55 - (y - GROUND) / 200) F(col, lx + xx + Math.sin(y * 0.7) * 2, y, 1, 1);
    g.globalAlpha = 1;
  }
  // poles + wires
  const poles = [];
  for (let px = 40; px < W; px += 170) {
    F(nc('#9a968d'), px, GROUND - 140, 4, 146); F(nc('#77736b'), px + 3, GROUND - 140, 1, 146);
    F(nc('#9a968d'), px - 10, GROUND - 136, 24, 3);
    poles.push(px + 2);
  }
  const wire = night ? '#05050c' : '#2a2630';
  for (let k = 0; k < poles.length - 1; k++) for (const dy of [0, 4, 8]) for (let xx = poles[k]; xx <= poles[k + 1]; xx++) { const t = (xx - poles[k]) / (poles[k + 1] - poles[k]); F(wire, xx, GROUND - 136 + dy + Math.sin(t * Math.PI) * 14, 1, 1); }
  // lamp posts
  for (let lx = 125; lx < W; lx += 170) {
    const iron = nc('#24332c');
    F(iron, lx, GROUND - 60, 3, 66); F(iron, lx - 2, GROUND - 2, 7, 6); F(iron, lx - 3, GROUND - 66, 9, 6); F(iron, lx - 1, GROUND - 69, 5, 3);
    F(night ? '#fff0b0' : '#f7e6a8', lx - 2, GROUND - 64, 7, 3);
    if (night) {
      g.globalAlpha = 0.18; for (let r = 30; r > 4; r -= 6) circ(lx + 1, GROUND - 62, r, '#ffc870'); g.globalAlpha = 1;
      g.globalAlpha = 0.25; for (let y = GROUND - 60; y < GROUND + 12; y++) { const hw = (y - (GROUND - 62)) * 0.45; for (let xx = -hw; xx < hw; xx++) if (((xx | 0) + y) % 2 === 0) F('#ffd890', lx + 1 + xx, y, 1, 1); } g.globalAlpha = 1;
      lights.push([lx + 1, '#ffc870', 10]);
    }
  }
  // street trees
  const padC = houses[padIndex].x + houses[padIndex].w / 2;
  for (let tx = 70; tx < W; tx += 230) {
    if (Math.abs(tx - padC) < 75) continue;
    F(nc('#6b4a2b'), tx, GROUND - 34, 5, 42); F(nc('#4f341d'), tx + 3, GROUND - 34, 2, 42);
    const cy = GROUND - 52;
    for (const [ox, oy, r, col] of [[0, 6, 18, '#2a6a34'], [-12, 0, 13, '#2f7d3a'], [12, 2, 14, '#2f7d3a'], [-4, -10, 13, '#3f9a48'], [6, -6, 11, '#4fae52'], [-8, -12, 6, '#7ccf6a']]) circ(tx + 2 + ox, cy + oy, r, nc(col));
  }
  return { canvas: c, GROUND, houses, padX: houses[padIndex].x + houses[padIndex].w / 2 };
}
