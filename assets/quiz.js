/* Instant-feedback multiple-choice warm-ups. Answers are saved on this browser only. */
const QUIZ_KEY='fsb-bmc-quiz';
let chosen=Store.object(QUIZ_KEY);
const quizRoot=document.getElementById('quiz');
document.getElementById('topic-links').innerHTML=BMC_QUIZ.map((t,ti)=>`<a href="#topic-${ti}">${escapeHTML(t.topic)}</a>`).join('');
quizRoot.innerHTML=BMC_QUIZ.map((t,ti)=>`<section class="sheet quiz-topic" id="topic-${ti}"><div class="head"><span class="num">Topic ${ti+1} of ${BMC_QUIZ.length} · ${t.questions.length} questions</span></div><h2>${escapeHTML(t.topic)}</h2><p class="small">Stuck? <a href="${lessonLink(t.lesson)}">Read the ${escapeHTML(t.topic)} lesson first</a>.</p><p class="quiz-score" id="score-${ti}" role="status"></p>${t.questions.map(([q,options],qi)=>`<fieldset class="quiz-q" data-key="${ti}-${qi}"><legend><span class="quiz-n">${qi+1}.</span> ${escapeHTML(q)}</legend>${options.map((o,oi)=>`<label><input type="radio" name="q-${ti}-${qi}" value="${oi}"> ${escapeHTML(o)}</label>`).join('')}<p class="quiz-why" role="status" hidden></p></fieldset>`).join('')}<div class="actions"><button class="btn" data-reset="${ti}">Try this topic again</button></div></section>`).join('');
function paint(){
 let ready=0;
 BMC_QUIZ.forEach((t,ti)=>{
  let answered=0,right=0;
  t.questions.forEach(([,,answer,why],qi)=>{
   const key=`${ti}-${qi}`,box=quizRoot.querySelector(`[data-key="${key}"]`),out=box.querySelector('.quiz-why'),pick=chosen[key];
   box.querySelectorAll('input').forEach(input=>{input.checked=Number(input.value)===pick;input.disabled=Number.isInteger(pick);input.parentElement.dataset.state=!Number.isInteger(pick)?'':Number(input.value)===answer?'right':Number(input.value)===pick?'wrong':'';});
   if(Number.isInteger(pick)){answered++;if(pick===answer)right++;out.hidden=false;out.textContent=(pick===answer?'Correct. ':`Not quite. The answer is “${t.questions[qi][1][answer]}”. `)+why;out.dataset.correct=pick===answer;}else{out.hidden=true;out.textContent='';}
  });
  const pct=Math.round(100*right/t.questions.length);
  if(answered===t.questions.length&&pct>=70)ready++;
  document.getElementById(`score-${ti}`).textContent=answered===0?'Not started.':answered<t.questions.length?`${right} of ${answered} answered so far are correct.`:`Score: ${right} / ${t.questions.length} (${pct}%). ${pct>=70?'You are above the 70% line. Now take the real Bloomberg test for this topic.':'Below 70%. Read the lesson again, then retry.'}`;
 });
 document.getElementById('quiz-total').textContent=`${ready} of ${BMC_QUIZ.length} topics practised at 70% or more.`;
}
quizRoot.addEventListener('change',e=>{const input=e.target.closest('input[type=radio]');if(!input)return;const key=input.closest('[data-key]').dataset.key;chosen=Store.object(QUIZ_KEY);chosen[key]=Number(input.value);Store.write(QUIZ_KEY,chosen);paint();});
quizRoot.addEventListener('click',e=>{const btn=e.target.closest('[data-reset]');if(!btn)return;const ti=btn.dataset.reset;chosen=Store.object(QUIZ_KEY);Object.keys(chosen).filter(k=>k.startsWith(ti+'-')).forEach(k=>delete chosen[k]);Store.write(QUIZ_KEY,chosen);paint();document.getElementById('topic-'+ti).scrollIntoView({behavior:'smooth'});});
paint();
