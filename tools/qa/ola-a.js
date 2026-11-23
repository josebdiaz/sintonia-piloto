// QA 2.8.0 · ola A (prompts 1–5): inscripción en celular, recordar a quien organiza, aviso en la fila, crear el grupo en 3 pasos, fechas y plazo
const {chromium,devices}=require('playwright');const B='http://localhost:8767';const OUT=process.argv[2]||require('path').join(__dirname,'salida','ola-a');require('fs').mkdirSync(OUT,{recursive:true});
const log=[];const ok=(n,c,d)=>{log.push((c?'OK   ':'FALLA')+' · '+n+(c?'':' · '+String(d).slice(0,300)));};
const api=async(d)=>(await fetch(B+'/exec',{method:'POST',body:JSON.stringify(d)})).json();const qa=async()=>(await fetch(B+'/__qa')).json();
const cons={autoriza_datos:true,optin_whatsapp:true,mayor_18:true,consent_investigacion:true};
(async()=>{const Q=await qa(),K=Q.ADMIN; const b=await chromium.launch(); const errs=[];
 // ---------- 1 · Inscripción en celular (390 px): antes y después
 async function inscribir(pagina,shot){
  const ctx=await b.newContext(Object.assign({},devices['iPhone 13']));const p=await ctx.newPage();p.on('pageerror',e=>errs.push(pagina+': '+e.message));
  await p.route(/fonts\./,r=>r.abort());
  await ctx.addInitScript(u=>{try{localStorage.setItem('SINTONIA_BACKEND_URL',u);}catch(e){}},B+'/exec');
  await p.goto(B+'/piloto/'+pagina+'?exp=E1&modo=prueba');
  await p.click('#tipo label:has-text("Amigos")'); await p.fill('#ninv','3');
  await p.click('#dias label:has-text("Sábado")'); await p.click('#franjas label:has-text("Tarde")');
  const hayF=await p.$('#fechas input'); if(hayF){ await p.click('#fechas label >> nth=0'); }
  await p.selectOption('#realizados','1'); await p.click('#fatiga button[data-v="4"]');
  await p.click('[data-step="1"] [data-next="2"]'); await p.waitForTimeout(200);
  const paso2=await p.$eval('[data-step="2"]',e=>e.innerText);
  await p.fill('#prefs','algo tranqui por el oeste'); await p.click('[data-step="2"] [data-next="3"]');
  await p.fill('#nombre','Paula'); await p.fill('#wa','3001000101'); await p.click('#consent [data-all]');
  await p.click('#enviar'); await p.waitForSelector('#vistaOk:not(.hidden)',{timeout:8000});
  await p.waitForTimeout(300); await p.screenshot({path:OUT+'/'+shot+'.png'});
  const r={titulo:await p.$eval('#okTitulo',e=>e.innerText),primero:await p.evaluate(()=>{const v=document.querySelector('#vistaOk');const els=[...v.querySelectorAll('a,button')].filter(x=>x.offsetParent);return els[0]?els[0].innerText:'';}),
    foco:await p.evaluate(()=>document.activeElement&&document.activeElement.id),
    waTop:await p.$eval('#okWa',e=>e.getBoundingClientRect().top), href:await p.$eval('#okWa',e=>decodeURIComponent(e.href)), paso2, hayF:!!hayF};
  await ctx.close(); return r;
 }
 const des=await inscribir('index.html','2-exito-despues-390');
 ok('P1 después: «Falta un paso» y lo primero que se toca es «Enviar la invitación por WhatsApp»',/Falta un paso, Paula: invita a tu parche/.test(des.titulo)&&/Enviar la invitación por WhatsApp/.test(des.primero)&&des.foco==='okWa',JSON.stringify(des));
 ok('P1 el botón de enviar se ve sin desplazarse (390 × 844)',des.waTop<600,des.waTop);
 ok('P1 el mensaje de invitación lleva el enlace de unirse',/unirse\.html\?inv=/.test(des.href)&&/\+1 de confianza/.test(des.href),des.href);
 ok('P3 la inscripción ofrece fechas concretas de los días marcados',des.hayF,'');
 ok('P5 el paso 2 aclara que es una descripción del grupo y pide no dar detalles de nadie',/Describe al grupo en general/.test(des.paso2)&&/hay una restricción de alcohol/.test(des.paso2),des.paso2);
 const vm0=await (await fetch(B+'/exec?view=mago&key='+K)).json(); const gIns=vm0.grupos.filter(g=>g.modo==='prueba').slice(-1)[0];
 ok('P3 la disponibilidad guarda las fechas sin que el backend las borre',/fechas: \d{4}\/\d{2}\/\d{2}/.test(gIns.disponibilidad),gIns.disponibilidad);

 // ---------- 2 · Consola: grupo piloto reclutando (recordar, reloj, aviso en la fila)
 const org=await api(Object.assign({action:'registrar',experimento:'E1',modo:'piloto',tipo_grupo:'amigos',nombre_grupo:'Parche Ola A',n_invitados:3,disponibilidad:'dias: sabado · franjas: tarde',nombre_pila:'Paula',whatsapp:'+573001000201'},cons));
 const ctx=await b.newContext({viewport:{width:1300,height:950}});const p=await ctx.newPage();p.on('pageerror',e=>errs.push('mago: '+e.message));
 await p.route(/fonts\./,r=>r.abort());
 await ctx.addInitScript(([k,u])=>{try{sessionStorage.setItem('sintonia_admin_key',k);localStorage.setItem('SINTONIA_BACKEND_URL',u);}catch(e){}},[K,B+'/exec']);
 await p.goto(B+'/piloto/mago.html'); await p.waitForSelector('#glist',{timeout:15000}); await p.waitForTimeout(500);
 await p.click('#glist [data-g="'+org.grupo_id+'"]'); await p.waitForTimeout(300);
 const rec=await p.$eval('#recordarOrg',e=>({t:e.innerText,h:decodeURIComponent(e.href)})).catch(()=>null);
 ok('P1 «Esperar que acepten» trae «Recordar a Paula que comparta la invitación»',rec&&/Recordar a Paula que comparta la invitación/.test(rec.t),JSON.stringify(rec));
 ok('P1 el recordatorio dice que Sintonía no tiene los números y lleva el enlace',rec&&/no tengo los números/.test(rec.h)&&/unirse\.html\?inv=/.test(rec.h),rec&&rec.h);
 const rel=await p.$eval('#siguiente .c-relojes',e=>e.innerText).catch(()=>'');
 ok('P1 reloj: recordar a las 2 h sin aceptaciones nuevas',/Recordar a quien organiza que comparta la invitación ·\s+en (1 h 5\d min|2 h)/.test(rel),rel);
 await p.screenshot({path:OUT+'/3-recordar-1300.png'});
 // alguien acepta mientras el mago mira otro grupo
 const otro=await api(Object.assign({action:'registrar',experimento:'E1',modo:'piloto',tipo_grupo:'familia',nombre_grupo:'Otro parche',n_invitados:2,nombre_pila:'Ana',whatsapp:'+573001000301'},cons));
 await p.click('#recargar'); await p.waitForTimeout(400); await p.click('#glist [data-g="'+otro.grupo_id+'"]'); await p.waitForTimeout(300);
 await api(Object.assign({action:'registrar',codigo_invitacion:org.codigo_invitacion,nombre_pila:'Kate',whatsapp:'+573001000202'},cons));
 await p.click('#recargar'); await p.waitForTimeout(500);
 const fila=await p.$eval('#glist [data-g="'+org.grupo_id+'"]',e=>e.innerText);
 ok('P5 la fila del grupo muestra «Aceptó alguien más»',/Aceptó alguien más/.test(fila),fila);
 await p.click('#recargar'); await p.waitForTimeout(400);
 ok('P5 el aviso sigue tras otra recarga (no se pierde)',/Aceptó alguien más/.test(await p.$eval('#glist [data-g="'+org.grupo_id+'"]',e=>e.innerText)),'');
 await p.screenshot({path:OUT+'/4-aviso-fila-1300.png'});
 await p.click('#glist [data-g="'+org.grupo_id+'"]'); await p.waitForTimeout(300);
 ok('P5 al abrir el grupo el aviso se apaga',!/Aceptó alguien más/.test(await p.$eval('#glist [data-g="'+org.grupo_id+'"]',e=>e.innerText)),'');

 // ---------- 3 · Crear el grupo de WhatsApp en 3 pasos + plan B
 await api(Object.assign({action:'registrar',codigo_invitacion:org.codigo_invitacion,nombre_pila:'Jose',whatsapp:'+573001000203'},cons));
 await api({action:'cerrar_reclutamiento',key:K,grupo_id:org.grupo_id});
 await p.click('#recargar'); await p.waitForTimeout(500); await p.click('[data-tab="grupos"]'); await p.waitForTimeout(300);
 const cg=await p.$eval('#crearGrupoWA',e=>e.innerText).catch(()=>'');
 ok('P2 tres pasos: guardar contacto, crear el grupo, pegar el enlace',/Guarda a Paula como contacto/.test(cg)&&/Crea el grupo/.test(cg)&&/Copia el enlace de invitación del grupo/.test(cg),cg);
 ok('P2 «Copiar nombre y número» de quien organiza',!!await p.$('#crearGrupoWA [data-copy^="Paula +57"]'),'');
 await p.fill('#linkGrupo','https://chat.whatsapp.com/QAola'); await p.waitForTimeout(900);
 const inv=await p.$$eval('#crearGrupoWA [data-invita]',a=>a.map(x=>x.innerText+' '+decodeURIComponent(x.href)));
 ok('P2 «Invitar a Paula» vuelve como plan B, con el mismo texto y el enlace del grupo',inv.length===3&&inv.some(x=>/^Invitar a Paula .*chat\.whatsapp\.com\/QAola/.test(x))&&/Plan B/.test(await p.$eval('#crearGrupoWA',e=>e.innerText)),inv.join(' | '));
 await (await p.$('#crearGrupoWA')).screenshot({path:OUT+'/5-crear-grupo.png'});

 // ---------- 4 · Fecha única: /opciones concreto, Gemini, precarga; plazo de asistencia (modo piloto)
 const F=(()=>{const d=new Date();d.setHours(12,0,0,0);for(let k=3;k<12;k++){const x=new Date(d.getTime()+k*864e5);if(x.getDay()===6)return x;}})();
 const fs=F.getFullYear()+'/'+String(F.getMonth()+1).padStart(2,'0')+'/'+String(F.getDate()).padStart(2,'0'), fi=fs.replace(/\//g,'-');
 const o2=await api(Object.assign({action:'registrar',experimento:'E1',modo:'piloto',tipo_grupo:'amigos',nombre_grupo:'Fecha fija',n_invitados:2,disponibilidad:'dias: sabado · franjas: tarde · fechas: '+fs,nombre_pila:'Luz',whatsapp:'+573001000401'},cons));
 await api(Object.assign({action:'registrar',codigo_invitacion:o2.codigo_invitacion,nombre_pila:'Sol',whatsapp:'+573001000402'},cons));
 await api({action:'cerrar_reclutamiento',key:K,grupo_id:o2.grupo_id}); const pl2=await api({action:'crear_plan',key:K,grupo_id:o2.grupo_id});
 await api({action:'evento',key:K,plan_id:pl2.plan_id,grupo_id:o2.grupo_id,pid:'',tipo:'msg_ingreso'});
 await p.click('#recargar'); await p.waitForTimeout(400); await p.click('#glist [data-g="'+o2.grupo_id+'"]'); await p.waitForTimeout(300);
 await p.click('[data-tab="planes"]'); await p.fill('#restr','lo de siempre'); await p.click('#pedirIA'); await p.waitForTimeout(800);
 const q=await (await fetch(B+'/__qa')).json();
 await p.click('#publicar'); await p.waitForTimeout(300); if(await p.$('#hoja[open]')){await p.click('#hojaSi');await p.waitForTimeout(800);}
 await p.evaluate(()=>document.querySelectorAll('#siguiente details').forEach(d=>d.open=true));
 const s1=await p.$eval('#siguiente',e=>e.innerText+' '+[...e.querySelectorAll('textarea')].map(t=>t.value).join(' | '));
 const larga=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'][F.getDay()]+' '+F.getDate()+' de '+['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'][F.getMonth()];
 ok('P3 con una sola fecha, /opciones dice «para el sábado N de mes en la tarde» y no pide «¿Qué día?»',new RegExp('3 planes para el '+larga+' en la tarde').test(s1)&&!/¿Qué día les queda mejor/.test(s1),s1.slice(0,300));
 await p.click('#siguiente [data-marca="msg_opciones"]'); await p.waitForTimeout(600);
 await p.click('[data-tab="planes"]'); await p.waitForTimeout(200);
 const fe=await p.inputValue('#fechaE'), chip=await p.$$eval('#decision .c-chip[data-fecha]',x=>x.map(y=>y.dataset.fecha+(y.getAttribute('aria-pressed')==='true'?'*':'')));
 ok('P3 el cierre precarga la fecha del grupo y la marca en los botones',fe===fi&&chip.length===1&&chip[0]===fi+'*',fe+' '+chip.join(','));
 await p.click('#decision .c-chip[data-hora="16:00"]'); await p.fill('#dv0','2'); await p.fill('#dvp','2'); await p.waitForTimeout(200);
 await p.click('#cerrarPlan'); await p.waitForTimeout(800);
 const conf=await p.$$eval('#siguiente textarea',t=>t.map(x=>x.value).join(' | '));
 const vis=new Date(F.getTime()-864e5), visTxt=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'][vis.getDay()]+' '+vis.getDate()+' a las 6:00';
 ok('P4 /confirmado: «marquen si van, hasta el viernes N a las 6:00 p. m.» (la víspera)',new RegExp('hasta el '+visTxt).test(conf),conf.slice(-200));
 await p.click('#siguiente [data-marca="msg_confirmado"]'); await p.waitForTimeout(600);
 const paso=await p.$eval('#siguiente',e=>e.innerText);
 ok('P4 antes del plazo la consola no ofrece /hoy ni /salida',/Ver quién se apuntó/.test(paso)&&/tiene hasta el/.test(paso)&&!/¡Es hoy!/.test(await p.$$eval('#siguiente textarea',t=>t.map(x=>x.value).join(' '))),paso.slice(0,300));
 ok('P4 reloj del cierre de confirmaciones',/Cierre de confirmaciones/.test(paso),paso.slice(0,400));
 await (await p.$('#siguiente')).screenshot({path:OUT+'/6-plazo.png'});
 ok('Sin errores de JavaScript',errs.length===0,errs.join(' | '));
 await b.close(); console.log(log.join('\n')); console.log('\n'+log.filter(l=>l.startsWith('OK')).length+' OK · '+log.filter(l=>l.startsWith('FALLA')).length+' fallas');
})().catch(e=>{console.log(log.join('\n'));console.log('ERROR',e.message);process.exit(1);});
