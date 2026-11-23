const {chromium,devices}=require('playwright');const fs=require('fs');const B='http://localhost:8767';const OUT=process.argv[2]||require('path').join(__dirname,'salida','accesibilidad');require('fs').mkdirSync(OUT,{recursive:true});
const AXE=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const res={};
async function axe(p,name){ await p.addScriptTag({content:AXE}); const r=await p.evaluate(async()=>{const x=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa','best-practice']}});return x.violations.map(v=>({id:v.id,impact:v.impact,n:v.nodes.length,help:v.help,ej:v.nodes.slice(0,3).map(n=>n.target.join(' ')+' :: '+(n.failureSummary||'').split('\n').slice(1,2).join(''))}));}); res[name]=r; }
async function targets(p,name){ const t=await p.evaluate(()=>[...document.querySelectorAll('button,a[href],select,input,[role=radio],[role=switch]')].filter(e=>e.offsetParent).map(e=>{const r=e.getBoundingClientRect();return [Math.round(r.width),Math.round(r.height),(e.innerText||e.getAttribute('aria-label')||e.id||e.tagName).slice(0,30)];}).filter(x=>x[0]<24||x[1]<24)); res[name+'·targets<24px']=t.slice(0,12).concat([['total',t.length]]); }
(async()=>{const Q=await (await fetch(B+'/__qa')).json();const b=await chromium.launch();
 const mk=async(dev)=>{const c=await b.newContext(dev);await c.addInitScript(([k,u])=>{try{sessionStorage.setItem('sintonia_admin_key',k);localStorage.setItem('SINTONIA_BACKEND_URL',u);}catch(e){}},[Q.ADMIN,B+'/exec']);const p=await c.newPage();await p.route(/fonts\./,r=>r.abort());return p;};
 const p=await mk({viewport:{width:1300,height:950}});
 await p.goto(B+'/piloto/mago.html');await p.waitForSelector('#modoPrueba');await p.click('#modoPrueba');await p.waitForTimeout(400);
 const g=await p.$('[data-g]'); if(g){await g.click();await p.waitForTimeout(400);}
 await axe(p,'mago·grupo+siguiente'); await targets(p,'mago');
 for(const t of ['planes','mensajes','registro']){await p.click('[data-tab="'+t+'"]');await p.waitForTimeout(300);await axe(p,'mago·'+t);}
 // teclado: primeros 25 focos y si se ve el foco
 await p.click('body'); const foco=[]; for(let i=0;i<25;i++){await p.keyboard.press('Tab'); foco.push(await p.evaluate(()=>{const e=document.activeElement;const s=getComputedStyle(e);return (e.innerText||e.getAttribute('aria-label')||e.id||e.tagName).slice(0,25)+(s.outlineStyle==='none'&&s.boxShadow==='none'?' [SIN FOCO VISIBLE]':'');}));}
 res['mago·orden de tabulación']=foco;
 const m=await mk(devices['iPhone 13']);
 for(const [n,u] of [['registro','/piloto/?exp=E1'],['unirse','/piloto/unirse.html?inv=XXXX'],['aviso','/piloto/aviso.html'],['panel','/piloto/panel.html']]){await m.goto(B+u);await m.waitForTimeout(1500);await axe(m,n);await targets(m,n);}
 const pm=await mk(devices['iPhone 13']); await pm.goto(B+'/piloto/mago.html'); await pm.waitForTimeout(1500); await axe(pm,'mago·celular'); await targets(pm,'mago·celular');
 fs.writeFileSync(OUT+'/audit.json',JSON.stringify(res,null,1)); await b.close();
 for(const [k,v] of Object.entries(res)){ console.log('\n## '+k); if(Array.isArray(v)&&v[0]&&v[0].id) v.forEach(x=>console.log(' ',x.impact,x.id,'('+x.n+')',x.help,'\n    ',x.ej.join('\n     '))); else console.log(' ',JSON.stringify(v)); }
})();
