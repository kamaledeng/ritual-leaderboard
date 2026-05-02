let data = [];
let faucetPool = 100000;

// 🔥 generate sekali saja
function generateData(n = 200) {
  for (let i = 0; i < n; i++) {
    let tx = Math.floor(Math.random() * 120) + 1;
    let claims = Math.floor(Math.random() * 10);
    let score = tx * 2 + claims * 5;

    data.push({
      wallet: "0x" + Math.random().toString(16).slice(2, 42),
      tx,
      claims,
      score
    });
  }

  data.sort((a, b) => b.score - a.score);
}

// 🔥 helpers
const xpOf = s => s * 10;

function levelOf(xp) {
  if (xp < 500) return "Newbie";
  if (xp < 1500) return "Explorer";
  return "Ritual Elite";
}

// 🔥 stats
function renderStats() {
  document.getElementById("participants").innerText = data.length * 10 + "+";

  let totalTx = data.reduce((a, b) => a + b.tx, 0);
  let totalClaims = data.reduce((a, b) => a + b.claims, 0);
  let faucetLeft = faucetPool - totalClaims * 10;

  document.getElementById("totalTx").innerText = totalTx;
  document.getElementById("totalClaims").innerText = totalClaims;
  document.getElementById("faucetLeft").innerText = faucetLeft;
}

// 🔥 render table
function renderTable() {
  let tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  data.forEach((d, i) => {
    tbody.innerHTML += `
      <tr>
        <td>#${i + 1}</td>
        <td>
          <a href="https://etherscan.io/address/${d.wallet}" target="_blank" class="wallet-link">
            ${d.wallet.slice(0,6)}...${d.wallet.slice(-4)}
          </a>
        </td>
        <td>${d.score}</td>
        <td>${xpOf(d.score)}</td>
        <td>${levelOf(xpOf(d.score))}</td>
        <td>${d.tx}</td>
        <td>${d.claims}</td>
      </tr>
    `;
  });
}

// 🔥 tampil rank (TIDAK RANDOM LAGI)
function showYourRank(user, rank, isNew = false) {
  let xp = xpOf(user.score);

  document.getElementById("yr-result").innerHTML = `
    <div>${user.wallet.slice(0,6)}...${user.wallet.slice(-4)}</div>
    <div class="rank-big">#${rank}</div>
    <div>Score: ${user.score} • XP: ${xp} • Level: ${levelOf(xp)}</div>
    <div>Tx: ${user.tx} • Faucet Claims: ${user.claims}</div>
    ${isNew ? `<div class="muted">New Participant 🚀</div>` : ""}
  `;
}

// 🔥 CHECK RANK (STABIL)
function checkRank() {
  let input = document.getElementById("walletInput").value.trim().toLowerCase();

  if (!input) return;

  let idx = data.findIndex(d => d.wallet.toLowerCase() === input);

  if (idx !== -1) {
    showYourRank(data[idx], idx + 1);
  } else {
    // 🔥 IMPORTANT: simpan user baru biar tidak berubah-ubah
    let tx = 5;
    let claims = 1;
    let score = tx * 2 + claims * 5;

    let newUser = {
      wallet: input,
      tx,
      claims,
      score
    };

    data.push(newUser);
    data.sort((a, b) => b.score - a.score);

    let newIndex = data.findIndex(d => d.wallet === input);

    showYourRank(newUser, newIndex + 1, true);
    renderTable();
    renderStats();
  }
}

// 🔥 CONNECT WALLET (FIX)
async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    alert("Install MetaMask dulu");
    return;
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    const wallet = accounts[0];

    document.getElementById("walletAddress").innerText =
      "Connected: " + wallet.slice(0,6) + "...";

    document.getElementById("walletInput").value = wallet;

    checkRank();

  } catch (err) {
    console.log(err);
  }
}

// 🔥 INIT
generateData();
renderStats();
renderTable();
