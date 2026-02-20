'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import { useCart } from '@/context/cart-context';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>();
  const [selectedSize, setSelectedSize] = useState<string>();
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) fetch(`/api/products/${id}`).then((r) => r.json()).then(setProduct);
  }, [id]);

  if (!product) return <p>Cargando...</p>;

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="glass relative aspect-square overflow-hidden rounded-3xl">
          <Image src={product.images[currentImage]} alt={product.name} fill className="object-cover" />
        </div>
        <div className="flex gap-3">
          {product.images.map((img, i) => (
            <button key={img} onClick={() => setCurrentImage(i)} className="relative h-20 w-20 overflow-hidden rounded-xl border border-white/20">
              <Image src={img} alt="mini" fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-3xl p-8">
        <h1 className="text-3xl font-semibold">{product.name}</h1>
        <p className="mt-4 text-white/70">{product.description}</p>
        <p className="mt-6 text-2xl text-az-gold">${product.price.toLocaleString('es-CO')}</p>
        <p className="text-sm text-white/60">Stock disponible: {product.stock}</p>

        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button key={color} onClick={() => setSelectedColor(color)} className={`rounded-full border px-3 py-1 ${selectedColor === color ? 'border-az-gold text-az-gold' : 'border-white/20'}`}>{color}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button key={size} onClick={() => setSelectedSize(size)} className={`rounded-full border px-3 py-1 ${selectedSize === size ? 'border-az-electric text-az-electric' : 'border-white/20'}`}>{size}</button>
            ))}
          </div>
        </div>

        <motion.button whileTap={{ scale: 0.95 }} onClick={() => addToCart(product, selectedColor, selectedSize)} className="mt-8 w-full rounded-2xl bg-az-gold py-3 font-medium text-black shadow-gold">
          Agregar al carrito
        </motion.button>
      </motion.div>
    </div>
  );
}
