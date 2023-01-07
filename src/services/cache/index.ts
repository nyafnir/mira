import Redis from 'ioredis'

import { CacheService } from './cache.service'

const cacheService = new CacheService()

export { cacheService, CacheService, Redis }
