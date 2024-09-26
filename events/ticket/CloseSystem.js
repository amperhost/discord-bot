// Import required modules
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
} = require('discord.js')
const transcript = require('discord-html-transcripts')
const { TICKET_LOGS } = require('../../config.js')

require('dotenv').config()

module.exports = {
  name: 'interactionCreate',
  once: false,
  execute: async (interaction, client) => {
    // Check if the interaction is a button
    if (!interaction.isButton()) return

    // Handle ticket closure
    if (interaction.customId === 'close') {
      // Automatically save ticket logs to the designated channel
      await client.channels.cache.get(TICKET_LOGS).send({
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

      // Send closure confirmation message with 5-second delay before channel deletion
      await interaction.channel.send({
        embeds: [
          {
            title: 'Zgłoszenia',
            description: `Ticket zostanie automatycznie zamknięty za 5 sekund.`,
            color: Colors.Blurple,
            footer: {
              text: '© 2024 AmperHost',
              iconURL: client.user.displayAvatarURL(),
            },
          },
        ],
      })

      // Wait for 5 seconds
      setTimeout(async () => {
        await interaction.channel.delete()
      }, 5000)
    }
  },
}
