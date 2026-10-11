/**
 * Build a print-ready PDF of the whitepaper (all chapters).
 * Output: releases/Smart-Livestock-Asset-Stack-Pakistan-Ammar-Jamshed-v1.pdf
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';
import MarkdownIt from 'markdown-it';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'releases');
const OUT_PDF = path.join(
  OUT_DIR,
  'Smart-Livestock-Asset-Stack-Pakistan-Ammar-Jamshed-v1.pdf'
);
const PRINT_HTML = path.join(OUT_DIR, 'print.html');

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

function readSummary() {
  const text = fs.readFileSync(path.join(ROOT, 'SUMMARY.md'), 'utf8');
  const items = [];
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*\*\s*\[([^\]]+)\]\(([^)]+\.md)\)/);
    if (m) items.push({ title: m[1], file: m[2] });
  }
  return items;
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

function chapterHtml(title, file) {
  let src = stripFrontMatter(fs.readFileSync(path.join(ROOT, file), 'utf8'));
  src = rewriteHints(src);
  let html = md.render(src);
  html = html.replace(
    /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
    (_m, code) => {
      const decoded = code
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"');
      return `<div class="mermaid-wrap"><pre class="mermaid">${decoded}</pre></div>`;
    }
  );
  return `<section class="chapter" id="${file.replace(/\.md$/, '')}">
  <header class="chapter-head"><p class="kicker">Smart Livestock Asset Stack</p><h1>${title}</h1></header>
  ${html}
</section>`;
}

function buildPrintDocument(items) {
  const body = items.map((i) => chapterHtml(i.title, i.file)).join('\n');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>The Smart Livestock Asset Stack — Ammar Jamshed</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;700&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet"/>
<style>
  :root {
    --forest: #1b4332;
    --paddock: #2d6a4f;
    --hay: #b7791f;
    --mint: #d8f3dc;
    --ink: #081c15;
  }
  @page { size: A4; margin: 16mm 14mm 18mm; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: "Source Sans 3", system-ui, sans-serif;
    color: var(--ink);
    line-height: 1.55;
    font-size: 11pt;
  }
  .cover {
    break-after: page;
    min-height: 240mm;
    padding: 18mm 8mm;
    background: linear-gradient(160deg, #0f2d22, #1b4332 55%, #245c44);
    color: #eef8f1;
    border-radius: 8px;
  }
  .cover .eyebrow { letter-spacing: .12em; text-transform: uppercase; font-size: 10pt; opacity: .85; }
  .cover h1 {
    font-family: Fraunces, Georgia, serif;
    font-size: 34pt;
    line-height: 1.05;
    margin: 18px 0 10px;
  }
  .cover h1 span { color: #f0c674; }
  .cover .lede { font-size: 13pt; max-width: 140mm; opacity: .92; }
  .cover .meta {
    margin-top: 28mm;
    display: grid;
    gap: 6px;
    font-size: 11pt;
  }
  .cover .badge {
    display: inline-block;
    margin-top: 14px;
    padding: 6px 12px;
    border-radius: 999px;
    background: #95d5b2;
    color: #081c15;
    font-weight: 700;
  }
  .chapter { break-before: page; }
  .chapter:first-of-type { break-before: auto; }
  .chapter-head { margin-bottom: 10px; border-bottom: 3px solid #95d5b2; padding-bottom: 8px; }
  .chapter-head .kicker {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: .1em;
    font-size: 9pt;
    color: var(--paddock);
    font-weight: 700;
  }
  .chapter-head h1, h1, h2, h3 {
    font-family: Fraunces, Georgia, serif;
    color: var(--forest);
  }
  .chapter-head h1 { margin: 4px 0 0; font-size: 22pt; }
  h2 { font-size: 15pt; margin-top: 1.2em; }
  h3 { font-size: 12.5pt; }
  a { color: #1d6a9f; text-decoration: none; }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0 14px;
    font-size: 10pt;
  }
  th, td {
    border: 1px solid rgba(27,67,50,.18);
    padding: 7px 8px;
    vertical-align: top;
    text-align: left;
  }
  th { background: #e9f5ee; }
  blockquote {
    margin: 10px 0;
    padding: 8px 12px;
    border-left: 4px solid var(--hay);
    background: #fff3cd;
  }
  pre {
    background: #123528;
    color: #e9f5ee;
    padding: 10px;
    border-radius: 8px;
    white-space: pre-wrap;
    font-size: 9pt;
  }
  .callout {
    margin: 10px 0 12px;
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid rgba(27,67,50,.15);
    break-inside: avoid;
  }
  .callout p { margin: 4px 0; }
  .callout-info { background: #d6eaf8; }
  .callout-success { background: #d8f3dc; }
  .callout-warning { background: #fff3cd; }
  .callout-danger { background: #f8d7da; }
  .mermaid-wrap {
    margin: 12px 0;
    padding: 8px;
    border: 1px solid rgba(27,67,50,.15);
    border-radius: 10px;
    background: #f4fbf6;
    break-inside: avoid;
  }
  .mermaid-wrap svg { max-width: 100% !important; height: auto !important; }
  .footer-note {
    margin-top: 20px;
    font-size: 9pt;
    color: rgba(8,28,21,.65);
  }
</style>
</head>
<body>
  <section class="cover">
    <p class="eyebrow">Independent whitepaper · Pakistan livestock & poultry</p>
    <h1>The Smart Livestock<br/><span>Asset Stack</span></h1>
    <p class="lede">From biometric passport to exchange rails — a farm-to-market design for digitizing, certifying, tokenizing, and pricing animal assets.</p>
    <span class="badge">Independent · Ammar Jamshed</span>
    <div class="meta">
      <div><strong>Author:</strong> Ammar Jamshed (personal capacity)</div>
      <div><strong>Version:</strong> 1.0 · 2026</div>
      <div><strong>Site:</strong> https://ammarjamshed.github.io/livestock-smart-asset-stack-whitepaper/</div>
      <div><strong>GitBook:</strong> https://livestockmon.gitbook.io/smart-livestock-asset-stack/</div>
      <div><strong>Stance:</strong> No institutional affiliation, endorsement, or mandate</div>
    </div>
  </section>
  ${body}
  <p class="footer-note">© Ammar Jamshed · Independent research · Not investment, legal, or medical advice.</p>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
  <script>
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
  </script>
</body>
</html>`;
}

function serveFile(filePath) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const html = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    });
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, url: `http://127.0.0.1:${port}/` });
    });
  });
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const items = readSummary();
  console.log(`› ${items.length} chapters`);
  fs.writeFileSync(PRINT_HTML, buildPrintDocument(items), 'utf8');
  console.log(`› wrote ${PRINT_HTML}`);

  const { server, url } = await serveFile(PRINT_HTML);
  console.log(`› serving ${url}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 120000 });
    // Wait for mermaid SVGs (best-effort)
    await page.waitForFunction(
      () => {
        const nodes = [...document.querySelectorAll('.mermaid')];
        if (!nodes.length) return true;
        return nodes.every(
          (n) => n.querySelector('svg') || n.getAttribute('data-processed') === 'true'
        );
      },
      { timeout: 60000 }
    ).catch(() => console.warn('› mermaid wait timed out; continuing'));
    await new Promise((r) => setTimeout(r, 1500));

    await page.pdf({
      path: OUT_PDF,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `<div style="font-size:8px;width:100%;padding:0 14mm;color:#2d6a4f;font-family:sans-serif;">Smart Livestock Asset Stack · Independent whitepaper</div>`,
      footerTemplate: `<div style="font-size:8px;width:100%;padding:0 14mm;color:#2d6a4f;font-family:sans-serif;display:flex;justify-content:space-between;"><span>Ammar Jamshed</span><span>Page <span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
      margin: { top: '18mm', bottom: '18mm', left: '12mm', right: '12mm' },
    });
    const stat = fs.statSync(OUT_PDF);
    console.log(`› PDF ${OUT_PDF}`);
    console.log(`› size ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
