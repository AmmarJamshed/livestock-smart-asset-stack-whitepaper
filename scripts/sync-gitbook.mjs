/**
 * Sync local Markdown into the live GitBook space (update by title).
 * Env: GITBOOK_TOKEN, optional GITBOOK_SPACE
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TOKEN = process.env.GITBOOK_TOKEN;
const SPACE = process.env.GITBOOK_SPACE || '72b56F6B4Ph9sM2Cho6g';
const SITE = process.env.GITBOOK_SITE || 'site_y3PwW';
const ORG = 'j7SVn4ixz3OLy2MIcSrV';
const API = 'https://api.gitbook.com/v1';

if (!TOKEN) {
  console.error('Set GITBOOK_TOKEN');
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

async function api(method, urlPath, body) {
  const res = await fetch(`${API}${urlPath}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${urlPath} -> ${res.status}: ${text.slice(0, 600)}`);
  return text ? JSON.parse(text) : null;
}

function stripYamlFrontMatter(md) {
  return md.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
}

function readOrder() {
  const summary = fs.readFileSync(path.join(ROOT, 'SUMMARY.md'), 'utf8');
  const items = [];
  for (const line of summary.split(/\r?\n/)) {
    const link = line.match(/^\s*\*\s*\[([^\]]+)\]\(([^)]+\.md)\)/);
    if (link) items.push({ title: link[1], file: link[2] });
  }
  return items;
}

function walk(pages, map = new Map()) {
  for (const p of pages || []) {
    map.set(p.title, p.id);
    walk(p.pages, map);
  }
  return map;
}

async function main() {
  const items = readOrder();
  const cr = await api('POST', `/spaces/${SPACE}/change-requests`, {
    subject: `Visual refresh ${new Date().toISOString().slice(0, 16)}`,
  });
  const CR = String(cr.number);
  console.log('CR', CR);

  const content = await api('GET', `/spaces/${SPACE}/change-requests/${CR}/content`);
  const byTitle = walk(content.pages);
  console.log('pages in space', byTitle.size);

  // Cover is first root page (may be titled Cover & how to use)
  const coverId =
    byTitle.get('Cover & how to use') ||
    byTitle.get('Whitepaper') ||
    content.pages?.[0]?.id;

  const changes = [];
  for (const item of items) {
    const abs = path.join(ROOT, item.file);
    if (!fs.existsSync(abs)) continue;
    const md = stripYamlFrontMatter(fs.readFileSync(abs, 'utf8'));
    let pageId = byTitle.get(item.title);
    if (item.file === 'README.md') pageId = coverId;
    if (!pageId) {
      console.warn('missing page', item.title);
      continue;
    }
    changes.push({
      operation: 'update_page',
      page: pageId,
      title: item.file === 'README.md' ? 'Cover & how to use' : item.title,
      document: { markdown: md },
    });
  }

  console.log('updating', changes.length, 'pages');
  for (let i = 0; i < changes.length; i += 5) {
    const batch = changes.slice(i, i + 5);
    await api('POST', `/spaces/${SPACE}/change-requests/${CR}/content`, {
      changes: batch,
    });
    console.log('  batch', i + 1, '-', i + batch.length);
  }

  try {
    await api('POST', `/spaces/${SPACE}/change-requests/${CR}/merge`, {});
    console.log('merged');
  } catch (e) {
    console.warn(e.message);
    await api('POST', `/spaces/${SPACE}/change-requests/${CR}/update`, {});
    await api('POST', `/spaces/${SPACE}/change-requests/${CR}/merge`, {});
    console.log('merged after update');
  }

  const site = await api('GET', `/orgs/${ORG}/sites/${SITE}`);
  console.log('PUBLIC_URL=' + (site.urls?.published || ''));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
