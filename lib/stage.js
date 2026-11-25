/* Time Capsules stage engine: paper-cut shadow theatre.
 *
 * Every frame is a pure function of time t (seconds), so the same page
 * renders identically in HyperFrames (frame by frame, out of order) and
 * plays live in a browser for preview.
 *
 * A chapter calls Stage.run({...}) once. See README.md for the scene format.
 * Coordinates: every scene is drawn in a 1600x900 viewBox (scaled to 1920x1080).
 */
(function () {
  const W = 1600, H = 900;

  // ---------- small maths ----------
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const smooth = (v) => v * v * (3 - 2 * v);
  const ramp = (t, a, b) => smooth(clamp((t - a) / (b - a)));          // 0 → 1 between a and b
  const win = (t, a, b, f = 0.8) => ramp(t, a, a + f) * (1 - ramp(t, b - f, b)); // up at a, down at b
  const lerp = (a, b, k) => a + (b - a) * k;
  const pulse = (t, at, len = 0.5) => { const k = (t - at) / len; return k < 0 || k > 1 ? 0 : Math.sin(Math.PI * k); };
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  // firelight flicker, -1..1, smooth and deterministic
  const flicker = (t) => 0.5 * Math.sin(t * 7.3) + 0.3 * Math.sin(t * 13.1 + 1) + 0.2 * Math.sin(t * 23.7 + 2);

  const M = { clamp, smooth, ramp, win, lerp, pulse, flicker, mulberry32 };

  // ---------- captions: split long sentences into readable chunks ----------
  function buildCaptions(timings, maxWords = 11, subs = []) {
    const out = [];
    for (const s of timings.sentences) {
      let text = s.text; for (const [a, b] of subs) text = text.split(a).join(b);
      const words = text.replace(/\s+/g, ' ').trim().split(' ');
      const n = Math.ceil(words.length / maxWords);
      const per = Math.ceil(words.length / n);
      const chunks = [];
      for (let i = 0; i < words.length; i += per) chunks.push(words.slice(i, i + per).join(' '));
      const total = chunks.reduce((a, c) => a + c.length, 0);
      let t = s.start;
      chunks.forEach((c, i) => {
        const d = (s.end - s.start) * c.length / total;
        out.push({ start: t, end: i === chunks.length - 1 ? s.end + 0.25 : t + d, text: c });
        t += d;
      });
    }
    return out;
  }

  // ---------- grain: 4 seeded noise tiles ----------
  function grainTiles(seed = 7) {
    const rnd = mulberry32(seed);
    return Array.from({ length: 4 }, () => {
      const c = document.createElement('canvas'); c.width = c.height = 200;
      const ctx = c.getContext('2d'); const img = ctx.createImageData(200, 200);
      for (let i = 0; i < img.data.length; i += 4) { const v = rnd() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
      ctx.putImageData(img, 0, 0); return `url(${c.toDataURL()})`;
    });
  }

  /**
   * Stage.run(cfg)
   *  cfg.style      style kit object (e.g. window.SongStyle) with .palette and .defs(p)
   *  cfg.duration   chapter length in seconds (narration + any pad)
   *  cfg.timings    timings.json contents (for subtitles); optional
   *  cfg.captions   true (default) to burn in subtitles
   *  cfg.fadeIn / cfg.fadeOut  seconds of fade from/to black at the chapter edges
   *  cfg.scenes     [{ at, svg(S), cam: {from:[x,y,s], to:[x,y,s]}, update(lt, S) }]
   *  cfg.subs       [[spoken, shown]] text swaps for subtitles, e.g. [['nine sixty A.D.', '960 AD']]
   *  cfg.cards      [{ at, end, small, big, sub }]  title cards over the picture
   */
  function run(cfg) {
    const style = cfg.style, p = style.palette;
    const D = cfg.duration;
    const root = document.getElementById('stage');
    const scenes = cfg.scenes.map((s, i) => ({ ...s, end: i + 1 < cfg.scenes.length ? cfg.scenes[i + 1].at : D }));
    const XF = cfg.crossfade ?? 0.9;

    // Build every scene once.
    scenes.forEach((s, i) => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.setAttribute('class', 'scene');
      svg.style.opacity = 0;
      // S is handed to the scene: palette, maths, unique ids and url(#gradient) refs for this scene
      const S = { p, M, i, id: (n) => `s${i}-${n}`, u: (n) => `url(#s${i}-${n})` };
      svg.innerHTML = `${style.defs(p, `s${i}`)}<rect width="${W}" height="${H}" fill="${p.void}"/>
        <g class="cam">${s.svg(S)}</g>
        <rect class="warm" width="${W}" height="${H}" fill="#ff8a2a" style="mix-blend-mode:soft-light" opacity=".1"/>
        <rect width="${W}" height="${H}" fill="url(#s${i}-vignette)"/>
        ${s.border === false ? '' : style.border(p, `s${i}`)}`;
      root.appendChild(svg);
      s.el = svg;
      s.S = S;
      S.q = (sel) => svg.querySelector(sel);
      S.qa = (sel) => [...svg.querySelectorAll(sel)];
      S.$ = (n) => svg.getElementById ? svg.querySelector('#' + S.id(n)) : null;
      s.cam = s.cam || { from: [800, 450, 1.03], to: [800, 450, 1.08] };
      s.camEl = svg.querySelector('.cam');
      s.layers = [...svg.querySelectorAll('[data-depth]')].map(el => [el, +el.dataset.depth, el.getAttribute('transform') || '']);
      s.glows = [...svg.querySelectorAll('.glow')].map(el => [el, +(el.getAttribute('opacity') || 1)]);
      s.flames = [...svg.querySelectorAll('.flame')].map(el => [el, el.getAttribute('transform') || '']);
      s.sways = [...svg.querySelectorAll('.sway')].map((el, k) => [el, k]);
      s.warm = svg.querySelector('.warm');
    });

    // Overlays: subtitles, title cards, grain, black.
    const caps = cfg.captions === false || !cfg.timings ? [] : buildCaptions(cfg.timings, cfg.maxWords || 11, cfg.subs || []);
    const capEl = document.createElement('div'); capEl.className = 'caption'; root.appendChild(capEl);
    const cards = (cfg.cards || []).map(c => {
      const el = document.createElement('div'); el.className = 'titlecard';
      el.innerHTML = `${c.small ? `<div class="small">${c.small}</div>` : ''}<div class="big">${c.big}</div>${c.sub ? `<div class="small">${c.sub}</div>` : ''}`;
      root.appendChild(el); return { ...c, el };
    });
    const grain = document.createElement('div'); grain.className = 'grain'; root.appendChild(grain);
    const black = document.createElement('div'); black.className = 'black'; root.appendChild(black);
    const tiles = grainTiles(cfg.seed || 7);
    let lastCap = null;

    function render(t) {
      t = clamp(t, 0, D);
      const f = flicker(t);
      for (const s of scenes) {
        const vis = t >= s.at - 0.001 && t < s.end + XF;
        if (!vis) { if (s.el.style.display !== 'none') s.el.style.display = 'none'; continue; }
        s.el.style.display = 'block';
        // fade in over the previous scene; first scene of a chapter is fully on
        const a = s.at === 0 ? 1 : ramp(t, s.at, s.at + XF);
        s.el.style.opacity = a.toFixed(3);
        const lt = t - s.at, len = s.end - s.at + XF;
        const k = smooth(clamp(lt / len));
        const [x0, y0, s0] = s.cam.from, [x1, y1, s1] = s.cam.to;
        const cx = lerp(x0, x1, k) + 6 * Math.sin(t * 0.31), cy = lerp(y0, y1, k) + 4 * Math.sin(t * 0.23 + 1), sc = lerp(s0, s1, k);
        s.camEl.setAttribute('transform', `translate(800 450) scale(${sc.toFixed(4)}) translate(${(-cx).toFixed(2)} ${(-cy).toFixed(2)})`);
        const dx = cx - 800, dy = cy - 450;
        for (const [el, d, base] of s.layers) el.setAttribute('transform', `translate(${(dx * (1 - d)).toFixed(2)} ${(dy * (1 - d) * 0.5).toFixed(2)}) ${base}`);
        for (const [el, base] of s.glows) el.setAttribute('opacity', (base * (0.84 + 0.16 * f)).toFixed(3));
        for (const [el, base] of s.flames) el.setAttribute('transform', `${base} scale(${(1 + 0.05 * Math.sin(t * 17)).toFixed(3)} ${(1 + 0.12 * f).toFixed(3)})`);
        for (const [el, k2] of s.sways) el.setAttribute('transform', `rotate(${((1.5 + k2 * 0.4) * Math.sin(t * (0.9 + k2 * 0.17) + k2 * 2)).toFixed(2)})`);
        s.warm.setAttribute('opacity', (0.1 + 0.04 * f).toFixed(3));
        if (s.update) s.update(lt, s.S, t);
      }
      // subtitles
      const c = caps.find(c => t >= c.start && t < c.end);
      const txt = c ? c.text : '';
      if (txt !== lastCap) { capEl.textContent = txt; lastCap = txt; }
      capEl.style.opacity = c ? (ramp(t, c.start, c.start + 0.15) * (1 - ramp(t, c.end - 0.15, c.end))).toFixed(3) : 0;
      // title cards
      let dim = 0;
      for (const cd of cards) { const a = win(t, cd.at, cd.end, 1.0); cd.el.style.opacity = a.toFixed(3); dim = Math.max(dim, 0.62 * a); }
      // fades
      const fi = cfg.fadeIn ? 1 - ramp(t, 0, cfg.fadeIn) : 0;
      const fo = cfg.fadeOut ? ramp(t, D - cfg.fadeOut, D) : 0;
      black.style.opacity = Math.max(fi, fo, dim).toFixed(3);
      grain.style.backgroundImage = tiles[Math.floor(t * 12) % 4];
    }

    // HyperFrames: drive render from a GSAP tween (seeked per frame) and the hf-seek event.
    const proxy = { t: 0 };
    const tl = gsap.timeline({ paused: true });
    tl.to(proxy, { t: D, duration: D, ease: 'none', onUpdate: () => render(proxy.t) }, 0);
    window.__timelines = window.__timelines || {};
    window.__timelines['main'] = tl;
    window.addEventListener('hf-seek', (e) => render(e.detail.time));
    window.__stageRender = render;
    render(0);

  }

  window.Stage = { run, M, W, H, buildCaptions };
})();
