import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import xlsx from 'xlsx';
import { endOfDay, endOfWeek, format, isWithinInterval, parseISO, startOfDay, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { readDb, writeDb } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const app = express();
const PORT = process.env.PORT || 3001;
const uploadsDir = path.join(__dirname, 'uploads');
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
      hora: getDefaultHourByDay(event.dia) || event.hora,
      descripcion: event.descripcion,
      tipo: event.tipo || 'culto',
      mensaje: event.mensaje || `Te esperamos este ${event.dia?.toLowerCase?.() || 'día'} en IPUC Villa del Río.`,
      media: event.media || '',
    })),
  };
};

const normalizeDay = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const getDefaultHourByDay = (day) => {
  const normalized = normalizeDay(day);
  if (['martes', 'jueves', 'sabado'].includes(normalized)) return '7:00 PM';
  if (normalized === 'domingo') return '10:00 AM';
  return '';
};

const resolvePublicUrl = (req, value) => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value) || value.startsWith('data:')) return value;

  const clean = String(value).replace(/\\/g, '/').trim();
  const maybeFile = path.basename(clean);
  const normalizedPath = clean.startsWith('/') ? clean : `/uploads/${maybeFile}`;
  return `${req.protocol}://${req.get('host')}${normalizedPath}`;
};

const getVerseByEvent = (event) => {
  const byType = {
    'escuela-dominical': 'Instruye al niño en su camino. — Proverbios 22:6',
    culto: 'Donde están dos o tres congregados en mi nombre, allí estoy yo. — Mateo 18:20',
    oracion: 'Perseverad en la oración. — Colosenses 4:2',
    jovenes: 'Ninguno tenga en poco tu juventud. — 1 Timoteo 4:12',
  };
  const normalizedType = normalizeDay(event.tipo);
  return byType[normalizedType] || 'Este es el día que hizo Jehová; nos gozaremos en él. — Salmo 118:24';
};

const escapeXml = (value) =>
  String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const buildAutoInvitationImage = (event, schedule) => {
  const dateLabel = event.fecha ? format(parseISO(event.fecha), "d 'de' MMMM", { locale: es }) : '';
  const verse = getVerseByEvent(event);
  const title = escapeXml(event.titulo || 'Culto especial');
  const subtitle = escapeXml(`${event.dia || ''} ${dateLabel}`.trim());
  const hour = escapeXml(event.hora || '');
  const safeVerse = escapeXml(verse);
  const weekLabel = escapeXml(schedule.etiqueta || schedule.fecha_inicio_semana);
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
      <text x="80" y="230" fill="#ffffff" font-family="Arial, sans-serif" font-size="74" font-weight="700">${title}</text>
      <text x="80" y="300" fill="#e2e8f0" font-family="Arial, sans-serif" font-size="40">${subtitle}</text>
      <text x="80" y="360" fill="#ffffff" font-family="Arial, sans-serif" font-size="52" font-weight="700">${hour}</text>
      <rect x="80" y="430" width="1120" height="180" rx="28" fill="rgba(2,6,23,0.45)" />
      <text x="110" y="505" fill="#dbeafe" font-family="Arial, sans-serif" font-size="34" font-style="italic">${safeVerse}</text>
      <text x="110" y="565" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="28">Semana: ${weekLabel}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const getCurrentWeekSchedule = (db) => {
  const today = new Date();
  const current = db.schedules.find((schedule) =>
    isWithinInterval(today, {
      start: startOfDay(parseISO(schedule.fecha_inicio_semana)),
      end: endOfDay(parseISO(schedule.fecha_fin_semana)),
    }),
  );

  if (current) return current;

  const sorted = [...db.schedules].sort((a, b) => a.fecha_inicio_semana.localeCompare(b.fecha_inicio_semana));
  const previous = sorted.filter((item) => parseISO(item.fecha_inicio_semana) <= today).pop();
  return previous || sorted[0] || null;
};

const enforceDefaultHours = (events = []) =>
  events.map((event) => {
    const defaultHour = getDefaultHourByDay(event.dia);
    if (!defaultHour) return event;
    return {
      ...event,
      hora: defaultHour,
    };
  });

const ensureDefaultWeeklyServices = (schedule) => {
  if (!schedule) return schedule;
  const eventsWithHours = enforceDefaultHours(schedule.eventos || []);
  const hasThursday = eventsWithHours.some((event) => normalizeDay(event.dia) === 'jueves');
  const hasSunday = eventsWithHours.some((event) => normalizeDay(event.dia) === 'domingo');
  const start = parseISO(schedule.fecha_inicio_semana);
  const thursday = new Date(start);
  thursday.setDate(start.getDate() + 3);
  const sunday = new Date(start);
  sunday.setDate(start.getDate() + 6);

  const additions = [];
  if (!hasThursday) {
    additions.push({
      id: `default-${schedule.id}-jueves`,
      fecha: format(thursday, 'yyyy-MM-dd'),
      dia: 'Jueves',
      titulo: 'Culto de Oración y Enseñanza',
      hora: '7:00 PM',
      descripcion: 'Servicio base de oración y enseñanza para toda la congregación.',
      tipo: 'culto',
      mensaje: 'Te esperamos este jueves para un tiempo especial de oración y enseñanza bíblica.',
      media: '',
    });
  }

  if (!hasSunday) {
    additions.push({
      id: `default-${schedule.id}-domingo`,
      fecha: format(sunday, 'yyyy-MM-dd'),
      dia: 'Domingo',
      titulo: 'Escuela Dominical',
      hora: '10:00 AM',
      descripcion: 'Espacio dominical de formación bíblica para toda la iglesia.',
      tipo: 'escuela-dominical',
      mensaje: 'Acompáñanos este domingo en nuestra Escuela Dominical.',
      media: '',
    });
  }

  return {
    ...schedule,
    eventos: [...eventsWithHours, ...additions].sort((a, b) => (a.fecha || '').localeCompare(b.fecha || '')),
  };
};

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const db = readDb();
  const user = db.users.find(
    (item) => item.username.toUpperCase() === String(username || '').toUpperCase() && item.password === password,
  );
  if (!user) {
    return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos.' });
  }
  res.json({
    success: true,
    role: user.role,
    user: { id: user.id, username: user.username, role: user.role },
  });
});

