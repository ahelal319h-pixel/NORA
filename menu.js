(function(){
"use strict";

/* ====== غيّر رابط صورة الحمار من هنا ======
   لو الرابط فاضي أو مش شغال، بتظهر الرسمة البديلة تلقائياً.
   تقدر كمان تحط ملف جنب index.html باسم donkey.jpg وتكتب "donkey.jpg" */
var DONKEY_IMG_URL = "donkey.jpg";

var MSGS = [
 "نورا؟ إنتي هنا؟ 👀",
 "ألو ألو... تسمعيني؟ 📞",
 "إحنا بنكلمك بقالنا ساعة يا نورا 😂",
 "الشات وحش من غيرك... بس هادي زيادة 😭",
 "طب ده إنتي شايفة الرسايل وساكتة! 💀",
 "عاملة إيه يا نورا؟ مختفية ليه يا نجمة؟ 😂",
 "إيه الأخبار يا بت؟",
 "ردي علينا يا شخصية مهمة 😭",
 "نورا دخلت وضع الطيران ولا إيه؟",
 "إحنا مش هنخلص غير لما تردي 💀",
 "تم إرسال لجنة البحث عن نورا.",
 "آخر ظهور: مشغولة بالتريقة على الناس 😂",
 "يا نورا ده إحنا بنحبك والله، بس بنحب نرخم أكتر 😭",
 "الرسالة دي برعاية قسم الرخامة الدولي.",
 "لو وصلتك الرسالة دي، اعرفي إنك مطلوبة في الشات.",
 "عاملة إيه يا أجمل صداع في حياتنا؟ 😂❤️",
 "متنسيش إنك غالية، حتى لو شبه الحمار شوية.",
 "إشعار عاجل: نورا شخصيتها لا يمكن التعامل معاها.",
 "ردي بقى يا حيوانة، وحشتينا 😂",
 "خلصنا العشرين رسالة... بس لسه عندنا كلام كتير ليكي!"
];
var IGN = [
 "أحمد بعتلك رسالة جديدة 😂",
 "أحمد مستني ردك من العصر 💀",
 "أحمد قرر يعمل موقع كامل عشان يرخم عليكي 😭",
 "أحمد: طب ردي بقى يا ست البنات 😂❤️"
];
var CHAT = [
 "نورا؟ ده أحمد 😂",
 "أنا عملتلك موقع كامل عشان أرخم عليكي... شوفتي المستوى؟ 💀",
 "طب ردي بقى ولو بإيموجي 😭",
 "(الشات ده شكل بس... بس الحب حقيقي ❤️)"
];
var TOTAL = 8;

var $ = function(s){return document.querySelector(s);};
var rand = function(a,b){return a+Math.random()*(b-a);};
var RM = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- مؤقتات ---------- */
var timers = new Set();
function later(fn,ms){var id=setTimeout(function(){timers.delete(id);fn();},ms);timers.add(id);return id;}
function clearTimers(){timers.forEach(clearTimeout);timers.clear();}

/* ---------- صوت ---------- */
var ac=null, muted=false;
function audio(){
 if(!ac){var C=window.AudioContext||window.webkitAudioContext; if(C){try{ac=new C();}catch(e){}}}
 if(ac&&ac.state==="suspended")ac.resume();
 return ac;
}
function tone(f,d,type,vol,slide,delay){
 if(muted)return; var c=audio(); if(!c)return;
 var t=c.currentTime+(delay||0), o=c.createOscillator(), g=c.createGain();
 o.type=type||"sine"; o.frequency.setValueAtTime(f,t);
 if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f+slide),t+d);
 g.gain.setValueAtTime(vol||.08,t); g.gain.exponentialRampToValueAtTime(.0001,t+d);
 o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+d+.03);
}
var sfx={
 pop:function(){tone(880,.1,"triangle",.09,400);},
 ding:function(){tone(1046,.15,"sine",.1);tone(1568,.25,"sine",.08,0,.1);},
 whoosh:function(){tone(700,.4,"sawtooth",.04,-550);},
 honk:function(){tone(240,.4,"sawtooth",.09,-130);tone(180,.35,"square",.04,-80,.06);},
 boom:function(){tone(150,.5,"sawtooth",.12,-110);},
 win:function(){[523,659,784,1046].forEach(function(f,i){tone(f,.22,"triangle",.09,0,i*.1);});}
};
$("#mute").onclick=function(){muted=!muted;this.textContent=muted?"🔇":"🔊";if(!muted){audio();sfx.pop();}};

