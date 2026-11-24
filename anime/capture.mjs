// node capture.mjs [--from 0] [--to 30] [--stills 1,5,9] [--out out/cena1-silent.mp4]
import { createRequire } from 'module'; import { spawn } from 'child_process';
const { chromium } = createRequire(import.meta.url)('playwright');
const a = process.argv.slice(2), opt = (k, d) => { const i = a.indexOf('--' + k); return i < 0 ? d : a[i + 1]; };
const fps = 24, from = +opt('from', 0), to = +opt('to', 30), stills = opt('stills');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('pageerror', (e) => console.log('ERR', e.message));
await p.goto('http://localhost:8124/' + opt('page', 'anim.html'));
await p.waitForFunction(() => window.__ready, null, { timeout: 300000 });
const c = p.locator('#c');
if (stills) { for (const t of stills.split(',')) { await p.evaluate((t) => window.render(t), +t); await c.screenshot({ path: `out/${opt('prefix', 'still')}-${t}.png` }); console.log('still', t); } await b.close(); process.exit(0); }
const out = opt('out', 'out/cena1-silent.mp4');
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
const N = Math.round((to - from) * fps);
for (let f = 0; f < N; f++) {
  await p.evaluate((t) => window.render(t), from + f / fps);
  const buf = await c.screenshot({ type: 'png' });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  if (f % 48 === 0) console.log('frame', f, '/', N);
}
ff.stdin.end(); await new Promise((r) => ff.on('close', r)); await b.close(); console.log('done', out);
