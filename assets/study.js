const {ONLY,SUBJECTS,RES,OTHERS}=CONFIGS[PAGE];
const CLASSES=SUBJECTS.flatMap(([subj,ids])=>ids.map(id=>({...RAW[id],subj})));
const RISK_ALSO=ONLY?[]:[7,16,18].map(id=>CLASSES.findIndex(c=>c.id===id));

const nav=document.getElementById('nav'),sheet=document.getElementById('sheet'),pick=document.getElementById('pick');
let progress=Store.progress();
let done=Object.fromEntries(CLASSES.map((c,i)=>[i,progress[c.id]===true]));
const save=()=>{const latest=Store.progress();if(CLASSES[cur])latest[CLASSES[cur].id]=done[cur]===true;Store.write('fsb-progress-v2',latest);};
function renderNav(cur){let html=`<div class="wk"><button class="cl" data-w="1" aria-current="${cur===-1}"><span class="n">▶</span><span><b>Watch and learn online</b></span><span></span></button></div>`,sj='';const btn=(c,i)=>`<button class="cl" data-i="${i}" aria-current="${i===cur}"><span class="n">${String(i+1).padStart(2,'0')}</span><span>${c.title}</span><span class="ok">${done[i]?'✓':''}</span></button>`;
  CLASSES.forEach((c,i)=>{if(c.subj!==sj){if(sj)html+='</div>';sj=c.subj;html+=`<div class="wk"><h4>${sj}</h4>`}html+=btn(c,i);
   if(c===CLASSES[CLASSES.length-1]||CLASSES[i+1].subj!==sj){if(sj==='Risk Management'&&RISK_ALSO.length)html+=`<h4 style="margin-top:8px">Also on the Risk syllabus</h4>`+RISK_ALSO.map(j=>btn(CLASSES[j],j)).join('')}});
  html+='</div>';const ok=Object.entries(OTHERS);if(ok.length)html+=`<div class="wk"><h4>Other subjects</h4>${ok.map(([k,u])=>`<a class="cl" href="${u}"><span class="n">↗</span><span>${k}</span><span></span></a>`).join('')}</div>`;
  nav.innerHTML=html;filterLessons();pick.innerHTML=`<option value="-1" ${cur===-1?'selected':''}>▶ Watch and learn online</option>`+CLASSES.map((c,i)=>`<option value="${i}" ${i===cur?'selected':''}>${c.subj}: ${i+1}. ${c.title}</option>`).join('');
  const n=Object.values(done).filter(Boolean).length;document.getElementById('progtxt').textContent=`${n} of ${CLASSES.length} done`;document.getElementById('progbar').style.width=(n/CLASSES.length*100)+'%'}
