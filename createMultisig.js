const web3 = require('@solana/web3.js');
const splToken = require('@solana/spl-token');

(async () => {
    // Connect to Solana devnet
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');

    // Generate a new wallet keypair
    const wallet = web3.Keypair.generate();

    // Airdrop SOL to the wallet to pay for transactions
    const airdropSignature = await connection.requestAirdrop(
        wallet.publicKey,
        web3.LAMPORTS_PER_SOL * 2 // Airdropping 2 SOL for example
    );
    await connection.confirmTransaction(airdropSignature);
    console.log('Airdrop completed!');

    // Define the public keys of the multisig participants
    const signer1 = web3.Keypair.generate();
    const signer2 = web3.Keypair.generate();
    const signer3 = web3.Keypair.generate();

    // Array of signer public keys and the number of required signers
    const m = 2; // Minimum number of signatures
    const signerPublicKeys = [
        signer1.publicKey,
        signer2.publicKey,
        signer3.publicKey
    ];

    // Create the multisig
    const multisig = await splToken.Token.createMultisig(
        connection,
        wallet,
        signerPublicKeys,
        m,
        wallet.publicKey
    );

    console.log(`Multisig wallet created at: ${multisig.toBase58()}`);
})();

