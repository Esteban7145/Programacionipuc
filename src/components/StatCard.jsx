export function StatCard({ title, value, subtitle }) {
  return (
    <article className="glass rounded-2xl p-4">
      <p className="text-xs uppercase tracking-wider text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      <p className="mt-2 text-sm text-slate-300">{subtitle}</p>
    </article>
  );
}
