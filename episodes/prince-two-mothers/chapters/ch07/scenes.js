// @style flat
// @pad 5
// Chapter 7 — Who raised the emperor. The real story of Emperor Renzong, Lady Li and Consort Liu, then back to our prince.
(() => {
  const F = window.FlatStyle, { Scenery: Sc, Props: Pr } = F, M = Stage.M, C = window.CAST;
  const tag = (S, x, y, t, id, size = 40) => `<g id="${S.id(id)}" opacity="0">${Pr.label(S, x, y, t, size)}</g>`;
  const babyIn = (S, bid, x, y, k) => `<g id="${S.id(bid)}" transform="translate(${x} ${y}) scale(${k})">${F.babyBundle(S.p)}</g>`;

  Stage.run({
    style: F, duration: TIMINGS.duration + 5, timings: TIMINGS, maxWords: 8, fadeOut: 2,
    subs: [['ten ten', '1010'], ['At twelve', 'At 12'], ['ten thirty-three', '1033'], ['forty-one', '41']],
    cards: [{ at: TIMINGS.duration + .3, end: TIMINGS.duration + 5, small: 'A day in the life of', big: 'The Prince With Two Mothers', sub: 'Song dynasty China' }],
    scenes: [
      { // 0 — our story… and a real one
        at: 0, cam: { from: [800, 450, 1.0], to: [800, 450, 1.06] },
        svg: (S) => `${Sc.parchment(S)}
          <g data-depth=".8">${place(F.person(S, C.prince(S)), 520, 760, 1.0)}</g>
          ${tag(S, 520, 210, 'Our story', 't1', 48)}${tag(S, 1080, 450, 'Real history', 't2', 60)}`,
        update: (lt, S) => {
          setO(S, 't1', M.ramp(lt, .2, .7)); setO(S, 't2', M.ramp(lt, 2.5, 3.0));
          setT(S, 't2', `translate(0 0) scale(1)`);
          F.face(S, 'prince', { t: lt, mouth: 'smile', brows: 'flat', look: lt > 2.5 ? [7, 0] : [0, 0] });
        }
      },
      { // 1 — 1010: Lady Li, a palace maid, gives birth to the Emperor's son
        at: 8.17, cam: { from: [780, 450, 1.03], to: [760, 440, 1.08] },
        svg: (S) => `${Sc.nursery(S)}${Pr.lantern(S, 1170, 50, 50)}
          <g data-depth=".85">${place(F.person(S, C.li(S)), 640, 850, 1.1)}</g>
          ${tag(S, 1100, 360, '1010 · Lady Li, palace maid', 't1', 40)}`,
        update: (lt, S) => {
          setO(S, 't1', M.ramp(lt, .3, .8));
          setT(S, 'li-baby', `translate(-6 -260) rotate(${(-12 + 3 * Math.sin(lt * 2.2)).toFixed(2)})`);
          F.face(S, 'li', { t: lt, phase: .4, mouth: 'smile', brows: 'flat', look: [-2, 6] });
        }
      },
      { // 2 — claimed by her mistress, Consort Liu, who raised him as her own
        at: 13.8, cam: { from: [800, 450, 1.05], to: [810, 440, 1.12] },
        svg: (S) => `${Sc.hall(S)}
          <g data-depth=".85">${place(F.person(S, C.li(S, { arms: 'down' })), 460, 850, 1.05)}${babyIn(S, 'bLi', 454, 590, 1.05)}</g>
          <g data-depth=".85"><g id="${S.id('liuW')}">${place(F.person(S, C.liu(S, { arms: 'baby' })), 1100, 850, 1.08)}</g></g>
          ${tag(S, 1100, 160, 'Consort Liu', 't1', 44)}`,
        update: (lt, S) => {
          const e = M.ramp(lt, 0, 1.6); setT(S, 'liuW', `translate(${(500 * (1 - e)).toFixed(1)} 0)`);
          const take = M.ramp(lt, 2.4, 3.6);
          setO(S, 'bLi', 1 - take); setO(S, 'liu-baby', take);
          setO(S, 't1', M.ramp(lt, 1.6, 2.1));
          F.face(S, 'li', { t: lt, phase: .9, mouth: take > .5 ? 'worried' : 'scared', brows: 'worried', look: [7, 0], cry: take > .9 });
          F.face(S, 'liu', { t: lt, phase: .2, mouth: take > .5 ? 'smile' : 'smirk', brows: take > .5 ? 'flat' : 'sly', look: [-6, 2] });
        }
      },
      { // 3 — the boy grew up believing Liu was his mother
        at: 20.59, cam: { from: [800, 450, 1.06], to: [800, 430, 1.12] },
        svg: (S) => `${Sc.hall(S)}
          <g data-depth=".85">${place(F.person(S, C.liu(S)), 980, 850, 1.08)}${place(F.person(S, C.boyEmperor(S, { id: 'kid', hair: 'knot' })), 650, 850, 1.1)}</g>`,
        update: (lt, S) => {
          F.face(S, 'kid', { t: lt, phase: .3, mouth: 'smile', brows: 'up', look: [7, -4] });
          F.face(S, 'liu', { t: lt, phase: 1.3, mouth: 'smile', brows: 'flat', look: [-7, 3] });
        }
      },
      { // 4 — at 12, Emperor Renzong; Liu rules for him as regent
        at: 24.53, cam: { from: [800, 450, 1.02], to: [800, 430, 1.1] },
        svg: (S) => `${Sc.throneRoom(S)}
          <g data-depth=".7">${place(F.person(S, C.liu(S, { hair: 'phoenix' })), 1290, 820, .95)}${Pr.beadCurtain(S, 1100, 230, 390, 580)}</g>
          <g data-depth=".8">${Pr.throne(S, 720, 760)}${place(F.person(S, C.boyEmperor(S, { kneel: true })), 720, 680, 1.05)}</g>
          ${tag(S, 720, 140, '1022 · Emperor Renzong, age 12', 't1', 40)}${tag(S, 1290, 860, 'Regent', 't2', 36)}`,
        update: (lt, S) => {
          setO(S, 't1', M.ramp(lt, .3, .8)); setO(S, 't2', M.ramp(lt, 3.0, 3.5));
          F.face(S, 'boy', { t: lt, phase: .5, mouth: 'neutral', brows: 'flat', look: [0, 0] });
          F.face(S, 'liu', { t: lt, phase: 1.2, mouth: 'smirk', brows: 'sly', look: [-7, 0] });
        }
      },
      { // 5 — his real mother lived in the same palace, and kept her silence
        at: 30.14, cam: { from: [600, 430, 1.15], to: [580, 410, 1.25] },
        svg: (S) => `${Sc.bedchamber(S, true)}
          <g data-depth=".85">${place(F.person(S, C.li(S, { arms: 'down' })), 560, 850, 1.05)}</g>
          ${tag(S, 950, 330, 'His real mother', 't1', 44)}`,
        update: (lt, S) => {
          setO(S, 't1', M.ramp(lt, .3, .8));
          F.face(S, 'li', { t: lt, phase: .4, mouth: 'worried', brows: 'worried', look: [-6, 4] });
        }
      },
      { // 6 — 1033: Liu dies; he learns the truth; he weeps at his mother's coffin
        at: 35.28, cam: { from: [800, 470, 1.02], to: [860, 450, 1.12] },
        svg: (S) => `${Sc.hall(S)}
          <g data-depth=".75">${Pr.candle(S, 330, 780)}${Pr.candle(S, 1270, 780)}${Pr.coffin(S, 800, 790)}</g>
          <g data-depth=".9"><g id="${S.id('em')}" opacity="0">${place(F.person(S, C.emperor(S, { kneel: true })), 1180, 880, 1.0)}</g></g>
          ${tag(S, 800, 160, '1033 · the truth', 't1', 46)}${tag(S, 800, 300, 'Lady Li · died 1032', 't2', 40)}${tag(S, 800, 440, 'Empress Dowager', 't3', 50)}`,
        update: (lt, S) => {
          setO(S, 't1', M.ramp(lt, .3, .8)); setO(S, 't2', M.ramp(lt, 4.8, 5.3)); setO(S, 't3', M.ramp(lt, 11.6, 12.2));
          setO(S, 'em', M.ramp(lt, 8.5, 9.2));
          F.face(S, 'emperor', { t: lt, phase: .6, mouth: 'worried', brows: 'worried', look: [-7, 3], cry: true });
        }
      },
      { // 7 — he ruled for 41 years, the longest of any Song emperor
        at: 50.32, cam: { from: [800, 440, 1.04], to: [800, 420, 1.12] },
        svg: (S) => `${Sc.throneRoom(S)}
          <g data-depth=".8">${Pr.throne(S, 800, 760)}${place(F.person(S, C.emperor(S, { kneel: true, beard: 'grey' })), 800, 690, .95)}</g>
          ${tag(S, 800, 140, '41 years on the throne', 't1', 46)}
          <g id="${S.id('ghost')}" opacity="0">${place(F.person(S, C.li(S, { id: 'lig', arms: 'down' })), 1360, 800, .7)}</g>`,
        update: (lt, S) => {
          setO(S, 't1', M.ramp(lt, .3, .8)); setO(S, 'ghost', .45 * M.ramp(lt, 5.3, 6.3));
          F.face(S, 'emperor', { t: lt, phase: .3, mouth: 'neutral', brows: lt > 5.3 ? 'worried' : 'flat', look: [0, 0] });
          F.face(S, 'lig', { t: lt, mouth: 'worried', brows: 'worried', look: [-6, 0] });
        }
      },
      { // 8 — the people history forgets; back to our prince asleep, the nurse at his bedside
        at: 62.26, cam: { from: [880, 450, 1.08], to: [900, 430, 1.18] },
        svg: (S) => `${Sc.bedchamber(S, true)}
          <g data-depth=".7">${Pr.bedBack(S, 1050, 740)}</g>
          <g data-depth=".75">${place(F.person(S, C.prince(S, { kneel: true })), 1050, 600, 1.15)}</g>
          <g data-depth=".75">${Pr.bedFront(S, 1050, 740)}</g>
          <g data-depth=".8">${Pr.candle(S, 1490, 800)}</g>
          <g data-depth=".85">${place(F.person(S, C.nurse(S, { kneel: true })), 680, 860, .95)}</g>`,
        update: (lt, S) => {
          F.face(S, 'prince', { t: lt, mouth: 'smile', sleepy: .1 });
          F.face(S, 'nurse', { t: lt, phase: .4, mouth: 'smile', brows: 'flat', look: [6, -2] });
        }
      }
    ]
  });
})();
