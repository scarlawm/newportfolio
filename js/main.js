(() => {
  'use strict';
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const PEXELS='https://www.pexels.com/@himanshu-singh-148036179/';
  const items=[
    {label:'All Work',title:'A frame is a decision.',description:'A growing archive of moments, people, colours and stories I choose to keep.',tags:['Light','Motion','People','Culture']},
    {label:'Events',title:'Moments before they disappear.',description:'People, atmosphere, celebration and the honest moments between planned frames.',tags:['Energy','Crowds','Emotion','Live']},
    {label:'Street',title:'Kashi has no pause button.',description:'Lanes, faces, shadows, texture and the little moments that happen only once.',tags:['Kashi','Lanes','Light','Life']},
    {label:'Editorial',title:'Built with light. Finished in frame.',description:'Fashion, concepts, details and compositions made to carry a mood.',tags:['Fashion','Concept','Form','Light']},
    {label:'Portrait / Muse',title:'People first. Pose second.',description:'Portraits that keep personality in the room, not just symmetry in the frame.',tags:['Character','Expression','People','Muse']},
    {label:'Holi / Culture',title:'Colour with no quiet mode.',description:'Festival energy, culture, movement and the beautiful chaos of celebrating together.',tags:['Colour','Culture','Movement','Joy']}
  ];
  let work=0,doors=true,fast=false;
  const sections=()=>$$('[data-section]');
  function dock(){const d=$('#dock');if(!d)return;d.innerHTML=['Home','About','Work','Contact'].map((x,i)=>`<button class="dock-btn ${i===0?'active':''}" data-go="${i}">${x}</button>`).join('');$$('.dock-btn').forEach(b=>b.onclick=()=>go(+b.dataset.go));}
  function number(i=0){const n=$('#secNo');if(n)n.textContent=`${String(i+1).padStart(2,'0')} / 04`;}
  function go(i){const target=sections()[Math.max(0,Math.min(3,i))];if(target)target.scrollIntoView({behavior:'smooth',block:'start'});}
  function renderWork(){const tabs=$('#workTabs'),copy=$('#workCopy'),gallery=$('#workGallery'),item=items[work];if(!tabs||!copy||!gallery)return;tabs.innerHTML=items.map((x,i)=>`<button class="work-tab ${i===work?'active':''}" data-work="${i}"><small>STN-${String(i+1).padStart(2,'0')}</small><strong>${x.label}</strong></button>`).join('');$$('.work-tab').forEach(b=>b.onclick=()=>{work=+b.dataset.work;renderWork();setDoors(false)});copy.innerHTML=`<div class="work-copy"><span class="kicker">${item.label.toUpperCase()}</span><h3>${item.title}</h3><p>${item.description}</p><div class="work-tags">${item.tags.map(t=>`<span>${t}</span>`).join('')}</div></div>`;gallery.innerHTML=Array.from({length:4},(_,i)=>`<article class="frame"><div class="frame-content"><span class="frame-code">${String(i+1).padStart(2,'0')} / ${item.label.toUpperCase()}</span><h4>${['Light finds its way.','Between the moments.','A story in one frame.','Keep the feeling.'][i]}</h4><p>YOUR PHOTOGRAPH HERE</p></div></article>`).join('');}
  function setDoors(open){doors=open;const d=$('#doors'),b=$('#doorBtn');if(d)d.classList.toggle('shut',open);if(b)b.textContent=open?'Open Doors ⇤':'Close Doors ⇥';}
  function shutter(){fast=!fast;const v=fast?'1/500s':'1/15s';if($('#shutterTxt'))$('#shutterTxt').textContent=v;if($('#hudShutter'))$('#hudShutter').textContent=v;}
  function observe(){const io=new IntersectionObserver(es=>{const e=es.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!e)return;const i=+e.target.dataset.section;number(i);$$('.dock-btn').forEach((b,n)=>b.classList.toggle('active',n===i));},{threshold:.55});sections().forEach(s=>io.observe(s));}
  function init(){dock();renderWork();$('#pexelsLink')?.setAttribute('href',PEXELS);$('#doorBtn')?.addEventListener('click',()=>setDoors(!doors));$('#openDoorsInline')?.addEventListener('click',()=>setDoors(false));$('#shutterBtn')?.addEventListener('click',shutter);$$('[data-go]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();go(+b.dataset.go)}));observe();}
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init,{once:true}):init();
})();