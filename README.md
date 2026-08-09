# CLARA — your personal portfolio & CV agent

CLARA turns your real data (GitHub, personal files, project folders) into one
polished **live portfolio** and tailored **one-page CVs**. Everything it produces
is verified with you before it becomes public.

```
Live-portfolio/
├── .opencode/agent/clara.md   CLARA's agent definition (opencode)
├── opencode.json              CLARA config: permissions, outside-folder access
├── AGENTS.md                   CLARA's operating rules & workflows
├── clara.config.json           your sources (GitHub, folders) + deploy config
├── src/schema/                 profile & config JSON schemas
├── scripts/                    ingestion, validation, diff, CV & sync tooling
├── content/
│   ├── profile.json            SSOT — the ONLY thing that drives output
│   ├── proposed/               proposals awaiting your approval
│   ├── snapshots/              raw pulled data (gitignored)
│   ├── jobs/                   job descriptions for CVs (<role>.md)
│   └── cvs/                    generated per-role CV previews
└── portfolio/                  Next.js + Tailwind site (deploys to Vercel)
    └── content/profile.json    verified mirror → built into the site
```

## How to use

1. Open this folder in **opencode** and pick agent **CLARA**.
2. Say `CLARA, sync my data` — she ingests GitHub + your personal folder +
   project folders, writes a proposal to `content/proposed/`, and shows you a
   short diff. **Approve, revise, or reject.**
3. On approval she updates `content/profile.json`, validates, mirrors to the
   portfolio, and can rebuild/deploy when you say so.
4. For a CV: give her a job description → she mails a tailored one-page CV
   (`content/cvs/<role>.html` + `.pdf`).

## Verify / build manually

```bash
node scripts/github-snapshot.mjs     # pull GitHub profile+repos → snapshots/github.json
node scripts/personal-snapshot.mjs   # extract CV/statement/results text → snapshots/personal
node scripts/projects-snapshot.mjs   # scan your project folders → snapshots/projects
node scripts/validate-profile.mjs    # check content/profile.json against the schema
node scripts/diff-profile.mjs <proposal.json>   # human diff vs current SSOT
node scripts/sync-site.mjs           # mirror SSOT → portfolio

cd portfolio
npm install && npm run dev           # preview the live site
npm run build && npm start          # production
```

## Data privacy

- `content/snapshots/` holds raw extracted text (CVs, scanned documents) and is
  **gitignored** — never committed.
- Only the SSOT (`content/profile.json`), your approvals, and the site itself
  get committed.
- Set `GITHUB_TOKEN` to avoid public-API rate limits when syncing.

## Deploy (one time)

1. Push this repo to GitHub.
2. Import the repo into **Vercel** (it auto-detects `vercel.json` → builds `portfolio/`).
3. Every approved change `git push` → auto-deploys.