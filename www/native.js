// Cầu nối lưu/chia sẻ file Excel trong ứng dụng Android (Capacitor)
(function(){
  function b64(buf){var u=buf instanceof ArrayBuffer?new Uint8Array(buf):buf,s='';
    for(var i=0;i<u.length;i+=8192)s+=String.fromCharCode.apply(null,u.subarray(i,i+8192));return btoa(s)}
  if(!window.Capacitor||!Capacitor.isNativePlatform||!Capacitor.isNativePlatform())return;
  window.nativeDL={async save(o){
    var P=Capacitor.Plugins,r=await P.Filesystem.writeFile({path:o.filename,data:b64(o.data),directory:'CACHE'});
    await P.Share.share({title:o.filename,dialogTitle:'Lưu hoặc gửi file Excel',url:r.uri});
  }};
})();
