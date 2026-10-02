(() => {
  'use strict';
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const PEXELS='https://www.pexels.com/@himanshu-singh-148036179/';
  const items=[
    {key:'all',label:'All Work',title:'A frame is a decision.',description:'A growing archive of the moments, people, colours and stories I choose to keep.',tags:['Light','Motion','People','Culture']},
    {key:'events',label:'Events',title:'Moments before they disappear.',description:'People, atmosphere, celebration and the honest moments between planned frames.',tags:['Energy','Crowds','Emotion','Live']},
    {key:'street',label:'Street',title:'Kashi has no pause button.',description:'Lanes, faces, shadows, texture and the little moments that happen only once.',tags:['Kashi','Lanes','Light','Life']},
    {key:'editorial',label:'Editorial',title:'Built with light. Finished in frame.',description:'Fashion, concepts, details and compositions made to carry a mood.',tags:['Fashion','Concept','Form','Light']},
    {key:'portrait',label:'Portrait / Muse',title:'People first. Pose second.',description:'Portraits that keep personality in the room, not just symmetry in the frame.',tags:['Character','Expression','People','Muse']},
    {key:'holi',label:'Holi / Culture',title:'Colour with no quiet mode.',description:'Festival energy, culture, movement and the beautiful chaos of celebrating together.',tags:['Colour','Culture','Movement','Joy']}
  ];
  let section=0,work=0,locked=false,doors=true,fast=false;
  const mobile=()=>matchMedia('(max-width:768px)').matches;
  function dock(){const d=$('#dock');if(!d)return;d.innerHTML=['Home','About','Work','Contact'].map((x,i)=>`<button class="dock-btn ${i===0?'active':''}" data-go="${i}">${x}</button>`).join('');$$('.dock-btn').forEach(b=>b.onclick=()=>go(+b.dataset.go));}
  function number(){const n=$('#secNo');if(n)n.textContent=`${String(section+1).padStart(2,'0')} / 04`;}
  function go(n){section=Math.max(0,Math.min(3,n));$$('.dock-btn').forEach((b,i)=>b.classList.toggle('active',i===section));number();if(mobile()){const t=document.querySelector(`[data-section="${section}"]`);if(t)t.scrollIntoView({behavior:'smooth',block:'start'});}else{$('#track').style.transform=`translateY(-${section*100}%)`;}}
  function frames(item){return Array.from({length:4},(_,i)=>`<article class="frame"><div class="frame-content"><span class="frame-code">${String(i+1).padStart(2,'0')} / ${item.label.toUpperCase()}</span><h4>${['Light finds its way.','Between the moments.','A story in one frame.','Keep the feeling.'][i]}</h4><p>ADD PHOTOGRAPH HERE</p></div></article>`).join('');}
  function renderWork(){const tabs=$('#workTabs'),copy=$('#workCopy'),gallery=$('#workGallery'),item=items[work];if(!tabs||!copy||!gallery)return;tabs.innerHTML=items.map((x,i)=>`<button class="work-tab ${i===work?'active':''}" data-work="${i}"><small>STN-${String(i+1).padStart(2,'0')}</small><strong>${x.label}</strong></button>`).join('');$$('.work-tab').forEach(b=>b.onclick=()=>{work=+b.dataset.work;renderWork();openDoors();});copy.innerHTML=`<div class="work-copy"><span class="kicker">${item.label.toUpperCase()}</span><h3>${item.title}</h3><p>${item.description}</p><div class="work-tags">${item.tags.map(t=>`<span>${t}</span>`).join('')}</div></div>`;gallery.innerHTML=frames(item);}
  function setDoors(open){doors=open;const d=$('#doors'),b=$('#doorBtn');if(d)d.classList.toggle('shut',open);if(b)b.textContent=open?'Close Doors ⇥':'Open Doors ⇤';}
  function openDoors(){setDoors(true)}
  function shutter(){fast=!fast;const v=fast?'1/500s':'1/15s';if($('#shutterTxt'))$('#shutterTxt').textContent=v;if($('#hudShutter'))$('#hudShutter').textContent=v;}
  function observer(){if(!mobile())return;const io=new IntersectionObserver(es=>{const e=es.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!e)return;section=+e.target.dataset.section;$$('.dock-btn').forEach((b,i)=>b.classList.toggle('active',i===section));number();},{threshold:.55});$$('[data-section]').forEach(x=>io.observe(x));}
  function desktopWheel(e){if(mobile())return;if(Math.abs(e.deltaY)<20||locked)return;e.preventDefault();const n=Math.max(0,Math.min(3,section+(e.deltaY>0?1:-1)));if(n===section)return;locked=true;go(n);setTimeout(()=>locked=false,850);}
  function keys(e){if(mobile()||locked)return;if(['INPUT','TEXTAREA'].includes(document.activeElement?.tagName))return;let n=null;if(e.key==='ArrowDown'||e.key==='PageDown'||e.key===' ')n=section+1;if(e.key==='ArrowUp'||e.key==='PageUp')n=section-1;if(e.key==='Home')n=0;if(e.key==='End')n=3;if(n===null)return;e.preventDefault();locked=true;go(n);setTimeout(()=>locked=false,850);}
  function init(){dock();renderWork();number();$('#pexelsLink')?.setAttribute('href',PEXELS);$('#doorBtn')?.addEventListener('click',()=>setDoors(!doors));$('#openDoorsInline')?.addEventListener('click',openDoors);$('#shutterBtn')?.addEventListener('click',shutter);$$('[data-go]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();go(+b.dataset.go)}));window.addEventListener('wheel',desktopWheel,{passive:false});window.addEventListener('keydown',keys);observer();if(!mobile())go(0);}
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init,{once:true}):init();
})();
