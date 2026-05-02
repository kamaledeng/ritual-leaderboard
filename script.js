const RPC = "https://rpc.ritualfoundation.org";
const provider = new ethers.providers.JsonRpcProvider(RPC);

let userAddress = null;
let wallets = [];
let leaderboard = [];

// 🔌 CONNECT WALLET (VERSI PALING COMPATIBLE)
async function connectWallet() {
  try {
    if (!window.ethereum) {
      alert("MetaMask tidak terdeteksi");
      return;
    }

    // fallback lama (lebih kompatibel)
    if (window.ethereum.request) {
      const acc = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
      userAddress = acc[0];
    } else {
      const acc = await window.ethereum.enable();
      userAddress = acc[0];
    }

    wallets.push(userAddress);
    updateWalletList();

  } catch (err) {
    console.error(err);
    alert("User cancel / error connect");
  }
}

// ➕ TAMBAH WALLET MANUAL
function addWallet() {
  const input = document.getElementById("walletInput").value.trim();

  if (!input.startsWith("0x")) {
    alert("wallet tidak valid");
    return;
  }

  wallets.push(input.toLowerCase());
  document.getElementById("walletInput").value = "";

  updateWalletList();
}

// 🧾 LIST WALLET
function updateWalletList() {
  const list = document.getElementById("walletList");
  list.innerHTML = "";

  wallets.forEach(w => {
    const li = document.createElement("li");
    li.innerText = short(w);
    list.appendChild(li);
  });
}

// 📊 LOAD LEADERBOARD
async function loadLeaderboard() {
  try {
    const latest = await provider.getBlockNumber();
    let map = {};

    for (let i = 0; i < 20; i++) {
      const block = await provider.getBlockWithTransactions(latest - i);

      block.transactions.forEach(tx => {
        const addr = tx.from.toLowerCase();
        map[addr] = (map[addr] || 0) + 1;
      });
    }

    leaderboard = Object.entries(map).map(([wallet, tx]) => ({
      wallet,
      tx
    }));

    leaderboard.sort((a, b) => b.tx - a.tx);

    render();

  } catch (err) {
    console.log("RPC error...");
  }
}

// 🎯 RENDER
function render() {
  const list = document.getElementById("leaderboard");
  const userBox = document.getElementById("user");

  list.innerHTML = "";

  // tampil user rank
  if (userAddress) {
    let rank = leaderboard.findIndex(x => x.wallet === userAddress);
    if (rank === -1) rank = leaderboard.length;

    userBox.innerHTML = `
      Connected: ${short(userAddress)} <br>
      Rank: #${rank + 1}
    `;
  }

  leaderboard.slice(0, 50).forEach((item, i) => {
    const li = document.createElement("li");

    const isUser = wallets.includes(item.wallet);

    li.innerHTML = `
      #${i + 1}
      <a href="https://explorer.ritualfoundation.org/address/${item.wallet}" target="_blank">
        ${short(item.wallet)}
      </a>
      - ${item.tx} tx
      ${isUser ? "(Tracked)" : ""}
    `;

    if (isUser) li.classList.add("you");

    list.appendChild(li);
  });
}

// ✂️ SHORT
function short(addr) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

// INIT
loadLeaderboard();
setInterval(loadLeaderboard, 10000);
