const {
    ActionRowBuilder,
    ChannelType,
    Colors,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits,
} = require('discord.js')

require('dotenv').config()

module.exports = {
    name: 'interactionCreate',
    once: false,
    execute: async (interaction, client) => {
        if (!interaction.isStringSelectMenu()) return
        if (interaction.customId !== 'ticket_category') return

        const supportTeamId = process.env.SUPPORT_TEAM
        const blacklistRoleId = process.env.BLACKLIST_ROLE
        const color = parseInt('08f4ff', 16)

        if (interaction.member.roles.cache.has(blacklistRoleId)) {
            return interaction.reply({
                content:
                    ':x: | Nie masz uprawnień do tworzenia ticketów, ponieważ jesteś na blackliście!',
                ephemeral: true,
            })
        }

        const existingTicketChannel = interaction.guild.channels.cache.find(
            (c) => c.topic === interaction.user.id,
        )
        if (existingTicketChannel) {
            return interaction.reply({
                content: ':x: | Posiadasz już otwarte zgłoszenie!',
                ephemeral: true,
            })
        }

        const createTicketChannel = async (type) => {
            interaction.guild.channels
                .create({
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
                .then((channel) => {
                    channel.send({
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

                    channel
                        .send({
                            content: `${interaction.user} <@${supportTeamId}>`,
                        })
                        .then((msg) => {
                            setTimeout(() => {
                                msg.delete(), 1000
                            })
                        })
                })
        }

        let ticket_type = ''
        switch (interaction.values[0]) {
            case 'ogolne':
                await createTicketChannel('Pomoc ogólna')
                ticket_type = 'Pomoc ogólna'
                break
            case 'platnosci':
                await createTicketChannel('Płatności')
                ticket_type = 'Płatności'
                break
            case 'wspolpraca':
                await createTicketChannel('Współpraca')
                ticket_type = 'Współpraca'
                break
            case 'inne':
                await createTicketChannel('Żadne z powyższych')
                ticket_type = 'Żadne z powyższych'
                break
        }

        await interaction.reply({
            content: `:white_check_mark: | Zgłoszenie zostało utworzone w kategorii **${ticket_type}**!`,
            ephemeral: true,
        })
    },
}
