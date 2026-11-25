// Make a YouTube or Facebook thumbnail from a frame of a chapter, in the episode's own paper-cut style.
//
// Usage:
//   node scripts/thumbnail.js <chapter-folder> <time> <out.png> "<WORDS>" [--small "<kicker>"] [--side left|right|center] [--accent "<word>"]
// Example:
//   node scripts/thumbnail.js episodes/song-wet-nurse/chapters/ch01 18 episodes/song-wet-nurse/packaging/youtube-thumb.png \
//        "TASTE IT FIRST" --small "Song dynasty · 960 AD" --side left --accent "FIRST"
//
// Output is 1280x720 (YouTube and Facebook landscape). Subtitles and title cards are hidden.
// Rules: max 3 big words, never the same words as the title; keep words + main figure inside the
// central 4:5 area (x 384-896) for the Facebook version so a feed crop does not cut them.
const { chromium } = require('playwright');
const path = require('path');
const { execFileSync } = require('child_process');

(async () => {
  const args = process.argv.slice(2);
  const opt = (k, d) => { const i = args.indexOf(k); if (i < 0) return d; const v = args[i + 1]; args.splice(i, 2); return v; };
  const small = opt('--small', ''), side = opt('--side', 'left'), accent = opt('--accent', '');
  const [ch, time, out, words] = args;
  if (!words) { console.error('Usage: node scripts/thumbnail.js <chapter> <time> <out.png> "<WORDS>" [--small ..] [--side ..] [--accent ..]'); process.exit(1); }
  execFileSync('python3', [path.join(__dirname, 'build.py'), ch], { stdio: 'inherit' });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + path.resolve(ch, 'index.html'));
  await page.waitForTimeout(500);
  await page.evaluate((t) => window.__stageRender && window.__stageRender(+t), time);
  await page.evaluate(({ words, small, side, accent }) => {
    document.querySelectorAll('.caption, .titlecard, .playbtn').forEach(e => e.style.display = 'none');
    const root = document.getElementById('root');
    const css = document.createElement('style');
    css.textContent = `
      .thumb-shade { position:absolute; inset:0; pointer-events:none; z-index:8;
        background: ${side === 'center' ? 'radial-gradient(ellipse at center, rgba(0,0,0,.15), rgba(0,0,0,.7))'
          : `linear-gradient(${side === 'left' ? '90deg' : '270deg'}, rgba(5,2,1,.88) 0%, rgba(5,2,1,.55) 38%, rgba(0,0,0,0) 62%)`}; }
      .thumb-text { position:absolute; top:0; bottom:0; z-index:9; display:flex; flex-direction:column; justify-content:center; gap:22px;
        ${side === 'left' ? 'left:110px; width:900px; text-align:left;' : side === 'right' ? 'right:110px; width:900px; text-align:right;' : 'left:0; right:0; text-align:center; align-items:center;'}
        font-family:"EB Garamond", Georgia, serif; }
      .thumb-small { font-size:44px; letter-spacing:.22em; text-transform:uppercase; color:#e0ad4f; font-weight:500;
        text-shadow:0 0 14px #000, 0 2px 4px #000; }
      .thumb-big { font-size:190px; line-height:.9; font-weight:500; color:#fff1d6; text-transform:uppercase;
        text-shadow:0 0 30px rgba(0,0,0,.95), 0 6px 10px #000; -webkit-text-stroke: 2px rgba(0,0,0,.35); }
      .thumb-big .acc { color:#e04a2a; }`;
    document.head.appendChild(css);
    const shade = document.createElement('div'); shade.className = 'thumb-shade'; root.appendChild(shade);
    const box = document.createElement('div'); box.className = 'thumb-text';
    const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    const big = esc(words).split(' ').map(w => accent && w.toUpperCase() === accent.toUpperCase() ? `<span class="acc">${w}</span>` : w).join(' ');
    box.innerHTML = (small ? `<div class="thumb-small">${esc(small)}</div>` : '') + `<div class="thumb-big">${big}</div>`;
    root.appendChild(box);
  }, { words, small, side, accent });
  await page.waitForTimeout(300);
  const tmp = out.replace(/\.png$/, '') + '.full.png';
  await page.screenshot({ path: tmp, clip: { x: 0, y: 0, width: 1920, height: 1080 } });
  await browser.close();
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', tmp, '-vf', 'scale=1280:720:flags=lanczos', out]);
  require('fs').unlinkSync(tmp);
  // small preview to check it still reads at the size people see it in search/feed
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', out, '-vf', 'scale=320:180', out.replace(/\.png$/, '') + '.preview-320.png']);
  console.log('Saved ' + out + ' (1280x720) and a 320x180 preview');
})();
