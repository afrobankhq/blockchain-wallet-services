"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = exports.redis = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ioredis_1 = __importDefault(require("ioredis"));
const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
    throw new Error('❌ REDIS_URL is not defined in environment variables.');
}
exports.redis = new ioredis_1.default(redisUrl);
const connectRedis = async () => {
    return new Promise((resolve, reject) => {
        exports.redis.on('connect', () => {
            console.log('✅ Redis connected');
            resolve();
        });
        exports.redis.on('error', (err) => {
            console.error('❌ Redis error:', err);
            reject(err);
        });
        // If already connected, resolve immediately
        if (exports.redis.status === 'ready') {
            console.log('✅ Redis already connected');
            resolve();
        }
    });
};
exports.connectRedis = connectRedis;
