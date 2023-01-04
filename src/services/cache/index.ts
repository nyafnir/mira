import Redis from 'ioredis'

import { CacheService } from './cache.service'

const cacheService = new CacheService()
const redis = cacheService.redis

export { redis, Redis }
