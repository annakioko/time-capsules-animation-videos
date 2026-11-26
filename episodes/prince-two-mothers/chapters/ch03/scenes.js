// @style flat
// @pad 1.5
// Chapter 3 — The lesson. The stern tutor, the brush strokes, the watching, the report to the Emperor.
(() => {
  const F = window.FlatStyle, { Scenery: Sc, Props: Pr } = F, M = Stage.M, C = window.CAST;
  const strokes = (S, lt, a, b) => { for (let i = 0; i < 6; i++) { const el = S.q('#' + S.id('paper') + ' .stroke' + i); if (el) el.setAttribute('opacity', M.ramp(lt, a + i * (b - a) / 6, a + (i + .5) * (b - a) / 6).toFixed(2)); } };
  const redX = (S, x, y) => `<g id="${S.id('x')}" opacity="0" transform="translate(${x} ${y})"><path d="M-50 -50 L50 50 M50 -50 L-50 50" stroke="${S.p.red}" stroke-width="20" stroke-linecap="round"/></g>`;

  Stage.run({
    style: F, duration: TIMINGS.duration + 1.5, timings: TIMINGS, maxWords: 8,
    scenes: [
      { // 0 — the tutor arrives: not here to be kind
        at: 0, cam: { from: [800, 450, 1.0], to: [820, 430, 1.1] },
        svg: (S) => `${Sc.study(S)}
          <g data-depth=".85"><g id="${S.id('walk')}">${place(F.person(S, C.tutor(S)), 0, 840, 1.05)}</g></g>`,
        update: (lt, S) => {
          const k = M.ramp(lt, 0, 3.0), x = 1500 - 700 * k, bob = k < 1 ? Math.abs(Math.sin(lt * 4.5)) * -7 : 0;
          setT(S, 'walk', `translate(${x.toFixed(1)} ${bob.toFixed(1)})`);
          F.face(S, 'tutor', { t: lt, phase: .5, mouth: 'neutral', brows: 'sly', look: k < 1 ? [-6, 0] : [0, 0] });
        }
      },
      { // 1 — character by character; one wrong stroke and you start again
        at: 9.15, cam: { from: [800, 480, 1.08], to: [760, 500, 1.2] },
        svg: (S) => `${Sc.study(S)}
          <g data-depth=".75">${place(F.person(S, C.tutor(S)), 1270, 830, .95)}</g>
          <g data-depth=".85">${place(F.person(S, C.prince(S, { kneel: true })), 720, 790, 1.15)}${Pr.desk(S, 760, 800)}${redX(S, 742, 750)}</g>`,
        update: (lt, S) => {
          if (lt < 10.6) strokes(S, lt, 0, 10); else strokes(S, lt, 12.8, 14.5);
          const x = M.win(lt, 10.63, 12.6, .3); setO(S, 'x', x);
          setT(S, 'x', `translate(742 750) scale(${(.6 + .4 * x).toFixed(3)})`);
          F.face(S, 'prince', { t: lt, phase: .8, mouth: x > .1 ? 'scared' : 'neutral', brows: x > .1 ? 'up' : 'flat', look: [2, 7] });
          F.face(S, 'tutor', { t: lt, phase: 1.6, mouth: x > .1 ? 'talk' : 'neutral', brows: 'sly', look: [-7, 4] });
        }
      },
      { // 2 — he is watching you: clever? patient? when wrong?
        at: 23.25, cam: { from: [1000, 430, 1.15], to: [1040, 410, 1.28] },
        svg: (S) => `${Sc.study(S)}
          <g data-depth=".7">${place(F.person(S, C.prince(S, { kneel: true })), 600, 790, .9)}${Pr.desk(S, 620, 800).replace(/translate\(620 800\)/, 'translate(620 800) scale(.8)')}</g>
          <g data-depth=".85">${place(F.person(S, C.tutor(S)), 1050, 860, 1.15)}${Pr.scrollMsg(S, 1050, 560, 1.2)}</g>
          <g id="${S.id('q1')}" opacity="0">${Pr.label(S, 1480, 300, 'Clever?', 40)}</g>
          <g id="${S.id('q2')}" opacity="0">${Pr.label(S, 1480, 400, 'Patient?', 40)}</g>
          <g id="${S.id('q3')}" opacity="0">${Pr.label(S, 1450, 500, 'When wrong?', 40)}</g>`,
        update: (lt, S) => {
          setO(S, 'q1', M.ramp(lt, 4.9, 5.3)); setO(S, 'q2', M.ramp(lt, 6.75, 7.1)); setO(S, 'q3', M.ramp(lt, 8.3, 8.7));
          F.face(S, 'tutor', { t: lt, phase: .3, mouth: 'smirk', brows: 'sly', look: [-7, 2] });
          F.face(S, 'prince', { t: lt, phase: 1.3, mouth: 'neutral', brows: 'flat', look: [0, 6] });
        }
      },
      { // 3 — everything he sees can reach the Emperor
        at: 34.09, cam: { from: [800, 430, 1.05], to: [800, 410, 1.12] },
        svg: (S) => `${Sc.throneRoom(S)}
          <g data-depth=".8">${Pr.throne(S, 800, 760)}${place(F.person(S, C.emperor(S, { kneel: true })), 800, 690, .95)}</g>
          <g id="${S.id('fly')}">${Pr.scrollMsg(S, 0, 0, 1.3)}</g>`,
        update: (lt, S) => {
          const k = M.ramp(lt, .2, 2.6);
          setT(S, 'fly', `translate(${(100 + 560 * k).toFixed(1)} ${(500 - 160 * Math.sin(k * Math.PI) + 40 * k).toFixed(1)}) rotate(${(360 * k).toFixed(1)})`);
          setO(S, 'fly', 1 - M.ramp(lt, 2.6, 3.0));
          F.face(S, 'emperor', { t: lt, phase: .7, mouth: 'neutral', brows: 'flat', look: [-6, 0] });
        }
      },
      { // 4 — you never show you are tired, or afraid; nine, and already performing
        at: 37.74, cam: { from: [740, 400, 1.6], to: [740, 380, 1.85] },
        svg: (S) => `${Sc.study(S)}
          <g data-depth=".85"><g id="${S.id('tr')}">${place(F.person(S, C.prince(S, { kneel: true, tired: true })), 720, 790, 1.15)}</g>${Pr.desk(S, 760, 800)}</g>`,
        update: (lt, S) => {
          strokes(S, 10, 0, 1);
          setT(S, 'tr', `translate(${TREM(lt, .8).toFixed(2)} 0)`);
          F.face(S, 'prince', { t: lt, phase: .2, mouth: lt > 5.4 ? 'smile' : 'neutral', brows: lt > 5.4 ? 'worried' : 'flat', look: lt > 5.4 ? [0, 0] : [0, 4] });
        }
      }
    ]
  });
})();
