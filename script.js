// Fungsi untuk menarik data asli dari API/Jembatan Data
async function ambilDataTestnetRitual() {
    try {
        // PERHATIAN: URL di bawah ini adalah contoh. 
        // Anda harus menggantinya dengan link API resmi dari Ritual atau Indexer buatan Anda.
        const urlAPI = 'https://api-testnet-explorer.ritual.net/api?module=account&action=txlist'; 
        
        const respon = await fetch(urlAPI);
        const dataAsli = await respon.json();

        // Mengolah data yang didapat lalu menampilkannya
        renderLeaderboard(dataAsli.result); 

    } catch (error) {
        console.error("Waduh, gagal mengambil data dari blockchain:", error);
        document.getElementById('leaderboardBody').innerHTML = "<tr><td colspan='3'>Gagal memuat data jaringan.</td></tr>";
    }
}

// Fungsi untuk mengurutkan data dari transaksi tertinggi ke terendah
function urutkanData(data) {
    // Logika sorting ini tergantung pada format data dari API nantinya
    return data.sort((a, b) => b.jumlahTransaksi - a.jumlahTransaksi);
}

// Fungsi untuk memasukkan data ke dalam tabel HTML
function renderLeaderboard(dataBlockchain) {
    const tableBody = document.getElementById('leaderboardBody');
    tableBody.innerHTML = ''; // Kosongkan tabel sebelum diisi
    
    // Urutkan datanya
    const dataSiapTampil = urutkanData(dataBlockchain);

    dataSiapTampil.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${index + 1}</td>
            <td><span class="wallet">${user.walletAddress}</span></td>
            <td>${user.jumlahTransaksi} TX</td>
        `;
        tableBody.appendChild(row);
    });
}

// Jalankan fungsi saat halaman web dibuka
ambilDataTestnetRitual();
