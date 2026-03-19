import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import xlsx from 'xlsx';
import { endOfWeek, format, isWithinInterval, parseISO, startOfWeek } from 'date-fns';
import { readDb, writeDb } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const app = express();
const PORT = process.env.PORT || 3001;
const uploadsDir = path.join(__dirname, 'uploads');
const adminUser = 'IPUCVILLADELRIO';
const adminPass = '99061408327';

fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    cb(null, safeName);
  },
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(rootDir));
app.use('/uploads', express.static(uploadsDir));

const normalizeSchedule = (input) => {
  const startDate = startOfWeek(parseISO(input.fecha_inicio_semana), { weekStartsOn: 1 });
  const endDate = input.fecha_fin_semana
    ? parseISO(input.fecha_fin_semana)
    : endOfWeek(startDate, { weekStartsOn: 1 });

  return {
    id: input.id || `semana-${format(startDate, 'yyyy-MM-dd')}`,
    etiqueta: input.etiqueta || `Semana del ${format(startDate, 'dd/MM')}`,
    fecha_inicio_semana: format(startDate, 'yyyy-MM-dd'),
    fecha_fin_semana: format(endDate, 'yyyy-MM-dd'),
    eventos: (input.eventos || []).map((event, index) => ({
      id: event.id || `${format(startDate, 'yyyyMMdd')}-${index + 1}`,
      dia: event.dia,
      titulo: event.titulo,
      hora: event.hora,
      descripcion: event.descripcion,
      tipo: event.tipo || 'culto',
      mensaje: event.mensaje || `Te esperamos este ${event.dia?.toLowerCase?.() || 'día'} en IPUC Villa del Río.`,
      media: event.media || '',
    })),
  };
};

const getCurrentWeekSchedule = (db) => {
  const today = new Date();
  const current = db.schedules.find((schedule) =>
    isWithinInterval(today, {
      start: parseISO(schedule.fecha_inicio_semana),
      end: parseISO(schedule.fecha_fin_semana),
    }),
  );

  return current || db.schedules[0] || null;
};

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const success = username === adminUser && password === adminPass;
  res.json({ success, role: success ? 'admin' : 'viewer' });
});

app.get('/api/public/schedule/current', (_req, res) => {
  const db = readDb();
  const current = getCurrentWeekSchedule(db);

  if (!current) {
    return res.status(404).json({ message: 'No hay cronogramas cargados.' });
  }

  const invitationsByEvent = Object.fromEntries(db.invitations.map((inv) => [inv.id_evento, inv]));
  const enriched = {
    ...current,
    eventos: current.eventos.map((event) => ({
      ...event,
      invitacion: invitationsByEvent[event.id] || null,
    })),
  };

  res.json({
    generatedAt: new Date().toISOString(),
    currentWeek: enriched,
    allWeeks: db.schedules,
  });
});

app.get('/api/admin/dashboard', (_req, res) => {
  const db = readDb();
  res.json({ schedules: db.schedules, invitations: db.invitations });
});

app.post('/api/admin/schedules/upload', upload.single('file'), (req, res) => {
  try {
    const db = readDb();
    let schedules = [];

    if (req.file) {
      const ext = path.extname(req.file.originalname).toLowerCase();
      if (ext === '.json') {
        schedules = JSON.parse(fs.readFileSync(req.file.path, 'utf-8'));
      } else if (ext === '.xlsx' || ext === '.xls') {
        const workbook = xlsx.readFile(req.file.path);
        const firstSheet = workbook.SheetNames[0];
        schedules = xlsx.utils.sheet_to_json(workbook.Sheets[firstSheet], { raw: false });
        schedules = schedules.reduce((acc, row) => {
          const weekKey = row.fecha_inicio_semana;
          const existing = acc.find((item) => item.fecha_inicio_semana === weekKey);
          const event = {
            dia: row.dia,
            titulo: row.titulo,
            hora: row.hora,
            descripcion: row.descripcion,
            tipo: row.tipo,
            mensaje: row.mensaje,
            media: row.media,
          };

          if (existing) {
            existing.eventos.push(event);
          } else {
            acc.push({
              fecha_inicio_semana: row.fecha_inicio_semana,
              fecha_fin_semana: row.fecha_fin_semana,
              etiqueta: row.etiqueta,
              eventos: [event],
            });
          }
          return acc;
        }, []);
      }
    } else if (Array.isArray(req.body)) {
      schedules = req.body;
    } else if (Array.isArray(req.body.schedules)) {
      schedules = req.body.schedules;
    }

    if (!Array.isArray(schedules) || schedules.length === 0) {
      return res.status(400).json({ message: 'No se encontró un cronograma válido.' });
    }

    const normalized = schedules.map(normalizeSchedule);
    const merged = [...db.schedules.filter((existing) => !normalized.some((item) => item.id === existing.id)), ...normalized]
      .sort((a, b) => a.fecha_inicio_semana.localeCompare(b.fecha_inicio_semana));

    writeDb({ ...db, schedules: merged });
    res.json({ message: 'Cronograma cargado correctamente.', schedules: merged });
  } catch (error) {
    res.status(500).json({ message: 'No fue posible procesar el cronograma.', error: error.message });
  }
});

app.put('/api/admin/schedules/:scheduleId/events/:eventId', (req, res) => {
  const db = readDb();
  const schedule = db.schedules.find((item) => item.id === req.params.scheduleId);
  if (!schedule) {
    return res.status(404).json({ message: 'Cronograma no encontrado.' });
  }

  const event = schedule.eventos.find((item) => item.id === req.params.eventId);
  if (!event) {
    return res.status(404).json({ message: 'Evento no encontrado.' });
  }

  Object.assign(event, req.body);
  writeDb(db);
  res.json({ message: 'Evento actualizado.', event });
});

app.post('/api/admin/invitations/upload', upload.single('media'), (req, res) => {
  const db = readDb();
  const { scheduleId, eventId, descripcion_completa, video_url } = req.body;
  const schedule = db.schedules.find((item) => item.id === scheduleId);
  const event = schedule?.eventos.find((item) => item.id === eventId);

  if (!schedule || !event) {
    return res.status(404).json({ message: 'No se encontró el evento seleccionado.' });
  }

  const mediaUrl = req.file ? `/uploads/${req.file.filename}` : event.media;
  event.media = mediaUrl || video_url || event.media;

  const invitation = {
    id: `inv-${eventId}`,
    id_evento: eventId,
    imagen_url: req.file && req.file.mimetype.startsWith('image/') ? mediaUrl : '',
    video_url: video_url || (req.file && req.file.mimetype.startsWith('video/') ? mediaUrl : ''),
    descripcion_completa: descripcion_completa || '',
  };

  db.invitations = [...db.invitations.filter((item) => item.id_evento !== eventId), invitation];
  writeDb(db);
  res.json({ message: 'Invitación guardada.', invitation, event });
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor IPUC ejecutándose en http://localhost:${PORT}`);
});
