import {
  createNft,
  fetchDigitalAsset,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";

import {
  create,
  mplCore,
  createCollection,
} from "@metaplex-foundation/mpl-core";
import {
  createGenericFile,
  generateSigner,
  keypairIdentity,
  percentAmount,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { readFileSync } from "fs";
import path from "path";

const main = async () => {
  try {
    //
    // ** Setting Up Umi **
    //

    const umi = createUmi("https://api.devnet.solana.com").use(
      mplTokenMetadata()
    );

    // Set your wallet
    const walletFile = JSON.parse(readFileSync("wallets/devnet.json", "utf-8"));
    let keypair = umi.eddsa.createKeypairFromSecretKey(
      new Uint8Array(walletFile)
    );
    umi.use(keypairIdentity(keypair));

    const collection = generateSigner(umi);
    console.log("\nCollection Address: ", collection.publicKey.toString());

    const { signature, result } = await createCollection(umi, {
      collection,
      name: "My Collection",
      uri: "https://raw.githubusercontent.com/yamapyblack/solana-metaplex-nft-test/refs/heads/main/metadata/collection-metadata-test.json",
    }).sendAndConfirm(umi, { send: { commitment: "finalized" } });

    console.log("\nCollection Created: ", signature);
    console.log("\nCollection Result: ", result);

    return;

    // const mint = generateSigner(umi);
    // await createNft(umi, {
    //   mint,
    //   name: "My NFT",
    //   uri: "https://raw.githubusercontent.com/yamapyblack/solana-metaplex-nft-test/refs/heads/main/metadata/metadata-test.json",
    //   sellerFeeBasisPoints: percentAmount(5.5),
    //   collection:
    // }).sendAndConfirm(umi);
    // const asset = await fetchDigitalAsset(umi, mint.publicKey);
    // console.log(asset);
  } catch (error) {
    console.error("Error creating Collection:", error);
  }
};

main();
