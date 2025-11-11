import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../../data');

export function dataPath(filename) {
  return path.join(dataDir, filename);
}

export async function ensureFile(file, defaultValue) {
  try { await fs.access(file); }
  catch {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(defaultValue, null, 2), 'utf-8');
  }
}

export async function readJson(file) {
  const txt = await fs.readFile(file, 'utf-8').catch(() => '[]');
  return txt?.trim() ? JSON.parse(txt) : [];
}

export async function writeJson(file, data) {
  const tmp = file + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf-8');
  await fs.rename(tmp, file); // gravação atômica
}
