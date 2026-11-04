const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
const context=vm.createContext({console});
for(const file of ['config','lessons','videos'])vm.runInContext(fs.readFileSync(`assets/${file}.js`,'utf8'),context);
const run=code=>vm.runInContext(code,context);
test('every class has three videos whose scenes match their captions',()=>{
 for(let id=0;id<35;id++){
  const vids=run(`lessonVideos(RAW[${id}]).map(v=>({name:v.name,caps:v.caps,items:v.draw()}))`);
  assert.equal(vids.length,3,`lesson ${id}`);
  for(const v of vids){
   assert.ok(v.caps.length>=3,`${id} ${v.name}`);
   assert.ok(v.caps.every(t=>t&&!/<|undefined|NaN/.test(t)),`${id} ${v.name} captions`);
   for(let k=0;k<v.caps.length;k++){
    const shown=v.items.filter(([s])=>Array.isArray(s)?k>=s[0]&&k<=s[1]:s<=k);
    assert.ok(shown.length>0,`${id} ${v.name} step ${k} is empty`);
   }
   for(const [,svg]of v.items)assert.ok(!/NaN|Infinity|undefined/.test(svg),`${id} ${v.name} svg`);
  }
 }
});
