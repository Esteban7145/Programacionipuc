import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarRange, LoaderCircle, Sparkles } from 'lucide-react';
import AdminPanel from './components/AdminPanel';
import EventModal from './components/EventModal';
import Header from './components/Header';
import ScheduleCard from './components/ScheduleCard';
import { api } from './lib/api';

export default function App() {
  const scheduleRef = useRef(null);
  const [data, setData] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [activeEventId, setActiveEventId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState('');

  const loadPublicData = async () => {
    setLoading(true);
    try {
      const current = await api.getCurrentSchedule();
      setData(current);
      setActiveEventId(current.currentWeek?.eventos?.[0]?.id || null);
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDashboard = async () => {
    const response = await api.getDashboard();
    setDashboard(response);
  };

  useEffect(() => {
    loadPublicData();
  }, []);

  const currentWeek = data?.currentWeek;
  const activeEvent = useMemo(
    () => currentWeek?.eventos?.find((event) => event.id === activeEventId) || null,
    [activeEventId, currentWeek],
  );

  useEffect(() => {
    setSelectedEvent(activeEvent);
  }, [activeEvent]);

  const handleDownload = async () => {
    if (!scheduleRef.current) return;
    const canvas = await html2canvas(scheduleRef.current, {
      backgroundColor: '#020617',
      scale: 2,
    });
    const link = document.createElement('a');
    link.download = `cronograma-ipuc-${currentWeek?.fecha_inicio_semana || 'semana'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const currentDateLabel = format(new Date(), "EEEE d 'de' MMMM yyyy", { locale: es });

  const handleLogin = async (credentials) => {
    setBusy(true);
    setFeedback('');
    try {
      const response = await api.login(credentials);
      if (!response.success) {
        throw new Error('Credenciales incorrectas.');
      }
      setIsAuthenticated(true);
      await loadDashboard();
      setFeedback('Acceso administrativo concedido.');
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setBusy(false);
    }
  };

  const handleScheduleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    setBusy(true);
    setFeedback('');
    try {
      await api.uploadSchedules(formData);
      await Promise.all([loadPublicData(), loadDashboard()]);
      setFeedback('Cronograma cargado correctamente.');
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setBusy(false);
    }
  };

  const handleEventSave = async (scheduleId, eventId, payload) => {
    setBusy(true);
    setFeedback('');
    try {
      await api.updateEvent(scheduleId, eventId, payload);
      await Promise.all([loadPublicData(), loadDashboard()]);
      setFeedback('Evento actualizado correctamente.');
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setBusy(false);
    }
  };

  const handleInvitationUpload = async ({ scheduleId, eventId, file, descripcionCompleta, videoUrl }) => {
    const formData = new FormData();
    formData.append('scheduleId', scheduleId);
    formData.append('eventId', eventId);
    formData.append('descripcion_completa', descripcionCompleta);
    formData.append('video_url', videoUrl);
    if (file) formData.append('media', file);

    setBusy(true);
    setFeedback('');
    try {
      await api.uploadInvitation(formData);
      await Promise.all([loadPublicData(), loadDashboard()]);
      setFeedback('Invitación guardada correctamente.');
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-6 lg:px-8">
      <Header
        currentDateLabel={currentDateLabel}
        onDownload={handleDownload}
        onAdminToggle={async () => {
          const next = !isAdminOpen;
          setIsAdminOpen(next);
          if (next && isAuthenticated && !dashboard) {
            await loadDashboard();
          }
        }}
        isAdminOpen={isAdminOpen}
      />

      {feedback ? (
        <div className="rounded-2xl border border-church-300/20 bg-church-400/10 px-4 py-3 text-sm text-church-100">{feedback}</div>
      ) : null}

      <AdminPanel
        isOpen={isAdminOpen}
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        dashboard={dashboard}
        onScheduleUpload={handleScheduleUpload}
        onEventSave={handleEventSave}
        onInvitationUpload={handleInvitationUpload}
        busy={busy}
      />

      <main ref={scheduleRef} className="space-y-8 rounded-[2rem] border border-white/10 bg-slate-900/60 p-6 shadow-glow">
        <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-church-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.35em] text-church-100">
              <Sparkles size={14} />
              Esta semana
            </div>
            <h2 className="mt-4 section-title">Programación visible automáticamente según la fecha actual</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              El sistema detecta la semana vigente y presenta únicamente sus servicios, listo para compartir por WhatsApp o proyectar en la iglesia.
            </p>
          </div>
          {currentWeek ? (
            <div className="glass rounded-[1.5rem] px-4 py-3 text-sm text-slate-200">
              <div className="flex items-center gap-2">
                <CalendarRange size={16} className="text-church-300" />
                {format(parseISO(currentWeek.fecha_inicio_semana), 'd MMM', { locale: es })} -{' '}
                {format(parseISO(currentWeek.fecha_fin_semana), 'd MMM yyyy', { locale: es })}
              </div>
            </div>
          ) : null}
        </section>

        {loading ? (
          <div className="flex min-h-72 items-center justify-center">
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200">
              <LoaderCircle size={18} className="animate-spin text-church-300" />
              Cargando cronograma actual...
            </div>
          </div>
        ) : (
          <>
            <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
              <AnimatePresence>
                {currentWeek?.eventos?.map((event) => (
                  <motion.div key={event.id} layout>
                    <ScheduleCard
                      event={event}
                      isActive={activeEventId === event.id}
                      onClick={() => setActiveEventId(event.id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </section>

            {activeEvent ? (
              <section className="grid gap-6 rounded-[2rem] border border-church-300/15 bg-gradient-to-br from-church-500/10 to-slate-950/50 p-6 lg:grid-cols-[1fr,auto] lg:items-center">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-church-200">Invitación destacada</p>
                  <h3 className="mt-3 text-3xl font-semibold text-white">{activeEvent.titulo}</h3>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                    {activeEvent.invitacion?.descripcion_completa || activeEvent.mensaje}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedEvent(activeEvent)}
                  className="inline-flex h-fit items-center justify-center rounded-2xl bg-church-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-church-400"
                >
                  Ver invitación completa
                </button>
              </section>
            ) : null}
          </>
        )}
      </main>

      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
