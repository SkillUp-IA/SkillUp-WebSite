import { useEffect, useMemo, useState } from 'react';
import Card from '../components/Card.jsx';
import Modal from '../components/Modal.jsx';

export default function Home() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [cidade, setCidade] = useState('Todas');
  const [area, setArea] = useState('Todas');
  const [tech, setTech] = useState('Todas');

  // carrega os dados do JSON
  useEffect(() => {
    import('../data/profissionais.json').then(m => setData(m.default));
  }, []);

  // gera listas únicas de filtros
  const cidades = useMemo(() => ['Todas', ...new Set(data.map(p => p.localizacao))], [data]);
  const areas = useMemo(() => ['Todas', ...new Set(data.map(p => p.area))], [data]);
  const techs = useMemo(() => {
    const all = data.flatMap(p => p.habilidadesTecnicas || []);
    return ['Todas', ...new Set(all)];
  }, [data]);

  // aplica busca + filtros
  const filtrados = useMemo(() => {
    const s = q.toLowerCase();
    return data.filter(p => {
      const matchBusca =
        p.nome.toLowerCase().includes(s) ||
        p.cargo.toLowerCase().includes(s) ||
        p.habilidadesTecnicas?.some(t => t.toLowerCase().includes(s));

      const matchCidade = cidade === 'Todas' || p.localizacao === cidade;
      const matchArea = area === 'Todas' || p.area === area;
      const matchTech = tech === 'Todas' || p.habilidadesTecnicas?.includes(tech);

      return matchBusca && matchCidade && matchArea && matchTech;
    });
  }, [data, q, cidade, area, tech]);

  // alternar tema
function toggleTheme() {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
  
    if (isDark) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }
  

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-zinc-900/70 backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap gap-3 items-center">
          <h1 className="font-semibold text-lg flex-1"> SkillUp IA</h1>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome, cargo ou tecnologia..."
            className="px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-sm outline-none"
          />

          <select value={cidade} onChange={e => setCidade(e.target.value)} className="px-2 py-2 text-sm rounded-xl bg-zinc-100 dark:bg-zinc-800">
            {cidades.map(c => <option key={c}>{c}</option>)}
          </select>

          <select value={area} onChange={e => setArea(e.target.value)} className="px-2 py-2 text-sm rounded-xl bg-zinc-100 dark:bg-zinc-800">
            {areas.map(a => <option key={a}>{a}</option>)}
          </select>

          <select value={tech} onChange={e => setTech(e.target.value)} className="px-2 py-2 text-sm rounded-xl bg-zinc-100 dark:bg-zinc-800">
            {techs.map(t => <option key={t}>{t}</option>)}
          </select>

            <button
            onClick={toggleTheme}
            className="px-3 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-sm transition hover:opacity-80"
            >
            Alternar tema 🌞🌙
            </button>

        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {filtrados.length === 0 ? (
          <p className="text-center text-zinc-500 dark:text-zinc-400">Nenhum profissional encontrado.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtrados.map(p => (
              <Card key={p.id} profile={p} onOpen={(prof) => { setSelected(prof); setOpen(true); }} />
            ))}
          </div>
        )}
      </main>

      <Modal open={open} data={selected} onClose={() => setOpen(false)} />
    </div>
  );
}
