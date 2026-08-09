import { readFileSync, writeFileSync } from 'node:fs'
import { rootDir, claraPaths, ensureDir, readJson, isFile, slugify } from './lib.mjs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const role = process.argv[2]
if (!role) { console.error('usage: node scripts/cv-build.mjs <role> [--no-pdf]'); process.exit(1) }
const noPdf = process.argv.includes('--no-pdf')

const p = claraPaths()
const profile = readJson(p.profile)
const jdFile = path.join(p.jobs, `${role}.md`)
const jd = isFile(jdFile) ? readFileSync(jdFile, 'utf8') : null
const selectionFile = path.join(p.cvs, `${role}.selection.json`)
const selection = isFile(selectionFile) ? readJson(selectionFile) : null

if (!jd) console.warn(`[warn] no job description at content/jobs/${role}.md — generic CV (still 100% from profile.json)`)

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// ---- selection resolution ----
function pickSkills() {
  const all = (profile.skills ?? []).flatMap((c) => c.items.map((i) => ({ ...i, category: c.category })))
  if (!selection?.skills || !selection.skills.length) return all
  const wanted = new Set(selection.skills)
  return all.filter((i) => wanted.has(i.name))
}
function pickProjects() {
  const all = profile.projects ?? []
  if (!selection?.projects || !selection.projects.length) return all
  const wanted = new Set(selection.projects)
  return all.filter((x) => wanted.has(x.id))
}
function pickExperience() {
  const all = profile.experience ?? []
  if (!selection?.experience || !selection.experience.length) return all
  const wanted = new Set(selection.experience.map(String))
  return all.filter((x, i) => wanted.has(String(i)) || (x.role && wanted.has(x.role)))
}
function pickAchievements() {
  const all = profile.achievements ?? []
  if (!selection?.achievements || !selection.achievements.length) return all
  const wanted = new Set(selection.achievements.map(String))
  return all.filter((x, i) => wanted.has(String(i)) || (x.title && wanted.has(x.title)))
}

const skills = pickSkills()
const projects = pickProjects()
const experience = pickExperience()
const achievements = pickAchievements()
const education = profile.education ?? []

const pr = profile.profile ?? {}
const headline = selection?.headline ?? pr.headline ?? ''
const summary = selection?.summary ?? pr.summary ?? ''
const link = (k) => (pr.links && pr.links[k]) || ''

function dateRange(x) {
  if (x.startDate) {
    const s = x.startDate
    const e = x.present ? 'Present' : (x.endDate ?? '')
    return `${s}${e ? ' — ' + e : ''}`
  }
  if (x.startYear) return `${x.startYear}${x.endYear === 'present' ? ' — Present' : x.endYear ? ' — ' + x.endYear : ''}`
  return ''
}

