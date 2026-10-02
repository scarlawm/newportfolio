(() => {
  'use strict';
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const PEXELS='https://www.pexels.com/@himanshu-singh-148036179/';
  const items=[
    {label:'Events',title:'Moments before they disappear.',description:'Logon ki energy, roshni aur woh pal jo dobara bilkul waise nahi aate.',tags:['Energy','Crowds','Emotion','Live']},
    {label:'Street',title:'Kashi has no pause button.',description:'Gali, ghat, chehre aur roshni. Bas aankh taiyaar honi chahiye.',tags:['Kashi','Lanes','Light','Life']},
    {label:'Editorial',title:'Thoda style, poora frame.',description:'Fashion, concepts aur clean compositions jahan mood sabse pehle dikhe.',tags:['Fashion','Concept','Form','Light']},
    {label:'Portrait / Muse',title:'Chehra bole, camera sune.',description:'Portraits jo pose se zyada insaan ko yaad rakhte hain.',tags:['Character','Expression','People','Muse']},
    {label:'Culture',title:'Rang, riwaaz aur raunak.',description:'Holi, festivals aur culture ke woh frames jahan camera bhi thoda nachta hai.',tags:['Colour','Culture','Movement','Joy']}
  ];
  let work=0,closed=true,fast=false;
  const sections=()=>$$('[data-section]');

  function forceHome(){
    const track=$('#track');
    if(location.hash) history.replaceState(null,'',location.pathname+location.search);
    window.scrollTo(0,0);
    if(track) track.scrollTo({top:0,left:0,behavior:'auto'});
    sections()[0]?.scrollIntoView({behavior:'auto',block:'start'});
  }

  function dock(){
    const d=$('#dock');
    if(!d)return;
    d.innerHTML=['Home','About','Work','Pexels','Contact'].map((x,i)=>`<button class="dock-btn ${i===0?'active':''}" data-go="${i}">${x}</button>`).join('');
    $$('.dock-btn').forEach(b=>b.onclick=()=>go(+b.dataset.go));
  }
  function number(i=0){const n=$('#secNo');if(n)n.textContent=`${String(i+1).padStart(2,'0')} / ${String(sections().length).padStart(2,'0')}`;}
  function go(i){const list=sections();const target=list[Math.max(0,Math.min(list.length-1,i))];if(target)target.scrollIntoView({behavior:'smooth',block:'start'});}
  function frameMarkup(item,i){return `<article class="frame"><div class="frame-content"><span class="frame-code">${String(i+1).padStart(2,'0')} / ${item.label.toUpperCase()}</span><h4>${['Light finds its way.','Beech ke pal.','Kahani ek frame mein.','Feeling ko rehne do.'][i]}</h4><p>YOUR PHOTOGRAPH HERE</p></div></article>`}
  function renderWork(){const gallery=$('#workGallery');if(!gallery)return;gallery.innerHTML=items.map((item,i)=>`<article class="work-slide" data-work-slide="${i}"><div class="work-copy"><span class="kicker">${item.label.toUpperCase()}</span><h3>${item.title}</h3><p>${item.description}</p><div class="work-tags">${item.tags.map(t=>`<span>${t}</span>`).join('')}</div><small class="work-hint">SWIPE / SCROLL →</small></div><div class="slide-gallery">${[0,1,2,3].map(n=>frameMarkup(item,n)).join('')}</div></article>`).join('');gallery.scrollLeft=0;gallery.onscroll=()=>{const i=Math.round(gallery.scrollLeft/gallery.clientWidth);if(i!==work){work=i;syncTabs();}};syncTabs();}
  function renderTabs(){const t=$('#workTabs');if(!t)return;t.innerHTML=items.map((x,i)=>`<button class="work-tab ${i===work?'active':''}" data-work="${i}"><small>STN-${String(i+1).padStart(2,'0')}</small><strong>${x.label}</strong></button>`).join('');$$('.work-tab').forEach(b=>b.onclick=()=>scrollWork(+b.dataset.work));}
  function syncTabs(){renderTabs();const tabs=$$('.work-tab');if(tabs[work])tabs[work].scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});}
  function scrollWork(i){work=Math.max(0,Math.min(items.length-1,i));const g=$('#workGallery');if(g)g.scrollTo({left:work*g.clientWidth,behavior:'smooth'});syncTabs();}
  function setDoors(isClosed){closed=isClosed;const d=$('#doors'),b=$('#doorBtn');if(d)d.classList.toggle('shut',isClosed);if(b)b.textContent=isClosed?'Open Doors ⇤':'Close Doors ⇥';if(isClosed){const g=$('#workGallery');if(g)g.scrollTo({left:0,behavior:'smooth'});work=0;syncTabs();}}
  function openDoors(){setDoors(false);setTimeout(()=>scrollWork(0),150)}
  function shutter(){fast=!fast;const v=fast?'1/500s':'1/15s';if($('#shutterTxt'))$('#shutterTxt').textContent=v;if($('#hudShutter'))$('#hudShutter').textContent=v;}
  function observe(){const io=new IntersectionObserver(es=>{const e=es.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!e)return;const i=+e.target.dataset.section;number(i);$$('.dock-btn').forEach((b,n)=>b.classList.toggle('active',n===i));},{threshold:.55});sections().forEach(s=>io.observe(s));}
  function desktopWorkWheel(e){if(closed)return;const r=$('#workGallery')?.getBoundingClientRect();if(!r||e.clientY<r.top||e.clientY>r.bottom)return;const delta=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;if(Math.abs(delta)<10)return;e.preventDefault();scrollWork(work+(delta>0?1:-1));}
  function init(){
    forceHome();
    dock();renderWork();
    $('#pexelsLink')?.setAttribute('href',PEXELS);
    $('#doorBtn')?.addEventListener('click',()=>setDoors(!closed));
    $('#openDoorsInline')?.addEventListener('click',openDoors);
    $('#shutterBtn')?.addEventListener('click',shutter);
    $$('[data-go]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();go(+b.dataset.go)}));
    window.addEventListener('wheel',desktopWorkWheel,{passive:false});
    observe();
    window.addEventListener('pageshow',forceHome);
  }
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init,{once:true}):init();
})();
