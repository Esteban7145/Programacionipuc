import { SongEditor } from '@/components/song-editor';
import { ThemePanel } from '@/components/theme-panel';

export default function DashboardPage() {
  return (
    <main className="container grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
      <section className="glass" style={{ padding: 24 }}>
        <h2>Panel Administrador DECOM</h2>
        <p>Gestiona canciones, versículos, plantillas y presentaciones especiales.</p>
        <SongEditor />
      </section>
      <aside className="glass" style={{ padding: 24 }}>
        <ThemePanel />
      </aside>
    </main>
  );
}
