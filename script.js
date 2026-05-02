window.connectWallet = async function () {
  if (!window.ethereum) {
    alert("MetaMask belum install");
    return;
  }

  try {
    // connect wallet
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const wallet = accounts[0];

    // tampilkan wallet
    document.getElementById("walletAddress").innerText =
      "Connected: " + wallet.slice(0,6) + "...";

    document.getElementById("walletInput").value = wallet;

    checkRank();

  } catch (err) {
    console.log("ERROR DETAIL:", err);
    alert("Gagal connect wallet");
  }
};
