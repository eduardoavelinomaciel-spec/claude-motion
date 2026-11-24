// Hand-styled pixel sprites: draw shapes at native resolution, then snap to
// palette + binary alpha, then add a 1px dark outline (and optional rim light).
export const OUT = '#1b1420';

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

export function sprite(w, h, palette, draw, { rim = null, tint = null, outline = true } = {}) {
  const P = 2; // padding for outline
  const c = document.createElement('canvas'); c.width = w + P * 2; c.height = h + P * 2;
  const g = c.getContext('2d'); g.translate(P, P);
  draw(g);
  const img = g.getImageData(0, 0, c.width, c.height), d = img.data;
  const pal = palette.map(hex);
  const W = c.width, H = c.height;
  const op = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) {
    const a = d[i * 4 + 3];
    if (a < 110) { d[i * 4 + 3] = 0; continue; }
    // un-premultiply-ish: edge pixels blend with transparent black, so judge by hue
    const k = 255 / a, r = d[i * 4] * (a < 255 ? Math.min(k, 1.6) : 1), gg = d[i * 4 + 1] * (a < 255 ? Math.min(k, 1.6) : 1), b = d[i * 4 + 2] * (a < 255 ? Math.min(k, 1.6) : 1);
    let best = 0, bd = 1e9;
    pal.forEach((p, j) => { const dd = (p[0] - r) ** 2 + (p[1] - gg) ** 2 + (p[2] - b) ** 2; if (dd < bd) { bd = dd; best = j; } });
    d[i * 4] = pal[best][0]; d[i * 4 + 1] = pal[best][1]; d[i * 4 + 2] = pal[best][2]; d[i * 4 + 3] = 255; op[i] = 1;
  }
  const o = hex(OUT);
  const isOut = new Uint8Array(W * H);
  if (outline) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x; if (op[i]) continue;
    const n = (xx, yy) => xx >= 0 && yy >= 0 && xx < W && yy < H && op[yy * W + xx];
    if (n(x - 1, y) || n(x + 1, y) || n(x, y - 1) || n(x, y + 1)) { d[i * 4] = o[0]; d[i * 4 + 1] = o[1]; d[i * 4 + 2] = o[2]; d[i * 4 + 3] = 255; isOut[i] = 1; }
  }
  if (tint) for (let i = 0; i < W * H; i++) if (op[i]) { d[i * 4] *= tint[0]; d[i * 4 + 1] *= tint[1]; d[i * 4 + 2] *= tint[2]; }
  if (rim) {
    const rc = hex(rim.color);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x; if (!op[i]) continue;
      const j = (y + rim.dy) * W + (x + rim.dx);
      if (j >= 0 && j < W * H && (isOut[j] || !op[j])) for (let k = 0; k < 3; k++) d[i * 4 + k] = d[i * 4 + k] * (1 - rim.k) + rc[k] * rim.k;
    }
  }
  g.setTransform(1, 0, 0, 1, 0, 0); g.putImageData(img, 0, 0);
  c.anchor = [P + (draw.ax ?? w / 2), P + (draw.ay ?? h)];
  return c;
}

const R = (g, c, x, y, w, h) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
const E = (g, c, x, y, rx, ry, rot = 0) => { g.fillStyle = c; g.beginPath(); g.ellipse(x, y, rx, ry, rot, 0, 7); g.fill(); };
const Poly = (g, c, pts) => { g.fillStyle = c; g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.fill(); };
const Line = (g, c, w, pts) => { g.strokeStyle = c; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); };
const fn = (f, ax, ay) => Object.assign(f, { ax, ay });

// ---------------- Otávio ----------------
const OT = { skin: '#e9b98f', skinS: '#c98f6a', hair: '#c3c6cc', hairS: '#8d9098', coat: '#dcc49a', coatL: '#f0dfbc', coatS: '#b39a72', coatD: '#8f7a58', pants: '#2c3350', pantsS: '#1d2238', shoe: '#5a3a22', shoeL: '#7a5232', scarf: '#9a3a2e', scarfS: '#6e2820', pack: '#6d727c', packS: '#4d515a', eye: '#1a1210', mouth: '#8a2a22', phone: '#15161c', screen: '#8fe0ff', white: '#ffffff' };
const OTP = Object.values(OT);

export function otavioFront(opts = {}) {
  return sprite(40, 96, OTP, fn((g) => {
    // legs + shoes
    R(g, OT.pants, 13, 62, 6, 26); R(g, OT.pants, 21, 62, 6, 26); R(g, OT.pantsS, 24, 62, 3, 26); R(g, OT.pantsS, 19, 62, 2, 26);
    R(g, OT.shoe, 11, 87, 9, 5); R(g, OT.shoe, 21, 87, 9, 5); R(g, OT.shoeL, 12, 87, 5, 2); R(g, OT.shoeL, 22, 87, 5, 2);
    // sleeves (behind coat edges)
    R(g, OT.coat, 4, 32, 6, 26); R(g, OT.coatS, 30, 32, 6, 26); R(g, OT.coatL, 4, 32, 2, 22);
    R(g, OT.skin, 4, 57, 6, 6); R(g, OT.skinS, 30, 57, 6, 6);
    // coat
    Poly(g, OT.coat, [[10, 29], [30, 29], [32, 68], [8, 68]]);
    Poly(g, OT.coatS, [[24, 29], [30, 29], [32, 68], [25, 68]]);
    Poly(g, OT.coatL, [[10, 29], [13, 29], [11, 68], [8, 68]]);
    R(g, OT.coatD, 19, 34, 1, 34); R(g, OT.coatD, 17, 40, 2, 2); R(g, OT.coatD, 17, 48, 2, 2); R(g, OT.coatD, 17, 56, 2, 2);
    R(g, OT.coatD, 11, 52, 4, 1); R(g, OT.coatD, 25, 52, 4, 1); // pockets
    R(g, OT.pack, 12, 30, 2, 15); R(g, OT.pack, 26, 30, 2, 15);
    // scarf + neck
    R(g, OT.skinS, 17, 23, 6, 5); R(g, OT.scarf, 12, 26, 16, 5); R(g, OT.scarfS, 21, 26, 7, 5); R(g, OT.scarf, 21, 30, 4, 9);
    // head
    E(g, OT.skin, 20, 15, 8, 9); E(g, OT.skinS, 25, 16, 3, 7);
    E(g, OT.hair, 20, 9, 9, 5); R(g, OT.hair, 11, 8, 3, 8); R(g, OT.hairS, 26, 8, 3, 8); R(g, OT.hairS, 22, 6, 6, 3);
    R(g, OT.skinS, 11, 15, 1, 3); R(g, OT.skinS, 28, 15, 1, 3); // ears
    R(g, OT.hairS, 15, 13, 4, 1); R(g, OT.hairS, 22, 13, 4, 1); // brows
    R(g, OT.eye, 16, 15, 2, 2); R(g, OT.eye, 23, 15, 2, 2);
    R(g, OT.skinS, 19, 17, 2, 2);
    if (opts.smile) { R(g, OT.mouth, 17, 21, 6, 1); R(g, OT.mouth, 16, 20, 1, 1); R(g, OT.mouth, 23, 20, 1, 1); }
    else R(g, OT.mouth, 18, 21, 4, 1);
  }, 20, 92), opts.fx);
}

