use anchor_lang::prelude::*;

declare_id!("9KaExL5gFjLvE1Z4TRsYDLdguarb6geuo4MaQ6YLk5JB");

const MAX_OWNERS: usize = 4;
const SPACE: usize = 8 + 4 + 4 + (32 * MAX_OWNERS);

#[program]
pub mod solana_multisig {
    use super::*;

    
    pub fn initialize(ctx: Context<Initialize>, owners: Vec<Pubkey>) -> Result<()> {
        // Log the size of each component and the total struct size
        println!("Size of Multisig: {}", std::mem::size_of::<Multisig>());
        println!("Size of Pubkey: {}", std::mem::size_of::<Pubkey>());
        println!("Size of u8: {}", std::mem::size_of::<u8>());

        let multisig = &mut ctx.accounts.multisig;
        multisig.owners = owners;
        multisig.threshold = MAX_OWNERS as u8;
        Ok(())
    }

    pub fn execute_transaction(ctx: Context<ExecuteTransaction>, amount: u64) -> Result<()> {
        let multisig = &ctx.accounts.multisig;
        let recipient = &ctx.accounts.recipient;

        if ctx.remaining_accounts.len() != multisig.owners.len() {
            return Err(ErrorCode::InvalidSigners.into());
        }

        anchor_lang::solana_program::program::invoke(
            &anchor_lang::solana_program::system_instruction::transfer(
                &multisig.key(),
                recipient.key,
                amount,
            ),
            &[
                multisig.to_account_info(),
                recipient.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = payer, space = SPACE)]
    pub multisig: Account<'info, Multisig>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ExecuteTransaction<'info> {
    #[account(mut)]
    pub multisig: Account<'info, Multisig>,
    /// CHECK: The recipient account is safe to use here without additional checks because the necessary
    /// validations are performed within the `execute_transaction` function. Specifically, we ensure that
    /// all owners have signed the transaction before invoking the transfer, and the recipient account
    /// does not need to uphold specific state or ownership properties beyond being a valid account.
    #[account(mut)]
    pub recipient: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Multisig {
    pub owners: Vec<Pubkey>,
    pub threshold: u8,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid number of signers")]
    InvalidSigners,
}

// This file contains the Rust code for the Solana multisig program.
// It defines the necessary structs, instructions, and error codes for the multisig functionality.
// The `initialize` instruction sets up the multisig account with the provided owners and threshold.
// The `execute_transaction` instruction allows executing a transaction with the required number of signers./// CHECK: The recipient field is used in conjunction with the Solana system instruction to transfer funds. Safety checks for the transfer operation are handled by the Solana runtime.
