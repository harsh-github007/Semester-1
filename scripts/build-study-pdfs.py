#!/usr/bin/env python3
"""Rebuild print editions from `node scripts/export-study.cjs` output.
Requires reportlab, pypdf and a Unicode TrueType font. No network requests.
"""
import argparse, html, json, math, os, re, shutil
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, KeepTogether, Flowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader, PdfWriter
ROOT=Path(__file__).resolve().parent.parent
parser=argparse.ArgumentParser();parser.add_argument('--data',default=str(ROOT.parent/'work/pdf-build/content.json'));parser.add_argument('--output',default=str(ROOT/'pdf'));parser.add_argument('--font');args=parser.parse_args()
font=args.font or os.environ.get('STUDY_PDF_FONT') or str(Path.home()/'.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/poppler/fonts/DejaVuSans.ttf')
pdfmetrics.registerFont(TTFont('Study',font));pdfmetrics.registerFontFamily('Study',normal='Study',bold='Study',italic='Study',boldItalic='Study')
D=json.loads(Path(args.data).read_text());OUT=Path(args.output);OUT.mkdir(parents=True,exist_ok=True)
NAVY=colors.HexColor('#16223a');BLUE=colors.HexColor('#2457d6');MUT=colors.HexColor('#52617a');LINE=colors.HexColor('#d6deeb')
styles={
 'title':ParagraphStyle('title',fontName='Study',fontSize=28,leading=35,textColor=NAVY,spaceAfter=22),
 'h1':ParagraphStyle('h1',fontName='Study',fontSize=20,leading=26,textColor=NAVY,spaceAfter=15,keepWithNext=True),
 'h2':ParagraphStyle('h2',fontName='Study',fontSize=13,leading=18,textColor=BLUE,spaceBefore=15,spaceAfter=7,keepWithNext=True),
 'body':ParagraphStyle('body',fontName='Study',fontSize=10,leading=15,textColor=NAVY,spaceAfter=8),
 'small':ParagraphStyle('small',fontName='Study',fontSize=8.2,leading=12,textColor=MUT,spaceAfter=7),
 'formula':ParagraphStyle('formula',fontName='Study',fontSize=10,leading=17,textColor=NAVY,backColor=colors.HexColor('#f1f5fc'),borderPadding=8,spaceBefore=8,spaceAfter=14),
}
def clean(x):
 s=str(x).replace('−','-').replace('–','-').replace('—','-').replace('\u2011','-').replace('\u00a0',' ')
 s=re.sub(r'<\s*(?:br\s*/?|/p|/li|/div|/tr)\s*>','\n',s,flags=re.I)
 s=re.sub('<[^>]*>','',s);return html.unescape(s).strip()
def p(x,style='body'):
 return Paragraph(html.escape(clean(x)).replace('\n','<br/>'),styles[style])
def section(story,name): story.append(p(name,'h2'))
def lines(story,items):
 for i,t in enumerate(items,1): story.append(p(f'{i}. {clean(t)}'))
def footer(c,doc):
 c.saveState();c.setStrokeColor(LINE);c.line(44,39,568,39);c.setFont('Study',7.5);c.setFillColor(MUT);c.drawString(44,26,'Finals Sketchbook | Updated November 1, 2026 | Original study aid');c.drawRightString(568,26,str(doc.page));c.restoreState()
def write(name,story):
 dest=OUT/name;doc=SimpleDocTemplate(str(dest),pagesize=(612,792),rightMargin=44,leftMargin=44,topMargin=45,bottomMargin=55,title=name[:-4],author='Finals Sketchbook',pageCompression=1);doc.build(story,onFirstPage=footer,onLaterPages=footer);print(name,len(PdfReader(dest).pages),'pages');return dest
class Bars(Flowable):
 def __init__(self,rows): super().__init__();self.rows=rows;self.width=510;self.height=28*len(rows)+14
 def draw(self):
  c=self.canv;maxv=max(abs(v) for _,v in self.rows) or 1
  for i,(label,value) in enumerate(self.rows):
   y=self.height-28*(i+1);c.setFont('Study',8);c.setFillColor(NAVY);c.drawString(0,y+4,label);c.setFillColor(BLUE if value>=0 else colors.HexColor('#b14334'));c.rect(145,y,260*abs(value)/maxv,15,fill=1,stroke=0);c.setFillColor(NAVY);c.drawRightString(510,y+4,f'{value:,.2f}')
