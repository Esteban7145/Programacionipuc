import React from 'react';
import { formatShortDate } from '../services/eventService';

const Stories = ({ events, onOpen }) => (
  <section className="stories-section glass-card">
    <div className="section-heading compact">
      <div>
        <p className="eyebrow">Historias recientes</p>
        <h2>Eventos destacados</h2>
      </div>
    </div>
    <div className="stories-track">
      {events.map((event) => (
        <button key={event.id} type="button" className="story-card" onClick={() => onOpen(event)}>
          <div className="story-ring">
            <img src={event.coverImage} alt={event.title} />
          </div>
          <strong>{event.title}</strong>
          <span>{formatShortDate(event.dateValue)}</span>
        </button>
      ))}
    </div>
  </section>
);

export default Stories;
