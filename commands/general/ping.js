const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Sprawdza opóźnienie bota.'),

    async execute(interaction) {
        await interaction.deferReply()
        const reply = await interaction.fetchReply()
        const ping = reply.createdTimestamp - interaction.createdTimestamp

        const random1 = Math.floor(Math.random() * 255)
        const random2 = Math.floor(Math.random() * 255)
        const random3 = Math.floor(Math.random() * 255)

        const embed = new EmbedBuilder()
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setDescription(
                `Pong! :ping_pong:\nClient: **${ping}ms** | Websocket: **${interaction.client.ws.ping}ms**`,
            )
            .setTimestamp()
            .setColor([random1, random2, random3])

        await interaction.editReply({ embeds: [embed] })
    },
}
