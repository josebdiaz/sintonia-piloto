const {chromium}=require('playwright');const B='http://localhost:8767';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
const rep=[];
for(const u of ['/','/piloto/index.html?exp=E1&modo=prueba','/piloto/unirse.html?inv=XXXXXXXX','/piloto/aviso.html','/piloto/panel.html','/docs/guias/']){
 await p.goto(B+u);await p.waitForTimeout(3500);
 const r=await p.evaluate(()=>{
  const lum=c=>{const m=c.match(/[\d.]+/g).map(Number);const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)};return [0.2126*f(m[0])+0.7152*f(m[1])+0.0722*f(m[2]),m[3]===undefined?1:m[3]]};
  const bg=el=>{while(el){const c=getComputedStyle(el).backgroundColor;if(c&&!/rgba\(0, 0, 0, 0\)|transparent/.test(c))return c;el=el.parentElement;}return 'rgb(255,255,255)'};
  const out=[];const seen=new Set();
  document.querySelectorAll('body *').forEach(el=>{if(!el.childNodes.length||![...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim().length>2))return;const cs=getComputedStyle(el);if(cs.visibility==='hidden'||cs.display==='none'||el.offsetParent===null&&cs.position!=='fixed')return;
   const [l1,a]=lum(cs.color),[l2]=lum(bg(el));if(a<1)return;const cr=(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);const fs=parseFloat(cs.fontSize),bold=+cs.fontWeight>=700;const need=(fs>=24||(fs>=18.66&&bold))?3:4.5;
   if(cr<need){const k=cs.color+'|'+fs;if(seen.has(k))return;seen.add(k);out.push([el.tagName+'.'+String(el.className).slice(0,24),el.textContent.trim().slice(0,40),fs+'px',cr.toFixed(2)]);}});
  return out.slice(0,8);});
 rep.push(u+' → '+(r.length?JSON.stringify(r):'sin fallas'));}
console.log(rep.join('\n'));await b.close();})();
