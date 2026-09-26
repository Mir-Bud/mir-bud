let all=[],shown=[],index=0,query="";
const $=s=>document.querySelector(s);
function repo(){const h=location.hostname,p=location.pathname.split("/").filter(Boolean);return h.endsWith(".github.io")?{o:h.split(".")[0],r:p[0]||""}:null}
async function getFiles(path){
 const r=repo(); if(!r)return[];
 try{
  const res=await fetch(`https://api.github.com/repos/${r.o}/${r.r}/contents/${path}?ref=main`,{headers:{Accept:"application/vnd.github+json"}});
  if(!res.ok)return[];
  const data=await res.json();
  return Array.isArray(data)?data.filter(x=>x.type==="file"&&/\.(jpe?g|png|webp|gif|avif)$/i.test(x.name)).sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true})): [];
 }catch(e){return[]}
}
async function load(){
 const files=await getFiles("photos");
 all=files.map(x=>({src:x.download_url,name:x.name}));
 loadLogo();
 render();
}
async function loadLogo(){
 const r=repo();if(!r)return;
 try{
  const res=await fetch(`https://api.github.com/repos/${r.o}/${r.r}/contents/logo/logo.png?ref=main`);
  if(!res.ok)return;
  const data=await res.json();
  const src=data.download_url;
  const top=$(".logo"), hero=$(".heroLogo");
  if(top)top.innerHTML=`<img src="${src}" alt="Логотип">`;
  if(hero)hero.innerHTML=`<img src="${src}" alt="Логотип">`;
 }catch(e){}
}
function render(){
 const q=query.trim().toLowerCase();
 shown=q?all.filter(x=>x.name.toLowerCase().includes(q)):all;
 $("#counter").textContent=`${shown.length} ${shown.length===1?"товар":"товарів"}`;
 $("#grid").innerHTML=shown.length?shown.map((x,i)=>`
 <article class="card" data-i="${i}">
  <div class="pic"><img src="${x.src}" loading="lazy" alt="${escapeHtml(x.name)}"></div>
  <div class="info"><h3>Будівельний матеріал</h3><p>КОНСУЛЬТАЦІЯ ТА ЗАМОВЛЕННЯ — ЗА ТЕЛЕФОНОМ</p></div>
 </article>`).join(""):`<div class="empty">ФОТО ЩЕ НЕ ДОДАНІ.<br>ДОДАЙТЕ ВСІ ФОТО У ПАПКУ <b>photos</b>.</div>`;
 $("#grid").querySelectorAll(".card").forEach(c=>c.onclick=()=>open(+c.dataset.i));
}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function open(i){index=i;$("#big").src=shown[index].src;$("#viewer").hidden=false}
function step(d){if(!shown.length)return;index=(index+d+shown.length)%shown.length;$("#big").src=shown[index].src}
$("#search").addEventListener("input",e=>{query=e.target.value;render()});
$("#close").onclick=()=>$("#viewer").hidden=true;
$("#prev").onclick=()=>step(-1);$("#next").onclick=()=>step(1);
$("#viewer").addEventListener("click",e=>{if(e.target.id==="viewer")$("#viewer").hidden=true});
document.addEventListener("keydown",e=>{if(e.key==="Escape")$("#viewer").hidden=true;if(e.key==="ArrowLeft")step(-1);if(e.key==="ArrowRight")step(1)});
load();
