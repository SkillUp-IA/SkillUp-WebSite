// src/components/Card.jsx
export default function Card({ profile, onOpen }) {
  const {
    nome = "Nome não informado",
    cargo = "Cargo não informado",
    localizacao,
    area,
    resumo,
    habilidadesTecnicas = [],
    foto,
  } = profile || {};

  // Monta a linha de localização/área de forma segura
  const locationParts = [];
  if (localizacao) locationParts.push(localizacao);
  if (area) locationParts.push(area);
  const locationLine =
    locationParts.join(" • ") || "Localização e área não informadas";

  // Avatar: se não tiver foto válida, mostra iniciais
  const hasFoto = !!foto;
  const initials =
    nome &&
    nome
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("");

  return (
    <button
      type="button"
      onClick={() => onOpen?.(profile)}
      className="
        group text-left w-full
        rounded-2xl border border-slate-200/80 dark:border-slate-800
        bg-white/95 dark:bg-slate-900/90
        p-4 sm:p-5

        transform-gpu will-change-transform
        transition-all duration-200 ease-out
        hover:-translate-y-1 hover:scale-[1.02] hover:border-sky-300/90 dark:hover:border-sky-500/70
        hover:shadow-xl hover:shadow-sky-900/20
        active:scale-[0.99]

        focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
      "
    >
      <div className="flex items-center gap-4">
        {hasFoto ? (
          <img
            src={foto}
            alt={nome}
            className="h-14 w-14 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-sky-400/80 transition-colors"
          />
        ) : (
          <div
            className="
              h-14 w-14 rounded-full
              bg-gradient-to-br from-sky-500 to-indigo-600
              flex items-center justify-center
              text-sm font-semibold text-white
              ring-2 ring-slate-200 dark:ring-slate-700
            "
          >
            {initials || "SU"}
          </div>
        )}

        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-slate-50 truncate">
            {nome}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 truncate">
            {cargo}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {locationLine}
          </p>
        </div>
      </div>

      {!!resumo && (
        <p className="mt-3 text-sm text-slate-700 dark:text-slate-200 line-clamp-2">
          {resumo}
        </p>
      )}

      {!!habilidadesTecnicas.length && (
        <div className="mt-3 flex flex-wrap gap-2">
          {habilidadesTecnicas.slice(0, 4).map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="
                px-2 py-1 text-[11px] rounded-full
                bg-slate-100 text-slate-700
                dark:bg-slate-800 dark:text-slate-100
                border border-slate-200/70 dark:border-slate-700/70
                group-hover:bg-sky-50 group-hover:border-sky-300
                dark:group-hover:bg-sky-900/30 dark:group-hover:border-sky-600
                transition-colors
              "
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}
