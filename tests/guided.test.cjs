const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const c=vm.createContext({});for(const name of ['lessons','beginner','guided-lessons'])vm.runInContext(fs.readFileSync('assets/'+name+'.js','utf8'),c);
test('every guided lesson includes context, definitions, all sketch frames, full example and a paused checkpoint',()=>{
 for(let id=0;id<35;id++){
  const frames=vm.runInContext(`buildGuidedLesson(RAW[${id}],BEGINNER[${id}])`,c),lesson=vm.runInContext(`RAW[${id}]`,c);
  assert.ok(frames.length>lesson.sketch.caps.length);assert.ok(frames.every(f=>f.title&&f.text&&f.visual&&!/<\/?(?:p|li|b|code|mark)>/.test(f.text)));
  assert.equal(frames.filter(f=>f.sketch!==undefined).length,lesson.sketch.caps.length);
  assert.equal(frames.filter(f=>f.title.startsWith('Worked example:')).length,lesson.ex.steps.length);
  assert.equal(frames.filter(f=>f.checkpoint&&f.pause).length,1);assert.equal(frames.at(-1).chapter,'Recap');
  for(const chapter of ['Start here','Understand','See it','Work it through','Avoid a mistake','Try it','Recap'])assert.ok(frames.some(f=>f.chapter===chapter),`${id}: ${chapter}`);
 }
});
