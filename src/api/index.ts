// src/api/index.ts

import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import serverless from 'serverless-http';

import { connectFirebase } from '../config/firebase';
import { connectRedis } from '../config/redis';
import {
  createMasterWallet,
  createDedicatedAddress,
} from '../routes/handlers/walletHandlers';

import {
  getTransactionHistory,
  initiateSweep,
  initiateWithdrawal,
  getTransactionDetails,
} from '../routes/handlers/transactionHandlers';

import {
  getAddressBalance,
  listDedicatedAddresses,
  updateAddressSettings,
} from '../routes/handlers/addressHandlers';

import {
  getSupportedTokens,
  getTokenInfo,
  getNetworkStatus,
  estimateGas,
} from '../routes/handlers/tokenHandlers';

// Load environment variables
dotenv.config();

const app = express();
app.use(bodyParser.json());

// Health check
app.get('/', (req, res) => {
  res.send('✅ Afro Bank Wallet Services is up and running');
});

// Connect to databases
connectFirebase();
connectRedis();

// New tool handler routes
app.post('/tools/create_master_wallet', createMasterWallet);
app.post('/tools/create_dedicated_address', createDedicatedAddress);
app.post('/tools/get_address_balance', getAddressBalance);
app.post('/tools/get_transaction_history', getTransactionHistory);
app.post('/tools/initiate_sweep', initiateSweep);
app.post('/tools/initiate_withdrawal', initiateWithdrawal);
app.post('/tools/get_transaction_details', getTransactionDetails);
app.post('/tools/list_dedicated_addresses', listDedicatedAddresses);
app.post('/tools/update_address_settings', updateAddressSettings);

// Token management routes
app.get('/tokens/:network', getSupportedTokens);
app.get('/tokens/:network/:symbol', getTokenInfo);
app.get('/network/:network/status', getNetworkStatus);
app.post('/estimate-gas', estimateGas);

// Local dev server
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🔧 WalletWave Server running locally on http://localhost:${PORT}`);
  });
}

// Serverless handler export for Vercel
module.exports = app;

