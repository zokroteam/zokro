// Shared language menu - one file feeds every page (real flag images work on Windows too)
(function(){
  // Google Analytics (GA4) - one place, every page
  try{
    if(!window.zkGa){
      window.zkGa=1;
      var gs=document.createElement('script');gs.async=true;
      gs.src='https://www.googletagmanager.com/gtag/js?id=G-J9YHPDP39T';
      document.head.appendChild(gs);
      window.dataLayer=window.dataLayer||[];
      window.gtag=function(){window.dataLayer.push(arguments);};
      window.gtag('js',new Date());
      window.gtag('config','G-J9YHPDP39T');
    }
  }catch(e){}
  var holder=document.querySelector('#langmenu');
  if(!holder)return;
  var LANGS=[
    {c:'en',f:'us',name:'English'},
    {c:'ar',f:'eg',name:'العربية'},
  ];
  var cur=(document.documentElement.lang||'en').toLowerCase();
  var here=LANGS.filter(function(l){return l.c===cur;})[0]||LANGS[0];
  var base=holder.getAttribute('data-base')||'../';
  function img(l,cls){return '<img class="'+cls+'" src="https://flagcdn.com/w80/'+l.f+'.png" alt="'+l.c+'" loading="lazy">';}
  var h='<div class="ldd"><button class="lbtn" onclick="document.getElementById(\'lm-x\').classList.toggle(\'open\')">'+img(here,'flg')+'<span>'+here.name+'</span><span>▾</span></button><div class="lmenu" id="lm-x">';
  LANGS.forEach(function(l){
    h+='<a class="'+(l.c===cur?'on':'')+'" href="'+base+l.c+'/" onclick="saveL(\''+l.c+'/\')">'+img(l,'flg')+'<span>'+l.name+'</span></a>';
  });
  h+='</div></div>';
  holder.innerHTML=h;
  // Accounts engine on every page
  try{
    var as=document.createElement('script');as.src=base+'assets/auth.js?v=3';document.head.appendChild(as);
  }catch(e){}
  // Brand: logo + favicon everywhere (one place, all pages)
  try{
    if(!document.querySelector('link[data-zkfont]')){
      var fl=document.createElement('link');fl.rel='stylesheet';fl.setAttribute('data-zkfont','1');
      fl.href='https://fonts.googleapis.com/css2?family=Fredoka:wght@500;700&display=swap';
      document.head.appendChild(fl);
    }
    var logo=document.querySelector('a.logo');
    if(logo)logo.innerHTML='<img src="'+base+'assets/icon.svg" alt="Z" style="height:36px;display:block;float:left;margin-inline-end:10px"><span class="wordmark">ZOKRO</span><span class="wdash"></span>';
    var fav=document.querySelector("link[rel='icon']");
    if(!fav){fav=document.createElement('link');fav.rel='icon';document.head.appendChild(fav);}
    fav.type='image/svg+xml';fav.href=base+'assets/icon.svg';
  }catch(e){}
})();
function saveL(v){try{localStorage.setItem('zk_lang',v);}catch(e){}}
document.addEventListener('click',function(e){
  var menus=document.querySelectorAll('.lmenu.open');
  for(var i=0;i<menus.length;i++){
    if(!menus[i].parentElement.contains(e.target))menus[i].classList.remove('open');
  }
});
// Category chips: language-independent (button order: All, Puzzle, 3D, Daily)
window.zkCat=0;
function zkFavs(){try{var f=JSON.parse(localStorage.getItem('zk_fav')||'[]');return f.map(function(x){return (typeof x==='string')?{u:x}:x;});}catch(e){return [];}}
function zkFavIdx(f,h){for(var i=0;i<f.length;i++)if(f[i].u===h)return i;return -1;}
function zkIsFav(h){if(!h)return false;return zkFavIdx(zkFavs(),h)>=0;}
window.zkToggleFav=function(h,ev){if(ev){ev.preventDefault();ev.stopPropagation();}var f=zkFavs();var i=zkFavIdx(f,h);if(i>=0)f.splice(i,1);else{var html='';try{var c=document.querySelector('#grid .card[href="'+h+'"], #suggest .card[href="'+h+'"]');if(c)html=c.outerHTML;}catch(e){}f.push({u:h,html:html});}try{localStorage.setItem('zk_fav',JSON.stringify(f));}catch(e){}paintFavs();window.zkUserPaged=true;zkEnsureCatalog();zkApplyCat();};
function paintFavs(){var cards=document.querySelectorAll('#grid .card, #suggest .card');for(var i=0;i<cards.length;i++){var c=cards[i];var h=c.getAttribute('href');var b=c.querySelector('.favb');if(!b||!h)continue;var on=zkIsFav(h);b.textContent=on?'❤️':'🤍';if(on)b.classList.add('on');else b.classList.remove('on');}}
// ---- v37: async game catalog (homepage ships ~600 static cards; rest loads on demand) ----
window.zkCatalog=null;window.zkCatLoading=false;window.zkUserPaged=false;
function zkEsc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function zkCardHTML(e){var lang=(document.documentElement.lang||'en').toLowerCase();
  var go=lang==='ar'?'← العب':'Play →';
  var rating=e[8]==='New'?'🆕 New':('★★★★★ '+e[8]);
  var cov=e[5]?(e[5].indexOf('http')===0?e[5]:'../assets/covers/'+e[5]):null;
  var artInner=e[4]+(cov?'<img class="cov" src="'+cov+'" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">':'');
  return '<a class="card" data-cat="'+zkEsc(e[1])+'" data-n="'+zkEsc(e[2])+'" href="games/'+e[0]+'.html"><div class="art '+e[3]+'">'+artInner+'<span class="big-t">'+zkEsc(String(e[6]).toUpperCase())+'</span></div><div class="cbody"><h3>'+zkEsc(e[6])+'</h3><p>'+zkEsc(e[7])+'</p><div class="rowline"><span class="stars">'+rating+'</span><span class="go">'+go+'</span></div></div></a>';}
