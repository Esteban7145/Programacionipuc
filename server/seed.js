import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { addDays, format, startOfWeek } from 'date-fns';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'data', 'db.json');

const baseStart = startOfWeek(new Date(), { weekStartsOn: 1 });
const weeklyTemplates = [
  {
    dia: 'Martes',
    titulo: 'Culto de Caballeros',
    hora: '7:00 PM',
    descripcion: 'Un espacio para fortalecer el liderazgo, la oración y el compañerismo de los caballeros.',
    tipo: 'culto',
  },
  {
    dia: 'Jueves',
    titulo: 'Culto de Evangelismo',
    hora: '7:00 PM',
    descripcion: 'Una noche para compartir el mensaje de salvación y recibir invitados especiales.',
    tipo: 'evangelismo',
  },
  {
    dia: 'Sábado',
    titulo: 'Culto Escuela Dominical',
    hora: '6:00 PM',
    descripcion: 'Capacitación bíblica dinámica para toda la congregación con enfoque formativo.',
    tipo: 'formacion',
  },
  {
    dia: 'Domingo',
    titulo: 'Escuela Dominical',
    hora: '9:00 AM',
    descripcion: 'Jornada principal de enseñanza, adoración y bienvenida para la familia y visitantes.',
    tipo: 'escuela-dominical',
  },
];

const schedules = Array.from({ length: 8 }, (_, index) => {
  const weekStart = addDays(baseStart, index * 7);
  const weekEnd = addDays(weekStart, 6);
  return {
    id: `semana-${format(weekStart, 'yyyy-MM-dd')}`,
    fecha_inicio_semana: format(weekStart, 'yyyy-MM-dd'),
    fecha_fin_semana: format(weekEnd, 'yyyy-MM-dd'),
    etiqueta: `Semana ${index + 1}`,
    eventos: weeklyTemplates.map((event, eventIndex) => ({
      id: `evento-${index + 1}-${eventIndex + 1}`,
      ...event,
      mensaje: `Te esperamos este ${event.dia.toLowerCase()} para vivir una experiencia espiritual en IPUC Villa del Río.`,
      media: '',
    })),
  };
});

const invitations = schedules.flatMap((schedule) =>
  schedule.eventos.map((event) => ({
    id: `inv-${event.id}`,
    id_evento: event.id,
    imagen_url: '',
    video_url: '',
    descripcion_completa: `${event.titulo}: una invitación especial para que participes junto a tu familia y amigos.`,
  })),
);

fs.writeFileSync(dbPath, JSON.stringify({ schedules, invitations }, null, 2));
console.log(`Datos semilla generados en ${dbPath}`);
