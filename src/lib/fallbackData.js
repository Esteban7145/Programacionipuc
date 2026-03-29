const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const toIsoDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getMonday = (sourceDate = new Date()) => {
  const date = new Date(sourceDate);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
};

const escapeXml = (value) =>
  String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const getVerseByType = (type) => {
  const normalized = String(type || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  const verses = {
    'escuela-dominical': 'Instruye al niño en su camino. — Proverbios 22:6',
    culto: 'Donde están dos o tres congregados en mi nombre, allí estoy yo. — Mateo 18:20',
    evangelismo: 'Id por todo el mundo y predicad el evangelio. — Marcos 16:15',
  };
  return verses[normalized] || 'Este es el día que hizo Jehová; nos gozaremos en él. — Salmo 118:24';
};

const buildAutoImage = (event, weekLabel) => {
  const title = escapeXml(event.titulo);
  const subtitle = escapeXml(`${event.dia} ${event.fecha}`);
  const hour = escapeXml(event.hora);
  const verse = escapeXml(getVerseByType(event.tipo));
  const label = escapeXml(weekLabel);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="60%" stop-color="#1d4ed8"/>
          <stop offset="100%" stop-color="#7c3aed"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <text x="80" y="110" fill="#bfdbfe" font-family="Arial, sans-serif" font-size="34" font-weight="700">IPUC Villa del Río</text>
      <text x="80" y="230" fill="#ffffff" font-family="Arial, sans-serif" font-size="72" font-weight="700">${title}</text>
      <text x="80" y="300" fill="#e2e8f0" font-family="Arial, sans-serif" font-size="40">${subtitle}</text>
      <text x="80" y="360" fill="#ffffff" font-family="Arial, sans-serif" font-size="50" font-weight="700">${hour}</text>
      <rect x="80" y="430" width="1120" height="180" rx="28" fill="rgba(2,6,23,0.45)" />
      <text x="110" y="505" fill="#dbeafe" font-family="Arial, sans-serif" font-size="34" font-style="italic">${verse}</text>
      <text x="110" y="565" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="28">Semana: ${label}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export const createFallbackSchedulePayload = () => {
  const monday = getMonday(new Date());
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const thursday = new Date(monday);
  thursday.setDate(monday.getDate() + 3);

  const label = `Semana del ${toIsoDate(monday)} al ${toIsoDate(sunday)}`;
  const events = [
    {
      id: `fallback-jueves-${toIsoDate(thursday)}`,
      fecha: toIsoDate(thursday),
      dia: DAY_NAMES[thursday.getDay()],
      titulo: 'Culto de Oración y Enseñanza',
      hora: '7:00 PM',
      descripcion: 'Servicio base de oración y enseñanza para toda la congregación.',
      tipo: 'culto',
      mensaje: 'Te esperamos este jueves para un tiempo especial de oración y enseñanza bíblica.',
      media: '',
    },
    {
      id: `fallback-domingo-${toIsoDate(sunday)}`,
      fecha: toIsoDate(sunday),
      dia: DAY_NAMES[sunday.getDay()],
      titulo: 'Escuela Dominical',
      hora: '9:00 AM',
      descripcion: 'Espacio dominical de formación bíblica para toda la iglesia.',
      tipo: 'escuela-dominical',
      mensaje: 'Acompáñanos este domingo en nuestra Escuela Dominical.',
      media: '',
    },
  ];

  return {
    generatedAt: new Date().toISOString(),
    currentWeek: {
      id: `semana-${toIsoDate(monday)}`,
      fecha_inicio_semana: toIsoDate(monday),
      fecha_fin_semana: toIsoDate(sunday),
      etiqueta: label,
      eventos: events.map((event) => ({
        ...event,
        invitacion: {
          id: `inv-${event.id}`,
          id_evento: event.id,
          imagen_url: buildAutoImage(event, label),
          video_url: '',
          descripcion_completa: `${event.titulo} | ${event.dia} ${event.fecha} | ${event.hora}`,
        },
      })),
    },
    allWeeks: [],
  };
};
