import dotenv from 'dotenv';
dotenv.config();
import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error('❌ REDIS_URL is not defined in environment variables.');
}

export const redis = new Redis(redisUrl);

export const connectRedis = async () => {
  return new Promise<void>((resolve, reject) => {
    redis.on('connect', () => {
      console.log('✅ Redis connected');
      resolve();
    });

    redis.on('error', (err) => {
      console.error('❌ Redis error:', err);
      reject(err);
    });

    // If already connected, resolve immediately
    if (redis.status === 'ready') {
      console.log('✅ Redis already connected');
      resolve();
    }
  });
};
