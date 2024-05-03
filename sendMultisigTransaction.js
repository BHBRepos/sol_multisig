class MultisigWallet {
    constructor(publicKey, signers) {
        this.publicKey = publicKey;
        this.signers = signers;
    }

    static async create(connection, signers, filename) {
        try {
            const existingMultisig = loadKeypair(filename);
            console.log('Loaded existing multisig wallet:', existingMultisig.publicKey.toBase58());
            return new MultisigWallet(existingMultisig.publicKey, signers);
        } catch {
            const multisig = new Keypair();
            fs.writeFileSync(filename, JSON.stringify(Array.from(multisig.secretKey)));
            console.log('Created new multisig wallet:', multisig.publicKey.toBase58());
            return new MultisigWallet(multisig.publicKey, signers);
        }
    }

    async sendTransaction(connection, to, amount) {
        let transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: this.publicKey,
                toPubkey: to,
                lamports: amount
            })
        );

        transaction.setSigners(...this.signers.map(s => s.publicKey));

        // Ensure each signer signs the transaction
        this.signers.forEach(signer => {
            if (!transaction.signatures.find(sig => sig.publicKey.equals(signer.publicKey))) {
                transaction.partialSign(signer);
            }
        });

        console.log('Attempting to send transaction...');
        try {
            const signature = await sendAndConfirmTransaction(connection, transaction, this.signers);
            console.log(`Transaction successfully confirmed with signature: ${signature}`);
        } catch (error) {
            console.error('Error sending transaction:', error);
            return; // Return early to avoid misleading success message
        }
    }
}

async function main() {
    const signer1 = loadKeypair('signer1.json');
    const signer2 = loadKeypair('signer2.json');

    const multisigFilename = 'multisig.json';
    const multisigWallet = await MultisigWallet.create(connection, [signer1, signer2], multisigFilename);

    const recipient = new Keypair().publicKey;
    await multisigWallet.sendTransaction(connection, recipient, 1000);
}

const fs = require('fs');
const { Keypair } = require('@solana/web3.js');

/**
 * Loads a Keypair from a JSON file containing the secret key.
 * @param {string} filename - The filename of the JSON file with the secret key.
 * @returns {Keypair} The Keypair loaded from the secret key.
 */
function loadKeypair(filename) {
    const secretKeyString = fs.readFileSync(filename, { encoding: 'utf8' });
    const secretKeyUint8Array = new Uint8Array(JSON.parse(secretKeyString));
    return Keypair.fromSecretKey(secretKeyUint8Array);
}

async function main() {
    const signer1 = loadKeypair('signer1.json');
    const signer2 = loadKeypair('signer2.json');

    // Your code to use signer1 and signer2 follows here
    // For example, to send a transaction or initialize a multisig transaction

    console.log(`Signer 1 Public Key: ${signer1.publicKey.toBase58()}`);
    console.log(`Signer 2 Public Key: ${signer2.publicKey.toBase58()}`);
}

main();


main();
