const fs = require('fs');
const web3 = require('@solana/web3.js');
const { Keypair, Connection, Transaction, LAMPORTS_PER_SOL, sendAndConfirmTransaction } = web3;

// Helper function to add a delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to check balance and conditionally airdrop SOL
async function checkAndAirdropIfNeeded(connection, publicKey, desiredAmount) {
    const balance = await connection.getBalance(publicKey);
    const balanceInSol = balance / LAMPORTS_PER_SOL;
    console.log(`Balance for ${publicKey.toBase58()}: ${balanceInSol} SOL`);

    if (balanceInSol < desiredAmount) {
        console.log(`Airdropping ${desiredAmount} SOL to ${publicKey.toBase58()}...`);
        try {
            const airdropSignature = await connection.requestAirdrop(publicKey, desiredAmount * LAMPORTS_PER_SOL);
            await connection.confirmTransaction(airdropSignature, 'confirmed');
            console.log(`Airdrop successful to ${publicKey.toBase58()}`);
        } catch (error) {
            console.error('Airdrop failed:', error);
            // Implement retry logic or further error handling here if necessary
            await delay(5000); // Wait for 5 seconds before retrying or proceeding
        }
    } else {
        console.log(`No airdrop needed for ${publicKey.toBase58()}.`);
    }
}

// Main function to orchestrate actions
async function main() {
    const connection = new Connection(web3.clusterApiUrl('devnet'), 'confirmed');

    // Load keypairs from files
    const signer1 = Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync('signer1.json', 'utf8'))));
    const signer2 = Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync('signer2.json', 'utf8'))));

    // Check balances and airdrop if necessary
    await checkAndAirdropIfNeeded(connection, signer1.publicKey, .01); // Airdropping .01 SOL if needed
    await delay(1000); // Delay to prevent rate limit issues
    await checkAndAirdropIfNeeded(connection, signer2.publicKey, .01); // Airdropping .01 SOL if needed

    // Fetch the recent blockhash
    const { blockhash } = await connection.getRecentBlockhash();

    // Create a transaction
    const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: signer1.publicKey,
    });

    transaction.add(
        web3.SystemProgram.transfer({
            fromPubkey: signer1.publicKey,
            toPubkey: signer2.publicKey,
            lamports: LAMPORTS_PER_SOL / .0001 // Transfer 0.0001 SOL
        })
    );

    // Sign the transaction with signer1
    transaction.sign(signer1);

    // Send and confirm transaction
    try {
        const signature = await sendAndConfirmTransaction(connection, transaction, [signer1]);
        console.log('Transaction confirmed with signature:', signature);
    } catch (error) {
        console.error('Error sending transaction:', error);
    }
}

main();
