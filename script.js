let data = [];

// ====== Generate Data ======
function generateData(n = 200) {
  data = [];
  for (let i = 0; i < n; i++) {
    const tx = Math.floor(Math.random() * 100) + 1;
    const score = tx * 2 + Math.floor(Math.random() * 50);
    data.push({
      wallet: "0x" + Math.random().toString(16).slice(2, 42),
      tx, score
    });
  }
  data.sort((a,b)=>b.score-a.score);
}

// ====== Helpers ======
const xpOf = s => s * 10;
function levelOf(xp){
  if (xp < 500) return "Newbie";
  if (xp < 1500) return "Explorer";
  return "Ritual Elite";
}
function statusOf(score){
  if (score > 200) return "whale";
  if (score > 120) return "active";
  return "norm";
}
function short(w){ return w.slice(0,6)+"..."+w.slice(-4); }

// ====== Render Stats ======
function renderStats(){
  document.getElementById("participants").innerText = (data.length*10) + "+";
  const totalTx = data.reduce((a,b)=>a+b.tx,0);
  document.getElementById("totalTx").innerText = totalTx.toLocaleString();
  document.getElementById("whales").innerText = data.filter(d=>d.score>200).length;
  document.getElementById("active").innerText = data.filter(d=>d.score>120).length;
}

// ====== Render Table ======
function renderTable(list = data){
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";
  list.forEach((d,i)=>{
    const xp = xpOf(d.score);
    const lvl = levelOf(xp);
    const st = statusOf(d.score);

    tbody.innerHTML += `
      <tr>
        <td>#${i+1}</td>
        <td>
          <a class="wallet-link" href="https://etherscan.io/address/${d.wallet}" target="_blank">
            ${short(d.wallet)}
          </a>
        </td>
        <td>${d.score}</td>
        <td>${xp}</td>
        <td>${lvl}</td>
        <td><span class="badge ${st}">${st.toUpperCase()}</span></td>
      </tr>
    `;
  });
}

// ====== Search ======
function searchWallet(){
  const q = document.getElementById("search").value.toLowerCase();
  if(!q) return renderTable();
  const filtered = data.filter(d => d.wallet.toLowerCase().includes(q));
  renderTable(filtered);
}

// ====== Your Rank ======
function showYourRank({wallet, score, rank, isNew}){
  const xp = xpOf(score);
  const lvl = levelOf(xp);
  const el = document.getElementById("yr-result");

  el.innerHTML = `
    <div>${short(wallet)}</div>
    <div class="rank-big">#${rank}</div>
    <div>Score: ${score} • XP: ${xp} • Level: ${lvl}</div>
    ${isNew ? `<div class="muted">New Participant 🚀</div>` : ``}
  `;
}

function checkRank(){
  const input = document.getElementById("walletInput").value.trim().toLowerCase();
  if(!input){
    document.getElementById("yr-result").innerHTML = `<div class="muted">Enter wallet first</div>`;
    return;
  }
  const idx = data.findIndex(d=>d.wallet.toLowerCase()===input);
  if(idx !== -1){
    showYourRank({ wallet: data[idx].wallet, score: data[idx].score, rank: idx+1, isNew:false });
  } else {
    const tx = Math.floor(Math.random()*5)+1;
    const score = tx*2 + Math.floor(Math.random()*10);
    const fakeRank = data.length + Math.floor(Math.random()*1000);
    showYourRank({ wallet: input, score, rank: fakeRank, isNew:true });
  }
}

// ====== Connect Wallet ======
async function connectWallet(){
  if (typeof window.ethereum === "undefined") {
    alert("Install MetaMask dulu");
    return;
  }
  try{
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const w = accounts[0];
    document.getElementById("walletAddress").innerText = "Connected: " + short(w);
    document.getElementById("walletInput").value = w;
    checkRank();
  }catch(e){ console.log(e); }
}

// ====== INIT ======
generateData(200);
renderStats();
renderTable();