// side view, facing right. lean>0 tips forward, lean<0 tips back.
export function otavioSide({ lean = 0, arm = 0.2, farArm = 0.1, head = 0, stride = 0.25, phone = true, shock = false, fx } = {}) {
  return sprite(72, 104, OTP, fn((g) => {
    g.translate(36, 100); g.rotate(lean);
    const limb = (ang, px, py, draw) => { g.save(); g.translate(px, py); g.rotate(ang); draw(); g.restore(); };
    // far leg
    limb(-stride, -1, -32, () => { R(g, OT.pantsS, -3, 0, 6, 30); R(g, OT.shoe, -3, 28, 10, 4); });
    // far arm
    limb(farArm, -2, -72, () => { R(g, OT.coatS, -3, 0, 6, 26); R(g, OT.skinS, -3, 25, 6, 5); });
    // backpack
    R(g, OT.pack, -17, -74, 8, 24); R(g, OT.packS, -17, -56, 8, 6); R(g, OT.packS, -17, -74, 2, 24);
    // near leg
    limb(stride, 1, -32, () => { R(g, OT.pants, -3, 0, 7, 30); R(g, OT.pantsS, 2, 0, 2, 30); R(g, OT.shoe, -3, 28, 11, 5); R(g, OT.shoeL, -2, 28, 6, 2); });
    // coat
    Poly(g, OT.coat, [[-10, -75], [8, -75], [12, -28], [-12, -28]]);
    Poly(g, OT.coatL, [[3, -75], [8, -75], [12, -28], [6, -28]]);
    Poly(g, OT.coatS, [[-10, -75], [-6, -75], [-8, -28], [-12, -28]]);
    R(g, OT.coatD, 5, -70, 1, 40); R(g, OT.coatD, -3, -48, 6, 1);
    // scarf
    R(g, OT.scarf, -6, -80, 13, 6); R(g, OT.scarfS, -6, -76, 13, 2); R(g, OT.scarf, 5, -76, 4, 9);
    // head
    limb(head, 0, -80, () => {
      E(g, OT.skin, 2, -9, 8, 9); R(g, OT.skin, 8, -10, 3, 3); // nose
      E(g, OT.skinS, -3, -8, 3, 6);
      E(g, OT.hair, -1, -14, 8, 6); R(g, OT.hair, -8, -14, 6, 10); R(g, OT.hairS, -8, -8, 6, 4);
      R(g, OT.hairS, 3, -13, 4, 1);
      R(g, OT.eye, 4, -11, 2, shock ? 3 : 2); if (shock) R(g, OT.white, 4, -11, 1, 1);
      R(g, OT.skinS, -2, -9, 2, 3);
      if (shock) E(g, OT.mouth, 6, -3, 2, 2); else R(g, OT.mouth, 5, -3, 3, 1);
    });
    // near arm
    limb(arm, 0, -72, () => {
      R(g, OT.coat, -3, 0, 7, 26); R(g, OT.coatL, 1, 0, 3, 24); R(g, OT.skin, -3, 25, 7, 6);
      if (phone) { R(g, OT.phone, 0, 27, 4, 8); R(g, OT.screen, 1, 28, 2, 6); }
    });
  }, 36, 100), fx);
}

// ---------------- Caramelo ----------------
const DG = { c: '#cf8d3e', cL: '#e9ad5e', cS: '#9a5f22', w: '#f6f0e4', wS: '#d6ccb8', d: '#24140a', pink: '#ff7a92', mud: '#6b4a2b', mudS: '#4a3019', cloth: '#dcc49a', clothS: '#b39a72', eyeW: '#ffffff' };
const DGP = Object.values(DG);

export function dogSide({ pose = 'stand', muddy = false, fx } = {}) {
  return sprite(66, 50, DGP, fn((g) => {
    g.translate(30, 44);
    const tilt = { stand: 0, leap: -0.32, pull: 0.12, splash: -0.55 }[pose];
    g.rotate(tilt);
    const C = muddy ? DG.mud : DG.c, CS = muddy ? DG.mudS : DG.cS, CL = muddy ? DG.c : DG.cL, W = muddy ? DG.wS : DG.w;
    const leg = (x, ang, far) => { g.save(); g.translate(x, -14); g.rotate(ang); R(g, far ? CS : C, -2, 0, 5, 12); R(g, far ? DG.wS : W, -2, 10, 6, 4); g.restore(); };
    const [fa, ba] = { stand: [0, 0], leap: [-1.15, 1.05], pull: [-0.55, -0.35], splash: [-0.9, 0.8] }[pose];
    leg(9, fa + 0.1, true); leg(-11, ba - 0.1, true);
    // tail
    Line(g, C, 4, pose === 'pull' ? [[-15, -20], [-21, -24], [-24, -22]] : [[-15, -22], [-21, -30], [-20, -36]]);
    R(g, W, pose === 'pull' ? -26 : -22, pose === 'pull' ? -24 : -39, 3, 3);
    // body
    E(g, C, -2, -21, 15, 8); E(g, CL, -3, -25, 12, 3); E(g, CS, -2, -16, 12, 3);
    E(g, W, 9, -18, 5, 5);
    leg(12, fa, false); leg(-8, ba, false);
    // head
    g.save(); g.translate(13, -29); g.rotate(pose === 'pull' ? 0.35 : 0);
    Poly(g, DG.cS, [[-7, -7], [-2, -8], [-5, 3]]); // folded ear (back)
    E(g, C, 0, 0, 8, 7); E(g, CL, -1, -4, 5, 2);
    Poly(g, DG.cS, [[0, -6], [3, -15], [6, -5]]); Poly(g, DG.c, [[2, -6], [3, -12], [5, -6]]); // ear up
    R(g, W, 5, -1, 9, 6); R(g, W, 3, 2, 6, 3);
    R(g, DG.d, 13, -1, 3, 3);
    R(g, DG.d, 2, -3, 2, 3); R(g, DG.eyeW, 2, -3, 1, 1);
    const open = pose !== 'stand';
    if (open) { Poly(g, DG.d, [[6, 4], [14, 3], [13, 8], [7, 7]]); R(g, DG.pink, 8, 6, 4, 2); R(g, W, 7, 7, 7, 2); }
    else R(g, DG.d, 8, 4, 5, 1);
    if (pose === 'splash') R(g, DG.pink, 10, 8, 3, 4);
    if (pose === 'pull') { Poly(g, DG.cloth, [[11, 2], [22, -4], [24, 6], [12, 7]]); R(g, DG.clothS, 14, 4, 9, 2); }
    g.restore();
    if (muddy) for (const [x, y, r] of [[-10, -24, 3], [2, -18, 2], [-4, -27, 2], [8, -24, 2], [-14, -18, 2]]) E(g, DG.mudS, x, y, r, r * 0.8);
  }, 30, 44), fx);
}

export function dogPortrait({ bite = false, fx } = {}) {
  return sprite(92, 84, DGP, fn((g) => {
    Poly(g, DG.cS, [[16, 22], [30, 16], [22, 52]]); // folded ear
    E(g, DG.c, 44, 44, 30, 28); E(g, DG.cL, 40, 28, 20, 8); E(g, DG.cS, 62, 50, 10, 18);
    Poly(g, DG.cS, [[50, 22], [60, -2], [72, 26]]); Poly(g, DG.c, [[55, 21], [60, 4], [67, 23]]);
    E(g, DG.w, 52, 60, 20, 14); E(g, DG.wS, 58, 66, 12, 7);
    E(g, DG.d, 60, 50, 6, 4); R(g, DG.eyeW, 57, 48, 2, 1);
    for (const x of [30, 58]) { E(g, DG.d, x, 36, 5, 6); R(g, DG.eyeW, x - 2, 33, 3, 3); R(g, DG.eyeW, x + 2, 38, 1, 1); }
    R(g, DG.cS, 24, 26, 10, 2); R(g, DG.cS, 52, 26, 10, 2); // brows (alert)
    if (bite) { Poly(g, DG.cloth, [[20, 66], [90, 58], [90, 76], [22, 78]]); R(g, DG.clothS, 22, 72, 68, 3); R(g, DG.eyeW, 40, 64, 3, 4); R(g, DG.eyeW, 62, 62, 3, 4); }
    else { R(g, DG.d, 44, 66, 18, 2); }
  }, 46, 84), fx);
}

export function handPhone({ fx } = {}) {
  return sprite(92, 84, OTP, fn((g) => {
    Poly(g, OT.coat, [[0, 84], [0, 46], [30, 40], [46, 84]]); Poly(g, OT.coatS, [[0, 70], [40, 66], [46, 84], [0, 84]]);
    R(g, OT.coatD, 28, 42, 3, 42);
    E(g, OT.skin, 50, 50, 16, 13); E(g, OT.skinS, 50, 58, 14, 6);
    R(g, OT.phone, 42, 18, 26, 42); R(g, OT.screen, 45, 22, 20, 32);
    R(g, OT.white, 47, 25, 16, 4); R(g, OT.white, 47, 32, 12, 2); R(g, OT.white, 47, 36, 14, 2); R(g, OT.white, 47, 42, 10, 2);
    E(g, OT.skin, 66, 46, 6, 9); E(g, OT.skin, 44, 54, 6, 5);
  }, 46, 84), fx);
}

