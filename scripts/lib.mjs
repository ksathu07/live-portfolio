import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const rootDir = path.resolve(__dirname, '..')

export const config = readJson(path.join(rootDir, 'clara.config.json'))

export const DEFAULT_SKIP = new Set([
  'node_modules', '.git', 'dist', '__pycache__', 'venv', '.next', 'out',
  '.local', '.agents', '.replit', 'artifacts', 'lib', 'scripts', '.venv',
])

export function claraPaths() {
  const p = config.paths
  return {
    snapshots: path.join(rootDir, p.snapshots),
    proposed: path.join(rootDir, p.proposed),
    profile: path.join(rootDir, p.profile),
    portfolioContent: path.join(rootDir, p.portfolioContent),
    cvs: path.join(rootDir, p.cvs),
    jobs: path.join(rootDir, 'content', 'jobs'),
  }
}

export function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'))
}

export function writeJson(file, data, pretty = 2) {
  ensurePath(file)
  writeFileSync(file, JSON.stringify(data, null, pretty) + '\n', 'utf8')
}

export function ensurePath(file) {
  mkdirSync(path.dirname(file), { recursive: true })
}

export function ensureDir(dir) {
  mkdirSync(dir, { recursive: true })
}

export function today() {
  return new Date().toISOString().slice(0, 10)
}

export function slugify(s) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export function isDir(p) {
  try { return statSync(p).isDirectory() } catch { return false }
}

export function isFile(p) {
  try { return statSync(p).isFile() } catch { return false }
}

export function listTopLevel(dir, opts = {}) {
  const skip = opts.skip ?? DEFAULT_SKIP
  if (!existsSync(dir)) return []
  const out = []
  for (const name of readdirSync(dir)) {
    if (name === '.' || name === '..' || skip.has(name)) continue
    const full = path.join(dir, name)
    out.push({ name, full, isDir: isDir(full) })
  }
  return out.sort((a, b) => a.name.localeCompare(b.name))
}

export function readTextBestEffort(file) {
  try { return readFileSync(file, 'utf8') } catch { return null }
}

export function dedupe(arr) {
  return [...new Set(arr)]
}

export function mediaRoot() {
  return config.sources.personalFolder
}

export function parseRootLinks(text) {
  if (!text) return []
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#') && !l.startsWith('//'))
}

export function listImages(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((n) => /\.(jpg|jpeg|png|gif|webp|svg|bmp|avif)$/i.test(n))
    .map((n) => ({ name: n, path: path.join(dir, n) }))
}

export function listVideos(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((n) => /\.(mp4|mov|mkv|webm|avi)$/i.test(n))
    .map((n) => ({ name: n, path: path.join(dir, n) }))
}

export function safeReadJson(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch {
    return null
  }
}

export function proofRecords(mediaList, sourcePrefix) {
  const out = {}
  for (const m of mediaList) {
    const slug = slugify(m.name.replace(/\.[^.]+$/, ''))
    const id = `${sourcePrefix}-${slug}`
    out[id] = {
      id,
      kind: m.kind || 'image',
      path: m.path || m.name,
      source: m.source || sourcePrefix,
      label: m.name,
    }
  }
  return out
}