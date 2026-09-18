/* V18 — ritual interaction layer */
(function(){
 const $=s=>document.querySelector(s);
 const tg=window.Telegram&&window.Telegram.WebApp;
 if(tg){try{tg.ready();tg.expand()}catch(e){}}
 function vibration(kind){
  if(!tg||!tg.HapticFeedback)return;
  try{tg.HapticFeedback.impactOccurred(kind)}catch(e){}
 }
 document.addEventListener('click',function(e){
  const ask=e.target.closest('#askBtn'), reveal=e.target.closest('#revealBtn'), fresh=e.target.closest('#newQuestionBtn');
  if(ask)vibration('light');
  if(reveal)vibration('medium');
  if(fresh)vibration('light');
 });
 const draw=$('#draw');
 if(draw){
  const observer=new MutationObserver(function(){
   const reading=$('#reading');
   if(!reading||!reading.children.length)return;
   const blocks=reading.querySelectorAll('.read-block');
   blocks.forEach((b,i)=>b.style.animationDelay=(Math.min(i,8)*55)+'ms');
  });
  observer.observe(draw,{subtree:true,childList:true});
 }
})();
