// Auditoría E2E 2.8.0: una prueba completa como la del viernes (modo prueba), con el backend real sobre una hoja simulada.
const {chromium,devices}=require('playwright');const AXE=require('fs').readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const B='http://localhost:8767',OUT=process.argv[2]||require('path').join(__dirname,'salida','auditoria-e2e');require('fs').mkdirSync(OUT,{recursive:true});
const R=[];const H=(sev,area,txt,dato)=>R.push({sev,area,txt,dato:dato===undefined?'':String(dato).slice(0,400)});
const ok=(c,area,txt,dato,sev='ALTA')=>{ if(!c) H(sev,area,txt,dato); else H('OK',area,txt); return c; };
const api=async(d)=>(await fetch(B+'/exec',{method:'POST',body:JSON.stringify(d)})).json();const qa=async()=>(await fetch(B+'/__qa')).json();
const EMO=/\p{Extended_Pictographic}/gu;
const chat=[];   // lo que «sale» al grupo o a cada persona, en orden
const T0=Date.now();
(async()=>{const K=(await qa()).ADMIN;const b=await chromium.launch();const errs=[];
 async function movil(dev){const c=await b.newContext(Object.assign({},devices[dev]));await c.addInitScript(u=>{try{localStorage.setItem('SINTONIA_BACKEND_URL',u);}catch(e){}},B+'/exec');const p=await c.newPage();p.on('pageerror',e=>errs.push(dev+': '+e.message));await p.route(/fonts\./,r=>r.abort());return {c,p};}
 async function scrollX(p,lab){const w=await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);ok(w<=1,'Móvil','Sin scroll horizontal: '+lab,w+' px','MEDIA');}
 async function axe(p,lab){ await p.addScriptTag({content:AXE}); const r=await p.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa']}})); const v=r.violations.filter(x=>['serious','critical'].includes(x.impact)); ok(!v.length,'Accesibilidad','axe sin violaciones graves: '+lab,v.map(x=>x.id+'×'+x.nodes.length).join(', '),'MEDIA'); }

 // ===== ANTES · Inscripción de quien organiza (iPhone 13) =====
 const o=await movil('iPhone 13'), po=o.p;
 await po.goto(B+'/piloto/index.html?exp=E1&modo=prueba'); await axe(po,'inscripción paso 1'); await scrollX(po,'inscripción');
 await po.click('#tipo label:has-text("Amigos")'); await po.fill('#ninv','3'); await po.fill('#nomGrupo','Las del cole');
 // 2.10.0 (sync P8d): «Escoge tu disponibilidad» en un calendario de 2 semanas
 const nDias=(await po.$$('#agenda .ag-dia')).length, nFinde=(await po.$$('#agenda .ag-dia.finde')).length; ok(nDias===14&&nFinde===4,'Activación','El calendario muestra 14 días, 4 de fin de semana',[nDias,nFinde],'BAJA');
 for(let k=0;k<5;k++) await po.click('#agenda .ag-dia >> nth='+k);
 const tope=(await po.$$('#agenda input:checked')).length; ok(tope===4,'Activación','Quien organiza marca hasta 4 días (el quinto se frena con un aviso)',tope,'BAJA');
 for(let k=0;k<4;k++) await po.click('#agenda .ag-dia >> nth='+k);
 await po.click('#agenda .ag-dia.finde >> nth=0'); await po.click('#agenda .ag-dia.finde >> nth=2');
 const pie=await po.$eval('#agenda .ag-pie',e=>e.innerText); ok(/2 días marcados de 4/.test(pie),'Activación','El calendario dice cuántos días van marcados',pie,'BAJA');
 await po.click('#franjas label:has-text("Tarde")'); await po.selectOption('#realizados','1'); await po.click('#fatiga button[data-v="4"]');
 await po.click('[data-step="1"] [data-next="2"]');
 await po.fill('#prefs','Algo tranqui en San Antonio, máximo 50 mil. Ana es diabética y no toma, su cel es 3001239999');
 await po.click('[data-step="2"] [data-next="3"]'); await po.waitForTimeout(200);
 const sigue2=await po.$eval('[data-step="2"]',e=>!e.classList.contains('hidden')), av=await po.$eval('.c-sensible',e=>e.hidden?'':e.innerText).catch(()=>'');
 ok(sigue2&&/en general/.test(av),'Privacidad','El formulario no avanza con un dato de salud de un tercero y explica cómo decirlo',av);
 await po.screenshot({path:OUT+'/00-aviso-sensible.png'});
 await po.fill('#prefs','Algo tranqui en San Antonio, máximo 50 mil. Hay una restricción de comida y una no toma alcohol, su cel es 3001239999');
 await po.click('[data-step="2"] [data-next="3"]'); await po.waitForTimeout(200);
 ok(await po.$eval('[data-step="3"]',e=>!e.classList.contains('hidden')),'Privacidad','Reescrito en general («no toma alcohol» incluido), sí avanza',''); await po.fill('#nombre','Paula'); await po.fill('#wa','300 100 0501');
 await po.click('#consent [data-all]'); await po.click('#enviar'); await po.waitForSelector('#vistaOk:not(.hidden)',{timeout:8000});
 await po.screenshot({path:OUT+'/01-org-exito.png'}); await scrollX(po,'pantalla de éxito'); await axe(po,'pantalla de éxito');
 const invLink=await po.$eval('#okLink',e=>e.innerText.trim()); const share=decodeURIComponent(await po.$eval('#okWa',e=>e.href));
 ok((share.match(EMO)||[]).length<=1,'Voz','Mensaje de invitación con máximo un emoji',share);
 chat.push(['Paula → su parche (WhatsApp personal)',share.replace(/^.*?text=/,'')]);
 // volver a abrir la inscripción desde el mismo celular
 await po.goto(B+'/piloto/index.html?exp=E1&modo=prueba'); const ya=await po.$eval('body',e=>e.innerText);
 ok(!/Ya registraste un grupo/.test(ya)||true,'Antes','(modo prueba permite reinscribir)', '', 'OK');
 await po.goto(B+'/piloto/index.html?exp=E1'); const ya2=await po.$eval('#vistaYa',e=>!e.classList.contains('hidden')?e.innerText:'');
 ok(/Ver el plan y la invitación/.test(ya2),'Antes','Quien organiza que vuelve a la inscripción encuentra su invitación',ya2,'MEDIA');
 // ===== Recordar a quien organiza (consola, mientras falta gente)
 const c=await b.newContext({viewport:{width:1366,height:900}});await c.addInitScript(([k,u])=>{try{sessionStorage.setItem('sintonia_admin_key',k);localStorage.setItem('SINTONIA_BACKEND_URL',u);}catch(e){}},[K,B+'/exec']);
 const m=await c.newPage(); m.on('pageerror',e=>errs.push('consola: '+e.message)); await m.route(/fonts\./,r=>r.abort());
 const wait=ms=>m.waitForTimeout(ms), ahora=async()=>m.$eval('#siguiente h2.c-paso',e=>e.innerText).catch(()=>'?');
 const tab=async t=>{await m.click('[data-tab="'+t+'"]');await wait(250);};
 const hoja=async()=>{ if(await m.$('#hoja[open]')){ await m.click('#hojaSi'); await wait(700);} };
 const abrir=async()=>m.evaluate(()=>document.querySelectorAll('#siguiente details').forEach(d=>d.open=true));
 // Copia lo que la cola propone, en orden, y lo anota como si saliera al chat
 async function enviarCola(dest){ await abrir(); const items=await m.$$eval('#siguiente .c-cola-i',x=>x.map(d=>({c:d.querySelector('summary b').innerText,st:d.dataset.st,txt:[...d.querySelectorAll('textarea')].map(t=>t.value),poll:[...d.querySelectorAll('.poll .poll-row')].map(r=>r.innerText.replace(/\s*Copiar$/,'').replace(/\s+/g,' ')),bloq:!!d.querySelector('.tpl-bloq')})));
   for(const it of items){ if(it.bloq){ chat.push([dest||'grupo','(bloqueado) '+it.c]); continue; } chat.push([dest||'grupo',it.c+'\n'+it.txt.join('\n— ')+(it.poll.length?'\n[ENCUESTA] '+it.poll.join(' | '):'')]); }
   return items; }
 await m.goto(B+'/piloto/mago.html'); await m.waitForSelector('#modoPrueba'); await m.click('#modoPrueba'); await wait(400);
 await m.fill('#magoQuien','Juan José'); await m.click('#magoIn'); await wait(500);
 await m.click('#glist [data-g]'); await wait(300);
 const rec=await m.$eval('#recordarOrg',e=>decodeURIComponent(e.href)).catch(()=>'');
 ok(!!rec,'Antes','Botón «Recordar a Paula…» mientras falta gente',await ahora());
 chat.push(['Sintonía → Paula (recordatorio)',rec.replace(/^.*?text=/,'')]);
 ok(!/Valle del Cauca/.test(rec)&&rec.length<600,'Antes','Recordatorio corto',rec.length,'BAJA');
 const prefsSheet=(await qa()).dump.preferencias.slice(1).map(r=>r[3]).join(' ');
 ok(!/300\s?123\s?9999/.test(prefsSheet),'Privacidad','El teléfono escrito en preferencias no llega a la hoja',prefsSheet);
 ok(/no toma alcohol/.test(prefsSheet)&&!/diab/i.test(prefsSheet),'Privacidad','Un dato de salud de un tercero escrito en preferencias no llega a la hoja (aunque se salte el formulario)',prefsSheet,'ALTA');
 // ===== Miembros aceptan (Pixel 7 y iPhone SE)
 const corr0=(await qa()).correos.length;
 for(const [dev,nom,tel] of [['Pixel 7','Kate','3001000502'],['iPhone SE','Mafe','3001000503']]){
   const x=await movil(dev); await x.p.goto(invLink.replace('https://sintonia.my',B)); await x.p.waitForSelector('#vistaForm:not(.hidden)',{timeout:8000});
   if(nom==='Kate'){ await axe(x.p,'unirse'); await scrollX(x.p,'unirse ('+dev+')'); const lbl=await x.p.$eval('#vistaForm',e=>e.innerText); ok(/salud/.test(lbl)&&/restricción/.test(lbl),'Privacidad','La página de unirse tiene la misma pista de datos sensibles que la inscripción (ejemplo «hay una restricción…»)',lbl.match(/No incluyas[^\n]*/)||'', 'MEDIA'); }
   if(nom==='Kate'){ const pr=(await x.p.$$('#agenda .ag-dia.propuesta')).length; ok(pr===2,'Activación','Unirse marca con punto las 2 fechas que propuso quien organiza',pr,'MEDIA'); }
   await x.p.click('#agenda .ag-dia.propuesta >> nth=0'); await x.p.click('#agenda .ag-dia:not(.propuesta) >> nth=0'); await x.p.click('#franjas label:has-text("'+(nom==='Kate'?'Tarde':'Noche')+'")');
   await x.p.fill('#nombre',nom); await x.p.fill('#wa',tel); await x.p.click('#fatiga button[data-v="3"]'); await x.p.click('#consent [data-all]'); await x.p.click('#enviar');
   await x.p.waitForSelector('#vistaOk:not(.hidden)',{timeout:8000}); if(nom==='Kate') await x.p.screenshot({path:OUT+'/02-miembro-ok.png'});
   const okTxt=await x.p.$eval('#vistaOk',e=>e.innerText); if(nom==='Kate') ok(/WhatsApp/.test(okTxt),'Antes','Quien acepta sabe qué sigue (le escriben por WhatsApp)',okTxt.slice(0,200),'MEDIA');
   if(nom==='Kate'){ await m.click('#recargar'); await wait(500); const g0=await m.$eval('#glist',e=>e.innerText); H(/Aceptó alguien más/.test(g0)?'MEDIA':'OK','Antes','Con el grupo abierto, la fila no muestra «Aceptó alguien más» (por diseño: ya lo estás viendo)',g0.slice(0,120)); }
   await x.c.close();
 }
 const corr=(await qa()).correos.slice(corr0);
 ok(corr.length===2&&/2 de 3/.test(corr[0].a)&&/aceptaron todos/.test(corr[1].a),'Avisos','Correos: «1 más (2 de 3)» y «ya aceptaron todos», a los dos correos',JSON.stringify(corr.map(x=>x.to+' · '+x.a)));
 ok(corr.every(x=>!/Paula|Kate|Mafe|300100/.test(x.a+x.b)),'Privacidad','Los correos no llevan nombres ni números',JSON.stringify(corr));
 // intento 4.ª persona y duplicado
 const cons={autoriza_datos:true,optin_whatsapp:true,mayor_18:true,consent_investigacion:true};
 const cod=invLink.split('inv=')[1];
 ok((await api(Object.assign({action:'registrar',codigo_invitacion:cod,nombre_pila:'X',whatsapp:'+573001000599'},cons))).error==='grupo_lleno','Antes','Una cuarta persona no entra (grupo lleno)','','MEDIA');
 // ===== Grupo de WhatsApp
 await m.click('#recargar'); await wait(500); await m.click('#glist [data-g]'); await wait(300);
 ok(/Cerrar el reclutamiento/.test(await ahora()),'Antes','Con todos adentro, el paso es cerrar el reclutamiento',await ahora());
 await m.click('#irPaso'); await wait(500); await hoja();
 const cg=await m.$eval('#crearGrupoWA',e=>e.innerText).catch(()=>''); ok(/Guarda a Paula como contacto/.test(cg),'Antes','Crear el grupo: paso de guardar el contacto','');
 await tab('grupos'); await m.fill('#linkGrupo','https://chat.whatsapp.com/AUDIT01'); await wait(900);
 for(const h of await m.$$eval('#crearGrupoWA [data-invita]',a=>a.map(x=>x.dataset.nom+'|'+decodeURIComponent(x.href)))) chat.push(['Sintonía → '+h.split('|')[0]+' (invitación al grupo)',h.split('|')[1].replace(/^.*?text=/,'')]);
 // ===== /ingreso y plan 1
 await enviarCola('grupo'); await m.click('#siguiente [data-cpm="msg_ingreso"]').catch(()=>{}); await wait(700);
 ok(/Crear el plan 1/.test(await ahora()),'Activación','Después de /ingreso: crear el plan 1',await ahora());
 await m.click('#irPaso'); await wait(600); await tab('planes');
 const planTxt=await m.$eval('#tab-planes',e=>e.innerText);
 ok(/sábado \d+ de [a-z]+|domingo \d+ de/.test(planTxt),'Activación','Al pedir opciones, la consola muestra las fechas concretas del grupo',planTxt.match(/Disponibilidad[^\n]*/)||planTxt.slice(0,200),'MEDIA');
 await m.fill('#restr','[3:10 p. m.] Kate: yo puedo el sábado\n[3:11 p. m.] Mafe: algo barato porfa'); await m.click('#pedirIA'); await wait(900);
 const pr=(await qa()).prompt_lugares; ok(pr>0&&pr<=50,'Activación','Gemini recibe ≤ 50 lugares',pr,'BAJA');
 await m.click('#publicar'); await wait(300); await hoja();
 const itP=await enviarCola('grupo');
 ok(itP.map(x=>x.c).join(' ')==='/opciones /opcion_1 /opcion_2 /opcion_3 /dia /encuesta','Activación','Orden de la cola: opciones, «¿Qué día?» y la encuesta del plan',itP.map(x=>x.c).join(' '));
 const op1=(itP.find(x=>x.c==='/opcion_1')||{txt:['']}).txt[0];
 ok(op1.split('\n').length<=4,'Voz','Opción en ≤ 4 líneas',op1);
 ok(/aprox\. \$114\.000 por persona/.test(op1),'Voz','Un solo precio (punto medio de $80.000 – $148.000)',op1);
 ok((op1.match(/San Antonio/g)||[]).length===1,'Voz','La zona aparece una sola vez',op1);
 const mapa=(op1.match(/https:\/\/\S+/)||[''])[0]; ok(mapa.length<=110,'Voz','Enlace de Maps corto (≤ 110 caracteres)',mapa.length+' · '+mapa,'MEDIA');
 // votación: el mago anota votos y cierra
 await m.click('#siguiente [data-marca="msg_opciones"]'); await wait(600);
 const itD=await enviarCola('grupo'); ok(!itD.some(x=>x.c==='/dia'),'Activación','«¿Qué día?» no se repite al decidir',itD.map(x=>x.c).join(' '),'MEDIA');
 await tab('mensajes'); const bloq=await m.$eval('#tab-mensajes',e=>e.textContent); ok(/El grupo está votando/.test(bloq),'Activación','Mientras votan, los mensajes de cierre están bloqueados','');
 await tab('planes'); await m.fill('#dv0','2'); await m.fill('#dvc','1'); await m.fill('#dvp','3'); await wait(200);
 // ¿se ve el recordatorio cuando ya votaron todos?
 await m.click('#recargar'); await wait(500); await abrir(); const rcd=await m.$('#siguiente [data-cola$="|/recordatorio"]');
 ok(!rcd,'Activación','/recordatorio se oculta cuando ya votaron todos (3 de 3)','', 'MEDIA');
 await tab('planes'); const chips=await m.$$eval('#decision .c-chip[data-fecha]',x=>x.map(y=>y.innerText));
 ok(chips.length===2,'Activación','El cierre ofrece solo las 2 fechas marcadas',chips.join(', '),'MEDIA');
 const fe0=await m.inputValue('#fechaE'); ok(fe0==='','Activación','Con 2 fechas, el día no viene precargado (obliga a elegir)',fe0,'BAJA');
 // cerrar sin hora → debe impedirlo
 await m.click('#cerrarPlan'); await wait(300); const t1=await m.$eval('#toast',e=>e.innerText).catch(()=>''); ok(/Elige el día y la hora/.test(t1),'Activación','No se puede cerrar sin día y hora',t1);
 await m.click('#decision .c-chip[data-fecha] >> nth=0'); await m.click('#decision .c-chip[data-hora="16:00"]'); await wait(150);
 await m.click('#cerrarPlan'); await wait(800); await hoja();
 const itC=await enviarCola('grupo');
 const conf=(itC.find(x=>x.c==='/confirmado')||{txt:[]}).txt;
 ok(conf.length===3&&/¡Hay plan!/.test(conf[0])&&/marquen si van, hasta el/.test(conf[2]),'Interacción','/confirmado en 3 mensajes con plazo para confirmar',conf.join(' || '));
 ok(/¡Hay plan! Atardecer panorámico 🙌/.test(conf[0])&&(conf[0].match(/San Antonio/g)||[]).length===2&&/Aprox\. \$114\.000 por persona/.test(conf[1]),'Voz','/confirmado repite título, zona (una vez) y precio de la opción',conf.join(' || '));
 ok(!/\.\.$/.test(conf[2]),'Voz','Sin doble punto al final',conf[2],'MEDIA');
 ok(conf.every(t=>(t.match(EMO)||[]).length<=1),'Voz','Cada mensaje de /confirmado con máximo un emoji',conf.join(' || '));
 await m.click('#siguiente [data-marca="msg_confirmado"]'); await wait(600);
 // Día del plan (modo prueba: sin espera)
 const itH=await enviarCola('grupo'); ok(/Día del plan/.test(await ahora()),'Interacción','Modo prueba: el día del plan se activa sin esperar',await ahora());
 await tab('registro'); const sels=await m.$$('#tab-registro .c-seg-btn'); H(sels.length?'OK':'MEDIA','Interacción','Llegadas: botones por persona',sels.length);
 await m.click('#siguiente #todosLlegaron').catch(()=>{}); await wait(700); await m.click('#siguiente #todosCasa').catch(()=>{}); await wait(700);
 ok(/encuesta de cierre/i.test(await ahora()),'Continuidad','Llegaron y en casa → encuesta de cierre',await ahora());
 const encs=await m.$$eval('#siguiente .c-encuesta a[href*="wa.me"]',a=>a.map(x=>decodeURIComponent(x.href)));
 encs.forEach(h=>chat.push(['Sintonía → persona (encuesta de cierre)',h.replace(/^.*?text=/,'')]));
 // ===== Encuesta de cierre por UI (cada persona; quien organiza con precio)
 for(const [i,h] of encs.entries()){
   const u=h.match(/https?:\/\/\S+retro\.html\S+/)[0].replace('https://sintonia.my',B); const x=await movil('iPhone 13'); await x.p.goto(u); await x.p.waitForSelector('#vistaForm:not(.hidden)',{timeout:8000});
   if(i===0){ await axe(x.p,'encuesta de cierre'); await scrollX(x.p,'encuesta de cierre'); }
   await x.p.$$eval('[role=radiogroup]',gs=>gs.forEach(g=>{const bs=g.querySelectorAll('button[data-v]');if(bs.length&&g.offsetParent)bs[Math.min(3,bs.length-1)].click();}));
   await x.p.$$eval('.chips',gs=>gs.forEach(g=>{const r=g.querySelector('input');if(r&&g.offsetParent)r.click();}));
   const esOrg=await x.p.$eval('#bloqueWtp',e=>!e.classList.contains('hidden')).catch(()=>false);
   if(esOrg){ await x.p.fill('#muyBarato','3000'); await x.p.fill('#barato','8000'); await x.p.fill('#caro','20000'); await x.p.fill('#muyCaro','35000'); }
   const t0=Date.now(); await x.p.click('#enviar'); await x.p.waitForSelector('#vistaOk:not(.hidden)',{timeout:8000}).catch(()=>{});
   const done=await x.p.$eval('#vistaOk',e=>!e.classList.contains('hidden')); ok(done,'Continuidad','Encuesta de cierre enviada desde el celular ('+(esOrg?'organiza':'miembro')+')',await x.p.$eval('#toast',e=>e.innerText).catch(()=>''));
   if(i===0) await x.p.screenshot({path:OUT+'/03-encuesta-ok.png',fullPage:false});
   const n=await x.p.$$eval('#vistaForm .field, #vistaForm fieldset .field',x=>x.length).catch(()=>0); if(i===0) H(n>25?'CONOCIDO':'OK','Continuidad','Largo de la encuesta de cierre: '+n+' campos (M9: se cronometra en el ensayo del 25/11)',n);
   await x.c.close();
 }
 const D=(await qa()).dump; ok(D.wtp.length===2,'Negocio','Disposición a pagar guardada para quien organiza',D.wtp.length-1);
 H(D.wtp[0].indexOf('plan_id')>=0?'OK':'CONOCIDO','Negocio','La fila de disposición a pagar no guarda el plan (wtp sin plan_id; M8, prompt 6): si quien organiza responde en el plan 1 y el plan 2, no se sabe cuál es cuál y no hay control de duplicados','columnas: '+D.wtp[0].join(','));
 // ===== Pulso del mago (2.8.1: es un paso del recorrido)
 await m.click('#recargar'); await wait(600);
 ok(/encuesta como mago/.test(await ahora()),'Mago','Tras las encuestas de cierre, el paso es la encuesta del mago',await ahora());
 await m.click('#irPaso'); await wait(500);
 await m.evaluate(()=>{const d=document.querySelector('#pulsoMago');if(d&&'open' in d)d.open=true;});
 await m.$$eval('#pulsoMago input[type=radio][value="4"]',r=>r.forEach(x=>x.click()));
 await m.$$eval('#pulsoMago input[type=range]',r=>r.forEach(x=>{x.value=40;x.dispatchEvent(new Event('input',{bubbles:true}));}));
 await m.click('#pmEnviar'); await wait(800);
 ok((await qa()).dump.pulso_mago.length===2,'Mago','La encuesta del mago queda guardada',await m.$eval('#toast',e=>e.innerText).catch(()=>''));
 // otro navegador (sin la marca local) no la vuelve a pedir
 const c2=await b.newContext({viewport:{width:1366,height:900}});await c2.addInitScript(([k,u])=>{try{sessionStorage.setItem('sintonia_admin_key',k);localStorage.setItem('SINTONIA_BACKEND_URL',u);}catch(e){}},[K,B+'/exec']);
 const m2=await c2.newPage(); await m2.route(/fonts\./,r=>r.abort()); await m2.goto(B+'/piloto/mago.html'); await m2.waitForSelector('#modoPrueba'); await m2.click('#modoPrueba'); await m2.waitForTimeout(400); await m2.click('#glist [data-g]'); await m2.waitForTimeout(300);
 ok(!/encuesta como mago/.test(await m2.$eval('#siguiente h2.c-paso',e=>e.innerText))&&!await m2.$('#irPulsoMago'),'Mago','En otro navegador no vuelve a pedirla (la hoja lo sabe)',await m2.$eval('#siguiente h2.c-paso',e=>e.innerText));
 await c2.close();
 // ===== Plan 2 en el mismo grupo
 await m.click('#recargar'); await wait(500);
 const a2=await ahora(); ok(/Crear el plan 2/.test(a2),'Continuidad','Después de la encuesta del mago sigue el plan 2 en el mismo grupo',a2);
 await m.click('#irPaso'); await wait(700);
 // ===== Integridad de datos
 const D2=(await qa()).dump, filas=Object.entries(D2).filter(([k])=>k!=='contactos'&&k!=='bitacora');
 const conPII=filas.filter(([k,v])=>JSON.stringify(v).match(/Paula|Kate|Mafe|300100\d{4}|3001239999/));
 ok(!conPII.length,'Privacidad','Nombres y teléfonos solo en «contactos»',conPII.map(([k,v])=>k+': '+(JSON.stringify(v).match(/.{30}(Paula|Kate|Mafe|300100\d{4}|3001239999).{20}/)||[''])[0]).join(' · '));
 { const H=D2.linea_base[0], c=H.indexOf('disponibilidad'), dm=D2.linea_base.slice(1).map(r=>r[c]).filter(Boolean); ok(c>=0&&dm.filter(x=>/fechas: \d{4}\/\d{2}\/\d{2}, \d{4}/.test(x)).length>=2,'Datos','2.10.0: linea_base guarda la disponibilidad de cada miembro',JSON.stringify(dm.slice(-3))); }
 const lb=D2.linea_base_grupo.slice(-1)[0].join(' '); ok(/fechas: \d{4}\/\d{2}\/\d{2}, \d{4}\/\d{2}\/\d{2}/.test(lb),'Datos','Las fechas quedan en linea_base_grupo',lb);
 const ops=D2.operacion.slice(1), ses=D2.sesiones.slice(1); H(ses.length?'OK':'MEDIA','Mago','Sesión de «Mago in» registrada',ses.length);
 const med=D2.medicion_consola? D2.medicion_consola.length-1:0;
 // ===== Transcripción: reglas de voz sobre todo lo que salió
 const salidas=chat.filter(([d,t])=>!/^\(bloqueado\)/.test(t));
 const conCorchete=salidas.filter(([d,t])=>/\[[^\]\n]{1,30}\]/.test(t.replace(/\[ENCUESTA\]/g,'')));
 ok(!conCorchete.length,'Voz','Ningún mensaje sale con [marcadores]',conCorchete.map(x=>x[1].slice(0,80)).join(' | '));
 const masEmo=salidas.filter(([d,t])=>t.split('\n— ').some(s=>(s.match(EMO)||[]).length>1));
 ok(!masEmo.length,'Voz','Máximo un emoji por mensaje',masEmo.map(x=>x[1].slice(0,90)).join(' | '),'MEDIA');
 const conNombre=salidas.filter(([d,t])=>d==='grupo'&&/Paula|Kate|Mafe/.test(t)); ok(!conNombre.length,'Voz','Mensajes al grupo sin nombres',conNombre.map(x=>x[1].slice(0,80)).join(' | '));
 const urls=salidas.map(([d,t])=>t).join(' ').match(/https?:\/\/\S+/g)||[]; const largas=urls.filter(u=>u.length>120); ok(!largas.length,'Voz','Ningún enlace de más de 120 caracteres',largas.map(u=>u.length).join(', '),'BAJA');
 ok(!errs.length,'Técnico','Sin errores de JavaScript',errs.join(' | '));
 await m.screenshot({path:OUT+'/04-consola-final.png'});
 require('fs').writeFileSync(OUT+'/chat.txt',chat.map(([d,t])=>'### '+d+'\n'+t).join('\n\n'));
 require('fs').writeFileSync(OUT+'/hallazgos.json',JSON.stringify(R,null,1));
 await b.close();
 const by=s=>R.filter(r=>r.sev===s);
 console.log('Duración: '+Math.round((Date.now()-T0)/1000)+' s · OK '+by('OK').length+' · ALTA '+by('ALTA').length+' · MEDIA '+by('MEDIA').length+' · BAJA '+by('BAJA').length+' · CONOCIDO '+by('CONOCIDO').length);
 R.filter(r=>r.sev!=='OK').forEach(r=>console.log(r.sev+' · '+r.area+' · '+r.txt+(r.dato?' → '+r.dato:'')));
})().catch(e=>{console.log('ERROR',e.stack);R.filter(r=>r.sev!=='OK').forEach(r=>console.log(r.sev+' · '+r.area+' · '+r.txt+' → '+r.dato));process.exit(1);});
