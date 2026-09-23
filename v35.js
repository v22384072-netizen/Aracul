/* V35 — stability rebuild: one interaction layer for the core app */
(function(){
  "use strict";

  const $=s=>document.querySelector(s);
  const $$=s=>Array.from(document.querySelectorAll(s));
  const pad=n=>String(n).padStart(2,"0");
  const safe=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
  const image=n=>"cards/"+pad(n)+".jpg";
  const BACK="cards/back.svg";
  const dailyKey="cardsKnownDaily";

  function cardData(n){
    try{return typeof window.card==="function"?window.card(n):{id:n,title:(window.titles||[])[n-1]||("Карта "+n),cat:(window.cats||[])[n-1],meaning:(window.meanings||[])[n-1]||""}}catch(e){
      return {id:n,title:(window.titles||[])[n-1]||("Карта "+n),meaning:""};
    }
  }

  function backHTML(cls){
    return '<img class="v35-card-back '+(cls||"")+'" src="'+BACK+'" alt="Рубашка колоды">';
  }

  function patchBacks(root=document){
    root.querySelectorAll(".back-design").forEach(el=>{
      if(!el.querySelector(".v35-card-back")) el.outerHTML=backHTML();
    });
    root.querySelectorAll(".v27-back").forEach(el=>{
      if(!el.querySelector(".v35-card-back")) el.innerHTML=backHTML("spread-back");
    });
    const draw=$("#drawCard");
    if(draw && !draw.classList.contains("open") && !draw.querySelector(".v35-card-back")){
      draw.innerHTML=backHTML();
    }
    const daily=$("#dailyCard");
    if(daily && !daily.classList.contains("open") && !daily.querySelector(".v35-card-back")){
      daily.innerHTML=backHTML();
    }
  }

  function screen(id){
    $$(".screen").forEach(s=>s.classList.toggle("active",s.id===id));
    $$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.screen===id));
    window.scrollTo(0,0);
  }
  window.showScreen=screen;

  function ensureDaily(){
    let s=$("#daily");
    if(s)return s;
    s=document.createElement("section");
    s.id="daily";s.className="screen";
    s.innerHTML=
      '<button class="back" data-screen="home">← На главную</button>'+
      '<div class="daily-wrap">'+
        '<div class="ritual-meta"><span>КАРТА ДНЯ</span><em id="v35DailyDate"></em></div>'+
        '<div class="daily-copy"><small>ОДИН ОБРАЗ НА СЕГОДНЯ</small><h2 id="v35DailyTitle">Карта дня</h2><p id="v35DailySub">Один образ остаётся с тобой до конца дня.</p></div>'+
        '<div class="daily-stage"><div id="dailyCard" class="daily-card">'+backHTML()+'</div></div>'+
        '<button id="dailyOpen" class="reveal">Открыть карту <span>↓</span></button>'+
        '<div id="dailyReading" class="daily-reading"></div>'+
      '</div>';
    $("main").appendChild(s);
    return s;
  }

  function today(){
    const d=new Date();
    return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
  }
  function dailyNumber(){
    let h=2166136261,s="cards-known-daily|"+today();
    for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
    return (h>>>0)%60+1;
  }

  function renderDaily(){
    const s=ensureDaily(),n=dailyNumber(),c=cardData(n);
    const d=new Date();
    const rec=(()=>{try{return JSON.parse(localStorage.getItem(dailyKey)||"{}")}catch(e){return{}}})();
    $("#v35DailyDate").textContent=d.toLocaleDateString("ru-RU",{day:"2-digit",month:"long",year:"numeric"});
    if(rec.date===today()&&rec.card===n&&rec.opened){openDaily(false);return}
    $("#v35DailyTitle").textContent="Твоя карта ещё закрыта.";
    $("#v35DailySub").textContent="Открой её, когда захочешь начать день с одного ясного образа.";
    const b=$("#dailyOpen");if(b)b.hidden=false;
    const dc=$("#dailyCard");if(dc){dc.className="daily-card";dc.innerHTML=backHTML()}
    $("#dailyReading").innerHTML="";
    patchBacks(s);
  }

  function openDaily(ritual){
    const n=dailyNumber(),c=cardData(n),s=ensureDaily();
    const dc=$("#dailyCard");
    if(!dc)return;
    if(ritual){
      s.classList.add("v35-daily-opening");
      setTimeout(()=>s.classList.remove("v35-daily-opening"),900);
    }
    dc.className="daily-card open";
    dc.innerHTML='<img src="'+image(n)+'" alt="'+safe(c.title)+'">';
    const im=dc.querySelector("img");
    im.onerror=function(){this.replaceWith(Object.assign(document.createElement("div"),{className:"v35-missing",textContent:pad(n)+" · "+c.title}))};
    $("#v35DailyTitle").textContent=c.title;
    $("#v35DailySub").textContent=(window.catNames&&c.cat!=null?window.catNames[c.cat]:"КАРТЫ ЗНАЮТ");
    const sh=(window.shadows||[])[n-1]||"";
    const dir=(window.directions||[])[n-1]||"";
    const q=(window.questionCards||[])[n-1]||"Что этот образ помогает тебе увидеть сегодня?";
    $("#dailyOpen").hidden=true;
    $("#dailyReading").innerHTML=
      '<div class="daily-answer"><small>СМЫСЛ НА СЕГОДНЯ</small><p>'+safe(c.meaning)+'</p></div>'+
      '<div class="daily-answer"><small>ЧТО НЕ УПУСТИТЬ</small><p>'+safe(sh)+'</p></div>'+
      '<div class="daily-answer"><small>ОДИН ШАГ</small><p>'+safe(dir)+'</p></div>'+
      '<div class="daily-prompt"><small>ВОПРОС ДНЯ</small><p>'+safe(q)+'</p></div>'+
      '<button class="daily-save" data-v35-daily-save="'+n+'">☆ Добавить в мою колоду</button>';
    localStorage.setItem(dailyKey,JSON.stringify({date:today(),card:n,opened:true,openedAt:new Date().toISOString()}));
  }

  function answer(n,q,c){
    try{
      if(typeof window.personalizedAnswer==="function"){
        const x=window.personalizedAnswer(n,q,c);
        if(x)return String(x);
      }
    }catch(e){}
    return "Образ «"+c.title+"» предлагает посмотреть на ситуацию через конкретный механизм. "+String(c.meaning||"")+" Проверь этот смысл одним реальным действием.";
  }

  function reveal(){
    const q=(window.v35Question||$("#question")?.value||"").trim();
    if(!q){screen("home");$("#question")?.focus();return}
    const n=Math.floor(Math.random()*60)+1,c=cardData(n),d=$("#draw");
    window.v35Question=q;
    d.classList.remove("listening","ready","chosen","reveal-focus");
    d.classList.add("opening","revealed");
    $("#drawStep").textContent="03 / 03";
    $("#drawTitle").textContent=c.title;
    $("#drawSub").textContent=(window.catNames&&c.cat!=null?window.catNames[c.cat]:"КАРТЫ ЗНАЮТ");
    const dc=$("#drawCard");
    dc.className="draw-card open";
    dc.innerHTML='<img src="'+image(n)+'" alt="'+safe(c.title)+'">';
    const im=dc.querySelector("img");
    im.onerror=function(){dc.innerHTML='<div class="v35-missing">'+pad(n)+' · '+safe(c.title)+'</div>';dc.classList.add("missing-card")};
    $("#revealBtn").hidden=true;
    const sh=(window.shadows||[])[n-1]||"";
    const dir=(window.directions||[])[n-1]||"";
    const qc=(window.questionCards||[])[n-1]||"";
    $("#reading").innerHTML=
      '<div class="reading-head"><div><small>ТВОЁ ЧТЕНИЕ</small><h3>Карта отвечает на твой вопрос</h3></div><span class="reading-index">'+pad(n)+' / 60</span></div>'+
      '<div class="reading-hero"><div class="reading-thumb"><img src="'+image(n)+'" alt="'+safe(c.title)+'"></div><div class="reading-card-meta"><small>'+(window.catNames&&c.cat!=null?safe(window.catNames[c.cat]):"")+'</small><h4>'+safe(c.title)+'</h4><p>«'+safe(q)+'»</p></div></div>'+
      '<div class="answer-intro"><small>ОТВЕТ ДЛЯ ТВОЕГО ВОПРОСА</small><h3>Не готовое предсказание — а взгляд на ситуацию через образ карты.</h3></div>'+
      '<div class="read-block"><small>СУТЬ ОТВЕТА</small><p>'+safe(answer(n,q,c))+'</p></div>'+
      '<div class="read-block"><small>ТЕНЬ, КОТОРУЮ ВАЖНО УВИДЕТЬ</small><p>'+safe(sh)+'</p></div>'+
      '<div class="read-block"><small>ТВОЁ НАПРАВЛЕНИЕ</small><p>'+safe(dir)+'</p></div>'+
      '<div class="read-block read-question"><small>ВОПРОС ОТ КАРТЫ</small><p>'+safe(qc)+'</p></div>'+
      '<div class="reading-close"><span>✦</span><b>Теперь выбери свой следующий шаг.</b><em>Карта показала направление. Решение остаётся за тобой.</em><button class="new-question" id="newQuestionBtn">Задать новый вопрос <i>→</i></button></div>';
    setTimeout(()=>d.classList.remove("opening"),900);
    try{localStorage.setItem("cardsKnownHistory",JSON.stringify([{q:q,nums:[n],date:new Date().toLocaleDateString("ru-RU",{day:"2-digit",month:"long"})},...JSON.parse(localStorage.getItem("cardsKnownHistory")||"[]")].slice(0,30)))}catch(e){}
    patchBacks();
    setTimeout(()=>$("#reading")?.scrollIntoView({behavior:"smooth",block:"start"}),120);
  }

  function ask(){
    const q=$("#question").value.trim();
    if(!q){$("#question").focus();return}
    window.v35Question=q;
    const d=$("#draw");
    d.classList.remove("revealed","opening","ready","chosen","reveal-focus");
    $("#drawStep").textContent="01 / 03";
    $("#drawTitle").textContent="Я слушаю.";
    $("#drawSub").textContent="Не меняй вопрос. Просто побудь с ним несколько секунд.";
    $("#drawCard").className="draw-card";
    $("#drawCard").innerHTML=backHTML();
    $("#reading").innerHTML="";
    $("#revealBtn").hidden=true;
    screen("draw");
    d.classList.add("listening");
    setTimeout(()=>{
      if(!d.classList.contains("active")||window.v35Question!==q)return;
      d.classList.remove("listening");d.classList.add("ready","chosen");
      $("#drawStep").textContent="02 / 03";
      $("#drawTitle").textContent="Карта выбрана.";
      $("#drawSub").textContent="Когда будешь готов — открой её.";
      $("#revealBtn").hidden=false;
      patchBacks();
    },1200);
  }

  function cleanNav(){
    const nav=$(".nav");if(!nav)return;
    nav.innerHTML=
      '<button class="nav-item active" data-screen="home"><b>К</b><span>Вопрос</span></button>'+
      '<button class="nav-item" data-screen="deck"><b>60</b><span>Колода</span></button>'+
      '<button class="nav-item" data-screen="spread"><b>+</b><span>Расклад</span></button>'+
      '<button class="nav-item" data-screen="daily"><b>01</b><span>Карта дня</span></button>'+
      '<button class="nav-item" data-screen="history"><b>↺</b><span>Архив</span></button>';
  }

  function addHomeTools(){
    const links=$(".home-links");if(!links)return;
    links.innerHTML=
      '<button data-screen="deck"><span>01</span><b>Вся колода</b><i>→</i></button>'+
      '<button data-screen="spread"><span>02</span><b>Расклад</b><i>→</i></button>'+
      '<button data-screen="daily"><span>03</span><b>Карта дня</b><i>→</i></button>'+
      '<button data-screen="mydeck"><span>04</span><b>Моя колода</b><i>→</i></button>';
  }

  function ensureMyDeck(){
    if($("#mydeck"))return;
    const s=document.createElement("section");s.id="mydeck";s.className="screen";
    s.innerHTML='<button class="back" data-screen="home">← На главную</button><div class="section-title"><div><small>ЛИЧНОЕ</small><h2>Моя колода</h2></div><span id="v35MyCount">00</span></div><p class="lead">Карты, которые ты решил оставить рядом.</p><div class="v35-personal-toolbar"><button id="v35PersonalClear">Очистить</button></div><div id="v35MyGrid" class="mydeck-grid"></div>';
    $("main").appendChild(s);
  }
  function renderMyDeck(){
    ensureMyDeck();
    let a=[];try{a=JSON.parse(localStorage.getItem("cardsKnownMyDeck")||"[]")}catch(e){}
    $("#v35MyCount").textContent=pad(a.length);
    const grid=$("#v35MyGrid");
    grid.innerHTML=a.length?a.map(n=>{const c=cardData(+n);return '<article class="mydeck-card"><button class="mydeck-art" data-v35-card="'+n+'"><img src="'+image(n)+'" alt="'+safe(c.title)+'"></button><div class="mydeck-info"><small>'+pad(n)+'</small><b>'+safe(c.title)+'</b><button class="mydeck-save saved" data-v35-remove="'+n+'">★ Убрать</button></div></article>'}).join(""):'<div class="empty">Твоя колода пока пуста.<br>Сохрани карту после чтения или в «Карте дня».</div>';
  }

  cleanNav();addHomeTools();ensureMyDeck();renderMyDeck();ensureDaily();

  // One capture-phase router. It prevents legacy layers from competing for the same controls.
  document.addEventListener("click",function(e){
    const target=e.target.closest("button,[data-screen]");
    if(!target)return;

    if(target.id==="askBtn"){e.preventDefault();e.stopImmediatePropagation();ask();return}
    if(target.id==="revealBtn"){e.preventDefault();e.stopImmediatePropagation();reveal();return}
    if(target.id==="dailyOpen"){e.preventDefault();e.stopImmediatePropagation();openDaily(true);return}
    if(target.id==="newQuestionBtn"){e.preventDefault();e.stopImmediatePropagation();screen("home");$("#question").value="";return}

    const save=target.closest("[data-v35-daily-save]");
    if(save){e.preventDefault();e.stopImmediatePropagation();let a=[];try{a=JSON.parse(localStorage.getItem("cardsKnownMyDeck")||"[]")}catch(x){};const n=+save.dataset.v35DailySave;if(!a.includes(n))a.unshift(n);localStorage.setItem("cardsKnownMyDeck",JSON.stringify(a.slice(0,60)));save.textContent="★ В моей колоде";save.classList.add("saved");return}

    const remove=target.closest("[data-v35-remove]");
    if(remove){e.preventDefault();e.stopImmediatePropagation();let a=[];try{a=JSON.parse(localStorage.getItem("cardsKnownMyDeck")||"[]")}catch(x){};a=a.filter(n=>n!==+remove.dataset.v35Remove);localStorage.setItem("cardsKnownMyDeck",JSON.stringify(a));renderMyDeck();return}

    const open=target.closest("[data-v35-card]");
    if(open){e.preventDefault();e.stopImmediatePropagation();if(typeof window.openDetail==="function")window.openDetail(+open.dataset.v35Card);return}

    const nav=target.closest(".nav-item,[data-screen]");
    if(nav&&nav.dataset.screen){
      e.preventDefault();e.stopImmediatePropagation();
      const id=nav.dataset.screen;
      if(id==="daily"){renderDaily()}
      if(id==="mydeck"){renderMyDeck()}
      screen(id);
      if(id==="daily")renderDaily();
      return;
    }

    if(target.closest("#spreadBtn")){
      // let the stable spread layer below rebuild it; no legacy handler is allowed to race it.
      e.stopImmediatePropagation();
    }
  },true);

  // Keep all generated backs consistent without observing the entire document.
  ["askBtn","revealBtn","dailyOpen","spreadBtn"].forEach(id=>{
    const b=$("#"+id);if(b)b.addEventListener("click",()=>setTimeout(patchBacks,40),false);
  });

  $("#question")?.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key==="Enter")ask()});
  patchBacks();
  renderDaily();
})();