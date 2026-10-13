/* Zokro accounts (Supabase Auth: Google + magic link). Paste keys in ZOKRO_CFG below. */
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
    function setUser(u){
      window.zkAuth.user=u;
      var lang=(document.documentElement.lang||'en').toLowerCase();
      var loginText={ar:'دخول',de:'Log In',fr:'Se connecter',es:'Entrar',pt:'Entrar',tr:'Giriş Yap',pl:'Zaloguj',cs:'Přihlásit se',ru:'Войти',ja:'ログイン',en:'Log In'}[lang]||'Log In';
      // Gold nav button (Play) becomes Login - playing stays free without account
      document.querySelectorAll('button.login,nav button.cta,[data-auth]').forEach(function(el){
        if(u){el.innerHTML='👤 '+(u.user_metadata&&u.user_metadata.name?u.user_metadata.name.split(' ')[0]:'Player');el.onclick=function(){location.href=basePath()+'en/profile.html';};}
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
          var name=(u.user_metadata&&u.user_metadata.name)||'Player';
          sb.from('profiles').insert({id:u.id,username:name,avatar:'🎮'}).then(function(){});
        }
      });
    }
    window.zkOpenAuth=openAuth;
    var PROVIDERS=[
      {id:'google',label:'Google',svg:'<svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.1h6.5c-.1 1.1-.8 2.7-2.4 3.8l-.1.1 3.5 2.7.2.1c2.2-2 3.8-5 3.8-8.6z"/><path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.8-2.9c-1 .7-2.4 1.2-4.1 1.2-3.1 0-5.8-2.1-6.8-5l-.1.1-3.7 2.9v.1C3.4 21.5 7.4 24 12 24z"/><path fill="#FBBC05" d="M5.2 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.7.4-2.4l-.1-.1-3.6-2.8H1.4C.5 8.4 0 10.1 0 12s.5 3.6 1.4 5.3l3.8-2.9z"/><path fill="#EA4335" d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.4 0 3.4 2.5 1.4 6.7l3.7 2.9c1-2.9 3.7-4.9 6.9-4.9z"/></svg>'},
      {id:'facebook',label:'Facebook',svg:'<svg width="20" height="20" viewBox="0 0 24 24"><path fill="#1877F2" d="M24 12a12 12 0 1 0-13.9 11.9v-8.4h-3v-3.5h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 1-2 1.9V12h3.3l-.5 3.5h-2.8v8.4A12 12 0 0 0 24 12z"/></svg>'},
      {id:'discord',label:'Discord',svg:'<svg width="22" height="22" viewBox="0 0 24 24"><path fill="#5865F2" d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3c-.2.4-.5.9-.6 1.3a18.3 18.3 0 0 0-5.5 0C9.1 3.9 8.8 3.4 8.6 3a19.7 19.7 0 0 0-4.9 1.5C.6 9.1-.3 13.6.1 18.1c2 1.5 4 2.4 5.9 3 .5-.6.9-1.3 1.2-2-.7-.2-1.3-.6-1.9-1l.4-.3c2.4 1.1 5 1.1 7.4 0l.4.3c-.6.4-1.2.8-1.9 1 .4.7.8 1.4 1.2 2 1.9-.6 3.9-1.5 5.9-3 .5-5.2-.7-9.7-3.4-13.7zM8.7 15.3c-1.2 0-2.1-1-2.1-2.3s.9-2.3 2.1-2.3 2.2 1 2.1 2.3c0 1.3-.9 2.3-2.1 2.3zm6.6 0c-1.2 0-2.1-1-2.1-2.3s.9-2.3 2.1-2.3 2.2 1 2.1 2.3c0 1.3-.9 2.3-2.1 2.3z"/></svg>'}
    ];
    function openAuth(){
      if(document.getElementById('zk-modal')){document.getElementById('zk-modal').style.display='flex';return;}
      var d=document.createElement('div');d.id='zk-modal';
      var pv=PROVIDERS.map(function(p){return '<button class="pv" data-pv="'+p.id+'">'+p.svg+'<span>'+p.label+'</span></button>';}).join('');
      d.innerHTML='<div class="zk-box"><div class="zk-hero">🔥</div><h3>Join Zokro</h3><p class="zk-sub">One account for scores, streaks & leaderboard.</p>'
        +'<div class="zk-pv">'+pv+'</div>'
        +'<div class="zk-tabs"><button id="zk-t-in" class="on">Log In</button><button id="zk-t-up">Sign Up</button></div>'
        +'<div id="zk-up-fields" style="display:none"><input id="zk-u" placeholder="Username (for signup)"></div>'
        +'<input id="zk-e" type="email" placeholder="Email">'
        +'<input id="zk-p" type="password" placeholder="Password (6+ chars)">'
        +'<button id="zk-go">Log In</button>'
        +'<div class="zk-or">— or —</div>'
        +'<button id="zk-m">✉️ Email me a login link</button>'
        +'<p id="zk-msg"></p><button id="zk-x">Close</button></div>';
      document.body.appendChild(d);
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
      document.getElementById('zk-go').onclick=function(){
        var em=document.getElementById('zk-e').value.trim();
        var pw=document.getElementById('zk-p').value;
        if(!em||pw.length<6){msg('✉️ Email + password 6+ chars');return;}
        msg('⏳ ...');
        if(mode==='up'){
          var un=(document.getElementById('zk-u').value.trim()||em.split('@')[0]).slice(0,20);
          sb.auth.signUp({email:em,password:pw,options:{data:{name:un},emailRedirectTo:location.href}}).then(function(r){
            if(r.error){msg('❌ '+r.error.message);return;}
            msg(r.session?'✅ Account created!':'✅ Check your email to confirm, then log in!');
          });
        }else{
          sb.auth.signInWithPassword({email:em,password:pw}).then(function(r){
            msg(r.error?'❌ '+r.error.message:'');
            if(!r.error)d.style.display='none';
          });
        }
      };
      document.getElementById('zk-m').onclick=function(){
        var em=document.getElementById('zk-e').value.trim();
        if(!em){msg('✉️ Type your email first');return;}
        sb.auth.signInWithOtp({email:em,options:{emailRedirectTo:location.href}}).then(function(r){
          msg(r.error?'❌ '+r.error.message:'✅ Check your email!');
        });
      };
    }
    // save score helper for games
    window.zkSaveScore=function(game,score){
      var u=window.zkAuth.user;if(!u||!sb)return;
      sb.from('scores').insert({user_id:u.id,game:game,score:score}).then(function(){});
    };
  }
})();
