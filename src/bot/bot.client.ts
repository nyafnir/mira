import {
  ActivityType,
  Client,
  PresenceUpdateStatus,
  Events as ClientEvents,
} from 'discord.js'

import { configService } from '@services/config'
import { eventBus } from '@services/event-bus'
import { BotCommander } from './bot.commander'

import { BotConfigInterface } from './interfaces/config.interface'
import { BotConfigSchema } from './schemas/config.schema'
import { dataCommands } from './commands'

export class BotClient {
  public readonly config: BotConfigInterface =
    configService.validateConfig(BotConfigSchema)

  public readonly client = new Client({
    partials: [
      ...new Set(dataCommands.map(({ info }) => info.partials).flat()),
    ],
    intents: [...new Set(dataCommands.map(({ info }) => info.intents).flat())],
    allowedMentions: {
      parse: ['users', 'roles', 'everyone'],
      repliedUser: true,
    },
  })

  constructor() {
    this.setClientDefaultListeners()

    /** Заходим в сеть только после того как база данных готова */
    eventBus.subscribe('DbSynced', this.loginClient.bind(this), true)

    new BotCommander(this.client)
  }

  private setClientDefaultListeners() {
    this.client.on(ClientEvents.Warn, console.warn)
    this.client.on(ClientEvents.Error, (error: Error) =>
      console.error(error.message, error.stack),
    )

    this.client
      /** При каждом восстановлении соединения */
      .on(ClientEvents.ClientReady, () => {
        console.info(`Бот ${this.client.user.tag} на связи! ✅`)

        this.client.user.setPresence({
          status: PresenceUpdateStatus.Online,
          activities: [
            {
              name: '...',
              type: ActivityType.Watching,
            },
          ],
        })
      })
  }

  public async loginClient() {
    console.debug(this.constructor.name, `Захожу в сеть ...`)

    await this.client.login(this.config.BOT_TOKEN)
  }
}
