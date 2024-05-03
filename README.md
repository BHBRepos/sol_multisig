# Multisig Wallet Test on Devnet

## Introduction
This project involves testing a multisig wallet on the Solana Devnet. Four wallets are set up to automatically agree to multisig test transactions. This auto feature will be removed once the basic version is complete, and sigs will be pushed to users to. User interaction and unanimity of votes will be required for transactions to proceed in final version. Additionally, measures will be implemented to handle inactive members for long periods of time (quit the project etc) and prevent changes to the contract unless all parties vote yes.

## Project ID on Solscan
[Project ID on Solscan](https://solscan.io/account/9KaExL5gFjLvE1Z4TRsYDLdguarb6geuo4MaQ6YLk5JB?cluster=devnet)

## Issue
The size of the contract is too small, and adjustments need to be made in the lib.rs file.

```rust
// /solana-multisig/solana-multisig/programs/solana-multisig/src/lib.rs

use anchor_lang::prelude::*;

declare_id!("9KaExL5gFjLvE1Z4TRsYDLdguarb6geuo4MaQ6YLk5JB");

const MAX_OWNERS: usize = 4;
const SPACE: usize = 8 + 4 + 4 + (32 * MAX_OWNERS);  // Precisely calculated space
```



## Deployment

When deploying, the following steps are taken:

- Deploying cluster: https://api.devnet.solana.com
- Upgrade authority: `/home/chris/.config/solana/id.json`
- Deploying program "solana_multisig"...
- Program path: `/home/chris/solana-multisig/solana-multisig/target/deploy/solana_multisig.so`
- Recovery of the intermediate account's ephemeral keypair file with `solana-keygen recover` and a 12-word seed phrase is required to resume a deploy.

Error: Deployment failed due to RPC response error -32002: Transaction simulation failed: Error processing Instruction 0: account data too small for instruction.

