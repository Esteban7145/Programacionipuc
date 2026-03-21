import React, { useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Admin from './pages/Admin';
import { useEvents } from './hooks/useEvents';
import { getCurrentWeekRange, getMonthKey, groupMediaByEvent } from './services/eventService';

const App = () => {
  const [activePage, setActivePage] = useState('home');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const {
    events,
    schedules,
    media,
    loading,
    authLoading,
    error,
    user,
    login,
    logout,
    createEvent,
    uploadSchedule,
    deleteEvent,
    deleteSchedule,
    refreshData,
  } = useEvents();

  const mediaByEvent = useMemo(() => groupMediaByEvent(media), [media]);
  const weekRange = useMemo(() => getCurrentWeekRange(), []);
  const currentMonthKey = useMemo(() => getMonthKey(new Date()), []);

  const currentWeekEvents = useMemo(
    () => events.filter((event) => event.dateValue >= weekRange.start && event.dateValue <= weekRange.end),
    [events, weekRange]
  );

  const currentSchedule = useMemo(
    () => schedules.find((schedule) => schedule.monthKey === currentMonthKey) || schedules[0] || null,
    [schedules, currentMonthKey]
  );

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setActivePage('gallery');
  };

  return (
    <div className="app-shell">
      <Navbar activePage={activePage} onNavigate={setActivePage} user={user} onLogout={logout} />
      <main className="main-content">
        {activePage === 'home' && (
          <Home
            events={events}
            currentWeekEvents={currentWeekEvents}
            weekRange={weekRange}
            currentSchedule={currentSchedule}
            mediaByEvent={mediaByEvent}
            selectedEvent={selectedEvent}
            onOpenGallery={handleEventSelect}
            loading={loading}
            error={error}
          />
        )}
        {activePage === 'gallery' && (
          <Gallery
            events={events}
            mediaByEvent={mediaByEvent}
            loading={loading}
            selectedEvent={selectedEvent}
            onSelectEvent={setSelectedEvent}
          />
        )}
        {activePage === 'admin' && (
          <Admin
            user={user}
            authLoading={authLoading}
            loading={loading}
            events={events}
            schedules={schedules}
            onLogin={login}
            onLogout={logout}
            onCreateEvent={createEvent}
            onUploadSchedule={uploadSchedule}
            onRefresh={refreshData}
            onDeleteEvent={deleteEvent}
            onDeleteSchedule={deleteSchedule}
          />
        )}
      </main>
    </div>
  );
};

export default App;
