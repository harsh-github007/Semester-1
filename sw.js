// Versioned app shell. Keep private course files out of shared/offline caches.
const CACHE='sketchbook-v10';
const CORE=['./','index.html','derivatives.html','valuation.html','risk-management.html','bloomberg.html','all.html','library.html','practice.html','derivatives-practice.html','syllabus.html','bloomberg-practice.html','assets/base.css','assets/study.css','assets/config.js','assets/common.js','assets/lessons.js','assets/beginner.js','assets/study.js','assets/labs.js','assets/home.js','assets/library.js','assets/practice-data.js','assets/derivatives-practice-data.js','assets/practice.js','assets/bmc-quiz-data.js','assets/quiz.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE.map(path=>new Request(path,{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(key=>key.startsWith('sketchbook-')&&key!==CACHE).map(key=>caches.delete(key)));await self.clients.claim();})()));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||url.pathname.includes('/private-materials/'))return;
 // Only cache this app's known shell. Do not turn missing scripts/PDFs into HTML.
 const isCore=CORE.some(path=>new URL(path,self.registration.scope).pathname===url.pathname);
 if(!isCore)return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const cached=await cache.match(event.request,{ignoreSearch:true});
  // One installed version serves a consistent shell, including all script dependencies.
  if(cached)return cached;
  try{return await fetch(event.request);}catch{return new Response('This resource is not available offline.',{status:503,headers:{'Content-Type':'text/plain'}});}
 })());
});
