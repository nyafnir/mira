import { cacheService } from '@services/cache'

const redis = cacheService.connect(0)

const getKey = (guildId: string, userId: string, commandName: string): string =>
  `${guildId}_${userId}_${commandName}`

export const cooldowns = {
  set: async (
    guildId: string,
    userId: string,
    commandName: string,
    seconds = 1,
  ): Promise<void> => {
    await redis.set(getKey(userId, guildId, commandName), '', 'EX', seconds)
  },

  /**
   * Возвращает секунды до отката
   * Вернёт -2 если ключ не найден
   */
  get: async (
    guildId: string,
    userId: string,
    commandName: string,
  ): Promise<number> => {
    return await redis.ttl(getKey(userId, guildId, commandName))
  },

  reset: async (
    guildId: string,
    userId: string,
    commandName: string,
  ): Promise<void> => {
    await redis.del(getKey(userId, guildId, commandName))
  },
}
