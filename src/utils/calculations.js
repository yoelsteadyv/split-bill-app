// Menghitung split bill dan saldo masing-masing anggota
export const calculateSplitBill = (items, members) => {
  // Inisialisasi saldo untuk setiap anggota
  const balances = {};
  members.forEach(member => {
    balances[member.id] = 0;
  });

  // Hitung total yang dibayar dan yang harus dibayar setiap anggota
  const totalPaid = {}; // Total yang sudah dibayar
  const totalOwed = {}; // Total yang harus dibayar

  members.forEach(member => {
    totalPaid[member.id] = 0;
    totalOwed[member.id] = 0;
  });

  // Proses setiap item
  items.forEach(item => {
    const amount = item.amount;
    const payerId = item.payerId;
    const participants = item.participants;
    const splitAmount = amount / participants.length;

    // Tambah ke total yang dibayar oleh pembayar
    totalPaid[payerId] += amount;

    // Tambah ke total yang harus dibayar oleh setiap peserta
    participants.forEach(participantId => {
      totalOwed[participantId] += splitAmount;
    });
  });

  // Hitung saldo = yang dibayar - yang harus dibayar
  members.forEach(member => {
    balances[member.id] = totalPaid[member.id] - totalOwed[member.id];
  });

  // Buat list transaksi yang diperlukan
  const transactions = [];
  const debtors = []; // Yang harus bayar
  const creditors = []; // Yang harus dibayar

  Object.entries(balances).forEach(([memberId, balance]) => {
    const member = members.find(m => m.id === memberId);
    if (balance < 0) {
      debtors.push({ member, amount: Math.abs(balance) });
    } else if (balance > 0) {
      creditors.push({ member, amount: balance });
    }
  });

  // Buat transaksi optimal
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debt = debtors[i].amount;
    const credit = creditors[j].amount;
    const transferAmount = Math.min(debt, credit);

    if (transferAmount > 0) {
      transactions.push({
        from: debtors[i].member,
        to: creditors[j].member,
        amount: transferAmount
      });
    }

    debtors[i].amount -= transferAmount;
    creditors[j].amount -= transferAmount;

    if (debtors[i].amount === 0) i++;
    if (creditors[j].amount === 0) j++;
  }

  return {
    balances,
    transactions,
    totalPaid,
    totalOwed,
    summary: {
      totalAmount: Object.values(totalPaid).reduce((sum, val) => sum + val, 0),
      totalItems: items.length,
      totalMembers: members.length
    }
  };
};