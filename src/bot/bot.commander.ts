import {
  CacheType,
  ChatInputCommandInteraction,
  Client,
  Collection,
  Interaction,
  InteractionEditReplyOptions,
} from 'discord.js'

import { eventBus } from '@services/event-bus'
import { cooldowns } from '@modules/cooldown'
import { BaseCommand } from '@commands/base/base.command'

import { dataCommands } from './commands'

export class BotCommander {
  private readonly commands = new Collection<string, BaseCommand>()

  constructor(private readonly client: Client) {
    dataCommands.map((command) =>
      this.commands.set(command.info.title, new command(this.client)),
    )

    this.client.on('interactionCreate', this.onInteractionCreate.bind(this))

    /** Модели таблиц размещены в папках команд, поэтому событие публикуется здесь */
    eventBus.publish('DbModelsAdded')
  }

  /** Предобработка любой команды и вызов */
  private async onInteractionCreate(
    interaction: Interaction<CacheType>,
  ): Promise<void> {
    if (!interaction.isChatInputCommand()) {
      return /** только слэш-команды */
    }

    const commandName = interaction.commandName.toLowerCase()
    const guildId = interaction.guildId || '0' // 0 - DM
    const userId = interaction.user.id

    const command = this.commands.get(commandName)
    if (!command) {
      return await this.sendError(
        interaction,
        `у меня нет команды \`/${commandName}\` или она была удалена.`,
      )
    }

    const timeLeftSeconds = await cooldowns.get(guildId, userId, commandName)
    if (timeLeftSeconds > 0) {
      const timeLeftMessage = command.getCooldownMessage(timeLeftSeconds)
      return await this.sendError(interaction, timeLeftMessage)
    } else {
      cooldowns.set(guildId, userId, commandName, command.cooldown.seconds)
    }

    try {
      const answer = await command.execute(interaction)
      await this.sendReply(interaction, answer)
    } catch (error) {
      if (error instanceof Error) {
        await this.sendError(interaction, error.message)
      } else {
        await this.sendError(
          interaction,
          'попробуй вызывать команду ещё раз или сообщи об этом разработчику.',
        )

        console.trace('Непредвиденная ошибка: ', JSON.stringify(error))
      }

      await cooldowns.reset(guildId, userId, commandName)
    }
  }

  private async sendReply(
    interaction: ChatInputCommandInteraction<CacheType>,
    data: InteractionEditReplyOptions,
  ): Promise<void> {
    // если сообщение невидимое, то доступа нет - отправляем новое
    if (interaction.ephemeral) {
      await interaction.followUp({
        ...data,
        ephemeral: true,
      })
    }
    // если мы уже ответили, то ссылаемся на ответ в новом сообщении
    else if (interaction.replied) {
      await interaction.followUp(data)
    }
    // если мы сказали, что думаем над ответом, то редактируем его
    else if (interaction.deferred) {
      await interaction.editReply(data)
    } else {
      // иначе отвечаем на сообщение обычным способом
      await interaction.reply(data)
    }
  }

  private async sendError(
    interaction: ChatInputCommandInteraction<CacheType>,
    data: string | InteractionEditReplyOptions,
  ) {
    if (typeof data === 'string') {
      data = { content: `<@${interaction.user.id}>, ${data}` }
    }

    return await this.sendReply(interaction, data)
  }
}
