// src/components/Modal.jsx
import { useEffect, useState } from 'react'
import anime from 'animejs'
import { recommendProfile } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const RECO_STORAGE_KEY = 'skillup_recomendados'

export default function Modal({ open, onClose, data }) {
  // ✅ 1) Se não estiver aberto ou sem dados, nem monta hooks
  if (!open || !data) return null

  // ✅ 2) TODOS os hooks sempre na mesma ordem
  const { username } = useAuth()
  const [msg, setMsg] = useState('Curti seu perfil! Vamos conectar?')
  const [sending, setSending] = useState(false)
  const [isRecommended, setIsRecommended] = useState(false)

  // Dados do perfil com valores padrão
  const {
    id,
    nome = 'Nome não informado',
    cargo = 'Cargo não informado',
    localizacao = 'Localização não informada',
    resumo = '',
    foto,
    habilidadesTecnicas = [],
    softSkills = [],
    experiencias = [],
  } = data || {}

  // Verifica se esse perfil já está recomendado no localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem(RECO_STORAGE_KEY)
      const parsed = raw ? JSON.parse(raw) : []
      const list = Array.isArray(parsed) ? parsed : []
      setIsRecommended(list.includes(id))
    } catch (e) {
      console.error('Erro ao ler recomendações locais', e)
      setIsRecommended(false)
    }
  }, [id])

  function salvarRecomendacaoLocal(profileId) {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem(RECO_STORAGE_KEY)
      const prev = raw ? JSON.parse(raw) : []
      const list = Array.isArray(prev) ? prev : []
      if (!list.includes(profileId)) {
        list.push(profileId)
        localStorage.setItem(RECO_STORAGE_KEY, JSON.stringify(list))
      }
    } catch (e) {
      console.error('Erro ao salvar recomendação local', e)
    }
  }

  function removerRecomendacaoLocal(profileId) {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem(RECO_STORAGE_KEY)
      const prev = raw ? JSON.parse(raw) : []
      const list = Array.isArray(prev) ? prev.filter((x) => x !== profileId) : []
      localStorage.setItem(RECO_STORAGE_KEY, JSON.stringify(list))
    } catch (e) {
      console.error('Erro ao remover recomendação local', e)
    }
  }

  async function handleRecommend() {
    try {
      setSending(true)

      await recommendProfile({
        toId: id,
        message: msg,
        from: username || 'guest',
      })

      salvarRecomendacaoLocal(id)
      setIsRecommended(true)

      anime({
        targets: '#rec-ok',
        scale: [0.9, 1],
        opacity: [0, 1],
        duration: 400,
        easing: 'easeOutQuad',
      })

      alert('Recomendação enviada e perfil salvo nas suas sugestões!')
    } catch (e) {
      console.error(e)
      alert(e?.message || 'Erro ao recomendar profissional.')
    } finally {
      setSending(false)
    }
  }

  function handleUnrecommend() {
    try {
      removerRecomendacaoLocal(id)
      setIsRecommended(false)
      alert('Recomendação removida das suas sugestões.')
    } catch (e) {
      console.error(e)
      alert('Erro ao remover recomendação.')
    }
  }

  // ✅ 3) JSX normal
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-lg">
        {/* Cabeçalho */}
        <div className="flex items-center gap-4">
          <img
            src={foto}
            alt={nome}
            className="h-16 w-16 rounded-full object-cover bg-zinc-200 dark:bg-zinc-800"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold truncate">{nome}</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 truncate">
              {cargo} — {localizacao}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-sm px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-800"
          >
            Fechar
          </button>
        </div>

        {/* Conteúdo */}
        <div className="mt-4 space-y-3 text-sm">
          {resumo && (
            <section>
              <h3 className="font-medium">Resumo</h3>
              <p className="text-zinc-700 dark:text-zinc-200">{resumo}</p>
            </section>
          )}

          {!!habilidadesTecnicas.length && (
            <section>
              <h3 className="font-medium">Habilidades Técnicas</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {habilidadesTecnicas.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-1 text-xs rounded-full bg-zinc-100 dark:bg-zinc-800"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>
          )}

          {!!softSkills.length && (
            <section>
              <h3 className="font-medium">Soft skills</h3>
              <p>{softSkills.join(' • ')}</p>
            </section>
          )}

          {!!experiencias.length && (
            <section>
              <h3 className="font-medium">Experiências</h3>
              <ul className="list-disc pl-5 space-y-1">
                {experiencias.map((e, i) => (
                  <li key={i}>
                    {e.empresa} — {e.cargo} ({e.inicio} → {e.fim})
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Ações */}
        <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Mensagem de recomendação…"
            className="px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-sm outline-none"
          />
          <button
            onClick={handleRecommend}
            disabled={sending}
            className="rounded-lg px-4 py-2 bg-blue-600 text-white disabled:opacity-60"
          >
            {sending ? 'Enviando…' : 'Recomendar profissional'}
          </button>
        </div>

        {isRecommended && (
          <div className="mt-2 text-right">
            <button
              type="button"
              onClick={handleUnrecommend}
              className="text-xs text-red-600 hover:underline"
            >
              Remover recomendação
            </button>
          </div>
        )}

        <div id="rec-ok" className="opacity-0 mt-2 text-xs text-emerald-600">
          ok
        </div>
      </div>
    </div>
  )
}