// ---------------- car: boxy 80s sedan, 3/4 front ----------------
const CR = { l: '#ff7a66', b: '#d8343c', s: '#a51f2d', d: '#6a1020', glass: '#1b2540', glassL: '#4d6d9e', tire: '#141418', rim: '#d8dbe2', rimS: '#8a8e98', lamp: '#fff6d8', amber: '#ffa23c', chrome: '#c6c9d2', plate: '#f2f2ea', trim: '#26222a' };
export function car({ fx, lit = false } = {}) {
  const O = [8, 70], Wv = [20, 2.2], Dv = [27, -7.5], Yv = [0, -24];
  const p = (w, d, y) => [O[0] + w * Wv[0] + d * Dv[0] + y * Yv[0], O[1] + w * Wv[1] + d * Dv[1] + y * Yv[1]];
  return sprite(170, 104, Object.values(CR), fn((g) => {
    // far-side tyres peeking
    E(g, CR.tire, ...p(0.15, 0.85, 0.28), 7, 7); E(g, CR.tire, ...p(0.15, 3.3, 0.28), 6, 6);
    // trunk + roof + glass
    Poly(g, CR.l, [p(0, 3.25, 0.92), p(1.7, 3.25, 0.92), p(1.7, 4.15, 0.94), p(0, 4.15, 0.94)]);
    Poly(g, CR.d, [p(0.1, 4.3, 0.98), p(1.6, 4.3, 0.98), p(1.6, 4.15, 1.04), p(0.1, 4.15, 1.04)]); // spoiler
    Poly(g, CR.glass, [p(0.14, 1.28, 0.9), p(1.56, 1.28, 0.9), p(1.56, 1.9, 1.4), p(0.14, 1.9, 1.4)]);
    Poly(g, CR.glassL, [p(0.5, 1.33, 0.95), p(0.7, 1.33, 0.95), p(0.95, 1.85, 1.36), p(0.75, 1.85, 1.36)]);
    Poly(g, CR.l, [p(0.14, 1.9, 1.42), p(1.56, 1.9, 1.42), p(1.56, 3.0, 1.42), p(0.14, 3.0, 1.42)]);
    Poly(g, CR.b, [p(1.56, 1.28, 0.9), p(1.56, 1.9, 1.4), p(1.56, 3.0, 1.4), p(1.56, 3.3, 0.92)]);
    Poly(g, CR.glass, [p(1.57, 1.42, 0.95), p(1.57, 1.95, 1.34), p(1.57, 2.42, 1.34), p(1.57, 2.42, 0.95)]);
    Poly(g, CR.glass, [p(1.57, 2.55, 0.95), p(1.57, 2.55, 1.34), p(1.57, 2.98, 1.34), p(1.57, 3.32, 0.95)]);
    // hood
    Poly(g, CR.l, [p(0, 0, 0.86), p(1.7, 0, 0.86), p(1.7, 1.3, 0.9), p(0, 1.3, 0.9)]);
    Line(g, CR.b, 1, [p(0.5, 0.05, 0.87), p(0.5, 1.25, 0.9)]); Line(g, CR.b, 1, [p(1.2, 0.05, 0.87), p(1.2, 1.25, 0.9)]);
    // side panel
    Poly(g, CR.b, [p(1.7, 0, 0.32), p(1.7, 0, 0.86), p(1.7, 4.15, 0.94), p(1.7, 4.15, 0.34)]);
    Poly(g, CR.s, [p(1.7, 0, 0.32), p(1.7, 0, 0.5), p(1.7, 4.15, 0.52), p(1.7, 4.15, 0.34)]);
    Line(g, CR.trim, 1, [p(1.71, 0.1, 0.58), p(1.71, 4.3, 0.6)]);
    Line(g, CR.d, 1, [p(1.71, 1.32, 0.36), p(1.71, 1.32, 0.88)]); Line(g, CR.d, 1, [p(1.71, 2.5, 0.36), p(1.71, 2.5, 0.9)]); Line(g, CR.d, 1, [p(1.71, 3.42, 0.36), p(1.71, 3.42, 0.92)]);
    R(g, CR.trim, ...p(1.71, 2.2, 0.76), 4, 1); R(g, CR.trim, ...p(1.71, 3.2, 0.78), 4, 1);
    Poly(g, CR.d, [p(1.6, 1.3, 0.9), p(1.6, 1.42, 0.98), p(1.75, 1.42, 0.98), p(1.75, 1.3, 0.9)]); // mirror
    // wheels
    for (const d of [0.85, 3.3]) {
      const [x, y] = p(1.7, d, 0.3);
      E(g, CR.trim, x, y - 1, 11, 10); E(g, CR.tire, x, y, 9, 9); E(g, CR.rim, x, y, 6, 6); E(g, CR.rimS, x + 1, y + 1, 4, 4);
      for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; Line(g, CR.rimS, 1, [[x, y], [x + Math.cos(a) * 5, y + Math.sin(a) * 5]]); }
      E(g, CR.trim, x, y, 1.5, 1.5);
    }
    // front face
    Poly(g, CR.s, [p(0, 0, 0.32), p(1.7, 0, 0.32), p(1.7, 0, 0.86), p(0, 0, 0.86)]);
    Poly(g, CR.trim, [p(0.62, 0, 0.56), p(1.08, 0, 0.56), p(1.08, 0, 0.78), p(0.62, 0, 0.78)]);
    for (let k = 0; k < 4; k++) Line(g, CR.chrome, 1, [p(0.66 + k * 0.12, 0, 0.6), p(0.66 + k * 0.12, 0, 0.74)]);
    for (const w of [0.16, 0.42, 1.28, 1.54]) { const [x, y] = p(w, 0, 0.67); E(g, CR.trim, x, y, 3.5, 3.5); E(g, lit ? '#ffffff' : CR.lamp, x, y, 2.5, 2.5); }
    for (const w of [0.2, 1.5]) { const [x, y] = p(w, 0, 0.46); R(g, CR.amber, x - 2, y - 1, 4, 2); }
    Poly(g, CR.trim, [p(-0.02, -0.04, 0.3), p(1.72, -0.04, 0.3), p(1.72, -0.04, 0.4), p(-0.02, -0.04, 0.4)]);
    { const [x, y] = p(0.85, -0.05, 0.42); R(g, CR.plate, x - 5, y - 2, 10, 4); }
  }, 84, 74), fx);
}

// ---------------- extras ----------------
const CT = { b: '#3f3f4c', l: '#5c5c6e', d: '#2a2a33', eye: '#c6ff4a', pink: '#ff8aa8' };
export function cat({ fx } = {}) {
  return sprite(40, 34, Object.values(CT), fn((g) => {
    Line(g, CT.b, 4, [[6, 26], [3, 14], [6, 6]]);
    E(g, CT.b, 16, 24, 10, 7); E(g, CT.l, 15, 20, 7, 2);
    R(g, CT.d, 9, 26, 4, 7); R(g, CT.b, 21, 27, 4, 6);
    E(g, CT.b, 28, 15, 7, 6);
    Poly(g, CT.b, [[22, 12], [23, 3], [28, 10]]); Poly(g, CT.b, [[29, 10], [34, 3], [34, 13]]); R(g, CT.pink, 24, 7, 2, 3);
    R(g, CT.eye, 27, 14, 3, 2); R(g, CT.eye, 32, 14, 2, 2); R(g, CT.d, 28, 14, 1, 2);
    R(g, CT.d, 26, 12, 4, 1); R(g, CT.d, 31, 12, 3, 1); // angry brows
    Poly(g, CT.b, [[30, 20], [39, 12], [40, 16], [32, 23]]); // swiping paw
  }, 16, 33), fx);
}
export function pigeon(up, fx) {
  return sprite(18, 12, ['#9aa0b2', '#6d7488', '#3c4660', '#5ac08a', '#ff8a3c'], fn((g) => {
    E(g, '#9aa0b2', 8, 7, 6, 3); E(g, '#3c4660', 14, 5, 3, 3); R(g, '#5ac08a', 12, 7, 2, 1); R(g, '#ff8a3c', 17, 5, 1, 1);
    Poly(g, '#6d7488', up ? [[5, 6], [9, 0], [11, 6]] : [[5, 7], [9, 12], [11, 7]]); Poly(g, '#6d7488', [[2, 7], [0, 5], [0, 9]]);
  }, 9, 12), fx);
}
export function trashCan(fx) {
  return sprite(34, 20, ['#f07a1e', '#ffa04a', '#b0520e', '#2b8a3a', '#1c6a2a'], fn((g) => {
    R(g, '#f07a1e', 4, 3, 26, 14); R(g, '#ffa04a', 4, 4, 26, 3); R(g, '#b0520e', 4, 13, 26, 4);
    E(g, '#2b8a3a', 4, 10, 3, 7); E(g, '#1c6a2a', 31, 10, 2, 6);
  }, 17, 18), fx);
}
export function lid(fx) { return sprite(16, 12, ['#2b8a3a', '#46b05a', '#1c6a2a'], fn((g) => { E(g, '#2b8a3a', 8, 6, 7, 4); E(g, '#46b05a', 7, 5, 4, 2); }, 8, 12), fx); }

