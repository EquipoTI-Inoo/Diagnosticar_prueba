import asyncio,re,sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",headless=True)
        ctx=await b.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",locale="es-PE")
        pg=await ctx.new_page()
        await pg.goto("https://diagnosticarperu.com/",wait_until="domcontentloaded")
        urls=set()
        for sm in ["sitemap_index.xml","page-sitemap.xml","post-sitemap.xml","category-sitemap.xml","author-sitemap.xml"]:
            r=await ctx.request.get("https://diagnosticarperu.com/"+sm)
            t=await r.text(); print(sm,r.status,len(t))
            open("raw/"+sm,"w").write(t)
            urls|=set(re.findall(r'<loc>([^<]+)</loc>',t))
        open("raw/_sitemap_urls.txt","w").write("\n".join(sorted(urls)))
        for u in sys.argv[1:]:
            try:
                r=await pg.goto(u,wait_until="domcontentloaded",timeout=90000); await pg.wait_for_timeout(3000)
                slug=u.split("diagnosticarperu.com/")[1].strip('/').replace('/','__') or 'home'
                open(f"raw/{slug}.html","w").write(await pg.content()); print(r.status,u)
            except Exception as e: print("ERR",u,e)
        await b.close()
asyncio.run(main())
