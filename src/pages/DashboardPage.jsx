import { StatCard } from '../components/StatCard';

export function DashboardPage() {
  return (
    <section className="space-y-4">
      <header className="glass rounded-2xl p-6">
        <h2 className="text-2xl font-semibold">Centro de Control Pentecostal</h2>
        <p className="mt-2 text-slate-300">Proyección profesional para cultos, congresos, vigilias y campañas IPUC.</p>
      </header>
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Canciones" value="1,248" subtitle="Biblioteca con versos, coros y puentes" />
        <StatCard title="Versículos" value="12,850" subtitle="Múltiples versiones bíblicas integradas" />
        <StatCard title="Escenas" value="82" subtitle="Automatizaciones para servicios completos" />
        <StatCard title="Estado" value="Live" subtitle="Motor multimedia activo a 60 FPS" />
      </div>
    </section>
  );
}
