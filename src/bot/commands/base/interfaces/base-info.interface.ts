import {
  ApplicationCommandOptionData,
  GatewayIntentBits,
  Partials,
} from 'discord.js'

export interface BaseInfoInterface {
  /** Название команды */
  title: string
  /** Описание */
  description: string
  /** Разрешить использовать команду всем? */
  defaultPermission: boolean
  /** Кэширование элементов существовавших до запуска */
  partials: Partials[]
  /** Доступ к данным конкретных областей */
  intents: GatewayIntentBits[]
  /** Параметры и подкоманды */
  options: ApplicationCommandOptionData[]
}
