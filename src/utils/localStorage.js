// Fungsi untuk menyimpan dan mengambil data dari localStorage
export const StorageKeys = {
  EVENTS: 'split_bill_events',
  CURRENT_EVENT: 'current_event_id'
};

// Mengambil semua event dari localStorage
export const getEvents = () => {
  if (typeof window === 'undefined') return [];
  try {
    const events = localStorage.getItem(StorageKeys.EVENTS);
    return events ? JSON.parse(events) : [];
  } catch (error) {
    console.error('Error getting events:', error);
    return [];
  }
};

// Menyimpan event ke localStorage
export const saveEvent = (event) => {
  if (typeof window === 'undefined') return;
  try {
    const events = getEvents();
    const existingIndex = events.findIndex(e => e.id === event.id);
    
    if (existingIndex >= 0) {
      events[existingIndex] = event;
    } else {
      events.push(event);
    }
    
    localStorage.setItem(StorageKeys.EVENTS, JSON.stringify(events));
  } catch (error) {
    console.error('Error saving event:', error);
  }
};

// Menghapus event dari localStorage
export const deleteEvent = (eventId) => {
  if (typeof window === 'undefined') return;
  try {
    const events = getEvents();
    const filteredEvents = events.filter(e => e.id !== eventId);
    localStorage.setItem(StorageKeys.EVENTS, JSON.stringify(filteredEvents));
  } catch (error) {
    console.error('Error deleting event:', error);
  }
};

// Mengambil event berdasarkan ID
export const getEventById = (eventId) => {
  const events = getEvents();
  return events.find(e => e.id === eventId) || null;
};