const RippleAPI = require("ripple-lib").RippleAPI;

const serverURL = "wss://s.altnet.rippletest.net:51233";
const secretKey =
  "ED723278D5FC1837F5860B6DCF0139F610A2F185117C59611AE6E167014DDE2B48";
const destinationAccount = "rakEFfs2tXyHRe1pYVxqEW1j8b6KTHmDyf";

const api = new RippleAPI({ server: serverURL });

async function main() {
  try {
    await api.connect();

    // Unlock the source account with the secret key
    api.on("connected", async () => {
      console.log("Connected to XRPL");
      const sourceAddress = api.deriveAddress(secretKey);
      const sourceAccountInfo = await api.getAccountInfo(sourceAddress);
      console.log(sourceAccountInfo);
      const transaction = {
        TransactionType: "SetRegularKey",
        Account: sourceAddress,
        RegularKey: destinationAccount,
        Fee: "12", // Adjust the fee as needed
        Flags: 8, // Set the frozen flag
      };

      const prepared = await api.prepareTransaction(transaction);
      const signed = api.sign(prepared.txJSON, secretKey);

      console.log("Submitting transaction...");
      const response = await api.submit(signed.signedTransaction);
      console.log("Transaction response:", response);

      await api.disconnect();
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
