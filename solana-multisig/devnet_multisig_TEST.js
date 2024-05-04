const web3 = require('@solana/web3.js');
const fs = require('fs');

// Function to load signers from their secret key files
function loadSigners() {
    const signerFiles = [
        '/home/chris/solana-multisig/signer1.json',
        '/home/chris/solana-multisig/signer2.json',
        '/home/chris/solana-multisig/signer3.json',
        '/home/chris/solana-multisig/signer4.json'
    ];

    const signers = signerFiles.map(file => {
        const fileContent = fs.readFileSync(file, { encoding: 'utf8' });
        const secretKey = JSON.parse(fileContent);
        return web3.Keypair.fromSecretKey(new Uint8Array(secretKey));
    });

    console.log("Signers' Public Keys:");
    signers.forEach(signer => console.log(signer.publicKey.toString()));
    return signers;
}

// Main function to send a transaction
async function sendTransaction(amount) {
    console.log("Attempting to send transaction...");
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
    const signers = loadSigners();

    try {
        const transaction = new web3.Transaction();
        const lamports = amount * web3.LAMPORTS_PER_SOL;

        console.log("Public Keys of Signers:");
        signers.forEach(signer => {
            console.log(signer.publicKey.toString());
        });

        transaction.add(
            web3.SystemProgram.transfer({
                fromPubkey: signers[0].publicKey,
                toPubkey: signers[1].publicKey,
                lamports,
            })
        );

        console.log("Transaction Instructions:", transaction.instructions.map(instr => instr.programId.toString()));

        transaction.sign(...signers);

        const signature = await web3.sendAndConfirmTransaction(connection, transaction, signers);
        console.log('Transaction signature:', signature);
        console.log("Multisig transaction has been sent!");
    } catch (error) {
        console.error("Error sending transaction:", error);
    }
}

async function promptAmount() {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        readline.question('Enter the amount of SOL to transfer: ', (amount) => {
            readline.close();
            resolve(parseFloat(amount));
        });
    });
}

async function main() {
    const amount = await promptAmount();
    await sendTransaction(amount);
}

main();

// This script demonstrates sending a multisig transaction on the Solana devnet.
// It loads the signer keypairs from JSON files and prompts the user to enter the amount of SOL to transfer.
// The script then constructs a transaction to transfer the specified amount from one signer to another.
// The transaction is signed by all signers and sent to the Solana devnet for confirmation.
// The script handles any errors that may occur during the transaction process.
