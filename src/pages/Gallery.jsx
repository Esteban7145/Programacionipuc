import React, { useEffect, useMemo, useState } from 'react';
import { FiFilm, FiImage, FiPlay } from 'react-icons/fi';
import EventCard from '../components/EventCard';
import { formatDisplayDate } from '../services/eventService';

const Gallery = ({ events, mediaByEvent, loading, selectedEvent, onSelectEvent }) => {
  const [detailEvent, setDetailEvent] = useState(selectedEvent || null);

  useEffect(() => {
    setDetailEvent(selectedEvent || null);
  }, [selectedEvent]);

  const detailMedia = useMemo(() => {
    if (!detailEvent) return [];
    return mediaByEvent[detailEvent.id] || [];
  }, [detailEvent, mediaByEvent]);

  return (
    <div className="page-stack">
      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Galería estilo social</p>
            <h2>Momentos, cultos y experiencias del ministerio</h2>
          </div>
        </div>

        {loading ? (
          <div className="state-card">Sincronizando galería multimedia...</div>
        ) : (
          <div className="gallery-grid">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onOpen={(selected) => {
                  setDetailEvent(selected);
                  onSelectEvent(selected);
                }}
                mediaCount={mediaByEvent[event.id]?.length || 0}
              />
            ))}
          </div>
        )}
      </section>

      {detailEvent && (
        <section className="detail-panel glass-card">
          <div className="detail-header">
            <div>
              <p className="eyebrow">Detalle del evento</p>
              <h3>{detailEvent.title}</h3>
              <p>{formatDisplayDate(detailEvent.dateValue)}</p>
            </div>
            <button type="button" className="ghost-btn" onClick={() => setDetailEvent(null)}>
              Cerrar vista
            </button>
          </div>

          <div className="detail-cover">
            <img src={detailEvent.coverImage} alt={detailEvent.title} />
          </div>

          <div className="detail-description">
            <p>{detailEvent.description}</p>
          </div>

          <div className="media-grid">
            {detailMedia.length ? (
              detailMedia.map((item) => (
                <article key={item.id} className="media-card">
                  {item.type === 'video' ? (
                    <video src={item.url} controls className="media-asset" />
                  ) : (
                    <img src={item.url} alt={detailEvent.title} className="media-asset" />
                  )}
                  <div className="media-meta">
                    {item.type === 'video' ? <FiFilm /> : <FiImage />}
                    <span>{item.type === 'video' ? 'Video del evento' : 'Fotografía del evento'}</span>
                  </div>
                </article>
              ))
            ) : (
              <div className="state-card">Este evento aún no tiene contenido adicional cargado.</div>
            )}
          </div>

          {detailEvent.invitationLink && (
            <a href={detailEvent.invitationLink} target="_blank" rel="noreferrer" className="primary-btn">
              <FiPlay /> Ver invitación interactiva
            </a>
          )}
        </section>
      )}
    </div>
  );
};

export default Gallery;
