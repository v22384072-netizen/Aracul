// V34.1 — safe deck back integration (no DOM observer loop)
(function(){
  const BACK='cards/back.svg';
  function backMarkup(cls){return '<img class="v34-card-back '+(cls||'')+'" src="'+BACK+'" alt="Рубашка колоды">'}
  function patchDraw(){
    const d=document.getElementById('drawCard');
    if(!d)return;
    const back=d.querySelector('.back-design');
    if(back&&!d.querySelector('.v34-card-back'))back.outerHTML=backMarkup();
  }
  function patchSpread(){
    document.querySelectorAll('.v27-back').forEach(el=>{
      if(!el.querySelector('.v34-card-back'))el.innerHTML=backMarkup('spread-back');
    });
  }
  function patchAfter(fn){requestAnimationFrame(()=>setTimeout(fn,30))}
  document.addEventListener('click',function(e){
    if(e.target.closest('#askBtn'))patchAfter(patchDraw);
    if(e.target.closest('#spreadBtn'))patchAfter(patchSpread);
  },true);
  patchDraw();
  patchSpread();
})();