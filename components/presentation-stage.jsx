'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const slides = ['Tu fidelidad nunca falla', 'Grande es tu nombre Jesús', 'Eres digno de adoración'];

export function PresentationStage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') setIndex((prev) => Math.min(prev + 1, slides.length - 1));
      if (e.key === 'ArrowLeft') setIndex((prev) => Math.max(prev - 1, 0));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <section className="glass" style={{ minHeight: '70vh', padding: 24 }}>
      <h2>Modo Proyección Profesional</h2>
      <p>Control con flechas, transición suave y vista lista para pantalla externa.</p>
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[index]}
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
          transition={{ duration: 0.5 }}
          style={{
            marginTop: 40,
            fontSize: '3rem',
            textAlign: 'center',
            textShadow: '0 0 18px rgba(62, 123, 255, 0.55), 0 0 8px rgba(185, 150, 78, 0.35)'
          }}
        >
          {slides[index]}
        </motion.div>
      </AnimatePresence>
      <p style={{ marginTop: 24 }}>Siguiente: {slides[index + 1] ?? 'Fin de presentación'}</p>
    </section>
  );
}
