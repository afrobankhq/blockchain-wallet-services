"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/tools.ts
const express_1 = require("express");
const walletHandlers_1 = require("./handlers/walletHandlers");
const transactionHandlers_1 = require("./handlers/transactionHandlers");
const addressHandlers_1 = require("./handlers/addressHandlers");
const router = (0, express_1.Router)();
// Wallet routes
router.post('/create_master_wallet', walletHandlers_1.createMasterWallet);
router.post('/create_dedicated_address', walletHandlers_1.createDedicatedAddress);
// Transaction routes
router.post('/get_transaction_history', transactionHandlers_1.getTransactionHistory);
router.post('/initiate_sweep', transactionHandlers_1.initiateSweep);
router.post('/initiate_withdrawal', transactionHandlers_1.initiateWithdrawal);
router.post('/get_transaction_details', transactionHandlers_1.getTransactionDetails);
// Address routes
router.post('/get_address_balance', addressHandlers_1.getAddressBalance);
router.post('/list_dedicated_addresses', addressHandlers_1.listDedicatedAddresses);
router.post('/update_address_settings', addressHandlers_1.updateAddressSettings);
exports.default = router;
