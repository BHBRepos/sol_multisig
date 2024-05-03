const web3 = require('@solana/web3.js');
const fs = require('fs');
const { Keypair, Connection, Transaction, sendAndConfirmTransaction } = web3;

const connection = new Connection(web3.clusterApiUrl('devnet'), 'confirmed');
const programId = new web3.PublicKey('9KaExL5gFjLvE1Z4TRsYDLdguarb6geuo4MaQ6YLk5JB');

// Helper functions to manage keypairs
function loadKeypair(filename) {
    const secretKey = JSON.parse(fs.readFileSync(filename, 'utf8'));
    return Keypair.fromSecretKey(new Uint8Array(secretKey));
}

function saveKeypair(keypair, filename) {
    fs.writeFileSync(filename, JSON.stringify(Array.from(keypair.secretKey)));
}

// Class to manage multisig functionality
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
            // If no existing wallet, create a new one
            const multisig = new Keypair();
            saveKeypair(multisig, filename);
            console.log('Created new multisig wallet:', multisig.publicKey.toBase58());

            // Initialize the multisig wallet with the provided signers
            const instruction = new web3.TransactionInstruction({
                keys: [
                    { pubkey: multisig.publicKey, isSigner: false, isWritable: true },
                    ...signers.map(signer => ({ pubkey: signer.publicKey, isSigner: false, isWritable: false })),
                ],
                programId,
                data: Buffer.alloc(0),
            });
            const transaction = new web3.Transaction().add(instruction);
            await web3.sendAndConfirmTransaction(connection, transaction, [multisig]);

            return new MultisigWallet(multisig.publicKey, signers);
        }
    }

    async sendTransaction(connection, to, amount) {
        const instruction = new web3.TransactionInstruction({
            keys: [
                { pubkey: this.publicKey, isSigner: false, isWritable: true },
                { pubkey: to, isSigner: false, isWritable: true },
                ...this.signers.map(signer => ({ pubkey: signer.publicKey, isSigner: true, isWritable: false })),
            ],
            programId,
            data: Buffer.from([1, ...new BN(amount).toArray('le', 8)]),
        });
        const transaction = new web3.Transaction().add(instruction);

        // Partially sign the transaction with all signers
        this.signers.forEach(signer => {
            transaction.partialSign(signer);
        });

        console.log('Attempting to send transaction...');
        try {
            const signature = await sendAndConfirmTransaction(connection, transaction);
            console.log(`Transaction confirmed with signature: ${signature}`);
        } catch (error) {
            console.error('Error sending transaction:', error);
        }
    }
}

async function main() {
    const signer1 = loadKeypair('signer1.json');
    const signer2 = loadKeypair('signer2.json');
    const signer3 = loadKeypair('signer3.json');
    const signer4 = loadKeypair('signer4.json');

    const multisigFilename = 'multisig.json';
    const multisigWallet = await MultisigWallet.create(
        connection,
        [signer1, signer2, signer3, signer4],
        multisigFilename
    );

    const recipient = new Keypair().publicKey;
    await multisigWallet.sendTransaction(connection, recipient, web3.LAMPORTS_PER_SOL * 0.001);

    console.log('Multisig transaction has been sent!');
}

main();