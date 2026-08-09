import { config, claraPaths, ensureDir, writeJson } from './lib.mjs'
import { env } from 'node:process'

const GH = 'https://api.github.com'
const token = env.GITHUB_TOKEN || null
const username = config.owner.github_username

const headers = {
  'User-Agent': 'clara-agent',
  Accept: 'application/vnd.github+json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
}

async function gh(path, opts = {}) {
  const url = `${GH}${path}`
  const res = await fetch(url, { headers, ...opts })
  if (!res.ok) throw new Error(`GitHub ${res.status} for ${path}: ${await res.text()}`)
  return res.json()
}

async function main() {
  const [userRes, repos] = await Promise.all([
    gh(`/users/${username}`),
    gh(`/users/${username}/repos?per_page=100&sort=updated&affiliation=owner,collaborator`),
  ])

  const reposDetailed = []
  for (const r of repos) {
    if (r.fork) { reposDetailed.push({ name: r.name, fork: true, description: r.description }); continue }
    let languages = {}
    let topics = r.topics ?? []
    try {
      languages = await gh(`/repos/${username}/${r.name}/languages`)
      topics = (await gh(`/repos/${username}/${r.name}/topics`)).names ?? []
    } catch (e) {
      /* language call can be rate-limited on unauthenticated use; degrade gracefully */
    }
    reposDetailed.push({
      name: r.name,
      fork: false,
      description: r.description,
      language: r.language,
      languages,
      topics,
      stars: r.stargazers_count,
      forks: r.forks_count,
      pushedAt: r.pushed_at,
      createdAt: r.created_at,
      htmlUrl: r.html_url,
      homepage: r.homepage ?? null,
      defaultBranch: r.default_branch,
      sizeKb: r.size,
      license: r.license?.spdx_id ?? null,
      isPrivate: r.private,
      archived: r.archived,
    })
  }

  const snapshot = {
    fetchedAt: new Date().toISOString(),
    source: `https://github.com/${username}`,
    profile: {
      login: userRes.login,
      name: userRes.name,
      bio: userRes.bio,
      company: userRes.company,
      blog: userRes.blog,
      location: userRes.location,
      email: userRes.email,
      hireable: userRes.hireable,
      publicRepos: userRes.public_repos,
      publicGists: userRes.public_gists,
      followers: userRes.followers,
      following: userRes.following,
      createdAt: userRes.created_at,
      url: userRes.html_url,
    },
    repos: reposDetailed,
  }

  const outDir = claraPaths().snapshots
  ensureDir(outDir)
  const outFile = `${outDir}/github.json`
  writeJson(outFile, snapshot)
  console.log(`GitHub snapshot -> ${outFile}  (${snapshot.repos.length} repos)`)
}

main().catch((e) => { console.error(e.message); process.exit(1) })