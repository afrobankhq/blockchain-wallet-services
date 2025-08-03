"use strict";
// src/api/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongodb_1 = require("../config/mongodb");
const redis_1 = require("../config/redis");
const walletHandlers_1 = require("../routes/handlers/walletHandlers");
const transactionHandlers_1 = require("../routes/handlers/transactionHandlers");
const addressHandlers_1 = require("../routes/handlers/addressHandlers");
const tokenHandlers_1 = require("../routes/handlers/tokenHandlers");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
// Health check
app.get('/', (req, res) => {
    res.send('✅ WalletWave Server is up and running');
});
// Connect to databases
(0, mongodb_1.connectMongoDB)();
(0, redis_1.connectRedis)();
// New tool handler routes
app.post('/tools/create_master_wallet', walletHandlers_1.createMasterWallet);
app.post('/tools/create_dedicated_address', walletHandlers_1.createDedicatedAddress);
app.post('/tools/get_address_balance', addressHandlers_1.getAddressBalance);
app.post('/tools/get_transaction_history', transactionHandlers_1.getTransactionHistory);
app.post('/tools/initiate_sweep', transactionHandlers_1.initiateSweep);
app.post('/tools/initiate_withdrawal', transactionHandlers_1.initiateWithdrawal);
app.post('/tools/get_transaction_details', transactionHandlers_1.getTransactionDetails);
app.post('/tools/list_dedicated_addresses', addressHandlers_1.listDedicatedAddresses);
app.post('/tools/update_address_settings', addressHandlers_1.updateAddressSettings);
// Token management routes
app.get('/tokens/:network', tokenHandlers_1.getSupportedTokens);
app.get('/tokens/:network/:symbol', tokenHandlers_1.getTokenInfo);
app.get('/network/:network/status', tokenHandlers_1.getNetworkStatus);
app.post('/estimate-gas', tokenHandlers_1.estimateGas);
// Local dev server
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🔧 WalletWave Server running locally on http://localhost:${PORT}`);
    });
}
// Serverless handler export for Vercel
module.exports = app;