const sidebar = `
  <div class="sidebar">
    <h1>${esc(pr.name)}</h1>
    <p class="headline">${esc(headline)}</p>
    ${pr.location ? `<p class="muted">${esc(pr.location)}</p>` : ''}
    <p class="contact">
      ${pr.email ? `<span>${esc(pr.email)}</span>` : ''}
      ${pr.phone ? `<span>${esc(pr.phone)}</span>` : ''}
      ${link('github') ? `<span>github: ${esc(link('github').replace(/^https?:\/\//, '').replace(/\/$/, ''))}</span>` : ''}
      ${link('linkedin') ? `<span>linkedin: ${esc(link('linkedin').replace(/^https?:\/\//, '').replace(/\/$/, ''))}</span>` : ''}
    </p>
    ${skills.length ? `
      <section>
        <h2>Skills</h2>
        <div class="chips">
          ${skills.map((s) => `<span class="chip">${esc(s.name)}</span>`).join('')}
        </div>
      </section>` : ''}
    ${education.length ? `
      <section>
        <h2>Education</h2>
        ${education.map((e) => `<p class="edu"><strong>${esc(e.degree)}</strong>${e.field ? ' — ' + esc(e.field) : ''}<br/><span>${esc(e.institution)}</span>${e.startYear ? ' · ' + esc(e.startYear) : ''}${e.endYear === 'present' ? ' — Present' : e.endYear ? ' — ' + esc(e.endYear) : ''}</p>`).join('')}
      </section>` : ''}
  </div>`

function main() {
  const exp = experience.length ? `
    <section>
      <h2>Experience & Leadership</h2>
      ${experience.map((x) => `
        <div class="entry">
          <div class="row"><strong>${esc(x.role)}</strong><span class="muted">${esc(dateRange(x))}</span></div>
          <div class="muted">${esc(x.organization)}</div>
          ${(x.bullets ?? []).length ? `<ul>${x.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
        </div>`).join('')}
    </section>` : ''

  const proj = projects.length ? `
    <section>
      <h2>Selected Projects</h2>
      ${projects.map((x) => `
        <div class="entry">
          <div class="row"><strong>${esc(x.name)}</strong><span class="muted">${esc(x.year ?? '')}${x.tech?.length ? ' · ' + esc(x.tech.join(', ')) : ''}</span></div>
          <p>${esc(x.description)}</p>
        </div>`).join('')}
    </section>` : ''

  const ach = achievements.length ? `
    <section>
      <h2>Achievements</h2>
      <ul class="tight">${achievements.map((a) => `<li><strong>${esc(a.title)}</strong>${a.date ? ' · ' + esc(a.date) : ''}${a.details ? ' — ' + esc(a.details) : ''}</li>`).join('')}</ul>
    </section>` : ''

  const summaryHtml = summary ? `<p class="summary">${esc(summary)}</p>` : ''

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${esc(pr.name)} — CV</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; color:#1a1f2e; background:#e8eaf0; }
  .page { width:210mm; min-height:297mm; margin:0 auto; background:#fff; display:grid; grid-template-columns:62mm 1fr; }
  .sidebar { background:#111827; color:#e5e7eb; padding:10mm 6mm; }
  .sidebar h1 { font-size:16pt; color:#fff; letter-spacing:.5px; line-height:1.2; margin-bottom:2mm; }
  .headline { font-size:8.5pt; color:#7dd3fc; margin-bottom:2mm; }
  .muted { color:#9ca3af; font-size:8pt; }
  .contact span { display:block; font-size:8pt; color:#cbd5e1; margin-top:1mm; word-break:break-all; }
  .sidebar section { margin-top:5mm; }
  .sidebar h2 { font-size:9pt; color:#fff; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid #374151; padding-bottom:1mm; margin-bottom:2mm; }
  .chips { display:flex; flex-wrap:wrap; gap:1mm; }
  .chip { font-size:7.5pt; background:#1f2937; border:1px solid #374151; color:#d1d5db; padding:0.6mm 2mm; border-radius:2mm; }
  .edu { font-size:8pt; margin-bottom:2mm; line-height:1.4; }
  .edu span { color:#9ca3af; }
  .main { padding:10mm 8mm; }
  .main h2 { font-size:11pt; color:#111827; text-transform:uppercase; letter-spacing:1.2px; border-bottom:2px solid #111827; padding-bottom:1mm; margin:5mm 0 3mm; }
  .main h2:first-of-type { margin-top:0; }
  .summary { font-size:9pt; line-height:1.5; color:#374151; }
  .entry { margin-bottom:3mm; }
  .row { display:flex; justify-content:space-between; gap:4mm; font-size:9.5pt; }
  .entry p { font-size:8.5pt; color:#374151; line-height:1.4; margin-top:0.8mm; }
  ul { font-size:8.5pt; color:#374151; margin-left:4mm; margin-top:1mm; }
  ul li { margin-bottom:0.6mm; line-height:1.35; }
  ul.tight li { font-size:8.5pt; line-height:1.4; }
  @media print { body { background:#fff; } .page { margin:0; } @page { size:A4; margin:0; } }
</style>
</head>
<body><div class="page">${sidebar}<div class="main">${summaryHtml}${exp}${proj}${ach}</div></div></body>
</html>`

  ensureDir(p.cvs)
  const htmlOut = path.join(p.cvs, `${role}.html`)
  writeFileSync(htmlOut, html, 'utf8')
  console.log(`CV HTML -> ${htmlOut}`)

  if (!noPdf) generatePdf(htmlOut, path.join(p.cvs, `${role}.pdf`))
}

function generatePdf(htmlFile, pdfFile) {
  const candidates = [
    process.env.EDGE_PATH,
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ].filter(Boolean)
  const edge = candidates.find((c) => isFile(c))
  if (!edge) { console.warn('[warn] Edge not found; PDF skipped — open the HTML and print to PDF'); return }
  const fileUrl = 'file:///' + htmlFile.replace(/\\/g, '/')
  const res = spawnSync(edge, ['--headless', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${pdfFile}`, fileUrl], { encoding: 'utf8', timeout: 60000 })
  if (isFile(pdfFile)) console.log(`CV PDF  -> ${pdfFile}`)
  else console.warn(`[warn] PDF generation failed: ${(res.stderr || res.stdout || '').slice(0, 300)}`)
}

main()