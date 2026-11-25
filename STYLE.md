# Channel style: shadow theatre by firelight

The same look across every timeline; only the palette, border and set pieces change per culture.

## Always
- Flat paper-cut silhouettes in profile, like shadow puppets: ink fill with a thin warm edge (`inkEdge`), jointed arms on rods (shoulder, elbow), no faces drawn, one glinting eye only for menace.
- Light comes from inside the picture: lanterns, oil lamps, a glowing paper screen, a low sun. Everything that glows flickers (`class="glow"`), flames scale (`class="flame"`), hanging things sway (`class="sway"`).
- Layers sit at parallax depths (`data-depth`: backdrop .1-.3, room .3-.6, figures .7-.9, foreground curtains 1.4-1.7).
- Every scene has a slow camera move (push or pan, scale 1.0-1.3; up to 2.5 for face close-ups). Something moves at all times.
- Two kinds of shot alternate: **the room** (solid silhouettes in a lit set) and **the screen** (blurred cast shadows on the glowing paper: memories, power, threats).
- New scene every 5-12 seconds, cut where the narration changes idea. Crossfades of 0.9 s.
- Film grain, warm soft-light wash and a vignette on every frame; the culture's border frames the picture and never moves.
- Subtitles burned in (most Facebook viewers watch muted): EB Garamond italic, 54 px at 1080p, cream with a soft black glow, max ~11 words per line.
- Title card after the hook: "A day in the life of" / episode name / culture. Fade to black at the very end.
- Red (`blood`) only for danger: the X over forbidden things, the heartbeat, the cane.

## Per culture (`styles/<culture>/<culture>.js`)
A kit exports `palette`, `defs(p, prefix)`, `border(p, prefix)`, `Scenery`, `Props`, figure builders (`person`, `kneeler`, …) and helpers (`pose`, `hand`, `move`, `rot`).
To start a new timeline (Rome, Greece, …): copy `styles/song/song.js`, change the palette (e.g. terracotta and black-figure for Greece), the border pattern (meander/Greek key, laurel), headwear and robes (`headwear()` cases), and the set pieces (columns, amphorae, temples). Keep the engine untouched.

| Timeline | Kit | Palette | Border |
|---|---|---|---|
| Song dynasty China (960-1279) | `styles/song` | lacquer red, gold, lantern orange, warm paper | gold key-fret on dark lacquer |
