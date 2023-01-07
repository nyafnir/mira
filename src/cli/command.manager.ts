import { REST, Routes } from 'discord.js'

import { configService } from '@services/config'
import { dataCommands } from '@commands/index'

import { BotConfigInterface } from 'bot/interfaces/config.interface'
import { BotConfigSchema } from 'bot/schemas/config.schema'
import { WipeCommandDataInterface } from './interfaces/wipe-command-data.interface'

export class BotCommandManager {
  public readonly config: BotConfigInterface =
    configService.validateConfig(BotConfigSchema)

  private readonly rest = new REST({ version: '10' }).setToken(
    this.config.BOT_TOKEN,
  )

  public async uploadCommands(guildId: string = undefined) {
    const type = `application${guildId ? 'Guild' : ''}Commands`

    /** Информация о команде для публикации в дискорд */
    const data = dataCommands.map(({ info }) => ({
      name: info.title,
      description: info.description,
      options: info.options,
      default_permission: info.defaultPermission,
    }))

    await this.rest.put(Routes[type](this.config.BOT_ID, guildId), {
      body: data,
    })
  }

  public async wipeCommands(guildId: string = undefined) {
    const type = `application${guildId ? 'Guild' : ''}Commands`

    const commands = (await this.rest.get(
      Routes[type](this.config.BOT_ID, guildId),
    )) as WipeCommandDataInterface[]

    if (!commands.length) {
      return console.warn(`В указанном меню нет команд`)
    }

    console.info(`Начинаю удаление, это займёт некоторое время ...`)

    const promises = commands.map((command) => {
      const deleteUrl = `${Routes[type](this.config.BOT_ID, guildId)}/${
        command.id
      }`
      return this.rest.delete(deleteUrl as `/${string}`)
    })
    await Promise.all(promises)

    console.info(`Готово!`)
  }
}
