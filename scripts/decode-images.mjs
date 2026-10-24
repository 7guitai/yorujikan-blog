import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, 'images-src');
const outImages = join(root, 'public', 'images');
mkdirSync(outImages, { recursive: true });

for (const name of readdirSync(srcDir)) {
  if (!name.endsWith('.b64')) continue;
  const target = name.slice(0, -4); // strip .b64
  const buf = Buffer.from(readFileSync(join(srcDir, name), 'utf8').trim(), 'base64');
  const out = target === 'ogp.png' ? join(root, 'public', 'ogp.png') : join(outImages, target);
  writeFileSync(out, buf);
  console.log(`decoded ${name} -> ${out} (${buf.length} bytes)`);
}
