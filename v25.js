// V25 — Моя колода: управление и использование сохранённых карт
(function(){
  const KEY="cardsKnownMyDeck";
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){return[]}};
  const write=a=>localStorage.setItem(KEY,JSON.stringify([...new Set(a)].slice(0,60)));
  const esc=s=>String(s??"").replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
  const img=n=>"cards/"+String(n).padStart(2,"0")+".jpg";
  const c=n=>window.card?.(n);
  function refresh(){
    const grid=document.getElementById("myDeckGrid"),count=document.getElementById("myDeckCount");if(!grid)return;
    const a=read();if(count)count.textContent=String(a.length).padStart(2,"0");
    if(!a.length)return;
    grid.innerHTML=a.map(n=>{const x=c(n);return '<article class="mydeck-card"><button class="mydeck-art" data-mydeck-open="'+n+'"><img src="'+img(n)+'" alt="'+esc(x?.title||"Карта")+'" onerror="this.style.display=\'none\'"></button><div class="mydeck-info"><small>'+String(n).padStart(2,"0")+'</small><b>'+esc(x?.title||"Карта")+'</b><p>'+esc(x?.meaning||"")+'</p><button class="mydeck-save saved" data-v25-remove="'+n+'">★ Убрать из моей колоды</button></div></article>'}).join("");
  }
  function openMySpread(){
    const a=read();if(a.length<3){alert("Сохрани минимум 3 карты, чтобы сделать личный расклад.");return}
    const n=a.slice(0,5), q=document.getElementById("spreadQuestion"); if(q)q.value="Что мне важно увидеть в моей личной колоде?";
    showScreen("spread");
    setTimeout(()=>{const b=document.getElementById("spreadBtn");if(b)b.dataset.v25Cards=n.join(",");},50);
  }
  document.addEventListener("click",e=>{
    const remove=e.target.closest("[data-v25-remove]");
    if(remove){const n=+remove.dataset.v25Remove;write(read().filter(x=>x!==n));refresh();return}
    const open=e.target.closest("[data-mydeck-open]");
    if(open){window.openDetail?.(+open.dataset.mydeckOpen);return}
    const spread=e.target.closest("#myDeckSpread");
    if(spread){openMySpread();return}
    const screen=e.target.closest('[data-screen="mydeck"]');
    if(screen)setTimeout(refresh,0);
  });
  function addToolbar(){
    const s=document.getElementById("mydeck"),grid=document.getElementById("myDeckGrid");if(!s||!grid||document.getElementById("myDeckToolbar"))return;
    const bar=document.createElement("div");bar.id="myDeckToolbar";bar.className="mydeck-toolbar";
    bar.innerHTML='<button id="myDeckSpread">Сделать расклад из моей колоды <i>→</i></button><button id="myDeckClear">Очистить</button>';
    s.insertBefore(bar,grid);
    document.getElementById("myDeckClear").onclick=()=>{if(read().length&&confirm("Удалить все сохранённые карты?")){write([]);refresh()}};
  }
  addToolbar();refresh();
})();