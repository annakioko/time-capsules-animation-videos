// @style flat
// @pad 1.5
// Chapter 6 — The secret. Night: the window, the water, "Goodnight, mother", the tear, the candle goes out.
(() => {
  const F = window.FlatStyle, { Scenery: Sc, Props: Pr } = F, M = Stage.M, C = window.CAST;
  const bed = (S, x = 1000) => `<g data-depth=".7">${Pr.bedBack(S, x, 740)}</g>
    <g data-depth=".75">${place(F.person(S, C.prince(S, { kneel: true })), x, 600, 1.15)}</g>
    <g data-depth=".75">${Pr.bedFront(S, x, 740)}</g>`;
  const dark = (S) => `<rect id="${S.id('dark')}" x="-300" y="-200" width="2200" height="1300" fill="#0d0a1a" opacity="0"/>`;

  Stage.run({
    style: F, duration: TIMINGS.duration + 1.5, timings: TIMINGS, maxWords: 8, fadeOut: 1.2,
    scenes: [
      { // 0 — she checks the windows, tastes your water, sits by your bed
        at: 0, cam: { from: [800, 450, 1.0], to: [820, 440, 1.08] },
        svg: (S) => `${Sc.bedchamber(S, true)}
          ${bed(S, 1050)}
          <g data-depth=".8">${Pr.candle(S, 1490, 800)}</g>
          <g data-depth=".85"><g id="${S.id('ns')}">${place(F.person(S, C.nurse(S, { arms: 'hold' })), 0, 860, 1.0)}</g></g>
          <g data-depth=".85"><g id="${S.id('nk')}" opacity="0">${place(F.person(S, C.nurse(S, { id: 'nurseK', kneel: true })), 660, 860, .95)}</g></g>`,
        update: (lt, S) => {
          const x = 340 + 300 * M.ramp(lt, 2.6, 4.2);
          setT(S, 'ns', `translate(${x.toFixed(1)} 0)`);
          const sip = M.win(lt, 4.4, 6.4, .5); setT(S, 'nurse-arms', `translate(0 ${(-160 * sip).toFixed(1)})`);
          const kneel = M.ramp(lt, 6.6, 7.0); setO(S, 'ns', 1 - kneel); setO(S, 'nk', kneel);
          F.face(S, 'nurse', { t: lt, phase: .3, mouth: 'neutral', brows: 'flat', look: lt < 2.6 ? [-7, -3] : [6, 0] });
          F.face(S, 'nurseK', { t: lt, phase: .3, mouth: 'smile', brows: 'flat', look: [6, -2] });
          F.face(S, 'prince', { t: lt, phase: 1.1, mouth: 'neutral', brows: 'flat', look: [-6, 0], sleepy: 1 - .45 * M.ramp(lt, 6, 10) });
        }
      },
      { // 1 — half asleep, you whisper the word you are never allowed to say: "Goodnight, mother."
        at: 10.56, cam: { from: [1050, 320, 1.8], to: [1050, 300, 2.05] },
        svg: (S) => `${Sc.bedchamber(S, true)}${bed(S, 1050)}`,
        update: (lt, S) => {
          const talk = lt > 6.0 && lt < 7.8;
          F.face(S, 'prince', { t: lt, phase: .2, mouth: talk ? (Math.sin(lt * 10) > 0 ? 'talk' : 'smile') : 'smile', brows: 'flat', look: [-4, 0], sleepy: talk ? .5 : .3 });
        }
      },
      { // 2 — she freezes, looks at the door; a tear
        at: 18.7, cam: { from: [700, 380, 1.55], to: [700, 360, 1.75] },
        svg: (S) => `${Sc.bedchamber(S, true)}${bed(S, 1150)}
          <g data-depth=".85">${place(F.person(S, C.nurse(S, { kneel: true })), 700, 860, 1.05)}</g>`,
        update: (lt, S) => {
          const door = lt > 1.6;
          F.face(S, 'nurse', { t: lt, phase: .7, mouth: lt < 1.6 ? 'scared' : 'worried', brows: 'up', look: door ? [-8, 0] : [6, 0], cry: lt > 6.5 });
          F.face(S, 'prince', { t: lt, mouth: 'smile', sleepy: .25 });
        }
      },
      { // 3 — she kisses your forehead, says nothing, cries until the candle goes out
        at: 33.42, cam: { from: [960, 430, 1.25], to: [990, 410, 1.38] },
        svg: (S) => `${Sc.bedchamber(S, true)}${bed(S, 1050)}
          <g data-depth=".8">${Pr.candle(S, 1490, 800, 'cand')}</g>
          <g data-depth=".85"><g id="${S.id('lean')}">${place(F.person(S, C.nurse(S, { kneel: true })), 690, 860, 1.0)}</g></g>
          ${dark(S)}`,
        update: (lt, S) => {
          const k = M.win(lt, .4, 2.6, .6); setT(S, 'lean', `translate(${(120 * k).toFixed(1)} ${(-30 * k).toFixed(1)})`);
          F.face(S, 'nurse', { t: lt, phase: .5, mouth: 'worried', brows: 'worried', look: [7, -2], cry: true });
          F.face(S, 'prince', { t: lt, mouth: 'smile', sleepy: .1 });
          const out = M.ramp(lt, 7.6, 8.2);
          const fl = S.q('#' + S.id('cand') + ' .cflame'); if (fl) fl.setAttribute('opacity', (1 - out).toFixed(3));
          setO(S, 'dark', .72 * out);
        }
      }
    ]
  });
})();
