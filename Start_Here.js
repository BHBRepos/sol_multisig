const fs = require('fs');
const web3 = require('@solana/web3.js');
const { Keypair, Connection, LAMPORTS_PER_SOL } = web3;

async function checkAndAirdropIfNeeded(connection, walletPath) {
    const secretKey = JSON.parse(fs.readFileSync(walletPath, 'utf8'));
    const signer = Keypair.fromSecretKey(new Uint8Array(secretKey));
    
    let balance = await connection.getBalance(signer.publicKey);
    console.log(`Current balance for ${walletPath}: ${balance / LAMPORTS_PER_SOL} SOL`);

    if (balance / LAMPORTS_PER_SOL < 0.1) {
        const neededSol = (0.1 * LAMPORTS_PER_SOL) - balance;
        console.log(`Balance under 0.1 SOL, requesting airdrop of ${neededSol / LAMPORTS_PER_SOL} SOL...`);
        await connection.requestAirdrop(signer.publicKey, neededSol);
        await connection.confirmTransaction(await connection.requestAirdrop(signer.publicKey, neededSol));
        console.log(`Airdrop completed for ${walletPath}.`);
    }
}

async function main() {
    const connection = new Connection(web3.clusterApiUrl('devnet'), 'confirmed');
    const walletPaths = ['signer1.json', 'signer2.json', 'signer3.json', 'signer4.json'];

    for (const walletPath of walletPaths) {
        await checkAndAirdropIfNeeded(connection, walletPath);
    }
}

main();

// This script checks the balance of each signer wallet and requests an airdrop if the balance is below 0.1 SOL.
// It ensures that all signer wallets have sufficient funds for testing purposes.
// The script iterates through the wallet paths and calls the `checkAndAirdropIfNeeded` function for each wallet.
// If the balance is below the threshold, it requests an airdrop to top up the wallet.