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
      {id:'google',icon:'🔵',label:'Google',cls:'pv-g'},
      {id:'facebook',icon:'📘',label:'Facebook',cls:'pv-f'},
      {id:'discord',icon:'🎮',label:'Discord',cls:'pv-d'},
      {id:'apple',icon:'🍎',label:'Apple',cls:'pv-a'}
    ];
    function openAuth(){
      if(document.getElementById('zk-modal')){document.getElementById('zk-modal').style.display='flex';return;}
      var d=document.createElement('div');d.id='zk-modal';
      var pv=PROVIDERS.map(function(p){return '<button class="pv '+p.cls+'" data-pv="'+p.id+'"><span>'+p.icon+'</span>'+p.label+'</button>';}).join('');
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
