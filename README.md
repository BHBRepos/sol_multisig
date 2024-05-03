4 wallets auto agree to a multisig test transaction on dev net, all test sol for now
Want to of course remove auto feature once this basic version complete.
Require user interaction and unanimity of votes
Also want to add a boot if inactive vote etc if someone quits so wallet not stuck
And remove ability to change contract once done, unless all vote yes


Project ID on solscan - https://solscan.io/account/9KaExL5gFjLvE1Z4TRsYDLdguarb6geuo4MaQ6YLk5JB?cluster=devnet



Issue is here: Size too small, not sure how to alter this
**/solana-multisig/solana-multisig/programs/solana-multisig/src/lib.rs**

use anchor_lang::prelude::*;

declare_id!("9KaExL5gFjLvE1Z4TRsYDLdguarb6geuo4MaQ6YLk5JB");

const MAX_OWNERS: usize = 4;
const SPACE: usize = 8 + 4 + 4 + (32 * MAX_OWNERS);  // Precisely calculated space


anchor deploy
Deploying cluster: https://api.devnet.solana.com
Upgrade authority: /home/chris/.config/solana/id.json
Deploying program "solana_multisig"...
Program path: /home/chris/solana-multisig/solana-multisig/target/deploy/solana_multisig.so...
===============================================================================
Recover the intermediate account's ephemeral keypair file with
`solana-keygen recover` and the following 12-word seed phrase:
===============================================================================
destroy upset unfair sustain chunk wolf client bullet weapon ribbon recall doll
===============================================================================
To resume a deploy, pass the recovered keypair as the
[BUFFER_SIGNER] to `solana program deploy` or `solana program write-buffer'.
Or to recover the account's lamports, pass it as the
[BUFFER_ACCOUNT_ADDRESS] argument to `solana program close`.
===============================================================================
Error: Deploying program failed: RPC response error -32002: Transaction simulation failed: Error processing Instruction 0: account data too small for instruction [3 log messages]
There was a problem deploying: Output { status: ExitStatus(unix_wait_status(256)), stdout: "", stderr: "" }.