nav.addEventListener('click',e=>{const b=e.target.closest('button.cl');if(!b)return;if(b.dataset.w){location.hash='watch';scrollTo({top:0})}else go(+b.dataset.i)});
pick.addEventListener('change',()=>{+pick.value<0?location.hash='watch':go(+pick.value)});
let timer=null,step=0,cur=0,playing=false;
function go(i){location.hash='class-'+(i+1)}
function show(i){stop();cur=i;step=0;const c=CLASSES[i];c._guided=buildGuidedLesson(c,BEGINNER[c.id]);c._videos=lessonVideos(c).map(v=>({...v,items:v.draw()}));renderNav(i);Store.write('fsb-last',c.id);document.title=c.title+' · Finals Sketchbook';
 sheet.innerHTML=`<div class="head"><span class="num">Class ${i+1} of ${CLASSES.length}</span><span class="tag">${c.subj}</span>${c.tag!==c.subj?`<span class="tag">also ${c.tag.replace(c.subj,'').replace(/^ \+ | \+ $/,'')}</span>`:''}</div>
 <h2 class="title">${c.title}</h2><p class="oneline">${c.one}</p>${beginnerHTML(c)}${labHTML(c.id)}
 <section class="guided-intro"><h3>Learn this from the beginning</h3><p>A guided, narrated lesson with definitions, pictures and a worked example. It pauses before your attempt. Turn Voice on to listen; captions and the full transcript are always available.</p></section><div class="player" id="player" tabindex="-1" aria-label="Guided lesson for ${c.title}. Space plays or pauses, arrow keys move between steps."><div class="lesson-tools"><label>Lesson format <select id="lesson-format"><option value="guided">Full beginner lesson</option><option value="sketch">Quick sketch revision</option><option value="example">Worked-example video</option><option value="traps">Common-mistakes video</option></select></label><label>Jump to chapter <select id="lesson-chapter"></select></label></div><div class="stage"><div id="lesson-board" class="lesson-board"><h3 id="scene-title"></h3><p id="scene-visual"></p><p id="scene-prompt" class="small"></p><div id="scene-check"></div></div><svg id="svg" viewBox="${W}" role="img" aria-label="Step-by-step sketch for ${c.title}"></svg>
  <div class="endcard" id="endcard" hidden><p class="end-t">Lesson finished</p><p class="small">Now try the worked example below on paper, then check the solution.</p><div class="end-b"><button class="btn" id="replay">↺ Watch again</button><button class="btn primary" id="toex">Try the example ↓</button></div></div></div>
  <div class="tl" id="dots" role="group" aria-label="Steps"></div>
  <div class="cap" aria-live="polite"><span class="k" id="kk"></span><span id="cap"></span></div>
  <div class="ctrl"><button class="btn" id="prev">◀ Back</button><button class="btn primary" id="play">▶ Play</button><button class="btn" id="next">Next ▶</button>
   <span class="ctrl-r"><button class="btn" id="voice" aria-pressed="false" title="Read each step aloud (V)">🔈 Voice off</button><label class="speed">Speed <select id="speed">${[0.75,1,1.25,1.5].map(v=>`<option value="${v}">${v}×</option>`).join('')}</select></label><button class="btn" id="full" aria-pressed="false" title="Full screen (F)">⛶ Big screen</button><span class="time" id="time"></span></span></div></div><details class="video-transcript"><summary>Read the full lesson transcript</summary><ol id="lesson-transcript"></ol></details>
 <div class="grid2">
  <section class="blk plain"><h3>What it means <small>plain words</small></h3>${c.plain}</section>
  <section class="blk"><h3>Connect it to the math</h3><p class="small">Read the symbols below as names for quantities. Use the worked example to see where each number goes.</p><div class="formula">${c.formula}</div><p class="legend">${c.legend}</p></section>
  <section class="blk wide" id="ex-${i}" tabindex="-1"><h3>Worked example <small>do it on paper first</small></h3><p style="margin:0 0 12px;max-width:70ch"><b>Question.</b> ${c.ex.q}</p><details class="solution"><summary>Show the solution, one step at a time</summary><ol class="steps">${c.ex.steps.map(s=>`<li><span>${s}</span></li>`).join('')}</ol><div class="answer">Answer: ${c.ex.a}</div></details></section>
  ${c.calc?`<section class="blk wide"><h3>Try it yourself <small>change a number, watch the answer</small></h3><div class="calc">${c.calc.inputs.map(([k,l,v])=>`<label for="in-${k}">${l}<input id="in-${k}" data-k="${k}" type="number" step="any" value="${v}"></label>`).join('')}</div><div class="out" id="out"></div></section>`:''}
  <section class="blk plain traps"><h3>Common traps <small>where marks are lost</small></h3><ul>${c.traps.map(t=>`<li>${t}</li>`).join('')}</ul></section>
  <section class="blk files"><h3>Where to read more <small>your folder</small></h3><ul style="margin:0;padding-left:18px">${c.files.map(f=>`<li><code>${f}</code></li>`).join('')}</ul>${c.tag.includes('Risk')?'<p class="note">Your Risk lecture decks (RMN1–RMNA) are not in the folder yet. This class follows the Risk syllabus topics; check it against the decks once you get them.</p>':''}</section>
 </div>
 ${practiceHTML(c)}<section class="reflection"><h3>Explain it in your own words</h3><label for="reflection">What does this mean? What confused you? Write one mistake to avoid next time.</label><textarea id="reflection" rows="3" maxlength="10000" placeholder="For example: a call gives me a choice to buy, not an obligation."></textarea><span id="note-status" class="small" role="status"></span></section><div class="foot"><label class="donebox" for="done"><input type="checkbox" id="done" ${done[i]?'checked':''}> I can explain this and solve the example without looking</label>
  <div style="display:flex;gap:8px">${i>0?`<button class="btn" id="pc">◀ Class ${i}</button>`:''}${i<CLASSES.length-1?`<button class="btn primary" id="nc">Class ${i+2} ▶</button>`:''}</div></div>`;
 document.getElementById('prev').onclick=()=>{stop();draw(step-1)};document.getElementById('next').onclick=()=>{stop();draw(step+1)};
 bindPlayer(i);
 document.getElementById('done').onchange=e=>{done[i]=e.target.checked;save();renderNav(i)};
 const pc=document.getElementById('pc'),nc=document.getElementById('nc');if(pc)pc.onclick=()=>{go(i-1);scrollTo({top:0})};if(nc)nc.onclick=()=>{go(i+1);scrollTo({top:0})};
 if(c.calc){const run=()=>{const inputs=[...sheet.querySelectorAll('[data-k]')];const v=Object.fromEntries(inputs.map(x=>[x.dataset.k,Number(x.value)]));let h;if(inputs.some(x=>x.value.trim()===''||!Number.isFinite(v[x.dataset.k])))h='Enter a number in every field to calculate.';else{try{h=c.calc.run(v);if(/NaN|Infinity|∞/.test(h))h='These inputs do not give a finite answer. Check for zero divisors, negative square roots and the model assumptions.';}catch(e){h=escapeHTML(e.message||'Check the model assumptions and try again.');}}document.getElementById('out').innerHTML=h};sheet.querySelectorAll('[data-k]').forEach(x=>x.addEventListener('input',run));run()}
 bindPractice(c);bindLab();c._items=c.sketch.draw();draw(0)}
