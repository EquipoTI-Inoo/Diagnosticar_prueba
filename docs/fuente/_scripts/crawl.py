import asyncio, re, json, sys
from urllib.parse import urljoin, urlparse, urldefrag
from playwright.async_api import async_playwright
BASE="https://diagnosticarperu.com"
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",headless=True)
        ctx=await b.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",viewport={"width":1440,"height":900},locale="es-PE")
        pg=await ctx.new_page()
        seeds=[BASE+"/"]
        # sitemaps
        for sm in ["/sitemap_index.xml"]:
            r=await pg.goto(BASE+sm,wait_until="domcontentloaded",timeout=60000)
            txt=await pg.content()
            open("raw/sitemap_index.xml.html","w").write(txt)
            subs=re.findall(r'https?://[^<"\s]+?\.xml',txt)
            for s in set(subs):
                try:
                    await pg.goto(s,wait_until="domcontentloaded",timeout=60000)
                    t=await pg.content()
                    open("raw/"+s.rsplit('/',1)[1]+".html","w").write(t)
                    seeds+= [u for u in re.findall(r'https?://(?:www\.)?diagnosticarperu\.com/[^<"\s]*',t) if not u.endswith('.xml') and not re.search(r'\.(jpg|jpeg|png|webp|gif|svg)$',u,re.I)]
                except Exception as e: print("sm err",s,e)
        print("seeds",len(set(seeds)))
        seen=set(); queue=list(dict.fromkeys(seeds)); out=[]
        while queue and len(seen)<120:
            u=urldefrag(queue.pop(0))[0].replace("://www.","://")
            if u in seen: continue
            seen.add(u)
            try:
                r=await pg.goto(u,wait_until="networkidle",timeout=60000)
                await pg.wait_for_timeout(1500)
                html=await pg.content()
                st=r.status if r else None
            except Exception as e:
                print("ERR",u,e); continue
            slug=(urlparse(u).path.strip('/').replace('/','__') or 'home')
            open(f"raw/{slug}.html","w").write(html)
            links=await pg.eval_on_selector_all("a[href]","els=>els.map(e=>e.href)")
            out.append({"url":u,"status":st,"file":f"raw/{slug}.html"})
            print(st,u)
            for l in links:
                l=urldefrag(l)[0].replace("://www.","://")
                pu=urlparse(l)
                if pu.netloc=="diagnosticarperu.com" and not re.search(r'\.(jpg|jpeg|png|webp|gif|svg|pdf|xml|zip)$',pu.path,re.I) and 'wp-admin' not in l and 'wp-login' not in l and '?' not in l and 'feed' not in l and l not in seen:
                    queue.append(l)
        json.dump(out,open("raw/_index.json","w"),indent=1)
        await b.close()
asyncio.run(main())
