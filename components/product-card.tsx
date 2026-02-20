'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div whileHover={{ rotateX: 3, rotateY: -3, y: -6 }} transition={{ type: 'spring', stiffness: 220 }} className="glass group rounded-3xl p-4 shadow-glow">
      <Link href={`/producto/${product._id}`}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
          <Image src={product.images[0]} alt={product.name} fill className="object-cover transition duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
        <div className="mt-4">
          <h3 className="font-medium">{product.name}</h3>
          <p className="text-sm text-white/60">{product.category}</p>
          <p className="mt-2 text-az-gold">${product.price.toLocaleString('es-CO')}</p>
        </div>
      </Link>
    </motion.div>
  );
}
