"""Count the order of 'heaven(s)' and 'earth' when the Qur'an pairs them.

Text: KFGQPC Hafs 'an 'Asim (quran-json@3.1.2, sourced from QuranEnc).
Method:
  1. Strip all diacritics/Qur'anic marks; unify alif forms (ٱ أ إ آ -> ا).
  2. Tokenise on whitespace.
  3. A token is HEAVEN if, after removing one optional proclitic cluster
     (و ف ب ل ك + ال / لل), its stem is سماء or سماوات (incl. defective سموت).
     A token is EARTH if its stem is ارض.
  4. A PAIR is a HEAVEN token and an EARTH token in the same verse separated
     by at most MAX_GAP tokens, with no other HEAVEN/EARTH token between them.
     Each token is used in at most one pair (greedy, left to right).
  5. Order = which comes first in the pair.
Usage: python3 heaven_earth_order.py path/to/quran.json [MAX_GAP]
"""
import json, re, sys

DIAC = re.compile(r'[ؐ-ًؚ-ٰٟۖ-ۭ࣓-ࣿـ]')
def norm(s):
    s = DIAC.sub('', s)
    return re.sub('[ٱأإآ]', 'ا', s).replace('ى', 'ي')

PREFIX = re.compile(r'^(?:[وف]?(?:[بلك])?)(?:ال|ل(?=ل))?')
def kind(tok):
    for p in ('وال', 'فال', 'بال', 'كال', 'ال', 'ول', 'فل', 'لل', 'و', 'ف', 'ب', 'ل', 'ك', ''):
        if tok.startswith(p):
            stem = tok[len(p):]
            if stem in ('سماء', 'سماوات', 'سموات', 'سماوت', 'سموت'):
                return 'H'
            if stem in ('ارض',):
                return 'E'
    return None

def main(path, max_gap=4):
    q = json.load(open(path, encoding='utf-8'))
    pairs = []
    for ch in q:
        for v in ch['verses']:
            toks = norm(v['text']).split()
            marks = [(i, kind(t)) for i, t in enumerate(toks) if kind(t)]
            j = 0
            while j < len(marks) - 1:
                (i1, k1), (i2, k2) = marks[j], marks[j + 1]
                if k1 != k2 and i2 - i1 <= max_gap:
                    pairs.append((ch['id'], v['id'], k1 + k2, ' '.join(toks[i1:i2 + 1])))
                    j += 2
                else:
                    j += 1
    he = [p for p in pairs if p[2] == 'HE']
    eh = [p for p in pairs if p[2] == 'EH']
    print(f'MAX_GAP={max_gap}  pairs={len(pairs)}  heaven-first={len(he)}  earth-first={len(eh)}')
    for p in eh:
        print(f'  EARTH FIRST {p[0]}:{p[1]}  {p[3]}')
    return pairs

if __name__ == '__main__':
    main(sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 4)
