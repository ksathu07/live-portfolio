import { copyFileSync, mkdirSync, existsSync } from 'node:fs'
import { claraPaths, config, readJson } from './lib.mjs'
import path from 'node:path'

const { profile, portfolioContent, cvs } = claraPaths()

// content/cvs and content/jobs are created lazily by cv-build; jobs is empty until
// a job description is provided.
mkdirSync(path.dirname(portfolioContent), { recursive: true })
copyFileSync(profile, portfolioContent)
mkdirSync(path.dirname(cvs), { recursive: true })
console.log(`Mirrored SSOT -> ${portfolioContent}`)

// Copy proof media (images/videos/documents referenced in the SSOT) into the
// site's public folder so the deployed site is self-contained.
const ssot = readJson(profile)
const proof = ssot.proof ?? {}
const personalRoot = config.sources.personalFolder
const publicProofDir = path.join(path.dirname(portfolioContent), '..', 'public', 'proof')

let copied = 0
let missing = 0
for (const [id, rec] of Object.entries(proof)) {
  if (!rec.path) continue
  const src = path.join(personalRoot, rec.path)
  const dest = path.join(publicProofDir, rec.path)
  if (!existsSync(src)) {
    console.warn(`  [proof] MISSING source for "${id}": ${src}`)
    missing++
    continue
  }
  mkdirSync(path.dirname(dest), { recursive: true })
  copyFileSync(src, dest)
  copied++
}
console.log(`Proof media: ${copied} copied, ${missing} missing -> ${publicProofDir}`)