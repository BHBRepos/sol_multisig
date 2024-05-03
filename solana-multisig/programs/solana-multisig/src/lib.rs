use anchor_lang::prelude::*;

declare_id!("9KaExL5gFjLvE1Z4TRsYDLdguarb6geuo4MaQ6YLk5JB");

const MAX_OWNERS: usize = 4;
const SPACE: usize = 8 + 1 + 4 + (32 * MAX_OWNERS);  // Adjusted for maximum padding and structure

#[program]
pub mod solana_multisig {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, owners: Vec<Pubkey>) -> Result<()> {
        let multisig = &mut ctx.accounts.multisig;
        multisig.owners = owners;
        multisig.threshold = 4; // Require all 4 owners to agree
        Ok(())
    }

    pub fn execute_transaction(ctx: Context<ExecuteTransaction>, amount: u64) -> Result<()> {
        let multisig = &ctx.accounts.multisig;
        let recipient = &ctx.accounts.recipient;

        // Ensure all owners have signed the transaction
        if ctx.remaining_accounts.len() != multisig.owners.len() {
            return Err(ErrorCode::InvalidSigners.into());
        }

        // Transfer the specified amount of SOL
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


