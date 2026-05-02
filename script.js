const RPC = "https://rpc.ritualfoundation.org";
const provider = new ethers.providers.JsonRpcProvider(RPC);

let leaderboard = [];
let userAddress = null;

// ambil block + tx
async function loadLeaderboard() {
  leaderboard = [];

  const latest = await provider.getBlockNumber();

  let map = {};

  // scan last 30 block (biar ringan dulu)
  for (let i = 0; i < 30; i++) {
    const block = await provider.getBlockWithTransactions(latest - i);

    block.transactions.forEach(tx => {
      const addr = tx.from.toLowerCase();
      map[addr] = (map[addr] || 0) + 1;
    });
  }

  // convert ke array
  leaderboard = Object.entries(map).map(([wallet, tx]) => ({
    wallet,
    tx
  }));

  leaderboard.sort((a, b) => b.tx - a.tx);

  render();
}

// connect wallet
async function connectWallet() {
  if (!window.ethereum) return alert("install metamask");

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts"
  });

  userAddress = accounts[0].toLowerCase();

  render();
}

// render UI
function render() {
  const list = document.getElementById("leaderboard");
  const userBox = document.getElementById("user");

  list.innerHTML = "";

  let userRank = leaderboard.findIndex(
    x => x.wallet === userAddress
  );

  // kalau user ga ada → rank terakhir
  if (userAddress && userRank === -1) {
    userRank = leaderboard.length;
  }

  // tampil user
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

  // tampil leaderboard
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

// helper shorten wallet
function short(addr) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

// auto load
loadLeaderboard();

// refresh tiap 10 detik
setInterval(loadLeaderboard, 10000);
