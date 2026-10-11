/**
 * Build a livestock-management style reading site from GitBook Markdown.
 * Output: site/
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'site');
const BASE = process.env.SITE_BASE || '/livestock-smart-asset-stack-whitepaper';

const md = new MarkdownIt({ html: true, linkify: true, typographer: true }).use(
  anchor,
  { permalink: false, level: [2, 3] }
);

function readSummary() {
  const text = fs.readFileSync(path.join(ROOT, 'SUMMARY.md'), 'utf8');
  const items = [];
  let group = 'Whitepaper';
  for (const line of text.split(/\r?\n/)) {
    const g = line.match(/^##\s+(.+)/);
    if (g) {
      group = g[1].trim();
      continue;
    }
    const m = line.match(/^\s*\*\s*\[([^\]]+)\]\(([^)]+\.md)\)/);
    if (m) {
      items.push({
        title: m[1],
        file: m[2].replace(/\\/g, '/'),
        group,
        slug: slugify(m[1]),
      });
    }
  }
  return items;
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function stripFrontMatter(src) {
  return src.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
}

function rewriteHints(src) {
  return src.replace(
    /\{%\s*hint\s+style="(\w+)"\s*%\}([\s\S]*?)\{%\s*endhint\s*%\}/g,
    (_m, style, body) =>
      `<aside class="callout callout-${style}">${md.render(body.trim())}</aside>`
  );
}

function rewriteMdLinks(src, items) {
  const byFile = new Map(items.map((i) => [i.file, i.slug]));
  return src.replace(/\]\(([^)]+\.md)\)/g, (full, file) => {
    const clean = file.replace(/^\.\//, '');
    const slug = byFile.get(clean);
    if (!slug) return full;
    return `](${BASE}/pages/${slug}/)`;
  });
}

function extractToc(html) {
  const toc = [];
  const re = /<h([23])\s+id="([^"]+)"[^>]*>(.*?)<\/h\1>/g;
  let m;
  while ((m = re.exec(html))) {
    toc.push({
      level: Number(m[1]),
      id: m[2],
      text: m[3].replace(/<[^>]+>/g, ''),
    });
  }
  return toc;
}

function pageShell({ title, body, toc, nav, activeSlug, isHome }) {
  const tocHtml = toc.length
    ? `<nav class="page-toc" aria-label="On this page"><p class="toc-label">On this paddock</p><ul>${toc
        .map(
          (t) =>
            `<li class="l${t.level}"><a href="#${t.id}">${escapeHtml(t.text)}</a></li>`
        )
        .join('')}</ul></nav>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${escapeHtml(title)} · Smart Livestock Asset Stack</title>
<meta name="description" content="Independent farm-to-market whitepaper: biometric passport, registry, health feeds, PVARA tokens, and livestock grid for Pakistan."/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;700&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="${BASE}/assets/site.css"/>
<script defer src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
<script defer src="${BASE}/assets/site.js"></script>
</head>
<body class="${isHome ? 'is-home' : 'is-page'}">
<a class="skip" href="#main">Skip to content</a>
<div class="app-shell">
  <header class="topbar">
    <a class="brand" href="${BASE}/">
      <span class="brand-mark" aria-hidden="true">SL</span>
      <span class="brand-text">
        <strong>Smart Livestock</strong>
        <small>Asset Stack · Farm Ops View</small>
      </span>
    </a>
    <div class="topbar-actions">
      <span class="ear-tag">Independent</span>
      <a class="btn ghost" href="${BASE}/pages/download-pdf/">PDF</a>
      <a class="btn solid" href="${BASE}/pages/executive-summary/">Enter yard</a>
    </div>
    <button class="nav-toggle" type="button" aria-label="Open navigation" data-nav-toggle>☰</button>
  </header>

  <aside class="rail" data-rail>
    <p class="rail-kicker">Herd map</p>
    ${nav}
    <div class="rail-foot">
      <p>Ammar Jamshed · Independent</p>
      <a href="https://livestockmon.gitbook.io/smart-livestock-asset-stack/" target="_blank" rel="noopener">Also on GitBook</a>
    </div>
  </aside>

  <main id="main" class="main">
    ${isHome ? body : `<article class="paper">${body}</article>`}
  </main>

  ${tocHtml ? `<aside class="toc-rail">${tocHtml}</aside>` : '<aside class="toc-rail empty"></aside>'}
</div>
<script>window.__SLAS_ACTIVE__=${JSON.stringify(activeSlug || '')};window.__SLAS_BASE__=${JSON.stringify(BASE)};</script>
</body>
</html>`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildNav(items, activeSlug) {
  const groups = new Map();
  for (const item of items) {
    if (!groups.has(item.group)) groups.set(item.group, []);
    groups.get(item.group).push(item);
  }
  let html = '';
  for (const [group, pages] of groups) {
    html += `<div class="nav-group"><p class="nav-group-title">${escapeHtml(group)}</p><ul>`;
    for (const p of pages) {
      const active = p.slug === activeSlug ? ' active' : '';
      html += `<li><a class="nav-link${active}" href="${BASE}/pages/${p.slug}/"><span class="dot"></span>${escapeHtml(p.title)}</a></li>`;
    }
    html += '</ul></div>';
  }
  return html;
}

function homeBody(items) {
  const layers = [
    { code: 'L0', name: 'Barn gate', desc: 'Animal Passport & PAITS capture', href: 'field-identity-animal-passport-and-paits', tone: 'barn' },
    { code: 'L1', name: 'Title desk', desc: 'Registry company system of record', href: 'registry-company', tone: 'title' },
    { code: 'L2', name: 'Vet desk', desc: 'Daily health assessment feeds', href: 'health-assessment-and-daily-feeds', tone: 'vet' },
    { code: 'L3', name: 'Herd share', desc: 'PVARA-aligned tokenization', href: 'pvara-tokenization', tone: 'share' },
    { code: 'L4', name: 'Market board', desc: 'Livestock grid · PSX / CDC', href: 'livestock-and-poultry-grid', tone: 'board' },
  ];

  return `
<section class="hero">
  <div class="hero-copy">
    <p class="eyebrow">Pakistan · Livestock & poultry · Independent whitepaper</p>
    <h1>Smart Livestock<br/><span>Asset Stack</span></h1>
    <p class="lede">A farm-ops view of how biometric identity, health grades, tokens, and a national value grid can turn living animals into bankable assets — without institutional allegiance.</p>
    <div class="hero-cta">
      <a class="btn solid" href="${BASE}/pages/executive-summary/">Read the claim</a>
      <a class="btn ghost" href="${BASE}/pages/end-to-end-architecture-and-flows/">See the yard map</a>
    </div>
    <p class="byline">By <strong>Ammar Jamshed</strong> · Personal research · Not affiliated with any bank, exchange, or ministry</p>
  </div>
  <div class="hero-panel" aria-hidden="true">
    <div class="status-board">
      <div class="status-row"><span>Herd status</span><strong class="ok">On feed</strong></div>
      <div class="status-row"><span>Health grade</span><strong class="ok">A / B lanes</strong></div>
      <div class="status-row"><span>Mint gate</span><strong class="warn">Identity + health</strong></div>
      <div class="status-row"><span>Value board</span><strong class="sky">Daily feed</strong></div>
    </div>
    <div class="ear-tags">
      <span class="ear-tag barn">Passport ID</span>
      <span class="ear-tag title">Registry</span>
      <span class="ear-tag vet">Vet grade</span>
      <span class="ear-tag share">Token</span>
      <span class="ear-tag board">PSX / CDC</span>
    </div>
  </div>
</section>

<section class="layer-strip">
  <h2>Walk the five gates</h2>
  <p class="section-lede">Same stack as the whitepaper — shown like a livestock ops console.</p>
  <div class="layer-grid">
    ${layers
      .map(
        (l) => `<a class="layer-card tone-${l.tone}" href="${BASE}/pages/${l.href}/">
      <span class="layer-code">${l.code}</span>
      <strong>${l.name}</strong>
      <span>${l.desc}</span>
    </a>`
      )
      .join('')}
  </div>
</section>

<section class="chapter-strip">
  <h2>Full whitepaper chapters</h2>
  <div class="chapter-list">
    ${items
      .map(
        (i) => `<a href="${BASE}/pages/${i.slug}/"><span>${escapeHtml(i.group)}</span><strong>${escapeHtml(i.title)}</strong></a>`
      )
      .join('')}
  </div>
</section>`;
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeCss() {
  const css = fs.readFileSync(path.join(__dirname, 'site.css'), 'utf8');
  ensureDir(path.join(OUT, 'assets'));
  fs.writeFileSync(path.join(OUT, 'assets', 'site.css'), css);
}

function writeJs() {
  const js = `document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('[data-nav-toggle]');
  const rail = document.querySelector('[data-rail]');
  if (toggle && rail) {
    toggle.addEventListener('click', () => rail.classList.toggle('open'));
  }
  if (window.mermaid) {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'base',
      themeVariables: {
        primaryColor: '#D8F3DC',
        primaryTextColor: '#081C15',
        primaryBorderColor: '#1B4332',
        lineColor: '#2D6A4F',
        secondaryColor: '#FFF3CD',
        tertiaryColor: '#D6EAF8',
        fontFamily: 'Source Sans 3, sans-serif'
      }
    });
  }
});`;
  fs.writeFileSync(path.join(OUT, 'assets', 'site.js'), js);
}

function main() {
  const items = readSummary();
  if (fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true, force: true });
  ensureDir(OUT);
  writeCss();
  writeJs();

  const navHome = buildNav(items, '');
  fs.writeFileSync(
    path.join(OUT, 'index.html'),
    pageShell({
      title: 'Farm to Market',
      body: homeBody(items),
      toc: [],
      nav: navHome,
      activeSlug: '',
      isHome: true,
    })
  );

  for (const item of items) {
    const raw = fs.readFileSync(path.join(ROOT, item.file), 'utf8');
    let src = stripFrontMatter(raw);
    src = rewriteHints(src);
    src = rewriteMdLinks(src, items);
    let html = md.render(src);
    // Wrap mermaid code fences
    html = html.replace(
      /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
      (_m, code) =>
        `<div class="mermaid-wrap"><pre class="mermaid">${code
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')}</pre></div>`
    );
    const toc = extractToc(html);
    const dir = path.join(OUT, 'pages', item.slug);
    ensureDir(dir);
    fs.writeFileSync(
      path.join(dir, 'index.html'),
      pageShell({
        title: item.title,
        body: html,
        toc,
        nav: buildNav(items, item.slug),
        activeSlug: item.slug,
        isHome: false,
      })
    );
  }

  fs.writeFileSync(
    path.join(OUT, '.nojekyll'),
    ''
  );

  console.log(`Built ${items.length + 1} pages → ${OUT} (base=${BASE})`);
}

main();
