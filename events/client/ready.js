const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js')
const { exec } = require('child_process')
const { GITHUB_CHANNEL, TICKET_CHANNEL } = require('../../config.js')

require('dotenv').config()

module.exports = {
  name: 'ready',
  once: false,
  execute: async (client) => {
    console.log(`[READY] Connected to websocket as ${client.user.tag}!`.green)

    let channelTicket = client.channels.cache.get(TICKET_CHANNEL)
    const color = parseInt('08f4ff', 16)
    const messages = await channelTicket.messages.fetch({ limit: 20 })
    const oldEmbedMessage = messages.find(
      (msg) => msg.embeds.length > 0 && msg.embeds[0].title === 'Zgłoszenia',
    )
    if (oldEmbedMessage) {
      await oldEmbedMessage.delete()
    }

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('ticket_category')
      .setPlaceholder('Wybierz kategorię ticketa')
      .addOptions([
        {
          label: 'Pomoc ogólna',
          value: 'general',
          emoji: '🐛',
        },
        {
          label: 'Płatności',
          value: 'payments',
          emoji: '💰',
        },
        {
          label: 'Współpraca',
          value: 'partnership',
          emoji: '💼',
        },
        {
          label: 'Żadne z powyższych',
          value: 'other',
          emoji: '📁',
        },
      ])

    await channelTicket.send({
      embeds: [
        {
          title: 'Zgłoszenia',
          description:
            '> Aby stworzyć zgłoszenie, kliknij przycisk poniżej. Pamiętaj, że na raz możesz mieć otwarty tylko jeden ticket! W tickecie prosimy o nie oznaczanie administracji.',
          color: color,
          footer: {
            text: '© 2024 AmperHost',
            iconURL: client.user.displayAvatarURL(),
          },
        },
      ],
      components: [new ActionRowBuilder().addComponents(selectMenu)],
    })

    setInterval(() => {
      exec(`git pull`, (error, stdout) => {
        let response = error || stdout
        if (!error) {
          if (!response.includes('Already up to date.')) {
            if (GITHUB_CHANNEL) {
              GITHUB_CHANNEL.send(
                `Automatyczny update z GitHuba, pobieram pliki.\n\`\`\`${response}\`\`\``,
              )
            }
            setTimeout(() => {
              process.exit()
            }, 1000)
          }
        }
      })
    }, 30000)
  },
}
