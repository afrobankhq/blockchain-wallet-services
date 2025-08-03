// src/routes/tools.ts
import { Router } from 'express';

import {
  createMasterWallet,
  createDedicatedAddress,
} from './handlers/walletHandlers';

import {
  getTransactionHistory,
  initiateSweep,
  initiateWithdrawal,
  getTransactionDetails,
} from './handlers/transactionHandlers';

import {
  getAddressBalance,
  listDedicatedAddresses,
  updateAddressSettings,
} from './handlers/addressHandlers';

const router = Router();

// Wallet routes
router.post('/create_master_wallet', createMasterWallet);
router.post('/create_dedicated_address', createDedicatedAddress);

// Transaction routes
router.post('/get_transaction_history', getTransactionHistory);
router.post('/initiate_sweep', initiateSweep);
router.post('/initiate_withdrawal', initiateWithdrawal);
router.post('/get_transaction_details', getTransactionDetails);

// Address routes
router.post('/get_address_balance', getAddressBalance);
router.post('/list_dedicated_addresses', listDedicatedAddresses);
router.post('/update_address_settings', updateAddressSettings);

export default router;
