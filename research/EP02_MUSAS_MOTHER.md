# Quran Decoding — Episode 02: "22 words. 8 messages." (Musa's mother, al-Qaṣaṣ 28:7)

**Deliverables:**
- `video/out/quran-decoding-ep02-musas-mother.mp4` (rebuild: `npx remotion render MusasMother`, then `python3 scripts/sound_ep02.py` and mux; see the EP01 `render.sh` for the encode flags)
- cover: `video/out/ep02-reel-cover.png` (`npx remotion still Ep02Cover`)
- caption: `research/EP02_CAPTION.md`

**Specs:** 1080×1920 · 30 fps · 71.1 s (2,134 frames) · H.264 High yuv420p (TV range) · AAC 256 kb/s · −16 LUFS.

## Claim and sources

| Layer | Content | Status |
|---|---|---|
| Qur'an | Al-Qaṣaṣ 28:7 (22 words in the Uthmani text), 28:10 (opening), 28:13 | KFGQPC Hafs; Sahih International |
| Anecdote | Al-Aṣmaʿī (d. 216 AH / 831 CE) heard a Bedouin girl say this verse gathers «أمرين ونهيين وخبرين وبشارتين» (two commands, two prohibitions, two pieces of news, two glad tidings) | Al-Qurṭubī, *al-Jāmiʿ li-Aḥkām al-Qurʾān*, on 28:7. Also on quran.com (Qurṭubī, 28:7) and Islamweb. An adab anecdote, not a hadith; the video presents it as "reported by al-Qurṭubī". |
| Classification | Commands: أرضعيه، ألقيه · Prohibitions: لا تخافي، لا تحزني · News: إنا رادوه إليك، وجاعلوه من المرسلين · the two glad tidings are *contained in* the two news | Al-Marāghī, *Tafsīr al-Marāghī* on 28:7 (Wikisource text, via search). Other writers place the two "news" elsewhere (e.g. «وأوحينا» and «فإذا خفت»). The video follows al-Marāghī and credits him on screen. |
| Textual echo | 28:7 «وَلَا تَحۡزَنِيٓ … إِنَّا رَآدُّوهُ إِلَيۡكِ» ↔ 28:13 «فَرَدَدۡنَٰهُ إِلَىٰٓ أُمِّهِۦ … وَلَا تَحۡزَنَ … وَلِتَعۡلَمَ أَنَّ وَعۡدَ ٱللَّهِ حَقّٞ» | Directly verifiable in the text |

**"Some twelve centuries ago."** Al-Aṣmaʿī lived 122–216 AH (740–831 CE), so the encounter was roughly 1,195–1,285 years before 2026.

**No depiction.** No prophet, mother or any person is shown. The baby is represented only by a closed chest (al-tābūt, Ṭā-Hā 20:39) floating on the river.

## Script

| # | Beat | On screen |
|---|---|---|
| 1 | Hook (0–7.7 s) | Moonlit Nile, closed chest drifting. "A mother was told to cast her baby into a river." → "— and she obeyed." → **"22 words."** (22 dots tapped in) → **"8 messages."** · `IN A SINGLE VERSE` |
| 2 | Verse (7.1–17.3 s) | "Read it once." Card 28:7: Arabic in four lines + Sahih International |
| 3 | Al-Aṣmaʿī (16.7–26.3 s) | "Some twelve centuries ago, a Bedouin girl told al-Aṣmaʿī:" Manuscript card: her question, the Arabic «فجمع في آية واحدة بين أمرين ونهيين وخبرين وبشارتين» (categories colour-coded), translation, `REPORTED BY AL-QURṬUBĪ` |
| 4 | Decode (25.7–46.1 s) | "Now decode it." Six phrases, each with a gloss and category chips. The tally fills 2 · 2 · 2 · 2 → **"= 8 messages"** · `The two promises are news and glad tidings at once · al-Marāghī` |
| 5 | Heart (45.5–52.5 s) | 28:10 opening: "And the heart of Moses' mother became empty [of all else]." The chest drifts away. "But the promise was already made." |
| 6 | Promise (51.9–65.3 s) | 28:7 «وَلَا تَحۡزَنِيٓ · إِنَّا رَآدُّوهُ إِلَيۡكِ» → a beam of light, "six verses later" → 28:13 «فَرَدَدۡنَٰهُ … وَلَا تَحۡزَنَ» → «وَلِتَعۡلَمَ أَنَّ وَعۡدَ ٱللَّهِ حَقّٞ» "…and that she would know that the promise of Allah is true." |
| 7 | Outro (64.7–71.1 s) | The chest comes back toward us. "Eight messages. One promise — kept." "Read al-Qaṣaṣ 28:7–13 slowly." Quran Decoding |

**Colour code:**
- commands: gold;
- prohibitions: silver-blue;
- news and glad tidings: teal (new to this episode).

## Sound (halal policy unchanged)

`scripts/sound_ep02.py` uses the shared `scripts/sfxlib.py`.

**Sources:** the river (a flow bed, lapping, scattered droplets), night wind, soft taps for the 22 words, small stones landing as each category chip appears, parchment, air swells, earth thuds. No music, instruments, bells, melodies or recitation.

**Mix:** mastered to −16 LUFS with a −2 dBFS ceiling.

## Open checks before publishing

1. Al-Qurṭubī's anecdote wording in a printed edition (vol./page).
2. Al-Marāghī's classification in a printed edition.
