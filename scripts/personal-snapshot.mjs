import { config, claraPaths, ensureDir, writeJson, listTopLevel, isFile } from './lib.mjs'
import path from 'node:path'
import { writeFileSync, readdirSync } from 'node:fs'
import { docxOrPdfText } from './zip.mjs'

const personalDir = config.sources.personalFolder
const outDir = path.join(claraPaths().snapshots, 'personal')

const TYPES = [
  ['duplicate', / \(2\)\.\w+$/i],
  ['resume', /resume|_cv|curriculum/i],
  ['statement', /personal.?statement/i],
  ['academic', /(igcse|ial|ol|al|resultssheet|_results?)/i],
  ['essay', /assignment|architecture/i],
  ['certificate', /certificate|cert|docfilename/i],
  ['admission', /admission|invoice|receipt|payment|ticket|enrol|acceptance|ack_/i],
  ['id', /passport|nic|photo|signature/i],
  ['family', /father|mother|sister|lakshiyya|nalini|lawkshmy/i],
  ['other', /.*/],
]

function classify(name) {
  for (const [type, re] of TYPES) if (re.test(name)) return type
  return 'other'
}

async function extractText(file, ext) {
  try {
    const text = docxOrPdfText(file, ext)
    return text && text.trim() ? text.trim() : null
  } catch {
    return null
  }
}

async function main() {
  ensureDir(outDir)
  const files = readdirSync(personalDir)
    .filter((n) => /\.(docx|pdf)$/i.test(n))
    .map((n) => n.replace(/ \(2\)(?=\.)/i, ''))
  const unique = [...new Set(files)].sort()

  const index = []
  for (const name of unique) {
    index.push({ name, type: classify(name) })
  }

  const extracted = []
  const writtenBases = new Set()
  for (const name of unique) {
    const type = classify(name)
    if (!['resume', 'statement', 'academic', 'essay', 'certificate'].includes(type)) continue
    const ext = path.extname(name).slice(1).toLowerCase()
    if (ext !== 'docx' && ext !== 'pdf') continue
    const base = name.replace(/\.[^.]+$/, '').replace(/[^\w-]+/g, '_').toLowerCase()
    if (writtenBases.has(base)) continue
    const picked = isFile(path.join(personalDir, name)) ? name : name.replace(/\.[^.]+$/, ' (2)$&')
    if (!isFile(path.join(personalDir, picked))) continue
    const text = await extractText(path.join(personalDir, picked), ext)
    if (!text) { console.log(`[no-text-layer] ${name}`); continue }
    const target = path.join(outDir, `${base}.txt`)
    writeFileSync(target, `# source: ${picked}\n\n${text}\n`, 'utf8')
    writtenBases.add(base)
    extracted.push(name)
  }

  writeJson(path.join(outDir, 'index.json'), {
    folder: personalDir,
    fetchedAt: new Date().toISOString(),
    files: index,
  }, 2)
  console.log(`personal snapshot: ${index.length} files indexed, ${extracted.length} with extracted text`)
}

main().catch((e) => { console.error(e); process.exit(1) })