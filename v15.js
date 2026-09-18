/* V15 — stability, Telegram polish, missing-card fallbacks */
(function(){
  "use strict";
  const $=window.$, $$=window.$$;
  if(!$||!$$) return;
  try{
    const tg=window.Telegram&&window.Telegram.WebApp;
    if(tg){tg.ready();tg.expand();if(tg.setHeaderColor)tg.setHeaderColor("#0d0e12");if(tg.setBackgroundColor)tg.setBackgroundColor("#0d0e12");document.documentElement.classList.add("telegram-app");}
  }catch(e){console.warn("Telegram bootstrap:",e);}
  function missingArt(n,title,small){return '<div class="missing-art"><span>✦</span><small>'+String(n).padStart(2,"0")+'</small><b>'+esc(title)+'</b><em>'+esc(small||"КАРТЫ ЗНАЮТ")+'</em></div>';}
  function enhanceMissingImages(){
    document.querySelectorAll("#cardGrid .mini").forEach(el=>{
      const im=el.querySelector("img"); if(!im||im.dataset.checked)return;
      im.dataset.checked="1"; const n=Number(el.dataset.card),c=card(n);
      const mark=()=>{if(im.naturalWidth>0)return;im.style.display="none";el.classList.add("missing-art");if(!el.querySelector(".missing-art-content")){const x=document.createElement("div");x.className="missing-art-content";x.innerHTML=missingArt(n,c.title,catNames[c.cat]);el.appendChild(x);}};
      if(im.complete)setTimeout(mark,0);else im.addEventListener("error",mark,{once:true});
    });
  }
  const originalRenderDeck=window.renderDeck;
  if(typeof originalRenderDeck==="function"){window.renderDeck=function(){originalRenderDeck();setTimeout(enhanceMissingImages,60);};window.renderDeck();}
  $("#askBtn").onclick=function(){
    const q=$("#question").value.trim();if(!q){$("#question").focus();return;}
    window.currentQuestion=q;const d=document.getElementById("draw");
    d.classList.remove("revealed","listening","ready","chosen","reveal-focus");
    $("#drawStep").textContent="01 / 03";$("#drawTitle").textContent="Я слушаю.";$("#drawSub").textContent="Не меняй вопрос. Просто побудь с ним несколько секунд.";
    $("#drawCard").className="draw-card";$("#drawCard").innerHTML='<div class="back-design"><b>К</b><span>КАРТЫ ЗНАЮТ</span><i>✦</i></div>';$("#revealBtn").hidden=true;$("#reading").innerHTML="";showScreen("draw");d.classList.add("listening");
    setTimeout(function(){if(!d.classList.contains("active")||window.currentQuestion!==q)return;d.classList.remove("listening");d.classList.add("ready","chosen");$("#drawStep").textContent="02 / 03";$("#drawTitle").textContent="Карта выбрана.";$("#drawSub").textContent="Когда будешь готов — открой её.";$("#revealBtn").hidden=false;},1900);
  };
  $("#question").addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key==="Enter")$("#askBtn").click();});
  $("#revealBtn").onclick=function(){
    const q=window.currentQuestion;if(!q){showScreen("home");$("#question").focus();return;}
    const d=document.getElementById("draw"),n=Math.floor(Math.random()*60)+1,c=card(n);d.classList.add("opening","revealed");
    if(typeof ritualSound==="function")ritualSound();if(typeof haptic==="function")haptic();if(typeof magicFX==="function")magicFX();
    setTimeout(()=>d.classList.remove("opening"),1450);
    const echo=document.querySelector("#draw .question-echo span");if(echo)echo.textContent="«"+q+"»";
    $("#drawStep").textContent="03 / 03";$("#drawTitle").textContent=c.title;$("#drawSub").textContent=catNames[c.cat];$("#drawCard").className="draw-card open";$("#drawCard").innerHTML='<img src="'+img(n)+'" alt="'+esc(c.title)+'">';
    const art=$("#drawCard img");art.onerror=function(){$("#drawCard").innerHTML=missingArt(n,c.title,catNames[c.cat]);$("#drawCard").classList.add("missing-card");};$("#revealBtn").hidden=true;
    $("#reading").innerHTML='<div class="reading-head"><div><small>ТВОЁ ЧТЕНИЕ</small><h3>Карта отвечает на твой вопрос</h3></div><span class="reading-index">'+String(n).padStart(2,"0")+' / 60</span></div><div class="reading-hero"><div class="reading-thumb"><img src="'+img(n)+'" alt="'+esc(c.title)+'"></div><div class="reading-card-meta"><small>'+catNames[c.cat]+'</small><h4>'+esc(c.title)+'</h4><p>«'+esc(q)+'»</p></div></div><div class="answer-intro"><small>ОТВЕТ ДЛЯ ТВОЕГО ВОПРОСА</small><h3>Не готовое предсказание — а взгляд на ситуацию через образ карты.</h3></div><div class="read-block"><small>СУТЬ ОТВЕТА</small><p>'+esc(personalizedAnswer(n,q,c))+'</p></div><div class="read-block"><small>ТЕНЬ, КОТОРУЮ ВАЖНО УВИДЕТЬ</small><p>'+esc(shadows[n-1])+'</p></div><div class="read-block"><small>ТВОЁ НАПРАВЛЕНИЕ</small><p>'+esc(directions[n-1])+'</p></div><div class="read-block read-question"><small>ВОПРОС ОТ КАРТЫ</small><p>'+esc(questionCards[n-1])+'</p></div><div class="reading-close"><span>✦</span><b>Теперь выбери свой следующий шаг.</b><em>Карта показала направление. Решение остаётся за тобой.</em><button class="new-question" id="newQuestionBtn">Задать новый вопрос <i>↗</i></button></div>';
    const thumb=$("#reading .reading-thumb img");if(thumb)thumb.onerror=function(){this.parentElement.innerHTML=missingArt(n,c.title,catNames[c.cat]);};
    if(typeof saveHistory==="function")saveHistory(q,[n]);setTimeout(()=>$("#reading").scrollIntoView({behavior:"smooth",block:"start"}),80);
  };
  document.addEventListener("click",e=>{const b=e.target.closest("#newQuestionBtn");if(b){showScreen("home");$("#question").value="";$("#count").textContent="0 / 240";setTimeout(()=>$("#question").focus(),80);}});
  document.addEventListener("click",e=>{if(e.target.closest("[data-screen='deck'], .filter"))setTimeout(enhanceMissingImages,80);});
})();