const web3 = require('@solana/web3.js');
const { Keypair, Connection, LAMPORTS_PER_SOL } = web3;

async function main() {
    const connection = new Connection(web3.clusterApiUrl('devnet'), 'confirmed');

    // Generate new keypairs
    const signer1 = Keypair.generate();
    const signer2 = Keypair.generate();

    // Function to airdrop SOL
    async function airdropSol(publicKey) {
        const airdropSignature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
        await connection.confirmTransaction(airdropSignature);
        console.log(`Airdropped 1 SOL to ${publicKey.toBase58()}`);
    }

    // Airdrop SOL to both signers
    await airdropSol(signer1.publicKey);
    await airdropSol(signer2.publicKey);
}

main();
