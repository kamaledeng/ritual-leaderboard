let data = [];

function generateData() {
  for (let i = 0; i < 200; i++) {
    let score = Math.floor(Math.random() * 300);
    data.push({
      wallet: "0x" + Math.random().toString(16).substr(2, 10),
      score: score
    });
  }

  data.sort((a, b) => b.score - a.score);
}

function renderTable() {
  let table = document.getElementById("tableBody");
  table.innerHTML = "";

  data.forEach((item, index) => {
    table.innerHTML += `
      <tr>
        <td>#${index + 1}</td>
        <td>${item.wallet}</td>
        <td>${item.score}</td>
      </tr>
    `;
  });

  document.getElementById("participants").innerText = data.length * 10 + "+";
}

function checkRank() {
  let input = document.getElementById("walletInput").value;
  let found = data.findIndex(d => d.wallet === input);

  if (found !== -1) {
    document.getElementById("result").innerText = "Rank: #" + (found + 1);
  } else {
    document.getElementById("result").innerText = "New Participant";
  }
}

generateData();
renderTable();