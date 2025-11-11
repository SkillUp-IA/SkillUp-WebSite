import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../data/recommendations.json');

function ensureFile() {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]');
}
function readAll() {
  ensureFile();
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}
function writeAll(arr) {
  fs.writeFileSync(filePath, JSON.stringify(arr, null, 2));
}

// POST /recommend  { toId, message, from }
router.post('/recommend', (req, res) => {
  const { toId, message, from } = req.body || {};
  if (!toId || !message) return res.status(400).json({ error: 'toId e message são obrigatórios' });

  const all = readAll();
  const rec = {
    id: Date.now(),
    toId,
    message,
    from: from || 'anon',
    createdAt: new Date().toISOString(),
  };
  all.push(rec);
  writeAll(all);
  res.json({ ok: true, recommendation: rec });
});

// (opcional) GET /recommendations?toId=123
router.get('/recommendations', (req, res) => {
  const { toId } = req.query;
  const all = readAll();
  const filtered = toId ? all.filter(r => String(r.toId) === String(toId)) : all;
  res.json(filtered);
});

export default router;
