// src/pages/Auth.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { createProfile } from "../lib/api.js";
import Brand from "../components/Brand.jsx";

/* ========= Helpers ========= */
function Tags({ label, items, setItems, placeholder = "Digite e tecle Enter" }) {
  const [v, setV] = useState("");
  function onKeyDown(e) {
    if (e.key === "Enter" && v.trim()) {
      const value = v.trim();
      if (!items.includes(value)) setItems([...items, value]);
      setV("");
    }
  }
  return (
    <div className="space-y-1">
      <label className="text-xs text-zinc-600">{label}</label>
      <div className="rounded-xl border border-zinc-300 p-2 bg-zinc-50">
        <div className="flex flex-wrap gap-2">
          {items.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="px-2 py-1 text-xs rounded-full bg-zinc-100 border border-zinc-200 flex items-center gap-1"
            >
              {t}
              <button
                type="button"
                onClick={() => setItems(items.filter(x => x !== t))}
                className="text-zinc-500 hover:text-red-600"
                aria-label={`remover ${t}`}
              >
                ×
              </button>
            </span>
          ))}
          <input
            value={v}
            onChange={(e) => setV(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="flex-1 min-w-40 bg-transparent outline-none text-sm px-1"
          />
        </div>
      </div>
    </div>
  );
}

