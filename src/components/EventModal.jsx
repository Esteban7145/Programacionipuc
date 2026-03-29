import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';

export default function EventModal({ event, onClose }) {
  return (
    <AnimatePresence>
      {event ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: 12 }}
            className="glass relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-[2rem] p-6 shadow-glow"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:bg-white/10"
            >
              <X size={18} />
            </button>

            <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
              <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/70">
                {event.invitacion?.video_url ? (
                  event.invitacion.video_url.includes('youtube.com') || event.invitacion.video_url.includes('youtu.be') ? (
                    <iframe
                      title={event.titulo}
                      src={event.invitacion.video_url.replace('watch?v=', 'embed/')}
                      className="aspect-video h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video src={event.invitacion.video_url} controls className="aspect-video h-full w-full object-cover" />
                  )
                ) : event.invitacion?.imagen_url || event.media ? (
                  <img
                    src={event.invitacion?.imagen_url || event.media}
                    alt={event.titulo}
                    className="aspect-video h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-video items-center justify-center p-8 text-center text-slate-400">
                    Próximamente podrás adjuntar una invitación visual para este servicio.
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <span className="inline-flex rounded-full bg-church-500/15 px-3 py-1 text-xs uppercase tracking-[0.3em] text-church-100">
                  Esta semana
                </span>
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-church-300">{event.dia}</p>
                  <h2 className="mt-2 text-3xl font-semibold text-white">{event.titulo}</h2>
                </div>
                <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">{event.hora}</p>
                <p className="text-sm leading-7 text-slate-300">{event.descripcion}</p>
                <div className="rounded-[1.5rem] border border-church-300/20 bg-church-500/10 p-5">
                  <p className="text-sm font-semibold text-church-100">Invitación completa</p>
                  <p className="mt-2 text-sm leading-7 text-slate-200">
                    {event.invitacion?.descripcion_completa || event.mensaje}
                  </p>
                </div>
                {event.invitacion?.video_url ? (
                  <a
                    href={event.invitacion.video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl bg-church-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-church-400"
                  >
                    <ExternalLink size={18} />
                    Ver invitación completa
                  </a>
                ) : null}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
