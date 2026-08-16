import { config, claraPaths, readJson, writeJson, ensureDir, slugify } from './lib.mjs'
import path from 'node:path'
import { existsSync } from 'node:fs'

const personalDir = config.sources.personalFolder
const snapshotFile = path.join(claraPaths().snapshots, 'personal', 'index.json')

const KIND_BY_MEDIA_KIND = {
  image: 'image',
  video: 'video',
  audio: 'media',
  document: 'document',
  link: 'link',
}

function inferKindFromSubfolder(subfolder) {
  if (!subfolder) return 'media'
  if (subfolder.includes('video')) return 'video'
  if (subfolder.includes('certificate')) return 'document'
  if (subfolder.includes('portfolio')) return 'image'
  return 'media'
}

function buildProofFromSnapshot(snapshot) {
  const proof = {}

  // Media (images + videos)
  for (const m of snapshot.media || []) {
    const slug = slugify((m.path || m.name || 'proof').replace(/\.[^.]+$/, '')).replace(/-/g, '_')
    const id = `${m.subfolder || 'media'}_${slug}`
    proof[id] = {
      id,
      kind: KIND_BY_MEDIA_KIND[m.kind] || inferKindFromSubfolder(m.subfolder),
      path: m.path || m.name,
      source: `personal/${m.subfolder || 'uncategorized'}`,
      label: m.path || m.name,
    }
  }

  // Links
  let linkIdx = 0
  for (const l of snapshot.links || []) {
    const url = l.url
    if (!url) continue
    let label = l.label
    if (!label || label === url) {
      try {
        const u = new URL(url)
        label = u.hostname
      } catch {
        label = `link_${linkIdx}`
      }
    }
    const id = `link_${slugify(label).slice(0, 40) || linkIdx}`
    proof[id] = {
      id,
      kind: 'link',
      url,
      source: l.source || 'personal',
      label,
    }
    linkIdx++
  }

  return proof
}

function suggestCertificationsFromSnapshot(snapshot, proof) {
  const certs = []
  const proofList = Object.values(proof)

  // Look in certificates subfolder for image/pdf files (name may vary, e.g. "Course Certificates")
  const certSub = (snapshot.subfolders || []).find((s) => s.name.toLowerCase().includes('certificate'))
  if (certSub && certSub.mediaCount > 0) {
    const certProofs = proofList.filter((p) => String(p.source).includes('certificates'))
    for (const p of certProofs) {
      const title = (p.label || 'Certificate')
        .replace(/\.[^.]+$/, '')
        .replace(/[_-]+/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .trim()
      certs.push({
        title,
        issuer: null,
        date: null,
        year: null,
        proof: { id: p.id, kind: p.kind },
        source: `personal/certificates/${p.path}`,
      })
    }
  }

  return certs
}

function suggestVideoPortfolioFromSnapshot(snapshot, proof) {
  const videoSub = (snapshot.subfolders || []).find((s) => s.name.toLowerCase().includes('video'))
  if (!videoSub) return null

  const proofList = Object.values(proof)
  const videoProofs = proofList.filter(
    (p) => String(p.source).includes('video') || p.kind === 'video' || p.kind === 'image'
  )

  const items = []
  for (const p of videoProofs) {
    const ext = path.extname(p.path || '').slice(1).toLowerCase()
    const isVideo = ['mp4', 'mov', 'mkv', 'webm', 'avi'].includes(ext)
    const title = (p.path || p.label || 'Video')
      .replace(/\.[^.]+$/, '')
      .replace(/[_-]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim()
    items.push({
      title,
      description: null,
      role: 'Editor',
      year: null,
      tools: ['Adobe Premiere Pro', 'Adobe After Effects'],
      links: isVideo ? { watch: p.url || null, youtube: null, vimeo: null, embed: null } : {},
      proof: { id: p.id, kind: p.kind },
    })
  }

  if (!items.length) return null

  return {
    headline: 'Video Editing Portfolio',
    summary: 'Selected video edits and motion design work.',
    items,
  }
}

function main() {
  if (!existsSync(snapshotFile)) {
    console.error('personal snapshot not found. Run personal-snapshot.mjs first.')
    process.exit(1)
  }
  const snapshot = readJson(snapshotFile)

  const proof = buildProofFromSnapshot(snapshot)
  const certifications = suggestCertificationsFromSnapshot(snapshot, proof)
  const videoPortfolio = suggestVideoPortfolioFromSnapshot(snapshot, proof)

  const result = {
    snapshot: snapshotFile,
    generatedAt: new Date().toISOString(),
    personalDir,
    proof,
    certifications,
    videoPortfolio,
    suggestedSections: {
      videoPortfolio: Boolean(videoPortfolio),
      certifications: certifications.length > 0,
    },
    stats: {
      proofCount: Object.keys(proof).length,
      mediaCount: (snapshot.media || []).length,
      linkCount: (snapshot.links || []).length,
      certCount: certifications.length,
      videoCount: videoPortfolio ? videoPortfolio.items.length : 0,
    },
  }

  const outFile = path.join(claraPaths().proposed, 'personal-ingest.json')
  writeJson(outFile, result, 2)

  console.log(`personal ingest: ${result.stats.proofCount} proof records generated`)
  console.log(`  media: ${result.stats.mediaCount}, links: ${result.stats.linkCount}`)
  console.log(`  suggested certs: ${result.stats.certCount}, videos: ${result.stats.videoCount}`)
}

try {
  main()
} catch (e) {
  console.error(e)
  process.exit(1)
}
