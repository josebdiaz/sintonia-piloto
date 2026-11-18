// QA del código secreto del home: deslizamientos reales (CDP) en iPhone 13 y Pixel 7, y teclado en escritorio.
// Uso: python3 -m http.server 8768 (en la raíz del repo) y luego node tools/qa-home.js http://localhost:8768 <carpeta_capturas>
const {chromium,devices}=require('playwright');const B=process.argv[2]||'http://localhost:8768';const OUT=process.argv[3]||'.';
const log=[];const ok=(n,c,d)=>log.push((c?'OK   ':'FALLA')+' · '+n+(c?'':' · '+d));
async function swipe(cdp,x0,y0,x1,y1){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x0,y:y0}]});
 for(let k=1;k<=6;k++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x0+(x1-x0)*k/6,y:y0+(y1-y0)*k/6}]});}
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
(async()=>{const b=await chromium.launch();
 for(const name of ['iPhone 13','Pixel 7']){
  const c=await b.newContext(devices[name]);const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/fonts\./,r=>r.abort());
  await p.goto(B+'/index.html');await p.waitForTimeout(600);const cdp=await c.newCDPSession(p);
  const W=p.viewportSize().width,H=p.viewportSize().height,cx=W/2,cy=H/2;
  ok(name+': modo código activo (la portada cabe)',await p.evaluate(()=>document.documentElement.classList.contains('codigo')),'');
  const mv={up:[cx,cy+90,cx,cy-90],down:[cx,cy-90,cx,cy+90],left:[cx+90,cy,cx-90,cy],right:[cx-90,cy,cx+90,cy]};
  // desde el borde no cuenta
  await swipe(cdp,8,cy,150,cy); ok(name+': un deslizamiento desde el borde no cuenta',(await p.$$eval('#keys i.on',x=>x.length))===0,'');
  for(const d of ['up','up','down','down','left','right','left']){await swipe(cdp,...mv[d]);await p.waitForTimeout(350);}
  ok(name+': 7 de 8 pasos encienden 7 puntos',(await p.$$eval('#keys i.on',x=>x.length))===7,await p.$$eval('#keys i.on',x=>x.length));
  ok(name+': la página no se desplazó',await p.evaluate(()=>scrollY)===0,'');
  await swipe(cdp,...mv.right);await p.waitForTimeout(1300);
  ok(name+': el código abre el menú',await p.evaluate(()=>!document.getElementById('menu').hidden&&document.getElementById('menu').classList.contains('open')),'');
  await p.screenshot({path:OUT+'/home-menu-'+name.replace(/ /g,'')+'.png'});
  ok(name+': el menú se desplaza (no queda bloqueado)',await p.evaluate(()=>{const m=document.getElementById('menu');return m.scrollHeight>m.clientHeight&&!document.documentElement.classList.contains('codigo');}),'');
  ok(name+': muestra la versión del frontend',/frontend v\d/.test(await p.$eval('#ver',e=>e.textContent)),await p.$eval('#ver',e=>e.textContent));
  // lento: 3 s entre pasos sigue valiendo
  await p.click('#close');await p.waitForTimeout(1200);
  for(const d of ['up','up','down']){await swipe(cdp,...mv[d]);await p.waitForTimeout(3000);}
  ok(name+': con 3 s entre deslizamientos no se reinicia',(await p.$$eval('#keys i.on',x=>x.length))===3,await p.$$eval('#keys i.on',x=>x.length));
  ok(name+': sin errores',!errs.length,errs.join('|'));
  await c.close();}
 const c=await b.newContext({viewport:{width:1300,height:900}});const p=await c.newPage();await p.goto(B+'/index.html');await p.waitForTimeout(400);
 for(const k of ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight'])await p.keyboard.press(k);await p.waitForTimeout(1200);
 ok('Escritorio: el teclado abre el menú',await p.evaluate(()=>!document.getElementById('menu').hidden),'');
 await p.keyboard.press('Escape');await p.waitForTimeout(1200);ok('Escritorio: Esc cierra',await p.evaluate(()=>document.getElementById('menu').hidden),'');
 await b.close();console.log(log.join('\n'));console.log(log.filter(x=>x.startsWith('OK')).length+' OK · '+log.filter(x=>!x.startsWith('OK')).length+' fallas');})();