/* ---------- جسيمات (Canvas) ---------- */
var cv=$("#fx"), cx=cv.getContext("2d"), P=[], raf=0;
var COLORS=["#ff4fa3","#ffd23f","#35c7ff","#8a5cff","#6fe39b","#ff8a3d","#ffffff"];
function resize(){cv.width=innerWidth;cv.height=innerHeight;}
addEventListener("resize",resize); resize();
function addP(p){if(P.length<400)P.push(p);if(!raf)raf=requestAnimationFrame(tick);}
function tick(){
 cx.clearRect(0,0,cv.width,cv.height);
 P=P.filter(function(p){return p.l>0&&p.y<cv.height+40;});
 for(var i=0;i<P.length;i++){
  var p=P[i]; p.vy+=p.g; p.x+=p.vx; p.y+=p.vy; p.vx*=.99; p.r+=p.vr; p.l--;
  cx.save(); cx.globalAlpha=Math.min(1,p.l/30); cx.translate(p.x,p.y); cx.rotate(p.r); cx.fillStyle=p.c;
  if(p.s){cx.fillRect(-p.z/2,-p.z/4,p.z,p.z/2);}else{cx.beginPath();cx.arc(0,0,p.z/2.5,0,7);cx.fill();}
  cx.restore();
 }
 raf=P.length?requestAnimationFrame(tick):(cx.clearRect(0,0,cv.width,cv.height),0);
}
function burst(x,y,n){
 for(var i=0;i<n;i++){var a=rand(0,6.283),s=rand(2,9);
  addP({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-3,g:.22,l:rand(50,90),z:rand(6,13),c:COLORS[(Math.random()*COLORS.length)|0],r:0,vr:rand(-.3,.3),s:Math.random()<.6});}
}
function confetti(n){
 n=RM?Math.min(n,40):n;
 for(var i=0;i<n;i++){
  addP({x:rand(0,cv.width),y:rand(-80,-10),vx:rand(-2,2),vy:rand(1,5),g:.08,l:rand(110,190),z:rand(7,14),c:COLORS[(Math.random()*COLORS.length)|0],r:0,vr:rand(-.25,.25),s:Math.random()<.7});
 }
 burst(cv.width/2,cv.height/2,RM?10:50);
}
function flyEmojis(n){
 var E=["❤️","😂","💖","🤣","💜","✨","😭"];
 for(var i=0;i<n;i++){(function(){
  var e=document.createElement("span"); e.className="fe"; e.textContent=E[(Math.random()*E.length)|0];
  e.style.left=rand(0,95)+"vw"; e.style.fontSize=rand(24,48)+"px";
  e.style.setProperty("--d",rand(2.4,4.5)+"s"); e.style.setProperty("--dx",rand(-120,120)+"px"); e.style.setProperty("--r",rand(-360,360)+"deg");
  e.style.animationDelay=rand(0,1.2)+"s"; document.body.appendChild(e);
  e.addEventListener("animationend",function(){e.remove();});
 })();}
}

