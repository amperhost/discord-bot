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
    if (!interaction.isButton()) return

    if (interaction.customId === 'close') {
      interaction.reply({
        content: `Ten ticket zostanie usunięty.`,
        ephemeral: true,
      })

      interaction.channel.send({
        embeds: [
          {
            title: 'Pytanie',
            description:
              'Ten ticket zostanie usunięty. Czy chcesz zapisać jego logi?',
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

      await interaction.channel.delete()
    } else if (interaction.customId === 'no') {
      interaction.channel.send({
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

      await interaction.channel.delete()
    }
  },
}