LABS={
 'pv':dict(title='Move money through time',ids=[0,1],story='A promised $121 arrives in two years. The annual rate is 10%. Move it backward one year at a time.',rows=[('Today',100),('Year 1',110),('Year 2',121)],tasks=['Predict: should today’s value be greater or smaller than $121?','Compute PV for rates 0%, 5% and 10%. Keep the two-year date fixed.'],answer='PV = 121/(1+r)^2: $121.00 at 0%, $109.75 at 5%, $100.00 at 10%. A higher discount rate lowers PV. Check: $100 × 1.1 × 1.1 = $121.',assumptions='Known future payment; annual compounding; same rate for both years.'),
 'options':dict(title='Keep option payoff and profit separate',ids=[4,21],story='Buy a call on one share with strike $100 and premium $8. Ignore financing of the premium.',rows=[('S=90 profit',-8),('S=100 profit',-8),('S=105 profit',-3),('S=108 profit',0),('S=120 profit',12)],tasks=['At a final stock price of $105, would you exercise? Would the whole trade make money?','Change the premium to $12. Find the new break-even stock price.'],answer='At $105 exercise gives a $5 payoff, but profit = $5 - $8 = -$3. Exercising is better than letting the call expire; it does not recover the premium. Break-even is strike + premium: $108 initially and $112 after the change.',assumptions='European call held to expiry; one share; no fees, taxes or interest on the premium.'),
 'forward':dict(title='Rebuild a forward from stock and debt',ids=[5],story='Buy a $100 share using a loan at 5% continuously compounded. It pays $2 in six months. Deliver the share after one year.',rows=[('Loan today',100),('Dividend at 0.5y',2),('Debt at delivery',103.0764794)],tasks=['Predict: does a dividend raise or lower the fair delivery price?','Grow the loan to six months, subtract the dividend, then grow the remaining debt to one year.'],answer='Debt after dividend = 100 exp(0.025) - 2 = $100.5315. At delivery it is 100.5315 exp(0.025) = $103.0765. Without the dividend it would be $105.1271. The dividend lowers the debt you must recover.',assumptions='Known dividend; equal borrowing/lending rates; frictionless replication. A forward delivery price is not the current value of an existing forward.'),
 'futures':dict(title='Keep a daily futures ledger',ids=[6,20],story='Go long 100 units at quote 100. Deposit $1,000 initial margin. Maintenance is $750. Settlement quotes are 98 and 96.',rows=[('Initial deposit',1000),('Day 1 balance',800),('Day 2 before call',600),('Day 2 top-up',400)],tasks=['Compute daily trading P/L, then check the maintenance threshold.','After restoring initial margin, did the $400 trading loss disappear? Repeat for a short position.'],answer='Long: daily P/L is -$200 then -$200. Day 1 balance $800 needs no top-up. Day 2 balance $600 triggers a $400 deposit to restore $1,000. Total deposits $1,400 plus cumulative loss -$400 = balance $1,000. Short: daily gains $200 and $200, final balance $1,400, no calls.',assumptions='No interest, fees or withdrawals. A call occurs strictly below maintenance and restores initial margin.'),
 'npv':dict(title='Find the rate at which a project breaks even',ids=[23],story='Pay $1,000 now and receive $300 at each year-end for five years. Discount at 8%.',rows=[('Today cost',-1000)]+[(f'Year {t} cash PV',300/1.08**t) for t in range(1,6)],tasks=['Compute the PV of each future payment and subtract the initial cost.','Raise the rate to 20%. What changes? What happens for a one-year cost of $100 and payment of $100 or $50?'],answer='At 8%, PV of inflows = $1,197.81 and NPV = +$197.81. At 20%, NPV = -$102.82. The five-year project’s IRR is approximately 15.2382%. The one-year examples have IRRs of 0% and -50%, respectively. Zero NPV means exactly earning the required rate; a negative IRR is a valid losing return.',assumptions='Equal end-year payments, one initial outflow, positive later inflows. This cash-flow pattern has a unique IRR greater than -100%; more complex patterns can behave differently.'),
 'bond':dict(title='Change the yield while coupons stay fixed',ids=[3],story='A bond pays a $50 coupon annually for five years and repays $1,000 with its final coupon.',rows=[('Price at yield 3%',sum(50/1.03**t for t in range(1,6))+1000/1.03**5),('Price at yield 5%',1000),('Price at yield 7%',sum(50/1.07**t for t in range(1,6))+1000/1.07**5)],tasks=['Predict the price relative to face value when yield equals the 5% coupon rate.','At 7%, discount all five coupons and the $1,000 principal. Explain why the price falls.'],answer='Prices are $1,091.59 at 3%, $1,000.00 at 5%, and $918.00 at 7%. Higher yield discounts the unchanged cash flows more heavily. The last payment is $1,050, not just the $50 coupon.',assumptions='Annual coupons, flat yield, no default, valuation immediately after a coupon date.'),
 'capm':dict(title='Build the required return from two pieces',ids=[12],story='The risk-free rate is 4%; the expected market return is 9%. The market risk premium is 5 percentage points.',rows=[('Beta 0 return',4),('Beta 0.5 return',6.5),('Beta 1 return',9),('Beta 1.2 return',10),('Beta 2 return',14)],tasks=['Calculate required returns for beta 0, 1 and 1.2.','Does beta 0 mean the stock has no risk of its own?'],answer='E[R] = 4% + beta × (9% - 4%). Returns are 4%, 9% and 10% for beta 0, 1 and 1.2. Beta 0 means zero covariance with the market in this model, not zero total risk. Diversifiable company-specific risk can still exist.',assumptions='One-period CAPM with specified inputs. Expected returns are not guaranteed realized returns.')
}
def cover(story,title,desc):
 story.extend([Spacer(1,45),p(title,'title'),p('Updated November 1, 2026','h2'),p(desc),Spacer(1,15),p('How to use this edition','h2'),p('Read the everyday idea first. Define the words. Work through the example with your calculator. Attempt the check or question on paper before reading its explanation. Then change an input and explain what changes.'),p('The web app adds narration, sliders, saved answers and timers. This edition includes paper experiments with predictions, calculations and explanations. It does not contain your personal browser notes.','small'),p('Original study aid based on the supplied course materials. Final scope and assessment instructions may change. Risk uses reports/presentations in the supplied syllabus; Bloomberg certification is completed in its official portal.','small'),PageBreak()])
