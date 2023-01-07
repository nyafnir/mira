import { Guild, GuildMember, Role, RoleManager } from 'discord.js'

export const getDiscordGuildMember = async (
  userId: string,
  guild: Guild,
): Promise<GuildMember | null> => {
  return (
    guild.members.cache.get(userId) ||
    guild.members.resolve(userId) ||
    (await guild.members.fetch(userId))
  )
}

export const getDiscordRole = async (
  roleId: string,
  roles: RoleManager,
): Promise<Role | undefined> => {
  return (
    (roles.cache.get(roleId) ||
      roles.resolve(roleId) ||
      (await roles.fetch(roleId))) ??
    undefined
  )
}
