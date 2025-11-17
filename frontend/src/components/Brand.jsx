// src/components/Brand.jsx
export default function Brand({
  size = 40,
  stacked = false,
  showText = true,
  subtitle,
}) {
  const WrapperTag = "div";

  return (
    <WrapperTag
      className={
        stacked
          ? "flex flex-col items-center gap-2"
          : "flex items-center gap-2"
      }
    >
      {/* Usa arquivo em /public (Vite serve como /skillup-logo.png) */}
      <img
        src="/skillup-logo.png"
        alt="SkillUp IA"
        width={size}
        height={size}
        draggable="false"
        className="select-none pointer-events-none rounded-2xl shadow-sm shadow-sky-500/20"
      />

      {showText && (
        <div
          className={
            stacked
              ? "flex flex-col items-center text-center"
              : "flex flex-col"
          }
        >
          <span className="font-semibold text-slate-50 text-lg sm:text-xl tracking-tight">
            <span className="text-sky-400">Skill</span>
            <span className="text-slate-50">Up</span>{" "}
            <span className="text-slate-300">IA</span>
          </span>

          {subtitle && (
            <span className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </WrapperTag>
  );
}
