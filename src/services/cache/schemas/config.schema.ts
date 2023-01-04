import * as Joi from 'joi'

export const CacheConfigSchema = Joi.object({
  REDIS_HOST: Joi.string().default('127.0.0.1'),
  REDIS_PORT: Joi.number().positive().integer().min(0).max(65535).default(6379),
})
