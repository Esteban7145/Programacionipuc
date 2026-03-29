import { useCallback, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import {
  createEventRecord,
  createScheduleRecord,
  deleteEventRecord,
  deleteScheduleRecord,
  demoEvents,
  demoMedia,
  demoSchedules,
  fetchEvents,
  fetchMedia,
  fetchSchedules,
} from '../services/eventService';

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [media, setMedia] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState('');

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [eventData, mediaData, scheduleData] = await Promise.all([
        fetchEvents(),
        fetchMedia(),
        fetchSchedules(),
      ]);
      setEvents(eventData.length ? eventData : demoEvents);
      setMedia(mediaData.length ? mediaData : demoMedia);
      setSchedules((scheduleData.length ? scheduleData : demoSchedules).slice().reverse());
    } catch (requestError) {
      setEvents(demoEvents);
      setMedia(demoMedia);
      setSchedules(demoSchedules);
      setError(
        'No se pudieron cargar los datos de Firebase. Se muestran datos demo mientras verificas src/services/firebase.js y los permisos de Firestore/Storage.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authenticatedUser) => {
      setUser(authenticatedUser);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  const createEvent = async (payload) => {
    await createEventRecord(payload);
    await refreshData();
  };

  const uploadSchedule = async (payload) => {
    await createScheduleRecord(payload);
    await refreshData();
  };

  const deleteEvent = async (eventId) => {
    await deleteEventRecord(eventId);
    await refreshData();
  };

  const deleteSchedule = async (scheduleId) => {
    await deleteScheduleRecord(scheduleId);
    await refreshData();
  };

  return {
    events,
    media,
    schedules,
    user,
    loading,
    authLoading,
    error,
    login,
    logout,
    createEvent,
    uploadSchedule,
    deleteEvent,
    deleteSchedule,
    refreshData,
  };
};
