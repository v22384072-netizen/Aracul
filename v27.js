// V27 — ритуальный экран расклада: карты открываются последовательно
(function(){
  const $=s=>document.querySelector(s);
  const btn=$("#spreadBtn"); if(!btn)return;
  const fresh=btn.cloneNode(true); btn.replaceWith(fresh);
  const labels3=["СИТУАЦИЯ","СКРЫТАЯ ПРИЧИНА","НАПРАВЛЕНИЕ"];
  const labels5=["СЕЙЧАС","ОСНОВАНИЕ","ТЕНЬ","РЕСУРС","СЛЕДУЮЩИЙ ШАГ"];
  let lastNums=[];
  function safe(v){return typeof esc==="function"?esc(String(v)):String(v).replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));}
  function drawRandom(total){
    const out=[];while(out.length<total){const n=Math.floor(Math.random()*60)+1;if(!out.includes(n))out.push(n)}return out;
  }
  function makeCards(nums,total){
    const labels=total===3?labels3:labels5;
    return nums.map((n,i)=>{const c=card(n);return {n,c,label:labels[i]}});
  }
  function render(nums,total,q){
    const r=$("#spreadResult"); if(!r)return;
    const cards=makeCards(nums,total);
    r.innerHTML='<div class="v27-progress"><small>РАСКЛАД СОБРАН</small><span>0 / '+total+' КАРТ ОТКРЫТО</span></div><div class="v27-ritual-cards">'+cards.map((x,i)=>'<article class="v27-card" data-v27-card="'+i+'"><div class="v27-back"><b>К</b><span>КАРТЫ ЗНАЮТ</span><i>✦</i></div><div class="v27-front"><div class="v27-num">'+String(i+1).padStart(2,"0")+'</div><img src="'+img(x.n)+'" alt="'+safe(x.c.title)+'"><div><small>'+x.label+'</small><strong>'+safe(x.c.title)+'</strong></div></div><button class="v27-open" data-v27-open="'+i+'">Открыть карту</button></article>').join('')+'</div><div class="v27-hint">Открывай карты по одной. Не спеши читать следующую, пока не заметил первую.</div><div id="v27Story"></div>';
    r.querySelectorAll("[data-v27-open]").forEach(b=>b.onclick=()=>openOne(+b.dataset.v27Open,cards,q,total));
  }
  function openOne(i,cards,q,total){
    const article=document.querySelector('[data-v27-card="'+i+'"]');if(!article||article.classList.contains("open"))return;
    article.classList.add("open");
    const x=cards[i];
    const text=typeof personalizedAnswer==="function"?personalizedAnswer(x.n,q,"spread"):x.c.meaning;
    const role=total===3?["Что уже происходит в ситуации.","Что остаётся за первым планом.","Куда можно перевести внимание."][i]:["Что видно сейчас.","На чём держится ситуация.","Что важно не перепутать с фактом.","Какой ресурс уже доступен.","Какой следующий шаг даст новую информацию."][i];
    const block=document.createElement("div");block.className="v27-story-block";block.innerHTML='<small>'+x.label+'</small><h3>'+safe(x.c.title)+'</h3><p class="v27-role">'+role+'</p><p>'+safe(text)+'</p>';
    $("#v27Story").appendChild(block);
    const opened=document.querySelectorAll(".v27-card.open").length;
    $(".v27-progress span").textContent=opened+" / "+total+" КАРТ ОТКРЫТО";
    $(".v27-progress").classList.toggle("complete",opened===total);
    if(typeof ritualSound==="function")ritualSound();
    if(typeof haptic==="function")haptic();
    if(opened===total){
      const result=document.createElement("div");result.className="v27-finale";
      result.innerHTML='<small>ЛИНИЯ РАСКЛАДА</small><p>Теперь смотри на карты не по отдельности, а как на одну последовательность: от первой точки к последней.</p><button id="v27RevealLine">Показать связь карт</button>';
      $("#v27Story").appendChild(result);
      $("#v27RevealLine").onclick=()=>{result.classList.add("shown");result.querySelector("p").textContent=typeof synthesis==="function"?synthesis(cards,q,total,typeof deepIntent==="function"?deepIntent(q):"insight"):"Собери смысл расклада из переходов между картами.";};
    }
  }
  fresh.onclick=function(){
    const q=$("#spreadQuestion").value.trim()||"Что мне важно увидеть сейчас?";
    const total=typeof spreadN==="number"?spreadN:3;
    const nums=(fresh.dataset.v25Cards||"").split(",").filter(Boolean).map(Number);
    const chosen=(nums.length===3||nums.length===5)?nums.slice(0,total):drawRandom(total);
    lastNums=chosen; render(chosen,total,q);
    if(typeof saveHistory==="function")saveHistory(q,chosen);
    setTimeout(()=>$("#spreadResult")?.scrollIntoView({behavior:"smooth",block:"start"}),60);
  };
  document.addEventListener("click",e=>{
    const open=e.target.closest("#v26Open");if(open){fresh.dataset.v25Cards="";return}
  });
})();