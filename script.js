let images=[], filtered=[], pos=0;
const $=s=>document.querySelector(s);

function repo(){
 const h=location.hostname, p=location.pathname.split("/").filter(Boolean);
 return h.endsWith(".github.io") ? {o:h.split(".")[0],r:p[0]||""} : null;
}
async function getPhotos(){
 const r=repo();
 if(!r) return [];
 try{
   const q=await fetch(`https://api.github.com/repos/${r.o}/${r.r}/contents/photos?ref=main`);
   if(!q.ok) return [];
   const a=await q.json();
   return Array.isArray(a)
     ? a.filter(x=>x.type==="file" && /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(x.name))
          .sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true}))
          .map(x=>({src:x.download_url,name:x.name}))
     : [];
 }catch(e){ return []; }
}
async function load(){
 images=await getPhotos();
 filtered=images;
 render();
}
function render(){
 const grid=$("#grid");
 grid.innerHTML=filtered.length
 ? filtered.map((x,i)=>`<article class="card" data-i="${i}">
      <div class="pic"><img src="${x.src}" loading="lazy" alt="${x.name}"></div>
      <div class="info"><h3>Будівельний матеріал</h3><p>КОНСУЛЬТАЦІЯ ТА ЗАМОВЛЕННЯ — ЗА ТЕЛЕФОНОМ</p></div>
    </article>`).join("")
 : `<div class="empty">ФОТО ЩЕ НЕ ДОДАНІ.<br>ЗАВАНТАЖТЕ ВСІ ФОТО У ПАПКУ <b>photos</b>.</div>`;
 grid.querySelectorAll(".card").forEach(x=>x.onclick=()=>open(+x.dataset.i));
}
function open(i){pos=i;$("#big").src=filtered[pos].src;$("#viewer").hidden=false}
function step(d){
 if(!filtered.length)return;
 pos=(pos+d+filtered.length)%filtered.length;
 $("#big").src=filtered[pos].src;
}
$("#close").onclick=()=>$("#viewer").hidden=true;
$("#prev").onclick=()=>step(-1);
$("#next").onclick=()=>step(1);
document.addEventListener("keydown",e=>{
 if(e.key==="Escape")$("#viewer").hidden=true;
 if(e.key==="ArrowLeft")step(-1);
 if(e.key==="ArrowRight")step(1);
});
load();
