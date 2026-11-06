# Finals Sketchbook — first NYU term

A beginner-first, local-first study companion for Fall 2026: **Derivatives (FRE 6073), Valuation (FRE 6103), Risk (FRE 6123), and Bloomberg certification preparation (FRE 5500)**.

## Start

No build, account, API key or package installation is needed.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000. Keep the server running while opening the local study-pack files. On macOS, `Start Sketchbook.command` starts the server from the correct folder. If port 8000 is busy, use 8001; note that a different port has separate browser storage.

Start with **Valuation → Money today vs money later**, or the six math refreshers on the desk. Each lesson follows: everyday idea → vocabulary → three short videos (the idea, the worked example, and the traps) → formulas → attempt → reveal solution → comprehension check → personal explanation.

## What is included

- Seven hands-on concept experiments: present value/growth, option exercise/payoff/profit, forward replication, a daily futures margin ledger, project NPV/IRR, bond price vs yield, and CAPM required return. They appear before the sketches in ten lesson placements; they do not yet cover every topic.
- A Bloomberg warm-up quiz (`bloomberg-practice.html`): 32 original multiple-choice questions across Economic Indicators, Currencies, Fixed Income and Equities, with instant explanations and a 70% per-topic study target. It does not count toward certification or predict readiness; four original market cases add applied explanations.


- 35 unique visual lessons, with beginner introductions, prerequisite links, explained multiple-choice checks, worked examples, and original calculators.
- 10 Derivatives, 11 Valuation, 11 Risk and 5 Bloomberg lesson placements. Two lessons are shared, so placements total 37 but unique lessons total 35.
- Shared progress across the subject pages and the all-lessons page. Old `fsb-done-*` progress migrates by stable lesson ID.
- Search, continue-learning, missed-question review, personal notes, light/dark/system appearance, responsive layouts and keyboard navigation.
- A syllabus-to-question learning map, with explicit gaps and separate exam/report/certification paths.
- Five independently worked questions from the supplied October 17 Derivatives paper, with stated timing conventions, marking guides and changed-scenario drills.
- Seven original Valuation practice questions following the skill types and 100-point allocation of the supplied 2025A midterm. Includes warm-ups, vocabulary, hints, worked solutions, self-assessment, an optional two-hour timer, a hide-help mode and question printing.
- Separate Bloomberg certification checklist with four self-entered scores. It does not contact Bloomberg, complete tests, verify scores or award certification.
- A local materials shelf containing the supplied books, lectures, assignments and exam files. New PDFs can be added through the browser and opened offline.
- JSON backup/restore for progress, lesson notes, practice answers, marks and self-reported certification data. Restores merge entries; imported entries override matching existing entries. PDF files are separate.

## Materials and course accuracy

See `CONTENT_SOURCES.md` for source mapping, known gaps and the update workflow.

The `private-materials/` folder retains its original name but now includes 40 user-authorized course PDFs (including books) and two exam photos in Git and deployment. Its `index.json` lists these 42 files. Other local pack formats remain excluded. New PDFs imported through the UI are stored in IndexedDB on that browser; they do not enter this folder and do not automatically rewrite lessons. Keep original files and export study backups regularly. Browser data is not synced between devices and can be cleared or evicted.

The PDFs in `pdf/` were regenerated on November 1, 2026 from the current lesson and practice sources. They include beginner stories, vocabulary, worked examples, lesson checks with answers, paper labs, existing midterm practice and two new mock finals. Personal browser notes are not included. The combined edition has subject bookmarks; individual mock PDFs put all questions before their worked solutions.

The original course content is retained with targeted corrections and scaffolding, not certified as a full replacement for the lectures or textbooks. Missing Risk decks, later uploads and the current final assessment scope still need confirmation. Midterm practice follows the supplied historical papers. Two additional 100-point, eight-question mock finals extend into the supplied Valuation and Derivatives syllabi. Their 120-minute suggested duration, selection and weights are original study choices, not predictions or confirmed final rules. The practice timer resets when the page reloads; written answers persist.

## Offline behavior

On localhost or HTTPS, the service worker caches the complete lesson/app shell. Wait for “Lessons ready offline.” It serves one version consistently and refreshes when a new cache version is installed. Bump the cache name in `sw.js` when shipping asset changes; reload open pages after an update.

Local study-pack files and original printable PDFs are not automatically downloaded for offline use. Browser-imported PDFs can be opened offline. External videos, Bloomberg and Brightspace need an internet connection. Offline support may be unavailable in restrictive/private browser modes.

## Maintain the app

- `assets/lessons.js`: single source of lesson content, sketches, calculators and calculator domain checks; IDs remain stable.
- `assets/beginner.js`: everyday explanations, terminology, questions and prerequisites, keyed by lesson ID.
- `assets/config.js`: subject ordering and supplementary resource lists.
- `assets/common.js`: storage, legacy migration, theme and service-worker registration.
- `assets/study.js`: shared lesson renderer.
- `assets/home.js`: study desk, certification and validated backups.
- `assets/library.js`: local manifest and browser PDF storage.
- `assets/practice-data.js`, `assets/practice.js`: midterm-style practice content and interaction.
- `assets/base.css`, `assets/study.css`: retained visual system and shared refinements.

Run the checks with Node 18+:

```sh
node --test tests/*.test.cjs
```

They verify all lesson IDs, beginner coverage, sketch geometry, calculator defaults and invalid domains, local links, legacy progress migration, practice totals and independent numerical answers. Browser review additionally checks responsive layout and core flows; the unit suite is not an exhaustive financial-content audit.

## Deploy the app code

Import the repository into Vercel as a static site (Framework: Other, no build command). `.vercelignore` includes the authorized PDFs, exam photos and library index while excluding other local pack formats. The library opens with 42 included materials from `assets/materials-index.js`; users can also add browser-local PDFs. There is no runtime catalogue fetch. The release tests verify every packaged file and size; `.vercelignore` excludes only other local pack formats. A successful code check is not proof that a particular live deployment is current.

## Rebuild the printable guides

Run `node scripts/export-study.cjs`, then `python3 scripts/build-study-pdfs.py`. The Python environment needs reportlab and pypdf. Pass `--font /path/to/DejaVuSans.ttf` or set `STUDY_PDF_FONT` outside the bundled desktop runtime. The exporter checks library entries and generates the browser catalogue from `private-materials/index.json`. The print builder reads the exported lesson/practice data, adds paper experiments, and writes the five subject/combined editions and two mock finals in `pdf/`. The edition date is explicit in the builder; update it when issuing a later edition.

Run `node --test tests/*.test.cjs`. Render the new PDFs with Poppler and inspect lesson, lab, question and solution pages before publishing. No source textbook is rewritten by this pipeline.

## November 1 update

- Eight new questions per mock final, separate saved answers and marks, exam mode, timer, PDF copies, and backup support.
- Four applied Bloomberg market cases; official test questions were not provided, so no official-test fidelity is claimed.
- Fixed resource navigation after a lesson and the lab IRR calculation for zero, negative and very high returns. Break-even NPV now says exactly that.
- New regression checks cover those failures, material packaging, mock totals, marking guides, financial calculations and backup validation.
