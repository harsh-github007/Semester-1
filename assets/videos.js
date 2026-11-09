/* ---------- extra lesson videos ----------
   Every class gets three short videos in the same player:
   1. The idea      (the hand-made sketch in lessons.js)
   2. Worked example (built from the class's worked example, one step per scene)
   3. Avoid the traps (built from the class's common traps)
   Each video is {name, caps, draw()} where draw() returns [[step or [from,to], svg], ...]. */
const VID_W=640;
const vtxt=s=>String(s).replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
const vesc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function vwrap(s,max){const out=[];let line='';for(const w of s.split(' ')){if(line&&(line+' '+w).length>max){out.push(line);line=w}else line=line?line+' '+w:w}if(line)out.push(line);return out}
const vcut=(s,max)=>s.length>max?s.slice(0,max-1).trimEnd()+'…':s;
// A text block: wrapped lines starting at (x,y). Returns svg and the height used.
function vlines(x,y,s,max,size,cls='',lh=1.4){const ls=vwrap(s,max);return{h:ls.length*size*lh,svg:`<text x="${x}" y="${y}" class="${cls}" style="font-size:${size}px">${ls.map((l,i)=>`<tspan x="${x}" dy="${i?size*lh:0}">${vesc(l)}</tspan>`).join('')}</text>`}}
// Fit a block of text into a card: shrink the font until it fits.
function vcard(x,y,w,h,s,cls,box){let size=26;let b;for(;size>=13;size--){b=vlines(x+22,0,s,Math.floor((w-44)/(size*0.52)),size,cls);if(b.h<=h-40)break}
 const top=y+(h-b.h)/2+size*0.8;return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" class="${box}"/>`+b.svg.replace(/ y="0"/,` y="${top.toFixed(1)}"`)}

function exampleVideo(c){const q=vtxt(c.ex.q),steps=c.ex.steps.map(vtxt),a=vtxt(c.ex.a),n=steps.length,last=n+1;
 const caps=['The question. Pause and try it yourself first: '+q,...steps.map((s,j)=>`Step ${j+1}: ${s}`),'Answer: '+a];
 const draw=()=>{const it=[];
  it.push([[0,last],`<text x="24" y="30" class="tm">WORKED EXAMPLE · ${vesc(vcut(c.title,60).toUpperCase())}</text>`]);
  it.push([[0,0],`<text x="24" y="74" class="big">The question</text><text x="24" y="98" class="tm">Pause here and try it on paper.</text>`+vcard(24,116,592,196,q,'','fs')]);
  steps.forEach((s,j)=>{const y=60+j*22;
   it.push([[j+2,last],`<g><circle cx="34" cy="${y-5}" r="8" class="fg"/><text x="34" y="${y-1}" text-anchor="middle" style="font-size:11px;fill:var(--sheet)">✓</text><text x="50" y="${y}" class="tm">${vesc(vcut(s,86))}</text></g>`]);
   it.push([[j+1,j+1],`<text x="24" y="${60+n*22+18}" class="tb" style="font-weight:700">Step ${j+1} of ${n}</text>`+vcard(24,60+n*22+30,592,330-(60+n*22+30),s,'','fs')])});
  it.push([[last,last],vcard(24,60+n*22+14,592,330-(60+n*22+14),'Answer: '+a,'','fsoftg')+`<text x="616" y="${60+n*22+4}" text-anchor="end" class="tg" style="font-weight:700">✓ Done</text>`]);
  return it};
 return{name:'Worked example',short:'Example',caps,draw}}

function trapsVideo(c){const traps=c.traps.map(vtxt),n=traps.length,last=n+1;
 const caps=[`${n} traps where students lose marks on ${c.title.toLowerCase()}. Spot them before the exam.`,...traps.map((t,j)=>`Trap ${j+1}: ${t}`),'Recap. Before the exam, check: '+traps.map((t,j)=>`${j+1}) ${t}`).join(' ')];
 const draw=()=>{const it=[];
  it.push([[0,last],`<text x="24" y="30" class="tm">AVOID THE TRAPS · ${vesc(vcut(c.title,60).toUpperCase())}</text>`]);
  it.push([[0,0],`<text x="320" y="130" text-anchor="middle" class="big" style="font-size:34px">${n} common traps</text><text x="320" y="166" text-anchor="middle" class="tm" style="font-size:16px">where marks are lost in ${vesc(vcut(c.title,48))}</text>`+
   traps.map((_,j)=>`<g><circle cx="${320+(j-(n-1)/2)*60}" cy="230" r="20" class="fsoftp"/><text x="${320+(j-(n-1)/2)*60}" y="237" text-anchor="middle" class="tp big" style="font-size:20px">${j+1}</text></g>`).join('')]);
  traps.forEach((t,j)=>{it.push([[j+1,j+1],`<g><circle cx="52" cy="92" r="24" class="fsoftp"/><text x="52" y="101" text-anchor="middle" class="tp big" style="font-size:26px">✗</text><text x="90" y="88" class="tp big">Trap ${j+1} of ${n}</text><text x="90" y="110" class="tm">Read it, then say how you would avoid it.</text></g>`+vcard(24,132,592,180,t,'','fs')])});
  it.push([[last,last],`<text x="24" y="74" class="big">Before the exam, check:</text>`+traps.map((t,j)=>{const b=vlines(58,0,vcut(t,150),76,14);const y=104+j*(208/n);return `<g><circle cx="36" cy="${y-5}" r="9" class="fg"/><text x="36" y="${y-1}" text-anchor="middle" style="font-size:11px;fill:var(--sheet)">✓</text>${b.svg.replace(/ y="0"/,` y="${y}"`)}</g>`}).join('')]);
  return it};
 return{name:'Avoid the traps',short:'Traps',caps,draw}}

function lessonVideos(c){return[{name:'The idea',short:'Idea',caps:c.sketch.caps,draw:c.sketch.draw},exampleVideo(c),trapsVideo(c)]}
