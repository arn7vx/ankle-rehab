# Ankle Rehab — Return to Futsal

A static, mobile-first GitHub Pages tracker for criteria-based ankle rehabilitation and return to futsal.

## What it does

- Baseline and repeat assessments: symptoms, knee-to-wall, calf endurance, balance, impact, cutting and futsal exposure.
- Stage progression: **0 Benchmark → A Normal Ankle → B Strong Ankle → C Springy Ankle → D Athletic Ankle → E Futsal Ankle**.
- Phone-first session logger with previous exercise results.
- Progress charts and recent history.
- One-click **ChatGPT progress report**.
- Public GitHub repository as the sync/store: `data/rehab.json` is updated through the GitHub Contents API.
- Installable PWA shell for easier phone access.

## Deploy in ~3 minutes

1. Create a **public GitHub repository** (for example `ankle-rehab`).
2. Upload the **contents of this ZIP** to the repository root (not the enclosing ZIP folder).
3. Commit to `main`.
4. In the repository go to **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select `main` and `/ (root)`, then save.
7. Open the GitHub Pages URL once deployment finishes.

The app normally infers its own `owner/repository` from the GitHub Pages URL, so read-only use on your laptop requires no token.

## Phone write access

To let the phone save sessions back into this repository:

1. In GitHub, create a **fine-grained personal access token**.
2. Set **Repository access → Only select repositories → this rehab repo**.
3. Under repository permissions, set **Contents → Read and write**. Keep everything else at the minimum/default.
4. Open the deployed rehab site on your phone.
5. Tap **Phone write setup**.
6. Confirm the inferred owner/repo/branch (`main`) and data path (`data/rehab.json`).
7. Paste the token and tap **Save setup**.

The token is stored only in that browser's `localStorage`. It is never written into `data/rehab.json` or committed to the repository. Do not use this write setup on a shared device.

## Everyday workflow

### Phone

1. Open the site (optionally **Add to Home Screen**).
2. Do the current rehab session.
3. Tap **Save session to GitHub**.
4. The site commits the updated `data/rehab.json` to the same repository.

### Laptop

1. Open the same GitHub Pages URL.
2. Tap **Pull latest**.
3. Review charts/history or tap **Copy progress report** and paste it into ChatGPT.

## Data model

All rehab data lives in:

```text
data/rehab.json
```

Because the repository is public, that file is public too. No GitHub token is ever stored there.

Git commit history provides an additional audit trail / rollback path. The app also has **Download JSON backup**.

## Safety

This tool is for organising rehabilitation and tracking progression. It does not diagnose ligament grade, syndesmotic injury, osteochondral injury or mechanical instability, and its stage suggestions are not medical clearance.

The app deliberately flags recurrent giving-way, significant swelling, locking/catching, pain above the ankle with twisting, and high walking pain as reasons to stop blindly progressing and seek in-person assessment when possible.

Working symmetry targets (for example ~85–90%) are practical progression guides rather than validated universal return-to-sport cut-offs.

## Evidence base used for the structure

- Smith MD et al. *Return to sport decisions after an acute lateral ankle sprain injury: introducing the PAASS framework—an international multidisciplinary consensus.* British Journal of Sports Medicine, 2021.
- Martin RL et al. *Lateral Ankle Ligament Sprains: Clinical Practice Guidelines.* Journal of Orthopaedic & Sports Physical Therapy, 2021.

The included YouTube demonstrations are supporting visual references only; the written exercise instructions in the app are the primary cues.

## Files

```text
index.html
manifest.json
service-worker.js
css/app.css
js/app.js
js/database.js
js/rehab-plan.js
js/charts.js
js/reports.js
assets/icon.svg
data/rehab.json
```

No build step, npm install, server, Supabase, or separate data repository is required.
