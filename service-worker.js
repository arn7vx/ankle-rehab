const CACHE='ankle-rehab-v2-flat';
const ASSETS=['./','./index.html','./app.css','./app.js','./database.js','./rehab-plan.js','./charts.js','./reports.js','./manifest.json','./icon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if (url.hostname==='raw.githubusercontent.com' || url.hostname==='api.github.com') return;
  if (event.request.method!=='GET') return;
  event.respondWith(fetch(event.request).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));return resp;}).catch(()=>caches.match(event.request)));
});
