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
