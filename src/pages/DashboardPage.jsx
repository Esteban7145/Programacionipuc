import { useEffect, useState } from 'react';
import { StatCard } from '../components/StatCard';

export function DashboardPage() {
  const [serverInfo, setServerInfo] = useState({ running: false, port: '-' });

  useEffect(() => {
    window.ipucApi?.getServerStatus?.().then(setServerInfo).catch(() => {
      setServerInfo({ running: false, port: '-' });
    });
  }, []);

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
        <StatCard
          title="Servidor local"
          value={serverInfo.running ? 'Activo' : 'Inactivo'}
          subtitle={`Auto inicio al abrir la app · Puerto ${serverInfo.port}`}
        />
      </div>
    </section>
  );
}
