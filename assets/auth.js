/* Zokro accounts (Supabase Auth: Google + Discord + Email/Password). */
var ZOKRO_CFG = { url: 'https://gtzjrhqtoafjmdjobptv.supabase.co', anon: 'sb_publishable_3ZhtfEA2Q1qLgumU3HXvqg_BwdUzo5J' };
(function(){
  if(ZOKRO_CFG.url.indexOf('PASTE')===0){ window.zkAuth={ready:false}; return; }
  var s=document.createElement('script');
  s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  s.onload=init;
  document.head.appendChild(s);
  function init(){
    var sb=window.supabase.createClient(ZOKRO_CFG.url,ZOKRO_CFG.anon);
    window.zkAuth={ready:true,client:sb,user:null};
    sb.auth.getSession().then(function(r){setUser(r.data.session&&r.data.session.user||null);});
    sb.auth.onAuthStateChange(function(ev,sess){setUser(sess&&sess.user||null);});
    function escHtml(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
    function metaName(u){
      var m=(u&&u.user_metadata)||{};
      var n=m.full_name||m.name||m.user_name||m.preferred_username||m.global_name||'';
      if(!n&&u.email)n=u.email.split('@')[0];
      return String(n||'Player').slice(0,20);
    }
    function metaAvatar(u){
      var m=(u&&u.user_metadata)||{};
      return m.avatar_url||m.picture||'🎮';
    }
    function zkAvImg(av,nm){
      if(av&&/^data:image|^https?:\/\//i.test(av))return '<img src="'+escHtml(av)+'" alt="" style="width:22px;height:22px;border-radius:50%;object-fit:cover;vertical-align:middle;margin-inline-end:6px">';
      if(av&&av!=='🎮')return escHtml(av)+' ';
      var ch=(((nm||'P').trim().charAt(0))||'P').toUpperCase();
      return '<span class="zk-avinit">'+escHtml(ch)+'</span>';
    }
    function setUser(u){
      window.zkAuth.user=u;
      var lang=(document.documentElement.lang||'en').toLowerCase();
      var loginText={ar:'دخول',de:'Log In',fr:'Se connecter',es:'Entrar',pt:'Entrar',tr:'Giriş Yap',pl:'Zaloguj',cs:'Přihlásit se',ru:'Войти',ja:'ログイン',en:'Log In'}[lang]||'Log In';
      // Gold nav button (Play) becomes Login - playing stays free without account
      document.querySelectorAll('button.login,nav button.cta,[data-auth]').forEach(function(el){
        if(u){
          var nm=metaName(u).split(' ')[0];
          el.innerHTML=zkAvImg(metaAvatar(u),nm)+escHtml(nm);
          el.onclick=function(){location.href=basePath()+'en/profile.html';};
          sb.from('profiles').select('avatar').eq('id',u.id).single().then(function(r){
            var av=r.data&&r.data.avatar;
            if(av&&av!==metaAvatar(u))el.innerHTML=zkAvImg(av,nm)+escHtml(nm);
          });
        }
        else{el.textContent=el.getAttribute('data-login-text')||loginText;el.onclick=openAuth;}
      });
      if(u)ensureProfile(u);
    }
    function basePath(){
      var p=location.pathname;
      var i=p.indexOf('/en/');if(i>=0)return p.slice(0,i+1);
      i=p.indexOf('/ar/');if(i>=0)return p.slice(0,i+1);
      return './';
    }
    function ensureProfile(u){
      sb.from('profiles').select('id').eq('id',u.id).single().then(function(r){
        if(r.error){
          sb.from('profiles').insert({id:u.id,username:metaName(u),avatar:metaAvatar(u)}).then(function(){});
        }
      });
    }
    window.zkOpenAuth=openAuth;
    var PROVIDERS=[
      {id:'google',label:'Google',svg:'<svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.1h6.5c-.1 1.1-.8 2.7-2.4 3.8l-.1.1 3.5 2.7.2.1c2.2-2 3.8-5 3.8-8.6z"/><path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.8-2.9c-1 .7-2.4 1.2-4.1 1.2-3.1 0-5.8-2.1-6.8-5l-.1.1-3.7 2.9v.1C3.4 21.5 7.4 24 12 24z"/><path fill="#FBBC05" d="M5.2 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.7.4-2.4l-.1-.1-3.6-2.8H1.4C.5 8.4 0 10.1 0 12s.5 3.6 1.4 5.3l3.8-2.9z"/><path fill="#EA4335" d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.4 0 3.4 2.5 1.4 6.7l3.7 2.9c1-2.9 3.7-4.9 6.9-4.9z"/></svg>'},
      {id:'discord',label:'Discord',svg:'<svg width="22" height="22" viewBox="0 0 24 24"><path fill="#5865F2" d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3c-.2.4-.5.9-.6 1.3a18.3 18.3 0 0 0-5.5 0C9.1 3.9 8.8 3.4 8.6 3a19.7 19.7 0 0 0-4.9 1.5C.6 9.1-.3 13.6.1 18.1c2 1.5 4 2.4 5.9 3 .5-.6.9-1.3 1.2-2-.7-.2-1.3-.6-1.9-1l.4-.3c2.4 1.1 5 1.1 7.4 0l.4.3c-.6.4-1.2.8-1.9 1 .4.7.8 1.4 1.2 2 1.9-.6 3.9-1.5 5.9-3 .5-5.2-.7-9.7-3.4-13.7zM8.7 15.3c-1.2 0-2.1-1-2.1-2.3s.9-2.3 2.1-2.3 2.2 1 2.1 2.3c0 1.3-.9 2.3-2.1 2.3zm6.6 0c-1.2 0-2.1-1-2.1-2.3s.9-2.3 2.1-2.3 2.2 1 2.1 2.3c0 1.3-.9 2.3-2.1 2.3z"/></svg>'}
    ];
    function openAuth(){
      if(document.getElementById('zk-modal')){document.getElementById('zk-modal').style.display='flex';return;}
      var d=document.createElement('div');d.id='zk-modal';
      var pv=PROVIDERS.map(function(p){return '<button class="pv" data-pv="'+p.id+'">'+p.svg+'<span>'+p.label+'</span></button>';}).join('');
      var logoSrc=(function(){try{var s=document.querySelector('script[src*="auth.js"]').src;return s.replace(/assets\/auth\.js.*$/,'assets/logo.svg');}catch(e){return 'assets/logo.svg';}})();
      d.innerHTML='<div class="zk-box"><img class="zk-logo" src="'+logoSrc+'" alt="Zokro">'
        +'<h3>Welcome to Zokro</h3><p class="zk-sub">Play everywhere. Scores, streaks & rank follow you.</p>'
        +'<div class="zk-pv">'+pv+'</div>'
        +'<div class="zk-tabs"><button id="zk-t-in" class="on">Log In</button><button id="zk-t-up">Sign Up</button></div>'
        +'<div id="zk-up-fields" style="display:none"><input id="zk-u" placeholder="Username (for signup)"></div>'
        +'<input id="zk-e" type="email" placeholder="Email" autocomplete="email">'
        +'<div class="zk-pw"><input id="zk-p" type="password" placeholder="Password (6+ chars)" autocomplete="current-password"><button id="zk-show" type="button">Show</button></div>'
        +'<button id="zk-go">Log In</button>'
        +'<p id="zk-msg"></p><button id="zk-x">Close</button></div>';
      document.body.appendChild(d);
      d.addEventListener('click',function(e){if(e.target===d)d.style.display='none';});
      document.addEventListener('keydown',function(e){if(e.key==='Escape'){var m=document.getElementById('zk-modal');if(m)m.style.display='none';}});
      document.getElementById('zk-show').onclick=function(){var p=document.getElementById('zk-p');var show=p.type==='password';p.type=show?'text':'password';this.textContent=show?'Hide':'Show';};
      var btns=d.querySelectorAll('[data-pv]');
      for(var i=0;i<btns.length;i++)(function(b){
        b.onclick=function(){
          msg('⏳ Opening '+b.getAttribute('data-pv')+'...');
          sb.auth.signInWithOAuth({provider:b.getAttribute('data-pv'),options:{redirectTo:location.href}}).then(function(r){
            if(r.error)msg('⚠️ '+b.textContent.trim()+' is not enabled yet — try Email below.');
          });
        };
      })(btns[i]);
      var mode='in';
      function setMode(m){
        mode=m;
        document.getElementById('zk-t-in').className=m==='in'?'on':'';
        document.getElementById('zk-t-up').className=m==='up'?'on':'';
        document.getElementById('zk-up-fields').style.display=m==='up'?'':'none';
        document.getElementById('zk-go').textContent=m==='up'?'Create account':'Log In';
      }
      document.getElementById('zk-t-in').onclick=function(){setMode('in');};
      document.getElementById('zk-t-up').onclick=function(){setMode('up');};
      document.getElementById('zk-x').onclick=function(){d.style.display='none';};
      function msg(t){document.getElementById('zk-msg').textContent=t;}
      var goBtn=document.getElementById('zk-go');
      function busy(b){goBtn.disabled=b;goBtn.textContent=b?'⏳ ...':(mode==='up'?'Create account':'Log In');}
      goBtn.onclick=function(){
        var em=document.getElementById('zk-e').value.trim();
        var pw=document.getElementById('zk-p').value;
        if(!/^\S+@\S+\.\S+$/.test(em)){msg('✉️ Enter a valid email');return;}
        if(pw.length<6){msg('🔑 Password needs 6+ characters');return;}
        busy(true);
        if(mode==='up'){
          var un=(document.getElementById('zk-u').value.trim()||em.split('@')[0]).slice(0,20);
          sb.auth.signUp({email:em,password:pw,options:{data:{name:un},emailRedirectTo:location.href}}).then(function(r){
            busy(false);
            if(r.error){msg('❌ '+r.error.message);return;}
            msg(r.session?'✅ Account created — welcome!':'✅ Check your email to confirm, then log in!');
          });
        }else{
          sb.auth.signInWithPassword({email:em,password:pw}).then(function(r){
            busy(false);
            if(r.error){msg('❌ '+r.error.message);return;}
            d.style.display='none';
          });
        }
      };
    }
    // save score helper for games
    window.zkSaveScore=function(game,score){
      var u=window.zkAuth.user;if(!u||!sb)return;
      sb.from('scores').insert({user_id:u.id,game:game,score:score}).then(function(){});
    };
  }
})();
