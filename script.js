const RPC = "https://rpc.ritualfoundation.org";

// 🔥 detect wallet provider
function getProvider() {
  if (window.ethereum) return window.ethereum;

  alert("Wallet tidak ditemukan (MetaMask / OKX)");
  return null;
}

window.connectWallet = async function () {
  const provider = getProvider();
  if (!provider) return;

  try {
    // 🔥 connect wallet
    const accounts = await provider.request({
      method: "eth_requestAccounts"
    });

    const wallet = accounts[0];

    document.getElementById("wallet").innerText =
      wallet.slice(0,6) + "..." + wallet.slice(-4);

    // 🔥 coba RPC ritual
    let balance;

    try {
      const rpcProvider = new ethers.providers.JsonRpcProvider(RPC);
      balance = await rpcProvider.getBalance(wallet);
      document.getElementById("status").innerText = "Ritual RPC";
    } catch {
      // fallback ke wallet provider
      const web3 = new ethers.providers.Web3Provider(provider);
      balance = await web3.getBalance(wallet);
      document.getElementById("status").innerText = "Wallet RPC";
    }

    const eth = ethers.utils.formatEther(balance);

    document.getElementById("balance").innerText =
      parseFloat(eth).toFixed(4) + " RITUAL";

  } catch (err) {
    console.log("ERROR:", err);

    if (err.code === 4001) {
      alert("User reject connect");
    } else {
      alert("Wallet gagal connect (cek OKX / MetaMask)");
    }
  }
};
