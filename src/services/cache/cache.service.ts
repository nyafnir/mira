import Redis from 'ioredis'

import { configService } from '@services/config'

import { CacheConfigInterface } from './interfaces/config.interface'
import { CacheConfigSchema } from './schemas/config.schema'

export class CacheService {
  private readonly config: CacheConfigInterface =
    configService.validateConfig(CacheConfigSchema)

  public connect(dbIndex = 0) {
    console.debug(
      this.constructor.name,
      `Подключаюсь к базе кэша №${dbIndex} ...`,
    )

    const instance = new Redis({
      host: this.config.REDIS_HOST,
      port: this.config.REDIS_PORT,
      db: dbIndex,
    })

    console.debug(
      this.constructor.name,
      `Соединение с базой кэша №${dbIndex} установлено! ✅`,
    )

    return instance
  }
}