window.zkDecorate=function(c){if(!c||c.getAttribute('data-deco'))return;c.setAttribute('data-deco','1');
  if(c.getAttribute('data-cat')&&!c.querySelector('.favb')){var h=c.getAttribute('href');
    if(h)c.insertAdjacentHTML('beforeend','<button class="favb" data-u="'+h+'" onclick="window.zkToggleFav(this.getAttribute(\'data-u\'),event)" aria-label="favorite">🤍</button>');}
  c.addEventListener('click',function(){try{var hh=c.getAttribute('href');if(!hh)return;
    var hist=zkHist().filter(function(x){return x!==hh;});hist.unshift(hh);hist=hist.slice(0,20);
    localStorage.setItem('zk_hist',JSON.stringify(hist));}catch(e){}});};
function zkCatURL(){var l=(document.documentElement.lang||'en').toLowerCase();var v=(typeof window.zkCatV==='undefined')?'':('?v='+window.zkCatV);return '../assets/catalog-'+(l==='ar'?'ar':'en')+'.json'+v;}
function zkEnsureCatalog(){if(window.zkCatalog||window.zkCatLoading)return;window.zkCatLoading=true;
  fetch(zkCatURL()).then(function(r){return r.json();}).then(function(j){window.zkCatalog=j||[];window.zkCatLoading=false;zkApplyCat();}).catch(function(){window.zkCatLoading=false;});}
