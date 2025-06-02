'use client';
import { useState } from 'react';
import { saveEvent } from '@/utils/localStorage';

export default function EventForm({ onEventCreated, initialData = null }) {
  const [eventName, setEventName] = useState(initialData?.name || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi
    if (!eventName.trim()) {
      Swal.fire({
        title: 'Error!',
        text: 'Nama event wajib diisi!',
        icon: 'error',
        background: '#1e293b',
        color: '#fff'
      });
      return;
    }

    setIsLoading(true);

    try {
      const eventData = {
        id: initialData?.id || Date.now().toString(),
        name: eventName.trim(),
        members: initialData?.members || [],
        items: initialData?.items || [],
        createdAt: initialData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      saveEvent(eventData);

      Swal.fire({
        title: 'Berhasil!',
        text: `Event "${eventName}" berhasil ${initialData ? 'diupdate' : 'dibuat'}!`,
        icon: 'success',
        background: '#1e293b',
        color: '#fff'
      });

      if (!initialData) {
        setEventName('');
      }
      onEventCreated();
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Gagal menyimpan event. Silakan coba lagi.',
        icon: 'error',
        background: '#1e293b',
        color: '#fff'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? 'Edit Event' : 'Buat Event Baru'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Nama Event *
          </label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Misal: Makan Malam Jumat, Camp 2025"
            className="input-field"
            disabled={isLoading}
            maxLength={50}
          />
          <p className="text-xs text-slate-400 mt-1">
            Maksimal 50 karakter
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {isLoading ? 'Menyimpan...' : (initialData ? 'Update' : 'Buat Event')}
          </button>
        </div>
      </form>
    </div>
  );
}