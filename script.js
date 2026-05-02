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
    save();
  }

  document.getElementById("walletInput").value = "";
  renderWalletInfo();
}

// 💾 SAVE
function save() {
  localStorage.setItem("wallets", JSON.stringify(wallets));
}

// 📊 LOAD DATA
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

    renderLeaderboard();
    renderWalletInfo();

  } catch (err) {
    document.getElementById("loading").innerText = "RPC error...";
  }
}

// 🏆 RENDER LEADERBOARD
function renderLeaderboard() {
  const list = document.getElementById("leaderboard");
  list.innerHTML = "";

  leaderboard.slice(0, 50).forEach((item, i) => {
    const li = document.createElement("li");

    const isYou = wallets.includes(item.wallet);

    li.innerHTML = `
      #${i + 1}
      <a href="https://explorer.ritualfoundation.org/address/${item.wallet}" target="_blank">
        ${short(item.wallet)}
      </a>
      - ${item.tx} tx
      ${isYou ? "(You)" : ""}
    `;

    if (isYou) li.classList.add("highlight");

    list.appendChild(li);
  });

  document.getElementById("loading").innerText = "";
}

// 👤 RENDER WALLET PANEL
function renderWalletInfo() {
  const stats = document.getElementById("stats");
  const empty = document.getElementById("empty");
  const count = document.getElementById("count");

  stats.innerHTML = "";

  count.innerText = `Tracking ${wallets.length} wallet(s)`;

  if (wallets.length === 0) {
    empty.innerText = "Add your wallet to track your rank";
    return;
  } else {
    empty.innerText = "";
  }

  wallets.forEach(w => {
    let found = leaderboard.find(x => x.wallet === w);
    let rank = leaderboard.findIndex(x => x.wallet === w);

    if (rank === -1) rank = leaderboard.length;

    stats.innerHTML += `
      <div class="card">
        ${short(w)} <br>
        Rank: #${rank + 1} <br>
        TX: ${found ? found.tx : 0} <br>
        ${found ? "🔥 Active" : "💤 Idle"}
      </div>
    `;
  });
}

// ✂️ SHORT
function short(addr) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

// INIT
loadLeaderboard();
setInterval(loadLeaderboard, 10000);
