const fs = require('fs');
const { Keypair } = require('@solana/web3.js');

// Generate new keypairs
const signer1 = Keypair.generate();
const signer2 = Keypair.generate();

// Save the secret keys to files
fs.writeFileSync('signer1.json', JSON.stringify(Array.from(signer1.secretKey)));
fs.writeFileSync('signer2.json', JSON.stringify(Array.from(signer2.secretKey)));

console.log('Keypairs generated and saved.');
