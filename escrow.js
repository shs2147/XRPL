const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,

  output: process.stdout,
});

if (typeof module !== "undefined") {
  var xrpl = require("xrpl");
}

const cc = require("five-bells-condition");

const crypto = require("crypto");

const { isNumber } = require("util");

const main = async () => {
  try {
    const preimageData = crypto.randomBytes(32);

    const myFulfillment = new cc.PreimageSha256();

    myFulfillment.setPreimage(preimageData);

    const conditionHex = myFulfillment
      .getConditionBinary()
      .toString("hex")
      .toUpperCase();

    rl.question("Enter your account seed value: ", async (seed) => {
      // Connect -------------------------------------------------------------------

      const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");

      await client.connect();

      // Prepare wallet to sign the transaction -------------------------------------

      const wallet = xrpl.Wallet.fromSeed(seed);

      console.log("Wallet Address: ", wallet.address);

      console.log("Seed: ", seed);

      // Set the escrow finish time --------------------------------------------------

      let finishAfter = new Date(new Date().getTime() / 1000 + 120); // 2 minutes from now

      finishAfter = new Date(finishAfter * 1000);

      console.log("This escrow will finish after: ", finishAfter);

      const escrowCreateTransaction = {
        TransactionType: "EscrowCreate",

        Account: wallet.address,

        Destination: wallet.address,

        Amount: "60", //drops XRP

        DestinationTag: 2023,

        Condition: conditionHex,

        Fee: "12",

        FinishAfter: xrpl.isoTimeToRippleTime(finishAfter.toISOString()),
      };

      xrpl.validate(escrowCreateTransaction);

      // Sign and submit the transaction --------------------------------------------

      console.log(
        "Signing and submitting the transaction:",
        JSON.stringify(escrowCreateTransaction, null, "\t"),
        "\n"
      );

      const response = await client.submitAndWait(escrowCreateTransaction, {
        wallet,
      });

      console.log(`Sequence number: ${response.result.Sequence}`);

      console.log(
        `Finished submitting! ${JSON.stringify(response.result, null, "\t")}`
      );

      await client.disconnect();

      rl.close(); // Close the readline interface when done
    });
  } catch (error) {
    console.log(error);
  }
};

main();
