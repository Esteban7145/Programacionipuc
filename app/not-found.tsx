import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="glass mx-auto mt-20 max-w-2xl rounded-3xl p-10 text-center">
      <p className="mb-3 text-sm uppercase tracking-[0.3em] text-az-gold">404</p>
      <h1 className="mb-3 text-3xl font-semibold">Ruta no encontrada</h1>
      <p className="mb-8 text-white/70">La página que buscas no existe o fue movida dentro de AZ Moda.</p>
      <Link href="/" className="rounded-xl bg-az-gold px-5 py-3 font-medium text-black">
        Volver al inicio
      </Link>
    </section>
  );
}
