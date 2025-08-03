"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDedicatedAddress = exports.createMasterWallet = void 0;
const ethers_1 = require("ethers");
const createMasterWallet = async (req, res) => {
    const { name, metadata } = req.body;
    const wallet = ethers_1.ethers.Wallet.createRandom();
    res.json({ name, address: wallet.address, metadata: metadata || {} });
};
exports.createMasterWallet = createMasterWallet;
const createDedicatedAddress = async (req, res) => {
    const { customer_id, master_wallet_id, name, disable_auto_sweep, enable_gasless_withdraw, metadata, } = req.body;
    const wallet = ethers_1.ethers.Wallet.createRandom();
    res.json({
        customer_id,
        address: wallet.address,
        master_wallet_id,
        name,
        disable_auto_sweep,
        enable_gasless_withdraw,
        metadata,
    });
};
exports.createDedicatedAddress = createDedicatedAddress;