/* ---------- sketch video player: timeline, voice, speed, big screen ---------- */
const SPEEDS=[0.75,1,1.25,1.5];
let lessonMode='guided',checkpointReady=false;
const PREF={voice:Store.read('fsb-voice',true)===true,speed:SPEEDS.includes(Store.read('fsb-speed',1))?Store.read('fsb-speed',1):1};
const canSpeak=typeof speechSynthesis!=='undefined'&&typeof SpeechSynthesisUtterance!=='undefined';
let safety=null,raf=0,tok=0,stepStart=0,stepDur=1;
const framesOf=()=>{const c=CLASSES[cur];if(lessonMode==='guided')return c._guided;const v=c._videos[({sketch:0,example:1,traps:2})[lessonMode]];return v.caps.map((text,sketch)=>({chapter:v.name,title:v.name,text,visual:text,sketch,items:v.items}));};
const capsOf=()=>framesOf().map(f=>f.text);
const stepMs=t=>Math.max(7000,t.split(/\s+/).length*460+1800)/PREF.speed;
const fmtT=ms=>{const s=Math.round(ms/1000);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
const $=id=>document.getElementById(id);
// Turn caption symbols into words a speech voice can read.
function spoken(t){return t.replace(/max\(/g,'the larger of (').replace(/e\^\(?([^ )]+)\)?/g,'e to the power $1').replace(/\$(\d[\d,]*(?:\.\d+)?)/g,'$1 dollars').replace(/€(\d[\d,]*(?:\.\d+)?)/g,'$1 euros').replace(/ = /g,' equals ').replace(/\)\//g,') divided by ')
 .replace(/÷/g,' divided by ').replace(/×|·/g,' times ').replace(/³/g,' cubed').replace(/−/g,' minus ').replace(/≈/g,' about ').replace(/→/g,' to ')
 .replace(/σ/g,' sigma ').replace(/ρ/g,' rho ').replace(/τ/g,' tau ').replace(/λ/g,' lambda ').replace(/β/g,' beta ').replace(/\bln\(/g,'natural log of (').replace(/\s+/g,' ')}
function hush(){if(canSpeak)speechSynthesis.cancel()}
function say(text,done){if(!(PREF.voice&&canSpeak)){return false}hush();const my=++tok,u=new SpeechSynthesisUtterance(spoken(text));u.rate=Math.min(1.6,PREF.speed*0.95);u.lang='en-US';
 const end=()=>{if(my===tok&&done){const d=done;done=null;d()}};u.onend=end;u.onerror=end;try{speechSynthesis.speak(u)}catch{return false}return end}
function draw(k){const c=CLASSES[cur],frames=framesOf(),n=frames.length;k=Math.max(0,Math.min(n-1,k));step=k;checkpointReady=false;const f=frames[k];
 const sketch=f.sketch;
 $('svg').toggleAttribute('hidden',sketch===undefined);$('lesson-board').hidden=sketch!==undefined;
 if(sketch!==undefined){$('svg').innerHTML=(f.items||c._items).filter(([s])=>Array.isArray(s)?sketch>=s[0]&&sketch<=s[1]:s<=sketch).map(([s,m])=>`<g>${m}</g>`).join('');}
 $('scene-title').textContent=f.title;$('scene-visual').textContent=f.visual;$('scene-prompt').textContent=f.prompt||'';
 $('scene-check').innerHTML=f.checkpoint?`<fieldset><legend>${escapeHTML(BEGINNER[c.id].question)}</legend>${BEGINNER[c.id].options.map((text,i)=>`<button class="btn" data-video-answer="${i}">${escapeHTML(text)}</button>`).join('')}</fieldset><p id="video-feedback" role="status"></p>`:'';
 $('scene-check').querySelectorAll('[data-video-answer]').forEach(b=>b.onclick=()=>{stop();checkpointReady=true;const answer=BEGINNER[c.id];$('video-feedback').textContent=(+b.dataset.videoAnswer===answer.answer?'Correct. ':'Not quite. ')+answer.why;$('scene-check').querySelectorAll('button').forEach(button=>{button.disabled=true;});$('play').textContent='Continue to recap';});
 const cap=$('cap');cap.textContent=f.text;cap.classList.remove('in');void cap.offsetWidth;cap.classList.add('in');$('kk').textContent=`${k+1} / ${n}`;
 $('dots').innerHTML=frames.map((f,j)=>`<button class="seg${j<k?' done':''}${j===k?' now':''}" data-j="${j}" aria-label="Step ${j+1}: ${escapeHTML(f.title)}" title="${escapeHTML(f.chapter+': '+f.title)}"${j===k?' aria-current="step"':''}><i></i></button>`).join('');
 $('dots').querySelectorAll('button').forEach(b=>b.onclick=()=>manual(+b.dataset.j));
 $('lesson-chapter').value=f.chapter;$('prev').disabled=k===0;$('next').disabled=k===n-1;$('endcard').hidden=true;showTime(0)}
function setupLessonNavigation(){const frames=framesOf();$('lesson-format').value=lessonMode;
 $('lesson-chapter').innerHTML=[...new Set(frames.map(f=>f.chapter))].map(ch=>`<option>${escapeHTML(ch)}</option>`).join('');
 $('lesson-transcript').innerHTML=frames.map((f,i)=>`<li><button class="transcript-jump" data-scene="${i}">${escapeHTML(f.chapter+' — '+f.title)}</button><p>${escapeHTML(f.text)}</p></li>`).join('');
 $('lesson-transcript').querySelectorAll('button').forEach(b=>b.onclick=()=>{manual(+b.dataset.scene);$('player').scrollIntoView({block:'start',behavior:'smooth'});});
}
function showTime(part){const caps=capsOf(),total=caps.reduce((s,t)=>s+stepMs(t),0),before=caps.slice(0,step).reduce((s,t)=>s+stepMs(t),0);
 $('time').textContent=`${fmtT(before+part)} / ${fmtT(total)}`}
function tick(){const el=document.querySelector('#dots .now i');if(!el||!playing)return;const t=performance.now()-stepStart,p=Math.min(PREF.voice&&canSpeak?.97:1,t/stepDur);
 el.style.width=(p*100)+'%';showTime(Math.min(t,stepDur));raf=requestAnimationFrame(tick)}
function clearTimers(){clearTimeout(timer);clearTimeout(safety);cancelAnimationFrame(raf);timer=safety=null;tok++}
function runStep(){clearTimers();const caps=capsOf(),n=caps.length;stepDur=stepMs(caps[step]);stepStart=performance.now();
 $('player').classList.add('playing');const bar=document.querySelector('#dots .now');if(bar)bar.classList.add('run');tick();
 const next=()=>{if(!playing)return;if(framesOf()[step].pause){stop();checkpointReady=!framesOf()[step].checkpoint;$('play').textContent=checkpointReady?'Continue example':'Hear question again';return;}if(step>=n-1){finish();return}draw(step+1);runStep()};
 const end=say(caps[step],()=>{clearTimeout(safety);timer=setTimeout(next,600/PREF.speed)});
 if(end)safety=setTimeout(end,stepDur*2.5);else timer=setTimeout(next,stepDur)}
function play(){if(checkpointReady){draw(step+1);}else if(step>=capsOf().length-1)draw(0);playing=true;$('play').textContent='❚❚ Pause';$('play').setAttribute('aria-label','Pause');runStep()}
function stop(){playing=false;clearTimers();hush();const b=$('play');if(b){b.textContent='▶ Play';b.removeAttribute('aria-label');$('player').classList.remove('playing');document.querySelector('#dots .now')?.classList.remove('run');const i=document.querySelector('#dots .now i');if(i)i.style.width='';showTime(0)}}
function finish(){stop();$('endcard').hidden=false;$('dots').querySelectorAll('.seg').forEach(b=>b.classList.add('done'));showTime(capsOf().reduce((s,t)=>s+stepMs(t),0)-capsOf().slice(0,step).reduce((s,t)=>s+stepMs(t),0))}
function manual(k){stop();draw(k);say(capsOf()[step])}
function setBig(on){const p=$('player');if(!p)return;p.classList.toggle('theater',on);document.body.classList.toggle('no-scroll',on);$('full').setAttribute('aria-pressed',on);$('full').textContent=on?'✕ Exit big screen':'⛶ Big screen';if(on)p.focus({preventScroll:true})}
function bindPlayer(i){const p=$('player');setupLessonNavigation();$('lesson-format').onchange=()=>{stop();lessonMode=$('lesson-format').value;step=0;setupLessonNavigation();draw(0);};$('lesson-chapter').onchange=()=>manual(framesOf().findIndex(f=>f.chapter===$('lesson-chapter').value));
 const setVoice=()=>{const b=$('voice');b.setAttribute('aria-pressed',PREF.voice);b.textContent=PREF.voice?'🔊 Voice on':'🔈 Voice off';b.hidden=!canSpeak};setVoice();
 $('voice').onclick=()=>{PREF.voice=!PREF.voice;Store.write('fsb-voice',PREF.voice);setVoice();if(playing)runStep();else if(PREF.voice)say(capsOf()[step]);else hush()};
 const sp=$('speed');sp.value=String(PREF.speed);sp.onchange=()=>{PREF.speed=+sp.value;Store.write('fsb-speed',PREF.speed);if(playing)runStep();else showTime(0)};
 $('play').onclick=()=>playing?stop():play();$('prev').onclick=()=>manual(step-1);$('next').onclick=()=>manual(step+1);
 $('replay').onclick=()=>{draw(0);play()};$('toex').onclick=()=>{setBig(false);const ex=$('ex-'+i);ex.scrollIntoView({behavior:'smooth',block:'start'});ex.focus({preventScroll:true})};
 $('full').onclick=()=>setBig(!p.classList.contains('theater'));
 p.querySelector('.stage').onclick=e=>{if(!e.target.closest('.endcard,.lesson-board,button'))playing?stop():play()};
 p.onkeydown=e=>{const tag=e.target.tagName;if(e.altKey||e.ctrlKey||e.metaKey||tag==='SELECT'||tag==='INPUT')return;
  if((e.key===' '||e.key==='k')&&tag!=='BUTTON'){e.preventDefault();playing?stop():play()}
  else if(e.key==='ArrowRight'&&tag!=='BUTTON'){e.preventDefault();manual(step+1)}else if(e.key==='ArrowLeft'&&tag!=='BUTTON'){e.preventDefault();manual(step-1)}
  else if(e.key==='f'){setBig(!p.classList.contains('theater'))}else if(e.key==='v'){$('voice').click()}else if(e.key==='Escape'&&p.classList.contains('theater')){setBig(false)}};
 setBig(false)}
function showWatch(){stop();cur=-1;document.body.classList.remove('no-scroll');renderNav(-1);
 sheet.innerHTML=`<div class="head"><span class="num">Free videos and courses</span></div><h2 class="title">Watch and learn online</h2>
 <p class="oneline">Use these <mark>alongside</mark> the classes here: do a class, then watch the matching video if anything is still unclear. These are supplementary resources from the original study app. Availability, pricing and audit access can change; check the provider before enrolling.</p>
 ${Object.entries(RES).map(([k,list])=>`${ONLY?'':`<h3 style="font-size:22px;margin:22px 0 10px">${k}</h3>`}<div class="grid2" style="margin-top:${ONLY?'10px':'0'}">${list.map(([n,u,w,d])=>`<section class="blk"><h3 style="display:block">${n}</h3><p class="legend" style="margin:0 0 8px">${w}</p><p style="margin:0 0 10px">${d}</p><a class="btn" style="display:inline-block;text-decoration:none" href="${u}">Open ↗</a></section>`).join('')}</div>`).join('')}
 <p class="note">Resource links open in this tab. Some of your own course recordings (for example the futures lecture on Zoom) need your NYU login and are listed in Valuation/06 Project and Recording Notes.</p>`}
function route(){if(location.hash==='#sheet'){sheet.focus();return;}if(location.hash==='#watch'){showWatch();return}const m=/^#class-(\d+)$/.exec(location.hash);const i=m?Math.min(CLASSES.length,Math.max(1,+m[1]))-1:0;show(i)}
addEventListener('hashchange',()=>{route();sheet.focus({preventScroll:true});scrollTo({top:0});});route();
addEventListener('storage',()=>{progress=Store.progress();done=Object.fromEntries(CLASSES.map((c,i)=>[i,progress[c.id]===true]));renderNav(cur);const checkbox=document.getElementById('done');if(checkbox)checkbox.checked=done[cur]===true;});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});

function filterLessons(){
 const query=(document.querySelector('#lesson-search')?.value||'').toLowerCase().trim();let found=0;
 nav.querySelectorAll('[data-i]').forEach(b=>{const c=CLASSES[+b.dataset.i];b.hidden=!!query&&!`${c.title} ${c.one} ${BEGINNER[c.id].words}`.toLowerCase().includes(query);if(!b.hidden)found++;});
 document.getElementById('search-status').textContent=query?(found?`${found} matching lessons`:'No matches. Try a shorter word, such as bond or risk.') : '';
}
document.getElementById('lesson-search').addEventListener('input',filterLessons);
function beginnerHTML(c){const b=BEGINNER[c.id];return `<section class="first-idea"><h3>Start with an everyday idea</h3><p>${b.story}</p><details><summary>Words you need for this lesson</summary><p>${b.words}</p></details>${b.prerequisites.length?`<p class="small">Need a step back? ${b.prerequisites.map(id=>`<a href="${lessonLink(id)}">${RAW[id].title}</a>`).join(' · ')}</p>`:'<p class="small">You can start here without earlier finance lessons.</p>'}</section><div class="learning-path" aria-label="Learning sequence"><span>1. Understand the idea</span><span>2. Follow the guided lesson</span><span>3. Try, then check</span></div>`;}
function practiceHTML(c){const b=BEGINNER[c.id];return `<section class="quick-check"><h3>Check the idea before moving on</h3><fieldset><legend>${b.question}</legend>${b.options.map((option,i)=>`<label><input type="radio" name="quick-answer" value="${i}"> ${option}</label>`).join('')}</fieldset><button class="btn primary" id="check-answer">Check my answer</button><p id="feedback" role="status"></p></section>`;}
function bindPractice(c){
 const reading=bookReading(c.id);
 sheet.querySelector('.files').insertAdjacentHTML('beforeend',`<h3 style="margin-top:20px">Book companion</h3><p>${reading.text}</p><a href="library.html?q=${encodeURIComponent(reading.query)}">Find this book</a>`);
 if(c.subj==='Derivatives')sheet.querySelector('.files').insertAdjacentHTML('beforeend','<p><a href="derivatives-practice.html">Prepare with your actual midterm paper</a> · <a href="syllabus.html#derivatives">See syllabus coverage</a></p>');
 if(c.subj==='Valuation')sheet.querySelector('.files').insertAdjacentHTML('beforeend','<p><a href="practice.html">Build up to the supplied midterm’s question style</a></p>');

 document.getElementById('check-answer').onclick=()=>{const answer=sheet.querySelector('[name="quick-answer"]:checked');const feedback=document.getElementById('feedback');if(!answer){feedback.textContent='Choose an answer first. It is okay to make a guess.';return;}const correct=+answer.value===BEGINNER[c.id].answer;feedback.textContent=(correct?'That’s right. ':'Not quite — let’s work through it. ')+BEGINNER[c.id].why;feedback.dataset.correct=correct;const review=Store.object('fsb-review');review[c.id]={correct,at:Date.now()};Store.write('fsb-review',review);};
 const note=document.getElementById('reflection');note.value=String(Store.object('fsb-notes')[c.id]||'');note.addEventListener('input',()=>{const notes=Store.object('fsb-notes');notes[c.id]=note.value;document.getElementById('note-status').textContent=Store.write('fsb-notes',notes)?'Note saved on this browser.':'Could not save. Copy your note before leaving.';});
 const sources=sheet.querySelector('.files');sources.insertAdjacentHTML('beforeend','<p class="small">These filenames identify the source readings in your study pack. Your local copy is available in Course materials. <a href="library.html">Open your course-materials shelf</a>.</p>');
}

function bookReading(id){
 const hull={4:'Chapters 1 and 9: contracts and option-market basics',1:'Chapter 4: interest rates',5:'Chapter 5: forward and futures prices',6:'Chapter 2: futures-market mechanics',20:'Chapter 3: hedging strategies',7:'Chapter 4: interest rates, duration and convexity',8:'Chapter 7: swaps',21:'Chapters 10–11: option properties and trading strategies',15:'Chapter 12: binomial trees',16:'Chapters 14 and 18: Black–Scholes–Merton and the Greeks',17:'Chapter 19: volatility smiles',26:'Chapter 18: the Greek letters',9:'Chapter 21: value at risk',13:'Chapters 23–24: credit risk and credit derivatives',27:'Chapter 24: credit derivatives'};
 if(hull[id])return {text:'Hull, Options, Futures, and Other Derivatives, supplied 8th edition — '+hull[id]+'. These chapter numbers are for your copy; match titles when using the course’s later edition.',query:'FRE6073_BOOK_01'};
 if([12,22,23,34].includes(id))return {text:'Ivo Welch, Corporate Finance, supplied 4th-edition preview: use the risk/return, CAPM and capital-budgeting topics alongside your Valuation lecture. Follow the course’s notation where conventions differ.',query:'FRE6103_BOOK_02'};
 if([0,2,3,10,11,14,18,24,25,30].includes(id))return {text:'Shimko, Valuation Principles: locate the matching cash-flow, valuation, simulation or stochastic-process section in your supplied excerpts. Section titles take priority because chapter numbers vary between versions.',query:'Valuation_Principles'};
 return {text:'Use the course materials for this topic. Bloomberg tests are completed on Bloomberg; finance textbooks are supplementary preparation, not the certification itself.',query:id>=19&&[19,31,32,33].includes(id)?'Bloomberg':'Risk'};
}
