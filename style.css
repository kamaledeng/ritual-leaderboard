// --- LOGIKA CONNECT WALLET ---
const connectWalletBtn = document.getElementById('connectWalletBtn');
let currentAccount = null;

async function connectWallet() {
    // Mengecek apakah ada wallet web3 yang terpasang di browser
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Meminta akses ke wallet pengguna
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            currentAccount = accounts[0];
            
            // Memotong address agar tidak terlalu panjang (0x1234...abcd)
            const shortAddress = `${currentAccount.substring(0, 6)}...${currentAccount.substring(currentAccount.length - 4)}`;
            
            // Mengubah tampilan tombol setelah sukses connect
            connectWalletBtn.textContent = shortAddress;
            connectWalletBtn.style.backgroundColor = "#222";
            connectWalletBtn.style.color = "#00ff88";
            connectWalletBtn.style.border = "1px solid #00ff88";
            
        } catch (error) {
            console.error("Connection rejected or failed:", error);
        }
    } else {
        alert("Please install MetaMask or another Web3 wallet extension to connect!");
    }
}

// Menjalankan fungsi connectWallet saat tombol diklik
connectWalletBtn.addEventListener('click', connectWallet);


// --- LOGIKA DATA LEADERBOARD ---
async function fetchTestnetData() {
    try {
        // GANTI URL INI DENGAN API ENDPOINT RITUAL YANG ASLI NANTINYA
        const apiUrl = 'https://api-testnet-explorer.ritual.net/api?module=account&action=txlist'; 
        
        // --- DATA SIMULASI (Hapus ini jika API sudah siap) ---
        const dummyData = [
            { walletAddress: "0x1a2b...3c4d", totalTx: 1450 },
            { walletAddress: "0x9f8e...7d6c", totalTx: 320 },
            { walletAddress: "0x5b6a...1f2e", totalTx: 2100 },
            { walletAddress: "0x4c3d...8b9a", totalTx: 890 }
        ];
        renderLeaderboard(dummyData);
        // ----------------------------------------------------

        /* KODE ASLI UNTUK API (Buka komentar ini jika sudah ada API-nya)
        const response = await fetch(apiUrl);
        const data = await response.json();
        renderLeaderboard(data.result); 
        */

    } catch (error) {
        console.error("Failed to fetch blockchain data:", error);
        document.getElementById('leaderboardBody').innerHTML = "<tr><td colspan='3'>Error loading network data.</td></tr>";
    }
}

function sortData(data) {
    return data.sort((a, b) => b.totalTx - a.totalTx);
}

function renderLeaderboard(blockchainData) {
    const tableBody = document.getElementById('leaderboardBody');
    tableBody.innerHTML = ''; 
    
    const sortedData = sortData(blockchainData);

    sortedData.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${index + 1}</td>
            <td><span class="wallet">${user.walletAddress}</span></td>
            <td>${user.totalTx.toLocaleString()}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Load data saat halaman pertama kali dibuka
fetchTestnetData();
