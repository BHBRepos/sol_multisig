const fs = require('fs');
const web3 = require('@solana/web3.js');
const { Keypair, Connection, LAMPORTS_PER_SOL } = web3;

async function checkAndAirdropIfNeeded(walletPath) {
    const connection = new Connection(web3.clusterApiUrl('devnet'), 'confirmed');
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
    await checkAndAirdropIfNeeded('signer1.json');
    await checkAndAirdropIfNeeded('signer2.json');
    await checkAndAirdropIfNeeded('signer3.json');
    await checkAndAirdropIfNeeded('signer4.json');
}

main();

//Here’s a unified Node.js script that checks balances and requests airdrops for all four wallets. 
//This approach avoids redundancy and makes it easier to manage wallet readiness for your multisig operations.