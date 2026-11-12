// Native file sharing + optional real-time Firebase sync.
(function(){
  function b64(buf){var u=buf instanceof ArrayBuffer?new Uint8Array(buf):buf,s='';
    for(var i=0;i<u.length;i+=8192)s+=String.fromCharCode.apply(null,u.subarray(i,i+8192));return btoa(s)}
  if(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform()){
    window.nativeDL={async save(o){
      var P=Capacitor.Plugins,r=await P.Filesystem.writeFile({path:o.filename,data:b64(o.data),directory:'CACHE'});
      await P.Share.share({title:o.filename,dialogTitle:'Lưu hoặc gửi file Excel',url:r.uri});
    }};
  }
  var app=null,auth=null,db=null,unsub=null,ready=false,pushing=false,timer=null,ignoreRemote=false;
  function loadScript(src){return new Promise(function(resolve,reject){var s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)})}
  async function sdk(){
    if(window.firebase&&firebase.firestore)return;
    await loadScript('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
    await loadScript('https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js');
    await loadScript('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js');
  }
  function cfg(){try{return JSON.parse(localStorage.getItem('anh_huy_firebase_config')||'{}')}catch(e){return {}}}
  async function connect(configuration,email,password){
    await sdk();
    if(app){try{await auth.signOut()}catch(e){};try{app.delete()}catch(e){}}
    app=firebase.initializeApp(configuration,'anh-huy-'+Date.now());auth=app.auth();db=app.firestore();
    await auth.signInWithEmailAndPassword(email,password);
    ready=true;
    if(unsub)unsub();
    unsub=db.doc('sharedData/current').onSnapshot(function(s){
      if(!s.exists||pushing||ignoreRemote)return;
      var d=s.data();if(!d||!d.payload)return;
      try{
        var remote=JSON.parse(d.payload);
        if(window.applyRemoteState)window.applyRemoteState(remote,d.updatedAt&&d.updatedAt.toMillis?d.updatedAt.toMillis():Date.now());
      }catch(e){console.warn('Sync data invalid',e)}
    },function(e){console.error('Firestore listener',e);window.dispatchEvent(new CustomEvent('sync-status',{detail:'Realtime listener error: '+e.message}))});
    window.dispatchEvent(new CustomEvent('sync-status',{detail:'Đã kết nối đồng bộ thời gian thực'}));
    return true;
  }
  async function push(state){
    if(!ready||!db)return false;
    var payload=JSON.stringify(state);
    if(payload.length>850000)throw new Error('Dữ liệu vượt giới hạn an toàn của một bản đồng bộ. Hãy xuất Excel sao lưu.');
    pushing=true;ignoreRemote=true;
    try{await db.doc('sharedData/current').set({payload:payload,updatedAt:firebase.firestore.FieldValue.serverTimestamp()});}
    finally{setTimeout(function(){pushing=false;ignoreRemote=false},700)}
    return true;
  }
  window.anhHuySync={
    connect:connect,push:push,isReady:function(){return ready},
    config:cfg,saveConfig:function(c){localStorage.setItem('anh_huy_firebase_config',JSON.stringify(c))},
    disconnect:async function(){if(unsub)unsub();if(auth)await auth.signOut();ready=false;db=null;},
    pull:async function(){if(!ready||!db)throw new Error('Chưa đăng nhập');var s=await db.doc('sharedData/current').get();if(!s.exists)return null;return JSON.parse(s.data().payload)}
  };
})();
