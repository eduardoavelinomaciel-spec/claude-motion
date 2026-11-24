// node vertical.mjs <id> [--stills 1,5] → out/short-<id>-silent.mp4 (1080x1920, 24 fps). Needs: python3 -m http.server 8124
// Reuses each scene's render(t); adds a crisp HQ layer: hook on top, part badge, channel seal at the bottom.
import { createRequire } from 'module'; import { spawn } from 'child_process'; import fs from 'fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const a = process.argv.slice(2), id = a[0], opt = (k, d) => { const i = a.indexOf('--' + k); return i < 0 ? d : a[i + 1]; };
const S = JSON.parse(fs.readFileSync('shorts.json', 'utf8')).shorts.find((s) => s.id === id);
const TL = JSON.parse(fs.readFileSync(S.timeline, 'utf8')), fps = TL.fps, dur = TL.duration;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1920 } });
p.on('pageerror', (e) => console.log('ERR', e.message));
await p.goto('http://localhost:8124/' + S.page);
await p.waitForFunction(() => window.__ready, null, { timeout: 300000 });
await p.evaluate(({ S, TL }) => {
  const V = document.createElement('canvas'); V.id = 'v'; V.width = 1080; V.height = 1920; V.style.cssText = 'position:absolute;left:0;top:0';
  document.body.appendChild(V); const g = V.getContext('2d'), src = document.getElementById('c');
  const INK = '#111018', PY = 420, PH = 1080; // panel: y 420..1500
  function lettering(text, x, y, size) {
    g.save(); g.font = `${size}px Bangers`; g.textAlign = 'center'; g.lineJoin = 'round';
    g.fillStyle = '#d8343c'; g.fillText(text, x + size * 0.05, y + size * 0.06);
    g.lineWidth = size * 0.16; g.strokeStyle = INK; g.strokeText(text, x, y);
    const gr = g.createLinearGradient(0, y - size * 0.75, 0, y); gr.addColorStop(0, '#fff35a'); gr.addColorStop(1, '#ff8a1e'); g.fillStyle = gr; g.fillText(text, x, y); g.restore();
  }
  function heart(x, y, s) { ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...'].forEach((r, j) => [...r].forEach((c, i) => { if (c === 'X') { g.fillStyle = i === 1 && j === 1 ? '#ff9aa0' : '#e8434f'; g.fillRect(x + i * s, y + j * s, s, s); } })); }
  // static page (bands) cached once
  const [bg, bgg] = (() => { const c = document.createElement('canvas'); c.width = 1080; c.height = 1920; return [c, c.getContext('2d')]; })();
  bgg.fillStyle = '#16121f'; bgg.fillRect(0, 0, 1080, 1920);
  bgg.fillStyle = 'rgba(255,255,255,0.05)'; for (let y = 0; y < 1920; y += 12) for (let x = (y / 12) % 2 ? 6 : 0; x < 1080; x += 12) bgg.fillRect(x, y, 3, 3);
  window.vrender = (t) => {
    window.render(t);
    const sh = TL.shots.find((s) => t >= s.start && t < s.end) || TL.shots[TL.shots.length - 1];
    const [cx, z] = S.frame[sh.id] || [960, 1];
    g.drawImage(bg, 0, 0);
    const sw = Math.min(1920, 1080 / z), sh2 = Math.min(1080, PH / z), sx = Math.max(0, Math.min(1920 - sw, cx - sw / 2)), sy = (1080 - sh2) / 2;
    const dw = sw * z, dh = sh2 * z, dx = (1080 - dw) / 2, dy = PY + (PH - dh) / 2;
    g.fillStyle = '#fbf7ee'; g.fillRect(dx - 14, dy - 14, dw + 28, dh + 28); g.fillStyle = INK; g.fillRect(dx - 6, dy - 6, dw + 12, dh + 12);
    g.imageSmoothingEnabled = z >= 1 ? false : true; g.drawImage(src, sx, sy, sw, sh2, dx, dy, dw, dh); g.imageSmoothingEnabled = true;
    // HQ layer
    g.font = '44px Bangers'; const pw = g.measureText(S.part).width + 36;
    g.fillStyle = INK; g.fillRect(540 - pw / 2 - 6, 58, pw + 12, 68); g.fillStyle = '#ffd93b'; g.fillRect(540 - pw / 2, 64, pw, 56); g.fillStyle = INK; g.textAlign = 'center'; g.fillText(S.part, 540, 108); g.textAlign = 'left';
    lettering(S.hook[0], 540, 238, 96); lettering(S.hook[1], 540, 350, 96);
    heart(390, 1546, 7); g.font = '40px Bangers'; g.fillStyle = '#fbf7ee'; g.fillText('HISTÓRIAS QUE AQUECEM', 448, 1584);
  };
}, { S, TL });
const shot = (t) => p.evaluate((t) => window.vrender(t), t).then(() => p.locator('#v').screenshot({ type: 'png' }));
if (opt('stills')) { for (const t of opt('stills').split(',')) { fs.writeFileSync(`out/short-${id}-${t}.png`, await shot(+t)); console.log('still', t); } await b.close(); process.exit(0); }
const out = `out/short-${id}-silent.mp4`;
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
const N = Math.round(dur * fps);
for (let f = 0; f < N; f++) { const buf = await shot(f / fps); if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r)); if (f % 96 === 0) console.log(id, 'frame', f, '/', N); }
ff.stdin.end(); await new Promise((r) => ff.on('close', r)); await b.close(); console.log('done', out);
