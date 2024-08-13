import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import wallet from "../wba-wallet.json";
import chalk from "chalk";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000;

// Mint address
const mint = new PublicKey("JB7qbxAWDmDkQUVBpL2ch3cqX3tfS6BSHYGaXiGahoLE");

(async () => {
  try {
    // Create an ATA
    const ata = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey
    );
    console.log(
      `Your associated token account is: ${chalk.green(ata.address.toBase58())}`
    );

    // Mint to ATA

    const mintTx = await mintTo(
      connection,
      keypair,
      mint,
      ata.address,
      keypair.publicKey,
      100 * token_decimals
    );
    console.log(`Your mint tx id: ${chalk.green(mintTx)}`);
  } catch (error) {
    console.log(`Oops, something went wrong: ${error}`);
  }
})();
