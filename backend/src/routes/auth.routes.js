import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dataPath, ensureFile, readJson, writeJson } from '../utils/jsonStore.js';

const router = Router();
const USERS = dataPath('users.json');

// garante arquivo
await ensureFile(USERS, []);

// helper
const nowISO = () => new Date().toISOString();

// POST /register  {username, password}
router.post('/register', async (req, res) => {
  try {
    const username = (req.body.username || '').trim().toLowerCase();
    const password = req.body.password || '';

    if (!username || !password) {
      return res.status(400).json({ error: 'Username e password são obrigatórios' });
    }

    const users = await readJson(USERS);
    if (users.some(u => u.username === username)) {
      return res.status(409).json({ error: 'Usuário já existe' });
    }

    // bcrypt em 3 linhas
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    users.push({ id, username, password: hash, createdAt: nowISO() });
    await writeJson(USERS, users);

    return res.status(201).json({ message: 'Usuário cadastrado com sucesso', user: { id, username } });
  } catch (e) {
    console.error('ERRO /register:', e);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// POST /login  {username, password}
router.post('/login', async (req, res) => {
  try {
    const username = (req.body.username || '').trim().toLowerCase();
    const password = req.body.password || '';

    const users = await readJson(USERS);
    const user = users.find(u => u.username === username);
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

    // comparação em 1 linha
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' });

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.SECRET_KEY, { expiresIn: '1h' });
    return res.json({ message: 'Login bem-sucedido', token });
  } catch (e) {
    console.error('ERRO /login:', e);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

export default router;
