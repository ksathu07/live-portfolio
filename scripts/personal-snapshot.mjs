import { config, claraPaths, ensureDir, writeJson, listTopLevel, isFile, isDir } from './lib.mjs'
import path from 'node:path'
import { writeFileSync, readdirSync, existsSync, readFileSync } from 'node:fs'
import { docxOrPdfText } from './zip.mjs'

const personalDir = config.sources.personalFolder
const outDir = path.join(claraPaths().snapshots, 'personal')

// Subfolders CLARA understands. Anything not in this list is scanned as 'uncategorized'.
const SUBFOLDERS = {
  docs: { types: ['document'], extractText: ['docx', 'pdf', 'txt', 'md'] },
  certificates: { types: ['document', 'image'], extractText: ['docx', 'pdf'] },
  'video-proof': { types: ['video', 'link'], extractText: [] },
  'portfolio-proof': { types: ['image', 'document', 'link'], extractText: [] },
  'projects-proof': { types: ['mixed'], extractText: [] },
}

const MEDIA_EXTS = {
  image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'avif'],
  video: ['mp4', 'mov', 'mkv', 'webm', 'avi'],
  audio: ['mp3', 'wav', 'ogg'],
  document: ['docx', 'pdf', 'doc', 'txt', 'md', 'rtf', 'csv'],
}

function classifyFile(name) {
  const ext = path.extname(name).slice(1).toLowerCase()
  for (const [kind, exts] of Object.entries(MEDIA_EXTS)) {
    if (exts.includes(ext)) return kind
  }
  return ext === 'txt' ? 'text' : 'other'
}

function readLinksFile(filePath) {
  if (!existsSync(filePath)) return []
  const text = readFileSync(filePath, 'utf8')
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
}

function safeReaddir(dir) {
  try {
    return readdirSync(dir, { withFileTypes: true })
  } catch {
    return []
  }
}

async function extractText(file, ext) {
  try {
    const text = docxOrPdfText(file, ext)
    return text && text.trim() ? text.trim() : null
  } catch {
    return null
  }
}

async function scanSubfolder(name, absPath) {
  const spec = SUBFOLDERS[name] || { types: ['mixed'], extractText: [] }
  const entries = safeReaddir(absPath)
  const files = []
  const media = []
  const links = []
  const docs = []

  for (const entry of entries) {
    const childAbs = path.join(absPath, entry.name)
    if (entry.isDirectory()) {
      // Recurse one level for projects-proof/<project>
      const sub = await scanSubfolder(entry.name, childAbs)
      files.push({ name: entry.name, type: 'directory', children: sub.files.length })
      media.push(...sub.media.map((m) => ({ ...m, path: path.join(entry.name, m.path) })))
      links.push(...sub.links.map((l) => ({ ...l, source: path.join(entry.name, l.source || '') })))
      docs.push(...sub.docs.map((d) => ({ ...d, path: path.join(entry.name, d.path) })))
      continue
    }

    if (!entry.isFile()) continue
    const ext = path.extname(entry.name).slice(1).toLowerCase()
    const kind = classifyFile(entry.name)

    files.push({ name: entry.name, kind, ext })

    if (kind === 'image' || kind === 'video' || kind === 'audio') {
      media.push({
        path: entry.name,
        kind,
        ext,
        subfolder: name,
        size: null,
      })
    }

    if (kind === 'document' && entry.name.toLowerCase() === 'links.txt') {
      const parsed = readLinksFile(childAbs)
      for (const line of parsed) {
        links.push({
          url: line,
          label: line,
          source: path.join(name, entry.name),
        })
      }
    }

    if (kind === 'text' && entry.name.toLowerCase() === 'links.txt') {
      const parsed = readLinksFile(childAbs)
      for (const line of parsed) {
        links.push({
          url: line,
          label: line,
          source: path.join(name, entry.name),
        })
      }
    }

    if (['docx', 'pdf'].includes(ext) && spec.extractText.includes(ext)) {
      const text = await extractText(childAbs, ext)
      if (text) {
        docs.push({
          path: entry.name,
          ext,
          subfolder: name,
          chars: text.length,
        })
        const base = entry.name.replace(/\.[^.]+$/, '').replace(/[^\w-]+/g, '_').toLowerCase()
        const target = path.join(outDir, `${name}__${base}.txt`)
        writeFileSync(target, `# source: ${name}/${entry.name}\n\n${text}\n`, 'utf8')
      }
    }
  }

  return { files, media, links, docs }
}

async function main() {
  ensureDir(outDir)

  const topLevel = safeReaddir(personalDir)
  const subfolders = []

  let totalFiles = 0
  let totalMedia = 0
  let totalLinks = 0
  let totalDocs = 0
  let totalExtracted = 0

  const allMedia = []
  const allLinks = []
  const allDocs = []

  for (const entry of topLevel) {
    if (!entry.isDirectory()) continue
    const absPath = path.join(personalDir, entry.name)
    const scanned = await scanSubfolder(entry.name, absPath)

    totalFiles += scanned.files.length
    totalMedia += scanned.media.length
    totalLinks += scanned.links.length
    totalDocs += scanned.docs.length
    totalExtracted += scanned.docs.length

    allMedia.push(...scanned.media)
    allLinks.push(...scanned.links)
    allDocs.push(...scanned.docs)

    subfolders.push({
      name: entry.name,
      path: absPath,
      fileCount: scanned.files.length,
      mediaCount: scanned.media.length,
      linksCount: scanned.links.length,
      docCount: scanned.docs.length,
    })
  }

  // Root-level docs (backwards compat — loose .docx/.pdf at the root)
  const rootDocs = []
  for (const entry of topLevel) {
    if (!entry.isFile()) continue
    const ext = path.extname(entry.name).slice(1).toLowerCase()
    if (!['docx', 'pdf'].includes(ext)) continue
    const absPath = path.join(personalDir, entry.name)
    const text = await extractText(absPath, ext)
    if (text) {
      rootDocs.push({ name: entry.name, ext, chars: text.length })
      const base = entry.name.replace(/\.[^.]+$/, '').replace(/[^\w-]+/g, '_').toLowerCase()
      const target = path.join(outDir, `root__${base}.txt`)
      writeFileSync(target, `# source: ${entry.name}\n\n${text}\n`, 'utf8')
    }
  }

  const index = {
    schema: 'personal-snapshot/v2',
    folder: personalDir,
    fetchedAt: new Date().toISOString(),
    subfolders,
    summary: {
      totalSubfolders: subfolders.length,
      totalFiles,
      totalMedia,
      totalLinks,
      totalDocs,
      totalExtracted,
    },
    media: allMedia,
    links: allLinks,
    docs: allDocs,
    rootDocs,
  }

  writeJson(path.join(outDir, 'index.json'), index, 2)

  console.log(`personal snapshot: ${subfolders.length} subfolders, ${totalFiles} files`)
  console.log(`  media: ${totalMedia} (images/videos), links: ${totalLinks}, docs: ${totalDocs}, extracted: ${totalExtracted}`)
}

main().catch((e) => { console.error(e); process.exit(1) })
