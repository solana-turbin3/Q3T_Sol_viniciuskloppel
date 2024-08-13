import {
  Commitment,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import wallet from "../wba-wallet.json";
import {
  getOrCreateAssociatedTokenAccount,
  transfer,
  getMint,
} from "@solana/spl-token";

import env from "~/env";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey(env.MINT_ADDRESS);

// Recipient address
const to = new PublicKey(env.RECIPIENT_WALLET);

(async () => {
  try {
    const mintInfo = await getMint(connection, mint);
    // Get the token account of the fromWallet address, and if it does not exist, create it
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey
    );

    // Get the token account of the toWallet address, and if it does not exist, create it
    const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      to
    );

    // Transfer the new token to the "toTokenAccount" we just created
    const txId = await transfer(
      connection,
      keypair,
      fromTokenAccount.address,
      recipientTokenAccount.address,
      keypair.publicKey,
      10 * 10 ** mintInfo.decimals
    );

    console.log(`Success! Transaction Id: ${txId}`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
