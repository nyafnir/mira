import {
  CacheType,
  ChatInputCommandInteraction,
  InteractionEditReplyOptions,
} from 'discord.js'

import { chance, formatSeconds } from '@utils'

export class BaseCommand {
  /** Настройки отката использования команды */
  public readonly cooldown = {
    seconds: 1,
    messages: [
      'я не в настроении что-либо говорить ($TimeLeft)',
      'пожалуйста, подожди $TimeLeft прежде, чем снова вызвать эту команду',
      'ещё $TimeLeft и ты сможешь воспользоваться этой командой',
    ],
  }

  public getCooldownMessage(seconds: number): string {
    const message =
      this.cooldown.messages[
        chance.integer({ min: 0, max: this.cooldown.messages.length - 1 })
      ]
    const timeLeft = formatSeconds(seconds)

    return message.replaceAll('$TimeLeft', timeLeft)
  }

  public execute(
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<InteractionEditReplyOptions> {
    /** Если вызвана подкоманда, то сразу вызываем её */
    const subcommandName = interaction.options.getSubcommand()
    if (subcommandName) {
      return this[subcommandName](interaction)
    }
  }
}
