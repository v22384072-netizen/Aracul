// V31 — Путь: визуальная история чтений
(function(){
  const KEY="cardsKnownHistory", PROFILE="cardsKnownProfile";
  const esc=s=>String(s??"").replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){return[]}};
  const profile=()=>{try{return JSON.parse(localStorage.getItem(PROFILE)||"{}")}catch(e){return{}}};
  const topic=q=>{const s=(q||"").toLowerCase();
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
  const shortDate=x=>{const d=new Date(x.date||"");return isNaN(d)?String(x.fullDate||x.date||"").split(",")[0]:d.toLocaleDateString("ru-RU",{day:"2-digit",month:"short"}).replace(".","")};
  function ensure(){
    if(document.getElementById("path"))return;
    const nav=document.querySelector(".nav"),main=document.querySelector("main");if(!main)return;
    if(nav&&!nav.querySelector('[data-screen="path"]')){const b=document.createElement("button");b.className="nav-item";b.dataset.screen="path";b.innerHTML="<b>∿</b><span>Путь</span>";nav.appendChild(b)}
    const s=document.createElement("section");s.id="path";s.className="screen";
    s.innerHTML='<div class="section-title"><div><small>ЛИЧНАЯ ИСТОРИЯ</small><h2>Твой путь</h2></div><span>31</span></div><p class="lead">След вопросов, к которым ты возвращался, и карт, которые становились заметными.</p><div id="v31Path"></div>';
    main.appendChild(s);render();
  }
  function render(){
    const root=document.getElementById("v31Path");if(!root)return;
    const h=read(),p=profile(),topics=Object.entries(p.topics||{}).sort((a,b)=>b[1]-a[1]),cards=Object.entries(p.cards||{}).sort((a,b)=>b[1]-a[1]).slice(0,5),recent=h.slice(0,10);
    let html='<div class="v31-stats"><div><small>ЧТЕНИЙ</small><b>'+String(p.questions||h.length||0)+'</b></div><div><small>ТЕМ</small><b>'+topics.length+'</b></div><div><small>ПОВТОРНЫХ КАРТ</small><b>'+Object.keys(p.cards||{}).filter(k=>(p.cards[k]||0)>1).length+'</b></div></div>';
    if(topics.length)html+='<div class="v31-section"><small class="v31-kicker">ТЕМЫ, К КОТОРЫМ ТЫ ВОЗВРАЩАЛСЯ</small><div class="v31-topics">'+topics.slice(0,6).map(x=>'<span>'+esc(x[0])+' <i>'+x[1]+'</i></span>').join("")+'</div></div>';
    html+='<div class="v31-section"><small class="v31-kicker">ПОСЛЕДНИЕ ЧТЕНИЯ</small>';
    if(!recent.length)html+='<div class="v31-empty"><b>Путь ещё не начался.</b><p>Первый вопрос появится здесь после чтения.</p><button data-screen="home">Задать вопрос</button></div>';
    else html+='<div class="v31-timeline">'+recent.map((x,i)=>{const nums=x.cards||x.nums||[],t=topic(x.question||x.q);return '<article class="v31-node"><div class="v31-dot"></div><div class="v31-line"></div><div class="v31-node-head"><small>'+esc(shortDate(x))+'</small><span>'+esc(t)+'</span></div><p>«'+esc(String(x.question||x.q||"Без вопроса").slice(0,150))+'»</p><div class="v31-cards">'+nums.map(n=>'<button data-card-open="'+n+'">'+String(n).padStart(2,"0")+' · '+esc(title(n))+'</button>').join("")+'</div><button class="v31-open" data-v31-open="'+i+'">Открыть чтение →</button></article>}).join("")+'</div></div>';
    if(cards.length)html+='<div class="v31-section"><small class="v31-kicker">КАРТЫ, КОТОРЫЕ ОСТАВИЛИ СЛЕД</small><div class="v31-card-echo">'+cards.map(x=>'<button data-card-open="'+x[0]+'"><span>'+String(x[0]).padStart(2,"0")+'</span><b>'+esc(title(+x[0]))+'</b><i>'+x[1]+'×</i></button>').join("")+'</div></div>';
    root.innerHTML=html;
  }
  document.addEventListener("click",e=>{
    if(e.target.closest('[data-screen="path"]')){ensure();setTimeout(render,40);return}
    const o=e.target.closest("[data-v31-open]");if(o){const i=+o.dataset.v31Open;if(typeof window.showScreen==="function")window.showScreen("history");setTimeout(()=>{const b=document.querySelector('[data-history-open="'+i+'"]');if(b)b.click()},80)}
  });
  window.addEventListener("storage",render);setTimeout(ensure,180);
})();