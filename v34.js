// V34 — card back integration
(function(){
  const BACK='cards/back.svg';
  function backMarkup(cls){return '<img class="v34-card-back '+(cls||'')+'" src="'+BACK+'" alt="Рубашка колоды">'}
  function patchDraw(){
    const d=document.getElementById('drawCard');
    if(d && d.querySelector('.back-design') && !d.querySelector('.v34-card-back')) d.querySelector('.back-design').outerHTML=backMarkup();
  }
  function patchSpread(){
    document.querySelectorAll('.v27-back').forEach(el=>{if(!el.querySelector('.v34-card-back')) el.innerHTML=backMarkup('spread-back')});
  }
  const ask=document.getElementById('askBtn');
  if(ask){const old=ask.onclick; ask.onclick=function(e){const r=old&&old.call(this,e); setTimeout(patchDraw,0); return r};}
  const obs=new MutationObserver(()=>{patchDraw();patchSpread()});
  obs.observe(document.body,{subtree:true,childList:true});
  patchDraw(); patchSpread();
})();