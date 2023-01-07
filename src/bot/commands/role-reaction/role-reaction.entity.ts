import { Column, DataType, Model, Table } from 'sequelize-typescript'
import { literal } from 'sequelize'

@Table({
  tableName: 'role-reactions',
  underscored: true, // Поля и имя таблицы будут преобразованы в snake_case
  freezeTableName: false, // Не добавлять 's' к имени таблицы
  timestamps: true, // createdAt, updatedAt
  paranoid: false, // deletedAt
  indexes: [
    {
      unique: true,
      fields: ['guild_id', 'channel_id', 'message_id', 'reaction'],
    },
  ],
})
export class RoleReactionEntity extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
    comment: 'Локальный идентификатор',
  })
  declare id: number

  @Column({
    allowNull: false,
    type: DataType.TEXT,
    comment: 'Идентификатор сервера',
  })
  guildId: string

  @Column({
    allowNull: false,
    type: DataType.TEXT,
    comment: 'Идентификатор канала',
  })
  channelId: string

  @Column({
    allowNull: false,
    type: DataType.TEXT,
    comment: 'Идентификатор сообщения',
  })
  messageId: string

  @Column({
    allowNull: false,
    type: DataType.TEXT,
    comment: 'Идентификатор роли',
  })
  roleId: string

  @Column({
    allowNull: false,
    type: DataType.TEXT,
    comment: 'Эмодзи',
  })
  reaction: string

  @Column({
    defaultValue: process.env.BOT_ID,
    type: DataType.TEXT,
    comment: 'Идентификатор создателя',
  })
  creatorId: string

  @Column({
    defaultValue: literal('CURRENT_TIMESTAMP'),
    type: DataType.DATE,
    comment: 'Дата создания',
  })
  declare createdAt: Date

  @Column({
    defaultValue: literal('CURRENT_TIMESTAMP'),
    type: DataType.DATE,
    comment: 'Дата обновления',
  })
  declare updatedAt: Date
}
