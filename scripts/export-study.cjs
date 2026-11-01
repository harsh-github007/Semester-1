// Export the same source data used by the app; no manually copied lesson text.
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..');process.chdir(root);
const context=vm.createContext({});
for(const name of ['config','lessons','beginner','mock-data','bmc-quiz-data','bmc-cases'])vm.runInContext(fs.readFileSync(`assets/${name}.js`,'utf8'),context);
const data=vm.runInContext('({lessons:RAW,beginner:BEGINNER,configs:CONFIGS,mocks:MOCKS,quiz:BMC_QUIZ,cases:BMC_CASES})',context);
data.practice={};for(const [key,file] of [['valuation','practice-data'],['derivatives','derivatives-practice-data']]){const c=vm.createContext({});vm.runInContext(fs.readFileSync(`assets/${file}.js`,'utf8'),c);data.practice[key]=vm.runInContext('PRACTICE',c);}
const out=process.argv[2]||'../work/pdf-build/content.json';fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(data,null,2));
const materials=JSON.parse(fs.readFileSync('private-materials/index.json','utf8'));
for(const item of materials){if(!fs.existsSync(item.path)||fs.statSync(item.path).size!==item.size)throw Error('Missing/changed material: '+item.path);}
fs.writeFileSync('assets/materials-index.js','// Generated from private-materials/index.json by scripts/export-study.cjs.\nconst PACKAGED_MATERIALS = '+JSON.stringify(materials,null,2)+';\n');
console.log(`Exported ${data.lessons.length} lessons, ${Object.values(data.mocks).flat().length} mock questions and ${materials.length} materials.`);
