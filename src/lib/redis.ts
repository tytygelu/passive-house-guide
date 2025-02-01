import { createClient, RedisClientType } from 'redis';

const isEdge = process.env.NEXT_RUNTIME === 'edge';

let redisClient: RedisClientType | null;

if (isEdge) {
  // Do not initialize Redis client in the Edge runtime
  redisClient = null;
} else {
  redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });

  redisClient.on('error', (err) => console.error('Redis Client Error', err));

  (async () => {
    await redisClient.connect();
  })();
}

export default redisClient;
