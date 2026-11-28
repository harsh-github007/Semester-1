/* Valuation makeup midterm page: day plan, videos, timed problem sets and two 1-hour mocks. */
const PLAN_KEY = 'fsb-makeup-plan', MARK_KEY = 'fsb-makeup-marks';
let planDone = Store.object(PLAN_KEY), marks = Store.object(MARK_KEY);
const esc = escapeHTML;
const setById = id => MAKEUP.sets.find(s => s.id === id);
const allProblems = () => [...MAKEUP.sets.flatMap(s => s.problems), ...MAKEUP.mocks.flatMap(m => m.problems)];
const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

function videoList(id) {
 const set = setById(id);
 const inApp = set.lessons.map(n => `<li><a href="${lessonLink(n)}">In this app: ${esc(RAW[n].title)}</a><small>Three short sketch videos: the idea, a worked example, and the traps.</small></li>`).join('');
 return `<ul class="result-list">${inApp}${MAKEUP.videos[id].map(([t, u, note]) => `<li><a href="${u}" target="_blank" rel="noopener">${esc(t)}</a><small>${esc(note)}</small></li>`).join('')}</ul>`;
}

function renderPlan() {
 const today = todayISO();
 document.getElementById('plan').innerHTML = MAKEUP.plan.map((d, i) => {
  const links = d.mock ? `<a class="btn" href="#mock-${d.mock}">Open ${d.mock === 'M1' ? 'Mock 1' : 'Mock 2'}</a>` : d.sets.map(s => `<a class="btn" href="#set-${s}">Set ${s}</a>`).join('');
  const done = d.tasks.filter((_, j) => planDone[`${i}-${j}`]).length;
  return `<details class="plan-day${d.date === today ? ' today' : ''}" id="day-${i + 1}"${d.date === today ? ' open' : ''}><summary><span class="plan-date">Day ${i + 1} · ${esc(d.label)}${d.date === today ? ' · TODAY' : ''}</span> ${esc(d.title)} <span class="plan-count" data-count="${i}">${done}/${d.tasks.length}</span>${d.timed ? ' <span class="tag-timed">timed</span>' : ''}</summary>
   <ul class="plan-tasks">${d.tasks.map((t, j) => `<li><label><input type="checkbox" data-plan="${i}-${j}"${planDone[`${i}-${j}`] ? ' checked' : ''}> <span>${esc(t)}</span></label></li>`).join('')}</ul>
   ${links ? `<div class="actions">${links}</div>` : ''}</details>`;
 }).join('');
 document.querySelectorAll('[data-plan]').forEach(el => el.addEventListener('change', () => {
  planDone = Store.object(PLAN_KEY); planDone[el.dataset.plan] = el.checked; Store.write(PLAN_KEY, planDone);
  const i = el.dataset.plan.split('-')[0], d = MAKEUP.plan[i];
  document.querySelector(`[data-count="${i}"]`).textContent = `${d.tasks.filter((_, j) => planDone[`${i}-${j}`]).length}/${d.tasks.length}`;
 }));
}

function problemHTML(p, inMock) {
 const m = marks[p.id];
 return `<section class="sheet practice-question makeup-problem" id="p-${p.id}">
  <div class="head"><span class="num">${p.id} · ${p.min} min</span></div>
  <h3>${esc(p.title)}</h3><p class="small">${esc(p.src)}</p>
  <p>${esc(p.q)}</p>
  <div class="actions"><button class="btn" data-timer="${p.id}" data-min="${p.min}">Start ${p.min}-min timer</button><span class="status" data-clock="${p.id}" role="status"></span></div>
  <div class="${inMock ? 'mock-help' : 'practice-help'}">
   <details><summary>Hint</summary><p>${esc(p.hint)}</p></details>
   <details class="solution"><summary>Worked solution</summary><ol class="steps">${p.steps.map(s => `<li><span>${esc(s)}</span></li>`).join('')}</ol><p><strong>Answer:</strong> ${esc(p.answer)}</p></details>
  </div>
  <div class="actions mark-row"><span class="small">How did it go?</span>
   <button class="btn" data-mark="${p.id}" data-val="ok" aria-pressed="${m === 'ok'}">Got it in time</button>
   <button class="btn" data-mark="${p.id}" data-val="slow" aria-pressed="${m === 'slow'}">Right but slow</button>
   <button class="btn" data-mark="${p.id}" data-val="miss" aria-pressed="${m === 'miss'}">Missed</button></div>
 </section>`;
}

