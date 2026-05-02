const RPC = "https://rpc.ritualfoundation.org";

window.connectWallet = async function () {
  if (!window.ethereum) {
    alert("Install MetaMask dulu");
    return;
  }

  try {
    // 🔥 connect wallet
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    const wallet = accounts[0];

    document.getElementById("wallet").innerText = wallet;

    // 🔥 pakai provider dari wallet (AMAN)
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);

    let balance;

    try {
      // 🔥 coba ambil dari RPC Ritual
      const rpcProvider = new ethers.providers.JsonRpcProvider(RPC);
      balance = await rpcProvider.getBalance(wallet);
      document.getElementById("status").innerText = "RPC: Ritual (LIVE)";
    } catch (err) {
      // 🔥 fallback kalau RPC error
      balance = await web3Provider.getBalance(wallet);
      document.getElementById("status").innerText = "RPC error → fallback wallet";
    }

    const eth = ethers.utils.formatEther(balance);

    document.getElementById("balance").innerText =
      parseFloat(eth).toFixed(4) + " RITUAL";

  } catch (err) {
    console.log(err);
    alert("Connect gagal (cek MetaMask)");
  }
};
