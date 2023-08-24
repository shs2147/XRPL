const xrpl = require("xrpl");

async function main() {
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
  await client.connect();
  if (client.isConnected()) {
    console.log("Connected to XRPL server");
  } else {
    console.log("Not connected to XRPL server");
  }
  client.disconnect();
}

main();