// side view, facing right
export function carSide({ fx, lit = false } = {}) {
  return sprite(132, 46, Object.values(CR), fn((g) => {
    Poly(g, CR.b, [[4, 22], [8, 18], [36, 17], [46, 5], [86, 5], [98, 17], [124, 19], [128, 24], [128, 34], [4, 34]]);
    Poly(g, CR.l, [[8, 18], [36, 17], [38, 19], [8, 20]]); Poly(g, CR.l, [[98, 17], [124, 19], [124, 21], [98, 19]]);
    R(g, CR.l, 46, 5, 40, 2);
    Poly(g, CR.glass, [[40, 17], [48, 8], [64, 8], [64, 17]]); Poly(g, CR.glass, [[68, 8], [84, 8], [93, 17], [68, 17]]);
    Poly(g, CR.glassL, [[50, 9], [54, 9], [48, 16], [44, 16]]);
    R(g, CR.s, 4, 28, 124, 6); R(g, CR.trim, 6, 25, 120, 1);
    R(g, CR.d, 65, 18, 1, 15); R(g, CR.d, 37, 18, 1, 15); R(g, CR.d, 96, 18, 1, 15);
    R(g, CR.trim, 70, 21, 4, 1); R(g, CR.trim, 42, 21, 4, 1); R(g, CR.d, 98, 15, 4, 3);
    R(g, CR.trim, 2, 30, 6, 4); R(g, CR.trim, 124, 30, 6, 4);
    R(g, lit ? '#ffffff' : CR.lamp, 125, 22, 4, 4); R(g, CR.amber, 125, 27, 3, 2); R(g, '#ff2a2a', 4, 22, 3, 4);
    for (const cx of [28, 103]) { E(g, CR.trim, cx, 33, 12, 11); R(g, CR.b, cx - 14, 34, 28, 0); E(g, CR.tire, cx, 36, 9, 9); E(g, CR.rim, cx, 36, 5.5, 5.5); E(g, CR.rimS, cx + 1, 37, 3.5, 3.5); for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; Line(g, CR.rimS, 1, [[cx, 36], [cx + Math.cos(a) * 5, 36 + Math.sin(a) * 5]]); } E(g, CR.trim, cx, 36, 1.5, 1.5); }
  }, 66, 45), fx);
}
export function lowWall(w = 60) {
  return sprite(w, 22, ['#e9e1c9', '#c9bfa4', '#f6f0e0'], fn((g) => { R(g, '#e9e1c9', 0, 2, w, 20); R(g, '#f6f0e0', 0, 0, w, 3); R(g, '#c9bfa4', 0, 18, w, 4); for (let x = 10; x < w; x += 16) R(g, '#c9bfa4', x, 4, 1, 14); }, w / 2, 22));
}

// ================= v3: ramp-shaded sprites with selective outline =================
const NOSHADE = new Set(['skin', 'eye', 'blush', 'dark', 'pink', 'screen', 'phone', 'sweat']);
export const RAMP = {
  eye: ['#1a0c08', '#2e1810', '#6b3a20', '#b0703a', '#e0a060'],
  blush: ['#c86a64', '#e48a80', '#f39a90', '#f6b8a8', '#ffd0c4'],
  sweat: ['#3a6aa8', '#6aa0e0', '#a8d4ff', '#d4ecff', '#ffffff'],
  skin: ['#7a3e3a', '#b97a62', '#e6ad88', '#f3c9a3', '#ffe2c4'],
  hair: ['#4a4a5e', '#7f8294', '#b4b8c4', '#d6d9e0', '#f2f3f6'],
  coat: ['#5e4a3a', '#a68d6b', '#d6bf96', '#ead8b2', '#fbf0d6'],
  pants: ['#12142a', '#1d2240', '#2c3456', '#3d4870', '#56638c'],
  shoe: ['#2a1810', '#4a2c1a', '#6b4228', '#8a5a36', '#a87448'],
  scarf: ['#3e1218', '#6e2026', '#9e3230', '#c4493a', '#e06a50'],
  pack: ['#2a2c34', '#454852', '#636874', '#828896', '#a3a9b6'],
  fur: ['#5a2c12', '#9a5a22', '#cf8a3c', '#e6a85a', '#f6c97e'],
  wfur: ['#6e6070', '#b6aab0', '#e6dcd2', '#f6f0e6', '#ffffff'],
  mud: ['#2e1c10', '#4a3019', '#6b4a2b', '#8a6a48', '#a88a64'],
  mudw: ['#4a3424', '#7a6048', '#a88c6c', '#c4ab8a', '#dcc8a8'],
  dark: ['#0c0606', '#160e0c', '#22160f', '#3a2820', '#5a4436'],
  pink: ['#7a2638', '#c84a64', '#ff7a92', '#ff9cb0', '#ffc4d0'],
  phone: ['#08080c', '#101118', '#1c1e28', '#2c2f3c', '#3c4050'],
  screen: ['#2a6a8a', '#58b0d8', '#8fe0ff', '#c4f2ff', '#ffffff'],
};
const B = (m) => RAMP[m][2], SH = (m) => RAMP[m][1], LI = (m) => RAMP[m][3], HI = (m) => RAMP[m][4], DP = (m) => RAMP[m][0];
const EYEW = '#fbfbff';

export function sprite2(w, h, mats, draw, { rim = null, tint = null } = {}) {
  const Pd = 2, c = document.createElement('canvas'); c.width = w + Pd * 2; c.height = h + Pd * 2;
  const g = c.getContext('2d'); g.translate(Pd, Pd); draw(g);
  const W = c.width, H = c.height, img = g.getImageData(0, 0, W, H), d = img.data;
  const pal = []; // [rgb, mat, idx]
  for (const m of mats) RAMP[m].forEach((col, i) => pal.push([hex(col), m, i]));
  pal.push([hex(EYEW), null, 4]);
  const mat = new Array(W * H).fill(null), idx = new Int8Array(W * H).fill(-1), rgb = new Array(W * H);
  for (let i = 0; i < W * H; i++) {
    const a = d[i * 4 + 3]; if (a < 120) continue;
    const k = a < 255 ? Math.min(255 / a, 1.6) : 1, r = d[i * 4] * k, gg = d[i * 4 + 1] * k, b = d[i * 4 + 2] * k;
    let best = 0, bd = 1e9; pal.forEach((p, j) => { const dd = (p[0][0] - r) ** 2 + (p[0][1] - gg) ** 2 + (p[0][2] - b) ** 2; if (dd < bd) { bd = dd; best = j; } });
    mat[i] = pal[best][1] ?? '_eye'; idx[i] = pal[best][2]; rgb[i] = pal[best][0];
  }
  const at = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? -1 : y * W + x);
  // auto-shade base pixels: light from top-left
  const nidx = Int8Array.from(idx);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x; if (idx[i] !== 2 || !RAMP[mat[i]] || NOSHADE.has(mat[i])) continue;
    const diff = (j) => j < 0 || mat[j] === null || mat[j] !== mat[i];
    const empty = (j) => j < 0 || mat[j] === null;
    if (diff(at(x + 1, y)) || diff(at(x, y + 1))) nidx[i] = 1;
    else if (empty(at(x - 1, y)) || empty(at(x, y - 1))) nidx[i] = 3;
  }
  for (let i = 0; i < W * H; i++) if (mat[i] && RAMP[mat[i]]) rgb[i] = hex(RAMP[mat[i]][nidx[i]]);
  // selective outline
  const out = hex(OUT); const isOut = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x; if (mat[i]) continue;
    const L = at(x - 1, y), U = at(x, y - 1), Rr = at(x + 1, y), D = at(x, y + 1);
    const has = (j) => j >= 0 && mat[j];
    if (has(L) || has(U)) { rgb[i] = out; isOut[i] = 1; }
    else if (has(Rr) || has(D)) { const m = mat[has(Rr) ? Rr : D]; rgb[i] = RAMP[m] ? hex(RAMP[m][0]) : out; isOut[i] = 1; }
  }
  for (let i = 0; i < W * H; i++) {
    if (!mat[i] && !isOut[i]) { d[i * 4 + 3] = 0; continue; }
    let [r, gg, b] = rgb[i];
    if (tint && mat[i]) { r *= tint[0]; gg *= tint[1]; b *= tint[2]; }
    d[i * 4] = r; d[i * 4 + 1] = gg; d[i * 4 + 2] = b; d[i * 4 + 3] = 255;
  }
  if (rim) { const rc = hex(rim.color); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x; if (!mat[i]) continue; const j = at(x + rim.dx, y + rim.dy); if (j >= 0 && !mat[j]) for (let k = 0; k < 3; k++) d[i * 4 + k] = d[i * 4 + k] * (1 - rim.k) + rc[k] * rim.k; } }
  g.setTransform(1, 0, 0, 1, 0, 0); g.putImageData(img, 0, 0);
  c.anchor = [Pd + (draw.ax ?? w / 2), Pd + (draw.ay ?? h)];
  return c;
}
const OM = ['skin', 'hair', 'coat', 'pants', 'shoe', 'scarf', 'pack', 'dark', 'phone', 'screen'];

