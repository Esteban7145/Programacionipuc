const jsonHeaders = { 'Content-Type': 'application/json' };

async function request(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Ha ocurrido un error inesperado.');
  }
  return response.json();
}

export const api = {
  getCurrentSchedule: () => request('/api/public/schedule/current'),
  login: (credentials) =>
    request('/api/auth/login', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(credentials),
    }),
  getDashboard: () => request('/api/admin/dashboard'),
  uploadSchedules: (formData) =>
    request('/api/admin/schedules/upload', {
      method: 'POST',
      body: formData,
    }),
  updateEvent: (scheduleId, eventId, payload) =>
    request(`/api/admin/schedules/${scheduleId}/events/${eventId}`, {
      method: 'PUT',
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    }),
  uploadInvitation: (formData) =>
    request('/api/admin/invitations/upload', {
      method: 'POST',
      body: formData,
    }),
};
