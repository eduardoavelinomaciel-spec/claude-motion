// node extras.mjs <id> [--stills 1,5] → out/<id>-silent.mp4 + out/<id>.mp4 (with the scene's own sound, same cuts). Needs: python3 -m http.server 8124
import { createRequire } from 'module'; import { spawn, execFileSync } from 'child_process'; import fs from 'fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const a = process.argv.slice(2), id = a[0], opt = (k, d) => { const i = a.indexOf('--' + k); return i < 0 ? d : a[i + 1]; };
const S = JSON.parse(fs.readFileSync('extras.json', 'utf8')).shorts.find((s) => s.id === id), fps = 24;
let acc = 0; for (const g of S.segments) { g.at = acc; acc += g.src[1] - g.src[0]; } const dur = acc;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1920 } });
p.on('pageerror', (e) => console.log('ERR', e.message));
await p.goto(`http://localhost:8124/extras.html?page=${S.page}`);
await p.waitForFunction(() => window.__ready, null, { timeout: 300000 });
await p.evaluate((S) => {
  const V = document.createElement('canvas'); V.id = 'v'; V.width = 1080; V.height = 1920; V.style.cssText = 'position:absolute;left:0;top:0';
  document.body.appendChild(V); const g = V.getContext('2d'), src = document.getElementById('c');
  const [rawC, rg] = (() => { const c = document.createElement('canvas'); c.width = 1920; c.height = 1080; return [c, c.getContext('2d')]; })();
  const INK = '#111018', PY = 420, PH = 1080;
  const CODE = ['function chuva(g, r) {', '  for (let k = 0; k < 900; k++) {', '    const x = r() * W, y = r() * H;', '    const L = 30 + r() * 40;', "    g.strokeStyle = 'rgba(200,220,255,.4)';", '    g.beginPath(); g.moveTo(x, y);', '    g.lineTo(x - L * 0.12, y + L);', '    g.stroke();', '  }', '}', 'pixelate(ctx, 4, 12); // 480×270'];
  function lettering(text, x, y, size) {
    g.save(); g.font = `${size}px Bangers`; g.textAlign = 'center'; g.lineJoin = 'round';
    g.fillStyle = '#d8343c'; g.fillText(text, x + size * 0.05, y + size * 0.06); g.lineWidth = size * 0.16; g.strokeStyle = INK; g.strokeText(text, x, y);
    const gr = g.createLinearGradient(0, y - size * 0.75, 0, y); gr.addColorStop(0, '#fff35a'); gr.addColorStop(1, '#ff8a1e'); g.fillStyle = gr; g.fillText(text, x, y); g.restore();
  }
  function chip(text, x, y, size, bg, fg, align = 'center') {
    g.font = `${size}px Bangers`; const w = g.measureText(text).width + size * 0.7, x0 = align === 'center' ? x - w / 2 : x;
    g.fillStyle = INK; g.fillRect(x0 - 6, y - 6, w + 12, size * 1.3 + 12); g.fillStyle = bg; g.fillRect(x0, y, w, size * 1.3); g.fillStyle = fg; g.textAlign = 'center'; g.fillText(text, x0 + w / 2, y + size * 1.03); g.textAlign = 'left';
  }
  function heart(x, y, s) { ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...'].forEach((r, j) => [...r].forEach((c, i) => { if (c === 'X') { g.fillStyle = i === 1 && j === 1 ? '#ff9aa0' : '#e8434f'; g.fillRect(x + i * s, y + j * s, s, s); } })); }
  const [bg, bgg] = (() => { const c = document.createElement('canvas'); c.width = 1080; c.height = 1920; return [c, c.getContext('2d')]; })();
  bgg.fillStyle = '#16121f'; bgg.fillRect(0, 0, 1080, 1920); bgg.fillStyle = 'rgba(255,255,255,0.05)'; for (let y = 0; y < 1920; y += 12) for (let x = (y / 12) % 2 ? 6 : 0; x < 1080; x += 12) bgg.fillRect(x, y, 3, 3);
  window.xrender = (T) => {
    const seg = S.segments.find((s) => T < s.at + (s.src[1] - s.src[0])) || S.segments[S.segments.length - 1];
    const lt = T - seg.at, t = seg.src[0] + lt, [cx, z] = seg.frame;
    if (seg.mode !== 'pix') { window.RAW = true; window.render(t); rg.drawImage(src, 0, 0); window.RAW = false; }
    if (seg.mode !== 'raw' && seg.mode !== 'code') window.render(t);
    const img = seg.mode === 'raw' || seg.mode === 'code' ? rawC : src;
    g.drawImage(bg, 0, 0);
    const sw = Math.min(1920, 1080 / z), sh = Math.min(1080, PH / z), sx = Math.max(0, Math.min(1920 - sw, cx - sw / 2)), sy = (1080 - sh) / 2;
    const dw = sw * z, dh = sh * z, dx = (1080 - dw) / 2, dy = PY + (PH - dh) / 2;
    g.fillStyle = '#fbf7ee'; g.fillRect(dx - 14, dy - 14, dw + 28, dh + 28); g.fillStyle = INK; g.fillRect(dx - 6, dy - 6, dw + 12, dh + 12);
    g.imageSmoothingEnabled = z < 1; g.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
    if (seg.mode === 'wipe') { // raw on the left of a sweeping divider
      const u = 0.5 + 0.32 * Math.sin(lt * 1.6), wx = dx + dw * u;
      g.save(); g.beginPath(); g.rect(dx, dy, wx - dx, dh); g.clip(); g.imageSmoothingEnabled = true; g.drawImage(rawC, sx, sy, sw, sh, dx, dy, dw, dh); g.restore();
      g.fillStyle = '#fff'; g.fillRect(wx - 5, dy, 10, dh); g.fillStyle = INK; g.fillRect(wx - 9, dy, 4, dh); g.fillRect(wx + 5, dy, 4, dh);
      g.fillStyle = '#fff'; g.beginPath(); g.arc(wx, dy + dh / 2, 34, 0, 7); g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke();
      g.fillStyle = INK; g.beginPath(); g.moveTo(wx - 22, dy + dh / 2); g.lineTo(wx - 8, dy + dh / 2 - 12); g.lineTo(wx - 8, dy + dh / 2 + 12); g.fill(); g.beginPath(); g.moveTo(wx + 22, dy + dh / 2); g.lineTo(wx + 8, dy + dh / 2 - 12); g.lineTo(wx + 8, dy + dh / 2 + 12); g.fill();
      chip('ANTES', dx + 30, dy + dh - 100, 44, '#fbf7ee', INK, 'left'); g.font = '44px Bangers'; chip('DEPOIS', dx + dw - 30 - (g.measureText('DEPOIS').width + 31), dy + dh - 100, 44, '#ffd93b', INK, 'left');
    }
    if (seg.mode === 'code') { // code typed over the raw render
      g.fillStyle = 'rgba(10,8,20,0.78)'; g.fillRect(dx + 40, dy + 60, dw - 80, 640);
      g.font = '30px "DejaVu Sans Mono", monospace'; const n = lt / (seg.src[1] - seg.src[0]) * CODE.join('\n').length * 1.15; let left = n;
      CODE.forEach((line, i) => { const k = Math.max(0, Math.min(line.length, Math.floor(left))); left -= line.length + 1; const s = line.slice(0, k);
        g.fillStyle = line.startsWith('pixelate') ? '#ffd93b' : i === 0 || line.trim() === '}' ? '#ff8ac8' : '#bfe6ff'; g.fillText(s, dx + 70, dy + 120 + i * 54);
        if (k > 0 && k < line.length) { g.fillStyle = '#fff'; g.fillRect(dx + 70 + g.measureText(s).width + 4, dy + 96 + i * 54, 16, 30); } });
      chip('ANTES DO FILTRO', 540, dy + dh - 110, 44, '#fbf7ee', INK);
    }
    g.font = '44px Bangers'; chip(S.badge, 540, 58, 44, '#ffd93b', INK);
    lettering(seg.hook[0], 540, 238, 96); lettering(seg.hook[1], 540, 350, 96);
    heart(390, 1546, 7); g.font = '40px Bangers'; g.fillStyle = '#fbf7ee'; g.fillText('HISTÓRIAS QUE AQUECEM', 448, 1584);
  };
}, S);
const shot = (T) => p.evaluate((T) => window.xrender(T), T).then(() => p.locator('#v').screenshot({ type: 'png' }));
if (opt('stills')) { for (const t of opt('stills').split(',')) { fs.writeFileSync(`out/${id}-${t}.png`, await shot(+t)); console.log('still', t); } await b.close(); process.exit(0); }
const silent = `out/${id}-silent.mp4`;
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', silent], { stdio: ['pipe', 'inherit', 'inherit'] });
const N = Math.round(dur * fps);
for (let f = 0; f < N; f++) { const buf = await shot(f / fps); if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r)); if (f % 96 === 0) console.log(id, 'frame', f, '/', N); }
ff.stdin.end(); await new Promise((r) => ff.on('close', r)); await b.close();
// sound: the same cuts from the scene's mastered WAV, 40 ms fades at each join
const parts = S.segments.map((s, i) => `[1:a]atrim=${s.src[0]}:${s.src[1]},asetpts=PTS-STARTPTS,afade=t=in:d=0.04,afade=t=out:st=${(s.src[1] - s.src[0] - 0.04).toFixed(3)}:d=0.04[a${i}]`).join(';');
const cat = S.segments.map((_, i) => `[a${i}]`).join('') + `concat=n=${S.segments.length}:v=0:a=1[a]`;
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', silent, '-i', S.wav, '-filter_complex', `${parts};${cat}`, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', '-shortest', `out/${id}.mp4`]);
console.log('done', `out/${id}.mp4`, dur.toFixed(1) + 's');