function ObjList({ label, items, setItems, schema }) {
  function add() { setItems([...items, { ...schema }]); }
  function remove(i) { setItems(items.filter((_, idx) => idx !== i)); }
  function update(i, key, val) {
    const next = [...items];
    next[i] = { ...next[i], [key]: val };
    setItems(next);
  }
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{label}</h3>
        <button
          type="button"
          onClick={add}
          className="text-xs px-2 py-1 rounded bg-zinc-100 hover:bg-zinc-200"
        >
          + adicionar
        </button>
      </div>
      {items.length === 0 && <p className="text-xs text-zinc-500">Nenhum item</p>}
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="rounded-xl border border-zinc-200 p-3">
            <div className="grid sm:grid-cols-2 gap-2">
              {Object.keys(schema).map((k) => (
                <input
                  key={k}
                  value={it[k] ?? ""}
                  onChange={(e) => update(i, k, e.target.value)}
                  placeholder={k}
                  className="px-3 py-2 rounded-xl bg-zinc-100 text-sm outline-none"
                />
              ))}
            </div>
            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-xs text-red-600 hover:underline"
              >
                remover
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ========= Página ========= */
export default function AuthPage() {
  const [tab, setTab] = useState("login");
  const { login: authLogin, register: authRegister } = useAuth();
  const navigate = useNavigate();

  // Login
  const [lUser, setLUser] = useState("");
  const [lPass, setLPass] = useState("");

  // Conta (signup)
  const [rUser, setRUser] = useState("");
  const [rPass, setRPass] = useState("");
  const [confirm, setConfirm] = useState("");

  // Perfil (completo)
  const [nome, setNome] = useState("");
  const [foto, setFoto] = useState("https://i.pravatar.cc/150");
  const [cargo, setCargo] = useState("");
  const [resumo, setResumo] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [area, setArea] = useState("Desenvolvimento");

  const [habilidadesTecnicas, setHabilidadesTecnicas] = useState([]);
  const [softSkills, setSoftSkills] = useState([]);

  const [experiencias, setExperiencias] = useState([]);
  const [formacao, setFormacao] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [certificacoes, setCertificacoes] = useState([]);
  const [idiomas, setIdiomas] = useState([]);
  const [areasInteresse, setAreasInteresse] = useState([]);

  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    try {
      await authLogin(lUser, lPass);
      navigate("/perfis");
    } catch (err) {
      alert(err?.response?.data?.error || "Erro ao entrar");
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    if (!rUser || !rPass) return alert("Informe usuário e senha.");
    if (rPass !== confirm) return alert("Senhas diferentes.");
    if (!nome || !cargo) return alert("Informe pelo menos Nome e Cargo.");

    const profile = {
      nome, foto, cargo, resumo, localizacao, area,
      habilidadesTecnicas, softSkills, experiencias,
      formacao, projetos, certificacoes, idiomas, areasInteresse,
    };

    try {
      setLoading(true);
      await authRegister(rUser, rPass);        // cria conta
      await authLogin(rUser, rPass);           // faz login (salva token)
      await createProfile(profile);            // grava no data/profiles.json
      alert("Conta e card criados com sucesso!");
      navigate("/perfis");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || err?.message || "Erro ao registrar");
    } finally {
      setLoading(false);
    }
  }

  const areasOpts = ["Desenvolvimento", "Dados", "Design", "Infraestrutura", "Sistemas"];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* fundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-skill-primary via-skill-ink to-skill-primary/90" />
      <div className="absolute -top-24 -right-24 h-[32rem] w-[32rem] rounded-full bg-skill-accent/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-white/10 blur-3xl" />

      {/* conteúdo */}
      <div className="relative z-10 grid place-items-center px-4 py-12">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8">

          {/* Lado esquerdo */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="text-center">
              <Brand size={96} stacked />
              <h1 className="mt-6 text-3xl font-semibold text-white">
                Conecte talentos. Potencialize times.
              </h1>
              <p className="mt-3 text-white/80">
                Encontre profissionais por habilidades, área e localização — rápido e com estilo.
              </p>
            </div>
          </div>

          {/* Card de autenticação */}
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-soft p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <Brand size={36} />
              <div className="grid grid-cols-2 gap-2 bg-zinc-100 rounded-lg p-1">
                <button
                  onClick={() => setTab("login")}
                  className={`px-3 py-1.5 rounded-md text-sm ${tab==="login" ? "bg-white shadow" : "text-zinc-600"}`}
                >
                  Login
                </button>
                <button
                  onClick={() => setTab("signup")}
                  className={`px-3 py-1.5 rounded-md text-sm ${tab==="signup" ? "bg-white shadow" : "text-zinc-600"}`}
                >
                  Criar Perfil
                </button>
              </div>
            </div>

            {/* LOGIN */}
            {tab === "login" && (
              <form onSubmit={handleLogin} className="mt-6 space-y-4">
                <div>
                  <label className="text-xs text-zinc-600">Usuário</label>
                  <input
                    value={lUser}
                    onChange={(e)=>setLUser(e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-zinc-100 outline-none"
                    placeholder="seu usuário"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-600">Senha</label>
                  <input
                    type="password"
                    value={lPass}
                    onChange={(e)=>setLPass(e.target.value)}
                    className="mt-1 w-full px-3 py-2 rounded-xl bg-zinc-100 outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <button className="w-full py-2 rounded-xl bg-skill-accent text-white hover:opacity-95">
                  Entrar
                </button>
              </form>
            )}

            {/* SIGNUP COMPLETO */}
            {tab === "signup" && (
              <form onSubmit={handleSignup} className="mt-6 grid grid-cols-1 gap-4">
                {/* Conta */}
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="text-xs text-zinc-600">Usuário</label>
                    <input value={rUser} onChange={e=>setRUser(e.target.value)}
                      className="mt-1 w-full px-3 py-2 rounded-xl bg-zinc-100 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-600">Senha</label>
                    <input type="password" value={rPass} onChange={e=>setRPass(e.target.value)}
                      className="mt-1 w-full px-3 py-2 rounded-xl bg-zinc-100 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-600">Confirmar</label>
                    <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)}
                      className="mt-1 w-full px-3 py-2 rounded-xl bg-zinc-100 outline-none" />
                  </div>
                </div>

                {/* Perfil básico */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs text-zinc-600">Nome (card)</label>
                    <input value={nome} onChange={e=>setNome(e.target.value)}
                      className="mt-1 w-full px-3 py-2 rounded-xl bg-zinc-100 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-600">Cargo</label>
                    <input value={cargo} onChange={e=>setCargo(e.target.value)}
                      className="mt-1 w-full px-3 py-2 rounded-xl bg-zinc-100 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-600">Localização</label>
                    <input value={localizacao} onChange={e=>setLocalizacao(e.target.value)}
                      className="mt-1 w-full px-3 py-2 rounded-xl bg-zinc-100 outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-zinc-600">Área</label>
                    <select value={area} onChange={e=>setArea(e.target.value)}
                      className="mt-1 w-full px-3 py-2 rounded-xl bg-zinc-100 outline-none">
                      {areasOpts.map(a => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-zinc-600">Resumo</label>
                    <textarea rows={3} value={resumo} onChange={e=>setResumo(e.target.value)}
                      className="mt-1 w-full px-3 py-2 rounded-xl bg-zinc-100 outline-none"
                      placeholder="Resumo do seu perfil" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-zinc-600">URL da foto</label>
                    <input value={foto} onChange={e=>setFoto(e.target.value)}
                      className="mt-1 w-full px-3 py-2 rounded-xl bg-zinc-100 outline-none"
                      placeholder="https://..." />
                  </div>
                </div>

                {/* Campos avançados */}
                <Tags
                  label="Habilidades técnicas"
                  items={habilidadesTecnicas}
                  setItems={setHabilidadesTecnicas}
                  placeholder="Ex.: React, Docker, SQL"
                />
                <Tags
                  label="Soft skills"
                  items={softSkills}
                  setItems={setSoftSkills}
                  placeholder="Ex.: Comunicação, Liderança"
                />

                <ObjList
                  label="Experiências"
                  items={experiencias}
                  setItems={setExperiencias}
                  schema={{ empresa: "", cargo: "", inicio: "", fim: "", descricao: "" }}
                />
                <ObjList
                  label="Formação"
                  items={formacao}
                  setItems={setFormacao}
                  schema={{ curso: "", instituicao: "", ano: "" }}
                />
                <ObjList
                  label="Projetos"
                  items={projetos}
                  setItems={setProjetos}
                  schema={{ titulo: "", link: "", descricao: "" }}
                />

                <Tags
                  label="Certificações"
                  items={certificacoes}
                  setItems={setCertificacoes}
                  placeholder="Ex.: AZ-900, AWS CCP"
                />
                <ObjList
                  label="Idiomas"
                  items={idiomas}
                  setItems={setIdiomas}
                  schema={{ idioma: "", nivel: "" }}
                />
                <Tags
                  label="Áreas de interesse"
                  items={areasInteresse}
                  setItems={setAreasInteresse}
                  placeholder="Ex.: Sustentabilidade, Esportes"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 rounded-xl bg-skill-primary text-white hover:opacity-95 disabled:opacity-60"
                >
                  {loading ? "Criando…" : "Criar conta e card"}
                </button>
                <p className="text-xs text-zinc-500">
                  O card é criado automaticamente e adicionado ao final da lista.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
