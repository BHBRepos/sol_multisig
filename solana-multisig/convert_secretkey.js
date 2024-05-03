const bs58 = require('bs58');

const secretKeyArray = [197,79,48,83,90,230,245,252,138,154,146,13,70,233,177,29,16,160,238,202,247,29,246,176,203,171,95,201,47,137,210,111,123,159,137,4,109,82,217,94,108,240,126,183,184,43,16,34,238,236,195,59,254,243,92,232,143,22,218,246,94,234,169,124]; // Example secret key represented as an array of numbers
const uint8Array = new Uint8Array(secretKeyArray);

// Convert Uint8Array to Buffer
const buffer = Buffer.from(uint8Array);

// Encode the buffer to Base58
const base58String = bs58.encode(buffer);

console.log(base58String);
