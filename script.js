const RPC = "https://rpc.ritualfoundation.org";

let data = [];

// ===== INIT =====
function init() {
  const saved = localStorage.getItem("ritualData");

  if (saved) {
    data = JSON.parse(saved);
  } else {
    generateData();
    save();
  }

  render();
}

// ===== SAVE =====
function save() {
  localStorage.setItem("ritualData", JSON.stringify(data));
}

// ===== GENERATE =====
function generateData() {
  for (let i = 0; i < 100; i++) {
    let tx = Math.floor(Math.random() * 50);
    let claims = Math.floor(Math.random() * 5);
    let score = tx * 2 + claims * 5;

    data.push({
      wallet: "0x" + Math.random().toString(16).slice(2, 42),
      tx,
      claims,
      score
    });
  }
}

// ===== RENDER =====
function render() {
  let tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  data.sort((a,b)=>b.score-a.score);

  data.forEach((d,i)=>{
    tbody.innerHTML += `
      <tr>
        <td>#${i+1}</td>
        <td>${d.wallet.slice(0,6)}...</td>
        <td>${d.score}</td>
        <td>${d.tx}</td>
        <td>${d.claims}</td>
      </tr>
    `;
  });

  document.getElementById("participants").innerText = data.length;
}

// ===== CONNECT WALLET (FINAL FIX) =====
window.connectWallet = async function () {
  if (!window.ethereum) {
    alert("Install MetaMask dulu");
    return;
  }

  try {
    const chainId = "0x7BB";

    await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const currentChain = await window.ethereum.request({
      method: "eth_chainId",
    });

    if (currentChain !== chainId) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId }],
        });
      } catch (err) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: chainId,
            chainName: "Ritual Testnet",
            rpcUrls: ["https://rpc.ritualfoundation.org"],
            nativeCurrency: {
              name: "RITUAL",
              symbol: "RITUAL",
              decimals: 18
            }
          }]
        });
      }
    }

    const wallet = (await window.ethereum.request({
      method: "eth_accounts",
    }))[0];

    document.getElementById("walletAddress").innerText =
      "Connected: " + wallet.slice(0,6) + "...";

    document.getElementById("walletInput").value = wallet;

    checkRank();

  } catch (err) {
    console.log(err);
    alert("Gagal connect wallet");
  }
};

// ===== CHECK RANK =====
function checkRank() {
  let w = document.getElementById("walletInput").value.toLowerCase();

  let i = data.findIndex(x=>x.wallet.toLowerCase()==w);

  if (i !== -1) {
    show(data[i], i+1);
  } else {
    let newUser = {
      wallet: w,
      tx: 5,
      claims: 1,
      score: 15
    };

    data.push(newUser);
    save();
    render();

    let idx = data.findIndex(x=>x.wallet==w);
    show(newUser, idx+1);
  }
}

// ===== SHOW =====
function show(u, rank) {
  document.getElementById("result").innerHTML = `
    <h2>${u.wallet.slice(0,6)}...</h2>
    <h1>#${rank}</h1>
    <p>Score: ${u.score}</p>
  `;
}

// START
init();
