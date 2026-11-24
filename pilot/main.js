import * as THREE from 'three';

await document.fonts.load('60px PS2P'); await document.fonts.load('40px Bangers');
// ---------- setup ----------
const W = 480, H = 270, S = 4; // render res, upscale
const MODE = new URLSearchParams(location.search).get('f') || 'A';
const NIGHT = MODE !== 'B' && MODE !== 'D';

let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const R = (a, b) => a + (b - a) * rnd();

const glCanvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas: glCanvas, antialias: false, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H, false);
renderer.shadowMap.enabled = !NIGHT;
renderer.shadowMap.type = THREE.BasicShadowMap;

const rt = new THREE.WebGLRenderTarget(W, H, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter });
rt.depthTexture = new THREE.DepthTexture(W, H);

const scene = new THREE.Scene();
scene.background = new THREE.Color(NIGHT ? 0x0b0d24 : 0x8fd0ff);
if (NIGHT) scene.fog = new THREE.Fog(0x14123a, 14, 42);

const P = {
  coat: 0xd9c29a, trousers: 0x2c3350, skin: 0xe6b48c, hair: 0xb9bcc2, pack: 0x6d727c,
  dog: 0xc98a3c, dogDark: 0x9a5f22, white: 0xf4efe6, mud: 0x6b4a2b,
  asphalt: NIGHT ? 0x1d1f2e : 0x4a4c57, stripe: 0xe8e8e8,
};
const lam = (c, o = {}) => new THREE.MeshLambertMaterial({ color: c, flatShading: true, ...o });
const emi = (c, i = 1) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(i) });
const box = (w, h, d, m) => { const g = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); g.castShadow = g.receiveShadow = true; return g; };
const at = (o, x, y, z) => { o.position.set(x, y, z); return o; };

function textTex(text, { w = 512, h = 128, font = '80px PS2P', fg = '#fff', bg = null, glow = null } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d');
  if (bg) { g.fillStyle = bg; g.fillRect(0, 0, w, h); }
  g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle';
  if (glow) { g.shadowColor = glow; g.shadowBlur = 24; }
  g.fillStyle = fg; g.fillText(text, w / 2, h / 2 + 4);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.magFilter = THREE.NearestFilter;
  return t;
}

