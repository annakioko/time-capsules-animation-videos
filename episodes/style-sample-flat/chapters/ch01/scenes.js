// @style flat
// @pad 5
// Style sample: the Wet Nurse opening (same voice and timings as song-wet-nurse ch01) in the bright flat style.
(() => {
  const F = window.FlatStyle, { Scenery: Sc, Props: Pr } = F, M = Stage.M;
  const TREM = (t, amp = 1) => amp * (Math.sin(t * 31) * 0.6 + Math.sin(t * 47 + 1) * 0.4);
  const NURSE = (S) => ({ id: 'nurse', skin: S.p.skin.peasant, robe: S.p.jade, trim: S.p.cream, sash: S.p.yellow, hair: 'bun', arms: 'hold', kneel: true, tired: true, lashes: true });
  const at = (x, y, k, inner, id) => `<g ${id ? `id="${id}"` : ''} transform="translate(${x} ${y}) scale(${k})">${inner}</g>`;
  const candle = (S, x, y) => `<g transform="translate(${x} ${y})"><rect x="-40" y="-10" width="80" height="12" rx="4" fill="${S.p.gold}" stroke="${S.p.ink}" stroke-width="3"/>
    <rect x="-12" y="-80" width="24" height="70" fill="${S.p.cream}" stroke="${S.p.ink}" stroke-width="3"/>
    <circle class="glow" cx="0" cy="-104" r="90" fill="${S.u('glow')}" opacity=".7"/>
    <g transform="translate(0 -82)"><path class="flame" d="M0 0 Q-14 -22 0 -46 Q14 -22 0 0 Z" fill="#ffb02e" stroke="${S.p.ink}" stroke-width="3"/></g></g>`;

  Stage.run({
    style: F,
    duration: TIMINGS.duration + 5,
    timings: TIMINGS,
    subs: [['nine sixty A.D.', '960 AD']],
    maxWords: 8,
    fadeIn: 1.2,
    cards: [
      { at: 0.4, end: 4.9, small: 'Kaifeng · Song dynasty China', big: '960 AD' },
      { at: 47.9, end: TIMINGS.duration + 5, small: 'A day in the life of', big: 'The Palace Wet Nurse', sub: 'Song dynasty China' }
    ],
    scenes: [
      { // 0 — the nurse, exhausted, holding the bowl
        at: 0,
        cam: { from: [800, 470, 1.0], to: [800, 420, 1.2] },
        svg: (S) => `${Sc.nursery(S)}
          ${Pr.lantern(S, 430, 50, 70)}${Pr.lantern(S, 1170, 50, 50)}
          <g data-depth=".8">${candle(S, 1180, 790)}</g>
          <g data-depth=".9">${at(800, 800, 1.25, F.person(S, NURSE(S)))}</g>`,
        update: (lt, S) => {
          const tr = TREM(lt, 1.4);
          S.q('#' + S.id('nurse-arms')).setAttribute('transform', `translate(${(tr * 2.4).toFixed(2)} ${(tr * 1.6).toFixed(2)})`);
          S.q('#' + S.id('nurse-head')).setAttribute('transform', `rotate(${(2 * Math.sin(lt * 0.9)).toFixed(2)} 0 -300)`);
          F.face(S, 'nurse', { t: lt, mouth: 'worried', brows: 'worried', look: lt < 5 ? [0, 5] : [0, 0] });
        }
      },
      { // 1 — the concubine with her son; the Empress slides in
        at: 15.3,
        cam: { from: [800, 470, 1.02], to: [820, 450, 1.1] },
        svg: (S) => `${Sc.hall(S)}
          ${Pr.lantern(S, 300, 50, 40, .9)}${Pr.lantern(S, 1300, 50, 40, .9)}
          <g data-depth=".9">${at(590, 830, 1.0, F.person(S, { id: 'conc', skin: S.p.skin.fair, robe: S.p.pink, trim: S.p.goldHi, sash: '#7b4fa0', hair: 'loops', arms: 'baby', lashes: true }))}</g>
          <g data-depth=".9"><g id="${S.id('empwrap')}" opacity="0">${at(1160, 830, 1.05, F.person(S, { id: 'emp', skin: S.p.skin.light, robe: S.p.yellow, trim: S.p.red, sash: S.p.red, hair: 'phoenix', arms: 'down', cheeks: .25, lashes: true }))}</g></g>`,
        update: (lt, S) => {
          const a = M.ramp(lt, 1.6, 3.4);
          const e = S.q('#' + S.id('empwrap'));
          e.setAttribute('opacity', lt > 1.6 ? 1 : 0);
          e.setAttribute('transform', `translate(${(700 * (1 - a)).toFixed(1)} ${(-10 * Math.abs(Math.sin(a * Math.PI * 3)) * (1 - a)).toFixed(1)})`);
          const rock = Math.sin(lt * 2.2) * 3;
          S.q('#' + S.id('conc-baby')).setAttribute('transform', `translate(-6 -260) rotate(${(-12 + rock).toFixed(2)})`);
          F.face(S, 'conc', { t: lt, phase: 1.2, mouth: lt > 3 ? 'scared' : 'worried', brows: 'worried', look: lt > 2.5 ? [5, 0] : [-3, 4] });
          F.face(S, 'emp', { t: lt, phase: 2.1, mouth: 'smirk', brows: 'sly', look: [-5, 1] });
        }
      },
      { // 2 — the Inner Court at night; a eunuch carries the milk across
        at: 23.4,
        cam: { from: [780, 470, 1.02], to: [880, 450, 1.12] },
        svg: (S) => `${Sc.courtyard(S)}
          ${Pr.lantern(S, 640, -40, 120, .8)}${Pr.lantern(S, 980, -40, 160, .8)}
          <g data-depth=".8"><g id="${S.id('walk')}">${at(0, 820, .85, F.person(S, { id: 'eun', skin: S.p.skin.warm, robe: S.p.blue, trim: '#9fb4d6', sash: S.p.ink, hair: 'cap', arms: 'tray', cheeks: .3 }))}</g></g>`,
        update: (lt, S) => {
          const x = 120 + lt * 110, bob = Math.abs(Math.sin(lt * 4.2)) * -8;
          S.q('#' + S.id('walk')).setAttribute('transform', `translate(${x.toFixed(1)} ${bob.toFixed(1)})`);
          F.face(S, 'eun', { t: lt, phase: .5, mouth: 'neutral', brows: 'flat', look: [4, 0] });
        }
      },
      { // 3 — close-up: the milk (a green glint, then a single drop)
        at: 30.23,
        cam: { from: [800, 480, 1.0], to: [800, 500, 1.14] },
        svg: (S) => `${Sc.table(S)}<g id="${S.id('bw')}" transform="translate(800 470)">${Pr.bigBowl(S)}</g>`,
        update: (lt, S) => {
          const tr = TREM(lt, .8);
          S.q('#' + S.id('bw')).setAttribute('transform', `translate(${(800 + tr * 2).toFixed(1)} ${(470 + tr * 1.5).toFixed(1)})`);
          const g = M.win(lt, .2, 1.9, .5);
          S.q('#' + S.id('poison')).setAttribute('opacity', (g * .9).toFixed(3));
          S.q('#' + S.id('poison')).setAttribute('transform', `translate(${(20 * Math.sin(lt * 2)).toFixed(1)} 0)`);
          const fall = M.clamp((lt - 3.0) / .6), drop = S.q('#' + S.id('drop'));
          drop.setAttribute('opacity', lt > 3.0 && lt < 3.62 ? 1 : 0);
          drop.setAttribute('transform', `translate(0 ${(-420 + 420 * fall * fall).toFixed(1)})`);
          const r = lt < 3.6 ? (lt * .6) % 1 : M.clamp((lt - 3.6) / 1.4);
          const rp = S.q('#' + S.id('ripple'));
          rp.setAttribute('transform', `translate(0 6) scale(${(.3 + r * 1.8).toFixed(3)}) translate(0 -6)`);
          rp.setAttribute('opacity', (1 - r).toFixed(3));
        }
      },
      { // 4 — her face: "this is your last meal"
        at: 40.04,
        cam: { from: [800, 400, 1.55], to: [800, 380, 1.85] },
        svg: (S) => `${Sc.nursery(S)}
          ${Pr.lantern(S, 430, 50, 70)}
          <g data-depth=".9">${at(800, 800, 1.25, F.person(S, NURSE(S)))}</g>`,
        update: (lt, S) => {
          const tr = TREM(lt, 1.6), lift = -50 * M.ramp(lt, 0, 3);
          S.q('#' + S.id('nurse-arms')).setAttribute('transform', `translate(${(tr * 2.4).toFixed(2)} ${(lift + tr * 1.6).toFixed(2)})`);
          const scared = lt > 3.5;
          F.face(S, 'nurse', { t: lt, mouth: scared ? 'scared' : 'worried', brows: scared ? 'up' : 'worried', look: [0, scared ? 0 : 6] });
        }
      }
    ]
  });
})();
