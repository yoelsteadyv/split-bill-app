'use client';
import { formatRupiah } from '@/utils/formatters';
import Swal from 'sweetalert2'


export default function SplitResult({ event, splitData, onShare }) {

  const exportToPDF = async () => {
    // Import jsPDF dan html2canvas
    const { jsPDF } = await import('jspdf');
    const html2canvas = await import('html2canvas');

    try {
      // Buat elemen untuk PDF
      const element = document.createElement('div');
      element.style.padding = '20px';
      element.style.backgroundColor = 'white';
      element.style.color = 'black';
      element.style.fontFamily = 'Arial, sans-serif';
      element.style.width = '800px';

      element.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1e40af; margin: 0;">${event.name}</h1>
          <p style="color: #666; margin: 10px 0;">Split Bill Report</p>
          <p style="color: #666; margin: 0;">Generated on ${new Date().toLocaleDateString('id-ID')}</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 5px;">Ringkasan</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
            <div>
              <p><strong>Total Pengeluaran:</strong> ${formatRupiah(splitData?.summary.totalAmount || 0)}</p>
              <p><strong>Jumlah Item:</strong> ${splitData?.summary.totalItems || 0}</p>
            </div>
            <div>
              <p><strong>Jumlah Anggota:</strong> ${splitData?.summary.totalMembers || 0}</p>
              <p><strong>Rata-rata per Orang:</strong> ${formatRupiah((splitData?.summary.totalAmount || 0) / (splitData?.summary.totalMembers || 1))}</p>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 5px;">Detail Item</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Item</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: right;">Jumlah</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Pembayar</th>
                <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Peserta</th>
              </tr>
            </thead>
            <tbody>
              ${event.items.map(item => {
        const payer = event.members.find(m => m.id === item.payerId);
        const participants = item.participants
          .map(pid => event.members.find(m => m.id === pid)?.name)
          .filter(Boolean);
        return `
                  <tr>
                    <td style="border: 1px solid #d1d5db; padding: 8px;">${item.name}</td>
                    <td style="border: 1px solid #d1d5db; padding: 8px; text-align: right;">${formatRupiah(item.amount)}</td>
                    <td style="border: 1px solid #d1d5db; padding: 8px;">${payer?.name || '-'}</td>
                    <td style="border: 1px solid #d1d5db; padding: 8px;">${participants.join(', ')}</td>
                  </tr>
                `;
      }).join('')}
            </tbody>
          </table>
        </div>

        ${splitData?.transactions.length > 0 ? `
          <div style="margin-bottom: 30px;">
            <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 5px;">Transaksi yang Diperlukan</h2>
            <div style="margin-top: 15px;">
              ${splitData.transactions.map(transaction => `
                <div style="background-color: #f9fafb; padding: 15px; border-left: 4px solid #1e40af; margin-bottom: 10px;">
                  <p style="margin: 0; font-weight: bold;">
                    ${transaction.from.name} → ${transaction.to.name}
                  </p>
                  <p style="margin: 5px 0 0 0; color: #059669; font-size: 18px; font-weight: bold;">
                    ${formatRupiah(transaction.amount)}
                  </p>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div>
          <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 5px;">Saldo Akhir</h2>
          <div style="margin-top: 15px;">
            ${event.members.map(member => {
        const balance = splitData?.balances[member.id] || 0;
        const balanceColor = balance > 0 ? '#059669' : balance < 0 ? '#dc2626' : '#6b7280';
        const balanceText = balance > 0 ? 'Akan menerima' : balance < 0 ? 'Harus membayar' : 'Lunas';

        return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #e5e7eb;">
                  <span style="font-weight: bold;">${member.name}</span>
                  <div style="text-align: right;">
                    <div style="color: ${balanceColor}; font-weight: bold;">
                      ${balance !== 0 ? formatRupiah(Math.abs(balance)) : 'Rp 0'}
                    </div>
                    <div style="font-size: 12px; color: #6b7280;">
                      ${balanceText}
                    </div>
                  </div>
                </div>
              `;
      }).join('')}
          </div>
        </div>
      `;

      // Tambahkan ke DOM sementara
      document.body.appendChild(element);

      // Konversi ke canvas
      const canvas = await html2canvas.default(element, {
        backgroundColor: 'white',
        scale: 2
      });

      // Hapus dari DOM
      document.body.removeChild(element);

      // Buat PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`split-bill-${event.name.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`);

      Swal.fire({
        title: 'Berhasil!',
        text: 'PDF berhasil diunduh!',
        icon: 'success',
        background: '#1e293b',
        color: '#fff'
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Gagal membuat PDF. Silakan coba lagi.',
        icon: 'error',
        background: '#1e293b',
        color: '#fff'
      });
    }
  };

  if (!splitData) {
    return (
      <div className="card text-center py-8">
        <p className="text-slate-400 mb-2">Belum ada data untuk dihitung</p>
        <p className="text-sm text-slate-500">Tambahkan anggota dan item pengeluaran terlebih dahulu</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Ringkasan */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Ringkasan</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-400">Total Pengeluaran</p>
            <p className="text-xl font-bold text-blue-400">
              {formatRupiah(splitData.summary.totalAmount)}
            </p>
          </div>
          <div>
            <p className="text-slate-400">Rata-rata per Orang</p>
            <p className="text-xl font-bold text-green-400">
              {formatRupiah(splitData.summary.totalAmount / splitData.summary.totalMembers)}
            </p>
          </div>
        </div>
      </div>

      {/* Transaksi yang Diperlukan */}
      {splitData.transactions.length > 0 ? (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Transaksi yang Diperlukan</h3>
          <div className="space-y-3">
            {splitData.transactions.map((transaction, index) => (
              <div key={index} className="bg-slate-700 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {transaction.from.name} → {transaction.to.name}
                    </p>
                    <p className="text-sm text-slate-400">Transfer</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-400">
                      {formatRupiah(transaction.amount)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card text-center py-6">
          <p className="text-green-400 font-medium">🎉 Semua sudah lunas!</p>
          <p className="text-sm text-slate-400 mt-1">Tidak ada transaksi yang diperlukan</p>
        </div>
      )}

      {/* Saldo per Anggota */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Saldo Akhir</h3>
        <div className="space-y-3">
          {event.members.map(member => {
            const balance = splitData.balances[member.id];
            const balanceColor = balance > 0 ? 'text-green-400' : balance < 0 ? 'text-red-400' : 'text-slate-400';
            const balanceText = balance > 0 ? 'Akan menerima' : balance < 0 ? 'Harus membayar' : 'Lunas';

            return (
              <div key={member.id} className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-xs text-slate-400">{balanceText}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${balanceColor}`}>
                    {balance !== 0 ? formatRupiah(Math.abs(balance)) : 'Rp 0'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      {/* <div className="flex space-x-3">
        <button
          onClick={onShare}
          className="btn-secondary flex-1"
        >
          📤 Share
        </button>
        <button
          onClick={exportToPDF}
          className="btn-primary flex-1"
        >
          📄 Export PDF
        </button>
      </div> */}
    </div>
  );
}