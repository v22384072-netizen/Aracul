/* V19 — coherent spreads: position-aware reading, bridges, synthesis */
(function(){
  const $=s=>document.querySelector(s);
  const safe=(v)=>typeof esc==="function"?esc(String(v)):String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));
  const btn=$("#spreadBtn");
  if(!btn)return;
  const fresh=btn.cloneNode(true); btn.replaceWith(fresh);

  const labels3=["СИТУАЦИЯ","СКРЫТАЯ ПРИЧИНА","НАПРАВЛЕНИЕ"];
  const labels5=["СЕЙЧАС","ОСНОВАНИЕ","ТЕНЬ","РЕСУРС","СЛЕДУЮЩИЙ ШАГ"];

  function roleText(n,i,total,intent){
    const c=card(n), row=typeof CARD_MECHANISM!=="undefined"?CARD_MECHANISM[n]:null;
    const meaning=c.meaning, shadow=shadows[n-1], direction=directions[n-1];
    if(total===3){
      if(i===0)return "Что уже происходит: "+meaning;
      if(i===1)return "Что это поддерживает или скрывает: "+(row?row[1]:shadow);
      return "Куда перевести внимание: "+(row?row[3]:direction);
    }
    if(i===0)return "Текущий слой: "+meaning;
    if(i===1)return "Основание: "+direction;
    if(i===2)return "Тень: "+shadow;
    if(i===3)return "Доступный ресурс: "+meaning;
    return "Следующий шаг: "+(row?row[3]:direction);
  }

  function bridge(i,total,intent){
    if(total===3){
      return [
        "Начни с факта: это то, что уже присутствует в ситуации.",
        "Теперь посмотри на механизм: что незаметно удерживает эту картину?",
        "Последняя карта не обещает исход — она показывает, что можно проверить действием."
      ][i];
    }
    return [
      "Сначала зафиксируй реальность без попытки сразу её изменить.",
      "Затем посмотри, на какой основе держится нынешняя ситуация.",
      "После этого отдели реальную помеху от того, что только выглядит угрозой.",
      "Здесь находится ресурс, который можно использовать уже сейчас.",
      "Финальная карта переводит чтение в действие, которое даст новую информацию."
    ][i];
  }

  function synthesis(cards,q,total,intent){
    const first=cards[0], last=cards[cards.length-1];
    const middle=cards[Math.floor(cards.length/2)];
    const firstRow=typeof CARD_MECHANISM!=="undefined"?CARD_MECHANISM[first.n]:null;
    const lastRow=typeof CARD_MECHANISM!=="undefined"?CARD_MECHANISM[last.n]:null;
    const key=typeof deepTopicKey==="function"?deepTopicKey(questionProfile(q)):null;
    const topic=(typeof INTENT_TOPIC!=="undefined"&&key&&INTENT_TOPIC[key])?INTENT_TOPIC[key][intent]:"Сверь расклад с конкретными условиями своей ситуации.";
    const line=total===3
      ? "Связка расклада: «"+first.c.title+"» показывает контекст, «"+middle.c.title+"» — механизм, а «"+last.c.title+"» — точку воздействия."
      : "Связка расклада: «"+first.c.title+"» показывает настоящее, «"+middle.c.title+"» помогает увидеть напряжение, а «"+last.c.title+"» переводит всё в следующий шаг.";
    return line+" "+topic+" "+(firstRow?"Главный механизм здесь — "+firstRow[0]+". ":"")+(lastRow?"Проверяемый шаг — "+lastRow[3]+".":"");
  }

  fresh.onclick=function(){
    const q=$("#spreadQuestion").value.trim()||"Что мне важно увидеть сейчас?";
    const total=typeof spreadN==="number"?spreadN:3;
    const nums=[];
    while(nums.length<total){
      const n=Math.floor(Math.random()*60)+1;
      if(!nums.includes(n))nums.push(n);
    }
    const labels=total===3?labels3:labels5;
    const intent=typeof deepIntent==="function"?deepIntent(q):"insight";
    const cards=nums.map((n,i)=>({n,c:card(n),label:labels[i]}));
    const html=cards.map((x,i)=>`
      <article class="spread-card spread-card-rich" data-card="${x.n}">
        <div class="spread-card-index">${String(i+1).padStart(2,"0")}</div>
        <img src="${img(x.n)}" alt="${safe(x.c.title)}" onerror="this.style.display='none'">
        <div class="spread-card-copy">
          <label>${x.label}</label>
          <strong>${safe(x.c.title)}</strong>
          <p>${safe(roleText(x.n,i,total,intent))}</p>
        </div>
      </article>`).join("");

    const result=synthesis(cards,q,total,intent);
    const steps=cards.map((x,i)=>`
      <div class="spread-step">
        <small>${x.label}</small>
        <p><b>${safe(x.c.title)}</b> — ${safe(roleText(x.n,i,total,intent))}</p>
        <em>${safe(bridge(i,total,intent))}</em>
      </div>`).join("");

    $("#spreadResult").innerHTML=`
      <div class="spread-cards spread-cards-rich">${html}</div>
      <div class="spread-story">
        <div class="spread-story-head"><small>ЛИНИЯ РАСКЛАДА</small><span>${total} КАРТЫ</span></div>
        <h3>${safe(result)}</h3>
        <div class="spread-steps">${steps}</div>
        <div class="spread-check">
          <small>ПРОВЕРЬ В РЕАЛЬНОСТИ</small>
          <p>${safe(typeof CARD_MECHANISM!=="undefined"&&CARD_MECHANISM[cards[cards.length-1].n]?CARD_MECHANISM[cards[cards.length-1].n][3]:"Сделай один небольшой шаг и посмотри, что изменилось.")}</p>
        </div>
      </div>`;

    if(typeof saveHistory==="function")saveHistory(q,nums);
    const target=$("#spreadResult");
    if(target)setTimeout(()=>target.scrollIntoView({behavior:"smooth",block:"start"}),60);
  };
})();