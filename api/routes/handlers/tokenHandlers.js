"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimateGas = exports.getNetworkStatus = exports.getTokenInfo = exports.getSupportedTokens = void 0;
const tokenService_1 = require("../../services/tokenService");
const tokens_1 = require("../../config/tokens");
const getSupportedTokens = async (req, res) => {
    try {
        const { network } = req.params;
        if (!network) {
            return res.status(400).json({ error: 'Network parameter is required' });
        }
        const tokens = (0, tokens_1.getTokensByNetwork)(network);
        res.json({
            network,
            tokens: tokens.map(token => ({
                symbol: token.symbol,
                name: token.name,
                address: token.address,
                decimals: token.decimals,
                isNative: token.isNative || false
            }))
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to get supported tokens', message: err.message });
    }
};
exports.getSupportedTokens = getSupportedTokens;
const getTokenInfo = async (req, res) => {
    try {
        const { symbol, network } = req.params;
        if (!symbol || !network) {
            return res.status(400).json({ error: 'Token symbol and network are required' });
        }
        const tokenInfo = await tokenService_1.tokenService.getTokenInfo(symbol, network);
        if (!tokenInfo) {
            return res.status(404).json({ error: 'Token not found' });
        }
        res.json({
            symbol: tokenInfo.symbol,
            name: tokenInfo.name,
            address: tokenInfo.address,
            decimals: tokenInfo.decimals,
            network: tokenInfo.network,
            isNative: tokenInfo.isNative || false
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to get token info', message: err.message });
    }
};
exports.getTokenInfo = getTokenInfo;
const getNetworkStatus = async (req, res) => {
    try {
        const { network } = req.params;
        if (!network) {
            return res.status(400).json({ error: 'Network parameter is required' });
        }
        const isOnline = await tokenService_1.tokenService.getNetworkStatus(network);
        res.json({
            network,
            status: isOnline ? 'online' : 'offline',
            timestamp: new Date().toISOString()
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to get network status', message: err.message });
    }
};
exports.getNetworkStatus = getNetworkStatus;
const estimateGas = async (req, res) => {
    try {
        const { from_address, to_address, token_symbol, network, amount } = req.body;
        if (!from_address || !to_address || !token_symbol || !network || !amount) {
            return res.status(400).json({
                error: 'from_address, to_address, token_symbol, network, and amount are required'
            });
        }
        const gasEstimate = await tokenService_1.tokenService.estimateGasForTransfer(from_address, to_address, token_symbol, network, amount);
        res.json({
            from_address,
            to_address,
            token_symbol,
            network,
            amount,
            estimated_gas: gasEstimate
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to estimate gas', message: err.message });
    }
};
exports.estimateGas = estimateGas;
