const keypairs = require("ripple-keypairs");
const rippleBinaryCodec = require("ripple-binary-codec");

// Generate a new Testnet key pair
const keyPair = keypairs.deriveKeypair(keypairs.generateSeed());

// Convert the key pair to a Testnet address
const testnetAddress = keypairs.deriveAddress(keyPair.publicKey);

// Encode the secret key
const testnetSecret = rippleBinaryCodec.encodeForSigning({
  signingPublicKey: keyPair.publicKey,
  signature: keyPair.privateKey,
});

console.log("Testnet Address:", testnetAddress);
console.log("Testnet Secret:", testnetSecret);
