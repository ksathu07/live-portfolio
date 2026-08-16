#!/usr/bin/env node
/**
 * CLARA Pipeline Runner
 * Runs the full portfolio pipeline:
 * 1. GitHub snapshot (pull repos from GitHub API)
 * 2. Projects snapshot (scan local project folders)
 * * 3. Validate profile (check against schema)
 * 4. Sync site (mirror to portfolio)
 */

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scriptsDir = __dirname;

function run(script, args = []) {
    console.log(`\n=== Running: node scripts/${script} ${args.join(' ')} ===`);
    const result = spawnSync('node', [path.join(scriptsDir, script), ...args], {
        cwd: path.dirname(scriptsDir),
        stdio: 'inherit',
        shell: true,
    });
    return result.status === 0;
}

console.log('========================================');
console.log('  CLARA Portfolio Pipeline');
console.log('========================================');

// Step 1: GitHub snapshot
const step1 = run('github-snapshot.mjs');
if (!step1) console.log('⚠️ GitHub snapshot failed (continuing...)');

// Step 2: Projects snapshot
const step2 = run('projects-snapshot.mjs');
if (!step2) console.log('⚠️ Projects snapshot failed (continuing...)');

// Step 3: Validate profile
const step3 = run('validate-profile.mjs');
if (!step3) console.log('⚠️ Profile validation failed (continuing...)');

// Step 4: Sync site
const step4 = run('sync-site.mjs');
if (!step4) console.log('⚠️ Site sync failed');

console.log('\n========================================');
console.log('  CLARA Pipeline Complete');
console.log('========================================');
