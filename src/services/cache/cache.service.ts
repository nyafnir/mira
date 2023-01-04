import Redis from 'ioredis'

import { configService } from '@services/config'

import { CacheConfigInterface } from './interfaces/config.interface'
import { CacheConfigSchema } from './schemas/config.schema'

export class CacheService {
  private readonly config: CacheConfigInterface =
    configService.validateConfig(CacheConfigSchema)

  public readonly redis: Redis

  constructor() {
    this.redis = new Redis({
      host: this.config.REDIS_HOST,
      port: this.config.REDIS_PORT,
    })
  }
}
