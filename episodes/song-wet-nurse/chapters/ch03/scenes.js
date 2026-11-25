// @style song
// @pad 0.6
// Chapter 3 — The golden cage. Physicians, forbidden food, forbidden tears, the cane.
(() => {
  const G = window.SongStyle, { Scenery: Sc, Props: Pr } = G, M = Stage.M;
  const q = (S, n) => S.q('#' + S.id(n));
  const cast = (S) => ({ fill: S.p.cast, cut: false });
  const bars = (S) => `<g data-depth="1.5" opacity=".92">
      ${Array.from({ length: 9 }, (_, i) => `<rect x="${-200 + i * 250}" y="-200" width="34" height="1400" fill="${S.p.ink}"/>`).join('')}
      <rect x="-300" y="150" width="2200" height="26" fill="${S.p.ink}"/><rect x="-300" y="720" width="2200" height="26" fill="${S.p.ink}"/></g>`;

  Stage.run({
    style: G,
    duration: TIMINGS.duration + 0.6,
    timings: TIMINGS,
    fadeIn: 0.6,
    scenes: [
      { // 0 — a prisoner of your own biology: bars of the lattice in front of her
        at: 0,
        cam: { from: [800, 450, 1.25], to: [760, 470, 1.05] },
        svg: (S) => `${Sc.nursery(S)}
          ${Pr.lanterns(S, [[1180, 120, 70]])}
          <g data-depth=".9"><g transform="translate(720,772) scale(1.18)">${G.nurseSeated(S, { id: 'ns' })}</g></g>
          ${bars(S)}`,
        update: (lt, S) => {
          G.rot(q(S, 'ns'), 1.4 * Math.sin(lt * 1.9), 20, 0);
          q(S, 'ns-head').setAttribute('transform', `rotate(${(-6 * M.ramp(lt, 2, 5)).toFixed(2)} 14 -322)`);
        }
      },
      { // 1 — physicians watch; a hawk's shadow crosses the screen
        at: 7.62,
        cam: { from: [800, 440, 1.04], to: [800, 450, 1.1] },
        svg: (S) => `<g data-depth=".2">${Sc.paperScreen(S)}</g>
          <g data-depth=".28" filter="${S.u('cast')}">
            <g transform="translate(330,790) scale(1.3)">${G.person(S, { id: 'd1', hair: 'futou', robe: 'man', beard: true, ...cast(S), arm: { ua0: -60, fa0: -20, hold: Pr.scroll(S) } })}</g>
            <g transform="translate(1270,790) scale(-1.3,1.3)">${G.person(S, { id: 'd2', hair: 'futou', robe: 'man', beard: true, ...cast(S) })}</g>
            <g id="${S.id('hawk')}">${Pr.hawk(S, S.p.cast)}</g>
          </g>
          <g data-depth=".32">${Sc.ceilingBeam(S)}</g><g data-depth=".55">${Sc.floor(S)}</g>
          <g data-depth=".85"><g transform="translate(800,772) scale(.95)">${G.nurseSeated(S, { id: 'ns' })}</g></g>
          ${Sc.curtains(S)}`,
        update: (lt, S) => {
          const k = M.ramp(lt, .2, 3.6);
          q(S, 'hawk').setAttribute('transform', `translate(${(-150 + k * 1900).toFixed(1)},${(300 - 120 * Math.sin(k * 3.1)).toFixed(1)}) scale(1.6) rotate(${(-8 + 16 * k).toFixed(1)})`);
          G.pose(S, 'd2', { nearUa: -70, nearFa: -20, farUa: -10, farFa: -20 }); // pointing at her
        }
      },
      { // 2 — forbidden: garlic, onions, heavy spices
        at: 11.28,
        cam: { from: [800, 480, 1.0], to: [800, 470, 1.08] },
        svg: (S) => `<rect x="-300" y="-300" width="2200" height="1500" fill="${S.p.wall}"/>
          <circle class="glow" cx="800" cy="360" r="760" fill="${S.u('warmGlow')}" opacity=".55"/>
          <g data-depth=".5"><rect x="-300" y="560" width="2200" height="700" fill="${S.p.floorHi}"/>
            <rect x="-300" y="560" width="2200" height="10" fill="${S.p.gold}" opacity=".3"/></g>
          ${[['garlic', 420], ['onion', 800], ['peppers', 1180]].map(([n, x], i) => `<g id="${S.id('f' + i)}" transform="translate(${x},560) scale(2.1)">${Pr[n](S)}</g>
            <g transform="translate(${x},520) scale(1.6)">${Pr.redX(S, 'x' + i)}</g>`).join('')}`,
        update: (lt, S) => {
          // each X lands on the word: garlic ~1.6s, onions ~2.6s, spices ~3.7s
          [1.5, 2.5, 3.6].forEach((at, i) => {
            const a = M.ramp(lt, at, at + .25);
            const x = q(S, 'x' + i);
            x.setAttribute('opacity', a.toFixed(3));
            x.setAttribute('transform', `scale(${(1.3 - .3 * a).toFixed(3)})`);
            q(S, 'f' + i).setAttribute('opacity', (1 - .45 * M.ramp(lt, 6, 8)).toFixed(3));
          });
        }
      },
      { // 3 — bland pork fat and fish soup, every day
        at: 22.04,
        cam: { from: [760, 470, 1.04], to: [840, 480, 1.14] },
        svg: (S) => `${Sc.nursery(S)}
          ${Pr.lanterns(S, [[420, 120, 90]])}
          <g data-depth=".8">${Sc.table(S, 980, 772, 520)}
            <g transform="translate(900,600) scale(.9)">${Pr.soupBowl(S)}</g>
            <g transform="translate(1110,630) scale(.8)">${Pr.porkFat(S)}</g></g>
          <g data-depth=".85"><g transform="translate(560,772) scale(1.3)">${G.kneeler(S, { id: 'nurse' })}</g></g>
          ${Sc.curtains(S)}`,
        update: (lt, S) => {
          // she raises a spoon to her mouth, slowly, again and again
          const c = (Math.sin(lt * 1.4) + 1) / 2;
          G.pose(S, 'nurse', { nearUa: -60 - 60 * c, nearFa: -70 - 30 * c, farUa: -40, farFa: -60 });
          G.rot(q(S, 'nurse-head'), 6 + 4 * c, 14, -268);
          S.qa('.steam').forEach((el, i) => el.setAttribute('transform', `translate(${(6 * Math.sin(lt * 1.3 + i)).toFixed(1)},${(-(lt * 14 + i * 22) % 50).toFixed(1)})`));
        }
      },
      { // 4 — no anger, no grief: a tear she must not shed
        at: 29.67,
        cam: { from: [800, 420, 2.0], to: [810, 400, 2.3] },
        svg: (S) => `${Sc.nursery(S)}
          <g data-depth=".9"><g transform="translate(760,780) scale(1.45)">${G.kneeler(S, { id: 'nurse' })}</g></g>
          <g id="${S.id('tear')}" opacity="0">${Pr.tear(S)}</g>`,
        update: (lt, S) => {
          G.pose(S, 'nurse', { nearUa: -20, nearFa: -40, farUa: -14, farFa: -40 });
          G.rot(q(S, 'nurse-head'), 8, 14, -268);
          // eye ≈ (25,-294) in figure space → stage (760+25*1.45, 780-294*1.45)
          const ex = 760 + 26 * 1.45, ey = 780 - 290 * 1.45;
          const well = M.ramp(lt, 1.2, 3.2), fall = M.ramp(lt, 5.5, 8.5);
          q(S, 'tear').setAttribute('opacity', (well * (1 - M.ramp(lt, 8.4, 9))).toFixed(3));
          q(S, 'tear').setAttribute('transform', `translate(${ex + 6},${(ey + 10 + fall * 220).toFixed(1)}) scale(${(.3 + .2 * well).toFixed(3)})`);
        }
      },
      { // 5 — the baby has a fever: it is your fault. You will be beaten.
        at: 39.85,
        cam: { from: [800, 450, 1.04], to: [800, 450, 1.12] },
        svg: (S) => `<g data-depth=".2">${Sc.paperScreen(S)}</g>
          <g data-depth=".28" filter="${S.u('cast')}">
            <g transform="translate(1180,790) scale(-1.35,1.35)">${G.person(S, { id: 'doc', hair: 'futou', robe: 'man', beard: true, ...cast(S) })}</g>
            <g id="${S.id('cane')}"><g transform="translate(0,0)">${Pr.cane(S).replace(new RegExp(S.p.ink, 'g'), S.p.cast)}</g></g>
          </g>
          <g data-depth=".32">${Sc.ceilingBeam(S)}</g><g data-depth=".55">${Sc.floor(S)}</g>
          <g data-depth=".85"><g id="${S.id('kn')}" transform="translate(520,772) scale(1.15)">${G.kneeler(S, { id: 'nurse' })}</g></g>
          <rect id="${S.id('flash')}" x="-300" y="-300" width="2200" height="1500" fill="${S.u('redPulse')}" opacity="0"/>
          ${Sc.curtains(S)}`,
        update: (lt, S) => {
          G.pose(S, 'doc', { nearUa: -80, nearFa: -10, farUa: -8, farFa: -20 });
          // nurse bows low
          const bow = M.ramp(lt, 2.5, 4);
          q(S, 'kn').setAttribute('transform', `translate(520,772) scale(1.15) rotate(${(18 * bow).toFixed(2)} 0 -60)`);
          G.pose(S, 'nurse', { nearUa: -30 * bow, nearFa: -30, farUa: -26 * bow, farFa: -30 });
          // the cane rises, then strikes on "beaten" (~5.4 s)
          const up = M.ramp(lt, 3.2, 4.8), hit = M.ramp(lt, 5.1, 5.3);
          const a = -10 + 40 * up - 110 * hit;
          q(S, 'cane').setAttribute('transform', `translate(1060,520) rotate(${a.toFixed(1)}) translate(0,40)`);
          q(S, 'flash').setAttribute('opacity', (0.9 * M.pulse(lt, 5.25, .7)).toFixed(3));
        }
      }
    ]
  });
})();