export function otavioFront2({ smile = false, fx } = {}) {
  return sprite2(44, 100, OM, fn((g) => {
    // shoes + legs
    for (const x of [12, 23]) { R(g, B('shoe'), x, 90, 9, 6); R(g, LI('shoe'), x + 1, 90, 5, 1); R(g, DP('shoe'), x, 95, 9, 1); }
    for (const x of [14, 23]) { R(g, B('pants'), x, 62, 7, 29); R(g, SH('pants'), x, 87, 7, 2); R(g, LI('pants'), x + 2, 66, 1, 20); }
    // sleeves + hands
    R(g, B('coat'), 4, 33, 6, 29); R(g, LI('coat'), 4, 34, 1, 26); R(g, DP('coat'), 4, 58, 6, 1);
    R(g, SH('coat'), 34, 33, 6, 29); R(g, DP('coat'), 34, 58, 6, 1);
    R(g, B('skin'), 4, 62, 6, 6); R(g, SH('skin'), 7, 66, 1, 2); R(g, SH('skin'), 34, 62, 6, 6);
    // coat body
    Poly(g, B('coat'), [[9, 32], [35, 32], [37, 76], [7, 76]]);
    Poly(g, SH('coat'), [[29, 32], [35, 32], [37, 76], [30, 76]]);
    R(g, SH('coat'), 7, 74, 30, 2);
    R(g, DP('coat'), 22, 46, 1, 30);
    Poly(g, LI('coat'), [[12, 32], [18, 32], [22, 46], [15, 40]]); Poly(g, B('coat'), [[26, 32], [32, 32], [29, 40], [22, 46]]);
    Poly(g, B('scarf'), [[17, 30], [27, 30], [22, 44]]); R(g, SH('scarf'), 24, 36, 4, 12); R(g, B('scarf'), 23, 36, 2, 10); R(g, LI('scarf'), 18, 31, 3, 1);
    R(g, SH('coat'), 8, 55, 28, 3); R(g, HI('pack'), 20, 55, 4, 3); R(g, DP('pack'), 21, 56, 2, 1);
    for (const [x, y] of [[18, 44], [18, 49], [25, 44], [25, 49]]) R(g, DP('coat'), x, y, 2, 2);
    R(g, SH('coat'), 10, 62, 7, 2); R(g, DP('coat'), 27, 62, 7, 2);
    R(g, LI('coat'), 9, 32, 6, 2); R(g, SH('coat'), 29, 32, 6, 2);
    R(g, B('pack'), 12, 33, 2, 16); R(g, SH('pack'), 30, 33, 2, 16);
    // neck + head
    R(g, SH('skin'), 19, 26, 6, 5);
    E(g, B('skin'), 22, 17, 9, 10); E(g, SH('skin'), 28, 19, 3, 7);
    R(g, SH('skin'), 12, 16, 2, 5); R(g, SH('skin'), 31, 16, 2, 5); R(g, DP('skin'), 31, 18, 1, 1);
    E(g, B('hair'), 22, 10, 10, 6); R(g, B('hair'), 12, 8, 3, 9); R(g, SH('hair'), 30, 8, 3, 9); R(g, B('hair'), 15, 11, 15, 2);
    R(g, SH('hair'), 24, 6, 7, 3); R(g, LI('hair'), 15, 7, 6, 1); R(g, HI('hair'), 17, 6, 3, 1); R(g, LI('hair'), 13, 10, 1, 4);
    R(g, SH('hair'), 15, 14, 5, 2); R(g, SH('hair'), 24, 14, 5, 2);
    R(g, EYEW, 15, 17, 1, 2); R(g, B('dark'), 16, 17, 2, 2); R(g, EYEW, 16, 17, 1, 1);
    R(g, B('dark'), 25, 17, 2, 2); R(g, EYEW, 27, 17, 1, 2); R(g, EYEW, 25, 17, 1, 1);
    R(g, SH('skin'), 15, 19, 4, 1); R(g, SH('skin'), 24, 19, 4, 1);
    R(g, SH('skin'), 22, 18, 2, 3); R(g, DP('skin'), 21, 21, 3, 1); R(g, LI('skin'), 20, 18, 1, 2);
    R(g, SH('skin'), 16, 21, 1, 2); R(g, SH('skin'), 28, 21, 1, 2);
    if (smile) { R(g, DP('skin'), 18, 23, 8, 1); R(g, DP('skin'), 17, 22, 1, 1); R(g, DP('skin'), 26, 22, 1, 1); R(g, SH('skin'), 20, 24, 4, 1); }
    else { R(g, DP('skin'), 19, 23, 6, 1); R(g, SH('skin'), 20, 24, 4, 1); }
  }, 22, 96), fx);
}

export function otavioSide2({ lean = 0, arm = 0.2, farArm = 0.1, head = 0, stride = 0.25, phone = true, shock = false, fx } = {}) {
  return sprite2(78, 110, OM, fn((g) => {
    g.translate(39, 106); g.rotate(lean);
    const limb = (ang, px, py, f) => { g.save(); g.translate(px, py); g.rotate(ang); f(); g.restore(); };
    const shoe = (dark) => { Poly(g, dark ? SH('shoe') : B('shoe'), [[-4, 28], [6, 28], [11, 31], [11, 34], [-4, 34]]); R(g, DP('shoe'), -4, 33, 15, 1); if (!dark) R(g, LI('shoe'), -2, 28, 6, 1); };
    limb(-stride, -1, -34, () => { R(g, SH('pants'), -4, 0, 8, 30); shoe(true); });
    limb(farArm, -2, -78, () => { R(g, SH('coat'), -3, 0, 7, 27); R(g, DP('coat'), -3, 24, 7, 1); R(g, SH('skin'), -3, 26, 6, 6); });
    // backpack
    R(g, B('pack'), -20, -80, 11, 27); R(g, LI('pack'), -20, -80, 11, 3); R(g, SH('pack'), -20, -66, 11, 8); R(g, DP('pack'), -20, -66, 11, 1);
    limb(stride, 1, -34, () => { R(g, B('pants'), -4, 0, 8, 30); R(g, LI('pants'), 2, 2, 1, 24); shoe(false); });
    // coat
    Poly(g, B('coat'), [[-10, -82], [8, -82], [12, -30], [-13, -30]]);
    Poly(g, SH('coat'), [[-10, -82], [-5, -82], [-8, -30], [-13, -30]]);
    Poly(g, LI('coat'), [[4, -80], [8, -80], [11, -32], [7, -32]]);
    R(g, SH('coat'), -13, -32, 25, 2);
    Line(g, DP('coat'), 1, [[8, -76], [11, -32]]);
    R(g, SH('coat'), -12, -58, 24, 3); R(g, HI('pack'), 7, -58, 3, 3);
    R(g, DP('coat'), 1, -48, 8, 2);
    R(g, B('pack'), -10, -82, 3, 15);
    Poly(g, LI('coat'), [[-7, -88], [5, -88], [8, -82], [-9, -82]]);
    R(g, B('scarf'), -6, -90, 13, 5); R(g, SH('scarf'), -6, -86, 13, 1); R(g, SH('scarf'), 5, -86, 4, 11); R(g, LI('scarf'), -4, -90, 5, 1);
    // head
    limb(head, 0, -90, () => {
      E(g, B('skin'), 1, -8, 8, 9);
      Poly(g, B('skin'), [[8, -10], [12, -6], [9, -4]]); R(g, B('skin'), 5, -1, 5, 2);
      R(g, SH('skin'), -3, -4, 7, 3);
      R(g, SH('skin'), -2, -10, 3, 5); R(g, DP('skin'), -1, -8, 1, 2);
      R(g, EYEW, 5, -10, 2, 2); R(g, B('dark'), 6, -10, 1, shock ? 3 : 2); if (shock) R(g, EYEW, 5, -11, 3, 1);
      R(g, SH('hair'), 4, -13, 4, 1); R(g, SH('skin'), 7, -7, 1, 1);
      if (shock) { E(g, DP('skin'), 7, -2, 2, 2); } else R(g, DP('skin'), 6, -2, 3, 1);
      E(g, B('hair'), -1, -14, 8, 5); R(g, B('hair'), -8, -15, 7, 11); R(g, SH('hair'), -8, -8, 6, 4); R(g, B('hair'), -1, -11, 2, 4);
      R(g, LI('hair'), -4, -18, 6, 1); R(g, HI('hair'), -2, -18, 3, 1); R(g, LI('hair'), -7, -14, 1, 4);
    });
    limb(arm, 0, -80, () => {
      R(g, B('coat'), -3, 0, 7, 27); R(g, LI('coat'), 2, 0, 2, 25); R(g, DP('coat'), -3, 24, 7, 1);
      R(g, B('skin'), -3, 26, 7, 6); R(g, LI('skin'), 2, 26, 1, 4);
      if (phone) { R(g, B('phone'), 0, 28, 5, 9); R(g, B('screen'), 1, 29, 3, 6); R(g, B('skin'), -1, 30, 2, 3); }
    });
  }, 39, 106), fx);
}

