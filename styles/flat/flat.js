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
    const T = o.kneel ? -290 : -400, ck = o.child ? 0.68 : 1, HY = T * ck - 70, hw = o.kneel ? 165 : 130;
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
      <rect x="-17" y="${T - 34}" width="34" height="40" fill="${o.skin}" stroke="${INK}" stroke-width="4"/>`;

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
    if (o.hair === 'knot') front = `<circle cx="0" cy="${HY - 76}" r="22" fill="${hairC}" stroke="${INK}" stroke-width="4"/>${cap}
      <path d="M-4 ${HY - 92} l-26 -14 l4 22 Z M4 ${HY - 92} l26 -14 l-4 22 Z" fill="${p.red}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><circle cx="0" cy="${HY - 92}" r="7" fill="${p.gold}" stroke="${INK}" stroke-width="2"/>`;
    if (o.hair === 'capGold') front = `
      <path d="M-58 ${HY - 30} Q-60 ${HY - 104} 0 ${HY - 106} Q60 ${HY - 104} 58 ${HY - 30} Z" fill="${hairC}" stroke="${INK}" stroke-width="4"/>
      <rect x="-62" y="${HY - 42}" width="124" height="18" rx="6" fill="${p.gold}" stroke="${INK}" stroke-width="3"/><circle cx="0" cy="${HY - 33}" r="7" fill="${p.red}" stroke="${INK}" stroke-width="2"/>
      <path d="M-60 ${HY - 50} L-170 ${HY - 44} M60 ${HY - 50} L170 ${HY - 44}" stroke="${hairC}" stroke-width="10" stroke-linecap="round"/>`;
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
      smile: `<path d="M-17 -2 Q0 14 17 -2" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`,
      talk: `<ellipse cx="0" cy="2" rx="8" ry="6" fill="#7a2733" stroke="${INK}" stroke-width="3"/>`
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
      ${o.beard ? `<path d="M-26 ${HY + 26} Q-14 ${HY + 18} 0 ${HY + 24} Q14 ${HY + 18} 26 ${HY + 26}" fill="none" stroke="${o.beard === 'grey' ? '#9a93a0' : INK}" stroke-width="6" stroke-linecap="round"/>
        <path d="M-12 ${HY + 46} Q0 ${HY + 96} 12 ${HY + 46} Z" fill="${o.beard === 'grey' ? '#bdb6c2' : p.hair}" stroke="${INK}" stroke-width="3"/>` : ''}
      <path id="${id('tear')}" opacity="0" d="M-30 ${HY + 8} Q-37 ${HY + 22} -30 ${HY + 28} Q-23 ${HY + 22} -30 ${HY + 8} Z" fill="#9fd8ff" stroke="${INK}" stroke-width="2.5"/>
      ${front}
      ${o.tired ? `<path id="${id('sweat')}" d="M70 ${HY - 30} Q62 ${HY - 14} 70 ${HY - 8} Q78 ${HY - 14} 70 ${HY - 30} Z" fill="#9fd8ff" stroke="${INK}" stroke-width="2.5"/>` : ''}
    </g>`;

    const lower = body + arms(S, o, T);
    return `<g id="${id('fig')}">${o.child ? `<g transform="scale(${ck})">${lower}</g>` : lower}${head}</g>`;
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
    if (o.arms === 'box') held = `<g id="${id('box')}" transform="translate(0 ${T + 140})"><rect x="-56" y="-30" width="112" height="56" rx="8" fill="${p.redLo}" stroke="${INK}" stroke-width="4"/><rect x="-56" y="-30" width="112" height="16" rx="6" fill="${p.red}" stroke="${INK}" stroke-width="3"/><path d="M-36 6 h72" stroke="${p.gold}" stroke-width="4"/>${[-30, 0, 30].map(x => `<circle cx="${x}" cy="-36" r="11" fill="${p.blossom}" stroke="${INK}" stroke-width="3"/>`).join('')}</g>`;
    if (o.arms === 'baby') held = `<g id="${id('baby')}" transform="translate(-6 ${T + 140}) rotate(-12)">${babyBundle(p)}</g>`;
    return `<g id="${id('arms')}">${sleeve(1)}${sleeve(-1)}${cuff(1)}${cuff(-1)}${held}${hands}</g>`;
  }

  // face(S, id, { mouth, brows: worried|sly|flat|up, look: [dx, dy], t, blinkAt }) — call from update every frame
  function face(S, fid, o) {
    const q = (n) => S.q('#' + S.id(`${fid}-${n}`));
    for (const m of ['neutral', 'worried', 'scared', 'smirk', 'smile', 'talk']) { const el = q('m-' + m); if (el) el.setAttribute('opacity', m === (o.mouth || 'neutral') ? 1 : 0); }
    const [dx, dy] = o.look || [0, 0];
    const period = o.period || 3.6, ph = ((o.t + (o.phase || 0)) % period) / period;
    const k = (ph > 0.95 ? Math.max(0.08, Math.abs(ph - 0.975) / 0.025) : 1) * (o.sleepy ?? 1);
    for (const s of ['L', 'R']) { const e = q('eye' + s); if (e) e.setAttribute('transform', `translate(${dx} ${dy}) scale(1 ${k.toFixed(3)})`); }
    const a = { worried: 16, sly: -16, up: 8, flat: 0 }[o.brows || 'flat'], lift = o.brows === 'up' ? -6 : 0;
    const bl = q('browL'), br = q('browR');
    if (bl) bl.setAttribute('transform', `translate(0 ${lift}) rotate(${-a} -23 ${bl.getAttribute('d').split(' ')[1]})`);
    if (br) br.setAttribute('transform', `translate(0 ${lift}) rotate(${a} 23 ${br.getAttribute('d').split(' ')[1]})`);
    const tr = q('tear'); if (tr) { if (o.cry) { const c = (o.t * 0.45) % 1; tr.setAttribute('opacity', (1 - c * c).toFixed(2)); tr.setAttribute('transform', `translate(0 ${(c * 60).toFixed(1)})`); } else tr.setAttribute('opacity', 0); }
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

  // ---------- more sets and props (added for The Prince With Two Mothers; reusable) ----------
  const esc = (t) => String(t).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  // label(S, x, y, text, size, id): dark rounded tag with gold text, centred on x
  const label = (S, x, y, text, size = 44, lid = '') => {
    const w = text.length * size * 0.56 + size * 1.2, h = size * 1.55;
    return `<g ${lid ? `id="${S.id(lid)}"` : ''} transform="translate(${x} ${y})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${h / 2.6}" fill="${S.p.ink}" stroke="${S.p.gold}" stroke-width="4"/>
      <text x="0" y="${size * 0.36}" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="600" font-size="${size}" fill="${S.p.goldHi}">${esc(text)}</text></g>`;
  };
  // bubble(S, x, y, r, inner, bid): thought/memory bubble; inner is drawn centred on (0,0) and clipped to the circle
  const bubble = (S, x, y, r, inner, bid, tail = [-1, 1]) => `<g id="${S.id(bid)}" transform="translate(${x} ${y})">
      <clipPath id="${S.id(bid + '-clip')}"><circle cx="0" cy="0" r="${r}"/></clipPath>
      <circle cx="${tail[0] * r * .9}" cy="${tail[1] * r * .95}" r="${r * .12}" fill="#fff" stroke="${S.p.ink}" stroke-width="4"/>
      <circle cx="${tail[0] * r * 1.12}" cy="${tail[1] * r * 1.2}" r="${r * .07}" fill="#fff" stroke="${S.p.ink}" stroke-width="3"/>
      <circle cx="0" cy="0" r="${r + 8}" fill="#fff" stroke="${S.p.ink}" stroke-width="5"/>
      <g clip-path="url(#${S.id(bid + '-clip')})">${inner}</g></g>`;

  const candle = (S, x, y, cid = '') => `<g ${cid ? `id="${S.id(cid)}"` : ''} transform="translate(${x} ${y})"><rect x="-40" y="-10" width="80" height="12" rx="4" fill="${S.p.gold}" stroke="${INK}" stroke-width="3"/>
    <rect x="-12" y="-80" width="24" height="70" fill="${S.p.cream}" stroke="${INK}" stroke-width="3"/>
    <g class="cflame"><circle class="glow" cx="0" cy="-104" r="110" fill="${S.u('glow')}" opacity=".7"/>
    <g transform="translate(0 -82)"><path class="flame" d="M0 0 Q-14 -22 0 -46 Q14 -22 0 0 Z" fill="#ffb02e" stroke="${INK}" stroke-width="3"/></g></g></g>`;

  const lattice = (S, x, y, w, h, sky) => `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${sky}" stroke="${S.p.woodLo}" stroke-width="14"/>
    ${Array.from({ length: Math.floor(w / 60) }, (_, i) => `<line x1="${x + (i + 1) * w / Math.ceil(w / 60)}" y1="${y}" x2="${x + (i + 1) * w / Math.ceil(w / 60)}" y2="${y + h}" stroke="${S.p.woodLo}" stroke-width="6"/>`).join('')}
    ${Array.from({ length: Math.floor(h / 60) }, (_, i) => `<line x1="${x}" y1="${y + (i + 1) * h / Math.ceil(h / 60)}" x2="${x + w}" y2="${y + (i + 1) * h / Math.ceil(h / 60)}" stroke="${S.p.woodLo}" stroke-width="6"/>`).join('')}</g>`;

  const bedBack = (S, x, y) => `<g transform="translate(${x} ${y})">
    <rect x="-330" y="-560" width="20" height="560" fill="${S.p.redLo}" stroke="${INK}" stroke-width="4"/><rect x="310" y="-560" width="20" height="560" fill="${S.p.redLo}" stroke="${INK}" stroke-width="4"/>
    <rect x="-350" y="-590" width="700" height="50" fill="${S.p.red}" stroke="${INK}" stroke-width="4"/><rect x="-350" y="-550" width="700" height="12" fill="${S.p.gold}"/>
    <path d="M-310 -540 Q-260 -360 -300 -150 L-240 -150 Q-230 -380 -200 -540 Z M310 -540 Q260 -360 300 -150 L240 -150 Q230 -380 200 -540 Z" fill="${S.p.pink}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <rect x="-300" y="-300" width="600" height="160" fill="${S.p.woodLo}" stroke="${INK}" stroke-width="4"/>
    <ellipse cx="-180" cy="-170" rx="80" ry="30" fill="${S.p.cream}" stroke="${INK}" stroke-width="4"/></g>`;
  const bedFront = (S, x, y, blanket = S.p.jade) => `<g transform="translate(${x} ${y})">
    <path d="M-320 -170 Q0 -200 320 -170 L320 -80 L-320 -80 Z" fill="${blanket}" stroke="${INK}" stroke-width="4"/>
    <path d="M-300 -150 Q-150 -170 0 -150 Q150 -170 300 -150" fill="none" stroke="${S.p.goldHi}" stroke-width="5"/>
    <rect x="-340" y="-90" width="680" height="90" fill="${S.p.wood}" stroke="${INK}" stroke-width="5"/>
    <rect x="-320" y="-70" width="640" height="16" fill="${S.p.gold}" opacity=".8"/></g>`;

  const desk = (S, x, y, did = 'paper') => `<g transform="translate(${x} ${y})">
    <rect x="-300" y="-40" width="600" height="30" fill="${S.p.woodLo}" stroke="${INK}" stroke-width="4"/>
    <rect x="-280" y="-10" width="560" height="150" fill="${S.p.wood}" stroke="${INK}" stroke-width="4"/>
    <rect x="-150" y="-62" width="240" height="26" fill="#fffaf0" stroke="${INK}" stroke-width="3"/>
    <g id="${S.id(did)}">${Array.from({ length: 6 }, (_, i) => `<path class="stroke${i}" d="M${-130 + i * 38} -56 l0 14 M${-138 + i * 38} -50 l16 0" stroke="${INK}" stroke-width="4" stroke-linecap="round" opacity="0"/>`).join('')}</g>
    <rect x="140" y="-58" width="70" height="22" rx="6" fill="#3a3540" stroke="${INK}" stroke-width="3"/>
    <rect x="-250" y="-90" width="36" height="52" fill="${S.p.jadeLo}" stroke="${INK}" stroke-width="3"/>
    <path d="M-240 -90 l-6 -40 M-226 -90 l2 -44 M-216 -90 l8 -36" stroke="${S.p.woodLo}" stroke-width="5" stroke-linecap="round"/></g>`;

  const throne = (S, x, y) => `<g transform="translate(${x} ${y})">
    <rect x="-260" y="-40" width="520" height="40" fill="${S.p.gold}" stroke="${INK}" stroke-width="4"/><rect x="-220" y="-80" width="440" height="40" fill="${S.p.goldHi}" stroke="${INK}" stroke-width="4"/>
    <path d="M-180 -80 L-190 -460 Q0 -540 190 -460 L180 -80 Z" fill="${S.p.red}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M-150 -110 L-158 -430 Q0 -500 158 -430 L150 -110 Z" fill="none" stroke="${S.p.gold}" stroke-width="8"/>
    <circle cx="0" cy="-420" r="30" fill="${S.p.gold}" stroke="${INK}" stroke-width="4"/>
    <rect x="-230" y="-260" width="50" height="180" rx="12" fill="${S.p.gold}" stroke="${INK}" stroke-width="4"/><rect x="180" y="-260" width="50" height="180" rx="12" fill="${S.p.gold}" stroke="${INK}" stroke-width="4"/></g>`;

  const beadCurtain = (S, x, y, w, h, cid = 'curtain') => `<g id="${S.id(cid)}" transform="translate(${x} ${y})">
    <rect x="-10" y="-20" width="${w + 20}" height="20" fill="${S.p.gold}" stroke="${INK}" stroke-width="3"/>
    ${Array.from({ length: Math.floor(w / 26) }, (_, i) => `<line x1="${i * 26 + 10}" y1="0" x2="${i * 26 + 10}" y2="${h}" stroke="${S.p.goldHi}" stroke-width="4" stroke-dasharray="10 6" opacity=".85"/>`).join('')}</g>`;

  const coffin = (S, x, y) => `<g transform="translate(${x} ${y})">
    <rect x="-330" y="-30" width="660" height="30" fill="${S.p.woodLo}" stroke="${INK}" stroke-width="4"/>
    <path d="M-300 -30 L-280 -230 L280 -230 L300 -30 Z" fill="#5a2a2a" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M-290 -250 L290 -250 L310 -200 Q200 -150 0 -170 Q-200 -150 -310 -200 Z" fill="#fbfbf7" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M-120 -250 L-140 -120 M120 -250 L140 -120" stroke="#fbfbf7" stroke-width="40"/><path d="M-120 -250 L-140 -120 M120 -250 L140 -120" stroke="${INK}" stroke-width="2" opacity=".3"/></g>`;

  const crown = (S, x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-60 30 L-70 -30 L-35 0 L0 -50 L35 0 L70 -30 L60 30 Z" fill="${S.p.gold}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><circle cx="0" cy="8" r="10" fill="${S.p.red}" stroke="${INK}" stroke-width="3"/></g>`;
  const scrollMsg = (S, x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})"><rect x="-50" y="-16" width="100" height="32" fill="#fffaf0" stroke="${INK}" stroke-width="4"/><rect x="-60" y="-22" width="16" height="44" rx="6" fill="${S.p.woodLo}" stroke="${INK}" stroke-width="3"/><rect x="44" y="-22" width="16" height="44" rx="6" fill="${S.p.woodLo}" stroke="${INK}" stroke-width="3"/><path d="M-30 -4 h60 M-30 6 h40" stroke="${S.p.red}" stroke-width="4"/></g>`;

  // a small muddy village, drawn around (0,0), radius ~200 (for memory bubbles)
  const village = (S, baby = false) => `<rect x="-260" y="-260" width="520" height="520" fill="#9ad3e8"/>
    <circle cx="120" cy="-90" r="34" fill="#fff3b0"/>
    <path d="M-260 40 Q-100 0 60 30 Q180 50 260 20 L260 260 L-260 260 Z" fill="#a0784a"/>
    <path d="M-260 110 Q0 80 260 110 L260 260 L-260 260 Z" fill="#8a6038"/>
    <g transform="translate(-110 40)"><rect x="-8" y="-170" width="16" height="170" fill="#5a3a2a"/>${Array.from({ length: 7 }, (_, i) => `<path d="M0 -165 Q${-70 + i * 22} -120 ${-80 + i * 26} ${-20 - (i % 2) * 20}" fill="none" stroke="${S.p.leaf}" stroke-width="6"/>`).join('')}</g>
    <g transform="translate(90 70)"><rect x="-70" y="-80" width="140" height="80" fill="#c9a26b" stroke="${INK}" stroke-width="4"/><path d="M-95 -78 L0 -150 L95 -78 Z" fill="#8a6a3a" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><rect x="-18" y="-48" width="36" height="48" fill="#5a3a2a"/></g>
    ${baby ? `<g transform="translate(-20 150)"><ellipse cx="0" cy="0" rx="60" ry="30" fill="#c9b49a" stroke="${INK}" stroke-width="4"/><circle cx="46" cy="-8" r="24" fill="${S.p.skin.peasant}" stroke="${INK}" stroke-width="4"/><path d="M36 -12 q4 -3 8 0 M50 -12 q4 -3 8 0" fill="none" stroke="${INK}" stroke-width="3"/><ellipse cx="47" cy="4" rx="6" ry="5" fill="#7a2733"/><path d="M38 -2 q-3 8 0 12" stroke="#9fd8ff" stroke-width="4"/></g>` : ''}`;

  Object.assign(Scenery, {
    bedchamber: (S, night = false) => `<g data-depth=".2">
        <rect x="-300" y="-200" width="2200" height="1300" fill="${night ? '#4a5a8c' : S.p.wall}"/><rect x="-300" y="540" width="2200" height="200" fill="${night ? '#3d4a78' : S.p.wallLo}"/>
        ${lattice(S, 150, 170, 380, 300, night ? S.u('window') : '#ffd9a8')}
        ${night ? `<circle cx="430" cy="250" r="30" fill="#fff1c1"/>` : `<circle cx="300" cy="420" r="60" fill="#ffb26b" opacity=".9"/>`}
        ${beam(S)}</g>
      <g data-depth=".5">${floor(S, 720, night ? '#7a5a4a' : S.p.wood, night ? '#664a3c' : S.p.woodLo)}</g>`,
    study: (S) => `<g data-depth=".2">
        <rect x="-300" y="-200" width="2200" height="1300" fill="#f3dcb0"/><rect x="-300" y="560" width="2200" height="180" fill="#e6c48e"/>
        ${[160, 1180].map(x => `<g transform="translate(${x} 150)"><rect x="0" y="0" width="260" height="400" fill="${S.p.woodLo}" stroke="${INK}" stroke-width="4"/>
          ${[0, 1, 2, 3].map(r => `<rect x="10" y="${20 + r * 95}" width="240" height="10" fill="${S.p.wood}"/>${Array.from({ length: 5 }, (_, i) => `<circle cx="${40 + i * 45}" cy="${70 + r * 95}" r="18" fill="${['#fffaf0', '#f2b632', '#fffaf0', '#e8574a', '#fffaf0'][i]}" stroke="${INK}" stroke-width="3"/>`).join('')}`).join('')}</g>`).join('')}
        <circle cx="800" cy="300" r="150" fill="#bfe3c2" stroke="${S.p.woodLo}" stroke-width="16"/>
        ${[740, 790, 850].map((x, i) => `<path d="M${x} 450 Q${x + 10} 300 ${x - 6} 160" stroke="${S.p.leaf}" stroke-width="12" fill="none"/>`).join('')}
        ${beam(S)}</g>
      <g data-depth=".5">${floor(S, 740, '#c98d4b', '#a8743c')}</g>`,
    garden: (S) => `<g data-depth=".1"><rect x="-300" y="-200" width="2200" height="1300" fill="#9ad7f0"/>
        <circle cx="1300" cy="140" r="60" fill="#fff3b0"/>
        <ellipse cx="300" cy="140" rx="120" ry="34" fill="#fff" opacity=".9"/><ellipse cx="380" cy="120" rx="80" ry="30" fill="#fff" opacity=".9"/></g>
      <g data-depth=".25">${roofHall(S, 1200, 430, 420, 170)}<rect x="-300" y="560" width="2200" height="700" fill="#7cc47f"/></g>
      <g data-depth=".4">
        <ellipse cx="420" cy="720" rx="330" ry="80" fill="#4fa3d1" stroke="${INK}" stroke-width="4"/>
        <g id="${S.id('koi')}"><path d="M330 720 q30 -14 60 0 q-30 14 -60 0 Z M390 720 l16 -10 l0 20 Z" fill="#ff8c3a" stroke="${INK}" stroke-width="2"/><path d="M470 740 q26 -12 52 0 q-26 12 -52 0 Z M522 740 l14 -9 l0 18 Z" fill="#fff" stroke="${INK}" stroke-width="2"/></g>
        ${[[120, 620], [1500, 640]].map(([x, y]) => `<g transform="translate(${x} ${y})"><path d="M0 0 Q-20 -120 30 -200 M30 -200 Q80 -260 140 -240 M30 -200 Q-30 -260 -80 -250" fill="none" stroke="#5a3a2a" stroke-width="14" stroke-linecap="round"/>
          ${[[30, -200], [140, -240], [-80, -250], [80, -230], [-20, -230], [100, -270]].map(([a, b]) => [0, 72, 144, 216, 288].map(g => `<circle cx="${a + 14 * Math.cos(g * Math.PI / 180)}" cy="${b + 14 * Math.sin(g * Math.PI / 180)}" r="12" fill="${S.p.blossom}"/>`).join('')).join('')}</g>`).join('')}
        <path d="M1380 760 q20 -90 80 -70 q40 -60 80 0 q50 10 30 70 Z" fill="#9a93a0" stroke="${INK}" stroke-width="4"/></g>
      <g data-depth=".55"><path d="M600 900 L760 740 L980 740 L1100 900 Z" fill="#e8dcc8" stroke="${INK}" stroke-width="4"/></g>`,
    palaceWall: (S) => `<g data-depth=".1"><rect x="-300" y="-200" width="2200" height="1300" fill="#ff9e6b"/>
        <rect x="-300" y="-200" width="2200" height="300" fill="#ff7f7f" opacity=".6"/><circle class="glow" cx="1150" cy="300" r="260" fill="${S.u('glow')}"/><circle cx="1150" cy="300" r="70" fill="#ffd76a"/></g>
      <g data-depth=".2">${Array.from({ length: 12 }, (_, i) => `<path d="M${-200 + i * 170} 420 l40 -50 h90 l40 50 Z" fill="#6a4a7a"/><rect x="${-180 + i * 170}" y="420" width="130" height="60" fill="#6a4a7a"/><rect x="${-150 + i * 170}" y="440" width="20" height="18" fill="#ffd76a"/>`).join('')}</g>
      <g data-depth=".35"><rect x="-300" y="470" width="2200" height="330" fill="${S.p.red}" stroke="${INK}" stroke-width="5"/>
        <path d="M-300 470 L1900 470 L1900 440 Q800 420 -300 440 Z" fill="${S.p.yellow}" stroke="${INK}" stroke-width="5"/>
        ${Array.from({ length: 30 }, (_, i) => `<line x1="${-280 + i * 75}" y1="446" x2="${-280 + i * 75}" y2="468" stroke="${INK}" stroke-width="3"/>`).join('')}</g>
      <g data-depth=".5">${floor(S, 790, '#c9b49a', '#b39d82')}</g>`,
    hallDoor: (S) => `<g data-depth=".2"><rect x="-300" y="-200" width="2200" height="1300" fill="#bfe3f0"/>
        <rect x="200" y="150" width="1200" height="600" fill="${S.p.red}" stroke="${INK}" stroke-width="5"/>
        <path d="M120 170 Q300 140 360 90 L1240 90 Q1300 140 1480 170 Z" fill="${S.p.yellow}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
        <g id="${S.id('door')}"><rect x="620" y="260" width="360" height="490" fill="${S.p.redLo}" stroke="${INK}" stroke-width="5"/><line x1="800" y1="260" x2="800" y2="750" stroke="${INK}" stroke-width="5"/>
        ${[0, 1, 2, 3, 4].map(r => [0, 1, 2, 3, 4, 5].map(c => `<circle cx="${650 + c * 60 + (c > 2 ? 10 : 0)}" cy="${300 + r * 90}" r="8" fill="${S.p.gold}"/>`).join('')).join('')}</g>
        ${pillar(S, 300)}${pillar(S, 1300)}</g>
      <g data-depth=".5"><rect x="-300" y="740" width="2200" height="400" fill="#e8dcc8"/><rect x="-300" y="740" width="2200" height="16" fill="#cfc2ac"/></g>`,
    throneRoom: (S) => `<g data-depth=".2"><rect x="-300" y="-200" width="2200" height="1300" fill="${S.p.redLo}"/>
        ${Array.from({ length: 10 }, (_, i) => `<rect x="${-100 + i * 200}" y="60" width="160" height="600" fill="${S.p.red}" opacity=".5"/>`).join('')}
        <rect x="430" y="120" width="740" height="520" fill="${S.p.goldHi}" stroke="${INK}" stroke-width="5"/>
        ${[0, 1, 2, 3].map(i => `<path d="M${470 + i * 180} 560 q40 -120 80 -60 q30 -80 70 -10" fill="none" stroke="${S.p.red}" stroke-width="6"/>`).join('')}
        ${beam(S)}</g>
      <g data-depth=".35">${pillar(S, 150)}${pillar(S, 1450)}</g>
      <g data-depth=".5">${floor(S, 720, '#c98d4b', '#a8743c')}</g>`,
    parchment: (S) => `<rect x="-300" y="-200" width="2200" height="1300" fill="#f3e3c0"/>
      <rect x="120" y="90" width="1360" height="720" fill="#f8ecd2" stroke="#c9a26b" stroke-width="8"/>
      <rect x="80" y="70" width="40" height="760" rx="18" fill="${S.p.woodLo}" stroke="${INK}" stroke-width="4"/><rect x="1480" y="70" width="40" height="760" rx="18" fill="${S.p.woodLo}" stroke="${INK}" stroke-width="4"/>`,
    chinaMap: (S) => `${Scenery.parchment(S)}
      <path d="M430 330 L520 250 L640 220 L760 170 L900 160 L1030 120 L1140 150 L1120 230 L1060 280 L1100 340 L1040 400 L1080 470 L1030 560 L960 640 L860 700 L740 720 L620 700 L520 640 L470 560 L400 500 L380 420 Z" fill="#cfe7a8" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M470 380 Q560 330 640 360 Q700 300 760 330 Q820 360 860 330 Q930 300 1000 360" fill="none" stroke="#4f7cc2" stroke-width="12" stroke-linecap="round"/>
      <path d="M520 560 Q640 520 760 560 Q880 590 1010 540" fill="none" stroke="#4f7cc2" stroke-width="10" stroke-linecap="round" opacity=".8"/>
      <text x="880" y="300" font-family="Fredoka, sans-serif" font-weight="600" font-size="30" fill="#2f5a99">Yellow River</text>
      <text x="760" y="640" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="54" fill="${S.p.ink}" opacity=".85">SONG EMPIRE</text>`
  });
  Object.assign(Props, { label, bubble, candle, bedBack, bedFront, desk, throne, beadCurtain, coffin, crown, scrollMsg, village, lattice });

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
