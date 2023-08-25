const { Wallet, Client } = require("xrpl");
async function fundWallet() {
  let wallet = Wallet.fromSeed("sEdTkZy1C35mXyJAFaoQNnoQyieabbx");

  let client = new Client("wss://s.altnet.rippletest.net/");

  await client.connect();

  console.log("are we connected? " + client.isConnected());

  let result = await client.fundWallet(wallet);

  console.log(result);
}
fundWallet();
