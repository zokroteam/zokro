/* Zokro accounts (Supabase Auth: Google + magic link). Paste keys in ZOKRO_CFG below. */
var ZOKRO_CFG = { url: 'PASTE_SUPABASE_URL', anon: 'PASTE_SUPABASE_ANON_KEY' };
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
      document.querySelectorAll('button.login,[data-auth]').forEach(function(el){
        if(u){el.innerHTML='👤 '+(u.user_metadata&&u.user_metadata.name?u.user_metadata.name.split(' ')[0]:'Player');el.onclick=function(){location.href=basePath()+'en/profile.html';};}
        else{el.textContent=el.getAttribute('data-login-text')||'Log In';el.onclick=openAuth;}
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
    function openAuth(){
      if(document.getElementById('zk-modal')){document.getElementById('zk-modal').style.display='flex';return;}
      var d=document.createElement('div');d.id='zk-modal';
      d.innerHTML='<div class="zk-box"><h3>🔥 Join Zokro</h3><p>Save scores, streaks & profile across devices.</p>'
        +'<button id="zk-g">🔵 Continue with Google</button>'
        +'<div class="zk-or">— or —</div>'
        +'<input id="zk-e" type="email" placeholder="Email for magic link"><button id="zk-m">✉️ Send login link</button>'
        +'<p id="zk-msg"></p><button id="zk-x">Close</button></div>';
      document.body.appendChild(d);
      document.getElementById('zk-x').onclick=function(){d.style.display='none';};
      document.getElementById('zk-g').onclick=function(){
        sb.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.href}});
      };
      document.getElementById('zk-m').onclick=function(){
        var em=document.getElementById('zk-e').value;
        sb.auth.signInWithOtp({email:em,options:{emailRedirectTo:location.href}}).then(function(r){
          document.getElementById('zk-msg').textContent=r.error?r.error.message:'✅ Check your email!';
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
