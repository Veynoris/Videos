# Quran Decoding — Episode 05: "Three Shirts" (Sūrat Yūsuf)

**Deliverables:**
- `video/out/quran-decoding-ep05-three-shirts.mp4` (composition `ThreeShirts` + `scripts/sound_ep05.py`)
- cover: `video/out/ep05-reel-cover.png` (`Ep05Cover`)
- caption: `research/EP05_CAPTION.md`

Runtime is 62.7 s (1880 frames). It follows the 125k reel's formula: the claim is on screen from frame 0, about 6 words per screen, one thread, and a seamless loop.

## Claims and evidence

| On screen | Evidence | Status |
|---|---|---|
| قَمِيص appears **six times in the Qur'an, all in one story** | Scan of the KFGQPC Hafs text (quran-json@3.1.2): 12:18, 25, 26, 27, 28, 93. No other occurrence | ✅ reproducible |
| "They brought his shirt — with false blood." | 12:18 «وَجَآءُو عَلَىٰ قَمِيصِهِۦ بِدَمٖ كَذِبٖ» | Qur'an |
| "A wolf ate him." | 12:17 «فَأَكَلَهُ ٱلذِّئۡبُ» | Qur'an |
| "The shirt was not torn." Labelled as tafsir: *Ibn Kathīr on 12:18 · from Ibn ʿAbbās* | Ibn Kathīr reports that Yaʿqūb examined the shirt, found no tear, and said he had never seen a wolf so gentle it ate his son without tearing his shirt. | ⚠ Found via search extracts (quran-tafsir.net). Confirm the wording in print |
| Yaʿqūb: "Rather, your souls have enticed you to something." | 12:18 | Qur'an (Sahih Intl.) |
| "Years later, in Egypt — a second shirt." "They raced to the door. The shirt was torn." | 12:22 (he reached maturity in the household); 12:25 | Qur'an |
| The witness's test: torn from the front → she is truthful; from the back → he is truthful | 12:26–27 | Qur'an |
| Verdict «ٱلصَّـٰدِقِينَ» TRUTHFUL | 12:27 «وَهُوَ مِنَ ٱلصَّـٰدِقِينَ», confirmed in 12:28 | Qur'an |
| "His father had wept until his eyes turned white." | 12:84 «وَٱبۡيَضَّتۡ عَيۡنَاهُ مِنَ ٱلۡحُزۡنِ» | Qur'an |
| "Take this, my shirt…" | 12:93 | Qur'an |
| "As the caravan left Egypt — 'I find the scent of Yūsuf.'" | 12:94 | Qur'an |
| "It was cast over his face — He could see again." Verdict «بَصِيرٗا» SEEING | 12:96 «فَٱرۡتَدَّ بَصِيرٗا» | Qur'an |
| «فَصَبۡرٞ جَمِيلٞ» "Beautiful patience". "The same words — 12:18 and 12:83." "Yaʿqūb, at both losses." | 12:18 and 12:83 open with the same words «بَلۡ سَوَّلَتۡ لَكُمۡ أَنفُسُكُمۡ أَمۡرٗاۖ فَصَبۡرٞ جَمِيلٞ». The first follows the loss of Yūsuf; the second follows the loss of his brother (12:80–83) | Qur'an |
| "One shirt brought the grief. Another brought the cure." | 12:18 / 12:96 | Summary wording, no added claim |

**Choices made to keep the wording strict:**
- The verdict seals use the Qur'an's own words (كَذِب · ٱلصَّـٰدِقِين · بَصِيرًا), not invented labels.
- The "not torn" detail is the only tafsir claim. It is labelled as tafsir with its source.
- The video does not say the three shirts are the same garment, and does not give years or ages.
- No people are depicted: only garments, light and text.

## Script

| # | Beat | On screen |
|---|---|---|
| 1 | Hook | `ONE WORD` · «قَمِيص» · "Six times in the Qur'an." (frame 0) → "All in one story." → three shirts → "Three shirts. *Three verdicts.*" |
| 2 | Exhibit I · 12:18 | The stain spreads · 12:18 Arabic + "They brought his shirt — with false blood." → "'A wolf ate him.'" → a brass loupe scans the shirt: "The scholars of tafsir noticed one detail." → "The shirt *was not torn.*" → the seal press stamps «كَذِب» FALSE → "Yaʿqūb said: 'Rather, your souls have enticed you to something.'" |
| 3 | Exhibit II · 12:25–28 | "Years later, in Egypt — a second shirt." → "They raced to the door. The shirt was torn." → the shirt splits into the witness's test (front / back) → the loupe reveals the tear on the back → «ٱلصَّـٰدِقِينَ» TRUTHFUL |
| 4 | Exhibit III · 12:93–96 | "His father had wept until his eyes turned white." → «ٱذۡهَبُواْ بِقَمِيصِي هَٰذَا» → golden scent drifts: "'I find the scent of Yūsuf.'" → the screen hazes, "It was cast over his face —", then clears: "He could *see again.*" → «بَصِيرٗا» SEEING |
| 5 | Close + loop | Three shirts, three verdicts · "One shirt brought the grief. Another brought the cure." → «فَصَبۡرٞ جَمِيلٞ» "Beautiful patience." "The same words — 12:18 and 12:83." → dissolves to frame 0 |

## Visual language

- The navy background is kept.
- Woven-linen robes (SVG weave and drape, gently swaying).
- A brass forensic loupe with a knurled rim that magnifies what it passes over.
- A brass ram that presses each verdict seal, with an impact shake and a shockwave.
- Brass exhibit plaques.
- Golden scent motes, and a haze that clears when sight returns.

## Sound (halal policy unchanged)

`scripts/sound_ep05.py`:
- cloth rustle;
- the loupe's ratchet;
- the seal press (reversed swell, latch clack, stone thud);
- a fabric tear (filtered noise);
- wind and sand for the scent;
- a breath-like swell when sight returns.

No music, instruments, bells, melodies or recitation.
