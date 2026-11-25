// @style flat
// @pad 1.5
// Chapter 1 — The taster. Dawn tasting, the 969 AD card, the map, the nurse at the door.
(() => {
  const F = window.FlatStyle, { Scenery: Sc, Props: Pr } = F, M = Stage.M, C = window.CAST;
  const heart = (S, x, y, hid) => `<g id="${S.id(hid)}" opacity="0" transform="translate(${x} ${y})"><path d="M0 30 C-60 -10 -40 -60 0 -30 C40 -60 60 -10 0 30 Z" fill="${S.p.blossom}" stroke="${S.p.ink}" stroke-width="5"/></g>`;
  // bedroom with the prince in bed, the taster, the nurse at the door
  const room = (S, o = {}) => `${Sc.bedchamber(S)}
    ${Pr.lantern(S, 640, 50, 40, .85)}
    <g data-depth=".7">${Pr.bedBack(S, 1000, 730)}</g>
    <g data-depth=".75">${place(F.person(S, C.prince(S, { kneel: true, arms: o.princeArms || 'down' })), 1000, 590, 1.15)}</g>
    <g data-depth=".75">${Pr.bedFront(S, 1000, 730)}</g>
    <g data-depth=".85">${place(F.person(S, C.eunuch(S)), o.eunX ?? 430, 810, 1.0)}</g>
    <g data-depth=".85">${place(F.person(S, C.nurse(S, { kneel: true })), 1440, 830, .85)}</g>`;

  Stage.run({
    style: F, duration: TIMINGS.duration + 1.5, timings: TIMINGS, maxWords: 8, fadeIn: 1.0,
    subs: [['nine sixty-nine A.D.', '969 AD']],
    cards: [{ at: 11.79, end: 14.6, small: 'Kaifeng · Song dynasty China', big: '969 AD' }],
    scenes: [
      { // 0 — dawn: the taster lifts the porridge first
        at: 0, cam: { from: [800, 450, 1.0], to: [820, 430, 1.08] },
        svg: (S) => room(S),
        update: (lt, S) => {
          const up = M.ramp(lt, 1.5, 3.5) * (1 - M.ramp(lt, 6.8, 7.8));
          setT(S, 'eun-arms', `translate(0 ${(-160 * up).toFixed(1)})`);
          F.face(S, 'eun', { t: lt, phase: .4, mouth: up > .9 ? 'neutral' : 'neutral', brows: 'flat', look: [0, 0] });
          F.face(S, 'prince', { t: lt, phase: 1.1, mouth: 'worried', brows: 'worried', look: [-6, 0] });
          F.face(S, 'nurse', { t: lt, phase: 2.3, mouth: 'worried', brows: 'worried', look: [-6, 0] });
        }
      },
      { // 1 — close on the prince: "poison is not what will break you"
        at: 8.3, cam: { from: [1000, 330, 1.75], to: [1000, 310, 2.0] },
        svg: (S) => room(S),
        update: (lt, S) => {
          F.face(S, 'prince', { t: lt, phase: .3, mouth: 'neutral', brows: 'worried', look: [0, 0] });
          F.face(S, 'eun', { t: lt, mouth: 'neutral' }); F.face(S, 'nurse', { t: lt, mouth: 'neutral' });
        }
      },
      { // 2 — the map: Kaifeng, capital of the Song Empire, south of the Yellow River
        at: 14.76, cam: { from: [800, 450, 1.0], to: [745, 430, 1.3] },
        svg: (S) => `${Sc.chinaMap(S)}
          <g id="${S.id('kf')}" opacity="0"><circle cx="735" cy="400" r="34" fill="${S.p.red}" opacity=".3"/><circle cx="735" cy="400" r="16" fill="${S.p.red}" stroke="${S.p.ink}" stroke-width="4"/></g>
          <g opacity="0" id="${S.id('kfl')}">${Pr.label(S, 735, 470, 'Kaifeng · the capital', 36)}</g>
          <g opacity="0" id="${S.id('henan')}">${Pr.label(S, 735, 545, 'Today: Henan province, China', 34)}</g>`,
        update: (lt, S) => {
          const a = M.ramp(lt, .4, 1.0), pulse = 1 + .12 * Math.sin(lt * 4);
          setO(S, 'kf', a); setT(S, 'kf', `translate(735 400) scale(${(a * pulse).toFixed(3)}) translate(-735 -400)`);
          setO(S, 'kfl', M.ramp(lt, 1.0, 1.6));
          setO(S, 'henan', M.ramp(lt, 8.7, 9.3));
        }
      },
      { // 3 — the dynasty is nine, the same age as you
        at: 27.35, cam: { from: [800, 470, 1.0], to: [800, 450, 1.08] },
        svg: (S) => `${Sc.courtyard(S)}
          <g data-depth=".85">${place(F.person(S, C.prince(S)), 800, 800, 1.25)}</g>
          <g id="${S.id('l1')}" opacity="0">${Pr.label(S, 380, 300, 'Song dynasty: 9 years old', 40)}</g>
          <g id="${S.id('l2')}" opacity="0">${Pr.label(S, 1220, 300, 'You: 9 years old', 40)}</g>`,
        update: (lt, S) => {
          setO(S, 'l1', M.ramp(lt, .3, .8)); setO(S, 'l2', M.ramp(lt, 3.5, 4.0));
          F.face(S, 'prince', { t: lt, phase: .8, mouth: lt > 3.5 ? 'smile' : 'neutral', brows: 'up', look: lt > 3.5 ? [6, 0] : [-6, 0] });
        }
      },
      { // 4 — every morning: the taster swallows and everyone watches his face
        at: 33.75, cam: { from: [780, 440, 1.12], to: [700, 400, 1.3] },
        svg: (S) => room(S, { eunX: 520 }),
        update: (lt, S) => {
          const up = M.ramp(lt, 2.9, 4.4) * (1 - M.ramp(lt, 14.3, 15.4));
          setT(S, 'eun-arms', `translate(0 ${(-160 * up).toFixed(1)})`);
          const watch = lt > 8 && lt < 14.1, ok = lt >= 14.1;
          F.face(S, 'eun', { t: lt, phase: .4, mouth: ok ? 'smile' : (watch ? 'neutral' : 'neutral'), brows: watch ? 'worried' : 'flat', look: [0, 0] });
          F.face(S, 'prince', { t: lt, phase: 1.1, mouth: ok ? 'smile' : 'worried', brows: ok ? 'up' : 'worried', look: [-7, 0] });
          F.face(S, 'nurse', { t: lt, phase: 2.3, mouth: ok ? 'neutral' : 'worried', brows: 'worried', look: [-7, 0] });
        }
      },
      { // 5 — you eat slowly; the nurse at the door: "Small bites, my prince"
        at: 50.6, cam: { from: [1180, 420, 1.35], to: [1220, 420, 1.45] },
        svg: (S) => room(S, { princeArms: 'hold', eunX: 300 }),
        update: (lt, S) => {
          const sip = Math.max(0, Math.sin(lt * 1.1)) * 40;
          setT(S, 'prince-arms', `translate(0 ${(-sip).toFixed(1)})`);
          const talk = lt > 5.5 && lt < 10.2;
          F.face(S, 'nurse', { t: lt, phase: .6, mouth: talk ? (Math.sin(lt * 14) > 0 ? 'talk' : 'neutral') : 'smile', brows: 'flat', look: [-7, -2] });
          F.face(S, 'prince', { t: lt, phase: 1.4, mouth: 'neutral', brows: 'flat', look: [6, 2] });
          F.face(S, 'eun', { t: lt, mouth: 'neutral' });
        }
      },
      { // 6 — the same woman who tasted the milk nine years ago
        at: 61.08, cam: { from: [800, 420, 1.2], to: [800, 400, 1.35] },
        svg: (S) => `${Sc.nursery(S)}
          ${Pr.lantern(S, 430, 50, 70)}
          <g data-depth=".9">${place(F.person(S, C.nurse(S, { kneel: true })), 800, 800, 1.25)}</g>
          <g id="${S.id('mem')}" opacity="0">${Pr.bubble(S, 1210, 260, 150, `<rect x="-200" y="-200" width="400" height="400" fill="${S.p.wallLo}"/><g transform="translate(0 0) scale(2)">${F.bowlFront(S.p)}</g>`, 'membub', [-1, 1])}</g>
          <g id="${S.id('nl')}" opacity="0">${Pr.label(S, 380, 300, 'Nurse', 54)}</g>
          ${heart(S, 380, 420, 'heart')}`,
        update: (lt, S) => {
          setO(S, 'mem', M.win(lt, .2, 4.4, .5));
          setO(S, 'nl', M.ramp(lt, 4.5, 5.0));
          const h = M.ramp(lt, 7.1, 7.6); setO(S, 'heart', h);
          setT(S, 'heart', `translate(380 420) scale(${(h * (1 + .08 * Math.sin(lt * 6))).toFixed(3)})`);
          F.face(S, 'nurse', { t: lt, phase: .9, mouth: lt > 7 ? 'smile' : 'neutral', brows: 'flat', look: lt < 4.4 ? [6, -3] : [0, 0] });
        }
      }
    ]
  });
})();
