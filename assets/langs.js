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
window.zkToggleFav=function(h,ev){if(ev){ev.preventDefault();ev.stopPropagation();}var f=zkFavs();var i=zkFavIdx(f,h);if(i>=0)f.splice(i,1);else{var html='';try{var c=document.querySelector('#grid .card[href="'+h+'"], #suggest .card[href="'+h+'"]');if(c)html=c.outerHTML;}catch(e){}f.push({u:h,html:html});}try{localStorage.setItem('zk_fav',JSON.stringify(f));}catch(e){}paintFavs();zkApplyCat();};
function paintFavs(){var cards=document.querySelectorAll('#grid .card, #suggest .card');for(var i=0;i<cards.length;i++){var c=cards[i];var h=c.getAttribute('href');var b=c.querySelector('.favb');if(!b||!h)continue;var on=zkIsFav(h);b.textContent=on?'❤️':'🤍';if(on)b.classList.add('on');else b.classList.remove('on');}}
function zkApplyCat(){
  var q='';try{var qi=document.getElementById('q');q=qi?qi.value.toLowerCase():'';}catch(e){}
  var cats=['all','puzzle','3d','daily','fav'];var want=cats[window.zkCat||0]||'all';
  var cards=document.querySelectorAll('#grid .card');if(!cards.length)return;
  for(var i=0;i<cards.length;i++){var c=cards[i];
    var dc=(c.getAttribute('data-cat')||'').toLowerCase();
    var okC;
    if(want==='all')okC=true;
    else if(want==='fav')okC=zkIsFav(c.getAttribute('href'));
    else okC=dc.indexOf(want)>=0;
    var okQ=(!q||((c.getAttribute('data-n')||'')+' '+c.textContent).toLowerCase().indexOf(q)>=0);
    c.style.display=(okC&&okQ)?'':'none';}
}
document.addEventListener('click',function(e){
  var t=e.target;var b=(t&&t.closest)?t.closest('.chips button'):null;
  if(!b||!b.parentElement)return;
  var btns=b.parentElement.querySelectorAll('button');
  for(var i=0;i<btns.length;i++)btns[i].classList.remove('on');
  b.classList.add('on');
  window.zkCat=Array.prototype.indexOf.call(btns,b);
  zkApplyCat();
});
document.addEventListener('input',function(e){
  if(e.target&&e.target.id==='q')setTimeout(zkApplyCat,0);
});
// Favorites hearts + fav chip + play history + suggested-for-you (all languages)
var ZK_FAV_T={en:'Favs',ar:'المفضلة'};
var ZK_SUG_T={en:['♥ Suggested for you','Based on what you played.'],ar:['♥ مقترح لك','على حسب اللي لعبته قبل كده.']};
function zkHist(){try{return JSON.parse(localStorage.getItem('zk_hist')||'[]');}catch(e){return [];}}
function zkInitSocial(){
  var cards=document.querySelectorAll('#grid .card');
  var i,j;
  for(i=0;i<cards.length;i++){var c=cards[i];
    if(!c.getAttribute('data-cat')||c.querySelector('.favb'))continue;
    var h=c.getAttribute('href');if(!h)continue;
    c.insertAdjacentHTML('beforeend','<button class="favb" data-u="'+h+'" onclick="window.zkToggleFav(this.getAttribute(\'data-u\'),event)" aria-label="favorite">🤍</button>');
  }
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
  try{
    var qq=localStorage.getItem('zk_q');
    if(qq){localStorage.removeItem('zk_q');var qi=document.getElementById('q');if(qi){qi.value=qq;if(typeof filter==='function')filter();zkApplyCat();var gs0=document.getElementById('games');if(gs0)gs0.scrollIntoView();}}
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
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',zkInitSocial);
else zkInitSocial();
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
  var hb=document.createElement('button');hb.className='nicon hamb hbtn';hb.id='zk-hamb';hb.innerHTML='☰';hb.setAttribute('aria-label','menu');
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
// SIDEBAR on every page (desktop fixed rail, mobile drawer) + slim footer links live here too
var ZK_SB={
en:{games:'Games',all:'All games',daily:'Daily challenge',top:'Top players',fav:'Favorites',recent:'Recently played',vote:'Request a game',cats:'Categories',cAll:'All',cPuzzle:'Puzzle',c3d:'3D',cDaily:'Daily',cFav:'Favs',studio:'Studio',ab:'About us',ct:'Contact',rq:'Request a game',legal:'Legal',pv:'Privacy',tm:'Terms',contactUs:'Contact us',copy:'© 2026 Zokro Studio'},
ar:{games:'الألعاب',all:'كل الألعاب',daily:'تحدي اليوم',top:'الأوائل',fav:'المفضلة',recent:'اتلعبت قريب',vote:'اطلب لعبة',cats:'التصنيفات',cAll:'الكل',cPuzzle:'ألغاز',c3d:'3D',cDaily:'يومي',cFav:'المفضلة',studio:'الاستوديو',ab:'من نحن',ct:'اتصل بنا',rq:'اطلب لعبة',legal:'قانوني',pv:'الخصوصية',tm:'الشروط',contactUs:'اتصل بنا',copy:'© 2026 استوديو زوكرو'}};
window.zkToggleSide=function(){
  if(window.innerWidth<1024){document.body.classList.toggle('sb-open');}
  else{var c=document.body.classList.toggle('sb-collapsed');try{localStorage.setItem('zk_sb_c',c?'1':'0');}catch(e){}}
};
function zkGoCat(i){
  var chips=document.querySelectorAll('.chips button');
  if(chips.length>i){chips[i].click();var g=document.getElementById('games');if(g)g.scrollIntoView();}
  else{try{localStorage.setItem('zk_goto_cat',String(i));}catch(e){}var lg=(document.documentElement.lang||'en').toLowerCase();location.href=zkHomeBase()+lg+'/#games';}
}
function zkSbLink(href,ic,lb){return '<a class="sb-link" href="'+href+'"><span class="sb-ic">'+ic+'</span><span class="sb-lb">'+lb+'</span></a>';}
function zkSbBtn(i,ic,lb){return '<button class="sb-link" data-sbcat="'+i+'"><span class="sb-ic">'+ic+'</span><span class="sb-lb">'+lb+'</span></button>';}
function buildSidebar(){
  if(document.getElementById('zkside')){
    var _hb=document.getElementById('zk-hamb');
    if(_hb)_hb.onclick=window.zkToggleSide;
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
  a.innerHTML='<div class="sb-scroll">'
    +'<div class="sb-sec">'
    +zkSbLink(home+'#games','🏠',S.all)
    +zkSbLink(G+'desert-daily.html','📅',S.daily)
    +zkSbLink(lb,'🏆',S.top)
    +zkSbBtn(4,'♥',S.fav)
    +zkSbLink(home+'#continue','↩',S.recent)
    +zkSbLink(rq,'🗳',S.vote)
    +'</div><div class="sb-div"></div>'
    +'<div class="sb-sec"><h4><span>'+S.cats+'</span></h4>'
    +zkSbBtn(0,'🌐',S.cAll)
    +zkSbBtn(1,'🧩',S.cPuzzle)
    +zkSbBtn(2,'🎮',S.c3d)
    +zkSbBtn(3,'📅',S.cDaily)
    +zkSbBtn(4,'♥',S.cFav)
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
    +'<div class="sb-links"><a href="'+ab+'">'+S.ab+'</a><a href="'+ct+'">'+S.ct+'</a><a href="'+rq+'">'+S.rq+'</a><a href="'+pv+'">'+S.pv+'</a><a href="'+tm+'">'+S.tm+'</a><a href="'+lb+'">'+S.top+'</a></div>'
    +'<div class="sb-soc"><a href="https://facebook.com/zokrofun" title="Facebook">📘</a><a href="https://tiktok.com/@zokro" title="TikTok">🎵</a><a href="https://youtube.com/@zokro" title="YouTube">▶️</a><a href="https://x.com/zokro" title="X">𝕏</a><a href="https://instagram.com/zokrofun" title="Instagram">📸</a><a href="https://discord.gg/ZUUeYucQFT" title="Discord">💬</a></div>'
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
      hb=document.createElement('button');hb.className='nicon hamb hbtn';hb.id='zk-hamb';hb.innerHTML='☰';hb.setAttribute('aria-label','menu');
      var hl=nav.querySelector('.hdr-left');
      if(hl&&hl.firstChild)hl.insertBefore(hb,hl.firstChild);else if(hl)hl.appendChild(hb);else nav.insertBefore(hb,nav.firstChild);
    }
  }
  if(hb)hb.onclick=window.zkToggleSide;
  try{if(localStorage.getItem('zk_sb_c')==='1'&&window.innerWidth>=1024)document.body.classList.add('sb-collapsed');}catch(e){}
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
  wrap.innerHTML='<button class="pill-btn" id="zk-friends-btn" title="'+t.fr+'">👥<span class="lbl">'+t.fr+'</span><span class="bdg" id="zk-fbdg" style="display:none">0</span></button>'
    +'<button class="nicon" id="zk-bell-btn" title="'+t.nt+'">🔔<span class="bdg" id="zk-nbdg" style="display:none">0</span></button>'
    +'<div class="npanel" id="zk-fpanel"><h3>👥 '+t.fr+'</h3><div id="zk-fbody"><div class="nempty">…</div></div></div>'
    +'<div class="npanel" id="zk-npanel"><h3>🔔 '+t.nt+'</h3><div id="zk-nbody"></div></div>';
  var cta=n.querySelector('button.cta');
  if(cta&&cta.parentNode)cta.parentNode.insertBefore(wrap,cta);
  else{var hr=n.querySelector('.hdr-right');if(hr)hr.appendChild(wrap);else n.appendChild(wrap);}
  document.getElementById('zk-friends-btn').onclick=function(){toggle('zk-fpanel');loadFriends();};
  document.getElementById('zk-bell-btn').onclick=function(){toggle('zk-npanel');renderNotifs(true);};
  (function(){
    var bell=document.getElementById('zk-bell-btn');if(!bell||document.getElementById('zk-bookmark-btn'))return;
    var bm=document.createElement('button');bm.className='pill-btn';bm.id='zk-bookmark-btn';bm.title=t.my||'My games';bm.setAttribute('aria-label','saved games');bm.innerHTML='💾<span class="lbl">'+(t.my||'My games')+'</span>';
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
  return;
  var f=document.querySelector('footer');
  if(!f)return;
  var holder=document.querySelector('#langmenu');
  var base=holder?holder.getAttribute('data-base'):'./';
  var cur=(document.documentElement.lang||'en').toLowerCase();
  var G=(cur==='en')?'games/':base+'en/games/';
  var T={
    en:{tag:'Independent games studio. New titles every week.',g:'Games',s:'Studio',l:'Legal',about:'About us',contact:'Contact',req:'Request a game',priv:'Privacy',terms:'Terms',news:'Get new games first:',ph:'your email',go:'Join',cr:'© 2026 Zokro Studio • zokro.fun • Made for players worldwide'},
    ar:{tag:'استوديو ألعاب مستقل. ألعاب جديدة كل أسبوع.',g:'الألعاب',s:'الاستوديو',l:'قانوني',about:'من نحن',contact:'اتصل بنا',req:'اطلب لعبة',priv:'الخصوصية',terms:'الشروط',news:'اعرف الألعاب الجديدة أول واحد:',ph:'إيميلك',go:'اشترك',cr:'© 2026 استوديو زوكرو • zokro.fun'},
  };
  var t=T[cur]||T.en;
  var ab=base+'en/about.html',ct=base+'en/contact.html',rq=base+'en/request.html',pv=base+'en/privacy.html',tm=base+'en/terms.html';
  f.innerHTML='<div class="f-top"></div><div class="f-in">'
    +'<div class="f-brand"><img src="'+base+'assets/logo.svg" alt="Zokro" style="height:44px"><p style="margin:12px 0">'+t.tag+'</p>'
    +'<div class="soc"><a class="sc-fb" href="https://facebook.com/zokrofun" title="Facebook"><svg viewBox="0 0 24 24" fill="#0866FF"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/></svg></a><a class="sc-tt" href="https://tiktok.com/@zokro" title="TikTok"><svg viewBox="0 0 24 24" fill="#fff"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg></a><a class="sc-yt" href="https://youtube.com/@zokro" title="YouTube"><svg viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a><a class="sc-x" href="https://x.com/zokro" title="X"><svg viewBox="0 0 24 24" fill="#fff"><path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"/></svg></a><a class="sc-ig" href="https://instagram.com/zokrofun" title="Instagram"><svg viewBox="0 0 24 24"><defs><linearGradient id="zokig" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#FFD600"/><stop offset=".5" stop-color="#FF0069"/><stop offset="1" stop-color="#8A3AB9"/></linearGradient></defs><rect x="2" y="2" width="20" height="20" rx="5.5" fill="url(#zokig)"/><circle cx="12" cy="12" r="4.6" fill="none" stroke="#fff" stroke-width="1.9"/><circle cx="17.3" cy="6.7" r="1.4" fill="#fff"/></svg></a><a class="sc-dc" href="https://discord.gg/ZUUeYucQFT" title="Discord"><svg viewBox="0 0 24 24" fill="#5865F2"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.319 13.58.099 18.058a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.873-1.295 1.226-1.994a.076.076 0 0 0-.042-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .078-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.363 1.225 1.993a.076.076 0 0 0 .084.029 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.029ZM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z"/></svg></a></div>'
    +'<div class="trust"><span>🔒 Safe</span><span>👨‍👩‍👧 Kid-friendly</span><span>📱 Mobile-ready</span></div></div>'
    +'<div><h4>'+t.s+'</h4><a href="'+ab+'">'+t.about+'</a><a href="'+ct+'">'+t.contact+'</a><a href="'+rq+'">'+t.req+'</a></div>'
    +'<div><h4>'+t.l+'</h4><a href="'+pv+'">'+t.priv+'</a><a href="'+tm+'">'+t.terms+'</a></div>'
    +'</div><div class="f-bar"><span class="f-cr">'+t.cr+'</span><button class="top_" onclick="window.scrollTo({top:0,behavior:\'smooth\'})">↑ Top</button></div>';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',buildFooter);
else buildFooter();
