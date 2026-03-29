import React from 'react';
import EventCard from '../components/EventCard';
import Stories from '../components/Stories';
import { formatRangeLabel } from '../services/eventService';

const Home = ({
  events,
  currentWeekEvents,
  weekRange,
  currentSchedule,
  currentMonthEvents,
  mediaByEvent,
  onOpenGallery,
  loading,
  error,
}) => {
  const hasScheduleFile = Boolean(currentSchedule?.fileUrl && /^https?:\/\//.test(currentSchedule.fileUrl));

  const handleMonthProgramClick = () => {
    if (hasScheduleFile) return;
    const section = document.getElementById('programacion-mensual');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="page-stack">
      <section className="hero-panel glass-card">
        <div>
          <p className="eyebrow">Plataforma ministerial</p>
          <h2>Organiza, comunica y comparte cada actividad del ministerio.</h2>
          <p className="hero-copy">
            Una experiencia centralizada para cronogramas inteligentes, historias, galería audiovisual e
            invitaciones interactivas con estructura empresarial escalable.
          </p>
          <div className="hero-metrics">
            <div>
              <strong>{events.length}</strong>
              <span>Eventos sincronizados</span>
            </div>
            <div>
              <strong>{currentWeekEvents.length}</strong>
              <span>Esta semana</span>
            </div>
            <div>
              <strong>{Object.keys(mediaByEvent).length}</strong>
              <span>Álbumes activos</span>
            </div>
          </div>
        </div>
        <div className="hero-highlight">
          <p className="eyebrow">Cronograma inteligente</p>
          <h3>Semana actual</h3>
          <p>{formatRangeLabel(weekRange.start, weekRange.end)}</p>
          {currentSchedule ? (
            hasScheduleFile ? (
              <a href={currentSchedule.fileUrl} target="_blank" rel="noreferrer" className="primary-btn">
                Ver cronograma de {currentSchedule.monthLabel}
              </a>
            ) : (
              <button type="button" className="primary-btn" onClick={handleMonthProgramClick}>
                Ver programación de {currentSchedule.monthLabel}
              </button>
            )
          ) : (
            <div className="empty-inline">No hay cronograma cargado para el mes actual.</div>
          )}
        </div>
      </section>

      <Stories events={events.slice(0, 6)} onOpen={onOpenGallery} />

      <section id="programacion-mensual" className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Cronograma mensual</p>
            <h2>Programación del mes actual</h2>
          </div>
        </div>
        <div className="timeline-list">
          {currentMonthEvents.length ? (
            currentMonthEvents.map((event) => (
              <article key={event.id} className="timeline-item">
                <strong>{event.type}</strong>
                <span>
                  {new Intl.DateTimeFormat('es-CO', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  }).format(event.dateValue)}
                </span>
                <p>{event.description}</p>
              </article>
            ))
          ) : (
            <div className="state-card">No hay programación mensual disponible.</div>
          )}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Esta semana</p>
            <h2>Agenda automática basada en la fecha actual</h2>
          </div>
        </div>

        {loading && <div className="state-card">Cargando eventos y cronogramas...</div>}
        {error && <div className="state-card error">{error}</div>}
        {!loading && !currentWeekEvents.length && (
          <div className="state-card">No hay eventos programados para esta semana todavía.</div>
        )}

        <div className="cards-grid">
          {currentWeekEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onOpen={onOpenGallery}
              mediaCount={mediaByEvent[event.id]?.length || 0}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
