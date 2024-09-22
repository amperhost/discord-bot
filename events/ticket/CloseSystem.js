// Import required modules
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
} = require('discord.js')
const transcript = require('discord-html-transcripts')

require('dotenv').config()

module.exports = {
  name: 'interactionCreate',
  once: false,
  execute: async (interaction, client) => {
    // Check if the interaction is a button
    if (!interaction.isButton()) return

    // Handle ticket closure
    if (interaction.customId === 'close') {
      // Prompt for saving logs
      interaction.channel.send({
        embeds: [
          {
            title: 'Pytanie',
            description: 'Czy chcesz zapisać logi tego ticketa?',
            color: Colors.Blurple,
            footer: {
              text: '© 2024 AmperHost',
              iconURL: client.user.displayAvatarURL(),
            },
          },
        ],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('yes')
              .setLabel('Tak')
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId('no')
              .setLabel('Nie')
              .setStyle(ButtonStyle.Danger),
          ),
        ],
      })
    } else if (interaction.customId === 'yes') {
      // Save ticket logs to the designated channel
      const ticketLogsChannel = client.channels.cache.get(
        process.env.TICKET_LOGS,
      )

      await ticketLogsChannel.send({
        embeds: [
          {
            title: 'Zgłoszenia',
            description: `Ticket **${interaction.channel.name}** został zamknięty przez ${interaction.user}.\nPowyżej znajdują się jego logi!`,
            color: Colors.Blurple,
            footer: {
              text: '© 2024 AmperHost',
              iconURL: client.user.displayAvatarURL(),
            },
          },
        ],
        files: [await transcript.createTranscript(interaction.channel)],
      })

      // Send closure confirmation message
      await interaction.channel.send({
        embeds: [
          {
            title: 'Zgłoszenia',
            description: `Ticket został zamknięty przez ${interaction.user}.`,
            color: Colors.Blurple,
            footer: {
              text: '© 2024 AmperHost',
              iconURL: client.user.displayAvatarURL(),
            },
          },
        ],
      })

      // Delete the ticket channel
      await interaction.channel.delete()
    } else if (interaction.customId === 'no') {
      // Send closure confirmation message without saving logs
      await interaction.channel.send({
        embeds: [
          {
            title: 'Zgłoszenia',
            description: `Ticket został zamknięty przez ${interaction.user}.`,
            color: Colors.Blurple,
            footer: {
              text: '© 2024 AmperHost',
              iconURL: client.user.displayAvatarURL(),
            },
          },
        ],
      })

      // Delete the ticket channel
      await interaction.channel.delete()
    }
  },
}
