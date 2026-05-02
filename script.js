const RPC = "https://rpc.ritualfoundation.org";

let data = [];
let faucetPool = 100000;

// ===== INIT =====
function init() {
  let saved = localStorage.getItem("ritualData");

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
        <td><a href="https://etherscan.io/address/${d.wallet}" target="_blank">${d.wallet.slice(0,6)}...</a></td>
        <td>${d.score}</td>
        <td>${d.tx}</td>
        <td>${d.claims}</td>
      </tr>
    `;
  });

  // stats
  document.getElementById("participants").innerText = data.length;
  document.getElementById("totalTx").innerText =
    data.reduce((a,b)=>a+b.tx,0);

  let totalClaims = data.reduce((a,b)=>a+b.claims,0);

  document.getElementById("claims").innerText = totalClaims;
  document.getElementById("faucet").innerText = faucetPool - totalClaims*10;
}

// ===== CONNECT WALLET (REAL) =====
async function connectWallet() {
  if (!window.ethereum) {
    alert("Install MetaMask");
    return;
  }

  await window.ethereum.request({ method: "eth_requestAccounts" });

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const wallet = await signer.getAddress();

  document.getElementById("walletAddress").innerText =
    "Connected: " + wallet;

  document.getElementById("walletInput").value = wallet;

  // ===== REAL BALANCE FROM RITUAL RPC =====
  const rpc = new ethers.providers.JsonRpcProvider(RPC);

  const balance = await rpc.getBalance(wallet);
  const eth = ethers.utils.formatEther(balance);

  document.getElementById("result").innerHTML = `
    <h2>${wallet.slice(0,6)}...</h2>
    <h1>${parseFloat(eth).toFixed(4)} RITUAL</h1>
    <p>Real Balance (RPC)</p>
  `;
}

// ===== CHECK RANK (STABLE) =====
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
    <p>Tx: ${u.tx} | Claims: ${u.claims}</p>
  `;
}

// START
init();
