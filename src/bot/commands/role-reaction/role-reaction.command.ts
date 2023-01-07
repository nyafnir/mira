import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CacheType,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  Interaction,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  SelectMenuComponentOptionData,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  User,
  // PermissionFlagsBits,
} from 'discord.js'
import { Repository } from 'sequelize-typescript'

import { dbService } from '@services/database'
import { BaseCommand } from '@commands/base'
import { getDiscordGuildMember, getDiscordRole, parseJSON } from '@utils'

import { RoleReactionEntity } from './role-reaction.entity'
import { roleReactionInfo } from './role-reaction.info'

export class RoleReactionCommand extends BaseCommand {
  static info = roleReactionInfo
  info = RoleReactionCommand.info

  private readonly roleReactionRepository: Repository<RoleReactionEntity>

  constructor(client: Client) {
    super()

    this.cooldown.seconds = 2

    dbService.sequelize.addModels([RoleReactionEntity])
    this.roleReactionRepository =
      dbService.sequelize.getRepository(RoleReactionEntity)

    this.setClientListeners(client)
  }

  private setClientListeners(client: Client) {
    client.on('messageReactionAdd', async (reaction, user) => {
      const { roleReaction, guildMember } = await this.prepareMessageReaction(
        reaction,
        user,
      )
      if (
        !roleReaction ||
        !guildMember ||
        guildMember.roles.cache.has(roleReaction.roleId)
      ) {
        return
      }
      await guildMember.roles.add(roleReaction.roleId)
    })
    client.on('messageReactionRemove', async (reaction, user) => {
      const { roleReaction, guildMember } = await this.prepareMessageReaction(
        reaction,
        user,
      )
      if (
        !roleReaction ||
        !guildMember ||
        !guildMember.roles.resolveId(roleReaction.roleId)
      ) {
        return
      }
      await guildMember.roles.remove(roleReaction.roleId)
    })
    client.on(
      'interactionCreate',
      async (interaction: Interaction<CacheType>) => {
        if (!(interaction.isStringSelectMenu() || interaction.isButton())) {
          return
        }

        const data: { commandName: string; methodName: string } = parseJSON(
          interaction.customId,
        )
        if (!data || data.commandName !== this.info.title) {
          return
        }

        const answer = await this[data.methodName](interaction, data)
        if (answer) {
          await Promise.all([
            interaction.deferUpdate({ fetchReply: false }),
            interaction.message.edit(answer),
          ])
        }
      },
    )
  }

  private async prepareMessageReaction(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
  ) {
    if (!reaction.message.guild) {
      return
    }

    if (reaction.partial) {
      try {
        await reaction.fetch()
      } catch {
        return
      }
    }

    const emoji = reaction.emoji.toString()

    const roleReaction = await this.roleReactionRepository.findOne({
      where: {
        guildId: reaction.message.guild.id,
        channelId: reaction.message.channelId,
        messageId: reaction.message.id,
        reaction: emoji,
      },
    })
    if (!roleReaction) {
      return
    }

    const guildMember = await getDiscordGuildMember(
      user.id,
      reaction.message.guild,
    )
    if (!guildMember) {
      return
    }

    return { roleReaction, guildMember }
  }

  public async list(
    interaction: ChatInputCommandInteraction<CacheType>,
    data = { pageNumber: 1 },
  ) {
    const limitPerPage = 10
    const { pageNumber } = data

    const list = await this.roleReactionRepository.findAll({
      where: { guildId: interaction.guildId },
      limit: limitPerPage,
      offset: limitPerPage * (pageNumber - 1),
    })
    const countElements = await this.roleReactionRepository.count({
      where: { guildId: interaction.guildId },
    })
    const countPages = Math.ceil(countElements / limitPerPage) || 1
    const description =
      list
        .map(
          (rr) =>
            `[${rr.reaction} <@&${rr.roleId}> в канале <#${rr.channelId}>](https://discord.com/channels/${rr.guildId}/${rr.channelId}/${rr.messageId}) 🆔 \`${rr.messageId}\``,
        )
        .join('\n') || 'Ничего нет'

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Список отслеживаемых реакций к сообщениям')
      .setDescription(description)
      .setFooter({
        text: `Страница: ${pageNumber}/${countPages}`,
      })

    const rowButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setLabel('Предыдущая страница')
        .setDisabled(pageNumber === 1)
        .setCustomId(
          JSON.stringify({
            commandName: this.info.title,
            methodName: 'list',
            pageNumber: pageNumber - 1,
          }),
        ),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setLabel('Следующая страница')
        .setDisabled(pageNumber === countPages)
        .setCustomId(
          JSON.stringify({
            commandName: this.info.title,
            methodName: 'list',
            pageNumber: pageNumber + 1,
          }),
        ),
    )

