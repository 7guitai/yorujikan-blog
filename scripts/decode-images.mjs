import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, 'images-src');
const outImages = join(root, 'public', 'images');
mkdirSync(outImages, { recursive: true });

if (!existsSync(srcDir)) {
  console.log('images-src not found, skipping image decode');
} else {
  // manifest.txt があれば、そこに列挙されたファイルだけを復元する
  // （ブランチ運用時に他サイトの画像を復元しないため）。
  const manifestPath = join(srcDir, 'manifest.txt');
  let targets = null;
  if (existsSync(manifestPath)) {
    targets = new Set(
      readFileSync(manifestPath, 'utf8')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((name) => `${name}.b64`)
    );
  }
  for (const name of readdirSync(srcDir)) {
    if (!name.endsWith('.b64')) continue;
    if (targets && !targets.has(name)) continue;
    const target = name.slice(0, -4); // strip .b64
    const buf = Buffer.from(readFileSync(join(srcDir, name), 'utf8').trim(), 'base64');
    const out = target === 'ogp.png' ? join(root, 'public', 'ogp.png') : join(outImages, target);
    writeFileSync(out, buf);
    console.log(`decoded ${name} -> ${out} (${buf.length} bytes)`);
  }
}
