// node brand.mjs ["NOME|LINHA 2"] → ../canal/avatar.png, ../canal/banner.png  (needs: python3 -m http.server 8124 in anime/)
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
const name = encodeURIComponent(process.argv[2] || 'HISTÓRIAS QUE|AQUECEM');
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 2560, height: 1440 } });
p.on('pageerror', (e) => console.log('ERR', e.message));
for (const m of ['avatar', 'banner']) {
  await p.goto(`http://localhost:8124/brand.html?m=${m}&name=${name}`);
  await p.waitForFunction(() => window.__done, null, { timeout: 300000 });
  await p.locator('#out').screenshot({ path: `../canal/${m}.png` }); console.log('ok', m);
}
await b.close();
