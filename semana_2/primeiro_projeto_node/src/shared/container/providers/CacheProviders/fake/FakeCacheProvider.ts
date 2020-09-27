import ICacheProvider from '../models/ICacheProvider';

interface ICacheData {
  [key: string]: string;
}

export default class RedisCacheProvider implements ICacheProvider {
  private cache: ICacheData = {};

  public async save<T>(key: string, value: T): Promise<void> {
    this.cache[key] = JSON.stringify(value);
  }
  public async recover<T>(key: string): Promise<T | null> {
    const cacheData = await this.cache[key];
    if (!cacheData) {
      return null;
    }

    return JSON.parse(cacheData) as T;
  }

  public async invalidate(key: string): Promise<void> {
    delete this.cache[key];
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = Object.keys(this.cache).filter((key) =>
      key.startsWith(prefix)
    );

    keys.forEach((key) => {
      delete this.cache[key];
    });
  }
}