def lesson(story,i,num):
 c=D['lessons'][i];b=D['beginner'][i]
 story.extend([p(f'Lesson {num}: {c["title"]}','h1'),p(c['one']),p('Start with an everyday idea','h2'),p(b['story']),p('Words you need','h2'),p(b['words'])])
 if b['prerequisites']: story.append(p('Helpful earlier topics: '+', '.join(D['lessons'][n]['title'] for n in b['prerequisites']),'small'))
 section(story,'Build the explanation');story.append(p(c['plain']))
 section(story,'Formula and units');story.append(p(c['formula'],'formula'));story.append(p(c['legend'],'small'))
 section(story,'Walk through the sketch');lines(story,c['sketch']['caps'])
 section(story,'Worked example');story.append(p(c['ex']['q']));lines(story,c['ex']['steps']);story.append(p(c['ex']['a'],'formula'))
 section(story,'Common mistakes');lines(story,c['traps'])
 section(story,'Try before checking');story.append(p(b['question']));lines(story,b['options']);story.append(p('Write your reasoning: ___________________________________________________'));story.append(p('The answer and explanation are in the lesson-check answers section.','small'))
 if c.get('files'): story.append(p('Reading trail: '+ '; '.join(Path(f).name for f in c['files']),'small'))
 story.append(PageBreak())
def labs(story,ids):
 selected=[v for v in LABS.values() if any(i in ids for i in v['ids'])]
 for v in selected:
  story.extend([p('Paper lab: '+v['title'],'h1'),p(v['story']),Bars(v['rows']),Spacer(1,16)])
  section(story,'Predict and try');lines(story,v['tasks']);story.extend([Spacer(1,30),p('Compare with the explanation','h2'),p(v['answer']),p('Model assumptions: '+v['assumptions'],'small'),PageBreak()])
def practice(story,qs,title,mock=False):
 story.extend([p(title,'h1'),p(f'{len(qs)} questions | {sum(q["points"] for q in qs)} points | '+('120 minutes suggested practice time.' if mock else 'Learn at your own pace.'))])
 story.append(p('Original practice, not an official final or a prediction of exam scope. Confirm current course rules. Questions come first; worked solutions and marking guides follow all questions. The suggested time and point weights for mock finals are study choices.','small'))
 for n,q in enumerate(qs,1): story.append(p(f'{n}. {q["title"]} ({q["points"]} points)'))
 story.append(PageBreak())
 for n,q in enumerate(qs,1):
  story.extend([p(f'Question {n}: {q["title"]}','h1'),p(f'{q["points"]} points | {q["source"]}','small'),p(q['question']),p('Show your setup, units, calculation and interpretation.','h2')])
  for _ in range(8): story.append(p('____________________________________________________________________','small'));story.append(Spacer(1,12))
  story.append(PageBreak())
 for n,q in enumerate(qs,1):
  story.extend([p(f'Solution {n}: {q["title"]}','h1'),p('First, the words','h2'),p(q['words']),p('A smaller problem first','h2'),p(q['warmup']),p('Hint','h2'),p(q['hint']),p('Work through it','h2')]);lines(story,q['steps']);section(story,'Mark your reasoning');lines(story,q['rubric']);story.extend([p(q['reading'],'small'),p(f'My mark: ____ / {q["points"]}. My next correction: ____________________','small'),PageBreak()])
