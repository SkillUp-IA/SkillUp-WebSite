export default function Card({ profile, onOpen }) {
  return (
    <button
      onClick={() => onOpen(profile)}
      className="group w-full text-left rounded-2xl p-[1px] bg-gradient-to-br from-emerald-500/30 via-blue-500/20 to-purple-500/30 hover:shadow-lg transition-transform hover:-translate-y-0.5"
    >
      <div className="rounded-2xl p-4 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-4">
          <img src={profile.foto} alt={profile.nome} className="h-16 w-16 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-800" />
          <div>
            <h3 className="font-semibold text-lg">{profile.nome}</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">{profile.cargo}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{profile.localizacao} • {profile.area}</p>
          </div>
        </div>

        <p className="mt-3 text-sm line-clamp-2 text-zinc-700 dark:text-zinc-200">{profile.resumo}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {(profile.habilidadesTecnicas || []).slice(0, 3).map((t) => (
            <span key={t}
              className="px-2 py-1 text-xs rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
              {t}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