export function dogSide2({ pose = 'stand', muddy = false, fx } = {}) {
  const F = muddy ? 'mud' : 'fur', Wf = muddy ? 'mudw' : 'wfur';
  return sprite2(84, 62, [F, Wf, 'dark', 'pink', 'coat'], fn((g) => {
    g.translate(38, 56);
    g.rotate({ stand: 0, leap: -0.3, pull: 0.1, splash: -0.5 }[pose]);
    const [fa, ba] = { stand: [0, 0], leap: [-1.15, 1.05], pull: [-0.55, -0.3], splash: [-0.9, 0.8] }[pose];
    const leg = (x, y, ang, far, len = 16) => { g.save(); g.translate(x, y); g.rotate(ang); R(g, far ? SH(F) : B(F), -3, 0, 6, len); if (!far) R(g, LI(F), 2, 1, 1, len - 4); R(g, far ? SH(Wf) : B(Wf), -3, len - 2, 8, 4); R(g, DP(Wf), 1, len + 1, 1, 1); R(g, DP(Wf), 3, len + 1, 1, 1); g.restore(); };
    // tail
    const tail = pose === 'pull' ? [[-18, -28], [-25, -33], [-29, -30]] : [[-18, -30], [-25, -40], [-21, -49], [-14, -48]];
    Line(g, B(F), 5, tail); const tp = tail[tail.length - 1]; R(g, B(Wf), tp[0] - 1, tp[1] - 2, 4, 3);
    leg(12, -22, fa + 0.12, true); leg(-14, -22, ba - 0.12, true);
    // body
    E(g, B(F), -2, -27, 20, 9); E(g, LI(F), -4, -33, 14, 2); E(g, SH(F), -2, -20, 15, 3);
    E(g, B(F), -14, -25, 8, 8); E(g, SH(F), -11, -21, 5, 3);
    Poly(g, B(Wf), [[7, -36], [17, -30], [15, -18], [8, -20], [5, -28]]);
    for (let k = 0; k < 4; k++) R(g, SH(Wf), 9 + k * 2, -20 + (k % 2), 1, 2);
    leg(14, -21, fa, false); leg(-13, -20, ba, false, 15);
    // head
    g.save(); g.translate(18, -39); g.rotate(pose === 'pull' ? 0.3 : 0);
    Poly(g, SH(F), [[-8, -5], [-2, -8], [-4, 1], [-10, 3]]);
    E(g, B(F), 0, 0, 10, 9); E(g, LI(F), -1, -5, 6, 2); R(g, HI(F), -3, -7, 3, 1);
    Poly(g, B(F), [[-3, -6], [1, -19], [6, -5]]); Poly(g, SH(F), [[-1, -7], [1, -15], [3, -6]]); R(g, B('pink'), 0, -10, 1, 3);
    E(g, B(Wf), 3, 4, 7, 4);
    Poly(g, B(Wf), [[4, -2], [16, -1], [17, 4], [6, 7]]); R(g, LI(Wf), 6, -1, 6, 1);
    R(g, B('dark'), 15, -2, 4, 3); R(g, HI('dark'), 16, -2, 1, 1);
    R(g, B('dark'), 5, -4, 3, 3); R(g, EYEW, 5, -4, 1, 1); R(g, SH(F), 4, -7, 4, 1);
    const open = pose !== 'stand';
    if (open) { Poly(g, B('dark'), [[7, 5], [17, 4], [16, 9], [8, 9]]); R(g, B('pink'), 10, 7, 4, 2); R(g, B(Wf), 8, 9, 8, 2); R(g, EYEW, 15, 5, 1, 1); }
    else R(g, SH('dark'), 9, 5, 7, 1);
    if (pose === 'splash') { R(g, B('pink'), 12, 8, 3, 6); R(g, LI('pink'), 12, 8, 1, 4); }
    if (pose === 'pull') { Poly(g, B('coat'), [[12, 2], [26, -5], [28, 7], [14, 8]]); R(g, SH('coat'), 15, 5, 12, 2); }
    g.restore();
    if (muddy) for (const [x, y, r] of [[-12, -30, 3], [2, -22, 2], [-5, -33, 2], [9, -26, 2], [-16, -22, 3], [20, -42, 2]]) E(g, DP(F), x, y, r, r * 0.8);
  }, 38, 56), fx);
}

// ================= anime pixel style =================
function stamp(g, rows, x, y, map, flip = false) {
  rows.forEach((r, j) => [...r].forEach((ch, i) => { const c = map[ch]; if (!c) return; g.fillStyle = c; g.fillRect(x + (flip ? r.length - 1 - i : i), y + j, 1, 1); }));
}
const EYEMAP = { K: RAMP.eye[1], I: RAMP.eye[2], P: RAMP.eye[0], i: RAMP.eye[3], W: EYEW, H: EYEW, s: RAMP.skin[1] };
const EYE_KIND = ['KKKKKKK', 'WWIIHIW', 'WWIPPIW', '.WiiiiW', '..sssss'];
const EYE_SMILE = ['.......', '..KKKK.', '.K....K', '.......', '..sss..'];
const EYE_SIDE = ['KKKK', 'WIIH', 'WIPP', '.iii'];
const EYE_SIDE_DOWN = ['....', 'KKKK', 'WIPP', '.iii'];
const EYE_SHOCK = ['.KKK.', 'KWWWK', 'WWPWW', 'KWWWK', '.KKK.'];
const OMA = ['skin', 'hair', 'coat', 'pants', 'shoe', 'scarf', 'pack', 'dark', 'phone', 'screen', 'eye', 'blush', 'sweat'];
const clipTop = (g, yMax, f) => { g.save(); g.beginPath(); g.rect(-200, -400, 600, yMax + 400); g.clip(); f(); g.restore(); };

