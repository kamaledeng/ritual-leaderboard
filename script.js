const RPC = "https://rpc.ritualfoundation.org";
const provider = new ethers.providers.JsonRpcProvider(RPC);

let wallets = JSON.parse(localStorage.getItem("wallets") || "[]");
let leaderboard = [];

// ➕ ADD WALLET
function addWallet() {
  const input = document.getElementById("walletInput").value.trim().toLowerCase();

  if (!input.startsWith("0x") || input.length < 10) {
    alert("wallet tidak valid");
    return;
  }

  if (!wallets.includes(input)) {
    wallets.push(input);
    saveWallets();
  }

  document.getElementById("walletInput").value = "";
  updateWalletList();
}

// ❌ REMOVE WALLET
function removeWallet(addr) {
  wallets = wallets.filter(w => w !== addr);
  saveWallets();
  updateWalletList();
}

// 💾 SAVE
function saveWallets() {
  localStorage.setItem("wallets", JSON.stringify(wallets));
}

// 📋 LIST WALLET
function updateWalletList() {
  const list = document.getElementById("walletList");
  list.innerHTML = "";

  wallets.forEach(w => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${short(w)}
      <button onclick="removeWallet('${w}')">x</button>
    `;
    list.appendChild(li);
  });
}

// 📊 LOAD LEADERBOARD
async function loadLeaderboard() {
  document.getElementById("loading").innerText = "Loading...";

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
    updateStats();

  } catch (err) {
    document.getElementById("loading").innerText = "RPC error...";
  }
}

// 🎯 RENDER
function render() {
  const list = document.getElementById("leaderboard");
  list.innerHTML = "";

  leaderboard.slice(0, 50).forEach((item, i) => {
    const tracked = wallets.includes(item.wallet);

    const li = document.createElement("li");
    li.innerHTML = `
      #${i + 1}
      <a href="https://explorer.ritualfoundation.org/address/${item.wallet}" target="_blank">
        ${short(item.wallet)}
      </a>
      - ${item.tx} tx
      ${tracked ? "(You)" : ""}
    `;

    if (tracked) li.classList.add("highlight");

    list.appendChild(li);
  });

  document.getElementById("loading").innerText = "";
}

// 📊 STATS WALLET
function updateStats() {
  const stats = document.getElementById("stats");
  stats.innerHTML = "";

  wallets.forEach(w => {
    let found = leaderboard.find(x => x.wallet === w);
    let rank = leaderboard.findIndex(x => x.wallet === w);

    if (rank === -1) rank = leaderboard.length;

    stats.innerHTML += `
      <p>
        ${short(w)} → Rank #${rank + 1} | 
        TX: ${found ? found.tx : 0} | 
        ${found ? "🔥 Active" : "💤 Idle"}
      </p>
    `;
  });
}

// ✂️ SHORT
function short(addr) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

// INIT
updateWalletList();
loadLeaderboard();
setInterval(loadLeaderboard, 10000);
