'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/product-card';
import { Product } from '@/types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState('Todos');

  useEffect(() => {
    fetch('/api/products').then((r) => r.json()).then(setProducts);
  }, []);

  const categories = ['Todos', ...new Set(products.map((p) => p.category))];
  const filtered = category === 'Todos' ? products : products.filter((p) => p.category === category);

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-az-charcoal to-black p-10 shadow-glow">
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          <p className="mb-3 text-az-gold">Boutique Tecnológica de Lujo</p>
          <h1 className="mb-5 text-5xl font-semibold leading-tight gradient-text">AZ Moda: el futuro del estilo premium.</h1>
          <p className="text-white/70">Diseño internacional con estética futurista, materiales visuales inmersivos y experiencia de compra de alta gama.</p>
        </motion.div>
      </section>

      <section className="flex flex-wrap gap-3">
        {categories.map((c) => (
          <button key={c} onClick={() => setCategory(c)} className={`rounded-full px-4 py-2 text-sm ${category === c ? 'bg-az-gold text-black' : 'glass text-white/80'}`}>
            {c}
          </button>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </section>
    </div>
  );
}
