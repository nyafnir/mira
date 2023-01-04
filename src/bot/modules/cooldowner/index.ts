import { redis } from '@services/cache'

const getKey = (guildId: string, userId: string, commandName: string): string =>
  `${guildId}_${userId}_${commandName}`

export const cooldowns = {
  set: (guildId: string, userId: string, commandName: string, seconds = 1) =>
    redis.set(getKey(userId, guildId, commandName), '', 'EX', seconds),
  /** Возвращает секунды до отката */
  get: async (
    guildId: string,
    userId: string,
    commandName: string,
  ): Promise<number> => redis.ttl(getKey(userId, guildId, commandName)),
}
