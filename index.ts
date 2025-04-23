import {
  createNft,
  fetchDigitalAsset,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";

import { create, mplCore } from "@metaplex-foundation/mpl-core";
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

    const mint = generateSigner(umi);
    await createNft(umi, {
      mint,
      name: "My NFT",
      uri: "https://raw.githubusercontent.com/yamapyblack/solana-metaplex-nft-test/refs/heads/main/metadata/metadata-test.json",
      sellerFeeBasisPoints: percentAmount(5.5),
    }).sendAndConfirm(umi);
    const asset = await fetchDigitalAsset(umi, mint.publicKey);
    console.log(asset);
  } catch (error) {
    console.error("Error creating NFT:", error);
  }
};

main();
