const songs = [
  { title: 'Hay Libertad', structure: 'V1 · C · V2 · C · Puente' },
  { title: 'Alaba a Dios', structure: 'V1 · C · V2 · C' },
  { title: 'Digno y Santo', structure: 'V1 · C · Puente · C' }
];

export function SongsPage() {
  return (
    <section className="glass rounded-2xl p-6">
      <h2 className="text-xl font-semibold">Biblioteca de Canciones</h2>
      <p className="mb-4 mt-2 text-slate-300">Búsqueda rápida, editor avanzado e importación desde TXT, DOCX y PDF.</p>
      <div className="space-y-2">
        {songs.map((song) => (
          <div key={song.title} className="rounded-xl border border-white/10 bg-black/20 p-3">
            <p className="font-medium">{song.title}</p>
            <p className="text-sm text-slate-400">{song.structure}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
