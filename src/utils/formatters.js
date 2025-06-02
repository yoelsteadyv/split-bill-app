// Format angka ke format Rupiah
export const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format input angka dengan titik sebagai pemisah ribuan
export const formatInputNumber = (value) => {
  // Hapus semua karakter non-digit
  const numericValue = value.replace(/\D/g, '');
  
  // Format dengan titik sebagai pemisah ribuan
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Convert formatted input ke angka
export const parseFormattedNumber = (formattedValue) => {
  return parseInt(formattedValue.replace(/\./g, '') || '0');
};

// Format tanggal
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};