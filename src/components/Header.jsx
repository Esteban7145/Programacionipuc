import { CalendarDays, Church, Download, ShieldCheck } from 'lucide-react';

export default function Header({ currentDateLabel, onDownload, onAdminToggle, isAdminOpen }) {
  return (
    <header className="relative overflow-hidden rounded-[2rem] border border-church-400/20 bg-slate-900/80 p-6 shadow-glow">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_35%),linear-gradient(135deg,rgba(15,23,42,0.95),rgba(15,23,42,0.75))]" />
      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-church-400/20 bg-church-500/10 px-3 py-1 text-sm text-church-100">
            <Church size={16} />
            IPUC Villa del Río
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">Cronograma semanal</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
              Una experiencia moderna para visualizar, compartir y administrar la programación de la iglesia con actualización automática por semana.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="glass inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm text-slate-100">
            <CalendarDays size={18} className="text-church-300" />
            <span>{currentDateLabel}</span>
          </div>
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-church-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-church-400"
          >
            <Download size={18} />
            Descargar cronograma
          </button>
          <button
            type="button"
            onClick={onAdminToggle}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition ${
              isAdminOpen
                ? 'border-church-300 bg-church-400/10 text-church-100'
                : 'border-white/10 bg-white/5 text-slate-100 hover:border-church-300/60'
            }`}
          >
            <ShieldCheck size={18} />
            Panel DECOM
          </button>
        </div>
      </div>
    </header>
  );
}
