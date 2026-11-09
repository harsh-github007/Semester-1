/* Full teaching sequence, assembled from the same vetted lesson and beginner sources.
   Each scene has its own narration and either a sketch frame or a readable teaching board. */
const LESSON_CONTEXT=[
 ['Compare money on different dates','Before adding two amounts, move them to the same date. Discounting reverses the growth that could have happened in between.'],
 ['Understand what an interest quote actually promises','A percentage is incomplete without its time period and compounding rule. Convert those first so two rates describe the same growth.'],
 ['Follow where each loan payment goes','A payment first covers interest on the remaining balance. Only the rest reduces what you owe; default and prepayment change the promised cash flows.'],
 ['Turn a bond into a list of dated payments','Separate the coupons from the principal repayment. Price each at its own date before adding them; a coupon rate is not a market discount rate.'],
 ['Know what you are agreeing to buy or sell','First identify the underlying item, the date, and which side you take. An obligation and a right are different contracts, even when they refer to the same item.'],
 ['Explain a future purchase price without guessing the future','Build the same future delivery using a purchase today and a loan. Matching deliveries should have matching costs under the stated trading assumptions.'],
 ['See why a futures trade can need cash every day','A price move creates trading profit or loss, while a margin deposit moves your own cash into collateral. Keeping those two things separate explains a margin call.'],
 ['Translate rates into future borrowing costs and price sensitivity','A forward rate links two dated discount factors. Duration then estimates the first-order effect of a yield change; neither is a guaranteed forecast.'],
 ['Understand why two parties exchange payment streams','Write both payment schedules using the same dates and notional. Compare their present values to find the fixed rate or the value of an existing swap.'],
 ['Tell ordinary variation from a bad tail outcome','Standard deviation describes dispersion. A loss percentile and an average tail loss answer different questions about bad outcomes.'],
 ['Create simulated outcomes without confusing them with certainty','Start with simple independent draws, then specify how they should move together. More draws reduce sampling noise but cannot repair the wrong model.'],
 ['Separate predictable drift from unpredictable shocks','Choose the time step before computing anything. Drift grows with elapsed time, whereas a Brownian shock scales with the square root of time.'],
 ['Understand which risk earns a reward in the model','Diversification can remove some company-specific risk. CAPM connects required return to market exposure rather than to every source of uncertainty.'],
 ['Break credit losses into their ingredients','Ask whether default happens, what amount is exposed, and how much is recovered. Probability, exposure and loss severity have different units.'],
 ['Trace a loss through the repayment order','Imagine a queue for absorbing losses. Junior protection is used up before a more senior layer takes a loss; slicing a pool does not erase its total risk.'],
 ['Price an option by working backward','Begin with the option payoff at the end, where the stock price is known at each node. Then use a replicating or risk-neutral calculation to move back one step at a time.'],
 ['Connect an option price to a hedge and its assumptions','The model prices a contingent payment under specific assumptions. Greeks describe local sensitivities; the formula is not a promise that markets follow those assumptions.'],
 ['Read what different option prices imply','An implied volatility is a model input backed out from a price. Different values across strikes reveal limits of a constant-volatility description.'],
 ['Recognize the value of a choice in a business decision','The ability to wait, expand or walk away changes the future payoff. Value the choices and the timing rather than treating every future commitment as compulsory.'],
 ['Separate study preparation from the actual certification','The app can explain market concepts and help you revise. Your assigned Bloomberg modules, official assessments and recorded completion are separate tasks in the official portal.'],
 ['Choose the direction and size of a futures hedge','Start with the exposure you already have. The hedge should offset its adverse price move; the number of contracts depends on units and contract size.'],
 ['Build an option strategy one contract at a time','Calculate each contract’s terminal payoff, add the positions with their correct signs, then subtract the net premium to find simple profit.'],
 ['Understand what the investor actually holds','An ETF share, a futures exposure and a directly held asset have different cash-flow and funding mechanics. Start with the investment objective before comparing products.'],
 ['Decide whether a project pays for the resources it uses','Put all cash flows on a timeline. NPV measures value above the required return; IRR is the rate that makes that value exactly zero.'],
 ['Match an obligation with assets that can fund it','The question is not only whether assets are valuable today. Their value and cash-flow timing must respond appropriately when the liability or interest rates change.'],
 ['Identify the price and currency behind an exposure','Write down what will be received or paid and in which units. A hedge can reduce one price risk while leaving basis, timing or quantity risk.'],
 ['Know what a hedge cancels and what it leaves','A delta hedge offsets the first-order stock-price effect at the current point. Gamma, volatility changes and time mean the hedge still needs attention.'],
 ['Ask what happens if the other side cannot pay','A positive contract value can become a credit exposure. Collateral and netting can reduce it, but their effectiveness depends on the agreement and timing.'],
 ['Follow a failure from its cause to its control','People, systems and processes can fail even when a market model is correct. A useful control has an owner, a trigger and evidence that it works.'],
 ['Distinguish absorbing losses from making payments on time','Capital is a cushion against losses. Liquidity is the ability to meet cash outflows. A bank can face a problem in one even when the other appears adequate.'],
 ['Choose probabilities that match the question','Forecasting outcomes and pricing tradable claims are different tasks. Name the probability measure and the risk drivers before interpreting a result.'],
 ['Read an economic release against expectations','A headline can improve from last month yet disappoint the market. Compare the actual release with both the previous number and the forecast.'],
 ['Read a currency quote without reversing the trade','Always say the units out loud: how many units of the quote currency buy one unit of the base currency? Then translate a quote change into the cost of your payment.'],
 ['Connect fixed payments with changing market yields','A bond’s promised coupon does not change just because the market asks for a different return. Its price adjusts, and yield-curve comparisons must use consistent dates.'],
 ['Connect a share price with the business claim','A share is a residual ownership claim. Multiples compare price with accounting or cash-flow quantities, so check the denominator and future expectations before drawing a conclusion.']
];
function lessonText(value){return String(value).replace(/<br\s*\/?>|<\/(?:p|li)>/gi,'\n').replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ').replace(/&#39;/g,"'").trim();}
function buildGuidedLesson(c,b,beginner=BEGINNER){
 const [goal,why]=LESSON_CONTEXT[c.id];const frames=[];
 const add=(chapter,title,text,visual,extra={})=>frames.push({chapter,title,text:lessonText(text),visual:lessonText(visual||title),...extra});
 add('Start here','What are we trying to understand?',`In this lesson, we will ${goal.toLowerCase()}. ${why} We will start with an everyday situation, explain the vocabulary, walk through the diagram, and solve an example together.`,goal);
 add('Start here','Picture this situation',b.story,b.story);
 for(const id of b.prerequisites.slice(0,2))add('Start here','One useful idea to bring with you',`Before we continue: ${beginner[id].words} ${beginner[id].story}`,beginner[id].story,{prerequisite:id});
 const words=(lessonText(b.words).match(/.*?[.!?](?:\s+|$)|.+$/g)||[]).map(s=>s.trim()).filter(Boolean);
 words.forEach((text,i)=>add('Understand','Words before formulas',text,words.length>1?`Definition ${i+1} of ${words.length}\n${text}`:text));
 const paragraphs=lessonText(c.plain).split(/\n+/).map(s=>s.trim()).filter(Boolean);
 paragraphs.forEach((text,i)=>add('Understand',i===0?'Why the idea works':'Build the idea, one part at a time',text,text));
 c.sketch.caps.forEach((text,i)=>add('See it','Follow the picture',text,text,{sketch:i}));
 add('Work it through','Name the quantities first',`Now connect the idea to the notation. ${c.legend} Keep the units and the dates consistent as we use the formula.`,c.formula);
 add('Work it through','Read the question before calculating',`Here is the example we will solve. ${c.ex.q} Before looking at the working, identify what is given and what we need to find.`,c.ex.q,{pause:true,prompt:'Pause and write down the known quantities. Press Play when you are ready.'});
 c.ex.steps.forEach((text,i)=>add('Work it through',`Worked example: step ${i+1}`,`Step ${i+1}. ${text}`,text));
 add('Work it through','What does the answer mean?',`${c.ex.a} ${why} Check that your result uses the same units and timing as the question.`,c.ex.a);
 c.traps.forEach(text=>add('Avoid a mistake','A mistake to watch for',`Watch for this mistake: ${text}`,text));
 add('Try it','Your turn: explain before answering',`${b.question} Think about the reason before choosing an answer. Playback will wait here.`,b.question,{checkpoint:true,pause:true,prompt:'Choose an answer below. Nothing is graded or saved from this checkpoint.'});
 add('Recap','The idea to take away',`${why} ${b.why} Next, try the worked example on paper without looking, then use the practice questions to check your understanding.`,why);
 return frames;
}
