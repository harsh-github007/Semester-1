const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
const context=vm.createContext({console});
for(const file of ['config','lessons','beginner','practice-data'])vm.runInContext(fs.readFileSync(`assets/${file}.js`,'utf8'),context);
const run=code=>vm.runInContext(code,context);
test('all 35 unique lessons have a complete beginner path and an answer',()=>{
 assert.equal(run('RAW.length'),35);assert.equal(run('BEGINNER.length'),35);
 assert.equal(run('new Set(CONFIGS.all.SUBJECTS.flatMap(s=>s[1])).size'),35);
 assert.equal(run('BEGINNER.every(b=>b.story&&b.words&&b.why&&b.options[b.answer]&&b.prerequisites.every(id=>RAW[id]))'),true);
});
test('every subject uses valid stable IDs without internal duplicates',()=>{
 assert.equal(run('Object.values(CONFIGS).every(cfg=>{const ids=cfg.SUBJECTS.flatMap(s=>s[1]);return ids.every(id=>RAW[id])&&new Set(ids).size===ids.length;})'),true);
});
test('all sketch steps render valid finite geometry',()=>{
 for(let id=0;id<35;id++){
  const items=run(`RAW[${id}].sketch.draw()`);assert.ok(items.length>0,`lesson ${id}`);
  for(const [,svg]of items){assert.ok(!/NaN|Infinity|undefined/.test(svg),`invalid sketch in lesson ${id}`);}
 }
});
test('calculator defaults yield finite answers',()=>{
 for(let id=0;id<35;id++)if(run(`!!RAW[${id}].calc`)){
  const output=run(`RAW[${id}].calc.run(Object.fromEntries(RAW[${id}].calc.inputs.map(([k,l,v])=>[k,v])))`);
  assert.ok(!/NaN|Infinity|undefined/.test(output),`calculator ${id}: ${output}`);
 }
});
test('practice follows seven source question types and totals 100 points',()=>{
 assert.equal(run('PRACTICE.length'),7);assert.equal(run('PRACTICE.reduce((s,q)=>s+q.points,0)'),100);
 assert.equal(run('PRACTICE.every(q=>q.warmup&&q.words&&q.hint&&q.steps.length>=4&&q.rubric.length>=3)'),true);
});
test('practice numerical answers independently check out',()=>{
 const r=.10;let sum=0;for(let t=1;t<=1000;t++)sum+=t*(t-1)/(1+r)**t;assert.ok(Math.abs(sum-2200)<1e-8);
 assert.equal((40-36)/(64+16),.05);assert.equal(60-.05*(16+144),52);
 const C=[[5,0],[3,6]];const product=C.map(row=>C.map(other=>row.reduce((s,v,k)=>s+v*other[k],0)));assert.deepEqual(product,[[25,15],[15,45]]);
 assert.equal(Math.ceil(400*(4/1.5)**2),2845);
});
test('core files and local HTML/script/stylesheet targets exist',()=>{
 const sw=fs.readFileSync('sw.js','utf8');const core=JSON.parse(sw.match(/const CORE=(\[[^;]+\])/)[1].replaceAll("'",'"'));
 for(const file of core)assert.ok(fs.existsSync(file),file);
 for(const file of fs.readdirSync('.').filter(f=>f.endsWith('.html'))){
  const html=fs.readFileSync(file,'utf8');for(const [,url]of html.matchAll(/(?:src|href)="([^"#]+)"/g)){
   if(/^(https?:|blob:|mailto:)/.test(url))continue;const target=decodeURIComponent(url.split(/[?#]/)[0]);assert.ok(fs.existsSync(target),`${file}: ${target}`);
  }
 }
});
test('legacy progress migrates by lesson identity and tolerates malformed data',()=>{
 const memory=new Map([['fsb-done-risk',JSON.stringify({1:true})],['fsb-done-derivatives','null']]);
 const c=vm.createContext({localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)},document:{querySelector:()=>null},addEventListener:()=>{}});
 vm.runInContext(fs.readFileSync('assets/config.js','utf8'),c);vm.runInContext(fs.readFileSync('assets/common.js','utf8'),c);
 assert.equal(vm.runInContext('Store.progress()[7]',c),true);assert.equal(memory.get('fsb-migrated-v2'),'true');
 memory.set('fsb-progress-v2','[]');assert.equal(vm.runInContext('Object.keys(Store.progress()).length',c),0);
 memory.set('fsb-progress-v2','{bad');assert.equal(vm.runInContext('Object.keys(Store.progress()).length',c),0);
});
test('invalid models do not silently produce prices and zero-rate loans work',()=>{
 assert.throws(()=>run('RAW[9].calc.run({v:100,s:2,c:96,d:1})'),/exactly 95 or 99/);
 assert.throws(()=>run('RAW[15].calc.run({s:20,k:21,u:1.1,d:1.2,r:12,t:.25})'),/valid tree/);
 assert.throws(()=>run('RAW[16].calc.run({s:42,k:40,v:0,r:10,t:.5})'),/positive/);
 assert.match(run('RAW[2].calc.run({b:1200,r:0,n:12})'),/100.00/);
 assert.match(run('RAW[23].calc.run({c0:100,c1:0,c2:0,c3:0,r:5})'),/Not calculated/);
});
test('backup validation rejects malformed data and accepts practice answers',()=>{
 const code=fs.readFileSync('assets/home.js','utf8');
 vm.runInContext("const backupKeys=['fsb-progress-v2','fsb-notes','fsb-review','fsb-certification','fsb-practice','fsb-practice-derivatives','fsb-last'];",context);
 vm.runInContext(code.slice(code.indexOf('function validateBackup')),context);
 assert.throws(()=>run("validateBackup({'fsb-progress-v2':{'999':true}})"),/lesson ID/);
 assert.throws(()=>run("validateBackup({'fsb-certification':{'0':120}})"),/certification/);
 assert.throws(()=>run("validateBackup({'fsb-practice':{'3':{mark:11}}})"),/practice/);
 assert.equal(run("validateBackup({'fsb-practice':{'0':{text:'My working',mark:15}}})['fsb-practice'][0].mark"),15);
});
test('worker only intercepts its app shell and preserves other applications’ caches',async()=>{
 const handlers={},deleted=[];const c=vm.createContext({URL,Response,fetch:async()=>{throw Error('offline')},self:{location:{origin:'https://example.test'},registration:{scope:'https://example.test/'},clients:{claim:async()=>{}},skipWaiting:async()=>{},addEventListener:(name,fn)=>handlers[name]=fn},caches:{keys:async()=>['another-app','sketchbook-v1','sketchbook-v8'],delete:async key=>deleted.push(key),open:async()=>({match:async()=>undefined})}});
 vm.runInContext(fs.readFileSync('sw.js','utf8'),c);
 await new Promise(resolve=>handlers.activate({waitUntil:p=>p.then(resolve)}));assert.deepEqual(deleted,['sketchbook-v1']);
 let intercepted=false;handlers.fetch({request:{method:'GET',url:'https://example.test/private-materials/book.pdf'},respondWith:()=>intercepted=true});assert.equal(intercepted,false);
 const response=await new Promise(resolve=>handlers.fetch({request:{method:'GET',url:'https://example.test/assets/study.js'},respondWith:p=>p.then(resolve)}));assert.equal(response.status,503);assert.equal(response.headers.get('Content-Type'),'text/plain');
});
test('Derivatives paper practice has five questions and independently verified calculations',()=>{
 const d=vm.createContext({});vm.runInContext(fs.readFileSync('assets/derivatives-practice-data.js','utf8'),d);
 assert.equal(vm.runInContext('PRACTICE.length',d),5);assert.equal(vm.runInContext('PRACTICE.reduce((s,q)=>s+q.points,0)',d),40);
 let pv=0;for(let k=1;k<=12;k++)pv+=1.5*1.01**(k-1)*Math.exp(-.04*k/4);
 assert.ok(Math.abs((200-pv)*Math.exp(.12)-205.411853016)<1e-8);
 const spot=(1100*Math.exp(-.02)-.5)*Math.exp(.015);assert.ok(Math.abs(spot-1094.00617058)<1e-8);
 const margin=375000*Math.exp(.04/365)+10000;const x=1498+(margin*Math.exp(.04/365)-337500)/5000;
 assert.ok(Math.abs(x-1507.516659348)<1e-8);
 assert.ok(Math.abs(920-80/1.035-1020/1.04**2+100.342023268)<1e-8);
 const dfs=[.07,.073,.077,.081,.084,.088].map((r,i)=>(1+r)**(-i-1));const rate=(1-dfs[5])/dfs.reduce((a,b)=>a+b,0);
 assert.ok(Math.abs(rate-.086201816758)<1e-10);
 assert.ok(Math.abs(rate*dfs.reduce((a,b)=>a+b,0)+dfs[5]-1)<1e-12);
});
test('Bloomberg warm-up quiz has four topics with valid answers and explanations',()=>{
 const c=vm.createContext({});vm.runInContext(fs.readFileSync('assets/bmc-quiz-data.js','utf8')+';this.Q=BMC_QUIZ',c);const Q=c.Q;
 assert.equal(Q.length,4);assert.equal(Q.map(t=>t.lesson).join(),'31,32,33,34');
 for(const t of Q){assert.ok(t.questions.length>=8);for(const [q,o,a,why]of t.questions){assert.ok(q&&why&&o.length>=3&&Number.isInteger(a)&&o[a],q);}}
});
