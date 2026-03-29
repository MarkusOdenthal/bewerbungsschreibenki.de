#!/usr/bin/env tsx

/**
 * IndexNow submission script — submits new pages to search engines for instant indexing.
 *
 * Usage: npm run submit-indexnow
 *
 * Requires:
 *   - PUBLIC_SITE_URL env var (production domain, e.g. https://example.com)
 *   - INDEXNOW_API_KEY env var
 *   - API key verification file at public/{api-key}.txt
 */

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

const EXCLUDED_PAGES: string[] = [];

interface History {
  version: string;
  domain: string;
  lastSubmission: string | null;
  submittedUrls: string[];
}

function log(msg: string): void {
  console.log(`[IndexNow] ${msg}`);
}

async function runBuild(): Promise<void> {
  log('Building site...');
  return new Promise((resolve, reject) => {
    const build = spawn('npm', ['run', 'build'], { cwd: PROJECT_ROOT, stdio: 'inherit' });
    build.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`Build failed (exit ${code})`))));
    build.on('error', (e) => reject(e));
  });
}

async function parseSitemap(path: string, domain: string): Promise<string[]> {
  const xml = await readFile(path, 'utf-8');
  const urls: string[] = [];
  for (const m of xml.matchAll(/<loc>(.*?)<\/loc>/gi)) {
    try {
      const u = new URL(m[1].trim());
      const p = u.pathname.replace(/\/+$/, '') || '/';
      if (u.origin === new URL(domain).origin && !EXCLUDED_PAGES.includes(p)) urls.push(p);
    } catch {
      /* skip */
    }
  }
  return urls;
}

async function main(): Promise<void> {
  const domain = process.env.PUBLIC_SITE_URL;
  const apiKey = process.env.INDEXNOW_API_KEY;

  if (!domain) {
    console.error('[IndexNow] PUBLIC_SITE_URL not set');
    process.exit(1);
  }
  if (!apiKey) {
    console.error('[IndexNow] INDEXNOW_API_KEY not set');
    process.exit(1);
  }

  await runBuild();

  const sitemapPath = join(PROJECT_ROOT, 'dist', 'sitemap-0.xml');
  if (!existsSync(sitemapPath)) {
    console.error('[IndexNow] sitemap-0.xml not found in dist/');
    process.exit(1);
  }

  const currentUrls = await parseSitemap(sitemapPath, domain);
  log(`Found ${currentUrls.length} URLs in sitemap`);

  const historyPath = join(PROJECT_ROOT, '.indexnow-history.json');
  let history: History;
  if (existsSync(historyPath)) {
    history = JSON.parse(await readFile(historyPath, 'utf-8'));
  } else {
    history = { version: '1.0', domain, lastSubmission: null, submittedUrls: [] };
  }

  const submitted = new Set(history.submittedUrls);
  const newUrls = currentUrls.filter((u) => !submitted.has(u));

  if (newUrls.length === 0) {
    log('No new pages — nothing to submit');
    process.exit(0);
  }

  log(`Submitting ${newUrls.length} new URL(s)...`);

  const host = new URL(domain).hostname;
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host, key: apiKey, urlList: newUrls.map((p) => domain + p) })
  });

  if (res.status !== 200 && res.status !== 202) {
    console.error(`[IndexNow] API error: ${res.status} ${res.statusText}`);
    process.exit(1);
  }

  log(`Submitted successfully (HTTP ${res.status})`);

  history.submittedUrls = [...new Set([...history.submittedUrls, ...newUrls])];
  history.lastSubmission = new Date().toISOString();
  await writeFile(historyPath, JSON.stringify(history, null, 2), 'utf-8');

  log(`Total: ${currentUrls.length} pages, ${newUrls.length} new`);
}

main();
