'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getEventById, saveEvent } from '@/utils/localStorage';
import { calculateSplitBill } from '@/utils/calculations';
import Navigation from '@/components/Navigation';
import MemberForm from '@/components/MemberForm';
import ItemForm from '@/components/ItemForm';
import SplitResult from '@/components/SplitResult';
import Swal from 'sweetalert2'


export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('members');
  const [splitData, setSplitData] = useState(null);

  useEffect(() => {
    const eventData = getEventById(params.id);
    if (!eventData) {
      Swal.fire({
        title: 'Event Tidak Ditemukan!',
        text: 'Event yang Anda cari tidak ada.',
        icon: 'error',
        background: '#1e293b',
        color: '#fff'
      }).then(() => {
        router.push('/');
      });
      return;
    }
    setEvent(eventData);
  }, [params.id, router]);

  useEffect(() => {
    if (event && event.members.length > 0 && event.items.length > 0) {
      const calculation = calculateSplitBill(event.items, event.members);
      setSplitData(calculation);
    } else {
      setSplitData(null);
    }
  }, [event]);

  const updateEvent = (updatedEvent) => {
    setEvent(updatedEvent);
    saveEvent(updatedEvent);
  };

  const addMember = (memberData) => {
    const newMember = {
      id: Date.now().toString(),
      name: memberData.name,
      createdAt: new Date().toISOString()
    };

    const updatedEvent = {
      ...event,
      members: [...event.members, newMember],
      updatedAt: new Date().toISOString()
    };

    updateEvent(updatedEvent);
  };

  const deleteMember = async (memberId) => {
    // Cek apakah member sudah digunakan di items
    const isUsed = event.items.some(item =>
      item.payerId === memberId || item.participants.includes(memberId)
    );

    if (isUsed) {
      Swal.fire({
        title: 'Tidak Bisa Dihapus!',
        text: 'Anggota ini sudah terlibat dalam item pengeluaran.',
        icon: 'warning',
        background: '#1e293b',
        color: '#fff'
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Hapus Anggota?',
      text: `Hapus ${event.members.find(m => m.id === memberId)?.name}?`,
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
      const updatedEvent = {
        ...event,
        members: event.members.filter(m => m.id !== memberId),
        updatedAt: new Date().toISOString()
      };

      updateEvent(updatedEvent);

      Swal.fire({
        title: 'Terhapus!',
        text: 'Anggota berhasil dihapus.',
        icon: 'success',
        background: '#1e293b',
        color: '#fff'
      });
    }
  };

  const addItem = (itemData) => {
    const newItem = {
      id: Date.now().toString(),
      name: itemData.name,
      amount: itemData.amount,
      payerId: itemData.payerId,
      participants: itemData.participants,
      createdAt: new Date().toISOString()
    };

    const updatedEvent = {
      ...event,
      items: [...event.items, newItem],
      updatedAt: new Date().toISOString()
    };

    updateEvent(updatedEvent);
  };

  const deleteItem = async (itemId) => {
    const item = event.items.find(i => i.id === itemId);
    const result = await Swal.fire({
      title: 'Hapus Item?',
      text: `Hapus "${item?.name}"?`,
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
      const updatedEvent = {
        ...event,
        items: event.items.filter(i => i.id !== itemId),
        updatedAt: new Date().toISOString()
      };

      updateEvent(updatedEvent);

      Swal.fire({
        title: 'Terhapus!',
        text: 'Item berhasil dihapus.',
        icon: 'success',
        background: '#1e293b',
        color: '#fff'
      });
    }
  };

  const shareEvent = () => {
    const shareData = {
      name: event.name,
      members: event.members,
      items: event.items,
      splitData: splitData
    };

    const encodedData = encodeURIComponent(btoa(JSON.stringify(shareData)));
    const shareUrl = `${window.location.origin}/share/${encodedData}`;

    if (navigator.share) {
      navigator.share({
        title: `Split Bill - ${event.name}`,
        text: 'Lihat hasil split bill kami',
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        Swal.fire({
          title: 'Link Tersalin!',
          text: 'Link share berhasil disalin ke clipboard.',
          icon: 'success',
          background: '#1e293b',
          color: '#fff'
        });
      });
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />

      <div className="container mx-auto p-4 max-w-md">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="text-blue-400 hover:text-blue-300 mb-2 text-sm"
          >
            ← Kembali ke Events
          </button>
          <h1 className="text-2xl font-bold">{event.name}</h1>
          <p className="text-slate-400 text-sm">
            Dibuat: {new Date(event.createdAt).toLocaleDateString('id-ID')}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-800 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab('members')}
            className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${activeTab === 'members'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:text-white'
              }`}
          >
            Anggota ({event.members.length})
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${activeTab === 'items'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:text-white'
              }`}
          >
            Items ({event.items.length})
          </button>
          <button
            onClick={() => setActiveTab('result')}
            className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${activeTab === 'result'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:text-white'
              }`}
          >
            Hasil
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'members' && (
          <div>
            <MemberForm
              onAddMember={addMember}
              members={event.members}
              onDeleteMember={deleteMember}
            />
          </div>
        )}

        {activeTab === 'items' && (
          <div>
            <ItemForm
              members={event.members}
              onAddItem={addItem}
              items={event.items}
              onDeleteItem={deleteItem}
            />
          </div>
        )}

        {activeTab === 'result' && (
          <div>
            <SplitResult
              event={event}
              splitData={splitData}
              onShare={shareEvent}
            />
          </div>
        )}
      </div>
    </div>
  );
}