let all=[],shown=[],pos=0;
const $=s=>document.querySelector(s);
function repo(){const h=location.hostname,p=location.pathname.split("/").filter(Boolean);return h.endsWith(".github.io")?{o:h.split(".")[0],r:p[0]||""}:null}
async function files(){
 const r=repo();if(!r)return[];
 try{const q=await fetch(`https://api.github.com/repos/${r.o}/${r.r}/contents/photos?ref=main`);
  if(!q.ok)return[];const a=await q.json();
  return Array.isArray(a)?a.filter(x=>x.type==="file"&&/\.(jpe?g|png|webp|gif|avif)$/i.test(x.name)).sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true})):[]}
 catch(e){return[]}
}
async function logo(){
 const r=repo();if(!r)return;
 try{const q=await fetch(`https://api.github.com/repos/${r.o}/${r.r}/contents/logo/logo.png?ref=main`);
  if(!q.ok)return;const d=await q.json(),src=d.download_url;
  document.querySelector(".miniLogo").innerHTML=`<img src="${src}" alt="Логотип">`;
  document.querySelector(".logoStage").innerHTML=`<img src="${src}" alt="Логотип">`;
 }catch(e){}
}
function render(){
 const q=$("#search").value.trim().toLowerCase();
 shown=q?all.filter(x=>x.name.toLowerCase().includes(q)):all;
 $("#counter").textContent=shown.length;
 $("#grid").innerHTML=shown.length?shown.map((x,i)=>`<article class="card" data-i="${i}"><div class="pic"><img loading="lazy" src="${x.src}" alt="${esc(x.name)}"></div><div class="info"><h3>БУДІВЕЛЬНИЙ МАТЕРІАЛ</h3><p>КОНСУЛЬТАЦІЯ / ЗАМОВЛЕННЯ</p></div></article>`).join(""):`<div class="empty">У ПАПЦІ <b>photos</b> ПОКИ НЕМАЄ ФОТО.<br>ДОДАЙТЕ ФОТО — САЙТ ПІДХОПИТЬ ЇХ АВТОМАТИЧНО.</div>`;
 document.querySelectorAll(".card").forEach(c=>c.onclick=()=>open(+c.dataset.i));
}
function esc(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function open(i){pos=i;$("#big").src=shown[pos].src;$("#viewer").hidden=false}
function step(d){if(!shown.length)return;pos=(pos+d+shown.length)%shown.length;$("#big").src=shown[pos].src}
$("#search").oninput=render;$("#close").onclick=()=>$("#viewer").hidden=true;$("#prev").onclick=()=>step(-1);$("#next").onclick=()=>step(1);
document.addEventListener("keydown",e=>{if(e.key==="Escape")$("#viewer").hidden=true;if(e.key==="ArrowLeft")step(-1);if(e.key==="ArrowRight")step(1)});
(async()=>{all=(await files()).map(x=>({src:x.download_url,name:x.name}));render();logo()})();
