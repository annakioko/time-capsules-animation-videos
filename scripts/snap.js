// Quick preview frames: node scripts/snap.js episodes/<slug>/chapters/chNN out.png t1 t2 t3 ...
// Renders each time with the stage's own render(t) and tiles them into one contact sheet.
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [ch, out, ...times] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.resolve(ch, 'index.html'));
  await page.waitForTimeout(400);
  const shots = [];
  for (const t of times) {
    await page.evaluate((t) => window.__stageRender && window.__stageRender(+t), t);
    shots.push((await page.screenshot({ type: 'jpeg', quality: 70 })).toString('base64'));
  }
  const cols = times.length > 6 ? 4 : 3, w = 480, h = 270;
  const sheet = await browser.newPage({ viewport: { width: cols * w, height: Math.ceil(times.length / cols) * (h + 24) } });
  await sheet.setContent(`<body style="margin:0;background:#222;display:flex;flex-wrap:wrap;font:14px sans-serif;color:#fff">${shots.map((s, i) => `<div style="width:${w}px"><img src="data:image/jpeg;base64,${s}" style="width:${w}px;height:${h}px;display:block"><div style="height:24px">t=${times[i]}</div></div>`).join('')}</body>`);
  await sheet.screenshot({ path: out });
  if (errs.length) console.log('ERRORS:\n' + errs.join('\n'));
  await browser.close();
})();
