/* V36 — clean single runtime. No legacy event handlers. */
(function(){
  "use strict";
  const $=s=>document.querySelector(s);
  const $$=s=>Array.from(document.querySelectorAll(s));
  const pad=n=>String(n).padStart(2,"0");
  const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
  const img=n=>"cards/"+pad(n)+(n>=31?".png":".jpg");
  const back="cards/back.svg";

  const titles=["Фундамент","Золотая жила","Сад изобилия","Полноводная река","Колодец предков","Хранитель порога","Скала","Солнце в зените","Плодородная земля","Открытая дверь","Рог изобилия","Мост","Крепость","Феникс","Источник","Якорь","Древо рода","Свеча в темноте","Жемчужина","Компас","Якорь на ноге","Золотая клетка","Тень великана","Пустой кошелёк","Песочные часы","Разбитая копилка","Лабиринт","Нищий с золотой чашей","Терновый куст","Слепой банкир","Дырявое ведро","Крыса в колесе","Спящий дракон","Зеркало кривое","Тонущий корабль","Оковы","Прокрустово ложе","Две маски","Лестница в небо","Засохший колодец","Сеятель","Мельница","Кузнец","Торговец","Строитель","Моряк","Алхимик","Пчела","Водопад","Воздушный змей","Весы","Змея, кусающая хвост","Ключ и замок","Птица в полёте","Радуга после грозы","Факел","Вулкан","Хамелеон","Уроборос разорванный","Золотой ребёнок"];
  const catNames={resource:"РЕСУРС И ОПОРА",shadow:"ТЕНЬ И ПРЕПЯТСТВИЯ",action:"ДЕЙСТВИЕ И ТРАНСФОРМАЦИЯ"};
  const cards=titles.map((title,i)=>({id:i+1,title,cat:i<20?"resource":i<40?"shadow":"action"}));

  const meanings=[
    "У тебя уже есть опора, на которой можно строить следующий шаг.","Ресурс рядом, но его ценность могла стать для тебя привычной.","Изобилие требует не только получения, но и заботы о том, что уже растёт.","Поток усиливается, когда для него есть ясное русло.","Прошлое может дать ресурс, если не превращать его в обязательство.","Порог не требует полной уверенности — он требует осознанного шага.","Устойчивость начинается там, где ты перестаёшь искать опору только снаружи.","Позволь результату своей работы быть увиденным.","Рост требует времени, пространства и регулярности.","Возможность может быть уже открыта — проверь, почему ты всё ещё ждёшь разрешения.","Умение принимать — тоже ресурс.","Переход меняет ситуацию только тогда, когда ты действительно идёшь.","Границы должны защищать ресурс, а не запирать тебя.","Освобождение от старого создаёт место для нового.","Ищи источник повторяемого результата, а не случайную удачу.","Стабильность — это не застой, а база для следующего движения.","Корни могут поддерживать, не определяя твоё будущее.","В темноте достаточно увидеть ближайший шаг.","Редкая ценность не становится меньше только потому, что её трудно заметить.","Твой курс требует собственного компаса.","Ограничение становится слабее, когда ты называешь его прямо.","Комфорт может иметь скрытую цену — свободу выбора.","Страх иногда увеличивает проблему сильнее, чем реальные обстоятельства.","Пустота не равна поражению: её можно наполнить новым способом.","Время — такой же ресурс, как деньги.","Старый сценарий не обязан управлять взрослым решением.","Простой маршрут часто теряется под слоем лишних действий.","Ценность, которую ты создаёшь, не требует чужого разрешения.","Рост не обязан быть приятным каждую минуту, но он должен иметь смысл.","Чужая шкала достатка не обязана становиться твоей.","Сначала останови утечку, потом увеличивай поток.","Занятость не равна движению вперёд.","Сила не всегда выглядит как напряжение — иногда она ждёт решения.","Проверь своё отражение фактами, а не привычной критикой.","Маленькая проблема дешевле большой аварии.","Обязательство можно пересмотреть, если его условия изменились.","Твоя форма успеха не обязана совпадать с чужой.","Маска защищает, пока не начинает мешать быть собой.","Риск нельзя считать решением только потому, что он быстрый.","Если источник исчерпан, его нужно заменить, а не обвинять.","Посев и урожай разделяет время.","Идея становится ценностью через действие и проверку.","Цена должна соответствовать ценности обмена.","Честный обмен не требует доказательства собственной значимости.","Система должна работать не только на пределе твоих сил.","Не обязательно видеть весь маршрут, чтобы продолжить путь.","Знакомый ресурс может раскрыться в новом формате.","Маленькие действия становятся сильными через повторение.","Больший поток требует способности его удержать.","Гибкость позволяет менять способ, сохраняя направление.","Увидь повторяющийся цикл и измени его причину.","Ключом часто оказывается конкретный навык.","Иногда свобода начинается с отказа от лишнего контроля.","Пауза не означает остановку — она может быть переходом.","Следующий честный шаг важнее идеального ответа.","Накопленная энергия должна получить выход.","Менять способ можно, не отказываясь от цели.","Новое решение становится настоящим, когда его закрепляют.","С деньгами можно строить спокойные, взрослые отношения."
  ];
  const shadows=cards.map((c,i)=>[
    "Не принимай устойчивость за застой.","Не обесценивай то, что уже умеешь.","Не превращай получение в бесконечное потребление.","Не перекрывай поток тревогой и чрезмерным контролем.","Не позволяй прошлому выбирать за тебя.","Не жди полной готовности перед первым шагом.","Не ищи опору только снаружи.","Не прячь результат из страха оценки.","Не выкапывай семя каждый день.","Не проходи мимо возможности из привычки ждать.","Не отталкивай помощь или оплату из чувства вины.","Не анализируй мост вместо перехода.","Не превращай защиту в изоляцию.","Не пытайся оживить завершённое.","Не путай удачу с устойчивым источником.","Не жертвуй стабильностью ради доказательств.","Не неси чужой семейный груз как долг.","Не требуй полной ясности в темноте.","Не обесценивай редкую ценность.","Не меняй свой курс ради чужой шкалы.","Назови цепь: долг, страх, привычка или обязательство.","Комфорт становится ловушкой, если платой за него становится свобода.","Отдели реальный риск от тени воображения.","Пустота не является доказательством несостоятельности.","Не продавай часы своей жизни слишком дёшево.","Не позволяй старому страху принимать взрослые решения.","Не усложняй маршрут без причины.","Не уменьшай собственную ценность.","Не романтизируй боль.","Не считай чужую цифру мерой себя.","Сначала найди дыру.","Не путай занятость с продвижением.","Не жди внешнего разрешения.","Не доверяй искажённому отражению.","Не откладывай маленькую проблему до кризиса.","Не считай обязательство вечным.","Не подгоняй себя под чужую форму.","Не держись за маску ценой честности.","Не называй риск быстрым решением.","Не выжимай старый источник.","Не требуй урожая в день посева.","Не оставляй идею только в голове.","Не пытайся получать высокую цену без ценности.","Не превращай обмен в борьбу.","Не строй систему на постоянном аврале.","Не требуй увидеть весь берег сразу.","Не усложняй привычное ради новизны.","Не недооценивай маленькие действия.","Не путай масштаб с готовностью.","Не пытайся контролировать каждую переменную.","Не называй прибылью то, что слишком дорого по времени.","Не удивляйся повторению, если не меняешь причину.","Не жди магической двери вместо навыка.","Не удерживай силой то, что готово двигаться.","Не заполняй паузу старой привычкой.","Не требуй готового ответа прямо сейчас.","Не запирай энергию внутри.","Не принимай гибкость за отсутствие принципов.","Не возвращайся автоматически в старый цикл.","Не делай деньги тяжёлой обязанностью."
  ][i]||"Смотри на ситуацию честно и без лишней спешки.");
  const directions=cards.map((c,i)=>[
    "Укрепи одну уже работающую опору конкретным действием.","Проверь один недоиспользованный ресурс на практике.","Вложи внимание в то, что уже приносит результат.","Найди место остановки потока и сделай шаг к его запуску.","Отдели своё правило от семейного сценария.","Сделай один шаг через давно видимый порог.","Создай точку устойчивости, которая останется при переменах.","Покажи результат человеку, которому он действительно нужен.","Создай условия для роста одного ресурса.","Используй доступную возможность без ожидания разрешения.","Назови, какую помощь или оплату ты готов принять.","Определи конкретное действие для перехода.","Защити один ресурс ясной границей.","Освободи место для нового.","Найди повторяемый источник результата.","Закрепи работающее до добавления нового риска.","Возьми из прошлого ресурс, а не ограничение.","Сделай ближайший маленький шаг.","Назови качество, которое делает тебя ценнее.","Проверь, действительно ли цель твоя.","Назови ограничение и уменьши его влияние.","Определи цену привычного комфорта.","Сделай страх конкретным и отдели факты от предположений.","Выбери первый источник наполнения.","Посмотри, во что превращается один час твоего дня.","Сформулируй взрослое правило вместо старого убеждения.","Нарисуй самый простой маршрут к следующему результату.","Назови цену, соответствующую создаваемой ценности.","Выбери один безопасный шаг через сопротивление.","Убери одну чужую мерку.","Закрой одну финансовую дыру сегодня.","Измени один элемент повторяющегося цикла.","Разбуди забытый ресурс.","Проверь одну мысль о себе фактами.","Реши маленькую проблему сейчас.","Пересмотри одно обязательство.","Сформулируй собственное определение достатка.","Скажи прямо то, что хочешь вместо роли.","Перед риском посчитай цену ошибки.","Направь энергию от старого источника в новый.","Выбери одну инвестицию в будущее.","Доведи одну идею до проверяемого результата.","Улучши один элемент мастерства.","Сделай условия обмена прозрачными.","Опиши процесс, который работает без аврала.","Сделай следующий шаг к новому берегу.","Примени знакомый ресурс к новой задаче.","Повтори маленькое действие по плану.","Проверь деньги, время и нагрузку перед расширением.","Оставь одну переменную для эксперимента.","Сравни результат с ценой по времени и энергии.","Измени причину повторяющегося цикла.","Освой конкретный навык, который открывает следующий уровень.","Позволь тому, что готово двигаться, двигаться.","Не заполняй паузу автоматически.","Сделай следующий честный шаг.","Дай энергии безопасный выход.","Сохрани направление, меняя способ.","Закрепи новое решение повторением.","Построй более спокойное отношение к деньгам."
  ][i]||"Сделай один ясный следующий шаг.");
  const questions=cards.map((c,i)=>[
    "На что ты можешь опереться уже сегодня?","Какой ресурс ты недооцениваешь?","Что уже растёт и требует ухода?","Где ты сам перекрываешь поток?","Что из прошлого ты выбираешь оставить себе?","Какой шаг давно ждёт тебя?","Что является твоей настоящей опорой?","Где результату пора стать видимым?","Что нужно твоему ресурсу для роста?","Почему ты ждёшь разрешения?","Что тебе трудно принимать?","Через какой мост ты готов пройти?","Какая граница сохранит твой ресурс?","Что пора отпустить?","Как сделать результат повторяемым?","Что уже работает и нуждается в закреплении?","Что из семейного сценария действительно твоё?","Какой следующий шаг достаточно мал, чтобы сделать его сейчас?","Что в тебе имеет редкую ценность?","Куда действительно указывает твой компас?","Что именно тебя связывает?","Какую цену ты платишь за комфорт?","Что реально, а что только кажется огромным?","Как ты хочешь заполнить это пространство?","Куда уходит твоё время?","Какое старое убеждение пора заменить?","Как выглядит самый простой маршрут?","Какую ценность ты уже создаёшь?","Какой дискомфорт ведёт к росту, а какой нет?","Чья шкала сейчас измеряет тебя?","Где твоя финансовая утечка?","Какой элемент цикла можно изменить?","Что в тебе давно ждёт пробуждения?","Как проверить своё отражение фактами?","Что станет дороже, если отложить?","Какое обязательство можно пересмотреть?","Как выглядит твой собственный размер успеха?","Какую маску можно снять?","Что произойдёт, если риск окажется ошибкой?","Какой источник пора заменить?","Что ты сейчас сеешь?","Как превратить идею в результат?","Какой навык увеличит ценность?","Что является честным обменом?","Что можно превратить в систему?","Какой берег ты выбираешь?","Где знакомый ресурс может работать иначе?","Что маленькое можно делать регулярно?","Готов ли твой ресурс к большему потоку?","Что можно изменить без потери направления?","Какую цену ты платишь за результат?","Какой цикл пора разорвать?","Какой навык может стать ключом?","Что готово двигаться без твоего контроля?","Что происходит в этой паузе?","Какой следующий шаг уже виден?","Куда направить накопленную энергию?","Как сохранить цель, меняя способ?","Что нужно сделать, чтобы новое стало привычкой?","Какие отношения с деньгами ты хочешь построить?"
  ][i]||"Что эта карта помогает тебе увидеть?");

  function data(n){const c=cards[n-1];return {...c,meaning:meanings[n-1]||"",shadow:shadows[n-1]||"",direction:directions[n-1]||"",question:questions[n-1]||""};}
  function backHTML(){return '<img class="v36-back" src="'+back+'" alt="Рубашка колоды">';}
  function show(id){
    $$(".screen").forEach(s=>s.classList.toggle("active",s.id===id));
    $$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.screen===id));
    window.scrollTo({top:0,behavior:"instant"});
    if(id==="deck")renderDeck();
    if(id==="history")renderHistory();
    if(id==="daily")renderDaily();
    if(id==="mydeck")renderMyDeck();
  }
  function imageOrFallback(n,title,cls){
    return '<img class="'+(cls||"")+'" src="'+img(n)+'" alt="'+esc(title)+'" onerror="this.outerHTML=\'<div class="v36-missing">'+pad(n)+' · '+esc(title)+'</div>\'">';
  }
  function renderDeck(filter="all"){
    const grid=$("#cardGrid"); if(!grid)return;
    const list=cards.filter(c=>filter==="all"||c.cat===filter);
    grid.innerHTML=list.map(c=>'<article class="v36-card" data-card="'+c.id+'"><div class="v36-art">'+imageOrFallback(c.id,c.title)+'</div><div class="v36-card-meta"><small>'+pad(c.id)+'</small><b>'+esc(c.title)+'</b><em>'+esc(catNames[c.cat])+'</em></div></article>').join("");
  }
  function detail(n){
    const c=data(n);
    $("#detailContent").innerHTML='<div class="v36-detail"><div class="v36-detail-art">'+imageOrFallback(n,c.title)+'</div><div class="v36-detail-copy"><small>'+pad(n)+' · '+esc(catNames[c.cat])+'</small><h2>'+esc(c.title)+'</h2><div class="v36-block"><small>ЗНАЧЕНИЕ</small><p>'+esc(c.meaning)+'</p></div><div class="v36-block"><small>ТЕНЬ</small><p>'+esc(c.shadow)+'</p></div><div class="v36-block"><small>ВОПРОС К КАРТЕ</small><p>'+esc(c.question)+'</p></div><div class="v36-block"><small>НАПРАВЛЕНИЕ</small><p>'+esc(c.direction)+'</p></div><button class="v36-save" data-save="'+n+'">☆ Сохранить в мою колоду</button></div></div>';
    show("detail");
  }
  function history(){
    let h=[];try{h=JSON.parse(localStorage.getItem("cardsKnownHistory")||"[]")}catch(e){}
    const box=$("#historyList");if(!box)return;
    if(!h.length){box.innerHTML='<div class="empty">Здесь пока нет чтений.<br>Задай первый вопрос.</div>';return;}
    box.innerHTML=h.map((r,i)=>'<article class="v36-history"><small>'+esc(r.date||"")+'</small><p>«'+esc(r.q||"")+'»</p><div>'+((r.nums||[]).map(n=>'<button data-history-card="'+n+'">'+pad(n)+'</button>').join(""))+'</div></article>').join("");
  }
  function saveCard(n){
    let a=[];try{a=JSON.parse(localStorage.getItem("cardsKnownMyDeck")||"[]")}catch(e){}
    if(!a.includes(n))a.unshift(n);
    localStorage.setItem("cardsKnownMyDeck",JSON.stringify(a.slice(0,60)));
    renderMyDeck();
  }
  function renderMyDeck(){
    const s=$("#mydeck");if(!s)return;
    let a=[];try{a=JSON.parse(localStorage.getItem("cardsKnownMyDeck")||"[]")}catch(e){}
    $("#myCount").textContent=pad(a.length);
    $("#myGrid").innerHTML=a.length?a.map(n=>{const c=data(n);return '<article class="v36-my-card"><button data-my-card="'+n+'">'+imageOrFallback(n,c.title)+'</button><div><small>'+pad(n)+'</small><b>'+esc(c.title)+'</b><button data-remove="'+n+'">Убрать</button></div></article>'}).join(""):'<div class="empty">Моя колода пока пуста.</div>';
  }
  function ensureMyDeck(){
    if($("#mydeck"))return;
    const s=document.createElement("section");s.id="mydeck";s.className="screen";
    s.innerHTML='<button class="back" data-screen="home">← На главную</button><div class="section-title"><div><small>ЛИЧНОЕ</small><h2>Моя колода</h2></div><span id="myCount">00</span></div><p class="lead">Карты, которые ты оставил рядом.</p><div id="myGrid" class="v36-my-grid"></div>';
    $("main").appendChild(s);
  }
  function dailyNumber(){
    const d=new Date();const s=d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0)%60+1;
  }
  function renderDaily(){
    if(!$("#daily"))return;
    const n=dailyNumber(),c=data(n),d=new Date();
    $("#dailyDate").textContent=d.toLocaleDateString("ru-RU",{day:"2-digit",month:"long",year:"numeric"});
    $("#dailyTitle").textContent="Твоя карта ещё закрыта.";
    $("#dailySub").textContent="Открой её, когда захочешь начать день с одного ясного образа.";
    $("#dailyCard").className="v36-daily-card";$("#dailyCard").innerHTML=backHTML();
    $("#dailyOpen").hidden=false;$("#dailyReading").innerHTML="";
    try{const r=JSON.parse(localStorage.getItem("cardsKnownDaily")||"{}");if(r.date===d.toISOString().slice(0,10)&&r.card===n&&r.opened)openDaily(false)}catch(e){}
  }
  function openDaily(){
    const n=dailyNumber(),c=data(n),now=new Date();
    $("#dailyCard").className="v36-daily-card open";$("#dailyCard").innerHTML=imageOrFallback(n,c.title);
    $("#dailyTitle").textContent=c.title;$("#dailySub").textContent=catNames[c.cat];
    $("#dailyOpen").hidden=true;
    $("#dailyReading").innerHTML='<div class="v36-block"><small>ЗНАЧЕНИЕ</small><p>'+esc(c.meaning)+'</p></div><div class="v36-block"><small>ТЕНЬ</small><p>'+esc(c.shadow)+'</p></div><div class="v36-block"><small>ОДИН ШАГ</small><p>'+esc(c.direction)+'</p></div><div class="v36-block"><small>ВОПРОС ДНЯ</small><p>'+esc(c.question)+'</p></div><button class="v36-save" data-save="'+n+'">☆ Добавить в мою колоду</button>';
    localStorage.setItem("cardsKnownDaily",JSON.stringify({date:now.toISOString().slice(0,10),card:n,opened:true}));
  }
  function answer(q,c){return 'Карта «'+c.title+'» предлагает посмотреть на твой вопрос через тему: '+c.meaning.toLowerCase()+' Важен не готовый прогноз, а то, какое действие ты выберешь после этого взгляда.';}
  function ask(){
    const q=$("#question").value.trim();if(!q){$("#question").focus();return}
    window.v36Question=q;show("draw");
    $("#drawStep").textContent="01 / 03";$("#drawTitle").textContent="Я слушаю.";$("#drawSub").textContent="Не меняй вопрос. Просто побудь с ним несколько секунд.";
    $("#drawCard").className="v36-draw-card";$("#drawCard").innerHTML=backHTML();$("#reading").innerHTML="";$("#revealBtn").hidden=true;
    clearTimeout(window.v36Timer);
    window.v36Timer=setTimeout(()=>{if(window.v36Question!==q)return;$("#drawStep").textContent="02 / 03";$("#drawTitle").textContent="Карта выбрана.";$("#drawSub").textContent="Когда будешь готов — открой её.";$("#revealBtn").hidden=false},800);
  }
  function reveal(){
    const q=window.v36Question||$("#question").value.trim();if(!q){show("home");return}
    const n=Math.floor(Math.random()*60)+1,c=data(n);
    $("#drawStep").textContent="03 / 03";$("#drawTitle").textContent=c.title;$("#drawSub").textContent=catNames[c.cat];
    $("#drawCard").className="v36-draw-card open";$("#drawCard").innerHTML=imageOrFallback(n,c.title);
    $("#revealBtn").hidden=true;
    $("#reading").innerHTML='<div class="v36-reading-head"><small>ТВОЁ ЧТЕНИЕ · '+pad(n)+' / 60</small><h3>Карта отвечает на твой вопрос</h3><p>«'+esc(q)+'»</p></div><div class="v36-block"><small>ОТВЕТ</small><p>'+esc(answer(q,c))+'</p></div><div class="v36-block"><small>ТЕНЬ</small><p>'+esc(c.shadow)+'</p></div><div class="v36-block"><small>ТВОЁ НАПРАВЛЕНИЕ</small><p>'+esc(c.direction)+'</p></div><div class="v36-block"><small>ВОПРОС ОТ КАРТЫ</small><p>'+esc(c.question)+'</p></div><button class="v36-save" data-save="'+n+'">☆ Добавить в мою колоду</button><button class="new-question" data-new>Задать новый вопрос →</button>';
    let h=[];try{h=JSON.parse(localStorage.getItem("cardsKnownHistory")||"[]")}catch(e){}h.unshift({q,nums:[n],date:new Date().toLocaleDateString("ru-RU",{day:"2-digit",month:"long"})});localStorage.setItem("cardsKnownHistory",JSON.stringify(h.slice(0,30)));
  }
  function spread(){
    const q=($("#spreadQuestion")?.value||"").trim()||"Что мне важно увидеть сейчас?";
    const total=window.v36SpreadN===5?5:3,nums=[];
    while(nums.length<total){const n=1+Math.floor(Math.random()*60);if(!nums.includes(n))nums.push(n)}
    const labels=total===3?["СИТУАЦИЯ","СКРЫТАЯ ПРИЧИНА","НАПРАВЛЕНИЕ"]:["СЕЙЧАС","ОСНОВАНИЕ","ТЕНЬ","РЕСУРС","СЛЕДУЮЩИЙ ШАГ"];
    $("#spreadResult").innerHTML='<div class="v36-spread-grid">'+nums.map((n,i)=>{const c=data(n);return '<article class="v36-spread-card">'+imageOrFallback(n,c.title)+'<small>'+labels[i]+'</small><b>'+esc(c.title)+'</b></article>'}).join("")+'</div><div class="v36-block"><small>ЛИНИЯ РАСКЛАДА</small><p>Вопрос: «'+esc(q)+'». '+nums.map((n,i)=>labels[i]+" — «"+data(n).title+"»: "+data(n).meaning).join(" ")+'</p></div>';
    let h=[];try{h=JSON.parse(localStorage.getItem("cardsKnownHistory")||"[]")}catch(e){}h.unshift({q,nums,date:new Date().toLocaleDateString("ru-RU",{day:"2-digit",month:"long"})});localStorage.setItem("cardsKnownHistory",JSON.stringify(h.slice(0,30)));
  }

  function bind(){
    if(window.Telegram?.WebApp){try{Telegram.WebApp.ready();Telegram.WebApp.expand()}catch(e){}}
    ensureMyDeck();
    const nav=$(".nav");
    nav.innerHTML='<button class="nav-item active" data-screen="home"><b>К</b><span>Вопрос</span></button><button class="nav-item" data-screen="deck"><b>60</b><span>Колода</span></button><button class="nav-item" data-screen="spread"><b>+</b><span>Расклад</span></button><button class="nav-item" data-screen="daily"><b>01</b><span>Карта дня</span></button><button class="nav-item" data-screen="history"><b>↺</b><span>Архив</span></button>';
    $(".home-links").innerHTML='<button data-screen="deck"><span>01</span><b>Вся колода</b><i>→</i></button><button data-screen="spread"><span>02</span><b>Расклад</b><i>→</i></button><button data-screen="daily"><span>03</span><b>Карта дня</b><i>→</i></button><button data-screen="mydeck"><span>04</span><b>Моя колода</b><i>→</i></button>';
    $("#count").textContent="0 / 240";
    $("#question").addEventListener("input",e=>$("#count").textContent=e.target.value.length+" / 240");
    document.addEventListener("click",e=>{
      const b=e.target.closest("button,[data-screen],[data-card],[data-history-card],[data-my-card],[data-remove],[data-save],[data-new]");if(!b)return;
      if(b.id==="askBtn"){e.preventDefault();ask();return}
      if(b.id==="revealBtn"){e.preventDefault();reveal();return}
      if(b.id==="dailyOpen"){e.preventDefault();openDaily();return}
      if(b.id==="spreadBtn"){e.preventDefault();spread();return}
      if(b.dataset.new!==undefined){e.preventDefault();show("home");$("#question").value="";$("#count").textContent="0 / 240";return}
      if(b.dataset.save){e.preventDefault();saveCard(+b.dataset.save);b.textContent="★ В моей колоде";b.classList.add("saved");return}
      if(b.dataset.remove){e.preventDefault();let a=[];try{a=JSON.parse(localStorage.getItem("cardsKnownMyDeck")||"[]")}catch(e){}localStorage.setItem("cardsKnownMyDeck",JSON.stringify(a.filter(n=>n!==+b.dataset.remove)));renderMyDeck();return}
      if(b.dataset.card){e.preventDefault();detail(+b.dataset.card);return}
      if(b.dataset.historyCard){e.preventDefault();detail(+b.dataset.historyCard);return}
      if(b.dataset.myCard){e.preventDefault();detail(+b.dataset.myCard);return}
      if(b.classList.contains("filter")){e.preventDefault();$$(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderDeck(b.dataset.cat||"all");return}
      if(b.classList.contains("pick")){e.preventDefault();$$(".pick").forEach(x=>x.classList.remove("active"));b.classList.add("active");window.v36SpreadN=+b.dataset.n;return}
      if(b.dataset.screen){e.preventDefault();show(b.dataset.screen);return}
      if(b.id==="aboutBtn"){e.preventDefault();show("about");return}
    });
    $("#askBtn").addEventListener("keydown",e=>{if(e.key==="Enter")ask()});
    $("#question").addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key==="Enter")ask()});
    $("#revealBtn").hidden=true;
    renderDeck();history();renderDaily();renderMyDeck();
  }

  // Remove legacy delegated handlers by replacing only the page runtime: this file is loaded last.
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bind,{once:true});else bind();
})();