import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from './firebase';


export const demoEvents = [
  {
    id: 'demo-1',
    title: 'Culto Unido de Adoración',
    dateValue: new Date('2026-03-23T19:00:00'),
    type: 'Culto especial',
    description: 'Una noche enfocada en adoración congregacional, palabra y cobertura ministerial.',
    coverImage: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80',
    invitationLink: 'https://www.youtube.com/',
    invitationType: 'video',
  },
  {
    id: 'demo-2',
    title: 'Encuentro Juvenil Visionarios',
    dateValue: new Date('2026-03-26T18:30:00'),
    type: 'Juventud',
    description: 'Experiencia dinámica con enfoque en liderazgo, propósito y crecimiento espiritual.',
    coverImage: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
    invitationLink: 'https://www.instagram.com/',
    invitationType: 'link',
  },
  {
    id: 'demo-3',
    title: 'Campaña Evangelística Familiar',
    dateValue: new Date('2026-03-29T10:00:00'),
    type: 'Campaña',
    description: 'Jornada de alcance, integración familiar y testimonio comunitario.',
    coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    invitationLink: 'https://example.com/invitacion-familiar.jpg',
    invitationType: 'image',
  },
];

export const demoMedia = [
  { id: 'media-1', evento_id: 'demo-1', tipo: 'imagen', url: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80' },
  { id: 'media-2', evento_id: 'demo-1', tipo: 'imagen', url: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80' },
  { id: 'media-3', evento_id: 'demo-2', tipo: 'imagen', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80' },
  { id: 'media-4', evento_id: 'demo-3', tipo: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
];

export const demoSchedules = [
  {
    id: 'schedule-demo-1',
    monthKey: '2026-03',
    monthLabel: 'Marzo 2026',
    fileUrl: 'https://example.com/cronograma-marzo-2026.pdf',
  },
];

const collections = {
  events: collection(db, 'eventos'),
  media: collection(db, 'media'),
  schedules: collection(db, 'cronogramas'),
};

export const normalizeEvent = (doc) => {
  const data = doc.data();
  const dateValue = data.fecha?.toDate ? data.fecha.toDate() : new Date(data.fecha || Date.now());

  return {
    id: doc.id,
    title: data.titulo,
    dateValue,
    type: data.tipo,
    description: data.descripcion,
    coverImage: data.imagen_portada,
    invitationLink: data.invitacion_link,
    invitationType: data.invitacion_tipo || 'link',
  };
};

export const normalizeMedia = (doc) => ({
  id: doc.id,
  ...doc.data(),
});

export const normalizeSchedule = (doc) => ({
  id: doc.id,
  ...doc.data(),
});

export const fetchEvents = async () => {
  const snapshot = await getDocs(query(collections.events, orderBy('fecha', 'asc')));
  return snapshot.docs.map(normalizeEvent);
};

export const fetchMedia = async () => {
  const snapshot = await getDocs(collections.media);
  return snapshot.docs.map(normalizeMedia);
};

export const fetchSchedules = async () => {
  const snapshot = await getDocs(query(collections.schedules, orderBy('monthKey', 'asc')));
  return snapshot.docs.map(normalizeSchedule);
};

export const uploadFile = async (path, file) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

export const createEventRecord = async ({
  title,
  date,
  type,
  description,
  invitationLink,
  invitationType,
  coverImage,
  galleryFiles,
  videoFile,
}) => {
  const eventSlug = `${Date.now()}-${title.replace(/\s+/g, '-').toLowerCase()}`;
  const coverImageUrl = await uploadFile(`eventos/${eventSlug}/portada-${coverImage.name}`, coverImage);

  const eventDoc = await addDoc(collections.events, {
    titulo: title,
    fecha: Timestamp.fromDate(new Date(date)),
    tipo: type,
    descripcion: description,
    imagen_portada: coverImageUrl,
    invitacion_link: invitationLink,
    invitacion_tipo: invitationType,
    createdAt: serverTimestamp(),
  });

  const galleryUploads = (galleryFiles || []).map(async (file) => {
    const url = await uploadFile(`eventos/${eventSlug}/galeria-${file.name}`, file);
    return addDoc(collections.media, {
      evento_id: eventDoc.id,
      tipo: 'imagen',
      url,
      createdAt: serverTimestamp(),
    });
  });

  if (videoFile) {
    galleryUploads.push(
      (async () => {
        const url = await uploadFile(`eventos/${eventSlug}/video-${videoFile.name}`, videoFile);
        return addDoc(collections.media, {
          evento_id: eventDoc.id,
          tipo: 'video',
          url,
          createdAt: serverTimestamp(),
        });
      })()
    );
  }

  await Promise.all(galleryUploads);
  return eventDoc.id;
};

export const createScheduleRecord = async ({ monthKey, monthLabel, file }) => {
  const fileUrl = await uploadFile(`cronogramas/${monthKey}-${file.name}`, file);
  return addDoc(collections.schedules, {
    monthKey,
    monthLabel,
    fileUrl,
    createdAt: serverTimestamp(),
  });
};

export const getCurrentWeekRange = (referenceDate = new Date()) => {
  const current = new Date(referenceDate);
  const day = current.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const start = new Date(current);
  start.setDate(current.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

export const groupMediaByEvent = (media) =>
  media.reduce((acc, item) => {
    if (!acc[item.evento_id]) acc[item.evento_id] = [];
    acc[item.evento_id].push({ id: item.id, type: item.tipo, url: item.url });
    return acc;
  }, {});

export const getMonthKey = (date) => `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}`;

export const formatDisplayDate = (date) =>
  new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(date);

export const formatShortDate = (date) =>
  new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
  }).format(date);

export const formatRangeLabel = (start, end) =>
  `${new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long' }).format(start)} - ${new Intl.DateTimeFormat(
    'es-CO',
    { day: 'numeric', month: 'long', year: 'numeric' }
  ).format(end)}`;


export const deleteEventRecord = async (eventId) => deleteDoc(doc(db, 'eventos', eventId));
export const deleteScheduleRecord = async (scheduleId) => deleteDoc(doc(db, 'cronogramas', scheduleId));
