import Link from 'next/link';

export default function Home() {
  return (
    <main className="container">
      <section className="glass" style={{ padding: 28 }}>
        <h1>IPUC Proyección SaaS</h1>
        <p>Sistema multi-tenant moderno para canciones, versículos y presentaciones especiales.</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/login">Iniciar sesión</Link>
          <Link href="/dashboard">Ir al panel</Link>
          <Link href="/presentation">Modo proyección</Link>
        </div>
      </section>
    </main>
  );
}