window.zkLimit=120;
window.zkMore=function(){window.zkUserPaged=true;window.zkLimit=(window.zkLimit||120)+120;zkEnsureCatalog();zkApplyCat();};
function zkMoreBtn(){
  var b=document.getElementById('zkmore');
  if(b)return b;
  var g=document.getElementById('grid');if(!g)return null;
  b=document.createElement('button');b.id='zkmore';b.className='cta';b.onclick=function(){window.zkMore();};
  g.parentNode.insertBefore(b,g.nextSibling);
  return b;
}
function zkApplyCat(){
  var q='';try{var qi=document.getElementById('q');q=qi?qi.value.toLowerCase():'';}catch(e){}
  var cats=['all','puzzle','action','sports','racing','adventure','girls','kids','strategy','arcade','3d','fav'];var want=cats[window.zkCat||0]||'all';
  var grid=document.getElementById('grid');if(!grid)return;
  var lang=(document.documentElement.lang||'en').toLowerCase();
  var cards=grid.querySelectorAll('.card');if(!cards.length&&!window.zkCatalog)return;
  var lim=window.zkLimit||120,shown=0,total=0;
  var matchStatic=function(c){var dc=(c.getAttribute('data-cat')||'').toLowerCase();var okC;
    if(want==='all')okC=true;else if(want==='fav')okC=zkIsFav(c.getAttribute('href'));else okC=dc.indexOf(want)>=0;
    var okQ=(!q||((c.getAttribute('data-n')||'')+' '+c.textContent).toLowerCase().indexOf(q)>=0);
    return okC&&okQ;};
  for(var i=0;i<cards.length;i++){var c=cards[i];
    if(matchStatic(c)){total++;if(shown<lim){c.style.display='';shown++;}else c.style.display='none';}
    else c.style.display='none';}
  var cat=window.zkCatalog;
  if(cat&&cat.length){
    var hayExtra=lang==='ar'?' العب':' play';
    var matches=[];
    for(var j=0;j<cat.length;j++){var e=cat[j];
      var dc2=(e[1]||'').toLowerCase();var okC2;
      if(want==='all')okC2=true;else if(want==='fav')okC2=zkIsFav('games/'+e[0]+'.html');else okC2=dc2.indexOf(want)>=0;
      if(!okC2)continue;
      if(q&&(String(e[2]||'')+' '+String(e[6]||'')+' '+String(e[7]||'')+hayExtra).toLowerCase().indexOf(q)<0)continue;
      matches.push(e);}
    total+=matches.length;
    var have={};var dom=grid.querySelectorAll('.card');
    for(var k=0;k<dom.length;k++){var hh=dom[k].getAttribute('href');if(hh)have[hh]=1;}
    var injected=0;
    for(var m=0;m<matches.length&&shown<lim;m++){var href='games/'+matches[m][0]+'.html';
      if(have[href])continue;
      var tmp=document.createElement('div');tmp.innerHTML=zkCardHTML(matches[m]);
      var node=tmp.firstChild;if(!node)continue;
      node.setAttribute('data-dyn','1');node.style.display='';grid.appendChild(node);window.zkDecorate(node);
      have[href]=1;shown++;injected++;}
    if(injected)paintFavs();
    var all=grid.querySelectorAll('.card');
    if(all.length>2500){for(var x=0;x<all.length;x++){var cc=all[x];
      if(cc.getAttribute('data-dyn')&&cc.style.display==='none'&&grid.querySelectorAll('.card').length>2500)cc.remove();}}
  }else if(window.zkUserPaged&&(total>shown||q||want!=='all')){zkEnsureCatalog();}
  else if(!window.zkCatalog&&typeof window.zkCatTotal!=='undefined'&&window.zkCatTotal>total)total=window.zkCatTotal;
  var mb=zkMoreBtn();
  if(mb){
    if(total>shown){mb.style.display='';mb.textContent=(lang==='ar'?'عرض المزيد (':'Show more (')+(total-shown)+')';}
    else mb.style.display='none';
  }
}
document.addEventListener('click',function(e){
  var t=e.target;var b=(t&&t.closest)?t.closest('.chips button'):null;
  if(!b||!b.parentElement)return;
  var btns=b.parentElement.querySelectorAll('button');
  for(var i=0;i<btns.length;i++)btns[i].classList.remove('on');
  b.classList.add('on');
  window.zkCat=Array.prototype.indexOf.call(btns,b);
  window.zkUserPaged=true;zkEnsureCatalog();zkApplyCat();
});
document.addEventListener('input',function(e){
  if(e.target&&e.target.id==='q'){window.zkUserPaged=true;zkEnsureCatalog();setTimeout(zkApplyCat,0);}
});
// Favorites hearts + fav chip + play history + suggested-for-you (all languages)
var ZK_FAV_T={en:'Favs',ar:'المفضلة'};
var ZK_SUG_T={en:['♥ Suggested for you','Based on what you played.'],ar:['♥ مقترح لك','على حسب اللي لعبته قبل كده.']};
function zkHist(){try{return JSON.parse(localStorage.getItem('zk_hist')||'[]');}catch(e){return [];}}
function zkInitSocial(){
  var cards=document.querySelectorAll('#grid .card');
  var i,j;
  for(i=0;i<cards.length;i++){window.zkDecorate(cards[i]);}
  paintFavs();
  var chips=document.querySelector('.chips');
  if(chips&&!chips.querySelector('[data-fav]')){
    var lang=(document.documentElement.lang||'en').toLowerCase();
    var b2=document.createElement('button');b2.setAttribute('data-fav','1');b2.textContent='♥ '+(ZK_FAV_T[lang]||ZK_FAV_T.en);
    chips.appendChild(b2);
  }
  for(j=0;j<cards.length;j++)(function(cc){
    cc.addEventListener('click',function(){
      try{
        var hh=cc.getAttribute('href');if(!hh)return;
        var hist=zkHist().filter(function(x){return x!==hh;});
        hist.unshift(hh);hist=hist.slice(0,20);
        localStorage.setItem('zk_hist',JSON.stringify(hist));
      }catch(e){}
    });
  })(cards[j]);
  zkSuggest();
  zkGoldIcons();
  try{
    var qq=localStorage.getItem('zk_q');
    if(qq){localStorage.removeItem('zk_q');var qi=document.getElementById('q');if(qi){qi.value=qq;if(typeof filter==='function')filter();window.zkUserPaged=true;zkEnsureCatalog();zkApplyCat();var gs0=document.getElementById('games');if(gs0)gs0.scrollIntoView();}}
    if(localStorage.getItem('zk_goto_fav')){localStorage.removeItem('zk_goto_fav');var fb=document.querySelector('.chips [data-fav]');if(fb)fb.click();var gs1=document.getElementById('games');if(gs1)gs1.scrollIntoView();}
    if(localStorage.getItem('zk_goto_cat')!==null&&localStorage.getItem('zk_goto_cat')!==''){var gc=parseInt(localStorage.getItem('zk_goto_cat'));localStorage.removeItem('zk_goto_cat');var cb=document.querySelectorAll('.chips button');if(cb.length>gc)cb[gc].click();var gs1b=document.getElementById('games');if(gs1b)gs1b.scrollIntoView();}
  }catch(e){}
}
function zkSuggest(){
  var grid=document.getElementById('grid');if(!grid)return;
  if(document.getElementById('suggest'))return;
  var hist=zkHist();
  if(!hist.length)return;
  var cards=grid.querySelectorAll('.card');
  var byHref={},i,k;
  for(i=0;i<cards.length;i++){var h=cards[i].getAttribute('href');if(h)byHref[h]=cards[i];}
  var aff={};
  hist.forEach(function(hh){var c=byHref[hh];if(!c)return;var dc=(c.getAttribute('data-cat')||'').split(' ');dc.forEach(function(x){if(x)aff[x]=(aff[x]||0)+1;});});
  var recs=[];
  for(k=0;k<cards.length;k++){var c2=cards[k];var h2=c2.getAttribute('href');
    if(!h2||hist.indexOf(h2)>=0||!c2.getAttribute('data-cat'))continue;
    var dc2=(c2.getAttribute('data-cat')||'').split(' ');var sc=0;
    dc2.forEach(function(x){if(aff[x])sc+=aff[x];});
    if(sc>0)recs.push({c:c2,s:sc});
  }
  recs.sort(function(a,b){return b.s-a.s;});
  if(!recs.length)return;
  var lang=(document.documentElement.lang||'en').toLowerCase();
  var T=ZK_SUG_T[lang]||ZK_SUG_T.en;
  var sec=document.createElement('section');sec.className='sec';sec.id='suggest';
  var html='<h2>'+T[0]+'</h2><p class="d">'+T[1]+'</p><div class="grid">';
  recs.slice(0,4).forEach(function(r){html+=r.c.outerHTML;});
  sec.innerHTML=html+'</div>';
  var gamesSec=document.getElementById('games');
  if(gamesSec&&gamesSec.parentNode)gamesSec.parentNode.insertBefore(sec,gamesSec.nextSibling);
  paintFavs();
  zkGoldIcons();
}
function zkGoldIcons(){
  try{
    var re=new RegExp('^((?:\\p{Extended_Pictographic}(?:\\uFE0F|\\uD83C[\\uDFFB-\\uDFFF])?(?:\\u200D\\p{Extended_Pictographic}(?:\\uFE0F|\\uD83C[\\uDFFB-\\uDFFF])?)*|[\\u2190-\\u21FF\\u23E9-\\u23EF\\u23F0\\u23F3\\u23F8-\\u23FA\\u25B6\\u25C0\\u25B2\\u25BC\\u25C6\\u25CF\\u2605\\u2606\\u2665\\u2666\\u2663\\u2660\\u2713-\\u2716\\u2728\\u2726\\u2B50]\\uFE0F?)\\s?)','u');
    var els=document.querySelectorAll('.chips button,.cta,a.btn,a.backlink,h1,h2,h3,.fl,.count,.sb-contact,.npanel h3,.nitem,.lrow button,.topstrip');
    for(var i=0;i<els.length;i++){var el=els[i];
      if(el.getAttribute('data-gold'))continue;
      var fn=el.firstChild;
      if(!fn||fn.nodeType!==3)continue;
      var m=re.exec(fn.nodeValue);
      if(!m||!m[1])continue;
      el.setAttribute('data-gold','1');
      var sp=document.createElement('span');sp.className='em';sp.textContent=m[1];
      fn.deleteData(0,m[1].length);
      el.insertBefore(sp,fn);
    }
  }catch(e){}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',zkInitSocial);
else zkInitSocial();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){zkApplyCat();});
else zkApplyCat();
// UNIFIED HEADER on every page (big search + bookmark + mobile play pill)
var ZK_HDR={en:{search:'Search games...',play:'▶ Play'},ar:{search:'دوّر على لعبة...',play:'▶ العب'}};
function zkHomeBase(){var b='./';try{var lm=document.querySelector('#langmenu');if(lm)b=lm.getAttribute('data-base')||'./';}catch(e){}return b;}
function zkBookmarkGo(){
  var chip=document.querySelector('.chips [data-fav]');
  if(chip){chip.click();var g=document.getElementById('games');if(g)g.scrollIntoView();}
  else{try{localStorage.setItem('zk_goto_fav','1');}catch(e){}var lg=(document.documentElement.lang||'en').toLowerCase();location.href=zkHomeBase()+lg+'/#games';}
}
function zkHeader(){
  var nav=document.querySelector('nav.nav');if(!nav||nav.getAttribute('data-hdr'))return;
  nav.setAttribute('data-hdr','1');
  nav.classList.add('cg');
  var lang=(document.documentElement.lang||'en').toLowerCase();
  var H=ZK_HDR[lang]||ZK_HDR.en;
  var logo=nav.querySelector('a.logo');
  var s=nav.querySelector('.search');
  if(!s){s=document.createElement('div');s.className='search';s.innerHTML='<input id="q" placeholder="'+H.search+'">';}
  else{var _qi=s.querySelector('input');if(_qi&&!_qi.getAttribute('placeholder'))_qi.setAttribute('placeholder',H.search);}
  var inp=s.querySelector('input');
  if(inp&&!inp.getAttribute('data-qw')){
    inp.setAttribute('data-qw','1');
    inp.addEventListener('keydown',function(e){
      if(e.key==='Enter'){try{localStorage.setItem('zk_q',this.value);}catch(x){}var lg2=(document.documentElement.lang||'en').toLowerCase();location.href=zkHomeBase()+lg2+'/#games';}
    });
  }
  var cta=nav.querySelector('button.cta:not(.playpill)');
  if(!cta){
    cta=document.createElement('button');cta.className='cta loginbtn';
    cta.setAttribute('data-login-text',lang==='ar'?'دخول':'Log In');
    cta.textContent=lang==='ar'?'دخول':'Log In';
    cta.onclick=function(){if(window.zkOpenAuth)window.zkOpenAuth();};
  }
  var lm=document.querySelector('#langmenu');
  var left=document.createElement('div');left.className='hdr-left';
  var hb=document.createElement('button');hb.className='nicon hamb hbtn';hb.id='zk-hamb';hb.innerHTML='<span></span><span></span><span></span>';hb.setAttribute('aria-label','menu');
  hb.onclick=window.zkToggleSide;
  left.appendChild(hb);
  if(logo)left.appendChild(logo);
  var center=document.createElement('div');center.className='hdr-center';
  center.appendChild(s);
  var right=document.createElement('div');right.className='hdr-right';
  right.appendChild(cta);
  if(lm)right.appendChild(lm);
  nav.innerHTML='';
  nav.appendChild(left);nav.appendChild(center);nav.appendChild(right);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',zkHeader);
else zkHeader();
// Dynamic header: slightly transparent + blur while scrolling
(function(){
  function onS(){
    var n=document.querySelector('nav.nav');if(!n)return;
    if((window.scrollY||0)>10)n.classList.add('scrolled');else n.classList.remove('scrolled');
  }
  window.addEventListener('scroll',onS,{passive:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',onS);
  else onS();
})();
// SIDEBAR on every page (desktop fixed rail, mobile drawer) + slim footer links live here too
var ZK_SB={
en:{games:'Games',all:'All games',daily:'Daily challenge',top:'Top players',fav:'Favorites',recent:'Recently played',vote:'Request a game',cats:'Categories',cAll:'All',cPuzzle:'Puzzle',cAction:'Action',cSports:'Sports',cRacing:'Racing',cAdventure:'Adventure',cGirls:'Girls',cKids:'Kids',cStrategy:'Strategy',cArcade:'Arcade',c3d:'3D',cDaily:'Daily',cFav:'Favs',studio:'Studio',ab:'About us',ct:'Contact',rq:'Request a game',legal:'Legal',pv:'Privacy',tm:'Terms',contactUs:'Contact us',copy:'© 2026 Zokro Studio'},
ar:{games:'الألعاب',all:'كل الألعاب',daily:'تحدي اليوم',top:'الأوائل',fav:'المفضلة',recent:'اتلعبت قريب',vote:'اطلب لعبة',cats:'التصنيفات',cAll:'الكل',cPuzzle:'ألغاز',cAction:'أكشن',cSports:'رياضة',cRacing:'سباقات',cAdventure:'مغامرات',cGirls:'بنات',cKids:'أطفال',cStrategy:'استراتيجية',cArcade:'أركيد',c3d:'3D',cDaily:'يومي',cFav:'المفضلة',studio:'الاستوديو',ab:'من نحن',ct:'اتصل بنا',rq:'اطلب لعبة',legal:'قانوني',pv:'الخصوصية',tm:'الشروط',contactUs:'اتصل بنا',copy:'© 2026 استوديو زوكرو'}};
window.zkToggleSide=function(){
  if(window.innerWidth<1024){document.body.classList.toggle('sb-open');}
  else{var h=document.body.classList.toggle('sb-hidden');try{localStorage.setItem('zk_sb_h',h?'1':'0');}catch(e){}}
};
function zkGoCat(i){
  var chips=document.querySelectorAll('.chips button');
  if(chips.length>i){chips[i].click();var g=document.getElementById('games');if(g)g.scrollIntoView();}
  else{try{localStorage.setItem('zk_goto_cat',String(i));}catch(e){}var lg=(document.documentElement.lang||'en').toLowerCase();location.href=zkHomeBase()+lg+'/#games';}
}
function zkSbLink(href,ic,lb){return '<a class="sb-link" href="'+href+'"><span class="sb-ic">'+ic+'</span><span class="sb-lb">'+lb+'</span></a>';}
function zkSbBtn(i,ic,lb){return '<button class="sb-link" data-sbcat="'+i+'"><span class="sb-ic">'+ic+'</span><span class="sb-lb">'+lb+'</span></button>';}
function zkSbActive(){
  try{
    var p=location.pathname.toLowerCase().replace(/index\.html$/,'');
    var links=document.querySelectorAll('#zkside a.sb-link');
    var cands=[];
    for(var i=0;i<links.length;i++){var a=links[i];
      if(a.hasAttribute('data-sbcat'))continue;
      var h=a.getAttribute('href');if(!h)continue;
      var u;try{u=new URL(h,location.href);}catch(e){continue;}
      if(u.pathname.toLowerCase().replace(/index\.html$/,'')===p)cands.push(a);
    }
    var best=null;
    if(location.hash==='#continue'){
      for(var j=0;j<cands.length;j++){if((cands[j].getAttribute('href')||'').indexOf('#continue')>=0){best=cands[j];break;}}
    }
    if(!best&&cands.length)best=cands[0];
    if(best)best.classList.add('on');
  }catch(e){}
}
function buildSidebar(){
  if(document.getElementById('zkside')){
    var _hb=document.getElementById('zk-hamb');
    if(_hb)_hb.onclick=window.zkToggleSide;
    zkSbActive();
    return;
  }
  var holder=document.querySelector('#langmenu');
  var base=holder?holder.getAttribute('data-base'):'./';
  var lang=(document.documentElement.lang||'en').toLowerCase();
  var S=ZK_SB[lang]||ZK_SB.en;
  var home=base+lang+'/',G=base+lang+'/games/';
  var lb=base+'en/leaderboard.html';
  var ab=base+'en/about.html',ct=base+'en/contact.html',rq=base+'en/request.html',pv=base+'en/privacy.html',tm=base+'en/terms.html';
  var a=document.createElement('aside');a.id='zkside';
  a.innerHTML='<button id="sb-x" aria-label="close">✕</button><div class="sb-scroll">'
    +'<div class="sb-sec">'
    +zkSbLink(home+'#games','🏠',S.all)
    +zkSbLink(lb,'🏆',S.top)
    +zkSbBtn(11,'♥',S.fav)
    +zkSbLink(home+'#continue','↩',S.recent)
    +'</div><div class="sb-div"></div>'
    +'<div class="sb-sec"><h4><span>'+S.cats+'</span></h4>'
    +zkSbBtn(0,'🌐',S.cAll)
    +zkSbBtn(1,'🧩',S.cPuzzle)
    +zkSbBtn(2,'⚔️',S.cAction)
    +zkSbBtn(3,'⚽',S.cSports)
    +zkSbBtn(4,'🏎️',S.cRacing)
    +zkSbBtn(5,'🗺️',S.cAdventure)
    +zkSbBtn(6,'🎀',S.cGirls)
    +zkSbBtn(7,'🧸',S.cKids)
    +zkSbBtn(8,'♟️',S.cStrategy)
    +zkSbBtn(9,'🕹️',S.cArcade)
    +zkSbBtn(10,'🎮',S.c3d)
    +'</div><div class="sb-div"></div>'
    +'<div class="sb-sec"><h4><span>'+S.studio+'</span></h4>'
    +zkSbLink(ab,'ℹ️',S.ab)
    +zkSbLink(ct,'✉️',S.ct)
    +zkSbLink(rq,'➕',S.rq)
    +'</div>'
    +'<div class="sb-sec"><h4><span>'+S.legal+'</span></h4>'
    +zkSbLink(pv,'🔒',S.pv)
    +zkSbLink(tm,'📜',S.tm)
    +'</div>'
    +'</div>'
    +'<div class="sb-foot">'
    +'<a class="sb-contact" href="'+ct+'">'+S.contactUs+'</a>'
    +'<div class="sb-links"><a href="'+ab+'">'+S.ab+'</a><a href="'+ct+'">'+S.ct+'</a><a href="'+pv+'">'+S.pv+'</a><a href="'+tm+'">'+S.tm+'</a><a href="'+lb+'">'+S.top+'</a></div>'
    +'<div class="sb-lang"><a href="'+base+'en/" class="'+(lang==='en'?'on':'')+'"><img src="https://flagcdn.com/w80/us.png" alt="en"><span>English</span></a><a href="'+base+'ar/" class="'+(lang==='ar'?'on':'')+'"><img src="https://flagcdn.com/w80/eg.png" alt="ar"><span>عربي</span></a></div>'
    +'<div class="sb-soc"><a href="https://facebook.com/zokrofun" title="Facebook">📘</a><a href="https://instagram.com/zokrofun" title="Instagram">📸</a><a href="https://discord.gg/ZUUeYucQFT" title="Discord">💬</a></div>'
    +'<div class="sb-copy">'+S.copy+' • zokro.fun</div>'
    +'</div>';
  a.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('[data-sbcat]'):null;
    if(b){e.preventDefault();document.body.classList.remove('sb-open');zkGoCat(parseInt(b.getAttribute('data-sbcat')));return;}
    var link=e.target&&e.target.closest?e.target.closest('a.sb-link'):null;
    if(link)document.body.classList.remove('sb-open');
  });
  document.body.appendChild(a);
  if(!document.getElementById('sb-overlay')){
    var ov=document.createElement('div');ov.id='sb-overlay';
    ov.onclick=function(){document.body.classList.remove('sb-open');};
    document.body.appendChild(ov);
  }
  var hb=document.getElementById('zk-hamb');
  if(!hb){
    var nav=document.querySelector('nav.nav');
    if(nav){
      hb=document.createElement('button');hb.className='nicon hamb hbtn';hb.id='zk-hamb';hb.innerHTML='<span></span><span></span><span></span>';hb.setAttribute('aria-label','menu');
      var hl=nav.querySelector('.hdr-left');
      if(hl&&hl.firstChild)hl.insertBefore(hb,hl.firstChild);else if(hl)hl.appendChild(hb);else nav.insertBefore(hb,nav.firstChild);
    }
  }
  if(hb)hb.onclick=window.zkToggleSide;
  var xb=document.getElementById('sb-x');
  if(xb)xb.onclick=function(){document.body.classList.remove('sb-open');};
  zkSbActive();
  try{
    if(window.innerWidth>=1024){
      document.body.classList.add('sb-collapsed');
      var _h=null;try{_h=localStorage.getItem('zk_sb_h');}catch(x){}
      if(_h==='1')document.body.classList.add('sb-hidden');
    }
  }catch(e){}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',buildSidebar);
else buildSidebar();
// AUTO-STAMP: every home/back link becomes a pill button, on any page, any language, forever
(function(){
  function stamp(){
    var as=document.querySelectorAll('.wrap>a[href="./"],.wrap>a[href="../"],.wrap>a[href="/"],.wrap>a[href="index.html"]');
    for(var i=0;i<as.length;i++){if(!as[i].classList.contains('backlink'))as[i].classList.add('backlink');}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',stamp);
  else stamp();
})();
// NAV CENTER: friends + notifications + game reactions (one place, every page, every language)
(function(){
var ZK_NAV_T={
en:{fr:'Friends',my:'My games',nt:'Notifications',login:'Log in to see.',open:'Open profile',empty:'Nothing here yet.'},
ar:{fr:'الأصدقاء',my:'ألعابي',nt:'الإشعارات',login:'سجل دخول عشان تشوف.',open:'افتح البروفايل',empty:'مفيش حاجة لسه.'}};
function T(){var l=(document.documentElement.lang||'en').toLowerCase();return ZK_NAV_T[l]||ZK_NAV_T.en;}
function zkNotifs(){try{return JSON.parse(localStorage.getItem('zk_notifs')||'[]');}catch(e){return [];}}
function zkUnread(){try{return parseInt(localStorage.getItem('zk_notif_un')||'0');}catch(e){return 0;}}
window.zkPushNotif=function(t,u){try{var n=zkNotifs();n.unshift({t:t,u:u||'',d:Date.now()});n=n.slice(0,20);localStorage.setItem('zk_notifs',JSON.stringify(n));localStorage.setItem('zk_notif_un',String(zkUnread()+1));var b=document.getElementById('zk-nbdg');if(b){b.textContent=zkUnread();b.style.display='';}}catch(e){}};
function escH(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function mount(){
  var n=document.querySelector('nav.nav');if(!n||document.getElementById('zk-friends-btn'))return;
  var t=T();
  var wrap=document.createElement('div');wrap.className='hdr-icons';
  wrap.innerHTML='<button class="nicon" id="zk-friends-btn" title="'+t.fr+'"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f5c451" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg><span class="bdg" id="zk-fbdg" style="display:none">0</span></button>'
    +'<button class="nicon" id="zk-bell-btn" title="'+t.nt+'"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f5c451" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg><span class="bdg" id="zk-nbdg" style="display:none">0</span></button>'
    +'<div class="npanel" id="zk-fpanel"><h3>👥 '+t.fr+'</h3><div id="zk-fbody"><div class="nempty">…</div></div></div>'
    +'<div class="npanel" id="zk-npanel"><h3>🔔 '+t.nt+'</h3><div id="zk-nbody"></div></div>';
  var cta=n.querySelector('button.cta');
  if(cta&&cta.parentNode)cta.parentNode.insertBefore(wrap,cta);
  else{var hr=n.querySelector('.hdr-right');if(hr)hr.appendChild(wrap);else n.appendChild(wrap);}
  document.getElementById('zk-friends-btn').onclick=function(){toggle('zk-fpanel');loadFriends();};
  document.getElementById('zk-bell-btn').onclick=function(){toggle('zk-npanel');renderNotifs(true);};
  (function(){
    var bell=document.getElementById('zk-bell-btn');if(!bell||document.getElementById('zk-bookmark-btn'))return;
    var bm=document.createElement('button');bm.className='nicon';bm.id='zk-bookmark-btn';bm.title=t.my||'My games';bm.setAttribute('aria-label','saved games');bm.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f5c451" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"/></svg>';
    bm.onclick=zkBookmarkGo;
    bell.parentNode.insertBefore(bm,bell);
  })();
  document.addEventListener('click',function(e){
    if(e.target&&e.target.closest&&(e.target.closest('.npanel')||e.target.closest('.nicon')))return;
    closeAll();
  });
  seedWelcome();
  renderNotifs(false);
  pollBadges();
  setInterval(pollBadges,60000);
}
function toggle(id){var p=document.getElementById(id);var was=p.classList.contains('open');closeAll();if(!was)p.classList.add('open');}
function closeAll(){var ps=document.querySelectorAll('.npanel.open');for(var i=0;i<ps.length;i++)ps[i].classList.remove('open');}
function seedWelcome(){
  try{
    if(localStorage.getItem('zk_notif_seed'))return;
    localStorage.setItem('zk_notif_seed','1');
    var t=T();
    var n=zkNotifs();n.unshift({t:'🎮 Welcome to Zokro! New games every week.',u:'',d:Date.now()});
    localStorage.setItem('zk_notifs',JSON.stringify(n.slice(0,20)));
    localStorage.setItem('zk_notif_un','1');
  }catch(e){}
}
function renderNotifs(mark){
  var body=document.getElementById('zk-nbody');if(!body)return;
  var t=T(),n=zkNotifs(),h='';
  if(!n.length)h='<div class="nempty">'+t.empty+'</div>';
  n.forEach(function(x){
    var when='';try{when=new Date(x.d).toLocaleDateString();}catch(e){}
    h+='<a class="nitem" href="'+(x.u||'#')+'">'+escH(x.t)+'<small>'+escH(when)+'</small></a>';
  });
  body.innerHTML=h;
  if(mark){try{localStorage.setItem('zk_notif_un','0');}catch(e){}var b=document.getElementById('zk-nbdg');if(b)b.style.display='none';}
  else{var u=zkUnread(),bb=document.getElementById('zk-nbdg');if(bb){if(u>0){bb.textContent=u>9?'9+':u;bb.style.display='';}else bb.style.display='none';}}
  zkGoldIcons();
}
function pollBadges(){
  if(!window.zkAuth||!window.zkAuth.ready||!window.zkAuth.user)return;
  var me=window.zkAuth.user.id;
  try{
    window.zkAuth.client.from('friendships').select('id').eq('friend_id',me).eq('status','pending').then(function(r){
      var b=document.getElementById('zk-fbdg');if(!b)return;
      var n=(r.data||[]).length;
      if(n>0){b.textContent=n>9?'9+':n;b.style.display='';}else b.style.display='none';
    });
  }catch(e){}
}
function loadFriends(){
  var body=document.getElementById('zk-fbody');if(!body)return;
  var t=T();
  if(!window.zkAuth||!window.zkAuth.ready||!window.zkAuth.user){
    body.innerHTML='<div class="nempty">'+t.login+'<br><br><button class="btn-gold" style="border:0;border-radius:12px;padding:10px 22px;font-weight:800;cursor:pointer" onclick="if(window.zkOpenAuth)window.zkOpenAuth()">Log In</button></div>';
    return;
  }
  var me=window.zkAuth.user.id,sb=window.zkAuth.client;
  body.innerHTML='<div class="nempty">…</div>';
  sb.from('friendships').select('id,user_id').eq('friend_id',me).eq('status','pending').then(function(r){
    var rows=r.data||[];
    var ids=rows.map(function(x){return x.user_id;});
    function render(profs){
      var h='';
      if(!rows.length)h='<div class="nempty">'+t.empty+'</div>';
      rows.forEach(function(x){
        var nm=(profs[x.user_id]||'?');
        h+='<div class="nitem"><span>'+escH(nm)+'</span><div class="nact"><button class="btn-gold" onclick="zkFrGo('+x.id+',\'accepted\')">✓</button> <button class="lbtn" onclick="zkFrGo('+x.id+',\'declined\')">✕</button></div></div>';
      });
      var base='./en/profile.html#frsec';
      try{var lm=document.querySelector('#langmenu');var bs=lm?lm.getAttribute('data-base'):'./';base=bs+'en/profile.html#frsec';}catch(e){}
      h+='<a class="nitem" style="color:#f5c451;font-weight:800" href="'+base+'">'+t.open+' →</a>';
      body.innerHTML=h;
      zkGoldIcons();
    }
    if(!ids.length){render({});return;}
    sb.from('profiles').select('id,username').in('id',ids).then(function(r2){
      var profs={};(r2.data||[]).forEach(function(p){profs[p.id]=p.username;});
      render(profs);
    });
  });
}
window.zkFrGo=function(id,how){
  if(!window.zkAuth||!window.zkAuth.user)return;
  var sb=window.zkAuth.client,me=window.zkAuth.user.id;
  if(how==='accepted')sb.from('friendships').update({status:'accepted'}).eq('id',id).then(function(){loadFriends();pollBadges();});
  else sb.from('friendships').delete().eq('id',id).then(function(){loadFriends();pollBadges();});
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);
else mount();
})();
// GAME REACTIONS auto-wire (like/dislike with global counts)
(function(){
  function wire(){
    var row=document.getElementById('lrow');if(!row||row.getAttribute('data-wired'))return;
    var G=row.getAttribute('data-game');if(!G)return;
    row.setAttribute('data-wired','1');
    var up=document.getElementById('lc-up'),dn=document.getElementById('lc-dn');
    var btns=row.querySelectorAll('.lbtn');
    function paint(my){for(var i=0;i<btns.length;i++){var v=parseInt(btns[i].getAttribute('data-v'));if(my===v)btns[i].classList.add('on');else btns[i].classList.remove('on');}}
    function counts(){
      if(!window.zkAuth||!window.zkAuth.ready||!window.zkAuth.client)return;
      window.zkAuth.client.from('game_reactions').select('val').eq('game',G).then(function(r){
        var a=0,b=0;(r.data||[]).forEach(function(x){if(x.val===1)a++;else b++;});
        if(up)up.textContent=a;if(dn)dn.textContent=b;
      });
    }
    var iv=setInterval(function(){
      if(!window.zkAuth||!window.zkAuth.ready)return;clearInterval(iv);
      var sb=window.zkAuth.client,me=window.zkAuth.user?window.zkAuth.user.id:null;
      counts();
      if(me)sb.from('game_reactions').select('val').eq('game',G).eq('user_id',me).single().then(function(r){paint(r.data?r.data.val:0);});
      for(var i=0;i<btns.length;i++)(function(bt){
        bt.onclick=function(){
          if(!window.zkAuth||!window.zkAuth.user){if(window.zkOpenAuth)window.zkOpenAuth();return;}
          var v=parseInt(bt.getAttribute('data-v'));
          bt.disabled=true;
          sb.from('game_reactions').upsert({user_id:me,game:G,val:v}).then(function(){bt.disabled=false;paint(v);counts();});
        };
      })(btns[i]);
    },500);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);
  else wire();
})();
// World-class footer everywhere from one place (runs after page loads)
function buildFooter(){
  try{document.querySelectorAll('footer').forEach(function(x){x.style.display='none';x.setAttribute('aria-hidden','true');});}catch(e){}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',buildFooter);
else buildFooter();
