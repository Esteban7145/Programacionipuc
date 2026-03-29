import React from 'react';
import { FiCalendar, FiExternalLink, FiMapPin, FiPlayCircle } from 'react-icons/fi';
import { formatDisplayDate } from '../services/eventService';

const EventCard = ({ event, mediaCount = 0, onOpen }) => (
  <article className="event-card glass-card" onClick={() => onOpen?.(event)} role="button" tabIndex={0}>
    <div className="event-cover-wrapper">
      <img
        className="event-cover"
        src={event.coverImage || 'https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1200&q=80'}
        alt={event.title}
      />
      <div className="event-badge">{event.type}</div>
    </div>

    <div className="event-content">
      <div className="event-topline">
        <span><FiCalendar /> {formatDisplayDate(event.dateValue)}</span>
        <span><FiMapPin /> Villa del Río</span>
      </div>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <div className="event-footer">
        <span>{mediaCount} recursos multimedia</span>
        {event.invitationLink && (
          <a
            href={event.invitationLink}
            className="text-link"
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            {event.invitationType === 'video' ? <FiPlayCircle /> : <FiExternalLink />}
            Ver invitación
          </a>
        )}
      </div>
    </div>
  </article>
);

export default EventCard;
