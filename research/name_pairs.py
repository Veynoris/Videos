"""Scan every adjacent pair of divine names in the Qur'an and report their order.

Text: KFGQPC Hafs (quran-json@3.1.2). Diacritics and Qur'anic marks are stripped,
alif forms unified, then each token is reduced to a name stem by removing a leading
'و'/'ال'/'وال' and trailing accusative/tanwin alif ('ا'). Two names count as a pair
when they are consecutive tokens in the same verse.
Usage: python3 name_pairs.py path/to/quran.json
"""
import collections
import json
import re
import sys

NAMES = ["غفور", "رحيم", "عزيز", "حكيم", "عليم", "سميع", "بصير", "خبير", "لطيف", "رءوف", "تواب", "حليم", "عفو",
         "ودود", "قدير", "شكور", "كريم", "غني", "حميد", "واسع", "مجيد", "قوي", "علي", "عظيم", "كبير", "رحمن", "حي",
         "قيوم", "شهيد", "حفيظ", "رقيب", "وهاب", "قهار", "واحد", "توب", "متعال", "خلاق", "فتاح", "ولي", "نصير", "مولى"]
DIAC = re.compile(r"[ؐ-ًؚ-ٰٟۖ-ۭـ]")


def norm(s):
    return re.sub("[ٱأإآ]", "ا", DIAC.sub("", s)).replace("ى", "ي")


def stem(tok):
    for p in ("وال", "ال", "و"):
        if tok.startswith(p) and tok[len(p):] in NAMES or (tok.startswith(p) and tok[len(p):].rstrip("ا") in NAMES):
            tok = tok[len(p):]
            break
    t = tok.rstrip("ا") if tok not in NAMES else tok
    return t if t in NAMES else None


q = json.load(open(sys.argv[1], encoding="utf-8"))
pairs = collections.defaultdict(list)
for c in q:
    for v in c["verses"]:
        toks = norm(v["text"]).split()
        for a, b in zip(toks, toks[1:]):
            sa, sb = stem(a), stem(b)
            if sa and sb and sa != sb:
                pairs[(sa, sb)].append(f"{c['id']}:{v['id']}")

seen = set()
rows = []
for (a, b), refs in pairs.items():
    key = tuple(sorted((a, b)))
    if key in seen:
        continue
    seen.add(key)
    fwd, rev = pairs.get((a, b), []), pairs.get((b, a), [])
    if len(fwd) < len(rev):
        a, b, fwd, rev = b, a, rev, fwd
    rows.append((len(fwd) + len(rev), a, b, fwd, rev))
for total, a, b, fwd, rev in sorted(rows, reverse=True):
    if total >= 4:
        print(f"{a} {b}: {len(fwd)}  |  {b} {a}: {len(rev)}  {rev if len(rev) <= 8 else ''}")
