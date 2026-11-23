// QA del código secreto del home: deslizamientos reales (CDP) sobre el glifo en iPhone 13 y Pixel 7, y teclado en escritorio.
// Desde la landing 2.9.0 la página se desplaza: solo los trazos que empiezan en el glifo cuentan.
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
  const g=await p.$eval('#glifo',e=>{const r=e.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2,r.width];});const cx=g[0],cy=g[1],d=Math.min(60,g[2]/2-8);
  const mv={up:[cx,cy+d,cx,cy-d],down:[cx,cy-d,cx,cy+d],left:[cx+d,cy,cx-d,cy],right:[cx-d,cy,cx+d,cy]};
  // fuera del glifo no cuenta (es el desplazamiento normal de la landing)
  const W=p.viewportSize().width,H=p.viewportSize().height;
  await swipe(cdp,W/2,H-60,W/2,H-260);await p.waitForTimeout(2000);   // el desplazamiento por inercia termina antes de volver arriba
  ok(name+': un deslizamiento fuera del glifo no cuenta y desplaza la página',(await p.$$eval('#keys i.on',x=>x.length))===0&&await p.evaluate(()=>scrollY>0),await p.evaluate(()=>scrollY));
  await p.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await p.waitForTimeout(500);
  for(const d of ['up','up','down','down','left','right','left']){await swipe(cdp,...mv[d]);await p.waitForTimeout(350);}
  ok(name+': 7 de 8 pasos encienden 7 puntos',(await p.$$eval('#keys i.on',x=>x.length))===7,await p.$$eval('#keys i.on',x=>x.length));
  ok(name+': la página no se desplazó',await p.evaluate(()=>scrollY)===0,'');
  await swipe(cdp,...mv.right);await p.waitForTimeout(1300);
  ok(name+': el código abre el menú',await p.evaluate(()=>!document.getElementById('menu').hidden&&document.getElementById('menu').classList.contains('open')),'');
  await p.screenshot({path:OUT+'/home-menu-'+name.replace(/ /g,'')+'.png'});
  ok(name+': el menú se desplaza (no queda bloqueado)',await p.evaluate(()=>{const m=document.getElementById('menu');return m.scrollHeight>m.clientHeight;}),'');
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
