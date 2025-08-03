"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionDetails = exports.initiateWithdrawal = exports.initiateSweep = exports.getTransactionHistory = void 0;
const tokenService_1 = require("../../services/tokenService");
const getTransactionHistory = async (req, res) => {
    const { address, network = 'base', token_symbol } = req.body;
    // Validate token if specified
    if (token_symbol) {
        const isValid = await tokenService_1.tokenService.validateToken(token_symbol, network);
        if (!isValid) {
            return res.status(400).json({ error: 'Invalid token symbol for network' });
        }
    }
    res.json({
        address,
        network,
        token_symbol,
        transactions: []
    });
};
exports.getTransactionHistory = getTransactionHistory;
const initiateSweep = async (req, res) => {
    const { address, token_symbol, amount, network = 'base' } = req.body;
    // Validate token
    const isValid = await tokenService_1.tokenService.validateToken(token_symbol, network);
    if (!isValid) {
        return res.status(400).json({ error: 'Invalid token symbol for network' });
    }
    res.json({
        address,
        token_symbol,
        network,
        amount: amount || 'full',
        status: 'sweep_initiated',
    });
};
exports.initiateSweep = initiateSweep;
const initiateWithdrawal = async (req, res) => {
    const { to_address, token_symbol, amount, master_wallet_id, network = 'base' } = req.body;
    // Validate token
    const isValid = await tokenService_1.tokenService.validateToken(token_symbol, network);
    if (!isValid) {
        return res.status(400).json({ error: 'Invalid token symbol for network' });
    }
    res.json({
        to_address,
        token_symbol,
        network,
        amount,
        master_wallet_id,
        status: 'withdrawal_initiated',
    });
};
exports.initiateWithdrawal = initiateWithdrawal;
const getTransactionDetails = async (req, res) => {
    const { tx_hash, network = 'base' } = req.body;
    res.json({
        tx_hash,
        network,
        details: {}
    });
};
exports.getTransactionDetails = getTransactionDetails;
