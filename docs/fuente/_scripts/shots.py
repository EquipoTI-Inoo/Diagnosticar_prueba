import asyncio,json,sys
from collections import Counter
from playwright.async_api import async_playwright
SITES={"inoo":"https://inoo.pe/","diagnosticar_actual":"https://diagnosticarperu.com/","autofact_cl":"https://www.autofact.cl/","carfax":"https://www.carfax.com/","lemonsquad":"https://www.lemonsquad.com/","kavak":"https://www.kavak.com/mx","koopa_inspecciona":"https://koopa.pe/inspecciona/","carfish":"https://carfishperu.com/","autocheck_pe":"https://autocheck.com.pe/"}
JS="""()=>{const c=new Map(),f=new Map(),bg=new Map();const add=(m,k)=>{if(k)m.set(k,(m.get(k)||0)+1)};
for(const el of document.querySelectorAll('body *')){const s=getComputedStyle(el);if(el.offsetWidth===0)continue;add(c,s.color);add(bg,s.backgroundColor);add(f,s.fontFamily.split(',')[0].replace(/["']/g,'').trim()+' '+s.fontWeight)}
const top=m=>[...m.entries()].sort((a,b)=>b[1]-a[1]).slice(0,12);
const h=[...document.querySelectorAll('h1,h2,h3')].slice(0,40).map(e=>{const s=getComputedStyle(e);return e.tagName+' | '+e.innerText.trim().slice(0,90)+' | '+s.fontFamily.split(',')[0]+' '+s.fontSize+' '+s.fontWeight});
const nav=[...document.querySelectorAll('header a, nav a')].slice(0,30).map(a=>a.innerText.trim()).filter(Boolean);
const sections=[...document.querySelectorAll('section, main > div')].length;
return {colors:top(c),bgs:top(bg),fonts:top(f),headings:h,nav:[...new Set(nav)],title:document.title,meta:(document.querySelector('meta[name=description]')||{}).content,sections,height:document.body.scrollHeight}}"""
async def main():
    out={}
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",headless=True)
        for name,url in SITES.items():
            for vp,(w,h) in {"desktop":(1440,900),"mobile":(390,844)}.items():
                ctx=await b.new_context(viewport={"width":w,"height":h},user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36" if vp=="desktop" else "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",locale="es-PE",device_scale_factor=1)
                pg=await ctx.new_page()
                try:
                    await pg.goto(url,wait_until="domcontentloaded",timeout=60000)
                    await pg.wait_for_timeout(4000)
                    # scroll to trigger lazy/animations
                    for y in range(0,12000,700):
                        await pg.evaluate(f"window.scrollTo(0,{y})"); await pg.wait_for_timeout(150)
                    await pg.evaluate("window.scrollTo(0,0)"); await pg.wait_for_timeout(800)
                    await pg.screenshot(path=f"referencias/{name}_{vp}_hero.png")
                    H=await pg.evaluate("document.body.scrollHeight")
                    await pg.set_viewport_size({"width":w,"height":min(H,7000) if vp=="desktop" else min(H,6000)})
                    await pg.wait_for_timeout(800)
                    await pg.screenshot(path=f"referencias/{name}_{vp}_full.jpg",type="jpeg",quality=60)
                    if vp=="desktop": out[name]={"url":url,**(await pg.evaluate(JS))}
                    print("ok",name,vp,H)
                except Exception as e: print("ERR",name,vp,str(e)[:200])
                await ctx.close()
        await b.close()
    json.dump(out,open("referencias/_estilos_extraidos.json","w"),ensure_ascii=False,indent=1)
asyncio.run(main())
