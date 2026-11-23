// Capturas reales de la consola 2.8.1 para el deck del monitor (datos ficticios del simulador)
const {chromium}=require('playwright');const B='http://localhost:8767',OUT=process.argv[2]||require('path').join(__dirname,'..','..','docs','deck-onboarding-monitor');require('fs').mkdirSync(OUT,{recursive:true});
const api=async(d)=>(await fetch(B+'/exec',{method:'POST',body:JSON.stringify(d)})).json();const qa=async()=>(await fetch(B+'/__qa')).json();
const cons={autoriza_datos:true,optin_whatsapp:true,mayor_18:true,consent_investigacion:true};
(async()=>{const K=(await qa()).ADMIN;
 const F=(()=>{const d=new Date();d.setHours(12,0,0,0);const o=[];for(let k=1;k<15&&o.length<2;k++){const x=new Date(d.getTime()+k*864e5);if(x.getDay()===6)o.push(x);}return o.map(x=>x.getFullYear()+'/'+String(x.getMonth()+1).padStart(2,'0')+'/'+String(x.getDate()).padStart(2,'0'));})();
 // grupo piloto reclutando (para el recordatorio)
 const a=await api(Object.assign({action:'registrar',experimento:'E1',modo:'piloto',tipo_grupo:'amigos',nombre_grupo:'Las del cole',n_invitados:4,disponibilidad:'dias: sabado · franjas: tarde · fechas: '+F.join(', '),nombre_pila:'Paula',whatsapp:'+573001000501',preferencias:'Algo tranqui en San Antonio, máximo 50 mil por persona'},cons));
 await api(Object.assign({action:'registrar',codigo_invitacion:a.codigo_invitacion,nombre_pila:'Kate',whatsapp:'+573001000502'},cons));
 // grupo de prueba completo (para el resto del recorrido)
 const o=await api(Object.assign({action:'registrar',experimento:'E1',modo:'prueba',tipo_grupo:'amigos',nombre_grupo:'Parche del sábado',n_invitados:3,disponibilidad:'dias: sabado · franjas: tarde · fechas: '+F.join(', '),nombre_pila:'Laura',whatsapp:'+573001000601',preferencias:'Algo tranqui en San Antonio, máximo 50 mil por persona'},cons));
 for(const [n,w] of [['Andrés','+573001000602'],['Sofía','+573001000603']]) await api(Object.assign({action:'registrar',codigo_invitacion:o.codigo_invitacion,nombre_pila:n,whatsapp:w},cons));
 const b=await chromium.launch();const c=await b.newContext({viewport:{width:1366,height:880},deviceScaleFactor:2});
 await c.addInitScript(([k,u])=>{try{sessionStorage.setItem('sintonia_admin_key',k);localStorage.setItem('SINTONIA_BACKEND_URL',u);localStorage.setItem('sintonia_mago_nombre','Juan José');}catch(e){}},[K,B+'/exec']);
 const m=await c.newPage();await m.route(/fonts\.g/,r=>r.continue());const w=ms=>m.waitForTimeout(ms);
 const shot=async(name,sel)=>{await m.addStyleTag({content:'.c-bar,.mago-tira,.c-izq,.c-tabbar{position:static!important}.toast,#toast{display:none!important}'});await w(150);const el=await m.$(sel);await el.screenshot({path:OUT+'/'+name+'.jpg',type:'jpeg',quality:80});};
 const hoja=async()=>{if(await m.$('#hoja[open]')){await m.click('#hojaSi');await w(700);}};
 const abrir=async()=>m.evaluate(()=>document.querySelectorAll('#siguiente details.c-cola-i').forEach((d,i)=>{d.open=d.dataset.st==='siguiente';}));
 await m.goto(B+'/piloto/mago.html');await m.waitForSelector('#glist');await w(800);
 await m.click('#magoIn');await w(500);await m.click('#glist [data-g="'+a.grupo_id+'"]');await w(400);
 await w(2500);await m.evaluate(()=>scrollTo(0,0));await m.screenshot({path:OUT+'/01-consola.jpg',type:'jpeg',quality:80});
 await shot('02-recordar','#siguiente');
 // grupo de prueba
 await m.click('#modoPrueba');await w(500);await m.click('#glist [data-g="'+o.grupo_id+'"]');await w(300);
 await m.click('#irPaso');await w(600);await hoja();
 await m.click('[data-tab="grupos"]');await w(300);await m.fill('#linkGrupo','https://chat.whatsapp.com/EjemploSintonia');await w(1000);
 await shot('03-crear-grupo','#crearGrupoWA');
 await abrir();await shot('04-ingreso','#siguiente');
 await m.evaluate(()=>document.querySelectorAll('#siguiente details').forEach(d=>d.open=true));await m.click('#siguiente [data-cpm="msg_ingreso"]');await w(700);await m.click('#irPaso');await w(700);
 await m.click('[data-tab="planes"]');await w(300);await m.fill('#restr','[3:10 p. m.] Andrés: yo puedo el sábado\n[3:11 p. m.] Sofía: algo barato porfa');await m.click('#pedirIA');await w(1000);
 await shot('05-opciones','#tab-planes',1500);
 await m.click('#publicar');await w(300);await hoja();
 await m.evaluate(()=>document.querySelectorAll('#siguiente details.c-cola-i').forEach(d=>{d.open=/opcion_1|\/dia/.test(d.dataset.cola);}));await w(200);
 await shot('06-cola-opciones','#siguiente',1700);
 await m.evaluate(()=>document.querySelectorAll('#siguiente details').forEach(d=>d.open=true));await m.click('#siguiente [data-marca="msg_opciones"]');await w(700);
 await m.click('[data-tab="planes"]');await w(300);await m.fill('#dv0','2');await m.fill('#dvc','1');await m.fill('#dvp','3');await w(200);
 await m.click('#decision .c-chip[data-fecha] >> nth=0');await m.click('#decision .c-chip[data-hora="16:00"]');await w(300);
 await shot('07-decision','#decision',1500);
 await m.click('#cerrarPlan');await w(900);await hoja();await abrir();
 await shot('08-confirmado','#siguiente',1700);
 await m.evaluate(()=>document.querySelectorAll('#siguiente details').forEach(d=>d.open=true));await m.click('#siguiente [data-marca="msg_confirmado"]');await w(700);await abrir();
 await shot('09-dia','#siguiente',1500);
 await m.click('#siguiente #todosLlegaron');await w(800);await m.click('#siguiente #todosCasa');await w(800);
 await shot('10-encuesta','#siguiente',1500);
 // las tres responden (por la API) → paso de la encuesta del mago
 const pl=(await (await fetch(B+'/exec?view=mago&key='+K)).json()).planes.filter(x=>x.grupo_id===o.grupo_id)[0];
 const g=(await (await fetch(B+'/exec?view=mago&key='+K)).json()).grupos.find(x=>x.grupo_id===o.grupo_id);
 for(const mm of g.miembros) await api({action:'retro',plan_id:pl.plan_id,pid:mm.pid,satisfaccion_plan:4,fatiga_post:2,valor_final:4,repetiria:'si',confort_bot:4});
 await m.click('#recargar');await w(800);await shot('11-paso-mago','#siguiente',900);
 await m.click('#irPaso');await w(700);await m.evaluate(()=>{const d=document.querySelector('#pulsoMago');if(d&&'open' in d)d.open=true;});await w(200);
 await shot('12-encuesta-mago','#pulsoMago',1400);
 await b.close();console.log('ok');
})().catch(e=>{console.log('ERROR',e.stack);process.exit(1);});
