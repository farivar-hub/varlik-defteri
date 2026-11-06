const C='vd-v5';
const FILES=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(FILES.map(f=>fetch(f,{cache:'reload'}).then(r=>{if(!r.ok)throw 0;return c.put(f,r);})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.origin!==location.origin)return;
  e.respondWith(caches.open(C).then(c=>c.match(e.request).then(hit=>{
    const net=fetch(e.request,{cache:'no-cache'}).then(r=>{if(r&&r.ok)c.put(e.request,r.clone());return r;}).catch(()=>hit);
    return hit||net;
  })));
});
