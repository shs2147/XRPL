if (typeof module !== "undefined") {
  var xrpl = require("xrpl");
}
async function main() {
  console.log("Connecting to Mainnet...");
  const client = new xrpl.Client("wss://s1.ripple.com");
  await client.connect();

  const my_address = "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn";
  const counterparty_address = "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v";
  const frozen_currency = "USD";

  const account_lines = {
    command: "account_lines",
    account: my_address,
    peer: counterparty_address,
  };

  console.log(`Looking up all trust lines from
                ${counterparty_address} to ${my_address}`);

  const data = await client.request(account_lines);
  let trustline = null;
  for (let i = 0; i < data.result.lines.length; i++) {
    if (data.result.lines[i].currency === frozen_currency) {
      trustline = data.result.lines[i];
      break;
    }
  }
  if (trustline === null) {
    throw `There was no ${frozen_currency} trust line`;
  }
  console.log("Trust line frozen from our side?", trustline.freeze === true);
  console.log(
    "Trust line frozen from counterparty's side?",
    trustline.freeze_peer === true
  );
  await client.disconnect();
}
main().catch(console.error);
