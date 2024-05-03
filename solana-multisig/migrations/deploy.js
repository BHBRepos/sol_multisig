// Migrations are an early feature. Currently, they're nothing more than this
// single deploy script that's invoked from the CLI, injecting a provider
// configured from the workspace's Anchor.toml.


const anchor = require("@coral-xyz/anchor");

module.exports = async function (provider) {
  // Configure client to use the provider.
  anchor.setProvider(provider);

  // Load your multisig program from the IDL
  const program = anchor.workspace.SolanaMultisig;

  // Generate a new keypair for your multisig account
  const multisig = anchor.web3.Keypair.generate();

  // Assuming your initialize function needs a multisig account to be passed
  await program.rpc.initialize({
    accounts: {
      multisig: multisig.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
    signers: [multisig],
  });

  console.log("Deployed multisig program with public key:", multisig.publicKey.toString());
};
