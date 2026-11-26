// @style flat
// @pad 1.5
// Chapter 4 — The Empress's garden. The summons, the poison memory, the sweets, the refusal, the smile.
(() => {
  const F = window.FlatStyle, { Scenery: Sc, Props: Pr } = F, M = Stage.M, C = window.CAST;
  const poisonBowl = (S) => `<rect x="-200" y="-200" width="400" height="400" fill="${S.p.wallLo}"/><g transform="scale(2.2)">${F.bowlFront(S.p)}</g>
    <path d="M-70 4 Q-30 -20 0 4 Q30 24 70 0" fill="none" stroke="${S.p.poison}" stroke-width="10" stroke-linecap="round"/>`;
  const nurseFace = (S) => `<rect x="-200" y="-200" width="400" height="400" fill="${S.p.wall}"/>${place(F.person(S, C.nurse(S, { id: 'mnurse' })), 0, 600, 1.1)}`;

  Stage.run({
    style: F, duration: TIMINGS.duration + 1.5, timings: TIMINGS, maxWords: 8,
    scenes: [
      { // 0 — a eunuch brings a message: the Empress wishes to see you
        at: 0, cam: { from: [800, 450, 1.02], to: [820, 440, 1.1] },
        svg: (S) => `${Sc.study(S)}
          <g data-depth=".8">${place(F.person(S, C.prince(S, { kneel: true })), 900, 790, 1.1)}${Pr.desk(S, 930, 800)}</g>
          <g data-depth=".85"><g id="${S.id('walk')}">${place(F.person(S, C.eunuch(S, { arms: 'down' })), 0, 850, 1.0)}${Pr.scrollMsg(S, 0, 590, 1.1)}</g></g>
          <g id="${S.id('inv')}" opacity="0">${Pr.label(S, 800, 200, 'The Empress invites you', 46)}</g>`,
        update: (lt, S) => {
          const k = M.ramp(lt, 0, 2.6), bob = k < 1 ? Math.abs(Math.sin(lt * 5)) * -7 : 0;
          setT(S, 'walk', `translate(${(-150 + 500 * k).toFixed(1)} ${bob.toFixed(1)})`);
          setO(S, 'inv', M.ramp(lt, 3.5, 4.0));
          F.face(S, 'eun', { t: lt, phase: .4, mouth: lt > 3.4 ? 'talk' : 'neutral', brows: 'flat', look: [6, 0] });
          F.face(S, 'prince', { t: lt, phase: 1.2, mouth: lt > 3.6 ? 'worried' : 'neutral', brows: lt > 3.6 ? 'worried' : 'flat', look: [-7, 0] });
        }
      },
      { // 1 — the woman your nurse taught you to fear (the poisoned milk, nine years ago)
        at: 7.44, cam: { from: [900, 440, 1.05], to: [940, 420, 1.18] },
        svg: (S) => `${Sc.garden(S)}
          <g data-depth=".85">${place(F.person(S, C.empress(S)), 1000, 840, 1.05)}</g>
          <g id="${S.id('mem')}" opacity="0">${Pr.bubble(S, 520, 300, 160, poisonBowl(S), 'mb', [1, 1])}</g>`,
        update: (lt, S) => {
          setO(S, 'mem', M.win(lt, 3.3, 7.6, .4));
          setT(S, 'koi', `translate(${(30 * Math.sin(lt * .6)).toFixed(1)} 0)`);
          F.face(S, 'emp', { t: lt, phase: .6, mouth: 'smile', brows: 'flat', look: [-5, 2] });
        }
      },
      { // 2 — she offers a sweet; your hand reaches out; then you remember the voice at the door
        at: 15.32, cam: { from: [800, 450, 1.08], to: [800, 430, 1.16] },
        svg: (S) => `${Sc.garden(S)}
          <g data-depth=".85"><g id="${S.id('reach')}">${place(F.person(S, C.prince(S)), 560, 850, 1.15)}</g></g>
          <g data-depth=".85">${place(F.person(S, C.empress(S, { arms: 'box' })), 1060, 850, 1.05)}</g>
          <g id="${S.id('mem')}" opacity="0">${Pr.bubble(S, 400, 250, 140, nurseFace(S), 'nb', [1, 1])}</g>
          <g id="${S.id('say')}" opacity="0">${Pr.label(S, 430, 455, '"If it tastes bitter, stop."', 28)}</g>`,
        update: (lt, S) => {
          setO(S, 'emp-box', M.ramp(lt, 4.9, 5.4));
          const r = M.ramp(lt, 8.7, 9.6) * (1 - M.ramp(lt, 11.2, 12.2));
          setT(S, 'reach', `translate(${(70 * r).toFixed(1)} 0)`);
          setO(S, 'mem', M.ramp(lt, 10.9, 11.4)); setO(S, 'say', M.ramp(lt, 11.3, 11.8));
          F.face(S, 'mnurse', { t: lt, mouth: 'talk', brows: 'worried', look: [0, 0] });
          const talk = lt > 1.9 && lt < 4.8;
          F.face(S, 'emp', { t: lt, phase: .6, mouth: talk ? (Math.sin(lt * 12) > 0 ? 'talk' : 'smile') : 'smile', brows: 'flat', look: [-6, 3] });
          F.face(S, 'prince', { t: lt, phase: 1.5, mouth: lt > 10.9 ? 'worried' : (lt > 8.7 ? 'smile' : 'neutral'), brows: lt > 10.9 ? 'worried' : 'flat', look: lt > 10.9 ? [-5, -4] : [6, 2] });
        }
      },
      { // 3 — you bow, you thank her, you do not take it; she smiles wider
        at: 30.35, cam: { from: [800, 450, 1.12], to: [820, 430, 1.2] },
        svg: (S) => `${Sc.garden(S)}
          <g data-depth=".85"><g id="${S.id('bow')}">${place(F.person(S, C.prince(S)), 560, 850, 1.15)}</g></g>
          <g data-depth=".85">${place(F.person(S, C.empress(S, { arms: 'box' })), 1060, 850, 1.05)}</g>`,
        update: (lt, S) => {
          const b = M.win(lt, 0, 1.8, .4);
          setT(S, 'bow', `translate(0 ${(30 * b).toFixed(1)})`); setT(S, 'prince-head', `translate(0 ${(24 * b).toFixed(1)})`);
          const talk = lt > 3.2 && lt < 7.6;
          F.face(S, 'prince', { t: lt, phase: .4, mouth: talk ? (Math.sin(lt * 13) > 0 ? 'talk' : 'neutral') : 'neutral', brows: 'flat', look: b > .5 ? [0, 6] : [6, 0] });
          F.face(S, 'emp', { t: lt, phase: 1.1, mouth: lt > 9.9 ? 'smirk' : 'smile', brows: lt > 9.9 ? 'sly' : 'flat', look: [-6, 2] });
        }
      },
      { // 4 — in the palace, kindness is a weapon too
        at: 42.19, cam: { from: [1060, 330, 1.7], to: [1060, 320, 1.95] },
        svg: (S) => `${Sc.garden(S)}
          <g data-depth=".85">${place(F.person(S, C.empress(S, { arms: 'box' })), 1060, 850, 1.05)}</g>`,
        update: (lt, S) => F.face(S, 'emp', { t: lt, phase: .3, mouth: 'smirk', brows: 'sly', look: [-4, 0] })
      }
    ]
  });
})();
