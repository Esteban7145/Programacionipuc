import { motion } from 'framer-motion';
import { Clock3, ImageIcon, Sparkles, Video } from 'lucide-react';

export default function ScheduleCard({ event, isActive, onClick }) {
  const hasVideo = Boolean(event?.invitacion?.video_url);
  const hasImage = Boolean(event?.invitacion?.imagen_url || (!hasVideo && event?.media));

  return (
    <motion.button
      type="button"
      layout
      onClick={onClick}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`glass relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-5 text-left shadow-glow transition ${
        isActive ? 'border-church-300/60 bg-church-400/10' : 'border-white/10'
      }`}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-church-200">{event.dia}</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{event.titulo}</h3>
        </div>
        <div className="rounded-2xl bg-church-500/15 p-3 text-church-200">
          <Sparkles size={20} />
        </div>
      </div>

      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-sm text-slate-200">
        <Clock3 size={16} className="text-church-300" />
        {event.hora}
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-300">{event.descripcion}</p>

      <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-400">
        {hasImage ? <ImageIcon size={14} /> : <Video size={14} />}
        {hasVideo ? 'Vista previa en video' : hasImage ? 'Vista previa en imagen' : 'Invitación disponible'}
      </div>

      {isActive && (
        <motion.div
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-2xl border border-church-300/20 bg-slate-950/70 p-4"
        >
          <p className="text-sm font-semibold text-church-100">Invitación</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">{event.mensaje}</p>
          <span className="mt-4 inline-flex rounded-full bg-church-500/15 px-3 py-1 text-xs font-medium text-church-100">
            Ver invitación completa abajo
          </span>
        </motion.div>
      )}
    </motion.button>
  );
}
