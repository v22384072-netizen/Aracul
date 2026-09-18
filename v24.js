// V24 — усиливаем ритуал карты дня
(function(){
  const q=s=>document.querySelector(s);
  const KEY="cardsKnownDaily";
  const today=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
  function pulse(){
    const s=q("#daily"); if(!s)return;
    s.classList.remove("daily-ritual"); void s.offsetWidth; s.classList.add("daily-ritual");
    setTimeout(()=>s.classList.remove("daily-ritual"),1700);
  }
  function dailySound(){
    try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return;const a=new A(),o=a.createOscillator(),g=a.createGain();
      o.type="sine";o.frequency.setValueAtTime(392,a.currentTime);o.frequency.exponentialRampToValueAtTime(523.25,a.currentTime+.45);
      g.gain.setValueAtTime(.0001,a.currentTime);g.gain.exponentialRampToValueAtTime(.035,a.currentTime+.05);g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+.75);
      o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+.8);setTimeout(()=>a.close(),900)
    }catch(e){}
  }
  function markViewed(n){
    let d={};try{d=JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){}
    d.date=today();d.card=n;d.opened=true;d.openedAt=new Date().toISOString();localStorage.setItem(KEY,JSON.stringify(d));
  }
  document.addEventListener("click",e=>{
    const b=e.target.closest("#dailyOpen"); if(!b)return;
    pulse();dailySound();
    if(navigator.vibrate)navigator.vibrate([18,35,28]);
    setTimeout(()=>{
      const image=q("#dailyCard img");
      const m=image&&image.src.match(/([0-9]{2})\.jpg/);
      if(m)markViewed(+m[1]);
    },500);
  });
  document.addEventListener("visibilitychange",()=>{
    if(!document.hidden&&q("#daily")?.classList.contains("active"))q("#dailyDate")?.animate([{opacity:.45},{opacity:1}],{duration:500})
  });
})();