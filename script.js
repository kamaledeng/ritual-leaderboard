const RPC = "https://rpc.ritualfoundation.org";
const provider = new ethers.providers.JsonRpcProvider(RPC);

let leaderboard = [];
let userAddress = null;

// 🔌 CONNECT WALLET (FIX VERSION)
async function connectWallet() {
  try {
    if (!window.ethereum) {
      alert("Install MetaMask dulu");
      return;
    }

    // CONNECT DULU (WAJIB)
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    userAddress = accounts[0].toLowerCase();

    // OPTIONAL: switch network (jangan bikin gagal)
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x7BB" }]
      });
    } catch (e) {
      console.log("skip switch network");
    }

    render();

  } catch (err) {
    console.error(err);
    alert("Gagal connect wallet");
  }
}

// 📊 LOAD LEADERBOARD
async function loadLeaderboard() {
  try {
    leaderboard = [];

    const latest = await provider.getBlockNumber();
    let map = {};

    // scan last 20 block (ringan)
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
    console.log("RPC error retry...");
  }
}

// 🎯 RENDER
function render() {
  const list = document.getElementById("leaderboard");
  const userBox = document.getElementById("user");

  list.innerHTML = "";

  let userRank = leaderboard.findIndex(x => x.wallet === userAddress);

  if (userAddress && userRank === -1) {
    userRank = leaderboard.length;
  }

  if (userAddress) {
    let tx = 0;
    const found = leaderboard.find(x => x.wallet === userAddress);
    if (found) tx = found.tx;

    userBox.innerHTML = `
      <h3>Your Rank</h3>
      <p>${short(userAddress)} (You)</p>
      <p>Rank: #${userRank + 1}</p>
      <p>TX: ${tx}</p>
    `;
  }

  leaderboard.slice(0, 50).forEach((item, index) => {
    const li = document.createElement("li");

    const isYou = item.wallet === userAddress;

    li.innerHTML = `
      #${index + 1}
      <a href="https://explorer.ritualfoundation.org/address/${item.wallet}" target="_blank">
        ${short(item.wallet)}
      </a>
      - ${item.tx} tx
      ${isYou ? "(You)" : ""}
    `;

    if (isYou) li.classList.add("you");

    list.appendChild(li);
  });
}

// ✂️ SHORT WALLET
function short(addr) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

// 🚀 INIT
loadLeaderboard();
setInterval(loadLeaderboard, 10000);
