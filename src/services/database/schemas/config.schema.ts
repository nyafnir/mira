import * as Joi from 'joi'

export const DatabaseConfigSchema = Joi.object({
  DB_HOST: Joi.string().default('127.0.0.1'),
  DB_PORT: Joi.number().positive().integer().min(0).max(65535).default(5432),
  DB_NAME: Joi.string().default('mira'),
  DB_USER: Joi.string().default('mira'),
  DB_PASSWORD: Joi.string().default('mira'),

  DB_SYNC_FORCE: Joi.boolean().default(false),
})
