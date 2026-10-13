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
    +'<div class="soc"><a class="sc-fb" href="https://facebook.com/zokrofun" title="Facebook"><svg viewBox="0 0 24 24" fill="#0866FF"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/></svg></a><a class="sc-tt" href="https://tiktok.com/@zokro" title="TikTok"><svg viewBox="0 0 24 24" fill="#fff"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg></a><a class="sc-yt" href="https://youtube.com/@zokro" title="YouTube"><svg viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a><a class="sc-x" href="https://x.com/zokro" title="X"><svg viewBox="0 0 24 24" fill="#fff"><path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"/></svg></a><a class="sc-ig" href="https://instagram.com/zokro" title="Instagram"><svg viewBox="0 0 24 24"><defs><linearGradient id="zokig" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#FFD600"/><stop offset=".5" stop-color="#FF0069"/><stop offset="1" stop-color="#8A3AB9"/></linearGradient></defs><rect x="2" y="2" width="20" height="20" rx="5.5" fill="url(#zokig)"/><circle cx="12" cy="12" r="4.6" fill="none" stroke="#fff" stroke-width="1.9"/><circle cx="17.3" cy="6.7" r="1.4" fill="#fff"/></svg></a><a class="sc-dc" href="https://discord.gg/ZUUeYucQFT" title="Discord"><svg viewBox="0 0 24 24" fill="#5865F2"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.319 13.58.099 18.058a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.873-1.295 1.226-1.994a.076.076 0 0 0-.042-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .078-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.363 1.225 1.993a.076.076 0 0 0 .084.029 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.029ZM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z"/></svg></a></div>'
    +'<div class="trust"><span>🔒 Safe</span><span>👨‍👩‍👧 Kid-friendly</span><span>📱 Mobile-ready</span></div></div>'
    +'<div><h4>'+t.g+'</h4><a href="'+G+'desert-daily.html">💧 Desert Daily</a><a href="'+G+'stack-dune.html">🧱 Stack the Dune 3D</a><a href="'+G+'guess-oasis.html">🌴 Guess the Oasis</a></div>'
    +'<div><h4>'+t.s+'</h4><a href="'+ab+'">'+t.about+'</a><a href="'+ct+'">'+t.contact+'</a><a href="'+rq+'">'+t.req+'</a></div>'
    +'<div><h4>'+t.l+'</h4><a href="'+pv+'">'+t.priv+'</a><a href="'+tm+'">'+t.terms+'</a></div>'
    +'</div><div class="f-bar"><span class="f-cr">'+t.cr+'</span><button class="top_" onclick="window.scrollTo({top:0,behavior:\'smooth\'})">↑ Top</button></div>';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',buildFooter);
else buildFooter();
