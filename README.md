# Finals Sketchbook

A study app for Fall 2026 finals: **Derivatives, Valuation, Risk Management and Bloomberg**.
35 short classes written for beginners. Each class has:

- a sketch you can play step by step,
- a plain-words explanation and the exam formulas,
- a worked example with real numbers,
- common traps and where to read more in the course folder,
- a small calculator (in many classes),
- free videos and courses to go deeper ("Watch and learn online" in each subject).

Progress ticks are saved in your browser. The app installs to a phone home screen and works offline after the first visit.

## Files

| File | What it is |
|---|---|
| `index.html` | Home screen with the 4 subjects and your progress |
| `derivatives.html`, `valuation.html`, `risk-management.html`, `bloomberg.html` | One page per subject |
| `all.html` | All 35 classes on one page |
| `pdf/` | Printable PDF of each subject and of everything |
| `manifest.webmanifest`, `sw.js`, `icons/` | Makes it installable and offline-ready |

It is a plain static site: no build step and no dependencies.

## Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
2. Import the `Semester-1` repository.
3. Leave **Framework Preset** as **Other**, and leave Build Command and Output Directory empty.
4. Click **Deploy**. Your app is live at `https://<project-name>.vercel.app`.

Every push to `main` redeploys automatically.

## Run it locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```
