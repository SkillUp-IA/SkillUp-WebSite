// src/pages/Auth.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { createProfile } from "../lib/api.js";
import Brand from "../components/Brand.jsx";

/* ========== Helpers ========== */
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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="ui-label">{label}</span>
        <span className="ui-badge">Campo de lista</span>
      </div>
      <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-2">
        <div className="flex flex-wrap gap-2">
          {items.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="px-2 py-1 text-xs rounded-full bg-slate-800 border border-slate-700 flex items-center gap-1"
            >
              {t}
              <button
                type="button"
                onClick={() => setItems(items.filter((x) => x !== t))}
                className="text-slate-400 hover:text-red-400"
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
            className="flex-1 min-w-40 bg-transparent outline-none text-sm px-1 text-slate-100 placeholder:text-slate-500"
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="ui-label">{label}</span>
        <button
          type="button"
          onClick={add}
          className="text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700"
        >
          + adicionar
        </button>
      </div>

      {items.length === 0 && (
        <p className="ui-hint">Nenhum item adicionado ainda.</p>
      )}

      <div className="space-y-3">
        {items.map((it, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-800 bg-slate-950/60 p-3"
          >
            <div className="grid sm:grid-cols-2 gap-2">
              {Object.keys(schema).map((k) => (
                <input
                  key={k}
                  value={it[k] ?? ""}
                  onChange={(e) => update(i, k, e.target.value)}
                  placeholder={k}
                  className="ui-input text-slate-100 placeholder:text-slate-500"
                />
              ))}
            </div>
            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-xs text-red-400 hover:underline"
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

/* Painel padrão de cada passo (card azul bonito) */
function StepPanel({ badge, title, children }) {
  return (
    <section
      className="
        rounded-2xl
        border border-slate-800/90
        bg-gradient-to-br from-slate-950/90 via-slate-950/80 to-sky-950/40
        shadow-lg shadow-sky-900/40
        px-4 sm:px-5 py-4 sm:py-5
        space-y-4
      "
    >
      {(badge || title) && (
        <div className="flex items-center gap-2 mb-2">
          {badge && <span className="ui-badge">{badge}</span>}
          {title && <span className="ui-label">{title}</span>}
        </div>
      )}
      {children}
    </section>
  );
}

/* ========== Estados do Brasil ========== */
const ESTADOS_BRASIL = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

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

  // Localização e área
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

  // Redes sociais (opcional)
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [instagram, setInstagram] = useState("");

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
    if (!estado) return alert("Selecione um estado.");

    const localizacao =
      cidade && estado ? `${cidade} - ${estado}` : cidade || estado || "";

    const profile = {
      nome,
      foto,
      cargo,
      resumo,
      localizacao,
      estado,
      cidade,
      area,
      habilidadesTecnicas,
      softSkills,
      experiencias,
      formacao,
      projetos,
      certificacoes,
      idiomas,
      areasInteresse,
      redes: {
        linkedin,
        github,
        portfolio,
        instagram,
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
    <div className="min-h-screen relative overflow-hidden">
      {/* fundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-sky-950" />
      <div className="absolute -top-24 -right-24 h-[32rem] w-[32rem] rounded-full bg-sky-500/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-sky-300/10 blur-3xl" />

      {/* Conteúdo */}
      <div className="relative z-10 grid place-items-center px-4 py-12">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-10 items-center">
          {/* Lado esquerdo com logo / hero */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="text-left max-w-md">
              <Brand size={64} />
              <h1 className="mt-6 text-3xl lg:text-4xl font-semibold text-white">
                Conecte talentos.{" "}
                <span className="text-sky-400">Potencialize times.</span>
              </h1>
              <p className="mt-3 text-slate-200/80 text-sm">
                Encontre profissionais por habilidades, área e localização — rápido,
                inteligente e com o toque da IA.
              </p>
            </div>
          </div>

          {/* Card de autenticação */}
          <div
            className="
              ui-card
              rounded-3xl
              bg-gradient-to-br from-slate-950 via-slate-950 to-sky-950/80
              border border-slate-800/80
              shadow-2xl shadow-sky-900/40
              px-6 py-6 sm:px-8 sm:py-8
              max-h-[80vh]
              overflow-y-auto
            "
          >
            {/* Tabs Login / Criar perfil */}
            <div className="flex items-center justify-center mb-6">
              <div className="inline-flex bg-slate-900/80 rounded-full p-1 border border-slate-700">
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className={`px-5 py-1.5 text-sm rounded-full transition ${
                    tab === "login"
                      ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/40"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setTab("signup")}
                  className={`px-5 py-1.5 text-sm rounded-full transition ${
                    tab === "signup"
                      ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/40"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Criar perfil
                </button>
              </div>
            </div>

            {/* LOGIN */}
            {tab === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <StepPanel badge="Login" title="Acesse sua conta">
                  <div className="space-y-3">
                    <div>
                      <label className="ui-label">Usuário</label>
                      <input
                        required
                        value={lUser}
                        onChange={(e) => setLUser(e.target.value)}
                        className="ui-input mt-1 text-slate-100 placeholder:text-slate-500"
                        placeholder="Seu usuário"
                      />
                    </div>
                    <div>
                      <label className="ui-label">Senha</label>
                      <input
                        required
                        type="password"
                        value={lPass}
                        onChange={(e) => setLPass(e.target.value)}
                        className="ui-input mt-1 text-slate-100 placeholder:text-slate-500"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </StepPanel>

                <button className="ui-btn-primary mt-2" disabled={loginLoading}>
                  {loginLoading ? "Entrando..." : "Entrar"}
                </button>
              </form>
            )}

            {/* SIGNUP COMPLETO */}
            {tab === "signup" && (
              <form onSubmit={handleSignup} className="grid grid-cols-1 gap-4">
                {/* Passo 1 - Conta */}
                <StepPanel badge="Passo 1" title="Conta de acesso">
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="ui-label">Usuário *</label>
                      <input
                        required
                        value={rUser}
                        onChange={(e) => setRUser(e.target.value)}
                        className="ui-input mt-1 text-slate-100 placeholder:text-slate-500"
                      />
                    </div>
                    <div>
                      <label className="ui-label">Senha *</label>
                      <input
                        required
                        type="password"
                        value={rPass}
                        onChange={(e) => setRPass(e.target.value)}
                        className="ui-input mt-1 text-slate-100 placeholder:text-slate-500"
                      />
                    </div>
                    <div>
                      <label className="ui-label">Confirmar *</label>
                      <input
                        required
                        type="password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        className="ui-input mt-1 text-slate-100 placeholder:text-slate-500"
                      />
                    </div>
                  </div>
                  <p className="ui-hint">
                    Os campos marcados com * são obrigatórios.
                  </p>
                </StepPanel>

                {/* Passo 2 - Perfil básico */}
                <StepPanel badge="Passo 2" title="Perfil básico">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="ui-label">Nome (card) *</label>
                      <input
                        required
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="ui-input mt-1 text-slate-100 placeholder:text-slate-500"
                        placeholder="Seu nome completo"
                      />
                    </div>

                    <div>
                      <label className="ui-label">Cargo *</label>
                      <input
                        required
                        value={cargo}
                        onChange={(e) => setCargo(e.target.value)}
                        className="ui-input mt-1 text-slate-100 placeholder:text-slate-500"
                        placeholder="Ex.: Eng. de Software"
                      />
                    </div>

                    <div>
                      <label className="ui-label">Cidade</label>
                      <input
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                        className="ui-input mt-1 text-slate-100 placeholder:text-slate-500"
                        placeholder="Ex.: São Paulo"
                      />
                    </div>

                    <div>
                      <label className="ui-label">Estado *</label>
                      <select
                        required
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        className="ui-input mt-1 text-slate-100"
                      >
                        <option value="">Selecione</option>
                        {ESTADOS_BRASIL.map((uf) => (
                          <option key={uf} value={uf}>
                            {uf}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="ui-label">Área</label>
                      <input
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        className="ui-input mt-1 text-slate-100 placeholder:text-slate-500"
                        placeholder="Ex.: Desenvolvimento, Dados, Design..."
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="ui-label">Resumo</label>
                      <textarea
                        rows={3}
                        value={resumo}
                        onChange={(e) => setResumo(e.target.value)}
                        className="ui-input mt-1 text-slate-100 placeholder:text-slate-500"
                        placeholder="Conte rapidamente sua experiência, foco e principais resultados."
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="ui-label">URL da foto</label>
                      <input
                        value={foto}
                        onChange={(e) => setFoto(e.target.value)}
                        className="ui-input mt-1 text-slate-100 placeholder:text-slate-500"
                        placeholder="https://sua-foto.com/perfil.jpg"
                      />
                      <p className="ui-hint">
                        Use uma foto quadrada (1:1). Se quiser, pode colar a URL
                        da sua foto do LinkedIn / GitHub.
                      </p>
                    </div>
                  </div>
                </StepPanel>

                {/* Passo 3 - Habilidades */}
                <StepPanel badge="Passo 3" title="Habilidades">
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
                </StepPanel>

                {/* Passo 4 - Experiências / Formação / Projetos */}
                <StepPanel badge="Passo 4" title="Experiência e formação">
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
                </StepPanel>

                {/* Passo 5 - Extras */}
                <StepPanel badge="Passo 5" title="Extras do perfil">
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
                </StepPanel>

                {/* Passo 6 - Redes sociais (opcional) */}
                <StepPanel badge="Opcional" title="Redes e links">
                  <p className="ui-hint mb-2">
                    Preencha se quiser deixar seus contatos à vista nos detalhes
                    do perfil.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="ui-label">LinkedIn</label>
                      <input
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        className="ui-input mt-1 text-slate-100 placeholder:text-slate-500"
                        placeholder="URL do LinkedIn"
                      />
                    </div>
                    <div>
                      <label className="ui-label">GitHub</label>
                      <input
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        className="ui-input mt-1 text-slate-100 placeholder:text-slate-500"
                        placeholder="URL do GitHub"
                      />
                    </div>
                    <div>
                      <label className="ui-label">Portfólio</label>
                      <input
                        value={portfolio}
                        onChange={(e) => setPortfolio(e.target.value)}
                        className="ui-input mt-1 text-slate-100 placeholder:text-slate-500"
                        placeholder="Site / Portfólio"
                      />
                    </div>
                    <div>
                      <label className="ui-label">Instagram</label>
                      <input
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        className="ui-input mt-1 text-slate-100 placeholder:text-slate-500"
                        placeholder="@seuusuario"
                      />
                    </div>
                  </div>
                </StepPanel>

                <button
                  type="submit"
                  disabled={loading}
                  className="ui-btn-primary mt-1"
                >
                  {loading ? "Criando…" : "Criar conta e card"}
                </button>
                <p className="ui-hint">
                  Seu card será adicionado automaticamente ao fim da lista.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
