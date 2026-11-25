// @style song
// @pad 5
// Chapter 1 — The bowl (hook). Night nursery, the bowl, the threat, then the title card.
(() => {
  const G = window.SongStyle, { Scenery: Sc, Props: Pr } = G, M = Stage.M;
  const TREM = (t, amp = 1) => amp * (Math.sin(t * 31) * 0.6 + Math.sin(t * 47 + 1) * 0.4); // shaking hands

  // Kneeling nurse holding the bowl in both hands. Places the bowl at her hands every frame.
  const nurseWithBowl = (S, x, y, k) => `
    <g transform="translate(${x},${y}) scale(${k})">${G.kneeler(S, { id: 'nurse', hair: 'bun' })}</g>
    <g id="${S.id('bowl')}">${Pr.bowl(S, 1.25)}</g>`;
  const poseNurse = (S, lt, { x, y, k, lift = 0, look = 0 }) => {
    const tr = TREM(lt, 1.6);
    const ua = -48 - 70 * lift + tr, fa = -72 - 40 * lift - tr * .6;
    G.pose(S, 'nurse', { nearUa: ua, nearFa: fa, farUa: ua + 4, farFa: fa - 6 });
    const [hx, hy] = G.hand(8, -236, ua, fa, 62, 58);
    G.move(S.q('#' + S.id('bowl')), x + hx * k, y + (hy + 14) * k);
    G.rot(S.q('#' + S.id('nurse-head')), 10 * look + 0.8 * Math.sin(lt * 1.3), 14, -268);
  };

  Stage.run({
    style: G,
    duration: TIMINGS.duration + 5,
    timings: TIMINGS,
    subs: [['nine sixty A.D.', '960 AD']],
    fadeIn: 1.6,
    cards: [
      { at: 0.4, end: 4.9, small: 'Kaifeng · Song dynasty China', big: '960 AD' },
      { at: 47.9, end: TIMINGS.duration + 5, small: 'A day in the life of', big: 'The Palace Wet Nurse', sub: 'Song dynasty China' }
    ],
    scenes: [
      { // 0 — night nursery, the nurse kneels with the bowl
        at: 0,
        cam: { from: [800, 470, 1.0], to: [840, 430, 1.22] },
        svg: (S) => `${Sc.nursery(S)}
          ${Pr.lanterns(S, [[420, 120, 90], [1180, 120, 70]])}
          <g data-depth=".8"><g transform="translate(1130,770)">${Pr.oilLamp(S)}</g></g>
          <g data-depth=".9">${nurseWithBowl(S, 760, 770, 1.45)}</g>
          ${Sc.curtains(S)}`,
        update: (lt, S) => poseNurse(S, lt, { x: 760, y: 770, k: 1.45, look: 1 })
      },
      { // 1 — shadows on the paper: the concubine with her son, the Empress looming
        at: 15.3,
        cam: { from: [800, 450, 1.04], to: [800, 430, 1.12] },
        svg: (S) => `<g data-depth=".2">${Sc.paperScreen(S)}</g>
          <g data-depth=".3" filter="${S.u('cast')}">
            <g transform="translate(560,780) scale(1.25)">${G.person(S, { id: 'conc', hair: 'loops', robe: 'court', fill: S.p.cast, cut: false, arm: { ua0: -40, fa0: -80, hold: '' } })}</g>
            <g id="${S.id('babyc')}" transform="translate(690,420) scale(1.1)">${Pr.baby(S, S.p.cast)}</g>
            <g id="${S.id('emp')}" opacity="0"><g transform="translate(1180,800) scale(-1.7,1.7)">${G.person(S, { id: 'emp', hair: 'phoenix', robe: 'court', fill: S.p.cast, cut: false, arm: { ua0: -70, fa0: -30 } })}</g></g>
          </g>
          <g data-depth=".32">${Sc.latticeWall(S).replace(/fill="url\(#s\d+-lattice\)"/, 'fill="none"')}${Sc.ceilingBeam(S)}</g>
          <g data-depth=".55">${Sc.floor(S)}</g>
          ${Sc.curtains(S)}`,
        update: (lt, S) => {
          const a = M.ramp(lt, 2.0, 4.5);
          const e = S.q('#' + S.id('emp'));
          e.setAttribute('opacity', a.toFixed(3));
          e.setAttribute('transform', `translate(${(80 * (1 - a)).toFixed(1)},0)`);
          G.rot(S.q('#' + S.id('conc-head')), -8 * M.ramp(lt, 3, 4.5), 12, -350); // she glances back
        }
      },
      { // 2 — the Inner Court at night
        at: 23.4,
        cam: { from: [760, 470, 1.02], to: [900, 440, 1.14] },
        svg: (S) => `<g data-depth=".1"><rect x="-300" y="-300" width="2200" height="1500" fill="#120a1c"/>
            <circle cx="1220" cy="220" r="60" fill="${S.p.paperHi}" opacity=".85"/><circle class="glow" cx="1220" cy="220" r="220" fill="${S.u('warmGlow')}" opacity=".5"/></g>
          <g data-depth=".25">${Sc.hall(S, 380, 600, 360, S.p.hill3)}${Sc.hall(S, 1250, 580, 420, S.p.hill3)}</g>
          <g data-depth=".45">${Sc.pine(S, 120, 720, 1.4)}${Sc.pine(S, 1500, 730, 1.2)}
            <rect x="-300" y="690" width="2200" height="400" fill="${S.p.ink}"/></g>
          ${Pr.lanterns(S, [[620, 80, 160], [980, 80, 200]])}
          <g data-depth=".7"><g transform="translate(800,760) scale(.9)">${G.person(S, { id: 'eun', hair: 'cap', robe: 'man' })}</g></g>`,
        update: (lt, S) => {
          // a eunuch carrying a bowl crosses the courtyard
          const x = -400 + lt * 60;
          G.move(S.q('#' + S.id('eun')), x, Math.abs(Math.sin(lt * 3.2)) * -5);
          G.pose(S, 'eun', { nearUa: -55, nearFa: -60, farUa: -50, farFa: -65 });
        }
      },
      { // 3 — close-up: the milk
        at: 30.23,
        cam: { from: [800, 470, 1.0], to: [800, 500, 1.16] },
        svg: (S) => `<rect x="-300" y="-300" width="2200" height="1500" fill="${S.p.wall}"/>
          <circle class="glow" cx="800" cy="380" r="700" fill="${S.u('warmGlow')}" opacity=".6"/>
          <g data-depth=".5"><rect x="-300" y="560" width="2200" height="600" fill="${S.p.floorHi}"/></g>
          <g id="${S.id('bbw')}" transform="translate(800,470)">${Pr.bigBowl(S)}</g>`,
        update: (lt, S, t) => {
          const tr = TREM(lt, 1);
          S.q('#' + S.id('bbw')).setAttribute('transform', `translate(${(800 + tr * 3).toFixed(1)},${(470 + tr * 2).toFixed(1)}) rotate(${(tr * .4).toFixed(2)})`);
          const r = (lt * 0.6) % 1;
          S.q('#' + S.id('bb-ripple')).setAttribute('transform', `translate(0,6) scale(${(0.6 + r * 1.2).toFixed(3)}) translate(0,-6)`);
          S.q('#' + S.id('bb-ripple')).setAttribute('opacity', (1 - r).toFixed(3));
        }
      },
      { // 4 — back on her face: "this is your last meal"
        at: 40.04,
        cam: { from: [840, 440, 1.4], to: [870, 400, 1.7] },
        svg: (S) => `${Sc.nursery(S)}
          ${Pr.lanterns(S, [[420, 120, 90]])}
          <g data-depth=".9">${nurseWithBowl(S, 760, 770, 1.45)}</g>
          ${Sc.curtains(S)}`,
        update: (lt, S) => poseNurse(S, lt, { x: 760, y: 770, k: 1.45, lift: .25 * M.ramp(lt, 0, 3), look: 1 })
      }
    ]
  });

})();
