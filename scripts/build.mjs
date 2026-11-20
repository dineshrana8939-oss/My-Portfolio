// Production build for GitHub Pages: validate every local asset reference, then copy site/ to dist/.
// No dependencies. Run: node scripts/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'site'), OUT = path.join(root, 'dist');
// Files the page links to that may be added later; missing = warning, not a failed build.
const OPTIONAL = new Set(['assets/cv/Dinesh_Ravikumar_CV.pdf']);

const errors = [], warnings = [];
const isLocal = (u) => u && !/^(https?:|mailto:|tel:|data:|#|\/\/)/.test(u);
function check(fromFile, ref) {
  const clean = ref.split(/[?#]/)[0];
  if (!isLocal(clean)) return;
  const abs = path.resolve(path.dirname(fromFile), clean);
  const rel = path.relative(SRC, abs).split(path.sep).join("/");
  if (!fs.existsSync(abs)) (OPTIONAL.has(rel) ? warnings : errors).push(`${path.relative(SRC, fromFile)} → ${clean}`);
}
for (const file of fs.readdirSync(SRC, { recursive: true }).map((f) => path.join(SRC, f))) {
  if (file.endsWith('.html')) {
    const html = fs.readFileSync(file, 'utf8');
    for (const m of html.matchAll(/\s(?:src|href|data-src|data-src-lg|data-src-sm|poster)="([^"]+)"/g)) check(file, m[1]);
    for (const m of html.matchAll(/\ssrcset="([^"]+)"/g)) m[1].split(',').forEach((c) => check(file, c.trim().split(/\s+/)[0]));
  }
  if (file.endsWith('.css')) for (const m of fs.readFileSync(file, 'utf8').matchAll(/url\(["']?([^"')]+)["']?\)/g)) check(file, m[1]);
}
warnings.forEach((w) => console.warn('warn  missing optional:', w));
if (errors.length) { errors.forEach((e) => console.error('error missing:', e)); process.exit(1); }

fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(SRC, OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, '.nojekyll'), ''); // serve files as-is (no Jekyll processing)
let bytes = 0; for (const f of fs.readdirSync(OUT, { recursive: true })) { const s = fs.statSync(path.join(OUT, f)); if (s.isFile()) bytes += s.size; }
console.log(`build ok: dist/ ${(bytes / 1048576).toFixed(1)} MB, ${warnings.length} warning(s)`);
