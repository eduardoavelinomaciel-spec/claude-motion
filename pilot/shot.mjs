import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
p.on('console', m => console.log('console:', m.text()));
p.on('pageerror', e => console.log('ERR', e.message));
for (const f of (process.argv[2] || 'A,B,C').split(',')) {
  await p.goto(`http://localhost:8123/index2.html?f=${f}`);
  await p.waitForFunction(() => window.__done, null, { timeout: 60000 });
  await p.locator('#stage').screenshot({ path: `out/frame-${f}.png` });
  console.log('ok', f);
}
await b.close();
