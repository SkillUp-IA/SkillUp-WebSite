import { Router } from 'express';
import { dataPath, readJson } from '../utils/jsonStore.js';
import OpenAI from 'openai';
import 'dotenv/config';

function getOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  return new OpenAI({ apiKey: key });
}

const router = Router();
const PROFILES = dataPath('profiles.json');

function scoreProfile(p, skillsWanted, areaWanted, cityWanted) {
    const skills = Array.isArray(p.habilidadesTecnicas) ? p.habilidadesTecnicas.map(s => s.toLowerCase()) : [];
    const want = skillsWanted.map(s => s.toLowerCase());

    const inter = want.filter(w => skills.includes(w));
    let score = inter.length * 2;

    if (areaWanted && p.area?.toLowerCase() === areaWanted.toLowerCase()) score += 1.5;
    if (cityWanted && p.localizacao?.toLowerCase() === cityWanted.toLowerCase()) score += 0.5;

    return { score, inter };
}

// GET /ai/suggest?skills=React,Node.js&area=Desenvolvimento&city=São%20Paulo%20-%20SP&k=6
router.get('/ai/suggest', async (req, res) => {
    try {
        const k = Number(req.query.k) || 6;
        const area = req.query.area || '';
        const city = req.query.city || '';
        const skillsParam = (req.query.skills || '').trim();
        if (!skillsParam) return res.status(400).json({ error: 'Param skills é obrigatório (ex: React,Node.js)' });

        const skillsWanted = skillsParam.split(',').map(s => s.trim()).filter(Boolean);
        const all = await readJson(PROFILES);

        const ranked = all
            .map(p => {
                const { score, inter } = scoreProfile(p, skillsWanted, area, city);
                return { ...p, _score: score, _match: inter };
            })
            .filter(p => p._score > 0)
            .sort((a, b) => b._score - a._score)
            .slice(0, k)
            .map(p => ({
                id: p.id,
                nome: p.nome,
                foto: p.foto,
                cargo: p.cargo,
                localizacao: p.localizacao,
                area: p.area,
                habilidadesTecnicas: p.habilidadesTecnicas,
                score: p._score,
                motivo: `Match em: ${p._match.join(', ')}${area ? ' • área' : ''}${city ? ' • cidade' : ''}`
            }));

        return res.json({ total: ranked.length, items: ranked });
    } catch (e) {
        console.error('ERRO /ai/suggest:', e);
        return res.status(500).json({ error: 'Erro ao sugerir perfis' });
    }
});
const KNOWN_SKILLS = [
  'React','Next.js','TailwindCSS','JavaScript','TypeScript','Node.js','Express',
  'Python','FastAPI','Django','SQL','PostgreSQL','MySQL','MongoDB',
  'Power BI','Figma','Design System','Acessibilidade','AWS','Docker','CI/CD'
];
const AREA_KEYWORDS = {
  'Desenvolvimento': ['front','back','full','api','node','react','typescript','javascript','python','java','.net'],
  'Dados': ['bi','dashboard','power bi','sql','etl','pipelines','modelagem','análise','big data'],
  'Design': ['ux','ui','figma','wireframe','prototip','acessibilidad','design system'],
  'Infraestrutura': ['devops','aws','docker','k8s','jenkins','infra','iac'],
  'Sistemas': ['erp','protheus','totvs','gestão','integr']
};

router.post('/ai/extract', async (req, res) => {
  const { text = '' } = req.body || {};
  const t = String(text).toLowerCase();

  const habilidadesTecnicas = KNOWN_SKILLS.filter(s => t.includes(s.toLowerCase()));

  let area = '';
  let maxHits = 0;
  for (const [k, words] of Object.entries(AREA_KEYWORDS)) {
    const hits = words.reduce((acc,w) => acc + (t.includes(w) ? 1 : 0), 0);
    if (hits > maxHits) { maxHits = hits; area = k; }
  }

  const softSkills = [];
  if (t.includes('comunica')) softSkills.push('Comunicação');
  if (t.includes('lider')) softSkills.push('Liderança');
  if (t.includes('colabora')) softSkills.push('Colaboração');
  if (t.includes('resili')) softSkills.push('Resiliência');
  if (t.includes('criativ')) softSkills.push('Criatividade');

  return res.json({
    habilidadesTecnicas,
    softSkills,
    area: area || null,
    tags: [...new Set([...habilidadesTecnicas, ...softSkills])]
  });
});


// Gera headline curta, melhora "resumo" e sugere 5 skills a partir do perfil
router.post('/ai/summary', async (req, res) => {
  const client = getOpenAI();
  if (!client) {
    return res.status(503).json({
      error: 'AI offline: defina OPENAI_API_KEY no backend/.env'
    });
  }

  try {
    const profile = req.body?.profile || {};
    const prompt = `
Você é um assistente de carreiras. Dado o perfil JSON abaixo, gere:
- "headline": um título curto e marcante (máx. 60 caracteres)
- "resumo": de 1 a 2 frases com impacto, em PT-BR
- "skillsSugeridas": até 5 habilidades técnicas adicionais que façam sentido

Responda somente em JSON válido.

Perfil:
${JSON.stringify(profile, null, 2)}
`.trim();

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
    });

    const content = completion.choices[0].message.content || '{}';
    const start = content.indexOf('{');
    const end = content.lastIndexOf('}');
    const json = JSON.parse(content.slice(start, end + 1));
    res.json(json);
  } catch (e) {
    console.error('AI /summary error:', e);
    res.status(500).json({ error: 'Falha na IA' });
  }
});

export default router;
