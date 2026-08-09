import { readFileSync } from 'node:fs'
import { rootDir } from './lib.mjs'
import path from 'node:path'

const DEFAULT = path.join(rootDir, 'content', 'profile.json')
const target = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT

let errors = []
let warnings = []

function err(msg) { errors.push(msg) }
function warn(msg) { warnings.push(msg) }

let data
try { data = JSON.parse(readFileSync(target, 'utf8')) }
catch (e) { console.error(`Cannot read JSON: ${target}`); process.exit(2) }

if (data.schema !== 'profile/v1') err(`schema must be "profile/v1" (got ${data.schema ?? 'missing'})`)
if (!data.profile?.name) err('profile.name is required')
if (!data.profile?.headline) err('profile.headline is required')
if (!data.profile?.tagline) err('profile.tagline is required')

const ids = new Set()
for (const p of data.projects ?? []) {
  if (!p.id) err(`project "${p.name}" missing id`)
  else if (ids.has(p.id)) err(`duplicate project id: ${p.id}`)
  else ids.add(p.id)
  if (!p.name) err('project entry missing name')
  if (!p.description) warn(`project "${p.id ?? p.name}" has no description`)
}

const DATE = /^\d{4}(-(0[1-9]|1[0-2]))?$/
for (const [section, arr] of [['education', data.education ?? []], ['experience', data.experience ?? []], ['achievements', data.achievements ?? []], ['certifications', data.certifications ?? []], ['volunteering', data.volunteering ?? []]]) {
  if (!Array.isArray(arr)) { err(`${section} must be an array`); continue }
  for (const item of arr) {
    for (const k of ['startYear', 'endYear', 'date', 'year', 'startDate', 'endDate']) {
      const v = item?.[k]
      if (v != null && !(v === 'present' || DATE.test(v))) warn(`${section}: "${item?.title ?? item?.name ?? item?.role ?? 'item'}" has malformed ${k}: ${v}`)
    }
  }
}

const skillNames = new Set()
for (const cat of data.skills ?? []) for (const it of cat.items ?? []) skillNames.add(it.name)

for (const p of data.projects ?? []) {
  for (const t of p.tech ?? []) if (!skillNames.has(t)) warn(`project "${p.id}" tech "${t}" not listed in skills`)
}

if (!Array.isArray(data.meta?.sourceFiles)) warn('meta.sourceFiles missing')
if (data.meta?.approvedAt) {
  const d = new Date(data.meta.approvedAt)
  if (isNaN(d)) err(`meta.approvedAt is not a valid date: ${data.meta.approvedAt}`)
}

const unknown = Object.keys(data).filter((k) => !['schema', 'profile', 'education', 'experience', 'projects', 'achievements', 'skills', 'certifications', 'volunteering', 'interests', 'meta'].includes(k))
if (unknown.length) err(`unknown top-level keys: ${unknown.join(', ')}`)

console.log(`Validating ${target}\n`)
for (const w of warnings) console.log(`  WARN  ${w}`)
for (const e of errors) console.log(`  ERROR ${e}`)

if (!errors.length && !warnings.length) console.log('  PASS — profile is well-formed.\n')
else if (!errors.length) console.log(`  PASS — well-formed, ${warnings.length} warning(s).\n`)
else { console.log(`  FAIL — ${errors.length} error(s).\n`); process.exit(1) }