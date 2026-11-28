const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const c=vm.createContext({});vm.runInContext(fs.readFileSync('assets/derivatives-chapters-data.js','utf8'),c);
const N=x=>{const t=1/(1+0.2316419*Math.abs(x)),d=Math.exp(-x*x/2)/Math.sqrt(2*Math.PI),p=d*t*(0.319381530+t*(-0.356563782+t*(1.781477937+t*(-1.821255978+t*1.330274429))));return x>=0?1-p:p};
const close=(a,b,e=.005)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
test('final-chapter papers match the midterm format (5 × 8 points) with complete marking paths',()=>{
 for(const k of ['A','B','C']){const qs=vm.runInContext(`CHAPTER_FINAL.${k}`,c);assert.equal(qs.length,5);assert.equal(qs.reduce((s,q)=>s+q.points,0),40);
  for(const q of qs){assert.ok(q.words&&q.warmup&&q.question&&q.hint&&q.reading&&q.source&&Number.isInteger(q.lesson));assert.ok(q.steps.length>=4);assert.equal(q.rubric.reduce((s,r)=>s+parseInt(r),0),q.points);}}
});
test('final-chapter numerical answers are independently reproduced',()=>{
 close(50-1.2*Math.exp(-.015)-45*Math.exp(-.03),5.1478);
 const u=Math.exp(.3*Math.sqrt(.5)),d=1/u,p=(Math.exp(.025)-d)/(u-d),g=Math.exp(-.025),pu=g*(1-p)*2,pd=g*(p*2+(1-p)*(52-50*d*d));
 close(g*(p*pu+(1-p)*pd),5.4213);close(g*(p*pu+(1-p)*Math.max(pd,52-50*d)),6.0394);
 close(N((Math.log(40/45)+.115*.5)/(.3*Math.sqrt(.5))),.3881,.001);
 const bs=(S,K,r,s,T)=>{const d1=(Math.log(S/K)+(r+s*s/2)*T)/(s*Math.sqrt(T)),d2=d1-s*Math.sqrt(T);return[S*N(d1)-K*Math.exp(-r*T)*N(d2),K*Math.exp(-r*T)*N(-d2)-S*N(-d1)]};
 const sa=60-1.5*Math.exp(-.04/6)-1.5*Math.exp(-.04*5/12),[c4,p4]=bs(sa,58,.04,.28,.75);close(c4,5.8504);close(p4,5.1014);
 const w1=4500/1.6;close(w1,2812.5);close(3000-.6*w1,1312.5);
 close(4.2-(31-30*Math.exp(-.04)),2.0237);close(4.2-(31-.5*Math.exp(-.08/6)-30),3.6934);
 const fu=Math.exp(.125),fd=1/fu,q=(1-fd)/(fu-fd),h=Math.exp(-.01),up=h*(1-q)*50,dn=Math.max(h*(q*50+(1-q)*(1250-1200*fd*fd)),1250-1200*fd);close(h*(q*up+(1-q)*dn),112.658);
 close(N(-1.75),.0401,.0005);
 close(bs(50-.7*Math.exp(-.01)-.7*Math.exp(-.025),50,.06,.25,.5)[0],3.4723);close(bs(50-.7*Math.exp(-.01),50,.06,.25,5/12)[0],3.4316);
 close(bs(50,50,.05,.25,.5)[1],2.8955);
 close(1600*Math.exp(.14),1840.44,.01);close(bs(40,45,.05,.3,1)[0],3.6585);close(100*Math.exp(-.05)*N((Math.log(40/45)+.005)/.3),33.624,.01);
 close(Math.sqrt(.2125),.461,.001);close(.04-.2*.01*5+.5*.0225*.0016*25,.03045,1e-6);
 const th=.04*5e4+.5*.0625*3600*1500;close(th,170750);close(Math.sqrt(th/365/750),.79,.005);
 {const u=Math.exp(.1),d=1/u,a=Math.exp(.01),p=(a-d)/(u-d),g=Math.exp(-.015);let V=[0,1,2,3].map(j=>Math.max(105-100*u**j*d**(3-j),0));for(let i=2;i>=0;i--)V=Array.from({length:i+1},(_,j)=>Math.max(g*(p*V[j+1]+(1-p)*V[j]),105-100*u**j*d**(i-j)));close(V[0],8.433);}
});
