// V34 — deck back + dual image format support
(function(){
  const BACK='cards/back.svg';
  function backMarkup(cls){return '<img class="v34-card-back '+(cls||'')+'" src="'+BACK+'" alt="Рубашка колоды">'}
  function patchDraw(){
    const d=document.getElementById('drawCard');
    if(d && d.querySelector('.back-design') && !d.querySelector('.v34-card-back')) d.querySelector('.back-design').outerHTML=backMarkup();
  }
  function patchSpread(){
    document.querySelectorAll('.v27-back').forEach(el=>{
      if(!el.querySelector('.v34-card-back')) el.innerHTML=backMarkup('spread-back');
    });
  }
  function patchImages(){
    document.querySelectorAll('img[src*="cards/"]').forEach(img=>{
      if(img.dataset.v34Bound)return;
      img.dataset.v34Bound='1';
      img.addEventListener('error',function(){
        const m=this.src.match(/cards\/(\d{2})\.jpg(?:\?.*)?$/);
        if(m && !this.dataset.v34Png){
          this.dataset.v34Png='1';
          this.src='cards/'+m[1]+'.png?v=34.0';
        }
      });
    });
  }
  const ask=document.getElementById('askBtn');
  if(ask){
    const old=ask.onclick;
    ask.onclick=function(e){const r=old&&old.call(this,e); setTimeout(()=>{patchDraw();patchImages()},0); return r};
  }
  const obs=new MutationObserver(()=>{patchDraw();patchSpread();patchImages()});
  obs.observe(document.body,{subtree:true,childList:true});
  patchDraw(); patchSpread(); patchImages();
})();