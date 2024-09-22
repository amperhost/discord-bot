// Import required modules
const {
  ActionRowBuilder,
  ChannelType,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require('discord.js')

require('dotenv').config()

module.exports = {
  name: 'interactionCreate',
  once: false,
  execute: async (interaction, client) => {
    // Check if the interaction is a string select menu and has the correct customId
    if (
      !interaction.isStringSelectMenu() ||
      interaction.customId !== 'ticket_category'
    )
      return

    const supportTeamId = process.env.SUPPORT_TEAM
    const blacklistRoleId = process.env.BLACKLIST_ROLE
    const color = parseInt('08f4ff', 16) // Ticket embed color

    // Check if the user is blacklisted
    if (interaction.member.roles.cache.has(blacklistRoleId)) {
      return interaction.reply({
        content:
          '❌ | Nie masz uprawnień do tworzenia ticketów, ponieważ jesteś na blackliście!',
        ephemeral: true,
      })
    }

    // Check if the user already has an open ticket
    const existingTicketChannel = interaction.guild.channels.cache.find(
      (c) => c.topic === interaction.user.id,
    )
    if (existingTicketChannel) {
      return interaction.reply({
        content: '❌ | Posiadasz już otwarte zgłoszenie!',
        ephemeral: true,
      })
    }

    // Function to create a new ticket channel
    const createTicketChannel = async (type) => {
      const channel = await interaction.guild.channels.create({
        name: `💼︱${interaction.user.username}`,
        topic: interaction.user.id,
        type: ChannelType.GuildText,
        parent: process.env.TICKET_CATEGORY,
        permissionOverwrites: [
          {
            id: interaction.user.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.ReadMessageHistory,
              PermissionFlagsBits.SendMessages,
            ],
            deny: [PermissionFlagsBits.MentionEveryone],
          },
          {
            id: supportTeamId,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.ReadMessageHistory,
              PermissionFlagsBits.SendMessages,
            ],
            deny: [PermissionFlagsBits.MentionEveryone],
          },
          {
            id: interaction.guild.id,
            deny: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.ReadMessageHistory,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.MentionEveryone,
            ],
          },
        ],
      })

      // Send initial message in the ticket channel
      await channel.send({
        embeds: [
          {
            title: 'Zgłoszenia',
            description: `**🩵 Zgłoszenie użytkownika ${interaction.user} zostało pomyślnie utworzone!** \n\nDziękujemy za zgłoszenie, nasz zespół zajmie się Twoim problemem w możliwie najkrótszym czasie.\n\n- \`Typ zgłoszenia:\` **${type}**\n\n**Uwaga!** Nie pinguj administracji, ponieważ może to skutkować karą wyciszenia.`,
            color: color,
            footer: {
              text: '© 2024 AmperHost',
              iconURL: client.user.displayAvatarURL(),
            },
          },
        ],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('close')
              .setLabel('Zamknij')
              .setStyle(ButtonStyle.Danger),
          ),
        ],
      })

      // Notify support team
      const msg = await channel.send({
        content: `${interaction.user} <@${supportTeamId}>`,
      })
      setTimeout(() => msg.delete(), 1000) // Delete notification after 1 second
    }

    // Determine ticket type based on selected value
    let ticketType = ''
    switch (interaction.values[0]) {
      case 'general':
        ticketType = 'Pomoc ogólna'
        break
      case 'payments':
        ticketType = 'Płatności'
        break
      case 'partnership':
        ticketType = 'Współpraca'
        break
      case 'other':
        ticketType = 'Żadne z powyższych'
        break
    }

    // Create the ticket channel
    await createTicketChannel(ticketType)

    // Send confirmation reply
    await interaction.reply({
      content: `✅ | Zgłoszenie zostało utworzone w kategorii **${ticketType}**!`,
      ephemeral: true,
    })
  },
}
