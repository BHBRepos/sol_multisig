const { Connection, Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');
const { Keypair } = require('@solana/web3.js');

async function sendMultisigTransaction(connection, signers, transaction) {
    // Sign the transaction with each signer
    signers.forEach(signer => transaction.partialSign(signer));

    // Send and confirm transaction
    const signature = await sendAndConfirmTransaction(connection, transaction, signers);
    console.log('Transaction confirmed with signature:', signature);
}

// Usage
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
const transaction = new Transaction();
// Add instructions to the transaction here
sendMultisigTransaction(connection, [signer1, signer2], transaction);
