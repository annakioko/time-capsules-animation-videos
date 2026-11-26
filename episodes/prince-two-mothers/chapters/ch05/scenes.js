// @style flat
// @pad 1.5
// Chapter 5 — The walls. Peeking at the city, the nurse pulls him down, the village and the baby she left.
(() => {
  const F = window.FlatStyle, { Scenery: Sc, Props: Pr } = F, M = Stage.M, C = window.CAST;
  const stones = (S, x, y) => `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="0" rx="150" ry="40" fill="#8f8898" stroke="${S.p.ink}" stroke-width="4"/><ellipse cx="-20" cy="-50" rx="110" ry="40" fill="#a39cab" stroke="${S.p.ink}" stroke-width="4"/><ellipse cx="10" cy="-100" rx="80" ry="32" fill="#b6afbe" stroke="${S.p.ink}" stroke-width="4"/></g>`;
  const sound = (S, x, y, txt, sid) => `<g id="${S.id(sid)}" opacity="0">${Pr.label(S, x, y, txt, 34)}</g>`;

  Stage.run({
    style: F, duration: TIMINGS.duration + 1.5, timings: TIMINGS, maxWords: 8,
    scenes: [
      { // 0 — you climb the garden stones to look at the rooftops of Kaifeng
        at: 0, cam: { from: [800, 450, 1.02], to: [800, 380, 1.2] },
        svg: (S) => `${Sc.palaceWall(S)}
          <g data-depth=".8">${stones(S, 800, 820)}<g id="${S.id('kid')}">${place(F.person(S, C.prince(S)), 800, 720, 1.1)}</g></g>
          ${sound(S, 300, 240, 'drums', 's1')}${sound(S, 620, 170, 'markets', 's2')}${sound(S, 1020, 190, 'carts', 's3')}${sound(S, 1330, 250, 'shouting', 's4')}`,
        update: (lt, S) => {
          [4.4, 5.3, 6.1, 6.9].forEach((a, i) => setO(S, 's' + (i + 1), M.win(lt, a, a + 5, .4)));
          setT(S, 'kid', `translate(0 ${(-6 * Math.abs(Math.sin(lt * 1.5))).toFixed(1)})`);
          F.face(S, 'prince', { t: lt, phase: .5, mouth: lt > 4 ? 'smile' : 'neutral', brows: 'up', look: [Math.sin(lt * .7) * 7, -6] });
        }
      },
      { // 1 — a hand pulls you down: your nurse. "If a guard sees you, I will be beaten, not you."
        at: 15.83, cam: { from: [880, 460, 1.1], to: [900, 450, 1.18] },
        svg: (S) => `${Sc.palaceWall(S)}
          <g data-depth=".8">${stones(S, 760, 820)}<g id="${S.id('kid')}">${place(F.person(S, C.prince(S)), 760, 720, 1.1)}</g></g>
          <g data-depth=".85"><g id="${S.id('walk')}">${place(F.person(S, C.nurse(S)), 0, 860, 1.05)}</g></g>`,
        update: (lt, S) => {
          const k = M.ramp(lt, 0, 1.2); setT(S, 'walk', `translate(${(1500 - 380 * k).toFixed(1)} 0)`);
          const d = M.ramp(lt, 1.3, 2.0); setT(S, 'kid', `translate(${(-60 * d).toFixed(1)} ${(130 * d).toFixed(1)})`);
          const talk = lt > 3.5 && lt < 7.7;
          F.face(S, 'nurse', { t: lt, phase: .3, mouth: talk ? (Math.sin(lt * 13) > 0 ? 'talk' : 'worried') : 'worried', brows: 'worried', look: [-7, 0] });
          F.face(S, 'prince', { t: lt, phase: 1.1, mouth: d > .5 ? 'scared' : 'smile', brows: d > .5 ? 'up' : 'up', look: d > .5 ? [6, 0] : [0, -6] });
        }
      },
      { // 2 — side by side against the wall: "What is it like out there?" The village. The baby she left.
        at: 23.61, cam: { from: [800, 470, 1.1], to: [820, 440, 1.2] },
        svg: (S) => `${Sc.palaceWall(S)}
          <g data-depth=".85">${place(F.person(S, C.prince(S, { kneel: true })), 600, 860, 1.15)}${place(F.person(S, C.nurse(S, { kneel: true })), 1000, 860, 1.0)}</g>
          <g id="${S.id('v1')}" opacity="0">${Pr.bubble(S, 1260, 280, 175, Pr.village(S, false), 'vb1', [-1, 1])}</g>
          <g id="${S.id('v2')}" opacity="0">${Pr.bubble(S, 1260, 280, 175, Pr.village(S, true), 'vb2', [-1, 1])}</g>`,
        update: (lt, S) => {
          setO(S, 'v1', M.ramp(lt, 8.0, 8.5) * (1 - M.ramp(lt, 16.7, 17.2))); setO(S, 'v2', M.ramp(lt, 16.7, 17.2));
          const ask = lt > 5.6 && lt < 7.9, talk = lt > 8 && lt < 13.5;
          F.face(S, 'prince', { t: lt, phase: .4, mouth: ask ? (Math.sin(lt * 13) > 0 ? 'talk' : 'neutral') : (lt > 13.5 ? 'worried' : 'neutral'), brows: lt > 13.5 ? 'worried' : 'up', look: [7, -2] });
          F.face(S, 'nurse', { t: lt, phase: 1.6, mouth: talk ? (Math.sin(lt * 12) > 0 ? 'talk' : 'smile') : (lt > 13.5 ? 'worried' : 'smile'), brows: lt > 13.5 ? 'worried' : 'flat', look: lt > 20 ? [0, 6] : [5, -5], cry: lt > 21 });
        }
      }
    ]
  });
})();
