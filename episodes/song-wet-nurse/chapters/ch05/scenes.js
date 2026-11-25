// @style song
// @pad 5
// Chapter 5 — Who paid the price. Emperors, battles, empresses… and the women underneath.
(() => {
  const G = window.SongStyle, { Scenery: Sc, Props: Pr } = G, M = Stage.M;
  const q = (S, n) => S.q('#' + S.id(n));
  const gold = (S, svg) => svg.replace(new RegExp(S.p.ink, 'g'), S.p.cast);

  const caged = (S, x = 800) => `${Sc.nursery(S)}${Pr.lanterns(S, [[420, 120, 90], [1180, 120, 70]])}
    <g data-depth=".9"><g transform="translate(${x - 30},772) scale(1.1)">${G.nurseSeated(S, { id: 'ns' })}</g>${Sc.cage(S, x, 790, 440, 640)}</g>`;

  Stage.run({
    style: G,
    duration: TIMINGS.duration + 5,
    timings: TIMINGS,
    fadeIn: 0.6,
    fadeOut: 4.5,
    scenes: [
      { // 0 — the hidden reality: a golden cage
        at: 0,
        cam: { from: [800, 420, 1.45], to: [800, 440, 1.1] },
        svg: (S) => caged(S),
        update: (lt, S) => G.rot(q(S, 'ns'), 1.4 * Math.sin(lt * 1.9), 20, 0)
      },
      { // 1 — what history remembers: emperors, battles, empresses
        at: 4.42,
        cam: { from: [800, 450, 1.02], to: [800, 440, 1.1] },
        svg: (S) => `<g data-depth=".2">${Sc.paperScreen(S)}</g>
          <g data-depth=".28" filter="${S.u('cast')}">
            <g id="${S.id('h0')}" opacity="0"><g transform="translate(250,780) scale(.8)">${gold(S, Sc.throne(S, 0, 0, 1))}</g>
              <g transform="translate(400,780) scale(1.05)">${G.person(S, { id: 'emperor', hair: 'futou', robe: 'man', beard: true, fill: S.p.cast, cut: false })}</g></g>
            <g id="${S.id('h1')}" opacity="0">${[0, 1, 2].map(i => `<g id="${S.id('rd' + i)}">${G.rider(S, { fill: S.p.cast })}</g>`).join('')}
              ${[0, 1].map(i => `<g transform="translate(${700 + i * 220},780)">${Pr.banner(S).replace(new RegExp(S.p.ink, 'g'), S.p.cast)}</g>`).join('')}</g>
            <g id="${S.id('h2')}" opacity="0"><g transform="translate(1290,780) scale(-1.2,1.2)">${G.person(S, { id: 'emp', hair: 'phoenix', robe: 'court', fill: S.p.cast, cut: false })}</g></g>
          </g>
          <g data-depth=".32">${Sc.ceilingBeam(S)}</g><g data-depth=".55">${Sc.floor(S)}</g>
          ${Sc.curtains(S)}`,
        update: (lt, S) => {
          [0.3, 1.9, 3.6].forEach((at, i) => q(S, 'h' + i).setAttribute('opacity', M.ramp(lt, at, at + .8).toFixed(3)));
          [0, 1, 2].forEach(i => G.move(q(S, 'rd' + i), 520 + i * 170 + 30 * Math.sin(lt * 2 + i), 780 + 6 * Math.sin(lt * 9 + i), .62));
        }
      },
      { // 2 — the foundations: a palace standing on the backs of kneeling women
        at: 10.41,
        cam: { from: [800, 300, 1.35], to: [800, 560, 1.0] },
        svg: (S) => {
          const rows = [[7, 600, .24], [9, 680, .27], [11, 770, .3], [13, 870, .33]];
          return `<g data-depth=".1">${Sc.sky(S, { sun: [1250, 260], r: 50 })}</g>
            <g data-depth=".9">${Sc.hall(S, 800, 520, 330)}
              ${rows.map(([n, y, k], r) => `<g id="${S.id('row' + r)}">${Array.from({ length: n }, (_, i) => `<g transform="translate(${800 + (i - (n - 1) / 2) * (300 * k + 20)},${y}) scale(${k})">${G.kneeler(S, { id: `k${r}_${i}`, hair: i % 2 ? 'wrap' : 'bun' })}</g>`).join('')}</g>`).join('')}
            </g>
            <rect x="-300" y="880" width="2200" height="400" fill="${S.p.ink}"/>`;
        },
        update: (lt, S) => {
          // bowed under the weight
          for (let r = 0; r < 4; r++) for (let i = 0; i < 7 + r * 2; i++) {
            G.pose(S, `k${r}_${i}`, { nearUa: -20, nearFa: -30, farUa: -16, farFa: -30 });
            const h = q(S, `k${r}_${i}-head`); h && h.setAttribute('transform', `rotate(${(22 + 3 * Math.sin(lt + i + r)).toFixed(1)} 14 -268)`);
          }
        }
      },
      { // 3 — women like you: a golden cage, death in every feeding
        at: 17.04,
        cam: { from: [800, 440, 1.05], to: [800, 420, 1.3] },
        svg: (S) => caged(S),
        update: (lt, S) => G.rot(q(S, 'ns'), 1.4 * Math.sin(lt * 1.9), 20, 0)
      },
      { // 4 — who paid the price? The lamp goes out. Fade to black.
        at: 27.47,
        cam: { from: [800, 450, 1.0], to: [760, 470, 1.18] },
        svg: (S) => `${Sc.nursery(S)}
          <g data-depth=".8"><g transform="translate(1130,770)">${Pr.oilLamp(S)}</g></g>
          <g data-depth=".9"><g transform="translate(700,772) scale(1.18)">${G.nurseSeated(S, { id: 'ns' })}</g></g>
          <rect id="${S.id('dim')}" x="-300" y="-300" width="2200" height="1500" fill="#000" opacity="0"/>
          ${Sc.curtains(S)}`,
        update: (lt, S) => {
          G.rot(q(S, 'ns'), 1.2 * Math.sin(lt * 1.9), 20, 0);
          q(S, 'dim').setAttribute('opacity', (.55 * M.ramp(lt, 4, 9)).toFixed(3));
        }
      }
    ]
  });
})();