// ---------- city ----------
function street() {
  const root = new THREE.Group();
  const road = new THREE.Mesh(new THREE.PlaneGeometry(80, 8), new THREE.MeshStandardMaterial({ color: P.asphalt, roughness: NIGHT ? 0.25 : 0.9, metalness: 0 }));
  road.rotation.x = -Math.PI / 2; road.receiveShadow = true; root.add(road);
  // crosswalk
  for (let z = -3.5; z <= 3.5; z += 1) root.add(at(box(2.6, 0.02, 0.5, lam(P.stripe)), 0, 0.01, z));
  // lane dashes
  for (let x = -40; x < 40; x += 4) if (Math.abs(x) > 3) root.add(at(box(2, 0.02, 0.12, lam(0xe0c040)), x, 0.01, 0));
  // sidewalks with pedra portuguesa
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
  g.fillStyle = '#e9e3d6'; g.fillRect(0, 0, 128, 128); g.strokeStyle = '#27242a'; g.lineWidth = 14;
  g.beginPath(); for (let x = 0; x <= 128; x++) g.lineTo(x, 64 + 26 * Math.sin(x / 128 * Math.PI * 2)); g.stroke();
  const tex = new THREE.CanvasTexture(c); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(30, 1.4); tex.colorSpace = THREE.SRGBColorSpace;
  for (const [z, d] of [[-5.75, 3.5], [5.5, 3]]) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(80, 0.18, d), lam(0xffffff, { map: tex, flatShading: false }));
    s.position.set(0, 0.09, z); s.receiveShadow = true; root.add(s);
    root.add(at(box(80, 0.2, 0.18, lam(0x9b9a95)), 0, 0.1, z > 0 ? 4.05 : -4.05));
  }
  // sobrados
  const cols = [0xf28c9a, 0xf5cf5b, 0x4fbfb4, 0xb79ce0, 0xf3a65a, 0x7fc77a, 0xe86f6f, 0x6aa9e9];
  let x = -26, i = 0;
  while (x < 26) {
    const w = R(4.2, 6), h = i % 3 === 1 ? 4.2 : 7;
    const col = cols[i % cols.length];
    const b = new THREE.Group(); b.position.set(x + w / 2, 0, -9.6);
    b.add(at(box(w, h, 4, lam(col)), 0, h / 2, 0));
    b.add(at(box(w + 0.2, 0.3, 4.3, lam(0xf3efe6)), 0, h + 0.15, 0));
    const floors = h > 5 ? 2 : 1;
    for (let f = 0; f < floors; f++) {
      const wy = 1.6 + f * 3.2;
      const n = Math.max(2, Math.floor(w / 1.8));
      for (let k = 0; k < n; k++) {
        const wx = -w / 2 + (k + 0.5) * (w / n);
        const lit = NIGHT && rnd() > 0.35;
        const win = box(0.8, f === 0 && k === 0 ? 2.1 : 1.2, 0.1, lit ? emi(rnd() > 0.5 ? 0xffc56b : 0xffe2a0) : lam(NIGHT ? 0x1b2140 : 0x2e4a72));
        b.add(at(win, wx, f === 0 && k === 0 ? 1.05 : wy, 2.03));
        b.add(at(box(1.0, 0.12, 0.25, lam(0xf3efe6)), wx, (f === 0 && k === 0 ? 0 : wy - 0.7), 2.08));
        if (f === 1) b.add(at(box(1.1, 0.06, 0.4, lam(0x333344)), wx, wy - 0.62, 2.2));
      }
    }
    // fake wires on facade
    root.add(b);
    x += w + 0.05; i++;
  }
  // padaria (shopfront + awning + neon)
  const pad = new THREE.Group(); pad.position.set(-3.5, 0, -7.55);
  const aw = document.createElement('canvas'); aw.width = 64; aw.height = 8; const ag = aw.getContext('2d');
  for (let k = 0; k < 8; k++) { ag.fillStyle = k % 2 ? '#fff' : '#d8343c'; ag.fillRect(k * 8, 0, 8, 8); }
  const awt = new THREE.CanvasTexture(aw); awt.magFilter = THREE.NearestFilter; awt.colorSpace = THREE.SRGBColorSpace;
  const awning = new THREE.Mesh(new THREE.BoxGeometry(5, 0.08, 1.4), lam(0xffffff, { map: awt }));
  awning.rotation.x = 0.35; awning.position.set(0, 2.9, 0.6); pad.add(awning);
  pad.add(at(box(4.2, 2.4, 0.1, NIGHT ? emi(0xffd38a, 1) : lam(0x6c86a8)), 0, 1.25, 0));
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 0.9), new THREE.MeshBasicMaterial({ map: textTex('PADARIA', { font: '64px PS2P', fg: NIGHT ? '#ff8fd0' : '#d8343c', bg: NIGHT ? '#1a0b20' : '#fff4d6', glow: NIGHT ? '#ff3cac' : null }), transparent: false }));
  sign.position.set(0, 3.75, 0.08); pad.add(sign);
  root.add(pad);
  if (NIGHT) {
    const neons = [['BAR', '#3cf2ff', 6.5, 3.4, 0x3cf2ff], ['HOTEL', '#ffe44a', 12, 5.6, 0xffd23c], ['FARMÁCIA', '#5dff7a', -12, 3.4, 0x40ff70]];
    for (const [t, c, nx, ny, lc] of neons) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(t.length * 0.62 + 0.6, 0.8), new THREE.MeshBasicMaterial({ map: textTex(t, { font: '60px PS2P', fg: c, bg: '#0a0a18', glow: c }) }));
      m.position.set(nx, ny, -7.5); root.add(m);
      const pl = new THREE.PointLight(lc, 18, 9, 1.6); pl.position.set(nx, ny, -6.5); root.add(pl);
      // wet road reflection streak
      const st = new THREE.Mesh(new THREE.PlaneGeometry(t.length * 0.4, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(0.45), transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
      st.rotation.x = -Math.PI / 2; st.position.set(nx, 0.03, -1.5); root.add(st);
    }
    const ps = new THREE.PointLight(0xff3cac, 22, 10, 1.6); ps.position.set(-3.5, 3.6, -6.3); root.add(ps);
    const st = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 7), new THREE.MeshBasicMaterial({ color: 0x8a2060, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false }));
    st.rotation.x = -Math.PI / 2; st.position.set(-3.5, 0.03, -1); root.add(st);
  }
  // poles + wires
  const tops = [];
  for (let px = -24; px <= 24; px += 8) {
    root.add(at(box(0.22, 7.5, 0.22, lam(0x8d8a84)), px, 3.75, -4.6));
    root.add(at(box(1.8, 0.12, 0.12, lam(0x8d8a84)), px, 7.0, -4.6));
    tops.push(new THREE.Vector3(px, 6.9, -4.6));
    // street lamp arm
    root.add(at(box(0.1, 0.1, 1.6, lam(0x8d8a84)), px + 0.3, 6.2, -3.9));
    root.add(at(box(0.4, 0.15, 0.3, emi(0xffb35a, NIGHT ? 1.4 : 0.6)), px + 0.3, 6.1, -3.1));
    if (NIGHT && Math.abs(px) < 18) { const sl = new THREE.PointLight(0xff9d3c, 26, 12, 1.5); sl.position.set(px + 0.3, 5.8, -3); root.add(sl); }
  }
  const wm = new THREE.LineBasicMaterial({ color: 0x111118 });
  for (let k = 0; k < tops.length - 1; k++) for (const dy of [0, -0.35, -0.7]) {
    const a = tops[k], b = tops[k + 1], pts = [];
    for (let s = 0; s <= 16; s++) { const t = s / 16; pts.push(new THREE.Vector3(a.x + (b.x - a.x) * t, a.y + dy - Math.sin(t * Math.PI) * 0.8, a.z)); }
    root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), wm));
  }
  // backdrop sky gradient
  const sk = document.createElement('canvas'); sk.width = 4; sk.height = 64; const sg = sk.getContext('2d');
  const gr = sg.createLinearGradient(0, 0, 0, 64);
  if (NIGHT) { gr.addColorStop(0, '#060716'); gr.addColorStop(0.7, '#241a4a'); gr.addColorStop(1, '#4a2550'); }
  else { gr.addColorStop(0, '#4aa7f0'); gr.addColorStop(1, '#cdeeff'); }
  sg.fillStyle = gr; sg.fillRect(0, 0, 4, 64);
  const skt = new THREE.CanvasTexture(sk); skt.colorSpace = THREE.SRGBColorSpace;
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(160, 50), new THREE.MeshBasicMaterial({ map: skt, fog: false }));
  sky.position.set(0, 20, -30); root.add(sky);
  if (!NIGHT) for (let k = 0; k < 7; k++) {
    const cl = new THREE.Group(); cl.position.set(R(-40, 40), R(13, 20), -28);
    for (let j = 0; j < 4; j++) cl.add(at(box(R(2, 4), R(1, 1.6), 1, emi(0xffffff)), j * 1.8, R(-0.3, 0.4), 0));
    root.add(cl);
  }
  return root;
}

