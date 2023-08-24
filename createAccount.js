const RippleAPI = require("ripple-lib").RippleAPI;

async function main() {
  const api = new RippleAPI({ server: "wss://s.altnet.rippletest.net:51233" });

  try {
    await api.connect();
    console.log("Connected to Testnet");

    const wallet = api.generateXAddress();
    console.log("Generated Testnet account:");
    console.log("Address:", wallet.address);
    console.log("Secret:", wallet.secret);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    api.disconnect();
  }
}

main();
