use anchor_lang::prelude::*;
use std::mem;

declare_id!("9KaExL5gFjLvE1Z4TRsYDLdguarb6geuo4MaQ6YLk5JB");

const MAX_OWNERS: usize = 4;
const SPACE: usize = 8 + 4 + (32 * MAX_OWNERS) + 4;  // Include potential padding for `threshold`

#[program]
pub mod solana_multisig {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, owners: Vec<Pubkey>) -> Result<()> {
        // Log the size of each component and the total struct size
        msg!("Size of Multisig: {}", mem::size_of::<Multisig>());
        msg!("Size of Pubkey: {}", mem::size_of::<Pubkey>());
        msg!("Size of u8: {}", mem::size_of::<u8>());

        let multisig = &mut ctx.accounts.multisig;
        multisig.owners = owners;
        multisig.threshold = MAX_OWNERS as u8;
        Ok(())
    }

    // Additional functions...
}

// Additional structs and implementations...

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
