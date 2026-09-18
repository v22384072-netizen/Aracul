// V21 — полноценный архив чтений
(function(){
  const KEY="cardsKnownHistory";
  const MAX=30;
  const escLocal=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){return[]}};
  const write=h=>localStorage.setItem(KEY,JSON.stringify(h.slice(0,MAX)));
  const typeLabel=n=>n===1?"ОДНА КАРТА":n===3?"РАСКЛАД · 3 КАРТЫ":n===5?"РАСКЛАД · 5 КАРТ":"ЧТЕНИЕ";
  const dateLabel=x=>{
    if(x.fullDate)return x.fullDate;
    return x.date||"";
  };
  const cardTitle=n=>window.titles?.[n-1]||("Карта "+n);
  const snapshotResult=()=>{
    const r=document.getElementById("reading");
    const s=document.getElementById("spreadResult");
    return {
      reading:r?.innerHTML||"",
      spread:s?.innerHTML||""
    };
  };

  // Enrich every new save with a complete local snapshot while preserving old records.
  const baseSave=window.saveHistory;
  if(typeof baseSave==="function"){
    window.saveHistory=function(q,nums){
      baseSave(q,nums);
      try{
        const h=read();
        if(!h.length)return;
        const item=h[0];
        item.id=item.id||("r_"+Date.now()+"_"+Math.random().toString(36).slice(2,8));
        item.fullDate=new Date().toLocaleString("ru-RU",{day:"2-digit",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"});
        item.type=nums.length;
        item.cards=nums.slice();
        item.snapshot=snapshotResult();
        item.answerText=document.querySelector("#reading .read-block p")?.textContent||"";
        item.question=q;
        write(h);
      }catch(e){}
    };
  }

  const modal=document.createElement("div");
  modal.className="history-modal";
  modal.id="historyModal";
  modal.hidden=true;
  modal.innerHTML=
    '<div class="history-modal-backdrop" data-history-close></div>'+
    '<div class="history-modal-panel" role="dialog" aria-modal="true" aria-label="Архив чтения">'+
      '<button class="history-modal-close" data-history-close aria-label="Закрыть">×</button>'+
      '<div id="historyModalBody"></div>'+
    '</div>';
  document.body.appendChild(modal);

  const openRecord=index=>{
    const h=read();
    const item=h[index];
    if(!item)return;
    const nums=item.cards||item.nums||[];
    const body=document.getElementById("historyModalBody");
    const cards=nums.map(n=>{
      const c=typeof window.card==="function"?window.card(n):null;
      const title=c?.title||cardTitle(n);
      const cat=(window.catNames&&c)?window.catNames[c.cat]:"";
      return '<div class="history-record-card" data-card-open="'+n+'">'+
        '<img src="cards/'+String(n).padStart(2,"0")+'.jpg" alt="" onerror="this.style.display=\'none\'">'+
        '<div><small>'+String(n).padStart(2,"0")+(cat?" · "+escLocal(cat):"")+'</small><b>'+escLocal(title)+'</b></div>'+
      '</div>';
    }).join("");
    const saved=item.snapshot?.reading||item.snapshot?.spread||"";
    const hasSnapshot=!!saved;
    body.innerHTML=
      '<div class="history-record-head"><small>'+escLocal(typeLabel(nums.length))+'</small><time>'+escLocal(dateLabel(item))+'</time></div>'+
      '<h2>'+escLocal(item.question||item.q||"Без вопроса")+'</h2>'+
      '<div class="history-record-cards">'+cards+'</div>'+
      (hasSnapshot
        ? '<div class="history-record-reading">'+saved+'</div>'
        : '<div class="history-old-note">Это чтение сохранено в старом формате. Карты доступны выше — нажми на любую, чтобы открыть её в колоде.</div>')+
      '<div class="history-record-actions">'+
        '<button class="history-repeat" data-repeat>Задать этот вопрос снова</button>'+
        '<button class="history-delete-one" data-delete>Удалить чтение</button>'+
      '</div>';
    modal.dataset.index=index;
    modal.hidden=false;
    requestAnimationFrame(()=>modal.classList.add("is-open"));
  };

  const close=()=>{
    modal.classList.remove("is-open");
    setTimeout(()=>{modal.hidden=true},180);
  };

  const renderArchive=()=>{
    const list=document.getElementById("historyList");
    if(!list)return;
    const h=read();
    list.innerHTML=h.length
      ? '<div class="history-toolbar"><span>'+h.length+' из '+MAX+' сохранённых чтений</span><button id="clearHistoryBtn">Очистить архив</button></div>'+
        h.map((x,i)=>{
          const nums=x.cards||x.nums||[];
          return '<article class="history-item history-item-v21" data-history-index="'+i+'">'+
            '<div class="history-item-top"><small>'+escLocal(typeLabel(nums.length))+'</small><time>'+escLocal(dateLabel(x))+'</time></div>'+
            '<p>«'+escLocal(x.question||x.q||"Без вопроса")+'»</p>'+
            '<div class="history-card-strip">'+nums.map(n=>'<span>'+String(n).padStart(2,"0")+' · '+escLocal(cardTitle(n))+'</span>').join("")+'</div>'+
            '<button class="history-open-btn" data-history-open="'+i+'">Открыть чтение <i>→</i></button>'+
          '</article>';
        }).join("")
      : '<div class="empty">Здесь пока тихо.<br>Первый вопрос появится здесь.</div>';

    list.querySelectorAll("[data-history-open]").forEach(b=>b.onclick=e=>{e.stopPropagation();openRecord(+b.dataset.historyOpen)});
    list.querySelectorAll(".history-item-v21").forEach(a=>a.onclick=e=>{
      if(e.target.closest("button"))return;
      openRecord(+a.dataset.historyIndex);
    });
    const clear=document.getElementById("clearHistoryBtn");
    if(clear)clear.onclick=()=>{
      if(confirm("Удалить весь архив чтений?")){
        localStorage.removeItem(KEY);
        renderArchive();
      }
    };
  };

  document.addEventListener("click",e=>{
    if(e.target.closest("[data-history-close]")){close();return}
    const card=e.target.closest("[data-card-open]");
    if(card){
      close();
      if(typeof window.openDetail==="function")window.openDetail(+card.dataset.cardOpen);
      return;
    }
    if(e.target.closest("[data-repeat]")){
      const h=read(),item=h[+modal.dataset.index];
      if(item){
        const q=item.question||item.q||"";
        close();
        if(typeof window.showScreen==="function")window.showScreen("home");
        setTimeout(()=>{const el=document.getElementById("question");if(el){el.value=q;el.dispatchEvent(new Event("input",{bubbles:true}));el.focus()}},120);
      }
      return;
    }
    if(e.target.closest("[data-delete]")){
      const i=+modal.dataset.index;
      const h=read();
      if(confirm("Удалить это чтение из архива?")){
        h.splice(i,1);write(h);close();renderArchive();
      }
    }
  });

  // Re-render after each new reading, without touching the existing core UI.
  const originalRender=window.renderHistory;
  window.renderHistory=function(){
    if(typeof originalRender==="function")originalRender();
    renderArchive();
  };

  // The core calls renderHistory during boot before V21 loads; render once now.
  renderArchive();
  window.addEventListener("storage",renderArchive);
})();