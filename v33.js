// V33 — Связи: вопрос → тема → карта → следующий шаг
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
  const intent=q=>{
    try{return typeof window.deepIntent==="function"?window.deepIntent(q):"insight"}catch(e){return"insight"}
  };
  const intentLabel=i=>({decision:"Решение",why:"Причина",action:"Действие",outcome:"Результат",timing:"Срок",future:"Будущее",choice:"Выбор",insight:"Наблюдение"})[i]||"Наблюдение";
  const date=x=>{const d=new Date(x.fullDate||x.date||"");return isNaN(d)?"":d.toLocaleDateString("ru-RU",{day:"2-digit",month:"short"}).replace(".","")};
  function ensure(){
    let root=document.getElementById("path");
    if(!root){
      const main=document.querySelector("main");if(!main)return;
      const nav=document.querySelector(".nav");
      if(nav&&!nav.querySelector('[data-screen="path"]')){
        const b=document.createElement("button");b.className="nav-item";b.dataset.screen="path";b.innerHTML="<b>∿</b><span>Путь</span>";nav.appendChild(b);
      }
      root=document.createElement("section");root.id="path";root.className="screen";
      main.appendChild(root);
    }
    root.innerHTML='<div class="section-title"><div><small>ЛИЧНАЯ ИСТОРИЯ</small><h2>Связи чтений</h2></div><span>33</span></div><p class="lead">Вопросы меняются, карты повторяются, а между чтениями появляются связи.</p><div id="v33Root"></div>';
    return root;
  }
  function render(){
    const root=document.getElementById("v33Root");if(!root)return;
    const h=read();
    const p=profile();
    const derived={};
    h.forEach(x=>{const t=topic(x.question||x.q);derived[t]=(derived[t]||0)+1});
    const profileTopics=p.topics||{};
    const topics=Object.keys({...derived,...profileTopics}).sort((a,b)=>((derived[b]||profileTopics[b]||0)-(derived[a]||profileTopics[a]||0)));
    let selected=root.dataset.topic||topics[0]||"Личное";
    if(!topics.includes(selected))selected=topics[0]||"Личное";
    const rows=h.map((x,i)=>({x,i,t:topic(x.question||x.q)})).filter(o=>o.t===selected).reverse();
    const counts={};rows.forEach(o=>(o.x.cards||o.x.nums||[]).forEach(n=>counts[n]=(counts[n]||0)+1));
    const recurring=Object.entries(counts).filter(x=>x[1]>1).sort((a,b)=>b[1]-a[1]).slice(0,6);
    let html='<div class="v33-top"><div class="v33-top-label">СМОТРЕТЬ СВЯЗИ ПО ТЕМЕ</div><div class="v33-topics">'+topics.map(t=>'<button class="'+(t===selected?"active":"")+'" data-v33-topic="'+esc(t)+'">'+esc(t)+' <i>'+String(derived[t]||profileTopics[t]||0)+'</i></button>').join("")+'</div></div>';
    if(!rows.length){html+='<div class="v31-empty"><b>Связей пока нет.</b><p>Первое чтение по этой теме появится здесь.</p></div>';root.innerHTML=html;root.dataset.topic=selected;return}
    const first=rows[0],last=rows[rows.length-1];
    html+='<div class="v33-overview"><div><small>ЧТЕНИЙ</small><b>'+rows.length+'</b></div><div><small>ПЕРВАЯ КАРТА</small><b>'+String((first.x.cards||first.x.nums||[])[0]||"—").padStart(2,"0")+'</b></div><div><small>ПОСЛЕДНИЙ ВОПРОС</small><b>'+esc(date(last.x)||"сейчас")+'</b></div></div>';
    html+='<div class="v33-flow"><small class="v31-kicker">КАК ДВИГАЛАСЬ ТЕМА</small>';
    rows.forEach((o,j)=>{
      const nums=o.x.cards||o.x.nums||[], prev=rows[j-1]?.x?.cards||rows[j-1]?.x?.nums||[];
      const repeated=nums.filter(n=>prev.includes(n));
      const q=String(o.x.question||o.x.q||"Без вопроса");
      html+='<article class="v33-reading"><div class="v33-index">'+String(j+1).padStart(2,"0")+'</div><div class="v33-body"><div class="v33-meta"><span>'+esc(date(o.x))+'</span><i>'+esc(intentLabel(intent(q)))+'</i></div><p>«'+esc(q.slice(0,190))+'»</p><div class="v33-cards">'+nums.map(n=>'<button data-card-open="'+n+'"><span>'+String(n).padStart(2,"0")+'</span>'+esc(title(n))+'</button>').join("")+'</div>'+(repeated.length?'<div class="v33-repeat">Повторилось с прошлым чтением: '+repeated.map(n=>esc(title(n))).join(", ")+'</div>':"")+'</div></article>';
    });
    html+='</div>';
    if(rows.length>1){
      const links=[];
      for(let i=1;i<rows.length;i++){
        const a=rows[i-1].x,b=rows[i].x;
        const ac=a.cards||a.nums||[],bc=b.cards||b.nums||[];
        const shared=ac.filter(n=>bc.includes(n));
        links.push({from:a,to:b,shared});
      }
      html+='<div class="v33-links"><small class="v31-kicker">ЧТО СВЯЗЫВАЛО ЧТЕНИЯ</small>'+links.slice(-5).reverse().map(l=>{
        const aq=String(l.from.question||l.from.q||"").slice(0,70),bq=String(l.to.question||l.to.q||"").slice(0,70);
        return '<div class="v33-link"><span>'+esc(aq)+'</span><b>→</b><span>'+esc(bq)+'</span>'+(l.shared.length?'<i>Общая карта: '+esc(l.shared.map(n=>title(n)).join(", "))+'</i>':'<i>Новой связью стал сам следующий вопрос.</i>')+'</div>';
      }).join("")+'</div>';
    }
    if(recurring.length)html+='<div class="v33-recur"><small class="v31-kicker">ПОВТОРЯЮЩИЕСЯ КАРТЫ</small><div>'+recurring.map(x=>'<button data-card-open="'+x[0]+'"><span>'+String(x[0]).padStart(2,"0")+'</span><b>'+esc(title(+x[0]))+'</b><i>'+x[1]+'×</i></button>').join("")+'</div></div>';
    root.innerHTML=html;root.dataset.topic=selected;
  }
  document.addEventListener("click",e=>{
    if(e.target.closest('[data-screen="path"]')){ensure();setTimeout(render,20);return}
    const t=e.target.closest("[data-v33-topic]");
    if(t){const r=document.getElementById("v33Root");if(r)r.dataset.topic=t.dataset.v33Topic;render();return}
  });
  window.addEventListener("storage",()=>{if(document.getElementById("v33Root"))render()});
  setTimeout(()=>{ensure();},180);
})();