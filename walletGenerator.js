const keypairs = require("ripple-keypairs");

function generateXRPWallet() {
  const keyPair = keypairs.generateSeed();
  const publicKey = keypairs.deriveAddress(keyPair.seed);

  console.log("Generated XRP wallet:");
  console.log("Address (Public Key):", publicKey);
  console.log("Secret (Private Key):", keyPair.seed);
}

generateXRPWallet();
