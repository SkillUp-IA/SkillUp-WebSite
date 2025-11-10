export default function Card({ profile, onOpen }) {
    return (
      <button
        onClick={() => onOpen(profile)}
        className="w-full text-left rounded-2xl shadow p-4 bg-white hover:shadow-md transition dark:bg-zinc-900"
      >
        <div className="flex items-center gap-4">
          <img src={profile.foto} alt={profile.nome} className="h-16 w-16 rounded-full object-cover" />
          <div>
            <h3 className="font-semibold text-lg">{profile.nome}</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">{profile.cargo}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{profile.localizacao} • {profile.area}</p>
          </div>
        </div>
 
        <p className="mt-3 text-sm line-clamp-2 text-zinc-700 dark:text-zinc-200">{profile.resumo}</p>
 
        <div className="mt-3 flex flex-wrap gap-2">
          {profile.habilidadesTecnicas?.slice(0,3).map((t) => (
            <span key={t} className="px-2 py-1 text-xs rounded-full bg-zinc-100 dark:bg-zinc-800">
              {t}
            </span>
          ))}
        </div>
      </button>
    );
  }