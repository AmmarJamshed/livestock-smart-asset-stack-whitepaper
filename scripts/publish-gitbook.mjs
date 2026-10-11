/**
 * Publish this whitepaper into GitBook via change-request content API.
 * Token from env GITBOOK_TOKEN only — never commit secrets.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TOKEN = process.env.GITBOOK_TOKEN;
const ORG = process.env.GITBOOK_ORG || 'j7SVn4ixz3OLy2MIcSrV';
const SPACE = process.env.GITBOOK_SPACE || '72b56F6B4Ph9sM2Cho6g';
const SITE = process.env.GITBOOK_SITE || 'site_y3PwW';
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
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    throw new Error(`${method} ${urlPath} -> ${res.status}: ${text.slice(0, 800)}`);
  }
  return json;
}

function stripYamlFrontMatter(md) {
  return md.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
}

function readOrder() {
  const summary = fs.readFileSync(path.join(ROOT, 'SUMMARY.md'), 'utf8');
  const items = [];
  let currentGroup = null;
  for (const line of summary.split(/\r?\n/)) {
    const part = line.match(/^##\s+(.+?)\s*$/);
    if (part) {
      currentGroup = part[1];
      items.push({ kind: 'group', title: currentGroup });
      continue;
    }
    const link = line.match(/^\s*\*\s*\[([^\]]+)\]\(([^)]+\.md)\)/);
    if (link) {
      items.push({
        kind: 'page',
        title: link[1],
        file: link[2],
        group: currentGroup,
      });
    }
  }
  return items;
}

async function ensureChangeRequest() {
  const list = await api('GET', `/spaces/${SPACE}/change-requests`);
  const open = (list.items || list || []).find?.(
    (c) => c.status === 'open' || c.status === 'draft'
  );
  if (open) {
    console.log(`› reusing CR #${open.number} status=${open.status}`);
    return String(open.number);
  }
  // Some responses nest under .items
  const items = list.items || [];
  const openItem = items.find((c) => c.status === 'open' || c.status === 'draft');
  if (openItem) {
    console.log(`› reusing CR #${openItem.number} status=${openItem.status}`);
    return String(openItem.number);
  }
  console.log('› creating change request');
  const cr = await api('POST', `/spaces/${SPACE}/change-requests`, {
    subject: 'Import Smart Livestock Asset Stack v1.0',
  });
  console.log(`› created CR #${cr.number}`);
  return String(cr.number);
}

async function getContent(cr) {
  return api('GET', `/spaces/${SPACE}/change-requests/${cr}/content`);
}

async function applyChanges(cr, changes) {
  return api('POST', `/spaces/${SPACE}/change-requests/${cr}/content`, { changes });
}

async function main() {
  const items = readOrder();
  console.log(
    `› ${items.filter((i) => i.kind === 'page').length} pages, ${items.filter((i) => i.kind === 'group').length} groups`
  );

  const CR = await ensureChangeRequest();

  let content = await getContent(CR);
  const existingByTitle = new Map();
  const walk = (pages) => {
    for (const p of pages || []) {
      existingByTitle.set(p.title, p.id);
      walk(p.pages);
    }
  };
  walk(content.pages);

  const flush = async (batch, label) => {
    if (!batch.length) return;
    console.log(`  ${label}: ${batch.length} ops`);
    await applyChanges(CR, batch);
  };

  // Update first page as cover
  const cover = items.find((i) => i.kind === 'page' && i.file === 'README.md');
  const first = content.pages?.[0];
  if (cover && first) {
    const raw = stripYamlFrontMatter(
      fs.readFileSync(path.join(ROOT, cover.file), 'utf8')
    );
    await flush(
      [
        {
          operation: 'update_page',
          page: first.id,
          title: cover.title,
          document: { markdown: raw },
        },
      ],
      'cover'
    );
  }

  // Insert groups
  const groupIds = new Map();
  for (const item of items.filter((i) => i.kind === 'group')) {
    if (existingByTitle.has(item.title)) {
      groupIds.set(item.title, existingByTitle.get(item.title));
      continue;
    }
    await flush(
      [
        {
          operation: 'insert_page',
          title: item.title,
          document: { markdown: `# ${item.title}\n` },
        },
      ],
      `group ${item.title}`
    );
    content = await getContent(CR);
    existingByTitle.clear();
    walk(content.pages);
    groupIds.set(item.title, existingByTitle.get(item.title));
  }

  // Insert pages
  for (const item of items.filter((i) => i.kind === 'page')) {
    if (item.file === 'README.md') continue;
    if (existingByTitle.has(item.title)) {
      console.log(`  skip existing: ${item.title}`);
      continue;
    }
    const abs = path.join(ROOT, item.file);
    if (!fs.existsSync(abs)) {
      console.warn(`  missing ${item.file}`);
      continue;
    }
    const md = stripYamlFrontMatter(fs.readFileSync(abs, 'utf8'));
    const op = {
      operation: 'insert_page',
      title: item.title,
      document: { markdown: md },
    };
    if (item.group && groupIds.get(item.group)) op.into = groupIds.get(item.group);
    try {
      await flush([op], item.title);
      existingByTitle.set(item.title, 'new');
    } catch (e) {
      console.error(`  FAILED ${item.title}: ${e.message}`);
    }
  }

  content = await getContent(CR);
  const countPages = (pages) =>
    (pages || []).reduce((n, p) => n + 1 + countPages(p.pages), 0);
  console.log(`› CR pages: ${countPages(content.pages)}`);

  console.log('› merging change request');
  try {
    await api('POST', `/spaces/${SPACE}/change-requests/${CR}/merge`, {});
    console.log('  merged');
  } catch (e) {
    console.warn(`  merge: ${e.message}`);
    try {
      await api('POST', `/spaces/${SPACE}/change-requests/${CR}/update`, {});
      await api('POST', `/spaces/${SPACE}/change-requests/${CR}/merge`, {});
      console.log('  merged after update');
    } catch (e2) {
      console.error(`  merge failed: ${e2.message}`);
    }
  }

  console.log('› publishing site');
  try {
    const published = await api('POST', `/orgs/${ORG}/sites/${SITE}/publish`, {});
    console.log(JSON.stringify(published, null, 2));
  } catch (e) {
    console.error(`  publish failed: ${e.message}`);
  }

  const site = await api('GET', `/orgs/${ORG}/sites/${SITE}`);
  console.log(`\n› published=${site.published} visibility=${site.visibility}`);
  console.log(`PUBLIC_URL=${site.urls?.published || '(none)'}`);
  console.log(`PREVIEW=${site.urls?.preview}`);
  console.log(`APP=${site.urls?.app}`);
  console.log(`SPACE_APP=https://app.gitbook.com/o/${ORG}/s/${SPACE}/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
