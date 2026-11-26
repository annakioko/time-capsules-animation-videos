// @style flat
// @pad 1.5
// Chapter 2 — Two mothers. The consort's hall, the bow, her ambition, the nurse shut outside.
(() => {
  const F = window.FlatStyle, { Scenery: Sc, Props: Pr } = F, M = Stage.M, C = window.CAST;
  const dais = (S, x, y, w = 560) => `<g transform="translate(${x} ${y})"><rect x="${-w / 2}" y="0" width="${w}" height="50" fill="${S.p.redLo}" stroke="${S.p.ink}" stroke-width="4"/><rect x="${-w / 2 - 30}" y="50" width="${w + 60}" height="40" fill="${S.p.red}" stroke="${S.p.ink}" stroke-width="4"/><rect x="${-w / 2}" y="10" width="${w}" height="10" fill="${S.p.gold}"/></g>`;
  const hall = (S) => `${Sc.hall(S)}${Pr.lantern(S, 300, 50, 40, .9)}${Pr.lantern(S, 1300, 50, 40, .9)}`;

  Stage.run({
    style: F, duration: TIMINGS.duration + 1.5, timings: TIMINGS, maxWords: 8,
    scenes: [
      { // 0 — the prince is led in to greet his mother on her dais
        at: 0, cam: { from: [800, 450, 1.0], to: [820, 430, 1.1] },
        svg: (S) => `${hall(S)}
          <g data-depth=".7">${dais(S, 1000, 640)}${place(F.person(S, C.consort(S, { kneel: true })), 1000, 650, 1.0)}</g>
          <g data-depth=".85"><g id="${S.id('walk')}">${place(F.person(S, C.prince(S)), 0, 840, 1.05)}</g></g>`,
        update: (lt, S) => {
          const k = M.ramp(lt, 0, 3.2), x = 150 + 380 * k, bob = k < 1 ? Math.abs(Math.sin(lt * 5)) * -8 : 0;
          setT(S, 'walk', `translate(${x.toFixed(1)} ${bob.toFixed(1)})`);
          F.face(S, 'prince', { t: lt, phase: .5, mouth: 'neutral', brows: 'flat', look: [6, -2] });
          F.face(S, 'conc', { t: lt, phase: 1.7, mouth: lt > 5 ? 'smirk' : 'neutral', brows: 'flat', look: [-6, 2] });
        }
      },
      { // 1 — you kneel and touch your forehead to the floor; she does not hug you
        at: 11.63, cam: { from: [800, 470, 1.1], to: [780, 460, 1.18] },
        svg: (S) => `${hall(S)}
          <g data-depth=".7">${dais(S, 1100, 640)}${place(F.person(S, C.consort(S, { kneel: true })), 1100, 650, 1.0)}</g>
          <g data-depth=".85"><g id="${S.id('bow')}">${place(F.person(S, C.prince(S, { kneel: true })), 520, 840, 1.2)}</g></g>`,
        update: (lt, S) => {
          const b = M.win(lt, 1.3, 4.0, .5);
          setT(S, 'bow', `translate(0 ${(50 * b).toFixed(1)})`);
          setT(S, 'prince-head', `translate(0 ${(26 * b).toFixed(1)})`);
          const talk = lt > 4.2 && lt < 8.1;
          F.face(S, 'conc', { t: lt, phase: 1.2, mouth: talk ? (Math.sin(lt * 13) > 0 ? 'talk' : 'neutral') : 'neutral', brows: 'flat', look: [-6, 3] });
          F.face(S, 'prince', { t: lt, phase: .3, mouth: lt > 10.2 ? 'worried' : 'neutral', brows: lt > 8.1 ? 'worried' : 'flat', look: b > .5 ? [0, 6] : (lt > 8.1 && lt < 10 ? [6, -3] : [5, 0]) });
        }
      },
      { // 2 — to her, you are her future: the crown, the power, or nothing
        at: 25.17, cam: { from: [760, 420, 1.15], to: [760, 400, 1.25] },
        svg: (S) => `${hall(S)}
          <g data-depth=".8">${dais(S, 700, 660)}${place(F.person(S, C.consort(S, { kneel: true })), 700, 670, 1.15)}</g>
          <g id="${S.id('b1')}" opacity="0">${Pr.bubble(S, 1160, 300, 170, `<rect x="-200" y="-200" width="400" height="400" fill="${S.p.jadeHi}"/>${place(F.person(S, C.prince(S, { id: 'mini' })), 0, 210, .75)}${Pr.crown(S, 0, -150, .9)}`, 'bb1', [-1, 1])}</g>
          <g id="${S.id('b2')}" opacity="0">${Pr.bubble(S, 1160, 300, 170, `<rect x="-200" y="-200" width="400" height="400" fill="${S.p.goldHi}"/>${place(F.person(S, C.consort(S, { id: 'queen', hair: 'phoenix' })), 0, 330, .6)}<rect id="${S.id('grey')}" x="-200" y="-200" width="400" height="400" fill="#6a6470" opacity="0"/>`, 'bb2', [-1, 1])}</g>`,
        update: (lt, S) => {
          setO(S, 'b1', M.win(lt, .6, 4.3, .4)); setO(S, 'b2', M.ramp(lt, 4.4, 4.8));
          setO(S, 'grey', .8 * M.ramp(lt, 10.27, 10.9));
          F.face(S, 'conc', { t: lt, phase: .9, mouth: lt > 10.3 ? 'worried' : 'smirk', brows: lt > 10.3 ? 'worried' : 'sly', look: [6, -4] });
          F.face(S, 'mini', { t: lt, mouth: 'smile', brows: 'up' }); F.face(S, 'queen', { t: lt, mouth: 'smirk', brows: 'sly' });
        }
      },
      { // 3 — outside the hall, the nurse waits. She is a servant.
        at: 38.25, cam: { from: [900, 470, 1.05], to: [950, 450, 1.2] },
        svg: (S) => `${Sc.hallDoor(S)}
          <g data-depth=".85"><g id="${S.id('peek')}">${place(F.person(S, C.nurse(S)), 1120, 850, 1.0)}</g></g>
          <g id="${S.id('sv')}" opacity="0">${Pr.label(S, 1150, 250, 'Servant', 50)}</g>`,
        update: (lt, S) => {
          setT(S, 'peek', `translate(${(-40 * M.win(lt, .5, 3.5, .6)).toFixed(1)} 0)`);
          setO(S, 'sv', M.ramp(lt, 5.2, 5.7));
          F.face(S, 'nurse', { t: lt, phase: .2, mouth: 'worried', brows: 'worried', look: lt < 3.5 ? [-7, 0] : [0, 3] });
        }
      }
    ]
  });
})();