/* ---------- خلفيات ---------- */
(function(){
 var bg=$("#bgfx"), em=["😂","💀","🫏","📩","💬","😭","❤️","👀"];
 for(var i=0;i<14;i++){var s=document.createElement("span");s.className="floater";s.textContent=em[i%em.length];
  s.style.left=rand(0,96)+"%";s.style.animationDuration=rand(12,26)+"s";s.style.animationDelay=(-rand(0,20))+"s";bg.appendChild(s);}
 var st=$("#stars");
 for(var j=0;j<28;j++){var d=document.createElement("span");d.className="star";d.style.left=rand(0,100)+"%";d.style.top=rand(0,100)+"%";d.style.animationDelay=rand(0,2.5)+"s";st.appendChild(d);}
 st.style.display="none";
 if(window.matchMedia&&matchMedia("(hover:hover)").matches){
  var g=$("#glow");g.style.display="block";
  addEventListener("mousemove",function(e){g.style.left=e.clientX+"px";g.style.top=e.clientY+"px";});
 }
})();
function makeHearts(){
 var h=$("#hearts"); h.innerHTML=""; if(RM)return;
 var E=["💖","💜","💙","✨","❤️"];
 for(var i=0;i<16;i++){var s=document.createElement("span");s.className="heart";s.textContent=E[i%E.length];
  s.style.left=rand(0,96)+"%";s.style.fontSize=rand(18,34)+"px";s.style.animationDuration=rand(9,18)+"s";s.style.animationDelay=(-rand(0,12))+"s";h.appendChild(s);}
}

/* ---------- المشاهد ---------- */
var cur=0;
var scenes=[]; for(var k=1;k<=TOTAL;k++)scenes[k]=$("#s"+k);
function hideBanner(){$("#tbanner").classList.remove("show");}
function go(n){
 clearTimers(); hideBanner();
 for(var i=1;i<=TOTAL;i++)scenes[i].classList.remove("active");
 cur=n; scenes[n].classList.add("active");
 document.body.classList.toggle("dreamy",n===8);
 $("#stars").style.display=n===8?"block":"none";
 if(n!==8)$("#hearts").innerHTML="";
 $("#plabel").textContent="المرحلة "+n+" من "+TOTAL;
 $("#pbar").style.width=(n/TOTAL*100)+"%";
 scenes[n].scrollTop=0;
 (inits[n]||function(){})();
}
function flipTo(n){
 sfx.whoosh();
 var st=$("#stage"), dur=RM?1:600;
 var a=st.animate([{transform:"perspective(1200px) rotateY(0deg)"},{transform:"perspective(1200px) rotateY(90deg)"}],{duration:dur,easing:"ease-in",fill:"forwards"});
 a.onfinish=function(){
  a.cancel(); go(n);
  st.animate([{transform:"perspective(1200px) rotateY(-90deg)"},{transform:"perspective(1200px) rotateY(0deg)"}],{duration:dur,easing:"ease-out"});
 };
}
function typeText(el,txt,speed,cb){
 var arr=Array.from(txt),i=0; el.textContent="";
 (function step(){
  if(i<=arr.length){el.textContent=arr.slice(0,i++).join("");later(step,speed);}
  else if(cb)cb();
 })();
}

var inits={};

/* 1 */
inits[1]=function(){};
$("#start").onclick=function(){audio();sfx.pop();go(2);};

/* 2 */
inits[2]=function(){$("#mail").classList.remove("open");$("#openMail").disabled=false;};
$("#openMail").onclick=function(){
 this.disabled=true; sfx.ding(); $("#mail").classList.add("open"); burst(innerWidth/2,innerHeight/2,RM?8:26);
 later(function(){go(3);},RM?200:1100);
};

/* 3 */
var dImg=$("#donkeyImg"), dSvg=$("#donkeySvg");
function showFallback(){dImg.hidden=true;dSvg.style.display="";}
dImg.onerror=showFallback;
dImg.onload=function(){dImg.hidden=false;dSvg.style.display="none";};
inits[3]=function(){
 if(DONKEY_IMG_URL&&!dImg.getAttribute("src")){dImg.src=DONKEY_IMG_URL;}
 else if(!DONKEY_IMG_URL){showFallback();}
 sfx.honk();
};
(function(){
 var box=$("#donkeyBox");
 box.addEventListener("pointermove",function(e){
  if(RM)return; var r=box.getBoundingClientRect();
  var x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  box.style.transform="perspective(600px) rotateY("+(x*30)+"deg) rotateX("+(-y*30)+"deg)";
 });
 box.addEventListener("pointerleave",function(){box.style.transform="";});
})();
$("#donkeyNext").onclick=function(){sfx.pop();go(4);};

