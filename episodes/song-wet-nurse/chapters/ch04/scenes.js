// @style song
// @pad 1.2
// Chapter 4 — The tasting. The Empress in the courtyard, the dagger, the swallow, the wait.
(() => {
  const G = window.SongStyle, { Scenery: Sc, Props: Pr } = G, M = Stage.M;
  const q = (S, n) => S.q('#' + S.id(n));
  const TREM = (t, amp = 1) => amp * (Math.sin(t * 31) * 0.6 + Math.sin(t * 47 + 1) * 0.4);
  const walk = (lt, speed = 2.6) => Math.abs(Math.sin(lt * speed)) * -5;

  // kneeling nurse + bowl (bowl kept upright at her hands)
  const NX = 640, NY = 772, NK = 1.4;
  const nurse = (S) => `<g transform="translate(${NX},${NY}) scale(${NK})">${G.kneeler(S, { id: 'nurse' })}</g>`;
  const bowl = (S) => `<g id="${S.id('bowl')}">${Pr.bowl(S, 1.25)}</g>`;
  const nurseHands = (S, lt, lift = 0, trem = 1.6) => {
    const tr = TREM(lt, trem);
    const ua = -48 - 78 * lift + tr, fa = -72 - 44 * lift - tr * .6;
    G.pose(S, 'nurse', { nearUa: ua, nearFa: fa, farUa: ua + 4, farFa: fa - 6 });
    const [hx, hy] = G.hand(8, -236, ua, fa, 62, 58);
    return [NX + hx * NK, NY + (hy + 14) * NK];
  };
  // the concubine standing over her, facing left (mirrored)
  const CX = 1040, CY = 780, CK = 1.3;
  const conc = (S, o = {}) => `<g transform="translate(${CX},${CY}) scale(${-CK},${CK})">${G.person(S, { id: 'conc', hair: 'loops', robe: 'court', eye: '#ff5a3a', ...o })}</g>`;
  const room = (S, lan = [[420, 120, 90], [1180, 120, 70]]) => `${Sc.nursery(S)}${Pr.lanterns(S, lan)}`;
  const courtyardWindow = (S, procession) => Sc.moonWindow(S, 800, 430, 380, `<g transform="translate(800,430) scale(.62) translate(-800,-450)">${Sc.courtyard(S)}${procession}</g>`);
  const procession = (S, c = S.p.ink) => `<g id="${S.id('proc')}">
      <g id="${S.id('pe')}">${G.person(S, { id: 'emp', hair: 'phoenix', robe: 'court', fill: c })}</g>
      ${[0, 1, 2].map(i => `<g id="${S.id('pa' + i)}">${G.person(S, { id: 'att' + i, hair: ['veil', 'high', 'bun'][i], robe: i === 2 ? 'plain' : 'court', fill: c })}</g>`).join('')}</g>`;
  const moveProcession = (S, lt, x0, speed, stopAt = 1e9, look = 0) => {
    const tt = Math.min(lt, stopAt);
    const x = x0 - tt * speed;
    const walking = lt < stopAt ? 1 : 0;
    G.move(q(S, 'pe'), x, 700 + walk(lt) * walking, 0.62);
    [0, 1, 2].forEach(i => G.move(q(S, 'pa' + i), x + 150 + i * 120, 700 + walk(lt + i * .5) * walking, .56));
    // walking to the left: mirror
    ['pe', 'pa0', 'pa1', 'pa2'].forEach(n => { const el = q(S, n); el.setAttribute('transform', el.getAttribute('transform') + ' scale(-1,1)'); });
    // the Empress turns her head toward us
    if (look) { const h = q(S, 'emp-head'); h.setAttribute('transform', look > .5 ? 'translate(24,0) scale(-1,1) translate(-24,0)' : ''); }
  };

  Stage.run({
    style: G,
    duration: TIMINGS.duration + 1.2,
    timings: TIMINGS,
    fadeIn: 0.6,
    scenes: [
      { // 0 — psychological warfare: shadows of women pass across the paper
        at: 0,
        cam: { from: [800, 450, 1.08], to: [760, 460, 1.0] },
        svg: (S) => `<g data-depth=".2">${Sc.paperScreen(S)}</g>
          <g data-depth=".26" filter="${S.u('soft')}">${[0, 1, 2].map(i => `<g id="${S.id('sh' + i)}">${G.person(S, { id: 'sh' + i, hair: ['phoenix', 'veil', 'loops'][i], robe: 'court', fill: S.p.cast, cut: false })}</g>`).join('')}</g>
          <g data-depth=".32">${Sc.latticeWall(S).replace(/fill="url\(#s\d+-lattice\)"/, 'fill="none"')}${Sc.ceilingBeam(S)}</g>
          <g data-depth=".55">${Sc.floor(S)}</g>
          <g data-depth=".9"><g transform="translate(700,772) scale(1.18)">${G.nurseSeated(S, { id: 'ns' })}</g></g>
          ${Sc.curtains(S)}`,
        update: (lt, S) => {
          [0, 1, 2].forEach(i => { const x = 1700 - (lt + i * 1.3) * 230; q(S, 'sh' + i).setAttribute('transform', `translate(${x.toFixed(1)},${790 + walk(lt + i)}) scale(-1.5,1.5)`); });
          G.rot(q(S, 'ns'), 1.4 * Math.sin(lt * 1.9), 20, 0);
          q(S, 'ns-head').setAttribute('transform', `rotate(${(-8 * M.ramp(lt, 1, 2.5)).toFixed(2)} 14 -322)`);
        }
      },
      { // 1 — through the lattice window: the Empress and her entourage
        at: 5.57,
        cam: { from: [800, 450, 1.0], to: [800, 430, 1.22] },
        svg: (S) => courtyardWindow(S, procession(S)),
        update: (lt, S) => moveProcession(S, lt, 1180, 38)
      },
      { // 2 — no sons; the clock is ticking (an incense clock burns down)
        at: 17.39,
        cam: { from: [800, 470, 1.15], to: [800, 450, 1.3] },
        svg: (S) => `<rect x="-300" y="-300" width="2200" height="1500" fill="${S.p.wall}"/>
          <g data-depth=".2" filter="${S.u('defocus')}" opacity=".7"><g transform="translate(1150,800) scale(-1.8,1.8)">${G.person(S, { id: 'eb', hair: 'phoenix', robe: 'court', fill: S.p.lacquerDark, cut: false })}</g></g>
          <circle class="glow" cx="800" cy="420" r="520" fill="${S.u('warmGlow')}" opacity=".5"/>
          <g data-depth=".6"><rect x="-300" y="640" width="2200" height="600" fill="${S.p.floorHi}"/></g>
          <g transform="translate(700,650) scale(1.3)">${Pr.incense(S)}</g>`,
        update: (lt, S) => {
          const k = M.clamp(lt / 5.5);
          q(S, 'inc-stick').setAttribute('transform', `translate(0,${(300 * k * .55).toFixed(1)}) scale(1,${(1 - .55 * k).toFixed(3)})`);
          q(S, 'inc-stick').setAttribute('y', -330); q(S, 'inc-stick').setAttribute('transform', `translate(0,${(165 * k).toFixed(1)})`);
          q(S, 'inc-stick').setAttribute('height', (300 - 165 * k).toFixed(1));
          q(S, 'inc-stick').setAttribute('transform', `translate(0,${(165 * k).toFixed(1)})`);
          q(S, 'inc-ember').setAttribute('cy', (-330 + 165 * k).toFixed(1));
          q(S, 'inc-smoke').setAttribute('transform', `translate(${(6 * Math.sin(lt * 2)).toFixed(1)},${(165 * k).toFixed(1)})`);
        }
      },
      { // 3 — she looks toward your nursery
        at: 22.39,
        cam: { from: [800, 450, 1.2], to: [760, 470, 1.55] },
        svg: (S) => courtyardWindow(S, procession(S)),
        update: (lt, S) => moveProcession(S, lt + 11, 1180, 38, 13, M.ramp(lt, 1.4, 1.6))
      },
      { // 4 — back to the bowl; the concubine hovers, eyes wild
        at: 27.97,
        cam: { from: [820, 460, 1.0], to: [840, 430, 1.15] },
        svg: (S) => `${room(S)}<g data-depth=".9">${nurse(S)}${bowl(S)}${conc(S)}</g>${Sc.curtains(S)}`,
        update: (lt, S) => {
          const [bx, by] = nurseHands(S, lt);
          G.move(q(S, 'bowl'), bx, by);
          G.rot(q(S, 'nurse-head'), 10, 14, -268);
          G.pose(S, 'conc', { nearUa: -30 + 8 * Math.sin(lt * 2.3), nearFa: -60, farUa: -20, farFa: -30 });
          q(S, 'conc-head').setAttribute('transform', `rotate(${(14 + 3 * Math.sin(lt * 3.1)).toFixed(2)} 12 -350)`);
        }
      },
      { // 5 — "a kitchen eunuch whispering to one of the Empress's maids near the well"
        at: 36.66,
        cam: { from: [1100, 520, 1.25], to: [1180, 520, 1.4] },
        svg: (S) => `${Sc.courtyard(S)}
          <g data-depth=".55">
            <g transform="translate(1120,720) scale(.7)">${G.person(S, { id: 'eu', hair: 'cap', robe: 'man' })}</g>
            <g transform="translate(1330,720) scale(-.66,.66)">${G.person(S, { id: 'maid', hair: 'veil', robe: 'court' })}</g>
          </g>
          <rect x="-300" y="-300" width="2200" height="1500" fill="#000" opacity=".25"/>`,
        update: (lt, S) => {
          const lean = 4 + 3 * Math.sin(lt * 1.5);
          q(S, 'eu-head').setAttribute('transform', `rotate(${lean.toFixed(2)} 12 -350)`);
          q(S, 'maid-head').setAttribute('transform', `rotate(${(lean * .8).toFixed(2)} 12 -350)`);
          G.pose(S, 'eu', { nearUa: -60, nearFa: -70 + 6 * Math.sin(lt * 4), farUa: -10, farFa: -10 });
        }
      },
      { // 6 — "Drink." Her hand on a guard's dagger
        at: 44.03,
        cam: { from: [880, 420, 1.2], to: [940, 400, 1.38] },
        svg: (S) => `${room(S)}<g data-depth=".9">${nurse(S)}${bowl(S)}${conc(S, { farArm: { hold: '' } })}
            <g id="${S.id('dagger')}">${Pr.dagger(S)}</g>
            <g id="${S.id('glint')}" opacity="0"><path d="M0,-30 L6,-6 L30,0 L6,6 L0,30 L-6,6 L-30,0 L-6,-6Z" fill="#fff"/></g></g>${Sc.curtains(S)}`,
        update: (lt, S) => {
          const [bx, by] = nurseHands(S, lt, 0, 2.2);
          G.move(q(S, 'bowl'), bx, by);
          G.rot(q(S, 'nurse-head'), 4, 14, -268);
          const ua = -40, fa = -50;
          G.pose(S, 'conc', { nearUa: -20, nearFa: -40, farUa: ua, farFa: fa });
          const [hx, hy] = G.hand(-4, -318, ua, fa, 74, 70);
          const dx = CX - hx * CK, dy = CY + hy * CK;
          q(S, 'dagger').setAttribute('transform', `translate(${dx.toFixed(1)},${dy.toFixed(1)}) rotate(160) scale(1.8)`);
          const g = M.pulse(lt, 3.0, .8);
          q(S, 'glint').setAttribute('opacity', g.toFixed(3));
          q(S, 'glint').setAttribute('transform', `translate(${(dx - 26).toFixed(1)},${(dy + 70).toFixed(1)}) scale(${(.6 + g).toFixed(2)}) rotate(${(lt * 40).toFixed(1)})`);
          q(S, 'conc-head').setAttribute('transform', `rotate(${(16).toFixed(2)} 12 -350)`);
        }
      },
      { // 7 — porcelain to your lips … arsenic, lead … you swallow
        at: 52.16,
        cam: { from: [760, 420, 1.6], to: [740, 380, 1.95] },
        svg: (S) => `${room(S, [[420, 120, 90]])}<g data-depth=".9">${nurse(S)}${bowl(S)}</g>`,
        update: (lt, S) => {
          const lift = .72 * M.ramp(lt, 0.3, 2.6);
          const sw = M.ramp(lt, 12.4, 13.4);
          const [bx, by] = nurseHands(S, lt, lift, 1.2 * (1 - sw));
          q(S, 'bowl').setAttribute('transform', `translate(${bx.toFixed(1)},${by.toFixed(1)}) rotate(${(-35 * lift - 25 * sw).toFixed(1)})`);
          G.rot(q(S, 'nurse-head'), 6 * (1 - lift) - 14 * sw, 14, -268);
        }
      },
      { // 8 — one second … two … the heartbeat
        at: 66.43,
        cam: { from: [760, 370, 2.1], to: [770, 360, 2.4] },
        svg: (S) => `${room(S, [])}<g data-depth=".9">${nurse(S)}${bowl(S)}</g>
          <rect id="${S.id('pulse')}" x="-300" y="-300" width="2200" height="1500" fill="${S.u('redPulse')}" opacity="0"/>
          <rect id="${S.id('dim')}" x="-300" y="-300" width="2200" height="1500" fill="#000" opacity="0"/>`,
        update: (lt, S, t) => {
          const [bx, by] = nurseHands(S, lt, .2, .5);
          G.move(q(S, 'bowl'), bx, by);
          G.rot(q(S, 'nurse-head'), -4, 14, -268);
          // heartbeat: lub-dub every 0.85 s, faster as the fear builds
          const rate = 0.85 - 0.25 * M.ramp(lt, 2, 11);
          const ph = (lt % rate) / rate;
          const beat = Math.max(Math.exp(-Math.pow((ph - .08) * 18, 2)), .7 * Math.exp(-Math.pow((ph - .3) * 18, 2)));
          q(S, 'pulse').setAttribute('opacity', (beat * (.35 + .4 * M.ramp(lt, 2, 10))).toFixed(3));
          q(S, 'dim').setAttribute('opacity', (.15 + .25 * M.ramp(lt, 1, 10)).toFixed(3));
          q(S, 'nurse').setAttribute('transform', `scale(${(1 + .006 * beat).toFixed(4)})`);
        }
      },
      { // 9 — nothing happens. A shaky breath. Safe, for today.
        at: 78.36,
        cam: { from: [780, 400, 1.7], to: [800, 450, 1.2] },
        svg: (S) => `${room(S)}<g data-depth=".9">${nurse(S)}${bowl(S)}</g>
          <rect id="${S.id('dim')}" x="-300" y="-300" width="2200" height="1500" fill="#000" opacity=".4"/>
          ${Sc.curtains(S)}`,
        update: (lt, S) => {
          const [bx, by] = nurseHands(S, lt, 0, .3);
          G.move(q(S, 'bowl'), bx, by);
          const breath = M.win(lt, 1.6, 5, 1.6);
          q(S, 'nurse').setAttribute('transform', `translate(0,-240) scale(1,${(1 + .03 * breath).toFixed(4)}) translate(0,240)`);
          G.rot(q(S, 'nurse-head'), -10 * breath + 6, 14, -268);
          q(S, 'dim').setAttribute('opacity', (.4 * (1 - M.ramp(lt, 0.5, 4))).toFixed(3));
        }
      },
      { // 10 — the concubine snatches the bowl, turns cold, feeds her son
        at: 87.06,
        cam: { from: [860, 440, 1.15], to: [940, 430, 1.25] },
        svg: (S) => `${room(S)}<g data-depth=".9">${nurse(S)}${conc(S)}${bowl(S)}<g id="${S.id('bb')}" opacity="0">${Pr.baby(S)}</g></g>${Sc.curtains(S)}`,
        update: (lt, S) => {
          const [nx, ny] = nurseHands(S, lt, 0, .3 * (1 - M.ramp(lt, .6, 1)));
          const reach = M.ramp(lt, 0, .5) * (1 - M.ramp(lt, 1.1, 1.8));
          const ua = -20 - 55 * reach, fa = -40 + 20 * reach;
          G.pose(S, 'conc', { nearUa: ua, nearFa: fa, farUa: -20, farFa: -30 });
          const [hx, hy] = G.hand(6, -318, ua, fa, 74, 70);
          const cx = CX - hx * CK, cy = CY + hy * CK;
          const take = M.ramp(lt, .45, .6);
          q(S, 'bowl').setAttribute('transform', `translate(${M.lerp(nx, cx, take).toFixed(1)},${M.lerp(ny, cy, take).toFixed(1)})`);
          q(S, 'bowl').setAttribute('opacity', (1 - M.ramp(lt, 6, 7)).toFixed(3));
          // nurse's empty hands drop
          if (take > .5) G.pose(S, 'nurse', { nearUa: -20, nearFa: -40, farUa: -16, farFa: -40 });
          // she turns away (head) and cradles the baby
          q(S, 'conc-head').setAttribute('transform', `rotate(${(14 - 30 * M.ramp(lt, 1.5, 3)).toFixed(2)} 12 -350)`);
          const bb = M.ramp(lt, 9, 10.5);
          q(S, 'bb').setAttribute('opacity', bb.toFixed(3));
          q(S, 'bb').setAttribute('transform', `translate(${(CX - 80).toFixed(1)},${(CY - 330).toFixed(1)}) scale(-1.1,1.1)`);
        }
      },
      { // 11 — you step back into the shadows of the silk curtains
        at: 101.96,
        cam: { from: [760, 450, 1.05], to: [600, 460, 1.12] },
        svg: (S) => `${room(S)}
          <g data-depth=".9"><g transform="translate(1080,780) scale(-1.2,1.2)">${G.person(S, { id: 'c2', hair: 'loops', robe: 'court', arm: { ua0: -28, fa0: -95 } })}</g>
            <g transform="translate(1000,450) scale(-1,1)">${Pr.baby(S)}</g>
            <g id="${S.id('you')}">${G.person(S, { id: 'you', hair: 'bun', robe: 'plain' })}</g></g>
          ${Sc.curtains(S)}`,
        update: (lt, S) => {
          const back = M.ramp(lt, .3, 4.5);
          const x = 620 - back * 420;
          q(S, 'you').setAttribute('transform', `translate(${x.toFixed(1)},${(780 + walk(lt) * (back < 1 ? 1 : 0)).toFixed(1)}) scale(1.15)`);
          q(S, 'you').setAttribute('opacity', (1 - .8 * M.ramp(lt, 3.5, 5.5)).toFixed(3));
          const w = M.win(lt, 1, 4, .8); G.pose(S, 'you', { nearUa: -30 * w, nearFa: -160 * w, farUa: -6, farFa: -6 }); // wipes her mouth
        }
      },
      { // 12 — the prince eats again in four hours
        at: 109.06,
        cam: { from: [800, 450, 1.25], to: [800, 430, 1.4] },
        svg: (S) => `<rect x="-300" y="-300" width="2200" height="1500" fill="${S.p.wall}"/>
          <circle class="glow" cx="800" cy="420" r="520" fill="${S.u('warmGlow')}" opacity=".45"/>
          <g data-depth=".6"><rect x="-300" y="640" width="2200" height="600" fill="${S.p.floorHi}"/></g>
          <g transform="translate(800,650) scale(1.3)">${Pr.incense(S)}</g>`,
        update: (lt, S) => {
          const k = M.ramp(lt, 0, 3.6) * .12;
          q(S, 'inc-stick').setAttribute('height', (300 - 300 * k).toFixed(1));
          q(S, 'inc-stick').setAttribute('transform', `translate(0,${(300 * k).toFixed(1)})`);
          q(S, 'inc-ember').setAttribute('cy', (-330 + 300 * k).toFixed(1));
          q(S, 'inc-smoke').setAttribute('transform', `translate(${(6 * Math.sin(lt * 2)).toFixed(1)},${(300 * k).toFixed(1)})`);
        }
      }
    ]
  });
})();
