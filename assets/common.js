'use strict';
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const Store = {
 read(key, fallback) { try { const value=JSON.parse(localStorage.getItem(key)); return value ?? fallback; } catch { return fallback; } },
 write(key,value) { try { localStorage.setItem(key,JSON.stringify(value)); return true; } catch { document.querySelector('#save-status')?.replaceChildren(document.createTextNode('This browser could not save your changes. Export a backup before closing.')); return false; } },
 object(key) { const v=this.read(key,{}); return v && typeof v==='object' && !Array.isArray(v) ? v : {}; },
 progress() {
  if (!this.read('fsb-migrated-v2',false)) {
   const result=this.object('fsb-progress-v2');
   Object.entries(CONFIGS).forEach(([page,cfg])=>{
    const old=this.object('fsb-done-'+({'risk-management':'risk'}[page]||page));
    const ids=cfg.SUBJECTS.flatMap(s=>s[1]);
    ids.forEach((id,i)=>{if(old[i]===true && !(id in result))result[id]=true;});
   });
   if(this.write('fsb-progress-v2',result))this.write('fsb-migrated-v2',true);
  }
  return this.object('fsb-progress-v2');
 }
};
function lessonLink(id) {
 const cfg=CONFIGS.all.SUBJECTS.flatMap(([name,ids])=>ids.map((n,i)=>({n,i,name}))).find(c=>c.n===id);
 const page=Object.keys(CONFIGS).find(p=>CONFIGS[p].ONLY===cfg.name);
 return page+'.html#class-'+(CONFIGS[page].SUBJECTS[0][1].indexOf(id)+1);
}
function setupCommon(){
 document.querySelectorAll('label[role="button"][for]').forEach(label=>label.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();document.getElementById(label.htmlFor)?.click();}}));
 const theme=Store.read('fsb-theme','system');
 if(['light','dark'].includes(theme))document.documentElement.dataset.theme=theme;
 const themeControl=document.querySelector('#theme');
 if(themeControl){themeControl.value=theme;themeControl.onchange=()=>{const value=themeControl.value; if(value==='system')delete document.documentElement.dataset.theme;else document.documentElement.dataset.theme=value;Store.write('fsb-theme',value);};}
 const connection=document.querySelector('#connection');
 const updateConnection=()=>{if(connection)connection.textContent=navigator.onLine?'Online':'Offline';};
 addEventListener('online',updateConnection);addEventListener('offline',updateConnection);updateConnection();
 if('serviceWorker' in navigator){const hadController=!!navigator.serviceWorker.controller;let reloaded=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(hadController&&!reloaded){reloaded=true;location.reload();}});}
 if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').then(async reg=>{
  await navigator.serviceWorker.ready;
  if(connection && navigator.onLine)connection.textContent='Lessons ready offline';
 }).catch(()=>{if(connection)connection.textContent='Offline setup unavailable';});
}
addEventListener('DOMContentLoaded',setupCommon);
