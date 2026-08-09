import { copyFileSync, mkdirSync } from 'node:fs'
import { claraPaths } from './lib.mjs'
import path from 'node:path'

const { profile, portfolioContent, cvs } = claraPaths()

// content/cvs and content/jobs are created lazily by cv-build; jobs is empty until
// a job description is provided.
mkdirSync(path.dirname(portfolioContent), { recursive: true })
copyFileSync(profile, portfolioContent)
mkdirSync(path.dirname(cvs), { recursive: true })
console.log(`Mirrored SSOT -> ${portfolioContent}`)