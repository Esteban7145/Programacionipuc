import React, { useMemo, useState } from 'react';
import { FiKey, FiPlus, FiRefreshCw, FiUploadCloud } from 'react-icons/fi';
import UploadModal from '../components/UploadModal';
import { formatDisplayDate } from '../services/eventService';

const initialEventForm = {
  title: '',
  date: '',
  type: 'Culto general',
  description: '',
  invitationLink: '',
  invitationType: 'link',
  coverImage: null,
  galleryFiles: [],
  videoFile: null,
};

const initialScheduleForm = {
  monthKey: '',
  monthLabel: '',
  file: null,
};

const Admin = ({
  user,
  authLoading,
  loading,
  events,
  schedules,
  onLogin,
  onLogout,
  onCreateEvent,
  onUploadSchedule,
  onRefresh,
  onDeleteEvent,
  onDeleteSchedule,
}) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [eventForm, setEventForm] = useState(initialEventForm);
  const [scheduleForm, setScheduleForm] = useState(initialScheduleForm);
  const [isEventModalOpen, setEventModalOpen] = useState(false);
  const [isScheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [feedback, setFeedback] = useState('');

  const recentEvents = useMemo(() => events.slice(0, 5), [events]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setFeedback('');
    try {
      await onLogin(credentials.email, credentials.password);
      setCredentials({ email: '', password: '' });
    } catch (error) {
      setFeedback(error.message);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setFeedback('');
    try {
      await onCreateEvent(eventForm);
      setEventForm(initialEventForm);
      setEventModalOpen(false);
      setFeedback('Evento creado correctamente.');
    } catch (error) {
      setFeedback(error.message);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setFeedback('');
    try {
      await onUploadSchedule(scheduleForm);
      setScheduleForm(initialScheduleForm);
      setScheduleModalOpen(false);
      setFeedback('Cronograma cargado correctamente.');
    } catch (error) {
      setFeedback(error.message);
    }
  };

  return (
    <div className="page-stack">
      <section className="admin-grid">
        <article className="glass-card auth-card">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">Acceso seguro</p>
              <h2>Panel administrativo</h2>
            </div>
          </div>

          {authLoading ? (
            <div className="state-card">Verificando sesión...</div>
          ) : user ? (
            <div className="admin-user-block">
              <strong>{user.email}</strong>
              <p>Gestiona eventos, cronogramas y contenido multimedia desde un flujo centralizado.</p>
              <div className="button-row">
                <button type="button" className="primary-btn" onClick={() => setEventModalOpen(true)}>
                  <FiPlus /> Nuevo evento
                </button>
                <button type="button" className="outline-btn" onClick={() => setScheduleModalOpen(true)}>
                  <FiUploadCloud /> Subir cronograma
                </button>
                <button type="button" className="ghost-btn" onClick={onRefresh}>
                  <FiRefreshCw /> Actualizar
                </button>
                <button type="button" className="ghost-btn" onClick={onLogout}>
                  Cerrar sesión
                </button>
              </div>
            </div>
          ) : (
            <form className="form-grid" onSubmit={handleLogin}>
              <label>
                Email
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@decom.com"
                  required
                />
              </label>
              <label>
                Contraseña
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                />
              </label>
              <button type="submit" className="primary-btn">
                <FiKey /> Ingresar
              </button>
            </form>
          )}

          {feedback && <div className="state-card">{feedback}</div>}
        </article>

        <article className="glass-card admin-side-panel">
          <p className="eyebrow">Resumen operativo</p>
          <h3>Últimos eventos registrados</h3>
          <div className="mini-list">
            {recentEvents.map((event) => (
              <div key={event.id} className="mini-item stacked">
                <div>
                  <strong>{event.title}</strong>
                  <span>{formatDisplayDate(event.dateValue)}</span>
                </div>
                {user && !event.id.startsWith('demo-') && (
                  <button type="button" className="ghost-btn danger-btn" onClick={() => onDeleteEvent(event.id)}>
                    Eliminar
                  </button>
                )}
              </div>
            ))}
            {!recentEvents.length && <div className="state-card">Aún no hay eventos creados.</div>}
          </div>

          <h3>Cronogramas activos</h3>
          <div className="mini-list">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="mini-item stacked">
                <div>
                  <strong>{schedule.monthLabel}</strong>
                  <a href={schedule.fileUrl} target="_blank" rel="noreferrer">
                    Abrir archivo
                  </a>
                </div>
                {user && !schedule.id.startsWith('schedule-demo-') && (
                  <button type="button" className="ghost-btn danger-btn" onClick={() => onDeleteSchedule(schedule.id)}>
                    Eliminar
                  </button>
                )}
              </div>
            ))}
            {!schedules.length && <div className="state-card">No hay cronogramas cargados.</div>}
          </div>
        </article>
      </section>

      <UploadModal
        isOpen={isEventModalOpen}
        title="Crear nuevo evento"
        subtitle="Registra toda la información del culto, actividad o campaña."
        loading={loading}
        onClose={() => setEventModalOpen(false)}
      >
        <form className="form-grid" onSubmit={handleEventSubmit}>
          <label>
            Título
            <input value={eventForm.title} onChange={(e) => setEventForm((prev) => ({ ...prev, title: e.target.value }))} required />
          </label>
          <label>
            Fecha
            <input type="datetime-local" value={eventForm.date} onChange={(e) => setEventForm((prev) => ({ ...prev, date: e.target.value }))} required />
          </label>
          <label>
            Tipo
            <input value={eventForm.type} onChange={(e) => setEventForm((prev) => ({ ...prev, type: e.target.value }))} required />
          </label>
          <label>
            Tipo de invitación
            <select value={eventForm.invitationType} onChange={(e) => setEventForm((prev) => ({ ...prev, invitationType: e.target.value }))}>
              <option value="link">Link externo</option>
              <option value="image">Imagen</option>
              <option value="video">Video</option>
            </select>
          </label>
          <label className="full-width">
            Descripción
            <textarea value={eventForm.description} onChange={(e) => setEventForm((prev) => ({ ...prev, description: e.target.value }))} rows="4" required />
          </label>
          <label>
            Link de invitación
            <input value={eventForm.invitationLink} onChange={(e) => setEventForm((prev) => ({ ...prev, invitationLink: e.target.value }))} placeholder="https://..." />
          </label>
          <label>
            Imagen portada
            <input type="file" accept="image/*" onChange={(e) => setEventForm((prev) => ({ ...prev, coverImage: e.target.files?.[0] || null }))} required />
          </label>
          <label>
            Fotos adicionales
            <input type="file" accept="image/*" multiple onChange={(e) => setEventForm((prev) => ({ ...prev, galleryFiles: Array.from(e.target.files || []) }))} />
          </label>
          <label>
            Video opcional
            <input type="file" accept="video/*" onChange={(e) => setEventForm((prev) => ({ ...prev, videoFile: e.target.files?.[0] || null }))} />
          </label>
          <button type="submit" className="primary-btn full-width">Guardar evento</button>
        </form>
      </UploadModal>

      <UploadModal
        isOpen={isScheduleModalOpen}
        title="Cargar cronograma mensual"
        subtitle="Sube un PDF o imagen asociado al mes para mostrarlo automáticamente."
        loading={loading}
        onClose={() => setScheduleModalOpen(false)}
      >
        <form className="form-grid" onSubmit={handleScheduleSubmit}>
          <label>
            Clave del mes
            <input
              type="month"
              value={scheduleForm.monthKey}
              onChange={(e) => setScheduleForm((prev) => ({ ...prev, monthKey: e.target.value, monthLabel: e.target.value }))}
              required
            />
          </label>
          <label>
            Nombre visible
            <input
              value={scheduleForm.monthLabel}
              onChange={(e) => setScheduleForm((prev) => ({ ...prev, monthLabel: e.target.value }))}
              placeholder="Marzo 2026"
              required
            />
          </label>
          <label className="full-width">
            Archivo PDF o imagen
            <input type="file" accept="image/*,.pdf" onChange={(e) => setScheduleForm((prev) => ({ ...prev, file: e.target.files?.[0] || null }))} required />
          </label>
          <button type="submit" className="primary-btn full-width">Guardar cronograma</button>
        </form>
      </UploadModal>
    </div>
  );
};

export default Admin;