// ---------- characters ----------
function otavio({ lean = 0, headDown = 0, armR = -0.3, armL = 0.1, phone = true, phoneFly = null, smile = false } = {}) {
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
  body.rotation.x = lean;
  for (const s of [-1, 1]) {
    body.add(at(box(0.17, 0.8, 0.19, lam(P.trousers)), s * 0.11, 0.4, 0));
    body.add(at(box(0.19, 0.1, 0.3, lam(0x3a2618)), s * 0.11, 0.05, 0.05));
  }
  const coat = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.36, 0.88, 8), lam(P.coat)); coat.castShadow = true;
  body.add(at(coat, 0, 1.12, 0));
  body.add(at(box(0.66, 0.16, 0.36, lam(P.coat)), 0, 1.52, 0));
  body.add(at(box(0.3, 0.1, 0.3, lam(0x8a3a2e)), 0, 1.6, 0.02)); // scarf
  body.add(at(box(0.44, 0.58, 0.2, lam(P.pack)), 0, 1.2, -0.3));
  const head = new THREE.Group(); head.position.set(0, 1.72, 0); head.rotation.x = headDown; body.add(head);
  head.add(box(0.26, 0.3, 0.27, lam(P.skin)));
  head.add(at(box(0.29, 0.09, 0.3, lam(P.hair)), 0, 0.17, -0.01));
  head.add(at(box(0.29, 0.16, 0.06, lam(P.hair)), 0, 0.06, -0.13));
  for (const s of [-1, 1]) head.add(at(box(0.045, 0.045, 0.02, lam(0x1a1210)), s * 0.06, 0.03, 0.14));
  head.add(at(box(smile ? 0.11 : 0.08, 0.025, 0.02, lam(smile ? 0x8a2a22 : 0x6a3a30)), 0, -0.08, 0.14));
  const arms = [];
  for (const [s, a] of [[1, armR], [-1, armL]]) {
    const piv = new THREE.Group(); piv.position.set(s * 0.37, 1.55, 0); piv.rotation.x = a; body.add(piv);
    piv.add(at(box(0.13, 0.68, 0.14, lam(P.coat)), 0, -0.32, 0));
    piv.add(at(box(0.1, 0.12, 0.1, lam(P.skin)), 0, -0.7, 0));
    arms.push(piv);
  }
  if (phone) {
    const ph = new THREE.Group(); ph.name = 'phone';
    ph.add(box(0.08, 0.15, 0.02, lam(0x111111)));
    ph.add(at(box(0.065, 0.12, 0.01, emi(0x9fd8ff, 1.3)), 0, 0, 0.012));
    if (phoneFly) { ph.position.copy(phoneFly); ph.rotation.set(0.8, 0.5, 1.2); g.add(ph); }
    else { ph.position.set(0, -0.74, 0.07); ph.rotation.x = -1.0; arms[0].add(ph); }
  }
  g.userData.head = head; g.userData.phone = g.getObjectByName('phone') || head;
  return g;
}

function dog({ pose = 'stand', muddy = false } = {}) {
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
  const C = muddy ? 0x8a5a2c : P.dog;
  const M = (c) => lam(c);
  body.add(at(box(0.34, 0.3, 0.72, M(C)), 0, 0, 0));
  body.add(at(box(0.3, 0.22, 0.2, M(muddy ? 0x7a5a3a : P.white)), 0, -0.07, 0.28));
  const head = new THREE.Group(); head.position.set(0, 0.2, 0.42); body.add(head);
  head.add(box(0.3, 0.27, 0.28, M(C)));
  head.add(at(box(0.18, 0.12, 0.2, M(muddy ? 0x9a7a58 : P.white)), 0, -0.07, 0.2));
  head.add(at(box(0.07, 0.05, 0.04, M(0x111111)), 0, -0.03, 0.31));
  const jaw = new THREE.Group(); jaw.position.set(0, -0.12, 0.1); head.add(jaw);
  jaw.add(at(box(0.15, 0.05, 0.2, M(muddy ? 0x9a7a58 : P.white)), 0, 0, 0.08));
  for (const s of [-1, 1]) {
    head.add(at(box(0.05, 0.05, 0.02, M(0x2a160a)), s * 0.08, 0.05, 0.145));
    head.add(at(box(0.02, 0.02, 0.01, emi(0xffffff)), s * 0.08 + 0.01, 0.06, 0.156));
  }
  const earUp = box(0.08, 0.17, 0.06, M(P.dogDark)); earUp.position.set(0.1, 0.2, -0.04); earUp.rotation.z = -0.15; head.add(earUp);
  const earFold = box(0.08, 0.14, 0.05, M(P.dogDark)); earFold.position.set(-0.17, 0.08, -0.03); earFold.rotation.z = 0.9; head.add(earFold);
  const legs = [];
  for (const [lx, lz] of [[0.11, 0.26], [-0.11, 0.26], [0.11, -0.26], [-0.11, -0.26]]) {
    const piv = new THREE.Group(); piv.position.set(lx, -0.1, lz); body.add(piv);
    piv.add(at(box(0.09, 0.36, 0.1, M(C)), 0, -0.17, 0));
    piv.add(at(box(0.1, 0.06, 0.13, M(muddy ? 0x5a3c22 : P.white)), 0, -0.35, 0.02));
    legs.push(piv);
  }
  const tail = new THREE.Group(); tail.position.set(0, 0.08, -0.36); body.add(tail);
  tail.add(at(box(0.07, 0.07, 0.3, M(C)), 0, 0, -0.14));
  if (muddy) for (let k = 0; k < 9; k++) body.add(at(box(R(0.08, 0.18), R(0.06, 0.12), R(0.08, 0.2), M(P.mud)), R(-0.16, 0.16), R(-0.1, 0.16), R(-0.34, 0.34)));
  // poses
  body.position.y = 0.52;
  tail.rotation.x = 0.7;
  if (pose === 'leap') {
    body.rotation.x = -0.35; body.position.y = 0.95;
    legs[0].rotation.x = legs[1].rotation.x = -1.3; legs[2].rotation.x = legs[3].rotation.x = 1.1;
    jaw.rotation.x = 0.5; tail.rotation.x = 0.1; head.rotation.x = 0.25;
  } else if (pose === 'pull') {
    body.rotation.x = 0.18; body.position.y = 0.46;
    legs[0].rotation.x = legs[1].rotation.x = -0.6; legs[2].rotation.x = legs[3].rotation.x = -0.5;
    jaw.rotation.x = 0.35; head.rotation.x = -0.35; tail.rotation.x = 0.2;
  } else if (pose === 'splash') {
    body.rotation.x = -0.2; body.position.y = 0.75;
    legs[0].rotation.x = legs[1].rotation.x = -0.9; legs[2].rotation.x = legs[3].rotation.x = 0.8;
    jaw.rotation.x = 0.45; tail.rotation.x = 1.0;
    jaw.add(at(box(0.08, 0.02, 0.14, M(0xff6f8a)), 0, 0.03, 0.12)); // tongue
  }
  g.userData.head = head;
  return g;
}

