const xrpl = require("xrpl");

const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");

function multisigning() {
  client.connect().then(async () => {
    const wallet1 = await client.fundWallet();
    const wallet2 = await client.fundWallet();
    const walletMaster = await client.fundWallet();

    const signerListSet = {
      TransactionType: "SignerListSet",
      Account: walletMaster.wallet.classicAddress,
      SignerEntries: [
        {
          SignerEntry: {
            Account: wallet1.wallet.classicAddress,
            SignerWeight: 1,
          },
        },
        {
          SignerEntry: {
            Account: wallet2.wallet.classicAddress,
            SignerWeight: 1,
          },
        },
      ],
      SignerQuorum: 2,
    };

    const signerListResponse = await client.submit(signerListSet, {
      wallet: walletMaster.wallet,
    });
    console.log("SignerListSet constructed successfully:");
    console.log(signerListResponse);

    const accountSet = {
      TransactionType: "AccountSet",
      Account: walletMaster.wallet.classicAddress,
      Domain: xrpl.convertStringToHex("example.com"),
    };

    const accountSetTx = await client.autofill(accountSet, 2);
    console.log("AccountSet transaction is ready to be multisigned:");
    console.log(accountSetTx);

    const tx_blob1 = wallet1.wallet.sign(accountSetTx, true).tx_blob;
    const tx_blob2 = wallet2.wallet.sign(accountSetTx, true).tx_blob;

    const multisignedTx = xrpl.multisign([tx_blob1, tx_blob2]);

    const submitResponse = await client.submit(multisignedTx);

    if (submitResponse.result.engine_result === "tesSUCCESS") {
      console.log("The multisigned transaction was accepted by the ledger:");
      console.log(submitResponse);
      if (submitResponse.result.tx_json.Signers) {
        console.log(
          "The transaction had " +
            submitResponse.result.tx_json.Signers.length +
            " signatures"
        );
      }
    } else {
      console.log(
        "The multisigned transaction was rejected by rippled. Here's the response from rippled:"
      );
      console.log(submitResponse);
    }
    client.disconnect();
  });
}

multisigning();
