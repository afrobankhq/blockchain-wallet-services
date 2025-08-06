"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAddressSettings = exports.listDedicatedAddresses = exports.getAddressBalance = void 0;
const tokenService_1 = require("../../services/tokenService");
const firebaseService_1 = require("../../services/firebaseService");
const getAddressBalance = async (req, res) => {
    try {
        const { address, network = 'base' } = req.body;
        // Validate network
        const supportedNetworks = ['base', 'base-sepolia'];
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
    try {
        const { customer_id, master_wallet_id, is_active, limit = 50, offset = 0, } = req.body;
        const filters = {};
        if (customer_id)
            filters.customer_id = customer_id;
        if (master_wallet_id)
            filters.master_wallet_id = master_wallet_id;
        if (is_active !== undefined)
            filters.is_active = is_active;
        if (limit)
            filters.limit = parseInt(limit);
        if (offset)
            filters.offset = parseInt(offset);
        const addresses = await firebaseService_1.dedicatedAddressService.findAll(filters);
        res.json({
            success: true,
            data: {
                addresses,
                total: addresses.length,
                limit: filters.limit || 50,
                offset: filters.offset || 0,
            }
        });
    }
    catch (error) {
        console.error('Error listing dedicated addresses:', error);
        res.status(500).json({
            error: 'Failed to list dedicated addresses',
            message: error.message
        });
    }
};
exports.listDedicatedAddresses = listDedicatedAddresses;
const updateAddressSettings = async (req, res) => {
    try {
        const { address, network = 'base', ...updates } = req.body;
        if (!address) {
            return res.status(400).json({ error: 'Address is required' });
        }
        // Find the dedicated address
        const dedicatedAddress = await firebaseService_1.dedicatedAddressService.findById(address);
        if (!dedicatedAddress) {
            return res.status(404).json({ error: 'Dedicated address not found' });
        }
        // Update the address settings
        const updatedAddress = await firebaseService_1.dedicatedAddressService.update(address, updates);
        // Check if update was successful
        if (!updatedAddress) {
            return res.status(500).json({ error: 'Failed to update address settings' });
        }
        res.json({
            success: true,
            data: {
                address: updatedAddress.id || address,
                network,
                updated: updates,
                updatedAt: updatedAddress.updatedAt || new Date(),
            }
        });
    }
    catch (error) {
        console.error('Error updating address settings:', error);
        res.status(500).json({
            error: 'Failed to update address settings',
            message: error.message
        });
    }
};
exports.updateAddressSettings = updateAddressSettings;
