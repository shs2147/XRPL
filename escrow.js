const RippleAPI = require("ripple-lib").RippleAPI;

const api = new RippleAPI({
  server: "wss://s1.ripple.com", // Use a valid XRPL server
});

const senderAddress = "rBvKpBadRpycZEVbYChqH1xsDGF6ioy5tK";
const senderSecret = "sEdSgcMnFzzZpX8abvPgWjEG11Bgv9H";
const recipientAddress = "ra5xPnDtMTJ9mvrVzHFdupNXzgw7vjyCf9";

const escrowAmount = "1000000"; // Amount in drops (1 XRP = 1,000,000 drops)

async function createEscrow() {
  await api.connect();

  // Generate a hash based on some condition (this is just an example)

  const prepared = await api.prepareEscrowCreation(senderAddress, {
    amount: escrowAmount,
    destination: recipientAddress,
  });

  const { signedTransaction } = api.sign(prepared.txJSON, senderSecret);

  const result = await api.submit(signedTransaction);
  console.log("Escrow creation result:", result);

  await api.disconnect();
}
createEscrow().catch(console.error);
