import { Request, Response } from 'express';
import { tokenService } from '../../services/tokenService';
import { transactionService } from '../../services/firebaseService';

export const getTransactionHistory = async (req: Request, res: Response) => {
  try {
    const { address, network = 'base', token_symbol } = req.body;
    
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }
    
    // Validate token if specified
    if (token_symbol) {
      const isValid = await tokenService.validateToken(token_symbol, network);
      if (!isValid) {
        return res.status(400).json({ error: 'Invalid token symbol for network' });
      }
    }
    
    // Get transactions from Firebase
    const transactions = await transactionService.findByAddress(address, network);
    
    // Filter by token if specified
    const filteredTransactions = token_symbol 
      ? transactions.filter(tx => tx.token_symbol === token_symbol)
      : transactions;
    
    res.json({ 
      success: true,
      data: {
        address, 
        network,
        token_symbol,
        transactions: filteredTransactions,
        total: filteredTransactions.length
      }
    });
  } catch (error: any) {
    console.error('Error getting transaction history:', error);
    res.status(500).json({ 
      error: 'Failed to get transaction history', 
      message: error.message 
    });
  }
};

export const initiateSweep = async (req: Request, res: Response) => {
  try {
    const { address, token_symbol, amount, network = 'base' } = req.body;
    
    if (!address || !token_symbol) {
      return res.status(400).json({ error: 'Address and token_symbol are required' });
    }
    
    // Validate token
    const isValid = await tokenService.validateToken(token_symbol, network);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid token symbol for network' });
    }
    
    // Create a sweep transaction record
    const sweepTx = await transactionService.create({
      tx_hash: `sweep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      from_address: address,
      to_address: 'master_wallet', // This would be the master wallet address
      amount: amount || 'full',
      token_symbol,
      network,
      status: 'pending',
      metadata: { type: 'sweep' }
    });
    
    res.json({
      success: true,
      data: {
        address,
        token_symbol,
        network,
        amount: amount || 'full',
        status: 'sweep_initiated',
        transaction_id: sweepTx.id,
      }
    });
  } catch (error: any) {
    console.error('Error initiating sweep:', error);
    res.status(500).json({ 
      error: 'Failed to initiate sweep', 
      message: error.message 
    });
  }
};

export const initiateWithdrawal = async (req: Request, res: Response) => {
  try {
    const { to_address, token_symbol, amount, master_wallet_id, network = 'base' } = req.body;
    
    if (!to_address || !token_symbol || !amount || !master_wallet_id) {
      return res.status(400).json({ 
        error: 'to_address, token_symbol, amount, and master_wallet_id are required' 
      });
    }
    
    // Validate token
    const isValid = await tokenService.validateToken(token_symbol, network);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid token symbol for network' });
    }
    
    // Create a withdrawal transaction record
    const withdrawalTx = await transactionService.create({
      tx_hash: `withdrawal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      from_address: 'master_wallet', // This would be the master wallet address
      to_address,
      amount,
      token_symbol,
      network,
      status: 'pending',
      metadata: { 
        type: 'withdrawal',
        master_wallet_id 
      }
    });
    
    res.json({
      success: true,
      data: {
        to_address,
        token_symbol,
        network,
        amount,
        master_wallet_id,
        status: 'withdrawal_initiated',
        transaction_id: withdrawalTx.id,
      }
    });
  } catch (error: any) {
    console.error('Error initiating withdrawal:', error);
    res.status(500).json({ 
      error: 'Failed to initiate withdrawal', 
      message: error.message 
    });
  }
};

export const getTransactionDetails = async (req: Request, res: Response) => {
  try {
    const { tx_hash, network = 'base' } = req.body;
    
    if (!tx_hash) {
      return res.status(400).json({ error: 'Transaction hash is required' });
    }
    
    const transaction = await transactionService.findByHash(tx_hash);
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json({ 
      success: true,
      data: {
        tx_hash, 
        network,
        details: transaction
      }
    });
  } catch (error: any) {
    console.error('Error getting transaction details:', error);
    res.status(500).json({ 
      error: 'Failed to get transaction details', 
      message: error.message 
    });
  }
};
