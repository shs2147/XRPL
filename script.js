console.log("Script loaded!");
const xrpl = require("xrpl");

const Wallet = xrpl.Wallet;
const Client = xrpl.Client;
const NFTokenMintFlags = xrpl.NFTokenMintFlags;
const convertStringToHex = xrpl.convertStringToHex;

async function mintNFT(seed, url) {
  try {
    let wallet = Wallet.fromSeed(seed);
    let client = new Client("wss://s.altnet.rippletest.net/");

    await client.connect();

    let nftMint = {
      Account: wallet.classicAddress,
      NFTokenTaxon: 1,
      TransactionType: "NFTokenMint",
      URI: convertStringToHex(url),
      Flags: NFTokenMintFlags.tfTransferable,
    };

    let signedTrx = wallet.sign(nftMint);

    console.log(signedTrx);

    let submittedTrx = await client.submit(nftMint, {
      autofill: true,
      wallet: wallet,
    });

    console.log(submittedTrx);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const mintButton = document.getElementById("mintButton");

  mintButton.addEventListener("click", async () => {
    try {
      const seed = document.getElementById("seed").value;
      const url = document.getElementById("url").value;

      await mintNFT(seed, url);

      alert("NFT minting successful!");
    } catch (err) {
      console.error(err);
      alert("An error occurred while minting the NFT.");
    }
  });
});
