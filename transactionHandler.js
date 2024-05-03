const { Connection, Transaction, SystemProgram } = require('@solana/web3.js');
const { loadKeypair } = require('./keyManagement');

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

async function sendMultisigTransaction() {
    const signer1 = loadKeypair('signer1.json'); // Presumably the fee payer
    const signer2 = loadKeypair('signer2.json'); // Another necessary signer

    const { blockhash } = await connection.getRecentBlockhash('confirmed');
    const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: signer1.publicKey, // Specify the fee payer explicitly
    }).add(
        SystemProgram.transfer({
            fromPubkey: signer1.publicKey,
            toPubkey: signer2.publicKey,
            lamports: 100,
        })
    );

    // Sign the transaction with the necessary signers
    transaction.sign(signer1); // Assume signer1 is the fee payer and required signer

    try {
        const signature = await connection.sendTransaction(transaction, [signer1], {
            skipPreflight: false,
            preflightCommitment: 'confirmed'
        });
        console.log('Transaction signature:', signature);
        await connection.confirmTransaction(signature, 'confirmed');
        console.log('Transaction confirmed');
    } catch (error) {
        console.error('Error sending transaction:', error);
    }
}

module.exports = { sendMultisigTransaction };

//Purpose - - Loaded Keypairs: The script loaded two keypairs from files (signer1.json and signer2.json), which are used as signers for the transaction.
//Created a Transaction: A Solana transaction was created involving a transfer of lamports (the smallest unit of the SOL cryptocurrency) from one account (signer1) to another (signer2).
//Signed the Transaction: The transaction was signed by the necessary parties. In this context, assuming signer1 is the fee payer, only signer1's signature might have been required if signer1 was also the source of the funds.
//Sent the Transaction: The signed transaction was sent to the Solana blockchain network (specifically, the Devnet for testing).
//Confirmed the Transaction: The transaction was confirmed by the network, ensuring that it was processed and recorded on the blockchain.
//Output the Transaction Signature: The script printed the transaction signature, which is a unique identifier for the transaction on the blockchain.

