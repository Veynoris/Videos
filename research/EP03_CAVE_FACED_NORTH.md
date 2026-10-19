# Quran Decoding — Episode 03: "The cave the sun never entered" (al-Kahf 18:17)

**Deliverables:**
- `video/out/quran-decoding-ep03-cave-faced-north.mp4` (rebuild: `npx remotion render CaveFacingNorth`, then `python3 scripts/sound_ep03.py`, then mux)
- cover: `video/out/ep03-reel-cover.png` (`npx remotion still Ep03Cover`)
- caption: `research/EP03_CAPTION.md`

**Specs:** 1080×1920 · 30 fps · 71.1 s (2,134 frames) · H.264 yuv420p (TV range) · AAC 256 kb/s · −16 LUFS.

## Claim and sources

| Layer | Content | Status |
|---|---|---|
| Qur'an | Al-Kahf 18:17, opening clause (to «مِّنۡهُ») and «ذَٰلِكَ مِنۡ ءَايَٰتِ ٱللَّهِ» | KFGQPC Hafs; Sahih International |
| Interpretation | Ibn Kathīr: the verse shows the cave's entrance faced **north**. At rising the sun inclines away to the right; at setting it passes on the left. Any other orientation would let the sun in at rising, at setting or all day. He adds that this is understood by whoever knows the paths of the sun, moon and stars. He also says Allah did not reveal the cave's location because no benefit attaches to knowing it. | Tafsīr Ibn Kathīr on 18:17. Text found via search on quran.ksu.edu.sa and ayahsurahquran.com. ⚠ Check the wording in print. The on-screen quote is our abridged translation. |
| Meaning of تَّزَٰوَرُ | "Inclines, turns away" (Ibn ʿAbbās, Saʿīd ibn Jubayr, Qatāda, via Ibn Kathīr; al-Ṭabarī: تميل / تعدل) | As above |
| Other view | Al-Qurṭubī notes the view that the sun was kept from them as a miracle. The verse ends «ذَٰلِكَ مِنۡ ءَايَٰتِ ٱللَّهِ». | Shown on screen |

**The diagram is a simplified model of Ibn Kathīr's reasoning:**
- The sun's bearing runs E → S → W over one day (northern hemisphere).
- The cave's opening is 52° wide.
- Light reaches the chamber floor when the sun is within 80° of the opening's bearing.
- "Direct sun inside" integrates that over a 12-hour day.

The model ignores seasonal shifts of sunrise and sunset, as Ibn Kathīr's argument does. It is an illustration, not a survey of a real site.

No people are drawn. "The open space where they lay" is a dotted outline only.

## Script

| # | Beat | On screen |
|---|---|---|
| 1 | Hook | A cave on a compass, turning as if searching. "Nobody knows where this cave is." → "But one verse tells you which way it faces." |
| 2 | Verse | "Read it slowly." Card 18:17 (opening), "on the right" in gold and "on the left" in silver |
| 3 | Clues | Two clues: at sunrise it turns away, to the right; at sunset it passes them, on the left. "So which way did the entrance face?" |
| 4 | Test | "Ibn Kathīr tested every direction." East / South / West: a day of sun runs, light pours in, and the meter fills (East ≈ 4.6 h, West ≈ 3.8 h). North: the sun turns right at sunrise and passes left at sunset; the meter stays at 0.0 h ("The sun stays out"). |
| 5 | Result | "The entrance faced north." Ibn Kathīr card (translated, abridged) |
| 6 | Signs | "Another view (al-Qurṭubī): the sun was turned from them by a miracle." «ذَٰلِكَ مِنۡ ءَايَٰتِ ٱللَّهِ» "That was from the signs of Allah." |
| 7 | Outro | "309 years. And the sun kept turning away." "Read al-Kahf 18:9–26 slowly." Quran Decoding |

## Sound (halal policy unchanged)

`scripts/sound_ep03.py` uses the shared `scripts/sfxlib.py`.
- **Ambience:** night wind and earth rumble.
- **Rotations:** stone grinding each time the cave turns.
- **Each day of sun:** a warm air swell travelling from the right (east) to the left (west), with sand hiss while light pours in.
- **Verdicts:** a soft thud for "light enters"; an opening of air for "the sun stays out".
- **Cards and reveals:** parchment, earth thuds.

No music, instruments, bells, melodies or recitation.
