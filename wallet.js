const { Wallet, Client } = require("xrpl");
const mysql = require("mysql");

const ECDSA = require("xrpl").ECDSA;

// MySQL database configuration
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "harsh",
  database: "wallet",
};

// Create a MySQL connection pool
const pool = mysql.createPool(dbConfig);

async function createWallet() {
  let newWallet = Wallet.generate(ECDSA.ed25519);

  console.log(newWallet);

  // Store the wallet information in the database
  const insertQuery =
    "INSERT INTO wallets (public_key, private_key) VALUES (?, ?)";
  const values = [newWallet.publicKey, newWallet.privateKey];

  pool.query(insertQuery, values, (error, results) => {
    if (error) {
      console.error("Error inserting wallet:", error);
    } else {
      console.log("Wallet inserted into the database:", results);
    }
  });
}

async function fundWallet() {
  let wallet = Wallet.fromSeed("sEdTkZy1C35mXyJAFaoQNnoQyieabbx");
  let client = new Client("wss://s.altnet.rippletest.net/");

  try {
    await client.connect();

    console.log("Are we connected? " + client.isConnected());

    let result = await client.fundWallet(wallet);

    console.log(result);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    client.disconnect();
  }
}

createWallet();
fundWallet();
