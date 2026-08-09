import { config, claraPaths, ensureDir, writeJson, listTopLevel, isFile, isDir, readTextBestEffort } from './lib.mjs'
import path from 'node:path'

const projectRoot = config.sources.projectRoot
const skip = new Set(['node_modules', '.git', 'dist', 'out', 'venv', '.venv', '__pycache__', '.next', '.local', '.agents', '.replit', 'artifacts', 'bun.lock', '.npmrc', '.gitignore', '.replitignore', 'firebase-applet-config.json', 'metadata.json', '.env'])

function readTopFile(dir, names) {
  for (const n of names) {
    const p = path.join(dir, n)
    if (isFile(p)) return { name: n, content: readTextBestEffort(p) }
  }
  return null
}

function extractPackageJson(content) {
  if (!content) return {}
  try {
    const pkg = JSON.parse(content)
    return {
      name: pkg.name,
      description: pkg.description,
      main: pkg.main ?? null,
      scripts: pkg.scripts ?? {},
      dependencies: pkg.dependencies ?? {},
      devDependencies: pkg.devDependencies ?? {},
    }
  } catch {
    return { unparsable: true }
  }
}

async function main() {
  ensureDir(path.join(claraPaths().snapshots, 'projects'))
  const results = []

  for (const rel of config.projectDirectories) {
    const dir = path.join(projectRoot, rel)
    if (!isDir(dir)) { console.log(`[missing] ${rel}`); continue }
    const top = listTopLevel(dir, { skip })
    const readme = readTopFile(dir, ['README.md', 'README', 'readme.md', 'Readme.md', 'README.MD'])
    let notes = []
    if (isFile(path.join(dir, 'package.json'))) {
      const pkg = extractPackageJson(readTextBestEffort(path.join(dir, 'package.json')))
      notes.push({ file: 'package.json', deps: pkg.dependencies, devDeps: pkg.devDependencies })
    }
    if (isFile(path.join(dir, 'requirements.txt'))) notes.push({ file: 'requirements.txt', content: readTextBestEffort(path.join(dir, 'requirements.txt')) })
    if (isFile(path.join(dir, 'pyproject.toml'))) notes.push({ file: 'pyproject.toml', content: readTextBestEffort(path.join(dir, 'pyproject.toml')) })
    if (isFile(path.join(dir, 'app.py'))) notes.push({ file: 'app.py', note: 'python app present' })

    const slug = rel.replace(/[^\w-]+/g, '_').toLowerCase()
    const snapshot = {
      path: rel,
      files: top.map((f) => ({ name: f.name, isDir: f.isDir })),
      readmeFirstLines: readme?.content ? readme.content.split('\n').slice(0, 80).join('\n') : null,
      notes,
    }
    results.push(snapshot)
    writeJson(path.join(claraPaths().snapshots, 'projects', `${slug}.json`), snapshot, 2)
    console.log(`project snapshot -> projects/${slug}.json`)
  }

  writeJson(path.join(claraPaths().snapshots, 'projects-index.json'), { fetchedAt: new Date().toISOString(), root: projectRoot, projects: results.map((r) => ({ path: r.path, hasReadme: !!r.readmeFirstLines, files: r.files.length })) }, 2)
  console.log(`projects snapshot done: ${results.length} projects`)
}

main().catch((e) => { console.error(e); process.exit(1) })