/* 4 */
inits[4]=function(){};
$("#flipBtn").onclick=function(){flipTo(5);};

/* 5 */
function setBar(f){$("#nbar").style.width=(f*100)+"%";}
function mkCard(txt,cls,who,ico){
 var d=document.createElement("div"); d.className="ncard "+(cls||"");
 d.innerHTML='<div class="nav"></div><div class="nbody"><b></b><span class="ntime">دلوقتي</span><p></p></div>';
 d.querySelector(".nav").textContent=ico||"💬";
 d.querySelector("b").textContent=who||"أحمد 😂";
 d.querySelector("p").textContent=txt; return d;
}
function initNotifs(){
 clearTimers();
 var stack=$("#nstack"); stack.innerHTML="";
 $("#nnext").hidden=true; $("#ncount").textContent="0"; setBar(0);
 $("#ntitle").textContent="الإشعارات بتوصل... 🔔";
 var i=0;
 (function next(){
  if(i>=MSGS.length){later(explode,RM?800:2200);return;}
  stack.appendChild(mkCard(MSGS[i]));
  i++;
  var c=$("#ncount"); c.textContent=i; c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump");
  setBar(i/MSGS.length); sfx.pop(); if(i%5===0)sfx.ding();
  var live=stack.querySelectorAll(".ncard:not(.out)");
  if(live.length>3){var o=live[0];o.classList.add("out");later(function(){o.remove();},420);}
  later(next,RM?700:1500);
 })();
}
function explode(){
 sfx.boom();
 var cards=Array.prototype.slice.call($("#nstack").querySelectorAll(".ncard:not(.out)"));
 cards.forEach(function(c,idx){
  var r=c.getBoundingClientRect();
  c.style.setProperty("--tx",rand(-350,350)+"px"); c.style.setProperty("--ty",(-rand(250,600))+"px"); c.style.setProperty("--rot",rand(-540,540)+"deg");
  c.classList.add("fly");
  later(function(){burst(r.left+r.width/2,r.top+r.height/2,RM?10:36);},300+idx*120);
 });
 later(function(){
  $("#nstack").innerHTML=""; $("#ntitle").textContent="خلصنا العشرين رسالة 🎉"; $("#nnext").hidden=false; sfx.win(); confetti(80);
 },RM?300:1400);
}
inits[5]=initNotifs;
$("#nreplay").onclick=function(){sfx.pop();initNotifs();};
$("#nnext").onclick=function(){sfx.pop();go(6);};

