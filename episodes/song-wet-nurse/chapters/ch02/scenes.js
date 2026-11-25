// @style song
// @pad 0.6
// Chapter 2 — Chosen. The village, the eunuchs, the gates, the harem's ladder.
(() => {
  const G = window.SongStyle, { Scenery: Sc, Props: Pr } = G, M = Stage.M;
  const q = (S, n) => S.q('#' + S.id(n));
  const walk = (lt, speed = 3.4) => Math.abs(Math.sin(lt * speed)) * -6;

  // a figure holding the baby in the crook of the near arm
  const holdBaby = (S, fig, babyId, fx, fy, k, lt) => {
    const ua = -28, fa = -95 + 2 * Math.sin(lt * 1.6);
    G.pose(S, fig, { nearUa: ua, nearFa: fa, farUa: -20, farFa: -100 });
    const [hx, hy] = G.hand(6, -318, ua, fa, 74, 70);
    G.move(q(S, babyId), fx + (hx - 34) * k, fy + (hy + 6) * k, k * .9);
  };

  const village = (S) => `<g data-depth=".08">${Sc.sky(S, { sun: [1180, 470], r: 64 })}</g>${Sc.mountains(S)}
    <g data-depth=".45">${Sc.hut(S, 1280, 690, 1.1)}${Sc.hut(S, 1560, 670, .8)}${Sc.willow(S, 260, 700, 1.2)}</g>${Sc.paddies(S)}`;

  Stage.run({
    style: G,
    duration: TIMINGS.duration + 0.6,
    timings: TIMINGS,
    fadeIn: 0.8,
    scenes: [
      { // 0 — "the most dangerous room in the empire": pull back from the nursery
        at: 0,
        cam: { from: [800, 430, 1.35], to: [800, 450, 1.0] },
        svg: (S) => `${Sc.nursery(S)}
          ${Pr.lanterns(S, [[420, 120, 90], [1180, 120, 70]])}
          <g data-depth=".9"><g transform="translate(700,772) scale(1.18)">${G.nurseSeated(S, { id: 'ns' })}</g></g>
          ${Sc.curtains(S)}`,
        update: (lt, S) => G.rot(q(S, 'ns'), 1.6 * Math.sin(lt * 1.9), 20, 0)
      },
      { // 1 — three months ago: a muddy village, a new mother
        at: 4.97,
        cam: { from: [700, 470, 1.0], to: [980, 480, 1.12] },
        svg: (S) => `${village(S)}
          <g data-depth=".75"><g id="${S.id('mom')}" transform="translate(1050,780) scale(1.05)">${G.person(S, { id: 'mom', hair: 'wrap', robe: 'plain' })}</g>
            <g id="${S.id('bb')}">${Pr.baby(S)}</g></g>`,
        update: (lt, S) => {
          G.move(q(S, 'mom'), 1050, 780 + 2 * Math.sin(lt * 1.4), 1.05);
          holdBaby(S, 'mom', 'bb', 1050, 780, 1.05, lt);
          G.rot(q(S, 'mom-head'), 14, 12, -350);
        }
      },
      { // 2 — the eunuchs come down the road
        at: 17.49,
        cam: { from: [800, 470, 1.04], to: [760, 480, 1.1] },
        svg: (S) => `${village(S)}
          <g data-depth=".75">
            <g id="${S.id('e1')}">${G.person(S, { id: 'e1', hair: 'cap', robe: 'man' })}</g>
            <g id="${S.id('e2')}">${G.person(S, { id: 'e2', hair: 'futou', robe: 'man' })}</g>
          </g>`,
        update: (lt, S) => {
          G.move(q(S, 'e1'), -40 + lt * 80, 790 + walk(lt), .95);
          G.move(q(S, 'e2'), -260 + lt * 80, 790 + walk(lt + .4), .95);
          G.pose(S, 'e1', { nearUa: 12 * Math.sin(lt * 3.4), nearFa: -10, farUa: -12 * Math.sin(lt * 3.4), farFa: -10 });
          G.pose(S, 'e2', { nearUa: -40, nearFa: -50, farUa: -8, farFa: -10 });
        }
      },
      { // 3 — inspected: skin, teeth, the baby. "You were chosen."
        at: 24.3,
        cam: { from: [860, 440, 1.12], to: [900, 420, 1.25] },
        svg: (S) => `${village(S)}
          <g data-depth=".75">
            <g transform="translate(700,790) scale(1.05)">${G.person(S, { id: 'e1', hair: 'cap', robe: 'man' })}</g>
            <g transform="translate(470,790) scale(1.05)">${G.person(S, { id: 'e2', hair: 'futou', robe: 'man', arm: { ua0: -60, fa0: -30, hold: Pr.scroll(S) } })}</g>
            <g id="${S.id('spot')}" opacity="0"><ellipse class="glow" cx="1050" cy="520" rx="230" ry="330" fill="${S.u('warmGlow')}"/></g>
            <g id="${S.id('mom')}" transform="translate(1050,790) scale(-1.05,1.05)">${G.person(S, { id: 'mom', hair: 'wrap', robe: 'plain' })}</g>
            <g id="${S.id('bb')}">${Pr.baby(S)}</g>
          </g>`,
        update: (lt, S) => {
          // the eunuch leans in and lifts a hand toward her face; at "chosen" he points
          const lean = M.ramp(lt, 0.5, 2.5) * (1 - M.ramp(lt, 6.2, 7));
          G.rot(q(S, 'e1'), 0, 0, 0);
          q(S, 'e1').setAttribute('transform', `rotate(${(8 * lean).toFixed(2)} 0 0)`);
          const point = M.ramp(lt, 6.6, 7.4);
          G.pose(S, 'e1', { nearUa: -70 - 20 * point + 6 * Math.sin(lt * 2) * (1 - point), nearFa: -40 * (1 - point), farUa: -10, farFa: -10 });
          G.rot(q(S, 'e1-head'), 10 * lean, 12, -350);
          // mother faces left (mirrored), baby held toward him
          const ua = -28, fa = -95;
          G.pose(S, 'mom', { nearUa: ua, nearFa: fa, farUa: -20, farFa: -100 });
          const [hx, hy] = G.hand(6, -318, ua, fa, 74, 70);
          G.move(q(S, 'bb'), 1050 - (hx - 34) * 1.05, 790 + (hy + 6) * 1.05, .95, 'scale(-1,1)');
          q(S, 'spot').setAttribute('opacity', M.ramp(lt, 6.8, 8).toFixed(3));
        }
      },
      { // 4 — the price: she is led away, the baby stays behind
        at: 33.21,
        cam: { from: [900, 460, 1.06], to: [760, 470, 1.12] },
        svg: (S) => `${village(S)}
          <g data-depth=".7"><g transform="translate(1180,760) scale(1.2)">
            <path d="M-60,0 C-60,-30 60,-30 60,0Z" fill="${S.p.ink}" stroke="${S.p.inkEdge}" stroke-opacity=".4"/>
            <g transform="translate(6,-26) scale(.8)">${Pr.baby(S)}</g></g></g>
          <g data-depth=".75">
            <g id="${S.id('e1')}">${G.person(S, { id: 'e1', hair: 'cap', robe: 'man' })}</g>
            <g id="${S.id('mom')}">${G.person(S, { id: 'mom', hair: 'wrap', robe: 'plain' })}</g>
          </g>`,
        update: (lt, S) => {
          const go = M.ramp(lt, 1.5, 9);
          q(S, 'e1').setAttribute('transform', `translate(${(720 - go * 520).toFixed(1)},${(790 + walk(lt) * go).toFixed(1)}) scale(-1,1)`);
          q(S, 'mom').setAttribute('transform', `translate(${(960 - go * 470).toFixed(1)},${(790 + walk(lt + .3) * go).toFixed(1)}) scale(-1,1)`);
          G.pose(S, 'e1', { nearUa: -70, nearFa: -10, farUa: 10 * Math.sin(lt * 3.4), farFa: -10 });
          G.pose(S, 'mom', { nearUa: 6 * Math.sin(lt * 3.4), nearFa: -6, farUa: -6 * Math.sin(lt * 3.4), farFa: -8 });
          // she looks back over her shoulder
          q(S, 'mom-head').setAttribute('transform', `translate(24,0) scale(${M.win(lt, 3, 6.5, .1) > .5 ? -1 : 1},1) translate(-24,0)`);
        }
      },
      { // 5 — the vermilion gates open
        at: 39.77,
        cam: { from: [800, 460, 1.0], to: [800, 520, 1.12] },
        svg: (S) => `<g data-depth=".4">${Sc.palaceGate(S, 'gate')}</g>
          <g data-depth=".8"><g id="${S.id('you')}">${G.person(S, { id: 'you', hair: 'wrap', robe: 'plain' })}</g></g>
          ${Pr.lanterns(S, [[300, 260, 120], [1300, 260, 120]])}`,
        update: (lt, S) => {
          G.openGate(S, 'gate', M.ramp(lt, 0.4, 3.2));
          const go = M.ramp(lt, 1.6, 4.6);
          q(S, 'you').setAttribute('transform', `translate(800,${(900 - go * 120).toFixed(1)}) scale(${(.8 - .35 * go).toFixed(3)})`);
          q(S, 'you').setAttribute('opacity', (1 - M.ramp(lt, 3.6, 4.6)).toFixed(3));
        }
      },
      { // 6 — stripped, scrubbed, dressed in silks
        at: 44.3,
        cam: { from: [760, 480, 1.05], to: [860, 460, 1.14] },
        svg: (S) => `<g data-depth=".2">${Sc.paperScreen(S)}</g>
          <g data-depth=".32">${Sc.latticeWall(S)}${Sc.ceilingBeam(S)}</g>
          <g data-depth=".55">${Sc.floor(S)}</g>
          <g data-depth=".8">${Sc.tub(S, 560, 780)}
            <g transform="translate(1110,780)">
              <path d="M-150,0 V-430 M150,0 V-430 M-180,-420 H180" stroke="${S.p.ink}" stroke-width="16"/>
              <path id="${S.id('silk')}" d="M-120,-410 H120 L150,-120 C100,-90 60,-130 0,-110 C-60,-130 -100,-90 -150,-120Z" fill="${S.p.lacquerHi}" stroke="${S.p.gold}" stroke-width="4"/>
              ${Array.from({ length: 5 }, (_, i) => `<circle cx="${-80 + i * 40}" cy="-300" r="12" fill="none" stroke="${S.p.gold}" stroke-width="3"/>`).join('')}
            </g></g>
          ${Sc.curtains(S)}`,
        update: (lt, S) => {
          S.qa('.steam').forEach((el, i) => el.setAttribute('transform', `translate(${(8 * Math.sin(lt * 1.2 + i)).toFixed(1)},${(-(lt * 18 + i * 20) % 60).toFixed(1)})`));
          q(S, 'silk').setAttribute('transform', `skewX(${(2 * Math.sin(lt * 1.1)).toFixed(2)})`);
        }
      },
      { // 7 — the ladder of the harem
        at: 48.81,
        cam: { from: [800, 430, 1.0], to: [800, 470, 1.06] },
        svg: (S) => {
          const c = S.p.cast;
          const row = (n, y, k, opts, gap) => Array.from({ length: n }, (_, i) => `<g transform="translate(${800 + (i - (n - 1) / 2) * gap},${y}) scale(${k})">${G.person(S, { ...opts(i), fill: opts(i).fill || c, cut: false })}</g>`).join('');
          return `<g data-depth=".2">${Sc.paperScreen(S)}</g>
            <g data-depth=".3" filter="${S.u('cast')}">
              <g id="${S.id('r0')}" opacity="0"><g transform="translate(800,300) scale(.42)">${Sc.throne(S, 0, 0, 1).replace(new RegExp(S.p.ink, 'g'), c)}</g>
                <g transform="translate(790,300) scale(.5)">${G.person(S, { id: 'emperor', hair: 'futou', robe: 'man', fill: c, cut: false, beard: true })}</g></g>
              <g id="${S.id('r1')}" opacity="0">${row(1, 470, .42, () => ({ id: 'empress', hair: 'phoenix', robe: 'court' }), 0)}</g>
              <g id="${S.id('r2')}" opacity="0">${row(5, 620, .38, (i) => ({ id: 'cons' + i, hair: i % 2 ? 'loops' : 'high', robe: 'court', fill: i === 3 ? '#4a1206' : null }), 120)}</g>
              <g id="${S.id('r3')}" opacity="0">${row(9, 780, .34, (i) => ({ id: 'srv' + i, hair: i % 3 ? 'bun' : 'cap', robe: i % 3 ? 'plain' : 'man' }), 104)}</g>
            </g>
            <g id="${S.id('hiC')}" opacity="0"><ellipse class="glow" cx="920" cy="560" rx="70" ry="110" fill="${S.u('warmGlow')}"/></g>
            <g id="${S.id('hiY')}" opacity="0"><circle cx="1216" cy="744" r="60" fill="none" stroke="${S.p.gold}" stroke-width="4"/></g>
            <g data-depth=".32">${Sc.ceilingBeam(S)}</g>
            ${Sc.curtains(S)}`;
        },
        update: (lt, S) => {
          ['r0', 'r1', 'r2', 'r3'].forEach((r, i) => q(S, r).setAttribute('opacity', M.ramp(lt, .3 + i * .8, 1.2 + i * .8).toFixed(3)));
          q(S, 'hiC').setAttribute('opacity', M.ramp(lt, 4.3, 5.2).toFixed(3));   // "a consort"
          q(S, 'hiY').setAttribute('opacity', (M.ramp(lt, 1.5, 2.6) * (1 - M.ramp(lt, 4, 4.6))).toFixed(3)); // "you" at the bottom
        }
      },
      { // 8 — her whole existence depends on the boy: if he lives… if he dies…
        at: 58.37,
        cam: { from: [800, 450, 1.02], to: [820, 430, 1.12] },
        svg: (S) => `<g data-depth=".2">${Sc.paperScreen(S)}</g>
          <g data-depth=".26" filter="${S.u('cast')}"><g id="${S.id('shadow')}"><g transform="translate(980,790) scale(1.5)">${G.person(S, { id: 'sh', hair: 'loops', robe: 'court', fill: S.p.cast, cut: false })}</g></g>
            <g id="${S.id('crown')}" opacity="0"><g transform="translate(980,790) scale(1.5)">${G.person(S, { id: 'sh2', hair: 'phoenix', robe: 'court', fill: S.p.cast, cut: false })}</g></g></g>
          <g data-depth=".32">${Sc.latticeWall(S).replace(/fill="url\(#s\d+-lattice\)"/, 'fill="none"')}${Sc.ceilingBeam(S)}</g>
          <g data-depth=".55">${Sc.floor(S)}</g>
          <g data-depth=".8"><g id="${S.id('lady')}" transform="translate(620,780) scale(1.1)">${G.person(S, { id: 'lady', hair: 'loops', robe: 'court' })}</g><g id="${S.id('bb')}">${Pr.baby(S)}</g></g>
          ${Sc.curtains(S)}`,
        update: (lt, S) => {
          holdBaby(S, 'lady', 'bb', 620, 780, 1.1, lt);
          const lives = M.ramp(lt, 7.3, 9), dies = M.ramp(lt, 11.6, 12.8);
          q(S, 'crown').setAttribute('opacity', (lives * (1 - dies)).toFixed(3));
          q(S, 'shadow').setAttribute('opacity', (1 - lives * (1 - dies) * .9 - dies * .85).toFixed(3));
          q(S, 'shadow').setAttribute('transform', `translate(980,790) scale(${(1 - .5 * dies).toFixed(3)}) translate(-980,-790)`);
        }
      },
      { // 9 — "And you? Just the vessel."
        at: 72.37,
        cam: { from: [760, 470, 1.1], to: [700, 470, 1.3] },
        svg: (S) => `${Sc.nursery(S)}
          <g data-depth=".26" filter="${S.u('cast')}" opacity=".85"><g transform="translate(1150,790) scale(1.9)">${G.person(S, { id: 'sh', hair: 'loops', robe: 'court', fill: S.p.cast, cut: false, arm: { ua0: -80, fa0: -20 } })}</g></g>
          ${Pr.lanterns(S, [[420, 120, 90]])}
          <g data-depth=".9"><g transform="translate(620,772) scale(1.18)">${G.nurseSeated(S, { id: 'ns' })}</g></g>
          ${Sc.curtains(S)}`,
        update: (lt, S) => G.rot(q(S, 'ns'), 1.6 * Math.sin(lt * 1.9), 20, 0)
      }
    ]
  });
})();
