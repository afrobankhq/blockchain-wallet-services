"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAddressSettings = exports.listDedicatedAddresses = exports.getAddressBalance = void 0;
const tokenService_1 = require("../../services/tokenService");
const getAddressBalance = async (req, res) => {
    try {
        const { address, network = 'base' } = req.body;
        // Validate network
        const supportedNetworks = ['base', 'base-sepolia', 'ethereum-sepolia'];
        if (!supportedNetworks.includes(network)) {
            return res.status(400).json({ error: 'Unsupported network' });
        }
        // Get all token balances for the network
        const balances = await tokenService_1.tokenService.getAllTokenBalances(address, network);
        res.json({
            address,
            network,
            balances,
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch balance', message: err.message });
    }
};
exports.getAddressBalance = getAddressBalance;
const listDedicatedAddresses = async (req, res) => {
    const { customer_id, master_wallet_id, network, is_active, limit = 50, offset = 0, } = req.body;
    res.json({
        customer_id,
        master_wallet_id,
        network,
        is_active,
        limit,
        offset,
        addresses: [],
    });
};
exports.listDedicatedAddresses = listDedicatedAddresses;
const updateAddressSettings = async (req, res) => {
    const { address, network = 'base', ...updates } = req.body;
    res.json({
        address,
        network,
        updated: updates,
    });
};
exports.updateAddressSettings = updateAddressSettings;
