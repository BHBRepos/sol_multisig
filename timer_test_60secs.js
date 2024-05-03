const web3 = require('@solana/web3.js');
const fs = require('fs');

(async () => {
    try {
        const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
        const secretKey = JSON.parse(fs.readFileSync('/home/chris/solana-multisig/signer1.json', 'utf8'));
        const wallet = web3.Keypair.fromSecretKey(new Uint8Array(secretKey));
        
        const transaction = new web3.Transaction();
        const programId = new web3.PublicKey("EtRoRdVk8aHcEaM2tpjMBM4KKKhnBsfnRKajviewV7Lu");
        const instruction = new web3.TransactionInstruction({
            keys: [{pubkey: wallet.publicKey, isSigner: true, isWritable: true}],
            programId: programId,
            data: Buffer.from([1]), // Ensure this matches your contract's expected input
        });
        transaction.add(instruction);

        const signature = await web3.sendAndConfirmTransaction(connection, transaction, [wallet]);
        console.log('Transaction confirmed with signature:', signature);
    } catch (error) {
        console.error('Error:', error);
    }
})();
