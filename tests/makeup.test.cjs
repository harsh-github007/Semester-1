const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const c=vm.createContext({});for(const f of ['config','lessons','makeup-data'])vm.runInContext(fs.readFileSync('assets/'+f+'.js','utf8'),c);
const M=vm.runInContext('MAKEUP',c),RAW=vm.runInContext('RAW',c);
const close=(a,b,tol=.005)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`);
const pv=(cfs,r)=>cfs.reduce((s,x,i)=>s+x/(1+r)**(i+1),0);
const ncdf=x=>{const t=1/(1+.2316419*Math.abs(x)),d=.3989423*Math.exp(-x*x/2),p=d*t*(.3193815+t*(-.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));return x>0?1-p:p;};

test('plan covers Nov 26 to Dec 8, one entry per day, timed from Day 5, mocks on Dec 3 and Dec 6',()=>{
 assert.equal(M.plan.length,13);assert.equal(M.plan[0].date,'2026-11-26');assert.equal(M.plan[12].date,'2026-12-08');
 M.plan.forEach((d,i)=>{const day=new Date(Date.UTC(2026,10,26+i)).toISOString().slice(0,10);assert.equal(d.date,day);assert.ok(d.tasks.length>=3);});
 M.plan.slice(4,12).forEach(d=>assert.ok(d.timed,d.label));
 assert.equal(M.plan.find(d=>d.mock==='M1').date,'2026-12-03');assert.equal(M.plan.find(d=>d.mock==='M2').date,'2026-12-06');
});
test('every problem is complete and every set has videos and real lesson links',()=>{
 const ids=new Set();
 for(const s of M.sets){assert.ok(M.videos[s.id].length>=4,s.id);for(const v of M.videos[s.id])assert.match(v[1],/^https:\/\//);for(const n of s.lessons)assert.ok(RAW[n],`lesson ${n}`);}
 for(const p of [...M.sets.flatMap(s=>s.problems),...M.mocks.flatMap(m=>m.problems)]){assert.ok(!ids.has(p.id),p.id);ids.add(p.id);assert.ok(p.title&&p.q&&p.hint&&p.answer&&p.src,p.id);assert.equal(p.steps.length,4,p.id);assert.ok(p.min>=6&&p.min<=14,p.id);}
 for(const m of M.mocks){const t=m.problems.reduce((a,p)=>a+p.min,0);assert.ok(t<=60&&t>=55,`${m.id} ${t}`);}
});
test('scope excludes futures, capital budgeting and corporate risk management lessons',()=>{
 const used=M.sets.flatMap(s=>s.lessons);for(const n of [22,23,17,18])assert.ok(!used.includes(n));
});
test('set answers recompute independently',()=>{
 close(30000/.04*(1-(1.03/1.07)**20),399949.90,.01);close(3*1.06/.06**2,883.333);close((2+.1)/.1**3,2100,1e-6);close(100/.05/1.05**5,1567.05);
 const pmt=20000*.0075/(1-1.0075**-36);close(pmt,635.99);close(pmt*(1-1.0075**-24)/.0075,13921.38);close(pmt*36-20000,2895.81);
 close(pv([50,50,50,50,50,1050],.07),904.67);close(pv([50,50,50,50,50,1050],.08),861.31);
 close(1.035**2/1.03-1,.040024,1e-6);close(1.038**3/1.035**2-1,.044026,1e-6);
 const d2=(100.5-5*.97)/105,d3=(101.2-6*(.97+d2))/106;close(d2,.910952,1e-6);close(d3,.848248,1e-6);close(d3**(-1/3)-1,.05639,1e-5);close((1-d2)/(.97+d2),.04734,1e-5);
 const tb=10000*(1-.0095*135/360);close(tb,9964.38,.01);close((10000/tb)**(365/135)-1,.00970,1e-5);
 const cf=[50,50,50,50,50,1050],V=pv(cf,.07),D=cf.reduce((s,x,i)=>s+(i+1)*x/1.07**(i+1),0)/V;close(D,5.290);close(-D/1.07*V*.01,-44.72);
 const p=10000*.01/(1-1.01**-12);let v=0;for(let t=1;t<=12;t++)v+=p*.995**t/1.003**t;close(p,888.49);close(v,10124.94);close(.008/.995,.00804,1e-5);
 close(.05*40000/460000,.004348,1e-6);close((1-.024)/1.03*100,94.757,.001);
 const bis=(F,cpn,n,pi,lam,r)=>{let s=0;for(let t=1;t<=n;t++)s+=(cpn+(t===n?F:0))*((1-lam)+lam*(1-pi)**t)/(1+r)**t;return s;};
 close(bis(1000,55,5,.03,.6,.04),984.73);close(bis(1000,70,4,.05,.5,.03),1051.03);close(bis(100,6,12,.08,.7,.04),76.51);close(bis(100,6,12,.12,.7,.04),65.05);
 close(Math.log(.7)/Math.log(.95),6.95);close(-Math.log(.7)/.08,4.46);
 close((2*24/.6)**2,6400,1e-6);close(-Math.log(.6)/.25,2.043);
 const z2=.5*.8+Math.sqrt(.75)*-.4;close(-Math.log(1-ncdf(.8))/.2,7.76);close(-Math.log(1-ncdf(z2))/.3,2.46);
 close(Math.sqrt(432),20.78);close(Math.exp(Math.log(50)+.11),55.81,.01);close(Math.exp(Math.log(50)+.11-1.645*.3*Math.SQRT2),27.77,.01);close(Math.exp(Math.log(50)+.11+1.645*.3*Math.SQRT2),112.16,.01);close(50*Math.exp(.2),61.07);
 close(60+20*.85**4,70.44);close(Math.sqrt(16*(1-.85**8)/(.15*1.85)),6.48);close(60+20*.85**12,62.84);close(4/Math.sqrt(.2775),7.59);close(Math.log(.5)/Math.log(.85),4.265,.001);
 close(.05*Math.sqrt(12),.1732,1e-4);close(.096+.03/2,.111,1e-6);
 const vp=.36*.04+.16*.0144+2*.6*.4*.0072;close(Math.sqrt(vp),.14199,1e-5);close(.0072/.04,.18,1e-9);
 close(2/(.10-.04),33.33);close(50-.05*112,44.4,1e-9);close(Math.sqrt(160)/72,.17568,1e-5);
 const det=.0225*.0625-.0075**2,z=[(.0625*.05-.0075*.09)/det,(-.0075*.05+.0225*.09)/det],w=z.map(x=>x/(z[0]+z[1]));close(w[0],.59756,1e-5);close(w[0]*.08+w[1]*.12,.09610,1e-5);
 close((10-.02*900)/1.05,-7.619);
});
test('mock answers recompute independently',()=>{
 close(1.57*Math.sqrt(500),35.11);close((2*35.106/1)**2,4930,1);close(Math.sqrt(360-36),18,1e-9);close((50-44)/120,.05,1e-9);close(60-.05*164,51.8,1e-9);close(Math.sqrt(284)/95.8,.176,.001);
 close((128+2-.6*15)/1.1,110,1e-9);const P=50000/.06*(1-(1.02/1.08)**25);close(P,633701.79,.01);close(-Math.log(1-P*.08/1e5)/Math.log(1.08),9.19);
 const cf=[60,60,60,60,60,60,60,1060],V=pv(cf,.04),D=cf.reduce((s,x,i)=>s+(i+1)*x/1.04**(i+1),0)/V;close(V,1134.65);close(D,6.681,.001);close(-D/1.04*V*.01,-72.89);close(pv(cf,.05)-V,-70.02);
 close(6000/1850000,.003243,1e-6);close(4+3*.9**6,5.594,.001);close(4+3*.9**12,4.847,.001);close(.3/Math.sqrt(.19),.688,.001);assert.ok(4+3*.9**17>4.5&&4+3*.9**18<4.5);
});
