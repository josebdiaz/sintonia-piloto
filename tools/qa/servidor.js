// Servidor de QA: sirve el repo y responde /exec con el backend real (Codigo_Piloto.gs) sobre una hoja en memoria.
// Uso: node servidor.js <ruta-del-repo> [puerto]  ·  QA_DATOS=realista agrega precios en rango, una zona compartida y una dirección con «#».
// Todo es ficticio: no toca la hoja real ni manda correos (MailApp queda simulado).
const vm=require('vm'),fs=require('fs'),path=require('path'),http=require('http'),url=require('url');
const REPO=process.argv[2]||path.resolve(__dirname,'..','..'), PORT=+process.argv[3]||8767;
const qa=fs.readFileSync(path.join(REPO,'backend/qa/qa_backend.js'),'utf8');
const pre=qa.slice(0, qa.indexOf('vm.createContext(ctx);'));   // reutiliza la hoja simulada del QA del backend
const gem={opciones:[{tipo:'exacta',titulo:'Atardecer panorámico con hamburguesas en la azotea del barrio',paradas_ids:['INV-01','INV-02'],hora_salida:'4:30 PM',presupuesto_aprox:(process.env.QA_DATOS==='realista'?'$80.000 – $148.000':'$35.000'),por_que:'Vista de la ciudad y comida tranqui para hablar.'},
 {tipo:'intermedia',titulo:'Café y caminata',paradas_ids:['INV-03'],hora_salida:'4:30 PM',presupuesto_aprox:'$20.000',por_que:'Corto y cerca.'},
 {tipo:'diferente',titulo:'Cine al aire libre',paradas_ids:['INV-04'],hora_salida:'5:00 PM',presupuesto_aprox:'$15.000',por_que:'Plan de noche sin gastar mucho.'}]};
const env={}; let ultimoPrompt='';
new Function('require','__dirname','env',pre+'\nenv.ctx=ctx;env.SHEETS=SHEETS;env.PROPS=PROPS;')(require,path.join(REPO,'backend/qa'),env);
env.ctx.UrlFetchApp={fetch:(u,o)=>{ultimoPrompt=String((JSON.parse(o.payload).contents||[{}])[0].parts?.[0]?.text||'');return {getResponseCode:()=>200,getContentText:()=>JSON.stringify({candidates:[{content:{parts:[{text:JSON.stringify(gem)}]}}],usageMetadata:{promptTokenCount:100,candidatesTokenCount:50}})};}};
const correos=[]; env.ctx.MailApp={sendEmail:(to,a,b)=>correos.push({to,a,b}),getRemainingDailyQuota:()=>100}; env.PROPS.NOTIFICAR_A='equipo@qa,monitor@qa';
vm.createContext(env.ctx); vm.runInContext(fs.readFileSync(path.join(REPO,'backend/Codigo_Piloto.gs'),'utf8'),env.ctx);
vm.runInContext('sheet_("inventario")',env.ctx);
const H=['id','nombre','categoria','macro_zona','zona','direccion','costo_aprox','costo_min_cop','horario','franja_horaria','duracion','apto_para','acceso','telefono_para_llamar','fuente','verificado_el','estado','latitud','longitud'];
env.SHEETS.inventario.rows=[H];
const zs=['Oeste','Sur','Norte','Centro','Este'];
for(let i=1;i<=120;i++) env.SHEETS.inventario.rows.push(['INV-'+String(i).padStart(2,'0'),'Lugar '+i,'comida',zs[i%5],zs[i%5],'Calle '+i,'$'+(i%6)*10+'.000',String((i%6)*10000),'10-22',['tarde','noche','mañana'][i%3],'2h','todos','fácil','','web','2026-11 · Katherine',i%10===0?'por_confirmar':'activo','3.4'+String(i).padStart(3,'0'),'-76.5'+String(i).padStart(3,'0')]);
env.SHEETS.inventario.rows[1][1]='Mirador Cristo Rey'; env.SHEETS.inventario.rows[2][1]='Burger del barrio';
if(process.env.QA_DATOS==='realista'){ env.SHEETS.inventario.rows[1][4]='San Antonio'; env.SHEETS.inventario.rows[2][4]='San Antonio'; env.SHEETS.inventario.rows[1][5]='Carrera 4 # 2-15, barrio San Antonio'; }
vm.runInContext('probarMontaje()',env.ctx);
const doPost=d=>JSON.parse(vm.runInContext('doPost',env.ctx)({postData:{contents:d}}).t);
const doGet=q=>JSON.parse(vm.runInContext('doGet',env.ctx)({parameter:q}).t);
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.json':'application/json'};
http.createServer((req,res)=>{const u=url.parse(req.url,true);
  if(u.pathname==='/exec'){ if(req.method==='POST'){let b='';req.on('data',c=>b+=c);req.on('end',()=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(doPost(b)));});}
    else {res.setHeader('content-type','application/json');res.end(JSON.stringify(doGet(u.query)));} return; }
  if(u.pathname==='/__qa'){res.setHeader('content-type','application/json');res.end(JSON.stringify({prompt_lugares:(ultimoPrompt.match(/^INV-\d+/gm)||[]).length,hojas:Object.fromEntries(Object.entries(env.SHEETS).map(([k,v])=>[k,v.rows.length-1])),operacion:env.SHEETS.operacion?env.SHEETS.operacion.rows:[],decisiones:env.SHEETS.decisiones?env.SHEETS.decisiones.rows:[],eventos:env.SHEETS.eventos?env.SHEETS.eventos.rows.slice(1).map(r=>r.slice(0,8)):[],ADMIN:env.PROPS.ADMIN_KEY,correos,dump:Object.fromEntries(Object.entries(env.SHEETS).filter(([k])=>k!=='inventario').map(([k,v])=>[k,v.rows]))}));return;}
  let f=path.join(REPO,decodeURIComponent(u.pathname)); if(f.endsWith('/'))f+='index.html';
  fs.readFile(f,(e,d)=>{if(e){res.statusCode=404;return res.end('no');} res.setHeader('content-type',MIME[path.extname(f)]||'application/octet-stream');res.end(d);});
}).listen(PORT,()=>console.log('QA server en',PORT));
