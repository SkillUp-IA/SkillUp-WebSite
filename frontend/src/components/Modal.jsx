import { useState } from 'react'
import anime from 'animejs'
import { recommendProfile } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Modal({ open, onClose, data }) {
  const { username } = useAuth()
  const [msg, setMsg] = useState('Curti seu perfil! Vamos conectar?')
  const [sending, setSending] = useState(false)

  if (!open || !data) return null

  async function handleRecommend() {
    try {
      setSending(true)
      await recommendProfile({
        toId: data.id,
        message: msg,
        from: username || 'guest',
      })
      anime({ targets: '#rec-ok', scale: [0.9, 1], opacity: [0, 1], duration: 400, easing: 'easeOutQuad' })
      alert('Recomendação enviada!')
    } catch (e) {
      alert(e.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <img src={data.foto} alt={data.nome} className="h-16 w-16 rounded-full object-cover" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{data.nome}</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              {data.cargo} — {data.localizacao}
            </p>
          </div>
          <button onClick={onClose} className="text-sm px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-800">
            Fechar
          </button>
        </div>

        <div className="mt-4 space-y-3 text-sm">
          <section>
            <h3 className="font-medium">Resumo</h3>
            <p className="text-zinc-700 dark:text-zinc-200">{data.resumo}</p>
          </section>

          <section>
            <h3 className="font-medium">Habilidades Técnicas</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {data.habilidadesTecnicas?.map((t) => (
                <span key={t} className="px-2 py-1 text-xs rounded-full bg-zinc-100 dark:bg-zinc-800">{t}</span>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-medium">Soft skills</h3>
            <p>{data.softSkills?.join(' • ')}</p>
          </section>

          <section>
            <h3 className="font-medium">Experiências</h3>
            <ul className="list-disc pl-5">
              {data.experiencias?.map((e, i) => (
                <li key={i}>{e.empresa} — {e.cargo} ({e.inicio} → {e.fim})</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            value={msg}
            onChange={e => setMsg(e.target.value)}
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

        <div id="rec-ok" className="opacity-0 mt-2 text-xs text-emerald-600">ok</div>

        <div className="mt-3">
          <button
            onClick={() => alert('Mensagem enviada!')}
            className="rounded-lg px-4 py-2 bg-zinc-200 dark:bg-zinc-800"
          >
            Enviar mensagem
          </button>
        </div>
      </div>
    </div>
  )
}
