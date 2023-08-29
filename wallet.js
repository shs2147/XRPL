const { Wallet } = require("xrpl");

const ECDSA = require("xrpl/dist/npm/ECDSA");

async function createWallet() {
  let newWallet = Wallet.generate(ECDSA.ed25519);

  console.log(newWallet);
}

createWallet();
