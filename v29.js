// V29 — персональный контекст: повторяющиеся темы и карты
(function(){
  const KEY="cardsKnownProfile";
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"{\"topics\":{},\"cards\":{},\"intents\":{},\"questions\":0}")}catch(e){return{topics:{},cards:{},intents:{},questions:0}}};
  const esc=s=>String(s??"").replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
  function topic(q){
    const s=(q||"").toLowerCase();
    if(/деньг|зарплат|доход|долг|кредит|цена|заработ/.test(s))return"Деньги";
    if(/работ|карьер|бизнес|клиент|проект|профес/.test(s))return"Работа";
    if(/отнош|любов|партн|муж|жен|семь|дружб/.test(s))return"Отношения";
    if(/переезд|место|город|жиль|уехать/.test(s))return"Перемены";
    if(/страх|боюсь|тревог|сомнева/.test(s))return"Страх и сомнения";
    if(/выбрать|выбор|вариант|решен|стоит ли/.test(s))return"Выбор";
    if(/когда|срок|через сколько|как скоро/.test(s))return"Сроки";
    return"Личное";
  }
  function intent(q){return typeof deepIntent==="function"?deepIntent(q):"insight"}
  function record(q,nums){
    const p=read();p.questions=(p.questions||0)+1;
    const t=topic(q),i=intent(q);p.topics[t]=(p.topics[t]||0)+1;p.intents[i]=(p.intents[i]||0)+1;
    (nums||[]).forEach(n=>p.cards[n]=(p.cards[n]||0)+1);
    p.last={question:q,topic:t,intent:i,cards:nums||[],date:new Date().toISOString()};
    localStorage.setItem(KEY,JSON.stringify(p));
    return p;
  }
  window.v29Profile=read;
  window.v29Context=function(q,nums){
    const p=read(),t=topic(q),i=intent(q),seen=p.topics[t]||0;
    const repeated=(nums||[]).filter(n=>(p.cards[n]||0)>0);
    return {topic:t,intent:i,topicCount:seen,repeatedCards:repeated,questions:p.questions||0};
  };
  const base=window.saveHistory;
  if(typeof base==="function"){
    window.saveHistory=function(q,nums){
      const result=base(q,nums);
      try{record(q,nums)}catch(e){}
      return result;
    };
  }
  const old=window.personalizedAnswer;
  if(typeof old==="function"){
    window.personalizedAnswer=function(n,q,c){
      const out=old(n,q,c);
      const ctx=window.v29Context(q,[n]);
      if(ctx.topicCount>0){
        const repeat=ctx.repeatedCards.length
          ?" Эта карта уже встречалась в твоих чтениях — сравни, что в ситуации изменилось с прошлого раза."
          :" Ты уже возвращался к теме «"+ctx.topic+"» — полезно проверить, какой новый факт появился с прошлого чтения.";
        return out+repeat;
      }
      return out;
    };
  }
  function ensure(){
    if(document.getElementById("v29ProfileBlock"))return;
    const h=document.querySelector("#mydeck");
    if(!h)return;
    const block=document.createElement("div");block.id="v29ProfileBlock";block.className="v29-profile";
    h.insertBefore(block,h.querySelector("#myDeckGrid")||null);
    render();
  }
  function render(){
    const b=document.getElementById("v29ProfileBlock");if(!b)return;
    const p=read(),ts=Object.entries(p.topics||{}).sort((a,b)=>b[1]-a[1]).slice(0,3),cs=Object.entries(p.cards||{}).sort((a,b)=>b[1]-a[1]).slice(0,3);
    b.innerHTML='<small>ЛИЧНЫЙ СЛЕД</small><h3>Твои повторяющиеся темы</h3>'+
      (p.questions?'<p>Сохранено чтений: <b>'+p.questions+'</b></p>':'<p>Пока здесь нет истории. Первый вопрос начнёт собирать твой личный след.</p>')+
      (ts.length?'<div class="v29-tags">'+ts.map(x=>'<span>'+esc(x[0])+' · '+x[1]+'</span>').join("")+'</div>':"")+
      (cs.length?'<p class="v29-muted">Часто встречались карты: '+cs.map(x=>esc(window.titles?.[+x[0]-1]||("Карта "+x[0]))).join(" · ")+'</p>':"");
  }
  document.addEventListener("click",e=>{if(e.target.closest('[data-screen="mydeck"]'))setTimeout(()=>{ensure();render()},40)});
  setTimeout(ensure,200);
})();