function car(color = 0x3a6fd8) {
  const g = new THREE.Group();
  g.add(at(box(1.8, 0.55, 4.1, lam(color)), 0, 0.6, 0));
  g.add(at(box(1.6, 0.5, 2.0, lam(color)), 0, 1.12, -0.25));
  g.add(at(box(1.62, 0.36, 1.6, lam(0x16203a)), 0, 1.13, -0.25));
  g.add(at(box(1.82, 0.1, 4.12, lam(0xd8d8d8)), 0, 0.42, 0));
  for (const [x, z] of [[0.85, 1.35], [-0.85, 1.35], [0.85, -1.35], [-0.85, -1.35]]) {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.24, 10), lam(0x151515)); w.rotation.z = Math.PI / 2; w.position.set(x, 0.33, z); g.add(w);
  }
  for (const s of [-1, 1]) {
    g.add(at(box(0.42, 0.18, 0.06, emi(0xfffbe8, 2)), s * 0.62, 0.68, 2.06));
    g.add(at(box(0.4, 0.14, 0.06, emi(0xff2a2a, 1.4)), s * 0.62, 0.7, -2.06));
    if (NIGHT) {
      const beam = new THREE.Mesh(new THREE.ConeGeometry(1.6, 9, 12, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff2c0, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
      beam.rotation.x = -Math.PI / 2; beam.position.set(s * 0.62, 0.6, 6.5); g.add(beam);
      const sp = new THREE.SpotLight(0xfff2d0, 90, 22, 0.45, 0.5, 1.2); sp.position.set(s * 0.62, 0.7, 2.1);
      sp.target.position.set(s * 0.62, 0, 10); g.add(sp, sp.target);
    }
  }
  return g;
}

function rain(center, n = 2600, spread = [18, 9, 14]) {
  const pos = [];
  for (let k = 0; k < n; k++) {
    const x = center.x + R(-spread[0], spread[0]), y = R(0, spread[1]), z = center.z + R(-spread[2], spread[2]);
    pos.push(x, y, z, x + 0.06, y - 0.42, z + 0.02);
  }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  return new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: 0x9ab8ff, transparent: true, opacity: 0.55 }));
}

function particles(n, center, rad, color, size = [0.04, 0.1], up = 1) {
  const g = new THREE.Group();
  for (let k = 0; k < n; k++) {
    const a = R(0, Math.PI * 2), r = R(0.2, rad);
    const m = new THREE.Mesh(new THREE.IcosahedronGeometry(R(size[0], size[1]), 0), lam(color));
    m.position.set(center.x + Math.cos(a) * r, center.y + R(0, rad * up) * (1 - r / rad / 1.5), center.z + Math.sin(a) * r * 0.7);
    g.add(m);
  }
  return g;
}

function pigeon(x, y, z, flap) {
  const g = new THREE.Group(); g.position.set(x, y, z);
  const b = new THREE.Mesh(new THREE.SphereGeometry(0.16, 6, 4), lam(0x8d93a6)); b.scale.set(1, 0.8, 1.5); g.add(b);
  g.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 4), lam(0x5a6a8a)), 0, 0.1, 0.2));
  for (const s of [-1, 1]) { const w = box(0.4, 0.03, 0.2, lam(0xa6abbb)); w.position.set(s * 0.22, 0.05, 0); w.rotation.z = s * flap; g.add(w); }
  g.rotation.y = R(-1, 1);
  return g;
}

