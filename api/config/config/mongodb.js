"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongoDB = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const connectMongoDB = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error('❌ MONGODB_URI is not defined in environment variables.');
    }
    try {
        await mongoose_1.default.connect(uri);
        console.log('✅ MongoDB connected');
    }
    catch (err) {
        console.error('❌ MongoDB connection error:', err);
    }
};
exports.connectMongoDB = connectMongoDB;
