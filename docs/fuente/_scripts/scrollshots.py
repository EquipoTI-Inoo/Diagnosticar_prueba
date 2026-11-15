import asyncio,sys
from playwright.async_api import async_playwright
from PIL import Image
name,url=sys.argv[1],sys.argv[2]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",headless=True)
        ctx=await b.new_context(viewport={"width":1440,"height":900},locale="es-PE",user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36")
        pg=await ctx.new_page(); await pg.goto(url,wait_until="domcontentloaded",timeout=60000); await pg.wait_for_timeout(3500)
        for sel in ["text=Rechazar","text=Aceptar todas","text=Accept","text=Aceptar"]:
            try: await pg.click(sel,timeout=1500); break
            except: pass
        H=await pg.evaluate("document.documentElement.scrollHeight"); files=[]
        y=0;i=0
        while y<H and i<16:
            await pg.evaluate(f"window.scrollTo(0,{y})"); await pg.wait_for_timeout(1300)
            f=f"/tmp/{name}_{i:02d}.png"; await pg.screenshot(path=f); files.append(f)
            y+=850;i+=1; H=await pg.evaluate("document.documentElement.scrollHeight")
        await b.close()
    ims=[Image.open(f).convert('RGB').resize((720,450)) for f in files]
    cols=2; rows=(len(ims)+1)//2
    sheet=Image.new('RGB',(cols*720,rows*450),'white')
    for k,im in enumerate(ims): sheet.paste(im,((k%cols)*720,(k//cols)*450))
    sheet.save(f"referencias/{name}_desktop_secciones.jpg",quality=70)
    for k,f in enumerate(files): Image.open(f).convert('RGB').save(f"referencias/{name}_sec{k:02d}.jpg",quality=72)
    print(name,len(files),H)
asyncio.run(main())
