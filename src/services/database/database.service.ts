import { Sequelize } from 'sequelize-typescript'

import { configService } from '@services/config'
import { eventBus } from '@services/event-bus'

import { DatabaseConfigInterface } from './interfaces/config.interface'
import { DatabaseConfigSchema } from './schemas/config.schema'

export class DatabaseService {
  private readonly config: DatabaseConfigInterface =
    configService.validateConfig(DatabaseConfigSchema)

  public readonly sequelize: Sequelize

  constructor() {
    this.sequelize = new Sequelize({
      /** Обязан быть явно указанным здесь (требование от Sequelize) */
      dialect: 'postgres',

      host: this.config.DB_HOST,
      port: this.config.DB_PORT,
      database: this.config.DB_NAME,
      username: this.config.DB_USER,
      password: this.config.DB_PASSWORD,

      logging: false,

      sync: {
        force: this.config.DB_SYNC_FORCE,
      },

      /** Изменение этого параметра потребует изменение кода работы с сущностями */
      repositoryMode: true,
    })

    /** Подключение и синронизация после того как модели будут добавлены */
    eventBus.subscribe(
      'DbModelsAdded',
      async () => {
        await this.connect.bind(this)()
        await this.sync.bind(this)()
      },
      true,
    )
  }

  private async connect() {
    console.debug(this.constructor.name, `Подключаюсь к базе данных ...`)

    await this.sequelize.authenticate()

    console.debug(
      this.constructor.name,
      `Соединение с базой данных установлено! ✅`,
    )
  }

  private async sync() {
    console.debug(
      this.constructor.name,
      `Синхронизирую локальные модели таблиц с БД ...`,
    )

    /** Синхронизирет все добавленные модели с БД */
    await this.sequelize.sync()

    console.debug(
      this.constructor.name,
      `Модели таблиц синхронизированы! (${
        this.config.DB_SYNC_FORCE ? 'принудительно' : 'без перезаписи'
      }) ✅`,
    )

    eventBus.publish('DbSynced')
  }
}