def quiz(story):
 story.extend([p('Bloomberg: original warm-up practice','h1'),p('These 32 questions and four cases are original learning aids. They were not copied from real BMC tests. No official BMC assessment questions were supplied. This practice neither counts toward certification nor predicts your official score.'),p('Complete the assigned modules and assessments in the Bloomberg for Education portal. Follow the requirements supplied for your NYU class, and verify any changes with your instructor.','small'),PageBreak()])
 for topic in D['quiz']:
  story.append(p(topic['topic']+' - try first','h1'))
  for n,(q,opts,ans,why) in enumerate(topic['questions'],1):
   story.append(KeepTogether([p(f'{n}. {q}'),p('   '.join(f'{chr(65+j)}. {x}' for j,x in enumerate(opts)),'small'),Spacer(1,7)]))
  story.append(PageBreak());story.append(p(topic['topic']+' - explanations','h1'))
  for n,(q,opts,ans,why) in enumerate(topic['questions'],1):story.append(p(f'{n}. {opts[ans]}. {why}'))
  story.append(PageBreak())
 for case in D['cases']:
  story.extend([p('Market case: '+case['title'],'h1'),p(case['story'])]);lines(story,case['questions']);story.extend([Spacer(1,45),p('Work through the explanation','h2')]);lines(story,case['steps']);story.append(PageBreak())
paths=[]
for key in ['derivatives','valuation','risk-management','bloomberg']:
 subject=D['configs'][key]['SUBJECTS'][0][0];ids=D['configs'][key]['SUBJECTS'][0][1];story=[]
 cover(story,subject+' Sketchbook','A beginner-first print companion: explanations, vocabulary, formulas, worked examples, checks, and the practice relevant to this subject.')
 story.append(p('Your reading path','h1'))
 for n,i in enumerate(ids,1):story.append(p(f'{n}. {D["lessons"][i]["title"]}'))
 story.extend([p('Then: paper labs where available, lesson-check answers, and subject practice.','small'),PageBreak()])
 for n,i in enumerate(ids,1):lesson(story,i,n)
 labs(story,ids);story.append(p('Lesson-check answers','h1'))
 for n,i in enumerate(ids,1):
  b=D['beginner'][i];story.append(p(f'{n}. {D["lessons"][i]["title"]}','h2'));story.append(p(f'Answer: {b["options"][b["answer"]]}. {b["why"]}'))
 story.append(PageBreak())
 if key in D['practice']:practice(story,D['practice'][key],subject+' midterm-style practice')
 if key in D['mocks']:practice(story,D['mocks'][key],subject+' mock final',True)
 if key=='bloomberg':quiz(story)
 if key=='risk-management':
  story.extend([p('Prepare a risk report, not a guessed final exam','h1'),p('The supplied FRE 6123 syllabus assigns 40% to team assignments and 30% each to two individual report/presentation assignments. The RMN lecture decks were absent from the supplied pack; these notes are foundations, not substitutes for those decks.'),p('A report rehearsal','h2')]);lines(story,['Choose one clearly bounded risk exposure and decision-maker.','State the data source, period, units and key assumptions.','Explain one suitable risk measure and compute a small transparent example.','Stress an assumption, discuss limitations and propose a response.','Prepare a short presentation where every chart answers a decision question. Follow the instructor’s actual assignment brief.'])
 if isinstance(story[-1],PageBreak):story.pop()
 paths.append(write(subject+' Sketchbook.pdf',story))
for key in ['valuation','derivatives']:
 story=[];cover(story,key.title()+' Mock Final','Eight original syllabus-based questions, 100 points, suggested 120 minutes. Questions and writing space precede separate worked solutions, beginner warm-ups and marking guides.');practice(story,D['mocks'][key],key.title()+' mock final',True)
 if isinstance(story[-1],PageBreak):story.pop()
 write(key.title()+' Mock Final.pdf',story)
w=PdfWriter()
for path in paths:w.append(path,outline_item=path.stem)
w.add_metadata({'/Title':'Finals Sketchbook - All Subjects','/Author':'Finals Sketchbook','/Subject':'Updated November 1, 2026: beginner lessons, paper labs, checks and original practice'})
combined=OUT/'Finals Sketchbook - All Subjects.pdf'
with combined.open('wb') as f:w.write(f)
print(combined.name,len(PdfReader(combined).pages),'pages')