function cat() {
  const g = new THREE.Group(), C = 0x4a4a55;
  g.add(at(box(0.22, 0.2, 0.42, lam(C)), 0, 0.2, 0));
  const h = new THREE.Group(); h.position.set(0, 0.38, 0.2); g.add(h);
  h.add(box(0.22, 0.19, 0.18, lam(C)));
  for (const s of [-1, 1]) {
    const e = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.1, 4), lam(C)); e.position.set(s * 0.07, 0.13, 0); h.add(e);
    h.add(at(box(0.05, 0.02, 0.02, emi(0xb8ff3c)), s * 0.05, 0.02, 0.095));
  }
  for (const [x, z] of [[0.07, 0.15], [-0.07, -0.15], [0.07, -0.15]]) g.add(at(box(0.06, 0.12, 0.06, lam(C)), x, 0.06, z));
  const paw = box(0.06, 0.06, 0.24, lam(C)); paw.position.set(-0.08, 0.32, 0.32); paw.rotation.x = -0.6; g.add(paw);
  const t = box(0.05, 0.4, 0.05, lam(C)); t.position.set(0, 0.42, -0.22); t.rotation.x = -0.3; g.add(t);
  return g;
}

// ---------- scenes ----------
const panels = []; // {rect:[x,y,w,h] in overlay px, cam}
const ov = { }; // anchors for overlay
const city = street(); scene.add(city);

function addLights() {
  if (NIGHT) {
    scene.add(new THREE.HemisphereLight(0x5a6ad8, 0x20142a, 1.1));
  } else {
    scene.add(new THREE.HemisphereLight(0xd7efff, 0xb89a70, 1.6));
    const sun = new THREE.DirectionalLight(0xfff0d0, 3.2); sun.position.set(-8, 14, 9); sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 12, bottom: -12, near: 1, far: 50 });
    scene.add(sun);
  }
}
addLights();

const cam = (fov, pos, look) => { const c = new THREE.PerspectiveCamera(fov, 1, 0.1, 120); c.position.copy(pos); c.lookAt(look); return c; };
const V = (x, y, z) => new THREE.Vector3(x, y, z);

