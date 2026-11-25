/* Flat bright style (style sample): Song dynasty China in flat colour with ink outlines and expressive faces.
 * Same engine as the paper-cut kits (lib/stage.js): scenes draw in a 1600x900 viewBox, figures stand on (0,0).
 * Exports window.FlatStyle = { palette, defs, border, Scenery, Props, person, face, hold }.
 */
(function () {
  const palette = {
    void: '#2d2030', ink: '#2d2030',
    paper: '#fff4dc', gold: '#f2b632', goldHi: '#ffd76a', red: '#d1342f', redHi: '#e8574a', redLo: '#a32622',
    jade: '#2a9d8f', jadeHi: '#49b3a5', jadeLo: '#1f7a70', blue: '#3d5a80', night: '#23356b', nightHi: '#3d4f8f',
    pink: '#f28ca0', pinkLo: '#d96c84', yellow: '#f4b740', cream: '#fdf0d5', wood: '#b5651d', woodLo: '#9c541a',
    wall: '#f6d58e', wallLo: '#e9b96a', leaf: '#2e7d5b', leafHi: '#3f9a70', blossom: '#ff9fb8', poison: '#7bd36b',
    skin: { peasant: '#d9a173', light: '#f5d0ae', fair: '#f7d9bd', warm: '#e8b98f' },
    hair: '#2a2028', blush: '#ff8a8a'
  };
  const INK = palette.ink, SW = 5;

  const defs = (p, pre) => `
<defs>
  <radialGradient id="${pre}-vignette" cx=".5" cy=".5" r=".75">
    <stop offset=".6" stop-color="#2d2030" stop-opacity="0"/><stop offset="1" stop-color="#2d2030" stop-opacity=".38"/>
  </radialGradient>
  <radialGradient id="${pre}-glow"><stop offset="0" stop-color="#ffd76a" stop-opacity=".75"/><stop offset="1" stop-color="#ffd76a" stop-opacity="0"/></radialGradient>
  <radialGradient id="${pre}-moonGlow"><stop offset="0" stop-color="#fff1c1" stop-opacity=".55"/><stop offset="1" stop-color="#fff1c1" stop-opacity="0"/></radialGradient>
  <linearGradient id="${pre}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d2b5a"/><stop offset="1" stop-color="#6a4a8a"/></linearGradient>
  <linearGradient id="${pre}-window" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.night}"/><stop offset="1" stop-color="${p.nightHi}"/></linearGradient>
  <pattern id="${pre}-fret" width="24" height="24" patternUnits="userSpaceOnUse">
    <rect width="24" height="24" fill="${p.redLo}"/>
    <path d="M3 21 V3 H21 V17 H9 V9 H15" fill="none" stroke="${p.gold}" stroke-width="2.6"/>
  </pattern>
</defs>`;

  const border = (p, pre) => `
  <g pointer-events="none">
    <path fill-rule="evenodd" fill="url(#${pre}-fret)" d="M0 0 H1600 V900 H0 Z M24 24 V876 H1576 V24 Z"/>
    <rect x="24" y="24" width="1552" height="852" fill="none" stroke="${p.goldHi}" stroke-width="3"/>
    <rect x="1.5" y="1.5" width="1597" height="897" fill="none" stroke="${p.ink}" stroke-width="3"/>
  </g>`;

  // ---------- figures ----------
  // person(S, o): front view. o = { id, skin, robe, trim, sash, hair: bun|loops|phoenix|cap, arms: hold|baby|down|tray, kneel, tired, cheeks }
  function person(S, o) {
    const p = S.p, id = (n) => S.id(`${o.id}-${n}`);
    const T = o.kneel ? -290 : -400, HY = T - 70, hw = o.kneel ? 165 : 130;
    const halfAt = (y) => 100 + (hw - 100) * ((y - (T + 70)) / (0 - (T + 70)));
    const sy = T + 105, sw = halfAt(sy);
    const robe = o.robe, trim = o.trim || p.cream, sash = o.sash || p.red, hairC = p.hair;
    const body = `
      <ellipse cx="0" cy="4" rx="${hw + 30}" ry="20" fill="#000" opacity=".16"/>
      <path d="M-75 ${T} Q-98 ${T + 18} -100 ${T + 70} L${-hw} 0 L${hw} 0 L100 ${T + 70} Q98 ${T + 18} 75 ${T} Z" fill="${robe}" stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round"/>
      <path d="M8 ${T + 2} L75 ${T} Q98 ${T + 18} 100 ${T + 70} L${hw} 0 L8 0 Z" fill="#000" opacity=".1"/>
      <path d="M${-hw + 6} -30 L${hw - 6} -30 L${hw} 0 L${-hw} 0 Z" fill="${trim}" stroke="${INK}" stroke-width="${SW - 1}" stroke-linejoin="round"/>
      <path d="M-28 ${T} L0 ${T + 40} L28 ${T} Z" fill="#fffaf0"/>
      <path d="M-42 ${T - 2} L10 ${T + 92} L28 ${T + 84} L-20 ${T - 4} Z" fill="${trim}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M42 ${T - 2} L14 ${T + 50} L4 ${T + 38} L22 ${T - 4} Z" fill="${trim}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <rect x="${-sw}" y="${sy}" width="${2 * sw}" height="34" fill="${sash}" stroke="${INK}" stroke-width="4"/>
      <path d="M-10 ${sy + 32} L-26 ${sy + 140} L-8 ${sy + 136} L2 ${sy + 34} Z M10 ${sy + 32} L30 ${sy + 120} L14 ${sy + 124} L2 ${sy + 34} Z" fill="${sash}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <rect x="-17" y="${HY + 48}" width="34" height="${T - HY - 44}" fill="${o.skin}" stroke="${INK}" stroke-width="4"/>`;

    // hair behind the face
    let back = '', front = '';
    const cap = `<path d="M-60 ${HY + 8} Q-66 ${HY - 72} 0 ${HY - 74} Q66 ${HY - 72} 60 ${HY + 8} Q54 ${HY - 28} 16 ${HY - 40} Q0 ${HY - 30} -16 ${HY - 40} Q-54 ${HY - 28} -60 ${HY + 8} Z" fill="${hairC}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
    if (o.hair !== 'cap') back = `<ellipse cx="0" cy="${HY - 6}" rx="66" ry="68" fill="${hairC}" stroke="${INK}" stroke-width="4"/>`;
    if (o.hair === 'phoenix' || o.hair === 'loops') back += `<path d="M-66 ${HY - 10} Q-84 ${HY + 70} -70 ${HY + 120} L-40 ${HY + 112} Q-50 ${HY + 60} -48 ${HY + 10} Z M66 ${HY - 10} Q84 ${HY + 70} 70 ${HY + 120} L40 ${HY + 112} Q50 ${HY + 60} 48 ${HY + 10} Z" fill="${hairC}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
    if (o.hair === 'bun') front = `<circle cx="0" cy="${HY - 84}" r="30" fill="${hairC}" stroke="${INK}" stroke-width="4"/>${cap}
      <path d="M-44 ${HY - 98} L44 ${HY - 74}" stroke="#c98d4b" stroke-width="7" stroke-linecap="round"/>`;
    if (o.hair === 'loops') front = `
      <ellipse cx="-38" cy="${HY - 112}" rx="24" ry="38" transform="rotate(-22 -38 ${HY - 112})" fill="none" stroke="${hairC}" stroke-width="18"/>
      <ellipse cx="38" cy="${HY - 112}" rx="24" ry="38" transform="rotate(22 38 ${HY - 112})" fill="none" stroke="${hairC}" stroke-width="18"/>
      <circle cx="0" cy="${HY - 80}" r="26" fill="${hairC}"/>${cap}
      <path d="M-64 ${HY - 70} L-18 ${HY - 96} M64 ${HY - 70} L18 ${HY - 96}" stroke="${p.gold}" stroke-width="6" stroke-linecap="round"/>
      ${[[-52, HY - 64], [52, HY - 64]].map(([x, y]) => [0, 72, 144, 216, 288].map(a => `<circle cx="${x + 11 * Math.cos(a * Math.PI / 180)}" cy="${y + 11 * Math.sin(a * Math.PI / 180)}" r="9" fill="${p.blossom}" stroke="${INK}" stroke-width="2"/>`).join('') + `<circle cx="${x}" cy="${y}" r="6" fill="${p.goldHi}"/>`).join('')}`;
    if (o.hair === 'phoenix') front = `${cap}
      <path d="M-62 ${HY - 40} L-70 ${HY - 120} L-40 ${HY - 88} L-22 ${HY - 150} L0 ${HY - 96} L22 ${HY - 150} L40 ${HY - 88} L70 ${HY - 120} L62 ${HY - 40} Q0 ${HY - 64} -62 ${HY - 40} Z" fill="${p.gold}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M-62 ${HY - 44} Q-120 ${HY - 70} -132 ${HY - 20} M62 ${HY - 44} Q120 ${HY - 70} 132 ${HY - 20}" fill="none" stroke="${p.gold}" stroke-width="9" stroke-linecap="round"/>
      <circle cx="-132" cy="${HY - 14}" r="9" fill="${p.red}" stroke="${INK}" stroke-width="2"/><circle cx="132" cy="${HY - 14}" r="9" fill="${p.red}" stroke="${INK}" stroke-width="2"/>
      <circle cx="0" cy="${HY - 70}" r="12" fill="${p.red}" stroke="${INK}" stroke-width="3"/><circle cx="-36" cy="${HY - 60}" r="7" fill="${p.jade}"/><circle cx="36" cy="${HY - 60}" r="7" fill="${p.jade}"/>`;
    if (o.hair === 'cap') front = `
      <path d="M-58 ${HY - 30} Q-60 ${HY - 100} 0 ${HY - 102} Q60 ${HY - 100} 58 ${HY - 30} Z" fill="${hairC}" stroke="${INK}" stroke-width="4"/>
      <rect x="-62" y="${HY - 40}" width="124" height="16" rx="6" fill="#3a2d38" stroke="${INK}" stroke-width="3"/>
      <path d="M-60 ${HY - 46} L-150 ${HY - 40} M60 ${HY - 46} L150 ${HY - 40}" stroke="${hairC}" stroke-width="10" stroke-linecap="round"/>`;

    const eye = (side) => `<g id="${id('eye' + side)}"><ellipse cx="0" cy="0" rx="8" ry="10.5" fill="${INK}"/><circle cx="2.5" cy="-3.5" r="2.8" fill="#fff"/></g>`;
    const mouths = {
      neutral: `<path d="M-13 0 Q0 4 13 0" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`,
      worried: `<path d="M-15 6 Q0 -5 15 6" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`,
      scared: `<ellipse cx="0" cy="4" rx="10" ry="13" fill="#7a2733" stroke="${INK}" stroke-width="3.5"/>`,
      smirk: `<path d="M-16 3 Q4 10 18 -7" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`,
      smile: `<path d="M-17 -2 Q0 14 17 -2" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`
    };
    const head = `<g id="${id('head')}">${back}
      <circle cx="-57" cy="${HY + 6}" r="13" fill="${o.skin}" stroke="${INK}" stroke-width="4"/><circle cx="57" cy="${HY + 6}" r="13" fill="${o.skin}" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="0" cy="${HY}" rx="57" ry="63" fill="${o.skin}" stroke="${INK}" stroke-width="${SW}"/>
      <ellipse cx="-33" cy="${HY + 24}" rx="12" ry="7" fill="${p.blush}" opacity="${o.cheeks ?? .45}"/><ellipse cx="33" cy="${HY + 24}" rx="12" ry="7" fill="${p.blush}" opacity="${o.cheeks ?? .45}"/>
      ${o.tired ? `<path d="M-34 ${HY + 10} Q-22 ${HY + 16} -10 ${HY + 10} M10 ${HY + 10} Q22 ${HY + 16} 34 ${HY + 10}" fill="none" stroke="#9c6a74" stroke-width="3" stroke-linecap="round"/>` : ''}
      <g transform="translate(-22 ${HY - 4})">${eye('L')}</g><g transform="translate(22 ${HY - 4})">${eye('R')}</g>
      ${o.lashes ? `<path d="M-31 ${HY - 12} l-8 -5 M-30 ${HY - 7} l-9 -1 M31 ${HY - 12} l8 -5 M30 ${HY - 7} l9 -1" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
        <circle cx="-58" cy="${HY + 28}" r="6" fill="${p.gold}" stroke="${INK}" stroke-width="2"/><circle cx="58" cy="${HY + 28}" r="6" fill="${p.gold}" stroke="${INK}" stroke-width="2"/>` : ''}
      <path id="${id('browL')}" d="M-35 ${HY - 26} L-11 ${HY - 26}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
      <path id="${id('browR')}" d="M11 ${HY - 26} L35 ${HY - 26}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
      <path d="M0 ${HY + 6} Q-4 ${HY + 14} 2 ${HY + 16}" fill="none" stroke="#b07a5a" stroke-width="3" stroke-linecap="round"/>
      <g transform="translate(0 ${HY + 32})">${Object.entries(mouths).map(([k, v]) => `<g id="${id('m-' + k)}" opacity="0">${v}</g>`).join('')}</g>
      ${front}
      ${o.tired ? `<path id="${id('sweat')}" d="M70 ${HY - 30} Q62 ${HY - 14} 70 ${HY - 8} Q78 ${HY - 14} 70 ${HY - 30} Z" fill="#9fd8ff" stroke="${INK}" stroke-width="2.5"/>` : ''}
    </g>`;

    return `<g id="${id('fig')}">${body}${arms(S, o, T)}${head}</g>`;
  }

  const bowlFront = (p, k = 1) => `<g transform="scale(${k})">
    <path d="M-54 0 Q-50 46 0 48 Q50 46 54 0 Z" fill="#fbfbf7" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M-48 18 Q0 30 48 18" fill="none" stroke="#4f7cc2" stroke-width="5"/>
    <ellipse cx="0" cy="0" rx="54" ry="12" fill="#fbfbf7" stroke="${INK}" stroke-width="4"/>
    <ellipse cx="0" cy="1" rx="45" ry="8" fill="${p.cream}"/></g>`;

  const babyBundle = (p) => `
    <ellipse cx="0" cy="0" rx="78" ry="40" fill="${p.red}" stroke="${INK}" stroke-width="4"/>
    <path d="M-60 -12 Q-10 6 50 -20" fill="none" stroke="${p.gold}" stroke-width="5"/>
    <circle cx="58" cy="-12" r="30" fill="${p.skin.fair}" stroke="${INK}" stroke-width="4"/>
    <path d="M47 -14 q4 4 8 0 M62 -14 q4 4 8 0" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="50" cy="-2" rx="6" ry="3.5" fill="${p.blush}" opacity=".6"/>`;

  function arms(S, o, T) {
    const p = S.p, r = o.robe, id = (n) => S.id(`${o.id}-${n}`);
    const sleeve = (m) => `<path transform="scale(${m} 1)" d="M-76 ${T + 6} Q-128 ${T + 70} -100 ${T + 150} L-24 ${T + 160} Q-34 ${T + 96} -56 ${T + 30} Z" fill="${r}" stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round"/>`;
    const cuff = (m) => `<path transform="scale(${m} 1)" d="M-100 ${T + 150} L-24 ${T + 160} L-22 ${T + 176} L-104 ${T + 166} Z" fill="${o.trim || p.cream}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
    const hands = `<circle cx="-34" cy="${T + 168}" r="17" fill="${o.skin}" stroke="${INK}" stroke-width="4"/><circle cx="34" cy="${T + 168}" r="17" fill="${o.skin}" stroke="${INK}" stroke-width="4"/>`;
    if (o.arms === 'down') return `
      <path d="M-76 ${T + 6} Q-130 ${T + 120} -118 ${T + 250} L-60 ${T + 250} Q-64 ${T + 120} -56 ${T + 30} Z" fill="${r}" stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round"/>
      <path d="M76 ${T + 6} Q130 ${T + 120} 118 ${T + 250} L60 ${T + 250} Q64 ${T + 120} 56 ${T + 30} Z" fill="${r}" stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round"/>`;
    let held = '';
    if (o.arms === 'hold') held = `<g id="${id('bowl')}" transform="translate(0 ${T + 150})">${bowlFront(p, 1.05)}</g>`;
    if (o.arms === 'tray') held = `<g transform="translate(0 ${T + 150})"><rect x="-90" y="0" width="180" height="16" rx="5" fill="${p.woodLo}" stroke="${INK}" stroke-width="4"/><g transform="translate(0 -2)">${bowlFront(p, .7).replace('<g transform="scale(0.7)">', '<g transform="translate(0 -32) scale(0.7)">')}</g></g>`;
    if (o.arms === 'baby') held = `<g id="${id('baby')}" transform="translate(-6 ${T + 140}) rotate(-12)">${babyBundle(p)}</g>`;
    return `<g id="${id('arms')}">${sleeve(1)}${sleeve(-1)}${cuff(1)}${cuff(-1)}${held}${hands}</g>`;
  }

  // face(S, id, { mouth, brows: worried|sly|flat|up, look: [dx, dy], t, blinkAt }) — call from update every frame
  function face(S, fid, o) {
    const q = (n) => S.q('#' + S.id(`${fid}-${n}`));
    for (const m of ['neutral', 'worried', 'scared', 'smirk', 'smile']) { const el = q('m-' + m); if (el) el.setAttribute('opacity', m === (o.mouth || 'neutral') ? 1 : 0); }
    const [dx, dy] = o.look || [0, 0];
    const period = o.period || 3.6, ph = ((o.t + (o.phase || 0)) % period) / period;
    const k = ph > 0.95 ? Math.max(0.08, Math.abs(ph - 0.975) / 0.025) : 1;
    for (const s of ['L', 'R']) { const e = q('eye' + s); if (e) e.setAttribute('transform', `translate(${dx} ${dy}) scale(1 ${k.toFixed(3)})`); }
    const a = { worried: 16, sly: -16, up: 8, flat: 0 }[o.brows || 'flat'], lift = o.brows === 'up' ? -6 : 0;
    const bl = q('browL'), br = q('browR');
    if (bl) bl.setAttribute('transform', `translate(0 ${lift}) rotate(${-a} -23 ${bl.getAttribute('d').split(' ')[1]})`);
    if (br) br.setAttribute('transform', `translate(0 ${lift}) rotate(${a} 23 ${br.getAttribute('d').split(' ')[1]})`);
    const sw = q('sweat'); if (sw) { const s = (o.t * 0.5) % 1; sw.setAttribute('transform', `translate(0 ${(s * 40).toFixed(1)})`); sw.setAttribute('opacity', (1 - s).toFixed(2)); }
  }

  // ---------- props ----------
  const lantern = (S, x, y, len, k = 1) => `<g transform="translate(${x} ${y})"><g class="sway">
    <line x1="0" y1="0" x2="0" y2="${len}" stroke="${INK}" stroke-width="3"/>
    <g transform="translate(0 ${len}) scale(${k})">
      <circle class="glow" cx="0" cy="62" r="150" fill="${S.u('glow')}" opacity=".55"/>
      <rect x="-26" y="0" width="52" height="14" rx="3" fill="${S.p.gold}" stroke="${INK}" stroke-width="3"/>
      <ellipse cx="0" cy="62" rx="58" ry="52" fill="${S.p.red}" stroke="${INK}" stroke-width="4"/>
      <path d="M-30 18 Q-44 62 -30 106 M0 10 V114 M30 18 Q44 62 30 106" fill="none" stroke="${S.p.redLo}" stroke-width="3"/>
      <ellipse cx="-18" cy="44" rx="10" ry="16" fill="#fff" opacity=".25"/>
      <rect x="-26" y="110" width="52" height="14" rx="3" fill="${S.p.gold}" stroke="${INK}" stroke-width="3"/>
      <path d="M0 124 V170" stroke="${S.p.gold}" stroke-width="6"/></g></g></g>`;

  const pillar = (S, x, w = 70) => `<g>
    <rect x="${x - w / 2}" y="40" width="${w}" height="700" fill="${S.p.red}" stroke="${INK}" stroke-width="4"/>
    <rect x="${x - w / 2 + 10}" y="40" width="12" height="700" fill="${S.p.redHi}"/><rect x="${x + w / 2 - 18}" y="40" width="18" height="700" fill="${S.p.redLo}"/>
    <rect x="${x - w / 2 - 10}" y="40" width="${w + 20}" height="34" fill="${S.p.gold}" stroke="${INK}" stroke-width="4"/>
    <rect x="${x - w / 2 - 10}" y="700" width="${w + 20}" height="30" fill="#e8dcc8" stroke="${INK}" stroke-width="4"/></g>`;

  const beam = (S) => `<rect x="-200" y="-200" width="2000" height="250" fill="${S.p.redLo}"/><rect x="-200" y="40" width="2000" height="22" fill="${S.p.gold}" stroke="${INK}" stroke-width="3"/>
    ${Array.from({ length: 22 }, (_, i) => `<circle cx="${-100 + i * 90}" cy="20" r="9" fill="${S.p.goldHi}"/>`).join('')}`;

  const floor = (S, y = 720, c1, c2) => `<rect x="-300" y="${y}" width="2200" height="500" fill="${c1 || S.p.wood}"/>
    ${Array.from({ length: 6 }, (_, i) => `<line x1="-300" x2="1900" y1="${y + 26 + i * 38 + i * i * 4}" y2="${y + 26 + i * 38 + i * i * 4}" stroke="${c2 || S.p.woodLo}" stroke-width="4"/>`).join('')}`;

  const roofHall = (S, x, y, w, h) => `<g>
    <rect x="${x - w / 2 + 30}" y="${y}" width="${w - 60}" height="${h}" fill="${S.p.red}" stroke="${INK}" stroke-width="4"/>
    ${Array.from({ length: 4 }, (_, i) => `<rect x="${x - w / 2 + 60 + i * (w - 120) / 4 + 14}" y="${y + h * .3}" width="${(w - 120) / 4 - 28}" height="${h * .45}" fill="${S.p.goldHi}" stroke="${INK}" stroke-width="3"/>`).join('')}
    <path d="M${x - w / 2 - 40} ${y + 6} Q${x - w / 2 + 10} ${y - 4} ${x - w / 2 + 40} ${y - 46} L${x + w / 2 - 40} ${y - 46} Q${x + w / 2 - 10} ${y - 4} ${x + w / 2 + 40} ${y + 6} Q${x + w / 2 - 10} ${y + 2} ${x + w / 2 - 30} ${y + 4} L${x - w / 2 + 30} ${y + 4} Q${x - w / 2 + 10} ${y + 2} ${x - w / 2 - 40} ${y + 6} Z" fill="${S.p.yellow}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M${x - w / 2 + 40} ${y - 46} L${x - w / 2 + 70} ${y - 80} L${x + w / 2 - 70} ${y - 80} L${x + w / 2 - 40} ${y - 46} Z" fill="${S.p.gold}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/></g>`;

  const tree = (S, x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})"><rect x="-10" y="-120" width="20" height="120" fill="${S.p.woodLo}" stroke="${INK}" stroke-width="3"/>
    <circle cx="0" cy="-170" r="80" fill="${S.p.leaf}" stroke="${INK}" stroke-width="4"/><circle cx="-50" cy="-130" r="50" fill="${S.p.leaf}" stroke="${INK}" stroke-width="4"/><circle cx="50" cy="-130" r="50" fill="${S.p.leaf}" stroke="${INK}" stroke-width="4"/>
    <circle cx="-20" cy="-195" r="26" fill="${S.p.leafHi}"/></g>`;

  const Scenery = {
    nursery: (S) => `<g data-depth=".2">
        <rect x="-300" y="-200" width="2200" height="1300" fill="${S.p.wall}"/><rect x="-300" y="540" width="2200" height="200" fill="${S.p.wallLo}"/>
        <circle cx="800" cy="330" r="200" fill="${S.p.woodLo}" stroke="${INK}" stroke-width="5"/>
        <circle cx="800" cy="330" r="180" fill="${S.u('window')}" stroke="${S.p.gold}" stroke-width="5"/>
        <circle class="glow" cx="900" cy="250" r="110" fill="${S.u('moonGlow')}"/><circle cx="900" cy="250" r="38" fill="#fff1c1"/>
        ${[[700, 220], [760, 180], [660, 300], [960, 360], [720, 400]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#fff"/>`).join('')}
        <path d="M600 420 Q700 380 760 300 Q800 250 880 230" fill="none" stroke="#5a3a2a" stroke-width="10" stroke-linecap="round"/>
        ${[[700, 370], [760, 300], [830, 245], [650, 405]].map(([x, y]) => [0, 72, 144, 216, 288].map(a => `<circle cx="${x + 9 * Math.cos(a * Math.PI / 180)}" cy="${y + 9 * Math.sin(a * Math.PI / 180)}" r="7" fill="${S.p.blossom}"/>`).join('')).join('')}
        ${beam(S)}</g>
      <g data-depth=".35">${pillar(S, 170)}${pillar(S, 1430)}</g>
      <g data-depth=".5">${floor(S)}</g>`,
    hall: (S) => `<g data-depth=".2">
        <rect x="-300" y="-200" width="2200" height="1300" fill="${S.p.jade}"/>
        ${Array.from({ length: 12 }, (_, i) => `<rect x="${-200 + i * 170}" y="80" width="150" height="460" fill="${S.p.jadeHi}" opacity=".35"/>`).join('')}
        <g transform="translate(800 0)">${[-330, -165, 0, 165].map(x => `<rect x="${x}" y="150" width="165" height="470" fill="${S.p.goldHi}" stroke="${INK}" stroke-width="4"/>
          <path d="M${x + 20} 420 Q${x + 60} 330 ${x + 90} 400 Q${x + 120} 300 ${x + 150} 380" fill="none" stroke="${S.p.red}" stroke-width="6" stroke-linecap="round"/>
          <circle cx="${x + 110}" cy="250" r="22" fill="${S.p.red}"/>`).join('')}</g>
        ${beam(S)}</g>
      <g data-depth=".35">${pillar(S, 150)}${pillar(S, 1450)}</g>
      <g data-depth=".5">${floor(S, 720, '#c98d4b', '#a8743c')}<rect x="420" y="750" width="760" height="120" fill="${S.p.red}" stroke="${S.p.gold}" stroke-width="8"/></g>`,
    courtyard: (S) => `<g data-depth=".1"><rect x="-300" y="-200" width="2200" height="1300" fill="${S.u('sky')}"/>
        <circle class="glow" cx="1240" cy="180" r="200" fill="${S.u('moonGlow')}"/><circle cx="1240" cy="180" r="62" fill="#fff1c1" stroke="${INK}" stroke-width="3"/>
        ${Array.from({ length: 26 }, (_, i) => `<circle cx="${(i * 397) % 1700 - 50}" cy="${(i * 173) % 330 + 30}" r="${2 + (i % 3)}" fill="#fff" opacity=".85"/>`).join('')}</g>
      <g data-depth=".25">${roofHall(S, 360, 470, 520, 200)}${roofHall(S, 1260, 450, 560, 220)}</g>
      <g data-depth=".4"><rect x="-300" y="660" width="2200" height="40" fill="#e8dcc8" stroke="${INK}" stroke-width="4"/>
        ${Array.from({ length: 30 }, (_, i) => `<rect x="${-260 + i * 75}" y="630" width="12" height="40" fill="#e8dcc8" stroke="${INK}" stroke-width="3"/>`).join('')}
        <rect x="-300" y="626" width="2200" height="12" fill="#e8dcc8" stroke="${INK}" stroke-width="3"/>
        ${tree(S, 80, 690, 1.1)}${tree(S, 1560, 690, 1)}</g>
      <g data-depth=".55">${floor(S, 700, '#8e7f99', '#7a6b86')}</g>`,
    table: (S) => `<g data-depth=".2"><rect x="-300" y="-200" width="2200" height="1300" fill="${S.p.wallLo}"/>
        <circle class="glow" cx="400" cy="200" r="380" fill="${S.u('glow')}" opacity=".6"/><circle class="glow" cx="1300" cy="260" r="300" fill="${S.u('glow')}" opacity=".45"/></g>
      <g data-depth=".5"><path d="M-300 560 L1900 560 L1900 1200 L-300 1200 Z" fill="${S.p.wood}"/>
        <rect x="-300" y="560" width="2200" height="18" fill="${S.p.woodLo}"/></g>`
  };

  const Props = {
    lantern, pillar, tree,
    bigBowl: (S) => `<g>
      <ellipse cx="0" cy="210" rx="250" ry="34" fill="#000" opacity=".18"/>
      <path d="M-300 0 Q-280 210 0 220 Q280 210 300 0 Z" fill="#fbfbf7" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M-270 90 Q0 150 270 90" fill="none" stroke="#4f7cc2" stroke-width="12"/>
      <path d="M-200 150 q30 -30 60 0 q30 30 60 0 M80 150 q30 -30 60 0" fill="none" stroke="#4f7cc2" stroke-width="7"/>
      <ellipse cx="0" cy="0" rx="300" ry="80" fill="#fbfbf7" stroke="${INK}" stroke-width="6"/>
      <ellipse cx="0" cy="6" rx="262" ry="62" fill="${S.p.cream}"/>
      <ellipse cx="-90" cy="-10" rx="70" ry="14" fill="#fff" opacity=".7"/>
      <ellipse id="${S.id('ripple')}" cx="0" cy="6" rx="120" ry="28" fill="none" stroke="#e6d6b8" stroke-width="5"/>
      <path id="${S.id('poison')}" opacity="0" d="M-120 10 Q-60 -30 0 6 Q60 40 120 0" fill="none" stroke="${S.p.poison}" stroke-width="12" stroke-linecap="round"/>
      <path id="${S.id('drop')}" opacity="0" d="M0 -40 Q-14 -10 0 0 Q14 -10 0 -40 Z" fill="${S.p.cream}" stroke="${INK}" stroke-width="3"/></g>`
  };

  // Style CSS for this kit: rounded bold captions, bright title cards, almost no grain.
  const css = document.createElement('style');
  css.textContent = `
    @font-face { font-family: "Fredoka"; font-weight: 600; src: url("lib/fonts/fredoka-latin-600-normal.woff2") format("woff2"); }
    @font-face { font-family: "Fredoka"; font-weight: 700; src: url("lib/fonts/fredoka-latin-700-normal.woff2") format("woff2"); }
    .caption { font-family: "Fredoka", sans-serif !important; font-style: normal !important; font-weight: 600; font-size: 56px !important; color: #fff !important;
      -webkit-text-stroke: 10px #2d2030; paint-order: stroke fill; word-spacing: .14em; text-shadow: 0 5px 0 #2d2030 !important; bottom: 70px !important; }
    .titlecard { font-family: "Fredoka", sans-serif !important; }
    .titlecard .small { font-family: "Fredoka", sans-serif !important; font-weight: 600; color: #ffd76a !important; letter-spacing: .18em !important; }
    .titlecard .big { font-family: "Fredoka", sans-serif !important; font-weight: 700 !important; color: #fff !important; -webkit-text-stroke: 12px #2d2030; paint-order: stroke fill; }
    .grain { opacity: .04 !important; }
    svg.scene .warm { display: none; }`;
  document.head.appendChild(css);

  window.FlatStyle = { palette, defs, border, Scenery, Props, person, face, bowlFront, babyBundle };
})();
