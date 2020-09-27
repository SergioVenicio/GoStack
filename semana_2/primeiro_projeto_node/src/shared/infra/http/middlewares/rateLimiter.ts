import { Request, Response, NextFunction } from 'express';

import { RateLimiterRedis } from 'rate-limiter-flexible';
import redis from 'redis';

import cacheConfig from '@config/cache';

const storeClient = redis.createClient({
  host: cacheConfig.config.redis.host,
  port: cacheConfig.config.redis.port,
  password: cacheConfig.config.redis.password,
});
const rateLimiter = new RateLimiterRedis({
  storeClient,
  keyPrefix: 'rate-limit',
  points: 10,
  duration: 1,
  blockDuration: 5,
});

export default async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    await rateLimiter.consume(request.ip);
    return next();
  } catch {
    return response.status(429).json({ error: 'Too Many Requests' });
  }
};
