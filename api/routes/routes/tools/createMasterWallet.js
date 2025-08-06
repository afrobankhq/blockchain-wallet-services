"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMasterWalletHandler = void 0;
const createMasterWallet_1 = require("../../tools/createMasterWallet");
const createMasterWalletHandler = async (req, res) => {
    try {
        const result = await (0, createMasterWallet_1.createMasterWallet)(req.body);
        res.status(201).json({ success: true, ...result });
    }
    catch (error) {
        console.error('Error creating master wallet:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.createMasterWalletHandler = createMasterWalletHandler;