export function otavioFrontA({ smile = false, fx } = {}) {
  return sprite2(52, 108, OMA, fn((g) => {
    for (const x of [16, 27]) { R(g, B('pants'), x + 1, 86, 8, 12); R(g, LI('pants'), x + 3, 87, 1, 9); }
    for (const x of [15, 27]) { Poly(g, B('shoe'), [[x, 98], [x + 10, 98], [x + 11, 104], [x - 1, 104]]); R(g, LI('shoe'), x + 1, 98, 6, 1); R(g, DP('shoe'), x - 1, 104, 12, 1); }
    // sleeves & hands
    R(g, B('coat'), 5, 42, 7, 31); R(g, LI('coat'), 5, 43, 1, 28); R(g, SH('coat'), 40, 42, 7, 31); R(g, DP('coat'), 5, 70, 7, 1); R(g, DP('coat'), 40, 70, 7, 1);
    E(g, B('skin'), 8, 75, 4, 4); E(g, SH('skin'), 44, 75, 4, 4);
    // coat
    Poly(g, B('coat'), [[11, 40], [41, 40], [44, 88], [8, 88]]);
    Poly(g, SH('coat'), [[34, 40], [41, 40], [44, 88], [35, 88]]);
    Poly(g, LI('coat'), [[14, 40], [21, 40], [26, 56], [18, 48]]); Poly(g, B('coat'), [[31, 40], [38, 40], [34, 48], [26, 56]]);
    R(g, DP('coat'), 26, 56, 1, 32);
    Poly(g, B('scarf'), [[19, 38], [33, 38], [26, 54]]); R(g, LI('scarf'), 21, 38, 4, 1);
    R(g, B('scarf'), 28, 44, 4, 14); R(g, SH('scarf'), 31, 44, 1, 14); R(g, DP('scarf'), 28, 57, 4, 1);
    R(g, SH('coat'), 9, 64, 34, 3); R(g, HI('pack'), 24, 64, 4, 3); R(g, DP('pack'), 25, 65, 2, 1);
    for (const [x, y] of [[21, 52], [21, 58], [30, 52], [30, 58]]) R(g, DP('coat'), x, y, 2, 2);
    R(g, SH('coat'), 12, 72, 8, 2); R(g, DP('coat'), 32, 72, 8, 2); R(g, SH('coat'), 8, 86, 36, 2);
    R(g, B('pack'), 14, 41, 2, 17); R(g, SH('pack'), 36, 41, 2, 17);
    // neck + face
    R(g, SH('skin'), 22, 32, 8, 7);
    E(g, B('skin'), 26, 21, 11, 11); Poly(g, B('skin'), [[16, 26], [26, 36], [36, 26]]);
    Poly(g, SH('skin'), [[33, 18], [37, 22], [35, 29], [27, 35], [33, 27]]);
    R(g, SH('skin'), 14, 20, 2, 6); R(g, SH('skin'), 37, 20, 2, 6); R(g, DP('skin'), 37, 22, 1, 2);
    // hair
    clipTop(g, 17, () => E(g, B('hair'), 26, 14, 14, 11));
    for (const [a, b, tip] of [[13, 19, [15, 22]], [18, 25, [21, 19]], [24, 31, [28, 18]], [30, 37, [34, 20]], [35, 40, [38, 24]]]) Poly(g, B('hair'), [[a, 14], [b, 14], tip]);
    Poly(g, B('hair'), [[11, 12], [15, 12], [14, 26], [12, 24]]); Poly(g, SH('hair'), [[37, 12], [41, 12], [40, 24], [38, 26]]);
    Poly(g, SH('hair'), [[30, 5], [38, 9], [39, 14], [31, 12]]);
    for (const [x, w] of [[16, 4], [22, 4], [28, 3]]) { R(g, HI('hair'), x, 8, w, 1); R(g, LI('hair'), x - 1, 9, w + 1, 1); }
    // face details
    stamp(g, ['..HHHHH', 'HHHHH..'].map((r) => r), 16, 15, { H: SH('hair') }); stamp(g, ['HHHHH..', '..HHHHH'], 29, 15, { H: SH('hair') });
    stamp(g, smile ? EYE_SMILE : EYE_KIND, 16, 19, EYEMAP); stamp(g, smile ? EYE_SMILE : EYE_KIND, 29, 19, EYEMAP, true);
    R(g, SH('skin'), 15, 21, 1, 1); R(g, SH('skin'), 36, 21, 1, 1); // crow's feet
    R(g, SH('skin'), 26, 26, 1, 2); R(g, LI('skin'), 25, 26, 1, 1);
    R(g, B('blush'), 17, 26, 3, 1); R(g, B('blush'), 32, 26, 3, 1);
    if (smile) { R(g, DP('skin'), 23, 30, 6, 1); R(g, DP('skin'), 22, 29, 1, 1); R(g, DP('skin'), 29, 29, 1, 1); R(g, SH('skin'), 24, 31, 4, 1); }
    else { R(g, DP('skin'), 24, 30, 4, 1); }
  }, 26, 106), fx);
}

export function otavioSideA({ lean = 0, arm = 0.2, farArm = 0.1, head = 0, stride = 0.25, phone = true, shock = false, fx } = {}) {
  return sprite2(92, 126, OMA, fn((g) => {
    g.translate(46, 122); g.rotate(lean);
    const limb = (ang, px, py, f) => { g.save(); g.translate(px, py); g.rotate(ang); f(); g.restore(); };
    const shoe = (far) => { Poly(g, far ? SH('shoe') : B('shoe'), [[-4, 15], [6, 15], [12, 19], [12, 22], [-4, 22]]); R(g, DP('shoe'), -4, 21, 16, 1); if (!far) R(g, LI('shoe'), -2, 15, 6, 1); };
    limb(-stride, -1, -22, () => { R(g, SH('pants'), -4, 0, 8, 17); shoe(true); });
    limb(farArm, -2, -64, () => { R(g, SH('coat'), -3, 0, 7, 29); R(g, DP('coat'), -3, 27, 7, 1); E(g, SH('skin'), 0, 31, 4, 4); });
    R(g, B('pack'), -18, -66, 11, 26); R(g, LI('pack'), -18, -66, 11, 3); R(g, SH('pack'), -18, -52, 11, 8); R(g, DP('pack'), -18, -52, 11, 1);
    limb(stride, 1, -22, () => { R(g, B('pants'), -4, 0, 8, 17); R(g, LI('pants'), 2, 1, 1, 13); shoe(false); });
    Poly(g, B('coat'), [[-9, -68], [8, -68], [12, -20], [-12, -20]]);
    Poly(g, SH('coat'), [[-9, -68], [-4, -68], [-7, -20], [-12, -20]]);
    Poly(g, LI('coat'), [[4, -66], [8, -66], [11, -22], [7, -22]]);
    R(g, SH('coat'), -12, -22, 24, 2); Line(g, DP('coat'), 1, [[8, -63], [11, -22]]);
    R(g, SH('coat'), -11, -46, 22, 3); R(g, HI('pack'), 7, -46, 3, 3); R(g, DP('coat'), 1, -36, 8, 2);
    R(g, B('pack'), -9, -68, 3, 15);
    Poly(g, LI('coat'), [[-7, -74], [5, -74], [8, -68], [-9, -68]]);
    R(g, B('scarf'), -6, -76, 14, 6); R(g, LI('scarf'), -4, -76, 5, 1); R(g, B('scarf'), 6, -72, 4, 12); R(g, SH('scarf'), 9, -72, 1, 12);
    limb(head, 0, -76, () => {
      E(g, B('skin'), 2, -15, 10, 11); Poly(g, B('skin'), [[9, -16], [13, -12], [10, -10]]); Poly(g, B('skin'), [[0, -8], [10, -9], [7, -3], [2, -4]]);
      Poly(g, SH('skin'), [[-3, -10], [4, -5], [-2, -4]]);
      R(g, SH('skin'), -4, -17, 3, 6); R(g, DP('skin'), -3, -15, 1, 2);
      clipTop(g, -19, () => E(g, B('hair'), 0, -20, 11, 9));
      Poly(g, B('hair'), [[-9, -24], [-3, -24], [-5, -8], [-10, -12]]); Poly(g, B('hair'), [[-11, -18], [-6, -20], [-13, -10]]);
      for (const [a, b, tip] of [[2, 7, [5, -15]], [6, 11, [11, -16]], [-2, 3, [0, -15]]]) Poly(g, B('hair'), [[a, -20], [b, -20], tip]);
      Poly(g, SH('hair'), [[-9, -16], [-5, -16], [-6, -8], [-9, -10]]);
      R(g, HI('hair'), -4, -27, 4, 1); R(g, HI('hair'), 2, -27, 3, 1); R(g, LI('hair'), -5, -26, 10, 1);
      stamp(g, ['HHHHH'], 4, -19, { H: SH('hair') });
      stamp(g, shock ? EYE_SHOCK : head > 0.2 ? EYE_SIDE_DOWN : EYE_SIDE, shock ? 4 : 5, -17, EYEMAP);
      R(g, B('blush'), 4, -11, 3, 1);
      if (shock) { E(g, DP('skin'), 8, -6, 2, 2); R(g, B('sweat'), -6, -30, 2, 3); R(g, HI('sweat'), -6, -30, 1, 1); R(g, B('sweat'), 13, -24, 2, 3); }
      else R(g, DP('skin'), 7, -6, 3, 1);
    });
    limb(arm, 0, -66, () => {
      R(g, B('coat'), -3, 0, 7, 29); R(g, LI('coat'), 2, 1, 2, 26); R(g, DP('coat'), -3, 27, 7, 1);
      E(g, B('skin'), 0, 31, 4, 4);
      if (phone) { R(g, B('phone'), 1, 30, 5, 9); R(g, B('screen'), 2, 31, 3, 6); R(g, HI('screen'), 2, 31, 1, 1); E(g, B('skin'), 1, 33, 2, 2); }
    });
  }, 46, 122), fx);
}

