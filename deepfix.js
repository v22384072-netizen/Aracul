/* V16.2.1 — activate deep readings + deep spread */
function deepPersonalizedAnswer2(n,q,c){
  const p=questionProfile(q), row=DEEP_BY_CARD[n], key=deepTopicKey(p);
  if(!row||!key)return _oldPersonalizedAnswer(n,q,c);
  const idx=DEEP_TOPIC[key], h=answerHash(String(n)+"|"+q);
  const variants=[
    "Главный акцент карты здесь — "+row[idx]+".",
    "Если смотреть именно на этот вопрос, карта говорит о следующем: "+row[idx]+".",
    "В твоём контексте этот образ читается через один конкретный механизм: "+row[idx]+"."
  ];
  const direct=p.direct ? (n<=20?"Перед решением проверь, какая опора уже существует.":n<=40?"Перед решением сначала убери фактор, который может исказить взгляд.":"Свяжи решение с конкретным действием и его проверяемым результатом.") : "";
  const intent=p.negative?" В тревожной формулировке не превращай страх в доказательство будущего.":p.hopeful?" Желание результата здесь стоит проверить фактом, а не ожиданием знака.":"";
  return [variants[h%3],"Ты спрашиваешь: «"+(p.t.length>180?p.t.slice(0,180)+"…":p.t)+"».",direct,"Образ «"+c.title+"» здесь не абстрактный: "+c.meaning+".","Тень карты: "+shadows[n-1],"Практический ориентир: "+directions[n-1],intent,"Проверь этот смысл реальными обстоятельствами прежде, чем делать вывод."].filter(Boolean).join(" ");
}
personalizedAnswer=deepPersonalizedAnswer2;

const spreadBtn=document.querySelector("#spreadBtn");
if(spreadBtn){
  const clone=spreadBtn.cloneNode(true);
  spreadBtn.replaceWith(clone);
  clone.onclick=()=>{
    const q=$("#spreadQuestion").value.trim()||"Что мне важно увидеть сейчас?";
    const nums=[];
    while(nums.length<spreadN){const n=Math.floor(Math.random()*60)+1;if(!nums.includes(n))nums.push(n)}
    const labels=spreadN===3?["СИТУАЦИЯ","СКРЫТАЯ ПРИЧИНА","НАПРАВЛЕНИЕ"]:["СЕЙЧАС","ОСНОВАНИЕ","ТЕНЬ","РЕСУРС","СЛЕДУЮЩИЙ ШАГ"];
    const roles=spreadN===3?["meaning","shadow","direction"]:["meaning","direction","shadow","meaning","direction"];
    const p=questionProfile(q);
    const semantic=(n)=>{const row=DEEP_BY_CARD[n],key=deepTopicKey(p);return row&&key?row[DEEP_TOPIC[key]]:""};
    const texts=nums.map((n,i)=>{
      const c=card(n), s=semantic(n);
      if(s)return labels[i]+": "+s;
      const base=roles[i]==="meaning"?c.meaning:roles[i]==="shadow"?shadows[n-1]:directions[n-1];
      return labels[i]+": "+base;
    });
    const bridge=spreadN===3
      ?"Здесь три карты складывают вопрос в цепочку: что происходит, что скрыто и куда направить внимание."
      :"Пять карт показывают не пять прогнозов, а пять слоёв одной ситуации — от текущего положения до следующего шага.";
    const result=bridge+" «"+q.slice(0,140)+"» "+texts.join(" ");
    $("#spreadResult").innerHTML=`<div class="spread-cards">${nums.map((n,i)=>{const c=card(n);return \`<div class="spread-card"><img src="${img(n)}" alt="${esc(c.title)}" onerror="this.style.display='none'"><label>${labels[i]}</label><strong>${esc(c.title)}</strong></div>\`}).join("")}</div><div class="spread-result-line"><small>ЕДИНЫЙ ОТВЕТ</small><p>${esc(result)}</p></div>`;
    saveHistory(q,nums);
  };
}