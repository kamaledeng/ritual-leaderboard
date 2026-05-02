const RPC = "https://rpc.ritualfoundation.org";
const provider = new ethers.providers.JsonRpcProvider(RPC);

let leaderboard = [];
let userAddress = null;

// CONNECT PALING BASIC (ANTI GAGAL)
async function connectWallet() {
  try {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask tidak terdeteksi");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    userAddress = accounts[0];
    document.getElementById("user").innerHTML =
      "Connected: " + userAddress;

  } catch (err) {
    console.error(err);
    alert("User cancel / error");
  }
}
