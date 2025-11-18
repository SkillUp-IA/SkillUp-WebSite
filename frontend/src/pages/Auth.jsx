// src/pages/Auth.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { createProfile } from "../lib/api.js";
import Brand from "../components/Brand.jsx";

/* ========== Constantes ========== */
const ESTADOS_BRASIL = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" },
];

/* ========== Helpers ========== */
function Tags({ label, items, setItems, placeholder = "Digite e tecle Enter" }) {
  const [v, setV] = useState("");
  function onKeyDown(e) {
    if (e.key === "Enter" && v.trim()) {
      e.preventDefault();
      const value = v.trim();
      if (!items.includes(value)) setItems([...items, value]);
      setV("");
    }
  }
  return (
    <div className="ui-section">
      <div className="flex items-center justify-between">
        <span className="ui-label">{label}</span>
        <span className="ui-badge">Campo de lista</span>
      </div>
      <div className="rounded-xl border border-zinc-300 dark:border-zinc-700 p-2 bg-white dark:bg-zinc-900">
        <div className="flex flex-wrap gap-2">
          {items.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="px-2 py-1 text-xs rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center gap-1"
            >
              {t}
              <button
                type="button"
                onClick={() => setItems(items.filter((x) => x !== t))}
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
      <p className="ui-hint">
        Tecle <kbd>Enter</kbd> para adicionar cada item.
      </p>
    </div>
  );
}

function ObjList({ label, items, setItems, schema, hint }) {
  function add() {
    setItems([...items, { ...schema }]);
  }
  function remove(i) {
    setItems(items.filter((_, idx) => idx !== i));
  }
  function update(i, key, val) {
    const next = [...items];
    next[i] = { ...next[i], [key]: val };
    setItems(next);
  }
  return (
    <div className="ui-section">
      <div className="flex items-center justify-between">
        <span className="ui-label">{label}</span>
        <button
          type="button"
          onClick={add}
          className="text-xs px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200"
        >
          + adicionar
        </button>
      </div>

      {items.length === 0 && <p className="ui-hint">Nenhum item adicionado.</p>}

      <div className="space-y-3">
        {items.map((it, i) => (
          <div
            key={i}
            className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3"
          >
            <div className="grid sm:grid-cols-2 gap-2">
              {Object.keys(schema).map((k) => (
                <input
                  key={k}
                  value={it[k] ?? ""}
                  onChange={(e) => update(i, k, e.target.value)}
                  placeholder={k}
                  className="ui-input"
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

      {hint && <p className="ui-hint">{hint}</p>}
    </div>
  );
}

/* ========== Página ========== */
export default function AuthPage() {
  const [tab, setTab] = useState("login");
  const { login: authLogin, register: authRegister } = useAuth();
  const navigate = useNavigate();

  // Login
  const [lUser, setLUser] = useState("");
  const [lPass, setLPass] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Conta (signup)
  const [rUser, setRUser] = useState("");
  const [rPass, setRPass] = useState("");
  const [confirm, setConfirm] = useState("");

  // Perfil (completo)
  const [nome, setNome] = useState("");
  const [foto, setFoto] = useState("https://i.pravatar.cc/150");
  const [cargo, setCargo] = useState("");
  const [resumo, setResumo] = useState("");

  // Redes (opcionais)
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [portfolio, setPortfolio] = useState("");

  // Localização e área
  const [localizacao, setLocalizacao] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [area, setArea] = useState("");

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
      setLoginLoading(true);
      await authLogin(lUser, lPass);
      navigate("/perfis");
    } catch (err) {
      alert(err?.response?.data?.error || "Erro ao entrar");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    if (!rUser || !rPass) return alert("Informe usuário e senha.");
    if (rPass !== confirm) return alert("Senhas diferentes.");
    if (!nome || !cargo) return alert("Informe pelo menos Nome e Cargo.");

    const locFinal =
      cidade && estado ? `${cidade} - ${estado}` : localizacao || cidade || estado;

    const profile = {
      nome,
      foto,
      cargo,
      resumo,
      localizacao: locFinal,
      area,
      habilidadesTecnicas,
      softSkills,
      experiencias,
      formacao,
      projetos,
      certificacoes,
      idiomas,
      areasInteresse,
      links: {
        linkedin,
        github,
        portfolio,
      },
    };

    try {
      setLoading(true);
      await authRegister(rUser, rPass);
      await authLogin(rUser, rPass);
      await createProfile(profile);
      alert("Conta e card criados com sucesso!");
      navigate("/perfis");
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.error || err?.message || "Erro ao registrar"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-950 to-sky-950">
      {/* efeitos de fundo */}
      <div className="pointer-events-none absolute -top-40 -right-32 h-[30rem] w-[30rem] rounded-full bg-sky-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-[26rem] w-[26rem] rounded-full bg-indigo-500/20 blur-3xl" />

      {/* conteúdo */}
      <div className="relative z-10 flex items-center justify-center px-4 py-10 lg:py-16">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center lg:items-stretch gap-10 lg:gap-16">
          {/* Lado esquerdo - hero da marca */}
          <div className="flex-1 w-full text-center lg:text-left flex items-center justify-center">
            <div className="space-y-6 max-w-xl">
              {/* Logo + nome bem grandes */}
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <div className="h-16 w-16 rounded-3xl bg-slate-900/90 flex items-center justify-center shadow-[0_0_35px_rgba(56,189,248,0.55)] border border-sky-500/40">
                  <img
                    src="/skillup-logo-branca.png"
                    alt="SkillUp IA"
                    className="h-16 w-16 object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-50">
                    <span className="text-sky-400">Skill</span>
                    <span className="text-slate-50">Up</span>{" "}
                    <span className="text-slate-300">IA</span>
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 mt-1">
                    Conectando talentos, IA e oportunidades.
                  </span>
                </div>
              </div>

              {/* Headline principal */}
              <h1 className="text-3xl sm:text-4xl xl:text-5xl font-semibold leading-tight text-slate-50">
                Conecte talentos.{" "}
                <span className="text-sky-400">Potencialize times.</span>
              </h1>

              {/* Subtexto que você gostou */}
              <p className="text-sm sm:text-base text-slate-200/80 max-w-md mx-auto lg:mx-0">
                Encontre profissionais por habilidades, área e localização —
                rápido, inteligente e com o toque da IA.
              </p>

              {/* Bloco com o texto da SkillUp IA */}
              <div className="mt-4 max-w-xl mx-auto lg:mx-0 text-sm sm:text-base text-slate-200/90 leading-relaxed bg-slate-950/50 border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-[0_18px_45px_rgba(15,23,42,0.9)]">
                <p>
                  <strong>SkillUp IA</strong> é uma plataforma que conecta
                  pessoas e oportunidades. Nela, os profissionais criam seus
                  perfis com currículo, habilidades e experiências, formando uma
                  grande rede onde empresas podem encontrar talentos de forma
                  rápida e assertiva.
                </p>
                <p className="mt-3">
                  Além disso, a SkillUp IA monta trilhas de aprendizado
                  personalizadas, mostrando quais cursos e conteúdos a pessoa
                  precisa estudar para chegar no cargo que deseja. Assim, o
                  usuário acompanha sua evolução, melhora o currículo e aumenta
                  suas chances de empregabilidade.
                </p>
              </div>
            </div>
          </div>

          {/* Lado direito - card de autenticação */}
          <div className="w-full max-w-md lg:max-w-lg">
            <div className="ui-card rounded-3xl bg-slate-950/90 border border-slate-800 shadow-[0_18px_55px_rgba(15,23,42,0.95)] backdrop-blur">
              {/* Header do card */}
              <div className="px-7 pt-6 flex items-center justify-between gap-4">

                <div
                  className="ml-25 flex rounded-full bg-slate-900/90 p-1 text-xs font-medium"
                  role="tablist"
                  aria-label="Alternar entre login e criação de perfil"
                >
                  <button
                    type="button"
                    onClick={() => setTab("login")}
                    role="tab"
                    aria-selected={tab === "login"}
                    className={`ui-tab px-4 py-1.5 rounded-full transition-colors ${
                      tab === "login"
                        ? "bg-sky-500 text-slate-950 shadow"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab("signup")}
                    role="tab"
                    aria-selected={tab === "signup"}
                    className={`ui-tab px-4 py-1.5 rounded-full transition-colors ${
                      tab === "signup"
                        ? "bg-sky-500 text-slate-950 shadow"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    Criar perfil
                  </button>
                </div>
              </div>

              {/* Conteúdo do card */}
              <div className="px-7 pb-7 pt-4">
                {/* LOGIN */}
                {tab === "login" && (
                  <form onSubmit={handleLogin} className="space-y-5 mt-2">
                    <div className="space-y-3">
                      <div>
                        <label className="ui-label text-slate-200">
                          Usuário
                        </label>
                        <input
                          required
                          minLength={3}
                          autoComplete="username"
                          value={lUser}
                          onChange={(e) => setLUser(e.target.value)}
                          className="ui-input mt-1 bg-slate-900/80 border-slate-700 text-sm placeholder:text-slate-500"
                          placeholder="seu usuário"
                        />
                      </div>
                      <div>
                        <label className="ui-label text-slate-200">
                          Senha
                        </label>
                        <input
                          required
                          minLength={4}
                          type="password"
                          autoComplete="current-password"
                          value={lPass}
                          onChange={(e) => setLPass(e.target.value)}
                          className="ui-input mt-1 bg-slate-900/80 border-slate-700 text-sm placeholder:text-slate-500"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loginLoading}
                      className="ui-btn-primary w-full rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-900 font-semibold text-sm py-3 shadow-lg shadow-sky-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loginLoading ? "Entrando…" : "Entrar"}
                    </button>

                  </form>
                )}

                {/* SIGNUP COMPLETO */}
                {tab === "signup" && (
                  <form
                    onSubmit={handleSignup}
                    className="mt-4 grid grid-cols-1 gap-4 max-h-[65vh] overflow-y-auto pr-1"
                  >
                    {/* Conta */}
                    <div className="ui-section">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="ui-badge">Passo 1</span>
                        <span className="ui-label text-slate-100">
                          Conta de acesso
                        </span>
                      </div>
                      <div className="grid sm:grid-cols-3 gap-3">
                        <div>
                          <label className="ui-label text-slate-200">
                            Usuário *
                          </label>
                          <input
                            required
                            minLength={3}
                            autoComplete="username"
                            value={rUser}
                            onChange={(e) => setRUser(e.target.value)}
                            className="ui-input mt-1 bg-slate-900/80 border-slate-700 text-sm"
                          />
                        </div>
                        <div>
                          <label className="ui-label text-slate-200">
                            Senha *
                          </label>
                          <input
                            required
                            minLength={4}
                            type="password"
                            autoComplete="new-password"
                            value={rPass}
                            onChange={(e) => setRPass(e.target.value)}
                            className="ui-input mt-1 bg-slate-900/80 border-slate-700 text-sm"
                          />
                        </div>
                        <div>
                          <label className="ui-label text-slate-200">
                            Confirmar *
                          </label>
                          <input
                            required
                            minLength={4}
                            type="password"
                            autoComplete="new-password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            className="ui-input mt-1 bg-slate-900/80 border-slate-700 text-sm"
                          />
                        </div>
                      </div>
                      <p className="ui-hint text-slate-400 mt-1">
                        Os campos marcados com * são obrigatórios.
                      </p>
                    </div>

                    {/* Perfil básico */}
                    <div className="ui-section">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="ui-badge">Passo 2</span>
                        <span className="ui-label text-slate-100">
                          Perfil básico
                        </span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <label className="ui-label text-slate-200">
                            Nome (card) *
                          </label>
                          <input
                            required
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="ui-input mt-1 bg-slate-900/80 border-slate-700 text-sm"
                            placeholder="Seu nome completo"
                          />
                        </div>
                        <div>
                          <label className="ui-label text-slate-200">
                            Cargo *
                          </label>
                          <input
                            required
                            value={cargo}
                            onChange={(e) => setCargo(e.target.value)}
                            className="ui-input mt-1 bg-slate-900/80 border-slate-700 text-sm"
                            placeholder="Ex.: Eng. de Software"
                          />
                        </div>

                        <div>
                          <label className="ui-label text-slate-200">
                            Cidade
                          </label>
                          <input
                            value={cidade}
                            onChange={(e) => {
                              const value = e.target.value;
                              setCidade(value);
                              const loc = estado ? `${value} - ${estado}` : value;
                              setLocalizacao(loc);
                            }}
                            className="ui-input mt-1 bg-slate-900/80 border-slate-700 text-sm"
                            placeholder="Ex.: São Paulo"
                          />
                        </div>

                        <div>
                          <label className="ui-label text-slate-200">
                            Estado
                          </label>
                          <select
                            value={estado}
                            onChange={(e) => {
                              const uf = e.target.value;
                              setEstado(uf);
                              const loc = cidade ? `${cidade} - ${uf}` : uf;
                              setLocalizacao(loc);
                            }}
                            className="ui-input mt-1 bg-slate-900/80 border-slate-700 text-sm"
                          >
                            <option value="">Selecione</option>
                            {ESTADOS_BRASIL.map((uf) => (
                              <option key={uf.sigla} value={uf.sigla}>
                                {uf.sigla} - {uf.nome}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="ui-label text-slate-200">
                            Área
                          </label>
                          <input
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            className="ui-input mt-1 bg-slate-900/80 border-slate-700 text-sm"
                            placeholder="Ex.: Desenvolvimento, Dados, Design…"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="ui-label text-slate-200">
                            Resumo
                          </label>
                          <textarea
                            rows={3}
                            value={resumo}
                            onChange={(e) => setResumo(e.target.value)}
                            className="ui-input mt-1 bg-slate-900/80 border-slate-700 text-sm"
                            placeholder="Conte rapidamente sua experiência e foco."
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="ui-label text-slate-200">
                            URL da foto
                          </label>
                          <input
                            value={foto}
                            onChange={(e) => setFoto(e.target.value)}
                            className="ui-input mt-1 bg-slate-900/80 border-slate-700 text-sm"
                            placeholder="https://..."
                          />
                          <p className="ui-hint text-slate-400 mt-1">
                            Dica: use uma foto quadrada (1:1) para melhor
                            recorte.
                          </p>
                        </div>

                        {/* Redes (opcional) */}
                        <div className="sm:col-span-2 mt-2">
                          <label className="ui-label text-slate-200">
                            Redes (opcional)
                          </label>
                          <div className="grid sm:grid-cols-3 gap-3 mt-1">
                            <div>
                              <span className="text-[11px] text-slate-400">
                                LinkedIn
                              </span>
                              <input
                                value={linkedin}
                                onChange={(e) => setLinkedin(e.target.value)}
                                className="ui-input mt-1 bg-slate-900/80 border-slate-700 text-xs"
                                placeholder="https://linkedin.com/in/..."
                              />
                            </div>
                            <div>
                              <span className="text-[11px] text-slate-400">
                                GitHub
                              </span>
                              <input
                                value={github}
                                onChange={(e) => setGithub(e.target.value)}
                                className="ui-input mt-1 bg-slate-900/80 border-slate-700 text-xs"
                                placeholder="https://github.com/..."
                              />
                            </div>
                            <div>
                              <span className="text-[11px] text-slate-400">
                                Portfólio / Site
                              </span>
                              <input
                                value={portfolio}
                                onChange={(e) => setPortfolio(e.target.value)}
                                className="ui-input mt-1 bg-slate-900/80 border-slate-700 text-xs"
                                placeholder="https://seu-site.com"
                              />
                            </div>
                          </div>
                          <p className="ui-hint text-slate-400 mt-1">
                            Preencha apenas as redes que você quiser deixar
                            públicas.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
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

                    {/* Experiências / Formação / Projetos */}
                    <ObjList
                      label="Experiências"
                      items={experiencias}
                      setItems={setExperiencias}
                      schema={{
                        empresa: "",
                        cargo: "",
                        inicio: "",
                        fim: "",
                        descricao: "",
                      }}
                      hint="Preencha empresa, cargo, período e uma breve descrição."
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

                    {/* Extras */}
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
                      className="ui-btn-primary w-full rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-900 font-semibold text-sm py-3 shadow-lg shadow-sky-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? "Criando…" : "Criar conta e card"}
                    </button>
                    <p className="ui-hint text-slate-400 text-center pb-1">
                      Seu card será adicionado automaticamente ao fim da lista.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
