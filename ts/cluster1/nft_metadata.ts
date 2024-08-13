import {
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { readFile } from "~/utils/umi";
import wallet from "../wba-wallet.json";

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
  try {
    const imageFile = readFile("../assets/rug.png");

    const imageUri = (await umi.uploader.upload([imageFile]))[0];

    const metadata = {
      name: "Vini's Rug",
      symbol: "RUG",
      description: "This rug is gonna rug you.",
      image: imageUri,
      attributes: [
        { trait_type: "Background", value: "Bright gray" },
        { trait_type: "Color", value: "Blue" },
        { trait_type: "Details", value: "Light blue" },
      ],
      properties: {
        files: [
          {
            type: imageFile.contentType,
            uri: imageUri,
          },
        ],
        category: "image",
      },
      creators: [],
    };
    const metadataUri = await umi.uploader.uploadJson(metadata);

    console.log("Your image URI: ", imageUri);
    console.log("Your metadata URI: ", metadataUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
