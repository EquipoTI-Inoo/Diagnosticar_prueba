import asyncio,os
from playwright.async_api import async_playwright
async def main():
    urls=open('/tmp/assets_full.txt').read().split()
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",headless=True)
        ctx=await b.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36")
        pg=await ctx.new_page(); await pg.goto("https://diagnosticarperu.com/",wait_until="domcontentloaded")
        ok=0
        for u in urls:
            rel=u.split('/uploads/')[1]; path='assets/'+rel
            os.makedirs(os.path.dirname(path),exist_ok=True)
            try:
                r=await ctx.request.get(u,timeout=60000)
                if r.ok: open(path,'wb').write(await r.body()); ok+=1
                else: print(r.status,u)
            except Exception as e: print('ERR',u,e)
        print('ok',ok,len(urls))
        await b.close()
asyncio.run(main())