/* 6 */
inits[6]=function(){
 var dark=$("#igdark"); dark.classList.remove("off");
 $("#igicon").className="igicon"; $("#igwave").className="igwave";
 $("#igbanner").classList.remove("show");
 $("#iglist").innerHTML=""; $("#igbtn").hidden=true;
 $("#chatwrap").hidden=true; $("#igintro").hidden=false;
 $("#cmsgs").innerHTML=""; $("#chatnext").hidden=true;
 later(function(){dark.classList.add("off");$("#igicon").classList.add("drop");sfx.whoosh();},500);
 later(function(){$("#igwave").classList.add("go");sfx.boom();burst(innerWidth/2,innerHeight/2-40,RM?8:24);},RM?600:1800);
 later(function(){$("#igbanner").classList.add("show");sfx.ding();},RM?800:2500);
 later(function(){
  $("#igbanner").classList.remove("show");
  var i=0,list=$("#iglist");
  (function nx(){
   if(i>=IGN.length){$("#igbtn").hidden=false;return;}
   list.appendChild(mkCard(IGN[i],"ig","@_ahmed_hellal","📸")); i++; sfx.pop();
   later(nx,RM?500:1200);
  })();
 },RM?1800:5200);
};
$("#igbtn").onclick=function(){
 sfx.pop(); $("#igintro").hidden=true; $("#chatwrap").hidden=false;
 var box=$("#cmsgs"),i=0;
 (function nx(){
  if(i>=CHAT.length){$("#chatnext").hidden=false;return;}
  var t=document.createElement("div");t.className="typing";t.textContent="•••";box.appendChild(t);box.scrollTop=box.scrollHeight;
  later(function(){
   t.remove();
   var b=document.createElement("div");b.className="bub";
   b.innerHTML='<span class="who"></span><span class="txt"></span>';
   b.querySelector(".who").textContent="_ahmed_hellal"; b.querySelector(".who").style.direction="ltr";
   b.querySelector(".txt").textContent=CHAT[i]; box.appendChild(b); box.scrollTop=box.scrollHeight;
   sfx.pop(); i++; later(nx,RM?300:700);
  },RM?300:900);
 })();
};
$("#chatnext").onclick=function(){sfx.pop();go(7);};

/* 7 */
inits[7]=function(){
 $("#bresp").hidden=true; $("#bwait").hidden=false; hideBanner();
 $("#bYes").disabled=false; $("#bNo").disabled=false;
 later(function(){
  $("#tbanner").classList.add("show"); sfx.honk();
  if(navigator.vibrate){try{navigator.vibrate([120,60,120]);}catch(e){}}
 },RM?700:rand(2200,4200));
};
$("#bYes").onclick=function(){
 this.disabled=true; sfx.win(); confetti(140); hideBanner();
 later(function(){go(8);},RM?400:1700);
};
$("#bNo").onclick=function(){
 sfx.honk(); hideBanner(); $("#bwait").hidden=true; $("#bresp").hidden=false;
};
$("#bgo").onclick=function(){sfx.pop();go(8);};

/* 8 */
inits[8]=function(){
 makeHearts();
 var L=["طب بجد يا نورا... 😂❤️",
  "بعيداً عن الرخامة والتريقة، إنتي واحدة من الناس اللي وجودها بيخلّي اليوم ألطف.",
  "ربنا يديم ضحكتك، ويفضل قلبك حلو كده، وتفضلي دايماً مبسوطة.",
  "بس ده مش معناه إننا هنوقف تريقة طبعاً... متتحمسيش 😂💀"];
 var els=document.querySelectorAll("#lines .tline");
 els.forEach(function(e){e.textContent="";});
 ["#fcard","#fsub","#loveBtn","#confess","#sign","#again"].forEach(function(s){$(s).hidden=true;});
 var i=0;
 (function nx(){
  if(i>=L.length){
   later(function(){$("#fcard").hidden=false;sfx.ding();burst(innerWidth/2,innerHeight/2,RM?8:30);},600);
   later(function(){$("#fsub").hidden=false;},1500);
   later(function(){$("#loveBtn").hidden=false;scenes[8].scrollTop=scenes[8].scrollHeight;},2300);
   return;
  }
  var idx=i++; typeText(els[idx],L[idx],RM?8:45,function(){later(nx,RM?200:700);});
 })();
};
$("#loveBtn").onclick=function(){
 this.hidden=true; sfx.win();
 confetti(180); flyEmojis(RM?10:36);
 $("#confess").hidden=false; $("#sign").hidden=false; $("#again").hidden=false;
 later(function(){confetti(120);flyEmojis(RM?6:20);},1400);
 scenes[8].scrollTop=scenes[8].scrollHeight;
};
$("#again").onclick=function(){sfx.pop();go(1);};

/* إعادة كل التجربة */
$("#replayAll").onclick=function(){sfx.pop();go(1);};

go(1);
})();
