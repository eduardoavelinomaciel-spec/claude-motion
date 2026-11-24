import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('pageerror', e => console.log('ERR', e.message));
for (const s of (process.argv[2] || '1').split(',')) {
  const [spec, t = '0'] = s.split('@'); const [shot, px = '1'] = spec.split('x');
  await p.goto(`http://localhost:8124/index.html?shot=${shot}&t=${t}&px=${px}`);
  await p.waitForFunction(() => window.__done, null, { timeout: 120000 });
  await p.locator('#c').screenshot({ path: `out/shot-${shot}${px !== '1' ? '-px' + px : ''}.png` });
  console.log('ok', shot);
}
await b.close();
