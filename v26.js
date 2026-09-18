// V26 — настоящий «Мой расклад»: пользователь сам выбирает карты
(function(){
  const KEY="cardsKnownMyDeck";
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){return[]}};
  const write=a=>localStorage.setItem(KEY,JSON.stringify([...new Set(a)].slice(0,60)));
  const esc=s=>String(s??"").replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
  let selected=[];
  function ensureModal(){
    if(document.getElementById("v26Modal"))return;
    const m=document.createElement("div");m.id="v26Modal";m.className="v26-modal";
    m.innerHTML='<div class="v26-panel"><button class="v26-close" id="v26Close">×</button><small>МОЯ КОЛОДА</small><h3>Выбери карты</h3><p>Отметь 3 или 5 карт. Порядок выбора станет порядком расклада.</p><div id="v26Selected">0 / 3</div><div id="v26Picker"></div><button id="v26Apply">Собрать расклад</button></div>';
    document.body.appendChild(m);
    m.addEventListener("click",e=>{if(e.target===m||e.target.closest("#v26Close"))m.classList.remove("open")});
    m.querySelector("#v26Apply").onclick=apply;
  }
  function openPicker(){
    const a=read();if(a.length<3){alert("Сохрани минимум 3 карты в «Мою колоду».");return}
    ensureModal();selected=[];renderPicker();document.getElementById("v26Modal").classList.add("open");
  }
  function renderPicker(){
    const p=document.getElementById("v26Picker"),s=document.getElementById("v26Selected");if(!p)return;
    s.textContent=selected.length+" / 3–5";
    p.innerHTML=read().map(n=>{const c=window.card?.(n),on=selected.includes(n);return '<button class="v26-pick '+(on?"on":"")+'" data-v26-pick="'+n+'"><img src="cards/'+String(n).padStart(2,"0")+'.jpg" onerror="this.style.display=\'none\'"><span>'+String(n).padStart(2,"0")+'</span><b>'+esc(c?.title||"Карта")+'</b></button>'}).join("");
    p.querySelectorAll("[data-v26-pick]").forEach(b=>b.onclick=()=>{const n=+b.dataset.v26Pick,i=selected.indexOf(n);if(i>=0)selected.splice(i,1);else if(selected.length<5)selected.push(n);renderPicker()});
  }
  function apply(){
    if(selected.length!==3&&selected.length!==5){alert("Выбери 3 или 5 карт.");return}
    const nums=selected.slice();document.getElementById("v26Modal").classList.remove("open");
    const q=document.getElementById("spreadQuestion");if(q)q.value="Что мне важно увидеть в моей личной колоде?";
    showScreen("spread");
    const btn=document.getElementById("spreadBtn");if(!btn)return;
    const original=btn.onclick;if(typeof original!=="function")return;
    const oldRandom=Math.random;let i=0;
    Math.random=()=>((nums[i++%nums.length]-.5)/60);
    try{original()}finally{Math.random=oldRandom}
  }
  function addButton(){
    const s=document.getElementById("mydeck"),bar=document.getElementById("myDeckToolbar");if(!s||!bar||document.getElementById("v26Open"))return;
    const b=document.createElement("button");b.id="v26Open";b.textContent="Выбрать карты для расклада";bar.insertBefore(b,bar.firstChild);b.onclick=openPicker;
  }
  function upgradeClear(){
    const b=document.getElementById("myDeckClear");if(!b)return;
    b.onclick=()=>{if(read().length&&confirm("Удалить все сохранённые карты?")){write([]);location.reload()}};
  }
  addButton();upgradeClear();
})();