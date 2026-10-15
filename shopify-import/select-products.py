import json,re,csv,sys,itertools,collections
S=sys.argv[1]
items=json.load(open(S+'/matched.json')); ex=json.load(open(S+'/existing.json'))
def norm(t): return re.sub(r'[^a-z0-9]','',re.sub(r'\b\d+(\.\d+)?\s*(g|gm|ml|p|x)\b','',t.lower().replace('&','and')))
RULES=[  # first match wins
 ('health-beauty', r'\bedp\b|\bedt\b'),
 ('noodles', r'noodle|ramen|buldak|samyang|\bkoka\b|noody|nongshim'),
 ('beverages', r'drink|gatorade|\bsting\b|redbull|sprite|\bcoke\b|pepsi|cappy|shezan|\brani\b|boba|\bokf\b|italiano'),
 ('coffee-tea', r'davidoff rich|coffee'),
 ('grocery', r'sauce|el sabor|spread|tajin classic|cereal|granola|mouth freshner|^nutella$'),
 ('cookies-biscuits', r'\britz\b|b ready'),
 ('chips-snacks', r'chips|nachos|nimco|pringles|\blays\b|takis|miaow|kababjees|popcorn|kracks|dal moth|crackers'),
 ('chewing-gums', r'\bgum\b|gumball|gum ball|wrigley|trident|ice breakers|mentos|big babol|\bpolo\b'),
 ('chocolate-boxes', r'raffaello|ferrero'),
 ('chocolate-pouches', r'(chocolate pouch|dairy milk.*pouch|miniatures|minis pouch|kisses|m&m)'),
 ('chocolate-bars', r'chocolate|kitkat|dairy ?milk|toblerone|lindt|galaxy|snickers|twix|\bmars\b|bounty|kinder|mr ?beast|feastables|hersheys|\bphd\b'),
 ('cookies-biscuits', r'biscuit|biscout|cookie|wafer|biscoff|oreo|digestive|lady fingers|waffle|pound cake|hoppers|creams|pipers|tiffany'),
 ('candies-jellies', r'.'),
]
def cat(t):
    for c,p in RULES:
        if re.search(p,t.lower()): return c
import difflib,urllib.parse
# scraped CSV image links are unreliable: keep only files whose name resembles the title, or eyeballed ones
VERIFIED={'1734336229-v2.jpeg','1734075746-b8_11zon.jpeg','1734165894-B1.jpeg','1732195974-Pot.jpeg','1734330076-A.jpeg'}
def fnorm(f): return norm(re.sub(r'^\d+-','',urllib.parse.unquote(f).rsplit('.',1)[0]).replace('_11zon',''))
seen={norm(e['title']) for e in ex}; pool=collections.defaultdict(list)
for it in items:
    n=norm(it['title'])
    if it['file'] not in VERIFIED and difflib.SequenceMatcher(None,fnorm(it['file']),n).ratio()<0.75: continue
    if n in seen: continue
    seen.add(n); it['category']=cat(it['title']); pool[it['category']].append(it)
# interleave brands within each category, then round-robin categories
def brandmix(lst):
    g=collections.defaultdict(list)
    for x in lst: g[x['title'].split()[0].lower()].append(x)
    return [x for grp in itertools.zip_longest(*g.values()) for x in grp if x]
queues={c:brandmix(v) for c,v in pool.items()}
pick=[]
while len(pick)<100 and any(queues.values()):
    for c in sorted(queues):
        if queues[c] and len(pick)<100: pick.append(queues[c].pop(0))
print({c:len(v) for c,v in pool.items()}, 'unique new:',sum(map(len,pool.values())))
print(collections.Counter(p['category'] for p in pick))
w=csv.DictWriter(open('shopify-import/products-batch-1.csv','w',newline='',encoding='utf-8'),['title','price','weight','category','file'])
w.writeheader(); w.writerows(sorted(pick,key=lambda p:(p['category'],p['title'])))
for p in sorted(pick,key=lambda p:(p['category'],p['title'])): print(p['category'],'|',p['title'],'|',p['price'])
