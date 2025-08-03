"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMasterWallet = void 0;
const ethers_1 = require("ethers");
const MasterWallet_1 = __importDefault(require("../models/MasterWallet"));
const createMasterWallet = async ({ name, metadata }) => {
    const wallet = ethers_1.ethers.Wallet.createRandom();
    const newWallet = new MasterWallet_1.default({
        name,
        address: wallet.address,
        metadata: metadata || {}
    });
    await newWallet.save();
    return {
        wallet_id: newWallet._id,
        address: wallet.address
    };
};
exports.createMasterWallet = createMasterWallet;
