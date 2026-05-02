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

  // 🔹 Kalau wallet ADA di leaderboard
  if (foundIndex !== -1) {
    let user = data[foundIndex];

    let xp = user.score * 10;
    let level = getLevel(xp);

    document.getElementById("result").innerHTML = `
      <div style="margin-top:15px">
        <h2 style="color:#4da3ff">#${foundIndex + 1}</h2>
        <p><b>Wallet:</b> ${user.wallet}</p>
        <p><b>Score:</b> ${user.score}</p>
        <p><b>XP:</b> ${xp}</p>
        <p><b>Level:</b> ${level}</p>
      </div>
    `;
  }

  // 🔹 Kalau wallet TIDAK ADA
  else {
    let tx = Math.floor(Math.random() * 5) + 1;
    let score = tx * 2 + Math.floor(Math.random() * 10);
    let xp = score * 10;
    let level = getLevel(xp);

    let fakeRank = data.length + Math.floor(Math.random() * 1000);

    document.getElementById("result").innerHTML = `
      <div style="margin-top:15px">
        <h2 style="color:#f59e0b">#${fakeRank}</h2>
        <p><b>Wallet:</b> ${input}</p>
        <p><b>Score:</b> ${score}</p>
        <p><b>XP:</b> ${xp}</p>
        <p><b>Level:</b> ${level}</p>
        <p style="color:#f59e0b"><b>New Participant 🚀</b></p>
      </div>
    `;
  }
}
