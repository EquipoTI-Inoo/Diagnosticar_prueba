import json,re,os,glob
from bs4 import BeautifulSoup
from urllib.parse import urljoin
pages=[]
BLOCK={'p','h1','h2','h3','h4','h5','h6','li','td','th','blockquote','figcaption','button','label','summary','dt','dd'}
def clean(s): return re.sub(r'\s+',' ',s).strip()
for f in sorted(glob.glob("raw/*.html")):
    if 'sitemap' in f: continue
    html=open(f,encoding='utf-8',errors='ignore').read()
    s=BeautifulSoup(html,'html.parser')
    slug=os.path.basename(f)[:-5]
    can=s.find('link',rel='canonical'); 
    og=s.find('meta',property='og:url')
    url=(og['content'] if og else None) or (can['href'] if can else None)
    meta=lambda n:(s.find('meta',attrs={'name':n}) or s.find('meta',attrs={'property':n}) or {}).get('content') if (s.find('meta',attrs={'name':n}) or s.find('meta',attrs={'property':n})) else None
    jsonld=[]
    for sc in s.find_all('script',type='application/ld+json'):
        try: jsonld.append(json.loads(sc.string))
        except: pass
    links=[a.get('href') for a in s.find_all('a',href=True)]
    tel=sorted({l for l in links if l.startswith('tel:')})
    wa=sorted({l for l in links if 'wa.me' in l or 'whatsapp' in l})
    mail=sorted({l for l in links if l.startswith('mailto:')})
    social=sorted({l for l in links if re.search(r'facebook|instagram|tiktok|youtube|linkedin|twitter|x\.com',l)})
    imgs=[]
    for im in s.find_all('img'):
        src=im.get('data-src') or im.get('src') or ''
        if src.startswith('data:'): src=im.get('data-lazy-src') or ''
        if src: imgs.append({'src':urljoin('https://diagnosticarperu.com/',src),'alt':im.get('alt','')})
    for t in s(['script','style','noscript','svg','iframe']): t.decompose()
    hdr=[clean(h.get_text(' ')) for h in s.find_all(['h1','h2','h3','h4'])]
    body=s.body or s
    # remove header/footer elementor templates
    for sel in ['header','footer','[data-elementor-type=header]','[data-elementor-type=footer]','.elementor-location-header','.elementor-location-footer','#wpadminbar']:
        for t in body.select(sel): t.decompose()
    blocks=[]; last=None
    for el in body.find_all(True):
        if el.name in BLOCK or (el.name in('div','span','a') and not el.find(True) and el.get_text(strip=True)):
            if el.name not in BLOCK and el.find_parent(list(BLOCK)): continue
            if el.find_parent(list(BLOCK)) and el.name in BLOCK and el.name not in('li',): 
                pass
            t=clean(el.get_text(' '))
            if not t or t==last: continue
            pre={'h1':'# ','h2':'## ','h3':'### ','h4':'#### ','h5':'##### ','h6':'###### ','li':'- '}.get(el.name,'')
            blocks.append(pre+t); last=t
    # dedupe repeated nested lines
    seen=set(); out=[]
    for b in blocks:
        if b in seen: continue
        seen.add(b); out.append(b)
    pages.append({'slug':slug,'url':url,'title':clean(s.title.get_text()) if s.title else '', 'meta_description':meta('description'),
      'og_title':meta('og:title'),'og_description':meta('og:description'),'og_image':meta('og:image'),'canonical':can['href'] if can else None,
      'robots':meta('robots'),'headings':hdr,'text_blocks':out,'tel':tel,'whatsapp':wa,'email':mail,'social':social,'images':imgs,'jsonld':jsonld,'word_count':sum(len(b.split()) for b in out)})
json.dump(pages,open('_pages_raw.json','w'),ensure_ascii=False,indent=1)
for p in pages: print(p['word_count'],p['slug'],'|',p['title'][:70],'|',p['robots'])