const DOGEYE = ['.PPP.', 'PHHPP', 'PHPPP', 'PPPPi', 'PPPii', '.PPi.'];
const DOGEYE_HAPPY = ['.....', '.PPP.', 'P...P', '.....'];
const DOGEYE_FIERCE = ['PPPP.', '.HPPP', '.PPPi', '..Pi.'];
export function dogA({ pose = 'stand', muddy = false, fx } = {}) {
  const F = 'fur', Wf = muddy ? 'mudw' : 'wfur';
  const DM = { P: RAMP.dark[1], H: EYEW, i: RAMP.eye[3] };
  return sprite2(76, 64, [F, Wf, 'dark', 'pink', 'coat', 'blush', 'eye', 'mud'], fn((g) => {
    g.translate(32, 58);
    g.rotate({ stand: 0, leap: -0.28, pull: 0.08, splash: -0.45 }[pose]);
    const [fa, ba] = { stand: [0, 0], leap: [-1.2, 1.1], pull: [-0.6, -0.25], splash: [-0.9, 0.85] }[pose];
    const leg = (x, y, ang, far) => { g.save(); g.translate(x, y); g.rotate(ang); R(g, far ? SH(F) : B(F), -3, 0, 7, 11); if (!far) R(g, LI(F), 2, 1, 1, 7); R(g, far ? SH(Wf) : B(Wf), -3, 9, 8, 4); R(g, DP(Wf), 1, 12, 1, 1); R(g, DP(Wf), 3, 12, 1, 1); g.restore(); };
    const tail = pose === 'pull' ? [[-15, -24], [-22, -28], [-27, -25]] : [[-15, -24], [-22, -33], [-19, -42], [-11, -42]];
    Line(g, B(F), 8, tail); Line(g, LI(F), 2, tail.slice(0, 3).map(([x, y]) => [x + 1, y - 2])); const tp = tail[tail.length - 1]; E(g, B(Wf), tp[0], tp[1], 3, 3);
    leg(9, -15, fa + 0.12, true); leg(-12, -15, ba - 0.12, true);
    E(g, B(F), -2, -20, 16, 9); E(g, LI(F), -4, -26, 11, 2); E(g, SH(F), -2, -14, 12, 2);
    Poly(g, B(Wf), [[5, -28], [13, -24], [11, -12], [4, -14], [2, -22]]);
    for (let k = 0; k < 4; k++) R(g, SH(Wf), 5 + k * 2, -13 + (k % 2), 1, 2);
    leg(11, -14, fa, false); leg(-11, -13, ba, false);
    // big head
    g.save(); g.translate(14, -32); g.rotate(pose === 'pull' ? 0.28 : 0);
    Poly(g, SH(F), [[-11, -6], [-4, -11], [-6, 3], [-13, 5]]); R(g, DP(F), -12, 3, 3, 1);
    E(g, B(F), 0, 0, 13, 12); E(g, LI(F), -2, -7, 8, 2); R(g, HI(F), -5, -9, 4, 1);
    Poly(g, B(F), [[-4, -9], [0, -24], [7, -9]]); Poly(g, B('pink'), [[-1, -11], [0, -19], [4, -10]]);
    E(g, B(Wf), 5, 6, 8, 5); E(g, B(Wf), 12, 3, 6, 5); R(g, LI(Wf), 9, -1, 6, 1);
    R(g, B('dark'), 15, -2, 4, 3); R(g, HI('dark'), 16, -2, 1, 1);
    const eye = pose === 'splash' ? DOGEYE_HAPPY : pose === 'pull' ? DOGEYE_FIERCE : DOGEYE;
    stamp(g, eye, 2, pose === 'pull' ? -4 : -6, DM);
    if (pose === 'pull') R(g, DP(F), 1, -6, 6, 1); else R(g, SH(F), 2, -8, 5, 1);
    R(g, B('blush'), 3, 2, 3, 1);
    const open = pose !== 'stand';
    if (open) { Poly(g, B('dark'), [[8, 6], [17, 5], [16, 10], [9, 10]]); R(g, B('pink'), 10, 8, 5, 2); R(g, EYEW, 15, 6, 1, 1); R(g, EYEW, 10, 6, 1, 1); }
    else { R(g, SH('dark'), 11, 6, 2, 1); R(g, SH('dark'), 13, 7, 1, 1); R(g, SH('dark'), 14, 6, 2, 1); }
    if (pose === 'splash') { R(g, B('pink'), 12, 9, 3, 5); R(g, LI('pink'), 12, 9, 1, 3); }
    if (pose === 'pull') { Poly(g, B('coat'), [[12, 3], [27, -4], [29, 8], [14, 9]]); R(g, SH('coat'), 15, 6, 13, 2); }
    g.restore();
    if (muddy) for (const [x, y, r] of [[-10, -23, 4], [2, -16, 3], [-4, -27, 3], [-14, -15, 3], [16, -42, 3], [6, -36, 3], [22, -28, 2], [-20, -36, 3], [10, -8, 3], [-10, -6, 3]]) { E(g, B('mud'), x, y, r, r * 0.8); R(g, LI('mud'), x - 1, y - 1, 2, 1); }
  }, 32, 58), fx);
}

export function dogPortraitA({ bite = false, fx } = {}) {
  return sprite2(96, 88, ['fur', 'wfur', 'dark', 'pink', 'coat', 'blush', 'eye'], fn((g) => {
    Poly(g, SH('fur'), [[10, 30], [26, 18], [20, 56], [6, 60]]);
    E(g, B('fur'), 48, 48, 34, 32); E(g, LI('fur'), 44, 26, 22, 6); R(g, HI('fur'), 32, 22, 10, 2);
    Poly(g, B('fur'), [[52, 22], [64, -2], [78, 30]]); Poly(g, B('pink'), [[58, 22], [64, 6], [72, 26]]);
    Poly(g, SH('fur'), [[22, 18], [34, 14], [30, 34]]);
    E(g, B('wfur'), 50, 66, 26, 16); E(g, LI('wfur'), 46, 58, 14, 4);
    E(g, B('dark'), 50, 56, 7, 5); R(g, HI('dark'), 46, 53, 3, 2);
    for (const [cx, flip] of [[30, false], [68, true]]) {
      E(g, RAMP.dark[1], cx, 40, 9, 11); E(g, RAMP.eye[3], cx + (flip ? -1 : 1), 45, 6, 5); E(g, RAMP.dark[1], cx, 39, 7, 8);
      E(g, EYEW, cx - 3, 35, 3, 3); R(g, EYEW, cx + 3, 44, 2, 2);
      Poly(g, SH('fur'), flip ? [[cx - 10, 24], [cx + 8, 28], [cx + 8, 26], [cx - 10, 22]] : [[cx - 8, 28], [cx + 10, 24], [cx + 10, 22], [cx - 8, 26]]);
    }
    R(g, B('blush'), 18, 54, 7, 2); R(g, B('blush'), 74, 54, 7, 2);
    if (bite) { Poly(g, B('coat'), [[18, 70], [94, 62], [94, 80], [20, 82]]); R(g, SH('coat'), 20, 76, 74, 3); R(g, EYEW, 40, 68, 3, 4); R(g, EYEW, 60, 66, 3, 4); }
    else { R(g, DP('dark'), 44, 70, 5, 1); R(g, DP('dark'), 49, 71, 2, 1); R(g, DP('dark'), 51, 70, 5, 1); }
  }, 48, 88), fx);
}
