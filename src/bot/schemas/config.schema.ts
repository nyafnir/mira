import * as Joi from 'joi'

export const BotConfigSchema = Joi.object({
  BOT_TOKEN: Joi.string().required(),
  BOT_ID: Joi.string().required(),
})
