const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Pokazuje wszystkie dostępne komendy w bocie.'),
    async execute(interaction) {
        const random1 = Math.floor(Math.random() * 255)
        const random2 = Math.floor(Math.random() * 255)
        const random3 = Math.floor(Math.random() * 255)

        const embed = new EmbedBuilder()
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setTitle('Dostępne komendy')
            .setDescription(
                '**Ogólne:**\n```/botinfo, /help, /ping, /serverinfo, /status, /userinfo```\n\n' +
                    '**Moderacyjne:**\n```/clear, /embed, /maintenance, /online```',
            )
            .setTimestamp()
            .setColor([random1, random2, random3])

        await interaction.reply({ embeds: [embed] })
    },
}
