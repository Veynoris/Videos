# Quran Decoding — Episode 04: "Hearing. Seeing." (al-Samīʿ, al-Baṣīr)

**Built on the formula of the 125k reel.** It runs 43.3 s and follows one pattern → one exception → one reason → one emotional peak.
- At most about 6 words per screen.
- The evidence (the tile wall) is on screen from frame 0.
- The last frame dissolves back into the first, so the reel loops seamlessly.
- Camera drift is off in the opening and closing beats so the loop matches.

**Deliverables:**
- `video/out/quran-decoding-ep04-hearing-seeing.mp4` (composition `HearingSeeing` + `scripts/sound_ep04.py`)
- cover: `video/out/ep04-reel-cover.png` (`Ep04Cover`)
- caption: `research/EP04_CAPTION.md`

## Evidence (reproducible)

`research/name_pairs.py` scans every adjacent pair of divine names in the KFGQPC Hafs text. It reproduces the 125k reel's Ghafūr/Raḥīm finding (64 vs 1, the flip at 34:2) and finds:

| Pair | Hearing → Seeing | Seeing → Hearing |
|---|---|---|
| «سميع · بصير» adjacent | **11**: 4:58, 4:134, 17:1, 22:61, 22:75, 31:28, 40:20, 40:56, 42:11, 58:1 (all Allah); 76:2 (the human: "We made him hearing, seeing") | **1**: 11:24 |

**The exception, 11:24:** «مَثَلُ ٱلۡفَرِيقَيۡنِ كَٱلۡأَعۡمَىٰ وَٱلۡأَصَمِّ وَٱلۡبَصِيرِ وَٱلسَّمِيعِ», *"The example of the two parties is like the blind and deaf, and the seeing and hearing."* It describes people, not Allah. The order mirrors the preceding pair: blind ↔ seeing, deaf ↔ hearing. This is visible directly in the sentence. The video adds no further claim, such as a reason why hearing is mentioned first.

## Hadith

ʿĀʾisha: «الحمد لله الذي وسع سمعه الأصوات…», *"Blessed is He whose hearing encompasses all voices. The woman who disputed came to the Prophet ﷺ, and I was in a side of the house; I could not hear what she said…"*
- Ibn Mājah 188, al-Nasāʾī 3460, Aḥmad 24195.
- Al-Bukhārī cites it without its chain (muʿallaq), before 7386.
- Graded **ṣaḥīḥ** by al-Albānī.
- Source: dorar.net (al-Mawsūʿa al-Ḥadīthiyya), via search. ⚠ Confirm the Ṣaḥīḥ Ibn Mājah number in print.

## Script (≤6 words per screen)

| # | Beat | On screen |
|---|---|---|
| 1 | Hook (0–5.6 s) | `TWO NAMES OF ALLAH` · **Hearing. Seeing.** · the 12-tile wall · "Hearing first — every time…" |
| 2 | Exception | The wall dims, 11:24 lifts out · "…except **once.**" · `SIGHT FIRST · HŪD 11:24` |
| 3 | Mirror | "It isn't about Allah." → "It mirrors 'the blind and the deaf.'" Four words with arcs: blind → seeing, deaf → hearing |
| 4 | Allah | "When Allah describes Himself —" ten tiles · "10 times. Hearing first." |
| 5 | Story | 58:1 card → "A woman came to complain." "ʿĀʾisha was in the same room." "She couldn't hear what she said." → **"Allah did."** · hadith reference |
| 6 | Close + loop | «إِنَّنِي مَعَكُمَآ أَسۡمَعُ وَأَرَىٰ» "Indeed, I am with you both; I hear and I see." (20:46) → dissolves back into the opening wall |

## Sound (halal policy unchanged)

`scripts/sound_ep04.py`:
- a soft hit on frame 0;
- small stone taps as the tiles settle;
- air arcs that follow the mirror lines;
- a reversed swell into the deepest thud on "Allah did.";
- a tail that fades to near-silence so the loop restarts cleanly.

No music, instruments, bells, melodies or recitation.
