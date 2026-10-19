# [ARCHIVED CANDIDATE] Earth/heaven order (Yūnus 10:61 vs Sabaʾ 34:3) — superseded by EP01 "300… and 9" (see EP01_300_AND_9.md)

**Working title:** *Earth first.*
**Status:** awaiting approval. Nothing has been rendered beyond a font test.

---

## 0. Reference analysis (Phase 1)

Three references were inspected with ffprobe/ffmpeg: 1 fps contact sheets, 5–10 fps transition strips, full-resolution key frames and audio spectrograms.

| | Ref A (blueprint) | Ref B ("darknesses") | Ref C ("mercy") |
|---|---|---|---|
| Format | 720×1280, 30 fps, 54.2 s | 720×1280, 30 fps, 62.7 s | 720×1280, 30 fps, 63.1 s |
| Background | deep navy | warm paper, then charcoal | warm paper |
| Cuts | none: one continuous canvas | none | none |
| Beats | ~14 (≈3.8 s each) | ~13 | ~14 |
| Voiceover | none detected | none detected | none detected |

The audio finding is an inference from the spectrograms (no speech harmonics or syllabic rhythm). I cannot listen to audio. All three appear to use sound design only: soft swells and whooshes on transitions, ticks on counters, and rain or ambient beds.

### Design spec for this episode

Your instruction: **Ref A's navy background is fixed. Animation comes from all three references. The palette is free.**

