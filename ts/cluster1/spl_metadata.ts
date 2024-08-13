import wallet from "../wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import {
  createMetadataAccountV3,
  CreateMetadataAccountV3InstructionAccounts,
  CreateMetadataAccountV3InstructionArgs,
  DataV2Args,
  MPL_TOKEN_METADATA_PROGRAM_ID,
  findMetadataPda,
  createV1,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createSignerFromKeypair,
  signerIdentity,
  publicKey,
  generateSigner,
  createGenericFile,
} from "@metaplex-foundation/umi";
import { readFileSync } from "fs";
import path from "path";
import base58 from "bs58";

// Define our Mint address
const mint = publicKey("JB7qbxAWDmDkQUVBpL2ch3cqX3tfS6BSHYGaXiGahoLE");

// Create a UMI connection
const umi = createUmi("https://api.devnet.solana.com");
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));
umi.use(irysUploader());

const imageFile = readFileSync(path.join(__dirname, "..", "/assets/shrek.png"));

const umiImageFile = createGenericFile(imageFile, "jureg.png", {
  tags: [{ name: "Content-Type", value: "image/png" }],
});

(async () => {
  try {
    const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
      throw new Error(err);
    });
    const metadata = {
      name: "Jureg",
      symbol: "JUREG",
      description: "...jureg?",
      image: imageUri[0],
    };
    const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
      throw new Error(err);
    });
    // Start here
    const metadataPda = findMetadataPda(umi, { mint });
    let accounts: CreateMetadataAccountV3InstructionAccounts = {
      mint,
      mintAuthority: signer,
      metadata: metadataPda,
      payer: signer,
      updateAuthority: signer,
    };
    let data: DataV2Args = {
      collection: null,
      creators: null,
      name: "Jureg",
      sellerFeeBasisPoints: 0,
      symbol: "JUREG",
      uri: metadataUri,
      uses: null,
    };
    let args: CreateMetadataAccountV3InstructionArgs = {
      isMutable: true,
      data,
      collectionDetails: null,
    };
    let tx = createMetadataAccountV3(umi, {
      ...accounts,
      ...args,
    });
    let result = await tx.sendAndConfirm(umi);
    console.log(base58.encode(result.signature));
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