const key = (c, i, x, y, z) => { if (!NIGHT) return; const l = new THREE.PointLight(c, i, 8, 1.4); l.position.set(x, y, z); scene.add(l); };
if (MODE === 'A') {
  const o = otavio({ headDown: 0.6, armR: -0.95, armL: 0.05 }); o.position.set(0, 0, -0.3); o.rotation.y = -0.25; scene.add(o);
  const d = dog({ pose: 'leap' }); d.position.set(0.98, -0.22, -0.3); d.rotation.y = -Math.PI / 2; scene.add(d);
  const c = car(0xd8343c); c.position.set(-4.6, 0, -1.6); c.rotation.y = Math.PI / 2 + 0.22; scene.add(c);
  scene.add(rain(V(0, 0, 2)));
  key(0xffb070, 6, 1.5, 2.6, 1.2); key(0xff4fc0, 4, -1.5, 1.8, 0.5);
  scene.updateMatrixWorld(true);
  const hd = d.userData.head.getWorldPosition(V()), ph = o.userData.phone.getWorldPosition(V());
  const main = cam(44, V(0.7, 0.85, 5.4), V(-0.6, 1.0, -0.5));
  const eye = cam(30, hd.clone().add(V(-0.45, 0.06, 0.5)), hd);
  const hand = cam(34, ph.clone().add(V(0.18, 0.42, 0.5)), ph);
  panels.push({ rect: [0, 0, 1240, 1080], cam: main }, { rect: [1256, 0, 664, 532], cam: eye }, { rect: [1256, 548, 664, 532], cam: hand });
  ov.dogHead = () => d.userData.head.getWorldPosition(V());
  ov.car = () => c.localToWorld(V(0, 0.7, 2.1));
}
if (MODE === 'B') {
  const d = dog({ pose: 'splash', muddy: true }); d.position.set(-1.0, 0, 1.2); d.rotation.y = 0.55; scene.add(d);
  const pud = new THREE.Mesh(new THREE.CircleGeometry(1.4, 12), new THREE.MeshLambertMaterial({ color: 0x7a5a3c })); pud.rotation.x = -Math.PI / 2; pud.scale.set(1.3, 0.8, 1); pud.position.set(-1.0, 0.02, 1.2); scene.add(pud);
  for (const [px, pz, s] of [[3, -2.5, 1], [-6, -1, 1.4], [5, 2.4, 0.9], [-3.5, -3, 0.8]]) {
    const p = new THREE.Mesh(new THREE.CircleGeometry(1, 10), new THREE.MeshBasicMaterial({ color: 0xa9dcff })); p.rotation.x = -Math.PI / 2; p.scale.set(1.6 * s, s, 1); p.position.set(px, 0.025, pz); scene.add(p);
  }
  scene.add(particles(46, V(-1.0, 0.3, 1.2), 1.5, P.mud, [0.04, 0.11], 1.2));
  scene.add(particles(18, V(-1.0, 0.4, 1.2), 1.2, 0xbfe4ff, [0.03, 0.07], 1.4));
  for (let k = 0; k < 8; k++) scene.add(pigeon(R(-6, -2.2), R(2.6, 4.8), R(-3.2, -1.2), R(-0.9, 0.9)));
  const can = new THREE.Group(); can.position.set(2.4, 0.33, 0.2); can.rotation.set(0.2, 0.5, Math.PI / 2);
  can.add(new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.28, 0.85, 10), lam(0xf07a1e)));
  can.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.06, 10), lam(0x2b8a3a)), 0, 0.45, 0));
  scene.add(can);
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.05, 10), lam(0x2b8a3a)); lid.position.set(1.05, 1.65, 1.6); lid.rotation.set(1.1, 0, 0.6); scene.add(lid);
  for (let k = 0; k < 8; k++) { const t = box(R(0.1, 0.2), 0.02, R(0.1, 0.2), lam([0xffffff, 0xe7d38a, 0xd8343c][k % 3])); t.position.set(R(1.4, 3.6), 0.05 + (k % 3) * 0.25, R(-0.4, 1.0)); t.rotation.set(R(0, 3), R(0, 3), 0); scene.add(t); }
  scene.add(at(box(3.4, 1.1, 0.4, lam(0xe9e1c9)), 4.6, 0.73, -4.6));
  const ct = cat(); ct.position.set(4.2, 1.28, -4.6); ct.rotation.y = -0.9; ct.scale.setScalar(1.3); scene.add(ct);
  const o = otavio({ phone: false, armR: 0.25, armL: -0.15, smile: true }); o.position.set(-3.6, 0.18, -5.2); o.rotation.y = 0.45; scene.add(o);
  const main = cam(46, V(0.9, 1.25, 4.6), V(0.2, 1.35, -2.2));
  panels.push({ rect: [0, 0, 1920, 1080], cam: main });
  ov.dogHead = () => d.userData.head.getWorldPosition(V());
  ov.cat = () => ct.localToWorld(V(0, 0.45, 0.2));
  ov.can = () => can.getWorldPosition(V());
  ov.pigeons = () => V(-4.2, 4.6, -2.2);
  ov.otavio = () => o.userData.head.getWorldPosition(V());
}
if (MODE === 'C') {
  const o = otavio({ lean: -0.27, armR: -2.6, armL: -0.5, headDown: -0.35, phoneFly: V(0.1, 2.35, -1.2), smile: false }); o.position.set(0, 0, -0.5); o.rotation.y = Math.PI; scene.add(o);
  const d = dog({ pose: 'pull' }); d.position.set(0, 0, 0.42); d.rotation.y = Math.PI; scene.add(d);
  const c = car(0xd8343c); c.position.set(-3.3, 0, -2.1); c.rotation.y = Math.PI / 2 + 0.35; scene.add(c);
  scene.add(rain(V(0, 0, 0), 2600, [12, 9, 10]));
  scene.add(particles(70, V(-1.6, 0.25, -2.4), 1.5, 0xcfe0ff, [0.03, 0.08], 1.4));
  key(0xffb070, 7, 2.5, 2.4, 1.0); key(0x6fb0ff, 4, 1.5, 2.5, -1.5);
  scene.updateMatrixWorld(true);
  const hd = d.userData.head.getWorldPosition(V());
  const main = cam(42, V(5.4, 0.85, 0.7), V(-0.6, 1.0, -0.7));
  const close = cam(30, hd.clone().add(V(1.25, 0.15, 0.15)), hd.clone().add(V(0, 0.05, -0.2)));
  panels.push({ rect: [0, 0, 1920, 1080], cam: main }, { rect: [1330, 600, 540, 420], cam: close });
  ov.car = () => c.localToWorld(V(0, 1.0, 2.0));
  ov.dogHead = () => d.userData.head.getWorldPosition(V());
}
if (MODE === 'D') {
  const poses = ['stand', 'leap', 'pull', 'splash'];
  poses.forEach((p, i) => { const d = dog({ pose: p }); d.position.set(-3 + i * 2, 0, 2); d.rotation.y = -Math.PI / 2; scene.add(d); });
  const o = otavio({}); o.position.set(5, 0, 2); scene.add(o);
  panels.push({ rect: [0, 0, 1920, 1080], cam: cam(30, V(0.8, 1.2, 9.5), V(0.8, 0.8, 2)) });
}
// ---------- post (pixel shader: dither + quantize + depth outline) ----------
const post = new THREE.ShaderMaterial({
  uniforms: { tC: { value: rt.texture }, tD: { value: rt.depthTexture }, px: { value: new THREE.Vector2(1 / W, 1 / H) }, L: { value: 7.0 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }',
  fragmentShader: `
    uniform sampler2D tC, tD; uniform vec2 px; uniform float L; varying vec2 vUv;
    float ld(float d){ float n=0.1, f=120.0; float z=d*2.0-1.0; return 2.0*n*f/(f+n-z*(f-n)); }
    float bayer(vec2 p){ int x=int(mod(p.x,4.)), y=int(mod(p.y,4.)); int i=x+y*4;
      int m[16]=int[16](0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5); return (float(m[i])+0.5)/16.0; }
    void main(){
      vec3 c = texture2D(tC, vUv).rgb;
      c = pow(max(c, 0.0), vec3(1.0/2.2));
      float l = dot(c, vec3(0.299,0.587,0.114)); c = mix(vec3(l), c, 1.22);
      float d = ld(texture2D(tD, vUv).x);
      float e = 0.0;
      for (int k=0;k<4;k++){ vec2 o = k==0?vec2(px.x,0):k==1?vec2(-px.x,0):k==2?vec2(0,px.y):vec2(0,-px.y);
        e = max(e, (ld(texture2D(tD, vUv+o).x) - d)); }
      c = floor(clamp(c,0.,1.)*(L-1.0) + bayer(gl_FragCoord.xy)) / (L-1.0);
      if (e > 0.06*d + 0.05) c = vec3(0.05,0.04,0.09);
      gl_FragColor = vec4(c,1.0);
    }`,
});
const postScene = new THREE.Scene(); postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), post));
const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

