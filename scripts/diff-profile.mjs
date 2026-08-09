import { readFileSync } from 'node:fs'
import { rootDir } from './lib.mjs'
import path from 'node:path'

const BASE = path.join(rootDir, 'content', 'profile.json')
const CAND = process.argv[2] ? path.resolve(process.argv[2]) : path.join(rootDir, 'content', 'proposed', Object.keys([])[0])

function load(f) {
  try { return JSON.parse(readFileSync(f, 'utf8')) }
  catch (e) { console.error(`cannot read ${f}`); process.exit(2) }
}
const base = load(BASE)
const cand = load(CAND)
const out = []
const say = (m, n = 0) => out.push('  '.repeat(n) + m)

function diffList(baseItems, candItems, label, key = 'id') {
  const get = (x) => x[key] ?? JSON.stringify(x)
  const b = new Map(baseItems.map((x) => [get(x), x]))
  const c = new Map(candItems.map((x) => [get(x), x]))
  let n = 0
  for (const [k, v] of c) {
    if (!b.has(k)) { say(`+ [${label}] ${k}`); n++ }
    else if (JSON.stringify(v) !== JSON.stringify(b.get(k))) { say(`~ [${label}] ${k} modified`); n++ }
  }
  for (const k of b.keys()) if (!c.has(k)) { say(`- [${label}] ${k}`); n++ }
  return n
}

say(cand.file?.name ? `Comparing ${path.basename(CAND)} <> ${path.basename(BASE)}` : `Comparing proposal <> current SSOT`)

for (const section of ['education', 'experience', 'projects', 'achievements', 'certifications', 'skills', 'volunteering', 'interests']) {
  const b = base[section] ?? []
  const c = cand[section] ?? []
  if (section === 'skills' || section === 'interests') {
    if (JSON.stringify(c) !== JSON.stringify(b)) say(`~ ${section} content changed`)
    continue
  }
  diffList(b, c, section)
}

for (const k of ['name', 'headline', 'tagline', 'location', 'email', 'phone', 'availability', 'summary']) {
  const bv = base.profile?.[k] ?? null
  const cv = cand.profile?.[k] ?? null
  if (JSON.stringify(bv ?? null) !== JSON.stringify(cv ?? null)) say(`~ profile.${k}: "${bv ?? '—'}" -> "${cv ?? '—'}"`)
}

const bLinks = base.profile?.links ?? {}
const cLinks = cand.profile?.links ?? {}
for (const k of new Set([...Object.keys(bLinks), ...Object.keys(cLinks)])) {
  if (bLinks[k] !== cLinks[k]) say(`~ link.${k}: ${bLinks[k] ?? '—'} -> ${cLinks[k] ?? '—'}`)
}

if (!out.length) console.log('No differences.')
else console.log(out.join('\n'))
process.exit(out.length ? 0 : 0)