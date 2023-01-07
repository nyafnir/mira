import { Sequelize } from 'sequelize-typescript'

import { configService } from '@services/config'
import { eventBus } from '@services/event-bus'

import { DatabaseConfigInterface } from './interfaces/config.interface'
import { DatabaseConfigSchema } from './schemas/config.schema'

export class DatabaseService {
  private readonly config: DatabaseConfigInterface =
    configService.validateConfig(DatabaseConfigSchema)

  public readonly sequelize = new Sequelize({
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

    timezone: this.config.DB_TIMEZONE,
    query: {
      /** сразу возвращает результат из БД без дополнительной информации */
      raw: true,
    },
    /** Изменение этого параметра потребует изменение кода работы с сущностями */
    repositoryMode: true,
  })

  constructor() {
    /** Подключение и синронизация после того как все модели будут добавлены */
    eventBus.subscribe('DbModelsAdded', this.connect.bind(this), true)
    eventBus.subscribe('DbConnected', this.sync.bind(this), true)
  }

  private async connect() {
    console.debug(this.constructor.name, `Подключаюсь к базе данных ...`)

    await this.sequelize.authenticate()

    console.debug(
      this.constructor.name,
      `Соединение с базой данных установлено! ✅`,
    )

    eventBus.publish('DbConnected')
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