1. **Background:** navy base `#0B1322`. Two or three very large, heavily blurred radial glows drift slowly (a cool glow top-left, a warm glow bottom-right) under a soft vignette, with a faint film-grain overlay. It never cuts to flat black. (Ref A)
2. **Palette (new):**
   - **Earth** = clay / terracotta `#D99A6C`
   - **Heaven** = pale celestial blue `#9CCBEA`
   - Text ivory `#ECE6DA`; secondary text slate `#8C96A8`; hairlines `#ECE6DA` at 15% opacity
   - Colour is used *only* as meaning: earth-words are always clay, heaven-words always blue (same discipline as Ref A's teal/peach).
3. **Typography:**
   - Headlines: high-contrast serif (Newsreader), with italics carrying the emphasis.
   - Labels: tracked monospace caps (JetBrains Mono), e.g. `SURAH YŪNUS · 10:61`.
   - Arabic: KFGQPC Uthmanic Script Hafs, the King Fahd Complex font that matches the text encoding.
   - Headline at top third, centred, maximum two lines. (All refs)
4. **Text animation:** words enter one by one with blur (≈12 px → 0), opacity 0 → 1 and a slight upward drift over ≈0.4 s on a soft ease-out. Exits are a group blur-dissolve. (Ref A, B, C)
5. **Transitions:** there are no hard cuts. Each scene hands over through one of these:
   - **Depth-of-field blur:** the old layer blurs and recedes while the new one sharpens. (Ref A)
   - **Matter wipe:** layered wavy strata rise and fill the frame. (Ref B)
   - **Iris reveal:** a glowing word expands into a circle that becomes the next background. (Ref B)
6. **Data visualisation:**
   - A grid with one cell per verse (6,236 cells) where hits light up. (Ref C)
   - Numeric counters that tick up beside hairline bars. (Ref A)
   - A hero card that lifts out of a dimmed, blurred field with a thin glowing outline. (Ref A)
7. **Particles:**
   - Slow drifting dots stand for "atoms' weight" (Ref A's particle field, Ref C's dot field).
   - A single labelled dot marked `you`. (Ref C)
8. **Composition:** one idea per screen. Generous negative space. Body text never runs wider than about 75% of the frame. Everything stays inside a mobile-safe area of 120 px top and 300 px bottom at 1080×1920.
9. **Qur'anic text rules:**
   - The Arabic is always complete for the span shown, with an exact reference label.
   - Translations are italic, in quotes, and credited (Sahih International).
   - Commentary always appears in a different style (roman serif plus a mono attribution) and never inside the verse card.
10. **Ending motif:** a single dot, a two-line conclusion, an italic question, and a mono sign-off (`WHY THIS ORDER?`), following Ref B and C's endings.

---

## 1. Topic and why it was chosen

**Yūnus 10:61 and Sabaʾ 34:3 are almost word-for-word identical, yet one says "in the earth nor in the heaven" and the other "in the heavens nor in the earth."**

The candidates were evaluated as follows:

| Candidate | Strength | Why not chosen (now) |
|---|---|---|
| **10:61 vs 34:3 earth/heaven swap** ✅ | Visually demonstrable; explained explicitly by several classical scholars; reproducible | — |
| al-Khiḍr's "I intended / We intended / your Lord intended" (18:79–82) | Beautiful adab lesson | Scholars differ on the "We" more than on this; good for episode 2 |
| "Trade or amusement" order flip inside 62:11 | Same-verse flip, hadith context (Bukhārī) | Thinner visual arc |

The chosen topic fits the channel format of the references: a pattern, the exception, the context, and a classical explanation. It is also not a numerical "miracle" claim.

## 2. The precise claim

1. **Verifiable fact:** 10:61 and 34:3 share the phrase *"not absent from [Him] is an atom's weight … nor smaller than that nor greater, except in a clear Book"*, but the order of earth and heaven is reversed.
2. **Verifiable pattern:** when the Qur'an names the two side by side ("X and Y"), heaven comes first 148 times and earth twice, using the method in §6.
3. **Interpretation (attributed, not ours):** classical scholars explain that the earth comes first in 10:61 because the verse opens by addressing people's deeds, which happen on earth, where those addressed live. Sabaʾ keeps the usual order.

What the video will **not** claim: a miracle, a number pattern with meaning, or any reason the scholars did not give.

## 3. Qur'anic passages

Text: KFGQPC Hafs ʿan ʿĀṣim (via `quran-json@3.1.2`, sourced from QuranEnc). English: Sahih International.

- **Yūnus 10:61** — وَمَا تَكُونُ فِي شَأۡنٖ وَمَا تَتۡلُواْ مِنۡهُ مِن قُرۡءَانٖ وَلَا تَعۡمَلُونَ مِنۡ عَمَلٍ إِلَّا كُنَّا عَلَيۡكُمۡ شُهُودًا إِذۡ تُفِيضُونَ فِيهِۚ وَمَا يَعۡزُبُ عَن رَّبِّكَ مِن مِّثۡقَالِ ذَرَّةٖ **فِي ٱلۡأَرۡضِ وَلَا فِي ٱلسَّمَآءِ** وَلَآ أَصۡغَرَ مِن ذَٰلِكَ وَلَآ أَكۡبَرَ إِلَّا فِي كِتَٰبٖ مُّبِينٍ
  *"…you do not do any deed except that We are witness over you when you are involved in it. And not absent from your Lord is any [part] of an atom's weight within the earth or within the heaven…"*
- **Sabaʾ 34:3** — …عَٰلِمِ ٱلۡغَيۡبِۖ لَا يَعۡزُبُ عَنۡهُ مِثۡقَالُ ذَرَّةٖ **فِي ٱلسَّمَٰوَٰتِ وَلَا فِي ٱلۡأَرۡضِ** وَلَآ أَصۡغَرُ مِن ذَٰلِكَ وَلَآ أَكۡبَرُ إِلَّا فِي كِتَٰبٖ مُّبِينٖ
  *"…[Allah is] the Knower of the unseen. Not absent from Him is an atom's weight within the heavens or within the earth…"*
- **Sabaʾ 34:1** opens: لَهُۥ مَا فِي ٱلسَّمَٰوَٰتِ وَمَا فِي ٱلۡأَرۡضِ (heavens first). This is a textual observation only.

Other textual differences between the two verses are not used in the video, to keep it focused:
- وَمَا vs لَا
- عَن رَّبِّكَ vs عَنۡهُ
- مِن مِّثۡقَالِ vs مِثۡقَالُ
- singular ٱلسَّمَآء vs plural ٱلسَّمَٰوَٰت
- أَصۡغَرَ vs أَصۡغَرُ in Hafs

## 4. Supporting scholarship

| Source | What it says (paraphrase) | Verification status |
|---|---|---|
| **Abū Ḥayyān al-Andalusī, *al-Baḥr al-Muḥīṭ*, on 10:61** | «ولما ذكر شهادته تعالى على أعمال الخلق ناسب تقديم الأرض التي هي محل المخاطبين على السماء، بخلاف ما في سورة سبأ، وإن كان الأكثر تقديمها على الأرض» | Wording surfaced in search results from the Arabic Wikisource edition. **Page not opened directly; needs checking against a printed edition (volume and page still to be added).** |
| **al-Zamakhsharī, *al-Kashshāf*, on 10:61** | Asks why earth precedes heaven when Sabaʾ reverses it. Answers: heaven's right is to come first, but after mentioning His witness over the affairs and deeds of the people of the earth, putting earth first was fitting. Also notes that *wa* does not impose an order. | Paraphrase from search results (quranpedia). **Not opened directly.** Used for the grammar point only. Al-Zamakhsharī was a Muʿtazilī, but this is a rhetorical point that Sunni commentators (including Abū Ḥayyān) also make. |
| **Ibn al-Qayyim, *Badāʾiʿ al-Fawāʾid*** | Heaven usually comes first for rank and greatness. In Yūnus the earth comes first because the context concerns the addressees, the people of the earth. | Search-result summary only. **Not opened directly.** |
| **al-Ṭanṭāwī, *al-Tafsīr al-Wasīṭ*, on 10:61** | Earth first because the context concerns the conditions of its people. | Search-result summary (quranpedia). Modern Sunni (Azhari) commentary. |
| Ibn ʿĀshūr (Mālikī), *al-Taḥrīr wa-l-Tanwīr* | — | **Could not locate the passage** with the tools available. I'd like to add it. |

**Limitation:** this environment's network policy blocks every tafsir site (shamela.ws, islamweb.net, quran-tafsir.net, quranpedia.net, wikisource, tanzil.net). So the table above comes from search-engine extracts, not pages I read in full. Before publishing, either allow those domains or check the Abū Ḥayyān quote and al-Kashshāf against a printed copy. I have not invented any wording. The Arabic quoted above is exactly what the search returned.

## 5. Disagreements and qualifications

- **The order is not a ranking:** grammatically, *wa* does not require order (al-Zamakhsharī). The video says the order *suits the context*; it does not say earth is ranked higher.
- **Pairs are not always adjacent:** the 148 vs 2 count is for adjacent "X and Y" pairs only. 10:61 uses a different construction ("in X nor in Y"), so the video does not count it among the 2.
- **A related construction:** "in X nor in Y" (فِي … وَلَا فِي …) occurs 8 times, with heaven first 4 times (10:18, 34:3, 34:22, 35:44) and earth first 4 times (3:5, 10:61, 14:38, 29:22).
  - In my output, every heaven-first case uses the plural *al-samāwāt* and every earth-first case the singular *al-samāʾ*.
  - This is an **unexplored observation** with no scholarly source found. It stays out of the video.
- **Sabaʾ's order is the default:** the scholars explain 10:61's departure from the norm. They do not give a special reason for Sabaʾ's order. The video says only that Sabaʾ "keeps the usual order".

## 6. Counting method (reproducible)

Script: `research/heaven_earth_order.py`.

- **Text:** KFGQPC Hafs, 6,236 verses.
- **Normalisation:**
  - all diacritics and Qur'anic marks are stripped;
  - ٱ أ إ آ → ا, and ى → ي.
- **Tokens:**
  - HEAVEN = stem سماء / سماوات / سموت;
  - EARTH = stem ارض;
  - in both cases after removing one proclitic cluster (و ف ب ل ك + ال).
- **Count used in the video:** a HEAVEN token directly followed by a وَ-prefixed EARTH token, or the reverse. Result: **148 heaven-first, 2 earth-first** (14:48, 20:4).
- **Wider windows, for transparency:**

  | Window | Heaven-first | Earth-first |
  |---|---|---|
  | ≤2 tokens apart | 153 | 4 |
  | ≤3 | 192 | 8 |
  | ≤4 | 199 | 10 |

  The direction never changes: heaven leads in more than 95% of pairs under every window.
- **Rule fixed in advance:** the adjacent-pair rule was chosen as the most literal reading of "side by side". It was not picked for its result; all windows are reported here.

## 7. Script (on-screen text; no voiceover, like all three references)

> If you want narration as well, I'll adapt this into a voiceover script of about 140 words. Your call (see questions).

```
[label] TWO VERSES
Almost word for word.
…except for one swap.

Earth.  Heaven.       (Yūnus 10:61)
Heavens.  Earth.      (Sabaʾ 34:3)

When the Qur'an names them side by side,
heaven leads.
148 — heaven first.   2 — earth first.

So why does Yūnus put the earth first?

Read how the verse begins.
"…you do not do any deed
except that We are witness over you…"   — 10:61, Sahih Intl.

It starts with you.
Your deeds. Here — on earth.

"When He mentioned His witness over the deeds of creation,
it suited to put the earth — the place of those addressed —
before the heaven."
ABŪ ḤAYYĀN · AL-BAḤR AL-MUḤĪṬ        (translation: Quran Decoding)

Sabaʾ keeps the usual order.
It opens: "…whatever is in the heavens and whatever is in the earth."

Not one atom's weight escapes Him —
in the earth, or in the heavens.

Read Yūnus 10:61 slowly.
[small] Scholars mention other points too.
[sign-off] WHY THIS ORDER?
```

Estimated runtime: **58 s at 30 fps (1,740 frames)**. Reading time is set at roughly 2.5 words per second plus a 0.8 s hold on every key line, which is slower than Ref A's pace to suit a more text-heavy argument.

## 8. Storyboard (1080×1920, 30 fps)

| Time | Scene | Visual | Motion source |
|---|---|---|---|
| 0.0–4.0 | **Hook** | Label `TWO VERSES`. Two hero cards, 10:61 (top) and 34:3 (bottom), sharpen out of blur. Matching words glow faintly ivory in sync. | Ref A hero card + DOF |
| 4.0–8.5 | **The swap** | Everything dims except the earth/heaven phrase in each card. The two words lift out of the cards, enlarge, and recolour: clay ٱلۡأَرۡضِ, blue ٱلسَّمَآءِ. In 34:3 they sit in reverse order. A slow cross-arrow animates the swap. Label `10:61` / `34:3`. | Ref A word-isolation |
| 8.5–17.0 | **The norm** | Cards blur away. A 6,236-cell verse grid scales in (Ref C). 148 cells light blue in reading order, with a counter ticking to 148 beside a hairline bar (Ref A). Then 2 cells light clay; counter `2`. Mono footnote: `ADJACENT PAIRS · ALL 6,236 VERSES`. | Ref C grid + Ref A counters |
| 17.0–20.5 | **The question** | The grid recedes into blur. Centred italic: *So why does Yūnus put the earth first?* "Earth" is in clay. | Ref A "So why here?" |
| 20.5–28.0 | **Context** | The 10:61 card returns with its opening shown in full. "…وَلَا تَعۡمَلُونَ مِنۡ عَمَلٍ إِلَّا كُنَّا عَلَيۡكُمۡ شُهُودًا…" is highlighted with its translation. Drifting dots (deeds) settle onto an earth horizon line; one dot is labelled `you`. | Ref C dot field + Ref A earth line |
| 28.0–33.0 | **"It starts with you."** | Clay strata rise from the bottom, filling the lower half like Ref B's sea layers. The `you` dot stays lit. Text: *It starts with you. Your deeds. Here — on earth.* | Ref B matter wipe |
| 33.0–41.0 | **The scholar** | Strata dim. The quote card appears with the mono attribution. "the earth" is clay and "the heaven" is blue inside the quote. | Ref A quote card |
| 41.0–47.0 | **Sabaʾ** | The 34:3 card returns. Above it, the opening of 34:1 types in with heavens and earth highlighted. The sky glow brightens and the strata settle. Text: *Sabaʾ keeps the usual order.* | Ref A card + glow drift |
| 47.0–53.0 | **Synthesis** | Iris reveal: the word مِثۡقَالِ ذَرَّةٖ glows and expands into a soft circle (Ref B). Inside, a single atom-dot sits between the earth line and the sky line. Text: *Not one atom's weight escapes Him — in the earth, or in the heavens.* | Ref B iris |
| 53.0–58.0 | **Outro** | The dot settles. *Read Yūnus 10:61 slowly.* Small italic: *Scholars mention other points too.* Mono: `WHY THIS ORDER?` Slow fade of all elements over the last 0.6 s. | Ref B/C endings |

## 9. Production method

- **Remotion 4.0.537** (`video/`), React + TypeScript, rendering through the pre-installed Chromium headless shell.
- All animation is a pure function of the frame number: `interpolate` and `Easing.bezier` curves, plus `spring` only where a settle is wanted. There is no wall-clock timing.
- **Fonts are local:**
  - Newsreader and JetBrains Mono from `@fontsource`;
  - KFGQPC Uthmanic Hafs (`public/fonts`).
  - This font was tested and renders the KFGQPC text's special marks correctly; Amiri Quran did **not**, as it showed a stray subscript alef on ذَرَّةٖ.
- **Reusable components:**
  - `<Backdrop>` (navy + drifting glows + grain)
  - `<BlurWords>`
  - `<VerseCard>`
  - `<VerseGrid>`
  - `<Counter>`
  - `<Strata>`
  - `<DotField>`
  - `<Iris>`
  - `<MonoLabel>`
- **Sound:** subtle swells and ticks matched to the references. These would be synthesised with ffmpeg because sound libraries are not reachable from this network. There is no music and no recitation.
- **Output:** 1080×1920, 30 fps, H.264 MP4. QA covers stills of every transition and every Arabic appearance at 200% zoom.

## 10. Font licence note

KFGQPC Uthmanic Script Hafs is © King Fahd Glorious Qur'an Printing Complex and distributed under their free end-user licence. It is used unmodified, to display Qur'anic text.