function renderAll() {
  renderer.setRenderTarget(rt);
  renderer.setScissorTest(true);
  for (const p of panels) {
    const [x, y, w, h] = p.rect.map((v) => Math.round(v / S));
    const gy = H - y - h;
    p.cam.aspect = w / h; p.cam.updateProjectionMatrix();
    renderer.setViewport(x, gy, w, h); renderer.setScissor(x, gy, w, h);
    renderer.render(scene, p.cam);
  }
  renderer.setScissorTest(false);
  renderer.setRenderTarget(null);
  renderer.setViewport(0, 0, W, H);
  renderer.render(postScene, postCam);
}

// ---------- comic overlay ----------
const ctx = document.getElementById('ov').getContext('2d');
function toScreen(v, p) {
  const n = v.clone().project(p.cam); const [x, y, w, h] = p.rect;
  return [x + (n.x + 1) / 2 * w, y + (1 - n.y) / 2 * h];
}
function panelFrames() {
  if (panels.length < 2) { ctx.lineWidth = 16; ctx.strokeStyle = '#111'; ctx.strokeRect(8, 8, 1904, 1064); }
  for (const p of panels) {
    const [x, y, w, h] = p.rect;
    if (panels.indexOf(p) > 0 && MODE === 'C') { ctx.lineWidth = 28; ctx.strokeStyle = '#fff'; ctx.strokeRect(x - 9, y - 9, w + 18, h + 18); }
    ctx.lineWidth = 10; ctx.strokeStyle = '#111'; ctx.strokeRect(x + 5, y + 5, w - 10, h - 10);
  }
}
function halftone(x, y, w, h, color = 'rgba(10,10,30,0.55)', step = 14, from = 'tl') {
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.fillStyle = color;
  for (let yy = y; yy < y + h; yy += step) for (let xx = x; xx < x + w; xx += step) {
    const ox = (Math.floor((yy - y) / step) % 2) * step / 2;
    let t = from === 'tl' ? 1 - Math.hypot(xx - x, yy - y) / Math.hypot(w, h) : 1 - Math.hypot(x + w - xx, y + h - yy) / Math.hypot(w, h);
    const r = Math.max(0, t * t * step * 0.55);
    if (r > 0.5) { ctx.beginPath(); ctx.arc(xx + ox, yy, r, 0, 7); ctx.fill(); }
  }
  ctx.restore();
}
function speedLines(cx, cy, rect, n = 70, inner = 260, color = 'rgba(255,255,255,0.85)') {
  const [x, y, w, h] = rect; ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.fillStyle = color;
  for (let k = 0; k < n; k++) {
    const a = (k / n) * Math.PI * 2 + R(-0.03, 0.03), r0 = inner + R(0, 120), r1 = 2400, wd = R(0.004, 0.012);
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
    ctx.lineTo(cx + Math.cos(a - wd) * r1, cy + Math.sin(a - wd) * r1); ctx.lineTo(cx + Math.cos(a + wd) * r1, cy + Math.sin(a + wd) * r1); ctx.fill();
  }
  ctx.restore();
}
function caption(x, y, text, size = 52, rot = -0.02) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `${size}px Bangers`;
  const w = ctx.measureText(text).width + 52, h = size + 36;
  ctx.fillStyle = '#111'; ctx.fillRect(10, 10, w, h);
  ctx.fillStyle = '#ffd84a'; ctx.fillRect(0, 0, w, h); ctx.lineWidth = 6; ctx.strokeStyle = '#111'; ctx.strokeRect(0, 0, w, h);
  ctx.fillStyle = '#111'; ctx.textBaseline = 'middle'; ctx.fillText(text, 26, h / 2 + 3); ctx.restore();
}
function balloon(cx, cy, w, h, tx, ty, draw) {
  ctx.save(); ctx.lineWidth = 7; ctx.strokeStyle = '#111'; ctx.fillStyle = '#fff';
  const tail = () => { ctx.beginPath(); ctx.moveTo(cx - w * 0.12, cy + h * 0.3); ctx.lineTo(tx, ty); ctx.lineTo(cx + w * 0.08, cy + h * 0.36); ctx.closePath(); };
  tail(); ctx.stroke(); ctx.beginPath(); ctx.ellipse(cx, cy, w / 2, h / 2, 0, 0, 7); ctx.stroke();
  tail(); ctx.fill(); ctx.beginPath(); ctx.ellipse(cx, cy, w / 2, h / 2, 0, 0, 7); ctx.fill();
  draw && draw(); ctx.restore();
}
const ICONS = {
  heart: ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...'],
  star: ['...X...', '..XXX..', 'XXXXXXX', '.XXXXX.', '.XX.XX.', 'X.....X'],
  anger: ['.X...X.', 'XX...XX', '.......', '.......', 'XX...XX', '.X...X.'],
  bang: ['XX.XX', 'XX.XX', 'XX.XX', 'XX.XX', '.....', 'XX.XX'],
  sweat: ['..X..', '.XXX.', 'XXXXX', 'XXXXX', '.XXX.'],
};
function icon(name, cx, cy, sz, color) {
  const rows = ICONS[name]; const w = rows[0].length, h = rows.length;
  ctx.fillStyle = color;
  rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch === 'X') ctx.fillRect(cx + (i - w / 2) * sz, cy + (j - h / 2) * sz, sz, sz); }));
}
function iconBalloon(cx, cy, tx, ty, name, color) { balloon(cx, cy, 170, 130, tx, ty, () => icon(name, cx, cy, 14, color)); }
function speech(cx, cy, tx, ty, lines, size = 46) {
  ctx.font = `${size}px Bangers`; const w = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 110, h = lines.length * size * 1.1 + 70;
  balloon(cx, cy, w, h, tx, ty, () => { ctx.fillStyle = '#111'; ctx.font = `${size}px Bangers`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    lines.forEach((l, i) => ctx.fillText(l, cx, cy + (i - (lines.length - 1) / 2) * size * 1.1 + 3)); });
}
function sfx(text, x, y, size, rot, fill = ['#fff35a', '#ff8a1e'], shadow = '#d8343c', stretch = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(stretch, 1); ctx.font = `${size}px PS2P`; ctx.textBaseline = 'middle';
  let cx = 0; const chars = [...text]; const total = chars.reduce((a, c) => a + ctx.measureText(c).width * 0.92, 0); cx = -total / 2;
  chars.forEach((ch, i) => {
    const cw = ctx.measureText(ch).width * 0.92, jy = Math.sin(i * 1.7) * size * 0.12, jr = Math.sin(i * 2.3) * 0.08, sc = 1 + Math.sin(i * 1.1) * 0.08;
    ctx.save(); ctx.translate(cx + cw / 2, jy); ctx.rotate(jr); ctx.scale(sc, sc);
    ctx.lineJoin = 'miter'; ctx.textAlign = 'center';
    ctx.fillStyle = '#111'; ctx.fillText(ch, size * 0.12, size * 0.12);
    ctx.fillStyle = shadow; ctx.fillText(ch, size * 0.07, size * 0.07);
    ctx.lineWidth = size * 0.2; ctx.strokeStyle = '#111'; ctx.strokeText(ch, 0, 0);
    const g = ctx.createLinearGradient(0, -size / 2, 0, size / 2); g.addColorStop(0, fill[0]); g.addColorStop(1, fill[1]);
    ctx.fillStyle = g; ctx.fillText(ch, 0, 0); ctx.restore();
    cx += cw;
  });
  ctx.restore();
}

