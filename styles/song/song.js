/* Song dynasty China (960-1279): palette, borders and set pieces.
 *
 * Every function returns SVG markup in the 1600x900 stage space.
 * Most take S (from Stage: S.p palette, S.u('name') -> url(#scene-name), S.id('name')).
 * Figures stand with their feet at (0,0), face RIGHT, and are about 400 units tall.
 * Wrap them in <g transform="translate(x,y) scale(k)"> to place, scale(-k,k) to face left.
 */
(function () {
  const palette = {
    void: '#0b0504', wall: '#2a0c07', paperHi: '#ffdd9e', paperMid: '#f0a14d', paperLow: '#a8421a', paperEdge: '#3a0e06',
    lacquer: '#9a1f14', lacquerHi: '#cf4a2c', lacquerDark: '#3d0b07', gold: '#d8a547', vermilion: '#b8321e',
    ink: '#0e0605', inkEdge: '#f0b765', cast: '#1a0502', floorHi: '#2a120a', floorLow: '#0c0504',
    lanternHi: '#ffb35a', lanternMid: '#c8281a', lanternLow: '#5e0c08', flame: '#ffd27a', flameCore: '#fff3cc',
    skyTop: '#1c1024', skyMid: '#6e2f2a', skyLow: '#f2a65a', hill1: '#5a2a22', hill2: '#3a1a17', hill3: '#1e0d0b',
    mud: '#24150c', water: '#f6c27a', porcelain: '#efe6d2', milk: '#fbf4e4', blood: '#c0281c', jade: '#6f8f6a'
  };

  // ---------- gradients / patterns, one set per scene (ids prefixed) ----------
  const defs = (p, pre) => `
<defs>
  <radialGradient id="${pre}-paperGlow" cx="760" cy="430" r="820" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="${p.paperHi}"/><stop offset=".35" stop-color="${p.paperMid}"/>
    <stop offset=".72" stop-color="${p.paperLow}"/><stop offset="1" stop-color="${p.paperEdge}"/>
  </radialGradient>
  <radialGradient id="${pre}-lanternBody" cx=".4" cy=".4" r=".7">
    <stop offset="0" stop-color="${p.lanternHi}"/><stop offset=".55" stop-color="${p.lanternMid}"/><stop offset="1" stop-color="${p.lanternLow}"/>
  </radialGradient>
  <radialGradient id="${pre}-warmGlow"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".55"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></radialGradient>
  <radialGradient id="${pre}-milkGlow"><stop offset="0" stop-color="#fffaf0" stop-opacity=".9"/><stop offset=".6" stop-color="${p.milk}" stop-opacity=".9"/><stop offset="1" stop-color="#d9c9a8" stop-opacity="1"/></radialGradient>
  <radialGradient id="${pre}-redPulse" cx=".5" cy=".5" r=".7"><stop offset=".35" stop-color="${p.blood}" stop-opacity="0"/><stop offset="1" stop-color="${p.blood}" stop-opacity=".75"/></radialGradient>
  <linearGradient id="${pre}-colGrad" x1="0" x2="1">
    <stop offset="0" stop-color="${p.lacquerDark}"/><stop offset=".3" stop-color="${p.lacquerHi}"/>
    <stop offset=".55" stop-color="${p.lacquer}"/><stop offset="1" stop-color="${p.lacquerDark}"/>
  </linearGradient>
  <linearGradient id="${pre}-floorGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${p.floorHi}"/><stop offset="1" stop-color="${p.floorLow}"/>
  </linearGradient>
  <linearGradient id="${pre}-sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${p.skyTop}"/><stop offset=".55" stop-color="${p.skyMid}"/><stop offset="1" stop-color="${p.skyLow}"/>
  </linearGradient>
  <linearGradient id="${pre}-mist" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${p.skyLow}" stop-opacity="0"/><stop offset="1" stop-color="${p.skyLow}" stop-opacity=".55"/>
  </linearGradient>
  <linearGradient id="${pre}-door" x1="0" x2="1">
    <stop offset="0" stop-color="${p.lacquerDark}"/><stop offset=".5" stop-color="${p.vermilion}"/><stop offset="1" stop-color="${p.lacquerDark}"/>
  </linearGradient>
  <radialGradient id="${pre}-vignette" cx=".5" cy=".48" r=".75">
    <stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".78"/>
  </radialGradient>
  <pattern id="${pre}-lattice" width="96" height="96" patternUnits="userSpaceOnUse" x="-100" y="150">
    <rect width="96" height="96" fill="none" stroke="${p.lacquerDark}" stroke-width="8"/>
    <path d="M48 7 L89 48 L48 89 L7 48Z" fill="none" stroke="${p.lacquer}" stroke-width="4"/>
    <rect x="38" y="38" width="20" height="20" fill="none" stroke="${p.lacquer}" stroke-width="3"/>
    <path d="M48 7V38 M48 58V89 M7 48H38 M58 48H89" stroke="${p.lacquer}" stroke-width="3"/>
  </pattern>
  <pattern id="${pre}-grille" width="60" height="60" patternUnits="userSpaceOnUse">
    <rect width="60" height="60" fill="none" stroke="${p.ink}" stroke-width="7"/>
    <path d="M30 0V60 M0 30H60" stroke="${p.ink}" stroke-width="3"/>
    <rect x="18" y="18" width="24" height="24" fill="none" stroke="${p.ink}" stroke-width="3"/>
  </pattern>
  <pattern id="${pre}-fret" width="32" height="32" patternUnits="userSpaceOnUse">
    <rect width="32" height="32" fill="${p.lacquerDark}"/>
    <path d="M4 28V4H28V24H10V10H22V18H16" fill="none" stroke="${p.gold}" stroke-width="2.4"/>
  </pattern>
  <pattern id="${pre}-beamDots" width="40" height="26" patternUnits="userSpaceOnUse">
    <rect width="40" height="26" fill="${p.lacquer}"/>
    <circle cx="20" cy="13" r="6" fill="none" stroke="${p.gold}" stroke-width="2"/><circle cx="20" cy="13" r="2" fill="${p.gold}"/>
  </pattern>
  <filter id="${pre}-cast" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.5"/></filter>
  <filter id="${pre}-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
  <filter id="${pre}-defocus" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>
</defs>`;

  // Key-fret frame around the whole picture (drawn outside the camera, never moves)
  const border = (p) => `
    <path d="M0,0H1600V900H0Z M30,30V870H1570V30Z" fill="url(#__FRET__)" fill-rule="evenodd"/>
    <rect x="30" y="30" width="1540" height="840" fill="none" stroke="${p.gold}" stroke-width="2.5"/>
    <rect x="3" y="3" width="1594" height="894" fill="none" stroke="${p.gold}" stroke-width="2"/>`;

  const cut = (p, o = .55) => `stroke="${p.inkEdge}" stroke-opacity="${o}" stroke-width="1.6"`;

  // ---------- scenery ----------
  const Scenery = {
    paperScreen: (S) => `<rect class="paper" x="-200" y="100" width="2000" height="680" fill="${S.u('paperGlow')}"/>`,
    latticeWall: ({ p, u }) => `
      <rect x="-200" y="150" width="2000" height="480" fill="${u('lattice')}"/>
      <rect x="-200" y="140" width="2000" height="16" fill="${p.lacquerDark}"/>
      <rect x="-200" y="622" width="2000" height="18" fill="${p.lacquerDark}"/>
      <line x1="-200" y1="640" x2="1800" y2="640" stroke="${p.gold}" stroke-opacity=".6" stroke-width="2"/>
      <rect x="-200" y="640" width="2000" height="112" fill="${p.wall}"/>
      ${Array.from({ length: 15 }, (_, i) => `<rect x="${-180 + i * 150}" y="656" width="126" height="80" fill="none" stroke="${p.gold}" stroke-opacity=".22" stroke-width="2"/>`).join('')}`,
    ceilingBeam: ({ p, u }) => `
      <rect x="-200" y="-100" width="2000" height="222" fill="${p.wall}"/>
      <rect x="-200" y="94" width="2000" height="26" fill="${u('beamDots')}"/>
      <line x1="-200" y1="94" x2="1800" y2="94" stroke="${p.gold}" stroke-width="2"/>
      <line x1="-200" y1="120" x2="1800" y2="120" stroke="${p.gold}" stroke-width="2"/>
      ${Array.from({ length: 14 }, (_, i) => { const x = -160 + i * 160; return `<path d="M${x - 30},120 h60 v14 h-12 v10 h-36 v-10 h-12z" fill="${p.lacquerDark}" stroke="${p.gold}" stroke-opacity=".5"/>`; }).join('')}`,
    column: ({ p, u }, x) => `
      <rect x="${x}" y="60" width="76" height="700" fill="${u('colGrad')}"/>
      <rect x="${x - 6}" y="150" width="88" height="18" fill="${p.gold}" opacity=".8"/>
      <rect x="${x - 12}" y="742" width="100" height="26" fill="#2b1a14"/>`,
    floor: ({ p, u }) => `
      <rect x="-200" y="752" width="2000" height="260" fill="${u('floorGrad')}"/>
      <ellipse class="glow" cx="900" cy="790" rx="560" ry="50" fill="#ff9c4a" opacity=".14"/>`,
    curtain: ({ p }) => `
      <path d="M-240,-20 L240,-20 C205,120 160,260 128,380 C116,424 104,466 74,524 C44,604 12,760 -20,920 L-240,920Z" fill="${p.ink}"/>
      <path d="M240,-20 C205,120 160,260 128,380 C116,424 104,466 74,524 C44,604 12,760 -20,920" fill="none" stroke="${p.gold}" stroke-width="3" stroke-opacity=".7"/>
      <path d="M150,0 C120,140 92,300 70,400 M70,0 C52,160 40,300 30,420 M10,560 C0,660 -20,780 -40,900" stroke="${p.inkEdge}" stroke-opacity=".14" stroke-width="2" fill="none"/>
      <ellipse cx="116" cy="398" rx="16" ry="30" fill="${p.gold}" transform="rotate(-20 116 398)"/>
      <path d="M116,420 L108,500 M122,420 L124,506" stroke="${p.gold}" stroke-width="3"/>`,
    // The nursery: paper screen, lattice, beam, floor, two columns. Put figures between floor and curtains.
    nursery: (S, { paper = true } = {}) => `
      <g data-depth=".2">${paper ? Scenery.paperScreen(S) : ''}</g>
      <g data-depth=".32">${Scenery.latticeWall(S)}${Scenery.ceilingBeam(S)}</g>
      <g data-depth=".55">${Scenery.floor(S)}</g>
      <g data-depth=".7">${Scenery.column(S, 110)}${Scenery.column(S, 1420)}</g>`,
    curtains: (S) => `<g data-depth="1.6">${Scenery.curtain(S)}<g transform="translate(1600,0) scale(-1,1)">${Scenery.curtain(S)}</g></g>`,

    // Dusk/dawn sky with sun disc
    sky: ({ p, u }, { sun = [1180, 520], r = 70 } = {}) => `
      <rect x="-300" y="-300" width="2200" height="1500" fill="${u('sky')}"/>
      <circle class="glow" cx="${sun[0]}" cy="${sun[1]}" r="${r * 4}" fill="${u('warmGlow')}" opacity=".8"/>
      <circle cx="${sun[0]}" cy="${sun[1]}" r="${r}" fill="${p.paperHi}" opacity=".9"/>`,
    // Layered ink-wash mountain ridges (back to front)
    mountains: ({ p, u }) => `
      <g data-depth=".15"><path d="M-300,560 L-120,430 L40,520 L230,360 L420,500 L600,400 L780,520 L980,330 L1180,480 L1360,380 L1560,500 L1900,420 L1900,1000 L-300,1000Z" fill="${p.hill1}"/>
        <rect x="-300" y="380" width="2200" height="300" fill="${u('mist')}"/></g>
      <g data-depth=".3"><path d="M-300,620 C-100,560 80,500 260,560 C420,610 560,470 760,520 C940,570 1080,600 1260,520 C1420,460 1600,560 1900,520 L1900,1000 L-300,1000Z" fill="${p.hill2}"/>
        <rect x="-300" y="500" width="2200" height="220" fill="${u('mist')}" opacity=".7"/></g>`,
    // Flooded rice terraces + mud, foreground
    paddies: ({ p }) => `
      <g data-depth=".55">
        <path d="M-300,660 C200,640 700,690 1900,650 L1900,1000 L-300,1000Z" fill="${p.hill3}"/>
        ${[690, 730, 780, 840].map((y, i) => `<path d="M-300,${y} C200,${y - 18 + i * 4} 900,${y + 22} 1900,${y - 6}" stroke="${p.water}" stroke-opacity="${.32 - i * .05}" stroke-width="${3 + i}" fill="none"/>`).join('')}
        ${Array.from({ length: 26 }, (_, i) => { const x = -200 + i * 80 + (i % 3) * 14, y = 700 + (i % 4) * 34; return `<path d="M${x},${y} l-6,-22 M${x},${y} l2,-26 M${x},${y} l9,-20" stroke="${p.ink}" stroke-width="2.4"/>`; }).join('')}
      </g>`,
    // Thatched hut, origin at ground centre
    hut: ({ p }, x, y, k = 1) => `<g transform="translate(${x},${y}) scale(${k})">
      <path d="M-120,0 L-120,-110 L120,-110 L120,0Z" fill="${p.ink}"/>
      <path d="M-160,-100 C-90,-170 -40,-210 0,-220 C40,-210 90,-170 160,-100 C110,-112 -110,-112 -160,-100Z" fill="${p.ink}" ${cut(p, .35)}/>
      ${Array.from({ length: 9 }, (_, i) => `<path d="M${-140 + i * 35},-104 L${-70 + i * 18},-180" stroke="${p.inkEdge}" stroke-opacity=".18" stroke-width="2"/>`).join('')}
      <rect x="-26" y="-76" width="52" height="76" fill="${p.paperMid}" opacity=".55" class="glow"/>
    </g>`,
    // Weeping willow, origin at trunk base
    willow: ({ p }, x, y, k = 1) => {
      const branches = [[-120, -250], [-60, -300], [10, -320], [80, -290], [140, -240]];
      return `<g transform="translate(${x},${y}) scale(${k})">
      <path d="M-14,0 C-6,-80 -22,-160 0,-240 L10,-240 C16,-160 6,-80 16,0Z" fill="${p.ink}"/>
      ${branches.map(([bx, by]) => `<path d="M4,-220 Q${bx * .5},${by - 40} ${bx},${by}" stroke="${p.ink}" stroke-width="7" fill="none"/>`).join('')}
      <g class="sway">${branches.flatMap(([bx, by], j) => Array.from({ length: 7 }, (_, i) => {
        const sx = bx + (i - 3) * 14, len = 140 + ((i * 37 + j * 23) % 90);
        return `<path d="M${bx},${by} Q${sx + 6},${by + len * .4} ${sx + 10},${by + len}" stroke="${p.ink}" stroke-width="2.6" fill="none"/>`;
      })).join('')}</g></g>`;
    },
    // Curved palace roof (Song eaves turn up at the ends). w = half width.
    roof: ({ p }, x, y, w = 300, fill) => `<g transform="translate(${x},${y})">
      <path d="M${-w - 60},-10 C${-w},0 ${-w + 40},-20 ${-w * .7},-60 L${-w * .3},-120 L${w * .3},-120 L${w * .7},-60 C${w - 40},-20 ${w},0 ${w + 60},-10 C${w},20 ${-w},20 ${-w - 60},-10Z" fill="${fill || p.ink}"/>
      <path d="M${-w * .3},-120 L${w * .3},-120" stroke="${p.gold}" stroke-opacity=".5" stroke-width="3"/>
      <path d="M${-w * .3 - 20},-120 l-10,-24 M${w * .3 + 20},-120 l10,-24" stroke="${fill || p.ink}" stroke-width="10" stroke-linecap="round"/>
    </g>`,
    // A palace hall silhouette (roof + body), origin at ground centre
    hall: (S, x, y, w = 300, fill) => `<g transform="translate(${x},${y})">
      <rect x="${-w * .85}" y="-170" width="${w * 1.7}" height="170" fill="${fill || S.p.ink}"/>
      ${Scenery.roof(S, 0, -160, w, fill)}
      ${Array.from({ length: 6 }, (_, i) => `<rect x="${-w * .7 + i * w * .28}" y="-130" width="${w * .12}" height="90" fill="${S.p.paperMid}" opacity=".35" class="glow"/>`).join('')}
    </g>`,
    pine: ({ p }, x, y, k = 1) => `<g transform="translate(${x},${y}) scale(${k})">
      <path d="M-8,0 C-4,-90 -14,-170 6,-260 L14,-260 C8,-170 16,-90 12,0Z" fill="${p.ink}"/>
      ${[[-90, -150, 90], [70, -200, 80], [-60, -240, 70], [40, -280, 60], [0, -310, 40]].map(([dx, dy, w]) => `<ellipse cx="${dx}" cy="${dy}" rx="${w}" ry="${w * .28}" fill="${p.ink}"/>`).join('')}
    </g>`,
    well: ({ p }, x, y) => `<g transform="translate(${x},${y})">
      <rect x="-60" y="-60" width="120" height="60" fill="${p.ink}"/>
      <rect x="-70" y="-70" width="140" height="14" fill="${p.ink}"/>
      <path d="M-50,-70 V-150 M50,-70 V-150 M-70,-150 H70" stroke="${p.ink}" stroke-width="10"/>
      <path d="M0,-150 V-100" stroke="${p.ink}" stroke-width="3"/><rect x="-12" y="-104" width="24" height="20" fill="${p.ink}"/>
    </g>`,
    // Courtyard at dusk: sky, far halls, pines, flagstones
    courtyard: (S) => `
      <g data-depth=".1">${Scenery.sky(S, { sun: [1050, 470], r: 60 })}</g>
      <g data-depth=".25">${Scenery.hall(S, 380, 560, 330, S.p.hill2)}${Scenery.hall(S, 1220, 540, 380, S.p.hill2)}</g>
      <g data-depth=".4">${Scenery.pine(S, 160, 650, 1.2)}${Scenery.pine(S, 1450, 660, 1.1)}${Scenery.well(S, 1240, 700)}</g>
      <g data-depth=".5"><rect x="-300" y="640" width="2200" height="400" fill="${S.p.hill3}"/>
        ${Array.from({ length: 8 }, (_, i) => `<path d="M-300,${670 + i * 32} H1900" stroke="${S.p.paperLow}" stroke-opacity=".18" stroke-width="2"/>`).join('')}</g>`,
    // A wall with a round moon window; the window shows whatever `inside` markup is (clipped).
    moonWindow: (S, cx, cy, r, inside) => `
      <clipPath id="${S.id('moon')}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
      <g clip-path="url(#${S.id('moon')})">${inside}<rect x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${2 * r}" fill="${S.u('grille')}" opacity=".55"/></g>
      <path d="M-400,-400 H2000 V1300 H-400Z M${cx - r},${cy} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0Z" fill="${S.p.wall}" fill-rule="evenodd"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${S.p.lacquerDark}" stroke-width="26"/>
      <circle cx="${cx}" cy="${cy}" r="${r + 14}" fill="none" stroke="${S.p.gold}" stroke-width="3" stroke-opacity=".7"/>`,
    // Palace gate. Doors are #<id>-dl and #<id>-dr; open them with Song.openGate.
    palaceGate: (S, id) => {
      const { p, u } = S;
      const studs = (x0) => Array.from({ length: 9 * 5 }, (_, k) => `<circle cx="${x0 + 30 + (k % 5) * 44}" cy="${300 + Math.floor(k / 5) * 46}" r="7" fill="${p.gold}"/>`).join('');
      return `
      <rect x="-300" y="150" width="2200" height="620" fill="${p.lacquer}"/>
      <rect x="-300" y="150" width="2200" height="620" fill="${p.ink}" opacity=".35"/>
      ${Scenery.roof(S, 800, 170, 760)}
      <rect x="520" y="250" width="560" height="520" fill="#100604"/>
      <rect class="glow" x="560" y="270" width="480" height="500" fill="${p.paperHi}" opacity=".6"/>
      <g id="${S.id(id + '-dl')}"><rect x="560" y="260" width="240" height="510" fill="${u('door')}" stroke="${p.ink}" stroke-width="4"/>${studs(566)}<circle cx="770" cy="520" r="14" fill="none" stroke="${p.gold}" stroke-width="5"/></g>
      <g id="${S.id(id + '-dr')}"><rect x="800" y="260" width="240" height="510" fill="${u('door')}" stroke="${p.ink}" stroke-width="4"/>${studs(806)}<circle cx="830" cy="520" r="14" fill="none" stroke="${p.gold}" stroke-width="5"/></g>
      <rect x="500" y="240" width="600" height="22" fill="${p.lacquerDark}"/><rect x="490" y="240" width="30" height="530" fill="${p.lacquerDark}"/><rect x="1080" y="240" width="30" height="530" fill="${p.lacquerDark}"/>
      <rect x="-300" y="770" width="2200" height="300" fill="${u('floorGrad')}"/>
      ${[0, 1, 2].map(i => `<rect x="${420 - i * 60}" y="${770 + i * 26}" width="${760 + i * 120}" height="26" fill="#1b0b07" stroke="${p.gold}" stroke-opacity=".2"/>`).join('')}`;
    },
    // Wooden bath tub with steam (.steam paths)
    tub: ({ p }, x, y) => `<g transform="translate(${x},${y})">
      ${[0, 1, 2, 3].map(i => `<path class="steam" d="M${-120 + i * 80},-150 c-20,-40 20,-60 0,-100 c-20,-40 20,-60 0,-100" stroke="${p.paperHi}" stroke-opacity=".28" stroke-width="10" fill="none" stroke-linecap="round"/>`).join('')}
      <path d="M-210,-150 L-180,0 L180,0 L210,-150Z" fill="${p.ink}" ${cut(p, .4)}/>
      <path d="M-200,-104 L200,-104 M-190,-50 L190,-50" stroke="${p.gold}" stroke-opacity=".55" stroke-width="5"/>
      <ellipse cx="0" cy="-150" rx="210" ry="18" fill="${p.water}" opacity=".5" class="glow"/>
    </g>`,
    // Throne, origin at floor centre
    throne: ({ p }, x, y, k = 1) => `<g transform="translate(${x},${y}) scale(${k})">
      <path d="M-120,0 V-150 H120 V0Z" fill="${p.ink}"/>
      <path d="M-110,-150 V-330 C-110,-360 -80,-372 -60,-350 C-30,-390 30,-390 60,-350 C80,-372 110,-360 110,-330 V-150Z" fill="${p.ink}" ${cut(p, .4)}/>
      <path d="M-140,-150 H140 V-128 H-140Z" fill="${p.ink}"/>
    </g>`,
    // Low table, origin at floor centre
    table: ({ p }, x, y, w = 420) => `<g transform="translate(${x},${y})">
      <rect x="${-w / 2}" y="-130" width="${w}" height="22" fill="${p.ink}" ${cut(p, .4)}/>
      <path d="M${-w / 2 + 20},-108 V0 M${w / 2 - 20},-108 V0" stroke="${p.ink}" stroke-width="18"/>
      <path d="M${-w / 2 + 20},-60 H${w / 2 - 20}" stroke="${p.ink}" stroke-width="8"/>
    </g>`,
    // Bird cage around a figure (golden cage)
    cage: ({ p }, x, y, w = 260, h = 520) => `<g transform="translate(${x},${y})">
      ${Array.from({ length: 13 }, (_, i) => { const xx = -w / 2 + i * w / 12; return `<path d="M${xx},0 V${-h * .72} Q${xx * .5},${-h} 0,${-h}" stroke="${p.gold}" stroke-width="5" fill="none"/>`; }).join('')}
      <ellipse cx="0" cy="0" rx="${w / 2 + 10}" ry="14" fill="${p.gold}"/>
      <ellipse cx="0" cy="${-h * .72}" rx="${w / 2}" ry="10" fill="none" stroke="${p.gold}" stroke-width="5"/>
      <path d="M0,${-h} V${-h - 50}" stroke="${p.gold}" stroke-width="6"/><circle cx="0" cy="${-h - 60}" r="14" fill="none" stroke="${p.gold}" stroke-width="6"/>
    </g>`
  };

  // ---------- props ----------
  const Props = {
    lantern: ({ p, u }, id, { cord = 100 } = {}) => {
      const cy = cord + 56;
      return `<g class="sway" id="${id}">
        <circle class="glow" cx="0" cy="${cy}" r="180" fill="${u('warmGlow')}"/>
        <line x1="0" y1="-300" x2="0" y2="${cord}" stroke="${p.gold}" stroke-width="2"/>
        <rect x="-22" y="${cord - 4}" width="44" height="12" rx="2" fill="${p.gold}"/>
        <ellipse cx="0" cy="${cy}" rx="46" ry="56" fill="${u('lanternBody')}"/>
        <ellipse cx="0" cy="${cy}" rx="30" ry="56" fill="none" stroke="${p.gold}" stroke-opacity=".5" stroke-width="1.5"/>
        <ellipse cx="0" cy="${cy}" rx="13" ry="56" fill="none" stroke="${p.gold}" stroke-opacity=".5" stroke-width="1.5"/>
        <rect x="-22" y="${cy + 48}" width="44" height="12" rx="2" fill="${p.gold}"/>
        <circle cx="0" cy="${cy + 66}" r="5" fill="${p.gold}"/>
        <path d="M-6,${cy + 70} L-11,${cy + 128} M0,${cy + 70} L0,${cy + 134} M6,${cy + 70} L11,${cy + 128}" stroke="${p.lacquer}" stroke-width="3"/>
      </g>`;
    },
    lanterns: (S, list) => `<g data-depth=".6">${list.map(([x, y, cord], i) => `<g transform="translate(${x},${y})">${Props.lantern(S, S.id('lan' + i), { cord })}</g>`).join('')}</g>`,
    oilLamp: ({ p, u }) => `
      <circle class="glow" cx="0" cy="-206" r="240" fill="${u('warmGlow')}"/>
      <path d="M-30,0 L-6,-30 L6,-30 L30,0" fill="none" stroke="${p.ink}" stroke-width="6"/>
      <rect x="-4" y="-192" width="8" height="164" fill="${p.ink}"/>
      <path d="M-32,-196 Q0,-176 32,-196Z" fill="${p.ink}" stroke="${p.inkEdge}" stroke-opacity=".5"/>
      <g transform="translate(0,-198)"><g class="flame">
        <path d="M0,0 C-10,-10 -7,-28 0,-46 C7,-28 10,-10 0,0Z" fill="${p.flame}"/>
        <path d="M0,-2 C-4,-8 -3,-18 0,-26 C3,-18 4,-8 0,-2Z" fill="${p.flameCore}"/></g></g>`,
    // small porcelain bowl, origin at its base
    bowl: ({ p }, k = 1) => `<g transform="scale(${k})">
      <path d="M-34,-34 C-32,-10 -16,0 0,0 C16,0 32,-10 34,-34Z" fill="${p.porcelain}" stroke="${p.ink}" stroke-width="2"/>
      <ellipse cx="0" cy="-34" rx="34" ry="7" fill="${p.milk}" stroke="${p.ink}" stroke-width="2"/>
      <path d="M-24,-20 C-10,-14 10,-14 24,-20" stroke="#5a7da0" stroke-width="2.5" fill="none" opacity=".8"/></g>`,
    // Big close-up bowl of milk, origin at centre of the rim. #<id>-milk is the surface.
    bigBowl: ({ p, u, id }, nm = 'bb') => `
      <ellipse cx="0" cy="250" rx="420" ry="40" fill="#000" opacity=".5"/>
      <path d="M-420,0 C-400,160 -220,250 0,250 C220,250 400,160 420,0Z" fill="${p.porcelain}"/>
      <path d="M-420,0 C-400,160 -220,250 0,250 C220,250 400,160 420,0Z" fill="#000" opacity=".18"/>
      <path d="M-330,90 C-180,140 180,140 330,90" stroke="#4f6f96" stroke-width="7" fill="none" opacity=".75"/>
      <path d="M-290,130 C-200,160 -140,120 -60,150 M60,150 C140,120 200,160 290,130" stroke="#4f6f96" stroke-width="5" fill="none" opacity=".6"/>
      <ellipse cx="0" cy="0" rx="420" ry="74" fill="${p.porcelain}" stroke="${p.ink}" stroke-width="4"/>
      <ellipse id="${id(nm + '-milk')}" cx="0" cy="6" rx="392" ry="62" fill="${u('milkGlow')}"/>
      <g id="${id(nm + '-ripple')}" fill="none" stroke="#c9b48c" stroke-width="3">
        <ellipse cx="0" cy="6" rx="120" ry="18" opacity=".6"/><ellipse cx="0" cy="6" rx="220" ry="34" opacity=".35"/></g>
      <ellipse class="glow" cx="-140" cy="-8" rx="120" ry="14" fill="#fff" opacity=".55"/>`,
    baby: ({ p }, fill) => `<g>
      <ellipse cx="0" cy="0" rx="58" ry="24" fill="${fill || p.ink}" ${cut(p, .5)}/>
      <circle cx="-48" cy="-16" r="18" fill="${fill || p.ink}" ${cut(p, .5)}/>
      <path d="M-20,-14 Q-8,8 -18,22 M20,-18 Q32,4 22,20" stroke="${p.inkEdge}" stroke-opacity=".5" stroke-width="1.4" fill="none"/></g>`,
    dagger: ({ p }) => `<g><rect x="-6" y="-46" width="12" height="44" fill="${p.ink}"/><rect x="-20" y="-6" width="40" height="10" fill="${p.gold}"/>
      <path d="M-7,4 L0,96 L7,4Z" fill="#d9d2c5"/><circle cx="0" cy="-50" r="8" fill="${p.gold}"/></g>`,
    garlic: ({ p }) => `<g><path d="M0,-70 C-50,-60 -70,-10 -40,20 C-20,40 20,40 40,20 C70,-10 50,-60 0,-70Z" fill="${p.porcelain}" stroke="${p.ink}" stroke-width="3"/>
      <path d="M0,-70 C-20,-40 -20,10 0,36 M0,-70 C20,-40 20,10 0,36 M0,-70 C-40,-40 -48,0 -30,28 M0,-70 C40,-40 48,0 30,28" stroke="${p.ink}" stroke-width="2" fill="none" opacity=".5"/>
      <path d="M0,-70 C-4,-90 4,-100 0,-112" stroke="${p.porcelain}" stroke-width="6" fill="none"/></g>`,
    onion: ({ p }) => `<g><path d="M0,-80 C-60,-50 -70,10 -30,34 C-10,44 10,44 30,34 C70,10 60,-50 0,-80Z" fill="#b25a2e" stroke="${p.ink}" stroke-width="3"/>
      <path d="M0,-80 C-24,-40 -24,10 0,40 M0,-80 C24,-40 24,10 0,40" stroke="${p.ink}" stroke-width="2" fill="none" opacity=".5"/>
      <path d="M0,-80 C-6,-110 6,-124 0,-140" stroke="#6f8f6a" stroke-width="7" fill="none"/></g>`,
    peppers: ({ p }) => `<g>${[[-40, 0], [0, -14], [40, 4], [-18, 26], [24, 30]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="17" fill="#7a2416" stroke="${p.ink}" stroke-width="3"/><circle cx="${x + 5}" cy="${y - 5}" r="4" fill="#d06a4a"/>`).join('')}
      <path d="M-80,-60 L80,-60" stroke="${p.ink}" stroke-width="0"/></g>`,
    // red brush-stroke X; #<nm> for animation (draw on with stroke-dashoffset)
    redX: ({ p, id }, nm) => `<g id="${id(nm)}" opacity="0"><path d="M-90,-90 C-30,-30 30,30 90,90" stroke="${p.blood}" stroke-width="22" stroke-linecap="round" fill="none"/>
      <path d="M90,-90 C30,-30 -30,30 -90,90" stroke="${p.blood}" stroke-width="22" stroke-linecap="round" fill="none"/></g>`,
    soupBowl: ({ p }) => `<g>
      <path d="M-120,-40 C-110,30 -60,60 0,60 C60,60 110,30 120,-40Z" fill="${p.porcelain}" stroke="${p.ink}" stroke-width="3"/>
      <ellipse cx="0" cy="-40" rx="120" ry="22" fill="#d8cba6" stroke="${p.ink}" stroke-width="3"/>
      <path d="M-60,-42 C-30,-60 30,-56 60,-42 L80,-52 L76,-30 L60,-38 C30,-26 -30,-26 -60,-42Z" fill="#8a7a5a" opacity=".8"/>
      ${[0, 1, 2].map(i => `<path class="steam" d="M${-50 + i * 50},-70 c-14,-26 14,-40 0,-66 c-14,-26 14,-40 0,-66" stroke="${p.paperHi}" stroke-opacity=".3" stroke-width="7" fill="none" stroke-linecap="round"/>`).join('')}</g>`,
    porkFat: ({ p }) => `<g><path d="M-80,-30 L70,-40 L84,10 L-70,20Z" fill="#efe1c4" stroke="${p.ink}" stroke-width="3"/>
      <path d="M-76,-10 L76,-18" stroke="#c89a7a" stroke-width="5"/><path d="M-72,6 L80,-2" stroke="#c89a7a" stroke-width="3"/></g>`,
    // Incense stick clock: burn k 0..1. #<nm>-stick scales, #<nm>-ember moves.
    incense: ({ p, id }, nm = 'inc') => `<g>
      <path d="M-60,0 C-60,-40 60,-40 60,0Z" fill="${p.ink}" ${cut(p, .4)}/><rect x="-70" y="-6" width="140" height="10" fill="${p.ink}"/>
      <rect id="${id(nm + '-stick')}" x="-3" y="-330" width="6" height="300" fill="#6b3b22"/>
      <circle id="${id(nm + '-ember')}" class="glow" cx="0" cy="-330" r="7" fill="#ff7a2a"/>
      <path id="${id(nm + '-smoke')}" d="M0,-336 c-20,-40 20,-70 0,-110 c-20,-40 20,-70 0,-110" stroke="#e8d6b8" stroke-opacity=".35" stroke-width="5" fill="none"/></g>`,
    hawk: ({ p }, fill) => `<path d="M0,0 C-30,-6 -70,-30 -120,-24 C-80,-14 -50,-4 -36,6 C-60,16 -90,40 -110,70 C-60,48 -20,26 4,14 L30,22 L18,8 C40,4 54,-6 62,-14 L44,-12 C30,-8 14,-4 0,0Z" fill="${fill || p.ink}"/>`,
    // Severed tear drop
    tear: ({ p }) => `<path d="M0,-22 C8,-8 12,2 12,8 C12,16 6,22 0,22 C-6,22 -12,16 -12,8 C-12,2 -8,-8 0,-22Z" fill="#cfe4ff" opacity=".9"/>`,
    cane: ({ p }) => `<g><rect x="-6" y="-360" width="12" height="380" rx="6" fill="${p.ink}"/>${[0, 1, 2, 3, 4].map(i => `<rect x="-8" y="${-330 + i * 70}" width="16" height="6" fill="${p.ink}"/>`).join('')}</g>`,
    scroll: ({ p }) => `<g><rect x="-10" y="-40" width="20" height="80" rx="6" fill="${p.porcelain}" stroke="${p.ink}" stroke-width="2"/><rect x="-14" y="-46" width="28" height="10" fill="${p.lacquer}"/><rect x="-14" y="36" width="28" height="10" fill="${p.lacquer}"/></g>`,
    sword: ({ p }) => `<g><rect x="-3" y="-210" width="6" height="200" fill="${p.ink}"/><rect x="-16" y="-14" width="32" height="8" fill="${p.ink}"/><rect x="-4" y="-6" width="8" height="34" fill="${p.ink}"/></g>`,
    banner: ({ p }) => `<g><rect x="-3" y="-300" width="6" height="300" fill="${p.ink}"/><path d="M3,-296 H90 L70,-250 L90,-204 H3Z" fill="${p.ink}"/></g>`
  };

  // ---------- figures ----------
  // Jointed arm, shadow-puppet style: shoulder -> upper arm -> elbow -> forearm -> hand.
  // ids: <id>-ua (rotate at shoulder), <id>-fa (rotate at elbow), <id>-hand (holds props).
  // Angle 0 hangs straight down; NEGATIVE angles swing the arm forward (to the right).
  function arm(S, id, { x = 6, y = -318, ua = 74, fa = 70, w = 22, fill, sleeve = true, ua0 = 0, fa0 = 0, hold = '' }) {
    const f = fill || S.p.ink;
    return `<g transform="translate(${x},${y})"><g id="${S.id(id + '-ua')}" transform="rotate(${ua0})">
      <path d="M${-w / 2},-4 L${-w / 2 + 2},${ua} L${w / 2 - 2},${ua} L${w / 2},-4Z" fill="${f}"/>
      <circle cx="0" cy="${ua}" r="${w / 2 - 1}" fill="${f}"/>
      <g transform="translate(0,${ua})"><g id="${S.id(id + '-fa')}" transform="rotate(${fa0})">
        <path d="M${-w / 2 + 2},0 L-6,${fa} L6,${fa} L${w / 2 - 2},0Z" fill="${f}"/>
        ${sleeve ? `<path d="M${-w / 2 - 2},4 C${-w - 8},${fa * .5} ${-w - 4},${fa * .85} ${-w / 2},${fa * .95} L${w / 2},${fa * .5} L${w / 2},0Z" fill="${f}" opacity=".96"/>` : ''}
        <ellipse cx="0" cy="${fa + 8}" rx="8" ry="11" fill="${f}"/>
        <g id="${S.id(id + '-hand')}" transform="translate(0,${fa + 10})">${hold}</g>
      </g></g></g></g>`;
  }

  // Head-wear and hair, drawn around a head centred at (hx, hy)
  function headwear(S, kind, hx, hy, f) {
    const p = S.p;
    switch (kind) {
      case 'bun': return `<ellipse cx="${hx - 20}" cy="${hy - 12}" rx="17" ry="14" fill="${f}"/><path d="M${hx - 40},${hy - 18} L${hx},${hy - 30}" stroke="${f}" stroke-width="3"/><circle cx="${hx - 40}" cy="${hy - 18}" r="4" fill="${p.gold}"/>`;
      case 'wrap': return `<path d="M${hx - 26},${hy - 4} C${hx - 30},${hy - 34} ${hx + 6},${hy - 40} ${hx + 24},${hy - 14} L${hx + 20},${hy - 8} C${hx},${hy - 20} ${hx - 14},${hy - 16} ${hx - 22},${hy + 6}Z" fill="${f}"/><path d="M${hx - 26},${hy - 2} l-22,16 l8,4 l18,-10" fill="${f}"/>`;
      case 'high': return `<path d="M${hx - 18},${hy - 20} C${hx - 26},${hy - 60} ${hx + 4},${hy - 76} ${hx + 8},${hy - 44} C${hx + 12},${hy - 30} ${hx},${hy - 22} ${hx - 6},${hy - 18}Z" fill="${f}"/><path d="M${hx - 30},${hy - 50} L${hx + 24},${hy - 62}" stroke="${p.gold}" stroke-width="3"/>`;
      case 'loops': return `<ellipse cx="${hx - 12}" cy="${hy - 44}" rx="11" ry="26" fill="${f}" transform="rotate(-18 ${hx - 12} ${hy - 44})"/><ellipse cx="${hx + 12}" cy="${hy - 44}" rx="11" ry="26" fill="${f}" transform="rotate(18 ${hx + 12} ${hy - 44})"/><ellipse cx="${hx - 18}" cy="${hy - 10}" rx="14" ry="12" fill="${f}"/>`;
      case 'phoenix': return `<path d="M${hx - 34},${hy - 16} L${hx - 44},${hy - 54} L${hx - 26},${hy - 38} L${hx - 16},${hy - 78} L${hx},${hy - 46} L${hx + 16},${hy - 78} L${hx + 26},${hy - 38} L${hx + 44},${hy - 54} L${hx + 34},${hy - 16}Z" fill="${f}"/>
          <path d="M${hx - 32},${hy - 24} L${hx - 70},${hy}" stroke="${f}" stroke-width="4"/><path d="M${hx - 70},${hy} v26 M${hx - 62},${hy - 4} v24" stroke="${p.gold}" stroke-width="2"/><circle cx="${hx - 70}" cy="${hy + 28}" r="4" fill="${p.gold}"/><circle cx="${hx}" cy="${hy - 50}" r="5" fill="${p.gold}"/>`;
      case 'veil': return `<path d="M${hx},${hy - 34} C${hx + 30},${hy - 30} ${hx + 40},${hy + 10} ${hx + 50},${hy + 80} L${hx - 60},${hy + 80} C${hx - 44},${hy + 10} ${hx - 30},${hy - 30} ${hx},${hy - 34}Z" fill="${f}"/>`;
      case 'futou': return `<path d="M${hx - 20},${hy - 10} L${hx - 18},${hy - 40} C${hx - 8},${hy - 48} ${hx + 10},${hy - 48} ${hx + 18},${hy - 40} L${hx + 22},${hy - 12}Z" fill="${f}"/><rect x="${hx - 120}" y="${hy - 22}" width="240" height="6" fill="${f}"/>`;
      case 'cap': return `<path d="M${hx - 24},${hy - 6} C${hx - 26},${hy - 40} ${hx + 18},${hy - 46} ${hx + 24},${hy - 10}Z" fill="${f}"/><path d="M${hx - 22},${hy - 10} C${hx - 40},${hy + 4} ${hx - 44},${hy + 30} ${hx - 40},${hy + 44} M${hx - 18},${hy - 8} C${hx - 30},${hy + 10} ${hx - 30},${hy + 30} ${hx - 26},${hy + 44}" stroke="${f}" stroke-width="5" fill="none"/>`;
      case 'helmet': return `<path d="M${hx - 26},${hy + 6} C${hx - 30},${hy - 40} ${hx + 26},${hy - 44} ${hx + 26},${hy - 4} L${hx + 10},${hy - 8} L${hx - 10},${hy + 16}Z" fill="${f}"/><path d="M${hx},${hy - 34} L${hx - 4},${hy - 64}" stroke="${p.blood}" stroke-width="6"/>`;
      default: return '';
    }
  }

  // Standing figure in profile. opts: id, hair, robe ('court'|'plain'|'man'), fill, arms {ua,fa,hold}, farArm {...}, eye (glint colour)
  function person(S, o = {}) {
    const p = S.p, f = o.fill || p.ink, id = o.id || 'fig';
    const man = o.robe === 'man';
    const hx = 12, hy = -372;
    const robe = o.robe === 'court'
      ? `M-26,-332 C-40,-300 -46,-220 -52,-140 C-60,-80 -80,-30 -150,4 L96,4 C80,-30 62,-90 54,-150 C48,-220 44,-300 30,-332 Q2,-342 -26,-332Z`
      : man ? `M-34,-334 C-46,-300 -50,-220 -50,-140 C-52,-80 -58,-30 -64,0 L74,0 C68,-30 62,-90 58,-150 C56,-220 52,-300 36,-334 Q2,-346 -34,-334Z`
        : `M-24,-332 C-36,-300 -42,-220 -46,-150 C-50,-90 -60,-40 -66,-18 L-56,0 L82,0 L76,-18 C66,-50 58,-100 52,-150 C46,-220 42,-300 28,-332 Q2,-342 -24,-332Z`;
    const plainLegs = o.robe === 'plain' ? `<path d="M-30,-20 L-36,0 M50,-20 L58,0" stroke="${f}" stroke-width="12"/>` : '';
    const belt = man ? `<rect x="-50" y="-200" width="108" height="10" fill="${p.gold}" opacity=".7"/>` : `<path d="M-40,-230 L52,-230" stroke="${p.inkEdge}" stroke-opacity=".5" stroke-width="2"/>`;
    const eye = o.eye ? `<circle id="${S.id(id + '-eye')}" cx="${hx + 12}" cy="${hy - 4}" r="3.2" fill="${o.eye}"/>` : `<circle cx="${hx + 12}" cy="${hy - 4}" r="2" fill="${p.inkEdge}" opacity=".6"/>`;
    return `<g id="${S.id(id)}">
      <ellipse cx="10" cy="2" rx="110" ry="9" fill="#000" opacity=".45"/>
      ${arm(S, id + '-far', { ...(o.farArm || {}), fill: f, x: -4 })}
      <path d="${robe}" fill="${f}" ${o.cut === false ? '' : cut(p)}/>${plainLegs}
      ${belt}
      ${o.robe === 'court' ? Array.from({ length: 8 }, (_, i) => `<path d="M${-60 + i * 20},-26 l5,7 -5,7 -5,-7z" fill="${p.inkEdge}" opacity=".6"/>`).join('') : ''}
      <rect x="2" y="-352" width="18" height="24" fill="${f}"/>
      <g id="${S.id(id + '-head')}">
        <ellipse cx="${hx}" cy="${hy}" rx="21" ry="24" fill="${f}"/>
        <path d="M${hx + 19},${hy - 6} L${hx + 29},${hy + 6} L${hx + 19},${hy + 10}Z" fill="${f}"/>
        ${man && o.beard ? `<path d="M${hx + 8},${hy + 18} C${hx + 4},${hy + 50} ${hx + 18},${hy + 64} ${hx + 22},${hy + 70} C${hx + 24},${hy + 44} ${hx + 22},${hy + 28} ${hx + 18},${hy + 16}Z" fill="${f}"/>` : ''}
        ${headwear(S, o.hair || (man ? 'futou' : 'bun'), hx, hy, f)}
        ${eye}
      </g>
      ${arm(S, id + '-near', { ...(o.arm || {}), fill: f })}
    </g>`;
  }

  // Kneeling woman in profile (the nurse tasting). Shoulder at (6,-238); head at (14,-290).
  function kneeler(S, o = {}) {
    const p = S.p, f = o.fill || p.ink, id = o.id || 'kn';
    const hx = 14, hy = -290;
    return `<g id="${S.id(id)}">
      <ellipse cx="0" cy="2" rx="140" ry="10" fill="#000" opacity=".45"/>
      ${arm(S, id + '-far', { ...(o.farArm || {}), x: -2, y: -236, ua: 62, fa: 58, fill: f })}
      <path d="M-24,-250 C-40,-220 -50,-170 -60,-120 C-90,-110 -120,-70 -130,0 L120,0 C116,-30 96,-60 60,-80 C50,-130 40,-200 26,-250 Q0,-262 -24,-250Z" fill="${f}" ${cut(p)}/>
      ${Array.from({ length: 10 }, (_, i) => `<path d="M${-110 + i * 22},-18 l5,7 -5,7 -5,-7z" fill="${p.inkEdge}" opacity=".55"/>`).join('')}
      <rect x="4" y="-270" width="16" height="22" fill="${f}"/>
      <g id="${S.id(id + '-head')}">
        <ellipse cx="${hx}" cy="${hy}" rx="20" ry="23" fill="${f}"/>
        <path d="M${hx + 18},${hy - 6} L${hx + 28},${hy + 6} L${hx + 18},${hy + 10}Z" fill="${f}"/>
        ${headwear(S, o.hair || 'bun', hx, hy, f)}
        <circle cx="${hx + 11}" cy="${hy - 4}" r="2" fill="${p.inkEdge}" opacity=".6"/>
      </g>
      ${arm(S, id + '-near', { ...(o.arm || {}), x: 8, y: -236, ua: 62, fa: 58, fill: f })}
    </g>`;
  }

  // Seated wet nurse holding a baby at her breast (from the style sample). ids: <id>, <id>-head, <id>-baby
  function nurseSeated(S, o = {}) {
    const p = S.p, id = o.id || 'ns', f = o.fill || p.ink;
    return `<g id="${S.id(id)}">
    <ellipse cx="20" cy="2" rx="130" ry="10" fill="#000" opacity=".5"/>
    <path d="M8,-300 C-22,-296 -36,-262 -38,-224 C-40,-196 -44,-176 -52,-160 C-72,-110 -84,-50 -96,0 L132,0 C126,-40 116,-100 112,-150 C110,-168 96,-176 70,-176 L40,-176 C44,-210 42,-260 30,-298Z" fill="${f}" ${cut(p)}/>
    ${Array.from({ length: 10 }, (_, i) => `<path d="M${-74 + i * 22},-30 l6,8 -6,8 -6,-8z" fill="${p.inkEdge}" opacity=".75"/>`).join('')}
    <path d="M-40,-190 L46,-188" stroke="${p.inkEdge}" stroke-opacity=".6" stroke-width="1.6"/>
    <path d="M4,-300 L2,-322 L22,-326 L26,-300Z" fill="${f}"/>
    <g id="${S.id(id + '-head')}">
      <ellipse cx="18" cy="-346" rx="22" ry="25" fill="${f}"/>
      <path d="M37,-354 L47,-342 L38,-336Z" fill="${f}"/>
      ${headwear(S, o.hair || 'bun', 18, -346, f)}
      <circle cx="30" cy="-350" r="2" fill="${p.inkEdge}" opacity=".7"/>
    </g>
    <g id="${S.id(id + '-baby')}">
      <ellipse cx="88" cy="-226" rx="52" ry="21" fill="${f}" transform="rotate(14 88 -226)" ${cut(p)}/>
      <circle cx="46" cy="-248" r="15" fill="${f}" ${cut(p)}/>
    </g>
    <path d="M12,-292 C-10,-262 -14,-222 14,-200 C50,-182 106,-184 138,-204 L134,-218 C104,-206 62,-206 40,-218 C28,-236 30,-266 32,-290Z" fill="${f}" ${cut(p)}/>
    <ellipse cx="138" cy="-211" rx="10" ry="7" fill="${f}"/>
    </g>`;
  }

  // Horse and rider for battle scenes, origin at hooves, facing right
  function rider(S, o = {}) {
    const p = S.p, f = o.fill || p.ink;
    return `<g>
      <path d="M-120,-140 C-80,-170 40,-170 90,-150 L130,-220 L150,-214 L160,-180 L140,-176 L110,-120 C100,-100 70,-96 60,-96 L66,0 L52,0 L40,-90 L-60,-90 L-80,0 L-94,0 L-90,-100 C-120,-110 -150,-100 -170,-60 C-150,-110 -140,-130 -120,-140Z" fill="${f}"/>
      <path d="M-20,-160 L-10,-260 L20,-260 L24,-160Z" fill="${f}"/><circle cx="6" cy="-282" r="18" fill="${f}"/>
      ${headwear(S, 'helmet', 6, -282, f)}
      <path d="M14,-240 L150,-330" stroke="${f}" stroke-width="6"/><path d="M150,-330 l18,-16 l-6,24z" fill="${f}"/>
    </g>`;
  }

  const Song = { palette, defs, border, Scenery, Props, person, kneeler, nurseSeated, rider, arm, headwear };

  // Pose helper: Song.pose(S, 'nurse', {nearUa:-40, nearFa:-60, farUa, farFa, head})
  Song.pose = (S, id, o) => {
    const set = (n, a, base = '') => { const el = S.q('#' + S.id(n)); if (el) el.setAttribute('transform', `${base}rotate(${a.toFixed ? a.toFixed(2) : a})`); };
    if (o.nearUa !== undefined) set(id + '-near-ua', o.nearUa);
    if (o.nearFa !== undefined) set(id + '-near-fa', o.nearFa);
    if (o.farUa !== undefined) set(id + '-far-ua', o.farUa);
    if (o.farFa !== undefined) set(id + '-far-fa', o.farFa);
  };
  // Where a jointed arm's hand ends up (figure coords), for placing held props upright.
  Song.hand = (x, y, ua, fa, L1, L2) => {
    const r = Math.PI / 180, ex = x - L1 * Math.sin(ua * r), ey = y + L1 * Math.cos(ua * r);
    return [ex - (L2 + 10) * Math.sin((ua + fa) * r), ey + (L2 + 10) * Math.cos((ua + fa) * r)];
  };
  // Rotate an element around a point
  Song.rot = (el, a, x, y) => el && el.setAttribute('transform', `rotate(${a.toFixed(2)} ${x} ${y})`);
  Song.move = (el, x, y, k = 1, extra = '') => el && el.setAttribute('transform', `translate(${x.toFixed(2)},${y.toFixed(2)}) scale(${k.toFixed ? k.toFixed(4) : k}) ${extra}`);
  Song.openGate = (S, id, k) => {
    const l = S.q('#' + S.id(id + '-dl')), r = S.q('#' + S.id(id + '-dr'));
    // doors swing inward: squash toward the hinges
    l && l.setAttribute('transform', `translate(560,0) scale(${(1 - 0.85 * k).toFixed(3)},1) translate(-560,0)`);
    r && r.setAttribute('transform', `translate(1040,0) scale(${(1 - 0.85 * k).toFixed(3)},1) translate(-1040,0)`);
  };

  // Stage hooks
  Song.border = (p, pre) => border(p).replace('__FRET__', `${pre}-fret`);
  window.SongStyle = Song;
})();
