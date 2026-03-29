const start = '2026-03-16';
const end = '2026-03-22';

export const fallbackSchedulePayload = {
  generatedAt: new Date().toISOString(),
  currentWeek: {
    id: `semana-${start}`,
    fecha_inicio_semana: start,
    fecha_fin_semana: end,
    etiqueta: 'Semana actual',
    eventos: [
      {
        id: 'martes-caballeros',
        dia: 'Martes',
        titulo: 'Culto de Caballeros',
        hora: '7:00 PM',
        descripcion: 'Reunión especial para fortalecer la fe, el liderazgo y el compañerismo cristiano.',
        tipo: 'culto',
        mensaje: 'Te invitamos a vivir una noche de oración, palabra y comunión en IPUC Villa del Río.',
        media: '',
        invitacion: {
          id: 'inv-martes-caballeros',
          id_evento: 'martes-caballeros',
          imagen_url: '',
          video_url: '',
          descripcion_completa:
            'Ven con tu familia y amigos a compartir un tiempo especial de adoración y edificación espiritual.',
        },
      },
      {
        id: 'jueves-evangelismo',
        dia: 'Jueves',
        titulo: 'Culto de Evangelismo',
        hora: '7:00 PM',
        descripcion: 'Servicio enfocado en compartir el mensaje de salvación y recibir invitados.',
        tipo: 'evangelismo',
        mensaje: 'Invita a alguien nuevo y acompáñanos a celebrar lo que Dios está haciendo.',
        media: '',
        invitacion: {
          id: 'inv-jueves-evangelismo',
          id_evento: 'jueves-evangelismo',
          imagen_url: '',
          video_url: '',
          descripcion_completa:
            'Una noche pensada para alcanzar corazones con un ambiente cálido, dinámico y profundamente espiritual.',
        },
      },
      {
        id: 'sabado-escuela',
        dia: 'Sábado',
        titulo: 'Culto Escuela Dominical',
        hora: '6:00 PM',
        descripcion: 'Encuentro formativo con énfasis bíblico, participación congregacional y avivamiento.',
        tipo: 'formacion',
        mensaje: 'Prepárate para aprender más de la Palabra y crecer junto a la iglesia.',
        media: '',
        invitacion: {
          id: 'inv-sabado-escuela',
          id_evento: 'sabado-escuela',
          imagen_url: '',
          video_url: '',
          descripcion_completa:
            'Una jornada especial de preparación espiritual para toda la congregación, ideal para compartir y proyectar.',
        },
      },
      {
        id: 'domingo-dominical',
        dia: 'Domingo',
        titulo: 'Escuela Dominical',
        hora: '9:00 AM',
        descripcion: 'La reunión principal de la semana para aprender, adorar y recibir a los visitantes.',
        tipo: 'escuela-dominical',
        mensaje: 'Celebremos juntos la fidelidad de Dios en una mañana de enseñanza y adoración.',
        media: '',
        invitacion: {
          id: 'inv-domingo-dominical',
          id_evento: 'domingo-dominical',
          imagen_url: '',
          video_url: '',
          descripcion_completa:
            'Te esperamos con toda tu familia para vivir una mañana especial, llena de palabra, alabanza y unidad.',
        },
      },
    ],
  },
  allWeeks: [],
};
