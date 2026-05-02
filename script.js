const RPC = "https://rpc.ritualfoundation.org";
const provider = new ethers.providers.JsonRpcProvider(RPC);

let wallets = [];
let leaderboard = [];

// ➕ tambah wallet manual
function addWallet() {
  const input = document.getElementById("walletInput").value.trim();

  if (!input.startsWith("0x") || input.length < 10) {
    alert("wallet tidak valid");
    return;
  }

  wallets.push(input.toLowerCase());
  document.getElementById("walletInput").value = "";

  updateWalletList();
}

// 📋 tampil wallet yg ditrack
function updateWalletList() {
  const list = document.getElementById("walletList");
  list.innerHTML = "";

  wallets.forEach(w => {
    const li = document.createElement("li");
    li.innerText = short(w);
    list.appendChild(li);
  });
}

// 📊 ambil leaderboard
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

// 🎯 render leaderboard
function render() {
  const list = document.getElementById("leaderboard");
  list.innerHTML = "";

  leaderboard.slice(0, 50).forEach((item, i) => {
    const li = document.createElement("li");

    const tracked = wallets.includes(item.wallet);

    li.innerHTML = `
      #${i + 1}
      <a href="https://explorer.ritualfoundation.org/address/${item.wallet}" target="_blank">
        ${short(item.wallet)}
      </a>
      - ${item.tx} tx
      ${tracked ? "(Tracked)" : ""}
    `;

    if (tracked) li.classList.add("highlight");

    list.appendChild(li);
  });
}

// ✂️ short wallet
function short(addr) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

// init
loadLeaderboard();
setInterval(loadLeaderboard, 10000);
