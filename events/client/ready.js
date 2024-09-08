const colors = require('colors')
const config = require('../../config.js')
const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js')

module.exports = {
    name: 'ready',
    once: false,
    execute: async (client) => {
        console.log(
            `[READY] ${client.user.tag} (${client.user.id}) jest gotowy!`.green,
        )

        let channelTicket = client.channels.cache.get(config.TICKET_CHANNEL)
        const color = parseInt('08f4ff', 16)

        const messages = await channelTicket.messages.fetch({ limit: 20 })

        const oldEmbedMessage = messages.find(
            (msg) =>
                msg.embeds.length > 0 && msg.embeds[0].title === 'Zgłoszenia',
        )

        if (oldEmbedMessage) {
            await oldEmbedMessage.delete()
            console.log('[INFO] Stary embed został usunięty.'.yellow)
        }

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('ticket_category')
            .setPlaceholder('Wybierz kategorię ticketa')
            .addOptions([
                {
                    label: 'Pomoc ogólna',
                    value: 'ogolne',
                    emoji: '🐛',
                },
                {
                    label: 'Płatności',
                    value: 'platnosci',
                    emoji: '💰',
                },
                {
                    label: 'Współpraca',
                    value: 'wspolpraca',
                    emoji: '💼',
                },
                {
                    label: 'Żadne z powyższych',
                    value: 'inne',
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

        console.log('[INFO] Nowy embed został wysłany.'.yellow)
    },
}