app.get('/api/public/schedule/current', (req, res) => {
  const db = readDb();
  const current = ensureDefaultWeeklyServices(getCurrentWeekSchedule(db));

  if (!current) {
    return res.status(404).json({ message: 'No hay cronogramas cargados.' });
  }

  const invitationsByEvent = Object.fromEntries(db.invitations.map((inv) => [inv.id_evento, inv]));
  const enriched = {
    ...current,
    eventos: current.eventos.map((event) => ({
      ...event,
      media: resolvePublicUrl(req, event.media),
      invitacion: (() => {
        const invitation = invitationsByEvent[event.id] || null;
        const resolvedInvitation = invitation
          ? {
              ...invitation,
              imagen_url: resolvePublicUrl(req, invitation.imagen_url),
              video_url: resolvePublicUrl(req, invitation.video_url),
            }
          : null;

        const hasVisualMedia = Boolean(
          resolvedInvitation?.imagen_url || resolvedInvitation?.video_url || resolvePublicUrl(req, event.media),
        );

        if (hasVisualMedia) return resolvedInvitation;
        return {
          ...(resolvedInvitation || {}),
          id: resolvedInvitation?.id || `auto-${event.id}`,
          id_evento: event.id,
          imagen_url: buildAutoInvitationImage(event, current),
          video_url: resolvedInvitation?.video_url || '',
          descripcion_completa:
            resolvedInvitation?.descripcion_completa ||
            `${event.titulo} | ${event.dia} ${event.fecha || ''} | ${event.hora || ''}`.trim(),
        };
      })(),
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
  res.json({
    schedules: db.schedules,
    invitations: db.invitations,
    users: db.users.map(({ password: _password, ...user }) => user),
  });
});

app.post('/api/admin/users', (req, res) => {
  const db = readDb();
  const { adminUsername, adminPassword, username, password } = req.body;
  const principalUser = db.users.find(
    (item) =>
      item.role === 'principal' &&
      item.username.toUpperCase() === String(adminUsername || '').toUpperCase() &&
      item.password === adminPassword,
  );

  if (!principalUser) {
    return res.status(403).json({ message: 'Solo el administrador principal puede crear usuarios.' });
  }

  if (!username || !password) {
    return res.status(400).json({ message: 'Debes indicar usuario y contraseña para el nuevo editor.' });
  }

  if (db.users.some((item) => item.username.toUpperCase() === String(username).toUpperCase())) {
    return res.status(409).json({ message: 'Ese usuario ya existe.' });
  }

  const newUser = {
    id: `editor-${Date.now()}`,
    username: String(username).trim(),
    password: String(password),
    role: 'editor',
    created_at: new Date().toISOString(),
  };

  db.users.push(newUser);
  writeDb(db);
  res.json({
    message: 'Usuario editor creado correctamente.',
    user: { id: newUser.id, username: newUser.username, role: newUser.role, created_at: newUser.created_at },
  });
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
    const uploadedWeekStarts = new Set(normalized.map((item) => item.fecha_inicio_semana));
    const merged = [...db.schedules.filter((existing) => !uploadedWeekStarts.has(existing.fecha_inicio_semana)), ...normalized]
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

app.get('/admin', (_req, res) => {
  res.sendFile(path.join(rootDir, 'admin.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor IPUC ejecutándose en http://localhost:${PORT}`);
});
