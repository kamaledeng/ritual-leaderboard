let data = [];

// 🔥 generate data
function generateData() {
  data = [];

  for (let i = 0; i < 200; i++) {
    let tx = Math.floor(Math.random() * 100) + 1;
    let score = tx * 2 + Math.floor(Math.random() * 50);

    data.push({
      wallet: "0x" + Math.random().toString(16).substr(2, 40),
      score: score
    });
  }

  data.sort((a, b) => b.score - a.score);
}

// 🔥 render table
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

  document.getElementById("participants").innerText =
    (data.length * 10) + "+";
}

// 🔥 level system
function getLevel(xp) {
  if (xp < 500) return "Newbie";
  if (xp < 1500) return "Explorer";
  return "Ritual Elite";
}

// 🔥 check rank (ALWAYS WORK)
function checkRank() {
  let input = document.getElementById("walletInput").value.trim().toLowerCase();

  if (!input) {
    document.getElementById("result").innerHTML =
      "<span style='color:red'>Masukkan wallet dulu</span>";
    return;
  }

  let foundIndex = data.findIndex(
    d => d.wallet.toLowerCase() === input
  );

  if (foundIndex !== -1) {
    let user = data[foundIndex];
    let xp = user.score * 10;
    let level = getLevel(xp);

    document.getElementById("result").innerHTML = `
      <div style="margin-top:15px">
        <h2 style="color:#4da3ff">#${foundIndex + 1}</h2>
        <p><b>Score:</b> ${user.score}</p>
        <p><b>XP:</b> ${xp}</p>
        <p><b>Level:</b> ${level}</p>
      </div>
    `;
  } else {
    let tx = Math.floor(Math.random() * 5) + 1;
    let score = tx * 2 + Math.floor(Math.random() * 10);
    let xp = score * 10;
    let level = getLevel(xp);

    let fakeRank = data.length + Math.floor(Math.random() * 1000);

    document.getElementById("result").innerHTML = `
      <div style="margin-top:15px">
        <h2 style="color:#f59e0b">#${fakeRank}</h2>
        <p><b>Score:</b> ${score}</p>
        <p><b>XP:</b> ${xp}</p>
        <p><b>Level:</b> ${level}</p>
        <p style="color:#f59e0b"><b>New Participant 🚀</b></p>
      </div>
    `;
  }
}

// 🚀 INIT (INI YANG TADI ERROR)
generateData();
renderTable();
