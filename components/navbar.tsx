'use client';

import Link from 'next/link';
import { useCart } from '@/context/cart-context';

export default function Navbar() {
  const { items } = useCart();

  return (
    <header className="sticky top-0 z-50 mb-8 border-b border-white/10 bg-az-black/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-semibold tracking-[0.25em] gradient-text">AZ MODA</Link>
        <div className="flex items-center gap-6 text-sm text-white/80">
          <Link href="/checkout">Carrito ({items.length})</Link>
          <Link href="/admin/login" className="rounded-full border border-az-gold/60 px-4 py-1 text-az-beige">Admin</Link>
        </div>
      </nav>
    </header>
  );
}
