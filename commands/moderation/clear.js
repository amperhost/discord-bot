const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js')

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Usuwa wiadomości z kanału.')
        .addIntegerOption((option) =>
            option
                .setName('amount')
                .setDescription('Ilość wiadomości do usunięcia')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),

    async execute(interaction) {
        if (
            !interaction.member.permissions.has(
                PermissionFlagsBits.ManageMessages,
            )
        ) {
            return interaction.reply({
                content:
                    'Nie masz uprawnień do używania tej komendy (wymagane: **Zarządzanie wiadomościami**).',
                ephemeral: true,
            })
        }

        const { options, channel } = interaction
        const amountMessagesToDelete = options.getInteger('amount')

        await interaction.reply({
            content: `Rozpoczynam usuwanie **${amountMessagesToDelete}** wiadomości.`,
            ephemeral: true,
        })

        try {
            const messages = await channel.bulkDelete(
                amountMessagesToDelete,
                true,
            )
            await interaction.editReply(
                `Usunięto **${messages.size}** wiadomości.`,
            )
        } catch (error) {
            console.error(error)
            await interaction.editReply(
                'Wystąpił błąd podczas usuwania wiadomości.',
            )
        }
    },
}
