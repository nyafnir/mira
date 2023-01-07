import {
  ApplicationCommandOptionData,
  ApplicationCommandOptionType,
  GatewayIntentBits,
  Partials,
} from 'discord.js'

import { BaseInfoInterface } from '@commands/base/interfaces/base-info.interface'

class RoleReactionInfo implements BaseInfoInterface {
  title = 'role-reaction'
  description = 'Выдача роли по реакции на сообщение'
  defaultPermission = true
  partials = [
    Partials.Channel,
    Partials.Message,
    Partials.Reaction,
  ] as Partials[]
  intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ] as GatewayIntentBits[]
  options = [
    {
      name: 'list',
      description: 'Список отслеживаемых сообщений',
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: 'set',
      description: 'Добавить (заменить, если реакция совпала)',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'message_id',
          description: 'К какому сообщению',
          required: true,
          type: ApplicationCommandOptionType.String,
        },
        {
          name: 'reaction',
          description: 'Какую реакцию',
          required: true,
          type: ApplicationCommandOptionType.String,
        },
        {
          name: 'role',
          description: 'Какую роль',
          required: true,
          type: ApplicationCommandOptionType.Role,
        },
        {
          name: 'channel',
          description: 'В каком канале (по умолчанию: в этом)',
          required: false,
          type: ApplicationCommandOptionType.Channel,
        },
      ],
    },
    {
      name: 'del',
      description: 'Удалить',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'message_id',
          description: 'У какого сообщения',
          required: true,
          type: ApplicationCommandOptionType.String,
        },
        {
          name: 'channel',
          description: 'В каком канале (по умолчанию: в этом)',
          required: false,
          type: ApplicationCommandOptionType.Channel,
        },
      ],
    },
  ] as ApplicationCommandOptionData[]
}

export const roleReactionInfo = new RoleReactionInfo()