    return {
      embeds: [embed],
      components: [rowButtons],
    }
  }

  public async set(interaction: ChatInputCommandInteraction<CacheType>) {
    const guildId = interaction.guildId
    const messageId = interaction.options.getString('message_id', true)
    const reaction = interaction.options.getString('reaction', true)
    const roleId = interaction.options.getRole('role', true).id
    const channelId =
      interaction.options.getChannel('channel', false)?.id ||
      interaction.channelId

    const channel = await interaction.guild.channels.fetch(channelId)
    if (!channel.isTextBased()) {
      return { content: 'поддерживаются только текстовые каналы' }
    }

    const message = await channel.messages.fetch(messageId)
    await message.react(reaction)

    await this.roleReactionRepository.upsert(
      {
        guildId,
        channelId,
        messageId,
        roleId,
        reaction,
        creatorId: interaction.member.user.id,
      },
      {
        returning: false,
      },
    )

    const embed = new EmbedBuilder()
      .setColor(0x80c321)
      .setTitle('Добавлена реакция-роль')
      .setDescription(
        `${reaction} <@&${roleId}> - [в канале <#${channelId}>](https://discord.com/channels/${guildId}/${channelId}/${messageId})`,
      )

    return {
      embeds: [embed],
    }
  }

  public async del(interaction: ChatInputCommandInteraction<CacheType>) {
    const guildId = interaction.guildId
    const messageId = interaction.options.getString('message_id', true)
    const channelId =
      interaction.options.getChannel('channel', false)?.id ||
      interaction.channelId

    const roleReactionArray = await this.roleReactionRepository.findAll({
      where: {
        guildId,
        messageId,
        channelId,
      },
    })
    if (!roleReactionArray.length) {
      return { content: `<@${interaction.member.user.id}>, ничего не найдено` }
    }

    const selectMenuOptions: SelectMenuComponentOptionData[] =
      await Promise.all(
        roleReactionArray.map(async (rr) => ({
          emoji: rr.reaction,
          label:
            (await getDiscordRole(rr.roleId, interaction.guild.roles))?.name ||
            '???',
          description: `🆔 ${rr.roleId}`,
          value: rr.id.toString(),
        })),
      )

    const rowMultiSelect = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(
          JSON.stringify({
            commandName: this.info.title,
            methodName: 'delSelect',
            messageId,
          }),
        )
        .setPlaceholder('Ничего не выбрано')
        .addOptions(selectMenuOptions)
        .setMaxValues(selectMenuOptions.length),
    )

    const embed = new EmbedBuilder()
      .setColor(0xf85f5a)
      .setTitle('Что удалить?')
      .setDescription(`🆔 ${messageId}`)

    return {
      embeds: [embed],
      components: [rowMultiSelect],
    }
  }

  private async delSelect(
    interaction: StringSelectMenuInteraction<CacheType>,
    data: { messageId: string },
  ) {
    const values = interaction.values

    await this.roleReactionRepository.destroy({
      where: { id: values },
    })

    const embed = new EmbedBuilder()
      .setColor(0xf85f5a)
      .setTitle(`🆔 ${data.messageId}`)
      .setDescription(`Удалено отслеживание реакций: ${values.length}`)

    return {
      embeds: [embed],
      components: [],
    }
  }
}
