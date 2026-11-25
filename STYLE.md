# Channel style: bright flat cartoon (house style)

Chosen by Anna on 2026-11-25. Every new episode uses this style. Kit: `styles/flat/flat.js`.
Reference chapter: `episodes/style-sample-flat/chapters/ch01` (the Wet Nurse opening). Copy its structure.
The older paper-cut shadow-theatre style (`styles/song/`) is kept for the published Palace Wet Nurse episode only; use it only if Anna asks.

## Always
- **Flat colour with ink outlines.** Bright, saturated fills; one darker flat shadow on the right side of robes; outlines in ink `#2d2030` (5 px on figures, 3-4 px on props). No gradients on figures; soft glows only for lanterns, candles and the moon.
- **Faces carry the story.** Front-view figures (`F.person`) with expressive faces set every frame by `F.face(S, id, { t, mouth, brows, look })`:
  - mouths: `neutral`, `worried`, `scared`, `smirk`, `smile`; brows: `flat`, `worried`, `sly`, `up`; `look: [dx, dy]` moves the eyes. They blink on their own (give each character a different `phase`).
  - Change the face when the narration's mood changes (worried → scared on the threat line; smirk for the villain).
  - `tired: true` adds eye bags and a sweat drop; `lashes: true` adds lashes and earrings for women.
- **Costume tells rank and role.** Each character gets a distinct robe colour, trim and sash, and headwear (`hair: bun | loops | phoenix | cap`). A recurring character looks identical across chapters. Skin tones from `p.skin` (peasants more sun-tanned than court ladies).
- **Something moves at all times:** trembling hands, rocking babies, walking bobs, slide-ins (never ghost fades for people), lanterns sway (`class="sway"`), glows flicker (`class="glow"`), candle flames (`class="flame"`).
- **Every scene has a slow camera move** (`cam: {from, to}`, scale 1.0-1.2; up to 1.9 for face close-ups). New scene every 5-12 seconds, cut where the narration changes idea.
- **Layers** at parallax depths (`data-depth`): backdrop .1-.2, pillars .35, floor .5, figures .8-.9.
- **Subtitles burned in** (most Facebook viewers watch muted): Fredoka 600, 56 px at 1080p, white with a dark outline, `maxWords: 8` per line.
- **Title card after the hook:** "A day in the life of" / episode name / culture. "Year" card at the very start.
- **Danger colours only for danger:** red for blood and threats, poison green (`p.poison`) for poison.
- **Border:** gold key-fret on dark red around every frame (the channel's signature; never moves).

## Per culture
The kit's set pieces (`Scenery.nursery / hall / courtyard / table`, `Props.lantern / pillar / tree / bigBowl`) are Song dynasty China.
To start a new timeline (Rome, Egypt, Mali, …): copy `styles/flat/flat.js` to `styles/<culture>/<culture>.js` (export a new `window.<Name>Style`), then change:
- the palette (e.g. terracotta, white and imperial purple for Rome; sand, lapis and gold for Egypt),
- headwear and robe shapes in `person()` (laurel, nemes headdress, turbans, …),
- the set pieces (columns, temples, markets, river boats).
Keep the faces, outlines, captions, border idea and the engine (`lib/stage.js`) the same so the channel looks like one series.

## Formats
- Long-form YouTube and Facebook: 1920×1080, 30 fps, MP4. Chapters of 1-2 minutes, joined into one video.
- Thumbnails 1280×720 from a real frame (`scripts/thumbnail.js`): one big face with a clear emotion, max 3 words that don't repeat the title.