function renderSets() {
 document.getElementById('set-links').innerHTML = MAKEUP.sets.map(s => `<a class="btn" href="#set-${s.id}">Set ${s.id}: ${esc(s.week)}</a>`).join('') + MAKEUP.mocks.map(m => `<a class="btn" href="#mock-${m.id}">${m.id === 'M1' ? 'Mock 1' : 'Mock 2'}</a>`).join('');
 document.getElementById('sets').innerHTML = MAKEUP.sets.map(s => `<section class="makeup-set" id="set-${s.id}">
  <h2>Set ${s.id} · ${esc(s.week)}: ${esc(s.title)}</h2>
  <div class="first-idea"><h3>The idea in plain words</h3><p>${esc(s.learn)}</p>
   <details><summary>Formulas you will use (find them on the cheat sheet)</summary><ul>${s.formulas.map(f => `<li>${esc(f)}</li>`).join('')}</ul></details>
   <details><summary>Videos to learn this week (${MAKEUP.videos[s.id].length + s.lessons.length})</summary>${videoList(s.id)}</details></div>
  ${s.problems.map(p => problemHTML(p, false)).join('')}
  <p class="small">Set ${s.id}: ${s.problems.length} problems, ${s.problems.reduce((a, p) => a + p.min, 0)} minutes at exam pace.</p></section>`).join('');
 document.getElementById('mocks').innerHTML = MAKEUP.mocks.map(m => `<section class="makeup-set" id="mock-${m.id}">
  <h2>${esc(m.title)}</h2><p class="small">${esc(m.date)} · ${m.problems.length} questions · ${m.problems.reduce((a, p) => a + p.min, 0)} minutes of questions</p><p>${esc(m.intro)}</p>
  <div class="actions"><button class="btn primary" data-mock="${m.id}">Start 60-minute mock</button><label><input type="checkbox" data-reveal="${m.id}"> Show hints and solutions (after the hour)</label></div>
  <p class="status" data-mockclock="${m.id}" role="status">Solutions stay hidden until you tick the box.</p>
  <div data-mockbody="${m.id}">${m.problems.map(p => problemHTML(p, true)).join('')}</div></section>`).join('');
 document.querySelectorAll('.mock-help').forEach(el => el.hidden = true);
 document.querySelectorAll('[data-reveal]').forEach(el => el.addEventListener('change', () => {
  document.querySelectorAll(`[data-mockbody="${el.dataset.reveal}"] .mock-help`).forEach(h => h.hidden = !el.checked);
 }));
 document.querySelectorAll('[data-mark]').forEach(el => el.addEventListener('click', () => {
  marks = Store.object(MARK_KEY);
  marks[el.dataset.mark] = marks[el.dataset.mark] === el.dataset.val ? null : el.dataset.val;
  Store.write(MARK_KEY, marks);
  document.querySelectorAll(`[data-mark="${el.dataset.mark}"]`).forEach(b => b.setAttribute('aria-pressed', String(marks[el.dataset.mark] === b.dataset.val)));
  summary();
 }));
}

const timers = {};
function countdown(key, seconds, paint, done) {
 clearInterval(timers[key]); const end = Date.now() + seconds * 1000;
 const tick = () => { const left = Math.max(0, Math.ceil((end - Date.now()) / 1000)); paint(left); if (!left) { clearInterval(timers[key]); done(); } };
 timers[key] = setInterval(tick, 1000); tick();
}
const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
function wireTimers() {
 document.querySelectorAll('[data-timer]').forEach(b => b.addEventListener('click', () => {
  const id = b.dataset.timer, out = document.querySelector(`[data-clock="${id}"]`);
  b.textContent = 'Restart timer';
  countdown(id, +b.dataset.min * 60, left => out.textContent = `${fmt(left)} left`, () => out.textContent = 'Time. Write your answer and move on, then check the solution.');
 }));
 document.querySelectorAll('[data-mock]').forEach(b => b.addEventListener('click', () => {
  const id = b.dataset.mock, out = document.querySelector(`[data-mockclock="${id}"]`);
  b.textContent = 'Restart 60-minute mock';
  countdown('mock-' + id, MAKEUP.exam.length * 60, left => out.textContent = `${fmt(left)} left in the mock`, () => out.textContent = 'Time is up. Tick “Show hints and solutions” and mark your paper.');
 }));
}

function summary() {
 const ps = allProblems(), count = v => ps.filter(p => marks[p.id] === v).length;
 const missed = ps.filter(p => marks[p.id] === 'miss' || marks[p.id] === 'slow');
 document.getElementById('summary').innerHTML = `<p><strong>${count('ok')}</strong> got in time · <strong>${count('slow')}</strong> right but slow · <strong>${count('miss')}</strong> missed · ${ps.length - count('ok') - count('slow') - count('miss')} not tried yet.</p>` +
  (missed.length ? `<p>Redo these, timed:</p><div class="actions">${missed.map(p => `<a class="btn" href="#p-${p.id}">${p.id}</a>`).join('')}</div>` : '<p class="small">Problems you mark “missed” or “slow” collect here for your timed redo days.</p>');
}

function countdownToMocks() {
 const t = todayISO(), first = MAKEUP.plan[0].date, last = MAKEUP.plan[MAKEUP.plan.length - 1].date;
 const el = document.getElementById('where');
 if (t < first) el.textContent = `The plan starts ${MAKEUP.plan[0].label}.`;
 else if (t > last) el.textContent = 'The plan has ended. Good luck on the exam.';
 else { const i = MAKEUP.plan.findIndex(d => d.date === t); el.innerHTML = `Today is <a href="#day-${i + 1}">Day ${i + 1}: ${esc(MAKEUP.plan[i].title)}</a>.`; }
}

renderPlan(); renderSets(); wireTimers(); summary(); countdownToMocks();
document.getElementById('practice-mode').onchange = e => document.querySelectorAll('.practice-help').forEach(el => el.hidden = e.target.value === 'exam');
document.getElementById('print').onclick = () => window.print();
