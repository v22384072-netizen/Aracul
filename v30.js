// V30 — память раскладов: связь текущего чтения с прошлым
(function(){
  const KEY="cardsKnownProfile";
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){return{}}};
  const esc=s=>String(s??"").replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
  const topic=q=>{
    const s=(q||"").toLowerCase();
    if(/деньг|зарплат|доход|долг|кредит|цена|заработ/.test(s))return"Деньги";
    if(/работ|карьер|бизнес|клиент|проект|профес/.test(s))return"Работа";
    if(/отнош|любов|партн|муж|жен|семь|дружб/.test(s))return"Отношения";
    if(/переезд|место|город|жиль|уехать/.test(s))return"Перемены";
    if(/страх|боюсь|тревог|сомнева/.test(s))return"Страх и сомнения";
    if(/выбрать|выбор|вариант|решен|стоит ли/.test(s))return"Выбор";
    if(/когда|срок|через сколько|как скоро/.test(s))return"Сроки";
    return"Личное";
  };
  function context(q,nums){
    const p=read(),t=topic(q),history=p.last||{};
    const sameTopic=history.topic===t&&history.question;
    const sameCard=(nums||[]).filter(n=>(p.cards?.[n]||0)>0);
    const previousCards=history.cards||[];
    return {topic:t,sameTopic,sameCard,previousCards,previousQuestion:history.question||"",count:p.questions||0};
  }
  window.v30Memory=function(q,nums){return context(q,nums)};
  const old=window.personalizedAnswer;
  if(typeof old==="function"){
    window.personalizedAnswer=function(n,q,c){
      const base=old(n,q,c),m=context(q,[n]);
      if(!m.sameTopic&&!m.sameCard.length)return base;
      let memory="";
      if(m.sameTopic)memory+=" Память чтения: к теме «"+m.topic+"» ты уже обращался в предыдущем чтении. Не повторяй старый вопрос автоматически — сравни, что стало другим сейчас.";
      if(m.sameCard.length)memory+=" Карта «"+c.title+"» уже встречалась раньше. Важен не сам повтор, а изменение обстоятельств вокруг неё.";
      return base+memory;
    };
  }
  function memoryBlock(q,nums){
    const m=context(q,nums);
    if(!m.sameTopic&&!m.sameCard.length)return "";
    let title="ПАМЯТЬ ЧТЕНИЯ";
    let text=m.sameTopic
      ?"Ты снова пришёл к теме «"+m.topic+"». Предыдущее чтение было про: «"+String(m.previousQuestion).slice(0,120)+"». Сравни не формулировки, а обстоятельства: что изменилось?"
      :"Одна из карт уже встречалась в твоей истории. Сравни контекст прошлого и нынешнего вопроса — повтор карты не означает повтор ситуации.";
    return '<div class="v30-memory"><small>'+title+'</small><p>'+esc(text)+'</p></div>';
  }
  function attach(){
    const r=document.getElementById("reading");if(!r||r.querySelector(".v30-memory"))return;
    const q=window.currentQuestion||document.querySelector("#question")?.value||"";
    const idx=parseInt((document.querySelector(".reading-index")||{}).textContent||"",10);
    if(!idx)return;
    const box=memoryBlock(q,[idx]);if(!box)return;
    const close=r.querySelector(".reading-close");r.insertAdjacentHTML(close?"beforeend":"beforeend",box);
  }
  document.addEventListener("click",e=>{
    if(e.target.closest("#revealBtn"))setTimeout(attach,80);
    if(e.target.closest("#v27RevealLine"))setTimeout(()=>{
      const p=document.querySelector("#spreadQuestion")?.value||"";
      const nums=[...document.querySelectorAll(".v27-card")].map(x=>0);
      if(window.v30SpreadMemory)window.v30SpreadMemory(p);
    },100);
    if(e.target.closest('[data-screen="history"]'))setTimeout(renderHistoryMemory,50);
  });
  window.v30SpreadMemory=function(q){
    const m=context(q,[]);
    return m.sameTopic?{topic:m.topic,previousQuestion:m.previousQuestion}:null;
  };
  function renderHistoryMemory(){
    const list=document.getElementById("historyList"),p=read();if(!list||!p.questions)return;
    const existing=document.getElementById("v30-history-memory");if(existing)existing.remove();
    const m=p.last;if(!m?.topic)return;
    const box=document.createElement("div");box.id="v30-history-memory";box.className="v30-memory v30-memory-history";
    box.innerHTML="<small>ПОСЛЕДНИЙ СЛЕД</small><p>Последняя тема: <b>"+esc(m.topic)+"</b>. Следующее чтение можно сравнить с вопросом: «"+esc(String(m.question||"").slice(0,120))+"».</p>";
    list.prepend(box);
  }
  setTimeout(renderHistoryMemory,250);
})();