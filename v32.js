// V32 — Живая линия: как меняются темы и карты
(function(){
  const H="cardsKnownHistory",P="cardsKnownProfile";
  const esc=s=>String(s??"").replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
  const read=()=>{try{return JSON.parse(localStorage.getItem(H)||"[]")}catch(e){return[]}};
  const profile=()=>{try{return JSON.parse(localStorage.getItem(P)||"{}")}catch(e){return{}}};
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
  function ensure(){
    if(document.getElementById("path"))return;
    const nav=document.querySelector(".nav"),main=document.querySelector("main");if(!main)return;
    if(nav&&!nav.querySelector('[data-screen="path"]')){const b=document.createElement("button");b.className="nav-item";b.dataset.screen="path";b.innerHTML="<b>∿</b><span>Путь</span>";nav.appendChild(b)}
    const s=document.createElement("section");s.id="path";s.className="screen";
    s.innerHTML='<div class="section-title"><div><small>ЛИЧНАЯ ИСТОРИЯ</small><h2>Твой путь</h2></div><span>32</span></div><p class="lead">Посмотри не только на то, что выпадало, но и на то, как менялся сам вопрос.</p><div id="v31Path"></div>';
    main.appendChild(s);render();
  }
  function render(){
    const root=document.getElementById("v31Path");if(!root)return;
    const h=read(),p=profile(),counts=p.topics||{};
    const topics=Object.keys(counts).sort((a,b)=>(counts[b]||0)-(counts[a]||0));
    let selected=root.dataset.topic||topics[0]||"Личное";
    if(!topics.includes(selected)&&topics.length)selected=topics[0];
    const rows=h.map((x,i)=>({x,i,t:topic(x.question||x.q)})).filter(o=>o.t===selected).reverse();
    const cardCounts={};rows.forEach(o=>(o.x.cards||o.x.nums||[]).forEach(n=>cardCounts[n]=(cardCounts[n]||0)+1));
    const recurring=Object.entries(cardCounts).sort((a,b)=>b[1]-a[1]).slice(0,4);
    let html='<div class="v32-select"><small>СМОТРЕТЬ ТЕМУ</small><div>'+topics.map(t=>'<button class="'+(t===selected?"active":"")+'" data-v32-topic="'+esc(t)+'">'+esc(t)+' <i>'+counts[t]+'</i></button>').join("")+'</div></div>';
    if(!rows.length){html+='<div class="v31-empty"><b>Эта тема ещё не оставила след.</b><p>Она появится здесь после первого чтения.</p></div>';root.innerHTML=html;return}
    html+='<div class="v32-hero"><small>ДИНАМИКА ТЕМЫ</small><b>'+esc(selected)+'</b><p>'+rows.length+' чтений · от первого вопроса к последнему</p></div>';
    html+='<div class="v32-evolution"><small class="v31-kicker">КАК МЕНЯЛСЯ ВОПРОС</small><div class="v32-steps">'+rows.map((o,j)=>{const q=String(o.x.question||o.x.q||"Без вопроса");return '<article class="v32-step"><span>'+String(j+1).padStart(2,"0")+'</span><div><small>'+esc(o.x.fullDate||o.x.date||"")+'</small><p>«'+esc(q.slice(0,180))+'»</p><div>'+((o.x.cards||o.x.nums||[]).map(n=>'<button data-card-open="'+n+'">'+String(n).padStart(2,"0")+' · '+esc(title(n))+'</button>').join(""))+'</div></div></article>'}).join("")+'</div></div>';
    if(recurring.length)html+='<div class="v32-evolution"><small class="v31-kicker">КАРТЫ, КОТОРЫЕ ПОВТОРЯЛИСЬ В ЭТОЙ ТЕМЕ</small><div class="v32-recurrence">'+recurring.map(x=>'<button data-card-open="'+x[0]+'"><span>'+String(x[0]).padStart(2,"0")+'</span><b>'+esc(title(+x[0]))+'</b><i>'+x[1]+'×</i></button>').join("")+'</div></div>';
    root.innerHTML=html;root.dataset.topic=selected;
  }
  document.addEventListener("click",e=>{
    if(e.target.closest('[data-screen="path"]')){ensure();setTimeout(render,40);return}
    const t=e.target.closest("[data-v32-topic]");if(t){const r=document.getElementById("v31Path");if(r)r.dataset.topic=t.dataset.v32Topic;render();return}
  });
  window.addEventListener("storage",render);setTimeout(ensure,180);
})();