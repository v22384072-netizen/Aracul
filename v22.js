// V22 — Моя колода: личное пространство избранных карт
(function(){
  const KEY="cardsKnownMyDeck";
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){return[]}};
  const write=a=>localStorage.setItem(KEY,JSON.stringify([...new Set(a)].slice(0,60)));
  const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));
  const isSaved=n=>read().includes(n);
  const toggle=n=>{
    const a=read(), i=a.indexOf(n);
    if(i>=0)a.splice(i,1); else a.unshift(n);
    write(a); refresh();
    return i<0;
  };
  const title=n=>window.titles?.[n-1]||"Карта";
  const category=n=>{
    const c=window.card?.(n);
    return c&&window.catNames ? window.catNames[c.cat] : "";
  };
  const image=n=>"cards/"+String(n).padStart(2,"0")+".jpg";

  function button(n){
    return '<button class="mydeck-save '+(isSaved(n)?"saved":"")+'" data-mydeck-toggle="'+n+'"><span>'+ (isSaved(n)?"★":"☆") +'</span> '+(isSaved(n)?"В моей колоде":"Добавить в мою колоду")+'</button>';
  }

  function ensureScreen(){
    if(document.getElementById("mydeck"))return;
    const s=document.createElement("section");
    s.id="mydeck"; s.className="screen";
    s.innerHTML='<div class="section-title"><div><small>ЛИЧНОЕ</small><h2>Моя колода</h2></div><span id="myDeckCount">0</span></div>'+
      '<p class="lead">Собирай карты, к которым хочется возвращаться. Это твоя личная подборка внутри «Карты Знают».</p>'+
      '<div id="myDeckGrid" class="mydeck-grid"></div>';
    document.querySelector("main").appendChild(s);

    const nav=document.querySelector(".nav");
    if(nav && !nav.querySelector('[data-screen="mydeck"]')){
      const b=document.createElement("button");
      b.className="nav-item"; b.dataset.screen="mydeck";
      b.innerHTML='<b>★</b><span>Моя</span>';
      nav.appendChild(b);
      b.onclick=()=>showScreen("mydeck");
    }
  }

  function refresh(){
    ensureScreen();
    const a=read(), grid=document.getElementById("myDeckGrid"), count=document.getElementById("myDeckCount");
    if(!grid)return;
    count.textContent=String(a.length).padStart(2,"0");
    grid.innerHTML=a.length ? a.map(n=>{
      const c=window.card?.(n), cat=category(n);
      return '<article class="mydeck-card">'+
        '<button class="mydeck-art" data-mydeck-open="'+n+'"><img src="'+image(n)+'" alt="'+esc(title(n))+'" onerror="this.style.display=\'none\'"></button>'+
        '<div class="mydeck-info"><small>'+String(n).padStart(2,"0")+(cat?" · "+esc(cat):"")+'</small><b>'+esc(title(n))+'</b>'+
        (c?.meaning?'<p>'+esc(c.meaning)+'</p>':"")+
        button(n)+'</div></article>';
    }).join("") :
      '<div class="mydeck-empty"><span>★</span><b>Твоя колода пока пуста.</b><p>Открой «Всю колоду» и сохрани карты, которые хочется оставить рядом.</p><button data-screen="deck">Открыть всю колоду <i>→</i></button></div>';
    grid.querySelectorAll("[data-mydeck-open]").forEach(b=>b.onclick=()=>window.openDetail?.(+b.dataset.mydeckOpen));
  }

  function injectDetailSave(n){
    const wrap=document.getElementById("detailContent");
    if(!wrap || !n)return;
    const copy=wrap.querySelector(".detail-copy");
    if(!copy)return;
    const old=copy.querySelector(".mydeck-save");
    if(old)old.remove();
    const holder=document.createElement("div");
    holder.innerHTML=button(n);
    copy.appendChild(holder.firstElementChild);
  }

  const oldOpen=window.openDetail;
  if(typeof oldOpen==="function"){
    window.openDetail=function(n){oldOpen(n);setTimeout(()=>injectDetailSave(n),0)};
  }

  document.addEventListener("click",e=>{
    const t=e.target.closest("[data-mydeck-toggle]");
    if(t){
      e.preventDefault(); e.stopPropagation();
      const n=+t.dataset.mydeckToggle, added=toggle(n);
      const next=document.createElement("span");
      next.textContent=added?"★":"☆";
      t.classList.toggle("saved",added);
      t.innerHTML=(added?"★":"☆")+" "+(added?"В моей колоде":"Добавить в мою колоду");
      // Refresh only when the dedicated personal screen is visible.
      if(document.getElementById("mydeck")?.classList.contains("active"))refresh();
      return;
    }
    const screen=e.target.closest("[data-screen]");
    if(screen && screen.dataset.screen==="mydeck"){setTimeout(refresh,0)}
  });

  ensureScreen();
  refresh();
})();