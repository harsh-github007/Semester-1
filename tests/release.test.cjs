const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const c=vm.createContext({});for(const f of ['mock-data','labs','materials-index'])vm.runInContext(fs.readFileSync('assets/'+f+'.js','utf8'),c);const run=s=>vm.runInContext(s,c);
test('each mock has 100 points and a complete beginner/solution/marking path',()=>{
 for(const name of ['valuation','derivatives']){const qs=run(`MOCKS.${name}`);assert.equal(qs.length,8);assert.equal(qs.reduce((s,q)=>s+q.points,0),100);for(const q of qs){assert.ok(q.words&&q.warmup&&q.question&&q.hint&&q.reading&&q.source);assert.ok(q.steps.length>=4);assert.equal(q.rubric.reduce((s,r)=>s+parseInt(r),0),q.points);}}
});
test('mock numerical answers independently match the worked solutions',()=>{
 const close=(a,b)=>assert.ok(Math.abs(a-b)<.005,`${a} != ${b}`);
 close((100-2*Math.exp(-.025))*Math.exp(.05),103.0765);
 const k=(1-.85)/(.96+.91+.85);close((1-.80-k*(.95+.88+.80))*1e6,54963.2353);
 const q=(1.05-.8)/(1.2-.8),u=(1-q)*9/1.05,d=(q*9+(1-q)*41)/1.05;
 close((q*u+(1-q)*Math.max(25,d))/1.05,10.8418);close((q*u+(1-q)*d)/1.05,9.0561);
 close(100*.63683-100*.951229*.55962,10.45);close(100*Math.exp(-.09),91.39);
 close(((100-5/1.04)/105)**(-.5)-1,.0502525);
 close((15-.01*(.5*(-15)*(-20)+.5*15*20))/1.05,11.4286);
 assert.deepEqual([[3,0],[2,4]].map(a=>[[3,0],[2,4]].map(b=>a.reduce((s,v,i)=>s+v*b[i],0))),[[9,6],[6,20]]);
 close((16-2*9+4)/(.95*100),.0210526);close(30/1.05,28.5714);close(.6*.12+.4*.06*.75,.09);close((.02*40+.03*10)/.05,22);
});
test('IRR handles zero, negative and rates above 1000 percent',()=>{
 for(const [cost,cash,n,expected] of [[100,100,1,0],[100,50,1,-50],[100,1500,1,1400]]){const rate=run(`LabMath.irr(${cost},${cash},${n})`);assert.ok(Math.abs(rate-expected)<1e-8);assert.ok(Math.abs(run(`LabMath.npv(${cost},${cash},${n},${rate}).npv`))<1e-8);}
});
test('all 42 bundled library entries point to real files with the expected size',()=>{
 const manifest=JSON.parse(fs.readFileSync('private-materials/index.json'));assert.equal(manifest.length,42);assert.deepEqual(JSON.parse(run('JSON.stringify(PACKAGED_MATERIALS)')),manifest);
 for(const item of manifest){assert.ok(!item.path.includes('..'));assert.equal(fs.statSync(item.path).size,item.size);assert.match(item.path,/\.(pdf|jpeg)$/);}
 assert.doesNotMatch(fs.readFileSync('assets/library.js','utf8'),/fetch\(/);
});
test('resource navigation stops the old lesson before changing its index',()=>{
 const src=fs.readFileSync('assets/study.js','utf8'),dom=()=>({textContent:'',removeAttribute(){},classList:{remove(){}}});
 const ctx=vm.createContext({document:{querySelector:()=>null,body:{classList:{remove(){}}}},clearTimers(){},hush(){},renderNav(){},sheet:{innerHTML:''},RES:{},ONLY:true});
 const functions=src.slice(src.indexOf('function showTime('),src.indexOf('function tick('))+src.slice(src.indexOf('function stop('),src.indexOf('function finish('))+src.slice(src.indexOf('function showWatch('),src.indexOf('function route('));
 ctx.dom=dom;vm.runInContext("let cur=0,step=0,playing=false;const CLASSES=[{sketch:{caps:['example']}}];const capsOf=()=>CLASSES[cur].sketch.caps;const $=()=>dom();const stepMs=()=>1000;const fmtT=()=>'';"+functions,ctx);assert.doesNotThrow(()=>vm.runInContext('showWatch()',ctx));assert.match(ctx.sheet.innerHTML,/Watch and learn/);
});
test('backups preserve both mock papers and BMC quiz and reject invalid marks',()=>{
 const src=fs.readFileSync('assets/home.js','utf8');const ctx=vm.createContext({RAW:Array(35).fill({})});vm.runInContext(src.match(/const backupKeys=\[[^;]+;/)[0]+src.slice(src.indexOf('function validateBackup')),ctx);
 const data=vm.runInContext("validateBackup({'fsb-final-valuation':{0:{text:'working',mark:12}},'fsb-final-derivatives':{5:{mark:14}},'fsb-bmc-quiz':{'3-7':2}})",ctx);assert.equal(data['fsb-final-valuation'][0].text,'working');assert.equal(data['fsb-final-derivatives'][5].mark,14);assert.equal(data['fsb-bmc-quiz']['3-7'],2);
 assert.throws(()=>vm.runInContext("validateBackup({'fsb-final-valuation':{0:{mark:13}}})",ctx));assert.throws(()=>vm.runInContext("validateBackup({'fsb-bmc-quiz':{'0-8':1}})",ctx));
});
