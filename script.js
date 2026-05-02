// Data simulasi (nanti ini akan diganti dengan data tarikan dari API blockchain)
const testnetData = [
    { wallet: "0x1a2b...3c4d", transactions: 1450 },
    { wallet: "0x9f8e...7d6c", transactions: 320 },
    { wallet: "0x5b6a...1f2e", transactions: 2100 },
    { wallet: "0x4c3d...8b9a", transactions: 890 },
    { wallet: "0x7e6f...2a1b", transactions: 3400 }
];

// Fungsi untuk mengurutkan data dari transaksi tertinggi ke terendah
function sortData(data) {
    return data.sort((a, b) => b.transactions - a.transactions);
}

// Fungsi untuk memasukkan data ke dalam tabel HTML
function renderLeaderboard() {
    const tableBody = document.getElementById('leaderboardBody');
    tableBody.innerHTML = ''; // Kosongkan tabel sebelum diisi
    
    const sortedData = sortData(testnetData);

    sortedData.forEach((user, index) => {
        // Membuat elemen baris tabel (tr)
        const row = document.createElement('tr');
        
        // Mengisi kolom-kolom (td)
        row.innerHTML = `
            <td>#${index + 1}</td>
            <td><span class="wallet">${user.wallet}</span></td>
            <td>${user.transactions.toLocaleString()} TX</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Jalankan fungsi saat halaman dimuat
renderLeaderboard();
