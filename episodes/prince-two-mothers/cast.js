// Cast for The Prince With Two Mothers (same look in every chapter). Inlined into each chapter by scripts/build.py.
window.CAST = {
  prince: (S, x = {}) => ({ id: 'prince', child: true, skin: '#f1c9a0', robe: '#e8574a', trim: S.p.goldHi, sash: S.p.jade, hair: 'knot', arms: 'down', cheeks: .5, ...x }),
  nurse: (S, x = {}) => ({ id: 'nurse', skin: S.p.skin.peasant, robe: S.p.jade, trim: S.p.cream, sash: S.p.yellow, hair: 'bun', arms: 'down', lashes: true, ...x }),
  eunuch: (S, x = {}) => ({ id: 'eun', skin: S.p.skin.warm, robe: S.p.blue, trim: '#9fb4d6', sash: S.p.ink, hair: 'cap', arms: 'hold', cheeks: .3, ...x }),
  consort: (S, x = {}) => ({ id: 'conc', skin: S.p.skin.fair, robe: S.p.pink, trim: S.p.goldHi, sash: '#7b4fa0', hair: 'loops', arms: 'down', lashes: true, ...x }),
  empress: (S, x = {}) => ({ id: 'emp', skin: S.p.skin.light, robe: S.p.yellow, trim: S.p.red, sash: S.p.red, hair: 'phoenix', arms: 'down', cheeks: .25, lashes: true, ...x }),
  tutor: (S, x = {}) => ({ id: 'tutor', skin: S.p.skin.warm, robe: '#6b4a8a', trim: '#d9c7ea', sash: S.p.ink, hair: 'cap', arms: 'down', beard: true, cheeks: .2, ...x }),
  li: (S, x = {}) => ({ id: 'li', skin: S.p.skin.light, robe: '#8fb3d9', trim: S.p.cream, sash: '#5b7fa8', hair: 'bun', arms: 'baby', lashes: true, ...x }),
  liu: (S, x = {}) => ({ id: 'liu', skin: S.p.skin.fair, robe: '#b23a48', trim: S.p.gold, sash: S.p.gold, hair: 'loops', arms: 'down', lashes: true, cheeks: .3, ...x }),
  boyEmperor: (S, x = {}) => ({ id: 'boy', child: true, skin: '#f1c9a0', robe: S.p.yellow, trim: S.p.red, sash: S.p.red, hair: 'capGold', arms: 'down', ...x }),
  emperor: (S, x = {}) => ({ id: 'emperor', skin: '#f1c9a0', robe: S.p.yellow, trim: S.p.red, sash: S.p.red, hair: 'capGold', arms: 'down', beard: true, cheeks: .2, ...x })
};
// place(inner, x, y, k, id): put a figure on the floor at (x,y), scale k
window.place = (inner, x, y, k = 1, id = '') => `<g ${id ? `id="${id}"` : ''} transform="translate(${x} ${y}) scale(${k})">${inner}</g>`;
// T(x): one-line transform setters
window.setT = (S, id, tr) => { const el = S.q('#' + S.id(id)); if (el) el.setAttribute('transform', tr); };
window.setO = (S, id, o) => { const el = S.q('#' + S.id(id)); if (el) el.setAttribute('opacity', (+o).toFixed(3)); };
window.TREM = (t, amp = 1) => amp * (Math.sin(t * 31) * 0.6 + Math.sin(t * 47 + 1) * 0.4);