function overlay() {
  if (MODE === 'D') return;
  if (MODE === 'A') {
    const [mx, my] = toScreen(ov.dogHead(), panels[0]);
    speedLines(mx, my, panels[0].rect, 80, 230, 'rgba(255,255,255,0.35)');
    halftone(1256, 0, 664, 532, 'rgba(255,60,172,0.45)', 16, 'br');
    halftone(1256, 548, 664, 532, 'rgba(60,240,255,0.35)', 16, 'tl');
    panelFrames();
    const [cx, cy] = toScreen(ov.car(), panels[0]);
    sfx('SKRIIIII!', Math.max(cx + 60, 330), cy - 150, 78, -0.12, ['#ffffff', '#9fd8ff'], '#3c6cff');
    sfx('NHAC!', mx + 120, my - 200, 96, 0.1);
    caption(40, 40, 'UM SEGUNDO.', 62);
    { const [ex, ey] = toScreen(ov.dogHead(), panels[1]); iconBalloon(1760, 120, ex + 40, ey - 60, 'bang', '#d8343c'); }
  }
  if (MODE === 'B') {
    const p = panels[0];
    halftone(1420, 0, 500, 360, 'rgba(255,255,255,0.55)', 18, 'tl');
    panelFrames();
    const [dx, dy] = toScreen(ov.dogHead(), p), [kx, ky] = toScreen(ov.cat(), p), [nx, ny] = toScreen(ov.can(), p), [px, py] = toScreen(ov.pigeons(), p), [ox, oy] = toScreen(ov.otavio(), p);
    sfx('SPLOOSH!', dx + 40, dy + 330, 104, -0.08, ['#ffe08a', '#c07a2a'], '#5a3a1a');
    sfx('FLAP FLAP!', Math.max(px + 80, 300), Math.max(py + 40, 120), 54, -0.15, ['#ffffff', '#c9d4ff'], '#5a6a8a');
    sfx('KLANG!', nx + 150, ny - 90, 66, 0.16, ['#fff35a', '#ff8a1e']);
    iconBalloon(kx + 170, ky - 150, kx + 30, ky - 30, 'anger', '#d8343c');
    iconBalloon(dx - 190, dy - 210, dx - 40, dy - 40, 'star', '#f5b400');
    caption(1080, 40, 'A CIDADE RESOLVEU TESTAR A AMIZADE.', 48, 0.015);
    speech(ox - 40, oy - 210, ox, oy - 40, ['...HEH.'], 44);
  }
  if (MODE === 'C') {
    const p = panels[0]; const [cx, cy] = toScreen(ov.car(), p);
    speedLines(cx, cy, [0, 0, 1920, 1080], 90, 300, 'rgba(255,255,255,0.4)');
    halftone(0, 0, 900, 500, 'rgba(10,10,40,0.55)', 16, 'tl');
    panelFrames();
    { const [bx, by] = toScreen(ov.car(), panels[0]); sfx('BIIIIIII!', Math.min(Math.max(bx, 520), 1350), by - 260, 96, -0.06, ['#ffffff', '#ffe14a'], '#d8343c'); }
    const [dx, dy] = toScreen(ov.dogHead(), p);
    sfx('NHAC!!', dx - 120, dy + 220, 84, -0.12);
    const [ix, iy] = toScreen(ov.dogHead(), panels[1]);
    sfx('GRRR', 1720, 690, 50, 0.1, ['#ffffff', '#ffd0a0'], '#8a3a2e');
    caption(40, 980, 'ELE NÃO PENSOU. SÓ PUXOU.', 54, 0.01);
  }
}

renderAll();
overlay();
window.__done = true;
