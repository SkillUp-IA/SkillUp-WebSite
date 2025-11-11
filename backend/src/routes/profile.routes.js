// src/routes/profile.routes.js
import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// usamos a mesma pasta exposta em app.use('/data', …)
const dataDir = path.join(__dirname, '../data');
const filePath = path.join(dataDir, 'profiles.json');

function ensureStore() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]', 'utf-8');
}

function readAll() {
  ensureStore();
  try {
    const txt = fs.readFileSync(filePath, 'utf-8');
    const arr = JSON.parse(txt);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function writeAll(arr) {
  ensureStore();
  fs.writeFileSync(filePath, JSON.stringify(arr, null, 2), 'utf-8');
}

function nextId(arr) {
  const max = arr.reduce((m, i) => Math.max(m, Number(i.id || 0)), 0);
  return max + 1;
}

// GET /profiles?page=1&pageSize=60
router.get('/profiles', (req, res) => {
  const page = Number(req.query.page || 1);
  const pageSize = Number(req.query.pageSize || 60);

  const all = readAll();
  const total = all.length;
  const start = (page - 1) * pageSize;
  const items = all.slice(start, start + pageSize);

  res.json({
    items,
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  });
});

// GET /profiles/:id
router.get('/profiles/:id', (req, res) => {
  const id = String(req.params.id);
  const all = readAll();
  const it = all.find(p => String(p.id) === id);
  if (!it) return res.status(404).json({ error: 'Perfil não encontrado' });
  res.json(it);
});

// POST /profiles  (cria card)
router.post('/profiles', (req, res) => {
  const body = req.body || {};
  const required = ['nome', 'cargo'];
  for (const k of required) {
    if (!body[k]) return res.status(400).json({ error: `Campo obrigatório: ${k}` });
  }

  const all = readAll();
  const id = nextId(all);

  const profile = {
    id,
    nome: body.nome,
    foto: body.foto || 'https://i.pravatar.cc/150',
    cargo: body.cargo,
    resumo: body.resumo || '',
    localizacao: body.localizacao || '',
    area: body.area || 'Desenvolvimento',
    habilidadesTecnicas: body.habilidadesTecnicas || [],
    softSkills: body.softSkills || [],
    experiencias: body.experiencias || [],
    formacao: body.formacao || [],
    projetos: body.projetos || [],
    certificacoes: body.certificacoes || [],
    idiomas: body.idiomas || [],
    areasInteresse: body.areasInteresse || [],
    createdAt: new Date().toISOString(),
  };

  all.push(profile);
  writeAll(all);
  res.status(201).json(profile);
});

export default router;
