const {chromium,devices}=require('playwright');const B='http://localhost:8767';
const api=async(d)=>(await fetch(B+'/exec',{method:'POST',body:JSON.stringify(d)})).json();const qa=async()=>(await fetch(B+'/__qa')).json();
const cons={autoriza_datos:true,optin_whatsapp:true,mayor_18:true,consent_investigacion:true};const out=[];const L=(...a)=>out.push(a.join(' · '));
(async()=>{const K=(await qa()).ADMIN;const b=await chromium.launch();const errs=[];
 // inscripción entre semana: cuántos botones de fecha
 const x=await b.newContext(devices['iPhone 13']);await x.addInitScript(u=>{try{localStorage.setItem('SINTONIA_BACKEND_URL',u);}catch(e){}},B+'/exec');const p=await x.newPage();await p.route(/fonts\./,r=>r.abort());
 await p.goto(B+'/piloto/index.html?exp=E1&modo=prueba'); await p.click('#dias label:has-text("Entre semana")'); await p.click('#dias label:has-text("Viernes")');
 L('entre semana + viernes → botones de fecha',(await p.$$('#fechas input')).length);
 for(let i=0;i<5;i++) await p.click('#fechas label >> nth='+i); L('marcadas tras 5 clics',(await p.$$('#fechas input:checked')).length, await p.$eval('#toast',e=>e.innerText).catch(()=>''));
 // plan para HOY en modo prueba: plazo
 const o=await api(Object.assign({action:'registrar',experimento:'E1',modo:'prueba',tipo_grupo:'pareja',nombre_grupo:'Hoy mismo',n_invitados:2,disponibilidad:'dias: sabado · franjas: noche',nombre_pila:'Ro',whatsapp:'+573001000701'},cons));
 await api(Object.assign({action:'registrar',codigo_invitacion:o.codigo_invitacion,nombre_pila:'Sa',whatsapp:'+573001000702'},cons));
 await api({action:'cerrar_reclutamiento',key:K,grupo_id:o.grupo_id}); const pl=await api({action:'crear_plan',key:K,grupo_id:o.grupo_id});
 await api({action:'proponer_ia',key:K,plan_id:pl.plan_id,restricciones:'x'}); await api({action:'publicar_plan',key:K,plan_id:pl.plan_id});
 const h=new Date(Date.now()+90*6e4); const hs=h.getFullYear()+'-'+String(h.getMonth()+1).padStart(2,'0')+'-'+String(h.getDate()).padStart(2,'0')+' '+String(h.getHours()).padStart(2,'0')+':'+String(h.getMinutes()).padStart(2,'0');
 L('cerrar plan en 90 min',JSON.stringify(await api({action:'cerrar_plan',key:K,plan_id:pl.plan_id,elegida:0,hora_encuentro:hs,hora_salida:''})).slice(0,80));
 const c=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});await c.addInitScript(([k,u])=>{try{sessionStorage.setItem('sintonia_admin_key',k);localStorage.setItem('SINTONIA_BACKEND_URL',u);}catch(e){}},[K,B+'/exec']);
 const m=await c.newPage();m.on('pageerror',e=>errs.push(e.message));await m.route(/fonts\./,r=>r.abort());
 await m.goto(B+'/piloto/mago.html');await m.waitForSelector('#modoPrueba');await m.click('#modoPrueba');await m.waitForTimeout(400);
 await m.click('#glist [data-g="'+o.grupo_id+'"]');await m.waitForTimeout(300);
 await m.evaluate(()=>document.querySelectorAll('#siguiente details').forEach(d=>d.open=true));
 const t=await m.$$eval('#siguiente textarea',a=>a.map(x=>x.value).join(' || '));L('plazo con plan en 90 min',(t.match(/marquen si van[^|]*/)||['(sin frase)'])[0]); L('¿hay /hoy bloqueado por plazo?',await m.$eval('#siguiente',e=>/tiene hasta el/.test(e.innerText)));
 L('consola 390: scroll horizontal',await m.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth));
 L('consola 390: altura hasta el botón principal',await m.$eval('#siguiente .acciones, #siguiente .c-cola',e=>Math.round(e.getBoundingClientRect().top+scrollY)).catch(()=>'?'));
 await m.screenshot({path:require('path').join(__dirname,'salida','casos-borde-consola-390.png')});
 // revocar a una persona del grupo
 const vm=await (await fetch(B+'/exec?view=mago&key='+K)).json(); const g=vm.grupos.find(z=>z.grupo_id===o.grupo_id);
 const rv=await api({action:'revocar',key:K,pid:g.miembros[1].pid}); const vm2=await (await fetch(B+'/exec?view=mago&key='+K)).json();
 L('revocar → estado del grupo',JSON.stringify(rv).slice(0,80),vm2.grupos.find(z=>z.grupo_id===o.grupo_id).estado);
 // panel
 const pa=await b.newContext();await pa.addInitScript(([k,u])=>{try{sessionStorage.setItem('sintonia_admin_key',k);localStorage.setItem('SINTONIA_BACKEND_URL',u);}catch(e){}},[K,B+'/exec']);
 const pp=await pa.newPage();pp.on('pageerror',e=>errs.push('panel '+e.message));await pp.goto(B+'/piloto/panel.html');await pp.waitForTimeout(1500);
 L('panel (solo piloto)',(await pp.$eval('body',e=>e.innerText)).replace(/\s+/g,' ').slice(0,300));
 L('errores JS',errs.join(' | ')||'ninguno');
 await b.close(); console.log(out.join('\n'));
})();
