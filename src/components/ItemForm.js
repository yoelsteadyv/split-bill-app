'use client';
import { useState } from 'react';
import { formatRupiah, formatInputNumber, parseFormattedNumber, formatDate } from '@/utils/formatters';

export default function ItemForm({ members, onAddItem, items, onDeleteItem }) {
  const [itemName, setItemName] = useState('');
  const [amount, setAmount] = useState('');
  const [payerId, setPayerId] = useState('');
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAmountChange = (e) => {
    const formatted = formatInputNumber(e.target.value);
    setAmount(formatted);
  };

  const handleParticipantToggle = (memberId) => {
    setParticipants(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const selectAllParticipants = () => {
    setParticipants(members.map(m => m.id));
  };

  const clearAllParticipants = () => {
    setParticipants([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi
    if (!itemName.trim()) {
      Swal.fire({
        title: 'Error!',
        text: 'Nama item wajib diisi!',
        icon: 'error',
        background: '#1e293b',
        color: '#fff'
      });
      return;
    }

    const numericAmount = parseFormattedNumber(amount);
    if (numericAmount <= 0) {
      Swal.fire({
        title: 'Error!',
        text: 'Jumlah harus lebih dari 0!',
        icon: 'error',
        background: '#1e293b',
        color: '#fff'
      });
      return;
    }

    if (!payerId) {
      Swal.fire({
        title: 'Error!',
        text: 'Pilih pembayar!',
        icon: 'error',
        background: '#1e293b',
        color: '#fff'
      });
      return;
    }

    if (participants.length === 0) {
      Swal.fire({
        title: 'Error!',
        text: 'Pilih minimal 1 peserta!',
        icon: 'error',
        background: '#1e293b',
        color: '#fff'
      });
      return;
    }

    setIsLoading(true);

    try {
      const itemData = {
        name: itemName.trim(),
        amount: numericAmount,
        payerId,
        participants
      };

      onAddItem(itemData);
      
      // Reset form
      setItemName('');
      setAmount('');
      setPayerId('');
      setParticipants([]);
      
      Swal.fire({
        title: 'Berhasil!',
        text: `Item "${itemName}" berhasil ditambahkan!`,
        icon: 'success',
        background: '#1e293b',
        color: '#fff',
        timer: 2000,
        timerProgressBar: true
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Gagal menambahkan item. Silakan coba lagi.',
        icon: 'error',
        background: '#1e293b',
        color: '#fff'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (members.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-slate-400 mb-2">Tambahkan anggota terlebih dahulu</p>
        <p className="text-sm text-slate-500">Minimal 1 anggota diperlukan untuk membuat item</p>
      </div>
    );
  }

  return (
    <div>
      {/* Form Tambah Item */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Tambah Item Pengeluaran</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Nama Item */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Nama Item *
            </label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Misal: Makan malam, Transport"
              className="input-field"
              disabled={isLoading}
              maxLength={50}
            />
          </div>

          {/* Jumlah */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Jumlah (Rp) *
            </label>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0"
              className="input-field"
              disabled={isLoading}
            />
            {amount && (
              <p className="text-xs text-blue-400 mt-1">
                {formatRupiah(parseFormattedNumber(amount))}
              </p>
            )}
          </div>

          {/* Pembayar */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Dibayar oleh *
            </label>
            <select
              value={payerId}
              onChange={(e) => setPayerId(e.target.value)}
              className="input-field"
              disabled={isLoading}
            >
              <option value="">Pilih pembayar</option>
              {members.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          {/* Peserta */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Peserta yang ikut bayar * ({participants.length}/{members.length})
            </label>
            
            <div className="flex space-x-2 mb-3">
              <button
                type="button"
                onClick={selectAllParticipants}
                className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white"
              >
                Pilih Semua
              </button>
              <button
                type="button"
                onClick={clearAllParticipants}
                className="text-xs px-3 py-1 bg-slate-600 hover:bg-slate-700 rounded text-white"
              >
                Hapus Semua
              </button>
            </div>

            <div className="space-y-2 max-h-32 overflow-y-auto">
              {members.map(member => (
                <label key={member.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={participants.includes(member.id)}
                    onChange={() => handleParticipantToggle(member.id)}
                    className="rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <span className="text-sm">{member.name}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {isLoading ? 'Menambahkan...' : 'Tambah Item'}
          </button>
        </form>
      </div>

      {/* Daftar Item */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">
          Daftar Item ({items.length})
        </h3>

        {items.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p>Belum ada item pengeluaran</p>
            <p className="text-sm">Tambahkan item untuk mulai split bill</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const payer = members.find(m => m.id === item.payerId);
              const participantNames = item.participants
                .map(pid => members.find(m => m.id === pid)?.name)
                .filter(Boolean);

              return (
                <div key={item.id} className="bg-slate-700 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-lg">{item.name}</h4>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded hover:bg-red-600/20 transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <p className="text-blue-400 font-medium">
                      {formatRupiah(item.amount)}
                    </p>
                    <p className="text-slate-300">
                      Dibayar oleh: <span className="font-medium">{payer?.name}</span>
                    </p>
                    <p className="text-slate-300">
                      Peserta: <span className="font-medium">{participantNames.join(', ')}</span>
                    </p>
                    <p className="text-slate-300">
                      Per orang: <span className="font-medium">
                        {formatRupiah(item.amount / item.participants.length)}
                      </span>
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}