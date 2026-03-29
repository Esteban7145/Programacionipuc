import { useMemo, useState } from 'react';
import { LoaderCircle, LockKeyhole, Upload } from 'lucide-react';

const initialCredentials = { username: '', password: '' };
const initialEventForm = {
  titulo: '',
  hora: '',
  descripcion: '',
  mensaje: '',
};

export default function AdminPanel({
  isOpen,
  isAuthenticated,
  onLogin,
  dashboard,
  onScheduleUpload,
  onEventSave,
  onInvitationUpload,
  busy,
}) {
  const [credentials, setCredentials] = useState(initialCredentials);
  const [selectedScheduleId, setSelectedScheduleId] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [eventForm, setEventForm] = useState(initialEventForm);
  const [scheduleFile, setScheduleFile] = useState(null);
  const [invitationFile, setInvitationFile] = useState(null);
  const [invitationText, setInvitationText] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const selectedSchedule = useMemo(
    () => dashboard?.schedules?.find((schedule) => schedule.id === selectedScheduleId),
    [dashboard, selectedScheduleId],
  );

  const selectedEvent = useMemo(
    () => selectedSchedule?.eventos?.find((event) => event.id === selectedEventId),
    [selectedSchedule, selectedEventId],
  );

  const syncEventForm = (event) => {
    if (!event) return;
    setEventForm({
      titulo: event.titulo || '',
      hora: event.hora || '',
      descripcion: event.descripcion || '',
      mensaje: event.mensaje || '',
    });
  };

  if (!isOpen) return null;

  return (
    <section className="glass rounded-[2rem] p-6 shadow-glow">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="section-title">Panel administrativo DECOM</h2>
          <p className="mt-2 text-sm text-slate-300">
            Gestiona cronogramas anuales o mensuales, edita eventos y vincula invitaciones multimedia.
          </p>
        </div>
        <div className="rounded-2xl border border-church-300/20 bg-church-400/10 px-4 py-2 text-sm text-church-100">
          {isAuthenticated ? 'Sesión activa' : 'Acceso restringido'}
        </div>
      </div>

      {!isAuthenticated ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onLogin(credentials);
          }}
          className="grid gap-4 md:grid-cols-3"
        >
          <label className="space-y-2 text-sm text-slate-200">
            Usuario
            <input
              value={credentials.username}
              onChange={(event) => setCredentials((prev) => ({ ...prev, username: event.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none ring-0 transition focus:border-church-300"
              placeholder="IPUCVILLADELRIO"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-200">
            Clave
            <input
              type="password"
              value={credentials.password}
              onChange={(event) => setCredentials((prev) => ({ ...prev, password: event.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none ring-0 transition focus:border-church-300"
              placeholder="99061408327"
            />
          </label>
          <button
            type="submit"
            className="mt-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-church-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-church-400"
          >
            <LockKeyhole size={18} />
            Ingresar
          </button>
        </form>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-5">
              <h3 className="text-lg font-semibold text-white">1. Subir cronograma mensual o anual</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Acepta JSON con arreglo de semanas o Excel agrupado por <code>fecha_inicio_semana</code>.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="file"
                  accept=".json,.xlsx,.xls"
                  onChange={(event) => setScheduleFile(event.target.files?.[0] || null)}
                  className="block w-full rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-3 text-sm"
                />
                <button
                  type="button"
                  disabled={!scheduleFile || busy}
                  onClick={() => onScheduleUpload(scheduleFile)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-church-500 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {busy ? <LoaderCircle size={18} className="animate-spin" /> : <Upload size={18} />}
                  Subir archivo
                </button>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-5">
              <h3 className="text-lg font-semibold text-white">2. Editar eventos por semana</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <select
                  value={selectedScheduleId}
                  onChange={(event) => {
                    setSelectedScheduleId(event.target.value);
                    setSelectedEventId('');
                  }}
                  className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm"
                >
                  <option value="">Selecciona una semana</option>
                  {dashboard?.schedules?.map((schedule) => (
                    <option key={schedule.id} value={schedule.id}>
                      {schedule.etiqueta} · {schedule.fecha_inicio_semana}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedEventId}
                  onChange={(event) => {
                    setSelectedEventId(event.target.value);
                    syncEventForm(selectedSchedule?.eventos?.find((item) => item.id === event.target.value));
                  }}
                  className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm"
                  disabled={!selectedSchedule}
                >
                  <option value="">Selecciona un evento</option>
                  {selectedSchedule?.eventos?.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.dia} · {event.titulo}
                    </option>
                  ))}
                </select>
              </div>

              {selectedEvent ? (
                <div className="mt-4 grid gap-4">
                  <input
                    value={eventForm.titulo}
                    onChange={(event) => setEventForm((prev) => ({ ...prev, titulo: event.target.value }))}
                    className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm"
                    placeholder="Título"
                  />
                  <input
                    value={eventForm.hora}
                    onChange={(event) => setEventForm((prev) => ({ ...prev, hora: event.target.value }))}
                    className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm"
                    placeholder="Hora"
                  />
                  <textarea
                    value={eventForm.descripcion}
                    onChange={(event) => setEventForm((prev) => ({ ...prev, descripcion: event.target.value }))}
                    className="min-h-28 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm"
                    placeholder="Descripción corta"
                  />
                  <textarea
                    value={eventForm.mensaje}
                    onChange={(event) => setEventForm((prev) => ({ ...prev, mensaje: event.target.value }))}
                    className="min-h-28 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm"
                    placeholder="Mensaje de invitación"
                  />
                  <button
                    type="button"
                    onClick={() => onEventSave(selectedSchedule.id, selectedEvent.id, eventForm)}
                    className="inline-flex w-fit items-center justify-center rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                  >
                    Guardar cambios
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-5">
            <h3 className="text-lg font-semibold text-white">3. Subir invitaciones semanales</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Sube imagen, video MP4 o deja un enlace de YouTube para la vista expandida del culto.
            </p>
            <div className="mt-4 space-y-4">
              <input
                type="file"
                accept="image/*,video/mp4"
                onChange={(event) => setInvitationFile(event.target.files?.[0] || null)}
                className="block w-full rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-3 text-sm"
              />
              <textarea
                value={invitationText}
                onChange={(event) => setInvitationText(event.target.value)}
                className="min-h-28 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm"
                placeholder="Texto completo de la invitación"
              />
              <input
                value={videoUrl}
                onChange={(event) => setVideoUrl(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm"
                placeholder="Enlace de YouTube (opcional)"
              />
              <button
                type="button"
                disabled={!selectedSchedule || !selectedEvent || busy}
                onClick={() =>
                  onInvitationUpload({
                    scheduleId: selectedSchedule.id,
                    eventId: selectedEvent.id,
                    file: invitationFile,
                    descripcionCompleta: invitationText,
                    videoUrl,
                  })
                }
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-church-500 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {busy ? <LoaderCircle size={18} className="animate-spin" /> : <Upload size={18} />}
                Guardar invitación
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
