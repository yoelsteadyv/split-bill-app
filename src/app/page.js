'use client';
import { useState, useEffect } from 'react';
import { getEvents, deleteEvent } from '@/utils/localStorage';
import EventForm from '@/components/EventForm';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  const handleEventCreated = () => {
    setEvents(getEvents());
    setShowForm(false);
  };

  const handleDeleteEvent = async (eventId) => {
    const result = await Swal.fire({
      title: 'Hapus Event?',
      text: 'Data event dan semua item akan dihapus permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      background: '#1e293b',
      color: '#fff'
    });

    if (result.isConfirmed) {
      deleteEvent(eventId);
      setEvents(getEvents());
      
      Swal.fire({
        title: 'Terhapus!',
        text: 'Event berhasil dihapus.',
        icon: 'success',
        background: '#1e293b',
        color: '#fff'
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      
      <div className="container mx-auto p-4 max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Events Anda</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? 'Batal' : 'Buat Event'}
          </button>
        </div>

        {showForm && (
          <div className="mb-6">
            <EventForm onEventCreated={handleEventCreated} />
          </div>
        )}

        {events.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-slate-400 mb-4">Belum ada event</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Buat Event Pertama
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map(event => (
              <div key={event.id} className="card">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{event.name}</h3>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Hapus
                  </button>
                </div>
                
                <p className="text-slate-400 text-sm mb-3">
                  Dibuat: {new Date(event.createdAt).toLocaleDateString('id-ID')}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-slate-300">
                    <span className="block">Anggota: {event.members?.length || 0}</span>
                    <span className="block">Items: {event.items?.length || 0}</span>
                  </div>
                  
                  <Link 
                    href={`/event/${event.id}`}
                    className="btn-primary text-sm"
                  >
                    Kelola
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}