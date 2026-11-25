/* Original final-exam practice for Hull Ch 11, 13, 14, 15 and 19 (scope from Ansh, Nov 25 2026).
   Two papers in the Oct 17 midterm format (5 questions × 8 points, 2 hours), pitched harder. Not an official exam. */
const CHAPTER_FINAL = {
 "A": [
  {
   "title": "Catch a call priced below its floor",
   "points": 8,
   "lesson": 35,
   "source": "Hull Ch 11 · Properties of stock options. Harder than the Oct 17 midterm: several linked parts and one twist.",
   "words": "A lower bound is the least an option can cost without free money. A dividend paid before expiry belongs to the shareholder, not the call holder, so it lowers the call's floor. Shorting a stock means you must pay any dividend to the lender.",
   "warmup": "No dividends: S = 50, K = 45, r = 6%, T = 0.5. Floor = 50 − 45e^(−0.03) = 50 − 43.67 = $6.33.",
   "question": "A stock trades at $50. It pays a $1.20 dividend in 3 months. The continuously compounded risk-free rate is 6%. A 6-month European call with strike $45 is quoted at $5.00. (a) Find the no-arbitrage lower bound for the call. (b) Show an arbitrage and its minimum profit at expiry, with every cash flow. (c) Could exercising an American version of this call just before the dividend ever be optimal? (d) What is the lower bound of a 6-month European put with the same strike?",
   "hint": "Floor = S − PV(dividend) − PV(strike). For (b) the call is too cheap, so buy it and short the stock. For (c) compare the dividend with the interest lost by paying K early.",
   "steps": [
    "PV(dividend) = 1.20e^(−0.06×0.25) = $1.1821. PV(strike) = 45e^(−0.06×0.5) = $43.6700.",
    "(a) Lower bound c ≥ 50 − 1.1821 − 43.6700 = $5.1478. The $5.00 quote is $0.1478 too cheap.",
    "(b) Today: buy the call (−5.00), short one share (+50.00). Keep $1.1821 aside for the dividend you owe at 3 months, and invest the remaining $43.8179 for 6 months. Net cash today = 0.",
    "At 6 months the investment is worth 43.8179e^(0.03) = $45.1523. If S_T > 45, exercise the call, pay $45, close the short: profit $0.1523. If S_T ≤ 45, buy the share at S_T: profit 45.1523 − S_T ≥ $0.1523. Minimum profit = 0.1478e^(0.03) = $0.1523 per share.",
    "(c) Interest lost by paying K at 3 months instead of 6 = 45(1 − e^(−0.06×0.25)) = $0.6700. The dividend $1.20 > $0.67, so early exercise just before the ex-dividend date can be optimal (not guaranteed).",
    "(d) Put floor = PV(K) + PV(D) − S = 43.6700 + 1.1821 − 50 = −5.15 < 0, so the bound is just $0."
   ],
   "rubric": [
    "2: both present values and the call bound",
    "3: arbitrage trades with cash today and at expiry in both cases",
    "2: dividend early-exercise test with the right comparison",
    "1: put bound, including the floor at zero"
   ],
   "reading": "Hull: Properties of stock options (lower bounds with dividends; early exercise)."
  },
  {
   "title": "Price an American put on a two-step tree",
   "points": 8,
   "lesson": 15,
   "source": "Hull Ch 13 · Binomial trees. Harder than the Oct 17 midterm: several linked parts and one twist.",
   "words": "With u = e^(σ√Δt) and d = 1/u (the Cox–Ross–Rubinstein tree), volatility sets the step sizes. American means you can exercise at any node, so at each node take the larger of holding and exercising.",
   "warmup": "One step, S = 50, u = 1.2, d = 0.8, r = 0 (so p = 0.5), K = 52 put: payoffs 0 and 12, value = 0.5 × 12 = $6.",
   "question": "A non-dividend stock is $50, volatility is 30% a year and the continuously compounded risk-free rate is 5%. Use a two-step Cox–Ross–Rubinstein tree (u = e^(σ√Δt), d = 1/u) to value a 1-year put with strike $52. (a) Value the European put. (b) Value the American put and say at which node(s) early exercise happens. (c) What is the early-exercise premium? (d) How many shares should a seller of one American put trade at time 0 to delta hedge?",
   "hint": "Δt = 0.5. Find u, d and p first. Work back from the end; for the American put compare hold value with K − S at every node, including today.",
   "steps": [
    "Δt = 0.5, u = e^(0.30×√0.5) = 1.2363, d = 1/u = 0.8089, growth a = e^(0.05×0.5) = 1.0253. p = (1.0253 − 0.8089)/(1.2363 − 0.8089) = 0.5064.",
    "Stock nodes: today 50; after 6 months 61.8156 or 40.4429; after a year 76.4233, 50.0000 or 32.7126. Put payoffs at expiry: 0, 2.0000, 19.2874.",
    "European: up node e^(−0.025)(0.5064×0 + 0.4936×2) = 0.9628; down node e^(−0.025)(0.5064×2 + 0.4936×19.2874) = 10.2732; today e^(−0.025)(0.5064×0.9628 + 0.4936×10.2732) = $5.4213.",
    "American: down node hold 10.2732 vs exercise 52 − 40.4429 = 11.5571 → exercise early, value 11.5571. Up node: hold 0.9628 (exercise is worthless).",
    "Today: e^(−0.025)(0.5064×0.9628 + 0.4936×11.5571) = $6.0394. Exercising today gives only $2, so hold. (b) American put = $6.04 with early exercise at the down node.",
    "(c) Early-exercise premium = 6.0394 − 5.4213 = $0.6181.",
    "(d) Put delta = (0.9628 − 11.5571)/(61.8156 − 40.4429) = −0.4957. The put seller is long 0.4957 delta, so they short 0.4957 shares per put."
   ],
   "rubric": [
    "2: u, d, p correct",
    "2: European value by backward induction",
    "2: American node check and value",
    "1: premium",
    "1: delta and the correct hedge direction"
   ],
   "reading": "Hull: Binomial trees (American options, delta, matching volatility with u and d)."
  },
  {
   "title": "Use Itô to describe a stock and its square",
   "points": 8,
   "lesson": 36,
   "source": "Hull Ch 14 · Wiener processes and Itô's lemma. Harder than the Oct 17 midterm: several linked parts and one twist.",
   "words": "Geometric Brownian motion: dS = μS dt + σS dz. Itô's lemma adds ½ × (second derivative) × σ²S² to the drift of any function G(S,t). ln S_T is normal, so S_T is lognormal.",
   "warmup": "If ln S_T ~ N(4, 0.1²), a 95% range for S_T is e^(4 ± 0.196) = 44.7 to 66.3.",
   "question": "A stock price is $40 and follows geometric Brownian motion with expected return 16% and volatility 30% a year. (a) Give the distribution of ln S_T after 6 months. (b) Find a 95% confidence interval for S_T and the expected price E[S_T]. (c) What is the real-world probability that S_T > $45? (d) Use Itô's lemma to find the process followed by G = S². Is G also a geometric Brownian motion?",
   "hint": "Mean of ln S_T = ln S0 + (μ − σ²/2)T; sd = σ√T. For (d): G_S = 2S, G_SS = 2, G_t = 0.",
   "steps": [
    "ln 40 = 3.6889. Drift of ln S = 0.16 − 0.09/2 = 0.115 a year; over 0.5 year: 0.0575. sd = 0.30√0.5 = 0.2121.",
    "(a) ln S_T ~ N(3.7464, 0.2121²).",
    "(b) 95% interval: e^(3.7464 − 1.96×0.2121) = $27.96 to e^(3.7464 + 1.96×0.2121) = $64.21. E[S_T] = 40e^(0.16×0.5) = $43.33.",
    "(c) P(S_T > 45) = P(ln S_T > ln 45) = N((3.7464 − 3.8067)/0.2121) = N(−0.2842) = 0.3881, about 38.8%.",
    "(d) dG = (2S·μS + ½·2·σ²S²)dt + 2S·σS dz = (2μ + σ²)G dt + 2σG dz = 0.41G dt + 0.60G dz.",
    "Drift and volatility are both proportional to G, so yes: S² is also a geometric Brownian motion, with expected growth 41% a year and volatility 60%."
   ],
   "rubric": [
    "2: mean and sd of ln S_T",
    "2: interval built on ln S and expected value",
    "2: probability with the right z-score",
    "2: Itô derivatives, result and GBM conclusion"
   ],
   "reading": "Hull: Wiener processes and Itô's lemma; the lognormal property (start of the BSM chapter)."
  },
  {
   "title": "Price both options on a dividend stock with BSM",
   "points": 8,
   "lesson": 16,
   "source": "Hull Ch 15 · The Black–Scholes–Merton model. Harder than the Oct 17 midterm: several linked parts and one twist.",
   "words": "For known cash dividends, Black–Scholes uses the stock price minus the present value of the dividends paid before expiry. N(d2) is the risk-neutral probability the call finishes in the money.",
   "warmup": "No dividend: S = 42, K = 40, r = 10%, σ = 20%, T = 0.5 gives call $4.76 (Hull's example).",
   "question": "A stock is $60. Dividends of $1.50 are expected in 2 months and in 5 months. The risk-free rate is 4% (continuous), volatility is 28%, and European options with strike $58 expire in 9 months. (a) Price the call and the put with Black–Scholes–Merton. (b) Check your answers with put-call parity. (c) What is the risk-neutral probability that the call is exercised? (d) Explain in one sentence why the stock's expected return does not appear.",
   "hint": "Adjusted stock S* = 60 − 1.50e^(−0.04×2/12) − 1.50e^(−0.04×5/12). Then use the usual d1, d2 with S*.",
   "steps": [
    "PV of dividends = 1.4900 + 1.4752 = $2.9652. S* = 60 − 2.9652 = $57.0348. PV(K) = 58e^(−0.03) = $56.2858.",
    "σ√T = 0.28√0.75 = 0.2425. d1 = [ln(57.0348/58) + (0.04 + 0.0392)×0.75]/0.2425 = (−0.01678 + 0.0594)/0.2425 = 0.1758. d2 = 0.1758 − 0.2425 = −0.0667.",
    "N(d1) = 0.5698, N(d2) = 0.4734. Call = 57.0348×0.5698 − 56.2858×0.4734 = $5.85.",
    "Put = 56.2858×N(0.0667) − 57.0348×N(−0.1758) = 56.2858×0.5266 − 57.0348×0.4302 = $5.10.",
    "(b) c + PV(K) = 5.8504 + 56.2858 = 62.1362; p + S* = 5.1014 + 57.0348 = 62.1362. Parity holds (with S* in place of S0).",
    "(c) Risk-neutral exercise probability = N(d2) = 0.4734, about 47%.",
    "(d) The option can be hedged with the stock, so its price depends only on no-arbitrage (risk-neutral valuation); μ cancels out of the hedged portfolio."
   ],
   "rubric": [
    "2: dividend adjustment",
    "2: d1, d2 and N values",
    "2: call and put prices",
    "1: parity check",
    "1: N(d2) and why μ is absent"
   ],
   "reading": "Hull: The Black–Scholes–Merton model (dividends; risk-neutral valuation)."
  },
  {
   "title": "Make a book delta-, gamma- and vega-neutral",
   "points": 8,
   "lesson": 26,
   "source": "Hull Ch 19 · The Greek letters. Harder than the Oct 17 midterm: several linked parts and one twist.",
   "words": "Stock has delta 1 and zero gamma and vega, so it can only fix delta. To fix gamma and vega you need traded options; solve two equations for the two option positions, then fix delta with stock last.",
   "warmup": "Book gamma −300; a traded option has gamma 1.5. Buy 300/1.5 = 200 options to make gamma zero.",
   "question": "A delta-neutral options book has gamma −3,000 and vega −9,000. Two traded options are available. Option 1: delta 0.55, gamma 0.6, vega 2.5. Option 2: delta 0.45, gamma 1.0, vega 1.5. (a) Before any new hedge, estimate the book's change in value if the stock jumps by $2. (b) Find positions in the two options that make the book gamma-neutral and vega-neutral. (c) What stock trade then restores delta neutrality?",
   "hint": "For a delta-neutral book, ΔΠ ≈ ½Γ(ΔS)². For (b) solve 0.6w1 + 1.0w2 = 3,000 and 2.5w1 + 1.5w2 = 9,000.",
   "steps": [
    "(a) ΔΠ ≈ ½ × (−3,000) × 2² = −$6,000. A short-gamma book loses on big moves either way.",
    "(b) Gamma: 0.6w1 + 1.0w2 = 3,000 → w2 = 3,000 − 0.6w1.",
    "Vega: 2.5w1 + 1.5(3,000 − 0.6w1) = 9,000 → 1.6w1 = 4,500 → w1 = 2,812.5; w2 = 3,000 − 1,687.5 = 1,312.5. Buy 2,812.5 of Option 1 and 1,312.5 of Option 2.",
    "Check: gamma 0.6×2,812.5 + 1.0×1,312.5 = 3,000 ✓; vega 2.5×2,812.5 + 1.5×1,312.5 = 9,000 ✓.",
    "(c) New delta added = 0.55×2,812.5 + 0.45×1,312.5 = 1,546.875 + 590.625 = 2,137.5. Sell 2,137.5 shares to be delta-neutral again."
   ],
   "rubric": [
    "2: gamma P&L estimate with sign",
    "3: both equations solved",
    "1: check",
    "2: delta from the new options and the stock trade direction"
   ],
   "reading": "Hull: The Greek letters (gamma, vega, making a portfolio gamma- and vega-neutral)."
  }
 ],
 "B": [
  {
   "title": "Bound an American put on a dividend stock",
   "points": 8,
   "lesson": 35,
   "source": "Hull Ch 11 · Properties of stock options. Harder than the Oct 17 midterm: several linked parts and one twist.",
   "words": "For American options put-call parity becomes two inequalities. With dividends: S0 − D − K ≤ C − P ≤ S0 − Ke^(−rT). Turn it around to bound P from a known C.",
   "warmup": "No dividend, S = 20, K = 19, r = 10%, T = 1: S − K = 1 and S − Ke^(−0.1) = 2.81, so 1 ≤ C − P ≤ 2.81.",
   "question": "An American call on a stock with strike $30 and 6 months to expiry is worth $4.20. The stock is $31 and pays a $0.50 dividend in 2 months. r = 8% (continuous). (a) Derive upper and lower bounds for the American put with the same strike and expiry. (b) Check the call price against its own lower bound. (c) A dealer quotes the American put at $3.90. Is there an arbitrage? Describe the trade.",
   "hint": "PV(D) = 0.50e^(−0.08×2/12). Write S0 − D − K ≤ C − P ≤ S0 − Ke^(−rT), then solve for P.",
   "steps": [
    "PV(D) = 0.50e^(−0.08/6) = $0.4934. PV(K) = 30e^(−0.04) = $28.8237.",
    "S0 − D − K = 31 − 0.4934 − 30 = 0.5066. S0 − PV(K) = 31 − 28.8237 = 2.1763. So 0.5066 ≤ 4.20 − P ≤ 2.1763.",
    "(a) 4.20 − 2.1763 ≤ P ≤ 4.20 − 0.5066 → $2.0237 ≤ P ≤ $3.6934.",
    "(b) Call floor = S0 − D − PV(K) = 31 − 0.4934 − 28.8237 = $1.6829. 4.20 is above it, so the call price is consistent.",
    "(c) 3.90 > 3.6934, so the put is too expensive relative to the call. Write the put, buy the call, short the stock, and invest the cash (3.90 − 4.20 + 31 = $30.70). Hull's proof of the upper bound shows this locks in a profit of at least about $0.21 in today's money, whether or not the put is exercised early."
   ],
   "rubric": [
    "2: both PVs",
    "3: both put bounds",
    "1: call floor check",
    "2: arbitrage decision and trade"
   ],
   "reading": "Hull: Properties of stock options (put-call relationship for American options, effect of dividends)."
  },
  {
   "title": "Value an American put on futures",
   "points": 8,
   "lesson": 15,
   "source": "Hull Ch 13 · Binomial trees. Harder than the Oct 17 midterm: several linked parts and one twist.",
   "words": "A futures price needs no money to enter, so in a risk-neutral world it has zero growth: p = (1 − d)/(u − d). Everything else (backward induction, early-exercise check) is the same.",
   "warmup": "Futures 100, u = 1.1, d = 0.9: p = (1 − 0.9)/0.2 = 0.5.",
   "question": "A futures price is 1,200 with volatility 25% a year. r = 4% (continuous). Use a two-step tree (u = e^(σ√Δt), d = 1/u) to value a 6-month American put option on the futures with strike 1,250. (a) Find u, d and p. (b) Value the European and American puts. (c) Should the put be exercised today? (d) How many futures contracts hedge one short put at time 0?",
   "hint": "Δt = 0.25. Remember p uses 1, not e^(rΔt). Compare hold value with 1,250 − F at each node.",
   "steps": [
    "(a) u = e^(0.25×0.5) = 1.1331, d = 0.8825, p = (1 − 0.8825)/(1.1331 − 0.8825) = 0.4688. Discount per step e^(−0.01) = 0.9900.",
    "Futures nodes: 1,359.78 and 1,059.00 at 3 months; 1,540.83, 1,200.00, 934.56 at 6 months. Put payoffs: 0, 50.00, 315.44.",
    "European: up node 0.9900(0.4688×0 + 0.5312×50) = 26.30; down node 0.9900(0.4688×50 + 0.5312×315.44) = 189.10; today 0.9900(0.4688×26.30 + 0.5312×189.10) = 111.66.",
    "American: down node exercise = 1,250 − 1,059.00 = 191.00 > 189.10, so exercise early. Today 0.9900(0.4688×26.30 + 0.5312×191.00) = 112.66.",
    "(c) Exercise today gives 1,250 − 1,200 = 50 < 112.66, so do not exercise today.",
    "(d) Delta = (26.30 − 191.00)/(1,359.78 − 1,059.00) = −0.5476. A put seller is long 0.5476 futures-delta, so short 0.5476 futures contracts per put."
   ],
   "rubric": [
    "2: p with futures growth of 1",
    "2: European value",
    "2: American early-exercise node and value",
    "1: exercise-today check",
    "1: futures hedge"
   ],
   "reading": "Hull: Binomial trees (options on futures, American options)."
  },
  {
   "title": "Find a shortfall probability and an Itô process",
   "points": 8,
   "lesson": 36,
   "source": "Hull Ch 14 · Wiener processes and Itô's lemma. Harder than the Oct 17 midterm: several linked parts and one twist.",
   "words": "In a generalized Wiener process dx = a dt + b dz, both the mean change and the variance grow in proportion to time. 'Variance 4 per quarter' means sd 2 per quarter.",
   "warmup": "Drift 1 per year, variance 1 per year, start at 3. After 4 years: mean 7, sd 2.",
   "question": "A company's cash position (in $ millions) follows a generalized Wiener process with drift 0.5 per quarter and variance 4.0 per quarter. Today it holds $5.0 million. (a) What is the probability the cash position is negative in 1 quarter? In 1 year? (b) How much starting cash makes the one-year probability of a negative position at most 1%? (c) Separately, a stock follows dS = μS dt + σS dz with μ = 10%, σ = 20%. Use Itô's lemma to find the process for G = 1/S.",
   "hint": "Scale the mean and variance with the number of quarters. For (b) use N^(−1)(0.01) = −2.326. For (c): G_S = −1/S², G_SS = 2/S³.",
   "steps": [
    "After 1 quarter: mean 5.5, sd 2. P(x < 0) = N(−5.5/2) = N(−2.75) = 0.0030 (0.3%).",
    "After 1 year (4 quarters): mean 5 + 4×0.5 = 7, variance 16, sd 4. P(x < 0) = N(−7/4) = N(−1.75) = 0.0401 (about 4%).",
    "(b) Need (x0 + 2)/4 ≥ 2.326 → x0 ≥ 2.326×4 − 2 = $7.30 million.",
    "(c) dG = (−1/S²·μS + ½·2/S³·σ²S²)dt − (1/S²)·σS dz = (−μ + σ²)G dt − σG dz.",
    "With the numbers: dG = (−0.10 + 0.04)G dt − 0.20G dz = −0.06G dt − 0.20G dz. 1/S is also a GBM, with drift −6% (not −10%) because of the Itô term."
   ],
   "rubric": [
    "3: both probabilities with correct scaling",
    "2: required starting cash",
    "3: Itô derivatives and final process"
   ],
   "reading": "Hull: Wiener processes and Itô's lemma (generalized Wiener process example, Itô's lemma)."
  },
  {
   "title": "Apply Black's approximation to an American call",
   "points": 8,
   "lesson": 16,
   "source": "Hull Ch 15 · The Black–Scholes–Merton model. Harder than the Oct 17 midterm: several linked parts and one twist.",
   "words": "Black's approximation: value European calls maturing at T and just before the last ex-dividend date; the American call is approximately the larger. First check whether early exercise could ever be optimal at each dividend.",
   "warmup": "If D ≤ K(1 − e^(−r·gap)) at a dividend date, never exercise just before it.",
   "question": "A stock is $50, volatility 25%, r = 6% (continuous). Dividends of $0.70 are expected in 2 months and in 5 months. Consider a 6-month American call with strike $50. (a) Show it is never optimal to exercise just before the first dividend but it might be before the second. (b) Use Black's approximation to value the call.",
   "hint": "Gaps: 2 → 5 months is 3 months; 5 → 6 months is 1 month. For the 5-month European, subtract only the first dividend's PV.",
   "steps": [
    "(a) First dividend: K(1 − e^(−0.06×3/12)) = 50(1 − e^(−0.015)) = 0.7444 > 0.70, so never exercise before it. Second: 50(1 − e^(−0.06×1/12)) = 0.2494 < 0.70, so exercise just before it might be optimal.",
    "PVs: first dividend 0.70e^(−0.01) = 0.6930; second 0.70e^(−0.025) = 0.6827.",
    "European to 6 months: S* = 50 − 0.6930 − 0.6827 = 48.6242. d1 = [ln(48.6242/50) + (0.06 + 0.03125)×0.5]/(0.25√0.5) = 0.1003, d2 = −0.0765. c = 48.6242×0.5399 − 48.5223×0.4695 = $3.4723.",
    "European to 5 months: S* = 50 − 0.6930 = 49.3070, T = 5/12. d1 = 0.1491, d2 = −0.0123. c = 49.3070×0.5593 − 48.7655×0.4951 = $3.4316.",
    "(b) Black's approximation = max(3.4723, 3.4316) = $3.47. Here holding to expiry wins: the condition in (a) only says early exercise is possible, not that it is optimal."
   ],
   "rubric": [
    "3: both early-exercise tests",
    "1: dividend PVs",
    "2: European to T",
    "1: European to the last ex-date",
    "1: take the larger and interpret"
   ],
   "reading": "Hull: The Black–Scholes–Merton model (American call options, Black's approximation)."
  },
  {
   "title": "Hedge a short put book and check theta",
   "points": 8,
   "lesson": 26,
   "source": "Hull Ch 19 · The Greek letters. Harder than the Oct 17 midterm: several linked parts and one twist.",
   "words": "A put's delta is N(d1) − 1 (negative). A short put therefore has positive delta, so you short shares to hedge. Gamma tells you how that hedge must change; for a delta-neutral book, Θ + ½σ²S²Γ = rΠ.",
   "warmup": "Short 100 puts with delta −0.4: position delta = +40, so short 40 shares.",
   "question": "A bank has sold 20,000 six-month European puts on a non-dividend stock. S = $50, K = $50, r = 5%, σ = 25%. (a) Find the BSM put price and delta. (b) How many shares does the bank trade to become delta-neutral? (c) Find the position's gamma. If the stock rises by $2, how should the hedge change? (d) Is the short put position earning or paying time decay?",
   "hint": "d1 = [ln(1) + (0.05 + 0.03125)×0.5]/(0.25√0.5). Gamma = φ(d1)/(Sσ√T), the same for calls and puts.",
   "steps": [
    "σ√T = 0.1768. d1 = 0.040625/0.1768 = 0.2298, d2 = 0.0530. N(d1) = 0.5909, N(−d2) = 0.4789. p = 48.7655×0.4789 − 50×0.4091 = $2.90.",
    "(a) Put delta = N(d1) − 1 = −0.4091.",
    "(b) Short 20,000 puts: position delta = −20,000 × (−0.4091) = +8,182. Short (sell) 8,182 shares.",
    "(c) Gamma per put = φ(0.2298)/(50×0.25×0.7071) = 0.3885/8.8388 = 0.04396. Position gamma = −20,000 × 0.04396 = −879.",
    "After +$2: put delta ≈ −0.4091 + 0.04396×2 = −0.3212. Position delta ≈ +6,424, so the hedge should be short 6,424: buy back about 1,758 shares. (Buying after a rise is the cost of short gamma.)",
    "(d) Put theta = −Sφ(d1)σ/(2√T) + rKe^(−rT)N(−d2) = −2.267 per year per put. The short position earns about 20,000 × 2.267 / 365 ≈ $124 a day: short gamma is paid for with positive theta."
   ],
   "rubric": [
    "2: put price and delta",
    "2: hedge size and direction",
    "2: gamma and rebalancing",
    "2: theta sign and size"
   ],
   "reading": "Hull: The Greek letters (delta hedging, gamma, theta, relationship between delta, theta and gamma)."
  }
 ]
};
