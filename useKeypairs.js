const fs = require('fs');
const { Keypair } = require('@solana/web3.js');

// Read the secret keys from files
const signer1Secret = JSON.parse(fs.readFileSync('signer1.json', 'utf8'));
const signer2Secret = JSON.parse(fs.readFileSync('signer2.json', 'utf8'));

// Reconstruct keypairs
const signer1 = Keypair.fromSecretKey(new Uint8Array(signer1Secret));
const signer2 = Keypair.fromSecretKey(new Uint8Array(signer2Secret));

console.log('Keypairs loaded: ');
console.log('Signer 1 Public Key:', signer1.publicKey.toBase58());
console.log('Signer 2 Public Key:', signer2.publicKey.toBase58());
