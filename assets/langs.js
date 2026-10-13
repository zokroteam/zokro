// Shared language menu - one file feeds every page (real flag images work on Windows too)
(function(){
  var holder=document.querySelector('#langmenu');
  if(!holder)return;
  var LANGS=[
    {c:'en',f:'us',name:'English'},
    {c:'ar',f:'eg',name:'العربية'},
    {c:'de',f:'de',name:'DEUTSCH'},
    {c:'fr',f:'fr',name:'FRANÇAIS'},
    {c:'es',f:'es',name:'ESPAÑOL'},
    {c:'pt',f:'pt',name:'PORTUGUÊS'},
    {c:'tr',f:'tr',name:'TÜRK'},
    {c:'pl',f:'pl',name:'POLSKI'},
    {c:'cs',f:'cz',name:'ČESKY'},
    {c:'ru',f:'ru',name:'РУССКИЙ'},
    {c:'ja',f:'jp',name:'日本語'}
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
    var as=document.createElement('script');as.src=base+'assets/auth.js';document.head.appendChild(as);
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
// World-class footer everywhere from one place (runs after page loads)
function buildFooter(){
  var f=document.querySelector('footer');
  if(!f)return;
  var holder=document.querySelector('#langmenu');
  var base=holder?holder.getAttribute('data-base'):'./';
  var cur=(document.documentElement.lang||'en').toLowerCase();
  var G=(cur==='en')?'games/':base+'en/games/';
  var T={
    en:{tag:'Independent games studio. New titles every week.',g:'Games',s:'Studio',l:'Legal',about:'About us',contact:'Contact',req:'Request a game',priv:'Privacy',terms:'Terms',news:'Get new games first:',ph:'your email',go:'Join',cr:'© 2026 Zokro Studio • zokro.fun • Made for players worldwide'},
    ar:{tag:'استوديو ألعاب مستقل. ألعاب جديدة كل أسبوع.',g:'الألعاب',s:'الاستوديو',l:'قانوني',about:'من نحن',contact:'اتصل بنا',req:'اطلب لعبة',priv:'الخصوصية',terms:'الشروط',news:'اعرف الألعاب الجديدة أول واحد:',ph:'إيميلك',go:'اشترك',cr:'© 2026 استوديو زوكرو • zokro.fun'},
    de:{tag:'Unabhängiges Studio. Jede Woche neue Spiele.',g:'Spiele',s:'Studio',l:'Rechtliches',about:'Über uns',contact:'Kontakt',req:'Wunschspiel',priv:'Datenschutz',terms:'AGB',news:'Neue Spiele zuerst:',ph:'E-Mail',go:'OK',cr:'© 2026 Zokro Studio • zokro.fun'},
    fr:{tag:'Studio indépendant. Nouveaux jeux chaque semaine.',g:'Jeux',s:'Studio',l:'Légal',about:'À propos',contact:'Contact',req:'Demander',priv:'Confidentialité',terms:'CGU',news:'Nouveautés en premier :',ph:'email',go:'OK',cr:'© 2026 Studio Zokro • zokro.fun'},
    es:{tag:'Estudio independiente. Juegos nuevos cada semana.',g:'Juegos',s:'Estudio',l:'Legal',about:'Nosotros',contact:'Contacto',req:'Pedir',priv:'Privacidad',terms:'Términos',news:'Novedades primero:',ph:'email',go:'OK',cr:'© 2026 Zokro • zokro.fun'},
    pt:{tag:'Estúdio independente. Jogos novos toda semana.',g:'Jogos',s:'Estúdio',l:'Legal',about:'Sobre',contact:'Contato',req:'Pedir',priv:'Privacidade',terms:'Termos',news:'Novidades primeiro:',ph:'email',go:'OK',cr:'© 2026 Zokro • zokro.fun'},
    tr:{tag:'Bağımsız stüdyo. Her hafta yeni oyunlar.',g:'Oyunlar',s:'Stüdyo',l:'Yasal',about:'Hakkında',contact:'İletişim',req:'İste',priv:'Gizlilik',terms:'Koşullar',news:'Önce sen öğren:',ph:'e-posta',go:'OK',cr:'© 2026 Zokro • zokro.fun'},
    pl:{tag:'Niezależne studio. Nowe gry co tydzień.',g:'Gry',s:'Studio',l:'Prawne',about:'O nas',contact:'Kontakt',req:'Poproś',priv:'Prywatność',terms:'Regulamin',news:'Nowości najpierw:',ph:'email',go:'OK',cr:'© 2026 Zokro • zokro.fun'},
    cs:{tag:'Nezávislé studio. Nové hry každý týden.',g:'Hry',s:'Studio',l:'Právní',about:'O nás',contact:'Kontakt',req:'Přát',priv:'Soukromí',terms:'Podmínky',news:'Novinky jako první:',ph:'email',go:'OK',cr:'© 2026 Zokro • zokro.fun'},
    ru:{tag:'Независимая студия. Новые игры каждую неделю.',g:'Игры',s:'Студия',l:'Право',about:'О нас',contact:'Контакты',req:'Заказ',priv:'Конфиденциальность',terms:'Условия',news:'Новинки первым:',ph:'email',go:'OK',cr:'© 2026 Zokro • zokro.fun'},
    ja:{tag:'独立系スタジオ。毎週新作。',g:'ゲーム',s:'スタジオ',l:'法務',about:'会社概要',contact:'お問い合わせ',req:'リクエスト',priv:'プライバシー',terms:'利用規約',news:'新作を先取り:',ph:'メール',go:'OK',cr:'© 2026 Zokro • zokro.fun'}
  };
  var t=T[cur]||T.en;
  var ab=base+'en/about.html',ct=base+'en/contact.html',rq=base+'en/request.html',pv=base+'en/privacy.html',tm=base+'en/terms.html';
  f.innerHTML='<div class="f-top"></div><div class="f-in">'
    +'<div class="f-brand"><img src="'+base+'assets/logo.svg" alt="Zokro" style="height:44px"><p style="margin:12px 0">'+t.tag+'</p>'
    +'<div class="soc"><a class="sc-tt" href="https://tiktok.com/@zokro" title="TikTok">🎵</a><a class="sc-yt" href="https://youtube.com/@zokro" title="YouTube">▶️</a><a class="sc-x" href="https://x.com/zokro" title="X">✖️</a><a class="sc-ig" href="https://instagram.com/zokro" title="Instagram">📸</a><a class="sc-dc" href="https://discord.gg/zokro" title="Discord">💬</a></div>'
    +'<div class="trust"><span>🔒 Safe</span><span>👨‍👩‍👧 Kid-friendly</span><span>📱 Mobile-ready</span></div></div>'
    +'<div><h4>'+t.g+'</h4><a href="'+G+'desert-daily.html">💧 Desert Daily</a><a href="'+G+'stack-dune.html">🧱 Stack the Dune 3D</a><a href="'+G+'guess-oasis.html">🌴 Guess the Oasis</a></div>'
    +'<div><h4>'+t.s+'</h4><a href="'+ab+'">'+t.about+'</a><a href="'+ct+'">'+t.contact+'</a><a href="'+rq+'">'+t.req+'</a></div>'
    +'<div><h4>'+t.l+'</h4><a href="'+pv+'">'+t.priv+'</a><a href="'+tm+'">'+t.terms+'</a><div class="nlbox"><p>'+t.news+'</p><div class="nl"><input id="nl-in" placeholder="'+t.ph+'"><button onclick="nlGo()">'+t.go+'</button></div><p id="nl-msg"></p></div></div>'
    +'</div><div class="f-bar"><span class="f-cr">'+t.cr+'</span><button class="top_" onclick="window.scrollTo({top:0,behavior:\'smooth\'})">↑ Top</button></div>';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',buildFooter);
else buildFooter();
function nlGo(){var v=(document.getElementById('nl-in')||{}).value||'';if(v.indexOf('@')>0){try{localStorage.setItem('zk_nl',v);}catch(e){}document.getElementById('nl-msg').textContent='✅ Welcome aboard!';}else{document.getElementById('nl-msg').textContent='✉️ Email?';}}
