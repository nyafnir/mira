import prompts = require('prompts')

import { BotCommandManager } from './command.manager'

export class BotCommandCli {
  public async run() {
    const response: {
      methodName: 'uploadCommands' | 'wipeCommands' | undefined
      guildId: string | undefined
    } = await prompts([
      {
        type: 'select',
        name: 'methodName',
        message: 'Что вы хотите сделать?',
        choices: [
          {
            title: 'Добавить информацию о слэш-командах в дискорд',
            value: 'uploadCommands',
          },
          {
            title: 'Удалить информацию о слэш-командах из дискорда',
            value: 'wipeCommands',
          },
        ],
      },
      {
        type: 'select',
        name: 'type',
        message: 'Укажите тип меню',
        choices: [
          {
            title: 'Глобальное меню',
            value: 'global',
          },
          {
            title: 'Серверное меню',
            value: 'local',
          },
        ],
      },
      {
        type: (prev) => (prev === 'local' ? 'text' : null),
        name: 'guildId',
        message: 'Укажите идентификатор сервера',
      },
    ])

    if (!Object.keys(response).length) {
      return
    }

    const { methodName, guildId } = response
    await new BotCommandManager()[methodName](guildId)
  }
}
