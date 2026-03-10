'use client';

import { useMemo, useState } from 'react';

const splitLyrics = (lyrics) =>
  lyrics
    .split('\n\n')
    .flatMap((block) => block.match(/.{1,100}(\s|$)/g) ?? [])
    .map((line) => line.trim())
    .filter(Boolean);

export function SongEditor() {
  const [title, setTitle] = useState('Santo por Siempre');
  const [lyrics, setLyrics] = useState('Tu nombre es alto\nTu nombre es digno\n\nRey de gloria\nRey eterno');

  const slides = useMemo(() => splitLyrics(lyrics), [lyrics]);

  return (
    <div className="grid">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" />
      <textarea value={lyrics} onChange={(e) => setLyrics(e.target.value)} rows={8} />
      <button>Guardar canción</button>
      <h4>Previsualización automática de diapositivas</h4>
      <ol>
        {slides.map((slide, idx) => (
          <li key={`${slide}-${idx}`}>{slide}</li>
        ))}
      </ol>
    </div>
  );
}
