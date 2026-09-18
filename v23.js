// V23 — Карта дня: одна карта на календарный день
(function(){
  const KEY="cardsKnownDaily";
  const pad=n=>String(n).padStart(2,"0");
  const today=()=>{const d=new Date();return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())};
  const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0)};
  const dailyNumber=()=>hash("cards-known-daily|"+today())%60+1;
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){return{}}};
  const write=o=>localStorage.setItem(KEY,JSON.stringify(o));
  const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\\\"":"&quot;","'":"&#39;"}[m]));
  const img=n=>"cards/"+pad(n)+".jpg";
  const card=n=>window.card?.(n);

  function ensure(){
    let s=document.getElementById("daily");
    if(s)return s;
    s=document.createElement("section");s.id="daily";s.className="screen";
    s.innerHTML='<button class="back" data-screen="home">← На главную</button><div class="daily-wrap">'+
      '<div class="ritual-meta"><span>КАРТА ДНЯ</span><em id="dailyDate"></em></div>'+
      '<div class="daily-copy"><small>ОДИН ОБРАЗ НА СЕГОДНЯ</small><h2 id="dailyTitle">Карта дня</h2><p id="dailySub">Один и тот же образ остаётся с тобой до конца дня.</p></div>'+
      '<div class="daily-stage"><div id="dailyCard" class="daily-card"><div class="back-design"><b>К</b><span>КАРТЫ ЗНАЮТ</span><i>✦</i></div></div></div>'+
      '<button id="dailyOpen" class="reveal">Открыть карту <span>↓</span></button><div id="dailyReading" class="daily-reading"></div></div>';
    document.querySelector("main").appendChild(s);return s;
  }
  function render(){
    const s=ensure(), n=dailyNumber(), c=card(n), d=read(), date=today();
    document.getElementById("dailyDate").textContent=new Date().toLocaleDateString("ru-RU",{day:"2-digit",month:"long",year:"numeric"});
    if(d.date===date&&d.opened){openCard(false);return}
    document.getElementById("dailyTitle").textContent="Твоя карта ещё закрыта.";
    document.getElementById("dailySub").textContent="Открой её, когда захочешь начать день с одного ясного образа.";
  }
  function openCard(ritual=true){
    const n=dailyNumber(),c=card(n);if(!c)return;
    const s=ensure();
    if(ritual){s.classList.add("opening");if(typeof ritualSound==="function")ritualSound();if(typeof haptic==="function")haptic();if(typeof magicFX==="function")magicFX();setTimeout(()=>s.classList.remove("opening"),1200)}
    document.getElementById("dailyCard").className="daily-card open";
    document.getElementById("dailyCard").innerHTML='<img src="'+img(n)+'" alt="'+esc(c.title)+'" onerror="this.style.display=\'none\';this.parentElement.classList.add(\'no-image\')">';
    document.getElementById("dailyTitle").textContent=c.title;
    document.getElementById("dailySub").textContent=window.catNames?.[c.cat]||"КАРТЫ ЗНАЮТ";
    document.getElementById("dailyOpen").hidden=true;
    document.getElementById("dailyReading").innerHTML='<div class="daily-answer"><small>СМЫСЛ НА СЕГОДНЯ</small><p>'+esc(c.meaning)+'</p></div><div class="daily-answer"><small>ЧТО НЕ УПУСТИТЬ</small><p>'+esc(window.shadows?.[n-1]||"")+'</p></div><div class="daily-answer"><small>ОДИН ШАГ</small><p>'+esc(window.directions?.[n-1]||"")+'</p></div><div class="daily-prompt"><small>ВОПРОС ДНЯ</small><p>'+(esc(window.questionCards?.[n-1]||"Что этот образ помогает тебе увидеть сегодня?"))+'</p></div><button class="daily-save" data-daily-save="'+n+'">☆ Добавить в мою колоду</button>';
    const h=read();h.date=today();h.card=n;h.opened=true;write(h);
  }
  document.addEventListener("click",e=>{
    const b=e.target.closest("#dailyOpen");if(b){openCard(true);return}
    const save=e.target.closest("[data-daily-save]");if(save){const n=+save.dataset.dailySave;let a=[];try{a=JSON.parse(localStorage.getItem("cardsKnownMyDeck")||"[]")}catch(x){};if(!a.includes(n))a.unshift(n);localStorage.setItem("cardsKnownMyDeck",JSON.stringify(a.slice(0,60)));save.textContent="★ В моей колоде";save.classList.add("saved");return}
    const go=e.target.closest('[data-screen="daily"]');if(go){setTimeout(render,0)}
  });
  const home=document.querySelector(".home-links");
  if(home&&!document.getElementById("dailyHomeLink")){
    const b=document.createElement("button");b.id="dailyHomeLink";b.dataset.screen="daily";b.className="daily-home-link";b.innerHTML='<span>03</span><b>Карта дня</b><i>→</i>';home.appendChild(b);
  }
  ensure();render();
})();
