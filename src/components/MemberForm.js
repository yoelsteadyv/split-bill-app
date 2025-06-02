'use client';
import { useState } from 'react';
import { formatDate } from '@/utils/formatters';

export default function MemberForm({ onAddMember, members, onDeleteMember }) {
  const [memberName, setMemberName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi
    if (!memberName.trim()) {
      Swal.fire({
        title: 'Error!',
        text: 'Nama anggota wajib diisi!',
        icon: 'error',
        background: '#1e293b',
        color: '#fff'
      });
      return;
    }

    if (memberName.trim().length < 2) {
      Swal.fire({
        title: 'Error!',
        text: 'Nama anggota minimal 2 karakter!',
        icon: 'error',
        background: '#1e293b',
        color: '#fff'
      });
      return;
    }

    // Cek duplikasi nama
    if (members.some(member => member.name.toLowerCase() === memberName.trim().toLowerCase())) {
      Swal.fire({
        title: 'Error!',
        text: 'Nama anggota sudah ada!',
        icon: 'error',
        background: '#1e293b',
        color: '#fff'
      });
      return;
    }

    setIsLoading(true);

    try {
      onAddMember({ name: memberName.trim() });
      setMemberName('');
      
      Swal.fire({
        title: 'Berhasil!',
        text: `Anggota "${memberName}" berhasil ditambahkan!`,
        icon: 'success',
        background: '#1e293b',
        color: '#fff',
        timer: 2000,
        timerProgressBar: true
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Gagal menambahkan anggota. Silakan coba lagi.',
        icon: 'error',
        background: '#1e293b',
        color: '#fff'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Form Tambah Anggota */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Tambah Anggota</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Nama Anggota *
            </label>
            <input
              type="text"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="Masukkan nama anggota"
              className="input-field"
              disabled={isLoading}
              maxLength={30}
            />
            <p className="text-xs text-slate-400 mt-1">
              Minimal 2 karakter, maksimal 30 karakter
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {isLoading ? 'Menambahkan...' : 'Tambah Anggota'}
          </button>
        </form>
      </div>

      {/* Daftar Anggota */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">
          Daftar Anggota ({members.length})
        </h3>

        {members.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p>Belum ada anggota</p>
            <p className="text-sm">Tambahkan anggota untuk memulai split bill</p>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member, index) => (
              <div key={member.id} className="bg-slate-700 p-3 rounded-lg flex justify-between items-center">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      {index + 1}
                    </span>
                    <span className="font-medium">{member.name}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Ditambahkan: {formatDate(member.createdAt)}
                  </p>
                </div>
                
                <button
                  onClick={() => onDeleteMember(member.id)}
                  className="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded hover:bg-red-600/20 transition-colors"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}