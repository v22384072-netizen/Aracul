/* V31.1 — stable personal path, kept compatible with later path layers */
(function(){
  "use strict";
  const KEY="cardsKnownHistory";
  const PROFILE="cardsKnownProfile";
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){return[]}};
  const profile=()=>{try{return JSON.parse(localStorage.getItem(PROFILE)||"{}")}catch(e){return{}}};
  const esc=s=>String(s??"").replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
  const topic=q=>{
    const s=String(q||"").toLowerCase();
    if(/деньг|зарплат|доход|долг|кредит|цена|заработ/.test(s))return"Деньги";
    if(/работ|карьер|бизнес|клиент|проект|профес/.test(s))return"Работа";
    if(/отнош|любов|партн|муж|жен|семь|дружб/.test(s))return"Отношения";
    if(/переезд|место|город|жиль|уехать/.test(s))return"Перемены";
    if(/страх|боюсь|тревог|сомнева/.test(s))return"Страх и сомнения";
    if(/выбрать|выбор|вариант|решен|стоит ли/.test(s))return"Выбор";
    if(/когда|срок|через сколько|как скоро/.test(s))return"Сроки";
    return"Личное";
  };
  const title=n=>window.titles?.[n-1]||("Карта "+n);
  function ensure(){
    let root=document.getElementById("path");
    if(!root){
      root=document.createElement("section");
      root.id="path";root.className="screen";
      const main=document.querySelector("main");
      if(!main)return;
      main.appendChild(root);
    }
    render();
  }
  function render(){
    const root=document.getElementById("path");if(!root)return;
    const h=read(),p=profile(),recent=h.slice(0,10);
    const counts=p.topics||{};
    const topics=Object.entries(counts).sort((a,b)=>b[1]-a[1]);
    let html='<div class="section-title"><div><small>ЛИЧНАЯ ИСТОРИЯ</small><h2>Твой путь</h2></div><span>31</span></div>';
    html+='<p class="lead">След вопросов, к которым ты возвращался, и карт, которые становились заметными.</p>';
    html+='<div class="v31-stats"><div><small>ЧТЕНИЙ</small><b>'+String(p.questions||h.length||0)+'</b></div><div><small>ТЕМ</small><b>'+String(topics.length)+'</b></div><div><small>КАРТ</small><b>'+String(Object.keys(p.cards||{}).length)+'</b></div></div>';
    if(!recent.length){
      html+='<div class="v31-empty"><b>Путь ещё не начался.</b><p>Первый вопрос появится здесь после чтения.</p><button data-screen="home">Задать вопрос</button></div>';
    }else{
      html+='<div class="v31-section"><small class="v31-kicker">ПОСЛЕДНИЕ ЧТЕНИЯ</small><div class="v31-timeline">';
      recent.forEach((x,i)=>{
        const nums=x.cards||x.nums||[];
        const q=String(x.question||x.q||"Без вопроса");
        html+='<article class="v31-node"><div class="v31-dot"></div><div class="v31-node-head"><small>'+esc(x.fullDate||x.date||"")+'</small><span>'+esc(topic(q))+'</span></div><p>«'+esc(q.slice(0,150))+'»</p><div class="v31-cards">';
        nums.forEach(n=>{html+='<button data-card-open="'+n+'">'+String(n).padStart(2,"0")+' · '+esc(title(+n))+'</button>'});
        html+='</div><button class="v31-open" data-v31-open="'+i+'">Открыть чтение →</button></article>';
      });
      html+='</div></div>';
    }
    root.innerHTML=html;
  }
  document.addEventListener("click",e=>{
    const path=e.target.closest('[data-screen="path"]');
    if(path){ensure();setTimeout(render,20);return}
    const open=e.target.closest("[data-v31-open]");
    if(open){
      const i=Number(open.dataset.v31Open);
      if(typeof window.showScreen==="function")window.showScreen("history");
      setTimeout(()=>{
        const b=document.querySelector('[data-history-open="'+i+'"]');
        if(b)b.click();
      },80);
    }
  });
  window.addEventListener("storage",render);
  setTimeout(ensure,180);
})();