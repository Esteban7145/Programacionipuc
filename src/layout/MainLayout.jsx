import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Music2, BookText, Megaphone, Workflow, Sparkles } from 'lucide-react';

const items = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/songs', label: 'Canciones', icon: Music2 },
  { to: '/bible', label: 'Biblia', icon: BookText },
  { to: '/announcements', label: 'Anuncios', icon: Megaphone },
  { to: '/scenes', label: 'Escenas', icon: Workflow },
  { to: '/ai', label: 'Asistente IA', icon: Sparkles }
];

export function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-grid bg-[size:24px_24px]">
      <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-4 p-4">
        <aside className="glass col-span-2 rounded-2xl p-4">
          <h1 className="mb-6 text-xl font-semibold">IPUC Vision</h1>
          <nav className="space-y-2">
            {items.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-2 rounded-xl px-3 py-2 transition ${isActive ? 'bg-indigo-500/40' : 'hover:bg-white/10'}`}>
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="col-span-10 space-y-4">{children}</main>
      </div>
    </div>
  );
}
