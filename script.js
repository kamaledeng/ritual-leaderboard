let data = [];
let faucetPool = 100000; // total faucet global

// 🔥 Generate Data
function generateData(n = 200) {
  data = [];

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

// 🔥 Helpers
const xpOf = s => s * 10;

function levelOf(xp) {
  if (xp < 500) return "Newbie";
  if (xp < 1500) return "Explorer";
  return "Ritual Elite";
}

// 🔥 Stats Global
function renderStats() {
  document.getElementById("participants").innerText = data.length * 10 + "+";

  let totalTx = data.reduce((a, b) => a + b.tx, 0);
  let totalClaims = data.reduce((a, b) => a + b.claims, 0);

  let faucetLeft = faucetPool - totalClaims * 10;

  document.getElementById("totalTx").innerText = totalTx.toLocaleString();
  document.getElementById("totalClaims").innerText = totalClaims.toLocaleString();
  document.getElementById("faucetLeft").innerText = faucetLeft.toLocaleString();
}

// 🔥 Render Table
function renderTable() {
  let tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  data.forEach((d, i) => {
    let xp = xpOf(d.score);
    let lvl = levelOf(xp);

    tbody.innerHTML += `
      <tr>
        <td>#${i + 1}</td>
        <td>
          <a href="https://etherscan.io/address/${d.wallet}" target="_blank" class="wallet-link">
            ${d.wallet.slice(0,6)}...${d.wallet.slice(-4)}
          </a>
        </td>
        <td>${d.score}</td>
        <td>${xp}</td>
        <td>${lvl}</td>
        <td>${d.tx}</td>
        <td>${d.claims}</td>
      </tr>
    `;
  });
}

// 🔥 Your Rank
function showYourRank(user, rank, isNew = false) {
  let xp = xpOf(user.score);
  let lvl = levelOf(xp);

  document.getElementById("yr-result").innerHTML = `
    <div>${user.wallet.slice(0,6)}...${user.wallet.slice(-4)}</div>
    <div class="rank-big">#${rank}</div>
    <div>
      Score: ${user.score} • XP: ${xp} • Level: ${lvl}
    </div>
    <div>
      Tx: ${user.tx} • Faucet Claims: ${user.claims}
    </div>
    ${isNew ? `<div class="muted">New Participant 🚀</div>` : ``}
  `;
}

// 🔥 Check Rank
function checkRank() {
  let input = document.getElementById("walletInput").value.trim().toLowerCase();

  if (!input) return;

  let idx = data.findIndex(d => d.wallet.toLowerCase() === input);

  if (idx !== -1) {
    showYourRank(data[idx], idx + 1);
  } else {
    let tx = Math.floor(Math.random() * 10);
    let claims = Math.floor(Math.random() * 3);
    let score = tx * 2 + claims * 5;

    let fakeRank = data.length + Math.floor(Math.random() * 1000);

    showYourRank({
      wallet: input,
      tx,
      claims,
      score
    }, fakeRank, true);
  }
}

// 🔥 Connect Wallet
async function connectWallet() {
  if (!window.ethereum) {
    alert("Install MetaMask");
    return;
  }

  let acc = await window.ethereum.request({ method: "eth_requestAccounts" });
  let wallet = acc[0];

  document.getElementById("walletAddress").innerText =
    "Connected: " + wallet.slice(0,6) + "...";

  document.getElementById("walletInput").value = wallet;

  checkRank();
}

// 🚀 INIT
generateData();
renderStats();
renderTable();
