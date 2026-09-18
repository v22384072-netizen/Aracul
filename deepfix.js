/* V16.2.2 — intent-aware readings */
function deepIntent(q){
  const s=(q||"").toLowerCase();
  if(/\b(стоит ли|нужно ли|можно ли|имеет ли смысл|ли стоит)\b/.test(s))return"decision";
  if(/\b(почему|из-за чего|откуда|что мешает|что удерживает)\b/.test(s))return"why";
  if(/\b(что делать|как мне|как лучше|какой шаг|с чего начать)\b/.test(s))return"action";
  if(/\b(получится ли|получусь|получится|будет ли|случится ли|смогу ли|удастся ли)\b/.test(s))return"outcome";
  if(/\b(когда|через сколько|как скоро|какой срок|к какому сроку)\b/.test(s))return"timing";
  if(/\b(что меня жд|что дальше|что произойдет|куда всё идёт|будущее)\b/.test(s))return"future";
  if(/\b(что выбрать|какой вариант|между|или)\b/.test(s))return"choice";
  return"insight";
}
const INTENT_SUFFIX={
 decision:"Если вопрос стоит как решение, используй карту как критерий проверки: что должно быть правдой, чтобы этот шаг имел смысл.",
 why:"Если вопрос начинается с «почему», карта полезнее всего как поиск механизма: что поддерживает ситуацию прямо сейчас.",
 action:"Если ты спрашиваешь «что делать», переведи смысл карты в одно действие, которое можно выполнить и проверить.",
 outcome:"Если ты спрашиваешь о результате, не считай карту гарантией будущего: ищи условие, от которого результат зависит.",
 timing:"Если вопрос о сроках, карта показывает скорее условие готовности и следующий контрольный признак, чем точную дату.",
 future:"Если вопрос о будущем, читай карту как возможное направление при сохранении нынешних условий, а не как неизбежный сценарий.",
 choice:"Если вопрос о выборе, сравни варианты через то, что карта подсвечивает как главный критерий.",
 insight:"Здесь карта лучше всего работает как дополнительный угол зрения на уже существующую ситуацию."
};
function deepPersonalizedAnswer3(n,q,c){
  const p=questionProfile(q), row=DEEP_BY_CARD[n], key=deepTopicKey(p);
  if(!row||!key)return _oldPersonalizedAnswer(n,q,c);
  const idx=DEEP_TOPIC[key], h=answerHash(String(n)+"|"+q), intent=deepIntent(q);
  const variants=[
    "Главный акцент карты здесь — "+row[idx]+".",
    "Если смотреть именно через твой вопрос, карта подсвечивает следующее: "+row[idx]+".",
    "В этом контексте образ читается конкретно: "+row[idx]+"."
  ];
  const openings=[
    "Карта не подменяет решение — она меняет точку, из которой ты на него смотришь.",
    "Важен не абстрактный символ, а его связь с тем, о чём ты спросил.",
    "Этот образ становится точнее, если читать его вместе с формой твоего вопроса."
  ];
  const action=[
    "Проверь это одним конкретным действием.",
    "Получи один новый факт, прежде чем делать следующий вывод.",
    "Измени только тот элемент ситуации, который карта подсвечивает."
  ];
  return [
    openings[h%3],
    "Ты спрашиваешь: «"+(p.t.length>180?p.t.slice(0,180)+"…":p.t)+"».",
    variants[(h>>2)%3],
    INTENT_SUFFIX[intent],
    "Образ «"+c.title+"»: "+c.meaning+".",
    "Тень: "+shadows[n-1],
    "Направление: "+directions[n-1],
    action[(h>>4)%3],
    p.negative?"Не превращай тревогу в доказательство будущего.":p.hopeful?"Проверь надежду фактом, а не ожиданием знака.":"",
    "Окончательный вывод лучше сверять с реальными обстоятельствами."
  ].filter(Boolean).join(" ");
}
personalizedAnswer=deepPersonalizedAnswer3;

const spreadBtn2=document.querySelector("#spreadBtn");
if(spreadBtn2){
  const clone2=spreadBtn2.cloneNode(true);
  spreadBtn2.replaceWith(clone2);
  clone2.onclick=()=>{
    const q=$("#spreadQuestion").value.trim()||"Что мне важно увидеть сейчас?";
    const nums=[];
    while(nums.length<spreadN){const n=Math.floor(Math.random()*60)+1;if(!nums.includes(n))nums.push(n)}
    const labels=spreadN===3?["СИТУАЦИЯ","СКРЫТАЯ ПРИЧИНА","НАПРАВЛЕНИЕ"]:["СЕЙЧАС","ОСНОВАНИЕ","ТЕНЬ","РЕСУРС","СЛЕДУЮЩИЙ ШАГ"];
    const roles=spreadN===3?["meaning","shadow","direction"]:["meaning","direction","shadow","meaning","direction"];
    const p=questionProfile(q), key=deepTopicKey(p);
    const cards=nums.map((n,i)=>{
      const c=card(n),row=DEEP_BY_CARD[n],semantic=row&&key?row[DEEP_TOPIC[key]]:"";
      const base=roles[i]==="meaning"?c.meaning:roles[i]==="shadow"?shadows[n-1]:directions[n-1];
      return {n,title:c.title,label:labels[i],text:semantic||base};
    });
    const bridge=deepIntent(q)==="why"
      ?"Читай расклад как поиск механизма: каждая позиция добавляет новый слой причины."
      :deepIntent(q)==="action"
      ?"Читай расклад как маршрут: от наблюдения к конкретному следующему действию."
      :"Каждая позиция отвечает за свой слой вопроса, поэтому карты читаются вместе, а не как отдельные прогнозы.";
    const joined=bridge+" «"+q.slice(0,140)+"» "+cards.map(x=>x.label+": "+x.text).join(" ");
    const root=document.createElement("div");
    root.innerHTML='<div class="spread-cards"></div><div class="spread-result-line"><small>ЕДИНЫЙ ОТВЕТ</small><p></p></div>';
    const grid=root.querySelector(".spread-cards");
    cards.forEach(x=>{
      const el=document.createElement("div");el.className="spread-card";
      const im=document.createElement("img");im.src=img(x.n);im.alt=x.title;im.onerror=()=>im.style.display="none";
      const lab=document.createElement("label");lab.textContent=x.label;
      const strong=document.createElement("strong");strong.textContent=x.title;
      el.append(im,lab,strong);grid.appendChild(el);
    });
    root.querySelector("p").textContent=joined;
    $("#spreadResult").innerHTML="";$("#spreadResult").appendChild(root);saveHistory(q,nums);
  };
}