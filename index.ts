import {
  createNft,
  fetchDigitalAsset,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";

import {
  generateSigner,
  keypairIdentity,
  percentAmount,
  publicKey,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { readFileSync } from "fs";

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
    console.log("mint Address: ", mint.publicKey.toString());

    await createNft(umi, {
      mint,
      name: "My NFT",
      uri: "https://raw.githubusercontent.com/yamapyblack/solana-metaplex-nft-test/refs/heads/main/metadata/metadata-test.json",
      sellerFeeBasisPoints: percentAmount(5.5),
      collection: {
        key: publicKey("A6FDytKLtqpLmQgyGooKcMeDznyqD3gtD4NcezBowP2V"),
        verified: false,
      },
    }).sendAndConfirm(umi);
    const asset = await fetchDigitalAsset(umi, mint.publicKey);
    console.log(asset);
  } catch (error) {
    console.error("Error creating NFT:", error);
  }
};

main();
