import { container } from 'tsyringe';

import ICacheProvider from './models/ICacheProvider';

import RedisProvider from './implementations/RedisCacheProvider';

container.registerSingleton<ICacheProvider>('CacheProvider', RedisProvider);
