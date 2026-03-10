import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container">
      <section className="glass" style={{ padding: 28 }}>
        <h1>Página no encontrada</h1>
        <p>La ruta solicitada no existe. Vuelve al inicio del sistema de proyección IPUC.</p>
        <Link href="/">Ir al inicio</Link>
      </section>
    </main>
  );
}
