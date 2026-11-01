/* Original syllabus-based practice, not an NYU exam or a prediction of final scope. */
const MOCKS = {
  "derivatives": [
    {
      "title": "Price a forward and test an arbitrage",
      "points": 12,
      "lesson": 5,
      "source": "Syllabus: forward fair value and arbitrage; extends midterm Q1.",
      "words": "A forward fixes a future purchase price. A known dividend belongs to the stock owner before delivery. Arbitrage means matching cash flows with no net risk under the stated assumptions.",
      "warmup": "Without dividends, buying a $100 stock with a 5% continuously compounded loan creates a one-year cost of 100 exp(0.05) = $105.13.",
      "question": "A stock is $100. It pays a known $2 dividend in six months. The continuously compounded risk-free rate is 5% and delivery is in one year. Find the fair forward price. A dealer instead quotes $106. Describe the cash-and-carry trade and its terminal profit per share. Assume borrowing/lending at 5%, no fees, and the dividend is certain.",
      "hint": "Borrow the stock price today; use the dividend to reduce the loan at six months.",
      "steps": [
        "Dividend PV = 2 exp(-0.05 × 0.5) = $1.9506.",
        "Fair delivery price = (100 - 1.9506) exp(0.05) = $103.0765.",
        "Borrow $100, buy one share, and sell a one-year forward at $106. Net initial cash is zero.",
        "At six months use the $2 dividend to reduce the debt. At maturity deliver the share for $106 and repay 100 exp(0.05) - 2 exp(0.025) = $103.0765.",
        "Locked terminal profit = $2.9235. This relies on identical timing and frictionless funding."
      ],
      "rubric": [
        "3: dividend timing and PV",
        "3: fair forward price",
        "4: all trade cash flows",
        "2: profit and assumptions"
      ],
      "reading": "Hull: forward prices with known income; supplied forward-pricing lecture."
    },
    {
      "title": "Separate margin deposits from trading profit",
      "points": 12,
      "lesson": 6,
      "source": "Syllabus: futures mechanics; extends midterm Q2–Q3.",
      "words": "Short means you gain when the futures quote falls. Maintenance margin is the trigger; initial margin is the target after a call.",
      "warmup": "A short position of 100 units loses $100 when the quote rises by $1. A deposit of $100 covers collateral but does not undo that loss.",
      "question": "You short two futures contracts at 4,000. Each has a $50 multiplier per index point. Total initial margin is $2,000 and total maintenance margin is $1,500. Settlement quotes are 4,003 on day 1 and 4,006 on day 2. Margin earns no interest. Show daily P/L, balances before deposits, any required deposit, cumulative P/L and total deposits. Calls occur strictly below maintenance.",
      "hint": "Daily P/L = -2 × 50 × (new quote - previous quote).",
      "steps": [
        "Total exposure is 100 dollars per point; use the short-position minus sign.",
        "Day 1: P/L = -$300; balance = $1,700. No call.",
        "Day 2: P/L = -$300; balance before deposit = $1,400, below $1,500.",
        "Deposit $600 to restore $2,000. Total deposits, including the original $2,000, are $2,600.",
        "Cumulative trading P/L = -$600. Check: deposits $2,600 plus P/L -$600 = final balance $2,000."
      ],
      "rubric": [
        "2: exposure and sign",
        "3: day 1",
        "3: day 2 and margin call",
        "4: cumulative loss and balance identity"
      ],
      "reading": "Hull: futures markets and margin; supplied futures-markets lecture."
    },
    {
      "title": "Set and revalue a plain interest-rate swap",
      "points": 12,
      "lesson": 8,
      "source": "Syllabus: swap applications and fair value; extends midterm Q5.",
      "words": "A discount factor is the price today of $1 paid later. A par swap has zero value at inception. A payer swap pays fixed and receives floating.",
      "warmup": "If annual discount factors are 0.96 and 0.90, a two-year par fixed rate is (1 - 0.90)/(0.96 + 0.90).",
      "question": "A three-year swap has annual payments, $1m notional and discount factors D1 = 0.96, D2 = 0.91, D3 = 0.85. Calculate the par fixed rate K. In a hypothetical immediate repricing before any floating coupon has fixed, the factors become 0.95, 0.88, 0.80. Find the value to the fixed-rate payer. Assume the floating leg resets at valuation, a single projection/discount curve, and unit accrual periods.",
      "hint": "At reset, PV of floating coupons is N(1 - D3); PV of fixed coupons is NK times the sum of discount factors.",
      "steps": [
        "Original annuity factor = 0.96 + 0.91 + 0.85 = 2.72.",
        "K = (1 - 0.85)/2.72 = 0.05514706, or 5.5147% annually.",
        "After repricing, floating coupon PV = 1,000,000 × (1 - 0.80) = $200,000.",
        "Fixed coupon PV = 1,000,000 × K × 2.63 = $145,036.76.",
        "Payer value = floating minus fixed = +$54,963.24. Away from a reset, account for the already-fixed next floating coupon."
      ],
      "rubric": [
        "3: original annuity and par rate",
        "3: floating PV",
        "3: fixed PV",
        "3: payer sign and reset assumption"
      ],
      "reading": "Hull: interest-rate swaps; supplied duration/swaps lecture."
    },
    {
      "title": "Use parity and distinguish payoff from profit",
      "points": 12,
      "lesson": 21,
      "source": "Syllabus: option basics and strategies.",
      "words": "Payoff is the contract cash at expiry. Profit subtracts its initial cost; this question explicitly ignores financing of that cost.",
      "warmup": "A call with strike $100 has payoff $20 at a stock price of $120. If its premium was $8, simple profit is $12.",
      "question": "A non-dividend-paying stock is $100. A European call with strike $100 costs $9 and the strike discount factor is 0.95. Find the matching put price and explain put-call parity as two equal terminal portfolios. Separately, a bull call spread buys a strike-90 call for $15 and sells a strike-110 call for $4. Find its payoff and simple profit at stock prices 80, 100 and 120, plus maximum loss and gain. Ignore financing of premiums for the spread.",
      "hint": "Parity: call + discounted strike = put + stock. Spread payoff is the difference of two call payoffs.",
      "steps": [
        "Put = 9 + 100 × 0.95 - 100 = $4.",
        "Call plus a bond paying $100 and stock plus put both pay max(stock price, 100) at expiry; their prices must match.",
        "Spread premium paid = 15 - 4 = $11. Payoff = max(S - 90, 0) - max(S - 110, 0).",
        "At S = 80, 100, 120: payoffs are $0, $10, $20; simple profits are -$11, -$1, +$9.",
        "Maximum loss is $11; maximum gain is $9. Profit and payoff are different graphs."
      ],
      "rubric": [
        "3: put price",
        "3: replication explanation",
        "4: three payoffs and profits",
        "2: maximum gain/loss"
      ],
      "reading": "Hull: properties of stock options and trading strategies."
    },
    {
      "title": "Work backward through an American option tree",
      "points": 12,
      "lesson": 15,
      "source": "Syllabus: option modeling and fair value; extension beyond the midterm.",
      "words": "Risk-neutral probabilities price tradable claims; they need not be forecasts. An American option allows early exercise.",
      "warmup": "At any American put node, compare the discounted continuation value with immediate exercise max(K - S, 0). Keep the larger.",
      "question": "A stock starts at $100. Each of two periods multiplies it by u = 1.2 or d = 0.8. The risk-free growth factor is R = 1.05 each period. Price a strike-$105 American put and the corresponding European put. Show the terminal payoffs, pricing probability, continuation values and early-exercise decision. Assume no dividends and a frictionless tree.",
      "hint": "q = (R - d)/(u - d). The period-1 down node is the important exercise decision.",
      "steps": [
        "q = (1.05 - 0.8)/(1.2 - 0.8) = 0.625; 0 < q < 1.",
        "Terminal stock prices are 144, 96, 64. Put payoffs are 0, 9, 41.",
        "At S = 120, continuation = (0.625 × 0 + 0.375 × 9)/1.05 = $3.2143; immediate exercise is 0.",
        "At S = 80, continuation = (0.625 × 9 + 0.375 × 41)/1.05 = $20; immediate exercise is $25. American exercise wins.",
        "American root value = (0.625 × 3.2143 + 0.375 × 25)/1.05 = $10.8418, greater than immediate exercise $5.",
        "European root uses $20 at the down node: value = $9.0561. Early-exercise flexibility is worth $1.7857."
      ],
      "rubric": [
        "2: q",
        "2: terminal payoffs",
        "4: both continuation/exercise comparisons",
        "2: American root",
        "2: European comparison"
      ],
      "reading": "Hull: binomial trees and American exercise; supplied Binomial_trees.pdf. This adds depth beyond the short app lesson."
    },
    {
      "title": "Connect a delta hedge to Black–Scholes",
      "points": 14,
      "lesson": 16,
      "source": "Syllabus: fair-value derivation, Black–Scholes and Greeks.",
      "words": "Delta is the local change in option value per $1 stock move. A locally riskless hedge removes the Brownian shock, not all future risk without rebalancing.",
      "warmup": "If a call delta is 0.6, buying 0.6 shares offsets the immediate stock sensitivity of one short call.",
      "question": "Assume dS = μS dt + σS dW and a smooth European option V(S,t), no dividends, frictionless continuous hedging and constant r, σ. Using Ito’s lemma, explain why a position long V and short V_S shares earns r locally and derive the BSM PDE. Then value a one-year call with S = K = 100, r = 5%, σ = 20%, given N(d1) = 0.63683, N(d2) = 0.55962 and exp(-0.05) = 0.951229. State delta and two model limitations.",
      "hint": "Ito gives dV = (V_t + μS V_S + 0.5σ²S²V_SS)dt + σS V_S dW. Subtract V_S dS.",
      "steps": [
        "The self-financing hedged change is dV - V_S dS = (V_t + 0.5σ²S²V_SS)dt; the dW and μ terms cancel.",
        "The hedge value is V - S V_S. No arbitrage requires its drift to equal r(V - S V_S).",
        "Rearrange: V_t + 0.5σ²S²V_SS + rS V_S - rV = 0, with terminal condition V(S,T) = max(S - K, 0) for a call.",
        "C = S N(d1) - K exp(-rT) N(d2) = 100 × 0.63683 - 100 × 0.951229 × 0.55962 ≈ $10.45.",
        "Delta = N(d1) = 0.63683. For one short option on one share, buy that many shares initially and rebalance.",
        "Constant volatility omits smiles and volatility changes; continuous frictionless hedging omits costs, gaps and discrete rebalancing. These limitations matter for actual hedging."
      ],
      "rubric": [
        "4: cancellation and self-financing reasoning",
        "3: PDE and terminal condition",
        "3: numerical call",
        "2: delta",
        "2: two limitations"
      ],
      "reading": "Hull: Wiener processes, Ito and the Black–Scholes model. Derivation is an original scaffold, not a reproduced exam answer."
    },
    {
      "title": "Scale Brownian shocks and interpret log returns",
      "points": 14,
      "lesson": 11,
      "source": "Syllabus: Wiener processes underlying option models.",
      "words": "A Brownian increment over length Δt is sqrt(Δt) times a standard-normal draw. Drift scales with time; uncertainty scales with its square root.",
      "warmup": "Annual volatility 20% becomes 10% over a quarter: 20% × sqrt(0.25). It is not 5%.",
      "question": "For geometric Brownian motion with S0 = 100, μ = 6% annually and σ = 20% annually, use Ito to give the distribution of ln(S_T/S0). At T = 0.25 years, find its mean and standard deviation. Calculate S_T for a standard-normal draw Z = -1. Explain which drift changes under risk-neutral valuation if r = 4% and there are no dividends.",
      "hint": "For f(S) = ln S, f_S = 1/S and f_SS = -1/S². Include the second-order Ito term.",
      "steps": [
        "Ito gives d ln S = (μ - 0.5σ²)dt + σ dW.",
        "Thus ln(S_T/S0) = (μ - 0.5σ²)T + σ sqrt(T) Z, with Z standard normal.",
        "Quarter-year mean = (0.06 - 0.5 × 0.20²) × 0.25 = 0.01. Standard deviation = 0.20 sqrt(0.25) = 0.10.",
        "For Z = -1, log return = 0.01 - 0.10 = -0.09, so S_T = 100 exp(-0.09) = $91.39.",
        "Under the risk-neutral measure replace μ by r = 0.04. Log-return mean becomes 0.005; volatility remains 0.10 in this model.",
        "The physical drift describes the assumed real-world process; the pricing drift enforces no-arbitrage valuation. They answer different questions."
      ],
      "rubric": [
        "4: Ito log transformation",
        "3: distribution and time scaling",
        "3: numerical price",
        "2: risk-neutral drift",
        "2: interpretation"
      ],
      "reading": "Hull: Wiener processes and Ito; Valuation stochastic-process lecture for supporting intuition."
    },
    {
      "title": "Explain what a delta hedge leaves behind",
      "points": 12,
      "lesson": 16,
      "source": "Syllabus: option Greeks and derivative uses.",
      "words": "Gamma measures how delta changes as the stock moves. Vega measures sensitivity to a volatility change. Here vega is quoted per one percentage point of volatility.",
      "warmup": "A share has delta 1 and gamma 0. Shares can neutralize delta but cannot cancel option gamma.",
      "question": "A dealer is short 100 calls, each covering 100 shares. Each per-share call has delta 0.60, gamma 0.02 per dollar, and vega $0.15 per one percentage-point volatility increase. How many shares make the position initially delta neutral? Estimate the hedged P/L for a $2 stock rise at unchanged volatility using 0.5 Γ(ΔS)². Separately estimate P/L for a 3-percentage-point volatility rise at unchanged stock price. Ignore time decay, funding and higher-order terms. Explain the hedge limitations.",
      "hint": "There are 10,000 option-share units. Short positions reverse the Greeks’ signs.",
      "steps": [
        "Option position delta = -10,000 × 0.60 = -6,000. Buy 6,000 shares.",
        "Total option gamma = -10,000 × 0.02 = -200 per dollar. The stock adds zero gamma.",
        "After canceling the first-order delta term, estimated stock-move P/L = 0.5 × (-200) × 2² = -$400.",
        "Total vega = -10,000 × 0.15 = -$1,500 per volatility percentage point. A 3-point increase gives approximately -$4,500.",
        "Delta neutrality is local and temporary. Gamma changes delta, volatility changes option prices, and discrete hedging/costs prevent a perfect continuous hedge."
      ],
      "rubric": [
        "3: multiplier and share hedge",
        "3: gamma P/L",
        "3: vega units and P/L",
        "3: limitations"
      ],
      "reading": "Hull: Greeks and hedging. Supplied syllabus lists Greeks in the final option block."
    }
  ],
  "valuation": [
    {
      "title": "Derive an increasing cash-flow value",
      "points": 12,
      "lesson": 0,
      "source": "Revised syllabus week 1; historical midterm derivation style.",
      "words": "GVE links today’s value to the next cash flow and remaining value. A perpetuity continues indefinitely; the discount rate here is positive and per year.",
      "warmup": "A flat $10 perpetuity beginning next year is worth 10/r. Use a shifted stream to handle payments that grow by a fixed dollar amount.",
      "question": "Cash flows at years 1, 2, 3, … are $10, $20, $30, … forever. Derive V using a shift and GVE, then evaluate it at r = 10% annually. Explain why using the same rate for uncertain future cash flows needs an additional assumption.",
      "hint": "After the first year, the remaining stream is the original stream plus $10 each year.",
      "steps": [
        "Let Vnext value the stream 20,30,40,… one year later. Relative to 10,20,30,… it adds a $10 perpetuity, so Vnext = V + 10/r.",
        "GVE: (1 + r)V = 10 + Vnext = 10 + V + 10/r.",
        "Therefore rV = 10 + 10/r and V = 10(1 + r)/r².",
        "At r = 0.10, V = 10 × 1.1/0.01 = $1,100. The first payment is at year 1 and r > 0 ensures convergence.",
        "For uncertain cash flows, their risk and timing must be priced consistently. A risk-free rate applied to raw expected risky cash flows generally omits a risk adjustment."
      ],
      "rubric": [
        "4: shifted stream",
        "3: GVE and formula",
        "3: value, timing and domain",
        "2: risk limitation"
      ],
      "reading": "Shimko Valuation Principles Chapters 1–2 and Lecture 1."
    },
    {
      "title": "Bootstrap and check interest-rate sensitivity",
      "points": 12,
      "lesson": 3,
      "source": "Revised syllabus weeks 2–3: bonds, zero curve and interest-rate risk.",
      "words": "Bootstrapping finds each discount factor from traded cash flows. Duration is a first-order approximation, not an exact prediction for large yield moves.",
      "warmup": "A one-year zero paying $100 at 4% annually costs 100/1.04. That gives D1 = 1/1.04.",
      "question": "The one-year annual spot rate is 4%. A two-year annual-coupon bond with face $100 and coupon 5% costs $100. Derive D2 and the two-year annually compounded spot rate. Separately a bond portfolio is worth $20,000 with modified duration 4.2. Estimate its value change if its yield rises by 0.50 percentage points. State what you are ignoring.",
      "hint": "Price = 5D1 + 105D2. For duration, convert 0.50 percentage points to 0.005.",
      "steps": [
        "D1 = 1/1.04 = 0.96153846.",
        "100 = 5D1 + 105D2, so D2 = (100 - 5/1.04)/105 = 0.90659341.",
        "Two-year spot rate z2 = D2^(-1/2) - 1 = 5.02525% annually.",
        "Approximate change = -modified duration × value × yield change = -4.2 × 20,000 × 0.005 = -$420; estimated new value $19,580.",
        "The approximation ignores convexity and changes in cash flows; a single yield shift also does not capture arbitrary curve twists or spread changes."
      ],
      "rubric": [
        "4: bootstrapping setup",
        "3: D2 and spot rate",
        "3: duration calculation",
        "2: limitations"
      ],
      "reading": "Valuation bond/interest-rate lecture; zero-coupon term-structure mini-project topics."
    },
    {
      "title": "Price an option using a cash-flow risk adjustment",
      "points": 12,
      "lesson": 12,
      "source": "Revised syllabus weeks 6 and 9: Lintner CAPM and option valuation.",
      "words": "An option’s cash flow is nonlinear. Compute its own covariance with the market before applying the supplied cash-flow pricing model.",
      "warmup": "A call paying max(X - 100, 0) on asset cash flows 70 and 130 pays 0 and 30, not -30 and 30.",
      "question": "There are two equally likely physical states. Market cash flow XM is 80 or 120; asset cash flow X is 70 or 130 in the same states. A call pays Y = max(X - 100, 0). Use V(Y) = [E(Y) - A Cov(Y,XM)]/(1 + rf), with A = 0.01 and rf = 5%. Find the call’s expected cash flow, covariance, risk-adjusted value and value if the covariance charge were wrongly omitted. Explain the difference.",
      "hint": "Covariance is the average of the products of deviations from each variable’s mean.",
      "steps": [
        "Y is 0 in the low state and 30 in the high state. E(Y) = 15; E(XM) = 100.",
        "Cov(Y,XM) = 0.5(-15)(-20) + 0.5(15)(20) = 300.",
        "Risk charge = 0.01 × 300 = 3. Call value = (15 - 3)/1.05 = $11.4286.",
        "Ignoring risk gives 15/1.05 = $14.2857, an overstatement of $2.8571 in this stipulated model.",
        "The option pays in the high-market state, so the model charges for positive market covariance. This is a given one-period model, not an assertion that physical probabilities equal risk-neutral probabilities."
      ],
      "rubric": [
        "2: payoffs and mean",
        "4: covariance",
        "3: adjusted price",
        "3: comparison and interpretation"
      ],
      "reading": "Valuation Lecture 6 and revised syllabus week 9; follow your instructor’s notation and calibration."
    },
    {
      "title": "Audit a multivariate simulation",
      "points": 12,
      "lesson": 10,
      "source": "Revised syllabus weeks 4–5; historical midterm computational style.",
      "words": "Cholesky creates correlated draws. Standard error measures uncertainty in an estimated mean; it is different from the standard deviation of individual outcomes.",
      "warmup": "For C = [[a,0],[b,c]], CCᵀ = [[a²,ab],[ab,b²+c²]]. With observations in rows, transform independent draws using Cᵀ.",
      "question": "Find a lower-triangular C for covariance matrix [[9,6],[6,20]]. State the transformation from independent standard-normal rows U to correlated rows W and its inverse. A separate simulation gives payoff standard deviation s = 24 from n = 144 independent draws. With maxerr = 2SE, find its maxerr and the number of draws needed for maxerr no greater than 1, keeping s unchanged.",
      "hint": "Match a², ab and b² + c². Then use SE = s/sqrt(n).",
      "steps": [
        "a = 3, b = 2, c = 4. Thus C = [[3,0],[2,4]]. Check CCᵀ = [[9,6],[6,20]].",
        "For row observations W = UCᵀ; recover U = W(Cᵀ)^(-1), after subtracting means if needed.",
        "SE = 24/sqrt(144) = 2. Therefore maxerr = 4.",
        "Need 2 × 24/sqrt(n) ≤ 1, so n ≥ 48² = 2,304.",
        "Independence and unchanged outcome spread are assumptions. More draws reduce sampling error, not model bias or the underlying payoff risk."
      ],
      "rubric": [
        "4: Cholesky and check",
        "3: row transformation and inverse",
        "3: error and sample size",
        "2: limitations"
      ],
      "reading": "Valuation simulation lecture and Cholesky spreadsheet; historical maxerr convention is specified explicitly."
    },
    {
      "title": "Read a probability clue from option prices",
      "points": 12,
      "lesson": 17,
      "source": "Revised syllabus week 10: implied probability distributions.",
      "words": "A butterfly combines calls at three equally spaced strikes. Call-price curvature contains information about risk-neutral probabilities, not directly real-world probabilities.",
      "warmup": "A long butterfly buys the low-strike call, sells two middle-strike calls and buys the high-strike call. Its payoff is never negative.",
      "question": "Same-expiry European calls on a non-dividend stock have prices C(90) = 16, C(100) = 9, C(110) = 4. The expiry discount factor is D = 0.95. Find the cost of the 90/100/110 butterfly, its maximum terminal payoff, and a centered finite-difference estimate of the risk-neutral density near strike 100 using fQ(K) ≈ [C(K-h) - 2C(K) + C(K+h)]/(D h²), h = 10. Interpret fQ × h carefully. What fails if C(100) were 11 instead?",
      "hint": "Positive curvature is required by no arbitrage. A density has units of probability per dollar.",
      "steps": [
        "Butterfly cost = 16 - 2 × 9 + 4 = $2.",
        "The payoff rises from 0 at S = 90 to $10 at S = 100 and falls to 0 at S = 110; outside that range it is zero.",
        "Density estimate = 2/(0.95 × 100) = 0.0210526 per dollar.",
        "Multiplying by a $10 interval gives roughly 0.2105, or 21.05%, only if a local constant-density approximation is reasonable. This coarse estimate is not an exact interval probability.",
        "If the middle call were 11, butterfly cost would be -$2 while terminal payoff remains nonnegative. That violates convexity and allows an arbitrage under frictionless trading.",
        "These are pricing-measure probabilities. Risk premia and the finite strike spacing prevent reading them as a precise real-world forecast."
      ],
      "rubric": [
        "3: cost and payoff",
        "3: density calculation",
        "3: careful interpretation",
        "3: convexity violation"
      ],
      "reading": "Valuation implied-density and volatility-surface lectures; the formula is supplied to make the exercise self-contained."
    },
    {
      "title": "Compare committing now with waiting",
      "points": 14,
      "lesson": 18,
      "source": "Revised syllabus week 11: contracts and real options.",
      "words": "An option to invest lets you reject a bad outcome. A risk-neutral probability is given here; do not substitute physical forecasts without changing the model.",
      "warmup": "If next year’s project asset is worth 80 and investment costs 100, an optional investment pays 0 because you can decline.",
      "question": "Next year a project asset will be worth 160 or 80. Treat these as market-consistent asset values with risk-neutral probabilities 0.5 each. The annual risk-free growth factor is 1.05. You can either pay 100 now to own the asset next year, or hold a free right to pay 100 next year after seeing its value. Find immediate-investment NPV, the value of waiting and the incremental flexibility value. Explain why using this method for a nontraded business needs care.",
      "hint": "Discount the asset value for the commit-now case; discount max(asset value - investment cost, 0) for the waiting case.",
      "steps": [
        "Asset PV = (0.5 × 160 + 0.5 × 80)/1.05 = $114.2857.",
        "Immediate-investment NPV = 114.2857 - 100 = $14.2857.",
        "Waiting payoffs are $60 in the high state and $0 in the low state.",
        "Waiting value = (0.5 × 60 + 0.5 × 0)/1.05 = $28.5714.",
        "Incremental value relative to committing now = 28.5714 - 14.2857 = $14.2857. It includes the ability to avoid bad investment and defer the expenditure.",
        "For a nontraded project, replication may be unavailable. Justify the pricing probabilities/risk adjustment, possible competition and any cost of waiting. The supplied assumptions make this toy model calculable."
      ],
      "rubric": [
        "3: asset PV and immediate NPV",
        "4: contingent payoffs and option value",
        "3: incremental comparison",
        "4: assumptions and nontraded limitation"
      ],
      "reading": "Valuation real-options-in-energy lecture; Welch capital budgeting and option intuition."
    },
    {
      "title": "Connect financing assumptions to capital budgeting",
      "points": 14,
      "lesson": 23,
      "source": "Revised syllabus weeks 11–12: capital budgeting and capital structure.",
      "words": "WACC weights financing costs by market values. The tax adjustment here assumes deductible interest and a usable corporate tax shield.",
      "warmup": "If 60% of funding is equity and 40% is debt, multiply each financing cost by its weight; do not average them equally.",
      "question": "A company has market equity value 600 and debt 400. Its cost of equity is 12%, pre-tax cost of debt is 6%, and corporate tax rate is 25%. Under a stable target financing mix and comparable project risk, calculate after-tax WACC. A project costs 100 now and pays one unlevered after-tax cash flow of 109 next year. Find NPV and IRR, and explain the decision at this rate. Why can you not keep the same component costs while increasing debt indefinitely to make value rise?",
      "hint": "WACC = wE ke + wD kd(1 - tax). One-period IRR solves cost = future cash/(1 + IRR).",
      "steps": [
        "Equity and debt weights are 0.6 and 0.4. After-tax debt cost is 6% × 0.75 = 4.5%.",
        "WACC = 0.6 × 12% + 0.4 × 4.5% = 9%.",
        "NPV = -100 + 109/1.09 = 0. IRR = 109/100 - 1 = 9%.",
        "The project exactly earns the assumed required return: it is financially break-even at these inputs, not a strictly positive-NPV opportunity.",
        "Higher leverage changes equity/debt risk and their required returns. Distress costs, tax-shield limits and financing constraints can alter value.",
        "Use cash flows and discount rates consistently. Do not subtract interest again from the unlevered cash flow when discounting at WACC."
      ],
      "rubric": [
        "4: weights and WACC",
        "3: NPV",
        "2: IRR",
        "2: break-even decision",
        "3: leverage and consistency"
      ],
      "reading": "Welch Corporate Finance: capital budgeting, financing and capital structure. This is a syllabus extension, not a historical midterm replica."
    },
    {
      "title": "Trace losses and choose a risk response",
      "points": 12,
      "lesson": 14,
      "source": "Revised syllabus: corporate bonds/CDOs and later corporate risk management.",
      "words": "A tranche absorbs losses according to seniority. A risk measure summarizes a distribution; it does not remove exposure.",
      "warmup": "If the equity tranche absorbs the first $5 of loss, a $3 pool loss never reaches mezzanine or senior investors.",
      "question": "A $100 debt pool has equity 5, mezzanine 10 and senior 85. Allocate a realized $12 pool loss. Separately a company’s annual loss distribution is 0 with probability 90%, 10 with probability 8%, and 40 with probability 2% (all in $m). Find expected loss, 95% VaR as the smallest loss with cumulative probability at least 95%, and ES as the average of the worst 5%, splitting the mass at the VaR threshold as needed. Give one reason management should examine stress scenarios as well.",
      "hint": "The worst 5% includes all of the 2% at loss 40 and 3 percentage points from the loss-10 outcomes.",
      "steps": [
        "Equity loses 5, mezzanine loses 7, senior loses 0. Remaining tranche values under this simple loss-only allocation are 0, 3 and 85.",
        "Expected loss = 0.90 × 0 + 0.08 × 10 + 0.02 × 40 = $1.6m.",
        "Cumulative probability is 90% at 0 and 98% at 10, so 95% VaR = $10m.",
        "Worst-5% average = (0.02 × 40 + 0.03 × 10)/0.05 = $22m.",
        "Stress testing can examine losses beyond an estimated distribution, correlation breakdowns, illiquidity and funding pressures. It complements a quantified limit rather than proving the model correct."
      ],
      "rubric": [
        "3: waterfall",
        "2: expected loss",
        "2: VaR",
        "3: ES",
        "2: stress rationale"
      ],
      "reading": "Valuation corporate bonds/CDOs lecture; later corporate-risk-management syllabus topic. Risk course assessment remains report/presentation based."
    }
  ]
};
