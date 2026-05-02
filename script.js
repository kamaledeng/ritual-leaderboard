// Mengambil elemen-elemen dari HTML
const analyzeBtn = document.getElementById('analyzeBtn');
const walletInput = document.getElementById('walletInput');
const resultSection = document.getElementById('resultSection');
const displayWallet = document.getElementById('displayWallet');

// Elemen angka statistik
const totalTx = document.getElementById('totalTx');
const walletBalance = document.getElementById('walletBalance');
const activeDays = document.getElementById('activeDays');
const activeMonths = document.getElementById('activeMonths');
const lastActive = document.getElementById('lastActive');

// Fungsi saat tombol Analyze diklik
analyzeBtn.addEventListener('click', () => {
    const address = walletInput.value.trim();

    // Cek apakah input kosong
    if (address === "") {
        alert("Masukkan alamat wallet terlebih dahulu!");
        return;
    }

    // Ubah teks tombol jadi loading
    analyzeBtn.innerHTML = "⏳ Analyzing...";
    analyzeBtn.style.opacity = "0.7";

    // Simulasi jeda waktu (seolah-olah sedang mencari data di blockchain)
    setTimeout(() => {
        // Tampilkan area hasil
        resultSection.classList.remove('hidden');
        
        // Tampilkan alamat dompet
        displayWallet.textContent = address;

        // --- SIMULASI DATA ---
        // Karena belum ada API asli, kita hasilkan angka acak agar terlihat berfungsi
        const randomTx = Math.floor(Math.random() * 300) + 10;
        const randomBalance = (Math.random() * 5).toFixed(3); // 3 angka di belakang koma
        const randomDays = Math.floor(Math.random() * 30) + 1;
        
        // Masukkan angka ke layar
        totalTx.textContent = randomTx;
        walletBalance.innerHTML = `${randomBalance} <span class="currency">RITUAL</span>`;
        activeDays.textContent = randomDays;
        activeMonths.textContent = Math.ceil(randomDays / 30);
        lastActive.textContent = "1 min ago";

        // Kembalikan tombol ke semula
        analyzeBtn.innerHTML = "🔥 Analyze Wallet";
        analyzeBtn.style.opacity = "1";
    }, 1500); // Jeda 1.5 detik
});

// Fitur Copy Address
document.querySelector('.copy-btn').addEventListener('click', () => {
    const addressToCopy = displayWallet.textContent;
    navigator.clipboard.writeText(addressToCopy).then(() => {
        const btn = document.querySelector('.copy-btn');
        btn.textContent = "Copied!";
        setTimeout(() => btn.textContent = "Copy", 2000);
    });
});
