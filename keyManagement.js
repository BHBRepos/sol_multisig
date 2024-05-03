const fs = require('fs');
const { Keypair } = require('@solana/web3.js');

function loadKeypair(filename) {
    const secretKey = JSON.parse(fs.readFileSync(filename, 'utf8'));
    return Keypair.fromSecretKey(new Uint8Array(secretKey));
}

module.exports = { loadKeypair };
