"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const DedicatedAddressSchema = new mongoose_1.default.Schema({
    customer_id: { type: String, required: true },
    master_wallet_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'MasterWallet' },
    address: { type: String, required: true },
    disable_auto_sweep: { type: Boolean, default: false },
    enable_gasless_withdraw: { type: Boolean, default: false },
    name: String,
    metadata: { type: Object, default: {} },
    is_active: { type: Boolean, default: true }
});
exports.default = mongoose_1.default.model('DedicatedAddress', DedicatedAddressSchema);
