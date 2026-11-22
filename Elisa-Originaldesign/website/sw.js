const CACHE='elisa-app-v4';
const FILES=['index.html','style.css?v=4','app.js?v=4','manifest.webmanifest','icon-192.png','icon-512.png','sound.js','seit-diesem-tag.mp3','klick.wav'];
self.addEventListener('install',e=>{
 e.waitUntil(caches.open(CACHE).then(c=>Promise.allSettled(FILES.map(f=>c.add(new Request(f,{cache:'reload'}))))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
 e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE&&k.startsWith('elisa-app-')).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
 const req=e.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin||req.headers.has('Range'))return;
 // Request the current encrypted album first; offline fallback uses only this new cache.
 const isAlbum=url.pathname.endsWith('/album.enc');
 e.respondWith((async()=>{
  try{const r=await fetch(req,{cache:isAlbum?'no-store':'no-cache'});if(r.status===200){try{const cache=await caches.open(CACHE);await cache.put(req,r.clone())}catch{}}return r}
  catch{const cache=await caches.open(CACHE);return (await cache.match(req))||(req.mode==='navigate'&&await cache.match('index.html'))||Response.error()}
 })());
});
