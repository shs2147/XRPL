if (typeof module !== "undefined") {
  var xrpl = require("xrpl");
}

const wallet = xrpl.Wallet.fromSeed("sn3nxiW7v8KXzPzAqzyHXbSSKNuN9");

async function main() {
  const client = new xrpl.Client("wss://s.devnet.rippletest.net:51233");
  await client.connect();

  console.log("Getting a wallet from the faucet...");
  const { wallet, balance } = await client.fundWallet();

  const account_info = await client.request({
    command: "account_info",
    account: wallet.address,
  });
  let current_sequence = account_info.result.account_data.Sequence;

  const prepared = await client.autofill({
    TransactionType: "TicketCreate",
    Account: wallet.address,
    TicketCount: 10,
    Sequence: current_sequence,
  });
  const signed = wallet.sign(prepared);
  console.log(`Prepared TicketCreate transaction ${signed.hash}`);

  // Submit TicketCreate -------------------------------------------------------
  const tx = await client.submitAndWait(signed.tx_blob);
  console.log(tx);

  let response = await client.request({
    command: "account_objects",
    account: wallet.address,
    type: "ticket",
  });
  console.log("Available Tickets:", response.result.account_objects);

  use_ticket = response.result.account_objects[0].TicketSequence;

  const prepared_t = await client.autofill({
    TransactionType: "AccountSet",
    Account: wallet.address,
    TicketSequence: use_ticket,
    LastLedgerSequence: null,
    Sequence: 0,
  });
  const signed_t = wallet.sign(prepared_t);
  console.log(`Prepared ticketed transaction ${signed_t.hash}`);

  const tx_t = await client.submitAndWait(signed_t.tx_blob);
  console.log(tx_t);

  client.disconnect();
}

main();
